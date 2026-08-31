/* ============================================================
   COF2 Compagnon — Onglet « Générateurs »
   Premier outil : le générateur de rencontres.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Generateurs = (function () {
  var $ = COF.UI.$, $$ = COF.UI.$$, esc = COF.UI.esc, sgn = COF.UI.sgn;

  var P = { env: 'foret', nbPJ: 4, niveau: 1, difficulte: 'ordinaire', style: 'auto' };
  var resultat = null;

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-gact]') : null;
      if (!t || !(t.closest('#vue-generateurs') || t.closest('#modale'))) return;
      actions(t.getAttribute('data-gact'), t);
    });
    /* pré-remplissage depuis le personnage actif */
    var p = COF.Store.actif();
    if (p) P.niveau = p.niveau || 1;
  }

  /* ---------- Rendu ---------- */
  function rendre() {
    var n = $('#vue-generateurs');
    var b = COF.Rencontre.budget(P.nbPJ, P.niveau, P.difficulte);
    var dispo = COF.Rencontre.candidats(P.env).length;

    var h = '';
    h += '<div class="carte"><h2>Générateur de rencontre</h2><div class="carte-corps">';

    /* environnement */
    h += '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:var(--text-mute);margin-bottom:5px">Environnement</div>';
    h += '<div class="chips" style="margin-bottom:12px">';
    COF.ENVIRONNEMENTS.forEach(function (e) {
      h += '<span class="chip ' + (P.env === e.id ? 'on' : '') + '" data-gact="env" data-v="' + e.id + '">' +
        e.ic + ' ' + esc(e.nom) + '</span>';
    });
    h += '</div>';

    /* groupe */
    h += '<div class="grille2" style="margin-bottom:4px">';
    h += '<div class="champ"><label>Personnages</label>' +
      '<div class="compteur" style="justify-content:center">' +
      '<button data-gact="pj-">−</button><span class="n">' + P.nbPJ + '</span><button data-gact="pj+">+</button>' +
      '</div></div>';
    h += '<div class="champ"><label>Niveau moyen</label>' +
      '<div class="compteur" style="justify-content:center">' +
      '<button data-gact="niv-">−</button><span class="n">' + P.niveau + '</span><button data-gact="niv+">+</button>' +
      '</div></div>';
    h += '</div>';
    h += '<button class="btn btn-sm btn-bloc" data-gact="depuis-perso" style="margin-bottom:12px">Reprendre le niveau du personnage actif</button>';

    /* difficulté */
    h += '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:var(--text-mute);margin-bottom:5px">Difficulté</div>';
    h += '<div class="chips" style="margin-bottom:6px">';
    COF.Rencontre.DIFFICULTES.forEach(function (d) {
      h += '<span class="chip ' + (P.difficulte === d.id ? 'on' : '') + '" data-gact="diff" data-v="' + d.id + '">' +
        esc(d.nom) + '</span>';
    });
    h += '</div>';
    var dd = COF.Rencontre.DIFFICULTES.filter(function (x) { return x.id === P.difficulte; })[0];
    h += '<div class="note" style="margin-bottom:12px">' + esc(dd.desc) + '</div>';

    /* style */
    h += '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:var(--text-mute);margin-bottom:5px">Composition</div>';
    h += '<div class="chips" style="margin-bottom:12px">';
    [['auto', 'Au hasard'], ['solo', 'Adversaire seul'], ['bande', 'Bande organisée'],
     ['meute', 'Meute'], ['mixte', 'Hétéroclite']].forEach(function (s) {
      h += '<span class="chip ' + (P.style === s[0] ? 'on' : '') + '" data-gact="style" data-v="' + s[0] + '">' +
        esc(s[1]) + '</span>';
    });
    h += '</div>';

    h += '<div class="stats" style="margin-bottom:12px">' +
      '<div class="stat"><div class="lbl">Budget</div><div class="v">' + b + '</div></div>' +
      '<div class="stat"><div class="lbl">Créatures dispo.</div><div class="v">' + dispo + '</div></div>' +
      '</div>';

    h += '<button class="btn btn-plein btn-bloc" data-gact="generer">⚔️ Générer la rencontre</button>';
    h += '</div></div>';

    h += '<div id="gen-resultat">' + (resultat ? htmlResultat(resultat) : '') + '</div>';

    h += '<div class="carte"><h2>À venir</h2><div class="carte-corps">' +
      '<div class="ligne"><div class="info"><div class="t">🔮 Oracle solo</div>' +
      '<div class="s">Questions oui/non avec nuances, événements aléatoires</div></div></div>' +
      '<div class="ligne"><div class="info"><div class="t">🗺️ Générateur de donjon</div>' +
      '<div class="s">Salles, couloirs, pièges et trésors</div></div></div>' +
      '<div class="ligne"><div class="info"><div class="t">👤 Générateur de PNJ</div>' +
      '<div class="s">Nom, métier, trait de caractère, motivation</div></div></div>' +
      '<div class="ligne"><div class="info"><div class="t">💰 Trésors</div>' +
      '<div class="s">Butin adapté au NC de la rencontre</div></div></div>' +
      '</div></div>';

    n.innerHTML = h;
  }

  /* ---------- Affichage d'une rencontre ---------- */
  function htmlResultat(r) {
    if (r.erreur) return '<div class="carte"><div class="carte-corps"><div class="vide">' + esc(r.erreur) + '</div></div></div>';

    var env = COF.ENVIRONNEMENTS.filter(function (e) { return e.id === r.env; })[0];
    var diff = COF.Rencontre.DIFFICULTES.filter(function (d) { return d.id === r.difficulte; })[0];
    var pct = Math.round(r.ratio * 100);

    var h = '<div class="carte"><h2>' + esc(COF.Rencontre.TYPES[r.type] || 'Rencontre') +
      '<span class="h2-action" data-gact="generer">↻ Relancer</span></h2><div class="carte-corps">';

    h += '<div class="note" style="margin-bottom:12px">' +
      (env ? env.ic + ' ' + esc(env.nom) : '') + ' · ' + r.nbPJ + ' PJ de niveau ' + r.niveau +
      ' · rencontre <b>' + esc(diff.nom.toLowerCase()) + '</b></div>';

    r.lots.forEach(function (l, i) {
      var c = l.c;
      h += '<div class="ligne">' +
        '<div class="pj-av" style="width:38px;height:38px;font-size:15px;border-color:var(--or)">' +
          l.nb + '</div>' +
        '<div class="info"><div class="t">' + esc(c.nom) +
          (l.role === 'chef' ? ' <span class="puce puce-rang">chef</span>' : '') +
          (l.role === 'lieutenant' ? ' <span class="puce">lieutenant</span>' : '') +
          '</div>' +
        '<div class="s">NC ' + esc(c.ncLabel) + ' · DEF ' + c.def + ' · ' + c.pv + ' PV · Init. ' + c.init +
          (c.att && c.att.length ? '<br>' + esc(c.att[0].n) + ' ' + sgn(c.att[0].mod) +
            (c.att[0].dmg ? ' · DM ' + esc(c.att[0].dmg) : '') : '') +
          '</div></div>' +
        '<div class="actions"><button class="btn btn-or btn-sm" data-gact="fiche" data-id="' + c.id + '">Fiche</button></div>' +
        '</div>';
    });

    h += '<div class="sep"></div>';
    h += '<div class="stats">' +
      '<div class="stat"><div class="lbl">Créatures</div><div class="v">' + r.nbCreatures + '</div></div>' +
      '<div class="stat"><div class="lbl">PV cumulés</div><div class="v">' + r.pvTotal + '</div></div>' +
      '<div class="stat"><div class="lbl">Budget</div><div class="v" style="font-size:15px">' +
        r.utilise + '/' + r.budget + '</div></div>' +
      '</div>';
    h += '<div class="barre" style="margin-top:8px"><span style="width:' + Math.min(100, pct) + '%;' +
      'background:linear-gradient(90deg,#8a6d18,var(--or-clair))"></span></div>';
    h += '<div class="note" style="margin-top:6px">' + pct + ' % du budget de difficulté consommé.</div>';

    h += '<div style="display:flex;gap:8px;margin-top:12px">' +
      '<button class="btn" style="flex:1" data-gact="generer">↻ Relancer</button>' +
      '<button class="btn btn-or" style="flex:1" data-gact="init">Ordre d\'initiative</button>' +
      '</div>';

    h += '</div></div>';
    return h;
  }

  /* Feuille d'initiative rapide, PJ compris */
  function ordreInitiative(r) {
    var lignes = [];
    r.lots.forEach(function (l) {
      for (var i = 1; i <= l.nb; i++) {
        lignes.push({
          nom: l.c.nom + (l.nb > 1 ? ' ' + i : ''),
          init: l.c.init, pv: l.c.pv, def: l.c.def
        });
      }
    });
    var p = COF.Store.actif();
    if (p) lignes.push({ nom: p.nom + ' (PJ)', init: COF.Calc.init(p), pv: p.pv, def: COF.Calc.def(p), pj: true });
    lignes.sort(function (a, b) { return b.init - a.init; });

    var h = '<div class="note" style="margin-bottom:10px">Ordre décroissant d\'Initiative. ' +
      'En cas d\'égalité, les créatures de plus haut niveau agissent en premier.</div>';
    lignes.forEach(function (x) {
      h += '<div class="ligne"><div class="pj-av" style="width:34px;height:34px;font-size:13px;' +
        (x.pj ? 'border-color:var(--or)' : 'border-color:var(--line-2)') + '">' + x.init + '</div>' +
        '<div class="info"><div class="t">' + esc(x.nom) + '</div>' +
        '<div class="s">DEF ' + x.def + ' · ' + x.pv + ' PV</div></div></div>';
    });
    COF.UI.ouvrirModale('Ordre d\'initiative', h);
  }

  /* ---------- Actions ---------- */
  function actions(act, node) {
    switch (act) {
      case 'env': P.env = node.getAttribute('data-v'); resultat = null; rendre(); break;
      case 'diff': P.difficulte = node.getAttribute('data-v'); rendre(); break;
      case 'style': P.style = node.getAttribute('data-v'); rendre(); break;
      case 'pj+': P.nbPJ = Math.min(8, P.nbPJ + 1); rendre(); break;
      case 'pj-': P.nbPJ = Math.max(1, P.nbPJ - 1); rendre(); break;
      case 'niv+': P.niveau = Math.min(20, P.niveau + 1); rendre(); break;
      case 'niv-': P.niveau = Math.max(1, P.niveau - 1); rendre(); break;
      case 'depuis-perso': {
        var p = COF.Store.actif();
        if (!p) { alert('Aucun personnage actif.'); break; }
        P.niveau = p.niveau || 1;
        rendre();
        break;
      }
      case 'generer':
        resultat = COF.Rencontre.generer({
          env: P.env, nbPJ: P.nbPJ, niveau: P.niveau,
          difficulte: P.difficulte, style: P.style
        });
        rendre();
        var el = $('#gen-resultat');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      case 'fiche': {
        var c = COF.UI.Bestiaire.get(node.getAttribute('data-id'));
        if (c) COF.UI.Bestiaire.fiche(c);
        break;
      }
      case 'init': if (resultat) ordreInitiative(resultat); break;
    }
  }

  return { init: init, rendre: rendre };
})();
