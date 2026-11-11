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
  function noeud() { return $('#vue-carnet'); }
  function perso(c) { return (c && c.persoId && COF.Store.get(c.persoId)) || COF.Store.actif(); }
  function heure(ts) { var d = new Date(ts); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }

  /* ================= Rendu principal ================= */
  function rendre() {
    var n = noeud(); if (!n) return;
    var c = K.actif();
    if (!c) { n.innerHTML = htmlAccueil(); return; }
    var h = htmlTete(c);
    h += '<div class="cn-onglets">' + [
      ['scene', '🎬', 'Scène', ''], ['expe', c.expedition ? (c.expedition.type === 'donjon' ? '🗝️' : '🧭') : '🗺️', 'Expé.', c.expedition ? '•' : ''],
      ['fils', '🧵', 'Fils', K.filsOuverts(c).length],
      ['pnj', '👥', 'PNJ', c.pnj.length], ['lieux', '📍', 'Lieux', c.lieux.length], ['journal', '📖', 'Journal', c.scenes.length]
    ].map(function (o) {
      return '<button data-cn="onglet" data-v="' + o[0] + '" class="' + (onglet === o[0] ? 'on' : '') + '">' +
        '<span class="ic">' + o[1] + '</span><span class="tx">' + o[2] + (o[3] ? ' <b>' + o[3] + '</b>' : '') + '</span></button>';
    }).join('') + '</div>';
    if (onglet === 'scene') h += htmlScene(c);
    else if (onglet === 'expe') h += htmlExpedition(c);
    else if (onglet === 'journal') h += htmlJournal(c);
    else h += htmlListe(c, onglet);
    n.innerHTML = h;
    var fil = $('#cn-fil');
    if (fil && onglet === 'scene') { var der = fil.lastElementChild; if (der && rendre.defiler) der.scrollIntoView({ block: 'end' }); }
    rendre.defiler = false;
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

  /* ---------- Onglet Scène ---------- */
  function bandeauTest(t) {
    if (!t) return '';
    var cls = t.resultat === 'normale' ? 'ok' : (t.resultat === 'interrompue' ? 'ko' : 'mod');
    var txt = t.resultat === 'normale' ? 'La scène se déroule comme prévu.' :
      (t.resultat === 'modifiee' ? 'La scène est modifiée : quelque chose ne colle pas à ce que vous attendiez.' :
        'La scène est interrompue : un événement prend le dessus.');
    return '<div class="cn-test ' + cls + '"><div class="v">' + esc(t.label) + (t.roll ? ' <small>d10 : ' + t.roll + '</small>' : '') + '</div>' +
      '<div class="s">' + esc(txt) + '</div>' + (t.histoire ? '<div class="e">🔀 ' + esc(t.histoire.texte) + '</div>' : '') + '</div>';
  }
  function htmlEntree(e) {
    var corps;
    if (e.t === 'texte') corps = '<div class="cn-txt">' + esc(e.txt).replace(/\n/g, '<br>') + '</div>';
    else if (e.t === 'oracle') {
      var cls = /^oui/.test(e.nuance) ? (e.nuance === 'oui_mais' ? 'mod' : 'ok') : (e.nuance === 'non_mais' ? 'mod' : 'ko');
      corps = '<div class="cn-meta">🔮 Oracle · ' + esc(e.likelihood) + '</div>' +
        (e.question ? '<div class="cn-q">« ' + esc(e.question) + ' »</div>' : '') +
        '<div class="cn-verdict ' + cls + '">' + esc(e.txt) + '</div><div class="cn-meta">d100 : ' + e.roll + ' · seuil ' + e.seuil + '</div>' +
        (e.evt ? '<div class="cn-evt">🔀 ' + esc(e.evt.texte) + '</div>' : '');
    } else if (e.t === 'jet') {
      corps = '<div class="cn-meta">🎲 Test</div><div class="cn-verdict ' + (e.reussite ? 'ok' : 'ko') + '">' + esc(e.txt) + '</div>' +
        (e.csq ? '<div class="cn-evt">' + esc(e.csq) + '</div>' : '');
    } else {
      var ic = { evt: '🔀 Événement', muse: '✨ Muse', detail: '🖐️ Détail', note: '📌 ' + (e.titre || 'Note') }[e.t] || '📌';
      corps = '<div class="cn-meta">' + esc(ic) + '</div><div class="cn-txt">' + esc(e.txt).replace(/\n/g, '<br>') + '</div>';
    }
    return '<div class="cn-entree cn-' + e.t + '">' + corps +
      '<button class="cn-x" data-cn="suppr-entree" data-id="' + e.id + '" aria-label="Supprimer">×</button>' +
      '<div class="cn-heure">' + heure(e.quand) + '</div></div>';
  }
  function htmlScene(c) {
    var s = K.sceneCourante(c), h = '';
    if (!s) {
      var der = c.scenes[c.scenes.length - 1];
      if (der) h += '<div class="note cn-rappel">Scène précédente : <b>' + esc(der.titre) + '</b>' + (der.resume ? ' — ' + esc(der.resume) : '') + '</div>';
      var fo = K.filsOuverts(c);
      if (fo.length) h += '<div class="cn-mini">' + fo.slice(0, 6).map(function (f) { return '<span class="chip">🧵 ' + esc(f.nom) + '</span>'; }).join('') + '</div>';
      h += '<div class="carte"><h2>🎬 Nouvelle scène</h2><div class="carte-corps">' +
        '<div class="champ"><label>Titre (facultatif)</label><input id="cn-sc-titre" placeholder="Scène ' + (c.scenes.length + 1) + '"></div>' +
        '<div class="champ"><label>Ce que vous attendez</label><textarea id="cn-sc-attendu" rows="3" placeholder="Le héros arrive au village à la tombée de la nuit et cherche l’auberge…"></textarea>' +
        '<div class="aide">L’app teste la scène selon la tension (' + c.tension + ') : elle peut se dérouler comme prévu, être modifiée ou interrompue.</div></div>' +
        '<button class="btn btn-plein btn-bloc" data-cn="jouer">🎬 Jouer la scène</button></div></div>';
      return h;
    }
    h += '<div class="carte cn-scene"><h2>' + s.n + '. ' + esc(s.titre) + '<span class="h2-action" data-cn="clore">🏁 Clore</span></h2><div class="carte-corps">' +
      (s.attendu ? '<div class="note" style="margin-bottom:8px">Attendu : ' + esc(s.attendu) + '</div>' : '') + bandeauTest(s.test) + '</div></div>';
    h += '<div id="cn-fil" class="cn-fil">' + (s.entrees.length ? s.entrees.map(htmlEntree).join('') :
      '<div class="vide" style="padding:14px">Racontez ce qui se passe, ou interrogez l’oracle.</div>') + '</div>';
    h += '<div class="cn-dock"><div class="cn-compose">' +
      '<textarea id="cn-texte" rows="2" placeholder="Que se passe-t-il ?"></textarea>' +
      '<button class="btn btn-plein" data-cn="ecrire" aria-label="Ajouter au récit">➤</button></div>';
    h += '<div class="cn-actions">' +
      [['oracle', '🔮', 'Oracle'], ['test', '🎲', 'Test'], ['evt', '🔀', 'Événement'],
       ['muse', '✨', 'Muse'], ['detail', '🖐️', 'Détail'], ['clore', '🏁', 'Clore']].map(function (a) {
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
  function htmlListe(c, l) {
    var L = LISTES[l], items = c[l].slice();
    if (l === 'fils') items.sort(function (a, b) { return (b.ouvert ? 1 : 0) - (a.ouvert ? 1 : 0); });
    var h = '<div class="carte"><h2>' + esc(L.titre) + '</h2><div class="carte-corps">' +
      '<div class="cn-ajout"><input id="cn-nouveau" placeholder="' + esc(L.ph) + '"><button class="btn btn-plein" data-cn="ajouter" data-l="' + l + '" aria-label="Ajouter">＋</button></div>';
    if (!items.length) h += '<div class="vide">' + esc(L.vide) + '</div>';
    items.forEach(function (x) {
      var att = l === 'pnj' ? ATTITUDES.filter(function (a) { return a[0] === x.attitude; })[0] || ATTITUDES[1] : null;
      h += '<div class="cn-item' + (l === 'fils' && !x.ouvert ? ' ferme' : '') + '" data-cn="editer" data-l="' + l + '" data-id="' + x.id + '">' +
        '<div class="info"><div class="t">' + (l === 'fils' && !x.ouvert ? '✓ ' : '') + esc(x.nom) +
          (att ? ' <span class="puce" style="border-color:' + att[1] + ';color:' + att[1] + '">' + esc(att[0]) + '</span>' : '') + '</div>' +
          (x.note ? '<div class="s">' + esc(x.note.length > 140 ? x.note.slice(0, 140) + '…' : x.note) + '</div>' : '') + '</div>' +
        (l === 'fils' ? '<button class="btn btn-sm" data-cn="basculer" data-id="' + x.id + '" aria-label="' + (x.ouvert ? 'Résoudre' : 'Rouvrir') + '">' + (x.ouvert ? '✓' : '↺') + '</button>' : '') +
        '</div>';
    });
    h += '<button class="btn btn-bloc" style="margin-top:10px" data-cn="aller" data-v="' + L.gen[0] + '">' + esc(L.gen[1]) + ' puis 📌</button>';
    return h + '</div></div>';
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
      var dernierLieu = c.lieux[0] ? c.lieux[0].nom : '';
      h += '<div class="carte"><h2>🗝️ Explorer un donjon</h2><div class="carte-corps">' +
        '<div class="champ"><label>Nom du lieu</label><input id="cn-x-nom" value="' + esc(expe.nom) + '" placeholder="Les cryptes de Brumeval"></div>' +
        '<label class="cn-lbl2">Taille</label><div class="cn-grille cn-g3">' + [['petit', 'Petit', 5], ['moyen', 'Moyen', 8], ['grand', 'Grand', 12]].map(function (t) {
          return '<button data-cn="expe-taille" data-v="' + t[0] + '" class="' + (expe.taille === t[0] ? 'on' : '') + '">' + t[1] + '<small>' + t[2] + ' salles</small></button>';
        }).join('') + '</div>' +
        '<label class="cn-lbl2" style="margin-top:10px">Environnement des créatures</label>' + puceEnv(expe.env, 'env') +
        '<button class="btn btn-plein btn-bloc" data-cn="expe-donjon">🕯️ Entrer</button></div></div>';
      h += '<div class="carte"><h2>🧭 Partir en voyage</h2><div class="carte-corps">' +
        '<div class="grille2"><div class="champ"><label>Départ</label><input id="cn-x-dep" value="' + esc(expe.depart || dernierLieu) + '" placeholder="Brumeval"></div>' +
        '<div class="champ"><label>Destination</label><input id="cn-x-dest" value="' + esc(expe.destination) + '" placeholder="Osgild"></div></div>' +
        '<div class="grille2"><div class="champ"><label>Durée</label>' + compteur('jours', expe.jours, 'jour(s)') + '</div>' +
        '<div class="champ"><label>Rations</label>' + compteur('rations', expe.rations, '') + '</div></div>' +
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
          (s.piege ? '<div class="cn-menace piege"><div class="t">⚠️ Piège</div><div class="s">' + esc(ch.piege) + '</div>' +
            '<div class="cn-grille" style="margin-top:8px"><button data-cn="expe-test" data-a="Détecter le piège" data-c="PER" data-d="15">🔍 Détecter (PER)</button>' +
            '<button data-cn="expe-test" data-a="Désamorcer le piège" data-c="AGI" data-d="15">🛠️ Désamorcer (AGI)</button></div></div>' : '') +
          boiteRencontre(s.rencontre, 'salle', s.vaincue) +
          (s.butin ? '<div class="cn-menace ok"><div class="t">💰 Butin</div><div class="s">' + esc(texteButin(s.butin)) + '</div>' +
            (s.butinPris ? '<div class="note" style="margin-top:6px">✓ Ajouté à la fiche</div>' : '<button class="btn btn-bloc" style="margin-top:8px" data-cn="expe-prendre">📥 Prendre le butin</button>') + '</div>' : '') +
          '<div class="cn-grille" style="margin-top:10px">' +
            (s.fouillee ? '<button disabled>✓ Fouillée</button>' : '<button data-cn="expe-fouiller">💰 Fouiller</button>') +
            '<button data-cn="expe-test" data-a="Fouiller la salle" data-c="PER" data-d="12">🔎 Test de fouille</button></div>' +
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
      '<div class="cn-voyage-l"><span>Jour ' + x.fait + ' / ' + x.jours + '</span><span>🍖 ' + compteur('ration-v', x.rations, '') + '</span></div></div></div>';
    if (et) {
      h += '<div class="carte"><h2>Jour ' + et.jour + '</h2><div class="carte-corps">' +
        '<div class="cn-l"><span>🌦️</span><div>' + esc(et.meteo) + '</div></div>' +
        '<div class="cn-l"><span>🧭</span><div><b>' + esc((COF.VOYAGE_CATEGORIES_LABELS || {})[et.categorie] || et.categorie) + '</b> — ' + esc(et.detail) + '</div></div>' +
        (et.faim ? '<div class="cn-l"><span>🍖</span><div style="color:var(--sang-clair)">Plus de rations : il faut chasser, cueillir ou acheter.</div></div>' : '') +
        (et.rencontre ? (et.nuit ? '<div class="note" style="margin-top:6px">🌙 Pendant la nuit…</div>' : '') + boiteRencontre(et.rencontre, 'etape', et.vaincue) : '') +
        '<div class="cn-grille" style="margin-top:10px"><button data-cn="expe-test" data-a="S’orienter" data-c="PER" data-d="12">🧭 S’orienter</button>' +
          '<button data-cn="expe-test" data-a="Chasser / cueillir" data-c="PER" data-d="15">🏹 Chasser</button></div>' +
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

  /* ---------- Onglet Journal ---------- */
  function htmlJournal(c) {
    var h = '<div class="cn-export"><button class="btn btn-or" data-cn="partager">📤 Partager / copier</button>' +
      '<button class="btn" data-cn="telecharger">⬇️ Fichier .md</button></div>';
    if (!c.scenes.length) return h + '<div class="vide">Le journal se remplit au fil des scènes.</div>';
    c.scenes.slice().reverse().forEach(function (s, i) {
      h += '<div class="carte pliable' + (i > 0 ? ' ferme' : '') + '"><h2 data-cn="plier">' + s.n + '. ' + esc(s.titre) +
        ' <small style="color:var(--text-mute);font-weight:normal">· jour ' + (s.jour || 1) + (s.close ? '' : ' · en cours') + '</small></h2><div class="carte-corps">' +
        (s.attendu ? '<div class="note">Attendu : ' + esc(s.attendu) + '</div>' : '') + bandeauTest(s.test) +
        s.entrees.map(function (e) { return '<div class="cn-lu">' + esc(K.texteEntree(e)).replace(/\n/g, '<br>') + '</div>'; }).join('') +
        (s.close ? '<div class="note" style="margin-top:6px">🏁 ' + (s.controle ? 'Le héros garde la main' : 'Ça tourne mal') + (s.resume ? ' — ' + esc(s.resume) : '') + '</div>' : '') +
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
    if (preset) { jet.action = preset.action || ''; jet.carac = preset.carac || jet.carac; jet.diff = preset.diff || jet.diff; jet.comps = {}; jet.oracle = null; }
    var caracs = COF.RULES ? COF.RULES.caracs : [{ id: 'FOR' }, { id: 'AGI' }, { id: 'CON' }, { id: 'PER' }, { id: 'CHA' }, { id: 'INT' }, { id: 'VOL' }];
    var comps = X.toutesCompetences(p);
    var h = '<div class="champ"><label>Action</label><input id="cn-jet-action" value="' + esc(jet.action) + '" placeholder="Crocheter la serrure…"></div>' +
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
  function memoAction() { var a = $('#cn-jet-action'); if (a) jet.action = a.value; }
  function sheetClore() {
    ouvrir('🏁 Clore la scène', '<div class="champ"><label>En une phrase (facultatif)</label><input id="cn-resume" placeholder="Le héros a trouvé la carte mais le voleur a fui."></div>' +
      '<button class="btn btn-bloc cn-gros ok" data-cn="clore-ok">✅ Le héros a gardé la main<small>tension −1</small></button>' +
      '<button class="btn btn-bloc cn-gros ko" data-cn="clore-ko">⚠️ La situation lui échappe<small>tension +1</small></button>' +
      '<div class="cn-grille" style="margin-top:10px"><button data-cn="jour" data-v="1">☀️ Jour suivant</button><button data-cn="aller" data-v="solo">🕰️ Passage du temps</button></div>', { type: 'clore' });
  }
  function sheetEditer(l, id) {
    var c = K.actif(), x = c[l].filter(function (y) { return y.id === id; })[0];
    if (!x) return;
    var h = '<div class="champ"><label>Nom</label><input id="cn-e-nom" value="' + esc(x.nom) + '"></div>' +
      '<div class="champ"><label>Notes</label><textarea id="cn-e-note" rows="5">' + esc(x.note || '') + '</textarea></div>';
    if (l === 'pnj') h += '<label class="cn-lbl2">Attitude</label><div class="cn-grille cn-g4">' + ATTITUDES.map(function (a) {
      return '<button data-cn="attitude" data-v="' + a[0] + '" class="' + (x.attitude === a[0] ? 'on' : '') + '">' + esc(a[0]) + '</button>';
    }).join('') + '</div>';
    if (l === 'fils') h += '<div class="cn-grille"><button data-cn="fil-etat" data-v="1" class="' + (x.ouvert ? 'on' : '') + '">Ouvert</button>' +
      '<button data-cn="fil-etat" data-v="0" class="' + (!x.ouvert ? 'on' : '') + '">Résolu</button></div>';
    h += '<button class="btn btn-plein btn-bloc" style="margin-top:12px" data-cn="enregistrer">Enregistrer</button>' +
      '<div class="cn-grille" style="margin-top:8px"><button data-cn="mentionner">📌 Noter dans la scène</button><button data-cn="retirer" class="ko">🗑️ Supprimer</button></div>';
    ouvrir(LISTES[l].titre, h, { type: 'editer', l: l, id: id, attitude: x.attitude, ouvert: x.ouvert });
  }
  function sheetMenu() {
    var c = K.actif(), l = K.tous(), p = COF.Store.actif();
    var h = '<div class="champ"><label>Titre</label><input id="cn-m-titre" value="' + esc(c.titre) + '"></div>' +
      '<div class="cn-grille"><button data-cn="renommer">✏️ Renommer</button>' +
      (p ? '<button data-cn="lier">🔗 Héros : ' + esc(p.nom) + '</button>' : '<button disabled>Aucun perso actif</button>') + '</div>' +
      '<div class="cn-grille" style="margin-top:8px"><button data-cn="jour" data-v="-1">◀ Jour</button><button data-cn="jour" data-v="1">Jour ▶</button></div>';
    if (l.length > 1) {
      h += '<label class="cn-lbl2" style="margin-top:12px">Mes aventures</label>' + l.map(function (x) {
        return '<button class="cn-item' + (x.id === c.id ? ' on' : '') + '" data-cn="basculer-camp" data-id="' + x.id + '"><div class="info"><div class="t">' + esc(x.titre) + '</div>' +
          '<div class="s">' + x.scenes.length + ' scène(s) · jour ' + x.jour + '</div></div></button>';
      }).join('');
    }
    h += '<div class="champ" style="margin-top:12px"><label>Nouvelle aventure</label><div class="cn-ajout"><input id="cn-m-new" placeholder="Titre…"><button class="btn btn-plein" data-cn="creer-menu">＋</button></div></div>' +
      '<button class="btn btn-bloc btn-sang" style="margin-top:6px" data-cn="supprimer-camp">🗑️ Supprimer cette aventure</button>';
    ouvrir('📖 Aventure', h, { type: 'menu' });
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

  function action(act, node) {
    var c = K.actif(), v = node.getAttribute('data-v');
    switch (act) {
      case 'creer': { K.creer(val('cn-titre-new'), (COF.Store.actif() || {}).id); onglet = 'scene'; rendre(); return; }
      case 'onglet': onglet = v; rendre(); window.scrollTo(0, 0); return;
      case 'menu': sheetMenu(); return;
      case 'tension': c.tension = Math.max(1, Math.min(9, c.tension + (+v))); K.sauver(c); rendre(); return;
      case 'jouer': K.nouvelleScene(c, val('cn-sc-titre'), val('cn-sc-attendu')); rendre(); return;
      case 'ecrire': { var t = val('cn-texte'); if (!t) return; K.ajouterEntree(c, { t: 'texte', txt: t }); apresEntree(); return; }
      case 'oracle': sheetOracle(); return;
      case 'likelihood': oracleL = v; document.querySelectorAll('#cn-sheet [data-cn="likelihood"]').forEach(function (b) { b.classList.toggle('on', b === node); }); return;
      case 'demander': K.oracle(c, oracleL, val('cn-q')); fermer(); apresEntree(); return;
      case 'test': jet.action = ''; jet.comps = {}; jet.oracle = null; sheetTest(); return;
      case 'jet-carac': memoAction(); jet.carac = v; sheetTest(); return;
      case 'jet-diff': memoAction(); jet.diff = +v; jet.oracle = null; sheetTest(); return;
      case 'jet-bonus': memoAction(); jet.bonus = !jet.bonus; sheetTest(); return;
      case 'jet-malus': memoAction(); jet.malus = !jet.malus; sheetTest(); return;
      case 'jet-comp': { memoAction(); var ic = node.getAttribute('data-i'); jet.comps[ic] = !jet.comps[ic]; sheetTest(); return; }
      case 'jet-action': {
        var A = X.ACTIONS[+node.getAttribute('data-i')];
        jet.action = A[0]; jet.carac = A[1]; jet.comps = {};
        X.toutesCompetences(perso(c)).forEach(function (x, i) { if (String(x.nom).toLowerCase().indexOf(A[2]) >= 0) jet.comps[i] = true; });
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
        K.ajouterEntree(c, { t: 'jet', txt: txt, reussite: !!r.reussite, csq: X.consequence(r) });
        fermer(); apresEntree(); return;
      }
      case 'evt': { var e = K.evenementHistoire(c); K.ajouterEntree(c, { t: 'evt', txt: e.texte }); apresEntree(); return; }
      case 'muse': { var m = COF.Oracle.inspiration(); K.ajouterEntree(c, { t: 'muse', txt: m.mot1 + ' × ' + m.mot2 }); apresEntree(); return; }
      case 'detail': { var d = COF.Oracle.detailSensoriel(null); K.ajouterEntree(c, { t: 'detail', txt: d.detail }); apresEntree(); return; }
      case 'clore': sheetClore(); return;
      case 'clore-ok': case 'clore-ko': K.clore(c, act === 'clore-ok', val('cn-resume')); fermer(); rendre(); flash('Tension : ' + K.actif().tension); return;
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
      case 'enregistrer': {
        var ch = { nom: val('cn-e-nom') || '?', note: val('cn-e-note') };
        if (sheet.l === 'pnj') ch.attitude = sheet.attitude;
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
      case 'basculer-camp': K.setActif(node.getAttribute('data-id')); fermer(); onglet = 'scene'; rendre(); return;
      case 'creer-menu': K.creer(val('cn-m-new') || 'Nouvelle aventure', (COF.Store.actif() || {}).id); fermer(); onglet = 'scene'; rendre(); return;
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
      case 'expe-env': memoExpe(); expe[node.getAttribute('data-k')] = v; rendre(); return;
      case 'cpt': {
        var k = node.getAttribute('data-k'), dv = +v;
        if (k === 'ration-v') { c.expedition.rations = Math.max(0, c.expedition.rations + dv); K.sauver(c); }
        else { memoExpe(); expe[k] = Math.max(k === 'jours' ? 1 : 0, Math.min(30, expe[k] + dv)); }
        rendre(); return;
      }
      case 'expe-donjon': memoExpe(); X.commencerDonjon(c, expe.nom || 'Donjon', expe.taille, expe.env); X.salleSuivante(c); K.sauver(c); rendre(); return;
      case 'expe-salle': X.salleSuivante(c); K.sauver(c); rendre(); window.scrollTo(0, 0); return;
      case 'expe-voyage': memoExpe(); X.commencerVoyage(c, expe.depart, expe.destination, expe.jours, expe.envV, expe.rations); K.sauver(c); rendre(); return;
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
        var x2 = c.expedition, rc = node.getAttribute('data-k') === 'salle' ? X.salleCourante(x2).rencontre : x2.etapes[x2.etapes.length - 1].rencontre;
        var enCours = COF.Arene.lire().combattants.length;
        if (enCours && !confirm('Remplacer le combat en cours dans l’Arène ?')) return;
        X.versArene(c, rc);
        K.ajouterEntree(c, { t: 'note', titre: 'Combat', txt: 'Combat engagé : ' + rc.texte + '.' });
        COF.UI.aller('arene'); return;
      }
      case 'expe-test': sheetTest({ action: node.getAttribute('data-a'), carac: node.getAttribute('data-c'), diff: +node.getAttribute('data-d') }); return;
      case 'expe-quitter': {
        if (!c.expedition) return;
        if (!(v === 'arrive' || (c.expedition.type === 'donjon' && (X.salleCourante(c.expedition) || {}).finale)) && !confirm('Mettre fin à l’expédition ?')) return;
        X.quitter(c, v === 'arrive' ? 'Voyage terminé' : null); K.sauver(c); rendre(); return;
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
      if (!(t.closest('#vue-carnet') || t.closest('#cn-sheet') || t.id === 'cn-fab')) return;
      e.preventDefault();
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

  return { init: init, rendre: rendre, majFab: majFab };
})();
