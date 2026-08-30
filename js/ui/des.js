/* ============================================================
   COF2 Compagnon — Onglet « Dés » : lanceur libre et journal
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Des = (function () {
  var $ = COF.UI.$, $$ = COF.UI.$$;

  function init() {
    $$('#vue-des [data-de]').forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-de');
        var p = COF.Store.actif();
        var ctx = p ? COF.Calc.ctx(p) : { deEvo: 4 };
        if (f === 'd20') {
          COF.UI.jet({ titre: 'Test libre', sousTitre: 'd20 + modificateur', mod: 0, ctx: ctx });
        } else {
          COF.UI.jet({ titre: 'Lancer ' + f, sousTitre: '', dmg: f, sansD20: true, ctx: ctx });
        }
      });
    });

    $('#de-perso').addEventListener('click', function () {
      var f = ($('#de-formule').value || '').trim();
      if (!f) return;
      var p = COF.Store.actif();
      COF.UI.jet({
        titre: 'Lancer ' + f, sousTitre: 'Formule personnalisée',
        dmg: f, sansD20: true, ctx: p ? COF.Calc.ctx(p) : { deEvo: 4 }
      });
    });

    $('#journal-vider').addEventListener('click', function () {
      COF.Store.viderJournal(); COF.UI.rendreJournal();
    });
  }

  return { init: init };
})();

/* ============================================================
   Onglet « Plus » : aide-mémoire des règles, import/export
   ============================================================ */
COF.UI.Plus = (function () {
  var $ = COF.UI.$, esc = COF.UI.esc;

  function init() {
    rendre();
    $('#btn-export').addEventListener('click', function () {
      var p = COF.Store.actif();
      if (!p) { alert('Aucun personnage actif.'); return; }
      var txt = COF.Store.exporter(p);
      COF.UI.ouvrirModale('Export de ' + p.nom,
        '<div class="note">Copiez ce texte pour sauvegarder votre personnage.</div>' +
        '<textarea style="width:100%;min-height:220px;background:var(--bg-2);border:1px solid var(--line-2);' +
        'border-radius:8px;padding:10px;color:var(--text)">' + esc(txt) + '</textarea>');
    });
    $('#btn-import').addEventListener('click', function () {
      COF.UI.ouvrirModale('Importer un personnage',
        '<div class="champ"><label>Collez ici le JSON exporté</label>' +
        '<textarea id="imp-json" style="min-height:200px"></textarea></div>' +
        '<button class="btn btn-plein btn-bloc" id="imp-ok">Importer</button>',
        function (root) {
          COF.UI.$('#imp-ok', root).addEventListener('click', function () {
            try {
              var p = COF.Store.importer(COF.UI.$('#imp-json', root).value);
              COF.Store.setActif(p.id);
              COF.UI.fermerModale();
              COF.UI.aller('fiche');
            } catch (e) { alert('JSON invalide.'); }
          });
        });
    });
  }

  function rendre() {
    var m = COF.RULES.memo;
    var h = '';
    h += '<div class="carte"><h2>Aide-mémoire</h2><div class="carte-corps">';
    [['Le test', m.test], ['Réussite critique', m.critique], ['Échec critique', m.echec],
     ['Dé bonus / dé malus', m.deBonus], ['Valeurs d\'attaque', m.attaques], ['Dommages', m.dmContact],
     ['Points de vigueur', m.pv], ['Dés de récupération', m.dr], ['Points de chance', m.pc],
     ['Points de mana', m.pm], ['Concentration', m.concentration], ['Brûlure de mana', m.brulure]
    ].forEach(function (r) {
      h += '<div class="ligne"><div class="info"><div class="t" style="color:var(--or-clair);font-size:13px">' +
        esc(r[0]) + '</div><div class="s" style="font-size:12.5px;color:var(--text-dim)">' + esc(r[1]) + '</div></div></div>';
    });
    h += '</div></div>';

    h += '<div class="carte pliable ferme"><h2>Table des difficultés</h2><div class="carte-corps">';
    COF.RULES.difficultes.forEach(function (d) {
      h += '<div class="ligne"><div class="info"><div class="t">' + esc(d.nom) + '</div></div>' +
        '<div class="actions"><span class="puce puce-rang">' + d.v + '</span></div></div>';
    });
    h += '</div></div>';

    h += '<div class="carte pliable ferme"><h2>États préjudiciables</h2><div class="carte-corps">';
    COF.RULES.etats.forEach(function (e) {
      h += '<div class="ligne"><div class="info"><div class="t">' + esc(e.nom) + '</div>' +
        '<div class="s">' + esc(e.effet) + '</div></div></div>';
    });
    h += '</div></div>';

    h += '<div class="carte pliable ferme"><h2>Dés évolutifs (d4°)</h2><div class="carte-corps">' +
      '<div class="note">Niveau 1-5 : d4 · 6-8 : d6 · 9-11 : d8 · 12-14 : d10 · 15+ : d12.<br>' +
      'L\'application applique automatiquement la bonne valeur selon le niveau du personnage.</div></div></div>';

    h += '<div class="carte"><h2>À venir</h2><div class="carte-corps">' +
      '<div class="ligne"><div class="info"><div class="t">🐉 Bestiaire</div>' +
      '<div class="s">Profils de créatures, filtres par NC, jets d\'attaque intégrés</div></div></div>' +
      '<div class="ligne"><div class="info"><div class="t">🎲 Générateur JDR solo</div>' +
      '<div class="s">Oracle oui/non, tables d\'événements, générateur de donjons et de PNJ</div></div></div>' +
      '<div class="ligne"><div class="info"><div class="t">🗺️ Objets magiques & trésors</div>' +
      '<div class="s">Tables de trésor et catalogue d\'objets</div></div></div>' +
      '<div class="ligne"><div class="info"><div class="t">⚔️ Voies de prestige</div>' +
      '<div class="s">Les voies génériques et par famille, du rang 4 au rang 8</div></div></div>' +
      '</div></div>';

    $('#plus-contenu').innerHTML = h;
    COF.UI.$$('#plus-contenu .pliable > h2').forEach(function (t) {
      t.addEventListener('click', function () { t.parentNode.classList.toggle('ferme'); });
    });
  }

  return { init: init };
})();
