import { describe, expect, it } from 'vitest';

import { placeholder } from './portfolio-item-placeholder.js';

const INPUT = {
  slug: 'some-project',
  title: 'Some Project',
  company: 'Some Company',
  tech: ['React'],
  year: '2024',
  lede: 'A summary line.',
};

describe('placeholder', () => {
  it('fills the unauthored fields with blanks when only the required ones are given', () => {
    const item = placeholder(INPUT);

    expect(item).toMatchObject({ ...INPUT, subtitle: '', thumbnail: '', role: '' });
    expect(item.images).toEqual([]);
    expect(item.videos).toEqual([]);
    expect(item.links).toEqual([]);
    expect(item.body).toEqual([]);
    expect(item.description).toBe('<p>Details coming soon.</p>');
    expect(item.facts).toEqual([
      { key: 'Timeline', value: '' },
      { key: 'Role', value: '' },
      { key: 'Focus', value: '' },
    ]);
  });

  it('keeps the facts, body and description it is given', () => {
    const facts = [
      { key: 'Timeline', value: '1 year' },
      { key: 'Role', value: 'Lead' },
      { key: 'Focus', value: 'Delivery' },
    ];
    const item = placeholder({ ...INPUT, facts, body: ['One.'], description: '<ul></ul>' });

    expect(item.facts).toEqual(facts);
    expect(item.body).toEqual(['One.']);
    expect(item.description).toBe('<ul></ul>');
  });
});
