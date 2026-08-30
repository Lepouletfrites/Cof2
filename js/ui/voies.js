/* ============================================================
   COF2 Compagnon — Onglet « Voies » : acquisition des capacités
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Voies = (function () {
  var $ = COF.UI.$, $$ = COF.UI.$$, esc = COF.UI.esc, sgn = COF.UI.sgn;
  var C = null;

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-vact]') : null;
      if (!t || !t.closest('#vue-voies')) return;
      actions(t.getAttribute('data-vact'), t);
    });
  }

  function sauver() { COF.Store.sauver(C); }

  function rendre() {
    C = COF.Store.actif();
    var n = $('#vue-voies');
    if (!C) {
      n.innerHTML = '<div class="vide">Aucun personnage sélectionné.</div>';
      return;
    }
    var pr = COF.PROFILS[C.profil];
    var pc = COF.Calc.pointsCapacite(C);

    var h = '';
    h += '<div class="carte"><div class="carte-corps">' +
      '<div class="stats">' +
      '<div class="stat"><div class="lbl">Niveau</div><div class="v">' + C.niveau + '</div></div>' +
      '<div class="stat"><div class="lbl">Pts capacité</div><div class="v" style="color:' +
        (pc.reste < 0 ? 'var(--sang-clair)' : 'var(--or-clair)') + '">' + pc.reste + '</div></div>' +
      '<div class="stat"><div class="lbl">Voies</div><div class="v">' + (C.voies || []).length + '</div></div>' +
      '</div>' +
      '<div class="note" style="margin-top:8px">Rang 1-2 : 1 point · rang 3+ : 2 points. ' +
      'Niveau requis — rang 2 : 2, rang 3 : 3, rang 4 : 5, rang 5 : 7. ' +
      'Au niveau 1 : deux voies de profil + la voie de peuple, chacune au rang 1 (gratuit).</div>' +
      '</div></div>';

    /* Voie de peuple */
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
    if (COF.PROFILS[C.profil].famille === 'mage') {
      h += '<div class="note" style="margin:10px 0 6px;color:var(--or)">Option des mages : remplacer la voie de peuple par la voie du mage.</div>';
      h += voieHTML(COF.VOIE_MAGE, 'mage');
    }
    h += '</div></div>';

    /* Voies de profil */
    h += '<div class="carte"><h2>Voies de ' + esc(pr.nom) + '</h2><div class="carte-corps">';
    pr.voies.forEach(function (v) { h += voieHTML(v, 'profil.' + v.id); });
    h += '</div></div>';

    n.innerHTML = h;

    $$('.voie-tete', n).forEach(function (t) {
      t.addEventListener('click', function (e) {
        if (e.target.hasAttribute('data-vact')) return;
        t.parentNode.classList.toggle('ouvert');
      });
    });
  }

  function voieHTML(voie, key) {
    var rang = COF.Calc.rangDe(C, key);
    var h = '<div class="voie' + (rang > 0 ? ' ouvert' : '') + '">';
    h += '<div class="voie-tete"><span class="nom">' + esc(voie.nom) + '</span>' +
      '<span class="rangs">';
    for (var i = 1; i <= 5; i++) h += '<span class="pastille ' + (i <= rang ? 'on' : '') + '"></span>';
    h += '</span></div><div class="voie-corps">';
    if (voie.note) h += '<div class="note" style="margin:6px 0">' + esc(voie.note) + '</div>';

    voie.caps.forEach(function (c) {
      var acquise = c.r <= rang;
      var suivant = c.r === rang + 1;
      var nivOK = (C.niveau || 1) >= (COF.RULES.rangNiveau[c.r] || 99);
      var cls = acquise ? 'acquise' : (suivant && nivOK ? '' : 'verrou');
      h += '<div class="cap ' + cls + '">' +
        '<div class="cap-tete"><div class="cap-num">' + c.r + '</div>' +
        '<div class="cap-nom">' + esc(c.n) + ' ' + puces(c) + '</div></div>' +
        '<div class="cap-desc">' + esc(c.d) + '</div>';
      h += '<div class="cap-actions">';
      if (acquise && c.r === rang) {
        h += '<button class="btn btn-sm" data-vact="retirer" data-k="' + key + '">Retirer ce rang</button>';
      } else if (suivant) {
        if (nivOK) h += '<button class="btn btn-or btn-sm" data-vact="acquerir" data-k="' + key + '">Acquérir (' +
          (COF.RULES.rangCout[c.r] || 2) + ' pt' + ((COF.RULES.rangCout[c.r] || 2) > 1 ? 's' : '') + ')</button>';
        else h += '<span class="note">Niveau ' + COF.RULES.rangNiveau[c.r] + ' requis</span>';
      }
      if (c.dmg && acquise) h += '<button class="btn btn-sm" data-vact="dmg" data-k="' + key + '" data-r="' + c.r + '">🎲 ' + esc(c.dmg) + '</button>';
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

  function actions(act, node) {
    var key = node.getAttribute('data-k');
    var v = (C.voies || []).filter(function (x) { return x.key === key; })[0];

    if (act === 'acquerir') {
      if (!v) { v = { key: key, rang: 0 }; C.voies.push(v); }
      v.rang++;
      sauver(); rendre();
    } else if (act === 'retirer') {
      if (v) {
        v.rang--;
        if (v.rang <= 0) C.voies = C.voies.filter(function (x) { return x.key !== key; });
      }
      sauver(); rendre();
    } else if (act === 'dmg') {
      var def = COF.Calc.voieDef(C, key);
      var cap = def.caps.filter(function (x) { return x.r === +node.getAttribute('data-r'); })[0];
      COF.UI.jet({
        titre: cap.n, sousTitre: def.nom + ' · rang ' + cap.r,
        dmg: cap.dmg, sansD20: true, ctx: COF.Calc.ctx(C, v ? v.rang : cap.r)
      });
    }
  }

  return { init: init, rendre: rendre };
})();
