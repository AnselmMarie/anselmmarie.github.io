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
      'Architected an Expo / Next.js / Nx monorepo powering web and native from shared UI, ' +
        'services, and business logic.',
      'Designed an edge-first backend on Hono, PostgreSQL, and Drizzle with shared ' +
        'validation, auth, and background jobs.',
      'Built a cross-platform design system from Figma tokens: reusable components, themes, ' +
        'and UI patterns.',
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
      'Drove the Nx monorepo migration, refactoring modules to a module-federated ' +
        'architecture.',
      'Built and extended a checkout flow within a micro-frontend system, integrating shared ' +
        'state and federated modules.',
      'Standardized frontend tooling and analytics across federated modules via ' +
        'proofs-of-concept.',
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
      'Delivered guest-facing features across Buffalo Wild Wings, Sonic, and Arby’s, serving ' +
        'millions of users.',
      'Contributed to a Contentful architecture supporting multi-brand content management ' +
        'and delivery.',
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
      'Led a 4-engineer team on an enterprise admin platform; raised throughput ~20% via ' +
        'mentorship and process.',
      'Re-architected a legacy frontend into a React/TypeScript stack, improving performance ' +
        '& scalability ~40%.',
      'Established a design system and frontend standards via Atomic Design, cutting ' +
        'production defects ~35%.',
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
      'Delivered cross-platform features across enterprise payroll and HR platforms.',
      'Ensured consistent experiences across web and mobile with React and React Native.',
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
      'Led brand-experience teams; earned the AT&T Service Excellence Award for the ' +
        'Breeze-Thru program.',
      'Designed and prototyped a mission-critical POS UI, securing executive approval for a ' +
        'new product division.',
      'Supported the Cricket website through the AIO transition: 1M+ monthly visitors, +30% ' +
        'mobile responsiveness.',
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
      'Advanced into a lead role overseeing web applications from inception to completion.',
      'Built digital annual reports for Fortune 500 clients including Clorox, General ' +
        'Motors, and Caterpillar.',
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
