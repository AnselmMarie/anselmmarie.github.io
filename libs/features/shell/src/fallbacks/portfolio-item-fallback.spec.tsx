import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import PortfolioItemFallback from './portfolio-item-fallback.js';

describe('PortfolioItemFallback', () => {
  it('offers a way back to the portfolio, which no other fallback needs', () => {
    // This is the only remote behind a dynamic route, so it is the only one
    // whose failure leaves the visitor on a page with nothing else on it.
    render(
      <PortfolioItemFallback
        mfe="portfolio-item"
        kind="load"
        attemptsRemaining={2}
        onRetry={vi.fn()}
      />
    );

    expect(screen.getByTestId('mfe-fallback-portfolio-item-back')).toHaveAttribute(
      'href',
      '/#active-projects'
    );
  });

  it('keeps the retry alongside the navigation', () => {
    render(
      <PortfolioItemFallback
        mfe="portfolio-item"
        kind="load"
        attemptsRemaining={2}
        onRetry={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('keeps the way back once the retries are spent', () => {
    // The exhausted state is exactly when the escape route matters most, and
    // it is the easy one to lose when the retry branch disappears.
    render(
      <PortfolioItemFallback
        mfe="portfolio-item"
        kind="render"
        attemptsRemaining={0}
        onRetry={vi.fn()}
      />
    );

    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument();
    expect(screen.getByTestId('mfe-fallback-portfolio-item-back')).toBeInTheDocument();
  });
});
