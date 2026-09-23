import type { ReactElement } from 'react';

import type { ExperienceEntry } from '@portfolio/shared-types';

interface HomepageExperienceEntryHeaderProps {
  entry: ExperienceEntry;
}

/**
 * The always-visible half of an Experience row: company, role, and (above
 * `frame`) the period. The `Accordion` wrapper draws the `+` / `−` ring beside
 * it and owns the `<button>`.
 *
 * ⚠️ **The hover state is invented** (maintainer's ask, 2026-09-23) — the
 * export draws none. On hover or keyboard focus the company name turns
 * `accent`; `group-*` here reads the Accordion trigger, which carries `group`.
 */
const HomepageExperienceEntryHeader = ({
  entry,
}: HomepageExperienceEntryHeaderProps): ReactElement => {
  return (
    <span className="grid grid-cols-[1fr_auto] items-center gap-4">
      <span className="grid min-w-0 items-center justify-items-start gap-4 frame:grid-cols-[max-content_minmax(0,1fr)]">
        <span className="font-display text-company font-bold text-ink transition-colors group-hover:text-accent group-focus-visible:text-accent">
          {entry.company}
        </span>
        <span className="text-[0.92rem] text-muted">{entry.role}</span>
      </span>
      <span className="hidden font-mono text-eyebrow tracking-eyebrow uppercase text-muted frame:inline">
        {entry.period}
      </span>
    </span>
  );
};

export default HomepageExperienceEntryHeader;
