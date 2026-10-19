import { describe, expect, it } from 'vitest';

import type { ChatStreamEventType } from '@portfolio/shared-chat';

import {
  CHAT_BLOCKED,
  CHAT_DISABLED,
  CHAT_ERROR,
  CHAT_RESTING,
} from '../chat-copy/chat-copy.const.js';
import {
  applyChatEvent,
  type ChatMessage,
  isTurnEnd,
  startTurn,
  takeFailedTurn,
} from './chat-transcript.js';

const GREETING: ChatMessage = { id: 'g', role: 'assistant', text: 'Hi' };

describe('startTurn', () => {
  it('appends the visitor message and an empty assistant bubble, without touching the input', () => {
    const before = [GREETING];
    const after = startTurn(before, 'Who is he?', 't1');

    expect(after).toEqual([
      GREETING,
      { id: 't1-user', role: 'user', text: 'Who is he?' },
      { id: 't1-assistant', role: 'assistant', text: '' },
    ]);
    expect(before).toEqual([GREETING]);
  });
});

describe('applyChatEvent', () => {
  it('grows the last assistant bubble on a text-delta', () => {
    const turn = startTurn([GREETING], 'q', 't1');

    const once = applyChatEvent(turn, { type: 'text-delta', text: 'Mostly ' });
    const twice = applyChatEvent(once, { type: 'text-delta', text: 'front-end.' });

    expect(twice.at(-1)?.text).toBe('Mostly front-end.');
    expect(turn.at(-1)?.text).toBe('');
  });

  it('ignores a text-delta when the last bubble is the visitor’s', () => {
    const messages: readonly ChatMessage[] = [{ id: 'u', role: 'user', text: 'q' }];

    expect(applyChatEvent(messages, { type: 'text-delta', text: 'x' })).toBe(messages);
  });

  it('ignores a text-delta on an empty transcript', () => {
    const messages: readonly ChatMessage[] = [];

    expect(applyChatEvent(messages, { type: 'text-delta', text: 'x' })).toBe(messages);
  });

  it('returns the same array for an event that carries no text', () => {
    const turn = startTurn([GREETING], 'q', 't1');

    expect(applyChatEvent(turn, { type: 'done' })).toBe(turn);
  });

  it('notes where a valid tool call moved the page, on the reply that made it', () => {
    const turn = applyChatEvent(startTurn([GREETING], 'q', 't1'), {
      type: 'text-delta',
      text: 'Here',
    });

    const moved = applyChatEvent(turn, {
      type: 'tool-call',
      name: 'scroll_to',
      input: { sectionId: 'work' },
    });

    expect(moved.at(-1)).toEqual({
      id: 't1-assistant',
      role: 'assistant',
      text: 'Here',
      note: 'Work',
    });
    expect(turn.at(-1)?.note).toBeUndefined();
  });

  it('adds no note for an invalid tool call', () => {
    const turn = startTurn([GREETING], 'q', 't1');

    expect(
      applyChatEvent(turn, { type: 'tool-call', name: 'navigate', input: { slug: 'nope' } })
    ).toBe(turn);
  });

  it('adds no note when the last bubble is the visitor’s', () => {
    const messages: readonly ChatMessage[] = [{ id: 'u', role: 'user', text: 'q' }];

    expect(
      applyChatEvent(messages, {
        type: 'tool-call',
        name: 'scroll_to',
        input: { sectionId: 'work' },
      })
    ).toBe(messages);
  });
});

describe('applyChatEvent, when the chat can’t answer (Slice 5)', () => {
  const streamed = applyChatEvent(startTurn([GREETING], 'q', 't1'), {
    type: 'text-delta',
    text: 'Half an answ',
  });

  it.each([
    ['resting', { type: 'resting', reason: 'global' }, CHAT_RESTING],
    ['disabled', { type: 'disabled' }, CHAT_DISABLED],
    ['blocked', { type: 'blocked' }, CHAT_BLOCKED],
    ['error', { type: 'error', code: 'upstream' }, CHAT_ERROR],
  ] as const)('replaces the reply with the %s copy, and marks it', (status, event, text) => {
    expect(applyChatEvent(streamed, event).at(-1)).toEqual({
      id: 't1-assistant',
      role: 'assistant',
      text,
      status,
    });
    expect(streamed.at(-1)?.status).toBeUndefined();
  });

  it('drops a note along with the half-answer, since the status replaces the reply', () => {
    const noted: readonly ChatMessage[] = [{ ...GREETING, note: 'Work' }];

    expect(applyChatEvent(noted, { type: 'blocked' }).at(-1)?.note).toBeUndefined();
  });
});

describe('takeFailedTurn', () => {
  const failed = applyChatEvent(startTurn([GREETING], 'Who is he?', 't1'), {
    type: 'error',
    code: 'network',
  });

  it('returns the question and the transcript before it, for a retry', () => {
    expect(takeFailedTurn(failed)).toEqual({ messages: [GREETING], text: 'Who is he?' });
  });

  it('returns null when the last reply did not fail', () => {
    expect(takeFailedTurn(startTurn([GREETING], 'q', 't1'))).toBeNull();
    expect(
      takeFailedTurn(applyChatEvent(startTurn([GREETING], 'q', 't1'), { type: 'blocked' }))
    ).toBeNull();
  });

  it('returns null when the failed bubble does not follow a visitor message', () => {
    expect(takeFailedTurn([{ ...GREETING, status: 'error' }])).toBeNull();
  });
});

describe('isTurnEnd', () => {
  it.each<[ChatStreamEventType, boolean]>([
    ['text-delta', false],
    ['tool-call', false],
    ['done', true],
    ['resting', true],
    ['disabled', true],
    ['blocked', true],
    ['error', true],
  ])('%s ends the turn: %s', (type, expected) => {
    const events = {
      'text-delta': { type: 'text-delta', text: '' },
      'tool-call': { type: 'tool-call', name: 'navigate', input: {} },
      done: { type: 'done' },
      resting: { type: 'resting', reason: 'ip' },
      disabled: { type: 'disabled' },
      blocked: { type: 'blocked' },
      error: { type: 'error', code: 'x' },
    } as const;

    expect(isTurnEnd(events[type])).toBe(expected);
  });
});
