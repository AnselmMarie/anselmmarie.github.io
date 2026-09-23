import type { AnchorHTMLAttributes, ReactElement, ReactNode } from 'react';

import { cn } from '@portfolio/shared-utils';

/** `solid` is the filled primary action; `outline` is the hairline secondary. */
export type PillLinkVariant = 'solid' | 'outline';

interface PillLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Where the link goes. Required — this is an anchor, never a button. */
  href: string;
  /** The label, and any trailing icon the caller wants inside the pill. */
  children: ReactNode;
  /** Which of the two treatments to draw. Defaults to the filled one. */
  variant?: PillLinkVariant;
  className?: string;
}

const VARIANT_FILL = {
  solid: 'bg-ink text-paper hover:bg-accent-bright hover:text-ink',
  outline: 'border border-rule text-ink hover:bg-surface-sunk',
} as const;

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
        'inline-flex items-center gap-2.5 rounded-pill px-5 py-3 text-sm font-medium transition-colors',
        VARIANT_FILL[variant],
        className
      )}
      {...anchorProps}
    >
      {children}
    </a>
  );
};

export default PillLink;
