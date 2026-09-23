import { type ReactElement, type ReactNode, useState } from 'react';

import { cn } from '@portfolio/shared-utils';
import {
  AccordionContent,
  AccordionItem,
  Accordion as AccordionRoot,
  AccordionTrigger,
} from '@portfolio/ui-primitives';

import UiIcon from '../ui-icon/ui-icon.js';

export interface AccordionEntry {
  /** A stable key — never an index or a display name, which can repeat. */
  value: string;
  /** The always-visible row. May use `group-hover:` / `group-focus-visible:`. */
  header: ReactNode;
  /** The body, mounted only while the row is open. */
  content: ReactNode;
}

interface AccordionProps {
  items: readonly AccordionEntry[];
  /** The row open on load. Omit for none. */
  defaultValue?: string;
  className?: string;
}

/**
 * The site's disclosure list — shadcn's `Accordion` (Base UI) drawn as the
 * Experience rows: a full-width hover tint and a `+` / `−` ring on the right.
 * One row open at a time, and Base UI supplies the `<button>`,
 * `aria-expanded`, `aria-controls` and arrow-key movement.
 *
 * ⚠️ **The open row is tracked here, not read back from CSS.** The ring's fill
 * and the plus/minus swap depend on it, and deciding that in JS keeps it off
 * `data-panel-open` selectors whose precedence against `group-hover:` would be
 * settled by stylesheet order.
 *
 * ⚠️ **The trigger classes undo the generated ones on purpose**, as `NavMenu`
 * does: no underline, no ring, the panel radius and tint instead. The
 * generated chevrons are hidden with an `!important` `hidden` — they carry
 * their own `inline` toggle, and only `!` wins that without editing the
 * generated file (D25). Radius goes through `rounded-(--radius-panel)` because
 * tailwind-merge cannot tell `rounded-panel` conflicts with `rounded-md`.
 *
 * ⚠️ **The body is unmounted when closed** (Base UI's default), so a spec
 * asserting "renders when open" can fail.
 */
const TRIGGER =
  'group -mx-4 grid w-[calc(100%+2rem)] cursor-pointer grid-cols-[1fr_auto] items-center gap-4 rounded-(--radius-panel) border-0 px-4 py-[1.35rem] font-normal transition-colors hover:bg-surface/50 hover:no-underline focus-visible:bg-surface/50 focus-visible:ring-0 [&>[data-slot=accordion-trigger-icon]]:hidden!';

const RING_OPEN = 'border-accent-bright bg-accent-bright';
const RING_CLOSED =
  'border-rule group-hover:border-accent group-hover:text-accent group-focus-visible:border-accent';

const Accordion = ({ items, defaultValue, className }: AccordionProps): ReactElement => {
  const [openValues, setOpenValues] = useState<string[]>(defaultValue ? [defaultValue] : []);

  return (
    <AccordionRoot
      value={openValues}
      className={className}
      onValueChange={(next) => setOpenValues(next as string[])}
    >
      {items.map((item) => {
        const isOpen = openValues.includes(item.value);

        return (
          <AccordionItem key={item.value} value={item.value} className="border-b border-rule">
            <AccordionTrigger className={TRIGGER}>
              <span className="min-w-0">{item.header}</span>
              <span
                data-testid="accordion-ring"
                className={cn(
                  'grid size-[30px] shrink-0 place-items-center rounded-pill border',
                  isOpen ? RING_OPEN : RING_CLOSED
                )}
              >
                <UiIcon name={isOpen ? 'minus' : 'plus'} size={16} />
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-5 pb-[1.6rem]">{item.content}</AccordionContent>
          </AccordionItem>
        );
      })}
    </AccordionRoot>
  );
};

export default Accordion;
