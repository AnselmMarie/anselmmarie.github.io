import type { ReactElement, ReactNode } from 'react';

import ShellContentRegion from './shell-content-region.js';
import ShellFooterRegion from './shell-footer-region.js';
import ShellHeaderRegion from './shell-header-region.js';

interface ShellLayoutProps {
  /** Mounted into the header region. Slice 3 passes the Header remote. */
  header?: ReactNode;
  /** Mounted into the content region. Slices 6 and 7 pass their remotes. */
  children?: ReactNode;
  /** Mounted into the footer region. Slice 5 passes the Footer remote. */
  footer?: ReactNode;
}

/**
 * The page's three regions, in order (D27 — this is the shell's page, and it
 * lives in the feature lib rather than in `apps/shell`).
 *
 * Each region takes its content as a prop so the app composes remotes into the
 * layout without the layout knowing what a remote is. That is what keeps the
 * D27 fallback cheap: if Module Federation has to be backed out, the same
 * component tree composes as a plain monorepo import with no rewrite.
 *
 * **Slice 10 replaced the frame.** The page is now the design's card: a dark
 * `backdrop` bleed, a 14px inset on three sides, and a 1400px `paper` card
 * with a 26px radius (16px under 760px).
 *
 * ⚠️ **`overflow-hidden` on the card is load-bearing and easy to lose.** Every
 * dark section in the design runs edge to edge and is clipped to the card's
 * corner radius by it alone. Drop it and the `#contact` block's square corners
 * punch through the rounded frame — which looks like a radius bug in the
 * section, three files away from the cause.
 */
const ShellLayout = ({ header, children, footer }: ShellLayoutProps): ReactElement => {
  return (
    <div className="min-h-screen bg-backdrop px-frame pt-frame">
      <div className="mx-auto flex min-h-[calc(100vh-var(--spacing-frame))] max-w-[1400px] flex-col overflow-hidden rounded-t-shell-sm bg-paper text-ink frame:rounded-t-shell">
        <ShellHeaderRegion>{header}</ShellHeaderRegion>
        <ShellContentRegion>{children}</ShellContentRegion>
        <ShellFooterRegion>{footer}</ShellFooterRegion>
      </div>
    </div>
  );
};

export default ShellLayout;
