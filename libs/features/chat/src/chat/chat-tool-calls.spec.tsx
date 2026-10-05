import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CHAT_NAVIGATE_EVENT } from '@portfolio/shared-chat-contract';

import { STUB_TICK_MS } from '../chat-stub/use-chat-stub.js';
import Chat from './chat.js';

/**
 * The tool calls through the parent (spec-through-the-parent): a scripted reply
 * with a tool call has to reach the executor from `Chat`, or none of these move
 * anything. Split from `chat.spec.tsx` for the 200-line cap.
 */
const open = (): HTMLElement => {
  fireEvent.click(screen.getByRole('button', { name: 'Open AI chat' }));
  return screen.getByRole('dialog', { name: 'Chat' });
};

const ask = (text: string): void => {
  fireEvent.change(screen.getByRole('textbox', { name: 'Message' }), { target: { value: text } });
  fireEvent.click(screen.getByRole('button', { name: 'Send' }));
};

/** Long enough for any scripted reply to play to its `done`. */
const playReply = (): void => {
  act(() => vi.advanceTimersByTime(STUB_TICK_MS * 200));
};

describe('Chat, when a reply moves the page (Slice 2)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.getElementById('work')?.remove();
  });

  it('closes the drawer and scrolls to the section, on the homepage', () => {
    const section = document.createElement('section');
    section.id = 'work';
    section.scrollIntoView = vi.fn();
    document.body.append(section);
    render(<Chat />);
    open();

    ask('Show me your work');
    playReply();

    expect(section.scrollIntoView).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open AI chat' })).toBeInTheDocument();
  });

  it('asks the shell to open a portfolio page', () => {
    const listener = vi.fn();
    window.addEventListener(CHAT_NAVIGATE_EVENT, listener);
    render(<Chat />);
    open();

    ask('Tell me about Cosmikata');
    playReply();
    window.removeEventListener(CHAT_NAVIGATE_EVENT, listener);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { href: '/portfolio/cosmikata' } })
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('keeps the conversation, with a note of where it went, for the next open', () => {
    render(<Chat />);
    open();

    ask('Show me your work');
    playReply();
    const log = within(open()).getByRole('log');

    expect(log.lastElementChild).toHaveTextContent('Here is his selected work.');
    expect(log.lastElementChild).toHaveTextContent('→ Work');
  });

  it('leaves the drawer open for a reply that moves nothing', () => {
    render(<Chat />);
    open();

    ask('What about the backend?');
    playReply();

    expect(screen.getByRole('dialog', { name: 'Chat' })).toBeInTheDocument();
  });
});
