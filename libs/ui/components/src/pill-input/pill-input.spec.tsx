import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import PillInput from './pill-input.js';

describe('PillInput', () => {
  it('shows the value it is given, named by its label', () => {
    render(<PillInput value="hello" label="Message" onValueChange={vi.fn()} />);

    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue('hello');
  });

  it('reports the new text, not the event', () => {
    const onValueChange = vi.fn();
    render(<PillInput value="" label="Message" onValueChange={onValueChange} />);

    fireEvent.change(screen.getByRole('textbox', { name: 'Message' }), {
      target: { value: 'hi' },
    });

    expect(onValueChange).toHaveBeenCalledWith('hi');
  });

  it('passes the placeholder and the length cap through', () => {
    render(
      <PillInput
        value=""
        label="Message"
        placeholder="Ask something…"
        maxLength={500}
        onValueChange={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText('Ask something…');

    expect(input).toHaveAttribute('maxlength', '500');
  });
});
