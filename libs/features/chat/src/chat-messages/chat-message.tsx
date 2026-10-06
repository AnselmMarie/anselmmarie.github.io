import type { ReactElement } from 'react';

import type { ChatRole } from '@portfolio/shared-chat';

interface ChatMessageProps {
  role: ChatRole;
  text: string;
  note?: string;
}

/**
 * The design's two bubbles (ai-chat design.md): the visitor's ink one on the
 * right with its bottom-right corner tucked, the assistant's mint one on the
 * left with its bottom-left tucked.
 *
 * `note` is the mono-caps "→ WORK" line under a reply that moved the page
 * (Slice 2). **Invented**: the design doesn't draw it.
 */
const TONE: Record<ChatRole, string> = {
  user: 'rounded-[16px_16px_4px_16px] bg-ink text-paper',
  assistant: 'rounded-[16px_16px_16px_4px] bg-accent-bright text-ink',
};

const ALIGN: Record<ChatRole, string> = {
  user: 'self-end items-end',
  assistant: 'self-start items-start',
};

const ChatMessage = ({ role, text, note }: ChatMessageProps): ReactElement => {
  return (
    <div data-role={role} className={`flex max-w-[80%] flex-col gap-1.5 ${ALIGN[role]}`}>
      {text ? (
        <div
          className={`px-[0.9rem] py-[0.65rem] text-[0.9rem] leading-[1.5] text-pretty ${TONE[role]}`}
        >
          {text}
        </div>
      ) : null}
      {note ? (
        <span className="px-1 font-mono text-[0.68rem] tracking-[0.12em] text-muted uppercase">
          → {note}
        </span>
      ) : null}
    </div>
  );
};

export default ChatMessage;
