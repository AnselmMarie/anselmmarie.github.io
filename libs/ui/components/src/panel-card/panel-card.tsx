import type { ReactElement, ReactNode } from 'react';

import { cn } from '@portfolio/shared-utils';

interface PanelCardProps {
  /** The panel's contents. */
  children: ReactNode;
  className?: string;
}

/**
 * The bordered panel on `--color-surface` — the Experience footnote cards, the
 * About stat cards, and the detail page's facts block. Five call sites across
 * the two exports (D76), all with the same 18px radius, hairline border and
 * surface fill.
 *
 * ⚠️ **Not a `libs/ui/primitives` `Card` wrapper.** The generated shadcn
 * `Card` carries its own padding scale, shadow and header/content slots, none
 * of which the design uses; wrapping it would mean overriding more than it
 * provides. D25 keeps the generated file unedited, and D40 says a wrapper
 * earns its place by attaching behaviour — this attaches the design's panel
 * treatment to a plain element instead.
 */
const PanelCard = ({ children, className }: PanelCardProps): ReactElement => {
  return (
    <div className={cn('rounded-panel border border-rule bg-surface p-6', className)}>
      {children}
    </div>
  );
};

export default PanelCard;
