import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CHAT_GREETING } from '../chat-copy/chat-copy.const.js';
import { CHAT_STUB_REPLIES } from '../chat-stub/chat-replies.fixture.js';
import { STUB_CHARS_PER_TICK, STUB_TICK_MS } from '../chat-stub/use-chat-stub.js';
import Chat from './chat.js';

const BACKEND = CHAT_STUB_REPLIES[2]?.reply ?? '';

const open = (): HTMLElement => {
  fireEvent.click(screen.getByRole('button', { name: 'Open AI chat' }));
  return screen.getByRole('dialog', { name: 'Chat' });
};

const ask = (text: string): void => {
  fireEvent.change(screen.getByRole('textbox', { name: 'Message' }), { target: { value: text } });
  fireEvent.click(screen.getByRole('button', { name: 'Send' }));
};

describe('Chat', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
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

    expect(open()).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Open AI chat' })).not.toBeInTheDocument();
  });

  it('greets first', () => {
    render(<Chat />);

    const log = within(open()).getByRole('log');

    expect(log.firstElementChild).toHaveTextContent(CHAT_GREETING);
  });

  it('closes from the close button and brings the launcher back', () => {
    render(<Chat />);
    open();

    fireEvent.click(screen.getByRole('button', { name: 'Close chat' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open AI chat' })).toBeInTheDocument();
  });

  it('closes on Escape', () => {
    render(<Chat />);

    fireEvent.keyDown(open(), { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on a press on the scrim', () => {
    render(<Chat />);
    open();
    const scrim = document.querySelector('[data-slot="sheet-overlay"]');
    if (!scrim) throw new Error('no scrim rendered');

    fireEvent.pointerDown(scrim);
    fireEvent.mouseDown(scrim);
    fireEvent.pointerUp(scrim);
    fireEvent.mouseUp(scrim);
    fireEvent.click(scrim);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows a sent message, then streams the stub reply into the next bubble', () => {
    render(<Chat />);
    const log = within(open()).getByRole('log');

    ask('What about the backend?');

    expect(log.lastElementChild).toHaveTextContent('What about the backend?');
    expect(log.lastElementChild).toHaveAttribute('data-role', 'user');

    act(() => vi.advanceTimersByTime(STUB_TICK_MS));

    expect(log.lastElementChild).toHaveAttribute('data-role', 'assistant');
    expect(log.lastElementChild).toHaveTextContent(BACKEND.slice(0, STUB_CHARS_PER_TICK));

    act(() => vi.advanceTimersByTime(STUB_TICK_MS * (BACKEND.length + 1)));

    expect(log.lastElementChild).toHaveTextContent(BACKEND);
  });

  it('keeps the conversation across a close and reopen', () => {
    render(<Chat />);
    open();
    ask('What about the backend?');
    act(() => vi.advanceTimersByTime(STUB_TICK_MS * (BACKEND.length + 1)));

    fireEvent.click(screen.getByRole('button', { name: 'Close chat' }));
    const log = within(open()).getByRole('log');

    expect(log).toHaveTextContent('What about the backend?');
    expect(log).toHaveTextContent(BACKEND);
  });

  it('holds back a second send while a reply streams', () => {
    render(<Chat />);
    const log = within(open()).getByRole('log');

    ask('What about the backend?');
    ask('And the team?');

    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue('And the team?');
    expect(log).not.toHaveTextContent('And the team?');
  });

  it('keeps the composer reachable from the keyboard', () => {
    render(<Chat />);
    const dialog = open();

    const input = within(dialog).getByRole('textbox', { name: 'Message' });
    const sendButton = within(dialog).getByRole('button', { name: 'Send' });

    expect(input).not.toHaveAttribute('tabindex', '-1');
    expect(sendButton).not.toHaveAttribute('tabindex', '-1');
    expect(sendButton).not.toBeDisabled();
  });
});
