import type { PortfolioItem } from '@portfolio/shared-types';

/**
 * 🧭 **OWNER: Slice 7 (Portfolio Item).** The second half of v3's
 * `src/store/other.data.ts` at commit `39bbe56` (D53), ported field for field.
 * Split from `portfolio-items-other.fixture.ts` only to stay under the
 * 200-line source cap.
 *
 * ⚠️ **`corporate-reports` holds `cr-caterpillar`'s images.** The folder names
 * do not match the slugs; the `src` strings below are authoritative.
 */
export const OTHER_CLIENT_PORTFOLIO_ITEMS: readonly PortfolioItem[] = [
  {
    slug: 'rove-logix',
    company: 'Rove Logix',
    title: 'Company Development',
    subtitle: 'Design / Development',
    thumbnail: '/images/portfolio/rove-logix/app-thumbnail.jpg',
    description:
      '<p>I helped develop a Software as a Service (SaaS) application tailored for firms ' +
      'specializing in land surveying, engineering, and geospatial services. My ' +
      'responsibilities encompassed the design of all application elements, followed by ' +
      'active participation in the development phase.</p>',
    images: [
      {
        src: '/images/portfolio/rove-logix/app01.jpg',
        alt: 'Rove Logix Client App Settings',
        width: '733',
        height: '590',
      },
      {
        src: '/images/portfolio/rove-logix/app02.jpg',
        alt: 'Rove Logix Client App Permission Settings',
        width: '733',
        height: '475',
      },
      {
        src: '/images/portfolio/rove-logix/email02.jpg',
        alt: 'Rove Logix Email New Account',
        width: '800',
        height: '1944',
      },
      {
        src: '/images/portfolio/rove-logix/email03.png',
        alt: 'Rove Logix Email Payment',
        width: '800',
        height: '900',
      },
      {
        src: '/images/portfolio/rove-logix/icon01.jpg',
        alt: 'Rove Logix App Icon',
        width: '604',
        height: '924',
      },
      {
        src: '/images/portfolio/rove-logix/website01.jpg',
        alt: 'Rove Logix Homepage',
        width: '1200',
        height: '900',
      },
      {
        src: '/images/portfolio/rove-logix/website02.jpg',
        alt: 'Rove Logix Contact page',
        width: '862',
        height: '1284',
      },
    ],
    videos: [],
  },
  {
    slug: 'rove-logix-ui-update',
    company: 'Rove Logix',
    title: 'New App Skin',
    subtitle: 'Design',
    thumbnail: '/images/portfolio/rove-logix/redesign-thumbnail.jpg',
    description:
      '<p>At a certain stage in the Rove Logix development, I initiated a redesign to achieve ' +
      'a cleaner and more modern aesthetic. This involved a meticulous focus on improving ' +
      'color contrast and selecting a more refined color palette. The changes are ' +
      'particularly noticeable on the Company Development page, where the email design ' +
      'aligns seamlessly with this updated visual identity. Regrettably, despite these ' +
      'enhancements, the new design was never implemented in the client app.</p>',
    images: [
      {
        src: '/images/portfolio/rove-logix/redesign01.jpg',
        alt: 'Rove Logix Login',
        width: '1080',
        height: '1220',
      },
      {
        src: '/images/portfolio/rove-logix/redesign02.jpg',
        alt: 'Rove Logix Dashboard',
        width: '1080',
        height: '1220',
      },
      {
        src: '/images/portfolio/rove-logix/redesign03.jpg',
        alt: 'Rove Logix Client Center Page',
        width: '1080',
        height: '1220',
      },
      {
        src: '/images/portfolio/rove-logix/redesign04.jpg',
        alt: 'Rove Logix Client Center with Quick Search',
        width: '1080',
        height: '1220',
      },
      {
        src: '/images/portfolio/rove-logix/redesign05.jpg',
        alt: 'Rove Logix Record Expense with tooltip',
        width: '1080',
        height: '1220',
      },
      {
        src: '/images/portfolio/rove-logix/redesign06.jpg',
        alt: 'Rove Logix Delete Modal',
        width: '1080',
        height: '1220',
      },
      {
        src: '/images/portfolio/rove-logix/redesign07.jpg',
        alt: 'Rove Logix Dropdown',
        width: '1080',
        height: '1220',
      },
    ],
    videos: [],
  },
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
  },
];
