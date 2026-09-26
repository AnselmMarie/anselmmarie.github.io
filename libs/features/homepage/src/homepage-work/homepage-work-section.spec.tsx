import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HOMEPAGE_CONTENT, PORTFOLIO_ITEMS, SECTION_IDS } from '@portfolio/shared-fixtures';

import { makePortfolioItem, required } from '../test-helpers/portfolio-item.test-helpers.js';
import HomepageWorkSection, { sortYear } from './homepage-work-section.js';

const intro = required(
  HOMEPAGE_CONTENT.sectionIntros.find((i) => i.sectionId === SECTION_IDS.work),
  'the work section intro'
);

const renderSection = () =>
  render(
    <HomepageWorkSection
      sectionId={SECTION_IDS.work}
      intro={intro}
      cards={HOMEPAGE_CONTENT.work}
      items={PORTFOLIO_ITEMS}
    />
  );

/**
 * ⚠️ **spec-through-the-parent.md — this is the file that rule asks for.**
 * `HomepageWorkCard` takes eight props and the section forwards all eight by
 * hand. Six of them (`lede`, `client`, `year`, `stack`, `background`,
 * `isLive`) came from the redesign, and a section that forwards seven of eight
 * is invisible to every card-level spec, because such a spec supplies the
 * props itself and so always remembers. That is the exact shape of the
 * 2026-09-19 hub failure the rule was written from — where a dropped
 * `inProgressTask` silently changed an arithmetic result.
 */
describe('HomepageWorkSection — what reaches the card', () => {
  it('forwards every card prop from the item and the card presentation', () => {
    renderSection();

    // Not `work[0]`: the first cards are placeholders with empty company and
    // stack fields, which would leave half of these assertions matching ''.
    const first = required(
      HOMEPAGE_CONTENT.work.find((card) => card.slug === 'cosmikata'),
      'the cosmikata work card'
    );
    const item = required(
      PORTFOLIO_ITEMS.find((i) => i.slug === first.slug),
      first.slug
    );
    // By href, not by name: `Cosmikata` is also a substring of the older
    // version's title since both cards were restored (2026-09-23).
    const card = required(
      screen.getAllByRole('link').find((a) => a.getAttribute('href') === `/portfolio/${item.slug}`),
      'the cosmikata card link'
    );

    expect(within(card).getByRole('heading', { name: item.title })).toBeInTheDocument();
    expect(within(card).getByText(item.lede)).toBeInTheDocument();
    expect(within(card).getByText(item.company)).toBeInTheDocument();
    expect(within(card).getByText(new RegExp(item.year, 'u'))).toBeInTheDocument();
    expect(within(card).getByText(item.tech.slice(0, 3).join(' · '))).toBeInTheDocument();
    expect(card).toHaveStyle({ backgroundColor: first.background });
  });

  it('draws the Live chip only on the cards marked live', () => {
    // No real card is live since 2026-09-23, so the spec supplies its own.
    render(
      <HomepageWorkSection
        sectionId={SECTION_IDS.work}
        intro={intro}
        cards={[
          { slug: 'cosmikata', background: '#BFE6D2', isDark: false, isLive: true },
          { slug: 'cw-breeze-thru', background: '#E4D3BC', isDark: false, isLive: false },
        ]}
        items={PORTFOLIO_ITEMS}
      />
    );

    const drawn = screen
      .getAllByText('Live')
      .map((el) => el.closest('a')?.getAttribute('href')?.replace('/portfolio/', ''));

    expect(drawn).toEqual(['cosmikata']);
  });

  it('draws no Live pill on the homepage cards', () => {
    renderSection();

    expect(screen.queryByText('Live')).not.toBeInTheDocument();
  });

  it('renders one card per fixture entry', () => {
    renderSection();

    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'));

    expect([...hrefs].sort()).toEqual(
      HOMEPAGE_CONTENT.work.map((card) => `/portfolio/${card.slug}`).sort()
    );
  });

  it('orders the cards newest year first, keeping fixture order within a year', () => {
    const card = (slug: string) => ({ slug, background: '#FFFFFF', isDark: false, isLive: false });

    render(
      <HomepageWorkSection
        sectionId={SECTION_IDS.work}
        intro={intro}
        cards={[card('old'), card('tie-a'), card('range'), card('tie-b')]}
        items={[
          makePortfolioItem('old', 'Old', { year: '2017' }),
          makePortfolioItem('tie-a', 'Tie A', { year: '2025' }),
          makePortfolioItem('range', 'Range', { year: '2019 – 2021' }),
          makePortfolioItem('tie-b', 'Tie B', { year: '2025' }),
        ]}
      />
    );

    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'));

    expect(hrefs).toEqual([
      '/portfolio/tie-a',
      '/portfolio/tie-b',
      '/portfolio/range',
      '/portfolio/old',
    ]);
  });

  it('skips a card whose slug matches no item rather than throwing', () => {
    // A content error, not a crash. `homepage.fixture.spec.ts` asserts the two
    // lists agree, so this path should be unreachable in practice.
    render(
      <HomepageWorkSection
        sectionId={SECTION_IDS.work}
        intro={intro}
        cards={[{ slug: 'no-such-item', background: '#FFFFFF', isDark: false, isLive: false }]}
        items={PORTFOLIO_ITEMS}
      />
    );

    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });

  it('carries the section id and the anchor offset', () => {
    const { container } = renderSection();
    const section = container.querySelector('section');

    expect(section).toHaveAttribute('id', SECTION_IDS.work);
    expect(section).toHaveClass('scroll-mt-anchor');
  });
});

describe('sortYear', () => {
  it('reads a single year', () => {
    expect(sortYear('2018')).toBe(2018);
  });

  it('reads the end of a range, so an ongoing project sorts by its latest year', () => {
    expect(sortYear('2019 – 2021')).toBe(2021);
  });

  it('sorts an unreadable year last rather than throwing', () => {
    expect(sortYear('')).toBe(Number.NEGATIVE_INFINITY);
  });
});
