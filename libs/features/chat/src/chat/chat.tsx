import { type ReactElement, useCallback, useState } from 'react';

import { ChatSheet, IconButton } from '@portfolio/ui-components';

import useChat from '../chat-api/use-chat.js';
import ChatComposer from '../chat-composer/chat-composer.js';
import { CHAT_CLOSE_LABEL, CHAT_OPEN_LABEL, CHAT_TITLE } from '../chat-copy/chat-copy.const.js';
import ChatMessages from '../chat-messages/chat-messages.js';
import {
  type ChatToolCallEvent,
  runChatToolAction,
  toChatToolAction,
} from '../chat-tools/chat-tool-action.js';

/**
 * The AI chat remote (ai-chat D13): the design's launcher, and the right-side
 * drawer it opens (D17).
 *
 * Replies come from `/api/chat` through `use-chat` (Slice 5). When one says
 * the kill switch is off (A7), the launcher is hidden for the rest of the
 * visit, once the drawer that showed the message is closed (invented).
 *
 * The launcher is hidden while the drawer is open, as drawn. The conversation
 * lives here rather than in the drawer, so closing and reopening keeps it.
 *
 * A valid tool call (Slice 2) **closes the drawer** so the visitor sees the
 * scroll or the new page, then runs. Closing first is invented (design.md); the
 * conversation is kept, so reopening shows it. An invalid call does nothing.
 *
 * ⚠️ **The `data-testid` is `chat-remote`**, the suite's `<name>-remote`
 * convention, and it sits on the launcher's fixed corner box rather than on a
 * wrapper: a wrapper around only fixed and portalled children has no size, and
 * the e2e suite's "visible" check would never pass. D15 gives the chat no
 * fallback, so on a composed page this box is the only sign the remote loaded.
 */
const Chat = (): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToolCall = useCallback((event: ChatToolCallEvent) => {
    const action = toChatToolAction(event, window.location.pathname);
    if (!action) return;

    setIsOpen(false);
    runChatToolAction(action);
  }, []);
  const { messages, isStreaming, isDisabled, send, retry } = useChat({
    onToolCall: handleToolCall,
  });

  return (
    <>
      {isOpen || isDisabled ? null : (
        <div data-testid="chat-remote" className="fixed right-6 bottom-6 z-[70] flex">
          <IconButton
            icon="message-circle"
            label={CHAT_OPEN_LABEL}
            tone="ink-accent"
            size={56}
            onClick={() => setIsOpen(true)}
          />
        </div>
      )}
      <ChatSheet
        title={CHAT_TITLE}
        closeLabel={CHAT_CLOSE_LABEL}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <ChatMessages messages={messages} isStreaming={isStreaming} onRetry={retry} />
        <ChatComposer isBusy={isStreaming} onSend={send} />
      </ChatSheet>
    </>
  );
};

export default Chat;
