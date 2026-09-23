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
    description:
      '<p>Breeze-Thru is an innovative application that facilitates the seamless activation of ' +
      'service for new customers on any mobile device.</p>' +
      '<p>In my capacity as the leader of the front-end team, I played a pivotal role in ' +
      'shaping the entire development lifecycle of this application, from its initial ' +
      'conception to its successful production launch. My responsibilities encompassed ' +
      'coding, design implementation, and team management. Throughout the process, we ' +
      'maintained a strong emphasis on optimizing user experience (UX) and ensuring ' +
      'accessibility for all users.</p>' +
      '<p>Effective communication and collaboration with the network, back-end, and business ' +
      "teams were key factors in the project's success. Our coordinated efforts culminated in " +
      'the successful launch of the application, garnering positive feedback. In recognition ' +
      'of the project\'s excellence, I was honored with "The AT&T Service Excellence Award" ' +
      'shortly thereafter.</p>',
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
     * ⚠️ **`year` contradicts this site's own Experience list, and the
     * maintainer chose the design's figure** (2026-09-22). The export dates
     * Breeze-Thru 2022; the AT&T award v3 credits to it sits under the Cricket
     * 2013–2019 row in `homepage-experience.fixture.ts`. Recorded so the next
     * reader does not re-raise it.
     */
    year: '2022',
    role: 'Senior Engineer, Tech Lead',
    lede: 'A mobile-first self-service flow that cut support calls out of routine account tasks.',
    body: [
      'Customers were phoning support for tasks they could do themselves. Breeze-Thru reframed activation and account management as a short, guided mobile flow with clear state at every step.',
      'Leading the front-end team, the work covered flow design, architecture, and hands-on delivery from concept to production launch, alongside the network, back-end, and business teams.',
      'The program earned an AT&T Service Excellence Award and became the reference pattern for later self-service surfaces.',
    ],
    tech: ['Angular', 'TypeScript', 'RxJS', 'Mobile Web', 'REST API', 'Accessibility'],
    facts: [
      { key: 'Timeline', value: '9 months' },
      { key: 'Role', value: 'Tech lead, 4 engineers' },
      { key: 'Outcome', value: 'Reduced friction, higher task completion' },
    ],
    links: [],
  },
];
