/* ============================================================
   COF2 Compagnon — Moteur de dés
   Gère : d20 (dé bonus / dé malus), critiques, dés évolutifs d4°,
   formules de dommages avec caractéristiques.
   ============================================================ */
window.COF = window.COF || {};

COF.Dice = (function () {

  function d(faces) { return 1 + Math.floor(Math.random() * faces); }

  /* ---------- Test d20 ----------
     opts : { mod, bonus, malus, difficulte, critMin }
     retour : { des:[], garde, mod, total, crit, fumble, reussite }        */
  function test(opts) {
    opts = opts || {};
    var bonus = !!opts.bonus, malus = !!opts.malus;
    if (bonus && malus) { bonus = false; malus = false; }  // ils s'annulent
    var des = [d(20)];
    if (bonus || malus) des.push(d(20));
    var garde = des[0];
    if (bonus) garde = Math.max.apply(null, des);
    if (malus) garde = Math.min.apply(null, des);

    var mod = opts.mod || 0;
    var critMin = opts.critMin || 20;
    var res = {
      type: 'test',
      des: des, garde: garde, mod: mod,
      total: garde + mod,
      bonus: bonus, malus: malus,
      crit: garde >= critMin,
      fumble: garde === 1,
      difficulte: (typeof opts.difficulte === 'number') ? opts.difficulte : null
    };
    if (res.difficulte !== null) {
      res.reussite = res.crit || (!res.fumble && res.total >= res.difficulte);
    }
    return res;
  }

  /* ---------- Formules de dommages ----------
     Exemples acceptés : "1d8+FOR"  "2d4°+INT"  "3d4°"  "1d6+2"  "1d4°+rang"
     ctx : { carac:{FOR:2,...}, niveau:3, rang:2, deEvo:4 }                 */
  function parse(formule, ctx) {
    ctx = ctx || {};
    var deEvo = ctx.deEvo || 4;
    var termes = [];
    var s = String(formule).replace(/\s+/g, '');
    var re = /([+-]?)([^+-]+)/g, m;
    while ((m = re.exec(s)) !== null) {
      var signe = m[1] === '-' ? -1 : 1;
      var t = m[2];
      var dm = t.match(/^(\d*)d(\d+|4°)$/i) || t.match(/^(\d*)d(4)°$/i);
      if (/^(\d*)d(\d+)°$/i.test(t)) {
        var mm = t.match(/^(\d*)d(\d+)°$/i);
        termes.push({ type: 'de', nb: parseInt(mm[1] || '1', 10), faces: deEvo, evo: true, signe: signe });
      } else if (/^(\d*)d(\d+)$/i.test(t)) {
        var mf = t.match(/^(\d*)d(\d+)$/i);
        termes.push({ type: 'de', nb: parseInt(mf[1] || '1', 10), faces: parseInt(mf[2], 10), signe: signe });
      } else if (/^\d+$/.test(t)) {
        termes.push({ type: 'fixe', val: parseInt(t, 10), signe: signe, label: t });
      } else if (/^(FOR|AGI|CON|PER|CHA|INT|VOL)$/i.test(t)) {
        var k = t.toUpperCase();
        termes.push({ type: 'fixe', val: (ctx.carac && ctx.carac[k]) || 0, signe: signe, label: k });
      } else if (/^rang$/i.test(t)) {
        termes.push({ type: 'fixe', val: ctx.rang || 0, signe: signe, label: 'rang' });
      } else if (/^niveau$/i.test(t)) {
        termes.push({ type: 'fixe', val: ctx.niveau || 1, signe: signe, label: 'niveau' });
      }
    }
    return termes;
  }

  /* Lance une formule. opts : { crit:bool, bonusDes:[formules non doublées] } */
  function dommages(formule, ctx, opts) {
    opts = opts || {};
    var termes = parse(formule, ctx);
    var detail = [], total = 0;
    termes.forEach(function (t) {
      if (t.type === 'de') {
        var jets = [];
        for (var i = 0; i < t.nb; i++) jets.push(d(t.faces));
        var somme = jets.reduce(function (a, b) { return a + b; }, 0);
        total += t.signe * somme;
        detail.push({ label: t.nb + 'd' + t.faces + (t.evo ? '°' : ''), jets: jets, val: t.signe * somme });
      } else {
        total += t.signe * t.val;
        detail.push({ label: t.label, val: t.signe * t.val });
      }
    });
    var base = total;
    if (opts.crit) total = total * 2;              // critique : DM doublés
    if (total < 1) total = 1;                       // minimum 1 DM
    return {
      type: 'dm', formule: formule, detail: detail,
      base: base, crit: !!opts.crit, total: total
    };
  }

  /* Lancer libre : "2d6+3", "1d20", "4d4°" */
  function libre(formule, ctx) {
    return dommages(formule, ctx || {}, {});
  }

  return { d: d, test: test, dommages: dommages, libre: libre, parse: parse };
})();
