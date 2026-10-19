import { type ReactElement, useEffect, useRef } from 'react';

import type { ChatMessage as ChatMessageModel } from '../chat-transcript/chat-transcript.js';
import ChatMessage from './chat-message.js';
import ChatTypingDots from './chat-typing-dots.js';

interface ChatMessagesProps {
  messages: readonly ChatMessageModel[];
  /** While true, an empty last reply shows the waiting dots (Slice 5). */
  isStreaming?: boolean;
  onRetry?: () => void;
}

/**
 * The drawer's scrolling column. It follows the newest message the way the
 * design's `componentDidUpdate` does: to the bottom when the drawer opens
 * (this mounts with it) and whenever the messages change, which while a reply
 * streams is every delta.
 *
 * The 120px bottom padding keeps the last bubble clear of the composer that
 * floats over it. `role="log"` is not drawn; it makes a screen reader announce
 * each new message (invented).
 *
 * An assistant bubble stays hidden until it has text, except that the last one
 * shows the waiting dots while its reply is pending (invented, Slice 5).
 */
const ChatMessages = ({
  messages,
  isStreaming = false,
  onRetry,
}: ChatMessagesProps): ReactElement => {
  const column = useRef<HTMLDivElement>(null);
  const last = messages.at(-1);
  const isWaiting = isStreaming && last?.role === 'assistant' && !last.text && !last.note;

  useEffect(() => {
    const element = column.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={column}
      role="log"
      className="flex min-h-0 flex-1 flex-col gap-[18px] overflow-y-auto px-[18px] pt-[18px] pb-[120px]"
    >
      {messages
        .filter((message) => message.text.length > 0 || message.note)
        .map((message) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            text={message.text}
            note={message.note}
            isRetryable={message.status === 'error'}
            onRetry={onRetry}
          />
        ))}
      {isWaiting ? <ChatTypingDots /> : null}
    </div>
  );
};

export default ChatMessages;
