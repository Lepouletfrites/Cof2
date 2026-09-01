/* ============================================================
   COF2 Compagnon — Onglet « Fiche » : la feuille de personnage interactive
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Fiche = (function () {
  var $ = COF.UI.$, $$ = COF.UI.$$, esc = COF.UI.esc, sgn = COF.UI.sgn, el = COF.UI.el;
  var C = null;             // personnage courant
  var editCarac = false;

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-act]') : null;
      if (!t || !t.closest('#vue-fiche')) return;
      actions(t.getAttribute('data-act'), t);
    });
  }

  function sauver() { COF.Store.sauver(C); }

  function rendre() {
    C = COF.Store.actif();
    var n = $('#vue-fiche-corps');
    if (!C) {
      n.innerHTML = '<div class="vide">Aucun personnage sélectionné.<br><br>' +
        '<button class="btn btn-plein" onclick="COF.UI.aller(\'persos\')">Choisir un personnage</button></div>';
      return;
    }
    if (C.pv === null) COF.Store.reinitialiser(C);
    C.compagnons = C.compagnons || [];

    var pr = COF.PROFILS[C.profil];
    var K = COF.Calc;

    var h = '';
    h += blocCaracs(pr);
    h += blocCombat();
    h += blocJauges();
    h += blocEtats();
    h += blocArmes();
    h += blocSorts();
    h += blocCapacites();
    h += blocCompagnons();
    h += blocCompetences();
    h += blocEquipement(pr);
    h += blocAjustements();
    h += blocNotes();
    n.innerHTML = h;

    /* replier / déplier */
    $$('.pliable > h2', n).forEach(function (t) {
      t.addEventListener('click', function (e) {
        if (e.target.classList.contains('h2-action')) return;
        t.parentNode.classList.toggle('ferme');
      });
    });
    COF.UI.majTitre();
  }

  /* ---------------- Caractéristiques ---------------- */
  function blocCaracs(pr) {
    var h = '<div class="carte"><h2>Caractéristiques' +
      '<span class="h2-action" data-act="edit-carac">' + (editCarac ? 'Terminé' : 'Modifier') + '</span></h2>' +
      '<div class="carte-corps"><div class="caracs">';
    COF.RULES.caracs.forEach(function (c) {
      var v = C.carac[c.id] || 0;
      var cle = pr.caracs.indexOf(c.id) >= 0;
      if (editCarac) {
        h += '<div class="carac ' + (cle ? 'cle' : '') + '">' +
          '<div class="nom">' + c.id + '</div>' +
          '<div class="val">' + sgn(v) + '</div>' +
          '<div style="display:flex;gap:3px;justify-content:center;margin-top:4px">' +
          '<button class="btn btn-sm" data-act="carac-" data-c="' + c.id + '">−</button>' +
          '<button class="btn btn-sm" data-act="carac+" data-c="' + c.id + '">+</button></div></div>';
      } else {
        h += '<div class="carac ' + (cle ? 'cle' : '') + '" data-act="test-carac" data-c="' + c.id + '">' +
          '<div class="nom">' + c.id + '</div>' +
          '<div class="val">' + sgn(v) + '</div>' +
          '<div class="mod">' + esc(COF.RULES.echelle[String(v)] ? '' : '') + 'test</div></div>';
      }
    });
    h += '</div>';
    if (editCarac) h += '<div class="aide note" style="margin-top:10px">Valeurs finales, modificateurs de peuple inclus. Les capacités « héroïques » (rang 4) ajoutent +1 : reportez-le ici.</div>';
    h += '</div></div>';
    return h;
  }

  /* ---------------- Combat ---------------- */
  function blocCombat() {
    var K = COF.Calc, a = K.attaques(C);
    var h = '<div class="carte"><h2>Combat</h2><div class="carte-corps">';
    h += '<div class="stats" style="margin-bottom:8px">' +
      '<div class="stat"><div class="lbl">Défense</div><div class="v">' + K.def(C) + '</div></div>' +
      '<div class="stat"><div class="lbl">Initiative</div><div class="v">' + K.init(C) + '</div></div>' +
      '<div class="stat"><div class="lbl">Dé évolutif</div><div class="v">d' + K.deEvo(C) + '</div></div>' +
      '</div>';
    h += '<div class="stats">' +
      '<div class="stat action att" data-act="att" data-t="contact"><div class="lbl">Contact</div><div class="v">' + sgn(a.contact) + '</div></div>' +
      '<div class="stat action att" data-act="att" data-t="distance"><div class="lbl">Distance</div><div class="v">' + sgn(a.distance) + '</div></div>' +
      '<div class="stat action att" data-act="att" data-t="magique"><div class="lbl">Magique</div><div class="v">' + sgn(a.magique) + '</div></div>' +
      '</div>';
    h += '<div class="note" style="margin-top:8px;font-size:11.5px">Armure : ' +
      esc(K.armure(C).nom) + ' (DEF ' + sgn(K.armure(C).def) + ', AGI max ' + sgn(K.armure(C).agiMax) + ')' +
      (K.bouclier(C).def ? ' · ' + esc(K.bouclier(C).nom) : '') + '</div>';
    h += '</div></div>';
    return h;
  }

  /* ---------------- Jauges ---------------- */
  function jauge(cls, lbl, cur, max, act, extra) {
    var pct = max > 0 ? Math.max(0, Math.min(100, (cur / max) * 100)) : 0;
    return '<div class="jauge ' + cls + '">' +
      '<div class="jauge-tete"><span class="lbl">' + lbl + (extra || '') + '</span>' +
      '<span class="compteur">' +
      '<button data-act="' + act + '-">−</button>' +
      '<span class="n">' + cur + ' / ' + max + '</span>' +
      '<button data-act="' + act + '+">+</button></span></div>' +
      '<div class="barre"><span style="width:' + pct + '%"></span></div></div>';
  }

  function blocJauges() {
    var K = COF.Calc;
    var h = '<div class="carte"><h2>Ressources' +
      '<span class="h2-action" data-act="repos">Repos</span></h2><div class="carte-corps"><div class="jauges">';
    h += jauge('jauge-pv', 'Points de vigueur', C.pv, K.pvMax(C), 'pv');
    if (K.pmMax(C) > 0) h += jauge('jauge-pm', 'Points de mana', C.pm, K.pmMax(C), 'pm');
    h += jauge('jauge-pc', 'Points de chance', C.pc, K.pcMax(C), 'pc');
    h += jauge('jauge-dr', 'Dés de récupération', C.dr, K.drMax(C), 'dr', ' (d' + K.drType(C) + ')');
    h += '</div>';
    if (C.dmTemp) h += '<div class="note" style="margin-top:8px;color:var(--sang-clair)">DM temporaires : ' + C.dmTemp + '</div>';
    h += '<div style="display:flex;gap:8px;margin-top:12px">' +
      '<button class="btn" style="flex:1" data-act="recup-rapide">Récup. rapide</button>' +
      '<button class="btn" style="flex:1" data-act="recup-complete">Récup. complète</button>' +
      '<button class="btn btn-or" data-act="pc-depense">PC +10</button></div>';
    h += '</div></div>';
    return h;
  }

  /* ---------------- États ---------------- */
  function blocEtats() {
    var h = '<div class="carte pliable ' + ((C.etats && C.etats.length) ? '' : 'ferme') + '"><h2>États préjudiciables</h2><div class="carte-corps"><div class="chips">';
    COF.RULES.etats.forEach(function (e) {
      var on = (C.etats || []).indexOf(e.id) >= 0;
      h += '<span class="chip ' + (on ? 'on' : '') + '" data-act="etat" data-e="' + e.id + '">' + esc(e.nom) + '</span>';
    });
    h += '</div>';
    (C.etats || []).forEach(function (id) {
      var e = COF.RULES.etats.filter(function (x) { return x.id === id; })[0];
      if (e) h += '<div class="note" style="margin-top:8px"><b>' + esc(e.nom) + '</b> — ' + esc(e.effet) + '</div>';
    });
    h += '</div></div>';
    return h;
  }

  /* ---------------- Armes ---------------- */
  function blocArmes() {
    var K = COF.Calc, a = K.attaques(C);
    var h = '<div class="carte"><h2>Armes<span class="h2-action" data-act="arme-ajout">+ Ajouter</span></h2><div class="carte-corps">';
    if (!C.armes.length) {
      h += '<div class="vide">Aucune arme équipée.</div>';
    } else {
      C.armes.forEach(function (w, i) {
        var att = w.type === 'distance' ? a.distance : (w.type === 'magique' ? a.magique : a.contact);
        var dm = w.dm + (w.type === 'contact' && !w.noFor ? '+FOR' : '');
        h += '<div class="ligne">' +
          '<div class="info"><div class="t">' + esc(w.nom) +
            (w.crit && w.crit < 20 ? ' <span class="puce puce-rang">crit ' + w.crit + '-20</span>' : '') + '</div>' +
          '<div class="s">' + esc(dm) + ' DM · att. ' + sgn(att) +
            (w.portee ? ' · ' + w.portee + ' m' : '') + (w.note ? ' · ' + esc(w.note) : '') + '</div></div>' +
          '<div class="actions">' +
          '<button class="btn btn-or btn-sm" data-act="arme-jet" data-i="' + i + '">Attaquer</button>' +
          '<button class="btn btn-sm" data-act="arme-edit" data-i="' + i + '">⋯</button></div></div>';
      });
    }
    h += '</div></div>';
    return h;
  }

  /* ---------------- Sorts ---------------- */
  function blocSorts() {
    var sorts = COF.Calc.sorts(C);
    if (!sorts.length) return '';
    var h = '<div class="carte"><h2>Sorts (' + sorts.length + ')</h2><div class="carte-corps">';
    sorts.forEach(function (x, i) {
      var c = x.cap;
      h += '<div class="ligne"><div class="info">' +
        '<div class="t">' + esc(c.n) + ' ' + pucesCap(c) + '</div>' +
        '<div class="s">' + esc(x.voie.nom) + ' · rang ' + c.r + ' · ' + c.r + ' PM' +
        (c.dmg ? ' · ' + esc(c.dmg) : '') + '</div></div>' +
        '<div class="actions">' +
        '<button class="btn btn-or btn-sm" data-act="sort-lancer" data-v="' + x.voieKey + '" data-r="' + c.r + '">Lancer</button>' +
        '<button class="btn btn-sm" data-act="cap-info" data-v="' + x.voieKey + '" data-r="' + c.r + '">?</button>' +
        '</div></div>';
    });
    h += '</div></div>';
    return h;
  }

  function pucesCap(c) {
    var h = '';
    if (c.s) h += '<span class="puce puce-sort">sort</span>';
    if (c.t === 'bonus') h += '<span class="puce puce-rang">bonus aux DM</span>';
    if (c.t === 'soin') h += '<span class="puce puce-g">soins</span>';
    if (c.a) h += '<span class="puce puce-' + c.a.toLowerCase() + '">' + c.a + '</span>';
    if (c.f) h += '<span class="puce">1×/' + c.f + '</span>';
    return h;
  }

  /* ---------------- Capacités ---------------- */
  function blocCapacites() {
    var caps = COF.Calc.capacites(C).filter(function (x) { return !x.cap.s; });
    var h = '<div class="carte pliable"><h2>Capacités (' + caps.length + ')' +
      '<span class="h2-action" onclick="COF.UI.aller(\'voies\')">Voies</span></h2><div class="carte-corps">';
    if (!caps.length) {
      h += '<div class="vide">Aucune capacité. Rendez-vous dans l\'onglet Voies.</div>';
    } else {
      var parVoie = {};
      caps.forEach(function (x) {
        (parVoie[x.voie.nom] = parVoie[x.voie.nom] || []).push(x);
      });
      Object.keys(parVoie).forEach(function (v) {
        h += '<div style="font-size:11.5px;text-transform:uppercase;letter-spacing:.8px;color:var(--or);margin:10px 0 2px">' + esc(v) + '</div>';
        parVoie[v].forEach(function (x) {
          var c = x.cap;
          h += '<div class="ligne"><div class="info">' +
            '<div class="t">' + c.r + '. ' + esc(c.n) + ' ' + pucesCap(c) + '</div>' +
            '<div class="s">' + esc(c.d.length > 90 ? c.d.slice(0, 90) + '…' : c.d) + '</div></div>' +
            '<div class="actions">' +
            (c.dmg ? '<button class="btn btn-or btn-sm" data-act="cap-attaquer" data-v="' + x.voieKey + '" data-r="' + c.r + '">' +
              (c.t === 'soin' ? 'Soigner' : (c.t === 'bonus' ? '+ DM' : 'Attaquer')) + '</button>' : '') +
            '<button class="btn btn-sm" data-act="cap-info" data-v="' + x.voieKey + '" data-r="' + c.r + '">?</button>' +
            '</div></div>';
        });
      });
    }
    h += '</div></div>';
    return h;
  }

  /* ---------------- Compagnons ---------------- */
  function blocCompagnons() {
    var CC = COF.CompagnonCalc;
    var actifs = C.compagnons || [];
    var dispo = CC.disponibles(C).filter(function (t) {
      return !actifs.some(function (i) { return i.templateId === t.id; });
    });

    var h = '<div class="carte pliable ' + (actifs.length ? '' : 'ferme') + '">' +
      '<h2>Compagnons' + (actifs.length ? ' (' + actifs.length + ')' : '') + '</h2><div class="carte-corps">';

    if (!actifs.length && !dispo.length) {
      h += '<div class="vide">Aucun compagnon. Certaines voies (rôdeur, druide, magicien, forgesort, sorcier, chevalier...) en offrent un.</div>';
    }

    actifs.forEach(function (inst) {
      var tpl = COF.COMPAGNONS[inst.templateId];
      if (!tpl) return;
      var st = CC.stats(tpl, C);
      var pvMax = st.pvMax;
      var pv = (inst.pv === null || inst.pv === undefined) ? pvMax : Math.min(inst.pv, pvMax);
      var pct = pvMax > 0 ? Math.max(0, Math.min(100, (pv / pvMax) * 100)) : 0;

      h += '<div style="border:1px solid var(--line);border-radius:var(--r-s);padding:11px 12px;margin-bottom:10px">';
      h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">' +
        '<input type="text" data-act="comp-nom" data-id="' + inst.id + '" value="' + esc(inst.nom) + '" ' +
        'style="flex:1;background:var(--bg-2);border:1px solid var(--line-2);border-radius:6px;padding:6px 8px;font-size:14px;color:var(--text)">' +
        '<button class="btn btn-sm" data-act="comp-suppr" data-id="' + inst.id + '">✕</button></div>';
      h += '<div class="note" style="margin-bottom:8px">' + esc(tpl.origine) + '</div>';
      h += '<div class="stats" style="margin-bottom:8px">' +
        '<div class="stat"><div class="lbl">Défense</div><div class="v">' + st.def + '</div></div>' +
        '<div class="stat"><div class="lbl">Initiative</div><div class="v">' + st.init + '</div></div>' +
        '<div class="stat"><div class="lbl">Attaque</div><div class="v">' + (st.attaqueMod !== null ? sgn(st.attaqueMod) : '—') + '</div></div>' +
        '</div>';
      h += '<div class="jauge jauge-pv"><div class="jauge-tete"><span class="lbl">Points de vigueur</span>' +
        '<span class="compteur"><button data-act="comp-pv-" data-id="' + inst.id + '">−</button>' +
        '<span class="n">' + pv + ' / ' + pvMax + '</span>' +
        '<button data-act="comp-pv+" data-id="' + inst.id + '">+</button></span></div>' +
        '<div class="barre"><span style="width:' + pct + '%"></span></div></div>';
      h += '<div style="display:flex;gap:8px;margin-top:10px">';
      if (st.attaqueMod !== null) {
        h += '<button class="btn btn-or" style="flex:1" data-act="comp-attaquer" data-id="' + inst.id + '">Attaquer</button>';
      }
      h += '<button class="btn" style="flex:1" data-act="comp-info" data-id="' + inst.id + '">Détails</button>';
      h += '</div></div>';
    });

    if (dispo.length) {
      h += '<div style="font-size:11.5px;text-transform:uppercase;letter-spacing:.8px;color:var(--or);margin:6px 0">Disponibles</div>';
      dispo.forEach(function (t) {
        h += '<div class="ligne"><div class="info"><div class="t">' + esc(t.nom) + '</div>' +
          '<div class="s">' + esc(t.origine) + '</div></div>' +
          '<div class="actions"><button class="btn btn-or btn-sm" data-act="comp-ajouter" data-t="' + t.id + '">+ Ajouter</button></div></div>';
      });
    }
    h += '</div></div>';
    return h;
  }

  /* ---------------- Compétences ---------------- */
  function blocCompetences() {
    var comps = COF.Calc.competences(C);
    if (!comps.length) return '';
    var h = '<div class="carte pliable ferme"><h2>Bonus de compétence (' + comps.length + ')</h2><div class="carte-corps">';
    comps.forEach(function (c, i) {
      h += '<div class="ligne"><div class="info">' +
        '<div class="t">' + esc(c.nom) + '</div>' +
        '<div class="s">' + esc(c.cap) + ' · ' + esc(c.source) + '</div></div>' +
        '<div class="actions"><button class="btn btn-or btn-sm" data-act="comp-jet" data-i="' + i + '">' +
        sgn(c.valeur || 0) + '</button></div></div>';
    });
    h += '<div class="note" style="margin-top:8px">Un bonus de compétence ne s\'ajoute jamais à un test d\'attaque. Une seule source par type (voie de profil +7 max, voie de peuple +3, voie de prestige +5).</div>';
    h += '</div></div>';
    return h;
  }

  /* ---------------- Équipement ---------------- */
  function blocEquipement(pr) {
    var h = '<div class="carte pliable ferme"><h2>Équipement & bourse</h2><div class="carte-corps">';
    h += '<div class="grille2">';
    h += '<div class="champ"><label>Armure</label><select data-act="set-armure">' +
      COF.ARMURES.map(function (a) {
        return '<option value="' + a.id + '"' + (a.id === C.armure ? ' selected' : '') + '>' +
          esc(a.nom) + ' (' + sgn(a.def) + ')</option>';
      }).join('') + '</select></div>';
    h += '<div class="champ"><label>Bouclier</label><select data-act="set-bouclier">' +
      COF.BOUCLIERS.map(function (b) {
        return '<option value="' + b.id + '"' + (b.id === C.bouclier ? ' selected' : '') + '>' +
          esc(b.nom) + ' (' + sgn(b.def) + ')</option>';
      }).join('') + '</select></div>';
    h += '</div>';
    h += '<div class="note" style="margin-bottom:10px">Limite du profil : ' + esc(pr.armuresTexte) + '</div>';

    h += '<div style="font-size:11.5px;text-transform:uppercase;letter-spacing:.8px;color:var(--or);margin-bottom:6px">Bourse</div>';
    h += '<div class="grille2" style="grid-template-columns:1fr 1fr 1fr">' +
      ['po', 'pa', 'pc'].map(function (m) {
        return '<div class="champ"><label>' + m + '</label><input type="number" data-act="bourse" data-m="' + m + '" value="' + (C.bourse[m] || 0) + '"></div>';
      }).join('') + '</div>';

    h += '<div style="font-size:11.5px;text-transform:uppercase;letter-spacing:.8px;color:var(--or);margin:6px 0">Inventaire' +
      '<span class="h2-action" style="float:right" data-act="inv-ajout">+ Objet</span></div>';
    if (!C.inventaire.length) h += '<div class="note">Sac vide. ' + esc(COF.SAC_DEPART) + '</div>';
    C.inventaire.forEach(function (o, i) {
      h += '<div class="ligne"><div class="info"><div class="t">' + esc(o.nom) +
        (o.qte > 1 ? ' ×' + o.qte : '') + '</div>' +
        (o.note ? '<div class="s">' + esc(o.note) + '</div>' : '') + '</div>' +
        '<div class="actions"><button class="btn btn-sm" data-act="inv-suppr" data-i="' + i + '">✕</button></div></div>';
    });
    h += '</div></div>';
    return h;
  }

  /* ---------------- Ajustements ---------------- */
  var AJUST = [
    { k: 'def',  l: 'Défense' },      { k: 'init', l: 'Initiative' },
    { k: 'pv',   l: 'PV max' },       { k: 'pm',   l: 'PM max' },
    { k: 'pc',   l: 'PC max' },       { k: 'dr',   l: 'DR max' },
    { k: 'attC', l: 'Att. contact' }, { k: 'attD', l: 'Att. distance' },
    { k: 'attM', l: 'Att. magique' }, { k: 'dmC',  l: 'DM contact' },
    { k: 'dmD',  l: 'DM distance' }
  ];

  function blocAjustements() {
    /* rappelle les capacités acquises qui modifient une valeur fixe */
    var rappels = COF.Calc.capacites(C).filter(function (x) {
      return /\+\d+ (en DEF|en Initiative|PV|PC|DR|aux DM|en attaque)/.test(x.cap.d);
    });
    var h = '<div class="carte pliable ferme"><h2>Ajustements permanents</h2><div class="carte-corps">';
    h += '<div class="note" style="margin-bottom:10px">Reportez ici les bonus fixes accordés par vos capacités, votre peuple ou vos objets magiques. Ils sont ajoutés automatiquement aux valeurs calculées.</div>';
    h += '<div class="grille2">';
    AJUST.forEach(function (a) {
      h += '<div class="champ"><label>' + a.l + '</label>' +
        '<input type="number" data-act="ajust" data-k="' + a.k + '" value="' + (C.bonus[a.k] || 0) + '"></div>';
    });
    h += '</div>';
    if (rappels.length) {
      h += '<div class="sep"></div><div style="font-size:11.5px;text-transform:uppercase;letter-spacing:.8px;color:var(--or);margin-bottom:6px">Capacités à reporter</div>';
      rappels.forEach(function (x) {
        h += '<div class="note" style="margin-bottom:6px"><b>' + esc(x.cap.n) + '</b> — ' + esc(x.cap.d) + '</div>';
      });
    }
    h += '</div></div>';
    return h;
  }

  /* ---------------- Notes ---------------- */
  function blocNotes() {
    return '<div class="carte pliable ferme"><h2>Notes & personnage</h2><div class="carte-corps">' +
      '<div class="champ"><label>Idéal héroïque</label><input data-act="desc" data-k="ideal" value="' + esc(C.description.ideal) + '"></div>' +
      '<div class="champ"><label>Travers</label><input data-act="desc" data-k="travers" value="' + esc(C.description.travers) + '"></div>' +
      '<div class="champ"><label>Notes de partie</label><textarea data-act="notes">' + esc(C.notes) + '</textarea></div>' +
      '<div style="display:flex;gap:8px"><button class="btn" style="flex:1" data-act="niveau+">Monter d\'un niveau</button>' +
      '<button class="btn" style="flex:1" data-act="niveau-">Baisser d\'un niveau</button></div>' +
      '</div></div>';
  }

  /* ================= ACTIONS ================= */
  function actions(act, node) {
    var K = COF.Calc;
    var i = node.getAttribute('data-i');

    switch (act) {
      case 'edit-carac': editCarac = !editCarac; rendre(); break;
      case 'carac+': C.carac[node.getAttribute('data-c')]++; sauver(); rendre(); break;
      case 'carac-': C.carac[node.getAttribute('data-c')]--; sauver(); rendre(); break;

      case 'test-carac': {
        var c = node.getAttribute('data-c');
        var def = COF.RULES.caracs.filter(function (x) { return x.id === c; })[0];
        COF.UI.jet({
          titre: 'Test de ' + c, sousTitre: def.desc,
          mod: C.carac[c] || 0, difficulte: 15, ctx: K.ctx(C)
        });
        break;
      }

      case 'att': {
        var t = node.getAttribute('data-t');
        var a = K.attaques(C);
        var lbl = { contact: 'Attaque au contact', distance: 'Attaque à distance', magique: 'Attaque magique' }[t];
        COF.UI.jet({
          titre: lbl, sousTitre: 'niveau ' + K.nivAttaque(C) + ' + ' +
            ({ contact: 'FOR', distance: 'AGI', magique: 'VOL' })[t],
          mod: a[t], difficulte: null, ctx: K.ctx(C), type: 'attaque'
        });
        break;
      }

      case 'arme-jet': {
        var w = C.armes[+i], aa = K.attaques(C);
        var att = w.type === 'distance' ? aa.distance : (w.type === 'magique' ? aa.magique : aa.contact);
        var dm = w.dm;
        if (w.type === 'contact' && !w.noFor) dm += '+FOR';
        if (w.type === 'contact' && C.bonus.dmC) dm += '+' + C.bonus.dmC;
        if (w.type === 'distance' && C.bonus.dmD) dm += '+' + C.bonus.dmD;
        COF.UI.jet({
          titre: w.nom, sousTitre: (w.type === 'distance' ? 'Attaque à distance' : 'Attaque au contact') +
            ' · DM ' + dm, mod: att, critMin: w.crit || 20,
          dmg: dm, dmgLabel: 'Dommages', ctx: K.ctx(C), type: 'attaque'
        });
        break;
      }

      case 'arme-ajout': formArme(null); break;
      case 'arme-edit': formArme(+i); break;

      case 'sort-lancer': {
        var x = trouverCap(node.getAttribute('data-v'), +node.getAttribute('data-r'));
        if (!x) break;
        lancerSort(x);
        break;
      }
      case 'cap-attaquer': {
        var x2 = trouverCap(node.getAttribute('data-v'), +node.getAttribute('data-r'));
        if (!x2) break;
        COF.UI.jetCapacite(x2.cap, x2.voie.nom, x2.rang);
        break;
      }
      case 'cap-info': {
        var x3 = trouverCap(node.getAttribute('data-v'), +node.getAttribute('data-r'));
        if (!x3) break;
        COF.UI.ouvrirModale(x3.cap.n,
          '<div class="note" style="margin-bottom:8px">' + esc(x3.voie.nom) + ' · rang ' + x3.cap.r +
          ' ' + pucesCap(x3.cap) + '</div><div>' + esc(x3.cap.d) + '</div>');
        break;
      }

      case 'comp-jet': {
        var comps = K.competences(C), cc = comps[+i];
        COF.UI.jet({
          titre: cc.nom, sousTitre: 'Bonus ' + sgn(cc.valeur) + ' (' + cc.cap + ') — ajoutez la caractéristique',
          mod: cc.valeur, difficulte: 15, ctx: K.ctx(C), caracChoix: C.carac
        });
        break;
      }

      case 'pv+': maj('pv', 1); break;
      case 'pv-': maj('pv', -1); break;
      case 'pm+': maj('pm', 1); break;
      case 'pm-': maj('pm', -1); break;
      case 'pc+': maj('pc', 1); break;
      case 'pc-': maj('pc', -1); break;
      case 'dr+': maj('dr', 1); break;
      case 'dr-': maj('dr', -1); break;

      case 'recup-rapide': recupRapide(); break;
      case 'recup-complete': recupComplete(); break;
      case 'repos': recupComplete(); break;
      case 'pc-depense':
        if (C.pc > 0) { C.pc--; sauver(); rendre(); alert('1 point de chance dépensé : +10 au résultat du test.'); }
        else alert('Plus aucun point de chance.');
        break;

      case 'etat': {
        var e = node.getAttribute('data-e');
        C.etats = C.etats || [];
        var k = C.etats.indexOf(e);
        if (k >= 0) C.etats.splice(k, 1); else C.etats.push(e);
        sauver(); rendre();
        break;
      }

      case 'niveau+': C.niveau++; sauver(); rendre(); break;
      case 'niveau-': if (C.niveau > 1) { C.niveau--; sauver(); rendre(); } break;

      case 'inv-ajout': {
        var nom = prompt('Nom de l\'objet :');
        if (nom) { C.inventaire.push({ nom: nom, qte: 1 }); sauver(); rendre(); }
        break;
      }
      case 'inv-suppr': C.inventaire.splice(+i, 1); sauver(); rendre(); break;

      case 'comp-ajouter': {
        var tid = node.getAttribute('data-t');
        var tpl = COF.COMPAGNONS[tid];
        if (!tpl) break;
        C.compagnons.push({ id: COF.Store.uid(), templateId: tid, nom: tpl.nom, pv: null });
        sauver(); rendre();
        break;
      }
      case 'comp-suppr': {
        if (confirm('Retirer ce compagnon ?')) {
          C.compagnons = C.compagnons.filter(function (x) { return x.id !== node.getAttribute('data-id'); });
          sauver(); rendre();
        }
        break;
      }
      case 'comp-pv+': majCompagnon(node.getAttribute('data-id'), 1); break;
      case 'comp-pv-': majCompagnon(node.getAttribute('data-id'), -1); break;
      case 'comp-attaquer': {
        var inst = trouverCompagnon(node.getAttribute('data-id'));
        if (!inst) break;
        var tpl2 = COF.COMPAGNONS[inst.templateId];
        var stats = COF.CompagnonCalc.stats(tpl2, C);
        COF.UI.jet({
          titre: inst.nom, sousTitre: tpl2.origine,
          mod: stats.attaqueMod, difficulte: null,
          dmg: stats.dmg, dmgLabel: 'Dommages', ctx: K.ctx(C), type: 'attaque'
        });
        break;
      }
      case 'comp-info': {
        var inst2 = trouverCompagnon(node.getAttribute('data-id'));
        if (!inst2) break;
        var tpl3 = COF.COMPAGNONS[inst2.templateId];
        var stats2 = COF.CompagnonCalc.stats(tpl3, C);
        COF.UI.ouvrirModale(inst2.nom,
          '<div class="note" style="margin-bottom:8px">' + esc(tpl3.origine) + '</div>' +
          '<div style="margin-bottom:10px">' + esc(tpl3.desc) + '</div>' +
          '<div class="note">' + esc(tpl3.carac) + '</div>' +
          (tpl3.deplacement ? '<div class="note" style="margin-top:6px">Déplacement : ' + esc(tpl3.deplacement) + '</div>' : '') +
          (tpl3.notes ? '<div class="note" style="margin-top:6px">' + esc(tpl3.notes) + '</div>' : '') +
          '<div class="sep"></div>' +
          '<div class="note">DEF ' + stats2.def + ' · Init. ' + stats2.init +
          (stats2.attaqueMod !== null ? ' · Attaque ' + sgn(stats2.attaqueMod) : '') +
          (stats2.dmg ? ' · DM ' + esc(stats2.dmg) : '') + '</div>');
        break;
      }
    }
  }

  function trouverCompagnon(id) {
    return (C.compagnons || []).filter(function (x) { return x.id === id; })[0];
  }

  function majCompagnon(id, delta) {
    var inst = trouverCompagnon(id);
    if (!inst) return;
    var tpl = COF.COMPAGNONS[inst.templateId];
    var pvMax = COF.CompagnonCalc.stats(tpl, C).pvMax;
    var cur = (inst.pv === null || inst.pv === undefined) ? pvMax : inst.pv;
    inst.pv = Math.max(0, Math.min(pvMax, cur + delta));
    sauver(); rendre();
  }

  /* changements via champs (délégation « change ») */
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (!t.hasAttribute || !t.hasAttribute('data-act')) return;
    if (!t.closest('#vue-fiche')) return;
    var a = t.getAttribute('data-act');
    if (a === 'set-armure') { C.armure = t.value; sauver(); rendre(); }
    else if (a === 'set-bouclier') { C.bouclier = t.value; sauver(); rendre(); }
    else if (a === 'bourse') { C.bourse[t.getAttribute('data-m')] = +t.value; sauver(); }
    else if (a === 'desc') { C.description[t.getAttribute('data-k')] = t.value; sauver(); }
    else if (a === 'notes') { C.notes = t.value; sauver(); }
    else if (a === 'comp-nom') {
      var inst = trouverCompagnon(t.getAttribute('data-id'));
      if (inst) { inst.nom = t.value || inst.nom; sauver(); }
    }
    else if (a === 'ajust') {
      C.bonus[t.getAttribute('data-k')] = parseInt(t.value, 10) || 0;
      sauver();
      var ouv = COF.UI.$$('#vue-fiche-corps .pliable').map(function (n) { return n.classList.contains('ferme'); });
      rendre();
      COF.UI.$$('#vue-fiche-corps .pliable').forEach(function (n, i) { n.classList.toggle('ferme', !!ouv[i]); });
    }
  });

  function maj(champ, delta) {
    var K = COF.Calc;
    var max = { pv: K.pvMax(C), pm: K.pmMax(C), pc: K.pcMax(C), dr: K.drMax(C) }[champ];
    C[champ] = Math.max(0, Math.min(max, (C[champ] || 0) + delta));
    sauver(); rendre();
  }

  function trouverCap(voieKey, rang) {
    return COF.Calc.capacites(C).filter(function (x) {
      return x.voieKey === voieKey && x.cap.r === rang;
    })[0];
  }

  /* Le coût en PM n'est débité qu'au moment où le joueur confirme le
     lancement (bouton « Lancer le sort »), jamais en ouvrant la fenêtre. */
  function lancerSort(x) {
    var K = COF.Calc, c = x.cap;
    var peutConcentration = c.a === 'A';   // seule une action d'attaque peut devenir une action limitée
    var etat = { concentration: false };

    function coutActuel() {
      return (peutConcentration && etat.concentration) ? Math.max(0, c.r - 2) : c.r;
    }

    function contenu() {
      var cout = coutActuel();
      var manque = C.pm < cout;
      var h = '<div class="note" style="margin-bottom:8px">' + esc(x.voie.nom) + ' · rang ' + c.r + '</div>';
      h += '<div style="margin-bottom:12px">' + esc(c.d) + '</div>';
      if (peutConcentration) {
        h += '<div class="chip' + (etat.concentration ? ' on' : '') + '" id="sort-concentration" style="display:inline-block;margin-bottom:12px;cursor:pointer">' +
          'Concentration : devient une action limitée, coût −2 PM</div>';
      }
      h += '<div class="stats" style="margin-bottom:12px">' +
        '<div class="stat"><div class="lbl">Coût</div><div class="v">' + cout + ' PM</div></div>' +
        '<div class="stat"><div class="lbl">Action</div><div class="v" style="font-size:15px">' +
          (peutConcentration && etat.concentration ? 'L' : (c.a || '—')) + '</div></div>' +
        '<div class="stat"><div class="lbl">PM dispo.</div><div class="v" style="' +
          (manque ? 'color:var(--sang-clair)' : '') + '">' + C.pm + ' / ' + K.pmMax(C) + '</div></div>' +
        '</div>';
      if (manque) h += '<div class="note" style="color:var(--sang-clair);margin-bottom:12px">' +
        'Pas assez de mana : il manque ' + (cout - C.pm) + ' PM. La brûlure de mana sera proposée au lancement (' +
        (cout - C.pm) + 'd' + K.drType(C) + ' PV sacrifiés).</div>';
      h += '<button class="btn btn-plein btn-bloc" id="sort-go">Lancer le sort</button>';
      return h;
    }

    function ouvrir() {
      COF.UI.ouvrirModale(c.n, contenu(), function (root) {
        var chip = COF.UI.$('#sort-concentration', root);
        if (chip) chip.addEventListener('click', function () {
          etat.concentration = !etat.concentration;
          ouvrir();
        });
        COF.UI.$('#sort-go', root).addEventListener('click', function () {
          confirmerEtLancer();
        });
      });
    }

    function confirmerEtLancer() {
      var cout = coutActuel();
      if (C.pm < cout) {
        var manquant = cout - C.pm;
        if (!confirm('Il manque ' + manquant + ' point(s) de mana.\nUtiliser la brûlure de mana ? (' +
          manquant + 'd' + K.drType(C) + ' PV sacrifiés)')) return;
        var perte = COF.Dice.dommages(manquant + 'd' + K.drType(C), K.ctx(C), {});
        C.pv = Math.max(0, C.pv - perte.total);
        C.pm = 0;
        alert('Brûlure de mana : ' + perte.total + ' PV sacrifiés.');
      } else {
        C.pm -= cout;
      }
      sauver();

      var a = K.attaques(C);
      var sous = x.voie.nom + ' · rang ' + c.r + ' · ' + cout + ' PM dépensés (reste ' + C.pm + ')' +
        (peutConcentration && etat.concentration ? ' · concentration' : '') +
        (c.d ? ' — ' + c.d.slice(0, 120) : '');

      if (c.t === 'soin') {
        COF.UI.jet({
          titre: c.n, sousTitre: sous,
          dmg: c.dmg, dmgLabel: 'Soins', sansD20: true,
          ctx: K.ctx(C, x.rang), type: 'soins'
        });
      } else if (c.t === 'bonus') {
        /* le sort ajoute ses DM à ceux d'une arme (arme élémentaire, tempête de mana…) */
        var choix = (C.armes || []).map(function (w) {
          var mod = w.type === 'distance' ? a.distance : (w.type === 'magique' ? a.magique : a.contact);
          return { label: w.nom, dmg: COF.UI.dmgArme(C, w) + '+' + c.dmg, mod: mod, type: w.type };
        });
        choix.push({ label: 'Bonus seul', dmg: c.dmg, mod: a.magique });
        COF.UI.jet({
          titre: c.n, sousTitre: sous,
          attaqueTypes: [
            { id: 'contact', label: 'Contact', mod: a.contact },
            { id: 'distance', label: 'Distance', mod: a.distance },
            { id: 'magique', label: 'Magique', mod: a.magique }
          ],
          attaqueDefaut: choix[0].type === 'distance' ? 'distance' : 'contact',
          armeChoix: choix, mod: choix[0].mod,
          dmg: choix[0].dmg, dmgLabel: 'Dommages',
          ctx: K.ctx(C, x.rang), type: 'attaque'
        });
      } else {
        COF.UI.jet({
          titre: c.n, sousTitre: sous,
          mod: a.magique, difficulte: null,
          dmg: c.dmg || null, dmgLabel: 'Dommages',
          ctx: K.ctx(C, x.rang), type: 'attaque'
        });
      }
      rendre();
    }

    ouvrir();
  }

  function recupRapide() {
    var K = COF.Calc;
    if (C.dr <= 0) { alert('Aucun dé de récupération disponible.'); return; }
    C.dr--;
    var r = COF.Dice.dommages('1d' + K.drType(C), K.ctx(C), {});
    var gain = r.total + Math.floor((C.niveau || 1) / 2);
    C.pv = Math.min(K.pvMax(C), C.pv + gain);
    sauver(); rendre();
    COF.UI.ouvrirModale('Récupération rapide (30 min)',
      '<div class="resultat"><div class="grand">+' + gain + '</div>' +
      '<div class="detail">1d' + K.drType(C) + ' (' + r.total + ') + ½ niveau (' + Math.floor(C.niveau / 2) + ')</div>' +
      '<div class="verdict ok">' + C.pv + ' / ' + K.pvMax(C) + ' PV · ' + C.dr + ' DR restants</div></div>' +
      '<div class="note">Les capacités « 1×/combat » sont de nouveau disponibles.</div>');
  }

  function recupComplete() {
    var K = COF.Calc;
    C.dr = Math.min(K.drMax(C), C.dr + 1);
    C.pm = K.pmMax(C);
    C.dmTemp = 0;
    C.etats = [];
    sauver(); rendre();
    COF.UI.ouvrirModale('Récupération complète (8 h)',
      '<div class="note">+1 dé de récupération (' + C.dr + '/' + K.drMax(C) + ')<br>' +
      'Points de mana entièrement restaurés (' + C.pm + ')<br>' +
      'DM temporaires et états préjudiciables effacés.</div>' +
      '<div class="sep"></div>' +
      '<button class="btn btn-or btn-bloc" onclick="COF.UI.Fiche.utiliserDR()">Dépenser 1 DR pour récupérer des PV</button>');
  }

  function utiliserDR() { COF.UI.fermerModale(); recupRapide(); }

  /* ---------------- Formulaire d'arme ---------------- */
  function formArme(idx) {
    var w = idx === null ? { nom: '', type: 'contact', dm: '1d6', portee: null, crit: 20, note: '' } : C.armes[idx];
    var catalogue = COF.ARMES_CONTACT.map(function (a) {
      return '<option value="c:' + a.id + '">' + esc(a.nom) + ' — ' + a.dm + '</option>';
    }).join('') + COF.ARMES_DISTANCE.map(function (a) {
      return '<option value="d:' + a.id + '">' + esc(a.nom) + ' — ' + a.dm + ' (' + a.portee + ' m)</option>';
    }).join('');

    var h = '<div class="champ"><label>Choisir dans le catalogue</label><select id="w-cat">' +
      '<option value="">— arme personnalisée —</option>' + catalogue + '</select></div>' +
      '<div class="champ"><label>Nom</label><input id="w-nom" value="' + esc(w.nom) + '"></div>' +
      '<div class="grille2">' +
      '<div class="champ"><label>Type</label><select id="w-type">' +
      ['contact', 'distance', 'magique'].map(function (t) {
        return '<option value="' + t + '"' + (t === w.type ? ' selected' : '') + '>' + t + '</option>';
      }).join('') + '</select></div>' +
      '<div class="champ"><label>Dommages</label><input id="w-dm" value="' + esc(w.dm) + '"></div>' +
      '</div><div class="grille2">' +
      '<div class="champ"><label>Portée (m)</label><input id="w-portee" type="number" value="' + (w.portee || '') + '"></div>' +
      '<div class="champ"><label>Critique sur</label><input id="w-crit" type="number" value="' + (w.crit || 20) + '"></div>' +
      '</div>' +
      '<div class="champ"><label>Note</label><input id="w-note" value="' + esc(w.note || '') + '"></div>' +
      '<button class="btn btn-plein btn-bloc" id="w-ok">Enregistrer</button>' +
      (idx !== null ? '<button class="btn btn-sang btn-bloc" id="w-del" style="margin-top:8px">Supprimer</button>' : '');

    COF.UI.ouvrirModale(idx === null ? 'Ajouter une arme' : 'Modifier l\'arme', h, function (root) {
      COF.UI.$('#w-cat', root).addEventListener('change', function () {
        var v = this.value; if (!v) return;
        var parts = v.split(':');
        var src = (parts[0] === 'c' ? COF.ARMES_CONTACT : COF.ARMES_DISTANCE)
          .filter(function (a) { return a.id === parts[1]; })[0];
        if (!src) return;
        COF.UI.$('#w-nom', root).value = src.nom;
        COF.UI.$('#w-type', root).value = parts[0] === 'c' ? 'contact' : 'distance';
        COF.UI.$('#w-dm', root).value = src.dm;
        COF.UI.$('#w-portee', root).value = src.portee || '';
        COF.UI.$('#w-crit', root).value = src.crit || 20;
        COF.UI.$('#w-note', root).value = src.note || '';
      });
      COF.UI.$('#w-ok', root).addEventListener('click', function () {
        var nw = {
          nom: COF.UI.$('#w-nom', root).value || 'Arme',
          type: COF.UI.$('#w-type', root).value,
          dm: COF.UI.$('#w-dm', root).value || '1d6',
          portee: parseInt(COF.UI.$('#w-portee', root).value, 10) || null,
          crit: parseInt(COF.UI.$('#w-crit', root).value, 10) || 20,
          note: COF.UI.$('#w-note', root).value
        };
        if (idx === null) C.armes.push(nw); else C.armes[idx] = nw;
        sauver(); COF.UI.fermerModale(); rendre();
      });
      var d = COF.UI.$('#w-del', root);
      if (d) d.addEventListener('click', function () {
        C.armes.splice(idx, 1); sauver(); COF.UI.fermerModale(); rendre();
      });
    });
  }

  return { init: init, rendre: rendre, utiliserDR: utiliserDR };
})();
