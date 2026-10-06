import { z } from 'zod';

import {
  CHAT_MAX_MESSAGE_CHARS,
  CHAT_MAX_TOTAL_CHARS,
  CHAT_MAX_TURNS,
} from '../chat-limits/chat-limits.js';

/**
 * The body of `POST /api/chat` (ai-chat D5, guardrail A4). The client sends the
 * whole conversation each turn; the Lambda validates it before anything else
 * runs, so a request that fails here costs no model call.
 *
 * ⚠️ **Only `user` and `assistant` roles.** A client that sends `system` is
 * trying to replace the scoped system prompt (B1), and `strictObject` rejects
 * any extra field for the same reason.
 *
 * ⚠️ **Assistant turns may be empty.** A reply that was only a tool call has
 * no text; the Lambda drops those turns before calling Bedrock rather than
 * making the client filter them.
 */
const chatTurnSchema = z.discriminatedUnion('role', [
  z.strictObject({
    role: z.literal('user'),
    content: z.string().trim().min(1).max(CHAT_MAX_MESSAGE_CHARS),
  }),
  z.strictObject({
    role: z.literal('assistant'),
    content: z.string().max(CHAT_MAX_TOTAL_CHARS),
  }),
]);

const totalChars = (turns: readonly { readonly content: string }[]): number =>
  turns.reduce((sum, turn) => sum + turn.content.length, 0);

export const chatRequestSchema = z.strictObject({
  messages: z
    .array(chatTurnSchema)
    .min(1)
    .max(CHAT_MAX_TURNS)
    .refine((turns) => turns.at(-1)?.role === 'user', {
      message: 'The last turn must be the visitor’s',
    })
    .refine((turns) => totalChars(turns) <= CHAT_MAX_TOTAL_CHARS, {
      message: `The conversation exceeds ${CHAT_MAX_TOTAL_CHARS} characters`,
    }),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
