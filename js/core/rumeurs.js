/* ============================================================
   COF2 Compagnon — Rumeurs qui mentent (mode aventure)
   Toute rumeur n'est pas vraie. À sa naissance, chacune reçoit en
   secret une vérité : vraie, exagérée, fausse, piège… ou plus belle
   que prévu. La source donne un indice de fiabilité (souvent juste,
   pas toujours). Le héros peut la recouper pendant une scène, ou
   foncer : au bout, la vérité éclate.
   ============================================================ */
window.COF = window.COF || {};

COF.Rumeurs = (function () {
  function p(l) { return l[Math.floor(Math.random() * l.length)]; }
  function d(n) { return 1 + Math.floor(Math.random() * n); }
  function T() { return COF.Conteur; }
  function K() { return COF.Carnet; }

  var VERITES = [['vraie', 45], ['exageree', 20], ['fausse', 15], ['piege', 10], ['mieux', 10]];
  /* probabilité de chaque fiabilité affichée selon la vérité cachée : [fiable, incertaine, douteuse] */
  var INDICES = { vraie: [6, 3, 1], mieux: [5, 4, 1], exageree: [3, 4, 3], fausse: [1, 3, 6], piege: [1, 4, 5] };
  var SOURCES = {
    fiable: ['plusieurs témoins racontent la même chose', 'un garde, d’ordinaire peu bavard', 'un marchand honnête, connu de tous', 'une lettre scellée d’un notable'],
    incertaine: ['un voyageur de passage', 'une servante d’auberge', 'on ne sait plus trop qui l’a dit en premier', 'un colporteur bavard'],
    douteuse: ['un ivrogne au fond de la taverne', 'un inconnu trop insistant', 'un gamin qui réclamait une pièce', 'un mendiant aux yeux fuyants']
  };
  var IC = { fiable: '🟢', incertaine: '🟡', douteuse: '🔴' };
  function tirage(l) { var t = l.reduce(function (n, x) { return n + x[1]; }, 0), r = Math.random() * t; for (var i = 0; i < l.length; i++) { r -= l[i][1]; if (r <= 0) return l[i][0]; } return l[0][0]; }

  function estRumeur(f) { return f && !f.quete && !f.mission && /^Rumeur/i.test(f.nom || ''); }
  /* À la création d'un fil de rumeur : vérité cachée et source visible. */
  function marquer(c, f) {
    if (!estRumeur(f) || f.verite) return f;
    f.verite = tirage(VERITES);
    var ind = INDICES[f.verite], fi = tirage([['fiable', ind[0]], ['incertaine', ind[1]], ['douteuse', ind[2]]]);
    f.source = fi;
    f.fiabilite = IC[fi] + ' Source ' + (fi === 'fiable' ? 'sûre' : fi) + ' : ' + p(SOURCES[fi]) + '.';
    return f;
  }
  function filDe(c, s) { return s && s.filId ? (c.fils || []).filter(function (f) { return f.id === s.filId; })[0] : null; }
  /* L'action « recouper » n'a de sens que sur une rumeur non vérifiée. */
  function aVerifier(c, s) { var f = filDe(c, s); return !!(f && f.verite && !f.verifie); }
  var VERDICT = {
    vraie: ['Les témoignages concordent : la rumeur dit vrai.', 'Tout se recoupe. Cette histoire tient debout.'],
    mieux: ['Plus {h} creuse, plus l’affaire paraît grosse : la rumeur est en dessous de la vérité.', 'Ce qu’on raconte n’est que la pointe de l’iceberg.'],
    exageree: ['Il y a du vrai, mais l’histoire a beaucoup grossi en passant de bouche en bouche.', 'Les chiffres fondent à chaque témoin : la rumeur est très exagérée.'],
    fausse: ['Personne n’a rien vu de ses propres yeux : la rumeur ne repose sur rien.', 'Chaque piste mène à une autre rumeur. Du vent.'],
    piege: ['Trop beau pour être vrai : quelqu’un a lancé cette histoire exprès, pour attirer les curieux.', 'Les témoins ont tous reçu une pièce pour répéter la même phrase. Cela sent le guet-apens.']
  };
  var LIB = { vraie: '✅ rumeur vraie', mieux: '✨ rumeur sous-estimée', exageree: '🎈 rumeur exagérée', fausse: '❌ fausse rumeur', piege: '🪤 c’est un piège' };
  /* Effet de « recouper » réussi : la vérité est connue du héros. */
  function verifier(c, s, ctx) {
    var f = filDe(c, s); if (!f || !f.verite) return '';
    f.verifie = true;
    ctx.verdict = T().dire(VERDICT[f.verite], ctx);
    f.fiabilite = LIB[f.verite].split(' ')[0] + ' Vérifiée : ' + LIB[f.verite].replace(/^\S+ /, '') + '.';
    f.note = (f.note || '') + '\nJour ' + c.jour + ' : ' + ctx.verdict;
    /* inutile d'insister sur du vent : la scène s'arrête là */
    if (f.verite === 'fausse' && s.jeu) { s.jeu.prog = s.jeu.progMax; f.ouvert = false; return LIB.fausse + ' · fil abandonné'; }
    return LIB[f.verite];
  }
  /* Au bout de la piste (scène réussie) : la vérité éclate. Renvoie une note, ou null pour la suite normale. */
  function resoudre(c, f) {
    if (!f || !f.verite) return null;
    var n = T().niveau(c), nom = f.nom;
    switch (f.verite) {
      case 'fausse':
        f.ouvert = false;
        if (f.verifie) return '🧵 « ' + nom + ' » : le héros a bien fait de ne pas s’y attarder.';
        return '🧵 « ' + nom + ' » : du vent. Tout ce chemin pour rien… mais le héros sait désormais qui ment dans ce pays.';
      case 'exageree': {
        f.ouvert = false; var po = d(4) + n;
        return '🧵 « ' + nom + ' » était très exagérée : au bout de la piste, presque rien. ' + T().payer(c, po) + ' pour la peine.';
      }
      case 'piege': {
        f.ouvert = false; c.tension = Math.min(9, (c.tension || 5) + 1);
        var b = T().blesser(c, d(6) + n);
        var x = K().ajouterListe(c, 'pnj', { nom: p(['Le Renard', 'La Fouine', 'Le Rabatteur', 'La Langue-de-miel']) + ' (auteur du piège)', attitude: 'hostile', note: 'A lancé la rumeur « ' + nom + ' » pour attirer les curieux dans un guet-apens.' });
        var ici = COF.Monde.ici(c); x.lieuId = ici ? ici.id : null; x.jour = c.jour;
        if (COF.Echos) COF.Echos.noter(c, 'rancune', { pnjId: x.id });
        return '🪤 « ' + nom + ' » était un piège ! Des coupe-jarrets attendaient au bout de la piste. ' + b + ', tension +1. Celui qui a lancé la rumeur court toujours.';
      }
      case 'mieux': {
        var po2 = (d(6) + d(6)) * n;
        return { bonus: '✨ La rumeur était en dessous de la vérité : ' + T().payer(c, po2) + ' en prime.' };
      }
    }
    return null;
  }
  /* Nouvelle entre les scènes : un témoin confirme, dément ou met en garde. */
  function nouvelle(c) {
    var fl = (c.fils || []).filter(function (f) { return f.ouvert && f.verite && !f.verifie; }); if (!fl.length) return null;
    var f = p(fl);
    if (f.verite === 'fausse' && Math.random() < 0.6) { f.ouvert = false; return '🧵 « ' + f.nom + ' » n’était qu’une fausse rumeur : son auteur s’est vanté de l’avoir inventée. Le fil est abandonné.'; }
    if (f.verite === 'piege') { f.note = (f.note || '') + '\nJour ' + c.jour + ' : un témoin met en garde, cette histoire sent le guet-apens.'; f.fiabilite = '⚠️ Un témoin parle d’un guet-apens.'; return '⚠️ Un témoin met en garde le héros : « ' + f.nom + ' » ressemble fort à un piège.'; }
    if (f.verite === 'exageree') { f.note = (f.note || '') + '\nJour ' + c.jour + ' : d’autres racontent une version bien moins spectaculaire.'; return '🧵 Une autre version de « ' + f.nom + ' » circule, beaucoup moins spectaculaire.'; }
    f.note = (f.note || '') + '\nJour ' + c.jour + ' : de nouveaux témoignages confirment l’affaire.';
    return '🧵 Des témoins confirment « ' + f.nom + ' » : la piste se précise.';
  }
  return { marquer: marquer, estRumeur: estRumeur, aVerifier: aVerifier, verifier: verifier, resoudre: resoudre, nouvelle: nouvelle, VERITES: VERITES };
})();
