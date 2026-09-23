import type { ReactElement } from 'react';

import { Eyebrow } from '@portfolio/ui-components';

interface PortfolioItemTechChipsProps {
  tech: readonly string[];
}

/**
 * The `| Technologies` list — pill chips on paper with a rule border.
 *
 * ⚠️ **A list, not a row of spans.** The export draws spans; a screen reader
 * announcing "list, 7 items" is the only way the count reaches a listener.
 */
const PortfolioItemTechChips = ({ tech }: PortfolioItemTechChipsProps): ReactElement => {
  return (
    <div>
      <Eyebrow label="Technologies" hasRule />
      <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
        {tech.map((name) => (
          <li
            key={name}
            className="rounded-pill border border-rule bg-paper px-[0.85rem] py-[0.45rem] text-[0.82rem] text-ink"
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PortfolioItemTechChips;
