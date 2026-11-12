/* ============================================================
   COF2 Compagnon — Compagnons d'aventure (PNJ recrutés)
   Un PNJ du Carnet qui « rejoint le héros » devient un compagnon :
   il apparaît dans la section Compagnons de la fiche et dans l'onglet
   PNJ du Carnet, combat dans l'Arène et peut être joué par l'app.
   Interactions : discuter, offrir un cadeau, soigner, demander un
   service, attaquer, se séparer. Une jauge de loyauté (0-10) évolue
   avec ces échanges ; trop basse, le compagnon peut partir la nuit.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Compagnie = (function () {
  var esc = COF.UI.esc, sgn = COF.UI.sgn;
  function K() { return COF.Carnet; }
  function X() { return COF.Expedition; }
  function d(n) { return 1 + Math.floor(Math.random() * n); }

  /* Aventure liée à un personnage (ou l'aventure active). */
  function campagnePour(p) {
    if (COF.modeDonnees() !== 'aventure') return null;   /* les compagnons du récit n'existent qu'en mode aventure */
    var l = K().tous();
    return (p && l.filter(function (c) { return c.persoId === p.id; })[0]) || K().actif();
  }
  function allies(c) { return c ? X().allies(c) : []; }
  function heros(c) { return (c && c.persoId && COF.Store.get(c.persoId)) || COF.Store.actif(); }
  function etat(x) {
    var cp = x.compagnon, st = X().statsAllie(x);
    if (typeof cp.loyaute !== 'number') cp.loyaute = x.attitude === 'allié' ? 6 : 5;
    if (typeof cp.pv !== 'number') cp.pv = st.pvMax;
    cp.pv = Math.min(cp.pv, st.pvMax);
    return st;
  }

  var SUJETS = [
    'un souvenir d’enfance qui le hante encore', 'ce qu’il pense vraiment du héros', 'une rumeur entendue à la dernière auberge',
    'un rêve étrange fait la nuit dernière', 'ses inquiétudes pour la suite du voyage', 'une ancienne histoire d’amour',
    'la famille qu’il a laissée derrière lui', 'une dette qu’il n’a jamais remboursée', 'un ennemi juré qu’il espère croiser',
    'ce qu’il ferait d’une fortune soudaine', 'une superstition à laquelle il tient', 'un talent caché qu’il dévoile enfin'
  ];
  var SERVICES = [
    'monte la garde : le héros dort sur ses deux oreilles (dé bonus à la prochaine récupération).',
    'part en éclaireur et rapporte la configuration des lieux (dé bonus au prochain test de discrétion ou de perception).',
    'connaît quelqu’un en ville qui pourrait aider.', 'porte une partie du chargement : pas de malus d’encombrement aujourd’hui.',
    'trouve un raccourci : le prochain trajet prend un jour de moins.', 'partage un savoir utile sur la menace en cours.',
    'négocie à la place du héros : −10 % au prochain achat.', 'soigne les bobos du héros : +1d6 PV.'
  ];
  function jauge(n) {
    var h = '';
    for (var i = 1; i <= 10; i++) h += '<span class="' + (i <= n ? 'on' : '') + '"></span>';
    return '<span class="cmp-loy" title="Loyauté ' + n + '/10">' + h + '</span>';
  }
  function libLoyaute(n) { return n >= 9 ? 'dévoué' : n >= 7 ? 'loyal' : n >= 4 ? 'fiable' : n >= 2 ? 'hésitant' : 'sur le départ'; }

  function carteAllie(x) {
    var st = etat(x), cp = x.compagnon, R = X().ROLES[cp.role] || {};
    var pct = Math.max(0, Math.min(100, cp.pv / st.pvMax * 100));
    return '<div class="cmp">' +
      '<div class="cmp-tete"><b>' + esc(x.nom) + '</b><span class="puce">' + (R.ic || '') + ' ' + esc(R.nom || '') + ' niv. ' + st.niveau + '</span></div>' +
      '<div class="note">DEF ' + st.def + ' · Init. ' + st.init + ' · ' + esc(st.att[0].n) + ' ' + sgn(st.att[0].mod) + ' (DM ' + esc(st.att[0].dmg) + ')</div>' +
      '<div class="jauge jauge-pv" style="margin-top:6px"><div class="jauge-tete"><span class="lbl">PV</span>' +
        '<span class="compteur"><button data-cmp="pv" data-v="-1" data-id="' + x.id + '">−</button><span class="n">' + cp.pv + ' / ' + st.pvMax + '</span>' +
        '<button data-cmp="pv" data-v="1" data-id="' + x.id + '">+</button></span></div><div class="barre"><span style="width:' + pct + '%"></span></div></div>' +
      '<div class="cmp-loyl">Loyauté ' + jauge(cp.loyaute) + ' <small>' + libLoyaute(cp.loyaute) + '</small></div>' +
      '<div class="cn-grille cn-g3" style="margin-top:8px">' +
        '<button data-cmp="parler" data-id="' + x.id + '">💬 Discuter</button>' +
        '<button data-cmp="cadeau" data-id="' + x.id + '">🎁 Cadeau<small>' + (5 * st.niveau) + ' pa</small></button>' +
        '<button data-cmp="service" data-id="' + x.id + '">📣 Service</button>' +
        '<button data-cmp="soigner" data-id="' + x.id + '">🩹 Soigner</button>' +
        '<button data-cmp="attaquer" data-id="' + x.id + '">⚔️ Attaque</button>' +
        '<button data-cmp="renvoyer" data-id="' + x.id + '" class="ko">👋 Séparer</button>' +
      '</div></div>';
  }
  /* Bloc pour le Carnet (onglet PNJ) ou la fiche. */
  function html(c) {
    var al = allies(c);
    if (!al.length) return '';
    return '<div class="carte"><h2>🤝 Compagnons d’aventure (' + al.length + ')</h2><div class="carte-corps">' + al.map(carteAllie).join('') + '</div></div>';
  }
  function htmlFiche(p) {
    var c = campagnePour(p);
    if (!c) return '';
    var al = allies(c);
    var h = '<div class="carte pliable' + (al.length ? '' : ' ferme') + '"><h2>Compagnons d’aventure' + (al.length ? ' (' + al.length + ')' : '') + '</h2><div class="carte-corps">';
    if (!al.length) h += '<div class="vide">Aucun PNJ ne voyage avec ' + esc(p.nom) + '. Dans le Carnet (onglet PNJ), ouvrez un personnage et choisissez « Rejoint le héros ».</div>';
    else h += '<div class="note" style="margin-bottom:8px">Aventure : ' + esc(c.titre) + '</div>' + al.map(carteAllie).join('');
    return h + '</div></div>';
  }

  function rafraichir() {
    if (COF.UI.vueActive === 'carnet') COF.UI.Carnet.rendre();
    else if (COF.UI.vueActive === 'fiche' && COF.UI.Fiche) COF.UI.Fiche.rendre();
  }
  function toast(m) {
    var t = document.createElement('div'); t.className = 'cn-toast'; t.textContent = m;
    document.body.appendChild(t); setTimeout(function () { t.classList.add('out'); }, 1800); setTimeout(function () { t.remove(); }, 2300);
  }
  function resultat(titre, texte, ok) {
    COF.UI.ouvrirModale(titre, '<div class="cn-menace' + (ok === false ? '' : ' ok') + '"><div class="s">' + esc(texte) + '</div></div>' +
      '<div class="note" style="margin-top:8px">Noté dans le récit.</div>');
  }

  function action(act, id, v) {
    var c = K().actif() || campagnePour(COF.Store.actif());
    if (!c) return;
    /* l'allié peut appartenir à l'aventure liée au héros de la fiche */
    var x = (c.pnj || []).filter(function (y) { return y.id === id; })[0];
    if (!x) { c = campagnePour(COF.Store.actif()); x = c && (c.pnj || []).filter(function (y) { return y.id === id; })[0]; }
    if (!x) return;
    var st = etat(x), cp = x.compagnon, p = heros(c), txt;
    if (act === 'pv') { cp.pv = Math.max(0, Math.min(st.pvMax, cp.pv + (+v))); K().sauver(c); rafraichir(); return; }
    if (act === 'parler') {
      var bonus = cp.discute !== c.jour && d(6) >= 5;
      cp.discute = c.jour;
      if (bonus) cp.loyaute = Math.min(10, cp.loyaute + 1);
      var sujet = COF.piocher(SUJETS);
      txt = x.nom + ' parle ' + (/^une? /.test(sujet) ? 'd’' : 'de ') + sujet + '.' + (bonus ? ' Ce moment de complicité renforce votre lien (loyauté ' + cp.loyaute + '/10).' : '');
      K().ajouterEntree(c, { t: 'note', titre: 'Discussion avec ' + x.nom, txt: txt });
      K().sauver(c); rafraichir(); resultat('💬 ' + x.nom, txt); return;
    }
    if (act === 'cadeau') {
      var cout = 5 * st.niveau;
      if (!p || !COF.Artisanat.payer(p, cout)) { toast('Pas assez d’argent (' + cout + ' pa)'); return; }
      COF.Store.sauver(p);
      cp.loyaute = Math.min(10, cp.loyaute + 1);
      txt = p.nom + ' offre un présent (' + cout + ' pa) à ' + x.nom + ' : loyauté ' + cp.loyaute + '/10.';
      K().ajouterEntree(c, { t: 'note', titre: 'Cadeau', txt: txt });
      K().sauver(c); rafraichir(); toast('🎁 Loyauté ' + cp.loyaute + '/10'); return;
    }
    if (act === 'soigner') {
      cp.pv = st.pvMax;
      txt = x.nom + ' panse ses blessures (' + st.pvMax + ' PV). À faire pendant un repos.';
      K().ajouterEntree(c, { t: 'note', titre: 'Soins', txt: txt });
      K().sauver(c); rafraichir(); toast('🩹 ' + x.nom + ' : ' + st.pvMax + ' PV'); return;
    }
    if (act === 'service') {
      var cha = p ? COF.Calc.carac(p, 'CHA') : 0, diff = 18 - cp.loyaute, t = COF.Dice.test({ mod: cha, difficulte: diff });
      if (t.reussite) txt = x.nom + ' accepte et ' + COF.piocher(SERVICES);
      else { txt = x.nom + ' refuse poliment' + (t.fumble ? ' et semble vexé (loyauté −1)' : '') + '.'; if (t.fumble) cp.loyaute = Math.max(0, cp.loyaute - 1); }
      txt += ' (CHA : ' + t.total + ' contre ' + diff + ')';
      K().ajouterEntree(c, { t: 'note', titre: 'Service demandé à ' + x.nom, txt: txt });
      K().sauver(c); rafraichir(); resultat('📣 ' + x.nom, txt, !!t.reussite); return;
    }
    if (act === 'attaquer') {
      COF.UI.jet({ titre: x.nom + ' — ' + st.att[0].n, sousTitre: 'Compagnon d’aventure', mod: st.att[0].mod, difficulte: null,
        dmg: st.att[0].dmg, dmgLabel: 'Dommages', ctx: { carac: {}, niveau: st.niveau, deEvo: COF.deEvolutif(st.niveau) }, type: 'attaque' });
      return;
    }
    if (act === 'renvoyer') {
      if (!confirm(x.nom + ' quitte le groupe ? (il reste dans vos PNJ)')) return;
      cp.actif = false;
      K().ajouterEntree(c, { t: 'note', titre: 'Séparation', txt: x.nom + ' quitte le groupe.' });
      K().sauver(c); rafraichir(); return;
    }
  }

  /* Nuit de repos : un compagnon peu loyal peut s'en aller (1 chance sur 3). */
  function nuit(c) {
    var partis = [];
    allies(c).forEach(function (x) {
      etat(x);
      if (x.compagnon.loyaute <= 2 && d(3) === 1) { x.compagnon.actif = false; partis.push(x.nom); }
    });
    return partis;
  }

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-cmp]') : null;
      if (!t) return;
      e.preventDefault();
      action(t.getAttribute('data-cmp'), t.getAttribute('data-id'), t.getAttribute('data-v'));
    });
  }

  return { init: init, html: html, htmlFiche: htmlFiche, nuit: nuit };
})();
