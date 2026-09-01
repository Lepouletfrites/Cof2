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

  /* Une armure/un bouclier trouvé en jeu (voir Objets) occupe le même
     emplacement qu'une armure/un bouclier du catalogue plutôt que de s'y
     additionner : un seul est actif à la fois. L'objet équipé est marqué
     directement sur lui (o.equipe) plutôt que référencé ailleurs sur le
     personnage, pour rester valide après une sérialisation JSON (sauvegarde
     locale, où deux objets distincts ne sont jamais réellement le même). */
  function objetEquipe(p, slot) {
    return (p.inventaire || []).filter(function (o) { return o.slot === slot && o.equipe; })[0] || null;
  }
  function armure(p) {
    var eq = objetEquipe(p, 'armure');
    if (eq) return { id: '_objet', nom: eq.nom, def: eq.def, agiMax: 99, prix: 0, rang: 0 };
    var a = COF.ARMURES.filter(function (x) { return x.id === p.armure; })[0];
    return a || COF.ARMURES[0];
  }
  function bouclier(p) {
    var eq = objetEquipe(p, 'bouclier');
    if (eq) return { id: '_objet', nom: eq.nom, def: eq.def, prix: 0 };
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
      var base = rangsDe(def)[0];         // 1 en général, 4 (ou 3) en prestige
      for (var r = base; r <= (v.rang || 0); r++) {
        var c = def.caps.filter(function (x) { return x.r === r; })[0];
        if (c) out.push({ cap: c, voie: def, voieKey: v.key, rang: v.rang });
      }
    });
    return out;
  }

  /* Résout une clé de voie :
       "peuple.humain"          voie de peuple
       "mage"                   voie du mage
       "profil.brute"           voie du profil principal
       "hyb.guerrier.combat"    voie d'un autre profil (profil hybride)
       "prestige.colosse"       voie de prestige
       "historique.nomade"      voie d'historique (Atlas d'Osgild)     */
  function voieDef(p, key) {
    if (key === 'mage') return COF.VOIE_MAGE;
    var parts = key.split('.');
    if (parts[0] === 'peuple') {
      var pe = COF.PEUPLES[parts[1]];
      return pe && pe.voie ? pe.voie : null;
    }
    if (parts[0] === 'prestige') {
      return (COF.PRESTIGE && COF.PRESTIGE[parts[1]]) || null;
    }
    if (parts[0] === 'historique') {
      var geo = (COF.HISTORIQUE_GEO || []).filter(function (v) { return v.id === parts[1]; })[0];
      if (geo) return geo;
      return (COF.HISTORIQUE_PRO || []).filter(function (v) { return v.id === parts[1]; })[0] || null;
    }
    if (parts[0] === 'hyb') {
      var pro = COF.PROFILS[parts[1]];
      if (!pro) return null;
      var v = pro.voies.filter(function (x) { return x.id === parts[2]; })[0];
      if (!v) return null;
      return { id: v.id, nom: v.nom + ' (' + pro.nom + ')', caps: v.caps, profil: pro.id };
    }
    var pr = profil(p);
    if (!pr) return null;
    return pr.voies.filter(function (v) { return v.id === parts[1]; })[0] || null;
  }

  function estPrestige(key) { return key.indexOf('prestige.') === 0; }
  function estHistorique(key) { return key.indexOf('historique.') === 0; }

  /* Rangs disponibles dans une voie (1-5, ou 4-8 / 3-7 en prestige) */
  function rangsDe(voie) {
    return voie.caps.map(function (c) { return c.r; }).sort(function (a, b) { return a - b; });
  }

  /* Niveau requis pour un rang donné, selon le type de voie.
     Les voies d'historique n'ont aucune limitation de rang liée au niveau. */
  function niveauRequis(key, rang) {
    if (estHistorique(key)) return 1;
    if (estPrestige(key)) return COF.RULES.prestigeNiveau[rang] || 99;
    return COF.RULES.rangNiveau[rang] || 99;
  }

  /* Voie de prestige actuellement choisie (une seule par carrière) */
  function prestigeActive(p) {
    return (p.voies || []).filter(function (v) { return estPrestige(v.key); })[0] || null;
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

  /* Points de capacité : 2 par niveau après le 1er.
     Trois rangs 1 sont gratuits à la création (2 voies de profil + la voie de peuple). */
  function pointsCapacite(p) {
    var n = p.niveau || 1;
    var f = famille(p);
    var dispo = 2 * (n - 1);
    if (f && f.id === 'mage') dispo += 1;   // capacité de rang 2 offerte aux mages
    var gratuits = 3;
    var depense = 0;
    (p.voies || []).forEach(function (v) {
      var def = voieDef(p, v.key);
      if (!def) return;
      var histo = estHistorique(v.key);
      var base = rangsDe(def)[0];
      for (var r = base; r <= (v.rang || 0); r++) {
        if (histo) { depense += 1; continue; }         // voie d'historique : 1 point par rang, toujours
        if (r === 1 && gratuits > 0) { gratuits--; continue; }
        depense += COF.RULES.rangCout[r] || 2;
      }
    });
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
    return (p.niveau || 1) >= niveauRequis(key, rang);
  }

  function rangDe(p, key) {
    var v = (p.voies || []).filter(function (x) { return x.key === key; })[0];
    return v ? v.rang : 0;
  }

  /* Nombre de voies distinctes d'un profil donné (principal ou hybride) où
     le personnage a atteint au moins `seuil`. Sert aux capacités dont le
     texte dit « +X par rang N atteint dans une voie de [profil] ».
     Les voies du profil PRINCIPAL sont stockées sous la clé « profil.<voieId> »
     (sans le nom du profil lui-même) : on ne peut donc les rattacher à
     `profilId` que si c'est justement le profil actif du personnage. */
  function rangsAtteintsProfil(p, profilId, seuil) {
    return (p.voies || []).filter(function (v) {
      if (v.rang < seuil) return false;
      if (p.profil === profilId && v.key.indexOf('profil.') === 0) return true;
      return v.key.indexOf('hyb.' + profilId + '.') === 0;
    }).length;
  }

  return {
    profil: profil, famille: famille, carac: carac,
    armure: armure, bouclier: bouclier, objetEquipe: objetEquipe, agiEffective: agiEffective,
    pvMax: pvMax, pmMax: pmMax, pcMax: pcMax, drMax: drMax, drType: drType,
    def: def, init: init, attaques: attaques, deEvo: deEvo, ctx: ctx,
    capacites: capacites, sorts: sorts, voieDef: voieDef,
    competences: competences, pointsCapacite: pointsCapacite,
    peutAcquerir: peutAcquerir, rangDe: rangDe, nivAttaque: nivAttaque, rangsAtteintsProfil: rangsAtteintsProfil,
    estPrestige: estPrestige, estHistorique: estHistorique, rangsDe: rangsDe, niveauRequis: niveauRequis,
    prestigeActive: prestigeActive
  };
})();
