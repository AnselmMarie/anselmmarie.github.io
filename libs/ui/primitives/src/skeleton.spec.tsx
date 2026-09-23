import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Skeleton } from './skeleton.js';

describe('Skeleton', () => {
  it('marks itself with the shadcn slot so wrappers and styles can target it', () => {
    render(<Skeleton data-testid="bone" />);

    expect(screen.getByTestId('bone')).toHaveAttribute('data-slot', 'skeleton');
  });

  it('forwards arbitrary div props to the rendered element', () => {
    render(<Skeleton data-testid="bone" aria-label="loading" />);

    expect(screen.getByTestId('bone')).toHaveAttribute('aria-label', 'loading');
  });
});
