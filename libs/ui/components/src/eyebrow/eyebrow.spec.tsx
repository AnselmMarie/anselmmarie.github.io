import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Eyebrow from './eyebrow.js';

describe('Eyebrow', () => {
  it('renders its label', () => {
    render(<Eyebrow label="Selected work" />);

    expect(screen.getByText('Selected work')).toBeInTheDocument();
  });

  it('omits the rule mark by default', () => {
    render(<Eyebrow label="About" />);

    expect(screen.queryByText('|')).not.toBeInTheDocument();
  });

  it('draws the rule mark when asked, hidden from assistive tech', () => {
    render(<Eyebrow label="About" hasRule />);

    const rule = screen.getByText('|');

    expect(rule).toBeInTheDocument();
    expect(rule).toHaveAttribute('aria-hidden');
  });

  it('does not upper-case the label in the DOM', () => {
    render(<Eyebrow label="Selected work" />);

    expect(screen.getByText('Selected work')).toBeInTheDocument();
    expect(screen.queryByText('SELECTED WORK')).not.toBeInTheDocument();
  });
});
