import { describe, expect, it } from 'vitest';

import { toBedrockMessages } from './to-bedrock-messages.js';

const user = (content: string) => ({ role: 'user' as const, content });
const assistant = (content: string) => ({ role: 'assistant' as const, content });

describe('toBedrockMessages', () => {
  it('maps an alternating conversation one to one', () => {
    expect(toBedrockMessages([user('hi'), assistant('hello'), user('work?')])).toEqual([
      { role: 'user', content: [{ text: 'hi' }] },
      { role: 'assistant', content: [{ text: 'hello' }] },
      { role: 'user', content: [{ text: 'work?' }] },
    ]);
  });

  it('drops an assistant turn with no text and joins the user turns around it', () => {
    expect(toBedrockMessages([user('show me'), assistant('  '), user('thanks')])).toEqual([
      { role: 'user', content: [{ text: 'show me\n\nthanks' }] },
    ]);
  });

  it('drops turns before the first user turn', () => {
    expect(toBedrockMessages([assistant('Hi! Ask me anything.'), user('hello')])).toEqual([
      { role: 'user', content: [{ text: 'hello' }] },
    ]);
  });

  it('returns nothing when no user turn has text', () => {
    expect(toBedrockMessages([assistant('hello')])).toEqual([]);
  });
});
