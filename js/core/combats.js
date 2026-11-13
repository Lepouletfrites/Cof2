/* ============================================================
   COF2 Compagnon — Combats racontés et leurs suites (mode aventure)
   Après un combat dans l'Arène, quelques lignes de récit remplacent le
   simple bilan : l'entrée en matière, le coup décisif, la blessure
   reçue, la réplique d'un compagnon. Et le combat laisse des traces :
   un trophée, un prisonnier qui parle, un ennemi en fuite qui
   reviendra se venger, une cicatrice.
   ============================================================ */
window.COF = window.COF || {};

COF.Combats = (function () {
  function p(l) { return l[Math.floor(Math.random() * l.length)]; }
  function d(n) { return 1 + Math.floor(Math.random() * n); }
  function T() { return COF.Conteur; }
  function K() { return COF.Carnet; }
  function L() { return COF.Legende; }
  function sansNum(n) { return String(n || '').replace(/\s*\d+$/, '').trim(); }
  function uniques(l) { var v = {}; return (l || []).map(sansNum).filter(function (n) { if (!n || v[n]) return false; v[n] = 1; return true; }); }
  function liste(l) { return l.length <= 1 ? (l[0] || '') : l.slice(0, -1).join(', ') + ' et ' + l[l.length - 1]; }

  var OUVERTURE = {
    nuit: ['Dans l’obscurité, les silhouettes surgissent sans prévenir.', 'À la lueur incertaine de la nuit, les lames brillent avant les visages.'],
    souterrain: ['Sous la voûte, le fracas des armes résonne longtemps.', 'Dans l’étroit boyau, impossible de reculer : il faut se battre.'],
    foret: ['Les branches craquent : l’ennemi charge entre les troncs.', 'Entre les arbres, l’affrontement éclate dans un tourbillon de feuilles.'],
    montagne: ['Sur le sentier étroit, chaque pas de travers peut être le dernier.', 'Les cailloux roulent sous les bottes : le combat s’engage sur la pente.'],
    urbain: ['Les passants s’égaillent en criant : le combat éclate au milieu de la rue.', 'Dans la ruelle, l’affrontement est brutal et sans témoin.'],
    defaut: ['Le premier coup part, et plus rien d’autre ne compte.', 'Un cri, un éclair d’acier : le combat commence.', '{h} n’a que le temps de dégainer.']
  };
  function ouverture(c, ctx) {
    var co = c.conteur || {}, env = ctx.env;
    var cle = co.heure === 3 && env !== 'souterrain' ? 'nuit' : (OUVERTURE[env] ? env : (env === 'ruines' || env === 'donjon' ? 'souterrain' : 'defaut'));
    return T().dire(OUVERTURE[cle].concat(OUVERTURE.defaut), ctx);
  }

  /* Le récit du combat : quelques phrases à partir du bilan de l'Arène. */
  function raconter(c, issue, info) {
    info = info || {};
    var ctx = T().contexte(c, K().sceneCourante(c)), h = ctx.h, t = [];
    var adv = uniques(info.adv), mb = info.meilleur;
    t.push(ouverture(c, ctx));
    if (adv.length) t.push(p(['Face à {h} : ' + liste(adv) + '.', liste(adv).charAt(0).toUpperCase() + liste(adv).slice(1) + ' ne laisse' + (adv.length > 1 ? 'nt' : '') + ' aucune échappatoire.']));
    if (info.rounds >= 6) t.push(p(['L’échange s’éternise ; les bras s’alourdissent, le souffle manque.', 'Le combat dure, interminable, chacun guettant la faute de l’autre.']));
    else if (info.rounds && info.rounds <= 2) t.push(p(['Tout se joue en quelques battements de cœur.', 'C’est fini presque avant d’avoir commencé.']));
    if (mb && mb.par && mb.sur) {
      t.push(mb.crit ? p(['{par} trouve la faille : ' + (mb.arme ? 'son arme (' + mb.arme + ') ' : 'son coup ') + 'frappe {sur} de plein fouet.', 'Le coup de {par} part au moment parfait, et {sur} vacille sous le choc.'])
        : p(['{par} porte le coup le plus rude du combat à {sur}.', '{sur} encaisse de plein fouet une attaque de {par}.']));
      t[t.length - 1] = t[t.length - 1].replace(/\{par\}/g, sansNum(mb.par)).replace(/\{sur\}/g, sansNum(mb.sur));
    }
    if (info.subi && info.pvMax && info.subi >= info.pvMax * 0.5) t.push(p(['{h} encaisse des coups terribles, et le sang coule.', 'Une lame mord {h} au flanc ; la douleur est fulgurante.', 'Un coup jette {h} à terre ; il faut une volonté de fer pour se relever.']));
    else if (info.subi > 0) t.push(p(['Quelques estafilades, rien de grave.', '{h} s’en tire avec des bleus et une coupure.']));
    if (issue === 'victoire') {
      if (info.rendus && info.rendus.length) t.push(p(['À bout de forces, ' + liste(uniques(info.rendus)) + ' jette' + (info.rendus.length > 1 ? 'nt' : '') + ' les armes et implore pitié.']));
      if (info.fuis && info.fuis.length) t.push(p([liste(uniques(info.fuis)) + ' prend la fuite en hurlant une promesse de vengeance.', 'Dans la confusion, ' + liste(uniques(info.fuis)) + ' s’échappe. On n’a sans doute pas fini d’en entendre parler.']));
      t.push(p(['Le silence retombe. {h} reste debout.', 'Le dernier adversaire tombe ; {h} baisse enfin son arme.', 'C’est terminé. Le cœur de {h} bat encore à tout rompre.']));
    } else if (issue === 'fuite') t.push(p(['Il faut savoir reconnaître une bataille perdue : {h} rompt le combat et file.', '{h} profite d’une ouverture pour s’enfuir, le souffle court.']));
    else t.push(p(['Le monde vacille. {h} s’effondre, et tout devient noir.', 'Un dernier coup, et les jambes de {h} se dérobent.']));
    var rq = COF.Troupe ? COF.Troupe.replique(c, issue === 'victoire' ? 'succes' : 'echec', ctx, 0.6) : '';
    if (rq) t.push(rq);
    return T().dire(t.join(' '), ctx);
  }

  var TROPHEES = ['une dent de {x}, à porter en collier', 'la lame ébréchée de {x}', 'un étendard déchiré pris à {x}', 'une griffe de {x}, montée sur une lanière de cuir',
    'le crâne de {x}, nettoyé et gravé', 'une amulette grossière arrachée au cou de {x}'];
  /* Les suites du combat. r : la rencontre ; info : bilan de l'Arène. Renvoie des notes. */
  function suites(c, issue, info, r) {
    info = info || {}; r = r || {};
    var notes = [], s = K().sceneCourante(c), ctx = T().contexte(c, s), adv = uniques(info.adv);
    var chef = (r.lots || []).filter(function (l) { return l.role === 'chef'; })[0];
    var principal = chef ? chef.nom : (adv[0] || (r.lots && r.lots[0] && r.lots[0].nom) || 'l’ennemi');
    if (issue === 'victoire') {
      if (L()) {
        L().victoire(c, adv.length ? adv : (r.lots || []).map(function (l) { return l.nom; }));
        var h = T().heros(c);
        if (h && h.pv && info.pvMax && h.pv <= Math.max(2, info.pvMax * 0.2) && Math.random() < 0.6) { var ci = L().cicatrice(c, 'combat', principal); if (ci) notes.push(ci); }
      }
      /* un trophée, surtout sur un chef */
      if (Math.random() < (chef ? 0.8 : 0.3)) {
        var tr = p(TROPHEES), tr = L() ? tr.replace(/de \{x\}/, L().de(principal)).replace(/à \{x\}/, 'à ' + principal) : tr;
        tr = tr.replace('{x}', principal);
        if (L()) L().etat(c).trophees.push({ txt: tr, jour: c.jour });
        notes.push('🏆 trophée : ' + tr);
      }
      /* un prisonnier qui parle */
      if (info.rendus && info.rendus.length && COF.Imprevus) {
        var e = COF.Imprevus.appliquer(c, s && s.jeu ? s : { jeu: {} }, s && s.jeu && Math.random() < 0.5 ? ['indice', 'rumeur'] : ['rumeur'], ctx, { v: {} });
        notes.push('🗣️ ' + sansNum(info.rendus[0]) + ', prisonnier, parle pour sauver sa peau' + (e.m ? ' · ' + e.m : ''));
      }
      /* un ennemi en fuite : il reviendra */
      if (info.fuis && info.fuis.length && COF.Echos) {
        var nom = sansNum(info.fuis[0]), ep = p(['le Balafré', 'le Rancunier', 'à l’œil crevé', 'le Boiteux', 'Sans-Oreille']);
        var x = K().ajouterListe(c, 'pnj', { nom: nom.charAt(0).toUpperCase() + nom.slice(1) + ' ' + ep, attitude: 'hostile', note: 'S’est enfui du combat du jour ' + c.jour + ' en jurant de se venger.' });
        var ici = COF.Monde.ici(c); x.lieuId = ici ? ici.id : null; x.jour = c.jour; x.rel = -2;
        COF.Echos.noter(c, 'rancune', { pnjId: x.id });
        notes.push('💢 ' + x.nom + ' a fui : il n’a pas dit son dernier mot');
      }
      /* l'ennemi juré est tombé */
      (c.pnj || []).forEach(function (x) { if (x.nemesis && !x.vaincu && adv.concat([principal]).some(function (n) { return n && x.nom.indexOf(n) === 0; })) { x.vaincu = true; notes.push('☠️ ' + x.nom + ', l’ennemi juré, est vaincu'); } });
    } else if (issue === 'defaite' && L()) {
      var cd = L().cicatrice(c, 'combat', principal); if (cd) notes.push(cd);
    }
    if (L()) L().verifier(c).forEach(function (n) { notes.push(n); });
    return notes;
  }
  return { raconter: raconter, suites: suites };
})();
