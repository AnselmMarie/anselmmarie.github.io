import { useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';

import { CHAT_NAVIGATE_EVENT, isAllowedHref } from '@portfolio/shared-chat';

const hrefOf = (event: Event): string | null => {
  if (!(event instanceof CustomEvent)) return null;
  const detail: unknown = event.detail;
  if (typeof detail !== 'object' || detail === null || !('href' in detail)) return null;

  return typeof detail.href === 'string' ? detail.href : null;
};

/**
 * The shell's half of ai-chat D14. The chat remote never imports the router, so
 * it asks for a route change with a `portfolio:navigate` event on `window`;
 * this hook carries it out with `router.navigate`.
 *
 * ⚠️ **The href is re-checked here**, against the same allow-list the chat
 * used. Any script on the page can dispatch a `window` event, so the shell
 * doesn't trust that it came from the chat: only the homepage, its sections
 * and real portfolio pages get through. A `/#section` target is scrolled to by
 * the homepage remote's existing hash re-apply once it mounts (D43).
 */
export const useChatNavigateListener = (): void => {
  const router = useRouter();

  useEffect(() => {
    const onNavigate = (event: Event): void => {
      const href = hrefOf(event);
      if (href && isAllowedHref(href)) void router.navigate({ href });
    };

    window.addEventListener(CHAT_NAVIGATE_EVENT, onNavigate);
    return () => window.removeEventListener(CHAT_NAVIGATE_EVENT, onNavigate);
  }, [router]);
};
