/* ============================================================
   COF2 Compagnon — Directeur de jeu (aventure solo)
   Tient le rôle d'un MJ discret : il relie scènes, quêtes, PNJ,
   lieux et événements pour que l'histoire avance d'elle-même.

   Quêtes en 5 étapes (un fil du Carnet avec une structure) :
     📜 Accroche → 🔍 Sur la piste → 🌀 Complication → ⚔️ Confrontation → 🏁 Dénouement
   Chaque quête crée son commanditaire (PNJ) et son lieu (sur la
   carte, relié par une route). Chaque étape donne une scène prête
   à jouer ; la confrontation amène un combat, le dénouement verse
   la récompense.

   Prochaine scène : le directeur propose des scènes cohérentes avec
   l'état de l'aventure (étape des quêtes, lieu où se trouve le
   héros, routes, repos…).

   Événements : un événement d'histoire (test de scène, oracle,
   inspiration) agit vraiment sur la campagne : nouveau PNJ, nouveau
   fil, quête qui avance ou se complique, coup dur ou coup de chance
   appliqués au héros.
   ============================================================ */
window.COF = window.COF || {};

COF.Directeur = (function () {
  var piocher = COF.piocher;
  function K() { return COF.Carnet; }
  function M() { return COF.Monde; }
  function AV() { return COF.Aventure; }
  function d(n) { return 1 + Math.floor(Math.random() * n); }
  function maj(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }
  function min1(s) { s = String(s || ''); return s.charAt(0).toLowerCase() + s.slice(1); }
  function sansPoint(s) { return String(s || '').replace(/[.\s]+$/, ''); }
  function heros(c) { return AV() ? AV().heros(c) : null; }
  /* « de Marc », « d’Eleande » */
  /* « la Clairière… », « au Gué… » (formes du Conteur, sinon le nom seul) */
  function fl(nom) { return COF.Conteur ? COF.Conteur.formes(nom) : { n: nom, a: 'à ' + nom, de: de(nom) }; }
  function de(nom) { return /^[aeiouyàâäéèêëîïôöûü]/i.test(nom) ? 'd’' + nom : 'de ' + nom; }

  var ETAPES = [
    { id: 'accroche', nom: 'Accroche', ic: '📜' },
    { id: 'piste', nom: 'Sur la piste', ic: '🔍' },
    { id: 'complication', nom: 'Complication', ic: '🌀' },
    { id: 'confrontation', nom: 'Confrontation', ic: '⚔️' },
    { id: 'denouement', nom: 'Dénouement', ic: '🏁' }
  ];
  function fil(c, id) { return (c.fils || []).filter(function (f) { return f.id === id; })[0] || null; }
  function pnj(c, id) { return (c.pnj || []).filter(function (x) { return x.id === id; })[0] || null; }

  /* ================= Quêtes ================= */
  /* q : tirage du générateur de quêtes (facultatif). */
  /* opts (facultatif) : { lieu (lieu existant), etape, saga ('final'), titre } */
  function creerQuete(c, q, opts) {
    q = q || COF.QueteCalc.genererTout({}, {});
    opts = opts || {};
    var env = (q.lieu && q.lieu.id) || 'ruines';
    /* le commanditaire devient un PNJ (genre d'après « Un… / Une… ») */
    var fem = /^une\b/i.test(q.commanditaire);
    var pn = COF.Culture ? COF.Culture.pnj(c, { genre: fem ? 'féminin' : 'masculin' }) : AV().pnj({ genre: fem ? 'féminin' : 'masculin' });
    var ici = M().ici(c);
    var com = K().ajouterListe(c, 'pnj', { nom: pn.nom, attitude: 'neutre', peuple: pn.peuple, genre: pn.genre,
      note: 'Commanditaire — ' + sansPoint(q.commanditaire) + '.\n' + pn.texte });
    com.lieuId = ici ? ici.id : null; com.jour = c.jour;
    /* le lieu de la quête, posé sur la carte et relié à la position du héros */
    var l = opts.lieu || M().obtenirLieu(c, M().nomLieu(c, env), ici, '', env);
    if (ici && ici.id !== l.id && !M().route(c, ici.id, l.id)) M().relier(c, ici.id, l.id, 1 + d(3), env);
    var titre = opts.titre || (maj(String(q.objectif).split(/,| ou /)[0].trim()) + ' — ' + l.nom);
    if (!opts.lieu) l.note = 'Lieu de la quête « ' + titre + ' ».';
    var f = K().ajouterListe(c, 'fils', {
      nom: titre, note: COF.QueteCalc.accroche(q),
      quete: { etape: opts.etape || 0, commanditaire: com.id, comNom: com.nom, lieu: l.id, lieuNom: l.nom, env: env,
        fem: fem, objectif: q.objectif, cible: q.cible, obstacle: q.obstacle, complication: q.complication, recompense: q.recompense, revers: 0,
        saga: opts.saga || null, finale: opts.finale || null }
    });
    /* une quête ordinaire peut cacher la main du grand méchant */
    if (!opts.saga && COF.Saga) COF.Saga.lier(c, f);
    K().sauver(c);
    return f;
  }
  /* Les tables de quêtes sont écrites pour une table de jeu : « les PJ » → le héros. */
  function pj(s) { return String(s || '').replace(/l['’]un des PJ/g, 'le héros').replace(/\bdes PJ\b/g, 'du héros').replace(/\baux PJ\b/g, 'au héros').replace(/\bles PJ\b/g, 'le héros').replace(/\bPJ\b/g, 'héros'); }
  /* La scène que propose l'étape courante d'une quête. */
  function sceneDe(c, f) {
    var q = f.quete, e = q.etape;
    if (e === 0) return { titre: 'L’offre ' + de(q.comNom), attendu: q.comNom + ' expose son affaire : ' + min1(sansPoint(q.objectif)) + ' (' + sansPoint(q.cible) + '). Le héros écoute, pose ses questions et décide.' };
    if (e === 1) return { titre: 'Sur la piste, vers ' + fl(q.lieuNom).n, lieu: q.lieu, attendu: 'Le héros cherche des indices ' + fl(q.lieuNom).a + '. ' + maj(sansPoint(q.obstacle)) + '.', tests: true };
    if (e === 2) return { titre: 'Coup de théâtre', attendu: maj(sansPoint(q.complication)) + '.' };
    if (e === 3 && q.finale && q.finale !== 'boss' && COF.Conteur) return { titre: COF.Conteur.titreFinale(q), lieu: q.lieu, combat: false, attendu: 'La quête majeure se joue maintenant ' + fl(q.lieuNom).a + '. ' + maj(sansPoint(q.obstacle)) + '.' };
    if (e === 3) return { titre: 'Confrontation ' + fl(q.lieuNom).a, lieu: q.lieu, combat: true, attendu: 'Le moment de vérité : ' + min1(sansPoint(q.obstacle)) + '. Il faudra sans doute se battre.' };
    return { titre: 'Retour auprès ' + de(q.comNom), attendu: q.comNom + ' tiendra-t-' + (q.fem ? 'elle' : 'il') + ' parole ? Récompense promise : ' + min1(sansPoint(q.recompense)) + '.' };
  }
  /* Passe la quête à l'étape suivante ; renvoie le texte à noter. */
  function avancer(c, f) {
    if (!f || !f.quete) return null;
    var q = f.quete;
    q.etape++;
    if (q.etape >= ETAPES.length) return terminer(c, f);
    var sc = sceneDe(c, f);
    K().sauver(c);
    return pj('🧵 « ' + f.nom + ' » : ' + ETAPES[q.etape].ic + ' ' + ETAPES[q.etape].nom + '. ' + sc.attendu);
  }
  /* Quête menée à bien : récompense, commanditaire allié, tension −1. */
  function terminer(c, f) {
    var q = f.quete, p = heros(c);
    q.etape = ETAPES.length; q.fin = 'réussie'; f.ouvert = false;
    var com = pnj(c, q.commanditaire); if (com) com.attitude = 'allié';
    /* affaire personnelle d'un compagnon menée à bien : loyauté maximale */
    if (q.perso && com && com.compagnon) com.compagnon.loyaute = 10;
    c.tension = Math.max(1, c.tension - 1);
    c.jalons = (c.jalons || 0) + 1;
    var b = COF.Recompense.genererCoffre({ niveau: (p && p.niveau) || 1, env: q.env, richesse: 'standard' });
    if (p) AV().encaisser(p, b);
    var sagaTxt = '';
    if (COF.Saga) { var nc = COF.Saga.compagnons(c, 'quete'); if (nc.length) sagaTxt += '\n' + nc.join('\n'); }
    if (COF.Saga && q.saga === 'final') sagaTxt = '\n' + COF.Saga.victoire(c);
    else if (COF.Saga && q.saga === 'lie') sagaTxt = '\n' + (COF.Saga.indice(c) || '');
    K().sauver(c);
    return '🏆 Quête accomplie : « ' + f.nom + ' ». ' + (com ? com.nom + ' devient ' + (q.fem ? 'une alliée' : 'un allié') + ' du héros. ' : '') +
      'Récompense : ' + AV().texteButin(b) + (p ? ' (ajoutée à ' + p.nom + ').' : '.') +
      ' Jalon d’aventure n° ' + c.jalons + ' : le moment de faire progresser le héros.' + sagaTxt;
  }
  function quetesOuvertes(c) { return (c.fils || []).filter(function (f) { return f.ouvert && f.quete; }); }

  /* ================= Prochaine scène ================= */
  function propositions(c) {
    var out = [], ici = M().ici(c);
    /* la nuit tombe : trouver où dormir passe en premier */
    if (c.conteur && c.conteur.heure === 3) out.push({ type: 'nuit', ic: '🌙', titre: 'La nuit tombe : ' + (ici && (ici.ville || ici.env === 'urbain') ? 'trouver une auberge' : 'dresser le camp'), attendu: 'Dormir pour récupérer (DR, PM, PV)… mais les nuits ne sont pas toujours paisibles.' });
    /* les factions amies accordent une faveur */
    /* la fête de la saison au village */
    var szF = COF.Saisons && COF.Loisirs ? COF.Saisons.feteDispo(c) : null;
    if (szF) { var fF = COF.Loisirs.fete(c, szF.i); if (fF) out.push({ type: 'fete', ic: fF.ic, titre: fF.titre, fete: fF, attendu: 'C’est la fête de la saison (' + szF.nom + ') : tout le village est dehors. Une fois par saison.' }); }
    if (COF.Factions) COF.Factions.faveursDispo(c).slice(0, 1).forEach(function (f) { out.push({ type: 'faveur', ic: f.ic, titre: 'Demander une faveur : ' + f.nom, faction: f.id, attendu: 'La faction est ' + COF.Factions.lib(f.rep) + ' envers le héros. Une faveur tous les 3 jours.' }); });
    quetesOuvertes(c).slice(0, 3).forEach(function (f) {
      var sc = sceneDe(c, f), et = ETAPES[f.quete.etape];
      if (sc.lieu && ici && ici.id !== sc.lieu) {
        out.push({ type: 'voyage', ic: '🗺️', titre: 'Partir pour ' + fl(f.quete.lieuNom).n, lieu: sc.lieu, filId: f.id, fil: f.nom,
          attendu: 'La quête mène ' + fl(f.quete.lieuNom).a + ' (' + et.nom.toLowerCase() + ').' });
      } else out.push({ type: 'quete', ic: et.ic, titre: sc.titre, attendu: sc.attendu, filId: f.id, fil: f.nom, lieu: sc.lieu, combat: sc.combat, etape: et.nom });
    });
    /* petites affaires : celles acceptées, et une nouvelle offre */
    if (COF.Missions) COF.Missions.propositions(c).forEach(function (o) { out.push(o); });
    (c.fils || []).filter(function (f) { return f.ouvert && !f.quete && !f.mission; }).slice(0, 2).forEach(function (f) {
      out.push({ type: 'fil', ic: '🧵', titre: f.nom, filId: f.id, fil: f.nom, attendu: 'Le héros s’occupe de cette affaire' + (f.note ? ' : ' + f.note.slice(0, 120) : '.') });
    });
    if (!quetesOuvertes(c).length) out.push({ type: 'nouvelle', ic: '📜', titre: 'Une nouvelle affaire', attendu: 'Quelqu’un a besoin du héros. Le directeur crée une quête, son commanditaire et son lieu.' });
    out.push({ type: 'explorer', ic: '🧭', titre: 'Explorer ' + (ici ? 'les environs ' + fl(ici.nom).de : 'les environs'), attendu: 'Le héros explore et observe ce qui l’entoure. Rencontre et découverte possibles.' });
    if (ici && (ici.env === 'ruines' || ici.env === 'souterrain') && !ici.explore)
      out.push({ type: 'donjon', ic: '🗝️', titre: 'Explorer les profondeurs ' + fl(ici.nom).de, lieu: ici.id, attendu: 'Salle après salle : pièges, occupants… et un trésor au fond, peut-être.' });
    if (COF.Villes) COF.Villes.propositions(c).forEach(function (o) { out.push(o); });
    /* le repaire d'une bande, quand on y est */
    if (COF.Bandes) COF.Bandes.propositions(c).forEach(function (o) { out.unshift(o); });
    if (ici) M().voisins(c, ici.id).slice(0, 3).forEach(function (v) {
      if (out.some(function (o) { return o.lieu === v.lieu.id && o.type === 'voyage'; })) return;
      out.push({ type: 'voyage', ic: '🗺️', titre: 'Partir pour ' + fl(v.lieu.nom).n, lieu: v.lieu.id, attendu: v.route.jours + ' jour(s) de route.' });
    });
    out.push({ type: 'repos', ic: '🏕️', titre: 'Souffler un peu', attendu: 'Le héros se repose, soigne ses blessures et prépare la suite. Pas de rencontre.' });
    return out;
  }

  /* Prépare une scène ouverte : modification concrète si le test l'a
     modifiée, rencontre de la confrontation, découverte en exploration.
     Renvoie la liste des entrées à ajouter au récit. */
  var MODIFS = [
    function (c) { var x = (c.pnj || []).filter(function (p) { return !p.compagnon || !p.compagnon.actif; }); return x.length ? piocher(x).nom + ' est là, alors qu’on ne l’attendait pas.' : 'Quelqu’un d’inattendu est déjà sur place.'; },
    function () { return 'Le lieu n’est pas tel qu’on l’imaginait : ' + min1(sansPoint(COF.Oracle.detailSensoriel(null).detail)) + '.'; },
    function () { return 'Quelqu’un est passé ici avant le héros et a laissé des traces.'; },
    function () { return 'Le temps manque : il faut agir plus vite que prévu.'; },
    function () { return 'Un obstacle imprévu barre la route (porte close, garde, éboulement, foule…).'; },
    function (c, f) { return f && f.quete ? 'Une rumeur contredit ce que l’on croyait savoir sur « ' + f.nom + ' ».' : 'Une rumeur inquiétante circule.'; },
    function () { return 'Le temps change brutalement : ' + min1(sansPoint(AV().temps().texte)) + '.'; }
  ];
  function preparerScene(c, s, prop) {
    var entrees = [], f = s.filId ? fil(c, s.filId) : null;
    if (s.test && s.test.resultat === 'modifiee') {
      s.test.modif = piocher(MODIFS)(c, f);
    }
    if (prop && prop.type === 'quete' && prop.combat && !c.rencontre) {
      var qs = f && f.quete && f.quete.saga, S = COF.Saga, sg = c.saga;
      /* quête liée à la menace : ses serviteurs ; quête finale : le chef en personne */
      var r = AV().rencontre(c, { env: f && f.quete ? f.quete.env : null, difficulte: qs && S ? S.diffMenace(c, 'difficile') : 'difficile', style: qs === 'final' ? 'bande' : 'auto',
        theme: !!qs, chef: qs === 'final' && sg ? maj(sg.chef_le) : null });
      if (r.erreur && qs) r = AV().rencontre(c, { env: f.quete.env, difficulte: 'difficile', style: 'auto', theme: true, chef: qs === 'final' && sg ? maj(sg.chef_le) : null });
      if (!r.erreur) {
        r.test = 'Confrontation de la quête';
        if (r.reaction === 'amical' || r.reaction === 'neutre') { r.reaction = 'mefiant'; r.reactionTexte = 'Méfiantes : elles savent pourquoi le héros est là.'; }
        c.rencontre = r;
        entrees.push({ t: 'rencontre', r: r, txt: 'Confrontation : ' + r.texte });
      }
    }
    if (prop && prop.bandeId && COF.Bandes && !c.rencontre) entrees = entrees.concat(COF.Bandes.preparer(c, s, prop));
    if (prop && prop.type === 'explorer') {
      var ici = M().ici(c);
      entrees.push({ t: 'detail', txt: COF.Oracle.detailSensoriel(null).detail });
      if (ici && Math.random() < 0.4) {
        var a = Math.random() * Math.PI * 2, dest = { x: ici.x + Math.cos(a) * 30, y: ici.y + Math.sin(a) * 22 };
        var l = M().decouvrir(c, ici, dest, 0.9, null);
        if (l) { M().relier(c, ici.id, l.id, 1); entrees.push({ t: 'note', titre: '🗺️ Découverte', txt: 'En explorant, le héros découvre ' + l.nom + ' (ajouté à la carte).' }); }
      }
    }
    return entrees;
  }

  /* ================= Événements qui agissent ================= */
  function appliquer(c, ev) {
    if (!c || !ev) return null;
    var f = ev.cibleId ? fil(c, ev.cibleId) : null, x = ev.cibleId ? pnj(c, ev.cibleId) : null, p = heros(c), t;
    switch (ev.focus) {
      case 'pnjNouveau': {
        var pn = COF.Culture ? COF.Culture.pnj(c, {}) : AV().pnj({}), ici0 = M().ici(c);
        K().ajouterListe(c, 'pnj', { nom: pn.nom, note: pn.texte, attitude: pn.attitude || 'inconnu', peuple: pn.peuple, genre: pn.genre, lieuId: ici0 ? ici0.id : null, jour: c.jour });
        return 'Entre en scène : ' + pn.nom + ' (ajouté aux PNJ).';
      }
      case 'filNouveau': {
        if (Math.random() < 0.6) { var nq = creerQuete(c); return 'Nouvelle quête : « ' + nq.nom + ' » (commanditaire ' + nq.quete.comNom + ').'; }
        var ru = AV().rumeur(); K().ajouterListe(c, 'fils', { nom: ru.nom, note: ru.texte });
        return 'Nouveau fil : ' + ru.nom + '.';
      }
      case 'filAvance':
        if (f && f.quete) return avancer(c, f);
        if (f) { f.note = (f.note ? f.note + '\n' : '') + 'Jour ' + c.jour + ' : l’affaire progresse.'; return '« ' + f.nom + ' » progresse.'; }
        return null;
      case 'filRecule':
        if (f && f.quete) { f.quete.revers = (f.quete.revers || 0) + 1; return 'Revers pour « ' + f.nom + ' » : ' + (f.quete.etape < 2 ? min1(sansPoint(f.quete.complication)) : min1(sansPoint(AV().rebondissement().texte))) + '.'; }
        if (f) { f.note = (f.note ? f.note + '\n' : '') + 'Jour ' + c.jour + ' : l’affaire se complique.'; return '« ' + f.nom + ' » se complique.'; }
        return null;
      case 'filFin':
        if (f && f.quete && f.quete.etape < 3) { f.quete.etape = 3; return 'Tout se précipite pour « ' + f.nom + ' » : la confrontation approche à ' + f.quete.lieuNom + '.'; }
        return null;
      case 'pnjAgit': case 'pnjNeg': case 'pnjPos':
        if (!x) return null;
        t = ev.focus === 'pnjNeg' ? 'en difficulté, ' + (x.attitude === 'allié' ? 'l’aide du héros serait la bienvenue' : 'une occasion à saisir ?') :
          (ev.focus === 'pnjPos' ? 'la chance lui sourit' : 'passe à l’action (' + ev.action + ' ' + ev.sujet + ')');
        var fin = /[?!.]$/.test(t) ? '' : '.';
        x.note = (x.note ? x.note + '\n' : '') + 'Jour ' + c.jour + ' : ' + t + fin;
        if (ev.focus === 'pnjPos' && x.attitude === 'hostile') x.attitude = 'neutre';
        return x.nom + ' : ' + t + fin;
      case 'heroNeg': {
        var r1 = d(3);
        if (r1 === 1 && p) { var dm = d(6); if (p.pv === null || p.pv === undefined) COF.Store.reinitialiser(p); p.pv = Math.max(1, p.pv - dm); COF.Store.sauver(p); return 'Blessure : −' + dm + ' PV (' + p.pv + ' PV).'; }
        if (r1 === 2 && p) { p.bourse = p.bourse || { po: 0 }; var perte = Math.min(p.bourse.po || 0, d(4)); p.bourse.po -= perte; COF.Store.sauver(p); if (perte) return 'Une bourse percée : −' + perte + ' po.'; }
        c.tension = Math.min(9, c.tension + 1); return 'Une rumeur défavorable court sur le héros (tension +1).';
      }
      case 'heroPos': {
        var r2 = d(3);
        if (r2 === 1 && p) { var po = d(6) * Math.max(1, p.niveau || 1); p.bourse = p.bourse || { po: 0, pa: 0, pc: 0 }; p.bourse.po = (p.bourse.po || 0) + po; COF.Store.sauver(p); return 'Une bourse oubliée : +' + po + ' po.'; }
        if (r2 === 2 && COF.Conteur) return 'Un repas offert par un inconnu : ' + COF.Conteur.repas(c) + '.';
        return 'Un inconnu glisse une information précieuse au héros (dé bonus au prochain test lié).';
      }
      case 'ambiance': return sansPoint(AV().temps().texte) + '.';
      case 'lointain': return sansPoint(AV().faction().texte) + '.';
    }
    return null;
  }

  return { ETAPES: ETAPES, creerQuete: creerQuete, sceneDe: sceneDe, avancer: avancer, terminer: terminer,
    quetesOuvertes: quetesOuvertes, propositions: propositions, preparerScene: preparerScene, appliquer: appliquer };
})();
