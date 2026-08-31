/* ============================================================
   COF2 Compagnon — Générateur de PNJ (sous-onglet de Générateurs)
   Génération complète ou champ par champ, avec verrous pour ne
   garder que ce qu'on aime d'un tirage à l'autre.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Pnj = (function () {
  var $ = COF.UI.$, $$ = COF.UI.$$, esc = COF.UI.esc;

  var pnj = null;
  var verrous = {};
  var cibleActuelle = null;

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-pact]') : null;
      if (!t || !(t.closest('#vue-generateurs') || t.closest('#modale'))) return;
      actions(t.getAttribute('data-pact'), t);
    });
  }

  var LABELS = {
    peuple: 'Peuple', genre: 'Genre', nom: 'Nom', age: 'Âge',
    taille: 'Taille', corpulence: 'Corpulence', cheveux: 'Cheveux',
    yeux: 'Yeux', teint: 'Teint', signe: 'Signe distinctif',
    metier: 'Métier', ideal: 'Idéal héroïque', travers: 'Travers',
    manie: 'Manie', motivation: 'Motivation', secret: 'Secret',
    accroche: 'Accroche', divinite: 'Divinité', attitude: 'Attitude envers les PJ'
  };
  var NOMS_PEUPLE = {
    humain: 'Humain', nain: 'Nain', halfelin: 'Halfelin', gnome: 'Gnome',
    elfehaut: 'Elfe haut', elfesylvain: 'Elfe sylvain', demiorc: 'Demi-orc', demielfe: 'Demi-elfe'
  };

  function texteChamp(id, valeur) {
    if (valeur === undefined || valeur === null) return '';
    if (id === 'peuple') return NOMS_PEUPLE[valeur] || valeur;
    if (id === 'metier') return valeur.nom + ' (' + valeur.cat + ')';
    if (id === 'divinite') return valeur.nom + ', ' + valeur.domaine;
    return String(valeur);
  }

  function rendre(cible) {
    cibleActuelle = cible;
    if (!pnj) pnj = COF.PnjCalc.genererPNJ(verrous, {});
    cible.innerHTML = html();
    $$('.pliable > h2', cible).forEach(function (t) {
      t.addEventListener('click', function (e) {
        if (e.target.classList.contains('h2-action')) return;
        t.parentNode.classList.toggle('ferme');
      });
    });
  }

  function ligneChamp(id, extra) {
    var v = texteChamp(id, pnj[id]);
    var verrou = !!verrous[id];
    return '<div class="ligne">' +
      '<button class="btn btn-sm" data-pact="verrou" data-c="' + id + '" title="Verrouiller" ' +
        'style="' + (verrou ? 'border-color:var(--or);color:var(--or-clair)' : '') + '">' + (verrou ? '🔒' : '🔓') + '</button>' +
      '<div class="info" style="margin-left:8px"><div class="t" style="font-size:11px;text-transform:uppercase;' +
        'letter-spacing:.6px;color:var(--text-mute)">' + esc(LABELS[id]) + '</div>' +
      '<div class="s" style="font-size:14.5px;color:var(--text)">' + esc(v) + (extra || '') + '</div></div>' +
      '<div class="actions"><button class="btn btn-sm" data-pact="relancer-champ" data-c="' + id + '">↻</button></div>' +
      '</div>';
  }

  function html() {
    var h = '';
    h += '<div class="carte"><h2>Générateur de PNJ<span class="h2-action" data-pact="tout">↻ Nouveau PNJ</span></h2>';
    h += '<div class="carte-corps">';
    h += '<div class="note" style="margin-bottom:10px">Tapez 🔓 pour verrouiller un champ avant de relancer le reste, ' +
      'ou ↻ pour ne changer que cette ligne.</div>';

    h += '<div style="font-size:24px;font-family:Georgia,serif;color:var(--or-clair);margin-bottom:2px">' + esc(pnj.nom) + '</div>';
    h += '<div class="note" style="margin-bottom:10px">' + esc(NOMS_PEUPLE[pnj.peuple]) + ' · ' + esc(pnj.genre) + ' · ' + esc(pnj.age) + '</div>';

    h += ligneChamp('peuple');
    h += ligneChamp('genre');
    h += ligneChamp('nom');
    h += ligneChamp('age');
    h += '</div></div>';

    h += '<div class="carte pliable"><h2>Apparence</h2><div class="carte-corps">';
    ['taille', 'corpulence', 'cheveux', 'yeux', 'teint', 'signe'].forEach(function (id) { h += ligneChamp(id); });
    h += '</div></div>';

    h += '<div class="carte pliable"><h2>Vie sociale</h2><div class="carte-corps">';
    h += ligneChamp('metier');
    h += ligneChamp('divinite');
    h += '</div></div>';

    h += '<div class="carte pliable"><h2>Personnalité</h2><div class="carte-corps">';
    ['ideal', 'travers', 'manie', 'attitude'].forEach(function (id) { h += ligneChamp(id); });
    h += '</div></div>';

    h += '<div class="carte pliable"><h2>Pour le scénario</h2><div class="carte-corps">';
    ['motivation', 'secret', 'accroche'].forEach(function (id) { h += ligneChamp(id); });
    h += '</div></div>';

    h += '<button class="btn btn-plein btn-bloc" data-pact="tout" style="margin-bottom:8px">🎭 Nouveau PNJ (respecte les verrous)</button>';
    h += '<button class="btn btn-bloc" data-pact="fiche-texte">📋 Voir en fiche imprimable</button>';

    return h;
  }

  function ficheTexte() {
    var lignes = Object.keys(LABELS).map(function (id) {
      return '<div class="ligne"><div class="info"><div class="t" style="font-size:11px;text-transform:uppercase;' +
        'letter-spacing:.6px;color:var(--or)">' + esc(LABELS[id]) + '</div>' +
        '<div class="s" style="font-size:14px;color:var(--text)">' + esc(texteChamp(id, pnj[id])) + '</div></div></div>';
    });
    COF.UI.ouvrirModale(pnj.nom, lignes.join(''));
  }

  function actions(act, node) {
    switch (act) {
      case 'tout':
        pnj = COF.PnjCalc.genererPNJ(verrous, pnj || {});
        if (cibleActuelle) rendre(cibleActuelle);
        break;
      case 'relancer-champ': {
        var id = node.getAttribute('data-c');
        pnj[id] = COF.PnjCalc.genererChamp(id, pnj);
        if (cibleActuelle) rendre(cibleActuelle);
        break;
      }
      case 'verrou': {
        var c = node.getAttribute('data-c');
        verrous[c] = !verrous[c];
        if (cibleActuelle) rendre(cibleActuelle);
        break;
      }
      case 'fiche-texte': ficheTexte(); break;
    }
  }

  return { init: init, rendre: rendre };
})();
