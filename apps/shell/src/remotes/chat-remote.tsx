import { ClientOnly } from '@tanstack/react-router';
import type { ReactElement } from 'react';

import { MfeRemoteMount } from '@portfolio/feature-shell';

import { remoteVersion } from './remote-version.js';

/**
 * Mounts the AI chat remote (ai-chat D13), once, from the root route, so it
 * survives route changes and keeps its conversation.
 *
 * ⚠️ **A failed chat renders nothing (ai-chat D15)**: no `MfeFallbackNotice`,
 * no skeleton, no reserved space. A missing chat is an absent feature, not a
 * broken page. That makes a broken chat deploy **silent by design**, so the
 * e2e composition spec is what has to notice it.
 *
 * `ClientOnly` keeps `import('chat/Chat')` out of the SSR Lambda bundle (MFE
 * D36 / D55), as for every remote.
 */
const loadChat = () => import('chat/Chat');

const renderNothing = (): ReactElement => <></>;

/** The chat is on every route, so a diagnostic can't name one. */
const EVERY_ROUTE = '*';

const ChatRemote = (): ReactElement => {
  return (
    <ClientOnly fallback={null}>
      <MfeRemoteMount
        mfe="chat"
        version={remoteVersion('chat')}
        route={EVERY_ROUTE}
        exposedModule="Chat"
        fallback={renderNothing}
        onLoadRemote={loadChat}
      />
    </ClientOnly>
  );
};

export default ChatRemote;
