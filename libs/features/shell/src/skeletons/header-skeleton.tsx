import type { ReactElement } from 'react';

import { LoadingSkeleton } from '@portfolio/ui-components';

const NAV_BONES = ['w-14', 'w-20', 'w-16', 'w-14', 'w-16'] as const;

/**
 * The Header's shape while its remote's `lazy()` import is in flight: a brand
 * mark, the section links from `frame` up, and the menu toggle below it.
 *
 * ⚠️ **Invented visual treatment** — the design exports draw no loading state.
 * The bones follow the Header's own layout so the swap to the real bar reads
 * as the text arriving rather than the layout moving.
 */
const HeaderSkeleton = (): ReactElement => {
  return (
    <div
      data-testid="header-skeleton"
      className="flex h-full w-full items-center justify-between gap-6"
    >
      <LoadingSkeleton className="h-5 w-32" />
      <div className="hidden items-center gap-6 frame:flex">
        {NAV_BONES.map((width, index) => (
          <LoadingSkeleton key={index} className={`h-3 ${width}`} />
        ))}
      </div>
      <LoadingSkeleton className="size-8 rounded-pill frame:hidden" />
    </div>
  );
};

export default HeaderSkeleton;
