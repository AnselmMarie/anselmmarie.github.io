import { BatchGetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { describe, expect, it, vi } from 'vitest';

import { createQuota, hashIp, quotaDay } from './quota.js';

const NOW = new Date('2026-10-05T23:30:00Z');
const LIMITS = { ipDailyMessages: 30, dailyBudgetMicroUsd: 1_000_000 };
const IP_HASH = hashIp('203.0.113.7');

const dynamoWithRows = (rows: Record<string, Record<string, string>>) => ({
  send: vi.fn().mockResolvedValue({
    Responses: {
      quota: Object.entries(rows).map(([pk, attrs]) => ({
        pk: { S: pk },
        ...Object.fromEntries(Object.entries(attrs).map(([name, value]) => [name, { N: value }])),
      })),
    },
  }),
});

describe('quotaDay / hashIp', () => {
  it('keys counters by the UTC day', () => {
    expect(quotaDay(NOW)).toBe('2026-10-05');
  });

  it('hashes the IP, so the address itself is never stored', () => {
    expect(IP_HASH).toMatch(/^[0-9a-f]{32}$/);
    expect(IP_HASH).not.toContain('203.0.113.7');
    expect(hashIp('203.0.113.7')).toBe(IP_HASH);
    expect(hashIp('203.0.113.8')).not.toBe(IP_HASH);
  });
});

describe('createQuota().check (A5)', () => {
  it('reads both of today’s rows consistently', async () => {
    const dynamo = dynamoWithRows({});
    await createQuota({ dynamo, tableName: 'quota', limits: LIMITS }).check(IP_HASH, NOW);

    const command = dynamo.send.mock.calls[0]?.[0];
    expect(command).toBeInstanceOf(BatchGetItemCommand);
    expect(command.input.RequestItems.quota).toEqual({
      Keys: [{ pk: { S: 'global#2026-10-05' } }, { pk: { S: `ip#${IP_HASH}#2026-10-05` } }],
      ConsistentRead: true,
    });
  });

  it('allows a visitor with no rows yet', async () => {
    const quota = createQuota({ dynamo: dynamoWithRows({}), tableName: 'quota', limits: LIMITS });
    expect(await quota.check(IP_HASH, NOW)).toBeNull();
  });

  it('allows one under each limit', async () => {
    const dynamo = dynamoWithRows({
      'global#2026-10-05': { spentMicroUsd: '999999' },
      [`ip#${IP_HASH}#2026-10-05`]: { messages: '29' },
    });
    expect(
      await createQuota({ dynamo, tableName: 'quota', limits: LIMITS }).check(IP_HASH, NOW)
    ).toBeNull();
  });

  it('reports "ip" once the visitor has used their messages', async () => {
    const dynamo = dynamoWithRows({ [`ip#${IP_HASH}#2026-10-05`]: { messages: '30' } });
    expect(
      await createQuota({ dynamo, tableName: 'quota', limits: LIMITS }).check(IP_HASH, NOW)
    ).toBe('ip');
  });

  it('reports "global" once the day’s budget is spent, ahead of the IP limit', async () => {
    const dynamo = dynamoWithRows({
      'global#2026-10-05': { spentMicroUsd: '1000000' },
      [`ip#${IP_HASH}#2026-10-05`]: { messages: '30' },
    });
    expect(
      await createQuota({ dynamo, tableName: 'quota', limits: LIMITS }).check(IP_HASH, NOW)
    ).toBe('global');
  });
});

describe('createQuota().record (A5)', () => {
  it('atomically adds one message to the IP row and the cost to the global row, with a 48h TTL', async () => {
    const dynamo = { send: vi.fn().mockResolvedValue({}) };
    await createQuota({ dynamo, tableName: 'quota', limits: LIMITS }).record(IP_HASH, 165, NOW);

    const inputs = dynamo.send.mock.calls.map(([command]) => {
      expect(command).toBeInstanceOf(UpdateItemCommand);
      return command.input;
    });
    const expiresAt = String(Math.floor(NOW.getTime() / 1000) + 48 * 60 * 60);

    expect(inputs).toEqual([
      expect.objectContaining({
        TableName: 'quota',
        Key: { pk: { S: `ip#${IP_HASH}#2026-10-05` } },
        UpdateExpression: 'ADD #counter :amount SET expiresAt = :expiresAt',
        ExpressionAttributeNames: { '#counter': 'messages' },
        ExpressionAttributeValues: { ':amount': { N: '1' }, ':expiresAt': { N: expiresAt } },
      }),
      expect.objectContaining({
        Key: { pk: { S: 'global#2026-10-05' } },
        ExpressionAttributeNames: { '#counter': 'spentMicroUsd' },
        ExpressionAttributeValues: { ':amount': { N: '165' }, ':expiresAt': { N: expiresAt } },
      }),
    ]);
  });
});
