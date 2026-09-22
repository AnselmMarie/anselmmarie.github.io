import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import HeaderNavLink from './header-nav-link.js';

describe('HeaderNavLink', () => {
  it('renders an anchor to the section, not a router link', () => {
    render(<HeaderNavLink sectionId="skills" label="Skills" pathname="/" />);

    const link = screen.getByRole('link', { name: 'Skills' });

    expect(link).toHaveAttribute('href', '#skills');
  });

  it('prefixes the path when it is not on the homepage', () => {
    render(<HeaderNavLink sectionId="skills" label="Skills" pathname="/portfolio/cosmikata" />);

    expect(screen.getByRole('link', { name: 'Skills' })).toHaveAttribute('href', '/#skills');
  });
});
