import { type ChatRole, type ChatStreamEvent, parseChatToolCall } from '@portfolio/shared-chat';

import {
  CHAT_BLOCKED,
  CHAT_DISABLED,
  CHAT_ERROR,
  CHAT_RESTING,
} from '../chat-copy/chat-copy.const.js';
import type { ChatToolCallEvent } from '../chat-tools/chat-tool-action.js';
import { chatToolNote } from '../chat-tools/chat-tool-note.js';

/** Why a reply is the client's words instead of the model's (Slice 5, invented). */
export type ChatStatus = 'resting' | 'disabled' | 'blocked' | 'error';

const STATUS_TEXT: Record<ChatStatus, string> = {
  resting: CHAT_RESTING,
  disabled: CHAT_DISABLED,
  blocked: CHAT_BLOCKED,
  error: CHAT_ERROR,
};

/** One bubble in the drawer. */
export interface ChatMessage {
  readonly id: string;
  readonly role: ChatRole;
  readonly text: string;
  /** Where this reply moved the page, shown under the bubble ("→ WORK"). Slice 2. */
  readonly note?: string;
  /** Set when the reply is a status instead of an answer. Never sent back to the model. */
  readonly status?: ChatStatus;
}

/** What the drawer reads its conversation from: `use-chat`'s return. */
export interface ChatSession {
  readonly messages: readonly ChatMessage[];
  /** True from a send until the reply ends, however it ends. */
  readonly isStreaming: boolean;
  /** True once a reply said the kill switch is off (A7). The launcher hides. */
  readonly isDisabled: boolean;
  readonly send: (text: string) => void;
  /** Resends the visitor's last message after an `error` reply. */
  readonly retry: () => void;
}

/** What the drawer hands the session hook. */
export interface ChatSessionOptions {
  /**
   * Fired for every `tool-call` event as it arrives, unvalidated. The caller
   * re-validates it before acting (B3).
   */
  readonly onToolCall: (event: ChatToolCallEvent) => void;
}

/** A visitor's message plus the empty assistant bubble its reply streams into. */
export const startTurn = (
  messages: readonly ChatMessage[],
  text: string,
  turnId: string
): readonly ChatMessage[] => [
  ...messages,
  { id: `${turnId}-user`, role: 'user', text },
  { id: `${turnId}-assistant`, role: 'assistant', text: '' },
];

/**
 * Folds one stream event into the transcript, changing only the last bubble and
 * only when it's the assistant's:
 *
 * - `text-delta` grows its text;
 * - a **valid** `tool-call` notes where the reply moved the page. An invalid one
 *   moves nothing, so it gets no note;
 * - `resting`, `disabled`, `blocked` and `error` **replace** its text with the
 *   client's own words and mark it. `blocked` arrives after B2 has streamed its
 *   message, and `error` can arrive mid-reply; either way the half-answer goes.
 *
 * `done` returns the same array, so React skips the render.
 */
export const applyChatEvent = (
  messages: readonly ChatMessage[],
  event: ChatStreamEvent
): readonly ChatMessage[] => {
  const last = messages.at(-1);
  if (last?.role !== 'assistant') return messages;

  if (event.type === 'text-delta') {
    return [...messages.slice(0, -1), { ...last, text: last.text + event.text }];
  }
  if (event.type === 'tool-call') {
    const call = parseChatToolCall(event.name, event.input);
    return call ? [...messages.slice(0, -1), { ...last, note: chatToolNote(call) }] : messages;
  }
  if (event.type !== 'done') {
    return [
      ...messages.slice(0, -1),
      { id: last.id, role: last.role, text: STATUS_TEXT[event.type], status: event.type },
    ];
  }

  return messages;
};

/** Whether an event ends the turn, so the composer can send again. */
export const isTurnEnd = (event: ChatStreamEvent): boolean =>
  event.type !== 'text-delta' && event.type !== 'tool-call';

/**
 * The visitor's last message and the transcript without its failed reply, for
 * a retry. `null` unless the last bubble is an `error` reply to a visitor's
 * message.
 */
export const takeFailedTurn = (
  messages: readonly ChatMessage[]
): { readonly messages: readonly ChatMessage[]; readonly text: string } | null => {
  const [question, reply] = messages.slice(-2);
  if (reply?.status !== 'error' || question?.role !== 'user') return null;

  return { messages: messages.slice(0, -2), text: question.text };
};
