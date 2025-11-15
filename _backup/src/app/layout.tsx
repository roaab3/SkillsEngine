import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Skills Engine - Competency & Skills Dashboard',
  description: 'Track your skills, identify gaps, and accelerate your learning journey',
  keywords: ['skills', 'competency', 'learning', 'development', 'career'],
  authors: [{ name: 'Skills Engine Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#10b981',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-secondary-900 text-gray-900 dark:text-secondary-100 transition-colors duration-200`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

