import type { ReactElement, ReactNode } from 'react';

import type { RemoteName } from '@portfolio/shared-types';

interface MfeFallbackNoticeProps {
  /** Names the failing remote in `data-testid`, so specs and E2E can find it. */
  mfe: RemoteName;
  title: string;
  message: string;
  /** Zero means the retry action is replaced by the exhausted message. */
  attemptsRemaining: number;
  /** Extra actions beside the retry — Slice 7's "back to the portfolio". */
  children?: ReactNode;
  onRetry: () => void;
}

/**
 * The one piece of markup every page-level fallback shares.
 *
 * ⚠️ **Invented — neither design export has a reference.** D76 makes the two
 * exports the design of record, but a static design has no remote to fail.
 * Every visual choice here is ours: the bordered card, the muted body copy,
 * the single outlined pill. Flagged per plan-design-links.md.
 *
 * Slice 10 re-skinned it onto the new palette — `PanelCard`'s treatment and
 * `PillLink`'s outline shape, written out rather than imported: this renders
 * *because something failed*, and reaching across a package boundary here adds
 * a moving part to the one component that has to survive.
 *
 * ⚠️ **It imports no remote, and must not start.** Not transitively either —
 * `@nx/enforce-module-boundaries` blocks `scope:shell` from reaching
 * `scope:header`, which is the structural half of D16's rule.
 */
const MfeFallbackNotice = ({
  mfe,
  title,
  message,
  attemptsRemaining,
  children,
  onRetry,
}: MfeFallbackNoticeProps): ReactElement => {
  return (
    <div
      data-testid={`mfe-fallback-${mfe}`}
      role="status"
      className="mx-auto my-10 flex max-w-xl frame:my-16 flex-col items-start gap-3 rounded-panel border border-rule bg-surface p-6"
    >
      <h2 className="font-display text-xl font-bold tracking-tight text-ink">{title}</h2>
      <p className="text-sm leading-relaxed text-muted">{message}</p>

      <div className="flex items-center gap-3">
        {attemptsRemaining > 0 ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-pill border border-rule px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface-sunk"
          >
            Try again
          </button>
        ) : (
          // The architecture doc asks for the bound to be visible, not only
          // enforced: after the last attempt the button goes away rather than
          // staying and quietly doing nothing.
          <p data-testid={`mfe-retry-exhausted-${mfe}`} className="text-sm text-muted">
            We have stopped retrying. Reload the page to try again.
          </p>
        )}
        {children}
      </div>
    </div>
  );
};

export default MfeFallbackNotice;
