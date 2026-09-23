import type { ReactElement } from 'react';

import { Eyebrow } from '@portfolio/ui-components';

interface PortfolioItemSummaryProps {
  lede: string;
  /** Plain-text paragraphs — not the HTML `description` (D78). */
  body: readonly string[];
}

/**
 * The `| Summary` column: the lede in display type at 26ch, then the body
 * paragraphs in muted Inter at 62ch.
 */
const PortfolioItemSummary = ({ lede, body }: PortfolioItemSummaryProps): ReactElement => {
  return (
    <div data-testid="portfolio-item-summary">
      <Eyebrow label="Summary" hasRule />
      <p className="mb-[1.6rem] mt-4 max-w-[26ch] font-display text-[clamp(1.4rem,2.8vw,2.2rem)] leading-[1.2] tracking-[-0.02em] text-ink">
        {lede}
      </p>
      <div className="flex max-w-[62ch] flex-col gap-4 text-[0.97rem] leading-[1.8] text-muted">
        {body.map((paragraph) => (
          <p key={paragraph} className="m-0">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};

export default PortfolioItemSummary;
