import type { PortfolioItem } from '@portfolio/shared-types';

import { placeholder } from './portfolio-item-placeholder.js';

/**
 * ⚠️ **Placeholders — maintainer, 2026-09-23.** Projects added to the work
 * grid before their copy exists. The title, company, tech, year and `lede` are
 * the maintainer's; every other field is a stand-in to be replaced when the detail
 * is written. The factory and its defaults live in `portfolio-item-placeholder.ts`.
 *
 * `portfolio-items.fixture.spec.ts` exempts these slugs from the completeness
 * checks the other items pass. Remove a slug from `PLACEHOLDER_SLUGS` once its
 * item is authored, and those checks apply.
 */
export const UPCOMING_PORTFOLIO_ITEMS: readonly PortfolioItem[] = [
  placeholder({
    slug: 'webpage-v3',
    title: 'v3',
    company: 'Anselm Marie',
    tech: [
      'React',
      'TanStack Start',
      'Module Federation',
      'Nx',
      'TypeScript',
      'Tailwind',
      'Vite',
      'Vitest',
      'AWS CDK',
      'GitHub Actions',
      'AI',
    ],
    year: '2026',
    // ⚠️ INVENTED — the maintainer gave no summary line; replace when written.
    lede: 'A rebuild of this portfolio site as a React and TanStack Start micro-frontend platform.',
    facts: [
      { key: 'Timeline', value: 'Less than a month' },
      { key: 'Role', value: 'Lead designer and developer' },
      { key: 'Focus', value: 'Architecting independently deployable micro-frontends on AWS' },
    ],
    body: [
      'A server-rendered TanStack Start shell composes independently built header, homepage, portfolio and footer remotes through Module Federation, organized in an Nx monorepo, deployed to AWS through GitHub Actions, and built with AI-assisted development workflows.',
    ],
    description: `
      <ul>
        <li>Built a TanStack Start shell that server-renders each page and loads the header, homepage, portfolio item and footer as Module Federation remotes.</li>
        <li>Organized the codebase as an Nx monorepo, keeping logic in feature libraries so each change maps to exactly one deployable app.</li>
        <li>Created a shared design system of generated shadcn primitives, wrapped components and a single Tailwind theme, with module boundaries enforced by ESLint.</li>
        <li>Wrapped every remote in an error boundary with a fallback, so one failed micro-frontend never takes down the page.</li>
        <li>Designed the AWS flow: the shell's SSR server runs on an arm64 Lambda, each remote is served from S3 behind CloudFront, and the infrastructure is described in AWS CDK.</li>
        <li>Set up a single GitHub Actions workflow that gates every pull request on typecheck, lint, tests, file-size caps and formatting, with deploys driven by nx affected so only changed micro-frontends ship.</li>
        <li>Tested with Vitest and React Testing Library, with pre-commit hooks running ESLint, Biome and the file-size check locally.</li>
        <li>Built with AI-assisted development workflows using Claude Code, guided by project rules for planning, testing and review.</li>
      </ul>
    `,
  }),
  placeholder({
    slug: 'micro-frontend-update',
    title: 'Micro Frontend Architecture Migration',
    company: 'Southern Glazer’s Wine & Spirits',
    tech: ['React', 'Module Federation', 'TanStack', 'AI'],
    year: '2025',
    lede: 'Modernizing checkout through micro-frontends, shared architecture, and testing.',
    body: [
      'Contributed to the migration of a legacy Java checkout application to a modern React platform built around an Nx monorepo and module-federated micro-frontends, supporting the transition to a more scalable and shared frontend architecture.',
    ],
    description: `
      <ul>
        <li>Contributed to the Nx monorepo migration by refactoring application modules to support a module-federated architecture.</li>
        <li>Partnered with the backend team and principal engineer to define and prepare API endpoints required for the new checkout experience.</li>
        <li>Built and extended checkout functionality within the micro-frontend platform, integrating shared state and federated modules.</li>
        <li>Implemented standardized analytics tracking across federated modules to maintain consistent event data throughout the checkout experience.</li>
        <li>Worked with React, Rspack, Module Federation, Tailwind, NativeWind, TanStack Form, and TanStack Query across the checkout platform.</li>
        <li>Contributed to frontend testing using Jest, React Testing Library, and MSW, including flows that depended on evolving backend APIs.</li>
        <li>Worked with Zephyr Cloud for deployment and management of federated frontend modules.</li>
        <li>Incorporated AI-assisted development using GitHub Copilot and Claude Code across implementation, testing, and iteration.</li>
      </ul>
    `,
    facts: [
      { key: 'Timeline', value: 'MVP under a year' },
      { key: 'Role', value: 'Senior Software Engineer' },
      {
        key: 'Focus',
        value: 'Mapped legacy code and APIs to guide migration and build out the new platform',
      },
    ],
  }),
  placeholder({
    slug: 'prototype-company-division',
    title: 'From Prototype to New Company Division',
    company: 'Cricket Wireless',
    tech: ['Design', 'JavaScript'],
    year: '2017',
    facts: [
      { key: 'Timeline', value: 'Within a year' },
      { key: 'Role', value: 'Lead designer and developer' },
      { key: 'Focus', value: 'Prototyping an in-house POS platform' },
    ],
    lede: 'Led POS UI design and prototyping that secured executive approval for a new internal product division.',
    body: [
      'Designed and prototyped the POS experience for Cricket Wireless’s initiative to bring its outsourced point-of-sale system in-house. Developed the concept and core store workflows to demonstrate how an internal POS platform could support retail operations, gaining executive approval and contributing to the establishment of a new internal POS division.',
    ],
    description: `
      <ul>
        <li>Tasked by the director with exploring how Cricket could transition from an outsourced POS system to an internally developed platform.</li>
        <li>Designed and prototyped the POS user experience, focusing on simplifying common store workflows.</li>
        <li>Created a prototype for scanning Cricket store products, including devices and accessories.</li>
        <li>Used the prototype to demonstrate the proposed internal POS experience and validate the product direction with leadership.</li>
        <li>Worked in two-week sprint cycles with stakeholder reviews to present progress, gather feedback, and establish priorities for subsequent iterations.</li>
        <li>Collaborated with stakeholders to refine workflows and translate the business objective into a tangible product concept.</li>
        <li>Secured executive approval for the proposed internal POS initiative.</li>
        <li>Contributed to the establishment of a new Cricket Wireless division focused on developing and managing the POS platform internally.</li>
        <li>Helped establish the foundation for greater control over the POS experience and reduced reliance on the outsourced system.</li>
      </ul>
    `,
  }),
  placeholder({
    slug: 'cw-enterprise-admin',
    title: 'Enterprise Admin Platform',
    company: 'Cricket Wireless',
    tech: ['React', 'TypeScript', 'Node.js', 'Nx', 'Storybook', 'Figma', 'Azure'],
    // The Cricket tech-lead row in `homepage-experience.fixture.ts`.
    year: '2020 – 2023',
    lede: 'Led a four-engineer team delivering an enterprise admin platform and its design system.',
    facts: [
      // ⚠️ INVENTED wording — read off "a multi-year platform roadmap".
      { key: 'Timeline', value: 'Multi-year roadmap' },
      { key: 'Role', value: 'Tech lead, 4 engineers' },
      {
        key: 'Focus',
        value: 'Re-architecting the frontend and standardizing it on a design system',
      },
    ],
    body: [
      'Led the frontend team behind an enterprise admin platform, re-architecting a legacy frontend into a React and TypeScript stack and establishing a department-level sub design system that governed the components and frontend standards used across the department’s applications.',
    ],
    description: `
      <ul>
        <li>Led a 4-engineer team delivering an enterprise admin platform, increasing team throughput by ~20% through mentorship and process refinement.</li>
        <li>Re-architected the legacy frontend into a React and TypeScript stack, improving performance and scalability by ~40%.</li>
        <li>Established the department’s sub design system and frontend standards using Atomic Design, reducing production defects by ~35%.</li>
        <li>Architected a headless CMS integration across enterprise applications, accelerating content delivery and release cycles.</li>
        <li>Owned UX prototyping and the department’s sub design system in Figma and Adobe XD across the department’s platforms.</li>
        <li>Directed delivery planning and technical debt strategy across a multi-year platform roadmap.</li>
        <li>Worked with React, Node.js, Webpack, Vite, Jest, React Testing Library, Storybook, Nx, Tailwind, Azure and a headless CMS.</li>
      </ul>
    `,
  }),
];

export const PLACEHOLDER_SLUGS: readonly string[] = UPCOMING_PORTFOLIO_ITEMS.map(
  (item) => item.slug
);
