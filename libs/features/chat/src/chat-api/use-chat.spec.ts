import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CHAT_GREETING } from '../chat-copy/chat-copy.const.js';
import {
  mockChatFetch,
  mockStreamingChatFetch,
  reply,
} from '../test-helpers/chat-fetch.test-helpers.js';
import useChat from './use-chat.js';

/**
 * The hook's own edges. What a visitor sees is specced through `Chat` in
 * `chat-states.spec.tsx`; these are the guards no screen can show.
 */
describe('useChat', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts with the greeting, idle and enabled', () => {
    const { result } = renderHook(() => useChat({ onToolCall: vi.fn() }));

    expect(result.current.messages).toEqual([
      { id: 'greeting', role: 'assistant', text: CHAT_GREETING },
    ]);
    expect(result.current.isStreaming).toBe(false);
    expect(result.current.isDisabled).toBe(false);
  });

  it('aborts the request when the chat unmounts mid-reply', async () => {
    const stream = mockStreamingChatFetch();
    const { result, unmount } = renderHook(() => useChat({ onToolCall: vi.fn() }));

    act(() => result.current.send('Who is he?'));
    await waitFor(() => expect(stream.fetchMock).toHaveBeenCalledTimes(1));
    const init = stream.fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    unmount();

    expect(init[1].signal?.aborted).toBe(true);
  });

  it('does nothing on retry when the last reply did not fail', async () => {
    const fetchMock = mockChatFetch(reply('Fine.'));
    const { result } = renderHook(() => useChat({ onToolCall: vi.fn() }));

    act(() => result.current.send('Who is he?'));
    await waitFor(() => expect(result.current.isStreaming).toBe(false));
    act(() => result.current.retry());

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('hands every tool call to the latest onToolCall, before validation', async () => {
    const first = vi.fn();
    const latest = vi.fn();
    const call = { type: 'tool-call', name: 'navigate', input: { slug: 'nope' } } as const;
    mockChatFetch(reply('Ok.', call));
    const { result, rerender } = renderHook(({ onToolCall }) => useChat({ onToolCall }), {
      initialProps: { onToolCall: first },
    });

    rerender({ onToolCall: latest });
    act(() => result.current.send('Go'));
    await waitFor(() => expect(latest).toHaveBeenCalledWith(call));

    expect(first).not.toHaveBeenCalled();
  });

  it('ignores anything after the event that ended the turn', async () => {
    mockChatFetch([{ type: 'done' }, { type: 'text-delta', text: 'late' }]);
    const { result } = renderHook(() => useChat({ onToolCall: vi.fn() }));

    act(() => result.current.send('Hi'));
    await waitFor(() => expect(result.current.isStreaming).toBe(false));

    expect(result.current.messages.at(-1)?.text).toBe('');
  });
});
