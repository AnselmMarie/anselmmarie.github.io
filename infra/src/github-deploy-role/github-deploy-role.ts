import { Duration, Stack } from 'aws-cdk-lib';
import type { IDistribution } from 'aws-cdk-lib/aws-cloudfront';
import {
  OidcProviderNative,
  PolicyStatement,
  Role,
  WebIdentityPrincipal,
} from 'aws-cdk-lib/aws-iam';
import type { IBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

import {
  GITHUB_DEPLOY_REF,
  GITHUB_DEPLOY_ROLE_NAME,
  GITHUB_REPOSITORY,
} from '../site-config/site-config.js';

export const GITHUB_OIDC_ISSUER = 'token.actions.githubusercontent.com';

/** Exactly one subject may assume the role: a workflow run on `master`. */
export const GITHUB_DEPLOY_SUBJECT = `repo:${GITHUB_REPOSITORY}:ref:${GITHUB_DEPLOY_REF}`;

export interface GithubDeployRoleProps {
  readonly bucket: IBucket;
  readonly distribution: IDistribution;
}

/**
 * The role GitHub Actions assumes to deploy, through OIDC rather than a stored
 * access key (D10/D11, D109).
 *
 * ⚠️ **The OIDC provider is created here** because the account had none on
 * 2026-09-25. An account holds one provider per issuer URL, so a second stack
 * that also creates one fails its deploy.
 *
 * What the role can do, and nothing more:
 * - read and write objects in the site bucket, but **not delete** them: every
 *   deployed version stays addressable for rollback (D107);
 * - invalidate this distribution;
 * - read this stack's outputs;
 * - assume the CDK bootstrap roles, which is how `cdk deploy` publishes the
 *   shell. Those roles carry CloudFormation's own permissions, not this one.
 */
export class GithubDeployRole extends Construct {
  readonly role: Role;

  constructor(scope: Construct, id: string, props: GithubDeployRoleProps) {
    super(scope, id);
    const stack = Stack.of(this);

    const provider = new OidcProviderNative(this, 'GithubOidc', {
      url: `https://${GITHUB_OIDC_ISSUER}`,
      clientIds: ['sts.amazonaws.com'],
    });

    this.role = new Role(this, 'Role', {
      roleName: GITHUB_DEPLOY_ROLE_NAME,
      description: `GitHub Actions deploys from ${GITHUB_REPOSITORY} ${GITHUB_DEPLOY_REF}`,
      maxSessionDuration: Duration.hours(1),
      assumedBy: new WebIdentityPrincipal(provider.oidcProviderArn, {
        StringEquals: {
          [`${GITHUB_OIDC_ISSUER}:aud`]: 'sts.amazonaws.com',
          [`${GITHUB_OIDC_ISSUER}:sub`]: GITHUB_DEPLOY_SUBJECT,
        },
      }),
    });

    this.role.addToPolicy(
      new PolicyStatement({
        actions: ['s3:ListBucket'],
        resources: [props.bucket.bucketArn],
      })
    );
    this.role.addToPolicy(
      new PolicyStatement({
        actions: ['s3:GetObject', 's3:PutObject'],
        resources: [props.bucket.arnForObjects('*')],
      })
    );
    this.role.addToPolicy(
      new PolicyStatement({
        actions: ['cloudfront:CreateInvalidation', 'cloudfront:GetInvalidation'],
        resources: [
          stack.formatArn({
            service: 'cloudfront',
            region: '',
            resource: 'distribution',
            resourceName: props.distribution.distributionId,
          }),
        ],
      })
    );
    this.role.addToPolicy(
      new PolicyStatement({
        actions: ['cloudformation:DescribeStacks'],
        resources: [stack.stackId],
      })
    );
    this.role.addToPolicy(
      new PolicyStatement({
        actions: ['sts:AssumeRole'],
        resources: [
          `arn:aws:iam::${stack.account}:role/cdk-hnb659fds-*-${stack.account}-${stack.region}`,
        ],
      })
    );
  }
}
