import { describe, expect, it } from 'vitest';

import { HOMEPAGE_CONTENT } from './homepage.fixture.js';
import { PORTFOLIO_ITEMS } from './portfolio-items.fixture.js';
import { SITE_SECTIONS } from './site-sections.fixture.js';
import { useHomepageContent, usePortfolioItem, usePortfolioItems } from './use-content-stub.js';

describe('use-content-stub', () => {
  it('serves the homepage content from the fixture module Slice 6 owns', () => {
    // The seam's whole job is that this is the ONLY path from a component to
    // a fixture. Asserting identity rather than shape is deliberate: it fails
    // if a future edit builds a fresh object here instead of reading the
    // fixture, which is how a second source of truth starts.
    expect(useHomepageContent()).toBe(HOMEPAGE_CONTENT);
  });

  it('exposes the sections the Header anchors into', () => {
    expect(useHomepageContent().sections).toEqual(SITE_SECTIONS);
  });

  it('serves the portfolio list from the fixture module Slice 7 owns', () => {
    // ⚠️ Was `toEqual([])` until Slice 7 ported the eight live items — the
    // change this assertion existed to make visible in that diff. Eight, not
    // the nine D53 names: `cosmikata-design-system` is commented out at
    // `39bbe56` and stays a not-found.
    expect(usePortfolioItems()).toBe(PORTFOLIO_ITEMS);
    expect(usePortfolioItems()).toHaveLength(8);
  });

  it('resolves a real slug through the seam', () => {
    expect(usePortfolioItem('pokemon-pet-shop')?.title).toBe('Pokémon Pet Shop');
  });

  it('returns undefined for a slug with no item, rather than throwing', () => {
    // `undefined` is "no such item", which the route turns into a shell-level
    // not-found. A throw here would surface as a REMOTE failure and tell the
    // visitor to retry something that can never succeed.
    expect(usePortfolioItem('not-a-project')).toBeUndefined();
    expect(usePortfolioItem('')).toBeUndefined();
  });
});
