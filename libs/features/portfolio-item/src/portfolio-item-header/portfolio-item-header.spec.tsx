import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PortfolioItemHeader from './portfolio-item-header.js';

const LINKS = [{ label: 'Source', href: 'https://github.com/x/y', icon: 'github' as const }];

describe('PortfolioItemHeader', () => {
  it('draws no heading — the page’s h1 lives in the hero card', () => {
    render(
      <PortfolioItemHeader company="Cricket Wireless" year="2018" jobRole="Lead" links={[]} />
    );

    expect(screen.queryByRole('heading')).toBeNull();
  });

  it('draws client, year and role in the meta row', () => {
    render(
      <PortfolioItemHeader company="Cricket Wireless" year="2018" jobRole="Tech Lead" links={[]} />
    );

    const row = screen.getByTestId('portfolio-item-meta-row');

    expect(row).toHaveTextContent('Cricket Wireless');
    expect(row).toHaveTextContent('2018');
    expect(row).toHaveTextContent('Tech Lead');
  });

  it('skips an empty meta value rather than drawing a lone rule', () => {
    render(<PortfolioItemHeader company="Acme" year="2025" jobRole="" links={[]} />);

    expect(screen.getByTestId('portfolio-item-meta-row').children).toHaveLength(2);
  });

  it('forwards the links to the links column', () => {
    render(<PortfolioItemHeader company="Acme" year="2025" jobRole="Lead" links={LINKS} />);

    expect(screen.getByRole('link', { name: 'Source' })).toHaveAttribute(
      'href',
      'https://github.com/x/y'
    );
  });
});
