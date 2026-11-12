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
  function KEY() { return COF.cle('cof2.arene'); }

  function uid() { return 'cb_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  function etatVide() { return { combattants: [], round: 1, tour: 0 }; }

  function lire() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY()));
      if (!s || !s.combattants) return etatVide();
      return s;
    } catch (e) { return etatVide(); }
  }
  function ecrire(s) {
    try { localStorage.setItem(KEY(), JSON.stringify(s)); } catch (e) {}
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

  /* ============ Créatures jouées par l'app (jeu en solo) ============
     Camps : les créatures « allie » (compagnons) sont du côté des PJ.
     Chaque créature reçoit un tempérament au premier tour :
       brute       → vise l'adversaire le plus solide (le plus de PV)
       opportuniste→ vise le plus affaibli (le moins de PV en %)
       chaotique   → vise au hasard
     Moral : la première fois qu'elle passe sous la moitié de ses PV,
     ou quand son chef tombe, elle teste son moral (d6) : 1 fuit,
     2 se rend (créature intelligente) ou fuit, sinon combat. Le chef
     ne craque que sur un 1. Les morts-vivants et créatures artificielles
     ne craquent jamais. infos(cb) → { pv, pvMax, def, vivant } (fourni
     par l'UI, qui sait relire les PJ).                                   */
  var TEMPERAMENTS = ['brute', 'opportuniste', 'opportuniste', 'chaotique'];
  var SANS_PEUR = /mort-vivant|squelette|zombie|golem|élémentaire|elementaire|construct|vase|gelée/i;
  function camp(cb) { return cb.type === 'pj' || cb.allie ? 'heros' : 'monstres'; }
  function decider(s, cb, infos) {
    var moi = infos(cb);
    if (moi.pv <= 0) return { type: 'ko', texte: cb.nom + ' est à terre.' };
    if (cb.moral === 'fuite' || cb.moral === 'reddition') return { type: cb.moral, texte: cb.nom + (cb.moral === 'fuite' ? ' a pris la fuite.' : ' s’est rendu.') };
    cb.ia = cb.ia || TEMPERAMENTS[Math.floor(Math.random() * TEMPERAMENTS.length)];
    /* Moral */
    var mien = camp(cb);
    var chefTombe = mien === 'monstres' && cb.role !== 'chef' && s.combattants.some(function (x) {
      return x.role === 'chef' && camp(x) === mien && infos(x).pv <= 0;
    });
    var blesse = moi.pv <= moi.pvMax / 2;
    if (mien === 'monstres' && !cb.moralTeste && (blesse || chefTombe) && !SANS_PEUR.test(cb.base || cb.nom)) {
      cb.moralTeste = true;
      var de = 1 + Math.floor(Math.random() * 6);
      var seuil = cb.role === 'chef' ? 1 : 2;
      if (de <= seuil) {
        var intelligent = !cb.car || !cb.car.INT || (cb.car.INT[0] || 0) >= -2;
        cb.moral = de === 2 && intelligent ? 'reddition' : 'fuite';
        return { type: cb.moral, texte: (chefTombe ? 'Son chef est tombé : ' : 'Gravement blessé, ') + cb.nom +
          (cb.moral === 'fuite' ? ' prend la fuite !' : ' jette les armes et se rend.') + ' (moral d6 : ' + de + ')' };
      }
    }
    /* Cible */
    var cibles = s.combattants.filter(function (x) { return camp(x) !== mien && infos(x).vivant && infos(x).pv > 0 && !x.moral; });
    if (!cibles.length) return { type: 'rien', texte: cb.nom + ' n’a plus d’adversaire en vue.' };
    var cible;
    if (cb.ia === 'brute') cible = cibles.slice().sort(function (a, b) { return infos(b).pv - infos(a).pv; })[0];
    else if (cb.ia === 'opportuniste') cible = cibles.slice().sort(function (a, b) {
      var ia = infos(a), ib = infos(b); return ia.pv / Math.max(1, ia.pvMax) - ib.pv / Math.max(1, ib.pvMax);
    })[0];
    else cible = cibles[Math.floor(Math.random() * cibles.length)];
    /* Attaque : la meilleure, parfois une capacité active à DM. */
    var caps = (cb.caps || []).map(function (c, i) { return { c: c, i: i }; }).filter(function (x) { return x.c.a && x.c.dmg; });
    if (caps.length && Math.random() < 0.3) {
      var k = caps[Math.floor(Math.random() * caps.length)];
      return { type: 'cap', i: k.i, cible: cible, texte: cb.nom + ' utilise ' + k.c.n + ' contre ' + infos(cible).nom + '.' };
    }
    if (!(cb.att || []).length) return { type: 'rien', texte: cb.nom + ' n’a pas d’attaque : il se met en garde.' };
    var best = 0;
    cb.att.forEach(function (a, i) { if ((a.mod || 0) > (cb.att[best].mod || 0)) best = i; });
    if (Math.random() < 0.25) best = Math.floor(Math.random() * cb.att.length);
    return { type: 'att', i: best, cible: cible, texte: cb.nom + ' attaque ' + infos(cible).nom + ' avec ' + cb.att[best].n + '.' };
  }

  /* ============ Distances narratives (pas de cases) ============
     Le groupe des héros (héros, compagnons, alliés) sert de repère.
     Chaque adversaire se trouve dans une « zone » par rapport à lui :
       0 Au contact · 1 Proche (≈ 10 m) · 2 À portée (≈ 25 m) · 3 Loin (50 m et plus)
     Une action de mouvement fait passer d'une zone à la voisine. Le
     corps à corps demande le contact ; un tir ou un sort porte si sa
     portée couvre la zone. Rien à placer : on raconte, l'app suit.     */
  var ZONES = [
    { id: 0, nom: 'Au contact', court: 'contact', ic: '⚔️', m: 2 },
    { id: 1, nom: 'Proche', court: 'proche', ic: '🏃', m: 10, note: '≈ 10 m' },
    { id: 2, nom: 'À portée', court: 'à portée', ic: '🏹', m: 25, note: '≈ 25 m' },
    { id: 3, nom: 'Loin', court: 'loin', ic: '🔭', m: 50, note: '50 m et plus' }
  ];
  function zoneDepuisM(m) { return m <= 3 ? 0 : (m <= 14 ? 1 : (m <= 35 ? 2 : 3)); }
  /* L'adversaire de la paire (celui qui porte la zone). */
  function porteur(a, b) { return a && camp(a) === 'monstres' ? a : (b && camp(b) === 'monstres' ? b : null); }
  /* Zone entre deux combattants (même camp : côte à côte, 0). */
  function zoneEntre(a, b) {
    if (!a || !b || camp(a) === camp(b)) return 0;
    var m = porteur(a, b); return m && typeof m.zone === 'number' ? m.zone : 1;
  }
  function distance(a, b) { return ZONES[zoneEntre(a, b)].m; }
  /* Place les nouveaux adversaires à la distance de la rencontre. */
  function placer(s, distanceM) {
    var z = zoneDepuisM(distanceM === undefined || distanceM === null ? 12 : distanceM);
    s.combattants.forEach(function (c) { if (camp(c) === 'monstres' && typeof c.zone !== 'number') c.zone = z; });
  }
  /* Rapproche deux combattants d'une zone (n zones) ; renvoie le nombre fait. */
  function approcher(s, cb, cible, n) {
    var m = porteur(cb, cible); if (!m) return 0;
    var fait = Math.min(n || 1, m.zone || 0);
    m.zone = (m.zone || 0) - fait;
    return fait;
  }
  /* Éloigne : la zone augmente (au-delà de « Loin », il est hors de vue). */
  function eloigner(s, cb, menace, n) {
    var m = porteur(cb, menace) || (camp(cb) === 'monstres' ? cb : null); if (!m) return 0;
    var avant = m.zone || 0;
    m.zone = Math.min(3, avant + (n || 1));
    if (avant >= 3 && m.moral === 'fuite') m.horsDeVue = true;
    return m.zone - avant;
  }
  /* Zone maximale qu'atteint une attaque (contact = 0). */
  function zonePortee(att) {
    if (!att || !att.portee) return 0;
    return att.portee >= 45 ? 3 : (att.portee >= 18 ? 2 : (att.portee >= 6 ? 1 : 0));
  }

  return {
    ZONES: ZONES, zoneDepuisM: zoneDepuisM, zoneEntre: zoneEntre, zonePortee: zonePortee,
    distance: distance, placer: placer, approcher: approcher, eloigner: eloigner,
    decider: decider, camp: camp,
    lire: lire, ecrire: ecrire, vider: etatVide,
    ajouterCreature: ajouterCreature, ajouterLots: ajouterLots, ajouterPersonnage: ajouterPersonnage,
    retirer: retirer, majPv: majPv, toggleEtat: toggleEtat, tourSuivant: tourSuivant
  };
})();
