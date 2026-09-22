import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Header from './header.js';
import { HEADER_SECTIONS } from './header-sections.const.js';

describe('Header', () => {
  it('renders a link for every section', () => {
    render(<Header pathname="/" />);

    for (const section of HEADER_SECTIONS) {
      expect(screen.getByRole('link', { name: section.label })).toBeInTheDocument();
    }
  });

  /**
   * spec-through-the-parent.md — `pathname` is a prop Header forwards to
   * HeaderNav, which forwards it again to each HeaderNavLink. Asserting it on
   * HeaderNavLink alone would pass with either forwarding line deleted,
   * because the spec would be playing the part of the parent.
   */
  it('forwards its pathname down two levels to the links', () => {
    render(<Header pathname="/portfolio/pokemon-pet-shop" />);

    expect(screen.getByRole('link', { name: 'Skills' })).toHaveAttribute('href', '/#skills');
    expect(screen.getByRole('link', { name: 'Active Projects' })).toHaveAttribute(
      'href',
      '/#active-projects'
    );
  });

  it('falls back to the browser path when given none', () => {
    // The remote renders client-side only (D36), so `window` is always there
    // in practice. jsdom's default location is `/`.
    render(<Header />);

    expect(screen.getByRole('link', { name: 'Skills' })).toHaveAttribute('href', '#skills');
  });

  it('links the site name back to the homepage', () => {
    render(<Header pathname="/portfolio/cosmikata" />);

    expect(screen.getByRole('link', { name: 'Anselm Marie' })).toHaveAttribute('href', '/');
  });
});
