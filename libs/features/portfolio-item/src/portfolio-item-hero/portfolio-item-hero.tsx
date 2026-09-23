import type { ReactElement } from 'react';

import type { PortfolioItemImage } from '@portfolio/shared-types';
import { MetaChip } from '@portfolio/ui-components';

interface PortfolioItemHeroProps {
  title: string;
  /** The item's `role`, renamed off the ARIA attribute name. */
  jobRole: string;
  lede: string;
  /**
   * The item's Work-card fill, as a hex literal (D85). Omitted for an item
   * with no card on the homepage, which falls back to the export's own hero
   * box colour, `--color-surface-sunk`.
   */
  background?: string;
  /**
   * The item's first gallery image, washed out behind the type. Omitted for
   * the placeholder items, which have none.
   */
  image?: PortfolioItemImage;
  /** Flips the foreground to paper, as on the item's Work card. */
  isDark?: boolean;
}

const DARK_TONE = { text: 'text-paper', rule: 'text-accent-bright' } as const;
const LIGHT_TONE = { text: 'text-ink', rule: 'text-accent' } as const;

/**
 * The hero card: `4/3` on mobile, `16/7` from 760px, `22px` radius.
 *
 * ⚠️ **It holds the page's `<h1>`** (maintainer's call, 2026-09-23) — the
 * export's title above the hero is gone, so the name appears once, here.
 *
 * ⚠️ **The photograph is still not a hero photograph (D85).** The card keeps
 * the item's Work-card colour and carries the title, `role` and `lede` as
 * type. What changed on 2026-09-23 is a faint layer of the item's **first
 * gallery image** over that colour — texture, not content, so it is
 * `alt=""` and hidden from assistive tech. The gallery below shows the same
 * image properly. `item.hero` still does not exist.
 */
const PortfolioItemHero = ({
  title,
  jobRole,
  lede,
  background,
  image,
  isDark = false,
}: PortfolioItemHeroProps): ReactElement => {
  const tone = isDark ? DARK_TONE : LIGHT_TONE;

  return (
    <div
      data-testid="portfolio-item-hero"
      style={background ? { backgroundColor: background } : undefined}
      className={`relative aspect-[4/3] overflow-hidden rounded-card bg-surface-sunk frame:aspect-[16/7] ${tone.text}`}
    >
      {image ? (
        <img
          src={image.src}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover object-top opacity-[0.12] mix-blend-multiply"
        />
      ) : null}
      <div className="relative flex h-full flex-col justify-center gap-4 p-8 frame:p-12">
        <h1 className="m-0 font-display text-[clamp(2.6rem,7vw,5.4rem)] font-bold leading-[0.95] tracking-[-0.04em]">
          {title}
          <span aria-hidden className={tone.rule}>
            .
          </span>
        </h1>
        <p className="m-0 max-w-[38ch] text-[clamp(0.95rem,1.6vw,1.2rem)] leading-[1.5] opacity-75">
          {lede}
        </p>
      </div>
      {jobRole ? (
        <MetaChip tone="paper" className="absolute bottom-[1.1rem] left-[1.1rem]">
          {jobRole}
        </MetaChip>
      ) : null}
    </div>
  );
};

export default PortfolioItemHero;
