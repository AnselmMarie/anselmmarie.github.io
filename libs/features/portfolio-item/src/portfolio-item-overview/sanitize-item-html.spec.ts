import { describe, expect, it } from 'vitest';

import { PORTFOLIO_ITEMS } from '@portfolio/shared-fixtures';

import { sanitizeItemHtml } from './sanitize-item-html.js';

describe('sanitizeItemHtml', () => {
  it('keeps the four tags the ported bodies actually use', () => {
    const output = sanitizeItemHtml(
      '<p>Body</p><ul><li><a href="https://x.test">Link</a></li></ul>'
    );

    expect(output).toContain('<p>Body</p>');
    expect(output).toContain('<li>');
    expect(output).toContain('href="https://x.test"');
  });

  it('strips a tag outside the allow-list while keeping its text', () => {
    // The allow-list is derived from the eight bodies, not from DOMPurify's
    // defaults — `img` is one DOMPurify permits and this one does not.
    const output = sanitizeItemHtml('<p>Before<img src="x.png"><strong>bold</strong></p>');

    expect(output).not.toContain('<img');
    expect(output).not.toContain('<strong>');
    expect(output).toContain('bold');
  });

  it('removes a script and an inline handler outright', () => {
    const output = sanitizeItemHtml(
      '<p onclick="steal()">Text</p><script>steal()</script><a href="javascript:steal()">x</a>'
    );

    expect(output).not.toContain('script');
    expect(output).not.toContain('onclick');
    expect(output).not.toContain('javascript:');
  });

  it('adds rel="noopener noreferrer" to a target="_blank" link that lacks it', () => {
    // D69 point 5 — the ported copy has `target` without `rel` throughout, so
    // the sanitizer writes it rather than an author remembering to.
    const output = sanitizeItemHtml('<p><a href="https://x.test" target="_blank">Link</a></p>');

    expect(output).toContain('rel="noopener noreferrer"');
  });

  it('adds the rel to every target="_blank" link in the real ported bodies', () => {
    const blankLinks = PORTFOLIO_ITEMS.flatMap((item) => {
      const container = document.createElement('div');
      container.innerHTML = sanitizeItemHtml(item.description);

      return [...container.querySelectorAll('a[target="_blank"]')];
    });

    expect(blankLinks.length).toBeGreaterThan(0);
    for (const link of blankLinks) {
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    }
  });

  it('leaves a link without target="_blank" alone', () => {
    const output = sanitizeItemHtml('<p><a href="https://x.test">Link</a></p>');

    expect(output).not.toContain('rel=');
  });
});
