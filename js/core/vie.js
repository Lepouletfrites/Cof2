/* ============================================================
   COF2 Compagnon — Les PNJ vivent sans le héros (mode aventure)
   Entre deux visites, les gens avancent : mariage, naissance,
   promotion, ruine, fortune, départ, rivalité, maladie… et parfois
   la mort. Le héros le découvre en revenant au village, ou par une
   lettre d'un allié. Chaque événement est noté dans la fiche du PNJ.
   ============================================================ */
window.COF = window.COF || {};

COF.Vie = (function () {
  function p(l) { return l[Math.floor(Math.random() * l.length)]; }
  function d(n) { return 1 + Math.floor(Math.random() * n); }
  function T() { return COF.Conteur; }
  function K() { return COF.Carnet; }
  function M() { return COF.Monde; }
  var ABSENCE = 4;   /* jours sans visite avant que la vie ne change */

  function fem(x) { return x.genre === 'féminin'; }
  function cx(x, plus) { return Object.assign({ x: x.nom, e: fem(x) ? 'e' : '', il: fem(x) ? 'elle' : 'il', le: fem(x) ? 'la' : 'le', son: 'son' }, plus || {}); }
  function remplir(t, v) { return T().polir(String(t).replace(/\{(\w+)\}/g, function (m, k) { return v[k] !== undefined ? v[k] : m; })); }
  function vivants(c, lieuId) { return (c.pnj || []).filter(function (x) { return !x.mort && !(x.compagnon && x.compagnon.actif) && (!lieuId || x.lieuId === lieuId); }); }
  function noter(c, x, t) { x.vie = (x.vie || []).concat([{ jour: c.jour, txt: t }]).slice(-8); x.note = (x.note || '') + '\nJour ' + c.jour + ' : ' + t; }

  var ROLES = ['capitaine de la garde', 'maître de sa guilde', 'conseiller du notable', 'intendant du domaine', 'prêtre du temple', 'patron de l’auberge', 'chef de la milice'];

  var EVTS = [
    { id: 'mariage', poids: 3, si: function (c, x) { return !x.marie && x.attitude !== 'hostile'; },
      f: function (c, x) {
        var pe = x.peuple || 'humain', conj = COF.Culture ? COF.Culture.nomPersonne(pe, fem(x) ? 'masculin' : 'féminin') : 'quelqu’un du pays';
        x.marie = conj;
        return remplir(p(['{x} s’est marié{e} avec {conj} ; on parle encore de la noce.', 'Grande nouvelle : {x} a épousé {conj}. Tout le village était invité.']), cx(x, { conj: conj }));
      } },
    { id: 'naissance', poids: 2, si: function (c, x) { return x.marie && !x.enfant; },
      f: function (c, x) { x.enfant = true; return remplir(p(['{x} et {conj} ont eu un enfant. {x} rayonne.', 'Un berceau trône chez {x} : un enfant est né.']), cx(x, { conj: x.marie })); } },
    { id: 'promotion', poids: 2, si: function (c, x) { return !x.titre; },
      f: function (c, x) {
        x.titre = p(ROLES);
        return remplir(p(['{x} est désormais {r}. On lui doit un certain respect.', 'Promotion : {x} est devenu{e} {r}.']), cx(x, { r: x.titre })) + (x.attitude === 'allié' ? ' Un allié bien placé.' : x.attitude === 'hostile' ? ' Un ennemi plus dangereux.' : '');
      } },
    { id: 'ruine', poids: 2, si: function (c, x) { return !x.ruine; },
      f: function (c, x) {
        x.ruine = true;
        var t = remplir(p(['Un incendie a tout pris à {x}. {il} vit désormais chez des voisins.', '{x} a été ruiné{e} par une mauvaise affaire, et ses créanciers rôdent.']), cx(x));
        if ((x.rel || 0) >= 0 && x.attitude !== 'hostile') { K().ajouterListe(c, 'fils', { nom: 'Aider ' + x.nom + ' à se relever', note: t }); t += ' (Nouveau fil.)'; }
        return t;
      } },
    { id: 'fortune', poids: 2, si: function (c, x) { return !x.riche; },
      f: function (c, x) {
        x.riche = true;
        var t = remplir(p(['{x} a fait fortune : un héritage inattendu.', 'Les affaires de {x} prospèrent : {il} s’est fait construire une belle maison.']), cx(x));
        if ((x.rel || 0) >= 1 || x.attitude === 'allié') { var po = d(6) * T().niveau(c) + d(6); T().payer(c, po); t += ' Reconnaissant{e}, {x} offre ' + po + ' po au héros.'; t = remplir(t, cx(x)); }
        return t;
      } },
    { id: 'depart', poids: 2, si: function (c, x) { return (c.lieux || []).some(function (l) { return l.ville && l.id !== x.lieuId; }); },
      f: function (c, x) {
        var l = p((c.lieux || []).filter(function (l) { return l.ville && l.id !== x.lieuId; }));
        x.lieuId = l.id;
        return remplir(p(['{x} a quitté le pays pour s’installer {a}.', 'On dit que {x} est parti{e} {a}, sans dire au revoir.']), cx(x, { a: T().formes(l.nom).a }));
      } },
    { id: 'rivalite', poids: 2, si: function (c, x, gens) { return !x.rivalId && gens.length > 1; },
      f: function (c, x, gens) {
        var y = p(gens.filter(function (z) { return z.id !== x.id; })); if (!y) return '';
        x.rivalId = y.id; y.rivalId = x.id;
        var t = remplir(p(['{x} et {y} ne se parlent plus : une histoire de {quoi}. Chacun espère que le héros prendra son parti.', 'Entre {x} et {y}, c’est la guerre ouverte, à cause d’{quoi}.']),
          cx(x, { y: y.nom, quoi: p(['champ mal borné', 'dette jamais remboursée', 'mariage refusé', 'insulte en pleine taverne', 'héritage disputé']) }));
        return t;
      } },
    { id: 'malade', poids: 2, si: function (c, x) { return !x.malade && x.attitude !== 'hostile'; },
      f: function (c, x) {
        x.malade = true;
        var t = remplir(p(['{x} est tombé{e} gravement malade. Les remèdes du village n’y font rien.', 'Une fièvre cloue {x} au lit depuis des jours.']), cx(x));
        if (Math.random() < 0.6) { K().ajouterListe(c, 'fils', { nom: 'Trouver un remède pour ' + x.nom, note: t }); t += ' (Nouveau fil.)'; }
        return t;
      } },
    { id: 'complot', poids: 3, si: function (c, x) { return x.attitude === 'hostile'; },
      f: function (c, x) { c.tension = Math.min(9, (c.tension || 5) + 1); return remplir(p(['{x} a recruté des hommes de main pendant l’absence du héros.', '{x} a passé ces jours à monter les gens contre le héros.']), cx(x)) + ' (Tension +1.)'; } },
    { id: 'mort', poids: 1, si: function (c, x) { return !x.nemesis || Math.random() < 0.3; },
      f: function (c, x) {
        x.mort = { jour: c.jour }; x.lieuId = null;
        if (x.attitude === 'hostile') return remplir(p(['{x} est mort{e} : quelqu’un d’autre a réglé ses comptes.', 'On a retrouvé {x} sans vie au fond d’un fossé. Personne ne le pleure.']), cx(x)) + (x.nemesis ? ' Le héros ne pourra jamais lui faire face.' : '');
        var t = remplir(p(['{x} est mort{e}. Une tombe fraîche, quelques fleurs.', 'Triste nouvelle : {x} n’est plus. La fièvre, dit-on… mais certains en doutent.']), cx(x));
        if (Math.random() < 0.5) { K().ajouterListe(c, 'fils', { nom: 'Que s’est-il vraiment passé pour ' + x.nom + ' ?', note: t }); t += ' (Nouveau fil.)'; }
        return t;
      } }
  ];
  function tirer(c, x, gens) {
    var ok = EVTS.filter(function (e) { return e.si(c, x, gens); }); if (!ok.length) return null;
    var tot = ok.reduce(function (n, e) { return n + e.poids; }, 0), r = Math.random() * tot;
    for (var i = 0; i < ok.length; i++) { r -= ok[i].poids; if (r <= 0) return ok[i]; }
    return ok[ok.length - 1];
  }
  function vivre(c, x, gens) {
    var e = tirer(c, x, gens); if (!e) return '';
    var t = e.f(c, x, gens); if (!t) return '';
    noter(c, x, t);
    return t;
  }
  /* Arrivée dans un lieu : ce qui a changé pour les gens d'ici depuis la dernière visite. */
  function arrivee(c, lieuId, force) {
    var gens = vivants(c, lieuId), out = [];
    gens.forEach(function (x) {
      var vu = x.vuJour || x.jour || c.jour;
      if (out.length < 2 && (force || (c.jour - vu >= ABSENCE && Math.random() < 0.45))) { var t = vivre(c, x, gens); if (t) out.push('🏘️ ' + t); }
      x.vuJour = c.jour;
    });
    return out;
  }
  /* Une lettre d'un allié resté ailleurs (nouvelle entre les scènes). */
  function lettre(c) {
    var ici = M().ici(c);
    var al = vivants(c).filter(function (x) { return x.attitude === 'allié' && (!ici || x.lieuId !== ici.id); });
    if (!al.length) return null;
    var x = p(al), t = vivre(c, x, vivants(c, x.lieuId)); if (!t) return null;
    x.vuJour = c.jour;
    return '✉️ Des nouvelles de ' + x.nom + ' — ' + t;
  }
  return { EVTS: EVTS, arrivee: arrivee, lettre: lettre, vivants: vivants };
})();
