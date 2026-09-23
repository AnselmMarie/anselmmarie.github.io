import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { ItemLink } from '@portfolio/shared-types';

import PortfolioItemLinks from './portfolio-item-links.js';

const LINKS: readonly ItemLink[] = [
  { label: 'Live tool', href: 'https://example.test/', icon: 'external' },
  { label: 'Source', href: 'https://github.com/x/y', icon: 'github' },
];

describe('PortfolioItemLinks', () => {
  it('renders one outbound link per entry, opening safely in a new tab', () => {
    render(<PortfolioItemLinks links={LINKS} />);

    const live = screen.getByRole('link', { name: 'Live tool' });

    expect(live).toHaveAttribute('href', 'https://example.test/');
    expect(live).toHaveAttribute('target', '_blank');
    expect(live).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByRole('link', { name: 'Source' })).toBeInTheDocument();
  });

  it('labels the column', () => {
    render(<PortfolioItemLinks links={LINKS} />);

    expect(screen.getByText('Links')).toBeInTheDocument();
  });

  it('renders nothing for an item with no real links', () => {
    const { container } = render(<PortfolioItemLinks links={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
