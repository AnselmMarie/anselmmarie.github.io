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
 * The `#work` grid — one flat section of cards, three columns on desktop.
 *
 * ⚠️ **`id` and `scroll-mt-anchor` are D43's three-way contract.** The Header
 * remote and the shell's header fallback both build `href="#<id>"` from
 * `SITE_SECTIONS`; a rename that only one of the three follows **scrolls
 * nowhere and throws nothing**. `scroll-mt-anchor` is the 84px
 * `--spacing-anchor`, not the 56px nav spacer — a heading needs clearance
 * below the bar, not merely to clear it (D81).
 *
 * ⚠️ **Sorted newest first by year** — maintainer's call, 2026-09-23. The
 * sort is stable, so cards sharing a year keep the fixture's relative order.
 *
 * ⚠️ **A card whose slug matches no item renders nothing.** That is a content
 * error rather than a crash, and `homepage.fixture.spec.ts` asserts the two
 * lists agree so it cannot reach here.
 */
/**
 * The year a card sorts by: the last four-digit year in the item's `year`, so
 * a range such as `2019 – 2021` sorts as 2021. A year that cannot be read
 * sorts last rather than throwing.
 */
export const sortYear = (year: string): number => {
  const last = year.match(/\d{4}/gu)?.at(-1);

  return last === undefined ? Number.NEGATIVE_INFINITY : Number(last);
};

const HomepageWorkSection = ({
  sectionId,
  intro,
  cards,
  items,
}: HomepageWorkSectionProps): ReactElement => {
  const itemBySlug = new Map(items.map((item) => [item.slug, item]));
  const entries = cards
    .flatMap((card) => {
      const item = itemBySlug.get(card.slug);

      return item === undefined ? [] : [{ card, item }];
    })
    .sort((a, b) => sortYear(b.item.year) - sortYear(a.item.year));

  return (
    <section
      id={sectionId}
      className="scroll-mt-anchor border-t border-rule bg-surface px-page py-10 frame:py-16"
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

      {/* Three columns from the `frame` breakpoint up (maintainer, 2026-09-23). */}
      <div className="grid gap-[14px] frame:grid-cols-3">
        {entries.map(({ card, item }) => (
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
        ))}
      </div>
    </section>
  );
};

export default HomepageWorkSection;
