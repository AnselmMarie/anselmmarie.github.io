import type { PortfolioItem } from '@portfolio/shared-types';

/**
 * ⚠️ **Placeholders — maintainer, 2026-09-23.** Two projects added to the work
 * grid before their copy exists. The title, company, tech, year and `lede` are
 * the maintainer's; every other field is a stand-in to be replaced when the detail
 * is written.
 *
 * - `images` and `links` are empty, `facts` carries the three keys with
 *   empty values, and `thumbnail` is empty
 *   so the detail route emits no `og:image`.
 * - `portfolio-items.fixture.spec.ts` exempts these slugs from the
 *   completeness checks the other items pass. Remove a slug from
 *   `PLACEHOLDER_SLUGS` once its item is authored, and those checks apply.
 */
interface PlaceholderInput {
  slug: string;
  title: string;
  company: string;
  /** The card's stack line reads the first three. */
  tech: readonly string[];
  year: string;
  /** The card's summary line. */
  lede: string;
}

const placeholder = ({
  slug,
  title,
  company,
  tech,
  year,
  lede,
}: PlaceholderInput): PortfolioItem => ({
  slug,
  title,
  company,
  subtitle: '',
  thumbnail: '',
  description: '<p>Details coming soon.</p>',
  images: [],
  videos: [],
  year,
  role: '',
  lede,
  body: [],
  tech,
  // Every detail page draws the same three rows, blank until authored.
  facts: [
    { key: 'Timeline', value: '' },
    { key: 'Role', value: '' },
    { key: 'Focus', value: '' },
  ],
  links: [],
});

export const UPCOMING_PORTFOLIO_ITEMS: readonly PortfolioItem[] = [
  placeholder({
    slug: 'micro-frontend-update',
    title: 'Micro Frontend Architecture Migration',
    company: 'Southern Glazer’s Wine & Spirits',
    tech: ['React', 'Module Federation', 'TanStack'],
    year: '2025',
    lede: 'Contributed to a React micro-frontend migration, building federated modules and standardizing tooling, analytics, and testing.',
  }),
  placeholder({
    slug: 'prototype-company-division',
    title: 'From Prototype to New Company Division',
    company: 'Cricket Wireless',
    tech: ['Design', 'JavaScript'],
    year: '2017',
    lede: 'Led POS UI design and prototyping that secured executive approval for a new internal product division.',
  }),
];

export const PLACEHOLDER_SLUGS: readonly string[] = UPCOMING_PORTFOLIO_ITEMS.map(
  (item) => item.slug
);
