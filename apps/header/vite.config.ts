import { federation } from '@module-federation/vite';
import tailwindcss from '@tailwindcss/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * The Header remote's build (D1 — a standalone React + Vite app, not a
 * TanStack Start app; only the shell is one).
 *
 * D27 keeps this file a skeleton: the remote's entire public surface is the
 * one `exposes` line below, and every component it names lives in
 * `@portfolio/feature-header`.
 */

/** The dev port. `strictPort` so a silent reassignment cannot make the shell's
 * registry entry point at nothing (D55 §4). */
const DEV_PORT = 4174;

/**
 * ⚠️ **D42, and the one line here that is invisible on localhost.**
 *
 * `base` must be the origin this remote is *served from*, not the page's. A
 * relative asset URL in a federated chunk resolves against the shell's origin,
 * which is identical to the remote's in local dev and wrong the moment the two
 * sit behind different CloudFront distributions. Every component-owned asset
 * in this remote breaks in production and nowhere else.
 *
 * Slice 8 supplies the deployed value; the fallback is this dev server.
 */
const REMOTE_ORIGIN = process.env.PORTFOLIO_HEADER_ORIGIN ?? `http://localhost:${DEV_PORT}`;

export default defineConfig(({ command }) => ({
  root: import.meta.dirname,
  base: `${REMOTE_ORIGIN}/`,
  server: { port: DEV_PORT, strictPort: true, cors: true },
  preview: { port: DEV_PORT, strictPort: true, cors: true },
  // D55 §4 — the federation runtime emits ESM; an older target downlevels the
  // top-level await the shared-module init depends on.
  build: { target: 'esnext' },
  /**
   * ⚠️ **Not a performance flag — the standalone dev server does not work
   * without it.**
   *
   * `@module-federation/vite` learns which shared packages this app actually
   * uses from the esbuild pass that pre-bundles dependencies: that scan is the
   * only thing in dev that marks `react-dom` used, and the generated
   * `hostAutoInit` module publishes exactly the marked packages into the share
   * scope before the entry runs.
   *
   * On a WARM `node_modules/.vite` cache Vite skips that scan, so `react-dom`
   * and `react-dom/client` are never marked. `hostAutoInit` skips them, the
   * `loadShare` virtual module's re-exports stay `undefined`, and
   * `react-dom/client` dies reading `ReactDOMSharedInternals.d` off nothing:
   * `Cannot read properties of undefined (reading 'd')`, on a blank page. Only
   * `react` and `react/jsx-dev-runtime` survive, on the automatic-JSX-runtime
   * code path.
   *
   * What makes it confusing: the FIRST run after anything busts the dep cache
   * re-optimises, so the scan runs and the remote works. Every restart after
   * that fails. Forcing the scan makes `vite dev` behave the same every time.
   *
   * Scoped to `serve` — the production build never reads a warm dev cache.
   * Remove it if @module-federation/vite starts registering its shares from the
   * dev transform as well (still open as of 1.22.1).
   */
  optimizeDeps: { force: command === 'serve' },
  plugins: [
    tailwindcss(),
    federation({
      name: 'header',
      filename: 'remoteEntry.js',
      // D27 — the remote's public surface, in one line. `./Header` is the
      // module specifier the shell's registry entry names.
      exposes: { './Header': '@portfolio/feature-header' },
      // D39 — React is a singleton with `strictVersion: false`: the version is
      // pinned once at the workspace root, and Slice 8's CI asserts every app
      // resolves the same major. Without that check this is a disabled guard
      // rather than a relocated one.
      //
      // ⚠️ **Slice 3's file list names two more shared entries than are here,
      // and neither can be one.** Both were tried and removed:
      //
      // - `@portfolio/ui-theme` is CSS-only (its sole export is `theme.css`).
      //   There is no JS module for the federation runtime to share.
      // - `@portfolio/ui-components` is unbuilt TypeScript source. Declaring it
      //   shared puts it in the host's `optimizeDeps.include`, where Vite
      //   cannot resolve it — `Failed to resolve dependency:
      //   @portfolio/ui-components` — and the failed pre-bundle cascades into
      //   the host's client entry. Sharing it needs a build step on the lib
      //   first, which no slice has scheduled.
      //
      // Both are shared at BUILD time instead: each app compiles its own copy
      // from the same source, and the theme they agree on is D26's single
      // stylesheet. That is what lets the Header and the Homepage agree on the
      // header-height token (D43) without crossing the federation boundary.
      shared: {
        react: { singleton: true, strictVersion: false },
        'react-dom': { singleton: true, strictVersion: false },
      },
      // D55 §5 — the dts sub-plugin reads a root tsconfig.json on startup and
      // crashes the dev server without one. This app ships that tsconfig; the
      // flag is belt-and-braces, and it keeps the remote's build fast.
      dts: false,
    }),
    viteReact(),
  ],
}));
