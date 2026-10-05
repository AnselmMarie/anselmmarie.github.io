import { CHAT_PORTFOLIO_SLUGS, CHAT_SECTION_IDS } from '../chat-tools/chat-tools.js';

/**
 * How the chat remote asks the shell to change route (ai-chat D14).
 *
 * The chat never imports the router (D43 kept the header off the router
 * singleton for the same reason), so it dispatches this `CustomEvent` on
 * `window` and the shell root, which owns the router, carries it out.
 */
export const CHAT_NAVIGATE_EVENT = 'portfolio:navigate';

export interface ChatNavigateDetail {
  readonly href: string;
}

const HOME = '/';
const PORTFOLIO_PREFIX = '/portfolio/';
const HOME_SECTION_PREFIX = '/#';

/**
 * Whether an href is one the chat may send the visitor to: the homepage, one of
 * its sections, or a portfolio page that exists. Exact matches only, so an
 * absolute URL, a protocol-relative `//host`, a `javascript:` URL or a path
 * with anything appended can never pass. The shell checks this again on
 * receipt, because a `window` event can come from any script on the page.
 */
export const isAllowedHref = (href: string): boolean => {
  if (href === HOME) return true;
  if (href.startsWith(HOME_SECTION_PREFIX)) {
    return CHAT_SECTION_IDS.includes(href.slice(HOME_SECTION_PREFIX.length));
  }
  if (href.startsWith(PORTFOLIO_PREFIX)) {
    return CHAT_PORTFOLIO_SLUGS.includes(href.slice(PORTFOLIO_PREFIX.length));
  }

  return false;
};

/** The href of a portfolio page, for the `navigate` tool. */
export const portfolioHref = (slug: string): string => `${PORTFOLIO_PREFIX}${slug}`;
