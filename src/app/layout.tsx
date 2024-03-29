import { ReactElement } from 'react';

import { Theme } from '@radix-ui/themes';
import type { Metadata } from 'next';

import './globals.css';
import '@radix-ui/themes/styles.css';

export const metadata: Metadata = {
  title: 'Anselm Marie Portfolio',
  description:
    'Anselm Marie is a seasoned full-stack engineer with more than a decade of experience, coupled with expertise in UI/UX design.',
};

export default function RootLayout({
  children,
}: {
  children: ReactElement;
}): ReactElement {
  return (
    <html lang="en">
      <body className={`prose prose-slate max-w-full`}>
        <Theme>{children}</Theme>
      </body>
    </html>
  );
}
