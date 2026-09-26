import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Footer } from '@portfolio/feature-footer';

/**
 * Mounts the Footer on its own page, outside the shell.
 *
 * An MFE that only renders inside its host is harder to develop and harder to
 * debug — this is the surface `nx run footer:dev` serves, and the one the
 * cross-origin asset check (D42) is run against.
 */
const container = document.getElementById('root');

if (!container) {
  throw new Error('apps/footer: #root is missing from index.html');
}

createRoot(container).render(
  <StrictMode>
    <Footer />
  </StrictMode>
);
