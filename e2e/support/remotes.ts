/**
 * The four remotes as the suite sees them: where each is served from, where it
 * renders, and the test ids the shell and the remote already carry.
 *
 * ⚠️ **The origins come from the environment, never from a literal here.**
 * `playwright.config.ts` fills in the local E2E stack's origins; a deployed run
 * (Slice 8) supplies its own. They are the same `PORTFOLIO_*_ORIGIN` variables
 * the shell's build reads, so the URL a spec blocks is the URL the shell loads.
 */

export type RemoteName = 'header' | 'footer' | 'homepage' | 'portfolio-item';

/**
 * A real, published item. `composition.spec.ts` asserts the homepage links to
 * it, so a fixture change that drops it fails there, loudly, rather than turning
 * every spec that navigates to it into a not-found page.
 */
export const SAMPLE_SLUG = 'cosmikata';
export const SAMPLE_ITEM_PATH = `/portfolio/${SAMPLE_SLUG}`;

interface RemoteSpec {
  name: RemoteName;
  originEnv: string;
  /** The route this remote is checked on. Header and footer render on every route. */
  path: string;
}

export const REMOTES: readonly RemoteSpec[] = [
  { name: 'header', originEnv: 'PORTFOLIO_HEADER_ORIGIN', path: '/' },
  { name: 'footer', originEnv: 'PORTFOLIO_FOOTER_ORIGIN', path: '/' },
  { name: 'homepage', originEnv: 'PORTFOLIO_HOMEPAGE_ORIGIN', path: '/' },
  { name: 'portfolio-item', originEnv: 'PORTFOLIO_PORTFOLIO_ITEM_ORIGIN', path: SAMPLE_ITEM_PATH },
];

/** Which remotes a route composes. */
export const REMOTES_ON_PATH = {
  home: ['header', 'homepage', 'footer'],
  item: ['header', 'portfolio-item', 'footer'],
} as const satisfies Record<string, readonly RemoteName[]>;

export const remotesOn = (path: string): readonly RemoteName[] =>
  path === '/' ? REMOTES_ON_PATH.home : REMOTES_ON_PATH.item;

export const remoteOrigin = (name: RemoteName): string => {
  const spec = REMOTES.find((remote) => remote.name === name);
  const origin = spec ? process.env[spec.originEnv] : undefined;
  if (!origin) {
    throw new Error(`No origin for the ${name} remote: set ${spec?.originEnv ?? 'its origin'}`);
  }
  return origin;
};

export const remoteEntryUrl = (name: RemoteName): string => `${remoteOrigin(name)}/remoteEntry.js`;

/** The remote's own root, from `libs/features/<name>`. */
export const remoteTestId = (name: RemoteName): string => `${name}-remote`;

/** The shell-owned fallback, from `libs/features/shell/src/fallbacks`. */
export const fallbackTestId = (name: RemoteName): string => `mfe-fallback-${name}`;
