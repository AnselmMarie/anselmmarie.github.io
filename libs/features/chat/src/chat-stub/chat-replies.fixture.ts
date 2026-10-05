import type { ChatToolName } from '@portfolio/shared-chat-contract';

/**
 * ⚠️ **PLACEHOLDER DATA, deleted in Slice 5** (plan-flow-order, Flow B). Read
 * only through `use-chat-stub.ts`.
 *
 * The four answers in `CHAT_STUB_REPLIES` are the design's sample exchange
 * (ai-chat design.md), so the stub sounds like the tone the B1 system prompt
 * aims for. The keywords, the fallback and the tool replies are invented for
 * the stub.
 */
export interface ChatStubReply {
  /** Lowercase fragments; the first reply with any match in the question wins. */
  readonly keywords: readonly string[];
  readonly reply: string;
  /** A tool call played after the text, as the model would send one (Slice 2). */
  readonly toolCall?: { readonly name: ChatToolName; readonly input: unknown };
}

/**
 * Replies that move the page. Matched **before** `CHAT_STUB_REPLIES`, so
 * "show me the Cosmikata project" opens Cosmikata rather than answering
 * "project".
 */
export const CHAT_STUB_TOOL_REPLIES: readonly ChatStubReply[] = [
  {
    keywords: ['cosmikata'],
    reply: 'Cosmikata is his cosplay-planning platform. Opening it for you.',
    toolCall: { name: 'navigate', input: { slug: 'cosmikata' } },
  },
  {
    keywords: ['pokemon', 'pokémon', 'pet shop'],
    reply: 'That one is the Pokémon Pet Shop concept. Here it is.',
    toolCall: { name: 'navigate', input: { slug: 'pokemon-pet-shop' } },
  },
  {
    keywords: ['your work', 'show me', 'portfolio'],
    reply: 'Here is his selected work.',
    toolCall: { name: 'scroll_to', input: { sectionId: 'work' } },
  },
  {
    keywords: ['experience', 'career'],
    reply: 'Here is his experience, most recent first.',
    toolCall: { name: 'scroll_to', input: { sectionId: 'experience' } },
  },
];

export const CHAT_STUB_REPLIES: readonly ChatStubReply[] = [
  {
    keywords: ['project', 'kind of'],
    reply:
      'Mostly front-end architecture: design systems, micro-frontend platforms with Module Federation, and cross-platform apps on Expo and Next.js.',
  },
  {
    keywords: ['team', 'led ', 'manage'],
    reply:
      'Yes. At Cricket Wireless he led a 4-engineer team on an enterprise admin platform and raised throughput about 20%.',
  },
  {
    keywords: ['backend', 'back-end', 'api', 'server', 'database'],
    reply:
      'He designed an edge-first backend on Hono, PostgreSQL, and Drizzle for Cosmikata, with shared validation, auth, and background jobs.',
  },
  {
    keywords: ['hire', 'open to', 'available', 'contact', 'reach'],
    reply: 'He is. The best way to reach him is LinkedIn, linked in the contact section.',
  },
];

export const CHAT_STUB_FALLBACK =
  'I can tell you about Anselm’s projects, his experience, and how to get in touch. What would you like to know?';
