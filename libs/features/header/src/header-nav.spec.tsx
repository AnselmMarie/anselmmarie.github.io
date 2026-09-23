import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SITE_SECTIONS } from '@portfolio/shared-fixtures';

import HeaderNav from './header-nav.js';

describe('HeaderNav', () => {
  it('renders one link per section, in order', () => {
    render(<HeaderNav pathname="/" />);

    const links = screen.getAllByRole('link');

    expect(links.map((link) => link.textContent)).toEqual(
      SITE_SECTIONS.map((section) => section.label)
    );
  });

  it('reads the contract directly, not a second name for it', () => {
    // The `header-sections.const.ts` re-export is retired (D81): a contract
    // with three readers is easier to trace when every reader names it the
    // same way. This asserts the list is the fixture's, not a local copy.
    render(<HeaderNav pathname="/" />);

    expect(screen.getAllByRole('link')).toHaveLength(SITE_SECTIONS.length);
    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '#work');
  });

  it('labels the landmark so the links are reachable by role', () => {
    render(<HeaderNav pathname="/" />);

    expect(screen.getByRole('navigation', { name: 'Sections' })).toBeInTheDocument();
  });
});
