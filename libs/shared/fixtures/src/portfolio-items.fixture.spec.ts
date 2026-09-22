import { describe, expect, it } from 'vitest';

import { PORTFOLIO_ITEMS, portfolioItemBySlug } from './portfolio-items.fixture.js';

/**
 * ⚠️ **Eight, not the nine D53 names.** `cosmikata-design-system` is commented
 * out in its entirety at `39bbe56` — deliberately unpublished content — so it
 * is not ported and resolves to a shell-level not-found. Order is v3's.
 */
const EXPECTED_SLUGS = [
  'pokemon-pet-shop',
  'cosmikata',
  'older-cosmikata',
  'csp-generator-app',
  'cw-breeze-thru',
  'rove-logix',
  'rove-logix-ui-update',
  'cr-caterpillar',
];

describe('PORTFOLIO_ITEMS', () => {
  it('carries the eight LIVE slugs at 39bbe56, in v3 reading order', () => {
    expect(PORTFOLIO_ITEMS.map((item) => item.slug)).toEqual(EXPECTED_SLUGS);
  });

  it('leaves out the item that is commented out at 39bbe56', () => {
    // D53 and the slice file both say nine; the data says eight. The ninth
    // slug has a v3 route page but no data behind it, which is a dead page
    // there and a clean not-found here (D66).
    expect(PORTFOLIO_ITEMS).toHaveLength(8);
    expect(portfolioItemBySlug('cosmikata-design-system')).toBeUndefined();
  });

  it('keeps Pokémon Pet Shop, which the stale local master drops', () => {
    // D53's specific trap: porting from local `master` silently omits the
    // newest project. This asserts the port did not come from there.
    expect(portfolioItemBySlug('pokemon-pet-shop')?.title).toBe('Pokémon Pet Shop');
  });

  it('keeps the authored image paths rather than composing them from the slug', () => {
    // The folder names do not match the slugs — cricket-wireless holds
    // cw-breeze-thru's images and corporate-reports holds cr-caterpillar's.
    expect(portfolioItemBySlug('cw-breeze-thru')?.thumbnail).toBe(
      '/images/portfolio/cricket-wireless/breezeThru-thumbnail.jpg'
    );
    expect(portfolioItemBySlug('cr-caterpillar')?.images[0]?.src).toBe(
      '/images/portfolio/corporate-reports/cat01.jpg'
    );
  });

  it('gives every item an images array and every item a description', () => {
    for (const item of PORTFOLIO_ITEMS) {
      expect(Array.isArray(item.images)).toBe(true);
      expect(item.images.length).toBeGreaterThan(0);
      expect(item.description).toContain('<p>');
    }
  });

  it('carries videos only on older-cosmikata, as YouTube embeds', () => {
    const withVideos = PORTFOLIO_ITEMS.filter((item) => item.videos.length > 0);

    expect(withVideos.map((item) => item.slug)).toEqual(['older-cosmikata']);
    expect(withVideos[0]?.videos[0]?.src).toBe('https://www.youtube.com/embed/GdRP5EWrH9A');
  });

  it('returns undefined for an unknown slug — "no such item", not "failed to load"', () => {
    expect(portfolioItemBySlug('not-a-project')).toBeUndefined();
  });
});
