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
      return { type: 'cap', i: k.i, cible: cible, texte: cb.nom + ' (' + cb.ia + ') utilise ' + k.c.n + ' contre ' + infos(cible).nom + '.' };
    }
    if (!(cb.att || []).length) return { type: 'rien', texte: cb.nom + ' n’a pas d’attaque : il se met en garde.' };
    var best = 0;
    cb.att.forEach(function (a, i) { if ((a.mod || 0) > (cb.att[best].mod || 0)) best = i; });
    if (Math.random() < 0.25) best = Math.floor(Math.random() * cb.att.length);
    return { type: 'att', i: best, cible: cible, texte: cb.nom + ' (' + cb.ia + ') attaque ' + infos(cible).nom + ' avec ' + cb.att[best].n + '.' };
  }

  /* ============ Champ de bataille (distances) ============
     Grille de 10 × 6 cases de 3 m. Distance = nombre de cases dans la
     direction la plus longue × 3 m. Au contact : cases adjacentes.
     Une action de mouvement ≈ 10 m, soit 3 cases. Les héros partent à
     gauche, les adversaires à droite, à la distance de la rencontre.  */
  var GRILLE = { l: 10, h: 6, m: 3, pas: 3 };
  function cases(a, b) { return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y)); }
  function distance(a, b) { return (a && b && a.x !== undefined && b.x !== undefined) ? cases(a, b) * GRILLE.m : null; }
  function occupe(s, x, y, sauf) {
    return s.combattants.some(function (c) { return c !== sauf && c.x === x && c.y === y; });
  }
  function libreProche(s, x, y, sauf) {
    for (var r = 0; r < 6; r++) {
      for (var dy = -r; dy <= r; dy++) for (var dx = -r; dx <= r; dx++) {
        var nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= GRILLE.l || ny >= GRILLE.h) continue;
        if (!occupe(s, nx, ny, sauf)) return { x: nx, y: ny };
      }
    }
    return { x: x, y: y };
  }
  /* Place ceux qui n'ont pas encore de position ; distanceM : écart initial. */
  function placer(s, distanceM) {
    var ecart = Math.max(1, Math.min(GRILLE.l - 2, Math.round((distanceM || 12) / GRILLE.m)));
    var xh = 1, xm = Math.min(GRILLE.l - 1, xh + ecart);
    var nh = 0, nm = 0;
    s.combattants.forEach(function (c) {
      if (c.x !== undefined) return;
      var heros = camp(c) === 'heros', i = heros ? nh++ : nm++;
      var y = Math.floor(GRILLE.h / 2) + (i % 2 ? Math.ceil(i / 2) : -Math.ceil(i / 2));
      var p = libreProche(s, heros ? xh - (i > 4 ? 1 : 0) : xm + (i > 4 ? 1 : 0), Math.max(0, Math.min(GRILLE.h - 1, y)), c);
      c.x = p.x; c.y = p.y;
    });
  }
  /* Rapproche cb de sa cible (jusqu'à pas cases), jusqu'au contact ou à portée. */
  function approcher(s, cb, cible, porteeCases, pas) {
    var fait = 0;
    pas = pas || GRILLE.pas;
    /* À chaque pas : la case voisine libre qui rapproche le plus (distance
       en cases, puis distance réelle) ; on s'arrête si rien ne rapproche. */
    while (fait < pas && cases(cb, cible) > porteeCases) {
      var actuel = cases(cb, cible), eucl = Math.hypot(cb.x - cible.x, cb.y - cible.y), best = null;
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        var nx = cb.x + dx, ny = cb.y + dy;
        if (nx < 0 || ny < 0 || nx >= GRILLE.l || ny >= GRILLE.h || occupe(s, nx, ny, cb)) continue;
        var dc = Math.max(Math.abs(nx - cible.x), Math.abs(ny - cible.y)), de = Math.hypot(nx - cible.x, ny - cible.y);
        if (dc > actuel || (dc === actuel && de >= eucl)) continue;
        if (!best || dc < best.dc || (dc === best.dc && de < best.de)) best = { x: nx, y: ny, dc: dc, de: de };
      }
      if (!best) break;
      cb.x = best.x; cb.y = best.y; fait++;
    }
    return fait;
  }
  /* S'éloigne de la menace la plus proche (fuite). */
  function eloigner(s, cb, menace, pas) {
    for (var i = 0; i < (pas || GRILLE.pas); i++) {
      var nx = cb.x + Math.sign(cb.x - menace.x || (camp(cb) === 'heros' ? -1 : 1)), ny = cb.y;
      if (nx < 0 || nx >= GRILLE.l || occupe(s, nx, ny, cb)) break;
      cb.x = nx;
    }
  }
  /* Portée d'une attaque en cases (contact = 1). */
  function porteeCases(att) { return att && att.portee ? Math.max(1, Math.floor(att.portee / GRILLE.m)) : 1; }

  return {
    GRILLE: GRILLE, distance: distance, placer: placer, approcher: approcher, eloigner: eloigner, porteeCases: porteeCases, cases: cases,
    decider: decider, camp: camp,
    lire: lire, ecrire: ecrire, vider: etatVide,
    ajouterCreature: ajouterCreature, ajouterLots: ajouterLots, ajouterPersonnage: ajouterPersonnage,
    retirer: retirer, majPv: majPv, toggleEtat: toggleEtat, tourSuivant: tourSuivant
  };
})();
