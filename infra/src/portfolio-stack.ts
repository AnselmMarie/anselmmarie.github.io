import { CfnOutput, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib';
import { BlockPublicAccess, Bucket, BucketEncryption, ObjectOwnership } from 'aws-cdk-lib/aws-s3';
import type { Construct } from 'constructs';

import { ChatBudget } from './chat-budget/chat-budget.js';
import { type ChatLimits, DEFAULT_CHAT_LIMITS } from './chat-config/chat-config.js';
import { ChatFirewall } from './chat-firewall/chat-firewall.js';
import { ChatFunction } from './chat-function/chat-function.js';
import { ChatGuardrail } from './chat-guardrail/chat-guardrail.js';
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
  chatWafIntegrationUrl: 'ChatWafIntegrationUrl',
  chatEnabledParam: 'ChatEnabledParam',
  chatAlertTopicArn: 'ChatAlertTopicArn',
} as const;

export interface PortfolioStackProps extends StackProps {
  /** `apps/shell/.output/server` from an `aws_lambda`-preset build. */
  readonly shellServerDir: string;
  /** D18's limits. Defaults to `DEFAULT_CHAT_LIMITS`; `main.ts` applies cdk context overrides. */
  readonly chatLimits?: ChatLimits;
  /** Subscribed to the A6 alert topic when set. Comes from the deploy env, never the repo. */
  readonly chatAlertEmail?: string;
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

    // ai-chat Slice 4: the chat Lambda, its guardrails and its kill switches.
    const chatLimits = props.chatLimits ?? DEFAULT_CHAT_LIMITS;
    const guardrail = new ChatGuardrail(this, 'ChatGuardrail');
    const chat = new ChatFunction(this, 'Chat', { guardrail, limits: chatLimits });
    const firewall = new ChatFirewall(this, 'Firewall');
    const budget = new ChatBudget(this, 'ChatBudget', {
      chatRole: chat.role,
      monthlyBudgetUsd: chatLimits.monthlyBudgetUsd,
      alertEmail: props.chatAlertEmail,
    });

    const site = new SiteDistribution(this, 'Site', {
      bucket,
      shellUrl: shell.url,
      chatUrl: chat.url,
      webAclArn: firewall.webAcl.attrArn,
    });
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
    new CfnOutput(this, STACK_OUTPUTS.chatWafIntegrationUrl, {
      description: 'The AWS WAF JS SDK URL the chat client loads for its token (ai-chat D21)',
      value: firewall.integrationUrl,
    });
    new CfnOutput(this, STACK_OUTPUTS.chatEnabledParam, {
      description: 'Set to anything but "true" to turn the chat off without a deploy (A7)',
      value: chat.enabledParam.parameterName,
    });
    new CfnOutput(this, STACK_OUTPUTS.chatAlertTopicArn, {
      description: 'A6 publishes here when the Bedrock budget trips',
      value: budget.alertTopic.topicArn,
    });
  }
}
