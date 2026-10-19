import type { RouteMetadata } from '@portfolio/shared-types';

import { PORTFOLIO_ITEM_METADATA } from './portfolio-route-metadata.fixture.js';

/**
 * The per-route metadata the shell emits server-side (D48).
 *
 * ⚠️ **"Fixture" is the slot's name, not a claim about the copy.** Per D41 the
 * fixtures carry the site's real published content — this is the actual title
 * and description, not lorem ipsum, and the MVP is publishable with it. The
 * Contentful plan moves this module; it does not delete it as placeholder.
 *
 * Slice 1 supplies the home route only. Slices 6 and 7 add their own routes'
 * entries alongside it.
 */
export const SITE_NAME = 'Anselm Marie';

export const HOME_METADATA: RouteMetadata = {
  title: 'Anselm Marie — Senior Software Engineer & Tech Lead',
  description: `Senior software engineer and tech lead, founder of Cosmikata. I build design systems, micro-frontend platforms, and edge-first backends.`,
  path: '/',
};

/**
 * ⚠️ Slice 7's rows live in `portfolio-route-metadata.fixture.ts`, not inline —
 * `HOME_METADATA` above is Slice 6's copy and this module is co-owned, so the
 * per-slug copy is kept in a module of its own that only Slice 7 opens.
 */
const BY_PATH: ReadonlyMap<string, RouteMetadata> = new Map([
  ['/', HOME_METADATA],
  ...PORTFOLIO_ITEM_METADATA.map(
    (metadata): readonly [string, RouteMetadata] => [metadata.path, metadata] as const
  ),
]);

/**
 * Looks metadata up by route path. Returns `undefined` for a path with no
 * entry, so the caller decides the fallback rather than this module inventing
 * one — the shell's root route supplies the site-wide default.
 */
export const metadataForPath = (path: string): RouteMetadata | undefined => BY_PATH.get(path);
