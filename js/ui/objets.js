/* ============================================================
   COF2 Compagnon — Onglet « Objets » (sous-onglet de Fiche)
   Liste complète des armes et objets du personnage actif, avec
   leur description entière, et la possibilité de transférer
   n'importe quel objet vers un autre personnage.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Objets = (function () {
  var $ = COF.UI.$, $$ = COF.UI.$$, esc = COF.UI.esc, sgn = COF.UI.sgn;
  var C = null;

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-oact]') : null;
      if (!t || !t.closest('#vue-objets')) return;
      actions(t.getAttribute('data-oact'), t);
    });
  }

  function sauver() { COF.Store.sauver(C); }

  function rendre() {
    var n = $('#vue-objets');
    if (!n) return;
    var ouv = $$('.pliable', n).map(function (el) { return el.classList.contains('ferme'); });
    var scrollY = window.scrollY;

    C = COF.Store.actif();
    if (!C) {
      n.innerHTML = '<div class="vide">Aucun personnage sélectionné.<br><br>' +
        '<button class="btn btn-plein" onclick="COF.UI.aller(\'persos\')">Choisir un personnage</button></div>';
      return;
    }
    C.inventaire = C.inventaire || [];
    C.armes = C.armes || [];

    var K = COF.Calc, a = K.attaques(C);
    var h = '';

    h += '<div class="carte"><h2>Armes</h2><div class="carte-corps">';
    if (!C.armes.length) {
      h += '<div class="vide">Aucune arme équipée. Ajoutez-en une depuis l\'onglet Fiche.</div>';
    } else {
      C.armes.forEach(function (w, i) {
        var att = w.type === 'distance' ? a.distance : (w.type === 'magique' ? a.magique : a.contact);
        var dm = COF.UI.dmgArme(C, w);
        h += '<div class="ligne"><div class="info"><div class="t">' + esc(w.nom) +
          (w.crit && w.crit < 20 ? ' <span class="puce puce-rang">crit ' + w.crit + '-20</span>' : '') + '</div>' +
          '<div class="s">' + esc(dm) + ' DM · att. ' + sgn(att) +
          (w.portee ? ' · ' + w.portee + ' m' : '') + (w.note ? ' — ' + esc(w.note) : '') + '</div></div>' +
          '<div class="actions">' +
          '<button class="btn btn-or btn-sm" data-oact="arme-jet" data-i="' + i + '">Attaquer</button>' +
          '<button class="btn btn-sm" data-oact="arme-transfert" data-i="' + i + '" title="Transférer">⇄</button>' +
          '<button class="btn btn-sm" data-oact="arme-suppr" data-i="' + i + '">✕</button></div></div>';
      });
    }
    h += '</div></div>';

    h += '<div class="carte"><h2>Objets<span class="h2-action" data-oact="obj-ajout">+ Objet</span></h2><div class="carte-corps">';
    if (!C.inventaire.length) {
      h += '<div class="vide">Sac vide. ' + esc(COF.SAC_DEPART) + '</div>';
    } else {
      C.inventaire.forEach(function (o, i) {
        h += '<div class="ligne"><div class="info"><div class="t">' + esc(o.nom) +
          (o.qte > 1 ? ' ×' + o.qte : '') +
          (o.prix ? ' <span class="puce">' + o.prix + ' po</span>' : '') +
          (o.dmg ? ' <span class="puce puce-rang">' + esc(o.dmg) + ' DM</span>' : '') +
          (o.def ? ' <span class="puce puce-rang">+' + o.def + ' DEF' + (o.equipe ? ' · équipé' : '') + '</span>' : '') + '</div>' +
          ((o.note || o.desc) ? '<div class="s">' + esc(o.note || o.desc) + '</div>' : '') + '</div>' +
          '<div class="actions">' +
          (o.dmg ? '<button class="btn btn-or btn-sm" data-oact="obj-attaquer" data-i="' + i + '">Attaquer</button>' : '') +
          (o.def ? '<button class="btn btn-sm' + (o.equipe ? '' : ' btn-or') + '" data-oact="obj-equiper" data-i="' + i + '">' +
            (o.equipe ? 'Déséquiper' : 'Équiper') + '</button>' : '') +
          '<button class="btn btn-sm" data-oact="obj-transfert" data-i="' + i + '" title="Transférer">⇄</button>' +
          '<button class="btn btn-sm" data-oact="obj-suppr" data-i="' + i + '">✕</button></div></div>';
      });
    }
    h += '</div></div>';

    n.innerHTML = h;
    $$('.pliable', n).forEach(function (el, i) { if (ouv[i] !== undefined) el.classList.toggle('ferme', ouv[i]); });
    window.scrollTo(0, scrollY);
    $$('.pliable > h2', n).forEach(function (t) {
      t.addEventListener('click', function (e) {
        if (e.target.classList.contains('h2-action')) return;
        t.parentNode.classList.toggle('ferme');
      });
    });
  }

  /* ---------- Transfert vers un autre personnage ---------- */
  function ouvrirTransfert(type, i) {
    var autres = COF.Store.tous().filter(function (p) { return p.id !== C.id; });
    if (!autres.length) { alert('Aucun autre personnage vers qui transférer.'); return; }
    var html = autres.map(function (p) {
      return '<div class="ligne"><div class="info"><div class="t">' + esc(p.nom) + '</div></div>' +
        '<div class="actions"><button class="btn btn-or btn-sm" data-cible="' + p.id + '">Transférer</button></div></div>';
    }).join('');
    COF.UI.ouvrirModale('Transférer vers…', html, function (root) {
      $$('[data-cible]', root).forEach(function (b) {
        b.addEventListener('click', function () {
          var targetId = b.getAttribute('data-cible');
          if (type === 'arme') transfererArme(i, targetId); else transfererObjet(i, targetId);
          COF.UI.fermerModale();
        });
      });
    });
  }

  function transfererArme(i, targetId) {
    var target = COF.Store.get(targetId);
    if (!target) return;
    var w = C.armes.splice(i, 1)[0];
    target.armes = target.armes || [];
    target.armes.push(w);
    sauver(); COF.Store.sauver(target);
    rendre();
  }

  function transfererObjet(i, targetId) {
    var target = COF.Store.get(targetId);
    if (!target) return;
    var o = C.inventaire.splice(i, 1)[0];
    if (o.equipe && o.def) {
      C.bonus = C.bonus || {};
      C.bonus.def = (C.bonus.def || 0) - o.def;
      o.equipe = false;
    }
    target.inventaire = target.inventaire || [];
    target.inventaire.push(o);
    sauver(); COF.Store.sauver(target);
    rendre();
  }

  /* ---------- Actions ---------- */
  function actions(act, node) {
    var i = node.getAttribute('data-i');
    var K = COF.Calc;

    switch (act) {
      case 'arme-jet': {
        var w = C.armes[+i], aa = K.attaques(C);
        var att = w.type === 'distance' ? aa.distance : (w.type === 'magique' ? aa.magique : aa.contact);
        var dm = COF.UI.dmgArme(C, w);
        COF.UI.jet({
          titre: w.nom, sousTitre: (w.type === 'distance' ? 'Attaque à distance' : 'Attaque au contact') +
            ' · DM ' + dm, mod: att, critMin: w.crit || 20,
          dmg: dm, dmgLabel: 'Dommages', ctx: K.ctx(C), type: 'attaque'
        });
        break;
      }
      case 'arme-transfert': ouvrirTransfert('arme', +i); break;
      case 'arme-suppr': C.armes.splice(+i, 1); sauver(); rendre(); break;

      case 'obj-ajout': {
        var nom = prompt('Nom de l\'objet :');
        if (nom) { C.inventaire.push({ nom: nom, qte: 1 }); sauver(); rendre(); }
        break;
      }
      case 'obj-suppr': {
        var oSuppr = C.inventaire[+i];
        if (oSuppr && oSuppr.equipe && oSuppr.def) {
          C.bonus = C.bonus || {};
          C.bonus.def = (C.bonus.def || 0) - oSuppr.def;
        }
        C.inventaire.splice(+i, 1); sauver(); rendre();
        break;
      }
      case 'obj-transfert': ouvrirTransfert('objet', +i); break;

      case 'obj-attaquer': {
        var oi = C.inventaire[+i];
        if (!oi || !oi.dmg) break;
        var aa2 = K.attaques(C);
        var wTmp = { type: oi.armeType || 'contact', dm: oi.dmg, noFor: oi.noFor };
        var att2 = wTmp.type === 'distance' ? aa2.distance : (wTmp.type === 'magique' ? aa2.magique : aa2.contact);
        var dmReel = COF.UI.dmgArme(C, wTmp);
        COF.UI.jet({
          titre: oi.nom, sousTitre: (wTmp.type === 'distance' ? 'Attaque à distance' : 'Attaque au contact') +
            ' · DM ' + dmReel, mod: att2, dmg: dmReel, dmgLabel: 'Dommages', ctx: K.ctx(C), type: 'attaque'
        });
        break;
      }

      case 'obj-equiper': {
        var oe = C.inventaire[+i];
        if (!oe || !oe.def) break;
        C.bonus = C.bonus || {};
        oe.equipe = !oe.equipe;
        C.bonus.def = (C.bonus.def || 0) + (oe.equipe ? oe.def : -oe.def);
        sauver(); rendre();
        break;
      }
    }
  }

  return { init: init, rendre: rendre };
})();
