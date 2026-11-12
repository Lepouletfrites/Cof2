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
  return { scene: scene, aventure: aventure };
})();
