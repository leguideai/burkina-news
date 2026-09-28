import type { Metadata, Viewport } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const serif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'light',
  themeColor: '#F8F7F3',
};

export const metadata: Metadata = {
  title: 'Burkina News — L\'info juste, l\'info vraie',
  description: 'Actualités du Burkina Faso et du monde. Économie, Sécurité, Société, Agriculture.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
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
