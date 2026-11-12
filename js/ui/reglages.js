/* ============================================================
   COF2 Compagnon — Sauvegarde & réglages
   - Sauvegarde complète dans un fichier (partage natif du téléphone
     quand il est disponible, sinon téléchargement), restauration,
     rappel quand la dernière sauvegarde date de plus de 7 jours.
   - Préférences d'affichage : taille du texte, thème clair/sombre.
   - Glisser du doigt pour changer d'onglet dans le Carnet.
   Affiché dans « Personnages » (mode normal) et dans le menu de
   l'aventure (mode aventure).
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Reglages = (function () {
  var esc = COF.UI.esc, S = COF.Sauvegarde;
  var KEY = 'cof2.prefs';
  var TAILLES = [['petit', 'A−', 0.92], ['normal', 'A', 1], ['grand', 'A+', 1.1], ['tresgrand', 'A++', 1.22]];

  function prefs() {
    var p = {};
    try { p = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
    return { texte: p.texte || 'normal', theme: p.theme || 'sombre' };
  }
  function sauverPrefs(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {} }
  /* Thèmes : auto (suit le téléphone), sombre, noir profond (OLED), clair. */
  var THEMES = [['auto', '📱 Auto'], ['sombre', '🌙 Sombre'], ['noir', '🌑 Noir profond'], ['clair', '☀️ Clair']];
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
  function themeEffectif(p) {
    if (p.theme === 'auto') return mq && mq.matches ? 'clair' : 'sombre';
    return p.theme;
  }
  function appliquer() {
    var p = prefs(), t = TAILLES.filter(function (x) { return x[0] === p.texte; })[0] || TAILLES[1];
    var th = themeEffectif(p), root = document.documentElement;
    root.style.setProperty('--zoom', t[2]);
    root.classList.toggle('theme-clair', th === 'clair');
    root.classList.toggle('theme-noir', th === 'noir');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', th === 'clair' ? '#f3ece0' : (th === 'noir' ? '#000000' : '#14110e'));
  }
  if (mq) { try { mq.addEventListener('change', function () { if (prefs().theme === 'auto') appliquer(); }); } catch (e) {} }

  /* ---------- Rappel de sauvegarde ---------- */
  function texteAge() {
    var a = S.age();
    if (a === null) return 'jamais sauvegardé';
    if (a === 0) return 'sauvegardé aujourd’hui';
    if (a === 1) return 'sauvegardé hier';
    return 'dernière sauvegarde il y a ' + a + ' jours';
  }
  function rappelHTML() {
    if (!S.aRappeler()) return '';
    return '<div class="rg-rappel"><span>💾 Vos parties ne sont que sur cet appareil — ' + esc(texteAge()) + '.</span>' +
      '<button class="btn btn-sm btn-or" data-rg="sauver">Sauvegarder</button></div>';
  }

  /* ---------- Carte complète ---------- */
  function carteHTML() {
    var p = prefs(), r = S.resume();
    return '<div class="rg-bloc">' +
      '<label class="cn-lbl2">💾 Sauvegarde complète</label>' +
      '<div class="note" style="margin-bottom:8px">' + r.persos + ' personnage(s), ' + r.aventures + ' aventure(s) — ' + esc(texteAge()) + '.</div>' +
      '<div class="cn-grille"><button data-rg="sauver" class="on">💾 Tout sauvegarder</button><button data-rg="restaurer">📂 Restaurer</button></div>' +
      '<div class="note" style="margin-top:6px">Un fichier .json contient tout : personnages, aventures, combat en cours et réglages. ' +
        'Gardez-le hors du téléphone (cloud, e-mail) : si le navigateur efface ses données, il suffira de le restaurer.</div>' +
      '<label class="cn-lbl2" style="margin-top:14px">🔤 Taille du texte</label><div class="cn-grille cn-g4">' + TAILLES.map(function (t) {
        return '<button data-rg="texte" data-v="' + t[0] + '" class="' + (p.texte === t[0] ? 'on' : '') + '" style="font-size:' + Math.round(14 * t[2]) + 'px">' + t[1] + '</button>';
      }).join('') + '</div>' +
      '<label class="cn-lbl2" style="margin-top:14px">🎨 Thème</label><div class="cn-grille">' + THEMES.map(function (t) {
        return '<button data-rg="theme" data-v="' + t[0] + '" class="' + (p.theme === t[0] ? 'on' : '') + '">' + t[1] + '</button>';
      }).join('') + '</div>' +
      '<div class="note" style="margin-top:6px">Auto suit le réglage clair/sombre du téléphone ; Noir profond économise la batterie des écrans OLED.</div>' +
      '</div>';
  }
  function rendre() {
    var n = document.getElementById('reglages');
    if (n) n.innerHTML = rappelHTML() + carteHTML();
    var m = document.getElementById('rg-sheet');
    if (m) m.innerHTML = carteHTML();
  }
  function ouvrir() { COF.UI.ouvrirModale('⚙️ Sauvegarde & réglages', '<div id="rg-sheet">' + carteHTML() + '</div>'); }

  function toast(msg) {
    var t = document.createElement('div'); t.className = 'cn-toast'; t.textContent = msg;
    document.body.appendChild(t); setTimeout(function () { t.classList.add('out'); }, 1800); setTimeout(function () { t.remove(); }, 2300);
  }
  function rafraichirTout() {
    rendre();
    if (COF.UI.vueActive === 'carnet' && COF.UI.Carnet) COF.UI.Carnet.rendre();
  }

  /* ---------- Sauvegarder / restaurer ---------- */
  function telecharger(txt, nom) {
    var blob = new Blob([txt], { type: 'application/json' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nom;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 800);
  }
  function sauver() {
    var txt = S.exporter(), nom = S.nomFichier();
    var fini = function () { S.marquer(); rafraichirTout(); toast('💾 Sauvegarde prête : ' + nom); };
    try {
      var f = new File([txt], nom, { type: 'application/json' });
      if (navigator.canShare && navigator.canShare({ files: [f] })) {
        navigator.share({ files: [f], title: 'Sauvegarde COF2' }).then(fini, function (e) {
          if (e && e.name === 'AbortError') return;      // l'utilisateur a annulé
          telecharger(txt, nom); fini();
        });
        return;
      }
    } catch (e) { /* pas de partage de fichier : téléchargement */ }
    telecharger(txt, nom); fini();
  }
  function restaurer() {
    var inp = document.createElement('input');
    inp.type = 'file'; inp.accept = '.json,application/json';
    inp.addEventListener('change', function () {
      var f = inp.files && inp.files[0]; if (!f) return;
      var lec = new FileReader();
      lec.onload = function () {
        var a = S.analyser(String(lec.result));
        if (!a.ok) { alert(a.erreur); return; }
        var r = a.resume || {}, d = a.date ? new Date(a.date).toLocaleString('fr-FR') : 'date inconnue';
        if (!confirm('Restaurer la sauvegarde du ' + d + ' (' + (r.persos || 0) + ' personnage(s), ' + (r.aventures || 0) + ' aventure(s)) ?\n\n' +
          'Toutes les données actuelles de cet appareil seront remplacées.')) return;
        S.restaurer(a);
        location.reload();
      };
      lec.readAsText(f);
    });
    inp.click();
  }

  /* ---------- Glisser pour changer d'onglet (Carnet) ---------- */
  function installerGlisser() {
    var x0 = null, y0 = null, t0 = 0;
    document.addEventListener('touchstart', function (e) {
      var t = e.target;
      if (!t.closest || !t.closest('#vue-carnet') || t.closest('input, textarea, select, .cn-mini, .cn-plan, .cn-dock, .cn-monde-boite, .ar-grille')) { x0 = null; return; }
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; t0 = Date.now();
    }, { passive: true });
    document.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Date.now() - t0 > 600 || Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.8) return;
      if (document.getElementById('modale').classList.contains('ouvert')) return;
      if (COF.UI.Carnet && COF.UI.Carnet.glisser) COF.UI.Carnet.glisser(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  function init() {
    appliquer();
    installerGlisser();
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-rg]') : null;
      if (!t) return;
      var act = t.getAttribute('data-rg'), v = t.getAttribute('data-v');
      if (act === 'sauver') sauver();
      else if (act === 'restaurer') restaurer();
      else if (act === 'ouvrir') ouvrir();
      else if (act === 'texte' || act === 'theme') {
        var p = prefs(); p[act] = v; sauverPrefs(p); appliquer(); rendre();
      }
    });
  }

  return { init: init, rendre: rendre, ouvrir: ouvrir, rappelHTML: rappelHTML, carteHTML: carteHTML, appliquer: appliquer };
})();
