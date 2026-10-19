import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { SSMClient } from '@aws-sdk/client-ssm';

import { streamChatReply } from '../bedrock-stream/bedrock-stream.js';
import { readChatEnv } from '../config/read-chat-env.js';
import { createKillSwitch } from '../kill-switch/kill-switch.js';
import { createQuota } from '../quota/quota.js';
import { buildSystemPrompt } from '../system-prompt/build-system-prompt.js';
import { clientIp } from './client-ip.js';
import { type ChatDeps, handleChat } from './handle-chat.js';
import { type AwsLambdaRuntime, requestBody, writeChatResponse } from './lambda-stream.js';

/**
 * Builds the chat Lambda's handler. Everything here runs once per cold start:
 * the env is validated (and throws, failing init), the clients are created,
 * and the system prompt is built from the fixtures (D4).
 */
export const createChatHandler = (
  runtime: AwsLambdaRuntime,
  env: Record<string, string | undefined>
): unknown => {
  const config = readChatEnv(env);
  const systemPrompt = buildSystemPrompt();
  const bedrock = new BedrockRuntimeClient({});
  const guardrail = { id: config.guardrailId, version: config.guardrailVersion };

  const deps: ChatDeps = {
    isEnabled: createKillSwitch({ ssm: new SSMClient({}), paramName: config.enabledParam }),
    quota: createQuota({
      dynamo: new DynamoDBClient({}),
      tableName: config.tableName,
      limits: config,
    }),
    streamReply: (turns) => streamChatReply({ bedrock, systemPrompt, guardrail, turns }),
    now: () => new Date(),
    onError: (message, error) => console.error(message, error),
  };

  return runtime.streamifyResponse(async (event, responseStream) => {
    const response = await handleChat({ body: requestBody(event), ip: clientIp(event) }, deps);
    await writeChatResponse(runtime, responseStream, response);
  });
};
