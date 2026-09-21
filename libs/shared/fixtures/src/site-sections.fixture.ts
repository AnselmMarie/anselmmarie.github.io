import type { SiteSection } from '@portfolio/shared-types';

/**
 * The homepage's sections, in page order (D43).
 *
 * ⚠️ **The labels are derived, not ported.** The live v3 site has no header, so
 * there is no label set to copy. `Active Projects` and `Other Projects` are the
 * verbatim `<h2>` text of v3's own sections; `Skills` names the section v3
 * renders without a heading. Flagged in Slice 3's completion report and still
 * true here.
 *
 * ⚠️ **Three remotes read this and none of them can check the others.** See
 * `SiteSection` for why that makes a rename here a silent failure rather than a
 * loud one. Changing an `id` means changing it in the Homepage's section
 * elements too, in the same commit.
 */
export const SITE_SECTIONS: readonly SiteSection[] = [
  { id: 'skills', label: 'Skills' },
  { id: 'active-projects', label: 'Active Projects' },
  { id: 'other-projects', label: 'Other Projects' },
];
