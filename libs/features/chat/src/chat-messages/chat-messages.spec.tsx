import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { ChatMessage } from '../chat-transcript/chat-transcript.js';
import ChatMessages from './chat-messages.js';

const MESSAGES: readonly ChatMessage[] = [
  { id: 'g', role: 'assistant', text: 'Hi there' },
  { id: 'u', role: 'user', text: 'Who is he?' },
];

/** jsdom lays nothing out, so the column's scroll height is set by hand. */
const withScrollHeight = (height: number): void => {
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get: () => height,
  });
};

describe('ChatMessages', () => {
  it('renders every message in order, each marked with who wrote it', () => {
    render(<ChatMessages messages={MESSAGES} />);

    const bubbles = screen.getByRole('log').children;

    expect([...bubbles].map((bubble) => bubble.textContent)).toEqual(['Hi there', 'Who is he?']);
    expect([...bubbles].map((bubble) => bubble.getAttribute('data-role'))).toEqual([
      'assistant',
      'user',
    ]);
  });

  it('hides an assistant bubble until its first text arrives', () => {
    render(<ChatMessages messages={[...MESSAGES, { id: 'a', role: 'assistant', text: '' }]} />);

    expect(screen.getByRole('log').children).toHaveLength(2);
  });

  it('scrolls to the newest message when it opens', () => {
    withScrollHeight(640);
    render(<ChatMessages messages={MESSAGES} />);

    expect(screen.getByRole('log').scrollTop).toBe(640);
  });

  it('scrolls again when the messages change', () => {
    withScrollHeight(640);
    const { rerender } = render(<ChatMessages messages={MESSAGES} />);
    const log = screen.getByRole('log');
    log.scrollTop = 0;

    withScrollHeight(900);
    rerender(
      <ChatMessages messages={[...MESSAGES, { id: 'a', role: 'assistant', text: 'Yes' }]} />
    );

    expect(log.scrollTop).toBe(900);
  });
});
