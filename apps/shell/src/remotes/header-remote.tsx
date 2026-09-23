import { ClientOnly } from '@tanstack/react-router';
import type { ReactElement } from 'react';

import { HeaderFallback, HeaderSkeleton, MfeRemoteMount } from '@portfolio/feature-shell';

import { remoteVersion } from './remote-version.js';

/**
 * Which bar the Header draws. Mirrors `HeaderVariant` in
 * `@portfolio/feature-header` — ⚠️ **declared rather than imported, because
 * `@nx/enforce-module-boundaries` stops the shell reaching into a remote's
 * package** (D16: the host never depends on the remote it mounts). The two
 * exports disagree about the bar and both are right, so this really is two
 * shapes and not a flag.
 */
type HeaderRemoteVariant = 'home' | 'detail';

interface HeaderRemoteProps {
  /**
   * ⚠️ **Passed per route, never inferred.** The remote cannot work this out:
   * it hydrates client-side and the host route is the only thing that knows
   * which page it is. A detail page that forgets this renders five anchors
   * pointing at homepage sections that are not on it — they scroll nowhere and
   * nothing throws, which is why `mfe-remote-mount-props.spec.tsx` asserts the
   * value arrives through the mount rather than testing the Header alone.
   */
  variant: HeaderRemoteVariant;
}

/**
 * Mounts the Header remote (D2 — the shell consumes the remotes; the remotes
 * do not know about each other).
 *
 * ⚠️ **`ClientOnly` is the load-bearing piece, not `lazy` (D55 §3).** Its
 * server branch renders `fallback` instead of `children`, so the
 * `import('header/Header')` below never runs during SSR — which is what keeps
 * federation out of the Lambda bundle (D8 / D9 / D36: the shell SSRs its own
 * page, the remote hydrates after).
 *
 * ⚠️ **`loadHeader` is a module-level const, not an inline arrow**, because
 * `MfeRemoteMount` memoizes `lazy()` on it. An inline arrow is a new identity
 * every render, which would rebuild the lazy component every render and
 * re-import the remote forever.
 */
const loadHeader = () => import('header/Header');

/** Reserves the header's height so the page does not jump when it hydrates. */
const PLACEHOLDER_CLASS = 'h-nav w-full';

const HeaderRemote = ({ variant }: HeaderRemoteProps): ReactElement => {
  return (
    <ClientOnly fallback={<div aria-hidden className={PLACEHOLDER_CLASS} />}>
      <MfeRemoteMount
        mfe="header"
        version={remoteVersion('header')}
        route={variant === 'detail' ? '/portfolio/$slug' : '/'}
        placeholderClassName={PLACEHOLDER_CLASS}
        loadingSkeleton={<HeaderSkeleton />}
        remoteProps={{ variant }}
        fallback={() => <HeaderFallback />}
        onLoadRemote={loadHeader}
      />
    </ClientOnly>
  );
};

export default HeaderRemote;
