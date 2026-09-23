import type { PortfolioItem } from '@portfolio/shared-types';

/**
 * 🧭 **OWNER: Slice 7 (Portfolio Item).** The second half of v3's
 * `src/store/other.data.ts` at commit `39bbe56` (D53), ported field for field.
 * Split from `portfolio-items-other.fixture.ts` only to stay under the
 * 200-line source cap.
 *
 * ⚠️ **`corporate-reports` holds `cr-caterpillar`'s images.** The folder names
 * do not match the slugs; the `src` strings below are authoritative.
 *
 * ⚠️ **`cr-caterpillar` moved out in Slice 11** to
 * `portfolio-items-corporate-reports.fixture.ts`; this module was 211 lines
 * against the 200-line cap once the redesign's six fields per item went in.
 *
 * ⚠️ **Frozen for the whole 12/13/14/15/16 wave.**
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
    year: '2021',
    role: 'Senior Engineer',
    lede: 'A complete product re-skin plus a migration to a modern component model.',
    body: [
      'A SaaS platform for firms in land surveying, engineering, and geospatial services. The product had grown organically: inconsistent spacing, duplicated widgets, and styling that could not be changed safely.',
      'A component layer went in incrementally, screen by screen, so each release shipped both the new visual language and a smaller surface of legacy CSS — without pausing feature work.',
      'By the end, shared primitives covered the majority of the UI, and new screens could be assembled in hours rather than days.',
    ],
    tech: ['React', 'TypeScript', 'Component Architecture', 'Storybook', 'REST API'],
    facts: [
      { key: 'Timeline', value: '5 months' },
      { key: 'Role', value: 'Design, then front-end architecture' },
      { key: 'Focus', value: 'Incremental migration' },
    ],
    links: [],
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
    /*
     * ⚠️ **INVENTED — the design covers this item in no export** (D77). `lede`,
     * `body`, `tech`, `facts` and `year` have no design source; `role` follows
     * v3's `subtitle` (`Design`), and the body and the `Outcome` fact restate
     * v3's own description rather than adding a claim. `year` is inferred from
     * the sibling `rove-logix` engagement this redesign sat inside.
     */
    year: '2021',
    role: 'Design',
    lede: 'A cleaner visual identity for Rove Logix that the client never shipped.',
    body: [
      'Partway into the Rove Logix build, the interface was redesigned for a cleaner and more modern look — a close pass on colour contrast and a more restrained palette.',
      'The change reads most clearly on the Company Development page, where the email design was brought into the same visual identity. Despite the improvements, the new skin was never implemented in the client app.',
    ],
    tech: ['Visual Design', 'Colour & Contrast', 'Design System', 'Email Design'],
    facts: [
      { key: 'Timeline', value: 'A pass inside the Rove Logix build' },
      { key: 'Role', value: 'Solo — design only' },
      { key: 'Outcome', value: 'Never implemented in the client app' },
    ],
    links: [],
  },
];
