import { type AnchorHTMLAttributes, Children, type ReactElement, type ReactNode } from 'react';

import { cn } from '@portfolio/shared-utils';
import { buttonVariants } from '@portfolio/ui-primitives';

/**
 * `solid` is the filled primary action; `outline` is the hairline secondary.
 * `accent` and `outline-ink` are the pair that sits on ink (the Contact block,
 * the detail page's closing block).
 */
export type PillLinkVariant = 'solid' | 'outline' | 'accent' | 'outline-ink';

interface PillLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Where the link goes. Required — this is an anchor, never a button. */
  href: string;
  /** The label, and any trailing icon the caller wants inside the pill. */
  children: ReactNode;
  /** Which of the two treatments to draw. Defaults to the filled one. */
  variant?: PillLinkVariant;
  className?: string;
}

/** Which shadcn Button variant each pill starts from, before the fill below. */
const BUTTON_VARIANT = {
  solid: 'default',
  outline: 'outline',
  accent: 'default',
  'outline-ink': 'outline',
} as const;

const VARIANT_FILL = {
  solid: 'bg-ink text-paper hover:bg-accent-bright hover:text-ink',
  outline: 'border-rule bg-transparent text-ink shadow-none hover:bg-surface-sunk hover:text-ink',
  accent: 'bg-accent-bright text-ink hover:bg-accent-bright/80',
  'outline-ink':
    'border-white/22 bg-transparent text-paper shadow-none hover:border-paper hover:bg-transparent hover:text-paper',
} as const;

/**
 * ⚠️ **The label is trimmed to cap-height → baseline, and the pill has a fixed
 * height instead of vertical padding.** Inter's line box reserves ascender and
 * descender space the labels never fill, so equal padding did not draw equal
 * space around the letters. Trimmed to the capitals, the label is centred by
 * `items-center` inside a fixed height: the gap above "V" / "G" equals the gap
 * below the baseline, and a pill with a 17px icon stays the same height as one
 * without. The icon lands on the capitals' centre by the same `items-center`.
 *
 * ⚠️ **Cap-height, not x-height.** An x-height trim (tried 2026-09-23) balanced
 * the lowercase letters but left the capitals and ascenders ~2.5px closer to
 * the top than the baseline was to the bottom, and the pills read bottom-heavy.
 *
 * Where `text-box` is unsupported (Firefox) the untrimmed line is centred
 * instead. Only string children are wrapped: an icon must not be trimmed.
 */
const LABEL_TRIM = '[text-box:trim-both_cap_alphabetic]';

const trimLabels = (children: ReactNode): ReactNode =>
  Children.map(children, (child) =>
    typeof child === 'string' ? <span className={LABEL_TRIM}>{child}</span> : child
  );

/**
 * The rounded action — "View work", "Get in touch", the detail page's outbound
 * links. Nine call sites across the two exports (D76).
 *
 * ⚠️ **It is an anchor, and `href` is required.** Every one of those nine call
 * sites navigates: to a hash on the same page, to a route, or to an external
 * URL. Nothing in either design uses this shape for an action that does not
 * navigate, so there is no `onClick`-only mode and no `as` prop — a caller
 * that needs a button needs a different component, not a looser one.
 *
 * Extra anchor attributes pass through, which is how a caller adds `target`,
 * `rel` or `aria-label` without this component enumerating them.
 *
 * ⚠️ **Styled with shadcn's `buttonVariants`, never rendered through `Button`.**
 * Base UI's Button forces `role="button"`, so it must not render an `<a>` —
 * the anchor takes the button's classes instead. The pill overrides below
 * replace the button's `h-10`, `rounded-md` and `px-2.5`, and undo its
 * `[&_svg]:size-4` so an icon keeps the `size` its caller passed (17px, not 16).
 */
const PillLink = ({
  href,
  children,
  variant = 'solid',
  className,
  ...anchorProps
}: PillLinkProps): ReactElement => {
  return (
    <a
      href={href}
      className={cn(
        buttonVariants({ variant: BUTTON_VARIANT[variant], size: 'lg' }),
        "h-[2.875rem] gap-2.5 rounded-pill px-5 text-sm font-medium [&_svg:not([class*='size-'])]:size-auto",
        VARIANT_FILL[variant],
        className
      )}
      {...anchorProps}
    >
      {trimLabels(children)}
    </a>
  );
};

export default PillLink;
