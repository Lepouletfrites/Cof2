/* ============================================================
   COF2 Compagnon — Bandes et repaires (mode aventure)
   Des créatures s'installent dans la région : une bande de brigands,
   une meute, une tribu… avec un nom, un chef nommé et un repaire sur
   la carte. Laissée tranquille, elle grandit : pillages, routes peu
   sûres, prix qui montent dans les villages voisins. Le héros peut
   attaquer le repaire : le chef l'attend. La victoire soulage toute
   la région (réputation, prix, surnom).
   ============================================================ */
window.COF = window.COF || {};

COF.Bandes = (function () {
  function p(l) { return l[Math.floor(Math.random() * l.length)]; }
  function d(n) { return 1 + Math.floor(Math.random() * n); }
  function T() { return COF.Conteur; }
  function K() { return COF.Carnet; }
  function M() { return COF.Monde; }
  var PORTEE = 150, MAX = 3;

  function liste(c) { return c.bandes = c.bandes || []; }
  function actives(c) { return liste(c).filter(function (b) { return !b.vaincue; }); }
  function dist(a, b) { return Math.hypot((a.x || 0) - (b.x || 0), (a.y || 0) - (b.y || 0)); }

  var NOMS = {
    humanoide: ['les Crocs-Noirs', 'les Écorcheurs', 'les Lames Rouges', 'les Hommes du Borgne', 'les Fils de la Brume', 'les Manteaux Gris', 'les Égorgeurs du Val'],
    bete: ['les Loups Gris', 'les Crocs des Collines', 'les Bêtes du Bois Noir', 'les Affamés'],
    autre: ['les Os-Blancs', 'les Rampants', 'les Hurleurs', 'les Enfants de l’Ombre']
  };
  var EPITHETES = ['le Borgne', 'la Balafre', 'Dent-de-Fer', 'le Rouge', 'Main-Froide', 'le Boucher', 'Sans-Pitié', 'l’Ancien'];
  var PILLAGES = ['{b} ont pillé une ferme isolée près {de_l}.', 'Un convoi de marchands a été attaqué sur la route {de_l} : on accuse {b}.', 'Des bergers ont disparu près {de_l}. On murmure le nom {de_b}.', '{b} ont incendié un moulin, non loin {de_l}.', 'On a vu {chef} rôder aux portes {de_l}.'];

  /* Une nouvelle bande, avec son repaire près du héros. */
  function creer(c) {
    var ici = M().ici(c); if (!ici) return null;
    var r = COF.Aventure.rencontre(c, { env: ici.env === 'urbain' ? 'foret' : ici.env, difficulte: 'ordinaire', style: 'bande' });
    if (!r || r.erreur || !r.lots || !r.lots.length) return null;
    var lot = r.lots.slice().sort(function (a, b) { return b.nb - a.nb; })[0], cr = COF.UI && COF.UI.Bestiaire ? COF.UI.Bestiaire.get(lot.id) : null;
    var cat = cr && cr.cat === 'humanoide' ? 'humanoide' : (cr && /animal|bête|bete/i.test(cr.cat || '') ? 'bete' : (cr ? 'autre' : 'humanoide'));
    var nom = p(NOMS[cat]);
    if (liste(c).some(function (b) { return b.nom === nom; })) nom = nom + ' du ' + p(['Nord', 'Sud', 'Levant', 'Couchant']);
    var chefNom = (cat === 'humanoide' && COF.Culture ? COF.Culture.prenom(p(['humain', 'demiorc', 'humain']), 'masculin') : lot.nom.split(' ')[0]) + ' ' + p(EPITHETES);
    /* le repaire : un lieu sauvage découvert près d'ici */
    var a = Math.random() * Math.PI * 2, dest = { x: ici.x + Math.cos(a) * (40 + d(30)), y: ici.y + Math.sin(a) * (30 + d(20)) };
    var l = M().decouvrir(c, ici, dest, 0.9, null) || T().decouvrirLieu(c);
    if (!l || l.ville) return null;
    var b = { id: 'bd' + Date.now().toString(36) + d(999), nom: nom, cat: cat, creature: lot.nom, env: l.env, chef: chefNom, lieuId: l.id, lieuNom: l.nom, force: 1, jour: c.jour, crue: c.jour, vaincue: false };
    l.note = (l.note ? l.note + '\n' : '') + 'Repaire ' + de(nom) + ', menés par ' + chefNom + '.';
    liste(c).push(b);
    var f = K().ajouterListe(c, 'fils', { nom: '☠️ ' + maj(nom), note: maj(nom) + ' (' + lot.nom.toLowerCase() + ') ont pris leurs quartiers à ' + l.nom + ', sous les ordres de ' + chefNom + '. Tant qu’on les laisse faire, ils grandiront.' });
    b.filId = f.id;
    K().sauver(c);
    return b;
  }
  function maj(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  function de(nom) { return /^les /.test(nom) ? 'des ' + nom.slice(4) : /^la /.test(nom) ? 'de la ' + nom.slice(3) : /^le /.test(nom) ? 'du ' + nom.slice(3) : 'de ' + nom; }
  function lieu(c, b) { return M().lieu(c, b.lieuId); }
  /* Bande la plus proche du héros (ou d'un lieu), dans la région. */
  function proche(c, l) {
    l = l || M().ici(c); if (!l) return null;
    var best = null, bd = 1e9;
    actives(c).forEach(function (b) { var lr = lieu(c, b); if (!lr) return; var dd = dist(l, lr); if (dd < PORTEE && dd < bd) { bd = dd; best = b; } });
    return best;
  }
  /* Insécurité : les prix montent près des repaires. */
  function multPrix(c, l) {
    var m = 1;
    actives(c).forEach(function (b) { var lr = lieu(c, b); if (lr && dist(l, lr) < PORTEE && b.force >= 2) m += 0.03 * b.force; });
    return Math.min(1.25, m);
  }
  /* Le temps passe : les bandes grandissent, pillent ; parfois une nouvelle s'installe. Renvoie des notes. */
  function tick(c) {
    var out = [];
    actives(c).forEach(function (b) {
      if (c.jour - b.crue < 4) return;
      b.crue = c.jour;
      if (b.force < 5) b.force++;
      var vs = (c.lieux || []).filter(function (l) { var lr = lieu(c, b); return l.ville && lr && dist(l, lr) < PORTEE; });
      var v = vs.length ? p(vs) : lieu(c, b);
      out.push('🐺 ' + maj(T().polir(T().ex(p(PILLAGES), { b: b.nom, de_b: de(b.nom), chef: b.chef, de_l: v ? T().formes(v.nom).de : 'd’ici' }))) + (b.force >= 4 ? ' (Ils sont de plus en plus nombreux.)' : ''));
      if (v && v.ville && b.force >= 3 && COF.Saga) { /* les villages reprochent au héros de laisser faire */ }
    });
    if (actives(c).length < Math.min(MAX, 1 + Math.floor(c.jour / 15)) && c.jour >= 3 && c.jour - (c.bandesJour || -99) >= 5 && Math.random() < 0.35) {
      c.bandesJour = c.jour;
      var nb = creer(c);
      if (nb) out.push('☠️ ' + maj(nb.nom) + ' se sont installés à ' + nb.lieuNom + ', menés par ' + nb.chef + '. (Ajouté à la carte et aux fils.)');
    }
    return out;
  }
  /* Danger en route : près d'un repaire actif, la scène commence plus tendue. */
  function danger(c) { var b = proche(c); return b && b.force >= 3 ? b : null; }
  /* Proposition : attaquer le repaire (quand on y est). */
  function propositions(c) {
    var ici = M().ici(c); if (!ici) return [];
    return actives(c).filter(function (b) { return b.lieuId === ici.id; }).map(function (b) {
      return { type: 'donjon', ic: '🐺', titre: 'Attaquer le repaire ' + de(b.nom), lieu: ici.id, bandeId: b.id, filId: b.filId, fil: '☠️ ' + maj(b.nom),
        attendu: b.chef + ' et ' + b.nom + ' (' + b.creature.toLowerCase() + ', force ' + b.force + '/5) tiennent les lieux. Le chef attend au fond.' };
    });
  }
  /* Prépare l'assaut : le chef et sa bande barrent la route. Renvoie des entrées. */
  function preparer(c, s, prop) {
    var b = liste(c).filter(function (x) { return x.id === prop.bandeId; })[0]; if (!b) return [];
    s.bandeId = b.id;
    var r = COF.Aventure.rencontre(c, { env: b.env, difficulte: b.force >= 4 ? 'difficile' : 'ordinaire', style: 'bande', chef: b.chef });
    if (r.erreur) return [];
    r.test = 'Le repaire ' + de(b.nom);
    if (r.reaction !== 'hostile') { r.reaction = 'hostile'; r.reactionTexte = 'Ils savaient que quelqu’un viendrait.'; }
    c.rencontre = r;
    return [{ t: 'rencontre', r: r, txt: 'Le repaire ' + de(b.nom) + ' : ' + r.texte }];
  }
  /* Le repaire est nettoyé. Renvoie des notes. */
  function vaincre(c, id) {
    var b = liste(c).filter(function (x) { return x.id === id; })[0]; if (!b || b.vaincue) return [];
    b.vaincue = c.jour;
    var out = ['🏆 ' + maj(b.nom) + ' ne sont plus : ' + b.chef + ' est tombé, et la région respire.'];
    var po = (d(6) + d(6)) * b.force * T().niveau(c); out.push('💰 Le butin du repaire : ' + T().payer(c, po));
    var lr = lieu(c, b);
    (c.lieux || []).forEach(function (l) { if (l.ville && lr && dist(l, lr) < PORTEE && COF.Saga) { var t = COF.Saga.changerRep(l, 1); if (t) out.push(t); } });
    var f = (c.fils || []).filter(function (x) { return x.id === b.filId; })[0]; if (f) f.ouvert = false;
    if (COF.Legende && COF.Legende.donner) { var sn = COF.Legende.donner(c, 'bande-' + b.id, 'le Fléau ' + de(b.nom), 'la Fléau ' + de(b.nom)); if (sn) out.push(sn); }
    K().sauver(c);
    return out;
  }
  /* Nouvelle entre les scènes. */
  function nouvelle(c) { var l = tick(c); return l.length ? l[0] : null; }
  return { creer: creer, liste: liste, actives: actives, proche: proche, multPrix: multPrix, tick: tick, danger: danger, propositions: propositions, preparer: preparer, vaincre: vaincre, nouvelle: nouvelle, de: de };
})();
