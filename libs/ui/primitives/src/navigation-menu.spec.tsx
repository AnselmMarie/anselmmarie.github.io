import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './navigation-menu.js';

describe('NavigationMenu', () => {
  it('renders a navigation landmark with its links', () => {
    render(
      <NavigationMenu aria-label="Sections">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="#work">Work</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    expect(screen.getByRole('navigation', { name: 'Sections' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '#work');
  });

  it('mounts the viewport by default and omits it when `viewport` is false', () => {
    const { container, rerender } = render(<NavigationMenu />);

    expect(container.querySelector('[data-slot="navigation-menu"]')).toHaveAttribute(
      'data-viewport',
      'true'
    );

    rerender(<NavigationMenu viewport={false} />);

    expect(container.querySelector('[data-slot="navigation-menu"]')).toHaveAttribute(
      'data-viewport',
      'false'
    );
  });

  it('draws the trigger chevron as a decorative Tabler icon', () => {
    render(
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>More</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="#more">Hidden</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    const trigger = screen.getByRole('button', { name: 'More' });

    expect(trigger.querySelector('svg.tabler-icon-chevron-down')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });
});
