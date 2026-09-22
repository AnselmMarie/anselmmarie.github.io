import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Homepage } from '@portfolio/feature-homepage';

/**
 * Mounts the Homepage on its own page, outside the shell.
 *
 * An MFE that only renders inside its host is harder to develop and harder to
 * debug — this is the surface `nx run homepage:dev` serves, and the one the
 * cross-origin asset check (D42) is run against.
 */
const container = document.getElementById('root');

if (!container) {
  throw new Error('apps/homepage: #root is missing from index.html');
}

createRoot(container).render(
  <StrictMode>
    <Homepage />
  </StrictMode>
);
