const CACHE = 'vietnam2026-v1';
const RECURSOS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'img/portada.jpg',
  'img/icono-192.png',
  'img/icono-512.png',
  'img/bat-trang.jpg',
  'img/catba.jpg',
  'img/comida-banh-beo.jpg',
  'img/comida-banh-cuon.jpg',
  'img/comida-banh-mi.jpg',
  'img/comida-banh-xeo.jpg',
  'img/comida-bia-hoi.jpg',
  'img/comida-bun-bo-hue.jpg',
  'img/comida-bun-cha.jpg',
  'img/comida-ca-phe-sua-da.jpg',
  'img/comida-cafe-huevo.jpg',
  'img/comida-cao-lau.jpg',
  'img/comida-cha-ca.jpg',
  'img/comida-che.jpg',
  'img/comida-com-chay.jpg',
  'img/comida-com-ga.jpg',
  'img/comida-com-hen.jpg',
  'img/comida-de-nui.jpg',
  'img/comida-goi-cuon.jpg',
  'img/comida-marisco.jpg',
  'img/comida-mi-quang.jpg',
  'img/comida-nem-lui.jpg',
  'img/comida-nem-ran.jpg',
  'img/comida-pho.jpg',
  'img/comida-street.jpg',
  'img/comida-white-rose.jpg',
  'img/hai-van-pass.jpg',
  'img/hanoi-catedral.jpg',
  'img/hanoi-dong-xuan.jpg',
  'img/hanoi-hoan-kiem.jpg',
  'img/hanoi-mausoleo.jpg',
  'img/hanoi-old-quarter.jpg',
  'img/hanoi-pagoda-un-pilar.jpg',
  'img/hanoi-templo-literatura.jpg',
  'img/hanoi-train-street.jpg',
  'img/hoian-an-bang.jpg',
  'img/hoian-casco.jpg',
  'img/hoian-farolillos.jpg',
  'img/hoian-puente-japones.jpg',
  'img/hoian-rio.jpg',
  'img/hue-ciudad-imperial.jpg',
  'img/hue-khai-dinh.jpg',
  'img/hue-thien-mu.jpg',
  'img/lang-co.jpg',
  'img/lanha-bay.jpg',
  'img/lanha-crucero.jpg',
  'img/lanha-kayak.jpg',
  'img/marble-mountains.jpg',
  'img/ninhbinh-bich-dong.jpg',
  'img/ninhbinh-hang-mua.jpg',
  'img/ninhbinh-hoa-lu.jpg',
  'img/ninhbinh-tam-coc.jpg',
  'img/ninhbinh-trang-an.jpg',
  'img/phongnha-cueva.jpg',
  'img/phongnha-paisaje.jpg',
  'img/phongnha-paradise.jpg'
];

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));

// Cache-first para lo nuestro: una vez guardado, funciona sin conexión.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request, {ignoreSearch: true}).then(hit =>
      hit || fetch(e.request).then(resp => {
        if (resp.ok) { const copia = resp.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); }
        return resp;
      }).catch(() => caches.match('index.html', {ignoreSearch: true}))
    )
  );
});

// Descarga completa bajo demanda, informando del progreso.
self.addEventListener('message', async e => {
  if (!e.data || e.data.tipo !== 'GUARDAR') return;
  const cliente = e.source;
  const cache = await caches.open(CACHE);
  let hechos = 0;
  for (const r of RECURSOS) {
    try { await cache.add(new Request(r, {cache: 'reload'})); } catch (err) {}
    hechos++;
    cliente && cliente.postMessage({tipo: 'PROGRESO', hechos, total: RECURSOS.length});
  }
  cliente && cliente.postMessage({tipo: 'LISTO', total: RECURSOS.length});
});
