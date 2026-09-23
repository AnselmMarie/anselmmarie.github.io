import { describe, expect, it } from 'vitest';

import { absoluteUrl } from './absolute-url.js';

describe('absoluteUrl', () => {
  it('joins an origin and a rooted path', () => {
    expect(absoluteUrl('https://example.com', '/portfolio')).toBe('https://example.com/portfolio');
  });

  it('adds the leading slash a path is missing', () => {
    expect(absoluteUrl('https://example.com', 'portfolio')).toBe('https://example.com/portfolio');
  });

  it('does not double the slash when the origin carries a trailing one', () => {
    expect(absoluteUrl('https://example.com/', '/portfolio')).toBe('https://example.com/portfolio');
  });

  it('collapses several trailing slashes on the origin', () => {
    expect(absoluteUrl('https://example.com///', '/a')).toBe('https://example.com/a');
  });

  it('returns the bare origin for the root path', () => {
    expect(absoluteUrl('https://example.com', '/')).toBe('https://example.com/');
  });
});
