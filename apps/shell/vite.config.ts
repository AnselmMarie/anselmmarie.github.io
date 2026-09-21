import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

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
  ],
});
