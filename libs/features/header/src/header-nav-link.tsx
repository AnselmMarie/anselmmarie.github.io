import type { ReactElement } from 'react';

import { anchorHref } from './anchor-href.js';

interface HeaderNavLinkProps {
  sectionId: string;
  label: string;
  /** The current path, so the link knows whether it needs to carry `/` (D43). */
  pathname: string;
}

/**
 * One nav entry: a plain `<a href="#id">` and nothing more (D43).
 *
 * Deliberately not a router link. See `anchor-href.ts` for why that keeps the
 * federation shared set small.
 */
const HeaderNavLink = ({ sectionId, label, pathname }: HeaderNavLinkProps): ReactElement => {
  return (
    <a
      href={anchorHref(sectionId, pathname)}
      className="text-sm font-medium text-ink transition-opacity hover:opacity-60"
    >
      {label}
    </a>
  );
};

export default HeaderNavLink;
