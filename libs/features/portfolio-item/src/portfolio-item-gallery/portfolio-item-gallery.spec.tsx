import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PortfolioItemGallery, { isLandscape } from './portfolio-item-gallery.js';

const PORTRAIT = { src: '/images/portfolio/a/tall.jpg', alt: 'Tall', width: '414', height: '736' };
const LANDSCAPE = {
  src: '/images/portfolio/a/wide.jpg',
  alt: 'Wide',
  width: '1510',
  height: '957',
};

const shapeOf = (alt: string): string | null =>
  screen.getByAltText(alt).parentElement?.getAttribute('data-shape') ?? null;

describe('isLandscape', () => {
  it('reads the ratio off the authored dimensions (D86)', () => {
    expect(isLandscape(LANDSCAPE)).toBe(true);
    expect(isLandscape(PORTRAIT)).toBe(false);
  });

  it('treats a square image as landscape', () => {
    expect(isLandscape({ ...PORTRAIT, width: '800', height: '800' })).toBe(true);
  });
});

describe('PortfolioItemGallery', () => {
  it('renders each image at the src the data authored', () => {
    render(<PortfolioItemGallery images={[PORTRAIT, LANDSCAPE]} />);

    expect(screen.getByAltText('Tall')).toHaveAttribute('src', PORTRAIT.src);
    expect(screen.getByAltText('Wide')).toHaveAttribute('src', LANDSCAPE.src);
  });

  it('passes the authored size through so the box is reserved', () => {
    render(<PortfolioItemGallery images={[PORTRAIT]} />);

    expect(screen.getByAltText('Tall')).toHaveAttribute('width', '414');
    expect(screen.getByAltText('Tall')).toHaveAttribute('height', '736');
  });

  it('derives each tile’s shape from its image rather than from authored layout', () => {
    render(<PortfolioItemGallery images={[PORTRAIT, LANDSCAPE]} />);

    expect(shapeOf('Tall')).toBe('portrait');
    expect(shapeOf('Wide')).toBe('landscape');
  });

  it('heads the section without the export’s designer notes', () => {
    render(<PortfolioItemGallery images={[LANDSCAPE]} />);

    expect(screen.getByRole('heading', { name: 'Screens & artifacts.' })).toBeInTheDocument();
    expect(screen.queryByText(/drop images here/i)).toBeNull();
  });

  it('renders nothing at all for an item with no images', () => {
    const { container } = render(<PortfolioItemGallery images={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
