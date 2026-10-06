import { describe, expect, it } from 'vitest';

import { CHAT_MAX_OUTPUT_TOKENS, CHAT_MODEL_ID, usageCostMicroUsd } from './chat-model.js';

describe('chat model (D6)', () => {
  it('is Haiku 4.5 through the US inference profile, capped at 400 output tokens (B4)', () => {
    expect(CHAT_MODEL_ID).toBe('us.anthropic.claude-haiku-4-5-20251001-v1:0');
    expect(CHAT_MAX_OUTPUT_TOKENS).toBe(400);
  });
});

describe('usageCostMicroUsd (A5)', () => {
  it('prices each token bucket at its own rate', () => {
    expect(usageCostMicroUsd({ inputTokens: 1_000_000 })).toBe(1_100_000);
    expect(usageCostMicroUsd({ outputTokens: 1_000_000 })).toBe(5_500_000);
    expect(usageCostMicroUsd({ cacheWriteInputTokens: 1_000_000 })).toBe(1_375_000);
    expect(usageCostMicroUsd({ cacheReadInputTokens: 1_000_000 })).toBe(110_000);
  });

  it('adds the buckets and rounds up, so a tiny reply never costs zero', () => {
    expect(usageCostMicroUsd({ inputTokens: 100, outputTokens: 10 })).toBe(165);
    expect(usageCostMicroUsd({ cacheReadInputTokens: 1 })).toBe(1);
  });

  it('treats missing usage as free', () => {
    expect(usageCostMicroUsd({})).toBe(0);
  });
});
