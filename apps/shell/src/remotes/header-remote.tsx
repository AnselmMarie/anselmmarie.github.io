import { ClientOnly } from '@tanstack/react-router';
import type { ReactElement } from 'react';

import { HeaderFallback, MfeRemoteMount } from '@portfolio/feature-shell';

import { remoteVersion } from './remote-version.js';

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

const HeaderRemote = (): ReactElement => {
  return (
    <ClientOnly fallback={<div aria-hidden className={PLACEHOLDER_CLASS} />}>
      <MfeRemoteMount
        mfe="header"
        version={remoteVersion('header')}
        route="/"
        placeholderClassName={PLACEHOLDER_CLASS}
        fallback={() => <HeaderFallback />}
        onLoadRemote={loadHeader}
      />
    </ClientOnly>
  );
};

export default HeaderRemote;
