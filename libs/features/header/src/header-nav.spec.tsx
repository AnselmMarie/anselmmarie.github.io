import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import HeaderNav from './header-nav.js';
import { HEADER_SECTIONS } from './header-sections.const.js';

describe('HeaderNav', () => {
  it('renders one link per section, in order', () => {
    render(<HeaderNav pathname="/" />);

    const links = screen.getAllByRole('link');

    expect(links.map((link) => link.textContent)).toEqual(
      HEADER_SECTIONS.map((section) => section.label)
    );
  });

  it('labels the landmark so the links are reachable by role', () => {
    render(<HeaderNav pathname="/" />);

    expect(screen.getByRole('navigation', { name: 'Sections' })).toBeInTheDocument();
  });
});
