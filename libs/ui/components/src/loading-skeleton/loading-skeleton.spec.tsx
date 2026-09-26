import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import LoadingSkeleton from './loading-skeleton.js';

describe('LoadingSkeleton', () => {
  it('renders the shadcn skeleton primitive', () => {
    const { container } = render(<LoadingSkeleton />);

    expect(container.querySelector('[data-slot="skeleton"]')).not.toBeNull();
  });

  it('hides itself from assistive tech on either surface', () => {
    const { container } = render(
      <>
        <LoadingSkeleton />
        <LoadingSkeleton tone="ink" />
      </>
    );

    const bones = container.querySelectorAll('[data-slot="skeleton"]');

    expect(bones).toHaveLength(2);
    bones.forEach((bone) => {
      expect(bone).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
