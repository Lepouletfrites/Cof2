/* ============================================================
   COF2 Compagnon — Combat (Arène), version narrative
   Un seul écran pensé pour le téléphone, sans cases ni pions :
     ┌ la situation : votre groupe, puis les adversaires rangés par
     │  distance (au contact · proche · à portée · loin)
     ├ le récit du combat, raconté phrase par phrase (les dés en petit)
     └ panneau d'action du combattant actif :
         ⚔️ Attaquer · ✨ Sorts & capacités · 🤼 Manœuvre ·
         👣 Se déplacer · 🧪 Soins & objets · ⏭️ Fin du tour
   Déroulé d'une attaque : choisir l'attaque → toucher une cible (un
   adversaire « proche » peut être chargé : on s'approche puis on
   frappe) → résultat raconté, dés, DM appliqués → « ↶ Annuler ».
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
    var K = COF.Calc, bv = bonusActifs(p);   /* bonus de DEF / Init. des voies (cochés ou sans condition) */
    return { nom: p.nom, pv: p.pv, pvMax: K.pvMax(p), def: K.def(p) + bv.def, init: K.init(p) + bv.init, pm: p.pm || 0, pmMax: K.pmMax(p), vivant: true, perso: p };
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
      out = out.concat(optionsManoeuvres(cb));
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
    /* Objets consommables de l'inventaire (potions, élixirs, onguents…) :
       la formule de soin est lue dans leur description (« Rend 1d4° PV »). */
    (p.inventaire || []).forEach(function (o, i) {
      if (!/potion|élixir|elixir|onguent|baume|fiole|eau bénite|parchemin|flasque|antidote|herbe|remède|cataplasme|bandage/i.test(o.nom)) return;
      var f = formuleSoin(o.desc || o.note || '');
      out.push({ id: 'o' + i, cat: 'objet', ic: '🧪', nom: o.nom.replace(/^✨ /, '') + ((o.qte || 1) > 1 ? ' ×' + o.qte : ''), soin: !!f, dmg: f, inv: i,
        auto: true, portee: 3, action: 'A', ctx: K.ctx(p), note: o.desc || '' });
    });
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
    return out.concat(optionsManoeuvres(cb));
  }
  /* Formule de soin d'un objet : « Rend 1d4° PV », « [2d8 + CON] PV »… */
  function formuleSoin(d) {
    var m = /(\d*d\d+°?(?:\s*\+\s*(?:\d+|FOR|AGI|CON|PER|CHA|INT|VOL|niveau|rang))*)\s*\]?\s*(?:points? de vigueur|PV)/i.exec(d || '');
    return m && /rend|soign|récup|restaure|regagne|guérit|PV/i.test(d) ? m[1].replace(/\s+/g, '') : null;
  }
  /* ---------- Manœuvres (test opposé au contact) ---------- */
  var MANOEUVRES = [
    { id: 'renverser', ic: '🤼', nom: 'Renverser', note: 'Test opposé : la cible tombe (état Renversé : −5 en attaque et DEF, une action pour se relever).' },
    { id: 'desarmer', ic: '🗡️', nom: 'Désarmer', note: 'Test opposé : la cible lâche son arme et perd son prochain tour à la ramasser (créature) ou doit la ramasser (action de mouvement).' },
    { id: 'saisir', ic: '✊', nom: 'Saisir / bloquer', note: 'Test opposé : la cible est Immobilisée (pas de déplacement, dé malus en attaque) jusqu’à ce qu’on la libère.' },
    { id: 'pousser', ic: '💨', nom: 'Repousser', note: 'Test opposé : la cible recule de 6 m.' },
    { id: 'couvert', ic: '🛡️', nom: 'Se mettre à couvert', note: '+2 en DEF contre les attaques à distance jusqu’à votre prochain tour (action de mouvement).', soi: true, action: 'M' }
  ];
  function optionsManoeuvres(cb) {
    return MANOEUVRES.map(function (m) {
      return { id: 'm-' + m.id, cat: 'manoeuvre', ic: m.ic, nom: m.nom, manoeuvre: m.id, note: m.note, action: m.action || 'A', portee: null, auto: !!m.soi, soi: !!m.soi };
    });
  }
  function modMelee(cb) {
    if (cb.type === 'pj') { var p = COF.Store.get(cb.refId); return p ? COF.Calc.attaques(p).contact + (cb.adjAtt || 0) : 0; }
    var m = (cb.att || []).filter(function (x) { return !analyseAttCreature(x).portee; }).map(function (x) { return x.mod || 0; });
    return (m.length ? Math.max.apply(null, m) : ((cb.att && cb.att[0] && cb.att[0].mod) || Math.floor(cb.nc) || 0)) + (cb.adjAtt || 0);
  }
  function resoudreManoeuvre(cb, opt, t) {
    var d = donnees(t), r = { opt: opt, cible: d.nom, lignes: [], manoeuvre: true };
    if (opt.manoeuvre === 'couvert') {
      cb.couvertJusqua = s.round + 1; r.verdict = 'effet';
      r.recit = cb.nom + ' se met à l’abri derrière un obstacle.';
      log(r.recit, '+2 DEF contre les tirs jusqu’à son prochain tour');
      return r;
    }
    var ea = effetsEtats(cb), et = effetsEtats(t);
    var ta = COF.Dice.test({ mod: modMelee(cb) + ea.att, bonus: ui.bonus, malus: ui.malus || ea.malus });
    var td = COF.Dice.test({ mod: modMelee(t) + et.att, malus: et.malus });
    r.oppose = { a: ta, d: td };
    var ok = ta.total > td.total;
    r.verdict = ok ? 'touche' : 'rate';
    var effet = '', an = cb.nom, cn = d.nom;
    var RECITS = {
      renverser: [an + ' bouscule ' + cn + ', qui s’étale au sol.', cn + ' résiste à la poussée ' + COF.Narration.de(an) + '.'],
      desarmer: ['D’un geste vif, ' + an + ' fait sauter l’arme des mains ' + COF.Narration.de(cn) + '.', cn + ' garde fermement son arme.'],
      saisir: [an + ' empoigne ' + cn + ' et l’immobilise.', cn + ' se dégage de la prise ' + COF.Narration.de(an) + '.'],
      pousser: [an + ' repousse violemment ' + cn + '.', cn + ' ne recule pas d’un pouce.']
    };
    if (ok) {
      if (opt.manoeuvre === 'renverser') { if (!a(t, 'renverse')) A().toggleEtat(t, 'renverse'); effet = 'état Renversé'; }
      else if (opt.manoeuvre === 'saisir') { if (!a(t, 'immobilise')) A().toggleEtat(t, 'immobilise'); effet = 'état Immobilisé'; }
      else if (opt.manoeuvre === 'desarmer') { t.desarme = true; effet = 'perd son prochain tour à ramasser son arme'; }
      else if (opt.manoeuvre === 'pousser') { A().eloigner(s, t, cb, 1); effet = 'repoussé : ' + A().ZONES[A().zoneEntre(cb, t)].nom.toLowerCase(); }
      r.lignes.push(effet);
    }
    r.recit = (RECITS[opt.manoeuvre] || ['', ''])[ok ? 0 : 1];
    stat('manoeuvres', cb.nom + ' : ' + opt.nom.toLowerCase() + (ok ? ' réussi' : ' raté') + ' contre ' + d.nom);
    log(r.recit, opt.nom + ' : ' + ta.total + ' contre ' + td.total + (ok ? ' → ' + effet : ' → raté'));
    return r;
  }
  /* Utilise (consomme) un objet de l'inventaire. */
  function consommer(cb, opt) {
    if (opt.inv === undefined || cb.type !== 'pj') return;
    var p = COF.Store.get(cb.refId); if (!p || !p.inventaire[opt.inv]) return;
    var o = p.inventaire[opt.inv];
    if ((o.qte || 1) > 1) o.qte--; else p.inventaire.splice(opt.inv, 1);
    COF.Store.sauver(p);
    stat('objets', cb.nom + ' : ' + opt.nom.replace(/ ×\d+$/, ''));
  }

  /* ---------- Statistiques du combat (pour le bilan) ---------- */
  function stat(k, v, n) {
    s.stats = s.stats || { inflige: {}, subi: {}, soins: {}, crits: [], ko: [], objets: [], manoeuvres: [], meilleur: null };
    var st = s.stats;
    if (k === 'inflige' || k === 'subi' || k === 'soins') st[k][v] = (st[k][v] || 0) + n;
    else if (k === 'ko') { if (st.ko.indexOf(v) < 0) st.ko.push(v); }
    else st[k].push(v);
  }

  /* ---------- Bilan du combat (affiché en fin de combat et versé au Carnet) ---------- */
  function bilan(issue) {
    s = s || A().lire();
    var st = s.stats || { inflige: {}, subi: {}, soins: {}, crits: [], ko: [], objets: [], manoeuvres: [], meilleur: null };
    var heros = s.combattants.filter(function (c) { return camp(c) === 'heros'; }), adv = s.combattants.filter(function (c) { return camp(c) === 'monstres'; });
    function somme(liste, tab) { return liste.reduce(function (n, c) { return n + (tab[c.nom] || 0); }, 0); }
    var infl = somme(heros, st.inflige), subi = somme(heros, st.subi);
    var tombes = adv.filter(function (c) { return donnees(c).pv <= 0; }).map(function (c) { return c.nom; });
    var fuis = adv.filter(function (c) { return c.moral === 'fuite'; }).map(function (c) { return c.nom; });
    var rendus = adv.filter(function (c) { return c.moral === 'reddition'; }).map(function (c) { return c.nom; });
    var herosKo = heros.filter(function (c) { return donnees(c).pv <= 0; }).map(function (c) { return c.nom; });
    var mvp = heros.slice().sort(function (x, y) { return (st.inflige[y.nom] || 0) - (st.inflige[x.nom] || 0); })[0];
    var fil = (s.log || []).map(function (x) { return typeof x === 'string' ? x : x.r; }).filter(Boolean);
    if (fil.length > 30) fil = fil.slice(0, 4).concat(['…']).concat(fil.slice(-25));
    var L = [];
    L.push('Combat de ' + s.round + ' round' + (s.round > 1 ? 's' : '') + ' contre ' + adv.map(function (c) { return c.nom; }).join(', ') + '.');
    L.push('Dégâts : ' + infl + ' infligés, ' + subi + ' subis par le groupe.');
    if (tombes.length) L.push('Abattus : ' + tombes.join(', ') + '.');
    if (fuis.length) L.push('En fuite : ' + fuis.join(', ') + '.');
    if (rendus.length) L.push('Se sont rendus : ' + rendus.join(', ') + '.');
    if (herosKo.length) L.push('À terre côté héros : ' + herosKo.join(', ') + '.');
    if (st.meilleur) L.push('Plus beau coup : ' + st.meilleur.par + ' sur ' + st.meilleur.sur + ' (' + st.meilleur.arme + ', ' + st.meilleur.dm + ' DM' + (st.meilleur.crit ? ', critique' : '') + ').');
    if (st.crits.length) L.push('Critiques : ' + st.crits.length + '.');
    var soins = Object.keys(st.soins).map(function (k) { return k + ' +' + st.soins[k]; });
    if (soins.length) L.push('Soins : ' + soins.join(', ') + ' PV.');
    if (st.objets.length) L.push('Objets utilisés : ' + st.objets.join(' ; ') + '.');
    if (st.manoeuvres.length) L.push('Manœuvres : ' + st.manoeuvres.join(' ; ') + '.');
    heros.forEach(function (c) { var d = donnees(c); L.push(c.nom + ' termine à ' + d.pv + '/' + d.pvMax + ' PV.'); });
    /* une phrase de récit, selon l'issue et les temps forts */
    var victoire = issue ? issue === 'victoire' : !campDebout('monstres');
    var recit;
    if (victoire) {
      recit = (mvp && st.inflige[mvp.nom] ? mvp.nom + ' mène la charge' : 'Le groupe tient bon') +
        (st.meilleur && st.meilleur.crit ? ' et ' + st.meilleur.par + ' porte un coup terrible à ' + st.meilleur.sur : '') +
        (s.round <= 2 ? ' : l’affrontement est expédié en un éclair.' : (s.round >= 6 ? ' au terme d’un combat long et éprouvant.' : '.')) +
        (subi > infl ? ' La victoire a coûté cher.' : '') + (fuis.length ? ' ' + fuis.join(' et ') + ' s’échappe' + (fuis.length > 1 ? 'nt' : '') + ' : on pourrait le' + (fuis.length > 1 ? 's' : '') + ' revoir.' : '');
    } else if (issue === 'fuite') recit = 'Le groupe rompt le combat et se replie, laissant le champ libre à ses adversaires.';
    else recit = 'Le combat tourne mal : ' + (herosKo.length ? herosKo.join(' et ') + ' s’effondre' + (herosKo.length > 1 ? 'nt' : '') : 'le héros est débordé') + '.';
    return { lignes: L, recit: recit, fil: fil, texte: recit + (fil.length ? '\n\n' + fil.join('\n') : '') + '\n\n' + L.join('\n') };
  }
  /* Récupération rapide proposée en fin de combat (1 DR). */
  function recupRapide(cb) {
    var p = COF.Store.get(cb.refId); if (!p) return null;
    if ((p.dr || 0) <= 0) return 'Plus de dé de récupération.';
    p.dr--;
    var K = COF.Calc, jr = COF.Dice.dommages('1d' + K.drType(p), K.ctx(p), {}), gain = jr.total + Math.floor((p.niveau || 1) / 2);
    p.pv = Math.min(K.pvMax(p), p.pv + gain); COF.Store.sauver(p);
    log(p.nom + ' reprend son souffle et panse ses plaies.', '+' + gain + ' PV (' + p.pv + '/' + K.pvMax(p) + ', ' + p.dr + ' DR restant)');
    return '+' + gain + ' PV';
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
  var ACTIVABLE = /×|par combat|par jour|pendant|en forme|forme d|\bPC\b|dépens|invoqu|appel|compagnon|loup|golem|familier|monture|animal|esprit de|rage|transe|furie|pour le round|ce round|au début du round/i;
  function bonusVoies(p) {
    var out = [];
    COF.Calc.capacites(p).forEach(function (x) {
      var c = x.cap; if (c.a || !c.d) return;
      var re = /\+\s?(\d+)\s+(?:en |aux |à l['’]|à la |à son )?(attaque|DM|DEF|défense|Initiative|Init\.?)(?:\s+(au contact|à distance|magique|des armes à distance))?([^.;]*)/gi, m;
      while ((m = re.exec(c.d)) !== null) {
        var val = +m[1], suite = c.d.slice(m.index, m.index + 160);
        var prog = /\(\s*\+\s?(\d+)\s+au rang\s+(\d)(?:\s*,\s*\+\s?(\d+)\s+au rang\s+(\d))?/i.exec(suite);
        if (prog) { if (x.rang >= +prog[2]) val = +prog[1]; if (prog[4] && x.rang >= +prog[4]) val = +prog[3]; }
        var phrase = c.d.slice(Math.max(0, c.d.lastIndexOf('.', m.index) + 1), c.d.indexOf('.', m.index) > 0 ? c.d.indexOf('.', m.index) : undefined);
        var scope = /contact/i.test(m[3] || '') ? 'C' : (/distance/i.test(m[3] || '') ? 'D' : (/magique/i.test(m[3] || '') ? 'M' : 'tous'));
        var ty = /^DM$/i.test(m[2]) ? 'dm' : (/DEF|défense/i.test(m[2]) ? 'def' : (/^Init/i.test(m[2]) ? 'init' : 'att'));
        if (ty === 'def' || ty === 'init') scope = 'tous';
        var cond = COND.test(phrase) || ACTIVABLE.test(c.n + ' ' + c.d);
        out.push({ cle: x.voieKey + '|' + c.r + '|' + out.length, cap: c.n, voie: x.voie.nom, type: ty, val: val, scope: scope, cond: cond, texte: phrase.trim() });
        /* « +2 en DEF et en Initiative » : le même bonus s'applique au second terme */
        var et2 = /^\s*et\s+(?:en |aux |à l['’]|à la |à son )?(attaque|DM|DEF|défense|Initiative|Init\.?)/i.exec(m[4] || '');
        if (et2) {
          var ty2 = /^DM$/i.test(et2[1]) ? 'dm' : (/DEF|défense/i.test(et2[1]) ? 'def' : (/^Init/i.test(et2[1]) ? 'init' : 'att'));
          out.push({ cle: x.voieKey + '|' + c.r + '|' + out.length, cap: c.n, voie: x.voie.nom, type: ty2, val: val, scope: 'tous', cond: cond, texte: phrase.trim() });
        }
      }
    });
    return out;
  }
  var cacheBonus = {};
  function bonusActifs(p) {
    var cle = p.id + '|' + JSON.stringify(p.voies || []) + '|' + JSON.stringify(p.bonusVoies || {});
    if (cacheBonus[cle]) return cacheBonus[cle];
    var choix = p.bonusVoies || {}, r = { attC: 0, attD: 0, attM: 0, dmC: 0, dmD: 0, def: 0, init: 0 };
    bonusVoies(p).forEach(function (b) {
      var on = choix.hasOwnProperty(b.cle) ? choix[b.cle] : !b.cond;
      if (!on) return;
      if (b.type === 'def' || b.type === 'init') { r[b.type] += b.val; return; }
      var cles = b.scope === 'tous' ? ['C', 'D', 'M'] : [b.scope];
      cles.forEach(function (k) { if (b.type === 'att') r['att' + k] += b.val; else if (k !== 'M') r['dm' + k] += b.val; });
    });
    cacheBonus = {}; cacheBonus[cle] = r;
    return r;
  }
  function ctxCreature(cb) { var n = Math.floor(cb.nc) || 1; return { carac: {}, niveau: n, deEvo: COF.deEvolutif(n) }; }
  function zonePortee(opt) { return opt.portee ? A().zonePortee(opt) : 0; }
  function nomZone(z) { return A().ZONES[z].nom.toLowerCase(); }
  /* Cibles possibles pour une option : adversaires (ou alliés pour un soin).
     ok : la cible est à portée ; charge : au corps à corps, un adversaire
     « proche » peut être chargé (on s'approche, puis on frappe). */
  function cibles(cb, opt) {
    return s.combattants.filter(function (c) {
      if (!donnees(c).vivant || c.horsDeVue) return false;
      if (opt.soin) return camp(c) === camp(cb) && donnees(c).pv < donnees(c).pvMax;
      return camp(c) !== camp(cb) && donnees(c).pv > 0;
    }).map(function (c) {
      var z = A().zoneEntre(cb, c), ok = opt.soin ? true : z <= zonePortee(opt);
      var charge = !ok && !opt.portee && !opt.soin && z === 1 && eco().m && eco().a && !effetsEtats(cb).pasDeMouv;
      return { cb: c, z: z, ok: ok, charge: charge };
    });
  }

  /* ================= Récit du combat =================
     Chaque ligne : r = la phrase racontée, m = le détail des dés. */
  function log(r, m) {
    s.log = s.log || []; s.log.push({ r: r, m: m || '' }); if (s.log.length > 80) s.log = s.log.slice(-80);
  }
  function combatAventure() { if (COF.modeDonnees() !== 'aventure') return null; var c = COF.Carnet && COF.Carnet.actif(); return c && c.combat ? c : null; }
  /* Le récit complet est versé au Carnet en fin de combat (bilan). */
  function verserJournal() { journalCombat = []; }

  /* ================= Annuler la dernière action ================= */
  function memoriser() {
    var persos = {};
    s.combattants.forEach(function (c) {
      if (c.type === 'pj') { var p = COF.Store.get(c.refId); if (p) persos[p.id] = { pv: p.pv, pm: p.pm, inv: JSON.stringify(p.inventaire || []) }; }
    });
    ui.annuler = { s: JSON.stringify(s), persos: persos, jl: 0 };
  }
  function annuler() {
    if (!ui.annuler) return;
    s = JSON.parse(ui.annuler.s);
    Object.keys(ui.annuler.persos).forEach(function (id) {
      var p = COF.Store.get(id); if (!p) return;
      p.pv = ui.annuler.persos[id].pv; p.pm = ui.annuler.persos[id].pm;
      if (ui.annuler.persos[id].inv) p.inventaire = JSON.parse(ui.annuler.persos[id].inv);   /* objet utilisé : rendu */
      COF.Store.sauver(p);
    });
    ui.annuler = null; ui.resultat = null; ui.mode = 'menu';
    A().ecrire(s);
  }

  /* ================= Résolution d'une action ================= */
  /* Résout une action complète : coût, action dépensée, puis une ou
     plusieurs attaques (créatures à « 2 attaques »), recharge éventuelle. */
  function resoudre(cb, opt, t, dejaMemo) {
    if (!dejaMemo) memoriser();
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
    if (opt.manoeuvre) return resoudreManoeuvre(cb, opt, t);
    if (opt.soin) {
      var h = COF.Dice.dommages(opt.dmg || '1d4', opt.ctx, {});
      ajusterPv(t, h.total);
      r.soin = h; r.verdict = 'soin';
      stat('soins', d.nom, h.total);
      consommer(cb, opt);
      r.recit = COF.Narration.soin(cb.nom, t === cb ? cb.nom : d.nom, opt.inv !== undefined ? opt.nom.replace(/ ×\d+$/, '').toLowerCase() : null, h.total);
      log(r.recit, opt.nom.replace(/ ×\d+$/, '') + ' : ' + h.total + ' → ' + donnees(t).pv + '/' + d.pvMax + ' PV');
      return r;
    }
    if (opt.auto && !opt.dmg) {
      r.verdict = 'effet';
      consommer(cb, opt);
      r.recit = cb.nom + ' utilise ' + opt.nom.replace(/ ×\d+$/, '') + (t !== cb ? ' sur ' + d.nom : '') + '.';
      log(r.recit, opt.note ? opt.note.slice(0, 120) : '');
      return r;
    }
    var def = d.def + et.def;
    if (opt.portee && t.couvertJusqua >= s.round) { def += 2; r.lignes.push(d.nom + ' est à couvert : +2 DEF.'); }
    /* tirer sur un adversaire au contact : dé malus (arme à distance) */
    var malusContact = opt.cat === 'attaque' && opt.portee && !opt.auto && A().zoneEntre(cb, t) === 0 && cb.type === 'pj';
    if (malusContact) r.lignes.push('Tir au contact : dé malus.');
    var test = null, touche, crit = false;
    if (opt.auto) { touche = true; }
    else {
      test = COF.Dice.test({ mod: (opt.mod || 0) + ea.att, difficulte: def, bonus: ui.bonus && !malusContact, malus: ui.malus || ea.malus || malusContact, critMin: opt.crit || 20 });
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
      stat('inflige', cb.nom, dm.total); stat('subi', d.nom, dm.total);
      if (crit) stat('crits', { par: cb.nom, sur: d.nom, dm: dm.total });
      if (camp(cb) === 'heros' && (!s.stats.meilleur || dm.total > s.stats.meilleur.dm)) s.stats.meilleur = { par: cb.nom, sur: d.nom, dm: dm.total, arme: opt.nom, crit: crit };
      if (apres.pv <= 0) stat('ko', d.nom);
      r.recit = COF.Narration.attaque({ a: cb.nom, c: d.nom, arme: opt.armeNom || opt.nom, sort: opt.cat === 'sort', distance: !!opt.portee,
        verdict: r.verdict, dm: dm.total, ko: apres.pv <= 0, pv: apres.pv, pvMax: d.pvMax, crit: crit, heros: t.type === 'pj' });
      log(r.recit, opt.nom + (opt.armeNom ? ' (' + opt.armeNom + ')' : '') + ' : ' + (test ? test.total + ' contre DEF ' + def : 'automatique') + ' → ' +
        (crit ? 'critique, ' : '') + dm.total + ' DM' + (apres.pv <= 0 ? ', à terre' : ' (' + r.pvApres + ' PV)'));
    } else if (touche) {
      r.verdict = 'touche';
      r.recit = cb.nom + ' atteint ' + d.nom + ' avec ' + opt.nom + '.';
      log(r.recit, 'touché');
    } else {
      r.verdict = test && test.fumble ? 'fumble' : 'rate';
      r.recit = COF.Narration.attaque({ a: cb.nom, c: d.nom, arme: opt.nom, sort: opt.cat === 'sort', distance: !!opt.portee, verdict: r.verdict });
      log(r.recit, opt.nom + ' : ' + test.total + ' contre DEF ' + def + ' → ' + (test.fumble ? 'échec critique' : 'raté'));
    }
    if (ea.raisons.length) r.lignes.push('États : ' + ea.raisons.join(' ; ') + '.');
    return r;
  }

  /* ================= Tours automatiques (créatures, alliés) ================= */
  function jouerAuto(cb) {
    var ea = effetsEtats(cb), N = COF.Narration;
    if (ea.perdTour) { log(cb.nom + ' ne peut rien faire ce tour-ci.', ea.raisons.join(', ')); return; }
    if (cb.desarme) { cb.desarme = false; log(N.mouvement('ramasse', cb.nom)); return; }
    if (a(cb, 'renverse') && debout(cb)) { A().toggleEtat(cb, 'renverse'); log(N.mouvement('releve', cb.nom)); return; }
    var dec = A().decider(s, cb, donnees);
    /* Moral brisé : la créature s'enfuit (elle quitte le combat) ou se rend. */
    if (dec.type === 'fuite') { cb.horsDeVue = true; cb.zone = 3; log(dec.texte.replace(/\s*\(moral d6 : \d\)/, ''), (dec.texte.match(/moral d6 : \d/) || [''])[0]); return; }
    if (dec.type === 'reddition') { log(N.mouvement('reddition', cb.nom), (dec.texte.match(/moral d6 : \d/) || [''])[0]); return; }
    if (dec.type !== 'att' && dec.type !== 'cap') { log(dec.texte); return; }
    var t = dec.cible, opt = choisirAttaque(cb, t), tn = donnees(t).nom;
    if (!opt) { log(cb.nom + ' hésite, sans moyen d’attaquer.'); return; }
    var z = A().zoneEntre(cb, t), zp = zonePortee(opt);
    /* Tireur au contact sans arme de mêlée : il recule, puis tire. */
    if (opt.portee && z === 0 && !aDeLaMelee(cb) && !ea.pasDeMouv) {
      A().eloigner(s, cb, t, 1); log(N.mouvement('recule', cb.nom), 'mouvement : ' + nomZone(A().zoneEntre(cb, t)));
    } else if (z > zp) {
      if (ea.pasDeMouv) { log(cb.nom + ' est entravé et ne peut pas approcher.'); return; }
      /* trop loin : deux mouvements (il court) et pas d'attaque */
      if (z - zp >= 2) {
        A().approcher(s, cb, t, 2);
        log(A().zoneEntre(cb, t) === 0 ? N.mouvement('engage', cb.nom, tn) : cb.nom + ' court vers ' + tn + '.', 'deux mouvements : ' + nomZone(A().zoneEntre(cb, t)));
        return;
      }
      A().approcher(s, cb, t, 1);
      log(A().zoneEntre(cb, t) === 0 ? N.mouvement('engage', cb.nom, tn) : N.mouvement('approche', cb.nom, tn), 'mouvement : ' + nomZone(A().zoneEntre(cb, t)));
    }
    var sauveBonus = ui.bonus, sauveMalus = ui.malus, sauve2 = ui.deuxMains;
    ui.bonus = false; ui.malus = false; ui.deuxMains = false;
    eco();  resoudre(cb, opt, t);
    ui.bonus = sauveBonus; ui.malus = sauveMalus; ui.deuxMains = sauve2;
  }
  /* Choix d'attaque d'une créature selon la distance de sa cible :
     au contact → la meilleure attaque de mêlée ; sinon une attaque à
     distance qui porte (souffle/zone en priorité s'il est rechargé) ;
     sinon la mêlée (elle approchera) ou la plus longue portée.         */
  function aDeLaMelee(cb) { return options(cb).some(function (o) { return o.cat === 'attaque' && !o.portee && !o.indispo && o.dmg; }); }
  function choisirAttaque(cb, t) {
    var opts = options(cb).filter(function (o) { return o.cat === 'attaque' && o.dmg && !o.indispo; });
    if (!opts.length) return null;
    var z = A().zoneEntre(cb, t);
    var melee = opts.filter(function (o) { return !o.portee; }).sort(function (x, y) { return y.mod - x.mod; });
    var tirs = opts.filter(function (o) { return o.portee && zonePortee(o) >= z; })
      .sort(function (x, y) { return (y.auto ? 1 : 0) - (x.auto ? 1 : 0) || y.mod - x.mod; });
    if (z === 0 && melee.length) return melee[0];
    if (tirs.length) return tirs[0];
    if (melee.length) return melee[0];
    return opts.filter(function (o) { return o.portee; }).sort(function (x, y) { return y.portee - x.portee; })[0];
  }
  function campDebout(c) { return s.combattants.some(function (x) { return camp(x) === c && debout(x) && !x.horsDeVue; }); }
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
      /* la surprise ne dure que le premier round */
      if (s.round > 1) s.combattants.forEach(function (x) { if (a(x, 'surpris')) A().toggleEtat(x, 'surpris'); });
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
    if (s.round > 1) s.combattants.forEach(function (x) { if (a(x, 'surpris')) A().toggleEtat(x, 'surpris'); });
    /* Phrase d'ouverture (combat lancé depuis l'aventure) */
    if (!s.ouvert && s.env !== undefined && s.combattants.some(function (c) { return c.type === 'pj'; })) {
      s.ouvert = true; var ov = COF.Narration.ouverture(s, s.env); if (ov) log(ov, s.surprise === 'heros' ? 'surpris : pas d’action au 1er round' : '');
    }
    var h = (COF.UI.Carnet ? COF.UI.Carnet.banniereCombat() : '') + htmlTete();
    h += '<div class="cb-milieu" id="cb-milieu">' + htmlSituation() + htmlJournal() + '</div>';
    h += '<div class="cb-panneau">' + htmlPanneau() + '</div>';
    cible.innerHTML = h;
    var rj = $('.cb-recit', cible); if (rj) rj.scrollTop = rj.scrollHeight;
    A().ecrire(s);
  }
  function rafraichir() { if (cible) rendre(cible); }

  function htmlVide() {
    var dernier = COF.UI.Generateurs && COF.UI.Generateurs.dernierResultat();
    return (COF.UI.Carnet ? COF.UI.Carnet.banniereCombat() : '') +
      '<div class="carte"><h2>⚔️ Combat</h2><div class="carte-corps">' +
      '<div class="note" style="margin-bottom:12px">Ajoutez les combattants : l’initiative est triée, les adversaires sont rangés par distance ' +
      '(au contact, proche, à portée, loin) et chacun joue à son tour depuis le panneau du bas. En aventure, la rencontre arrive ici toute seule.</div>' +
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
  /* ---------- La situation : votre groupe, puis les adversaires par distance ---------- */
  function jeton(c, vis) {
    var d = donnees(c), pct = Math.max(0, Math.min(100, d.pv / Math.max(1, d.pvMax) * 100)), i = s.combattants.indexOf(c);
    var cls = (c.type === 'pj' ? 'pj' : (c.allie ? 'allie' : 'ennemi')) + (i === s.tour ? ' actif' : '') + (d.pv <= 0 ? ' ko' : '') +
      (c.moral ? ' fuit' : '') + (ui.sel === c.id ? ' sel' : '') + (vis[c.id] ? ' ' + vis[c.id] : '');
    var etats = (c.etats || []).map(function (e) { var x = (COF.RULES.etats || []).filter(function (y) { return y.id === e; })[0]; return x ? x.nom : e; });
    return '<button class="cb-ent ' + cls + '" data-cb="ent" data-id="' + c.id + '">' +
      '<span class="nm">' + (i === s.tour ? '▶ ' : '') + esc(c.nom) + '</span>' +
      '<span class="pvb"><i style="width:' + pct + '%"></i></span>' +
      '<small>' + (d.pv <= 0 ? 'à terre' : (c.moral === 'reddition' ? 'se rend' : d.pv + '/' + d.pvMax + ' PV')) +
      (etats.length ? ' · ' + esc(etats.join(', ').toLowerCase()) : '') + (vis[c.id] === 'charge' ? ' · charger' : (vis[c.id] === 'loin' ? ' · hors de portée' : '')) + '</small></button>';
  }
  function htmlSituation() {
    var cb = actif(), opt = ui.mode === 'cible' && ui.choix ? appliquerArme(cb, ui.choix) : null, vis = {};
    if (opt) cibles(cb, opt).forEach(function (v) { vis[v.cb.id] = v.ok ? 'vise' : (v.charge ? 'charge' : 'loin'); });
    var groupe = s.combattants.filter(function (c) { return camp(c) === 'heros'; });
    var adv = s.combattants.filter(function (c) { return camp(c) === 'monstres'; });
    var actifs = adv.filter(function (c) { return !c.horsDeVue && donnees(c).pv > 0 && c.moral !== 'reddition'; });
    var hors = adv.filter(function (c) { return actifs.indexOf(c) < 0; });
    var h = '<div class="cb-sit"><div class="cb-zone groupe"><div class="zt">🛡️ Votre groupe</div><div class="zl">' +
      groupe.map(function (c) { return jeton(c, vis); }).join('') + '</div></div>';
    A().ZONES.forEach(function (z) {
      var l = actifs.filter(function (c) { return (c.zone || 0) === z.id; });
      if (!l.length) return;
      h += '<div class="cb-zone z' + z.id + '"><div class="zt">' + z.ic + ' ' + z.nom + (z.note ? ' <small>' + z.note + '</small>' : '') + '</div>' +
        '<div class="zl">' + l.map(function (c) { return jeton(c, vis); }).join('') + '</div></div>';
    });
    if (hors.length) h += '<div class="cb-hors">Hors de combat : ' + hors.map(function (c) {
      return '<a href="#" data-cb="ent" data-id="' + c.id + '">' + esc(c.nom) + '</a> <small>(' + (donnees(c).pv <= 0 ? 'à terre' : (c.moral === 'reddition' ? 'rendu' : 'enfui')) + ')</small>';
    }).join(', ') + '</div>';
    /* qui joue ensuite */
    var suite = [];
    for (var k = 1; k < s.combattants.length && suite.length < 4; k++) {
      var x = s.combattants[(s.tour + k) % s.combattants.length];
      if (debout(x) && !x.horsDeVue) suite.push(x.nom);
    }
    if (suite.length) h += '<div class="cb-suite">Ensuite : ' + esc(suite.join(' → ')) + '</div>';
    return h + '</div>';
  }
  function htmlJournal() {
    var l = (s.log || []), dern = ui.journal ? l.slice(-40) : l.slice(-4);
    if (!l.length) return '';
    return '<div class="cb-recit' + (ui.journal ? ' ouvert' : '') + '" data-cb="journal">' + dern.map(function (x) {
      if (typeof x === 'string') return '<p>' + esc(x) + '</p>';
      return '<p>' + esc(x.r) + (x.m ? '<small>' + esc(x.m) + '</small>' : '') + '</p>';
    }).join('') + '<span class="plus">' + (ui.journal ? '▲ réduire' : (l.length > 4 ? '▼ tout le récit (' + l.length + ')' : '')) + '</span></div>';
  }

  /* ---------- Panneau d'action ---------- */
  function htmlPanneau() {
    var cb = actif(); if (!cb) return '';
    if (ui.sel && ui.mode === 'menu' && ui.sel !== cb.id) return htmlFicheRapide(trouver(ui.sel));
    if (!campDebout('monstres') || !campDebout('heros')) {
      var bl = bilan(), pjs = s.combattants.filter(function (c) { return c.type === 'pj' && donnees(c).vivant; });
      return '<div class="cb-fin">' + (!campDebout('monstres') ? '🏆 Plus aucun adversaire debout.' : '💀 Le héros et ses alliés sont à terre.') + '</div>' +
        '<div class="cb-bilan"><div class="recit">' + esc(bl.recit) + '</div>' + bl.lignes.map(function (l) { return '<div>' + esc(l) + '</div>'; }).join('') + '</div>' +
        (pjs.length ? '<div class="cn-grille" style="margin:8px 0">' + pjs.map(function (c) {
          var p = COF.Store.get(c.refId);
          return '<button data-cb="recup" data-id="' + c.id + '"' + ((p && p.dr > 0 && p.pv < COF.Calc.pvMax(p)) ? '' : ' disabled') + '>⏸️ Récup. rapide<small>' + esc(c.nom) + ' · ' + (p ? p.dr : 0) + ' DR</small></button>';
        }).join('') + '</div>' : '') +
        (combatAventure() ? '<button class="btn btn-plein btn-bloc" data-cn="fin-combat">🏁 Terminer et noter le bilan</button>' : '<button class="btn btn-bloc" data-cb="vider">🧹 Nouveau combat</button>');
    }
    if (ui.mode === 'resultat') return htmlResultat();
    if (ui.mode === 'cible') return htmlChoixCible(cb);
    if (ui.mode === 'liste') return htmlListeOptions(cb, ui.cat);
    if (ui.mode === 'deplacer') return htmlDeplacer(cb);
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
    var opts = options(cb), nA = opts.filter(function (o) { return o.cat === 'attaque'; }).length;
    var nS = opts.filter(function (o) { return filtreCat(o, 'pouvoirs'); }).length, nH = opts.filter(function (o) { return filtreCat(o, 'soins'); }).length, e = eco();
    h = h.replace('</span></div>', ' · <a href="#" data-cb="etats" data-id="' + cb.id + '">🌀 États' + ((cb.etats || []).length ? ' (' + cb.etats.length + ')' : '') + '</a></span></div>');
    h += '<div class="cb-actions">' +
      btnAct('attaque', '⚔️', 'Attaquer', nA, peut('A')) +
      btnAct('pouvoirs', '✨', cb.type === 'pj' ? 'Sorts & capacités' : 'Capacités', nS, nS && (peut('A') || peut('L') || peut('M'))) +
      btnAct('manoeuvres', '🤼', 'Manœuvre', MANOEUVRES.length, peut('A') || peut('M')) +
      '<button data-cb="deplacer"' + (peut('M') && !ea.pasDeMouv ? '' : ' disabled') + '><span class="ic">👣</span><span>Se déplacer</span><small>' + (e.m ? 'mouvement' : (e.a ? 'à la place de l’attaque' : '—')) + '</small></button>' +
      btnAct('soins', '🧪', 'Soins & objets', nH, nH && peut('A')) +
      '<button data-cb="fin-tour" class="fin"><span class="ic">⏭️</span><span>Fin du tour</span><small>' + (s.creaturesAuto !== false ? 'puis l’app joue' : '') + '</small></button>' +
      '</div>';
    if (cb.manuel) h += '<button class="btn btn-sm btn-bloc" style="margin-top:6px" data-cb="rendre-ia">🤖 Rendre la main à l’app</button>';
    return h;
  }
  /* 👣 Se déplacer : s'approcher d'un adversaire ou rompre le contact. */
  function htmlDeplacer(cb) {
    var adv = s.combattants.filter(function (c) { return camp(c) !== camp(cb) && debout(c) && !c.horsDeVue; });
    var h = '<div class="cb-consigne">👣 Une action de mouvement : on passe d’une distance à la voisine.</div><div class="cb-options">';
    adv.forEach(function (c) {
      var z = A().zoneEntre(cb, c); if (z <= 0) return;
      h += '<button data-cb="bouger" data-v="approche" data-id="' + c.id + '"><span class="ic">🏃</span><span class="tx"><b>S’approcher ' + esc(COF.Narration.de(c.nom)) + '</b><small>' +
        esc(A().ZONES[z].nom) + ' → ' + esc(nomZone(z - 1)) + '</small></span><span class="act act-M">M</span></button>';
    });
    if (adv.some(function (c) { return A().zoneEntre(cb, c) < 3; })) {
      h += '<button data-cb="bouger" data-v="recule"><span class="ic">↩️</span><span class="tx"><b>Reculer, rompre le contact</b><small>tous les adversaires s’éloignent d’un cran</small></span><span class="act act-M">M</span></button>';
    }
    return h + '</div><button class="btn btn-bloc" style="margin-top:6px" data-cb="retour">↩ Retour</button>';
  }
  function btnAct(cat, ic, nom, nb, dispo) {
    return '<button data-cb="liste" data-v="' + cat + '"' + (dispo ? '' : ' disabled') + '><span class="ic">' + ic + '</span><span>' + nom + '</span><small>' + (nb || 'aucun') + '</small></button>';
  }
  function filtreCat(o, cat) {
    if (cat === 'attaque') return o.cat === 'attaque';
    if (cat === 'manoeuvres') return o.cat === 'manoeuvre';
    if (cat === 'soins') return o.cat === 'objet' || (o.soin && o.cat !== 'objet');
    return o.cat !== 'attaque' && o.cat !== 'objet' && o.cat !== 'manoeuvre' && !o.soin;
  }
  function htmlListeOptions(cb, cat) {
    var opts = options(cb).filter(function (o) { return filtreCat(o, cat); });
    var h = '<div class="cb-consigne">' + { attaque: '⚔️ Choisissez une attaque', pouvoirs: '✨ Choisissez un sort ou une capacité',
      soins: '🧪 Soins, potions et objets', manoeuvres: '🤼 Choisissez une manœuvre (test opposé au contact)' }[cat] + '</div>';
    if (cat === 'attaque' || cat === 'pouvoirs') h += htmlAjuster(cb);
    if (cat === 'attaque' || cat === 'manoeuvres') h += htmlModifs(false);
    if (cat === 'soins' && !opts.length) h += '<div class="note">Aucun soin ni objet utilisable (potions, élixirs, onguents… de l’inventaire).</div>';
    h += '<div class="cb-options">' + opts.map(function (o) {
      var ok = peut(o.action) && !o.indispo;
      return '<button data-cb="choisir" data-v="' + esc(o.id) + '"' + (ok ? '' : ' disabled') + '>' +
        '<span class="ic">' + o.ic + '</span><span class="tx"><b>' + esc(o.nom) + '</b><small>' +
        (o.cat === 'manoeuvre' ? esc(o.note) : o.cat === 'objet' ? (o.soin ? 'rend ' + esc(o.dmg) + ' PV' : esc((o.note || 'effet').slice(0, 90))) :
        (o.rider ? 'ajoute ' + esc(o.rider) + ' aux DM d’une arme' :
        (o.soin ? 'soin ' + esc(o.dmg || '') : (o.auto ? (o.dmg ? 'touche auto · ' : '') : 'att. ' + sgn(o.mod) + ' · ') + (o.dmg && !o.soin ? 'DM ' + esc(o.dmg) : (o.dmg ? '' : 'effet')))) +
        (o.indispo ? ' · se recharge' : '') +
        (o.rider ? '' : (o.portee ? ' · ' + o.portee + ' m' : (o.soin ? '' : ' · contact'))) + (o.cout ? ' · ' + o.cout + ' PM' : '')) +
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
            '<b>' + (on ? '☑' : '☐') + ' ' + sgn(b.val) + ' ' + ({ att: 'attaque', dm: 'DM', def: 'DEF', init: 'Initiative' }[b.type]) +
            (b.type === 'att' || b.type === 'dm' ? (b.scope === 'C' ? ' au contact' : b.scope === 'D' ? ' à distance' : b.scope === 'M' ? ' magique' : '') : '') +
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
    var h = '<div class="cb-consigne">' + opt.ic + ' <b>' + esc(opt.nom) + '</b> — choisissez ' + (opt.soin ? 'un allié' : 'une cible') + '</div>';
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
      var tirContact = opt.cat === 'attaque' && opt.portee && v.z === 0 && cb.type === 'pj';
      return '<button data-cb="cibler" data-id="' + v.cb.id + '" class="' + (v.ok ? '' : (v.charge ? 'charge' : 'loin')) + '"><b>' + (v.charge ? '🏃 Charger ' : '') + esc(d.nom) + '</b><small>' +
        (camp(v.cb) === camp(cb) ? 'votre groupe' : nomZone(v.z)) + (opt.soin ? '' : ' · DEF ' + (d.def + effetsEtats(v.cb).def)) + ' · ' + d.pv + '/' + d.pvMax + ' PV' +
        (v.ok ? (tirContact ? ' · tir au contact : dé malus' : '') : (v.charge ? ' · on s’approche puis on frappe (mouvement + attaque)' : ' · hors de portée')) + '</small></button>';
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
    if (r.opt && r.opt.cat === 'objet') titre = '🧪 ' + esc(r.opt.nom.replace(/ ×\d+$/, ''));
    var h = (r.recit ? '<div class="cb-res-recit">' + esc(r.recit) + '</div>' : '') + '<div class="cb-resultat ' + cls + '">';
    if (r.multi) {
      /* plusieurs attaques : une ligne par attaque, la dernière en détail */
      h += '<div class="pv" style="margin-bottom:4px">' + r.multi.slice(0, -1).map(function (x, i) {
        return 'Attaque ' + (i + 1) + ' : ' + ({ critique: 'critique', touche: 'touché', rate: 'raté', fumble: 'échec critique' }[x.verdict] || x.verdict) +
          (x.dm ? ' (' + x.dm.total + ' DM)' : '') + ' → ' + esc(x.cible);
      }).join('<br>') + '</div><div class="pv">Attaque ' + r.multi.length + ' :</div>';
    }
    if (r.manoeuvre && r.verdict !== 'effet') titre = r.verdict === 'touche' ? '✅ ' + esc(r.opt.nom) + ' réussi' : '❌ ' + esc(r.opt.nom) + ' raté';
    h += '<div class="v">' + titre + '</div>' + htmlDes(r);
    if (r.oppose) {
      h += '<div class="cb-des"><span class="de garde">' + r.oppose.a.garde + '</span><span class="op">' + sgn(r.oppose.a.mod) + ' = <b>' + r.oppose.a.total + '</b></span>' +
        '<span class="op">contre</span><span class="de">' + r.oppose.d.garde + '</span><span class="op">' + sgn(r.oppose.d.mod) + ' = <b>' + r.oppose.d.total + '</b> (' + esc(r.cible) + ')</span></div>';
    }
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
    var d = donnees(c), ea = effetsEtats(c), cb = actif();
    var zones = camp(c) === 'monstres' ? '<div class="cb-zones">' + A().ZONES.map(function (z) {
      return '<button data-cb="zone" data-id="' + c.id + '" data-v="' + z.id + '" class="' + ((c.zone || 0) === z.id ? 'on' : '') + '">' + z.ic + ' ' + esc(z.nom) + '</button>';
    }).join('') + '</div>' : '';
    return '<div class="cb-qui"><b>' + esc(d.nom) + '</b><span>DEF ' + (d.def + ea.def) + ' · Init. ' + d.init + (camp(c) === 'monstres' ? ' · ' + nomZone(c.zone || 0) : '') + '</span></div>' + zones +
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
      case 'ent': {
        if (ui.mode === 'cible') { var cc = trouver(id); if (cc) return cibler(cc); }
        ui.sel = ui.sel === id ? null : id; ui.mode = 'menu'; break;
      }
      case 'bouger': {
        if (!cb || !peut('M')) return;
        memoriser();
        var N = COF.Narration;
        if (v === 'approche') {
          var tb = trouver(id); if (!tb) return;
          A().approcher(s, cb, tb, 1);
          log(N.mouvement(A().zoneEntre(cb, tb) === 0 ? 'engage' : 'approche', cb.nom, tb.nom), 'mouvement : ' + nomZone(A().zoneEntre(cb, tb)));
        } else {
          s.combattants.forEach(function (x) { if (camp(x) !== camp(cb) && debout(x) && !x.horsDeVue) A().eloigner(s, cb, x, 1); });
          log(N.mouvement('recule', cb.nom), 'mouvement : les adversaires s’éloignent d’un cran');
        }
        depenser('M'); ui.mode = 'menu'; A().ecrire(s); break;
      }
      case 'zone': { var cz = trouver(id); if (cz) { cz.zone = +v; A().ecrire(s); } break; }
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
      case 'recup': { var cr = trouver(id); if (cr) { var rr = recupRapide(cr); A().ecrire(s); if (rr) toastCb(rr); } break; }
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
    var memo = false;
    if (v && !v.ok && v.charge) {
      /* Charge : on s'approche (mouvement), puis on frappe (attaque). */
      memoriser(); memo = true;
      A().approcher(s, cb, t, 1); depenser('M');
      log(COF.Narration.mouvement('charge', cb.nom, donnees(t).nom), 'mouvement : au contact');
    } else if (v && !v.ok && !confirm(donnees(t).nom + ' est hors de portée (' + nomZone(v.z) + '). Attaquer quand même ?')) return;
    ui.resultat = resoudre(cb, opt, t, memo);
    ui.mode = 'resultat'; ui.sel = null;
    A().ecrire(s);
    rafraichir();
  }
  function toastCb(m) {
    var t = document.createElement('div'); t.className = 'cn-toast'; t.textContent = m;
    document.body.appendChild(t); setTimeout(function () { t.classList.add('out'); }, 1500); setTimeout(function () { t.remove(); }, 2000);
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

  return { init: init, rendre: rendre, verserJournal: function () { if (s) verserJournal(); },
    bilan: function (issue) { s = A().lire(); return bilan(issue); } };
})();
