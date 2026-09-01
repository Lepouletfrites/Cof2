/* ============================================================
   COF2 Compagnon — Générateur d'objet prestigieux (sous-onglet
   de Générateurs) : un objet unique doté de sa propre voie à 5
   rangs, liée à un profil réel — sur le modèle de « La Lame des
   Échos » du livre de base. Le rang 1 (bonus mineur) s'applique
   automatiquement une fois l'objet ajouté ; les rangs 2 à 5
   RENFORCENT chacun une capacité que le profil possède déjà dans
   ses propres voies (dégâts, portée, coût, usages...) — l'objet
   n'ouvre pas l'accès à une capacité nouvelle, il en améliore une
   existante, à débloquer en jeu selon sa condition.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.ObjetPrestigieux = (function () {
  var esc = COF.UI.esc;
  var cible = null;

  var CHAMPS = [['profil', 'Profil lié'], ['forme', 'Forme'], ['rangs', 'Progression']];

  function texte(id, v) {
    if (id === 'profil') return COF.PROFILS[v] ? COF.PROFILS[v].nom : v;
    if (id === 'forme') return v.arme ? (v.nom + ' — DM ' + v.dm) : v.nom;
    if (id === 'rangs') return v.length + ' rangs générés (voir le détail ci-dessous)';
    return v;
  }

  var vue = COF.UI.creerVueChamps(
    { genererTout: COF.ObjetPrestigieuxCalc.genererTout, genererChamp: COF.ObjetPrestigieuxCalc.genererChamp },
    texte, 'opact'
  );

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-opact]') : null;
      if (!t || !(t.closest('#vue-generateurs') || t.closest('#modale'))) return;
      actions(t.getAttribute('data-opact'), t);
    });
  }

  function construireItem(o) {
    var item = { nom: o.nom, qte: 1, prix: 200 };
    var desc = 'Objet prestigieux lié au profil ' + (COF.PROFILS[o.profil] || {}).nom + '. ' +
      o.rangs.map(function (r) {
        return 'Rang ' + r.rang + ' (niveau de magie ' + r.niveauMagie + ')' +
          (r.prerequis ? ' — prérequis : ' + r.prerequis : '') + ' : ' + r.texte;
      }).join(' ');
    item.note = desc;
    if (o.forme.arme) { item.dm = o.forme.dm; item.armeType = o.forme.armeType; item.bonus = 1; }
    else { item.def = 1; item.slot = 'armure'; }
    return item;
  }

  function rendre(node) {
    cible = node;
    vue.assurer();
    var o = vue.etatCourant();
    var perso = COF.Store.actif();

    var h = '<div class="carte"><h2>Objet prestigieux<span class="h2-action" data-opact="tout">↻ Nouvel objet</span></h2>';
    h += '<div class="carte-corps">';
    h += '<div class="note" style="margin-bottom:10px">🔓 pour verrouiller un champ avant de relancer le reste, ↻ pour ne changer que cette ligne. ' +
      "Un tel objet suit un personnage toute sa carrière : le rang 1 s'applique dès l'ajout ; les rangs suivants renforcent une capacité que le profil possède déjà (et non une nouvelle capacité), à débloquer en jeu selon leur condition (au MJ de trancher).</div>";

    h += '<div style="font-size:22px;font-family:Georgia,serif;color:var(--or-clair);margin-bottom:2px">' + esc(o.nom) + '</div>';
    h += '<div class="note" style="margin-bottom:10px">' + esc((COF.PROFILS[o.profil] || {}).nom || o.profil) +
      ' · ' + esc(o.forme.nom) + (o.forme.arme ? ' · DM ' + esc(o.forme.dm) : '') + '</div>';

    h += vue.ligne('profil', 'Profil lié');
    h += vue.ligne('forme', 'Forme');
    h += '<button class="btn btn-sm" data-opact="relancer-champ" data-c="nom" style="margin-bottom:8px">↻ Nom</button>';

    h += '<div style="font-size:11.5px;text-transform:uppercase;letter-spacing:.8px;color:var(--or);margin:10px 0 6px">Progression (5 rangs)</div>';
    o.rangs.forEach(function (r) {
      h += '<div class="cap acquise" style="margin-bottom:6px">' +
        '<div class="cap-tete"><div class="cap-num">' + r.rang + '</div>' +
        '<div class="cap-nom">Niveau de magie ' + r.niveauMagie + '</div></div>' +
        '<div class="cap-desc">' + esc(r.texte) + '</div>' +
        (r.prerequis ? '<div class="note" style="margin-top:4px;color:var(--or)">Prérequis : ' + esc(r.prerequis) + '</div>' : '') +
        '</div>';
    });
    h += '<button class="btn btn-sm" data-opact="relancer-champ" data-c="rangs" style="margin:6px 0 10px">↻ Relancer toute la progression</button>';

    if (!perso) {
      h += '<div class="note">Aucun personnage actif : ouvrez-en un depuis « Persos » pour le récupérer.</div>';
    } else if (o.ajoute) {
      h += '<button class="btn btn-bloc" disabled style="opacity:.6">✓ Ajouté à ' + esc(perso.nom) + '</button>';
    } else {
      h += '<button class="btn btn-plein btn-bloc" data-opact="ajouter">📥 Ajouter à ' + esc(perso.nom) + ' (applique le rang 1)</button>';
    }
    h += '<button class="btn btn-bloc" style="margin-top:8px" data-opact="tout">↻ Nouvel objet</button>';
    h += '</div></div>';

    node.innerHTML = h;
  }

  function actions(act, node) {
    if (act === 'ajouter') {
      var o = vue.etatCourant();
      var perso = COF.Store.actif();
      if (o && perso && !o.ajoute) {
        COF.Store.ajouterObjet(perso, construireItem(o));
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
