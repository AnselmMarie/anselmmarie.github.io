import { describe, expect, it } from 'vitest';

import type { ChatStreamEventType } from '@portfolio/shared-chat-contract';

import { applyChatEvent, type ChatMessage, isTurnEnd, startTurn } from './chat-transcript.js';

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
