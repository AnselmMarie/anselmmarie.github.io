import type { ReactElement, ReactNode } from 'react';

interface ShellFooterRegionProps {
  children?: ReactNode;
}

/**
 * The slot the Footer remote mounts into (Slice 5).
 *
 * ⚠️ **Placeholder in Slice 1.** See `ShellHeaderRegion` — same reasoning.
 */
const ShellFooterRegion = ({ children }: ShellFooterRegionProps): ReactElement => {
  return (
    <footer data-testid="shell-footer-region" className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex h-16 max-w-5xl items-center px-6">
        {children ?? (
          <span className="text-sm font-medium tracking-wide text-slate-500">footer region</span>
        )}
      </div>
    </footer>
  );
};

export default ShellFooterRegion;
