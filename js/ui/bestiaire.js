/* ============================================================
   COF2 Compagnon — Onglet « Bestiaire »
   Filtres par NC, environnement et catégorie, recherche,
   fiches complètes avec jets d'attaque intégrés.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Bestiaire = (function () {
  var $ = COF.UI.$, $$ = COF.UI.$$, esc = COF.UI.esc, sgn = COF.UI.sgn;

  /* état des filtres — exposé pour le futur générateur de rencontres */
  var F = { q: '', env: null, cat: null, ncMin: 0, ncMax: 13 };

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-bact]') : null;
      /* les fiches s'ouvrent dans la modale, qui vit hors de la vue */
      if (!t || !(t.closest('#vue-bestiaire') || t.closest('#modale'))) return;
      actions(t.getAttribute('data-bact'), t);
    });
  }

  /* ---------- Sélection filtrée (réutilisable) ---------- */
  function filtrer(f) {
    f = f || F;
    var q = (f.q || '').toLowerCase().trim();
    return COF.BESTIAIRE.filter(function (c) {
      if (f.cat && c.cat !== f.cat) return false;
      if (f.env && c.env.indexOf(f.env) < 0) return false;
      if (c.nc < f.ncMin || c.nc > f.ncMax) return false;
      if (q) {
        var hay = (c.nom + ' ' + (c.groupe || '') + ' ' + (c.desc || '') + ' ' + (c.type || '')).toLowerCase();
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    }).sort(function (a, b) { return a.nc - b.nc || a.nom.localeCompare(b.nom); });
  }
  COF.UI.Bestiaire_filtrer = filtrer;

  function get(id) {
    return COF.BESTIAIRE.filter(function (c) { return c.id === id; })[0];
  }

  /* ---------- Rendu ---------- */
  function rendre() {
    var n = $('#vue-bestiaire');
    var liste = filtrer();

    var h = '';

    /* Recherche */
    h += '<div class="carte"><div class="carte-corps">';
    h += '<div class="champ" style="margin-bottom:10px"><input id="best-q" placeholder="Rechercher une créature…" value="' + esc(F.q) + '"></div>';

    /* Environnements */
    h += '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:var(--text-mute);margin-bottom:5px">Environnement</div>';
    h += '<div class="chips" style="margin-bottom:10px">';
    h += '<span class="chip ' + (F.env === null ? 'on' : '') + '" data-bact="env" data-v="">Tous</span>';
    COF.ENVIRONNEMENTS.forEach(function (e) {
      h += '<span class="chip ' + (F.env === e.id ? 'on' : '') + '" data-bact="env" data-v="' + e.id + '">' +
        e.ic + ' ' + esc(e.nom) + '</span>';
    });
    h += '</div>';

    /* Catégories */
    h += '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:var(--text-mute);margin-bottom:5px">Catégorie</div>';
    h += '<div class="chips" style="margin-bottom:12px">';
    h += '<span class="chip ' + (F.cat === null ? 'on' : '') + '" data-bact="cat" data-v="">Toutes</span>';
    COF.CAT_CREATURES.forEach(function (c) {
      h += '<span class="chip ' + (F.cat === c.id ? 'on' : '') + '" data-bact="cat" data-v="' + c.id + '">' + esc(c.nom) + '</span>';
    });
    h += '</div>';

    /* NC */
    h += '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:var(--text-mute);margin-bottom:5px">' +
      'Niveau de créature — ' + ncTxt(F.ncMin) + ' à ' + ncTxt(F.ncMax) + '</div>';
    h += '<div class="mod-ligne" style="margin-bottom:6px">' +
      '<label>NC min</label><input type="number" id="best-ncmin" value="' + F.ncMin + '" min="0" max="13" step="1">' +
      '<label style="margin-left:auto">NC max</label><input type="number" id="best-ncmax" value="' + F.ncMax + '" min="0" max="13" step="1">' +
      '</div>';
    h += '<button class="btn btn-bloc btn-sm" data-bact="reset">Réinitialiser les filtres</button>';
    h += '</div></div>';

    /* Résultats */
    h += '<div class="carte"><h2>' + liste.length + ' créature' + (liste.length > 1 ? 's' : '') + '</h2><div class="carte-corps">';
    if (!liste.length) {
      h += '<div class="vide">Aucune créature ne correspond à ces filtres.</div>';
    } else {
      liste.forEach(function (c) {
        h += '<div class="ligne" data-bact="fiche" data-id="' + c.id + '" style="cursor:pointer">' +
          '<div class="pj-av" style="width:36px;height:36px;font-size:13px;border-color:var(--line-2)">' +
            ncTxt(c.nc) + '</div>' +
          '<div class="info"><div class="t">' + esc(c.nom) + '</div>' +
          '<div class="s">' + (c.taille || '') + (c.type ? ' · ' + esc(c.type) : '') +
          ' · DEF ' + c.def + ' · ' + c.pv + ' PV' +
          '<br>' + c.env.map(icEnv).join(' ') + '</div></div>' +
          '<div class="actions"><button class="btn btn-or btn-sm" data-bact="fiche" data-id="' + c.id + '">Fiche</button></div>' +
          '</div>';
      });
    }
    h += '</div></div>';

    n.innerHTML = h;

    /* écouteurs des champs */
    var q = $('#best-q', n);
    q.addEventListener('input', function () {
      F.q = q.value;
      majListeSeulement();
    });
    ['best-ncmin', 'best-ncmax'].forEach(function (id) {
      var el = $('#' + id, n);
      el.addEventListener('change', function () {
        var v = parseInt(el.value, 10);
        if (isNaN(v)) v = (id === 'best-ncmin' ? 0 : 13);
        if (id === 'best-ncmin') F.ncMin = v; else F.ncMax = v;
        rendre();
      });
    });
  }

  /* Rafraîchit uniquement la liste (préserve le focus du champ de recherche) */
  function majListeSeulement() {
    var liste = filtrer();
    var carte = $$('#vue-bestiaire .carte')[1];
    if (!carte) { rendre(); return; }
    carte.querySelector('h2').textContent = liste.length + ' créature' + (liste.length > 1 ? 's' : '');
    var corps = carte.querySelector('.carte-corps');
    if (!liste.length) { corps.innerHTML = '<div class="vide">Aucune créature ne correspond à ces filtres.</div>'; return; }
    corps.innerHTML = liste.map(function (c) {
      return '<div class="ligne" data-bact="fiche" data-id="' + c.id + '" style="cursor:pointer">' +
        '<div class="pj-av" style="width:36px;height:36px;font-size:13px;border-color:var(--line-2)">' + ncTxt(c.nc) + '</div>' +
        '<div class="info"><div class="t">' + esc(c.nom) + '</div>' +
        '<div class="s">' + (c.taille || '') + (c.type ? ' · ' + esc(c.type) : '') +
        ' · DEF ' + c.def + ' · ' + c.pv + ' PV<br>' + c.env.map(icEnv).join(' ') + '</div></div>' +
        '<div class="actions"><button class="btn btn-or btn-sm" data-bact="fiche" data-id="' + c.id + '">Fiche</button></div>' +
        '</div>';
    }).join('');
  }

  function ncTxt(nc) { return nc === 0.5 ? '½' : String(nc); }
  function icEnv(id) {
    var e = COF.ENVIRONNEMENTS.filter(function (x) { return x.id === id; })[0];
    return e ? e.ic : '';
  }

  /* ---------- Fiche détaillée ---------- */
  function fiche(c) {
    var h = '';
    h += '<div class="note" style="margin-bottom:10px">' +
      'NC ' + esc(c.ncLabel) + (c.type ? ' · ' + esc(c.type) : '') +
      (c.taille ? ' · taille ' + esc(c.taille) : '') + '</div>';
    h += '<div style="margin-bottom:12px">' + esc(c.desc) + '</div>';

    /* environnements */
    h += '<div class="chips" style="margin-bottom:12px">' +
      c.env.map(function (id) {
        var e = COF.ENVIRONNEMENTS.filter(function (x) { return x.id === id; })[0];
        return '<span class="chip">' + (e ? e.ic + ' ' + esc(e.nom) : esc(id)) + '</span>';
      }).join('') + '</div>';

    /* stats principales */
    h += '<div class="stats" style="margin-bottom:8px">' +
      '<div class="stat"><div class="lbl">Défense</div><div class="v">' + c.def + '</div></div>' +
      '<div class="stat"><div class="lbl">Vigueur</div><div class="v">' + c.pv + '</div></div>' +
      '<div class="stat"><div class="lbl">Initiative</div><div class="v">' + c.init + '</div></div>' +
      '</div>';
    if (c.rd) h += '<div class="note" style="margin-bottom:8px">Réduction des dommages : <b>RD ' + c.rd + '</b></div>';

    /* caractéristiques */
    h += '<div class="caracs" style="margin-bottom:12px">';
    COF.RULES.caracs.forEach(function (def) {
      var v = c.car[def.id];
      if (!v) return;
      h += '<div class="carac" data-bact="test-carac" data-id="' + c.id + '" data-c="' + def.id + '">' +
        '<div class="nom">' + def.id + '</div>' +
        '<div class="val">' + sgn(v[0]) + (v[1] ? '*' : '') + '</div>' +
        '<div class="mod">test</div></div>';
    });
    h += '</div>';
    h += '<div class="note" style="margin-bottom:12px;font-size:11.5px">Une caractéristique suivie de <b>*</b> est supérieure : dé bonus à ses tests (pas aux tests d\'attaque). ' +
      'Attaque magique par défaut : NC + VOL = <b>' + sgn(Math.floor(c.nc) + (c.car.VOL ? c.car.VOL[0] : 0)) + '</b>.</div>';

    /* attaques */
    if (c.att && c.att.length) {
      h += '<div style="font-size:11.5px;text-transform:uppercase;letter-spacing:.8px;color:var(--or);margin-bottom:6px">Attaques</div>';
      c.att.forEach(function (a, i) {
        h += '<div class="ligne"><div class="info"><div class="t">' + esc(a.n) + ' ' + sgn(a.mod) + '</div>' +
          '<div class="s">' + (a.dmg ? 'DM ' + esc(a.dmg) : 'pas de DM fixe') +
          (a.portee ? ' · portée ' + a.portee + ' m' : '') +
          (a.note ? ' · ' + esc(a.note) : '') + '</div></div>' +
          '<div class="actions"><button class="btn btn-or btn-sm" data-bact="attaquer" data-id="' + c.id + '" data-i="' + i + '">Attaquer</button></div>' +
          '</div>';
      });
    }

    /* capacités */
    if (c.caps && c.caps.length) {
      h += '<div style="font-size:11.5px;text-transform:uppercase;letter-spacing:.8px;color:var(--or);margin:12px 0 6px">Capacités</div>';
      c.caps.forEach(function (cap) {
        h += '<div class="cap"><div class="cap-tete"><div class="cap-nom">' + esc(cap.n) +
          (cap.a ? ' <span class="puce puce-' + cap.a.toLowerCase() + '">' + cap.a + '</span>' : '') +
          '</div></div><div class="cap-desc" style="padding-left:0">' + esc(cap.d) + '</div></div>';
      });
    }

    COF.UI.ouvrirModale(c.nom, h);
  }

  /* ---------- Actions ---------- */
  function actions(act, node) {
    if (act === 'env') {
      var v = node.getAttribute('data-v');
      F.env = v || null;
      rendre();
    } else if (act === 'cat') {
      var vc = node.getAttribute('data-v');
      F.cat = vc || null;
      rendre();
    } else if (act === 'reset') {
      F = { q: '', env: null, cat: null, ncMin: 0, ncMax: 13 };
      rendre();
    } else if (act === 'fiche') {
      var c = get(node.getAttribute('data-id'));
      if (c) fiche(c);
    } else if (act === 'attaquer') {
      var cr = get(node.getAttribute('data-id'));
      var a = cr.att[+node.getAttribute('data-i')];
      COF.UI.jet({
        titre: cr.nom + ' — ' + a.n,
        sousTitre: 'NC ' + cr.ncLabel + (a.portee ? ' · portée ' + a.portee + ' m' : '') +
          (a.note ? ' · ' + a.note : ''),
        mod: a.mod, difficulte: null,
        dmg: a.dmg || null, dmgLabel: 'Dommages',
        ctx: { carac: {}, niveau: Math.floor(cr.nc) || 1, deEvo: COF.deEvolutif(Math.floor(cr.nc) || 1) },
        type: 'attaque'
      });
    } else if (act === 'test-carac') {
      var cc = get(node.getAttribute('data-id'));
      var k = node.getAttribute('data-c');
      var val = cc.car[k];
      COF.UI.jet({
        titre: cc.nom + ' — test de ' + k,
        sousTitre: val[1] ? 'Caractéristique supérieure : dé bonus' : '',
        mod: val[0], difficulte: 15,
        ctx: { carac: {}, niveau: Math.floor(cc.nc) || 1, deEvo: 4 }
      });
      if (val[1]) {
        var opt = COF.UI.$('.opt[data-o="bonus"]');
        if (opt) opt.click();
      }
    }
  }

  return { init: init, rendre: rendre, filtrer: filtrer, get: get, fiche: fiche };
})();
