import { describe, expect, it } from 'vitest';

import { PORTFOLIO_ITEMS } from '@portfolio/shared-fixtures';

import { isAllowedHref, portfolioHref } from './navigate-event.js';

const SLUG = PORTFOLIO_ITEMS[0]?.slug ?? '';

describe('isAllowedHref', () => {
  it.each(['/', '/#work', '/#contact', `/portfolio/${SLUG}`])('accepts %s', (href) => {
    expect(isAllowedHref(href)).toBe(true);
  });

  it.each([
    '/#admin',
    '/portfolio/not-a-project',
    `/portfolio/${SLUG}/extra`,
    `/portfolio/${SLUG}?next=//evil.example`,
    'https://evil.example',
    '//evil.example',
    'javascript:alert(1)',
    '#work',
    '',
  ])('rejects %s', (href) => {
    expect(isAllowedHref(href)).toBe(false);
  });
});

describe('portfolioHref', () => {
  it('builds a portfolio page path that isAllowedHref accepts', () => {
    expect(portfolioHref(SLUG)).toBe(`/portfolio/${SLUG}`);
    expect(isAllowedHref(portfolioHref(SLUG))).toBe(true);
  });
});
