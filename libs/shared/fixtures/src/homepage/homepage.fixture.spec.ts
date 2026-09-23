import { describe, expect, it } from 'vitest';

import { PORTFOLIO_ITEMS } from '../portfolio-items/portfolio-items.fixture.js';
import { SITE_SECTIONS } from '../site-sections/site-sections.fixture.js';
import { HOMEPAGE_CONTENT } from './homepage.fixture.js';

describe('HOMEPAGE_CONTENT — the work grid', () => {
  it('shows six cards, with five hidden (maintainer, 2026-09-23)', () => {
    // The ported slugs win in every case — `cw-breeze-thru`, not
    // `breeze-thru` — because the slug is the /portfolio/$slug segment and
    // renaming it breaks every published URL.
    expect(HOMEPAGE_CONTENT.work.map((card) => card.slug)).toEqual([
      'webpage-v3',
      'micro-frontend-update',
      'prototype-company-division',
      'cosmikata',
      'cw-breeze-thru',
      'older-cosmikata',
    ]);
  });

  it('hides the five cards without dropping their items from the catalogue', () => {
    const hidden = [
      'pokemon-pet-shop',
      'rove-logix',
      'rove-logix-ui-update',
      'csp-generator-app',
      'cr-caterpillar',
    ];
    const shown = new Set(HOMEPAGE_CONTENT.work.map((card) => card.slug));
    const catalogue = new Set(PORTFOLIO_ITEMS.map((item) => item.slug));

    for (const slug of hidden) {
      expect(shown.has(slug), slug).toBe(false);
      expect(catalogue.has(slug), slug).toBe(true);
    }
  });

  it('points every card at an item that exists', () => {
    // A card whose slug matches nothing renders nothing, silently. This is
    // the only place the two fixtures are checked against each other.
    const slugs = new Set(PORTFOLIO_ITEMS.map((item) => item.slug));

    for (const card of HOMEPAGE_CONTENT.work) {
      expect(slugs.has(card.slug), card.slug).toBe(true);
    }
  });

  it('draws no dark card and no Live pill among the visible cards', () => {
    // The Live pill was removed from every card (maintainer, 2026-09-23).
    expect(HOMEPAGE_CONTENT.work.filter((c) => c.isDark)).toEqual([]);
    expect(HOMEPAGE_CONTENT.work.filter((c) => c.isLive)).toEqual([]);
  });

  it('gives every card a hex background', () => {
    for (const card of HOMEPAGE_CONTENT.work) {
      expect(card.background, card.slug).toMatch(/^#[0-9A-F]{6}$/u);
    }
  });
});

describe('HOMEPAGE_CONTENT — specs strip', () => {
  it('names the location as Atlanta alone, without "Remote"', () => {
    // Maintainer's call, 2026-09-23 — the export reads `Atlanta · Remote`.
    expect(HOMEPAGE_CONTENT.specs).toContain('Atlanta');
    expect(HOMEPAGE_CONTENT.specs).not.toContain('Atlanta · Remote');
  });
});

describe('HOMEPAGE_CONTENT — the two corrected figures (D87)', () => {
  it("reads 13+ years shipping in the strip, not D87's 15+ (D103)", () => {
    // 2013 → 2026, the same span as the About card's 13+ lead-roles figure.
    expect(HOMEPAGE_CONTENT.specs).toContain('13+ years shipping');
    expect(HOMEPAGE_CONTENT.specs).not.toContain('15+ years shipping');
  });

  it("reads 13+ years in lead roles in the About card, not the design's 10+", () => {
    // The export had the same claim twice, in different words and different
    // numbers. `10+` matched no boundary in the experience list at all.
    expect(HOMEPAGE_CONTENT.about.stats[0]).toEqual({
      value: '13+',
      label: 'Years in lead & architect roles',
    });
    expect(HOMEPAGE_CONTENT.about.stats.map((s) => s.value)).not.toContain('10+');
  });

  it('keeps the two stats measuring different things', () => {
    // The relabelling is the point of D87: one is a career number, the other
    // a lead-scope number. Two stats that both say "years shipping" is the
    // defect it closed.
    const labels = HOMEPAGE_CONTENT.about.stats.map((s) => s.label);

    expect(new Set(labels).size).toBe(labels.length);
  });
});

describe('HOMEPAGE_CONTENT — structure', () => {
  it('gives the hero exactly two CTAs and no social links', () => {
    // The design replaced the hero's LinkedIn/GitHub marks with these two.
    // The same destinations live in feature-footer's own const, so the marks
    // still render — on every page rather than only this one.
    expect(HOMEPAGE_CONTENT.hero.ctas.map((c) => c.label)).toEqual(['View work', 'Get in touch']);
    expect(HOMEPAGE_CONTENT.hero).not.toHaveProperty('links');
  });

  it('splits the hero headline so the accent break stays content', () => {
    expect(HOMEPAGE_CONTENT.hero.headline).toEqual({
      lead: 'Building the\nfront-end,',
      accent: 'end to end.',
    });
  });

  it("adopts the design's four skill groups and drops cardId", () => {
    // Maintainer's call, 2026-09-22. ⚠️ The UI/UX group — Figma, Sketch,
    // Adobe XD — is dropped with it, which this page's own About copy
    // ("equally comfortable tweaking spacing in Figma") argues against; that
    // was surfaced before the choice was made.
    expect(HOMEPAGE_CONTENT.skillGroups.map((g) => g.heading)).toEqual([
      'Frontend',
      'Backend',
      'Architecture',
      'Platform & Quality',
    ]);
    for (const group of HOMEPAGE_CONTENT.skillGroups) {
      expect(group, group.id).not.toHaveProperty('cardId');
    }
  });

  it('lists AWS under Platform & Quality', () => {
    const platform = HOMEPAGE_CONTENT.skillGroups.find((g) => g.id === 'platform-quality');

    expect(platform?.skills).toContain('AWS');
  });

  it('no longer carries projectGroups', () => {
    // D72/D77: the two v3 headings — Active Projects and Other Projects —
    // stop existing. A real content change, not a rename.
    expect(HOMEPAGE_CONTENT).not.toHaveProperty('projectGroups');
  });

  it('gives the three headed sections an intro and leaves About and Contact self-contained', () => {
    expect(HOMEPAGE_CONTENT.sectionIntros.map((i) => i.sectionId)).toEqual([
      'work',
      'experience',
      'skills',
    ]);
    expect(HOMEPAGE_CONTENT.about.eyebrow).toBe('About');
    expect(HOMEPAGE_CONTENT.contact.eyebrow).toBe('Contact');
  });
});

describe('HOMEPAGE_CONTENT — the anchor contract (D81)', () => {
  it('points every intro and every hero CTA at a real SITE_SECTIONS id', () => {
    /*
     * ⚠️ **This spec was a tripwire until Slice 12, and it went red on the
     * commit that re-pointed `SITE_SECTIONS` — which is what it was for.**
     * Slice 11 authored its copy against the design's five anchors while D81
     * still gave the section list to Slice 12, so until that landed `work`,
     * `experience` and `contact` resolved to nothing. It now asserts the
     * agreement plainly.
     *
     * ⚠️ **It still cannot see a rendered `id` attribute.** The Homepage
     * remote putting these ids on its section elements is the third leg of
     * the contract and no spec in this workspace can reach it — that is the
     * browser check in Slice 12's gates.
     */
    const known = new Set(SITE_SECTIONS.map((section) => section.id));
    const anchors = [
      ...HOMEPAGE_CONTENT.sectionIntros.map((intro) => intro.sectionId),
      ...HOMEPAGE_CONTENT.hero.ctas.map((cta) => cta.href.replace('#', '')),
    ];

    expect(anchors.filter((id) => !known.has(id))).toEqual([]);
  });

  it("carries the design's five anchors, in page order", () => {
    expect(SITE_SECTIONS.map((section) => section.id)).toEqual([
      'work',
      'experience',
      'skills',
      'about',
      'contact',
    ]);
  });
});
