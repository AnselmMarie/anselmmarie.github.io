import type { ReactElement, ReactNode } from 'react';

interface ShellContentRegionProps {
  children?: ReactNode;
}

/**
 * The slot the Homepage and Portfolio Item remotes mount into (Slices 6, 7).
 *
 * ⚠️ **Placeholder in Slice 1**, same as the other two regions. The `main`
 * element and the page's max width are settled here so the content slices
 * inherit them instead of each picking their own.
 */
const ShellContentRegion = ({ children }: ShellContentRegionProps): ReactElement => {
  return (
    <main data-testid="shell-content-region" className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      {children ?? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Anselm Marie</h1>
          <p className="mt-2 text-sm font-medium text-slate-600">
            Senior Software Engineer &amp; Tech Lead | Web Architecture &amp; Product Impact
          </p>
          <p className="mt-6 max-w-prose text-sm leading-relaxed text-slate-500">
            This page is served by the TanStack Start shell. The header, footer and content regions
            above and below are the slots the four federated remotes mount into — none of them exist
            yet.
          </p>
        </div>
      )}
    </main>
  );
};

export default ShellContentRegion;
