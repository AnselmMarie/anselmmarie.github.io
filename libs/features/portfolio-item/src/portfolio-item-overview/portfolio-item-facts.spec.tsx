import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PortfolioItemFacts from './portfolio-item-facts.js';

describe('PortfolioItemFacts', () => {
  it('renders each fact as a term with its value, in order', () => {
    render(
      <PortfolioItemFacts
        facts={[
          { key: 'Timeline', value: '9 months' },
          { key: 'Role', value: 'Tech lead' },
        ]}
      />
    );

    expect(screen.getAllByRole('term').map((term) => term.textContent)).toEqual([
      'Timeline',
      'Role',
    ]);
    expect(screen.getAllByRole('definition').map((value) => value.textContent)).toEqual([
      '9 months',
      'Tech lead',
    ]);
  });

  it('renders nothing when there are no facts', () => {
    const { container } = render(<PortfolioItemFacts facts={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
