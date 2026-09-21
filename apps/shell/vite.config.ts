import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

export default defineConfig({
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
