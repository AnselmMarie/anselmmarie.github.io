import type { Metadata } from 'next';

import { Theme } from '@radix-ui/themes';
import './globals.css';
import { ReactElement } from 'react';

export const metadata: Metadata = {
  title: 'Anselm Marie Portfolio',
  description:
    'Anselm Marie is a seasoned full-stack engineer with more than a decade of experience, coupled with expertise in UI/UX design.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps): ReactElement {
  return (
    <html lang="en">
      <body className={`prose prose-slate max-w-full`}>
        <Theme>{children}</Theme>
      </body>
    </html>
  );
}