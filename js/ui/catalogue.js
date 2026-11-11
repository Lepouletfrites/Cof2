/* ============================================================
   COF2 Compagnon — Onglet « Catalogue du Compagnon »
   (sous-onglet de Générateurs) : tous les objets des voies de
   recettes du Compagnon du joueur hors atelier d'arme magique —
   munitions et accessoires, armures et boucliers, objets divers,
   potions. Recherche, filtres, tirage au hasard et ajout direct à
   l'inventaire (ou aux armes / à l'armure) du personnage actif.
   Données : js/data/catalogue-compagnon.js.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Catalogue = (function () {
  var esc = COF.UI.esc;
  var etat = { groupe: 'tous', texte: '', niveau: 0, ouvert: {}, ajoutes: {}, tire: null };
  var cible = null;

  function liste() { return COF.CATALOGUE_COMPAGNON || []; }
  function cle(o) { return o.v + '|' + o.n; }

  /* Niveau requis exploitable pour le filtre : premier entier d'un niveau
     absolu (« 9 », « 3 / 6 / 9 »…) ; une propriété (« +3 ») n'est pas filtrée. */
  function niveauMin(o) {
    if (/^\+/.test(String(o.niv))) return null;
    var m = String(o.niv).match(/\d+/);
    return m ? parseInt(m[0], 10) : null;
  }
  /* Valeur en po d'un objet à prix unique (matières premières en pa / 10). */
  function valeurPo(o) {
    var s = String(o.prix);
    if (/^\+|%|\//.test(s)) return 0;
    var n = parseInt(s.replace(/\s/g, ''), 10);
    return isNaN(n) ? 0 : Math.max(1, Math.round(n / 10));
  }

  function filtres() {
    var t = etat.texte.trim().toLowerCase();
    return liste().filter(function (o) {
      if (etat.groupe !== 'tous' && o.g !== etat.groupe) return false;
      if (etat.niveau) { var n = niveauMin(o); if (n !== null && n > etat.niveau) return false; }
      if (t && (o.n + ' ' + o.v + ' ' + o.d).toLowerCase().indexOf(t) < 0) return false;
      return true;
    });
  }

  function versItem(o) {
    var note = o.d + ' (' + o.v + ', rang ' + o.r + ' · niveau de magie ' + o.nm + ' · niveau requis ' + o.niv + ').';
    var item = { nom: o.n, qte: 1, prix: valeurPo(o), note: note };
    if (o.def && o.slot) { item.def = o.def; item.slot = o.slot; }
    if (o.arme) {
      item.dm = o.arme.dm; item.armeType = 'contact'; item.noFor = !!o.arme.noFor;
      item.bonus = o.arme.bonusAuto ? 1 : 0; item.bonusAtt = o.arme.bonusAtt || 0;
      item.noteArme = o.n;
    }
    return item;
  }

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-catact]') : null;
      if (!t || !t.closest('#cat-compagnon')) return;
      var act = t.getAttribute('data-catact'), k = t.getAttribute('data-k');
      if (act === 'groupe') { etat.groupe = t.getAttribute('data-v'); etat.tire = null; }
      else if (act === 'ouvrir') { etat.ouvert[k] = !etat.ouvert[k]; }
      else if (act === 'hasard') {
        var l = filtres().filter(function (o) { return o.t !== 'propriété'; });
        etat.tire = l.length ? cle(COF.piocher(l)) : null;
        if (etat.tire) etat.ouvert[etat.tire] = true;
      }
      else if (act === 'ajouter') {
        var o = liste().filter(function (x) { return cle(x) === k; })[0];
        var perso = COF.Store.actif();
        if (o && perso) {
          COF.Store.ajouterObjet(perso, versItem(o));
          COF.Store.sauver(perso);
          etat.ajoutes[k] = (etat.ajoutes[k] || 0) + 1;
        }
      }
      else return;
      if (cible) rendre(cible);
    });
    document.addEventListener('input', function (e) {
      if (e.target.id !== 'cat-recherche') return;
      etat.texte = e.target.value;
      var zone = document.getElementById('cat-liste');
      if (zone) zone.innerHTML = rendreListe();
    });
    document.addEventListener('change', function (e) {
      if (e.target.id !== 'cat-niveau') return;
      etat.niveau = parseInt(e.target.value, 10) || 0;
      if (cible) rendre(cible);
    });
  }

  function carteObjet(o) {
    var k = cle(o), ouvert = !!etat.ouvert[k], perso = COF.Store.actif();
    var puces = '<span class="puce">rang ' + o.r + '</span>' +
      '<span class="puce">' + esc(o.t) + '</span>' +
      '<span class="puce">niv. ' + esc(String(o.niv)) + '</span>' +
      (o.nm !== 0 ? '<span class="puce">magie ' + esc(String(o.nm)) + '</span>' : '');
    var h = '<div class="ligne" style="align-items:flex-start;flex-wrap:wrap' + (etat.tire === k ? ';border-color:var(--or)' : '') + '">' +
      '<div class="info" style="flex:1;min-width:0;cursor:pointer" data-catact="ouvrir" data-k="' + esc(k) + '">' +
      '<div class="t">' + (etat.tire === k ? '🎲 ' : '') + esc(o.n) + ' ' + puces + '</div>' +
      '<div class="s">' + esc(ouvert ? o.d : (o.d.length > 110 ? o.d.slice(0, 110) + '…' : o.d)) + '</div>';
    if (ouvert) {
      h += '<div class="s" style="margin-top:4px;color:var(--text-mute)">' +
        esc('Matières premières : ' + o.prix + ' pa · Tests : ' + o.tests) + '</div>';
    }
    h += '</div>';
    if (o.t !== 'propriété') {
      h += '<div class="actions">' + (perso
        ? '<button class="btn btn-sm" data-catact="ajouter" data-k="' + esc(k) + '" title="Ajouter à ' + esc(perso.nom) + '">' +
          (etat.ajoutes[k] ? '✓' + (etat.ajoutes[k] > 1 ? '×' + etat.ajoutes[k] : '') : '📥') + '</button>'
        : '') + '</div>';
    }
    return h + '</div>';
  }

  function rendreListe() {
    var l = filtres();
    if (!l.length) return '<div class="vide">Aucun objet ne correspond.</div>';
    var h = '', voie = null;
    l.forEach(function (o) {
      if (o.v !== voie) {
        voie = o.v;
        h += '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:var(--or);margin:12px 0 4px">' + esc(voie) + '</div>';
      }
      h += carteObjet(o);
    });
    return h;
  }

  function rendre(node) {
    cible = node;
    var perso = COF.Store.actif();
    var groupes = [{ id: 'tous', nom: 'Tous' }].concat(COF.CATALOGUE_GROUPES);
    var h = '<div id="cat-compagnon"><div class="carte"><h2>Catalogue du Compagnon<span class="h2-action" data-catact="hasard">🎲 Au hasard</span></h2><div class="carte-corps">';
    h += '<div class="note" style="margin-bottom:10px">Tous les objets des <b>voies de recettes</b> du Compagnon du joueur (hors armes magiques, voir « Objets magiques → Arme magique »). ' +
      'Touchez un objet pour voir ses tests de fabrication ; 📥 l\'ajoute ' + (perso ? 'à <b>' + esc(perso.nom) + '</b>' : 'au personnage actif') +
      ' (armures, boucliers et armes sont directement équipables). Les « propriétés » s\'ajoutent à un objet de base et ne se prennent pas seules. ' +
      'Valeur = matières premières (pa) ÷ 10 en po.</div>';
    h += '<div class="chips" style="margin-bottom:10px">' + groupes.map(function (g) {
      var nb = g.id === 'tous' ? liste().length : liste().filter(function (o) { return o.g === g.id; }).length;
      return '<span class="chip ' + (etat.groupe === g.id ? 'on' : '') + '" data-catact="groupe" data-v="' + g.id + '">' + esc(g.nom) + ' (' + nb + ')</span>';
    }).join('') + '</div>';
    h += '<div class="grille2">' +
      '<div class="champ"><label>Recherche</label><input id="cat-recherche" placeholder="anneau, invisibilité, feu…" value="' + esc(etat.texte) + '"></div>' +
      '<div class="champ"><label>Niveau requis maximal</label><select id="cat-niveau">' +
        '<option value="0">Tous</option>' +
        [3, 5, 6, 7, 9, 12, 15, 18].map(function (n) {
          return '<option value="' + n + '"' + (etat.niveau === n ? ' selected' : '') + '>≤ ' + n + '</option>';
        }).join('') +
        (perso ? '<option value="' + perso.niveau + '"' + (etat.niveau === perso.niveau ? ' selected' : '') + '>Niveau de ' + esc(perso.nom) + ' (' + perso.niveau + ')</option>' : '') +
      '</select></div></div>';
    var tire = etat.tire && liste().filter(function (o) { return cle(o) === etat.tire; })[0];
    if (tire) {
      h += '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:var(--or);margin:4px 0">🎲 Tirage — ' + esc(tire.v) + '</div>' +
        carteObjet(tire);
    }
    h += '<div id="cat-liste">' + rendreListe() + '</div>';
    h += '</div></div></div>';
    node.innerHTML = h;
  }

  return { init: init, rendre: rendre };
})();
