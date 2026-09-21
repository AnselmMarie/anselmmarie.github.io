import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names, resolving Tailwind conflicts so the **last** utility in a
 * group wins. `clsx` flattens the arguments (strings, arrays, conditional
 * objects, falsy values) and `tailwind-merge` then drops the classes a later
 * one overrides: `cn('p-10', 'p-4')` is `'p-4'`, not `'p-10 p-4'`.
 *
 * ⚠️ **That resolution is the whole point, and a plain filter-and-join does not
 * do it.** Joining leaves both classes on the element and the winner is decided
 * by stylesheet order — so a caller passing `p-4` to a component whose default
 * is `p-10` silently gets the default. Every `libs/ui/components` wrapper that
 * forwards a `className` depends on this behaviour.
 *
 * It lives in `libs/shared/utils` because that is the one place all three tiers
 * may reach: `tools/eslint/module-boundaries.mjs` permits `type:ui-primitives`,
 * `type:ui-components` and `type:feature` to depend on `type:shared`, and its
 * comment already named shared utils as this helper's home. A copy per package
 * is what the single home replaces — see D56.
 */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
