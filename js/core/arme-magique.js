/* ============================================================
   COF2 Compagnon — Moteur des armes magiques (voies de recettes)
   Une arme = une famille (voie de recettes) + une arme du catalogue
   + une base (qualité, ou magique +1 à +5) + des propriétés. Tout le
   reste en découle : niveau de magie, niveau requis, matières
   premières (valeur), tests d'artisanat, effets en jeu et l'entrée
   prête à ajouter dans les armes d'un personnage.
   Données : js/data/armes-recettes.js.
   ============================================================ */
window.COF = window.COF || {};

COF.ArmeMagiqueCalc = (function () {
  var piocher = COF.piocher, piockerPoids = COF.piockerPoids;

  function famille(id) { return COF.AR_FAMILLES.filter(function (f) { return f.id === id; })[0] || COF.AR_FAMILLES[0]; }
  function arme(id) {
    var c = COF.ARMES_CONTACT.filter(function (a) { return a.id === id; })[0];
    /* Dans le catalogue, « type » désigne le type de DM (C/P/T) : on le
       conserve sous typeDm et « type » devient contact/distance. */
    if (c) return Object.assign({}, c, { type: 'contact', typeDm: c.type });
    var d = COF.ARMES_DISTANCE.filter(function (a) { return a.id === id; })[0];
    return d ? Object.assign({}, d, { type: 'distance', typeDm: d.type }) : null;
  }
  function prop(id) { return COF.AR_PROPS[id]; }
  function aProp(o, id) { return (o.props || []).some(function (p) { return p.id === id; }); }

  /* Propriétés que la voie de cette famille sait appliquer à cette arme. */
  function propsDispo(o) {
    return famille(o.famille).props.filter(function (id) {
      var p = prop(id);
      return p && (!p.armes || p.armes.indexOf(o.arme) >= 0);
    });
  }

  /* Raison pour laquelle une propriété ne peut pas être ajoutée (ou null). */
  function blocage(o, id) {
    var p = prop(id);
    if (aProp(o, id)) return null;
    if (aProp(o, 'maudite')) return 'La dague maudite ne peut recevoir aucune autre propriété.';
    if (p.exclusif && (o.props || []).length) return 'Propriété exclusive : retirez les autres propriétés.';
    if (!p.exclusif && !(o.bonus >= 1)) return 'Nécessite une base magique (+1 ou plus).';
    var inc = (p.incompat || []).filter(function (x) { return aProp(o, x); });
    if (inc.length) return 'Incompatible avec ' + prop(inc[0]).nom + '.';
    return null;
  }

  function estSabre(o) { return o.arme === 'sabrecourt' || o.arme === 'sabredroit'; }

  /* ---------- Calcul complet ---------- */
  function calcul(o) {
    var f = famille(o.famille), a = arme(o.arme) || {};
    var r = {
      nm: 0, niveau: 1, prix: 0, tests: [], effets: [],
      bonusAtt: 0, bonusDm: 0, bonusDef: 0, critPlus: 0, elementaires: [], ajoutDm: [], porteeMult: 1
    };
    var maudite = aProp(o, 'maudite');
    var b = o.bonus || 0;

    if (maudite) {
      var mb = prop('maudite').base;
      b = mb.bonus; r.nm = mb.nm; r.niveau = mb.niveau; r.prix = mb.prix;
      r.tests.push(prop('maudite').tests);
      r.critFixe = mb.crit;
      r.bonusAtt = r.bonusDm = b;
    } else if (b <= 0) {
      if (o.qualite === 'misericorde' && o.arme === 'dague') {
        r.prix = COF.AR_MISERICORDE.prix; r.tests.push(COF.AR_MISERICORDE.tests);
        r.effets.push(COF.AR_MISERICORDE.texte);
      } else {
        r.prix = f.qualite.prix; r.tests.push(f.qualite.tests + (estSabre(o) ? ' (forge +3 pour un sabre)' : ''));
        r.bonusAtt = 1; r.effets.push('Arme de qualité : ' + f.qualite.texte + '.');
      }
    } else {
      var i = Math.min(5, b) - 1;
      r.nm = b; r.niveau = COF.AR_BASE.niveau[i]; r.prix = COF.AR_BASE.prix[i];
      r.tests.push(Object.keys(f.tests).map(function (t) {
        return t + ' ' + (f.tests[t][i] + (t === 'forge' && estSabre(o) ? 3 : 0));
      }).join(', '));
      if (aProp(o, 'parade')) { r.bonusDef = b; r.effets.push('+' + b + ' en DEF (parade) au lieu de l’attaque et des DM.'); }
      else { r.bonusAtt = r.bonusDm = b; }
    }

    var nivMin = 0;
    (o.props || []).forEach(function (pc) {
      var p = prop(pc.id);
      if (!p || pc.id === 'maudite') { if (p) r.effets.push(p.texte); return; }
      r.nm += p.nm; r.niveau += p.niv; r.prix += p.prix;
      if (p.nivMin) nivMin = Math.max(nivMin, p.nivMin);
      if (p.tests && p.tests !== '—') r.tests.push(p.nom + ' : ' + p.tests);
      r.critPlus += p.crit || 0;
      var texte = p.texte;
      if (p.choix === 'element') {
        var el = COF.AR_ELEMENTS.filter(function (e) { return e.id === pc.choix; })[0] || COF.AR_ELEMENTS[0];
        r.elementaires.push({ formule: '1d4°', label: el.label });
        texte = '+1d4° DM ' + el.label + ' (gemme : ' + el.gemme + ').';
      } else if (p.choix === 'fleau') {
        texte = '+1d4° DM contre les ' + (pc.choix || COF.AR_FLEAUX[0]) + '.';
      } else if (p.choix === 'variante') {
        var v = p.variantes.filter(function (x) { return x.id === pc.choix; })[0] || p.variantes[0];
        r.critPlus += v.crit || 0;
        if (v.portee) r.porteeMult *= v.portee;
        if (v.ajoutDm) r.ajoutDm.push(v.ajoutDm);
        texte = p.nom + ' : ' + v.nom + '.';
      }
      if (!p.parade) r.effets.push(texte);
    });
    r.niveau = Math.max(r.niveau, nivMin);
    if (aProp(o, 'equilibree') && a.type === 'contact') r.effets.push('Portée doublée en lancer.');

    /* Critique : critique de base de l'arme moins les bonus, limité à 16-20. */
    var critBase = r.critFixe || a.crit || 20;
    r.crit = r.critFixe || Math.max(16, critBase - r.critPlus);

    r.prix = Math.round(r.prix);
    r.valeurPo = Math.round(r.prix / 10);
    r.joursAtelier = Math.max(1, Math.ceil(r.prix / 10));
    r.portee = a.portee ? Math.round(a.portee * r.porteeMult) : null;
    r.dm = a.dm; r.dm2 = a.dm2 || null; r.type = a.type || 'contact';
    r.bonusMax = b;
    return r;
  }

  /* ---------- Nom ---------- */
  var FEMININ = /^(Épée|Dague|Hache|Hachette|Masse|Lance|Arbalète|Pétoire|Rapière|Vivelame|Pique|Fronde)/;
  function nomPour(o) {
    var a = arme(o.arme) || { nom: 'Arme' };
    return COF.ObjetsMagiquesCalc.nomMagique(a.nom, FEMININ.test(a.nom));
  }

  /* ---------- Choix aléatoire d'une option de propriété ---------- */
  function choixAleatoire(id) {
    var p = prop(id);
    if (p.choix === 'element') return piocher(COF.AR_ELEMENTS).id;
    if (p.choix === 'fleau') return piocher(COF.AR_FLEAUX);
    if (p.choix === 'variante') return piocher(p.variantes).id;
    return null;
  }

  /* ---------- Tirage aléatoire calibré sur un niveau de trésor ----------
     Le niveau requis pour fabriquer l'arme ne dépasse jamais le niveau
     indiqué : un trésor trouvé reste cohérent avec la puissance du groupe. */
  function generer(niveauMax, imposes) {
    imposes = imposes || {};
    var N = Math.max(1, niveauMax || 1);
    var f = imposes.famille ? famille(imposes.famille)
      : piockerPoids(COF.AR_FAMILLES.map(function (x) { return [x, x.poids]; }));
    var o = { famille: f.id, arme: imposes.arme || piocher(f.armes), props: [], qualite: 'standard' };

    var bmax = COF.AR_BASE.niveau.filter(function (n) { return n <= N; }).length;
    if (!bmax) {
      o.bonus = 0;
      if (o.arme === 'dague' && Math.random() < 0.3) o.qualite = 'misericorde';
    } else {
      var paires = [];
      for (var b = 1; b <= bmax; b++) paires.push([b, 1 + bmax - b]);
      o.bonus = piockerPoids(paires);
    }

    if (o.bonus >= 1) {
      var dispo = propsDispo(o);
      if (dispo.indexOf('maudite') >= 0 && N >= 13 && Math.random() < 0.12) {
        o.props.push({ id: 'maudite', choix: null });
        o.bonus = 3;
      } else {
        var cible = piockerPoids([[0, 45], [1, 40], [2, 15]]);
        for (var k = 0; k < cible; k++) {
          var cands = dispo.filter(function (id) {
            if (id === 'maudite' || blocage(o, id)) return false;
            if (id === 'parade' && Math.random() > 0.25) return false;
            var test = { famille: o.famille, arme: o.arme, bonus: o.bonus, props: o.props.concat([{ id: id }]) };
            return calcul(test).niveau <= N;
          });
          if (!cands.length) break;
          var pid = piocher(cands);
          o.props.push({ id: pid, choix: choixAleatoire(pid) });
        }
      }
    }
    o.nom = nomPour(o);
    o.maudit = Math.random() < 0.1 ? piocher(COF.OM_MALEDICTIONS) : null;
    o.origine = COF.ObjetsMagiquesCalc.genererOrigine();
    return o;
  }

  /* ---------- Objet transférable vers un personnage ---------- */
  function versItem(o) {
    var r = calcul(o), a = arme(o.arme) || {};
    var detail = r.effets.slice();
    if (r.ajoutDm.length) detail.push('+' + r.ajoutDm.join(' et ') + ' aux DM jusqu’à portée nominale.');
    if (o.maudit) detail.push('Malédiction : ' + o.maudit);
    var resume = 'Niveau de magie ' + r.nm + ' · ' + famille(o.famille).voie + '.';
    var noteArme = (o.props || []).map(function (pc) {
      var p = prop(pc.id);
      if (!p) return '';
      if (p.choix === 'element') {
        var el = COF.AR_ELEMENTS.filter(function (e) { return e.id === pc.choix; })[0];
        return 'élémentaire (' + (el ? el.nom : '?') + ')';
      }
      if (p.choix === 'fleau') return 'fléau des ' + pc.choix;
      return p.nom.toLowerCase();
    }).filter(Boolean);
    if (r.bonusDef) noteArme.unshift('+' + r.bonusDef + ' DEF parade');
    if (r.bonusAtt && !r.bonusDm) noteArme.unshift('qualité (+1 att.)');
    if (o.qualite === 'misericorde' && !(o.bonus >= 1)) noteArme.unshift('miséricorde');
    return {
      nom: o.nom || a.nom,
      qte: 1,
      prix: r.valeurPo,
      dm: a.dm, dm2: a.dm2 || null, armeType: a.type, portee: r.portee,
      crit: r.crit, noFor: !!a.noFor,
      bonus: r.bonusDm,
      bonusAtt: r.bonusAtt - r.bonusDm,
      elementaires: r.elementaires,
      noteArme: noteArme.join(', '),
      note: resume + ' ' + detail.join(' ') +
        (o.origine ? ' Origine : ' + o.origine.provenance + ' · ' + o.origine.epoque + ' · ' + o.origine.peuple + '.' : '')
    };
  }

  return {
    famille: famille, arme: arme, prop: prop, aProp: aProp, propsDispo: propsDispo, blocage: blocage,
    calcul: calcul, generer: generer, nomPour: nomPour, choixAleatoire: choixAleatoire, versItem: versItem
  };
})();
