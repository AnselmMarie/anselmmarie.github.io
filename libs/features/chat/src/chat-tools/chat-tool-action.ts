import {
  CHAT_NAVIGATE_EVENT,
  type ChatNavigateDetail,
  type ChatStreamEvent,
  parseChatToolCall,
  portfolioHref,
} from '@portfolio/shared-chat-contract';
import { anchorHref, HOME_PATH } from '@portfolio/shared-utils';

export type ChatToolCallEvent = Extract<ChatStreamEvent, { type: 'tool-call' }>;

/** What the browser does for a valid tool call. */
export type ChatToolAction =
  | { readonly kind: 'scroll'; readonly id: string }
  | { readonly kind: 'navigate'; readonly href: string };

/**
 * Turns a `tool-call` event into the action that carries it out, or `null` when
 * the call fails the contract's schemas (ai-chat B3: re-validated in the
 * browser, and anything invalid is ignored).
 *
 * `scroll_to` scrolls in place on the homepage. Anywhere else the section isn't
 * on the page, so it becomes a navigation to `/#id`, the same rule the
 * header's section links follow (`anchorHref`, D43).
 */
export const toChatToolAction = (
  event: ChatToolCallEvent,
  pathname: string
): ChatToolAction | null => {
  const call = parseChatToolCall(event.name, event.input);
  if (!call) return null;
  if (call.name === 'navigate') return { kind: 'navigate', href: portfolioHref(call.slug) };
  if (pathname === HOME_PATH) return { kind: 'scroll', id: call.sectionId };

  return { kind: 'navigate', href: anchorHref(call.sectionId, pathname) };
};

/**
 * Carries an action out. A scroll uses the DOM directly, since the section is
 * on this page. A navigation is handed to the shell as a `portfolio:navigate`
 * event (ai-chat D14): the chat is a remote and never imports the router.
 */
export const runChatToolAction = (action: ChatToolAction): void => {
  if (action.kind === 'scroll') {
    document.getElementById(action.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  window.dispatchEvent(
    new CustomEvent<ChatNavigateDetail>(CHAT_NAVIGATE_EVENT, { detail: { href: action.href } })
  );
};
