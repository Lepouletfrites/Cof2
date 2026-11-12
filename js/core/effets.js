/* ============================================================
   COF2 Compagnon — Effets des voies (moteur unique)
   Lit le texte de chaque capacité acquise et en tire les bonus
   chiffrés, avec leur progression par rang et leurs conditions :
     att (contact / distance / magique), dm, def, init,
     carac (+1 en CON…), debonus (dé bonus aux tests de CON…),
     test (+N aux tests de PER…), pv, pm, rd (réduction des DM),
     caracAjout (« ajoute son CHA en Initiative »).
   - Sans condition : compté d'office (décochable sur la fiche, au cas où
     le joueur l'avait déjà reporté à la main).
   - Conditionnel (avec un bouclier, en selle, 1×/combat…) : à cocher
     quand la condition est remplie.
   Les choix sont gardés sur le personnage (p.effetsVoies).
   Utilisé par la fiche (Calc : DEF, Init., attaques, PV, PM,
   caractéristiques), l'Arène (DM, attaques) et les jets (tests).
   Les bonus de compétence (« ajoute rang + 2 à ces tests ») restent
   gérés par Calc.competences.
   ============================================================ */
window.COF = window.COF || {};

COF.Effets = (function () {
  var CARACS = ['FOR', 'AGI', 'CON', 'PER', 'CHA', 'INT', 'VOL'];
  /* phrase conditionnelle */
  /* (?:^|[^lettre]) au lieu de \\b : \\b ignore les lettres accentuées (« à l'arc »). */
  var COND = new RegExp('(?:^|[^\\wÀ-ÿ])(?:si|avec|sans|quand|en selle|à cheval|dans ces conditions|dans un|dans une|dans les|contre|sur un|sur une|une fois|choisit|choisir|au choix|catégorie|prédilection|' +
    'des armes à|des dagues|à deux mains|monture|navire|ennemi juré|proie|en terrain|en forêt|sous terre|la nuit|de nuit|au contact d|en milieu|pendant|après|avant|' +
    'chargée|en main|en mer|au premier round|en combat de masse|selon|pour une capacité|ces armes|bouclier|une option|option|à l[\'’]arc|arbalète|sabre|épée|hache|marteau|lance|dague|vivelame|bâton|arme de jet|armes de jet)(?![\\wÀ-ÿ])' +
    '|tant qu|lorsqu|jusqu|^\\s*(?!Au rang)[A-ZÉ][a-zéèêàù]+ ?: ', 'i');
  /* capacité activable ou liée à autre chose que le héros : jamais d'office */
  var ACTIVABLE = /×|par combat|par jour|pendant|en forme|forme d|\bPC\b|dépens|invoqu|appel|compagnon|loup|golem|familier|monture|animal|esprit de|rage|transe|furie|pour le round|ce round|au début du round|la cible|ses alliés|les alliés|un allié|tous les alliés|créature/i;

  /* « (+2 au rang 3, +3 au rang 5) » juste après le bonus (avant le bonus suivant). */
  function progression(texte, rang, val) {
    /* le bonus suivant (hors parenthèses) borne la recherche */
    var prochain = texte.replace(/\([^)]*\)/g, function (s) { return new Array(s.length + 1).join(' '); }).search(/\+\s?\d/);
    if (prochain >= 0) texte = texte.slice(0, prochain);
    var prog = /^\s*(?:et [^(]{0,25})?\(\s*\+\s?(\d+)( de plus)?\s+au rang\s+(\d)(?:\s*,\s*\+\s?(\d+)\s+au rang\s+(\d))?/i.exec(texte);
    if (prog) {
      if (prog[2]) { if (rang >= +prog[3]) val += +prog[1]; return val; }      /* « (+1 de plus au rang 7) » */
      if (rang >= +prog[3]) val = +prog[1]; if (prog[5] && rang >= +prog[5]) val = +prog[4];
      return val;
    }
    var porte = /^[^.;]*?porté à \+\s?(\d+) au rang (\d)/i.exec(texte);       /* « porté à +2 au rang 4 » */
    if (porte && rang >= +porte[2]) val = +porte[1];
    return val;
  }
  /* « (+1 par rang 3 atteint dans une voie de parangon) » : bonus qui grandit
     avec les rangs atteints dans les voies d'un profil. */
  function echelleProfil(texte, p) {
    var m = /\+\s?(\d+)(?: de plus)? par rang (\d) atteint dans une voie (?:de |d['’])([a-zéèêàîôû-]+)/i.exec(texte);
    if (!m || !p) return 0;
    var nom = m[3].toLowerCase(), id = Object.keys(COF.PROFILS).filter(function (k) { return COF.PROFILS[k].nom.toLowerCase() === nom; })[0];
    return id ? +m[1] * COF.Calc.rangsAtteintsProfil(p, id, +m[2]) : 0;
  }
  function phraseAutour(d, idx) {
    var deb = Math.max(d.lastIndexOf('.', idx), d.lastIndexOf(';', idx)) + 1;
    var finP = d.indexOf('.', idx), finS = d.indexOf(';', idx);
    var fin = [finP, finS].filter(function (n) { return n > 0; }).sort(function (a, b) { return a - b; })[0];
    return d.slice(deb, fin > 0 ? fin : undefined).trim();
  }
  /* Effets d'une capacité. p : le personnage (pour les bonus qui grandissent
     avec les rangs atteints dans un profil). */
  function typeDe(mot) { return /^DM$/i.test(mot) ? 'dm' : (/DEF|défense/i.test(mot) ? 'def' : (/^Init/i.test(mot) ? 'init' : (/^PV$/i.test(mot) ? 'pv' : (/PM/.test(mot) ? 'pm' : 'att')))); }
  function effetsCap(c, x, niveau, p) {
    var d = c.d || '', out = [], activable = !!c.a || ACTIVABLE.test(c.n + ' ' + d) || /^\s*(une option|choisi|au choix|un objet)/i.test(d);   /* liste d'options : rien d'office */
    function push(o, idx) {
      var ph = phraseAutour(d, idx);
      o.texte = ph; o.cap = c.n; o.voie = x.voie.nom; o.r = c.r;
      o.cond = activable || COND.test(ph) || !!o.choix;
      o.cle = x.voieKey + '|' + c.r + '|' + o.type + (o.carac || o.scope || '') + '|' + out.length;
      /* « Au rang 5 : +2 en DEF » remplace le bonus précédent du même type */
      var ar = /^Au rang (\d)\s*:/i.exec(ph);
      if (ar) {
        var prec = out.filter(function (e) { return e.type === o.type; }).slice(-1)[0];
        if (prec) { if (x.rang >= +ar[1]) prec.val = o.val; return; }
        if (x.rang < +ar[1]) return;
      }
      out.push(o);
    }
    var m;
    /* attaque / DM / DEF / Initiative */
    var re = /\+\s?(\d+)\s+(?:en |aux |à l['’]|à la |à son |au )?(attaque|attaques|DM|DEF|défense|Initiative|Init\.?)(?:\s+(au contact|à distance|magique|des armes à distance|avec les armes à distance))?([^.;]*)/gi;
    while ((m = re.exec(d)) !== null) {
      var fin = m.index + m[0].length - (m[4] || '').length;
      var val = progression(d.slice(fin, fin + 60), x.rang, +m[1]) + echelleProfil(d.slice(fin, fin + 90), p);
      var scope = /contact/i.test(m[3] || '') ? 'C' : (/distance/i.test(m[3] || '') ? 'D' : (/magique/i.test(m[3] || '') ? 'M' : 'tous'));
      var ty = typeDe(m[2]);
      if (ty === 'def' || ty === 'init') scope = 'tous';
      push({ type: ty, val: val, scope: scope }, m.index);
      /* « +2 en DEF et en Initiative » (préposition obligatoire : « et DM létaux » n'est pas un bonus) */
      var et2 = /^\s*et\s+(?:en |aux |à l['’]|à la |à son )(attaque|DM|DEF|défense|Initiative|Init\.?)/i.exec(m[4] || '');
      if (et2) {
        var fin2 = fin + et2[0].length;
        push({ type: typeDe(et2[1]), val: progression(d.slice(fin2, fin2 + 60), x.rang, val), scope: 'tous' }, m.index);
      }
    }
    /* « +1 par rang (dans la voie) en Initiative » */
    re = /\+\s?(\d+) par rang(?: atteint)?(?: dans (?:la|cette) voie)? en (Initiative|DEF|attaque)/gi;
    while ((m = re.exec(d)) !== null) push({ type: typeDe(m[2]), val: +m[1] * x.rang, scope: 'tous' }, m.index);
    /* +1 en CARAC */
    re = /\+\s?(\d)\s+en\s+(FOR|AGI|CON|PER|CHA|INT|VOL)\b((?:\s+ou\s+(?:en\s+)?(?:FOR|AGI|CON|PER|CHA|INT|VOL)\b)*)/g;
    while ((m = re.exec(d)) !== null) {
      /* « +1 en INT ou CHA » : un choix, chaque option est à cocher */
      var opts = [m[2]].concat((m[3] || '').match(/FOR|AGI|CON|PER|CHA|INT|VOL/g) || []);
      opts.forEach(function (k) { push({ type: 'carac', carac: k, val: +m[1], choix: opts.length > 1 }, m.index); });
    }
    /* « +1 à la caractéristique la plus faible » (humain) */
    re = /\+\s?(\d) à la caractéristique la plus faible/gi;
    while ((m = re.exec(d)) !== null) {
      var faible = CARACS.slice().sort(function (a, b) { return ((p && p.carac && p.carac[a]) || 0) - ((p && p.carac && p.carac[b]) || 0); })[0];
      push({ type: 'carac', carac: faible, val: +m[1] }, m.index);
    }
    /* « +5 PV supplémentaires, auxquels s'ajoute sa CON » */
    re = /auxquels s['’]ajoute (?:son|sa) (FOR|AGI|CON|PER|CHA|INT|VOL)/g;
    while ((m = re.exec(d)) !== null) push({ type: 'pv', caracAjout: m[1], val: 0, scope: 'tous' }, m.index);
    /* compétences écrites en toutes lettres : « +3 en discrétion », « +3 aux tests d'AGI d'escalade » */
    re = /\+\s?(\d+)\s+(?:aux tests (?:de |d['’])(?:(?:FOR|AGI|CON|PER|CHA|INT|VOL) (?:de |d['’]))?|en )(?!(?:FOR|AGI|CON|PER|CHA|INT|VOL|DEF|attaque|Init|Initiative|défense)\b)([a-zéèêàùç][^.;+]{2,70})/gi;
    while ((m = re.exec(d)) !== null) push({ type: 'comp', val: +m[1], domaine: m[2].trim() }, m.index);
    /* dé bonus aux tests de CARAC */
    re = /dé bonus (?:à tous (?:ses|les) |aux |à ses )tests? (?:de |d['’])(FOR|AGI|CON|PER|CHA|INT|VOL)\b(?:\s+(?:et|ou)\s+(?:de |d['’])?(FOR|AGI|CON|PER|CHA|INT|VOL)\b)?/gi;
    while ((m = re.exec(d)) !== null) {
      push({ type: 'debonus', carac: m[1].toUpperCase(), val: 1 }, m.index);
      if (m[2]) push({ type: 'debonus', carac: m[2].toUpperCase(), val: 1 }, m.index);
    }
    /* +N aux tests de CARAC */
    re = /\+\s?(\d+)\s+(?:à tous (?:ses|les) |aux |à ses )tests? (?:de |d['’])(FOR|AGI|CON|PER|CHA|INT|VOL)\b(?!\s+(?:de |d['’]))/gi;
    while ((m = re.exec(d)) !== null) push({ type: 'test', carac: m[2].toUpperCase(), val: progression(d.slice(m.index + m[0].length, m.index + m[0].length + 60), x.rang, +m[1]) }, m.index);
    /* PV : « +N PV », « +1 PV par rang », « +N PV par niveau » */
    re = /\+\s?(\d+)\s+PV(?:\s+(par rang(?: atteint)?(?: dans (?:la|cette) voie)?|par niveau))?/gi;
    while ((m = re.exec(d)) !== null) {
      var apres = d.slice(m.index + m[0].length, m.index + m[0].length + 12);
      if (/^\s*(à|au|aux|pour)\b/.test(apres)) continue;    /* « +1 PV à un allié », « +3 PV pour une capacité » */
      var v = +m[1];
      if (m[2] && /rang/i.test(m[2])) v *= x.rang;
      if (m[2] && /niveau/i.test(m[2])) v *= niveau;
      push({ type: 'pv', val: v }, m.index);
    }
    /* PM */
    re = /\+\s?(\d+)\s+PM\b/g;
    while ((m = re.exec(d)) !== null) push({ type: 'pm', val: +m[1] }, m.index);
    /* Réduction des DM */
    re = /\(RD\s?(\d+)\)|\bRD\s(\d+)\b/g;
    while ((m = re.exec(d)) !== null) { push({ type: 'rd', val: +(m[1] || m[2]) }, m.index); break; }
    /* « ajoute son CHA en Initiative », « ajoute sa VOL à son Initiative et à ses PV »,
       « ajoute sa PER à son total de PM » */
    re = /[Aa]joute (?:son|sa) (FOR|AGI|CON|PER|CHA|INT|VOL) (?:en |à l['’]|à la |au |aux |à son |à ses |à sa )?(Initiative|DEF|défense|attaque|DM|PV|total de PM)((?:\s+et\s+(?:en |à son |à ses |à sa |aux )?(?:Initiative|DEF|PV|total de PM|DM))?)/g;
    while ((m = re.exec(d)) !== null) {
      push({ type: typeDe(m[2]), caracAjout: m[1], val: 0, scope: 'tous' }, m.index);
      var s2 = /(Initiative|DEF|PV|total de PM|DM)\s*$/.exec(m[3] || '');
      if (s2) push({ type: typeDe(s2[1]), caracAjout: m[1], val: 0, scope: 'tous' }, m.index);
    }
    return out;
  }
  var cache = { cle: null, val: null };
  /* Tous les effets des capacités acquises (avec l'état coché). */
  function liste(p) {
    if (!p) return [];
    var cle = (p.id || '') + '|' + (p.niveau || 1) + '|' + JSON.stringify(p.voies || []) + '|' + JSON.stringify(p.effetsVoies || {});
    if (cache.cle === cle) return cache.val;
    var out = [], choix = p.effetsVoies || {};
    COF.Calc.capacites(p).forEach(function (x) {
      effetsCap(x.cap, x, p.niveau || 1, p).forEach(function (e) {
        e.on = choix.hasOwnProperty(e.cle) ? !!choix[e.cle] : !e.cond;
        out.push(e);
      });
    });
    cache = { cle: cle, val: out };
    return out;
  }
  /* Somme des effets actifs. caracBase : fonction(id) → valeur sans bonus de voie. */
  function actifs(p) {
    var r = { attC: 0, attD: 0, attM: 0, dmC: 0, dmD: 0, def: 0, init: 0, pv: 0, pm: 0, rd: 0, carac: {}, test: {}, debonus: {}, comps: [] };
    CARACS.forEach(function (k) { r.carac[k] = 0; r.test[k] = 0; r.debonus[k] = false; });
    var l = liste(p).filter(function (e) { return e.on; });
    l.forEach(function (e) { if (e.type === 'carac') r.carac[e.carac] += e.val; });
    function car(k) { return ((p.carac && p.carac[k]) || 0) + r.carac[k]; }
    l.forEach(function (e) {
      var v = e.caracAjout ? car(e.caracAjout) : e.val;
      switch (e.type) {
        case 'def': r.def += v; break;
        case 'init': r.init += v; break;
        case 'pv': r.pv += v; break;
        case 'pm': r.pm += v; break;
        case 'rd': r.rd = Math.max(r.rd, v); break;
        case 'test': r.test[e.carac] += v; break;
        case 'comp': r.comps.push({ domaine: e.domaine, val: v, cap: e.cap }); break;
        case 'debonus': r.debonus[e.carac] = true; break;
        case 'att': (e.scope === 'tous' ? ['C', 'D', 'M'] : [e.scope]).forEach(function (k) { r['att' + k] += v; }); break;
        case 'dm': (e.scope === 'tous' ? ['C', 'D'] : [e.scope]).forEach(function (k) { if (k !== 'M') r['dm' + k] += v; }); break;
      }
    });
    return r;
  }
  function basculer(p, cle, on) { p.effetsVoies = p.effetsVoies || {}; p.effetsVoies[cle] = !!on; cache.cle = null; }
  function libelle(e) {
    if (e.type === 'comp') return '+' + e.val + ' ' + e.domaine;
    var t = { att: 'attaque', dm: 'DM', def: 'DEF', init: 'Initiative', carac: e.carac, debonus: 'dé bonus aux tests de ' + e.carac, test: 'aux tests de ' + e.carac, pv: 'PV', pm: 'PM', rd: 'RD (réduction des DM)' }[e.type] || e.type;
    var sc = (e.type === 'att' || e.type === 'dm') && e.scope !== 'tous' ? ({ C: ' au contact', D: ' à distance', M: ' magique' })[e.scope] : '';
    if (e.type === 'debonus') return t;
    if (e.caracAjout) return '+' + e.caracAjout + ' en ' + t + sc;
    return (e.type === 'rd' ? 'RD ' + e.val : '+' + e.val + ' ' + t + sc);
  }

  /* Bonus d'un test : caractéristique + bonus de voies (+N aux tests, dé bonus)
     + compétences de voies dont le texte correspond aux mots-clés de l'action. */
  function bonusTest(p, carac, mots) {
    var a = actifs(p), out = { bonus: a.test[carac] || 0, deBonus: !!a.debonus[carac], sources: [] };
    if (a.test[carac]) out.sources.push('+' + a.test[carac] + ' tests de ' + carac);
    if (a.debonus[carac]) out.sources.push('dé bonus en ' + carac);
    if (mots && mots.length) {
      var meilleur = null;
      COF.Calc.competences(p).forEach(function (cp) {
        if (!cp.valeur) return;
        var t = String(cp.nom).toLowerCase();
        if (mots.some(function (m) { return t.indexOf(m) >= 0; }) && (!meilleur || cp.valeur > meilleur.valeur)) meilleur = cp;
      });
      /* compétences écrites en toutes lettres (« +3 en discrétion ») */
      a.comps.forEach(function (cp) {
        var t = String(cp.domaine).toLowerCase();
        if (mots.some(function (m) { return t.indexOf(m) >= 0; }) && (!meilleur || cp.val > meilleur.valeur)) meilleur = { valeur: cp.val, cap: cp.cap };
      });
      if (meilleur) { out.bonus += meilleur.valeur; out.sources.push('+' + meilleur.valeur + ' ' + meilleur.cap); }
    }
    return out;
  }
  return { liste: liste, actifs: actifs, basculer: basculer, libelle: libelle, bonusTest: bonusTest, effetsCap: effetsCap, CARACS: CARACS };
})();
