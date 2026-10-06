import { GetParameterCommand, type SSMClient } from '@aws-sdk/client-ssm';

/** A7: how long one read of `chat-enabled` is trusted. Flipping it off takes effect within this. */
export const KILL_SWITCH_TTL_MS = 30_000;

interface KillSwitchOptions {
  readonly ssm: Pick<SSMClient, 'send'>;
  readonly paramName: string;
  readonly ttlMs?: number;
  readonly now?: () => number;
  readonly onError?: (error: unknown) => void;
}

/**
 * A7, the manual kill switch: the SSM parameter `chat-enabled`, read through a
 * short in-memory cache so a warm Lambda doesn't call SSM on every request.
 *
 * ⚠️ **Fails closed.** Only the exact string `true` enables the chat. A missing
 * parameter, a typo, or an SSM outage all read as disabled, because the
 * switch exists to protect the bill and an unreadable switch protects nothing.
 * The failed read is cached for the same TTL, so an outage isn't retried on
 * every request either.
 */
export const createKillSwitch = ({
  ssm,
  paramName,
  ttlMs = KILL_SWITCH_TTL_MS,
  now = Date.now,
  onError = (error) => console.error('chat-enabled read failed', error),
}: KillSwitchOptions): (() => Promise<boolean>) => {
  let cached: { readonly isEnabled: boolean; readonly readAt: number } | null = null;

  const read = async (): Promise<boolean> => {
    try {
      const result = await ssm.send(new GetParameterCommand({ Name: paramName }));
      return result.Parameter?.Value?.trim() === 'true';
    } catch (error) {
      onError(error);
      return false;
    }
  };

  return async () => {
    const time = now();
    if (cached && time - cached.readAt < ttlMs) return cached.isEnabled;

    const isEnabled = await read();
    cached = { isEnabled, readAt: time };
    return isEnabled;
  };
};
