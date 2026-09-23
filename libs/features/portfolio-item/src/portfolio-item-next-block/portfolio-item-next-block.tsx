import type { ReactElement } from 'react';

import { PillLink, SectionHeading } from '@portfolio/ui-components';

/** The design's larger pill, shared by both links in this block. */
const PILL_SIZE = 'h-[3.2rem] px-[1.6rem] text-[0.92rem]';

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
 * The two pills are `PillLink`'s on-ink pair: `accent` and `outline-ink`.
 */
const PortfolioItemNextBlock = (): ReactElement => {
  return (
    <section data-testid="portfolio-item-next-block" className="bg-ink px-page pt-14 text-paper">
      <div className="mb-12 flex flex-wrap items-center justify-between gap-5">
        <SectionHeading heading="Want the deeper" accentPhrase="walkthrough?" tone="ink" />
        <div className="flex flex-wrap gap-3">
          <PillLink href={CONTACT_HREF} variant="accent" className={PILL_SIZE}>
            Get in touch
          </PillLink>
          <PillLink href={WORK_HREF} variant="outline-ink" className={PILL_SIZE}>
            More work
          </PillLink>
        </div>
      </div>
      {/* No bottom padding: the footer strip supplies the 1.5rem below this rule. */}
      <div aria-hidden className="border-t border-white/10" />
    </section>
  );
};

export default PortfolioItemNextBlock;
