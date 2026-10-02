import { Input as InputPrimitive } from '@base-ui/react/input';
import type { ComponentProps, ReactElement } from 'react';

import { cn } from '@portfolio/shared-utils';

/**
 * shadcn's `input` (base-vega), as generated. Never hand-edit it (D25) — a
 * project look goes in a `libs/ui/components` wrapper (`PillInput`).
 *
 * ⚠️ Same two mechanical adaptations as `button.tsx`: an arrow function
 * (coding-conventions) and `cn` from `@portfolio/shared-utils` (D56), because
 * shadcn emits `import { cn } from "cn"`. Taken from
 * `shadcn add input --dry-run --view` (shadcn 4.21, 2026-10-02); re-running
 * `shadcn add` must re-apply both.
 */
const Input = ({ className, type, ...props }: ComponentProps<'input'>): ReactElement => {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        'h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
        className
      )}
      {...props}
    />
  );
};

export { Input };
