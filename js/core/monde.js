/* ============================================================
   COF2 Compagnon — Carte du monde de l'aventure (jeu en solo)
   Les lieux du Carnet reçoivent une position sur une carte (0-100 ×
   0-64) et sont reliés par des routes (durée en jours, terrain).
   Le héros a une position courante. Les voyages partent d'un lieu
   vers un lieu relié, et chaque voyage terminé trace sa route.
   ============================================================ */
window.COF = window.COF || {};

COF.Monde = (function () {
  var L = 100, H = 64;
  function K() { return COF.Carnet; }
  function uid() { return 'rt_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }

  /* Une place libre, de préférence près d'un lieu de référence. */
  function placeLibre(c, pres) {
    var best = null, bestScore = -1;
    for (var i = 0; i < 40; i++) {
      var x, y;
      if (pres && pres.x !== undefined) { var a = Math.random() * Math.PI * 2, r = 14 + Math.random() * 14; x = pres.x + Math.cos(a) * r; y = pres.y + Math.sin(a) * r * 0.75; }
      else { x = 10 + Math.random() * (L - 20); y = 8 + Math.random() * (H - 16); }
      x = Math.max(8, Math.min(L - 8, x)); y = Math.max(6, Math.min(H - 8, y));
      var dmin = (c.lieux || []).reduce(function (m, l) {
        return l.x === undefined ? m : Math.min(m, Math.hypot(l.x - x, l.y - y));
      }, 999);
      if (dmin > bestScore) { bestScore = dmin; best = { x: Math.round(x), y: Math.round(y) }; }
    }
    return best;
  }
  function assurer(c) {
    c.routes = c.routes || [];
    (c.lieux || []).forEach(function (l) {
      if (l.x === undefined) { var p = placeLibre(c, lieu(c, c.position)); l.x = p.x; l.y = p.y; }
    });
    return c;
  }
  function lieu(c, id) { return (c.lieux || []).filter(function (l) { return l.id === id; })[0] || null; }
  function lieuParNom(c, nom) {
    var n = String(nom || '').trim().toLowerCase();
    return (c.lieux || []).filter(function (l) { return l.nom.trim().toLowerCase() === n; })[0] || null;
  }
  /* Trouve ou crée un lieu par son nom (placé près de `pres`). */
  function obtenirLieu(c, nom, pres, note) {
    var l = lieuParNom(c, nom);
    if (l) return l;
    l = K().ajouterListe(c, 'lieux', { nom: nom, note: note || '' });
    var p = placeLibre(c, pres); l.x = p.x; l.y = p.y;
    return l;
  }
  function route(c, a, b) {
    return (c.routes || []).filter(function (r) { return (r.a === a && r.b === b) || (r.a === b && r.b === a); })[0] || null;
  }
  function relier(c, a, b, jours, env) {
    assurer(c);
    if (!a || !b || a === b) return null;
    var r = route(c, a, b);
    if (r) { r.jours = jours; r.env = env || r.env; return r; }
    r = { id: uid(), a: a, b: b, jours: Math.max(1, jours || 1), env: env || 'plaine' };
    c.routes.push(r);
    return r;
  }
  function delier(c, id) { c.routes = (c.routes || []).filter(function (r) { return r.id !== id; }); }
  /* Routes partant d'un lieu, avec le lieu d'arrivée. */
  function voisins(c, id) {
    return (c.routes || []).filter(function (r) { return r.a === id || r.b === id; }).map(function (r) {
      return { route: r, lieu: lieu(c, r.a === id ? r.b : r.a) };
    }).filter(function (v) { return v.lieu; });
  }
  function ici(c) { return lieu(c, c.position); }
  function seRendre(c, id) { c.position = id; }

  return { L: L, H: H, assurer: assurer, lieu: lieu, lieuParNom: lieuParNom, obtenirLieu: obtenirLieu, placeLibre: placeLibre,
    route: route, relier: relier, delier: delier, voisins: voisins, ici: ici, seRendre: seRendre };
})();
