import { render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CHAT_NAVIGATE_EVENT } from '@portfolio/shared-chat';

import {
  askChat,
  mockChatFetch,
  openChat,
  reply,
} from '../test-helpers/chat-fetch.test-helpers.js';
import Chat from './chat.js';

/**
 * The tool calls through the parent (spec-through-the-parent): a streamed
 * reply's tool call has to reach the executor from `Chat`, or none of these
 * move anything. Split from `chat.spec.tsx` for the 200-line cap.
 */
const SHOW_WORK = reply('Here is his selected work.', {
  type: 'tool-call',
  name: 'scroll_to',
  input: { sectionId: 'work' },
});

describe('Chat, when a reply moves the page (Slice 2)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.getElementById('work')?.remove();
  });

  it('closes the drawer and scrolls to the section, on the homepage', async () => {
    const section = document.createElement('section');
    section.id = 'work';
    section.scrollIntoView = vi.fn();
    document.body.append(section);
    mockChatFetch(SHOW_WORK);
    render(<Chat />);
    openChat();

    askChat('Show me your work');

    await waitFor(() => expect(section.scrollIntoView).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open AI chat' })).toBeInTheDocument();
  });

  it('asks the shell to open a portfolio page', async () => {
    const listener = vi.fn();
    window.addEventListener(CHAT_NAVIGATE_EVENT, listener);
    mockChatFetch(
      reply('Opening Cosmikata.', {
        type: 'tool-call',
        name: 'navigate',
        input: { slug: 'cosmikata' },
      })
    );
    render(<Chat />);
    openChat();

    askChat('Tell me about Cosmikata');
    await waitFor(() => expect(listener).toHaveBeenCalledTimes(1));
    window.removeEventListener(CHAT_NAVIGATE_EVENT, listener);

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { href: '/portfolio/cosmikata' } })
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('keeps the conversation, with a note of where it went, for the next open', async () => {
    mockChatFetch(SHOW_WORK);
    render(<Chat />);
    openChat();

    askChat('Show me your work');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    const log = within(openChat()).getByRole('log');

    await waitFor(() => expect(log.lastElementChild).toHaveTextContent('→ Work'));
    expect(log.lastElementChild).toHaveTextContent('Here is his selected work.');
  });

  it('moves nothing, and leaves the drawer open, for a tool call outside the enums (B3)', async () => {
    mockChatFetch(
      reply('Sure.', { type: 'tool-call', name: 'navigate', input: { slug: 'evil.example' } })
    );
    render(<Chat />);
    openChat();

    askChat('Take me somewhere else');
    await screen.findByText('Sure.');

    expect(screen.getByRole('dialog', { name: 'Chat' })).toBeInTheDocument();
  });

  it('leaves the drawer open for a reply that moves nothing', async () => {
    mockChatFetch(reply('Mostly front-end architecture.'));
    render(<Chat />);
    openChat();

    askChat('What about the backend?');
    await screen.findByText('Mostly front-end architecture.');

    expect(screen.getByRole('dialog', { name: 'Chat' })).toBeInTheDocument();
  });
});
