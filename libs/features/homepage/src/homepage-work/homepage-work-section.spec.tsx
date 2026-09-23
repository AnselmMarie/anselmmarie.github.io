import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HOMEPAGE_CONTENT, PORTFOLIO_ITEMS, SECTION_IDS } from '@portfolio/shared-fixtures';

import { required } from '../test-helpers/portfolio-item.test-helpers.js';
import HomepageWorkSection from './homepage-work-section.js';

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

    const first = required(HOMEPAGE_CONTENT.work[0], 'the first work card');
    const item = required(
      PORTFOLIO_ITEMS.find((i) => i.slug === first.slug),
      first.slug
    );
    const card = screen.getByRole('link', { name: new RegExp(item.title, 'u') });

    expect(card).toHaveAttribute('href', `/portfolio/${item.slug}`);
    expect(within(card).getByText(item.lede)).toBeInTheDocument();
    expect(within(card).getByText(item.company)).toBeInTheDocument();
    expect(within(card).getByText(new RegExp(item.year, 'u'))).toBeInTheDocument();
    expect(within(card).getByText(item.tech.slice(0, 3).join(' · '))).toBeInTheDocument();
    expect(card).toHaveStyle({ backgroundColor: first.background });
  });

  it('draws the Live chip only on the cards marked live', () => {
    renderSection();

    const live = HOMEPAGE_CONTENT.work.filter((card) => card.isLive).map((card) => card.slug);
    const drawn = screen
      .getAllByText('Live')
      .map((el) => el.closest('a')?.getAttribute('href')?.replace('/portfolio/', ''));

    expect(drawn).toEqual(live);
  });

  it('renders one card per fixture entry, in fixture order', () => {
    renderSection();

    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'));

    expect(hrefs).toEqual(HOMEPAGE_CONTENT.work.map((card) => `/portfolio/${card.slug}`));
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
