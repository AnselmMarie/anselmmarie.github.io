import type { ReactElement } from 'react';

import type { ItemFact } from '@portfolio/shared-types';

interface PortfolioItemFactsProps {
  facts: readonly ItemFact[];
}

/**
 * The fact table under the tech chips — rule-topped `key` / `value` pairs.
 *
 * A `<dl>`, because that is what the export's stack of label-over-value pairs
 * is; the visual is unchanged by the element choice.
 */
const PortfolioItemFacts = ({ facts }: PortfolioItemFactsProps): ReactElement | null => {
  // The two placeholder items carry no facts yet; an empty `<dl>` would still
  // push the column down by its top margin.
  if (facts.length === 0) {
    return null;
  }

  return (
    <dl data-testid="portfolio-item-facts" className="m-0 mt-8 flex flex-col gap-4">
      {facts.map((fact) => (
        <div key={fact.key} className="flex flex-col gap-1 border-t border-rule pt-3">
          <dt className="font-mono text-chip uppercase text-muted">{fact.key}</dt>
          <dd className="m-0 text-[0.95rem] text-ink">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
};

export default PortfolioItemFacts;
