import { CfnOutput, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib';
import { BlockPublicAccess, Bucket, BucketEncryption, ObjectOwnership } from 'aws-cdk-lib/aws-s3';
import type { Construct } from 'constructs';

import { GithubDeployRole } from './github-deploy-role/github-deploy-role.js';
import { ShellFunction } from './shell-function/shell-function.js';
import { SiteDistribution } from './site-distribution/site-distribution.js';

export { LAMBDA_ARCHITECTURE, LAMBDA_RUNTIME } from './shell-function/shell-function.js';

/** The output names the deploy CLI reads back with `describe-stacks`. */
export const STACK_OUTPUTS = {
  bucketName: 'SiteBucketName',
  distributionId: 'DistributionId',
  distributionDomainName: 'DistributionDomainName',
  deployRoleArn: 'GithubDeployRoleArn',
  certificateArn: 'CertificateArn',
} as const;

export interface PortfolioStackProps extends StackProps {
  /** `apps/shell/.output/server` from an `aws_lambda`-preset build. */
  readonly shellServerDir: string;
}

/**
 * The whole site, in one stack in `us-east-1` (D31, D37, D107–D109).
 *
 * The shell's Lambda code is part of this stack, so a shell deploy is a
 * `cdk deploy`. The remotes are not: they are files in the bucket, uploaded by
 * the deploy CLI without touching CloudFormation (D12).
 */
export class PortfolioStack extends Stack {
  constructor(scope: Construct, id: string, props: PortfolioStackProps) {
    super(scope, id, props);

    // RETAIN: the bucket holds every deployed version of every remote, which is
    // what rollback depends on (D107). Deleting the stack must not delete them.
    const bucket = new Bucket(this, 'SiteBucket', {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
      encryption: BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    const shell = new ShellFunction(this, 'Shell', { serverDir: props.shellServerDir });
    const site = new SiteDistribution(this, 'Site', { bucket, shellUrl: shell.url });
    const deploy = new GithubDeployRole(this, 'GithubDeploy', {
      bucket,
      distribution: site.distribution,
    });

    new CfnOutput(this, STACK_OUTPUTS.bucketName, { value: bucket.bucketName });
    new CfnOutput(this, STACK_OUTPUTS.distributionId, {
      value: site.distribution.distributionId,
    });
    new CfnOutput(this, STACK_OUTPUTS.distributionDomainName, {
      description: 'Point both Cloudflare CNAMEs here, grey cloud (D109)',
      value: site.distribution.distributionDomainName,
    });
    new CfnOutput(this, STACK_OUTPUTS.deployRoleArn, {
      description: 'The role ci.yml assumes; its name is fixed (GITHUB_DEPLOY_ROLE_NAME)',
      value: deploy.role.roleArn,
    });
    new CfnOutput(this, STACK_OUTPUTS.certificateArn, {
      value: site.certificate.certificateArn,
    });
  }
}
