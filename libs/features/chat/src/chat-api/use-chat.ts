import { useCallback, useEffect, useRef, useState } from 'react';

import type { ChatStreamEvent } from '@portfolio/shared-chat';

import { CHAT_GREETING } from '../chat-copy/chat-copy.const.js';
import {
  applyChatEvent,
  type ChatMessage,
  type ChatSession,
  type ChatSessionOptions,
  isTurnEnd,
  startTurn,
  takeFailedTurn,
} from '../chat-transcript/chat-transcript.js';
import { CHAT_API_PATH, sha256Hex, toChatRequest } from './chat-request.js';
import { CHAT_WAF_SDK_URL, createWafFetchLoader } from './load-waf-fetch.js';
import { readChatStream } from './read-chat-stream.js';

const INITIAL_MESSAGES: readonly ChatMessage[] = [
  { id: 'greeting', role: 'assistant', text: CHAT_GREETING },
];

/** One loader per page: the WAF script is injected at the first send, once. */
const loadChatFetch = createWafFetchLoader(CHAT_WAF_SDK_URL);

/** What a reply that never sent an ending event becomes. */
const NO_ENDING: ChatStreamEvent = { type: 'error', code: 'network' };

/**
 * The chat's conversation, against the real `/api/chat` (ai-chat Slice 5).
 *
 * Each send POSTs the whole capped conversation (D5, A4) through the WAF
 * SDK's fetch (A1, D21), with the body's SHA-256 that Lambda's OAC requires
 * (D24), and folds the streamed events into the transcript as they arrive.
 *
 * - **A reply always ends.** A network failure, a non-NDJSON answer (a WAF
 *   challenge page) or a stream that stops without `done` ends the turn as an
 *   `error` reply, which offers a retry.
 * - **One reply at a time.** A send while one streams is ignored, as the stub
 *   did; the composer keeps the draft.
 * - `disabled` (A7) also sets `isDisabled`, which hides the launcher.
 * - Tool calls go to `onToolCall` as they arrive, unvalidated; the caller
 *   re-validates (B3).
 */
const useChat = ({ onToolCall }: ChatSessionOptions): ChatSession => {
  const [messages, setMessages] = useState<readonly ChatMessage[]>(INITIAL_MESSAGES);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const latest = useRef(messages);
  const isBusy = useRef(false);
  const turnCount = useRef(0);
  const abort = useRef<AbortController | null>(null);
  // The stream outlives a render, so it reads the latest callback through a ref.
  const toolCallHandler = useRef(onToolCall);

  useEffect(() => {
    latest.current = messages;
  }, [messages]);

  useEffect(() => {
    toolCallHandler.current = onToolCall;
  }, [onToolCall]);

  useEffect(() => () => abort.current?.abort(), []);

  const runTurn = useCallback(async (history: readonly ChatMessage[], text: string) => {
    isBusy.current = true;
    turnCount.current += 1;
    setIsStreaming(true);
    setMessages(startTurn(history, text, `turn-${turnCount.current}`));
    const controller = new AbortController();
    abort.current = controller;

    let hasEnded = false;
    const apply = (event: ChatStreamEvent) => {
      if (hasEnded) return;
      hasEnded = isTurnEnd(event);
      setMessages((previous) => applyChatEvent(previous, event));
      if (event.type === 'tool-call') toolCallHandler.current(event);
      if (event.type === 'disabled') setIsDisabled(true);
    };

    try {
      const body = JSON.stringify(toChatRequest(history, text));
      const chatFetch = await loadChatFetch();
      const response = await chatFetch(CHAT_API_PATH, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-amz-content-sha256': await sha256Hex(body),
        },
        body,
        signal: controller.signal,
      });
      await readChatStream(response, apply);
    } catch {
      // Ends below as an error reply, unless the drawer unmounted mid-reply.
    }
    if (controller.signal.aborted) return;

    apply(NO_ENDING);
    isBusy.current = false;
    setIsStreaming(false);
  }, []);

  const send = useCallback(
    (text: string) => {
      if (isBusy.current) return;
      void runTurn(latest.current, text);
    },
    [runTurn]
  );

  const retry = useCallback(() => {
    const failed = takeFailedTurn(latest.current);
    if (!failed || isBusy.current) return;
    void runTurn(failed.messages, failed.text);
  }, [runTurn]);

  return { messages, isStreaming, isDisabled, send, retry };
};

export default useChat;
