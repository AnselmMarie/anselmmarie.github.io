import {
  type ChatRole,
  type ChatStreamEvent,
  parseChatToolCall,
} from '@portfolio/shared-chat-contract';

import type { ChatToolCallEvent } from '../chat-tools/chat-tool-action.js';
import { chatToolNote } from '../chat-tools/chat-tool-note.js';

/** One bubble in the drawer. */
export interface ChatMessage {
  readonly id: string;
  readonly role: ChatRole;
  readonly text: string;
  /** Where this reply moved the page, shown under the bubble ("→ WORK"). Slice 2. */
  readonly note?: string;
}

/**
 * What the drawer reads its conversation from (plan-flow-order's seam).
 * `use-chat-stub.ts` returns it now; Slice 5's real `use-chat` returns the
 * same shape, so swapping them is one import.
 */
export interface ChatSession {
  readonly messages: readonly ChatMessage[];
  /** True from a send until the reply's `done`. */
  readonly isStreaming: boolean;
  readonly send: (text: string) => void;
}

/** What the drawer hands the session hook. The stub and `use-chat` take the same. */
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
 *   moves nothing, so it gets no note.
 *
 * Every other event returns the same array, so React skips the render.
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

  return messages;
};

/** Whether an event ends the turn, so the composer can send again. */
export const isTurnEnd = (event: ChatStreamEvent): boolean =>
  event.type !== 'text-delta' && event.type !== 'tool-call';
