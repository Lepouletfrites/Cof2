/* ============================================================
   COF2 Compagnon — Récit vivant (mode aventure)
   1. Plus de choix, selon le contexte : soudoyer en ville, profiter
      de la nuit ou de la brume, escalader en montagne, compter sur
      un compagnon, prendre un raccourci en voyage, écouter aux
      portes d'un donjon… (les choix déjà joués laissent leur place).
   2. Des phrases de récit après chaque action : l'enquête progresse,
      le danger monte, le décor vit.
   3. Danger au maximum : un revers qui colle à la situation (la garde
      arrive, on s'égare, le passage s'effondre, une bourse disparaît…)
      et pas toujours un combat.
   ============================================================ */
window.COF = window.COF || {};

COF.Recit = (function () {
  function p(l) { return l[Math.floor(Math.random() * l.length)]; }
  function d(n) { return 1 + Math.floor(Math.random() * n); }
  function T() { return COF.Conteur; }
  function M() { return COF.Monde; }
  function heure(c) { return c.conteur ? c.conteur.heure : 1; }
  function meteo(c) { return c.conteur && c.conteur.meteo ? c.conteur.meteo.id : null; }
  function compagnon(c) { var l = COF.Troupe ? COF.Troupe.actifs(c) : []; return l.length ? l[0] : null; }
  function envDe(c) { return M().envIci(c) || 'plaine'; }

  /* ---------- 1. Actions supplémentaires ----------
     si(c) : l'action n'est proposée que dans ce contexte. */
  var ACTIONS = {
    soudoyer: { nom: 'Glisser quelques pièces aux bonnes personnes', carac: 'CHA', effet: 'soudoyer', si: function (c) { var i = M().ici(c); return !!(i && (i.ville || i.env === 'urbain')); },
      ok: ['Une pièce passe de main en main, et les langues se délient : {indice}.', 'Le garde empoche la bourse sans un mot, puis murmure : {indice}.', 'Contre quelques pièces, un gamin des rues mène {h} droit à {indice}.'],
      ko: ['L’homme empoche l’argent… et disparaît dans la foule.', '« Tu me prends pour qui ? » La pièce roule sur les pavés, et tout le monde a vu la scène.', 'Les pièces changent de main, mais le renseignement ne vaut rien.'] },
    intimider: { nom: 'Hausser le ton', carac: 'VOL', effet: 'indice',
      ok: ['La voix de {h} claque comme un fouet. On répond vite, et sans mentir : {indice}.', 'Un regard dur, une main sur le pommeau : l’autre déglutit et parle de {indice}.', '{h} n’a pas besoin de crier : son calme glacial suffit.'],
      ko: ['On rit au nez de {h}. L’intimidation tombe à plat.', 'Le ton monte des deux côtés ; tout le monde se retourne.', 'Mauvaise idée : l’autre a des amis, et ils approchent.'] },
    ruse: { nom: 'Monter une ruse', carac: 'INT', effet: 'prog',
      ok: ['Un faux message, un rendez-vous truqué : le piège de {h} fonctionne à merveille.', '{h} fait courir une fausse rumeur… et regarde qui vient y mordre.', 'La ruse est simple, presque grossière. Elle marche pourtant à la perfection.'],
      ko: ['La ruse est éventée avant même d’avoir commencé.', 'Le piège se referme… sur un innocent. Il faudra s’excuser.', 'Trop compliqué : {h} s’emmêle dans ses propres mensonges.'] },
    ombre: { nom: function (ctx) { return ctx.nuit ? 'Profiter de l’obscurité' : 'Se fondre dans la brume'; }, carac: 'AGI', effet: 'prog',
      si: function (c) { return heure(c) === 3 || heure(c) === 0 || ['brume', 'pluie', 'neige', 'orage'].indexOf(meteo(c)) >= 0; },
      ok: ['Dans le noir, {h} passe là où personne ne l’attend.', 'La brume avale la silhouette de {h}. Personne ne {hle} voit passer.', 'Une ombre parmi les ombres : {h} avance sans un bruit.'],
      ko: ['Un éclair, une lanterne, un chien qui aboie : {h} est repéré{he}.', 'Dans l’obscurité, {h} trébuche sur un seau. Le vacarme est épouvantable.', 'Les ombres cachent {h}… mais aussi ce qui l’attendait.'] },
    instinct: { nom: 'Se fier à son instinct', carac: 'PER', effet: 'indice',
      ok: ['Quelque chose cloche, {h} le sent. Et {hil} a raison : {indice}.', 'Une intuition soudaine pousse {h} à revenir sur ses pas. Bien vu : {indice}.', '{h} ne saurait dire pourquoi, mais {hil} sait où regarder.'],
      ko: ['L’instinct de {h} {hle} trompe, cette fois.', 'Une fausse impression fait perdre un temps précieux.', '{h} hésite trop longtemps entre deux intuitions.'] },
    prier: { nom: 'Chercher un signe (prière, méditation)', carac: 'VOL', effet: 'indice',
      ok: ['Les yeux fermés, {h} fait le vide. Quand {hil} les rouvre, un détail saute aux yeux : {indice}.', 'Un corbeau se pose, regarde {h}, puis s’envole vers {indice}. Un signe ?', 'Une prière murmurée, et l’esprit de {h} s’éclaircit.'],
      ko: ['Aucun signe ne vient. Le ciel reste muet.', 'Les pensées de {h} s’agitent au lieu de s’apaiser.'] },
    escalader: { nom: function (ctx) { return ctx.env === 'urbain' ? 'Passer par les toits' : 'Escalader pour passer par le haut'; }, carac: 'AGI', effet: 'indice',
      si: function (c) { return ['montagne', 'ruines', 'urbain', 'foret', 'souterrain'].indexOf(envDe(c)) >= 0; },
      ok: ['Prise après prise, {h} se hisse. D’en haut, tout s’éclaire : {indice}.', '{h} court sur les toits et retombe souplement, juste au bon endroit.', 'Une escalade périlleuse, un rétablissement de justesse… et une vue imprenable sur {indice}.'],
      ko: ['Une prise cède : {h} se rattrape de justesse, les mains en sang.', 'Une tuile glisse et va se fracasser dans la rue. Tout le monde lève la tête.', 'Trop haut, trop lisse : {h} doit renoncer.'] },
    equipe: { nom: function (ctx) { return 'Laisser faire ' + (ctx.compagnon || 'son compagnon'); }, auto: true, effet: 'equipe', unique: true, aide: 'une fois par scène',
      si: function (c) { return !!compagnon(c); },
      ok: ['{compagnon} hoche la tête : « Laisse-moi faire. » Et {compagnon_il} s’en charge avec brio.', '{compagnon} prend les devants et règle l’affaire à sa manière.', '« À mon tour », sourit {compagnon}. Le résultat est impeccable.'] },
    /* voyage */
    raccourci: { nom: 'Tenter un raccourci', carac: 'PER', diff: 2, effet: 'prog',
      ok: ['Le raccourci tient ses promesses : une journée de gagnée !', 'Un vieux sentier de contrebandiers coupe à travers tout. Bien joué.'],
      ko: ['Le raccourci mène droit dans un ravin. Il faut tout refaire.', 'Le « raccourci » s’avère deux fois plus long.'] },
    caravane: { nom: 'Faire route avec des voyageurs', auto: true, effet: 'calme', aide: 'plus sûr : danger −1', si: function (c) { return ['plaine', 'urbain', 'foret'].indexOf(envDe(c)) >= 0; },
      ok: ['Une caravane de marchands accepte {h} pour la journée. On voyage plus lentement, mais en sécurité.', 'Des pèlerins partagent la route et leurs chants avec {h}. Personne n’ose attaquer un si grand groupe.', 'Un colporteur bavard tient compagnie à {h} toute la journée.'] },
    eclaireur: { nom: 'Partir en éclaireur', carac: 'AGI', effet: 'indice',
      ok: ['En avant du chemin, {h} repère le danger avant qu’il ne {hle} repère.', 'Depuis un talus, {h} observe la route : la voie est libre.'],
      ko: ['{h} s’éloigne trop et perd un temps fou à retrouver le chemin.', 'Un buisson s’agite : {h} n’est pas seul{he} à observer la route.'] },
    gue: { nom: function (ctx) { return ctx.env === 'montagne' ? 'Franchir le col' : (ctx.env === 'marais' ? 'Traverser les eaux mortes' : 'Passer la rivière à gué'); }, carac: 'CON',
      si: function (c) { return ['marais', 'foret', 'montagne', 'plaine'].indexOf(envDe(c)) >= 0; },
      ok: ['L’eau glacée monte jusqu’à la taille, mais {h} passe sans encombre.', 'Le passage est rude, mais {h} en vient à bout.'],
      ko: ['Le courant emporte {h} sur plusieurs mètres. {h} ressort trempé{he}, transi{he}, une partie du paquetage en moins.', 'Le froid et la fatigue ont raison de {h}, qui doit rebrousser chemin.'] },
    /* donjon */
    ecouter: { nom: function (ctx) { return ctx.donjon ? 'Écouter à la porte' : 'Tendre l’oreille'; }, carac: 'PER', effet: 'indice',
      ok: function (ctx) { return ctx.donjon ? ['L’oreille collée au bois, {h} entend des voix, des pas… et compte les adversaires.', 'Dans le silence, un bruit trahit ce qui attend plus loin.']
        : ['Dans le silence, un bruit trahit ce qui attend plus loin.', '{h} retient son souffle : [des voix|des pas|un craquement] [au loin|derrière la haie|tout près]. Assez pour comprendre {indice}.', 'Les bruits alentour racontent une histoire à qui sait écouter.']; },
      ko: function (ctx) { return ctx.donjon ? ['Rien. Ou alors, quelque chose qui retient son souffle aussi.', 'Une porte s’ouvre brusquement : on écoutait aussi de l’autre côté !']
        : ['Rien. Ou alors, quelque chose qui retient son souffle aussi.', 'Le vent couvre tous les bruits.', 'Une branche craque sous le pied de {h} : tout se tait alentour.']; } },
    inscriptions: { nom: 'Déchiffrer les inscriptions', carac: 'INT', effet: 'indice', si: function (c) { return ['ruines', 'souterrain'].indexOf(envDe(c)) >= 0; },
      ok: ['Les runes à demi effacées livrent leur secret : un avertissement, et une indication précieuse.', '{h} déchiffre une plaque gravée : le chemin sûr est indiqué, pour qui sait lire.'],
      ko: ['Les symboles restent obscurs.', 'En lisant à voix haute, {h} déclenche quelque chose. Mauvaise idée.'] },
    sonder: { nom: 'Sonder le sol avec sa lance', auto: true, effet: 'calme', aide: 'lent mais sûr : danger −1, une heure passe', heure: 1,
      ok: ['Pas à pas, {h} tâte chaque dalle. Une s’enfonce : piège évité.', 'Avec une lenteur exaspérante, {h} avance sans rien déclencher.'] },
    /* exploration */
    pisteAnimal: { nom: 'Suivre une piste animale', carac: 'PER', effet: 'rations', si: function (c) { return ['foret', 'plaine', 'montagne', 'marais', 'arctique'].indexOf(envDe(c)) >= 0; },
      ok: ['La piste mène à un point d’eau poissonneux et à un gibier abondant.', 'Un sentier de cerfs conduit {h} à une clairière couverte de baies.'],
      ko: ['La piste mène à une tanière. Une tanière occupée.', 'Les traces se perdent dans un éboulis.'] },
    /* ville */
    basQuartiers: { nom: 'S’aventurer dans les bas quartiers', carac: 'AGI', effet: 'rumeurVille',
      ok: ['Dans une ruelle sordide, un receleur parle trop : {rumeurTaverne}', 'Au fond d’un tripot clandestin, {h} entend ce qu’on ne dit pas ailleurs : {rumeurTaverne}'],
      ko: ['Une main se glisse vers la bourse de {h}. Trop tard pour la rattraper.', 'Une bande de vauriens barre la ruelle. {h} recule prudemment.'] },
    crieur: { nom: 'Écouter le crieur public', auto: true, effet: 'rumeurVille', aide: 'les nouvelles du jour',
      ok: ['« Oyez, oyez ! » Le crieur annonce les nouvelles. L’une d’elles retient l’attention de {h} : {rumeurTaverne}', 'Sur la place, le crieur lit les avis du jour. Un détail intrigue {h} : {rumeurTaverne}'] },
    /* rumeur : la vérifier avant de foncer */
    recouper: { nom: 'Recouper la rumeur auprès d’autres témoins', carac: 'INT', effet: 'verifierRumeur', unique: true,
      si: function (c, s) { return !!(COF.Rumeurs && COF.Rumeurs.aVerifier(c, s)); },
      ok: ['{h} interroge, compare, recoupe les versions. {verdict}', 'Trois témoins, trois récits : {h} démêle patiemment le vrai du faux. {verdict}'],
      ko: ['Les versions se contredisent ; impossible de démêler le vrai du faux.', 'Personne ne veut en dire plus. La rumeur reste un mystère.'] },
    cueillir: { nom: 'Cueillir des simples en chemin', carac: 'PER', effet: 'cueillir', unique: true, aide: '',
      si: function (c) { return ['foret', 'plaine', 'montagne', 'marais', 'colline'].indexOf(envDe(c)) >= 0 && heure(c) !== 3; },
      ok: ['Sauge, millepertuis, achillée : {h} remplit sa besace de plantes qu’un herboriste saura apprécier.', 'Au bord du sentier, {h} repère des simples précieux et les cueille avec soin.'],
      ko: ['Ce que {h} prenait pour de l’arnica n’est que de la mauvaise herbe.', 'Des orties. Beaucoup d’orties. Et rien d’autre.'] },
    /* ---- toujours plus de possibilités ---- */
    observer: { nom: 'Attendre et observer', carac: 'PER', effet: 'indice',
      ok: ['Immobile, {h} [laisse passer le temps|se fait oublier]. Puis [un détail|un manège|une allée et venue] trahit tout : {indice}.', 'La patience paie : au bout d’[une heure|un long moment], {h} remarque {indice}.', 'Assis{he} dans un coin, {h} regarde le monde vivre… et voit ce que les autres ne voient pas.'],
      ko: ['Rien ne bouge. {h} a perdu son temps.', '{h} attend, attend encore… et finit par se faire remarquer.', 'L’ennui gagne ; quand {h} relève la tête, l’occasion est passée.'] },
    deguiser: { nom: 'Se faire passer pour quelqu’un d’autre', carac: 'CHA', diff: 1, effet: 'prog', si: function (c) { var i = M().ici(c); return !!(i && (i.ville || i.env === 'urbain')); },
      ok: ['Un manteau d’emprunt, un accent [étranger|des faubourgs], un air pressé : on prend {h} pour [un messager|un collecteur d’impôts|un cousin de province].', 'Personne ne pose de question à {h}, qui se fait passer pour [un employé de la guilde|un serviteur de la maison|un inspecteur]. Les portes s’ouvrent.'],
      ko: ['« Tiens, je ne vous connais pas, vous… » Le déguisement ne tient pas une minute.', 'L’accent de {h} dérape au pire moment.'] },
    improviser: { nom: 'Bricoler une solution avec les moyens du bord', carac: 'INT', effet: 'prog',
      ok: ['Une corde, un clou, un peu d’astuce : {h} [improvise|bricole] quelque chose qui, contre toute attente, fonctionne.', 'Avec [trois fois rien|ce qui traîne là], {h} invente une solution [astucieuse|culottée].'],
      ko: ['Le bricolage de {h} [s’effondre|se démonte] au premier essai.', 'L’idée était bonne sur le papier.'] },
    audace: { nom: 'Foncer tête baissée', carac: 'FOR', diff: 1,
      ok: ['Sans réfléchir, {h} fonce. [Et ça passe !|L’audace paie.|Personne n’avait prévu ça.]', '{h} enfonce [la porte|le barrage|les hésitations] d’un seul élan.'],
      ko: ['{h} fonce… droit dans le mur. Au sens propre.', 'L’élan de {h} se brise net. [Aïe.|Douloureux.]'] },
    coupEclat: { nom: 'Tout miser sur un coup d’éclat', carac: 'VOL', diff: 3, effet: 'prog', aide: 'difficile, mais l’objectif avance double',
      ok: ['{h} joue son va-tout. Un instant suspendu… et tout bascule en sa faveur.', 'Un geste fou, magnifique : {h} renverse la situation d’un seul coup.'],
      ko: ['Le coup d’éclat fait long feu. {h} se retrouve à découvert.', 'Tout miser, c’est aussi tout perdre : {h} l’apprend à ses dépens.'] },
    appat: { nom: 'Tendre un appât', carac: 'INT', effet: 'indice',
      ok: ['{h} laisse [une bourse|un message|une fausse piste] bien en vue… et [quelqu’un|quelque chose] vient y mordre.', 'L’appât fonctionne : {h} sait maintenant qui [rôde|cherche] dans le coin.'],
      ko: ['L’appât disparaît sans que {h} voie qui l’a pris.', 'Rien ne mord. Ou alors, quelque chose de trop malin.'] },
    abri: { nom: function (ctx) { return ctx.meteoId === 'neige' ? 'Laisser passer la tempête de neige' : 'S’abriter le temps que l’averse passe'; }, auto: true, effet: 'calme', heure: 1, aide: 'une heure passe · danger −1',
      si: function (c) { return ['pluie', 'orage', 'neige'].indexOf(meteo(c)) >= 0 && envDe(c) !== 'souterrain'; },
      ok: ['Sous [un auvent|un rocher en surplomb|un vieux chêne], {h} attend que le ciel se calme. Le temps de [reprendre des forces|réfléchir à la suite].', 'Blotti{he} à l’abri, {h} écoute [la pluie|le vent] et reprend son souffle.'] },
    tracesNeige: { nom: 'Suivre les traces dans la neige', carac: 'PER', effet: 'indice', si: function (c) { return meteo(c) === 'neige' || envDe(c) === 'arctique'; },
      ok: ['La neige fraîche ne ment pas : les empreintes mènent droit à {indice}.', 'Des traces nettes, récentes : {h} les suit sans peine.'],
      ko: ['La neige a recouvert les traces.', 'Les empreintes se mêlent et se perdent.'] },
    aube: { nom: 'Profiter du calme de l’aube', carac: 'PER', effet: 'indice', si: function (c) { return heure(c) === 0; },
      ok: ['À cette heure, le monde dort encore : {h} [a le champ libre|peut tout observer à loisir].', 'Dans la lumière grise du matin, {h} remarque ce que la foule cachera plus tard : {indice}.'],
      ko: ['Le brouillard du matin ne se lève pas.', 'Trop tôt : rien ni personne à observer.'] },
    etoiles: { nom: 'S’orienter aux étoiles', carac: 'INT', effet: 'prog', si: function (c) { return heure(c) === 3 && envDe(c) !== 'souterrain' && ['orage', 'brume', 'gris'].indexOf(meteo(c)) < 0; },
      ok: ['L’étoile du Berger, puis la Couronne : {h} trace sa route dans le ciel.', 'Les constellations sont limpides cette nuit ; {h} sait exactement où aller.'],
      ko: ['Les nuages masquent les étoiles au mauvais moment.', '{h} confond deux constellations. Mauvaise direction.'] },
    courantAir: { nom: 'Suivre le courant d’air', carac: 'PER', effet: 'prog', si: function (c) { return ['souterrain', 'ruines'].indexOf(envDe(c)) >= 0; },
      ok: ['La flamme vacille : un souffle d’air frais guide {h} vers [une issue|un passage oublié].', 'Un filet d’air glacé trahit un passage dérobé.'],
      ko: ['Le courant d’air se perd dans un dédale de fissures.', 'Le souffle mène à un puits trop étroit.'] },
    foule: { nom: 'Se mêler à la foule', carac: 'AGI', effet: 'indice', si: function (c) { var i = M().ici(c); return !!(i && (i.ville || i.env === 'urbain')) && heure(c) === 1; },
      ok: ['Noyé{he} dans la foule [du marché|de la grand-rue], {h} [écoute|suit] sans être vu{he} : {indice}.', 'Une silhouette parmi cent : {h} se rapproche sans éveiller le moindre soupçon.'],
      ko: ['Bousculé{he}, {h} perd sa cible de vue.', 'Dans la cohue, quelqu’un reconnaît {h}.'] },
    archives: { nom: 'Consulter les registres', carac: 'INT', effet: 'indice', si: function (c) { var i = M().ici(c); return !!(i && i.ville); },
      ok: ['Dans la poussière des registres [du temple|de la mairie|du bailli], un nom revient : {indice}.', 'Des actes notariés, des dates, une signature : {h} assemble le puzzle.'],
      ko: ['Les registres sont [incomplets|rongés par l’humidité].', 'Le clerc refuse l’accès aux archives.'] },
    conseil: { nom: function (ctx) { return 'Demander conseil à ' + (ctx.compagnon || 'son compagnon'); }, auto: true, effet: 'indice', unique: true, aide: 'dé bonus au prochain jet',
      si: function (c) { return !!compagnon(c); },
      ok: ['{compagnon} réfléchit, puis glisse une idée à laquelle {h} n’avait pas pensé.', '« À ta place, je m’y prendrais autrement », dit {compagnon}. Ce n’est pas bête.', '{compagnon} hausse les épaules : « Fais confiance à ton instinct… mais regarde à gauche. »'] },
    torche: { nom: 'Allumer une torche neuve', auto: true, effet: 'torche', unique: true, aide: 'une torche · danger −1',
      si: function (c) { return (envDe(c) === 'souterrain' || envDe(c) === 'ruines') && c.ressources && c.ressources.torches > 0; },
      ok: ['La flamme neuve repousse les ténèbres : ce qui rampait dans l’ombre recule.', 'Une torche crépite, et les murs révèlent [des fresques|des traces de griffes|un passage]. Mieux vaut y voir clair.'] },
    partage: { nom: 'Partager ses provisions avec des inconnus', auto: true, effet: 'partage', unique: true, aide: 'une ration · une rumeur',
      si: function (c) { return envDe(c) !== 'souterrain' && c.ressources && c.ressources.rations > 0; },
      ok: ['Autour du pain partagé, les langues se délient : {rumeurTaverne}', '[Des voyageurs|Des paysans|Des pèlerins] remercient {h} pour le repas, et racontent : {rumeurTaverne}'] },
    reputation: { nom: function (ctx) { return 'Faire valoir sa réputation de « ' + ctx.surnom + ' »'; }, carac: 'CHA', effet: 'prog', si: function (c) { return !!(COF.Legende && COF.Legende.surnom(c)); },
      ok: ['« Vous êtes… {surnom} ? » Les yeux s’écarquillent, et tout devient plus facile.', 'Il suffit d’un nom : {surnom}. On s’empresse d’aider {h}.'],
      ko: ['« Jamais entendu parler. » La légende n’est pas encore arrivée jusqu’ici.', 'On rit au nez de {h} : « Et moi, je suis le roi ! »'] },
    chanter: { nom: 'Gagner les cœurs avec une histoire', carac: 'CHA', effet: 'calme',
      ok: ['{h} raconte [une vieille légende|ses propres aventures, à peine enjolivées]. On écoute, on rit, on se détend.', 'Une chanson [de route|à boire|d’autrefois], reprise en chœur : l’atmosphère change du tout au tout.'],
      ko: ['L’histoire tombe à plat. Un silence gêné s’installe.', '{h} chante faux. Très faux.'] }
  };
  var AJOUTS = {
    piste: ['soudoyer', 'intimider', 'ruse', 'ombre', 'instinct', 'prier', 'escalader', 'equipe', 'observer', 'deguiser', 'improviser', 'audace', 'coupEclat', 'archives', 'conseil', 'reputation', 'appat', 'aube', 'tracesNeige', 'foule'],
    fil: ['soudoyer', 'intimider', 'ruse', 'ombre', 'instinct', 'escalader', 'equipe', 'recouper', 'observer', 'deguiser', 'improviser', 'appat', 'archives', 'conseil', 'aube', 'foule', 'reputation'],
    libre: ['soudoyer', 'ruse', 'ombre', 'instinct', 'prier', 'escalader', 'equipe', 'ecouter', 'observer', 'improviser', 'audace', 'appat', 'abri', 'aube', 'tracesNeige', 'conseil', 'foule', 'reputation', 'partage', 'chanter'],
    complication: ['ruse', 'intimider', 'ombre', 'instinct', 'escalader', 'equipe', 'improviser', 'audace', 'coupEclat', 'conseil', 'abri'],
    voyage: ['raccourci', 'caravane', 'eclaireur', 'gue', 'ombre', 'equipe', 'etoiles', 'abri', 'partage', 'chanter', 'tracesNeige', 'aube', 'conseil', 'cueillir'],
    donjon: ['ecouter', 'inscriptions', 'sonder', 'equipe', 'ombre', 'courantAir', 'torche', 'improviser', 'audace', 'conseil'],
    explorer: ['escalader', 'ecouter', 'pisteAnimal', 'inscriptions', 'instinct', 'equipe', 'observer', 'courantAir', 'etoiles', 'tracesNeige', 'aube', 'abri', 'appat', 'partage', 'conseil', 'cueillir'],
    ville: ['soudoyer', 'basQuartiers', 'crieur', 'equipe', 'deguiser', 'foule', 'archives', 'reputation', 'chanter', 'observer', 'partage']
  };
  var POUR_MISSIONS = ['equipe', 'observer', 'improviser', 'audace', 'conseil', 'reputation'], POUR_FINALES = ['coupEclat', 'audace', 'conseil'];
  var MOTS = { soudoyer: ['négoc', 'marchand', 'persua', 'baratin'], intimider: ['intimid', 'volonté', 'autorit'], ruse: ['ruse', 'baratin', 'piège', 'stratég'],
    ombre: ['discré', 'furtiv', 'cacher', 'ombre'], instinct: ['intuition', 'vigilan', 'perception'], prier: ['prière', 'foi', 'religion', 'méditation', 'volonté'],
    escalader: ['escalad', 'acrobat', 'grimp', 'athlé'], raccourci: ['orientation', 'survie', 'nature'], eclaireur: ['discré', 'survie', 'vigilan'], gue: ['natation', 'endur', 'survie'],
    ecouter: ['perception', 'vigilan', 'écout'], inscriptions: ['érudi', 'langue', 'histoire', 'arcan', 'lire'], pisteAnimal: ['pist', 'chasse', 'survie', 'nature'], basQuartiers: ['discré', 'rue', 'crochet', 'baratin'], recouper: ['enquête', 'investig', 'érudi', 'perception'],
    observer: ['perception', 'vigilan', 'observ'], deguiser: ['déguis', 'baratin', 'comédi', 'persua'], improviser: ['artisan', 'bricol', 'mécan', 'ingéni'], audace: ['athlé', 'force', 'charge'],
    appat: ['piège', 'ruse', 'chasse'], archives: ['érudi', 'histoire', 'lire', 'langue'], foule: ['discré', 'furtiv'], etoiles: ['orientation', 'astro', 'navig', 'survie'],
    chanter: ['musique', 'chant', 'représ', 'persua'], courantAir: ['perception', 'survie'], tracesNeige: ['pist', 'survie', 'chasse'], coupEclat: ['volonté', 'courage', 'héroï'] };
  function enregistrer() {
    var A = T().ACTIONS, G = T().GENRES;
    Object.keys(ACTIONS).forEach(function (id) { A[id] = ACTIONS[id]; });
    Object.keys(AJOUTS).forEach(function (g) {
      if (!G[g]) return;
      AJOUTS[g].forEach(function (id) { if (G[g].actions.indexOf(id) < 0) G[g].actions.push(id); });
    });
    /* les petites affaires peuvent aussi compter sur un compagnon */
    Object.keys(G).forEach(function (g) {
      var plus = /^mission_/.test(g) ? POUR_MISSIONS : (/^finale_/.test(g) && !G[g].social ? POUR_FINALES : []);
      plus.forEach(function (id) { if (G[g].actions.indexOf(id) < 0) G[g].actions.push(id); });
    });
  }
  function possible(c, s, id) {
    var a = T().ACTIONS[id]; if (!a) return false;
    if (a.si && !a.si(c, s)) return false;
    if (a.unique && s && s.jeu && (s.jeu.vus || []).indexOf(id) >= 0) return false;
    return true;
  }
  /* Effets propres à ces actions. */
  function effet(c, s, a, ctx) {
    switch (a.effet) {
      case 'soudoyer': {
        var h = T().heros(c), n = Math.min(d(4) + T().niveau(c), (h && h.bourse && h.bourse.po) || 0);
        if (h && n) { h.bourse.po -= n; COF.Store.sauver(h); }
        s.jeu.bonus = true; return (n ? '−' + n + ' po · ' : '') + 'dé bonus au prochain jet';
      }
      case 'prog': s.jeu.prog++; return 'objectif +1 de plus';
      case 'torche': { c.ressources.torches = Math.max(0, (c.ressources.torches || 0) - 1); s.jeu.danger = Math.max(0, s.jeu.danger - 1); return '🔥 une torche (reste ' + c.ressources.torches + ') · danger −1'; }
      case 'partage': {
        c.ressources.rations = Math.max(0, (c.ressources.rations || 0) - 1);
        var ru = COF.Aventure.rumeur(); COF.Carnet.ajouterListe(c, 'fils', { nom: ru.nom, note: 'Entendu en partageant un repas.\n' + ru.texte });
        return '🍞 une ration (reste ' + c.ressources.rations + ') · 🧵 ' + ru.nom;
      }
      case 'cueillir': return COF.Echoppes ? COF.Echoppes.cueillir(c, 1 + d(3)) : '';
      case 'verifierRumeur': return COF.Rumeurs ? COF.Rumeurs.verifier(c, s, ctx) : '';
      case 'calme': s.jeu.danger = Math.max(0, s.jeu.danger - 1); return 'danger −1';
      case 'equipe': { var x = compagnon(c); if (x && x.compagnon) x.compagnon.loyaute = Math.min(10, (x.compagnon.loyaute || 5) + (Math.random() < 0.3 ? 1 : 0)); return x ? x.nom + ' s’en charge' : ''; }
    }
    /* les effets des donjons et des routes */
    if (COF.Donjons && /^dj/.test(a.effet || '')) return COF.Donjons.effet(c, s, a, ctx);
    if (COF.Routes && /^rt/.test(a.effet || '')) return COF.Routes.effet(c, s, a, ctx);
    return '';
  }
  /* Contexte en plus pour les phrases. */
  function contexte(c, s, ctx) {
    var x = compagnon(c);
    if (x) { ctx.compagnon = x.nom; ctx.compagnon_il = x.genre === 'féminin' ? 'elle' : 'il'; }
    ctx.nuit = heure(c) === 3 || heure(c) === 0;
    ctx.donjon = !!(s && s.donjon);
    ctx.meteoId = meteo(c);
    if (COF.Routes) COF.Routes.contexte(c, s, ctx);
    ctx.surnom = COF.Legende ? COF.Legende.surnom(c) : '';
    if (!ctx.rumeurTaverne) ctx.rumeurTaverne = p(['un étranger pose beaucoup de questions depuis quelques jours.', 'des disparitions inquiètent le quartier.', 'une prime est offerte pour une affaire délicate.', 'quelqu’un vend des objets volés à bas prix.']);
    return ctx;
  }

  /* ---------- 2. Le récit après chaque action ---------- */
  function famille(g) {
    if (/^mission_|^(piste|fil|libre)$/.test(g)) return 'enquete';
    if (/^finale_|^complication$/.test(g)) return 'epreuve';
    if (['voyage', 'donjon', 'explorer', 'ville'].indexOf(g) >= 0) return g;
    return 'social';
  }
  var PROGRES = {
    enquete: { debut: ['Les premières pièces du puzzle se mettent en place.', 'Un fil se dessine, ténu mais réel.', 'C’est un début. Il en faudra plus.', 'Quelque chose se précise, lentement.'],
      milieu: ['Tout commence à s’emboîter. La vérité n’est plus très loin.', 'Encore un effort : {h} sent que le dénouement approche.', 'Les éléments convergent tous vers une même conclusion.', '{h} touche presque au but.'] },
    epreuve: { debut: ['Le premier pas est franchi. Le plus dur reste à faire.', 'La situation se stabilise un peu.', '{h} reprend l’initiative.'],
      milieu: ['La victoire est à portée de main.', 'Encore un dernier effort !', 'Le vent tourne enfin en faveur de {h}.'] },
    voyage: { debut: ['La route défile. Il reste encore du chemin.', 'Une étape de plus. Les bornes se succèdent.', '{h} trouve son rythme.'],
      milieu: ['La destination n’est plus très loin : on aperçoit déjà les premiers repères.', 'Encore une journée, peut-être deux.', 'Les paysages changent : le but approche.'] },
    donjon: { debut: ['L’endroit est plus vaste qu’il n’y paraissait.', 'Les couloirs s’enfoncent toujours plus loin.'],
      milieu: ['Un courant d’air annonce une grande salle, toute proche.', 'Le cœur des lieux n’est plus loin, {h} le sent.'] },
    explorer: { debut: ['La région se dévoile peu à peu.', 'Chaque pas révèle un nouveau détail.'],
      milieu: ['{h} commence à bien connaître les environs.', 'Il ne reste plus grand-chose à découvrir par ici.'] },
    ville: { debut: ['La ville bruisse de mille histoires.', '{h} commence à comprendre comment tourne cet endroit.'],
      milieu: ['{h} connaît maintenant les ruelles et les visages qui comptent.', 'On commence à reconnaître {h} dans les rues.'] },
    social: { debut: ['La conversation prend un tour intéressant.'], milieu: ['On arrive à l’essentiel.'] }
  };
  var DANGER = {
    enquete: { monte: ['Quelqu’un, quelque part, s’intéresse de près aux questions de {h}.', 'Des regards se détournent un peu trop vite.', 'On parle de {h} à voix basse dans les coins sombres.', 'Une silhouette semble suivre {h} depuis un moment.'],
      imminent: ['L’étau se resserre : encore une erreur, et tout peut basculer.', 'Le danger est là, tout proche. {h} le sent dans sa nuque.', 'Plus le droit à l’erreur : les ennemis de {h} sont sur le qui-vive.'] },
    epreuve: { monte: ['La situation se dégrade.', 'Le temps joue contre {h}.', 'Chaque faux pas coûte cher.'], imminent: ['Tout ne tient plus qu’à un fil.', 'C’est maintenant ou jamais.', 'Encore un échec et tout s’écroule.'] },
    voyage: { monte: ['Le ciel s’assombrit à l’horizon.', 'Des traces fraîches croisent la route. Pas des traces de marchands.', 'Le sentier devient incertain.', 'La fatigue commence à peser.'],
      imminent: ['Au loin, des feux de camp que {h} préférerait éviter.', 'La route devient dangereuse : un mauvais pas, et c’est la catastrophe.', 'Le moindre bruit fait sursauter {h}.'] },
    donjon: { monte: ['Quelque part dans les profondeurs, quelque chose a entendu.', 'Le plafond craque de façon inquiétante.', 'Une odeur de fauve flotte dans le couloir.'],
      imminent: ['Des pas lourds approchent. Ils ne sont plus très loin.', 'Les pierres tremblent : l’endroit ne supportera pas une autre erreur.', 'Un grognement sourd résonne, tout proche.'] },
    explorer: { monte: ['Les oiseaux se sont tus.', 'Des branches cassées, des traces de griffes : on n’est pas seul ici.', 'Le terrain devient traître.'],
      imminent: ['Quelque chose rôde, tout près.', 'Un mauvais pressentiment noue le ventre de {h}.', 'Le terrain s’effrite sous les pieds.'] },
    ville: { monte: ['Un garde observe {h} avec insistance.', 'Les rumeurs vont vite : on parle déjà de l’étranger.', 'Quelques mines patibulaires suivent {h} des yeux.'],
      imminent: ['La garde a été prévenue.', 'Il serait sage de ne plus faire de vagues.', 'Le quartier tout entier semble retenir son souffle.'] },
    social: { monte: ['L’ambiance se rafraîchit.', 'Les sourires se font crispés.'], imminent: ['Encore un mot de travers, et c’est fini.', 'La patience de l’autre a des limites, et elles sont proches.'] }
  };
  /* Une phrase de plus après l'action (ou ''). */
  function apres(c, s, reussi, ctx) {
    var j = s.jeu, f = famille(j.genre), t = [];
    /* la plume compose : avancée, menace, pensée ou sensation, sans répéter le même rythme */
    if (COF.Plume) return COF.Plume.suite(c, s, reussi, ctx, { progres: PROGRES[f][j.prog / j.progMax < 0.5 ? 'debut' : 'milieu'], monte: DANGER[f].monte, imminent: DANGER[f].imminent });
    if (j.prog < j.progMax) {
      if (reussi && Math.random() < 0.6) t.push(T().dire(PROGRES[f][j.prog / j.progMax < 0.5 ? 'debut' : 'milieu'], ctx));
      if (!reussi) {
        var reste = j.dangerMax - j.danger;
        if (reste <= 1) t.push(T().dire(DANGER[f].imminent, ctx));
        else if (Math.random() < 0.6) t.push(T().dire(DANGER[f].monte, ctx));
      }
    }
    if (Math.random() < 0.15 && ctx.decor && f !== 'social') t.push(T().dire(ctx.decor, ctx));
    return t.join(' ');
  }

  /* ---------- 3. Danger au maximum : un revers adapté ----------
     suite : 'echec' (la scène se termine mal) ou 'continue' (on encaisse et on repart). */
  var REVERS = {
    enquete: { combat: 0.3, l: [
      { txt: ['La garde surgit : trop de bruit, trop de questions. {h} s’en tire avec une amende et une mise en garde.', 'Des soldats encerclent {h} : « Vous allez nous suivre. » Une nuit au cachot, une amende, et la piste a refroidi.'], codes: ['po-', 'fac-garde'], suite: 'echec' },
      { txt: ['Trop tard : les témoins se sont tus, les indices ont disparu. Quelqu’un a fait le ménage derrière {h}.', 'La piste est brouillée. Ceux que {h} cherchait savent désormais qu’on les traque.'], codes: ['tension+'], suite: 'echec' },
      { txt: ['Dans une ruelle, un coup de gourdin derrière la tête. {h} se réveille dans la boue, la bourse plus légère, mais bien décidé{he} à continuer.', 'Une agression rapide, brutale : {h} s’en sort, blessé{he}, mais l’enquête continue.'], codes: ['pv-', 'po-petit'], suite: 'continue' },
      { txt: ['Un inconnu glisse un message à {h} : « Laisse tomber, ou tu le regretteras. » On a désormais un ennemi.'], codes: ['hostile', 'tension+'], suite: 'continue' }] },
    epreuve: { combat: 0.55, l: [
      { txt: ['Tout s’écroule. {h} doit battre en retraite, blessé{he} et à bout de forces.', 'L’échec est cuisant : {h} y laisse du sang et de la fierté.'], codes: ['pv-', 'tension+'], suite: 'echec' },
      { txt: ['{h} encaisse un rude coup, se relève, et repart à l’assaut.'], codes: ['pv-'], suite: 'continue' }] },
    voyage: { combat: 0.35, l: [
      { txt: ['{h} s’est égaré{he}. Une journée entière à tourner en rond avant de retrouver la route.', 'Le brouillard tombe d’un coup ; quand il se lève, {h} ne reconnaît plus rien. Une journée de perdue.'], codes: ['jour', 'tension+'], suite: 'continue' },
      { txt: ['Une chute dans un ravin : {h} se relève couvert{he} d’ecchymoses et repart en boitant.', 'Un pont de cordes cède sous les pieds de {h}, qui se rattrape in extremis. Les mains en sang.'], codes: ['pv-'], suite: 'continue' },
      { txt: ['Pendant la nuit, des voleurs ont fouillé le camp. Au réveil, une partie de l’argent a disparu.', 'Des brigands exigent un droit de passage. Pas le choix : il faut payer.'], codes: ['po-'], suite: 'continue' },
      { txt: ['La tempête se déchaîne. Trempé{he} jusqu’aux os, {h} doit s’abriter et attendre.'], codes: ['pv-', 'jour'], suite: 'continue' }] },
    donjon: { combat: 0.5, l: [
      { txt: ['Un grondement sourd, puis le plafond s’effondre. {h} s’échappe de justesse, mais le passage est bouché pour de bon.', 'Les murs tremblent, la voûte cède : il faut fuir, tout de suite. {h} ressort couvert{he} de poussière et d’égratignures.'], codes: ['pv-'], suite: 'echec' },
      { txt: ['Un piège plus vicieux que les autres : une volée de dards empoisonnés. {h} serre les dents et continue.', 'Le sol se dérobe : {h} tombe dans une fosse, et met un long moment à en sortir.'], codes: ['pv-', 'pv-'], suite: 'continue' },
      { txt: ['La torche s’éteint d’un coup. Dans le noir complet, {h} met des heures à retrouver son chemin.'], codes: ['temps', 'tension+'], suite: 'continue' }] },
    explorer: { combat: 0.5, l: [
      { txt: ['Le sol se dérobe sous les pieds de {h}, qui dévale la pente sur plusieurs mètres.', 'Une branche pourrie cède : {h} fait une chute douloureuse.'], codes: ['pv-'], suite: 'continue' },
      { txt: ['{h} s’est perdu{he}. Il faut des heures pour retrouver un repère connu, et l’exploration tourne court.'], codes: ['temps', 'temps'], suite: 'echec' },
      { txt: ['Des ronces, des moustiques, une source empoisonnée : la nature a eu raison de {h}, qui rebrousse chemin.'], codes: ['pv-', 'tension+'], suite: 'echec' }] },
    ville: { combat: 0.12, l: [
      { txt: ['La garde de la ville escorte {h} jusqu’aux portes : « Ne revenez pas de sitôt. »', 'Un sergent prend {h} à part : « On n’aime pas les fauteurs de troubles, ici. » Une amende, et la porte.'], codes: ['po-', 'rep-', 'fac-garde'], suite: 'echec' },
      { txt: ['Un tire-laine a fait son œuvre : la bourse de {h} s’est envolée dans la foule.'], codes: ['po-'], suite: 'continue' },
      { txt: ['La rumeur court : l’étranger fait des histoires. Les portes se ferment, les sourires aussi.'], codes: ['rep-', 'tension+'], suite: 'echec' }] },
    social: { combat: 0, l: [
      { txt: ['La conversation tourne au vinaigre. On se quitte fâchés.', 'Un mot de trop, et tout est gâché.'], codes: ['tension+'], suite: 'echec' },
      { txt: ['L’affaire s’ébruite, et pas à l’avantage de {h}.'], codes: ['rep-'], suite: 'echec' }] }
  };
  /* Décide du revers. Renvoie { combat: true } ou { txt, m, suite }. */
  function rupture(c, s, ctx) {
    var j = s.jeu, f = famille(j.genre), R = REVERS[f] || REVERS.enquete, chance = R.combat;
    if (/^mission_/.test(j.genre) && T().GENRES[j.genre].combat) chance = 0.5;
    if (/^finale_/.test(j.genre) && !T().GENRES[j.genre].social) chance = 0.7;
    if (c.tension >= 7) chance += 0.1;
    if (T().GENRES[j.genre].social) chance = 0;
    if (Math.random() < chance) return { combat: true };
    var r = p(R.l), codes = r.codes.filter(function (x) { return x !== 'jour'; }), m = [];
    if (r.codes.indexOf('jour') >= 0) { T().avancerTemps(c, 4); m.push('une journée perdue'); }
    if (codes.length) { var ap = COF.Imprevus.appliquer(c, s, codes, ctx, { v: {} }); if (ap.m) m.push(ap.m); }
    if (r.suite === 'continue') j.danger = Math.max(0, j.dangerMax - 2);
    return { txt: T().dire(r.txt, ctx), m: 'danger au maximum · ' + (m.join(' · ') || 'revers'), suite: r.suite };
  }

  if (COF.Conteur) enregistrer();
  return { ACTIONS: ACTIONS, AJOUTS: AJOUTS, MOTS: MOTS, enregistrer: enregistrer, possible: possible, effet: effet, contexte: contexte, apres: apres, rupture: rupture, famille: famille, REVERS: REVERS };
})();
