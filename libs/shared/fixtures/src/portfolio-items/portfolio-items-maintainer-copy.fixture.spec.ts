import { describe, expect, it } from 'vitest';

import { portfolioItemBySlug } from './portfolio-items.fixture.js';

/**
 * The copy the maintainer supplied directly for Breeze-Thru and Cosmikata,
 * replacing the design's. Split out of `portfolio-items.fixture.spec.ts` to
 * keep that file under the 200-line cap.
 */
describe('PORTFOLIO_ITEMS — maintainer copy', () => {
  it("dates Breeze-Thru 2018, the maintainer's figure, not the design's 2022", () => {
    expect(portfolioItemBySlug('cw-breeze-thru')?.year).toBe('2018');
  });

  it("gives Breeze-Thru the maintainer's two skills", () => {
    expect(portfolioItemBySlug('cw-breeze-thru')?.tech).toEqual(['Design', 'JavaScript']);
  });

  it("gives Breeze-Thru the maintainer's Focus fact", () => {
    expect(portfolioItemBySlug('cw-breeze-thru')?.facts[2]).toEqual({
      key: 'Focus',
      value: 'Led design and frontend to simplify workflows and improve task completion',
    });
  });

  it("gives Breeze-Thru the maintainer's one summary paragraph and eight DETAILS bullets", () => {
    const item = portfolioItemBySlug('cw-breeze-thru');

    expect(item?.body).toHaveLength(1);
    expect(item?.body[0]).toMatch(
      /^Led frontend design and delivery for Breeze-Thru, a mobile-first/
    );
    expect(item?.description).not.toContain('<p>');
    expect(item?.description.match(/<li>/g)).toHaveLength(8);
    expect(item?.description).toContain('<li>Defined the frontend architecture');
    expect(item?.description).toMatch(
      /reference pattern for later self-service experiences\.<\/li>\s*<\/ul>/u
    );
  });

  it("gives Breeze-Thru the maintainer's summary line", () => {
    expect(portfolioItemBySlug('cw-breeze-thru')?.lede).toBe(
      'Led frontend design and delivery for a self-service activation experience.'
    );
  });

  it('adds Figma, GitHub Actions, Cloudflare and AI to Cosmikata (maintainer, 2026-09-23)', () => {
    expect(portfolioItemBySlug('cosmikata')?.tech.slice(-4)).toEqual([
      'Figma',
      'GitHub Actions',
      'Cloudflare',
      'AI',
    ]);
  });

  it("gives Cosmikata the maintainer's one summary paragraph and ten DETAILS bullets", () => {
    const item = portfolioItemBySlug('cosmikata');

    expect(item?.lede).toBe(
      'A cross-platform product architecture, shared design system, and edge-first backend.'
    );
    expect(item?.body).toHaveLength(1);
    expect(item?.body[0]).toMatch(/^Reimagined Cosmikata as a cross-platform product platform/);
    expect(item?.description).not.toContain('<p>');
    expect(item?.description.match(/<li>/g)).toHaveLength(10);
    expect(item?.description).toContain('<li>Rebuilt Cosmikata from the ground up');
    expect(item?.description).toMatch(/AI-assisted development workflows\.<\/li>\s*<\/ul>/u);
  });

  it("uses the maintainer's eight new Cosmikata screenshots, with the landing page as thumbnail", () => {
    const item = portfolioItemBySlug('cosmikata');

    expect(item?.thumbnail).toBe('/images/portfolio/cosmikata/marketing-landing.png');
    expect(item?.images.map((image) => image.src.split('/').pop())).toEqual([
      'marketing-landing.png',
      'cosplay-detail.png',
      'hub-mobile.png',
      'measurements-mobile.png',
      'events.png',
      'settings.png',
      'storybook-primitive-tokens.png',
      'splash.png',
    ]);
    expect(item?.images.every((image) => image.alt !== '')).toBe(true);
  });

  it("dates Cosmikata 2025, the maintainer's figure, not the design's 2024", () => {
    expect(portfolioItemBySlug('cosmikata')?.year).toBe('2025');
  });
});
