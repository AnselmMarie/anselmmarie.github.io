import { federation } from '@module-federation/vite';
import tailwindcss from '@tailwindcss/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * The PortfolioItem remote's build (D1 — a standalone React + Vite app, not a
 * TanStack Start app; only the shell is one).
 *
 * ⚠️ **Scaffolded by Slice 4, built from `apps/header/vite.config.ts` and
 * D55 rather than from scratch** — the `type: 'module'` remote form and the
 * client-environment scoping were each found by failing first, and this file
 * inherits them. Slice 7 owns what this remote *renders*; the wiring here is
 * already correct and should not need rewriting.
 *
 * D27 keeps this file a skeleton: the remote's entire public surface is the one
 * `exposes` line below, and every component it names lives in
 * `@portfolio/feature-portfolio-item`.
 */

/** The dev port. `strictPort` so a silent reassignment cannot make the shell's
 * registry entry point at nothing (D55 §4). Must match
 * `DEFAULT_PORTFOLIO_ITEM_ORIGIN` in `@portfolio/shared-config`. */
const DEV_PORT = 4177;

/**
 * ⚠️ **D42, and the one line here that is invisible on localhost.**
 *
 * `base` must be the origin this remote is *served from*, not the page's. A
 * relative asset URL in a federated chunk resolves against the shell's origin,
 * which is identical to the remote's in local dev and wrong the moment the two
 * sit behind different CloudFront distributions.
 *
 * Slice 8 supplies the deployed value; the fallback is this dev server.
 */
const REMOTE_ORIGIN = process.env.PORTFOLIO_PORTFOLIO_ITEM_ORIGIN ?? `http://localhost:${DEV_PORT}`;

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
      name: 'portfolio-item',
      filename: 'remoteEntry.js',
      // D27 — the remote's public surface, in one line. `./PortfolioItem` is the
      // module specifier the shell's registry entry names.
      exposes: { './PortfolioItem': '@portfolio/feature-portfolio-item' },
      // D39 / D60 — React is a singleton with `strictVersion: false`, and the
      // `@portfolio/ui-*` packages are deliberately NOT shared here. Keep this
      // block identical to the shell's: a module shared by only one side is not
      // shared, it is duplicated.
      shared: {
        react: { singleton: true, strictVersion: false },
        'react-dom': { singleton: true, strictVersion: false },
      },
      // D55 §5 — the dts sub-plugin reads a root tsconfig.json on startup and
      // crashes the dev server without one.
      dts: false,
    }),
    viteReact(),
  ],
}));
