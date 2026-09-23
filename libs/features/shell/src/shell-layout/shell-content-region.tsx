import type { ReactElement, ReactNode } from 'react';

import { ProfileCard } from '@portfolio/ui-components';

interface ShellContentRegionProps {
  children?: ReactNode;
}

/**
 * The slot the Homepage and Portfolio Item remotes mount into (Slices 6, 7).
 *
 * ⚠️ **Slice 10 removed this region's max-width and padding.** The design's
 * sections each run **edge to edge** inside the card and carry their own
 * padding (`64px 26px`, `40px 18px` under 760px), because the alternating
 * `surface` and `ink` backgrounds have to touch the card's sides. A width
 * constraint here would inset those backgrounds and leave paper-coloured
 * gutters down both edges of every dark section.
 *
 * The placeholder keeps its own padding, since it is not one of those
 * sections.
 */
const ShellContentRegion = ({ children }: ShellContentRegionProps): ReactElement => {
  return (
    <main data-testid="shell-content-region" className="w-full flex-1">
      {children ?? (
        <div className="px-[18px] py-10 frame:px-[26px] frame:py-16">
          <ProfileCard
            name="Anselm Marie"
            title="Senior Software Engineer & Tech Lead | Web Architecture & Product Impact"
            description="This page is served by the TanStack Start shell. The header, footer and content regions above and below are the slots the four federated remotes mount into."
          />
        </div>
      )}
    </main>
  );
};

export default ShellContentRegion;
