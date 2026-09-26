import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import type { ReactElement } from 'react';

import { cn } from '@portfolio/shared-utils';

/**
 * shadcn's `accordion` (base-vega), as generated with `iconLibrary: "tabler"`.
 * Never hand-edit it (D25) — a project look goes in a `libs/ui/components`
 * wrapper (`Accordion`).
 *
 * ⚠️ Same two mechanical adaptations as `button.tsx`: arrow functions and `cn`
 * from `@portfolio/shared-utils`. The Tabler chevrons are the CLI's own output,
 * not a hand-swap.
 *
 * ⚠️ `data-open:animate-accordion-down` / `data-closed:animate-accordion-up`
 * resolve to keyframes defined in `libs/ui/theme` against Base UI's
 * `--accordion-panel-height` — not `tw-animate-css`, whose keyframes don't
 * read that var. The inner div's `data-starting-style` / `data-ending-style`
 * classes never match (Base UI sets those on the Panel) and do nothing.
 */
const Accordion = ({ className, ...props }: AccordionPrimitive.Root.Props): ReactElement => {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn('flex w-full flex-col', className)}
      {...props}
    />
  );
};

const AccordionItem = ({ className, ...props }: AccordionPrimitive.Item.Props): ReactElement => {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('not-last:border-b', className)}
      {...props}
    />
  );
};

const AccordionTrigger = ({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props): ReactElement => {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'group/accordion-trigger relative flex flex-1 items-start justify-between rounded-md border border-transparent py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground',
          className
        )}
        {...props}
      >
        {children}
        <IconChevronDown
          data-slot="accordion-trigger-icon"
          className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
        />
        <IconChevronUp
          data-slot="accordion-trigger-icon"
          className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
};

const AccordionContent = ({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props): ReactElement => {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          'h-(--accordion-panel-height) pt-0 pb-4 data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4',
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  );
};

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
