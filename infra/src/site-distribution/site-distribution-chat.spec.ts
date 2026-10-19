import { describe, expect, it } from 'vitest';

import { synthStack } from '../test-helpers/synth-stack.test-helpers.js';

/** AWS's managed CachingDisabled policy id. */
const CACHING_DISABLED = '4135ea2d-6df8-44a3-9df3-4b5a84be39ad';

interface CacheBehavior {
  PathPattern: string;
  CachePolicyId: string;
  AllowedMethods: string[];
  OriginRequestPolicyId: { Ref: string };
  TargetOriginId: string;
}

interface Origin {
  Id: string;
  OriginAccessControlId?: unknown;
  DomainName: unknown;
}

const template = synthStack();
const json = template.toJSON();
const [distribution] = Object.values(template.findResources('AWS::CloudFront::Distribution'));
const config = distribution?.Properties.DistributionConfig;
const behaviors = config.CacheBehaviors as CacheBehavior[];
const chat = behaviors.find((behavior) => behavior.PathPattern === '/api/chat*');
const chatOrigin = (config.Origins as Origin[]).find(
  (origin) => origin.Id === chat?.TargetOriginId
);

describe('SiteDistribution: the /api/chat* behavior (ai-chat Slice 4)', () => {
  it('exists, and is never cached: every reply is a fresh stream', () => {
    expect(chat?.CachePolicyId).toBe(CACHING_DISABLED);
  });

  it('allows POST, which the default behavior refuses', () => {
    expect(chat?.AllowedMethods).toContain('POST');
  });

  it('reaches the chat Function URL through OAC, not the shell’s origin (D12)', () => {
    expect(chatOrigin?.OriginAccessControlId).toBeDefined();
    expect(JSON.stringify(chatOrigin?.DomainName)).toMatch(/ChatFunctionFunctionUrl/);
  });

  it('forwards the viewer IP for A5, and never the Host header', () => {
    const policy = json.Resources[chat?.OriginRequestPolicyId.Ref ?? ''];
    const headers = policy?.Properties.OriginRequestPolicyConfig.HeadersConfig;

    expect(headers.HeaderBehavior).toBe('whitelist');
    expect(headers.Headers).toEqual(expect.arrayContaining(['CloudFront-Viewer-Address']));
    expect(headers.Headers.map((name: string) => name.toLowerCase())).not.toContain('host');
  });

  it('lists no x-amz-* header, which CloudFront rejects at deploy (D24)', () => {
    const policy = json.Resources[chat?.OriginRequestPolicyId.Ref ?? ''];
    const names: string[] = policy?.Properties.OriginRequestPolicyConfig.HeadersConfig.Headers;

    expect(names.filter((name) => name.toLowerCase().startsWith('x-amz-'))).toEqual([]);
  });
});
