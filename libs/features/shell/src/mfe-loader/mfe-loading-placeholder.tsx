import { type ReactElement, type ReactNode, useEffect } from 'react';

interface MfeLoadingPlaceholderProps {
  /** Reserves the region's height so the page does not jump when it hydrates. */
  className?: string;
  /** The region's skeleton, shown for as long as the `lazy()` import is pending. */
  children?: ReactNode;
  /** How long a pending import may hang before it is treated as a failure. */
  timeoutMs: number;
  onTimeout: () => void;
}

/**
 * What a region shows while its remote is still in flight — and the timeout
 * that stops it showing forever (R7).
 *
 * ⚠️ **The timer lives here rather than in the mount, and that is the whole
 * trick.** This component is Suspense's fallback, so it exists for exactly as
 * long as the import is pending: mounting starts the clock and resolving
 * unmounts it, which clears the clock without anyone having to observe the
 * promise. An import that neither resolves nor rejects is the one failure that
 * looks like success — a spinner is indistinguishable from a slow network —
 * and this is what converts it into the same fallback every other failure ends
 * at.
 */
const MfeLoadingPlaceholder = ({
  className,
  children,
  timeoutMs,
  onTimeout,
}: MfeLoadingPlaceholderProps): ReactElement => {
  useEffect(() => {
    const timer = setTimeout(onTimeout, timeoutMs);

    return () => clearTimeout(timer);
  }, [timeoutMs, onTimeout]);

  return (
    <div aria-hidden data-testid="mfe-loading" className={className}>
      {children}
    </div>
  );
};

export default MfeLoadingPlaceholder;
