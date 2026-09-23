import { describe, expect, it } from 'vitest';

import { PORTFOLIO_ITEMS } from './portfolio-items.fixture.js';

/** The rows every detail page draws, in order, even when a value is blank. */
const REQUIRED_FACT_KEYS = ['Timeline', 'Role', 'Focus'];

describe('PORTFOLIO_ITEMS facts', () => {
  it('opens every item with Timeline, Role and Focus', () => {
    for (const item of PORTFOLIO_ITEMS) {
      const leadingKeys = item.facts.slice(0, REQUIRED_FACT_KEYS.length).map((fact) => fact.key);

      expect(leadingKeys, item.slug).toEqual(REQUIRED_FACT_KEYS);
    }
  });

  it('carries exactly those three rows, with no Outcome left over', () => {
    for (const item of PORTFOLIO_ITEMS) {
      expect(
        item.facts.map((fact) => fact.key),
        item.slug
      ).toEqual(REQUIRED_FACT_KEYS);
    }
  });

  it('leaves the placeholder items blank rather than inventing values', () => {
    for (const slug of ['micro-frontend-update', 'prototype-company-division']) {
      const item = PORTFOLIO_ITEMS.find((candidate) => candidate.slug === slug);

      expect(
        item?.facts.map((fact) => fact.value),
        slug
      ).toEqual(['', '', '']);
    }
  });
});
