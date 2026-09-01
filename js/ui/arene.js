/* ============================================================
   COF2 Compagnon — Arène (onglet principal)
   Suivi de combat : ajoutez une rencontre entière, des créatures
   du bestiaire ou des personnages, puis gérez PV/PM, initiative et
   jets (armes, sorts, capacités) depuis la liste des combattants.
   Choisir une attaque propose ensuite de désigner sa cible : la
   difficulté se règle alors automatiquement sur sa DEF, et les
   dégâts s'appliquent dès que le test réussit.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Arene = (function () {
  var $ = COF.UI.$, $$ = COF.UI.$$, esc = COF.UI.esc, sgn = COF.UI.sgn;

  var s = null;
  var cible = null;
  var rechercheBeteQ = '';
  var attenteCible = null;   // callback(ciOuNull) en attente du choix de cible

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-aact]') : null;
      if (!t || !(t.closest('#vue-arene') || t.closest('#modale'))) return;
      actions(t.getAttribute('data-aact'), t);
    });
    document.addEventListener('input', function (e) {
      if (e.target.id === 'arene-recherche-bete') {
        rechercheBeteQ = e.target.value.toLowerCase();
        ouvrirAjoutBete();
      }
    });
  }

  function trouver(id) {
    return s.combattants.filter(function (c) { return c.id === id; })[0] || null;
  }

  /* ---------- Données live d'un combattant ----------
     Les créatures sont figées ; les PJ sont toujours relus depuis
     COF.Store pour rester synchronisés avec la fiche de personnage. */
  function donnees(cb) {
    if (cb.type === 'creature') {
      return { nom: cb.nom, pv: cb.pv, pvMax: cb.pvMax, def: cb.def, init: cb.init, pmMax: 0, vivant: true };
    }
    var p = COF.Store.get(cb.refId);
    if (!p) return { nom: cb.nom + ' (supprimé)', pv: 0, pvMax: 1, def: 0, init: 0, pmMax: 0, vivant: false, perso: null };
    if (p.pv === null) COF.Store.reinitialiser(p);
    var K = COF.Calc;
    return {
      nom: p.nom, pv: p.pv, pvMax: K.pvMax(p), def: K.def(p), init: K.init(p),
      pm: p.pm || 0, pmMax: K.pmMax(p),
      vivant: true, perso: p
    };
  }

  function ajusterPv(cb, delta) {
    if (cb.type === 'creature') { COF.Arene.majPv(cb, delta); COF.Arene.ecrire(s); return; }
    var p = COF.Store.get(cb.refId);
    if (!p) return;
    if (p.pv === null) COF.Store.reinitialiser(p);
    p.pv = Math.max(0, Math.min(COF.Calc.pvMax(p), p.pv + delta));
    COF.Store.sauver(p);
  }

  function ajusterPm(cb, delta) {
    if (cb.type !== 'pj') return;
    var p = COF.Store.get(cb.refId);
    if (!p) return;
    p.pm = Math.max(0, Math.min(COF.Calc.pmMax(p), (p.pm || 0) + delta));
    COF.Store.sauver(p);
  }

  /* Infos de ciblage passées au lanceur de dés : DEF utilisée comme
     difficulté, et applique automatiquement les dégâts en cas de succès. */
  function construireInfosCible(t) {
    var d = donnees(t);
    if (!d.vivant) return null;
    return {
      nom: d.nom, def: d.def,
      appliquer: function (degats) {
        ajusterPv(t, -degats);
        rafraichirListe();
        var d2 = donnees(t);
        return d2.pv + ' / ' + d2.pvMax + ' PV';
      }
    };
  }

  /* Propose de désigner une cible parmi les autres combattants avant
     de lancer les dés. callback(ciOuNull) est appelé avec le résultat. */
  function ouvrirChoixCible(attaquantId, callback) {
    attenteCible = callback;
    var autres = s.combattants.filter(function (c) { return c.id !== attaquantId; });
    var h = '';
    if (!autres.length) {
      h += '<div class="vide">Aucun autre combattant à cibler.</div>';
    } else {
      autres.forEach(function (t) {
        var d = donnees(t);
        h += '<div class="ligne"><div class="info"><div class="t">' + esc(d.nom) +
          (!d.vivant ? ' <span class="puce">supprimé</span>' : '') + '</div>' +
          (d.vivant ? '<div class="s">DEF ' + d.def + ' · ' + d.pv + '/' + d.pvMax + ' PV</div>' : '') + '</div>' +
          '<div class="actions"><button class="btn btn-or btn-sm" ' + (d.vivant ? '' : 'disabled style="opacity:.5"') +
          ' data-aact="cible-choisie" data-tid="' + t.id + '">Cibler</button></div></div>';
      });
    }
    h += '<button class="btn btn-bloc" style="margin-top:10px" data-aact="cible-aucune">Sans cible (test manuel)</button>';
    COF.UI.ouvrirModale('🎯 Choisir une cible', h);
  }

  /* ---------- Rendu principal ---------- */
  function rendre(node) {
    cible = node;
    s = COF.Arene.lire();
    node.innerHTML = '<div id="arene-tete">' + htmlTete() + '</div><div id="arene-liste">' + htmlListe() + '</div>';
  }

  function htmlTete() {
    var h = '';
    h += '<div class="carte"><h2>Arène — combat en cours</h2><div class="carte-corps">';
    h += '<div class="stats" style="margin-bottom:10px">' +
      '<div class="stat"><div class="lbl">Round</div><div class="v">' + s.round + '</div></div>' +
      '<div class="stat"><div class="lbl">Combattants</div><div class="v">' + s.combattants.length + '</div></div>' +
      '</div>';
    h += '<div style="display:flex;gap:8px;margin-bottom:8px">' +
      '<button class="btn btn-or" style="flex:1" data-aact="tour-suivant">▶ Tour suivant</button>' +
      '<button class="btn" style="flex:1" data-aact="trier">🎲 Trier par initiative</button>' +
      '</div>';
    h += '<button class="btn btn-bloc" data-aact="vider">🗑️ Vider l\'arène</button>';
    h += '</div></div>';

    h += '<div class="carte"><h2>Ajouter des combattants</h2><div class="carte-corps">';
    var dernier = COF.UI.Generateurs.dernierResultat();
    h += '<button class="btn btn-plein btn-bloc" style="margin-bottom:8px" data-aact="import-rencontre"' +
      (dernier && !dernier.erreur ? '' : ' disabled style="opacity:.5"') + '>' +
      '📥 Importer la dernière rencontre générée</button>';
    h += '<div style="display:flex;gap:8px">' +
      '<button class="btn" style="flex:1" data-aact="ouvrir-bete">🐉 Créature du bestiaire</button>' +
      '<button class="btn" style="flex:1" data-aact="ouvrir-pj">🛡️ Personnage</button>' +
      '</div>';
    h += '</div></div>';
    return h;
  }

  function rafraichirTete() {
    var el = $('#arene-tete');
    if (el) el.innerHTML = htmlTete();
  }

  function htmlListe() {
    if (!s.combattants.length) {
      return '<div class="carte"><div class="carte-corps"><div class="vide">' +
        'Aucun combattant. Importez une rencontre ou ajoutez-en un.</div></div></div>';
    }
    var h = '';
    s.combattants.forEach(function (cb, i) {
      var d = donnees(cb);
      var pct = d.pvMax > 0 ? Math.max(0, Math.min(100, (d.pv / d.pvMax) * 100)) : 0;
      var actif = i === s.tour;
      var ko = d.pv <= 0;
      h += '<div class="carte" style="margin-bottom:10px;' +
        (actif ? 'border-color:var(--or);box-shadow:0 0 0 1px var(--or)' : '') +
        (ko ? ';opacity:.55' : '') + '"><div class="carte-corps">';

      h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">';
      h += '<div class="pj-av" style="width:36px;height:36px;font-size:13px;flex-shrink:0;' +
        (cb.type === 'pj' ? 'border-color:var(--or)' : '') + '">' + (actif ? '▶' : (cb.type === 'pj' ? '🛡️' : '🐉')) + '</div>';
      h += '<div style="flex:1;min-width:0">' +
        '<div style="font-size:15px;color:var(--text)">' + esc(d.nom) +
        (cb.role === 'chef' ? ' <span class="puce puce-rang">chef</span>' : '') +
        (cb.role === 'lieutenant' ? ' <span class="puce">lieutenant</span>' : '') +
        (ko ? ' <span class="puce">à terre</span>' : '') + '</div>' +
        '<div class="note">DEF ' + d.def + ' · Init ' + d.init +
        (cb.etats.length ? ' · ' + cb.etats.map(function (e) { return etatNom(e); }).join(', ') : '') + '</div></div>';
      h += '<button class="btn btn-sm" data-aact="retirer" data-id="' + cb.id + '">✕</button>';
      h += '</div>';

      if (!d.vivant) {
        h += '<div class="vide">Ce personnage a été supprimé.</div></div></div>';
        return;
      }

      h += '<div class="jauge jauge-pv"><div class="jauge-tete"><span class="lbl">Points de vigueur</span>' +
        '<span class="compteur"><button data-aact="pv-" data-id="' + cb.id + '">−</button>' +
        '<span class="n">' + d.pv + ' / ' + d.pvMax + '</span>' +
        '<button data-aact="pv+" data-id="' + cb.id + '">+</button></span></div>' +
        '<div class="barre"><span style="width:' + pct + '%"></span></div></div>';

      if (cb.type === 'pj' && d.pmMax > 0) {
        var pctPm = Math.max(0, Math.min(100, (d.pm / d.pmMax) * 100));
        h += '<div class="jauge jauge-pm" style="margin-top:6px"><div class="jauge-tete"><span class="lbl">Points de mana</span>' +
          '<span class="compteur"><button data-aact="pm-" data-id="' + cb.id + '">−</button>' +
          '<span class="n">' + d.pm + ' / ' + d.pmMax + '</span>' +
          '<button data-aact="pm+" data-id="' + cb.id + '">+</button></span></div>' +
          '<div class="barre"><span style="width:' + pctPm + '%"></span></div></div>';
      }

      h += '<div style="display:flex;gap:8px;margin-top:10px">' +
        '<button class="btn btn-or" style="flex:2" data-aact="attaquer" data-id="' + cb.id + '">⚔️ Attaquer</button>' +
        '<button class="btn btn-sm" style="flex:1" data-aact="etats" data-id="' + cb.id + '">États</button>' +
        (cb.type === 'creature' ? '<button class="btn btn-sm" style="flex:1" data-aact="fiche-bete" data-id="' + cb.id + '">Fiche</button>' : '') +
        '</div>';

      h += '</div></div>';
    });
    return h;
  }

  function etatNom(id) {
    var e = COF.RULES.etats.filter(function (x) { return x.id === id; })[0];
    return e ? e.nom : id;
  }

  function rafraichirListe() {
    rafraichirTete();
    var el = $('#arene-liste');
    if (el) el.innerHTML = htmlListe();
  }

  /* ---------- Modales d'ajout ---------- */
  function ouvrirAjoutBete() {
    var pool = COF.BESTIAIRE.filter(function (c) {
      return !rechercheBeteQ || c.nom.toLowerCase().indexOf(rechercheBeteQ) >= 0;
    }).slice(0, 40);
    var h = '<input id="arene-recherche-bete" placeholder="Rechercher une créature…" value="' + esc(rechercheBeteQ) + '" ' +
      'style="width:100%;background:var(--bg-2);border:1px solid var(--line-2);border-radius:8px;' +
      'padding:9px 10px;font-size:14px;color:var(--text);margin-bottom:10px">';
    if (!pool.length) h += '<div class="vide">Aucune créature trouvée.</div>';
    pool.forEach(function (c) {
      h += '<div class="ligne"><div class="info"><div class="t">' + esc(c.nom) + '</div>' +
        '<div class="s">NC ' + esc(c.ncLabel) + ' · ' + esc(c.type || '') + '</div></div>' +
        '<div class="actions"><button class="btn btn-or btn-sm" data-aact="ajouter-bete" data-id="' + c.id + '">+ Ajouter</button></div></div>';
    });
    COF.UI.ouvrirModale('🐉 Ajouter une créature', h);
    var input = $('#arene-recherche-bete');
    if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
  }

  function ouvrirAjoutPj() {
    var tous = COF.Store.tous();
    var h = '';
    if (!tous.length) h = '<div class="vide">Aucun personnage enregistré.</div>';
    tous.forEach(function (p) {
      var deja = s.combattants.some(function (c) { return c.type === 'pj' && c.refId === p.id; });
      h += '<div class="ligne"><div class="info"><div class="t">' + esc(p.nom) + '</div>' +
        '<div class="s">' + esc((COF.PROFILS[p.profil] || {}).nom || p.profil) + ' · niv. ' + p.niveau + '</div></div>' +
        '<div class="actions">' + (deja ?
          '<button class="btn btn-sm" disabled style="opacity:.5">Déjà présent</button>' :
          '<button class="btn btn-or btn-sm" data-aact="ajouter-pj" data-id="' + p.id + '">+ Ajouter</button>') +
        '</div></div>';
    });
    COF.UI.ouvrirModale('🛡️ Ajouter un personnage', h);
  }

  function ouvrirEtats(cb) {
    var h = '<div class="chips">';
    COF.RULES.etats.forEach(function (e) {
      var actif = cb.etats.indexOf(e.id) >= 0;
      h += '<span class="chip ' + (actif ? 'on' : '') + '" data-aact="toggle-etat" data-id="' + cb.id + '" data-e="' + e.id + '">' +
        esc(e.nom) + '</span>';
    });
    h += '</div><div class="note" style="margin-top:12px">' +
      COF.RULES.etats.map(function (e) { return '<b>' + esc(e.nom) + '</b> — ' + esc(e.effet); }).join('<br>') +
      '</div>';
    COF.UI.ouvrirModale('États de ' + donnees(cb).nom, h);
  }

  /* Menu d'attaque : attaques génériques + armes + sorts/capacités
     de dégâts pour un PJ, attaques de la fiche pour une créature.
     Choisir une ligne ouvre ensuite le choix de la cible. */
  function modalAttaques(cb) {
    var h = '<div class="note" style="margin-bottom:10px">Choisissez une attaque : la cible sera demandée juste après.</div>';

    if (cb.type === 'creature') {
      if (!cb.att.length) h += '<div class="vide">Aucune attaque connue pour cette créature.</div>';
      cb.att.forEach(function (a, i) {
        h += '<div class="ligne"><div class="info"><div class="t">' + esc(a.n) + ' ' + sgn(a.mod) + '</div>' +
          '<div class="s">' + (a.dmg ? 'DM ' + esc(a.dmg) : 'pas de DM fixe') +
          (a.portee ? ' · portée ' + a.portee + ' m' : '') + (a.note ? ' · ' + esc(a.note) : '') + '</div></div>' +
          '<div class="actions"><button class="btn btn-or btn-sm" data-aact="cr-att" data-id="' + cb.id + '" data-i="' + i + '">Choisir</button></div></div>';
      });
      COF.UI.ouvrirModale('⚔️ ' + donnees(cb).nom, h);
      return;
    }

    var p = COF.Store.get(cb.refId);
    if (!p) { COF.UI.ouvrirModale('⚔️ Attaquer', '<div class="vide">Personnage introuvable.</div>'); return; }
    var K = COF.Calc;
    var a = K.attaques(p);

    var lbl = { contact: 'Contact (FOR)', distance: 'Distance (AGI)', magique: 'Magique (VOL)' };
    ['contact', 'distance', 'magique'].forEach(function (t) {
      h += '<div class="ligne"><div class="info"><div class="t">' + lbl[t] + '</div>' +
        '<div class="s">Jet à mains nues / sans arme</div></div>' +
        '<div class="actions"><button class="btn btn-sm" data-aact="pj-type" data-id="' + cb.id + '" data-t="' + t + '">' +
        sgn(a[t]) + '</button></div></div>';
    });

    if ((p.armes || []).length) {
      h += '<div class="note" style="margin:10px 0 4px">Armes</div>';
      p.armes.forEach(function (w, i) {
        h += '<div class="ligne"><div class="info"><div class="t">' + esc(w.nom) + '</div>' +
          '<div class="s">DM ' + esc(COF.UI.dmgArme(p, w)) + (w.portee ? ' · portée ' + w.portee + ' m' : '') + '</div></div>' +
          '<div class="actions"><button class="btn btn-or btn-sm" data-aact="pj-arme" data-id="' + cb.id + '" data-i="' + i + '">Choisir</button></div></div>';
      });
    }

    var sorts = K.sorts(p).filter(function (x) { return x.cap.dmg && x.cap.t !== 'soin'; });
    if (sorts.length) {
      h += '<div class="note" style="margin:10px 0 4px">Sorts</div>';
      sorts.forEach(function (x) {
        var c = x.cap;
        h += '<div class="ligne"><div class="info"><div class="t">' + esc(c.n) + '</div>' +
          '<div class="s">' + esc(x.voie.nom) + ' · rang ' + c.r + ' · ' + c.r + ' PM · ' + esc(c.dmg) + '</div></div>' +
          '<div class="actions"><button class="btn btn-or btn-sm" data-aact="pj-sort" data-id="' + cb.id +
          '" data-vk="' + esc(x.voieKey) + '" data-r="' + c.r + '">Choisir</button></div></div>';
      });
    }

    var caps = K.capacites(p).filter(function (x) { return !x.cap.s && x.cap.dmg; });
    if (caps.length) {
      h += '<div class="note" style="margin:10px 0 4px">Capacités</div>';
      caps.forEach(function (x) {
        var c = x.cap;
        h += '<div class="ligne"><div class="info"><div class="t">' + esc(c.n) + '</div>' +
          '<div class="s">' + esc(x.voie.nom) + ' · rang ' + c.r +
          (c.t === 'bonus' ? ' · bonus aux DM' : '') + '</div></div>' +
          '<div class="actions"><button class="btn btn-or btn-sm" data-aact="pj-cap" data-id="' + cb.id +
          '" data-vk="' + esc(x.voieKey) + '" data-r="' + c.r + '">Choisir</button></div></div>';
      });
    }

    COF.UI.ouvrirModale('⚔️ ' + p.nom, h);
  }

  function trouverCapacite(p, voieKey, rang) {
    return COF.Calc.capacites(p).filter(function (x) {
      return x.voieKey === voieKey && x.cap.r === rang;
    })[0];
  }

  /* ---------- Lanceurs de dés (appelés une fois la cible choisie) ---------- */
  function lancerCrAtt(cb, i, ci) {
    var a = cb.att[i];
    COF.UI.jet({
      titre: donnees(cb).nom + ' — ' + a.n,
      sousTitre: (a.portee ? 'portée ' + a.portee + ' m' : '') + (a.note ? ' · ' + a.note : '') +
        (ci ? ' · 🎯 ' + ci.nom + ' (DEF ' + ci.def + ')' : ''),
      mod: a.mod, difficulte: ci ? ci.def : null, dmg: a.dmg || null, dmgLabel: 'Dommages',
      cible: ci,
      ctx: { carac: {}, niveau: Math.floor(cb.nc) || 1, deEvo: COF.deEvolutif(Math.floor(cb.nc) || 1) },
      type: 'attaque'
    });
  }

  function lancerPjType(p, t, ci) {
    var K = COF.Calc, aa = K.attaques(p);
    var lbl = { contact: 'Attaque au contact', distance: 'Attaque à distance', magique: 'Attaque magique' }[t];
    COF.UI.jet({
      titre: p.nom + ' — ' + lbl,
      sousTitre: ci ? '🎯 ' + ci.nom + ' (DEF ' + ci.def + ')' : '',
      mod: aa[t], difficulte: ci ? ci.def : null, cible: ci, ctx: K.ctx(p), type: 'attaque'
    });
  }

  function lancerPjArme(p, i, ci) {
    var K = COF.Calc, aa = K.attaques(p);
    var w = p.armes[i];
    var att = w.type === 'distance' ? aa.distance : (w.type === 'magique' ? aa.magique : aa.contact);
    COF.UI.jet({
      titre: p.nom + ' — ' + w.nom,
      sousTitre: ci ? '🎯 ' + ci.nom + ' (DEF ' + ci.def + ')' : '',
      mod: att, critMin: w.crit || 20, dmg: COF.UI.dmgArme(p, w), dmgLabel: 'Dommages',
      difficulte: ci ? ci.def : null, cible: ci, ctx: K.ctx(p), type: 'attaque'
    });
  }

  function lancerPjSort(p, voieKey, rang, ci) {
    var x = trouverCapacite(p, voieKey, rang);
    if (!x) return;
    var cout = x.cap.r;
    if (p.pm < cout && !confirm('Il manque ' + (cout - p.pm) + ' point(s) de mana pour lancer ' + x.cap.n +
      '. Lancer quand même (PM ramenés à 0) ?')) return;
    p.pm = Math.max(0, p.pm - cout);
    COF.Store.sauver(p);
    rafraichirListe();
    COF.UI.jetCapacite(x.cap, x.voie.nom, x.cap.r, p, ci);
  }

  function lancerPjCap(p, voieKey, rang, ci) {
    var x = trouverCapacite(p, voieKey, rang);
    if (!x) return;
    COF.UI.jetCapacite(x.cap, x.voie.nom, x.cap.r, p, ci);
  }

  /* ---------- Actions ---------- */
  function actions(act, node) {
    var id = node.getAttribute('data-id');
    var cb = id ? trouver(id) : null;

    switch (act) {
      case 'import-rencontre': {
        var r = COF.UI.Generateurs.dernierResultat();
        if (r && !r.erreur) { COF.Arene.ajouterLots(s, r.lots); COF.Arene.ecrire(s); rafraichirListe(); }
        break;
      }
      case 'ouvrir-bete': rechercheBeteQ = ''; ouvrirAjoutBete(); break;
      case 'ouvrir-pj': ouvrirAjoutPj(); break;
      case 'ajouter-bete': {
        var c = COF.UI.Bestiaire.get(id);
        if (c) { COF.Arene.ajouterCreature(s, c); COF.Arene.ecrire(s); rafraichirListe(); ouvrirAjoutBete(); }
        break;
      }
      case 'ajouter-pj': {
        var p0 = COF.Store.get(id);
        if (p0) { COF.Arene.ajouterPersonnage(s, p0); COF.Arene.ecrire(s); rafraichirListe(); COF.UI.fermerModale(); }
        break;
      }
      case 'retirer':
        COF.Arene.retirer(s, id); COF.Arene.ecrire(s); rafraichirListe();
        break;
      case 'pv-': if (cb) { ajusterPv(cb, -1); rafraichirListe(); } break;
      case 'pv+': if (cb) { ajusterPv(cb, 1); rafraichirListe(); } break;
      case 'pm-': if (cb) { ajusterPm(cb, -1); rafraichirListe(); } break;
      case 'pm+': if (cb) { ajusterPm(cb, 1); rafraichirListe(); } break;
      case 'trier':
        s.combattants.sort(function (a, b) { return donnees(b).init - donnees(a).init; });
        s.tour = 0;
        COF.Arene.ecrire(s); rafraichirListe();
        break;
      case 'tour-suivant': COF.Arene.tourSuivant(s); COF.Arene.ecrire(s); rafraichirListe(); break;
      case 'vider':
        if (confirm("Vider l'arène et retirer tous les combattants ?")) {
          s = COF.Arene.vider(); COF.Arene.ecrire(s); rendre(cible);
        }
        break;
      case 'etats': if (cb) ouvrirEtats(cb); break;
      case 'toggle-etat': if (cb) { COF.Arene.toggleEtat(cb, node.getAttribute('data-e')); COF.Arene.ecrire(s); ouvrirEtats(cb); rafraichirListe(); } break;
      case 'attaquer': if (cb) modalAttaques(cb); break;
      case 'fiche-bete': {
        var cc = cb ? COF.UI.Bestiaire.get(cb.refId) : null;
        if (cc) COF.UI.Bestiaire.fiche(cc);
        break;
      }

      /* Choix de l'attaque → ouvre le choix de cible, callback en attente */
      case 'cr-att': {
        var i1 = +node.getAttribute('data-i');
        ouvrirChoixCible(cb.id, function (ci) { lancerCrAtt(cb, i1, ci); });
        break;
      }
      case 'pj-type': {
        var p1 = COF.Store.get(cb.refId); if (!p1) break;
        var t = node.getAttribute('data-t');
        ouvrirChoixCible(cb.id, function (ci) { lancerPjType(p1, t, ci); });
        break;
      }
      case 'pj-arme': {
        var p2 = COF.Store.get(cb.refId); if (!p2) break;
        var i2 = +node.getAttribute('data-i');
        ouvrirChoixCible(cb.id, function (ci) { lancerPjArme(p2, i2, ci); });
        break;
      }
      case 'pj-sort': {
        var p3 = COF.Store.get(cb.refId); if (!p3) break;
        var vk3 = node.getAttribute('data-vk'), r3 = +node.getAttribute('data-r');
        ouvrirChoixCible(cb.id, function (ci) { lancerPjSort(p3, vk3, r3, ci); });
        break;
      }
      case 'pj-cap': {
        var p4 = COF.Store.get(cb.refId); if (!p4) break;
        var vk4 = node.getAttribute('data-vk'), r4 = +node.getAttribute('data-r');
        ouvrirChoixCible(cb.id, function (ci) { lancerPjCap(p4, vk4, r4, ci); });
        break;
      }

      /* Résolution du choix de cible */
      case 'cible-choisie': {
        var t = trouver(node.getAttribute('data-tid'));
        var cb2 = attenteCible;
        attenteCible = null;
        if (cb2) cb2(t ? construireInfosCible(t) : null);
        break;
      }
      case 'cible-aucune': {
        var cb3 = attenteCible;
        attenteCible = null;
        if (cb3) cb3(null);
        break;
      }
    }
  }

  return { init: init, rendre: rendre };
})();
