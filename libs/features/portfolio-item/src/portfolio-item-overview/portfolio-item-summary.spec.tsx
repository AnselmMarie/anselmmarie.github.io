import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PortfolioItemSummary from './portfolio-item-summary.js';

describe('PortfolioItemSummary', () => {
  it('renders the lede, then one paragraph per body entry as plain text', () => {
    render(<PortfolioItemSummary lede="The lede." body={['One.', '<b>Two.</b>']} />);

    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('The lede.')).toBeInTheDocument();
    expect(screen.getByText('One.')).toBeInTheDocument();
    // Plain text, unlike `description` — markup in `body` is shown, not parsed.
    expect(screen.getByText('<b>Two.</b>')).toBeInTheDocument();
  });
});
