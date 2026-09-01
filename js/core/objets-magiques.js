/* ============================================================
   COF2 Compagnon — Moteur des objets magiques (règles officielles)
   Huit catégories (potion, parchemin, baguette, arme magique,
   armure/bouclier magique, objet de pouvoir, objet de puissance,
   objet de compétence), chacune avec son propre générateur à
   champs verrouillables. Quand la règle demande un sort ou une
   capacité, on pioche une vraie entrée de la base de voies plutôt
   qu'une liste figée, pour maximiser les combinaisons.
   ============================================================ */
window.COF = window.COF || {};

COF.ObjetsMagiquesCalc = (function () {
  var piocher = COF.piocher, piockerPoids = COF.piockerPoids, alea = COF.alea;

  /* ---------- Pioche un sort/une capacité réel(le) dans la base ---------- */
  function piocherSort(profils, rangMin, rangMax) {
    var tentatives = 25;
    while (tentatives--) {
      var pid = piocher(profils);
      var pr = COF.PROFILS[pid];
      if (!pr || !pr.voies.length) continue;
      var voie = piocher(pr.voies);
      var pool = voie.caps.filter(function (c) { return c.s && c.r >= rangMin && c.r <= rangMax; });
      if (pool.length) return { profil: pid, profilNom: pr.nom, voie: voie.id, voieNom: voie.nom, cap: piocher(pool) };
    }
    return null;
  }
  function piocherCapacite(profilId, rang) {
    var pr = COF.PROFILS[profilId];
    if (!pr) return null;
    var pool = [];
    pr.voies.forEach(function (v) {
      v.caps.forEach(function (c) { if (c.r === rang) pool.push({ voie: v, cap: c }); });
    });
    if (!pool.length) return null;
    var pick = piocher(pool);
    return { profil: profilId, profilNom: pr.nom, voie: pick.voie.id, voieNom: pick.voie.nom, cap: pick.cap };
  }

  /* Petit nom procédural réutilisant les mêmes briques que le générateur
     de Trésors nommés (préfixes/suffixes/épithètes/adjectifs partagés). */
  function nomProcedural(nomType, feminin) {
    var style = piocher(['compose', 'epithete', 'adjectif']);
    if (style === 'compose') return piocher(COF.TRESOR_NOM_PREFIXES) + piocher(COF.TRESOR_NOM_SUFFIXES);
    if (style === 'epithete') {
      var ep = piocher(COF.TRESOR_EPITHETES);
      var lien = /^le /i.test(ep) ? 'du ' + ep.slice(3) : (/^les /i.test(ep) ? 'des ' + ep.slice(4) : 'de ' + ep);
      return nomType + ' ' + lien;
    }
    return nomType + ' ' + piocher(feminin ? COF.TRESOR_ADJ_F : COF.TRESOR_ADJ_M);
  }

  var PALIERS_ARME = [
    { id: 'mineur', nom: 'Mineur', bonus: 1 },
    { id: 'majeur', nom: 'Majeur', bonus: 2 },
    { id: 'legendaire', nom: 'Légendaire', bonus: 3 }
  ];

  /* ---------- Potion ---------- */
  var POTION_PALIERS = [
    { id: 'mineure', nom: 'Mineure', poids: 3, rangMin: 1, rangMax: 1 },
    { id: 'commune', nom: 'Commune', poids: 2, rangMin: 2, rangMax: 2 },
    { id: 'rare', nom: 'Rare', poids: 1, rangMin: 3, rangMax: 5 }
  ];
  var CHAMPS_POTION = [
    { id: 'palier', label: 'Rareté', gen: function () { return piockerPoids(POTION_PALIERS.map(function (p) { return [p, p.poids]; })); } },
    { id: 'sort', label: 'Effet', gen: function (ctx) {
        var pal = ctx.palier || POTION_PALIERS[0];
        return piocherSort(COF.OM_PROFILS_SORTS, pal.rangMin, pal.rangMax);
      } },
    { id: 'origine', label: 'Origine', gen: function () { return genererOrigine(); } }
  ];

  /* ---------- Parchemin ---------- */
  var PALIERS_PARCHEMIN = [{ id: 'mineur', nom: 'Mineur' }, { id: 'moyen', nom: 'Moyen' }];
  function rangParchemin(palier) { return COF.OM_RANG_PAR_PALIER[palier.id][alea(6)]; }
  var CHAMPS_PARCHEMIN = [
    { id: 'palier', label: 'Palier', gen: function () { return piocher(PALIERS_PARCHEMIN); } },
    { id: 'sort', label: 'Sort inscrit', gen: function (ctx) {
        var r = rangParchemin(ctx.palier || PALIERS_PARCHEMIN[0]);
        return piocherSort(COF.OM_PROFILS_SORTS, r, r);
      } },
    { id: 'origine', label: 'Origine', gen: function () { return genererOrigine(); } }
  ];

  /* ---------- Baguette ---------- */
  var CHAMPS_BAGUETTE = [
    { id: 'palier', label: 'Palier', gen: function () { return piocher(PALIERS_PARCHEMIN); } },
    { id: 'sort', label: 'Sort contenu', gen: function (ctx) {
        var r = rangParchemin(ctx.palier || PALIERS_PARCHEMIN[0]);
        return piocherSort(COF.OM_PROFILS_SORTS, r, r);
      } },
    { id: 'charges', label: 'Charges', gen: function () { return (1 + alea(20)) + (1 + alea(20)); } },
    { id: 'nom', label: 'Nom', gen: function () { return nomProcedural('Baguette', true); } },
    { id: 'origine', label: 'Origine', gen: function () { return genererOrigine(); } }
  ];

  /* ---------- Arme magique ---------- */
  function typeArme() { return piockerPoids(COF.OM_TYPE_ARME); }
  function tirerArme(type) {
    if (type === 'sceptre') return { nom: 'Sceptre de magie', dm: '1d6', armeType: 'contact', sceptre: true };
    var table = type === 'distance' ? COF.ARMES_DISTANCE : COF.ARMES_CONTACT.filter(function (a) { return a.id !== 'mainsnues'; });
    var a = piocher(table);
    return { nom: a.nom, dm: a.dm, armeType: type };
  }
  function tirerProprieteArme() {
    var p = piockerPoids(COF.OM_PROP_ARME.map(function (x) { return [x, x.poids]; }));
    var out = { niveau: p.niveau };
    if (p.fleau) {
      var cible = piocher(COF.OM_FLEAU_CREATURES);
      out.nom = 'fléau des ' + cible;
      out.texte = 'Inflige +1d4° DM supplémentaires contre les ' + cible + '.';
    } else {
      out.nom = p.nom;
      out.texte = p.elem ? ('Inflige +1d4° DM ' + p.nom + ' supplémentaires.') : p.texte;
      out.elem = p.elem;
    }
    return out;
  }
  var CHAMPS_ARME = [
    { id: 'palier', label: 'Palier', gen: function () { return piocher(PALIERS_ARME); } },
    { id: 'typeArme', label: "Type d'arme", gen: function () { return typeArme(); } },
    { id: 'base', label: 'Arme', gen: function (ctx) { return tirerArme(ctx.typeArme || 'contact'); } },
    { id: 'proprietes', label: 'Propriétés', gen: function (ctx) {
        var bonus = (ctx.palier || PALIERS_ARME[0]).bonus;
        var props = [];
        if (Math.random() * 6 < bonus) {
          props.push(tirerProprieteArme());
          if (Math.random() < 0.17) {
            var p2 = tirerProprieteArme();
            p2.double = true;
            p2.niveau *= 2;
            props.push(p2);
          }
        }
        return props;
      } },
    { id: 'nom', label: 'Nom', gen: function (ctx) { return nomProcedural((ctx.base || {}).nom || 'Arme', false); } },
    { id: 'origine', label: 'Origine', gen: function () { return genererOrigine(); } }
  ];

  /* ---------- Armure / bouclier magique ---------- */
  var CATALOGUE_ARMURE = COF.ARMURES ? COF.ARMURES.filter(function (a) { return a.id !== 'aucune'; }).map(function (a) {
    return { nom: a.nom, def: a.def, slot: 'armure' };
  }) : [];
  var CATALOGUE_BOUCLIER = COF.BOUCLIERS ? COF.BOUCLIERS.filter(function (b) { return b.id !== 'aucun'; }).map(function (b) {
    return { nom: b.nom, def: b.def, slot: 'bouclier' };
  }) : [];
  function tirerProprieteArmure() { return piocher(COF.OM_PROP_ARMURE); }
  var CHAMPS_ARMURE = [
    { id: 'palier', label: 'Palier', gen: function () { return piocher(PALIERS_ARME); } },
    { id: 'base', label: 'Type', gen: function () { return piocher(CATALOGUE_ARMURE.concat(CATALOGUE_BOUCLIER)); } },
    { id: 'proprietes', label: 'Propriétés', gen: function (ctx) {
        var bonus = (ctx.palier || PALIERS_ARME[0]).bonus;
        var props = [];
        if (Math.random() * 6 < bonus) {
          props.push(tirerProprieteArmure());
          if (Math.random() < 0.08) props.push(tirerProprieteArmure());
        }
        return props;
      } },
    { id: 'nom', label: 'Nom', gen: function (ctx) { return nomProcedural((ctx.base || {}).nom || 'Armure', true); } },
    { id: 'origine', label: 'Origine', gen: function () { return genererOrigine(); } }
  ];

  /* ---------- Objet de pouvoir ---------- */
  var RANG_POUVOIR_D8 = [1, 2, 2, 3, 3, 4, 4, 5];
  var CHAMPS_POUVOIR = [
    { id: 'rang', label: 'Rang du pouvoir', gen: function () { return RANG_POUVOIR_D8[alea(8)]; } },
    { id: 'capacite', label: 'Pouvoir', gen: function (ctx) {
        var profilId = piockerPoids(COF.OM_POUVOIR_PROFILS);
        return piocherCapacite(profilId, ctx.rang || 1);
      } },
    { id: 'nom', label: 'Nom', gen: function () { return nomProcedural('Objet', false); } },
    { id: 'origine', label: 'Origine', gen: function () { return genererOrigine(); } }
  ];

  /* ---------- Objet de puissance ---------- */
  var BONUS_PUISSANCE = [[1, 5], [2, 2], [3, 1]];
  function niveauPuissance(carac, bonus) {
    if (!carac.mineure) return bonus * 3;
    if (carac.id === 'PM') return Math.ceil(bonus / 3);
    if (carac.id === 'PV') return Math.ceil(bonus / 5);
    return bonus;
  }
  var CHAMPS_PUISSANCE = [
    { id: 'carac', label: 'Caractéristique', gen: function () { return piocher(COF.OM_CARACS_PUISSANCE); } },
    { id: 'bonus', label: 'Bonus', gen: function (ctx) {
        var carac = ctx.carac || COF.OM_CARACS_PUISSANCE[0];
        if (carac.mineure) return (carac.id === 'PM') ? 3 * (1 + alea(3)) : (carac.id === 'PV') ? 5 * (1 + alea(3)) : 1 + alea(3);
        return piockerPoids(BONUS_PUISSANCE);
      } },
    { id: 'nom', label: 'Nom', gen: function (ctx) {
        var forme = COF.OM_FORME_PUISSANCE[(ctx.carac || COF.OM_CARACS_PUISSANCE[0]).id] || 'Amulette';
        return nomProcedural(forme, false);
      } },
    { id: 'origine', label: 'Origine', gen: function () { return genererOrigine(); } }
  ];

  /* ---------- Objet de compétence ---------- */
  var CHAMPS_COMPETENCE = [
    { id: 'competence', label: 'Compétence', gen: function () { return piocher(COF.OM_COMPETENCES); } },
    { id: 'nom', label: 'Nom', gen: function () { return nomProcedural(piocher(COF.OM_FORME_COMPETENCE), false); } },
    { id: 'origine', label: 'Origine', gen: function () { return genererOrigine(); } }
  ];

  /* ---------- Origine (légende rapide, d10 x 3) ---------- */
  function genererOrigine() {
    return {
      provenance: piocher(COF.OM_ORIGINE_PROVENANCE),
      epoque: piocher(COF.OM_ORIGINE_EPOQUE),
      peuple: piocher(COF.OM_ORIGINE_PEUPLE)
    };
  }

  var GENS = {
    potion: COF.creerGenerateurChamps(CHAMPS_POTION),
    parchemin: COF.creerGenerateurChamps(CHAMPS_PARCHEMIN),
    baguette: COF.creerGenerateurChamps(CHAMPS_BAGUETTE),
    arme: COF.creerGenerateurChamps(CHAMPS_ARME),
    armure: COF.creerGenerateurChamps(CHAMPS_ARMURE),
    pouvoir: COF.creerGenerateurChamps(CHAMPS_POUVOIR),
    puissance: COF.creerGenerateurChamps(CHAMPS_PUISSANCE),
    competence: COF.creerGenerateurChamps(CHAMPS_COMPETENCE)
  };

  /* ---------- Valeur en po (règles de valeur des objets magiques) ----------
     Rang² × 50 pa = rang² × 5 po (1 po = 10 pa), conforme à l'exemple du
     livre de base (parchemin de rang 3 : 3×3×5 = 45 po). */
  function valeurPotionParchemin(rang) { return rang * rang * 5; }
  function valeurGenerique(niveauMagie) { return niveauMagie * niveauMagie * 200; }

  function niveauMagieArme(o) {
    var bonus = (o.palier || PALIERS_ARME[0]).bonus;
    return bonus + (o.proprietes || []).reduce(function (s, p) { return s + p.niveau; }, 0);
  }
  function niveauMagieArmure(o) {
    var bonus = (o.palier || PALIERS_ARME[0]).bonus;
    return bonus + (o.proprietes || []).reduce(function (s, p) { return s + p.niveau; }, 0);
  }

  return {
    GENS: GENS, PALIERS_ARME: PALIERS_ARME, PALIERS_PARCHEMIN: PALIERS_PARCHEMIN, POTION_PALIERS: POTION_PALIERS,
    valeurPotionParchemin: valeurPotionParchemin, valeurGenerique: valeurGenerique,
    niveauMagieArme: niveauMagieArme, niveauMagieArmure: niveauMagieArmure
  };
})();
