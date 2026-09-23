import type { ComponentProps, ReactElement } from 'react';

import { cn } from '@portfolio/shared-utils';

/**
 * shadcn's `skeleton` (base-vega), as generated. Never hand-edit it (D25) — a
 * project look goes in a `libs/ui/components` wrapper (`LoadingSkeleton`).
 *
 * ⚠️ Same two mechanical adaptations as `button.tsx`: an arrow function
 * (coding-conventions) and `cn` from `@portfolio/shared-utils` (D56), because
 * shadcn emits `import { cn } from "cn"`. Taken from
 * `shadcn add skeleton --dry-run --view`; re-running `shadcn add` must
 * re-apply both.
 *
 * ⚠️ Its generated `bg-muted` is this theme's #635E55 body-copy grey, far too
 * heavy for a placeholder on paper — which is why nothing outside
 * `libs/ui/components` should render this directly.
 */
const Skeleton = ({ className, ...props }: ComponentProps<'div'>): ReactElement => {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
};

export { Skeleton };
