import { describe, expect, it } from 'vitest';

import { HOMEPAGE_EXPERIENCE, HOMEPAGE_FOOTNOTES } from './homepage-experience.fixture.js';

describe('HOMEPAGE_EXPERIENCE', () => {
  it('carries the seven roles the export lists, newest first', () => {
    expect(HOMEPAGE_EXPERIENCE.map((entry) => entry.company)).toEqual([
      'Cosmikata',
      'Southern Glazer’s Wine & Spirits',
      'Inspire Brands',
      'Cricket Wireless',
      'ADP',
      'Cricket Wireless',
      'Corporate Reports, Inc.',
    ]);
  });

  it('gives Cricket Wireless two distinct ids', () => {
    // ⚠️ The accordion keys on `id`. Cricket appears twice — 2013–2019 and
    // 2020–2023 — so a company-keyed or title-keyed accordion would open both
    // rows at once. This is the specific reason `id` exists on the entry.
    const cricket = HOMEPAGE_EXPERIENCE.filter((e) => e.company === 'Cricket Wireless');

    expect(cricket).toHaveLength(2);
    expect(cricket[0]?.id).not.toBe(cricket[1]?.id);
  });

  it('keeps every id unique across the list', () => {
    const ids = HOMEPAGE_EXPERIENCE.map((entry) => entry.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("supports both of D87's figures from its own rows", () => {
    /*
     * ⚠️ **This list is the evidence for two numbers rendered above it.**
     * `13+ years shipping` (D103) and `13+ · Years in lead & architect roles`
     * both read 2013 → 2026 off the Cricket Manager row; the oldest row is
     * still 2011, so neither figure overstates the list. D87 closed Q21 by measuring exactly this, and the
     * property that keeps the two from drifting again is that both are
     * derivable from the table on the page.
     */
    const oldest = HOMEPAGE_EXPERIENCE.at(-1);
    const leadBoundary = HOMEPAGE_EXPERIENCE.find((e) => e.period === '2013 – 2019');

    expect(oldest?.period).toBe('2011 – 2013');
    expect(leadBoundary?.role).toBe('Senior Developer / Manager');
  });

  it('leads the Cosmikata stack with React and closes it with the design tooling', () => {
    const cosmikata = HOMEPAGE_EXPERIENCE.find((e) => e.id === 'cosmikata-2025');
    const stack = cosmikata?.stack.split(' · ') ?? [];

    expect(stack.slice(0, 2)).toEqual(['React', 'React Native']);
    expect(stack.slice(-2)).toEqual(['Design System', 'Figma']);
  });

  it('gives every entry a period, a place, a stack and at least two points', () => {
    for (const entry of HOMEPAGE_EXPERIENCE) {
      expect(entry.period, entry.id).toMatch(/^\d{4}( – (\d{4}|Present))?$/u);
      expect(entry.place, entry.id).not.toBe('');
      expect(entry.stack, entry.id).toContain('·');
      expect(entry.points.length, entry.id).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('HOMEPAGE_FOOTNOTES', () => {
  it('carries the award and the degree as key/title/detail', () => {
    // ⚠️ Not the design's k/t/d — same rename as ItemFact, same reason.
    expect(HOMEPAGE_FOOTNOTES.map((note) => note.key)).toEqual(['Award', 'Education']);
    expect(HOMEPAGE_FOOTNOTES[0]?.title).toBe('AT&T Service Excellence Award');
  });
});
