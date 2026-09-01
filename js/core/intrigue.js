/* ============================================================
   COF2 Compagnon — Moteur du générateur d'intrigue
   Rebondissement (relance une scène qui stagne) et tour de faction
   (simule ce que font les PNJ/factions hors champ) — deux outils
   combinatoires (nature × cible × origine, faction × objectif ×
   action × impact) pensés pour jouer sans meneur.
   ============================================================ */
window.COF = window.COF || {};

COF.IntrigueCalc = (function () {
  var piocher = COF.piocher;

  var CHAMPS_REBONDISSEMENT = [
    { id: 'nature', label: 'Nature', gen: function () { return piocher(COF.INTRIGUE_REBOND_NATURE); } },
    { id: 'cible', label: 'Touche', gen: function () { return piocher(COF.INTRIGUE_REBOND_CIBLE); } },
    { id: 'origine', label: "Comment on l'apprend", gen: function () { return piocher(COF.INTRIGUE_REBOND_ORIGINE); } }
  ];

  var CHAMPS_FACTION = [
    { id: 'faction', label: 'Qui agit', gen: function () { return piocher(COF.INTRIGUE_FACTION_TYPES); } },
    { id: 'objectif', label: 'Objectif', gen: function () { return piocher(COF.INTRIGUE_FACTION_OBJECTIFS); } },
    { id: 'action', label: 'Ce tour-ci', gen: function () { return piocher(COF.INTRIGUE_FACTION_ACTIONS); } },
    { id: 'impact', label: 'Le personnage', gen: function () { return piocher(COF.INTRIGUE_FACTION_IMPACT); } }
  ];

  /* Paragraphes de synthèse prêts à lire tels quels. */
  function syntheseRebondissement(r) {
    return r.nature + ' : ça touche ' + r.cible + '. ' + r.origine;
  }
  function syntheseFaction(f) {
    return f.faction + ' cherche à ' + f.objectif + '. Ce tour-ci, elle ' + f.action +
      '. Le personnage ' + f.impact;
  }

  var GENS = {
    rebondissement: COF.creerGenerateurChamps(CHAMPS_REBONDISSEMENT),
    faction: COF.creerGenerateurChamps(CHAMPS_FACTION)
  };

  return {
    GENS: GENS,
    syntheseRebondissement: syntheseRebondissement,
    syntheseFaction: syntheseFaction
  };
})();
