import { describe, expect, it } from 'vitest';

import { CHAT_MAX_OUTPUT_TOKENS, CHAT_MODEL_ID, usageCostMicroUsd } from './chat-model.js';

describe('chat model (D6)', () => {
  it('is Haiku 5.5 through the US inference profile, capped at 400 output tokens (B4)', () => {
    expect(CHAT_MODEL_ID).toBe('us.anthropic.claude-haiku-5-5');
    expect(CHAT_MAX_OUTPUT_TOKENS).toBe(400);
  });
});

describe('usageCostMicroUsd (A5)', () => {
  it('prices each token bucket at its own rate', () => {
    expect(usageCostMicroUsd({ inputTokens: 1_000_000 })).toBe(110_000);
    expect(usageCostMicroUsd({ outputTokens: 1_000_000 })).toBe(550_000);
    expect(usageCostMicroUsd({ cacheWriteInputTokens: 1_000_000 })).toBe(137_500);
    expect(usageCostMicroUsd({ cacheReadInputTokens: 1_000_000 })).toBe(11_000);
  });

  it('adds the buckets and rounds up, so a tiny reply never costs zero', () => {
    expect(usageCostMicroUsd({ inputTokens: 100, outputTokens: 10 })).toBe(17);
    expect(usageCostMicroUsd({ cacheReadInputTokens: 1 })).toBe(1);
  });

  it('treats missing usage as free', () => {
    expect(usageCostMicroUsd({})).toBe(0);
  });
});
