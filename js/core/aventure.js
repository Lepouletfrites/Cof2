/* ============================================================
   COF2 Compagnon — Moteur du mode aventure (jeu en solo)
   Rassemble les générateurs de l'app en versions « récit » :
   chaque tirage renvoie un texte prêt à insérer dans la scène et,
   selon le cas, de quoi créer un PNJ, un lieu ou un fil du Carnet.
   Tout est calé sur le contexte de l'aventure : niveau du héros,
   nombre d'alliés, environnement de l'expédition, tension.

   Rencontres : composition (moteur de rencontre), distance, surprise
   et réaction des créatures (2d6, plus hostile quand la tension
   monte), puis approche du héros : combattre, parlementer, éviter,
   fuir. Fin de combat : bilan, butin de la rencontre, PV des alliés.
   ============================================================ */
window.COF = window.COF || {};

COF.Aventure = (function () {
  var piocher = COF.piocher;
  function d(n) { return 1 + Math.floor(Math.random() * n); }
  function maj(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }
  function min1(s) { s = String(s || ''); return s.charAt(0).toLowerCase() + s.slice(1); }
  function heros(c) { return (c && c.persoId && COF.Store.get(c.persoId)) || COF.Store.actif(); }
  function niveau(c) { var p = heros(c); return p ? (p.niveau || 1) : 1; }
  /* Terrain courant : celui de l'expédition, sinon celui du lieu où se
     trouve le héros sur la carte, sinon le dernier utilisé. */
  function envCourant(c) {
    if (c && c.expedition && c.expedition.env) return c.expedition.env;
    var ici = c && COF.Monde ? COF.Monde.envIci(c) : null;
    if (ici) return ici;
    return (c && c.envDernier) || 'foret';
  }
  /* Test de rencontre automatique au début d'une scène : 1 chance sur N
     selon le terrain (la ville est sûre, les profondeurs dangereuses),
     deux fois plus de risques quand la tension dépasse 6. */
  var RISQUE = { urbain: 12, plaine: 8, foret: 6, montagne: 6, arctique: 6, marais: 5, ruines: 4, souterrain: 4 };
  function testRencontre(c) {
    var env = envCourant(c), n = RISQUE[env] || 6;
    if (c.tension >= 7) n = Math.max(2, Math.ceil(n / 2));
    var jet = d(n);
    return { env: env, n: n, jet: jet, rencontre: jet === 1 };
  }
  function nbAllies(c) {
    var p = heros(c);
    return (p ? (p.compagnons || []).length : 0) + (COF.Expedition ? COF.Expedition.allies(c).length : 0);
  }

  /* ================= Générateurs « récit » ================= */
  var NOM_PEUPLE = { humain: 'humain', nain: 'nain', halfelin: 'halfelin', gnome: 'gnome', elfehaut: 'elfe haut',
    elfesylvain: 'elfe sylvain', demiorc: 'demi-orc', demielfe: 'demi-elfe' };
  var NOM_PEUPLE_F = { humain: 'humaine', nain: 'naine', halfelin: 'halfeline', gnome: 'gnome', elfehaut: 'elfe haute',
    elfesylvain: 'elfe sylvaine', demiorc: 'demi-orque', demielfe: 'demi-elfe' };
  function attitudeCarnet(txt) {
    var t = String(txt || '').toLowerCase();
    if (/hostile|méfian|froid/.test(t)) return 'hostile';
    if (/amical|chaleur|bienveill|serviable|enthousias|loyal/.test(t)) return 'allié';
    return 'neutre';
  }
  /* opts : { peuple, genre } (facultatifs) */
  function pnj(opts) {
    opts = opts || {};
    var v = {}, a = {};
    if (opts.peuple) { v.peuple = true; a.peuple = opts.peuple; }
    if (opts.genre) { v.genre = true; a.genre = opts.genre; }
    var x = COF.PnjCalc.genererPNJ(v, a);
    var f = x.genre === 'féminin';
    var pe = (f ? NOM_PEUPLE_F : NOM_PEUPLE)[x.peuple] || (COF.PEUPLES[x.peuple] || {}).nom || x.peuple;
    var il = f ? 'Elle' : 'Il';
    var chv = /^chauve/.test(x.cheveux) ? 'le crâne chauve' : x.cheveux;
    if (f) { x.taille = COF.PnjCalc.feminiser(x.taille); x.corpulence = COF.PnjCalc.feminiser(x.corpulence); x.age = String(x.age).replace(/^âgé(?![a-zé])/, 'âgée'); }
    var app = piocher([
      maj(x.taille) + ' et ' + x.corpulence + ', ' + chv + ', les yeux ' + x.yeux + '. Signe distinctif : ' + x.signe + '.',
      'On remarque d’abord ' + x.signe + '. ' + il + ' est ' + x.taille + ', ' + x.corpulence + ', avec ' + chv + ' et des yeux ' + x.yeux + '.',
      'Silhouette ' + x.corpulence + ', ' + x.taille + ' ; ' + chv + ', yeux ' + x.yeux + ', ' + x.signe + '.'
    ]);
    var carac = piocher([
      'Idéal : ' + min1(x.ideal) + ' ; travers : ' + min1(x.travers) + '. ' + maj(x.manie) + '.',
      il + ' place ' + min1(x.ideal) + ' au-dessus de tout, mais ' + (f ? 'elle' : 'il') + ' est ' + min1(x.travers) + '. ' + maj(x.manie) + '.'
    ]);
    var desc = x.nom + ', ' + (f ? 'une ' : 'un ') + pe + ' ' + x.age + ', ' + min1(x.metier.nom) + '.\n' + app + '\n' + carac + '\n' +
      'Ce qu’' + (f ? 'elle' : 'il') + ' veut : ' + min1(x.motivation) + '. Son secret : ' + min1(x.secret) + '.\n' +
      'Envers le héros : ' + min1(x.attitude) + '. Accroche : ' + min1(x.accroche) + '.';
    return { gen: 'pnj', titre: 'PNJ', nom: x.nom, texte: desc, liste: 'pnj', attitude: attitudeCarnet(x.attitude) };
  }
  /* type : 'village' | 'taverne' | 'boutique' */
  function lieu(type) {
    var L = COF.LieuxCalc;
    if (type === 'taverne') {
      var t = L.taverne.genererTout({}, {});
      return { gen: 'lieu', titre: 'Taverne', nom: t.nom, liste: 'lieux',
        texte: t.nom + ' — ' + t.ambiance + '. Spécialité : ' + min1(t.specialite) + '. Prix : ' + min1(t.prix) + '.\nTenancier : ' +
          L.texteTenancier(t.tenancier) + '. ' + t.particularite + '.\nOn y entend : ' + min1(t.rumeur) };
    }
    if (type === 'boutique') {
      var b = L.boutique.genererTout({}, {});
      return { gen: 'lieu', titre: b.type.nom, nom: b.nom, liste: 'lieux',
        texte: b.nom + ' (' + min1(b.type.nom) + ') — marchand : ' + L.texteTenancier(b.marchand) + ', ' + b.trait + '.\nÀ vendre : ' +
          b.stock.map(function (s) { return (s.magique ? '✨ ' : '') + s.nom + ' (' + s.prix + ' po)'; }).join(', ') + '.\n' + b.anecdote };
    }
    var v = L.etablissement.genererTout({}, {});
    return { gen: 'lieu', titre: v.taille.nom, nom: v.nom, liste: 'lieux',
      texte: v.nom + ' — ' + min1(v.taille.nom) + ' (' + v.taille.pop + '). ' + v.taille.note + '\nÉconomie : ' + v.specialite + '. Dirigé par ' + v.gouvernance +
        '.\nAmbiance : ' + min1(v.ambiance) + '. Problème du moment : ' + min1(v.probleme) + '\nNotable : ' + v.notable.nom +
        (v.notable.metier ? ', ' + min1(v.notable.metier) : '') + '.' };
  }
  function quete() {
    var q = COF.QueteCalc.genererTout({}, {});
    return { gen: 'quete', titre: 'Accroche', nom: maj(q.objectif).slice(0, 60), liste: 'fils', texte: COF.QueteCalc.accroche(q) };
  }
  function rumeur() { var r = COF.SoloCalc.GENS.rumeur.genererTout({}, {}); return { gen: 'rumeur', titre: 'Rumeur', texte: COF.SoloCalc.texteRumeur(r), liste: 'fils', nom: 'Rumeur : ' + r.sujet }; }
  function rebondissement() { var r = COF.IntrigueCalc.GENS.rebondissement.genererTout({}, {}); return { gen: 'rebond', titre: 'Rebondissement', texte: COF.IntrigueCalc.syntheseRebondissement(r) }; }
  function faction() { var f = COF.IntrigueCalc.GENS.faction.genererTout({}, {}); return { gen: 'faction', titre: 'Pendant ce temps…', texte: COF.IntrigueCalc.syntheseFaction(f), liste: 'pnj', nom: f.faction }; }
  function temps() { var t = COF.SoloCalc.GENS.temps.genererTout({}, {}); return { gen: 'temps', titre: 'Le temps passe', texte: COF.SoloCalc.texteTemps(t) }; }
  function marchand() {
    var m = COF.SoloCalc.GENS.marchand.genererTout({}, {}), p = COF.SoloCalc.prixMarchand(m);
    return { gen: 'marchand', titre: 'Marchandage', texte: m.attitude.nom + ' — ' + String(m.attitude.note).replace(/\.+$/, '') + '. Objet : ' + m.objet.nom + ' (achat ' + p.vente + ' po, revente ' + p.achat + ' po). ' + m.argument };
  }
  function salle() {
    var s = COF.DonjonCalc.genererTout({}, {});
    return { gen: 'salle', titre: 'Salle', texte: s.forme + '. ' + s.etat + '. Occupants : ' + min1(s.occupant) + '. Piège : ' + min1(s.piege) + '. ' + s.particularite + '. Sorties : ' + min1(s.sortie) + '.' };
  }
  function routeEvt(c) {
    var env = (COF.ENVIRONNEMENTS || []).filter(function (e) { return e.id === envCourant(c); })[0];
    var g = COF.VoyageCalc.genererTout({ lieu: true }, { lieu: env });
    return { gen: 'route', titre: (COF.VOYAGE_CATEGORIES_LABELS || {})[g.categorie] || 'En route', texte: g.meteo + '. ' + String(g.detail).replace(/\.+$/, '') + '.' };
  }

  /* ================= Rencontres ================= */
  var REACTIONS = [
    [2, 'hostile', 'Hostiles : elles attaquent sans sommation.'],
    [5, 'hostile', 'Hostiles : elles se préparent au combat.'],
    [8, 'mefiant', 'Méfiantes : elles observent, prêtes à réagir au moindre geste.'],
    [11, 'neutre', 'Indifférentes ou curieuses : elles ne cherchent pas le conflit.'],
    [99, 'amical', 'Bien disposées : une discussion est possible, voire une aide.']
  ];
  var DISTANCES = ['au contact, au détour d’un passage', 'à une dizaine de mètres', 'à une trentaine de mètres', 'au loin, encore hors de portée'];
  /* opts : { env, difficulte, style } */
  function rencontre(c, opts) {
    opts = opts || {};
    var env = opts.env || envCourant(c), nb = 1 + nbAllies(c), niv = niveau(c);
    var r = COF.Rencontre.generer({ env: env, nbPJ: nb, niveau: niv, difficulte: opts.difficulte || 'ordinaire', style: opts.style || 'auto' });
    if (!r || r.erreur) return { erreur: (r && r.erreur) || 'Aucune rencontre possible ici.' };
    var bestial = r.lots.every(function (l) { return l.c.cat !== 'humanoide'; });
    var jet = d(6) + d(6) - Math.round(((c ? c.tension : 5) - 5) / 2) - (bestial ? 1 : 0);
    var re = REACTIONS.filter(function (x) { return jet <= x[0]; })[0];
    var iDist = Math.floor(Math.random() * DISTANCES.length);
    var s = d(6), surprise = s === 1 ?'Les créatures sont surprises : le héros peut agir avant elles.' : (s === 6 ? 'Le héros est surpris !' : null);
    var obj = {
      id: 'r' + Date.now().toString(36), env: env, niveau: niv, nbPJ: nb, difficulte: r.difficulte, type: r.type, utilise: r.utilise,
      lots: r.lots.map(function (l) { return { id: l.c.id, nom: l.c.nom, nb: l.nb, role: l.role || null }; }),
      texte: r.lots.map(function (l) { return l.nb + ' × ' + l.c.nom + (l.role ? ' (' + l.role + ')' : ''); }).join(', '),
      reaction: re[1], reactionTexte: re[2], jetReaction: jet, distance: DISTANCES[iDist], distanceM: [3, 9, 24, 27][iDist], surprise: surprise, issue: null
    };
    if (c) c.envDernier = env;
    return obj;
  }
  /* Approches possibles et test associé (carac, difficulté). */
  function approches(r) {
    var base = { hostile: 15, mefiant: 12, neutre: 10, amical: 8 }[r.reaction] || 12;
    return [
      { id: 'parler', nom: '🗣️ Parlementer', carac: 'CHA', diff: base + (r.reaction === 'hostile' ? 3 : 0), action: 'Parlementer' },
      { id: 'eviter', nom: '🤫 Passer inaperçu', carac: 'AGI', diff: r.distance.indexOf('contact') >= 0 ? 18 : 13, action: 'Discrétion' },
      { id: 'fuir', nom: '🏃 Fuir', carac: 'AGI', diff: r.distance.indexOf('contact') >= 0 ? 16 : 12, action: 'Fuir' }
    ];
  }
  function resoudreApproche(r, approche, reussite) {
    var t;
    if (approche === 'parler') t = reussite ? 'La discussion désamorce la situation' + (r.reaction === 'amical' ? ' : les créatures pourraient même aider le héros.' : '.') : 'Les mots ne suffisent pas : le combat s’engage.';
    else if (approche === 'eviter') t = reussite ? 'Le héros passe sans être vu.' : 'Repéré ! Les créatures réagissent.';
    else t = reussite ? 'Le héros parvient à semer ses poursuivants.' : 'Impossible de fuir : il faut combattre.';
    r.issue = reussite ? approche : null;
    return { texte: t, combat: !reussite };
  }

  /* ================= Fin de combat ================= */
  function lotsComplets(r) {
    return r.lots.map(function (l) { return { c: COF.UI.Bestiaire.get(l.id), nb: l.nb, role: l.role }; }).filter(function (l) { return l.c; });
  }
  function butinDe(r) {
    var lots = lotsComplets(r);
    if (!lots.length) return null;
    return COF.Recompense.generer({ env: r.env, niveau: r.niveau, difficulte: r.difficulte, lots: lots,
      utilise: lots.reduce(function (s, l) { return s + l.nb * COF.Rencontre.pts(l.c); }, 0) });
  }
  function texteButin(b) {
    if (!b) return 'Rien.';
    var m = [b.po + ' po ' + b.pa + ' pa ' + b.pc + ' pc'];
    (b.objets || []).forEach(function (o) { m.push(o.nom); });
    (b.composants || []).forEach(function (o) { m.push(o.nom + (o.nb > 1 ? ' ×' + o.nb : '')); });
    (b.tresors || []).forEach(function (t) { m.push(t.nom); });
    if (b.magique) m.push('✨ ' + b.magique.nom);
    if (b.magique2) m.push('✨ ' + b.magique2.nom);
    return m.join(' · ');
  }
  /* Ajoute un butin au héros : pièces dans la bourse, objets à l'inventaire. */
  function encaisser(p, b) {
    if (!p || !b) return false;
    p.bourse = p.bourse || { po: 0, pa: 0, pc: 0 };
    p.bourse.po = (p.bourse.po || 0) + (b.po || 0); p.bourse.pa = (p.bourse.pa || 0) + (b.pa || 0); p.bourse.pc = (p.bourse.pc || 0) + (b.pc || 0);
    (b.objets || []).forEach(function (o) {
      COF.Store.ajouterObjet(p, o.dm ? { nom: o.nom, qte: 1, prix: o.prix || 0, dm: o.dm, armeType: o.armeType, noFor: o.noFor, note: o.note || null }
        : { nom: o.nom, qte: 1, prix: o.prix || 0, note: o.note || null });
    });
    (b.composants || []).forEach(function (o) { COF.Store.ajouterObjet(p, { nom: o.nom, qte: o.nb || 1, prix: o.prix || 0 }); });
    (b.tresors || []).forEach(function (t) { COF.Store.ajouterObjet(p, { nom: t.nom, qte: t.nb || 1, prix: t.prix || 0 }); });
    [b.magique, b.magique2].forEach(function (m) {
      if (m) COF.Store.ajouterObjet(p, m.item ? Object.assign({}, m.item, { nom: '✨ ' + m.item.nom }) : { nom: '✨ ' + m.nom, qte: 1, note: m.desc });
    });
    COF.Store.sauver(p);
    return true;
  }
  /* Recopie les PV des alliés de l'Arène vers le Carnet et la fiche. */
  function syncAllies(c) {
    var s = COF.Arene.lire(), p = heros(c);
    s.combattants.forEach(function (cb) {
      if (!cb.allie) return;
      (c.pnj || []).forEach(function (x) { if (x.compagnon && x.compagnon.actif && x.nom === cb.base) x.compagnon.pv = cb.pv; });
      if (p) (p.compagnons || []).forEach(function (inst) {
        var tpl = COF.COMPAGNONS && COF.COMPAGNONS[inst.templateId];
        if ((inst.nom || (tpl && tpl.nom)) === cb.base) inst.pv = cb.pv;
      });
    });
    if (p) COF.Store.sauver(p);
  }
  /* Bilan : créatures à terre / en fuite / rendues. */
  function bilanArene() {
    var s = COF.Arene.lire(), o = { ko: 0, fuite: 0, rendu: 0, debout: 0, total: 0 };
    s.combattants.forEach(function (cb) {
      if (cb.type !== 'creature' || cb.allie) return;
      o.total++;
      if (cb.pv <= 0) o.ko++; else if (cb.moral === 'fuite') o.fuite++; else if (cb.moral === 'reddition') o.rendu++; else o.debout++;
    });
    return o;
  }

  return {
    heros: heros, envCourant: envCourant, nbAllies: nbAllies, testRencontre: testRencontre, RISQUE: RISQUE,
    pnj: pnj, lieu: lieu, quete: quete, rumeur: rumeur, rebondissement: rebondissement, faction: faction,
    temps: temps, marchand: marchand, salle: salle, routeEvt: routeEvt, attitudeCarnet: attitudeCarnet,
    rencontre: rencontre, approches: approches, resoudreApproche: resoudreApproche,
    butinDe: butinDe, texteButin: texteButin, encaisser: encaisser, syncAllies: syncAllies, bilanArene: bilanArene
  };
})();
