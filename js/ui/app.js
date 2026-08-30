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
  var VUES = ['persos', 'fiche', 'voies', 'des', 'plus'];

  function aller(vue) {
    VUES.forEach(function (v) {
      var n = $('#vue-' + v); if (n) n.classList.toggle('actif', v === vue);
      var b = $('#nav-' + v); if (b) b.classList.toggle('actif', v === vue);
    });
    window.scrollTo(0, 0);
    COF.UI.vueActive = vue;
    if (vue === 'fiche') COF.UI.Fiche.rendre();
    if (vue === 'voies') COF.UI.Voies.rendre();
    if (vue === 'persos') COF.UI.Persos.rendre();
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

    if (!cfg.sansD20) {
      if (cfg.attaqueTypes) {
        html += '<div class="chips" style="margin-bottom:10px">' +
          cfg.attaqueTypes.map(function (t) {
            return '<span class="chip' + (t === defautAtt ? ' on' : '') + '" data-att="' + t.id + '" data-v="' + t.mod + '">' +
              esc(t.label) + ' ' + sgn(t.mod) + '</span>';
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
      html += '<button class="btn btn-plein btn-bloc" id="j-lancer">Lancer le d20</button>';
      if (cfg.dmg) {
        html += '<button class="btn btn-bloc" id="j-dmg-skip" style="margin-top:8px">Dégâts seuls (sans test d\'attaque)</button>';
      }
    } else {
      html += '<button class="btn btn-plein btn-bloc" id="j-dmg-direct">Lancer ' + esc(cfg.dmg) + '</button>';
    }
    html += '<div id="j-res"></div>';

    ouvrirModale(cfg.titre || 'Jet de dés', html, function (root) {
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
        afficherDmg(cfg, false, root, true);
      });

      var skip = $('#j-dmg-skip', root);
      if (skip) skip.addEventListener('click', function () {
        afficherDmg(cfg, false, root, true);
      });
    });
  }
  COF.UI.jet = jet;

  /* Ouvre un jet d'attaque générique (contact/distance/magique) pour une
     capacité de combat (voie de profil, prestige ou hybride). Ne gère
     aucun coût en PM : réservé aux capacités qui ne sont pas des sorts. */
  function jetCapacite(cap, voieNom, rangCourant) {
    var C = COF.Store.actif();
    var K = COF.Calc;
    var a = K.attaques(C);
    var types = [
      { id: 'contact', label: 'Contact', mod: a.contact },
      { id: 'distance', label: 'Distance', mod: a.distance },
      { id: 'magique', label: 'Magique', mod: a.magique }
    ];
    jet({
      titre: cap.n,
      sousTitre: voieNom + ' · rang ' + cap.r + (cap.d ? ' — ' + cap.d : ''),
      attaqueTypes: types, attaqueDefaut: cap.s ? 'magique' : 'contact',
      dmg: cap.dmg || null, dmgLabel: 'Dommages',
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
    if (bd) bd.addEventListener('click', function () { afficherDmg(cfg, r.crit, root, false); });
    $('#j-relancer', root).addEventListener('click', function () { lancerTest(cfg, etat, root); });
  }

  function afficherDmg(cfg, crit, root, direct) {
    vibre(12);
    var r = COF.Dice.dommages(cfg.dmg, cfg.ctx || {}, { crit: crit });
    var det = r.detail.map(function (d) {
      return d.jets ? d.label + ' [' + d.jets.join(', ') + ']' : d.label + ' ' + sgn(d.val);
    }).join(' · ');
    var h = '<div class="resultat"><div class="grand">' + r.total + '</div>' +
      '<div class="detail">' + esc(det) + (crit ? ' → ×2 (critique)' : '') + '</div>' +
      '<div class="verdict">' + (cfg.type === 'soins' ? 'points récupérés' : 'dommages') + '</div></div>' +
      '<button class="btn btn-bloc" id="j-dmg-relance">↻ Relancer les dommages</button>';
    var cible = $(direct ? '#j-res' : '#j-dmg-res', root);
    cible.innerHTML = h;

    COF.Store.logJet({
      t: Date.now(), titre: (cfg.type === 'soins' ? 'Soins — ' : 'DM — ') + cfg.titre,
      sous: cfg.dmg + (crit ? ' ×2' : ''), total: r.total, dm: true
    });

    $('#j-dmg-relance', root).addEventListener('click', function () { afficherDmg(cfg, crit, root, direct); });
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

    COF.UI.Persos.init();
    COF.UI.Fiche.init();
    COF.UI.Voies.init();
    COF.UI.Des.init();
    COF.UI.Plus.init();

    aller(COF.Store.actif() ? 'fiche' : 'persos');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
