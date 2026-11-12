/* ============================================================
   COF2 Compagnon — Factions (aventure solo)
   Six puissances se partagent la région : la garde, le temple, la
   guilde des marchands, la pègre, la noblesse et un cercle de mages.
   Chacune a sa réputation auprès du héros (−3 à +3). Les petites
   affaires, les imprévus et les conversations la font bouger ; aider
   une faction fâche parfois sa rivale (garde ⇄ pègre, temple ⇄ mages,
   guilde ⇄ noblesse).
   - Réputation ≥ 2 : la faction accorde une faveur (soins, prêt,
     information, objet, recommandation…), une fois tous les 3 jours.
   - Réputation ≤ −2 : elle agit contre le héros (amende, menaces…).
   ============================================================ */
window.COF = window.COF || {};

COF.Factions = (function () {
  function p(l) { return l[Math.floor(Math.random() * l.length)]; }
  function d(n) { return 1 + Math.floor(Math.random() * n); }
  function T() { return COF.Conteur; }

  var TYPES = {
    garde: { ic: '🛡️', noms: ['la Garde du Comté', 'les Lames d’Argent', 'la Milice des Marches'], rival: 'pegre' },
    temple: { ic: '🕯️', noms: ['le Temple de l’Aube', 'l’Église de la Mère Bienveillante', 'les Gardiens de la Flamme'], rival: 'mages' },
    guilde: { ic: '⚖️', noms: ['la Guilde des Marchands', 'la Compagnie des Routes', 'la Hanse du Fleuve'], rival: 'noblesse' },
    pegre: { ic: '🗝️', noms: ['les Chats Noirs', 'la Confrérie du Pavé', 'les Fils de la Nuit'], rival: 'garde' },
    noblesse: { ic: '👑', noms: ['la Maison Valcourt', 'la Maison d’Aubrecœur', 'la Cour du Duc'], rival: 'guilde' },
    mages: { ic: '🔮', noms: ['le Cercle des Arcanistes', 'la Tour d’Améthyste', 'le Collège des Sept Étoiles'], rival: 'temple' }
  };
  /* Quelle faction s'intéresse à quelle petite affaire. */
  var DE_MISSION = { voleur: 'garde', trafic: 'garde', meurtre: 'garde', troupeau: 'garde', bete: 'garde', disparu: 'garde', garde: 'guilde',
    livraison: 'guilde', escorte: 'guilde', pont: 'guilde', apprenti: 'guilde', perdu: 'guilde', message: 'noblesse', concours: 'noblesse',
    mariage: 'noblesse', dispute: 'noblesse', prophete: 'temple', hante: 'temple', malade: 'temple', cueillette: 'mages', tresor: 'mages', dette: 'pegre' };

  /* Noms ancrés dans la région : la maison noble porte un nom de famille du pays,
     la garde celui de la ville la plus proche (sinon un nom générique). */
  function nomLocal(c, k) {
    var villes = (c.lieux || []).filter(function (l) { return l.ville; }), ici = COF.Monde && COF.Monde.ici(c);
    var v = ici && ici.ville ? ici : villes[0];
    if (k === 'noblesse' && Math.random() < 0.7) {
      var pe = v && v.peuple && COF.PNJ_NOMS[v.peuple] && COF.PNJ_NOMS[v.peuple].famille ? v.peuple : 'humain';
      var fam = p(COF.PNJ_NOMS[pe].famille);
      return 'la Maison ' + fam;
    }
    if (k === 'garde' && v && Math.random() < 0.7 && COF.Conteur) return p(['la Garde ', 'la Milice ']) + COF.Conteur.formes(v.nom).de;
    if (k === 'temple' && v && v.peuple === 'nain' && Math.random() < 0.6) return p(['le Temple de la Forge Éternelle', 'les Gardiens de l’Enclume']);
    if (k === 'temple' && v && /elfe/.test(v.peuple || '') && Math.random() < 0.6) return p(['le Sanctuaire des Étoiles', 'les Veilleurs de la Lune']);
    return null;
  }
  function liste(c) {
    if (!c.factions) {
      /* noms tirés une fois pour toutes (et enregistrés aussitôt) */
      c.factions = Object.keys(TYPES).map(function (k) { return { id: k, nom: nomLocal(c, k) || p(TYPES[k].noms), ic: TYPES[k].ic, rep: 0, faveur: -99 }; });
      if (c.id && COF.Carnet && COF.Carnet.get && COF.Carnet.get(c.id)) COF.Carnet.sauver(c);
    }
    return c.factions;
  }
  function get(c, id) { return liste(c).filter(function (f) { return f.id === id; })[0] || null; }
  function lib(r) { return r >= 3 ? 'dévouée' : r === 2 ? 'amicale' : r === 1 ? 'bienveillante' : r === 0 ? 'indifférente' : r === -1 ? 'méfiante' : r === -2 ? 'hostile' : 'ennemie'; }
  /* Change la réputation (et parfois celle de la rivale). Renvoie la note. */
  function changer(c, id, n) {
    var f = get(c, id); if (!f || !n) return '';
    var av = f.rep; f.rep = Math.max(-3, Math.min(3, f.rep + n));
    if (f.rep === av) return '';
    var txt = f.ic + ' ' + maj(f.nom) + ' : ' + lib(f.rep) + ' (' + (f.rep > 0 ? '+' : '') + f.rep + ')';
    if (n > 0 && Math.random() < 0.5) {
      var r = get(c, TYPES[id].rival); if (r && r.rep > -3) { r.rep--; txt += ' · ' + r.ic + ' ' + r.nom + ' le voit d’un mauvais œil (' + r.rep + ')'; }
    }
    return txt;
  }
  function maj(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }
  function pourMission(c, type, ok) { var id = DE_MISSION[type]; return id ? changer(c, id, ok ? 1 : -1) : ''; }

  /* ---------- Faveurs (réputation ≥ 2) ---------- */
  var FAVEURS = {
    garde: function (c) { var n = COF.Saga && c.saga && !c.saga.fini ? COF.Saga.indice(c) : null; return 'Un officier glisse au héros ce que la garde sait de l’affaire en cours.' + (n ? '\n' + n : ''); },
    temple: function (c) {
      var h = T().heros(c); if (!h) return null;
      if (h.pv === null || h.pv === undefined) COF.Store.reinitialiser(h);
      h.pv = COF.Calc.pvMax(h); h.etats = []; COF.Store.sauver(h);
      return 'Les prêtres soignent le héros sans rien demander : PV au maximum, états effacés.';
    },
    guilde: function (c) { var po = (d(6) + 4) * T().niveau(c); T().payer(c, po); return 'La guilde avance au héros une bourse de ' + po + ' po, « entre amis ».'; },
    pegre: function (c) {
      var h = T().heros(c), o = COF.Recompense && COF.Recompense.tirerObjetLivre(T().niveau(c) + 1, p(['objet', 'arme', 'potion']));
      if (!h || !o) return null;
      COF.Store.ajouterObjet(h, Object.assign({}, o.item, { nom: '✨ ' + o.item.nom, qte: 1 })); COF.Store.sauver(h);
      return 'Un « ami » de la pègre remet au héros un objet tombé d’une charrette : ' + o.nom + '.';
    },
    noblesse: function (c) {
      var l = COF.Monde.ici(c), t = 'Une lettre de recommandation, scellée aux armes de la maison.';
      if (l && l.ville && COF.Saga) { var r = COF.Saga.changerRep(l, 2); if (r) t += ' ' + r; }
      T().payer(c, d(6) * T().niveau(c)); return t;
    },
    mages: function (c) {
      var h = T().heros(c); if (h) { h.pm = COF.Calc.pmMax(h); COF.Store.sauver(h); }
      var ru = COF.Aventure.rumeur(); COF.Carnet.ajouterListe(c, 'fils', { nom: ru.nom, note: 'Révélé par les mages.\n' + ru.texte });
      return 'Les mages restaurent les forces magiques du héros et lui révèlent une piste : ' + ru.nom + '.';
    }
  };
  function faveursDispo(c) {
    return liste(c).filter(function (f) { return f.rep >= 2 && c.jour - (f.faveur || -99) >= 3; });
  }
  function faveur(c, id) {
    var f = get(c, id); if (!f || f.rep < 2) return null;
    f.faveur = c.jour;
    var t = FAVEURS[id] ? FAVEURS[id](c) : null;
    COF.Carnet.sauver(c);
    return t ? f.ic + ' ' + maj(f.nom) + ' : ' + t : null;
  }
  /* ---------- Une faction hostile agit (nouvelles entre les scènes) ---------- */
  function represailles(c) {
    var h = liste(c).filter(function (f) { return f.rep <= -2; }); if (!h.length) return null;
    var f = p(h), heros = T().heros(c);
    if (f.id === 'garde' && heros) { heros.bourse = heros.bourse || { po: 0 }; var a = Math.min(heros.bourse.po || 0, d(6) * T().niveau(c)); heros.bourse.po -= a; COF.Store.sauver(heros); return f.ic + ' ' + maj(f.nom) + ' inflige une amende au héros : −' + a + ' po.'; }
    c.tension = Math.min(9, c.tension + 1);
    return f.ic + ' ' + maj(f.nom) + ' fait savoir que le héros n’est pas le bienvenu. Des regards le suivent partout (tension +1).';
  }
  return { TYPES: TYPES, liste: liste, get: get, lib: lib, changer: changer, pourMission: pourMission, faveursDispo: faveursDispo, faveur: faveur, represailles: represailles };
})();
