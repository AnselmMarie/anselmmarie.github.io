import { afterEach, describe, expect, it, vi } from 'vitest';

import { CHAT_WAF_SDK_URL, createWafFetchLoader, wafScriptUrl } from './load-waf-fetch.js';

const SDK_URL = 'https://abc.us-east-1.sdk.awswaf.com/abc/def/';

const injectedScripts = (): HTMLScriptElement[] =>
  [...document.head.querySelectorAll('script')].filter((script) =>
    script.src.endsWith('/challenge.js')
  );

const ok = (): Promise<Response> => Promise.resolve(new Response('plain'));

describe('createWafFetchLoader', () => {
  afterEach(() => {
    for (const script of injectedScripts()) script.remove();
    Reflect.deleteProperty(window, 'AwsWafIntegration');
    vi.unstubAllGlobals();
  });

  it('has no SDK URL outside a deploy build, so dev and e2e use plain fetch', () => {
    expect(CHAT_WAF_SDK_URL).toBeUndefined();
  });

  it('uses plain fetch, and injects nothing, when no SDK URL is configured', async () => {
    const fetchSpy = vi.fn(ok);
    vi.stubGlobal('fetch', fetchSpy);

    const chatFetch = await createWafFetchLoader(undefined)();
    await chatFetch('/api/chat', { method: 'POST' });

    expect(fetchSpy).toHaveBeenCalledWith('/api/chat', { method: 'POST' });
    expect(injectedScripts()).toHaveLength(0);
  });

  it('loads challenge.js from the integration URL, and then sends through the SDK', async () => {
    const sdkFetch = vi.fn(ok);
    const load = createWafFetchLoader(SDK_URL)();
    const [script] = injectedScripts();

    Object.assign(window, { AwsWafIntegration: { fetch: sdkFetch } });
    script?.dispatchEvent(new Event('load'));
    const chatFetch = await load;
    await chatFetch('/api/chat', { method: 'POST' });

    expect(script?.src).toBe(`${SDK_URL}challenge.js`);
    expect(sdkFetch).toHaveBeenCalledWith('/api/chat', { method: 'POST' });
  });

  it('injects the script once however many sends ask for it', () => {
    const loader = createWafFetchLoader(SDK_URL);

    void loader();
    void loader();

    expect(injectedScripts()).toHaveLength(1);
  });

  it('falls back to plain fetch when the script fails, so the send still goes out', async () => {
    const fetchSpy = vi.fn(ok);
    vi.stubGlobal('fetch', fetchSpy);
    const load = createWafFetchLoader(SDK_URL)();

    injectedScripts()[0]?.dispatchEvent(new Event('error'));
    await (await load)('/api/chat', { method: 'POST' });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('falls back to plain fetch when the script loads but defines no SDK', async () => {
    const fetchSpy = vi.fn(ok);
    vi.stubGlobal('fetch', fetchSpy);
    const load = createWafFetchLoader(SDK_URL)();

    injectedScripts()[0]?.dispatchEvent(new Event('load'));
    await (await load)('/api/chat', { method: 'POST' });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});

describe('wafScriptUrl', () => {
  it.each([
    ['with a trailing slash', SDK_URL],
    ['without one', SDK_URL.slice(0, -1)],
  ])('joins the script name onto the integration URL %s', (_, url) => {
    expect(wafScriptUrl(url)).toBe(`${SDK_URL}challenge.js`);
  });
});
