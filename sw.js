const CACHE_VERSION = 'mysearch-' + Date.now();
const CACHE_NAME = CACHE_VERSION;

self.addEventListener('install', e => {
  self.skipWaiting(); // 즉시 활성화
});

self.addEventListener('activate', e => {
  // 이전 캐시 전부 삭제
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // 캐시 안 씀 - 항상 네트워크에서 최신 파일 로드
  if (e.request.url.includes('supabase.co') ||
      e.request.url.includes('cdn.jsdelivr.net')) {
    return; // CDN은 그냥 통과
  }
  e.respondWith(
    fetch(e.request).catch(() =>
      caches.match(e.request) // 오프라인일 때만 캐시 사용
    )
  );
});
