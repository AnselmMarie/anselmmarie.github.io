import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { describe, expect, it } from 'vitest';

import { LAMBDA_ARCHITECTURE, LAMBDA_RUNTIME, PortfolioStack } from './portfolio-stack.js';

describe('PortfolioStack', () => {
  it('synthesizes', () => {
    const app = new App();
    const stack = new PortfolioStack(app, 'TestStack');

    expect(() => Template.fromStack(stack)).not.toThrow();
  });

  it('declares no resources yet, because Slice 1 defines infrastructure without deploying it', () => {
    // If this assertion starts failing, a resource was added outside Slice 8.
    // That is the thing to notice — D37 is explicit that this stack is defined
    // and not deployed until then.
    const app = new App();
    const template = Template.fromStack(new PortfolioStack(app, 'TestStack'));

    expect(template.toJSON().Resources ?? {}).toEqual({});
  });

  it('pins the Lambda to arm64 and the Node 22 runtime', () => {
    // D49 picked arm64 and `.npmrc` fetches native binaries to match, so a
    // silent change here would desync the two.
    expect(LAMBDA_ARCHITECTURE).toBe('arm64');
    expect(LAMBDA_RUNTIME).toBe('nodejs22.x');
  });
});
