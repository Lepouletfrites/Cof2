/* ============================================================
   COF2 Compagnon — Générateur de récompenses
   Trois sources de butin :
     - generer(r)         : à partir d'une rencontre déjà résolue
     - genererFouille(o)  : petite trouvaille en explorant un lieu
     - genererCoffre(o)   : trésor accumulé (coffre, cache, repaire)
   Toutes partagent les mêmes tables et la même mécanique d'objet
   magique, dont les paliers (mineur/majeur/légendaire) s'ouvrent
   progressivement avec le niveau, et qui se concrétise en une arme
   ou une armure réelle du jeu quand le tirage en désigne une.
   ============================================================ */
window.COF = window.COF || {};

COF.Recompense = (function () {

  function alea(n) { return Math.floor(Math.random() * n); }
  function piocher(arr) { return arr[alea(arr.length)]; }
  function entre(min, max) { return min + Math.random() * (max - min); }
  function melanger(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = alea(i + 1); var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  var DIFF_MULT = { facile: 0.5, ordinaire: 1, difficile: 1.5, mortelle: 2.5 };
  var GOLD_PAR_POINT = 2.6;

  /* Équivalent en « points de rencontre » d'un niveau de groupe donné,
     pour que la fouille et le coffre restent sur la même échelle que
     le butin de rencontre sans dépendre d'un combat résolu. */
  function pointsNiveau(niveau) {
    var PTS = COF.Rencontre.PTS;
    var k = Math.max(0, Math.min(13, Math.round(niveau)));
    return PTS[k] || PTS[13];
  }

  function richesseMult(id) {
    return (COF.RICHESSE_TIERS[id] || COF.RICHESSE_TIERS.standard).mult;
  }

  function coinMult(lots) {
    var hasHum = lots.some(function (l) { return l.c.cat === 'humanoide'; });
    var hasFant = lots.some(function (l) { return l.c.cat === 'fantastique'; });
    if (hasHum) return 1;
    if (hasFant) return 0.55;
    return 0.12; /* faune sauvage : peu ou pas de pièces sur elle */
  }

  function genererPieces(points, richesseEnv, mult) {
    var brut = points * GOLD_PAR_POINT * richesseEnv * mult * entre(0.7, 1.3);
    return { po: Math.max(0, Math.round(brut)), pa: alea(9) + 1, pc: alea(9) + 1 };
  }

  /* ---------- Objets magiques ---------- */

  /* Palier d'objet magique atteignable selon le niveau du groupe.
     Un groupe de bas niveau peut trouver un objet mineur ; les
     paliers supérieurs ne s'ouvrent qu'avec l'expérience. */
  function tiersDisponibles(niveau) {
    if (niveau >= 12) return ['mineur', 'majeur', 'legendaire'];
    if (niveau >= 6) return ['mineur', 'majeur'];
    return ['mineur'];
  }

  /* Transforme une entrée générique « Arme +N » / « Armure +N » en un
     objet concret du jeu (arme ou armure réelle) pour un butin qui se
     manie directement, plutôt qu'une étiquette abstraite. */
  function concretiser(item) {
    if (!item) return null;
    if (item.arme) {
      var arme = piocher(COF.ARMES_CONTACT.concat(COF.ARMES_DISTANCE));
      var suffixe = item.nom.replace(/^Arme\s*/, '');
      return { tier: item.tier, nom: arme.nom + ' ' + suffixe, desc: item.desc, dm: arme.dm };
    }
    if (item.armure) {
      var armure = piocher(COF.ARMURES.filter(function (a) { return a.id !== 'aucune'; }));
      var suffixe2 = item.nom.replace(/^Armure\s*/, '');
      return { tier: item.tier, nom: armure.nom + ' ' + suffixe2, desc: item.desc, def: armure.def };
    }
    return { tier: item.tier, nom: item.nom, desc: item.desc };
  }

  /* chance : probabilité (0-1) qu'un objet magique soit trouvé. */
  function tirerMagiqueGenerique(niveau, chance) {
    if (Math.random() > Math.min(1, chance)) return null;
    var tiers = tiersDisponibles(niveau);
    /* pondération : le palier le plus élevé accessible reste le plus rare */
    var poids = { mineur: 6, majeur: 3, legendaire: 1 };
    var pool = [];
    tiers.forEach(function (t) { for (var i = 0; i < poids[t]; i++) pool.push(t); });
    var tier = piocher(pool);
    var choix = COF.OBJETS_MAGIQUES.filter(function (o) { return o.tier === tier; });
    return concretiser(piocher(choix));
  }

  function tirerMagiqueRencontre(r) {
    var diffM = DIFF_MULT[r.difficulte] || 1;
    var hasFant = r.lots.some(function (l) { return l.c.cat === 'fantastique'; });
    var hasChef = r.lots.some(function (l) { return l.role === 'chef'; });
    var chance = 0.10 * diffM * (hasFant ? 1.5 : 1) * (hasChef ? 1.25 : 1);
    return tirerMagiqueGenerique(r.niveau, chance);
  }

  /* ---------- Objets mondains & trophées (butin de rencontre) ---------- */

  /* Équipement mondain récupéré sur les humanoïdes vaincus (armes,
     armures, matériel courant) — limité pour rester lisible. */
  function objetsMondains(r) {
    var out = [];
    var humains = r.lots.filter(function (l) { return l.c.cat === 'humanoide'; });
    if (!humains.length) return out;

    humains.forEach(function (l) {
      /* l'arme de la créature, si elle correspond à une entrée connue */
      if (l.c.att && l.c.att[0] && l.c.att[0].n) {
        var nomArme = l.c.att[0].n;
        var trouve = COF.ARMES_CONTACT.concat(COF.ARMES_DISTANCE).filter(function (a) {
          return nomArme.toLowerCase().indexOf(a.nom.toLowerCase()) >= 0 ||
                 a.nom.toLowerCase().indexOf(nomArme.toLowerCase()) >= 0;
        })[0];
        if (trouve && Math.random() < (l.role ? 0.9 : 0.4)) {
          out.push({ nom: trouve.nom, note: 'Récupérée sur ' + l.c.nom.toLowerCase() + '.', prix: trouve.prix });
        }
      }
      if (Math.random() < 0.5) {
        out.push({ nom: piocher(COF.BUTIN_DIVERS), note: null, prix: 0 });
      }
    });

    /* le chef porte presque toujours quelque chose qui sort du lot */
    var chef = r.lots.filter(function (l) { return l.role === 'chef'; })[0];
    if (chef && COF.MATERIEL.length && Math.random() < 0.6) {
      out.push({ nom: piocher(COF.MATERIEL).nom, note: 'Sur ' + chef.c.nom.toLowerCase() + '.', prix: 0 });
    }

    /* on ne garde pas une montagne d'objets : 1 à 4 pièces de butin mondain */
    return melanger(out).slice(0, Math.min(4, Math.max(1, out.length)));
  }

  /* Trophées / composants prélevés sur la faune et les créatures
     fantastiques abattues. */
  function trophees(r) {
    var out = [];
    r.lots.forEach(function (l) {
      if (l.c.cat === 'humanoide') return;
      var table = l.c.cat === 'fantastique' ? COF.BUTIN_COMPOSANTS : COF.BUTIN_TROPHEES;
      if (!table.length) return;
      if (Math.random() < (l.c.cat === 'fantastique' ? 0.7 : 0.5)) {
        var g = piocher(table);
        out.push({
          nom: g.gabarit.replace('{nom}', l.c.nom.toLowerCase()),
          prix: g.prix,
          nb: Math.max(1, Math.min(l.nb, 3))
        });
      }
    });
    return out;
  }

  /* ---------- Génération : butin de rencontre ---------- */
  function generer(r) {
    if (!r || r.erreur) return null;

    var richesseEnv = COF.ENV_RICHESSE[r.env] || 1;
    var mult = coinMult(r.lots);
    var monnaie = genererPieces(r.utilise, richesseEnv, mult);

    return {
      mode: 'rencontre', po: monnaie.po, pa: monnaie.pa, pc: monnaie.pc,
      objets: objetsMondains(r), composants: trophees(r), tresors: [],
      magique: tirerMagiqueRencontre(r), magique2: null,
      env: r.env, niveau: r.niveau, difficulte: r.difficulte
    };
  }

  /* ---------- Génération : fouille (petite trouvaille) ---------- */
  function genererFouille(opts) {
    opts = opts || {};
    var niveau = Math.max(1, opts.niveau || 1);
    var richesse = opts.richesse || 'standard';
    var richesseEnv = COF.ENV_RICHESSE[opts.env] || 1;
    var points = pointsNiveau(niveau) * richesseMult(richesse) * 0.35;

    var monnaie = genererPieces(points, richesseEnv, 0.6);
    var objets = [];
    var nb = 1 + alea(2);
    for (var i = 0; i < nb; i++) objets.push({ nom: piocher(COF.BUTIN_TROUVAILLES), note: null, prix: 0 });

    return {
      mode: 'fouille', po: monnaie.po, pa: monnaie.pa, pc: monnaie.pc,
      objets: objets, composants: [], tresors: [],
      magique: tirerMagiqueGenerique(niveau, 0.05 * richesseMult(richesse)), magique2: null,
      env: opts.env || null, niveau: niveau, richesse: richesse
    };
  }

  /* ---------- Génération : coffre / trésor accumulé ---------- */
  function genererCoffre(opts) {
    opts = opts || {};
    var niveau = Math.max(1, opts.niveau || 1);
    var richesse = opts.richesse || 'standard';
    var richesseEnv = COF.ENV_RICHESSE[opts.env] || 1;
    var points = pointsNiveau(niveau) * richesseMult(richesse) * 1.4;

    var monnaie = genererPieces(points, richesseEnv, 1);
    var tresors = [];
    var nbT = 1 + alea(3);
    for (var i = 0; i < nbT; i++) {
      var t = piocher(COF.BUTIN_TRESORS);
      tresors.push({ nom: t.nom, prix: t.prix, nb: 1 });
    }

    var chanceMag = 0.22 * richesseMult(richesse);
    var magique = tirerMagiqueGenerique(niveau, chanceMag);
    var magique2 = (richesse === 'somptueux' && Math.random() < 0.4) ? tirerMagiqueGenerique(niveau, 1) : null;

    return {
      mode: 'coffre', po: monnaie.po, pa: monnaie.pa, pc: monnaie.pc,
      objets: [], composants: [], tresors: tresors,
      magique: magique, magique2: magique2,
      env: opts.env || null, niveau: niveau, richesse: richesse
    };
  }

  return {
    generer: generer, genererFouille: genererFouille, genererCoffre: genererCoffre,
    DIFF_MULT: DIFF_MULT
  };
})();
