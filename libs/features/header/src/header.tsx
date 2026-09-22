import type { ReactElement } from 'react';

import { SITE_NAME } from '@portfolio/shared-fixtures';

import { HOME_PATH } from './anchor-href.js';
import HeaderNav from './header-nav.js';

interface HeaderProps {
  /**
   * The current path. Defaults to the browser's, which is correct because this
   * remote only ever renders on the client (D8 / D9 / D36 — the shell SSRs its
   * own page and the remote hydrates after). The prop exists so specs can
   * render a portfolio path without a jsdom navigation.
   */
  pathname?: string;
}

/**
 * The site header, served as its own independently deployed remote (D1, D2).
 *
 * ⚠️ **No v3 equivalent exists.** D34 makes the live v3 site the design
 * reference for every surface, but v3 has no header at all — verified against
 * both commit `39bbe56` and the deployed site. The bar's visual treatment is
 * therefore invented; the site name is v3's real hero heading and the nav
 * labels are v3's real section headings. Flagged per plan-design-links.md.
 *
 * ⚠️ **The nav labels are hardcoded here rather than in
 * `libs/shared/fixtures`, and that is not a D22 violation.** D29's threshold is
 * extraction at the *second* consumer; these labels have exactly one. If a
 * second surface ever needs them they move to the fixtures then.
 */
const Header = ({ pathname }: HeaderProps): ReactElement => {
  const currentPath =
    pathname ?? (typeof window === 'undefined' ? HOME_PATH : window.location.pathname);

  return (
    <div data-testid="header-remote" className="flex w-full items-center justify-between gap-6">
      <a href={HOME_PATH} className="text-base font-semibold tracking-tight text-ink">
        {SITE_NAME}
      </a>
      <HeaderNav pathname={currentPath} />
    </div>
  );
};

export default Header;
