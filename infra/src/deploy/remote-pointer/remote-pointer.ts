import { VERSION_PATTERN } from '../../site-config/site-config.js';

/**
 * The pointer module served at `_remotes/<remote>/remoteEntry.js` (D107).
 *
 * ⚠️ **Why it re-exports rather than being a copy of the entry:** a built
 * `remoteEntry.js` imports its chunks by relative path (`./assets/…`), so a copy
 * at the stable path would resolve every chunk against the wrong directory. This
 * module imports the real entry *relative to itself*, so the entry keeps its own
 * URL and its chunks resolve where they were uploaded.
 *
 * `get` and `init` are the only two exports `@module-federation/vite` gives an
 * entry (checked 2026-09-25). If the plugin ever adds one, the federation
 * runtime will not see it through this pointer; the E2E run of the deployed
 * site is what catches that.
 *
 * The query string is forwarded, so D106's `?mf-retry=<n>` gives the versioned
 * entry a fresh URL too, and a failed fetch of it is retried rather than
 * replayed from the browser's module map.
 */
export const pointerSource = (version: string): string => {
  assertVersion(version);
  return [
    `// D107 pointer: rewritten by every deploy and rollback. Version ${version}.`,
    `const entry = await import(\`./${version}/remoteEntry.js\${new URL(import.meta.url).search}\`);`,
    'export const get = entry.get;',
    'export const init = entry.init;',
    '',
  ].join('\n');
};

/** Reads back which version a pointer names, or `null` if the text is not a pointer. */
export const versionFromPointer = (source: string): string | null => {
  const match = /import\(`\.\/([0-9a-f]{12})\/remoteEntry\.js/.exec(source);
  return match?.[1] ?? null;
};

export const assertVersion = (version: string): void => {
  if (!VERSION_PATTERN.test(version)) {
    throw new Error(`"${version}" is not a version: expected 12 lowercase hex characters.`);
  }
};

/** A commit SHA's first 12 characters, which is what a version is. */
export const versionFromSha = (sha: string): string => {
  const version = sha.trim().toLowerCase().slice(0, 12);
  assertVersion(version);
  return version;
};
