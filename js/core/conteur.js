/* ============================================================
   COF2 Compagnon — Le Conteur (récit automatique du mode aventure)
   Fait le travail d'un MJ qui raconte, sans IA :

   1. Grammaire générative : des gabarits de phrases avec des
      symboles ({h}, {lieu}, {decor}…) et des variantes [a|b|c],
      développés selon le contexte (héros, lieu, terrain, heure,
      météo, quête, commanditaire). Un « polissage » règle les
      élisions et contractions du français (de + voyelle → d’,
      à le → au…).
   2. Mémoire : les phrases déjà servies ne reviennent pas tout de
      suite ; chaque scène rappelle la précédente (« Précédemment… »).
   3. Scènes jouables : chaque scène a un objectif (◆) et un danger
      (●). Le joueur choisit ce que fait le héros parmi des actions
      cohérentes avec la scène ; l'app lance le dé avec la bonne
      caractéristique et raconte le résultat. Réussite : l'objectif
      avance. Échec : le danger monte, avec une conséquence réelle
      (blessure, temps perdu). Danger au maximum : la menace surgit
      (rencontre) ou la discussion tourne mal. L'histoire avance
      toujours, même en cas d'échec (« échouer en avant »).
   4. Temps qui passe : heure du jour et météo suivent les scènes.
   ============================================================ */
window.COF = window.COF || {};

