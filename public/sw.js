/**
 * 🇧🇫 BURKINA NEWS — SERVICE WORKER PWA & CACHE HORS-LIGNE
 * Conforme à la Phase F9.1 : lecture hors-ligne résiliente adaptée
 * aux conditions de connectivité dégradées du Sahel / Burkina Faso.
 */

const CACHE_NAME_STATIC = 'bn-static-v2';
const CACHE_NAME_DYNAMIC = 'bn-dynamic-v2';
const CACHE_NAME_API = 'bn-api-v2';

const PRECACHE_ASSETS = [
  '/',
  '/fr',
  '/en',
  '/fr/fil',
  '/en/fil',
  '/fr/offline',
  '/en/offline',
  '/manifest.json',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-icon.png'
];

// Installation : Mise en cache des ressources statiques critiques
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME_STATIC).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Pre-caching non-bloquant:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activation : Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (![CACHE_NAME_STATIC, CACHE_NAME_DYNAMIC, CACHE_NAME_API].includes(key)) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Stratégies de Fetch selon la nature de la ressource
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET et les requêtes admin ou websockets
  if (request.method !== 'GET') return;
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/admin')) return;

  // 1. Requêtes API publiques (/api/v1/articles, /api/v1/fil, /api/tracker, etc.)
  // Stratégie : Network First avec Fallback Cache (Stale-While-Revalidate pour la résilience)
  if (url.pathname.includes('/api/v1/') || url.pathname.startsWith('/api/tracker')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME_API).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return new Response(JSON.stringify({ error: 'offline', offline: true }), {
            headers: { 'Content-Type': 'application/json' },
            status: 503,
          });
        })
    );
    return;
  }

  // 2. Navigation de pages HTML (mode lecture hors-ligne)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME_DYNAMIC).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(async () => {
          // Si le réseau échoue, essayer la page demandée dans le cache dynamique
          const cachedPage = await caches.match(request);
          if (cachedPage) return cachedPage;

          // Sinon, renvoyer la page hors-ligne ou la page d'accueil de la langue
          const offlineFallback = url.pathname.startsWith('/en') ? '/en/offline' : '/fr/offline';
          const offlineResponse = await caches.match(offlineFallback);
          if (offlineResponse) return offlineResponse;

          const homeFallback = url.pathname.startsWith('/en') ? '/en' : '/fr';
          const homeResponse = await caches.match(homeFallback);
          if (homeResponse) return homeResponse;

          return caches.match('/');
        })
    );
    return;
  }

  // 3. Fichiers statiques (_next/static, images, fonts, icônes)
  // Stratégie : Cache First avec Network Fallback
  if (
    url.pathname.startsWith('/_next/static') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.woff2')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME_STATIC).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Comportement standard par défaut
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
