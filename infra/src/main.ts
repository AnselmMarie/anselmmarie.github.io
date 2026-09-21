import { App } from 'aws-cdk-lib';

import { PortfolioStack } from './portfolio-stack.js';

/**
 * The CDK app entry (D37). `cdk synth` renders the stack; nothing here
 * deploys — Slice 8 fills the stack in and wires it to GitHub Actions.
 */
const app = new App();

new PortfolioStack(app, 'PortfolioStack', {
  description: 'Shell on Lambda behind CloudFront, plus one S3 origin per federated remote (D31).',
});
