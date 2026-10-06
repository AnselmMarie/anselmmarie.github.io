import type { Writable } from 'node:stream';
import type { LambdaFunctionURLEvent } from 'aws-lambda';

import type { ChatResponse } from './handle-chat.js';

/**
 * The slice of the managed Node runtime's `awslambda` global the chat uses.
 * It exists only inside Lambda, so it is typed here and passed in, never read
 * at import time by anything a spec loads.
 */
export interface AwsLambdaRuntime {
  readonly streamifyResponse: (
    handler: (event: LambdaFunctionURLEvent, responseStream: Writable) => Promise<void>
  ) => unknown;
  readonly HttpResponseStream: {
    readonly from: (
      stream: Writable,
      metadata: { statusCode: number; headers: Record<string, string> }
    ) => Writable;
  };
}

const NDJSON_HEADERS = {
  'content-type': 'application/x-ndjson; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
};

/** A Function URL body, decoded if API Gateway-style base64 was applied. */
export const requestBody = (event: Pick<LambdaFunctionURLEvent, 'body' | 'isBase64Encoded'>) =>
  event.body !== undefined && event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body;

/** Writes one response as NDJSON (D11): one event per line, flushed as it arrives. */
export const writeChatResponse = async (
  runtime: AwsLambdaRuntime,
  responseStream: Writable,
  response: ChatResponse
): Promise<void> => {
  const stream = runtime.HttpResponseStream.from(responseStream, {
    statusCode: response.statusCode,
    headers: NDJSON_HEADERS,
  });
  try {
    for await (const event of response.events) stream.write(`${JSON.stringify(event)}\n`);
  } finally {
    stream.end();
  }
};
