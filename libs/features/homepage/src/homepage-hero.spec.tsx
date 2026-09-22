import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import HomepageHero from './homepage-hero.js';

const HERO = {
  name: 'Anselm Marie',
  headline: 'Senior Software Engineer',
  links: [{ label: 'GitHub', href: 'https://github.com/AnselmMarie', icon: 'github' as const }],
};

describe('HomepageHero', () => {
  it('renders the name and the headline it is given', () => {
    render(<HomepageHero hero={HERO} />);

    expect(screen.getByText('Anselm Marie')).toBeInTheDocument();
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
  });

  it('opens each link in a new tab without leaking the referrer', () => {
    render(<HomepageHero hero={HERO} />);

    const link = screen.getByRole('link', { name: 'GitHub' });
    expect(link).toHaveAttribute('href', 'https://github.com/AnselmMarie');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });

  it('renders no links when the content carries none', () => {
    render(<HomepageHero hero={{ ...HERO, links: [] }} />);

    expect(screen.queryByRole('link')).toBeNull();
  });

  it('is not a section anchor — the Header links start at #skills', () => {
    const { container } = render(<HomepageHero hero={HERO} />);

    expect(container.querySelector('[id]')).toBeNull();
  });
});
