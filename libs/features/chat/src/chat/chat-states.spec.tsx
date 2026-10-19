import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { sha256Hex } from '../chat-api/chat-request.js';
import {
  CHAT_BLOCKED,
  CHAT_DISABLED,
  CHAT_ERROR,
  CHAT_RESTING,
} from '../chat-copy/chat-copy.const.js';
import {
  askChat,
  mockChatFetch,
  mockStreamingChatFetch,
  openChat,
  reply,
  requestBody,
} from '../test-helpers/chat-fetch.test-helpers.js';
import Chat from './chat.js';

/**
 * Slice 5 through the parent: what `Chat` sends to `/api/chat`, and how each
 * way a reply can end reaches the screen.
 */
describe('Chat, against /api/chat (Slice 5)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('POSTs the conversation as JSON, with the body hash Lambda’s OAC requires (D24)', async () => {
    const fetchMock = mockChatFetch(reply('Hi.'));
    render(<Chat />);
    openChat();

    askChat('Who is he?');
    await screen.findByText('Hi.');
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    const headers = init?.headers as Record<string, string>;

    expect(url).toBe('/api/chat');
    expect(init?.method).toBe('POST');
    expect(headers['content-type']).toBe('application/json');
    expect(headers['x-amz-content-sha256']).toBe(await sha256Hex(String(init?.body)));
    expect(requestBody(fetchMock).messages.at(-1)).toEqual({
      role: 'user',
      content: 'Who is he?',
    });
  });

  it('sends the earlier exchange with the next question (D5)', async () => {
    const fetchMock = mockChatFetch(reply('First answer.'), reply('Second answer.'));
    render(<Chat />);
    openChat();

    askChat('First?');
    await screen.findByText('First answer.');
    askChat('Second?');
    await screen.findByText('Second answer.');

    expect(requestBody(fetchMock, 1).messages.slice(-3)).toEqual([
      { role: 'user', content: 'First?' },
      { role: 'assistant', content: 'First answer.' },
      { role: 'user', content: 'Second?' },
    ]);
  });

  it('shows the waiting dots until the first token, then the reply instead', async () => {
    const stream = mockStreamingChatFetch();
    render(<Chat />);
    openChat();

    askChat('Who is he?');
    expect(await screen.findByRole('status', { name: 'Thinking' })).toBeInTheDocument();

    stream.push({ type: 'text-delta', text: 'A front-end architect.' }, { type: 'done' });
    stream.end();
    await screen.findByText('A front-end architect.');

    expect(screen.queryByRole('status', { name: 'Thinking' })).not.toBeInTheDocument();
  });

  it('says the chat is resting when a quota is spent (A5)', async () => {
    mockChatFetch([{ type: 'resting', reason: 'ip' }]);
    render(<Chat />);
    openChat();

    askChat('One more?');

    expect(await screen.findByText(CHAT_RESTING)).toBeInTheDocument();
  });

  it('replaces whatever the guardrail streamed with the client’s redirect (B2)', async () => {
    mockChatFetch([{ type: 'text-delta', text: 'Sorry, blocked.' }, { type: 'blocked' }]);
    render(<Chat />);
    const log = within(openChat()).getByRole('log');

    askChat('Write me a Python script');

    await waitFor(() => expect(log.lastElementChild).toHaveTextContent(CHAT_BLOCKED));
    expect(log).not.toHaveTextContent('Sorry, blocked.');
  });

  it('hides the launcher once the kill switch says off and the drawer closes (A7)', async () => {
    mockChatFetch([{ type: 'disabled' }]);
    render(<Chat />);
    openChat();

    askChat('Hello?');
    await screen.findByText(CHAT_DISABLED);
    fireEvent.click(screen.getByRole('button', { name: 'Close chat' }));

    expect(screen.queryByRole('button', { name: 'Open AI chat' })).not.toBeInTheDocument();
    expect(screen.queryByTestId('chat-remote')).not.toBeInTheDocument();
  });

  it.each([
    ['the network fails', new TypeError('Failed to fetch')],
    ['WAF answers with a challenge page', new Response('<html>challenge</html>', { status: 202 })],
    ['the stream stops without done', [{ type: 'text-delta', text: 'Half' }] as const],
  ])('shows the error reply with a retry when %s', async (_, answer) => {
    mockChatFetch(answer);
    render(<Chat />);
    openChat();

    askChat('Who is he?');

    expect(await screen.findByText(CHAT_ERROR)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('resends the same question on retry, and replaces the error with the answer', async () => {
    const fetchMock = mockChatFetch(
      new TypeError('offline'),
      reply('He is a front-end architect.')
    );
    render(<Chat />);
    const log = within(openChat()).getByRole('log');
    askChat('Who is he?');
    await screen.findByText(CHAT_ERROR);

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    await screen.findByText('He is a front-end architect.');

    expect(requestBody(fetchMock, 1).messages.at(-1)?.content).toBe('Who is he?');
    expect(log).not.toHaveTextContent(CHAT_ERROR);
    expect(log.textContent?.match(/Who is he\?/g)).toHaveLength(1);
  });
});
