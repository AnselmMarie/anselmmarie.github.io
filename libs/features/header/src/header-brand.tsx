import type { ReactElement } from 'react';

import { SITE_NAME } from '@portfolio/shared-fixtures';

import { HOME_PATH } from './anchor-href.js';

interface HeaderBrandProps {
  /** Closes the mobile overlay when the brand is tapped from inside it. */
  onNavigate?: () => void;
}

/**
 * The wordmark at the left of the bar, in both variants of the header.
 *
 * ⚠️ **An `<a href="/">`, not a router link.** Same reason as
 * `header-nav-link.tsx`: keeping `@tanstack/react-router` out of this remote is
 * what holds the federation shared set at `react` / `react-dom` /
 * `@portfolio/ui-components` (D43). A full document load on a wordmark click is
 * the price, and it is the right one.
 */
const HeaderBrand = ({ onNavigate }: HeaderBrandProps): ReactElement => {
  return (
    <a
      href={HOME_PATH}
      onClick={onNavigate}
      className="font-display text-[1.15rem] font-bold tracking-[-0.02em] text-ink"
    >
      {SITE_NAME}
    </a>
  );
};

export default HeaderBrand;
