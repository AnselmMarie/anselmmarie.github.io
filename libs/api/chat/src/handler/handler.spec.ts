import { PassThrough, type Writable } from 'node:stream';
import type { LambdaFunctionURLEvent } from 'aws-lambda';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createChatHandler } from './handler.js';
import type { AwsLambdaRuntime } from './lambda-stream.js';

const sends = vi.hoisted(() => ({ ssm: vi.fn(), dynamo: vi.fn(), bedrock: vi.fn() }));

vi.mock('@aws-sdk/client-ssm', async (original) => ({
  ...(await original<object>()),
  SSMClient: class {
    send = sends.ssm;
  },
}));
vi.mock('@aws-sdk/client-dynamodb', async (original) => ({
  ...(await original<object>()),
  DynamoDBClient: class {
    send = sends.dynamo;
  },
}));
vi.mock('@aws-sdk/client-bedrock-runtime', async (original) => ({
  ...(await original<object>()),
  BedrockRuntimeClient: class {
    send = sends.bedrock;
  },
}));

const ENV = {
  CHAT_TABLE_NAME: 'quota',
  CHAT_ENABLED_PARAM: '/chat-enabled',
  CHAT_GUARDRAIL_ID: 'gr-1',
  CHAT_GUARDRAIL_VERSION: '1',
  CHAT_DAILY_BUDGET_USD: '1',
  CHAT_IP_DAILY_MESSAGES: '30',
};

type StreamingHandler = (event: LambdaFunctionURLEvent, stream: Writable) => Promise<void>;

/** Builds the handler against a fake runtime and runs one request through it. */
const invoke = async (body: string): Promise<{ statusCode: number; output: string }> => {
  let handler: StreamingHandler | undefined;
  const output = new PassThrough();
  const chunks: string[] = [];
  output.on('data', (chunk: Buffer) => chunks.push(chunk.toString()));
  const from = vi.fn<(stream: Writable, metadata: { statusCode: number }) => Writable>(
    () => output
  );
  const runtime = {
    streamifyResponse: (fn: StreamingHandler) => {
      handler = fn;
      return fn;
    },
    HttpResponseStream: { from },
  } as unknown as AwsLambdaRuntime;

  createChatHandler(runtime, ENV);
  const event = {
    body,
    isBase64Encoded: false,
    headers: { 'cloudfront-viewer-address': '203.0.113.7:1234' },
    requestContext: { http: { sourceIp: '130.176.0.1' } },
  } as unknown as LambdaFunctionURLEvent;
  await handler?.(event, new PassThrough());

  return { statusCode: from.mock.calls[0]?.[1].statusCode ?? 0, output: chunks.join('') };
};

describe('createChatHandler', () => {
  beforeEach(() => {
    sends.ssm.mockReset().mockResolvedValue({ Parameter: { Value: 'true' } });
    sends.dynamo.mockReset().mockResolvedValue({ Responses: { quota: [] } });
    sends.bedrock.mockReset().mockResolvedValue({
      stream: (async function* () {
        yield { contentBlockDelta: { contentBlockIndex: 0, delta: { text: 'Hello' } } };
      })(),
    });
  });

  it('fails at init when the environment is incomplete', () => {
    const runtime = { streamifyResponse: vi.fn() } as unknown as AwsLambdaRuntime;
    expect(() => createChatHandler(runtime, { ...ENV, CHAT_TABLE_NAME: undefined })).toThrow(
      /CHAT_TABLE_NAME/
    );
  });

  it('wires the kill switch, quota and Bedrock into one streamed reply', async () => {
    const body = JSON.stringify({ messages: [{ role: 'user', content: 'hi' }] });
    expect(await invoke(body)).toEqual({
      statusCode: 200,
      output: '{"type":"text-delta","text":"Hello"}\n{"type":"done"}\n',
    });
    expect(sends.ssm.mock.calls[0]?.[0].input).toEqual({ Name: '/chat-enabled' });
    expect(sends.dynamo.mock.calls[0]?.[0].input.RequestItems).toHaveProperty('quota');
    const bedrockInput = sends.bedrock.mock.calls[0]?.[0].input;
    expect(bedrockInput.guardrailConfig).toMatchObject({ guardrailIdentifier: 'gr-1' });
    expect(bedrockInput.system[0].text).toContain('# Projects');
  });

  it('answers a bad request with 400 and never reaches Bedrock', async () => {
    expect(await invoke('not json')).toEqual({
      statusCode: 400,
      output: '{"type":"error","code":"bad-request"}\n',
    });
    expect(sends.bedrock).not.toHaveBeenCalled();
  });
});
