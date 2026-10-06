import { afterEach, describe, expect, it, vi } from 'vitest';

import { CHAT_NAVIGATE_EVENT } from '@portfolio/shared-chat';

import { type ChatToolCallEvent, runChatToolAction, toChatToolAction } from './chat-tool-action.js';

const call = (name: string, input: unknown): ChatToolCallEvent =>
  ({ type: 'tool-call', name, input }) as ChatToolCallEvent;

describe('toChatToolAction', () => {
  it('scrolls in place for scroll_to on the homepage', () => {
    expect(toChatToolAction(call('scroll_to', { sectionId: 'work' }), '/')).toEqual({
      kind: 'scroll',
      id: 'work',
    });
  });

  it('navigates to the homepage section for scroll_to on any other page', () => {
    expect(
      toChatToolAction(call('scroll_to', { sectionId: 'work' }), '/portfolio/cosmikata')
    ).toEqual({ kind: 'navigate', href: '/#work' });
  });

  it('navigates to the portfolio page for navigate', () => {
    expect(toChatToolAction(call('navigate', { slug: 'cosmikata' }), '/')).toEqual({
      kind: 'navigate',
      href: '/portfolio/cosmikata',
    });
  });

  it.each([
    ['an unknown section', call('scroll_to', { sectionId: 'admin' })],
    ['an unknown slug', call('navigate', { slug: 'nope' })],
    ['an unknown tool', call('open_url', { url: 'https://evil.example' })],
    ['extra fields', call('navigate', { slug: 'cosmikata', href: '//evil.example' })],
  ])('ignores %s', (_case, event) => {
    expect(toChatToolAction(event, '/')).toBeNull();
  });
});

describe('runChatToolAction', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('scrolls the section into view', () => {
    const section = document.createElement('section');
    section.id = 'work';
    section.scrollIntoView = vi.fn();
    document.body.append(section);

    runChatToolAction({ kind: 'scroll', id: 'work' });

    expect(section.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });

  it('does nothing when the section is not on the page', () => {
    expect(() => runChatToolAction({ kind: 'scroll', id: 'work' })).not.toThrow();
  });

  it('hands a navigation to the shell as a portfolio:navigate event', () => {
    const listener = vi.fn();
    window.addEventListener(CHAT_NAVIGATE_EVENT, listener);

    runChatToolAction({ kind: 'navigate', href: '/portfolio/cosmikata' });
    window.removeEventListener(CHAT_NAVIGATE_EVENT, listener);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { href: '/portfolio/cosmikata' } })
    );
  });
});
