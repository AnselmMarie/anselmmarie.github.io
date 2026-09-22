import type { ReactElement, ReactNode } from 'react';

import { cn } from '@portfolio/shared-utils';

/**
 * How the capsule is filled. `paper` and `ink` are the two solid fills the
 * exports use; `glass` is the translucent blur that sits over imagery.
 */
export type MetaChipTone = 'paper' | 'ink' | 'glass';

interface MetaChipProps {
  /** The capsule's contents — text, or text plus a status dot. */
  children: ReactNode;
  /** Which fill to draw. Defaults to the light capsule on paper. */
  tone?: MetaChipTone;
  className?: string;
  /** Draw the small leading status dot the design uses for "Live". */
  hasDot?: boolean;
}

const TONE_FILL = {
  paper: 'bg-surface text-ink',
  ink: 'bg-ink/8 text-ink',
  glass: 'bg-backdrop/60 text-paper backdrop-blur-sm',
} as const;

const DOT_FILL = {
  paper: 'bg-accent',
  ink: 'bg-accent',
  glass: 'bg-accent-bright',
} as const;

/**
 * The small mono capsule — "Live", "Featured", the hero's caption pill.
 *
 * Seven call sites across the two exports (D76): the hero's two overlay pills,
 * the Work card's stack and Live chips, and the detail page's status marks.
 *
 * ⚠️ **The dot is decorative and carries no accessible name.** The chip's text
 * is the label; a screen reader that announced the dot as well would read the
 * status twice. Same reasoning as `SocialIcon`'s `aria-hidden` (D75).
 */
const MetaChip = ({
  children,
  tone = 'paper',
  className,
  hasDot = false,
}: MetaChipProps): ReactElement => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 font-mono text-chip uppercase',
        TONE_FILL[tone],
        className
      )}
    >
      {hasDot ? <span aria-hidden className={cn('size-1.5 rounded-pill', DOT_FILL[tone])} /> : null}
      {children}
    </span>
  );
};

export default MetaChip;
