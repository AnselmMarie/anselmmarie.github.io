import type { ReactElement } from 'react';

import { cn } from '@portfolio/shared-utils';

/**
 * Which surface the eyebrow sits on. This is not a colour choice — it is the
 * surface, and the colour follows from it.
 */
export type EyebrowTone = 'paper' | 'ink' | 'accent';

interface EyebrowProps {
  /** The label text. Rendered upper-case by the type treatment, not by JS. */
  label: string;
  /** The surface this sits on. Defaults to the paper card. */
  tone?: EyebrowTone;
  className?: string;
  /** Draw the accent `|` before the label. The design omits it on meta rows. */
  hasRule?: boolean;
}

const TONE_TEXT = {
  paper: 'text-muted',
  ink: 'text-accent-bright',
  accent: 'text-accent',
} as const;

const RULE_TEXT = {
  paper: 'text-accent',
  ink: 'text-accent-bright',
  accent: 'text-accent',
} as const;

/**
 * The mono eyebrow — `| Selected work`, `| Capabilities`, `| About`.
 *
 * Lives in `libs/ui/components` because the treatment appears **eleven times**
 * across the two design exports (D76), at two sizes and on three surfaces. It
 * is the single most repeated pattern in the design, which is why it is a
 * component and not a remembered class string (D29's threshold, met by
 * inspection rather than anticipation).
 *
 * ⚠️ **`tone` is why the mint cannot land on paper.** `#3FD9A4` appears in
 * both exports *only* inside `--color-ink` sections, and `#1C7A5E` is its
 * paper counterpart. Taking the surface rather than a colour makes the wrong
 * pairing unrepresentable instead of merely documented — a caller cannot ask
 * for mint-on-paper because there is no name for it.
 */
const Eyebrow = ({
  label,
  tone = 'paper',
  className,
  hasRule = false,
}: EyebrowProps): ReactElement => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-mono text-eyebrow uppercase',
        TONE_TEXT[tone],
        className
      )}
    >
      {hasRule ? (
        <span aria-hidden className={RULE_TEXT[tone]}>
          |
        </span>
      ) : null}
      {label}
    </span>
  );
};

export default Eyebrow;
