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
 * ⚠️ **Invented — there is no v3 reference.** D34 makes the live v3 site the
 * design source for every surface, but a site with no remotes has no
 * remote-failure UI. Every visual choice here is ours: the bordered card, the
 * muted body copy, the single outlined button. Flagged per plan-design-links.md.
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
      className="mx-auto flex max-w-xl flex-col items-start gap-3 rounded-lg border border-slate-200 p-6"
    >
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="text-sm text-slate-500">{message}</p>

      <div className="flex items-center gap-3">
        {attemptsRemaining > 0 ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-ink"
          >
            Try again
          </button>
        ) : (
          // The architecture doc asks for the bound to be visible, not only
          // enforced: after the last attempt the button goes away rather than
          // staying and quietly doing nothing.
          <p data-testid={`mfe-retry-exhausted-${mfe}`} className="text-sm text-slate-500">
            We have stopped retrying. Reload the page to try again.
          </p>
        )}
        {children}
      </div>
    </div>
  );
};

export default MfeFallbackNotice;
