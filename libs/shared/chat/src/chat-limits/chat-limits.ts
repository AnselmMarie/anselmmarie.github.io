/**
 * A4's request caps, stated once so the composer's `maxLength` and the
 * Lambda's zod schema (Slice 3) can't disagree.
 */

/** The longest single visitor message, in characters. */
export const CHAT_MAX_MESSAGE_CHARS = 500;

/** The most turns of history a request may carry. */
export const CHAT_MAX_TURNS = 12;

/** The longest whole conversation a request may carry, in characters. */
export const CHAT_MAX_TOTAL_CHARS = 6000;
