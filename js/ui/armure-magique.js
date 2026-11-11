/* ============================================================
   COF2 Compagnon — Atelier d'armure / bouclier magique
   Catégorie « Armure / bouclier magique » du générateur d'objets
   magiques, fondée sur les voies de recettes d'armures du Compagnon
   du joueur (cuir, mailles, plaques, boucliers) : famille, pièce,
   base (qualité ou +1 à +5) et propriétés ; l'appli calcule niveau
   de magie, niveau requis, valeur, tests et effets, puis ajoute la
   pièce prête à équiper au personnage actif.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.ArmureMagique = (function () {
  var esc = COF.UI.esc;
  var K = COF.ArmureMagiqueCalc;
  var o = null, niveauMax = null, cible = null;

  function niveauParDefaut() { var p = COF.Store.actif(); return p ? (p.niveau || 1) : 5; }
  function tirer() { o = K.generer(niveauMax); o.ajoute = false; }
  function assurer() {
    if (niveauMax === null) niveauMax = niveauParDefaut();
    if (!o) tirer();
  }
  function nettoyer() {
    var fa = K.famille(o.famille);
    if (fa.types.indexOf(o.piece) < 0) o.piece = fa.types[0];
    o.props = (o.bonus >= 1) ? o.props.filter(function (p) { return !!K.prop(o, p.id); }) : [];
    o.ajoute = false;
  }

  function init() {
    document.addEventListener('change', function (e) {
      var t = e.target;
      if (!t.closest || !t.closest('#om-armure')) return;
      var id = t.id, p = t.getAttribute('data-p');
      if (id === 'amr-niv') { niveauMax = Math.max(1, Math.min(20, parseInt(t.value, 10) || 1)); }
      else if (id === 'amr-fam') { o.famille = t.value; o.piece = K.famille(t.value).types[0]; o.props = []; nettoyer(); o.nom = K.nomPour(o); }
      else if (id === 'amr-piece') { o.piece = t.value; nettoyer(); o.nom = K.nomPour(o); }
      else if (id === 'amr-base') {
        var avant = o.bonus >= 1;
        o.bonus = t.value === 'q' ? 0 : parseInt(t.value, 10);
        nettoyer();
        if (avant !== (o.bonus >= 1)) o.nom = K.nomPour(o);
      }
      else if (id === 'amr-nom') { o.nom = t.value; o.ajoute = false; return; }
      else if (t.classList.contains('amr-chk') && p) {
        if (t.checked) o.props.push({ id: p, choix: K.choixAleatoire(o, p) });
        else o.props = o.props.filter(function (x) { return x.id !== p; });
        o.ajoute = false;
      }
      else if (t.classList.contains('amr-choix') && p) {
        o.props.forEach(function (x) { if (x.id === p) x.choix = t.value; });
        o.ajoute = false;
      }
      else return;
      if (cible) rendre(cible);
    });
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-amract]') : null;
      if (!t || !t.closest('#om-armure')) return;
      e.preventDefault();
      var act = t.getAttribute('data-amract');
      if (act === 'tirage') tirer();
      else if (act === 'nom') { o.nom = K.nomPour(o); o.ajoute = false; }
      else if (act === 'maudit') { o.maudit = COF.piocher(COF.OM_MALEDICTIONS); o.nom = K.nomPour(o); o.ajoute = false; }
      else if (act === 'sain') { o.maudit = null; o.nom = K.nomPour(o); o.ajoute = false; }
      else if (act === 'origine') { o.origine = COF.ObjetsMagiquesCalc.genererOrigine(); o.ajoute = false; }
      else if (act === 'niv-perso') { niveauMax = niveauParDefaut(); }
      else if (act === 'ajouter') {
        var perso = COF.Store.actif();
        if (perso && !o.ajoute) {
          COF.Store.ajouterObjet(perso, K.versItem(o));
          COF.Store.sauver(perso);
          o.ajoute = true;
        }
      }
      if (cible) rendre(cible);
    });
  }

  function options(liste, val) {
    return liste.map(function (x) {
      return '<option value="' + esc(String(x[0])) + '"' + (String(x[0]) === String(val) ? ' selected' : '') + '>' + esc(x[1]) + '</option>';
    }).join('');
  }

  function blocProprietes() {
    var fa = K.famille(o.famille);
    var dejaTrop = K.calcul(o).niveau > niveauMax;
    return fa.props.map(function (p) {
      var coche = K.aProp(o, p.id);
      var bloc = coche ? null : K.blocage(o, p.id);
      var trop = !coche && !bloc && !dejaTrop &&
        K.calcul({ famille: o.famille, piece: o.piece, bonus: o.bonus, props: o.props.concat([{ id: p.id }]) }).niveau > niveauMax;
      var meta = 'rang ' + p.rang + ' · magie +' + p.nm + ' · niveau +' + p.niv + ' · +' + p.prix.toLocaleString('fr-FR') + ' pa';
      var h = '<div class="ligne" style="align-items:flex-start' + (bloc ? ';opacity:.55' : '') + '">' +
        '<input type="checkbox" class="amr-chk" data-p="' + p.id + '"' + (coche ? ' checked' : '') + (bloc ? ' disabled' : '') +
          ' style="margin:4px 10px 0 2px;width:18px;height:18px;flex:none">' +
        '<div class="info"><div class="t">' + esc(p.nom) + ' <span class="puce">' + esc(meta) + '</span>' +
          (trop ? ' <span class="puce" style="color:var(--sang-clair)">au-delà du niveau du trésor</span>' : '') + '</div>' +
        '<div class="s">' + esc(bloc || p.texte || (p.choix ? 'Au choix : ' + p.choix.join(', ') + '.' : '')) + '</div>';
      if (coche && p.choix) {
        var pc = o.props.filter(function (x) { return x.id === p.id; })[0];
        h += '<select class="amr-choix" data-p="' + p.id + '" style="margin-top:6px">' +
          options(p.choix.map(function (c) { return [c, c]; }), pc.choix) + '</select>';
      }
      return h + '</div></div>';
    }).join('');
  }

  function rendre(node) {
    cible = node;
    assurer();
    var fa = K.famille(o.famille), r = K.calcul(o), perso = COF.Store.actif();

    var bases = [['q', 'Qualité (niveau 1, ' + (o.piece === 'plaquecomp' ? 200 : fa.qualite.prix) + ' pa)']];
    COF.AR_BASE.niveau.forEach(function (n, i) {
      bases.push([i + 1, 'Magique +' + (i + 1) + ' (niveau ' + n + ', ' + COF.AR_BASE.prix[i].toLocaleString('fr-FR') + ' pa)']);
    });

    var h = '<div class="carte"><h2>Atelier d’armure magique<span class="h2-action" data-amract="tirage">🎲 Tirage</span></h2><div class="carte-corps">';
    h += '<div class="note" style="margin-bottom:10px">Fondé sur les <b>voies de recettes d’armures</b> du Compagnon du joueur : ' +
      'cuir, mailles, plaques et boucliers ont chacun leur voie, leur base (qualité ou +1 à +5) et leurs propriétés. ' +
      'Le tirage ne dépasse jamais le <b>niveau du trésor</b>. Tout reste modifiable à la main.</div>';
    h += '<div class="grille2">' +
      '<div class="champ"><label>Niveau du trésor</label><input id="amr-niv" type="number" min="1" max="20" value="' + niveauMax + '">' +
        (perso ? '<div class="aide"><a href="#" data-amract="niv-perso">Niveau de ' + esc(perso.nom) + ' (' + perso.niveau + ')</a></div>' : '') + '</div>' +
      '<div class="champ"><label>Voie de recettes</label><select id="amr-fam">' +
        options(COF.AR_ARMURES.map(function (x) { return [x.id, x.nom]; }), o.famille) + '</select></div>' +
      '</div>';
    h += '<div class="grille2">' +
      '<div class="champ"><label>Pièce</label><select id="amr-piece">' +
        options(fa.types.map(function (id) { var pi = K.piece(id); return [id, pi.nom + ' (DEF ' + COF.UI.sgn(pi.def) + ')']; }), o.piece) + '</select></div>' +
      '<div class="champ"><label>Base</label><select id="amr-base">' + options(bases, o.bonus >= 1 ? o.bonus : 'q') + '</select></div>' +
      '</div>';
    if (fa.noteTests) h += '<div class="note" style="margin-bottom:6px">' + esc(fa.noteTests) + '</div>';
    h += '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:var(--text-mute);margin:6px 0 4px">Propriétés — ' + esc(fa.voie) + '</div>';
    h += blocProprietes();
    h += '</div></div>';

    var hors = r.niveau > niveauMax;
    h += '<div class="carte"><h2>' + esc(o.nom || '') + '<span class="h2-action" data-amract="nom">↻ Nom</span></h2><div class="carte-corps">';
    h += '<div class="champ"><label>Nom</label><input id="amr-nom" value="' + esc(o.nom || '') + '"></div>';
    h += '<div class="stats">' +
      '<div class="stat"><div class="lbl">DEF</div><div class="v">' + COF.UI.sgn(r.def) + '</div></div>' +
      '<div class="stat"><div class="lbl">Niveau de magie</div><div class="v">' + r.nm + '</div></div>' +
      '<div class="stat"><div class="lbl">Niveau requis</div><div class="v" style="color:' + (hors ? 'var(--sang-clair)' : 'var(--or-clair)') + '">' + r.niveau + '</div></div>' +
      '<div class="stat"><div class="lbl">Valeur</div><div class="v">' + r.valeurPo.toLocaleString('fr-FR') + ' po</div></div>' +
      '</div>';
    if (hors) h += '<div class="note" style="color:var(--sang-clair);margin-top:6px">Cette pièce dépasse le niveau du trésor (' + niveauMax + ').</div>';
    h += '<div class="ligne"><div class="info"><div class="t">Effets</div><div class="s">' + r.effets.map(esc).join('<br>') + '</div></div></div>';
    h += '<div class="ligne"><div class="info"><div class="t">Fabrication (' + esc(fa.voie) + ')</div><div class="s">' +
      esc('Matières premières : ' + r.prix.toLocaleString('fr-FR') + ' pa · ' + r.joursAtelier + ' jours en atelier (' +
        Math.max(1, Math.ceil(r.joursAtelier / 10)) + ' en fabrication rapide) · Tests : ') + r.tests.map(esc).join(' ; ') + '</div></div></div>';
    h += '<div class="ligne"><div class="info"><div class="t">Malédiction</div><div class="s">' + esc(o.maudit || 'Aucune — objet sain') + '</div></div>' +
      '<div class="actions"><button class="btn btn-sm" data-amract="maudit" title="Tirer une malédiction">☠</button>' +
      (o.maudit ? '<button class="btn btn-sm" data-amract="sain" title="Retirer">✕</button>' : '') + '</div></div>';
    h += '<div class="ligne"><div class="info"><div class="t">Origine</div><div class="s">' +
      esc(o.origine ? o.origine.provenance + ' · ' + o.origine.epoque + ' · ' + o.origine.peuple : '—') + '</div></div>' +
      '<div class="actions"><button class="btn btn-sm" data-amract="origine">↻</button></div></div>';

    h += '<div style="margin-top:10px">';
    if (!perso) h += '<div class="note">Aucun personnage actif : ouvrez-en un depuis « Persos » pour lui donner cette pièce.</div>';
    else if (o.ajoute) h += '<button class="btn btn-bloc" disabled style="opacity:.6">✓ Ajoutée à ' + esc(perso.nom) + '</button>';
    else h += '<button class="btn btn-plein btn-bloc" data-amract="ajouter">📥 Ajouter à ' + esc(perso.nom) + '</button>';
    h += '<button class="btn btn-bloc" style="margin-top:8px" data-amract="tirage">🎲 Nouvelle pièce (niveau ' + niveauMax + ')</button>';
    h += '</div></div></div>';
    node.innerHTML = h;
  }

  return { init: init, rendre: rendre };
})();
