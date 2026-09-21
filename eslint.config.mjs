import nx from '@nx/eslint-plugin';
import unusedImports from 'eslint-plugin-unused-imports';

// The dependency-constraint table lives in its own file: inline it was roughly
// half of this config and pushed it past the 200-line cap in
// .claude/rules/file-size.md. It is the mechanism behind D2, D25, D27 and D29
// in docs/planning/mfe-architecture/decisions.md.
import { depConstraints } from './tools/eslint/module-boundaries.mjs';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/out-tsc',
      '**/coverage',
      '**/test-output',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
      // TanStack Start's build output, and the CDK synth output (D37).
      // Both are generated, and both land inside the workspace.
      '**/.output',
      '**/.nitro',
      '**/cdk.out',
      // Playwright artifacts (Slice 9).
      '**/playwright-report',
      '**/.playwright',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints,
        },
      ],
    },
  },
  {
    // Type-aware linting (required by `@typescript-eslint/no-deprecated`).
    // `projectService` is the fast typescript-eslint v8 path — it builds a TS
    // program per project on demand. Scoped to typed files only; plain JS
    // carries no type info and doesn't need it.
    files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
    languageOptions: {
      parserOptions: { projectService: true },
    },
    rules: {
      // Flags usage of any `@deprecated`-tagged API at lint time, so deprecated
      // code is caught when written (CI + pre-commit).
      //
      // ⚠️ At `warn` in the repo this was copied from because that repo had a
      // backlog to clear. This workspace starts empty, so there is no backlog
      // and nothing to grandfather — it is `error` here from the first commit,
      // which is the only moment a rule like this is free to turn on.
      '@typescript-eslint/no-deprecated': 'error',
      'max-depth': ['error', { max: 2 }],
    },
  },
  {
    // Files intentionally outside their project's tsconfig `include` — build
    // and tool config files. `projectService` can't resolve them, so type-aware
    // parsing errors. Parse them without type info and skip the type-aware rule.
    files: [
      '**/*.config.ts',
      '**/*.config.cts',
      '**/*.config.mts',
      'tools/**/*.mjs',
      'eslint.config.mjs',
    ],
    languageOptions: {
      parserOptions: { projectService: false },
    },
    rules: {
      '@typescript-eslint/no-deprecated': 'off',
      // A project's own `vite.config.ts` / `vitest.config.ts` may import
      // build-only tooling that is not a runtime dependency of that project, so
      // it is exempt from the boundary constraint. The per-project `nx lint`
      // run honours each project's own override, but a pre-commit
      // `eslint --fix` runs against THIS root config — so the exemption has to
      // live here too or the two disagree.
      '@nx/enforce-module-boundaries': 'off',
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // Auto-fixable: removes dead `import` statements before they reach main.
      'unused-imports/no-unused-imports': 'error',
      // .claude/rules/no-nested-ternary.md.
      //
      // ⚠️ Core ESLint rule, so it is NOT auto-fixable: the fix is a named
      // local, which only a person can name. And note that `a ? (b ? c : d) : e`
      // IS a violation — the parentheses are a reading aid, and Biome drops
      // them the moment the expression wraps.
      'no-nested-ternary': 'error',
    },
  },
];
