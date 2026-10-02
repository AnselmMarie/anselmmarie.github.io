import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import IconButton, { type IconButtonSize, type IconButtonTone } from './icon-button.js';

const TONES: readonly IconButtonTone[] = ['ink', 'ink-accent', 'ghost'];
const SIZES: readonly IconButtonSize[] = [36, 44, 56];

describe('IconButton', () => {
  it('uses its label as the accessible name', () => {
    render(<IconButton icon="send" label="Send" />);

    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });

  it('keeps the icon out of the accessible name', () => {
    const { container } = render(<IconButton icon="x" label="Close chat" />);

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('button')).toHaveAccessibleName('Close chat');
  });

  it.each(TONES)('renders the %s tone', (tone) => {
    render(<IconButton icon="message-circle" label="Open" tone={tone} />);

    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
  });

  it.each(SIZES)('draws its mark at the edge the %ipx size calls for', (size) => {
    const { container } = render(<IconButton icon="send" label="Send" size={size} />);
    const expected = size === 56 ? '26' : '18';

    expect(container.querySelector('svg')).toHaveAttribute('width', expected);
  });

  it('is a plain button unless asked to submit', () => {
    render(<IconButton icon="send" label="Send" />);

    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'button');
  });

  it('submits its form when typed as submit', () => {
    const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <IconButton icon="send" label="Send" type="submit" />
      </form>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('fires onClick when pressed', () => {
    const onClick = vi.fn();
    render(<IconButton icon="x" label="Close" onClick={onClick} />);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
