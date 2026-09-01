/* ============================================================
   COF2 Compagnon — Petit contrôleur de vue réutilisable pour les
   générateurs « à champs verrouillables » (sur le modèle du
   générateur de PNJ) : verrou 🔒/🔓, relance individuelle ↻,
   tirage complet respectant les verrous.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

/* gen   : objet { genererTout, genererChamp } (voir COF.creerGenerateurChamps)
   texte : function (id, valeur, etatComplet) -> string affichable
   attr  : nom de l'attribut data-* utilisé pour router les clics,
           propre à chaque générateur pour ne pas interférer avec les autres. */
COF.UI.creerVueChamps = function (gen, texte, attr) {
  var etat = null;
  var verrous = {};

  function assurer() { if (!etat) etat = gen.genererTout(verrous, {}); }
  function tout() { etat = gen.genererTout(verrous, etat || {}); }
  function champ(id) { etat[id] = gen.genererChamp(id, etat); }
  function verrou(id) { verrous[id] = !verrous[id]; }
  function get(id) { return etat ? etat[id] : undefined; }
  function reinitialiser() { etat = null; verrous = {}; }

  function ligne(id, label) {
    var v = texte(id, get(id), etat);
    var lock = !!verrous[id];
    return '<div class="ligne">' +
      '<button class="btn btn-sm" data-' + attr + '="verrou" data-c="' + id + '" title="Verrouiller" style="' +
        (lock ? 'border-color:var(--or);color:var(--or-clair)' : '') + '">' + (lock ? '🔒' : '🔓') + '</button>' +
      '<div class="info" style="margin-left:8px"><div class="t" style="font-size:11px;text-transform:uppercase;' +
        'letter-spacing:.6px;color:var(--text-mute)">' + COF.UI.esc(label) + '</div>' +
      '<div class="s" style="font-size:14.5px;color:var(--text)">' + COF.UI.esc(v) + '</div></div>' +
      '<div class="actions"><button class="btn btn-sm" data-' + attr + '="relancer-champ" data-c="' + id + '">↻</button></div>' +
      '</div>';
  }

  /* Gère verrou / relancer-champ / tout ; renvoie true si géré, pour
     laisser le module appelant gérer ses actions spécifiques ensuite. */
  function actionGenerique(act, node) {
    if (act === 'verrou') { verrou(node.getAttribute('data-c')); return true; }
    if (act === 'relancer-champ') { champ(node.getAttribute('data-c')); return true; }
    if (act === 'tout') { tout(); return true; }
    return false;
  }

  return {
    assurer: assurer, tout: tout, champ: champ, verrou: verrou, get: get,
    reinitialiser: reinitialiser, ligne: ligne, actionGenerique: actionGenerique,
    etatCourant: function () { return etat; }
  };
};
