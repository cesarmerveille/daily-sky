const CACHE = "dailysky-v9";
const ASSETS = ["./", "index.html", "style.css?v=9", "app.js?v=9", "cities.js?v=9", "engine.js?v=9", "lore.js?v=9", "astronomy.browser.min.js", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-180.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const same = e.request.url.startsWith(self.location.origin);
  e.respondWith((same ? fetch(e.request.url, { cache: "no-cache" }) : fetch(e.request)).then(r => { const copy = r.clone(); if (r.ok && (e.request.url.startsWith(self.location.origin) || e.request.url.includes("fonts.g"))) caches.open(CACHE).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request).then(m => m || caches.match("index.html"))));
});
