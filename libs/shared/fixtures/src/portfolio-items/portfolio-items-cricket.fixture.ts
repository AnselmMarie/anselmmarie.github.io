import type { PortfolioItem } from '@portfolio/shared-types';

/**
 * 🧭 **OWNER: Slice 11 (the content model), then Slice 15 reads only.**
 *
 * The Cricket Wireless work — one item, `cw-breeze-thru`. ⚠️ **Split out of
 * `portfolio-items-other.fixture.ts` by Slice 11**, which is a deviation from
 * that slice's file table: the redesign's six fields pushed that module to 242
 * lines against the 200-line cap
 * ([file-size.md](../../../../.claude/rules/file-size.md)). The split is by
 * client, matching `portfolio-items-other-clients.fixture.ts`'s own scheme, and
 * `portfolio-items.fixture.ts` re-assembles v3's reading order unchanged.
 *
 * ⚠️ **Frozen for the whole 12/13/14/15/16 wave.**
 */
export const CRICKET_PORTFOLIO_ITEMS: readonly PortfolioItem[] = [
  {
    slug: 'cw-breeze-thru',
    company: 'Cricket Wireless',
    title: 'Breeze-Thru',
    subtitle: 'Design / Development',
    thumbnail: '/images/portfolio/cricket-wireless/breezeThru-thumbnail.jpg',
    description: `
      <ul>
        <li>Defined the frontend architecture, UI patterns, and component approach from concept through production.</li>
        <li>Guided a four-person frontend team through implementation, code reviews, and delivery while remaining hands-on with development.</li>
        <li>Translated business and technical requirements into accessible, intuitive, and reusable user workflows.</li>
        <li>Established frontend implementation standards and reusable UI patterns that supported subsequent self-service experiences.</li>
        <li>Coordinated API and technical dependencies across network, backend, and business teams to align requirements and delivery.</li>
        <li>Helped simplify service activation and account management for new customers across mobile devices.</li>
        <li>Contributed to a user experience focused on clearer workflows, states, and accessibility.</li>
        <li>Application earned an AT&T Service Excellence Award and became a reference pattern for later self-service experiences.</li>
      </ul>
    `,
    images: [
      {
        src: '/images/portfolio/cricket-wireless/breezeThru01.jpg',
        alt: 'Breeze-Thru homepage',
        width: '414',
        height: '736',
      },
      {
        src: '/images/portfolio/cricket-wireless/breezeThru02.jpg',
        alt: 'Breeze-Thru customer check',
        width: '414',
        height: '736',
      },
      {
        src: '/images/portfolio/cricket-wireless/breezeThru03.jpg',
        alt: 'Breeze-Thru navigation',
        width: '414',
        height: '736',
      },
      {
        src: '/images/portfolio/cricket-wireless/breezeThru04.jpg',
        alt: 'Breeze-Thru add IMEI and ICCID data',
        width: '414',
        height: '736',
      },
    ],
    videos: [],
    /*
     * ⚠️ **2018, the maintainer's figure (2026-09-23).** It replaces the
     * design's 2022, which the maintainer had kept on 2026-09-22 even though
     * it contradicted the Cricket 2013–2019 row in `homepage-experience.fixture.ts`.
     * 2018 falls inside that row, so the contradiction is gone.
     */
    year: '2018',
    role: 'Senior Engineer, Tech Lead',
    // The maintainer's wording (2026-09-23), replacing the design's.
    lede: 'Led frontend design and delivery for a self-service activation experience.',
    // One paragraph by the maintainer's choice (2026-09-23); every other item carries 2–3.
    body: [
      'Led frontend design and delivery for Breeze-Thru, a mobile-first self-service activation and account management experience designed to reduce customer reliance on support and Cricket Wireless stores for tasks customers could complete themselves.',
    ],
    // The maintainer's list (2026-09-23), replacing the design's six entries.
    tech: ['Design', 'JavaScript'],
    facts: [
      { key: 'Timeline', value: '9 months' },
      { key: 'Role', value: 'Tech lead, 4 engineers' },
      {
        key: 'Focus',
        value: 'Led design and frontend to simplify workflows and improve task completion',
      },
    ],
    links: [],
  },
];
