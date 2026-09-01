/* ============================================================
   COF2 Compagnon — Moteur des générateurs « vie & temps »
   Rumeur (sujet × détail × fiabilité), passage du temps (durée ×
   météo × événement) et marchand (attitude × objet réel ×
   complication) — trois outils pour meubler le quotidien d'une
   partie solo sans avoir à tout improviser.
   ============================================================ */
window.COF = window.COF || {};

COF.SoloCalc = (function () {
  var piocher = COF.piocher, piockerPoids = COF.piockerPoids;

  /* ---------- Rumeur ---------- */
  var CHAMPS_RUMEUR = [
    { id: 'sujet', label: 'Sujet', gen: function () { return piocher(COF.SOLO_RUMEUR_SUJET); } },
    { id: 'detail', label: 'Ce qu\'on raconte', gen: function () { return piocher(COF.SOLO_RUMEUR_DETAIL); } },
    { id: 'fiabilite', label: 'Fiabilité', gen: function () { return piocher(COF.SOLO_RUMEUR_FIABILITE); } }
  ];
  function texteRumeur(r) {
    return r.sujet + ' ' + r.detail + ' — ' + r.fiabilite;
  }

  /* ---------- Passage du temps ---------- */
  var CHAMPS_TEMPS = [
    { id: 'duree', label: 'Durée écoulée', gen: function () { return piocher(COF.SOLO_TEMPS_DUREE); } },
    { id: 'meteo', label: 'Météo', gen: function () { return piocher(COF.SOLO_TEMPS_METEO); } },
    { id: 'evenement', label: 'Pendant ce temps', gen: function () { return piocher(COF.SOLO_TEMPS_EVENEMENT); } }
  ];
  function texteTemps(t) {
    return t.duree + ' : ' + t.meteo + '. ' + t.evenement;
  }

  /* ---------- Marchand ---------- */
  var CATALOGUE_MARCHAND = [].concat(
    COF.ARMES_CONTACT || [], COF.ARMES_DISTANCE || [], COF.ARMURES || [],
    COF.BOUCLIERS || [], COF.MATERIEL || [], COF.BUTIN_TRESORS || []
  ).filter(function (x) { return (x.prix || 0) > 0; });
  function tirerObjetMarchand() { return piocher(CATALOGUE_MARCHAND); }
  var CHAMPS_MARCHAND = [
    { id: 'attitude', label: 'Attitude du marchand', gen: function () {
        return piockerPoids(COF.SOLO_MARCHAND_ATTITUDES.map(function (a) { return [a, a.poids]; }));
      } },
    { id: 'objet', label: 'Objet en jeu', gen: function () { return tirerObjetMarchand(); } },
    { id: 'argument', label: 'Complication', gen: function () { return piocher(COF.SOLO_MARCHAND_ARGUMENTS); } }
  ];
  function prixMarchand(o) {
    var att = o.attitude || COF.SOLO_MARCHAND_ATTITUDES[2];
    var base = (o.objet || {}).prix || 0;
    return {
      achat: Math.max(1, Math.round(base * att.achat * 10) / 10),
      vente: Math.max(1, Math.round(base * att.vente * 10) / 10)
    };
  }

  var GENS = {
    rumeur: COF.creerGenerateurChamps(CHAMPS_RUMEUR),
    temps: COF.creerGenerateurChamps(CHAMPS_TEMPS),
    marchand: COF.creerGenerateurChamps(CHAMPS_MARCHAND)
  };

  return {
    GENS: GENS, texteRumeur: texteRumeur, texteTemps: texteTemps, prixMarchand: prixMarchand
  };
})();
