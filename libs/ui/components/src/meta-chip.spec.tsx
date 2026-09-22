import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import MetaChip from './meta-chip.js';

describe('MetaChip', () => {
  it('renders its children', () => {
    render(<MetaChip>Live</MetaChip>);

    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  it('omits the status dot by default', () => {
    const { container } = render(<MetaChip>Featured</MetaChip>);

    expect(container.querySelector('[aria-hidden]')).toBeNull();
  });

  it('draws a status dot that assistive tech ignores, so the label reads once', () => {
    const { container } = render(<MetaChip hasDot>Live</MetaChip>);

    const dot = container.querySelector('[aria-hidden]');

    expect(dot).not.toBeNull();
    expect(dot).toHaveTextContent('');
  });
});
