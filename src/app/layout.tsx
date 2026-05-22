import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Geist, Bebas_Neue } from 'next/font/google';
// @ts-ignore: allow importing global css without type declarations
import './globals.css';

import { siteMetadata } from '@/data/siteMetadata';
import ThemeProvider from '@/providers/ThemeProvider';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { cn } from '@/lib/utils';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

const headingFont = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-heading',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl || 'http://localhost:3000'),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.headerTitle}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(geist.variable, headingFont.variable)}>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />

          <main className="min-h-screen">{children}</main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
