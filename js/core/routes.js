/* ============================================================
   COF2 Compagnon — Des routes vivantes (mode aventure)
   - Une monture (achetée à l'écurie) raccourcit les voyages.
   - Sur la route : un relais où faire halte (nom, ambiance, nouvelles),
     une patrouille à questionner, des réfugiés à aider, un colporteur,
     un bac ou une barque pour couper au plus court.
   ============================================================ */
window.COF = window.COF || {};

COF.Routes = (function () {
  function p(l) { return l[Math.floor(Math.random() * l.length)]; }
  function d(n) { return 1 + Math.floor(Math.random() * n); }
  function T() { return COF.Conteur; }
  function K() { return COF.Carnet; }
  function envDe(c) { return COF.Monde.envIci(c) || 'plaine'; }

  var MONTURES = [[/cheval de guerre/i, 'son cheval de guerre'], [/cheval/i, 'son cheval'], [/poney/i, 'son poney'], [/mule|âne/i, 'sa mule']];
  /* La monture du héros (dans son inventaire), ou null. */
  function monture(c) {
    var h = T().heros(c); if (!h) return null;
    var o = (h.inventaire || []).filter(function (x) { return MONTURES.some(function (m) { return m[0].test(x.nom); }); })[0];
    if (!o) return null;
    var m = MONTURES.filter(function (x) { return x[0].test(o.nom); })[0];
    return { nom: o.nom, le: m[1] };
  }

  var RELAIS = ['Le Relais du Cheval Blanc', 'L’Auberge des Trois Bornes', 'La Halte du Pendu', 'Le Relais de la Vieille Route', 'L’Étape du Voyageur', 'La Lanterne Rouge', 'Le Gîte du Gué', 'L’Auberge du Chêne Creux'];
  var AMBIANCE = ['Une salle enfumée, des rouliers qui jouent aux dés, une soupe épaisse.', 'Un aubergiste borgne, un feu qui crépite, des voyageurs qui parlent bas.', 'Des chiens sous les tables, une servante pressée, du vin aigre mais chaud.'];
  function relais(s) { s.voyage.relais = s.voyage.relais || p(RELAIS); return s.voyage.relais; }

  var ACTIONS = {
    relais: { nom: function (ctx) { return 'Faire halte au relais « ' + (ctx.relais || 'de la route') + ' »'; }, auto: true, unique: true, effet: 'rtRelais', aide: '3 pa · repos et nouvelles',
      si: function (c, s) { return !!(s && s.voyage && s.jeu && s.jeu.prog >= 1); },
      ok: ['Au relais « {relais} », {h} pose son sac. {ambiance} On y apprend que {rumeurTaverne}', '« {relais} » : une halte bienvenue. {ambiance} Entre deux bouchées, une conversation attire l’oreille de {h} : {rumeurTaverne}'] },
    patrouille: { nom: 'Questionner une patrouille', carac: 'CHA', effet: 'calme', si: function (c) { return ['plaine', 'urbain', 'foret', 'colline'].indexOf(envDe(c)) >= 0; },
      ok: ['Les soldats de la patrouille, d’abord méfiants, finissent par indiquer à {h} les passages dangereux à éviter.', '« Évitez le bois au nord, on y a vu des ombres. » Le sergent tend même sa gourde à {h}.'],
      ko: ['La patrouille n’aime pas les questions : on fouille le sac de {h}, on le bouscule un peu.', '« Circulez. » Le sergent ne dira rien de plus.'] },
    refugies: { nom: 'Partager ses vivres avec des réfugiés', auto: true, unique: true, effet: 'rtRefugies', aide: 'une ration · le cœur plus léger',
      si: function (c) { return !!(c.ressources && c.ressources.rations > 0); },
      ok: ['Une famille fuit les routes de l’est avec une charrette à bras. {h} partage son pain ; en retour, ils racontent ce qu’ils fuient : {fuite}.', 'Des réfugiés, épuisés, au bord du chemin. Un repas partagé, des larmes de gratitude, et une mise en garde : {fuite}.'] },
    colporteurRoute: { nom: 'Arrêter un colporteur sur la route', auto: true, unique: true, effet: 'rtColporteur', aide: 'un petit achat au hasard',
      ok: ['Un colporteur courbé sous sa hotte propose sa marchandise ; {h} se laisse tenter.', '« Pour vous, l’ami, un prix spécial ! » Le colporteur vend à {h} {achat}.'] },
    bac: { nom: function (ctx) { return ctx.env === 'marais' ? 'Prendre la barque d’un pêcheur' : 'Prendre le bac pour traverser'; }, auto: true, unique: true, effet: 'rtBac', aide: '4 pa · la route avance',
      si: function (c) { return ['marais', 'plaine', 'foret'].indexOf(envDe(c)) >= 0; },
      ok: ['Le passeur fait glisser son bac sur l’eau sombre, en silence. Une demi-journée de gagnée.', 'Une barque à fond plat, un pêcheur taciturne, des roseaux à perte de vue : le raccourci est sûr.'] }
  };
  function effet(c, s, a, ctx) {
    var h = T().heros(c);
    c.ressources = c.ressources || { rations: 0, torches: 0 };
    switch (a.effet) {
      case 'rtRelais': {
        var pay = COF.Echoppes ? COF.Echoppes.payer(h, 3) : true; if (h) COF.Store.sauver(h);
        var gain = d(6) + T().niveau(c), av = h ? h.pv : 0; if (h) { h.pv = Math.min(COF.Calc.pvMax(h), (h.pv || 0) + gain); COF.Store.sauver(h); }
        var ru = COF.Aventure.rumeur(); K().ajouterListe(c, 'fils', { nom: ru.nom, note: 'Entendu au relais « ' + relais(s) + ' ».\n' + ru.texte });
        return (pay ? '−3 pa · ' : '') + '+' + ((h ? h.pv : 0) - av) + ' PV · 🧵 ' + ru.nom;
      }
      case 'rtRefugies': {
        c.ressources.rations = Math.max(0, c.ressources.rations - 1); c.tension = Math.max(1, c.tension - 1);
        return '🍞 une ration · tension −1';
      }
      case 'rtColporteur': {
        var l = (COF.MATERIEL || []).filter(function (x) { return x.prix && x.prix <= 5; }), o = p(l), pr = o.prix + 1;
        ctx.achat = o.nom.charAt(0).toLowerCase() + o.nom.slice(1);
        if (!h || !COF.Echoppes || !COF.Echoppes.payer(h, pr)) { ctx.achat = 'rien du tout, faute d’argent'; return 'pas assez d’argent'; }
        if (/^Torches/.test(o.nom)) { c.ressources.torches = (c.ressources.torches || 0) + 3; }
        else { var it = COF.Store.ajouterObjet(h, { nom: o.nom, qte: 1, note: o.note || null }); if (it) it.prixPa = o.prix; }
        COF.Store.sauver(h);
        return '−' + pr + ' pa · 🎒 ' + o.nom;
      }
      case 'rtBac': { if (h && COF.Echoppes) { COF.Echoppes.payer(h, 4); COF.Store.sauver(h); } s.jeu.prog++; return '−4 pa · la route avance'; }
    }
    return '';
  }
  /* Contexte en plus pour ces phrases. */
  function contexte(c, s, ctx) {
    if (s && s.voyage) { ctx.relais = relais(s); ctx.ambiance = p(AMBIANCE); }
    var b = COF.Bandes ? COF.Bandes.proche(c) : null;
    ctx.fuite = b ? b.nom + ' ravagent les fermes isolées' : p(['une guerre de seigneurs, plus loin', 'des loups qui descendent des montagnes', 'une fièvre qui vide les villages', 'des collecteurs d’impôts sans pitié']);
    return ctx;
  }
  function enregistrer() {
    var A = T().ACTIONS, G = T().GENRES.voyage;
    Object.keys(ACTIONS).forEach(function (id) { A[id] = ACTIONS[id]; if (G.actions.indexOf(id) < 0) G.actions.push(id); });
  }
  if (COF.Conteur) enregistrer();
  return { ACTIONS: ACTIONS, monture: monture, effet: effet, contexte: contexte, relais: relais, enregistrer: enregistrer };
})();
