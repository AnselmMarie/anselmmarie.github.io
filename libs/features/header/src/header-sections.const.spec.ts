import { describe, expect, it } from 'vitest';

import { HEADER_SECTIONS } from './header-sections.const.js';

describe('HEADER_SECTIONS', () => {
  it('names every section the Homepage remote must carry an id for', () => {
    // D43 — these ids are the contract with Slice 6. This assertion is the
    // only place the two remotes' agreement is written down, so a rename here
    // that Slice 6 does not follow shows up as a failing spec rather than a
    // link that silently scrolls nowhere.
    expect(HEADER_SECTIONS.map((section) => section.id)).toEqual([
      'skills',
      'active-projects',
      'other-projects',
    ]);
  });

  it('gives every section a non-empty label', () => {
    for (const section of HEADER_SECTIONS) {
      expect(section.label.trim()).not.toBe('');
    }
  });

  it('has no duplicate ids, which would make two links scroll to the same place', () => {
    const ids = HEADER_SECTIONS.map((section) => section.id);

    expect(new Set(ids).size).toBe(ids.length);
  });
});
