import type { ReactElement } from 'react';

import type { ExperienceEntry } from '@portfolio/shared-types';

interface HomepageExperienceEntryBodyProps {
  entry: ExperienceEntry;
}

/**
 * The open half of an Experience row: where, the stack, and the points.
 * Mounted only while its row is open — Base UI unmounts a closed panel, which
 * is what lets the homepage's "one body at a time" spec fail.
 */
const HomepageExperienceEntryBody = ({ entry }: HomepageExperienceEntryBodyProps): ReactElement => {
  return (
    <div className="grid gap-5 text-base frame:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
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
  );
};

export default HomepageExperienceEntryBody;
