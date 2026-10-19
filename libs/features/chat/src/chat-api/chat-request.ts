import {
  CHAT_MAX_MESSAGE_CHARS,
  CHAT_MAX_TOTAL_CHARS,
  CHAT_MAX_TURNS,
  type ChatRequest,
  type ChatTurn,
} from '@portfolio/shared-chat';

import type { ChatMessage } from '../chat-transcript/chat-transcript.js';

/** The path the chat POSTs to, on the page's own origin (CloudFront routes it, Slice 4). */
export const CHAT_API_PATH = '/api/chat';

const totalChars = (turns: readonly ChatTurn[]): number =>
  turns.reduce((sum, turn) => sum + turn.content.length, 0);

/**
 * The conversation as `POST /api/chat` takes it (D5): the history so far plus
 * the visitor's new message, trimmed to A4's caps so the Lambda never has to
 * refuse a long conversation.
 *
 * - **Status bubbles are left out.** "Resting", "blocked" and "error" are the
 *   client's own words, not the model's, so sending them back as assistant
 *   turns would put text in the model's mouth.
 * - **The oldest turns go first**: down to the last `CHAT_MAX_TURNS`, then
 *   until the whole conversation fits `CHAT_MAX_TOTAL_CHARS`. The new message
 *   always stays. The Lambda drops any turns left before the first user turn.
 */
export const toChatRequest = (history: readonly ChatMessage[], text: string): ChatRequest => {
  const turns: ChatTurn[] = [
    ...history
      .filter((message) => !message.status)
      .map((message) => ({ role: message.role, content: message.text })),
    { role: 'user', content: text.trim().slice(0, CHAT_MAX_MESSAGE_CHARS) },
  ];

  let kept = turns.slice(-CHAT_MAX_TURNS);
  while (kept.length > 1 && totalChars(kept) > CHAT_MAX_TOTAL_CHARS) kept = kept.slice(1);

  return { messages: kept as ChatRequest['messages'] };
};

/**
 * The hex SHA-256 of a request body (D24). A POST through CloudFront's OAC to
 * a Lambda Function URL must carry it as `x-amz-content-sha256`, or the
 * function answers 403. It must hash the **exact** string sent.
 */
export const sha256Hex = async (body: string): Promise<string> => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
};
