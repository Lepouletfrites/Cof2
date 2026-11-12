/* ============================================================
   COF2 Compagnon — Expéditions du Carnet d'aventure (jeu en solo)
   Deux modes, une expédition en cours à la fois par aventure :
     🗝️ Donjon : une suite de salles enregistrées (architecture,
        état, occupants, piège, particularité, sorties), avec leur
        statut (en cours / explorée / vidée), une rencontre tirée au
        niveau du héros quand des occupants hostiles sont présents,
        la fouille et une salle finale plus dangereuse.
     🧭 Voyage : un trajet découpé en jours — météo, événement de
        route, rencontre possible (plus fréquente si la tension est
        haute), rations décomptées, arrivée ajoutée aux lieux.
   Tout est consigné dans la scène en cours du carnet.
   + Tests guidés : difficulté estimée par l'oracle, conséquences
     d'un échec et avantages d'une réussite critique.
   ============================================================ */
window.COF = window.COF || {};

COF.Expedition = (function () {
  var piocher = COF.piocher, K = function () { return COF.Carnet; };
  function d(n) { return 1 + Math.floor(Math.random() * n); }

  /* Occupants hostiles (indices de COF.DONJON_OCCUPANTS) → composition */
  var HOSTILES = { 1: 'solo', 2: 'bande', 4: 'solo', 5: 'bande', 6: 'solo', 8: 'solo', 9: 'meute' };
  function indexOccupant(txt) { return (COF.DONJON_OCCUPANTS || []).indexOf(txt); }
  function estPiege(txt) { return !/^Aucun piège/.test(txt || ''); }

  function niveauPerso(c) {
    var p = (c.persoId && COF.Store.get(c.persoId)) || COF.Store.actif();
    return p ? (p.niveau || 1) : 1;
  }

  /* Rencontre stockée légère (ids du bestiaire) + texte. */
  function tirerRencontre(env, niveau, difficulte, style, nb) {
    /* calibrée sur le héros + ses compagnons (et non sur un groupe de 4) */
    var r = COF.Rencontre.generer({ env: env, nbPJ: Math.max(1, nb || 1), niveau: niveau, difficulte: difficulte || 'ordinaire', style: style || 'auto' });
    if (!r || r.erreur) return null;
    return { lots: r.lots.map(function (l) { return { id: l.c.id, nom: l.c.nom, nb: l.nb, role: l.role || null }; }),
      texte: r.lots.map(function (l) { return l.nb + ' × ' + l.c.nom + (l.role ? ' (' + l.role + ')' : ''); }).join(', '),
      difficulte: difficulte || 'ordinaire' };
  }

  /* Taille du groupe : le héros et ses compagnons. */
  function taille(c) { return 1 + (COF.Aventure ? COF.Aventure.nbAllies(c) : 0); }

  /* ================= Donjon ================= */
  var TAILLES = { petit: 5, moyen: 8, grand: 12 };
  function commencerDonjon(c, nom, taille, env) {
    c.expedition = { type: 'donjon', nom: nom || 'Donjon', taille: TAILLES[taille] ? taille : 'moyen', nbSalles: TAILLES[taille] || 8,
      env: env || 'ruines', niveau: niveauPerso(c), salles: [], fini: false, debut: Date.now() };
    K().ajouterEntree(c, { t: 'note', titre: 'Expédition', txt: 'Entrée dans « ' + c.expedition.nom + ' » (' + c.expedition.nbSalles + ' salles environ).' });
    return c.expedition;
  }
  /* La salle courante est la dernière visitée. État d'une salle pour le
     plan : courante, vidée (menace écartée ou absente) ou explorée. */
  function salleCourante(x) { return x && x.salles ? x.salles[x.salles.length - 1] || null : null; }
  function etatSalle(x, s) {
    if (s === salleCourante(x)) return 'courante';
    return !s.rencontre || s.vaincue ? 'videe' : 'exploree';
  }
  function salleSuivante(c) {
    var x = c.expedition; if (!x || x.type !== 'donjon') return null;
    var finale = x.salles.length + 1 >= x.nbSalles;
    var ch = COF.DonjonCalc.genererTout({}, {});
    /* La table brute place un piège presque partout : en expédition, on
       n'en garde qu'environ un sur trois pour garder le rythme. */
    if (estPiege(ch.piege) && Math.random() < 0.6) ch.piege = COF.DONJON_PIEGES[0];
    var s = { n: x.salles.length + 1, champs: ch, finale: finale, piege: estPiege(ch.piege), fouillee: false };
    var idx = indexOccupant(ch.occupant);
    /* La salle finale abrite toujours une menace, plus difficile. */
    if (finale) s.rencontre = tirerRencontre(x.env, x.niveau, 'difficile', 'auto', taille(c));
    else if (HOSTILES[idx]) s.rencontre = tirerRencontre(x.env, x.niveau, Math.random() < 0.25 ? 'difficile' : 'ordinaire', HOSTILES[idx], taille(c));
    x.salles.push(s);
    /* Lumière : une torche dure environ quatre salles. */
    var resL = ressources(c), torche = '';
    if (s.n > 1 && (s.n - 1) % 4 === 0) {
      if (resL.torches > 0) { resL.torches--; torche = '\n🔥 Une torche s’éteint (' + resL.torches + ' restante(s)).'; }
      else torche = '\n🔥 Plus de torches : obscurité (dé malus aux tests de vue, sauf vision dans le noir).';
    }
    K().ajouterEntree(c, { t: 'note', titre: 'Salle ' + s.n + (finale ? ' (salle finale)' : ''), txt: texteSalle(s) + torche });
    return s;
  }
  function texteSalle(s) {
    var ch = s.champs;
    return ch.forme + '. ' + ch.etat + '.\nOccupants : ' + ch.occupant + (s.rencontre ? ' → ' + s.rencontre.texte : '') +
      '.\nPiège : ' + ch.piege + '.\n' + ch.particularite + '.\nSorties : ' + ch.sortie + '.';
  }
  function marquerVaincue(c) {
    var s = salleCourante(c.expedition); if (!s) return;
    s.vaincue = true;
    K().ajouterEntree(c, { t: 'note', titre: 'Salle ' + s.n, txt: 'Menace écartée' + (s.rencontre ? ' : ' + s.rencontre.texte : '') + '.' });
  }
  function fouiller(c) {
    var x = c.expedition, s = salleCourante(x); if (!s || s.fouillee) return null;
    s.fouillee = true;
    var b = s.finale || (s.rencontre && s.vaincue && Math.random() < 0.5)
      ? COF.Recompense.genererCoffre({ niveau: x.niveau, richesse: s.finale ? 'riche' : 'standard', env: x.env })
      : COF.Recompense.genererFouille({ niveau: x.niveau, richesse: 'standard', env: x.env });
    var morceaux = [b.po + ' po, ' + b.pa + ' pa, ' + b.pc + ' pc'];
    (b.objets || []).forEach(function (o) { morceaux.push(o.nom); });
    (b.tresors || []).forEach(function (t) { morceaux.push(t.nom + ' (' + t.prix + ' po)'); });
    if (b.magique) morceaux.push('✨ ' + b.magique.nom);
    if (b.magique2) morceaux.push('✨ ' + b.magique2.nom);
    s.butin = b;
    K().ajouterEntree(c, { t: 'note', titre: 'Fouille salle ' + s.n, txt: morceaux.join(' · ') });
    return b;
  }
  /* Ajoute le butin de la salle courante au héros (pièces + objets). */
  function prendreButin(c, p) {
    var s = salleCourante(c.expedition); if (!s || !s.butin || s.butinPris || !p) return false;
    var b = s.butin;
    p.bourse = p.bourse || { po: 0, pa: 0, pc: 0 };
    p.bourse.po = (p.bourse.po || 0) + b.po; p.bourse.pa = (p.bourse.pa || 0) + b.pa; p.bourse.pc = (p.bourse.pc || 0) + b.pc;
    (b.objets || []).forEach(function (o) { COF.Store.ajouterObjet(p, { nom: o.nom, qte: 1, prix: o.prix || 0, note: o.note || null }); });
    (b.tresors || []).forEach(function (t) { COF.Store.ajouterObjet(p, { nom: t.nom, qte: 1, prix: t.prix || 0 }); });
    [b.magique, b.magique2].forEach(function (m) {
      if (m) COF.Store.ajouterObjet(p, m.item ? Object.assign({}, m.item, { nom: '✨ ' + m.item.nom }) : { nom: '✨ ' + m.nom, qte: 1, note: m.desc });
    });
    COF.Store.sauver(p);
    s.butinPris = true;
    return true;
  }
  function quitter(c, motif) {
    var x = c.expedition; if (!x) return;
    var nbV = (x.salles || []).filter(function (s) { return !s.rencontre || s.vaincue; }).length;
    K().ajouterEntree(c, { t: 'note', titre: 'Expédition', txt: (x.type === 'donjon'
      ? 'Sortie de « ' + x.nom + ' » : ' + x.salles.length + ' salle(s) explorée(s), ' + nbV + ' vidée(s).'
      : (motif || 'Voyage interrompu') + ' — ' + x.depart + ' → ' + x.destination + ', jour ' + x.fait + '/' + x.jours + '.') });
    if (x.type === 'donjon' && !c.lieux.some(function (l) { return l.nom === x.nom; })) {
      if (COF.Monde) {
        var ld = COF.Monde.obtenirLieu(c, x.nom, COF.Monde.ici(c), '🗝️ ' + x.salles.length + ' salle(s) explorée(s) le jour ' + c.jour + '.', x.env === 'souterrain' ? 'souterrain' : 'ruines');
        var here = COF.Monde.ici(c);
        if (here && here.id !== ld.id && !COF.Monde.route(c, here.id, ld.id)) COF.Monde.relier(c, here.id, ld.id, 1, x.env);
      } else K().ajouterListe(c, 'lieux', { nom: x.nom, note: x.salles.length + ' salle(s) explorée(s) le jour ' + c.jour + '.' });
    }
    c.expedition = null;
  }

  /* ================= Voyage ================= */
  function commencerVoyage(c, depart, destination, jours, env, rations) {
    c.expedition = { type: 'voyage', depart: depart || 'Ici', destination: destination || 'Ailleurs', jours: Math.max(1, Math.min(30, jours || 3)),
      fait: 0, env: env || 'plaine', niveau: niveauPerso(c), etapes: [], debut: Date.now() };
    if (typeof rations === 'number') ressources(c).rations = Math.max(0, rations);
    /* Carte du monde : le départ et l'arrivée deviennent des lieux. */
    if (COF.Monde) {
      COF.Monde.assurer(c);
      var ld = COF.Monde.obtenirLieu(c, c.expedition.depart, COF.Monde.ici(c));
      var la = COF.Monde.obtenirLieu(c, c.expedition.destination, ld, '', COF.Monde.devinerEnv(c.expedition.destination) || c.expedition.env);
      c.expedition.departId = ld.id; c.expedition.destId = la.id;
      if (!c.position) c.position = ld.id;
    }
    K().ajouterEntree(c, { t: 'note', titre: 'Voyage', txt: 'Départ de ' + c.expedition.depart + ' vers ' + c.expedition.destination +
      ' (' + c.expedition.jours + ' jour(s), ' + ressources(c).rations + ' ration(s)).' });
    return c.expedition;
  }
  function etapeSuivante(c) {
    var x = c.expedition; if (!x || x.type !== 'voyage') return null;
    x.fait++; c.jour++;
    var env = (COF.ENVIRONNEMENTS || []).filter(function (e) { return e.id === x.env; })[0];
    var g = COF.VoyageCalc.genererTout({ lieu: true }, { lieu: env });
    var et = { jour: x.fait, meteo: g.meteo, categorie: g.categorie, detail: g.detail };
    /* Rencontre : 1 sur d6 (1-2 si tension ≥ 7), et la nuit 1 sur d8. */
    var seuil = c.tension >= 7 ? 2 : 1;
    if (d(6) <= seuil) et.rencontre = tirerRencontre(x.env, x.niveau, 'ordinaire', 'auto', taille(c));
    else if (d(8) === 1) { et.rencontre = tirerRencontre(x.env, x.niveau, 'facile', 'auto', taille(c)); if (et.rencontre) et.nuit = true; }
    /* Découverte : 1 chance sur 5 de repérer un lieu inconnu le long de la route */
    if (!et.rencontre && COF.Monde && x.departId && x.destId && d(5) === 1) {
      var ld0 = COF.Monde.lieu(c, x.departId), la0 = COF.Monde.lieu(c, x.destId);
      var nv = COF.Monde.decouvrir(c, ld0, la0, Math.min(0.9, x.fait / Math.max(1, x.jours)), x.env);
      if (nv) et.decouverte = { id: nv.id, nom: nv.nom, env: nv.env };
    }
    var res = ressources(c);
    if (res.rations > 0) res.rations--; else et.faim = true;
    x.etapes.push(et);
    var lbl = (COF.VOYAGE_CATEGORIES_LABELS || {})[g.categorie] || g.categorie;
    var txt = 'Jour ' + c.jour + ' (' + x.fait + '/' + x.jours + ') — ' + g.meteo + '.\n' + lbl + ' : ' + g.detail + '.' +
      (et.rencontre ? '\n⚔️ ' + (et.nuit ? 'Pendant la nuit : ' : 'Rencontre : ') + et.rencontre.texte + '.' : '') +
      (et.decouverte ? '\n🗺️ Découverte : ' + et.decouverte.nom + ' (ajouté à la carte).' : '') +
      (et.faim ? '\n🍖 Plus de rations !' : '\n🍖 Rations restantes : ' + res.rations + '.');
    K().ajouterEntree(c, { t: 'note', titre: 'Voyage', txt: txt });
    if (x.fait >= x.jours) {
      K().ajouterEntree(c, { t: 'note', titre: 'Arrivée', txt: 'Arrivée à ' + x.destination + ' au jour ' + c.jour + '.' });
      if (COF.Monde && x.departId && x.destId) {
        if (!COF.Monde.route(c, x.departId, x.destId)) COF.Monde.relier(c, x.departId, x.destId, x.fait, x.env);
        COF.Monde.seRendre(c, x.destId);
      } else if (!c.lieux.some(function (l) { return l.nom === x.destination; })) K().ajouterListe(c, 'lieux', { nom: x.destination, note: 'Atteint le jour ' + c.jour + '.' });
      x.arrive = true;
    }
    return et;
  }

  /* ================= Ressources du héros (par aventure) ================= */
  function ressources(c) {
    c.ressources = c.ressources || { rations: 3, torches: 2 };
    return c.ressources;
  }

  /* ================= Compagnons d'aventure =================
     Un PNJ du carnet peut rejoindre le héros. Profil simplifié, calculé
     sur son niveau et son rôle (approximation maison, modifiable). */
  var ROLES = {
    combattant: { nom: 'Combattant', ic: '🗡️', att: 'Arme', dm: function (n) { return '1d8+' + (1 + Math.floor(n / 3)); },
      pv: function (n) { return 10 + 5 * n; }, def: function (n) { return 13 + Math.floor(n / 2); } },
    tireur: { nom: 'Tireur', ic: '🏹', att: 'Arc', dm: function (n) { return '1d8+' + Math.floor(n / 3); },
      pv: function (n) { return 8 + 4 * n; }, def: function (n) { return 12 + Math.floor(n / 2); } },
    mystique: { nom: 'Mystique', ic: '✨', att: 'Sort', dm: function (n) { return (1 + Math.floor(n / 4)) + 'd6'; },
      pv: function (n) { return 6 + 3 * n; }, def: function (n) { return 11 + Math.floor(n / 2); } }
  };
  function statsAllie(x) {
    var a = x.compagnon || {}, n = Math.max(1, a.niveau || 1), R = ROLES[a.role] || ROLES.combattant;
    return { nom: x.nom, niveau: n, role: a.role || 'combattant', pvMax: R.pv(n), def: R.def(n), init: 10 + Math.floor(n / 2),
      att: [{ n: R.att, mod: 2 + n, dmg: R.dm(n) }] };
  }
  function allies(c) { return (c.pnj || []).filter(function (x) { return x.compagnon && x.compagnon.actif; }); }

  /* Envoie une rencontre stockée dans l'Arène : nouveau combat avec le
     héros, ses compagnons de voie (loup, familier…) et ses alliés. */
  function versArene(c, rencontre) {
    if (!rencontre) return false;
    var s = COF.Arene.vider();
    s.distanceDepart = typeof rencontre.distanceM === 'number' ? rencontre.distanceM : (c.expedition && c.expedition.type === 'donjon' ? 10 : 25);
    s.env = rencontre.env || (c.expedition && c.expedition.env) || (COF.Aventure ? COF.Aventure.envCourant(c) : '');
    s.surprise = /héros est surpris/i.test(rencontre.surprise || '') ? 'heros' : (/créatures sont surprises/i.test(rencontre.surprise || '') ? 'monstres' : null);
    rencontre.lots.forEach(function (l) {
      var cr = l.inline || (COF.UI.Bestiaire && COF.UI.Bestiaire.get(l.id));   /* inline : chef nommé d'une aventure */
      if (cr) for (var i = 0; i < l.nb; i++) COF.Arene.ajouterCreature(s, cr, l.role);
    });
    var p = (c.persoId && COF.Store.get(c.persoId)) || COF.Store.actif();
    if (p) {
      COF.Arene.ajouterPersonnage(s, p);
      (p.compagnons || []).forEach(function (inst) {
        var tpl = COF.COMPAGNONS && COF.COMPAGNONS[inst.templateId];
        if (!tpl || !COF.CompagnonCalc) return;
        var st = COF.CompagnonCalc.stats(tpl, p);
        var cb = COF.Arene.ajouterCreature(s, { nom: inst.nom || tpl.nom, id: null, pv: st.pvMax, def: st.def, init: st.init, nc: p.niveau || 1,
          att: st.attaqueMod !== null ? [{ n: 'Attaque', mod: st.attaqueMod, dmg: st.dmg }] : [] }, null);
        cb.allie = true;
        if (inst.pv !== null && inst.pv !== undefined) cb.pv = Math.min(cb.pvMax, inst.pv);
      });
    }
    allies(c).forEach(function (x) {
      var st = statsAllie(x);
      var cb = COF.Arene.ajouterCreature(s, { nom: x.nom, id: null, pv: st.pvMax, def: st.def, init: st.init, nc: st.niveau, att: st.att }, null);
      cb.allie = true;
      if (typeof x.compagnon.pv === 'number') cb.pv = Math.max(0, Math.min(cb.pvMax, x.compagnon.pv));
    });
    /* Ordre d'initiative dès le départ */
    var init = function (cb) {
      if (cb.type !== 'pj') return cb.init || 0;
      var pp = COF.Store.get(cb.refId); return pp ? COF.Calc.init(pp) : 0;
    };
    s.combattants.sort(function (a, b) { return init(b) - init(a); });
    s.tour = 0;
    /* Surprise : le camp surpris ne joue pas au premier round. */
    if (s.surprise) s.combattants.forEach(function (cb) {
      if (COF.Arene.camp(cb) === (s.surprise === 'heros' ? 'heros' : 'monstres')) cb.etats.push('surpris');
    });
    COF.Arene.ecrire(s);
    return true;
  }

  /* ================= Effets des tests proposés en expédition =================
     effet : 'fouille' | 'detecter' | 'desamorcer' | 'orienter' | 'chasser'.
     Renvoie le texte de l'effet (consigné avec le test). */
  function appliquerTest(c, effet, r) {
    var x = c.expedition, s = x && x.type === 'donjon' ? salleCourante(x) : null, ok = !!r.reussite;
    var p = (c.persoId && COF.Store.get(c.persoId)) || COF.Store.actif();
    if (effet === 'fouille' && s) {
      if (!ok) { s.fouillee = true; return "Vous ne trouvez rien d'intéressant ici."; }
      s.fouillee = false; fouiller(c);
      return 'Fouille réussie : voir le butin de la salle.';
    }
    if (effet === 'detecter' && s) {
      if (ok) { s.piegeRepere = true; return 'Piège repéré : vous pouvez le désamorcer ou le contourner.'; }
      return declencher(c, s, p);
    }
    if (effet === 'desamorcer' && s) {
      if (ok) { s.piege = false; s.piegeNeutralise = true; return 'Piège neutralisé.'; }
      return r.fumble || !s.piegeRepere ? declencher(c, s, p) : 'Échec : le mécanisme résiste, mais rien ne se déclenche (vous pouvez réessayer).';
    }
    var etV = x && x.type === 'voyage' ? x.etapes[x.etapes.length - 1] : null;
    if (etV && effet === 'orienter') etV.oriente = true;
    if (etV && effet === 'chasser') etV.chasse = true;
    if (effet === 'orienter' && x && x.type === 'voyage') {
      if (ok) return 'Vous gardez le bon cap.';
      x.jours++; x.arrive = false; return 'Vous vous égarez : le voyage prend un jour de plus (' + x.jours + ' jours).';
    }
    if (effet === 'chasser' && x && x.type === 'voyage') {
      if (!ok) return 'La chasse ne donne rien aujourd’hui.';
      var g = d(4); ressources(c).rations += g; return 'Chasse fructueuse : +' + g + ' ration(s) (' + ressources(c).rations + ').';
    }
    return null;
  }
  /* Piège déclenché : (1 + niveau/4) d6 DM, appliqués aux PV du héros. */
  function declencher(c, s, p) {
    var n = 1 + Math.floor((c.expedition.niveau || 1) / 4), tot = 0;
    for (var i = 0; i < n; i++) tot += d(6);
    s.piege = false; s.piegeDeclenche = true;
    if (p) {
      if (p.pv === null || p.pv === undefined) COF.Store.reinitialiser(p);
      p.pv = Math.max(0, p.pv - tot); COF.Store.sauver(p);
      return 'Le piège se déclenche : ' + n + 'd6 = ' + tot + ' DM (' + p.pv + '/' + COF.Calc.pvMax(p) + ' PV).';
    }
    return 'Le piège se déclenche : ' + n + 'd6 = ' + tot + ' DM.';
  }

  /* ================= Tests guidés ================= */
  var ACTIONS = [
    ['Escalader', 'FOR', 'escalade'], ['Nager', 'FOR', 'natation'], ['Forcer / enfoncer', 'FOR', 'force'],
    ['Crocheter', 'AGI', 'crochet'], ['Discrétion', 'AGI', 'discrétion'], ['Acrobatie', 'AGI', 'acrobatie'],
    ['Endurer', 'CON', 'endurance'], ['Résister au poison', 'CON', 'poison'],
    ['Repérer / fouiller', 'PER', 'perception'], ['Pister', 'PER', 'pist'], ['Survie', 'PER', 'survie'],
    ['Persuader', 'CHA', 'persuasion'], ['Intimider', 'CHA', 'intimid'], ['Mentir / bluffer', 'CHA', 'bluff'],
    ['Se souvenir / savoir', 'INT', 'connaissance'], ['Déchiffrer', 'INT', 'déchiffr'], ['Soigner', 'INT', 'soin'],
    ['Résister à la peur', 'VOL', 'peur'], ['Se concentrer', 'VOL', 'concentration']
  ];
  /* Bonus de compétence des voies du héros qui concernent l'action. */
  function bonusPour(p, motCle) {
    if (!p || !motCle) return [];
    var m = motCle.toLowerCase();
    return COF.Calc.competences(p).filter(function (x) {
      return x.valeur && String(x.nom).toLowerCase().indexOf(m) >= 0;
    });
  }
  function toutesCompetences(p) {
    return p ? COF.Calc.competences(p).filter(function (x) { return x.valeur; }) : [];
  }
  /* L'oracle estime la difficulté (la tension rend les choses plus dures). */
  var PALIERS = [[10, 'Facile'], [12, 'Simple'], [15, 'Moyenne'], [15, 'Moyenne'], [18, 'Ardue'], [20, 'Difficile']];
  function difficulteOracle(tension) {
    var i = d(6) - 1 + (tension >= 7 ? 1 : 0) - (tension <= 3 ? 1 : 0);
    i = Math.max(0, Math.min(PALIERS.length - 1, i));
    var r = PALIERS[i];
    if (tension >= 9 && i === PALIERS.length - 1) r = [25, 'Héroïque'];
    return { diff: r[0], nom: r[1] };
  }
  var CONSEQUENCES = [
    "Ça prend bien plus longtemps que prévu (une heure perdue, ou un tour de jeu).",
    "Du bruit : quelqu'un ou quelque chose a entendu.",
    "Petite blessure : 1d4° DM.",
    "Un outil, une arme ou une pièce d'équipement est abîmé.",
    "Vous y arrivez, mais à un prix : choisissez une perte (temps, objet, PV, réputation).",
    "La situation s'aggrave : un nouveau danger apparaît.",
    "Un PNJ remarque l'échec et s'en souviendra.",
    "La voie est fermée : il faudra trouver une autre approche.",
    "Vous pouvez réessayer, mais avec un dé malus.",
    "Fatigue : dé malus au prochain test physique.",
    "Vous laissez une trace derrière vous.",
    "Vous vous retrouvez en mauvaise posture (position exposée, encerclé, coincé)."
  ];
  var CONSEQUENCES_GRAVES = [
    "Échec cuisant : 2d4° DM ou un état préjudiciable (au choix du contexte).",
    "Catastrophe : l'opposition est alertée et passe à l'action.",
    "L'objet ou le passage est détruit : plus de seconde chance.",
    "Vous perdez quelque chose d'important (objet, allié, information)."
  ];
  var AVANTAGES = [
    "Dé bonus au prochain test lié.", "Vous apprenez quelque chose de plus que prévu.",
    "Ça va beaucoup plus vite que prévu.", "Vous gagnez l'initiative sur la suite.",
    "Un PNJ est impressionné : son attitude s'améliore.", "Vous repérez une opportunité inattendue."
  ];
  function consequence(r) {
    if (r.crit) return '⭐ ' + piocher(AVANTAGES);
    if (r.fumble) return '💥 ' + piocher(CONSEQUENCES_GRAVES);
    if (!r.reussite) return '⚠️ ' + piocher(CONSEQUENCES);
    return null;
  }

  return {
    TAILLES: TAILLES, commencerDonjon: commencerDonjon, salleCourante: salleCourante, etatSalle: etatSalle, salleSuivante: salleSuivante,
    marquerVaincue: marquerVaincue, fouiller: fouiller, prendreButin: prendreButin, quitter: quitter,
    commencerVoyage: commencerVoyage, etapeSuivante: etapeSuivante, versArene: versArene, texteSalle: texteSalle,
    appliquerTest: appliquerTest, ressources: ressources, ROLES: ROLES, statsAllie: statsAllie, allies: allies,
    ACTIONS: ACTIONS, bonusPour: bonusPour, toutesCompetences: toutesCompetences, difficulteOracle: difficulteOracle,
    consequence: consequence
  };
})();
