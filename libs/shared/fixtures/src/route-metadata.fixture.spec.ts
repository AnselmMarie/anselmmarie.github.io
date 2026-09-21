import { describe, expect, it } from 'vitest';

import { HOME_METADATA, metadataForPath } from './route-metadata.fixture.js';

describe('metadataForPath', () => {
  it('resolves the home route', () => {
    expect(metadataForPath('/')).toEqual(HOME_METADATA);
  });

  it('returns undefined for a path with no entry, rather than inventing one', () => {
    // Slice 7 adds `/portfolio/$slug`. Until then the shell's root route
    // supplies the default, and this assertion is what says so.
    expect(metadataForPath('/portfolio/pokemon-pet-shop')).toBeUndefined();
  });

  it('gives the home route a non-empty title and description', () => {
    // D48 exists to make link previews work. An empty string would render a
    // preview that looks correct in the DOM and blank in a crawler.
    expect(HOME_METADATA.title.length).toBeGreaterThan(0);
    expect(HOME_METADATA.description.length).toBeGreaterThan(0);
  });
});
