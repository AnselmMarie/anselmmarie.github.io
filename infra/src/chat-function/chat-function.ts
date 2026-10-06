import { fileURLToPath } from 'node:url';
import { Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { type IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import {
  Architecture,
  type FunctionUrl,
  FunctionUrlAuthType,
  InvokeMode,
  Runtime,
} from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

import {
  CHAT_ENABLED_PARAM_NAME,
  CHAT_FOUNDATION_MODEL_ID,
  CHAT_INFERENCE_PROFILE_ID,
  CHAT_MODEL_REGIONS,
  CHAT_RESERVED_CONCURRENCY,
  type ChatLimits,
} from '../chat-config/chat-config.js';
import type { ChatGuardrail } from '../chat-guardrail/chat-guardrail.js';

const repoPath = (path: string): string =>
  fileURLToPath(new URL(`../../../${path}`, import.meta.url));

/** The handler's entry (D20). Bundled here, so `libs/api/chat` has no build target of its own. */
export const CHAT_ENTRY = repoPath('libs/api/chat/src/index.ts');

/**
 * ESM bundles have no `require`, but the AWS SDK's CommonJS dependencies call
 * it. This banner gives the bundle one.
 */
const REQUIRE_SHIM =
  "import { createRequire } from 'module'; const require = createRequire(import.meta.url);";

export interface ChatFunctionProps {
  readonly guardrail: ChatGuardrail;
  readonly limits: ChatLimits;
}

/**
 * The chat Lambda (D1, D12, D20), the quota table it counts in (A5) and the
 * kill-switch parameter it reads (A7).
 *
 * ⚠️ The URL is `AWS_IAM` like the shell's: CloudFront signs each request with
 * OAC, so the function can't be called around the WAF. The OAC and its invoke
 * permission are added where the origin is declared, in `SiteDistribution`.
 */
export class ChatFunction extends Construct {
  readonly function: NodejsFunction;
  /** The execution role A6's budget action cuts off from Bedrock. */
  readonly role: IRole;
  readonly url: FunctionUrl;
  readonly table: Table;
  readonly enabledParam: StringParameter;

  constructor(scope: Construct, id: string, props: ChatFunctionProps) {
    super(scope, id);
    const { guardrail, limits } = props;

    // Rows are today's counters with a ~48h TTL. Nothing in them is worth keeping.
    this.table = new Table(this, 'QuotaTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: 'expiresAt',
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // ⚠️ CloudFormation sets this once. Flipping it by hand in SSM sticks across
    // deploys until this resource itself changes.
    this.enabledParam = new StringParameter(this, 'EnabledParam', {
      parameterName: CHAT_ENABLED_PARAM_NAME,
      stringValue: 'true',
      description: 'ai-chat A7 kill switch. Only the string "true" enables the chat',
    });

    this.function = new NodejsFunction(this, 'Function', {
      description: 'Portfolio AI chat: Bedrock streaming behind in-code guardrails (ai-chat)',
      entry: CHAT_ENTRY,
      handler: 'handler',
      projectRoot: repoPath(''),
      depsLockFilePath: repoPath('pnpm-lock.yaml'),
      runtime: Runtime.NODEJS_22_X,
      architecture: Architecture.ARM_64,
      memorySize: 512,
      timeout: Duration.seconds(30),
      reservedConcurrentExecutions: CHAT_RESERVED_CONCURRENCY,
      bundling: {
        format: OutputFormat.ESM,
        target: 'node22',
        minify: true,
        // Bundle the SDK too: the runtime's copy can lag the ConverseStream
        // guardrail options the handler relies on.
        externalModules: [],
        banner: REQUIRE_SHIM,
      },
      environment: {
        CHAT_TABLE_NAME: this.table.tableName,
        CHAT_ENABLED_PARAM: this.enabledParam.parameterName,
        CHAT_GUARDRAIL_ID: guardrail.guardrail.attrGuardrailId,
        CHAT_GUARDRAIL_VERSION: guardrail.version.attrVersion,
        CHAT_DAILY_BUDGET_USD: String(limits.dailyBudgetUsd),
        CHAT_IP_DAILY_MESSAGES: String(limits.ipDailyMessages),
      },
    });

    // A function given no role gets one generated, so this only guards the type.
    if (!this.function.role) throw new Error('ChatFunction has no execution role');
    this.role = this.function.role;

    this.url = this.function.addFunctionUrl({
      authType: FunctionUrlAuthType.AWS_IAM,
      invokeMode: InvokeMode.RESPONSE_STREAM,
    });

    this.grantLeastPrivilege(guardrail);
  }

  /** D2 / D6: exact ARNs only, never `*`. */
  private grantLeastPrivilege(guardrail: ChatGuardrail): void {
    const { account, region } = Stack.of(this);

    this.function.addToRolePolicy(
      new PolicyStatement({
        actions: ['bedrock:InvokeModelWithResponseStream'],
        resources: [
          `arn:aws:bedrock:${region}:${account}:inference-profile/${CHAT_INFERENCE_PROFILE_ID}`,
          ...CHAT_MODEL_REGIONS.map(
            (modelRegion) =>
              `arn:aws:bedrock:${modelRegion}::foundation-model/${CHAT_FOUNDATION_MODEL_ID}`
          ),
        ],
      })
    );
    this.function.addToRolePolicy(
      new PolicyStatement({
        actions: ['bedrock:ApplyGuardrail'],
        resources: [guardrail.guardrail.attrGuardrailArn],
      })
    );
    this.function.addToRolePolicy(
      new PolicyStatement({
        actions: ['dynamodb:BatchGetItem', 'dynamodb:UpdateItem'],
        resources: [this.table.tableArn],
      })
    );
    this.function.addToRolePolicy(
      new PolicyStatement({
        actions: ['ssm:GetParameter'],
        resources: [this.enabledParam.parameterArn],
      })
    );
  }
}
