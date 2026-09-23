import type { ReactElement } from 'react';

import { SITE_SECTIONS } from '@portfolio/shared-fixtures';

import HeaderNavLink from './header-nav-link.js';

interface HeaderNavProps {
  /** The current path, forwarded to each link (D43). */
  pathname: string;
}

/**
 * The Header's five section links, right-aligned in the bar's second grid
 * column. They were centred in a middle column until 2026-09-23.
 *
 * ⚠️ **Hidden below 760px, not unmounted** — the links move into
 * `header-menu-overlay.tsx` there. `frame` is the design's one breakpoint,
 * defined as a token by Slice 10 (`--breakpoint-frame: 760px`), so the number
 * is not repeated here.
 *
 * ⚠️ **It reads `SITE_SECTIONS` directly now.** The `header-sections.const.ts`
 * indirection is gone: it re-exported the fixture under a second name, and a
 * contract with three readers is easier to trace when every reader names it the
 * same way (D63, D81).
 */
const HeaderNav = ({ pathname }: HeaderNavProps): ReactElement => {
  return (
    <nav aria-label="Sections" className="hidden items-center justify-end gap-[26px] frame:flex">
      {SITE_SECTIONS.map((section) => (
        <HeaderNavLink
          key={section.id}
          sectionId={section.id}
          label={section.label}
          pathname={pathname}
        />
      ))}
    </nav>
  );
};

export default HeaderNav;
