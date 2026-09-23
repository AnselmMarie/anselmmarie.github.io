import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PortfolioNotFound from './portfolio-not-found.js';

describe('PortfolioNotFound', () => {
  it('names the slug that was asked for', () => {
    render(<PortfolioNotFound slug="no-such-project" />);

    expect(screen.getByTestId('portfolio-not-found')).toHaveTextContent('no-such-project');
  });

  it('offers no retry, because a missing item will never appear', () => {
    // ⚠️ The assertion that keeps this state distinct from a remote failure.
    // A "try again" here would tell a visitor with a wrong link to keep
    // clicking, and would let a real outage hide behind a not-found.
    render(<PortfolioNotFound slug="no-such-project" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('sends the visitor back to the portfolio', () => {
    render(<PortfolioNotFound slug="no-such-project" />);

    expect(screen.getByRole('link', { name: 'Back to the portfolio' })).toHaveAttribute(
      'href',
      '/#active-projects'
    );
  });
});
