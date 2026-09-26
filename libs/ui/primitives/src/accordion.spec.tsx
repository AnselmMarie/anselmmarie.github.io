import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion.js';

const renderAccordion = (defaultValue: string[] = []) =>
  render(
    <Accordion defaultValue={defaultValue}>
      <AccordionItem value="one">
        <AccordionTrigger>First</AccordionTrigger>
        <AccordionContent>First body</AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger>Second</AccordionTrigger>
        <AccordionContent>Second body</AccordionContent>
      </AccordionItem>
    </Accordion>
  );

describe('Accordion', () => {
  it('opens the item named by defaultValue and leaves the rest closed', () => {
    renderAccordion(['one']);

    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    expect(screen.getByText('First body')).toBeInTheDocument();
    expect(screen.queryByText('Second body')).not.toBeInTheDocument();
  });

  it('opens an item on click and closes the other — one open at a time by default', () => {
    renderAccordion(['one']);

    fireEvent.click(screen.getByRole('button', { name: 'Second' }));

    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('points each trigger at its panel with aria-controls', () => {
    renderAccordion(['one']);

    const panelId = screen.getByRole('button', { name: 'First' }).getAttribute('aria-controls');

    expect(panelId).toBeTruthy();
    expect(document.getElementById(panelId ?? '')).toHaveTextContent('First body');
  });

  it('draws its chevrons as Tabler icons', () => {
    renderAccordion();

    const trigger = screen.getByRole('button', { name: 'First' });

    expect(trigger.querySelector('svg.tabler-icon-chevron-down')).not.toBeNull();
    expect(trigger.querySelector('svg.tabler-icon-chevron-up')).not.toBeNull();
  });
});
