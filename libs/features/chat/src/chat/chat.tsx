import { type ReactElement, useState } from 'react';

import { ChatSheet, IconButton } from '@portfolio/ui-components';

import ChatComposer from '../chat-composer/chat-composer.js';
import { CHAT_CLOSE_LABEL, CHAT_OPEN_LABEL, CHAT_TITLE } from '../chat-copy/chat-copy.const.js';
import ChatMessages from '../chat-messages/chat-messages.js';
import useChatStub from '../chat-stub/use-chat-stub.js';

/**
 * The AI chat remote (ai-chat D13): the design's launcher, and the right-side
 * drawer it opens (D17).
 *
 * ⚠️ **The replies are stubbed until Slice 5.** `useChatStub` is the one seam;
 * Slice 5 swaps it for `use-chat`, which returns the same `ChatSession`.
 *
 * The launcher is hidden while the drawer is open, as drawn. The conversation
 * lives here rather than in the drawer, so closing and reopening keeps it.
 *
 * ⚠️ **The `data-testid` is `chat-remote`**, the suite's `<name>-remote`
 * convention, and it sits on the launcher's fixed corner box rather than on a
 * wrapper: a wrapper around only fixed and portalled children has no size, and
 * the e2e suite's "visible" check would never pass. D15 gives the chat no
 * fallback, so on a composed page this box is the only sign the remote loaded.
 */
const Chat = (): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isStreaming, send } = useChatStub();

  return (
    <>
      {isOpen ? null : (
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
        <ChatMessages messages={messages} />
        <ChatComposer isBusy={isStreaming} onSend={send} />
      </ChatSheet>
    </>
  );
};

export default Chat;
