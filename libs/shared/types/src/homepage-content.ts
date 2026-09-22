import type { SiteSection } from './site-section.js';
import type { SocialIconName } from './social-icon-name.js';

/**
 * 🧭 **OWNER: Slice 6 (Homepage).** Created by the coordinator in Slice 4 so
 * that Slice 6 and Slice 7 — which run concurrently and co-own this package —
 * never open the same file. Slice 7 must not add to this module.
 *
 * Filled in by Slice 6 from commit `39bbe56` (D53): the hero's two lines and
 * its two social links, the three skill lists, and the two project sections.
 *
 * ⚠️ **No `description` field, and no longer for the reason the previous
 * banner gave.** Q17 closed as D69: `description` is an HTML string sanitized
 * at the render boundary, and it lives on `PortfolioItem` — Slice 7's module.
 * The homepage listing renders a thumbnail and a title and never touches it.
 */

/** An outbound link in the hero (v3's LinkedIn / GitHub icons). */
export interface HomepageLink {
  /** Names the link for assistive tech; the mark itself is `aria-hidden`. */
  readonly label: string;
  readonly href: string;
  /** Which brand mark to draw (D75). */
  readonly icon: SocialIconName;
}

/** The hero panel at the top of the page. It carries no section anchor. */
export interface HomepageHero {
  readonly name: string;
  readonly headline: string;
  readonly links: readonly HomepageLink[];
}

/**
 * One column of the skills section. v3 renders three — Developer, the
 * developer-tools continuation of that same card, and UI/UX.
 */
export interface HomepageSkillGroup {
  readonly id: string;
  /**
   * Which bordered card this column sits in. v3 draws **two** cards: Developer
   * and its tools continuation share one, UI/UX has its own. The column is the
   * unit of content; the card is the unit of layout, and one card holds more
   * than one column.
   */
  readonly cardId: string;
  /**
   * The visible heading. v3 renders the second Developer column's heading
   * invisibly so the two lists' rows line up; an empty string is that case.
   */
  readonly heading: string;
  readonly skills: readonly string[];
}

/**
 * One of the two portfolio sections, naming the items it lists **by slug**.
 *
 * ⚠️ **The slugs live here rather than on `PortfolioItem` because the seam has
 * no active/other discriminator.** `usePortfolioItems()` returns one flat list
 * (`use-content-stub.ts`, coordinator-owned), and `PortfolioItem` is Slice 7's
 * module — so which projects appear under which homepage heading is homepage
 * content, and it is settled here. An item whose slug is in neither group does
 * not render on the homepage.
 */
export interface HomepageProjectGroup {
  /** Matches a `SiteSection.id`, so the heading and the anchor agree (D43). */
  readonly sectionId: string;
  readonly heading: string;
  readonly slugs: readonly string[];
}

export interface HomepageContent {
  /** The sections the Header's anchors point at (D43). */
  readonly sections: readonly SiteSection[];
  readonly hero: HomepageHero;
  readonly skillGroups: readonly HomepageSkillGroup[];
  readonly projectGroups: readonly HomepageProjectGroup[];
}
