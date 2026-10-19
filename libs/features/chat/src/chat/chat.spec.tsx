import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CHAT_ERROR, CHAT_GREETING } from '../chat-copy/chat-copy.const.js';
import {
  askChat,
  mockChatFetch,
  mockStreamingChatFetch,
  openChat,
  reply,
} from '../test-helpers/chat-fetch.test-helpers.js';
import Chat from './chat.js';

const BACKEND = 'He designed an edge-first backend on Hono, PostgreSQL, and Drizzle.';

describe('Chat', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('identifies itself as the remote, on the box that holds the launcher', () => {
    render(<Chat />);

    expect(screen.getByTestId('chat-remote')).toContainElement(
      screen.getByRole('button', { name: 'Open AI chat' })
    );
  });

  it('shows only the launcher until it is pressed', () => {
    render(<Chat />);

    expect(screen.getByRole('button', { name: 'Open AI chat' })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the drawer, and hides the launcher while it is open', () => {
    render(<Chat />);

    expect(openChat()).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Open AI chat' })).not.toBeInTheDocument();
  });

  it('greets first', () => {
    render(<Chat />);

    const log = within(openChat()).getByRole('log');

    expect(log.firstElementChild).toHaveTextContent(CHAT_GREETING);
  });

  it('closes from the close button and brings the launcher back', () => {
    render(<Chat />);
    openChat();

    fireEvent.click(screen.getByRole('button', { name: 'Close chat' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open AI chat' })).toBeInTheDocument();
  });

  it('closes on Escape', () => {
    render(<Chat />);

    fireEvent.keyDown(openChat(), { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on a press on the scrim', () => {
    render(<Chat />);
    openChat();
    const scrim = document.querySelector('[data-slot="sheet-overlay"]');
    if (!scrim) throw new Error('no scrim rendered');

    fireEvent.pointerDown(scrim);
    fireEvent.mouseDown(scrim);
    fireEvent.pointerUp(scrim);
    fireEvent.mouseUp(scrim);
    fireEvent.click(scrim);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows a sent message, then streams the reply into the next bubble as it arrives', async () => {
    const stream = mockStreamingChatFetch();
    render(<Chat />);
    const log = within(openChat()).getByRole('log');

    askChat('What about the backend?');

    expect(log).toHaveTextContent('What about the backend?');
    stream.push({ type: 'text-delta', text: 'He designed ' });
    await waitFor(() => expect(log.lastElementChild).toHaveTextContent('He designed'));
    expect(log.lastElementChild).toHaveAttribute('data-role', 'assistant');

    stream.push({ type: 'text-delta', text: 'an edge-first backend.' }, { type: 'done' });
    stream.end();
    await waitFor(() =>
      expect(log.lastElementChild).toHaveTextContent('He designed an edge-first backend.')
    );
  });

  it('keeps the conversation across a close and reopen', async () => {
    mockChatFetch(reply(BACKEND));
    render(<Chat />);
    openChat();
    askChat('What about the backend?');
    await screen.findByText(BACKEND);

    fireEvent.click(screen.getByRole('button', { name: 'Close chat' }));
    const log = within(openChat()).getByRole('log');

    expect(log).toHaveTextContent('What about the backend?');
    expect(log).toHaveTextContent(BACKEND);
  });

  it('holds back a second send while a reply streams', async () => {
    const stream = mockStreamingChatFetch();
    render(<Chat />);
    const log = within(openChat()).getByRole('log');

    askChat('What about the backend?');
    askChat('And the team?');

    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue('And the team?');
    expect(log).not.toHaveTextContent('And the team?');
    await waitFor(() => expect(stream.fetchMock).toHaveBeenCalledTimes(1));
    stream.end();
    await screen.findByText(CHAT_ERROR);
    expect(stream.fetchMock).toHaveBeenCalledTimes(1);
  });

  it('keeps the composer reachable from the keyboard', () => {
    render(<Chat />);
    const dialog = openChat();

    const input = within(dialog).getByRole('textbox', { name: 'Message' });
    const sendButton = within(dialog).getByRole('button', { name: 'Send' });

    expect(input).not.toHaveAttribute('tabindex', '-1');
    expect(sendButton).not.toHaveAttribute('tabindex', '-1');
    expect(sendButton).not.toBeDisabled();
  });
});
