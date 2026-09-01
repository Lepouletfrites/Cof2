/* ============================================================
   COF2 Compagnon — Moteur de l'objet prestigieux
   Compose un objet unique doté de sa propre voie à 5 rangs, liée
   à un profil réel : le rang 1 donne un bonus mineur (+1 aux jets
   d'attaque et de dégâts, ou +1 en DEF), les rangs 2 à 5 RENFORCENT
   chacun une vraie capacité que ce profil possède déjà dans ses
   propres voies (dégâts, portée, coût, usages...) — l'objet n'ouvre
   pas l'accès à une capacité nouvelle, il améliore une capacité que
   le personnage a ou pourra avoir. C'est exactement le procédé
   illustré par « La Lame des Échos » dans le livre de base : elle
   double la portée d'Attaque sonore et sert de point de focalisation
   à Zone de silence, deux capacités que le barde possède déjà.
   ============================================================ */
window.COF = window.COF || {};

COF.ObjetPrestigieuxCalc = (function () {
  var piocher = COF.piocher, alea = COF.alea;

  /* Pioche une capacité quelconque (n'importe quel rang, n'importe quelle
     voie) parmi celles du profil, pour la renforcer plutôt que la débloquer. */
  function piocherCapaciteProfil(profilId) {
    var pr = COF.PROFILS[profilId];
    if (!pr) return null;
    var pool = [];
    pr.voies.forEach(function (v) {
      v.caps.forEach(function (c) { pool.push({ voie: v, cap: c }); });
    });
    if (!pool.length) return null;
    var pick = piocher(pool);
    return { voie: pick.voie.id, voieNom: pick.voie.nom, cap: pick.cap };
  }

  function genererBoost(rang) {
    var b = piocher(COF.OP_BOOSTS);
    return { id: b.id, texte: b.texte.replace('{d}', Math.ceil(rang / 2)).replace('{r}', rang) };
  }

  function genererForme(profilId) {
    var pr = COF.PROFILS[profilId];
    var pool = COF.OP_FORMES_FAMILLE[pr.famille] || ['Amulette'];
    var choix = piocher(pool);
    if (choix === 'ARME') {
      var contact = Math.random() < 0.65;
      var table = contact ? COF.ARMES_CONTACT.filter(function (a) { return a.id !== 'mainsnues'; }) : COF.ARMES_DISTANCE;
      var a = piocher(table);
      return { nom: a.nom, arme: true, dm: a.dm, armeType: contact ? 'contact' : 'distance' };
    }
    return { nom: choix, arme: false };
  }

  function genererRangs(profilId) {
    var rangs = [];
    for (var r = 1; r <= 5; r++) {
      if (r === 1) {
        rangs.push({ rang: 1, niveauMagie: 1, capacite: null, boost: null, prerequis: null,
          texte: "L'objet confère un bonus mineur : +1 aux jets d'attaque et de dégâts s'il s'agit d'une arme, ou +1 en DEF sinon." });
      } else {
        var c = piocherCapaciteProfil(profilId);
        var boost = genererBoost(r);
        rangs.push({
          rang: r, niveauMagie: r, capacite: c, boost: boost, prerequis: piocher(COF.OP_PREREQUIS),
          texte: c ? ('Renforce ' + c.cap.n + ' (' + c.voieNom + ', rang ' + c.cap.r + ') : ' + boost.texte)
                   : "Aucune capacité trouvée pour ce profil — relancez cette ligne."
        });
      }
    }
    return rangs;
  }

  /* Par défaut, lié au profil du personnage actif (les capacités renforcées
     lui seront réellement utiles) ; sinon un profil au hasard. */
  function profilParDefaut() {
    var actif = COF.Store.actif();
    return (actif && COF.PROFILS[actif.profil]) ? actif.profil : piocher(Object.keys(COF.PROFILS));
  }

  var CHAMPS = [
    { id: 'profil', label: 'Profil lié', gen: profilParDefaut },
    { id: 'forme', label: 'Forme', gen: function (ctx) { return genererForme(ctx.profil || 'guerrier'); } },
    { id: 'nom', label: 'Nom', gen: function (ctx) { return COF.ObjetsMagiquesCalc.nomMagique((ctx.forme || {}).nom || 'Objet', false); } },
    { id: 'rangs', label: 'Rangs', gen: function (ctx) { return genererRangs(ctx.profil || 'guerrier'); } }
  ];
  var GEN = COF.creerGenerateurChamps(CHAMPS);

  return { CHAMPS: CHAMPS, genererTout: GEN.genererTout, genererChamp: GEN.genererChamp };
})();
