import type { ReactElement, ReactNode } from 'react';

interface ShellHeaderRegionProps {
  /**
   * What the region renders. Slice 1 passes hardcoded copy; Slice 3 replaces it
   * with the Header remote's mount, wrapped in the boundary Slice 4 adds.
   */
  children?: ReactNode;
}

/**
 * The slot the Header remote mounts into (D2, Slice 3).
 *
 * ⚠️ **Placeholder in Slice 1.** It holds hardcoded copy and no remote — no
 * remote exists yet. Its job here is to establish the layout region and the
 * `scroll-margin-top` offset a fixed header creates (D43), so Slice 3 swaps a
 * child rather than restructuring the page.
 */
const ShellHeaderRegion = ({ children }: ShellHeaderRegionProps): ReactElement => {
  return (
    <header
      data-testid="shell-header-region"
      className="sticky top-0 z-10 border-b border-slate-200 bg-page/80 backdrop-blur"
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center px-6">
        {children ?? (
          <span className="text-sm font-medium tracking-wide text-slate-500">header region</span>
        )}
      </div>
    </header>
  );
};

export default ShellHeaderRegion;
