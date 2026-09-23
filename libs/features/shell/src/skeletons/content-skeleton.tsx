import type { ReactElement } from 'react';

import { LoadingSkeleton } from '@portfolio/ui-components';

const BODY_BONES = ['w-full', 'w-full', 'w-2/3'] as const;

/**
 * A page's shape while the Homepage or Portfolio Item remote's `lazy()` import
 * is in flight: an eyebrow, a two-line display heading and a lede paragraph —
 * the opening every content page in the design shares.
 *
 * ⚠️ **Invented visual treatment** — the design exports draw no loading state.
 * One shape serves both page remotes on purpose: their openings agree, and a
 * skeleton that guessed further into either page would be wrong about the rest.
 */
const ContentSkeleton = (): ReactElement => {
  return (
    <div data-testid="content-skeleton" className="flex flex-col gap-6 px-page py-10 frame:py-16">
      <LoadingSkeleton className="h-3 w-28" />
      <div className="flex flex-col gap-3">
        <LoadingSkeleton className="h-12 w-3/4 frame:h-20" />
        <LoadingSkeleton className="h-12 w-1/2 frame:h-20" />
      </div>
      <div className="flex max-w-2xl flex-col gap-3">
        {BODY_BONES.map((width, index) => (
          <LoadingSkeleton key={index} className={`h-4 ${width}`} />
        ))}
      </div>
    </div>
  );
};

export default ContentSkeleton;
