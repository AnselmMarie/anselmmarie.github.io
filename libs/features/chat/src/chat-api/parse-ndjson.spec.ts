import { describe, expect, it } from 'vitest';

import { createNdjsonParser } from './parse-ndjson.js';

const line = (value: unknown): string => `${JSON.stringify(value)}\n`;

describe('createNdjsonParser', () => {
  it('reads whole lines as events, in order', () => {
    const parser = createNdjsonParser();

    expect(parser.push(line({ type: 'text-delta', text: 'Hi' }) + line({ type: 'done' }))).toEqual([
      { type: 'text-delta', text: 'Hi' },
      { type: 'done' },
    ]);
  });

  it('holds a line split across chunks until it is complete', () => {
    const parser = createNdjsonParser();
    const whole = line({ type: 'text-delta', text: 'split here' });

    expect(parser.push(whole.slice(0, 12))).toEqual([]);
    expect(parser.push(whole.slice(12))).toEqual([{ type: 'text-delta', text: 'split here' }]);
  });

  it('reads a final line with no trailing newline on flush, once', () => {
    const parser = createNdjsonParser();

    expect(parser.push('{"type":"done"}')).toEqual([]);
    expect(parser.flush()).toEqual([{ type: 'done' }]);
    expect(parser.flush()).toEqual([]);
  });

  it('drops a line that is not JSON, and keeps reading', () => {
    const parser = createNdjsonParser();

    expect(parser.push(`<html>blocked</html>\n${line({ type: 'done' })}`)).toEqual([
      { type: 'done' },
    ]);
  });

  it('drops JSON that is not a contract event', () => {
    const parser = createNdjsonParser();

    expect(parser.push(line({ type: 'exec', command: 'rm -rf /' }))).toEqual([]);
  });

  it('skips blank lines', () => {
    expect(createNdjsonParser().push('\n\n')).toEqual([]);
  });
});
