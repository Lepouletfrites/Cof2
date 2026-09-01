/* ============================================================
   COF2 Compagnon — Coque de l'application, navigation, lanceur de dés
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

(function () {
  'use strict';

  /* ---------- Utilitaires ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    if (html !== undefined) n.innerHTML = html;
    return n;
  }
  function sgn(n) { return (n >= 0 ? '+' : '') + n; }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function vibre(ms) { if (navigator.vibrate) try { navigator.vibrate(ms); } catch (e) {} }

  COF.UI.$ = $; COF.UI.$$ = $$; COF.UI.el = el; COF.UI.sgn = sgn; COF.UI.esc = esc;

  /* ---------- Navigation par onglets ---------- */
  var VUES = ['persos', 'fiche', 'arene', 'bestiaire', 'generateurs', 'des', 'plus'];

  /* Voies est un sous-onglet de Fiche, pas une vue de premier niveau */
  var sousFiche = 'fiche'; // 'fiche' | 'voies' | 'objets'

  function rendreFicheOnglets() {
    var chipFiche = $('#fonglet-fiche'), chipVoies = $('#fonglet-voies'), chipObjets = $('#fonglet-objets');
    if (chipFiche) chipFiche.classList.toggle('on', sousFiche === 'fiche');
    if (chipVoies) chipVoies.classList.toggle('on', sousFiche === 'voies');
    if (chipObjets) chipObjets.classList.toggle('on', sousFiche === 'objets');
    var corps = $('#vue-fiche-corps'), voies = $('#vue-voies'), objets = $('#vue-objets');
    if (corps) corps.style.display = sousFiche === 'fiche' ? '' : 'none';
    if (voies) voies.style.display = sousFiche === 'voies' ? '' : 'none';
    if (objets) objets.style.display = sousFiche === 'objets' ? '' : 'none';
    if (sousFiche === 'voies') COF.UI.Voies.rendre();
    else if (sousFiche === 'objets') COF.UI.Objets.rendre();
    else COF.UI.Fiche.rendre();
  }
  COF.UI.rendreFicheOnglets = rendreFicheOnglets;

  function aller(vue) {
    if (vue === 'voies') { sousFiche = 'voies'; vue = 'fiche'; }
    else if (vue === 'objets') { sousFiche = 'objets'; vue = 'fiche'; }
    else if (vue === 'fiche') { sousFiche = 'fiche'; }
    VUES.forEach(function (v) {
      var n = $('#vue-' + v); if (n) n.classList.toggle('actif', v === vue);
      var b = $('#nav-' + v); if (b) b.classList.toggle('actif', v === vue);
    });
    window.scrollTo(0, 0);
    COF.UI.vueActive = vue;
    if (vue === 'fiche') rendreFicheOnglets();
    if (vue === 'arene') COF.UI.Arene.rendre($('#vue-arene'));
    if (vue === 'persos') COF.UI.Persos.rendre();
    if (vue === 'bestiaire') COF.UI.Bestiaire.rendre();
    if (vue === 'generateurs') COF.UI.Generateurs.rendre();
    if (vue === 'des') COF.UI.rendreJournal();
    majTitre();
  }
  COF.UI.aller = aller;

  function majTitre() {
    var p = COF.Store.actif();
    var t = $('#titre'), s = $('#sous-titre');
    if (!p) { t.textContent = 'COF2 Compagnon'; s.textContent = 'Aucun personnage'; return; }
    var pr = COF.PROFILS[p.profil], pe = COF.PEUPLES[p.peuple];
    t.textContent = p.nom;
    s.textContent = (pe ? pe.nom : '?') + ' · ' + (pr ? pr.nom : '?') + ' · niv. ' + p.niveau;
  }
  COF.UI.majTitre = majTitre;

  /* ---------- Modale générique ---------- */
  function ouvrirModale(titre, contenuHTML, apres) {
    $('#modale-titre').textContent = titre;
    $('#modale-corps').innerHTML = contenuHTML;
    $('#modale').classList.add('ouvert');
    if (apres) apres($('#modale-corps'));
  }
  function fermerModale() { $('#modale').classList.remove('ouvert'); }
  COF.UI.ouvrirModale = ouvrirModale;
  COF.UI.fermerModale = fermerModale;

  /* ============================================================
     LANCEUR DE DÉS
     cfg = {
       titre, sousTitre,
       mod        : modificateur de base (nombre)
       critMin    : 20 par défaut
       difficulte : nombre ou null
       dmg        : formule de dommages (facultatif)
       dmgLabel   : libellé du bouton dommages
       ctx        : contexte pour les formules
       type       : 'attaque' | 'carac' | 'libre' | 'soins'
       sansD20    : true pour ne lancer que les dommages
       attaqueTypes : [{id,label,mod}, ...] pour choisir contact/distance/magique
       attaqueDefaut: id du type actif par défaut (sinon le premier)
     }
     ============================================================ */
  function jet(cfg) {
    cfg = cfg || {};
    var defautAtt = cfg.attaqueTypes &&
      (cfg.attaqueTypes.filter(function (t) { return t.id === cfg.attaqueDefaut; })[0] || cfg.attaqueTypes[0]);
    var modInitial = defautAtt ? defautAtt.mod : (cfg.mod || 0);
    var etat = { bonus: false, malus: false, mod: modInitial, diff: cfg.difficulte || null };

    var html = '';
    html += '<div class="note" style="margin-bottom:12px">' + esc(cfg.sousTitre || '') + '</div>';

    if (cfg.choixAction) {
      html += '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:var(--text-mute);margin-bottom:5px">Action utilisée</div>';
      html += '<div class="chips" style="margin-bottom:10px">' +
        cfg.choixAction.map(function (a, i) {
          var lbl = COF.RULES.actions && COF.RULES.actions[a] ? COF.RULES.actions[a].nom : a;
          return '<span class="chip' + (i === 0 ? ' on' : '') + '" data-choixaction="' + i + '">' + esc(lbl) + '</span>';
        }).join('') + '</div>';
    }

    if (!cfg.sansD20) {
      if (cfg.attaqueTypes) {
        html += '<div class="chips" style="margin-bottom:10px">' +
          cfg.attaqueTypes.map(function (t) {
            return '<span class="chip' + (t === defautAtt ? ' on' : '') + '" data-att="' + t.id + '" data-v="' + t.mod + '">' +
              esc(t.label) + ' ' + sgn(t.mod) + '</span>';
          }).join('') + '</div>';
      }
      if (cfg.armeChoix) {
        html += '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:var(--text-mute);margin-bottom:5px">' +
          'Arme utilisée — les DM de la capacité s\'y ajoutent</div>';
        html += '<div class="chips" style="margin-bottom:10px">' +
          cfg.armeChoix.map(function (a, i) {
            return '<span class="chip' + (i === 0 ? ' on' : '') + '" data-arme="' + i + '">' +
              esc(a.label) + '</span>';
          }).join('') + '</div>';
      }
      html += '<div class="options">' +
        '<div class="opt" data-o="bonus">🎲 Dé bonus</div>' +
        '<div class="opt" data-o="malus">💀 Dé malus</div>' +
        '</div>';
      if (cfg.caracChoix) {
        html += '<div class="chips" style="margin-bottom:10px">' +
          COF.RULES.caracs.map(function (c) {
            return '<span class="chip" data-carac="' + c.id + '" data-v="' + (cfg.caracChoix[c.id] || 0) + '">' +
              c.id + ' ' + sgn(cfg.caracChoix[c.id] || 0) + '</span>';
          }).join('') + '</div>';
      }
      html += '<div class="mod-ligne">' +
        '<label>Modificateur</label><input type="number" id="j-mod" value="' + etat.mod + '">' +
        '<label style="margin-left:auto">Difficulté / DEF</label><input type="number" id="j-diff" value="' + (etat.diff === null ? '' : etat.diff) + '" placeholder="—">' +
        '</div>';
      if (cfg.dmg) {
        html += '<div class="champ" style="margin-top:8px"><label>Bonus circonstanciel aux dégâts (facultatif)</label>' +
          '<input id="j-dmg-bonus" placeholder="+1, +1d4, -2…"></div>';
      }
      html += '<button class="btn btn-plein btn-bloc" id="j-lancer">Lancer le d20</button>';
      if (cfg.dmg) {
        html += '<button class="btn btn-bloc" id="j-dmg-skip" style="margin-top:8px">Dégâts seuls (sans test d\'attaque)</button>';
      }
    } else {
      html += '<div class="champ" style="margin-bottom:8px"><label>Bonus circonstanciel aux dégâts (facultatif)</label>' +
        '<input id="j-dmg-bonus" placeholder="+1, +1d4, -2…"></div>';
      html += '<button class="btn btn-plein btn-bloc" id="j-dmg-direct">Lancer ' + esc(cfg.dmg) + '</button>';
    }
    html += '<div id="j-res"></div>';

    ouvrirModale(cfg.titre || 'Jet de dés', html, function (root) {
      $$('[data-choixaction]', root).forEach(function (ch) {
        ch.addEventListener('click', function () {
          $$('[data-choixaction]', root).forEach(function (x) { x.classList.remove('on'); });
          ch.classList.add('on');
        });
      });

      $$('.opt', root).forEach(function (o) {
        o.addEventListener('click', function () {
          var k = o.getAttribute('data-o');
          etat[k] = !etat[k];
          if (etat.bonus && etat.malus) { /* ils s'annulent, on le montre */ }
          $$('.opt', root).forEach(function (x) {
            x.classList.toggle('on', etat[x.getAttribute('data-o')]);
          });
        });
      });

      $$('[data-att]', root).forEach(function (ch) {
        ch.addEventListener('click', function () {
          $$('[data-att]', root).forEach(function (x) { x.classList.remove('on'); });
          ch.classList.add('on');
          $('#j-mod', root).value = ch.getAttribute('data-v');
        });
      });

      /* choix de l'arme : met à jour la formule de DM combinée et le modificateur */
      $$('[data-arme]', root).forEach(function (ch) {
        ch.addEventListener('click', function () {
          $$('[data-arme]', root).forEach(function (x) { x.classList.remove('on'); });
          ch.classList.add('on');
          var a = cfg.armeChoix[+ch.getAttribute('data-arme')];
          cfg.dmg = a.dmg;
          if (typeof a.mod === 'number') $('#j-mod', root).value = a.mod;
          var skip = $('#j-dmg-skip', root);
          if (skip) skip.textContent = 'Dégâts seuls — ' + a.dmg;
          var dm = $('#j-dmg', root);
          if (dm && dm.textContent.indexOf('CRITIQUE') < 0) {
            dm.textContent = (cfg.dmgLabel || 'Dommages') + ' — ' + a.dmg;
          }
        });
      });

      $$('[data-carac]', root).forEach(function (ch) {
        ch.addEventListener('click', function () {
          var on = ch.classList.contains('on');
          $$('[data-carac]', root).forEach(function (x) { x.classList.remove('on'); });
          var base = cfg.mod || 0;
          if (!on) { ch.classList.add('on'); base += parseInt(ch.getAttribute('data-v'), 10); }
          $('#j-mod', root).value = base;
        });
      });

      var btn = $('#j-lancer', root);
      if (btn) btn.addEventListener('click', function () {
        etat.mod = parseInt($('#j-mod', root).value || '0', 10);
        var dv = $('#j-diff', root).value;
        etat.diff = dv === '' ? null : parseInt(dv, 10);
        lancerTest(cfg, etat, root);
      });

      var bd = $('#j-dmg-direct', root);
      if (bd) bd.addEventListener('click', function () {
        afficherDmg(cfg, false, root, true, true);
      });

      var skip = $('#j-dmg-skip', root);
      if (skip) skip.addEventListener('click', function () {
        afficherDmg(cfg, false, root, true, true);
      });
    });
  }
  COF.UI.jet = jet;

  /* Formule de DM d'une arme du personnage, bonus permanents inclus */
  function dmgArme(C, w) {
    var d = w.dm;
    if (w.type === 'contact' && !w.noFor) d += '+FOR';
    if (w.type === 'contact' && C.bonus && C.bonus.dmC) d += '+' + C.bonus.dmC;
    if (w.type === 'distance' && C.bonus && C.bonus.dmD) d += '+' + C.bonus.dmD;
    return d;
  }
  COF.UI.dmgArme = dmgArme;

  /* Certaines capacités indiquent dans leur texte un bonus qui augmente avec
     un seuil de rang atteint dans d'autres voies d'un même profil (ex.
     Attaque sournoise : +1d4° par rang 4 dans une voie de voleur, max 7d4°).
     `cap.scaleDmg = { profil, seuilRang, dePlus, maxNb }` recalcule alors le
     nombre de dés de tête de `cap.dmg` (mode par défaut). Avec
     `mode: 'flat'`, ajoute plutôt un bonus fixe croissant (ex. Projectile de
     mana : +1 DM par rang 4 chez le magicien, plafonné par `maxCarac`
     — une caractéristique du personnage — ou par `maxFlat`).            */
  function formuleEchelle(cap, C) {
    if (!cap.scaleDmg || !cap.dmg) return cap.dmg;
    var sc = cap.scaleDmg;
    var count = COF.Calc.rangsAtteintsProfil(C, sc.profil, sc.seuilRang);
    if (sc.mode === 'flat') {
      var bonus = count * (sc.dePlus || 1);
      var plafond = sc.maxCarac ? ((C.carac && C.carac[sc.maxCarac]) || 0) : (sc.maxFlat || Infinity);
      bonus = Math.min(plafond, bonus);
      return bonus > 0 ? cap.dmg + '+' + bonus : cap.dmg;
    }
    var m = /^(\d*)d(\d+)(°?)/.exec(cap.dmg);
    if (!m) return cap.dmg;
    var nb = parseInt(m[1] || '1', 10) + count * (sc.dePlus || 1);
    if (sc.maxNb) nb = Math.min(sc.maxNb, nb);
    return nb + 'd' + m[2] + m[3] + cap.dmg.slice(m[0].length);
  }
  COF.UI.formuleEchelle = formuleEchelle;

  /* Ouvre un jet d'attaque générique (contact/distance/magique) pour une
     capacité de combat (voie de profil, prestige ou hybride). Ne gère
     aucun coût en PM : réservé aux capacités qui ne sont pas des sorts.

     Trois natures de formule (champ « t » de la capacité) :
       'bonus' → les DM s'ajoutent à ceux d'une arme : on propose les armes
                 du personnage et on lance la somme
       'soin'  → restauration de PV, sans test d'attaque
       absent  → dommages directs, la formule se suffit à elle-même        */
  function jetCapacite(cap, voieNom, rangCourant, persoOverride, cibleInfo) {
    var C = persoOverride || COF.Store.actif();
    var K = COF.Calc;
    var a = K.attaques(C);
    var sous = voieNom + ' · rang ' + cap.r + (cap.d ? ' — ' + cap.d : '') +
      (cibleInfo ? ' · 🎯 ' + cibleInfo.nom + ' (DEF ' + cibleInfo.def + ')' : '');
    var choixAction = (cap.a && cap.a.indexOf('/') > -1) ? cap.a.split('/') : null;
    var capDmg = formuleEchelle(cap, C);

    if (cap.t === 'soin') {
      jet({
        titre: cap.n, sousTitre: sous, choixAction: choixAction,
        dmg: capDmg, dmgLabel: 'Soins', sansD20: true,
        ctx: K.ctx(C, rangCourant), type: 'soins'
      });
      return;
    }

    var types = [
      { id: 'contact', label: 'Contact', mod: a.contact },
      { id: 'distance', label: 'Distance', mod: a.distance },
      { id: 'magique', label: 'Magique', mod: a.magique }
    ];

    if (cap.t === 'bonus') {
      /* la capacité ajoute ses DM à ceux d'une arme : proposer les armes */
      var choix = (C.armes || []).map(function (w) {
        var base = dmgArme(C, w);
        var mod = w.type === 'distance' ? a.distance : (w.type === 'magique' ? a.magique : a.contact);
        return { label: w.nom, dmg: base + '+' + capDmg, mod: mod, type: w.type };
      });
      choix.push({ label: 'Bonus seul', dmg: capDmg, mod: null });

      /* arme par défaut : à distance si la capacité le mentionne, sinon la première */
      var versDistance = /distance|arc |arbalète|tir\b|flèche|poudre|jet\b/i.test(cap.n + ' ' + (cap.d || ''));
      var def = 0;
      if (versDistance) {
        for (var i = 0; i < choix.length; i++) {
          if (choix[i].type === 'distance') { def = i; break; }
        }
      }
      if (def > 0) { var tmp = choix[0]; choix[0] = choix[def]; choix[def] = tmp; }

      jet({
        titre: cap.n, sousTitre: sous, choixAction: choixAction,
        attaqueTypes: types,
        attaqueDefaut: choix[0].type === 'distance' ? 'distance' : (cap.s ? 'magique' : 'contact'),
        armeChoix: choix,
        mod: choix[0].mod,
        dmg: choix[0].dmg, dmgLabel: 'Dommages',
        difficulte: cibleInfo ? cibleInfo.def : null, cible: cibleInfo,
        ctx: K.ctx(C, rangCourant), type: 'attaque'
      });
      return;
    }

    jet({
      titre: cap.n, sousTitre: sous, choixAction: choixAction,
      attaqueTypes: types, attaqueDefaut: cap.s ? 'magique' : 'contact',
      dmg: capDmg || null, dmgLabel: 'Dommages',
      difficulte: cibleInfo ? cibleInfo.def : null, cible: cibleInfo,
      ctx: K.ctx(C, rangCourant), type: 'attaque'
    });
  }
  COF.UI.jetCapacite = jetCapacite;

  function lancerTest(cfg, etat, root) {
    vibre(12);
    var r = COF.Dice.test({
      mod: etat.mod, bonus: etat.bonus, malus: etat.malus,
      difficulte: etat.diff, critMin: cfg.critMin || 20
    });

    var cls = r.crit ? 'crit' : (r.fumble ? 'fumble' : '');
    var h = '<div class="resultat ' + cls + '">';
    h += '<div class="grand">' + r.total + '</div>';

    var desH = r.des.map(function (v, i) {
      var g = (v === r.garde && r.des.indexOf(r.garde) === i);
      return '<div class="de ' + (g ? 'garde' : 'ignore') + '">' + v + '</div>';
    }).join('');
    h += '<div class="des-lances">' + desH + '</div>';
    h += '<div class="detail">d20 ' + r.garde + ' ' + sgn(r.mod) +
      (r.bonus ? ' · dé bonus' : '') + (r.malus ? ' · dé malus' : '') + '</div>';

    if (r.crit) h += '<div class="verdict ok">✦ Réussite critique</div>';
    else if (r.fumble) h += '<div class="verdict ko">✖ Échec critique (1 naturel)</div>';
    if (r.difficulte !== null && !r.crit && !r.fumble) {
      h += '<div class="verdict ' + (r.reussite ? 'ok' : 'ko') + '">' +
        (r.reussite ? 'Réussite' : 'Échec') + ' (difficulté ' + r.difficulte + ')</div>';
    }
    h += '</div>';

    if (cfg.dmg) {
      h += '<button class="btn ' + (r.crit ? 'btn-sang' : 'btn-or') + ' btn-bloc" id="j-dmg">' +
        (r.crit ? '💥 Dommages CRITIQUES (×2)' : (cfg.dmgLabel || 'Dommages') + ' — ' + esc(cfg.dmg)) +
        '</button><div id="j-dmg-res"></div>';
    }
    h += '<button class="btn btn-bloc" id="j-relancer" style="margin-top:8px">↻ Relancer</button>';

    $('#j-res', root).innerHTML = h;

    COF.Store.logJet({
      t: Date.now(), titre: cfg.titre, sous: cfg.sousTitre,
      total: r.total, crit: r.crit, fumble: r.fumble,
      detail: 'd20 ' + r.garde + ' ' + sgn(r.mod) + (r.difficulte !== null ? ' vs ' + r.difficulte : '')
    });

    var bd = $('#j-dmg', root);
    if (bd) bd.addEventListener('click', function () { afficherDmg(cfg, r.crit, root, false, r.reussite); });
    $('#j-relancer', root).addEventListener('click', function () { lancerTest(cfg, etat, root); });
  }

  /* Normalise un bonus circonstanciel saisi librement ("1d4", "-2"…)
     en un terme préfixé d'un signe, prêt à être concaténé à une formule. */
  function normaliserBonus(s) {
    s = (s || '').trim();
    if (!s) return '';
    if (s[0] !== '+' && s[0] !== '-') s = '+' + s;
    return s;
  }

  /* hit : true/undefined = le jet est considéré réussi (ou aucun test n'a eu lieu, ex.
     « Dégâts seuls ») → applique les dégâts à cfg.cible si fourni ; false = attaque ratée. */
  function afficherDmg(cfg, crit, root, direct, hit) {
    vibre(12);
    var bonusEl = $('#j-dmg-bonus', root);
    var bonus = bonusEl ? normaliserBonus(bonusEl.value) : '';
    var formule = cfg.dmg + bonus;
    var r = COF.Dice.dommages(formule, cfg.ctx || {}, { crit: crit });
    var det = r.detail.map(function (d) {
      return d.jets ? d.label + ' [' + d.jets.join(', ') + ']' : d.label + ' ' + sgn(d.val);
    }).join(' · ');
    var h = '<div class="resultat"><div class="grand">' + r.total + '</div>' +
      '<div class="detail">' + esc(det) + (crit ? ' → ×2 (critique)' : '') + '</div>' +
      '<div class="verdict">' + (cfg.type === 'soins' ? 'points récupérés' : 'dommages') + '</div></div>';

    if (cfg.cible && cfg.type !== 'soins') {
      if (hit === false) {
        h += '<div class="note" style="margin-top:8px">✖ Attaque manquée — ' + esc(cfg.cible.nom) + ' n\'est pas touché(e).</div>';
      } else {
        var etatCible = cfg.cible.appliquer(r.total);
        h += '<div class="note" style="margin-top:8px">🎯 ' + r.total + ' dégâts appliqués à <b>' +
          esc(cfg.cible.nom) + '</b>' + (etatCible ? ' (' + esc(etatCible) + ')' : '') + '.</div>';
      }
    }

    h += '<button class="btn btn-bloc" id="j-dmg-relance" style="margin-top:8px">↻ Relancer les dommages</button>';
    var zoneRes = $(direct ? '#j-res' : '#j-dmg-res', root);
    zoneRes.innerHTML = h;

    COF.Store.logJet({
      t: Date.now(), titre: (cfg.type === 'soins' ? 'Soins — ' : 'DM — ') + cfg.titre,
      sous: formule + (crit ? ' ×2' : ''), total: r.total, dm: true
    });

    $('#j-dmg-relance', root).addEventListener('click', function () { afficherDmg(cfg, crit, root, direct, hit); });
  }

  /* ---------- Journal ---------- */
  function rendreJournal() {
    var j = COF.Store.journal();
    var n = $('#journal');
    if (!j.length) { n.innerHTML = '<div class="vide">Aucun jet pour l\'instant.<br>Lancez des dés depuis la fiche ou ci-dessus.</div>'; return; }
    n.innerHTML = j.map(function (e) {
      var cls = e.crit ? 'crit' : (e.fumble ? 'fumble' : '');
      var h = new Date(e.t);
      return '<div class="journal-ligne ' + cls + '">' +
        '<div class="r">' + e.total + '</div>' +
        '<div class="d"><div class="t">' + esc(e.titre || 'Jet') + '</div>' +
        '<div class="s">' + esc(e.detail || e.sous || '') + ' · ' +
        ('0' + h.getHours()).slice(-2) + ':' + ('0' + h.getMinutes()).slice(-2) + '</div></div></div>';
    }).join('');
  }
  COF.UI.rendreJournal = rendreJournal;

  /* ---------- Démarrage ---------- */
  function init() {
    VUES.forEach(function (v) {
      var b = $('#nav-' + v);
      if (b) b.addEventListener('click', function () { aller(v); });
    });
    $('#modale-fermer').addEventListener('click', fermerModale);
    $('#modale').addEventListener('click', function (e) {
      if (e.target.id === 'modale') fermerModale();
    });
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-fonglet]') : null;
      if (!t) return;
      sousFiche = t.getAttribute('data-fonglet');
      rendreFicheOnglets();
    });

    COF.UI.Persos.init();
    COF.UI.Fiche.init();
    COF.UI.Voies.init();
    COF.UI.Objets.init();
    COF.UI.Arene.init();
    COF.UI.Bestiaire.init();
    COF.UI.Generateurs.init();
    COF.UI.Des.init();
    COF.UI.Plus.init();

    aller(COF.Store.actif() ? 'fiche' : 'persos');
  }

  document.addEventListener('DOMContentLoaded', init);

  /* ---------- PWA : service worker ---------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {
        /* échec silencieux : file:// ou hébergement sans HTTPS, l'app reste utilisable en ligne */
      });
    });
  }
})();
