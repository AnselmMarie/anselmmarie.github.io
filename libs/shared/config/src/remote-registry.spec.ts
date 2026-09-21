import { describe, expect, it } from 'vitest';

import { DEFAULT_HEADER_ORIGIN, REMOTE_REGISTRY, remoteEntryFor } from './remote-registry.js';

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

  it.each(['footer', 'homepage', 'portfolio-item'] as const)(
    'returns undefined for %s, whose slice has not been built',
    (name) => {
      expect(remoteEntryFor(name)).toBeUndefined();
    }
  );

  it('holds exactly the remotes that exist', () => {
    expect(Object.keys(REMOTE_REGISTRY)).toEqual(['header']);
  });
});
