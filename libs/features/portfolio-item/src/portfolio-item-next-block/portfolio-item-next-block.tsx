import type { ReactElement } from 'react';

import { SectionHeading } from '@portfolio/ui-components';

/*
 * The shell's homepage anchors. Plain hrefs, not router links: this is a
 * federated remote and must not import the shell's router (D43).
 */
const CONTACT_HREF = '/#contact';
const WORK_HREF = '/#work';

/**
 * The dark "Want the deeper walkthrough?" block that closes the page.
 *
 * ⚠️ **It stops at its bottom rule (D79).** The `© 2026` strip beneath it in
 * the export belongs to the footer remote, so in isolation this block looks
 * unfinished on purpose — same as the homepage's Contact block.
 *
 * The two pills are hand-drawn rather than `PillLink`s: the design puts them
 * on ink, and `PillLink`'s variants are the paper pair.
 */
const PortfolioItemNextBlock = (): ReactElement => {
  return (
    <section data-testid="portfolio-item-next-block" className="bg-ink px-page pt-14 text-paper">
      <div className="mb-12 flex flex-wrap items-center justify-between gap-5">
        <SectionHeading heading="Want the deeper" accentPhrase="walkthrough?" tone="ink" />
        <div className="flex flex-wrap gap-3">
          <a
            href={CONTACT_HREF}
            className="rounded-pill bg-accent-bright px-[1.6rem] py-[0.85rem] text-[0.92rem] font-medium text-ink transition-colors hover:bg-accent-bright/80"
          >
            Get in touch
          </a>
          <a
            href={WORK_HREF}
            className="rounded-pill border border-white/22 px-[1.6rem] py-[0.85rem] text-[0.92rem] font-medium text-paper transition-colors hover:border-paper"
          >
            More work
          </a>
        </div>
      </div>
      {/* No bottom padding: the footer strip supplies the 1.5rem below this rule. */}
      <div aria-hidden className="border-t border-white/10" />
    </section>
  );
};

export default PortfolioItemNextBlock;
