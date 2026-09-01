/* ============================================================
   COF2 Compagnon — Moteur du générateur d'objets & trésors nommés
   Compose un objet magique unique : type, palier, nom procédural,
   1 à 2 pouvoirs, une origine et, parfois, une malédiction.
   ============================================================ */
window.COF = window.COF || {};

COF.TresorCalc = (function () {
  var piocher = COF.piocher, piockerPoids = COF.piockerPoids;
  var TYPES_FEMININS = ['epee', 'hache', 'armure', 'amulette', 'cape', 'couronne', 'lance', 'masse', 'arbalete'];

  /* Contracte « de » avec l'article de l'épithète : de le → du, de les → des,
     de l' reste de l', de la reste de la. */
  function deEpithete(epithete) {
    if (/^le /i.test(epithete)) return 'du ' + epithete.slice(3);
    if (/^les /i.test(epithete)) return 'des ' + epithete.slice(4);
    return 'de ' + epithete;
  }

  function genererNom(type) {
    /* Pas d'accord au pluriel dans les tables d'adjectifs : les noms de type
       pluriel (Gants, Bottes...) évitent ce patron plutôt que de produire un
       accord fautif (« Gants Maudit » au lieu de « Gants Maudits »). */
    var styles = (type && type.pluriel) ? ['compose', 'compose', 'epithete'] : ['compose', 'compose', 'epithete', 'adjectif'];
    var style = piocher(styles);
    if (style === 'compose') return piocher(COF.TRESOR_NOM_PREFIXES) + piocher(COF.TRESOR_NOM_SUFFIXES);
    var nomType = type ? type.nom : 'Objet';
    if (style === 'epithete') return nomType + ' ' + deEpithete(piocher(COF.TRESOR_EPITHETES));
    var fem = type && TYPES_FEMININS.indexOf(type.id) >= 0;
    return nomType + ' ' + piocher(fem ? COF.TRESOR_ADJ_F : COF.TRESOR_ADJ_M);
  }

  var POOLS_PAR_TIER = {
    mineur: COF.TRESOR_POUVOIRS_MINEUR, majeur: COF.TRESOR_POUVOIRS_MAJEUR, legendaire: COF.TRESOR_POUVOIRS_LEGENDAIRE
  };

  /* Les pouvoirs mécaniques (+N attaque/dégâts, dégâts élémentaires) ne
     prennent sens que sur une arme : une couronne ou une amulette n'attaque
     pas, donc ils sont exclus du tirage pour les types non-armes. */
  function genererPouvoirs(tier, type) {
    var pool = (POOLS_PAR_TIER[tier.id] || COF.TRESOR_POUVOIRS_MINEUR)
      .filter(function (p) { return !p.effet || (type && type.arme); });
    var n = Math.min(tier.nbPouvoirs, pool.length);
    var copie = pool.slice();
    var out = [];
    for (var i = 0; i < n; i++) {
      var idx = COF.alea(copie.length);
      out.push(copie[idx]);
      copie.splice(idx, 1);
    }
    return out;
  }

  /* Agrège les effets mécaniques des pouvoirs choisis (armes uniquement) :
     bonus combiné aux jets d'attaque/dégâts, et dégâts élémentaires
     supplémentaires à ajouter à la formule lors d'une attaque. */
  function effetArme(pouvoirs) {
    var bonus = 0, elementaires = [];
    (pouvoirs || []).forEach(function (p) {
      if (!p.effet) return;
      if (p.effet.type === 'armeplus') bonus += p.effet.val;
      if (p.effet.type === 'elementaire') elementaires.push({ formule: p.effet.formule, label: p.effet.label });
    });
    if (!bonus && !elementaires.length) return null;
    return { bonus: bonus, elementaires: elementaires };
  }

  var CHAMPS = [
    { id: 'type', label: 'Type', gen: function () { return piocher(COF.TRESOR_TYPES); } },
    { id: 'tier', label: 'Palier', gen: function () {
        return piockerPoids(COF.TRESOR_TIERS.map(function (t) { return [t, t.poids]; }));
      } },
    { id: 'nom', label: 'Nom', gen: function (ctx) { return genererNom(ctx.type); } },
    { id: 'pouvoirs', label: 'Pouvoirs', gen: function (ctx) {
        return genererPouvoirs(ctx.tier || COF.TRESOR_TIERS[0], ctx.type);
      } },
    { id: 'origine', label: 'Origine', gen: function () { return piocher(COF.TRESOR_ORIGINES); } },
    { id: 'maudit', label: 'Malédiction', gen: function () {
        return Math.random() < 0.2 ? piocher(COF.TRESOR_MALEDICTIONS) : null;
      } },
    { id: 'prix', label: 'Coût estimé', gen: function (ctx) {
        var t = ctx.tier || COF.TRESOR_TIERS[0];
        return t.prixMin + COF.alea(t.prixMax - t.prixMin + 1);
      } }
  ];
  var GEN = COF.creerGenerateurChamps(CHAMPS);

  /* Description complète (pouvoirs, origine, malédiction), utilisée à la fois
     pour l'affichage détaillé et pour l'objet transféré dans l'inventaire. */
  function texteComplet(o) {
    var parts = [o.pouvoirs.map(function (p) { return p.texte; }).join(' ')];
    if (o.origine) parts.push(o.origine);
    if (o.maudit) parts.push('Malédiction : ' + o.maudit);
    return parts.join(' ');
  }

  return {
    CHAMPS: CHAMPS, genererTout: GEN.genererTout, genererChamp: GEN.genererChamp,
    texteComplet: texteComplet, effetArme: effetArme
  };
})();
