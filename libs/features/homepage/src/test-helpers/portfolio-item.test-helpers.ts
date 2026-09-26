import type { PortfolioItem } from '@portfolio/shared-types';

/**
 * Builds a complete `PortfolioItem` from the two fields the homepage actually
 * renders, filling the rest with inert values.
 *
 * ⚠️ **Why this exists is worth keeping.** Slices 6 and 7 ran concurrently and
 * co-owned `@portfolio/shared-types`. Slice 6's specs wrote
 * `{ slug, title }` literals because that was the whole of `PortfolioItem` when
 * the wave started; Slice 7 then ported the real v3 shape onto it. Both agents
 * were green in their own worktrees and the collision appeared only when the
 * two halves met — which is the cost the plan accepted when it declared those
 * two projects co-owned, showing up exactly where it was predicted to.
 *
 * Going through a factory means the next field added to `PortfolioItem` lands
 * here once instead of in every spec literal.
 */
export const makePortfolioItem = (
  slug: string,
  title: string,
  overrides: Partial<PortfolioItem> = {}
): PortfolioItem => ({
  slug,
  title,
  company: 'Test Company',
  subtitle: 'Test Subtitle',
  thumbnail: `/images/portfolio/${slug}/thumbnail.jpg`,
  description: '<p>Test description.</p>',
  images: [],
  videos: [],
  // Slice 11's six additions, landing here once rather than in every spec
  // literal — which is what this factory was written for.
  year: '2024',
  role: 'Test Role',
  lede: 'Test lede.',
  body: ['Test body paragraph.'],
  tech: ['TypeScript'],
  facts: [{ key: 'Timeline', value: 'Test timeline' }],
  links: [],
  ...overrides,
});

/**
 * Narrows a fixture lookup that the spec knows must succeed.
 *
 * Specs reach for `!` here — the fixture really does contain the slug being
 * asked for — but `@typescript-eslint/no-non-null-assertion` warns on every
 * one, and a silent `undefined` in a spec produces a confusing failure two
 * assertions later rather than at the lookup. This throws where the mistake is.
 */
export const required = <T>(value: T | undefined, what: string): T => {
  if (value === undefined) {
    throw new Error(`Fixture lookup failed: ${what}`);
  }

  return value;
};
