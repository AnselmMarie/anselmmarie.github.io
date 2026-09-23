import type { ReactElement } from 'react';

import type { HomepageContent, PortfolioItem, SectionIntro } from '@portfolio/shared-types';
import { SectionHeading } from '@portfolio/ui-components';

import HomepageWorkCard from './homepage-work-card.js';

type WorkCard = HomepageContent['work'][number];

interface HomepageWorkSectionProps {
  sectionId: string;
  intro: SectionIntro;
  cards: readonly WorkCard[];
  items: readonly PortfolioItem[];
}

/**
 * The `#work` grid — one flat section of eight cards.
 *
 * ⚠️ **`id` and `scroll-mt-anchor` are D43's three-way contract.** The Header
 * remote and the shell's header fallback both build `href="#<id>"` from
 * `SITE_SECTIONS`; a rename that only one of the three follows **scrolls
 * nowhere and throws nothing**. `scroll-mt-anchor` is the 84px
 * `--spacing-anchor`, not the 56px nav spacer — a heading needs clearance
 * below the bar, not merely to clear it (D81).
 *
 * ⚠️ **Eight cards, not the design's six** (D77), and the order is the
 * fixture's. This component does not sort.
 *
 * ⚠️ **A card whose slug matches no item renders nothing.** That is a content
 * error rather than a crash, and `homepage.fixture.spec.ts` asserts the two
 * lists agree so it cannot reach here.
 */
const HomepageWorkSection = ({
  sectionId,
  intro,
  cards,
  items,
}: HomepageWorkSectionProps): ReactElement => {
  const itemBySlug = new Map(items.map((item) => [item.slug, item]));

  return (
    <section
      id={sectionId}
      className="scroll-mt-anchor border-t border-rule bg-surface px-[18px] py-10 frame:px-[26px] frame:py-16"
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-[18px]">
        <SectionHeading
          eyebrow={intro.eyebrow}
          heading={intro.heading.lead}
          accentPhrase={intro.heading.accent}
        />
        {intro.aside === '' ? null : (
          <span className="font-mono text-eyebrow tracking-eyebrow uppercase text-muted">
            {intro.aside}
          </span>
        )}
      </div>

      <div className="grid gap-[14px] frame:grid-cols-3">
        {cards.map((card) => {
          const item = itemBySlug.get(card.slug);

          if (item === undefined) {
            return null;
          }

          return (
            <HomepageWorkCard
              key={card.slug}
              slug={card.slug}
              title={item.title}
              lede={item.lede}
              client={item.company}
              year={item.year}
              stack={item.tech.slice(0, 3).join(' · ')}
              background={card.background}
              isDark={card.isDark}
              isLive={card.isLive}
            />
          );
        })}
      </div>
    </section>
  );
};

export default HomepageWorkSection;
