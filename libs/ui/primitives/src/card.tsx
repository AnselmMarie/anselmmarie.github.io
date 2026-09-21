import type { ComponentProps, ReactElement } from 'react';

import { cn } from '@portfolio/shared-utils';

/**
 * shadcn's `Card` primitive, adapted to this project's card shape (D34 — the
 * live v3 site's rounded, bordered, shadowed panel). Never hand-edit this
 * file directly (D25) — a different look or added behavior goes into a
 * wrapper in `libs/ui/components`.
 */
const Card = ({ className, ...props }: ComponentProps<'div'>): ReactElement => {
  return (
    <div
      data-slot="card"
      className={cn('rounded-2xl border border-slate-200 bg-page p-10 shadow-sm', className)}
      {...props}
    />
  );
};

export default Card;
