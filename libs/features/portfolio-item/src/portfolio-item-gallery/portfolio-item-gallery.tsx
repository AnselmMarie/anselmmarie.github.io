import type { ReactElement } from 'react';

import type { PortfolioItemImage } from '@portfolio/shared-types';
import { SectionHeading } from '@portfolio/ui-components';

interface PortfolioItemGalleryProps {
  images: readonly PortfolioItemImage[];
}

/*
 * D86 — a tile's span and ratio are **derived** from the authored dimensions
 * and bucketed to the design's two shapes. Below 760px every tile is one
 * column at `4/3`, as the export's mobile branch draws it.
 *
 * ⚠️ **Full class strings, never built from parts** — Tailwind finds classes by
 * scanning source text, so `col-span-${n}` would render unstyled (R3).
 */
const LANDSCAPE_TILE = 'aspect-[4/3] frame:col-span-2 frame:aspect-[16/9]';
const PORTRAIT_TILE = 'aspect-[4/3] frame:col-span-1 frame:aspect-[3/4]';

/**
 * Landscape when the image is at least as wide as it is tall. The authored
 * `width`/`height` are display sizes, not intrinsic, but they preserve the
 * ratio exactly — which is all this reads (D86).
 */
export const isLandscape = (image: PortfolioItemImage): boolean =>
  Number(image.width) >= Number(image.height);

/**
 * The `| Gallery` section: "Screens & artifacts." over a two-column grid.
 *
 * ⚠️ **This component composes no URL (D42).** Every `src` arrives in the data
 * exactly as authored, because the image folders do not match the slugs.
 *
 * ⚠️ **The crop is accepted, not overlooked (D86).** No image is actually 3/4
 * or 16/9; the tall mobile screenshots lose up to ~45% of their height under
 * `object-cover`. If that reads badly, `object-contain` on the tinted tile is
 * the documented one-rule fallback.
 *
 * The export's per-tile labels and its "Drop images here" note are
 * instructions to the designer and do not ship.
 */
const PortfolioItemGallery = ({ images }: PortfolioItemGalleryProps): ReactElement | null => {
  if (images.length === 0) {
    return null;
  }

  return (
    <section
      data-testid="portfolio-item-gallery"
      className="border-t border-rule px-page py-10 frame:py-16"
    >
      <SectionHeading
        eyebrow="Gallery"
        heading="Screens &"
        accentPhrase="artifacts."
        className="mb-[26px]"
      />
      <div className="grid grid-cols-1 gap-3.5 frame:grid-cols-2">
        {images.map((image) => (
          <div
            key={image.src}
            data-shape={isLandscape(image) ? 'landscape' : 'portrait'}
            className={`overflow-hidden rounded-card border border-rule bg-surface-sunk ${isLandscape(image) ? LANDSCAPE_TILE : PORTRAIT_TILE}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading="lazy"
              className="block size-full object-cover object-top"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PortfolioItemGallery;
