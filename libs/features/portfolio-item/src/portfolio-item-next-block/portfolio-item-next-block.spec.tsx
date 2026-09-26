import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PortfolioItemNextBlock from './portfolio-item-next-block.js';

describe('PortfolioItemNextBlock', () => {
  it('asks the closing question', () => {
    render(<PortfolioItemNextBlock />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Want the deeper walkthrough?' })
    ).toBeInTheDocument();
  });

  it('points both pills at the homepage anchors with plain hrefs', () => {
    render(<PortfolioItemNextBlock />);

    expect(screen.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '/#contact');
    expect(screen.getByRole('link', { name: 'More work' })).toHaveAttribute('href', '/#work');
  });

  it('draws no footer strip of its own (D79)', () => {
    render(<PortfolioItemNextBlock />);

    expect(screen.queryByText(/©/)).toBeNull();
  });
});
