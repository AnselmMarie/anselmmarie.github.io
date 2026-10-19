import { describe, expect, it } from 'vitest';

import { CHAT_RATE_LIMIT_PER_5_MIN } from '../chat-config/chat-config.js';
import { STACK_OUTPUTS } from '../portfolio-stack.js';
import { synthStack } from '../test-helpers/synth-stack.test-helpers.js';

interface Rule {
  Name: string;
  Priority: number;
  Action: Record<string, unknown>;
  Statement: Record<string, unknown>;
}

const template = synthStack();
const [webAclId, webAcl] = Object.entries(template.findResources('AWS::WAFv2::WebACL'))[0] ?? [];
const rules = (webAcl?.Properties.Rules ?? []) as Rule[];
const ruleNamed = (name: string): Rule | undefined => rules.find((rule) => rule.Name === name);

const chatPathOnly = {
  ByteMatchStatement: {
    FieldToMatch: { UriPath: {} },
    PositionalConstraint: 'STARTS_WITH',
    SearchString: '/api/chat',
    TextTransformations: [{ Priority: 0, Type: 'NONE' }],
  },
};

describe('ChatFirewall', () => {
  it('is a CloudFront-scope web ACL that allows everything it has no rule for', () => {
    expect(webAcl?.Properties.Scope).toBe('CLOUDFRONT');
    expect(webAcl?.Properties.DefaultAction).toEqual({ Allow: {} });
  });

  it('blocks an IP past the rate limit on /api/chat* only (A2)', () => {
    expect(ruleNamed('ChatRateLimit')).toEqual(
      expect.objectContaining({
        Action: { Block: {} },
        Statement: {
          RateBasedStatement: {
            Limit: CHAT_RATE_LIMIT_PER_5_MIN,
            EvaluationWindowSec: 300,
            AggregateKeyType: 'IP',
            ScopeDownStatement: chatPathOnly,
          },
        },
      })
    );
  });

  it('challenges /api/chat* only, so a page load is never challenged (A1, D21)', () => {
    expect(ruleNamed('ChatChallenge')).toEqual(
      expect.objectContaining({ Action: { Challenge: {} }, Statement: chatPathOnly })
    );
  });

  it('rate-limits before it challenges, so a flood is blocked rather than billed per challenge', () => {
    const rate = ruleNamed('ChatRateLimit')?.Priority ?? Number.NaN;
    const challenge = ruleNamed('ChatChallenge')?.Priority ?? Number.NaN;

    expect(rate).toBeLessThan(challenge);
  });

  it('is attached to the distribution', () => {
    template.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: { WebACLId: { 'Fn::GetAtt': [webAclId, 'Arn'] } },
    });
  });

  it('outputs the JS SDK integration URL the chat client loads (Slice 5)', () => {
    const output = template.toJSON().Outputs?.[STACK_OUTPUTS.chatWafIntegrationUrl];

    expect(JSON.stringify(output?.Value)).toContain('ApplicationIntegrationURL');
  });
});
