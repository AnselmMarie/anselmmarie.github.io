import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import SocialIcon from './social-icon.js';

describe('SocialIcon', () => {
  it('renders a distinct mark for each destination', () => {
    const { container: linkedin } = render(<SocialIcon name="linkedin" />);
    const { container: github } = render(<SocialIcon name="github" />);

    // The two marks must not be the same drawing — a lookup that fell back to
    // one icon for every name would otherwise pass every other assertion here.
    expect(linkedin.innerHTML).not.toBe(github.innerHTML);
  });

  it('is decorative, so the link around it names it exactly once', () => {
    render(
      <a href="https://example.test" aria-label="GitHub">
        <SocialIcon name="github" />
      </a>
    );

    const link = screen.getByRole('link', { name: 'GitHub' });
    expect(link).toBeInTheDocument();
    expect(link.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
