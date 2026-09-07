const CACHE_NAME = "sagacite-cache-v1";
const FILES_TO_CACHE = [
  "/Sagacite.html",
  "/manifest.json"
];

// عند تثبيت الـ service worker، نخزن الملفات الأساسية في الكاش
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// حذف أي كاش قديم عند التفعيل
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// تقديم الملفات من الكاش أولاً، وإذا لم تتوفر نجلبها من الشبكة
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
