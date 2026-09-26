import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

import { PortfolioStack } from '../portfolio-stack.js';
import { AWS_ACCOUNT, AWS_REGION } from '../site-config/site-config.js';

/**
 * A fake Nitro build: `<root>/server/index.mjs` beside `<root>/nitro.json`.
 * `preset` defaults to the one `resolveShellServerDir` accepts.
 */
export const fakeShellBuild = (preset = 'aws-lambda', withEntry = true): string => {
  const root = mkdtempSync(join(tmpdir(), 'shell-output-'));
  const serverDir = join(root, 'server');
  mkdirSync(serverDir);
  if (withEntry) writeFileSync(join(serverDir, 'index.mjs'), 'export const handler = () => {};\n');
  writeFileSync(join(root, 'nitro.json'), JSON.stringify({ preset }));
  return serverDir;
};

/** Synthesizes the real stack, in the real account and region, against a fake build. */
export const synthStack = (): Template => {
  const app = new App();
  const stack = new PortfolioStack(app, 'TestStack', {
    env: { account: AWS_ACCOUNT, region: AWS_REGION },
    shellServerDir: fakeShellBuild(),
  });
  return Template.fromStack(stack);
};
