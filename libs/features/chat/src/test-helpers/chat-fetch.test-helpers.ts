import { fireEvent, screen } from '@testing-library/react';
import { vi } from 'vitest';

import type { ChatStreamEvent } from '@portfolio/shared-chat';

/** Events as the Lambda writes them: one JSON object per line (D11). */
export const ndjson = (events: readonly ChatStreamEvent[]): string =>
  events.map((event) => `${JSON.stringify(event)}\n`).join('');

/** A finished reply: the events' text, then `done`. */
export const reply = (text: string, ...extra: ChatStreamEvent[]): ChatStreamEvent[] => [
  { type: 'text-delta', text },
  ...extra,
  { type: 'done' },
];

type Answer = readonly ChatStreamEvent[] | Response | Error;

/**
 * Stubs `fetch` so each POST gets the next answer: events become a 200 NDJSON
 * body, a `Response` is returned as is, an `Error` is thrown. Returns the mock,
 * whose calls are the requests the chat made.
 */
export const mockChatFetch = (...answers: Answer[]) => {
  const queue = [...answers];
  const fetchMock = vi.fn<(input: string, init?: RequestInit) => Promise<Response>>(async () => {
    const next = queue.shift() ?? [];
    if (next instanceof Error) throw next;
    if (next instanceof Response) return next;
    return new Response(ndjson(next), {
      headers: { 'content-type': 'application/x-ndjson' },
    });
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

/** A reply the spec streams by hand, event by event, and then ends. */
export const mockStreamingChatFetch = () => {
  const encoder = new TextEncoder();
  let controller: ReadableStreamDefaultController<Uint8Array> | undefined;
  const body = new ReadableStream<Uint8Array>({
    start: (streamController) => {
      controller = streamController;
    },
  });
  const fetchMock = vi.fn(async () => new Response(body));
  vi.stubGlobal('fetch', fetchMock);

  return {
    fetchMock,
    push: (...events: ChatStreamEvent[]) => controller?.enqueue(encoder.encode(ndjson(events))),
    end: () => controller?.close(),
  };
};

/** The body of the `index`th request, parsed. */
export const requestBody = (
  fetchMock: ReturnType<typeof mockChatFetch>,
  index = 0
): { messages: { role: string; content: string }[] } =>
  JSON.parse(String(fetchMock.mock.calls[index]?.[1]?.body));

export const openChat = (): HTMLElement => {
  fireEvent.click(screen.getByRole('button', { name: 'Open AI chat' }));
  return screen.getByRole('dialog', { name: 'Chat' });
};

export const askChat = (text: string): void => {
  fireEvent.change(screen.getByRole('textbox', { name: 'Message' }), { target: { value: text } });
  fireEvent.click(screen.getByRole('button', { name: 'Send' }));
};
