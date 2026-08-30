/* ============================================================
   COF2 Compagnon — Calculs dérivés du personnage
   ============================================================ */
window.COF = window.COF || {};

COF.Calc = (function () {

  function profil(p) { return COF.PROFILS[p.profil] || null; }
  function famille(p) {
    var pr = profil(p);
    return pr ? COF.RULES.familles[pr.famille] : null;
  }

  function carac(p, id) { return (p.carac && typeof p.carac[id] === 'number') ? p.carac[id] : 0; }

  function armure(p) {
    var a = COF.ARMURES.filter(function (x) { return x.id === p.armure; })[0];
    return a || COF.ARMURES[0];
  }
  function bouclier(p) {
    var b = COF.BOUCLIERS.filter(function (x) { return x.id === p.bouclier; })[0];
    return b || COF.BOUCLIERS[0];
  }

  /* AGI effective : limitée par l'armure portée */
  function agiEffective(p) {
    var a = armure(p);
    return Math.min(carac(p, 'AGI'), a.agiMax);
  }

  function pvMax(p) {
    var f = famille(p); if (!f) return 0;
    var n = p.niveau || 1;
    return (n + 1) * f.pv + n * carac(p, 'CON') + (p.bonus && p.bonus.pv || 0);
  }

  function drMax(p) {
    var f = famille(p); if (!f) return 0;
    var base = 2 + carac(p, 'CON') + (f.id === 'mystique' ? 1 : 0);
    return Math.max(0, base + (p.bonus && p.bonus.dr || 0));
  }
  function drType(p) { var f = famille(p); return f ? f.dr : 6; }

  function pcMax(p) {
    var f = famille(p); if (!f) return 0;
    var base = 2 + carac(p, 'CHA') + (f.id === 'aventurier' ? 1 : 0);
    return Math.max(0, base + (p.bonus && p.bonus.pc || 0));
  }

  /* Toutes les capacités acquises, à plat */
  function capacites(p) {
    var out = [];
    (p.voies || []).forEach(function (v) {
      var def = voieDef(p, v.key);
      if (!def) return;
      for (var r = 1; r <= (v.rang || 0); r++) {
        var c = def.caps.filter(function (x) { return x.r === r; })[0];
        if (c) out.push({ cap: c, voie: def, voieKey: v.key, rang: v.rang });
      }
    });
    return out;
  }

  /* Résout une clé de voie : "profil.brute" | "peuple.humain" | "mage" */
  function voieDef(p, key) {
    if (key === 'mage') return COF.VOIE_MAGE;
    var parts = key.split('.');
    if (parts[0] === 'peuple') {
      var pe = COF.PEUPLES[parts[1]];
      return pe && pe.voie ? pe.voie : null;
    }
    var pr = profil(p);
    if (!pr) return null;
    return pr.voies.filter(function (v) { return v.id === parts[1]; })[0] || null;
  }

  function sorts(p) {
    return capacites(p).filter(function (x) { return x.cap.s; });
  }

  function pmMax(p) {
    var n = sorts(p).length;
    if (n === 0) return 0;
    return carac(p, 'VOL') + n + (p.bonus && p.bonus.pm || 0);
  }

  function def(p) {
    return 10 + agiEffective(p) + armure(p).def + bouclier(p).def + (p.bonus && p.bonus.def || 0);
  }

  function init(p) {
    return 10 + carac(p, 'PER') + (p.bonus && p.bonus.init || 0);
  }

  function nivAttaque(p) { return Math.min(p.niveau || 1, 10); }

  function attaques(p) {
    var n = nivAttaque(p), b = p.bonus || {};
    return {
      contact: n + carac(p, 'FOR') + (b.attC || 0),
      distance: n + carac(p, 'AGI') + (b.attD || 0),
      magique: n + carac(p, 'VOL') + (b.attM || 0)
    };
  }

  function deEvo(p) { return COF.deEvolutif(p.niveau || 1); }

  /* Contexte pour le moteur de dés */
  function ctx(p, rang) {
    return {
      carac: p.carac || {},
      niveau: p.niveau || 1,
      rang: rang || 0,
      deEvo: deEvo(p)
    };
  }

  /* Points de capacité : 2 par niveau après le 1er, + les 3 voies gratuites du niveau 1 */
  function pointsCapacite(p) {
    var n = p.niveau || 1;
    var f = famille(p);
    var dispo = 2 * (n - 1);
    var depense = 0;
    (p.voies || []).forEach(function (v) {
      var estPeuple = v.key.indexOf('peuple.') === 0 || v.key === 'mage';
      for (var r = 1; r <= (v.rang || 0); r++) {
        // les 2 rangs 1 de profil et le rang 1 de peuple sont gratuits à la création
        if (r === 1) continue;
        depense += COF.RULES.rangCout[r] || 2;
      }
    });
    // capacité de rang 2 offerte aux mages
    if (f && f.id === 'mage') dispo += 1;
    return { dispo: dispo, depense: depense, reste: dispo - depense };
  }

  /* Bonus de compétence issus des capacités acquises */
  function competences(p) {
    var out = [];
    capacites(p).forEach(function (x) {
      if (!x.cap.comp) return;
      var val;
      if (x.cap.bon === '2+rang') val = 2 + x.rang;
      else if (typeof x.cap.bon === 'number') val = x.cap.bon;
      else val = null;
      out.push({ nom: x.cap.comp, valeur: val, source: x.voie.nom, cap: x.cap.n });
    });
    return out;
  }

  /* Vérifie si un rang peut être acquis */
  function peutAcquerir(p, key, rang) {
    var niv = p.niveau || 1;
    var requis = COF.RULES.rangNiveau[rang] || 99;
    return niv >= requis;
  }

  function rangDe(p, key) {
    var v = (p.voies || []).filter(function (x) { return x.key === key; })[0];
    return v ? v.rang : 0;
  }

  return {
    profil: profil, famille: famille, carac: carac,
    armure: armure, bouclier: bouclier, agiEffective: agiEffective,
    pvMax: pvMax, pmMax: pmMax, pcMax: pcMax, drMax: drMax, drType: drType,
    def: def, init: init, attaques: attaques, deEvo: deEvo, ctx: ctx,
    capacites: capacites, sorts: sorts, voieDef: voieDef,
    competences: competences, pointsCapacite: pointsCapacite,
    peutAcquerir: peutAcquerir, rangDe: rangDe, nivAttaque: nivAttaque
  };
})();
