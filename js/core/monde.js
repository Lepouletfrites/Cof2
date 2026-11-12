/* ============================================================
   COF2 Compagnon — Carte du monde de l'aventure (jeu en solo)
   Les lieux du Carnet reçoivent une position sur une carte (0-100 ×
   0-64) et sont reliés par des routes (durée en jours, terrain).
   Le héros a une position courante. Les voyages partent d'un lieu
   vers un lieu relié, et chaque voyage terminé trace sa route.
   ============================================================ */
window.COF = window.COF || {};

COF.Monde = (function () {
  /* Le monde n'a pas de bord : L × H n'est que la zone de départ, où se
     place le premier lieu ; on peut ensuite s'étendre dans toutes les
     directions (déplacement et zoom de la carte). */
  var L = 300, H = 200;
  /* Type de terrain d'un lieu : mêmes environnements que les créatures. */
  function envDe(id) { return (COF.ENVIRONNEMENTS || []).filter(function (e) { return e.id === id; })[0] || null; }
  /* Devine le terrain d'après le nom ou la description. */
  function devinerEnv(txt) {
    var t = String(txt || '').toLowerCase();
    if (/grotte|caverne|mine|souterrain|gouffre|abysse|profondeur/.test(t)) return 'souterrain';
    if (/ruine|donjon|crypte|tombe|temple|tour |forteresse abandonn|catacombe/.test(t)) return 'ruines';
    if (/marais|marécage|lac|rivière|fleuve|côte|port|île|tourbière|bayou/.test(t)) return 'marais';
    if (/montagne|col |pic|colline|mont |falaise|massif/.test(t)) return 'montagne';
    if (/glace|neige|toundra|glacier|givre/.test(t)) return 'arctique';
    if (/forêt|bois|jungle|sylve|bosquet/.test(t)) return 'foret';
    if (/village|ville|cité|bourg|hameau|taverne|auberge|boutique|château|fort|capitale|marché/.test(t)) return 'urbain';
    if (/plaine|désert|steppe|lande|prairie|champ/.test(t)) return 'plaine';
    return null;
  }
  function K() { return COF.Carnet; }
  function uid() { return 'rt_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }

  /* Une place libre, de préférence près d'un lieu de référence. */
  function placeLibre(c, pres) {
    var best = null, bestScore = -1;
    for (var i = 0; i < 40; i++) {
      var x, y;
      if (pres && pres.x !== undefined) { var a = Math.random() * Math.PI * 2, r = 22 + Math.random() * 18; x = pres.x + Math.cos(a) * r; y = pres.y + Math.sin(a) * r * 0.75; }
      else if ((c.lieux || []).some(function (l) { return l.x !== undefined; })) { x = L / 2 + (Math.random() - 0.5) * 120; y = H / 2 + (Math.random() - 0.5) * 80; }
      else { x = L / 2; y = H / 2; }
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
      if (!l.env) l.env = devinerEnv(l.nom + ' ' + (l.note || '')) || envAuPoint(c, l.x, l.y) || 'plaine';
    });
    return c;
  }
  /* Cadre englobant les lieux (pour centrer la vue). */
  function cadre(c, autour) {
    var ls = (c.lieux || []).filter(function (l) { return l.x !== undefined; });
    /* autour du héros : seulement les lieux proches (un lieu très lointain n'écrase plus la vue) */
    var h = autour ? lieu(c, c.position) : null;
    if (h && h.x !== undefined) {
      var proches = ls.filter(function (l) { return Math.hypot(l.x - h.x, l.y - h.y) <= 140; });
      if (proches.length) ls = proches;
    }
    if (!ls.length) return { x: L / 2 - 50, y: H / 2 - 32, w: 100, h: 64 };
    var x0 = Math.min.apply(null, ls.map(function (l) { return l.x; })), x1 = Math.max.apply(null, ls.map(function (l) { return l.x; }));
    var y0 = Math.min.apply(null, ls.map(function (l) { return l.y; })), y1 = Math.max.apply(null, ls.map(function (l) { return l.y; }));
    var w = Math.max(70, (x1 - x0) + 48), h = Math.max(45, (y1 - y0) + 30);
    if (w / h > 100 / 64) h = w * 64 / 100; else w = h * 100 / 64;
    return { x: (x0 + x1) / 2 - w / 2, y: (y0 + y1) / 2 - h / 2, w: w, h: h };
  }
  function lieu(c, id) { return (c.lieux || []).filter(function (l) { return l.id === id; })[0] || null; }
  function lieuParNom(c, nom) {
    var n = String(nom || '').trim().toLowerCase();
    return (c.lieux || []).filter(function (l) { return l.nom.trim().toLowerCase() === n; })[0] || null;
  }
  /* Trouve ou crée un lieu par son nom (placé près de `pres`). */
  function obtenirLieu(c, nom, pres, note, env) {
    var l = lieuParNom(c, nom);
    if (l) { if (!l.env && env) l.env = env; return l; }
    l = K().ajouterListe(c, 'lieux', { nom: nom, note: note || '' });
    var p = placeLibre(c, pres); l.x = p.x; l.y = p.y;
    l.env = env || devinerEnv(nom + ' ' + (note || '')) || envAuPoint(c, l.x, l.y) || 'plaine';
    if (COF.Culture) COF.Culture.peupleLieu(c, l);   /* peuple dominant (celui du nom, s'il vient d'être inventé) */
    return l;
  }
  /* ---------- Régions : grandes zones de terrain ----------
     Cercles (centre, rayon) posés sur la carte. Un lieu ou une route
     sans terrain précis prend celui de la région où il se trouve
     (la plus petite qui le contient). */
  function regions(c) { return c.regions = c.regions || []; }
  function ajouterRegion(c, reg) {
    reg.id = 'rg_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    regions(c).push(reg);
    return reg;
  }
  function retirerRegion(c, id) { c.regions = regions(c).filter(function (r) { return r.id !== id; }); }
  function regionA(c, x, y) {
    return regions(c).filter(function (r) { return Math.hypot(r.x - x, r.y - y) <= r.r; })
      .sort(function (a, b) { return a.r - b.r; })[0] || null;
  }
  function envAuPoint(c, x, y) { var r = regionA(c, x, y); return r ? r.env : null; }

  /* ---------- Découverte en voyage ----------
     Un lieu inconnu apparaît le long de la route, avec un nom tiré
     selon le terrain traversé. */
  var NOMS_DEC = {
    foret: ['Clairière', 'Bosquet', 'Chêne', 'Sous-bois', 'Cabane du forestier'], plaine: ['Tertre', 'Moulin', 'Gué', 'Pierre levée', 'Ferme'],
    montagne: ['Col', 'Pic', 'Refuge', 'Défilé', 'Belvédère'], marais: ['Îlot', 'Tourbière', 'Hutte', 'Mare', 'Passerelle'],
    souterrain: ['Grotte', 'Gouffre', 'Mine', 'Galerie', 'Caverne'], arctique: ['Glacier', 'Cairn', 'Crevasse', 'Lac gelé', 'Igloo'],
    urbain: ['Hameau', 'Relais', 'Auberge', 'Poste de garde', 'Marché'], ruines: ['Ruines', 'Tour effondrée', 'Tombeau', 'Temple oublié', 'Fort abandonné']
  };
  var EPITHETES = ['du Corbeau', 'des Murmures', 'du Pendu', 'aux Loups', 'de la Vieille', 'du Sanglier', 'des Brumes', 'd’Argent', 'du Roi Mort',
    'des Ronces', 'de l’Ermite', 'aux Cendres', 'du Silence', 'de la Source', 'des Trois Pierres', 'du Gibet', 'de la Lune', 'des Ombres'];
  /* Nom de lieu inédit pour un terrain (« Clairière aux Loups »…). */
  function nomLieu(c, env) {
    var nom, essai = 0, h = ici(c);
    /* dans la culture de la région (nains, elfes, halfelins…) */
    var cu = COF.Culture ? COF.Culture.nommer(c, env, h ? h.x : L / 2, h ? h.y : H / 2) : null;
    if (cu && cu.nom) return cu.nom;
    do { nom = COF.piocher(NOMS_DEC[env] || NOMS_DEC.plaine) + ' ' + COF.piocher(EPITHETES); } while (lieuParNom(c, nom) && ++essai < 12);
    if (cu) COF.Culture.retenir(nom, cu.peuple);
    return nom;
  }
  function decouvrir(c, depart, dest, fraction, env) {
    if (!depart || !dest) return null;
    var x = depart.x + (dest.x - depart.x) * fraction, y = depart.y + (dest.y - depart.y) * fraction;
    var ang = Math.atan2(dest.y - depart.y, dest.x - depart.x) + Math.PI / 2 * (Math.random() < 0.5 ? 1 : -1);
    var dec = 8 + Math.random() * 10;
    x += Math.cos(ang) * dec; y += Math.sin(ang) * dec;
    var e = Math.random() < 0.25 ? COF.piocher(['ruines', 'souterrain', 'urbain']) : (env || envAuPoint(c, x, y) || 'plaine');
    var nom, essai = 0, cu = COF.Culture ? COF.Culture.nommer(c, e, x, y) : null;
    if (cu && cu.nom) nom = cu.nom;
    else do { nom = COF.piocher(NOMS_DEC[e] || NOMS_DEC.plaine) + ' ' + COF.piocher(EPITHETES); } while (lieuParNom(c, nom) && ++essai < 10);
    var l = K().ajouterListe(c, 'lieux', { nom: nom, note: 'Découvert en voyage le jour ' + c.jour + '.' });
    l.x = Math.round(x); l.y = Math.round(y); l.env = e;
    if (cu) l.peuple = cu.peuple;
    return l;
  }

  /* Terrain là où se trouve le héros (null si inconnu). */
  function envIci(c) { var l = ici(c); return l ? (l.env || devinerEnv(l.nom + ' ' + (l.note || ''))) : null; }
  function route(c, a, b) {
    return (c.routes || []).filter(function (r) { return (r.a === a && r.b === b) || (r.a === b && r.b === a); })[0] || null;
  }
  function relier(c, a, b, jours, env) {
    assurer(c);
    if (!a || !b || a === b) return null;
    var r = route(c, a, b);
    if (r) { r.jours = jours; r.env = env || r.env; return r; }
    /* sans terrain précisé : celui de la région au milieu de la route */
    var la = lieu(c, a), lb = lieu(c, b);
    var envMilieu = la && lb ? envAuPoint(c, (la.x + lb.x) / 2, (la.y + lb.y) / 2) : null;
    r = { id: uid(), a: a, b: b, jours: Math.max(1, jours || 1), env: env || envMilieu || 'plaine' };
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

  return { L: L, H: H, cadre: cadre, assurer: assurer, envDe: envDe, devinerEnv: devinerEnv, envIci: envIci,
    nomLieu: nomLieu, regions: regions, ajouterRegion: ajouterRegion, retirerRegion: retirerRegion, regionA: regionA, envAuPoint: envAuPoint, decouvrir: decouvrir, lieu: lieu, lieuParNom: lieuParNom, obtenirLieu: obtenirLieu, placeLibre: placeLibre,
    route: route, relier: relier, delier: delier, voisins: voisins, ici: ici, seRendre: seRendre };
})();
