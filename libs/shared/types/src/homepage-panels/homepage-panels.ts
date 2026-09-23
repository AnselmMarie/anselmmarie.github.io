import type { AccentedLine, HomepageLink } from '../homepage-content/homepage-content.js';

/**
 * 🧭 **OWNER: Slice 11 (the content model), then Slice 14 reads only.**
 *
 * The four lower homepage panels the redesign adds — Experience, its two
 * footnote cards, About, and Contact. ⚠️ **Split out of
 * `homepage-content.ts` by Slice 11**, which is a deviation from that slice's
 * file table: the combined module would have run past the 200-line cap
 * ([file-size.md](../../../../.claude/rules/file-size.md)). The split is by
 * page region, so Slice 13 reads only `homepage-content.ts` and Slice 14 reads
 * both.
 *
 * ⚠️ **Frozen for the whole 12/13/14/15/16 wave.** No wave agent edits it.
 */

/** One row of the Experience accordion. Seven of them, newest first. */
export interface ExperienceEntry {
  /**
   * Stable across renders, and the accordion's open/closed key.
   *
   * ⚠️ **Not the array index, and not the company name.** `Cricket Wireless`
   * appears twice — 2013–2019 and 2020–2023 — so a company-keyed accordion
   * would open both rows at once.
   */
  readonly id: string;
  readonly company: string;
  readonly role: string;
  /** `2020 – 2023`, `2025 – Present`. An en dash, as the design sets it. */
  readonly period: string;
  /** `Atlanta, GA`, `Remote`. */
  readonly place: string;
  /** One middot-joined line, authored as a single string exactly as drawn. */
  readonly stack: string;
  readonly points: readonly string[];
}

/**
 * One of the two cards below the Experience list — the award and the degree.
 *
 * ⚠️ **`key`/`title`/`detail`, not the design's `k`/`t`/`d`.** Same reason as
 * `ItemFact`: the export abbreviates, this workspace does not.
 */
export interface PanelNote {
  /** The accent eyebrow — `Award`, `Education`. */
  readonly key: string;
  readonly title: string;
  readonly detail: string;
}

/** One of the two stat cards beside the About copy. */
export interface AboutStat {
  /** The large figure — `15+`, `6`. */
  readonly value: string;
  readonly label: string;
}

export interface HomepageAbout {
  /** The small mono line above the statement — `About`. */
  readonly eyebrow: string;
  /**
   * The large display sentence above the body copy.
   *
   * ⚠️ **Plain text: the design's two inline emphases are NOT modelled.** The
   * export bolds `looks` and sets `holds up.` bold + accent, mid-sentence —
   * which {@link AccentedLine} cannot express, since that shape only accents a
   * trailing run. Slice 14 renders this plain, or reports back and the
   * coordinator opens a pass; it does **not** hardcode the two emphasised
   * words in JSX, which would put content in a component.
   */
  readonly statement: string;
  readonly paragraphs: readonly string[];
  readonly stats: readonly AboutStat[];
}

export interface HomepageContact {
  /** The small mono line above the heading — `Contact`. */
  readonly eyebrow: string;
  readonly heading: AccentedLine;
  /** The design draws one pill (LinkedIn); the footer strip carries the rest. */
  readonly links: readonly HomepageLink[];
}
