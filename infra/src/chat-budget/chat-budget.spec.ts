import { describe, expect, it } from 'vitest';

import { CHAT_BUDGET_SERVICES, DEFAULT_CHAT_LIMITS } from '../chat-config/chat-config.js';
import { synthStack } from '../test-helpers/synth-stack.test-helpers.js';

const template = synthStack();
const json = template.toJSON();
const [action] = Object.values(template.findResources('AWS::Budgets::BudgetsAction'));
const actionProps = action?.Properties ?? {};

/** The logical id of the chat function's role: the one its Lambda names. */
const chatRoleId = Object.values(template.findResources('AWS::Lambda::Function')).find(
  (fn) => fn.Properties.Environment?.Variables?.CHAT_TABLE_NAME
)?.Properties.Role['Fn::GetAtt'][0];

describe('ChatBudget', () => {
  it('watches the month’s Bedrock spend against D18’s $10', () => {
    template.hasResourceProperties('AWS::Budgets::Budget', {
      Budget: {
        BudgetType: 'COST',
        TimeUnit: 'MONTHLY',
        BudgetLimit: { Amount: DEFAULT_CHAT_LIMITS.monthlyBudgetUsd, Unit: 'USD' },
        CostFilters: { Service: [...CHAT_BUDGET_SERVICES] },
      },
    });
  });

  it('attaches the deny policy to the chat role at 100%, with no approval step (A6)', () => {
    expect(actionProps.ActionType).toBe('APPLY_IAM_POLICY');
    expect(actionProps.ApprovalModel).toBe('AUTOMATIC');
    expect(actionProps.ActionThreshold).toEqual({ Type: 'PERCENTAGE', Value: 100 });
    expect(actionProps.Definition.IamActionDefinition.Roles).toEqual([{ Ref: chatRoleId }]);
  });

  it('attaches a policy that denies every Bedrock action', () => {
    const policyId = actionProps.Definition.IamActionDefinition.PolicyArn.Ref;

    expect(json.Resources[policyId].Properties.PolicyDocument.Statement).toEqual([
      { Effect: 'Deny', Action: 'bedrock:*', Resource: '*' },
    ]);
  });

  it('lets Budgets attach that one policy to that one role, and nothing else', () => {
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: ['iam:AttachRolePolicy', 'iam:DetachRolePolicy'],
            Effect: 'Allow',
            Resource: { 'Fn::GetAtt': [chatRoleId, 'Arn'] },
            Condition: {
              ArnEquals: { 'iam:PolicyARN': actionProps.Definition.IamActionDefinition.PolicyArn },
            },
          },
        ],
      },
    });
  });

  it('publishes to the alert topic, which Budgets may publish to', () => {
    const topicId = actionProps.Subscribers[0].Address.Ref;

    expect(actionProps.Subscribers).toEqual([{ Type: 'SNS', Address: { Ref: topicId } }]);
    expect(JSON.stringify(template.findResources('AWS::SNS::TopicPolicy'))).toContain(
      'budgets.amazonaws.com'
    );
  });

  it('subscribes no email unless one is supplied at deploy time', () => {
    expect(template.findResources('AWS::SNS::Subscription')).toEqual({});

    const withEmail = synthStack({ chatAlertEmail: 'alerts@example.com' });
    withEmail.hasResourceProperties('AWS::SNS::Subscription', {
      Protocol: 'email',
      Endpoint: 'alerts@example.com',
    });
  });

  it('takes the monthly limit from the stack props', () => {
    synthStack({
      chatLimits: { ...DEFAULT_CHAT_LIMITS, monthlyBudgetUsd: 25 },
    }).hasResourceProperties('AWS::Budgets::Budget', {
      Budget: { BudgetLimit: { Amount: 25, Unit: 'USD' } },
    });
  });
});
