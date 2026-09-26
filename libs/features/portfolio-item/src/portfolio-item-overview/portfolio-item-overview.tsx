import type { ReactElement } from 'react';

import type { ItemFact } from '@portfolio/shared-types';

import PortfolioItemDescription from './portfolio-item-description.js';
import PortfolioItemFacts from './portfolio-item-facts.js';
import PortfolioItemSummary from './portfolio-item-summary.js';
import PortfolioItemTechChips from './portfolio-item-tech-chips.js';

interface PortfolioItemOverviewProps {
  tech: readonly string[];
  facts: readonly ItemFact[];
  lede: string;
  body: readonly string[];
  /** The ported HTML body (D69, D78). Sanitized one level down. */
  description: string;
}

/**
 * The tech / facts / summary section on `--color-surface`: two columns at
 * 1080px and up (`1fr / 1.5fr`), stacked below.
 *
 * ⚠️ **The description sits under the summary, in the right column** — the
 * plan's placement call for D78's invented block, so it reads as more of the
 * same story rather than as a separate section.
 */
const PortfolioItemOverview = ({
  tech,
  facts,
  lede,
  body,
  description,
}: PortfolioItemOverviewProps): ReactElement => {
  return (
    <section
      data-testid="portfolio-item-overview"
      className="border-t border-rule bg-surface px-page py-10 frame:py-16"
    >
      <div className="grid grid-cols-1 items-start gap-x-12 gap-y-[34px] wide:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <div>
          <PortfolioItemTechChips tech={tech} />
          <PortfolioItemFacts facts={facts} />
        </div>
        <div className="min-w-0">
          <PortfolioItemSummary lede={lede} body={body} />
          <PortfolioItemDescription html={description} />
        </div>
      </div>
    </section>
  );
};

export default PortfolioItemOverview;
