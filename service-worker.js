/**
 * Service worker de Lash Academy Professional.
 *
 * Solo cachea los assets estaticos de la app (no hay datos dinamicos que
 * sincronizar). Objetivo: que la pantalla cargue al instante y siga siendo
 * usable con conexion inestable o sin conexion.
 *
 * Al hacer un deploy con cambios, subir el numero de version de CACHE_NAME
 * para que los dispositivos descarten el cache viejo.
 */
const CACHE_NAME = "lash-academy-v11";

/**
 * Lo que hace falta para dibujar la pantalla. Se cachea antes de dar por
 * instalado el service worker.
 */
const ASSETS_CRITICOS = [
  "./",
  "./index.html",
  "./config.js",
  "./manifest.json",
  "./assets/cintia.jpg",
  "./icons/icon.svg"
];

/**
 * Los PNG del ícono pesan bastante y no los usa la pantalla: los descarga el
 * sistema operativo al instalar la app. Se guardan igual, pero después, sin
 * frenar la instalación ni competir con la primera carga.
 */
const ASSETS_SECUNDARIOS = [
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) { return cache.addAll(ASSETS_CRITICOS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (names) {
        return Promise.all(
          names
            .filter(function (name) { return name !== CACHE_NAME; })
            .map(function (name) { return caches.delete(name); })
        );
      })
      .then(function () { return self.clients.claim(); })
      .then(function () {
        // Los íconos, recién ahora y sin bloquear nada. Si falla (por ejemplo
        // porque se cortó la conexión), no importa: la app funciona igual.
        return caches.open(CACHE_NAME).then(function (cache) {
          return cache.addAll(ASSETS_SECUNDARIOS).catch(function () {});
        });
      })
  );
});

self.addEventListener("fetch", function (event) {
  const request = event.request;

  // Solo interesan las lecturas de nuestro propio origen.
  if (request.method !== "GET") return;
  if (new URL(request.url).origin !== self.location.origin) return;

  // Navegacion: primero la red (para tomar la ultima version publicada),
  // y si no hay conexion, la pantalla cacheada.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(function () {
        return caches.match("./index.html").then(function (cached) {
          return cached || caches.match("./");
        });
      })
    );
    return;
  }

  // Resto de los assets: responder desde el cache al instante y actualizarlo
  // en segundo plano (stale-while-revalidate).
  event.respondWith(
    caches.match(request).then(function (cached) {
      const fromNetwork = fetch(request)
        .then(function (response) {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(request, copy);
            });
          }
          return response;
        })
        .catch(function () { return cached; });

      return cached || fromNetwork;
    })
  );
});
