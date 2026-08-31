/* ============================================================
   COF2 Compagnon — Moteur du générateur de PNJ
   Génération procédurale : nom, apparence, personnalité, métier,
   motivations et accroches, champ par champ ou en une fois.
   ============================================================ */
window.COF = window.COF || {};

COF.PnjCalc = (function () {

  function alea(n) { return Math.floor(Math.random() * n); }
  function pick(arr) { return arr[alea(arr.length)]; }
  function pickPoids(paires) {
    var total = paires.reduce(function (s, p) { return s + p[1]; }, 0);
    var r = Math.random() * total;
    for (var i = 0; i < paires.length; i++) {
      r -= paires[i][1];
      if (r <= 0) return paires[i][0];
    }
    return paires[paires.length - 1][0];
  }
  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  var PEUPLES = Object.keys(COF.PNJ_POIDS_PEUPLE);

  function genererPeuple() {
    return pickPoids(PEUPLES.map(function (p) { return [p, COF.PNJ_POIDS_PEUPLE[p]]; }));
  }

  function genererGenre() { return pick(['masculin', 'féminin']); }

  /* Nom complet procédural : débuts + fins de syllabes combinés,
     puis un nom de famille / surnom / épithète dans la plupart des cas.
     Le demi-elfe pioche son prénom dans l'une des trois autres cultures. */
  function genererNom(peupleId, genre) {
    var styleId = peupleId;
    if (peupleId === 'demielfe') {
      styleId = pick(['humain', 'elfehaut', 'elfesylvain']);
    }
    var table = COF.PNJ_NOMS[styleId];
    var g = genre === 'féminin' ? 'f' : 'm';
    var pool = (table[g] || table.m);
    var prenom = capitalize(pick(pool.debut) + pick(pool.fin));

    var famillePool = COF.PNJ_NOMS[peupleId].famille;
    var nom = prenom;
    if (famillePool && famillePool.length && Math.random() < 0.75) {
      nom += ' ' + pick(famillePool);
    }
    return nom;
  }

  function genererAge(peupleId) {
    var table = COF.PNJ_AGES[peupleId] || COF.PNJ_AGES.humain;
    return pickPoids(table);
  }

  function genererMetier() { return pick(COF.PNJ_METIERS); }

  /* ---------- Définition des champs, dans l'ordre de dépendance ----------
     Chaque champ sait se regénérer à partir du contexte courant (ctx),
     ce qui permet un tirage individuel (« relancer ce champ ») aussi bien
     qu'un tirage complet respectant les verrous.                          */
  var CHAMPS = [
    { id: 'peuple', label: 'Peuple', gen: function () { return genererPeuple(); } },
    { id: 'genre', label: 'Genre', gen: function () { return genererGenre(); } },
    { id: 'nom', label: 'Nom', gen: function (ctx) { return genererNom(ctx.peuple, ctx.genre); } },
    { id: 'age', label: 'Âge', gen: function (ctx) { return genererAge(ctx.peuple); } },
    { id: 'taille', label: 'Taille', gen: function () { return pick(COF.PNJ_APPARENCE.taille); } },
    { id: 'corpulence', label: 'Corpulence', gen: function () { return pick(COF.PNJ_APPARENCE.corpulence); } },
    { id: 'cheveux', label: 'Cheveux', gen: function () {
        return pick(COF.PNJ_APPARENCE.cheveuxStyle) + ' ' + pick(COF.PNJ_APPARENCE.cheveuxCouleur);
      } },
    { id: 'yeux', label: 'Yeux', gen: function () { return pick(COF.PNJ_APPARENCE.yeux); } },
    { id: 'teint', label: 'Teint', gen: function () { return pick(COF.PNJ_APPARENCE.teint); } },
    { id: 'signe', label: 'Signe distinctif', gen: function () { return pick(COF.PNJ_APPARENCE.signe); } },
    { id: 'metier', label: 'Métier', gen: function () { return genererMetier(); } },
    { id: 'ideal', label: 'Idéal héroïque', gen: function () { return pick(COF.PNJ_IDEAUX); } },
    { id: 'travers', label: 'Travers', gen: function () { return pick(COF.PNJ_TRAVERS); } },
    { id: 'manie', label: 'Manie', gen: function () { return pick(COF.PNJ_MANIES); } },
    { id: 'motivation', label: 'Motivation', gen: function () { return pick(COF.PNJ_MOTIVATIONS); } },
    { id: 'secret', label: 'Secret', gen: function () { return pick(COF.PNJ_SECRETS); } },
    { id: 'accroche', label: 'Accroche', gen: function () { return pick(COF.PNJ_ACCROCHES); } },
    { id: 'divinite', label: 'Divinité', gen: function () { return pick(COF.PNJ_DIVINITES); } },
    { id: 'attitude', label: 'Attitude envers les PJ', gen: function () { return pick(COF.PNJ_ATTITUDES); } }
  ];

  /* Génère un PNJ complet. `verrous` liste les id de champs à conserver
     tels quels dans `actuel` (utile pour un tirage partiel).            */
  function genererPNJ(verrous, actuel) {
    verrous = verrous || {};
    actuel = actuel || {};
    var ctx = {};
    CHAMPS.forEach(function (c) {
      ctx[c.id] = verrous[c.id] && actuel[c.id] !== undefined ? actuel[c.id] : c.gen(ctx);
    });
    return ctx;
  }

  /* Regénère un seul champ, en tenant compte du contexte déjà déterminé
     (ex. régénérer le nom doit connaître peuple + genre en cours).      */
  function genererChamp(id, ctx) {
    var c = CHAMPS.filter(function (x) { return x.id === id; })[0];
    return c ? c.gen(ctx) : null;
  }

  return {
    CHAMPS: CHAMPS, PEUPLES: PEUPLES,
    genererPNJ: genererPNJ, genererChamp: genererChamp
  };
})();
