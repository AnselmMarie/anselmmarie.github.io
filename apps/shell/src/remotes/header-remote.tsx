import { ClientOnly } from '@tanstack/react-router';
import { lazy, type ReactElement, Suspense } from 'react';

/**
 * Mounts the Header remote (D2 — the shell consumes the remotes; the remotes
 * do not know about each other).
 *
 * ⚠️ **`ClientOnly` is the load-bearing piece, not `lazy` (D55 §3).** Its
 * server branch renders `fallback` instead of `children`, so this
 * `import('header/Header')` subtree is *compiled out of the server chunk*
 * rather than merely never executed. `lazy` + `Suspense` alone defers the
 * import; `ClientOnly` is what removes it — and removing it is what keeps
 * federation out of the Lambda bundle (D8 / D9 / D36: the shell SSRs its own
 * page, the remote hydrates after).
 *
 * ⚠️ **No error boundary yet — that is Slice 4.** Stopping the header's dev
 * server and reloading currently leaves the region empty rather than showing
 * a fallback. That is the expected end state of this slice, not a defect.
 */
const Header = lazy(() => import('header/Header'));

/** Reserves the header's height so the page does not jump when it hydrates. */
const HeaderPlaceholder = (): ReactElement => <div aria-hidden className="h-header w-full" />;

const HeaderRemote = (): ReactElement => {
  return (
    <ClientOnly fallback={<HeaderPlaceholder />}>
      <Suspense fallback={<HeaderPlaceholder />}>
        <Header />
      </Suspense>
    </ClientOnly>
  );
};

export default HeaderRemote;
