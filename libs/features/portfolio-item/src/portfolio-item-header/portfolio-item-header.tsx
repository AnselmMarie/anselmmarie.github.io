import type { ReactElement } from 'react';

import type { ItemLink } from '@portfolio/shared-types';

import PortfolioItemLinks from './portfolio-item-links.js';
import PortfolioItemMetaRow from './portfolio-item-meta-row.js';

interface PortfolioItemHeaderProps {
  /** Who the work was for. */
  company: string;
  year: string;
  /** What Anselm did — the item's `role`. Not `role`: that is an ARIA attribute. */
  jobRole: string;
  links: readonly ItemLink[];
}

/**
 * The strip above the hero: the meta row on the left, the `Links` column on
 * the right, end-aligned, wrapping to a stack on narrow screens.
 *
 * ⚠️ **No title here — maintainer's call, 2026-09-23.** The export draws the
 * title above the hero; the page's `<h1>` now lives inside the hero card
 * instead, so the name appears once.
 *
 * ⚠️ **No bar.** The export's brand + `← All work` row is the Header remote's
 * `detail` variant (Slice 12), not this remote's.
 */
const PortfolioItemHeader = ({
  company,
  year,
  jobRole,
  links,
}: PortfolioItemHeaderProps): ReactElement => {
  return (
    <header
      data-testid="portfolio-item-header"
      className="flex flex-wrap items-end justify-between gap-x-10 gap-y-[26px]"
    >
      <PortfolioItemMetaRow client={company} year={year} jobRole={jobRole} />
      <PortfolioItemLinks links={links} />
    </header>
  );
};

export default PortfolioItemHeader;
