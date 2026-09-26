import { Duration } from 'aws-cdk-lib';
import {
  Architecture,
  Code,
  type FunctionUrl,
  FunctionUrlAuthType,
  Function as LambdaFunction,
  Runtime,
} from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

import { SITE_ORIGIN } from '../site-config/site-config.js';

/** The Lambda architecture the shell is built for (D49). */
export const LAMBDA_ARCHITECTURE = 'arm64';

/** Node runtime the function targets, pinned to match `.nvmrc` (D45). */
export const LAMBDA_RUNTIME = 'nodejs22.x';

/**
 * More memory buys proportionally more CPU on Lambda, and a Node SSR cold start
 * is CPU-bound (R11). 1 GB is a starting point to measure from, not a finding.
 */
export const SHELL_MEMORY_MB = 1024;

export interface ShellFunctionProps {
  /** `apps/shell/.output/server` from an `aws_lambda`-preset build. */
  readonly serverDir: string;
}

/**
 * The shell's SSR server (D31) and the Function URL CloudFront calls it through.
 *
 * ⚠️ The URL's auth is `AWS_IAM`, not `NONE`: CloudFront signs each request
 * with Origin Access Control (D108), so the function can't be called around the
 * distribution. The OAC and its invoke permission are added where the origin is
 * declared, in `SiteDistribution`.
 */
export class ShellFunction extends Construct {
  readonly function: LambdaFunction;
  readonly url: FunctionUrl;

  constructor(scope: Construct, id: string, props: ShellFunctionProps) {
    super(scope, id);

    this.function = new LambdaFunction(this, 'Function', {
      description: 'TanStack Start shell, Nitro aws_lambda preset (D31)',
      runtime: Runtime.NODEJS_22_X,
      architecture: Architecture.ARM_64,
      handler: 'index.handler',
      code: Code.fromAsset(props.serverDir),
      memorySize: SHELL_MEMORY_MB,
      timeout: Duration.seconds(10),
      environment: {
        NODE_ENV: 'production',
        PORTFOLIO_SITE_ORIGIN: SITE_ORIGIN,
      },
    });

    this.url = this.function.addFunctionUrl({ authType: FunctionUrlAuthType.AWS_IAM });
  }
}
