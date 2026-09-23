import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { portfolioItemBySlug } from '@portfolio/shared-fixtures';
import type { PortfolioItem as PortfolioItemModel } from '@portfolio/shared-types';

import PortfolioItem, { PREVIEW_SLUG } from './portfolio-item.js';

const itemOrThrow = (slug: string): PortfolioItemModel => {
  const item = portfolioItemBySlug(slug);

  if (!item) {
    throw new Error(`fixture is missing ${slug}`);
  }

  return item;
};

describe('PortfolioItem', () => {
  it('identifies itself as the remote, not the shell-owned fallback', () => {
    render(<PortfolioItem item={itemOrThrow('cosmikata')} />);

    expect(screen.getByTestId('portfolio-item-remote')).toBeInTheDocument();
    expect(screen.queryByTestId('mfe-fallback-portfolio-item')).not.toBeInTheDocument();
  });

  it('renders the item the shell resolved, rather than resolving one itself', () => {
    // D4 — routing belongs to the shell. This component receives the item and
    // never reads route params.
    render(<PortfolioItem item={itemOrThrow('cr-caterpillar')} />);

    expect(screen.getByRole('heading', { name: 'Caterpillar Inc. News App' })).toBeInTheDocument();
    expect(screen.getByText('Corporate Reports')).toBeInTheDocument();
  });

  it('forwards company, year and role to the meta row, which the shell never passes twice', () => {
    // spec-through-the-parent: the header reads these and this is the only
    // call site that supplies them.
    render(<PortfolioItem item={itemOrThrow('cw-breeze-thru')} />);

    const row = screen.getByTestId('portfolio-item-meta-row');

    expect(row).toHaveTextContent('Cricket Wireless');
    expect(row).toHaveTextContent('2018');
    expect(row).toHaveTextContent('Senior Engineer, Tech Lead');
  });

  it('forwards the links to the header', () => {
    render(<PortfolioItem item={itemOrThrow('csp-generator-app')} />);

    expect(screen.getByRole('link', { name: 'Live tool' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Source' })).toBeInTheDocument();
  });

  it('paints the hero with the item’s Work-card colour, looked up by slug (D85)', () => {
    render(<PortfolioItem item={itemOrThrow('cosmikata')} />);

    const hero = screen.getByTestId('portfolio-item-hero');

    expect(hero.style.backgroundColor).toBe('rgb(191, 230, 210)');
    expect(hero).toHaveTextContent(itemOrThrow('cosmikata').lede);
  });

  it('forwards the first gallery image to the hero, where the page title now lives', () => {
    const item = itemOrThrow('cw-breeze-thru');

    render(<PortfolioItem item={item} />);

    const hero = screen.getByTestId('portfolio-item-hero');

    expect(hero.querySelector('img')).toHaveAttribute('src', item.images[0]?.src);
    expect(hero.querySelector('h1')).toHaveTextContent(item.title);
  });

  it('leaves the hero on its default fill for an item hidden from the Work grid', () => {
    render(<PortfolioItem item={itemOrThrow('rove-logix')} />);

    expect(screen.getByTestId('portfolio-item-hero').style.backgroundColor).toBe('');
  });

  it('forwards tech, facts and body to the overview', () => {
    const item = itemOrThrow('pokemon-pet-shop');

    render(<PortfolioItem item={item} />);

    const overview = screen.getByTestId('portfolio-item-overview');

    expect(overview).toHaveTextContent('React Query');
    expect(overview).toHaveTextContent('6 weeks, nights and weekends');
    expect(overview).toHaveTextContent(item.body[0] ?? '');
  });

  it('forwards the description HTML to the sanitizing boundary', () => {
    render(<PortfolioItem item={itemOrThrow('csp-generator-app')} />);

    const body = screen.getByTestId('portfolio-item-description');

    expect(body).toHaveTextContent('Content Security Policy');
    expect(body.querySelector('a[target="_blank"]')?.getAttribute('rel')).toBe(
      'noopener noreferrer'
    );
  });

  it('forwards the images, with the authored src rather than one built from the slug', () => {
    render(<PortfolioItem item={itemOrThrow('cw-breeze-thru')} />);

    const images = screen.getAllByRole('img');

    expect(images).toHaveLength(4);
    expect(images[0]?.getAttribute('src')).toBe(
      '/images/portfolio/cricket-wireless/breezeThru01.jpg'
    );
  });

  it('forwards videos for the one item that has them', () => {
    render(<PortfolioItem item={itemOrThrow('older-cosmikata')} />);

    expect(screen.getByTestId('portfolio-item-videos')).toBeInTheDocument();
    expect(screen.getByTitle('Cosmikata Video 1')).toBeInTheDocument();
  });

  it('closes with the next block', () => {
    render(<PortfolioItem item={itemOrThrow('cr-caterpillar')} />);

    expect(screen.getByTestId('portfolio-item-next-block')).toBeInTheDocument();
  });

  it('renders no video section for an item with none, rather than an empty heading', () => {
    render(<PortfolioItem item={itemOrThrow('cr-caterpillar')} />);

    expect(screen.queryByTestId('portfolio-item-videos')).not.toBeInTheDocument();
  });

  it('draws the preview item when it is mounted standalone with no item', () => {
    // `nx dev portfolio-item` has no host to resolve a slug, so the remote
    // still renders. This is a dev preview, not a resolution strategy.
    render(<PortfolioItem />);

    expect(screen.getByRole('heading', { name: itemOrThrow(PREVIEW_SLUG).title })).toBeVisible();
  });
});
