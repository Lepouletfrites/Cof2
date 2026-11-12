/* ============================================================
   COF2 Compagnon — Conséquences qui durent (mode aventure)
   Les actes marquants du héros sont notés (un PNJ menacé, une dette,
   un village sauvé ou abandonné, une tricherie démasquée…) et
   ressurgissent quelques jours plus tard à l'ouverture d'une scène :
   vengeance, réclamation, gratitude, mauvaise réputation, fête en
   l'honneur du héros.
   ============================================================ */
window.COF = window.COF || {};

COF.Echos = (function () {
  function p(l) { return l[Math.floor(Math.random() * l.length)]; }
  function T() { return COF.Conteur; }
  function M() { return COF.Monde; }

  /* Pour chaque type : où il peut ressurgir, délai, récits possibles (texte + codes d'effets). */
  var TYPES = {
    rancune: { ic: '💢', lib: 'Rancune de {x}', delai: 2, partout: 0.35,
      suites: [
        { txt: ['{x}, que {h} avait menacé{xe} au jour {j}, n’a pas oublié : deux gros bras l’attendent au détour d’un chemin.', 'Une pierre siffle aux oreilles de {h}. Au loin, {x} s’enfuit en ricanant : la rancune du jour {j} n’est pas éteinte.'], codes: ['pv-', 'danger'] },
        { txt: ['Des rumeurs malveillantes précèdent {h} : {x} a raconté partout ce qui s’est passé au jour {j}.', '{x} a fait courir le bruit que {h} était un danger public. Les portes se ferment.'], codes: ['rep-', 'tension+'] },
        { txt: ['La bourse de {h} est soudain bien légère : un voleur payé par {x}, sans doute.', 'Un gamin bouscule {h} et disparaît. La bourse aussi. Dans la foule, {x} sourit.'], codes: ['po-'] }
      ] },
    dette: { ic: '🪙', lib: 'Dette envers {x}', delai: 3, partout: 0.3,
      suites: [
        { txt: ['{x} retrouve {h} : « Tu te souviens du service rendu au jour {j} ? Il est temps de rembourser. »', 'Un messager de {x} vient rappeler à {h} sa dette du jour {j}.'], codes: ['po-'], rembourse: true },
        { txt: ['{x} a besoin d’aide à son tour, et ne se gêne pas pour le rappeler à {h}.'], codes: ['rumeur'], fil: 'Rendre service à {x}' }
      ] },
    gratitude: { ic: '💛', lib: 'Gratitude à {l}', delai: 1, partout: 0,
      suites: [
        { txt: ['À {l}, on n’a pas oublié l’affaire du jour {j} : l’aubergiste refuse que {h} paie son repas.', 'Une vieille femme de {l} serre les mains de {h} : « Merci, pour le jour {j}. » Elle insiste pour lui offrir un remède.'], codes: ['pv+'] },
        { txt: ['Les gens de {l} ont fait une collecte pour remercier {h} de son aide au jour {j}.'], codes: ['po+'] },
        { txt: ['Reconnaissant, quelqu’un de {l} glisse un renseignement à {h}.', '« Tu nous as aidés, à notre tour », souffle un habitant de {l}, avant de confier un secret.'], codes: ['indice', 'rumeur'] }
      ] },
    rancoeur: { ic: '😠', lib: 'Rancœur à {l}', delai: 1, partout: 0,
      suites: [
        { txt: ['À {l}, on n’a pas pardonné à {h} l’affaire laissée en plan au jour {j}. Les regards sont lourds.', '« C’est à cause de toi, ce qui est arrivé ! » crie quelqu’un de {l} sur le passage de {h}.'], codes: ['rep-', 'tension+'] },
        { txt: ['Un marchand de {l} reconnaît {h} et double ses prix « pour la peine ».'], codes: ['po-petit'] }
      ] },
    tricheur: { ic: '🃏', lib: 'Tricheur démasqué à {l}', delai: 1, partout: 0,
      suites: [
        { txt: ['La garde de {l} n’a pas oublié la partie de cartes du jour {j}. Une amende, et vite.', '« Encore toi, le tricheur ? » Un garde de {l} confisque quelques pièces à {h}.'], codes: ['po-', 'fac-garde'] },
        { txt: ['Le joueur volé au jour {j} attend {h} avec des amis. Mauvaise rencontre.'], codes: ['pv-', 'danger'] }
      ] },
    sauve: { ic: '🕊️', lib: '{x} doit la vie à {h}', delai: 2, partout: 0.4,
      suites: [
        { txt: ['{x}, que {h} avait aidé{xe} au jour {j}, réapparaît au bon moment avec de précieuses informations.', 'Un signe de {x} : un message glissé sous la porte, avec un renseignement utile.'], codes: ['indice', 'rumeur'] },
        { txt: ['{x} n’a pas oublié le jour {j} : un petit cadeau attend {h}.'], codes: ['po+'] }
      ] }
  };

  function liste(c) { return c.echos = c.echos || []; }
  /* Note un acte marquant (sans doublon pour la même cible le même jour). */
  function noter(c, type, o) {
    if (!TYPES[type]) return;
    o = o || {};
    var l = liste(c);
    if (l.some(function (e) { return !e.fait && e.type === type && e.pnjId === o.pnjId && e.lieuId === o.lieuId; })) return;
    var ici = M().ici(c);
    l.push({ type: type, jour: c.jour, pnjId: o.pnjId || null, nom: o.nom || '', lieuId: o.lieuId || (ici ? ici.id : null), fait: false });
    if (l.length > 40) c.echos = l.filter(function (e) { return !e.fait; }).slice(-30);
  }
  function pnj(c, id) { return (c.pnj || []).filter(function (x) { return x.id === id; })[0] || null; }
  function libelle(c, e) {
    var x = pnj(c, e.pnjId), l = M().lieu(c, e.lieuId);
    return TYPES[e.type].ic + ' ' + TYPES[e.type].lib.replace('{x}', x ? x.nom : (e.nom || 'quelqu’un')).replace('{l}', l ? l.nom : 'un village') + ' (jour ' + e.jour + ')';
  }
  /* Une conséquence ressurgit-elle ? Renvoie { txt, m } ou null. */
  function reveiller(c, s, ctx) {
    var ici = M().ici(c), x0;
    /* le héros adulé : une fête en son honneur (une fois par village) */
    if (ici && ici.ville && (ici.ville.rep || 0) >= 3 && !ici.ville.fete && Math.random() < 0.6) {
      ici.ville.fete = c.jour;
      var rf = COF.Imprevus.appliquer(c, s, ['pv+', 'po+', 'tension-'], ctx, { v: {} });
      return { txt: T().dire(['Les gens de {l} ont préparé une fête en l’honneur de {h} : musique, banquet, et des enfants qui rejouent ses exploits avec des épées de bois.', 'À {l}, on accueille {h} en héros. Le notable lève son verre : « À celui qui nous a sauvés ! »'], Object.assign({}, ctx, { l: ici.nom })), m: '🎉 fête en l’honneur du héros · ' + (rf.m || ''), ok: true };
    }
    if (Math.random() > 0.35) return null;
    var cand = liste(c).filter(function (e) {
      if (e.fait || c.jour - e.jour < TYPES[e.type].delai) return false;
      var x = e.pnjId ? pnj(c, e.pnjId) : null;
      if (e.pnjId && (!x || (x.compagnon && x.compagnon.actif))) return false;
      if (s && s.dialogue && s.dialogue.pnjId === e.pnjId) return false;
      if (ici && e.lieuId === ici.id) return true;
      return Math.random() < TYPES[e.type].partout;
    });
    if (!cand.length) return null;
    var e = p(cand), tp = TYPES[e.type], su = p(tp.suites), x = e.pnjId ? pnj(c, e.pnjId) : null, l = M().lieu(c, e.lieuId);
    var cx = Object.assign({}, ctx, { x: x ? x.nom : (e.nom || 'quelqu’un'), l: l ? l.nom : 'là-bas', j: e.jour, xe: x && x.genre === 'féminin' ? 'e' : '' });
    e.fait = true; e.quand = c.jour;
    var codes = su.codes.slice(), m = [];
    /* une dette se rembourse si l'on peut, sinon la relation s'abîme */
    if (su.rembourse) {
      var h = T().heros(c);
      if (!h || !h.bourse || !h.bourse.po) { codes = []; if (x) { x.rel = Math.max(-3, (x.rel || 0) - 1); m.push('💢 ' + x.nom + ' : pas de quoi rembourser'); } }
    }
    if (codes.length) { var r = COF.Imprevus.appliquer(c, s, codes, cx, { v: {} }); if (r.m) m.push(r.m); }
    if (su.fil) { var nf = T().polir(T().ex(su.fil, cx)); COF.Carnet.ajouterListe(c, 'fils', { nom: nf, note: 'Une dette contractée au jour ' + e.jour + '.' }); m.push('🧵 ' + nf); }
    /* une rancune qui ressurgit deux fois fait de ce PNJ une némésis */
    if (e.type === 'rancune' && x) { x.vus = (x.vus || 0) + 1; x.rel = Math.min(x.rel || 0, -2); x.attitude = 'hostile'; if (x.vus >= 2 && !x.nemesis) { x.nemesis = true; m.push('☠️ ' + x.nom + ' devient la némésis du héros'); } }
    if (e.type === 'rancune' && x && Math.random() < 0.5) noter(c, 'rancune', { pnjId: x.id, lieuId: e.lieuId });   /* et ce n'est peut-être pas fini */
    return { txt: T().dire(su.txt, cx), m: (tp.ic + ' conséquence du jour ' + e.jour + (m.length ? ' · ' + m.join(' · ') : '')), ok: ['gratitude', 'sauve'].indexOf(e.type) >= 0 };
  }
  function enAttente(c) { return liste(c).filter(function (e) { return !e.fait; }); }
  function souvenirs(c) { return liste(c).filter(function (e) { return e.fait; }).slice(-6); }
  return { TYPES: TYPES, noter: noter, reveiller: reveiller, enAttente: enAttente, souvenirs: souvenirs, libelle: libelle };
})();
