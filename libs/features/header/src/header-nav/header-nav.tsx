import type { ReactElement } from 'react';

import { SITE_SECTIONS } from '@portfolio/shared-fixtures';
import { NavMenu } from '@portfolio/ui-components';

import { anchorHref } from '../anchor-href/anchor-href.js';

interface HeaderNavProps {
  /** The current path, so each anchor knows whether it needs `/` (D43). */
  pathname: string;
}

/**
 * The Header's five section links, right-aligned in the bar's second grid
 * column, on shadcn's `NavigationMenu` via `NavMenu` (2026-09-23) — which
 * brings the `<ul>` and arrow-key movement between links.
 *
 * ⚠️ **Still plain `<a href="#id">`s, not router links** (D43): keeping
 * `@tanstack/react-router` out of this remote holds the federation shared set
 * small. `anchorHref` builds each href; `NavMenu` renders it untouched.
 *
 * ⚠️ **Hidden below 760px, not unmounted** — the links move into
 * `header-menu-overlay.tsx` there. `frame` is the design's one breakpoint
 * (`--breakpoint-frame: 760px`, Slice 10).
 *
 * ⚠️ **It reads `SITE_SECTIONS` directly** — no second name for the contract
 * (D63, D81).
 */
const HeaderNav = ({ pathname }: HeaderNavProps): ReactElement => {
  const items = SITE_SECTIONS.map((section) => ({
    href: anchorHref(section.id, pathname),
    label: section.label,
  }));

  return <NavMenu label="Sections" items={items} className="hidden justify-end frame:flex" />;
};

export default HeaderNav;
