import { useCallback, useEffect, useRef, useState } from 'react';

import type { ChatStreamEvent } from '@portfolio/shared-chat-contract';

import { CHAT_GREETING } from '../chat-copy/chat-copy.const.js';
import {
  applyChatEvent,
  type ChatMessage,
  type ChatSession,
  isTurnEnd,
  startTurn,
} from '../chat-transcript/chat-transcript.js';
import { CHAT_STUB_FALLBACK, CHAT_STUB_REPLIES } from './chat-replies.fixture.js';

/** How often the stub emits a delta, and how much text each one carries. */
export const STUB_TICK_MS = 30;
export const STUB_CHARS_PER_TICK = 4;

const INITIAL_MESSAGES: readonly ChatMessage[] = [
  { id: 'greeting', role: 'assistant', text: CHAT_GREETING },
];

/** The scripted answer to a question: the first keyword match, or the fallback. */
export const pickStubReply = (question: string): string => {
  const lowered = question.toLowerCase();
  const match = CHAT_STUB_REPLIES.find((entry) =>
    entry.keywords.some((keyword) => lowered.includes(keyword))
  );

  return match?.reply ?? CHAT_STUB_FALLBACK;
};

/** A reply as the contract-shaped events the real stream will send (D11). */
export const toStubEvents = (reply: string): readonly ChatStreamEvent[] => {
  const deltas: ChatStreamEvent[] = [];
  for (let start = 0; start < reply.length; start += STUB_CHARS_PER_TICK) {
    deltas.push({ type: 'text-delta', text: reply.slice(start, start + STUB_CHARS_PER_TICK) });
  }

  return [...deltas, { type: 'done' }];
};

/**
 * ⚠️ **STUB, replaced in Slice 5 by `use-chat`**, which returns the same
 * `ChatSession`. No network: each send plays a scripted reply from
 * `chat-replies.fixture.ts` as `text-delta` events on a timer, so the drawer
 * renders a growing bubble the way it will against Bedrock.
 *
 * A send while a reply is still playing is ignored (invented; the design
 * doesn't say).
 */
const useChatStub = (): ChatSession => {
  const [messages, setMessages] = useState<readonly ChatMessage[]>(INITIAL_MESSAGES);
  const [isStreaming, setIsStreaming] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const turnCount = useRef(0);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);

  useEffect(() => stop, [stop]);

  const send = useCallback(
    (text: string) => {
      if (timer.current) return;

      turnCount.current += 1;
      setMessages((previous) => startTurn(previous, text, `turn-${turnCount.current}`));
      setIsStreaming(true);

      const queue = [...toStubEvents(pickStubReply(text))];
      timer.current = setInterval(() => {
        const event = queue.shift();
        if (!event) return;

        setMessages((previous) => applyChatEvent(previous, event));
        if (isTurnEnd(event)) {
          stop();
          setIsStreaming(false);
        }
      }, STUB_TICK_MS);
    },
    [stop]
  );

  return { messages, isStreaming, send };
};

export default useChatStub;
