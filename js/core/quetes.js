/* ============================================================
   COF2 Compagnon — Moteur du générateur d'accroches & quêtes
   Combine commanditaire × motivation × objectif × cible × lieu ×
   obstacle × complication × récompense en une accroche complète,
   prête à démarrer une session sans préparation.
   ============================================================ */
window.COF = window.COF || {};

COF.QueteCalc = (function () {
  var piocher = COF.piocher;

  var CHAMPS = [
    { id: 'commanditaire', label: 'Commanditaire', gen: function () { return piocher(COF.QUETES_COMMANDITAIRES); } },
    { id: 'motivation', label: 'Motivation réelle', gen: function () { return piocher(COF.QUETES_MOTIVATIONS); } },
    { id: 'objectif', label: 'Objectif', gen: function () { return piocher(COF.QUETES_OBJECTIFS); } },
    { id: 'cible', label: 'Concrètement', gen: function () { return piocher(COF.QUETES_CIBLES); } },
    { id: 'lieu', label: 'Lieu', gen: function () { return piocher(COF.ENVIRONNEMENTS); } },
    { id: 'obstacle', label: 'Obstacle principal', gen: function () { return piocher(COF.QUETES_OBSTACLES); } },
    { id: 'complication', label: 'Complication', gen: function () { return piocher(COF.QUETES_COMPLICATIONS); } },
    { id: 'recompense', label: 'Récompense proposée', gen: function () { return piocher(COF.QUETES_RECOMPENSES); } }
  ];
  var GEN = COF.creerGenerateurChamps(CHAMPS);

  /* Paragraphe de synthèse prêt à lire ou à adapter tel quel. */
  function accroche(q) {
    return q.commanditaire + ' a besoin d\'aide pour ' + q.objectif.charAt(0).toLowerCase() + q.objectif.slice(1) +
      ' : ' + q.cible + ', du côté de ' + q.lieu.nom.toLowerCase() + '. ' +
      'En réalité, la démarche est motivée ' + q.motivation + '. ' +
      q.obstacle + '. Rebondissement en cours de route : ' + q.complication.charAt(0).toLowerCase() + q.complication.slice(1) +
      '. En échange : ' + q.recompense.charAt(0).toLowerCase() + q.recompense.slice(1) + '.';
  }

  return { CHAMPS: CHAMPS, genererTout: GEN.genererTout, genererChamp: GEN.genererChamp, accroche: accroche };
})();
