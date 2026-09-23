import type {
  ExperienceEntry,
  HomepageAbout,
  HomepageContact,
  PanelNote,
} from './homepage-panels.js';
import type { SiteSection } from './site-section.js';
import type { SocialIconName } from './social-icon-name.js';

/**
 * 🧭 **OWNER: Slice 11 (the content model), then Slices 13 and 14 read only.**
 * Created by the coordinator in Slice 4, filled by Slice 6, and reshaped here
 * for the redesign. The four lower panels live in
 * [homepage-panels.ts](./homepage-panels.ts) — see its banner for why.
 *
 * ⚠️ **Frozen for the whole 12/13/14/15/16 wave.** No wave agent edits it.
 *
 * ⚠️ **`projectGroups` is gone, and that is a content change rather than a
 * rename** (D72, D77). The built homepage renders two headed project sections;
 * the design renders one `#work` grid. The two v3 headings — `Active Projects`
 * and `Other Projects` — stop existing, and the slugs move into an ordered
 * `work` array that also carries each card's presentation.
 */

/** An outbound link — the hero's marks, and the Contact pill. */
export interface HomepageLink {
  /** Names the link for assistive tech; the mark itself is `aria-hidden`. */
  readonly label: string;
  readonly href: string;
  /** Which brand mark to draw (D75). */
  readonly icon: SocialIconName;
}

/**
 * A display line whose **trailing** run is set in the accent colour — the
 * shape the design uses for the hero headline and the Contact heading.
 *
 * Modelled rather than hardcoded so the accent break stays content: the design
 * puts it mid-sentence (`Building the front-end, | end to end.`) and a
 * component splitting on a delimiter would be guessing.
 *
 * ⚠️ **Only a trailing accent.** A sentence emphasised in its middle does not
 * fit — see `HomepageAbout.statement`, which is why that one is plain text.
 */
export interface AccentedLine {
  readonly lead: string;
  readonly accent: string;
}

/**
 * One numbered line in the hero's featured panel.
 *
 * ⚠️ **From the export's own `index` array, which its markup never renders** —
 * four capability lines the design authored and then left unused. D85 removed
 * the photograph from this region and kept the box; these fill it, so nothing
 * here is invented and no new copy was written.
 */
export interface HeroCapability {
  /** `01` … `04`. A string, because it is set as type, not counted. */
  readonly no: string;
  readonly label: string;
}

/** One of the hero's two buttons. Both point at an in-page anchor. */
export interface HomepageCta {
  readonly label: string;
  /**
   * ⚠️ **An anchor built from a `SiteSection.id`, never a literal.** Slice 12
   * owns `SITE_SECTIONS` and re-points all five anchors at once (D81); a `#work`
   * typed here by hand is the silent-failure case `SiteSection` warns about.
   */
  readonly href: string;
}

/**
 * The hero panel at the top of the page. It carries no section anchor.
 *
 * ⚠️ **`links` is gone — the design replaced the hero's two social marks with
 * the two CTAs below.** No content is lost: the same LinkedIn and GitHub
 * destinations are declared in `@portfolio/feature-footer`'s own
 * `footer-social-links.const.ts`, with identical hrefs, and the footer strip
 * draws them on every page rather than only on the homepage.
 */
export interface HomepageHero {
  readonly name: string;
  readonly headline: AccentedLine;
  /** The paragraph beside the headline. ~42ch in the design. */
  readonly lede: string;
  /** Exactly two: `View work` and `Get in touch`. */
  readonly ctas: readonly HomepageCta[];
  /**
   * The mono chip in the featured panel's bottom-left corner. The export's own
   * caption, kept when D85 replaced the photograph behind it.
   */
  readonly featuredCaption: string;
  /** What fills the featured panel now that no image does (D85). */
  readonly capabilities: readonly HeroCapability[];
}

/**
 * One card in the `#work` grid, naming its item **by slug**.
 *
 * ⚠️ **The presentation lives here, not on `PortfolioItem`.** Which projects
 * appear on the homepage and how each card is coloured is homepage content;
 * the item itself is a page that exists whether or not it is featured. That is
 * D72's split, and it is why `usePortfolioItems()` can stay one flat list.
 */
