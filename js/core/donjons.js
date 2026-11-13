/* ============================================================
   COF2 Compagnon — Donjons plus riches (mode aventure)
   Chaque salle peut cacher quelque chose : un piège à désamorcer,
   une énigme gravée, un passage secret, un coffre verrouillé (crocheter
   ou forcer), un autel ancien, une bibliothèque moisie. Le butin grossit
   avec la profondeur. Et à tout moment, on peut choisir de remonter
   avec ce qu'on a trouvé, ou pousser plus loin pour le trésor du fond.
   ============================================================ */
window.COF = window.COF || {};

COF.Donjons = (function () {
  function p(l) { return l[Math.floor(Math.random() * l.length)]; }
  function d(n) { return 1 + Math.floor(Math.random() * n); }
  function T() { return COF.Conteur; }

  var TRAITS = [['piege', 3], ['enigme', 2], ['secret', 2], ['coffre', 3], ['autel', 1], ['bibli', 1], ['rien', 3]];
  var DESCR = {
    piege: ['Des dalles plus claires que les autres dessinent un chemin trop évident ; des trous minuscules percent les murs.', 'Un fil presque invisible barre le passage à hauteur de cheville.', 'Le plafond est hérissé de pointes rouillées, et le sol porte des rainures suspectes.'],
    enigme: ['Une porte de pierre sans poignée porte une inscription : « {q} »', 'Au centre de la salle, une statue tend la main. Sur son socle, gravé : « {q} »'],
    secret: ['Un courant d’air glacé filtre d’un mur pourtant plein.', 'Une des torchères est fixée de travers, comme si on l’avait souvent manipulée.', 'Les traces de pas s’arrêtent net devant un mur.'],
    coffre: ['Dans un renfoncement repose un coffre bardé de fer, fermé d’un lourd cadenas.', 'Un coffre vermoulu, mais à la serrure étonnamment neuve, attend contre le mur.'],
    autel: ['Un autel ancien occupe le fond de la salle ; une lueur pâle danse au-dessus.', 'Des offrandes poussiéreuses entourent un autel couvert de symboles oubliés.'],
    bibli: ['Des étagères pourries ploient sous des livres moisis ; certains semblent encore lisibles.', 'Un pupitre supporte un grimoire ouvert, ses pages agitées par un souffle venu de nulle part.'],
    rien: []
  };
  /* Énigmes originales : une question, une réponse. */
  var ENIGMES = [
    { q: 'Plus on m’en prend, plus je deviens grand.', r: 'un trou' },
    { q: 'Je parle sans bouche et j’entends sans oreilles ; le vent me donne vie.', r: 'l’écho' },
    { q: 'On me brise sans me toucher, d’un seul mot.', r: 'le silence' },
    { q: 'Je dévore tout : fer, pierre, rois et royaumes, et pourtant je n’ai pas de dents.', r: 'le temps' },
    { q: 'Plus je sèche, plus je suis mouillée.', r: 'une serviette' },
    { q: 'J’ai des villes sans maisons, des forêts sans arbres, des rivières sans eau.', r: 'une carte' },
    { q: 'Je te suis le jour, je disparais la nuit, et la lumière me fait naître.', r: 'l’ombre' },
    { q: 'Je monte et je descends sans jamais bouger.', r: 'un escalier' },
    { q: 'Je suis à toi, mais les autres s’en servent plus que toi.', r: 'ton nom' }
  ];
  function tirer() { var t = TRAITS.reduce(function (n, x) { return n + x[1]; }, 0), r = Math.random() * t; for (var i = 0; i < TRAITS.length; i++) { r -= TRAITS[i][1]; if (r <= 0) return TRAITS[i][0]; } return 'rien'; }
  /* Aménage la salle courante ; renvoie une phrase pour le récit (ou ''). */
  function amenager(c, s) {
    var dj = s && s.donjon; if (!dj || !dj.salle || dj.salle.trait) return '';
    var t = dj.n <= 1 && Math.random() < 0.3 ? 'rien' : tirer(), tr = { type: t, fait: false };
    if (t === 'enigme') tr.enigme = p(ENIGMES);
    dj.salle.trait = tr;
    if (t === 'rien') return '';
    return T().dire(DESCR[t], Object.assign(T().contexte(c, s), { q: tr.enigme ? tr.enigme.q : '' }));
  }
  function trait(s) { return s && s.donjon && s.donjon.salle && s.donjon.salle.trait; }
  function a(type) { return function (c, s) { var t = trait(s); return !!(t && t.type === type && !t.fait); }; }
  function outils(c) { var h = T().heros(c); return !!(h && (h.inventaire || []).some(function (o) { return /crochet/i.test(o.nom); })); }

  var ACTIONS = {
    desamorcer: { nom: 'Désamorcer le piège', carac: 'AGI', effet: 'djFait', si: a('piege'), prioritaire: true,
      ok: ['D’une main sûre, {h} bloque le mécanisme : un déclic, puis plus rien. Le passage est sûr.', '{h} repère le déclencheur et le neutralise avec la pointe de sa lame.'],
      ko: ['Clac ! Le piège se déclenche au nez de {h}.', 'Le mécanisme est plus retors que prévu : une volée de dards siffle dans la salle.'] },
    resoudre: { nom: 'Répondre à l’énigme', carac: 'INT', effet: 'djEnigme', si: a('enigme'), prioritaire: true,
      ok: ['{h} réfléchit, puis prononce : « {reponse} ». La pierre gronde ; le passage s’ouvre, révélant une niche secrète.', '« {reponse} », souffle {h}. Un mécanisme ancien se met en branle.'],
      ko: ['{h} tente une réponse… La pierre reste muette, et quelque part, quelque chose s’éveille.', 'Mauvaise réponse. Un grondement sourd parcourt la salle.'] },
    fouillerMurs: { nom: 'Chercher le passage secret', carac: 'PER', effet: 'djButin', si: a('secret'), prioritaire: true,
      ok: ['Une pierre s’enfonce sous les doigts de {h} : un pan de mur pivote sur une cache oubliée.', '{h} tire la torchère de travers : un déclic, et une niche s’ouvre dans le mur.'],
      ko: ['{h} tâte chaque pierre, en vain.', 'Rien. Le mur garde son secret.'] },
    crocheter: { nom: function (ctx) { return 'Crocheter la serrure du coffre'; }, carac: 'AGI', effet: 'djButin', si: a('coffre'), prioritaire: true,
      diffFn: function (c) { return outils(c) ? -2 : 3; }, aide: '',
      ok: ['Quelques secondes de patience, un cliquetis : le cadenas cède.', 'La serrure résiste, puis s’avoue vaincue. Le couvercle grince.'],
      ko: ['Le crochet casse net dans la serrure.', 'La serrure est trop bien faite pour {h}.'] },
    forcerCoffre: { nom: 'Forcer le coffre', carac: 'FOR', effet: 'djButinBruit', si: a('coffre'), prioritaire: true, diff: 1,
      ok: ['Un grand coup, le bois éclate : le coffre est ouvert. Mais le vacarme a résonné loin dans les couloirs.', '{h} fait sauter les charnières à coups de pommeau. Bruyant, mais efficace.'],
      ko: ['Le coffre ne bouge pas d’un pouce, et le vacarme a résonné loin.', '{h} s’épuise contre le fer et le chêne.'] },
    prierAutel: { nom: 'S’approcher de l’autel', carac: 'VOL', effet: 'djAutel', si: a('autel'), prioritaire: true,
      ok: ['Une chaleur bienfaisante envahit {h} : l’autel accorde sa bénédiction.', 'La lueur se pose sur l’épaule de {h}. Les blessures se referment.'],
      ko: ['Une voix glaciale murmure des mots interdits ; {h} recule, le souffle coupé.', 'L’autel rejette {h} d’une décharge douloureuse.'] },
    lireGrimoire: { nom: 'Déchiffrer les vieux livres', carac: 'INT', effet: 'djSavoir', si: a('bibli'), prioritaire: true,
      ok: ['Entre deux pages rongées, {h} trouve un plan des lieux annoté de la main d’un ancien explorateur.', 'Un journal de bord, presque intact : son auteur décrit ce qui attend plus bas.'],
      ko: ['Les pages tombent en poussière entre les doigts de {h}.', 'Une langue morte, que {h} ne sait pas lire.'] },
    remonter: { nom: 'Remonter avec le butin', auto: true, effet: 'djRemonter', fin: true, prioritaire: true, aide: 'garder ce qu’on a trouvé, renoncer au trésor du fond',
      si: function (c, s) { return !!(s && s.donjon && s.donjon.n >= 2); },
      ok: ['{h} juge qu’il est temps de rebrousser chemin, tant que la chance tient. Le fond attendra.', 'Sagement, {h} remonte vers la lumière, la besace plus lourde qu’à l’aller.'] }
  };
  function butin(c, s, mult) {
    var n = (s.donjon.n || 1), po = Math.round((d(6) + n) * T().niveau(c) * (mult || 1)), out = [T().payer(c, po)];
    s.donjon.butin = (s.donjon.butin || 0) + po;
    if (COF.Recompense && Math.random() < 0.15 + 0.08 * n) {
      var m = COF.Recompense.tirerObjetLivre(T().niveau(c), p(['potion', 'potion', 'objet'])), h = T().heros(c);
      if (m && h) { COF.Store.ajouterObjet(h, Object.assign({}, m.item, { nom: '✨ ' + m.item.nom, qte: 1 })); COF.Store.sauver(h); out.push('🎒 ' + m.nom); }
    }
    return out.join(' · ');
  }
  function effet(c, s, ac, ctx) {
    var t = trait(s);
    switch (ac.effet) {
      case 'djFait': if (t) t.fait = true; return 'piège désamorcé';
      case 'djEnigme': if (t) { t.fait = true; ctx.reponse = t.enigme ? t.enigme.r : '…'; } return butin(c, s, 1.5);
      case 'djButin': if (t) t.fait = true; return butin(c, s, 1);
      case 'djButinBruit': if (t) t.fait = true; s.jeu.danger = Math.min(s.jeu.dangerMax - 1, s.jeu.danger + 1); return butin(c, s, 1) + ' · danger +1 (bruit)';
      case 'djAutel': if (t) t.fait = true; var h = T().heros(c); if (h) { var av = h.pv; h.pv = Math.min(COF.Calc.pvMax(h), (h.pv || 0) + d(6) + T().niveau(c)); COF.Store.sauver(h); return '+' + (h.pv - av) + ' PV'; } return '';
      case 'djSavoir': if (t) t.fait = true; s.jeu.bonus = true; s.jeu.danger = Math.max(0, s.jeu.danger - 1); return 'dé bonus · danger −1';
      case 'djRemonter': s.donjon.remonte = true; return s.donjon.butin ? 'butin gardé : ' + s.donjon.butin + ' po en tout' : 'retour à la surface';
    }
    return '';
  }
  /* Échecs : l'énigme ratée ou le coffre trop solide restent là ; la salle suivante viendra. */
  function enregistrer() {
    var A = T().ACTIONS, G = T().GENRES.donjon;
    Object.keys(ACTIONS).forEach(function (id) { A[id] = ACTIONS[id]; if (G.actions.indexOf(id) < 0) G.actions.push(id); });
  }
  if (COF.Conteur) enregistrer();
  return { ACTIONS: ACTIONS, ENIGMES: ENIGMES, amenager: amenager, trait: trait, effet: effet, enregistrer: enregistrer };
})();
