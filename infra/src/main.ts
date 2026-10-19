import { App } from 'aws-cdk-lib';

import { readChatLimits } from './chat-config/chat-config.js';
import { PortfolioStack } from './portfolio-stack.js';
import { resolveShellServerDir } from './shell-server-dir/shell-server-dir.js';
import { AWS_ACCOUNT, AWS_REGION, STACK_NAME } from './site-config/site-config.js';

/**
 * The CDK app entry (D37). `cdk deploy` from here publishes the shell; the
 * remotes are deployed by the deploy CLI in `src/deploy/` (D107).
 */
const app = new App();

new PortfolioStack(app, STACK_NAME, {
  env: { account: AWS_ACCOUNT, region: AWS_REGION },
  description: 'anselmmarie.com: shell on Lambda, remotes on S3, one CloudFront (D107-D109)',
  shellServerDir: resolveShellServerDir(process.env.SHELL_SERVER_DIR),
  chatLimits: readChatLimits((key) => app.node.tryGetContext(key)),
  chatAlertEmail: process.env.CHAT_ALERT_EMAIL || undefined,
});
