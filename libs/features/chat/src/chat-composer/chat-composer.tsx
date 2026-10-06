import { type ReactElement, type SyntheticEvent, useState } from 'react';

import { CHAT_MAX_MESSAGE_CHARS } from '@portfolio/shared-chat';
import { IconButton, PillInput } from '@portfolio/ui-components';

import {
  CHAT_INPUT_LABEL,
  CHAT_INPUT_PLACEHOLDER,
  CHAT_SEND_LABEL,
} from '../chat-copy/chat-copy.const.js';

interface ChatComposerProps {
  /** While a reply streams, a send is held back and the draft is kept. */
  isBusy?: boolean;
  onSend: (text: string) => void;
}

/**
 * The composer pinned to the drawer's bottom over the design's white fade.
 *
 * ⚠️ **`from-white` / `via-white`** are raw palette classes on purpose: #FFFFFF
 * has no theme token (design.md). The 500-character cap (A4) is `maxLength`
 * only, with no visible counter, so the drawn composer is unchanged (invented).
 */
const ChatComposer = ({ isBusy = false, onSend }: ChatComposerProps): ReactElement => {
  const [draft, setDraft] = useState('');

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || isBusy) return;

    onSend(text);
    setDraft('');
  };

  return (
    <form
      className="absolute inset-x-0 bottom-0 flex gap-2 bg-linear-to-t from-white via-white via-72% to-white/0 px-[18px] pt-14 pb-[18px]"
      onSubmit={handleSubmit}
    >
      <PillInput
        value={draft}
        label={CHAT_INPUT_LABEL}
        placeholder={CHAT_INPUT_PLACEHOLDER}
        maxLength={CHAT_MAX_MESSAGE_CHARS}
        className="min-w-0 flex-1"
        onValueChange={setDraft}
      />
      <IconButton icon="send" label={CHAT_SEND_LABEL} type="submit" className="shrink-0" />
    </form>
  );
};

export default ChatComposer;
