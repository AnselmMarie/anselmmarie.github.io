import { type ReactElement, useEffect, useRef } from 'react';

import type { ChatMessage as ChatMessageModel } from '../chat-transcript/chat-transcript.js';
import ChatMessage from './chat-message.js';

interface ChatMessagesProps {
  messages: readonly ChatMessageModel[];
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
 */
const ChatMessages = ({ messages }: ChatMessagesProps): ReactElement => {
  const column = useRef<HTMLDivElement>(null);

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
        .filter((message) => message.text.length > 0)
        .map((message) => (
          <ChatMessage key={message.id} role={message.role} text={message.text} />
        ))}
    </div>
  );
};

export default ChatMessages;
