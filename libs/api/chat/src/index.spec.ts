import { afterEach, describe, expect, it, vi } from 'vitest';

const ENV = {
  CHAT_TABLE_NAME: 'quota',
  CHAT_ENABLED_PARAM: '/chat-enabled',
  CHAT_GUARDRAIL_ID: 'gr-1',
  CHAT_GUARDRAIL_VERSION: '1',
  CHAT_DAILY_BUDGET_USD: '1',
  CHAT_IP_DAILY_MESSAGES: '30',
};

describe('the Lambda entry point', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('exports what the runtime’s streamifyResponse returns', async () => {
    const streamed = Symbol('streamed handler');
    vi.stubGlobal('awslambda', {
      streamifyResponse: vi.fn(() => streamed),
      HttpResponseStream: {},
    });
    for (const [name, value] of Object.entries(ENV)) vi.stubEnv(name, value);

    const { handler } = await import('./index.js');
    expect(handler).toBe(streamed);
  });
});
