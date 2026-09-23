import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PortfolioItemHeader from './portfolio-item-header.js';

describe('PortfolioItemHeader', () => {
  it('makes the project name the page heading, with the company above it', () => {
    render(
      <PortfolioItemHeader title="Breeze-Thru" company="Cricket Wireless" subtitle="Design" />
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Breeze-Thru' })).toBeInTheDocument();
    expect(screen.getByText('Cricket Wireless')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
  });
});
