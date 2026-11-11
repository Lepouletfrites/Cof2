/* ============================================================
   COF2 Compagnon — Onglet « Artisanat » (pôle Héros)
   Règles d'artisanat du Compagnon du joueur appliquées au personnage
   actif : compétences d'artisan, répartition des rangs de voies de
   recettes, puis atelier de fabrication d'armes, d'armures/boucliers
   et d'objets du catalogue avec niveau requis, coût, durée, tests
   (jetés par l'appli) et ajout de l'objet fini à la fiche.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Artisanat = (function () {
  var esc = COF.UI.esc, sgn = COF.UI.sgn;
  var A = COF.Artisanat;
  var AM = function () { return COF.ArmeMagiqueCalc; };
  var C = null;
  var at = {
    type: 'arme', mesRecettes: false,
    arme: { famille: 'lames', arme: 'epeelongue', bonus: 1, props: [], qualite: 'standard' },
    armure: { famille: 'mailles', piece: 'chemise', bonus: 1, props: [] },
    objet: { cle: null, variante: 0 },
    resultat: null, paye: false, ajoute: false
  };

  function reset() { at.resultat = null; at.paye = false; at.ajoute = false; }
  function sauver() { COF.Store.sauver(C); }
  function opts(liste, val) {
    return liste.map(function (x) {
      return '<option value="' + esc(String(x[0])) + '"' + (String(x[0]) === String(val) ? ' selected' : '') + '>' + esc(x[1]) + '</option>';
    }).join('');
  }
  function titre(t) {
    return '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:var(--or);margin:10px 0 4px">' + esc(t) + '</div>';
  }

  /* Ouvre l'atelier sur un objet du catalogue (bouton ⚒️ du catalogue). */
  function fabriquerObjet(cle) {
    at.type = 'objet'; at.mesRecettes = false; at.objet = { cle: cle, variante: 0 }; reset();
    COF.UI.aller('artisanat');
  }

  /* ---------- Événements ---------- */
  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-artact]') : null;
      if (!t || !t.closest('#vue-artisanat')) return;
      e.preventDefault();
      var act = t.getAttribute('data-artact'), v = t.getAttribute('data-v');
      var a = A.etat(C);
      if (act === 'type') { at.type = v; reset(); }
      else if (act === 'rec+') { if (A.budget(C).reste > 0 && (a.recettes[v] || 0) < 5) { a.recettes[v] = (a.recettes[v] || 0) + 1; sauver(); } }
      else if (act === 'rec-') { if (a.recettes[v]) { a.recettes[v]--; if (!a.recettes[v]) delete a.recettes[v]; sauver(); } }
      else if (act === 'payer') {
        var an = analyse();
        if (an && !at.paye) {
          if (A.payer(C, an.prixReduit)) { at.paye = true; sauver(); }
          else alert('Bourse insuffisante : il faut ' + an.prixReduit.toLocaleString('fr-FR') + ' pa.');
        }
      }
      else if (act === 'lancer') { var an2 = analyse(); if (an2) at.resultat = A.lancer(an2); }
      else if (act === 'ajouter') {
        var an3 = analyse();
        if (an3 && an3.item && !at.ajoute) { COF.Store.ajouterObjet(C, an3.item); sauver(); at.ajoute = true; }
      }
      else if (act === 'nom-arme') { at.arme.nom = AM().nomPour(at.arme); reset(); }
      else if (act === 'voies') { COF.UI.aller('voies'); return; }
      else return;
      rendre();
    });
    document.addEventListener('change', function (e) {
      var t = e.target;
      if (!t.closest || !t.closest('#vue-artisanat')) return;
      var a = C ? A.etat(C) : null, id = t.id, p = t.getAttribute('data-p');
      if (id === 'art-peuple') { a.peuple = t.value; sauver(); }
      else if (t.classList.contains('art-syn')) { a.synergies[p] = t.value; sauver(); }
      else if (id === 'art-extra') { a.extra = Math.max(0, parseInt(t.value, 10) || 0); sauver(); }
      else if (id === 'art-mes') { at.mesRecettes = t.checked; }
      /* arme */
      else if (id === 'art-a-fam') { at.arme.famille = t.value; at.arme.arme = AM().famille(t.value).armes[0]; at.arme.props = []; at.arme.nom = null; }
      else if (id === 'art-a-arme') { at.arme.arme = t.value; at.arme.props = at.arme.props.filter(function (x) { return AM().propsDispo(at.arme).indexOf(x.id) >= 0; }); at.arme.nom = null; }
      else if (id === 'art-a-base') {
        if (t.value === 'q' || t.value === 'm') { at.arme.bonus = 0; at.arme.qualite = t.value === 'm' ? 'misericorde' : 'standard'; at.arme.props = []; }
        else at.arme.bonus = parseInt(t.value, 10);
      }
      else if (t.classList.contains('art-a-chk')) {
        if (t.checked) { at.arme.props.push({ id: p, choix: AM().choixAleatoire(p) }); if (p === 'maudite') at.arme.bonus = 3; }
        else at.arme.props = at.arme.props.filter(function (x) { return x.id !== p; });
      }
      else if (t.classList.contains('art-a-choix')) { at.arme.props.forEach(function (x) { if (x.id === p) x.choix = t.value; }); }
      /* armure */
      else if (id === 'art-r-fam') { at.armure.famille = t.value; at.armure.piece = A.armureFam(t.value).types[0]; at.armure.props = []; }
      else if (id === 'art-r-piece') { at.armure.piece = t.value; }
      else if (id === 'art-r-base') { at.armure.bonus = parseInt(t.value, 10) || 0; if (!at.armure.bonus) at.armure.props = []; }
      else if (t.classList.contains('art-r-chk')) {
        if (t.checked) {
          var pp = A.armureFam(at.armure.famille).props.filter(function (x) { return x.id === p; })[0];
          at.armure.props.push({ id: p, choix: pp && pp.choix ? pp.choix[0] : null });
        } else at.armure.props = at.armure.props.filter(function (x) { return x.id !== p; });
      }
      else if (t.classList.contains('art-r-choix')) { at.armure.props.forEach(function (x) { if (x.id === p) x.choix = t.value; }); }
      /* objet */
      else if (id === 'art-o-cle') { at.objet = { cle: t.value, variante: 0 }; }
      else if (id === 'art-o-var') { at.objet.variante = parseInt(t.value, 10) || 0; }
      else return;
      if (!/^art-(peuple|extra)$/.test(id) && !t.classList.contains('art-syn')) reset();
      rendre();
    });
  }

  function projet() {
    if (at.type === 'arme') return { type: 'arme', arme: at.arme };
    if (at.type === 'armure') return { type: 'armure', famille: at.armure.famille, piece: at.armure.piece, bonus: at.armure.bonus, props: at.armure.props };
    if (!at.objet.cle) return null;
    return { type: 'objet', cle: at.objet.cle, variante: at.objet.variante };
  }
  function analyse() { var p = projet(); return p ? A.analyser(C, p) : null; }

  /* ---------- Blocs ---------- */
  function blocCompetences() {
    var a = A.etat(C);
    var nbArt = COF.ARTISAN_VOIES.filter(function (v) { return A.rangArtisan(C, v.id) > 0; }).length;
    var h = '<div class="carte"><h2>Compétences d’artisan</h2><div class="carte-corps">';
    if (!nbArt) {
      h += '<div class="note" style="margin-bottom:8px">Aucune voie d’artisan : ouvrez la voie de l’alchimiste, du façonneur, du forgeron ou du lapidaire ' +
        '(1 point par rang, sans niveau requis) dans <a href="#" data-artact="voies">📜 Voies → Voies d’artisan</a>. ' +
        'Sans elle, vous pouvez quand même fabriquer des objets ordinaires (difficulté 10, de 5 à 15).</div>';
    }
    A.competences(C).forEach(function (c) {
      h += '<div class="ligne"><div class="info"><div class="t">' + esc(c.nom) + ' (' + c.carac + ')' + (c.deBonus ? ' <span class="puce">dé bonus</span>' : '') + '</div>' +
        '<div class="s">' + esc(c.sources.join(' · ')) + ' — lieu : ' + esc(c.lieu) + '</div></div>' +
        '<div class="actions"><span class="puce puce-rang" style="font-size:15px">' + sgn(c.bonus) + '</span></div></div>';
    });
    h += '<div class="grille2" style="margin-top:8px"><div class="champ"><label>Bonus d’artisan de peuple (+3)</label><select id="art-peuple">' +
      opts([['', 'Aucun (bonus de peuple habituel)']].concat(A.COMPS.map(function (c) { return [c, c]; })), a.peuple) + '</select>' +
      '<div class="aide">Humain : toute compétence · nain : forge ou lapidage · gnome : lapidage · elfe sylvain : façonnage.</div></div>';
    var syn = COF.ARTISAN_VOIES.filter(function (v) { return A.rangArtisan(C, v.id) >= 3; });
    if (syn.length) {
      h += '<div class="champ"><label>Synergies (+3, rang 3)</label>' + syn.map(function (v) {
        return '<select class="art-syn" data-p="' + v.id + '" style="margin-bottom:4px">' +
          opts([['', v.nom + ' : choisir…']].concat(A.COMPS.filter(function (c) { return c !== v.competence; }).map(function (c) { return [c, v.nom + ' → ' + c]; })), a.synergies[v.id] || '') + '</select>';
      }).join('') + '</div>';
    }
    h += '</div></div></div>';
    return h;
  }

  function blocRecettes() {
    var a = A.etat(C), b = A.budget(C);
    var h = '<div class="carte pliable' + (b.depense ? '' : ' ferme') + '"><h2>Voies de recettes (' + b.depense + '/' + b.total + ')</h2><div class="carte-corps">';
    h += '<div class="note" style="margin-bottom:8px">3 rangs par rang de voie d’artisan, à répartir librement (une recette doit utiliser la compétence de la voie d’artisan qui la finance). ' +
      'Rangs restants : <b style="color:' + (b.reste < 0 ? 'var(--sang-clair)' : 'var(--or-clair)') + '">' + b.reste + '</b>.</div>';
    h += '<div class="champ"><label>Rangs supplémentaires (grand maître, accord du MJ)</label><input id="art-extra" type="number" min="0" value="' + a.extra + '"></div>';
    var groupe = null;
    A.voiesRecettes().forEach(function (v) {
      if (v.groupe !== groupe) { groupe = v.groupe; h += titre(groupe); }
      var r = a.recettes[v.nom] || 0;
      h += '<div class="ligne"><div class="info"><div class="t">' + esc(v.nom) + '</div><div class="s">' +
        [1, 2, 3, 4, 5].map(function (i) { return i <= r ? '●' : '○'; }).join(' ') + '</div></div>' +
        '<div class="actions"><button class="btn btn-sm" data-artact="rec-" data-v="' + esc(v.nom) + '"' + (r ? '' : ' disabled') + '>−</button>' +
        '<button class="btn btn-sm" data-artact="rec+" data-v="' + esc(v.nom) + '"' + (b.reste > 0 && r < 5 ? '' : ' disabled') + '>+</button></div></div>';
    });
    h += '</div></div>';
    return h;
  }

  function choixSelect(cls, p, liste, val) {
    return '<select class="' + cls + '" data-p="' + p + '" style="margin-top:6px">' + opts(liste, val) + '</select>';
  }

  function formArme() {
    var o = at.arme, f = AM().famille(o.famille);
    var rf = A.rangRecette(C, f.voie);
    var bases = [['q', 'Qualité (niveau 1)']];
    if (o.arme === 'dague') bases.push(['m', 'Miséricorde (voie des dagues)']);
    COF.AR_BASE.niveau.forEach(function (n, i) { bases.push([i + 1, 'Magique +' + (i + 1) + ' (niveau ' + n + ')']); });
    var h = '<div class="grille2"><div class="champ"><label>Voie de recettes</label><select id="art-a-fam">' +
      opts(COF.AR_FAMILLES.map(function (x) { return [x.id, x.voie + ' (rang ' + A.rangRecette(C, x.voie) + ')']; }), o.famille) + '</select></div>' +
      '<div class="champ"><label>Arme</label><select id="art-a-arme">' +
      opts(f.armes.map(function (id) { var w = AM().arme(id) || { nom: id }; return [id, w.nom + ' (' + w.dm + ')']; }), o.arme) + '</select></div></div>';
    h += '<div class="champ"><label>Base</label><select id="art-a-base"' + (AM().aProp(o, 'maudite') ? ' disabled' : '') + '>' +
      opts(bases, o.bonus >= 1 ? o.bonus : (o.qualite === 'misericorde' ? 'm' : 'q')) + '</select></div>';
    h += titre('Propriétés (rang de recette requis)');
    AM().propsDispo(o).forEach(function (id) {
      var p = AM().prop(id), coche = AM().aProp(o, id), bloc = coche ? null : AM().blocage(o, id);
      var voie = ['poison', 'invisible', 'assassin', 'maudite'].indexOf(id) >= 0 ? 'Voie des dagues' : f.voie;
      var connu = A.rangRecette(C, voie) >= p.rang;
      h += '<div class="ligne" style="align-items:flex-start' + (bloc ? ';opacity:.55' : '') + '"><input type="checkbox" class="art-a-chk" data-p="' + id + '"' +
        (coche ? ' checked' : '') + (bloc ? ' disabled' : '') + ' style="margin:4px 10px 0 2px;width:18px;height:18px;flex:none">' +
        '<div class="info"><div class="t">' + esc(p.nom) + ' <span class="puce" style="' + (connu ? '' : 'color:var(--sang-clair)') + '">rang ' + p.rang + (connu ? ' ✓' : '') + '</span></div>' +
        '<div class="s">' + esc(bloc || p.texte) + '</div>';
      if (coche && p.choix) {
        var pc = o.props.filter(function (x) { return x.id === id; })[0];
        var l = p.choix === 'element' ? COF.AR_ELEMENTS.map(function (e) { return [e.id, e.nom]; })
          : p.choix === 'fleau' ? COF.AR_FLEAUX.map(function (x) { return [x, x]; }) : p.variantes.map(function (v) { return [v.id, v.nom]; });
        h += choixSelect('art-a-choix', id, l, pc.choix);
      }
      h += '</div></div>';
    });
    return h + (rf ? '' : '');
  }

  function formArmure() {
    var o = at.armure, f = A.armureFam(o.famille);
    var h = '<div class="grille2"><div class="champ"><label>Voie de recettes</label><select id="art-r-fam">' +
      opts(COF.AR_ARMURES.map(function (x) { return [x.id, x.voie + ' (rang ' + A.rangRecette(C, x.voie) + ')']; }), o.famille) + '</select></div>' +
      '<div class="champ"><label>Pièce</label><select id="art-r-piece">' +
      opts(f.types.map(function (id) { var pi = A.piece(id); return [id, pi.nom + ' (DEF ' + sgn(pi.def) + ')']; }), o.piece) + '</select></div></div>';
    var bases = [[0, 'Qualité (niveau 1)']];
    COF.AR_BASE.niveau.forEach(function (n, i) { bases.push([i + 1, 'Magique +' + (i + 1) + ' (niveau ' + n + ')']); });
    h += '<div class="champ"><label>Base</label><select id="art-r-base">' + opts(bases, o.bonus) + '</select>' +
      (f.noteTests ? '<div class="aide">' + esc(f.noteTests) + '</div>' : '') + '</div>';
    h += titre('Propriétés (base magique requise)');
    f.props.forEach(function (p) {
      var coche = o.props.some(function (x) { return x.id === p.id; });
      var bloc = !coche && !(o.bonus >= 1) ? 'Nécessite une base magique (+1 ou plus).' : null;
      var connu = A.rangRecette(C, f.voie) >= p.rang;
      h += '<div class="ligne" style="align-items:flex-start' + (bloc ? ';opacity:.55' : '') + '"><input type="checkbox" class="art-r-chk" data-p="' + p.id + '"' +
        (coche ? ' checked' : '') + (bloc ? ' disabled' : '') + ' style="margin:4px 10px 0 2px;width:18px;height:18px;flex:none">' +
        '<div class="info"><div class="t">' + esc(p.nom) + ' <span class="puce" style="' + (connu ? '' : 'color:var(--sang-clair)') + '">rang ' + p.rang + (connu ? ' ✓' : '') +
        ' · niv. +' + p.niv + ' · +' + p.prix.toLocaleString('fr-FR') + ' pa</span></div>' +
        '<div class="s">' + esc(bloc || p.texte || ('Au choix : ' + (p.choix || []).join(', ') + '.')) + '</div>';
      if (coche && p.choix) {
        var pc = o.props.filter(function (x) { return x.id === p.id; })[0];
        h += choixSelect('art-r-choix', p.id, p.choix.map(function (c) { return [c, c]; }), pc.choix);
      }
      h += '</div></div>';
    });
    return h;
  }

  function formObjet() {
    var liste = (COF.CATALOGUE_COMPAGNON || []).filter(function (o) {
      if (o.t === 'propriété' || !A.variantes(o).length) return false;
      return !at.mesRecettes || A.rangRecette(C, o.v) >= o.r;
    });
    if (!at.objet.cle || !liste.some(function (o) { return o.v + '|' + o.n === at.objet.cle; })) {
      at.objet = { cle: liste.length ? liste[0].v + '|' + liste[0].n : null, variante: 0 };
    }
    var h = '<label style="display:flex;align-items:center;gap:8px;margin-bottom:8px;font-size:13px;color:var(--text-dim)">' +
      '<input type="checkbox" id="art-mes"' + (at.mesRecettes ? ' checked' : '') + '> Seulement les recettes que je connais</label>';
    if (!liste.length) return h + '<div class="vide">Aucune recette connue : répartissez des rangs dans « Voies de recettes ».</div>';
    var groupes = {}, ordre = [];
    liste.forEach(function (o) { if (!groupes[o.v]) { groupes[o.v] = []; ordre.push(o.v); } groupes[o.v].push(o); });
    h += '<div class="champ"><label>Objet</label><select id="art-o-cle">' + ordre.map(function (v) {
      return '<optgroup label="' + esc(v + ' (rang ' + A.rangRecette(C, v) + ')') + '">' +
        groupes[v].map(function (o) {
          var k = o.v + '|' + o.n;
          return '<option value="' + esc(k) + '"' + (k === at.objet.cle ? ' selected' : '') + '>' + esc('R' + o.r + ' · ' + o.n) + '</option>';
        }).join('') + '</optgroup>';
    }).join('') + '</select></div>';
    var ob = A.objetCatalogue(at.objet.cle), vs = ob ? A.variantes(ob) : [];
    if (vs.length > 1) {
      h += '<div class="champ"><label>Version</label><select id="art-o-var">' + opts(vs.map(function (v) {
        return [v.i, 'Version ' + (v.i + 1) + ' — niveau ' + v.niveau + ', ' + v.prix.toLocaleString('fr-FR') + ' pa'];
      }), at.objet.variante) + '</select></div>';
    }
    if (ob) h += '<div class="note">' + esc(ob.d) + '</div>';
    return h;
  }

  function blocResume(an) {
    if (!an) return '';
    var h = '<div class="carte"><h2>' + esc(an.nom || 'Projet') + (at.type === 'arme' ? '<span class="h2-action" data-artact="nom-arme">↻ Nom</span>' : '') + '</h2><div class="carte-corps">';
    h += '<div class="stats">' +
      '<div class="stat"><div class="lbl">Niveau requis</div><div class="v" style="color:' + (an.niveauOK ? 'var(--or-clair)' : 'var(--sang-clair)') + '">' + an.niveau + '</div></div>' +
      '<div class="stat"><div class="lbl">Niveau de magie</div><div class="v">' + esc(String(an.nm)) + '</div></div>' +
      '<div class="stat"><div class="lbl">Matières</div><div class="v">' + an.prixReduit.toLocaleString('fr-FR') + ' pa</div></div></div>';
    if (!an.niveauOK) h += '<div class="note" style="color:var(--sang-clair);margin-top:6px">' + esc(C.nom) + ' est niveau ' + C.niveau + ' : niveau ' + an.niveau + ' requis.</div>';

    h += '<div class="ligne"><div class="info"><div class="t">Recettes requises</div><div class="s">' + an.recettes.map(function (r) {
      return '<span style="color:' + (r.ok ? 'var(--vert)' : 'var(--sang-clair)') + '">' + (r.ok ? '✓' : '✗') + '</span> ' +
        esc(r.voie + ' rang ' + r.rang + ' (' + r.quoi + ')' + (r.ok ? '' : ' — vous avez rang ' + r.actuel));
    }).join('<br>') + '</div></div></div>';

    h += '<div class="ligne"><div class="info"><div class="t">Coût et durée</div><div class="s">' + esc(
      'Matières premières : ' + an.prix.toLocaleString('fr-FR') + ' pa' + (an.reduction ? ' − ' + Math.round(an.reduction * 100) + ' % = ' + an.prixReduit.toLocaleString('fr-FR') + ' pa' : '') +
      ' · ' + an.joursAtelier + ' jours en atelier (10 h/jour), ' + an.joursAventure + ' jours en aventure (1 h/jour) · fabrication rapide (option) : ' + Math.max(1, Math.ceil(an.joursAtelier / 10)) + ' jours.') +
      '<br>' + esc('Lieux : ' + an.lieux.filter(function (x, i, t) { return t.indexOf(x) === i; }).join(', ') + ' (matériel de 200 pa).') + '</div></div></div>';

    h += '<div class="ligne"><div class="info"><div class="t">Tests d’artisanat (à mi-parcours)</div><div class="s">' + (an.tests.length ? an.tests.map(function (t) {
      return esc(t.nom + ' ' + t.diff + (t.principal ? ' (principal)' : '') + ' — votre bonus ' + sgn(t.bonus) + (t.deBonus ? ' + dé bonus' : '') + ' → ' + t.chance + ' %');
    }).join('<br>') : 'Aucun test reconnu.') + '</div></div></div>';
    if (an.effets.length) h += '<div class="ligne"><div class="info"><div class="t">Effets</div><div class="s">' + an.effets.map(esc).join('<br>') + '</div></div></div>';

    if (at.resultat) {
      var res = at.resultat;
      h += '<div class="ligne" style="border-color:var(--or)"><div class="info"><div class="t">🎲 Résultat des tests</div><div class="s">' +
        res.tests.map(function (x) {
          return '<span style="color:' + (x.ok ? 'var(--vert)' : 'var(--sang-clair)') + '">' + (x.ok ? '✓' : '✗') + '</span> ' +
            esc(x.nom + ' : ' + x.nat + ' ' + sgn(x.bonus) + ' = ' + x.total + ' contre ' + x.diff + ' (marge ' + sgn(x.marge) + ')');
        }).join('<br>') + '<br><b>' + esc(res.issue.texte) + '</b></div></div></div>';
    }

    h += '<div style="margin-top:10px;display:grid;gap:8px">' +
      '<button class="btn btn-bloc" data-artact="payer"' + (at.paye ? ' disabled style="opacity:.6"' : '') + '>' +
        (at.paye ? '✓ Matières premières payées' : '💰 Payer les matières premières (' + an.prixReduit.toLocaleString('fr-FR') + ' pa)') + '</button>' +
      '<button class="btn btn-or btn-bloc" data-artact="lancer">🎲 ' + (at.resultat ? 'Relancer' : 'Lancer') + ' les tests d’artisanat</button>' +
      '<button class="btn btn-plein btn-bloc" data-artact="ajouter"' + (at.ajoute ? ' disabled style="opacity:.6"' : '') + '>' +
        (at.ajoute ? '✓ Ajouté à ' + esc(C.nom) : '📥 Ajouter l’objet terminé à ' + esc(C.nom)) + '</button></div>';
    h += '</div></div>';
    return h;
  }

  function rendre() {
    var n = document.getElementById('vue-artisanat');
    if (!n) return;
    C = COF.Store.actif();
    if (!C) {
      n.innerHTML = '<div class="vide">Aucun personnage sélectionné.<br><br><button class="btn btn-plein" onclick="COF.UI.aller(\'persos\')">Choisir un personnage</button></div>';
      return;
    }
    var ouv = Array.prototype.map.call(n.querySelectorAll('.pliable'), function (x) { return x.classList.contains('ferme'); });
    var y = window.scrollY;
    var h = blocCompetences() + blocRecettes();
    h += '<div class="carte"><h2>Atelier</h2><div class="carte-corps">';
    h += '<div class="chips" style="margin-bottom:10px">' + [['arme', '⚔️ Arme'], ['armure', '🛡️ Armure / bouclier'], ['objet', '💍 Objet ou potion']].map(function (t) {
      return '<span class="chip ' + (at.type === t[0] ? 'on' : '') + '" data-artact="type" data-v="' + t[0] + '">' + t[1] + '</span>';
    }).join('') + '</div>';
    h += at.type === 'arme' ? formArme() : (at.type === 'armure' ? formArmure() : formObjet());
    h += '</div></div>';
    h += blocResume(analyse());
    n.innerHTML = h;
    Array.prototype.forEach.call(n.querySelectorAll('.pliable'), function (x, i) {
      if (ouv[i] !== undefined) x.classList.toggle('ferme', ouv[i]);
      x.querySelector('h2').addEventListener('click', function () { x.classList.toggle('ferme'); });
    });
    window.scrollTo(0, y);
  }

  return { init: init, rendre: rendre, fabriquerObjet: fabriquerObjet };
})();
