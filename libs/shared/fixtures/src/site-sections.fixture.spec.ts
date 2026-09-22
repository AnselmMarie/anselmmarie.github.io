import { describe, expect, it } from 'vitest';

import { SITE_SECTIONS } from './site-sections.fixture.js';

describe('SITE_SECTIONS', () => {
  it('names every section the Homepage remote must carry an id for', () => {
    // D43 — these ids are a contract between three independently deployed
    // units: the Header remote links to them, the Homepage remote puts them on
    // section elements, and the shell's header fallback links to them when the
    // Header is down. None of the three can check the others at build time, so
    // this assertion is where the agreement is written down.
    expect(SITE_SECTIONS.map((section) => section.id)).toEqual([
      'skills',
      'active-projects',
      'other-projects',
    ]);
  });

  it('gives every section a non-empty label', () => {
    for (const section of SITE_SECTIONS) {
      expect(section.label.trim()).not.toBe('');
    }
  });

  it('has no duplicate ids, which would make two links scroll to the same place', () => {
    const ids = SITE_SECTIONS.map((section) => section.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('uses ids that are valid in a URL fragment without escaping', () => {
    // An id needing escaping works in `getElementById` and fails in the href,
    // which is the quiet half of the D43 failure mode.
    for (const section of SITE_SECTIONS) {
      expect(section.id).toMatch(/^[a-z0-9-]+$/);
    }
  });
});
