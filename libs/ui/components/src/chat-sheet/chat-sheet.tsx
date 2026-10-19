import type { ReactElement, ReactNode } from 'react';

import { Sheet, SheetContent, SheetTitle } from '@portfolio/ui-primitives';

import IconButton from '../icon-button/icon-button.js';

interface ChatSheetProps {
  /** The visible heading, which also names the dialog. "Chat". */
  title: string;
  /** The close button's accessible name. "Close chat". */
  closeLabel: string;
  /** The drawer's body: the message column and the composer. */
  children: ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

/**
 * The AI chat's right-side drawer (ai-chat D17), on shadcn's `Sheet` (Base UI
 * `Dialog`), drawn as the design's inset card that slides in from the right.
 *
 * Modal, unlike `MenuSheet`: the launcher is hidden while the drawer is open,
 * so there is no trigger to keep in the accessibility tree. Escape, a press on
 * the scrim and the close button all ask to close through `onOpenChange`.
 *
 * ⚠️ **The panel classes undo the generated ones**, repeating the generated
 * `data-[side=right]:` variant wherever it has one, for the specificity reason
 * `MenuSheet` explains. The drawer sits `frame` (14px) in from three edges and
 * slides by its own width plus that inset, rather than fading.
 *
 * ⚠️ **The scrim is restyled from the panel, because `SheetContent` gives its
 * generated backdrop no `className`.** The backdrop is the popup's sibling in
 * the same portal, so a class on the popup can't reach it directly. The
 * `[body:has(&)_…]` variant compiles to
 * `body:has(<panel>) [data-slot=sheet-overlay]`: it styles the backdrop only
 * while this panel is mounted. The other route, an `overlayClassName` on the
 * generated sheet, means hand-editing it (D25).
 *
 * ⚠️ **The design's stacking: scrim 79, drawer 80** (launcher 70). The generated
 * `z-50` sits under the shell's fixed header (`z-60`), which then paints over
 * both the dimmed page and the drawer's top edge.
 */
const PANEL =
  'z-[80] gap-0 overflow-hidden rounded-card border border-rule bg-surface text-ink shadow-[0_16px_48px_color-mix(in_oklab,var(--color-backdrop)_25%,transparent)] duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] data-ending-style:opacity-100 data-starting-style:opacity-100 data-[side=right]:inset-y-frame data-[side=right]:right-frame data-[side=right]:h-auto data-[side=right]:w-[min(400px,calc(100vw-28px))] data-[side=right]:border-l data-[side=right]:sm:max-w-none data-[side=right]:data-ending-style:translate-x-[calc(100%+28px)] data-[side=right]:data-starting-style:translate-x-[calc(100%+28px)]';

const SCRIM =
  '[body:has(&)_[data-slot=sheet-overlay]]:z-[79] [body:has(&)_[data-slot=sheet-overlay]]:bg-backdrop/35 [body:has(&)_[data-slot=sheet-overlay]]:backdrop-blur-none [body:has(&)_[data-slot=sheet-overlay]]:duration-300';

const ChatSheet = ({
  title,
  closeLabel,
  children,
  isOpen,
  onOpenChange,
}: ChatSheetProps): ReactElement => {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => onOpenChange(open)}>
      <SheetContent side="right" showCloseButton={false} className={`${PANEL} ${SCRIM}`}>
        <div className="flex items-center justify-between gap-3 border-b border-rule p-[18px]">
          <SheetTitle className="font-display text-[1.2rem] font-bold tracking-[-0.02em] text-ink">
            {title}
          </SheetTitle>
          <IconButton
            icon="x"
            label={closeLabel}
            tone="ghost"
            size={36}
            onClick={() => onOpenChange(false)}
          />
        </div>
        <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatSheet;
