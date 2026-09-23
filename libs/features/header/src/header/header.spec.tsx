import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SITE_SECTIONS } from '@portfolio/shared-fixtures';

import Header from './header.js';

describe('Header — the home variant', () => {
  it('renders a link for every section', () => {
    render(<Header pathname="/" />);

    for (const section of SITE_SECTIONS) {
      // Two render once the overlay is open, so scope to the desktop nav.
      const nav = screen.getByRole('navigation', { name: 'Sections' });

      expect(nav).toContainElement(screen.getByRole('link', { name: section.label }));
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
    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '/#work');
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

describe('Header — the mobile overlay', () => {
  it('is not in the document until the toggle is pressed', () => {
    // Unmounted rather than `display:none` (the export's choice), so five
    // links do not sit in every page's tab order at every width.
    render(<Header pathname="/" />);

    expect(screen.queryByTestId('header-menu-overlay')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('opens on the toggle and announces that it did', () => {
    render(<Header pathname="/" />);

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(screen.getByTestId('header-menu-overlay')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it("forwards the pathname into the overlay's anchors", () => {
    // spec-through-the-parent.md again: the overlay builds its own hrefs from
    // a pathname Header hands it, and the anchors are a different set of
    // elements from the desktop nav's.
    render(<Header pathname="/portfolio/cosmikata" />);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    const overlay = screen.getByTestId('header-menu-overlay');
    const contact = [...overlay.querySelectorAll('a')].find((a) => a.textContent === 'Contact');

    expect(contact).toHaveAttribute('href', '/#contact');
  });

  it('closes when a link inside it is chosen', () => {
    render(<Header pathname="/" />);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    const overlay = screen.getByTestId('header-menu-overlay');

    fireEvent.click([...overlay.querySelectorAll('a')][0] as HTMLElement);

    expect(screen.queryByTestId('header-menu-overlay')).not.toBeInTheDocument();
  });
});

describe('Header — the detail variant', () => {
  it('draws no section anchors at all', () => {
    // ⚠️ The two exports disagree and both are right: these anchors point at
    // homepage sections that do not exist on a detail page, so a five-link
    // nav here would scroll nowhere and throw nothing.
    render(<Header variant="detail" pathname="/portfolio/cosmikata" />);

    expect(screen.queryByRole('navigation', { name: 'Sections' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Skills' })).not.toBeInTheDocument();
  });

  it('offers the brand and a way back to the work grid', () => {
    render(<Header variant="detail" pathname="/portfolio/cosmikata" />);

    expect(screen.getByRole('link', { name: 'Anselm Marie' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'All work' })).toHaveAttribute('href', '/#work');
  });

  it('has no menu toggle to open', () => {
    render(<Header variant="detail" pathname="/portfolio/cosmikata" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
