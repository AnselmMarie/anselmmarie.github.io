import type { ReactElement } from 'react';

import type { ItemAiEnhancement, ItemAiEnhancementStatus } from '@portfolio/shared-types';
import { MetaChip, PanelCard, SectionHeading } from '@portfolio/ui-components';

interface PortfolioItemAiEnhancementsProps {
  aiEnhancements?: readonly ItemAiEnhancement[];
}

/** Each card reads problem → built → result, as an FDE case study would. */
const CARD_ROWS: readonly { key: 'problem' | 'built' | 'result'; label: string }[] = [
  { key: 'problem', label: 'Problem' },
  { key: 'built', label: 'Built' },
  { key: 'result', label: 'Result' },
];

const STATUS_LABEL: Readonly<Record<ItemAiEnhancementStatus, string>> = {
  shipped: 'Shipped',
  planned: 'Planned',
};

/**
 * The `| AI Enhancements` section, between the videos and the gallery
 * (maintainer, 2026-10-19). Only `cosmikata` has any, so this returns `null`
 * for the rest rather than rendering an empty heading.
 *
 * ⚠️ **INVENTED — no design draws this block.** It borrows the page's own
 * vocabulary instead: the ruled section and `SectionHeading` of the gallery,
 * and a `PanelCard` per enhancement with a
 * `MetaChip` status above its title, then the facts table's mono-label
 * `<dl>` for problem / built / result. Only shipped work gets the status dot.
 */
const PortfolioItemAiEnhancements = ({
  aiEnhancements = [],
}: PortfolioItemAiEnhancementsProps): ReactElement | null => {
  if (aiEnhancements.length === 0) {
    return null;
  }

  return (
    <section
      data-testid="portfolio-item-ai-enhancements"
      className="border-t border-rule px-page py-10 frame:py-16"
    >
      <SectionHeading
        eyebrow="AI Enhancements"
        heading="Where AI"
        accentPhrase="pulls its weight."
        className="mb-[26px]"
      />
      <ul className="m-0 grid list-none grid-cols-1 gap-3.5 p-0 frame:grid-cols-2">
        {aiEnhancements.map((enhancement) => (
          <li key={enhancement.title} data-status={enhancement.status}>
            <PanelCard className="flex h-full flex-col gap-3">
              <MetaChip tone="ink" className="self-start" hasDot={enhancement.status === 'shipped'}>
                {STATUS_LABEL[enhancement.status]}
              </MetaChip>
              <h3 className="m-0 text-[1.15rem] font-semibold text-ink">{enhancement.title}</h3>
              <dl className="m-0 flex flex-col gap-3">
                {CARD_ROWS.map(({ key, label }) => (
                  <div key={key} className="flex flex-col gap-1">
                    <dt className="font-mono text-chip uppercase text-muted">{label}</dt>
                    <dd className="m-0 text-[0.95rem] leading-[1.6] text-ink">
                      {enhancement[key]}
                    </dd>
                  </div>
                ))}
              </dl>
            </PanelCard>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PortfolioItemAiEnhancements;
