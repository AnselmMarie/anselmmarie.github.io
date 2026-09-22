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

  it('forwards the company and subtitle to the header, which the shell never passes twice', () => {
    // spec-through-the-parent: the header reads three props and this is the
    // only call site that supplies them.
    render(<PortfolioItem item={itemOrThrow('rove-logix-ui-update')} />);

    const header = screen.getByTestId('portfolio-item-header');

    expect(header).toHaveTextContent('Rove Logix');
    expect(header).toHaveTextContent('New App Skin');
    expect(header).toHaveTextContent('Design');
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
    expect(screen.getByTitle('CosMikata Video 1')).toBeInTheDocument();
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
