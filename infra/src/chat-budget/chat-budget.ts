import { CfnBudget, CfnBudgetsAction } from 'aws-cdk-lib/aws-budgets';
import {
  Effect,
  type IRole,
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';

import { CHAT_BUDGET_SERVICES } from '../chat-config/chat-config.js';

export interface ChatBudgetProps {
  /** The chat Lambda's role, which the action cuts off from Bedrock. */
  readonly chatRole: IRole;
  readonly monthlyBudgetUsd: number;
  /** Subscribed to the alert topic when set. Never committed: it comes from the deploy env. */
  readonly alertEmail?: string;
}

/**
 * A6: the automatic kill switch at the AWS level. When the month's Bedrock
 * spend passes the budget, AWS Budgets attaches a deny-Bedrock policy to the
 * chat role, with no approval step, and publishes to the alert topic.
 *
 * ⚠️ **It is not a hard ceiling.** Budgets data lags actual spend by hours, so
 * A5's daily counter is what bounds a single day. This catches whatever gets
 * past A1–A5. Undoing it is manual: detach the deny policy from the role.
 */
export class ChatBudget extends Construct {
  readonly denyPolicy: ManagedPolicy;
  readonly alertTopic: Topic;

  constructor(scope: Construct, id: string, props: ChatBudgetProps) {
    super(scope, id);

    this.denyPolicy = new ManagedPolicy(this, 'DenyBedrock', {
      description: 'Attached by the ai-chat budget action (A6). Detach to turn the chat back on',
      statements: [
        new PolicyStatement({ effect: Effect.DENY, actions: ['bedrock:*'], resources: ['*'] }),
      ],
    });

    this.alertTopic = new Topic(this, 'AlertTopic', { displayName: 'Portfolio chat budget' });
    this.alertTopic.grantPublish(new ServicePrincipal('budgets.amazonaws.com'));
    if (props.alertEmail) {
      this.alertTopic.addSubscription(new EmailSubscription(props.alertEmail));
    }

    const budget = new CfnBudget(this, 'Budget', {
      budget: {
        budgetType: 'COST',
        timeUnit: 'MONTHLY',
        budgetLimit: { amount: props.monthlyBudgetUsd, unit: 'USD' },
        costFilters: { Service: [...CHAT_BUDGET_SERVICES] },
      },
    });

    // Budgets may attach this one policy to this one role, and nothing else.
    const executionRole = new Role(this, 'ActionRole', {
      assumedBy: new ServicePrincipal('budgets.amazonaws.com'),
    });
    executionRole.addToPolicy(
      new PolicyStatement({
        actions: ['iam:AttachRolePolicy', 'iam:DetachRolePolicy'],
        resources: [props.chatRole.roleArn],
        conditions: { ArnEquals: { 'iam:PolicyARN': this.denyPolicy.managedPolicyArn } },
      })
    );

    new CfnBudgetsAction(this, 'Action', {
      budgetName: budget.ref,
      actionType: 'APPLY_IAM_POLICY',
      actionThreshold: { type: 'PERCENTAGE', value: 100 },
      notificationType: 'ACTUAL',
      approvalModel: 'AUTOMATIC',
      executionRoleArn: executionRole.roleArn,
      definition: {
        iamActionDefinition: {
          policyArn: this.denyPolicy.managedPolicyArn,
          roles: [props.chatRole.roleName],
        },
      },
      subscribers: [{ type: 'SNS', address: this.alertTopic.topicArn }],
    });
  }
}
