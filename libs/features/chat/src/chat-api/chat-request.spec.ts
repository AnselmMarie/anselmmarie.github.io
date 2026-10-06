import { describe, expect, it } from 'vitest';

import {
  CHAT_MAX_MESSAGE_CHARS,
  CHAT_MAX_TOTAL_CHARS,
  CHAT_MAX_TURNS,
  chatRequestSchema,
} from '@portfolio/shared-chat';

import type { ChatMessage } from '../chat-transcript/chat-transcript.js';
import { sha256Hex, toChatRequest } from './chat-request.js';

const turn = (index: number, text = `message ${index}`): ChatMessage => ({
  id: `m${index}`,
  role: index % 2 === 0 ? 'user' : 'assistant',
  text,
});

describe('toChatRequest', () => {
  it('sends the history, then the new message, as the Lambda’s schema accepts it', () => {
    const request = toChatRequest(
      [{ id: 'greeting', role: 'assistant', text: 'Hi!' }, turn(0), turn(1)],
      'And the backend?'
    );

    expect(request.messages).toEqual([
      { role: 'assistant', content: 'Hi!' },
      { role: 'user', content: 'message 0' },
      { role: 'assistant', content: 'message 1' },
      { role: 'user', content: 'And the backend?' },
    ]);
    expect(chatRequestSchema.safeParse(request).success).toBe(true);
  });

  it('leaves out the client’s own status bubbles', () => {
    const request = toChatRequest(
      [turn(0), { id: 'm1', role: 'assistant', text: 'Try again later', status: 'error' }],
      'Again?'
    );

    expect(request.messages.map((message) => message.content)).toEqual(['message 0', 'Again?']);
  });

  it('keeps only the last CHAT_MAX_TURNS turns, the new message among them', () => {
    const history = Array.from({ length: 30 }, (_, index) => turn(index));

    const request = toChatRequest(history, 'Newest');

    expect(request.messages).toHaveLength(CHAT_MAX_TURNS);
    expect(request.messages.at(-1)).toEqual({ role: 'user', content: 'Newest' });
    expect(chatRequestSchema.safeParse(request).success).toBe(true);
  });

  it('drops the oldest turns until the conversation fits CHAT_MAX_TOTAL_CHARS', () => {
    // Visitor turns at 400 (under A4's per-message cap), replies at 2,000: 7,200 in all.
    const history = Array.from({ length: 6 }, (_, index) =>
      turn(index, (index % 2 === 0 ? 'q' : 'a').repeat(index % 2 === 0 ? 400 : 2000))
    );

    const request = toChatRequest(history, 'Short');
    const total = request.messages.reduce((sum, message) => sum + message.content.length, 0);

    expect(total).toBeLessThanOrEqual(CHAT_MAX_TOTAL_CHARS);
    expect(request.messages).toHaveLength(5);
    expect(chatRequestSchema.safeParse(request).success).toBe(true);
  });

  it('trims the new message and caps it at CHAT_MAX_MESSAGE_CHARS', () => {
    const request = toChatRequest([], `  ${'y'.repeat(CHAT_MAX_MESSAGE_CHARS + 50)}  `);

    expect(request.messages[0]?.content).toHaveLength(CHAT_MAX_MESSAGE_CHARS);
  });
});

describe('sha256Hex', () => {
  it('hashes the body as Lambda’s OAC check does: lowercase hex SHA-256 (D24)', async () => {
    expect(await sha256Hex('')).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    );
    expect(await sha256Hex('{"messages":[]}')).toMatch(/^[0-9a-f]{64}$/);
  });
});
