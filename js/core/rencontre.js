/* ============================================================
   COF2 Compagnon — Générateur de rencontres
   Compose une rencontre cohérente adaptée à la taille et au
   niveau du groupe, dans un environnement donné.
   ============================================================ */
window.COF = window.COF || {};

COF.Rencontre = (function () {

  /* ---------- Budget ----------
     Valeur en points d'une créature selon son NC. La courbe est
     super-linéaire : une créature de NC 4 vaut bien plus que quatre
     créatures de NC 1. Elle est calibrée sur les exemples de rencontres
     « ordinaires » donnés dans le bestiaire du livre de base :
       5 gobelins (NC 0) ............ niveau 1   →   5 pts / budget 4
       1 élite + 8 gobelins ......... niveau 2   →  10 pts / budget 8
       chef kobold + 5 kobolds ...... niveau 2   →   9 pts / budget 8
       chef de meute + 6 loups ...... niveau 5   →  32 pts / budget 35
       6 worgs (NC 3) ............... niveau 8   →  90 pts / budget 90
       chef ogre + 5 ogres .......... niveau 10  → 123 pts / budget 150   */
  var PTS = {
    0: 1, 0.5: 2, 1: 4, 2: 8, 3: 15, 4: 24, 5: 35, 6: 48,
    7: 65, 8: 90, 9: 118, 10: 150, 11: 190, 12: 235, 13: 290
  };

  var DIFFICULTES = [
    { id: 'facile',    nom: 'Facile',    mult: 0.5, desc: "Escarmouche : consomme peu de ressources." },
    { id: 'ordinaire', nom: 'Ordinaire', mult: 1,   desc: "Le standard : environ un tiers des ressources du groupe." },
    { id: 'difficile', nom: 'Difficile', mult: 1.5, desc: "Un PJ peut tomber au tapis en cas de malchance." },
    { id: 'mortelle',  nom: 'Mortelle',  mult: 2.5, desc: "La fuite est une option à envisager sérieusement." }
  ];

  /* Profils qui décrivent une meute plutôt qu'un individu : on les exclut
     du tirage, le générateur composant lui-même les groupes. */
  var EXCLUS = ['meute_gnolls', 'worg_meute'];

  function pts(c) {
    var n = c.nc;
    if (PTS[n] !== undefined) return PTS[n];
    var k = Math.round(n);
    return PTS[k] !== undefined ? PTS[k] : PTS[13];
  }

  function budget(nbPJ, niveau, difficulte) {
    var d = DIFFICULTES.filter(function (x) { return x.id === difficulte; })[0] || DIFFICULTES[1];
    var base = PTS[Math.max(0, Math.min(13, Math.round(niveau)))] || PTS[13];
    return Math.round(base * (nbPJ / 4) * d.mult);
  }

  function alea(n) { return Math.floor(Math.random() * n); }
  function piocher(arr) { return arr[alea(arr.length)]; }
  function melanger(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = alea(i + 1); var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* Créatures disponibles dans un environnement */
  function candidats(env) {
    return COF.BESTIAIRE.filter(function (c) {
      if (EXCLUS.indexOf(c.id) >= 0) return false;
      return !env || c.env.indexOf(env) >= 0;
    });
  }

  /* ---------- Stratégies de composition ---------- */

  /* Complète une composition jusqu'à consommer l'essentiel du budget.
     Chaque lot porte son propre plafond (« max ») : un chef reste unique,
     les lieutenants restent peu nombreux, seule la piétaille se multiplie.
     CAP_TOTAL borne l'effectif pour que la rencontre reste jouable.      */
  var CAP_TOTAL = 16;

  function effectif(lots) { return lots.reduce(function (s, l) { return s + l.nb; }, 0); }
  function cout(lots) { return lots.reduce(function (s, l) { return s + l.nb * pts(l.c); }, 0); }

  function completer(lots, b) {
    var garde = 0;
    while (cout(lots) < b * 0.85 && effectif(lots) < CAP_TOTAL && garde++ < 60) {
      var possibles = lots.filter(function (l) {
        return l.nb < (l.max || 12) && cout(lots) + pts(l.c) <= b * 1.1;
      }).sort(function (x, y) { return pts(x.c) - pts(y.c); });
      if (!possibles.length) break;
      possibles[0].nb++;
    }
    return lots;
  }

  /* Un adversaire unique et marquant */
  function composerSolo(pool, b) {
    var ok = pool.filter(function (c) { return pts(c) >= b * 0.55 && pts(c) <= b * 1.15; });
    if (!ok.length) return null;
    /* on privilégie celui qui remplit le mieux le budget */
    ok.sort(function (x, y) { return Math.abs(pts(y) - b) - Math.abs(pts(x) - b); });
    var top = ok.slice(Math.max(0, ok.length - 4));
    return { type: 'solo', lots: [{ c: piocher(top), nb: 1 }] };
  }

  /* Un chef entouré de sa piétaille, tirés du même groupe (gobelins, orcs…).
     La bande est structurée en trois tiers : un chef unique, quelques
     lieutenants, et le gros de la troupe. */
  function composerBande(pool, b) {
    var parGroupe = {};
    pool.forEach(function (c) {
      if (!c.groupe) return;
      (parGroupe[c.groupe] = parGroupe[c.groupe] || []).push(c);
    });
    /* On écarte les groupes trop faibles pour le budget : même au grand
       complet (1 chef + 3 lieutenants + 12 soldats), certaines bandes ne
       représentent aucune menace pour un groupe de haut niveau.          */
    var groupes = Object.keys(parGroupe).filter(function (g) {
      var m = parGroupe[g];
      if (m.length < 2) return false;
      var tri = m.slice().sort(function (x, y) { return pts(y) - pts(x); });
      var troupe = tri[tri.length - 1];
      if (pts(troupe) > b * 0.5) return false;
      var plafond = pts(tri[0]) + 3 * pts(tri[1] || troupe) + 12 * pts(troupe);
      return plafond >= b * 0.7;
    });
    if (!groupes.length) return null;

    var membres = parGroupe[piocher(groupes)].slice()
      .sort(function (x, y) { return pts(y) - pts(x); });   // du plus fort au plus faible

    var troupe = membres[membres.length - 1];               // le moins cher = la piétaille
    var lots = [];

    /* chef : le plus puissant qui laisse de quoi payer au moins trois soldats */
    for (var i = 0; i < membres.length; i++) {
      if (membres[i] !== troupe && pts(membres[i]) <= b - 3 * pts(troupe)) {
        lots.push({ c: membres[i], nb: 1, max: 1, role: 'chef' });
        break;
      }
    }
    var chef = lots.length ? lots[0].c : null;

    /* lieutenants : un palier intermédiaire, s'il existe et qu'il reste de la place */
    var milieu = membres.filter(function (m) {
      return m !== chef && m !== troupe && pts(m) <= (b - cout(lots) - 3 * pts(troupe));
    });
    if (milieu.length && Math.random() < 0.7) {
      lots.push({ c: piocher(milieu), nb: 1, max: 3, role: 'lieutenant' });
    }

    /* la troupe elle-même */
    lots.push({ c: troupe, nb: 1, max: 12, role: 'troupe' });

    completer(lots, b);
    if (effectif(lots) < 2) return null;
    return { type: chef ? 'bande' : 'meute', lots: lots };
  }

  /* Plusieurs espèces différentes réunies par le lieu */
  function composerMixte(pool, b) {
    var lots = [], garde = 0;
    var dispo = melanger(pool.filter(function (c) { return pts(c) <= b * 0.7; }));
    if (dispo.length < 2) return null;
    function total() { return lots.reduce(function (s, l) { return s + l.nb * pts(l.c); }, 0); }
    while (lots.length < 3 && garde++ < 40) {
      var choix = dispo.filter(function (c) {
        return total() + pts(c) <= b && !lots.some(function (l) { return l.c === c; });
      });
      if (!choix.length) break;
      lots.push({ c: choix[0], nb: 1 });
      dispo = melanger(dispo);
    }
    if (lots.length < 2) return null;
    lots.forEach(function (l) { l.max = 8; });
    return { type: 'mixte', lots: completer(lots, b) };
  }

  /* Un petit groupe homogène : X créatures identiques */
  function composerMeute(pool, b) {
    var ok = pool.filter(function (c) {
      var n = Math.floor(b / pts(c));
      return n >= 3 && n <= 12;
    });
    if (!ok.length) return null;
    var c = piocher(ok);
    var nb = Math.max(3, Math.min(12, Math.floor(b / pts(c))));
    return { type: 'meute', lots: [{ c: c, nb: nb }] };
  }

  /* Libellés lisibles des compositions */
  var TYPES = {
    solo:  'Adversaire solitaire',
    bande: 'Bande organisée',
    meute: 'Meute',
    mixte: 'Groupe hétéroclite'
  };

  /* ---------- Génération ---------- */
  function generer(opts) {
    opts = opts || {};
    var nbPJ = Math.max(1, opts.nbPJ || 4);
    var niveau = Math.max(1, opts.niveau || 1);
    var diff = opts.difficulte || 'ordinaire';
    var b = budget(nbPJ, niveau, diff);
    var pool = candidats(opts.env);

    if (!pool.length) {
      return { erreur: "Aucune créature ne vit dans cet environnement." };
    }

    /* On tente les stratégies dans un ordre aléatoire pondéré, puis on
       retient la première qui aboutit. */
    var strategies = [];
    if (opts.style && opts.style !== 'auto') {
      strategies = [{ bande: composerBande, solo: composerSolo, meute: composerMeute, mixte: composerMixte }[opts.style]];
    } else {
      strategies = melanger([composerBande, composerBande, composerMeute, composerMixte, composerSolo]);
    }

    var res = null;
    for (var i = 0; i < strategies.length && !res; i++) {
      if (strategies[i]) res = strategies[i](pool, b);
    }
    /* dernier recours : la créature la plus proche du budget */
    if (!res) {
      var tri = pool.slice().sort(function (x, y) {
        return Math.abs(pts(x) - b) - Math.abs(pts(y) - b);
      });
      res = { type: 'solo', lots: [{ c: tri[0], nb: 1 }] };
    }

    var utilise = res.lots.reduce(function (s, l) { return s + l.nb * pts(l.c); }, 0);
    var nbCreatures = res.lots.reduce(function (s, l) { return s + l.nb; }, 0);

    return {
      env: opts.env, nbPJ: nbPJ, niveau: niveau,
      difficulte: diff, budget: b, utilise: utilise,
      type: res.type, lots: res.lots, nbCreatures: nbCreatures,
      ratio: b ? utilise / b : 0,
      pvTotal: res.lots.reduce(function (s, l) { return s + l.nb * l.c.pv; }, 0)
    };
  }

  return {
    PTS: PTS, DIFFICULTES: DIFFICULTES, TYPES: TYPES,
    pts: pts, budget: budget, candidats: candidats, generer: generer
  };
})();