COF.Conteur = (function () {
  function p(l) { return l[Math.floor(Math.random() * l.length)]; }
  function d(n) { return 1 + Math.floor(Math.random() * n); }
  function maj(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }
  function min1(s) { s = String(s || ''); return s.charAt(0).toLowerCase() + s.slice(1); }
  function sansPoint(s) { return String(s || '').replace(/[.\s]+$/, ''); }
  function K() { return COF.Carnet; }
  function M() { return COF.Monde; }
  function AV() { return COF.Aventure; }
  function D() { return COF.Directeur; }
  function fil(c, id) { return (c.fils || []).filter(function (f) { return f.id === id; })[0] || null; }
  function pnj(c, id) { return (c.pnj || []).filter(function (x) { return x.id === id; })[0] || null; }

  /* ================= Grammaire ================= */
  function cle(x) { return String(x).slice(0, 28); }
  function choisir(l, ctx) {
    var vus = (ctx && ctx._vus) || null;
    var libres = vus ? l.filter(function (x) { return vus.indexOf(cle(x)) < 0; }) : l;
    var x = p(libres.length ? libres : l);
    if (vus && typeof x === 'string' && x.length > 20) { vus.push(cle(x)); if (vus.length > 80) vus.shift(); }
    return x;
  }
  function ex(t, ctx, n) {
    n = n || 0;
    if (typeof t === 'function') t = t(ctx);
    if (Array.isArray(t)) t = choisir(t, ctx);
    t = String(t === null || t === undefined ? '' : t);
    if (n > 8) return t;
    t = t.replace(/\[([^\[\]]*\|[^\[\]]*)\]/g, function (m, a) { return p(a.split('|')); });
    return t.replace(/\{(\w+)\}/g, function (m, k) {
      var v = ctx[k] !== undefined ? ctx[k] : G[k];
      if (v === undefined || v === null) return '';
      return ex(v, ctx, n + 1);
    });
  }
  var V = 'aeiouyàâäéèêëîïôöûüAEIOUYÀÂÉÈÊËÎÏÔÖÛÜ';
  /* Article et prépositions d'un nom de lieu généré (« la Clairière du
     Silence », « au Gué des Ronces », « aux Ruines… ») ; un nom propre
     saisi à la main (« Brumeval ») reste sans article. */
  var FEM = /^(Clairière|Cabane|Pierre|Ferme|Tourbière|Hutte|Mare|Passerelle|Grotte|Mine|Galerie|Caverne|Crevasse|Auberge|Tour|Crypte|Nécropole|Forteresse|Maison|Abbaye|Faille)(?=\s|$)/,
    MAS = /^(Bosquet|Chêne|Sous-bois|Tertre|Moulin|Gué|Col|Pic|Refuge|Défilé|Belvédère|Îlot|Gouffre|Glacier|Cairn|Lac|Igloo|Hameau|Relais|Poste|Marché|Tombeau|Temple|Fort|Cercle|Palais|Puits|Antre|Donjon|Camp|Castel|Repaire|Sanctuaire|Cœur|Arbre-Monde)(?=\s|$)/,
    PLU = /^(Ruines|Égouts)(?=\s|$)/;
  function formes(nom) {
    nom = String(nom || '');
    var voy = /^[aeiouyàâäéèêëîïôöûüAEIOUYÀÂÉÈÊËÎÏÔÖÛÜ]/.test(nom);
    if (PLU.test(nom)) return { n: 'les ' + nom, a: 'aux ' + nom, de: 'des ' + nom };
    var f = FEM.test(nom);
    if (f || MAS.test(nom)) return voy ? { n: 'l’' + nom, a: 'à l’' + nom, de: 'de l’' + nom }
      : (f ? { n: 'la ' + nom, a: 'à la ' + nom, de: 'de la ' + nom } : { n: 'le ' + nom, a: 'au ' + nom, de: 'du ' + nom });
    return { n: nom, a: 'à ' + nom, de: voy ? 'd’' + nom : 'de ' + nom };
  }
  /* Textes des tables écrits pour une table de jeu : « les PJ » → le héros. */
  function pj(s) { return String(s || '').replace(/\bdes PJ\b/g, 'du héros').replace(/\baux PJ\b/g, 'au héros').replace(/\bles PJ\b/g, 'le héros').replace(/\bPJ\b/g, 'héros'); }
  function polir(s) {
    s = String(s || '').replace(/'/g, '’').replace(/\.\.(?=\))/g, '…');
    var deb = '(^|[\\s«(“"])';
    s = s.replace(new RegExp(deb + 'à les ', 'g'), '$1aux ').replace(new RegExp(deb + 'à le ', 'g'), '$1au ')
      .replace(new RegExp(deb + 'de les ', 'g'), '$1des ').replace(new RegExp(deb + 'de le (?=[^' + V + '])', 'g'), '$1du ');
    s = s.replace(new RegExp(deb + '([dDlLjJsSnN]|[qQ]u)e ([' + V + '])', 'g'), '$1$2’$3');
    s = s.replace(new RegExp(deb + '([lL])a ([' + V + '])', 'g'), '$1$2’$3');
    s = s.replace(/\s+/g, ' ').replace(/\s+([.,])/g, '$1').replace(/([.!?…])\s*\./g, '$1').replace(/,\s*\./g, '.').replace(/\.\s*,/g, ',');
    s = s.replace(/([.!?]\s+)([a-zàâäéèêëîïôöûü])/g, function (m, a, b) { return a + b.toUpperCase(); });
    return maj(s.trim());
  }
  function dire(t, ctx) { return polir(ex(t, ctx)); }

  /* ================= Décor, heure, météo ================= */
  var DECOR = {
    foret: ['Les grands arbres filtrent une lumière verte et mouvante.', 'L’humus craque sous les pas et l’air sent la résine.', 'Un pic-vert martèle un tronc quelque part, puis se tait.', 'Des racines noueuses courent sur le sentier comme des serpents figés.', 'Les fougères frémissent, comme si quelque chose venait d’y passer.'],
    plaine: ['Le vent couche les herbes hautes en longues vagues.', 'L’horizon s’étire, piqué de quelques fermes isolées.', 'Un faucon tournoie très haut au-dessus de la lande.', 'Une haie de ronces longe un chemin creusé d’ornières.', 'Un vieux calvaire penche au bord du chemin.'],
    montagne: ['L’air est vif et chaque pas fait rouler des cailloux.', 'Des nuages s’accrochent aux sommets tout proches.', 'Le sentier serpente entre les rochers, au-dessus du vide.', 'Un torrent gronde au fond d’un ravin invisible.', 'Un aigle crie, quelque part entre les pics.'],
    marais: ['L’eau noire clapote entre les touffes de roseaux.', 'Une odeur de vase et de pourriture flotte dans l’air lourd.', 'Des nuées de moustiques dansent au-dessus des mares.', 'Les planches d’une vieille passerelle gémissent sous le poids.', 'Des bulles crèvent à la surface de l’eau, sans raison apparente.'],
    souterrain: ['L’eau suinte des parois et goutte dans le noir.', 'L’écho renvoie chaque bruit, déformé.', 'L’air est froid, immobile, chargé de poussière.', 'Des marques anciennes griffent la roche à hauteur d’homme.', 'Au loin, quelque chose racle la pierre, puis plus rien.'],
    arctique: ['La neige crisse et le froid mord le visage.', 'Le vent soulève des rideaux de poudre blanche.', 'La glace craque sourdement, très loin.', 'Tout est blanc, silencieux, aveuglant.', 'Des traces de pas à demi effacées se perdent dans la neige.'],
    urbain: ['Les rues grouillent de marchands, de charrettes et de chiens errants.', 'Des odeurs de pain chaud et d’égout se disputent la ruelle.', 'Une cloche sonne l’heure au-dessus des toits.', 'Des volets claquent, des voix s’interpellent d’une fenêtre à l’autre.', 'Deux gardes passent en traînant les pieds, la hallebarde sur l’épaule.'],
    ruines: ['Des colonnes brisées se dressent comme des dents cariées.', 'Le lierre a envahi les pierres sculptées.', 'Un silence de tombeau pèse sur les décombres.', 'Des inscriptions effacées courent encore sur un linteau.', 'Un corbeau s’envole d’une arche effondrée en croassant.']
  };
  var HEURES = ['À l’aube', 'En pleine journée', 'Au crépuscule', 'À la nuit tombée'];
  var METEO = {
    clair: ['une lumière rose pointe à l’horizon', 'le soleil brille dans un ciel limpide', 'le ciel s’embrase de rouge et d’or', 'les étoiles brillent par milliers'],
    gris: ['un jour pâle se lève sous les nuages', 'le ciel est bas et gris', 'la lumière décline sous un ciel couvert', 'la nuit est d’encre, sans lune'],
    pluie: ['une pluie fine accompagne le lever du jour', 'la pluie tombe sans discontinuer', 'une averse froide accompagne le soir', 'la pluie tambourine dans l’obscurité'],
    brume: ['une brume épaisse noie les alentours', 'la brume refuse de se lever', 'la brume monte avec le soir', 'un brouillard laiteux avale la nuit'],
    vent: ['un vent aigre se lève avec le jour', 'le vent souffle en longues rafales', 'le vent forcit à mesure que le jour baisse', 'le vent hurle dans les ténèbres'],
    orage: ['l’orage gronde déjà au loin', 'des éclairs zèbrent un ciel de plomb', 'l’orage éclate avec le soir', 'les éclairs déchirent la nuit'],
    neige: ['de légers flocons tombent dans l’aube grise', 'la neige tombe à gros flocons', 'la neige bleuit dans le soir', 'la neige étouffe tous les bruits de la nuit']
  };
  var METEO_NOM = { clair: 'beau temps', gris: 'ciel couvert', pluie: 'pluie', brume: 'brume', vent: 'vent', orage: 'orage', neige: 'neige' };
  function etat(c) {
    c.conteur = c.conteur || { vus: [], heure: 1, meteo: null };
    if (!c.conteur.vus) c.conteur.vus = [];
    if (c.conteur.heure === undefined) c.conteur.heure = 1;
    return c.conteur;
  }
  function meteo(c, env) {
    var co = etat(c);
    if (!co.meteo || co.meteo.jour !== c.jour) {
      var l = ['clair', 'clair', 'gris', 'gris', 'pluie', 'vent', 'brume', 'orage'];
      if (env === 'arctique') l = ['neige', 'neige', 'clair', 'gris', 'vent'];
      else if (env === 'montagne') l.push('neige', 'vent');
      else if (env === 'marais') l.push('brume', 'brume');
      co.meteo = { jour: c.jour, id: p(l) };
    }
    return co.meteo.id;
  }
  function moment(c, env) {
    var h = etat(c).heure;
    if (env === 'souterrain') return p(['Sous terre, impossible de savoir l’heure.', 'Loin de la lumière du jour, le temps semble suspendu.', 'Ici, il fait toujours nuit.']);
    return HEURES[h] + ', ' + METEO[meteo(c, env)][h] + '.';
  }
  /* Avance l'heure (0 aube … 3 nuit) ; passe au jour suivant au besoin. */
  function avancerTemps(c, n) {
    var co = etat(c), jour = false;
    co.heure += n || 1;
    while (co.heure > 3) { co.heure -= 4; c.jour++; jour = true; }
    return jour;
  }

  /* ================= Symboles communs ================= */
  var INDICES = ['une empreinte fraîche, bien trop grande pour un homme', 'un lambeau d’étoffe sombre accroché à une ronce', 'des traces de lutte toutes récentes',
    'un symbole gravé à la hâte dans le bois', 'une lettre à moitié brûlée', 'quelques pièces d’une frappe étrangère', 'une odeur de soufre tenace',
    'une porte forcée de l’intérieur', 'du sang séché sur une pierre', 'un bouton de manteau en argent ciselé', 'une carte griffonnée au charbon',
    'des cendres encore tièdes', 'un nom murmuré deux fois', 'une chaîne brisée au maillon limé'];
  var G = {
    indice: function (ctx) { return ctx.cible && Math.random() < 0.35 ? p(['un indice qui mène tout droit à ' + ctx.cible, 'la preuve que ' + ctx.cible + ' est passé par ici']) : choisir(INDICES, ctx); },
    terrain_piste: function (ctx) { return ({ foret: 'les feuilles mortes', plaine: 'les herbes hautes', montagne: 'la caillasse', marais: 'la vase', souterrain: 'la poussière des galeries', arctique: 'la neige fraîche', urbain: 'la foule des rues', ruines: 'les décombres' })[ctx.env] || 'le terrain'; },
    rdv: function (ctx) { return ctx.env === 'urbain' ? p(['dans l’arrière-salle d’une auberge enfumée', 'sous le porche d’un temple', 'au fond d’une échoppe aux volets clos']) : p(['au coin d’un feu de camp', 'près d’une borne moussue, au bord du chemin', 'dans une ferme isolée', 'à l’ombre d’un vieux chêne']); },
    souffle: ['L’air semble retenir son souffle.', 'Chaque bruit fait sursauter.', 'Le cœur bat plus vite.', 'Un silence anormal règne.']
  };

  /* ================= Genres de scène ================= */
  var GENRES = {
    accroche: { prog: 2, danger: 2, social: true, actions: ['questionner', 'jauger', 'negocier', 'accepter'],
      ouv: ['{moment} {h} retrouve {com} {rdv}. {portrait} [Sans détour|À voix basse|Après quelques politesses], {com_il} expose son affaire : il faut {objectif}. Il s’agit de {cible}. « [Personne d’autre ne peut s’en charger|Je n’ai plus personne vers qui me tourner|On m’a dit que vous étiez la bonne personne]. » En échange, {com} promet {recompense}.'],
      ok: ['Marché conclu. {h} sait désormais où chercher : {lieuQ_n}.', 'L’accord est scellé. Prochaine étape : {lieuQ_n}.'],
      ko: ['La discussion laisse un goût amer, mais {h} accepte l’affaire. Direction {lieuQ_n}.', '{com} et {h} se quittent froidement. L’affaire est acceptée malgré tout : direction {lieuQ_n}.'] },
    piste: { prog: 3, danger: 3, actions: ['fouiller', 'interroger', 'pister', 'savoir', 'guetter', 'temps'],
      ouv: ['{moment} {decor} {h} [arrive {a_lieu}|atteint enfin {lieu_n}|parcourt les abords {de_lieu}], en quête d’indices. {obstacle}. [Il va falloir être malin.|Rien ne sera simple.|Chaque détail compte.]'],
      ok: ['{h} tient enfin une piste solide. Les pièces du puzzle commencent à s’assembler.', 'Les indices concordent : {h} sait maintenant où frapper.'],
      ko: ['La piste est maigre, mais {h} refuse d’abandonner. Il faudra faire avec.', '{h} repart avec plus de questions que de réponses… et quelqu’un, désormais, l’attend de pied ferme.'] },
    complication: { prog: 2, danger: 2, actions: ['forcer', 'contourner', 'parlementer', 'tenir'],
      ouv: ['{moment} {decor} [Alors que tout semblait sur la bonne voie|Au moment où {h} croit tenir une piste|Sans prévenir], la situation bascule : {complication_min}. [Il faut réagir, et vite.|{h} doit prendre une décision.|Rien ne se passe comme prévu.]'],
      ok: ['{h} surmonte le coup du sort. La route vers {lieuQ_n} est de nouveau ouverte.', 'Le coup de théâtre est surmonté. Il est temps d’en finir, {a_lieuQ}.'],
      ko: ['Le coup est rude et {h} en garde des traces. Mais il faut avancer : tout se jouera {a_lieuQ}.'] },
    confrontation: { prog: 1, danger: 9, combat: true, actions: [],
      ouv: ['{moment} {decor} {h} touche au but : {lieu_n}. {souffle} {obstacle}. [Il n’y a plus de retour en arrière possible.|C’est maintenant ou jamais.|Tout va se jouer ici.]'],
      ok: ['Le silence retombe sur {lieu_n}. {h} a triomphé : il ne reste qu’à rendre compte à {com}.', 'C’est fini. Le souffle court, {h} contemple ce qui vient d’arriver. {com} attend des nouvelles.'],
      ko: ['{h} a dû fuir. L’affaire n’est pas réglée, mais il faudra bien rendre des comptes à {com}.'] },
    denouement: { prog: 1, danger: 2, social: true, actions: ['reclamer', 'exiger', 'raconter'],
      ouv: ['{moment} {h} retrouve {com} pour lui rendre compte de « {fil} ». {com} attend, [impatient{e}|nerveux{eu}|les traits tirés]. Le moment est venu de réclamer {recompense}.'],
      ok: ['L’affaire est close. {com} n’oubliera pas ce que {h} a fait.', 'Une page se tourne. Le nom de {h} commence à circuler dans la région.'],
      ko: ['L’affaire est close, mais les adieux sont froids.'] },
    explorer: { prog: 2, danger: 3, actions: ['observer', 'fourrager', 'recoin', 'sentier'],
      ouv: ['{moment} {decor} {h} quitte le chemin pour explorer {environs}. {detail}'],
      ok: ['L’exploration a porté ses fruits. {h} reprend la route.', 'La région n’a plus tout à fait les mêmes secrets pour {h}.'],
      ko: ['L’exploration tourne court. {h} rebrousse chemin, plus prudent qu’à l’aller.'] },
    fil: { prog: 2, danger: 2, actions: ['fouiller', 'interroger', 'pister', 'savoir', 'guetter', 'temps'],
      ouv: ['{moment} {decor} {h} reprend l’affaire : « {fil} ». {note}'],
      ok: ['L’affaire « {fil} » trouve son issue.', '« {fil} » : voilà une chose réglée.'],
      ko: ['« {fil} » reste en suspens. Ce n’est que partie remise.'] },
    libre: { prog: 2, danger: 2, actions: ['fouiller', 'interroger', 'savoir', 'guetter', 'forcer', 'temps'],
      ouv: ['{moment} {decor} {attendu}'],
      ok: ['La scène touche à sa fin : {h} a obtenu ce qu’il fallait.'], ko: ['La scène s’achève sur un goût d’inachevé.'] },
    voyage: { prog: 2, danger: 3, actions: ['marcher', 'orienter', 'chasserV', 'prudence'],
      ouv: ['{moment} {h} quitte {depart_n} et prend la route {de_dest} : {jours} de voyage à travers {terrain_voyage}. {decor}', '{moment} Le sac sur l’épaule, {h} se met en route vers {dest_n}. {jours} de marche l’attendent. {decor}'],
      ok: ['Au terme du voyage, {dest_n} apparaît enfin. {h} est arrivé{he} à bon port.', 'La route a été longue, mais {h} atteint {dest_n}.'],
      ko: ['{h} arrive {a_dest} fourbu{he}, avec du retard et quelques bleus de plus.'] },
    donjon: { prog: 3, danger: 3, actions: ['avancerD', 'fouillerD', 'forcerD', 'faufilerD'],
      ouv: ['{moment} {h} s’enfonce dans {lieu_n}, une torche à la main. {salle}'],
      ok: ['Au cœur {de_lieu}, {h} découvre enfin ce que l’endroit protégeait : {tresor}.'],
      ko: ['{h} ressort {de_lieu} plus vite qu’{hil} n’y est entré{he}, sans avoir vu le fond. Peut-être une autre fois.'] },
    ville: { prog: 3, danger: 3, actions: ['taverne', 'notable', 'marche', 'temple', 'flaner', 'partir'],
      ouv: ['{moment} {h} [arrive à|entre dans|franchit les abords de] {lieu_n} : {taille_un} de {pop}, qui vit de {specialite}. [La population est|Il suffit de quelques pas pour découvrir une communauté|On y trouve une population] {ambiance}. [On murmure que|Dans toutes les conversations, un sujet revient :|Les visages sont soucieux, et pour cause :] {probleme}.'],
      ok: ['{h} quitte {lieu_n} avec des nouvelles fraîches et l’esprit plus clair.', '{lieu_n} n’a plus de secrets pour {h}. La route appelle.'],
      ko: ['{h} quitte {lieu_n} sous les regards méfiants. Mieux vaut ne pas s’y attarder.'] },
    repos: { prog: 0, danger: 0, actions: [],
      ouv: ['{moment} {h} trouve un coin abrité et s’accorde un moment de répit. [Le feu crépite doucement.|Les muscles se dénouent enfin.|Pour la première fois depuis longtemps, rien ne presse.] {decor}'],
      ok: ['{h} a repris des forces.'] }
  };

  /* ================= Actions ================= */
  var ACTIONS = {
    questionner: { nom: 'Poser les bonnes questions', carac: 'INT', effet: 'indice',
      ok: ['{h} pose les questions qui dérangent. {com} finit par lâcher un détail précieux : {obstacle_min}.', '{h} recoupe chaque réponse. Un point ressort : {obstacle_min}.'],
      ko: ['{com} élude les questions avec un sourire crispé. {h} n’en tire rien de plus.', 'Les questions de {h} agacent {com}, qui se ferme comme une huître.'] },
    jauger: { nom: 'Jauger {com}', carac: 'PER', effet: 'indice',
      ok: ['{h} observe {com} : un tremblement des mains, un regard qui fuit. {com_ilm} ne dit pas tout, c’est certain.', 'À la façon dont {com} évite certains sujets, {h} devine qu’il y a anguille sous roche.'],
      ko: ['{com} reste impénétrable.', 'Impossible de lire quoi que ce soit sur le visage de {com}.'] },
    negocier: { nom: 'Négocier la récompense', carac: 'CHA', effet: 'avance',
      ok: ['{h} marchande avec aplomb. {com} soupire, puis accepte de verser une avance.', 'Quelques arguments bien sentis, et {com} consent à payer une partie d’avance.'],
      ko: ['{com} se raidit : « C’est à prendre ou à laisser. »', 'Le marchandage tourne court : {com} n’apprécie pas qu’on doute de sa parole.'] },
    accepter: { nom: 'Accepter sans discuter', auto: true, fin: true, aide: 'conclut l’accord, sans en savoir plus',
      ok: ['{h} accepte l’affaire. Une poignée de main scelle l’accord.', '« Marché conclu. » {com} semble soulagé{e}.'] },
    reclamer: { nom: 'Réclamer son dû', carac: 'CHA', fin: true,
      ok: ['{com} tient parole et remet à {h} ce qui était promis, avec des remerciements sincères.'],
      ko: ['{com} rechigne, invoque des difficultés… puis finit par payer, à contrecœur.'] },
    exiger: { nom: 'Exiger davantage', carac: 'CHA', diff: 3, effet: 'prime',
      ok: ['Devant l’insistance de {h}, {com} ajoute une bourse bien remplie.'],
      ko: ['{com} se vexe : « Vous oubliez à qui vous parlez ! »'] },
    raconter: { nom: 'Raconter l’aventure', auto: true, fin: true, aide: 'conclut la scène',
      ok: ['{h} fait le récit de ses exploits. {com} écoute sans l’interrompre, puis paie ce qui était convenu.'] },

    fouiller: { nom: 'Fouiller les lieux', carac: 'PER', effet: 'indice',
      ok: ['{h} passe les lieux au peigne fin et met la main sur {indice}.', 'Sous des débris, {h} découvre {indice}. Voilà qui change tout.'],
      ko: ['{h} retourne tout sans rien trouver d’utile, et le temps passe.', 'Une planche cède sous les pas de {h} : la fouille fait plus de bruit que prévu.'] },
    interroger: { nom: function (ctx) { return ctx.env === 'urbain' ? 'Interroger les habitants' : 'Chercher des témoins'; }, carac: 'CHA', effet: 'indice',
      ok: ['À force de patience, quelqu’un finit par parler et évoque {indice}.', 'Une vieille femme fait signe à {h} d’approcher et lui chuchote ce qu’elle a vu : {indice}.'],
      ko: ['Les visages se ferment, les portes aussi. Personne n’a rien vu.', 'Les questions de {h} attirent l’attention, et pas la bonne.'] },
    pister: { nom: 'Suivre les traces', carac: 'PER', effet: 'indice',
      ok: ['{h} relève une piste nette et la suit jusqu’à {indice}.', 'Les traces sont discrètes, mais {h} ne les lâche pas. Elles mènent à {indice}.'],
      ko: ['La piste se perd dans {terrain_piste}.', '{h} suit une fausse piste pendant des heures.'] },
    savoir: { nom: 'Rassembler ses connaissances', carac: 'INT', effet: 'indice',
      ok: ['{h} rassemble ses souvenirs : une vieille histoire revient, et un détail prend soudain tout son sens.', 'Des lectures anciennes reviennent à l’esprit de {h} : tout se rattache à {indice}.'],
      ko: ['{h} a beau réfléchir, rien ne revient.', 'Les souvenirs de {h} restent flous et contradictoires.'] },
    guetter: { nom: 'Observer sans être vu', carac: 'AGI', effet: 'indice',
      ok: ['Depuis sa cachette, {h} observe les allées et venues et repère {indice}.', '{h} se fond dans le décor et surprend une conversation : il est question de {indice}.'],
      ko: ['Un craquement trahit {h} : quelqu’un a regardé dans sa direction.', 'Après des heures d’attente, {h} n’a rien vu de nouveau.'] },
    temps: { nom: 'Prendre tout son temps', auto: true, danger: 1, heure: 1, aide: 'objectif +1, mais danger +1 et une heure passe',
      ok: ['{h} avance pas à pas, sans rien négliger. C’est efficace, mais les heures filent et d’autres en profitent.'] },

    forcer: { nom: 'Forcer le passage', carac: 'FOR',
      ok: ['D’un coup d’épaule, {h} fait céder ce qui barrait la route.', '{h} ne s’embarrasse pas de finesse et force le passage.'],
      ko: ['{h} s’arc-boute en vain et se fait mal dans l’effort.', 'L’obstacle tient bon ; {h} y laisse des forces.'] },
    contourner: { nom: 'Trouver une autre voie', carac: 'AGI',
      ok: ['{h} repère un passage que personne n’avait vu et s’y faufile.', 'Avec souplesse, {h} contourne la difficulté.'],
      ko: ['Le détour s’avère une impasse.', '{h} glisse et doit rebrousser chemin.'] },
    parlementer: { nom: 'Parlementer', carac: 'CHA',
      ok: ['Quelques mots bien choisis suffisent : la tension retombe.', '{h} trouve les mots justes et gagne un allié de circonstance.'],
      ko: ['Les mots de {h} jettent de l’huile sur le feu.', 'Personne n’écoute ; les esprits s’échauffent.'] },
    tenir: { nom: 'Serrer les dents et tenir bon', carac: 'VOL',
      ok: ['{h} serre les dents et tient bon. La tempête finit par passer.', 'Rien ne fait plier {h}.'],
      ko: ['{h} vacille : la fatigue et le doute gagnent du terrain.', 'C’en est trop, même pour {h}.'] },

    observer: { nom: 'Grimper sur une hauteur pour observer', carac: 'PER', effet: 'decouverte',
      ok: ['Du haut d’un promontoire, {h} embrasse la région du regard et repère {decouverte}.'],
      ko: ['La vue est bouchée ; {h} redescend bredouille.', 'La pierre est glissante : {h} manque de chuter.'] },
    fourrager: { nom: 'Chasser et cueillir', carac: 'PER', effet: 'rations',
      ok: ['{h} revient avec du gibier et des baies : de quoi tenir quelques jours.', 'Un collet bien placé, quelques racines comestibles : {h} ne mourra pas de faim.'],
      ko: ['Rien ne mord, rien ne pousse. Le ventre de {h} gargouille.'] },
    recoin: { nom: 'Explorer un recoin étrange', carac: 'INT', effet: 'trouvaille',
      ok: ['Dans un recoin oublié, {h} déniche {trouvaille}.', 'Derrière une pierre descellée, {h} trouve {trouvaille}.'],
      ko: ['Le recoin cachait surtout des ennuis.', 'Rien qu’un nid de vermine, qui n’apprécie pas la visite.'] },
    marcher: { nom: 'Avaler les lieues', carac: 'CON',
      ok: ['Une longue journée de marche : {h} avance sans faiblir.', 'Le pas régulier, {h} couvre une belle distance avant la nuit.'],
      ko: ['La route est rude : les pieds en sang, {h} n’avance qu’à grand-peine.', 'Une ornière, une cheville tordue : la journée est pénible.'] },
    orienter: { nom: 'Chercher le meilleur chemin', carac: 'PER', effet: 'indice',
      ok: ['{h} repère un raccourci que les cartes ignorent.', 'D’après le soleil et la mousse des arbres, {h} garde le bon cap.'],
      ko: ['{h} s’égare et doit revenir sur ses pas.', 'Le sentier choisi ne mène nulle part.'] },
    chasserV: { nom: 'Chasser en chemin', carac: 'PER', effet: 'rations',
      ok: ['Un lièvre, quelques baies : {h} se nourrit de la route.'],
      ko: ['La chasse ne donne rien, et la journée est perdue à moitié.'] },
    prudence: { nom: 'Avancer prudemment', auto: true, heure: 2, aide: 'sûr, mais plus lent',
      ok: ['{h} avance à pas comptés, l’œil aux aguets. Rien ne {hle} surprendra, mais la journée passe vite.'] },
    avancerD: { nom: 'Avancer avec prudence', carac: 'PER',
      ok: ['{h} repère à temps le piège : {piege_min}. Le passage est sûr.', '{h} progresse pas à pas et ne laisse rien au hasard.'],
      ko: ['{piege} ! {h} n’a rien vu venir.', 'Un déclic sous le pied : {piege_min}.'] },
    fouillerD: { nom: 'Fouiller la salle', carac: 'PER', effet: 'trouvaille',
      ok: ['Dans un recoin de la salle, {h} déniche {trouvaille}.'],
      ko: ['La fouille réveille quelque chose qui dormait.', 'Rien, sinon de la poussière et des os.'] },
    forcerD: { nom: 'Enfoncer le passage', carac: 'FOR',
      ok: ['D’un coup d’épaule, {h} fait céder la porte vermoulue.'],
      ko: ['La porte tient bon et le vacarme résonne dans tout le souterrain.'] },
    faufilerD: { nom: 'Se faufiler sans bruit', carac: 'AGI',
      ok: ['Sans un bruit, {h} se glisse vers la salle suivante.'],
      ko: ['Un caillou roule sous le pied de {h}. L’écho se répercute longuement.'] },
    taverne: { nom: 'Boire un verre à « {taverne} »', carac: 'CHA', effet: 'rumeurVille',
      ok: ['À « {taverne} », {tenancier}, {tenancierRole}, sert à {h} {specTaverne}. Les langues se délient : {rumeurTaverne}', 'La salle de « {taverne} » est bondée. {h} paie une tournée et récolte une rumeur : {rumeurTaverne}'],
      ko: ['À « {taverne} », les conversations s’arrêtent à l’entrée de {h}. On n’aime pas les étrangers ici.', 'Une remarque de travers, un regard de trop : {h} ressort de « {taverne} » sans rien avoir appris.'] },
    notable: { nom: 'Rencontrer {notable_n}', carac: 'CHA', effet: 'queteVille', fin: false,
      ok: ['{notable_n}, {notableMetier}, reçoit {h} et ne tarde pas à parler du problème qui ronge {lieu_n}. Une offre suit.'],
      ko: ['{notable_n} n’a pas de temps à perdre avec un inconnu.', 'On fait attendre {h} des heures, pour rien.'] },
    marche: { nom: 'Faire des provisions au marché', auto: true, effet: 'marche', aide: 'quelques pièces contre rations et torches',
      ok: ['Entre les étals, {h} remplit son sac : pain, viande séchée, torches.', 'Le marché est animé. {h} marchande et repart les bras pleins de provisions.'] },
    temple: { nom: 'Se faire soigner', auto: true, effet: 'soins', aide: 'une offrande contre des soins',
      ok: ['Au temple, une prêtresse panse les plaies de {h} contre une modeste offrande.', 'Un guérisseur du coin applique un onguent qui sent fort, mais qui fait des merveilles.'] },
    flaner: { nom: 'Flâner dans les rues', auto: true, effet: 'flaner', aide: 'laisser venir l’imprévu',
      ok: ['{h} se laisse porter par la foule, l’œil aux aguets.'] },
    partir: { nom: 'Reprendre la route', auto: true, fin: true, aide: 'quitter la ville',
      ok: ['{h} reprend la route.'] },
    sentier: { nom: 'Suivre un sentier oublié', carac: 'AGI', effet: 'decouverte',
      ok: ['Le vieux sentier mène {h} jusqu’à {decouverte}.'],
      ko: ['Le sentier se perd dans les broussailles et {h} s’égare.'] }
  };

  /* ================= Finales de quête majeure ================= */
  /* Chaque finale (hors « abattre le chef ») est une grande scène à 4 étapes
     avec ses propres actions. Danger au maximum : combat, ou échec (social). */
  var FINALES = {
    rituel: { titre: 'Le rituel', social: false,
      ouv: '{moment} {lieu_n}. Des chants montent des profondeurs : le grand rituel de {menace} a commencé. Chaque minute compte : il faut l’interrompre avant que tout ne bascule.',
      actions: [['Se glisser parmi les fidèles', 'AGI', 'Capuche rabattue, {h} se fond dans la foule des fidèles et approche du cercle.', 'Un fidèle dévisage {h} et donne l’alerte.'],
        ['Saboter les cercles runiques', 'INT', '{h} efface un symbole clé : une lueur vacille, les chants se troublent.', 'Le symbole résiste et brûle les doigts de {h}.'],
        ['Abattre les gardiens du cercle', 'FOR', 'Les gardiens tombent un à un sous les coups de {h}.', 'Les gardiens repoussent {h} sans faiblir.'],
        ['Opposer sa volonté à la magie', 'VOL', '{h} serre les dents et brise l’emprise de la magie sur ses pensées.', 'La magie s’insinue dans l’esprit de {h}, qui vacille.']],
      ok: 'Le dernier cercle se brise dans un fracas de lumière. Le rituel est rompu.', ko: 'Le rituel est interrompu in extremis, mais l’onde de choc a laissé des traces sur {h} et sur la région.' },
    siege: { titre: 'Le siège', social: false,
      ouv: '{moment} Les forces de {menace} encerclent {lieu_n}. Derrière les palissades, les habitants serrent leurs armes de fortune et se tournent vers {h}.',
      actions: [['Tenir la brèche', 'FOR', '{h} tient la brèche et repousse l’assaut.', 'La brèche s’élargit ; il faut reculer.'],
        ['Organiser la défense', 'CHA', 'Sous la voix de {h}, la panique laisse place à l’ordre : chacun sait où se tenir.', 'Les ordres se perdent dans le tumulte.'],
        ['Mener une sortie nocturne', 'AGI', 'Dans la nuit, {h} incendie les machines de siège ennemies.', 'La sortie tourne court ; il faut rentrer au pas de course.'],
        ['Rationner et soigner', 'INT', 'Grâce à {h}, vivres et soins tiendront encore quelques jours.', 'Les réserves fondent plus vite que prévu.']],
      ok: 'À l’aube, les assaillants lèvent le camp. {lieu_n} a tenu bon.', ko: '{lieu_n} a tenu, mais une partie des maisons n’est plus que cendres.' },
    intrigue: { titre: 'Le procès', social: true,
      ouv: '{moment} Le conseil s’est réuni {a_lieu}. Parmi ces visages graves se cachent les complices de {menace}. {h} n’aura qu’une chance de les démasquer.',
      actions: [['Présenter les preuves', 'PER', 'Pièce après pièce, {h} étale les preuves. Un murmure parcourt l’assemblée.', 'Une preuve manque : on ricane dans les rangs.'],
        ['Faire parler un témoin', 'CHA', 'Le témoin, rassuré par {h}, raconte tout.', 'Le témoin se rétracte, terrorisé.'],
        ['Tendre un piège au traître', 'INT', 'Le traître tombe dans le piège tendu par {h} et se trahit devant tous.', 'Le traître flaire le piège et retourne la situation.'],
        ['Plaider devant le conseil', 'VOL', 'La voix de {h} ne tremble pas. Les conseillers baissent les yeux.', 'Les mots de {h} se heurtent à un mur d’indifférence.']],
      ok: 'Le masque tombe. Les complices de {menace} sont arrêtés sous les huées.', ko: 'La vérité éclate enfin, mais trop tard pour empêcher quelques complices de fuir.' },
    evacuation: { titre: 'L’évacuation', social: false,
      ouv: '{moment} {menace} marche sur {lieu_n}. Il faut faire partir les habitants avant qu’il ne soit trop tard.',
      actions: [['Convaincre les récalcitrants', 'CHA', 'Les derniers indécis finissent par rassembler leurs affaires.', 'Certains refusent obstinément de quitter leur maison.'],
        ['Trouver une route sûre', 'PER', '{h} repère un chemin à l’abri des regards.', 'La route choisie est coupée ; il faut rebrousser chemin.'],
        ['Retenir les poursuivants', 'FOR', '{h} fait barrage le temps que la colonne passe.', 'Les poursuivants débordent {h}.'],
        ['Porter les blessés', 'CON', '{h} porte un vieillard sur son dos sans ralentir.', 'L’épuisement gagne ; la colonne ralentit.']],
      ok: 'Le dernier chariot franchit le col. Derrière, {lieu_n} n’est plus qu’une ruine, mais ses habitants sont sauvés.', ko: 'La plupart des habitants sont sauvés. Pas tous.' },
    remede: { titre: 'Le remède', social: false,
      ouv: '{moment} Le mal répandu par {menace} gagne chaque jour. Le remède existe : il se trouve {a_lieu}, et le temps presse.',
      actions: [['Déchiffrer les anciens grimoires', 'INT', 'La formule apparaît entre les lignes d’un grimoire oublié.', 'Les grimoires se contredisent.'],
        ['Trouver l’ingrédient rare', 'PER', '{h} trouve enfin la plante, cachée sous les ronces.', 'Rien ; il faudra chercher ailleurs.'],
        ['Préparer le remède', 'INT', 'Le mélange prend une couleur d’or : c’est le bon.', 'Le mélange tourne au noir. Il faut recommencer.'],
        ['Braver le mal', 'CON', '{h} résiste au mal qui l’assaille.', 'Le mal mord {h} jusqu’aux os.']],
      ok: 'Le remède coule dans les veines des malades. Un à un, ils se relèvent.', ko: 'Le remède fonctionne, mais il est arrivé trop tard pour certains.' },
    alliance: { titre: 'Le grand conseil', social: true,
      ouv: '{moment} Seul, personne ne peut arrêter {menace}. {h} a réuni {a_lieu} les chefs des villages, les seigneurs et les guildes. Les regards sont méfiants.',
      actions: [['Prononcer un discours', 'CHA', 'Les paroles de {h} enflamment l’assemblée.', 'Le discours tombe à plat.'],
        ['Apaiser les vieilles rivalités', 'INT', '{h} trouve un terrain d’entente entre deux clans ennemis.', 'Une vieille querelle ressurgit et envenime tout.'],
        ['Montrer les preuves du danger', 'PER', 'Devant les preuves, même les sceptiques blêmissent.', 'On accuse {h} d’exagérer.'],
        ['Donner sa parole', 'VOL', 'La parole de {h} pèse lourd : on lui fait confiance.', 'On doute de la parole d’un aventurier.']],
      ok: 'Les mains se serrent. Unie, la région se dresse contre {menace}, qui recule et disparaît.', ko: 'L’alliance se fait, fragile et tardive. Elle suffit, de justesse.' },
    vol: { titre: 'Le grand vol', social: false,
      ouv: '{moment} Le pouvoir de {menace} repose sur un objet : {artefact}. Il se trouve {a_lieu}, sous bonne garde.',
      actions: [['Repérer les rondes', 'PER', '{h} mémorise chaque ronde, chaque relève.', 'Une ronde imprévue manque de surprendre {h}.'],
        ['Crocheter les serrures', 'AGI', 'Clic. La serrure cède sans un bruit.', 'Le crochet se brise dans la serrure.'],
        ['Créer une diversion', 'CHA', 'Les gardes accourent ailleurs : la voie est libre.', 'La diversion ne trompe personne.'],
        ['S’enfuir avec le butin', 'AGI', '{h} file dans la nuit, l’objet serré contre sa poitrine.', 'Une alarme retentit.']],
      ok: 'Privé de {artefact}, {menace} s’effondre comme un château de cartes.', ko: '{artefact} est à {h}, mais la fuite a laissé des traces.' }
  };
  Object.keys(FINALES).forEach(function (k) {
    var F = FINALES[k], ids = F.actions.map(function (a, i) {
      var id = 'f_' + k + i;
      ACTIONS[id] = { nom: a[0], carac: a[1], ok: [a[2]], ko: [a[3]] };
      return id;
    });
    GENRES['finale_' + k] = { prog: 4, danger: 4, social: F.social, actions: ids, ouv: [F.ouv], ok: [F.ok], ko: [F.ko] };
  });
  function titreFinale(q) { return (FINALES[q.finale] || {}).titre ? FINALES[q.finale].titre + ' ' + formes(q.lieuNom).a : 'Confrontation ' + formes(q.lieuNom).a; }

  /* ================= Contexte ================= */
  function heros(c) { return AV() ? AV().heros(c) : null; }
  function genreDe(c, s) {
    if (!s) return 'libre';
    if (['repos', 'explorer', 'fil', 'ville', 'voyage', 'donjon'].indexOf(s.type) >= 0) return s.type;
    var f = s.filId ? fil(c, s.filId) : null;
    if (f && f.quete && f.quete.etape === 3 && f.quete.finale && GENRES['finale_' + f.quete.finale]) return 'finale_' + f.quete.finale;
    if (f && f.quete && f.quete.etape < 5) return ['accroche', 'piste', 'complication', 'confrontation', 'denouement'][f.quete.etape];
    if (f) return 'fil';
    return 'libre';
  }
  function contexte(c, s, genre) {
    var co = etat(c), hP = heros(c), ici = M().ici(c), f = s && s.filId ? fil(c, s.filId) : null, q = f && f.quete;
    var env = (ici && ici.env) || (AV().envCourant ? AV().envCourant(c) : null) || 'plaine';
    var ctx = { _vus: co.vus, h: hP ? hP.nom : 'le héros', env: env,
      moment: moment(c, env), decor: DECOR[env] || DECOR.plaine, attendu: s ? s.attendu : '' };
    function poserLieu(nom) { var fo = formes(nom); ctx.lieu_n = fo.n; ctx.a_lieu = fo.a; ctx.de_lieu = fo.de; }
    if (ici) poserLieu(ici.nom); else { ctx.lieu_n = 'les environs'; ctx.a_lieu = 'dans les environs'; ctx.de_lieu = 'de la région'; }
    ctx.environs = ici ? 'les environs ' + ctx.de_lieu : 'les alentours';
    if (ici && ici.ville && COF.Villes) Object.assign(ctx, COF.Villes.contexte(ici));
    /* accords selon le genre du héros (choisi dans le menu de l'aventure) */
    var fem = hP && hP.genre === 'féminin';
    ctx.he = fem ? 'e' : ''; ctx.hil = fem ? 'elle' : 'il'; ctx.hle = fem ? 'la' : 'le';
    if (c.saga) { ctx.menace = c.saga.nom; ctx.but = c.saga.but; ctx.artefact = c.saga.artefact || 'un artefact maudit'; }
    if (s && s.voyage) {
      var vo = s.voyage, fd = formes(vo.destNom), fp = formes(vo.departNom || 'le dernier lieu');
      Object.assign(ctx, { dest_n: fd.n, de_dest: fd.de, a_dest: fd.a, depart_n: fp.n, jours: vo.jours + ' jour' + (vo.jours > 1 ? 's' : ''),
        terrain_voyage: ({ foret: 'les bois', plaine: 'la lande', montagne: 'les montagnes', marais: 'les marais', arctique: 'les étendues glacées', urbain: 'les routes marchandes', souterrain: 'les galeries', ruines: 'les terres en ruine' })[vo.env] || 'la campagne',
        decor: DECOR[vo.env] || DECOR.plaine });
    }
    if (s && s.donjon && s.donjon.salle) {
      var sl = s.donjon.salle;
      ctx.salle = maj(sansPoint(sl.forme)) + '. ' + maj(sansPoint(sl.etat)) + '.' + (/rien de particulier/i.test(sl.particularite) ? '' : ' ' + maj(sansPoint(sl.particularite)) + '.');
      ctx.piege = maj(sansPoint(sl.piege)); ctx.piege_min = min1(sansPoint(sl.piege));
      ctx.tresor = s.donjon.tresor || 'un trésor oublié';
    }
    if (f) { ctx.fil = f.nom; ctx.note = f.note && !q ? sansPoint(f.note.split('\n')[0]) + '.' : ''; }
    if (q) {
      var com = pnj(c, q.commanditaire), mt = com && /Commanditaire — ([^\n]*)/.exec(com.note || '');
      Object.assign(ctx, { com: q.comNom, com_il: q.fem ? 'elle' : 'il', com_ilm: q.fem ? 'Elle' : 'Il', e: q.fem ? 'e' : '', eu: q.fem ? 'se' : 'x',
        objectif: pj(min1(sansPoint(q.objectif))), cible: pj(min1(sansPoint(q.cible))),
        obstacle: pj(maj(sansPoint(q.obstacle))), obstacle_min: pj(min1(sansPoint(q.obstacle))),
        complication_min: pj(min1(sansPoint(q.complication))), recompense: pj(min1(sansPoint(q.recompense))),
        lieuQ_n: formes(q.lieuNom).n, a_lieuQ: formes(q.lieuNom).a, portrait: mt ? q.comNom + ' : ' + pj(min1(sansPoint(mt[1]))) + '.' : '' });
      if (genre === 'piste' || genre === 'confrontation') poserLieu(ici && ici.id === q.lieu ? ici.nom : q.lieuNom);
    }
    return ctx;
  }

  /* ================= Scène ================= */
  function nomAction(id, ctx) { var a = ACTIONS[id]; return polir(ex(a.nom, ctx)); }
  function caracHeros(c, k) { var hP = heros(c); return hP && COF.Calc ? COF.Calc.carac(hP, k) : 0; }
  /* Trois actions au plus : la meilleure carac du héros d'abord, une
     action sans jet (sûre mais coûteuse) en dernier. */
  function tirerChoix(c, g, dernier) {
    var l = GENRES[g].actions.slice();
    if (l.length <= 3) return l;
    /* les actions sans jet tournent aussi (et la dernière jouée laisse sa place) */
    var autos = l.filter(function (id) { return ACTIONS[id].auto && id !== dernier; }).sort(function () { return Math.random() - 0.5; }),
      jets = l.filter(function (id) { return !ACTIONS[id].auto && id !== dernier; });
    if (!autos.length) autos = l.filter(function (id) { return ACTIONS[id].auto; });
    jets.sort(function () { return Math.random() - 0.5; });
    jets.sort(function (a, b) { return caracHeros(c, ACTIONS[b].carac) - caracHeros(c, ACTIONS[a].carac); });
    var out = [jets[0]].concat(jets.slice(1).sort(function () { return Math.random() - 0.5; }).slice(0, autos.length ? 1 : 2));
    return out.concat(autos.slice(0, 1));
  }
  function difficulte(c, a, g) {
    var rep = g === 'ville' && COF.Saga ? COF.Saga.reputation(M().ici(c)) : 0;   /* une bonne réputation ouvre les portes */
    return difficulteBase(c) + (g === 'complication' || g === 'donjon' ? 1 : 0) + (a.diff || 0) - rep;
  }
  /* Compagnons du héros (alliés du Carnet et compagnons de voie). */
  function compagnons(c) {
    var hP = heros(c), l = (COF.Expedition ? COF.Expedition.allies(c) : []).map(function (x) { return x.nom; });
    return l.concat(hP ? (hP.compagnons || []).map(function (x) { return x.nom; }) : []).filter(Boolean);
  }
  var REMARQUES = ['{x} scrute les alentours, la main sur son arme.', '{x} plaisante à voix basse pour détendre l’atmosphère.', '{x} reste silencieux, perdu dans ses pensées.',
    '{x} fait remarquer à {h} que quelque chose cloche.', '{x} grommelle qu’on aurait mieux fait de rester à l’auberge.', '{x} jette un regard entendu à {h}.'];
  /* Une salle de donjon (générateur du module Donjon). */
  function nouvelleSalle() { return COF.DonjonCalc ? COF.DonjonCalc.genererTout({}, {}) : { forme: 'Une salle obscure', etat: 'Silencieuse', piege: 'Une dalle piégée', particularite: '', occupant: '' }; }
  /* Ce qui précède l'histoire : souvenirs, compagnons, réputation, menace. */
  function ajouts(c, s, ctx) {
    var t = [], ici = M().ici(c), comp = compagnons(c);
    /* un PNJ déjà rencontré ici refait surface */
    var connus = (c.pnj || []).filter(function (x) { return ici && x.lieuId === ici.id && !(x.compagnon && x.compagnon.actif) && x.jour !== c.jour; });
    if (connus.length && Math.random() < 0.5) {
      var x = p(connus), cx = Object.assign({}, ctx, { x: x.nom, j: x.jour || '?' });
      t.push(dire(x.attitude === 'hostile' ? ['{h} reconnaît {x} au loin, rencontré au jour {j}. Mieux vaut rester sur ses gardes.', '{x} est encore là. Son regard noir n’annonce rien de bon.']
        : x.attitude === 'allié' ? ['{x} est toujours là et salue {h} chaleureusement.', 'Un visage ami : {x}, qui n’a pas oublié le jour {j}.']
          : ['{h} recroise {x}, qui {hle} reconnaît d’un signe de tête.'], cx));
      x.vus = (x.vus || 0) + 1;
    }
    if (ici && ici.ville && COF.Saga) { var ph = COF.Saga.phraseRep(COF.Saga.reputation(ici)); if (ph) t.push(dire(ph, ctx)); }
    if (comp.length && Math.random() < 0.35) t.push(dire(REMARQUES, Object.assign({}, ctx, { x: p(comp) })));
    if (COF.Saga) {
      if (!c.saga) { COF.Saga.assurer(c); t.push(dire('Partout, une même rumeur court sur les lèvres : on parle de {menace} et de ses sombres desseins.', Object.assign({}, ctx, { menace: c.saga.nom }))); }
      else { var sg = COF.Saga.signe(c); if (sg) t.push(sg); }
    }
    return t.join(' ');
  }
  /* Raconte l'événement qui interrompt une scène (le détail reste dans le bandeau). */
  var INTERRUPTIONS = {
    pnjNouveau: ['Et soudain, quelqu’un s’approche : {x}.', 'C’est alors qu’un visage inconnu se présente : {x}.'],
    filNouveau: ['Et soudain, une autre affaire vient se mêler à celle-ci.', 'C’est alors qu’une nouvelle intrigue s’invite dans l’histoire.'],
    filAvance: ['Et soudain, une nouvelle inattendue fait avancer « {x} ».'],
    filRecule: ['Et soudain, une mauvaise nouvelle : « {x} » se complique.'],
    filFin: ['Et soudain, tout se précipite pour « {x} ».'],
    pnjAgit: ['C’est alors qu’arrivent des nouvelles de {x}, qui passe à l’action.'],
    pnjNeg: ['C’est alors qu’on apprend que {x} est en mauvaise posture.'],
    pnjPos: ['C’est alors qu’on apprend que la chance sourit à {x}.'],
    heroNeg: ['Et soudain, un coup du sort frappe {h}.', 'Mais la malchance s’en mêle.'],
    heroPos: ['Et soudain, la chance sourit à {h}.', 'C’est alors qu’un heureux hasard s’en mêle.'],
    ambiance: ['Et soudain, le temps tourne : le vent se lève et le ciel change.', 'Le temps change brusquement.'],
    lointain: ['Pendant ce temps, ailleurs, des forces se mettent en mouvement.']
  };
  function interruption(ev, ctx) {
    if (!ev) return 'Et soudain, tout bascule.';
    var x = ev.cible;
    if (!x && ev.effet) { var m = /: (.+?) \(/.exec(ev.effet) || /« (.+?) »/.exec(ev.effet); x = m ? m[1] : ''; }
    var l = INTERRUPTIONS[ev.focus];
    if (!l || (!x && /\{x\}/.test(l[0]))) return 'Et soudain, tout bascule.';
    return dire(l, Object.assign({}, ctx, { x: x || '' }));
  }
  /* Ouvre la scène : récit d'ouverture et premiers choix.     Renvoie les entrées à ajouter (avant celles du directeur). */
  function ouvrir(c, s) {
    if (!s || (s.type === 'voyage' && !s.voyage)) return [];
    if (s.type === 'donjon' && !s.donjon) s.donjon = { salles: 3 + d(2), n: 1, salle: nouvelleSalle() };
    var g = genreDe(c, s), G0 = GENRES[g], ctx = contexte(c, s, g);
    var der = c.scenes.filter(function (x) { return x.close && x.resume; }).slice(-1)[0];
    if (g === 'explorer') ctx.detail = sansPoint(COF.Oracle.detailSensoriel(null).detail) + '.';
    var txt = dire(G0.ouv, ctx);
    if (s.test && s.test.resultat === 'modifiee' && s.test.modif) txt += ' ' + polir('Pourtant, quelque chose cloche : ' + min1(s.test.modif));
    if (s.test && s.test.resultat === 'interrompue') txt += ' ' + interruption(s.test.histoire, ctx);
    var plus = ajouts(c, s, ctx); if (plus) txt += ' ' + plus;
    var progMax = g === 'voyage' ? Math.max(1, Math.min(4, s.voyage.jours)) : (g === 'donjon' ? s.donjon.salles : G0.prog);
    s.jeu = { genre: g, prog: 0, progMax: progMax, danger: 0, dangerMax: G0.danger, choix: [], fini: null, bonus: false };
    if (g === 'repos') { s.jeu.fini = 'reussite'; s.jeu.resume = dire(G0.ok, ctx); }
    else s.jeu.choix = tirerChoix(c, g);
    /* un imprévu peut surgir dès l'ouverture (exploration surtout) */
    s.jeu.evtDiffere = Math.random() < ({ explorer: 0.45, voyage: 0.4, fil: 0.25, libre: 0.25, piste: 0.15, donjon: 0.2 }[g] || 0);
    var out = [];
    if (der && s.n > 1) out.push({ t: 'recit', rappel: true, txt: 'Précédemment : ' + der.resume });
    else if (s.n === 1 && c.precedent && c.precedent.epilogue) out.push({ t: 'recit', rappel: true, txt: 'Précédemment, dans la campagne (« ' + c.precedent.titre + ' ») : ' + c.precedent.epilogue });
    out.push({ t: 'recit', txt: txt });
    return out;
  }
  /* Liste des choix affichables. */
  function choix(c, s) {
    if (!s || !s.jeu || s.jeu.fini) return [];
    if (s.jeu.evt && COF.Imprevus) return COF.Imprevus.choix(c, s);
    var ctx = contexte(c, s, s.jeu.genre);
    return s.jeu.choix.map(function (id, i) {
      var a = ACTIONS[id]; if (!a) return null;
      var o = { i: i, id: id, nom: nomAction(id, ctx), auto: !!a.auto, aide: a.aide };
      if (!a.auto) { o.carac = a.carac; o.mod = caracHeros(c, a.carac); o.diff = difficulte(c, a, s.jeu.genre); }
      return o;
    }).filter(Boolean);
  }

  function payer(c, n) {
    var hP = heros(c); if (!hP) return '';
    hP.bourse = hP.bourse || { po: 0, pa: 0, pc: 0 }; hP.bourse.po = (hP.bourse.po || 0) + n; COF.Store.sauver(hP);
    return '+' + n + ' po';
  }
  function blesser(c, n) {
    var hP = heros(c); if (!hP) return '';
    if (hP.pv === null || hP.pv === undefined) COF.Store.reinitialiser(hP);
    hP.pv = Math.max(1, hP.pv - n); COF.Store.sauver(hP);
    return '−' + n + ' PV (' + hP.pv + ')';
  }
  function niveau(c) { var hP = heros(c); return Math.max(1, (hP && hP.niveau) || 1); }
  /* Effets d'une réussite ; complète ctx pour la phrase. */
  function effet(c, s, a, ctx) {
    switch (a.effet) {
      case 'indice': s.jeu.bonus = true; return 'dé bonus au prochain jet';
      case 'avance': return payer(c, d(6) * niveau(c));
      case 'prime': return payer(c, (d(6) + d(6)) * niveau(c));
      case 'rations': { var n = 1 + d(3), rs = COF.Expedition.ressources(c); rs.rations += n; return '+' + n + ' rations'; }
      case 'trouvaille': {
        if (Math.random() < 0.5) { var po = d(6) * niveau(c) + d(6); ctx.trouvaille = p(['une bourse oubliée', 'un petit coffret rongé par le temps', 'une cache de contrebandier']); return payer(c, po); }
        var rs2 = COF.Expedition.ressources(c); rs2.torches += 2; ctx.trouvaille = 'un vieux sac contenant des torches encore sèches'; return '+2 torches';
      }
      case 'decouverte': {
        var l = Math.random() < 0.3 && COF.Villes ? COF.Villes.decouvrir(c) : decouvrirLieu(c);
        if (l) { ctx.decouverte = formes(l.nom).n; return (l.ville ? '🏘️ ' : '🗺️ ') + l.nom + ' ajouté à la carte'; }
        ctx.decouverte = 'un endroit qui mériterait une visite'; return '';
      }
      case 'rumeurVille': {
        var ru = AV().rumeur(); K().ajouterListe(c, 'fils', { nom: ru.nom, note: (ctx.rumeurTaverne || '') + '\n' + ru.texte });
        return '🧵 nouveau fil : ' + ru.nom;
      }
      case 'queteVille': return COF.Villes ? COF.Villes.queteDuNotable(c) : '';
      case 'marche': {
        var cout = Math.max(1, 2 + niveau(c) - (COF.Saga ? COF.Saga.reputation(M().ici(c)) : 0)), hP = heros(c), rs3 = COF.Expedition.ressources(c);
        if (hP) { hP.bourse = hP.bourse || { po: 0 }; cout = Math.min(cout, hP.bourse.po || 0); hP.bourse.po -= cout; COF.Store.sauver(hP); }
        rs3.rations += 3; rs3.torches += 2; return '−' + cout + ' po · +3 rations · +2 torches';
      }
      case 'soins': {
        var h2 = heros(c); if (!h2) return '';
        if (h2.pv === null || h2.pv === undefined) COF.Store.reinitialiser(h2);
        var off = Math.min(d(4), (h2.bourse && h2.bourse.po) || 0), av = h2.pv;
        if (h2.bourse) h2.bourse.po -= off;
        h2.pv = Math.min(COF.Calc.pvMax(h2), h2.pv + d(6) + d(6) + niveau(c)); COF.Store.sauver(h2);
        return '−' + off + ' po · +' + (h2.pv - av) + ' PV (' + h2.pv + ')';
      }
    }
    return '';
  }
  /* Nouveau lieu sur la carte, près du héros (relié par une route). */
  function decouvrirLieu(c) {
    var ici = M().ici(c); if (!ici) return null;
    var ang = Math.random() * Math.PI * 2, l = M().decouvrir(c, ici, { x: ici.x + Math.cos(ang) * 30, y: ici.y + Math.sin(ang) * 22 }, 0.9, null);
    if (l) M().relier(c, ici.id, l.id, 1);
    return l;
  }
  /* La difficulté suit la tension, le niveau du héros et le chapitre de la campagne. */
  function difficulteBase(c) { return 10 + Math.floor((c.tension || 5) / 2) + Math.floor((niveau(c) - 1) / 3) + ((COF.Saga ? COF.Saga.chapitre(c) : 1) - 1); }
  /* Jet d'une caractéristique du héros (dé bonus consommé). */
  function jet(c, s, carac, diff) {
    var j = s.jeu, mod = caracHeros(c, carac), aide = null, comp = compagnons(c);
    /* un compagnon prête main-forte de temps en temps : dé bonus */
    if (!j.bonus && comp.length && Math.random() < 0.3) { aide = p(comp); j.bonus = true; }
    var r = COF.Dice.test({ mod: mod, difficulte: diff, bonus: j.bonus });
    var bonus = j.bonus; j.bonus = false;
    var reussi = !!r.reussite;
    return { r: r, reussi: reussi, diff: diff, aide: aide, m: carac + ' ' + (mod >= 0 ? '+' : '') + mod + ' : ' + r.des.join('/') + (r.des.length > 1 ? ' (garde ' + r.garde + ')' : '') +
      ' → ' + r.total + ' contre ' + diff + ' · ' + (r.crit ? 'réussite critique' : r.fumble ? 'échec critique' : reussi ? (r.total - diff <= 1 ? 'de justesse' : 'réussite') : 'échec') +
      (bonus ? ' (dé bonus' + (aide ? ' : aide de ' + aide : '') + ')' : '') };
  }
  /* Conséquence concrète d'un échec (scènes physiques). */
  var MENTALES = ['savoir', 'interroger', 'parlementer', 'questionner', 'jauger', 'negocier', 'reclamer', 'exiger'];
  function consequence(c, s, ctx, fumble, id) {
    if (GENRES[s.jeu.genre].social) return '';
    var r = Math.random(), mentale = MENTALES.indexOf(id) >= 0;
    if (mentale) r = 0.4 + r * 0.6;
    if (!mentale && (fumble || r < 0.4)) {
      var dm = d(4) + Math.floor(niveau(c) / 3);
      return { txt: p(['{h} s’en tire avec une vilaine blessure.', 'Le prix à payer : une entaille qui saigne abondamment.', '{h} se relève, le corps couvert d’égratignures.', '{h} se relève, couvert{he} de boue et de bleus.']), m: blesser(c, dm) };
    }
    if (r < 0.7) { avancerTemps(c, 1); return { txt: 'Le temps file, et chaque heure perdue compte.', m: 'une heure perdue' }; }
    return '';
  }

  /* Le héros agit : jet, récit, jauges. Renvoie { menace: rencontre|null }. */
  function agir(c, s, i) {
    if (!s || !s.jeu || s.jeu.fini) return {};
    if (s.jeu.evt && COF.Imprevus) return COF.Imprevus.resoudre(c, s, i);
    var id = s.jeu.choix[i], a = ACTIONS[id]; if (!a) return {};
    var j = s.jeu, ctx = contexte(c, s, j.genre), out = {}, m = [], txt, reussi;
    if (a.auto) {
      reussi = true;
      var efA = effet(c, s, a, ctx);
      txt = dire(a.ok, ctx);
      if (a.danger) j.danger += a.danger;
      if (a.heure) avancerTemps(c, a.heure);
      j.prog = a.fin ? j.progMax : j.prog + (a.effet === 'flaner' ? 0 : 1);
      m.push('sans jet' + (a.danger ? ' · danger +' + a.danger : ''));
      if (efA) m.push(efA);
    } else {
      var diff = difficulte(c, a, j.genre), jt = jet(c, s, a.carac, diff), r = jt.r;
      reussi = jt.reussi; m.push(jt.m);
      if (reussi) {
        var ef = effet(c, s, a, ctx); if (ef) m.push(ef);
        txt = dire(a.ok, ctx);
        if (r.crit) txt += ' ' + p(['Un coup de maître.', 'Mieux que tout ce qu’on pouvait espérer !']);
        else if (r.total - diff <= 1) { avancerTemps(c, 1); txt += ' ' + p(['Mais cela prend un temps fou.', 'De justesse, et au prix de longues heures.']); m.push('une heure perdue'); }
        j.prog = a.fin ? j.progMax : j.prog + (r.crit ? 2 : 1);
      } else {
        txt = dire(a.ko, ctx);
        if (a.fin) { j.prog = j.progMax; m.push('l’affaire se conclut quand même'); }
        else {
          j.danger += r.fumble ? 2 : 1;
          var cs = consequence(c, s, ctx, r.fumble, id);
          if (cs) { txt += ' ' + dire(cs.txt, ctx); if (cs.m) m.push(cs.m); }
        }
      }
      if (jt.aide) txt = dire(['{x} prête main-forte à {h}.', 'Avec l’aide de {x}, {h} se lance.', '{x} couvre {h}.'], Object.assign({}, ctx, { x: jt.aide })) + ' ' + txt;
    }
    /* en voyage, chaque choix est une journée de route : une ration par jour */
    if (j.genre === 'voyage') {
      avancerTemps(c, 4);
      var rv = COF.Expedition.ressources(c);
      if (rv.rations > 0) { rv.rations--; m.push('un jour passe · −1 ration'); }
      else { m.push('un jour passe · plus de rations : ' + blesser(c, d(4))); txt += ' ' + dire('La faim tenaille {h}.', ctx); }
    }
    K().ajouterEntree(c, { t: 'recit', txt: txt, m: m.join(' · '), ok: reussi });
    s = K().sceneCourante(c);
    /* donjon : chaque avancée mène à la salle suivante */
    if (j.genre === 'donjon' && reussi && s.jeu.prog < s.jeu.progMax) {
      s.donjon.n++; s.donjon.salle = nouvelleSalle();
      var cd = contexte(c, s, 'donjon'), occ = s.donjon.salle.occupant || '';
      K().ajouterEntree(c, { t: 'recit', txt: dire('Salle ' + s.donjon.n + ' sur ' + s.donjon.salles + ' : {salle}', cd) + (occ ? ' ' + maj(sansPoint(occ)) + '.' : '') });
      if (occ && !/vide|personne|aucun|abandonn|déserte|rien/i.test(occ) && Math.random() < 0.45) { out.menace = engager(c, s, null); K().sauver(c); return out; }
    }
    if (s.jeu.prog >= s.jeu.progMax) finir(c, s, 'reussite');
    else if (s.jeu.danger >= s.jeu.dangerMax) out.menace = menace(c, s);
    else {
      s.jeu.choix = tirerChoix(c, s.jeu.genre, id);
      /* l'imprévu : flâner le provoque, sinon il surgit au hasard (plus souvent quand la tension monte) */
      var calme = ['accroche', 'denouement', 'confrontation', 'repos'].indexOf(s.jeu.genre) >= 0;
      if (COF.Imprevus && (a.effet === 'flaner' || (!calme && (s.jeu.nbEvt || 0) < 2 && Math.random() < 0.2 + (c.tension || 5) * 0.02))) COF.Imprevus.declencher(c, s);
    }
    K().sauver(c);
    return out;
  }
  /* ================= Action libre : le joueur écrit, l'app comprend ================= */
  var MOTS = {
    FOR: /forc|pouss|soulev|enfonc|défonc|frapp|cogn|bris|cass|arrach|lutt|plaqu|buscul|bouscul|tir(e|er) (la|le|sur)|port(e|er) |abatt|tordre|dégag/i,
    AGI: /grimp|escalad|saut|esquiv|cour[sir]|fui[rs]|faufil|discr|cach|crochet|vol(e|er) |dérob|équilibr|nag|lanc|vis(e|er)|acrobat|gliss|roul|agil|silenc/i,
    CON: /endur|résist|tenir|tiens|bois|boire|apnée|souffle|support|jeûn|march(e|er) longtemps|poison|froid|fatigue/i,
    PER: /cherch|fouill|observ|écout|regard|examin|repér|pist|suiv|guett|scrut|sent|inspect|vérifi|remarqu|trac/i,
    CHA: /convain|persuad|parl|négoci|marchand|ment|bluff|sédui|charm|intimid|menac|amadou|demand|discut|interrog|flatt|soudoy|propos|baratin/i,
    INT: /réfléch|déchiffr|\blis\b|lire|étudi|analys|souven|rappel|identifi|compren|calcul|résoud|énigm|soign|médec|alchim|pièg|répar|bricol|plan|carte/i,
    VOL: /pri(e|er)|médit|concentr|courage|calm|volont|sang-froid|peur|ne pas céder|tenir tête|foi/i
  };
  var LIBRE_OK = {
    FOR: ['À la force des bras, {h} y parvient.', 'Rien ne résiste à {h}.'], AGI: ['Avec agilité, {h} réussit son coup.', 'Souple et vif{he}, {h} s’en sort à merveille.'],
    CON: ['{h} tient bon, envers et contre tout.', 'Robuste, {h} encaisse et passe.'], PER: ['L’œil exercé de {h} fait la différence : ça marche.', '{h} remarque exactement ce qu’il fallait.'],
    CHA: ['Les mots de {h} font mouche.', '{h} sait se montrer convaincant{he}.'], INT: ['Un raisonnement habile, et le tour est joué.', '{h} a vu juste.'],
    VOL: ['Par la seule force de sa volonté, {h} y parvient.', '{h} ne cède pas, et cela suffit.']
  };
  var LIBRE_KO = ['Ça ne se passe pas comme prévu.', 'L’essai tourne court.', 'Raté : la situation se complique.', 'Malgré ses efforts, {h} n’y arrive pas.'];
  /* Comprend une action écrite : caractéristique, difficulté, dé bonus. */
  function interpreter(c, texte) {
    var scores = {}, meilleur = null, raisons = [];
    Object.keys(MOTS).forEach(function (k) { var m = String(texte).match(new RegExp(MOTS[k].source, 'gi')); scores[k] = m ? m.length : 0; if (!meilleur || scores[k] > scores[meilleur]) meilleur = k; });
    if (!scores[meilleur]) { meilleur = 'PER'; raisons.push('aucun mot-clé reconnu : perception par défaut'); }
    else raisons.push('mots-clés → ' + meilleur);
    var mod = 0, bonus = false, temps = 0;
    if (/prudem|lentement|avec soin|patiem|doucement|minutieu/i.test(texte)) { bonus = true; temps = 1; raisons.push('avec prudence : dé bonus, mais du temps passe'); }
    if (/vite|rapidement|d’un coup|d'un coup|tout de suite|en courant|précipit/i.test(texte)) { mod += 2; raisons.push('dans la précipitation : +2'); }
    if (/impossible|énorme|gigantesque|seul contre|à mains nues/i.test(texte)) { mod += 3; raisons.push('entreprise téméraire : +3'); }
    return { carac: meilleur, mod: mod, bonus: bonus, temps: temps, raisons: raisons };
  }
  function agirLibre(c, s, texte, caracForcee) {
    if (!s || !s.jeu || s.jeu.fini || !texte) return {};
    var j = s.jeu, ctx = contexte(c, s, j.genre), it = interpreter(c, texte), out = {}, m = [];
    if (caracForcee) it.carac = caracForcee;
    if (it.bonus) j.bonus = true;
    if (it.temps) avancerTemps(c, it.temps);
    var diff = difficulteBase(c) + it.mod, jt = jet(c, s, it.carac, diff), r = jt.r;
    m.push('action libre · ' + jt.m);
    var debut = polir(ex('{h} tente sa chance : « ' + texte.replace(/[{}\[\]]/g, '') + ' ».', ctx)), txt;
    if (jt.reussi) {
      txt = debut + ' ' + dire(LIBRE_OK[it.carac], ctx) + (r.crit ? ' ' + p(['Un coup de maître.', 'Mieux que tout ce qu’on pouvait espérer !']) : '');
      j.prog += r.crit ? 2 : 1;
    } else {
      txt = debut + ' ' + dire(LIBRE_KO, ctx);
      j.danger += r.fumble ? 2 : 1;
      var cs = consequence(c, s, ctx, r.fumble, ['FOR', 'AGI', 'CON'].indexOf(it.carac) >= 0 ? 'forcer' : 'savoir');
      if (cs) { txt += ' ' + dire(cs.txt, ctx); if (cs.m) m.push(cs.m); }
    }
    if (jt.aide) txt = dire('{x} prête main-forte à {h}.', Object.assign({}, ctx, { x: jt.aide })) + ' ' + txt;
    K().ajouterEntree(c, { t: 'recit', txt: txt, m: m.join(' · '), ok: jt.reussi });
    s = K().sceneCourante(c);
    if (s.jeu.prog >= s.jeu.progMax) finir(c, s, 'reussite');
    else if (s.jeu.danger >= s.jeu.dangerMax) out.menace = menace(c, s);
    K().sauver(c);
    return out;
  }
  /* Engage une rencontre hostile (r fournie, sinon tirée selon le terrain). */
  function engager(c, s, r) {
    if (!r) { r = AV().rencontre(c, { env: contexte(c, s, s.jeu.genre).env, difficulte: COF.Saga ? COF.Saga.diffMenace(c) : 'ordinaire', style: 'auto', theme: Math.random() < 0.5 }); if (r.erreur) return null; }
    r.reaction = 'hostile'; r.reactionTexte = 'Hostiles : ils ne laisseront pas le héros aller plus loin.';
    c.rencontre = r; s.jeu.menace = true; s.jeu.choix = [];
    K().ajouterEntree(c, { t: 'rencontre', r: r, txt: 'Menace : ' + r.texte });
    return r;
  }
  /* Reprend le cours de la scène après un imprévu. */
  function reprendre(c, s) {
    var j = s.jeu;
    if (j.prog >= j.progMax && j.progMax > 0) finir(c, s, 'reussite');
    else if (j.danger >= j.dangerMax) menace(c, s);
    else j.choix = tirerChoix(c, j.genre);
  }
  /* Le danger déborde : la discussion tourne mal (scène sociale) ou une
     menace surgit (rencontre hostile). */
  function menace(c, s) {
    var ctx = contexte(c, s, s.jeu.genre);
    if (GENRES[s.jeu.genre].social || c.rencontre) { finir(c, s, 'echec'); return null; }
    var r = AV().rencontre(c, { env: ctx.env, difficulte: COF.Saga ? COF.Saga.diffMenace(c) : 'ordinaire', style: 'auto', theme: Math.random() < 0.6 });
    if (r.erreur) { finir(c, s, 'echec'); return null; }
    r.test = r.theme && c.saga ? 'Des serviteurs de ' + c.saga.nom : 'Le danger se concrétise';
    K().ajouterEntree(c, { t: 'recit', txt: dire(['Trop de bruit, trop de questions : {h} a attiré l’attention.', 'Le danger se précise. Des silhouettes approchent, et elles n’ont rien d’amical.', 'Il fallait s’y attendre : on a remarqué {h}.'], ctx), m: 'danger au maximum', ok: false });
    return engager(c, s, r);
  }
  /* Confrontation sans adversaires préparés : le héros va au-devant du danger. */
  function provoquer(c) {
    var s = K().sceneCourante(c); if (!s || !s.jeu || s.jeu.fini || c.rencontre) return null;
    s.jeu.danger = s.jeu.dangerMax;
    var r = menace(c, s); K().sauver(c); return r;
  }
  function finir(c, s, issue) {
    /* donjon exploré jusqu'au bout : le trésor du fond */
    if (s.jeu.genre === 'donjon' && issue === 'reussite' && s.donjon && !s.donjon.tresor) {
      var hP = heros(c), b = COF.Recompense.genererCoffre({ niveau: niveau(c), env: (M().ici(c) || {}).env || 'ruines', richesse: 'standard' });
      if (hP) AV().encaisser(hP, b);
      s.donjon.tresor = AV().texteButin(b);
      var ici = M().ici(c); if (ici) ici.explore = true;
    }
    var ctx = contexte(c, s, s.jeu.genre), G0 = GENRES[s.jeu.genre];
    s.jeu.fini = issue; s.jeu.choix = [];
    s.jeu.resume = dire(issue === 'reussite' ? G0.ok : (G0.ko || G0.ok), ctx);
    K().ajouterEntree(c, { t: 'recit', fin: true, txt: s.jeu.resume });
  }
  /* Après un combat (ou une rencontre évitée) dans une scène jouée. */
  function apresCombat(c, issue) {
    var s = K().sceneCourante(c); if (!s || !s.jeu || s.jeu.fini) return;
    var j = s.jeu, ctx = contexte(c, s, j.genre);
    if (issue === 'fuite' || issue === 'defaite') { finir(c, s, 'echec'); K().sauver(c); return; }
    if (j.genre === 'confrontation') { j.prog = j.progMax; finir(c, s, 'reussite'); K().sauver(c); return; }
    j.menace = false; j.danger = Math.min(j.danger, j.dangerMax - 1);
    if (issue === 'victoire') {
      j.prog++;
      K().ajouterEntree(c, { t: 'recit', txt: dire(['Les adversaires à terre, {h} reprend son souffle. Sur l’un d’eux, un détail retient son attention.', 'Le calme revient. En fouillant les corps, {h} trouve de quoi avancer.'], ctx), m: 'objectif +1', ok: true });
    } else K().ajouterEntree(c, { t: 'recit', txt: dire(['La menace écartée, {h} peut reprendre là où l’affaire en était.', 'Le danger s’éloigne. Il est temps de se remettre à l’ouvrage.'], ctx), ok: true });
    s = K().sceneCourante(c);
    if (j.prog >= j.progMax) finir(c, s, 'reussite'); else j.choix = tirerChoix(c, j.genre);
    K().sauver(c);
  }
  /* Clôt une scène jouée : avance le fil (même en cas d'échec : l'histoire
     continue), fait passer le temps. Renvoie les notes à ajouter. */
  function conclure(c, s) {
    var notes = [], j = s.jeu, f = s.filId ? fil(c, s.filId) : null, ok = j.fini === 'reussite', S = COF.Saga;
    if (j.genre === 'voyage' && s.voyage) {
      /* on arrive toujours, même mal en point */
      if (Math.random() < 0.35) { var dl = decouvrirLieu(c); if (dl) notes.push('🗺️ En chemin, le héros a repéré ' + dl.nom + ' (ajouté à la carte).'); }
      M().seRendre(c, s.voyage.dest);
      var dst = M().ici(c); if (dst) notes.push('📍 Arrivée ' + formes(dst.nom).a + '.');
    } else if (f && f.quete) {
      if (!ok) f.quete.revers = (f.quete.revers || 0) + 1;
      if (!ok && f.quete.saga === 'final' && f.quete.etape === 3 && c.saga) c.saga.amere = true;
      notes.push(D().avancer(c, f));
    } else if (f) notes.push(S ? S.resoudreRumeur(c, f, ok) : (ok ? (f.ouvert = false, '🧵 « ' + f.nom + ' » est résolu.') : ''));
    if (j.genre === 'ville' && S) notes.push(S.changerRep(M().ici(c), ok ? 1 : -1));
    var nuit = avancerTemps(c, j.genre === 'repos' ? 2 : 1);
    if (nuit) notes.push('☀️ Un nouveau jour se lève : jour ' + c.jour + '.');
    if (S && !ok) S.compagnons(c, 'echec').forEach(function (n) { notes.push(n); });
    if (S && c.saga) {
      notes.push(S.nouveauJour(c));
      if (!ok && Math.random() < 0.4) notes.push(S.avancer(c, 1));
    }
    return notes.filter(Boolean);
  }
  function infoTemps(c) {
    var co = etat(c), ici = M().ici(c), env = (ici && ici.env) || 'plaine';
    return { heure: ['🌅 Aube', '☀️ Jour', '🌇 Crépuscule', '🌙 Nuit'][co.heure], meteo: env === 'souterrain' ? '' : METEO_NOM[meteo(c, env)] };
  }

  function apresOuverture(c) {
    var s = K().sceneCourante(c);
    if (s && s.jeu && s.jeu.evtDiffere && COF.Imprevus) { s.jeu.evtDiffere = false; COF.Imprevus.declencher(c, s); K().sauver(c); }
  }
  return { contexte: function (c, s) { return contexte(c, s, s && s.jeu ? s.jeu.genre : genreDe(c, s)); }, heros: heros, niveau: niveau, payer: payer, blesser: blesser,
    caracHeros: caracHeros, difficulteBase: difficulteBase, jet: jet, engager: engager, reprendre: reprendre, decouvrirLieu: decouvrirLieu, apresOuverture: apresOuverture,
    formes: formes, ex: ex, polir: polir, dire: dire, GENRES: GENRES, ACTIONS: ACTIONS, genreDe: genreDe,
    interpreter: interpreter, agirLibre: agirLibre, titreFinale: titreFinale, ouvrir: ouvrir, choix: choix, agir: agir, provoquer: provoquer, apresCombat: apresCombat, conclure: conclure, avancerTemps: avancerTemps, infoTemps: infoTemps };
})();
