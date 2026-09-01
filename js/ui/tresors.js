/* ============================================================
   COF2 Compagnon — Générateur d'objets & trésors nommés
   (sous-onglet de Générateurs) : un objet magique unique, avec
   un nom, des pouvoirs, une origine et parfois une malédiction —
   transférable directement dans l'inventaire du personnage actif.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Tresors = (function () {
  var esc = COF.UI.esc;
  var cible = null;

  var CHAMPS = [
    ['type', 'Type'], ['tier', 'Palier'], ['pouvoirs', 'Pouvoirs'],
    ['origine', 'Origine'], ['maudit', 'Malédiction'], ['prix', 'Coût estimé']
  ];

  function texte(id, v) {
    if (id === 'type') return v.nom;
    if (id === 'tier') return v.nom + ' (' + v.niveau + ')';
    if (id === 'pouvoirs') return v.join(' · ');
    if (id === 'maudit') return v ? v : 'Aucune — objet sain';
    if (id === 'prix') return v + ' po';
    return v;
  }

  var vue = COF.UI.creerVueChamps(
    { genererTout: COF.TresorCalc.genererTout, genererChamp: COF.TresorCalc.genererChamp },
    texte, 'tnact'
  );

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-tnact]') : null;
      if (!t || !(t.closest('#vue-generateurs') || t.closest('#modale'))) return;
      actions(t.getAttribute('data-tnact'), t);
    });
  }

  /* Construit l'objet tel qu'il sera stocké dans l'inventaire du personnage :
     conserve le prix et la description complète, ajoute les dégâts pour une
     arme ou le bonus de DEF pour une armure/un bouclier. */
  function construireItem(o) {
    var item = { nom: o.nom, qte: 1, prix: o.prix, desc: COF.TresorCalc.texteComplet(o) };
    if (o.type.arme) { item.dmg = o.type.dmg; item.armeType = o.type.armeType; }
    if (o.type.armure) { item.def = o.type.def; }
    return item;
  }

  function boutonAjouter(o, perso) {
    if (!perso) return '<div class="note">Aucun personnage actif : ouvrez-en un depuis « Persos » pour le récupérer.</div>';
    if (o.ajoute) return '<button class="btn btn-bloc" disabled style="opacity:.6">✓ Ajouté à ' + esc(perso.nom) + '</button>';
    return '<button class="btn btn-plein btn-bloc" data-tnact="ajouter">📥 Ajouter à ' + esc(perso.nom) + '</button>';
  }

  function rendre(node) {
    cible = node;
    vue.assurer();
    var o = vue.etatCourant();
    var perso = COF.Store.actif();

    var h = '<div class="carte"><h2>Objet nommé<span class="h2-action" data-tnact="tout">↻ Nouvel objet</span></h2>';
    h += '<div class="carte-corps">';
    h += '<div class="note" style="margin-bottom:10px">🔓 pour verrouiller un champ avant de relancer le reste, ↻ pour ne changer que cette ligne.</div>';

    h += '<div style="font-size:22px;font-family:Georgia,serif;color:var(--or-clair);margin-bottom:2px">' + esc(o.nom) + '</div>';
    h += '<div class="note" style="margin-bottom:10px">' + esc(o.type.nom) + ' · palier ' + esc(o.tier.nom.toLowerCase()) +
      (o.type.arme ? ' · DM ' + esc(o.type.dmg) : '') + (o.type.armure ? ' · +' + o.type.def + ' DEF' : '') +
      (o.maudit ? ' · <span style="color:var(--sang-clair)">maudit</span>' : '') + '</div>';

    h += vue.ligne('nom', 'Nom');
    CHAMPS.forEach(function (c) { h += vue.ligne(c[0], c[1]); });
    h += '<div style="margin-top:10px">' + boutonAjouter(o, perso) + '</div>';
    h += '<button class="btn btn-bloc" style="margin-top:8px" data-tnact="tout">↻ Nouvel objet</button>';
    h += '</div></div>';

    node.innerHTML = h;
  }

  function actions(act, node) {
    if (act === 'ajouter') {
      var o = vue.etatCourant();
      var perso = COF.Store.actif();
      if (o && perso && !o.ajoute) {
        perso.inventaire.push(construireItem(o));
        o.ajoute = true;
        COF.Store.sauver(perso);
      }
      if (cible) rendre(cible);
      return;
    }
    if (vue.actionGenerique(act, node)) {
      if (act !== 'verrou') {
        var etat = vue.etatCourant();
        if (etat) etat.ajoute = false;
      }
      if (cible) rendre(cible);
      return;
    }
  }

  return { init: init, rendre: rendre };
})();
