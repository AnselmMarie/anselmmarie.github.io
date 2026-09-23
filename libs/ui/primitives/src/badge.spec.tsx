import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from './badge.js';

describe('Badge', () => {
  it('renders a span by default', () => {
    render(<Badge>Live</Badge>);

    expect(screen.getByText('Live').tagName).toBe('SPAN');
  });

  it('renders the element passed as render, keeping its children', () => {
    render(
      <ul>
        <Badge render={<li />}>React</Badge>
      </ul>
    );

    expect(screen.getByRole('listitem')).toHaveTextContent('React');
  });

  it('forwards extra attributes', () => {
    render(<Badge data-testid="chip">Featured</Badge>);

    expect(screen.getByTestId('chip')).toHaveTextContent('Featured');
  });
});
