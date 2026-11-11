/* ============================================================
   COF2 Compagnon — Générateur de lieux (sous-onglet de Générateurs)
   Taverne, boutique ou village/ville, procéduraux, à champs
   verrouillables comme le générateur de PNJ.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Lieux = (function () {
  var esc = COF.UI.esc;
  var MODE = 'taverne';   // 'taverne' | 'boutique' | 'village'
  var cible = null;

  function texteTenancier(v) { return COF.LieuxCalc.texteTenancier(v, false); }
  function texteNotable(v) { return COF.LieuxCalc.texteTenancier(v, true); }

  var VUES = {
    taverne: {
      titre: 'Taverne', bouton: '🍺 Nouvelle taverne',
      champs: [['nom', 'Nom'], ['ambiance', 'Ambiance'], ['specialite', 'Spécialité'], ['prix', 'Prix'],
        ['tenancier', 'Tenancier'], ['particularite', 'Particularité'], ['rumeur', "Ce qu'on y entend"]],
      texte: function (id, v) {
        if (id === 'tenancier') return texteTenancier(v);
        if (id === 'specialite') return 'Sert ' + v;
        return v;
      },
      vue: COF.UI.creerVueChamps(COF.LieuxCalc.taverne, function (id, v) { return VUES.taverne.texte(id, v); }, 'lact')
    },
    boutique: {
      titre: 'Boutique', bouton: '🛒 Nouvelle boutique',
      champs: [['type', 'Type de commerce'], ['nom', 'Enseigne'], ['marchand', 'Marchand'], ['trait', 'Réputation'],
        ['stock', 'Marchandise'], ['anecdote', 'Anecdote']],
      texte: function (id, v) {
        if (id === 'type') return v.nom;
        if (id === 'marchand') return texteTenancier(v);
        if (id === 'stock') return v.map(function (it) { return (it.magique ? '✨ ' : '') + it.nom + ' (' + it.prix + ' pa)'; }).join(' · ');
        return v;
      },
      vue: COF.UI.creerVueChamps(COF.LieuxCalc.boutique, function (id, v) { return VUES.boutique.texte(id, v); }, 'lact')
    },
    village: {
      titre: 'Village / ville', bouton: '🏘️ Nouvelle localité',
      champs: [['nom', 'Nom'], ['taille', 'Taille'], ['specialite', 'Économie'], ['gouvernance', 'Gouvernance'],
        ['ambiance', 'Ambiance'], ['probleme', 'Problème du moment'], ['notable', 'Personnage notable']],
      texte: function (id, v) {
        if (id === 'taille') return v.nom + ' (' + v.pop + ') — ' + v.note;
        if (id === 'gouvernance') return 'Dirigé par ' + v;
        if (id === 'notable') return texteNotable(v);
        return v;
      },
      vue: COF.UI.creerVueChamps(COF.LieuxCalc.etablissement, function (id, v) { return VUES.village.texte(id, v); }, 'lact')
    }
  };

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-lact]') : null;
      if (!t || !(t.closest('#vue-generateurs') || t.closest('#modale'))) return;
      actions(t.getAttribute('data-lact'), t);
    });
  }

  function rendre(node) {
    cible = node;
    var v = VUES[MODE];
    v.vue.assurer();

    var h = '<div class="carte"><div class="carte-corps" style="padding-bottom:2px">' +
      '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:var(--text-mute);margin-bottom:5px">Type de lieu</div>' +
      '<div class="chips" style="margin-bottom:2px">' +
      '<span class="chip ' + (MODE === 'taverne' ? 'on' : '') + '" data-lact="mode" data-v="taverne">🍺 Taverne</span>' +
      '<span class="chip ' + (MODE === 'boutique' ? 'on' : '') + '" data-lact="mode" data-v="boutique">🛒 Boutique</span>' +
      '<span class="chip ' + (MODE === 'village' ? 'on' : '') + '" data-lact="mode" data-v="village">🏘️ Village / ville</span>' +
      '</div></div></div>';

    h += '<div class="carte"><h2>' + esc(v.titre) + '<span class="h2-action" data-lact="tout">↻ ' + esc(v.bouton.replace(/^\S+\s/, '')) + '</span></h2>';
    h += '<div class="carte-corps">';
    h += '<div class="note" style="margin-bottom:10px">🔓 pour verrouiller un champ avant de relancer le reste, ↻ pour ne changer que cette ligne.</div>';
    v.champs.forEach(function (c) { h += v.vue.ligne(c[0], c[1]); });
    h += '<button class="btn btn-plein btn-bloc" style="margin-top:10px" data-lact="tout">' + esc(v.bouton) + '</button>';
    h += '</div></div>';
    if (MODE === 'boutique') h += blocAchats(v.vue.get('stock') || []);

    node.innerHTML = h;
  }

  /* Comptoir : chaque article s'achète avec la bourse du personnage actif
     et arrive sur sa fiche (armes, armures et objets magiques prêts). */
  function blocAchats(stock) {
    if (!stock.length) return '';
    var perso = COF.Store.actif();
    var h = '<div class="carte"><h2>Comptoir</h2><div class="carte-corps">';
    if (!perso) h += '<div class="note" style="margin-bottom:8px">Aucun personnage actif : ouvrez-en un depuis « Persos » pour acheter.</div>';
    else {
      var b = perso.bourse || {};
      h += '<div class="note" style="margin-bottom:8px">Bourse de <b>' + esc(perso.nom) + '</b> : ' + (b.po || 0) + ' po · ' + (b.pa || 0) + ' pa' +
        (stock.some(function (s) { return s.magique; }) ? '. Objets magiques limités au niveau ' + (perso.niveau || 1) + '.' : '.') + '</div>';
    }
    stock.forEach(function (s, i) {
      h += '<div class="ligne" style="align-items:flex-start"><div class="info"><div class="t">' + (s.magique ? '✨ ' : '') + esc(s.nom) +
        ' <span class="puce">' + s.prix.toLocaleString('fr-FR') + ' pa</span>' + (s.qte > 1 ? ' <span class="puce">×' + s.qte + '</span>' : '') + '</div>' +
        (s.source ? '<div class="s" style="color:var(--or)">' + esc(s.source) + (s.niveau ? ' · niveau ' + s.niveau : '') + '</div>' : '') +
        (s.magique && s.item && s.item.note ? '<div class="s">' + esc(s.item.note) + '</div>' : '') + '</div>' +
        '<div class="actions">' + (s.achete ? '<button class="btn btn-sm" disabled style="opacity:.6">✓</button>'
          : (perso ? '<button class="btn btn-sm" data-lact="acheter" data-i="' + i + '">💰 Acheter</button>' : '')) + '</div></div>';
    });
    if (achatMsg) h += '<div class="note" style="margin-top:8px;color:var(--sang-clair)">' + esc(achatMsg) + '</div>';
    return h + '</div></div>';
  }
  var achatMsg = '';

  function acheter(i) {
    var stock = VUES.boutique.vue.get('stock') || [], s = stock[i], perso = COF.Store.actif();
    achatMsg = '';
    if (!s || !perso || s.achete) return;
    if (!COF.Artisanat.payer(perso, Math.round(s.prix))) { achatMsg = 'Pas assez d’argent pour « ' + s.nom + ' ».'; return; }
    COF.Store.ajouterObjet(perso, Object.assign({}, s.item || { nom: s.nom, qte: 1 }, { prix: s.prix }));
    COF.Store.sauver(perso);
    s.achete = true;
  }

  function actions(act, node) {
    if (act === 'mode') { MODE = node.getAttribute('data-v'); if (cible) rendre(cible); return; }
    if (act === 'acheter') { acheter(+node.getAttribute('data-i')); if (cible) rendre(cible); return; }
    achatMsg = '';
    var v = VUES[MODE];
    if (v.vue.actionGenerique(act, node)) { if (cible) rendre(cible); return; }
  }

  return { init: init, rendre: rendre };
})();
