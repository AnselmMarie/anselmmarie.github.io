import type { ReactElement } from 'react';

import HeaderNavLink from './header-nav-link.js';
import { HEADER_SECTIONS } from './header-sections.const.js';

interface HeaderNavProps {
  /** The current path, forwarded to each link (D43). */
  pathname: string;
}

/**
 * The Header's section links, in the order the homepage renders them.
 */
const HeaderNav = ({ pathname }: HeaderNavProps): ReactElement => {
  return (
    <nav aria-label="Sections" className="flex items-center gap-6">
      {HEADER_SECTIONS.map((section) => (
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
