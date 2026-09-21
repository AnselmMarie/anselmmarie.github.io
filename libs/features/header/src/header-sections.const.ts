/**
 * The homepage sections the Header links to (D43 — the Header navigates by
 * anchor, not by route: no router singleton, no `onNavigate` prop, no injected
 * `Link`).
 *
 * ⚠️ **The ids are a contract with Slice 6, not a local detail.** The Homepage
 * is a different remote; it owns these `id` attributes and their
 * `scroll-margin-top`, and the two halves agree only by both reading this
 * module. A rename here that Slice 6 does not follow fails silently — the link
 * scrolls nowhere and nothing errors.
 *
 * ⚠️ **The labels are derived, not copied.** The live v3 site has no header,
 * so there is no label set to port. `Active Projects` and `Other Projects` are
 * the verbatim `<h2>` text of v3's own sections; `Skills` names the section v3
 * renders without a heading. Flagged in Slice 3's completion report.
 */
export interface HeaderSection {
  /** The `id` Slice 6's Homepage remote must put on the section element. */
  readonly id: string;
  readonly label: string;
}

export const HEADER_SECTIONS: readonly HeaderSection[] = [
  { id: 'skills', label: 'Skills' },
  { id: 'active-projects', label: 'Active Projects' },
  { id: 'other-projects', label: 'Other Projects' },
];
