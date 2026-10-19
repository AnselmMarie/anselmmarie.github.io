import { type ChatStreamEvent, parseChatStreamEvent } from '@portfolio/shared-chat';

/** Turns streamed text into contract events, whatever byte boundaries it arrives on. */
export interface NdjsonParser {
  /** Every complete line in `chunk` (plus whatever was left from the last one), as events. */
  readonly push: (chunk: string) => readonly ChatStreamEvent[];
  /** The final line, when the stream ended without a trailing newline. */
  readonly flush: () => readonly ChatStreamEvent[];
}

const parseLine = (line: string): ChatStreamEvent | null => {
  if (line.trim() === '') return null;
  try {
    return parseChatStreamEvent(JSON.parse(line));
  } catch {
    return null;
  }
};

const parseLines = (lines: readonly string[]): readonly ChatStreamEvent[] =>
  lines.map(parseLine).filter((event): event is ChatStreamEvent => event !== null);

/**
 * An NDJSON reader for the chat stream (ai-chat D11).
 *
 * A network chunk can end mid-line, so the unfinished tail is kept until the
 * next chunk completes it. A line that isn't JSON, or isn't a contract event,
 * is **dropped, not thrown**: one bad line must not cost the visitor the rest
 * of the reply. A reply that never sends an ending event is caught by
 * `use-chat`, not here.
 */
export const createNdjsonParser = (): NdjsonParser => {
  let pending = '';

  return {
    push: (chunk) => {
      const lines = (pending + chunk).split('\n');
      pending = lines.pop() ?? '';
      return parseLines(lines);
    },
    flush: () => {
      const last = pending;
      pending = '';
      return parseLines([last]);
    },
  };
};
