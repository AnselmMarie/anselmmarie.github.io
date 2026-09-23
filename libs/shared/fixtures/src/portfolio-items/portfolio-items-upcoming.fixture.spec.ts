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
      'cw-enterprise-admin',
    ]);

    for (const slug of PLACEHOLDER_SLUGS) {
      const item = portfolioItemBySlug(slug);

      expect(item?.title, slug).not.toBe('');
      expect(item?.lede, slug).not.toBe('');
      expect(item?.year, slug).toMatch(/^\d{4}( – \d{4})?$/u);
      expect(item?.description, slug).toMatch(/<(p|ul)>/u);
    }
  });

  it("gives Micro Frontend Architecture Migration the maintainer's summary line", () => {
    expect(portfolioItemBySlug('micro-frontend-update')?.lede).toBe(
      'Modernizing checkout through micro-frontends, shared architecture, and testing.'
    );
  });

  it("gives Micro Frontend Architecture Migration the maintainer's summary and details", () => {
    const item = portfolioItemBySlug('micro-frontend-update');

    expect(item?.body).toHaveLength(1);
    expect(item?.body[0]).toMatch(/^Contributed to the migration of a legacy Java checkout/u);
    expect(item?.body.every((p) => !p.includes('<'))).toBe(true);
    expect(item?.description).not.toContain('<p>');
    expect(item?.description.match(/<li>/gu)).toHaveLength(8);
    expect(item?.description).not.toContain('proofs of concept');
    expect(item?.description).toContain('<li>Contributed to the Nx monorepo migration');
    expect(item?.description).toMatch(
      /across implementation, testing, and iteration\.<\/li>\s*<\/ul>/u
    );
    expect(item?.description).not.toContain('Applied structured AI rules');
    expect(item?.description).not.toContain('coming soon');
  });

  it("gives v3 the maintainer's summary and details, including the AWS and GitHub Actions flow", () => {
    const item = portfolioItemBySlug('webpage-v3');

    expect(item?.body).toHaveLength(1);
    expect(item?.body[0]).toMatch(/^A server-rendered TanStack Start shell composes/u);
    expect(item?.description).not.toContain('coming soon');
    // The summary must not restate the lede, which the page draws right above it.
    expect(item?.body[0]).not.toMatch(/rebuil/u);
    expect(item?.body[0]).toContain('AI-assisted development workflows');
    expect(item?.description.match(/<li>/gu)).toHaveLength(8);
    expect(item?.description).toContain('<li>Built with AI-assisted development workflows');
    expect(item?.description).toContain('arm64 Lambda');
    expect(item?.description).toContain('S3 behind CloudFront');
    expect(item?.description).toContain('GitHub Actions workflow');
  });

  it("gives v3 the maintainer's three facts", () => {
    expect(portfolioItemBySlug('webpage-v3')?.facts).toEqual([
      { key: 'Timeline', value: 'Less than a month' },
      { key: 'Role', value: 'Lead designer and developer' },
      { key: 'Focus', value: 'Architecting independently deployable micro-frontends on AWS' },
    ]);
  });

  it("gives From Prototype to New Company Division the maintainer's summary and details", () => {
    const item = portfolioItemBySlug('prototype-company-division');

    expect(item?.body).toHaveLength(1);
    expect(item?.body[0]).toMatch(
      /^Designed and prototyped the POS experience for Cricket Wireless/u
    );
    expect(item?.description).not.toContain('coming soon');
    expect(item?.description.match(/<li>/gu)).toHaveLength(9);
    expect(item?.description).toContain('<li>Tasked by the director with exploring');
    expect(item?.description).toMatch(
      /reduced reliance on the outsourced system\.<\/li>\s*<\/ul>/u
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
      year: '2026',
    });
    // The card's stack line reads the first three.
    expect(portfolioItemBySlug('webpage-v3')?.tech.slice(0, 3)).toEqual([
      'React',
      'TanStack Start',
      'Module Federation',
    ]);
    expect(portfolioItemBySlug('webpage-v3')?.tech).toEqual(
      expect.arrayContaining(['Nx', 'AWS CDK', 'GitHub Actions', 'AI'])
    );
    expect(portfolioItemBySlug('micro-frontend-update')).toMatchObject({
      company: 'Southern Glazer’s Wine & Spirits',
      tech: ['React', 'Module Federation', 'TanStack', 'AI'],
      year: '2025',
    });
    expect(portfolioItemBySlug('prototype-company-division')).toMatchObject({
      company: 'Cricket Wireless',
      tech: ['Design', 'JavaScript'],
      year: '2017',
    });
  });

  it("gives From Prototype to New Company Division the maintainer's three facts", () => {
    expect(portfolioItemBySlug('prototype-company-division')?.facts).toEqual([
      { key: 'Timeline', value: 'Within a year' },
      { key: 'Role', value: 'Lead designer and developer' },
      { key: 'Focus', value: 'Prototyping an in-house POS platform' },
    ]);
  });

  it("gives Micro Frontend Architecture Migration the maintainer's three facts", () => {
    expect(portfolioItemBySlug('micro-frontend-update')?.facts).toEqual([
      { key: 'Timeline', value: 'MVP under a year' },
      { key: 'Role', value: 'Senior Software Engineer' },
      {
        key: 'Focus',
        value: 'Mapped legacy code and APIs to guide migration and build out the new platform',
      },
    ]);
  });

  it('gives Enterprise Admin Platform the Cricket tech-lead copy (2026-09-23)', () => {
    const item = portfolioItemBySlug('cw-enterprise-admin');

    expect(item).toMatchObject({
      title: 'Enterprise Admin Platform',
      company: 'Cricket Wireless',
      // The Cricket tech-lead row's period, so it sorts as 2023.
      year: '2020 – 2023',
    });
    expect(item?.facts.map((fact) => fact.value)).toEqual([
      'Multi-year roadmap',
      'Tech lead, 4 engineers',
      'Re-architecting the frontend and standardizing it on a design system',
    ]);
    expect(item?.body).toHaveLength(1);
    // A department-level sub design system, not a company-wide one (maintainer, 2026-09-23).
    expect(item?.body[0]).toContain('department-level sub design system');
    expect(item?.body[0]).not.toContain('internal and external applications');
    expect(item?.description).toContain('Established the department’s sub design system');
    expect(item?.description).toContain('department’s sub design system in Figma and Adobe XD');
    expect(item?.description).not.toContain('internal and external');
    expect(item?.description.match(/<li>/gu)).toHaveLength(7);
    expect(item?.description).toContain('throughput by ~20%');
    expect(item?.description).toContain('performance and scalability by ~40%');
    expect(item?.description).toContain('production defects by ~35%');
    expect(item?.description).toContain('headless CMS integration');
    // Angular dropped from the stack (maintainer, 2026-09-23).
    expect(item?.tech).not.toContain('Angular');
    expect(item?.description).not.toContain('Angular');
  });
});
