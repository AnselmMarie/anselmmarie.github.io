import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CHAT_NAVIGATE_EVENT } from '@portfolio/shared-chat-contract';

import { useChatNavigateListener } from './use-chat-navigate-listener.js';

const navigate = vi.fn(() => Promise.resolve());

vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({ navigate }),
}));

const dispatch = (detail: unknown): void => {
  window.dispatchEvent(new CustomEvent(CHAT_NAVIGATE_EVENT, { detail }));
};

describe('useChatNavigateListener', () => {
  beforeEach(() => {
    navigate.mockClear();
  });

  it.each(['/', '/#work', '/portfolio/cosmikata'])('navigates to an allowed href: %s', (href) => {
    renderHook(() => useChatNavigateListener());

    dispatch({ href });

    expect(navigate).toHaveBeenCalledWith({ href });
  });

  it.each([
    ['an unknown slug', { href: '/portfolio/nope' }],
    ['an absolute URL', { href: 'https://evil.example' }],
    ['a protocol-relative URL', { href: '//evil.example' }],
    ['a javascript: URL', { href: 'javascript:alert(1)' }],
    ['a non-string href', { href: 42 }],
    ['no detail', null],
  ])('ignores %s', (_case, detail) => {
    renderHook(() => useChatNavigateListener());

    dispatch(detail);

    expect(navigate).not.toHaveBeenCalled();
  });

  it('ignores a plain Event with the same name', () => {
    renderHook(() => useChatNavigateListener());

    window.dispatchEvent(new Event(CHAT_NAVIGATE_EVENT));

    expect(navigate).not.toHaveBeenCalled();
  });

  it('stops listening on unmount', () => {
    const { unmount } = renderHook(() => useChatNavigateListener());
    unmount();

    dispatch({ href: '/' });

    expect(navigate).not.toHaveBeenCalled();
  });
});
