/* ============================================================
   COF2 Compagnon — Moteur des événements de voyage & exploration
   Combine lieu × météo × catégorie × détail pour ponctuer un
   trajet sans forcément déclencher un combat.
   ============================================================ */
window.COF = window.COF || {};

COF.VoyageCalc = (function () {
  var piocher = COF.piocher;

  var TABLES = {
    pnj: COF.VOYAGE_PNJ, incident: COF.VOYAGE_INCIDENTS, interet: COF.VOYAGE_INTERETS,
    decouverte: COF.VOYAGE_DECOUVERTES, presage: COF.VOYAGE_PRESAGES, calme: COF.VOYAGE_CALME
  };

  var CHAMPS = [
    { id: 'lieu', label: 'Environnement', gen: function () { return piocher(COF.ENVIRONNEMENTS); } },
    { id: 'meteo', label: 'Météo', gen: function () { return piocher(COF.VOYAGE_METEO); } },
    { id: 'categorie', label: 'Catégorie', gen: function () { return piocher(COF.VOYAGE_CATEGORIES); } },
    { id: 'detail', label: 'Détail', gen: function (ctx) {
        var table = TABLES[ctx.categorie] || COF.VOYAGE_INTERETS;
        return piocher(table);
      } }
  ];
  var GEN = COF.creerGenerateurChamps(CHAMPS);

  return { CHAMPS: CHAMPS, genererTout: GEN.genererTout, genererChamp: GEN.genererChamp };
})();