export interface HomepageWorkCard {
  /** Matches a `PortfolioItem.slug`. An unmatched slug renders no card. */
  readonly slug: string;
  /**
   * The card's fill, as a hex literal from the design's `raw` array.
   *
   * ⚠️ **A raw value, and the one place in the workspace that is correct.**
   * These are per-card editorial colours, not theme roles — there is no token
   * for "the blue the Pokémon card happens to be", and minting nine would put
   * content into `libs/ui/theme` (closed to the wave, see
   * [design-system.md](../../../../.claude/rules/design-system.md)).
   */
  readonly background: string;
  /** Flips the card's foreground to paper. True for exactly one card. */
  readonly isDark: boolean;
  /** Draws the `Live` chip. */
  readonly isLive: boolean;
}

/**
 * One column of the Skills section.
 *
 * ⚠️ **The design's four groups replaced v3's three** (maintainer's call,
 * 2026-09-22, recorded in Slice 11's report). `cardId` is gone with them: v3
 * drew two bordered cards holding three columns, the design draws four
 * columns in an `auto-fit` grid and no cards at all. ⚠️ **The UI/UX group —
 * Figma, Sketch, Adobe XD — is dropped**, which the export's own About copy
 * ("equally comfortable tweaking spacing in Figma") argues against; that was
 * put to the maintainer before this shape was written.
 */
export interface HomepageSkillGroup {
  readonly id: string;
  /** `Frontend`, `Backend`, `Architecture`, `Platform & Quality`. */
  readonly heading: string;
  readonly skills: readonly string[];
}

/**
 * A section's display copy — the eyebrow, the big heading, and the small
 * right-aligned note the design sets opposite it.
 *
 * ⚠️ **Not in Slice 11's field list; added for the same reason as
 * `PortfolioItem.year`.** The design gives Work, Experience and Skills each a
 * headline ("Things I've shipped.", "Where I've been."). With the package
 * frozen for the wave, leaving them unauthored would have forced Slices 13 and
 * 14 to hardcode site copy inside components.
 *
 * ⚠️ **Three intros, not five.** About and Contact are self-contained panels
 * in the design: About has an eyebrow and no headline, and Contact's headline
 * is its own centred display line. Each carries its `eyebrow` on its own
 * object rather than taking a `SectionIntro` with an empty `heading`.
 */
export interface SectionIntro {
  /**
   * Matches a `SiteSection.id`, so the copy and the anchor agree (D43).
   *
   * ⚠️ **Four of the five ids these intros name do not exist in
   * `SITE_SECTIONS` yet.** Slice 12 owns that fixture and re-points all five
   * anchors at once (D81), so Slice 11 authors the copy against the ids the
   * design specifies and `homepage.fixture.spec.ts` carries a tripwire that
   * goes red the moment Slice 12 lands.
   */
  readonly sectionId: string;
  /** The small mono line above the heading — `Selected work`, `Experience`. */
  readonly eyebrow: string;
  readonly heading: AccentedLine;
  /** The note set opposite — `Selected projects`, `2011 to now`. May be ''. */
  readonly aside: string;
}

export interface HomepageContent {
  /** The sections the Header's anchors point at (D43). Slice 12 owns the set. */
  readonly sections: readonly SiteSection[];
  /** Display copy for the three headed sections, looked up by `sectionId`. */
  readonly sectionIntros: readonly SectionIntro[];
  /** The five-item strip above the hero. */
  readonly specs: readonly string[];
  readonly hero: HomepageHero;
  /** The `#work` grid, in render order. */
  readonly work: readonly HomepageWorkCard[];
  readonly experience: readonly ExperienceEntry[];
  /** The award and the degree, below the Experience list. */
  readonly footnotes: readonly PanelNote[];
  readonly skillGroups: readonly HomepageSkillGroup[];
  readonly about: HomepageAbout;
  readonly contact: HomepageContact;
}
