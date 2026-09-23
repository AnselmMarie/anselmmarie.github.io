import type { ReactElement, ReactNode } from 'react';

import { cn } from '@portfolio/shared-utils';
import { Badge } from '@portfolio/ui-primitives';

interface TagChipProps {
  /** The tag's label — a technology, a skill. */
  children: ReactNode;
  className?: string;
  /** Render as an `<li>`, for a chip that is one item of a `<ul>`. */
  isListItem?: boolean;
}

/**
 * The sentence-case capsule on paper with a hairline rule — the detail page's
 * `Technologies` list. Drawn on shadcn's `Badge` (outline).
 *
 * Not a `MetaChip` tone: that one is mono, uppercase and cap-trimmed, and this
 * is body type. Folding both into one component would make every tone carry
 * the other's typography overrides.
 *
 * ⚠️ **`isListItem` renders the `<li>` itself**, through `Badge`'s `render`,
 * rather than wrapping a span in one — so a list of tags is still announced as
 * "list, N items" without an extra element per chip.
 */
const TagChip = ({ children, className, isListItem = false }: TagChipProps): ReactElement => {
  return (
    <Badge
      variant="outline"
      render={isListItem ? <li /> : undefined}
      className={cn(
        'h-auto rounded-pill border-rule bg-paper px-[0.85rem] py-[0.45rem] text-[0.82rem] font-normal text-ink',
        className
      )}
    >
      {children}
    </Badge>
  );
};

export default TagChip;
