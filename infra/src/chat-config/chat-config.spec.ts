import { describe, expect, it } from 'vitest';

import { CHAT_LIMIT_CONTEXT_KEYS, DEFAULT_CHAT_LIMITS, readChatLimits } from './chat-config.js';

const contextOf =
  (values: Record<string, unknown>) =>
  (key: string): unknown =>
    values[key];

describe('readChatLimits', () => {
  it('falls back to D18’s limits when no context is set', () => {
    expect(readChatLimits(contextOf({}))).toEqual({
      monthlyBudgetUsd: 10,
      dailyBudgetUsd: 1,
      ipDailyMessages: 30,
    });
    expect(DEFAULT_CHAT_LIMITS.monthlyBudgetUsd).toBe(10);
  });

  it('applies a context override, from a string as `-c` passes it', () => {
    const limits = readChatLimits(
      contextOf({
        [CHAT_LIMIT_CONTEXT_KEYS.dailyBudgetUsd]: '2.5',
        [CHAT_LIMIT_CONTEXT_KEYS.ipDailyMessages]: 50,
      })
    );

    expect(limits).toEqual({ monthlyBudgetUsd: 10, dailyBudgetUsd: 2.5, ipDailyMessages: 50 });
  });

  it.each([
    ['zero', 0],
    ['a negative', -1],
    ['a non-number', 'ten'],
  ])('refuses %s budget, so a typo can’t deploy one', (_, value) => {
    expect(() =>
      readChatLimits(contextOf({ [CHAT_LIMIT_CONTEXT_KEYS.monthlyBudgetUsd]: value }))
    ).toThrow('chatMonthlyBudgetUsd must be a positive number');
  });

  it('refuses a fractional message count', () => {
    expect(() =>
      readChatLimits(contextOf({ [CHAT_LIMIT_CONTEXT_KEYS.ipDailyMessages]: 2.5 }))
    ).toThrow('chatIpDailyMessages must be a whole number');
  });
});
