import type { ReactElement } from 'react';

import { usePortfolioItem } from '@portfolio/shared-fixtures';
import type { PortfolioItem as PortfolioItemModel } from '@portfolio/shared-types';

import PortfolioItemDescription from './portfolio-item-description.js';
import PortfolioItemGallery from './portfolio-item-gallery.js';
import PortfolioItemHeader from './portfolio-item-header.js';
import PortfolioItemUnavailable from './portfolio-item-unavailable.js';
import PortfolioItemVideos from './portfolio-item-videos.js';

/**
 * ⚠️ **Standalone-preview only.** `nx dev portfolio-item` serves this remote on
 * its own page with no host to hand it an item, so it needs one item to draw.
 * It is **not** a resolution strategy: inside the shell the resolved item
 * arrives as the `item` prop.
 */
export const PREVIEW_SLUG = 'pokemon-pet-shop';

interface PortfolioItemProps {
  /**
   * D4 / D15 — the shell resolves the slug and hands over the item. This remote
   * does no routing and never reads `params`, which is what lets it render
   * identically on 4177 and at `/portfolio/$slug`.
   */
  item?: PortfolioItemModel;
}

/**
 * 🧭 **OWNER: Slice 7.** The portfolio item page, matching the live v3 item
 * page (D34) — masthead, body, screenshots, and video where an item has any.
 *
 * ⚠️ **The body is HTML and is sanitized, never rendered raw** (D69). That
 * happens one level down, in `PortfolioItemDescription`.
 *
 * ⚠️ **No asset URL is composed here** (D42). Every image `src` arrives in the
 * item, so an image survives a rollback of this remote unchanged.
 */
const PortfolioItem = ({ item }: PortfolioItemProps): ReactElement => {
  // ⚠️ **Called unconditionally, never inside the `??`.** `usePortfolioItem`
  // reads a fixture today and calls no React hook, so `item ?? usePortfolioItem(...)`
  // would work — right up until the Contentful plan gives it a real hook body,
  // at which point the call order changes with the prop and React breaks.
  const previewItem = usePortfolioItem(PREVIEW_SLUG);
  const resolved = item ?? previewItem;

  if (!resolved) {
    return <PortfolioItemUnavailable />;
  }

  return (
    <article data-testid="portfolio-item-remote" className="flex flex-col gap-10">
      <PortfolioItemHeader
        title={resolved.title}
        company={resolved.company}
        subtitle={resolved.subtitle}
      />
      <PortfolioItemDescription html={resolved.description} />
      <PortfolioItemVideos videos={resolved.videos} />
      <PortfolioItemGallery images={resolved.images} />
    </article>
  );
};

export default PortfolioItem;
