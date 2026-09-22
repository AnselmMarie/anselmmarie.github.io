import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import HomepageSkills from './homepage-skills.js';

const GROUPS = [
  { id: 'developer', cardId: 'engineering', heading: 'Developer', skills: ['TypeScript'] },
  { id: 'developer-tools', cardId: 'engineering', heading: '', skills: ['Nx Monorepo'] },
  { id: 'ui-ux', cardId: 'design', heading: 'UI/UX', skills: ['Figma'] },
];

describe('HomepageSkills', () => {
  it('puts the section id on the section element — D43 is a silent contract', () => {
    const { container } = render(
      <HomepageSkills sectionId="skills" label="Skills" groups={GROUPS} />
    );

    expect(container.querySelector('section#skills')).not.toBeNull();
  });

  it('names the section for assistive tech even though v3 draws no heading', () => {
    render(<HomepageSkills sectionId="skills" label="Skills" groups={GROUPS} />);

    expect(screen.getByRole('heading', { name: 'Skills', level: 2 })).toBeInTheDocument();
  });

  it('renders one column per group it is given', () => {
    render(<HomepageSkills sectionId="skills" label="Skills" groups={GROUPS} />);

    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Nx Monorepo')).toBeInTheDocument();
    expect(screen.getByText('Figma')).toBeInTheDocument();
  });

  it('puts columns sharing a cardId in one card, not one card each', () => {
    // ⚠️ v3 draws two cards over three columns. One card per column is the
    // divergence; this is the assertion that catches it.
    render(<HomepageSkills sectionId="skills" label="Skills" groups={GROUPS} />);

    expect(screen.getAllByRole('list')).toHaveLength(3);
    const cards = screen.getAllByRole('list').map((list) => list.parentElement?.parentElement);
    expect(cards[0]).toBe(cards[1]);
    expect(cards[0]).not.toBe(cards[2]);
  });
});
