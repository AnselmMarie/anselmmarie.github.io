/**
 * The one model the chat calls (ai-chat D6), and what it costs.
 *
 * ⚠️ **The ID and the prices swap together.** A larger model with these prices
 * would let A5's daily budget overspend by the price ratio, silently.
 */

/** Claude Haiku 5.5 through the US cross-region inference profile. */
export const CHAT_MODEL_ID = 'us.anthropic.claude-haiku-5-5';

/** B4: a successful jailbreak gets about one paragraph. */
export const CHAT_MAX_OUTPUT_TOKENS = 400;

/**
 * US-profile on-demand prices, in USD per 1M tokens, checked 2026-10-12 against the
 * AWS Pricing API, regional (non-Global) rows (decisions.md, D28). Cache writes are 1.25× input and cache
 * reads 0.1× input.
 */
export const CHAT_MODEL_PRICES_PER_MTOK = {
  input: 0.11,
  output: 0.55,
  cacheWrite: 0.1375,
  cacheRead: 0.011,
} as const;

/** Bedrock's `metadata.usage`, narrowed to what the cost needs. */
export interface ChatUsage {
  readonly inputTokens?: number;
  readonly outputTokens?: number;
  readonly cacheReadInputTokens?: number;
  readonly cacheWriteInputTokens?: number;
}

/**
 * What one reply cost, in micro-dollars, rounded up. A5's global counter adds
 * this, so the daily budget is compared in dollars rather than in a token
 * count that would price output and cache reads the same as input.
 *
 * Bedrock reports cached tokens separately from `inputTokens`, so the four
 * buckets don't overlap.
 */
export const usageCostMicroUsd = (usage: ChatUsage): number => {
  const prices = CHAT_MODEL_PRICES_PER_MTOK;
  // USD per 1M tokens is exactly micro-dollars per token.
  const micro =
    (usage.inputTokens ?? 0) * prices.input +
    (usage.outputTokens ?? 0) * prices.output +
    (usage.cacheWriteInputTokens ?? 0) * prices.cacheWrite +
    (usage.cacheReadInputTokens ?? 0) * prices.cacheRead;
  // Trim float noise first: 1,000,000 × 0.011 is 11000.000000000002, which would ceil to 11001.
  return Math.ceil(Math.round(micro * 1000) / 1000);
};
