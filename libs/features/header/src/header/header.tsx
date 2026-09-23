import { type ReactElement, useState } from 'react';

import { HOME_PATH } from '../anchor-href/anchor-href.js';
import HeaderMenuOverlay from '../header-menu/header-menu-overlay.js';
import HeaderMenuToggle from '../header-menu/header-menu-toggle.js';
import HeaderNav from '../header-nav/header-nav.js';
import HeaderBackLink from './header-back-link.js';
import HeaderBrand from './header-brand.js';

/**
 * Which bar to draw. The two design exports disagree, and both are right — see
 * `header-back-link.tsx`.
 */
export type HeaderVariant = 'home' | 'detail';

const MENU_PANEL_ID = 'header-menu';

interface HeaderProps {
  /**
   * ⚠️ **Passed by the shell, never inferred.** The remote cannot read
   * `window.location` to decide this: it renders inside `ClientOnly`, but the
   * host route is the only thing that knows which page it is, and a remote
   * guessing from the URL would be a second source of truth for routing that
   * D43 deliberately kept out of this package.
   *
   * ⚠️ **It defaults to `home`, which is the dangerous half.** A detail page
   * that forgets to pass `detail` renders five anchors that scroll nowhere and
   * nothing throws — so `mfe-remote-mount-props.spec.tsx` asserts the variant
   * arrives through the shell's mount, per spec-through-the-parent.md.
   */
  variant?: HeaderVariant;
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
 * ⚠️ **D59's "no v3 equivalent" note is retired.** The header was invented
 * when v3 was the design reference and v3 had none; D76 replaced that source
 * with the two exports, which draw it. The bar's chrome — fixed, full-bleed,
 * flush to the top — belongs to `ShellHeaderRegion` and diverges from the
 * export's floating bar by D84. This component draws what sits inside it.
 *
 * ⚠️ **The nav labels are no longer hardcoded here.** They come from
 * `SITE_SECTIONS`, which this slice owns and which has three readers (D63,
 * D81); the old `header-sections.const.ts` re-export is retired.
 */
const Header = ({ variant = 'home', pathname }: HeaderProps): ReactElement => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentPath =
    pathname ?? (typeof window === 'undefined' ? HOME_PATH : window.location.pathname);

  if (variant === 'detail') {
    return (
      <div
        data-testid="header-remote"
        data-variant="detail"
        className="flex w-full items-center justify-between gap-4"
      >
        <HeaderBrand />
        <HeaderBackLink />
      </div>
    );
  }

  return (
    <div
      data-testid="header-remote"
      data-variant="home"
      className="grid w-full grid-cols-[1fr_auto] items-center gap-4"
    >
      <HeaderBrand onNavigate={() => setIsMenuOpen(false)} />
      <HeaderNav pathname={currentPath} />
      {/* Hidden at `frame` so the nav takes the right-hand column. */}
      <div className="flex justify-end frame:hidden">
        <HeaderMenuToggle
          panelId={MENU_PANEL_ID}
          isOpen={isMenuOpen}
          onToggle={() => setIsMenuOpen((open) => !open)}
        />
      </div>
      {isMenuOpen ? (
        <HeaderMenuOverlay
          id={MENU_PANEL_ID}
          pathname={currentPath}
          onDismiss={() => setIsMenuOpen(false)}
        />
      ) : null}
    </div>
  );
};

export default Header;
