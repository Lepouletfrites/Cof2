/* ============================================================
   COF2 Compagnon — Service worker
   Cache-first pour un fonctionnement 100 % hors ligne.
   Incrémentez CACHE_VERSION à chaque modification des fichiers
   listés ci-dessous pour forcer leur mise à jour chez les joueurs.
   ============================================================ */
var CACHE_VERSION = 'cof2-v24';

var FICHIERS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'assets/icon.svg',
  'css/styles.css',

  'js/data/rules.js',
  'js/data/peuples.js',
  'js/data/equipement.js',
  'js/data/profils-aventuriers.js',
  'js/data/profils-combattants.js',
  'js/data/profils-mages.js',
  'js/data/profils-mystiques.js',
  'js/data/atlas-mage.js',
  'js/data/atlas-mystique.js',
  'js/data/historique.js',
  'js/data/prestige-generiques.js',
  'js/data/prestige-aventurier.js',
  'js/data/prestige-combattant.js',
  'js/data/prestige-mage.js',
  'js/data/prestige-mystique.js',
  'js/data/compagnons.js',
  'js/data/bestiaire-1.js',
  'js/data/bestiaire-2.js',
  'js/data/bestiaire-3.js',
  'js/data/bestiaire-supp-1.js',
  'js/data/bestiaire-supp-2.js',
  'js/data/bestiaire-supp-3.js',
  'js/data/pnj.js',
  'js/data/recompenses.js',
  'js/data/oracle.js',
  'js/data/lieux.js',
  'js/data/quetes.js',
  'js/data/tresors-nommes.js',
  'js/data/voyage.js',
  'js/data/donjon.js',
  'js/data/objets-magiques.js',
  'js/data/objet-prestigieux.js',

  'js/core/procedural.js',
  'js/core/dice.js',
  'js/core/calc.js',
  'js/core/compagnons.js',
  'js/core/rencontre.js',
  'js/core/pnj.js',
  'js/core/recompense.js',
  'js/core/arene.js',
  'js/core/oracle.js',
  'js/core/lieux.js',
  'js/core/quetes.js',
  'js/core/tresors-nommes.js',
  'js/core/voyage.js',
  'js/core/donjon.js',
  'js/core/objets-magiques.js',
  'js/core/objet-prestigieux.js',
  'js/core/store.js',

  'js/ui/app.js',
  'js/ui/champs-ui.js',
  'js/ui/persos.js',
  'js/ui/sheet.js',
  'js/ui/voies.js',
  'js/ui/objets.js',
  'js/ui/bestiaire.js',
  'js/ui/generateurs.js',
  'js/ui/pnj.js',
  'js/ui/arene.js',
  'js/ui/butin.js',
  'js/ui/oracle.js',
  'js/ui/lieux.js',
  'js/ui/quetes.js',
  'js/ui/tresors.js',
  'js/ui/voyage.js',
  'js/ui/donjon.js',
  'js/ui/objets-magiques.js',
  'js/ui/objet-prestigieux.js',
  'js/ui/des.js'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      return cache.addAll(FICHIERS);
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (noms) {
      return Promise.all(noms.filter(function (n) { return n !== CACHE_VERSION; })
        .map(function (n) { return caches.delete(n); }));
    }).then(function () { return self.clients.claim(); })
  );
});

/* Cache-first : sert le cache immédiatement, revalide en tâche de fond.
   Si la ressource est absente du cache, tente le réseau puis l'y ajoute. */
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  e.respondWith(
    caches.match(e.request).then(function (reponse) {
      var maj = fetch(e.request).then(function (net) {
        if (net && net.ok) {
          caches.open(CACHE_VERSION).then(function (cache) { cache.put(e.request, net.clone()); });
        }
        return net;
      }).catch(function () { return reponse; });
      return reponse || maj;
    })
  );
});
