import type { ReactElement, ReactNode } from 'react';

import { ProfileCard } from '@portfolio/ui-components';

interface ShellContentRegionProps {
  children?: ReactNode;
}

/**
 * The slot the Homepage and Portfolio Item remotes mount into (Slices 6, 7).
 *
 * ⚠️ **Placeholder in Slice 1**, same as the other two regions. The `main`
 * element and the page's max width are settled here so the content slices
 * inherit them instead of each picking their own.
 *
 * Slice 2 moves the placeholder's markup into `@portfolio/ui-components`'
 * `ProfileCard` — the styling now comes from the shared design system rather
 * than ad-hoc Tailwind classes in this feature lib (D3, D25, D26).
 */
const ShellContentRegion = ({ children }: ShellContentRegionProps): ReactElement => {
  return (
    <main data-testid="shell-content-region" className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      {children ?? (
        <ProfileCard
          name="Anselm Marie"
          title="Senior Software Engineer & Tech Lead | Web Architecture & Product Impact"
          description="This page is served by the TanStack Start shell. The header, footer and content regions above and below are the slots the four federated remotes mount into — none of them exist yet."
        />
      )}
    </main>
  );
};

export default ShellContentRegion;
