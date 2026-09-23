import type { HomepageContent } from '@portfolio/shared-types';

import { SITE_SECTIONS } from '../site-sections/site-sections.fixture.js';
import { HOMEPAGE_ABOUT, HOMEPAGE_CONTACT } from './homepage-about.fixture.js';
import { HOMEPAGE_EXPERIENCE, HOMEPAGE_FOOTNOTES } from './homepage-experience.fixture.js';

/**
 * 🧭 **OWNER: Slice 11 (the content model), then Slices 13 and 14 read only.**
 * Created by the coordinator in Slice 4, filled by Slice 6, and reshaped here
 * for the redesign. ⚠️ **Frozen for the whole 12/13/14/15/16 wave.**
 *
 * ⚠️ **This is the site's real published copy, not a stub** (D41). The strip,
 * the hero, the section headings, the skills, the About and the Contact copy
 * are ported from the homepage export (D76); the Experience list and the two
 * footnote cards live in sibling modules, split out to stay under the 200-line
 * cap.
 *
 * ⚠️ **`projectGroups` is gone.** The two v3 headings — `Active Projects` and
 * `Other Projects` — stop existing; `work` is one ordered grid carrying each
 * card's presentation (D72, D77).
 */
export const HOMEPAGE_CONTENT: HomepageContent = {
  sections: SITE_SECTIONS,
  sectionIntros: [
    /*
     * ⚠️ **`work` and `experience` are not `SiteSection` ids yet.** Slice 12
     * re-points all five anchors in one change (D81); the tripwire in
     * `homepage.fixture.spec.ts` goes red the moment it does.
     */
    {
      sectionId: 'work',
      eyebrow: 'Selected work',
      heading: { lead: 'Things I’ve', accent: 'shipped.' },
      aside: 'Selected projects',
    },
    {
      sectionId: 'experience',
      eyebrow: 'Experience',
      heading: { lead: 'Where I’ve', accent: 'been.' },
      aside: '2011 to now',
    },
    {
      sectionId: 'skills',
      eyebrow: 'Capabilities',
      heading: { lead: 'The whole', accent: 'stack of craft.' },
      // The design sets no note opposite the Skills heading.
      aside: '',
    },
  ],
  /*
   * ⚠️ **`15+ years shipping`, not the design's `13+`** (D87). 2011 → 2026,
   * read off the last row of the Experience list rendered below it.
   */
  specs: [
    'Founder, Cosmikata',
    'Front-end Architect',
    'Tech Lead',
    '15+ years shipping',
    'Atlanta · Remote',
  ],
  hero: {
    name: 'Anselm Marie',
    headline: { lead: 'Building the front-end,', accent: 'end to end.' },
    lede:
      'I’m Anselm, founder of Cosmikata and a front-end architect & tech lead. I build ' +
      'cross-platform systems: design systems, micro-frontend platforms, and edge-first ' +
      'backends.',
    ctas: [
      { label: 'View work', href: '#work' },
      { label: 'Get in touch', href: '#contact' },
    ],
    featuredCaption: 'Design systems & platform architecture',
    /*
     * ⚠️ **The export's own `index` array, which its markup never renders.**
     * D85 took the photograph out of the featured panel and kept the box; these
     * four fill it. Ported, not invented — the design wrote them and then did
     * not use them.
     */
    capabilities: [
      { no: '01', label: 'Design Systems' },
      { no: '02', label: 'Micro-Frontends' },
      { no: '03', label: 'Cross-Platform Apps' },
      { no: '04', label: 'Edge-First Backends' },
    ],
  },
  /*
   * ⚠️ **Eight cards, not the design's six** (D77). The design's project list
   * is read as a layout specification for a card grid, never as a content
   * list, so its per-card colour assignment is extended to the two items it
   * does not cover rather than those items being dropped.
   *
   * Order is the design's, with each extra placed beside the work it belongs
   * to. `background` values are the export's own hex literals except where
   * marked invented.
   */
  work: [
    { slug: 'pokemon-pet-shop', background: '#CFD8F2', isDark: false, isLive: true },
    { slug: 'cosmikata', background: '#BFE6D2', isDark: false, isLive: true },
    { slug: 'cw-breeze-thru', background: '#E4D3BC', isDark: false, isLive: false },
    { slug: 'rove-logix', background: '#DCE3C8', isDark: false, isLive: false },
    // ⚠️ INVENTED — the design has no card for this item. A muted mauve, picked
    // to sit in the export's family while reading as separate work from
    // `rove-logix`'s sage directly above it.
    { slug: 'rove-logix-ui-update', background: '#E8DCE6', isDark: false, isLive: false },
    { slug: 'csp-generator-app', background: '#14211E', isDark: true, isLive: false },
    { slug: 'cr-caterpillar', background: '#DFDBD1', isDark: false, isLive: false },
    // ⚠️ INVENTED — as above. A cooler slate than `cosmikata`'s mint, reading
    // as the earlier version of the same product.
    { slug: 'older-cosmikata', background: '#D6DFE0', isDark: false, isLive: false },
  ],
  experience: HOMEPAGE_EXPERIENCE,
  footnotes: HOMEPAGE_FOOTNOTES,
  /*
   * ⚠️ **The design's four groups replaced v3's three** — maintainer's call,
   * 2026-09-22. `cardId` is gone with them, and the UI/UX group (Figma,
   * Sketch, Adobe XD, Design System, Web Design, Mobile Design) is dropped.
   * That drop was put to the maintainer alongside the note that this page's
   * own About copy reads "equally comfortable tweaking spacing in Figma".
   */
  skillGroups: [
    {
      id: 'frontend',
      heading: 'Frontend',
      skills: ['React', 'React Native', 'Expo', 'TypeScript', 'Next.js', 'TanStack', 'Tailwind'],
    },
    {
      id: 'backend',
      heading: 'Backend',
      skills: ['Node.js', 'Hono', 'PostgreSQL', 'Drizzle ORM', 'REST API Design'],
    },
    {
      id: 'architecture',
      heading: 'Architecture',
      skills: ['Nx Monorepo', 'Module Federation', 'Cross-Platform', 'Design Systems'],
    },
    {
      id: 'platform-quality',
      heading: 'Platform & Quality',
      skills: ['Cloudflare', 'Zephyr Cloud', 'GitHub Actions', 'Jest / Vitest', 'Storybook'],
    },
  ],
  about: HOMEPAGE_ABOUT,
  contact: HOMEPAGE_CONTACT,
};
