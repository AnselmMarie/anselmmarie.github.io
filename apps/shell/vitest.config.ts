import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

/**
 * ⚠️ **The four federated specifiers have to resolve at transform time.**
 * Module Federation resolves them at runtime from `REMOTE_REGISTRY`, and Vite
 * does not know that — it fails the importing file outright, before `vi.mock`
 * gets a chance. Aliasing them to one stub is what makes any spec in this app
 * loadable at all. See `src/test-stubs/federated-module.tsx`.
 */
const federatedStub = fileURLToPath(
  new URL('./src/test-stubs/federated-module.tsx', import.meta.url)
);

export default defineConfig({
  resolve: {
    alias: {
      'header/Header': federatedStub,
      'footer/Footer': federatedStub,
      'homepage/Homepage': federatedStub,
      'portfolio-item/PortfolioItem': federatedStub,
    },
  },
  test: {
    // The inferred Nx target runs a bare `vitest`, which watches unless CI
    // is set. The config is the source of truth for inferred targets, so the
    // single-run behaviour lives here rather than in a CLI flag.
    watch: false,
    passWithNoTests: true,
    globals: true,
    // ⚠️ **`jsdom`, not `node`, since Slice 12.** The app skeletons carried no
    // specs at all (D27 puts the logic in the feature libs), so `node` was
    // enough. `header-remote.tsx` is the exception the split did not
    // anticipate: it *builds* the props a remote receives, and
    // spec-through-the-parent.md is explicit that a prop asserted only inside
    // the child is asserted by a spec playing the part of the parent.
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.spec.{ts,tsx}'],
  },
});
