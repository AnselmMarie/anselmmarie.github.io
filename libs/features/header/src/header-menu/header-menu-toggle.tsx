import type { ReactElement } from 'react';

import { cn } from '@portfolio/shared-utils';

interface HeaderMenuToggleProps {
  /** The overlay this controls, so `aria-controls` can point at it. */
  panelId: string;
  isOpen: boolean;
  onToggle: () => void;
}

const BAR_BASE =
  'absolute h-[1.5px] w-5 bg-current transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)]';

/**
 * The two-bar control that opens the mobile overlay, animating into an X.
 *
 * ⚠️ **A `<button>`, though the export draws an `<a>`.** The export's anchor
 * has no `href`, no role and no `aria-expanded`: it is unreachable by keyboard
 * and silent to a screen reader. Deliberate divergence, recorded in the plan's
 * `Design → code delta` table rather than left as an unexplained difference.
 *
 * ⚠️ **44px of hit area, pulled out of the row by `-my-2.5`.** The design sets
 * a 44px control inside 16px padding, which makes the mobile bar 76px — taller
 * than the 56px `--spacing-nav` spacer that holds the page down, so the bar
 * would overlap the content it is supposed to clear. The negative margin keeps
 * the tap target at the 44px accessibility minimum while contributing 24px to
 * the row, so the bar measures 56px on both sides of the breakpoint and the
 * spacer stays correct. Shrinking the button instead would have been the
 * silent, worse fix.
 */
const HeaderMenuToggle = ({ panelId, isOpen, onToggle }: HeaderMenuToggleProps): ReactElement => {
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-controls={panelId}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      onClick={onToggle}
      className="relative -my-2.5 flex h-11 w-11 items-center justify-center text-ink frame:hidden"
    >
      <span
        aria-hidden
        className={cn(BAR_BASE, isOpen ? 'translate-y-0 rotate-45' : '-translate-y-[3.5px]')}
      />
      <span
        aria-hidden
        className={cn(BAR_BASE, isOpen ? 'translate-y-0 -rotate-45' : 'translate-y-[3.5px]')}
      />
    </button>
  );
};

export default HeaderMenuToggle;
