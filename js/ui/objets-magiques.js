/* ============================================================
   COF2 Compagnon — Générateur d'objets magiques (règles officielles)
   (sous-onglet de Générateurs) : potion, parchemin, baguette, arme
   magique, armure/bouclier magique, objet de pouvoir, objet de
   puissance, objet de compétence — sur le modèle du chapitre
   « Objets magiques » du livre de base. Quand la règle demande un
   sort ou une capacité, un vrai sort/capacité de la base de voies
   est pioché plutôt qu'un nom de la liste figée du livre.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.ObjetsMagiques = (function () {
  var esc = COF.UI.esc;
  var MODE = 'potion';
  var cible = null;
  var Calc = COF.ObjetsMagiquesCalc;

  function texteSort(s) {
    if (!s) return 'Aucun sort trouvé à ce rang — relancez ce champ.';
    return s.cap.n + ' (rang ' + s.cap.r + ' · ' + s.profilNom + ' — ' + s.voieNom + ')' +
      (s.cap.d ? ' — ' + s.cap.d : '');
  }
  function texteCapacite(s) {
    if (!s) return 'Aucune capacité trouvée à ce rang — relancez ce champ.';
    return s.cap.n + ' (rang ' + s.cap.r + ' · ' + s.profilNom + ' — ' + s.voieNom + ')' +
      (s.cap.d ? ' — ' + s.cap.d : '');
  }
  function texteOrigine(o) {
    if (!o) return '';
    return o.provenance + ' · ' + o.epoque + ' · ' + o.peuple;
  }
  function texteProprietes(list) {
    if (!list || !list.length) return 'Aucune propriété particulière';
    return list.map(function (p) { return (p.double ? '×2 ' : '') + p.nom + (p.texte ? ' — ' + p.texte : ''); }).join(' · ');
  }

  /* ---------- Définition des 8 catégories ---------- */
  var VUES = {
    potion: {
      titre: 'Potion', bouton: '↻ Nouvelle potion',
      champs: [['palier', 'Rareté'], ['sort', 'Effet'], ['origine', 'Origine']],
      texte: function (id, v) {
        if (id === 'palier') return v.nom;
        if (id === 'sort') return texteSort(v);
        if (id === 'origine') return texteOrigine(v);
        return v;
      },
      titreObjet: function (o) { return o.sort ? 'Potion de ' + o.sort.cap.n : 'Potion'; },
      valeur: function (o) { return o.sort ? Calc.valeurPotionParchemin(o.sort.cap.r) : 0; },
      peutUtiliser: function (o) { return !!o.sort; }
    },
    parchemin: {
      titre: 'Parchemin', bouton: '↻ Nouveau parchemin',
      champs: [['palier', 'Palier'], ['sort', 'Sort inscrit'], ['origine', 'Origine']],
      texte: function (id, v) {
        if (id === 'palier') return v.nom;
        if (id === 'sort') return texteSort(v);
        if (id === 'origine') return texteOrigine(v);
        return v;
      },
      titreObjet: function (o) { return o.sort ? 'Parchemin de ' + o.sort.cap.n : 'Parchemin'; },
      valeur: function (o) { return o.sort ? Calc.valeurPotionParchemin(o.sort.cap.r) : 0; },
      peutUtiliser: function (o) { return !!o.sort; }
    },
    baguette: {
      titre: 'Baguette magique', bouton: '↻ Nouvelle baguette',
      champs: [['palier', 'Palier'], ['sort', 'Sort contenu'], ['charges', 'Charges'], ['origine', 'Origine']],
      texte: function (id, v) {
        if (id === 'palier') return v.nom;
        if (id === 'sort') return texteSort(v);
        if (id === 'charges') return v + ' charge' + (v > 1 ? 's' : '');
        if (id === 'origine') return texteOrigine(v);
        return v;
      },
      titreObjet: function (o) { return o.nom || 'Baguette'; },
      valeur: function (o) { return (o.sort ? Calc.valeurPotionParchemin(o.sort.cap.r) : 0) * (o.charges || 1); },
      peutUtiliser: function (o) { return !!o.sort; }
    },
    arme: {
      titre: 'Arme magique', bouton: '↻ Nouvelle arme',
      champs: [['palier', 'Palier'], ['base', 'Arme'], ['proprietes', 'Propriétés'], ['maudit', 'Malédiction'], ['origine', 'Origine']],
      texte: function (id, v) {
        if (id === 'palier') return v.nom + ' (+' + v.bonus + ')';
        if (id === 'base') return v.nom + (v.sceptre ? ' (peut servir d\'arme si sa forme le permet)' : '') + ' — DM ' + v.dm;
        if (id === 'proprietes') return texteProprietes(v);
        if (id === 'maudit') return v ? v : 'Aucune — objet sain';
        if (id === 'origine') return texteOrigine(v);
        return v;
      },
      titreObjet: function (o) { return o.nom || 'Arme magique'; },
      valeur: function (o) { return Calc.valeurGenerique(Calc.niveauMagieArme(o)); },
      peutUtiliser: function () { return false; }
    },
    armure: {
      titre: 'Armure / bouclier magique', bouton: '↻ Nouvelle armure',
      champs: [['palier', 'Palier'], ['base', 'Type'], ['proprietes', 'Propriétés'], ['maudit', 'Malédiction'], ['origine', 'Origine']],
      texte: function (id, v) {
        if (id === 'palier') return v.nom + ' (+' + v.bonus + ')';
        if (id === 'base') return v.nom + ' — ' + sgnLocal(v.def) + ' DEF de base (' + (v.slot === 'bouclier' ? 'bouclier' : 'armure') + ')';
        if (id === 'proprietes') return texteProprietes(v);
        if (id === 'maudit') return v ? v : 'Aucune — objet sain';
        if (id === 'origine') return texteOrigine(v);
        return v;
      },
      titreObjet: function (o) { return o.nom || 'Armure magique'; },
      valeur: function (o) { return Calc.valeurGenerique(Calc.niveauMagieArmure(o)); },
      peutUtiliser: function () { return false; }
    },
    pouvoir: {
      titre: 'Objet de pouvoir', bouton: '↻ Nouvel objet',
      champs: [['rang', 'Rang du pouvoir'], ['capacite', 'Pouvoir'], ['origine', 'Origine']],
      texte: function (id, v) {
        if (id === 'rang') return 'Rang ' + v;
        if (id === 'capacite') return texteCapacite(v);
        if (id === 'origine') return texteOrigine(v);
        return v;
      },
      titreObjet: function (o) { return o.nom || 'Objet de pouvoir'; },
      valeur: function (o) { return Calc.valeurGenerique(o.rang || 1); },
      peutUtiliser: function (o) { return !!o.capacite; }
    },
    puissance: {
      titre: 'Objet de puissance', bouton: '↻ Nouvel objet',
      champs: [['carac', 'Caractéristique'], ['bonus', 'Bonus'], ['origine', 'Origine']],
      texte: function (id, v, etat) {
        if (id === 'carac') return v.nom;
        if (id === 'bonus') return sgnLocal(v) + ' ' + (etat.carac ? etat.carac.id : '');
        if (id === 'origine') return texteOrigine(v);
        return v;
      },
      titreObjet: function (o) { return o.nom || 'Objet de puissance'; },
      valeur: function (o) { return Calc.valeurGenerique(niveauMagiePuissance(o)); },
      peutUtiliser: function () { return false; }
    },
    competence: {
      titre: 'Objet de compétence', bouton: '↻ Nouvel objet',
      champs: [['competence', 'Compétence'], ['origine', 'Origine']],
      texte: function (id, v) {
        if (id === 'competence') return '+5 pour ' + v;
        if (id === 'origine') return texteOrigine(v);
        return v;
      },
      titreObjet: function (o) { return o.nom || 'Objet de compétence'; },
      valeur: function () { return Calc.valeurGenerique(1); },
      peutUtiliser: function () { return false; }
    }
  };

  function sgnLocal(n) { return (n >= 0 ? '+' : '') + n; }
  function niveauMagiePuissance(o) {
    var carac = o.carac || COF.OM_CARACS_PUISSANCE[0];
    var bonus = o.bonus || 1;
    if (!carac.mineure) return bonus * 3;
    if (carac.id === 'PM') return Math.ceil(bonus / 3);
    if (carac.id === 'PV') return Math.ceil(bonus / 5);
    return bonus;
  }

  /* Instancie un contrôleur de vue par catégorie (verrou/relance/tirage
     complet, comme les autres générateurs). */
  Object.keys(VUES).forEach(function (mode) {
    var v = VUES[mode];
    v.vue = COF.UI.creerVueChamps(Calc.GENS[mode], function (id, val) { return v.texte(id, val, v.vue.etatCourant()); }, 'omact');
  });

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-omact]') : null;
      if (!t || !(t.closest('#vue-generateurs') || t.closest('#modale'))) return;
      actions(t.getAttribute('data-omact'), t);
    });
  }

  /* ---------- Construction de l'objet transférable ---------- */
  function construireItem(mode, o) {
    var v = VUES[mode];
    var item = { nom: v.titreObjet(o), qte: 1, prix: v.valeur(o) };
    var descParts = [];
    if (mode === 'potion' || mode === 'parchemin') {
      descParts.push(o.sort ? o.sort.cap.d : '');
    } else if (mode === 'baguette') {
      descParts.push('Contient ' + (o.sort ? o.sort.cap.n : '?') + ' (' + o.charges + ' charges).');
      descParts.push(o.sort ? o.sort.cap.d : '');
    } else if (mode === 'arme') {
      item.dm = o.base.dm;
      item.armeType = o.base.armeType;
      item.bonus = (o.palier || Calc.PALIERS_ARME[0]).bonus;
      item.elementaires = (o.proprietes || []).filter(function (p) { return p.elem; }).map(function (p) { return p.elem; });
      if ((o.proprietes || []).some(function (p) { return p.id === 'affutee' || (p.nom && p.nom.indexOf('affûtée') > -1); })) item.crit = 19;
      descParts.push(texteProprietes(o.proprietes));
      if (o.maudit) descParts.push('Malédiction : ' + o.maudit);
    } else if (mode === 'armure') {
      item.def = (o.base ? o.base.def : 0) + (o.palier || Calc.PALIERS_ARME[0]).bonus;
      item.slot = o.base ? o.base.slot : 'armure';
      descParts.push(texteProprietes(o.proprietes));
      if (o.maudit) descParts.push('Malédiction : ' + o.maudit);
    } else if (mode === 'pouvoir') {
      descParts.push(o.capacite ? o.capacite.cap.d : '');
    } else if (mode === 'puissance') {
      var carac = o.carac || COF.OM_CARACS_PUISSANCE[0];
      item.caracBonus = { id: carac.id, val: o.bonus || 1 };
      descParts.push('Confère ' + sgnLocal(o.bonus || 1) + ' ' + carac.id + ' tant qu\'il est équipé.');
    } else if (mode === 'competence') {
      descParts.push('+5 aux tests concernant ' + o.competence + '.');
    }
    if (o.origine) descParts.push('Origine : ' + texteOrigine(o.origine) + '.');
    item.note = descParts.filter(Boolean).join(' ');
    return item;
  }

  function boutonsAction(mode, o, perso) {
    var v = VUES[mode];
    var h = '';
    if (v.peutUtiliser(o)) {
      var cap = o.sort || o.capacite;
      h += '<button class="btn btn-or btn-bloc" data-omact="utiliser" style="margin-bottom:8px">🎲 Utiliser (' + esc(cap.cap.n) + ')</button>';
    }
    if (!perso) {
      h += '<div class="note">Aucun personnage actif : ouvrez-en un depuis « Persos » pour le récupérer.</div>';
    } else if (o.ajoute) {
      h += '<button class="btn btn-bloc" disabled style="opacity:.6">✓ Ajouté à ' + esc(perso.nom) + '</button>';
    } else {
      h += '<button class="btn btn-plein btn-bloc" data-omact="ajouter">📥 Ajouter à ' + esc(perso.nom) + '</button>';
    }
    return h;
  }

  function rendre(node) {
    cible = node;
    var v = VUES[MODE];
    v.vue.assurer();
    var o = v.vue.etatCourant();
    var perso = COF.Store.actif();

    var h = '<div class="carte"><div class="carte-corps" style="padding-bottom:2px">' +
      '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:var(--text-mute);margin-bottom:5px">Catégorie</div>' +
      '<div class="chips" style="margin-bottom:2px">' +
      Object.keys(VUES).map(function (m) {
        return '<span class="chip ' + (MODE === m ? 'on' : '') + '" data-omact="mode" data-v="' + m + '">' + esc(VUES[m].titre) + '</span>';
      }).join('') + '</div></div></div>';

    h += '<div class="carte"><h2>' + esc(v.titreObjet(o)) + '<span class="h2-action" data-omact="tout">' + esc(v.bouton) + '</span></h2>';
    h += '<div class="carte-corps">';
    h += '<div class="note" style="margin-bottom:10px">🔓 pour verrouiller un champ avant de relancer le reste, ↻ pour ne changer que cette ligne. ' +
      'Coût estimé selon les règles de valeur des objets magiques : <b>' + v.valeur(o) + ' po</b>.</div>';
    v.champs.forEach(function (c) { h += v.vue.ligne(c[0], c[1]); });
    h += '<div style="margin-top:10px">' + boutonsAction(MODE, o, perso) + '</div>';
    h += '<button class="btn btn-bloc" style="margin-top:8px" data-omact="tout">' + esc(v.bouton) + '</button>';
    h += '</div></div>';

    node.innerHTML = h;
  }

  function actions(act, node) {
    if (act === 'mode') { MODE = node.getAttribute('data-v'); if (cible) rendre(cible); return; }
    var v = VUES[MODE];

    if (act === 'utiliser') {
      var oU = v.vue.etatCourant();
      var s = oU.sort || oU.capacite;
      if (s) COF.UI.jetCapacite(s.cap, s.profilNom + ' — ' + s.voieNom, s.cap.r);
      return;
    }
    if (act === 'ajouter') {
      var oA = v.vue.etatCourant();
      var perso = COF.Store.actif();
      if (oA && perso && !oA.ajoute) {
        COF.Store.ajouterObjet(perso, construireItem(MODE, oA));
        oA.ajoute = true;
        COF.Store.sauver(perso);
      }
      if (cible) rendre(cible);
      return;
    }
    if (v.vue.actionGenerique(act, node)) {
      if (act !== 'verrou') {
        var etat = v.vue.etatCourant();
        if (etat) etat.ajoute = false;
      }
      if (cible) rendre(cible);
      return;
    }
  }

  return { init: init, rendre: rendre };
})();
