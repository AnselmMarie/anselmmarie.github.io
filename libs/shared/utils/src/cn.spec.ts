import { describe, expect, it } from 'vitest';

import { cn } from './cn.js';

describe('cn', () => {
  it('resolves a Tailwind conflict in favour of the last class', () => {
    expect(cn('p-10', 'p-4')).toBe('p-4');
  });

  it('keeps non-conflicting classes and moves the winner to the end', () => {
    expect(cn('rounded-2xl border border-slate-200 bg-page p-10 shadow-sm', 'p-4')).toBe(
      'rounded-2xl border border-slate-200 bg-page shadow-sm p-4'
    );
  });

  it('treats a theme token and a raw palette class as the same conflict group', () => {
    expect(cn('bg-page text-ink', 'bg-white')).toBe('text-ink bg-white');
  });

  it('drops falsy values', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
  });

  it('accepts a conditional object', () => {
    expect(cn({ block: true, hidden: false })).toBe('block');
  });

  it('accepts an array', () => {
    expect(cn(['flex', 'items-center'])).toBe('flex items-center');
  });

  it('returns an empty string for no input', () => {
    expect(cn()).toBe('');
  });
});
