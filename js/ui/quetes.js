/* ============================================================
   COF2 Compagnon — Générateur d'accroches & quêtes (sous-onglet
   de Générateurs) : commanditaire, motivation, objectif, obstacle,
   complication et récompense combinés en une accroche complète.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Quetes = (function () {
  var esc = COF.UI.esc;
  var cible = null;

  var CHAMPS = [
    ['commanditaire', 'Commanditaire'], ['motivation', 'Motivation réelle'],
    ['objectif', 'Objectif'], ['cible', 'Concrètement'], ['lieu', 'Lieu'],
    ['obstacle', 'Obstacle principal'], ['complication', 'Complication'],
    ['recompense', 'Récompense proposée']
  ];

  function texte(id, v) {
    if (id === 'lieu') return v.ic + ' ' + v.nom;
    return v;
  }

  var vue = COF.UI.creerVueChamps(
    { genererTout: COF.QueteCalc.genererTout, genererChamp: COF.QueteCalc.genererChamp },
    texte, 'qact'
  );

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-qact]') : null;
      if (!t || !(t.closest('#vue-generateurs') || t.closest('#modale'))) return;
      actions(t.getAttribute('data-qact'), t);
    });
  }

  function rendre(node) {
    cible = node;
    vue.assurer();
    var q = vue.etatCourant();

    var h = '<div class="carte"><h2>Accroche de quête<span class="h2-action" data-qact="tout">↻ Nouvelle quête</span></h2>';
    h += '<div class="carte-corps">';
    h += '<div class="note" style="margin-bottom:10px">🔓 pour verrouiller un champ avant de relancer le reste, ↻ pour ne changer que cette ligne.</div>';
    h += '<div style="margin-bottom:12px;padding:10px;border:1px solid var(--line-2);border-radius:8px;' +
      'background:rgba(0,0,0,.15);font-size:14.5px;line-height:1.5">' + esc(COF.QueteCalc.accroche(q)) + '</div>';
    CHAMPS.forEach(function (c) { h += vue.ligne(c[0], c[1]); });
    h += '<button class="btn btn-plein btn-bloc" style="margin-top:10px" data-qact="tout">↻ Nouvelle quête</button>';
    h += '</div></div>';

    node.innerHTML = h;
  }

  function actions(act, node) {
    if (vue.actionGenerique(act, node)) { if (cible) rendre(cible); return; }
  }

  return { init: init, rendre: rendre };
})();
