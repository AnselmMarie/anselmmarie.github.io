import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import HeaderMenuToggle from './header-menu-toggle.js';

describe('HeaderMenuToggle', () => {
  it('names itself by the state it would change', () => {
    const { rerender } = render(<HeaderMenuToggle isOpen={false} />);

    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();

    rerender(<HeaderMenuToggle isOpen />);

    expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
  });

  it('passes the trigger props it is given through to the button', () => {
    // MenuSheet renders this as its trigger; Base UI's handler and ARIA arrive
    // as rest props and do nothing unless they reach the <button>.
    const onClick = vi.fn();
    render(
      <HeaderMenuToggle
        isOpen={false}
        aria-expanded={false}
        aria-controls="menu"
        onClick={onClick}
      />
    );

    const button = screen.getByRole('button', { name: 'Open menu' });
    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-controls', 'menu');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is a plain button, never a submit', () => {
    render(<HeaderMenuToggle isOpen={false} />);

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('type', 'button');
  });
});
