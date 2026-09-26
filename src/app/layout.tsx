import { ReactElement } from 'react';

// Retired UI: kept for reference, re-enable with the <Theme> render below.
// import { Theme } from '@radix-ui/themes';
import type { Metadata } from 'next';

import './globals.css';
import '@radix-ui/themes/styles.css';

// This version of the site has been retired; every page forwards to the new site.
const REDIRECT_URL = 'https://anselmmarie.com';

export const metadata: Metadata = {
  title: 'Anselm Marie Portfolio',
  description:
    'Anselm Marie is a seasoned full-stack engineer with more than a decade of experience, coupled with expertise in UI/UX design.',
  alternates: { canonical: REDIRECT_URL },
};

// Retired UI: the original signature, restore it to render pages again.
// export default function RootLayout({
//   children,
// }: {
//   children: ReactElement;
// }): ReactElement {
export default function RootLayout(): ReactElement {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="refresh" content={`0; url=${REDIRECT_URL}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.location.replace(${JSON.stringify(REDIRECT_URL)});`,
          }}
        />
      </head>
      <body className={`prose prose-slate max-w-full`}>
        {/* Retired UI: pages are no longer rendered so nothing shows before the redirect. */}
        {/* <Theme>{children}</Theme> */}
      </body>
    </html>
  );
}
