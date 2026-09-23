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

  it('mounts no popup until a trigger opens one', () => {
    // Base UI replaced Radix's `viewport` prop: the positioner is portalled and
    // renders nothing while every item is closed.
    render(
      <NavigationMenu aria-label="Sections">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="#work">Work</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    expect(document.body.querySelector('[data-side]')).toBeNull();
    expect(document.body.querySelector('[data-slot="navigation-menu-content"]')).toBeNull();
  });

  it('draws the trigger chevron as a decorative Tabler icon', () => {
    render(
      <NavigationMenu>
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
