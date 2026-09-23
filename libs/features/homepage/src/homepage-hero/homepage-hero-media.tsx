import type { ReactElement } from 'react';

import type { HeroCapability } from '@portfolio/shared-types';
import { MetaChip } from '@portfolio/ui-components';

interface HomepageHeroMediaProps {
  caption: string;
  capabilities: readonly HeroCapability[];
}

/**
 * The hero's featured panel.
 *
 * ⚠️ **There is no image here, and that is a decision rather than a gap**
 * (D85). Both exports draw a 16/7 photograph; both photographs are Unsplash
 * placeholders behind a `window.__resources` fallback, and **no asset in this
 * repo reaches 16/7** — the widest is 1.80, and four of the eight items are
 * mobile-screenshot-only. So the region keeps its box, its ratio and its two
 * chips, and is filled typographically instead. Nothing here reports an image
 * as outstanding, and nothing hotlinks Unsplash.
 *
 * The four capability lines are the export's own unused `index` array.
 */
const HomepageHeroMedia = ({ caption, capabilities }: HomepageHeroMediaProps): ReactElement => {
  return (
    <div className="relative mt-9 aspect-[4/3] overflow-hidden rounded-[22px] bg-surface-sunk frame:aspect-[16/7]">
      <ul className="flex h-full flex-col justify-center gap-3 p-8 frame:p-12">
        {capabilities.map((capability) => (
          <li key={capability.no} className="flex items-baseline gap-4 frame:gap-6">
            <span className="font-mono text-chip tracking-chip text-accent">{capability.no}</span>
            <span className="font-display text-[1.4rem] font-bold tracking-[-0.02em] text-ink frame:text-[2.2rem]">
              {capability.label}
            </span>
          </li>
        ))}
      </ul>
      <MetaChip tone="paper" className="absolute bottom-[1.1rem] left-[1.1rem]">
        {caption}
      </MetaChip>
      <MetaChip tone="glass" className="absolute right-[1.1rem] top-[1.1rem]">
        Featured
      </MetaChip>
    </div>
  );
};

export default HomepageHeroMedia;
