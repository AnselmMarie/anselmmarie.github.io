# Slice 2 — The design system: primitives, components, theme

**Status:** not started · **Visible?** ✅ screen · **Depends on:** Slice 1
**Design:** the live v3 site ([D34](../decisions-d33-d41.md#d34)) — appearance only; no Next.js
code is ported ([D6](../decisions-d01-d16.md#d6))

## Decisions that bind this slice

- **[D3](../decisions-d01-d16.md#d3)** — shadcn/ui + Tailwind are the component foundation,
  consumed at build time. Not a hosted UI app, not a federated remote.
- **[D25](../decisions-d17-d32.md#d25)** — `libs/ui/primitives` holds shadcn CLI output and is
  **never hand-edited**; `libs/ui/components` holds everything written by hand. A primitive
  that needs different behavior gets a wrapper, not a patch.
- **[D26](../decisions-d17-d32.md#d26)** — one theme, in `libs/ui/theme`. Every app consumes it
  rather than declaring its own colors. ⚠️ **The artifact changed under
  [D51](../decisions-d48-d52.md#d51):** Tailwind 4 is configured in CSS, so this is a
  stylesheet with an `@theme` block that each app `@import`s — **not** a `tailwind.config.ts`
  preset object each app spreads. D26's substance is untouched; only its shape is.
- **[D21](../decisions-d17-d32.md#d21)** — `@portfolio/*` package scope. The three packages this
  slice creates are `@portfolio/ui-theme`, `@portfolio/ui-primitives` and
  `@portfolio/ui-components`, with [D50](../decisions-d48-d52.md#d50)'s bare names
  (`ui-theme`, `ui-primitives`, `ui-components`) in their `project.json`.
- **[D44](../decisions-d42-d47.md#d44)** — ⚠️ **tag all three projects.**
  `@nx/enforce-module-boundaries` is **silently inert** for a project with no matching tag: it
  is unconstrained and the rule passes rather than failing. `ui-theme` is `type:ui-theme`,
  `ui-primitives` is `type:ui-primitives`, `ui-components` is `type:ui-components`, and all
  three are `scope:shared`. Untagged, [D25](../decisions-d17-d32.md#d25)'s
  primitives/components split is a convention again.
- **[D29](../decisions-d17-d32.md#d29)** — this is UI, so it is `libs/ui/*` and not
  `libs/shared/*`. The two hierarchies do not mix.
- **[D40](../decisions-d33-d41.md#d40)** — primitives are pulled **on demand, never
  speculatively**. Add what this slice's actual consumers need and nothing more; a wrapper
  in `libs/ui/components` is written only when project-specific behavior attaches to a
  primitive. A wrapper that only re-exports is a prop-drilling wrapper by another name.
- **[D38](../decisions-d33-d41.md#d38)** — **no Storybook.** The completion report says so
  explicitly, and names the consequence: nothing renders a component against a real
  stylesheet until Slice 9.

## Open questions blocking this slice

**None.** Both [Q7](../questions-closed.md#q7) and [Q8](../questions-closed.md#q8) closed on
2026-09-20, as [D40](../decisions-d33-d41.md#d40) and [D38](../decisions-d33-d41.md#d38). The slice keeps
its original size — the ~15 Storybook files and their coverage gate are not built.

⚠️ **The Q8 decline hands an obligation forward.** [R3](../risks.md#r3) — a lib's classes
tree-shaken away, which fails silently by rendering unstyled — has no browser-level check
until Slice 9. This slice's completion report must say that plainly, so the gap travels with
the decision rather than being rediscovered.

⚠️ **R3 is not hypothetical: it fired in Slice 1.** Tailwind auto-detects sources from the
Vite root and skips `node_modules`, and `@portfolio/feature-shell` is a symlinked workspace
package — so every class in the shell's layout resolved to nothing and the page rendered
**completely unstyled, with a green build and no warning**. It was caught by looking at the
screen. Slice 1 fixed it with an `@source` directive in `apps/shell/src/styles.css`; **this
slice owns moving that declaration into `libs/ui/theme`** so one stylesheet covers every lib
and no app has to remember. Each new lib still needs its own line, and a missing line is
still silent.

## ⚠️ This slice owes a design-system rule

[D46](../decisions-d42-d47.md#d46) archived cosmikata's `design-system.md` because every package
name in it was wrong for this repo — but its substance was not: *build from the shared
library, never hand-roll a primitive that exists, never use a raw palette value where a
token exists.* That applies here in full.

So this slice writes `.claude/rules/design-system.md` for `@portfolio/*` as it creates
`libs/ui/*`, covering at minimum: consume `@portfolio/ui-components`, never hand-roll a
primitive, never a raw Tailwind palette class where a theme token exists, and
[D25](../decisions-d17-d32.md#d25)'s never-hand-edit-a-primitive line. If the v3 site uses lowercase
button labels ([D34](../decisions-d33-d41.md#d34)), that convention belongs in this rule too rather
than in the i18n-shaped rule it was archived from.

Without it, [D3](../decisions-d01-d16.md#d3), [D25](../decisions-d17-d32.md#d25) and
[D26](../decisions-d17-d32.md#d26) are decisions in a plan doc with nothing pointing at them from
the place the work happens.

## What is on screen at the end

The same page as Slice 1, rendering identically or better, but now built from
`@portfolio/ui-components` and painted by the shared theme rather than by ad-hoc Tailwind
classes in the feature lib. If a viewer cannot tell the difference, that is the correct
outcome: this slice changes where the styling comes from, not what it looks like.

## Files this slice creates and modifies

**`libs/ui/theme`**

- `project.json`, `package.json`, and the theme stylesheet: an `@theme` block holding the
  CSS-variable theme (light and dark). No `tailwind.config.ts`
  ([D51](../decisions-d48-d52.md#d51))
- **The `@source` declarations**, owned here rather than restated per app — one line per lib
  whose classes must survive. This replaces Slice 1's interim declaration in
  `apps/shell/src/styles.css`; see [R3](../risks.md#r3)
- The **header-height token** [Slice 3](./03-federation-header.md) needs for
  [D43](../decisions-d42-d47.md#d43) may land here or there — whichever, it is one token in one
  place, because the Header and Homepage remotes must agree on the number at build time

**`libs/ui/primitives`**

- `project.json`, `components.json` with the shadcn CLI aliased to write **only** into this
  package, `src/index.ts`
- Only the primitives this slice's consumers actually import ([D40](../decisions-d33-d41.md#d40))
- A `README.md` stating the do-not-hand-edit rule at the point of temptation

**`libs/ui/components`**

- `project.json`, `src/index.ts`
- The `cn` helper, plus any wrapper that earns its place under [D40](../decisions-d33-d41.md#d40),
  each with a spec

**Modified**

- `apps/shell/src/styles.css` — `@import`s the theme stylesheet instead of declaring its own
  `@theme` and `@source` lines ([D51](../decisions-d48-d52.md#d51))
- `libs/features/shell` — imports from `@portfolio/ui-components`
- Root manifests for the three new projects — `pnpm-workspace.yaml` already globs
  `libs/ui/*`, so this is `tsconfig.base.json` paths plus one `pnpm install`

## Gates

```bash
pnpm nx run-many -t typecheck lint test --projects=ui-theme,ui-primitives,ui-components,feature-shell,shell
```

Plus a screenshot, and a before/after if the page shifted at all.

## Notes for whoever builds this

- **The `@source` list is the trap, and it has already caught this project once.** A class
  used only inside `libs/ui/components` is absent from the CSS unless something declares that
  directory as a source. It fails by rendering unstyled, not by erroring, so it survives a
  green build, a green typecheck and a green test run — see the R3 note above for how Slice 1
  hit exactly this. Put the declarations in the theme stylesheet and **verify by rendering a
  lib-only class in the shell and looking at it**, not by reading the build output.
- **Theme variables are injected once, by the shell.** A remote that ships its own copy of
  the theme can repaint the whole page. Slice 3 is where that first becomes possible.
- Keep primitives boring. Every wrapper added now is a wrapper to maintain against future
  `shadcn add` runs.
