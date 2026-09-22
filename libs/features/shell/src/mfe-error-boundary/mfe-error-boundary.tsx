import { Component, type ErrorInfo, type ReactElement, type ReactNode } from 'react';

import type { RemoteName } from '@portfolio/shared-types';

import { classifyMfeFailure } from './classify-mfe-failure.js';
import { buildMfeDiagnostics, logMfeFailure } from './mfe-diagnostics.js';
import type { MfeFallbackProps } from './mfe-failure.js';

interface MfeErrorBoundaryProps {
  /** Which remote this boundary wraps. One boundary per remote (D16). */
  mfe: RemoteName;
  /** The remote's deployment identifier, for the diagnostic payload. */
  version: string;
  /** The route the failure happened on. */
  route: string;
  /**
   * Retries left, owned by the caller. The boundary displays this number and
   * never decrements it — see the reset note below for why the count cannot
   * live in here.
   */
  attemptsRemaining: number;
  children: ReactNode;
  /**
   * The fallback to render instead of `children`. A render prop rather than an
   * element so the boundary can hand it the retry action and the remaining
   * count — the architecture doc sketches `fallback={<HeaderFallback />}`, and
   * this is that sketch with the retry contract made explicit.
   *
   * It returns an element, so it is a render prop and keeps its descriptive
   * name rather than taking an `on` prefix.
   */
  fallback: (props: MfeFallbackProps) => ReactElement;
  onRetry: () => void;
}

interface MfeErrorBoundaryState {
  error: unknown;
  hasError: boolean;
}

/**
 * The shell's per-remote error boundary (D16, D27).
 *
 * It is a class because `getDerivedStateFromError` and `componentDidCatch` have
 * no hook equivalent — the one place this workspace's arrow-function
 * convention has nothing to express.
 *
 * ⚠️ **It resets by being remounted, not by clearing its own state**, and the
 * retry count lives in its parent for the same reason. `React.lazy` caches the
 * rejected promise from a failed import: clearing the error in place re-renders
 * the identical `lazy` component, React re-serves the same rejection, and the
 * fallback reappears instantly. A retry that works has to produce a *new* lazy
 * component, which only the owner of the import can do — so the owner holds the
 * attempt counter and keys this boundary on it. See `MfeRemoteMount`.
 *
 * ⚠️ **It never renders a federated fallback.** The `fallback` render prop is
 * supplied from `src/fallbacks/`, which imports no remote. A federated fallback
 * can fail for exactly the reason its remote did.
 */
class MfeErrorBoundary extends Component<MfeErrorBoundaryProps, MfeErrorBoundaryState> {
  override state: MfeErrorBoundaryState = { error: null, hasError: false };

  static getDerivedStateFromError(error: unknown): MfeErrorBoundaryState {
    return { error, hasError: true };
  }

  override componentDidCatch(error: unknown, errorInfo: ErrorInfo): void {
    const { mfe, version, route } = this.props;

    logMfeFailure(
      buildMfeDiagnostics({ mfe, version, route, kind: classifyMfeFailure(error), error })
    );

    // The component stack is the one thing the payload shape has no field for,
    // and it is what makes a render failure locatable.
    console.error(`[mfe:${mfe}] component stack`, errorInfo.componentStack);
  }

  override render(): ReactNode {
    const { children, fallback, mfe, attemptsRemaining, onRetry } = this.props;

    if (!this.state.hasError) {
      return children;
    }

    return fallback({
      mfe,
      kind: classifyMfeFailure(this.state.error),
      attemptsRemaining,
      onRetry,
    });
  }
}

export default MfeErrorBoundary;
