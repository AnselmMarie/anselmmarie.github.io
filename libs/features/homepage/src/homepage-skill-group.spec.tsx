import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import HomepageSkillGroup from './homepage-skill-group.js';

describe('HomepageSkillGroup', () => {
  it('renders the heading and every skill in order', () => {
    render(
      <HomepageSkillGroup
        group={{
          id: 'developer',
          cardId: 'engineering',
          heading: 'Developer',
          skills: ['TypeScript', 'React'],
        }}
      />
    );

    expect(screen.getByRole('heading', { name: 'Developer', level: 4 })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').map((el) => el.textContent)).toEqual([
      'TypeScript',
      'React',
    ]);
  });

  it('renders no heading element when the group has no heading', () => {
    // ⚠️ v3 renders a second, `invisible` "Developer" heading as a spacer. A
    // screen reader announces an invisible heading as a real one, so the
    // spacer must not be a heading at all.
    render(
      <HomepageSkillGroup
        group={{ id: 'tools', cardId: 'engineering', heading: '', skills: ['Nx Monorepo'] }}
      />
    );

    expect(screen.queryByRole('heading')).toBeNull();
    expect(screen.getByText('Nx Monorepo')).toBeInTheDocument();
  });
});
