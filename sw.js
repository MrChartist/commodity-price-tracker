/* Service worker: app shell cache, network-first so a new release is never mixed with old files. Live data is never cached. */
const VERSION = 'v5';
const CACHE = 'cpt-' + VERSION;
// Relative URLs resolve against this file, so the same code works at / or at a sub-path such as /commodity-price-tracker/.
const SHELL = ['./', 'index.html', 'docs.html', 'about.html', 'vendor/lightweight-charts.standalone.production.js', 'style.css', 'config.js', 'app.js', 'pwa-register.js', 'favicon.svg', 'favicon.ico', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
// Cross-origin static assets safe to cache (fonts). Everything else cross-origin (spot, FX and the raw.githubusercontent.com price snapshot) is network-only.
const STATIC_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

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
  if (/\/data\//.test(url.pathname)) return; // local dev data files: always network, never cached
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }).catch(() =>
        caches.match(req).then((hit) => hit || caches.match(/\/docs(\.html)?$/.test(url.pathname) ? 'docs.html' : /\/about(\.html)?$/.test(url.pathname) ? 'about.html' : './'))
      )
    );
    return;
  }
  // Same-origin shell files: network first, cache only as the offline fallback, so HTML, JS and CSS always match.
  e.respondWith(
    fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then((h) => h || Response.error()))
  );
});
