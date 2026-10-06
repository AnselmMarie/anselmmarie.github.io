import { describe, expect, it } from 'vitest';

import { PORTFOLIO_ITEMS, SECTION_IDS } from '@portfolio/shared-fixtures';

import { CHAT_PORTFOLIO_SLUGS, CHAT_SECTION_IDS, parseChatToolCall } from './chat-tools.js';

const SLUG = PORTFOLIO_ITEMS[0]?.slug ?? '';

describe('the tool enums', () => {
  it('lists every homepage section and every portfolio slug', () => {
    expect(CHAT_SECTION_IDS).toEqual(Object.values(SECTION_IDS));
    expect(CHAT_PORTFOLIO_SLUGS).toEqual(PORTFOLIO_ITEMS.map((item) => item.slug));
  });
});

describe('parseChatToolCall', () => {
  it('accepts scroll_to with a real section', () => {
    expect(parseChatToolCall('scroll_to', { sectionId: 'work' })).toEqual({
      name: 'scroll_to',
      sectionId: 'work',
    });
  });

  it('accepts navigate with a real slug', () => {
    expect(parseChatToolCall('navigate', { slug: SLUG })).toEqual({ name: 'navigate', slug: SLUG });
  });

  it.each([
    ['an unknown section', 'scroll_to', { sectionId: 'admin' }],
    ['an unknown slug', 'navigate', { slug: 'not-a-project' }],
    ['an unknown tool', 'fetch_url', { url: 'https://evil.example' }],
    ['an extra field', 'scroll_to', { sectionId: 'work', href: 'javascript:alert(1)' }],
    ['a missing field', 'navigate', {}],
    ['a non-object input', 'scroll_to', 'work'],
    ['a section sent to the wrong tool', 'navigate', { slug: 'work' }],
  ])('rejects %s', (_case, name, input) => {
    expect(parseChatToolCall(name, input)).toBeNull();
  });
});
