import { describe, expect, it } from 'vitest';

import type { ChatStreamEvent } from './chat-stream-event.js';
import { parseChatStreamEvent } from './parse-chat-stream-event.js';

const EVERY_EVENT: ChatStreamEvent[] = [
  { type: 'text-delta', text: 'Hi' },
  { type: 'tool-call', name: 'navigate', input: { slug: 'cosmikata' } },
  { type: 'done' },
  { type: 'resting', reason: 'ip' },
  { type: 'resting', reason: 'global' },
  { type: 'disabled' },
  { type: 'blocked' },
  { type: 'error', code: 'upstream' },
];

describe('parseChatStreamEvent', () => {
  it.each(EVERY_EVENT)('accepts a $type event as sent', (event) => {
    expect(parseChatStreamEvent(event)).toEqual(event);
  });

  it('leaves a tool call’s input for the tool’s own schema to judge', () => {
    expect(
      parseChatStreamEvent({ type: 'tool-call', name: 'scroll_to', input: 'anything' })
    ).toEqual({ type: 'tool-call', name: 'scroll_to', input: 'anything' });
  });

  it.each([
    ['an unknown type', { type: 'shell', command: 'ls' }],
    ['an unknown tool', { type: 'tool-call', name: 'fetch', input: {} }],
    ['a delta with no text', { type: 'text-delta' }],
    ['an unknown resting reason', { type: 'resting', reason: 'forever' }],
    ['a non-object', 'done'],
    ['null', null],
  ])('rejects %s', (_, value) => {
    expect(parseChatStreamEvent(value)).toBeNull();
  });
});
