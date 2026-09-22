import { ClientOnly } from '@tanstack/react-router';
import type { ReactElement } from 'react';

import { MfeRemoteMount, PortfolioItemFallback } from '@portfolio/feature-shell';
import type { PortfolioItem } from '@portfolio/shared-types';

import { remoteVersion } from './remote-version.js';

/** What the remote's exposed `PortfolioItem` component accepts. */
interface PortfolioItemRemoteProps {
  /** The resolved slug, so the diagnostic payload names the real route. */
  slug: string;
  /**
   * The resolved item (D4 / D15) — the route looks it up, this forwards it.
   *
   * ⚠️ **The route never reaches the remote when this is `undefined`**: an
   * unresolved slug renders `PortfolioNotFound` in the route, one level up
   * (D66). So it arrives defined in practice, and is optional only because the
   * remote's own standalone preview on 4177 has no host to supply it.
   */
  item?: PortfolioItem;
}

/**
 * Mounts the Portfolio Item remote, the only one behind a dynamic route (D4 —
 * routing belongs to the shell; the remote receives the resolved item, never
 * the raw params).
 *
 * ✅ **Slice 7 built the remote this points at** (2026-09-21). When it is down
 * the boundary renders `PortfolioItemFallback`, the one fallback with somewhere
 * to send the visitor.
 */
const loadPortfolioItem = () => import('portfolio-item/PortfolioItem');

const PortfolioItemRemote = ({ slug, item }: PortfolioItemRemoteProps): ReactElement => {
  return (
    <ClientOnly fallback={<div aria-hidden className="min-h-96 w-full" />}>
      <MfeRemoteMount
        mfe="portfolio-item"
        version={remoteVersion('portfolio-item')}
        route={`/portfolio/${slug}`}
        placeholderClassName="min-h-96 w-full"
        remoteProps={{ item }}
        fallback={PortfolioItemFallback}
        onLoadRemote={loadPortfolioItem}
      />
    </ClientOnly>
  );
};

export default PortfolioItemRemote;
