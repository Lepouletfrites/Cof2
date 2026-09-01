/* ============================================================
   COF2 Compagnon — Générateur d'événements de voyage
   (sous-onglet de Générateurs) : lieu, météo et un événement
   non-combat (PNJ croisé, incident, point d'intérêt, découverte,
   présage) pour ponctuer un trajet.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Voyage = (function () {
  var esc = COF.UI.esc;
  var cible = null;

  var CHAMPS = [
    ['lieu', 'Environnement'], ['meteo', 'Météo'], ['categorie', 'Catégorie'], ['detail', 'Événement']
  ];

  function texte(id, v) {
    if (id === 'lieu') return v.ic + ' ' + v.nom;
    if (id === 'categorie') return COF.VOYAGE_CATEGORIES_LABELS[v] || v;
    return v;
  }

  var vue = COF.UI.creerVueChamps(
    { genererTout: COF.VoyageCalc.genererTout, genererChamp: COF.VoyageCalc.genererChamp },
    texte, 'voyact'
  );

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-voyact]') : null;
      if (!t || !(t.closest('#vue-generateurs') || t.closest('#modale'))) return;
      actions(t.getAttribute('data-voyact'), t);
    });
  }

  function rendre(node) {
    cible = node;
    vue.assurer();
    var v = vue.etatCourant();

    var h = '<div class="carte"><h2>Événement de voyage<span class="h2-action" data-voyact="tout">↻ Nouvel événement</span></h2>';
    h += '<div class="carte-corps">';
    h += '<div class="note" style="margin-bottom:10px">🔓 pour verrouiller un champ avant de relancer le reste, ↻ pour ne changer que cette ligne. ' +
      'Utile pour ponctuer un trajet sans déclencher de combat.</div>';
    h += '<div style="margin-bottom:12px;padding:10px;border:1px solid var(--line-2);border-radius:8px;' +
      'background:rgba(0,0,0,.15);font-size:14.5px;line-height:1.5">' +
      esc(v.lieu.ic + ' ' + v.lieu.nom + ' · ' + v.meteo) + '<br>' +
      '<b>' + esc(COF.VOYAGE_CATEGORIES_LABELS[v.categorie] || v.categorie) + '</b> — ' + esc(v.detail) +
      '</div>';
    CHAMPS.forEach(function (c) { h += vue.ligne(c[0], c[1]); });
    h += '<button class="btn btn-plein btn-bloc" style="margin-top:10px" data-voyact="tout">↻ Nouvel événement</button>';
    h += '</div></div>';

    node.innerHTML = h;
  }

  function actions(act, node) {
    if (vue.actionGenerique(act, node)) { if (cible) rendre(cible); return; }
  }

  return { init: init, rendre: rendre };
})();
