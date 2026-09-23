/**
 * 🧭 **OWNER: Slice 11 (the content model), then Slice 15 reads only.**
 * Created by the coordinator in Slice 4, filled by Slice 7, and extended here
 * with the redesign's field set. ⚠️ **Frozen for the whole 12/13/14/15/16
 * wave** — every wave agent reads this module and none of them edits it
 * (`parallelization.md`, "Three seams, each with exactly one owner").
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
 * shape and `PortfolioItem['images'][number]` is a usable type.
 *
 * ⚠️ **The barrel now exports `PortfolioItemImage` and `PortfolioItemVideo` by
 * name.** It exported `PortfolioItem` alone until Slice 11, and the feature lib
 * reached an image through that indexed access instead. Slice 15 derives every
 * gallery tile's span and ratio from an image's `width`/`height` (D86), so it
 * needs to name the type in a signature.
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

  /*
   * ── The redesign's fields (Slice 11, D77) ────────────────────────────────
   * Authored, never ported: none of the six below has a v3 origin. The design
   * invents them for its six projects; `rove-logix-ui-update` and
   * `older-cosmikata` appear in no export, so every value on those two is
   * invented outright and is flagged field by field in Slice 11's report.
   */

  /**
   * The year the work shipped — the design's `year`.
   *
   * ⚠️ **Not in Slice 11's field table; added as a plan correction.** The
   * design reads it twice (the Work card's footer and the detail page's
   * `client · year · role` bar), so omitting it would have left Slices 13 and
   * 15 unable to build their design against a package frozen for the wave.
   *
   * A string, not a number: `2011 – 2013` is a valid value for an engagement
   * that spans years, and nothing sorts or arithmetics on it.
   */
  readonly year: string;
  /** What Anselm did here — `Design & Engineering`, `Tech Lead`. */
  readonly role: string;
  /** The one-sentence summary under the title. ~26ch in the design. */
  readonly lede: string;
  /**
   * The detail page's body: plain paragraphs, 2–3 per item.
   *
   * ⚠️ **Plain text, unlike `description`** — and the two coexist on purpose
   * (D78). Slice 15 renders this pair in the design's slot and the HTML
   * `description` as an additional block below it.
   */
  readonly body: readonly string[];
  /**
   * The tech pills above the summary.
   *
   * ⚠️ **Derivable from `subtitle`, and deliberately not derived.** `subtitle`
   * is a discipline line (`Design / Development`), not a stack; the two happen
   * to look alike and mean different things.
   */
  readonly tech: readonly string[];
  /** The three-row fact table beside the summary. */
  readonly facts: readonly ItemFact[];
  /**
   * Outbound link pills in the detail header.
   *
   * ⚠️ **May be empty, and often is.** The design gives every project a
   * `href: '#'` placeholder; per Slice 11 a link ships only with a real URL,
   * so the five items with nothing real to point at carry an empty array
   * rather than a dead anchor.
   */
  readonly links: readonly ItemLink[];
}

/**
 * One row of the detail page's fact table.
 *
 * ⚠️ **`key`/`value`, not the design's `k`/`v`.** The export abbreviates
 * because it is hand-written template data; nothing else in this workspace
 * does, and a two-character field name in a shared type is a cost paid by
 * every reader forever.
 */
export interface ItemFact {
  /** The label — `Timeline`, `Role`, `Focus`, `Outcome`. */
  readonly key: string;
  readonly value: string;
}

/**
 * Which mark an {@link ItemLink} draws.
 *
 * ⚠️ **It lives in `shared-types` for the same reason `SocialIconName` does**
 * (D75): a fixture may never import from `libs/ui/*` (D29), so the union the
 * fixture authors against and the union the component switches on have to be
 * one declaration or they agree by luck.
 *
 * Named for meaning, not for the design's Tabler class — the export writes
 * `ti-external-link` and `ti-brand-github`, which are that icon set's names
 * and not this site's.
 */
export type ItemLinkIcon = 'external' | 'github';

/** An outbound link pill in the detail page's header. */
export interface ItemLink {
  readonly label: string;
  /**
   * ⚠️ **A real, absolute URL — never `'#'`.** The design's placeholders are
   * dropped rather than shipped; see `links` above.
   */
  readonly href: string;
  readonly icon: ItemLinkIcon;
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
