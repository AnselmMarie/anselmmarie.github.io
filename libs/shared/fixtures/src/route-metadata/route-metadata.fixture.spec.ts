import { describe, expect, it } from 'vitest';

import { HOMEPAGE_CONTENT } from '../homepage/homepage.fixture.js';
import { PORTFOLIO_ITEMS } from '../portfolio-items/portfolio-items.fixture.js';
import { HOME_METADATA, metadataForPath } from './route-metadata.fixture.js';

describe('metadataForPath', () => {
  it('resolves the home route', () => {
    expect(metadataForPath('/')).toEqual(HOME_METADATA);
  });

  it('returns undefined for a path with no entry, rather than inventing one', () => {
    expect(metadataForPath('/not-a-route')).toBeUndefined();
    expect(metadataForPath('/portfolio/not-a-project')).toBeUndefined();
  });

  it('resolves every portfolio item path with its own title, description and image', () => {
    // D48 — /portfolio/$slug is the link people actually share, so an empty
    // description here is a blank preview that looks fine in the DOM.
    for (const item of PORTFOLIO_ITEMS) {
      const metadata = metadataForPath(`/portfolio/${item.slug}`);

      expect(metadata?.title).toBe(item.title);
      expect(metadata?.description.length).toBeGreaterThan(0);
      expect(metadata?.imageUrl).toBe(item.thumbnail);
    }
  });

  it('authors the meta description rather than stripping tags from the item HTML', () => {
    // D69 point 4. The item body is HTML; the meta copy is written by hand.
    const metadata = metadataForPath('/portfolio/pokemon-pet-shop');

    expect(metadata?.description).not.toContain('<');
    expect(metadata?.description).not.toContain('As a personal challenge');
  });

  it('gives the home route a non-empty title and description', () => {
    // D48 exists to make link previews work. An empty string would render a
    // preview that looks correct in the DOM and blank in a crawler.
    expect(HOME_METADATA.title.length).toBeGreaterThan(0);
    expect(HOME_METADATA.description.length).toBeGreaterThan(0);
  });

  it('claims only titles actually held, never "Architect" (maintainer, 2026-09-26)', () => {
    // A page title reads as a job title. Architecture is described as work in
    // the copy, never claimed as a title in the tab, the strip or the hero.
    const claims = [
      HOME_METADATA.title,
      HOME_METADATA.description,
      ...HOMEPAGE_CONTENT.specs,
      HOMEPAGE_CONTENT.hero.lede,
    ];

    expect(HOME_METADATA.title).toBe('Anselm Marie — Senior Software Engineer & Tech Lead');
    for (const claim of claims) expect(claim).not.toMatch(/architect\b/i);
  });
});
