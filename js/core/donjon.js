/* ============================================================
   COF2 Compagnon — Moteur du générateur de salles de donjon
   Combine forme × état × occupant × piège × particularité ×
   sortie pour décrire une salle à la volée.
   ============================================================ */
window.COF = window.COF || {};

COF.DonjonCalc = (function () {
  var piocher = COF.piocher;

  var CHAMPS = [
    { id: 'forme', label: 'Architecture', gen: function () { return piocher(COF.DONJON_FORMES); } },
    { id: 'etat', label: 'État des lieux', gen: function () { return piocher(COF.DONJON_ETATS); } },
    { id: 'occupant', label: 'Occupant(s)', gen: function () { return piocher(COF.DONJON_OCCUPANTS); } },
    { id: 'piege', label: 'Piège', gen: function () { return piocher(COF.DONJON_PIEGES); } },
    { id: 'particularite', label: 'Particularité', gen: function () { return piocher(COF.DONJON_PARTICULARITES); } },
    { id: 'sortie', label: 'Sortie(s)', gen: function () { return piocher(COF.DONJON_SORTIES); } }
  ];
  var GEN = COF.creerGenerateurChamps(CHAMPS);

  return { CHAMPS: CHAMPS, genererTout: GEN.genererTout, genererChamp: GEN.genererChamp };
})();
