/* ============================================================
   COF2 Compagnon — Montée de niveau guidée
   Assistant en 3 étapes, ouvert depuis la fiche (« Monter de niveau »)
   ou à la fin d'une aventure :
     1. Ce qui change (niveau, PV, points de capacité, rangs débloqués)
     2. Choix des nouveaux rangs de voie (coût, niveau requis, capacité
        expliquée, rangs conseillés)
     3. Récapitulatif, puis validation (appliqué à la fiche)
   Règles COF2 : 2 points de capacité par niveau ; rang 1 et 2 : 1 point,
   rang 3 et plus : 2 points ; niveau requis par rang (rules.js) ; voies
   d'historique et d'artisan : 1 point par rang.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Niveau = (function () {
  var esc = COF.UI.esc, sgn = COF.UI.sgn;
  var s = null, rootN = null;

  function K() { return COF.Calc; }
  /* Voies où le héros peut progresser : celles qu'il a + celles de son profil. */
  function voiesPossibles(p) {
    var keys = (p.voies || []).map(function (v) { return v.key; });
    var pr = K().profil(p);
    if (pr) pr.voies.forEach(function (v) { var k = 'profil.' + v.id; if (keys.indexOf(k) < 0) keys.push(k); });
    return keys.filter(function (k) { return K().voieDef(p, k); });
  }
  function rangPlan(p, key) { return s.plan[key] !== undefined ? s.plan[key] : K().rangDe(p, key); }
  /* Points restants calculés exactement comme la fiche (rangs 1 offerts compris),
     sur une copie du héros à laquelle on applique le plan. */
  function avecPlan(p, plan) {
    var q = JSON.parse(JSON.stringify(p));
    Object.keys(plan).forEach(function (k) {
      var v = q.voies.filter(function (x) { return x.key === k; })[0];
      if (!v) { v = { key: k, rang: 0 }; q.voies.push(v); }
      v.rang = plan[k];
    });
    return q;
  }
  function reste(p, plan) { return K().pointsCapacite(avecPlan(p, plan || s.plan)).reste; }
  /* Rang suivant possible dans une voie (ou null), avec son coût réel. */
  function suivant(p, key) {
    var def = K().voieDef(p, key), r = rangPlan(p, key) + 1;
    var base = K().rangsDe(def)[0]; if (r < base) r = base;
    var cap = def.caps.filter(function (c) { return c.r === r; })[0];
    if (!cap) return null;
    var essai = Object.assign({}, s.plan); essai[key] = r;
    var c = reste(p) - reste(p, essai);
    return { r: r, cap: cap, cout: c, possible: reste(p, essai) >= 0, niveauOk: K().peutAcquerir(p, key, r) };
  }
  /* Conseil : poursuivre la voie la plus avancée, ou ouvrir une voie du profil au rang 1. */
  function conseil(p, key) {
    var r = K().rangDe(p, key);
    var max = Math.max.apply(null, (p.voies || []).filter(function (v) { return v.key.indexOf('profil.') === 0; }).map(function (v) { return v.rang; }).concat([0]));
    return (r > 0 && r === max) || (r === 0 && key.indexOf('profil.') === 0 && (p.voies || []).filter(function (v) { return v.key.indexOf('profil.') === 0; }).length < 3);
  }

  function etape1(p) {
    var pc = K().pointsCapacite(p), deb = [];
    voiesPossibles(p).forEach(function (k) {
      var def = K().voieDef(p, k);
      def.caps.forEach(function (c) { if (K().niveauRequis(k, c.r) === p.niveau && c.r > K().rangDe(p, k)) deb.push(def.nom + ' — rang ' + c.r + ' (' + c.n + ')'); });
    });
    return '<div class="resultat crit"><div class="grand">⬆️ ' + p.niveau + '</div><div class="verdict ok" style="font-size:18px">' + esc(p.nom) + ' est niveau ' + p.niveau + '</div></div>' +
      '<div class="cn-changes" style="margin-top:10px">' +
      '<div>❤️ PV maximum : <b>' + K().pvMax(p) + '</b>' + (s.pvGain ? ' (+' + s.pvGain + ')' : '') + '</div>' +
      '<div>📜 Points de capacité à dépenser : <b>' + Math.max(0, pc.reste) + '</b>' + (function () {
        var pris = (p.voies || []).filter(function (v) { var d = K().voieDef(p, v.key); return d && !K().estHistorique(v.key) && v.rang >= 1 && K().rangsDe(d)[0] === 1; }).length;
        var off = Math.max(0, 3 - pris);
        return off ? ' + ' + off + ' rang' + (off > 1 ? 's' : '') + ' 1 offert' + (off > 1 ? 's' : '') + ' (création)' : '';
      })() + '</div>' +
      '<div>🎯 Attaques, DEF et initiative : recalculées d’elles-mêmes sur la fiche.</div></div>' +
      (deb.length ? '<label class="cw-lbl">Nouveautés débloquées à ce niveau</label><div class="cw-traits">' + deb.slice(0, 8).map(esc).join('<br>') + '</div>' : '') +
      '<p class="cw-intro" style="margin-top:10px">Chaque niveau donne <b>2 points</b>. Un rang 1 ou 2 coûte 1 point ; un rang 3 et plus coûte 2 points, et demande un niveau minimum. Vous pouvez aussi garder des points pour plus tard.</p>';
  }
  function etape2(p) {
    var h = '<p class="cw-intro">Touchez un rang pour l’ajouter (re-touchez pour l’annuler). Il reste <b>' + reste(p) + ' point(s)</b>. ★ = conseillé pour ' + esc(p.nom) + '.</p>';
    voiesPossibles(p).forEach(function (k) {
      var def = K().voieDef(p, k), r0 = K().rangDe(p, k), rp = rangPlan(p, k), sv = suivant(p, k);
      h += '<div class="nv-voie"><div class="nv-t"><b>' + esc(def.nom) + '</b><span>rang ' + r0 + (rp > r0 ? ' → <b>' + rp + '</b>' : '') + '</span></div>';
      for (var r = r0 + 1; r <= rp; r++) {
        var cp = def.caps.filter(function (c) { return c.r === r; })[0] || {};
        h += '<button class="nv-rang on" data-n="annuler" data-k="' + esc(k) + '" data-r="' + r + '"><b>✓ Rang ' + r + ' — ' + esc(cp.n || '') + '</b><small>' + esc(cp.d || '') + '</small></button>';
      }
      if (sv) {
        var ok = sv.niveauOk && sv.possible;
        h += '<button class="nv-rang' + (ok ? '' : ' ko') + '" data-n="ajouter" data-k="' + esc(k) + '"' + (ok ? '' : ' disabled') + '>' +
          '<b>＋ Rang ' + sv.r + ' — ' + esc(sv.cap.n) + (conseil(p, k) && ok ? ' <span class="cw-badge">★</span>' : '') + '</b>' +
          '<small>' + esc(sv.cap.d || '') + '</small>' +
          '<em>' + (sv.cout <= 0 ? 'offert (rang 1 gratuit)' : sv.cout + ' point' + (sv.cout > 1 ? 's' : '')) + (sv.niveauOk ? '' : ' · niveau ' + K().niveauRequis(k, sv.r) + ' requis') +
          (sv.cap.choix || sv.cap.choixCarac ? ' · choix à faire ensuite sur l’écran Voies' : '') + '</em></button>';
      }
      h += '</div>';
    });
    return h;
  }
  function etape3(p) {
    var l = [];
    Object.keys(s.plan).forEach(function (k) {
      var def = K().voieDef(p, k);
      for (var r = K().rangDe(p, k) + 1; r <= s.plan[k]; r++) { var c = def.caps.filter(function (x) { return x.r === r; })[0] || {}; l.push('📜 ' + def.nom + ' — rang ' + r + ' : ' + c.n); }
    });
    return '<div class="cw-recap"><div class="cw-recap-t">' + esc(p.nom) + ', niveau ' + p.niveau + '</div>' +
      '<div class="cw-ligne">' + (l.length ? l.map(esc).join('<br>') : 'Aucun nouveau rang : les points sont gardés pour plus tard.') + '</div>' +
      '<div class="cw-ligne" style="margin-top:8px">Points restants après validation : <b>' + reste(p) + '</b></div></div>' +
      '<p class="cw-intro" style="margin-top:8px">Vous pourrez toujours ajuster vos voies sur l’écran Voies.</p>';
  }
  var ETAPES = [['📈', 'Ce qui change'], ['📜', 'Nouveaux rangs'], ['✅', 'Récapitulatif']];
  function rendre() {
    if (!rootN || !s) return;
    var p = COF.Store.get(s.pid); if (!p) return;
    var c = rootN.querySelector('#nv'); if (!c) return;
    var corps = [etape1, etape2, etape3][s.etape](p);
    c.innerHTML = '<div class="cw-etapes">' + ETAPES.map(function (e, i) {
      return '<button class="' + (i === s.etape ? 'on' : (i < s.etape ? 'fait' : '')) + '" data-n="aller" data-r="' + i + '"' + (i > s.etape ? ' disabled' : '') + '><span>' + e[0] + '</span><small>' + e[1] + '</small></button>';
    }).join('') + '</div><div class="cw-corps">' + corps + '</div>' +
      '<div class="cw-nav">' + (s.etape > 0 ? '<button class="btn" data-n="prec">◀ Retour</button>' : '<button class="btn" data-n="plustard">Plus tard</button>') +
      (s.etape < 2 ? '<button class="btn btn-plein" data-n="suiv">Suivant ▶</button>' : '<button class="btn btn-plein" data-n="valider">✅ Valider</button>') + '</div>';
  }
  function action(a, node) {
    var p = COF.Store.get(s.pid); if (!p) return;
    var k = node.getAttribute('data-k');
    if (a === 'ajouter') { var sv = suivant(p, k); if (sv && sv.niveauOk && sv.possible) s.plan[k] = sv.r; }
    else if (a === 'annuler') { var r = +node.getAttribute('data-r'); s.plan[k] = r - 1; if (s.plan[k] <= K().rangDe(p, k)) delete s.plan[k]; }
    else if (a === 'aller') s.etape = Math.min(+node.getAttribute('data-r'), s.etape);
    else if (a === 'prec') s.etape = Math.max(0, s.etape - 1);
    else if (a === 'suiv') s.etape = Math.min(2, s.etape + 1);
    else if (a === 'plustard') { COF.UI.fermerModale(); s = null; return; }
    else if (a === 'valider') {
      Object.keys(s.plan).forEach(function (key) {
        var v = (p.voies || []).filter(function (x) { return x.key === key; })[0];
        if (!v) { v = { key: key, rang: 0 }; p.voies.push(v); }
        v.rang = s.plan[key];
      });
      COF.Store.sauver(p);
      var fin = s.fin; s = null;
      COF.UI.fermerModale();
      if (fin) fin(p);
      return;
    }
    rendre();
  }
  /* opts : { monter (true = passer d'abord le niveau), pvGain, fin(p) } */
  function ouvrir(p, opts) {
    opts = opts || {};
    if (!p) return;
    var gain = opts.pvGain || 0;
    if (opts.monter) {
      if ((p.niveau || 1) >= 20) return;
      var av = K().pvMax(p); p.niveau = (p.niveau || 1) + 1;
      gain = Math.max(0, K().pvMax(p) - av); if (p.pv !== null && p.pv !== undefined) p.pv += gain;
      COF.Store.sauver(p);
    }
    s = { pid: p.id, etape: 0, plan: {}, pvGain: gain, fin: opts.fin || null };
    COF.UI.ouvrirModale('⬆️ Montée de niveau', '<div id="nv" class="cw"></div>', function (root) {
      rootN = root;
      root.querySelector('#nv').addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('[data-n]');
        if (!b || b.disabled || !s) return;
        action(b.getAttribute('data-n'), b);
      });
      rendre();
    });
  }
  return { ouvrir: ouvrir };
})();
