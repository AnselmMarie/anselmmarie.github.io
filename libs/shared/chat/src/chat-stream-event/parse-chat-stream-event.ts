import { z } from 'zod';

import type { ChatStreamEvent } from './chat-stream-event.js';

/**
 * One NDJSON line's shape (ai-chat D11), so the browser validates every event
 * the stream carries before it touches the transcript (Slice 5).
 *
 * A `tool-call`'s `input` stays `unknown` here: the browser re-validates it
 * against the tool's own schema before it moves the page (B3), so this only
 * checks that the tool is one of the two that exist.
 */
const chatStreamEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text-delta'), text: z.string() }),
  z.object({
    type: z.literal('tool-call'),
    name: z.enum(['scroll_to', 'navigate']),
    input: z.unknown(),
  }),
  z.object({ type: z.literal('done') }),
  z.object({ type: z.literal('resting'), reason: z.enum(['ip', 'global']) }),
  z.object({ type: z.literal('disabled') }),
  z.object({ type: z.literal('blocked') }),
  z.object({ type: z.literal('error'), code: z.string() }),
]);

/** A parsed line as a contract event, or `null` when it isn't one. Never throws. */
export const parseChatStreamEvent = (value: unknown): ChatStreamEvent | null => {
  const parsed = chatStreamEventSchema.safeParse(value);
  return parsed.success ? (parsed.data as ChatStreamEvent) : null;
};
