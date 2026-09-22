import type { ReactElement } from 'react';

import { cn } from '@portfolio/shared-utils';

import Eyebrow, { type EyebrowTone } from './eyebrow.js';

interface SectionHeadingProps {
  /** The plain opening phrase — "Things I've ". */
  heading: string;
  /**
   * The phrase drawn in the accent — "shipped.". ⚠️ Passed separately rather
   * than parsed out of `heading`; see the note below.
   */
  accentPhrase: string;
  /** The mono eyebrow above the heading — "Selected work". */
  eyebrow?: string;
  /** The surface this sits on. Drives both the eyebrow and the accent colour. */
  tone?: Extract<EyebrowTone, 'paper' | 'ink'>;
  /** Heading level. The page owns its outline; this component does not guess. */
  level?: 2 | 3;
  className?: string;
}

const ACCENT_TEXT = {
  paper: 'text-accent',
  ink: 'text-accent-bright',
} as const;

/**
 * A section's eyebrow plus its two-tone display heading — "Things I've
 * **shipped.**", "Where I've **been.**", "The whole **stack of craft.**".
 *
 * Six call sites across the two exports (D76).
 *
 * ⚠️ **The two halves are separate props, not a parsed string.** The split
 * point is editorial — "Things I've | shipped." breaks before the verb, "The
 * whole | stack of craft." breaks after two words — and no parser recovers
 * that. A delimiter in the string would work and would put markup in content;
 * a second prop makes the split explicit at every call site.
 *
 * ⚠️ **`level` is a prop because heading order belongs to the page.** These
 * render inside four independently deployed remotes, so the component cannot
 * know whether it is an `h2` under the hero's `h1` or an `h3` nested deeper.
 * Hard-coding `h2` would let two remotes compose into an invalid outline.
 */
const SectionHeading = ({
  heading,
  accentPhrase,
  eyebrow,
  tone = 'paper',
  level = 2,
  className,
}: SectionHeadingProps): ReactElement => {
  const Tag = level === 2 ? 'h2' : 'h3';

  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      {eyebrow ? <Eyebrow label={eyebrow} tone={tone} hasRule /> : null}
      <Tag className="m-0 font-display text-section font-bold text-balance">
        {heading} <span className={ACCENT_TEXT[tone]}>{accentPhrase}</span>
      </Tag>
    </div>
  );
};

export default SectionHeading;
