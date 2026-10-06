import { ConverseStreamCommand, type ConverseStreamOutput } from '@aws-sdk/client-bedrock-runtime';
import { describe, expect, it, vi } from 'vitest';

import { CHAT_MAX_OUTPUT_TOKENS, CHAT_MODEL_ID } from '../chat-model/chat-model.js';
import { type ChatReplyEvent, streamChatReply } from './bedrock-stream.js';

const GUARDRAIL = { id: 'gr-1', version: '3' };
const TURNS = [{ role: 'user' as const, content: 'show me your work' }];

const bedrockStreaming = (events: ConverseStreamOutput[]) => ({
  send: vi.fn().mockResolvedValue({
    stream: (async function* () {
      yield* events;
    })(),
  }),
});

const collect = async (bedrock: ReturnType<typeof bedrockStreaming>): Promise<ChatReplyEvent[]> => {
  const events: ChatReplyEvent[] = [];
  for await (const event of streamChatReply({
    bedrock,
    systemPrompt: 'PROMPT',
    guardrail: GUARDRAIL,
    turns: TURNS,
  })) {
    events.push(event);
  }
  return events;
};

const text = (value: string, index = 0): ConverseStreamOutput =>
  ({
    contentBlockDelta: { contentBlockIndex: index, delta: { text: value } },
  }) as ConverseStreamOutput;
const toolStart = (name: string, index: number): ConverseStreamOutput =>
  ({
    contentBlockStart: { contentBlockIndex: index, start: { toolUse: { name, toolUseId: 't1' } } },
  }) as ConverseStreamOutput;
const toolInput = (input: string, index: number): ConverseStreamOutput =>
  ({
    contentBlockDelta: { contentBlockIndex: index, delta: { toolUse: { input } } },
  }) as ConverseStreamOutput;
const blockStop = (index: number): ConverseStreamOutput =>
  ({ contentBlockStop: { contentBlockIndex: index } }) as ConverseStreamOutput;
const messageStop = (stopReason: string): ConverseStreamOutput =>
  ({ messageStop: { stopReason } }) as ConverseStreamOutput;
const usage = { inputTokens: 30, outputTokens: 12, totalTokens: 42, cacheReadInputTokens: 2000 };
const metadata = { metadata: { usage, metrics: { latencyMs: 1 } } } as ConverseStreamOutput;

describe('streamChatReply', () => {
  it('sends the model, cached system prompt, tools, output cap and guardrail', async () => {
    const bedrock = bedrockStreaming([]);
    await collect(bedrock);

    const command = bedrock.send.mock.calls[0]?.[0];
    expect(command).toBeInstanceOf(ConverseStreamCommand);
    expect(command.input).toMatchObject({
      modelId: CHAT_MODEL_ID,
      system: [{ text: 'PROMPT' }, { cachePoint: { type: 'default' } }],
      messages: [{ role: 'user', content: [{ text: 'show me your work' }] }],
      inferenceConfig: { maxTokens: CHAT_MAX_OUTPUT_TOKENS },
      guardrailConfig: {
        guardrailIdentifier: 'gr-1',
        guardrailVersion: '3',
        streamProcessingMode: 'sync',
      },
    });
    const names = command.input.toolConfig.tools.map(
      (tool: { toolSpec: { name: string } }) => tool.toolSpec.name
    );
    expect(names).toEqual(['scroll_to', 'navigate']);
  });

  it('maps text and a split tool call to the exact event sequence, ending in done', async () => {
    const events = await collect(
      bedrockStreaming([
        { messageStart: { role: 'assistant' } } as ConverseStreamOutput,
        text('Here is '),
        text('my work.'),
        blockStop(0),
        toolStart('scroll_to', 1),
        toolInput('{"sectionId":', 1),
        toolInput('"work"}', 1),
        blockStop(1),
        messageStop('tool_use'),
        metadata,
      ])
    );

    expect(events).toEqual([
      { type: 'text-delta', text: 'Here is ' },
      { type: 'text-delta', text: 'my work.' },
      { type: 'tool-call', name: 'scroll_to', input: { sectionId: 'work' } },
      { type: 'usage', usage },
      { type: 'done' },
    ]);
  });

  it('maps a navigate call', async () => {
    const events = await collect(
      bedrockStreaming([
        toolStart('navigate', 0),
        toolInput('{"slug":"cosmikata"}', 0),
        blockStop(0),
      ])
    );
    expect(events[0]).toEqual({
      type: 'tool-call',
      name: 'navigate',
      input: { slug: 'cosmikata' },
    });
  });

  it.each([
    ['an unknown section', 'scroll_to', '{"sectionId":"admin"}'],
    ['an unknown tool', 'fetch_url', '{"url":"https://example.com"}'],
    ['malformed JSON', 'navigate', '{"slug":'],
  ])('drops a tool call with %s (B3)', async (_label, name, input) => {
    const events = await collect(
      bedrockStreaming([toolStart(name, 0), toolInput(input, 0), blockStop(0)])
    );
    expect(events).toEqual([{ type: 'done' }]);
  });

  it('reports a guardrail intervention as blocked', async () => {
    const events = await collect(
      bedrockStreaming([text('Sorry.'), messageStop('guardrail_intervened')])
    );
    expect(events).toEqual([
      { type: 'text-delta', text: 'Sorry.' },
      { type: 'blocked' },
      { type: 'done' },
    ]);
  });

  it('throws on a stream error event', async () => {
    const bedrock = bedrockStreaming([
      text('Hi'),
      { throttlingException: { message: 'slow down' } } as ConverseStreamOutput,
    ]);
    await expect(collect(bedrock)).rejects.toThrow(/throttlingException/);
  });
});
