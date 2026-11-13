/* ============================================================
   COF2 Compagnon — La vie du village (mode aventure)
   1. Événements : le village change pendant l'absence du héros
      (incendie, colporteur, caravane, foire, taxes, épidémie,
      disette, abondance). Ils pèsent sur les prix et les échoppes.
   2. Petits boulots et apprentissage : travailler chez un artisan
      pour gagner sa vie et son estime ; à force d'estime, l'artisan
      prend le héros en apprentissage (un rang de recette).
   3. Un chez-soi : louer une chambre ou acheter une maison ; dormir
      à l'abri, ranger ses affaires au coffre, aménager un atelier,
      un jardin de simples, un autel ; recevoir des visites.
   ============================================================ */
window.COF = window.COF || {};

COF.Village = (function () {
  function p(l) { return l[Math.floor(Math.random() * l.length)]; }
  function d(n) { return 1 + Math.floor(Math.random() * n); }
  function T() { return COF.Conteur; }
  function K() { return COF.Carnet; }
  function M() { return COF.Monde; }
  function E() { return COF.Echoppes; }
  function heros(c) { return T().heros(c); }
  function fmt(pa) { return E().fmt(pa); }
  function tailleRang(v) { var t = (v && v.taille) || 'village'; return /cite|capitale|metropole/.test(t) ? 4 : ({ hameau: 0, village: 1, bourg: 2, ville: 3 }[t] || 1); }

  /* ================= 1. Événements de village ================= */
  var EVTS = {
    incendie: { ic: '🔥', lib: 'Incendie', duree: [4, 8], poids: 2, cible: ['forge', 'menuisier', 'tanneur', 'bazar', 'herboriste'],
      txt: ['Un incendie a ravagé {bat} : {o} déblaie les décombres, l’échoppe restera fermée jusqu’au jour {fin}.', 'Des poutres noircies, une odeur de cendre : {bat} a brûlé. {o} jure de rouvrir au jour {fin}.'] },
    colporteur: { ic: '🛒', lib: 'Marchand ambulant', duree: [2, 4], poids: 3,
      txt: ['Une roulotte bariolée s’est installée sur la place : {o}, marchand{oe} ambulant{oe}, vend des curiosités venues de loin, jusqu’au jour {fin}.', 'Un colporteur à la voix forte vante ses merveilles sur la place : {o} repart au jour {fin}.'] },
    caravane: { ic: '🐫', lib: 'Caravane', duree: [3, 5], poids: 2,
      txt: ['Une caravane marchande fait halte au village : les étals regorgent de marchandises, et les prix baissent.', 'Des chariots chargés de ballots encombrent la grand-rue : une caravane est arrivée, et avec elle, l’abondance.'] },
    foire: { ic: '🎪', lib: 'Foire', duree: [2, 4], poids: 2,
      txt: ['C’est jour de foire ! Bateleurs, bestiaux, étals à perte de vue : tout se vend moins cher.', 'La foire bat son plein : on vient de tous les villages alentour.'] },
    taxes: { ic: '📜', lib: 'Nouvelle taxe', duree: [8, 14], poids: 2,
      txt: ['Le seigneur a levé une nouvelle taxe : les marchands la répercutent sur leurs prix, et grognent.', 'Un héraut a cloué un avis sur la porte du temple : nouvelle taxe. La colère gronde.'] },
    epidemie: { ic: '🤒', lib: 'Fièvre', duree: [5, 9], poids: 1,
      txt: ['Une fièvre court le village : on se bat pour les remèdes de l’herboriste.', 'Des maisons ont leurs volets clos : la fièvre est là. Les remèdes valent de l’or.'] },
    disette: { ic: '🌾', lib: 'Disette', duree: [6, 10], poids: 1,
      txt: ['La récolte a été mauvaise : le pain se fait rare, et cher.', 'Les greniers sont presque vides. Les vivres coûtent une fortune.'] },
    abondance: { ic: '🍎', lib: 'Belle récolte', duree: [5, 9], poids: 2,
      txt: ['La récolte a été exceptionnelle : les vivres ne coûtent presque rien.', 'Les greniers débordent ; on brade le grain et les fruits.'] }
  };
  /* Effet d'un événement sur le prix d'une catégorie (et d'un bâtiment). */
  var EFFETS = { caravane: { materiel: 0.9, '*': 0.95 }, foire: { '*': 0.85 }, taxes: { '*': 1.12 }, epidemie: { remedes: 1.45 }, disette: { vivres: 1.6 }, abondance: { vivres: 0.7 } };
  function actifs(c, l) { var v = l && l.ville; if (!v) return []; return (v.evts || []).filter(function (e) { return e.fin >= c.jour; }); }
  function multPrix(c, l, cat) {
    var m = 1;
    actifs(c, l).forEach(function (e) { var x = EFFETS[e.type]; if (x) m *= x[cat] !== undefined ? x[cat] : (x['*'] || 1); });
    /* un bâtiment incendié : ce qu'il vendait devient rare ailleurs */
    actifs(c, l).forEach(function (e) { if (e.type === 'incendie' && e.cat && e.cat === cat) m *= 1.25; });
    return m;
  }
  function ferme(c, l, b) { return actifs(c, l).filter(function (e) { return e.type === 'incendie' && e.batId === b.id; })[0] || null; }
  function tirer() { var l = Object.keys(EVTS), t = l.reduce(function (n, k) { return n + EVTS[k].poids; }, 0), r = Math.random() * t; for (var i = 0; i < l.length; i++) { r -= EVTS[l[i]].poids; if (r <= 0) return l[i]; } return l[0]; }
  var CAT_BAT = { forge: 'armes', menuisier: 'armes', tanneur: 'armures', bazar: 'materiel', herboriste: 'remedes' };
  /* Déclenche un événement dans le village (ou null). */
  function declencher(c, l, type) {
    var v = l.ville; if (!v) return null;
    var bs = E().batiments(c, l);
    type = type || tirer();
    var ev = EVTS[type], fin = c.jour + ev.duree[0] + Math.floor(Math.random() * (ev.duree[1] - ev.duree[0] + 1)), e = { type: type, debut: c.jour, fin: fin };
    if (actifs(c, l).some(function (x) { return x.type === type; })) return null;
    var cx = { bat: '', o: '', oe: '', fin: fin };
    if (type === 'incendie') {
      var cand = bs.filter(function (b) { return ev.cible.indexOf(b.type) >= 0 && !b.temp; }); if (!cand.length) return null;
      var b = p(cand); e.batId = b.id; e.cat = CAT_BAT[b.type]; cx.bat = E().formes(b.nom).n; cx.o = b.owner.prenom;
    }
    if (type === 'colporteur') {
      var bc = E().creerTemp(c, l, 'colporteur', fin); e.batId = bc.id; cx.o = bc.owner.nom; cx.oe = bc.owner.genre === 'féminin' ? 'e' : '';
    }
    if (type === 'caravane') { var bz = bs.filter(function (b) { return b.type === 'bazar'; })[0]; if (bz) bz.stockJour = -99; }   /* les étals se remplissent */
    v.evts = (v.evts || []).filter(function (x) { return x.fin >= c.jour - 10; }).concat([e]);
    v.dernierEvt = c.jour;
    e.txt = T().polir(T().ex(ev.txt, cx)).replace(/^./, function (m) { return m.toUpperCase(); });
    return e;
  }
  function nettoyer(c, l) {
    var v = l.ville; if (!v || !v.batiments) return;
    v.batiments = v.batiments.filter(function (b) { return !b.temp || b.temp >= c.jour; });
  }

  /* ================= 3. Le chez-soi (déclaré ici : l'arrivée en a besoin) ================= */
  var PRIX_MAISON = [60, 120, 250, 500, 900];   /* en po, selon la taille du lieu */
  var AMELIOS = {
    atelier: { ic: '⚒️', nom: 'Un atelier', prix: 40, aide: 'fabriquer chez soi, sans payer de location' },
    jardin: { ic: '🌿', nom: 'Un jardin de simples', prix: 25, aide: 'des plantes à cueillir à chaque retour' },
    autel: { ic: '🕯️', nom: 'Un petit autel', prix: 30, aide: 'une bénédiction par semaine (tension −1)' },
    coffreFort: { ic: '🔒', nom: 'Un coffre renforcé', prix: 20, aide: 'personne ne touche à vos affaires' }
  };
  function logis(c) { return c.logis || null; }
  function logisIci(c, l) { var g = logis(c); return g && l && g.lieuId === l.id ? g : null; }
  function valide(c, g) { return g && (g.type === 'maison' || (g.payeJusqu || 0) >= c.jour); }

  /* À l'arrivée dans un village : événements, visites chez soi. Renvoie des notes. */
  function arrivee(c, lieuId) {
    var l = M().lieu(c, lieuId), out = []; if (!l || !l.ville) return out;
    nettoyer(c, l);
    var v = l.ville;
    if (v.dernierEvt === undefined) v.dernierEvt = c.jour;   /* première visite : le village tel qu'il est */
    else if (c.jour - v.dernierEvt >= 4 && Math.random() < 0.5) { var e = declencher(c, l); if (e) out.push(EVTS[e.type].ic + ' ' + e.txt); }
    var g = logisIci(c, l);
    if (g) {
      if (g.type === 'chambre' && !valide(c, g)) out.push('🏠 La chambre n’est plus payée : l’aubergiste garde vos affaires, le temps que vous régliez.');
      else {
        if (g.amelios && g.amelios.jardin) { var nj = Math.min(4, c.jour - (g.dernierJardin || c.jour)); if (nj > 0) { out.push(E().cueillir(c, nj) + ' au jardin'); g.dernierJardin = c.jour; } else if (!g.dernierJardin) g.dernierJardin = c.jour; }
        if (g.type === 'maison' && !(g.amelios && g.amelios.coffreFort) && (g.coffre || []).length && Math.random() < 0.12) {
          var vol = g.coffre.splice(Math.floor(Math.random() * g.coffre.length), 1)[0];
          out.push('🕳️ La porte a été forcée en votre absence : « ' + vol.nom + ' » a disparu du coffre.');
        }
        var vis = visite(c, l); if (vis) out.push(vis);
      }
    }
    K().sauver(c);
    return out;
  }
  function visite(c, l) {
    if (Math.random() > 0.35) return '';
    var al = (c.pnj || []).filter(function (x) { return !x.mort && x.attitude === 'allié' && !(x.compagnon && x.compagnon.actif); });
    if (!al.length) return '';
    var x = p(al), r = Math.random();
    if (r < 0.5) { var ru = COF.Aventure.rumeur(); K().ajouterListe(c, 'fils', { nom: ru.nom, note: x.nom + ' est passé à la maison pour le raconter.\n' + ru.texte }); return '🚪 ' + x.nom + ' frappe à votre porte, le soir venu : il est question de ' + ru.nom.replace(/^Rumeur : /, '').toLowerCase() + '. (Nouveau fil.)'; }
    if (r < 0.8) { var po = d(6); T().payer(c, po); return '🚪 ' + x.nom + ' a laissé un panier devant votre porte : du pain, du vin, et ' + po + ' po « pour le service rendu ».'; }
    return '✉️ Une lettre de ' + x.nom + ' vous attendait, glissée sous la porte.';
  }

  /* ================= 2. Petits boulots et apprentissage ================= */
  var TRAVAUX = {
    forge: { nom: 'Tirer le soufflet et frapper à l’enclume', carac: 'FOR', paie: 4, comp: 'forge' },
    herboriste: { nom: 'Trier, sécher et préparer les herbes', carac: 'INT', paie: 3, comp: 'alchimie' },
    bazar: { nom: 'Tenir le comptoir et décharger les livraisons', carac: 'CHA', paie: 3 },
    ecurie: { nom: 'Soigner et ferrer les chevaux', carac: 'CON', paie: 3 },
    tanneur: { nom: 'Gratter et tanner les peaux', carac: 'CON', paie: 3, comp: 'façonnage' },
    menuisier: { nom: 'Raboter, scier et assembler', carac: 'AGI', paie: 3, comp: 'façonnage' },
    libraire: { nom: 'Recopier des manuscrits', carac: 'INT', paie: 5 },
    temple: { nom: 'Servir au temple et soigner les pauvres', carac: 'VOL', paie: 2 },
    alchimiste: { nom: 'Surveiller les distillations', carac: 'INT', paie: 5, comp: 'alchimie' },
    joaillier: { nom: 'Polir les gemmes et les métaux', carac: 'AGI', paie: 6, comp: 'lapidage' },
    guilde: { nom: 'Prêter main-forte aux maîtres artisans', carac: 'FOR', paie: 4 },
    colporteur: null
  };
  var MULT_TAILLE = [0.7, 0.85, 1, 1.2, 1.4];
  function travail(c, l, b) {
    var t = TRAVAUX[b.type]; if (!t) return null;
    var pj = Math.max(1, Math.round(t.paie * MULT_TAILLE[tailleRang(l.ville)] * (b.qualite === 3 ? 1.2 : 1) * (b.trait === 'genereux' ? 1.15 : b.trait === 'apre' ? 0.85 : 1)));
    return Object.assign({ paieJour: pj }, t);
  }
  function modTravail(c, t) {
    var h = heros(c), mod = COF.Calc.carac(h, t.carac);
    if (t.comp && COF.Artisanat) mod = Math.max(mod, COF.Artisanat.competence(h, t.comp).bonus);
    return mod;
  }
  /* Travailler n jours chez l'artisan. */
  function travailler(c, l, b, n) {
    var h = heros(c), t = travail(c, l, b); if (!h || !t) return { err: 'Pas de travail ici.' };
    n = Math.max(1, Math.min(5, n || 1));
    var mod = modTravail(c, t), gain = 0, reussis = 0, rates = 0, crit = false, fumble = false;
    for (var i = 0; i < n; i++) {
      var r = COF.Dice.test({ mod: mod, difficulte: 12 + (b.qualite === 3 ? 2 : 0) });
      if (r.fumble) { fumble = true; b.estime = Math.max(0, (b.estime || 0) - 1); }
      else if (r.reussite) { reussis++; gain += t.paieJour + (r.crit ? t.paieJour : 0); if (r.crit) crit = true; b.estime = (b.estime || 0) + 1; }
      else { rates++; gain += Math.floor(t.paieJour / 2); }
    }
    E().entrer(c, l, b);
    c.jour += n; c.conteur = c.conteur || {}; c.conteur.heure = 2;
    if (gain) E().crediter(h, gain);
    COF.Store.sauver(h);
    var f = b.owner.genre === 'féminin', cx = Object.assign(T().contexte(c, K().sceneCourante(c)), { o: b.owner.prenom, n: n, js: n > 1 ? 's' : '', oil: f ? 'elle' : 'il', oe: f ? 'e' : '', tache: t.nom.charAt(0).toLowerCase() + t.nom.slice(1) });
    var txt = T().dire(n > 1 ? ['{n} jours durant, {h} se lève avant l’aube pour {tache}.', 'Pendant {n} jours, {h} travaille chez {o} : {tache}, du matin au soir.'] : ['Toute une journée, {h} s’emploie à {tache}.', 'Une longue journée de labeur : {tache}, sous l’œil de {o}.'], cx) + ' ' +
      T().dire(fumble ? ['Une maladresse coûteuse fâche {o} : la paie s’en ressent.', 'Un outil brisé, une pièce gâchée : {o} n’est pas content{oe}.']
        : reussis === n ? (crit ? ['{o} n’en revient pas : « Tu as de l’or dans les mains ! » Une prime s’ajoute à la paie.'] : ['Le travail est bien fait ; {o} paie sans discuter, avec un hochement de tête approbateur.', '« Pas mal du tout », concède {o} en comptant les pièces.'])
        : ['Le travail n’est pas toujours parfait, mais {o} paie ce qui est dû.', '{o} retient une partie de la paie pour l’ouvrage gâché.'], cx);
    var m = [n + ' jour' + (n > 1 ? 's' : '') + ' de travail', reussis + '/' + n + ' journées réussies (' + t.carac + ' ' + (mod >= 0 ? '+' : '') + mod + ')', '+' + fmt(gain), 'estime de ' + b.owner.prenom + ' : ' + (b.estime || 0)];
    if (peutApprendre(c, l, b)) m.push('🎓 ' + b.owner.prenom + ' propose de vous prendre en apprentissage');
    K().ajouterEntree(c, { t: 'recit', txt: txt, m: m.join(' · '), a: 'Travailler chez ' + b.owner.prenom, ok: !fumble && reussis >= rates, v: fumble ? 'fumble' : crit ? 'crit' : reussis === n ? 'ok' : reussis ? 'juste' : 'ko' });
    K().sauver(c);
    return { ok: true, gain: gain };
  }
  /* Les voies de recettes qu'enseigne un métier. */
  function voiesDe(type) {
    var out = [];
    function aj(v) { if (v && out.indexOf(v) < 0) out.push(v); }
    if (type === 'forge') ['Voie des lames', 'Voie des haches', 'Voie des masses et marteaux', 'Voie des armures de mailles', 'Voie des boucliers'].forEach(aj);
    if (type === 'tanneur') aj('Voie des armures de cuir');
    if (type === 'menuisier') ['Voie des arcs', 'Voie des bâtons de combat', 'Voie des boucliers'].forEach(aj);
    if (type === 'herboriste' || type === 'alchimiste') (COF.CATALOGUE_COMPAGNON || []).forEach(function (o) { if (o.potion) aj(o.v); });
    if (type === 'joaillier') (COF.CATALOGUE_COMPAGNON || []).forEach(function (o) { if (!o.potion && /lapidage/.test(o.tests || '')) aj(o.v); });
    return out;
  }
  function peutApprendre(c, l, b) { return (b.estime || 0) >= 3 && voiesDe(b.type).length > 0 && (b.apprentissages || 0) < b.qualite; }
  function apprendre(c, l, b) {
    var h = heros(c); if (!h || !peutApprendre(c, l, b)) return { err: 'Pas encore : gagnez d’abord l’estime de ' + b.owner.prenom + '.' };
    var frais = 50 * ((b.apprentissages || 0) + 1);
    if (!E().payer(h, frais)) return { err: 'L’apprentissage coûte ' + fmt(frais) + '.' };
    var a = COF.Artisanat.etat(h), vs = voiesDe(b.type), plafond = b.qualite;
    var choix = vs.filter(function (v) { return (a.recettes[v] || 0) < plafond; }); if (!choix.length) choix = vs;
    var voie = p(choix);
    a.recettes[voie] = Math.min(5, (a.recettes[voie] || 0) + 1); a.extra = (a.extra || 0) + 1;
    b.apprentissages = (b.apprentissages || 0) + 1; b.estime = 0;
    E().entrer(c, l, b);
    c.jour += 3; COF.Store.sauver(h);
    var f = b.owner.genre === 'féminin', cx = Object.assign(T().contexte(c, K().sceneCourante(c)), { o: b.owner.prenom, voie: voie, oil: f ? 'elle' : 'il' });
    K().ajouterEntree(c, { t: 'recit', a: 'Apprendre auprès de ' + b.owner.prenom, ok: true, v: 'crit',
      txt: T().dire(['Trois jours durant, {o} partage ses secrets avec {h} : les gestes, les tours de main, les erreurs à ne pas commettre.', '« Regarde bien. Je ne le montrerai qu’une fois. » Pendant trois jours, {o} enseigne à {h} ce que des années de métier lui ont appris.'], cx),
      m: '−' + fmt(frais) + ' · 3 jours · 🎓 ' + voie + ' rang ' + a.recettes[voie] });
    K().sauver(c);
    return { ok: true, voie: voie };
  }

  /* ---------- Se loger ---------- */
  function offresLogis(c, l) {
    var g = logisIci(c, l), r = tailleRang(l.ville), out = [];
    var semaine = Math.round(14 * MULT_TAILLE[r]), maison = PRIX_MAISON[r] * 10;
    if (!g || g.type === 'chambre') out.push({ k: 'chambre', nom: g ? 'Payer une semaine de plus' : 'Louer une chambre à l’auberge', prix: semaine, aide: '7 nuits au calme, un coffre pour vos affaires' });
    if (!g || g.type === 'chambre') out.push({ k: 'maison', nom: 'Acheter une maison au village', prix: maison, aide: 'à vous pour toujours · aménageable' });
    if (g && g.type === 'maison') Object.keys(AMELIOS).forEach(function (k) { if (!(g.amelios || {})[k]) out.push({ k: 'am-' + k, nom: AMELIOS[k].ic + ' Aménager : ' + AMELIOS[k].nom.toLowerCase(), prix: AMELIOS[k].prix * 10, aide: AMELIOS[k].aide }); });
    if (g && g.type === 'maison') out.push({ k: 'vendre', nom: 'Vendre la maison', prix: -Math.round(PRIX_MAISON[r] * 10 * 0.6), aide: '60 % de sa valeur' });
    return out;
  }
  function seLoger(c, l, k) {
    var h = heros(c), o = offresLogis(c, l).filter(function (x) { return x.k === k; })[0]; if (!h || !o) return { err: 'Impossible.' };
    var g = logis(c);
    if (k === 'vendre') { E().crediter(h, -o.prix); COF.Store.sauver(h); rendreCoffre(c, h); c.logis = null; noterChezSoi(c, l, ['{h} remet les clés au notaire. Une page se tourne.'], 'Vendre la maison', '+' + fmt(-o.prix)); return { ok: true }; }
    if (!E().payer(h, o.prix)) return { err: 'Il faut ' + fmt(o.prix) + '.' };
    COF.Store.sauver(h);
    if (k === 'chambre') {
      if (g && g.lieuId !== l.id) rendreCoffre(c, h);
      if (!g || g.lieuId !== l.id) g = c.logis = { lieuId: l.id, lieuNom: l.nom, type: 'chambre', coffre: [], amelios: {}, depuis: c.jour };
      g.payeJusqu = Math.max(c.jour, g.payeJusqu || c.jour) + 7;
      noterChezSoi(c, l, ['L’aubergiste tend une clé de fer à {h} : « La chambre du fond. Calme, sèche, et la serrure tient. »'], 'Louer une chambre', '−' + fmt(o.prix) + ' · payée jusqu’au jour ' + g.payeJusqu);
    } else if (k === 'maison') {
      var coffre = g && g.lieuId === l.id ? g.coffre : [];
      if (g && g.lieuId !== l.id) rendreCoffre(c, h);
      c.logis = { lieuId: l.id, lieuNom: l.nom, type: 'maison', coffre: coffre || [], amelios: {}, depuis: c.jour, dernierJardin: c.jour };
      noterChezSoi(c, l, ['Le notaire tend un trousseau de clés : la maison est à {h}. Des murs épais, une cheminée, un toit qui ne fuit pas — un vrai foyer.', 'Une petite maison au bout de la rue, avec un volet qui grince : c’est chez {h}, désormais.'], 'Acheter une maison', '−' + fmt(o.prix) + ' · 🏠 ' + l.nom);
    } else if (/^am-/.test(k)) {
      var id = k.slice(3); g.amelios = g.amelios || {}; g.amelios[id] = c.jour; if (id === 'jardin') g.dernierJardin = c.jour;
      noterChezSoi(c, l, ['Des artisans du village viennent travailler quelques jours chez {h} : {quoi} est prêt.'], 'Aménager la maison', '−' + fmt(o.prix) + ' · ' + AMELIOS[id].ic + ' ' + AMELIOS[id].nom, { quoi: AMELIOS[id].nom.toLowerCase() });
    }
    K().sauver(c);
    return { ok: true };
  }
  function rendreCoffre(c, h) { var g = logis(c); if (!g) return; (g.coffre || []).forEach(function (o) { h.inventaire.push(o); }); g.coffre = []; COF.Store.sauver(h); }
  function noterChezSoi(c, l, txt, a, m, plus) {
    var s = K().sceneCourante(c);
    if (!s) { K().nouvelleScene(c, 'Chez soi', '', { type: 'logis', sansTest: true }); s = K().sceneCourante(c); s.logis = true; }
    var cx = Object.assign(T().contexte(c, s), plus || {});
    K().ajouterEntree(c, { t: 'recit', txt: T().dire(txt, cx), a: a, m: m || '', ok: true });
  }
  function deposer(c, i) { var h = heros(c), g = logis(c); if (!h || !g) return { err: 'Pas de logis.' }; var o = (h.inventaire || [])[i]; if (!o) return { err: 'Objet introuvable.' }; if (o.equipe) return { err: 'Retirez-le d’abord de votre équipement.' }; h.inventaire.splice(i, 1); (g.coffre = g.coffre || []).push(o); COF.Store.sauver(h); K().sauver(c); return { ok: true }; }
  function reprendre(c, i) { var h = heros(c), g = logis(c); if (!h || !g || !g.coffre[i]) return { err: 'Objet introuvable.' }; h.inventaire.push(g.coffre.splice(i, 1)[0]); COF.Store.sauver(h); K().sauver(c); return { ok: true }; }
  /* Dormir chez soi : une vraie nuit, sans frais ni mauvaise surprise. */
  function dormir(c, l) {
    var h = heros(c), g = logisIci(c, l); if (!h || !valide(c, g)) return { err: 'Pas de logis ici.' };
    if (h.pv === null || h.pv === undefined) COF.Store.reinitialiser(h);
    var avPv = h.pv; h.pv = COF.Calc.pvMax(h); h.pm = COF.Calc.pmMax(h); h.dr = Math.min(COF.Calc.drMax(h), (h.dr || 0) + 1); h.etats = []; h.dmTemp = 0; COF.Store.sauver(h);
    c.jour++; c.conteur = c.conteur || {}; c.conteur.heure = 0;
    var m = ['+' + (h.pv - avPv) + ' PV', 'PM restaurés', 'DR +1', 'jour ' + c.jour];
    if (g.amelios && g.amelios.autel && c.jour - (g.dernierAutel || -99) >= 7) { g.dernierAutel = c.jour; c.tension = Math.max(1, c.tension - 1); m.push('🕯️ tension −1'); }
    noterChezSoi(c, l, g.type === 'maison' ? ['{h} ferme sa porte à double tour, allume un feu dans la cheminée, et dort comme une souche dans son propre lit.', 'Chez soi, enfin. Le silence, une couverture épaisse, et un sommeil sans rêves.']
      : ['La chambre est modeste mais sûre. {h} dort d’une traite, bercé{he} par les bruits assourdis de la salle commune.'], 'Dormir chez soi', m.join(' · '));
    var s = K().sceneCourante(c); if (s && s.logis) { var ten = c.tension; K().clore(c, true, 'Une nuit au calme, chez soi.'); c.tension = ten; }
    K().sauver(c);
    return { ok: true };
  }
  /* Bâtiment fictif pour l'atelier de la maison (sans location). */
  function atelierMaison(c, l) {
    var g = logisIci(c, l), h = heros(c); if (!g || !g.amelios || !g.amelios.atelier || !h) return null;
    return { id: 'maison', type: 'guilde', maison: true, sansLoyer: true, nom: 'L’atelier de la maison', qualite: 2, trait: 'honnete', owner: { prenom: h.nom, nom: h.nom, genre: h.genre === 'féminin' ? 'féminin' : 'masculin' } };
  }

  /* Nouvelle d'un village lointain (entre les scènes). */
  function nouvelle(c) {
    var ici = M().ici(c), vs = (c.lieux || []).filter(function (l) { return l.ville && (!ici || l.id !== ici.id) && c.jour - (l.ville.dernierEvt || 0) >= 4; });
    if (!vs.length) return null;
    var l = p(vs), e = declencher(c, l); if (!e) return null;
    return '📯 Des nouvelles ' + T().formes(l.nom).de + ' : ' + e.txt.charAt(0).toLowerCase() + e.txt.slice(1);
  }

  return { EVTS: EVTS, AMELIOS: AMELIOS, actifs: actifs, multPrix: multPrix, ferme: ferme, declencher: declencher, arrivee: arrivee, nouvelle: nouvelle,
    TRAVAUX: TRAVAUX, travail: travail, travailler: travailler, peutApprendre: peutApprendre, apprendre: apprendre, voiesDe: voiesDe,
    logis: logis, logisIci: logisIci, valide: valide, offresLogis: offresLogis, seLoger: seLoger, deposer: deposer, reprendre: reprendre, dormir: dormir, atelierMaison: atelierMaison };
})();
