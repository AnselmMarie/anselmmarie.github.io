import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import MenuSheet from './menu-sheet.js';

const ITEMS = [
  { href: '#work', label: 'Work' },
  { href: '/#contact', label: 'Contact' },
] as const;

const TRIGGER = <button type="button">Open</button>;

describe('MenuSheet', () => {
  it('renders nothing while closed', () => {
    render(
      <MenuSheet
        trigger={TRIGGER}
        title="Menu"
        items={ITEMS}
        isOpen={false}
        onOpenChange={vi.fn()}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders the trigger in place, and asks to open when it is pressed', () => {
    const onOpenChange = vi.fn();
    render(
      <MenuSheet
        trigger={TRIGGER}
        title="Menu"
        items={ITEMS}
        isOpen={false}
        onOpenChange={onOpenChange}
      />
    );

    const trigger = screen.getByRole('button', { name: 'Open' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('leaves the trigger in the accessibility tree while open — non-modal', () => {
    render(
      <MenuSheet trigger={TRIGGER} title="Menu" items={ITEMS} isOpen onOpenChange={vi.fn()} />
    );

    expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders an open sheet as a dialog named by title, with one link per item', () => {
    render(
      <MenuSheet trigger={TRIGGER} title="Menu" items={ITEMS} isOpen onOpenChange={vi.fn()} />
    );

    const dialog = screen.getByRole('dialog', { name: 'Menu' });
    const links = screen.getAllByRole('link');

    expect(dialog).toBeInTheDocument();
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['#work', '/#contact']);
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
  });

  it('puts id on the dialog, for the toggle to point aria-controls at', () => {
    render(
      <MenuSheet
        id="header-menu"
        trigger={TRIGGER}
        title="Menu"
        items={ITEMS}
        isOpen
        onOpenChange={vi.fn()}
      />
    );

    expect(screen.getByRole('dialog', { name: 'Menu' })).toHaveAttribute('id', 'header-menu');
  });

  it('keeps the entries as links, not buttons', () => {
    render(
      <MenuSheet trigger={TRIGGER} title="Menu" items={ITEMS} isOpen onOpenChange={vi.fn()} />
    );

    expect(screen.queryByRole('button', { name: 'Work' })).not.toBeInTheDocument();
  });

  it('has no generated close button — the header toggle owns closing', () => {
    render(
      <MenuSheet trigger={TRIGGER} title="Menu" items={ITEMS} isOpen onOpenChange={vi.fn()} />
    );

    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('asks to close when a link is tapped', () => {
    const onOpenChange = vi.fn();
    render(
      <MenuSheet trigger={TRIGGER} title="Menu" items={ITEMS} isOpen onOpenChange={onOpenChange} />
    );

    fireEvent.click(screen.getByRole('link', { name: 'Work' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('asks to close on Escape', () => {
    const onOpenChange = vi.fn();
    render(
      <MenuSheet trigger={TRIGGER} title="Menu" items={ITEMS} isOpen onOpenChange={onOpenChange} />
    );

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
