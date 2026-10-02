/**
 * The chat's wire format, shared by the browser and the Lambda (ai-chat D11).
 *
 * ⚠️ **Types only, for now.** The plan's Wave 0 also puts the zod schemas
 * here; they arrive with the first slice that validates at runtime (Slice 2's
 * tool-call re-validation, Slice 3's request caps), together with the `zod`
 * dependency. Slice 1 only needs the shapes its stub emits.
 */

/** Who wrote a turn. A `system` role is never accepted from a client (A4). */
export type ChatRole = 'user' | 'assistant';

/** One turn of the conversation, as the client sends it each request (D5). */
export interface ChatTurn {
  readonly role: ChatRole;
  readonly content: string;
}

/** The two tools the model has (D10). Their inputs are validated in the browser. */
export type ChatToolName = 'scroll_to' | 'navigate';

/** One NDJSON line of a streamed reply. See architecture.md, *Stream protocol*. */
export type ChatStreamEvent =
  | { readonly type: 'text-delta'; readonly text: string }
  | { readonly type: 'tool-call'; readonly name: ChatToolName; readonly input: unknown }
  | { readonly type: 'done' }
  | { readonly type: 'resting'; readonly reason: 'ip' | 'global' }
  | { readonly type: 'disabled' }
  | { readonly type: 'blocked' }
  | { readonly type: 'error'; readonly code: string };

export type ChatStreamEventType = ChatStreamEvent['type'];
