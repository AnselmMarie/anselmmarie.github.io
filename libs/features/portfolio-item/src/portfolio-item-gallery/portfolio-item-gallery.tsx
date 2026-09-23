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
/*
 * ⚠️ **A third shape, beyond the design's two (maintainer, 2026-09-23).** A
 * modern phone screenshot is ~9:19; under the 3/4 portrait tile it lost about
 * half its height. It is shown whole instead — see `isShownAtOwnSize`.
 */
const TALL_TILE = 'frame:col-span-1';

/** At least twice as tall as wide: a full phone screen or a long capture. */
const TALL_MAX_RATIO = 0.5;

/** A landscape image narrower than this would be stretched by the full-width tile. */
const OWN_SIZE_MAX_LANDSCAPE_WIDTH = 1000;

/** An own-size tile sizes to its image, which sits centred on the tint. */
const OWN_SIZE_TILE = 'flex items-center justify-center p-6 frame:p-10';
const OWN_SIZE_SPAN: Readonly<Record<TileShape, string>> = {
  landscape: 'frame:col-span-2',
  portrait: 'frame:col-span-1',
  tall: 'frame:col-span-1',
};

export type TileShape = 'landscape' | 'portrait' | 'tall';

const TILE_CLASS: Readonly<Record<TileShape, string>> = {
  landscape: LANDSCAPE_TILE,
  portrait: PORTRAIT_TILE,
  tall: TALL_TILE,
};

/**
 * Landscape when the image is at least as wide as it is tall. The authored
 * `width`/`height` are display sizes, not intrinsic, but they preserve the
 * ratio exactly — which is all this reads (D86).
 */
export const isLandscape = (image: PortfolioItemImage): boolean =>
  Number(image.width) >= Number(image.height);

/** The tile a given image gets, derived from its ratio alone (D86). */
export const tileShapeOf = (image: PortfolioItemImage): TileShape => {
  if (isLandscape(image)) {
    return 'landscape';
  }

  return Number(image.width) / Number(image.height) <= TALL_MAX_RATIO ? 'tall' : 'portrait';
};

/**
 * ⚠️ **Small screenshots are never stretched (maintainer, 2026-09-23).** A
 * phone shot is ~340px wide and a tablet shot ~815px; filling a ~480px or
 * ~970px tile upscaled both until they pixelated. These render at their own
 * pixel size, uncropped, instead of filling the tile.
 */
export const isShownAtOwnSize = (image: PortfolioItemImage): boolean => {
  const shape = tileShapeOf(image);

  return (
    shape === 'tall' ||
    (shape === 'landscape' && Number(image.width) < OWN_SIZE_MAX_LANDSCAPE_WIDTH)
  );
};

const tileClassOf = (image: PortfolioItemImage): string => {
  const shape = tileShapeOf(image);

  return isShownAtOwnSize(image) ? `${OWN_SIZE_TILE} ${OWN_SIZE_SPAN[shape]}` : TILE_CLASS[shape];
};

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
            data-shape={tileShapeOf(image)}
            data-own-size={isShownAtOwnSize(image)}
            className={`overflow-hidden rounded-card border border-rule bg-surface-sunk ${tileClassOf(image)}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading="lazy"
              className={
                isShownAtOwnSize(image)
                  ? 'block h-auto max-w-full'
                  : 'block size-full object-cover object-top'
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PortfolioItemGallery;
