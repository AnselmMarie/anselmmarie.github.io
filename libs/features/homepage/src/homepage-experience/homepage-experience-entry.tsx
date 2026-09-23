import type { ReactElement } from 'react';

import type { ExperienceEntry } from '@portfolio/shared-types';
import { UiIcon } from '@portfolio/ui-components';

interface HomepageExperienceEntryProps {
  entry: ExperienceEntry;
  /** The id the header's `aria-controls` points at. */
  panelId: string;
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * One row of the Experience accordion.
 *
 * ⚠️ **A real `<button>` with `aria-expanded` and `aria-controls` — the export
 * has none of the three.** It hangs a click handler on a `<div>`, which is
 * unreachable by keyboard and silent to a screen reader. This is the site's
 * first interactive disclosure, so it is a deliberate divergence from the
 * design rather than a silent fix.
 *
 * ⚠️ **The body is unmounted when closed, not `display:none`.** That is what
 * makes the accordion's spec able to fail: a body always present in the DOM
 * passes a "renders when open" assertion whether or not the toggle works.
 */
const HomepageExperienceEntry = ({
  entry,
  panelId,
  isOpen,
  onToggle,
}: HomepageExperienceEntryProps): ReactElement => {
  return (
    <div className="border-b border-rule">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="grid w-full grid-cols-[1fr_auto] items-center gap-4 py-[1.35rem] text-left"
      >
        <span className="grid min-w-0 items-center justify-items-start gap-4 frame:grid-cols-[max-content_minmax(0,1fr)]">
          <span className="font-display text-company font-bold text-ink">{entry.company}</span>
          <span className="text-[0.92rem] text-muted">{entry.role}</span>
        </span>
        <span className="flex items-center gap-5">
          <span className="hidden font-mono text-eyebrow tracking-eyebrow uppercase text-muted frame:inline">
            {entry.period}
          </span>
          <span
            className={`grid size-[30px] shrink-0 place-items-center rounded-pill border ${
              isOpen ? 'border-accent-bright bg-accent-bright' : 'border-rule'
            }`}
          >
            <UiIcon name={isOpen ? 'minus' : 'plus'} size={16} />
          </span>
        </span>
      </button>

      {isOpen ? (
        <div
          id={panelId}
          className="grid gap-5 pb-[1.6rem] frame:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
        >
          <div className="flex flex-col gap-2 font-mono text-[0.72rem] tracking-[0.12em] uppercase text-muted">
            {/* The period sits in the closed row above 760px, so it is repeated
                here only where that one is hidden. */}
            <span className="frame:hidden">{entry.period}</span>
            <span>{entry.place}</span>
            <span className="max-w-[28ch] leading-[1.6] tracking-[0.04em] text-accent">
              {entry.stack}
            </span>
          </div>
          <div className="flex flex-col gap-[0.65rem]">
            {entry.points.map((point) => (
              <div key={point} className="flex gap-[0.7rem] text-[0.92rem] leading-[1.6]">
                <span aria-hidden className="shrink-0 text-accent">
                  |
                </span>
                {point}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default HomepageExperienceEntry;
