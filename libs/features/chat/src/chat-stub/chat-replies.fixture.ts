/**
 * ⚠️ **PLACEHOLDER DATA, deleted in Slice 5** (plan-flow-order, Flow B). Read
 * only through `use-chat-stub.ts`.
 *
 * The four answers are the design's sample exchange (ai-chat design.md), so
 * the stub sounds like the tone the B1 system prompt aims for. The keywords
 * and the fallback are invented for the stub.
 */
export interface ChatStubReply {
  /** Lowercase fragments; the first reply with any match in the question wins. */
  readonly keywords: readonly string[];
  readonly reply: string;
}

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
