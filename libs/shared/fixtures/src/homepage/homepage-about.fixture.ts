import type { HomepageAbout, HomepageContact } from '@portfolio/shared-types';

/**
 * 🧭 **OWNER: Slice 11 (the content model), then Slice 14 reads only.**
 *
 * The About and Contact panels, ported from the homepage export (D76). Split
 * out of `homepage.fixture.ts` to stay under the 200-line cap.
 *
 * ⚠️ **Frozen for the whole 12/13/14/15/16 wave.**
 */
export const HOMEPAGE_ABOUT: HomepageAbout = {
  eyebrow: 'About',
  /*
   * ⚠️ **The design's inline emphasis is dropped here, not silently.** The
   * export bolds `looks` and sets `holds up.` bold + accent, mid-sentence.
   * `AccentedLine` only accents a trailing run, so the sentence is stored
   * plain and Slice 14 either renders it plain or reports back — see
   * `HomepageAbout.statement`.
   */
  statement: 'I bridge design and engineering. I care about both how it looks and how it holds up.',
  paragraphs: [
    'Senior Software Engineer and Tech Lead with deep experience in front-end architecture, ' +
      'design systems, and cross-functional delivery across enterprise logistics platforms, ' +
      'telecom self-service apps, mobile apps, and open-source tools.',
    'Comfortable owning an architecture decision and equally comfortable tweaking spacing ' +
      'in Figma. The whole stack of craft matters.',
  ],
  stats: [
    /*
     * ⚠️ **Both figures differ from the export, and D87 is why.** The design
     * read `13+ years shipping` in the specs strip and `10+ · Years shipping
     * production front-ends` here — the same claim twice, in different words
     * and different numbers. `10+` matched no boundary in the experience list
     * at all. The two now measure different things and each is derivable from
     * the table rendered directly above: 2011 → 2026 is 15, and 2013 → 2026 is
     * 13 anchored on the Cricket Manager title.
     */
    { value: '13+', label: 'Years in lead & architect roles' },
    { value: '6', label: 'Industries, telecom to logistics' },
  ],
};

export const HOMEPAGE_CONTACT: HomepageContact = {
  eyebrow: 'Contact',
  heading: { lead: 'Open to new work.', accent: 'Let’s talk.' },
  /*
   * ⚠️ **One pill, as the design draws it.** GitHub is not missing — the
   * footer strip carries both marks, and Slice 16 owns that strip.
   */
  links: [
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/anselm-marie/',
      icon: 'linkedin',
    },
  ],
};
