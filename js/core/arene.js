/* ============================================================
   COF2 Compagnon — Arène : suivi de combat
   État persistant (localStorage) d'un combat en cours : combattants
   (PJ et créatures), initiative, états, tour et round.

   Les créatures sont des instantanés figés (PV propres à l'arène).
   Les PJ restent liés à leur personnage : PV/DEF/armes/sorts sont
   toujours recalculés depuis COF.Store, pour rester cohérents avec
   la fiche (dégâts encaissés en arène = dégâts sur la fiche).
   ============================================================ */
window.COF = window.COF || {};

COF.Arene = (function () {
  var KEY = 'cof2.arene';

  function uid() { return 'cb_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  function etatVide() { return { combattants: [], round: 1, tour: 0 }; }

  function lire() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY));
      if (!s || !s.combattants) return etatVide();
      return s;
    } catch (e) { return etatVide(); }
  }
  function ecrire(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }

  /* Nom unique parmi les combattants déjà présents : "Gobelin", "Gobelin 2"... */
  function nomUnique(s, base) {
    var n = s.combattants.filter(function (c) { return c.base === base; }).length;
    return n === 0 ? base : base + ' ' + (n + 1);
  }

  function ajouterCreature(s, c, role) {
    var combattant = {
      id: uid(), type: 'creature', base: c.nom, refId: c.id,
      pvMax: c.pv, pv: c.pv, def: c.def, init: c.init,
      att: c.att || [], caps: c.caps || [], car: c.car || {},
      nc: c.nc, etats: [], role: role || null
    };
    combattant.nom = nomUnique(s, c.nom);
    s.combattants.push(combattant);
    return combattant;
  }

  function ajouterLots(s, lots) {
    lots.forEach(function (l) {
      for (var i = 0; i < l.nb; i++) ajouterCreature(s, l.c, l.role);
    });
  }

  function ajouterPersonnage(s, p) {
    if (s.combattants.some(function (c) { return c.type === 'pj' && c.refId === p.id; })) return null;
    var combattant = { id: uid(), type: 'pj', base: p.nom, nom: p.nom, refId: p.id, etats: [], role: null };
    s.combattants.push(combattant);
    return combattant;
  }

  function retirer(s, id) {
    var i = s.combattants.findIndex(function (c) { return c.id === id; });
    if (i < 0) return;
    s.combattants.splice(i, 1);
    if (s.tour > i || s.tour >= s.combattants.length) s.tour = Math.max(0, s.tour - (s.tour > i ? 1 : 0));
  }

  /* PV d'une créature (instantané propre à l'arène) — les PJ passent
     directement par COF.Store, voir COF.UI.Arene.ajusterPv(). */
  function majPv(cb, delta) {
    cb.pv = Math.max(0, Math.min(cb.pvMax, cb.pv + delta));
  }

  function toggleEtat(cb, etatId) {
    var i = cb.etats.indexOf(etatId);
    if (i >= 0) cb.etats.splice(i, 1); else cb.etats.push(etatId);
  }

  function tourSuivant(s) {
    if (!s.combattants.length) return;
    s.tour++;
    if (s.tour >= s.combattants.length) { s.tour = 0; s.round++; }
  }

  return {
    lire: lire, ecrire: ecrire, vider: etatVide,
    ajouterCreature: ajouterCreature, ajouterLots: ajouterLots, ajouterPersonnage: ajouterPersonnage,
    retirer: retirer, majPv: majPv, toggleEtat: toggleEtat, tourSuivant: tourSuivant
  };
})();
