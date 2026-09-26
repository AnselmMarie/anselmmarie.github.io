import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PortfolioItemDescription from './portfolio-item-description.js';

describe('PortfolioItemDescription', () => {
  it('renders the body as markup, not as escaped text', () => {
    render(<PortfolioItemDescription html="<p>Body</p><ul><li>React</li></ul>" />);

    expect(screen.getByTestId('portfolio-item-description').querySelector('li')).toHaveTextContent(
      'React'
    );
  });

  it('sits under its own Details eyebrow, since the design draws no slot for it (D78)', () => {
    render(<PortfolioItemDescription html="<p>Body</p>" />);

    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('sanitizes what it is given rather than trusting the caller', () => {
    // D69 — the component outlives the fixture. When `description` becomes
    // editor-supplied, this component must already be the boundary.
    render(<PortfolioItemDescription html='<p>Safe</p><img src="x"><script>bad()</script>' />);

    const body = screen.getByTestId('portfolio-item-description');

    expect(body).toHaveTextContent('Safe');
    expect(body.querySelector('img')).toBeNull();
    expect(body.querySelector('script')).toBeNull();
  });

  it('gives an external link its rel, which the ported copy omits', () => {
    render(
      <PortfolioItemDescription html='<p><a href="https://x.test" target="_blank">Go</a></p>' />
    );

    expect(screen.getByRole('link', { name: 'Go' })).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
