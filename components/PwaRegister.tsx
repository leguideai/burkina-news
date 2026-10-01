'use client';

import { useEffect } from 'react';

export default function PwaRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[PWA] Service Worker actif, scope:', registration.scope);
          })
          .catch((error) => {
            console.warn('[PWA] Échec enregistrement Service Worker:', error);
          });
      });
    }
  }, []);

  return null;
}
