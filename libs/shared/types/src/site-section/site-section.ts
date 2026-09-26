/**
 * One in-page section of the homepage, addressable by anchor (D43).
 *
 * ⚠️ **The `id` is a three-way contract, which is why this shape is here and
 * not inside any one of the three.** The Header remote links to it, the
 * Homepage remote puts it on a section element, and the shell's header
 * fallback links to it when the Header remote is down. Those are three
 * independently deployed units; a rename that only two of them follow fails
 * **silently** — the link scrolls nowhere and nothing throws.
 *
 * Extracted here on 2026-09-21 (Slice 4). It was `HeaderSection` in
 * `@portfolio/feature-header` when it had one reader; the shell's fallback is
 * the second, which is D29's threshold.
 */
export interface SiteSection {
  /** The `id` the Homepage remote must put on the section element. */
  readonly id: string;
  readonly label: string;
}
