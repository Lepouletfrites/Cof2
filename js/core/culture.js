/* ============================================================
   COF2 Compagnon — Cultures et noms cohérents (mode aventure)
   Chaque lieu a un peuple dominant, tiré selon son terrain (les nains
   dans les montagnes et sous terre, les elfes sylvains en forêt, les
   halfelins dans les campagnes…) et souvent hérité des lieux voisins :
   une région garde ainsi une même culture.
   Les noms en découlent : villages, lieux découverts, notables,
   tenanciers, tavernes, gens rencontrés. Un PNJ croisé dans une
   vallée naine sera le plus souvent un nain, avec un nom de nain.
   ============================================================ */
window.COF = window.COF || {};

COF.Culture = (function () {
  function p(l) { return l[Math.floor(Math.random() * l.length)]; }
  function M() { return COF.Monde; }
  function maj(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }
  function poids(paires) {
    var t = paires.reduce(function (s, x) { return s + x[1]; }, 0), r = Math.random() * t;
    for (var i = 0; i < paires.length; i++) { r -= paires[i][1]; if (r <= 0) return paires[i][0]; }
    return paires[paires.length - 1][0];
  }

  /* Qui vit où (poids par terrain). */
  var ENV_PEUPLES = {
    montagne: [['nain', 5], ['humain', 3], ['gnome', 2]],
    souterrain: [['nain', 6], ['gnome', 3], ['demiorc', 1]],
    foret: [['elfesylvain', 4], ['humain', 3], ['halfelin', 2], ['demielfe', 1]],
    plaine: [['humain', 6], ['halfelin', 3], ['gnome', 1]],
    marais: [['humain', 4], ['demiorc', 3], ['halfelin', 1]],
    arctique: [['humain', 4], ['nain', 3], ['demiorc', 2]],
    urbain: [['humain', 6], ['halfelin', 2], ['nain', 1], ['gnome', 1], ['elfehaut', 1]],
    ruines: [['humain', 5], ['elfehaut', 2], ['nain', 2]]
  };
  var NOMS = {
    humain: { adj: 'humaine' }, nain: { adj: 'naine' }, halfelin: { adj: 'halfeline' }, gnome: { adj: 'gnome' },
    elfehaut: { adj: 'elfique' }, elfesylvain: { adj: 'sylvaine' }, demiorc: { adj: 'orque' }, demielfe: { adj: 'mêlée' }
  };

  /* ---------- Peuple d'un lieu ---------- */
  var duNom = {};   /* peuple d'un nom tout juste inventé (avant que le lieu existe) */
  function peupleAu(c, x, y, env) {
    /* une région garde sa culture : on hérite souvent du lieu habité le plus proche */
    var proche = null, dmin = 70;
    (c.lieux || []).forEach(function (l) {
      if (!l.peuple || l.x === undefined) return;
      var dd = Math.hypot(l.x - x, l.y - y); if (dd < dmin) { dmin = dd; proche = l; }
    });
    var tab = ENV_PEUPLES[env] || ENV_PEUPLES.plaine;
    if (proche && Math.random() < 0.6) {
      /* sauf si le terrain ne lui convient pas du tout (pas de nains au fond des marais) */
      if (tab.some(function (t) { return t[0] === proche.peuple; }) || Math.random() < 0.3) return proche.peuple;
    }
    return poids(tab);
  }
  function peupleLieu(c, l) {
    if (!l) return null;
    if (!l.peuple) {
      l.peuple = duNom[l.nom] || peupleAu(c, l.x || 0, l.y || 0, l.env === 'urbain' ? ((M().envAuPoint(c, l.x, l.y)) || 'urbain') : (l.env || 'plaine'));
      if (l.ville && l.peuple === 'demielfe') l.peuple = 'humain';
    }
    return l.peuple;
  }

  /* ---------- Noms de personnes ---------- */
  function prenom(peuple, genre) {
    var style = peuple === 'demielfe' ? p(['humain', 'elfehaut', 'elfesylvain']) : peuple;
    var t = (COF.PNJ_NOMS || {})[style] || COF.PNJ_NOMS.humain, g = (genre === 'féminin' ? t.f : t.m) || t.m;
    return maj(p(g.debut) + p(g.fin));
  }
  function nomPersonne(peuple, genre) {
    var n = prenom(peuple, genre), fam = ((COF.PNJ_NOMS || {})[peuple] || {}).famille;
    return fam && fam.length && Math.random() < 0.75 ? n + ' ' + p(fam) : n;
  }
  /* Peuple d'une personne croisée ici : surtout celui du lieu, parfois un voyageur. */
  function peuplePnj(c, l) {
    var pl = peupleLieu(c, l || M().ici(c));
    if (pl && Math.random() < 0.65) return pl;
    var env = l ? l.env : (M().envIci(c) || 'plaine');
    return Math.random() < 0.6 ? poids(ENV_PEUPLES[env] || ENV_PEUPLES.plaine) : null;   /* null : n'importe quel peuple */
  }
  /* PNJ du récit (générateur complet), cohérent avec le lieu. */
  function pnj(c, opts) {
    opts = Object.assign({}, opts || {});
    if (!opts.peuple) { var pp = peuplePnj(c, opts.lieu ? M().lieu(c, opts.lieu) : null); if (pp) opts.peuple = pp; }
    delete opts.lieu;
    return COF.Aventure.pnj(opts);
  }

  /* ---------- Noms de lieux ---------- */
  var TERMES = {   /* mots du terrain, en français, par culture non humaine */
    nain: { montagne: ['Forge', 'Porte', 'Halle', 'Fort', 'Col'], souterrain: ['Mine', 'Halle', 'Forge', 'Gouffre', 'Galerie'], def: ['Fort', 'Forge', 'Halle', 'Porte'] },
    elfehaut: { def: ['Tour', 'Jardins', 'Sanctuaire', 'Flèche', 'Bosquet'] },
    elfesylvain: { def: ['Bosquet', 'Clairière', 'Source', 'Sanctuaire', 'Futaie'] },
    gnome: { def: ['Atelier', 'Moulin', 'Tour', 'Observatoire', 'Fabrique'] },
    demiorc: { def: ['Camp', 'Tertre', 'Fosse', 'Palissade', 'Croc'] }
  };
  var SUFFIXES = {
    nain: ['dûm', 'grund', 'heim', 'gol', 'kar', 'dur', 'barak', 'zul'],
    elfehaut: ['dor', 'ndel', 'thalas', 'rion', 'lindë', 'quessir', 'mar'],
    elfesylvain: ['wen', 'lith', 'neth', 'raël', 'thil', 'ryn', 'ael'],
    demiorc: ['gash', 'mor', 'dûr', 'rak', 'gul', 'ruk', 'zog'],
    gnome: ['bric', 'clic', 'nette', 'wick', 'bulle']
  };
  var HALFELIN = { debut: ['Combe', 'Bourg', 'Trou', 'Prés', 'Coteau', 'Vergers', 'Fossé', 'Terriers'], fin: ['-Joyeux', '-sous-Colline', '-aux-Pommes', '-du-Bon-Repas', '-Fleuri', '-la-Paisible', '-les-Navets', '-aux-Grives', '-Moussu'] };
  var GNOME = { debut: ['Rouage', 'Cliquet', 'Étincelle', 'Ressort', 'Bouilloire', 'Engrenage'], fin: ['-sur-Ruisseau', '-les-Bulles', '-la-Fumeuse', '-en-Tour', '-aux-Rouets', '-Tintinnabule'] };
  function racine(peuple) {
    var st = peuple === 'elfehaut' || peuple === 'elfesylvain' ? peuple : peuple;
    var t = (COF.PNJ_NOMS || {})[st] || COF.PNJ_NOMS.humain;
    return maj(p(t.m.debut).toLowerCase() + p(SUFFIXES[peuple] || ['']));
  }
  /* Nom d'un lieu (terrain env) dans la culture du peuple. null : style humain habituel. */
  function nomLieuCulture(peuple, env) {
    if (peuple === 'humain' || peuple === 'demielfe' || !peuple) return null;
    if (peuple === 'halfelin') return p(HALFELIN.debut) + p(HALFELIN.fin);
    if (peuple === 'gnome' && Math.random() < 0.6) return p(GNOME.debut) + p(GNOME.fin);
    var T = TERMES[peuple] || TERMES.nain, termes = T[env] || T.def, r = racine(peuple);
    var de = /^[aeiouyéèêâàôîû]/i.test(r) ? 'd’' : 'de ';
    return p([p(termes) + ' ' + de + r, r, r, peuple === 'nain' ? 'Karak-' + r : p(termes) + ' ' + de + r]);
  }
  /* Nom de village dans la culture du peuple. null : style humain habituel. */
  function nomVille(peuple) {
    if (peuple === 'humain' || peuple === 'demielfe' || !peuple) return null;
    if (peuple === 'halfelin') return p(HALFELIN.debut) + p(HALFELIN.fin);
    if (peuple === 'gnome') return p(GNOME.debut) + p(GNOME.fin);
    var r = racine(peuple);
    return peuple === 'nain' ? p([r, 'Karak-' + r, r + '-la-Profonde']) : r;
  }
  function unique(c, f) {
    var n, e = 0; do { n = f(); } while (n && M().lieuParNom(c, n) && ++e < 12);
    return n;
  }
  /* Nom d'un nouveau lieu près du point (x, y) : renvoie { nom, peuple } (nom null = style humain). */
  function nommer(c, env, x, y) {
    var pe = peupleAu(c, x, y, env), nom = unique(c, function () { return nomLieuCulture(pe, env); });
    if (nom) duNom[nom] = pe;
    return { nom: nom, peuple: pe };
  }
  function retenir(nom, peuple) { if (nom && peuple) duNom[nom] = peuple; }

  /* ---------- Tavernes ---------- */
  var TAVERNES = {
    nain: ['La Chope de Granit', 'Le Marteau Ivre', 'La Barbe Mousseuse', 'Le Fourneau', 'L’Enclume Dorée', 'La Pinte du Mineur', 'Le Tonneau de Pierre'],
    elfehaut: ['La Feuille d’Argent', 'Le Chant de la Lune', 'La Source Étoilée', 'Le Calice d’Opale'],
    elfesylvain: ['La Feuille d’Argent', 'Le Repos du Cerf', 'La Coupe de Rosée', 'L’Arbre Chantant'],
    halfelin: ['Le Sixième Repas', 'La Tarte Dorée', 'Le Terrier Douillet', 'Le Fromage Qui Rit', 'Le Chaudron Ventru', 'La Pipe Fumante'],
    gnome: ['La Bouilloire Folle', 'L’Engrenage Joyeux', 'La Fiole Pétillante', 'Le Ressort Cassé'],
    demiorc: ['Le Crâne Fendu', 'La Hache Rouillée', 'Le Sanglier Grillé', 'La Dent de Troll', 'Le Poing Levé']
  };
  /* Donne à un village l'identité de son peuple (nom, notable, taverne). */
  function adapterVille(c, v, peuple) {
    v.peuple = peuple;
    var nv = unique(c, function () { return nomVille(peuple); }); if (nv) v.nom = nv;
    /* le notable est presque toujours du pays ; le tenancier aussi, sauf quelques étrangers installés */
    v.notable.nom = nomPersonne(Math.random() < 0.92 ? peuple : (peuple === 'humain' ? 'demielfe' : 'humain'), v.notable.genre);
    v.taverne.tenancier = nomPersonne(Math.random() < 0.85 ? peuple : 'humain', v.taverne.tenGenre);
    if (TAVERNES[peuple] && Math.random() < 0.7) v.taverne.nom = p(TAVERNES[peuple]);
    return v;
  }
  function adjectif(peuple) { return (NOMS[peuple] || {}).adj || ''; }
  return { ENV_PEUPLES: ENV_PEUPLES, peupleAu: peupleAu, peupleLieu: peupleLieu, peuplePnj: peuplePnj, pnj: pnj, prenom: prenom, nomPersonne: nomPersonne,
    nomLieuCulture: nomLieuCulture, nomVille: nomVille, nommer: nommer, retenir: retenir, adapterVille: adapterVille, adjectif: adjectif };
})();
