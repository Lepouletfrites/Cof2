/* ============================================================
   COF2 Compagnon — Générateur de salles de donjon (sous-onglet
   de Générateurs) : architecture, état, occupants, piège,
   particularité et sorties, pour décrire une salle à la volée.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Donjon = (function () {
  var esc = COF.UI.esc;
  var cible = null;

  var CHAMPS = [
    ['forme', 'Architecture'], ['etat', 'État des lieux'], ['occupant', 'Occupant(s)'],
    ['piege', 'Piège'], ['particularite', 'Particularité'], ['sortie', 'Sortie(s)']
  ];

  function texte(id, v) { return v; }

  var vue = COF.UI.creerVueChamps(
    { genererTout: COF.DonjonCalc.genererTout, genererChamp: COF.DonjonCalc.genererChamp },
    texte, 'djact'
  );

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-djact]') : null;
      if (!t || !(t.closest('#vue-generateurs') || t.closest('#modale'))) return;
      actions(t.getAttribute('data-djact'), t);
    });
  }

  function rendre(node) {
    cible = node;
    vue.assurer();
    var s = vue.etatCourant();

    var h = '<div class="carte"><h2>Salle de donjon<span class="h2-action" data-djact="tout">↻ Nouvelle salle</span></h2>';
    h += '<div class="carte-corps">';
    h += '<div class="note" style="margin-bottom:10px">🔓 pour verrouiller un champ avant de relancer le reste, ↻ pour ne changer que cette ligne. ' +
      'À combiner avec Rencontre (si l\'occupant s\'avère hostile) et Butin (pour le contenu d\'un trésor trouvé).</div>';
    h += '<div style="margin-bottom:12px;padding:10px;border:1px solid var(--line-2);border-radius:8px;' +
      'background:rgba(0,0,0,.15);font-size:14.5px;line-height:1.6">' +
      esc(s.forme) + '. ' + esc(s.etat) + '.<br>' +
      '<b>Occupants :</b> ' + esc(s.occupant) + '.<br>' +
      '<b>Piège :</b> ' + esc(s.piege) + '.<br>' +
      '<b>Particularité :</b> ' + esc(s.particularite) + '.<br>' +
      '<b>Sortie(s) :</b> ' + esc(s.sortie) + '.' +
      '</div>';
    CHAMPS.forEach(function (c) { h += vue.ligne(c[0], c[1]); });
    h += '<button class="btn btn-plein btn-bloc" style="margin-top:10px" data-djact="tout">↻ Nouvelle salle</button>';
    h += '</div></div>';

    node.innerHTML = h;
  }

  function actions(act, node) {
    if (vue.actionGenerique(act, node)) { if (cible) rendre(cible); return; }
  }

  return { init: init, rendre: rendre };
})();
