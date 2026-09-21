import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Card from './card.js';

describe('Card', () => {
  it('renders its children', () => {
    render(<Card>panel content</Card>);

    expect(screen.getByText('panel content')).toBeInTheDocument();
  });

  it('forwards arbitrary div props, such as a data-testid, to the rendered element', () => {
    render(<Card data-testid="my-card">content</Card>);

    expect(screen.getByTestId('my-card')).toBeInTheDocument();
  });
});
