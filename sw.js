/* Service worker: app shell cache + stale-while-revalidate. Live price/proxy APIs are never cached. */
const VERSION = 'v3';
const CACHE = 'cpt-' + VERSION;
const SHELL = ['/', '/docs', '/style.css', '/app.js', '/pwa-register.js', '/favicon.svg', '/favicon.ico', '/manifest.webmanifest',
  '/icons/icon-192.png', '/icons/icon-512.png', '/icons/apple-touch-icon.png'];
// Cross-origin static assets safe to cache (library + fonts). Everything else cross-origin (price APIs, CORS proxies) is network-only.
const STATIC_HOSTS = ['unpkg.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(SHELL.map((u) => c.add(u).catch(() => {})))));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('cpt-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });

function swr(req) {
  return caches.open(CACHE).then((cache) =>
    cache.match(req).then((hit) => {
      const net = fetch(req).then((res) => {
        if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
        return res;
      });
      if (hit) { net.catch(() => {}); return hit; }
      return net;
    })
  );
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) {
    if (STATIC_HOSTS.includes(url.hostname)) e.respondWith(swr(req).catch(() => Response.error()));
    return; // price APIs and proxies: browser network only, never cached
  }
  if (url.pathname.startsWith('/api/')) return; // live data endpoints: network only, never cached
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }).catch(() =>
        caches.match(req).then((hit) => hit || caches.match(url.pathname.startsWith('/docs') ? '/docs' : '/'))
      )
    );
    return;
  }
  e.respondWith(swr(req).catch(() => caches.match(req).then((h) => h || Response.error())));
});
