/* ============================================================
   COF2 Compagnon — Oracle & Muse (sous-onglet de Générateurs)
   Boîte à outils pour le jeu en solo : oracle oui/non nuancé,
   événements aléatoires, étincelles d'inspiration, test de scène
   et détails sensoriels. Tout est procédural (combinaison de
   grandes tables), donc rarement redondant d'un tirage à l'autre.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Oracle = (function () {
  var $ = COF.UI.$, $$ = COF.UI.$$, esc = COF.UI.esc;

  var likelihoodId = 'moitie';
  var sensChoisi = null;      // null = au hasard
  var historique = [];        // en mémoire seulement, pas persisté
  var cible = null;

  /* Derniers résultats affichés par bloc, pour survivre à un
     re-rendu complet (changement de vraisemblance ou de sens). */
  var dernier = { oracle: null, muse: null, evt: null, scene: null, detail: null };

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-oact]') : null;
      if (!t || !t.closest('#vue-generateurs')) return;
      actions(t.getAttribute('data-oact'), t);
    });
  }

  function noter(ligne) {
    historique.unshift(ligne);
    if (historique.length > 8) historique.length = 8;
  }

  /* ---------- Rendu ---------- */
  function rendre(node) {
    cible = node;
    var h = '';

    h += '<div class="carte"><h2>Oracle oui/non</h2><div class="carte-corps">';
    h += '<div class="note" style="margin-bottom:8px">Posez une question fermée, choisissez sa vraisemblance, laissez le dé trancher.</div>';
    h += '<div class="chips" style="margin-bottom:12px">';
    COF.ORACLE_LIKELIHOOD.forEach(function (l) {
      h += '<span class="chip ' + (likelihoodId === l.id ? 'on' : '') + '" data-oact="likelihood" data-v="' + l.id + '">' +
        esc(l.nom) + '</span>';
    });
    h += '</div>';
    h += '<button class="btn btn-plein btn-bloc" data-oact="oracle">🔮 Poser la question</button>';
    h += '<div id="oracle-resultat">' + (dernier.oracle ? htmlOracle(dernier.oracle) : '') + '</div>';
    h += '</div></div>';

    h += '<div class="carte"><h2>Muse — étincelle d\'inspiration</h2><div class="carte-corps">';
    h += '<div class="note" style="margin-bottom:8px">Deux mots à interpréter librement, pour relancer une scène qui patine.</div>';
    h += '<button class="btn btn-or btn-bloc" data-oact="muse">✨ Inspire-moi</button>';
    h += '<div id="muse-resultat">' + (dernier.muse ? htmlMuse(dernier.muse) : '') + '</div>';
    h += '</div></div>';

    h += '<div class="carte"><h2>Événement aléatoire</h2><div class="carte-corps">';
    h += '<div class="note" style="margin-bottom:8px">Un focus, une action, un sujet — de quoi faire rebondir la scène sans passer par l\'oracle.</div>';
    h += '<button class="btn btn-bloc" data-oact="evenement">🔀 Générer un événement</button>';
    h += '<div id="evt-resultat">' + (dernier.evt ? htmlEvenement(dernier.evt) : '') + '</div>';
    h += '</div></div>';

    h += '<div class="carte"><h2>Test de scène</h2><div class="carte-corps">';
    h += '<div class="note" style="margin-bottom:8px">La scène imaginée se déroule-t-elle comme prévu, ou le récit dévie-t-il ?</div>';
    h += '<button class="btn btn-bloc" data-oact="scene">🎬 Tester la scène</button>';
    h += '<div id="scene-resultat">' + (dernier.scene ? htmlScene(dernier.scene) : '') + '</div>';
    h += '</div></div>';

    h += '<div class="carte"><h2>Détail sensoriel</h2><div class="carte-corps">';
    h += '<div class="note" style="margin-bottom:8px">Un détail pour ancrer une description — vue, son, odeur ou toucher.</div>';
    h += '<div class="chips" style="margin-bottom:12px">';
    h += '<span class="chip ' + (sensChoisi === null ? 'on' : '') + '" data-oact="sens" data-v="">🎲 Au hasard</span>';
    [['vue', '👁️ Vue'], ['son', '👂 Son'], ['odeur', '👃 Odeur'], ['toucher', '✋ Toucher']].forEach(function (s) {
      h += '<span class="chip ' + (sensChoisi === s[0] ? 'on' : '') + '" data-oact="sens" data-v="' + s[0] + '">' + esc(s[1]) + '</span>';
    });
    h += '</div>';
    h += '<button class="btn btn-bloc" data-oact="detail">🖐️ Générer un détail</button>';
    h += '<div id="detail-resultat">' + (dernier.detail ? htmlDetail(dernier.detail) : '') + '</div>';
    h += '</div></div>';

    if (historique.length) {
      h += '<div class="carte pliable"><h2>Historique de la session</h2><div class="carte-corps" id="oracle-historique">';
      historique.forEach(function (l) {
        h += '<div class="ligne"><div class="info"><div class="s">' + esc(l) + '</div></div></div>';
      });
      h += '</div></div>';
    }

    node.innerHTML = h;
    $$('.pliable > h2', node).forEach(function (t) {
      t.addEventListener('click', function () { t.parentNode.classList.toggle('ferme'); });
    });
  }

  /* ---------- Rendus partiels ---------- */
  function htmlEvenement(e) {
    return '<div class="resultat"><div class="verdict" style="font-size:16px;color:var(--or-clair)">' + esc(e.focus) + '</div>' +
      '<div class="detail" style="font-size:14px;margin-top:6px">il ' + esc(e.action) + ' <b>' + esc(e.sujet) + '</b></div></div>';
  }

  function htmlOracle(r) {
    var cls = (r.nuance === 'oui_et' || r.nuance === 'oui') ? 'ok' :
      (r.nuance === 'non_et' || r.nuance === 'non') ? 'ko' : '';
    var h = '<div class="resultat">';
    h += '<div class="verdict ' + cls + '" style="font-size:22px">' + esc(r.texte) + '</div>';
    h += '<div class="detail">d100 : ' + r.roll + ' (seuil ' + r.seuil + ' pour « ' + esc(r.likelihood.nom) + ' »)</div>';
    h += '</div>';
    if (r.evenement) {
      h += '<div class="note" style="margin-bottom:6px">🔀 Double au dé : un événement s\'invite.</div>';
      h += htmlEvenement(r.evenement);
    }
    return h;
  }

  function htmlMuse(m) {
    return '<div class="resultat"><div class="verdict" style="font-size:22px;color:var(--or-clair);text-transform:capitalize">' +
      esc(m.mot1) + ' <span style="color:var(--text-mute)">×</span> ' + esc(m.mot2) + '</div></div>';
  }

  function htmlScene(s) {
    var cls = s.resultat === 'normale' ? 'ok' : (s.resultat === 'interrompue' ? 'ko' : '');
    var h = '<div class="resultat"><div class="verdict ' + cls + '" style="font-size:20px">' + esc(s.label) + '</div></div>';
    if (s.evenement) h += htmlEvenement(s.evenement);
    return h;
  }

  function htmlDetail(d) {
    var lbl = { vue: '👁️ Vue', son: '👂 Son', odeur: '👃 Odeur', toucher: '✋ Toucher' }[d.sens];
    return '<div class="resultat"><div class="verdict" style="font-size:14px;color:var(--text-mute)">' + esc(lbl) + '</div>' +
      '<div class="detail" style="font-size:16px;color:var(--text);margin-top:4px">' + esc(d.detail) + '</div></div>';
  }

  /* ---------- Actions ---------- */
  function actions(act, node) {
    switch (act) {
      case 'likelihood': likelihoodId = node.getAttribute('data-v'); rendre(cible); break;
      case 'sens': sensChoisi = node.getAttribute('data-v') || null; rendre(cible); break;

      case 'oracle': {
        var r = COF.Oracle.repondre(likelihoodId);
        dernier.oracle = r;
        $('#oracle-resultat').innerHTML = htmlOracle(r);
        noter('🔮 ' + r.likelihood.nom + ' → ' + r.texte + (r.evenement ? ' · ' + COF.Oracle.texteEvenement(r.evenement) : ''));
        rafraichirHistorique();
        break;
      }
      case 'muse': {
        var m = COF.Oracle.inspiration();
        dernier.muse = m;
        $('#muse-resultat').innerHTML = htmlMuse(m);
        noter('✨ ' + m.mot1 + ' × ' + m.mot2);
        rafraichirHistorique();
        break;
      }
      case 'evenement': {
        var e = COF.Oracle.evenement();
        dernier.evt = e;
        $('#evt-resultat').innerHTML = htmlEvenement(e);
        noter('🔀 ' + COF.Oracle.texteEvenement(e));
        rafraichirHistorique();
        break;
      }
      case 'scene': {
        var s = COF.Oracle.testScene();
        dernier.scene = s;
        $('#scene-resultat').innerHTML = htmlScene(s);
        noter('🎬 Scène : ' + s.label + (s.evenement ? ' · ' + COF.Oracle.texteEvenement(s.evenement) : ''));
        rafraichirHistorique();
        break;
      }
      case 'detail': {
        var d = COF.Oracle.detailSensoriel(sensChoisi);
        dernier.detail = d;
        $('#detail-resultat').innerHTML = htmlDetail(d);
        noter('🖐️ ' + d.detail);
        rafraichirHistorique();
        break;
      }
    }
  }

  function rafraichirHistorique() {
    /* L'historique vit dans une carte pliable en bas de vue : on la
       reconstruit sans perturber les résultats déjà affichés au-dessus. */
    var existe = $('#oracle-historique');
    var html = historique.map(function (l) {
      return '<div class="ligne"><div class="info"><div class="s">' + esc(l) + '</div></div></div>';
    }).join('');
    if (existe) { existe.innerHTML = html; return; }
    if (!cible) return;
    var carte = document.createElement('div');
    carte.className = 'carte pliable';
    carte.innerHTML = '<h2>Historique de la session</h2><div class="carte-corps" id="oracle-historique">' + html + '</div>';
    cible.appendChild(carte);
    carte.querySelector('h2').addEventListener('click', function () { carte.classList.toggle('ferme'); });
  }

  return { init: init, rendre: rendre };
})();
