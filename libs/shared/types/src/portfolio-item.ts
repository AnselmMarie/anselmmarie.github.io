/**
 * 🧭 **OWNER: Slice 7 (Portfolio Item).** Created by the coordinator in Slice 4
 * so that Slice 6 and Slice 7 — which run concurrently and co-own this package
 * — never open the same file. Slice 6 must not add to this module.
 *
 * The shape is v3's `PortfolioDataInter` at commit `39bbe56` (D53), carried
 * over field for field. `id` is renamed `slug` because it is the
 * `/portfolio/$slug` segment; nothing else is renamed.
 *
 * ⚠️ **The slug is the `id` from v3's data, unchanged.** The image folder names
 * do not match the slugs (`cricket-wireless` holds `cw-breeze-thru`'s images,
 * `corporate-reports` holds `cr-caterpillar`'s); the data's own path strings
 * are authoritative and are never composed from a slug.
 *
 * ⚠️ **`images` and `videos` are required, not optional.** v3 left them off the
 * items that have none; here they are empty arrays, so every consumer maps one
 * shape and `PortfolioItem['images'][number]` is a usable type. That indexed
 * access is how the feature lib names an image without a second barrel export —
 * `index.ts` is the coordinator's file and exports `PortfolioItem` alone.
 */
export interface PortfolioItem {
  /** The `/portfolio/$slug` segment. v3's `id`, carried over unchanged. */
  readonly slug: string;
  readonly title: string;
  /** Who the work was for — `Rove Logix`, `Freelancing/Concepts`. */
  readonly company: string;
  /** The discipline line — `Design / Development`. */
  readonly subtitle: string;
  /** Listing thumbnail. An origin-relative path served by the shell (D42). */
  readonly thumbnail: string;
  /**
   * ⚠️ **An HTML string, not plain text** — `<p>`, `<ul>`/`<li>` and
   * `<a target="_blank">`, exactly as authored in v3.
   *
   * Per **D69** it stays HTML and is **sanitized at the render boundary** by
   * `@portfolio/feature-portfolio-item`, client-side only (D36 keeps the body
   * out of the SSR HTML). Never render it with a bare
   * `dangerouslySetInnerHTML`, and never read it as text.
   *
   * ⚠️ **This is not the route's meta description.** That one is authored plain
   * text in `route-metadata.fixture.ts` (D48) and is never derived by stripping
   * tags from this field.
   */
  readonly description: string;
  readonly images: readonly PortfolioItemImage[];
  /** YouTube embed URLs — a third-party iframe, and the only one on the site. */
  readonly videos: readonly PortfolioItemVideo[];
}

export interface PortfolioItemImage {
  /** Origin-relative path. Authoritative — never inferred from the slug. */
  readonly src: string;
  readonly alt: string;
  /** Intrinsic width, as authored in v3 — a string, kept so the port is exact. */
  readonly width: string;
  readonly height: string;
}

export interface PortfolioItemVideo {
  readonly src: string;
  readonly title: string;
  /** Plain text, unlike the item's own `description`. */
  readonly description: string;
}
