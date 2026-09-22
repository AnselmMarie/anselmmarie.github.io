import type { MfeFailureKind } from './mfe-failure.js';

/**
 * Patterns a failed *load* produces, as distinct from a component that threw.
 *
 * ⚠️ **This is a heuristic over error messages, and it is the weakest link in
 * this module.** It exists because both failures reach the boundary through
 * the same door: a rejected `import()` inside `React.lazy` is re-thrown during
 * render, so by the time React hands it over there is nothing structural left
 * to tell the two apart. The strings below are what Vite, the Module
 * Federation runtime and webpack-style chunk loading actually emit.
 *
 * **Getting it wrong is cosmetic, not functional.** Both kinds route to the
 * same fallback (the architecture doc's *Loading and Runtime Failures*); the
 * kind only changes one line of copy and one field in the diagnostic payload.
 * So a miss degrades a log entry — it never strands the user.
 */
const LOAD_FAILURE_PATTERNS: readonly RegExp[] = [
  /failed to fetch dynamically imported module/i,
  /error loading remote/i,
  /loading chunk \S+ failed/i,
  /chunkloaderror/i,
  /remoteentry/i,
  /failed to load script/i,
  /importing a module script failed/i,
];

export const classifyMfeFailure = (error: unknown): MfeFailureKind => {
  const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);

  return LOAD_FAILURE_PATTERNS.some((pattern) => pattern.test(message)) ? 'load' : 'render';
};
