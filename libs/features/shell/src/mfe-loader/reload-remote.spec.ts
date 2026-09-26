import { getInstance } from '@module-federation/runtime';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { reloadRemote } from './reload-remote.js';

vi.mock('@module-federation/runtime', () => ({ getInstance: vi.fn() }));

interface FakeRemote {
  name: string;
  alias?: string;
  entry: string;
}

interface FakeHost {
  options: { remotes: FakeRemote[] };
  registerRemotes: ReturnType<typeof vi.fn>;
  loadRemote: ReturnType<typeof vi.fn>;
}

/** The shape `@module-federation/vite` registers: a mangled `name`, the import name as `alias`. */
const HOMEPAGE = {
  name: '__mfe_internal__shell__mf_owner__1__homepage',
  alias: 'homepage',
  entry: 'https://homepage.example/remoteEntry.js',
};
const HEADER = { name: 'header', entry: 'https://header.example/remoteEntry.js' };
const MODULE = { default: () => null };

const fakeHost = (remotes: FakeRemote[], loaded: unknown = MODULE): FakeHost => ({
  options: { remotes },
  registerRemotes: vi.fn(),
  loadRemote: vi.fn(async () => loaded),
});

/** Runs the finder `reloadRemote` passes over a list of instances, as the runtime does. */
const registerInstances = (instances: FakeHost[]): void => {
  vi.mocked(getInstance).mockImplementation(
    (finder) => (instances.find((instance) => finder?.(instance as never)) ?? null) as never
  );
};

afterEach(() => {
  vi.mocked(getInstance).mockReset();
});

describe('reloadRemote', () => {
  it('re-registers the remote at a new entry URL, forcing the cached load out', async () => {
    const host = fakeHost([HEADER, HOMEPAGE]);
    registerInstances([host]);

    await reloadRemote('homepage', 'Homepage', 2);

    expect(host.registerRemotes).toHaveBeenCalledWith(
      [{ ...HOMEPAGE, entry: 'https://homepage.example/remoteEntry.js?mf-retry=2' }],
      { force: true }
    );
  });

  it('loads the exposed module through the host, under its registered name', async () => {
    const host = fakeHost([HOMEPAGE]);
    registerInstances([host]);

    await expect(reloadRemote('homepage', 'Homepage', 1)).resolves.toBe(MODULE);
    expect(host.loadRemote).toHaveBeenCalledWith(`${HOMEPAGE.name}/Homepage`);
  });

  it('matches a remote registered under its plain name, with no alias', async () => {
    const host = fakeHost([HEADER]);
    registerInstances([host]);

    await reloadRemote('header', 'Header', 1);

    expect(host.loadRemote).toHaveBeenCalledWith('header/Header');
  });

  it('replaces an earlier retry parameter instead of stacking them', async () => {
    const host = fakeHost([{ ...HEADER, entry: `${HEADER.entry}?mf-retry=1` }]);
    registerInstances([host]);

    await reloadRemote('header', 'Header', 2);

    expect(host.registerRemotes.mock.calls[0]?.[0][0].entry).toBe(`${HEADER.entry}?mf-retry=2`);
  });

  it('rejects as a load failure when the host returns no module', async () => {
    registerInstances([fakeHost([HOMEPAGE], null)]);

    await expect(reloadRemote('homepage', 'Homepage', 1)).rejects.toThrow(
      'Error loading remote homepage'
    );
  });

  it('returns null when no federation host registers the remote', () => {
    const host = fakeHost([HEADER]);
    registerInstances([host]);

    expect(reloadRemote('homepage', 'Homepage', 1)).toBeNull();
    expect(host.registerRemotes).not.toHaveBeenCalled();
  });

  it('returns null when there is no federation host at all', () => {
    registerInstances([]);

    expect(reloadRemote('footer', 'Footer', 1)).toBeNull();
  });
});
