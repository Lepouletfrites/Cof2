/* ============================================================
   COF2 Compagnon — Chronique : le récit en texte continu
   Transforme une scène, ou toute une aventure, en un texte à lire,
   copier ou télécharger : les paragraphes racontés se suivent, sans
   la mécanique (dés, jauges). Les scènes jouées « à la main »
   gardent toutes leurs entrées.
   ============================================================ */
window.COF = window.COF || {};

COF.Chronique = (function () {
  function K() { return COF.Carnet; }
  var TRAIT = '────────────────────────';

  function premierParagraphe(t) { return String(t || '').split(/\n\s*\n/)[0].trim(); }
  /* Une entrée en texte de récit (null = rien à raconter). */
  function entree(e, seule) {
    if (e.t === 'recit') {
      if (e.rappel && !seule) return null;
      return e.txt;
    }
    if (e.t === 'texte') return e.txt;
    if (e.t === 'rencontre') return e.r ? 'Rencontre : ' + e.r.texte + '. ' + (e.r.reactionTexte || '') + (e.r.fin ? ' Issue : ' + e.r.fin + '.' : '') : null;
    if (e.t === 'note') {
      if (/Récit du combat/.test(e.titre || '')) return premierParagraphe(e.txt);
      if (/^Combat$/.test(e.titre || '')) return null;
      return (e.titre ? e.titre + ' — ' : '') + e.txt;
    }
    if (e.t === 'evt') return '❖ ' + e.txt;
    if (e.t === 'detail') return e.txt;
    return null;
  }
  /* Texte d'une scène. seule : exportée seule (on garde le rappel). */
  function scene(c, s, seule) {
    var L = [];
    L.push('Chapitre ' + s.n + ' — ' + s.titre);
    L.push('Jour ' + (s.jour || 1));
    L.push('');
    var joue = !!s.jeu || s.entrees.some(function (e) { return e.t === 'recit'; });
    s.entrees.forEach(function (e) {
      var t = joue ? entree(e, seule) : (e.t === 'muse' ? null : K().texteEntree(e));
      if (t) L.push(String(t).trim(), '');
    });
    if (!joue && s.close && s.resume) L.push(s.resume, '');
    return L.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  }
  /* Texte complet de l'aventure : toutes les scènes qui se suivent. */
  function aventure(c) {
    var p = c.persoId && COF.Store ? COF.Store.get(c.persoId) : null, L = [];
    L.push(TRAIT, c.titre.toUpperCase(), TRAIT);
    if (c.campagne) L.push('Campagne « ' + c.campagne.nom + ' » — chapitre ' + c.campagne.numero);
    if (p) L.push('Avec ' + p.nom + (p.niveau ? ', niveau ' + p.niveau : ''));
    if (c.saga) L.push('La menace : ' + c.saga.nom);
    L.push('');
    if (c.precedent && c.precedent.epilogue) L.push('Ce qui s’est passé avant : ' + c.precedent.epilogue, '');
    c.scenes.forEach(function (s) { L.push(TRAIT, scene(c, s, false), ''); });
    if (c.termine) {
      L.push(TRAIT, 'ÉPILOGUE', '', c.termine.epilogue);
      if (c.termine.niveau) L.push('', (p ? p.nom : 'Le héros') + ' atteint le niveau ' + c.termine.niveau + '.');
    }
    return L.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
  }
  /* ================= Le livre : l'histoire racontée, chapitre par chapitre ================= */
  var ROMAINS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];
  function romain(n) { return ROMAINS[n - 1] || String(n); }
  var MARQUANT = /^(🏆|🩹|🏷️|☠️|🏘️|✉️|💢|🗣️|🪤|✨|🌱|🌳|🎉)/;
  function nettoyer(t) { return String(t || '').replace(/\s+/g, ' ').trim(); }
  /* Les moments d'une scène : ouverture, temps forts, dénouement. */
  function moments(s) {
    var out = [], es = s.entrees || [];
    var ouv = es.filter(function (e) { return e.t === 'recit' && !e.rappel && !e.fin; })[0];
    if (ouv) out.push(nettoyer(ouv.txt));
    es.forEach(function (e) {
      if (e.t === 'note' && /Récit du combat/.test(e.titre || '')) out.push(nettoyer(premierParagraphe(e.txt)));
      else if (e.t === 'evt' && MARQUANT.test(e.txt || '')) out.push(nettoyer(e.txt));
    });
    var fin = s.jeu && s.jeu.resume ? s.jeu.resume : (s.resume || '');
    if (fin) out.push(nettoyer(fin));
    if (!out.length) { var t = es.filter(function (e) { return e.t === 'texte'; })[0]; if (t) out.push(nettoyer(t.txt)); }
    return out.filter(Boolean);
  }
  function livre(c) {
    var p = c.persoId && COF.Store ? COF.Store.get(c.persoId) : null, chapitres = [], cur = null;
    function nouveau(titre, jour) { cur = { titre: titre, debut: jour, fin: jour, scenes: [] }; chapitres.push(cur); }
    c.scenes.forEach(function (s) {
      if (s.type === 'voyage' && s.voyage) nouveau('La route ' + (COF.Conteur ? COF.Conteur.formes(s.voyage.destNom).de : 'de ' + s.voyage.destNom), s.jour || 1);
      else if (!cur) nouveau(c.precedent ? 'Le retour' : 'Les débuts', s.jour || 1);
      var m = moments(s); if (!m.length) return;
      cur.fin = Math.max(cur.fin, s.jour || 1);
      cur.scenes.push({ titre: s.titre, jour: s.jour || 1, paras: m, issue: s.jeu ? s.jeu.fini : null });
    });
    chapitres = chapitres.filter(function (ch) { return ch.scenes.length; });
    chapitres.forEach(function (ch, i) { ch.n = romain(i + 1); });
    var lg = c.legende || {};
    var gens = (c.pnj || []).filter(function (x) { return x.attitude === 'allié' || x.attitude === 'hostile' || x.nemesis || x.mort || (x.compagnon && x.compagnon.actif) || (x.vie && x.vie.length); })
      .map(function (x) {
        return { nom: x.nom, role: x.mort ? 'disparu' + (x.genre === 'féminin' ? 'e' : '') : x.nemesis ? 'ennemi juré' : (x.compagnon && x.compagnon.actif) ? 'compagnon de route' : x.attitude,
          titre: x.titre || '', vie: (x.vie || []).map(function (v) { return 'Jour ' + v.jour + ' : ' + v.txt; }) };
      });
    return {
      titre: c.titre, heros: p ? p.nom : 'Le héros', surnom: COF.Legende ? COF.Legende.surnom(c) : '', niveau: p ? p.niveau : null, jour: c.jour,
      menace: c.saga ? c.saga.nom : '', avant: c.precedent && c.precedent.epilogue ? c.precedent.epilogue : '', chapitres: chapitres, gens: gens,
      surnoms: (lg.surnoms || []).map(function (s) { return s.txt; }), cicatrices: (lg.cicatrices || []).map(function (s) { return s.txt; }),
      talents: Object.keys(lg.talents || {}).map(function (k) { return lg.talents[k].nom + (lg.talents[k].niveau > 1 ? ' (maîtrisé)' : ''); }),
      trophees: (lg.trophees || []).map(function (s) { return s.txt; }),
      enCours: (c.fils || []).filter(function (f) { return f.ouvert; }).map(function (f) { return f.nom; }).slice(0, 8),
      epilogue: c.termine ? c.termine.epilogue : ''
    };
  }
  function livreTexte(c) {
    var b = livre(c), L = [];
    L.push(TRAIT, b.titre.toUpperCase(), 'Chronique de ' + b.heros + (b.surnom ? ', ' + b.surnom : ''), TRAIT, '');
    if (b.avant) L.push('Ce qui s’est passé avant : ' + b.avant, '');
    b.chapitres.forEach(function (ch) {
      L.push('Chapitre ' + ch.n + ' — ' + ch.titre + ' (' + (ch.debut === ch.fin ? 'jour ' + ch.debut : 'jours ' + ch.debut + ' à ' + ch.fin) + ')', '');
      ch.scenes.forEach(function (s) { L.push(s.paras.join(' '), ''); });
    });
    if (b.epilogue) L.push(TRAIT, 'ÉPILOGUE', '', b.epilogue, '');
    if (b.gens.length) { L.push(TRAIT, 'CEUX QUI ONT CROISÉ SA ROUTE'); b.gens.forEach(function (g) { L.push('• ' + g.nom + ' — ' + g.role + (g.titre ? ', ' + g.titre : '')); g.vie.forEach(function (v) { L.push('    ' + v); }); }); L.push(''); }
    if (b.surnoms.length || b.cicatrices.length || b.talents.length || b.trophees.length) {
      L.push(TRAIT, 'SA LÉGENDE');
      if (b.surnoms.length) L.push('On l’appelle : ' + b.surnoms.join(', ') + '.');
      if (b.talents.length) L.push('Talents : ' + b.talents.join(', ') + '.');
      if (b.cicatrices.length) L.push('Cicatrices : ' + b.cicatrices.join(' ; ') + '.');
      if (b.trophees.length) L.push('Trophées : ' + b.trophees.join(' ; ') + '.');
      L.push('');
    }
    if (b.enCours.length && !b.epilogue) L.push(TRAIT, 'À SUIVRE', b.enCours.map(function (n) { return '• ' + n; }).join('\n'));
    return L.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
  }
  return { scene: scene, aventure: aventure, livre: livre, livreTexte: livreTexte };
})();
