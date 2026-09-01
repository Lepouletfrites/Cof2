/* ============================================================
   COF2 Compagnon — Moteur du générateur d'objets & trésors nommés
   Compose un objet magique unique : type, palier, nom procédural,
   1 à 2 pouvoirs, une origine et, parfois, une malédiction.
   ============================================================ */
window.COF = window.COF || {};

COF.TresorCalc = (function () {
  var piocher = COF.piocher, piockerPoids = COF.piockerPoids;
  var TYPES_FEMININS = ['epee', 'hache', 'armure', 'amulette', 'cape', 'couronne', 'lance', 'masse'];

  /* Contracte « de » avec l'article de l'épithète : de le → du, de les → des,
     de l' reste de l', de la reste de la. */
  function deEpithete(epithete) {
    if (/^le /i.test(epithete)) return 'du ' + epithete.slice(3);
    if (/^les /i.test(epithete)) return 'des ' + epithete.slice(4);
    return 'de ' + epithete;
  }

  function genererNom(type) {
    var style = piocher(['compose', 'compose', 'epithete', 'adjectif']);
    if (style === 'compose') return piocher(COF.TRESOR_NOM_PREFIXES) + piocher(COF.TRESOR_NOM_SUFFIXES);
    var nomType = type ? type.nom : 'Objet';
    if (style === 'epithete') return nomType + ' ' + deEpithete(piocher(COF.TRESOR_EPITHETES));
    var fem = type && TYPES_FEMININS.indexOf(type.id) >= 0;
    return nomType + ' ' + piocher(fem ? COF.TRESOR_ADJ_F : COF.TRESOR_ADJ_M);
  }

  function genererPouvoirs(tier) {
    var pool = COF.TRESOR_POUVOIRS.slice();
    var n = tier.nbPouvoirs;
    var out = [];
    for (var i = 0; i < n && pool.length; i++) {
      var idx = COF.alea(pool.length);
      out.push(pool[idx]);
      pool.splice(idx, 1);
    }
    return out;
  }

  var CHAMPS = [
    { id: 'type', label: 'Type', gen: function () { return piocher(COF.TRESOR_TYPES); } },
    { id: 'tier', label: 'Palier', gen: function () {
        return piockerPoids(COF.TRESOR_TIERS.map(function (t) { return [t, t.poids]; }));
      } },
    { id: 'nom', label: 'Nom', gen: function (ctx) { return genererNom(ctx.type); } },
    { id: 'pouvoirs', label: 'Pouvoirs', gen: function (ctx) { return genererPouvoirs(ctx.tier || COF.TRESOR_TIERS[0]); } },
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
    var parts = [o.pouvoirs.join(' ')];
    if (o.origine) parts.push(o.origine);
    if (o.maudit) parts.push('Malédiction : ' + o.maudit);
    return parts.join(' ');
  }

  return {
    CHAMPS: CHAMPS, genererTout: GEN.genererTout, genererChamp: GEN.genererChamp,
    texteComplet: texteComplet
  };
})();
