// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nexai.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'NexAI - Free AI SaaS Platform',
    template: '%s | NexAI',
  },
  description: 'সবচেয়ে শক্তিশালী AI SaaS প্ল্যাটফর্ম। চ্যাট, কন্টেন্ট লেখা, কোড জেনারেশন এবং আরও অনেক কিছু।',
  keywords: 'AI, ChatGPT, Content Generator, Code Generator, Translator',
  authors: [{ name: 'NexAI Team' }],
  creator: 'NexAI',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    url: siteUrl,
    siteName: 'NexAI',
    title: 'NexAI - Free AI SaaS Platform',
    description: 'সবচেয়ে শক্তিশালী AI SaaS প্ল্যাটফর্ম',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexAI - Free AI SaaS Platform',
    description: 'সবচেয়ে শক্তিশালী AI SaaS প্ল্যাটফর্ম',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'dark';
                if (theme === 'dark') document.documentElement.classList.add('dark');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100`}>
        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <Footer />

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '0.5rem',
            },
          }}
        />
      </body>
    </html>
  );
}
