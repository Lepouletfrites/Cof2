/* ============================================================
   COF2 Compagnon — Saga : l'histoire de fond de l'aventure solo
   - Le grand méchant : une menace (culte, nécromancien, dragon,
     seigneur de guerre…) avec un but et une horloge (0 → 8). Elle
     avance quand les jours passent et quand le héros échoue ; elle
     recule quand il déjoue ses plans. Certaines quêtes lui sont
     liées : les réussir donne des indices. Deux indices (ou une
     menace trop avancée) révèlent son repaire, et la quête finale
     « Vaincre … » apparaît. Si l'horloge atteint 8, la menace
     touche au but : la tension est au maximum.
   - Rumeurs : enquêter sur une rumeur mène à quelque chose de
     concret (quête, lieu, allié, indice sur la menace).
   - Réputation : chaque village se souvient du héros (−3 à +3).
   ============================================================ */
window.COF = window.COF || {};

COF.Saga = (function () {
  function p(l) { return l[Math.floor(Math.random() * l.length)]; }
  function d(n) { return 1 + Math.floor(Math.random() * n); }
  function K() { return COF.Carnet; }
  function M() { return COF.Monde; }
  function AV() { return COF.Aventure; }
  function T() { return COF.Conteur; }
  function D() { return COF.Directeur; }

  var MENACES = [
    { type: 'culte', noms: ['le Culte de la Lune Noire', 'la Confrérie des Cendres', 'la Secte du Ver Aveugle', 'l’Ordre du Soleil Mort'], chefs: ['m:grand prêtre masqué', 'f:prophétesse aveugle', 'm:hiérophante au visage brûlé'],
      buts: ['réveiller un dieu oublié', 'ouvrir une porte vers un autre monde', 'sacrifier une ville entière à son maître'], env: 'souterrain', repaires: ['le Temple Englouti', 'la Crypte des Murmures', 'le Sanctuaire Inversé'] },
    { type: 'necro', noms: ['le Nécromancien de Morteval', 'la Reine des Tombes', 'le Liche Sans-Nom'], chefs: ['m:nécromancien décharné', 'f:reine morte-vivante'],
      buts: ['lever une armée de morts', 'vaincre la mort elle-même', 'transformer la région en un immense cimetière'], env: 'ruines', repaires: ['la Nécropole Oubliée', 'le Donjon des Os', 'la Tour Sans Lumière'] },
    { type: 'dragon', noms: ['Vharox le Rouge', 'Sylvathra la Verte', 'le Ver de Givre'], chefs: ['m:dragon colossal', 'f:dragonne millénaire'],
      buts: ['réduire la région en cendres', 'amasser le plus grand trésor du monde', 'soumettre tous les peuples alentour'], env: 'montagne', repaires: ['le Pic Calciné', 'l’Antre de Braise', 'la Caverne aux Mille Écailles'] },
    { type: 'seigneur', noms: ['le Seigneur de Guerre Kragan', 'la Baronne Noire', 'le Prince Exilé Aldemar'], chefs: ['m:seigneur de guerre', 'f:baronne impitoyable'],
      buts: ['conquérir la région par le fer', 'reprendre un trône qu’il estime volé', 'asservir chaque village jusqu’au dernier'], env: 'plaine', repaires: ['la Forteresse Rouge', 'le Camp de la Horde', 'le Castel Brisé'] },
    { type: 'fee', noms: ['la Reine de l’Hiver', 'le Roi des Ronces', 'la Dame du Lac Sombre'], chefs: ['f:reine féerique', 'm:roi féerique aux yeux d’ambre'],
      buts: ['plonger la région dans un hiver éternel', 'enlever les enfants nés sous la lune', 'rendre la forêt aux anciens maîtres'], env: 'foret', repaires: ['le Cercle des Ronces', 'le Palais de Givre', 'l’Arbre-Monde Pourrissant'] },
    { type: 'guilde', noms: ['la Main Grise', 'le Syndicat du Corbeau', 'la Guilde des Ombres Pâles'], chefs: ['m:maître des voleurs', 'f:matriarche du crime'],
      buts: ['acheter ou faire tomber chaque notable de la région', 'contrôler toutes les routes commerciales', 'mettre la région en coupe réglée'], env: 'urbain', repaires: ['le Repaire sous les Docks', 'la Maison aux Volets Clos', 'les Égouts du Corbeau'] },
    { type: 'demon', noms: ['Azhrak l’Affamé', 'la Dame aux Mille Voix', 'le Prince des Mouches'], chefs: ['m:démon enchaîné', 'f:démone aux mille voix'],
      buts: ['briser les sceaux qui l’emprisonnent', 'corrompre toutes les âmes de la région', 'ouvrir les portes des abysses'], env: 'ruines', repaires: ['le Puits des Sceaux', 'l’Abbaye Profanée', 'la Faille Hurlante'] },
    { type: 'marais', noms: ['la Sorcière des Tourbières', 'le Roi-Crapaud', 'la Mère des Brumes'], chefs: ['f:sorcière centenaire', 'm:roi-crapaud monstrueux'],
      buts: ['noyer la région sous les eaux noires', 'répandre une peste qui change les gens en bêtes', 'voler la jeunesse de tous les enfants du pays'], env: 'marais', repaires: ['la Hutte sur Pilotis', 'l’Îlot des Pendus', 'le Cœur du Marais'] },
    { type: 'geant', noms: ['le Roi des Géants de Givre', 'la Mère des Monts', 'le Titan Enchaîné'], chefs: ['m:géant couronné de glace', 'f:géante millénaire'],
      buts: ['écraser les vallées sous la glace', 'briser ses chaînes et marcher sur les cités', 'reprendre les terres volées à son peuple'], env: 'montagne', repaires: ['la Citadelle de Glace', 'le Trône des Nuées', 'la Forge des Titans'] },
    { type: 'peste', noms: ['le Seigneur des Pustules', 'la Confrérie de la Peste Grise', 'l’Ordre du Masque Blanc'], chefs: ['m:médecin masqué', 'f:prêtresse de la pourriture'],
      buts: ['répandre une épidémie dans toute la région', 'transformer les malades en serviteurs', 'purifier le monde par la maladie'], env: 'urbain', repaires: ['le Lazaret Abandonné', 'les Catacombes Pourrissantes', 'le Moulin des Masques'] },
    { type: 'pirates', noms: ['la Flotte du Corsaire Rouge', 'la Bande des Pillards des Brumes', 'la Reine des Récifs'], chefs: ['m:capitaine borgne', 'f:reine pirate aux dents d’or'],
      buts: ['piller chaque port de la côte', 'couler la flotte du roi', 'retrouver le trésor englouti d’un empire'], env: 'marais', repaires: ['la Crique aux Épaves', 'le Navire Fantôme', 'l’Île du Crâne'] },
    { type: 'machine', noms: ['l’Automate Souverain', 'la Forge Vivante', 'le Cœur de Bronze'], chefs: ['m:automate pensant', 'f:inventrice folle'],
      buts: ['remplacer les vivants par des machines', 'éveiller une armée de golems', 'fondre toute la région dans sa forge'], env: 'souterrain', repaires: ['l’Usine Engloutie', 'le Labyrinthe d’Engrenages', 'la Cathédrale de Cuivre'] }
  ];
  var AVANCEES = [
    ['Des rumeurs inquiétantes circulent : on parle de {menace}.', 'Des voyageurs évoquent à mi-voix {menace}.', 'Un symbole inconnu apparaît sur les murs de {ville} : la marque de {menace}.'],
    ['À {ville}, des gens ont disparu. Tout le monde accuse {menace}.', 'Des agents de {menace} rôdent sur les routes.', '{menace} étend son ombre : les prix flambent, la peur s’installe.'],
    ['À {ville}, plus personne n’ose défier {menace}.', 'Les routes autour de {ville} ne sont plus sûres : {menace} les contrôle.', 'Des réfugiés fuient sur les routes : {menace} gagne du terrain.'],
    ['Le ciel lui-même semble s’assombrir : {menace} touche presque au but ({but}).', 'Il ne reste plus beaucoup de temps avant que {menace} ne parvienne à {but}.']
  ];
  var SIGNES = ['Un enfant dessine dans la poussière la marque de {menace}, puis s’enfuit en courant.', 'Au marché, les prix ont doublé : on dit que {menace} rançonne les routes.',
    'Un vieil homme crache par terre en entendant parler de {menace}.', 'Une maison brûlée, encore fumante : un avertissement de {menace}, murmure-t-on.',
    'Les chiens hurlent toute la nuit. Les anciens disent que {menace} approche.','Sur un mur, quelqu’un a gravé la marque de {menace}.', 'Un voyageur parle à voix basse de {menace}, puis se tait en voyant {h}.',
    'Des traces récentes rappellent que {menace} n’est jamais très loin.', 'Une affiche arrachée promet une récompense contre toute information sur {menace}.',
    'Quelque part, une cloche sonne le glas. On murmure le nom de {menace}.', 'Un corbeau aux yeux rouges observe {h}. On dit que {menace} voit par leurs yeux.'];

  function maj(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }
  function de(nom) { nom = String(nom || ''); var m = /^(le|la|les|l’) (.*)$/i.exec(nom); if (/^l’/.test(nom)) return 'de ' + nom;
    if (m) return ({ le: 'du ', les: 'des ', la: 'de la ' })[m[1].toLowerCase()] + m[2]; return /^[aeiouyàâéèêëîïôöûü]/i.test(nom) ? 'd’' + nom : 'de ' + nom; }

  /* ================= La menace ================= */
  function assurer(c) {
    if (c.saga) return c.saga;
    /* dans une campagne, la nouvelle menace n'est pas une de celles déjà vaincues */
    var deja = (c.campagne && c.campagne.menaces) || [];
    var l = MENACES.filter(function (x) { return deja.indexOf(x.type) < 0; });
    var m = p(l.length ? l : MENACES), ch = COF.Imprevus ? COF.Imprevus.np(p(m.chefs)) : { un: 'un chef', le: 'le chef' };
    c.saga = { type: m.type, nom: p(m.noms), but: p(m.buts), chef_un: ch.un, chef_le: ch.le, env: m.env, repaire: p(m.repaires),
      finale: p(FINALE_DE[m.type] || ['boss']), artefact: p(ARTEFACTS),
      horloge: 0, max: 8, indices: 0, lieu: null, queteId: null, fini: null, dernierJour: c.jour, journal: [] };
    return c.saga;
  }
  /* ================= Finales : pas toujours un chef à abattre ================= */
  var ARTEFACTS = ['une couronne de fer noir', 'un cœur de cristal qui bat encore', 'un grimoire relié de peau', 'une pierre qui boit la lumière', 'un sceptre d’os', 'un miroir fêlé où rien ne se reflète'];
  var FINALE_DE = { geant: ['siege', 'evacuation', 'boss'], peste: ['remede', 'evacuation', 'intrigue'], pirates: ['siege', 'vol', 'boss'], machine: ['vol', 'rituel', 'boss'], culte: ['rituel', 'intrigue', 'boss'], necro: ['rituel', 'siege', 'boss'], dragon: ['siege', 'vol', 'evacuation', 'boss'], seigneur: ['siege', 'alliance', 'intrigue'],
    fee: ['rituel', 'remede', 'alliance'], guilde: ['intrigue', 'vol', 'alliance'], demon: ['rituel', 'vol', 'boss'], marais: ['remede', 'evacuation', 'rituel'] };
  /* lieu : 'repaire' (dans l'antre de la menace) ou 'ville' (un lieu habité à sauver) */
  var FINALES = {
    boss: { titre: 'Vaincre {menace}', lieu: 'repaire', objectif: 'Mettre fin aux agissements {de_menace}', obstacle: 'Le repaire grouille de serviteurs {de_menace}, et chaque pas est surveillé' },
    rituel: { titre: 'Briser le rituel {de_menace}', lieu: 'repaire', objectif: 'Interrompre le grand rituel {de_menace} avant son terme', obstacle: 'Le rituel est déjà commencé et ses gardiens sont prêts à mourir pour lui' },
    siege: { titre: 'Tenir {ville} face à {menace}', lieu: 'ville', objectif: 'Défendre {ville}, assiégée par les forces {de_menace}', obstacle: 'Les assaillants sont dix fois plus nombreux que les défenseurs' },
    intrigue: { titre: 'Démasquer {menace}', lieu: 'ville', objectif: 'Prouver devant le conseil {de_ville} qui se cache derrière {menace}', obstacle: 'Les complices {de_menace} sont partout, même parmi les notables' },
    evacuation: { titre: 'Sauver les habitants {de_ville}', lieu: 'ville', objectif: 'Évacuer {ville} avant que {menace} ne s’abatte sur elle', obstacle: 'Les routes sont coupées et beaucoup refusent de partir' },
    remede: { titre: 'Le remède contre {menace}', lieu: 'repaire', objectif: 'Trouver et préparer le remède au mal répandu par {menace}', obstacle: 'L’ingrédient se trouve au cœur même du domaine {de_menace}' },
    alliance: { titre: 'Unir la région contre {menace}', lieu: 'ville', objectif: 'Réunir villages, seigneurs et guildes {a_ville} pour s’opposer à {menace}', obstacle: 'Les vieilles rancunes divisent tout le monde' },
    vol: { titre: 'Dérober le cœur du pouvoir {de_menace}', lieu: 'repaire', objectif: 'Voler {artefact}, source du pouvoir {de_menace}', obstacle: 'L’objet est gardé jour et nuit' }
  };
  function villeAuHasard(c) {
    var v = (c.lieux || []).filter(function (l) { return l.ville || l.env === 'urbain'; });
    return v.length ? p(v).nom : 'un village voisin';
  }
  function ctx(c) { var s = assurer(c); return Object.assign(T().contexte(c, K().sceneCourante(c)), { menace: s.nom, but: s.but, ville: villeAuHasard(c), chef: s.chef_le }); }
  /* La menace progresse (n > 0) ou recule (n < 0). Renvoie la note à afficher. */
  function avancer(c, n) {
    var s = assurer(c); if (s.fini) return null;
    var av = s.horloge;
    s.horloge = Math.max(0, Math.min(s.max, s.horloge + n));
    if (s.horloge === av) return null;
    var note;
    if (n < 0) note = '🌒 ' + T().dire(['{menace} subit un revers : ses plans prennent du retard.', 'Le héros a porté un coup à {menace}.'], ctx(c));
    else note = '🌑 Pendant ce temps : ' + T().dire(AVANCEES[Math.min(3, Math.floor((s.horloge - 1) / 2))], ctx(c));
    s.journal.push({ jour: c.jour, txt: note });
    if (s.horloge >= 6 && !s.lieu) note += '\n' + reveler(c, 'Les agissements de la menace sont devenus trop visibles : on sait désormais où elle se cache.');
    if (s.horloge >= s.max && !s.urgence) { s.urgence = true; c.tension = 9; note += '\n🔥 ' + T().dire('{menace} touche au but. La région entière retient son souffle : il faut agir maintenant.', ctx(c)); }
    return note;
  }
  /* Les jours passent : la menace avance d'un cran tous les trois jours. */
  function nouveauJour(c) {
    var s = assurer(c); if (s.fini) return null;
    if (c.jour - (s.dernierJour || 0) >= (chapitre(c) >= 3 ? 2 : 3)) { s.dernierJour = c.jour; return avancer(c, 1); }
    return null;
  }
  /* Un indice sur la menace (quête liée réussie, rumeur…). */
  function indice(c) {
    var s = assurer(c); if (s.fini) return null;
    s.indices++;
    var note = '🔎 ' + T().dire(['Un indice sur {menace} : on sait maintenant que son but est de {but}.', 'Un nouvel indice : {chef} est à la tête de {menace}.'], ctx(c));
    var r = avancer(c, -1); if (r) note += '\n' + r;
    if (s.indices >= 2 && !s.lieu) note += '\n' + reveler(c, 'Les indices concordent : le repaire de la menace est enfin localisé.');
    return note;
  }
  /* Le repaire apparaît sur la carte, avec la quête finale. */
  function reveler(c, pourquoi) {
    var s = assurer(c); if (s.lieu) return '';
    var fin = FINALES[s.finale] || FINALES.boss, ici = M().ici(c), l;
    if (fin.lieu === 'ville') {
      /* la finale se joue dans un lieu habité : un village connu, ou un nouveau */
      var vs = (c.lieux || []).filter(function (x) { return x.ville || x.env === 'urbain'; });
      l = vs.length ? p(vs) : (COF.Villes ? COF.Villes.decouvrir(c) : null);
      if (l && COF.Villes) COF.Villes.assurer(l);
    }
    if (!l) {
      l = M().obtenirLieu(c, maj(s.repaire.replace(/^(le |la |les |l’)/i, '')), ici, '', s.env);
      l.note = 'Repaire ' + de(s.nom) + '.';
    }
    if (ici && ici.id !== l.id && !M().route(c, ici.id, l.id)) M().relier(c, ici.id, l.id, 2 + d(2), l.env || s.env);
    s.lieu = l.id;
    var fo = T().formes(l.nom), cx = { _vus: null, menace: s.nom, de_menace: de(s.nom), ville: l.nom, de_ville: fo.de, a_ville: fo.a, artefact: s.artefact };
    var q = { commanditaire: 'Une communauté entière, représentée par un porte-parole désigné', objectif: T().dire(fin.objectif, cx),
      cible: s.chef_un + ', à la tête ' + de(s.nom), obstacle: T().dire(fin.obstacle, cx),
      complication: 'Un allié du héros a été enlevé et sert de monnaie d’échange', recompense: 'La gratitude de toute la région et un trésor digne des légendes',
      motivation: 'par désespoir, car plus personne n’ose se dresser contre la menace', lieu: { id: l.env || s.env, nom: l.nom } };
    var f = D().creerQuete(c, q, { lieu: l, etape: 1, saga: 'final', finale: s.finale, titre: T().dire(fin.titre, cx) });
    s.queteId = f.id;
    return '🏰 ' + pourquoi + ' Tout se jouera ' + fo.a + '. Quête majeure : « ' + f.nom + ' ».';
  }
  /* Quête finale réussie (amère si la scène finale a mal tourné). */
  function victoire(c) {
    var s = assurer(c); s.fini = s.amere ? 'amère' : 'vaincue'; c.tension = 1; c.jalons = (c.jalons || 0) + 1;
    return '👑 ' + T().dire(s.amere ? 'C’en est fini {de_menace}, mais à quel prix… La région panse ses plaies et se souviendra longtemps de ce que {h} a sacrifié.'
      : 'C’en est fini {de_menace}. La nouvelle se répand comme une traînée de poudre : {h} a sauvé la région. Les chansons parleront longtemps de cet exploit.', Object.assign(ctx(c), { de_menace: de(s.nom) })) +
      ' L’aventure touche à sa fin.';
  }
  /* ================= Compagnons qui progressent ================= */
  /* evt : 'quete' (quête réussie : loyauté +1), 'echec' (scène ratée : parfois −1),
     'fin' (fin d'aventure : niveau +1, loyauté +1). Renvoie les notes. */
  function compagnons(c, evt) {
    var notes = [], hP = T().heros(c), nivH = (hP && hP.niveau) || 1;
    (c.pnj || []).filter(function (x) { return x.compagnon && x.compagnon.actif; }).forEach(function (x) {
      var cp = x.compagnon;
      if (typeof cp.loyaute !== 'number') cp.loyaute = x.attitude === 'allié' ? 6 : 5;
      if (evt === 'quete') cp.loyaute = Math.min(10, cp.loyaute + 1);
      if (evt === 'echec' && Math.random() < 0.3) {
        cp.loyaute = Math.max(0, cp.loyaute - 1);
        notes.push('😟 ' + x.nom + ' doute des choix du héros (loyauté ' + cp.loyaute + '/10).');
      }
      if (evt === 'fin') {
        cp.loyaute = Math.min(10, cp.loyaute + 1);
        var av = cp.niveau || 1; cp.niveau = Math.min(nivH, av + 1);
        if (cp.niveau > av) notes.push('⬆️ ' + x.nom + ' progresse avec le héros : niveau ' + cp.niveau + '.');
      }
      /* trop de déceptions : le compagnon s'en va */
      if (cp.loyaute <= 1) { cp.actif = false; x.attitude = 'neutre'; notes.push('👋 ' + x.nom + ' ne croit plus en la cause du héros et quitte le groupe.'); return; }
      /* grande confiance : il confie une affaire personnelle (une fois) */
      if (cp.loyaute >= 8 && !cp.quetePerso && D()) {
        var f = D().creerQuete(c), q = f.quete, com = (c.pnj || []).filter(function (y) { return y.id === q.commanditaire; })[0];
        if (com) c.pnj = c.pnj.filter(function (y) { return y.id !== com.id; });
        q.commanditaire = x.id; q.comNom = x.nom; q.fem = x.genre === 'féminin'; q.perso = true;
        f.nom = 'Pour ' + x.nom + ' : ' + f.nom;
        f.note = x.nom + ' a assez confiance pour demander l’aide du héros dans une affaire personnelle.\n' + (f.note || '');
        cp.quetePerso = f.id;
        notes.push('🤝 ' + x.nom + ' a désormais toute confiance en le héros et lui confie une affaire personnelle : « ' + f.nom + ' ».');
      }
    });
    return notes;
  }

  /* ================= Serviteurs de la menace ================= */
  var SERVITEURS = {
    geant: /géant|ogre|troll|loup du givre|golem de glace|cyclope/i,
    peste: /zombie|goule|rat|nuée|pestif|vermine|nécro|âme damnée/i,
    pirates: /bandit|merrow|requin|crabe|pieuvre|calmar|mercenaire|capitaine|vétéran/i,
    machine: /golem|armure animée|arme animée|garde animé|automate|kobold|fourmi de fer/i,
    culte: /sorcier|prêtre|nécromage|démonet|âme damnée|garde du corps|assassin|chevalier des ténèbres|ombre|fanatique|cultiste|doppleganger|chien des ténèbres/i,
    necro: /squelette|zombie|goule|momie|vampir|fantôme|banshee|âme damnée|nécro|mort-vivant|hurlemort|guerrier maudit|chevalier des ténèbres|abomination|ombre|esprit/i,
    dragon: /kobold|dragon|linnorm|lézard|wyvern|drake|bébé dragon/i,
    seigneur: /orc|bandit|garde|capitaine|vétéran|milicien|hobgobelin|ogre|gnoll|worg|berserker|sergent|chevalier/i,
    fee: /fée|pixie|farfadet|dryade|nymphe|licorne|loup|sanglier|elfe|esprit|champignon|ours|centaure|lutin|hippogriffe/i,
    guilde: /assassin|bandit|voleur|garde du corps|capitaine|rat|doppleganger|sorcier|vétéran|milicien/i,
    demon: /démon|diable|molosse|cerbère|ténèbres|âme damnée|démonet|bête du chaos|gargouille|barghest|hurlemort/i,
    marais: /grenouillard|crapaud|homme-lézard|sangsue|limace|crocodile|serpent|naga|hydre|merrow|physarum|zombie|amphibe|anguille/i
  };
  function filtreServiteurs(c) {
    var s = c.saga; if (!s || s.fini || !SERVITEURS[s.type]) return null;
    var re = SERVITEURS[s.type];
    return function (cr) { return re.test(cr.nom + ' ' + (cr.type || '')); };
  }
  /* Chapitre de la campagne (1 pour une aventure isolée) : la difficulté monte. */
  function chapitre(c) { return (c && c.campagne && c.campagne.numero) || 1; }
  /* Difficulté des rencontres liées à la menace. */
  function diffMenace(c, base) {
    var ch = chapitre(c), s = c.saga, n = { ordinaire: 0, difficile: 1, mortelle: 2 }[base || 'ordinaire'] || 0;
    if (ch >= 3) n++;
    if (s && s.horloge >= 6) n++;
    return ['ordinaire', 'difficile', 'mortelle'][Math.min(2, n)];
  }

  /* ================= Fin d'aventure et campagne ================= */
  /* Épilogue procédural : bilan de l'aventure raconté. */
  function epilogue(c) {
    var s = c.saga || {}, cx = Object.assign(T().contexte(c, null), { menace: s.nom || 'la menace', de_menace: de(s.nom || 'la menace') });
    var quetes = (c.fils || []).filter(function (f) { return f.quete && f.quete.fin === 'réussie'; }).length;
    var allies = (c.pnj || []).filter(function (x) { return x.attitude === 'allié'; }).map(function (x) { return x.nom; });
    var nem = (c.pnj || []).filter(function (x) { return x.nemesis && x.attitude === 'hostile'; }).map(function (x) { return x.nom; });
    var villes = (c.lieux || []).filter(function (l) { return l.ville && (l.ville.rep || 0) >= 2; }).map(function (l) { return l.nom; });
    var L = [];
    L.push(T().dire(s.fini === 'amère' ? '{menace} n’est plus qu’un mauvais souvenir, mais la victoire a un goût de cendre.' : s.fini ? 'La menace {de_menace} est écartée, et la région respire enfin.' : 'L’aventure s’achève, même si tout n’est pas réglé.', cx));
    L.push(T().dire('En ' + (c.jour - (c.jourDebut || 1) + 1) + ' jours, {h} a mené à bien ' + quetes + ' quête' + (quetes > 1 ? 's' : '') + '.', cx));
    if (allies.length) L.push('On se souviendra de ceux qui ont marché à ses côtés : ' + allies.slice(0, 5).join(', ') + '.');
    if (villes.length) L.push('À ' + villes.slice(0, 3).join(', ') + ', on lève encore son verre en son honneur.');
    if (nem.length) L.push('Mais quelque part, ' + nem[0] + ' n’a pas dit son dernier mot.');
    L.push(T().dire(p(['Pour l’heure, {h} s’accorde un repos bien mérité.', 'Mais déjà, d’autres routes appellent {h}.', 'Une page se tourne ; une autre attend d’être écrite.']), cx));
    return L.join(' ');
  }
  /* Clôt l'aventure : épilogue, montée de niveau. Elle devient lecture seule. */
  function terminerAventure(c) {
    if (c.termine) return c.termine;
    var hP = T().heros(c), niv = null;
    if (hP && (hP.niveau || 1) < 20) {
      var av = COF.Calc.pvMax(hP); hP.niveau = (hP.niveau || 1) + 1;
      var gain = Math.max(0, COF.Calc.pvMax(hP) - av); if (hP.pv !== null && hP.pv !== undefined) hP.pv += gain;
      COF.Store.sauver(hP); niv = hP.niveau;
    }
    var notesComp = compagnons(c, 'fin');
    c.termine = { jour: c.jour, date: Date.now(), epilogue: epilogue(c) + (notesComp.length ? ' ' + notesComp.map(function (n) { return n.replace(/^\S+ /, ''); }).join(' ') : ''), niveau: niv, issue: c.saga ? c.saga.fini : null };
    c.rencontre = null; c.combat = null;
    var s = K().sceneCourante(c); if (s) { s.close = true; s.resume = s.resume || 'L’aventure s’achève.'; }
    K().sauver(c);
    return c.termine;
  }
  /* Aventure suivante de la même campagne : même héros, même monde
     (carte, PNJ, réputations), nouvelle menace. */
  function suite(c, titre) {
    var camp = c.campagne || { id: 'cp_' + c.id, nom: c.titre, numero: 1, menaces: [] };
    c.campagne = camp;
    var n = K().creer(titre || (camp.nom + ' — chapitre ' + (camp.numero + 1)), c.persoId);
    n = K().get ? K().get(n.id) || n : n;
    var copie = function (x) { return JSON.parse(JSON.stringify(x || null)); };
    ['lieux', 'routes', 'regions', 'pnj'].forEach(function (k) { n[k] = copie(c[k]) || []; });
    /* les factions et les rancunes survivent d'une aventure à l'autre */
    if (c.factions) n.factions = copie(c.factions);
    if (c.echos) n.echos = copie(c.echos.filter(function (e) { return !e.fait; }));
    n.pnj.forEach(function (x) { if (x.compagnon) x.compagnon.actif = !!x.compagnon.actif; });
    n.position = c.position; n.ressources = copie(c.ressources) || { rations: 3, torches: 2 };
    n.jour = c.jour + 7 + d(14); n.jourDebut = n.jour; n.tension = 5;
    n.conteur = { vus: [], heure: 1, meteo: null };
    n.campagne = { id: camp.id, nom: camp.nom, numero: camp.numero + 1, menaces: (camp.menaces || []).concat(c.saga ? [c.saga.type] : []) };
    n.precedent = { id: c.id, titre: c.titre, epilogue: c.termine ? c.termine.epilogue : '' };
    c.suiteId = n.id;
    K().sauver(c); K().sauver(n); K().setActif(n.id);
    return n;
  }
  /* Signe de la menace dans une ouverture de scène (de temps en temps). */
  function signe(c) {
    var s = c.saga; if (!s || s.fini || Math.random() > 0.2 + s.horloge * 0.04) return '';
    return T().dire(SIGNES, ctx(c));
  }
  /* Une quête ordinaire peut être liée à la menace. */
  function lier(c, f) {
    var s = assurer(c); if (s.fini || !f.quete || f.quete.saga) return;
    if (Math.random() < 0.4) { f.quete.saga = 'lie'; f.note = (f.note || '') + '\nDerrière cette affaire se devine la main ' + de(s.nom) + '.'; }
  }

  /* ================= Rumeurs ================= */
  function resoudreRumeur(c, f, reussite) {
    if (!reussite) {
      f.echecs = (f.echecs || 0) + 1;
      if (f.echecs >= 2) { f.ouvert = false; return '🧵 « ' + f.nom + ' » : la piste est froide. La rumeur est abandonnée.'; }
      return '🧵 « ' + f.nom + ' » : rien de concret pour l’instant, mais la piste reste ouverte.';
    }
    f.ouvert = false;
    var r = Math.random(), s = c.saga && !c.saga.fini ? c.saga : null;
    if (s && r < 0.25) return '🧵 La rumeur « ' + f.nom + ' » mène tout droit à ' + s.nom + '.\n' + indice(c);
    if (r < 0.6) {
      var q = D().creerQuete(c); q.note = 'Née de la rumeur : ' + f.nom + '.\n' + (q.note || '');
      return '🧵 La rumeur « ' + f.nom + ' » était fondée : elle devient une quête, « ' + q.nom + ' ».';
    }
    if (r < 0.85) {
      var l = T().decouvrirLieu(c);
      if (l) { l.note = 'Découvert grâce à la rumeur « ' + f.nom + ' ».'; return '🧵 La rumeur « ' + f.nom + ' » mène à ' + l.nom + ' (ajouté à la carte).'; }
    }
    var pn = AV().pnj({}), ici = M().ici(c);
    var x = K().ajouterListe(c, 'pnj', { nom: pn.nom, attitude: 'allié', note: 'Rencontré en remontant la rumeur « ' + f.nom + ' ».\n' + pn.texte });
    x.lieuId = ici ? ici.id : null; x.jour = c.jour;
    return '🧵 En remontant la rumeur « ' + f.nom + ' », le héros trouve une alliée ou un allié : ' + pn.nom + ' (ajouté aux PNJ).';
  }

  /* ================= Réputation des villages ================= */
  function reputation(l) { return l && l.ville ? (l.ville.rep || 0) : 0; }
  function changerRep(l, n) {
    if (!l || !l.ville) return '';
    var av = l.ville.rep || 0; l.ville.rep = Math.max(-3, Math.min(3, av + n));
    if (l.ville.rep === av) return '';
    return (n > 0 ? '⭐ réputation à ' : '💢 réputation à ') + l.nom + ' : ' + libRep(l.ville.rep);
  }
  function libRep(r) { return r >= 3 ? 'héros local' : r >= 1 ? 'bonne' : r === 0 ? 'inconnu' : r >= -2 ? 'mauvaise' : 'indésirable'; }
  function phraseRep(r) {
    if (r >= 2) return p(['On reconnaît {h} : des sourires, des saluts, et même un enfant qui court annoncer son arrivée.', 'Le nom de {h} circule ici avec respect.']);
    if (r === 1) return 'Quelques visages se souviennent de {h}, plutôt en bien.';
    if (r <= -2) return p(['Des regards hostiles suivent {h} : on n’a pas oublié son dernier passage.', 'Les volets se ferment au passage de {h}.']);
    if (r === -1) return 'Certains regards se font méfiants : la dernière visite de {h} a laissé des traces.';
    return '';
  }

  return { compagnons: compagnons, filtreServiteurs: filtreServiteurs, chapitre: chapitre, diffMenace: diffMenace, MENACES: MENACES, FINALES: FINALES, epilogue: epilogue, terminerAventure: terminerAventure, suite: suite, assurer: assurer, avancer: avancer, nouveauJour: nouveauJour, indice: indice, reveler: reveler, victoire: victoire,
    signe: signe, lier: lier, resoudreRumeur: resoudreRumeur, reputation: reputation, changerRep: changerRep, libRep: libRep, phraseRep: phraseRep };
})();
