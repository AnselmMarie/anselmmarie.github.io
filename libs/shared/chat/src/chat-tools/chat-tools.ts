import { z } from 'zod';

import { PORTFOLIO_ITEMS, SECTION_IDS } from '@portfolio/shared-fixtures';

import type { ChatToolName } from '../chat-stream-event/chat-stream-event.js';

/**
 * The two tools' inputs (ai-chat D10, guardrail B3), as zod schemas both halves
 * read: Slice 3 hands them to Bedrock as the tool specs, and the browser
 * re-validates every `tool-call` against them before it moves the page.
 *
 * ⚠️ **Enums only, built from the fixtures.** A section or slug the site
 * doesn't have can't pass, so even a jailbroken model can only point at a page
 * that exists. `strictObject` rejects extra fields for the same reason.
 */
const toEnum = (values: readonly string[]): [string, ...string[]] => {
  const [first, ...rest] = values;
  if (first === undefined) throw new Error('A chat tool enum needs at least one value');
  return [first, ...rest];
};

/** Every homepage section the chat may scroll to. */
export const CHAT_SECTION_IDS: readonly string[] = Object.values(SECTION_IDS);

/** Every `/portfolio/$slug` page the chat may open. */
export const CHAT_PORTFOLIO_SLUGS: readonly string[] = PORTFOLIO_ITEMS.map((item) => item.slug);

export const scrollToInputSchema = z.strictObject({
  sectionId: z.enum(toEnum(CHAT_SECTION_IDS)),
});

export const navigateInputSchema = z.strictObject({
  slug: z.enum(toEnum(CHAT_PORTFOLIO_SLUGS)),
});

/** A tool call that passed validation, flattened to what the browser needs. */
export type ChatToolCall =
  | { readonly name: 'scroll_to'; readonly sectionId: string }
  | { readonly name: 'navigate'; readonly slug: string };

/**
 * Validates a tool call from the stream. Anything that isn't one of the two
 * tools with a valid input returns `null`, and the caller ignores it (B3).
 */
export const parseChatToolCall = (
  name: ChatToolName | string,
  input: unknown
): ChatToolCall | null => {
  if (name === 'scroll_to') {
    const parsed = scrollToInputSchema.safeParse(input);
    return parsed.success ? { name, sectionId: parsed.data.sectionId } : null;
  }
  if (name === 'navigate') {
    const parsed = navigateInputSchema.safeParse(input);
    return parsed.success ? { name, slug: parsed.data.slug } : null;
  }

  return null;
};
