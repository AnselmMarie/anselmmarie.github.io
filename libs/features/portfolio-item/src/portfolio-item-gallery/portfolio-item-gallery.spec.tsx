import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PortfolioItemGallery, {
  isLandscape,
  isShownAtOwnSize,
  tileShapeOf,
} from './portfolio-item-gallery.js';

const PORTRAIT = { src: '/images/portfolio/a/tall.jpg', alt: 'Tall', width: '414', height: '736' };
const PHONE = { src: '/images/portfolio/a/phone.png', alt: 'Phone', width: '340', height: '716' };
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

describe('tileShapeOf', () => {
  it('gives an image at least twice as tall as wide the tall tile', () => {
    expect(tileShapeOf(PHONE)).toBe('tall');
    expect(tileShapeOf({ ...PHONE, width: '400', height: '800' })).toBe('tall');
  });

  it('keeps a 16:9 phone and anything wider on the portrait and landscape tiles', () => {
    expect(tileShapeOf(PORTRAIT)).toBe('portrait');
    expect(tileShapeOf({ ...PORTRAIT, width: '401', height: '800' })).toBe('portrait');
    expect(tileShapeOf(LANDSCAPE)).toBe('landscape');
  });
});

describe('isShownAtOwnSize', () => {
  it('never stretches a phone screenshot or a landscape image narrower than 1000px', () => {
    expect(isShownAtOwnSize(PHONE)).toBe(true);
    expect(isShownAtOwnSize({ ...LANDSCAPE, width: '815', height: '716' })).toBe(true);
    expect(isShownAtOwnSize({ ...LANDSCAPE, width: '999', height: '716' })).toBe(true);
  });

  it('lets large landscapes and ordinary portraits fill their tile as designed', () => {
    expect(isShownAtOwnSize(LANDSCAPE)).toBe(false);
    expect(isShownAtOwnSize({ ...LANDSCAPE, width: '1000', height: '716' })).toBe(false);
    expect(isShownAtOwnSize(PORTRAIT)).toBe(false);
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
    render(<PortfolioItemGallery images={[PORTRAIT, LANDSCAPE, PHONE]} />);

    expect(shapeOf('Tall')).toBe('portrait');
    expect(shapeOf('Wide')).toBe('landscape');
    expect(shapeOf('Phone')).toBe('tall');
    expect(screen.getByAltText('Phone').parentElement).toHaveAttribute('data-own-size', 'true');
    expect(screen.getByAltText('Wide').parentElement).toHaveAttribute('data-own-size', 'false');
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
