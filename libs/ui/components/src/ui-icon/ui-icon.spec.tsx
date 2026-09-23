import { render, screen } from '@testing-library/react';
import { createElement } from 'react';
import { describe, expect, it } from 'vitest';

import UiIcon, { type UiIconName } from './ui-icon.js';

const NAMES: readonly UiIconName[] = [
  'arrow-left',
  'arrow-right',
  'arrow-up-right',
  'external',
  'minus',
  'plus',
];

describe('UiIcon', () => {
  it('draws a distinct mark for every name in the union', () => {
    // A name mapped to the wrong icon renders happily and points the wrong
    // way, so the marks are compared rather than merely counted.
    const drawn = NAMES.map((name) => {
      const { container, unmount } = render(createElement(UiIcon, { name }));
      const html = container.innerHTML;

      unmount();
      return html;
    });

    expect(new Set(drawn).size).toBe(NAMES.length);
  });

  it('is decorative — hidden from assistive tech and unfocusable', () => {
    // The accessible name belongs to the link or button around it. An icon
    // that announces itself makes every such control read twice.
    const { container } = render(
      createElement(
        'a',
        { href: '/x', 'aria-label': 'All work' },
        createElement(UiIcon, {
          name: 'arrow-left',
        })
      )
    );
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
    expect(screen.getByRole('link')).toHaveAccessibleName('All work');
  });

  it('takes a size and a className from the caller', () => {
    const { container } = render(
      createElement(UiIcon, { name: 'external', size: 19, className: 'text-accent' })
    );
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('width', '19');
    expect(svg).toHaveClass('text-accent');
  });
});
