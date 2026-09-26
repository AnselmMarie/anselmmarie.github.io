import { describe, expect, it } from 'vitest';

import { synthStack } from '../test-helpers/synth-stack.test-helpers.js';
import { UNCACHED_ERROR_STATUSES } from './site-distribution.js';

/** AWS's managed cache policy ids. */
const CACHING_DISABLED = '4135ea2d-6df8-44a3-9df3-4b5a84be39ad';
const CACHING_OPTIMIZED = '658327ea-f89d-4fab-a63d-7e88639e58f6';

interface CacheBehavior {
  PathPattern: string;
  CachePolicyId: string;
  FunctionAssociations?: unknown[];
}

interface DistributionConfig {
  Aliases: string[];
  CacheBehaviors: CacheBehavior[];
  DefaultCacheBehavior: CacheBehavior & { AllowedMethods: string[] };
  CustomErrorResponses: { ErrorCode: number; ErrorCachingMinTTL: number }[];
}

const template = synthStack();
const distributions = Object.values(template.findResources('AWS::CloudFront::Distribution'));
const config = distributions[0]?.Properties.DistributionConfig as DistributionConfig;

describe('SiteDistribution', () => {
  it('serves the apex and www from the one distribution (D108, D109)', () => {
    expect(config.Aliases).toEqual(['anselmmarie.com', 'www.anselmmarie.com']);
  });

  it('never caches a remote pointer, and declares it before /_remotes/* so it wins (D107, R12)', () => {
    const patterns = config.CacheBehaviors.map((behavior) => behavior.PathPattern);

    expect(patterns.indexOf('/_remotes/*/remoteEntry.js')).toBe(0);
    expect(patterns.indexOf('/_remotes/*')).toBe(1);
    expect(config.CacheBehaviors[0]?.CachePolicyId).toBe(CACHING_DISABLED);
  });

  it('caches versioned remotes and the shell’s static files', () => {
    const cached = config.CacheBehaviors.filter(
      (behavior) => behavior.CachePolicyId === CACHING_OPTIMIZED
    ).map((behavior) => behavior.PathPattern);

    expect(cached).toEqual(['/_remotes/*', '/assets/*', '/images/*', '/remoteEntry-*.js']);
  });

  it('sends every page to the shell uncached, GET/HEAD/OPTIONS only', () => {
    expect(config.DefaultCacheBehavior.CachePolicyId).toBe(CACHING_DISABLED);
    expect(config.DefaultCacheBehavior.AllowedMethods).toEqual(['GET', 'HEAD', 'OPTIONS']);
  });

  it('caches no error response, so a retry after an origin error reaches the origin (D106)', () => {
    expect(config.CustomErrorResponses).toEqual(
      UNCACHED_ERROR_STATUSES.map((ErrorCode) => ({ ErrorCode, ErrorCachingMinTTL: 0 }))
    );
  });

  it('runs the www redirect on every behavior, not only the default', () => {
    const behaviors = [config.DefaultCacheBehavior, ...config.CacheBehaviors];

    for (const behavior of behaviors) {
      expect(behavior.FunctionAssociations).toHaveLength(1);
    }
  });

  it('requests a DNS-validated certificate for both names (D109)', () => {
    template.hasResourceProperties('AWS::CertificateManager::Certificate', {
      DomainName: 'anselmmarie.com',
      SubjectAlternativeNames: ['www.anselmmarie.com'],
      ValidationMethod: 'DNS',
    });
  });
});
