import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { ItemAiEnhancement } from '@portfolio/shared-types';

import PortfolioItemAiEnhancements from './portfolio-item-ai-enhancements.js';

const ENHANCEMENTS: readonly ItemAiEnhancement[] = [
  {
    title: 'Event agent',
    problem: 'Events were typed by hand.',
    built: 'An agent that files them for review.',
    result: 'A twentieth of the cost.',
    status: 'shipped',
  },
  {
    title: 'Content assist',
    problem: 'Tasks take long to enter.',
    built: 'Drafts from references.',
    result: 'Not measured yet.',
    status: 'planned',
  },
];

describe('PortfolioItemAiEnhancements', () => {
  it('heads the block as its own section', () => {
    render(<PortfolioItemAiEnhancements aiEnhancements={ENHANCEMENTS} />);

    expect(screen.getByText('AI Enhancements')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Where AI pulls its weight.' })).toBeInTheDocument();
  });

  it('renders each enhancement with its title and status', () => {
    render(<PortfolioItemAiEnhancements aiEnhancements={ENHANCEMENTS} />);

    const items = screen.getAllByRole('listitem');

    expect(items).toHaveLength(2);
    expect(
      within(items[0] as HTMLElement).getByRole('heading', { name: 'Event agent' })
    ).toBeInTheDocument();
    expect(items[0]).toHaveTextContent('Shipped');
    expect(items[1]).toHaveTextContent('Planned');
    expect(items[1]).not.toHaveTextContent('Shipped');
  });

  it('labels the problem, what was built and the result on each card', () => {
    render(<PortfolioItemAiEnhancements aiEnhancements={ENHANCEMENTS} />);

    const card = within(screen.getAllByRole('listitem')[0] as HTMLElement);
    const terms = card.getAllByRole('term').map((term) => term.textContent);
    const values = card.getAllByRole('definition').map((value) => value.textContent);

    expect(terms).toEqual(['Problem', 'Built', 'Result']);
    expect(values).toEqual([
      'Events were typed by hand.',
      'An agent that files them for review.',
      'A twentieth of the cost.',
    ]);
  });

  it('renders nothing for an item with an empty list', () => {
    const { container } = render(<PortfolioItemAiEnhancements aiEnhancements={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing for an item with no list at all', () => {
    const { container } = render(<PortfolioItemAiEnhancements />);

    expect(container).toBeEmptyDOMElement();
  });
});
