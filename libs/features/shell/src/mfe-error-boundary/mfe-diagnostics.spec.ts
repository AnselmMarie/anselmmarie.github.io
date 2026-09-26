import { afterEach, describe, expect, it, vi } from 'vitest';

import { buildMfeDiagnostics, logMfeFailure } from './mfe-diagnostics.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('buildMfeDiagnostics', () => {
  it('carries every field the architecture doc enumerates', () => {
    // The doc lists eight. A payload missing one is only discovered at the
    // moment someone is trying to diagnose a production failure, so the list
    // is asserted as a whole rather than field by field.
    const diagnostics = buildMfeDiagnostics({
      mfe: 'header',
      version: 'abc123',
      route: '/',
      kind: 'load',
      error: new TypeError('Failed to fetch dynamically imported module'),
    });

    expect(Object.keys(diagnostics).sort()).toEqual([
      'correlationId',
      'errorMessage',
      'errorType',
      'kind',
      'mfe',
      'route',
      'runtime',
      'timestamp',
      'version',
    ]);
  });

  it('names the error type and message from a real Error', () => {
    const diagnostics = buildMfeDiagnostics({
      mfe: 'homepage',
      version: 'v2',
      route: '/',
      kind: 'render',
      error: new TypeError('boom'),
    });

    expect(diagnostics.errorType).toBe('TypeError');
    expect(diagnostics.errorMessage).toBe('boom');
  });

  it('survives a thrown value that is not an Error', () => {
    // A remote can throw anything. A diagnostics builder that assumes `Error`
    // throws inside `componentDidCatch`, which replaces a contained failure
    // with an uncontained one.
    const diagnostics = buildMfeDiagnostics({
      mfe: 'footer',
      version: 'v1',
      route: '/',
      kind: 'render',
      error: 'just a string',
    });

    expect(diagnostics.errorType).toBe('string');
    expect(diagnostics.errorMessage).toBe('just a string');
  });

  it('gives each failure its own correlation id', () => {
    const input = { mfe: 'header', version: 'v1', route: '/', kind: 'load' } as const;
    const first = buildMfeDiagnostics({ ...input, error: new Error('x') });
    const second = buildMfeDiagnostics({ ...input, error: new Error('x') });

    expect(first.correlationId).not.toBe(second.correlationId);
  });

  it('timestamps in ISO 8601 so a log line sorts', () => {
    const diagnostics = buildMfeDiagnostics({
      mfe: 'header',
      version: 'v1',
      route: '/',
      kind: 'load',
      error: new Error('x'),
    });

    expect(new Date(diagnostics.timestamp).toISOString()).toBe(diagnostics.timestamp);
  });
});

describe('logMfeFailure', () => {
  it('logs the whole payload, not a summary of it', () => {
    // The user gets a clean fallback; the console gets everything. A log line
    // that drops fields makes the fallback the only evidence a failure
    // happened at all.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const diagnostics = buildMfeDiagnostics({
      mfe: 'header',
      version: 'abc123',
      route: '/',
      kind: 'load',
      error: new Error('nope'),
    });

    logMfeFailure(diagnostics);

    expect(spy).toHaveBeenCalledWith('[mfe:header] load failure', diagnostics);
  });
});
