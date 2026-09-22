import { describe, expect, it } from 'vitest';

import { HOMEPAGE_CONTENT } from './homepage.fixture.js';
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

  it('serves the portfolio list, empty until Slice 7 ports it', () => {
    // ⚠️ This assertion is expected to change in Slice 7, and it should be
    // visible in that diff. It is here so "the list is empty" is a recorded
    // state rather than something nobody looked at.
    expect(usePortfolioItems()).toEqual([]);
  });

  it('returns undefined for a slug with no item, rather than throwing', () => {
    // `undefined` is "no such item", which the route turns into a shell-level
    // not-found. A throw here would surface as a REMOTE failure and tell the
    // visitor to retry something that can never succeed.
    expect(usePortfolioItem('pokemon-pet-shop')).toBeUndefined();
    expect(usePortfolioItem('')).toBeUndefined();
  });
});
