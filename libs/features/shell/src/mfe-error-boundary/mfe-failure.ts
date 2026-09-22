import type { RemoteName } from '@portfolio/shared-types';

/**
 * The three ways a remote fails to end up on the page, kept apart because they
 * arrive through different paths (the architecture doc's *Loading and Runtime
 * Failures* section).
 *
 * - `render` — the remote loaded and threw while rendering. React's error
 *   boundary catches this one.
 * - `load` — `remoteEntry.js` or a remote chunk never arrived. This never
 *   reaches an error boundary on its own; the loader routes it there.
 * - `timeout` — the import neither resolved nor rejected. R7. Without this the
 *   page sits on a spinner forever, which is the one failure mode that looks
 *   like success.
 *
 * All three end at the same fallback. They are distinguished so the diagnostic
 * payload says which happened, not so the user sees three different screens.
 */
export type MfeFailureKind = 'render' | 'load' | 'timeout';

/**
 * What every fallback is handed. Fallbacks are shell-owned and never federated
 * (D16), so this contract is the only thing they share with the remote that
 * failed — deliberately: a fallback that imported the remote could fail for the
 * same reason the remote did.
 */
export interface MfeFallbackProps {
  /** Which remote is down. */
  readonly mfe: RemoteName;
  /** How it failed, for copy that can honestly differ between load and render. */
  readonly kind: MfeFailureKind;
  /**
   * Retries left before the boundary stops offering one. Zero means the UI
   * must say so rather than keep showing a button that does nothing — the
   * architecture doc's *Retry Behavior*, in the UI and not only in code.
   */
  readonly attemptsRemaining: number;
  onRetry: () => void;
}

/**
 * How many user-triggered retries a remote gets before the fallback stops
 * offering one. Bounded, per the architecture doc: *"Do not implement infinite
 * automatic retries."* Nothing retries on its own here — every attempt is a
 * click — and this caps even those.
 */
export const MAX_MFE_RETRIES = 2;
