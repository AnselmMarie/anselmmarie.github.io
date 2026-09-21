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
    links: [{ rel: 'stylesheet', href: appCss }],
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
