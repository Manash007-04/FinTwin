const CACHE_NAME = 'fintwin-v1';
const urlsToCache = [
    '/',
    '/login',
    '/register',
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    // Simple cache-first strategy for static assets, network-first for others
    if (event.request.destination === 'image' || event.request.destination === 'style') {
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                })
        );
    } else {
        // For API and pages, try network first, fall back to cache isn't fully implemented 
        // because we rely on Zustand persistence for data.
        event.respondWith(fetch(event.request));
    }
});
