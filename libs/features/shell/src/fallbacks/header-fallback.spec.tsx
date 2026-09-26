import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SITE_NAME, SITE_SECTIONS } from '@portfolio/shared-fixtures';

import HeaderFallback from './header-fallback.js';

describe('HeaderFallback', () => {
  it('keeps the site navigable when the Header remote is down', () => {
    render(<HeaderFallback />);

    expect(screen.getByRole('link', { name: SITE_NAME })).toHaveAttribute('href', '/');
  });

  it('links to every section, reading the same contract the Header remote reads', () => {
    // ⚠️ This is the assertion that makes the extraction worth it. The shell
    // CANNOT import `@portfolio/feature-header` — D16 forbids a fallback
    // depending on the remote it stands in for, and the Nx boundary rule
    // enforces it — so a hardcoded copy of these ids here could drift from the
    // Header's and the Homepage's with nothing able to compare them.
    render(<HeaderFallback />);

    for (const section of SITE_SECTIONS) {
      expect(screen.getByRole('link', { name: section.label })).toHaveAttribute(
        'href',
        `/#${section.id}`
      );
    }
  });

  it('uses absolute anchors, because the fallback can render off the homepage', () => {
    // A bare `#skills` on `/portfolio/cosmikata` looks for a section that is
    // not on the page. The Header remote makes the same distinction in
    // `anchorHref`; the fallback has no pathname to read, so it always
    // qualifies.
    render(<HeaderFallback />);

    for (const link of screen.getAllByRole('link')) {
      expect(link.getAttribute('href')).toMatch(/^\//);
    }
  });
});
