/* ============================================================
   COF2 Compagnon — Campagne : plusieurs aventures à la suite
   - chapitres : les aventures d'une même campagne, dans l'ordre ;
   - texte : le récit de toute la campagne (chapitres à la suite) ;
   - exporter / importer : un fichier pour sauvegarder, envoyer ou
     reprendre une campagne sur un autre appareil (aventures + héros),
     sans toucher au reste des données.
   ============================================================ */
window.COF = window.COF || {};

COF.Campagne = (function () {
  function K() { return COF.Carnet; }
  function uid(p) { return p + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  function chapitres(c) {
    if (!c) return [];
    if (!c.campagne) return [c];
    return K().tous().filter(function (x) { return x.campagne && x.campagne.id === c.campagne.id; })
      .sort(function (a, b) { return a.campagne.numero - b.campagne.numero; });
  }
  function nom(c) { return c.campagne ? c.campagne.nom : c.titre; }
  /* Bilan de la campagne : chapitres, menaces, alliés et némésis. */
  function bilan(c) {
    var l = chapitres(c), der = l[l.length - 1] || c;
    var p = der.persoId && COF.Store ? COF.Store.get(der.persoId) : null;
    return {
      nom: nom(c), heros: p, chapitres: l.map(function (x) {
        return { id: x.id, titre: x.titre, numero: x.campagne ? x.campagne.numero : 1, menace: x.saga ? x.saga.nom : null,
          issue: x.termine ? (x.saga && x.saga.fini === 'amère' ? 'victoire amère' : (x.saga && x.saga.fini ? 'victoire' : 'dénouement ouvert')) : 'en cours',
          jours: x.jour - (x.jourDebut || 1) + 1, scenes: x.scenes.length, niveau: x.termine ? x.termine.niveau : null };
      }),
      allies: (der.pnj || []).filter(function (x) { return x.attitude === 'allié'; }).map(function (x) { return x.nom; }),
      nemesis: (der.pnj || []).filter(function (x) { return x.nemesis && x.attitude === 'hostile'; }).map(function (x) { return x.nom; })
    };
  }
  /* Tout le récit de la campagne. */
  function texte(c) {
    var l = chapitres(c), T = '════════════════════════';
    var L = [T, ('Campagne : ' + nom(c)).toUpperCase(), T, ''];
    l.forEach(function (x) { L.push(COF.Chronique.aventure(x), ''); });
    return L.join('\n').replace(/\n{3,}/g, '\n\n');
  }
  /* Fichier de campagne (JSON). */
  function exporter(c) {
    var l = chapitres(c), ids = {};
    l.forEach(function (x) { if (x.persoId) ids[x.persoId] = true; });
    var heros = Object.keys(ids).map(function (id) { return COF.Store.get(id); }).filter(Boolean);
    return JSON.stringify({ app: 'cof2-compagnon', type: 'campagne', format: 1, date: new Date().toISOString(), nom: nom(c), aventures: l, heros: heros });
  }
  function nomFichier(c) { return 'campagne-' + nom(c).replace(/[^\wÀ-ÿ -]/g, '').trim().replace(/\s+/g, '-') + '.json'; }
  /* Importe : nouvelles copies (nouveaux identifiants), rien n'est écrasé. */
  function importer(txt) {
    var o;
    try { o = JSON.parse(txt); } catch (e) { return { erreur: 'Ce fichier n’est pas un JSON valide.' }; }
    if (!o || o.app !== 'cof2-compagnon' || o.type !== 'campagne' || !Array.isArray(o.aventures)) return { erreur: 'Ce fichier n’est pas une campagne de COF2 Compagnon.' };
    var mapH = {}, mapC = {}, campId = uid('cp');
    (o.heros || []).forEach(function (h) { var n = COF.Store.importer(JSON.stringify(h)); mapH[h.id] = n.id; });
    o.aventures.forEach(function (a) { mapC[a.id] = uid('cmp'); });
    var dernier = null;
    o.aventures.forEach(function (a) {
      a.id = mapC[a.id];
      a.persoId = a.persoId ? (mapH[a.persoId] || null) : null;
      if (a.campagne) a.campagne.id = campId; else a.campagne = { id: campId, nom: o.nom || a.titre, numero: 1, menaces: [] };
      if (a.suiteId) a.suiteId = mapC[a.suiteId] || null;
      if (a.precedent) a.precedent.id = mapC[a.precedent.id] || null;
      K().sauver(a); dernier = a;
    });
    if (dernier) K().setActif(dernier.id);
    return { ok: true, nom: o.nom, nb: o.aventures.length, heros: Object.keys(mapH).length };
  }
  return { chapitres: chapitres, bilan: bilan, texte: texte, exporter: exporter, nomFichier: nomFichier, importer: importer };
})();
