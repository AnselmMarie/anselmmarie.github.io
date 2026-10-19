import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import {
  CHAT_ENABLED_PARAM_NAME,
  CHAT_INFERENCE_PROFILE_ID,
  DEFAULT_CHAT_LIMITS,
} from '../chat-config/chat-config.js';
import { LAMBDA_ARCHITECTURE, LAMBDA_RUNTIME } from '../shell-function/shell-function.js';
import { synthStack } from '../test-helpers/synth-stack.test-helpers.js';

const template = synthStack();
const json = template.toJSON();

/** The chat function's logical id: the only Lambda whose env names the quota table. */
const chatFunctionId = Object.entries(template.findResources('AWS::Lambda::Function')).find(
  ([, resource]) => resource.Properties.Environment?.Variables?.CHAT_TABLE_NAME
)?.[0];
const chatFunction = chatFunctionId ? json.Resources[chatFunctionId] : undefined;
const chatEnv = chatFunction?.Properties.Environment.Variables ?? {};

/** Every statement on the chat role's inline policy. */
const chatStatements = Object.values(template.findResources('AWS::IAM::Policy'))
  .filter((policy) =>
    JSON.stringify(policy.Properties.Roles).includes(chatFunction?.Properties.Role['Fn::GetAtt'][0])
  )
  .flatMap((policy) => policy.Properties.PolicyDocument.Statement);

const resourcesFor = (action: string): unknown[] =>
  chatStatements
    .filter((statement) => [statement.Action].flat().includes(action))
    .flatMap((statement) => [statement.Resource].flat());

describe('ChatFunction', () => {
  it('runs on the same arm64 Node 22 runtime as the shell (D1)', () => {
    expect(chatFunction?.Properties.Runtime).toBe(LAMBDA_RUNTIME);
    expect(chatFunction?.Properties.Architectures).toEqual([LAMBDA_ARCHITECTURE]);
    expect(chatFunction?.Properties.Handler).toBe('index.handler');
  });

  it('caps parallel Bedrock calls with reserved concurrency 3 (A3)', () => {
    expect(chatFunction?.Properties.ReservedConcurrentExecutions).toBe(3);
  });

  it('streams through an IAM-authed Function URL, so only CloudFront can call it (D12)', () => {
    template.hasResourceProperties('AWS::Lambda::Url', {
      AuthType: 'AWS_IAM',
      InvokeMode: 'RESPONSE_STREAM',
      TargetFunctionArn: { 'Fn::GetAtt': [chatFunctionId, 'Arn'] },
    });
  });

  it('sets every env var read-chat-env requires, with D18’s limits', () => {
    expect(Object.keys(chatEnv).sort()).toEqual([
      'CHAT_DAILY_BUDGET_USD',
      'CHAT_ENABLED_PARAM',
      'CHAT_GUARDRAIL_ID',
      'CHAT_GUARDRAIL_VERSION',
      'CHAT_IP_DAILY_MESSAGES',
      'CHAT_TABLE_NAME',
    ]);
    expect(chatEnv.CHAT_DAILY_BUDGET_USD).toBe(String(DEFAULT_CHAT_LIMITS.dailyBudgetUsd));
    expect(chatEnv.CHAT_IP_DAILY_MESSAGES).toBe(String(DEFAULT_CHAT_LIMITS.ipDailyMessages));
  });

  it('points the env at the guardrail’s numbered version, not its DRAFT (B2)', () => {
    expect(JSON.stringify(chatEnv.CHAT_GUARDRAIL_ID)).toContain('GuardrailId');
    expect(chatEnv.CHAT_GUARDRAIL_VERSION).toEqual({
      'Fn::GetAtt': [expect.stringMatching(/^ChatGuardrailVersion/), 'Version'],
    });
  });

  it('expires quota rows on expiresAt, keyed by pk (A5)', () => {
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      KeySchema: [{ AttributeName: 'pk', KeyType: 'HASH' }],
      BillingMode: 'PAY_PER_REQUEST',
      TimeToLiveSpecification: { AttributeName: 'expiresAt', Enabled: true },
    });
  });

  it('creates the kill switch enabled (A7)', () => {
    template.hasResourceProperties('AWS::SSM::Parameter', {
      Name: CHAT_ENABLED_PARAM_NAME,
      Value: 'true',
    });
  });

  it('may call only the Haiku 5.5 profile and its regional models, never `*` (D2, D6)', () => {
    const bedrock = resourcesFor('bedrock:InvokeModelWithResponseStream').map((arn) =>
      JSON.stringify(arn)
    );

    expect(bedrock).toHaveLength(4);
    expect(
      bedrock.filter((arn) => arn.includes(`inference-profile/${CHAT_INFERENCE_PROFILE_ID}`))
    ).toHaveLength(1);
    expect(
      bedrock.filter((arn) => arn.includes('::foundation-model/anthropic.claude-haiku-5-5'))
    ).toHaveLength(3);
  });

  it('scopes every other grant to one resource, with no wildcard anywhere', () => {
    expect(resourcesFor('bedrock:ApplyGuardrail')).toEqual([
      { 'Fn::GetAtt': [expect.stringMatching(/^ChatGuardrail/), 'GuardrailArn'] },
    ]);
    expect(resourcesFor('dynamodb:UpdateItem')).toHaveLength(1);
    expect(resourcesFor('ssm:GetParameter')).toHaveLength(1);
    expect(chatStatements.flatMap((statement) => [statement.Resource].flat())).not.toContain('*');
  });

  it('allows the same model the handler calls (the two constants can’t be imported across type tags)', () => {
    const handlerModel = readFileSync(
      new URL('../../../libs/api/chat/src/chat-model/chat-model.ts', import.meta.url),
      'utf8'
    );

    expect(handlerModel).toContain(`CHAT_MODEL_ID = '${CHAT_INFERENCE_PROFILE_ID}'`);
  });
});
