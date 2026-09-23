import type { ReactElement } from 'react';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@portfolio/ui-primitives';

export interface NavMenuItem {
  /** A plain href — a hash, a path, or both. Never a router link (D43). */
  href: string;
  label: string;
}

interface NavMenuProps {
  /** The landmark's accessible name — "Sections". */
  label: string;
  items: readonly NavMenuItem[];
  className?: string;
}

/**
 * The flat, text-only nav on shadcn's `NavigationMenu` — a labelled `<nav>`
 * over a `<ul>`, with arrow-key movement between the links from Radix.
 *
 * ⚠️ **The link classes undo the generated ones on purpose.** The primitive's
 * link is a padded, rounded tile that fills `bg-accent` on hover — and
 * `accent` here is the brand green, not shadcn's neutral grey, so the
 * untouched look would flash a green block behind every link. `cn` drops the
 * primitive's padding, fill and ring in favour of the design's plain text
 * link (D56 is why the override wins rather than racing on stylesheet order).
 *
 * `viewport={false}`: there are no dropdowns, so no viewport is mounted.
 */
const NAV_LINK =
  'block rounded-none p-0 text-[0.88rem] text-ink hover:bg-transparent hover:text-accent focus:bg-transparent focus:text-accent focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent';

const NavMenu = ({ label, items, className }: NavMenuProps): ReactElement => {
  return (
    <NavigationMenu viewport={false} aria-label={label} className={className}>
      <NavigationMenuList className="gap-[26px]">
        {items.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink href={item.href} className={NAV_LINK}>
              {item.label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavMenu;
