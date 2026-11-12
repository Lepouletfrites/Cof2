/* ============================================================
   COF2 Compagnon — Conversations avec les PNJ
   Chaque PNJ reçoit une personnalité (trait, idéal, motivation, secret)
   et une relation chiffrée avec le héros (−3 à +3), qui donne son
   attitude (hostile, neutre, allié). Une conversation se joue en
   3 répliques : interroger, flatter, menacer, demander un service,
   percer son secret, le recruter, parler de soi… Les répliques du PNJ
   dépendent de son humeur et de son caractère.
   ============================================================ */
window.COF = window.COF || {};

COF.Dialogues = (function () {
  function p(l) { return l[Math.floor(Math.random() * l.length)]; }
  function d(n) { return 1 + Math.floor(Math.random() * n); }
  function T() { return COF.Conteur; }
  function K() { return COF.Carnet; }
  function M() { return COF.Monde; }

  var TRAITS = {
    Cupide: ['« Tout a un prix, tu sais. »', '{x} jette un regard appuyé sur la bourse de {h}.'],
    Couard: ['{x} regarde sans cesse vers la porte.', '« Je ne veux pas d’ennuis, moi… »'],
    Colérique: ['{x} serre les poings au moindre mot de travers.', '« Fais attention à ce que tu dis. »'],
    Fanfaron: ['« Tu sais à qui tu parles ? J’ai tué un ours à mains nues, moi. »', '{x} parle fort pour que tout le monde l’entende.'],
    Crédule: ['{x} écoute {h} avec de grands yeux.', '« Vraiment ? Raconte ! »'],
    Distrait: ['{x} perd le fil de la conversation, puis le retrouve.', '« Pardon, tu disais ? »'],
    Alcoolique: ['{x} vide son verre d’un trait et en commande un autre.', '« Tu m’offres un verre ? »'],
    Menteur: ['{x} évite le regard de {h}.', '« Je te jure que c’est la vérité. Enfin, presque. »'],
    Orgueilleux: ['{x} toise {h} de haut en bas.', '« Je ne parle pas à n’importe qui. »'],
    Paranoïaque: ['« Qui t’envoie ? »', '{x} baisse la voix et vérifie que personne n’écoute.']
  };
  var DEFAUT = ['{x} hoche la tête.', '{x} prend le temps de réfléchir.', '{x} observe {h} en silence.'];
  var ACCUEIL = {
    neg: ['« Encore toi ? Qu’est-ce que tu veux ? »', '{x} croise les bras : la conversation commence mal.', '« Fais vite. »'],
    neu: ['« Bonjour, étranger. »', '{x} accueille {h} d’un signe de tête.', '« Je peux t’aider ? »'],
    pos: ['« {h} ! Quel plaisir de te revoir ! »', '{x} serre chaleureusement la main de {h}.', '« Assieds-toi, mon ami. Raconte-moi tout. »']
  };

  /* Personnalité et relation (créées au besoin). */
  function profil(x) {
    if (!x.perso) {
      var tr = Object.keys(TRAITS);
      x.perso = { trait: p(COF.PNJ_TRAVERS && Math.random() < 0.4 ? COF.PNJ_TRAVERS : tr), ideal: p(COF.PNJ_IDEAUX || ['Loyauté']),
        secret: p(COF.PNJ_SECRETS || ['Cache une dette', 'A trahi un ami', 'N’est pas celui qu’il prétend être']), revele: false };
    }
    if (typeof x.rel !== 'number') x.rel = x.attitude === 'allié' ? 2 : (x.attitude === 'hostile' ? -2 : 0);
    return x;
  }
  function attitude(x) { x.attitude = x.rel >= 2 ? 'allié' : (x.rel <= -2 ? 'hostile' : 'neutre'); }
  /* Les gens à qui parler ici (connus du lieu, compagnons, notable du village). */
  function interlocuteurs(c) {
    var ici = M().ici(c), out = [];
    (c.pnj || []).forEach(function (x) {
      if ((x.compagnon && x.compagnon.actif) || (ici && x.lieuId === ici.id)) out.push(x);
    });
    if (ici && ici.ville && !out.some(function (x) { return x.nom === ici.ville.notable.nom; })) {
      var n = K().ajouterListe(c, 'pnj', { nom: ici.ville.notable.nom, attitude: 'neutre', genre: ici.ville.notable.genre, note: ici.ville.notable.metier + ' à ' + ici.nom + '.' });
      n.lieuId = ici.id; n.jour = c.jour; out.push(n); K().sauver(c);
    }
    return out.slice(0, 4);
  }
  function pnj(c, id) { return (c.pnj || []).filter(function (x) { return x.id === id; })[0] || null; }
  function ctxDe(c, s, x) { var f = x.genre === 'féminin'; return Object.assign(T().contexte(c, s), { x: x.nom, xe: f ? 'e' : '', xil: f ? 'elle' : 'il', xle: f ? 'la' : 'le' }); }
  function humeur(x) { return x.rel <= -1 ? 'neg' : (x.rel >= 1 ? 'pos' : 'neu'); }
  function intro(c, s, ctx) {
    var x = profil(pnj(c, s.dialogue.pnjId) || {}); if (!x.nom) return '';
    var cx = Object.assign({}, ctx, { x: x.nom, xil: x.genre === 'féminin' ? 'elle' : 'il' });
    return T().dire('{h} va trouver {x}. ', cx) + T().dire(ACCUEIL[humeur(x)], cx) + ' ' + T().dire(TRAITS[x.perso.trait] || DEFAUT, cx);
  }
  /* Choix possibles selon la relation. */
  var CHOIX = [
    { id: 'interroger', nom: 'Interroger {x}', carac: 'CHA' },
    { id: 'flatter', nom: 'Mettre {x} dans de bonnes dispositions', carac: 'CHA' },
    { id: 'menacer', nom: 'Menacer {x}', carac: 'VOL' },
    { id: 'service', nom: 'Demander un service à {x}', carac: 'CHA', min: 1 },
    { id: 'secret', nom: 'Percer le secret de {x}', carac: 'PER', min: 0 },
    { id: 'recruter', nom: 'Proposer à {x} de faire route ensemble', carac: 'CHA', min: 2 },
    { id: 'soi', nom: 'Parler de soi', auto: true, aide: 'la relation peut s’améliorer' }
  ];
  function dispo(c, s) {
    var x = profil(pnj(c, s.dialogue.pnjId) || {});
    return CHOIX.filter(function (ch) {
      if (ch.min !== undefined && x.rel < ch.min) return false;
      if (ch.id === 'secret' && x.perso && x.perso.revele) return false;
      if (ch.id === 'recruter' && x.compagnon && x.compagnon.actif) return false;
      return !(s.dialogue.faits || []).some(function (f) { return f === ch.id; }) || ch.id === 'interroger';
    });
  }
  function choix(c, s) {
    var base = T().difficulteBase(c), x0 = pnj(c, s.dialogue.pnjId) || {}, cx = ctxDe(c, s, x0);
    return dispo(c, s).map(function (ch, i) {
      var o = { i: i, nom: T().polir(T().ex(ch.nom, cx)), auto: !!ch.auto, aide: ch.aide };
      if (!ch.auto) { o.carac = ch.carac; o.mod = T().caracHeros(c, ch.carac); o.diff = base + (ch.id === 'recruter' ? 2 : 0); }
      return o;
    });
  }
  function rel(x, n, m) { var av = x.rel; x.rel = Math.max(-3, Math.min(3, x.rel + n)); attitude(x); if (x.rel !== av) m.push((n > 0 ? '💚 ' : '💢 ') + x.nom + ' : ' + x.attitude + ' (' + (x.rel > 0 ? '+' : '') + x.rel + ')'); }
  function agir(c, s, i) {
    var ch = dispo(c, s)[i]; if (!ch) return {};
    var x = profil(pnj(c, s.dialogue.pnjId)); if (!x) return {};
    var j = s.jeu, ctx = ctxDe(c, s, x), m = [], txt, ok = true, out = {};
    s.dialogue.faits = (s.dialogue.faits || []).concat([ch.id]);
    if (!ch.auto) {
      var jt = T().jet(c, s, ch.carac, T().difficulteBase(c) + (ch.id === 'recruter' ? 2 : 0) - (x.rel > 0 ? 1 : 0), T().motsPour(ch.id === 'menacer' ? 'parlementer' : 'interroger', ch.carac));
      ok = jt.reussi; m.push(jt.m);
    }
    switch (ch.id) {
      case 'interroger':
        if (ok) {
          var e = COF.Imprevus.appliquer(c, s, x.rel >= 1 && c.saga && !c.saga.fini && Math.random() < 0.4 ? ['indiceSaga'] : ['rumeur', 'indice'], ctx, { v: {} });
          txt = T().dire(['{x} parle à voix basse : ce qu’{xil} sait pourrait servir.', '« Puisque tu demandes… » {x} raconte ce qu’il a vu et entendu.'], ctx); if (e.m) m.push(e.m);
        } else { txt = T().dire(['{x} élude : « Je ne sais rien. »', '« Pourquoi toutes ces questions ? » {x} se ferme.'], ctx); rel(x, -1, m); }
        break;
      case 'flatter':
        if (ok) { txt = T().dire(['Quelques compliments bien tournés, et {x} se détend.', '{x} rit de bon cœur. La glace est brisée.'], ctx); rel(x, 1, m); }
        else { txt = T().dire(['La flatterie sonne faux : {x} n’est pas dupe.', '{x} plisse les yeux : « Tu veux quelque chose, toi. »'], ctx); if (x.perso.trait === 'Orgueilleux') rel(x, -1, m); }
        break;
      case 'menacer':
        if (ok) {
          var e2 = COF.Imprevus.appliquer(c, s, ['rumeur', 'indice'], ctx, { v: {} }); if (e2.m) m.push(e2.m);
          txt = T().dire(['{x} pâlit et lâche tout ce qu’{xil} sait.', 'Sous la menace, {x} parle. Mais {xil} ne l’oubliera pas.'], ctx); rel(x, -1, m); if (COF.Echos) COF.Echos.noter(c, 'rancune', { pnjId: x.id });
        } else {
          txt = T().dire(['{x} ne se laisse pas impressionner.', '« Tu crois me faire peur ? »'], ctx); rel(x, -2, m); if (COF.Echos) COF.Echos.noter(c, 'rancune', { pnjId: x.id });
          if (x.rel <= -2 && Math.random() < 0.5) out.combat = true;
        }
        break;
      case 'service':
        if (ok) {
          var t = p(['po', 'objet', 'aide']);
          if (COF.Echos && Math.random() < 0.6) COF.Echos.noter(c, 'dette', { pnjId: x.id });
          if (t === 'po') { m.push(T().payer(c, d(6) * T().niveau(c))); txt = T().dire('{x} prête quelques pièces à {h}, « à rendre quand tu pourras ».', ctx); }
          else if (t === 'objet' && COF.Recompense) {
            var o = COF.Recompense.tirerObjetLivre(T().niveau(c), 'potion'), h = T().heros(c);
            if (o && h) { COF.Store.ajouterObjet(h, Object.assign({}, o.item, { nom: '✨ ' + o.item.nom, qte: 1 })); COF.Store.sauver(h); m.push('🎒 ' + o.nom); }
            txt = T().dire('{x} fouille dans un coffre et tend quelque chose à {h} : « Tiens, ça te sera plus utile qu’à moi. »', ctx);
          } else { j.bonus = true; j.prog++; m.push('objectif +1 · dé bonus'); txt = T().dire('{x} promet de couvrir les arrières de {h} et de lui ouvrir quelques portes.', ctx); }
        } else { txt = T().dire('{x} secoue la tête : « Pas cette fois. »', ctx); }
        break;
      case 'secret':
        if (ok) {
          x.perso.revele = true;
          K().ajouterListe(c, 'fils', { nom: 'Le secret de ' + x.nom, note: x.nom + ' : ' + x.perso.secret + '.' });
          txt = T().dire('À un détail, {h} comprend ce que {x} cache : ' + String(x.perso.secret).charAt(0).toLowerCase() + String(x.perso.secret).slice(1) + '.', ctx);
          m.push('🧵 nouveau fil : le secret de ' + x.nom);
        } else { txt = T().dire(['{x} sent qu’on {xle} jauge et change de sujet.', 'Rien ne transparaît.'], ctx); rel(x, -1, m); }
        break;
      case 'recruter':
        if (ok) {
          x.compagnon = { actif: true, role: p(['combattant', 'tireur', 'mystique']), niveau: Math.max(1, T().niveau(c) - 1), loyaute: 6 };
          txt = T().dire('{x} réfléchit longuement, puis tend la main : « D’accord. Je viens avec toi. »', ctx); m.push('🤝 ' + x.nom + ' rejoint le héros');
        } else { txt = T().dire('« J’ai ma vie ici. Mais merci de l’avoir proposé. »', ctx); }
        break;
      case 'soi':
        txt = T().dire(['{h} raconte ses aventures. {x} écoute avec attention.', '{h} se livre un peu. {x} semble touché{xe} par cette confiance.'], ctx);
        if (Math.random() < 0.6) rel(x, 1, m);
        break;
    }
    if (COF.Troupe) COF.Troupe.reagir(c, ch.id, ctx).forEach(function (n) { txt += ' ' + n.txt; m.push(n.m); });
    j.prog++; if (!ok) j.danger++;
    txt = txt + (Math.random() < 0.4 ? ' ' + T().dire(TRAITS[x.perso.trait] || DEFAUT, ctx) : '');
    K().ajouterEntree(c, { t: 'recit', txt: txt, m: m.join(' · ') || 'sans jet', ok: ok });
    s = K().sceneCourante(c);
    if (out.combat) { txt = T().dire('{x} sort une lame. La conversation est terminée.', ctx); out.menace = T().engager(c, s, null); K().sauver(c); return out; }
    if (s.jeu.prog >= s.jeu.progMax || s.jeu.danger >= s.jeu.dangerMax) T().finir(c, s, s.jeu.danger >= s.jeu.dangerMax ? 'echec' : 'reussite');
    K().sauver(c);
    return out;
  }
  return { interlocuteurs: interlocuteurs, profil: profil, intro: intro, choix: choix, agir: agir };
})();
