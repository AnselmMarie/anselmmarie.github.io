/**
 * Replaced at build time by `apps/chat/vite.config.ts` from
 * `PORTFOLIO_CHAT_WAF_SDK_URL`, which the deploy CLI reads from the stack's
 * `ChatWafIntegrationUrl` output (ai-chat D21, D26). Undefined in dev, e2e and
 * specs, where `typeof` keeps the read safe.
 */
declare const __PORTFOLIO_CHAT_WAF_SDK_URL__: string | undefined;

export const CHAT_WAF_SDK_URL: string | undefined =
  typeof __PORTFOLIO_CHAT_WAF_SDK_URL__ === 'string' && __PORTFOLIO_CHAT_WAF_SDK_URL__ !== ''
    ? __PORTFOLIO_CHAT_WAF_SDK_URL__
    : undefined;

/** The one fetch shape the chat needs. */
export type ChatFetch = (input: string, init: RequestInit) => Promise<Response>;

interface WafWindow {
  readonly AwsWafIntegration?: { readonly fetch?: ChatFetch };
}

/** Resolved at call time, so a stubbed global in a spec is the one used. */
const plainFetch: ChatFetch = (input, init) => fetch(input, init);

/** The SDK's script, under the web ACL's integration URL. */
export const wafScriptUrl = (sdkUrl: string): string =>
  `${sdkUrl.replace(/\/+$/, '')}/challenge.js`;

/**
 * A loader for the fetch the chat POSTs through (A1, D21).
 *
 * With an SDK URL, the first call injects AWS WAF's `challenge.js` once and
 * resolves to `AwsWafIntegration.fetch`, which solves the silent challenge and
 * attaches `x-aws-waf-token`. Without one (local dev, e2e), or if the script
 * fails to load, it resolves to plain `fetch`. The send still goes out, WAF
 * answers it with a challenge rather than a reply, and `use-chat` shows the
 * error state with a retry. Nothing about the challenge is ever on screen
 * (invented, design.md).
 */
export const createWafFetchLoader = (
  sdkUrl: string | undefined,
  doc?: Document
): (() => Promise<ChatFetch>) => {
  let loading: Promise<ChatFetch> | null = null;

  const inject = (url: string): Promise<ChatFetch> =>
    new Promise((resolve) => {
      // Read at the first send, not at import: the module must load where there's no DOM.
      const page = doc ?? document;
      const script = page.createElement('script');
      script.src = wafScriptUrl(url);
      script.async = true;
      script.addEventListener('load', () => {
        const sdk = (page.defaultView as (Window & WafWindow) | null)?.AwsWafIntegration;
        resolve(sdk?.fetch ? sdk.fetch.bind(sdk) : plainFetch);
      });
      script.addEventListener('error', () => resolve(plainFetch));
      page.head.append(script);
    });

  return () => {
    if (!sdkUrl) return Promise.resolve(plainFetch);
    loading ??= inject(sdkUrl);
    return loading;
  };
};
