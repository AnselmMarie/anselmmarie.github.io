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
- **[D26](../decisions-d17-d32.md#d26)** — one Tailwind preset and one CSS-variable theme, in
  `libs/ui/theme`. Every app extends it rather than declaring its own colors.
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

⚠️ **The Q8 decline hands an obligation forward.** [R3](../risks.md#r3) — Tailwind content
globs tree-shaking a lib's classes, which fails silently by rendering unstyled — now has no
browser-level check until Slice 9. This slice's completion report must say that plainly, so
the gap travels with the decision rather than being rediscovered.

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

- `project.json`, the Tailwind preset, the CSS-variable theme (light and dark)
- The content-glob list, owned here rather than restated per app — see
  [R3](../risks.md#r3)

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

- `apps/shell/tailwind.config.ts` — extends the preset instead of standing alone
- `libs/features/shell` — imports from `@portfolio/ui-components`
- Root manifests for the three new projects

## Gates

```bash
pnpm nx run-many -t typecheck lint test --projects=ui-theme,ui-primitives,ui-components,feature-shell,shell
```

Plus a screenshot, and a before/after if the page shifted at all.

## Notes for whoever builds this

- **The glob list is the trap.** A class used only inside `libs/ui/components` is absent
  from an app's CSS unless that app's content globs reach the lib. It fails by rendering
  unstyled, not by erroring, so it survives a green build. Put the globs in the preset and
  verify by rendering a lib-only class in the shell.
- **Theme variables are injected once, by the shell.** A remote that ships its own copy of
  the theme can repaint the whole page. Slice 3 is where that first becomes possible.
- Keep primitives boring. Every wrapper added now is a wrapper to maintain against future
  `shadcn add` runs.
