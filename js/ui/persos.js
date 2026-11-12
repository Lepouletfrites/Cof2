/* ============================================================
   COF2 Compagnon — Onglet « Personnages » : liste et création
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Persos = (function () {
  var $ = COF.UI.$, $$ = COF.UI.$$, esc = COF.UI.esc, sgn = COF.UI.sgn;

  function init() {
    $('#btn-nouveau').addEventListener('click', ouvrirCreation);
  }

  function rendre() {
    var list = COF.Store.tous();
    var actif = COF.Store.actifId();
    var n = $('#liste-pj');
    if (!list.length) {
      n.innerHTML = '<div class="vide">Aucun personnage.<br>Créez votre premier héros avec le bouton ci-dessous.</div>';
      return;
    }
    n.innerHTML = list.map(function (p) {
      var pr = COF.PROFILS[p.profil], pe = COF.PEUPLES[p.peuple];
      return '<div class="pj-carte ' + (p.id === actif ? 'actif' : '') + '" data-id="' + p.id + '">' +
        '<div class="pj-av">' + esc((p.nom || '?').charAt(0).toUpperCase()) + '</div>' +
        '<div class="info" style="flex:1;min-width:0">' +
          '<div style="font-size:15px">' + esc(p.nom) + '</div>' +
          '<div style="font-size:11.5px;color:var(--text-mute)">' +
            esc(pe ? pe.nom : '?') + ' · ' + esc(pr ? pr.nom : '?') +
            ' · <span class="tag-niv">niveau ' + p.niveau + '</span></div>' +
        '</div>' +
        '<button class="btn btn-sm" data-suppr="' + p.id + '">✕</button>' +
        '</div>';
    }).join('');

    $$('.pj-carte', n).forEach(function (c) {
      c.addEventListener('click', function (e) {
        if (e.target.hasAttribute('data-suppr')) return;
        COF.Store.setActif(c.getAttribute('data-id'));
        COF.UI.aller('fiche');
      });
    });
    $$('[data-suppr]', n).forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        var id = b.getAttribute('data-suppr');
        var p = COF.Store.get(id);
        if (confirm('Supprimer définitivement « ' + p.nom + ' » ?')) {
          COF.Store.supprimer(id); rendre(); COF.UI.majTitre();
        }
      });
    });
  }

  /* ================= Création guidée (assistant en 6 étapes) =================
     1. Profil (le métier du héros)   2. Peuple   3. Caractéristiques
     4. Voies de départ (2 voies de profil au rang 1 + la voie du peuple)
     5. Identité (nom, genre, idéal, travers, histoire)   6. Récapitulatif
     Chaque étape explique ses choix et met en avant ceux qui vont bien
     ensemble ; tout reste modifiable ensuite sur la fiche. */
  var CARACS = ['FOR', 'AGI', 'CON', 'PER', 'CHA', 'INT', 'VOL'];
  var ETAPES = [['profil', '🎭', 'Profil'], ['peuple', '🧬', 'Peuple'], ['caracs', '💪', 'Caractéristiques'], ['voies', '📜', 'Voies'], ['identite', '✍️', 'Identité'], ['recap', '✅', 'Récapitulatif']];
  var FAM_IC = { aventurier: '🧭', combattant: '⚔️', mage: '🔮', mystique: '✨' };
  var w = null, rootW = null;

  function nouvelEtat() {
    return { etape: 0, profil: null, famille: null, peuple: null, serie: 'expert', ordre: null, choixSel: null, plus: null, moins: null,
      voies: [], voiePeuple: null, nom: '', genre: 'masculin', ideal: '', travers: '', histoire: '' };
  }
  function pr() { return w.profil ? COF.PROFILS[w.profil] : null; }
  function pe() { return w.peuple ? COF.PEUPLES[w.peuple] : null; }
  function textMods(x) {
    if (!x) return '';
    if (x.modsTexte) return x.modsTexte;
    var t = (x.modsFixes || []).map(function (m) { return sgn(m.v) + ' ' + m.c; });
    (x.mods || []).forEach(function (m) { t.push('+1 ' + m.plus.join(' ou ') + (m.moins.length ? ', −1 ' + m.moins.join(' ou ') : '')); });
    return t.join(', ');
  }
  /* Le peuple renforce-t-il une caractéristique clé du profil ? */
  function affinite(peuple, profil) {
    if (!peuple || !profil) return 0;
    var cles = profil.caracs, s = 0;
    (peuple.mods || []).forEach(function (m) { if (m.plus.some(function (c) { return cles.indexOf(c) >= 0; })) s += cles.indexOf(m.plus.filter(function (c) { return cles.indexOf(c) >= 0; })[0]) === 0 ? 2 : 1; });
    (peuple.modsFixes || []).forEach(function (m) { if (m.v > 0 && cles.indexOf(m.c) >= 0) s += 1; if (m.v < 0 && cles[0] === m.c) s -= 2; });
    (peuple.mods || []).forEach(function (m) { if (m.moins.length && m.moins.every(function (c) { return c === cles[0]; })) s -= 2; });
    if (peuple.id === 'humain') s += 1;
    return s;
  }
  /* Ordre d'attribution de la série : caractéristiques clés du profil d'abord. */
  function ordreDefaut() {
    var o = (pr() ? pr().caracs.slice() : []);
    CARACS.forEach(function (c) { if (o.indexOf(c) < 0) o.push(c); });
    return o;
  }
  function serie() { return COF.RULES.series.filter(function (s) { return s.id === w.serie; })[0] || COF.RULES.series[1]; }
  /* Valeurs de base (série) et modificateurs du peuple. */
  function valeurs() {
    var base = {}, mod = {}, vals = serie().vals, ordre = w.ordre || ordreDefaut(), x = pe();
    ordre.forEach(function (c, i) { base[c] = vals[i]; mod[c] = 0; });
    if (x) {
      (x.modsFixes || []).forEach(function (m) { mod[m.c] += m.v; });
      var m0 = x.mods && x.mods[0];
      if (m0 && m0.plus[0] === '*faibles') {
        var faibles = CARACS.slice().sort(function (a, b) { return base[a] - base[b]; }).slice(0, 2);
        var cible = w.plus && faibles.indexOf(w.plus) >= 0 ? w.plus : faibles[0];
        mod[cible] += 1;
      } else if (m0) {
        var plus = w.plus && m0.plus.indexOf(w.plus) >= 0 ? w.plus : (m0.plus.filter(function (c) { return (pr() || { caracs: [] }).caracs.indexOf(c) >= 0; })[0] || m0.plus[0]);
        mod[plus] += 1;
        if (m0.moins.length) {
          var moins = w.moins && m0.moins.indexOf(w.moins) >= 0 ? w.moins : (m0.moins.filter(function (c) { return (pr() || { caracs: [] }).caracs.indexOf(c) < 0; })[0] || m0.moins[0]);
          mod[moins] -= 1;
        }
      }
    }
    return { base: base, mod: mod };
  }
  /* Construit le personnage final (aussi utilisé pour l'aperçu). */
  function construire() {
    var p = COF.Store.nouveau({ nom: w.nom.trim() || 'Héros sans nom', profil: w.profil, peuple: w.peuple });
    if (pr() && pr().familleChoix) p.familleProfil = w.famille || 'aventurier';
    var v = valeurs();
    CARACS.forEach(function (c) { p.carac[c] = v.base[c] + v.mod[c]; });
    COF.Store.equiperDepart(p);
    w.voies.forEach(function (id) { p.voies.push({ key: 'profil.' + id, rang: 1 }); });
    var x = pe();
    if (x && x.voieChoix) { p.peupleVoie = w.voiePeuple || x.voieChoix[0]; p.voies.push({ key: 'peuple.' + p.peupleVoie, rang: 1 }); }
    else if (x && x.voie) p.voies.push({ key: 'peuple.' + x.id, rang: 1 });
    p.genre = w.genre;
    p.description = { ideal: w.ideal, travers: w.travers, histoire: w.histoire };
    COF.Store.reinitialiser(p);
    return p;
  }

  function carte(act, val, on, titre, sous, badge) {
    return '<button class="cw-carte' + (on ? ' on' : '') + '" data-w="' + act + '" data-v="' + esc(val) + '">' +
      '<b>' + titre + (badge ? ' <span class="cw-badge">' + badge + '</span>' : '') + '</b>' + (sous ? '<small>' + sous + '</small>' : '') + '</button>';
  }
  function etapeProfil() {
    var h = '<p class="cw-intro">Quel genre d’aventurier voulez-vous incarner ? Le <b>profil</b> donne au héros ses talents (ses voies), son équipement et sa façon de se battre.</p>' +
      '<button class="btn btn-bloc cw-hasard" data-w="hasard">🎲 Je ne sais pas : tirer un héros au hasard</button>';
    Object.keys(COF.RULES.familles).forEach(function (f) {
      var F = COF.RULES.familles[f];
      var l = Object.keys(COF.PROFILS).filter(function (k) { var x = COF.PROFILS[k]; return x.famille === f && !x.familleChoix; });
      if (!l.length) return;
      h += '<div class="cw-fam"><div class="cw-fam-t">' + (FAM_IC[f] || '') + ' ' + esc(F.nom) + '</div><div class="cw-fam-d">' + esc(F.desc || '') + ' · ' + F.pv + ' PV par niveau</div></div>' +
        '<div class="cw-cartes">' + l.map(function (k) { var x = COF.PROFILS[k]; return carte('profil', k, w.profil === k, esc(x.nom), esc(x.resume) + '<br><i>Clés : ' + x.caracs.join(', ') + '</i>'); }).join('') + '</div>';
    });
    var ch = Object.keys(COF.PROFILS).filter(function (k) { return COF.PROFILS[k].familleChoix; });
    if (ch.length) h += '<div class="cw-fam"><div class="cw-fam-t">🌀 Famille au choix</div></div><div class="cw-cartes">' +
      ch.map(function (k) { var x = COF.PROFILS[k]; return carte('profil', k, w.profil === k, esc(x.nom), esc(x.resume)); }).join('') + '</div>';
    if (pr() && pr().familleChoix) h += '<label class="cw-lbl">Famille de ce profil</label><div class="cw-chips">' + Object.keys(COF.RULES.familles).map(function (f) {
      return '<button class="chip' + ((w.famille || 'aventurier') === f ? ' on' : '') + '" data-w="famille" data-v="' + f + '">' + (FAM_IC[f] || '') + ' ' + esc(COF.RULES.familles[f].nom) + '</button>';
    }).join('') + '</div>';
    return h;
  }
  function etapePeuple() {
    var p0 = pr(), l = Object.keys(COF.PEUPLES).map(function (k) { return { k: k, a: affinite(COF.PEUPLES[k], p0) }; });
    l.sort(function (a, b) { return b.a - a.a || COF.PEUPLES[a.k].nom.localeCompare(COF.PEUPLES[b.k].nom); });
    var h = '<p class="cw-intro">Le <b>peuple</b> modifie un peu les caractéristiques et offre une voie gratuite (rang 1). Les peuples marqués ★ renforcent les caractéristiques clés ' + (p0 ? 'du ' + esc(p0.nom.toLowerCase()) : 'du profil') + ' (' + (p0 ? p0.caracs.join(', ') : '') + ').</p>' +
      '<div class="cw-cartes">' + l.map(function (o) {
        var x = COF.PEUPLES[o.k];
        return carte('peuple', o.k, w.peuple === o.k, esc(x.nom), esc(textMods(x)), o.a >= 2 ? '★ conseillé' : '');
      }).join('') + '</div>';
    var x = pe();
    if (x) {
      h += '<div class="cw-detail"><b>' + esc(x.nom) + '</b> — ' + esc(x.desc || '') + (x.traits ? '<div class="cw-traits">' + esc(x.traits) + '</div>' : '') +
        (x.voie ? '<div class="cw-traits">📜 ' + esc(x.voie.nom) + ' : ' + esc((x.voie.caps.filter(function (c) { return c.r === 1; })[0] || {}).n || '') + ' (offerte)</div>' : '') + '</div>';
      if (x.voieChoix) h += '<label class="cw-lbl">Voie de peuple</label><div class="cw-chips">' + x.voieChoix.map(function (v) {
        var vp = COF.PEUPLES[v]; return '<button class="chip' + ((w.voiePeuple || x.voieChoix[0]) === v ? ' on' : '') + '" data-w="voiePeuple" data-v="' + v + '">' + esc(vp && vp.voie ? vp.voie.nom : v) + '</button>';
      }).join('') + '</div>';
    }
    return h;
  }
  function etapeCaracs() {
    var v = valeurs(), x = pe(), p0 = pr(), ordre = w.ordre || ordreDefaut();
    var h = '<p class="cw-intro">Choisissez une <b>série</b> de valeurs. Elles sont placées d’office sur les caractéristiques clés du profil. <b>Touchez deux caractéristiques</b> pour échanger leurs valeurs.</p>' +
      '<div class="cw-cartes cw-3">' + COF.RULES.series.map(function (s) {
        var desc = { polyvalent: 'Bon partout, sans point faible marqué.', expert: 'Un vrai point fort, et de bonnes bases.', specialiste: 'Excellent dans un domaine, fragile ailleurs.' }[s.id] || '';
        return carte('serie', s.id, w.serie === s.id, esc(s.nom), s.vals.map(sgn).join(' ') + '<br>' + desc);
      }).join('') + '</div>';
    h += '<div class="cw-caracs">' + CARACS.map(function (c) {
      var cle = p0 && p0.caracs.indexOf(c) >= 0, tot = v.base[c] + v.mod[c], def = (COF.RULES.caracs.filter(function (k) { return k.id === c; })[0] || {}).desc || '';
      return '<button class="cw-carac' + (w.choixSel === c ? ' sel' : '') + (cle ? ' cle' : '') + '" data-w="swap" data-v="' + c + '"><span class="k">' + c + (cle ? ' ★' : '') + '</span>' +
        '<span class="v">' + sgn(tot) + '</span><small>' + sgn(v.base[c]) + (v.mod[c] ? ' ' + sgn(v.mod[c]) + ' peuple' : '') + '</small><em>' + esc(def.split('.')[0]) + '</em></button>';
    }).join('') + '</div>';
    if (x && x.mods && x.mods[0]) {
      var m0 = x.mods[0];
      var plusL = m0.plus[0] === '*faibles' ? CARACS.slice().sort(function (a, b) { return v.base[a] - v.base[b]; }).slice(0, 2) : m0.plus;
      if (plusL.length > 1) h += '<label class="cw-lbl">Bonus du peuple (+1)</label><div class="cw-chips">' + plusL.map(function (c) {
        return '<button class="chip' + (v.mod[c] > 0 && !(x.modsFixes || []).some(function (f) { return f.c === c && f.v > 0; }) ? ' on' : '') + '" data-w="plus" data-v="' + c + '">+1 ' + c + '</button>';
      }).join('') + '</div>';
      if (m0.moins.length > 1) h += '<label class="cw-lbl">Malus du peuple (−1)</label><div class="cw-chips">' + m0.moins.map(function (c) {
        return '<button class="chip' + (v.mod[c] < 0 ? ' on' : '') + '" data-w="moins" data-v="' + c + '">−1 ' + c + '</button>';
      }).join('') + '</div>';
    }
    void ordre;
    return h;
  }
  function etapeVoies() {
    var p0 = pr(); if (!p0) return '';
    var h = '<p class="cw-intro">Au niveau 1, le héros débute avec <b>deux voies de son profil au rang 1</b> (plus la voie de son peuple, offerte). Choisissez les deux qui lui ressemblent : vous pourrez prendre les autres en montant de niveau.</p>' +
      '<div class="cw-cartes">' + p0.voies.map(function (v) {
        var c1 = v.caps.filter(function (c) { return c.r === 1; })[0] || {};
        var sel = w.voies.indexOf(v.id) >= 0;
        return carte('voie', v.id, sel, esc(v.nom), '<b>Rang 1 — ' + esc(c1.n || '') + '</b> : ' + esc(c1.d || ''), sel ? '✓' : '');
      }).join('') + '</div><div class="note">' + w.voies.length + ' / 2 voies choisies.</div>';
    return h;
  }
  function etapeIdentite() {
    var h = '<p class="cw-intro">Donnez vie au héros. Seul le nom compte vraiment ; le reste aide à l’interpréter (et le récit du mode aventure s’en sert).</p>' +
      '<div class="champ"><label>Nom</label><div class="cn-ajout"><input id="cw-nom" value="' + esc(w.nom) + '" placeholder="Lhagva, fille de Nuala"><button class="btn" data-w="nom-hasard" aria-label="Proposer un nom">🎲</button></div></div>' +
      '<label class="cw-lbl">Le récit en parle au…</label><div class="cw-chips"><button class="chip' + (w.genre === 'masculin' ? ' on' : '') + '" data-w="genre" data-v="masculin">Masculin (il)</button>' +
      '<button class="chip' + (w.genre === 'féminin' ? ' on' : '') + '" data-w="genre" data-v="féminin">Féminin (elle)</button></div>' +
      '<label class="cw-lbl">Idéal <small>(ce qui le fait avancer)</small></label><div class="cw-chips">' + echant(COF.PNJ_IDEAUX || [], 'ideal') + '</div>' +
      '<label class="cw-lbl">Travers <small>(son défaut)</small></label><div class="cw-chips">' + echant(COF.PNJ_TRAVERS || [], 'travers') + '</div>' +
      '<div class="champ" style="margin-top:10px"><label>Histoire (facultatif)</label><textarea id="cw-histoire" rows="3" placeholder="D’où vient-il ? Pourquoi part-il à l’aventure ?">' + esc(w.histoire) + '</textarea></div>';
    return h;
  }
  /* 8 suggestions (stables pendant l'assistant) + la valeur choisie. */
  function echant(l, k) {
    w['_' + k] = w['_' + k] || l.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 8);
    var s = w['_' + k].slice(); if (w[k] && s.indexOf(w[k]) < 0) s.unshift(w[k]);
    return s.map(function (x) { return '<button class="chip' + (w[k] === x ? ' on' : '') + '" data-w="' + k + '" data-v="' + esc(x) + '">' + esc(x) + '</button>'; }).join('') +
      '<button class="chip" data-w="reroll" data-v="' + k + '">🎲</button>';
  }
  function etapeRecap() {
    var p = construire(), K2 = COF.Calc, F = K2.famille(p) || {};
    var num = function (x) { return typeof x === 'number' ? x : (x && typeof x.total === 'number' ? x.total : (x && typeof x.val === 'number' ? x.val : '?')); };
    var att = []; try { att = K2.attaques(p) || []; } catch (e) {}
    var h = '<div class="cw-recap"><div class="cw-recap-t">' + esc(p.nom) + '</div><div class="cw-recap-s">' + esc((pe() || {}).nom || '') + ' · ' + esc((pr() || {}).nom || '') + ' · niveau 1 · ' + esc(F.nom || '') + '</div>' +
      '<div class="cw-stats"><span>❤️ <b>' + K2.pvMax(p) + '</b> PV</span><span>🛡️ DEF <b>' + num(K2.def(p)) + '</b></span><span>⚡ Init. <b>' + num(K2.init(p)) + '</b></span><span>🎲 DR d' + K2.drType(p) + '</span>' +
      (K2.pmMax(p) ? '<span>🔮 <b>' + K2.pmMax(p) + '</b> PM</span>' : '') + '</div>' +
      '<div class="cw-caracs-mini">' + CARACS.map(function (c) { return '<span><small>' + c + '</small><b>' + sgn(p.carac[c]) + '</b></span>'; }).join('') + '</div>' +
      '<div class="cw-ligne">📜 ' + p.voies.map(function (v) { var d = K2.voieDef(p, v.key); return esc(d ? d.nom : v.key); }).join(' · ') + '</div>' +
      '<div class="cw-ligne">⚔️ ' + (p.armes.map(function (a) { return esc(a.nom); }).join(', ') || '—') + (p.armure && p.armure !== 'aucune' ? ' · armure : ' + esc(((K2.armure && K2.armure(p)) || {}).nom || p.armure) : '') + '</div>' +
      (w.ideal || w.travers ? '<div class="cw-ligne">🧭 ' + esc([w.ideal, w.travers].filter(Boolean).join(' · ')) + '</div>' : '') +
      (att.length ? '' : '') + '</div>' +
      '<p class="cw-intro">Tout reste modifiable sur la fiche (équipement, caractéristiques, voies…).</p>';
    return h;
  }
  /* Ce qui manque pour passer à l'étape suivante. */
  function manque() {
    var id = ETAPES[w.etape][0];
    if (id === 'profil' && !w.profil) return 'Choisissez un profil.';
    if (id === 'peuple' && !w.peuple) return 'Choisissez un peuple.';
    if (id === 'voies' && w.voies.length !== 2) return 'Choisissez deux voies.';
    return null;
  }
  function rendreW() {
    if (!rootW) return;
    var c = rootW.querySelector('#cw'); if (!c) return;
    var id = ETAPES[w.etape][0];
    var corps = { profil: etapeProfil, peuple: etapePeuple, caracs: etapeCaracs, voies: etapeVoies, identite: etapeIdentite, recap: etapeRecap }[id]();
    var m = manque();
    c.innerHTML = '<div class="cw-etapes">' + ETAPES.map(function (e, i) {
      return '<button class="' + (i === w.etape ? 'on' : (i < w.etape ? 'fait' : '')) + '" data-w="aller" data-v="' + i + '"' + (i > w.etape ? ' disabled' : '') + '><span>' + e[1] + '</span><small>' + e[2] + '</small></button>';
    }).join('') + '</div>' +
      '<div class="cw-titre">' + (w.etape + 1) + '. ' + ETAPES[w.etape][2] + '</div>' +
      '<div class="cw-corps">' + corps + '</div>' +
      '<div class="cw-nav">' + (w.etape > 0 ? '<button class="btn" data-w="prec">◀ Retour</button>' : '<span></span>') +
      (id === 'recap' ? '<button class="btn btn-plein" data-w="creer">✨ Créer le héros</button>'
        : '<button class="btn btn-plein" data-w="suiv"' + (m ? ' disabled title="' + esc(m) + '"' : '') + '>Suivant ▶</button>') + '</div>' +
      (m ? '<div class="cw-manque">' + esc(m) + '</div>' : '');
    var corpsEl = c.querySelector('.cw-corps'); if (corpsEl && rendreW.haut) corpsEl.scrollTop = 0;
    rendreW.haut = false;
  }
  function memo() {
    var n = rootW && rootW.querySelector('#cw-nom'); if (n) w.nom = n.value;
    var hi = rootW && rootW.querySelector('#cw-histoire'); if (hi) w.histoire = hi.value;
  }
  function hasard() {
    var ks = Object.keys(COF.PROFILS).filter(function (k) { return !COF.PROFILS[k].familleChoix; });
    w.profil = ks[Math.floor(Math.random() * ks.length)];
    var peu = Object.keys(COF.PEUPLES).map(function (k) { return { k: k, a: affinite(COF.PEUPLES[k], pr()) }; }).filter(function (o) { return o.a >= 1; });
    if (!peu.length) peu = [{ k: 'humain' }];
    w.peuple = peu[Math.floor(Math.random() * peu.length)].k;
    w.serie = COF.RULES.series[Math.floor(Math.random() * COF.RULES.series.length)].id;
    w.ordre = null; w.plus = null; w.moins = null;
    w.voies = pr().voies.map(function (v) { return v.id; }).sort(function () { return Math.random() - 0.5; }).slice(0, 2);
    w.genre = Math.random() < 0.5 ? 'masculin' : 'féminin';
    w.nom = nomHasard();
    w.ideal = (COF.PNJ_IDEAUX || [''])[Math.floor(Math.random() * (COF.PNJ_IDEAUX || ['']).length)];
    w.travers = (COF.PNJ_TRAVERS || [''])[Math.floor(Math.random() * (COF.PNJ_TRAVERS || ['']).length)];
    w.etape = ETAPES.length - 1;
  }
  function nomHasard() {
    try { var peu = COF.PNJ_NOMS[w.peuple] ? w.peuple : 'humain'; return COF.PnjCalc.genererChamp('nom', { peuple: peu, genre: w.genre }); } catch (e) { return 'Héros sans nom'; }
  }
  function actionW(act, v) {
    memo();
    switch (act) {
      case 'profil': if (w.profil !== v) { w.profil = v; w.voies = []; w.ordre = null; } break;
      case 'famille': w.famille = v; break;
      case 'peuple': if (w.peuple !== v) { w.peuple = v; w.plus = null; w.moins = null; w.voiePeuple = null; } break;
      case 'voiePeuple': w.voiePeuple = v; break;
      case 'serie': w.serie = v; break;
      case 'swap': {
        if (!w.choixSel) { w.choixSel = v; break; }
        if (w.choixSel !== v) { var o = (w.ordre || ordreDefaut()).slice(), i = o.indexOf(w.choixSel), j = o.indexOf(v); o[i] = v; o[j] = w.choixSel; w.ordre = o; }
        w.choixSel = null; break;
      }
      case 'plus': w.plus = v; break;
      case 'moins': w.moins = v; break;
      case 'voie': { var k = w.voies.indexOf(v); if (k >= 0) w.voies.splice(k, 1); else { w.voies.push(v); if (w.voies.length > 2) w.voies.shift(); } break; }
      case 'genre': w.genre = v; break;
      case 'ideal': w.ideal = w.ideal === v ? '' : v; break;
      case 'travers': w.travers = w.travers === v ? '' : v; break;
      case 'reroll': w['_' + v] = null; break;
      case 'nom-hasard': w.nom = nomHasard(); break;
      case 'hasard': hasard(); rendreW.haut = true; break;
      case 'aller': w.etape = Math.min(+v, w.etape); rendreW.haut = true; break;
      case 'prec': w.etape = Math.max(0, w.etape - 1); rendreW.haut = true; break;
      case 'suiv': if (!manque()) { w.etape = Math.min(ETAPES.length - 1, w.etape + 1); rendreW.haut = true; } break;
      case 'creer': {
        var p = construire();
        COF.Store.sauver(p); COF.Store.setActif(p.id);
        COF.UI.fermerModale(); w = null; rootW = null;
        COF.UI.aller('fiche');
        return;
      }
    }
    rendreW();
  }
  function ouvrirCreation() {
    w = nouvelEtat();
    COF.UI.ouvrirModale('✨ Nouveau héros', '<div id="cw" class="cw"></div>', function (root) {
      rootW = root;
      /* écouteur posé sur #cw (recréé à chaque ouverture) : pas d'accumulation */
      root.querySelector('#cw').addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('[data-w]');
        if (!b || b.disabled || !w) return;
        actionW(b.getAttribute('data-w'), b.getAttribute('data-v'));
      });
      rendreW();
    });
  }

  /* Méthode rapide : les 3 meilleures valeurs sur les caractéristiques clés */
  function appliquerSerie(p, serieId) {
    var serie = COF.RULES.series.filter(function (s) { return s.id === serieId; })[0] || COF.RULES.series[1];
    var pr = COF.PROFILS[p.profil];
    var vals = serie.vals.slice();
    var ordre = pr.caracs.slice();
    ['FOR', 'AGI', 'CON', 'PER', 'CHA', 'INT', 'VOL'].forEach(function (c) {
      if (ordre.indexOf(c) < 0) ordre.push(c);
    });
    ordre.forEach(function (c, i) { p.carac[c] = vals[i]; });

    /* modificateur de peuple : première option proposée par défaut */
    var pe = COF.PEUPLES[p.peuple];
    /* Un peuple peut combiner des modificateurs fixes et un choix (frouïn :
       +1 CON, -1 FOR, -1 CHA fixes, puis +1 AGI ou PER). */
    if (pe && pe.modsFixes) {
      pe.modsFixes.forEach(function (m) { p.carac[m.c] += m.v; });
    }
    if (pe && pe.mods && pe.mods[0] && pe.mods[0].plus[0] !== '*faibles') {
      var m = pe.mods[0];
      var plus = m.plus.filter(function (c) { return pr.caracs.indexOf(c) >= 0; })[0] || m.plus[0];
      p.carac[plus] += 1;
      if (m.moins.length) {
        var moins = m.moins.filter(function (c) { return pr.caracs.indexOf(c) < 0; })[0] || m.moins[0];
        p.carac[moins] -= 1;
      }
    } else if (pe && pe.id === 'humain') {
      var faible = ['FOR', 'AGI', 'CON', 'PER', 'CHA', 'INT', 'VOL'].sort(function (a, b) {
        return p.carac[a] - p.carac[b];
      })[0];
      p.carac[faible] += 1;
    }
    return p;
  }

  /* Voie de peuple offerte au rang 1 */
  function ajouterVoiePeuple(p) {
    var pe = COF.PEUPLES[p.peuple];
    if (!pe) return;
    var key = null;
    if (pe.voieChoix) key = 'peuple.' + pe.voieChoix[0];   // demi-elfe : voie de l'humain par défaut
    else if (pe.voie) key = 'peuple.' + pe.id;
    if (key) p.voies.push({ key: key, rang: 1 });
  }

  return { init: init, rendre: rendre, ouvrirCreation: ouvrirCreation };
})();
