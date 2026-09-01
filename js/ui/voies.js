/* ============================================================
   COF2 Compagnon — Onglet « Voies » : acquisition des capacités
   Voies de profil · voie de peuple · voies de prestige · profil hybride
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Voies = (function () {
  var $ = COF.UI.$, $$ = COF.UI.$$, esc = COF.UI.esc, sgn = COF.UI.sgn;
  var C = null;
  var hybProfil = null;      // profil affiché dans la section hybride
  var prestigeFam = null;    // famille affichée dans la section prestige

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-vact]') : null;
      if (!t || !t.closest('#vue-voies')) return;
      actions(t.getAttribute('data-vact'), t);
    });
    document.addEventListener('change', function (e) {
      var t = e.target;
      if (!t.hasAttribute || !t.closest || !t.closest('#vue-voies')) return;
      if (t.id === 'sel-hyb') { hybProfil = t.value; rendre(); }
      if (t.id === 'sel-prestige') { prestigeFam = t.value; rendre(); }
    });
  }

  function sauver() { COF.Store.sauver(C); }

  function rendre() {
    C = COF.Store.actif();
    var n = $('#vue-voies');
    if (!C) { n.innerHTML = '<div class="vide">Aucun personnage sélectionné.</div>'; return; }

    var pr = COF.PROFILS[C.profil];
    var pc = COF.Calc.pointsCapacite(C);
    if (!hybProfil) hybProfil = Object.keys(COF.PROFILS).filter(function (k) { return k !== C.profil; })[0];
    if (!prestigeFam) prestigeFam = pr.famille;

    var h = '';

    /* ---- Résumé ---- */
    h += '<div class="carte"><div class="carte-corps">' +
      '<div class="stats">' +
      '<div class="stat"><div class="lbl">Niveau</div><div class="v">' + C.niveau + '</div></div>' +
      '<div class="stat"><div class="lbl">Pts capacité</div><div class="v" style="color:' +
        (pc.reste < 0 ? 'var(--sang-clair)' : 'var(--or-clair)') + '">' + pc.reste + '</div></div>' +
      '<div class="stat"><div class="lbl">Voies</div><div class="v">' + (C.voies || []).length + '</div></div>' +
      '</div>' +
      '<div class="note" style="margin-top:8px">Rang 1-2 : 1 point · rang 3+ : 2 points. ' +
      'Niveau requis — rang 2 : 2, rang 3 : 3, rang 4 : 5, rang 5 : 7. ' +
      'Au niveau 1, trois rangs 1 sont gratuits (deux voies de profil + la voie de peuple). ' +
      'Maximum six voies, plus la voie de peuple.</div>' +
      '</div></div>';

    /* ---- Voies du profil principal (mises en avant) ---- */
    h += '<div class="carte"><h2>Voies de ' + esc(pr.nom) + '</h2><div class="carte-corps">';
    pr.voies.forEach(function (v) { h += voieHTML(v, 'profil.' + v.id); });
    h += '</div></div>';

    /* ---- Voie de peuple ---- */
    var pe = COF.PEUPLES[C.peuple];
    h += '<div class="carte"><h2>Voie de peuple — ' + esc(pe.nom) + '</h2><div class="carte-corps">';
    if (pe.voie) {
      h += voieHTML(pe.voie, 'peuple.' + pe.id);
    } else if (pe.voieChoix) {
      h += '<div class="note" style="margin-bottom:8px">' + esc(pe.voieSpeciale) + '</div>';
      pe.voieChoix.forEach(function (k) {
        var v = COF.PEUPLES[k];
        if (v && v.voie) h += voieHTML(v.voie, 'peuple.' + k);
      });
    }
    if (pr.famille === 'mage') {
      h += '<div class="note" style="margin:10px 0 6px;color:var(--or)">Option des mages : remplacer la voie de peuple par la voie du mage.</div>';
      h += voieHTML(COF.VOIE_MAGE, 'mage');
    }
    h += '</div></div>';

    /* ---- Voie de prestige (repliée) ---- */
    h += blocPrestige(pr);

    /* ---- Autres voies : profil hybride (repliée) ---- */
    h += blocHybride(pr);

    /* ---- Voies d'historique (repliée) ---- */
    h += blocHistorique();

    n.innerHTML = h;

    $$('.voie-tete', n).forEach(function (t) {
      t.addEventListener('click', function (e) {
        if (e.target.hasAttribute('data-vact')) return;
        t.parentNode.classList.toggle('ouvert');
      });
    });
    $$('#vue-voies .pliable > h2').forEach(function (t) {
      t.addEventListener('click', function () { t.parentNode.classList.toggle('ferme'); });
    });
  }

  /* ---------------- Voies de prestige ---------------- */
  function blocPrestige(pr) {
    var active = COF.Calc.prestigeActive(C);
    var dispo = (C.niveau || 1) >= 5;
    var fams = [
      { id: 'generique', nom: 'Génériques (tous profils)' },
      { id: 'aventurier', nom: 'Aventurier' },
      { id: 'combattant', nom: 'Combattant' },
      { id: 'mage', nom: 'Mage' },
      { id: 'mystique', nom: 'Mystique' }
    ];

    var h = '<div class="carte pliable ' + (active ? '' : 'ferme') + '">' +
      '<h2>Voie de prestige' + (active ? ' ✦' : '') + '</h2><div class="carte-corps">';

    h += '<div class="note" style="margin-bottom:10px">' +
      'À partir du niveau 5, un personnage peut choisir <b>une seule</b> voie de prestige pour toute sa carrière, ' +
      'dans les voies génériques ou celles de sa famille de profils (' + esc(COF.RULES.familles[pr.famille].nom) + '). ' +
      'Rangs 4 à 8 — niveaux requis : 5, 7, 9, 11 et 13.</div>';

    if (!dispo) h += '<div class="note" style="color:var(--sang-clair);margin-bottom:10px">Niveau 5 requis.</div>';
    if (active) {
      var def = COF.Calc.voieDef(C, active.key);
      h += '<div class="note" style="margin-bottom:10px;color:var(--or-clair)">Voie choisie : <b>' +
        esc(def ? def.nom : active.key) + '</b> (rang ' + active.rang + '). Retirez tous ses rangs pour en changer.</div>';
    }

    h += '<div class="champ"><label>Famille</label><select id="sel-prestige">' +
      fams.map(function (f) {
        var recom = (f.id === 'generique' || f.id === pr.famille) ? '' : ' — hors famille';
        return '<option value="' + f.id + '"' + (f.id === prestigeFam ? ' selected' : '') + '>' +
          esc(f.nom + recom) + '</option>';
      }).join('') + '</select></div>';

    var liste = Object.keys(COF.PRESTIGE || {})
      .map(function (k) { return COF.PRESTIGE[k]; })
      .filter(function (v) { return v.fam === prestigeFam; });

    if (!liste.length) h += '<div class="vide">Aucune voie dans cette famille.</div>';
    liste.forEach(function (v) {
      h += voieHTML(v, 'prestige.' + v.id, { bloque: active && active.key !== 'prestige.' + v.id });
    });

    h += '</div></div>';
    return h;
  }

  /* ---------------- Profil hybride ---------------- */
  function blocHybride(pr) {
    var ouvertes = (C.voies || []).filter(function (v) { return v.key.indexOf('hyb.') === 0; });
    var h = '<div class="carte pliable ' + (ouvertes.length ? '' : 'ferme') + '">' +
      '<h2>Autres voies — profil hybride' + (ouvertes.length ? ' (' + ouvertes.length + ')' : '') +
      '</h2><div class="carte-corps">';

    h += '<div class="note" style="margin-bottom:10px">' +
      "Dès le niveau 2, un personnage peut ouvrir une voie issue d'un autre profil : c'est un profil hybride. " +
      "Le MJ peut exiger un événement de jeu (mentor, adoubement, guilde…). Les limitations d'armure du profil " +
      "principal s'appliquent sauf mention contraire, et lancer un sort en armure impose un surcoût de mana.</div>";

    if (ouvertes.length) {
      h += '<div style="font-size:11.5px;text-transform:uppercase;letter-spacing:.8px;color:var(--or);margin-bottom:6px">Voies hybrides ouvertes</div>';
      ouvertes.forEach(function (v) {
        var def = COF.Calc.voieDef(C, v.key);
        if (def) h += voieHTML(def, v.key);
      });
      h += '<div class="sep"></div>';
    }

    h += '<div class="champ"><label>Explorer les voies d\'un autre profil</label><select id="sel-hyb">' +
      Object.keys(COF.PROFILS).filter(function (k) { return k !== C.profil; }).map(function (k) {
        var p2 = COF.PROFILS[k];
        return '<option value="' + k + '"' + (k === hybProfil ? ' selected' : '') + '>' +
          esc(p2.nom) + ' — ' + esc(COF.RULES.familles[p2.famille].nom) + '</option>';
      }).join('') + '</select></div>';

    var pro = COF.PROFILS[hybProfil];
    if (pro) {
      h += '<div class="note" style="margin-bottom:8px">' + esc(pro.resume) + '<br>' +
        'Caractéristiques clés : <b>' + pro.caracs.join(', ') + '</b> · ' + esc(pro.armuresTexte) + '</div>';
      pro.voies.forEach(function (v) {
        var key = 'hyb.' + pro.id + '.' + v.id;
        if (ouvertes.some(function (o) { return o.key === key; })) return;  // déjà listée plus haut
        h += voieHTML({ id: v.id, nom: v.nom, caps: v.caps }, key);
      });
    }
    h += '</div></div>';
    return h;
  }

  /* ---------------- Voies d'historique (Atlas d'Osgild) ---------------- */
  function blocHistorique() {
    var ouvertes = (C.voies || []).filter(function (v) { return v.key.indexOf('historique.') === 0; });
    var h = '<div class="carte pliable ' + (ouvertes.length ? '' : 'ferme') + '">' +
      "<h2>Voies d'historique" + (ouvertes.length ? ' (' + ouvertes.length + ')' : '') +
      '</h2><div class="carte-corps">';

    h += '<div class="note" style="margin-bottom:10px">' +
      "Règle optionnelle de l'Atlas d'Osgild : en plus de ses voies de profil, un personnage peut investir " +
      "dans une voie liée à son origine géographique et/ou à son métier d'avant l'aventure. Ces voies coûtent " +
      "toujours <b>1 point de capacité par rang</b>, sans aucun niveau requis.</div>";

    if (ouvertes.length) {
      h += '<div style="font-size:11.5px;text-transform:uppercase;letter-spacing:.8px;color:var(--or);margin-bottom:6px">Voies ouvertes</div>';
      ouvertes.forEach(function (v) {
        var def = COF.Calc.voieDef(C, v.key);
        if (def) h += voieHTML(def, v.key);
      });
      h += '<div class="sep"></div>';
    }

    h += '<div style="font-size:11.5px;text-transform:uppercase;letter-spacing:.8px;color:var(--or);margin-bottom:6px">Origine géographique</div>';
    COF.HISTORIQUE_GEO.forEach(function (v) {
      var key = 'historique.' + v.id;
      if (ouvertes.some(function (o) { return o.key === key; })) return;
      h += voieHTML(v, key);
    });

    h += '<div style="font-size:11.5px;text-transform:uppercase;letter-spacing:.8px;color:var(--or);margin:10px 0 6px">Voie professionnelle</div>';
    COF.HISTORIQUE_PRO.forEach(function (v) {
      var key = 'historique.' + v.id;
      if (ouvertes.some(function (o) { return o.key === key; })) return;
      h += voieHTML(v, key);
    });

    h += '</div></div>';
    return h;
  }

  /* ---------------- Rendu d'une voie ---------------- */
  function voieHTML(voie, key, opts) {
    opts = opts || {};
    var rang = COF.Calc.rangDe(C, key);
    var rangs = COF.Calc.rangsDe(voie);
    var base = rangs[0];
    var h = '<div class="voie' + (rang > 0 ? ' ouvert' : '') + '">';
    h += '<div class="voie-tete"><span class="nom">' + esc(voie.nom) + '</span><span class="rangs">';
    rangs.forEach(function (r) {
      h += '<span class="pastille ' + (r <= rang ? 'on' : '') + '"></span>';
    });
    h += '</span></div><div class="voie-corps">';

    if (voie.desc) h += '<div class="note" style="margin:6px 0">' + esc(voie.desc) + '</div>';
    if (voie.prereq) h += '<div class="note" style="margin:6px 0;color:var(--or)">Prérequis : ' + esc(voie.prereq) + '</div>';
    if (voie.exception) h += '<div class="note" style="margin:6px 0;color:var(--or)">' + esc(voie.exception) + '</div>';
    if (voie.note) h += '<div class="note" style="margin:6px 0">' + esc(voie.note) + '</div>';

    voie.caps.forEach(function (c) {
      var acquise = c.r <= rang;
      var suivant = (rang === 0) ? (c.r === base) : (c.r === rang + 1);
      var nivOK = (C.niveau || 1) >= COF.Calc.niveauRequis(key, c.r);
      var cls = acquise ? 'acquise' : (suivant && nivOK && !opts.bloque ? '' : 'verrou');
      h += '<div class="cap ' + cls + '">' +
        '<div class="cap-tete"><div class="cap-num">' + c.r + '</div>' +
        '<div class="cap-nom">' + esc(c.n) + ' ' + puces(c) + '</div></div>' +
        '<div class="cap-desc">' + esc(c.d) + '</div>';
      h += '<div class="cap-actions">';
      if (acquise && c.r === rang) {
        h += '<button class="btn btn-sm" data-vact="retirer" data-k="' + key + '">Retirer ce rang</button>';
      } else if (suivant) {
        var cout = COF.Calc.estHistorique(key) ? 1 : (COF.RULES.rangCout[c.r] || 2);
        if (opts.bloque) h += '<span class="note">Une seule voie de prestige par carrière</span>';
        else if (nivOK) h += '<button class="btn btn-or btn-sm" data-vact="acquerir" data-k="' + key +
          '" data-r="' + c.r + '">Acquérir (' + cout + ' pt' + (cout > 1 ? 's' : '') + ')</button>';
        else h += '<span class="note">Niveau ' + COF.Calc.niveauRequis(key, c.r) + ' requis</span>';
      }
      if (c.dmg && acquise) h += '<button class="btn btn-sm" data-vact="attaquer" data-k="' + key +
        '" data-r="' + c.r + '">Attaquer</button>';
      h += '</div></div>';
    });
    h += '</div></div>';
    return h;
  }

  function puces(c) {
    var h = '';
    if (c.s) h += '<span class="puce puce-sort">sort · ' + c.r + ' PM</span>';
    if (c.a) h += '<span class="puce puce-' + c.a.toLowerCase() + '">' + c.a + '</span>';
    if (c.f) h += '<span class="puce">1×/' + c.f + '</span>';
    if (c.comp) h += '<span class="puce">compétence</span>';
    if (c.choix) h += '<span class="puce">choix</span>';
    return h;
  }

  /* ---------------- Actions ---------------- */
  function actions(act, node) {
    var key = node.getAttribute('data-k');
    var v = (C.voies || []).filter(function (x) { return x.key === key; })[0];
    var def = COF.Calc.voieDef(C, key);

    if (act === 'acquerir') {
      var r = parseInt(node.getAttribute('data-r'), 10);
      if (!v) { v = { key: key, rang: 0 }; C.voies.push(v); }
      v.rang = r;
      sauver(); rendre();
    } else if (act === 'retirer') {
      if (v) {
        var base = COF.Calc.rangsDe(def)[0];
        v.rang--;
        if (v.rang < base) C.voies = C.voies.filter(function (x) { return x.key !== key; });
      }
      sauver(); rendre();
    } else if (act === 'attaquer') {
      var cap = def.caps.filter(function (x) { return x.r === +node.getAttribute('data-r'); })[0];
      COF.UI.jetCapacite(cap, def.nom, v ? v.rang : cap.r);
    }
  }

  return { init: init, rendre: rendre };
})();
