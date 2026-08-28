import type { Metadata, Viewport } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const serif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif' });

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#F8F7F3',
};

export const metadata: Metadata = {
  title: 'Burkina News — L\'info juste, l\'info vraie',
  description: 'Actualités du Burkina Faso et du monde. Économie, Sécurité, Société, Agriculture.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${serif.variable} bg-[var(--paper)]`}>
      <body className="antialiased font-[family-name:var(--font-inter)]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
