import { describe, expect, it } from 'vitest';

import {
  DEFAULT_FOOTER_ORIGIN,
  DEFAULT_HEADER_ORIGIN,
  DEFAULT_HOMEPAGE_ORIGIN,
  DEFAULT_PORTFOLIO_ITEM_ORIGIN,
  REMOTE_REGISTRY,
  remoteEntryFor,
} from './remote-registry.js';

describe('remoteEntryFor', () => {
  it('resolves the header, which Slice 3 built', () => {
    // Slice 1 asserted this was `undefined`. The assertion flipping here is
    // deliberate: the registry filling up should be visible in a diff.
    const entry = remoteEntryFor('header');

    expect(entry).toBeDefined();
    expect(entry?.name).toBe('header');
    expect(entry?.exposedModule).toBe('./Header');
  });

  it('points the header at its remoteEntry.js on the remote origin, not the shell', () => {
    // D42's failure mode in miniature: a same-origin default would pass a
    // localhost check and 404 behind CloudFront.
    expect(remoteEntryFor('header')?.entryUrl).toBe(`${DEFAULT_HEADER_ORIGIN}/remoteEntry.js`);
    expect(DEFAULT_HEADER_ORIGIN).not.toBe('http://localhost:3000');
  });

  it.each([
    ['footer', './Footer'],
    ['homepage', './Homepage'],
    ['portfolio-item', './PortfolioItem'],
  ] as const)('carries a pre-created %s entry for the Slice 5-7 wave', (name, exposedModule) => {
    // ⚠️ Slice 1 and Slice 3 asserted these were `undefined`. Slice 4 creates
    // them deliberately: three concurrent agents each adding a row to one file
    // is the collision parallelization.md exists to prevent, so the rows are
    // here before the wave starts and each agent only fills in its remote.
    //
    // The remotes behind them do not exist yet. That is the same state as a
    // remote that is down, which the boundary already handles.
    const entry = remoteEntryFor(name);

    expect(entry).toBeDefined();
    expect(entry?.name).toBe(name);
    expect(entry?.exposedModule).toBe(exposedModule);
  });

  it('gives every remote its own origin, so no two share a dev port', () => {
    // A duplicated port is the quiet way two remotes end up serving each
    // other's bundles in dev — `strictPort` in the apps makes the second one
    // fail to start, but only if the numbers differ here in the first place.
    const origins = [
      DEFAULT_HEADER_ORIGIN,
      DEFAULT_FOOTER_ORIGIN,
      DEFAULT_HOMEPAGE_ORIGIN,
      DEFAULT_PORTFOLIO_ITEM_ORIGIN,
    ];

    expect(new Set(origins).size).toBe(origins.length);
  });

  it('holds all four remotes', () => {
    expect(Object.keys(REMOTE_REGISTRY).sort()).toEqual([
      'footer',
      'header',
      'homepage',
      'portfolio-item',
    ]);
  });

  it('carries a version for every remote, because a diagnostic without one is unactionable', () => {
    // The architecture doc's Error Reporting asks for the deployment/version
    // in every payload, and its Immutable Deployment Interaction turns on the
    // shell knowing which version it referenced when the failure happened.
    // `dev` is the local value; Slice 8 injects the real one.
    for (const entry of Object.values(REMOTE_REGISTRY)) {
      expect(entry?.version).toBe('dev');
    }
  });

  it('returns undefined for a name that is not a remote', () => {
    // The registry is a `Partial<Record<…>>` on purpose; the lookup must stay
    // honest about that even now that every known remote has a row.
    expect(remoteEntryFor('not-a-remote' as never)).toBeUndefined();
  });
});
