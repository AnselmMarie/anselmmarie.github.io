import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { PortfolioItem } from '@portfolio/shared-types';

import HomepageProjectSection from './homepage-project-section.js';
import { makePortfolioItem } from './portfolio-item.test-helpers.js';

const GROUP = {
  sectionId: 'other-projects',
  heading: 'Other Projects',
  slugs: ['rove-logix', 'cr-caterpillar'],
};

const ITEMS: readonly PortfolioItem[] = [
  makePortfolioItem('cr-caterpillar', 'Caterpillar Inc. News App'),
  makePortfolioItem('pokemon-pet-shop', 'Pokémon Pet Shop'),
  makePortfolioItem('rove-logix', 'Company Development'),
];

describe('HomepageProjectSection', () => {
  it("forwards each item's thumbnail to its tile (D72)", () => {
    // ⚠️ **Through the parent on purpose.** The card's own spec supplies
    // `thumbnail` itself, so it plays the part of the section and would stay
    // green if this forwarding line were deleted — which is exactly how the
    // prop went unwired during the wave (spec-through-the-parent.md).
    const { container } = render(
      <HomepageProjectSection
        group={GROUP}
        items={[makePortfolioItem('rove-logix', 'Company Development')]}
      />
    );

    // Queried from the DOM rather than by role: the image is decorative
    // (`alt=""`, so `role="presentation"`) because the tile's own link text
    // already names the project. A meaningful `alt` here would have a screen
    // reader announce the same title twice.
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      '/images/portfolio/rove-logix/thumbnail.jpg'
    );
  });

  it('puts the group section id on the section element — D43 is a silent contract', () => {
    const { container } = render(<HomepageProjectSection group={GROUP} items={ITEMS} />);

    expect(container.querySelector('section#other-projects')).not.toBeNull();
  });

  it('lists the group slugs in the group order, not the item order', () => {
    render(<HomepageProjectSection group={GROUP} items={ITEMS} />);

    expect(screen.getAllByRole('link').map((el) => el.textContent)).toEqual([
      'Company Development',
      'Caterpillar Inc. News App',
    ]);
  });

  it('skips an item the group does not name', () => {
    render(<HomepageProjectSection group={GROUP} items={ITEMS} />);

    expect(screen.queryByRole('link', { name: 'Pokémon Pet Shop' })).toBeNull();
  });

  it('skips a slug with no matching item rather than rendering a dead tile', () => {
    render(<HomepageProjectSection group={GROUP} items={ITEMS.slice(0, 1)} />);

    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('renders the empty state when the fixture is still empty', () => {
    // ⚠️ The live state in Slice 6: `portfolio-items.fixture.ts` is Slice 7's
    // and holds an empty array, so both sections render this deliberately.
    render(<HomepageProjectSection group={GROUP} items={[]} />);

    expect(screen.getByText('No projects to show yet.')).toBeInTheDocument();
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('still renders its heading when it has nothing to list', () => {
    render(<HomepageProjectSection group={GROUP} items={[]} />);

    expect(screen.getByRole('heading', { name: 'Other Projects', level: 2 })).toBeInTheDocument();
  });
});
