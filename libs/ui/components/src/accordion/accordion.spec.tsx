import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Accordion from './accordion.js';

const ITEMS = [
  { value: 'cricket-2013', header: 'Cricket Wireless', content: 'Early body' },
  { value: 'cricket-2020', header: 'Cricket Wireless', content: 'Later body' },
  { value: 'acme', header: 'Acme', content: 'Acme body' },
] as const;

const triggers = () => screen.getAllByRole('button');

const nth = (elements: HTMLElement[], index: number): HTMLElement => {
  const element = elements[index];
  if (!element) throw new Error(`no element at index ${index}`);
  return element;
};

describe('Accordion', () => {
  it('renders every row closed when no defaultValue is given', () => {
    render(<Accordion items={ITEMS} />);

    expect(triggers()).toHaveLength(3);
    for (const trigger of triggers()) {
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    }
    expect(screen.queryByText('Early body')).not.toBeInTheDocument();
  });

  it('opens the defaultValue row and mounts only its body', () => {
    render(<Accordion items={ITEMS} defaultValue="acme" />);

    expect(screen.getByRole('button', { name: 'Acme' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Acme body')).toBeInTheDocument();
    expect(screen.queryByText('Early body')).not.toBeInTheDocument();
  });

  it('keys rows by value, so two rows with the same header open independently', () => {
    render(<Accordion items={ITEMS} />);

    fireEvent.click(nth(triggers(), 1));

    expect(nth(triggers(), 0)).toHaveAttribute('aria-expanded', 'false');
    expect(nth(triggers(), 1)).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Later body')).toBeInTheDocument();
  });

  it('keeps one row open at a time, and a second click closes it', () => {
    render(<Accordion items={ITEMS} defaultValue="acme" />);

    fireEvent.click(nth(triggers(), 0));

    expect(nth(triggers(), 0)).toHaveAttribute('aria-expanded', 'true');
    expect(nth(triggers(), 2)).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(nth(triggers(), 0));

    expect(nth(triggers(), 0)).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Early body')).not.toBeInTheDocument();
  });

  it('draws a plus on a closed row and a minus on the open one', () => {
    render(<Accordion items={ITEMS} defaultValue="acme" />);

    const rings = screen.getAllByTestId('accordion-ring');
    const closedRing = nth(rings, 0);
    const openRing = nth(rings, 2);

    expect(closedRing.querySelector('svg.tabler-icon-plus')).not.toBeNull();
    expect(closedRing.querySelector('svg.tabler-icon-minus')).toBeNull();
    expect(openRing.querySelector('svg.tabler-icon-minus')).not.toBeNull();
  });
});
