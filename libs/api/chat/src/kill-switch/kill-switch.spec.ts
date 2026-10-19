import { GetParameterCommand } from '@aws-sdk/client-ssm';
import { describe, expect, it, vi } from 'vitest';

import { createKillSwitch, KILL_SWITCH_TTL_MS } from './kill-switch.js';

const ssmReturning = (value: string | undefined) => ({
  send: vi
    .fn()
    .mockResolvedValue({ Parameter: value === undefined ? undefined : { Value: value } }),
});

describe('createKillSwitch (A7)', () => {
  it('reads the named parameter and is enabled only for "true"', async () => {
    const ssm = ssmReturning('true');
    const isEnabled = createKillSwitch({ ssm, paramName: '/chat-enabled' });

    expect(await isEnabled()).toBe(true);
    const command = ssm.send.mock.calls[0]?.[0];
    expect(command).toBeInstanceOf(GetParameterCommand);
    expect(command.input).toEqual({ Name: '/chat-enabled' });
  });

  it.each(['false', 'TRUE ', 'yes', ''])('reads %j as disabled', async (value) => {
    const isEnabled = createKillSwitch({ ssm: ssmReturning(value), paramName: 'p' });
    expect(await isEnabled()).toBe(value.trim() === 'true');
  });

  it('reads a missing parameter as disabled', async () => {
    const isEnabled = createKillSwitch({ ssm: ssmReturning(undefined), paramName: 'p' });
    expect(await isEnabled()).toBe(false);
  });

  it('fails closed when SSM throws, and reports it', async () => {
    const onError = vi.fn();
    const ssm = { send: vi.fn().mockRejectedValue(new Error('throttled')) };
    const isEnabled = createKillSwitch({ ssm, paramName: 'p', onError });

    expect(await isEnabled()).toBe(false);
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });

  it('serves the cached value inside the TTL and re-reads after it', async () => {
    let time = 1_000;
    const ssm = ssmReturning('true');
    const isEnabled = createKillSwitch({ ssm, paramName: 'p', now: () => time });

    await isEnabled();
    time += KILL_SWITCH_TTL_MS - 1;
    await isEnabled();
    expect(ssm.send).toHaveBeenCalledTimes(1);

    ssm.send.mockResolvedValue({ Parameter: { Value: 'false' } });
    time += 1;
    expect(await isEnabled()).toBe(false);
    expect(ssm.send).toHaveBeenCalledTimes(2);
  });
});
