import { Stack } from 'aws-cdk-lib';
import { CfnWebACL } from 'aws-cdk-lib/aws-wafv2';
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

import { CHAT_API_PATH, CHAT_RATE_LIMIT_PER_5_MIN } from '../chat-config/chat-config.js';

/** Matches every request to `/api/chat*`, so neither rule ever touches a page load. */
const chatPathStatement: CfnWebACL.StatementProperty = {
  byteMatchStatement: {
    fieldToMatch: { uriPath: {} },
    positionalConstraint: 'STARTS_WITH',
    searchString: CHAT_API_PATH,
    textTransformations: [{ priority: 0, type: 'NONE' }],
  },
};

const visibility = (metricName: string): CfnWebACL.VisibilityConfigProperty => ({
  cloudWatchMetricsEnabled: true,
  metricName,
  sampledRequestsEnabled: true,
});

/**
 * The site's web ACL: A2 then A1, both scoped to `/api/chat*` (D21).
 *
 * ⚠️ **Order is precedence.** The rate rule (priority 0) runs before the
 * challenge (priority 1), so a flood is blocked outright instead of being
 * served a challenge page per request, which WAF bills for.
 *
 * Everything else is allowed by default. CloudFront web ACLs must live in
 * us-east-1, which is where this stack already is.
 */
export class ChatFirewall extends Construct {
  readonly webAcl: CfnWebACL;
  /** The AWS WAF JS SDK URL the chat client loads to get its token (Slice 5). */
  readonly integrationUrl: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    const name = `${Stack.of(this).stackName}-site`;

    this.webAcl = new CfnWebACL(this, 'WebAcl', {
      name,
      scope: 'CLOUDFRONT',
      defaultAction: { allow: {} },
      visibilityConfig: visibility('site'),
      rules: [
        {
          name: 'ChatRateLimit',
          priority: 0,
          action: { block: {} },
          statement: {
            rateBasedStatement: {
              limit: CHAT_RATE_LIMIT_PER_5_MIN,
              evaluationWindowSec: 300,
              aggregateKeyType: 'IP',
              scopeDownStatement: chatPathStatement,
            },
          },
          visibilityConfig: visibility('chat-rate-limit'),
        },
        {
          name: 'ChatChallenge',
          priority: 1,
          action: { challenge: {} },
          statement: chatPathStatement,
          visibilityConfig: visibility('chat-challenge'),
        },
      ],
    });

    // The integration URL is not a CloudFormation attribute; only GetWebACL returns it.
    const lookup = new AwsCustomResource(this, 'IntegrationUrl', {
      onUpdate: {
        service: 'WAFV2',
        action: 'GetWebACL',
        parameters: { Name: name, Scope: 'CLOUDFRONT', Id: this.webAcl.attrId },
        physicalResourceId: PhysicalResourceId.of(this.webAcl.attrId),
        outputPaths: ['ApplicationIntegrationURL'],
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: [this.webAcl.attrArn] }),
      installLatestAwsSdk: false,
    });
    this.integrationUrl = lookup.getResponseField('ApplicationIntegrationURL');
  }
}
