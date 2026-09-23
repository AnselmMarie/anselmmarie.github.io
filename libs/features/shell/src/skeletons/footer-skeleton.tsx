import type { ReactElement } from 'react';

import { LoadingSkeleton } from '@portfolio/ui-components';

const SOCIAL_BONES = 3;

/**
 * The Footer's shape while its remote's `lazy()` import is in flight: the
 * credit line and the row of social icons, on the ink strip.
 *
 * ⚠️ **Invented visual treatment** — the design exports draw no loading state.
 * `tone="ink"` because the footer region is the ink strip; the paper fill
 * would glare on it.
 */
const FooterSkeleton = (): ReactElement => {
  return (
    <div
      data-testid="footer-skeleton"
      className="flex h-full w-full items-center justify-between gap-6"
    >
      <LoadingSkeleton tone="ink" className="h-3 w-40" />
      <div className="flex items-center gap-3">
        {Array.from({ length: SOCIAL_BONES }, (_, index) => (
          <LoadingSkeleton key={index} tone="ink" className="size-5 rounded-pill" />
        ))}
      </div>
    </div>
  );
};

export default FooterSkeleton;
