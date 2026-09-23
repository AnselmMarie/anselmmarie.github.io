import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from './sheet.js';

const renderSheet = (showCloseButton?: boolean, onOpenChange = vi.fn()) =>
  render(
    <Sheet open onOpenChange={onOpenChange}>
      <SheetContent side="top" showCloseButton={showCloseButton}>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Jump to a section</SheetDescription>
        </SheetHeader>
        <SheetFooter>footer</SheetFooter>
      </SheetContent>
    </Sheet>
  );

describe('Sheet', () => {
  it('renders an open sheet as a dialog named by its title', () => {
    renderSheet();

    const dialog = screen.getByRole('dialog', { name: 'Menu' });

    expect(dialog).toHaveAttribute('data-side', 'top');
    expect(dialog).toHaveTextContent('Jump to a section');
  });

  it('asks to close from its built-in close button', () => {
    const onOpenChange = vi.fn();
    renderSheet(true, onOpenChange);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it('omits the close button when showCloseButton is false', () => {
    renderSheet(false);

    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('renders nothing while closed', () => {
    render(
      <Sheet open={false}>
        <SheetContent>
          <SheetTitle>Menu</SheetTitle>
        </SheetContent>
      </Sheet>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
