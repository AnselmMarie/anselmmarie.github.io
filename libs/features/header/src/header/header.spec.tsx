import { fireEvent, render, screen, within } from '@testing-library/react';
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
   * HeaderNav, which turns it into each NavMenu item's href. Asserting it on
   * HeaderNav alone would pass with Header's forwarding line deleted,
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

describe('Header — the mobile menu sheet', () => {
  const menu = () => screen.queryByRole('dialog', { name: 'Menu' });

  it('is not in the document until the toggle is pressed', () => {
    // Unmounted rather than `display:none` (the export's choice), so five
    // links do not sit in every page's tab order at every width.
    render(<Header pathname="/" />);

    expect(menu()).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('opens on the toggle and announces that it did', () => {
    render(<Header pathname="/" />);

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(menu()).toHaveAttribute('id', 'header-menu');
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-controls',
      'header-menu'
    );
  });

  it('closes again from the same toggle, which stays reachable while open', () => {
    // ⚠️ The sheet is non-modal so this button is not hidden from assistive
    // tech while the sheet is open, and it is the sheet's registered trigger
    // so this press is not also read as an outside press (close, re-open).
    render(<Header pathname="/" />);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }));

    expect(menu()).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it("forwards the pathname into the sheet's anchors", () => {
    // spec-through-the-parent.md again: Header builds the sheet's hrefs from
    // its pathname, and the anchors are a different set of elements from the
    // desktop nav's.
    render(<Header pathname="/portfolio/cosmikata" />);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    const sheet = menu() as HTMLElement;

    expect(within(sheet).getByRole('link', { name: 'Contact' })).toHaveAttribute(
      'href',
      '/#contact'
    );
  });

  it('closes when a link inside it is chosen', () => {
    render(<Header pathname="/" />);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    fireEvent.click(within(menu() as HTMLElement).getAllByRole('link')[0] as HTMLElement);

    expect(menu()).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
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
