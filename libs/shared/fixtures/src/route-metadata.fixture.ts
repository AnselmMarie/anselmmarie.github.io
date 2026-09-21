import type { RouteMetadata } from '@portfolio/shared-types';

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
  title: 'Anselm Marie — Front-End Engineer',
  description:
    'Front-end engineer building micro-frontend architecture: independently ' +
    'deployed React remotes composed by a TanStack Start shell.',
  path: '/',
};

const BY_PATH: ReadonlyMap<string, RouteMetadata> = new Map([['/', HOME_METADATA]]);

/**
 * Looks metadata up by route path. Returns `undefined` for a path with no
 * entry, so the caller decides the fallback rather than this module inventing
 * one — the shell's root route supplies the site-wide default.
 */
export const metadataForPath = (path: string): RouteMetadata | undefined => BY_PATH.get(path);
