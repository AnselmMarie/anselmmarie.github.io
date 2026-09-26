import type { ReactElement } from 'react';

import { Eyebrow } from '@portfolio/ui-components';

interface PortfolioItemMetaRowProps {
  /** Who the work was for. The item's `company`. */
  client: string;
  year: string;
  /** The item's `role`, renamed off the ARIA attribute name. */
  jobRole: string;
}

/**
 * The mono `| client  | year  | role` row above the title, each value behind
 * its own accent rule. The export's `gap:14px 26px` lets the three wrap as
 * units on a narrow screen rather than breaking mid-value.
 *
 * An empty value is skipped rather than drawn as a lone `|` — the two
 * placeholder items (`portfolio-items-upcoming.fixture.ts`) have no `role` yet.
 */
const PortfolioItemMetaRow = ({
  client,
  year,
  jobRole,
}: PortfolioItemMetaRowProps): ReactElement => {
  return (
    <div
      data-testid="portfolio-item-meta-row"
      className="flex flex-wrap items-center gap-x-[26px] gap-y-[14px]"
    >
      {client ? <Eyebrow label={client} hasRule /> : null}
      {year ? <Eyebrow label={year} hasRule /> : null}
      {jobRole ? <Eyebrow label={jobRole} hasRule /> : null}
    </div>
  );
};

export default PortfolioItemMetaRow;
