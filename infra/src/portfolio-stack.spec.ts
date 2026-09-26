import { Match } from 'aws-cdk-lib/assertions';
import { describe, expect, it } from 'vitest';

import { LAMBDA_ARCHITECTURE, LAMBDA_RUNTIME, STACK_OUTPUTS } from './portfolio-stack.js';
import { synthStack } from './test-helpers/synth-stack.test-helpers.js';

const template = synthStack();

describe('PortfolioStack', () => {
  it('pins the Lambda to arm64 and the Node 22 runtime', () => {
    // D49 picked arm64 and `.npmrc` fetches native binaries to match, so a
    // silent change here would desync the two.
    expect(LAMBDA_ARCHITECTURE).toBe('arm64');
    expect(LAMBDA_RUNTIME).toBe('nodejs22.x');
  });

  it('deploys the shell as that arm64 Node 22 function, calling Nitro’s handler', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Runtime: LAMBDA_RUNTIME,
      Architectures: [LAMBDA_ARCHITECTURE],
      Handler: 'index.handler',
      Environment: {
        Variables: Match.objectLike({ PORTFOLIO_SITE_ORIGIN: 'https://anselmmarie.com' }),
      },
    });
  });

  it('exposes the shell through an IAM-authed Function URL, so only CloudFront can call it', () => {
    template.hasResourceProperties('AWS::Lambda::Url', { AuthType: 'AWS_IAM' });
  });

  it('keeps the bucket private and retains it, with every deployed version, if the stack goes', () => {
    template.hasResource('AWS::S3::Bucket', {
      DeletionPolicy: 'Retain',
      Properties: Match.objectLike({
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          BlockPublicPolicy: true,
          IgnorePublicAcls: true,
          RestrictPublicBuckets: true,
        },
      }),
    });
  });

  it('outputs every value the deploy CLI and the runbook read back', () => {
    const outputs = Object.keys(template.toJSON().Outputs ?? {});

    for (const name of Object.values(STACK_OUTPUTS)) {
      expect(outputs).toContain(name);
    }
  });
});
