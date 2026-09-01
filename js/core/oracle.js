/* ============================================================
   COF2 Compagnon — Moteur Oracle & Muse (jeu en solo)
   Un oracle oui/non nuancé et probabilisé, un générateur d'événement
   aléatoire (focus × action × sujet), une étincelle d'inspiration
   libre (mot × mot), un test de scène et des détails sensoriels.
   Tout est combiné à partir de grandes tables pour qu'une même
   question ou le même jet ne retombent presque jamais sur le même
   résultat.
   ============================================================ */
window.COF = window.COF || {};

COF.Oracle = (function () {

  function alea(n) { return Math.floor(Math.random() * n); }
  function piocher(arr) { return arr[alea(arr.length)]; }
  function deuxDistincts(arr) {
    var a = piocher(arr), b;
    do { b = piocher(arr); } while (b === a && arr.length > 1);
    return [a, b];
  }

  function likelihood(id) {
    return COF.ORACLE_LIKELIHOOD.filter(function (x) { return x.id === id; })[0] ||
      COF.ORACLE_LIKELIHOOD[4];
  }

  var NUANCE_TEXTES = {
    oui_et:   'Oui, et plus encore',
    oui:      'Oui',
    oui_mais: 'Oui, mais…',
    non_mais: 'Non, mais…',
    non:      'Non',
    non_et:   'Non, et pire encore'
  };

  /* Événement aléatoire : focus narratif + verbe + sujet, ~21×65×60
     combinaisons possibles pour une redondance quasi nulle en usage. */
  function evenement() {
    return {
      focus: piocher(COF.ORACLE_FOCUS),
      action: piocher(COF.ORACLE_ACTIONS),
      sujet: piocher(COF.ORACLE_SUJETS)
    };
  }
  function texteEvenement(e) {
    return e.focus + ' : il ' + e.action + ' ' + e.sujet + '.';
  }

  /* Étincelle d'inspiration libre : deux mots évocateurs distincts à
     interpréter comme on l'entend. */
  function inspiration() {
    var m = deuxDistincts(COF.MUSE_MOTS);
    return { mot1: m[0], mot2: m[1] };
  }

  /* Oracle oui/non : jet de d100 comparé au seuil de vraisemblance
     choisi, avec six nuances de réponse. Sur un double (11, 22, 33…),
     un événement aléatoire vient en plus perturber la scène. */
  function repondre(likelihoodId) {
    var L = likelihood(likelihoodId);
    var t = L.seuil;
    var r = 1 + alea(100);

    var extremeOui = Math.max(1, Math.round(t * 0.15));
    var extremeNon = Math.max(1, Math.round((100 - t) * 0.15));
    var maisOui = Math.min(10, Math.max(0, t - extremeOui));
    var maisNon = Math.min(10, Math.max(0, (100 - t) - extremeNon));

    var nuance;
    if (r <= extremeOui) nuance = 'oui_et';
    else if (r <= t - maisOui) nuance = 'oui';
    else if (r <= t) nuance = 'oui_mais';
    else if (r <= t + maisNon) nuance = 'non_mais';
    else if (r <= 100 - extremeNon) nuance = 'non';
    else nuance = 'non_et';

    var evt = (r % 11 === 0) ? evenement() : null;

    return {
      roll: r, seuil: t, likelihood: L,
      nuance: nuance, texte: NUANCE_TEXTES[nuance],
      evenement: evt
    };
  }

  /* Test de scène : la scène prévue se déroule-t-elle comme imaginé ? */
  function testScene() {
    var r = 1 + alea(10);
    if (r <= 1) return { resultat: 'interrompue', label: 'Interrompue', evenement: evenement() };
    if (r <= 3) return { resultat: 'modifiee', label: 'Modifiée', evenement: evenement() };
    return { resultat: 'normale', label: 'Comme prévu', evenement: null };
  }

  /* Détail sensoriel, sur un sens choisi ou tiré au hasard. */
  function detailSensoriel(sens) {
    var sensId = (sens && COF.ORACLE_SENS[sens]) ? sens : piocher(Object.keys(COF.ORACLE_SENS));
    return { sens: sensId, detail: piocher(COF.ORACLE_SENS[sensId]) };
  }

  return {
    likelihoods: COF.ORACLE_LIKELIHOOD,
    repondre: repondre,
    evenement: evenement, texteEvenement: texteEvenement,
    inspiration: inspiration,
    testScene: testScene,
    detailSensoriel: detailSensoriel
  };
})();
