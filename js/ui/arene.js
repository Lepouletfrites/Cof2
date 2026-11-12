/* ============================================================
   COF2 Compagnon — Combat (Arène), refonte « tour par tour »
   Un seul écran pensé pour le téléphone :
     ┌ bandeau d'initiative : qui joue, dans quel ordre, PV de chacun
     ├ champ de bataille : cases de 3 m, pions, distances
     ├ journal du combat (3 dernières lignes, dépliable)
     └ panneau d'action du combattant actif :
         ⚔️ Attaquer · ✨ Sorts & capacités · 👣 Se déplacer ·
         🎒 Soins & objets · 🌀 États · ⏭️ Fin du tour
   Déroulé d'une attaque, sans fenêtre : choisir l'attaque → toucher
   la cible sur la carte (celles à portée sont surlignées) → résultat
   affiché dans le panneau (dés, DEF, DM appliqués) → « ↶ Annuler ».
   Le tour suit l'économie d'actions de COF2 : une action d'attaque (A)
   et une de mouvement (M), ou deux mouvements ; une action limitée (L)
   prend tout le tour ; une action gratuite (G) ne coûte rien.
   Les états (affaibli, renversé, étourdi, paralysé…) s'appliquent
   d'eux-mêmes. En fin de tour, l'app peut jouer créatures et alliés
   jusqu'au prochain héros.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Arene = (function () {
  var $ = COF.UI.$, esc = COF.UI.esc, sgn = COF.UI.sgn;
  var A = function () { return COF.Arene; };

  var s = null, cible = null, rechercheBeteQ = '';
  var ui = { mode: 'menu', choix: null, bonus: false, malus: false, deuxMains: false, resultat: null, sel: null, journal: false, annuler: null, arme: null, ajuster: false };
  var journalCombat = [];

  /* ================= Données des combattants ================= */
  function trouver(id) { return s.combattants.filter(function (c) { return c.id === id; })[0] || null; }
  function donnees(cb) {
    if (cb.type === 'creature') return { nom: cb.nom, pv: cb.pv, pvMax: cb.pvMax, def: cb.def, init: cb.init, pm: 0, pmMax: 0, vivant: true };
    var p = COF.Store.get(cb.refId);
    if (!p) return { nom: cb.nom + ' (supprimé)', pv: 0, pvMax: 1, def: 0, init: 0, pm: 0, pmMax: 0, vivant: false };
    if (p.pv === null || p.pv === undefined) COF.Store.reinitialiser(p);
    var K = COF.Calc;
    return { nom: p.nom, pv: p.pv, pvMax: K.pvMax(p), def: K.def(p), init: K.init(p), pm: p.pm || 0, pmMax: K.pmMax(p), vivant: true, perso: p };
  }
  function ajusterPv(cb, delta) {
    if (cb.type === 'creature') { A().majPv(cb, delta); return; }
    var p = COF.Store.get(cb.refId); if (!p) return;
    if (p.pv === null || p.pv === undefined) COF.Store.reinitialiser(p);
    p.pv = Math.max(0, Math.min(COF.Calc.pvMax(p), p.pv + delta));
    COF.Store.sauver(p);
  }
  function ajusterPm(cb, delta) {
    if (cb.type !== 'pj') return;
    var p = COF.Store.get(cb.refId); if (!p) return;
    p.pm = Math.max(0, Math.min(COF.Calc.pmMax(p), (p.pm || 0) + delta));
    COF.Store.sauver(p);
  }
  function debout(cb) { var d = donnees(cb); return d.vivant && d.pv > 0 && !cb.moral; }
  function camp(cb) { return A().camp(cb); }
  function sigle(cb) {
    var m = String(cb.nom).match(/^(\S)\S*(?:.*?(\d+))?$/);
    return m ? m[1].toUpperCase() + (m[2] || '') : '?';
  }
  function actif() { return s.combattants[s.tour] || null; }

  /* ================= États : effets automatiques ================= */
  function a(cb, id) { return (cb.etats || []).indexOf(id) >= 0; }
  function effetsEtats(cb) {
    var e = { att: 0, def: 0, malus: false, perdTour: false, pasDeMouv: false, autoCrit: false, raisons: [] };
    if (a(cb, 'affaibli')) { e.malus = true; e.raisons.push('affaibli : dé malus'); }
    if (a(cb, 'immobilise')) { e.malus = true; e.pasDeMouv = true; e.raisons.push('immobilisé : dé malus, pas de déplacement'); }
    if (a(cb, 'aveugle')) { e.att -= 5; e.def -= 5; e.raisons.push('aveuglé : −5'); }
    if (a(cb, 'renverse')) { e.att -= 5; e.def -= 5; e.raisons.push('renversé : −5'); }
    if (a(cb, 'etourdi')) { e.perdTour = true; e.def -= 5; e.raisons.push('étourdi : aucune action'); }
    if (a(cb, 'paralyse')) { e.perdTour = true; e.autoCrit = true; e.raisons.push('paralysé : aucune action'); }
    if (a(cb, 'surpris') && s.round === 1) { e.perdTour = true; e.def -= 5; e.raisons.push('surpris : pas d’action au 1er round'); }
    return e;
  }

  /* ================= Économie d'actions du tour ================= */
  function eco() {
    var cb = actif();
    if (!s.eco || s.eco.id !== (cb && cb.id) || s.eco.round !== s.round) s.eco = { id: cb && cb.id, round: s.round, a: true, m: true };
    return s.eco;
  }
  function peut(type) {
    var e = eco();
    if (type === 'G') return true;
    if (type === 'L') return e.a && e.m;
    if (type === 'M') return e.m || e.a;
    return e.a;                 // A (par défaut)
  }
  function depenser(type) {
    var e = eco();
    if (type === 'L') { e.a = false; e.m = false; }
    else if (type === 'M') { if (e.m) e.m = false; else e.a = false; }
    else if (type !== 'G') e.a = false;
  }
  function typeAction(x) { var t = String(x || 'A').charAt(0).toUpperCase(); return /[ALMG]/.test(t) ? t : 'A'; }

  /* ================= Options d'action d'un combattant ================= */
  /* Portée écrite dans un texte : « à moins de 30 m », « portée 20 m »,
     « cône 10 m »… (on ignore les « 5 m vers le haut » et autres). */
  function porteeTexte(d) {
    var m = /(?:moins de|portée(?: de)?|jusqu['’]à|à|cône(?: de)?|ligne(?: de)?|rayon(?: de)?)\s+(\d+)\s?m\b/i.exec(d || '');
    return m ? +m[1] : null;
  }
  /* Les fiches du bestiaire n'indiquent pas toujours la portée : on la
     déduit du nom de l'attaque (arc, arbalète, souffle…) et de sa note. */
  function analyseAttCreature(at) {
    var t = (at.n + ' ' + (at.note || '')).toLowerCase(), portee = at.portee || porteeTexte(t);
    if (!portee) {
      if (/arc long/.test(t)) portee = 50;
      else if (/arc|arbalète|arbalete|sarbacane|pistolet|mousquet|arquebuse/.test(t)) portee = 30;
      else if (/fronde|javelot|lance-pierre|projection|projectile|jet de|hache de jet|couteau de jet|rocher|pierre/.test(t)) portee = 20;
      else if (/rayon|trait|éclair|eclair|boule/.test(t)) portee = 20;
      else if (/crach|souffle|cône|cone/.test(t)) portee = 10;
    }
    var nb = /(\d)\s*attaques/.exec(t);
    var rech = /tous les\s*(\d?d\d+|\d+)\s*rounds/.exec(t);
    var zone = /souffle|cône|cone|zone/.test(t);
    /* Souffle ou attaque de zone sans recharge écrite : 1d4 rounds par défaut,
       sinon la créature l'utiliserait à chaque round. */
    return { portee: portee || null, auto: /automatique/.test(t), nb: nb ? +nb[1] : 1, recharge: rech ? rech[1] : (zone ? '1d4' : null), zone: zone };
  }
  function options(cb) {
    var out = [];
    if (cb.type === 'creature') {
      (cb.att || []).forEach(function (at, i) {
        var an = analyseAttCreature(at), rec = cb.recharge && cb.recharge[i] && cb.recharge[i] > s.round;
        out.push({ id: 'a' + i, cat: 'attaque', ic: an.zone ? '🔥' : (an.portee ? '🏹' : '⚔️'), nom: at.n + (an.nb > 1 ? ' ×' + an.nb : ''), mod: (at.mod || 0) + (cb.adjAtt || 0),
          dmg: at.dmg ? at.dmg + (cb.adjDm ? '+' + cb.adjDm : '') : null, portee: an.portee, auto: an.auto, nb: an.nb, recharge: an.recharge, indispo: rec,
          action: 'A', ctx: ctxCreature(cb), note: (at.note || '') + (rec ? ' (se recharge)' : ''), idx: i });
      });
      (cb.caps || []).forEach(function (cp, i) {
        if (!cp.a) return;
        out.push({ id: 'c' + i, cat: 'capacite', ic: '💥', nom: cp.n, mod: (cb.att && cb.att[0]) ? cb.att[0].mod : (Math.floor(cb.nc) || 0),
          dmg: cp.dmg || null, portee: porteeTexte(cp.d) || 20, action: typeAction(cp.a), ctx: ctxCreature(cb), note: cp.d || '', auto: !cp.dmg });
      });
      return out;
    }
    var p = COF.Store.get(cb.refId); if (!p) return out;
    var K = COF.Calc, aa = K.attaques(p), bv = bonusActifs(p);
    /* Bonus de voies cochés + ajustement manuel du combattant */
    function modDe(type) { return (type === 'distance' ? bv.attD : (type === 'magique' ? bv.attM : bv.attC)) + (cb.adjAtt || 0); }
    function dmDe(type, f) { var b = (type === 'distance' ? bv.dmD : (type === 'magique' ? 0 : bv.dmC)) + (cb.adjDm || 0); return f + (b ? (b > 0 ? '+' : '') + b : ''); }
    (p.armes || []).forEach(function (w, i) {
      var ty = w.type === 'distance' ? 'distance' : 'contact';
      out.push({ id: 'w' + i, cat: 'attaque', ic: ty === 'distance' ? '🏹' : '⚔️', nom: w.nom, mod: COF.UI.modArme(p, w, aa) + modDe(ty),
        dmg: dmDe(ty, COF.UI.dmgArme(p, w)), dmg2: w.dm2 ? dmDe(ty, COF.UI.dmgArme(p, { type: w.type, dm: w.dm2, noFor: w.noFor })) : null,
        crit: w.crit || 20, portee: ty === 'distance' ? (w.portee || 30) : null, action: 'A', ctx: K.ctx(p), arme: i });
    });
    out.push({ id: 'mn', cat: 'attaque', ic: '👊', nom: 'Mains nues', mod: aa.contact + modDe('contact'), dmg: dmDe('contact', '1d3+FOR'), portee: null, action: 'A', ctx: K.ctx(p), note: 'DM temporaires' });
    K.capacites(p).forEach(function (x) {
      var c = x.cap, txt = c.n + ' ' + (c.d || '');
      var sort = !!c.s, soin = c.t === 'soin';
      /* « Monture » : DM qui s'ajoutent à une attaque d'arme (Attaque sournoise,
         Botte mortelle, Dans le mille…) — même sans action indiquée. */
      var compagnon = /loup|golem|familier|panthère|félin|compagnon|monture|élémentaire|invoqu|serviteur|destrier/i.test(c.n);
      var monture = !compagnon && (c.t === 'bonus' || (!c.a && c.dmg && !soin && /attaque|touche|critique|tir\b/i.test(c.d || '')));
      if (compagnon && !c.a) return;                      // attaque d'un compagnon : se joue avec lui
      if (!c.a && !monture && !soin) return;            // capacité passive ou hors combat
      if (!c.a && soin) return;                           // soin passif (récupération…) : hors combat
      var dmg = c.dmg ? COF.UI.formuleEchelle(c, p) : null;
      var distance = /distance|arc |arbalète|tir\b|flèche|projectile|jet\b|à moins de/i.test(txt);
      var portee = porteeTexte(c.d);
      var opt = { id: 'k' + x.voieKey + '|' + c.r, cat: sort ? 'sort' : 'capacite', ic: soin ? '💚' : (sort ? '✨' : '💥'), nom: c.n,
        mod: (sort ? aa.magique : (distance ? aa.distance : aa.contact)) + modDe(sort ? 'magique' : (distance ? 'distance' : 'contact')),
        dmg: dmg, soin: soin, cout: sort ? c.r : 0, action: typeAction(c.a), ctx: K.ctx(p, c.r),
        portee: soin ? (portee || 3) : (sort || distance ? (portee || (dmg ? 30 : null)) : null),
        auto: /automatique|sans test|touche automatiquement|automatiques/i.test(c.d || '') || !c.dmg, note: c.d || '', voie: x.voie.nom };
      if (monture) {
        /* le joueur choisit l'arme au moment de viser (premier choix : à distance si le texte l'indique) */
        opt.rider = dmg; opt.auto = false; opt.cat = 'attaque'; opt.ic = '💥'; opt.nom = '+ ' + c.n;
        opt.action = typeAction(c.a || 'A');
        if (!(p.armes || []).length) return;
      }
      out.push(opt);
    });
    return out;
  }
  /* Arme utilisée par une capacité « monture » (choix du joueur). */
  function appliquerArme(cb, opt) {
    if (!opt.rider) return opt;
    var p = COF.Store.get(cb.refId), armes = (p && p.armes) || [];
    var i = ui.arme !== null && ui.arme !== undefined && armes[ui.arme] ? ui.arme : 0;
    if (ui.arme === null || ui.arme === undefined) {
      var dist = /distance|arc |arbalète|tir\b|flèche/i.test(opt.note);
      armes.forEach(function (w, k) { if (dist && w.type === 'distance' && i === 0 && armes[0].type !== 'distance') i = k; });
    }
    var base = options(cb).filter(function (o) { return o.arme === i; })[0];
    if (!base) return opt;
    return Object.assign({}, opt, { mod: base.mod, dmg: base.dmg + '+' + opt.rider, dmg2: base.dmg2 ? base.dmg2 + '+' + opt.rider : null,
      portee: base.portee, crit: base.crit, ctx: base.ctx, armeNom: armes[i].nom, armeIdx: i });
  }

  /* ================= Bonus permanents des voies =================
     Les capacités passives qui donnent « +N en attaque » ou « +N aux DM »
     sont détectées (avec leur progression « +2 au rang 3, +3 au rang 5 »).
     Celles sans condition sont actives d'office ; les conditionnelles
     (avec un bouclier, sans armure, en selle, arme de prédilection…) se
     cochent à la main dans le panneau « 🎯 Ajuster ».                      */
  var COND = /\b(si|avec|sans|quand|lorsqu|en selle|dans|contre|tant qu|sur un|une fois|choisit|catégorie|prédilection|des armes à|des dagues|à deux mains|monture|navire|ennemi juré|proie)\b/i;
  /* Capacité activable ou liée à autre chose que le héros : jamais comptée d'office. */
  var ACTIVABLE = /×|par combat|par jour|pendant|forme|round|\bPC\b|dépens|invoqu|appel|compagnon|loup|golem|familier|monture|animal|action|esprit|rage|transe|furie/i;
  function bonusVoies(p) {
    var out = [];
    COF.Calc.capacites(p).forEach(function (x) {
      var c = x.cap; if (c.a || !c.d) return;
      var re = /\+\s?(\d+)\s+(?:en |aux |à l['’])?(attaque|DM)(?:\s+(au contact|à distance|magique|des armes à distance))?([^.;]*)/gi, m;
      while ((m = re.exec(c.d)) !== null) {
        var val = +m[1], suite = c.d.slice(m.index, m.index + 160);
        var prog = /\(\s*\+\s?(\d+)\s+au rang\s+(\d)(?:\s*,\s*\+\s?(\d+)\s+au rang\s+(\d))?/i.exec(suite);
        if (prog) { if (x.rang >= +prog[2]) val = +prog[1]; if (prog[4] && x.rang >= +prog[4]) val = +prog[3]; }
        var phrase = c.d.slice(Math.max(0, c.d.lastIndexOf('.', m.index) + 1), c.d.indexOf('.', m.index) > 0 ? c.d.indexOf('.', m.index) : undefined);
        var scope = /contact/i.test(m[3] || '') ? 'C' : (/distance/i.test(m[3] || '') ? 'D' : (/magique/i.test(m[3] || '') ? 'M' : 'tous'));
        out.push({ cle: x.voieKey + '|' + c.r + '|' + out.length, cap: c.n, voie: x.voie.nom, type: /DM/i.test(m[2]) ? 'dm' : 'att', val: val, scope: scope,
          cond: COND.test(phrase) || ACTIVABLE.test(c.n + ' ' + c.d), texte: phrase.trim() });
      }
    });
    return out;
  }
  function bonusActifs(p) {
    var choix = p.bonusVoies || {}, r = { attC: 0, attD: 0, attM: 0, dmC: 0, dmD: 0 };
    bonusVoies(p).forEach(function (b) {
      var on = choix.hasOwnProperty(b.cle) ? choix[b.cle] : !b.cond;
      if (!on) return;
      var cles = b.scope === 'tous' ? ['C', 'D', 'M'] : [b.scope];
      cles.forEach(function (k) { if (b.type === 'att') r['att' + k] += b.val; else if (k !== 'M') r['dm' + k] += b.val; });
    });
    return r;
  }
  function ctxCreature(cb) { var n = Math.floor(cb.nc) || 1; return { carac: {}, niveau: n, deEvo: COF.deEvolutif(n) }; }
  function porteeCases(opt) { return opt.portee ? Math.max(1, Math.floor(opt.portee / A().GRILLE.m)) : 1; }
  /* Cibles possibles pour une option : adversaires (ou alliés pour un soin). */
  function cibles(cb, opt) {
    return s.combattants.filter(function (c) {
      if (!donnees(c).vivant) return false;
      if (opt.soin) return camp(c) === camp(cb) && donnees(c).pv < donnees(c).pvMax;
      return camp(c) !== camp(cb) && donnees(c).pv > 0;
    }).map(function (c) {
      var dc = A().cases(cb, c);
      return { cb: c, m: dc * A().GRILLE.m, ok: opt.soin ? dc <= 1 || c === cb : dc <= porteeCases(opt) };
    });
  }

  /* ================= Journal ================= */
  function log(l) {
    s.log = s.log || []; s.log.push(l); if (s.log.length > 60) s.log = s.log.slice(-60);
    journalCombat.push(l);
  }
  function combatAventure() { var c = COF.Carnet && COF.Carnet.actif(); return c && c.combat ? c : null; }
  function verserJournal() {
    var c = combatAventure();
    if (c && journalCombat.length) COF.Carnet.ajouterEntree(c, { t: 'note', titre: 'Combat · round ' + s.round, txt: journalCombat.join('\n') });
    journalCombat = [];
  }

  /* ================= Annuler la dernière action ================= */
  function memoriser() {
    var persos = {};
    s.combattants.forEach(function (c) {
      if (c.type === 'pj') { var p = COF.Store.get(c.refId); if (p) persos[p.id] = { pv: p.pv, pm: p.pm }; }
    });
    ui.annuler = { s: JSON.stringify(s), persos: persos, jl: journalCombat.length };
  }
  function annuler() {
    if (!ui.annuler) return;
    s = JSON.parse(ui.annuler.s);
    Object.keys(ui.annuler.persos).forEach(function (id) {
      var p = COF.Store.get(id); if (!p) return;
      p.pv = ui.annuler.persos[id].pv; p.pm = ui.annuler.persos[id].pm; COF.Store.sauver(p);
    });
    journalCombat = journalCombat.slice(0, ui.annuler.jl);
    ui.annuler = null; ui.resultat = null; ui.mode = 'menu';
    A().ecrire(s);
  }

  /* ================= Résolution d'une action ================= */
  /* Résout une action complète : coût, action dépensée, puis une ou
     plusieurs attaques (créatures à « 2 attaques »), recharge éventuelle. */
  function resoudre(cb, opt, t) {
    memoriser();
    opt = appliquerArme(cb, opt);
    var lignes = [];
    if (opt.cout) {
      var dd = donnees(cb);
      if (dd.pm < opt.cout) lignes.push('⚠️ Mana insuffisant (' + dd.pm + '/' + opt.cout + ' PM) : brûlure de mana à gérer sur la fiche.');
      ajusterPm(cb, -opt.cout);
    }
    depenser(opt.action);
    if (opt.recharge && opt.idx !== undefined) {
      cb.recharge = cb.recharge || {};
      cb.recharge[opt.idx] = s.round + Math.max(1, COF.Dice.libre(/d/.test(opt.recharge) ? opt.recharge : opt.recharge + '').total);
      lignes.push(opt.nom + ' se recharge (de nouveau utilisable au round ' + cb.recharge[opt.idx] + ').');
    }
    var nb = Math.max(1, opt.nb || 1), res = [], cibleCourante = t;
    for (var k = 0; k < nb; k++) {
      if (k > 0 && donnees(cibleCourante).pv <= 0) {
        /* la cible est tombée : l'attaque suivante vise un autre adversaire à portée */
        var autre = cibles(cb, opt).filter(function (v) { return v.ok && donnees(v.cb).pv > 0; })[0];
        if (!autre) break;
        cibleCourante = autre.cb;
      }
      res.push(resoudreUne(cb, opt, cibleCourante));
    }
    var r = res[res.length - 1];
    r.lignes = lignes.concat(r.lignes || []);
    if (res.length > 1) r.multi = res;
    return r;
  }
  function resoudreUne(cb, opt, t) {
    var ea = effetsEtats(cb), d = donnees(t), et = effetsEtats(t);
    var r = { opt: opt, cible: d.nom, lignes: [] };
    if (opt.soin) {
      var h = COF.Dice.dommages(opt.dmg || '1d4', opt.ctx, {});
      ajusterPv(t, h.total);
      r.soin = h; r.verdict = 'soin';
      log('💚 ' + cb.nom + ' soigne ' + d.nom + ' (' + opt.nom + ') : +' + h.total + ' PV (' + donnees(t).pv + '/' + d.pvMax + ').');
      return r;
    }
    if (opt.auto && !opt.dmg) {
      r.verdict = 'effet';
      log('✨ ' + cb.nom + ' utilise ' + opt.nom + (t !== cb ? ' sur ' + d.nom : '') + '.');
      return r;
    }
    var def = d.def + et.def;
    var test = null, touche, crit = false;
    if (opt.auto) { touche = true; }
    else {
      test = COF.Dice.test({ mod: (opt.mod || 0) + ea.att, difficulte: def, bonus: ui.bonus, malus: ui.malus || ea.malus, critMin: opt.crit || 20 });
      touche = !!test.reussite; crit = !!test.crit;
    }
    if (et.autoCrit) { touche = true; crit = true; r.lignes.push('La cible est paralysée : touchée automatiquement, critique.'); }
    r.test = test; r.def = def; r.crit = crit;
    var dmg = ui.deuxMains && opt.dmg2 ? opt.dmg2 : opt.dmg;
    if (touche && dmg) {
      var dm = COF.Dice.dommages(dmg, opt.ctx, { crit: crit });
      ajusterPv(t, -dm.total);
      r.dm = dm; r.verdict = crit ? 'critique' : 'touche';
      if (cb.type === 'creature' && opt.note && /\+|poison|venin|étreinte|etreinte|maladie|paraly|renvers|saign|feu|acide/i.test(opt.note)) {
        r.lignes.push('Effet de l’attaque : ' + opt.note.replace(/\s*\(se recharge\)/, '') + ' — à appliquer (🌀 États).');
      }
      var apres = donnees(t);
      r.pvApres = apres.pv + '/' + apres.pvMax;
      log((cb.allie ? '🤝 ' : (cb.type === 'pj' ? '🛡️ ' : '🐉 ')) + cb.nom + ' → ' + d.nom + ' (' + opt.nom + (opt.armeNom ? ' avec ' + opt.armeNom : '') + ') : ' +
        (test ? test.total + ' contre DEF ' + def + ' → ' : 'automatique → ') + (crit ? 'CRITIQUE, ' : 'touché, ') + dm.total + ' DM' + (apres.pv <= 0 ? ' — à terre !' : ' (' + r.pvApres + ' PV).'));
    } else if (touche) {
      r.verdict = 'touche';
      log(cb.nom + ' → ' + d.nom + ' (' + opt.nom + ') : touché.');
    } else {
      r.verdict = test && test.fumble ? 'fumble' : 'rate';
      log(cb.nom + ' → ' + d.nom + ' (' + opt.nom + ') : ' + test.total + ' contre DEF ' + def + ' → ' + (test.fumble ? 'échec critique.' : 'raté.'));
    }
    if (ea.raisons.length) r.lignes.push('États : ' + ea.raisons.join(' ; ') + '.');
    return r;
  }

  /* ================= Tours automatiques (créatures, alliés) ================= */
  function jouerAuto(cb) {
    var ea = effetsEtats(cb);
    if (ea.perdTour) { log('🌀 ' + cb.nom + ' ne peut pas agir (' + ea.raisons.join(', ') + ').'); return; }
    var dec = A().decider(s, cb, donnees);
    if (dec.type === 'fuite') {
      var menace = s.combattants.filter(function (x) { return camp(x) !== camp(cb) && x.x !== undefined; })[0];
      if (menace) A().eloigner(s, cb, menace);
    }
    if (dec.type !== 'att' && dec.type !== 'cap') { log('🤖 ' + dec.texte); return; }
    var t = dec.cible, opt = choisirAttaque(cb, t);
    if (!opt) { log('🤖 ' + cb.nom + ' n’a aucune attaque utilisable.'); return; }
    var pc = porteeCases(opt), ic = cb.allie ? '🤝 ' : '🐉 ';
    /* Tireur au contact sans arme de mêlée : il recule avant de tirer. */
    if (opt.portee && A().cases(cb, t) <= 1 && !aDeLaMelee(cb) && !ea.pasDeMouv) {
      A().eloigner(s, cb, t, 2);
      log(ic + cb.nom + ' recule pour tirer.');
    } else if (!ea.pasDeMouv && A().cases(cb, t) > pc) {
      var n = A().approcher(s, cb, t, pc);
      if (A().cases(cb, t) > pc) { log(ic + cb.nom + ' avance vers ' + donnees(t).nom + (n ? ' (' + n * A().GRILLE.m + ' m)' : '') + '.'); return; }
    }
    var sauveBonus = ui.bonus, sauveMalus = ui.malus, sauve2 = ui.deuxMains;
    ui.bonus = false; ui.malus = false; ui.deuxMains = false;
    eco();  resoudre(cb, opt, t);
    ui.bonus = sauveBonus; ui.malus = sauveMalus; ui.deuxMains = sauve2;
  }
  /* Choix d'attaque d'une créature selon la distance de sa cible :
     au contact → la meilleure attaque de mêlée ; sinon une attaque à
     distance qui porte (souffle/zone en priorité s'il est rechargé) ;
     sinon celle qui demandera le moins de chemin.                      */
  function aDeLaMelee(cb) { return options(cb).some(function (o) { return !o.portee && !o.indispo && o.dmg; }); }
  function choisirAttaque(cb, t) {
    var opts = options(cb).filter(function (o) { return o.cat === 'attaque' && o.dmg && !o.indispo; });
    if (!opts.length) return null;
    var dc = A().cases(cb, t);
    var melee = opts.filter(function (o) { return !o.portee; }).sort(function (x, y) { return y.mod - x.mod; });
    var tirs = opts.filter(function (o) { return o.portee && porteeCases(o) >= dc; })
      .sort(function (x, y) { return (y.auto ? 1 : 0) - (x.auto ? 1 : 0) || y.mod - x.mod; });
    if (dc <= 1 && melee.length) return melee[0];
    if (tirs.length) return tirs[0];
    /* hors de portée : la plus longue portée si elle existe, sinon la mêlée */
    var loin = opts.filter(function (o) { return o.portee; }).sort(function (x, y) { return y.portee - x.portee; });
    return loin[0] || melee[0];
  }
  function campDebout(c) { return s.combattants.some(function (x) { return camp(x) === c && debout(x); }); }
  /* L'app joue-t-elle ce combattant ? */
  function joueParApp(cb) {
    if (!cb || cb.type === 'pj') return false;
    if (cb.manuel) return false;
    return cb.allie ? s.alliesAuto !== false : s.creaturesAuto !== false;
  }
  /* Passe au suivant ; joue automatiquement jusqu'au prochain combattant
     contrôlé par le joueur. Les combattants hors combat sont sautés. */
  function tourSuivant() {
    verserJournal();
    var garde = 0;
    do {
      A().tourSuivant(s);
      var cb = actif();
      if (!cb) break;
      if (!debout(cb)) continue;
      if (!campDebout('heros') || !campDebout('monstres')) break;
      if (joueParApp(cb)) { eco(); jouerAuto(cb); continue; }
      break;
    } while (++garde < 80);
    ui.annuler = null; ui.mode = 'menu'; ui.resultat = null; ui.choix = null; ui.bonus = false; ui.malus = false;
    A().ecrire(s);
    verserJournal();
  }

  /* ================= Rendu ================= */
  function rendre(node) {
    cible = node || cible;
    s = A().lire();
    if (!s.combattants.length) { cible.innerHTML = htmlVide(); return; }
    A().placer(s, s.distanceDepart);
    var h = (COF.UI.Carnet ? COF.UI.Carnet.banniereCombat() : '') + htmlTete() + htmlRuban();
    h += '<div class="cb-milieu" id="cb-milieu">' + htmlCarte() + htmlJournal() + '</div>';
    h += '<div class="cb-panneau">' + htmlPanneau() + '</div>';
    cible.innerHTML = h;
    var rb = $('.cb-ruban .actif', cible); if (rb && rb.scrollIntoView) rb.scrollIntoView({ block: 'nearest', inline: 'center' });
    A().ecrire(s);
  }
  function rafraichir() { if (cible) rendre(cible); }

  function htmlVide() {
    var dernier = COF.UI.Generateurs && COF.UI.Generateurs.dernierResultat();
    return (COF.UI.Carnet ? COF.UI.Carnet.banniereCombat() : '') +
      '<div class="carte"><h2>⚔️ Combat</h2><div class="carte-corps">' +
      '<div class="note" style="margin-bottom:12px">Ajoutez les combattants : l’initiative est triée, les pions sont placés sur le champ de bataille, ' +
      'et chacun joue à son tour depuis le panneau du bas. En aventure, la rencontre arrive ici toute seule.</div>' +
      '<button class="btn btn-plein btn-bloc" data-cb="importer"' + (dernier && !dernier.erreur ? '' : ' disabled style="opacity:.5"') + '>📥 Dernière rencontre générée</button>' +
      '<div class="cn-grille" style="margin-top:8px"><button data-cb="ajout-bete">🐉 Créature</button><button data-cb="ajout-pj">🛡️ Personnage</button></div>' +
      '</div></div>';
  }
  function htmlTete() {
    var cb = actif(), e = eco();
    return '<div class="cb-tete"><div><b>Round ' + s.round + '</b>' + (cb ? ' · tour de <b>' + esc(cb.nom) + '</b>' : '') + '</div>' +
      '<div class="cb-eco">' + (cb && cb.type !== 'creature' || (cb && !joueParApp(cb)) ?
        '<span class="' + (e.a ? 'on' : '') + '" title="Action d’attaque">⚔️ A</span><span class="' + (e.m ? 'on' : '') + '" title="Action de mouvement">👣 M</span>' : '') +
      '<button data-cb="config" aria-label="Réglages du combat">⚙️</button></div></div>';
  }
  function htmlRuban() {
    return '<div class="cb-ruban">' + s.combattants.map(function (c, i) {
      var d = donnees(c), pct = Math.max(0, Math.min(100, d.pv / Math.max(1, d.pvMax) * 100));
      var cls = (c.type === 'pj' ? 'pj' : (c.allie ? 'allie' : 'ennemi')) + (i === s.tour ? ' actif' : '') + (d.pv <= 0 ? ' ko' : '') + (c.moral ? ' fuit' : '') + (ui.sel === c.id ? ' sel' : '');
      return '<button class="cb-jeton ' + cls + '" data-cb="sel" data-id="' + c.id + '"><span class="sg">' + esc(sigle(c)) + '</span>' +
        '<span class="nm">' + esc(c.nom.length > 10 ? c.nom.slice(0, 9) + '…' : c.nom) + '</span>' +
        '<span class="pvb"><i style="width:' + pct + '%"></i></span>' + ((c.etats || []).length ? '<span class="et">🌀</span>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function htmlCarte() {
    var G = A().GRILLE, cb = actif(), mode = ui.mode, opt = ui.choix;
    var vis = mode === 'cible' && opt ? cibles(cb, appliquerArme(cb, opt)) : [];
    var okIds = {}; vis.forEach(function (v) { okIds[v.cb.id] = v.ok ? 'ok' : 'loin'; });
    var portee = mode === 'deplacer' ? G.pas : 0;
    var h = '<div class="ar-grille cb-grille" style="grid-template-columns:repeat(' + G.l + ',1fr)">';
    for (var y = 0; y < G.h; y++) for (var x = 0; x < G.l; x++) {
      var c = s.combattants.filter(function (k) { return k.x === x && k.y === y; })[0];
      if (c) {
        var d = donnees(c), cls = 'ar-pion ' + (c.type === 'pj' ? 'pj' : (c.allie ? 'allie' : 'ennemi')) + (d.pv <= 0 ? ' ko' : '') + (c.moral ? ' fuit' : '') +
          (c === cb ? ' actif' : '') + (ui.sel === c.id ? ' sel' : '') + (okIds[c.id] === 'ok' ? ' vise' : (okIds[c.id] === 'loin' ? ' horsportee' : ''));
        h += '<button class="' + cls + '" data-cb="pion" data-id="' + c.id + '">' + esc(sigle(c)) + '</button>';
      } else {
        var dist = portee && cb ? Math.max(Math.abs(cb.x - x), Math.abs(cb.y - y)) : 99;
        h += '<button class="ar-case' + (dist <= portee ? ' portee' : '') + '" data-cb="case" data-x="' + x + '" data-y="' + y + '"></button>';
      }
    }
    return h + '</div>';
  }
  function htmlJournal() {
    var l = (s.log || []), dern = ui.journal ? l.slice(-25) : l.slice(-3);
    if (!l.length) return '';
    return '<div class="cb-journal" data-cb="journal">' + dern.map(function (x) { return '<div>' + esc(x) + '</div>'; }).join('') +
      '<small>' + (ui.journal ? '▲ réduire' : '▼ tout le journal (' + l.length + ')') + '</small></div>';
  }

  /* ---------- Panneau d'action ---------- */
  function htmlPanneau() {
    var cb = actif(); if (!cb) return '';
    if (ui.sel && ui.mode === 'menu' && ui.sel !== cb.id) return htmlFicheRapide(trouver(ui.sel));
    if (!campDebout('monstres') || !campDebout('heros')) {
      return '<div class="cb-fin">' + (!campDebout('monstres') ? '🏆 Plus aucun adversaire debout.' : '💀 Le héros et ses alliés sont à terre.') + '</div>' +
        (combatAventure() ? '<button class="btn btn-plein btn-bloc" data-cn="fin-combat">🏁 Terminer le combat</button>' : '<button class="btn btn-bloc" data-cb="vider">🧹 Nouveau combat</button>');
    }
    if (ui.mode === 'resultat') return htmlResultat();
    if (ui.mode === 'cible') return htmlChoixCible(cb);
    if (ui.mode === 'liste') return htmlListeOptions(cb, ui.cat);
    if (ui.mode === 'deplacer') return '<div class="cb-consigne">👣 Touchez une case surlignée (≈ 10 m).</div><button class="btn btn-bloc" data-cb="retour">↩ Retour</button>';
    var d = donnees(cb), ea = effetsEtats(cb);
    var h = '<div class="cb-qui"><b>' + (cb.type === 'pj' ? '🛡️ ' : (cb.allie ? '🤝 ' : '🐉 ')) + esc(cb.nom) + '</b>' +
      '<span>❤️ ' + d.pv + '/' + d.pvMax + (d.pmMax ? ' · 🔮 ' + d.pm + '/' + d.pmMax : '') + ' · DEF ' + (d.def + ea.def) + '</span></div>';
    if (ea.raisons.length) h += '<div class="cb-etats">🌀 ' + esc(ea.raisons.join(' · ')) + '</div>';
    if (d.pv <= 0) return h + '<div class="cb-consigne">À terre.</div><button class="btn btn-plein btn-bloc" data-cb="fin-tour">⏭️ Tour suivant</button>';
    if (ea.perdTour) return h + '<button class="btn btn-plein btn-bloc" data-cb="fin-tour">⏭️ Passer le tour</button>';
    if (cb.type === 'creature' && !cb.manuel) {
      return h + '<div class="cn-grille"><button data-cb="auto" class="on">🤖 Jouer son tour</button><button data-cb="manuel">🎮 Je le joue</button></div>' +
        '<button class="btn btn-bloc" style="margin-top:6px" data-cb="fin-tour">⏭️ Passer</button>';
    }
    var opts = options(cb), nA = opts.filter(function (o) { return o.cat === 'attaque'; }).length, nS = opts.filter(function (o) { return o.cat !== 'attaque' && !o.soin; }).length;
    var nH = opts.filter(function (o) { return o.soin; }).length, e = eco();
    h += '<div class="cb-actions">' +
      btnAct('attaque', '⚔️', 'Attaquer', nA, peut('A')) +
      btnAct('pouvoirs', '✨', cb.type === 'pj' ? 'Sorts & capacités' : 'Capacités', nS, nS && (peut('A') || peut('L') || peut('M'))) +
      '<button data-cb="deplacer"' + (peut('M') && !ea.pasDeMouv ? '' : ' disabled') + '><span class="ic">👣</span><span>Se déplacer</span><small>' + (e.m ? 'mouvement' : (e.a ? 'à la place de l’attaque' : '—')) + '</small></button>' +
      btnAct('soins', '💚', 'Soins', nH, nH && peut('A')) +
      '<button data-cb="etats" data-id="' + cb.id + '"><span class="ic">🌀</span><span>États</span><small>' + ((cb.etats || []).length || 'aucun') + '</small></button>' +
      '<button data-cb="fin-tour" class="fin"><span class="ic">⏭️</span><span>Fin du tour</span><small>' + (s.creaturesAuto !== false ? 'puis l’app joue' : '') + '</small></button>' +
      '</div>';
    if (cb.manuel) h += '<button class="btn btn-sm btn-bloc" style="margin-top:6px" data-cb="rendre-ia">🤖 Rendre la main à l’app</button>';
    return h;
  }
  function btnAct(cat, ic, nom, nb, dispo) {
    return '<button data-cb="liste" data-v="' + cat + '"' + (dispo ? '' : ' disabled') + '><span class="ic">' + ic + '</span><span>' + nom + '</span><small>' + (nb || 'aucun') + '</small></button>';
  }
  function htmlListeOptions(cb, cat) {
    var opts = options(cb).filter(function (o) {
      return cat === 'attaque' ? o.cat === 'attaque' : (cat === 'soins' ? o.soin : (o.cat !== 'attaque' && !o.soin));
    });
    var h = '<div class="cb-consigne">' + { attaque: '⚔️ Choisissez une attaque', pouvoirs: '✨ Choisissez un sort ou une capacité', soins: '💚 Choisissez un soin' }[cat] + '</div>';
    if (cat !== 'soins') h += htmlAjuster(cb);
    if (cat === 'attaque') h += htmlModifs(false);
    h += '<div class="cb-options">' + opts.map(function (o) {
      var ok = peut(o.action) && !o.indispo;
      return '<button data-cb="choisir" data-v="' + esc(o.id) + '"' + (ok ? '' : ' disabled') + '>' +
        '<span class="ic">' + o.ic + '</span><span class="tx"><b>' + esc(o.nom) + '</b><small>' +
        (o.rider ? 'ajoute ' + esc(o.rider) + ' aux DM d’une arme' :
        (o.soin ? 'soin ' + esc(o.dmg || '') : (o.auto ? (o.dmg ? 'touche auto · ' : '') : 'att. ' + sgn(o.mod) + ' · ') + (o.dmg && !o.soin ? 'DM ' + esc(o.dmg) : (o.dmg ? '' : 'effet')))) +
        (o.indispo ? ' · se recharge' : '') +
        (o.rider ? '' : (o.portee ? ' · ' + o.portee + ' m' : (o.soin ? '' : ' · contact'))) + (o.cout ? ' · ' + o.cout + ' PM' : '') +
        '</small></span><span class="act act-' + o.action + '">' + o.action + '</span></button>';
    }).join('') + '</div>';
    return h + '<button class="btn btn-bloc" style="margin-top:6px" data-cb="retour">↩ Retour</button>';
  }
  /* 🎯 Ajuster : modificateurs manuels du combattant (attaque, DM) et
     bonus permanents détectés dans ses voies (cochables). */
  function htmlAjuster(cb) {
    var adj = (cb.adjAtt || 0) + ' / ' + (cb.adjDm || 0);
    var h = '<button class="cb-ajuster-btn" data-cb="ajuster">🎯 Ajuster attaque et DM' +
      ((cb.adjAtt || cb.adjDm) ? ' <b>(' + sgn(cb.adjAtt || 0) + ' att., ' + sgn(cb.adjDm || 0) + ' DM)</b>' : '') + ' ' + (ui.ajuster ? '▲' : '▼') + '</button>';
    if (!ui.ajuster) return h;
    h += '<div class="cb-ajuster">' +
      '<div class="cb-adj"><span>Attaque</span><button data-cb="adj" data-k="adjAtt" data-v="-1">−</button><b>' + sgn(cb.adjAtt || 0) + '</b><button data-cb="adj" data-k="adjAtt" data-v="1">+</button></div>' +
      '<div class="cb-adj"><span>Dommages</span><button data-cb="adj" data-k="adjDm" data-v="-1">−</button><b>' + sgn(cb.adjDm || 0) + '</b><button data-cb="adj" data-k="adjDm" data-v="1">+</button></div>' +
      '<div class="note">S’ajoute à toutes les attaques de ' + esc(cb.nom) + ' pendant ce combat (bénédiction, terrain, objet non saisi…).</div>';
    if (cb.type === 'pj') {
      var p = COF.Store.get(cb.refId), bv = p ? bonusVoies(p) : [], choix = (p && p.bonusVoies) || {};
      if (bv.length) {
        h += '<label class="cn-lbl2" style="margin-top:8px">Bonus des voies</label>' + bv.map(function (b) {
          var on = choix.hasOwnProperty(b.cle) ? choix[b.cle] : !b.cond;
          return '<button class="cb-bv' + (on ? ' on' : '') + '" data-cb="bv" data-k="' + esc(b.cle) + '" data-v="' + (on ? 0 : 1) + '">' +
            '<b>' + (on ? '☑' : '☐') + ' ' + sgn(b.val) + ' ' + (b.type === 'att' ? 'attaque' : 'DM') + (b.scope === 'C' ? ' au contact' : b.scope === 'D' ? ' à distance' : b.scope === 'M' ? ' magique' : '') +
            '</b> · ' + esc(b.cap) + (b.cond ? ' <i>(conditionnel)</i>' : '') + '<small>' + esc(b.texte.length > 120 ? b.texte.slice(0, 120) + '…' : b.texte) + '</small></button>';
        }).join('');
        h += '<div class="note">Les bonus sans condition sont comptés d’office ; cochez les autres quand leur condition est remplie. Ce choix est gardé sur la fiche.</div>';
      } else h += '<div class="note" style="margin-top:6px">Aucun bonus permanent d’attaque ou de DM trouvé dans les voies de ' + esc(cb.nom) + '.</div>';
    }
    return h + '</div>';
  }
  function htmlModifs(avec2m) {
    return '<div class="cb-modifs"><button data-cb="bonus" class="' + (ui.bonus ? 'on' : '') + '">🎲 Dé bonus</button>' +
      '<button data-cb="malus" class="' + (ui.malus ? 'on' : '') + '">💀 Dé malus</button>' +
      (avec2m ? '<button data-cb="deuxmains" class="' + (ui.deuxMains ? 'on' : '') + '">✋✋ Deux mains</button>' : '') + '</div>';
  }
  function htmlChoixCible(cb) {
    var opt = appliquerArme(cb, ui.choix), vs = cibles(cb, opt);
    var h = '<div class="cb-consigne">' + opt.ic + ' <b>' + esc(opt.nom) + '</b> — touchez ' + (opt.soin ? 'un allié' : 'une cible') + ' sur la carte</div>';
    if (opt.rider) {
      var p = COF.Store.get(cb.refId);
      h += '<div class="cn-mini" style="margin-bottom:6px">' + ((p && p.armes) || []).map(function (w, i) {
        return '<span class="chip' + (opt.armeIdx === i ? ' on' : '') + '" data-cb="arme" data-v="' + i + '">' + (w.type === 'distance' ? '🏹 ' : '⚔️ ') + esc(w.nom) + '</span>';
      }).join('') + '</div><div class="note" style="margin-bottom:6px">Att. ' + sgn(opt.mod) + ' · DM ' + esc(opt.dmg) + (opt.note ? ' — ' + esc(opt.note.slice(0, 110)) : '') + '</div>';
    }
    if (!opt.soin && !opt.auto) h += htmlModifs(!!opt.dmg2);
    if (!vs.length) h += '<div class="note">Aucune cible possible.</div>';
    h += '<div class="cb-cibles">' + vs.map(function (v) {
      var d = donnees(v.cb);
      return '<button data-cb="cibler" data-id="' + v.cb.id + '" class="' + (v.ok ? '' : 'loin') + '"><b>' + esc(d.nom) + '</b><small>' +
        (v.m <= A().GRILLE.m ? 'au contact' : v.m + ' m') + ' · DEF ' + (d.def + effetsEtats(v.cb).def) + ' · ' + d.pv + '/' + d.pvMax + ' PV' + (v.ok ? '' : ' · hors de portée') + '</small></button>';
    }).join('') + '</div>';
    if (opt.auto && !opt.dmg) h += '<button class="btn btn-bloc btn-or" style="margin-top:6px" data-cb="cibler" data-id="' + cb.id + '">✨ Utiliser sans cible</button>';
    return h + '<button class="btn btn-bloc" style="margin-top:6px" data-cb="retour">↩ Retour</button>';
  }
  function htmlDes(r) {
    if (!r.test) return '';
    return '<div class="cb-des">' + r.test.des.map(function (v) {
      return '<span class="de' + (v === r.test.garde ? ' garde' : ' ignore') + (v === 20 ? ' vingt' : '') + (v === 1 ? ' un' : '') + '">' + v + '</span>';
    }).join('') + '<span class="op">' + sgn(r.test.mod) + ' = <b>' + r.test.total + '</b> contre DEF ' + r.def + '</span></div>';
  }
  function htmlResultat() {
    var r = ui.resultat; if (!r) return '';
    var cls = { critique: 'crit', touche: 'ok', rate: 'ko', fumble: 'ko', soin: 'ok', effet: 'ok' }[r.verdict];
    var titre = { critique: '💥 Critique !', touche: '✅ Touché', rate: '❌ Raté', fumble: '💀 Échec critique', soin: '💚 Soins', effet: '✨ Effet' }[r.verdict];
    var h = '<div class="cb-resultat ' + cls + '">';
    if (r.multi) {
      /* plusieurs attaques : une ligne par attaque, la dernière en détail */
      h += '<div class="pv" style="margin-bottom:4px">' + r.multi.slice(0, -1).map(function (x, i) {
        return 'Attaque ' + (i + 1) + ' : ' + ({ critique: 'critique', touche: 'touché', rate: 'raté', fumble: 'échec critique' }[x.verdict] || x.verdict) +
          (x.dm ? ' (' + x.dm.total + ' DM)' : '') + ' → ' + esc(x.cible);
      }).join('<br>') + '</div><div class="pv">Attaque ' + r.multi.length + ' :</div>';
    }
    h += '<div class="v">' + titre + '</div>' + htmlDes(r);
    if (r.dm) {
      h += '<div class="dm"><b>' + r.dm.total + ' DM</b> <small>' + esc(r.dm.detail.map(function (x) { return x.jets ? x.label + ' [' + x.jets.join(',') + ']' : x.label + ' ' + sgn(x.val); }).join(' ')) +
        (r.crit ? ' ×2' : '') + '</small></div><div class="pv">' + esc(r.cible) + ' : ' + esc(r.pvApres) + ' PV</div>';
    }
    if (r.soin) h += '<div class="dm"><b>+' + r.soin.total + ' PV</b> → ' + esc(r.cible) + '</div>';
    if (r.verdict === 'effet' && r.opt.note) h += '<div class="pv">' + esc(r.opt.note.length > 200 ? r.opt.note.slice(0, 200) + '…' : r.opt.note) + '</div>';
    r.lignes.forEach(function (l) { h += '<div class="pv">' + esc(l) + '</div>'; });
    h += '</div><div class="cn-grille" style="margin-top:8px"><button data-cb="annuler"' + (ui.annuler ? '' : ' disabled') + '>↶ Annuler</button>' +
      '<button data-cb="continuer" class="on">' + (peut('A') || peut('M') ? 'Continuer le tour' : '⏭️ Fin du tour') + '</button></div>';
    return h;
  }
  function htmlFicheRapide(c) {
    if (!c) { ui.sel = null; return htmlPanneau(); }
    var d = donnees(c), ea = effetsEtats(c), cb = actif(), dist = cb ? A().distance(cb, c) : null;
    return '<div class="cb-qui"><b>' + esc(d.nom) + '</b><span>DEF ' + (d.def + ea.def) + ' · Init. ' + d.init + (dist !== null ? ' · à ' + dist + ' m de ' + esc(cb.nom) : '') + '</span></div>' +
      '<div class="cb-pvligne"><button data-cb="pv" data-v="-5" data-id="' + c.id + '">−5</button><button data-cb="pv" data-v="-1" data-id="' + c.id + '">−1</button>' +
      '<b>❤️ ' + d.pv + '/' + d.pvMax + '</b><button data-cb="pv" data-v="1" data-id="' + c.id + '">+1</button><button data-cb="pv" data-v="5" data-id="' + c.id + '">+5</button></div>' +
      (ea.raisons.length ? '<div class="cb-etats">🌀 ' + esc(ea.raisons.join(' · ')) + '</div>' : '') +
      '<div class="cn-grille cn-g3" style="margin-top:6px"><button data-cb="etats" data-id="' + c.id + '">🌀 États</button>' +
      (c.type === 'creature' && c.refId ? '<button data-cb="fiche" data-id="' + c.id + '">📖 Fiche</button>' : '<button disabled>—</button>') +
      '<button data-cb="retirer" data-id="' + c.id + '" class="ko">✕ Retirer</button></div>' +
      '<button class="btn btn-bloc" style="margin-top:6px" data-cb="desel">↩ Retour au tour de ' + esc(cb ? cb.nom : '') + '</button>';
  }

  /* ---------- Feuilles (ajouts, réglages, états) ---------- */
  function ouvrirAjoutBete() {
    var pool = COF.BESTIAIRE.filter(function (c) { return !rechercheBeteQ || c.nom.toLowerCase().indexOf(rechercheBeteQ) >= 0; }).slice(0, 40);
    var h = '<input id="arene-recherche-bete" placeholder="Rechercher une créature…" value="' + esc(rechercheBeteQ) + '" class="cb-recherche">';
    if (!pool.length) h += '<div class="vide">Aucune créature trouvée.</div>';
    pool.forEach(function (c) {
      h += '<div class="ligne"><div class="info"><div class="t">' + esc(c.nom) + '</div><div class="s">NC ' + esc(c.ncLabel) + ' · ' + esc(c.type || '') + '</div></div>' +
        '<div class="actions"><button class="btn btn-or btn-sm" data-cb="ajouter-bete" data-id="' + c.id + '">+ Ajouter</button></div></div>';
    });
    COF.UI.ouvrirModale('🐉 Ajouter une créature', h);
    var input = $('#arene-recherche-bete');
    if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
  }
  function ouvrirAjoutPj() {
    var h = '';
    COF.Store.tous().forEach(function (p) {
      var deja = s.combattants.some(function (c) { return c.type === 'pj' && c.refId === p.id; });
      h += '<div class="ligne"><div class="info"><div class="t">' + esc(p.nom) + '</div><div class="s">niv. ' + p.niveau + '</div></div>' +
        '<div class="actions">' + (deja ? '<button class="btn btn-sm" disabled>Présent</button>' : '<button class="btn btn-or btn-sm" data-cb="ajouter-pj" data-id="' + p.id + '">+ Ajouter</button>') + '</div></div>';
    });
    COF.UI.ouvrirModale('🛡️ Ajouter un personnage', h || '<div class="vide">Aucun personnage.</div>');
  }
  function ouvrirEtats(c) {
    var h = '<div class="cn-grille">' + COF.RULES.etats.map(function (e) {
      return '<button data-cb="etat" data-id="' + c.id + '" data-e="' + e.id + '" class="' + (a(c, e.id) ? 'on' : '') + '">' + esc(e.nom) + '</button>';
    }).join('') + '</div><div class="note" style="margin-top:10px">' + COF.RULES.etats.map(function (e) { return '<b>' + esc(e.nom) + '</b> — ' + esc(e.effet); }).join('<br>') +
      '</div><div class="note" style="margin-top:8px">Appliqués automatiquement : malus, DEF réduite, tour perdu, critique sur un paralysé.</div>';
    COF.UI.ouvrirModale('🌀 États de ' + donnees(c).nom, h);
  }
  function ouvrirConfig() {
    var dernier = COF.UI.Generateurs && COF.UI.Generateurs.dernierResultat();
    COF.UI.ouvrirModale('⚙️ Combat',
      '<div class="cn-grille"><button data-cb="ajout-bete">🐉 + Créature</button><button data-cb="ajout-pj">🛡️ + Personnage</button></div>' +
      '<button class="btn btn-bloc" style="margin-top:6px" data-cb="importer"' + (dernier && !dernier.erreur ? '' : ' disabled') + '>📥 Ajouter la dernière rencontre générée</button>' +
      '<label class="cn-lbl2" style="margin-top:12px">Qui joue quoi</label>' +
      '<button class="btn btn-bloc" data-cb="tog-crea">🐉 Créatures jouées par l’app : <b>' + (s.creaturesAuto !== false ? 'oui' : 'non') + '</b></button>' +
      '<button class="btn btn-bloc" style="margin-top:6px" data-cb="tog-allies">🤝 Alliés joués par l’app : <b>' + (s.alliesAuto !== false ? 'oui' : 'non') + '</b></button>' +
      '<label class="cn-lbl2" style="margin-top:12px">Initiative</label>' +
      '<button class="btn btn-bloc" data-cb="trier">🔃 Retrier par initiative (round 1)</button>' +
      '<button class="btn btn-bloc btn-sang" style="margin-top:12px" data-cb="vider">🧹 Vider le combat</button>');
  }

  /* ================= Actions ================= */
  function action(act, node) {
    var id = node.getAttribute('data-id'), v = node.getAttribute('data-v'), cb = actif();
    switch (act) {
      case 'importer': {
        var r = COF.UI.Generateurs.dernierResultat();
        if (r && !r.erreur) { A().ajouterLots(s, r.lots); trierInit(); A().ecrire(s); }
        COF.UI.fermerModale(); break;
      }
      case 'ajout-bete': rechercheBeteQ = ''; ouvrirAjoutBete(); return;
      case 'ajout-pj': ouvrirAjoutPj(); return;
      case 'ajouter-bete': { var bc = COF.UI.Bestiaire.get(id); if (bc) { A().ajouterCreature(s, bc); A().ecrire(s); } rafraichir(); ouvrirAjoutBete(); return; }
      case 'ajouter-pj': { var p0 = COF.Store.get(id); if (p0) { A().ajouterPersonnage(s, p0); A().ecrire(s); } COF.UI.fermerModale(); break; }
      case 'config': ouvrirConfig(); return;
      case 'tog-crea': s.creaturesAuto = s.creaturesAuto === false; A().ecrire(s); ouvrirConfig(); break;
      case 'tog-allies': s.alliesAuto = s.alliesAuto === false; A().ecrire(s); ouvrirConfig(); break;
      case 'trier': trierInit(); s.round = 1; A().ecrire(s); COF.UI.fermerModale(); break;
      case 'vider':
        if (!confirm('Vider le combat et retirer tous les combattants ?')) return;
        s = A().vider(); s.log = []; A().ecrire(s); ui.sel = null; ui.mode = 'menu'; COF.UI.fermerModale(); break;
      case 'sel': ui.sel = ui.sel === id ? null : id; if (ui.mode !== 'cible' && ui.mode !== 'deplacer') ui.mode = 'menu'; break;
      case 'desel': ui.sel = null; break;
      case 'journal': ui.journal = !ui.journal; break;
      case 'pion': {
        if (ui.mode === 'cible') { var cc = trouver(id); if (cc) return cibler(cc); }
        ui.sel = ui.sel === id ? null : id; ui.mode = 'menu'; break;
      }
      case 'case': {
        if (ui.mode !== 'deplacer' || !cb) return;
        var nx = +node.getAttribute('data-x'), ny = +node.getAttribute('data-y');
        var dc = Math.max(Math.abs(cb.x - nx), Math.abs(cb.y - ny));
        if (dc > A().GRILLE.pas) return;
        memoriser();
        log('👣 ' + cb.nom + ' se déplace de ' + dc * A().GRILLE.m + ' m.');
        cb.x = nx; cb.y = ny; depenser('M'); ui.mode = 'menu'; A().ecrire(s); break;
      }
      case 'deplacer': ui.mode = 'deplacer'; ui.sel = null; break;
      case 'liste': ui.mode = 'liste'; ui.cat = v; ui.sel = null; break;
      case 'retour': ui.mode = ui.mode === 'cible' ? 'liste' : 'menu'; ui.choix = null; break;
      case 'choisir': ui.choix = options(cb).filter(function (o) { return o.id === v; })[0] || null; ui.arme = null; ui.mode = ui.choix ? 'cible' : 'menu'; break;
      case 'arme': ui.arme = +v; break;
      case 'ajuster': ui.ajuster = !ui.ajuster; break;
      case 'adj': { if (cb) { var k = node.getAttribute('data-k'); cb[k] = Math.max(-10, Math.min(10, (cb[k] || 0) + (+v))); A().ecrire(s); } break; }
      case 'bv': {
        var pb = cb && COF.Store.get(cb.refId);
        if (pb) { pb.bonusVoies = pb.bonusVoies || {}; pb.bonusVoies[node.getAttribute('data-k')] = v === '1'; COF.Store.sauver(pb); }
        break;
      }
      case 'bonus': ui.bonus = !ui.bonus; if (ui.bonus) ui.malus = false; break;
      case 'malus': ui.malus = !ui.malus; if (ui.malus) ui.bonus = false; break;
      case 'deuxmains': ui.deuxMains = !ui.deuxMains; break;
      case 'cibler': { var ct = trouver(id); if (ct) return cibler(ct); break; }
      case 'annuler': annuler(); break;
      case 'continuer': ui.mode = 'menu'; ui.resultat = null; ui.bonus = false; ui.malus = false; ui.deuxMains = false; if (!(peut('A') || peut('M'))) { tourSuivant(); } break;
      case 'fin-tour': ui.sel = null; tourSuivant(); break;
      case 'auto': { if (cb) { memoriser(); eco(); jouerAuto(cb); A().ecrire(s); tourSuivant(); } break; }
      case 'manuel': if (cb) { cb.manuel = true; A().ecrire(s); } break;
      case 'rendre-ia': if (cb) { cb.manuel = false; A().ecrire(s); } break;
      case 'etats': { var ce = trouver(id); if (ce) ouvrirEtats(ce); return; }
      case 'etat': { var cx = trouver(id); if (cx) { A().toggleEtat(cx, node.getAttribute('data-e')); A().ecrire(s); rafraichir(); ouvrirEtats(cx); } return; }
      case 'fiche': { var cf = trouver(id), bb = cf && COF.UI.Bestiaire.get(cf.refId); if (bb) COF.UI.Bestiaire.fiche(bb); return; }
      case 'pv': { var cp = trouver(id); if (cp) { ajusterPv(cp, +v); A().ecrire(s); } break; }
      case 'retirer': if (confirm('Retirer ce combattant ?')) { A().retirer(s, id); ui.sel = null; A().ecrire(s); } break;
      default: return;
    }
    rafraichir();
  }
  function cibler(t) {
    var cb = actif(), opt = ui.choix ? appliquerArme(cb, ui.choix) : null; if (!cb || !opt) return;
    var v = cibles(cb, opt).filter(function (x) { return x.cb === t; })[0];
    if (!v && !(opt.auto && !opt.dmg && t === cb)) return;
    if (v && !v.ok && !confirm(donnees(t).nom + ' est hors de portée (' + v.m + ' m). Attaquer quand même ?')) return;
    ui.resultat = resoudre(cb, opt, t);
    ui.mode = 'resultat'; ui.sel = null;
    A().ecrire(s);
    rafraichir();
  }
  function trierInit() {
    s.combattants.sort(function (x, y) { return donnees(y).init - donnees(x).init; });
    s.tour = 0;
  }

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-cb]') : null;
      if (!t || !(t.closest('#vue-arene') || t.closest('#modale'))) return;
      if (t.disabled) return;
      if (!s) s = A().lire();
      action(t.getAttribute('data-cb'), t);
    });
    document.addEventListener('input', function (e) {
      if (e.target.id === 'arene-recherche-bete') { rechercheBeteQ = e.target.value.toLowerCase(); ouvrirAjoutBete(); }
    });
  }

  return { init: init, rendre: rendre, verserJournal: function () { if (s) verserJournal(); } };
})();
