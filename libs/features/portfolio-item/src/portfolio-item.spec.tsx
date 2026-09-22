import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PortfolioItem from './portfolio-item.js';

describe('PortfolioItem', () => {
  it('identifies itself as the remote, not the shell-owned fallback', () => {
    render(<PortfolioItem />);

    expect(screen.getByTestId('portfolio-item-remote')).toBeInTheDocument();
    expect(screen.queryByTestId('mfe-fallback-portfolio-item')).not.toBeInTheDocument();
  });

  it('renders the item the shell resolved, rather than resolving one itself', () => {
    // D4 — routing belongs to the shell. This component receives the item and
    // never reads route params, which is what lets it render identically
    // standalone on 4177 and inside the shell at /portfolio/$slug.
    render(<PortfolioItem item={{ slug: 'cosmikata', title: 'Cosmikata' }} />);

    expect(screen.getByRole('heading', { name: 'Cosmikata' })).toBeInTheDocument();
    expect(screen.getByTestId('portfolio-item-remote')).toHaveTextContent('cosmikata');
  });

  it('says out loud that it is a placeholder', () => {
    // ⚠️ Expected to be DELETED by Slice 7 — it fails the moment the real item
    // page lands, so the placeholder cannot ship unnoticed.
    render(<PortfolioItem />);

    expect(screen.getByTestId('portfolio-item-remote')).toHaveTextContent('Slice 7 fills this');
  });
});
