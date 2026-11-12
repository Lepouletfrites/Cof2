/* ============================================================
   COF2 Compagnon — Saisons et météo (mode aventure)
   L'année compte 4 saisons de 30 jours (printemps, été, automne,
   hiver). La saison choisit la météo, colore les descriptions, pèse
   sur les voyages (neige, orage : routes coupées, froid, chaleur,
   loups affamés…) et amène une fête dans les villages.
   ============================================================ */
window.COF = window.COF || {};

COF.Saisons = (function () {
  function p(l) { return l[Math.floor(Math.random() * l.length)]; }
  function T() { return COF.Conteur; }
  function M() { return COF.Monde; }

  var NOMS = [{ nom: 'printemps', ic: '🌸' }, { nom: 'été', ic: '☀️' }, { nom: 'automne', ic: '🍂' }, { nom: 'hiver', ic: '❄️' }];
  function info(c) {
    var j = Math.max(1, c.jour || 1) - 1, i = Math.floor((j % 120) / 30);
    return { i: i, nom: NOMS[i].nom, ic: NOMS[i].ic, jour: (j % 30) + 1, annee: Math.floor(j / 120) + 1 };
  }
  /* Météo possible selon la saison et le terrain. */
  function meteos(c, env) {
    var s = info(c).i, l;
    if (s === 0) l = ['clair', 'clair', 'gris', 'pluie', 'pluie', 'brume', 'vent'];
    else if (s === 1) l = ['clair', 'clair', 'clair', 'clair', 'gris', 'orage', 'orage', 'vent'];
    else if (s === 2) l = ['gris', 'gris', 'pluie', 'pluie', 'brume', 'brume', 'vent', 'vent', 'clair', 'orage'];
    else l = ['neige', 'neige', 'neige', 'gris', 'gris', 'clair', 'vent', 'brume'];
    if (env === 'arctique') l = ['neige', 'neige', 'clair', 'gris', 'vent'];
    else if (env === 'montagne') l = l.concat(s === 3 || s === 2 ? ['neige', 'neige', 'vent'] : ['vent']);
    else if (env === 'marais') l = l.concat(['brume', 'brume']);
    if (s === 1 && env !== 'arctique' && env !== 'montagne') l = l.filter(function (m) { return m !== 'neige'; });
    return l;
  }
  var AMBIANCE = [
    ['Les arbres se couvrent de bourgeons et l’air sent la terre mouillée.', 'Des agneaux gambadent dans les prés.', 'Les ruisseaux gonflés par la fonte des neiges débordent un peu partout.', 'Les oiseaux reviennent, bruyants, affairés.'],
    ['La chaleur fait vibrer l’air au-dessus des chemins.', 'Les blés sont hauts et dorés ; les grillons chantent sans arrêt.', 'Les mouches tournent autour des chevaux, agaçantes.', 'La poussière colle à la peau et aux vêtements.'],
    ['Les feuilles mortes tourbillonnent au vent.', 'Les forêts se parent de roux et d’or.', 'Des vols d’oies sauvages filent vers le sud.', 'Les champignons poussent partout après la pluie.'],
    ['Le givre blanchit chaque brin d’herbe.', 'Le froid mord les doigts et les oreilles.', 'Les rivières sont prises par la glace sur les bords.', 'La fumée des cheminées monte droite dans l’air glacé.']
  ];
  /* Une touche de saison dans l'ouverture (de temps en temps, dehors). */
  function ambiance(c, ctx) {
    var env = M().envIci(c); if (env === 'souterrain' || Math.random() > 0.25) return '';
    return p(AMBIANCE[info(c).i]);
  }
  function meteoDuJour(c) { var co = c.conteur || {}; return co.meteo && co.meteo.jour === c.jour ? co.meteo.id : null; }
  var DEHORS = ['voyage', 'explorer', 'piste', 'fil', 'libre'];
  /* À l'ouverture : la saison pèse sur la route et sur les scènes en plein air. */
  function ajuster(c, s, ctx) {
    var j = s.jeu, sz = info(c), m = meteoDuJour(c), env = (s.voyage && s.voyage.env) || M().envIci(c);
    if (env === 'souterrain' || DEHORS.indexOf(j.genre) < 0) return '';
    var dur = m === 'neige' || m === 'orage' || (sz.i === 3 && (env === 'montagne' || env === 'arctique'));
    if (j.genre === 'voyage' && dur && Math.random() < 0.5 && j.progMax < 5) {
      j.progMax++;
      return p(m === 'orage' ? ['L’orage a fait déborder les rivières : le gué est impraticable, il faudra faire un détour d’une journée.', 'Un arbre abattu par la tempête barre la route : un jour de plus.']
        : ['La neige a recouvert la piste : il faudra une journée de plus pour arriver.', 'Le col est bloqué par la neige. Le détour prendra un jour de plus.']);
    }
    if (dur && Math.random() < 0.4) { j.danger = Math.min(j.dangerMax - 1, j.danger + 1); return p(['Par ce temps, tout est plus difficile.', 'Le mauvais temps n’arrange rien : chaque pas coûte.']); }
    return '';
  }
  /* Chaque journée de route : le froid, la chaleur, les bêtes affamées… */
  var ROUTE = [
    [{ txt: 'Une averse de printemps trempe tout le monde jusqu’aux os.', codes: ['tension+'] }, { txt: 'Le chemin a disparu sous la boue : on s’y enfonce jusqu’aux chevilles.', codes: ['temps'] }],
    [{ txt: 'La chaleur est écrasante. Il faut trouver de l’eau, et vite.', codes: ['pv-'] }, { txt: 'Un orage d’été éclate sans prévenir, puis s’en va aussi vite.', codes: ['tension+'] }],
    [{ txt: 'Le brouillard d’automne fait perdre la route pendant des heures.', codes: ['temps'] }, { txt: 'Des chasseurs croisés sur la route partagent leur gibier.', codes: ['rations+'] }],
    [{ txt: 'Le froid est mordant : les doigts gèlent, le souffle se fige.', codes: ['pv-'] }, { txt: 'Une meute de loups affamés suit la piste à distance.', codes: ['danger'] }, { txt: 'Une tempête de neige force à s’abriter des heures durant.', codes: ['temps', 'tension+'] }]
  ];
  function journeeRoute(c, s, ctx) {
    if (Math.random() > 0.3) return null;
    var e = p(ROUTE[info(c).i]), r = COF.Imprevus.appliquer(c, s, e.codes, ctx, { v: {} });
    return { txt: e.txt, m: info(c).ic + ' ' + (r.m || '') };
  }
  /* Nouvelle de saison (entre deux scènes). */
  var NOUVELLES = [
    ['🌸 Le printemps est là : les chemins se remplissent de colporteurs et de pèlerins.', '🌸 La fonte des neiges a fait déborder la rivière ; un pont a été emporté.'],
    ['☀️ Une vague de chaleur écrase la région ; les puits baissent.', '☀️ Les moissons commencent : on cherche des bras dans toutes les fermes.'],
    ['🍂 Les feuilles tombent : la saison change, les routes deviennent boueuses.', '🍂 On rentre les récoltes avant les pluies ; les auberges sont pleines.'],
    ['❄️ L’hiver serre la région : des loups ont été vus près des villages.', '❄️ La neige a coupé les cols ; les marchands ne passent plus.']
  ];
  function nouvelle(c) { return p(NOUVELLES[info(c).i]); }
  /* Fête de la saison possible ici ? (une fois par saison et par année, à partir du 8e jour) */
  function feteDispo(c) {
    var ici = M().ici(c), sz = info(c); if (!ici || !(ici.ville || ici.env === 'urbain') || sz.jour < 8) return null;
    c.fetes = c.fetes || {};
    return c.fetes[sz.annee + '-' + sz.i] ? null : sz;
  }
  function marquerFete(c) { var sz = info(c); c.fetes = c.fetes || {}; c.fetes[sz.annee + '-' + sz.i] = c.position || true; }
  return { NOMS: NOMS, info: info, meteos: meteos, ambiance: ambiance, ajuster: ajuster, journeeRoute: journeeRoute, nouvelle: nouvelle, feteDispo: feteDispo, marquerFete: marquerFete };
})();
