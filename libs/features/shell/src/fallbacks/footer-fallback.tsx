import type { ReactElement } from 'react';

import { SITE_NAME } from '@portfolio/shared-fixtures';

/**
 * The footer's fallback (the architecture doc: *"Render a minimal footer or
 * omit the footer if it is non-critical."*).
 *
 * ⚠️ **Invented, and the most opinionated call in this slice: it renders
 * rather than omits.** Omitting would collapse the page's bottom edge and make
 * a failed footer look like a layout bug instead of a degraded region. A single
 * line of attribution keeps the page's shape and says nothing is missing that
 * matters.
 *
 * ⚠️ **No retry.** Same reasoning as the header, more so.
 *
 * ⚠️ **Slice 10 moved it onto ink.** The footer strip's background is now
 * `--color-ink`, so this reads `paper/60` rather than the muted brown it used
 * on the white page — `--color-muted` on ink is barely legible.
 */
const FooterFallback = (): ReactElement => {
  return (
    <p data-testid="mfe-fallback-footer" className="text-sm text-paper/60">
      © {new Date().getFullYear()} {SITE_NAME}
    </p>
  );
};

export default FooterFallback;
