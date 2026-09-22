import { describe, expect, it } from 'vitest';

import { classifyMfeFailure } from './classify-mfe-failure.js';

describe('classifyMfeFailure', () => {
  it.each([
    'Failed to fetch dynamically imported module: http://localhost:4174/remoteEntry.js',
    'error loading remote: header',
    'Loading chunk 42 failed.',
    'Failed to load script: remoteEntry.js',
    'Importing a module script failed.',
  ])('calls %s a load failure', (message) => {
    expect(classifyMfeFailure(new Error(message))).toBe('load');
  });

  it('classifies by the error name too, not only the message', () => {
    const error = new Error('unavailable');
    error.name = 'ChunkLoadError';

    expect(classifyMfeFailure(error)).toBe('load');
  });

  it('calls a component that threw a render failure', () => {
    expect(classifyMfeFailure(new Error('Cannot read properties of undefined'))).toBe('render');
  });

  it('defaults to render for a thrown value that is not an Error', () => {
    // A thrown string reaches the boundary the same way. Defaulting to
    // `render` is the safe side of the heuristic: a load failure miscalled a
    // render failure still reaches the same fallback.
    expect(classifyMfeFailure('something went wrong')).toBe('render');
    expect(classifyMfeFailure(undefined)).toBe('render');
  });
});
