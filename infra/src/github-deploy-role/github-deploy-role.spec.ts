import { describe, expect, it } from 'vitest';

import { GITHUB_DEPLOY_ROLE_NAME } from '../site-config/site-config.js';
import { synthStack } from '../test-helpers/synth-stack.test-helpers.js';
import { GITHUB_DEPLOY_SUBJECT } from './github-deploy-role.js';

interface Statement {
  Action: string | string[];
  Condition?: Record<string, Record<string, string>>;
}

const template = synthStack();

const roleTrust = (): Statement[] => {
  const roles = Object.values(template.findResources('AWS::IAM::Role'));
  const deployRole = roles.find((role) =>
    JSON.stringify(role.Properties.AssumeRolePolicyDocument).includes(
      'sts:AssumeRoleWithWebIdentity'
    )
  );
  return deployRole?.Properties.AssumeRolePolicyDocument.Statement ?? [];
};

const grantedActions = (): string[] =>
  Object.values(template.findResources('AWS::IAM::Policy'))
    .flatMap((policy) => policy.Properties.PolicyDocument.Statement as Statement[])
    .flatMap((statement) => [statement.Action].flat());

describe('GithubDeployRole', () => {
  it('trusts only workflow runs on master of this repository', () => {
    expect(GITHUB_DEPLOY_SUBJECT).toBe(
      'repo:AnselmMarie/anselmmarie.github.io:ref:refs/heads/master'
    );
    expect(roleTrust()[0]?.Condition).toEqual({
      StringEquals: {
        'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
        'token.actions.githubusercontent.com:sub': GITHUB_DEPLOY_SUBJECT,
      },
    });
  });

  it('has a fixed name, so ci.yml can name its ARN without a manual step', () => {
    template.hasResourceProperties('AWS::IAM::Role', {
      RoleName: GITHUB_DEPLOY_ROLE_NAME,
      AssumeRolePolicyDocument: { Statement: roleTrust() },
    });
  });

  it('creates the GitHub OIDC provider, which the account did not have', () => {
    template.hasResourceProperties('AWS::IAM::OIDCProvider', {
      Url: 'https://token.actions.githubusercontent.com',
      ClientIdList: ['sts.amazonaws.com'],
    });
  });

  it('can upload, invalidate and hand off to CDK', () => {
    expect(grantedActions()).toEqual(
      expect.arrayContaining([
        's3:PutObject',
        'cloudfront:CreateInvalidation',
        'cloudformation:DescribeStacks',
        'sts:AssumeRole',
      ])
    );
  });

  it('cannot delete an object, so no deployed version can be lost from CI (D107)', () => {
    const deletes = grantedActions().filter((action) => /delete|\*/i.test(action));

    expect(deletes).toEqual([]);
  });
});
