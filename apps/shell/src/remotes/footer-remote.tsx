import { ClientOnly } from '@tanstack/react-router';
import type { ReactElement } from 'react';

import { FooterFallback, FooterSkeleton, MfeRemoteMount } from '@portfolio/feature-shell';

import { remoteVersion } from './remote-version.js';

/**
 * Mounts the Footer remote.
 *
 * ⚠️ **Slice 5 builds the remote this points at.** Until then the import fails
 * and the boundary renders `FooterFallback` — which is exactly what a downed
 * Footer does in production, so the seam is observable from the day it is
 * created rather than from the day the remote lands.
 */
const loadFooter = () => import('footer/Footer');

const PLACEHOLDER_CLASS = 'h-nav w-full';

const FooterRemote = (): ReactElement => {
  return (
    <ClientOnly fallback={<div aria-hidden className={PLACEHOLDER_CLASS} />}>
      <MfeRemoteMount
        mfe="footer"
        version={remoteVersion('footer')}
        route="/"
        placeholderClassName={PLACEHOLDER_CLASS}
        loadingSkeleton={<FooterSkeleton />}
        exposedModule="Footer"
        fallback={() => <FooterFallback />}
        onLoadRemote={loadFooter}
      />
    </ClientOnly>
  );
};

export default FooterRemote;
