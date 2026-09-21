import { Stack, type StackProps } from 'aws-cdk-lib';
import type { Construct } from 'constructs';

/** The Lambda architecture the shell is built for (D49). */
export const LAMBDA_ARCHITECTURE = 'arm64';

/** Node runtime the function targets, pinned to match `.nvmrc` (D45). */
export const LAMBDA_RUNTIME = 'nodejs22.x';

/**
 * ⚠️ **Defined, not deployed.** D37 creates this project in Slice 1 so
 * `apps/shell` is built against its real Lambda adapter from the first commit
 * rather than a placeholder that gets replaced. Nothing in Slice 1 runs
 * `cdk deploy`, and the stack deliberately declares no resources yet.
 *
 * [Slice 8](../../docs/planning/mfe-architecture/slices/08-independent-deployment.md)
 * adds the function, the CloudFront distribution and one S3 origin per remote.
 * The two constants above are the decisions that had to be settled now, because
 * the shell's build output depends on them.
 */
export class PortfolioStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }
}
