import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Chat } from '@portfolio/feature-chat';

/**
 * Mounts the Chat on its own page, outside the shell.
 *
 * An MFE that only renders inside its host is harder to develop and harder to
 * debug — this is the surface `nx run chat:dev` serves, and the one the
 * cross-origin asset check (D42) is run against.
 */
const container = document.getElementById('root');

if (!container) {
  throw new Error('apps/chat: #root is missing from index.html');
}

createRoot(container).render(
  <StrictMode>
    <Chat />
  </StrictMode>
);
