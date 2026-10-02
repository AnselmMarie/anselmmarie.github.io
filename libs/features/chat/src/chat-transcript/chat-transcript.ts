import type { ChatRole, ChatStreamEvent } from '@portfolio/shared-chat-contract';

/** One bubble in the drawer. */
export interface ChatMessage {
  readonly id: string;
  readonly role: ChatRole;
  readonly text: string;
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
 * Folds one stream event into the transcript. Only `text-delta` changes the
 * text: it grows the last bubble when that bubble is the assistant's. Every
 * other event leaves the messages as they are, and returns the same array, so
 * React skips the render.
 */
export const applyChatEvent = (
  messages: readonly ChatMessage[],
  event: ChatStreamEvent
): readonly ChatMessage[] => {
  const last = messages.at(-1);
  if (event.type !== 'text-delta' || last?.role !== 'assistant') return messages;

  return [...messages.slice(0, -1), { ...last, text: last.text + event.text }];
};

/** Whether an event ends the turn, so the composer can send again. */
export const isTurnEnd = (event: ChatStreamEvent): boolean =>
  event.type !== 'text-delta' && event.type !== 'tool-call';
