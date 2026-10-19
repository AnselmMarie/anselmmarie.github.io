/**
 * The AI chat's fixed facts and limits (ai-chat Slice 4). Every chat construct
 * reads them from here, so the model, the path and the limits are each stated
 * once on the infra side.
 */

/** The path the chat remote POSTs to; the CloudFront behavior and WAF scope match it. */
export const CHAT_API_PATH = '/api/chat';
export const CHAT_PATH_PATTERN = `${CHAT_API_PATH}*`;

/**
 * Claude Haiku 5.5 through the US cross-region inference profile (D6, D28).
 *
 * ⚠️ **Repeats `CHAT_MODEL_ID` in `libs/api/chat/src/chat-model/chat-model.ts`.**
 * `type:infra` may not import `type:api`, so the spec reads that file and fails
 * if the two differ. The IAM policy names only this profile, so a model swap
 * that skipped this line would deny every request.
 */
export const CHAT_INFERENCE_PROFILE_ID = 'us.anthropic.claude-haiku-5-5';

/** The profile's foundation model, which IAM also has to allow in each region it routes to. */
export const CHAT_FOUNDATION_MODEL_ID = 'anthropic.claude-haiku-5-5';
export const CHAT_MODEL_REGIONS = ['us-east-1', 'us-east-2', 'us-west-2'] as const;

/**
 * The build-time env var the chat remote's `vite.config.ts` reads for the WAF
 * JS SDK URL (D21). The deploy CLI sets it from the `ChatWafIntegrationUrl`
 * output. ⚠️ `apps/chat/vite.config.ts` repeats the name; change both together.
 */
export const CHAT_WAF_SDK_ENV = 'PORTFOLIO_CHAT_WAF_SDK_URL';

/** The SSM parameter the handler reads as the kill switch (A7). Only `true` enables. */
export const CHAT_ENABLED_PARAM_NAME = '/portfolio/chat-enabled';

/** A3: a spike can never fan out into more parallel Bedrock calls than this. */
export const CHAT_RESERVED_CONCURRENCY = 3;

/** A2: requests to `/api/chat*` per IP per 5-minute window before WAF blocks. */
export const CHAT_RATE_LIMIT_PER_5_MIN = 20;

/**
 * Cost Explorer service names A6's budget filters on.
 *
 * Anthropic models on Bedrock bill as an AWS Marketplace service named after the
 * model, not as "Amazon Bedrock". The Haiku 5.5 name is the `servicename` the AWS
 * Pricing API reports (D28); Q8 stays open until Cost Explorer shows it too. If
 * neither name matches, the budget sees $0 and A6 never trips.
 */
export const CHAT_BUDGET_SERVICES = [
  'Amazon Bedrock',
  'Claude Haiku 5.5 (Amazon Bedrock Edition)',
] as const;

/** D18's three limits. Config, not code: each can be overridden with cdk context. */
export interface ChatLimits {
  /** A6: the monthly Bedrock spend that trips the kill switch, in USD. */
  readonly monthlyBudgetUsd: number;
  /** A5: the global daily budget, in USD. */
  readonly dailyBudgetUsd: number;
  /** A5: messages per IP per day. */
  readonly ipDailyMessages: number;
}

export const DEFAULT_CHAT_LIMITS: ChatLimits = {
  monthlyBudgetUsd: 10,
  dailyBudgetUsd: 1,
  ipDailyMessages: 30,
};

/** The cdk context key each limit is read from, e.g. `cdk deploy -c chatDailyBudgetUsd=2`. */
export const CHAT_LIMIT_CONTEXT_KEYS: Record<keyof ChatLimits, string> = {
  monthlyBudgetUsd: 'chatMonthlyBudgetUsd',
  dailyBudgetUsd: 'chatDailyBudgetUsd',
  ipDailyMessages: 'chatIpDailyMessages',
};

/**
 * D18's limits with any cdk context overrides applied. A value that isn't a
 * positive number throws, so a typo can't deploy a $0 or unlimited budget.
 */
export const readChatLimits = (getContext: (key: string) => unknown): ChatLimits => {
  const read = (name: keyof ChatLimits): number => {
    const raw = getContext(CHAT_LIMIT_CONTEXT_KEYS[name]);
    if (raw === undefined) return DEFAULT_CHAT_LIMITS[name];
    const value = Number(raw);
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(`cdk context ${CHAT_LIMIT_CONTEXT_KEYS[name]} must be a positive number`);
    }
    return value;
  };

  const limits = {
    monthlyBudgetUsd: read('monthlyBudgetUsd'),
    dailyBudgetUsd: read('dailyBudgetUsd'),
    ipDailyMessages: read('ipDailyMessages'),
  };
  if (!Number.isInteger(limits.ipDailyMessages)) {
    throw new Error(
      `cdk context ${CHAT_LIMIT_CONTEXT_KEYS.ipDailyMessages} must be a whole number`
    );
  }
  return limits;
};
