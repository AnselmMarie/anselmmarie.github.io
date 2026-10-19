import { createHash } from 'node:crypto';
import {
  BatchGetItemCommand,
  type DynamoDBClient,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';

/** Rows outlive their day by a day, then DynamoDB's TTL removes them. */
const ROW_TTL_SECONDS = 48 * 60 * 60;

export interface QuotaLimits {
  readonly ipDailyMessages: number;
  readonly dailyBudgetMicroUsd: number;
}

interface QuotaOptions {
  readonly dynamo: Pick<DynamoDBClient, 'send'>;
  readonly tableName: string;
  readonly limits: QuotaLimits;
}

/** Which limit a request ran into, matching the `resting` event's `reason`. */
export type QuotaExhausted = 'ip' | 'global';

/** The UTC day a counter belongs to, `yyyy-mm-dd`. */
export const quotaDay = (date: Date): string => date.toISOString().slice(0, 10);

/**
 * ⚠️ **IPs are never stored.** The row key carries a SHA-256 of the address,
 * which is enough to count with and nothing a reader of the table can use.
 */
export const hashIp = (ip: string): string =>
  createHash('sha256').update(ip).digest('hex').slice(0, 32);

const ipKey = (ipHash: string, day: string): string => `ip#${ipHash}#${day}`;
const globalKey = (day: string): string => `global#${day}`;

const numberAttr = (item: Record<string, { N?: string }> | undefined, name: string): number =>
  Number(item?.[name]?.N ?? 0);

/**
 * A5: one DynamoDB table, two counters a day.
 *
 * - `ip#<hash>#<day>.messages`: replies served to one visitor (D18: 30).
 * - `global#<day>.spentMicroUsd`: what Bedrock cost today (D18: $1).
 *
 * `check` runs before the model is called; `record` adds to both counters with
 * an atomic `ADD` once the stream reports its usage. A few concurrent requests
 * can overshoot by one reply each, which A3's reserved concurrency of 3 bounds.
 */
export const createQuota = ({ dynamo, tableName, limits }: QuotaOptions) => {
  const check = async (ipHash: string, now: Date): Promise<QuotaExhausted | null> => {
    const day = quotaDay(now);
    const keys = [globalKey(day), ipKey(ipHash, day)];
    const result = await dynamo.send(
      new BatchGetItemCommand({
        RequestItems: {
          [tableName]: { Keys: keys.map((pk) => ({ pk: { S: pk } })), ConsistentRead: true },
        },
      })
    );
    const rows = result.Responses?.[tableName] ?? [];
    const row = (pk: string) => rows.find((item) => item.pk?.S === pk);

    if (numberAttr(row(globalKey(day)), 'spentMicroUsd') >= limits.dailyBudgetMicroUsd) {
      return 'global';
    }
    if (numberAttr(row(ipKey(ipHash, day)), 'messages') >= limits.ipDailyMessages) return 'ip';
    return null;
  };

  const add = (pk: string, attribute: string, amount: number, expiresAt: number) =>
    dynamo.send(
      new UpdateItemCommand({
        TableName: tableName,
        Key: { pk: { S: pk } },
        UpdateExpression: 'ADD #counter :amount SET expiresAt = :expiresAt',
        ExpressionAttributeNames: { '#counter': attribute },
        ExpressionAttributeValues: {
          ':amount': { N: String(amount) },
          ':expiresAt': { N: String(expiresAt) },
        },
      })
    );

  const record = async (ipHash: string, costMicroUsd: number, now: Date): Promise<void> => {
    const day = quotaDay(now);
    const expiresAt = Math.floor(now.getTime() / 1000) + ROW_TTL_SECONDS;
    await Promise.all([
      add(ipKey(ipHash, day), 'messages', 1, expiresAt),
      add(globalKey(day), 'spentMicroUsd', costMicroUsd, expiresAt),
    ]);
  };

  return { check, record };
};

export type ChatQuota = ReturnType<typeof createQuota>;
