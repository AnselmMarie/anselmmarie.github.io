import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import SectionHeading from './section-heading.js';

describe('SectionHeading', () => {
  it('renders both halves inside one heading', () => {
    render(<SectionHeading heading="Things I've" accentPhrase="shipped." />);

    expect(screen.getByRole('heading')).toHaveTextContent("Things I've shipped.");
  });

  it('defaults to a level-2 heading', () => {
    render(<SectionHeading heading="Where I've" accentPhrase="been." />);

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('renders a level-3 heading when the page asks for one', () => {
    render(<SectionHeading heading="Where I've" accentPhrase="been." level={3} />);

    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });

  it('omits the eyebrow when none is given', () => {
    render(<SectionHeading heading="Where I've" accentPhrase="been." />);

    expect(screen.queryByText('|')).not.toBeInTheDocument();
  });

  it('renders the eyebrow above the heading when given', () => {
    render(
      <SectionHeading heading="Things I've" accentPhrase="shipped." eyebrow="Selected work" />
    );

    expect(screen.getByText('Selected work')).toBeInTheDocument();
  });

  /*
   * spec-through-the-parent.md: `hasRule` is a prop this component hands to
   * `Eyebrow`, and `Eyebrow` defaults it to false. Every design call site draws
   * the rule, so dropping the forwarding line would lose it silently — the
   * eyebrow still renders, just without its accent mark, which no
   * component-level Eyebrow spec can see because that spec plays the parent.
   */
  it('forwards the rule mark to the eyebrow it renders', () => {
    render(
      <SectionHeading heading="Things I've" accentPhrase="shipped." eyebrow="Selected work" />
    );

    expect(screen.getByText('|')).toBeInTheDocument();
  });
});
