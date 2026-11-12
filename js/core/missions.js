/* ============================================================
   COF2 Compagnon — Petites affaires (quêtes secondaires)
   Des missions courtes, jouées en une scène, qui rendent le monde
   vivant entre deux étapes de la grande histoire : livrer un colis,
   chasser une bête, retrouver un disparu, régler une dispute, un
   concours au village… 12 types, chacun avec ses propres actions,
   tirés selon le contexte (village, terrain, PNJ connus).
   - Le récit en propose d'elles-mêmes (« 📌 Petite affaire »), et les
     nouvelles entre les scènes en apportent d'autres.
   - Réussite : pièces, réputation du village, parfois un objet ou un
     allié. Échec : la réputation en pâtit, l'affaire est perdue.
   ============================================================ */
window.COF = window.COF || {};

COF.Missions = (function () {
  function p(l) { return l[Math.floor(Math.random() * l.length)]; }
  function d(n) { return 1 + Math.floor(Math.random() * n); }
  function K() { return COF.Carnet; }
  function M() { return COF.Monde; }
  function T() { return COF.Conteur; }
  function np(s) { return COF.Imprevus ? COF.Imprevus.np(s) : { un: s.slice(2), le: s.slice(2), e: '' }; }

  var GENS = ['m:meunier', 'f:aubergiste', 'm:forgeron', 'f:herboriste', 'm:vieux berger', 'f:marchande de grains', 'm:prêtre du village', 'f:sage-femme',
    'm:charron', 'f:fermière', 'm:garde de la milice', 'f:tisserande', 'm:pêcheur', 'f:veuve du tanneur', 'm:maître d’école', 'f:fille du bailli'];
  var OBJETS = ['un coffret scellé', 'une lettre cachetée de cire rouge', 'un remède précieux', 'un anneau de fiançailles', 'une statuette votive', 'un livre de comptes',
    'une épée réparée', 'un sachet de graines rares', 'une boîte à musique', 'un pendentif de famille'];
  var BETES = ['un loup énorme', 'un ours rendu fou', 'un sanglier gigantesque', 'une meute de chiens sauvages', 'une araignée géante', 'un grand félin'];
  var MOTIFS = ['un champ', 'un mariage rompu', 'une vache volée', 'une vieille dette', 'un puits partagé', 'un héritage', 'une insulte au marché'];
  var MAUX = ['une fièvre qui ne tombe pas', 'une morsure qui noircit', 'une toux sanglante', 'un sommeil dont on ne se réveille pas'];
  var INGREDIENTS = ['une fleur de lune', 'de la mousse de grotte', 'une racine d’ortie noire', 'du miel de ruche sauvage', 'une écaille de serpent d’eau'];
  var DISCIPLINES = [['de tir à l’arc', 'AGI'], ['de lutte', 'FOR'], ['de devinettes', 'INT'], ['de boisson', 'CON'], ['de chant', 'CHA'], ['de course', 'AGI'], ['de pistage', 'PER']];
  var CREANCIERS = ['des contrebandiers', 'un usurier sans pitié', 'la guilde des voleurs', 'un seigneur cupide'];

  /* type : titre, accroche, actions (ids du Conteur), danger, combat (rencontre au départ, sans/avec filtre), ok, ko */
  var TYPES = {
    livraison: { titre: 'Livrer {objet} à {dest}', accroche: '{donneur_un} confie à {h} {objet} à remettre à {dest}, {a_lieuM}. « Surtout, ne l’ouvrez pas. »',
      actions: ['orienter', 'marcher', 'guetter', 'contourner'], danger: 2, ok: '{objet} est remis en mains propres. {dest} remercie {h} chaleureusement.', ko: '{objet} arrive abîmé et en retard. Personne n’est content.' },
    bete: { titre: 'La bête {de_lieuM}', accroche: '{donneur_un} supplie {h} : {bete} terrorise les environs {de_lieuM}. Plusieurs bêtes ont été égorgées.',
      actions: ['pister', 'fouiller', 'guetter', 'forcer'], danger: 2, combat: 'animal', ok: 'La bête ne fera plus de mal. Les habitants respirent.', ko: 'La bête s’est enfuie. Elle reviendra.' },
    perdu: { titre: 'Retrouver {objet}', accroche: '{donneur_un} a perdu {objet} quelque part {a_lieuM}. Il y tient plus qu’à sa propre vie.',
      actions: ['fouiller', 'interroger', 'pister', 'savoir'], danger: 2, ok: '{objet} est retrouvé, intact. {donneur_le} n’en revient pas.', ko: 'Malgré les recherches, {objet} reste introuvable.' },
    dispute: { titre: 'La querelle de {motif}', accroche: 'Deux familles s’écharpent pour {motif}. {donneur_un} prie {h} de les départager avant que le sang ne coule.',
      actions: ['parlementer', 'interroger', 'savoir', 'tenir'], danger: 2, ok: 'Un compromis est trouvé. On se serre la main, à contrecœur.', ko: 'Les insultes fusent ; chacun repart plus fâché qu’avant.' },
    malade: { titre: 'Le remède', accroche: 'Un enfant souffre d’{mal}. {donneur_un} dit qu’il faut {ingredient}, qu’on trouve {a_lieuM}.',
      actions: ['fourrager', 'savoir', 'pister', 'observer'], danger: 2, ok: 'Le remède agit : l’enfant ouvre les yeux. Toute la famille pleure de joie.', ko: 'Le remède arrive trop tard, ou ne suffit pas. Le village est en deuil.' },
    disparu: { titre: 'Le disparu', accroche: '{personne_un} n’est pas rentré{personne_e} depuis deux jours. On {personne_l}’a vu{personne_e} pour la dernière fois {a_lieuM}.',
      actions: ['pister', 'interroger', 'fouiller', 'guetter'], danger: 3, combat: 'menace', ok: '{personne_le} est retrouvé{personne_e}, blessé{personne_e} mais vivant{personne_e}.', ko: 'On ne retrouve qu’un soulier et des traces de lutte.' },
    voleur: { titre: 'Le voleur insaisissable', accroche: 'Des vols à répétition {a_lieuM}. {donneur_un} promet une récompense à qui démasquera le coupable.',
      actions: ['guetter', 'interroger', 'fouiller', 'savoir'], danger: 2, ok: 'Le voleur est pris la main dans le sac. C’était le dernier qu’on soupçonnait.', ko: 'Le voleur court toujours, et se moque bien de {h}.' },
    hante: { titre: 'Les murmures {de_lieuM}', accroche: 'On dit que {lieuM_n} est hanté : lumières, voix, objets qui bougent. {donneur_un} n’ose plus y passer.',
      actions: ['savoir', 'observer', 'tenir', 'fouiller'], danger: 3, ok: 'Le mystère est levé : une explication bien réelle, et un esprit apaisé.', ko: '{h} s’enfuit, les cheveux dressés sur la tête.' },
    concours: { titre: 'Le concours {discipline}', accroche: 'Grand concours {discipline} à la fête du village ! Une bourse et la gloire pour le vainqueur.',
      actions: ['concours', 'parlementer', 'tenir'], danger: 2, ok: '{h} l’emporte sous les vivats ! On parlera longtemps de cette victoire.', ko: '{h} termine bon dernier, sous les rires.' },
    escorte: { titre: 'Escorter {personne_le}', accroche: '{personne_un} doit rejoindre {lieuM_n} mais n’ose pas voyager seul{personne_e}. {donneur_un} demande à {h} de l’accompagner.',
      actions: ['orienter', 'guetter', 'marcher', 'parlementer'], danger: 3, combat: 'menace', ok: '{personne_le} arrive à bon port et jure de ne jamais l’oublier.', ko: 'Le voyage tourne mal ; {personne_le} rentre chez soi, terrorisé{personne_e}.' },
    dette: { titre: 'La dette', accroche: '{donneur_un} doit de l’argent à {creancier}. Si rien n’est fait, ça finira mal.',
      actions: ['negocier', 'parlementer', 'guetter', 'forcer'], danger: 3, ok: 'La dette est effacée — par la ruse ou la parole. {donneur_le} peut dormir tranquille.', ko: 'Les créanciers repartent furieux. On n’a pas fini d’en entendre parler.' },
    meurtre: { titre: 'Un meurtre {a_lieuM}', accroche: 'On a retrouvé un corps {a_lieuM}. {donneur_un} est persuadé{donneur_e} que la garde accusera le mauvais coupable.',
      actions: ['interroger', 'fouiller', 'savoir', 'guetter'], danger: 3, combat: 'menace', ok: 'Le vrai coupable est démasqué. Le village respire, et se souviendra de {h}.', ko: 'Un innocent est pendu. Le doute ne quittera jamais {h}.' },
    troupeau: { titre: 'La garde du troupeau', accroche: '{donneur_un} perd une bête chaque nuit {a_lieuM}. Il faut quelqu’un pour veiller sur le troupeau.',
      actions: ['guetter', 'tenir', 'pister', 'forcer'], danger: 2, combat: 'animal', ok: 'Le prédateur ne reviendra pas. Le troupeau est sauf.', ko: 'Au matin, deux bêtes manquent encore.' },
    pont: { titre: 'Le pont effondré', accroche: 'Le pont {de_lieuM} s’est effondré. {donneur_un} cherche des bras et une tête pour le reconstruire avant les pluies.',
      actions: ['forcer', 'savoir', 'parlementer', 'tenir'], danger: 2, ok: 'Le pont tient debout. On y gravera peut-être le nom de {h}.', ko: 'Le pont s’effondre à nouveau dans un grand fracas.' },
    trafic: { titre: 'Le trafic', accroche: 'Des contrebandiers se servent {de_lieuM} pour leurs trafics. {donneur_un} voudrait que ça cesse, sans que la garde s’en mêle.',
      actions: ['guetter', 'pister', 'interroger', 'forcer'], danger: 3, combat: 'menace', ok: 'Le trafic est démantelé. Les caisses saisies valent leur pesant d’or.', ko: 'Les trafiquants ont été prévenus et ont filé.' },
    mariage: { titre: 'Les noces contrariées', accroche: 'Deux jeunes gens veulent se marier ; leurs familles s’y opposent farouchement. {donneur_un} demande à {h} d’arranger les choses.',
      actions: ['parlementer', 'interroger', 'negocier', 'savoir'], danger: 2, ok: 'Les noces auront lieu ! {h} y est invité{he} à la place d’honneur.', ko: 'Les familles s’entêtent ; les amoureux fuient ensemble dans la nuit.' },
    prophete: { titre: 'Le faux prophète', accroche: 'Un prophète annonce la fin du monde {a_lieuM} et vide les bourses des crédules. {donneur_un} s’inquiète.',
      actions: ['parlementer', 'savoir', 'interroger', 'guetter'], danger: 2, ok: 'Le charlatan est démasqué devant tous. Les bourses retrouvent leurs propriétaires.', ko: 'Les fidèles se retournent contre {h}.' },
    tresor: { titre: 'Le trésor de l’aïeul', accroche: '{donneur_un} a hérité d’une carte griffonnée : un trésor caché {a_lieuM} par un ancêtre. Partage à moitié ?',
      actions: ['savoir', 'pister', 'fouiller', 'contourner'], danger: 2, ok: 'Le coffre est là, sous une pierre plate. Il ne contient pas que des souvenirs.', ko: 'Le trou est vide. Quelqu’un est passé avant.' },
    garde: { titre: 'Une nuit de garde', accroche: 'Des brigands rôdent autour {de_lieuM}. {donneur_un} paie bien pour une nuit de garde.',
      actions: ['guetter', 'tenir', 'forcer', 'observer'], danger: 3, combat: 'menace', ok: 'Au petit matin, les brigands ont renoncé. {donneur_le} paie sans discuter.', ko: 'Les brigands ont frappé malgré tout.' },
    cueillette: { titre: 'La plante rare', accroche: '{donneur_un} prépare un remède et a besoin {de_plante}, qui ne pousse que {a_lieuM}.',
      actions: ['fourrager', 'savoir', 'observer', 'contourner'], danger: 2, ok: 'La plante est cueillie à la bonne lune. Le remède sera puissant.', ko: 'La plante était fanée, ou ce n’était pas la bonne.' },
    apprenti: { titre: 'L’apprenti fugueur', accroche: 'L’apprenti {de_donneur} s’est enfui avec la caisse. On l’a vu partir vers {lieuM_n}.',
      actions: ['pister', 'interroger', 'parlementer', 'guetter'], danger: 2, ok: 'L’apprenti est ramené, penaud, avec la caisse presque intacte.', ko: 'L’apprenti et la caisse se sont évanouis dans la nature.' },
    message: { titre: 'Le message urgent', accroche: 'Un message doit atteindre {dest}, {a_lieuM}, avant la nuit. {donneur_un} n’a personne d’autre.',
      actions: ['marcher', 'orienter', 'contourner', 'guetter'], danger: 2, ok: 'Le message arrive à temps. Quelque chose de grave a été évité.', ko: 'Le message arrive trop tard.' }
  };

  /* Action propre au concours : la caractéristique dépend de l'épreuve. */
  function enregistrer() {
    var A = T().ACTIONS, G = T().GENRES;
    A.concours = { nom: 'Concourir de toutes ses forces', carac: 'AGI',
      ok: ['{h} se surpasse et prend la tête de l’épreuve.', 'La foule scande le nom de {h}.'], ko: ['{h} trébuche au pire moment.', 'Un concurrent fait mieux, de peu.'] };
    Object.keys(TYPES).forEach(function (k) {
      var t = TYPES[k];
      G['mission_' + k] = { prog: 2, danger: t.danger, actions: t.actions, ouv: ['{moment} {decor} ' + t.accroche], ok: [t.ok], ko: [t.ko] };
    });
  }

  /* Tire une petite affaire selon le contexte. */
  function generer(c) {
    var ici = M().ici(c), ville = ici && (ici.ville || ici.env === 'urbain');
    var cles = Object.keys(TYPES).filter(function (k) { return k !== 'concours' || ville; });
    var type = p(cles), t = TYPES[type];
    var dn = np(p(GENS)), ps = np(p(GENS)), bt = p(BETES), di = p(DISCIPLINES);
    /* le lieu de la mission : un lieu connu proche, sinon ici */
    var voisins = ici ? M().voisins(c, ici.id).map(function (v) { return v.lieu; }) : [];
    var lieu = (type === 'concours' || !voisins.length) ? ici : p(voisins);
    var fo = T().formes(lieu ? lieu.nom : 'les environs');
    var v = { type: type, donneur_un: dn.un, donneur_le: dn.le, personne_un: ps.un, personne_le: ps.le, personne_e: ps.e, personne_l: ps.e ? 'l' : 'l',
      objet: p(OBJETS), dest: p(['le prêtre du hameau voisin', 'une vieille tante', 'le capitaine de la garde', 'un marchand de passage', 'la guérisseuse']),
      bete: bt, motif: p(MOTIFS), mal: p(MAUX), ingredient: p(INGREDIENTS), discipline: di[0], caracConcours: di[1], creancier: p(CREANCIERS),
      lieuM_n: fo.n, a_lieuM: fo.a, de_lieuM: fo.de, lieuId: lieu ? lieu.id : null, donneurGenre: dn.e ? 'féminin' : 'masculin',
      donneur_e: dn.e, de_donneur: dn.de, de_plante: 'd’' + p(['une orchidée noire', 'une mandragore', 'une fleur de givre', 'un lichen lumineux', 'une herbe à sorcière']) };
    var titre = T().dire(t.titre, Object.assign({}, v, { _vus: null }));
    return { type: type, v: v, titre: titre, accroche: T().dire(t.accroche, Object.assign({ h: 'le héros' }, v)), jour: c.jour };
  }
  /* Une offre stable (la même tant qu'on ne l'a pas prise ou laissée filer). */
  function offre(c) {
    var o = c.offreMission;
    if (o && c.jour - o.jour <= 3) return o;
    c.offreMission = generer(c);
    return c.offreMission;
  }
  function ouvertes(c) { return (c.fils || []).filter(function (f) { return f.ouvert && f.mission; }); }
  /* Propositions du directeur : les affaires acceptées, et une nouvelle offre. */
  function propositions(c) {
    var out = ouvertes(c).slice(0, 2).map(function (f) {
      return { type: 'mission', ic: '📌', titre: f.nom, filId: f.id, fil: f.nom, attendu: f.note || '' };
    });
    if (ouvertes(c).length < 2) {
      var o = offre(c);
      out.push({ type: 'offre', ic: '📌', titre: 'Petite affaire : ' + o.titre, attendu: o.accroche });
    }
    return out;
  }
  /* Accepte l'offre : elle devient un fil, jouable aussitôt. */
  function accepter(c, o) {
    o = o || c.offreMission; if (!o) return null;
    var f = K().ajouterListe(c, 'fils', { nom: '📌 ' + o.titre, note: o.accroche, mission: { type: o.type, v: o.v, jour: c.jour } });
    if (c.offreMission === o || (c.offreMission && c.offreMission.titre === o.titre)) c.offreMission = null;
    K().sauver(c);
    return f;
  }
  /* Contexte de scène : les valeurs de la mission. */
  function contexte(f) { return f && f.mission ? Object.assign({}, f.mission.v) : {}; }
  /* Rencontre au départ pour certaines affaires (la bête, un enlèvement…). */
  function preparer(c, s, f) {
    if (!f || !f.mission) return [];
    var t = TYPES[f.mission.type]; if (!t || !t.combat || c.rencontre || Math.random() > 0.5) return [];
    var opts = { difficulte: 'ordinaire', style: 'auto' };
    if (t.combat === 'animal') opts.filtreFn = function (cr) { return cr.cat === 'animal' || /loup|ours|sanglier|araignée|félin|panthère|chien/i.test(cr.nom); };
    else opts.theme = true;
    var r = COF.Aventure.rencontre(c, opts); if (r.erreur) return [];
    r.reaction = 'hostile'; r.reactionTexte = 'Hostiles.'; r.test = 'Petite affaire';
    c.rencontre = r;
    return [{ t: 'rencontre', r: r, txt: 'Rencontre : ' + r.texte }];
  }
  /* Fin de l'affaire : récompense ou conséquence. Renvoie les notes. */
  function conclure(c, f, ok) {
    var notes = [], m = f.mission, hP = T().heros(c), niv = T().niveau(c), lieu = m.v.lieuId ? M().lieu(c, m.v.lieuId) : M().ici(c);
    f.ouvert = false;
    if (COF.Factions) { var nf = COF.Factions.pourMission(c, m.type, ok); if (nf) notes.push(nf); }
    if (ok) {
      var po = (d(6) + 1) * niv; notes.push('📌 Affaire réglée : « ' + f.nom.replace(/^📌 /, '') + ' ». ' + T().payer(c, po) + '.');
      if (COF.Saga && lieu && lieu.ville) { var rp = COF.Saga.changerRep(lieu, 1); if (rp) notes.push(rp); }
      var tir = Math.random();
      if (tir < 0.3 && hP && COF.Recompense) {
        var o = COF.Recompense.tirerObjetLivre(niv, p(['potion', 'potion', 'objet']));
        if (o) { COF.Store.ajouterObjet(hP, Object.assign({}, o.item, { nom: '✨ ' + o.item.nom, qte: 1 })); COF.Store.sauver(hP); notes.push('🎁 En prime : ' + o.nom + '.'); }
      } else if (tir < 0.55) {
        var pn = COF.Aventure.pnj({ genre: m.v.donneurGenre });
        var x = K().ajouterListe(c, 'pnj', { nom: pn.nom, attitude: 'allié', genre: m.v.donneurGenre, note: 'Reconnaissant envers le héros (' + m.v.donneur_un + ').\n' + pn.texte });
        x.lieuId = lieu ? lieu.id : null; x.jour = c.jour;
        notes.push('🤝 ' + pn.nom + ' (' + m.v.donneur_un.replace(/^une? /, '') + ') devient un allié.');
      }
      c.tension = Math.max(1, c.tension - 1);
      if (COF.Echos && lieu && Math.random() < 0.6) COF.Echos.noter(c, 'gratitude', { lieuId: lieu.id });
    } else {
      if (COF.Echos && lieu && Math.random() < 0.6) COF.Echos.noter(c, 'rancoeur', { lieuId: lieu.id });
      notes.push('📌 Affaire perdue : « ' + f.nom.replace(/^📌 /, '') + ' ».');
      if (COF.Saga && lieu && lieu.ville) { var rm = COF.Saga.changerRep(lieu, -1); if (rm) notes.push(rm); }
    }
    return notes;
  }

  /* ================= Nouvelles entre les scènes ================= */
  /* De temps en temps, le monde bouge sans le héros : une lettre, un appel
     à l'aide, un PNJ qui agit… Chaque nouvelle a un effet réel. */
  var NOUVELLES = [
    function (c) {      /* un appel à l'aide : nouvelle offre de mission */
      c.offreMission = generer(c);
      return '📨 Un message arrive : ' + c.offreMission.accroche.replace(/\.$/, '') + '. (Nouvelle petite affaire proposée.)';
    },
    function (c) {      /* un allié donne des nouvelles */
      var al = (c.pnj || []).filter(function (x) { return x.attitude === 'allié'; }); if (!al.length) return null;
      var x = p(al), ru = COF.Aventure.rumeur(); K().ajouterListe(c, 'fils', { nom: ru.nom, note: x.nom + ' l’a fait savoir au héros.\n' + ru.texte });
      return '✉️ Une lettre de ' + x.nom + ' : il est question de ' + ru.nom.replace(/^Rumeur : /, '').toLowerCase() + '. (Nouveau fil.)';
    },
    function (c) {      /* un ennemi agit */
      var en = (c.pnj || []).filter(function (x) { return x.attitude === 'hostile'; }); if (!en.length) return null;
      var x = p(en); c.tension = Math.min(9, c.tension + 1); x.vus = (x.vus || 0) + 1;
      return '⚠️ On rapporte que ' + x.nom + ' répand des mensonges sur le héros et cherche à lui nuire. (Tension +1.)';
    },
    function (c) {      /* un village voisin a besoin d'aide */
      var vs = (c.lieux || []).filter(function (l) { return l.ville && l.id !== c.position; }); if (!vs.length) return null;
      var l = p(vs);
      c.offreMission = generer(c);
      c.offreMission.v.lieuId = l.id; var fo = T().formes(l.nom);
      c.offreMission.v.lieuM_n = fo.n; c.offreMission.v.a_lieuM = fo.a; c.offreMission.v.de_lieuM = fo.de;
      c.offreMission.titre = T().dire(TYPES[c.offreMission.type].titre, Object.assign({}, c.offreMission.v, { _vus: null }));
      c.offreMission.accroche = T().dire(TYPES[c.offreMission.type].accroche, Object.assign({ h: 'le héros' }, c.offreMission.v));
      return '🏘️ ' + l.nom + ' appelle à l’aide : ' + c.offreMission.accroche.replace(/\.$/, '') + '.';
    },
    function (c) {      /* une rumeur se confirme ou se dément */
      var fl = (c.fils || []).filter(function (f) { return f.ouvert && !f.quete && !f.mission; }); if (!fl.length) return null;
      var f = p(fl);
      if (Math.random() < 0.5) { f.note = (f.note || '') + '\nJour ' + c.jour + ' : de nouveaux témoignages confirment l’affaire.'; return '🧵 Des témoins confirment « ' + f.nom + ' » : la piste se précise.'; }
      f.ouvert = false; return '🧵 « ' + f.nom + ' » n’était qu’une fausse rumeur. Le fil est abandonné.';
    },
    function (c) {      /* un cadeau d'un village reconnaissant */
      var vs = (c.lieux || []).filter(function (l) { return l.ville && (l.ville.rep || 0) >= 2; }); if (!vs.length) return null;
      var l = p(vs), po = d(6) + T().niveau(c); T().payer(c, po);
      return '🎁 Les habitants ' + T().formes(l.nom).de + ' envoient un présent pour remercier le héros : ' + po + ' po.';
    },
    function (c) {      /* un compagnon raconte un souvenir : loyauté */
      var cps = (c.pnj || []).filter(function (x) { return x.compagnon && x.compagnon.actif; }); if (!cps.length) return null;
      var x = p(cps); x.compagnon.loyaute = Math.min(10, (typeof x.compagnon.loyaute === 'number' ? x.compagnon.loyaute : 5) + 1);
      return '🔥 Au bivouac, ' + x.nom + ' confie ' + p(['un souvenir d’enfance', 'un vieux regret', 'un rêve étrange', 'la raison de son départ']) + '. Les liens se resserrent (loyauté ' + x.compagnon.loyaute + '/10).';
    },
    function (c) {      /* un avis de recherche */
      var po = (d(6) + 4) * T().niveau(c);
      c.offreMission = generer(c);
      return '📜 Un avis de recherche est cloué sur un arbre : une prime de ' + po + ' po pour qui réglera une affaire. ' + c.offreMission.accroche;
    },
    function (c) {      /* le temps change, la saison avance */
      if (COF.Saisons) return COF.Saisons.nouvelle(c);
      return p(['🍂 Les feuilles tombent : la saison change, les routes deviennent boueuses.', '❄️ Les premières gelées blanchissent les champs au matin.',
        '🌸 Le printemps éclate partout ; les chemins se remplissent de voyageurs.', '☀️ Une vague de chaleur écrase la région ; les puits baissent.']);
    }
  ];
  NOUVELLES.push(function (c) { return COF.Factions ? COF.Factions.represailles(c) : null; });
  /* Une affaire acceptée n'attend pas indéfiniment : au bout de 5 jours, elle est perdue. */
  function expirer(c) {
    return ouvertes(c).filter(function (f) { return c.jour - (f.mission.jour || c.jour) > 5; }).map(function (f) {
      f.ouvert = false;
      var lieu = f.mission.v.lieuId ? M().lieu(c, f.mission.v.lieuId) : null, t = '⌛ Trop tard pour « ' + f.nom.replace(/^📌 /, '') + ' » : quelqu’un d’autre s’en est chargé, ou le pire est arrivé.';
      if (COF.Saga && lieu && lieu.ville) { var r = COF.Saga.changerRep(lieu, -1); if (r) t += ' ' + r; }
      if (COF.Echos && lieu) COF.Echos.noter(c, 'rancoeur', { lieuId: lieu.id });
      return t;
    });
  }
  function nouvelles(c) {
    if (Math.random() > 0.35) return null;
    var l = NOUVELLES.slice().sort(function () { return Math.random() - 0.5; });
    for (var i = 0; i < l.length; i++) { var n = l[i](c); if (n) return n; }
    return null;
  }

  if (COF.Conteur) enregistrer();
  return { TYPES: TYPES, generer: generer, offre: offre, propositions: propositions, accepter: accepter, contexte: contexte,
    preparer: preparer, conclure: conclure, nouvelles: nouvelles, expirer: expirer, ouvertes: ouvertes };
})();
