import {
  type ComponentType,
  lazy,
  type ReactElement,
  type ReactNode,
  Suspense,
  useCallback,
  useMemo,
  useState,
} from 'react';

import type { RemoteName } from '@portfolio/shared-types';

import { buildMfeDiagnostics, logMfeFailure } from '../mfe-error-boundary/mfe-diagnostics.js';
import MfeErrorBoundary from '../mfe-error-boundary/mfe-error-boundary.js';
import { MAX_MFE_RETRIES, type MfeFallbackProps } from '../mfe-error-boundary/mfe-failure.js';
import MfeHashReapply from './mfe-hash-reapply.js';
import MfeLoadingPlaceholder from './mfe-loading-placeholder.js';
import { reloadRemote } from './reload-remote.js';

/** How long a pending import may hang before it is treated as a failure (R7). */
export const REMOTE_LOAD_TIMEOUT_MS = 10_000;

interface MfeRemoteMountProps<TRemoteProps extends object = Record<string, never>> {
  mfe: RemoteName;
  /** The remote's deployment identifier, for the diagnostic payload. */
  version: string;
  route: string;
  maxRetries?: number;
  timeoutMs?: number;
  /** Reserves the region's height while the remote is in flight. */
  placeholderClassName?: string;
  /** What the region draws while the `lazy()` import is pending — a region skeleton. */
  loadingSkeleton?: ReactNode;
  /**
   * Props handed to the remote component itself (D73).
   *
   * ⚠️ **Without this the mount renders `<RemoteComponent />` bare**, which is
   * what it did until 2026-09-21 — correct for Header, Footer and Homepage,
   * which take no props, and silently wrong for Portfolio Item, which needs the
   * resolved item (D4 / D15). The symptom was the worst kind: `/portfolio/<slug>`
   * drew the remote's standalone preview item while the server-rendered `<head>`
   * described the slug that was actually asked for.
   *
   * It is a plain data prop, not a callback, so it carries no `on` prefix and
   * sits in the data tier.
   */
  remoteProps?: TRemoteProps;
  /**
   * The remote's exposed module, without `./` (`Homepage`), so a retry can load
   * it through the federation host instead of `onLoadRemote` (Q23). A failed
   * `onLoadRemote` can never succeed again on the same page; see
   * `reload-remote.ts`. Without it, a retry re-runs `onLoadRemote` and only
   * recovers from a render failure, never a load failure.
   */
  exposedModule?: string;
  /** Shell-owned, never federated (D16). Returns an element, so no `on` prefix. */
  fallback: (props: MfeFallbackProps) => ReactElement;
  /** Whether this region is the one a `location.hash` can point into (D43). */
  isHashTarget?: boolean;
  /**
   * Imports the remote's module.
   *
   * ⚠️ **Must be a stable reference** — a module-level `const`, never an inline
   * arrow. It is a `useMemo` dependency, so a new identity on every render
   * produces a new `lazy` component on every render, and the remote re-imports
   * forever.
   *
   * It returns a `Promise` of a module rather than an element, which is what
   * puts it in the `on*` tier under prop-naming-and-order.md despite reading
   * like a loader.
   */
  onLoadRemote: () => Promise<{ default: ComponentType<TRemoteProps> }>;
}

/**
 * One remote, mounted with everything that has to be true around it: a
 * boundary, a loading state, a hang timeout, a bounded retry, and D43's hash
 * re-apply.
 *
 * ⚠️ **The attempt counter lives here rather than in the boundary**, because a
 * retry that works has to produce a *new* `lazy` component. `React.lazy` caches
 * the rejected promise from a failed import, so clearing the boundary's error
 * in place re-serves the same rejection and the fallback reappears instantly —
 * a button that looks like it works and does not. Bumping `attempt` rebuilds
 * the `lazy` and remounts the boundary by key, which is also how the boundary
 * satisfies the architecture doc's *"reset its error state when the MFE is
 * successfully retried"*.
 */
const MfeRemoteMount = <TRemoteProps extends object = Record<string, never>>({
  mfe,
  version,
  route,
  maxRetries = MAX_MFE_RETRIES,
  timeoutMs = REMOTE_LOAD_TIMEOUT_MS,
  placeholderClassName,
  loadingSkeleton,
  remoteProps,
  exposedModule,
  fallback,
  isHashTarget = false,
  onLoadRemote,
}: MfeRemoteMountProps<TRemoteProps>): ReactElement => {
  const [attempt, setAttempt] = useState(0);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  const attemptsRemaining = Math.max(0, maxRetries - attempt);

  const RemoteComponent = useMemo(
    () =>
      lazy(() => {
        // A retry reloads through the host (Q23). The first attempt, and any
        // render without a federation host, use the import as before.
        const reloaded =
          attempt > 0 && exposedModule
            ? reloadRemote<{ default: ComponentType<TRemoteProps> }>(mfe, exposedModule, attempt)
            : null;
        return reloaded ?? onLoadRemote();
      }),
    // `attempt` is the point of the memo: a new attempt must build a new lazy
    // component, or the cached rejection is served again.
    [attempt, exposedModule, mfe, onLoadRemote]
  );

  const handleRetry = useCallback(() => {
    setHasTimedOut(false);
    setAttempt((previous) => previous + 1);
  }, []);

  const handleTimeout = useCallback(() => {
    logMfeFailure(
      buildMfeDiagnostics({
        mfe,
        version,
        route,
        kind: 'timeout',
        error: new Error(`${mfe} did not load within ${timeoutMs}ms`),
      })
    );
    setHasTimedOut(true);
  }, [mfe, version, route, timeoutMs]);

  // A hang never reaches the boundary — the import simply never settles — so
  // the timeout routes it to the same fallback by hand.
  if (hasTimedOut) {
    return fallback({ mfe, kind: 'timeout', attemptsRemaining, onRetry: handleRetry });
  }

  return (
    <MfeErrorBoundary
      key={attempt}
      mfe={mfe}
      version={version}
      route={route}
      attemptsRemaining={attemptsRemaining}
      fallback={fallback}
      onRetry={handleRetry}
    >
      <Suspense
        fallback={
          <MfeLoadingPlaceholder
            className={placeholderClassName}
            timeoutMs={timeoutMs}
            onTimeout={handleTimeout}
          >
            {loadingSkeleton}
          </MfeLoadingPlaceholder>
        }
      >
        <RemoteComponent {...((remoteProps ?? {}) as TRemoteProps)} />
        {isHashTarget ? <MfeHashReapply /> : null}
      </Suspense>
    </MfeErrorBoundary>
  );
};

export default MfeRemoteMount;
