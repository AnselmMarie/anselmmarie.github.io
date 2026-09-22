import type { HomepageContent } from '@portfolio/shared-types';

import { SITE_SECTIONS } from './site-sections.fixture.js';

/**
 * 🧭 **OWNER: Slice 6 (Homepage).** Created by the coordinator in Slice 4 as
 * the named landing spot for the homepage's content, so Slice 6 and Slice 7 —
 * concurrent agents co-owning this package — never open the same file.
 * Slice 7 must not add to this module.
 *
 * ⚠️ **This is the site's real published copy, not a stub** (D41). Ported from
 * commit `39bbe56` (D53) — `src/routes/homepage/hero-section/hero-section.view.tsx`
 * and `src/routes/homepage/skill-list/skill-list.const.ts` — never retyped from
 * the rendered page and never taken from the local `master` branch.
 *
 * ⚠️ **`cosmikata-design-system` is deliberately absent from `activeProjects`.**
 * At `39bbe56` that entry is commented out in `src/store/active.data.ts`, so
 * the live v3 homepage lists two active and six other projects — eight, not the
 * nine named in `portfolio-items.fixture.ts`'s banner. Reported to the
 * coordinator rather than resolved here; the item's page still exists, it is
 * only unlisted on the homepage.
 */
export const HOMEPAGE_CONTENT: HomepageContent = {
  sections: SITE_SECTIONS,
  hero: {
    name: 'Anselm Marie',
    headline: 'Senior Software Engineer & Tech Lead | Web Architecture & Product Impact',
    links: [
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/anselm-marie/',
        icon: 'linkedin',
      },
      { label: 'GitHub', href: 'https://github.com/AnselmMarie', icon: 'github' },
    ],
  },
  skillGroups: [
    {
      id: 'developer',
      cardId: 'engineering',
      heading: 'Developer',
      skills: [
        'JavaScript (ES6+)',
        'TypeScript',
        'React',
        'React Native',
        'Expo',
        'Next.js',
        'Angular',
        'Tailwind/CSS/SCSS',
        'Node.js',
        'REST APIs',
        'PostgreSQL',
        'Webpack',
        'Rspack',
        'Vite',
      ],
    },
    {
      id: 'developer-tools',
      cardId: 'engineering',
      // v3 renders this column's "Developer" heading `invisible` so the two
      // lists' first rows line up. An empty heading is that same intent
      // without a styling-only duplicate of the word.
      heading: '',
      skills: [
        'Module Federation',
        'Storybook',
        'Tanstack Query',
        'Redux Toolkit',
        'Jotai',
        'Zustand',
        'Github',
        'Nx Monorepo',
        'CI/CD',
      ],
    },
    {
      id: 'ui-ux',
      cardId: 'design',
      heading: 'UI/UX',
      skills: ['Figma', 'Sketch', 'Adobe XD', 'Design System', 'Web Design', 'Mobile Design'],
    },
  ],
  projectGroups: [
    {
      sectionId: 'active-projects',
      heading: 'Active Projects',
      slugs: ['pokemon-pet-shop', 'cosmikata'],
    },
    {
      sectionId: 'other-projects',
      heading: 'Other Projects',
      slugs: [
        'older-cosmikata',
        'csp-generator-app',
        'cw-breeze-thru',
        'rove-logix',
        'rove-logix-ui-update',
        'cr-caterpillar',
      ],
    },
  ],
};
