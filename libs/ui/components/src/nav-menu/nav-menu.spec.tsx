import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import NavMenu from './nav-menu.js';

const ITEMS = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '/#contact', label: 'Contact' },
] as const;

describe('NavMenu', () => {
  it('renders a navigation landmark named by `label`', () => {
    render(<NavMenu label="Sections" items={ITEMS} />);

    expect(screen.getByRole('navigation', { name: 'Sections' })).toBeInTheDocument();
  });

  it('renders one plain anchor per item, in order, with its href untouched', () => {
    render(<NavMenu label="Sections" items={ITEMS} />);

    const links = screen.getAllByRole('link');

    expect(links.map((link) => link.textContent)).toEqual(['Work', 'About', 'Contact']);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '#work',
      '#about',
      '/#contact',
    ]);
  });

  it('puts the links in a list, one item each', () => {
    render(<NavMenu label="Sections" items={ITEMS} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(ITEMS.length);
  });

  it('moves focus to the next link on ArrowRight', async () => {
    render(<NavMenu label="Sections" items={ITEMS} />);

    const work = screen.getByRole('link', { name: 'Work' });
    const about = screen.getByRole('link', { name: 'About' });
    work.focus();
    fireEvent.keyDown(work, { key: 'ArrowRight' });

    // Focus may move after the event handler returns, so wait for it.
    await waitFor(() => expect(about).toHaveFocus());
  });

  it('mounts no dropdown popup — the nav has no triggers', () => {
    render(<NavMenu label="Sections" items={ITEMS} />);

    expect(document.body.querySelector('[data-slot="navigation-menu-content"]')).toBeNull();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
