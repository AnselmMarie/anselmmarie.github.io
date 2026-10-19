import { PassThrough, type Writable } from 'node:stream';
import { describe, expect, it, vi } from 'vitest';

import type { ChatStreamEvent } from '@portfolio/shared-chat';

import { type AwsLambdaRuntime, requestBody, writeChatResponse } from './lambda-stream.js';

const fakeRuntime = () => {
  const output = new PassThrough();
  const chunks: string[] = [];
  output.on('data', (chunk: Buffer) => chunks.push(chunk.toString()));
  const from = vi.fn<(stream: Writable) => Writable>(() => output);
  const runtime = { streamifyResponse: vi.fn(), HttpResponseStream: { from } } as AwsLambdaRuntime;
  return { runtime, from, chunks, output };
};

const eventsOf = (...events: ChatStreamEvent[]) =>
  (async function* () {
    yield* events;
  })();

describe('requestBody', () => {
  it('returns a plain body unchanged', () => {
    expect(requestBody({ body: '{"a":1}', isBase64Encoded: false })).toBe('{"a":1}');
  });

  it('decodes a base64 body', () => {
    const body = Buffer.from('{"a":1}').toString('base64');
    expect(requestBody({ body, isBase64Encoded: true })).toBe('{"a":1}');
  });

  it('passes a missing body through', () => {
    expect(requestBody({ body: undefined, isBase64Encoded: true })).toBeUndefined();
  });
});

describe('writeChatResponse (D11)', () => {
  it('sets the status and NDJSON headers, writes one event per line, and ends', async () => {
    const { runtime, from, chunks, output } = fakeRuntime();
    const responseStream = new PassThrough();

    await writeChatResponse(runtime, responseStream, {
      statusCode: 200,
      events: eventsOf({ type: 'text-delta', text: 'Hi' }, { type: 'done' }),
    });

    expect(from).toHaveBeenCalledWith(responseStream, {
      statusCode: 200,
      headers: expect.objectContaining({
        'content-type': 'application/x-ndjson; charset=utf-8',
        'cache-control': 'no-store',
      }),
    });
    expect(chunks.join('')).toBe('{"type":"text-delta","text":"Hi"}\n{"type":"done"}\n');
    expect(output.writableEnded).toBe(true);
  });

  it('ends the stream even when the events throw', async () => {
    const { runtime, output } = fakeRuntime();
    const events = (async function* (): AsyncGenerator<ChatStreamEvent> {
      yield { type: 'done' };
      throw new Error('boom');
    })();

    await expect(
      writeChatResponse(runtime, new PassThrough(), { statusCode: 200, events })
    ).rejects.toThrow('boom');
    expect(output.writableEnded).toBe(true);
  });
});
