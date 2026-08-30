/* ============================================================
   COF2 Compagnon — Moteur des compagnons (loups, familiers,
   golems, montures...)
   ============================================================ */
window.COF = window.COF || {};

COF.CompagnonCalc = (function () {

  /* Rang actuel de la voie qui donne accès à ce compagnon (0 si absente).
     Reconnaît la voie qu'elle vienne du profil principal ou d'un profil
     hybride ('hyb.<profil>.<voie>'), ou d'une voie de prestige.         */
  function rangLien(perso, template) {
    var lien = template.lien, best = 0;
    (perso.voies || []).forEach(function (v) {
      var parts = v.key.split('.');
      if (lien.prestige) {
        if (parts[0] === 'prestige' && parts[1] === lien.prestige) best = Math.max(best, v.rang);
      } else if (lien.profil && lien.voieId) {
        if (parts[0] === 'profil' && perso.profil === lien.profil && parts[1] === lien.voieId) best = Math.max(best, v.rang);
        if (parts[0] === 'hyb' && parts[1] === lien.profil && parts[2] === lien.voieId) best = Math.max(best, v.rang);
      }
    });
    return best;
  }

  /* Le personnage a-t-il accès à ce compagnon en l'état actuel de ses voies ? */
  function eligible(perso, template) {
    var r = rangLien(perso, template);
    if (r < template.lien.rangMin) return false;
    if (template.lien.rangMax && r > template.lien.rangMax) return false;
    return true;
  }

  /* Liste des modèles que le personnage peut obtenir maintenant */
  function disponibles(perso) {
    return Object.keys(COF.COMPAGNONS)
      .map(function (k) { return COF.COMPAGNONS[k]; })
      .filter(function (t) { return eligible(perso, t); });
  }

  /* Stats calculées d'un compagnon pour ce personnage */
  function stats(template, perso) {
    var K = COF.Calc;
    var rang = rangLien(perso, template) || template.lien.rangMin;
    var attMod = null, attLabel = null;
    if (template.attaque) {
      if (template.attaque.mode === 'magique') { attMod = K.attaques(perso).magique; attLabel = 'Attaque magique'; }
      else { attMod = template.attaque.valeur; attLabel = 'Attaque fixe'; }
    }
    var initVal = template.init.mode === 'perso' ? K.init(perso) : template.init.valeur;
    return {
      def: template.def(rang),
      pvMax: template.pv(perso.niveau || 1),
      init: initVal,
      attaqueMod: attMod,
      attaqueLabel: attLabel,
      dmg: template.dmg,
      rang: rang
    };
  }

  return { rangLien: rangLien, eligible: eligible, disponibles: disponibles, stats: stats };
})();
