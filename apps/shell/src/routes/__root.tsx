import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import type { ReactElement, ReactNode } from 'react';

import { SITE_ORIGIN } from '@portfolio/shared-config';
import { HOME_METADATA, SITE_NAME } from '@portfolio/shared-fixtures';
import { absoluteUrl } from '@portfolio/shared-utils';

import appCss from '../styles.css?url';

/**
 * D48 — the shell emits `<title>`, description and Open Graph **server-side**,
 * from the fixtures, while D36 keeps every visible surface federated and
 * client-rendered. The root route carries the site-wide defaults; each route
 * overrides the ones that differ.
 */
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: HOME_METADATA.title },
      { name: 'description', content: HOME_METADATA.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:title', content: HOME_METADATA.title },
      { property: 'og:description', content: HOME_METADATA.description },
      { property: 'og:url', content: absoluteUrl(SITE_ORIGIN, HOME_METADATA.path) },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      /*
       * Q20 → D82 — the three families come from the Google Fonts CDN.
       *
       * ⚠️ **A `<link>` here, not an `@import` in CSS, and that is not a
       * style preference.** Slice 10 first put
       * `@import url('https://fonts.googleapis.com/...')` at the top of
       * `libs/ui/theme/src/theme.css`; Vite's CSS pipeline **silently dropped
       * it**. The build was green, the page rendered, and the served
       * stylesheet contained no `@import` and no `@font-face` — the site just
       * showed system fallbacks. Caught by looking at `document.fonts` in the
       * running page, which is the only thing that could have caught it.
       *
       * A `<link>` is also the faster shape: a CSS `@import` cannot start its
       * request until the importing stylesheet has been fetched and parsed,
       * which serializes two round trips. The design export uses `<link>` too.
       *
       * ⚠️ **Slice 8 owns the CSP consequence:** `style-src` must allow
       * `https://fonts.googleapis.com` and `font-src`
       * `https://fonts.gstatic.com`, or these are blocked in production and
       * the site silently falls back again.
       */
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Carlito:wght@400;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap',
      },
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  component: RootComponent,
});

const RootDocument = ({ children }: Readonly<{ children: ReactNode }>): ReactElement => {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
};

function RootComponent(): ReactElement {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}
