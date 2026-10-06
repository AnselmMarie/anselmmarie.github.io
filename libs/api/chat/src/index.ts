import { createChatHandler } from './handler/handler.js';
import type { AwsLambdaRuntime } from './handler/lambda-stream.js';

declare const awslambda: AwsLambdaRuntime;

/**
 * The chat Lambda's entry point (ai-chat D20). Slice 4's `ChatFunction`
 * bundles this file with esbuild and names `handler` as the export.
 *
 * ⚠️ **Only loadable inside Lambda.** `awslambda` is a global of the managed
 * Node runtime, so importing this module anywhere else throws. Specs import
 * `createChatHandler` instead.
 */
export const handler = createChatHandler(awslambda, process.env);
