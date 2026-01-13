import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PageLoader } from '@/components/ui/PageLoader';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RK NextGen Technologies | AI & Software Innovation",
  description: "Leading the future of digital transformation with AI, Cloud, and Next-Gen Software Solutions.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
    apple: '/logo.png',
  },
};

import Script from "next/script";

import { Suspense } from 'react';
import { AnalyticsTracker } from '@/components/analytics/AnalyticsTracker';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EBQ939M16X"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EBQ939M16X');
          `}
        </Script>
      </head>
      <body className={`${inter.className} bg-black text-white antialiased selection:bg-cyan/30 selection:text-cyan`}>
        <PageLoader />
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
