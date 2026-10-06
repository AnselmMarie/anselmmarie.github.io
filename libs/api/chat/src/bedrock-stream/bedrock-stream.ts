import {
  type BedrockRuntimeClient,
  ConverseStreamCommand,
  type ConverseStreamOutput,
} from '@aws-sdk/client-bedrock-runtime';

import { type ChatStreamEvent, type ChatTurn, parseChatToolCall } from '@portfolio/shared-chat';

import { CHAT_MAX_OUTPUT_TOKENS, CHAT_MODEL_ID, type ChatUsage } from '../chat-model/chat-model.js';
import { CHAT_TOOL_CONFIG } from './chat-tool-config.js';
import { toBedrockMessages } from './to-bedrock-messages.js';

export interface ChatGuardrail {
  readonly id: string;
  readonly version: string;
}

interface ChatReplyRequest {
  readonly bedrock: Pick<BedrockRuntimeClient, 'send'>;
  readonly systemPrompt: string;
  readonly guardrail: ChatGuardrail;
  readonly turns: readonly ChatTurn[];
}

/** A wire event, or the usage the handler adds to the A5 counters (never sent). */
export type ChatReplyEvent =
  | ChatStreamEvent
  | { readonly type: 'usage'; readonly usage: ChatUsage };

/** Tool input arrives as JSON split across deltas, keyed by content block. */
type ToolBuffers = Map<number, { readonly name: string; readonly json: string }>;

const toolCallEvent = (name: string, json: string): ChatStreamEvent | null => {
  let input: unknown;
  try {
    input = JSON.parse(json || '{}');
  } catch {
    return null;
  }
  // B3: the server drops an invalid call too, not only the browser.
  const call = parseChatToolCall(name, input);
  if (!call) return null;
  return call.name === 'scroll_to'
    ? { type: 'tool-call', name: call.name, input: { sectionId: call.sectionId } }
    : { type: 'tool-call', name: call.name, input: { slug: call.slug } };
};

const STREAM_ERRORS = [
  'internalServerException',
  'modelStreamErrorException',
  'serviceUnavailableException',
  'throttlingException',
  'validationException',
] as const;

/** One Bedrock stream event → the events it produces (often none). */
const mapStreamEvent = (event: ConverseStreamOutput, tools: ToolBuffers): ChatReplyEvent[] => {
  const failure = STREAM_ERRORS.find(
    (key) => (event as unknown as Record<string, unknown>)[key] !== undefined
  );
  if (failure) throw new Error(`Bedrock stream failed: ${failure}`);

  const start = event.contentBlockStart;
  if (start?.start?.toolUse?.name) {
    tools.set(start.contentBlockIndex ?? 0, { name: start.start.toolUse.name, json: '' });
    return [];
  }

  const delta = event.contentBlockDelta;
  if (delta?.delta?.text) return [{ type: 'text-delta', text: delta.delta.text }];
  const index = delta?.contentBlockIndex ?? -1;
  const buffer = tools.get(index);
  if (buffer && delta?.delta?.toolUse?.input) {
    tools.set(index, { ...buffer, json: buffer.json + delta.delta.toolUse.input });
    return [];
  }

  const stop = event.contentBlockStop;
  const finished = tools.get(stop?.contentBlockIndex ?? -1);
  if (finished) {
    const call = toolCallEvent(finished.name, finished.json);
    return call ? [call] : [];
  }

  if (event.messageStop?.stopReason === 'guardrail_intervened') return [{ type: 'blocked' }];
  if (event.metadata?.usage) return [{ type: 'usage', usage: event.metadata.usage }];
  return [];
};

/**
 * Calls Bedrock's ConverseStream (D2, D6) with B1's prompt behind a cache
 * point, B2's guardrail, B3's two tools and B4's output cap, and yields the
 * contract's events as they arrive.
 *
 * ⚠️ **`blocked` arrives after text.** When the guardrail intervenes, Bedrock
 * streams the guardrail's own blocked message as text and then stops with
 * `guardrail_intervened`. The client (Slice 5) replaces that message with its
 * canned redirect when it sees `blocked`.
 *
 * Throws on a failed call or a stream error; the handler turns that into an
 * `error` event without the details.
 *
 * A generator has no arrow form, so this is a function *expression* bound to a
 * const, the nearest thing coding-conventions.md allows.
 */
export const streamChatReply = async function* ({
  bedrock,
  systemPrompt,
  guardrail,
  turns,
}: ChatReplyRequest): AsyncGenerator<ChatReplyEvent> {
  const response = await bedrock.send(
    new ConverseStreamCommand({
      modelId: CHAT_MODEL_ID,
      system: [{ text: systemPrompt }, { cachePoint: { type: 'default' } }],
      messages: toBedrockMessages(turns),
      toolConfig: CHAT_TOOL_CONFIG,
      inferenceConfig: { maxTokens: CHAT_MAX_OUTPUT_TOKENS },
      guardrailConfig: {
        guardrailIdentifier: guardrail.id,
        guardrailVersion: guardrail.version,
        // Sync: the guardrail checks each chunk before it streams, so a blocked
        // reply never reaches the browser half-written.
        streamProcessingMode: 'sync',
      },
    })
  );

  const tools: ToolBuffers = new Map();
  for await (const event of response.stream ?? []) yield* mapStreamEvent(event, tools);
  yield { type: 'done' };
};
