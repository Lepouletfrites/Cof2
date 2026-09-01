/* ============================================================
   COF2 Compagnon — Générateur « vie & temps » (sous-onglet de
   Générateurs) : Rumeur, Passage du temps et Marchand — pour
   meubler le quotidien d'une partie solo entre deux scènes fortes.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Solo = (function () {
  var esc = COF.UI.esc;
  var MODE = 'rumeur';
  var cible = null;
  var Calc = COF.SoloCalc;

  var VUES = {
    rumeur: {
      titre: 'Rumeur', bouton: '↻ Nouvelle rumeur',
      champs: [['sujet', 'Sujet'], ['detail', "Ce qu'on raconte"], ['fiabilite', 'Fiabilité']],
      texte: function (id, v) { return v; },
      synthese: Calc.texteRumeur
    },
    temps: {
      titre: 'Passage du temps', bouton: '↻ Nouveau passage',
      champs: [['duree', 'Durée écoulée'], ['meteo', 'Météo'], ['evenement', 'Pendant ce temps']],
      texte: function (id, v) { return v; },
      synthese: Calc.texteTemps
    },
    marchand: {
      titre: 'Marchand', bouton: '↻ Nouvelle négociation',
      champs: [['attitude', 'Attitude'], ['objet', 'Objet en jeu'], ['argument', 'Complication']],
      texte: function (id, v) {
        if (id === 'attitude') return v.nom + ' — ' + v.note;
        if (id === 'objet') return v.nom + ' (prix catalogue ' + v.prix + ' po)';
        return v;
      },
      synthese: function (o) {
        var p = Calc.prixMarchand(o);
        return o.attitude.nom + ' : il achèterait ' + o.objet.nom.toLowerCase() + ' pour ' + p.achat +
          ' po, ou le vendrait pour ' + p.vente + ' po. ' + o.argument;
      }
    }
  };

  Object.keys(VUES).forEach(function (mode) {
    var v = VUES[mode];
    v.vue = COF.UI.creerVueChamps(Calc.GENS[mode], v.texte, 'svact');
  });

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-svact]') : null;
      if (!t || !(t.closest('#vue-generateurs') || t.closest('#modale'))) return;
      actions(t.getAttribute('data-svact'), t);
    });
  }

  function rendre(node) {
    cible = node;
    var v = VUES[MODE];
    v.vue.assurer();
    var o = v.vue.etatCourant();

    var h = '<div class="carte"><div class="carte-corps" style="padding-bottom:2px">' +
      '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:var(--text-mute);margin-bottom:5px">Outil</div>' +
      '<div class="chips" style="margin-bottom:2px">' +
      Object.keys(VUES).map(function (m) {
        return '<span class="chip ' + (MODE === m ? 'on' : '') + '" data-svact="mode" data-v="' + m + '">' + esc(VUES[m].titre) + '</span>';
      }).join('') + '</div></div></div>';

    h += '<div class="carte"><h2>' + esc(v.titre) + '<span class="h2-action" data-svact="tout">' + esc(v.bouton) + '</span></h2>';
    h += '<div class="carte-corps">';
    h += '<div class="note" style="margin-bottom:10px">🔓 pour verrouiller un champ avant de relancer le reste, ↻ pour ne changer que cette ligne.</div>';
    h += '<div style="margin-bottom:12px;padding:10px;border:1px solid var(--line-2);border-radius:8px;' +
      'background:rgba(0,0,0,.15);font-size:14.5px;line-height:1.5">' + esc(v.synthese(o)) + '</div>';
    v.champs.forEach(function (c) { h += v.vue.ligne(c[0], c[1]); });
    h += '<button class="btn btn-bloc" style="margin-top:8px" data-svact="tout">' + esc(v.bouton) + '</button>';
    h += '</div></div>';

    node.innerHTML = h;
  }

  function actions(act, node) {
    if (act === 'mode') { MODE = node.getAttribute('data-v'); if (cible) rendre(cible); return; }
    var v = VUES[MODE];
    if (v.vue.actionGenerique(act, node)) { if (cible) rendre(cible); return; }
  }

  return { init: init, rendre: rendre };
})();
