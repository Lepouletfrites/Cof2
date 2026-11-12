/* ============================================================
   COF2 Compagnon — Carnet d'aventure (pôle Aventure), pensé mobile
   Une campagne solo qui garde la mémoire de l'histoire :
     🎬 Scène   : on annonce ce qu'on attend, l'app teste la scène
                  (tension), puis on écrit le récit au fil de l'eau
                  avec l'oracle, les tests, événements, muse…
     🧵 Fils    : intrigues ouvertes / résolues
     👥 PNJ     : personnages et factions, attitude
     📍 Lieux   : lieux visités
     📖 Journal : relecture et export du récit
   Un bouton flottant 📌 envoie le résultat des générateurs (PNJ,
   lieux, quêtes, intrigue, voyage, donjon, vie & temps, rencontre)
   dans le carnet. Interactions en « feuilles » qui montent du bas.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Carnet = (function () {
  var esc = COF.UI.esc, sgn = COF.UI.sgn, K = COF.Carnet;
  var onglet = 'scene';
  var oracleL = 'moitie';
  var jet = { carac: 'AGI', diff: 15, bonus: false, malus: false, action: '', comps: {}, oracle: null };
  var X = COF.Expedition;
  var expe = { nom: '', taille: 'moyen', env: 'ruines', depart: '', destination: '', jours: 3, envV: 'plaine', rations: 3 };
  var sheet = null;          // contexte de la feuille ouverte
  var ATTITUDES = [['allié', '#85bb7f'], ['neutre', 'var(--text-dim)'], ['hostile', 'var(--sang-clair)'], ['inconnu', '#7fb2d1']];
  var SUBS_FAB = { pnj: 'pnj', quetes: 'fils', intrigue: 'journal', lieux: 'lieux', voyage: 'journal', donjon: 'journal',
    solo: 'journal', rencontre: 'journal' };

  function $(s, r) { return (r || document).querySelector(s); }
  var dockCourant = '', outilsOuverts = false;   /* outils du MJ (oracle, test…) repliés par défaut */
  /* Le Carnet occupe exactement l'écran entre l'en-tête et la barre du bas. */
  function ajusterHauteur() {
    var top = document.querySelector('.topbar');
    document.documentElement.style.setProperty('--top-h', (top ? top.offsetHeight : 56) + 'px');
  }
  window.addEventListener('resize', ajusterHauteur);
  function maj(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }
  var A = COF.Aventure;
  var gen = { type: 'pnj', peuple: '', genre: '', lieu: 'village', env: '', diff: 'ordinaire', style: 'auto', res: null };
  function noeud() { return $('#vue-carnet'); }
  function perso(c) { return (c && c.persoId && COF.Store.get(c.persoId)) || COF.Store.actif(); }
  function heure(ts) { var d = new Date(ts); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }

  /* ================= Rendu principal ================= */
  function rendre() {
    var n = noeud(); if (!n) return;
    var c = K.actif();
    if (!c) { n.innerHTML = htmlAccueil(); return; }
    var h = htmlTete(c) + htmlRessources(c);
    /* L'aventure se vit dans la scène. Fils, PNJ, carte, journal et expédition
       ne sont plus que des récapitulatifs, rangés dans une barre discrète. */
    var recaps = [['fils', '🧵', 'Fils', K.filsOuverts(c).length], ['pnj', '👥', 'PNJ', c.pnj.length], ['factions', '🏛️', 'Factions', ''], ['lieux', '🗺️', 'Carte', c.lieux.length],
      ['journal', '📖', 'Journal', c.scenes.length]];
    if (c.expedition) recaps.push(['expe', c.expedition.type === 'donjon' ? '🗝️' : '🧭', 'Expé.', '•']);
    h += '<div class="cn-recapbar' + (onglet !== 'scene' ? ' ouvert' : '') + '">' +
      (onglet !== 'scene' ? '<button class="cn-retour" data-cn="onglet" data-v="scene">◀ Retour à l’aventure</button>' : '<span class="cn-recap-lbl">Carnet</span>') +
      recaps.map(function (o) {
        return '<button data-cn="onglet" data-v="' + o[0] + '" class="' + (onglet === o[0] ? 'on' : '') + '" title="' + o[2] + '">' + o[1] + (o[3] ? '<b>' + o[3] + '</b>' : '') + '</button>';
      }).join('') + '</div>';
    /* Zone centrale : seule partie qui défile (en-tête, onglets et barre
       de saisie restent en place). On conserve sa position de défilement. */
    var ancien = $('#cn-corps'), pos = ancien && rendre.onglet === onglet ? ancien.scrollTop : 0;
    dockCourant = '';
    var corps;
    if (onglet === 'scene') corps = htmlScene(c);
    else if (onglet === 'expe') corps = htmlExpedition(c);
    else if (onglet === 'journal') corps = htmlJournal(c);
    else if (onglet === 'factions') corps = htmlFactions(c);
    else corps = htmlListe(c, onglet);
    h += '<div class="cn-corps" id="cn-corps">' + corps + '</div>' + dockCourant;
    n.innerHTML = h;
    rendre.onglet = onglet;
    var zc = $('#cn-corps');
    if (zc) {
      if (rendre.defiler && onglet === 'scene') zc.scrollTop = zc.scrollHeight;
      else if (rendre.haut) zc.scrollTop = 0;
      else zc.scrollTop = pos;
    }
    rendre.defiler = false; rendre.haut = false;
    ajusterHauteur();
    /* après un choix : on montre le début de ce qui vient d'être raconté */
    if (zc && rendre.ancre !== null && rendre.ancre !== undefined && onglet === 'scene') {
      var items = zc.querySelectorAll('#cn-fil > .cn-recit, #cn-fil > .cn-entree'), cib = items[rendre.ancre];
      if (cib) zc.scrollTop += cib.getBoundingClientRect().top - zc.getBoundingClientRect().top - 6;
    }
    rendre.ancre = null;
    if (COF.UI.majTitre) COF.UI.majTitre();
  }

  function htmlAccueil() {
    var p = COF.Store.actif();
    return '<div class="carte"><h2>📖 Carnet d’aventure</h2><div class="carte-corps">' +
      '<div class="note" style="margin-bottom:12px">Jouez en solo sans MJ : le carnet garde la mémoire de votre histoire — scènes, ' +
      'fils d’intrigue, PNJ et lieux — et l’oracle s’en sert pour faire rebondir le récit. Une <b>jauge de tension</b> rend ' +
      'l’histoire plus imprévisible quand elle échappe au héros.</div>' +
      '<div class="champ"><label>Titre de l’aventure</label><input id="cn-titre-new" placeholder="La relique d’Osgild…"></div>' +
      (p ? '<div class="note" style="margin-bottom:10px">Héros : <b>' + esc(p.nom) + '</b></div>' : '<div class="note" style="margin-bottom:10px">Aucun personnage actif : vous pourrez en lier un plus tard.</div>') +
      '<button class="btn btn-plein btn-bloc" data-cn="creer">✨ Commencer l’aventure</button></div></div>';
  }

  function jauge(c) {
    var h = '<div class="cn-jauge" aria-label="Tension ' + c.tension + ' sur 9">';
    for (var i = 1; i <= 9; i++) h += '<span class="' + (i <= c.tension ? 'on' : '') + (i >= 7 ? ' haut' : '') + '"></span>';
    return h + '</div>';
  }
  function htmlTete(c) {
    var p = perso(c);
    return '<div class="cn-tete">' +
      '<button class="cn-titre" data-cn="menu"><span>' + esc(c.titre) + '</span><span class="cn-sous">' +
        (p ? esc(p.nom) + ' · niv. ' + p.niveau + ' · ' : '') + 'Jour ' + c.jour + ' ▾</span></button>' +
      '<div class="cn-tension"><div class="cn-lbl">Tension <b>' + c.tension + '</b></div>' +
        '<div class="cn-tension-l"><button data-cn="tension" data-v="-1" aria-label="Baisser la tension">−</button>' + jauge(c) +
        '<button data-cn="tension" data-v="1" aria-label="Monter la tension">+</button></div></div>' +
      '</div>';
  }

  /* ---------- Ressources du héros (bandeau + feuille) ---------- */
  function etatHeros(p) {
    if (!p) return null;
    if (p.pv === null || p.pv === undefined) COF.Store.reinitialiser(p);
    var Kc = COF.Calc;
    return { pv: p.pv, pvMax: Kc.pvMax(p), pm: p.pm || 0, pmMax: Kc.pmMax(p), dr: p.dr || 0, drMax: Kc.drMax(p), drType: Kc.drType(p) };
  }
  function htmlRessources(c) {
    var p = perso(c), e = etatHeros(p), r = X.ressources(c);
    var tuile = function (ic, v, cls) { return '<button data-cn="ressources" class="' + (cls || '') + '"><span>' + ic + '</span><b>' + v + '</b></button>'; };
    var pct = e ? e.pv / Math.max(1, e.pvMax) : 1;
    return '<div class="cn-res">' +
      (e ? tuile('❤️', e.pv + '/' + e.pvMax, pct <= 0.25 ? 'ko' : (pct <= 0.5 ? 'mod' : '')) +
        (e.pmMax ? tuile('🔮', e.pm + '/' + e.pmMax) : '') + tuile('🎲', 'DR ' + e.dr) : tuile('🛡️', 'Lier un héros')) +
      '</div>';
  }
  function sheetRessources() {
    var c = K.actif(), p = perso(c), e = etatHeros(p), r = X.ressources(c);
    var h = '';
    if (e) {
      h += '<label class="cn-lbl2">' + esc(p.nom) + '</label>' +
        '<div class="cn-resl"><span>❤️ PV</span><div class="cn-cpt"><button data-cn="res-pv" data-v="-5">−5</button><button data-cn="res-pv" data-v="-1">−</button>' +
          '<span>' + e.pv + ' <small>/ ' + e.pvMax + '</small></span><button data-cn="res-pv" data-v="1">+</button><button data-cn="res-pv" data-v="5">+5</button></div></div>' +
        (e.pmMax ? '<div class="cn-resl"><span>🔮 PM</span><div class="cn-cpt"><button data-cn="res-pm" data-v="-1">−</button><span>' + e.pm +
          ' <small>/ ' + e.pmMax + '</small></span><button data-cn="res-pm" data-v="1">+</button></div></div>' : '') +
        '<div class="note" style="margin:2px 0 10px">Dés de récupération : ' + e.dr + ' / ' + e.drMax + ' (d' + e.drType + ')</div>';
    } else h += '<div class="note" style="margin-bottom:10px">Aucun héros lié : ouvrez le menu de l’aventure (titre) pour lier le personnage actif.</div>';
    if (false) h += '<label class="cn-lbl2">Provisions</label>' +
      '<div class="cn-resl"><span>🍖 Rations</span>' + compteur('r-rations', r.rations, '') + '</div>' +
      '<div class="cn-resl"><span>🔥 Torches</span>' + compteur('r-torches', r.torches, '') + '</div>';
    if (e) h += '<button class="btn btn-bloc cn-gros ok" data-cn="recup-rapide">⏸️ Récupération rapide<small>30 min · 1 DR : 1d' + e.drType + ' + ½ niveau PV</small></button>' +
      '<button class="btn btn-bloc cn-gros" data-cn="recup-nuit">🌙 Nuit de repos<small>+1 DR, PM restaurés, états effacés · jour +1</small></button>';
    ouvrir('🎒 Ressources', h, { type: 'ressources' });
  }

  /* ---------- Tableau « Aventure en cours » (avant une nouvelle scène) ---------- */
  function htmlTableau(c) {
    var x = c.expedition, al = X.allies(c), p = perso(c);
    var compVoie = p ? (p.compagnons || []).map(function (i) { return i.nom; }) : [];
    var h = COF.UI.Reglages ? COF.UI.Reglages.rappelHTML() : '';
    h += '<div class="carte"><h2>🧭 Aventure en cours</h2><div class="carte-corps">';
    h += '<div class="cn-l"><span>📅</span><div>Jour ' + c.jour + ' · tension ' + c.tension + (c.tension >= 7 ? ' — l’histoire s’emballe' : (c.tension <= 3 ? ' — le héros contrôle la situation' : '')) + '</div></div>';
    if (x) h += '<div class="cn-l"><span>' + (x.type === 'donjon' ? '🗝️' : '🧭') + '</span><div>' + (x.type === 'donjon'
      ? 'Exploration de <b>' + esc(x.nom) + '</b> — salle ' + x.salles.length + '/' + x.nbSalles
      : 'Voyage vers <b>' + esc(x.destination) + '</b> — jour ' + x.fait + '/' + x.jours) +
      ' <a href="#" data-cn="onglet" data-v="expe">reprendre</a></div></div>';
    if (al.length || compVoie.length) h += '<div class="cn-l"><span>🤝</span><div>' + esc(compVoie.concat(al.map(function (a) { return a.nom; })).join(', ')) + '</div></div>';
    var fo = K.filsOuverts(c);
    h += '<div class="cn-l"><span>🧵</span><div>' + (fo.length ? fo.slice(0, 4).map(function (f) { return esc(f.nom); }).join(' · ') + (fo.length > 4 ? ' …' : '') : 'Aucun fil ouvert') + '</div></div>';
    h += '<div class="cn-actions cn-raccourcis">' + [
      ['oracle', '🔮', 'Oracle'], ['test', '🎲', 'Test'], ['rencontre', '⚔️', 'Rencontre'],
      ['inspirer', '✨', 'Inspirer'], ['generer', '🧰', 'Générer'], ['onglet|expe', '🗺️', 'Expédition']
    ].map(function (a) {
      var p2 = a[0].split('|');
      return '<button data-cn="' + p2[0] + '"' + (p2[1] ? ' data-v="' + p2[1] + '"' : '') + '><span class="ic">' + a[1] + '</span><span class="tx">' + a[2] + '</span></button>';
    }).join('') + '</div>';
    return h + '</div></div>';
  }

  /* ---------- Onglet Scène ---------- */
  function bandeauTest(t) {
    if (!t) return '';
    /* scène « comme prévu » : une simple ligne, pour laisser la place au récit */
    if (t.resultat === 'normale') return '<div class="cn-test-mini">🎲 ' + esc(t.label) + (t.roll ? ' (d10 : ' + t.roll + ')' : '') + '</div>';
    var cls = t.resultat === 'normale' ? 'ok' : (t.resultat === 'interrompue' ? 'ko' : 'mod');
    var txt = t.resultat === 'normale' ? 'La scène se déroule comme prévu.' :
      (t.resultat === 'modifiee' ? 'La scène est modifiée : quelque chose ne colle pas à ce que vous attendiez.' :
        'La scène est interrompue : un événement prend le dessus.');
    return '<div class="cn-test ' + cls + '"><div class="v">' + esc(t.label) + (t.roll ? ' <small>d10 : ' + t.roll + '</small>' : '') + '</div>' +
      '<div class="s">' + esc(txt) + '</div>' + (t.modif ? '<div class="e">🌀 ' + esc(t.modif) + '</div>' : '') +
      (t.histoire ? '<div class="e">🔀 ' + esc(t.histoire.texte) + '</div>' : '') + '</div>';
  }
  function htmlEntree(e) {
    var corps;
    if (e.t === 'recit') {
      return '<div class="cn-recit' + (e.rappel ? ' rappel' : '') + (e.fin ? ' fin' : '') + (e.evt ? ' evt' : '') + (e.ok === false ? ' ko' : '') + '">' +
        (e.fin ? '<span class="cn-recit-fin">❧</span>' : '') + (e.evt ? '<div class="cn-recit-evt">⚡ ' + esc(e.titre || 'Imprévu') + '</div>' : '') + '<p>' + esc(e.txt) + '</p>' +
        (e.m ? '<div class="cn-meca">🎲 ' + esc(e.m) + '</div>' : '') + '</div>';
    }
    if (e.t === 'texte') corps = '<div class="cn-txt">' + esc(e.txt).replace(/\n/g, '<br>') + '</div>';
    else if (e.t === 'oracle') {
      var cls = /^oui/.test(e.nuance) ? (e.nuance === 'oui_mais' ? 'mod' : 'ok') : (e.nuance === 'non_mais' ? 'mod' : 'ko');
      corps = '<div class="cn-meta">🔮 Oracle · ' + esc(e.likelihood) + '</div>' +
        (e.question ? '<div class="cn-q">« ' + esc(e.question) + ' »</div>' : '') +
        '<div class="cn-verdict ' + cls + '">' + esc(e.txt) + '</div><div class="cn-meta">d100 : ' + e.roll + ' · seuil ' + e.seuil + '</div>' +
        (e.evt ? '<div class="cn-evt">🔀 ' + esc(e.evt.texte) + '</div>' : '');
    } else if (e.t === 'jet') {
      corps = '<div class="cn-meta">🎲 Test</div><div class="cn-verdict ' + (e.reussite ? 'ok' : 'ko') + '">' + esc(e.txt) + '</div>' +
        (e.effet ? '<div class="cn-evt">➜ ' + esc(e.effet) + '</div>' : '') +
        (e.csq ? '<div class="cn-evt">' + esc(e.csq) + '</div>' : '');
    } else if (e.t === 'rencontre') {
      var rc = e.r || {}, cc = K.actif(), enCours = cc && cc.rencontre && cc.rencontre.id === rc.id && !rc.fin;
      corps = '<div class="cn-meta">⚔️ Rencontre · ' + esc(rc.difficulte || '') + '</div>' +
        (rc.test ? '<div class="cn-meta" style="text-transform:none;letter-spacing:0">🎲 ' + esc(rc.test) + '</div>' : '') +
        '<div class="cn-verdict ' + ({ hostile: 'ko', mefiant: 'mod', neutre: 'ok', amical: 'ok' }[rc.reaction] || '') + '" style="font-size:16px">' + esc(rc.texte) + '</div>' +
        '<div class="cn-txt" style="font-size:14px">' + esc(maj(rc.distance)) + '. ' + esc(rc.reactionTexte) + (rc.surprise ? ' ' + esc(rc.surprise) : '') + '</div>' +
        (enCours ? '<div class="cn-grille cn-g2b" style="margin-top:8px"><button data-cn="combat-rencontre" class="ko">⚔️ Combattre</button>' +
          COF.Aventure.approches(rc).map(function (ap) {
            return '<button data-cn="approche" data-v="' + ap.id + '">' + esc(ap.nom) + '<small>' + ap.carac + ' ' + ap.diff + '</small></button>';
          }).join('') + '</div>' : (rc.fin ? '<div class="cn-meta" style="margin-top:4px">✓ ' + esc(rc.fin) + '</div>' : ''));
    } else {
      var ic = { evt: '🔀 Événement', muse: '✨ Muse', detail: '🖐️ Détail', note: '📌 ' + (e.titre || 'Note') }[e.t] || '📌';
      corps = '<div class="cn-meta">' + esc(ic) + '</div><div class="cn-txt">' + esc(e.txt).replace(/\n/g, '<br>') + '</div>';
    }
    return '<div class="cn-entree cn-' + e.t + '">' + corps +
      '<button class="cn-x" data-cn="suppr-entree" data-id="' + e.id + '" aria-label="Supprimer">×</button>' +
      '<div class="cn-heure">' + heure(e.quand) + '</div></div>';
  }
  /* ---------- La menace de fond (saga) ---------- */
  function htmlSaga(c) {
    var s = c.saga; if (!s) return '';
    if (s.fini) return '<div class="cn-saga fini"><div class="t">👑 La quête majeure est accomplie' + (s.fini === 'amère' ? ', au prix fort' : '') + '.</div>' +
      '<button class="btn btn-plein btn-bloc cn-gros" style="margin-top:8px" data-cn="fin-aventure">🏁 Clore l’aventure<small>épilogue · niveau +1 · chapitre suivant</small></button>' +
      '<div class="s">Vous pouvez aussi finir les affaires en cours avant de clore.</div></div>';
    var j = ''; for (var i = 1; i <= s.max; i++) j += '<span class="' + (i <= s.horloge ? 'on' : '') + '"></span>';
    return '<div class="cn-saga"><div class="t">🌑 La menace : <b>' + esc(maj(s.nom)) + '</b></div><div class="cn-saga-j">' + j + '</div>' +
      '<div class="s">' + (s.horloge >= 5 ? 'Ses plans avancent dangereusement. ' : '') + 'Indices : ' + Math.min(2, s.indices) + '/2' + (s.lieu ? ' · repaire connu : ' + esc((COF.Monde.lieu(c, s.lieu) || {}).nom || '?') : ' · repaire inconnu') + '</div></div>';
  }
  /* ---------- Choix du héros (scène jouée par le Conteur) ---------- */
  function chance(mod, diff, bonus) {
    var q = Math.max(0.05, Math.min(0.95, (21 - (diff - mod)) / 20));
    return Math.round((bonus ? 1 - (1 - q) * (1 - q) : q) * 100);
  }
  function jauges(j) {
    if (j.genre === 'confrontation') return '<div class="cn-jauges"><span>⚔️ Vaincre les adversaires</span></div>';
    var r = function (ch, vide, n, max) { var t = ''; for (var i = 0; i < max; i++) t += i < n ? ch : vide; return t; };
    return '<div class="cn-jauges"><span title="Objectif">🎯 ' + r('◆', '◇', Math.min(j.prog, j.progMax), j.progMax) + '</span>' +
      '<span class="dg" title="Danger">⚠️ ' + r('●', '○', Math.min(j.danger, j.dangerMax), j.dangerMax) + '</span>' +
      (j.bonus ? '<span class="bn">🎲 dé bonus</span>' : '') + '</div>';
  }
  function htmlChoix(c, s) {
    var j = s.jeu; if (!j) return '';
    var p = perso(c), nom = p ? p.nom : 'le héros';
    if (j.fini) return '<div class="cn-choix"><button class="btn btn-plein btn-bloc cn-gros" data-cn="suite">▶ La suite' +
      '<small>' + (j.fini === 'reussite' ? 'Scène réussie · tension −1' : 'La situation a échappé au héros · tension +1') + '</small></button></div>';
    if (c.rencontre) return '<div class="cn-choix"><div class="note">⚔️ Il faut d’abord régler la rencontre : combattre, ou tenter une approche avec les boutons ci-dessus.</div></div>';
    var l = COF.Conteur.choix(c, s);
    var h = '<div class="cn-choix' + (j.evt ? ' evt' : '') + '"><div class="cn-choix-q">' + (j.evt ? '⚡ ' + esc(j.evt.titre) + ' — que fait ' : 'Que fait ') + esc(nom) + ' ?</div>' + jauges(j);
    if (!l.length && j.genre === 'confrontation') h += '<button class="cn-opt ko" data-cn="provoquer"><b>⚔️ Aller au-devant du danger</b><small>les adversaires se montrent</small></button>';
    h += l.map(function (o) {
      return '<button class="cn-opt" data-cn="choix" data-v="' + o.i + '"><b>' + esc(o.nom) + '</b><small>' +
        (o.auto ? 'sans jet · ' + esc(o.aide || 'réussite assurée') : o.carac + ' ' + sgn(o.mod) + ' · difficulté ' + o.diff + ' · ≈ ' + chance(o.mod, o.diff, j.bonus || o.deBonus) + ' %' +
          (o.voies && o.voies.length ? ' · <span class="cn-voiebonus">' + esc(o.voies.join(', ')) + '</span>' : '')) + '</small></button>';
    }).join('');
    /* magie et capacités hors combat du héros */
    COF.Conteur.capacitesHorsCombat(c, s).forEach(function (k) {
      h += '<button class="cn-opt cn-opt-cap" data-cn="cap" data-v="' + esc(k.cle) + '"' + (k.possible ? '' : ' disabled') + '><b>' + (k.soin ? '💚 ' : '✨ ') + esc(k.nom) + '</b><small>' +
        (k.cout ? k.cout + ' PM' + (k.possible ? '' : ' (pas assez de PM)') + ' · ' : '') + esc(k.voie) + ' · ' + (k.soin ? 'soigne le héros' : 'objectif +1 et dé bonus') + '</small></button>';
    });
    if (j.genre === 'ville' && !j.evt) h += '<button class="cn-opt" data-cn="aller" data-v="marche"><b>🛒 Parcourir les échoppes</b><small>le marché du village : sa spécialité, ses objets rares</small></button>';
    return h + '<button class="cn-opt autre" data-cn="libre"><b>✍️ Autre chose…</b><small>écrivez ce que fait ' + esc(nom) + ' : l’app comprend et lance le dé</small></button></div>';
  }
  function htmlScene(c) {
    if (c.termine) {
      var camp = c.campagne || { nom: c.titre, numero: 1 };
      return '<div class="carte"><h2>🏁 Aventure terminée</h2><div class="carte-corps">' + htmlArchive(c, false) +
        (c.suiteId && K.get(c.suiteId) ? '<button class="btn btn-plein btn-bloc" style="margin-top:12px" data-cn="aller-suite">▶ Aller au chapitre suivant</button>'
          : '<label class="cn-lbl2" style="margin-top:14px">La campagne continue</label>' +
            '<div class="champ"><label>Titre du chapitre suivant</label><input id="cn-suite-titre" placeholder="' + esc(camp.nom + ' — chapitre ' + (camp.numero + 1)) + '"></div>' +
            '<button class="btn btn-plein btn-bloc cn-gros" data-cn="suite-aventure">▶ Commencer le chapitre suivant<small>même héros, même monde, nouvelle menace</small></button>') +
        '<button class="btn btn-bloc" style="margin-top:8px" data-cn="campagne">📚 Voir la campagne</button>' +
        '</div></div>';
    }
    var s = K.sceneCourante(c), h = '';
    if (!s) {
      var der = c.scenes[c.scenes.length - 1];
      if (der) h += '<div class="note cn-rappel">Scène précédente : <b>' + esc(der.titre) + '</b>' + (der.resume ? ' — ' + esc(der.resume) : '') + '</div>';
      /* ce que la fin de la scène a changé (quête, menace, carte, réputation…) */
      var chg = der ? der.entrees.filter(function (e) { return e.clot; }).slice(-6) : [];
      if (chg.length) h += '<div class="cn-changes">' + chg.map(function (e) { return '<div>' + esc(e.txt).replace(/\n/g, '<br>') + '</div>'; }).join('') + '</div>';
      h += htmlSaga(c);
      /* Le directeur propose les scènes qui découlent de l'aventure */
      h += '<div class="carte"><h2>🎬 Et maintenant ?</h2><div class="carte-corps"><div class="cn-props">' +
        (function () {
          /* les 4 premières propositions (quêtes, affaires…) en avant ; les autres repliées */
          var l = COF.Directeur.propositions(c).map(function (pr, i) {
            return '<button class="cn-prop t-' + pr.type + '" data-cn="jouer-prop" data-v="' + i + '"><span class="ic">' + pr.ic + '</span><span class="tx"><b>' + esc(pr.titre) + '</b>' +
              (pr.fil && pr.type !== 'fil' ? '<em>🧵 ' + esc(pr.fil) + (pr.etape ? ' · ' + esc(pr.etape) : '') + '</em>' : '') +
              '<small>' + esc(pr.attendu.length > 150 ? pr.attendu.slice(0, 150) + '…' : pr.attendu) + '</small></span></button>';
          });
          return l.slice(0, 4).join('') + (l.length > 4 ? '<details class="cn-autres"><summary>Autres possibilités (' + (l.length - 4) + ')</summary>' + l.slice(4).join('') + '</details>' : '');
        })() + '</div>' +
        '<div class="note" style="margin-top:6px">La scène est testée selon la tension (' + c.tension + ') : comme prévu, modifiée ou interrompue par un événement qui agit sur l’aventure.</div>' +
        '<details class="cn-libre"><summary>✍️ Scène libre</summary>' +
        '<div class="champ"><label>Titre (facultatif)</label><input id="cn-sc-titre" placeholder="Scène ' + (c.scenes.length + 1) + '"></div>' +
        '<div class="champ"><label>Ce que vous attendez</label><textarea id="cn-sc-attendu" rows="3" placeholder="Le héros arrive au village à la tombée de la nuit et cherche l’auberge…"></textarea></div>' +
        '<button class="btn btn-plein btn-bloc" data-cn="jouer">🎬 Jouer la scène</button></details></div></div>';
      /* les gens à qui parler ici */
      if (COF.Dialogues) { var gens = COF.Dialogues.interlocuteurs(c); if (gens.length) h += '<div class="carte"><h2>💬 Parler à…</h2><div class="carte-corps"><div class="cn-loisirs">' + gens.map(function (x) {
        COF.Dialogues.profil(x);
        return '<button class="cn-loisir" data-cn="parler" data-v="' + x.id + '"><span class="ic">' + (x.compagnon && x.compagnon.actif ? '🤝' : (x.rel >= 2 ? '💚' : (x.rel <= -2 ? '💢' : '👤'))) + '</span><span>' + esc(x.nom) + '<small>' + esc(x.attitude || 'neutre') + (x.perso ? ' · ' + esc(String(x.perso.trait).toLowerCase()) : '') + '</small></span></button>';
      }).join('') + '</div></div></div>'; }
      /* temps libre : de quoi passer le temps ici (3 activités tirées selon le lieu) */
      if (COF.Loisirs) h += '<div class="carte"><h2>☕ Temps libre</h2><div class="carte-corps"><div class="cn-loisirs">' + COF.Loisirs.offres(c).map(function (o, i) {
        return '<button class="cn-loisir" data-cn="loisir-go" data-v="' + i + '"><span class="ic">' + o.ic + '</span><span>' + esc(o.titre) + (o.v.mise ? '<small>mise ' + o.v.mise + ' po</small>' : '') + '</span></button>';
      }).join('') + '</div></div></div>';
      return h;
    }
    var fS = s.filId ? c.fils.filter(function (f) { return f.id === s.filId; })[0] : null;
    h += '<div class="carte cn-scene"><h2>' + s.n + '. ' + esc(s.titre) + '<span class="h2-action" data-cn="clore">🏁 Clore</span></h2><div class="carte-corps">' +
      (fS ? '<div class="cn-filtag">🧵 ' + esc(fS.nom) + (fS.quete && fS.quete.etape < 5 ? ' · ' + COF.Directeur.ETAPES[fS.quete.etape].ic + ' ' + esc(COF.Directeur.ETAPES[fS.quete.etape].nom) : '') + '</div>' : '') +
      (function () { var t = COF.Conteur.infoTemps(c); return '<div class="cn-temps">' + t.heure + (t.meteo ? ' · ' + esc(t.meteo) : '') + (t.saison ? ' · ' + esc(t.saison) : '') + ' · Jour ' + c.jour + '</div>'; })() +
      (s.attendu && !s.jeu ? '<div class="note" style="margin-bottom:8px">Attendu : ' + esc(s.attendu) + '</div>' : '') + bandeauTest(s.test) + '</div></div>';
    h += '<div id="cn-fil" class="cn-fil">' + (s.entrees.length ? s.entrees.map(htmlEntree).join('') :
      '<div class="vide" style="padding:14px">Racontez ce qui se passe, ou interrogez l’oracle.</div>') + htmlChoix(c, s) + '</div>';
    /* La barre de saisie et d'actions reste fixe sous la zone qui défile. */
    dockCourant = '<div class="cn-dock"><div class="cn-compose">' +
      '<textarea id="cn-texte" rows="2" placeholder="Que se passe-t-il ?"></textarea>' +
      '<button class="btn btn-plein" data-cn="ecrire" aria-label="Ajouter au récit">➤</button>' +
      '<button class="btn cn-outils-btn' + (outilsOuverts ? ' on' : '') + '" data-cn="outils-toggle" aria-label="Outils">🧰</button></div>' +
      '<div class="cn-actions' + (outilsOuverts ? '' : ' ferme') + '">' +
      [['oracle', '🔮', 'Oracle'], ['test', '🎲', 'Test'], ['rencontre', '⚔️', 'Rencontre'],
       ['inspirer', '✨', 'Inspirer'], ['generer', '🧰', 'Générer'], ['clore', '🏁', 'Clore']].map(function (a) {
        return '<button data-cn="' + a[0] + '"><span class="ic">' + a[1] + '</span><span class="tx">' + a[2] + '</span></button>';
      }).join('') + '</div></div>';
    return h;
  }

  /* ---------- Onglets Fils / PNJ / Lieux ---------- */
  var LISTES = {
    fils: { titre: 'Fils d’intrigue', ph: 'Retrouver la relique volée…', vide: 'Aucun fil : ajoutez les quêtes, mystères et menaces en cours.', gen: ['quetes', '📜 Générer une quête'] },
    pnj: { titre: 'Personnages & factions', ph: 'Baron Aldric, la Guilde des ombres…', vide: 'Aucun PNJ pour l’instant.', gen: ['pnj', '👤 Générer un PNJ'] },
    lieux: { titre: 'Lieux', ph: 'Village de Brumeval…', vide: 'Aucun lieu noté.', gen: ['lieux', '🏘️ Générer un lieu'] }
  };
  /* ---------- 🗺️ Carte du monde (onglet Lieux) ---------- */
  var monde = { deplacer: null, ajouter: false, cible: null, jours: 2, env: 'plaine', vue: null, vueId: null };
  /* Vue courante (zone visible du monde) : recadrée sur les lieux au besoin. */
  function vueMonde(c) {
    if (!monde.vue || monde.vueId !== c.id) { monde.vue = COF.Monde.cadre(c, true); monde.vueId = c.id; }
    return monde.vue;
  }
  function htmlCarteMonde(c) {
    var M = COF.Monde; M.assurer(c);
    var envIc = {}; (COF.ENVIRONNEMENTS || []).forEach(function (e) { envIc[e.id] = e.ic; });
    var v = vueMonde(c), u = v.w / 100;   /* tailles proportionnelles au zoom */
    var h = '<div class="carte"><h2>🗺️ Carte' + (M.ici(c) ? ' <small style="text-transform:none;letter-spacing:0;color:var(--text-mute)">· vous êtes à ' + esc(M.ici(c).nom) + '</small>' : '') + '</h2><div class="carte-corps" style="padding:8px">';
    h += '<div class="cn-monde-boite">';
    h += '<svg class="cn-monde' + (monde.deplacer || monde.ajouter || monde.ajouterRegion ? ' placer' : '') + '" viewBox="' + [v.x, v.y, v.w, v.h].map(function (n) { return n.toFixed(1); }).join(' ') + '" data-cn="monde-fond" preserveAspectRatio="xMidYMid meet">';
    /* quadrillage infini : seules les lignes autour de la vue sont tracées,
       avec un pas qui suit le zoom */
    var pasG = 25; while (v.w / pasG > 10) pasG *= 2; while (v.w / pasG < 4) pasG /= 2;
    var mx0 = v.x - v.w, my0 = v.y - v.h, mx1 = v.x + 2 * v.w, my1 = v.y + 2 * v.h;
    for (var gx = Math.floor(mx0 / pasG) * pasG; gx <= mx1; gx += pasG) h += '<line x1="' + gx + '" y1="' + my0 + '" x2="' + gx + '" y2="' + my1 + '" class="qd"/>';
    for (var gy = Math.floor(my0 / pasG) * pasG; gy <= my1; gy += pasG) h += '<line x1="' + mx0 + '" y1="' + gy + '" x2="' + mx1 + '" y2="' + gy + '" class="qd"/>';
    /* régions de terrain (cercles translucides) sous les routes et les lieux */
    M.regions(c).forEach(function (rg) {
      var e = M.envDe(rg.env) || {};
      h += '<circle cx="' + rg.x + '" cy="' + rg.y + '" r="' + rg.r + '" class="reg reg-' + rg.env + '"/>' +
        '<text x="' + rg.x + '" y="' + (rg.y - rg.r + 4.5 * u) + '" class="regnm" style="font-size:' + (3 * u) + 'px">' + (e.ic || '') + ' ' + esc(rg.nom) + '</text>';
    });
    (c.routes || []).forEach(function (r) {
      var a = M.lieu(c, r.a), b = M.lieu(c, r.b); if (!a || !b) return;
      var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      h += '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" class="rt" style="stroke-width:' + (0.7 * u) + ';stroke-dasharray:' + (1.6 * u) + ' ' + (1.2 * u) + '"/>' +
        '<text x="' + mx + '" y="' + (my - 1.2 * u) + '" class="rtl" style="font-size:' + (2.8 * u) + 'px">' + (envIc[r.env] || '') + ' ' + r.jours + ' j</text>';
    });
    var mq = marqueursLieux(c);
    c.lieux.forEach(function (l) {
      var ici = l.id === c.position, dep = monde.deplacer === l.id, mk = mq[l.id], ics = mk ? mk.ic.filter(function (k) { return k !== '👤'; }) : [];
      var but = ics.some(function (k) { return k === '❗' || k === '📌' || k === '☠️'; });
      h += '<g data-cn="monde-lieu" data-id="' + l.id + '" class="lieu' + (ici ? ' ici' : '') + (dep ? ' dep' : '') + (but ? ' but' : '') + (l.ville ? ' ville' : '') + '">' +
        (but ? '<circle cx="' + l.x + '" cy="' + l.y + '" r="' + (4.6 * u) + '" class="halo" style="stroke-width:' + (0.5 * u) + '"/>' : '') +
        '<circle cx="' + l.x + '" cy="' + l.y + '" r="' + (5.5 * u) + '" class="zone"/>' +
        '<circle cx="' + l.x + '" cy="' + l.y + '" r="' + ((ici ? 3.4 : 2.9) * u) + '" class="pt" style="stroke-width:' + (0.6 * u) + '"/>' +
        '<text x="' + l.x + '" y="' + (l.y + 0.2 * u) + '" class="ic-lieu" style="font-size:' + (3.4 * u) + 'px">' + ((M.envDe(l.env) || {}).ic || '•') + '</text>' +
        (ici ? '<text x="' + l.x + '" y="' + (l.y - 4.6 * u) + '" class="pin" style="font-size:' + (3.8 * u) + 'px">📍</text>' : '') +
        '<text x="' + l.x + '" y="' + (l.y + 5.6 * u) + '" class="nm" style="font-size:' + (3.2 * u) + 'px;stroke-width:' + (0.8 * u) + 'px">' + esc(l.nom.length > 20 ? l.nom.slice(0, 19) + '…' : l.nom) + '</text>' +
        (ics.length ? '<text x="' + (l.x + 3.6 * u) + '" y="' + (l.y - 2.4 * u) + '" class="mq" style="font-size:' + (2.8 * u) + 'px">' + ics.slice(0, 3).join('') + '</text>' : '') + '</g>';
    });
    h += '</svg>';
    h += '<div class="cn-monde-ctl"><button data-cn="monde-zoom" data-v="0.7" aria-label="Zoomer">＋</button><button data-cn="monde-zoom" data-v="1.4" aria-label="Dézoomer">−</button>' +
      '<button data-cn="monde-cadrer" aria-label="Autour de moi">📍</button><button data-cn="monde-tout" aria-label="Tout le monde connu">🌍</button></div>';
    h += '</div>';
    h += '<div class="cn-grille cn-g3" style="margin-top:8px"><button data-cn="monde-ajouter" class="' + (monde.ajouter ? 'on' : '') + '">' + (monde.ajouter ? '✕ Annuler' : '➕ Lieu') + '</button>' +
      '<button data-cn="monde-ajouter-region" class="' + (monde.ajouterRegion ? 'on' : '') + '">' + (monde.ajouterRegion ? '✕ Annuler' : '🗺️ Région') + '</button>' +
      (M.ici(c) ? '<button data-cn="monde-lieu" data-id="' + M.ici(c).id + '">📍 Où suis-je ?</button>' : '<button disabled>📍 Inconnue</button>') + '</div>';
    if (M.regions(c).length) h += '<div class="cn-mini" style="margin-top:6px">' + M.regions(c).map(function (rg) {
      return '<span class="chip" data-cn="monde-reg-suppr" data-id="' + rg.id + '">' + ((M.envDe(rg.env) || {}).ic || '') + ' ' + esc(rg.nom) + ' ✕</span>';
    }).join('') + '</div>';
    h += '<div class="cn-legende">❗ quête · 📌 affaire · ☠️ menace · ⚔️ ennemi · 📍 vous</div>';
    h += '<div class="note" style="margin-top:6px">' + (monde.ajouterRegion ? '🗺️ Touchez le centre de la nouvelle région.' : monde.ajouter ? '➕ Touchez la carte à l’endroit du nouveau lieu.'
      : monde.deplacer ? '✋ Touchez la carte pour placer <b>' + esc((M.lieu(c, monde.deplacer) || {}).nom || '') + '</b>.'
      : 'Touchez un lieu pour voir ce qui vous y attend et partir en voyage. Glissez pour vous déplacer, pincez (ou ＋ −) pour zoomer.') + '</div>';
    return h + '</div></div>';
  }
  /* Point du monde sous un clic/toucher. */
  function pointMonde(svg, cx, cy) {
    var rc = svg.getBoundingClientRect(), v = monde.vue;
    /* preserveAspectRatio meet : la vue peut être centrée avec des marges */
    var s = Math.min(rc.width / v.w, rc.height / v.h), ox = (rc.width - v.w * s) / 2, oy = (rc.height - v.h * s) / 2;
    return { x: v.x + (cx - rc.left - ox) / s, y: v.y + (cy - rc.top - oy) / s };
  }
  function zoomMonde(f, centre) {
    var v = monde.vue, M = COF.Monde; if (!v) return;
    var w = Math.max(20, Math.min(6000, v.w * f)), h = w * v.h / v.w;
    var cx = centre ? centre.x : v.x + v.w / 2, cy = centre ? centre.y : v.y + v.h / 2;
    var rx = (cx - v.x) / v.w, ry = (cy - v.y) / v.h;
    monde.vue = { x: cx - rx * w, y: cy - ry * h, w: w, h: h };
  }
  function appliquerVue(svg) {
    var v = monde.vue; svg.setAttribute('viewBox', [v.x, v.y, v.w, v.h].map(function (n) { return n.toFixed(1); }).join(' '));
  }
  /* Gestes : glisser = déplacer la vue ; pincer / molette = zoom.
     Un simple toucher reste un clic (lieu ou fond). */
  (function gestes() {
    var pts = {}, depart = null, pince = null, bouge = false;
    document.addEventListener('pointerdown', function (e) {
      var svg = e.target.closest && e.target.closest('svg.cn-monde'); if (!svg || !monde.vue) return;
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(pts);
      if (ids.length === 1) { depart = { x: e.clientX, y: e.clientY, vue: Object.assign({}, monde.vue) }; bouge = false; }
      if (ids.length === 2) {
        var a = pts[ids[0]], b = pts[ids[1]];
        pince = { d: Math.hypot(a.x - b.x, a.y - b.y), vue: Object.assign({}, monde.vue), c: pointMonde(svg, (a.x + b.x) / 2, (a.y + b.y) / 2) };
      }
    });
    document.addEventListener('pointermove', function (e) {
      if (!pts[e.pointerId]) return;
      var svg = document.querySelector('svg.cn-monde'); if (!svg) return;
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(pts), rc = svg.getBoundingClientRect();
      if (ids.length >= 2 && pince) {
        var a = pts[ids[0]], b = pts[ids[1]], d = Math.hypot(a.x - b.x, a.y - b.y);
        monde.vue = pince.vue; zoomMonde(pince.d / Math.max(10, d), pince.c); appliquerVue(svg); bouge = true;
      } else if (depart) {
        var dx = e.clientX - depart.x, dy = e.clientY - depart.y;
        if (!bouge && Math.hypot(dx, dy) < 8) return;
        bouge = true;
        var s = Math.min(rc.width / depart.vue.w, rc.height / depart.vue.h);
        monde.vue = { x: depart.vue.x - dx / s, y: depart.vue.y - dy / s, w: depart.vue.w, h: depart.vue.h };
        appliquerVue(svg);
      }
      if (bouge) e.preventDefault();
    }, { passive: false });
    function fin(e) {
      if (!pts[e.pointerId]) return;
      delete pts[e.pointerId];
      if (Object.keys(pts).length < 2) pince = null;
      if (!Object.keys(pts).length) {
        depart = null;
        if (bouge) {
          /* empêche le clic qui suit un glissement */
          var stop = function (ev) { ev.stopPropagation(); ev.preventDefault(); document.removeEventListener('click', stop, true); };
          document.addEventListener('click', stop, true);
          setTimeout(function () { document.removeEventListener('click', stop, true); }, 350);
          setTimeout(function () { rendre(); }, 0);   /* recalcule la taille des libellés */
        }
      }
    }
    document.addEventListener('pointerup', fin);
    document.addEventListener('pointercancel', fin);
    document.addEventListener('wheel', function (e) {
      var svg = e.target.closest && e.target.closest('svg.cn-monde'); if (!svg || !monde.vue) return;
      e.preventDefault();
      zoomMonde(e.deltaY > 0 ? 1.15 : 0.87, pointMonde(svg, e.clientX, e.clientY)); appliquerVue(svg);
      clearTimeout(gestes.t); gestes.t = setTimeout(rendre, 250);
    }, { passive: false });
  })();
  function chipsType(sel, act, extra) {
    return '<div class="cn-mini">' + (COF.ENVIRONNEMENTS || []).map(function (e) {
      return '<span class="chip' + (sel === e.id ? ' on' : '') + '" data-cn="' + act + '" data-v="' + e.id + '"' + (extra || '') + '>' + e.ic + ' ' + esc(e.nom) + '</span>';
    }).join('') + '</div>';
  }
  function sheetRegion(c) {
    var nr = monde.nouvelleRegion;
    ouvrir('🗺️ Nouvelle région', '<div class="champ"><label>Nom</label><input id="cn-rg-nom" value="' + esc(nr.nom || '') + '" placeholder="Forêt de Sombrebois"></div>' +
      '<label class="cn-lbl2">Terrain</label>' + chipsType(nr.env, 'monde-reg-type') +
      '<label class="cn-lbl2" style="margin-top:8px">Taille</label><div class="cn-grille cn-g3">' + [[25, 'Petite'], [45, 'Moyenne'], [75, 'Vaste']].map(function (t) {
        return '<button data-cn="monde-reg-taille" data-v="' + t[0] + '" class="' + (nr.r === t[0] ? 'on' : '') + '">' + t[1] + '</button>';
      }).join('') + '</div>' +
      '<button class="btn btn-plein btn-bloc" style="margin-top:12px" data-cn="monde-reg-creer">🗺️ Créer la région</button>' +
      '<div class="note" style="margin-top:6px">Les lieux et routes de la région sans terrain précis prennent le sien (rencontres, tests, voyages).</div>', { type: 'region' });
  }
  function sheetNouveauLieu(c, nom, note) {
    var ic = COF.Monde.ici(c);
    ouvrir('➕ Nouveau lieu', '<div class="champ"><label>Nom</label><input id="cn-nl-nom" value="' + esc(nom || '') + '" placeholder="Fort de la Brèche"></div>' +
      '<label class="cn-lbl2">Type de terrain</label>' + chipsType(monde.typeNouveau, 'monde-type-nouveau') +
      '<div class="champ" style="margin-top:8px"><label>Notes (facultatif)</label><textarea id="cn-nl-note" rows="3" placeholder="Village fortifié, garnison de 30 soldats…">' + esc(note || '') + '</textarea></div>' +
      (ic ? '<label style="display:flex;gap:8px;align-items:center;margin-bottom:10px;font-size:14px"><input type="checkbox" id="cn-nl-route" checked> Tracer une route depuis ' + esc(ic.nom) + '</label>' : '') +
      '<button class="btn btn-plein btn-bloc" data-cn="monde-creer">📍 Créer le lieu</button>' +
      '<div class="note" style="margin-top:6px">Le terrain détermine les créatures rencontrées et les tests proposés sur place.</div>', { type: 'nouveau-lieu' });
  }
  function sheetLieu(id) {
    var c = K.actif(), M = COF.Monde, l = M.lieu(c, id); if (!l) return;
    var ici = M.ici(c), vois = M.voisins(c, id), routeIci = ici && ici.id !== id ? M.route(c, ici.id, id) : null;
    var mk = marqueursLieux(c)[id], envL = M.envDe(l.env) || {};
    var h = '<div class="cn-lieu-tete">' + (envL.ic || '📍') + ' ' + esc(envL.nom || '') + (l.ville ? ' · ' + esc(l.ville.type || 'village') + (COF.Saga ? ' · réputation : ' + esc(COF.Saga.libRep(COF.Saga.reputation(l))) : '') : '') + '</div>';
    if (mk && mk.txt.length) h += '<label class="cn-lbl2">Ce qui vous attend ici</label><div class="cn-attend">' + mk.txt.slice(0, 8).map(function (t) { return '<div>' + esc(t) + '</div>'; }).join('') + '</div>';
    if (l.note) h += '<div class="note" style="margin:8px 0 10px;white-space:pre-line">' + esc(l.note.length > 300 ? l.note.slice(0, 300) + '…' : l.note) + '</div>';
    if (ici && ici.id !== id) {
      var jEst = routeIci ? routeIci.jours : Math.max(1, Math.min(6, Math.round(Math.hypot(ici.x - l.x, ici.y - l.y) / 15)));
      h += '<button class="btn btn-plein btn-bloc" data-cn="monde-recit" data-id="' + id + '">🧭 Partir pour ce lieu (' + jEst + ' j de route' + (routeIci ? '' : ', hors des sentiers') + ')</button>';
    }
    h += '<details class="cn-details"><summary>✏️ Modifier la carte</summary><label class="cn-lbl2">Type de terrain</label>' + chipsType(l.env, 'monde-type', ' data-l="' + id + '"');
    h += '<div class="cn-grille" style="margin-top:8px">' +
      (c.position === id ? '<button disabled>📍 Vous êtes ici</button>' : '<button data-cn="monde-ici" data-id="' + id + '">📍 Je suis ici</button>') +
      '<button data-cn="monde-deplacer" data-id="' + id + '">✋ Déplacer sur la carte</button></div>';
    if (vois.length) h += '<label class="cn-lbl2" style="margin-top:12px">Routes</label>' + vois.map(function (v) {
      return '<div class="cn-resl"><span>' + esc(v.lieu.nom) + ' · ' + v.route.jours + ' j</span><button class="btn btn-sm" data-cn="monde-delier" data-id="' + v.route.id + '" data-l="' + id + '">✕</button></div>';
    }).join('');
    var autres = c.lieux.filter(function (x) { return x.id !== id; });
    if (autres.length) {
      h += '<label class="cn-lbl2" style="margin-top:12px">🔗 Relier à…</label><div class="cn-mini">' + autres.map(function (x) {
        return '<span class="chip' + (monde.cible === x.id ? ' on' : '') + '" data-cn="monde-cible" data-id="' + x.id + '" data-l="' + id + '">' + esc(x.nom) + '</span>';
      }).join('') + '</div>';
      if (monde.cible) {
        h += '<div class="grille2" style="align-items:center"><div class="note">Durée</div>' + compteur('monde-jours', monde.jours, 'jour(s)') + '</div>' +
          '<div class="cn-mini" style="margin-top:6px">' + (COF.ENVIRONNEMENTS || []).map(function (e) {
            return '<span class="chip' + (monde.env === e.id ? ' on' : '') + '" data-cn="monde-env" data-v="' + e.id + '" data-l="' + id + '">' + e.ic + ' ' + esc(e.nom) + '</span>';
          }).join('') + '</div>' +
          '<button class="btn btn-bloc btn-or" data-cn="monde-relier" data-l="' + id + '">🔗 Tracer la route</button>';
      }
    }
    h += '<button class="btn btn-bloc" style="margin-top:10px" data-cn="editer" data-l="lieux" data-id="' + id + '">✏️ Nom et notes</button></details>';
    ouvrir('📍 ' + l.nom, h, { type: 'lieu', id: id });
  }

  function htmlListe(c, l) {
    var L = LISTES[l], items = c[l].slice();
    if (l === 'lieux' && COF.Monde) return htmlCarteMonde(c) + htmlListeBase(c, l, L, items);
    if (l === 'pnj' && COF.UI.Compagnie) return COF.UI.Compagnie.html(c) + htmlListeBase(c, l, L, items);
    return htmlListeBase(c, l, L, items);
  }
  function htmlListeBase(c, l, L, items) {
    if (l === 'fils') items.sort(function (a, b) { return (b.ouvert ? 1 : 0) - (a.ouvert ? 1 : 0); });
    var h = '<div class="carte"><h2>' + esc(L.titre) + '</h2><div class="carte-corps">' +
      '<div class="cn-ajout"><input id="cn-nouveau" placeholder="' + esc(L.ph) + '"><button class="btn btn-plein" data-cn="ajouter" data-l="' + l + '" aria-label="Ajouter">＋</button></div>';
    if (!items.length) h += '<div class="vide">' + esc(L.vide) + '</div>';
    items.forEach(function (x) {
      var att = l === 'pnj' ? ATTITUDES.filter(function (a) { return a[0] === x.attitude; })[0] || ATTITUDES[1] : null;
      h += '<div class="cn-item' + (l === 'fils' && !x.ouvert ? ' ferme' : '') + '" data-cn="editer" data-l="' + l + '" data-id="' + x.id + '">' +
        '<div class="info"><div class="t">' + (l === 'fils' && !x.ouvert ? '✓ ' : '') +
          (l === 'lieux' && COF.Monde ? ((COF.Monde.envDe(x.env) || {}).ic || '') + ' ' : '') + (l === 'lieux' && x.id === c.position ? '📍 ' : '') + esc(x.nom) +
          (att ? ' <span class="puce" style="border-color:' + att[1] + ';color:' + att[1] + '">' + esc(att[0]) + '</span>' : '') +
          (x.compagnon && x.compagnon.actif ? ' <span class="puce" style="border-color:var(--or);color:var(--or-clair)">🤝 ' + esc((X.ROLES[x.compagnon.role] || {}).nom || 'compagnon') + ' niv. ' + x.compagnon.niveau + '</span>' : '') + '</div>' +
          (x.quete ? htmlEtapes(x.quete) : '') +
          (x.note ? '<div class="s">' + esc(x.note.length > 140 ? x.note.slice(0, 140) + '…' : x.note) + '</div>' : '') + '</div>' +
        (l === 'fils' ? '<button class="btn btn-sm" data-cn="basculer" data-id="' + x.id + '" aria-label="' + (x.ouvert ? 'Résoudre' : 'Rouvrir') + '">' + (x.ouvert ? '✓' : '↺') + '</button>' : '') +
        '</div>';
    });
    if (l === 'fils') h += '<button class="btn btn-plein btn-bloc" style="margin-top:10px" data-cn="nouvelle-quete">📜 Nouvelle quête<small style="display:block;font-size:11px;opacity:.8">commanditaire, lieu sur la carte et 5 étapes</small></button>';
    else h += '<button class="btn btn-bloc" style="margin-top:10px" data-cn="aller" data-v="' + L.gen[0] + '">' + esc(L.gen[1]) + ' puis 📌</button>';
    return h + '</div></div>';
  }
  /* Progression d'une quête : 📜 → 🔍 → 🌀 → ⚔️ → 🏁 */
  function htmlEtapes(q) {
    var E = COF.Directeur.ETAPES;
    return '<div class="cn-etapes">' + E.map(function (e, i) {
      return '<span class="' + (i < q.etape ? 'fait' : (i === q.etape ? 'ici' : '')) + '" title="' + esc(e.nom) + '">' + e.ic + '</span>';
    }).join('') + '<b>' + (q.etape >= E.length ? '🏆 accomplie' : esc(E[q.etape].nom)) + '</b>' +
      '<small>👤 ' + esc(q.comNom) + ' · 📍 ' + esc(q.lieuNom) + '</small></div>';
  }

  /* ---------- Onglet Expédition (donjon suivi / voyage en étapes) ---------- */
  function compteur(id, valeur, unite) {
    return '<div class="cn-cpt"><button data-cn="cpt" data-k="' + id + '" data-v="-1" aria-label="Moins">−</button><span>' + valeur +
      (unite ? ' <small>' + unite + '</small>' : '') + '</span><button data-cn="cpt" data-k="' + id + '" data-v="1" aria-label="Plus">+</button></div>';
  }
  function puceEnv(sel, cle) {
    return '<div class="cn-mini">' + (COF.ENVIRONNEMENTS || []).map(function (e) {
      return '<span class="chip' + (sel === e.id ? ' on' : '') + '" data-cn="expe-env" data-k="' + cle + '" data-v="' + e.id + '">' + e.ic + ' ' + esc(e.nom) + '</span>';
    }).join('') + '</div>';
  }
  function boiteRencontre(r, cle, vaincue) {
    if (!r) return '';
    return '<div class="cn-menace' + (vaincue ? ' ok' : '') + '"><div class="t">' + (vaincue ? '✓ Menace écartée' : '⚔️ Menace') +
      ' <small>' + esc(r.difficulte) + '</small></div><div class="s">' + esc(r.texte) + '</div>' +
      (vaincue ? '' : '<div class="cn-grille" style="margin-top:8px"><button data-cn="expe-combat" data-k="' + cle + '">⚔️ Combattre (Arène)</button>' +
        '<button data-cn="expe-vaincue" data-k="' + cle + '">✓ Écartée / évitée</button></div>') + '</div>';
  }
  function htmlExpedition(c) {
    var x = c.expedition, h = '';
    if (!x) {
      var dernierLieu = COF.Monde && COF.Monde.ici(c) ? COF.Monde.ici(c).nom : (c.lieux[0] ? c.lieux[0].nom : '');
      /* Par défaut, le terrain du lieu actuel (donjon : ruines si on est en ville ou en plaine) */
      var envL = COF.Monde ? COF.Monde.envIci(c) : null;
      if (envL && !expe.envChoisi) expe.env = (envL === 'urbain' || envL === 'plaine') ? 'ruines' : envL;
      if (envL && !expe.envVChoisi) expe.envV = envL === 'urbain' ? 'plaine' : envL;
      h += '<div class="carte"><h2>🗝️ Explorer un donjon</h2><div class="carte-corps">' +
        '<div class="champ"><label>Nom du lieu</label><input id="cn-x-nom" value="' + esc(expe.nom) + '" placeholder="Les cryptes de Brumeval"></div>' +
        '<label class="cn-lbl2">Taille</label><div class="cn-grille cn-g3">' + [['petit', 'Petit', 5], ['moyen', 'Moyen', 8], ['grand', 'Grand', 12]].map(function (t) {
          return '<button data-cn="expe-taille" data-v="' + t[0] + '" class="' + (expe.taille === t[0] ? 'on' : '') + '">' + t[1] + '<small>' + t[2] + ' salles</small></button>';
        }).join('') + '</div>' +
        '<label class="cn-lbl2" style="margin-top:10px">Environnement des créatures</label>' + puceEnv(expe.env, 'env') +
        '<button class="btn btn-plein btn-bloc" data-cn="expe-donjon">🕯️ Entrer</button></div></div>';
      var icic = COF.Monde ? COF.Monde.ici(c) : null, vv = icic ? COF.Monde.voisins(c, icic.id) : [];
      h += '<div class="carte"><h2>🧭 Partir en voyage</h2><div class="carte-corps">' +
        (vv.length ? '<label class="cn-lbl2">Routes connues depuis ' + esc(icic.nom) + '</label><div class="cn-liste-gen" style="margin-bottom:12px">' + vv.map(function (v) {
          return '<button data-cn="monde-voyager" data-id="' + v.lieu.id + '"><span class="ic">🧭</span><span><b>' + esc(v.lieu.nom) + '</b><small>' + v.route.jours + ' jour(s) · ' +
            esc(((COF.ENVIRONNEMENTS || []).filter(function (e) { return e.id === v.route.env; })[0] || {}).nom || '') + '</small></span></button>';
        }).join('') + '</div><label class="cn-lbl2">Ou vers une nouvelle destination</label>' : '') +
        '<div class="grille2"><div class="champ"><label>Départ</label><input id="cn-x-dep" value="' + esc(expe.depart || dernierLieu) + '" placeholder="Brumeval"></div>' +
        '<div class="champ"><label>Destination</label><input id="cn-x-dest" value="' + esc(expe.destination) + '" placeholder="Osgild"></div></div>' +
        '<div class="grille2"><div class="champ"><label>Durée</label>' + compteur('jours', expe.jours, 'jour(s)') + '</div>' +
        '<div class="champ"><label>Rations emportées</label>' + compteur('r-rations', X.ressources(c).rations, '') + '</div></div>' +
        '<label class="cn-lbl2">Terrain</label>' + puceEnv(expe.envV, 'envV') +
        '<button class="btn btn-plein btn-bloc" data-cn="expe-voyage">🧭 Prendre la route</button></div></div>';
      return h;
    }
    if (x.type === 'donjon') {
      var s = X.salleCourante(x);
      h += '<div class="carte"><h2>🗝️ ' + esc(x.nom) + '<span class="h2-action" data-cn="expe-quitter">Sortir</span></h2><div class="carte-corps">' +
        '<div class="cn-plan">' + x.salles.map(function (sa) {
          return '<span class="' + X.etatSalle(x, sa) + (sa.finale ? ' finale' : '') + '" title="Salle ' + sa.n + '">' + sa.n + '</span>';
        }).join('') + Array(Math.max(0, x.nbSalles - x.salles.length) + 1).join('<span class="vide"></span>') + '</div>' +
        '<div class="note">Niveau ' + x.niveau + ' · ' + x.salles.length + '/' + x.nbSalles + ' salles · ' +
          '<span style="color:#85bb7f">■</span> vidée <span style="color:var(--or)">■</span> en cours <span style="color:var(--text-dim)">■</span> explorée</div>' +
        '</div></div>';
      if (s) {
        var ch = s.champs;
        h += '<div class="carte"><h2>Salle ' + s.n + (s.finale ? ' · finale' : '') + '</h2><div class="carte-corps">' +
          [['🏛️', ch.forme], ['🕸️', ch.etat], ['👁️', ch.occupant], ['✨', ch.particularite], ['🚪', ch.sortie]].map(function (l) {
            return '<div class="cn-l"><span>' + l[0] + '</span><div>' + esc(l[1]) + '</div></div>';
          }).join('') +
          (s.piege ? '<div class="cn-menace piege"><div class="t">⚠️ Piège' + (s.piegeRepere ? ' repéré' : ' possible') + '</div><div class="s">' +
            esc(s.piegeRepere ? ch.piege : 'Quelque chose cloche dans cette salle… Mieux vaut vérifier avant d’avancer.') + '</div>' +
            '<div class="cn-grille" style="margin-top:8px">' +
              (s.piegeRepere ? '' : '<button data-cn="expe-test" data-e="detecter" data-a="Détecter le piège" data-c="PER" data-d="15">🔍 Détecter (PER 15)</button>') +
              '<button data-cn="expe-test" data-e="desamorcer" data-a="Désamorcer le piège" data-c="AGI" data-d="' + (s.piegeRepere ? 15 : 18) + '">🛠️ Désamorcer (AGI ' + (s.piegeRepere ? 15 : 18) + ')</button></div></div>'
            : (s.piegeNeutralise ? '<div class="cn-menace ok"><div class="s">✓ Piège neutralisé.</div></div>'
              : (s.piegeDeclenche ? '<div class="cn-menace"><div class="s">💥 Le piège s’est déclenché : ' + esc(ch.piege) + '</div></div>' : ''))) +
          boiteRencontre(s.rencontre, 'salle', s.vaincue) +
          (s.butin ? '<div class="cn-menace ok"><div class="t">💰 Butin</div><div class="s">' + esc(texteButin(s.butin)) + '</div>' +
            (s.butinPris ? '<div class="note" style="margin-top:6px">✓ Ajouté à la fiche</div>' : '<button class="btn btn-bloc" style="margin-top:8px" data-cn="expe-prendre">📥 Prendre le butin</button>') + '</div>' : '') +
          (s.fouillee ? (s.butin ? '' : '<div class="note" style="margin-top:10px">Salle fouillée : rien de plus à trouver.</div>')
            : '<div class="cn-grille" style="margin-top:10px">' +
              '<button data-cn="expe-test" data-e="fouille" data-a="Fouiller la salle" data-c="PER" data-d="12">🔎 Fouiller (PER 12)</button>' +
              '<button data-cn="expe-fouiller">💰 Fouille rapide</button></div>' +
              '<div class="note" style="margin-top:4px">Le test de fouille trouve ce qui est caché ; la fouille rapide ne demande pas de jet.</div>') +
          '</div></div>';
      }
      h += s && s.finale ? '<button class="btn btn-plein btn-bloc" data-cn="expe-quitter">🏁 Terminer l’exploration</button>'
        : '<button class="btn btn-plein btn-bloc" data-cn="expe-salle">🚪 ' + (s ? 'Salle suivante' : 'Première salle') + '</button>';
      return h;
    }
    /* Voyage */
    var et = x.etapes[x.etapes.length - 1], pct = Math.round(100 * x.fait / x.jours);
    h += '<div class="carte"><h2>🧭 ' + esc(x.depart) + ' → ' + esc(x.destination) + '<span class="h2-action" data-cn="expe-quitter">Arrêter</span></h2><div class="carte-corps">' +
      '<div class="barre"><span style="width:' + pct + '%;background:linear-gradient(90deg,#8a6d18,var(--or-clair))"></span></div>' +
      '<div class="cn-voyage-l"><span>Jour ' + x.fait + ' / ' + x.jours + '</span><span>🍖 ' + compteur('ration-v', X.ressources(c).rations, '') + '</span></div></div></div>';
    if (et) {
      h += '<div class="carte"><h2>Jour ' + et.jour + '</h2><div class="carte-corps">' +
        '<div class="cn-l"><span>🌦️</span><div>' + esc(et.meteo) + '</div></div>' +
        '<div class="cn-l"><span>🧭</span><div><b>' + esc((COF.VOYAGE_CATEGORIES_LABELS || {})[et.categorie] || et.categorie) + '</b> — ' + esc(et.detail) + '</div></div>' +
        (et.faim ? '<div class="cn-l"><span>🍖</span><div style="color:var(--sang-clair)">Plus de rations : il faut chasser, cueillir ou acheter.</div></div>' : '') +
        (et.decouverte ? '<div class="cn-menace ok"><div class="t">🗺️ Découverte</div><div class="s">' + ((COF.Monde.envDe(et.decouverte.env) || {}).ic || '') + ' ' + esc(et.decouverte.nom) +
          ' — ajouté à la carte.</div><div class="cn-grille" style="margin-top:8px"><button data-cn="decouverte-halte" data-id="' + et.decouverte.id + '">⛺ Faire halte et explorer</button>' +
          '<button data-cn="onglet" data-v="lieux">🗺️ Voir la carte</button></div></div>' : '') +
        (et.rencontre ? (et.nuit ? '<div class="note" style="margin-top:6px">🌙 Pendant la nuit…</div>' : '') + boiteRencontre(et.rencontre, 'etape', et.vaincue) : '') +
        (et.oriente && et.chasse ? '' : '<div class="cn-grille" style="margin-top:10px">' +
          (et.oriente ? '<button disabled>✓ Orientation</button>' : '<button data-cn="expe-test" data-e="orienter" data-a="S’orienter" data-c="PER" data-d="10">🧭 S’orienter (PER 10)</button>') +
          (et.chasse ? '<button disabled>✓ Chasse</button>' : '<button data-cn="expe-test" data-e="chasser" data-a="Chasser / cueillir" data-c="PER" data-d="15">🏹 Chasser (PER 15)</button>') + '</div>' +
          '<div class="note" style="margin-top:4px">Raté, l’orientation coûte un jour ; réussie, la chasse rapporte des rations.</div>') +
        '</div></div>';
    }
    h += x.arrive ? '<button class="btn btn-plein btn-bloc" data-cn="expe-quitter" data-v="arrive">🏁 Arrivé à ' + esc(x.destination) + '</button>'
      : '<button class="btn btn-plein btn-bloc" data-cn="expe-jour">☀️ ' + (et ? 'Jour suivant' : 'Premier jour de route') + '</button>';
    return h;
  }
  function texteButin(b) {
    var m = [b.po + ' po ' + b.pa + ' pa ' + b.pc + ' pc'];
    (b.objets || []).forEach(function (o) { m.push(o.nom); });
    (b.tresors || []).forEach(function (t) { m.push(t.nom); });
    if (b.magique) m.push('✨ ' + b.magique.nom);
    if (b.magique2) m.push('✨ ' + b.magique2.nom);
    return m.join(' · ');
  }
  function memoExpe() {
    ['nom:cn-x-nom', 'depart:cn-x-dep', 'destination:cn-x-dest'].forEach(function (s) {
      var k = s.split(':'), n = $('#' + k[1]); if (n) expe[k[0]] = n.value;
    });
  }

  /* ---------- Action libre : le joueur écrit, le Conteur interprète ---------- */
  var libre = { texte: '', carac: null };
  function sheetLibre() {
    var c = K.actif(), p = perso(c), it = libre.texte ? COF.Conteur.interpreter(c, libre.texte) : null;
    var caracs = ['FOR', 'AGI', 'CON', 'PER', 'CHA', 'INT', 'VOL'];
    var h = '<div class="champ"><label>Que fait ' + esc(p ? p.nom : 'le héros') + ' ?</label><textarea id="cn-libre-txt" rows="3" placeholder="Je grimpe au mur pour entrer par la fenêtre, prudemment…">' + esc(libre.texte) + '</textarea></div>' +
      '<button class="btn btn-bloc" data-cn="libre-analyser">🔍 Comment l’app comprend-elle ?</button>';
    if (it) h += '<div class="note" style="margin-top:6px">Caractéristique : <b>' + (libre.carac || it.carac) + '</b>' + (libre.carac ? ' (choisie)' : '') + ' · difficulté ' + (COF.Conteur.difficulteBase(c) + it.mod) +
      '<br>' + esc(it.raisons.join(' · ')) + '</div>';
    h += '<label class="cn-lbl2" style="margin-top:8px">Forcer une caractéristique (facultatif)</label><div class="cn-grille cn-g4">' + caracs.map(function (k) {
      return '<button data-cn="libre-carac" data-v="' + k + '" class="' + (libre.carac === k ? 'on' : '') + '">' + k + '<small>' + sgn(p ? COF.Calc.carac(p, k) : 0) + '</small></button>';
    }).join('') + '</div>' +
      '<button class="btn btn-plein btn-bloc" style="margin-top:12px" data-cn="libre-ok">🎲 Tenter</button>' +
      '<button class="btn btn-bloc" style="margin-top:6px" data-cn="test">Test détaillé (compétences, difficulté…)</button>';
    ouvrir('✍️ Action libre', h, { type: 'libre' });
  }

  /* ---------- Export du récit (texte à copier, télécharger, partager) ---------- */
  function sheetExport(titre, texte, fichier) {
    ouvrir(titre, '<div class="note" style="margin-bottom:6px">Le récit en texte continu, sans les jets de dés. ' + texte.split(/\s+/).length + ' mots.</div>' +
      '<textarea id="cn-export-txt" class="cn-export-txt" readonly>' + esc(texte) + '</textarea>' +
      '<div class="cn-grille cn-g3" style="margin-top:8px"><button data-cn="copier-export" class="on">📋 Copier</button><button data-cn="dl-export">⬇️ .txt</button>' +
      (navigator.share ? '<button data-cn="partager-export">📤 Partager</button>' : '<button disabled>📤</button>') + '</div>', { type: 'export', fichier: fichier });
  }
  /* Aventure terminée (lecture seule) : épilogue et exports. */
  function htmlArchive(cx, compact) {
    var t = cx.termine || {};
    return (compact ? '' : '<div class="cn-recit fin"><span class="cn-recit-fin">❧</span><p>' + esc(t.epilogue || '') + '</p></div>') +
      (t.niveau && !compact ? '<div class="cn-changes"><div>⬆️ ' + esc((perso(cx) || {}).nom || 'Le héros') + ' atteint le <b>niveau ' + t.niveau + '</b>.' +
        (perso(cx) && COF.Calc.pointsCapacite(perso(cx)).reste > 0 ? ' <a href="#" data-cn="rangs-niveau">Choisir ses nouveaux rangs</a>' : '') + '</div></div>' : '') +
      '<button class="btn btn-plein btn-bloc cn-gros" data-cn="export-aventure" data-id="' + cx.id + '">📜 Exporter le récit complet<small>toutes les scènes à la suite, en un seul texte</small></button>' +
      '<label class="cn-lbl2" style="margin-top:10px">Une scène seule</label><div class="cn-comps">' + cx.scenes.map(function (s) {
        return '<button data-cn="export-scene" data-c="' + cx.id + '" data-id="' + s.id + '"><b>' + s.n + '.</b> ' + esc(s.titre) + '<small>jour ' + (s.jour || 1) + '</small></button>';
      }).join('') + '</div>';
  }
  function sheetArchive(cx) {
    ouvrir('🏁 ' + cx.titre, '<div class="note" style="margin-bottom:8px">Aventure terminée' + (cx.campagne ? ' · campagne « ' + esc(cx.campagne.nom) + ' », chapitre ' + cx.campagne.numero : '') +
      ' · jour ' + (cx.termine.jour || cx.jour) + '. Elle ne se rouvre plus, mais son récit reste disponible.</div>' + htmlArchive(cx, false), { type: 'archive' });
  }
  /* ---------- Page Campagne ---------- */
  function sheetCampagne() {
    var c = K.actif(), b = COF.Campagne.bilan(c);
    var h = '<div class="note" style="margin-bottom:8px">' + (b.heros ? esc(b.heros.nom) + ' · niveau ' + b.heros.niveau + ' · ' : '') + b.chapitres.length + ' chapitre(s)</div>' +
      '<div class="cn-frise">' + b.chapitres.map(function (x) {
        return '<div class="cn-frise-ch' + (x.id === c.id ? ' on' : '') + '"><div class="n">' + x.numero + '</div><div class="i"><b>' + esc(x.titre) + '</b>' +
          '<small>' + (x.menace ? '🌑 ' + esc(x.menace) + ' · ' : '') + esc(x.issue) + ' · ' + x.jours + ' j · ' + x.scenes + ' scènes' + (x.niveau ? ' · ⬆️ niv. ' + x.niveau : '') + '</small></div>' +
          '<button class="cn-frise-x" data-cn="export-aventure" data-id="' + x.id + '" aria-label="Exporter le récit">📜</button></div>';
      }).join('') + '</div>';
    if (b.allies.length) h += '<div class="cn-l" style="margin-top:8px"><span>🤝</span><div>' + esc(b.allies.slice(0, 8).join(', ')) + '</div></div>';
    if (b.nemesis.length) h += '<div class="cn-l"><span>☠️</span><div>Némésis : ' + esc(b.nemesis.join(', ')) + '</div></div>';
    h += '<button class="btn btn-plein btn-bloc cn-gros" style="margin-top:10px" data-cn="export-campagne">📜 Récit de toute la campagne<small>tous les chapitres à la suite, en un seul texte</small></button>' +
      '<div class="cn-grille" style="margin-top:8px"><button data-cn="fichier-campagne">💾 Fichier de campagne</button><button data-cn="import-campagne">📥 Importer</button></div>' +
      '<div class="note" style="margin-top:6px">Le fichier contient les aventures et le héros de cette campagne : pour la sauvegarder, l’envoyer, ou la reprendre sur un autre appareil. L’import ajoute une copie, sans rien écraser.</div>';
    ouvrir('📚 Campagne « ' + b.nom + ' »', h, { type: 'campagne' });
  }
  /* Montée de niveau guidée : ce qui change, et les rangs de voie à choisir. */
  function sheetNiveau(c, pvAv) {
    var p = perso(c); if (!p) { fermer(); return; }
    var Kc = COF.Calc, pc = Kc.pointsCapacite ? Kc.pointsCapacite(p) : null;
    var h = '<div class="resultat crit"><div class="grand">⬆️ ' + p.niveau + '</div><div class="verdict ok" style="font-size:18px">' + esc(p.nom) + ' passe au niveau ' + p.niveau + ' !</div></div>' +
      '<div class="cn-changes" style="margin-top:10px">' +
      '<div>❤️ PV maximum : <b>' + Kc.pvMax(p) + '</b>' + (typeof pvAv === 'number' && typeof p.pv === 'number' && p.pv > pvAv ? ' (+' + (p.pv - pvAv) + ' PV)' : '') + '</div>' +
      (pc ? '<div>📜 Points de capacité à dépenser : <b>' + Math.max(0, pc.reste) + '</b> (2 par niveau)</div>' : '') +
      '<div>🎯 Bonus d’attaque et caractéristiques : recalculés automatiquement sur la fiche.</div></div>' +
      '<div class="note" style="margin-top:6px">En COF2, chaque niveau donne 2 points pour acheter de nouveaux rangs dans les voies (rang 1 et 2 : 1 point, rang 3 et plus : 2 points).</div>' +
      '<button class="btn btn-plein btn-bloc cn-gros" style="margin-top:10px" data-cn="aller-voies">📜 Choisir mes nouveaux rangs de voie</button>' +
      '<button class="btn btn-bloc" style="margin-top:8px" data-cn="fermer">Plus tard</button>';
    ouvrir('⬆️ Montée de niveau', h, { type: 'niveau' });
  }
  function sheetFinAventure() {
    var c = K.actif(), s = c.saga, p = perso(c);
    ouvrir('🏁 Clore l’aventure', '<div class="note" style="margin-bottom:8px">' + (s && s.fini ? 'La quête majeure est accomplie.' : 'La quête majeure n’est pas terminée : l’aventure s’achèvera sur un dénouement ouvert.') +
      ' Un épilogue est écrit, ' + (p ? esc(p.nom) + ' gagne un niveau' : 'le héros gagne un niveau') + ', et l’aventure passe en lecture seule (son récit reste exportable). Vous pourrez ensuite enchaîner sur le chapitre suivant de la campagne.</div>' +
      '<button class="btn btn-plein btn-bloc cn-gros ok" data-cn="fin-ok">🏁 Clore l’aventure<small>épilogue · niveau +1</small></button>' +
      '<button class="btn btn-bloc" style="margin-top:8px" data-cn="fermer">Pas encore</button>', { type: 'fin' });
  }

  /* ---------- Récap des factions ---------- */
  function htmlFactions(c) {
    if (!COF.Factions) return '';
    return '<div class="carte"><h2>🏛️ Factions</h2><div class="carte-corps">' + COF.Factions.liste(c).map(function (f) {
      var j = ''; for (var i = -3; i <= 3; i++) j += '<span class="' + (i === 0 ? 'z ' : '') + ((f.rep > 0 && i > 0 && i <= f.rep) || (f.rep < 0 && i < 0 && i >= f.rep) ? (f.rep > 0 ? 'on' : 'neg') : '') + '"></span>';
      return '<div class="cn-fac"><div class="t">' + f.ic + ' ' + esc(f.nom) + ' <small>' + COF.Factions.lib(f.rep) + '</small></div><div class="cn-fac-j">' + j + '</div></div>';
    }).join('') + '<div class="note" style="margin-top:8px">Les petites affaires, les imprévus et les conversations font bouger ces réputations. À +2, une faction accorde une faveur ; à −2, elle agit contre le héros. Aider l’une fâche parfois sa rivale.</div></div></div>' + htmlEchos(c);
  }
  /* Ce que le monde n'a pas oublié (conséquences à venir et passées). */
  function htmlEchos(c) {
    if (!COF.Echos) return '';
    var att = COF.Echos.enAttente(c), vus = COF.Echos.souvenirs(c);
    var h = '<div class="carte"><h2>🕯️ Ce qu’on n’a pas oublié</h2><div class="carte-corps">';
    if (!att.length && !vus.length) h += '<div class="vide">Rien pour l’instant. Les actes marquants du héros (menaces, dettes, villages aidés ou abandonnés…) auront des suites.</div>';
    if (att.length) h += '<div class="cn-attend">' + att.slice(-8).map(function (e) { return '<div>' + esc(COF.Echos.libelle(c, e)) + '</div>'; }).join('') + '</div>';
    if (vus.length) h += '<label class="cn-lbl2" style="margin-top:8px">Déjà arrivé</label><div class="cn-attend passe">' + vus.map(function (e) { return '<div>' + esc(COF.Echos.libelle(c, e)) + ' → jour ' + (e.quand || '?') + '</div>'; }).join('') + '</div>';
    return h + '<div class="note" style="margin-top:8px">Ces souvenirs ressurgissent quelques jours plus tard, au détour d’une scène.</div></div></div>';
  }
  /* ---------- Onglet Journal ---------- */
  function htmlJournal(c) {
    var h = '<div class="cn-export"><button class="btn btn-or" data-cn="export-aventure">📜 Récit complet (texte)</button>' +
      '<button class="btn" data-cn="partager">📤 Détaillé</button><button class="btn" data-cn="telecharger">⬇️ .md</button></div>';
    if (!c.scenes.length) return h + '<div class="vide">Le journal se remplit au fil des scènes.</div>';
    c.scenes.slice().reverse().forEach(function (s, i) {
      h += '<div class="carte pliable' + (i > 0 ? ' ferme' : '') + '"><h2 data-cn="plier">' + s.n + '. ' + esc(s.titre) +
        ' <small style="color:var(--text-mute);font-weight:normal">· jour ' + (s.jour || 1) + (s.close ? '' : ' · en cours') + '</small></h2><div class="carte-corps">' +
        (s.attendu ? '<div class="note">Attendu : ' + esc(s.attendu) + '</div>' : '') + bandeauTest(s.test) +
        s.entrees.map(function (e) { return '<div class="cn-lu">' + esc(K.texteEntree(e)).replace(/\n/g, '<br>') + '</div>'; }).join('') +
        (s.close ? '<div class="note" style="margin-top:6px">🏁 ' + (s.controle ? 'Le héros garde la main' : 'Ça tourne mal') + (s.resume ? ' — ' + esc(s.resume) : '') + '</div>' : '') +
        '<button class="btn btn-bloc" style="margin-top:8px" data-cn="export-scene" data-id="' + s.id + '">📜 Exporter le texte de cette scène</button>' +
        '</div></div>';
    });
    return h;
  }

  /* ================= Feuilles (bas d'écran) ================= */
  function ouvrir(titre, html, ctx) { sheet = ctx || {}; COF.UI.ouvrirModale(titre, '<div id="cn-sheet">' + html + '</div>'); }
  function fermer() { sheet = null; COF.UI.fermerModale(); }

  function sheetOracle() {
    ouvrir('🔮 Oracle', '<div class="champ"><label>Votre question (oui/non)</label><input id="cn-q" placeholder="Le garde me laisse-t-il passer ?"></div>' +
      '<label class="cn-lbl2">Vraisemblance</label><div class="cn-grille">' + COF.ORACLE_LIKELIHOOD.map(function (l) {
        return '<button data-cn="likelihood" data-v="' + l.id + '" class="' + (oracleL === l.id ? 'on' : '') + '">' + esc(l.nom) + '</button>';
      }).join('') + '</div><button class="btn btn-plein btn-bloc" style="margin-top:12px" data-cn="demander">🔮 Demander</button>' +
      '<div class="note" style="margin-top:8px">La tension actuelle (' + K.actif().tension + ') décale la réponse et la fréquence des événements.</div>', { type: 'oracle' });
    setTimeout(function () { var q = $('#cn-q'); if (q) q.focus(); }, 50);
  }
  /* preset : { action, carac, diff } pour un test proposé par l'app (piège…) */
  function sheetTest(preset) {
    var c = K.actif(), p = perso(c);
    if (preset) { jet.action = preset.action || ''; jet.carac = preset.carac || jet.carac; jet.diff = preset.diff || jet.diff; jet.comps = {}; jet.oracle = null; jet.effet = preset.effet || null; }
    var caracs = COF.RULES ? COF.RULES.caracs : [{ id: 'FOR' }, { id: 'AGI' }, { id: 'CON' }, { id: 'PER' }, { id: 'CHA' }, { id: 'INT' }, { id: 'VOL' }];
    var comps = X.toutesCompetences(p);
    var h = '<div class="champ"><label>Action</label><input id="cn-jet-action" value="' + esc(jet.action) + '" placeholder="Crocheter la serrure…"></div>' +
      htmlActionsSuggerees(c) +
      '<div class="cn-mini">' + X.ACTIONS.map(function (a, i) {
        return '<span class="chip' + (jet.action === a[0] ? ' on' : '') + '" data-cn="jet-action" data-i="' + i + '">' + esc(a[0]) + ' · ' + a[1] + '</span>';
      }).join('') + '</div>' +
      '<label class="cn-lbl2">Caractéristique' + (p ? ' de ' + esc(p.nom) : '') + '</label><div class="cn-grille cn-g4">' + caracs.map(function (k) {
        var v = p ? COF.Calc.carac(p, k.id) : 0;
        return '<button data-cn="jet-carac" data-v="' + k.id + '" class="' + (jet.carac === k.id ? 'on' : '') + '">' + k.id + '<small>' + sgn(v) + '</small></button>';
      }).join('') + '</div>' +
      (comps.length ? '<label class="cn-lbl2" style="margin-top:10px">Bonus de compétence (voies)</label><div class="cn-comps">' + comps.map(function (x, i) {
        var nom = String(x.nom); nom = nom.length > 34 ? nom.slice(0, 34) + '…' : nom;
        return '<button data-cn="jet-comp" data-i="' + i + '" class="' + (jet.comps[i] ? 'on' : '') + '"><b>+' + x.valeur + '</b> ' + esc(nom) +
          '<small>' + esc(x.cap) + '</small></button>';
      }).join('') + '</div>' : '') +
      '<label class="cn-lbl2" style="margin-top:10px">Difficulté</label><div class="cn-grille cn-g3">' + [[10, 'Facile'], [12, 'Simple'], [15, 'Moyenne'], [18, 'Ardue'], [20, 'Difficile'], [25, 'Héroïque']].map(function (d) {
        return '<button data-cn="jet-diff" data-v="' + d[0] + '" class="' + (jet.diff === d[0] ? 'on' : '') + '">' + d[0] + '<small>' + d[1] + '</small></button>';
      }).join('') + '</div>' +
      '<button class="btn btn-bloc" style="margin-top:6px" data-cn="jet-oracle">🔮 Laisser l’oracle juger la difficulté</button>' +
      (jet.oracle ? '<div class="note" style="margin-top:4px">L’oracle estime : <b>' + esc(jet.oracle) + '</b> (tension ' + c.tension + ').</div>' : '') +
      '<div class="cn-grille" style="margin-top:8px"><button data-cn="jet-bonus" class="' + (jet.bonus ? 'on' : '') + '">Dé bonus</button>' +
        '<button data-cn="jet-malus" class="' + (jet.malus ? 'on' : '') + '">Dé malus</button></div>' +
      '<button class="btn btn-plein btn-bloc" style="margin-top:12px" data-cn="lancer">🎲 Lancer</button>' +
      '<div class="note" style="margin-top:8px">En cas d’échec, l’app propose une conséquence ; sur un 20, un avantage.</div>';
    ouvrir('🎲 Test', h, { type: 'test', comps: comps });
  }
  /* Tests typiques du terrain où se trouve le héros, proposés en premier. */
  var TESTS_TERRAIN = {
    foret: ['Pister', 'Survie', 'Discrétion', 'Escalader'], plaine: ['Repérer / fouiller', 'Pister', 'Endurer', 'Survie'],
    montagne: ['Escalader', 'Endurer', 'Survie', 'Acrobatie'], marais: ['Nager', 'Résister au poison', 'Endurer', 'Survie'],
    souterrain: ['Repérer / fouiller', 'Discrétion', 'Escalader', 'Se concentrer'], arctique: ['Endurer', 'Survie', 'Escalader', 'Repérer / fouiller'],
    urbain: ['Persuader', 'Mentir / bluffer', 'Intimider', 'Se souvenir / savoir'], ruines: ['Repérer / fouiller', 'Déchiffrer', 'Crocheter', 'Acrobatie']
  };
  function htmlActionsSuggerees(c) {
    var env = A.envCourant(c), noms = TESTS_TERRAIN[env]; if (!noms) return '';
    var e = COF.Monde.envDe(env) || {};
    return '<label class="cn-lbl2">' + (e.ic || '📍') + ' Suggérés ici (' + esc(e.nom || env) + ')</label><div class="cn-mini">' + noms.map(function (n) {
      var i = X.ACTIONS.map(function (a) { return a[0]; }).indexOf(n); if (i < 0) return '';
      return '<span class="chip' + (jet.action === n ? ' on' : '') + '" data-cn="jet-action" data-i="' + i + '">' + esc(n) + ' · ' + X.ACTIONS[i][1] + '</span>';
    }).join('') + '</div><label class="cn-lbl2">Toutes les actions</label>';
  }
  function memoAction() { var a = $('#cn-jet-action'); if (a) jet.action = a.value; }
  /* Clore : on dit si le héros a gardé la main, et quels fils ont avancé
     (celui de la scène est coché d'office). Une quête qui avance passe
     à l'étape suivante ; la dernière étape la termine (récompense). */
  function sheetClore(choix) {
    var c = K.actif(), s = K.sceneCourante(c), fo = K.filsOuverts(c);
    if (!choix) { choix = {}; if (s && s.filId) choix[s.filId] = true; }
    var h = '<div class="champ"><label>En une phrase (facultatif)</label><input id="cn-resume" value="' + esc(clore.resume || '') + '" placeholder="Le héros a trouvé la carte mais le voleur a fui."></div>';
    if (fo.length) {
      h += '<label class="cn-lbl2">🧵 Ce qui a avancé</label><div class="cn-comps">' + fo.map(function (f) {
        var q = f.quete, et = q && q.etape < 5 ? COF.Directeur.ETAPES[q.etape] : null, suiv = q ? COF.Directeur.ETAPES[q.etape + 1] : null;
        return '<button data-cn="clore-fil" data-id="' + f.id + '" class="' + (choix[f.id] ? 'on' : '') + '"><b>' + (choix[f.id] ? '☑' : '☐') + '</b> ' + esc(f.nom) +
          '<small>' + (q ? (et ? et.ic + ' ' + et.nom + ' → ' + (suiv ? suiv.ic + ' ' + suiv.nom : '🏆 quête accomplie') : '') : 'fil simple : il sera marqué résolu') + '</small></button>';
      }).join('') + '</div>';
    }
    h += '<button class="btn btn-bloc cn-gros ok" data-cn="clore-ok">✅ Le héros a gardé la main<small>tension −1</small></button>' +
      '<button class="btn btn-bloc cn-gros ko" data-cn="clore-ko">⚠️ La situation lui échappe<small>tension +1</small></button>' +
      '<div class="cn-grille" style="margin-top:10px"><button data-cn="jour" data-v="1">☀️ Jour suivant</button><button data-cn="aller" data-v="solo">🕰️ Passage du temps</button></div>';
    ouvrir('🏁 Clore la scène', h, { type: 'clore', choix: choix });
  }
  var clore = { resume: '' };
  /* brouillon : état en cours d'édition (pour re-rendre la feuille sans perdre la saisie) */
  function sheetEditer(l, id, brouillon) {
    var c = K.actif(), x = c[l].filter(function (y) { return y.id === id; })[0];
    if (!x) return;
    var b = brouillon || { nom: x.nom, note: x.note || '', attitude: x.attitude, ouvert: x.ouvert,
      comp: Object.assign({ actif: false, role: 'combattant', niveau: Math.max(1, (perso(c) || {}).niveau || 1) }, x.compagnon || {}) };
    var h = '<div class="champ"><label>Nom</label><input id="cn-e-nom" value="' + esc(b.nom) + '"></div>' +
      '<div class="champ"><label>Notes</label><textarea id="cn-e-note" rows="4">' + esc(b.note) + '</textarea></div>';
    if (l === 'pnj') h += '<label class="cn-lbl2">Attitude</label><div class="cn-grille cn-g4">' + ATTITUDES.map(function (a) {
      return '<button data-cn="attitude" data-v="' + a[0] + '" class="' + (b.attitude === a[0] ? 'on' : '') + '">' + esc(a[0]) + '</button>';
    }).join('') + '</div>';
    if (l === 'pnj') {
      h += '<label class="cn-lbl2" style="margin-top:12px">🤝 Compagnon du héros</label><div class="cn-grille">' +
        '<button data-cn="comp-actif" data-v="0" class="' + (!b.comp.actif ? 'on' : '') + '">Non</button>' +
        '<button data-cn="comp-actif" data-v="1" class="' + (b.comp.actif ? 'on' : '') + '">Rejoint le héros</button></div>';
      if (b.comp.actif) {
        var st = X.statsAllie({ nom: b.nom, compagnon: b.comp });
        h += '<div class="cn-grille cn-g3" style="margin-top:6px">' + Object.keys(X.ROLES).map(function (k) {
          var R = X.ROLES[k];
          return '<button data-cn="comp-role" data-v="' + k + '" class="' + (b.comp.role === k ? 'on' : '') + '">' + R.ic + ' ' + R.nom + '</button>';
        }).join('') + '</div>' +
          '<div class="grille2" style="margin-top:8px;align-items:center"><div class="note">Niveau</div>' + compteur('comp-niv', b.comp.niveau, '') + '</div>' +
          '<div class="note" style="margin-top:6px">PV ' + st.pvMax + ' · DEF ' + st.def + ' · Init. ' + st.init + ' · ' + st.att[0].n + ' ' + sgn(st.att[0].mod) + ' (DM ' + st.att[0].dmg + ')' +
          '<br>Profil simplifié : il rejoint le héros dans l’Arène et peut être joué par l’app (🤖).</div>';
      }
    }
    if (l === 'fils') h += '<div class="cn-grille"><button data-cn="fil-etat" data-v="1" class="' + (b.ouvert ? 'on' : '') + '">Ouvert</button>' +
      '<button data-cn="fil-etat" data-v="0" class="' + (!b.ouvert ? 'on' : '') + '">Résolu</button></div>';
    h += '<button class="btn btn-plein btn-bloc" style="margin-top:12px" data-cn="enregistrer">Enregistrer</button>' +
      '<div class="cn-grille" style="margin-top:8px"><button data-cn="mentionner">📌 Noter dans la scène</button><button data-cn="retirer" class="ko">🗑️ Supprimer</button></div>';
    ouvrir(LISTES[l].titre, h, { type: 'editer', l: l, id: id, attitude: b.attitude, ouvert: b.ouvert, comp: b.comp });
  }
  function sheetMenu() {
    var c = K.actif(), l = K.tous(), p = COF.Store.actif();
    var h = '<div class="champ"><label>Titre</label><input id="cn-m-titre" value="' + esc(c.titre) + '"></div>' +
      '<div class="cn-grille"><button data-cn="renommer">✏️ Renommer</button>' +
      (p ? '<button data-cn="lier">🔗 Héros : ' + esc(p.nom) + '</button>' : '<button disabled>Aucun perso actif</button>') + '</div>' +
      '<div class="cn-grille" style="margin-top:8px"><button data-cn="jour" data-v="-1">◀ Jour</button><button data-cn="jour" data-v="1">Jour ▶</button></div>';
    var hg = perso(c);
    if (hg) h += '<label class="cn-lbl2" style="margin-top:12px">Le récit parle de ' + esc(hg.nom) + ' au…</label><div class="cn-grille">' +
      '<button data-cn="genre-heros" data-v="masculin" class="' + (hg.genre !== 'féminin' ? 'on' : '') + '">Masculin (il)</button>' +
      '<button data-cn="genre-heros" data-v="féminin" class="' + (hg.genre === 'féminin' ? 'on' : '') + '">Féminin (elle)</button></div>';
    if (l.length > 1) {
      h += '<label class="cn-lbl2" style="margin-top:12px">Mes aventures</label>' + l.map(function (x) {
        return '<button class="cn-item' + (x.id === c.id ? ' on' : '') + '" data-cn="basculer-camp" data-id="' + x.id + '"><div class="info"><div class="t">' + esc(x.titre) + '</div>' +
          '<div class="s">' + (x.campagne ? '📚 ' + esc(x.campagne.nom) + ' · ch. ' + x.campagne.numero + ' · ' : '') + x.scenes.length + ' scène(s) · jour ' + x.jour + (x.termine ? ' · ✓ terminée (exporter)' : '') + '</div></div></button>';
      }).join('');
    }
    h += '<div class="champ" style="margin-top:12px"><label>Nouvelle aventure</label><div class="cn-ajout"><input id="cn-m-new" placeholder="Titre…"><button class="btn btn-plein" data-cn="creer-menu">＋</button></div></div>' +
      '<div class="cn-grille" style="margin-top:6px"><button data-cn="campagne">📚 Campagne</button><button data-cn="import-campagne">📥 Importer</button></div>' +
      (c.termine ? '' : '<button class="btn btn-bloc" style="margin-top:6px" data-cn="fin-aventure">🏁 Terminer cette aventure</button>') +
      '<button class="btn btn-bloc" style="margin-top:6px" data-cn="rencontres-auto">🎲 Rencontres aléatoires en début de scène : <b>' + (c.rencontresAuto === false ? 'désactivées' : 'activées') + '</b></button>' +
      '<div class="cn-grille" style="margin-top:6px"><button data-rg="sauver">💾 Tout sauvegarder</button><button data-rg="ouvrir">⚙️ Réglages</button></div>' +
      '<a class="btn btn-bloc" style="margin-top:6px;text-align:center" href="tests.html">🧪 Vérifier que l’app fonctionne (tests)</a>' +
      '<button class="btn btn-bloc" style="margin-top:10px" data-cn="reinit-camp">♻️ Recommencer cette aventure à zéro</button>' +
      '<button class="btn btn-bloc btn-sang" style="margin-top:8px" data-cn="supprimer-camp">🗑️ Supprimer cette aventure</button>';
    ouvrir('📖 Aventure', h, { type: 'menu' });
  }

  /* ---------- ⚔️ Rencontre (dans le récit) ---------- */
  function chipsEnv(sel) {
    return '<div class="cn-mini">' + (COF.ENVIRONNEMENTS || []).map(function (e) {
      return '<span class="chip' + (sel === e.id ? ' on' : '') + '" data-cn="gen-opt" data-k="env" data-v="' + e.id + '">' + e.ic + ' ' + esc(e.nom) + '</span>';
    }).join('') + '</div>';
  }
  function sheetRencontre() {
    var c = K.actif();
    if (!gen.env) gen.env = A.envCourant(c);
    var nbA = A.nbAllies(c);
    var envH = COF.Monde.envDe(A.envCourant(c)) || {}, iciR = COF.Monde.ici(c);
    var h = '<div class="note" style="margin-bottom:6px">' + (envH.ic || '📍') + ' Terrain ' + (c.expedition ? 'de l’expédition' : (iciR ? 'de ' + esc(iciR.nom) : 'actuel')) + ' : <b>' + esc(envH.nom || '') + '</b> (présélectionné).</div>' +
      '<div class="note" style="margin-bottom:8px">Calibrée pour ' + (perso(c) ? esc(perso(c).nom) + ' (niv. ' + perso(c).niveau + ')' : 'le héros') +
      (nbA ? ' et ' + nbA + ' allié(s)' : '') + '. Tension ' + c.tension + ' : plus elle est haute, plus les créatures sont hostiles.</div>' +
      '<label class="cn-lbl2">Environnement</label>' + chipsEnv(gen.env) +
      '<label class="cn-lbl2">Difficulté</label><div class="cn-grille cn-g4">' + COF.Rencontre.DIFFICULTES.map(function (dd) {
        return '<button data-cn="gen-opt" data-k="diff" data-v="' + dd.id + '" class="' + (gen.diff === dd.id ? 'on' : '') + '">' + esc(dd.nom) + '</button>';
      }).join('') + '</div>' +
      '<label class="cn-lbl2" style="margin-top:10px">Composition</label><div class="cn-grille cn-g3">' +
        [['auto', 'Au hasard'], ['solo', 'Seul'], ['bande', 'Bande'], ['meute', 'Meute'], ['mixte', 'Mélangé']].map(function (s) {
          return '<button data-cn="gen-opt" data-k="style" data-v="' + s[0] + '" class="' + (gen.style === s[0] ? 'on' : '') + '">' + s[1] + '</button>';
        }).join('') + '</div>' +
      '<button class="btn btn-plein btn-bloc" style="margin-top:12px" data-cn="rencontre-go">⚔️ Que rencontre le héros ?</button>';
    ouvrir('⚔️ Rencontre', h, { type: 'rencontre' });
  }

  /* ---------- ✨ Inspirer : une touche d'imprévu, ajoutée d'un geste ---------- */
  var INSPIRATIONS = [
    ['evt', '🔀', 'Événement', 'touche vos fils et PNJ'], ['rebond', '🎭', 'Rebondissement', 'relance une scène qui patine'],
    ['faction', '♟️', 'Tour de faction', 'ce qui se passe hors champ'], ['rumeur', '👂', 'Rumeur', 'ce qui se murmure'],
    ['muse', '✨', 'Muse', 'deux mots à interpréter'], ['detail', '🖐️', 'Détail', 'vue, son, odeur, toucher'],
    ['route', '🧭', 'En chemin', 'un incident de route'], ['temps', '🕰️', 'Le temps passe', 'durée, météo, répit']
  ];
  function sheetInspirer() {
    ouvrir('✨ Inspirer', '<div class="cn-liste-gen">' + INSPIRATIONS.map(function (x) {
      return '<button data-cn="inspi" data-v="' + x[0] + '"><span class="ic">' + x[1] + '</span><span><b>' + x[2] + '</b><small>' + x[3] + '</small></span></button>';
    }).join('') + '</div><div class="note" style="margin-top:8px">Le résultat s’ajoute directement au récit.</div>', { type: 'inspirer' });
  }

  /* ---------- 🧰 Générer : PNJ, lieux, accroches… avec options ---------- */
  var GENERATEURS = [
    ['pnj', '👤', 'Personnage'], ['lieu', '🏘️', 'Lieu'], ['quete', '📜', 'Accroche de quête'], ['marchand', '🪙', 'Marchandage'],
    ['salle', '🗝️', 'Salle'], ['butin', '💰', 'Butin']
  ];
  function sheetGenerer() {
    var c = K.actif(), h = '<div class="cn-grille cn-g3">' + GENERATEURS.map(function (g) {
      return '<button data-cn="gen-type" data-v="' + g[0] + '" class="' + (gen.type === g[0] ? 'on' : '') + '">' + g[1] + '<small>' + g[2] + '</small></button>';
    }).join('') + '</div>';
    /* options propres au générateur choisi */
    if (gen.type === 'pnj') {
      h += '<label class="cn-lbl2" style="margin-top:10px">Peuple</label><div class="cn-mini">' +
        [['', '🎲 Au hasard']].concat((COF.PnjCalc.PEUPLES || []).map(function (p) { return [p, maj((COF.PEUPLES[p] || {}).nom || p)]; })).map(function (p) {
          return '<span class="chip' + (gen.peuple === p[0] ? ' on' : '') + '" data-cn="gen-opt" data-k="peuple" data-v="' + p[0] + '">' + esc(p[1]) + '</span>';
        }).join('') + '</div>' +
        '<div class="cn-grille cn-g3"><button data-cn="gen-opt" data-k="genre" data-v="" class="' + (!gen.genre ? 'on' : '') + '">Au hasard</button>' +
        '<button data-cn="gen-opt" data-k="genre" data-v="masculin" class="' + (gen.genre === 'masculin' ? 'on' : '') + '">Homme</button>' +
        '<button data-cn="gen-opt" data-k="genre" data-v="féminin" class="' + (gen.genre === 'féminin' ? 'on' : '') + '">Femme</button></div>';
    } else if (gen.type === 'lieu') {
      h += '<div class="cn-grille cn-g3" style="margin-top:10px">' + [['village', '🏘️ Localité'], ['taverne', '🍺 Taverne'], ['boutique', '🛒 Boutique']].map(function (l) {
        return '<button data-cn="gen-opt" data-k="lieu" data-v="' + l[0] + '" class="' + (gen.lieu === l[0] ? 'on' : '') + '">' + l[1] + '</button>';
      }).join('') + '</div>';
    } else if (gen.type === 'butin') {
      h += '<div class="cn-grille cn-g3" style="margin-top:10px">' + [['fouille', '🔍 Fouille'], ['coffre', '🗝️ Coffre'], ['riche', '👑 Trésor']].map(function (l) {
        return '<button data-cn="gen-opt" data-k="lieu" data-v="' + l[0] + '" class="' + (gen.lieu === l[0] ? 'on' : '') + '">' + l[1] + '</button>';
      }).join('') + '</div>';
    }
    h += '<button class="btn btn-plein btn-bloc" style="margin-top:12px" data-cn="gen-go">🎲 Générer</button>';
    var r = gen.res;
    if (r) {
      h += '<div class="cn-apercu"><div class="cn-meta">' + esc(r.titre) + '</div>' +
        (r.nom ? '<input id="cn-g-nom" value="' + esc(r.nom) + '">' : '') +
        '<textarea id="cn-g-txt" rows="6">' + esc(r.texte) + '</textarea></div>' +
        '<div class="cn-grille" style="margin-top:8px"><button data-cn="gen-noter">📌 Dans le récit</button>' +
        (r.liste ? '<button data-cn="gen-garder" class="on">💾 ' + { pnj: 'Ajouter aux PNJ', lieux: 'Ajouter aux lieux', fils: 'Ouvrir un fil' }[r.liste] + '</button>'
          : (r.butin ? '<button data-cn="gen-butin" class="on">📥 Prendre le butin</button>' : '')) + '</div>';
    }
    ouvrir('🧰 Générer', h, { type: 'generer' });
  }
  function lancerGenerateur(c) {
    if (gen.type === 'pnj') gen.res = A.pnj({ peuple: gen.peuple, genre: gen.genre });
    else if (gen.type === 'lieu') gen.res = A.lieu(['village', 'taverne', 'boutique'].indexOf(gen.lieu) >= 0 ? gen.lieu : 'village');
    else if (gen.type === 'quete') gen.res = A.quete();
    else if (gen.type === 'marchand') gen.res = A.marchand();
    else if (gen.type === 'salle') gen.res = A.salle();
    else if (gen.type === 'butin') {
      var mode = ['fouille', 'coffre', 'riche'].indexOf(gen.lieu) >= 0 ? gen.lieu : 'fouille';
      var o = { niveau: (perso(c) || {}).niveau || 1, env: A.envCourant(c), richesse: mode === 'riche' ? 'riche' : 'standard' };
      var b = mode === 'fouille' ? COF.Recompense.genererFouille(o) : COF.Recompense.genererCoffre(o);
      gen.res = { gen: 'butin', titre: mode === 'fouille' ? 'Trouvaille' : 'Trésor', texte: A.texteButin(b), butin: b };
    }
  }

  /* ---------- Combat de l'aventure : bandeau dans l'Arène + bilan ---------- */
  function banniereCombat() {
    var c = K.actif();
    if (!c || !c.combat) return '';
    var p = perso(c), e = etatHeros(p);
    var pv = e ? '<span class="cn-pvh' + (e.pv <= e.pvMax / 4 ? ' ko' : (e.pv <= e.pvMax / 2 ? ' mod' : '')) + '">❤️ ' + e.pv + '/' + e.pvMax +
      (e.pmMax ? ' · 🔮 ' + e.pm + '/' + e.pmMax : '') + '</span>' : '';
    return '<div class="cn-banniere"><div><b>📖 ' + esc(c.titre) + '</b><small>' + esc(c.combat.texte || 'Combat en cours') + '</small>' + pv + '</div>' +
      '<button class="btn btn-plein" data-cn="fin-combat">🏁 Terminer</button></div>';
  }
  function sheetFinCombat() {
    var b = A.bilanArene();
    var h = '<div class="note" style="margin-bottom:10px">Adversaires : ' + b.total + ' — ' + b.ko + ' à terre, ' + b.fuite + ' en fuite, ' + b.rendu + ' rendu(s), ' + b.debout + ' encore debout.</div>' +
      '<button class="btn btn-bloc cn-gros ok" data-cn="issue" data-v="victoire">🏆 Victoire<small>butin de la rencontre, tension −1</small></button>' +
      '<button class="btn btn-bloc cn-gros" data-cn="issue" data-v="fuite">🏃 Le héros s’échappe<small>pas de butin</small></button>' +
      '<button class="btn btn-bloc cn-gros ko" data-cn="issue" data-v="defaite">💀 Le héros tombe<small>tension +1, l’oracle dira ce qu’il advient</small></button>';
    ouvrir('🏁 Fin du combat', h, { type: 'fin-combat' });
  }

  /* ---------- Bouton flottant 📌 depuis les générateurs ---------- */
  function lireGenerateur(sub) {
    var corps = $('#gen-corps'); if (!corps) return null;
    var lignes = [], nom = null;
    corps.querySelectorAll('.ligne').forEach(function (li) {
      if (!li.querySelector('[data-c]')) return;
      var lb = li.querySelector('.info .t'), v = li.querySelector('.info .s');
      if (!lb || !v) return;
      var label = lb.textContent.trim(), val = v.textContent.trim();
      if (!nom && /^(nom|enseigne|objectif|accroche)$/i.test(label)) nom = val;
      lignes.push(label.charAt(0) + label.slice(1).toLowerCase() + ' : ' + val);
    });
    if (sub === 'rencontre' && COF.UI.Generateurs.dernierResultat()) {
      var r = COF.UI.Generateurs.dernierResultat();
      if (!r.erreur) { nom = 'Rencontre'; lignes = r.lots.map(function (l) { return l.nb + ' × ' + l.c.nom + (l.role ? ' (' + l.role + ')' : ''); }); }
    }
    if (!lignes.length) return null;
    var h2 = corps.querySelector('.carte > h2'), titre = h2 ? h2.firstChild.textContent.trim() : 'Générateur';
    return { titre: titre, nom: nom || titre, texte: lignes.join('\n') };
  }
  function majFab() {
    var fab = $('#cn-fab');
    if (!fab) {
      fab = document.createElement('button'); fab.id = 'cn-fab'; fab.className = 'cn-fab';
      fab.setAttribute('data-cn', 'fab'); fab.setAttribute('aria-label', 'Noter dans le carnet');
      fab.innerHTML = '📌';
      document.body.appendChild(fab);
    }
    var ok = COF.UI.vueActive === 'generateurs' && SUBS_FAB[COF.UI.sousActif] && K.actif();
    fab.style.display = ok ? '' : 'none';
  }
  function sheetFab() {
    var c = K.actif(), sub = COF.UI.sousActif, g = lireGenerateur(sub);
    if (!c) return;
    if (!g) { COF.UI.ouvrirModale('📌 Carnet', '<div class="vide">Rien à noter : générez d’abord un résultat.</div>'); return; }
    var dest = SUBS_FAB[sub] || 'journal';
    var h = '<div class="note" style="margin-bottom:8px">Aventure : <b>' + esc(c.titre) + '</b></div>' +
      '<label class="cn-lbl2">Ranger dans</label><div class="cn-grille cn-g4">' + [['journal', '🎬 Scène'], ['fils', '🧵 Fil'], ['pnj', '👥 PNJ'], ['lieux', '📍 Lieu']].map(function (d) {
        return '<button data-cn="fab-dest" data-v="' + d[0] + '" class="' + (dest === d[0] ? 'on' : '') + '">' + d[1] + '</button>';
      }).join('') + '</div>' +
      '<div class="champ" style="margin-top:10px"><label>Nom</label><input id="cn-f-nom" value="' + esc(g.nom) + '"></div>' +
      '<div class="champ"><label>Contenu</label><textarea id="cn-f-txt" rows="7">' + esc(g.texte) + '</textarea></div>' +
      '<button class="btn btn-plein btn-bloc" data-cn="fab-ok">📌 Ajouter au carnet</button>';
    ouvrir('📌 Noter dans le carnet', h, { type: 'fab', dest: dest, titre: g.titre });
  }

  /* ================= Actions ================= */
  function val(id) { var n = $('#' + id); return n ? n.value.trim() : ''; }
  function flash(msg) {
    var t = document.createElement('div'); t.className = 'cn-toast'; t.textContent = msg;
    document.body.appendChild(t); setTimeout(function () { t.classList.add('out'); }, 1400); setTimeout(function () { t.remove(); }, 1900);
  }
  function apresEntree() { rendre.defiler = true; rendre(); }
  /* Clôt la rencontre en cours (entrée du récit comprise). */
  function finRencontre(c, texte) {
    if (!c.rencontre) return;
    var id = c.rencontre.id;
    c.scenes.forEach(function (s) { s.entrees.forEach(function (e) { if (e.t === 'rencontre' && e.r && e.r.id === id) e.r.fin = texte; }); });
    c.rencontre = null;
    K.sauver(c);
  }
  /* Lance un combat dans l'Arène depuis le récit (héros + alliés). */
  function lancerCombat(c, r, source) {
    X.versArene(c, r);   /* le combat du récit remplace ce qui traînait dans l'Arène */
    c.combat = { source: source, texte: r.texte, r: r, debut: Date.now() };
    K.ajouterEntree(c, { t: 'note', titre: 'Combat', txt: 'Combat engagé : ' + r.texte + '.' });
    fermer();
    COF.UI.aller('arene');
  }

  /* Ouvre une scène (libre ou proposée par le directeur) et laisse le
     directeur la préparer : modification concrète, confrontation de
     quête, découverte en exploration, test de rencontre selon le
     terrain (sauf repos, quête et pendant une expédition). */
  /* Voyage raconté vers un lieu de la carte (route tracée au besoin, durée selon la distance). */
  function lancerVoyage(c, destId, filId) {
    if (c.expedition) { flash('Terminez d’abord l’expédition en cours'); return; }
    if (K.sceneCourante(c)) { flash('Terminez d’abord la scène en cours'); return; }
    var M = COF.Monde, iciV = M.ici(c), destV = M.lieu(c, destId);
    if (!destV) return;
    if (!iciV) { M.seRendre(c, destV.id); K.sauver(c); flash('📍 ' + destV.nom); rendre(); return; }
    if (iciV.id === destV.id) { flash('Vous y êtes déjà'); return; }
    var rtV = M.route(c, iciV.id, destV.id) || M.relier(c, iciV.id, destV.id, Math.max(1, Math.min(6, Math.round(Math.hypot(iciV.x - destV.x, iciV.y - destV.y) / 15))));
    /* le voyage se joue comme une scène racontée, jour après jour */
    fermer(); onglet = 'scene';
    demarrerScene(c, 'En route pour ' + COF.Conteur.formes(destV.nom).n, '', { type: 'voyage', filId: filId,
      voyage: { dest: destV.id, destNom: destV.nom, departNom: iciV.nom, jours: rtV.jours, env: rtV.env || destV.env } });
  }
  /* Ce qui attend sur chaque lieu (quêtes, affaires, menace, gens connus, souvenirs). */
  function marqueursLieux(c) {
    var out = {}, add = function (id, k, t) { if (!id) return; (out[id] = out[id] || { ic: [], txt: [] }); if (k && out[id].ic.indexOf(k) < 0) out[id].ic.push(k); if (t) out[id].txt.push(t); };
    (c.fils || []).forEach(function (f) {
      if (!f.ouvert) return;
      if (f.quete && f.quete.lieu) add(f.quete.lieu, '❗', '❗ Quête : ' + f.nom);
      if (f.mission && f.mission.v && f.mission.v.lieuId) add(f.mission.v.lieuId, '📌', '📌 Affaire : ' + f.nom.replace(/^📌 /, ''));
    });
    if (c.saga && c.saga.lieu && !c.saga.fini) add(c.saga.lieu, '☠️', '☠️ Repaire de ' + c.saga.nom);
    (c.pnj || []).forEach(function (x) {
      if (!x.lieuId || (x.compagnon && x.compagnon.actif)) return;
      add(x.lieuId, x.attitude === 'hostile' ? '⚔️' : '👤', (x.attitude === 'hostile' ? '⚔️ ' : '👤 ') + x.nom + (x.attitude ? ' (' + x.attitude + ')' : ''));
    });
    if (COF.Echos) COF.Echos.enAttente(c).forEach(function (e) { if (e.lieuId) add(e.lieuId, '', COF.Echos.libelle(c, e)); });
    return out;
  }
  function demarrerScene(c, titre, attendu, prop) {
    prop = prop || {};
    var s = K.nouvelleScene(c, titre, attendu, { filId: prop.filId, type: prop.type });
    c = K.actif(); s = K.sceneCourante(c);
    if (prop.voyage) s.voyage = prop.voyage;
    if (prop.loisir) s.loisir = prop.loisir;
    if (prop.dialogue) s.dialogue = prop.dialogue;
    var entrees = COF.Directeur.preparerScene(c, s, prop);
    if (prop.type === 'mission' && COF.Missions) entrees = entrees.concat(COF.Missions.preparer(c, s, (c.fils || []).filter(function (f) { return f.id === prop.filId; })[0]));
    /* le conteur raconte l'ouverture (le détail sensoriel y est intégré) */
    var ouv = COF.Conteur.ouvrir(c, s);
    if (ouv.length) entrees = ouv.concat(entrees.filter(function (e) { return e.t !== 'detail'; }));
    if (c.rencontresAuto !== false && !c.expedition && !c.rencontre && ['repos', 'quete', 'ville', 'voyage', 'donjon', 'mission', 'loisir', 'dialogue'].indexOf(prop.type) < 0) {
      var tr = A.testRencontre(c);
      if (prop.type === 'explorer' && !tr.rencontre && tr.n > 2) tr.rencontre = Math.random() < 1 / tr.n;   /* explorer : deux chances */
      if (tr.rencontre) {
        var ra2 = A.rencontre(c, { env: tr.env, difficulte: 'ordinaire', style: 'auto' });
        if (!ra2.erreur) {
          var envN = (COF.Monde.envDe(tr.env) || {});
          ra2.test = 'Test de rencontre · ' + (envN.ic || '') + ' ' + (envN.nom || tr.env) + ' · 1 chance sur ' + tr.n;
          c.rencontre = ra2;
          entrees.push({ t: 'rencontre', r: ra2, txt: 'Test de rencontre (' + (envN.nom || tr.env) + ', 1 chance sur ' + tr.n + ') : ' + ra2.texte });
        }
      }
    }
    entrees.forEach(function (e) { K.ajouterEntree(c, e); });
    K.sauver(c);
    if (!c.rencontre) { COF.Conteur.apresOuverture(c); c = K.actif(); }
    if (s.jeu) rendre.haut = true; else rendre.defiler = true;
    rendre();
    if (prop.type === 'repos') sheetRessources();
  }

  function action(act, node) {
    var c = K.actif(), v = node.getAttribute('data-v');
    switch (act) {
      case 'creer': { K.creer(val('cn-titre-new'), (COF.Store.actif() || {}).id); onglet = 'scene'; rendre(); return; }
      case 'onglet': onglet = v; rendre.haut = true; rendre(); return;
      case 'menu': sheetMenu(); return;
      case 'tension': c.tension = Math.max(1, Math.min(9, c.tension + (+v))); K.sauver(c); rendre(); return;
      case 'jouer': demarrerScene(c, val('cn-sc-titre'), val('cn-sc-attendu'), null); return;
      case 'jouer-prop': {
        var pr = COF.Directeur.propositions(c)[+v]; if (!pr) return;
        if (pr.type === 'voyage') { lancerVoyage(c, pr.lieu, pr.filId); return; }
        if (pr.type === 'nuit') { var on = COF.Loisirs.nuit(c); demarrerScene(c, on.titre, '', { type: 'loisir', loisir: on }); return; }
        if (pr.type === 'fete') { COF.Saisons.marquerFete(c); demarrerScene(c, pr.fete.titre, '', { type: 'loisir', loisir: pr.fete }); return; }
        if (pr.type === 'faveur') {
          var tf = COF.Factions.faveur(c, pr.faction); c = K.actif();
          if (tf) { var dF = c.scenes[c.scenes.length - 1]; if (dF) dF.entrees.push({ id: 'e' + Date.now().toString(36), quand: Date.now(), t: 'evt', txt: tf, clot: true }); K.sauver(c); flash(tf.slice(0, 90)); }
          rendre(); return;
        }
        if (pr.type === 'offre') {
          var fm = COF.Missions.accepter(c); if (!fm) return;
          c = K.actif(); flash('📌 ' + fm.nom.replace(/^📌 /, ''));
          pr = { type: 'mission', filId: fm.id, titre: fm.nom.replace(/^📌 /, ''), attendu: '' };
        }
        if (pr.type === 'fumees') {
          var vl = COF.Villes.decouvrir(c); if (!vl) return;
          COF.Monde.seRendre(c, vl.id); COF.Conteur.avancerTemps(c, 1); K.sauver(c);
          flash('🏘️ ' + vl.nom + ' ajouté à la carte');
          pr = { type: 'ville', titre: 'Arrivée à ' + vl.nom, attendu: '', lieu: vl.id };
        }
        if (pr.type === 'nouvelle') {
          var nq = COF.Directeur.creerQuete(c);
          pr = Object.assign({ type: 'quete', filId: nq.id }, COF.Directeur.sceneDe(c, nq));
          flash('📜 Nouvelle quête : ' + nq.nom);
        }
        demarrerScene(c, pr.titre, pr.attendu, pr);
        return;
      }
      case 'choix': {
        var scC = K.sceneCourante(c); if (!scC) return;
        rendre.ancre = scC.entrees.length;
        var res = COF.Conteur.agir(c, scC, +v); rendre();
        if (res.marche) { COF.UI.aller('marche'); return; }   /* « faire le tour des étals » ouvre le marché du lieu */
        if (res.menace) flash('⚠️ Le danger se concrétise !');
        return;
      }
      case 'provoquer': { var scP = K.sceneCourante(c); rendre.ancre = scP ? scP.entrees.length : null; COF.Conteur.provoquer(c); rendre(); return; }
      case 'suite': {
        var scS = K.sceneCourante(c); if (!scS || !scS.jeu) return;
        var notesS = COF.Conteur.conclure(c, scS);
        K.clore(c, scS.jeu.fini === 'reussite', scS.jeu.resume);
        c = K.actif();
        var derS = c.scenes[c.scenes.length - 1];
        notesS.forEach(function (n) { derS.entrees.push({ id: 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), quand: Date.now(), t: 'evt', txt: n, clot: true }); });
        K.sauver(c); rendre.haut = true; rendre();
        if (notesS.length) flash(notesS[0].slice(0, 90));
        return;
      }
      case 'genre-heros': { var hg2 = perso(c); if (hg2) { hg2.genre = v; COF.Store.sauver(hg2); } sheetMenu(); return; }
      case 'outils-toggle': outilsOuverts = !outilsOuverts; rendre(); return;
      case 'rencontres-auto': c.rencontresAuto = c.rencontresAuto === false; K.sauver(c); sheetMenu(); return;
      case 'ecrire': { var t = val('cn-texte'); if (!t) return; K.ajouterEntree(c, { t: 'texte', txt: t }); apresEntree(); return; }
      case 'oracle': sheetOracle(); return;
      case 'likelihood': oracleL = v; document.querySelectorAll('#cn-sheet [data-cn="likelihood"]').forEach(function (b) { b.classList.toggle('on', b === node); }); return;
      case 'demander': K.oracle(c, oracleL, val('cn-q')); fermer(); apresEntree(); return;
      case 'test': jet.action = ''; jet.comps = {}; jet.oracle = null; jet.effet = null; sheetTest(); return;
      case 'relancer-test': sheetTest(); return;
      case 'fermer': fermer(); apresEntree(); return;
      case 'jet-carac': memoAction(); jet.carac = v; sheetTest(); return;
      case 'jet-diff': memoAction(); jet.diff = +v; jet.oracle = null; sheetTest(); return;
      case 'jet-bonus': memoAction(); jet.bonus = !jet.bonus; sheetTest(); return;
      case 'jet-malus': memoAction(); jet.malus = !jet.malus; sheetTest(); return;
      case 'jet-comp': { memoAction(); var ic = node.getAttribute('data-i'); jet.comps[ic] = !jet.comps[ic]; sheetTest(); return; }
      case 'jet-action': {
        var AC = X.ACTIONS[+node.getAttribute('data-i')];
        jet.action = AC[0]; jet.carac = AC[1]; jet.comps = {};
        X.toutesCompetences(perso(c)).forEach(function (x, i) { if (String(x.nom).toLowerCase().indexOf(AC[2]) >= 0) jet.comps[i] = true; });
        sheetTest(); return;
      }
      case 'jet-oracle': { memoAction(); var dO = X.difficulteOracle(c.tension); jet.diff = dO.diff; jet.oracle = dO.nom + ' (' + dO.diff + ')'; sheetTest(); return; }
      case 'lancer': {
        var p = perso(c), a = val('cn-jet-action');
        var mc = p ? COF.Calc.carac(p, jet.carac) : 0, bonusC = 0, noms = [];
        (sheet.comps || []).forEach(function (x, i) { if (jet.comps[i]) { bonusC += x.valeur; noms.push('+' + x.valeur + ' ' + String(x.nom).split(/[,(]/)[0].trim()); } });
        var mod = mc + bonusC;
        var r = COF.Dice.test({ mod: mod, difficulte: jet.diff, bonus: jet.bonus, malus: jet.malus });
        var txt = (a ? a + ' — ' : '') + jet.carac + ' ' + sgn(mc) + (noms.length ? ' ' + noms.join(' ') : '') + ' : ' + r.des.join('/') +
          (r.des.length > 1 ? ' (garde ' + r.garde + ')' : '') + ' ' + sgn(mod) +
          ' = ' + r.total + ' contre ' + jet.diff + ' → ' + (r.crit ? 'réussite critique !' : (r.fumble ? 'échec critique !' : (r.reussite ? 'réussite' : 'échec')));
        var eff = null, combatPossible = false;
        if (jet.effet && /^appr-/.test(jet.effet) && c.rencontre) {
          var ra = A.resoudreApproche(c.rencontre, jet.effet.slice(5), !!r.reussite);
          eff = ra.texte; combatPossible = ra.combat;
          if (!ra.combat) { finRencontre(c, eff); COF.Conteur.apresCombat(c, 'evitee'); }
        } else if (jet.effet) eff = X.appliquerTest(c, jet.effet, r);
        var csq = eff && !r.crit && !r.fumble ? null : X.consequence(r);
        K.ajouterEntree(c, { t: 'jet', txt: txt, reussite: !!r.reussite, csq: csq, effet: eff });
        rendre();
        /* Le résultat s'affiche dans la feuille : on le voit quel que soit l'onglet. */
        ouvrir('🎲 ' + (a || 'Test'), '<div class="resultat ' + (r.crit ? 'crit' : (r.fumble ? 'fumble' : '')) + '">' +
          '<div class="grand">' + r.total + '</div>' +
          '<div class="detail">d20 : ' + r.des.join(' / ') + (r.des.length > 1 ? ' (garde ' + r.garde + ')' : '') + ' ' + sgn(mod) + ' · difficulté ' + jet.diff + '</div>' +
          '<div class="verdict ' + (r.reussite ? 'ok' : 'ko') + '" style="font-size:20px">' +
            (r.crit ? 'Réussite critique !' : (r.fumble ? 'Échec critique !' : (r.reussite ? 'Réussite' : 'Échec'))) + '</div></div>' +
          (eff ? '<div class="cn-menace ' + (r.reussite ? 'ok' : '') + '"><div class="s">' + esc(eff) + '</div></div>' : '') +
          (csq ? '<div class="cn-menace' + (r.crit ? ' ok' : '') + '" style="margin-top:8px"><div class="s">' + esc(csq) + '</div></div>' : '') +
          (combatPossible ? '<button class="btn btn-bloc cn-gros ko" data-cn="combat-rencontre">⚔️ Combattre</button>' : '') +
          '<div class="cn-grille" style="margin-top:12px"><button data-cn="relancer-test">↻ Autre test</button>' +
          '<button data-cn="fermer" class="on">OK</button></div>' +
          '<div class="note" style="margin-top:8px">Noté dans la scène en cours.</div>', { type: 'resultat' });
        return;
      }
      case 'evt': { var e = K.evenementHistoire(c); K.ajouterEntree(c, { t: 'evt', txt: e.texte }); apresEntree(); return; }
      case 'muse': { var m = COF.Oracle.inspiration(); K.ajouterEntree(c, { t: 'muse', txt: m.mot1 + ' × ' + m.mot2 }); apresEntree(); return; }
      case 'detail': { var d = COF.Oracle.detailSensoriel(null); K.ajouterEntree(c, { t: 'detail', txt: d.detail }); apresEntree(); return; }
      case 'clore': clore.resume = ''; sheetClore(); return;
      case 'clore-fil': { clore.resume = val('cn-resume'); var ch0 = sheet.choix, idF = node.getAttribute('data-id'); ch0[idF] = !ch0[idF]; sheetClore(ch0); return; }
      case 'clore-ok': case 'clore-ko': {
        var choixF = (sheet && sheet.choix) || {}, notes = [];
        K.clore(c, act === 'clore-ok', val('cn-resume'));
        c = K.actif();
        Object.keys(choixF).forEach(function (id) {
          if (!choixF[id]) return;
          var fF = c.fils.filter(function (f) { return f.id === id; })[0]; if (!fF) return;
          if (fF.quete) notes.push(COF.Directeur.avancer(c, fF));
          else { fF.ouvert = false; notes.push('🧵 « ' + fF.nom + ' » est résolu.'); }
        });
        /* l'avancée est notée dans la scène qui vient de se clore */
        var der0 = c.scenes[c.scenes.length - 1];
        notes.filter(Boolean).forEach(function (n) { der0.entrees.push({ id: 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), quand: Date.now(), t: 'evt', txt: n, clot: true }); });
        K.sauver(c); fermer(); rendre.haut = true; rendre();
        flash(notes.length ? notes[0].slice(0, 90) : 'Tension : ' + K.actif().tension);
        return;
      }
      case 'nouvelle-quete': { var nq2 = COF.Directeur.creerQuete(c); flash('📜 ' + nq2.nom); rendre(); return; }
      case 'jour': c.jour = Math.max(1, c.jour + (+v)); K.sauver(c); if (sheet && sheet.type === 'menu') sheetMenu(); else { fermer(); flash('Jour ' + c.jour); } rendre(); return;
      case 'suppr-entree': if (confirm('Supprimer cette entrée ?')) { K.supprimerEntree(c, node.getAttribute('data-id')); rendre(); } return;
      case 'ajouter': { var nm = val('cn-nouveau'); if (!nm) return; K.ajouterListe(c, node.getAttribute('data-l'), { nom: nm, note: '' }); rendre(); return; }
      case 'basculer': {
        var f = c.fils.filter(function (x) { return x.id === node.getAttribute('data-id'); })[0];
        if (f) K.majListe(c, 'fils', f.id, { ouvert: !f.ouvert });
        rendre(); return;
      }
      case 'editer': sheetEditer(node.getAttribute('data-l'), node.getAttribute('data-id')); return;
      case 'attitude': sheet.attitude = v; document.querySelectorAll('#cn-sheet [data-cn="attitude"]').forEach(function (b) { b.classList.toggle('on', b === node); }); return;
      case 'fil-etat': sheet.ouvert = v === '1'; document.querySelectorAll('#cn-sheet [data-cn="fil-etat"]').forEach(function (b) { b.classList.toggle('on', b === node); }); return;
      case 'comp-actif': case 'comp-role': case 'comp-niv': {
        var bc = sheet.comp;
        if (act === 'comp-actif') bc.actif = v === '1';
        if (act === 'comp-role') bc.role = v;
        sheetEditer(sheet.l, sheet.id, { nom: val('cn-e-nom'), note: val('cn-e-note'), attitude: bc.actif && sheet.attitude === 'neutre' ? 'allié' : sheet.attitude, ouvert: sheet.ouvert, comp: bc });
        return;
      }
      case 'enregistrer': {
        var ch = { nom: val('cn-e-nom') || '?', note: val('cn-e-note') };
        if (sheet.l === 'pnj') { ch.attitude = sheet.attitude; ch.compagnon = sheet.comp && sheet.comp.actif ? sheet.comp : null; }
        if (sheet.l === 'fils') ch.ouvert = sheet.ouvert;
        K.majListe(c, sheet.l, sheet.id, ch); fermer(); rendre(); return;
      }
      case 'mentionner': {
        K.ajouterEntree(c, { t: 'note', titre: { fils: 'Fil', pnj: 'PNJ', lieux: 'Lieu' }[sheet.l], txt: val('cn-e-nom') + (val('cn-e-note') ? ' — ' + val('cn-e-note') : '') });
        fermer(); onglet = 'scene'; apresEntree(); return;
      }
      case 'retirer': if (confirm('Supprimer définitivement ?')) { K.retirerListe(c, sheet.l, sheet.id); fermer(); rendre(); } return;
      case 'aller': fermer(); COF.UI.aller(v); return;
      case 'renommer': c.titre = val('cn-m-titre') || c.titre; K.sauver(c); fermer(); rendre(); return;
      case 'lier': c.persoId = (COF.Store.actif() || {}).id || null; K.sauver(c); fermer(); rendre(); flash('Héros lié'); return;
      case 'basculer-camp': {
        var cb = K.get(node.getAttribute('data-id'));
        /* une aventure terminée ne se rouvre plus : on peut seulement exporter son récit */
        if (cb && cb.termine && cb.id !== c.id) { sheetArchive(cb); return; }
        K.setActif(node.getAttribute('data-id')); fermer(); onglet = 'scene'; rendre(); return;
      }
      case 'archive': { var ca = K.get(node.getAttribute('data-id')); if (ca) sheetArchive(ca); return; }
      case 'export-aventure': { var cx = K.get(node.getAttribute('data-id') || c.id) || c; sheetExport('📜 ' + cx.titre, COF.Chronique.aventure(cx), cx.titre); return; }
      case 'export-scene': {
        var cs = K.get(node.getAttribute('data-c') || c.id) || c, sx = cs.scenes.filter(function (x) { return x.id === node.getAttribute('data-id'); })[0];
        if (sx) sheetExport('📜 ' + sx.n + '. ' + sx.titre, COF.Chronique.scene(cs, sx, true), cs.titre + ' - scene ' + sx.n);
        return;
      }
      case 'copier-export': {
        var ta = $('#cn-export-txt'); if (!ta) return;
        if (navigator.clipboard) navigator.clipboard.writeText(ta.value).then(function () { flash('📋 Texte copié'); }, function () { ta.select(); flash('Sélectionnez puis copiez'); });
        else { ta.select(); try { document.execCommand('copy'); flash('📋 Texte copié'); } catch (e) { flash('Sélectionnez puis copiez'); } }
        return;
      }
      case 'dl-export': {
        var ta2 = $('#cn-export-txt'); if (!ta2) return;
        var blob2 = new Blob([ta2.value], { type: 'text/plain;charset=utf-8' }), a2 = document.createElement('a');
        a2.href = URL.createObjectURL(blob2); a2.download = (sheet.fichier || 'recit').replace(/[^\wÀ-ÿ -]/g, '').trim().replace(/\s+/g, '-') + '.txt';
        document.body.appendChild(a2); a2.click(); setTimeout(function () { URL.revokeObjectURL(a2.href); a2.remove(); }, 500);
        return;
      }
      case 'partager-export': { var ta3 = $('#cn-export-txt'); if (ta3 && navigator.share) navigator.share({ title: sheet.fichier || 'Récit', text: ta3.value }).catch(function () {}); return; }
      case 'campagne': sheetCampagne(); return;
      case 'export-campagne': sheetExport('📜 Campagne', COF.Campagne.texte(c), 'campagne ' + (c.campagne ? c.campagne.nom : c.titre)); return;
      case 'fichier-campagne': {
        var blobC = new Blob([COF.Campagne.exporter(c)], { type: 'application/json' }), aC = document.createElement('a');
        aC.href = URL.createObjectURL(blobC); aC.download = COF.Campagne.nomFichier(c);
        document.body.appendChild(aC); aC.click(); setTimeout(function () { URL.revokeObjectURL(aC.href); aC.remove(); }, 500);
        flash('💾 Fichier de campagne prêt'); return;
      }
      case 'import-campagne': {
        var inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json';
        inp.onchange = function () {
          var fi = inp.files && inp.files[0]; if (!fi) return;
          var rd = new FileReader();
          rd.onload = function () {
            var ri = COF.Campagne.importer(String(rd.result));
            if (ri.erreur) { flash(ri.erreur); return; }
            fermer(); onglet = 'scene'; rendre.haut = true; rendre(); flash('📥 « ' + ri.nom + ' » : ' + ri.nb + ' aventure(s) importée(s)');
          };
          rd.readAsText(fi);
        };
        inp.click(); return;
      }
      case 'parler': {
        var xp = (c.pnj || []).filter(function (y) { return y.id === v; })[0]; if (!xp) return;
        demarrerScene(c, 'Conversation avec ' + xp.nom, '', { type: 'dialogue', dialogue: { pnjId: xp.id } }); return;
      }
      case 'loisir-go': {
        var ol = COF.Loisirs.offres(c)[+v]; if (!ol) return;
        demarrerScene(c, ol.titre, '', { type: 'loisir', loisir: ol }); return;
      }
      case 'cap': { var scK = K.sceneCourante(c); if (!scK) return; rendre.ancre = scK.entrees.length; COF.Conteur.utiliserCapacite(c, scK, v); rendre(); return; }
      case 'libre': libre = { texte: '', carac: null }; sheetLibre(); return;
      case 'libre-analyser': libre.texte = val('cn-libre-txt'); sheetLibre(); return;
      case 'libre-carac': libre.texte = val('cn-libre-txt'); libre.carac = libre.carac === v ? null : v; sheetLibre(); return;
      case 'libre-ok': {
        libre.texte = val('cn-libre-txt'); if (!libre.texte) { flash('Écrivez d’abord l’action'); return; }
        var scL = K.sceneCourante(c); if (!scL) return;
        rendre.ancre = scL.entrees.length;
        var resL = COF.Conteur.agirLibre(c, scL, libre.texte, libre.carac);
        fermer(); rendre(); if (resL.menace) flash('⚠️ Le danger se concrétise !');
        return;
      }
      case 'fin-aventure': sheetFinAventure(); return;
      case 'fin-ok': {
        var pvAv = (perso(c) || {}).pv;
        var fin = COF.Saga.terminerAventure(c);
        onglet = 'scene'; rendre.haut = true; rendre();
        if (fin.niveau && COF.UI.Niveau) { var hN = perso(c); fermer(); COF.UI.Niveau.ouvrir(hN, { pvGain: hN && typeof pvAv === 'number' ? Math.max(0, hN.pv - pvAv) : 0, fin: function () { flash('⬆️ Nouveaux rangs enregistrés'); rendre(); } }); }
        else if (fin.niveau) sheetNiveau(c, pvAv); else { fermer(); flash('🏁 Aventure terminée'); }
        return;
      }
      case 'aller-voies': fermer(); COF.UI.aller('voies'); return;
      case 'rangs-niveau': fermer(); if (COF.UI.Niveau) COF.UI.Niveau.ouvrir(perso(c), { fin: function () { rendre(); } }); return;
      case 'suite-aventure': {
        var nv = COF.Saga.suite(c, val('cn-suite-titre'));
        fermer(); onglet = 'scene'; rendre.haut = true; rendre(); flash('▶ ' + nv.titre);
        return;
      }
      case 'aller-suite': { if (c.suiteId && K.get(c.suiteId)) { K.setActif(c.suiteId); onglet = 'scene'; rendre(); } return; }
      case 'creer-menu': K.creer(val('cn-m-new') || 'Nouvelle aventure', (COF.Store.actif() || {}).id); fermer(); onglet = 'scene'; rendre(); return;
      case 'reinit-camp': {
        if (!confirm('Recommencer « ' + c.titre + ' » à zéro ?\n\nScènes, fils, PNJ, compagnons, lieux, carte et expédition seront effacés ; le titre et le héros sont gardés. ' +
          'Le personnage lui-même (PV, inventaire, bourse) n’est pas modifié.')) return;
        if (c.combat) COF.Arene.ecrire(COF.Arene.vider());
        K.reinitialiser(c); fermer(); onglet = 'scene'; rendre.haut = true; rendre(); flash('♻️ Aventure remise à zéro');
        return;
      }
      case 'supprimer-camp': if (confirm('Supprimer « ' + c.titre + ' » et tout son journal ? C’est définitif.')) { K.supprimer(c.id); fermer(); rendre(); } return;
      case 'plier': node.parentNode.classList.toggle('ferme'); return;
      case 'partager': {
        var txt2 = K.exporter(c);
        if (navigator.share) { navigator.share({ title: c.titre, text: txt2 }).catch(function () {}); return; }
        if (navigator.clipboard) navigator.clipboard.writeText(txt2).then(function () { flash('Journal copié'); }, function () { flash('Copie impossible'); });
        return;
      }
      case 'telecharger': {
        var blob = new Blob([K.exporter(c)], { type: 'text/markdown' });
        var aEl = document.createElement('a'); aEl.href = URL.createObjectURL(blob);
        aEl.download = c.titre.replace(/[^\wÀ-ÿ -]/g, '').trim().replace(/\s+/g, '-') + '.md';
        document.body.appendChild(aEl); aEl.click(); setTimeout(function () { URL.revokeObjectURL(aEl.href); aEl.remove(); }, 500);
        return;
      }
      /* ----- Expédition ----- */
      case 'expe-taille': memoExpe(); expe.taille = v; rendre(); return;
      case 'expe-env': memoExpe(); expe[node.getAttribute('data-k')] = v; expe[node.getAttribute('data-k') === 'env' ? 'envChoisi' : 'envVChoisi'] = true; rendre(); return;
      case 'cpt': {
        var k = node.getAttribute('data-k'), dv = +v;
        if (k === 'monde-jours') { monde.jours = Math.max(1, Math.min(60, monde.jours + dv)); if (sheet && sheet.type === 'lieu') sheetLieu(sheet.id); return; }
        if (k === 'comp-niv') {
          sheet.comp.niveau = Math.max(1, Math.min(20, sheet.comp.niveau + dv));
          sheetEditer(sheet.l, sheet.id, { nom: val('cn-e-nom'), note: val('cn-e-note'), attitude: sheet.attitude, ouvert: sheet.ouvert, comp: sheet.comp });
          return;
        }
        if (k === 'ration-v' || k === 'r-rations' || k === 'r-torches') {
          var cle = k === 'r-torches' ? 'torches' : 'rations', rs = X.ressources(c);
          rs[cle] = Math.max(0, rs[cle] + dv); K.sauver(c);
          if (sheet && sheet.type === 'ressources') { rendre(); sheetRessources(); return; }
        }
        else { memoExpe(); expe[k] = Math.max(k === 'jours' ? 1 : 0, Math.min(30, expe[k] + dv)); }
        rendre(); return;
      }
      case 'expe-donjon': memoExpe(); X.commencerDonjon(c, expe.nom || 'Donjon', expe.taille, expe.env); X.salleSuivante(c); K.sauver(c); rendre(); return;
      case 'expe-salle': X.salleSuivante(c); K.sauver(c); rendre.haut = true; rendre(); return;
      case 'expe-voyage': memoExpe(); X.commencerVoyage(c, expe.depart, expe.destination, expe.jours, expe.envV); K.sauver(c); rendre(); return;
      case 'expe-jour': X.etapeSuivante(c); K.sauver(c); rendre(); return;
      case 'expe-fouiller': X.fouiller(c); K.sauver(c); rendre(); return;
      case 'expe-prendre': {
        var pp = perso(c);
        if (!pp) { flash('Aucun héros lié'); return; }
        X.prendreButin(c, pp); K.sauver(c); rendre(); flash('Butin ajouté à ' + pp.nom); return;
      }
      case 'expe-vaincue': {
        if (node.getAttribute('data-k') === 'salle') X.marquerVaincue(c);
        else { var e2 = c.expedition.etapes[c.expedition.etapes.length - 1]; e2.vaincue = true; K.ajouterEntree(c, { t: 'note', titre: 'Voyage', txt: 'Rencontre écartée : ' + e2.rencontre.texte + '.' }); }
        K.sauver(c); rendre(); return;
      }
      case 'expe-combat': {
        var x2 = c.expedition, src = node.getAttribute('data-k') === 'salle' ? 'salle' : 'etape';
        var rc = src === 'salle' ? X.salleCourante(x2).rencontre : x2.etapes[x2.etapes.length - 1].rencontre;
        lancerCombat(c, Object.assign({ env: x2.env, niveau: x2.niveau }, rc), src);
        return;
      }
      /* ----- Rencontres et combat ----- */
      case 'rencontre': gen.env = A.envCourant(c); sheetRencontre(); return;
      case 'gen-opt': {
        gen[node.getAttribute('data-k')] = v;
        if (sheet && sheet.type === 'rencontre') sheetRencontre(); else sheetGenerer();
        return;
      }
      case 'rencontre-go': {
        var rr = A.rencontre(c, { env: gen.env, difficulte: gen.diff, style: gen.style });
        if (rr.erreur) { flash(rr.erreur); return; }
        c.rencontre = rr;
        K.ajouterEntree(c, { t: 'rencontre', r: rr, txt: rr.texte + ' — ' + rr.distance + '. ' + rr.reactionTexte + (rr.surprise ? ' ' + rr.surprise : '') });
        fermer(); onglet = 'scene'; apresEntree(); return;
      }
      case 'approche': {
        var ap = A.approches(c.rencontre).filter(function (x) { return x.id === v; })[0];
        if (ap) sheetTest({ action: ap.action, carac: ap.carac, diff: ap.diff, effet: 'appr-' + ap.id });
        return;
      }
      case 'combat-rencontre': if (c.rencontre) lancerCombat(c, c.rencontre, 'rencontre'); return;
      case 'fin-combat': if (COF.UI.Arene.verserJournal) COF.UI.Arene.verserJournal(); sheetFinCombat(); return;
      case 'issue': {
        var cb0 = c.combat; if (!cb0) return;
        A.syncAllies(c);
        /* Bilan automatique du combat dans le récit */
        if (COF.UI.Arene && COF.UI.Arene.bilan) {
          var bil = COF.UI.Arene.bilan(v);
          K.ajouterEntree(c, { t: 'note', titre: '⚔️ Récit du combat', txt: bil.texte });
        }
        if (v === 'victoire') {
          var bt = A.butinDe(cb0.r);
          c.tension = Math.max(1, c.tension - 1);
          if (cb0.source === 'salle' && c.expedition) { var sv = X.salleCourante(c.expedition); if (sv) sv.vaincue = true; }
          if (cb0.source === 'etape' && c.expedition) { var ev = c.expedition.etapes[c.expedition.etapes.length - 1]; if (ev) ev.vaincue = true; }
          finRencontre(c, 'Victoire');
          K.ajouterEntree(c, { t: 'note', titre: 'Victoire', txt: 'Le combat est gagné (' + cb0.texte + ').\nButin : ' + A.texteButin(bt) });
          COF.Conteur.apresCombat(c, 'victoire');
          /* victoire lors de la confrontation d'une quête : elle avance d'elle-même */
          var scV = K.sceneCourante(c), fV = scV && scV.filId ? c.fils.filter(function (f) { return f.id === scV.filId; })[0] : null;
          if (fV && fV.quete && fV.quete.etape === 3 && (!fV.quete.finale || fV.quete.finale === 'boss')) { K.ajouterEntree(c, { t: 'evt', txt: COF.Directeur.avancer(c, fV) }); scV.filId = null; }
          c.combat = null; c.butinEnAttente = bt; K.sauver(c);
          ouvrir('🏆 Victoire', '<div class="cn-menace ok"><div class="t">💰 Butin</div><div class="s">' + esc(A.texteButin(bt)) + '</div></div>' +
            '<button class="btn btn-plein btn-bloc" style="margin-top:12px" data-cn="prendre-combat">📥 Prendre le butin</button>' +
            '<button class="btn btn-bloc" style="margin-top:8px" data-cn="retour-recit">📖 Retour au récit</button>', { type: 'victoire' });
          return;
        }
        if (v === 'fuite') {
          finRencontre(c, 'Le héros s’est échappé');
          K.ajouterEntree(c, { t: 'note', titre: 'Fuite', txt: 'Le héros parvient à s’échapper du combat.' });
        } else {
          c.tension = Math.min(9, c.tension + 1);
          var sort = COF.piocher(['capturé et emmené ailleurs', 'laissé pour mort (1 PV), dépouillé de sa bourse', 'sauvé in extremis par un tiers (un PNJ ? un inconnu ?)',
            'abandonné : les ennemis ont eu ce qu’ils voulaient', 'réveillé plus tard, blessé, dans un lieu inconnu']);
          finRencontre(c, 'Défaite');
          K.ajouterEntree(c, { t: 'evt', txt: 'Le héros tombe… L’oracle suggère qu’il est ' + sort + '.' });
        }
        COF.Conteur.apresCombat(c, v === 'fuite' ? 'fuite' : 'defaite');
        c.combat = null; K.sauver(c); fermer(); onglet = 'scene'; COF.UI.aller('carnet'); return;
      }
      case 'prendre-combat': {
        var hp = perso(c);
        if (hp && c.butinEnAttente) { A.encaisser(hp, c.butinEnAttente); flash('Butin ajouté à ' + hp.nom); }
        c.butinEnAttente = null; K.sauver(c); fermer(); onglet = 'scene'; COF.UI.aller('carnet'); return;
      }
      case 'retour-recit': fermer(); onglet = 'scene'; COF.UI.aller('carnet'); return;
      /* ----- Inspirer ----- */
      case 'inspirer': sheetInspirer(); return;
      case 'inspi': {
        var en;
        if (v === 'evt') en = { t: 'evt', txt: K.evenementHistoire(c).texte };
        else if (v === 'muse') { var mu = COF.Oracle.inspiration(); en = { t: 'muse', txt: mu.mot1 + ' × ' + mu.mot2 }; }
        else if (v === 'detail') en = { t: 'detail', txt: COF.Oracle.detailSensoriel(null).detail };
        else {
          var g = { rebond: A.rebondissement, faction: A.faction, rumeur: A.rumeur, route: function () { return A.routeEvt(c); }, temps: A.temps }[v]();
          en = { t: v === 'rebond' ? 'evt' : 'note', titre: g.titre, txt: g.texte };
        }
        K.ajouterEntree(c, en); fermer(); onglet = 'scene'; apresEntree(); return;
      }
      /* ----- Générer ----- */
      case 'generer': sheetGenerer(); return;
      case 'gen-type': gen.type = v; gen.res = null; gen.lieu = v === 'butin' ? 'fouille' : 'village'; sheetGenerer(); return;
      case 'gen-go': lancerGenerateur(c); sheetGenerer(); return;
      case 'gen-noter': {
        var gn = val('cn-g-nom'), gt = val('cn-g-txt');
        K.ajouterEntree(c, { t: 'note', titre: gen.res.titre, txt: (gn ? gn + '\n' : '') + gt });
        gen.res = null; fermer(); onglet = 'scene'; apresEntree(); return;
      }
      case 'gen-garder': {
        if (gen.res.gen === 'quete' && gen.res.q) {
          var fq = COF.Directeur.creerQuete(c, gen.res.q);
          K.ajouterEntree(c, { t: 'note', titre: 'Nouvelle quête', txt: fq.nom + ' — commanditaire : ' + fq.quete.comNom + ', lieu : ' + fq.quete.lieuNom + '.' });
          flash('📜 ' + fq.nom); gen.res = null; sheetGenerer(); return;
        }
        var nm2 = val('cn-g-nom') || gen.res.titre, tx2 = val('cn-g-txt'), li = gen.res.liste;
        var obj = { nom: nm2, note: tx2 }; if (li === 'pnj' && gen.res.attitude) obj.attitude = gen.res.attitude;
        if (li === 'lieux' && gen.res.gen === 'lieu') obj.env = 'urbain';   /* localité, taverne, boutique */
        K.ajouterListe(c, li, obj);
        K.ajouterEntree(c, { t: 'note', titre: { pnj: 'Nouveau PNJ', lieux: 'Nouveau lieu', fils: 'Nouveau fil' }[li], txt: nm2 });
        flash('💾 ' + nm2); gen.res = null; sheetGenerer(); return;
      }
      case 'gen-butin': {
        var hb = perso(c); if (!hb) { flash('Aucun héros lié'); return; }
        A.encaisser(hb, gen.res.butin);
        K.ajouterEntree(c, { t: 'note', titre: gen.res.titre, txt: gen.res.texte });
        flash('Butin ajouté'); gen.res = null; fermer(); rendre(); return;
      }
      case 'expe-test': {
        var ef = node.getAttribute('data-e');
        sheetTest({ action: node.getAttribute('data-a'), carac: node.getAttribute('data-c'), diff: +node.getAttribute('data-d'), effet: ef });
        return;
      }
      case 'expe-quitter': {
        if (!c.expedition) return;
        if (!(v === 'arrive' || (c.expedition.type === 'donjon' && (X.salleCourante(c.expedition) || {}).finale)) && !confirm('Mettre fin à l’expédition ?')) return;
        var destQ = c.expedition.destination;
        X.quitter(c, v === 'arrive' ? 'Voyage terminé' : null);
        /* fin du voyage : la scène de route se clôt d'elle-même, place à la suite */
        var scQ = K.sceneCourante(c);
        if (scQ && scQ.type === 'voyage') { scQ.close = true; scQ.resume = v === 'arrive' ? 'Arrivée à ' + destQ + '.' : 'Voyage interrompu.'; onglet = 'scene'; }
        K.sauver(c); rendre(); return;
      }
      /* ----- Carte du monde ----- */
      case 'monde-lieu': {
        var idl = node.getAttribute('data-id');
        if (monde.deplacer) { monde.deplacer = null; rendre(); return; }
        monde.cible = null; sheetLieu(idl); return;
      }
      case 'monde-fond': {
        var fx = +node.getAttribute('data-x'), fy = +node.getAttribute('data-y');   /* pas de bord : le monde s'étend à volonté */
        if (monde.ajouterRegion) {
          monde.ajouterRegion = false; monde.nouvelleRegion = { x: fx, y: fy, r: 45, env: COF.Monde.envAuPoint(c, fx, fy) || 'foret', nom: '' };
          sheetRegion(c); rendre(); return;
        }
        if (monde.ajouter) {
          monde.ajouter = false; monde.nouveau = { x: fx, y: fy };
          monde.typeNouveau = COF.Monde.envAuPoint(c, fx, fy) || COF.Monde.envIci(c) || 'plaine';
          sheetNouveauLieu(c);
          setTimeout(function () { var i = $('#cn-nl-nom'); if (i) i.focus(); }, 60);
          rendre(); return;
        }
        if (!monde.deplacer) return;
        var lm = COF.Monde.lieu(c, monde.deplacer);
        if (lm) { lm.x = fx; lm.y = fy; K.sauver(c); }
        monde.deplacer = null; rendre(); return;
      }
      case 'monde-creer': {
        var nomL = val('cn-nl-nom'); if (!nomL) { flash('Donnez un nom au lieu'); return; }
        var nl = K.ajouterListe(c, 'lieux', { nom: nomL, note: val('cn-nl-note') });
        nl.x = Math.round(monde.nouveau.x); nl.y = Math.round(monde.nouveau.y); nl.env = monde.typeNouveau || 'plaine';
        var rte = $('#cn-nl-route'), icl = COF.Monde.ici(c);
        if (rte && rte.checked && icl) {
          var dj = Math.max(1, Math.round(Math.hypot(icl.x - nl.x, icl.y - nl.y) / 15));   /* ~15 unités de carte par jour */
          /* le terrain de la route est celui de la destination (sauf en ville) */
          COF.Monde.relier(c, icl.id, nl.id, dj, nl.env === 'urbain' ? (icl.env && icl.env !== 'urbain' ? icl.env : 'plaine') : nl.env);
        }
        if (!c.position) c.position = nl.id;
        K.sauver(c); fermer(); rendre(); flash('📍 ' + nomL); return;
      }
      case 'monde-ajouter': monde.ajouter = !monde.ajouter; monde.ajouterRegion = false; monde.deplacer = null; rendre(); return;
      case 'monde-ajouter-region': monde.ajouterRegion = !monde.ajouterRegion; monde.ajouter = false; monde.deplacer = null; rendre(); return;
      case 'monde-reg-type': monde.nouvelleRegion.nom = val('cn-rg-nom'); monde.nouvelleRegion.env = v; sheetRegion(c); return;
      case 'monde-reg-taille': monde.nouvelleRegion.nom = val('cn-rg-nom'); monde.nouvelleRegion.r = +v; sheetRegion(c); return;
      case 'monde-reg-creer': {
        var nr = monde.nouvelleRegion; nr.nom = val('cn-rg-nom') || ((COF.Monde.envDe(nr.env) || {}).nom || 'Région');
        COF.Monde.ajouterRegion(c, nr);
        /* les lieux de la région sans terrain marqué prennent le sien */
        c.lieux.forEach(function (l) { if (Math.hypot(l.x - nr.x, l.y - nr.y) <= nr.r && (l.env === 'plaine' || !l.env)) l.env = nr.env; });
        K.sauver(c); fermer(); rendre(); flash('🗺️ ' + nr.nom); return;
      }
      case 'monde-reg-suppr': if (confirm('Retirer cette région de la carte ?')) { COF.Monde.retirerRegion(c, node.getAttribute('data-id')); K.sauver(c); rendre(); } return;
      case 'decouverte-halte': {
        var xh = c.expedition, lh = COF.Monde.lieu(c, node.getAttribute('data-id'));
        if (xh && lh) {
          COF.Monde.relier(c, xh.departId, lh.id, Math.max(1, xh.fait), xh.env);
          X.quitter(c, 'Halte à ' + lh.nom);
          COF.Monde.seRendre(c, lh.id);
          K.ajouterEntree(c, { t: 'note', titre: 'Halte', txt: 'Le héros s’arrête à ' + lh.nom + ' pour explorer les lieux.' });
        }
        K.sauver(c); onglet = 'scene'; rendre.haut = true; rendre(); return;
      }
      case 'monde-type-nouveau': { var nn = val('cn-nl-nom'), nt = val('cn-nl-note'); monde.typeNouveau = v; sheetNouveauLieu(c, nn, nt); return; }
      case 'monde-type': {
        var lt = COF.Monde.lieu(c, node.getAttribute('data-l'));
        if (lt) { lt.env = v; K.sauver(c); rendre(); sheetLieu(lt.id); }
        return;
      }
      case 'monde-zoom': zoomMonde(+v); rendre(); return;
      case 'monde-cadrer': monde.vue = COF.Monde.cadre(c, true); rendre(); return;
      case 'monde-tout': monde.vue = COF.Monde.cadre(c); rendre(); return;
      case 'monde-deplacer': monde.deplacer = node.getAttribute('data-id'); fermer(); onglet = 'lieux'; rendre(); return;
      case 'monde-ici': {
        COF.Monde.seRendre(c, node.getAttribute('data-id')); K.sauver(c);
        K.ajouterEntree(c, { t: 'note', titre: 'Lieu', txt: 'Le héros est à ' + COF.Monde.ici(c).nom + '.' });
        fermer(); rendre(); return;
      }
      case 'monde-cible': monde.cible = node.getAttribute('data-id'); var rr0 = COF.Monde.route(c, node.getAttribute('data-l'), monde.cible); if (rr0) { monde.jours = rr0.jours; monde.env = rr0.env; } sheetLieu(node.getAttribute('data-l')); return;
      case 'monde-env': monde.env = v; sheetLieu(node.getAttribute('data-l')); return;
      case 'monde-relier': {
        COF.Monde.relier(c, node.getAttribute('data-l'), monde.cible, monde.jours, monde.env); K.sauver(c);
        var lid = node.getAttribute('data-l'); monde.cible = null; rendre(); sheetLieu(lid); return;
      }
      case 'monde-delier': COF.Monde.delier(c, node.getAttribute('data-id')); K.sauver(c); rendre(); sheetLieu(node.getAttribute('data-l')); return;
      case 'monde-recit': lancerVoyage(c, node.getAttribute('data-id')); return;
      case 'monde-voyager': {
        if (c.expedition) { flash('Terminez d’abord l’expédition en cours'); return; }
        var ici0 = COF.Monde.ici(c), dest = COF.Monde.lieu(c, node.getAttribute('data-id')), rt = COF.Monde.route(c, ici0.id, dest.id);
        X.commencerVoyage(c, ici0.nom, dest.nom, rt.jours, rt.env); K.sauver(c);
        fermer(); onglet = 'expe'; rendre(); return;
      }
      /* ----- Ressources ----- */
      case 'ressources': if (!perso(c) && !COF.Store.actif()) { flash('Aucun personnage'); } sheetRessources(); return;
      case 'res-pv': case 'res-pm': {
        var ph = perso(c); if (!ph) return; etatHeros(ph);
        if (act === 'res-pv') ph.pv = Math.max(0, Math.min(COF.Calc.pvMax(ph), ph.pv + (+v)));
        else ph.pm = Math.max(0, Math.min(COF.Calc.pmMax(ph), (ph.pm || 0) + (+v)));
        COF.Store.sauver(ph); rendre(); sheetRessources(); return;
      }
      case 'recup-rapide': {
        var pr = perso(c), er = etatHeros(pr); if (!pr) return;
        if (er.dr <= 0) { flash('Plus de dé de récupération'); return; }
        pr.dr--;
        var jr = COF.Dice.dommages('1d' + er.drType, COF.Calc.ctx(pr), {}), gain = jr.total + Math.floor((pr.niveau || 1) / 2);
        pr.pv = Math.min(er.pvMax, pr.pv + gain); COF.Store.sauver(pr);
        K.ajouterEntree(c, { t: 'note', titre: 'Repos', txt: 'Récupération rapide : +' + gain + ' PV (' + pr.pv + '/' + er.pvMax + '), ' + pr.dr + ' DR restant(s).' });
        rendre(); sheetRessources(); flash('+' + gain + ' PV'); return;
      }
      case 'recup-nuit': {
        var pn = perso(c), en = etatHeros(pn), rs2 = X.ressources(c); if (!pn) return;
        pn.dr = Math.min(en.drMax, (pn.dr || 0) + 1); pn.pm = en.pmMax; pn.dmTemp = 0; pn.etats = [];
        COF.Store.sauver(pn);
        c.jour++;
        var partis = COF.UI.Compagnie ? COF.UI.Compagnie.nuit(c) : [];
        if (partis.length) K.ajouterEntree(c, { t: 'evt', txt: 'Au réveil, ' + partis.join(' et ') + ' a disparu : sa loyauté était trop faible.' });
        K.ajouterEntree(c, { t: 'note', titre: 'Nuit', txt: 'Nuit de repos — jour ' + c.jour + ' : +1 DR (' + pn.dr + '/' + en.drMax + '), PM restaurés.' });   void rs2;
        rendre(); fermer(); flash('🌙 Jour ' + c.jour); return;
      }
      case 'fab': sheetFab(); return;
      case 'fab-dest': sheet.dest = v; document.querySelectorAll('#cn-sheet [data-cn="fab-dest"]').forEach(function (b) { b.classList.toggle('on', b === node); }); return;
      case 'fab-ok': {
        var nom = val('cn-f-nom') || sheet.titre, contenu = val('cn-f-txt');
        if (sheet.dest === 'journal') K.ajouterEntree(c, { t: 'note', titre: sheet.titre, txt: (nom !== sheet.titre ? nom + '\n' : '') + contenu });
        else {
          K.ajouterListe(c, sheet.dest, { nom: nom, note: contenu });
          K.ajouterEntree(c, { t: 'note', titre: { fils: 'Nouveau fil', pnj: 'Nouveau PNJ', lieux: 'Nouveau lieu' }[sheet.dest], txt: nom });
        }
        fermer(); flash('📌 Ajouté au carnet'); return;
      }
    }
  }

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-cn]') : null;
      if (!t) return;
      if (!(t.closest('#vue-carnet') || t.closest('#modale') || t.closest('.cn-banniere') || t.closest('#vue-arene') || t.id === 'cn-fab')) return;
      e.preventDefault();
      if (t.getAttribute('data-cn') === 'monde-fond') {
        /* position touchée → coordonnées du monde (selon le zoom et le déplacement) */
        var pm = pointMonde(t, e.clientX, e.clientY);
        t.setAttribute('data-x', Math.round(pm.x));
        t.setAttribute('data-y', Math.round(pm.y));
      }
      action(t.getAttribute('data-cn'), t);
    });
    /* Entrée = envoyer (Maj+Entrée = retour à la ligne) dans le composeur,
       Entrée valide aussi les champs « ajouter » et la question à l'oracle. */
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || e.shiftKey || e.isComposing) return;
      var id = e.target.id;
      if (id === 'cn-texte') { e.preventDefault(); action('ecrire', e.target); }
      else if (id === 'cn-nouveau') { e.preventDefault(); action('ajouter', document.querySelector('[data-cn="ajouter"]')); }
      else if (id === 'cn-q') { e.preventDefault(); action('demander', e.target); }
    });
  }

  /* Glisser du doigt : onglet suivant (+1) ou précédent (−1). */
  var ORDRE = ['scene', 'expe', 'fils', 'pnj', 'lieux', 'journal'];
  function glisser(sens) {
    if (!K.actif()) return;
    var i = ORDRE.indexOf(onglet) + sens;
    if (i < 0 || i >= ORDRE.length) return;
    onglet = ORDRE[i]; rendre.haut = true; rendre();
  }

  return { init: init, rendre: rendre, majFab: majFab, banniereCombat: banniereCombat, glisser: glisser, ouvrirOnglet: function (o) { onglet = o; } };
})();
