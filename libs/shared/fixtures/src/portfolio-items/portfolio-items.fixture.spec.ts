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

  /* ── Slice 11: the redesign's field set ──────────────────────────────── */

  it('gives every item the six redesign fields, populated', () => {
    // The order below is the type's. A field added to PortfolioItem and left
    // unauthored on one item is the failure this catches — the package is
    // frozen for the whole 12/13/14/15/16 wave, so a gap found later cannot
    // be filled without a coordinator pass.
    for (const item of PORTFOLIO_ITEMS) {
      expect(item.year, item.slug).toMatch(/^\d{4}( – \d{4})?$/u);
      expect(item.role, item.slug).not.toBe('');
      expect(item.lede, item.slug).not.toBe('');
      expect(item.body.length, item.slug).toBeGreaterThanOrEqual(2);
      expect(item.tech.length, item.slug).toBeGreaterThanOrEqual(4);
      expect(item.facts, item.slug).toHaveLength(3);
    }
  });

  it('ships no placeholder link — a real absolute URL or no link at all', () => {
    // The design gives most projects a `href: '#'` pill. Slice 11 drops them
    // rather than shipping a dead anchor, so five of the eight items carry an
    // empty array. ⚠️ An empty `links` is the expected state, not a gap.
    for (const item of PORTFOLIO_ITEMS) {
      for (const link of item.links) {
        expect(link.href, `${item.slug} → ${link.label}`).toMatch(/^https:\/\//u);
        expect(link.label, item.slug).not.toBe('');
      }
    }

    expect(PORTFOLIO_ITEMS.filter((item) => item.links.length > 0).map((i) => i.slug)).toEqual([
      'pokemon-pet-shop',
      'csp-generator-app',
    ]);
  });

  it("keeps facts as key/value, never the design's k/v", () => {
    // The export abbreviates because it is hand-written template data. A
    // two-character field name in a shared type is a cost paid by every
    // reader forever, so the rename is asserted rather than assumed.
    const fact = portfolioItemBySlug('pokemon-pet-shop')?.facts[0];

    expect(fact).toEqual({ key: 'Timeline', value: '6 weeks, nights and weekends' });
  });

  it('keeps the HTML description and the videos the design does not draw (D78)', () => {
    // Had the design's content been adopted wholesale, D69 and its dompurify
    // sanitizer would have lost their subject entirely. Both body fields
    // coexist on purpose: `body` is plain, `description` is HTML.
    const older = portfolioItemBySlug('older-cosmikata');

    expect(older?.description).toContain('<ul>');
    expect(older?.videos).toHaveLength(2);
    expect(older?.body.every((p) => !p.includes('<'))).toBe(true);
  });

  it('carries the two items the design covers nowhere', () => {
    // D77: every new field on these two is invented. Asserted so that a later
    // reader can see they were authored deliberately rather than missed.
    for (const slug of ['rove-logix-ui-update', 'older-cosmikata']) {
      const item = portfolioItemBySlug(slug);

      expect(item?.lede, slug).not.toBe('');
      expect(item?.facts, slug).toHaveLength(3);
    }
  });
});
