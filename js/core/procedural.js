/* ============================================================
   COF2 Compagnon — Petit moteur générique pour les générateurs
   procéduraux « à champs verrouillables » (PNJ, lieux, quêtes,
   trésors, voyage...) : chaque champ sait se calculer depuis le
   contexte déjà tiré, ce qui permet un tirage complet respectant
   les verrous aussi bien qu'un tirage champ par champ.
   ============================================================ */
window.COF = window.COF || {};

COF.alea = function (n) { return Math.floor(Math.random() * n); };
COF.piocher = function (arr) { return arr[COF.alea(arr.length)]; };
COF.piockerPoids = function (paires) {
  var total = paires.reduce(function (s, p) { return s + p[1]; }, 0);
  var r = Math.random() * total;
  for (var i = 0; i < paires.length; i++) {
    r -= paires[i][1];
    if (r <= 0) return paires[i][0];
  }
  return paires[paires.length - 1][0];
};

/* champs = [{ id, label, gen(ctx) }, ...], dans l'ordre de dépendance :
   un champ peut lire ctx.autreChamp s'il a été défini avant lui. */
COF.creerGenerateurChamps = function (champs) {
  function genererTout(verrous, actuel) {
    verrous = verrous || {};
    actuel = actuel || {};
    var ctx = {};
    champs.forEach(function (c) {
      ctx[c.id] = verrous[c.id] && actuel[c.id] !== undefined ? actuel[c.id] : c.gen(ctx);
    });
    return ctx;
  }
  function genererChamp(id, ctx) {
    var c = champs.filter(function (x) { return x.id === id; })[0];
    return c ? c.gen(ctx) : null;
  }
  return { champs: champs, genererTout: genererTout, genererChamp: genererChamp };
};
