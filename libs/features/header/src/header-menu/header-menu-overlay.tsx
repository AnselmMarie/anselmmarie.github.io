import type { ReactElement } from 'react';

import { SITE_SECTIONS } from '@portfolio/shared-fixtures';
import { UiIcon } from '@portfolio/ui-components';

import { anchorHref } from '../anchor-href/anchor-href.js';

interface HeaderMenuOverlayProps {
  /** Matches the toggle's `aria-controls`. */
  id: string;
  /** The current path, so each anchor knows whether it needs `/` (D43). */
  pathname: string;
  onDismiss: () => void;
}

/**
 * The full-width ink panel below the bar on small screens.
 *
 * ⚠️ **Unmounted when closed, where the export uses `display:none`.** The slice
 * file asks for that choice to be made deliberately rather than by accident:
 * unmounting is chosen because the panel's only state is which link was
 * tapped, there is no enter/exit animation in the design to preserve, and an
 * always-present panel leaves five links in the tab order of every page at
 * every width. The toggle's bars keep their animation either way — they are
 * not inside this component.
 *
 * ⚠️ **It positions against `ShellHeaderRegion`'s `<header>`, not itself.**
 * `top-full` resolves against the nearest positioned ancestor, which is the
 * shell's fixed bar — that is why Slice 12 added `relative` there. The Header
 * remote renders two divs deep inside a padded row, so an overlay positioned
 * locally would inherit that padding and stop short of the viewport edges.
 */
const HeaderMenuOverlay = ({ id, pathname, onDismiss }: HeaderMenuOverlayProps): ReactElement => {
  return (
    <div
      id={id}
      data-testid="header-menu-overlay"
      className="absolute inset-x-0 top-full flex flex-col bg-ink px-[18px] pb-[26px] pt-[14px] frame:hidden"
    >
      {SITE_SECTIONS.map((section) => (
        <a
          key={section.id}
          href={anchorHref(section.id, pathname)}
          onClick={onDismiss}
          className="flex items-baseline justify-between gap-[14px] border-b border-white/10 py-[0.55rem] font-display text-[1.9rem] font-bold tracking-[-0.02em] text-paper transition-colors hover:text-accent-bright"
        >
          {section.label}
          <UiIcon name="arrow-up-right" size={16} className="shrink-0 text-accent-bright" />
        </a>
      ))}
    </div>
  );
};

export default HeaderMenuOverlay;
