import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PanelCard from './panel-card.js';

/*
 * ⚠️ No class assertions here, per testing-conventions.md. The `cn` merge this
 * component depends on (D56) is covered where it lives, in
 * `libs/shared/utils/src/cn.spec.ts` — asserting it again through every
 * wrapper would test the helper five times and the wrapper zero.
 */
describe('PanelCard', () => {
  it('renders its children', () => {
    render(
      <PanelCard>
        <p>AT&amp;T Service Excellence Award</p>
      </PanelCard>
    );

    expect(screen.getByText('AT&T Service Excellence Award')).toBeInTheDocument();
  });

  it('renders a single wrapping element around the content', () => {
    const { container } = render(
      <PanelCard>
        <span>one</span>
        <span>two</span>
      </PanelCard>
    );

    expect(container.children).toHaveLength(1);
    expect(screen.getByText('one')).toBeInTheDocument();
    expect(screen.getByText('two')).toBeInTheDocument();
  });
});
