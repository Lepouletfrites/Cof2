/* ============================================================
   COF2 Compagnon — Générateur de butin (sous-onglet de Générateurs)
   Trois sources : la dernière rencontre générée, une fouille (petite
   trouvaille en explorant un lieu) ou un coffre / trésor accumulé.
   Chaque ligne de butin peut être transférée directement vers la
   bourse ou l'inventaire du personnage actif.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Butin = (function () {
  var $ = COF.UI.$, $$ = COF.UI.$$, esc = COF.UI.esc;

  var MODE = 'rencontre';   // 'rencontre' | 'fouille' | 'coffre'
  var P = { env: 'foret', niveau: 1, richesse: 'standard' };
  var butin = null;
  var cible = null;

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-bact]') : null;
      if (!t || !(t.closest('#vue-generateurs') || t.closest('#modale'))) return;
      actions(t.getAttribute('data-bact'), t);
    });
    document.addEventListener('change', function (e) {
      var t = e.target;
      if (!t.getAttribute || t.getAttribute('data-bact') !== 'richesse') return;
      if (!t.closest('#vue-generateurs')) return;
      actions('richesse', t);
    });
    var p = COF.Store.actif();
    if (p) P.niveau = p.niveau || 1;
  }

  /* ---------- Rendu ---------- */
  function rendre(node) {
    cible = node;
    var h = '';
    h += '<div class="carte"><h2>Générateur de butin</h2><div class="carte-corps">';
    h += '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:var(--text-mute);margin-bottom:5px">Source</div>';
    h += '<div class="chips" style="margin-bottom:12px">' +
      '<span class="chip ' + (MODE === 'rencontre' ? 'on' : '') + '" data-bact="mode" data-v="rencontre">⚔️ Rencontre</span>' +
      '<span class="chip ' + (MODE === 'fouille' ? 'on' : '') + '" data-bact="mode" data-v="fouille">🔍 Fouille</span>' +
      '<span class="chip ' + (MODE === 'coffre' ? 'on' : '') + '" data-bact="mode" data-v="coffre">🗝️ Coffre</span>' +
      '</div>';

    if (MODE === 'rencontre') h += htmlParamsRencontre();
    else h += htmlParamsGenerique();

    h += '</div></div>';
    h += '<div id="butin-resultat">' + (butin ? htmlButin(butin) : '') + '</div>';
    node.innerHTML = h;
  }

  function htmlParamsRencontre() {
    var dernier = COF.UI.Generateurs.dernierResultat();
    var h = '<div class="note" style="margin-bottom:10px">Reprend l\'environnement, le niveau, la difficulté ' +
      'et la composition de la dernière rencontre générée dans l\'onglet Rencontre.</div>';
    h += '<button class="btn btn-plein btn-bloc" data-bact="generer"' +
      (dernier && !dernier.erreur ? '' : ' disabled style="opacity:.5"') + '>💰 Générer le butin</button>';
    if (!dernier || dernier.erreur) {
      h += '<div class="note" style="margin-top:8px">Générez d\'abord une rencontre dans le sous-onglet Rencontre.</div>';
    }
    return h;
  }

  function htmlParamsGenerique() {
    var h = '';
    h += '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:var(--text-mute);margin-bottom:5px">Environnement</div>';
    h += '<div class="chips" style="margin-bottom:12px">';
    COF.ENVIRONNEMENTS.forEach(function (e) {
      h += '<span class="chip ' + (P.env === e.id ? 'on' : '') + '" data-bact="env" data-v="' + e.id + '">' +
        e.ic + ' ' + esc(e.nom) + '</span>';
    });
    h += '</div>';

    h += '<div class="grille2" style="margin-bottom:12px">';
    h += '<div class="champ"><label>Niveau du groupe</label>' +
      '<div class="compteur" style="justify-content:center">' +
      '<button data-bact="niv-">−</button><span class="n">' + P.niveau + '</span><button data-bact="niv+">+</button>' +
      '</div></div>';
    h += '<div class="champ"><label>Richesse</label><select data-bact="richesse" style="width:100%">' +
      Object.keys(COF.RICHESSE_TIERS).map(function (k) {
        return '<option value="' + k + '"' + (P.richesse === k ? ' selected' : '') + '>' + esc(COF.RICHESSE_TIERS[k].nom) + '</option>';
      }).join('') + '</select></div>';
    h += '</div>';

    h += '<div class="note" style="margin-bottom:12px">' + (MODE === 'fouille' ?
      'Une petite trouvaille en explorant un lieu : peu de pièces, un ou deux objets, un objet magique très rare.' :
      'Un trésor accumulé — coffre, cache, repaire : plus de pièces, des objets de valeur, et une vraie chance d\'objet magique.') + '</div>';

    h += '<button class="btn btn-plein btn-bloc" data-bact="generer">' +
      (MODE === 'fouille' ? '🔍 Générer la trouvaille' : '🗝️ Générer le trésor') + '</button>';
    return h;
  }

  /* ---------- Affichage du butin ---------- */
  function btnAjouter(gact, idx, ajoute, perso) {
    if (!perso) return '';
    if (ajoute) return '<button class="btn btn-sm" disabled style="opacity:.6">✓ Ajouté</button>';
    return '<button class="btn btn-sm btn-or" data-bact="' + gact + '"' +
      (idx !== undefined ? ' data-idx="' + idx + '"' : '') + '>+ Ajouter</button>';
  }

  function htmlObjetMagique(l, cle, titre, perso) {
    var m = l[cle];
    if (!m) return '';
    return '<div class="carte" style="margin-top:12px;border-color:var(--or)"><div class="carte-corps">' +
      '<div class="ligne" style="padding:0">' +
      '<div class="info"><div class="t" style="color:var(--or-clair);font-size:16px;margin-bottom:4px">✨ ' +
        esc(m.nom) + '</div><div class="s">' + esc(m.desc) + '</div></div>' +
      '<div class="actions">' + btnAjouter(cle === 'magique' ? 'loot-magique' : 'loot-magique2', undefined, m.ajoute, perso) + '</div>' +
      '</div></div></div>';
  }

  function htmlButin(l) {
    if (!l) return '<div class="vide">Aucun butin généré.</div>';
    var perso = COF.Store.actif();
    var h = '<div class="carte"><div class="carte-corps">';

    if (!perso) h += '<div class="note" style="margin-bottom:10px">Aucun personnage actif : ' +
      'ouvrez-en un depuis « Persos » pour pouvoir récupérer ce butin.</div>';

    h += '<div class="ligne" style="margin-bottom:6px">' +
      '<div class="info"><div class="t">Pièces</div>' +
      '<div class="s">' + l.po + ' po · ' + l.pa + ' pa · ' + l.pc + ' pc</div></div>' +
      '<div class="actions">' + btnAjouter('loot-argent', undefined, l.argentAjoute, perso) + '</div>' +
      '</div>';

    if (l.objets.length) {
      h += '<div class="note" style="margin:10px 0 4px">Objets</div>';
      l.objets.forEach(function (o, i) {
        h += '<div class="ligne"><div class="info"><div class="t">' + esc(o.nom) +
          (o.prix ? ' <span class="puce">' + o.prix + ' po</span>' : '') + '</div>' +
          (o.note ? '<div class="s">' + esc(o.note) + '</div>' : '') + '</div>' +
          '<div class="actions">' + btnAjouter('loot-objet', i, o.ajoute, perso) + '</div>' +
          '</div>';
      });
    }

    if (l.composants.length) {
      h += '<div class="note" style="margin:10px 0 4px">Trophées & composants</div>';
      l.composants.forEach(function (c, i) {
        h += '<div class="ligne"><div class="info"><div class="t">' + esc(c.nom) +
          (c.nb > 1 ? ' <span class="puce">×' + c.nb + '</span>' : '') +
          (c.prix ? ' <span class="puce">' + c.prix + ' po/u.</span>' : '') + '</div></div>' +
          '<div class="actions">' + btnAjouter('loot-composant', i, c.ajoute, perso) + '</div>' +
          '</div>';
      });
    }

    if (l.tresors.length) {
      h += '<div class="note" style="margin:10px 0 4px">Objets de valeur</div>';
      l.tresors.forEach(function (t, i) {
        h += '<div class="ligne"><div class="info"><div class="t">' + esc(t.nom) +
          (t.prix ? ' <span class="puce">' + t.prix + ' po</span>' : '') + '</div></div>' +
          '<div class="actions">' + btnAjouter('loot-tresor', i, t.ajoute, perso) + '</div>' +
          '</div>';
      });
    }

    h += htmlObjetMagique(l, 'magique', 'Objet magique', perso);
    h += htmlObjetMagique(l, 'magique2', 'Second objet magique', perso);
    if (!l.magique) h += '<div class="note" style="margin-top:12px">Aucun objet magique cette fois — la chance viendra.</div>';

    if (perso) h += '<button class="btn btn-plein btn-bloc" style="margin-top:14px" data-bact="loot-tout">' +
      '📥 Tout ajouter à ' + esc(perso.nom) + '</button>';
    h += '<button class="btn btn-bloc" style="margin-top:8px" data-bact="generer">↻ Relancer</button>';
    h += '</div></div>';
    return h;
  }

  /* ---------- Transfert vers un personnage ---------- */
  function marquerArgent(l, perso) {
    if (l.argentAjoute) return;
    perso.bourse.po = (perso.bourse.po || 0) + l.po;
    perso.bourse.pa = (perso.bourse.pa || 0) + l.pa;
    perso.bourse.pc = (perso.bourse.pc || 0) + l.pc;
    l.argentAjoute = true;
  }
  function marquerListe(liste, i, perso, qte) {
    var it = liste[i];
    if (!it || it.ajoute) return;
    COF.Store.ajouterObjet(perso, {
      nom: it.nom, qte: qte || 1, note: it.note, prix: it.prix,
      dm: it.dm, armeType: it.armeType, noFor: it.noFor
    });
    it.ajoute = true;
  }
  function marquerMagique(l, cle, perso) {
    var m = l[cle];
    if (!m || m.ajoute) return;
    COF.Store.ajouterObjet(perso, {
      nom: '✨ ' + m.nom, qte: 1, note: m.desc, dm: m.dm, armeType: m.armeType, def: m.def
    });
    m.ajoute = true;
  }

  function rafraichir() {
    var el = $('#butin-resultat');
    if (el) el.innerHTML = butin ? htmlButin(butin) : '';
  }

  /* ---------- Actions ---------- */
  function actions(act, node) {
    switch (act) {
      case 'mode': MODE = node.getAttribute('data-v'); butin = null; rendre(cible); break;
      case 'env': P.env = node.getAttribute('data-v'); rendre(cible); break;
      case 'niv+': P.niveau = Math.min(20, P.niveau + 1); rendre(cible); break;
      case 'niv-': P.niveau = Math.max(1, P.niveau - 1); rendre(cible); break;
      case 'richesse': P.richesse = node.value; break;
      case 'generer': {
        if (MODE === 'rencontre') {
          var r = COF.UI.Generateurs.dernierResultat();
          butin = (r && !r.erreur) ? COF.Recompense.generer(r) : null;
        } else if (MODE === 'fouille') {
          butin = COF.Recompense.genererFouille(P);
        } else {
          butin = COF.Recompense.genererCoffre(P);
        }
        rendre(cible);
        var el = $('#butin-resultat');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      }
      case 'loot-argent': {
        var p1 = COF.Store.actif();
        if (butin && p1) { marquerArgent(butin, p1); COF.Store.sauver(p1); rafraichir(); }
        break;
      }
      case 'loot-objet': {
        var p2 = COF.Store.actif();
        if (butin && p2) { marquerListe(butin.objets, +node.getAttribute('data-idx'), p2); COF.Store.sauver(p2); rafraichir(); }
        break;
      }
      case 'loot-composant': {
        var p3 = COF.Store.actif();
        if (butin && p3) {
          var i3 = +node.getAttribute('data-idx');
          marquerListe(butin.composants, i3, p3, butin.composants[i3] && butin.composants[i3].nb);
          COF.Store.sauver(p3); rafraichir();
        }
        break;
      }
      case 'loot-tresor': {
        var p4 = COF.Store.actif();
        if (butin && p4) { marquerListe(butin.tresors, +node.getAttribute('data-idx'), p4); COF.Store.sauver(p4); rafraichir(); }
        break;
      }
      case 'loot-magique': {
        var p5 = COF.Store.actif();
        if (butin && p5) { marquerMagique(butin, 'magique', p5); COF.Store.sauver(p5); rafraichir(); }
        break;
      }
      case 'loot-magique2': {
        var p6 = COF.Store.actif();
        if (butin && p6) { marquerMagique(butin, 'magique2', p6); COF.Store.sauver(p6); rafraichir(); }
        break;
      }
      case 'loot-tout': {
        var p7 = COF.Store.actif();
        if (!butin || !p7) break;
        marquerArgent(butin, p7);
        butin.objets.forEach(function (o, i) { marquerListe(butin.objets, i, p7); });
        butin.composants.forEach(function (c, i) { marquerListe(butin.composants, i, p7, c.nb); });
        butin.tresors.forEach(function (t, i) { marquerListe(butin.tresors, i, p7); });
        marquerMagique(butin, 'magique', p7);
        marquerMagique(butin, 'magique2', p7);
        COF.Store.sauver(p7);
        rafraichir();
        break;
      }
    }
  }

  /* Depuis le résultat d'une rencontre : bascule en mode Rencontre et génère aussitôt. */
  function depuisRencontre() {
    MODE = 'rencontre';
    var r = COF.UI.Generateurs.dernierResultat();
    butin = (r && !r.erreur) ? COF.Recompense.generer(r) : null;
  }

  return { init: init, rendre: rendre, depuisRencontre: depuisRencontre };
})();
