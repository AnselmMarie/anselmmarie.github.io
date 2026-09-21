/**
 * Dependency constraints for `@nx/enforce-module-boundaries`.
 *
 * This table is the *mechanism* behind three decisions in
 * docs/planning/mfe-architecture/decisions.md that are otherwise only
 * conventions a reviewer has to catch by eye:
 *
 *   D2  — the remotes do not know about each other.
 *   D25 — `libs/ui/primitives` is shadcn output; features build from
 *         `libs/ui/components` (model.md §7).
 *   D27 — `apps/*` are skeletons; the logic lives in `libs/features/*`.
 *   D29 — `libs/shared/*` is non-UI and never depends on UI or features.
 *
 * ⚠️ These constraints are SILENTLY INERT for any project that carries no
 * matching tag. A project Nx knows about but nobody tagged is unconstrained,
 * and the rule passes trivially rather than failing. So every project created
 * in Slice 1 and after must be tagged, and Slice 8's CI asserts that every
 * project in `nx show projects --json` has both a `type:` and a `scope:` tag.
 * Without that assertion this file is a promise rather than a gate.
 */

/**
 * Tag vocabulary, applied in each project's `project.json`:
 *
 *   type:app             apps/*                    the deployable unit
 *   type:feature         libs/features/*           the code
 *   type:ui-components   libs/ui/components        hand-written
 *   type:ui-primitives   libs/ui/primitives        shadcn CLI output
 *   type:ui-theme        libs/ui/theme             the Tailwind preset
 *   type:shared          libs/shared/*             types, config, fixtures, utils
 *   type:infra           infra                     the CDK project
 *
 *   scope:shell | scope:header | scope:footer | scope:homepage |
 *   scope:portfolio-item      one per deployable pair (app + its feature lib)
 *   scope:shared              everything both halves may import
 *   scope:infra               the CDK project
 */
export const depConstraints = [
  // --- Scope: a deployable may only reach its own half, plus shared ---------
  //
  // This is the line that enforces D2. `apps/header` and `libs/features/header`
  // share `scope:header`, so the Header app can import the Header feature lib
  // and nothing else app-shaped. A feature lib importing a sibling feature lib
  // is the coupling Module Federation exists to prevent, and it fails here.
  //
  // ⚠️ Note this also blocks the D27 fallback described in model.md §2 — "if
  // Module Federation has to be backed out, the same code composes as a plain
  // monorepo import". That back-out is a deliberate decision, and it comes with
  // an edit to this table. It should not be reachable by accident.
  {
    sourceTag: 'scope:shell',
    onlyDependOnLibsWithTags: ['scope:shell', 'scope:shared'],
  },
  {
    sourceTag: 'scope:header',
    onlyDependOnLibsWithTags: ['scope:header', 'scope:shared'],
  },
  {
    sourceTag: 'scope:footer',
    onlyDependOnLibsWithTags: ['scope:footer', 'scope:shared'],
  },
  {
    sourceTag: 'scope:homepage',
    onlyDependOnLibsWithTags: ['scope:homepage', 'scope:shared'],
  },
  {
    sourceTag: 'scope:portfolio-item',
    onlyDependOnLibsWithTags: ['scope:portfolio-item', 'scope:shared'],
  },
  // Shared code is shared by everyone, so it may depend on nothing that is not
  // itself shared — otherwise a `libs/ui/*` change drags a feature's code into
  // every consumer's bundle.
  {
    sourceTag: 'scope:shared',
    onlyDependOnLibsWithTags: ['scope:shared'],
  },
  {
    sourceTag: 'scope:infra',
    onlyDependOnLibsWithTags: ['scope:infra'],
  },

  // --- Type: the layering within a scope -----------------------------------
  //
  // D27. An app may compose its feature lib, the design system, and shared
  // code. It holds no flesh of its own — which this cannot check directly, but
  // the file-size and review gates can once the app has nothing to import that
  // would tempt it.
  {
    sourceTag: 'type:app',
    onlyDependOnLibsWithTags: [
      'type:feature',
      'type:ui-components',
      'type:ui-primitives',
      'type:ui-theme',
      'type:shared',
    ],
  },
  // D25 + model.md §7: "a feature builds from `libs/ui/components`". Features
  // deliberately CANNOT reach `type:ui-primitives` directly. A feature that
  // wants a raw shadcn primitive is telling you the wrapper is missing, and
  // the wrapper is where project-specific behaviour is allowed to live —
  // a primitive is never hand-edited, so there is nowhere else for it to go.
  {
    sourceTag: 'type:feature',
    onlyDependOnLibsWithTags: ['type:ui-components', 'type:ui-theme', 'type:shared'],
  },
  {
    sourceTag: 'type:ui-components',
    onlyDependOnLibsWithTags: ['type:ui-primitives', 'type:ui-theme', 'type:shared'],
  },
  // Primitives are CLI output. They may read the theme and shared utils (the
  // `cn` helper's home) and nothing else — anything more means the generated
  // file was edited, which D25 forbids outright.
  {
    sourceTag: 'type:ui-primitives',
    onlyDependOnLibsWithTags: ['type:ui-theme', 'type:shared'],
  },
  // The theme is the root of the design system. It imports nothing internal,
  // which is what lets every app extend one preset (D26) without a cycle.
  {
    sourceTag: 'type:ui-theme',
    onlyDependOnLibsWithTags: [],
  },
  // D29. Shared code is not UI. A `libs/shared/*` package reaching into
  // `libs/ui/*` would make types, config and fixtures depend on the design
  // system, and every `libs/ui` change would then fan out through them.
  {
    sourceTag: 'type:shared',
    onlyDependOnLibsWithTags: ['type:shared'],
  },
  {
    sourceTag: 'type:infra',
    onlyDependOnLibsWithTags: ['type:infra'],
  },
];
