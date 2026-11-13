/* ============================================================
   COF2 Compagnon — La tension, décidée par le récit
   À la fin d'une scène, ce n'est plus le joueur qui dit si le héros
   « a gardé la main » : le système regarde ce qui s'est passé et
   ajuste la tension (de −2 à +2), avec ses raisons.
   - l'issue de la scène (objectif atteint ou non) ;
   - la part de réussites et d'échecs des actions ;
   - le danger : a-t-il éclaté (revers, combat imposé) ou est-il resté bas ;
   - les combats : victoire, fuite, défaite ;
   - le genre de scène : un vrai repos apaise, une boutique ne change rien.
   ============================================================ */
window.COF = window.COF || {};

COF.Tension = (function () {
  var NEUTRES = ['echoppe', 'logis'];
  var APAISANTES = ['repos'];

  function compter(s) {
    var n = { ok: 0, ko: 0, crit: 0, fumble: 0, revers: 0, victoire: 0, fuite: 0, defaite: 0 };
    (s.entrees || []).forEach(function (e) {
      if (e.t === 'recit' && !e.rappel && !e.fin && !e.evt && e.m) {
        if (/^danger au maximum/.test(e.m)) { n.revers++; return; }
        if (e.ok === true) n.ok++; else if (e.ok === false) n.ko++;
        if (e.v === 'crit') n.crit++; if (e.v === 'fumble') n.fumble++;
      }
      if (e.t === 'jet') { if (e.reussite) n.ok++; else n.ko++; }
      if (e.t === 'note' && /^Victoire$/.test(e.titre || '')) n.victoire++;
      if (e.t === 'note' && /^Fuite$/.test(e.titre || '')) n.fuite++;
      if (e.t === 'evt' && /Le héros tombe/.test(e.txt || '')) n.defaite++;
      if (e.t === 'rencontre' && e.r && e.r.fin) {
        if (/Victoire/.test(e.r.fin)) n.victoire++;
        else if (/échappé|Fuite/i.test(e.r.fin)) n.fuite++;
        else if (/Défaite/.test(e.r.fin)) n.defaite++;
      }
    });
    return n;
  }
  /* Ce que la scène fait à la tension : { delta, raisons } (sans rien modifier). */
  function evaluer(c, s) {
    var out = { delta: 0, raisons: [] };
    if (!s) return out;
    if (NEUTRES.indexOf(s.type) >= 0 || s.echoppe && !s.jeu) { out.raisons.push('une visite sans enjeu'); return out; }
    var j = s.jeu, n = compter(s), d = 0, R = out.raisons;
    var genre = j ? j.genre : s.type;
    if (APAISANTES.indexOf(genre) >= 0 || (s.loisir && s.loisir.nuit && (!j || j.fini === 'reussite'))) { d -= 1; R.push(genre === 'repos' ? 'un vrai moment de répit' : 'une nuit tranquille'); }
    else if (j && j.fini) {
      if (j.fini === 'reussite') { d -= 1; R.push('l’objectif est atteint'); }
      else { d += 1; R.push('la situation a échappé au héros'); }
      /* une réussite nette : sans échec et sans que le danger monte */
      if (j.fini === 'reussite' && !n.ko && !n.revers && (j.danger || 0) === 0 && n.ok >= 1) { d -= 1; R.push('sans le moindre accroc'); }
      /* le danger a éclaté en cours de route */
      if (n.revers || j.menace) { d += 1; R.push('le danger a éclaté'); }
      else if (j.fini === 'reussite' && j.dangerMax && j.danger >= j.dangerMax - 1 && n.ko >= 2) { R.push('mais de justesse'); d += 1; }
    } else {
      /* scène jouée à la main : le bilan des jets et des combats */
      if (n.ok > n.ko) { d -= 1; R.push('plus de réussites que d’échecs'); }
      else if (n.ko > n.ok) { d += 1; R.push('plus d’échecs que de réussites'); }
    }
    if (n.fumble >= 2) { d += 1; R.push('des maladresses en série'); }
    if (n.crit >= 2 && d > -2) { d -= 1; R.push('des coups d’éclat'); }
    if (n.defaite) { d += 1; R.push('une défaite au combat'); }
    else if (n.fuite) { R.push('une fuite'); if (d < 1) d += 1; }
    else if (n.victoire && !(j && j.fini === 'reussite')) { d -= 1; R.push('une victoire au combat'); }
    /* conversations et loisirs pèsent moins */
    if ((genre === 'dialogue' || genre === 'loisir') && Math.abs(d) > 1) d = d > 0 ? 1 : -1;
    out.delta = Math.max(-2, Math.min(2, d));
    if (!R.length) R.push('rien de décisif');
    return out;
  }
  function texte(av, ap, ev) {
    var sens = ap > av ? '📈 La tension monte' : ap < av ? '📉 La tension retombe' : '🌡️ La tension ne bouge pas';
    return sens + ' (' + av + ' → ' + ap + ') : ' + ev.raisons.join(', ') + '.';
  }
  /* Aperçu, pour la fiche de fin de scène. */
  function apercu(c, s) { var ev = evaluer(c, s), ap = Math.max(1, Math.min(9, c.tension + ev.delta)); return { ev: ev, apres: ap, texte: texte(c.tension, ap, ev) }; }
  return { evaluer: evaluer, apercu: apercu, texte: texte, compter: compter };
})();
