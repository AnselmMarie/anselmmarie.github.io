import type { Message } from '@aws-sdk/client-bedrock-runtime';

import type { ChatTurn } from '@portfolio/shared-chat';

/**
 * The client's conversation as Bedrock's Converse API accepts it.
 *
 * Converse rejects an empty text block, a conversation that opens on the
 * assistant, and two turns in a row from the same role. The client can produce
 * all three without doing anything wrong (a tool-only reply has no text, and
 * A4's trimming can cut the first user turn), so they're repaired here instead
 * of rejected:
 *
 * 1. assistant turns with no text are dropped;
 * 2. turns before the first user turn are dropped;
 * 3. consecutive turns from one role are joined with a blank line.
 */
export const toBedrockMessages = (turns: readonly ChatTurn[]): Message[] => {
  const withText = turns.filter((turn) => turn.content.trim() !== '');
  const firstUser = withText.findIndex((turn) => turn.role === 'user');
  const fromUser = firstUser === -1 ? [] : withText.slice(firstUser);

  // Each run of same-role turns becomes one message, emitted at the run's first turn.
  return fromUser.flatMap((turn, index): Message[] => {
    if (fromUser[index - 1]?.role === turn.role) return [];
    const rest = fromUser.slice(index);
    const end = rest.findIndex((next) => next.role !== turn.role);
    const run = end === -1 ? rest : rest.slice(0, end);
    const text = run.map((next) => next.content).join('\n\n');
    return [{ role: turn.role, content: [{ text }] }];
  });
};
