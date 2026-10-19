import { type ChatStreamEvent, type ChatTurn, chatRequestSchema } from '@portfolio/shared-chat';

import type { ChatReplyEvent } from '../bedrock-stream/bedrock-stream.js';
import { type ChatUsage, usageCostMicroUsd } from '../chat-model/chat-model.js';
import { type ChatQuota, hashIp } from '../quota/quota.js';

export interface ChatDeps {
  readonly isEnabled: () => Promise<boolean>;
  readonly quota: ChatQuota;
  readonly streamReply: (turns: readonly ChatTurn[]) => AsyncIterable<ChatReplyEvent>;
  readonly now: () => Date;
  readonly onError: (message: string, error: unknown) => void;
}

export interface ChatRequestInput {
  readonly body: string | undefined;
  readonly ip: string;
}

export interface ChatResponse {
  readonly statusCode: number;
  readonly events: AsyncIterable<ChatStreamEvent>;
}

const respond = (statusCode: number, ...events: ChatStreamEvent[]): ChatResponse => ({
  statusCode,
  events: (async function* () {
    yield* events;
  })(),
});

const parseBody = (body: string | undefined): unknown => {
  try {
    return JSON.parse(body ?? '');
  } catch {
    return undefined;
  }
};

/**
 * Relays the model's events and adds the reply's cost to the A5 counters when
 * its usage arrives. Usage is never sent to the browser, and a failed write is
 * logged rather than cutting off a reply that already cost its tokens.
 */
const relayEvents = async function* (
  turns: readonly ChatTurn[],
  ipHash: string,
  deps: ChatDeps
): AsyncGenerator<ChatStreamEvent> {
  const recordUsage = (usage: ChatUsage) =>
    deps.quota
      .record(ipHash, usageCostMicroUsd(usage), deps.now())
      .catch((error: unknown) => deps.onError('quota record failed', error));

  for await (const event of deps.streamReply(turns)) {
    if (event.type === 'usage') await recordUsage(event.usage);
    else yield event;
  }
};

/** Ends the stream on a generic `error` if Bedrock fails, mid-stream or before it. */
const relayReply = async function* (
  turns: readonly ChatTurn[],
  ipHash: string,
  deps: ChatDeps
): AsyncGenerator<ChatStreamEvent> {
  try {
    yield* relayEvents(turns, ipHash, deps);
  } catch (error) {
    deps.onError('bedrock stream failed', error);
    yield { type: 'error', code: 'upstream' };
  }
};

/**
 * The chat endpoint, in the order guardrails.md fixes. WAF's challenge (A1) and
 * rate rule (A2) have already run at CloudFront. Every rejection below happens
 * **before** Bedrock is called, so it costs a Lambda invocation and nothing else.
 *
 * 1. Kill switch (A7) → `disabled`
 * 2. zod caps and roles (A4) → 400
 * 3. Per-IP and global quota (A5) → `resting`. An unreadable quota fails closed.
 * 4. Bedrock, with B1–B4 applied, streamed back as NDJSON events
 * 5. The reply's cost added to both counters (A5)
 */
export const handleChat = async (
  input: ChatRequestInput,
  deps: ChatDeps
): Promise<ChatResponse> => {
  if (!(await deps.isEnabled())) return respond(200, { type: 'disabled' });

  const request = chatRequestSchema.safeParse(parseBody(input.body));
  if (!request.success) return respond(400, { type: 'error', code: 'bad-request' });

  const ipHash = hashIp(input.ip);
  let exhausted: Awaited<ReturnType<ChatQuota['check']>>;
  try {
    exhausted = await deps.quota.check(ipHash, deps.now());
  } catch (error) {
    deps.onError('quota check failed', error);
    return respond(503, { type: 'error', code: 'unavailable' });
  }
  if (exhausted) return respond(200, { type: 'resting', reason: exhausted });

  return { statusCode: 200, events: relayReply(request.data.messages, ipHash, deps) };
};
