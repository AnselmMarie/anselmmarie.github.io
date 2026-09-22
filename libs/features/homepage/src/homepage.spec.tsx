import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HOMEPAGE_CONTENT, SITE_SECTIONS } from '@portfolio/shared-fixtures';
import type { PortfolioItem } from '@portfolio/shared-types';

import Homepage from './homepage.js';
import { makePortfolioItem } from './portfolio-item.test-helpers.js';

const TEST_ITEMS: readonly PortfolioItem[] = [
  makePortfolioItem('pokemon-pet-shop', 'Pokémon Pet Shop'),
  makePortfolioItem('cosmikata', 'Cosmikata'),
  makePortfolioItem('cr-caterpillar', 'Caterpillar Inc. News App'),
  makePortfolioItem('unlisted-elsewhere', 'Not On The Homepage'),
];

describe('Homepage', () => {
  it('identifies itself as the remote, not the shell-owned fallback', () => {
    render(<Homepage />);

    expect(screen.getByTestId('homepage-remote')).toBeInTheDocument();
    expect(screen.queryByTestId('mfe-fallback-homepage')).not.toBeInTheDocument();
  });

  it('carries an element with the id for every section the Header links to', () => {
    // ⚠️ D43's contract, asserted from the homepage's side. The Header builds
    // `href="#<id>"` from the same fixture and the shell's `useHashReapply`
    // calls `getElementById` on it — three independently deployed units, and
    // this is the only place the agreement is checkable at all.
    const { container } = render(<Homepage />);

    for (const section of SITE_SECTIONS) {
      expect(container.querySelector(`#${section.id}`)).not.toBeNull();
    }
  });

  it('renders the hero copy it is given, through the hero section', () => {
    // spec-through-the-parent: `hero` is a prop Homepage supplies to
    // HomepageHero, so it is only wired if the value arrives via Homepage.
    render(<Homepage />);

    expect(screen.getByText(HOMEPAGE_CONTENT.hero.name)).toBeInTheDocument();
    expect(screen.getByText(HOMEPAGE_CONTENT.hero.headline)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/anselm-marie/'
    );
  });

  it('renders every skill it is given, through the skills section', () => {
    render(<Homepage />);

    expect(screen.getByRole('heading', { name: 'Developer', level: 4 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'UI/UX', level: 4 })).toBeInTheDocument();
    expect(screen.getByText('Module Federation')).toBeInTheDocument();
    expect(screen.getByText('Figma')).toBeInTheDocument();
  });

  it('lists each project under the section whose group names its slug', () => {
    const { container } = render(<Homepage items={TEST_ITEMS} />);

    const active = container.querySelector('#active-projects') as HTMLElement;
    const other = container.querySelector('#other-projects') as HTMLElement;

    expect(within(active).getByRole('link', { name: 'Pokémon Pet Shop' })).toHaveAttribute(
      'href',
      '/portfolio/pokemon-pet-shop'
    );
    expect(within(active).getByRole('link', { name: 'Cosmikata' })).toBeInTheDocument();
    expect(
      within(other).getByRole('link', { name: 'Caterpillar Inc. News App' })
    ).toBeInTheDocument();
    expect(within(active).queryByRole('link', { name: 'Caterpillar Inc. News App' })).toBeNull();
  });

  it('does not render an item that neither project group names', () => {
    render(<Homepage items={TEST_ITEMS} />);

    expect(screen.queryByRole('link', { name: 'Not On The Homepage' })).toBeNull();
  });

  it('lists the live fixture items now that Slice 7 has filled it', () => {
    // ⚠️ **This asserted the opposite until the wave was integrated**, and the
    // change is the point rather than a repair. Slice 6 and Slice 7 ran
    // concurrently; while they did, `portfolio-items.fixture.ts` was Slice 7's
    // empty array, so *both* listings correctly rendered the empty state and
    // this spec pinned that. Slice 7 then ported the eight items (D71) and the
    // spec went red — which is exactly what a spec encoding a temporary state
    // should do when the state ends, rather than passing quietly forever.
    render(<Homepage />);

    expect(screen.queryByText('No projects to show yet.')).toBeNull();
    expect(screen.getByRole('link', { name: 'Pokémon Pet Shop' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Caterpillar Inc. News App' })).toBeInTheDocument();
  });

  it('takes its content as a prop, so the shell can supply it later', () => {
    // D15 — the homepage never fetches. The prop is the seam the Contentful
    // plan swaps; the fixture default is only so the remote runs standalone.
    render(
      <Homepage
        content={{
          sections: [{ id: 'skills', label: 'Only Section' }],
          hero: { name: 'Someone Else', headline: 'A different headline', links: [] },
          skillGroups: [
            { id: 'only', cardId: 'only-card', heading: 'Only Group', skills: ['Only Skill'] },
          ],
          projectGroups: [],
        }}
      />
    );

    expect(screen.getByText('Someone Else')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Only Group', level: 4 })).toBeInTheDocument();
    expect(screen.queryByText('Anselm Marie')).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Active Projects' })).toBeNull();
  });
});
