import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CHAT_GREETING } from '../chat-copy/chat-copy.const.js';
import {
  CHAT_STUB_FALLBACK,
  CHAT_STUB_REPLIES,
  CHAT_STUB_TOOL_REPLIES,
} from './chat-replies.fixture.js';
import useChatStub, {
  pickStubReply,
  STUB_CHARS_PER_TICK,
  STUB_TICK_MS,
  toStubEvents,
} from './use-chat-stub.js';

const BACKEND = CHAT_STUB_REPLIES[2]?.reply ?? '';
const WORK = CHAT_STUB_TOOL_REPLIES[2];

const options = { onToolCall: vi.fn() };

/** Enough ticks to play `reply` to its `done`. */
const ticksFor = (reply: string): number => Math.ceil(reply.length / STUB_CHARS_PER_TICK) + 1;

describe('pickStubReply', () => {
  it('matches a keyword case-insensitively', () => {
    expect(pickStubReply('What about his BACKEND work?').reply).toBe(BACKEND);
  });

  it.each([
    ['What kind of projects does he lead?', 0],
    ['Has he led teams before?', 1],
    ['Is he open to new work?', 3],
  ])('answers the design’s sample question %j with its drawn answer', (question, index) => {
    expect(pickStubReply(question)).toBe(CHAT_STUB_REPLIES[index]);
  });

  it('falls back when nothing matches', () => {
    expect(pickStubReply('Write me a poem').reply).toBe(CHAT_STUB_FALLBACK);
  });

  it('matches a reply that moves the page before a plain one', () => {
    expect(pickStubReply('Show me the Cosmikata project').toolCall).toEqual({
      name: 'navigate',
      input: { slug: 'cosmikata' },
    });
  });
});

describe('toStubEvents', () => {
  it('splits the reply into deltas that rebuild it, then ends with done', () => {
    const events = toStubEvents({ keywords: [], reply: 'abcdefghij' });
    const text = events.map((event) => (event.type === 'text-delta' ? event.text : '')).join('');

    expect(text).toBe('abcdefghij');
    expect(events.at(-1)).toEqual({ type: 'done' });
    expect(events).toHaveLength(Math.ceil(10 / STUB_CHARS_PER_TICK) + 1);
  });

  it('plays the tool call after the text and before done', () => {
    const toolCall = { name: 'scroll_to', input: { sectionId: 'work' } } as const;
    const events = toStubEvents({ keywords: [], reply: 'abc', toolCall });

    expect(events.slice(-2)).toEqual([{ type: 'tool-call', ...toolCall }, { type: 'done' }]);
  });
});

describe('useChatStub', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    options.onToolCall.mockClear();
  });

  it('hands each tool call to onToolCall as it plays, and only then', () => {
    const { result } = renderHook(() => useChatStub(options));

    act(() => result.current.send('Show me your work'));
    act(() => vi.advanceTimersByTime(STUB_TICK_MS * ticksFor(WORK?.reply ?? '')));

    expect(options.onToolCall).toHaveBeenCalledTimes(1);
    expect(options.onToolCall).toHaveBeenCalledWith({ type: 'tool-call', ...WORK?.toolCall });
    expect(result.current.isStreaming).toBe(true);

    act(() => vi.advanceTimersByTime(STUB_TICK_MS));

    expect(result.current.isStreaming).toBe(false);
  });

  it('calls nothing for a reply without a tool call', () => {
    const { result } = renderHook(() => useChatStub(options));

    act(() => result.current.send('backend?'));
    act(() => vi.advanceTimersByTime(STUB_TICK_MS * ticksFor(BACKEND)));

    expect(options.onToolCall).not.toHaveBeenCalled();
  });

  it('starts with the greeting and nothing streaming', () => {
    const { result } = renderHook(() => useChatStub(options));

    expect(result.current.messages).toEqual([
      { id: 'greeting', role: 'assistant', text: CHAT_GREETING },
    ]);
    expect(result.current.isStreaming).toBe(false);
  });

  it('shows the question at once, then streams the scripted reply in', () => {
    const { result } = renderHook(() => useChatStub(options));

    act(() => result.current.send('Tell me about the backend'));

    expect(result.current.isStreaming).toBe(true);
    expect(result.current.messages.at(-2)).toMatchObject({
      role: 'user',
      text: 'Tell me about the backend',
    });
    expect(result.current.messages.at(-1)).toMatchObject({ role: 'assistant', text: '' });

    act(() => vi.advanceTimersByTime(STUB_TICK_MS));

    expect(result.current.messages.at(-1)?.text).toBe(BACKEND.slice(0, STUB_CHARS_PER_TICK));

    act(() => vi.advanceTimersByTime(STUB_TICK_MS * ticksFor(BACKEND)));

    expect(result.current.messages.at(-1)?.text).toBe(BACKEND);
    expect(result.current.isStreaming).toBe(false);
  });

  it('ignores a send while a reply is still playing', () => {
    const { result } = renderHook(() => useChatStub(options));

    act(() => result.current.send('backend?'));
    act(() => result.current.send('second'));

    expect(result.current.messages.filter((message) => message.role === 'user')).toHaveLength(1);
  });

  it('accepts the next send once the reply has finished', () => {
    const { result } = renderHook(() => useChatStub(options));

    act(() => result.current.send('backend?'));
    act(() => vi.advanceTimersByTime(STUB_TICK_MS * ticksFor(BACKEND)));
    act(() => result.current.send('second'));

    expect(result.current.messages.filter((message) => message.role === 'user')).toHaveLength(2);
  });

  it('stops its timer on unmount', () => {
    const { result, unmount } = renderHook(() => useChatStub(options));

    act(() => result.current.send('backend?'));
    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
