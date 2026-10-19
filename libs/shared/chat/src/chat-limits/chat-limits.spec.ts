import { describe, expect, it } from 'vitest';

import { CHAT_MAX_MESSAGE_CHARS, CHAT_MAX_TOTAL_CHARS, CHAT_MAX_TURNS } from './chat-limits.js';

describe('chat limits (A4)', () => {
  it('states the caps guardrails.md sets', () => {
    expect(CHAT_MAX_MESSAGE_CHARS).toBe(500);
    expect(CHAT_MAX_TURNS).toBe(12);
    expect(CHAT_MAX_TOTAL_CHARS).toBe(6000);
  });

  it('lets a full-length message fit inside the total', () => {
    expect(CHAT_MAX_MESSAGE_CHARS).toBeLessThan(CHAT_MAX_TOTAL_CHARS);
  });
});
