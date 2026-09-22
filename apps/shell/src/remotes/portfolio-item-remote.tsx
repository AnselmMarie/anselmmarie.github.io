import { ClientOnly } from '@tanstack/react-router';
import type { ReactElement } from 'react';

import { MfeRemoteMount, PortfolioItemFallback } from '@portfolio/feature-shell';

import { remoteVersion } from './remote-version.js';

interface PortfolioItemRemoteProps {
  /** The resolved slug, so the diagnostic payload names the real route. */
  slug: string;
}

/**
 * Mounts the Portfolio Item remote, the only one behind a dynamic route (D4 —
 * routing belongs to the shell; the remote receives the resolved item, never
 * the raw params).
 *
 * ⚠️ **Slice 7 builds the remote this points at.** Until then the boundary
 * renders `PortfolioItemFallback`, which is the one fallback with somewhere to
 * send the visitor.
 */
const loadPortfolioItem = () => import('portfolio-item/PortfolioItem');

const PortfolioItemRemote = ({ slug }: PortfolioItemRemoteProps): ReactElement => {
  return (
    <ClientOnly fallback={<div aria-hidden className="min-h-96 w-full" />}>
      <MfeRemoteMount
        mfe="portfolio-item"
        version={remoteVersion('portfolio-item')}
        route={`/portfolio/${slug}`}
        placeholderClassName="min-h-96 w-full"
        fallback={PortfolioItemFallback}
        onLoadRemote={loadPortfolioItem}
      />
    </ClientOnly>
  );
};

export default PortfolioItemRemote;
