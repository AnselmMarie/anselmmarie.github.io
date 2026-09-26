# Decision D56 — `cn` is one real Tailwind merge, in `libs/shared/utils`

The index is [decisions.md](./decisions.md). Its own file because it corrects
[Slice 2](./slices/02-ui-libs.md) after it was built, and the correction has two halves that
are easy to conflate: **what `cn` does**, and **where it lives**.

<a id="d56"></a>**D56 — `cn` is a single implementation in `libs/shared/utils`, built from
`clsx` + `tailwind-merge`.** Maintainer's call, 2026-09-21, on review of Slice 2.

## What was wrong

Slice 2 shipped `cn` **twice** — `libs/ui/primitives/src/lib/utils.ts` and
`libs/ui/components/src/cn.ts` — and **neither copy was a Tailwind-aware merge.** Both were
a filter-and-join:

```ts
inputs.filter(Boolean).join(' ')   // the old implementation, in both places
```

⚠️ **Joining is not merging, and the difference is silent.** `cn('p-10', 'p-4')` returned
`'p-10 p-4'`, leaving both classes on the element so the winner is decided by **stylesheet
order, not by the caller**. A wrapper in `libs/ui/components` forwarding a `className` — the
entire point of the [D25](./decisions-d17-d32.md#d25) primitives/wrapper split — therefore
could not reliably override a primitive's default. Nothing exercised that path yet, so it
was latent rather than broken, and it would have surfaced as "my override does nothing" at
some later slice.

The duplication also carried a **wrong justification in its own comment**: it claimed
`ui-components` could not depend the other way. It can —
`tools/eslint/module-boundaries.mjs` permits `type:ui-components` →
`type:ui-primitives`. The only real obstacle was that the primitives barrel did not export
`cn`, which is one line.

## The fix

```ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
```

`clsx` 2.1.1 flattens strings, arrays, conditional objects and falsy values;
`tailwind-merge` 3.7.0 resolves the conflicts. tailwind-merge 3.x is the line that
understands Tailwind 4, which is what [D51](./decisions-d48-d52.md#d51) puts in this
workspace.

## Why `libs/shared/utils` and not `libs/ui/*`

**Slice 1 already decided this, in the enforcement config**, and the comment is still there:

> Primitives are CLI output. They may read the theme and **shared utils (the `cn` helper's
> home)** and nothing else.

It is also the only single home that works. `type:shared` is reachable by
`type:ui-primitives`, `type:ui-components` **and** `type:feature` alike, so one
implementation serves all three with **no re-export chain**. The alternatives both fail:

| Home | Why not |
|---|---|
| `libs/ui/components` | `type:ui-primitives` may not depend on it, so `Card` could not import `cn` — this is what forced the duplicate in the first place. |
| `libs/ui/primitives` | Works for components, but `type:feature` may not reach primitives, so a feature lib could only get `cn` through a re-export in `ui-components`. |

⚠️ **This sits in tension with [D29](./decisions-d17-d32.md#d29)** — *"this is UI, so it is
`libs/ui/*` and not `libs/shared/*`; the two hierarchies do not mix"* — and the tension is
recorded rather than waved through. The reading taken: `cn` is a **string function**. It
takes class strings and returns a class string, with no JSX, no React and no DOM, which puts
it beside `absolute-url.ts` in kind. What it does carry into the shared hierarchy is a
`tailwind-merge` dependency, i.e. knowledge of Tailwind's class grammar. That is a real cost
and the honest argument for the primitives-plus-re-export shape instead. Slice 1's written
intent broke the tie.

## What else changed

- **`libs/ui/primitives/components.json`'s `utils` alias is now `@portfolio/shared-utils`**,
  so a future `shadcn add` generates `import { cn } from '@portfolio/shared-utils'` rather
  than scaffolding a third copy at `src/lib/utils`. Without this the CLI would silently
  re-create the duplicate this decision removes.
- `libs/ui/primitives` depends on `@portfolio/shared-utils`; `libs/ui/components` no longer
  exports `cn` at all.
- ⚠️ **[Slice 2](./slices/02-ui-libs.md)'s file list was wrong** and is corrected: it put
  "the `cn` helper" under `libs/ui/components`. That instruction is what produced the second
  copy.
- `.claude/rules/design-system.md` names the single home, so the next session does not
  re-duplicate it. ⚠️ That file is **gitignored** (`.gitignore:15` — every project rule here
  is untracked), so the note lives only on local disk.

## Verification

The spec was **seen failing**, per
[prove-the-spec-can-fail.md](../../../.claude/rules/prove-the-spec-can-fail.md): reverting to
the filter-and-join implementation turned three assertions red, including
`expected 'p-10 p-4' to be 'p-4'` — the defect itself — and
`expected 'bg-page text-ink bg-white' to be 'text-ink bg-white'` for the theme-token case.
⚠️ Note `git diff` proved nothing here, because `cn.ts` is a **new untracked file**; the
revert was confirmed by inspecting the bytes on disk instead. That is the same trap the rule
documents, in a different disguise.

All 10 projects pass typecheck, lint and test, `check:file-size` is clean, and the rendered
page is unchanged (`p-10` → 40px, `rounded-2xl` → 16px).
