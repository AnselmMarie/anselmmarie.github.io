import { ClientOnly } from '@tanstack/react-router';
import type { ReactElement } from 'react';

import { ContentSkeleton, HomepageFallback, MfeRemoteMount } from '@portfolio/feature-shell';

import { remoteVersion } from './remote-version.js';

/**
 * Mounts the Homepage remote.
 *
 * ⚠️ **`isHashTarget` is D43's other half.** This is the region that holds the
 * sections the Header's anchors point at, so it is the one — and the only one —
 * that re-applies `location.hash` after the remote commits. A cold link to
 * `/#active-projects` scrolls nowhere without it, silently.
 *
 * ⚠️ **Slice 6 builds the remote this points at**, and owns the section `id`s
 * the hash re-apply looks for. Until then the boundary renders the fallback.
 */
const loadHomepage = () => import('homepage/Homepage');

const HomepageRemote = (): ReactElement => {
  return (
    <ClientOnly fallback={<div aria-hidden className="min-h-96 w-full" />}>
      <MfeRemoteMount
        mfe="homepage"
        version={remoteVersion('homepage')}
        route="/"
        placeholderClassName="min-h-96 w-full"
        loadingSkeleton={<ContentSkeleton />}
        fallback={HomepageFallback}
        isHashTarget
        onLoadRemote={loadHomepage}
      />
    </ClientOnly>
  );
};

export default HomepageRemote;
