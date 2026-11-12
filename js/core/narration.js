/* ============================================================
   COF2 Compagnon — Narration du combat
   Transforme chaque action résolue en une phrase de récit : verbe
   choisi d'après l'arme ou l'attaque (morsure, griffes, arc, sort…),
   ampleur des dégâts, blessure, chute. Les phrases évitent les
   accords (on ne connaît pas toujours le genre d'une créature).
   ============================================================ */
window.COF = window.COF || {};

COF.Narration = (function () {
  function p(l) { return l[Math.floor(Math.random() * l.length)]; }
  function maj(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }

  var VERBES = [
    [/morsure|mord|croc|mâchoire|machoire|bec/i, ['mord', 'plante ses crocs dans', 'referme ses mâchoires sur']],
    [/griffe|serre|ongle/i, ['lacère', 'griffe', 'déchire de ses griffes']],
    [/dard|aiguillon|piq/i, ['pique', 'plante son dard dans']],
    [/corne|encorn|charge|bélier/i, ['encorne', 'percute de plein fouet']],
    [/queue/i, ['fouette de sa queue', 'balaie d’un coup de queue']],
    [/tentacule|étreinte|etreinte|constrict|enserr/i, ['enserre', 'étouffe dans son étreinte']],
    [/souffle|crach|cône|cone/i, ['crache son souffle sur', 'enveloppe de son souffle']],
    [/arc|arbalète|arbalete|flèche|fleche|carreau|trait|tir\b/i, ['décoche un trait qui atteint', 'touche d’une flèche', 'atteint d’un tir précis']],
    [/fronde|javelot|jet|lancer|pierre|rocher/i, ['atteint d’un projectile', 'touche de son jet']],
    [/poing|mains nues|coup de pied|gifle/i, ['cogne', 'frappe du poing', 'envoie un coup sec à']],
    [/massue|marteau|gourdin|masse|fléau|bâton|baton/i, ['assomme à moitié', 'abat son arme sur', 'cogne lourdement']],
    [/hache/i, ['taillade', 'abat sa hache sur', 'entaille profondément']],
    [/épée|epee|lame|dague|cimeterre|sabre|rapière|rapiere|couteau|glaive/i, ['entaille', 'porte une botte à', 'frappe d’estoc', 'taillade']],
    [/lance|pique|hallebarde|trident/i, ['embroche presque', 'frappe de sa lance', 'transperce l’épaule de']]
  ];
  function verbe(arme, sort) {
    if (sort) return p(['frappe de sa magie', 'déchaîne ' + arme + ' sur', 'lance ' + arme + ' contre']);
    for (var i = 0; i < VERBES.length; i++) if (VERBES[i][0].test(arme || '')) return p(VERBES[i][1]);
    return p(['frappe', 'touche', 'atteint']);
  }

  /* o = { a, c, arme, sort, distance, verdict, dm, ko, pv, pvMax, crit, fumble } */
  function attaque(o) {
    var a = o.a, c = o.c;
    if (o.verdict === 'rate' || o.verdict === 'fumble') {
      if (o.verdict === 'fumble') return p([a + ' trébuche et manque lamentablement son coup.', a + ' perd l’équilibre : l’attaque part dans le vide.', 'Maladresse ! ' + a + ' se découvre dangereusement.']);
      if (o.sort) return p(['Le sort de ' + a + ' manque ' + c + ' de peu.', c + ' échappe à la magie de ' + a + '.']);
      if (o.distance) return p(['Le tir de ' + a + ' manque ' + c + ' de peu.', 'Le projectile de ' + a + ' se perd.', c + ' esquive le tir de ' + a + '.']);
      return p([c + ' esquive l’attaque de ' + a + '.', 'Le coup de ' + a + ' glisse sur la garde de ' + c + '.', a + ' frappe dans le vide.', c + ' pare de justesse.', 'L’armure de ' + c + ' encaisse le coup de ' + a + '.']);
    }
    var ratio = o.dm / Math.max(1, o.pvMax || 10), phrase;
    phrase = (o.crit ? p(['Coup magistral ! ', 'Coup terrible ! ', 'Un coup parfait : ']) : '') + a + ' ' + verbe(o.arme, o.sort) + ' ' + c;
    if (!o.dm) return phrase + '.';
    if (o.ko && o.heros) return phrase + p([' : ' + c + ' perd connaissance.', ', qui s’effondre, à bout de forces.']);
    if (o.ko) return phrase + p([', qui s’effondre.', ' : ' + c + ' tombe et ne se relève pas.', ' et ' + c + ' s’écroule, hors de combat.']);
    if (ratio >= 0.5) phrase += p([' avec une violence inouïe', ' de toutes ses forces', '']);
    else if (ratio < 0.12) phrase += p([' — une simple égratignure', ', sans grand effet', '']);
    phrase += '.';
    var reste = o.pv / Math.max(1, o.pvMax || 1);
    if (reste <= 0.25) phrase += ' ' + p([c + ' chancelle, à bout de forces.', c + ' vacille dangereusement.', c + ' ne tient plus debout que par miracle.']);
    else if (reste <= 0.5 && Math.random() < 0.5) phrase += ' ' + p([c + ' saigne abondamment.', c + ' grimace sous la douleur.']);
    return phrase;
  }
  function soin(a, c, objet, n) {
    if (objet) return a === c ? a + ' boit ' + objet + ' : ses blessures se referment (+' + n + ' PV).' : a + ' fait boire ' + objet + ' à ' + c + ' (+' + n + ' PV).';
    return a === c ? a + ' puise dans ses forces et se soigne (+' + n + ' PV).' : a + ' soigne les plaies de ' + c + ' (+' + n + ' PV).';
  }
  /* type : approche | engage | recule | fuite | horsVue | reddition | releve | ramasse | charge */
  function mouvement(type, a, c) {
    switch (type) {
      case 'approche': return p([a + ' s’avance vers ' + c + '.', a + ' gagne du terrain sur ' + c + '.', a + ' se rapproche de ' + c + '.']);
      case 'engage': return p([a + ' fond sur ' + c + ' et engage le corps à corps.', a + ' se jette sur ' + c + '.', a + ' arrive au contact de ' + c + '.']);
      case 'charge': return p([a + ' charge ' + c + ' !', a + ' bondit vers ' + c + '.']);
      case 'recule': return p([a + ' recule pour garder ses distances.', a + ' rompt le contact et prend du champ.']);
      case 'fuite': return p([a + ' tourne les talons et s’enfuit.', a + ' prend la fuite !']);
      case 'horsVue': return p([a + ' disparaît hors de vue.', a + ' s’évanouit au loin.']);
      case 'reddition': return a + ' jette ses armes et implore grâce.';
      case 'releve': return a + ' se relève péniblement.';
      case 'ramasse': return a + ' se baisse pour ramasser son arme.';
      default: return a + ' se déplace.';
    }
  }
  var LIEUX = {
    foret: ['Entre les troncs', 'Dans un froissement de feuilles', 'Sous le couvert des arbres'],
    plaine: ['Dans les hautes herbes', 'Sur la lande balayée par le vent', 'Au sommet d’une butte'],
    montagne: ['Sur la pente rocailleuse', 'Au détour d’un éboulis', 'Au bord du sentier escarpé'],
    marais: ['Dans la brume du marais', 'Entre les roseaux', 'Dans un clapotis inquiétant'],
    souterrain: ['Dans l’obscurité du boyau', 'À la lueur vacillante des torches', 'Au fond de la galerie'],
    arctique: ['Dans le blizzard', 'Sur la neige crissante', 'Entre les blocs de glace'],
    urbain: ['Au coin d’une ruelle', 'Au milieu de la rue', 'Sous une arche sombre'],
    ruines: ['Parmi les pierres effondrées', 'Entre les colonnes brisées', 'Dans une salle en ruine']
  };
  var APPARITION = [
    ['surgit juste devant le groupe', 'surgissent juste devant le groupe'],
    ['apparaît à quelques pas', 'apparaissent à quelques pas'],
    ['se dresse à une vingtaine de mètres', 'se dressent à une vingtaine de mètres'],
    ['se profile au loin', 'se profilent au loin']
  ];
  /* Phrase d'ouverture : où, qui, à quelle distance. */
  function ouverture(s, env) {
    var adv = s.combattants.filter(function (c) { return c.type === 'creature' && !c.allie; });
    if (!adv.length) return null;
    var compte = {};
    adv.forEach(function (c) { compte[c.base] = (compte[c.base] || 0) + 1; });
    var noms = Object.keys(compte).map(function (b) { return compte[b] > 1 ? compte[b] + ' × ' + b : b; });
    var liste = noms.length > 1 ? noms.slice(0, -1).join(', ') + ' et ' + noms[noms.length - 1] : noms[0];
    var z = Math.max(0, Math.min(3, adv[0].zone || 0));
    var phrase = p(LIEUX[env] || ['Soudain']) + ', ' + liste + ' ' + APPARITION[z][adv.length > 1 ? 1 : 0] + '.';
    if (s.surprise === 'heros') phrase += ' Le groupe est pris au dépourvu !';
    else if (s.surprise === 'monstres') phrase += ' Les adversaires n’ont rien vu venir.';
    return phrase;
  }
  return { attaque: attaque, soin: soin, mouvement: mouvement, ouverture: ouverture, maj: maj };
})();
