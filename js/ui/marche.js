/* ============================================================
   COF2 Compagnon — Marché : acheter et vendre
   Prix de l'équipement du livre en pièces d'argent (pa), 1 po = 10 pa.
   - Acheter : armes, armures, boucliers, matériel, montures et, dans
     les grandes villes, potions et objets magiques du Compagnon
     (niveau requis ≤ niveau du héros). L'offre dépend de la taille du
     lieu (hameau → cité) ; le stock magique du jour est conservé.
   - Marchander : test de CHA, une fois par visite (−10 % ou +10 %).
   - Vendre : l'inventaire du héros, à la moitié de sa valeur.
   En mode aventure, le marché est celui du lieu où se trouve le héros.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Marche = (function () {
  var esc = COF.UI.esc;
  var etat = { onglet: 'acheter', cat: 'tout', q: '', taille: null, achats: 0 };
  var TAILLES = [
    ['hameau', 'Hameau', 1.2, 5], ['village', 'Village', 1.1, 12], ['bourg', 'Bourg', 1, 40],
    ['ville', 'Ville', 1, 999], ['cite', 'Cité', 0.95, 9999]
  ];
  var CATS = [['tout', 'Tout'], ['local', '⭐ Local'], ['armes', '⚔️ Armes'], ['armures', '🛡️ Armures'], ['materiel', '🎒 Matériel'], ['montures', '🐴 Montures'], ['magie', '✨ Magie']];

  function campagne() { return COF.UI.mode && COF.UI.mode() === 'aventure' && COF.Carnet ? COF.Carnet.actif() : null; }
  function heros() { var c = campagne(); return (c && c.persoId && COF.Store.get(c.persoId)) || COF.Store.actif(); }
  function lieuActuel() { var c = campagne(); return c && COF.Monde ? COF.Monde.ici(c) : null; }
  /* ---------- Village du mode aventure : spécialité, réputation, objets rares ---------- */
  function villeIci() { var l = lieuActuel(); return l && l.ville ? l : null; }
  var SPECS = [
    [/forge|métal|fer\b|acier|armur|arme/i, 'armes', 0.85, 'forgerons réputés : armes moins chères, et de meilleure qualité', 'arme'],
    [/cuir|tann|peau|fourrure|tisserand|textile|laine/i, 'armures', 0.85, 'artisans du cuir et du tissu : armures moins chères', 'armure'],
    [/cheva|élevage|bétail|monture|haras/i, 'montures', 0.8, 'éleveurs : montures moins chères', 'objet'],
    [/herb|plante|alchim|potion|apothic|remède|guériss/i, 'magie', 0.85, 'herboristes : potions même dans un petit village', 'potion'],
    [/commerce|marchand|foire|négoce|port|caravane|carrefour/i, 'tout', 0.93, 'carrefour marchand : tout est un peu moins cher', 'objet'],
    [/pêche|agricult|blé|vigne|vin|miel|apicult|fromage|grain|verger|moulin/i, 'materiel', 0.85, 'terroir généreux : matériel et provisions moins chers', 'potion'],
    [/bois|bûcher|charpent|menuis/i, 'materiel', 0.9, 'travail du bois : matériel moins cher', 'objet'],
    [/mine|pierre|carrière|joaill|gemme|orfèvr/i, 'magie', 0.95, 'mineurs et joailliers : bijoux et objets précieux', 'objet']
  ];
  function specialite() {
    var l = villeIci(); if (!l) return null;
    var t = l.ville.specialite || '';
    for (var i = 0; i < SPECS.length; i++) if (SPECS[i][0].test(t)) return { cat: SPECS[i][1], mult: SPECS[i][2], texte: SPECS[i][3], genre: SPECS[i][4] };
    return null;
  }
  function repMult() { var l = villeIci(); return l && COF.Saga ? 1 - 0.05 * COF.Saga.reputation(l) : 1; }
  /* 1 ou 2 objets rares propres au village, tirés une seule fois. */
  function raresVillage() {
    var c = campagne(), l = c && COF.Monde ? COF.Monde.ici(c) : null; if (!l || !l.ville) return [];
    var v = l.ville, sp = specialite(), p = heros(), N = p ? (p.niveau || 1) : 3;
    if (!v.rares) {
      v.rares = [];
      for (var i = 0, essai = 0; v.rares.length < 2 && essai < 8; essai++) {
        var m = COF.Recompense.tirerObjetLivre(N + 1, sp ? sp.genre : COF.piocher(['potion', 'objet'])); if (!m) continue;
        if (v.rares.some(function (x) { return x.nom === m.nom; })) continue;
        v.rares.push({ cat: 'local', nom: m.nom, pa: Math.max(20, (m.item.prix || 2) * 10), note: 'Introuvable ailleurs · ' + (m.source || '') + (m.niveau ? ' · niveau ' + m.niveau : ''), item: m.item, magique: true, rare: true });
        i++;
      }
      COF.Carnet.sauver(c);   /* même objet que celui modifié : les rares sont gardés */
    }
    v.raresVendus = v.raresVendus || {};
    return v.rares;
  }
  function tailleDeduite() {
    var l = lieuActuel(); if (!l) return 'ville';
    if (l.ville && l.ville.taille) {
      var tv = l.ville.taille;
      if (/cite|capitale|metropole/.test(tv)) return 'cite';
      if (['hameau', 'village', 'bourg', 'ville'].indexOf(tv) >= 0) return tv;
    }
    var t = (l.nom + ' ' + (l.note || '')).toLowerCase();
    if (/cité|métropole|capitale/.test(t)) return 'cite';
    if (/\bville\b/.test(t)) return 'ville';
    if (/bourg/.test(t)) return 'bourg';
    if (/hameau|ferme|campement/.test(t)) return 'hameau';
    if (/village|taverne|auberge/.test(t)) return 'village';
    return 'bourg';
  }
  function taille() { return TAILLES.filter(function (t) { return t[0] === (etat.taille || tailleDeduite()); })[0] || TAILLES[2]; }
  function cleVisite() { var c = campagne(), l = lieuActuel(); return (c ? c.id + '|' + c.jour : 'normal') + '|' + (l ? l.id : '-') + '|' + taille()[0]; }

  /* ---------- Offre ---------- */
  function articlesBase() {
    var out = [], T = taille(), plafond = T[3], sp = specialite();
    /* la spécialité du village élargit l'offre de sa catégorie */
    function aj(cat, x, item) { var pl = sp && sp.cat === cat ? plafond * 4 : plafond; if ((x.prix || 0) > 0 && x.prix <= pl) out.push({ cat: cat, nom: x.nom, pa: x.prix, note: x.note || '', item: item }); }
    COF.ARMES_CONTACT.forEach(function (a) {
      aj('armes', a, { nom: a.nom, dm: a.dm, dm2: a.dm2 || null, armeType: 'contact', crit: a.crit || 20, noFor: !!a.noFor, noteArme: a.note || null });
    });
    COF.ARMES_DISTANCE.forEach(function (a) {
      aj('armes', a, { nom: a.nom, dm: a.dm, armeType: 'distance', portee: a.portee || null, crit: a.crit || 20, noFor: !!a.noFor, noteArme: a.note || null });
    });
    COF.ARMURES.forEach(function (a) { if (a.id !== 'aucune' && !(a.id === 'plaquecomp' && T[0] !== 'cite')) aj('armures', a, { nom: a.nom, def: a.def, slot: 'armure', note: a.note || null }); });
    COF.BOUCLIERS.forEach(function (a) { if (a.id !== 'aucun') aj('armures', a, { nom: a.nom, def: a.def, slot: 'bouclier' }); });
    COF.MATERIEL.forEach(function (a) { aj('materiel', a, { nom: a.nom, note: a.note || null }); });
    if (T[0] !== 'hameau') COF.MONTURES.forEach(function (a) { aj('montures', a, { nom: a.nom, note: a.note || null }); });
    return out;
  }
  /* Objets magiques du jour (bourg : potions ; ville : + objets ; cité : davantage). */
  function articlesMagie() {
    var T = taille()[0];
    var c = campagne(), cle = cleVisite();
    var cache = c ? (c.marche = c.marche || {}) : (articlesMagie.cache = articlesMagie.cache || {});
    if (!cache[cle]) {
      var p = heros(), N = p ? (p.niveau || 1) : 5, nb = { bourg: 3, ville: 7, cite: 14 }[T] || 0, liste = [], vus = {};
      var spM = specialite(); if (spM && spM.cat === 'magie') nb += 2;   /* village d'herboristes, de joailliers… */
      for (var i = 0; i < nb * 3 && liste.length < nb; i++) {
        var genre = T === 'bourg' ? 'potion' : COF.piocher(['potion', 'potion', 'objet', 'objet', 'arme', 'armure']);
        var m = COF.Recompense.tirerObjetLivre(N, genre);
        if (!m || vus[m.nom]) continue;
        vus[m.nom] = 1;
        liste.push({ cat: 'magie', nom: m.nom, pa: Math.max(10, (m.item.prix || 1) * 10), note: m.source + (m.niveau ? ' · niveau ' + m.niveau : ''), item: m.item, magique: true });
      }
      /* on ne garde que le stock du lieu et du jour courants */
      Object.keys(cache).forEach(function (k) { if (k !== cle) delete cache[k]; });
      cache[cle] = { liste: liste, marchande: null, vendus: {} };
      if (c) COF.Carnet.sauver(c);
    }
    return cache[cle];
  }
  function visite() { return articlesMagie() || { liste: [], marchande: null, vendus: {} }; }
  function modPrix() { var v = visite(); return taille()[2] * (v.marchande === true ? 0.9 : (v.marchande === false ? 1.1 : 1)) * repMult(); }
  function prixAchat(a) {
    var sp = specialite(), m = sp && (sp.cat === a.cat || sp.cat === 'tout' || (sp.cat === 'magie' && a.cat === 'local')) ? sp.mult : 1;
    return Math.max(1, Math.round(a.pa * modPrix() * m));
  }
  function offre() { return articlesBase().concat(visite().liste || [], raresVillage()); }

  /* ---------- Vente : estimation de la valeur d'un objet (en pa) ---------- */
  var TABLES_PA = null;
  function valeurPa(o) {
    if (typeof o.prixPa === 'number') return o.prixPa;
    var magique = /^✨/.test(o.nom) || /Niveau de magie/.test(o.desc || '');
    if (magique) return (o.prix || 0) * 10;
    if (!TABLES_PA) {
      TABLES_PA = {};
      [].concat(COF.ARMES_CONTACT, COF.ARMES_DISTANCE, COF.ARMURES, COF.BOUCLIERS, COF.MATERIEL, COF.MONTURES)
        .forEach(function (x) { if (x.prix) TABLES_PA[x.nom.toLowerCase()] = x.prix; });
    }
    var k = String(o.nom).toLowerCase();
    if (TABLES_PA[k]) return TABLES_PA[k];
    return o.prix || 0;
  }
  function prixVente(o) { var v = valeurPa(o); return v > 0 ? Math.max(1, Math.floor(v / 2)) : 0; }

  /* ---------- Monnaie (en pa) ---------- */
  function bourseTexte(p) { var b = p.bourse || {}; return (b.po || 0) + ' po · ' + (b.pa || 0) + ' pa' + (b.pc ? ' · ' + b.pc + ' pc' : ''); }
  function crediter(p, pa) {
    var b = p.bourse = p.bourse || { po: 0, pa: 0, pc: 0 };
    var tot = (b.po || 0) * 10 + (b.pa || 0) + pa;
    b.po = Math.floor(tot / 10); b.pa = tot % 10;
  }
  function fmt(pa) { return pa >= 10 && pa % 10 === 0 ? (pa / 10) + ' po' : (pa >= 10 ? Math.floor(pa / 10) + ' po ' + (pa % 10) + ' pa' : pa + ' pa'); }

  /* ---------- Rendu ---------- */
  function rendre() {
    var n = document.getElementById('vue-marche'); if (!n) return;
    var p = heros(), l = lieuActuel(), T = taille(), v = visite();
    /* mode aventure : on vient ici par le récit, et on y retourne */
    var avent = !!campagne(), retour = avent ? '<button class="btn btn-bloc mc-retour" data-mc="retour">◀ Retour au récit</button>' : '';
    if (avent && l && !(l.ville || l.env === 'urbain')) {
      n.innerHTML = retour + '<div class="carte"><h2>🛒 Pas de marché ici</h2><div class="carte-corps"><div class="vide">' + esc(l.nom) + ' n’a ni étals ni échoppes. Il faut rejoindre un village ou une ville pour faire ses achats.</div></div></div>';
      return;
    }
    var h = retour + '<div class="carte"><h2>🛒 Marché' + (l ? ' — ' + esc(l.nom) : '') + '</h2><div class="carte-corps">';
    if (!p) return void (n.innerHTML = h + '<div class="vide">Aucun personnage actif.</div></div></div>');
    h += '<div class="mc-bourse"><span>💰 ' + esc(p.nom) + '</span><b>' + esc(bourseTexte(p)) + '</b></div>';
    var vI = villeIci(), spI = specialite();
    if (vI) h += '<div class="cn-changes" style="margin:6px 0 8px"><div>🏘️ ' + esc(vI.nom) + (spI ? ' · ' + esc(spI.texte) : '') + '</div>' +
      (COF.Saga ? '<div>⭐ Réputation : ' + esc(COF.Saga.libRep(COF.Saga.reputation(vI))) + (repMult() !== 1 ? ' (' + (repMult() < 1 ? '−' : '+') + Math.round(Math.abs(1 - repMult()) * 100) + ' % sur les prix)' : '') + '</div>' : '') + '</div>';
    h += '<label class="cn-lbl2">Taille du lieu' + (l && !etat.taille ? ' (déduite de « ' + esc(l.nom) + ' »)' : '') + '</label><div class="cn-mini">' + TAILLES.map(function (t) {
      return '<span class="chip' + (T[0] === t[0] ? ' on' : '') + '" data-mc="taille" data-v="' + t[0] + '">' + t[1] + '</span>';
    }).join('') + '</div>';
    h += '<div class="cn-grille">' + (v.marchande === null || v.marchande === undefined
      ? '<button data-mc="marchander">🗣️ Marchander (CHA 15)</button>'
      : '<button disabled>' + (v.marchande ? '✓ Remise de 10 %' : '✗ Prix +10 %') + '</button>') +
      '<button data-mc="onglet" data-v="' + (etat.onglet === 'acheter' ? 'vendre' : 'acheter') + '" class="on">' + (etat.onglet === 'acheter' ? '💰 Vendre' : '🛒 Acheter') + '</button></div>';
    h += '</div></div>';
    h += etat.onglet === 'acheter' ? htmlAcheter(p) : htmlVendre(p);
    n.innerHTML = h;
  }
  function htmlAcheter(p) {
    var tous = offre(), q = etat.q.trim().toLowerCase();
    var liste = tous.filter(function (a) {
      if (etat.cat !== 'tout' && a.cat !== etat.cat) return false;
      if (q && (a.nom + ' ' + a.note).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    var h = '<div class="carte"><h2>Acheter</h2><div class="carte-corps">' +
      '<div class="cn-mini">' + CATS.map(function (c) {
        var nb = c[0] === 'tout' ? tous.length : tous.filter(function (a) { return a.cat === c[0]; }).length;
        return nb || c[0] === 'tout' ? '<span class="chip' + (etat.cat === c[0] ? ' on' : '') + '" data-mc="cat" data-v="' + c[0] + '">' + c[1] + ' ' + nb + '</span>' : '';
      }).join('') + '</div>' +
      '<div class="champ" style="margin-bottom:8px"><input id="mc-q" placeholder="Rechercher…" value="' + esc(etat.q) + '"></div>';
    if (!liste.length) h += '<div class="vide">Rien à vendre ici dans cette catégorie' + (taille()[0] === 'village' || taille()[0] === 'hameau' ? ' (les objets magiques se trouvent en ville)' : '') + '.</div>';
    var vendus = visite().vendus || {};
    liste.forEach(function (a, i) {
      var vl = villeIci(), pr = prixAchat(a), dej = a.rare ? !!(vl && vl.ville.raresVendus && vl.ville.raresVendus[a.nom]) : (a.magique && vendus[a.nom]);
      h += '<div class="cn-item"><div class="info"><div class="t">' + (a.rare ? '⭐ ' : (a.magique ? '✨ ' : '')) + esc(a.nom) + ' <span class="puce">' + fmt(pr) + '</span></div>' +
        (a.note ? '<div class="s">' + esc(a.note.length > 120 ? a.note.slice(0, 120) + '…' : a.note) + '</div>' : '') + '</div>' +
        (dej ? '<button class="btn btn-sm" disabled>Vendu</button>' : '<button class="btn btn-sm btn-or" data-mc="acheter" data-k="' + esc(a.cat + '|' + a.nom) + '">Acheter</button>') + '</div>';
    });
    return h + '</div></div>';
  }
  function htmlVendre(p) {
    var inv = p.inventaire || [];
    var h = '<div class="carte"><h2>Vendre <small style="text-transform:none;letter-spacing:0;color:var(--text-mute)">· à la moitié de la valeur</small></h2><div class="carte-corps">';
    if (!inv.length) return h + '<div class="vide">Inventaire vide.</div></div></div>';
    inv.forEach(function (o, i) {
      var pv = prixVente(o);
      h += '<div class="cn-item"><div class="info"><div class="t">' + esc(o.nom) + (o.qte > 1 ? ' <span class="puce">×' + o.qte + '</span>' : '') +
        (o.equipe ? ' <span class="puce">équipé</span>' : '') + '</div>' +
        '<div class="s">' + (pv ? 'Vous en tirerez ' + fmt(pv) + (o.qte > 1 ? ' l’unité' : '') : 'Sans valeur marchande connue') + '</div></div>' +
        (pv ? '<button class="btn btn-sm btn-or" data-mc="vendre" data-i="' + i + '">Vendre</button>' : '') + '</div>';
    });
    return h + '</div></div>';
  }

  /* ---------- Actions ---------- */
  function toast(m) {
    var t = document.createElement('div'); t.className = 'cn-toast'; t.textContent = m;
    document.body.appendChild(t); setTimeout(function () { t.classList.add('out'); }, 1600); setTimeout(function () { t.remove(); }, 2100);
  }
  function noter(txt) { var c = campagne(); if (c) COF.Carnet.ajouterEntree(c, { t: 'note', titre: 'Marché', txt: txt }); }
  function sauverVisite() { var c = campagne(); if (c) COF.Carnet.sauver(c); }

  function action(act, node) {
    var p = heros(); if (!p) return;
    var v = node.getAttribute('data-v');
    if (act === 'retour') { COF.UI.aller('carnet'); return; }
    if (act === 'onglet') etat.onglet = v;
    else if (act === 'cat') etat.cat = v;
    else if (act === 'taille') etat.taille = v;
    else if (act === 'marchander') {
      var vis = visite(), t = COF.Dice.test({ mod: COF.Calc.carac(p, 'CHA'), difficulte: 15 });
      vis.marchande = !!t.reussite; sauverVisite();
      toast(t.reussite ? '🗣️ ' + t.total + ' : remise de 10 % !' : '🗣️ ' + t.total + ' : le marchand se braque (+10 %)');
      noter('Marchandage (CHA ' + t.total + ' contre 15) : ' + (t.reussite ? 'remise de 10 %.' : 'les prix montent de 10 %.'));
    }
    else if (act === 'acheter') {
      var cle = node.getAttribute('data-k');
      var a = offre().filter(function (x) { return x.cat + '|' + x.nom === cle; })[0];
      if (!a) return;
      var pr = prixAchat(a);
      if (!COF.Artisanat.payer(p, pr)) { toast('Pas assez d’argent (' + fmt(pr) + ')'); return; }
      var neuf = COF.Store.ajouterObjet(p, Object.assign({}, a.item, { nom: (a.magique ? '✨ ' : '') + a.item.nom, qte: 1, prix: pr }));
      if (neuf) neuf.prixPa = a.pa;
      COF.Store.sauver(p);
      if (a.rare) { var cR = campagne(), lR = cR && COF.Monde.ici(cR); if (lR && lR.ville) { lR.ville.raresVendus = lR.ville.raresVendus || {}; lR.ville.raresVendus[a.nom] = true; COF.Carnet.sauver(cR); } }
      else if (a.magique) { visite().vendus[a.nom] = true; sauverVisite(); }
      toast('🛒 ' + a.nom + ' (' + fmt(pr) + ')');
      noter('Achat : ' + a.nom + ' pour ' + fmt(pr) + '.');
    }
    else if (act === 'vendre') {
      var i = +node.getAttribute('data-i'), o = (p.inventaire || [])[i]; if (!o) return;
      var gain = prixVente(o); if (!gain) return;
      if (!confirm('Vendre « ' + o.nom + ' » pour ' + fmt(gain) + ' ?')) return;
      if (o.caracBonus && o.equipe && p.carac) p.carac[o.caracBonus.id] = (p.carac[o.caracBonus.id] || 0) - o.caracBonus.val;
      if (o.qte > 1) o.qte--; else p.inventaire.splice(i, 1);
      /* une arme vendue quitte aussi la liste des armes */
      var nomArme = String(o.nom).replace(/^✨ /, '');
      var ia = (p.armes || []).map(function (w) { return w.nom; }).indexOf(o.nom);
      if (ia < 0) ia = (p.armes || []).map(function (w) { return w.nom; }).indexOf(nomArme);
      if (ia >= 0 && !(p.inventaire || []).some(function (x) { return x.nom === o.nom; })) p.armes.splice(ia, 1);
      crediter(p, gain); COF.Store.sauver(p);
      toast('💰 +' + fmt(gain));
      noter('Vente : ' + o.nom + ' pour ' + fmt(gain) + '.');
    }
    rendre();
  }

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-mc]') : null;
      if (!t || !t.closest('#vue-marche')) return;
      action(t.getAttribute('data-mc'), t);
    });
    document.addEventListener('input', function (e) {
      if (e.target.id !== 'mc-q') return;
      etat.q = e.target.value;
      var pos = e.target.selectionStart; rendre();
      var n = document.getElementById('mc-q'); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (er) {} }
    });
  }

  return { init: init, rendre: rendre, valeurPa: valeurPa };
})();
