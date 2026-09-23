import type { PortfolioItem } from '@portfolio/shared-types';

/**
 * 🧭 **OWNER: Slice 11 (the content model), then Slice 15 reads only.**
 *
 * The Corporate Reports work — one item, `cr-caterpillar`. ⚠️ **Split out of
 * `portfolio-items-other-clients.fixture.ts` by Slice 11** for the same reason
 * `portfolio-items-cricket.fixture.ts` was: the redesign's six fields pushed
 * that module to 211 lines against the 200-line cap
 * ([file-size.md](../../../../.claude/rules/file-size.md)).
 *
 * ⚠️ **One image, and it is landscape.** D86 derives the gallery from the
 * authored dimensions, so this item's gallery is a single `span 2` tile. That
 * is correct output, not a case for Slice 15 to special-case.
 *
 * ⚠️ **Frozen for the whole 12/13/14/15/16 wave.**
 */
export const CORPORATE_REPORTS_PORTFOLIO_ITEMS: readonly PortfolioItem[] = [
  {
    slug: 'cr-caterpillar',
    company: 'Corporate Reports',
    title: 'Caterpillar Inc. News App',
    subtitle: 'Design / Development',
    thumbnail: '/images/portfolio/corporate-reports/cat-thumbnail.jpg',
    description:
      '<p>I was responsible for crafting the user interface and contributing to minor ' +
      'development tasks for both the iPhone and Android versions of this app. The ' +
      'application featured real-time CAT stock prices, the latest news updates from CAT, ' +
      'video content, downloadable PDFs, and additional interactive elements.</p>',
    images: [
      {
        src: '/images/portfolio/corporate-reports/cat01.jpg',
        alt: 'Caterpillar Inc. App Design',
        width: '1000',
        height: '800',
      },
    ],
    videos: [],
    /*
     * ⚠️ **`year` and `tech` contradict v3's own record, and the maintainer
     * chose the design's values** (2026-09-22). v3 files this under Corporate
     * Reports, whose Experience row is 2011–2013 on a PhoneGap/jQuery stack;
     * the export dates it 2020 on React Native and Expo. Recorded so the next
     * reader does not re-raise it.
     */
    year: '2020',
    role: 'Senior Engineer',
    lede: 'An internal news app wired directly into the corporate content pipeline.',
    body: [
      'Employees across sites needed one reliable place for company news, and the existing intranet did not travel well to phones.',
      'The app carried real-time CAT stock prices, the latest company news, video, downloadable PDFs, and a handful of interactive pieces, pulling from the existing content pipeline.',
      'Shipping cross-platform let a small team deliver iOS and Android from one codebase, with over-the-air updates for content and layout fixes.',
    ],
    tech: ['React Native', 'Expo', 'TypeScript', 'CMS Integration', 'Push Notifications'],
    facts: [
      { key: 'Timeline', value: '4 months' },
      { key: 'Role', value: 'UI design and cross-platform development' },
      { key: 'Focus', value: 'Offline reading, push' },
    ],
    links: [],
  },
];
