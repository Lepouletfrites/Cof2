/* ============================================================
   COF2 Compagnon — La plume (mode aventure)
   Le récit se compose à chaque action à partir de petits morceaux
   (geste, sensation, pensée, état de l'affaire, menace), choisis selon
   le lieu, l'heure, la météo, la caractéristique utilisée et l'issue
   du jet. Les variantes entre crochets [a|b] et l'anti-répétition du
   conteur multiplient les combinaisons : on ne lit presque jamais
   deux fois la même chose.
   ============================================================ */
window.COF = window.COF || {};

COF.Plume = (function () {
  function p(l) { return l[Math.floor(Math.random() * l.length)]; }
  function T() { return COF.Conteur; }
  function heure(c) { return c.conteur ? c.conteur.heure : 1; }
  function meteo(c) { return c.conteur && c.conteur.meteo ? c.conteur.meteo.id : null; }

  /* ---------- Avant le jet : la manière (selon la caractéristique) ---------- */
  var APPROCHE = {
    FOR: ['{h} [roule des épaules|serre les poings|prend appui sur ses jambes] et [se lance|y va franchement|ne fait pas dans la dentelle].', 'Pas de finesse : {h} compte sur ses muscles.', '{h} [inspire un grand coup|se ramasse sur ses appuis], prêt{he} à forcer le passage.', 'D’un pas lourd et décidé, {h} [avance|s’attaque au problème].'],
    AGI: ['{h} [se fait léger{he}|se glisse en avant|avance à pas de loup], tous les sens en alerte.', 'Souple et rapide, {h} [tente sa chance|se faufile].', '{h} [guette le bon moment|attend une ouverture], puis bondit.', 'Un pas de côté, un coup d’œil, et {h} [s’élance|se décide].'],
    CON: ['{h} [serre les dents|baisse la tête] et [encaisse|avance malgré tout].', 'La fatigue ? {h} [la repousse|fait comme si elle n’existait pas].', 'Têtu{he} comme une mule, {h} [s’accroche|refuse de lâcher prise].'],
    PER: ['{h} [plisse les yeux|s’immobilise|tend l’oreille] et [observe|écoute] [chaque détail|le moindre bruit].', 'Rien ne doit échapper à {h} : [une trace|un reflet|un murmure], n’importe quoi.', '{h} [balaie les lieux du regard|prend le temps de tout examiner].'],
    CHA: ['{h} [affiche son sourire le plus engageant|redresse le menton|prend une voix posée].', 'Quelques mots bien choisis, un regard franc : {h} [tente sa chance|joue cartes sur table].', '{h} [s’approche avec assurance|soigne son entrée], comme si tout était déjà gagné.', '{h} [cherche les mots justes|pèse chaque mot].'],
    INT: ['{h} [réfléchit vite|fait le point|recoupe ce qu’{hil} sait déjà].', 'Un plan se dessine dans la tête de {h}, [simple|audacieux|tordu à souhait].', '{h} [se souvient d’un vieux livre|repense à une leçon d’autrefois] et [s’en inspire|tente quelque chose].'],
    VOL: ['{h} [fait le vide|rassemble sa volonté|ferme les yeux un instant].', 'Rien ne fera plier {h}. [Pas aujourd’hui.|Pas maintenant.]', 'Le regard de {h} se durcit : {hil} ira jusqu’au bout.']
  };
  /* ---------- Après le jet : le corps parle ---------- */
  var ISSUE = {
    crit: ['[Un coup de maître.|Du grand art.|Parfait. Tout simplement parfait.]', 'Même {h} n’en revient pas : c’était [parfait|inespéré|presque trop facile].', 'Si quelqu’un avait vu ça, on en parlerait [dans toutes les tavernes|pendant des années].', 'Tout s’enchaîne avec une [grâce|aisance] presque insolente.', 'La chance sourit aux audacieux, et aujourd’hui, elle rit aux éclats.'],
    ok: ['{h} [esquisse un sourire|hoche la tête, satisfait{he}|souffle, soulagé{he}].', 'Une petite victoire, mais une victoire.', '[Bien joué.|Pas mal du tout.|Ça, c’est fait.]', '{h} s’autorise un [bref|court] instant de fierté.', 'Le cœur de {h} bat un peu plus vite : [ça marche|ça avance].'],
    justesse: ['Il s’en est fallu d’un cheveu.', '{h} [essuie la sueur de son front|reprend son souffle] : c’était [moins une|de justesse].', 'Ça passe… mais [tout juste|à peine].'],
    ko: ['{h} [serre les dents|retient un juron|ferme les yeux une seconde].', 'Un juron [échappe à|franchit les lèvres de] {h}.', '[Raté.|Rien à faire.|Peine perdue.]', '{h} [sent la frustration monter|se mord la lèvre].', 'Ce n’est [pas le jour|pas le moment], visiblement.'],
    fumble: ['[Catastrophe.|Le désastre complet.|Tout ce qui pouvait mal tourner a mal tourné.]', '{h} aurait mieux fait de rester couché{he} ce matin.', 'Si quelqu’un a vu ça, {h} ne s’en remettra pas.', 'Le ridicule ne tue pas. [Heureusement.|Pas encore.]']
  };
  /* ---------- Pensées du héros ---------- */
  var PENSEE = {
    progres: ['On y est presque', 'Continue comme ça', 'Je savais que j’avais raison', 'Encore un pas', 'Ce n’est qu’un début', 'Ils ne s’attendent pas à moi'],
    danger: ['Ça sent mauvais', 'Je n’aime pas ça du tout', 'Il faut faire vite', 'On m’observe, j’en suis sûr{he}', 'Une erreur de plus et c’est fini', 'Pas de panique'],
    echec: ['Ce n’est que partie remise', 'Réfléchis, bon sang', 'Il doit y avoir un autre moyen', 'Pourquoi rien n’est jamais simple ?', 'Je m’y suis mal pris{he}']
  };
  function pensee(type, ctx) {
    var t = p(PENSEE[type]), q = /[?!]$/.test(t);
    return T().dire(p(['« ' + t + ' »' + (q ? ' ' : ', ') + '[pense|se dit|murmure] {h}.', '« ' + t + (q ? '' : '…') + ' » [songe|marmonne] {h}.', '{h} [se répète|se dit] : « ' + t + (q ? '' : '.') + ' »']), ctx);
  }
  /* ---------- Sensations : l'heure, le temps, le lieu ---------- */
  var HEURE = [
    ['La lumière de l’aube [dore|rosit] [les pierres|les toits|la cime des arbres].', 'L’air du matin est [frais|vif] et sent [la rosée|l’herbe mouillée].', 'Quelque part, un coq s’égosille.'],
    ['Le soleil [cogne|tape dur|monte haut dans le ciel].', 'Les ombres sont courtes, la journée bien avancée.', 'Des mouches [bourdonnent|tournent] paresseusement.'],
    ['Le ciel [s’embrase|se teinte d’orange et de pourpre].', 'Les ombres s’allongent ; la journée touche à sa fin.', 'Les premières lanternes s’allument au loin.'],
    ['La nuit est [d’encre|profonde|piquée d’étoiles].', 'Une chouette [hulule|appelle] dans le noir.', 'Le froid de la nuit [s’insinue sous les vêtements|mord les doigts].']
  ];
  var TEMPS = {
    pluie: ['La pluie [ruisselle|dégouline] dans le cou de {h}.', 'Les bottes de {h} font un bruit de succion dans la boue.', 'L’averse redouble.'],
    brume: ['La brume avale [les formes|les bruits|tout ce qui dépasse dix pas].', 'Des silhouettes [naissent et meurent|se dessinent] dans le brouillard.'],
    neige: ['Les flocons [tourbillonnent|tombent sans bruit].', 'La neige crisse sous les pas de {h}.', 'Le souffle de {h} fait de petits nuages blancs.'],
    orage: ['Un éclair [déchire|zèbre] le ciel ; le tonnerre suit [aussitôt|de près].', 'Le vent hurle et [plie les arbres|fait claquer les volets].'],
    vent: ['Le vent [siffle|s’engouffre partout] et [arrache|fait voler] les capes.', 'Une bourrasque soulève [la poussière|les feuilles mortes].'],
    clair: ['Pas un nuage : le ciel est [immense|d’un bleu insolent].'],
    gris: ['Le ciel bas pèse comme un couvercle.', 'Une lumière grise et sans ombre [noie tout|écrase les couleurs].']
  };
  function sens(c, ctx) {
    var r = Math.random(), env = ctx.env, mt = meteo(c);
    if (env !== 'souterrain' && mt && TEMPS[mt] && r < 0.4) return T().dire(TEMPS[mt], ctx);
    if (env !== 'souterrain' && r < 0.65) return T().dire(HEURE[heure(c)] || HEURE[1], ctx);
    return ctx.decor ? T().dire(ctx.decor, ctx) : '';
  }
  /* ---------- L'état de l'affaire, composé ---------- */
  var AVANCE = {
    debut: ['[Petit à petit|Pas à pas|Lentement], [les choses se mettent en place|l’affaire se dessine|le brouillard se dissipe].', 'C’est [un début|un premier pas|mieux que rien]. [Il en faudra plus.|La route est encore longue.]', '[Un détail|Un nom|Une trace] [s’ajoute aux autres|vient compléter le tableau].'],
    milieu: ['[Tout converge|Les pièces s’emboîtent|Le but se rapproche] : [encore un effort|plus que quelques pas|la fin est en vue].', '{h} [le sent|le sait] : [le dénouement approche|on touche au but].', '[Plus qu’un pas.|Si près du but…|C’est maintenant que tout se joue.]']
  };
  var MENACE = {
    monte: ['[Quelque part|Non loin|Dans le dos de {h}], [quelqu’un|quelque chose] [observe|guette|attend].', '[L’atmosphère|L’air|L’ambiance] [s’alourdit|se charge|devient pesante].', '[Un bruit|Un mouvement|Un détail] [inquiète|trouble|alerte] {h}, sans qu’{hil} sache pourquoi.'],
    imminent: ['[Plus le droit à l’erreur.|Tout tient à un fil.|C’est le moment ou jamais.]', '[Le danger|La menace] est [là, tout proche|à portée de main|sur le point d’éclater].', '{h} sent [la tension|le piège|l’orage] sur le point de [se refermer|éclater].']
  };

  /* Un morceau avant le jet (la manière), ou ''. */
  function avant(c, s, a, ctx) {
    if (!a || a.auto || !APPROCHE[a.carac] || Math.random() > 0.4) return '';
    return T().dire(APPROCHE[a.carac], ctx);
  }
  /* La réaction après le jet. r : résultat du dé. Renvoie '' parfois. */
  function issue(r, reussi, diff, ctx) {
    var k = r && r.crit ? 'crit' : r && r.fumble ? 'fumble' : reussi ? (r && r.total - diff <= 1 ? 'justesse' : 'ok') : 'ko';
    if ((k === 'ok' || k === 'ko') && Math.random() > 0.45) return '';
    return T().dire(ISSUE[k], ctx);
  }
  /* La suite du récit : un ou deux morceaux parmi l'avancée, la menace, une pensée, une sensation.
     Le type utilisé juste avant est évité, pour varier le rythme. */
  function suite(c, s, reussi, ctx, phrases) {
    var j = s.jeu, ratio = j.prog / Math.max(1, j.progMax), reste = j.dangerMax - j.danger, cand = [];
    if (j.prog < j.progMax) {
      if (reussi) cand.push(['avance', 3, function () { return phrases && phrases.progres && Math.random() < 0.5 ? T().dire(phrases.progres, ctx) : T().dire(AVANCE[ratio < 0.5 ? 'debut' : 'milieu'], ctx); }]);
      if (!reussi && reste <= 1) cand.push(['menace', 6, function () { return phrases && phrases.imminent && Math.random() < 0.5 ? T().dire(phrases.imminent, ctx) : T().dire(MENACE.imminent, ctx); }]);
      else if (!reussi) cand.push(['menace', 3, function () { return phrases && phrases.monte && Math.random() < 0.5 ? T().dire(phrases.monte, ctx) : T().dire(MENACE.monte, ctx); }]);
      cand.push(['pensee', 1.5, function () { return pensee(reussi ? 'progres' : (reste <= 2 ? 'danger' : 'echec'), ctx); }]);
    }
    cand.push(['sens', 1.5, function () { return sens(c, ctx); }]);
    var dernier = j.beat, l = cand.filter(function (x) { return x[0] !== dernier; }), out = [], n = Math.random() < 0.35 ? 2 : 1;
    if (!l.length) l = cand;
    /* le danger imminent est toujours dit */
    var imp = l.filter(function (x) { return x[0] === 'menace' && reste <= 1; })[0];
    if (imp) { out.push(imp[2]()); j.beat = 'menace'; l = l.filter(function (x) { return x !== imp; }); n--; }
    while (n-- > 0 && l.length) {
      var tot = l.reduce(function (t, x) { return t + x[1]; }, 0), r = Math.random() * tot, k = 0;
      for (; k < l.length - 1; k++) { r -= l[k][1]; if (r <= 0) break; }
      var t = l[k][2](); if (t) { out.push(t); j.beat = l[k][0]; }
      l.splice(k, 1);
    }
    return out.join(' ');
  }
  /* Allège le texte : quand deux phrases de suite parlent du héros, la seconde dit « il » ou « elle ». */
  function alleger(txt, ctx) {
    var h = ctx && ctx.h; if (!h || h === 'le héros') return txt;
    var pr = ctx.hil === 'elle' ? 'Elle' : 'Il', ph = String(txt).split(/(?<=[.!?…])\s+(?=[A-ZÀ-Ý«])/), prec = false;
    return ph.map(function (s) {
      var debut = s.indexOf(h + ' ') === 0, avec = s.indexOf(h) >= 0;
      if (debut && prec && Math.random() < 0.8) { prec = true; return pr + s.slice(h.length); }
      prec = avec; return s;
    }).join(' ');
  }
  return { alleger: alleger, APPROCHE: APPROCHE, ISSUE: ISSUE, PENSEE: PENSEE, HEURE: HEURE, TEMPS: TEMPS, AVANCE: AVANCE, MENACE: MENACE, avant: avant, issue: issue, suite: suite, sens: sens, pensee: pensee };
})();
