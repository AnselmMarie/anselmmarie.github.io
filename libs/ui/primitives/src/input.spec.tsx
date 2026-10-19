import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Input } from './input.js';

describe('Input', () => {
  it('renders a native text box that reports changes', () => {
    const onChange = vi.fn();
    render(<Input aria-label="Message" onChange={onChange} />);

    fireEvent.change(screen.getByRole('textbox', { name: 'Message' }), {
      target: { value: 'hi' },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('marks itself with the input slot', () => {
    render(<Input aria-label="Message" />);

    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveAttribute('data-slot', 'input');
  });

  it('forwards native attributes such as maxLength', () => {
    render(<Input aria-label="Message" maxLength={500} />);

    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveAttribute('maxlength', '500');
  });
});
