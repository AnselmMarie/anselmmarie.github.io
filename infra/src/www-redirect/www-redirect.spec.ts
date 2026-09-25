import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

import { wwwRedirectSource } from './www-redirect.js';

type QueryValue = { value: string; multiValue?: { value: string }[] };

interface ViewerRequest {
  uri: string;
  headers: Record<string, { value: string }>;
  querystring: Record<string, QueryValue>;
}

/** Runs the exact source CloudFront receives, in a sandbox with no Node globals. */
const runHandler = (request: ViewerRequest): unknown =>
  runInNewContext(`${wwwRedirectSource()}; handler(event);`, { event: { request } });

const request = (host: string, uri = '/', querystring = {}): ViewerRequest => ({
  uri,
  headers: { host: { value: host } },
  querystring,
});

describe('wwwRedirectSource', () => {
  it('passes an apex request through untouched', () => {
    const apex = request('anselmmarie.com', '/portfolio/cricket');

    expect(runHandler(apex)).toBe(apex);
  });

  it('301s www to the apex, keeping the path', () => {
    expect(runHandler(request('www.anselmmarie.com', '/portfolio/cricket'))).toEqual({
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: 'https://anselmmarie.com/portfolio/cricket' } },
    });
  });

  it('keeps the query string, including repeated and valueless keys', () => {
    const response = runHandler(
      request('www.anselmmarie.com', '/', {
        a: { value: '1' },
        tag: { value: 'x', multiValue: [{ value: 'x' }, { value: 'y' }] },
        flag: { value: '' },
      })
    ) as { headers: { location: { value: string } } };

    expect(response.headers.location.value).toBe('https://anselmmarie.com/?a=1&tag=x&tag=y&flag');
  });

  it('passes a request with no Host header through rather than throwing', () => {
    const bare: ViewerRequest = { uri: '/', headers: {}, querystring: {} };

    expect(runHandler(bare)).toBe(bare);
  });
});
