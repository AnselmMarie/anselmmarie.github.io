import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HOMEPAGE_CONTENT, PORTFOLIO_ITEMS, SECTION_IDS } from '@portfolio/shared-fixtures';

import HomepageAboutSection from '../homepage-about/homepage-about-section.js';
import HomepageContactBlock from '../homepage-contact/homepage-contact-block.js';
import HomepageFootnotes from '../homepage-experience/homepage-footnotes.js';
import HomepageSkills from '../homepage-skills/homepage-skills.js';
import HomepageWorkSection from '../homepage-work/homepage-work-section.js';
import { required } from '../test-helpers/portfolio-item.test-helpers.js';

const introFor = (id: string) =>
  required(
    HOMEPAGE_CONTENT.sectionIntros.find((intro) => intro.sectionId === id),
    `the ${id} section intro`
  );

describe('HomepageWorkSection — the dark card', () => {
  it("flips the one dark card's foreground without touching the others", () => {
    // The tone derivation is a lookup rather than a nested ternary
    // (no-nested-ternary.md), and it is the only branch in the card.
    render(
      <HomepageWorkSection
        sectionId={SECTION_IDS.work}
        intro={introFor(SECTION_IDS.work)}
        cards={HOMEPAGE_CONTENT.work}
        items={PORTFOLIO_ITEMS}
      />
    );

    const dark = HOMEPAGE_CONTENT.work.filter((card) => card.isDark);
    const titleOf = (slug: string) =>
      required(
        PORTFOLIO_ITEMS.find((item) => item.slug === slug),
        slug
      ).title;

    expect(dark.map((card) => card.slug)).toEqual(['csp-generator-app']);
    expect(
      screen.getByRole('link', { name: new RegExp(titleOf('csp-generator-app'), 'u') })
    ).toHaveClass('text-paper');
    expect(
      screen.getByRole('link', { name: new RegExp(titleOf('pokemon-pet-shop'), 'u') })
    ).toHaveClass('text-ink');
  });

  it('omits the aside when the intro leaves it empty', () => {
    const { container } = render(
      <HomepageWorkSection
        sectionId={SECTION_IDS.work}
        intro={{ ...introFor(SECTION_IDS.work), aside: '' }}
        cards={[]}
        items={[]}
      />
    );

    expect(container.textContent).not.toContain('Selected projects');
  });
});

describe('HomepageSkills', () => {
  it('renders the four groups the design names, on ink', () => {
    const { container } = render(
      <HomepageSkills
        sectionId={SECTION_IDS.skills}
        intro={introFor(SECTION_IDS.skills)}
        groups={HOMEPAGE_CONTENT.skillGroups}
      />
    );

    for (const group of HOMEPAGE_CONTENT.skillGroups) {
      expect(screen.getByText(group.heading)).toBeInTheDocument();
      for (const skill of group.skills) {
        expect(screen.getByText(skill)).toBeInTheDocument();
      }
    }
    expect(container.querySelector('section')).toHaveAttribute('id', SECTION_IDS.skills);
  });
});

describe('HomepageFootnotes', () => {
  it('renders the award and the degree as key/title/detail', () => {
    render(<HomepageFootnotes notes={HOMEPAGE_CONTENT.footnotes} />);

    for (const note of HOMEPAGE_CONTENT.footnotes) {
      expect(screen.getByText(note.key)).toBeInTheDocument();
      expect(screen.getByText(note.title)).toBeInTheDocument();
      expect(screen.getByText(note.detail)).toBeInTheDocument();
    }
  });
});

describe('HomepageAboutSection', () => {
  it("renders the statement plain, without inventing the design's emphasis", () => {
    // ⚠️ The export bolds `looks` and accents `holds up.` mid-sentence.
    // `AccentedLine` only accents a trailing run, so the statement is stored
    // plain — and hardcoding the two words here would put site copy in a
    // component. Asserted so the divergence stays deliberate.
    const { container } = render(
      <HomepageAboutSection sectionId={SECTION_IDS.about} about={HOMEPAGE_CONTENT.about} />
    );
    const about = container.querySelector('section') as HTMLElement;

    expect(within(about).getByText(HOMEPAGE_CONTENT.about.statement)).toBeInTheDocument();
    expect(about.querySelector('strong')).toBeNull();
  });

  it('renders both paragraphs and both stats', () => {
    render(<HomepageAboutSection sectionId={SECTION_IDS.about} about={HOMEPAGE_CONTENT.about} />);

    for (const paragraph of HOMEPAGE_CONTENT.about.paragraphs) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
    for (const stat of HOMEPAGE_CONTENT.about.stats) {
      expect(screen.getByText(stat.value)).toBeInTheDocument();
      expect(screen.getByText(stat.label)).toBeInTheDocument();
    }
  });
});

describe('HomepageContactBlock', () => {
  it('ends at its bottom rule and draws no footer strip (D79)', () => {
    const { container } = render(
      <HomepageContactBlock sectionId={SECTION_IDS.contact} contact={HOMEPAGE_CONTENT.contact} />
    );

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      HOMEPAGE_CONTENT.contact.heading.lead
    );
    expect(container.textContent).not.toContain('© 2026');
    expect(screen.getAllByRole('link')).toHaveLength(HOMEPAGE_CONTENT.contact.links.length);
  });
});
