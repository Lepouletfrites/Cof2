/* ============================================================
   COF2 Compagnon — Générateur d'intrigue (sous-onglet de
   Générateurs) : Rebondissement (relance une scène qui stagne) et
   Tour de faction (simule ce qui se passe hors champ) — deux
   outils pour jouer en solo sans meneur qui improvise à la volée.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Intrigue = (function () {
  var esc = COF.UI.esc;
  var MODE = 'rebondissement';
  var cible = null;
  var Calc = COF.IntrigueCalc;

  var VUES = {
    rebondissement: {
      titre: 'Rebondissement', bouton: '↻ Nouveau rebondissement',
      champs: [['nature', 'Nature'], ['cible', 'Touche'], ['origine', "Comment on l'apprend"]],
      texte: function (id, v) { return v; },
      synthese: Calc.syntheseRebondissement
    },
    faction: {
      titre: 'Tour de faction', bouton: '↻ Nouveau tour',
      champs: [['faction', 'Qui agit'], ['objectif', 'Objectif'], ['action', 'Ce tour-ci'], ['impact', 'Le personnage']],
      texte: function (id, v) { return v; },
      synthese: Calc.syntheseFaction
    }
  };

  Object.keys(VUES).forEach(function (mode) {
    var v = VUES[mode];
    v.vue = COF.UI.creerVueChamps(Calc.GENS[mode], v.texte, 'inact');
  });

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-inact]') : null;
      if (!t || !(t.closest('#vue-generateurs') || t.closest('#modale'))) return;
      actions(t.getAttribute('data-inact'), t);
    });
  }

  function rendre(node) {
    cible = node;
    var v = VUES[MODE];
    v.vue.assurer();
    var o = v.vue.etatCourant();

    var h = '<div class="carte"><div class="carte-corps" style="padding-bottom:2px">' +
      '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:var(--text-mute);margin-bottom:5px">Outil</div>' +
      '<div class="chips" style="margin-bottom:2px">' +
      Object.keys(VUES).map(function (m) {
        return '<span class="chip ' + (MODE === m ? 'on' : '') + '" data-inact="mode" data-v="' + m + '">' + esc(VUES[m].titre) + '</span>';
      }).join('') + '</div></div></div>';

    h += '<div class="carte"><h2>' + esc(v.titre) + '<span class="h2-action" data-inact="tout">' + esc(v.bouton) + '</span></h2>';
    h += '<div class="carte-corps">';
    h += '<div class="note" style="margin-bottom:10px">🔓 pour verrouiller un champ avant de relancer le reste, ↻ pour ne changer que cette ligne.</div>';
    h += '<div style="margin-bottom:12px;padding:10px;border:1px solid var(--line-2);border-radius:8px;' +
      'background:rgba(0,0,0,.15);font-size:14.5px;line-height:1.5">' + esc(v.synthese(o)) + '</div>';
    v.champs.forEach(function (c) { h += v.vue.ligne(c[0], c[1]); });
    h += '<button class="btn btn-bloc" style="margin-top:8px" data-inact="tout">' + esc(v.bouton) + '</button>';
    h += '</div></div>';

    node.innerHTML = h;
  }

  function actions(act, node) {
    if (act === 'mode') { MODE = node.getAttribute('data-v'); if (cible) rendre(cible); return; }
    var v = VUES[MODE];
    if (v.vue.actionGenerique(act, node)) { if (cible) rendre(cible); return; }
  }

  return { init: init, rendre: rendre };
})();
