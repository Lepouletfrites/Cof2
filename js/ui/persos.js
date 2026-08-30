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

  /* ---------- Création ---------- */
  function optionsProfils() {
    var fam = { aventurier: [], combattant: [], mage: [], mystique: [] };
    Object.keys(COF.PROFILS).forEach(function (k) {
      var p = COF.PROFILS[k];
      fam[p.famille].push('<option value="' + k + '">' + esc(p.nom) + '</option>');
    });
    return Object.keys(fam).map(function (f) {
      return '<optgroup label="' + esc(COF.RULES.familles[f].nom) + '">' + fam[f].join('') + '</optgroup>';
    }).join('');
  }

  function optionsPeuples() {
    return Object.keys(COF.PEUPLES).map(function (k) {
      return '<option value="' + k + '">' + esc(COF.PEUPLES[k].nom) + '</option>';
    }).join('');
  }

  function ouvrirCreation() {
    var h = '';
    h += '<div class="champ"><label>Nom du personnage</label><input id="c-nom" placeholder="Lhagva, fille de Nuala"></div>';
    h += '<div class="grille2">';
    h += '<div class="champ"><label>Profil</label><select id="c-profil">' + optionsProfils() + '</select></div>';
    h += '<div class="champ"><label>Peuple</label><select id="c-peuple">' + optionsPeuples() + '</select></div>';
    h += '</div>';
    h += '<div class="champ"><label>Série de caractéristiques</label><select id="c-serie">' +
      COF.RULES.series.map(function (s) {
        return '<option value="' + s.id + '">' + esc(s.nom) + ' — ' + s.vals.map(sgn).join(' ') + '</option>';
      }).join('') + '</select>' +
      '<div class="aide">Les trois meilleures valeurs sont attribuées automatiquement aux caractéristiques clés du profil. Vous pourrez tout ajuster ensuite.</div></div>';
    h += '<div id="c-apercu" class="note" style="margin-bottom:12px"></div>';
    h += '<button class="btn btn-plein btn-bloc" id="c-creer">Créer le personnage</button>';

    COF.UI.ouvrirModale('Nouveau personnage', h, function (root) {
      function apercu() {
        var pr = COF.PROFILS[$('#c-profil', root).value];
        var pe = COF.PEUPLES[$('#c-peuple', root).value];
        var f = COF.RULES.familles[pr.famille];
        var mods = pe.modsTexte || pe.mods.map(function (m) {
          return '+1 ' + m.plus.join(' ou ') + (m.moins.length ? ', -1 ' + m.moins.join(' ou ') : '');
        }).join(' ');
        $('#c-apercu', root).innerHTML =
          '<b style="color:var(--or-clair)">' + esc(pr.nom) + '</b> — ' + esc(pr.resume) + '<br>' +
          'Caractéristiques clés : <b>' + pr.caracs.join(', ') + '</b><br>' +
          esc(f.nom) + ' : ' + f.pv + ' PV/niveau, DR d' + f.dr + ', ' + esc(f.bonus) + '<br>' +
          '<b style="color:var(--or-clair)">' + esc(pe.nom) + '</b> — ' + esc(mods);
      }
      $('#c-profil', root).addEventListener('change', apercu);
      $('#c-peuple', root).addEventListener('change', apercu);
      apercu();

      $('#c-creer', root).addEventListener('click', function () {
        var p = COF.Store.nouveau({
          nom: $('#c-nom', root).value.trim() || 'Héros sans nom',
          profil: $('#c-profil', root).value,
          peuple: $('#c-peuple', root).value
        });
        appliquerSerie(p, $('#c-serie', root).value);
        COF.Store.equiperDepart(p);
        ajouterVoiePeuple(p);
        COF.Store.reinitialiser(p);
        COF.Store.sauver(p);
        COF.Store.setActif(p.id);
        COF.UI.fermerModale();
        COF.UI.aller('fiche');
      });
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
    if (pe.voie) key = 'peuple.' + pe.id;
    else if (pe.voieChoix) key = 'peuple.' + pe.voieChoix[0];   // demi-elfe : voie de l'humain par défaut
    if (key) p.voies.push({ key: key, rang: 1 });
  }

  return { init: init, rendre: rendre, ouvrirCreation: ouvrirCreation };
})();
