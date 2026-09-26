import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SITE_NAME } from '@portfolio/shared-fixtures';

import FooterFallback from './footer-fallback.js';

describe('FooterFallback', () => {
  it('renders rather than omitting, so the page keeps its shape', () => {
    // The doc permits omission. Rendering is the call made here: an omitted
    // footer collapses the page's bottom edge and reads as a layout bug rather
    // than a degraded region.
    render(<FooterFallback />);

    expect(screen.getByTestId('mfe-fallback-footer')).toHaveTextContent(SITE_NAME);
  });

  it('offers no retry, because the footer is not what the visitor came for', () => {
    render(<FooterFallback />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
