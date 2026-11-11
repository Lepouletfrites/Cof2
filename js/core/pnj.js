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

  /* ---------- Accord au féminin des métiers ----------
     Les mots avant la première préposition sont accordés (« Marchand
     itinérant » → « Marchande itinérante », « Garde de la ville » reste). */
  var FEM_EXCEPTIONS = {
    'moine': 'nonne', 'prêtre': 'prêtresse', 'roi': 'reine', 'duc': 'duchesse', 'comte': 'comtesse', 'maître': 'maîtresse',
    'seigneur': 'dame', 'paysan': 'paysanne', 'chasseur': 'chasseresse', 'prince': 'princesse', 'abbé': 'abbesse',
    'devin': 'devineresse', 'héros': 'héroïne', 'vieux': 'vieille', 'beau': 'belle', 'fou': 'folle', 'bon': 'bonne',
    'compagnon': 'compagne', 'serviteur': 'servante', 'empereur': 'impératrice', 'gouverneur': 'gouverneure', 'prieur': 'prieure',
    'très': 'très', 'et': 'et', 'ou': 'ou', 'plus': 'plus', 'peu': 'peu', 'bourreau': 'bourreau', 'sans-abri': 'sans-abri',
    'espion': 'espionne', 'marin': 'marin'
  };
  var INVARIABLES = /^(garde|mage|druide|barde|scribe|guide|juge|élève|apothicaire|alchimiste|herboriste|libraire|notaire|cartographe|capitaine|sage|mercenaire|pirate|noble|diplomate|émissaire|artiste|acrobate|adepte|archiviste|ermite|esclave|membre|camelot|géomètre|astrologue|astronome|médecin|chef)$/i;
  function feminiserMot(m) {
    var bas = m.toLowerCase(), r;
    if (FEM_EXCEPTIONS[bas]) r = FEM_EXCEPTIONS[bas];
    else if (INVARIABLES.test(bas) || /e$/.test(bas)) r = bas;
    else if (/teur$/.test(bas)) r = bas.replace(/teur$/, 'trice');
    else if (/eur$/.test(bas)) r = bas.replace(/eur$/, 'euse');
    else if (/ier$/.test(bas)) r = bas.replace(/ier$/, 'ière');
    else if (/er$/.test(bas)) r = bas.replace(/er$/, 'ère');
    else if (/(ien|on)$/.test(bas)) r = bas + 'ne';
    else if (/et$/.test(bas)) r = bas + 'te';
    else if (/el$/.test(bas)) r = bas + 'le';
    else if (/f$/.test(bas)) r = bas.replace(/f$/, 've');
    else if (/eux$/.test(bas)) r = bas.replace(/eux$/, 'euse');
    else if (/[éiu]$/.test(bas)) r = bas + 'e';
    else if (/(in|ain|an|ais|ois|ant|ent|ard|aud|t|d|l|s)$/.test(bas)) r = bas + 'e';
    else r = bas;
    return m.charAt(0) === m.charAt(0).toUpperCase() ? r.charAt(0).toUpperCase() + r.slice(1) : r;
  }
  function feminiser(nom) {
    var mots = String(nom).split(' '), stop = false;
    return mots.map(function (m) {
      if (stop) return m;
      if (/^(de|du|des|d’|d'|à|au|aux|en|la|le|les|pour|sans|sur)$/i.test(m) || /^d[’']/.test(m)) { stop = true; return m; }
      return feminiserMot(m);
    }).join(' ');
  }
  function genererMetier(ctx) {
    var m = pick(COF.PNJ_METIERS);
    return ctx && ctx.genre === 'féminin' ? Object.assign({}, m, { nom: feminiser(m.nom) }) : m;
  }

  /* ---------- Apparence cohérente ----------
     La carrure tient compte de la taille (pas de « chétif » « massif et
     musculeux »), et un crâne chauve ou rasé n'a pas de couleur. */
  function genererCorpulence(ctx) {
    var T = COF.PNJ_APPARENCE.taille, C = COF.PNJ_APPARENCE.corpulence;
    var ti = T.indexOf(ctx && ctx.taille);
    var ok = C.filter(function (c, ci) {
      if (ti === 0) return ci <= 4;              // chétif
      if (ti === 1) return ci <= 5;              // petit
      if (ti >= 6) return ci >= 2;               // imposant, massif
      return true;
    });
    return pick(ok.length ? ok : C);
  }
  function genererCheveux() {
    var st = pick(COF.PNJ_APPARENCE.cheveuxStyle);
    if (/chauve|rasé|calvitie/.test(st)) return st;
    var col = pick(COF.PNJ_APPARENCE.cheveuxCouleur);
    /* « une longue tresse unique » : couleur au féminin singulier */
    if (/^une /.test(st)) {
      col = { noirs: 'noire', bruns: 'brune', 'châtains': 'châtain', roux: 'rousse', blonds: 'blonde', gris: 'grise',
        blancs: 'blanche', 'argentés': 'argentée', 'striés de blanc': 'striée de blanc' }[col] || col;
    } else if (/^des (tresses|dreadlocks)/.test(st)) {
      col = { noirs: 'noires', bruns: 'brunes', roux: 'rousses', blonds: 'blondes', gris: 'grises', blancs: 'blanches',
        'argentés': 'argentées', 'striés de blanc': 'striées de blanc' }[col] || col;
    }
    return st + ' ' + col;
  }

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
    { id: 'corpulence', label: 'Corpulence', gen: function (ctx) { return genererCorpulence(ctx); } },
    { id: 'cheveux', label: 'Cheveux', gen: function () { return genererCheveux(); } },
    { id: 'yeux', label: 'Yeux', gen: function () { return pick(COF.PNJ_APPARENCE.yeux); } },
    { id: 'teint', label: 'Teint', gen: function () { return pick(COF.PNJ_APPARENCE.teint); } },
    { id: 'signe', label: 'Signe distinctif', gen: function () { return pick(COF.PNJ_APPARENCE.signe); } },
    { id: 'metier', label: 'Métier', gen: function (ctx) { return genererMetier(ctx); } },
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
    CHAMPS: CHAMPS, PEUPLES: PEUPLES, feminiser: feminiser,
    genererPNJ: genererPNJ, genererChamp: genererChamp
  };
})();
