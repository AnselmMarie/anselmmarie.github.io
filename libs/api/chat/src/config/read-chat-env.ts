import { z } from 'zod';

/**
 * The chat Lambda's configuration, validated once at cold start.
 *
 * ⚠️ **Fails fast, and loudly.** A missing table name or guardrail ID throws
 * here, during init, so the function never serves a request with a guardrail
 * or a quota silently switched off. Slice 4's `ChatFunction` sets every name
 * below; D18's three limits arrive as stack props rather than constants.
 */
const chatEnvSchema = z.object({
  CHAT_TABLE_NAME: z.string().min(1),
  CHAT_ENABLED_PARAM: z.string().min(1),
  CHAT_GUARDRAIL_ID: z.string().min(1),
  CHAT_GUARDRAIL_VERSION: z.string().min(1),
  /** A5: the global daily budget, in USD (D18: 1). */
  CHAT_DAILY_BUDGET_USD: z.coerce.number().positive(),
  /** A5: messages per IP per day (D18: 30). */
  CHAT_IP_DAILY_MESSAGES: z.coerce.number().int().positive(),
});

export interface ChatEnv {
  readonly tableName: string;
  readonly enabledParam: string;
  readonly guardrailId: string;
  readonly guardrailVersion: string;
  /** The daily budget in micro-dollars, the unit the global counter stores. */
  readonly dailyBudgetMicroUsd: number;
  readonly ipDailyMessages: number;
}

export const readChatEnv = (env: Record<string, string | undefined>): ChatEnv => {
  const parsed = chatEnvSchema.safeParse(env);
  if (!parsed.success) {
    const names = parsed.error.issues.map((issue) => issue.path.join('.')).join(', ');
    throw new Error(`The chat Lambda's environment is invalid: ${names}`);
  }
  const values = parsed.data;

  return {
    tableName: values.CHAT_TABLE_NAME,
    enabledParam: values.CHAT_ENABLED_PARAM,
    guardrailId: values.CHAT_GUARDRAIL_ID,
    guardrailVersion: values.CHAT_GUARDRAIL_VERSION,
    dailyBudgetMicroUsd: Math.round(values.CHAT_DAILY_BUDGET_USD * 1_000_000),
    ipDailyMessages: values.CHAT_IP_DAILY_MESSAGES,
  };
};
