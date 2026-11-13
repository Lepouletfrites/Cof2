/* ============================================================
   COF2 Compagnon — La légende du héros (mode aventure)
   Ce que fait le héros le transforme :
   - des habitudes deviennent des talents (une action réussie souvent
     donne +1, puis +2 à ce même test) ;
   - les coups durs laissent des cicatrices ;
   - les exploits valent des surnoms (« le Fléau des loups »,
     « l'Amie des nains »…), que les gens répètent sur son passage.
   ============================================================ */
window.COF = window.COF || {};

COF.Legende = (function () {
  function p(l) { return l[Math.floor(Math.random() * l.length)]; }
  function T() { return COF.Conteur; }
  function M() { return COF.Monde; }
  function maj(t) { return t ? t.charAt(0).toUpperCase() + t.slice(1) : t; }

  function etat(c) {
    var l = c.legende = c.legende || {};
    l.n = l.n || {}; l.victoires = l.victoires || {}; l.cicatrices = l.cicatrices || []; l.surnoms = l.surnoms || []; l.talents = l.talents || {};
    l.trophees = l.trophees || [];
    return l;
  }
  function fem(c) { var h = T() && T().heros(c); return !!(h && h.genre === 'féminin'); }

  /* ================= Talents nés de l'habitude ================= */
  var SEUIL = 4, SEUIL2 = 10;
  var NOMS = {
    escalader: ['Grimpeur', 'Grimpeuse'], soudoyer: ['Main généreuse', 'Main généreuse'], intimider: ['Regard qui glace', 'Regard qui glace'],
    ombre: ['Ombre parmi les ombres', 'Ombre parmi les ombres'], pisteAnimal: ['Pisteur', 'Pisteuse'], ruse: ['Fin renard', 'Fine mouche'],
    instinct: ['Sixième sens', 'Sixième sens'], prier: ['Fidèle écouté', 'Fidèle écoutée'], raccourci: ['Coureur des chemins', 'Coureuse des chemins'],
    eclaireur: ['Œil de l’avant-garde', 'Œil de l’avant-garde'], gue: ['Passeur de rivières', 'Passeuse de rivières'], ecouter: ['Oreille fine', 'Oreille fine'],
    inscriptions: ['Lettré des ruines', 'Lettrée des ruines'], sonder: ['Pied prudent', 'Pied prudent'], basQuartiers: ['Enfant des ruelles', 'Enfant des ruelles'],
    recouper: ['Fin limier', 'Fine limière']
  };
  var PAR_CARAC = { FOR: 'Bras de fer', AGI: 'Souple comme un chat', CON: 'Increvable', PER: 'Œil de lynx', CHA: 'Langue d’argent', INT: 'Esprit vif', VOL: 'Volonté de fer' };
  function nomAction(c, id) {
    var a = T().ACTIONS[id]; if (!a) return id;
    var n = a.nom;
    if (typeof n === 'function') { try { n = n(T().contexte(c, null)); } catch (e) { n = null; } }
    if (Array.isArray(n)) n = n[0];
    if (!n) return id;
    n = T().dire(String(n), T().contexte(c, null));
    return n.replace(/\{[^}]+\}/g, '').replace(/\s+/g, ' ').trim();
  }
  function nomTalent(c, id) {
    var a = T().ACTIONS[id] || {}, n = NOMS[id];
    return n ? n[fem(c) ? 1 : 0] : (PAR_CARAC[a.carac] || 'Habitude') + ' (' + nomAction(c, id) + ')';
  }
  /* « de un loup » → « d'un loup », « de le » → « du » */
  function de(x) {
    x = String(x || 'un adversaire');
    if (/^le /i.test(x)) return 'du ' + x.slice(3);
    if (/^les /i.test(x)) return 'des ' + x.slice(4);
    if (/^[aeiouyàâéèêîôûh]/i.test(x)) return 'd’' + x;
    return 'de ' + x;
  }
  /* Bonus de talent pour une action (0, +1 ou +2). */
  function bonus(c, id) { var t = c && c.legende && c.legende.talents[id]; return t ? t.niveau : 0; }
  /* Compte une action ; renvoie une note si un talent naît ou s'affine. */
  function action(c, id, reussi) {
    if (!id || !reussi || !T().ACTIONS[id] || T().ACTIONS[id].auto) return '';
    var l = etat(c); l.n[id] = (l.n[id] || 0) + 1;
    var t = l.talents[id];
    if (!t && l.n[id] >= SEUIL) { l.talents[id] = { niveau: 1, nom: nomTalent(c, id), jour: c.jour }; return '🌱 talent acquis : ' + l.talents[id].nom + ' (+1 à « ' + nomAction(c, id) + ' »)'; }
    if (t && t.niveau === 1 && l.n[id] >= SEUIL2) { t.niveau = 2; return '🌳 talent maîtrisé : ' + t.nom + ' (+2 à « ' + nomAction(c, id) + ' »)'; }
    return '';
  }

  /* ================= Cicatrices ================= */
  var CICATRICES = {
    combat: ['une longue balafre sur la joue, souvenir de {x}', 'une cicatrice en étoile sur l’épaule, laissée par {x}', 'trois marques parallèles sur l’avant-bras : les griffes de {x}',
      'une oreille entaillée, depuis le combat contre {x}', 'une raideur dans la jambe, qui rappelle {x} à chaque pas'],
    chute: ['un nez cassé qui ne s’est jamais tout à fait remis', 'une cicatrice pâle au front, souvenir d’une mauvaise chute', 'deux doigts qui ne plient plus tout à fait'],
    piege: ['une brûlure en forme de main sur le dos, souvenir d’un piège', 'une cheville qui craque depuis la fosse piégée', 'une cicatrice fine au cou, là où la lame du piège est passée'],
    autre: ['une mèche blanche apparue en une nuit', 'une cicatrice dont {h} ne parle jamais', 'un tremblement léger de la main gauche, certains soirs']
  };
  /* Laisse une cicatrice (au plus 6). Renvoie une note, ou ''. */
  function cicatrice(c, cause, x) {
    var l = etat(c); if (l.cicatrices.length >= 6) return '';
    var dejas = l.cicatrices.map(function (z) { return z.modele; });
    var liste = (CICATRICES[cause] || CICATRICES.autre).filter(function (t) { return dejas.indexOf(t) < 0; });
    if (!liste.length) liste = CICATRICES.autre;
    var m = p(liste), txt = m.replace(/de \{x\}/, de(x)).replace('{x}', x || 'un adversaire').replace('{h}', (T().heros(c) || {}).nom || 'le héros');
    l.cicatrices.push({ txt: txt, modele: m, jour: c.jour });
    return '🩹 cicatrice : ' + txt;
  }

  /* ================= Surnoms ================= */
  var PEUPLES = { nain: 'nains', elfehaut: 'elfes', elfesylvain: 'elfes', elfe: 'elfes', halfelin: 'halfelins', gnome: 'gnomes', demiorc: 'demi-orques', demiorque: 'demi-orques' };
  function pluriel(nom) {
    return String(nom || '').toLowerCase().replace(/\s*\(.*\)$/, '').split(/\s+/).map(function (w, i, t) {
      if (/^(de|du|des|d’|d'|la|le|les|à|aux)$/.test(w)) return w;
      if (i > 0 && /^(de|du|des|d’|d')$/.test(t[i - 1])) return w;   /* « loup des glaces » → « loups des glaces » */
      if (/[sxz]$/.test(w)) return w;
      if (/al$/.test(w)) return w.replace(/al$/, 'aux');
      if (/eau$/.test(w)) return w + 'x';
      return w + 's';
    }).join(' ');
  }
  function aSurnom(l, id) { return l.surnoms.some(function (s) { return s.id === id; }); }
  function donner(c, id, m, f) {
    var l = etat(c); if (aSurnom(l, id)) return '';
    var t = fem(c) ? f : m;
    l.surnoms.push({ id: id, txt: t, jour: c.jour });
    return '🏷️ nouveau surnom : « ' + maj(t) + ' »';
  }
  /* Vérifie les exploits et décerne les surnoms mérités. Renvoie des notes. */
  function verifier(c) {
    var l = etat(c), out = [], total = 0;
    Object.keys(l.victoires).forEach(function (k) {
      total += l.victoires[k];
      if (l.victoires[k] >= 3) out.push(donner(c, 'fleau-' + k, 'le Fléau des ' + pluriel(k), 'la Fléau des ' + pluriel(k)));
    });
    if (total >= 10) out.push(donner(c, 'veteran', 'le Vétéran aux cent combats', 'la Vétérane aux cent combats'));
    if (l.cicatrices.length >= 3) out.push(donner(c, 'balafre', 'le Balafré', 'la Balafrée'));
    if (Object.keys(l.talents).length >= 3) out.push(donner(c, 'touche', 'le Touche-à-tout', 'la Touche-à-tout'));
    (c.lieux || []).forEach(function (lv) {
      if (!lv.ville || (lv.ville.rep || 0) < 3) return;
      var pe = PEUPLES[lv.peuple || (lv.ville && lv.ville.peuple)];
      if (pe) out.push(donner(c, 'ami-' + pe, 'l’Ami des ' + pe, 'l’Amie des ' + pe));
      else out.push(donner(c, 'heros-' + lv.id, 'le Héros ' + T().formes(lv.nom).de, 'l’Héroïne ' + T().formes(lv.nom).de));
    });
    if (c.saga && c.saga.fini && !c.saga.amere) out.push(donner(c, 'sauveur', 'le Sauveur de la région', 'la Sauveuse de la région'));
    var nem = (c.pnj || []).filter(function (x) { return x.nemesis && x.vaincu; })[0];
    if (nem) out.push(donner(c, 'nemesis', 'celui qui a fait tomber ' + nem.nom, 'celle qui a fait tomber ' + nem.nom));
    return out.filter(Boolean);
  }
  function surnom(c) { var l = c && c.legende; return l && l.surnoms.length ? l.surnoms[l.surnoms.length - 1].txt : ''; }
  function titre(c) { var h = T().heros(c), s = surnom(c); return (h ? h.nom : 'Le héros') + (s ? ', ' + s : ''); }

  /* Une victoire contre des créatures (noms de la rencontre). */
  function victoire(c, noms) {
    var l = etat(c), vus = {};
    (noms || []).forEach(function (n) {
      var k = String(n || '').replace(/\s*\d+$/, '').replace(/\s*\(.*\)$/, '').trim(); if (!k || vus[k]) return;
      vus[k] = 1; l.victoires[k] = (l.victoires[k] || 0) + 1;
    });
  }

  /* À l'ouverture d'une scène, au village : on reconnaît le héros (de temps en temps). */
  function ouverture(c, ctx) {
    var s = surnom(c), ici = M().ici(c); if (!s || !ici || !ici.ville || Math.random() > 0.15) return '';
    return T().dire(['Sur le passage de {h}, quelqu’un chuchote : « C’est {sn} ! » Les têtes se tournent.', 'Un enfant tire la manche de sa mère : « Regarde, c’est {sn} ! »',
      'Au comptoir, on raconte déjà les exploits de {sn}… sans savoir que {h} écoute.'], Object.assign({}, ctx, { sn: s }));
  }
  return { donner: donner, de: de, etat: etat, bonus: bonus, action: action, cicatrice: cicatrice, verifier: verifier, surnom: surnom, titre: titre, victoire: victoire, ouverture: ouverture, pluriel: pluriel };
})();
