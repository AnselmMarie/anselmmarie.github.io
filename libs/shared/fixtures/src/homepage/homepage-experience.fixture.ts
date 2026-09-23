import type { ExperienceEntry, PanelNote } from '@portfolio/shared-types';

/**
 * 🧭 **OWNER: Slice 11 (the content model), then Slice 14 reads only.**
 *
 * The Experience accordion and its two footnote cards, ported verbatim from the
 * homepage export's `exp` array and `footnotes` (D76). Split out of
 * `homepage.fixture.ts` to stay under the 200-line cap.
 *
 * ⚠️ **This is real published copy, not placeholder text** (D41), and it is the
 * evidence for two figures rendered directly above it: `13+ years shipping`
 * and `13+ · Years in lead & architect roles` both read off the 2013 Manager
 * row (D87, D103). ⚠️ **Editing a `period` here moves a number in the
 * specs strip and the About card** — they are derivable from this table on
 * purpose, so that they cannot drift the way the export's own pair did.
 *
 * ⚠️ **Frozen for the whole 12/13/14/15/16 wave.**
 *
 * `points` are a selection from the maintainer's resume (2026-09-23), not all
 * of it. The 2013 Cricket row draws on the resume's two Cricket roles in that span.
 */
export const HOMEPAGE_EXPERIENCE: readonly ExperienceEntry[] = [
  {
    // ⚠️ `Cricket Wireless` appears twice, so the id is company + start year.
    // A company-keyed accordion would open both Cricket rows at once.
    id: 'cosmikata-2025',
    company: 'Cosmikata',
    role: 'Founder & Lead Software Engineer',
    period: '2025 – Present',
    place: 'Remote',
    stack: 'React · React Native · Expo · Hono · Nx · Next.js · PostgreSQL · Design System · Figma',
    points: [
      'Founded Cosmikata; defined product, architecture, and cross-platform strategy.',
      'Architected an Expo / Next.js / Nx monorepo powering web and future native apps with shared UI, services, validation, and business logic.',
      'Designed an edge-first backend using Hono, PostgreSQL, and Drizzle with shared validation, authentication, APIs, and background jobs.',
      'Built a cross-platform design system from Figma tokens, standardizing reusable components, themes, and UI patterns.',
    ],
  },
  {
    id: 'southern-glazers-2025',
    company: 'Southern Glazer’s Wine & Spirits',
    role: 'Senior Software Engineer',
    period: '2025 – 2026',
    place: 'Remote',
    stack: 'React · Nx · Rspack · Module Federation · TanStack',
    points: [
      'Contributed to the Nx monorepo migration, refactoring application modules to support a module-federated architecture.',
      'Built and extended the checkout flow within a micro-frontend system, integrating shared state and federated modules.',
      'Implemented standardized analytics tracking across federated modules to ensure consistent event data.',
    ],
  },
  {
    id: 'inspire-brands-2024',
    company: 'Inspire Brands',
    role: 'Senior Software Engineer',
    period: '2024',
    place: 'Atlanta, GA',
    stack: 'React · Next.js · Contentful · CSS Modules',
    points: [
      'Delivered guest-facing features across Buffalo Wild Wings, Sonic, and Arby’s digital platforms, serving millions of users.',
      'Contributed to a Contentful-based content architecture supporting multi-brand content management and delivery workflows.',
    ],
  },
  {
    id: 'cricket-wireless-2020',
    company: 'Cricket Wireless',
    role: 'Senior Software Engineer, Tech Lead',
    period: '2020 – 2023',
    place: 'Atlanta, GA',
    stack: 'React · Angular · Node.js · Nx · Storybook · Figma',
    points: [
      'Led a 4-engineer team delivering an enterprise admin platform; increased team throughput ~20% via mentorship and process refinement.',
      'Re-architected a legacy frontend into a React/TypeScript stack, improving performance and scalability by ~40%.',
      'Established the department’s sub design system and frontend standards using Atomic Design, reducing production defects by ~35%.',
      'Architected a headless CMS integration across enterprise applications, accelerating content delivery and release cycles.',
    ],
  },
  {
    id: 'adp-2019',
    company: 'ADP',
    role: 'Senior Application Developer',
    period: '2019 – 2020',
    place: 'Alpharetta, GA',
    stack: 'React · React Native · Redux · Angular · TypeScript',
    points: [
      'Contributed to the development and maintenance of enterprise payroll and HR platforms.',
      'Delivered cross-platform features using React and React Native, ensuring consistent experiences across web and mobile applications.',
    ],
  },
  {
    id: 'cricket-wireless-2013',
    company: 'Cricket Wireless',
    role: 'Senior Developer / Manager',
    period: '2013 – 2019',
    place: 'Atlanta, GA',
    stack: 'ES6+ · Webpack · Babel · jQuery · REST APIs',
    points: [
      'Led a 5-person team delivering brand experience initiatives; earned the AT&T Service Excellence Award for the Breeze-Thru program.',
      'Designed and prototyped a mission-critical POS system UI, securing executive approval for a new internal product division.',
      'Executed front-end updates during the AIO to Cricket Wireless transition, resulting in a 30% improvement in mobile responsiveness.',
    ],
  },
  {
    id: 'corporate-reports-2011',
    company: 'Corporate Reports, Inc.',
    role: 'Interactive Developer',
    period: '2011 – 2013',
    place: 'Buckhead, GA',
    stack: 'PhoneGap (Cordova) · jQuery · HTML5 · CSS3',
    points: [
      'Contributed to the full development lifecycle of multiple web applications, advancing into a lead role to oversee projects from inception to completion.',
      'Developed and managed high-profile digital annual reports for Fortune 500 clients, including Clorox, General Motors, and Caterpillar.',
    ],
  },
];

/** The award and the degree, below the Experience list. */
export const HOMEPAGE_FOOTNOTES: readonly PanelNote[] = [
  {
    key: 'Award',
    title: 'AT&T Service Excellence Award',
    detail: 'For leading frontend design and end-to-end delivery of the Breeze-Thru program.',
  },
  {
    key: 'Education',
    title: 'BFA, Graphic Design',
    detail: 'American InterContinental University',
  },
];
