/* ============================================================
   COF2 Compagnon — Moteur d'artisanat (Compagnon du joueur, ch. 4-5)
   · compétences d'artisan du personnage (alchimie, façonnage, forge,
     lapidage) : caractéristique + voies d'artisan + synergie + peuple
     + forgesort (élixirs / métal) ;
   · rangs de voies de recettes : budget (3 par rang d'artisan) et
     répartition, mémorisés dans p.artisanat ;
   · projet de fabrication (arme, armure/bouclier ou objet du
     catalogue) : niveau requis, matières premières (avec réductions),
     durée, tests d'artisanat structurés, jet des tests et issue selon
     les règles « Réaliser les tests ».
   ============================================================ */
window.COF = window.COF || {};

COF.Artisanat = (function () {
  var COMPS = ['alchimie', 'façonnage', 'forge', 'lapidage'];
  var AM = function () { return COF.ArmeMagiqueCalc; };

  /* ---------- État d'artisan du personnage ---------- */
  function etat(p) {
    p.artisanat = p.artisanat || {};
    var a = p.artisanat;
    a.recettes = a.recettes || {};     // { 'Voie des lames': 2, ... }
    a.synergies = a.synergies || {};   // { forgeron: 'lapidage', ... }
    a.peuple = a.peuple || '';         // compétence remplaçant le +3 de peuple
    a.extra = a.extra || 0;            // rangs supplémentaires (grand maître, MJ)
    return a;
  }
  function rangArtisan(p, id) { return COF.Calc.rangDe(p, 'artisan.' + id); }
  function voieArtisanDe(comp) { return COF.ARTISAN_VOIES.filter(function (v) { return v.competence === comp; })[0]; }

  /* Bonus total d'une compétence, avec le détail de ses sources. */
  function competence(p, comp) {
    var def = COF.ARTISAN_COMPETENCES.filter(function (c) { return c.id === comp; })[0];
    var a = etat(p), src = [];
    var val = COF.Calc.carac(p, def.carac);
    src.push(def.carac + ' ' + COF.UI.sgn(val));
    var va = voieArtisanDe(comp), r = rangArtisan(p, va.id);
    if (r) { val += r + 2; src.push(va.nom + ' +' + (r + 2)); }
    COF.ARTISAN_VOIES.forEach(function (v) {
      if (rangArtisan(p, v.id) >= 3 && a.synergies[v.id] === comp) { val += 3; src.push('synergie (' + v.nom + ') +3'); }
    });
    if (a.peuple === comp) { val += 3; src.push('peuple +3'); }
    if (p.profil === 'forgesort') {
      var cle = comp === 'alchimie' ? 'profil.elixirs' : (comp === 'forge' ? 'profil.metal' : null);
      var rf = cle ? COF.Calc.rangDe(p, cle) : 0;
      if (rf) { val += rf + 2; src.push((comp === 'alchimie' ? 'Voie des élixirs' : 'Voie du métal') + ' +' + (rf + 2)); }
    }
    return { id: comp, nom: def.nom, carac: def.carac, bonus: val, sources: src, deBonus: r >= 5, lieu: def.lieu };
  }
  function competences(p) { return COMPS.map(function (c) { return competence(p, c); }); }

  /* Budget de rangs de voies de recettes. */
  function budget(p) {
    var a = etat(p), total = a.extra;
    COF.ARTISAN_VOIES.forEach(function (v) { total += 3 * rangArtisan(p, v.id); });
    var depense = Object.keys(a.recettes).reduce(function (s, k) { return s + (a.recettes[k] || 0); }, 0);
    return { total: total, depense: depense, reste: total - depense };
  }
  function rangRecette(p, voie) {
    var r = etat(p).recettes;
    if (/lames et des haches/.test(voie)) return Math.max(r['Voie des lames'] || 0, r['Voie des haches'] || 0);
    return r[voie] || 0;
  }

  /* Réduction de coût et de durée (compagnon -10 %, maître -25 %) selon
     la voie d'artisan correspondant au test principal. */
  function reduction(p, comp) {
    var va = voieArtisanDe(comp);
    var r = va ? rangArtisan(p, va.id) : 0;
    return r >= 4 ? 0.25 : (r >= 2 ? 0.10 : 0);
  }

  /* ---------- Liste des voies de recettes ---------- */
  function voiesRecettes() {
    var out = [], vu = {};
    function aj(nom, groupe) { if (!vu[nom]) { vu[nom] = 1; out.push({ nom: nom, groupe: groupe }); } }
    aj('Voie des dagues', 'Armes');
    COF.AR_FAMILLES.forEach(function (f) { aj(f.voie, 'Armes'); });
    COF.AR_ARMURES.forEach(function (f) { aj(f.voie, 'Armures et boucliers'); });
    (COF.CATALOGUE_COMPAGNON || []).forEach(function (o) {
      if (/lames et des haches/.test(o.v)) return;
      aj(o.v, o.g === 'potions' ? 'Potions' : (o.g === 'armes' ? 'Armes' : (o.g === 'armures' ? 'Armures et boucliers' : 'Objets divers')));
    });
    return out;
  }

  /* ---------- Lecture des difficultés ----------
     « forge 21 » fixe une difficulté ; « lapidage +5 » ou « alchimie et
     forge +3 » s'ajoutent à la difficulté de base du même test.          */
  var RE = /((?:alchimie|façonnage|forge|lapidage)(?:\s*(?:,|et)\s*(?:alchimie|façonnage|forge|lapidage))*)\s*(\+?)\s*(\d+)/g;
  function lireTests(lignes) {
    var d = {};
    lignes.forEach(function (l) {
      var m; RE.lastIndex = 0;
      while ((m = RE.exec(l))) {
        var comps = m[1].split(/\s*(?:,|\bet\b)\s*/).filter(Boolean);
        var v = parseInt(m[3], 10);
        comps.forEach(function (c) {
          if (m[2] === '+') { if (d[c] !== undefined) d[c] += v; }
          else d[c] = Math.max(d[c] || 0, v);
        });
      }
    });
    return COMPS.filter(function (c) { return d[c] !== undefined; }).map(function (c) { return { comp: c, diff: d[c] }; });
  }

  /* ---------- Variantes d'un objet du catalogue ---------- */
  function entiers(s) {
    s = String(s).replace(/(\d)\s(?=\d{3}\b)/g, '$1').replace(/\(([^:)]*):\s*/g, '(');
    return (s.match(/\d+/g) || []).map(Number);
  }
  function variantes(o) {
    if (/^\+/.test(String(o.niv)) || /%/.test(String(o.prix))) return [];
    var nivs = entiers(o.niv), prix = entiers(o.prix);
    if (!nivs.length || !prix.length) return [];
    var n = Math.min(nivs.length, prix.length);
    var out = [];
    for (var i = 0; i < n; i++) {
      var tests = String(o.tests)
        .replace(/(\d+)-(\d+)/g, function (_, a, b) { a = +a; b = +b; return n > 1 ? String(Math.round(a + (b - a) * i / (n - 1))) : a; })
        .replace(/(\d+)\/(\d+)/g, function (_, a, b) { return i ? b : a; });
      out.push({ i: i, niveau: nivs[i], prix: prix[i], tests: tests });
    }
    return out;
  }

  /* ---------- Projet de fabrication ----------
     proj = { type: 'arme', arme: {famille, arme, bonus, props, qualite} }
          | { type: 'armure', famille, piece, bonus, props: [{id, choix}] }
          | { type: 'objet', cle, variante }                              */
  function armureFam(id) { return COF.AR_ARMURES.filter(function (f) { return f.id === id; })[0] || COF.AR_ARMURES[0]; }
  function piece(id) {
    return COF.ARMURES.concat(COF.BOUCLIERS).filter(function (a) { return a.id === id; })[0] || { nom: id, def: 0 };
  }
  function objetCatalogue(cle) {
    return (COF.CATALOGUE_COMPAGNON || []).filter(function (o) { return o.v + '|' + o.n === cle; })[0] || null;
  }
  var DAGUES = ['poison', 'invisible', 'assassin', 'maudite'];

  function analyser(p, proj) {
    var r = { niveau: 1, prix: 0, nm: 0, lignesTests: [], effets: [], recettes: [], nom: '', item: null };
    function exige(voie, rang, quoi) {
      var a = rangRecette(p, voie);
      r.recettes.push({ voie: voie, rang: rang, quoi: quoi, ok: a >= rang, actuel: a });
    }

    if (proj.type === 'arme') {
      var o = proj.arme, c = AM().calcul(o), f = AM().famille(o.famille);
      r.niveau = c.niveau; r.prix = c.prix; r.nm = c.nm; r.lignesTests = c.tests.slice(); r.effets = c.effets.slice();
      r.nom = o.nom || (AM().arme(o.arme) || {}).nom;
      if (o.qualite === 'misericorde' && !(o.bonus >= 1)) exige('Voie des dagues', 1, 'Miséricorde');
      else exige(f.voie, o.bonus >= 1 ? 2 : 1, o.bonus >= 1 ? 'Arme magique +' + o.bonus : 'Arme de qualité');
      (o.props || []).forEach(function (pc) {
        var pp = AM().prop(pc.id);
        exige(DAGUES.indexOf(pc.id) >= 0 ? 'Voie des dagues' : f.voie, pp.rang, pp.nom);
      });
      r.item = AM().versItem(o);
    } else if (proj.type === 'armure') {
      var fa = armureFam(proj.famille), pi = piece(proj.piece), b = proj.bonus || 0;
      if (b >= 1) {
        var i = b - 1;
        r.niveau = COF.AR_BASE.niveau[i]; r.prix = COF.AR_BASE.prix[i]; r.nm = b;
        r.lignesTests.push(Object.keys(fa.tests).map(function (t) {
          var v = fa.tests[t][i];
          if (t === 'façonnage' && proj.piece === 'cotte') v += 2;
          if (t === 'façonnage' && proj.piece === 'plaquecomp') v += 3;
          if (t === 'forge' && proj.piece === 'cuir') return '';
          return t + ' ' + v;
        }).filter(Boolean).join(', '));
        exige(fa.voie, 2, fa.nom + ' magique +' + b);
      } else {
        r.prix = proj.piece === 'plaquecomp' ? 200 : fa.qualite.prix;
        r.lignesTests.push(proj.piece === 'plaquecomp' ? 'forge 20, façonnage 18' : (proj.piece === 'cotte' ? 'forge 20, façonnage 17' : fa.qualite.tests));
        r.effets.push('Qualité : ' + fa.qualite.texte);
        exige(fa.voie, 1, fa.nom + ' de qualité');
      }
      var nivMin = 0;
      (proj.props || []).forEach(function (pc) {
        var pp = fa.props.filter(function (x) { return x.id === pc.id; })[0];
        if (!pp) return;
        r.niveau += pp.niv; r.prix += pp.prix; r.nm += pp.nm;
        r.lignesTests.push(pp.nom + ' : ' + pp.tests);
        r.effets.push(pp.nom + (pc.choix ? ' (' + pc.choix + ')' : '') + (pp.texte ? ' : ' + pp.texte : ''));
        exige(fa.voie, pp.rang, pp.nom);
      });
      r.niveau = Math.max(r.niveau, nivMin);
      var def = (pi.def || 0) + b;
      r.nom = proj.nom || (pi.nom + (b ? ' +' + b : ' de qualité'));
      if (b) r.effets.unshift('DEF ' + COF.UI.sgn(def) + ' (' + pi.nom + ' ' + COF.UI.sgn(pi.def) + ', bonus magique ' + COF.UI.sgn(b) + ').');
      r.item = { nom: r.nom, qte: 1, prix: Math.round(r.prix / 10), def: def, slot: fa.slot,
        note: r.effets.join(' ') + ' Niveau de magie ' + r.nm + ' · ' + fa.voie + '.' };
    } else {
      var ob = objetCatalogue(proj.cle);
      if (!ob) return null;
      var vs = variantes(ob), v = vs[Math.min(proj.variante || 0, vs.length - 1)] || { niveau: 1, prix: 0, tests: ob.tests, i: 0 };
      r.niveau = v.niveau; r.prix = v.prix; r.nm = ob.nm; r.lignesTests.push(v.tests); r.effets.push(ob.d);
      r.nom = ob.n + (vs.length > 1 ? ' (' + (v.i + 1) + '/' + vs.length + ')' : '');
      exige(ob.v, ob.r, ob.n);
      var it = COF.UI.Catalogue.versItem(ob);
      if (vs.length > 1 && ob.def) it.def = /Bracelets/.test(ob.n) ? v.i + 2 : v.i + 1;
      if (vs.length > 1 && ob.arme && ob.arme.bonusAuto) it.bonus = v.i + 1;
      if (vs.length > 1 && /^Anneau de protection|^Anneau de mana|^Sceptre de magie/.test(ob.n)) it.nom = ob.n + ' +' + (v.i + 1);
      it.prix = Math.round(v.prix / 10);
      r.item = it;
    }

    r.tests = lireTests(r.lignesTests).map(function (t) {
      var c = competence(p, t.comp);
      return { comp: t.comp, nom: c.nom, diff: t.diff, bonus: c.bonus, deBonus: c.deBonus,
        chance: Math.max(5, Math.min(100, (21 - (t.diff - c.bonus)) * 5)) };
    });
    var principal = r.tests.slice().sort(function (a, b) { return b.diff - a.diff; })[0];
    r.principal = principal ? principal.comp : null;
    r.tests.forEach(function (t) { t.principal = t.comp === r.principal; });
    r.reduction = principal ? reduction(p, principal.comp) : 0;
    r.prixReduit = Math.round(r.prix * (1 - r.reduction));
    r.joursAtelier = Math.max(1, Math.ceil(r.prixReduit / 10));
    r.joursAventure = Math.max(1, r.prixReduit);
    r.niveauOK = (p.niveau || 1) >= r.niveau;
    r.recettesOK = r.recettes.every(function (x) { return x.ok; });
    r.lieux = r.tests.map(function (t) { return competence(p, t.comp).lieu; });
    return r;
  }

  /* ---------- Jet des tests (règles « Réaliser les tests ») ---------- */
  function d20() { return 1 + Math.floor(Math.random() * 20); }
  function lancer(analyse) {
    var res = analyse.tests.map(function (t) {
      var d = d20(), d2 = t.deBonus ? d20() : null, nat = d2 !== null ? Math.max(d, d2) : d;
      var total = nat + t.bonus;
      return { comp: t.comp, nom: t.nom, diff: t.diff, bonus: t.bonus, nat: nat, total: total, marge: total - t.diff,
        ok: nat !== 1 && (nat === 20 || total >= t.diff), principal: t.principal };
    });
    var rates = res.filter(function (x) { return !x.ok; });
    var desastre = res.some(function (x) { return x.nat === 1 || x.marge <= -10; });
    var princ = res.filter(function (x) { return x.principal; })[0];
    var issue;
    if (!rates.length) {
      issue = (princ && (princ.nat === 20 || princ.marge >= 10))
        ? { cle: 'rapide', texte: "Tous les tests sont réussis avec brio : l'objet est terminé en deux fois moins de temps (" + Math.ceil(analyse.joursAtelier / 2) + ' jours en atelier).' }
        : { cle: 'ok', texte: "Tous les tests sont réussis : l'objet sera terminé au bout de la durée prévue (" + analyse.joursAtelier + ' jours en atelier).' };
    } else if (desastre) {
      issue = { cle: 'desastre', texte: "Échec grave (1 naturel ou raté de 10 points) : 50 % de la matière première concernée est perdue et l'objet ne pourra être terminé qu'après un passage de niveau." };
    } else {
      var perte = Math.round(analyse.prixReduit * 0.2 * rates.length);
      issue = { cle: 'echec', texte: rates.length + ' test(s) raté(s) : ' + (20 * rates.length) + ' % de matière première perdue (' + perte.toLocaleString('fr-FR') +
        ' pa à racheter, durée rallongée d’autant), puis refaire les tests ratés. Abandon possible : on obtient un objet ordinaire, sans bonus.' };
    }
    return { tests: res, issue: issue };
  }

  /* ---------- Bourse : payer les matières premières (en pa) ---------- */
  function payer(p, pa) {
    var b = p.bourse || { po: 0, pa: 0, pc: 0 };
    var dispo = (b.po || 0) * 10 + (b.pa || 0);
    if (dispo < pa) return false;
    var reste = dispo - pa;
    b.po = Math.floor(reste / 10); b.pa = reste % 10;
    p.bourse = b;
    return true;
  }

  return {
    COMPS: COMPS, etat: etat, competence: competence, competences: competences, budget: budget,
    rangRecette: rangRecette, rangArtisan: rangArtisan, voiesRecettes: voiesRecettes, lireTests: lireTests,
    variantes: variantes, analyser: analyser, lancer: lancer, payer: payer, objetCatalogue: objetCatalogue,
    armureFam: armureFam, piece: piece
  };
})();
