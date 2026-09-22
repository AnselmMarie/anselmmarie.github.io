import { remoteEntryFor } from '@portfolio/shared-config';
import type { RemoteName } from '@portfolio/shared-types';

/**
 * The deployment identifier the shell is pointing at for a remote, for the
 * diagnostic payload (the architecture doc's *Error Reporting*).
 *
 * `unknown` rather than a throw for a remote with no registry row: a missing
 * entry is a *reason to render the fallback*, not a reason to take the page
 * down — which would be the shell crashing over a remote being absent, the
 * exact thing D16 exists to prevent.
 */
export const remoteVersion = (name: RemoteName): string =>
  remoteEntryFor(name)?.version ?? 'unknown';
