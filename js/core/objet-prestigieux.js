/* ============================================================
   COF2 Compagnon — Moteur de l'objet prestigieux
   Compose un objet unique doté de sa propre voie à 5 rangs, liée
   à un profil réel : le rang 1 donne un bonus mineur (+1 aux jets
   d'attaque et de dégâts, ou +1 en DEF), les rangs 2 à 5 lient une
   vraie capacité de ce profil (piochée dans la base de voies) à
   l'objet, chacune avec sa condition de déblocage — exactement le
   procédé illustré par « La Lame des Échos » dans le livre de base.
   ============================================================ */
window.COF = window.COF || {};

COF.ObjetPrestigieuxCalc = (function () {
  var piocher = COF.piocher, alea = COF.alea;

  function piocherCapacite(profilId, rang) {
    var pr = COF.PROFILS[profilId];
    if (!pr) return null;
    var pool = [];
    pr.voies.forEach(function (v) {
      v.caps.forEach(function (c) { if (c.r === rang) pool.push({ voie: v, cap: c }); });
    });
    if (!pool.length) return null;
    var pick = piocher(pool);
    return { voie: pick.voie.id, voieNom: pick.voie.nom, cap: pick.cap };
  }

  function nomProcedural(nomType) {
    var style = piocher(['compose', 'epithete', 'adjectif']);
    if (style === 'compose') return piocher(COF.TRESOR_NOM_PREFIXES) + piocher(COF.TRESOR_NOM_SUFFIXES);
    if (style === 'epithete') {
      var ep = piocher(COF.TRESOR_EPITHETES);
      var lien = /^le /i.test(ep) ? 'du ' + ep.slice(3) : (/^les /i.test(ep) ? 'des ' + ep.slice(4) : 'de ' + ep);
      return nomType + ' ' + lien;
    }
    return nomType + ' ' + piocher(COF.TRESOR_ADJ_M);
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
        rangs.push({ rang: 1, niveauMagie: 1, capacite: null, prerequis: null,
          texte: "L'objet confère un bonus mineur : +1 aux jets d'attaque et de dégâts s'il s'agit d'une arme, ou +1 en DEF sinon." });
      } else {
        var c = piocherCapacite(profilId, r);
        rangs.push({
          rang: r, niveauMagie: r, capacite: c, prerequis: piocher(COF.OP_PREREQUIS),
          texte: c ? ("L'objet permet désormais d'utiliser " + c.cap.n + ' (' + c.voieNom + ', rang ' + r + ') : ' + c.cap.d)
                   : "Aucune capacité correspondante trouvée pour ce rang — relancez cette ligne."
        });
      }
    }
    return rangs;
  }

  var CHAMPS = [
    { id: 'profil', label: 'Profil lié', gen: function () { return piocher(Object.keys(COF.PROFILS)); } },
    { id: 'forme', label: 'Forme', gen: function (ctx) { return genererForme(ctx.profil || 'guerrier'); } },
    { id: 'nom', label: 'Nom', gen: function (ctx) { return nomProcedural((ctx.forme || {}).nom || 'Objet'); } },
    { id: 'rangs', label: 'Rangs', gen: function (ctx) { return genererRangs(ctx.profil || 'guerrier'); } }
  ];
  var GEN = COF.creerGenerateurChamps(CHAMPS);

  return { CHAMPS: CHAMPS, genererTout: GEN.genererTout, genererChamp: GEN.genererChamp };
})();
