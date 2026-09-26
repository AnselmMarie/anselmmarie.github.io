import type { SiteSection } from '@portfolio/shared-types';

/**
 * 🧭 **OWNER: Slice 12 ([D81](../../../../docs/planning/mfe-architecture/decisions-d76-d81.md#d81)).**
 * The homepage's sections, in page order (D43).
 *
 * ⚠️ **Three independently deployed units read this and none of them can check
 * the others.** The Header remote links to these ids, the Homepage remote puts
 * them on its section elements, and the shell's header fallback links to them
 * when the Header is down. A rename that only two of them follow **scrolls
 * nowhere and throws nothing** — which is why this file has exactly one owner
 * for the whole redesign wave, and why Slice 11 was forbidden to touch it even
 * though it authored the copy that points here.
 *
 * ⚠️ **Re-pointed to the design's five in Slice 12.** The previous three —
 * `skills`, `active-projects`, `other-projects` — were v3's own `<h2>` text
 * from a site that had no header at all (D59, retired by D76). The two project
 * sections stop existing: the design renders one `#work` grid, which is the
 * content change [D72](../../../../docs/planning/mfe-architecture/decisions-d71-d72.md#d72)
 * describes and `HomepageContent.work` carries.
 *
 * ⚠️ **Changing an id here means changing it in the Homepage's section
 * elements in the same commit.** `site-sections.fixture.spec.ts` asserts the
 * list; `homepage.fixture.spec.ts` asserts that every anchor the copy points at
 * resolves to one of these. Neither can see the rendered `id` attribute, so the
 * browser check in Slice 12's gates is not optional.
 */
/**
 * The five ids, by name.
 *
 * ⚠️ **The only place any of these five strings is written.** Every other
 * reader — the Homepage remote's `<section id>`, the Header's `← All work`
 * link, the hero's two CTAs — names one of these constants instead of typing
 * the string, so a rename is a compile error in the readers rather than an
 * anchor that silently scrolls nowhere.
 *
 * ⚠️ **`SITE_SECTIONS` is built from it below**, which is what keeps the two
 * from disagreeing. A section added here without a row below is not in the nav;
 * a row below without an entry here will not compile.
 */
export const SECTION_IDS = {
  work: 'work',
  experience: 'experience',
  skills: 'skills',
  about: 'about',
  contact: 'contact',
} as const;

export const SITE_SECTIONS: readonly SiteSection[] = [
  { id: SECTION_IDS.work, label: 'Work' },
  { id: SECTION_IDS.experience, label: 'Experience' },
  { id: SECTION_IDS.skills, label: 'Skills' },
  { id: SECTION_IDS.about, label: 'About' },
  { id: SECTION_IDS.contact, label: 'Contact' },
];

/**
 * The Work section's id. A named alias for `SECTION_IDS.work`, kept because the
 * Header's `← All work` link reads it and reads nothing else from this module.
 *
 * Reading `SITE_SECTIONS[0].id` instead would have been positional — correct
 * today and wrong the first time the section order changes, silently, which is
 * the whole failure mode `SiteSection` documents.
 */
export const WORK_SECTION_ID = SECTION_IDS.work;
