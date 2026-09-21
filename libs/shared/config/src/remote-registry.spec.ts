import { describe, expect, it } from 'vitest';

import { REMOTE_REGISTRY, remoteEntryFor } from './remote-registry.js';

describe('remoteEntryFor', () => {
  it('returns undefined for a remote that has no entry yet', () => {
    // Slice 1 builds no remotes. The Header arrives at Slice 3 and this
    // assertion changes there — deliberately, so the registry filling up is
    // visible in a diff rather than silent.
    expect(remoteEntryFor('header')).toBeUndefined();
  });

  it.each(['header', 'footer', 'homepage', 'portfolio-item'] as const)(
    'returns undefined for %s while the registry is empty',
    (name) => {
      expect(remoteEntryFor(name)).toBeUndefined();
    }
  );

  it('starts empty, so no remote resolves before its slice is built', () => {
    expect(Object.keys(REMOTE_REGISTRY)).toHaveLength(0);
  });
});
