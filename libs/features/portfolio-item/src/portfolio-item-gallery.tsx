import type { ReactElement } from 'react';

import type { PortfolioItem } from '@portfolio/shared-types';

/**
 * Named by indexed access rather than imported: `@portfolio/shared-types`'
 * barrel is the coordinator's file and exports `PortfolioItem` alone.
 */
type PortfolioItemImage = PortfolioItem['images'][number];

interface PortfolioItemGalleryProps {
  images: readonly PortfolioItemImage[];
}

/**
 * The item's screenshots (D34).
 *
 * ⚠️ **This component composes no URL (D42).** Every `src` arrives in the data
 * exactly as authored, because the image folders do not match the slugs —
 * `cricket-wireless` holds `cw-breeze-thru`'s images. Building a path from the
 * slug would 404 for two of the eight items and look like a deploy failure.
 *
 * `width` and `height` are the intrinsic sizes from the port, passed through so
 * the browser reserves the box and the page does not shift as images arrive.
 */
const PortfolioItemGallery = ({ images }: PortfolioItemGalleryProps): ReactElement | null => {
  if (images.length === 0) {
    return null;
  }

  return (
    <section data-testid="portfolio-item-gallery" className="flex flex-col gap-6">
      {images.map((image) => (
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          className="h-auto w-full rounded-lg border border-slate-200"
        />
      ))}
    </section>
  );
};

export default PortfolioItemGallery;
