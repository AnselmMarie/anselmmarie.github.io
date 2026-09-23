import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PillLink from './pill-link.js';

describe('PillLink', () => {
  it('renders a link to its href', () => {
    render(<PillLink href="#work">View work</PillLink>);

    expect(screen.getByRole('link', { name: 'View work' })).toHaveAttribute('href', '#work');
  });

  it('forwards extra anchor attributes', () => {
    render(
      <PillLink href="https://example.com" target="_blank" rel="noreferrer">
        Visit
      </PillLink>
    );

    const link = screen.getByRole('link', { name: 'Visit' });

    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });

  it('renders the outline variant as a link too', () => {
    render(
      <PillLink href="#contact" variant="outline">
        Get in touch
      </PillLink>
    );

    expect(screen.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '#contact');
  });
});
