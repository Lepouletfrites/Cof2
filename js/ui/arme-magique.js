/* ============================================================
   COF2 Compagnon — Atelier d'arme magique (générateur de trésor)
   Catégorie « Arme magique » du générateur d'objets magiques,
   refondue sur les voies de recettes d'armes du Compagnon du
   joueur : on choisit (ou tire au sort) la famille, l'arme, la base
   (qualité ou +1 à +5) et les propriétés ; l'appli calcule niveau
   de magie, niveau requis, valeur, tests d'artisanat et effets, puis
   ajoute l'arme toute prête aux armes du personnage actif.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.ArmeMagique = (function () {
  var esc = COF.UI.esc, sgn = COF.UI.sgn;
  var K = COF.ArmeMagiqueCalc;
  var o = null;            // arme en cours de conception
  var niveauMax = null;    // niveau du trésor (borne le niveau requis)
  var cible = null;

  function niveauParDefaut() {
    var p = COF.Store.actif();
    return p ? (p.niveau || 1) : 5;
  }
  function tirer() {
    o = K.generer(niveauMax);
    o.ajoute = false;
  }
  function assurer() {
    if (niveauMax === null) niveauMax = niveauParDefaut();
    if (!o) tirer();
  }

  /* Retire les propriétés devenues impossibles (changement d'arme/base). */
  function nettoyer() {
    var dispo = K.propsDispo(o);
    o.props = o.props.filter(function (p) { return dispo.indexOf(p.id) >= 0; });
    if (!(o.bonus >= 1)) o.props = [];
    if (K.aProp(o, 'maudite')) { o.props = [{ id: 'maudite', choix: null }]; o.bonus = 3; }
    o.ajoute = false;
  }

  function init() {
    document.addEventListener('change', function (e) {
      var t = e.target;
      if (!t.closest || !t.closest('#om-arme')) return;
      var id = t.id, p = t.getAttribute('data-p');
      if (id === 'am-niv') { niveauMax = Math.max(1, Math.min(20, parseInt(t.value, 10) || 1)); }
      else if (id === 'am-fam') { o.famille = t.value; o.arme = K.famille(t.value).armes[0]; o.nom = K.nomPour(o); nettoyer(); }
      else if (id === 'am-arme') { o.arme = t.value; o.nom = K.nomPour(o); nettoyer(); }
      else if (id === 'am-base') {
        if (t.value === 'q' || t.value === 'm') { o.bonus = 0; o.qualite = t.value === 'm' ? 'misericorde' : 'standard'; }
        else o.bonus = parseInt(t.value, 10);
        nettoyer();
      }
      else if (id === 'am-nom') { o.nom = t.value; o.ajoute = false; return; }
      else if (t.classList.contains('am-chk') && p) {
        if (t.checked) {
          o.props.push({ id: p, choix: K.choixAleatoire(p) });
          if (p === 'maudite') o.bonus = 3;
        } else {
          o.props = o.props.filter(function (x) { return x.id !== p; });
        }
        o.ajoute = false;
      }
      else if (t.classList.contains('am-choix') && p) {
        o.props.forEach(function (x) { if (x.id === p) x.choix = t.value; });
        o.ajoute = false;
      }
      else return;
      if (cible) rendre(cible);
    });
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-amact]') : null;
      if (!t || !t.closest('#om-arme')) return;
      e.preventDefault();
      var act = t.getAttribute('data-amact');
      if (act === 'tirage') tirer();
      else if (act === 'nom') { o.nom = K.nomPour(o); o.ajoute = false; }
      else if (act === 'maudit') { o.maudit = COF.piocher(COF.OM_MALEDICTIONS); o.ajoute = false; }
      else if (act === 'sain') { o.maudit = null; o.ajoute = false; }
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

  /* ---------- Rendu ---------- */
  function options(liste, val) {
    return liste.map(function (x) {
      return '<option value="' + esc(String(x[0])) + '"' + (String(x[0]) === String(val) ? ' selected' : '') + '>' + esc(x[1]) + '</option>';
    }).join('');
  }

  function blocProprietes() {
    var dispo = K.propsDispo(o);
    if (!dispo.length) return '<div class="vide">Aucune propriété pour cette arme.</div>';
    var dejaTrop = K.calcul(o).niveau > niveauMax;
    return dispo.map(function (id) {
      var p = K.prop(id);
      var coche = K.aProp(o, id);
      var bloc = coche ? null : K.blocage(o, id);
      var trop = !coche && !bloc && !dejaTrop && K.calcul({ famille: o.famille, arme: o.arme, bonus: o.bonus, qualite: o.qualite,
        props: o.props.concat([{ id: id }]) }).niveau > niveauMax;
      var meta = 'rang ' + p.rang + ' · magie +' + p.nm +
        (p.nivMin ? ' · niveau ' + p.nivMin + ' min.' : (p.niv ? ' · niveau +' + p.niv : '')) +
        (p.prix ? ' · +' + p.prix.toLocaleString('fr-FR') + ' pa' : '');
      var h = '<div class="ligne" style="align-items:flex-start' + (bloc ? ';opacity:.55' : '') + '">' +
        '<input type="checkbox" class="am-chk" data-p="' + id + '"' + (coche ? ' checked' : '') + (bloc ? ' disabled' : '') +
          ' style="margin:4px 10px 0 2px;width:18px;height:18px;flex:none">' +
        '<div class="info"><div class="t">' + esc(p.nom) +
          ' <span class="puce">' + esc(meta) + '</span>' +
          (trop ? ' <span class="puce" style="color:var(--sang-clair)">au-delà du niveau du trésor</span>' : '') + '</div>' +
        '<div class="s">' + esc(bloc || p.texte) + '</div>';
      if (coche && p.choix) {
        var pc = o.props.filter(function (x) { return x.id === id; })[0];
        var liste = p.choix === 'element' ? COF.AR_ELEMENTS.map(function (e) { return [e.id, e.nom + ' (' + e.gemme + ')']; })
          : p.choix === 'fleau' ? COF.AR_FLEAUX.map(function (f) { return [f, f]; })
          : p.variantes.map(function (v) { return [v.id, v.nom]; });
        h += '<select class="am-choix" data-p="' + id + '" style="margin-top:6px">' + options(liste, pc.choix) + '</select>';
      }
      return h + '</div></div>';
    }).join('');
  }

  function rendre(node) {
    cible = node;
    assurer();
    var f = K.famille(o.famille), a = K.arme(o.arme) || {};
    var r = K.calcul(o);
    var perso = COF.Store.actif();
    var maudite = K.aProp(o, 'maudite');

    var bases = [['q', 'Qualité (niveau 1, ' + f.qualite.prix + ' pa)']];
    if (o.arme === 'dague') bases.push(['m', 'Miséricorde (niveau 1, ' + COF.AR_MISERICORDE.prix + ' pa)']);
    COF.AR_BASE.niveau.forEach(function (n, i) {
      bases.push([i + 1, 'Magique +' + (i + 1) + ' (niveau ' + n + ', ' + COF.AR_BASE.prix[i].toLocaleString('fr-FR') + ' pa)']);
    });
    var baseVal = o.bonus >= 1 ? o.bonus : (o.qualite === 'misericorde' && o.arme === 'dague' ? 'm' : 'q');

    var h = '<div class="carte"><h2>Atelier d’arme magique<span class="h2-action" data-amact="tirage">🎲 Tirage</span></h2><div class="carte-corps">';
    h += '<div class="note" style="margin-bottom:10px">Fondé sur les <b>voies de recettes d’armes</b> du Compagnon du joueur : ' +
      'chaque famille d’armes a sa voie, sa base (qualité ou +1 à +5) et ses propriétés. Le tirage aléatoire ne dépasse jamais le ' +
      '<b>niveau du trésor</b> (niveau requis pour fabriquer l’arme). Tout reste modifiable à la main.</div>';
    h += '<div class="grille2">' +
      '<div class="champ"><label>Niveau du trésor</label><input id="am-niv" type="number" min="1" max="20" value="' + niveauMax + '">' +
        (perso ? '<div class="aide"><a href="#" data-amact="niv-perso">Niveau de ' + esc(perso.nom) + ' (' + perso.niveau + ')</a></div>' : '') + '</div>' +
      '<div class="champ"><label>Voie de recettes</label><select id="am-fam">' +
        options(COF.AR_FAMILLES.map(function (x) { return [x.id, x.nom]; }), o.famille) + '</select></div>' +
      '</div>';
    h += '<div class="grille2">' +
      '<div class="champ"><label>Arme</label><select id="am-arme">' +
        options(f.armes.map(function (id) { var w = K.arme(id) || { nom: id }; return [id, w.nom + ' (' + w.dm + (w.dm2 ? '/' + w.dm2 : '') + ')']; }), o.arme) +
        '</select></div>' +
      '<div class="champ"><label>Base</label><select id="am-base"' + (maudite ? ' disabled' : '') + '>' + options(bases, baseVal) + '</select></div>' +
      '</div>';
    h += '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:var(--text-mute);margin:6px 0 4px">Propriétés — ' + esc(f.voie) + '</div>';
    h += blocProprietes();
    h += '</div></div>';

    /* ---- Fiche de l'arme ---- */
    var horsNiveau = r.niveau > niveauMax;
    var attTxt = r.bonusAtt ? sgn(r.bonusAtt) + ' att.' : '';
    var dmTxt = (a.dm || '?') + (r.dm2 ? '/' + r.dm2 : '') + (r.bonusDm ? ' ' + sgn(r.bonusDm) : '') +
      r.elementaires.map(function (e) { return ' +' + e.formule + ' ' + e.label; }).join('') +
      r.ajoutDm.map(function (c) { return ' +' + c; }).join('');
    h += '<div class="carte"><h2>' + esc(o.nom || a.nom) + '<span class="h2-action" data-amact="nom">↻ Nom</span></h2><div class="carte-corps">';
    h += '<div class="champ"><label>Nom</label><input id="am-nom" value="' + esc(o.nom || '') + '"></div>';
    h += '<div class="stats">' +
      '<div class="stat"><div class="lbl">Niveau de magie</div><div class="v">' + r.nm + '</div></div>' +
      '<div class="stat"><div class="lbl">Niveau requis</div><div class="v" style="color:' + (horsNiveau ? 'var(--sang-clair)' : 'var(--or-clair)') + '">' + r.niveau + '</div></div>' +
      '<div class="stat"><div class="lbl">Valeur</div><div class="v">' + r.valeurPo.toLocaleString('fr-FR') + ' po</div></div>' +
      '</div>';
    if (horsNiveau) h += '<div class="note" style="color:var(--sang-clair);margin-top:6px">Cette arme dépasse le niveau du trésor (' + niveauMax + ').</div>';

    h += '<div class="ligne"><div class="info"><div class="t">En jeu</div><div class="s">' +
      esc(a.nom + ' · DM ' + dmTxt + (attTxt ? ' · ' + attTxt : '') + (r.bonusDef ? ' · ' + sgn(r.bonusDef) + ' DEF (parade)' : '') +
        ' · critique ' + (r.crit < 20 ? r.crit + '-20' : '20') + (r.portee ? ' · portée ' + r.portee + ' m' : '')) + '</div></div></div>';
    if (r.effets.length) {
      h += '<div class="ligne"><div class="info"><div class="t">Propriétés</div><div class="s">' +
        r.effets.map(esc).join('<br>') + '</div></div></div>';
    }
    h += '<div class="ligne"><div class="info"><div class="t">Fabrication (' + esc(f.voie) + ')</div><div class="s">' +
      esc('Matières premières : ' + r.prix.toLocaleString('fr-FR') + ' pa · ' + r.joursAtelier + ' jours en atelier (' +
        Math.max(1, Math.ceil(r.joursAtelier / 10)) + ' en fabrication rapide) · Tests : ') +
      r.tests.map(esc).join(' ; ') + '</div></div></div>';
    h += '<div class="ligne"><div class="info"><div class="t">Malédiction</div><div class="s">' + esc(o.maudit || 'Aucune — objet sain') + '</div></div>' +
      '<div class="actions"><button class="btn btn-sm" data-amact="maudit" title="Tirer une malédiction">☠</button>' +
      (o.maudit ? '<button class="btn btn-sm" data-amact="sain" title="Retirer">✕</button>' : '') + '</div></div>';
    h += '<div class="ligne"><div class="info"><div class="t">Origine</div><div class="s">' +
      esc(o.origine ? o.origine.provenance + ' · ' + o.origine.epoque + ' · ' + o.origine.peuple : '—') + '</div></div>' +
      '<div class="actions"><button class="btn btn-sm" data-amact="origine">↻</button></div></div>';

    h += '<div style="margin-top:10px">';
    if (!perso) h += '<div class="note">Aucun personnage actif : ouvrez-en un depuis « Persos » pour lui donner cette arme.</div>';
    else if (o.ajoute) h += '<button class="btn btn-bloc" disabled style="opacity:.6">✓ Ajoutée aux armes de ' + esc(perso.nom) + '</button>';
    else h += '<button class="btn btn-plein btn-bloc" data-amact="ajouter">📥 Ajouter aux armes de ' + esc(perso.nom) + '</button>';
    h += '<button class="btn btn-bloc" style="margin-top:8px" data-amact="tirage">🎲 Nouvelle arme (niveau ' + niveauMax + ')</button>';
    h += '</div></div></div>';

    node.innerHTML = h;
  }

  return { init: init, rendre: rendre };
})();
