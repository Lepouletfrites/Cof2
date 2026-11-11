/* ============================================================
   COF2 Compagnon — Moteur des armures et boucliers magiques
   (voies de recettes d'armures du Compagnon du joueur).
   Une armure = une famille (voie) + une pièce du catalogue
   (cuir, mailles, plaques, bouclier) + une base (qualité ou +1 à +5)
   + des propriétés. On en déduit niveau de magie, niveau requis,
   matières premières, tests d'artisanat, effets et l'entrée prête
   pour la fiche. Données : COF.AR_ARMURES (js/data/artisanat.js) et
   COF.AR_BASE (js/data/armes-recettes.js).
   ============================================================ */
window.COF = window.COF || {};

COF.ArmureMagiqueCalc = (function () {
  var piocher = COF.piocher, piockerPoids = COF.piockerPoids;

  function famille(id) { return COF.AR_ARMURES.filter(function (f) { return f.id === id; })[0] || COF.AR_ARMURES[0]; }
  function piece(id) {
    return COF.ARMURES.concat(COF.BOUCLIERS).filter(function (a) { return a.id === id; })[0] || { id: id, nom: id, def: 0 };
  }
  function prop(o, id) { return famille(o.famille).props.filter(function (p) { return p.id === id; })[0] || null; }
  function aProp(o, id) { return (o.props || []).some(function (p) { return p.id === id; }); }

  /* Raison pour laquelle une propriété ne peut pas être ajoutée (ou null). */
  function blocage(o, id) {
    if (aProp(o, id)) return null;
    if (!(o.bonus >= 1)) return 'Nécessite une base magique (+1 ou plus).';
    return null;
  }

  /* ---------- Calcul complet ---------- */
  function calcul(o) {
    var fa = famille(o.famille), pi = piece(o.piece), b = o.bonus || 0;
    var r = { niveau: 1, prix: 0, nm: 0, tests: [], effets: [], def: (pi.def || 0) + b };
    if (b >= 1) {
      var i = Math.min(5, b) - 1;
      r.niveau = COF.AR_BASE.niveau[i]; r.prix = COF.AR_BASE.prix[i]; r.nm = b;
      r.tests.push(Object.keys(fa.tests).map(function (t) {
        var v = fa.tests[t][i];
        if (t === 'façonnage' && o.piece === 'cotte') v += 2;
        if (t === 'façonnage' && o.piece === 'plaquecomp') v += 3;
        if (t === 'forge' && o.piece === 'cuir') return '';
        return t + ' ' + v;
      }).filter(Boolean).join(', '));
      r.effets.push('DEF ' + COF.UI.sgn(r.def) + ' (' + pi.nom + ' ' + COF.UI.sgn(pi.def) + ', bonus magique ' + COF.UI.sgn(b) + ').');
    } else {
      r.prix = o.piece === 'plaquecomp' ? 200 : fa.qualite.prix;
      r.tests.push(o.piece === 'plaquecomp' ? 'forge 20, façonnage 18' : (o.piece === 'cotte' ? 'forge 20, façonnage 17' : fa.qualite.tests));
      r.effets.push('Qualité : ' + fa.qualite.texte);
    }
    (o.props || []).forEach(function (pc) {
      var pp = prop(o, pc.id);
      if (!pp) return;
      r.niveau += pp.niv; r.prix += pp.prix; r.nm += pp.nm;
      r.tests.push(pp.nom + ' : ' + pp.tests);
      r.effets.push(pp.nom + (pc.choix ? ' (' + pc.choix + ')' : '') + (pp.texte ? ' : ' + pp.texte : ''));
    });
    r.valeurPo = Math.round(r.prix / 10);
    r.joursAtelier = Math.max(1, Math.ceil(r.prix / 10));
    return r;
  }

  /* ---------- Nom ---------- */
  var NOMS = { cuir: 'Armure de cuir', cuirren: 'Broigne', chemise: 'Chemise de mailles', cotte: 'Cotte de mailles',
    plaques: 'Armure de plaques', plaquecomp: 'Plaque complète', petit: 'Petit bouclier', grand: 'Grand bouclier' };
  var FEMININ = /^(Armure|Broigne|Chemise|Cotte|Plaque)/;
  function nomPour(o) {
    var base = NOMS[o.piece] || piece(o.piece).nom;
    if (!(o.bonus >= 1)) return base + ' de qualité';
    return COF.ObjetsMagiquesCalc.nomMagique(base, FEMININ.test(base), false, !!o.maudit);
  }

  function choixAleatoire(o, id) {
    var p = prop(o, id);
    return p && p.choix ? piocher(p.choix) : null;
  }

  /* ---------- Tirage calibré sur un niveau de trésor ---------- */
  function generer(niveauMax, imposes) {
    imposes = imposes || {};
    var N = Math.max(1, niveauMax || 1);
    var fa = imposes.famille ? famille(imposes.famille)
      : piockerPoids([[COF.AR_ARMURES[0], 3], [COF.AR_ARMURES[1], 3], [COF.AR_ARMURES[2], 2], [COF.AR_ARMURES[3], 3]]);
    var o = { famille: fa.id, piece: imposes.piece || piocher(fa.types), props: [] };
    var bmax = COF.AR_BASE.niveau.filter(function (n) { return n <= N; }).length;
    if (!bmax) o.bonus = 0;
    else {
      var paires = [];
      for (var b = 1; b <= bmax; b++) paires.push([b, 1 + bmax - b]);
      o.bonus = piockerPoids(paires);
    }
    if (o.bonus >= 1) {
      var cible = piockerPoids([[0, 50], [1, 40], [2, 10]]);
      for (var k = 0; k < cible; k++) {
        var cands = fa.props.filter(function (p) {
          if (aProp(o, p.id)) return false;
          return calcul({ famille: o.famille, piece: o.piece, bonus: o.bonus, props: o.props.concat([{ id: p.id }]) }).niveau <= N;
        });
        if (!cands.length) break;
        var pp = piocher(cands);
        o.props.push({ id: pp.id, choix: pp.choix ? piocher(pp.choix) : null });
      }
    }
    o.maudit = (o.bonus >= 1 && Math.random() < 0.1) ? piocher(COF.OM_MALEDICTIONS) : null;
    o.nom = nomPour(o);
    o.origine = COF.ObjetsMagiquesCalc.genererOrigine();
    return o;
  }

  /* ---------- Entrée prête pour la fiche ---------- */
  function versItem(o) {
    var r = calcul(o), fa = famille(o.famille);
    var detail = r.effets.slice();
    if (o.maudit) detail.push('Malédiction : ' + o.maudit);
    return {
      nom: o.nom || piece(o.piece).nom, qte: 1, prix: r.valeurPo, def: r.def, slot: fa.slot,
      note: 'Niveau de magie ' + r.nm + ' · ' + fa.voie + '. ' + detail.join(' ') +
        (o.origine ? ' Origine : ' + o.origine.provenance + ' · ' + o.origine.epoque + ' · ' + o.origine.peuple + '.' : '')
    };
  }

  return {
    famille: famille, piece: piece, prop: prop, aProp: aProp, blocage: blocage, calcul: calcul,
    nomPour: nomPour, choixAleatoire: choixAleatoire, generer: generer, versItem: versItem
  };
})();
