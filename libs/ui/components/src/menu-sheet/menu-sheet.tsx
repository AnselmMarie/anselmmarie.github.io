import type { ReactElement } from 'react';

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@portfolio/ui-primitives';

import UiIcon from '../ui-icon/ui-icon.js';

export interface MenuSheetItem {
  /** A plain href — a hash, a path, or both. Never a router link (D43). */
  href: string;
  label: string;
}

interface MenuSheetProps {
  /** The popup's id, so the opening toggle's `aria-controls` can point at it. */
  id?: string;
  /** The dialog's accessible name — "Menu". Visually hidden. */
  title: string;
  items: readonly MenuSheetItem[];
  /**
   * The control that opens the sheet, rendered in place through
   * `SheetTrigger`. Must render a `<button>` and pass through the props and
   * ref it is given — Base UI puts `aria-expanded`, `aria-controls` and the
   * toggle handler on it.
   */
  trigger: ReactElement;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

/**
 * The small-screen section menu on shadcn's `Sheet` (Base UI `Dialog`), drawn
 * as the header's full-width ink panel dropping in from below the bar.
 *
 * Controlled, with the opening control passed in as `trigger` — the header's
 * animated two-bar toggle, which reads `isOpen` to draw its X. The generated
 * close button is off because that toggle is the close control. Escape, a
 * press outside, and tapping a link all ask to close through `onOpenChange`.
 *
 * ⚠️ **Non-modal on purpose (`modal={false}`).** A modal Base UI dialog marks
 * everything outside its popup `aria-hidden` — the trigger included
 * (`FloatingFocusManager`'s inside elements omit it) — so the toggle's
 * "Close menu" would vanish from the accessibility tree while the sheet is
 * open. The overlay this replaces was non-modal and kept the toggle
 * reachable. Registering the toggle as the trigger is what stops a press on
 * it from counting as an outside press, closing and then re-opening the
 * sheet.
 *
 * ⚠️ **The generated backdrop still renders** (Base UI draws it for any
 * top-level dialog, modal or not): the page dims and blurs slightly behind
 * the sheet. Removing it would mean editing the generated file (D25).
 *
 * ⚠️ **The links are plain anchors that close the sheet in `onClick`, not
 * `SheetClose`.** `SheetClose` is a Base UI Button, which forces
 * `role="button"` onto whatever it renders — every entry here navigates.
 *
 * ⚠️ **The panel classes undo the generated ones on purpose**, the same move
 * `NavMenu` makes: `top` becomes the nav height so the bar stays visible, and
 * the popover fill, border, gap and shadow give way to the design's ink panel.
 * Each override repeats the generated class's `data-[side=top]:` variant where
 * it has one — without it the generated class out-ranks the override on
 * specificity, and tailwind-merge does not see the two as a conflict.
 */
const PANEL =
  'gap-0 bg-ink px-[18px] pt-[14px] pb-[26px] text-paper shadow-none frame:hidden data-[side=top]:top-(--spacing-nav) data-[side=top]:border-b-0';

const LINK =
  'flex items-baseline justify-between gap-[14px] -mx-3 border-b border-white/10 px-3 py-[0.55rem] font-display text-[1.9rem] font-bold tracking-[-0.02em] text-paper transition-colors hover:bg-white/5 hover:text-accent-bright focus-visible:bg-white/5';

const MenuSheet = ({
  id,
  title,
  items,
  trigger,
  isOpen,
  onOpenChange,
}: MenuSheetProps): ReactElement => {
  return (
    <Sheet open={isOpen} modal={false} onOpenChange={(open) => onOpenChange(open)}>
      <SheetTrigger render={trigger} />
      <SheetContent id={id} side="top" showCloseButton={false} className={PANEL}>
        <SheetTitle className="sr-only">{title}</SheetTitle>
        {items.map((item) => (
          <a key={item.href} href={item.href} className={LINK} onClick={() => onOpenChange(false)}>
            {item.label}
            <UiIcon name="arrow-up-right" size={16} className="shrink-0 text-accent-bright" />
          </a>
        ))}
      </SheetContent>
    </Sheet>
  );
};

export default MenuSheet;
