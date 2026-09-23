import type { ReactElement, ReactNode } from 'react';

import { cn } from '@portfolio/shared-utils';
import { Badge } from '@portfolio/ui-primitives';

/**
 * How the capsule is filled. `paper` and `ink` are the two solid fills the
 * exports use; `glass` is the translucent blur that sits over imagery;
 * `inverse` is the light-on-dark wash for a chip on a dark card.
 */
export type MetaChipTone = 'paper' | 'ink' | 'glass' | 'inverse';

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
  inverse: 'bg-white/14 text-paper',
} as const;

/**
 * ⚠️ **The label is all caps, so the font's descender space is dead weight.**
 * A mono cap sits on the baseline with nothing below it, but the line box
 * still reserves the descent — so equal padding drew ~6px above the caps and
 * ~9px below. `text-box` trims the label's line box to cap height → baseline,
 * and the padding alone sets the gap.
 *
 * ⚠️ **The trim goes on the inner label span, not the chip.** The chip is
 * `inline-flex`, and `text-box-trim` only acts on a block container's lines —
 * set on the flex container it is silently ignored. Where `text-box` is
 * unsupported (Firefox) the chip keeps `py-1` and the old slight imbalance,
 * rather than growing by the extra padding.
 */
const TRIMMED_PADDING = 'py-1 supports-[text-box:trim-both_cap_alphabetic]:py-[0.47rem]';
const LABEL_TRIM = '[text-box:trim-both_cap_alphabetic]';

const DOT_FILL = {
  paper: 'bg-accent',
  ink: 'bg-accent',
  glass: 'bg-accent-bright',
  inverse: 'bg-accent-bright',
} as const;

/**
 * The small mono capsule — "Live", "Featured", the hero's caption pill. Drawn
 * on shadcn's `Badge`; the classes below override its `h-5` / `text-xs` /
 * border defaults, which is why `cn` has to know `text-chip` is a size.
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
    <Badge
      className={cn(
        'h-auto gap-1.5 rounded-pill border-0 px-2.5 font-mono text-chip font-normal uppercase',
        TRIMMED_PADDING,
        TONE_FILL[tone],
        className
      )}
    >
      {hasDot ? <span aria-hidden className={cn('size-1.5 rounded-pill', DOT_FILL[tone])} /> : null}
      <span className={LABEL_TRIM}>{children}</span>
    </Badge>
  );
};

export default MetaChip;
