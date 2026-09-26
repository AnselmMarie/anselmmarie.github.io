import type { ReactElement } from 'react';

import { cn } from '@portfolio/shared-utils';
import { Skeleton } from '@portfolio/ui-primitives';

/** Which surface the skeleton sits on. The fill follows from it. */
export type LoadingSkeletonTone = 'paper' | 'ink';

interface LoadingSkeletonProps {
  /** Sizes and shapes the bone — `h-4 w-40`, `size-9 rounded-full`. */
  className?: string;
  /** The surface this sits on. Defaults to paper. */
  tone?: LoadingSkeletonTone;
}

const TONE_FILL = {
  paper: 'bg-surface-sunk',
  ink: 'bg-paper/10',
} as const;

/**
 * One placeholder "bone", drawn on shadcn's `Skeleton`.
 *
 * ⚠️ **This wrapper exists for the fill, not to re-export.** The generated
 * primitive paints `bg-muted`, which in this theme is the #635E55 body-copy
 * grey — a pulsing dark slab on paper, and invisible-to-glaring on the ink
 * footer. Taking the surface (like `Eyebrow`'s `tone`) rather than a colour
 * keeps a caller from picking a fill that fights the surface under it.
 *
 * Always `aria-hidden`: a bone has nothing to say. The region around it is
 * what announces loading, if anything does.
 */
const LoadingSkeleton = ({ className, tone = 'paper' }: LoadingSkeletonProps): ReactElement => {
  return <Skeleton aria-hidden className={cn(TONE_FILL[tone], className)} />;
};

export default LoadingSkeleton;
