import { useEffect } from 'react';

/**
 * Re-applies `location.hash` once the remote it is mounted beside has resolved
 * (D43).
 *
 * ⚠️ **This exists because the browser only tries once.** A cold load of
 * `/#active-projects` hits a document whose sections do not exist yet — the
 * Homepage is a separate remote that mounts after hydration (D36). The browser
 * looks for `#active-projects`, finds nothing, and never looks again. Nothing
 * errors; the page simply sits at the top, which reads as a broken link.
 *
 * ⚠️ **It lives in the shell, not in the Homepage remote.** D43 names the shell
 * as the layer that knows, because the shell is what wraps each remote and is
 * therefore the only place that can tell a remote has finished mounting.
 * Slice 6 owns the section `id`s and their `scroll-margin-top`; this is the
 * other half, and the two only work as a pair.
 *
 * Readiness is expressed structurally rather than by a flag: the component
 * that calls this hook sits inside the same `Suspense` boundary as the remote,
 * so it commits when — and only when — the remote's content is on the page.
 */
export const useHashReapply = (): void => {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const { hash } = window.location;

    if (!hash || hash === '#') {
      return;
    }

    // The remote commits during this render; the element exists by the time an
    // effect runs, but its layout may not have settled. A frame's delay is the
    // difference between scrolling to the right place and scrolling to where
    // the element sat before its images reserved their space.
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);
};
