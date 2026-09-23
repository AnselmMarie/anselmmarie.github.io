import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PortfolioItemHero from './portfolio-item-hero.js';

describe('PortfolioItemHero', () => {
  it('carries the lede and role as type, with no photograph (D85)', () => {
    render(<PortfolioItemHero title="Cosmikata" jobRole="Founder" lede="A studio identity." />);

    const hero = screen.getByTestId('portfolio-item-hero');

    expect(hero).toHaveTextContent('A studio identity.');
    expect(hero).toHaveTextContent('Founder');
    expect(hero.querySelector('img')).toBeNull(); // no image passed
  });

  it('holds the page heading, without the decorative full stop', () => {
    render(<PortfolioItemHero title="Cosmikata" jobRole="Founder" lede="A studio identity." />);

    expect(screen.getByRole('heading', { level: 1, name: 'Cosmikata' })).toBeInTheDocument();
  });

  it('washes the first image in behind the type, hidden from assistive tech', () => {
    render(
      <PortfolioItemHero
        title="X"
        jobRole="R"
        lede="L"
        image={{ src: '/images/portfolio/a/one.jpg', alt: 'One', width: '10', height: '10' }}
      />
    );

    const image = screen.getByTestId('portfolio-item-hero').querySelector('img');

    expect(image).toHaveAttribute('src', '/images/portfolio/a/one.jpg');
    expect(image).toHaveAttribute('alt', '');
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('paints the Work-card colour it is given', () => {
    render(<PortfolioItemHero title="X" jobRole="R" lede="L" background="#BFE6D2" />);

    expect(screen.getByTestId('portfolio-item-hero').style.backgroundColor).toBe(
      'rgb(191, 230, 210)'
    );
  });

  it('falls back to the default fill for an item with no card', () => {
    render(<PortfolioItemHero title="X" jobRole="R" lede="L" />);

    expect(screen.getByTestId('portfolio-item-hero').style.backgroundColor).toBe('');
  });

  it('draws no role chip when the item has no role yet', () => {
    render(<PortfolioItemHero title="X" jobRole="" lede="L" />);

    expect(screen.getByTestId('portfolio-item-hero')).toHaveTextContent(/^X\.L$/);
  });
});
