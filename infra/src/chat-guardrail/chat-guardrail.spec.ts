import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { describe, expect, it } from 'vitest';

import { synthStack } from '../test-helpers/synth-stack.test-helpers.js';
import {
  ChatGuardrail,
  GUARDRAIL_BLOCKED_MESSAGE,
  GUARDRAIL_CONTENT_FILTERS,
  GUARDRAIL_DENIED_TOPICS,
} from './chat-guardrail.js';

const template = synthStack();

const versionDescription = (): string => {
  const stack = new Stack(new App(), 'GuardrailOnly');
  new ChatGuardrail(stack, 'Guardrail');
  const [version] = Object.values(
    Template.fromStack(stack).findResources('AWS::Bedrock::GuardrailVersion')
  );
  return version?.Properties.Description;
};

describe('ChatGuardrail', () => {
  it('denies the four off-topic subjects (B2)', () => {
    template.hasResourceProperties('AWS::Bedrock::Guardrail', {
      TopicPolicyConfig: {
        TopicsConfig: GUARDRAIL_DENIED_TOPICS.map((topic) => ({
          Name: topic.name,
          Type: 'DENY',
          Definition: topic.definition,
          Examples: topic.examples,
        })),
      },
    });
    expect(GUARDRAIL_DENIED_TOPICS.map((topic) => topic.name)).toEqual([
      'GeneralCoding',
      'Homework',
      'UnrelatedPeopleAndCompanies',
      'Politics',
    ]);
  });

  it('filters prompt attacks on input, and harmful content both ways', () => {
    const [guardrail] = Object.values(template.findResources('AWS::Bedrock::Guardrail'));
    const filters = guardrail?.Properties.ContentPolicyConfig.FiltersConfig;

    expect(filters).toContainEqual({
      Type: 'PROMPT_ATTACK',
      InputStrength: 'HIGH',
      OutputStrength: 'NONE',
    });
    expect(filters).toHaveLength(GUARDRAIL_CONTENT_FILTERS.length);
  });

  it('answers a blocked input or output with the same polite redirect', () => {
    template.hasResourceProperties('AWS::Bedrock::Guardrail', {
      BlockedInputMessaging: GUARDRAIL_BLOCKED_MESSAGE,
      BlockedOutputsMessaging: GUARDRAIL_BLOCKED_MESSAGE,
    });
  });

  it('cuts a numbered version of it', () => {
    const [version] = Object.values(template.findResources('AWS::Bedrock::GuardrailVersion'));

    expect(version?.Properties.GuardrailIdentifier).toEqual({
      'Fn::GetAtt': [expect.stringMatching(/^ChatGuardrail/), 'GuardrailId'],
    });
  });

  it('cuts a new version whenever a topic changes, so the handler never calls a stale one', () => {
    const before = versionDescription();
    const topic = GUARDRAIL_DENIED_TOPICS[0];
    const original = topic?.definition;
    try {
      Object.assign(topic ?? {}, { definition: `${original} Also recipes.` });
      expect(versionDescription()).not.toBe(before);
    } finally {
      Object.assign(topic ?? {}, { definition: original });
    }
    expect(versionDescription()).toBe(before);
  });
});
