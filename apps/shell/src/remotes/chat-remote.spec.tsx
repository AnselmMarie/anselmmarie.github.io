import { render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * ai-chat D15 — the chat is the one remote whose failure draws nothing. These
 * run the real `MfeRemoteMount`, so the fallback under test is the one the
 * wrapper actually hands it.
 */

vi.mock('@tanstack/react-router', () => ({
  ClientOnly: ({ children }: { children: ReactNode }): ReactNode => children,
}));

const loadWrapper = async () => (await import('./chat-remote.js')).default;

describe('ChatRemote', () => {
  afterEach(() => {
    vi.doUnmock('chat/Chat');
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('mounts the federated chat module', async () => {
    const ChatRemote = await loadWrapper();
    render(<ChatRemote />);

    expect(await screen.findByTestId('federated-stub')).toBeInTheDocument();
  });

  it('renders nothing at all, and does not throw, when the remote fails to load', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.doMock('chat/Chat', () => {
      throw new Error('remoteEntry.js 404');
    });
    const ChatRemote = await loadWrapper();

    const { container } = render(<ChatRemote />);

    await waitFor(() => expect(screen.queryByTestId('mfe-loading')).not.toBeInTheDocument());
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByTestId('mfe-fallback-chat')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
