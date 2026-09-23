import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PortfolioItemTechChips from './portfolio-item-tech-chips.js';

describe('PortfolioItemTechChips', () => {
  it('lists each technology under its eyebrow', () => {
    render(<PortfolioItemTechChips tech={['Angular', 'RxJS', 'Accessibility']} />);

    expect(screen.getByText('Technologies')).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });
});
