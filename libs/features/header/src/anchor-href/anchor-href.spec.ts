import { describe, expect, it } from 'vitest';

import { anchorHref, HOME_PATH } from './anchor-href.js';

describe('anchorHref', () => {
  it('returns a bare fragment on the homepage, so the jump does not reload', () => {
    expect(anchorHref('skills', HOME_PATH)).toBe('#skills');
  });

  it('carries the path from any other page, where the section is not present', () => {
    expect(anchorHref('skills', '/portfolio/pokemon-pet-shop')).toBe('/#skills');
  });

  it('treats a nested path the same as a top-level one', () => {
    expect(anchorHref('other-projects', '/portfolio/rove-logix')).toBe('/#other-projects');
  });
});
