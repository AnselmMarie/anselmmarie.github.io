import type { ReactElement } from 'react';

import type { ChatRole } from '@portfolio/shared-chat-contract';

interface ChatMessageProps {
  role: ChatRole;
  text: string;
}

/**
 * The design's two bubbles (ai-chat design.md): the visitor's ink one on the
 * right with its bottom-right corner tucked, the assistant's mint one on the
 * left with its bottom-left tucked.
 */
const TONE: Record<ChatRole, string> = {
  user: 'self-end rounded-[16px_16px_4px_16px] bg-ink text-paper',
  assistant: 'self-start rounded-[16px_16px_16px_4px] bg-accent-bright text-ink',
};

const ChatMessage = ({ role, text }: ChatMessageProps): ReactElement => {
  return (
    <div
      data-role={role}
      className={`max-w-[80%] px-[0.9rem] py-[0.65rem] text-[0.9rem] leading-[1.5] text-pretty ${TONE[role]}`}
    >
      {text}
    </div>
  );
};

export default ChatMessage;
