import { describe, expect, it } from 'vitest';

import { readChatEnv } from './read-chat-env.js';

const VALID = {
  CHAT_TABLE_NAME: 'chat-quota',
  CHAT_ENABLED_PARAM: '/portfolio/chat-enabled',
  CHAT_GUARDRAIL_ID: 'gr-123',
  CHAT_GUARDRAIL_VERSION: '1',
  CHAT_DAILY_BUDGET_USD: '1',
  CHAT_IP_DAILY_MESSAGES: '30',
};

describe('readChatEnv', () => {
  it('reads every value, with the budget converted to micro-dollars', () => {
    expect(readChatEnv(VALID)).toEqual({
      tableName: 'chat-quota',
      enabledParam: '/portfolio/chat-enabled',
      guardrailId: 'gr-123',
      guardrailVersion: '1',
      dailyBudgetMicroUsd: 1_000_000,
      ipDailyMessages: 30,
    });
  });

  it('accepts a fractional budget', () => {
    expect(readChatEnv({ ...VALID, CHAT_DAILY_BUDGET_USD: '0.25' }).dailyBudgetMicroUsd).toBe(
      250_000
    );
  });

  it('throws naming every missing value, so the function fails at init', () => {
    expect(() =>
      readChatEnv({ ...VALID, CHAT_GUARDRAIL_ID: undefined, CHAT_TABLE_NAME: '' })
    ).toThrow(/CHAT_TABLE_NAME, CHAT_GUARDRAIL_ID/);
  });

  it('rejects a non-positive or non-integer limit', () => {
    expect(() => readChatEnv({ ...VALID, CHAT_DAILY_BUDGET_USD: '0' })).toThrow(
      /CHAT_DAILY_BUDGET_USD/
    );
    expect(() => readChatEnv({ ...VALID, CHAT_IP_DAILY_MESSAGES: '2.5' })).toThrow(
      /CHAT_IP_DAILY_MESSAGES/
    );
  });
});
