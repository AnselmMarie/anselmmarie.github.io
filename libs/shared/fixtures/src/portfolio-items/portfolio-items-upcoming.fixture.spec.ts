import { describe, expect, it } from 'vitest';

import { portfolioItemBySlug } from './portfolio-items.fixture.js';
import { PLACEHOLDER_SLUGS } from './portfolio-items-upcoming.fixture.js';

describe('UPCOMING_PORTFOLIO_ITEMS — the placeholders', () => {
  it('keeps the placeholder items renderable until their copy is written', () => {
    // Added 2026-09-23 with titles only. They must still produce a card and a
    // detail page, so the fields those read are asserted non-empty.
    expect(PLACEHOLDER_SLUGS).toEqual([
      'webpage-v3',
      'micro-frontend-update',
      'prototype-company-division',
    ]);

    for (const slug of PLACEHOLDER_SLUGS) {
      const item = portfolioItemBySlug(slug);

      expect(item?.title, slug).not.toBe('');
      expect(item?.lede, slug).not.toBe('');
      expect(item?.year, slug).toMatch(/^\d{4}$/u);
      expect(item?.description, slug).toContain('<p>');
    }
  });

  it("gives Micro Frontend Architecture Migration the maintainer's summary line", () => {
    expect(portfolioItemBySlug('micro-frontend-update')?.lede).toBe(
      'Contributed to a React micro-frontend migration, building federated modules and standardizing tooling, analytics, and testing.'
    );
  });

  it("gives From Prototype to New Company Division the maintainer's summary line", () => {
    expect(portfolioItemBySlug('prototype-company-division')?.lede).toBe(
      'Led POS UI design and prototyping that secured executive approval for a new internal product division.'
    );
  });

  it("carries the maintainer's company and tech on each placeholder", () => {
    expect(portfolioItemBySlug('webpage-v3')).toMatchObject({
      title: 'v3',
      company: 'Anselm Marie',
      tech: ['React', 'TanStack Start'],
      year: '2026',
    });
    expect(portfolioItemBySlug('micro-frontend-update')).toMatchObject({
      company: 'Southern Glazer’s Wine & Spirits',
      tech: ['React', 'Module Federation', 'TanStack'],
      year: '2025',
    });
    expect(portfolioItemBySlug('prototype-company-division')).toMatchObject({
      company: 'Cricket Wireless',
      tech: ['Design', 'JavaScript'],
      year: '2017',
    });
  });
});
