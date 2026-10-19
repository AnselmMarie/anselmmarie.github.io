import type { LambdaFunctionURLEvent } from 'aws-lambda';
import { describe, expect, it } from 'vitest';

import { clientIp } from './client-ip.js';

const eventWith = (headers: Record<string, string>) =>
  ({
    headers,
    requestContext: { http: { sourceIp: '130.176.0.1' } },
  }) as unknown as LambdaFunctionURLEvent;

describe('clientIp', () => {
  it('reads an IPv4 viewer address, dropping the port', () => {
    expect(clientIp(eventWith({ 'cloudfront-viewer-address': '203.0.113.7:46532' }))).toBe(
      '203.0.113.7'
    );
  });

  it('reads an IPv6 viewer address, dropping only the port', () => {
    expect(clientIp(eventWith({ 'cloudfront-viewer-address': '2001:db8::7334:46532' }))).toBe(
      '2001:db8::7334'
    );
  });

  it('falls back to the source IP without the CloudFront header', () => {
    expect(clientIp(eventWith({}))).toBe('130.176.0.1');
  });

  it('falls back to the source IP when the header has no port', () => {
    expect(clientIp(eventWith({ 'cloudfront-viewer-address': 'garbage' }))).toBe('130.176.0.1');
  });
});
