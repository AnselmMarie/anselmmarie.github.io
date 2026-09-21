import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // The inferred Nx target runs a bare `vitest`, which watches unless CI
    // is set. The config is the source of truth for inferred targets, so the
    // single-run behaviour lives here rather than in a CLI flag.
    watch: false,
    passWithNoTests: true,
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.{ts,tsx}'],
  },
});
