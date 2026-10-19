import { render, screen } from '@testing-library/react';
import { createElement } from 'react';
import { describe, expect, it } from 'vitest';

import Icon, { type IconName } from './icon.js';

const NAMES: readonly IconName[] = [
  'arrow-left',
  'arrow-right',
  'arrow-up-right',
  'external',
  'message-circle',
  'minus',
  'plus',
  'send',
  'x',
];

describe('Icon', () => {
  it('draws a distinct mark for every name in the union', () => {
    // A name mapped to the wrong icon renders happily and points the wrong
    // way, so the marks are compared rather than merely counted.
    const drawn = NAMES.map((name) => {
      const { container, unmount } = render(createElement(Icon, { name }));
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
        createElement(Icon, {
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
      createElement(Icon, { name: 'external', size: 19, className: 'text-accent' })
    );
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('width', '19');
    expect(svg).toHaveClass('text-accent');
  });
});
