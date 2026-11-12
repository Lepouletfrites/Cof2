/* ============================================================
   COF2 Compagnon — Compagnons vivants (mode aventure)
   Chaque compagnon recruté reçoit un rôle (qui l'aide sur certains
   jets : l'éclaireur sur la perception, l'érudit sur le savoir…) et
   un tempérament (jovial, bourru, prudent, téméraire, pieux, cynique)
   qui lui donne ses répliques selon la situation et ses goûts : il
   approuve ou désapprouve les choix du héros, et sa loyauté bouge.
   ============================================================ */
window.COF = window.COF || {};

COF.Troupe = (function () {
  function p(l) { return l[Math.floor(Math.random() * l.length)]; }
  function T() { return COF.Conteur; }

  var ROLES = {
    combattant: { nom: 'combattant', ic: '⚔️', caracs: ['FOR', 'CON'] },
    tireur: { nom: 'tireur', ic: '🏹', caracs: ['AGI', 'PER'] },
    mystique: { nom: 'mystique', ic: '🔮', caracs: ['VOL', 'INT'] },
    eclaireur: { nom: 'éclaireur', ic: '🧭', caracs: ['PER', 'AGI'] },
    erudit: { nom: 'érudit', ic: '📚', caracs: ['INT'] },
    orateur: { nom: 'beau parleur', ic: '🎭', caracs: ['CHA'] },
    guerisseur: { nom: 'guérisseur', ic: '🌿', caracs: ['VOL'], soigne: true }
  };
  /* Tempéraments : répliques par situation, actions aimées / détestées. */
  var TEMPS = {
    jovial: { nom: 'jovial', aime: ['flaner', 'loisir', 'soi', 'flatter', 'parlementer'], deteste: ['menacer', 'intimider'],
      dit: {
        ouverture: ['{x} sifflote un air de taverne : « Allez, ça ne peut pas être pire qu’hier ! »', '{x} raconte une blague idiote. {h} ne peut s’empêcher de sourire.', '« Tu crois qu’on mangera chaud, ce soir ? » demande {x}, plein d’espoir.'],
        succes: ['{x} donne une grande claque dans le dos de {h} : « Ça, c’est fait ! »', '« Je le savais ! » s’esclaffe {x}.'],
        echec: ['« Bah, on en rira plus tard », lance {x}, sans trop y croire.', '{x} grimace, puis hausse les épaules : « Ça arrive aux meilleurs. »'],
        danger: ['Pour une fois, {x} ne plaisante plus.', '{x} rit un peu trop fort, pour se donner du courage.'],
        ville: ['{x} a déjà repéré la taverne la plus proche.', '« Une ville ! De la bière, de la musique ! » se réjouit {x}.'],
        nuit: ['{x} chante doucement près du feu.', '{x} s’endort le premier, en ronflant comme un soufflet de forge.'] } },
    bourru: { nom: 'bourru', aime: ['forcer', 'combat', 'marcher'], deteste: ['flatter', 'flaner', 'negocier'],
      dit: {
        ouverture: ['{x} grommelle quelque chose d’inaudible.', '« Moins on parle, plus on avance », bougonne {x}.', '{x} crache par terre et ajuste son paquetage.'],
        succes: ['{x} hoche la tête. Venant de {xlui}, c’est un compliment.', '« Pas mal », lâche {x}. C’est tout.'],
        echec: ['« Je l’avais dit », marmonne {x}.', '{x} lève les yeux au ciel.'],
        danger: ['{x} serre son arme sans un mot.', '« Enfin un peu d’action », grogne {x}.'],
        ville: ['{x} déteste la foule et le fait savoir.', '« Trop de monde. Trop de bruit. »'],
        nuit: ['{x} prend le premier tour de garde sans qu’on lui demande.', '{x} affûte sa lame en silence, tard dans la nuit.'] } },
    prudent: { nom: 'prudent', aime: ['prudence', 'guetter', 'savoir', 'temps', 'orienter'], deteste: ['forcer', 'menacer', 'tricher'],
      dit: {
        ouverture: ['{x} vérifie deux fois les sangles de son sac.', '« Restons sur nos gardes », murmure {x}.', '{x} observe longuement les environs avant de faire un pas.'],
        succes: ['« Tu vois, quand on prend son temps… » sourit {x}.', '{x} soupire de soulagement.'],
        echec: ['« On aurait dû attendre », reproche {x} à voix basse.', '{x} secoue la tête, inquiet{xe}.'],
        danger: ['{x} tire {h} par la manche : « Il est encore temps de faire demi-tour. »', '{x} a déjà repéré une issue de secours.'],
        ville: ['{x} garde une main sur sa bourse dans la foule.', '« Méfie-toi des sourires trop larges, ici. »'],
        nuit: ['{x} dort d’un œil, l’arme à portée de main.', '{x} dispose des brindilles autour du camp, pour entendre venir.'] } },
    temeraire: { nom: 'téméraire', aime: ['forcer', 'combat', 'menacer', 'pister'], deteste: ['prudence', 'temps', 'fuir'],
      dit: {
        ouverture: ['« Qu’est-ce qu’on attend ? » s’impatiente {x}.', '{x} part devant, comme toujours.', '{x} fait tourner son arme entre ses doigts, impatient{xe}.'],
        succes: ['« Encore ! » s’exclame {x}, les yeux brillants.', '{x} éclate d’un rire sauvage.'],
        echec: ['« La prochaine fois, on fonce ! » enrage {x}.', '{x} frappe du poing contre un mur.'],
        danger: ['{x} sourit. Enfin quelque chose d’intéressant.', '« Laisse-les venir ! » crie {x}.'],
        ville: ['{x} cherche déjà quelqu’un à défier.', '« On s’ennuie, en ville. »'],
        nuit: ['{x} ne tient pas en place et fait les cent pas autour du feu.', '{x} raconte ses exploits, très exagérés.'] } },
    pieux: { nom: 'pieux', aime: ['apaiser', 'aider', 'soi', 'service', 'offrande'], deteste: ['menacer', 'tricher', 'voler'],
      dit: {
        ouverture: ['{x} murmure une courte prière avant de partir.', '{x} touche son amulette sacrée.', '« Que les dieux veillent sur nous », dit {x}.'],
        succes: ['« Les dieux sont avec nous », souffle {x}.', '{x} lève les yeux au ciel, reconnaissant{xe}.'],
        echec: ['« C’est une épreuve, rien de plus », assure {x}.', '{x} prie à voix basse.'],
        danger: ['{x} récite une litanie protectrice.', '« Ne crains rien : nous ne sommes pas seuls. »'],
        ville: ['{x} s’arrête au premier temple pour se recueillir.', '{x} donne une pièce à un mendiant.'],
        nuit: ['{x} prie longuement sous les étoiles.', '{x} veille sur le sommeil de {h}.'] } },
    cynique: { nom: 'cynique', aime: ['negocier', 'reclamer', 'tricher', 'menacer', 'gagne'], deteste: ['service', 'aider', 'offrande', 'soi'],
      dit: {
        ouverture: ['« Et ça rapporte combien, cette fois ? » demande {x}.', '{x} ricane : « Héroïque, vraiment. »', '{x} compte ses pièces, l’air ennuyé.'],
        succes: ['« Pas mal. Pour un amateur. »', '{x} applaudit lentement, ironique{xe}.'],
        echec: ['« Quelle surprise », soupire {x}.', '{x} ne dit rien, mais son sourire en dit long.'],
        danger: ['« Si je meurs, je garde ma part », prévient {x}.', '{x} évalue déjà par où fuir.'],
        ville: ['{x} repère les bourses mal attachées.', '« Une ville, c’est une forêt avec plus de loups. »'],
        nuit: ['{x} dort, la main sur sa bourse.', '{x} fixe le feu sans rien dire, perdu{xe} dans de vieux souvenirs.'] } }
  };

  function actifs(c) { return (c.pnj || []).filter(function (x) { return x.compagnon && x.compagnon.actif; }); }
  /* Rôle et tempérament (créés au besoin). */
  function profil(x) {
    var cp = x.compagnon; if (!cp) return x;
    if (!ROLES[cp.talent]) cp.talent = ROLES[cp.role] && Math.random() < 0.4 ? cp.role : p(Object.keys(ROLES));   /* talent de récit (le rôle de combat reste celui de l'Arène) */
    if (!TEMPS[cp.temp]) cp.temp = p(Object.keys(TEMPS));
    if (typeof cp.loyaute !== 'number') cp.loyaute = 6;
    return x;
  }
  function ctxDe(ctx, x) { var f = x.genre === 'féminin'; return Object.assign({}, ctx, { x: x.nom, xe: f ? 'e' : '', xil: f ? 'elle' : 'il', xlui: f ? 'elle' : 'lui' }); }
  /* Une réplique d'un compagnon pour une situation (ou ''). */
  function replique(c, situation, ctx, chance) {
    var l = actifs(c); if (!l.length || Math.random() > (chance === undefined ? 0.4 : chance)) return '';
    var x = profil(p(l)), t = TEMPS[x.compagnon.temp].dit[situation]; if (!t) return '';
    return T().dire(t, ctxDe(ctx, x));
  }
  /* Le spécialiste de cette caractéristique, s'il y en a un. */
  function specialiste(c, carac) {
    var l = actifs(c).map(profil).filter(function (x) { return ROLES[x.compagnon.talent].caracs.indexOf(carac) >= 0; });
    return l.length ? p(l) : null;
  }
  /* Un guérisseur dans le groupe ? (soins après un coup dur) */
  function guerisseur(c) { var l = actifs(c).map(profil).filter(function (x) { return ROLES[x.compagnon.talent].soigne; }); return l.length ? l[0] : null; }
  /* Le compagnon réagit au choix du héros : loyauté ±1 (de temps en temps). */
  function reagir(c, id, ctx) {
    if (!id) return '';
    var notes = [];
    actifs(c).map(profil).forEach(function (x) {
      var tp = TEMPS[x.compagnon.temp], cp = x.compagnon, cx = ctxDe(ctx || {}, x);
      if (tp.aime.indexOf(id) >= 0 && Math.random() < 0.35) {
        cp.loyaute = Math.min(10, cp.loyaute + 1);
        notes.push({ txt: T().dire(['{x} approuve d’un signe de tête.', '{x} sourit : voilà qui {xlui} plaît.', 'Le regard de {x} brille d’approbation.'], cx), m: '💛 ' + x.nom + ' approuve (loyauté ' + cp.loyaute + '/10)' });
      } else if (tp.deteste.indexOf(id) >= 0 && Math.random() < 0.45) {
        cp.loyaute = Math.max(0, cp.loyaute - 1);
        notes.push({ txt: T().dire(['{x} fronce les sourcils.', '{x} détourne le regard, visiblement contrarié{xe}.', '« Ce n’est pas comme ça que je fais les choses », souffle {x}.'], cx), m: '😒 ' + x.nom + ' désapprouve (loyauté ' + cp.loyaute + '/10)' });
        if (cp.loyaute <= 1) { cp.actif = false; x.attitude = 'neutre'; notes.push({ txt: T().dire('{x} rassemble ses affaires : « Nos chemins se séparent ici. »', cx), m: '👋 ' + x.nom + ' quitte le groupe' }); }
      }
    });
    return notes;
  }
  function lib(x) { profil(x); var r = ROLES[x.compagnon.talent], t = TEMPS[x.compagnon.temp]; return r.ic + ' ' + r.nom + ' · ' + t.nom; }
  return { ROLES: ROLES, TEMPS: TEMPS, actifs: actifs, profil: profil, replique: replique, specialiste: specialiste, guerisseur: guerisseur, reagir: reagir, lib: lib };
})();
