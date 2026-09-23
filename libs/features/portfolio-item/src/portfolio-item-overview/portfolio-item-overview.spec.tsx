import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PortfolioItemOverview from './portfolio-item-overview.js';

const PROPS = {
  tech: ['React', 'TypeScript'],
  facts: [{ key: 'Timeline', value: '6 weeks' }],
  lede: 'A full e-commerce experience.',
  body: ['First paragraph.', 'Second paragraph.'],
  description: '<p>Ported body.</p>',
};

describe('PortfolioItemOverview', () => {
  it('forwards the tech to the chip list', () => {
    render(<PortfolioItemOverview {...PROPS} />);

    const items = screen.getAllByRole('listitem').map((item) => item.textContent);

    expect(items).toEqual(['React', 'TypeScript']);
  });

  it('forwards the facts as term / definition pairs', () => {
    render(<PortfolioItemOverview {...PROPS} />);

    const facts = screen.getByTestId('portfolio-item-facts');

    expect(within(facts).getByRole('term')).toHaveTextContent('Timeline');
    expect(within(facts).getByRole('definition')).toHaveTextContent('6 weeks');
  });

  it('forwards the lede and every body paragraph to the summary', () => {
    render(<PortfolioItemOverview {...PROPS} />);

    const summary = screen.getByTestId('portfolio-item-summary');

    expect(summary).toHaveTextContent('A full e-commerce experience.');
    expect(summary).toHaveTextContent('First paragraph.');
    expect(summary).toHaveTextContent('Second paragraph.');
  });

  it('forwards the HTML description to the sanitizing block (D78)', () => {
    render(<PortfolioItemOverview {...PROPS} />);

    expect(screen.getByTestId('portfolio-item-description')).toHaveTextContent('Ported body.');
  });

  it('draws no fact table for an item with no facts', () => {
    render(<PortfolioItemOverview {...PROPS} facts={[]} />);

    expect(screen.queryByTestId('portfolio-item-facts')).toBeNull();
  });
});
