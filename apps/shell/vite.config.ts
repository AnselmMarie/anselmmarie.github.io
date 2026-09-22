import { federation } from '@module-federation/vite';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

/**
 * ⚠️ **Every line of the federation setup below is D55**, the Slice 3 spike
 * gate's proven configuration. Two of its mechanics were found by failing
 * first and the worktree that found them is deleted — read
 * docs/planning/mfe-architecture/decisions-d55.md before changing any of it.
 */

/**
 * ⚠️ **This duplicates `DEFAULT_HEADER_ORIGIN` in `@portfolio/shared-config`,
 * deliberately and unhappily.** Nx's `@nx/vite` plugin loads this file through
 * Node's ESM resolver to infer targets, and the shared-config package is
 * unbuilt TypeScript whose internal `./x.js` specifiers Node cannot resolve —
 * importing it here fails graph construction outright. So the env var is read
 * twice, with the same default, and the two must agree.
 *
 * It is also the visible edge of a larger gap: see the D12 note on `remotes`
 * below. Both are resolved the same way, by moving to runtime
 * `registerRemotes`, so this literal is best left alone until then rather than
 * worked around.
 */
const HEADER_ORIGIN = process.env.PORTFOLIO_HEADER_ORIGIN ?? 'http://localhost:4174';
const FOOTER_ORIGIN = process.env.PORTFOLIO_FOOTER_ORIGIN ?? 'http://localhost:4175';
const HOMEPAGE_ORIGIN = process.env.PORTFOLIO_HOMEPAGE_ORIGIN ?? 'http://localhost:4176';
const PORTFOLIO_ITEM_ORIGIN =
  process.env.PORTFOLIO_PORTFOLIO_ITEM_ORIGIN ?? 'http://localhost:4177';

const mfPlugins = federation({
  name: 'shell',
  remotes: {
    // D55 §2 — the OBJECT form with `type: 'module'`, never the
    // `'header@http://…'` shorthand. The plugin emits an ESM `remoteEntry.js`
    // but the runtime injects a classic `<script>` tag unless told the remote
    // is ESM, and the shorthand fails at runtime with
    // `Cannot use import statement outside a module`. Observed, not inferred.
    //
    // ⚠️ **This URL is baked into the shell's bundle at build time, which D12
    // says it must not be.** D19 asks for runtime resolution so a remote can be
    // redeployed at a new origin without rebuilding the shell; a static
    // `remotes` map cannot do that. D55 proved this path and explicitly left
    // the runtime `registerRemotes` / `mf-manifest.json` path UNPROVEN, so
    // Slice 3 builds on what was proven and the gap is reported rather than
    // papered over. Closing it is a scoped follow-up, not a rewrite.
    //
    // ⚠️ **Slice 4 added the other three, and their remotes do not exist yet.**
    // This map is a seam: slices 5, 6 and 7 run concurrently and would all edit
    // it otherwise. An entry pointing at a dead origin is not a build error —
    // the runtime fetches `remoteEntry.js` lazily, in the browser — so the
    // failure lands exactly where Slice 4's boundary is waiting for it.
    header: { type: 'module', name: 'header', entry: `${HEADER_ORIGIN}/remoteEntry.js` },
    footer: { type: 'module', name: 'footer', entry: `${FOOTER_ORIGIN}/remoteEntry.js` },
    homepage: { type: 'module', name: 'homepage', entry: `${HOMEPAGE_ORIGIN}/remoteEntry.js` },
    'portfolio-item': {
      type: 'module',
      name: 'portfolio-item',
      entry: `${PORTFOLIO_ITEM_ORIGIN}/remoteEntry.js`,
    },
  },
  // D39 — singleton React, `strictVersion: false`, the version pinned once at
  // the workspace root. Slice 8 adds the CI check that every app resolves the
  // same React major; until then this is a relocated guard with its other half
  // still to come.
  //
  // ⚠️ `@portfolio/ui-components` and `@portfolio/ui-theme` are deliberately
  // absent though Slice 3's file list names them — see the note in
  // `apps/header/vite.config.ts` for what each one fails on. Keep the two
  // `shared` blocks identical: a module shared by only one side is not shared,
  // it is duplicated.
  shared: {
    react: { singleton: true, strictVersion: false },
    'react-dom': { singleton: true, strictVersion: false },
  },
  dts: false,
  // ⚠️ **Beyond D55, and required.** The option defaults to `'html'`, which
  // injects the host's init into a static `index.html`. TanStack Start has no
  // such file — it builds the document from `__root.tsx` — so the default
  // falls back to wrapping what the plugin takes to be the entry module, and
  // in dev that is `src/router.tsx`. It gets rewritten into an async bootstrap
  // that re-exports nothing, Start's client entry fails on
  // `does not provide an export named 'getRouter'`, and the app never
  // hydrates: every remote silently stays unmounted because `ClientOnly` never
  // reaches the client.
  //
  // It breaks `vite dev` ONLY. The production build is unaffected, which is
  // why the Slice 3 spike (D55) did not catch it — the spike verified the
  // built Lambda output.
  hostInitInjectLocation: 'entry',
}).map((plugin) => ({
  ...plugin,
  // D55 §1 — ⚠️ **not optional.** Every plugin `federation()` returns
  // hard-codes `applyToEnvironment() { return true; }`. The plugin detects SSR
  // and changes behaviour, but it does NOT skip the server environment: left
  // unscoped it participates in the Lambda build. This override is the single
  // thing keeping federation out of the server bundle.
  applyToEnvironment: (environment: { name: string }) => environment.name === 'client',
}));

export default defineConfig({
  // Pin the project root to this file's directory rather than letting Vite
  // default it to `process.cwd()`. Nx's `@nx/vite` plugin loads this config
  // from the workspace root to infer targets, and TanStack Start resolves its
  // router entry (`src/router.tsx`) relative to the root — so without this it
  // looks in `<workspaceRoot>/src` and graph construction fails.
  root: import.meta.dirname,
  server: { port: 3000 },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    // D31 + D37: the shell is built for AWS Lambda from the first commit rather
    // than retrofitted at Slice 8, and D49 makes that Lambda arm64. The preset
    // is overridable so a `node-server` build stays available for local checks.
    nitro({ preset: process.env.NITRO_PRESET ?? 'aws_lambda' }),
    // react's vite plugin must come after start's vite plugin.
    viteReact(),
    // D55 — the federation plugins come last, after Start, Nitro and React.
    ...mfPlugins,
  ],
});
