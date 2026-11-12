/* ============================================================
   COF2 Compagnon — Service worker
   Cache-first pour un fonctionnement 100 % hors ligne.
   Incrémentez CACHE_VERSION à chaque modification des fichiers
   listés ci-dessous pour forcer leur mise à jour chez les joueurs.
   ============================================================ */
var CACHE_VERSION = 'cof2-v62';

var FICHIERS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'assets/icon.svg',
  'css/styles.css',

  'js/data/rules.js',
  'js/data/peuples.js',
  'js/data/peuples-compagnon.js',
  'js/data/equipement.js',
  'js/data/profils-aventuriers.js',
  'js/data/profils-combattants.js',
  'js/data/profils-mages.js',
  'js/data/profils-mystiques.js',
  'js/data/profils-compagnon.js',
  'js/data/domaines-pretre.js',
  'js/data/atlas-mage.js',
  'js/data/atlas-mystique.js',
  'js/data/historique.js',
  'js/data/prestige-generiques.js',
  'js/data/prestige-aventurier.js',
  'js/data/prestige-combattant.js',
  'js/data/prestige-mage.js',
  'js/data/prestige-mystique.js',
  'js/data/prestige-compagnon.js',
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
  'js/data/voyage.js',
  'js/data/donjon.js',
  'js/data/objets-magiques.js',
  'js/data/armes-recettes.js',
  'js/data/catalogue-compagnon.js',
  'js/data/artisanat.js',
  'js/data/objet-prestigieux.js',
  'js/data/intrigue.js',
  'js/data/solo.js',

  'js/core/procedural.js',
  'js/core/dice.js',
  'js/core/calc.js',
  'js/core/effets.js',
  'js/core/compagnons.js',
  'js/core/rencontre.js',
  'js/core/pnj.js',
  'js/core/recompense.js',
  'js/core/arene.js',
  'js/core/narration.js',
  'js/core/oracle.js',
  'js/core/carnet.js',
  'js/core/expedition.js',
  'js/core/aventure.js',
  'js/core/sauvegarde.js',
  'js/core/monde.js',
  'js/core/directeur.js',
  'js/core/conteur.js',
  'js/core/imprevus.js',
  'js/core/villes.js',
  'js/core/saga.js',
  'js/core/chronique.js',
  'js/core/campagne.js',
  'js/core/missions.js',
  'js/core/loisirs.js',
  'js/core/factions.js',
  'js/core/dialogues.js',
  'js/core/troupe.js',
  'js/core/echos.js',
  'js/core/saisons.js',
  'js/core/lieux.js',
  'js/core/quetes.js',
  'js/core/voyage.js',
  'js/core/donjon.js',
  'js/core/objets-magiques.js',
  'js/core/arme-magique.js',
  'js/core/armure-magique.js',
  'js/core/artisanat.js',
  'js/core/objet-prestigieux.js',
  'js/core/intrigue.js',
  'js/core/solo.js',
  'js/core/store.js',

  'js/ui/app.js',
  'js/ui/niveau.js',
  'js/ui/selects.js',
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
  'js/ui/carnet.js',
  'js/ui/reglages.js',
  'js/ui/compagnie.js',
  'js/ui/marche.js',
  'js/ui/lieux.js',
  'js/ui/quetes.js',
  'js/ui/voyage.js',
  'js/ui/donjon.js',
  'js/ui/objets-magiques.js',
  'js/ui/arme-magique.js',
  'js/ui/armure-magique.js',
  'js/ui/catalogue.js',
  'js/ui/artisanat.js',
  'js/ui/objet-prestigieux.js',
  'js/ui/intrigue.js',
  'js/ui/solo.js',
  'js/ui/des.js'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      /* « reload » : contourne le cache HTTP du navigateur pour avoir les fichiers neufs */
      return cache.addAll(FICHIERS.map(function (u) { return new Request(u, { cache: 'reload' }); }));
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

/* Stratégie :
   - la page (navigation) : réseau d'abord, cache si hors ligne ;
   - les fichiers de l'app (JS, CSS, icônes) : cache seul. Ils sont tous
     versionnés par CACHE_VERSION : une nouvelle version du service worker
     les retélécharge d'un coup à l'installation. Plus de revalidation des
     ~100 fichiers à chaque lancement (moins de données et de batterie,
     démarrage plus rapide sur téléphone).
   - un fichier absent du cache : réseau, puis mis en cache. */
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then(function (net) {
        if (net && net.ok) { var cl = net.clone(); caches.open(CACHE_VERSION).then(function (cache) { cache.put('./index.html', cl); }); }
        return net;
      }).catch(function () { return caches.match('./index.html').then(function (r) { return r || caches.match(e.request); }); })
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function (reponse) {
      if (reponse) return reponse;
      return fetch(e.request).then(function (net) {
        if (net && net.ok) { var cl = net.clone(); caches.open(CACHE_VERSION).then(function (cache) { cache.put(e.request, cl); }); }
        return net;
      });
    })
  );
});
