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
 */
const ShellLayout = ({ header, children, footer }: ShellLayoutProps): ReactElement => {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-700">
      <ShellHeaderRegion>{header}</ShellHeaderRegion>
      <ShellContentRegion>{children}</ShellContentRegion>
      <ShellFooterRegion>{footer}</ShellFooterRegion>
    </div>
  );
};

export default ShellLayout;
