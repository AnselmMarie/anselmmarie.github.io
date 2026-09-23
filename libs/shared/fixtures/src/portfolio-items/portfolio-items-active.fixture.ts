import type { PortfolioItem } from '@portfolio/shared-types';

/**
 * 🧭 **OWNER: Slice 7 (Portfolio Item).** v3's `src/store/active.data.ts` at
 * commit `39bbe56` (D53), ported field for field. Split out of
 * `portfolio-items.fixture.ts` only to stay under the 200-line source cap.
 *
 * ⚠️ **Two items, not three — and the site has eight, not nine.**
 * `cosmikata-design-system` is **commented out in its entirety** at `39bbe56`
 * (the whole object: title, thumbnail, description, images), so it is
 * deliberately unpublished content and is **not** ported. The nine-slug list in
 * D53, in the slice file and in this package's banners was read off v3's route
 * directory rather than off its data; v3 itself has a dead route page for that
 * slug which looks the id up, finds nothing, and renders an empty container.
 * Here it resolves to `undefined` and the shell renders `PortfolioNotFound`
 * (D66), which is the correct behaviour. Re-enabling the item is the
 * maintainer's call, not this slice's.
 */
export const ACTIVE_PORTFOLIO_ITEMS: readonly PortfolioItem[] = [
  {
    slug: 'pokemon-pet-shop',
    company: 'Freelancing/Concepts',
    title: 'Pokémon Pet Shop',
    subtitle: 'Design / Development',
    thumbnail: '/images/portfolio/pokemon-pet-shop/pokemon-thumbnail.jpg',
    description:
      '<p>As a personal challenge, I designed and built a project focused on maximizing code ' +
      'reuse across web, native, and API applications while preserving the full capabilities ' +
      'of each platform. To read more about this project follow these links: ' +
      '<a href="https://github.com/AnselmMarie/pokemon-pet-shop/tree/mfe" target="_blank">' +
      'Github mfe branch</a> and <a href="https://github.com/AnselmMarie/pokemon-pet-shop/' +
      'blob/mfe/README_ARCHITECTURE.md" target="_blank">Readme Architecture</a>.</p>' +
      '<p>The tech stack includes:</p>' +
      '<ul><li>React</li><li>React Native/Expo</li><li>Tailwind/Nativewind</li>' +
      '<li>Figma</li><li>Design Tokens</li><li>more</li></ul>',
    images: [
      {
        src: '/images/portfolio/pokemon-pet-shop/pokemon01.jpg',
        alt: 'Pokemon Pet Shop Homepage',
        width: '1510',
        height: '1040',
      },
      {
        src: '/images/portfolio/pokemon-pet-shop/pokemon02.jpg',
        alt: 'Pokemon Pet Shop Detail Modal',
        width: '1510',
        height: '957',
      },
      {
        src: '/images/portfolio/pokemon-pet-shop/pokemon03.jpg',
        alt: 'Pokemon Pet Shop Cart Modal',
        width: '1510',
        height: '1040',
      },
      {
        src: '/images/portfolio/pokemon-pet-shop/pokemon04.jpg',
        alt: 'Pokemon Pet Shop Mobile View',
        width: '430',
        height: '809',
      },
    ],
    videos: [],
    year: '2024',
    role: 'Design & Engineering',
    lede: 'A full e-commerce experience built on the public Pokémon API.',
    body: [
      'The goal was to take an open, read-only dataset and build a believable commerce product on top of it: browsing, filtering, product detail, cart, and checkout, all with a bespoke visual system rather than an off-the-shelf template.',
      'The data layer normalizes the API responses into a typed catalog model, caches aggressively, and keeps the cart in sync across tabs. Everything is component-driven so new product surfaces slot in without touching fetch logic.',
      'The visual language is intentionally warm and editorial rather than the usual marketplace grid, which made the project a useful sandbox for type scale, motion, and component API decisions.',
    ],
    tech: ['React', 'TypeScript', 'REST API', 'React Query', 'Vite', 'CSS Modules', 'Vitest'],
    facts: [
      { key: 'Timeline', value: '6 weeks, nights and weekends' },
      { key: 'Role', value: 'Solo designer and engineer' },
      { key: 'Focus', value: 'Data modeling, cart state, visual system' },
    ],
    links: [
      {
        label: 'Source',
        href: 'https://github.com/AnselmMarie/pokemon-pet-shop/tree/mfe',
        icon: 'github',
      },
      {
        label: 'Architecture notes',
        href: 'https://github.com/AnselmMarie/pokemon-pet-shop/blob/mfe/README_ARCHITECTURE.md',
        icon: 'external',
      },
    ],
  },
  {
    slug: 'cosmikata',
    company: 'Freelancing/Concepts',
    title: 'Cosmikata',
    subtitle: 'Design / Development',
    thumbnail: '/images/portfolio/cosmikata/marketing-landing.png',
    description: `
      <ul>
        <li>Rebuilt Cosmikata from the ground up, applying architectural and engineering experience gained since its original development.</li>
        <li>Designed the Nx monorepo around shared packages for UI, business logic, services, and validation to minimize duplication across platforms.</li>
        <li>Integrated Next.js and Expo for web and native applications while isolating platform-specific implementation where needed.</li>
        <li>Built a token-driven design system connecting Figma design tokens to reusable components, styles, and CSS variables.</li>
        <li>Established Storybook as a shared environment for developing, testing, and documenting UI components across web and native surfaces.</li>
        <li>Designed an edge-first backend using Hono, PostgreSQL, and Drizzle with shared validation schemas to maintain consistent API contracts between clients and backend services.</li>
        <li>Incorporated AI-assisted development using Claude Design, Claude Code, Gemini, and ChatGPT across research, architecture, implementation, testing, and iteration.</li>
        <li>Developed structured AI rules, reusable skills, and documented engineering practices to make AI-assisted development repeatable and controlled.</li>
        <li>Maintained ownership of architectural decisions, implementation quality, and technical direction throughout the development process.</li>
        <li>Used Cosmikata as a personal product and engineering laboratory for cross-platform architecture, design systems, backend infrastructure, and AI-assisted development workflows.</li>
      </ul>
    `,
    images: [
      {
        src: '/images/portfolio/cosmikata/marketing-landing.png',
        alt: 'Cosmikata marketing landing page',
        width: '1691',
        height: '1055',
      },
      {
        src: '/images/portfolio/cosmikata/cosplay-detail.png',
        alt: 'Cosmikata cosplay detail with progress, budget and tasks',
        width: '1691',
        height: '1055',
      },
      {
        src: '/images/portfolio/cosmikata/hub-mobile.png',
        alt: 'Cosmikata hub on mobile with event dates and deadlines',
        width: '340',
        height: '716',
      },
      {
        src: '/images/portfolio/cosmikata/measurements-mobile.png',
        alt: 'Cosmikata measurements on mobile',
        width: '320',
        height: '716',
      },
      {
        src: '/images/portfolio/cosmikata/events.png',
        alt: 'Cosmikata events list on a tablet-width layout',
        width: '815',
        height: '716',
      },
      {
        src: '/images/portfolio/cosmikata/settings.png',
        alt: 'Cosmikata settings',
        width: '1691',
        height: '1055',
      },
      {
        src: '/images/portfolio/cosmikata/storybook-primitive-tokens.png',
        alt: 'Cosmikata primitive color tokens in Storybook',
        width: '1691',
        height: '1055',
      },
      {
        src: '/images/portfolio/cosmikata/splash.png',
        alt: 'Cosmikata splash screen',
        width: '1691',
        height: '1055',
      },
    ],
    videos: [],
    /*
     * ⚠️ **No links.** The design gives this item a `Source` pill pointing at
     * `github.com/AnselmMarie` — a profile, not this project — and a `Live site`
     * pill that is a bare `#`. A pill labelled `Source` that lands on a profile
     * is worse than no pill, so both are dropped rather than shipped.
     *
     * `year` is 2025, the maintainer's figure (2026-09-23); the design had 2024.
     */
    year: '2025',
    role: 'Founder & Lead Engineer',
    lede: 'A cross-platform product architecture, shared design system, and edge-first backend.',
    // One paragraph by the maintainer's choice (2026-09-23).
    body: [
      'Reimagined Cosmikata as a cross-platform product platform built around a shared Nx monorepo, enabling web, mobile, and backend applications to share UI, services, validation, and business logic while keeping platform-specific concerns isolated.',
    ],
    tech: [
      'Next.js',
      'React Native',
      'Expo',
      'Nx',
      'Hono',
      'PostgreSQL',
      'Drizzle ORM',
      'Design System',
      'Figma',
      'GitHub Actions',
      'Cloudflare',
      'AI',
    ],
    facts: [
      { key: 'Timeline', value: 'Ongoing since 2025' },
      { key: 'Role', value: 'Founder, architecture, design' },
      { key: 'Focus', value: 'Monorepo, tokens, edge backend' },
    ],
    links: [],
  },
];
