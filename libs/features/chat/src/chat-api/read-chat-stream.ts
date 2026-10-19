import type { ChatStreamEvent } from '@portfolio/shared-chat';

import { createNdjsonParser } from './parse-ndjson.js';

/**
 * Reads a `POST /api/chat` response body to its end, handing each contract
 * event to `onEvent` as soon as its line completes, so the bubble grows token
 * by token (D11).
 *
 * The status code is not checked: the Lambda answers a refusal as NDJSON too
 * (a 400 carries an `error` event), and anything else, such as a WAF challenge
 * page, simply yields no events. The caller decides what a reply with no
 * ending event means.
 */
export const readChatStream = async (
  response: Response,
  onEvent: (event: ChatStreamEvent) => void
): Promise<void> => {
  if (!response.body) return;

  const parser = createNdjsonParser();
  const decoder = new TextDecoder();
  const reader = response.body.getReader();

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    for (const event of parser.push(decoder.decode(value, { stream: true }))) onEvent(event);
  }
  for (const event of parser.push(decoder.decode())) onEvent(event);
  for (const event of parser.flush()) onEvent(event);
};
