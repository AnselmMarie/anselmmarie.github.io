import type { ReactElement } from 'react';

import { useHomepageContent, usePortfolioItem } from '@portfolio/shared-fixtures';
import type { PortfolioItem as PortfolioItemModel } from '@portfolio/shared-types';

import PortfolioItemGallery from '../portfolio-item-gallery/portfolio-item-gallery.js';
import PortfolioItemHeader from '../portfolio-item-header/portfolio-item-header.js';
import PortfolioItemHero from '../portfolio-item-hero/portfolio-item-hero.js';
import PortfolioItemNextBlock from '../portfolio-item-next-block/portfolio-item-next-block.js';
import PortfolioItemOverview from '../portfolio-item-overview/portfolio-item-overview.js';
import PortfolioItemVideos from '../portfolio-item-videos/portfolio-item-videos.js';
import PortfolioItemUnavailable from './portfolio-item-unavailable.js';

/**
 * ⚠️ **Standalone-preview only.** `nx dev portfolio-item` serves this remote on
 * its own page with no host to hand it an item, so it needs one item to draw.
 * It is **not** a resolution strategy: inside the shell the resolved item
 * arrives as the `item` prop.
 */
export const PREVIEW_SLUG = 'pokemon-pet-shop';

interface PortfolioItemProps {
  /**
   * D4 / D15 / D73 — the shell resolves the slug and hands over the item. This
   * remote does no routing and never reads `params`, which is what lets it
   * render identically on 4177 and at `/portfolio/$slug`.
   */
  item?: PortfolioItemModel;
}

/**
 * 🧭 **OWNER: Slice 15.** The portfolio detail page, per the 2026-09-22
 * design export: header + links + hero, the tech/facts/summary overview, the
 * gallery, and the dark next block. Two blocks the design omits — the HTML
 * `description` and the videos — are kept and rendered (D78).
 *
 * ⚠️ **The body is HTML and is sanitized, never rendered raw** (D69). That
 * happens in `PortfolioItemDescription`, inside the overview.
 *
 * ⚠️ **No asset URL is composed here** (D42). Every image `src` arrives in the
 * item, so an image survives a rollback of this remote unchanged.
 */
const PortfolioItem = ({ item }: PortfolioItemProps): ReactElement => {
  // ⚠️ **Both hooks are called unconditionally, never inside a `??` or after
  // the early return.** They read fixtures today and call no React hook, but
  // the Contentful plan gives them real bodies, and then the call order would
  // change with the prop.
  const previewItem = usePortfolioItem(PREVIEW_SLUG);
  const { work } = useHomepageContent();
  const resolved = item ?? previewItem;

  if (!resolved) {
    return <PortfolioItemUnavailable />;
  }

  // D85 — the hero borrows the item's Work-card colour. An item with no card
  // (six are hidden from the homepage) gets the hero's default fill.
  const card = work.find((entry) => entry.slug === resolved.slug);

  return (
    <article data-testid="portfolio-item-remote" className="text-ink">
      <div className="flex flex-col gap-[26px] px-page py-10 frame:py-16">
        <PortfolioItemHeader
          company={resolved.company}
          year={resolved.year}
          jobRole={resolved.role}
          links={resolved.links}
        />
        <PortfolioItemHero
          title={resolved.title}
          jobRole={resolved.role}
          lede={resolved.lede}
          background={card?.background}
          image={resolved.images[0]}
          isDark={card?.isDark}
        />
      </div>
      <PortfolioItemOverview
        tech={resolved.tech}
        facts={resolved.facts}
        lede={resolved.lede}
        body={resolved.body}
        description={resolved.description}
      />
      <PortfolioItemVideos videos={resolved.videos} />
      <PortfolioItemGallery images={resolved.images} />
      <PortfolioItemNextBlock />
    </article>
  );
};

export default PortfolioItem;
