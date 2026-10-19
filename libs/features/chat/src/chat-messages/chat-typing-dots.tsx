import type { ReactElement } from 'react';

import { CHAT_WAITING_LABEL } from '../chat-copy/chat-copy.const.js';

const DOT_DELAYS = ['0ms', '150ms', '300ms'] as const;

/**
 * Three pulsing dots in an assistant bubble, shown from a send until the first
 * token arrives (ai-chat Slice 5). **Invented**: the design draws no waiting
 * state (design.md). `role="status"` names it for a screen reader.
 */
const ChatTypingDots = (): ReactElement => {
  return (
    <div
      role="status"
      aria-label={CHAT_WAITING_LABEL}
      data-role="assistant"
      className="flex gap-1 self-start rounded-[16px_16px_16px_4px] bg-accent-bright px-[0.9rem] py-[0.85rem]"
    >
      {DOT_DELAYS.map((delay) => (
        <span
          key={delay}
          className="size-1.5 animate-pulse rounded-full bg-ink"
          style={{ animationDelay: delay }}
        />
      ))}
    </div>
  );
};

export default ChatTypingDots;
