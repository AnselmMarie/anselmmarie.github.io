/**
 * The four independently deployed remotes (D2, D12). The union is the single
 * place a remote's identity is spelled, so the registry, the error boundary's
 * fallback map (Slice 4) and each app's Module Federation config cannot drift
 * apart by a typo.
 */
export type RemoteName = 'header' | 'footer' | 'homepage' | 'portfolio-item';

/**
 * One remote's runtime resolution. The URL is read at runtime rather than
 * baked into the shell's bundle — that property is what D12 (an MFE deploys
 * without rebuilding the application) depends on, so it is a value here and
 * never an import.
 */
export interface RemoteEntry {
  /** The remote's name inside the Module Federation runtime. */
  readonly name: RemoteName;
  /** Absolute URL of the remote's `remoteEntry.js`. */
  readonly entryUrl: string;
  /** The module the shell mounts, as the remote's `exposes` map names it. */
  readonly exposedModule: string;
}

/**
 * ⚠️ **Partial on purpose.** The registry is filled one remote at a time — the
 * Header at Slice 3, the other three across Slices 5 to 7 — so between here and
 * Slice 7 a lookup legitimately returns `undefined`. Typing it as a total
 * `Record` would make the compiler promise entries that do not exist yet and
 * push the failure to runtime, in the browser.
 *
 * A missing entry is not an error state to be avoided; it is the same state as
 * a remote that failed to load, which is what Slice 4's boundary already has to
 * render a fallback for (D16).
 */
export type RemoteRegistry = Readonly<Partial<Record<RemoteName, RemoteEntry>>>;
