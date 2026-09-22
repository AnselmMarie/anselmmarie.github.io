import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PortfolioItemGallery from './portfolio-item-gallery.js';

const IMAGES = [
  { src: '/images/portfolio/cricket-wireless/a.jpg', alt: 'A', width: '414', height: '736' },
  { src: '/images/portfolio/cricket-wireless/b.jpg', alt: 'B', width: '414', height: '736' },
];

describe('PortfolioItemGallery', () => {
  it('renders each image at the src the data authored', () => {
    render(<PortfolioItemGallery images={IMAGES} />);

    expect(screen.getByAltText('A')).toHaveAttribute('src', IMAGES[0]?.src);
    expect(screen.getByAltText('B')).toHaveAttribute('src', IMAGES[1]?.src);
  });

  it('passes the intrinsic size through so the box is reserved', () => {
    render(<PortfolioItemGallery images={IMAGES} />);

    expect(screen.getByAltText('A')).toHaveAttribute('width', '414');
    expect(screen.getByAltText('A')).toHaveAttribute('height', '736');
  });

  it('renders nothing at all for an item with no images', () => {
    const { container } = render(<PortfolioItemGallery images={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
