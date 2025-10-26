import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Skills Engine - Competency & Skills Dashboard',
  description: 'Track your skills, identify gaps, and accelerate your learning journey',
  keywords: ['skills', 'competency', 'learning', 'development', 'career'],
  authors: [{ name: 'Skills Engine Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#10b981',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-secondary-900 text-secondary-100`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

