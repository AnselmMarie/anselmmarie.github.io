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
    thumbnail: '/images/portfolio/cosmikata/cosmikata-thumbnail.jpg',
    description:
      '<p>A few years after its original development, I’ve decided to return to the Cosmikata ' +
      'project and reimagine it from the ground up. This overhaul applies the skills and ' +
      'architectural insights I’ve gained over time to build a flexible, shared codebase ' +
      'spanning web, mobile, and backend applications.</p>' +
      '<p>Cosmikata is a hobby project driven by my passion for learning, experimentation, and ' +
      'contributing to a space I genuinely care about. The goal is to deliver a redesigned ' +
      'experience and publish the new version to both the Apple App Store and Google Play ' +
      'Store.</p>' +
      '<p>The tech stack includes:</p>' +
      '<ul><li>React</li><li>React Native/React Native Web</li><li>Expo</li><li>Node.js</li>' +
      '<li>PostgreSQL</li><li>Drizzle</li><li>Nx Monorepo</li><li>CI/CD: Github Actions</li>' +
      '<li>Figma</li><li>Design Tokens</li></ul>',
    images: [
      {
        src: '/images/portfolio/cosmikata/homepage.png',
        alt: 'Cosmikata Login',
        width: '662',
        height: '1436',
      },
      {
        src: '/images/portfolio/cosmikata/cosplay-list.png',
        alt: 'Cosmikata Filter Modal',
        width: '662',
        height: '1436',
      },
      {
        src: '/images/portfolio/cosmikata/settings.png',
        alt: 'Cosmikata Edit Cosplay',
        width: '662',
        height: '1436',
      },
    ],
    videos: [],
    /*
     * ⚠️ **No links.** The design gives this item a `Source` pill pointing at
     * `github.com/AnselmMarie` — a profile, not this project — and a `Live site`
     * pill that is a bare `#`. A pill labelled `Source` that lands on a profile
     * is worse than no pill, so both are dropped rather than shipped.
     */
    year: '2024',
    role: 'Founder & Lead Engineer',
    lede: 'A studio identity, a shared component library, and a cross-platform product architecture.',
    body: [
      'Cosmikata started as a brand exercise and grew into the platform I use to ship cross-platform products: one Nx monorepo feeding web and native from shared UI, services, and business logic.',
      'The design system is generated from Figma tokens, so themes, spacing, and typography stay identical across Next.js and Expo. Components are documented in Storybook and consumed by every surface.',
      'On the backend, an edge-first Hono API with PostgreSQL and Drizzle shares validation schemas with the clients, which removes a whole class of drift between server and app.',
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
    ],
    facts: [
      { key: 'Timeline', value: 'Ongoing since 2024' },
      { key: 'Role', value: 'Founder, architecture, design' },
      { key: 'Focus', value: 'Monorepo, tokens, edge backend' },
    ],
    links: [],
  },
];
