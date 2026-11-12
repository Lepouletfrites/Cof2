/* ============================================================
   COF2 Compagnon — Imprévus procéduraux (aventure solo)
   Pendant une scène jouée, le récit peut faire surgir un imprévu :
   un voyageur, un marchand, une trouvaille, un signe étrange, une
   embuscade, une ville à l'horizon… Chaque imprévu combine un
   modèle et des listes (personnages, états, demandes, objets,
   cachettes, phénomènes…) : plusieurs milliers de situations
   différentes, adaptées au terrain (nature, ville, souterrain).

   Chaque imprévu propose ses propres choix ; leurs effets sont
   réels : pièces, rations, PV, objet dans l'inventaire, PNJ allié
   ou hostile, nouveau fil ou nouvelle quête, lieu ou village
   ajouté à la carte, combat, tension, avancée de la scène.
   ============================================================ */
window.COF = window.COF || {};

COF.Imprevus = (function () {
  function p(l) { return l[Math.floor(Math.random() * l.length)]; }
  function d(n) { return 1 + Math.floor(Math.random() * n); }
  function T() { return COF.Conteur; }
  function K() { return COF.Carnet; }
  function AV() { return COF.Aventure; }
  function M() { return COF.Monde; }

  /* Groupe nominal « m:moine errant » → un/le/du/au moine errant. */
  function np(s) {
    var g = s.charAt(0), n = s.slice(2), v = /^[aeiouyàâäéèêëîïôöûü]/i.test(n);
    return { un: (g === 'f' ? 'une ' : 'un ') + n, le: v ? 'l’' + n : (g === 'f' ? 'la ' : 'le ') + n,
      de: v ? 'de l’' + n : (g === 'f' ? 'de la ' : 'du ') + n, a: v ? 'à l’' + n : (g === 'f' ? 'à la ' : 'au ') + n, e: g === 'f' ? 'e' : '', n: n };
  }

  /* ================= Listes ================= */
  var PERSONNES = ['m:colporteur bossu', 'f:vieille colporteuse', 'm:moine errant', 'f:pèlerine aux pieds nus', 'm:ménestrel sans le sou', 'f:chasseuse de primes',
    'm:déserteur en haillons', 'f:guérisseuse de village', 'm:enfant aux yeux trop sérieux', 'm:vieux soldat manchot', 'f:jeune noble en fuite', 'm:ermite à demi fou',
    'f:diseuse de bonne aventure', 'm:charbonnier taciturne', 'f:bergère inquiète', 'm:messager épuisé', 'f:mercenaire blessée', 'm:alchimiste ambulant',
    'f:veuve en deuil', 'm:nain prospecteur', 'f:elfe silencieuse', 'm:halfelin bavard', 'f:érudite égarée', 'm:prêtre défroqué', 'f:contrebandière',
    'm:fermier ruiné', 'f:sœur d’un temple lointain', 'm:bûcheron effrayé', 'f:aventurière vétérane', 'm:gamin des rues', 'm:orc exilé', 'f:dresseuse d’ours'];
  var ETATS = ['à bout de souffle', 'au visage couvert de cendres', 'qui serre contre sa poitrine un paquet', 'aux vêtements tachés d’un sang qui n’est pas le sien',
    'qui chantonne un air funèbre', 'qui regarde sans cesse derrière son épaule', 'au regard fiévreux', 'qui marmonne sans cesse', 'au visage caché sous un masque de cuir',
    'avec un chien efflanqué sur les talons', 'une lanterne allumée à la main en plein jour', 'un étrange tatouage sur le front', 'qui traîne une charrette à la roue brisée',
    'qui cache mal une arme sous sa cape', 'les poignets marqués par des fers'];
  var DEMANDES = ['demande à {h} de l’escorter jusqu’au prochain village', 'supplie qu’on l’aide à retrouver un proche disparu', 'propose de vendre un secret contre quelques pièces',
    'veut échanger des nouvelles contre un repas chaud', 'met {h} en garde contre un danger sur la route', 'cherche quelqu’un pour porter un message urgent',
    'réclame justice contre un seigneur local', 'prétend connaître un raccourci', 'demande de l’aide pour soigner une vilaine plaie', 'offre ses services comme guide',
    'implore un abri pour la nuit', 'cherche un objet perdu sur le chemin', 'propose un marché étrange', 'transmet un avertissement venu d’un rêve', 'cherche du travail, n’importe lequel'];
  var MARCHANDS = ['m:colporteur jovial', 'f:marchande de tissus', 'm:rémouleur itinérant', 'f:herboriste', 'm:camelot à la voix forte', 'f:naine marchande d’outils',
    'm:brocanteur borgne', 'f:vieille apothicaire', 'm:marchand elfe aux doigts bagués', 'm:halfelin vendeur de tourtes'];
  var ALLURES = ['avec un sourire trop large', 'en jetant des regards inquiets alentour', 'd’un ton pressé', 'avec une politesse exquise', 'd’un regard insistant', 'en se frottant les mains'];
  /* [phrase, effet, nom d'objet] */
  var MARCHANDISES = [['des herbes médicinales', 'soin', ''], ['une carte de la région', 'lieu', ''], ['des provisions de voyage', 'rations', ''],
    ['une fiole d’un liquide ambré « qui guérit tout »', 'objet', 'Fiole de liquide ambré (remède douteux)'], ['une amulette « bénie par trois prêtres »', 'objet', 'Amulette « bénie »'],
    ['un vieux poignard au manche d’os', 'objet', 'Poignard au manche d’os'], ['une lanterne de cuivre', 'objet', 'Lanterne de cuivre'], ['un parchemin couvert de symboles', 'objet', 'Parchemin couvert de symboles'],
    ['une lanterne sourde', 'objet', 'Lanterne sourde'], ['une boussole naine qui ne montre pas le nord', 'objet', 'Boussole naine (qui ne montre pas le nord)'],
    ['des dés pipés', 'objet', 'Dés pipés'], ['une bague en argent terni', 'objet', 'Bague en argent terni'], ['une corde de soie d’araignée', 'objet', 'Corde de soie d’araignée (15 m)'],
    ['un onguent contre les brûlures', 'soin', ''], ['une gourde de liqueur naine', 'objet', 'Gourde de liqueur naine']];
  var TROUVAILLES = [['un coffret de bois verrouillé', 'Coffret de bois verrouillé'], ['une épée brisée gravée d’un blason', 'Épée brisée à blason'], ['un sac de cuir à moitié enterré', ''],
    ['une statuette d’obsidienne', 'Statuette d’obsidienne'], ['un carnet de voyage taché de sang', 'Carnet de voyage taché de sang'], ['une bourse oubliée', ''],
    ['un anneau passé à un doigt d’os', 'Anneau ancien'], ['une fiole intacte au milieu des débris', 'Fiole inconnue'], ['un étendard déchiré', 'Étendard déchiré'],
    ['une clé de bronze ouvragée', 'Clé de bronze ouvragée'], ['un masque de cérémonie', 'Masque de cérémonie'], ['un os gravé de runes', 'Os gravé de runes'],
    ['une boîte à musique encore remontée', 'Boîte à musique'], ['un médaillon contenant un portrait', 'Médaillon à portrait']];
  var CACHETTES = ['au pied d’un arbre foudroyé', 'sous un cairn de pierres', 'dans le creux d’un rocher', 'au fond d’un puits asséché', 'parmi les restes d’un feu de camp',
    'sous une dalle descellée', 'dans un nid abandonné', 'accroché à une branche basse', 'au milieu d’un cercle de champignons', 'dans les bras d’un squelette',
    'entre les racines d’un vieux chêne', 'dans une niche murée'];
  var OBSTACLES = ['un pont de corde à moitié rompu', 'une rivière en crue', 'un éboulement récent', 'une pente de pierres instables', 'une tourbière traîtresse',
    'un essaim de guêpes furieuses', 'un arbre abattu en travers du chemin', 'une crevasse masquée par la neige', 'un ravin à franchir sur un tronc moussu', 'un gué aux pierres glissantes'];
  var ANIMAUX = ['m:cerf blanc', 'f:louve solitaire', 'm:sanglier énorme', 'm:ours brun', 'm:grand corbeau', 'f:chouette aux yeux d’or', 'm:renard argenté', 'f:biche blessée',
    'm:bouc noir', 'f:jument sans cavalier', 'm:chien errant', 'm:aigle royal', 'm:blaireau furieux'];
  var COMPORTEMENTS = ['observe {h} sans ciller', 'barre le chemin', 'suit {h} à distance', 'se débat, une patte prise dans un piège à mâchoires', 'fouille les restes d’un campement',
    'montre les dents', 'tourne lentement autour de {h}', 'semble attendre quelque chose'];
  var PHENOMENES = ['une étoile filante d’un vert maladif', 'un cercle de pierres qui bourdonne doucement', 'des corbeaux qui tournoient en silence', 'une source dont l’eau est tiède et rougeâtre',
    'des runes qui luisent sur un rocher', 'un arbre mort couvert de rubans votifs', 'une musique lointaine, sans musicien', 'un brouillard qui prend des formes humaines',
    'une statue dont les yeux semblent suivre {h}', 'des traces de pas qui s’arrêtent net', 'une cloche qui sonne au loin, là où il n’y a aucun village', 'un autel couvert d’offrandes fraîches',
    'une lune trop grosse, presque rouge', 'des feux follets qui dansent au ras du sol'];
  var RESTES = ['un campement abandonné en hâte', 'le cadavre d’un aventurier', 'une charrette renversée', 'les restes d’une caravane pillée', 'un bivouac encore fumant',
    'une tente lacérée de coups de griffes', 'une cabane de chasseur à la porte arrachée'];
  var HISTOIRES = ['un trésor englouti sous le lac voisin', 'un seigneur qui ne vieillit plus', 'une bête que personne n’a jamais vue en entier', 'une tour apparue en une nuit',
    'des disparitions dans les villages alentour', 'une guerre qui se prépare de l’autre côté des montagnes', 'un culte qui recrute en secret', 'un dragon qu’on dit endormi tout près',
    'une épidémie qu’on cache aux voyageurs', 'une princesse qui ne veut pas être sauvée'];
  var PROPHETIES = ['Le sang coulera avant la nouvelle lune.', 'Ce que tu cherches te cherche aussi.', 'Méfie-toi de celui qui sourit trop.', 'Trois portes, une seule mène quelque part.',
    'Le corbeau sait. Demande au corbeau.', 'Tu reviendras ici, mais tout aura changé.', 'L’or que tu trouveras te coûtera plus cher qu’il ne vaut.', 'Sous la pierre, la vérité dort.'];
  var DEFIS = [['un bras de fer', 'FOR'], ['une partie de dés', 'CHA'], ['un concours de tir à la fronde', 'AGI'], ['un duel de devinettes', 'INT'], ['un concours de boisson', 'CON'],
    ['une course jusqu’au vieux chêne', 'AGI'], ['un concours de regard', 'VOL']];
  var TEMPETES = ['un orage d’une violence rare éclate', 'une grêle drue se met à tomber', 'le vent se change en tempête', 'une brume glacée tombe en quelques instants', 'une pluie diluvienne s’abat'];
  var ANNONCES = ['une prime pour la capture d’un bandit notoire', 'la fermeture des portes à la tombée de la nuit', 'un tournoi pour la fin de la semaine', 'la disparition d’un enfant',
    'une taxe nouvelle sur les voyageurs', 'l’arrivée prochaine d’un dignitaire', 'une récompense pour qui débarrassera la région d’une bête', 'le procès d’une sorcière'];
  var GROUPES = ['des dockers', 'des gardes en civil', 'des étudiants éméchés', 'des charretiers', 'des mercenaires', 'des fidèles de deux temples rivaux', 'des marchands'];
  var BRUITS = ['un raclement dans l’obscurité', 'un souffle rauque tout proche', 'des cliquetis d’ossements', 'un grattement derrière la paroi', 'des pas qui imitent ceux de {h}'];
  var INSCRIPTIONS = ['une inscription à demi effacée', 'une fresque représentant une bataille oubliée', 'une mosaïque fissurée', 'un bas-relief de figures encapuchonnées', 'des graffitis d’anciens aventuriers'];
  var SIGNES_VILLE = ['Des fumées s’élèvent à l’horizon', 'Une cloche résonne au loin', 'Un panneau de bois vermoulu indique un village', 'Des champs cultivés bordent soudain le chemin', 'Une charrette de foin croise {h}'];

  /* ================= Modèles ================= */
  var N = ['foret', 'plaine', 'montagne', 'marais', 'arctique'], U = ['urbain'], S = ['souterrain', 'ruines'];
  var MODELES = [
    { id: 'voyageur', env: N.concat(U), poids: 4, titre: 'Une rencontre', slots: { p: PERSONNES, etat: ETATS, demande: DEMANDES },
      intro: ['{h} croise {p_un} {etat}. {p_le} {demande}.', '{p_un} {etat} s’approche de {h}. Sans préambule, {p_le} {demande}.'],
      choix: [
        { nom: 'Rendre service', auto: true, aide: 'un allié de plus', ok: ['{h} partage ce qu’il faut et prête main-forte. {p_le} promet de ne pas l’oublier.'], eff: ['rations-', 'allie'] },
        { nom: 'Faire parler {p_le}', carac: 'CHA', ok: ['En confiance, {p_le} raconte ce qu’il sait : il est question de {histoire}.', '{p_le} finit par lâcher une information qui pourrait servir.'], eff: ['rumeur', 'prog'],
          ko: ['{p_le} se méfie et coupe court à la conversation.'] },
        { nom: 'Rester sur ses gardes', carac: 'PER', ok: ['{h} remarque à temps la main qui glissait vers sa bourse. {p_le} déguerpit sans demander son reste.'], eff: ['tension-'],
          ko: ['Plus tard, {h} s’aperçoit que sa bourse s’est allégée.'], effKo: ['po-'] },
        { nom: 'Passer son chemin', auto: true, aide: 'rien ne se passe', ok: ['{h} passe son chemin. {p_le} regarde {h} s’éloigner.'] }
      ] },
    { id: 'marchand', env: N.concat(U), poids: 3, titre: 'Un marchand', slots: { p: MARCHANDS, m: MARCHANDISES, allure: ALLURES },
      intro: ['{p_un} hèle {h} {allure} et lui propose {m0}.', 'Au bord du chemin, {p_un} a étalé sa marchandise sur une couverture. Il y a notamment {m0}, que {p_le} vante {allure}.'],
      choix: [
        { nom: 'Acheter', auto: true, aide: 'quelques pièces', ok: ['{h} paie sans discuter et repart avec son achat.'], eff: ['po-', 'achat'] },
        { nom: 'Marchander', carac: 'CHA', ok: ['{h} marchande serré et obtient un prix d’ami.'], eff: ['po-petit', 'achat'], ko: ['{p_le} se vexe et remballe sa marchandise.'] },
        { nom: 'Décliner poliment', auto: true, aide: 'rien ne se passe', ok: ['{h} décline poliment. {p_le} hausse les épaules.'] }
      ] },
    { id: 'trouvaille', env: null, poids: 4, titre: 'Une trouvaille', slots: { t: TROUVAILLES, cachette: CACHETTES },
      intro: ['{h} remarque {t0} {cachette}.', 'Quelque chose brille {cachette} : {t0}.'],
      choix: [
        { nom: 'Examiner avec soin', carac: 'INT', ok: ['{h} examine la trouvaille sans précipitation : rien de piégé, et un détail en dit long sur son ancien propriétaire.'], eff: ['trouvaille', 'indice'],
          ko: ['Un mécanisme caché se déclenche : une aiguille entaille la main de {h}.'], effKo: ['pv-', 'trouvaille'] },
        { nom: 'S’en emparer aussitôt', auto: true, aide: 'mais le danger monte', ok: ['{h} s’en empare sans hésiter. Quelque part, quelque chose a remarqué le geste.'], eff: ['trouvaille', 'danger'] },
        { nom: 'Ne pas y toucher', auto: true, aide: 'rien ne se passe', ok: ['Mieux vaut ne pas tenter le sort. {h} laisse la chose où elle est.'] }
      ] },
    { id: 'obstacle', env: N, poids: 3, titre: 'Un obstacle', slots: { o: OBSTACLES },
      intro: ['Le chemin bute sur {o}.', 'Il faut franchir {o}.'],
      choix: [
        { nom: 'Franchir avec agilité', carac: 'AGI', ok: ['{h} passe d’un bond assuré.'], eff: ['prog'], ko: ['{h} glisse et se blesse en tombant.'], effKo: ['pv-'] },
        { nom: 'Passer en force', carac: 'FOR', ok: ['À la force des bras, {h} se fraie un passage.'], eff: ['prog'], ko: ['L’effort est vain et épuisant.'], effKo: ['pv-', 'temps'] },
        { nom: 'Faire un long détour', auto: true, aide: 'une heure perdue', ok: ['{h} fait un long détour. On arrive toujours, mais plus tard.'], eff: ['temps'] }
      ] },
    { id: 'animal', env: N, poids: 3, titre: 'Une bête', slots: { a: ANIMAUX, comp: COMPORTEMENTS },
      intro: ['{a_un} {comp}.', 'Au détour du chemin, {a_un} {comp}.'],
      choix: [
        { nom: 'Approcher calmement', carac: 'VOL', ok: ['{h} s’approche lentement, la main ouverte. {a_le} se calme, puis s’éloigne paisiblement. Un bon présage, dit-on.'], eff: ['tension-'],
          ko: ['{a_le} prend peur et charge !'], effKo: ['pv-'] },
        { nom: 'Chasser', carac: 'AGI', ok: ['{h} chasse avec adresse : de la viande pour plusieurs jours.'], eff: ['rations+'], ko: ['{a_le} se défend avec rage avant de s’enfuir.'], effKo: ['pv-'] },
        { nom: 'Laisser la bête tranquille', auto: true, aide: 'une heure perdue', ok: ['{h} attend que la bête s’éloigne.'], eff: ['temps'] }
      ] },
    { id: 'signe', env: null, poids: 3, titre: 'Un signe étrange', slots: { ph: PHENOMENES },
      intro: ['{h} aperçoit {ph}.', 'Un frisson parcourt {h} : {ph}.'],
      choix: [
        { nom: 'Étudier le phénomène', carac: 'INT', ok: ['{h} comprend ce que cela annonce et en tire un avantage.'], eff: ['indice', 'prog'], ko: ['Plus {h} y pense, moins cela a de sens. L’inquiétude grandit.'], effKo: ['tension+'] },
        { nom: 'Se recueillir', carac: 'VOL', ok: ['Un étrange apaisement envahit {h}, dont les plaies font soudain moins mal.'], eff: ['pv+'], ko: ['Des visions troublantes hantent {h} un long moment.'], effKo: ['temps'] },
        { nom: 'Ne pas s’attarder', auto: true, aide: 'rien ne se passe', ok: ['{h} presse le pas sans se retourner.'] }
      ] },
    { id: 'restes', env: N.concat(S), poids: 3, titre: 'Des restes', slots: { r: RESTES },
      intro: ['{h} tombe sur {r}.', 'Un peu à l’écart du chemin : {r}.'],
      choix: [
        { nom: 'Fouiller', carac: 'PER', ok: ['Dans le désordre, {h} trouve de quoi se dédommager.'], eff: ['po+', 'indice'], ko: ['La fouille ne donne rien, sinon l’impression d’être observé.'], effKo: ['danger'] },
        { nom: 'Rendre hommage aux morts', auto: true, aide: 'une heure, mais la tension baisse', ok: ['{h} prend le temps d’enterrer ce qui doit l’être. Le geste apaise.'], eff: ['temps', 'tension-'] },
        { nom: 'S’éloigner', auto: true, aide: 'rien ne se passe', ok: ['{h} s’éloigne de ce lieu de malheur.'] }
      ] },
    { id: 'embuscade', env: null, poids: 2, titre: 'Embuscade !', combat: true,
      intro: ['Embuscade ! Des ennemis surgissent de nulle part ({ennemis}).', 'Un sifflement, puis des cris : c’est une attaque ! En face de {h} : {ennemis}.'],
      choix: [
        { nom: 'Faire front', auto: true, aide: 'le combat commence', ok: ['{h} dégaine.'], eff: ['combat'] },
        { nom: 'Parlementer', carac: 'CHA', ok: ['Quelques mots, quelques pièces, et les armes se baissent.'], eff: ['po-petit'], ko: ['Ils ne veulent rien entendre.'], effKo: ['combat'] },
        { nom: 'Fuir à toutes jambes', carac: 'AGI', ok: ['{h} détale et sème ses poursuivants.'], eff: ['temps'], ko: ['Trop lent : les voilà sur {h}.'], effKo: ['combat'] }
      ] },
    { id: 'cache', env: N.concat(S), poids: 2, titre: 'Un lieu caché',
      intro: ['Un sentier envahi par les ronces s’enfonce entre deux rochers. Il ne figure sur aucune carte.', 'Une forme se devine au loin, à demi cachée : un endroit dont personne n’a parlé à {h}.'],
      choix: [
        { nom: 'Noter l’endroit sur la carte', auto: true, aide: 'un lieu de plus sur la carte', ok: ['{h} repère soigneusement l’endroit pour y revenir plus tard.'], eff: ['lieu'] },
        { nom: 'Ignorer', auto: true, aide: 'rien ne se passe', ok: ['Chaque chose en son temps.'] }
      ] },
    { id: 'village', env: N, poids: 2, titre: 'Un village', slots: { sg: SIGNES_VILLE },
      intro: ['{sg} : un village que {h} ne connaissait pas se trouve tout près.'],
      choix: [
        { nom: 'Noter le village sur la carte', auto: true, aide: 'un village à visiter', ok: ['{h} retient le chemin. Un bon lit et des nouvelles fraîches l’y attendent peut-être.'], eff: ['ville'] },
        { nom: 'Observer de loin', carac: 'PER', ok: ['De loin, {h} devine l’agitation qui règne là-bas : quelque chose ne va pas.'], eff: ['ville', 'indice'], ko: ['Trop loin pour voir quoi que ce soit.'], effKo: ['ville'] }
      ] },
    { id: 'veillee', env: N, poids: 2, titre: 'Une veillée', slots: { p: PERSONNES, histoire: HISTOIRES },
      intro: ['Le soir venu, {p_un} demande à partager le feu de {h}, et raconte une histoire à propos de {histoire}.'],
      choix: [
        { nom: 'Écouter attentivement', auto: true, aide: 'un nouveau fil', ok: ['{h} écoute jusqu’au bout. L’histoire lui trotte dans la tête.'], eff: ['rumeur'] },
        { nom: 'Poser des questions précises', carac: 'INT', ok: ['Les réponses sont troublantes de précision. Il y a là une affaire à saisir.'], eff: ['quete'], ko: ['{p_le} se contredit et finit par s’endormir.'] },
        { nom: 'Dormir', auto: true, aide: 'repos', ok: ['{h} s’endort au son de la voix de {p_le}.'], eff: ['pv+'] }
      ] },
    { id: 'mendiant', env: N.concat(U), poids: 2, titre: 'Un présage', slots: { p: PERSONNES, pr: PROPHETIES },
      intro: ['{p_un} agrippe la manche de {h} et murmure : « {pr} »'],
      choix: [
        { nom: 'Donner une pièce', auto: true, aide: '−1 po, dé bonus au prochain jet', ok: ['{p_le} empoche la pièce et ajoute un conseil qui pourrait servir.'], eff: ['po-1', 'indice'] },
        { nom: 'Demander des explications', carac: 'INT', ok: ['Derrière les mots obscurs, {h} discerne un avertissement bien réel.'], eff: ['indice', 'prog'], ko: ['{p_le} éclate d’un rire dément et disparaît dans la foule.'] },
        { nom: 'Se dégager', auto: true, aide: 'rien ne se passe', ok: ['{h} se dégage sans un mot.'] }
      ] },
    { id: 'defi', env: N.concat(U), poids: 2, titre: 'Un défi', slots: { p: PERSONNES, df: DEFIS },
      intro: ['{p_un} défie {h} à {df0}, avec quelques pièces en jeu.'],
      choix: [
        { nom: 'Relever le défi', caracSlot: 'df', ok: ['{h} l’emporte sous les vivats !'], eff: ['po+'], ko: ['{h} perd, et sa bourse aussi.'], effKo: ['po-'] },
        { nom: 'Refuser', auto: true, aide: 'rien ne se passe', ok: ['{h} refuse en souriant.'] }
      ] },
    { id: 'tempete', env: N, poids: 2, titre: 'La tempête', slots: { tp: TEMPETES },
      intro: ['Le ciel noircit d’un coup : {tp}.'],
      choix: [
        { nom: 'Chercher un abri', carac: 'PER', ok: ['{h} trouve un surplomb rocheux juste à temps.'], eff: ['temps'], ko: ['Pas d’abri en vue : le froid glace {h} jusqu’aux os.'], effKo: ['pv-', 'temps'] },
        { nom: 'Continuer coûte que coûte', carac: 'CON', ok: ['{h} serre les dents et avance malgré les éléments.'], eff: ['prog'], ko: ['Les éléments ont raison des forces de {h}.'], effKo: ['pv-'] }
      ] },
    { id: 'pickpocket', env: U, poids: 3, titre: 'Dans la foule',
      intro: ['Dans la foule, une main légère frôle la bourse de {h}.'],
      choix: [
        { nom: 'Saisir le poignet', carac: 'AGI', ok: ['{h} attrape le voleur, un gamin maigre, qui implore pitié et propose une information en échange.'], eff: ['rumeur'], ko: ['Trop tard : la bourse s’est allégée.'], effKo: ['po-'] },
        { nom: 'Crier au voleur', carac: 'CHA', ok: ['La foule s’en mêle et le voleur lâche son butin.'], ko: ['Personne ne bouge, et le voleur s’évanouit dans la cohue.'], effKo: ['po-'] }
      ] },
    { id: 'rixe', env: U, poids: 2, titre: 'Une rixe', slots: { g1: GROUPES, g2: GROUPES },
      intro: ['Une bagarre éclate dans la rue entre {g1} et {g2}.'],
      choix: [
        { nom: 'S’interposer', carac: 'FOR', ok: ['{h} sépare les belligérants. Quelqu’un lui en sera reconnaissant.'], eff: ['allie', 'rep+'], ko: ['{h} prend un mauvais coup dans la mêlée.'], effKo: ['pv-'] },
        { nom: 'Calmer les esprits', carac: 'CHA', ok: ['Quelques mots bien sentis, et chacun repart de son côté.'], eff: ['tension-', 'rep+'], ko: ['Les insultes redoublent ; la garde arrive.'], effKo: ['tension+', 'rep-'] },
        { nom: 'S’éloigner', auto: true, aide: 'rien ne se passe', ok: ['Ce n’est pas son affaire.'] }
      ] },
    { id: 'crieur', env: U, poids: 2, titre: 'Le crieur public', slots: { an: ANNONCES },
      intro: ['Sur la place, un crieur public annonce {an}.'],
      choix: [
        { nom: 'Se renseigner', auto: true, aide: 'une nouvelle affaire', ok: ['{h} se renseigne : il y a là du travail pour qui sait se battre.'], eff: ['quete'] },
        { nom: 'Écouter les commérages', auto: true, aide: 'un nouveau fil', ok: ['Les commentaires des badauds en disent plus que l’annonce.'], eff: ['rumeur'] }
      ] },
    { id: 'patrouille', env: U.concat(['plaine']), poids: 2, titre: 'Une patrouille',
      intro: ['Une patrouille contrôle les voyageurs. Le sergent dévisage {h} avec insistance.'],
      choix: [
        { nom: 'Montrer patte blanche', carac: 'CHA', ok: ['Le sergent fait signe de passer, et lâche même un renseignement utile.'], eff: ['indice'], ko: ['Interrogatoire, fouille, attente : des heures perdues.'], effKo: ['temps', 'tension+'] },
        { nom: 'Graisser la patte', auto: true, aide: 'quelques pièces', ok: ['Une pièce glisse d’une main à l’autre. Personne n’a rien vu.'], eff: ['po-petit'] },
        { nom: 'Éviter le contrôle', carac: 'AGI', ok: ['{h} se faufile sans être vu.'], ko: ['Repéré ! Il faut s’expliquer… et payer une amende.'], effKo: ['po-', 'rep-'] }
      ] },
    { id: 'tenebres', env: S, poids: 3, titre: 'Dans le noir', slots: { b: BRUITS },
      intro: ['Dans les ténèbres, {b}.', '{h} s’immobilise : {b}.'],
      choix: [
        { nom: 'Se cacher et attendre', carac: 'AGI', ok: ['La chose passe tout près sans voir {h}, puis s’éloigne.'], eff: ['temps'], ko: ['La chose a senti {h}.'], effKo: ['combat'] },
        { nom: 'Affronter la menace', auto: true, aide: 'le combat commence', ok: ['{h} lève sa lumière et fait face.'], eff: ['combat'] },
        { nom: 'Rebrousser chemin', auto: true, aide: 'danger +1', ok: ['{h} recule prudemment… mais il faudra bien passer par là.'], eff: ['danger'] }
      ] },
    { id: 'inscription', env: S, poids: 2, titre: 'Une inscription', slots: { ins: INSCRIPTIONS },
      intro: ['Sur la paroi, {ins}.'],
      choix: [
        { nom: 'Déchiffrer', carac: 'INT', ok: ['Le texte révèle un passage secret et ce qu’il protège.'], eff: ['po+', 'prog'], ko: ['En voulant mieux voir, {h} déclenche un vieux mécanisme.'], effKo: ['pv-'] },
        { nom: 'Recopier pour plus tard', auto: true, aide: 'une heure perdue', ok: ['{h} recopie soigneusement l’inscription.'], eff: ['temps', 'indice'] }
      ] },
    /* ===== Imprévus supplémentaires ===== */
    { id: 'pont', env: N, poids: 2, titre: 'Le péage', slots: { p: ['m:troll bougon', 'm:vieux passeur', 'f:gardienne du gué', 'm:soldat désœuvré', 'f:sorcière édentée'], prix: ['une chanson', 'une énigme résolue', 'une pièce d’or', 'un secret', 'un objet personnel'] },
      intro: ['{p_un} garde le seul passage et exige un péage : {prix}.', 'Pour traverser, il faut l’accord {p_de}, qui réclame {prix}.'],
      choix: [
        { nom: 'Payer le prix demandé', auto: true, aide: 'quelques pièces', ok: ['{p_le} s’écarte avec un sourire satisfait.'], eff: ['po-petit'] },
        { nom: 'Ruser', carac: 'INT', ok: ['{h} trouve la faille dans le marché, et passe pour rien.'], eff: ['tension-'], ko: ['{p_le} n’est pas né{p_e} de la dernière pluie.'], effKo: ['po-'] },
        { nom: 'Passer en force', carac: 'FOR', ok: ['{h} bouscule le gardien et traverse.'], eff: ['rep-'], ko: ['Le gardien n’apprécie pas.'], effKo: ['combat'] }
      ] },
    { id: 'colporteur_chanteur', env: N.concat(U), poids: 2, titre: 'Un musicien de passage', slots: { p: ['m:ménestrel aveugle', 'f:joueuse de vielle', 'm:barde fatigué', 'f:chanteuse des rues'], chant: ['une ballade sur un héros oublié', 'une complainte sur la menace qui grandit', 'une chanson grivoise', 'un air que personne ne connaît'] },
      intro: ['{p_un} joue {chant} au bord du chemin, un chapeau posé devant soi.'],
      choix: [
        { nom: 'Écouter attentivement', auto: true, aide: 'une rumeur', ok: ['Les paroles cachent une histoire vraie.'], eff: ['rumeur'] },
        { nom: 'Donner une pièce', auto: true, aide: '−1 po, tension −1', ok: ['{p_le} remercie {h} d’un air chaleureux.'], eff: ['po-1', 'tension-'] },
        { nom: 'Chanter avec {p_le}', carac: 'CHA', ok: ['Le duo improvisé attire une petite foule. On applaudit.'], eff: ['allie', 'tension-'], ko: ['Une fausse note gâche tout.'] }
      ] },
    { id: 'cadavre_message', env: null, poids: 2, titre: 'Un messager mort', slots: { sceau: ['un sceau de cire noire', 'les armoiries d’une grande famille', 'le symbole d’un temple', 'une marque inconnue'] },
      intro: ['Un messager gît au bord du chemin, une flèche dans le dos. Sa sacoche porte {sceau}.'],
      choix: [
        { nom: 'Lire le message', carac: 'INT', ok: ['Le message est codé, mais {h} en perce le sens : de quoi changer bien des choses.'], eff: ['quete'], ko: ['Le code reste indéchiffrable.'], effKo: ['rumeur'] },
        { nom: 'Chercher le tireur', carac: 'PER', ok: ['Des traces mènent à un affût abandonné… et à un indice.'], eff: ['indice'], ko: ['Le tireur n’est pas loin, et il a vu {h}.'], effKo: ['combat'] },
        { nom: 'Enterrer le malheureux', auto: true, aide: 'tension −1', ok: ['{h} offre au messager une sépulture décente.'], eff: ['tension-', 'temps'] }
      ] },
    { id: 'caravane', env: ['plaine', 'foret', 'montagne'], poids: 2, titre: 'Une caravane', slots: { chef: ['f:caravanière au chapeau de feutre', 'm:marchand nain', 'm:vieux conducteur de bœufs'] },
      intro: ['Une caravane de chariots avance lentement. {chef_un} salue {h} et propose de faire route ensemble.'],
      choix: [
        { nom: 'Faire un bout de chemin avec elle', auto: true, aide: 'objectif +1, un bon repas', ok: ['Les heures passent vite en bonne compagnie.'], eff: ['prog', 'rations+'] },
        { nom: 'Offrir sa protection contre paiement', carac: 'CHA', ok: ['Marché conclu : quelques pièces pour veiller sur les chariots.'], eff: ['po+'], ko: ['« On a déjà nos gardes. »'] },
        { nom: 'Commercer', carac: 'CHA', ok: ['Un échange avantageux.'], eff: ['po+'], ko: ['Les prix sont exorbitants.'] }
      ] },
    { id: 'ermite', env: N, poids: 2, titre: 'Un ermite', slots: { lubie: ['parle aux corbeaux', 'collectionne les os', 'prétend avoir cent ans', 'ne parle qu’en énigmes', 'vit dans un arbre creux'] },
      intro: ['Une cabane de branchages : un ermite y vit, et {lubie}. Il fixe {h} sans un mot.'],
      choix: [
        { nom: 'Écouter ses délires', carac: 'INT', ok: ['Au milieu des divagations, une vérité surprenante.'], eff: ['indice', 'indiceSaga'], ko: ['Rien de compréhensible.'] },
        { nom: 'Lui offrir à manger', auto: true, aide: 'un allié de plus', ok: ['L’ermite partage son feu, et sa reconnaissance.'], eff: ['allie'] },
        { nom: 'Passer son chemin', auto: true, aide: 'rien ne se passe', ok: ['{h} s’éloigne. L’ermite ricane dans son dos.'] }
      ] },
    { id: 'fete_village', env: U, poids: 2, titre: 'Jour de fête', slots: { fete: ['la fête des moissons', 'un mariage', 'la foire aux bestiaux', 'la fête du saint patron', 'le carnaval des masques'] },
      intro: ['Aujourd’hui, c’est {fete} : lampions, musique, odeurs de grillades.'],
      choix: [
        { nom: 'Se mêler à la fête', carac: 'CHA', ok: ['{h} trinque, danse, rit : on se souviendra de ce passage.'], eff: ['rep+', 'tension-'], ko: ['{h} se sent étranger à la liesse.'] },
        { nom: 'Écouter les conversations', carac: 'PER', ok: ['Entre deux chansons, un nom revient souvent.'], eff: ['rumeur'], ko: ['Trop de bruit.'] },
        { nom: 'Profiter du repas offert', auto: true, aide: 'un bon repas', ok: ['On ne refuse pas un tel festin.'], eff: ['rations+'] }
      ] },
    { id: 'vieux_soldat', env: U.concat(['plaine']), poids: 2, titre: 'Un vétéran', slots: { guerre: ['la guerre des Trois Couronnes', 'le siège de la cité rouge', 'la grande invasion du nord', 'une bataille dont il ne dit pas le nom'] },
      intro: ['Un vieux soldat amputé d’un bras raconte {guerre} à qui veut l’entendre.'],
      choix: [
        { nom: 'Lui payer à boire', auto: true, aide: '−1 po, un conseil', ok: ['Le vétéran lâche un conseil de survie précieux.'], eff: ['po-1', 'indice'] },
        { nom: 'Lui demander de l’entraîner', carac: 'VOL', ok: ['Une heure de leçons dures, mais utiles.'], eff: ['indice', 'allie'], ko: ['« Reviens quand tu seras prêt. »'] },
        { nom: 'L’écouter jusqu’au bout', auto: true, aide: 'une rumeur', ok: ['Ses histoires cachent une piste.'], eff: ['rumeur', 'temps'] }
      ] },
    { id: 'contrebande', env: U.concat(['marais', 'foret']), poids: 2, titre: 'Des contrebandiers',
      intro: ['À l’abri des regards, des hommes déchargent des caisses sans marque. On n’aime pas les témoins.'],
      choix: [
        { nom: 'Leur proposer ses services', carac: 'CHA', ok: ['Un petit boulot contre de bonnes pièces.'], eff: ['po+', 'rep-', 'fac+pegre'], ko: ['« On ne travaille pas avec des inconnus. »'], effKo: ['danger'] },
        { nom: 'Les dénoncer à la garde', auto: true, aide: 'la garde apprécie, la pègre beaucoup moins', ok: ['La garde intervient. Les contrebandiers jurent vengeance.'], eff: ['rep+', 'hostile', 'fac+garde', 'fac-pegre'] },
        { nom: 'Se faire oublier', carac: 'AGI', ok: ['{h} s’éclipse sans un bruit.'], ko: ['Repéré !'], effKo: ['combat'] }
      ] },
    { id: 'source_magique', env: N.concat(S), poids: 1, titre: 'Une source étrange', slots: { coul: ['argentée', 'd’un bleu irréel', 'qui scintille', 'tiède et sucrée'] },
      intro: ['Une source {coul} jaillit d’un rocher couvert de runes effacées.'],
      choix: [
        { nom: 'Boire', auto: true, aide: 'à vos risques…', ok: ['L’eau a un goût de lumière.'], eff: ['pv+', 'indice'] },
        { nom: 'Étudier les runes', carac: 'INT', ok: ['Les runes parlent d’un lieu oublié.'], eff: ['lieu'], ko: ['Les runes restent muettes.'] },
        { nom: 'Remplir une gourde', auto: true, aide: 'un objet', ok: ['On ne sait jamais.'], eff: ['trouvaille'] }
      ] },
    { id: 'noble_carrosse', env: ['plaine', 'foret', 'urbain'], poids: 2, titre: 'Un carrosse en panne', slots: { n: ['f:comtesse hautaine', 'm:baron replet', 'f:jeune héritière', 'm:évêque pressé'] },
      intro: ['Un carrosse est embourbé, une roue brisée. {n_un} trépigne d’impatience.'],
      choix: [
        { nom: 'Réparer la roue', carac: 'FOR', ok: ['Le carrosse repart ; {n_le} glisse une bourse à {h}.'], eff: ['po+', 'allie'], ko: ['La roue casse à nouveau. {n_le} fulmine.'], effKo: ['tension+'] },
        { nom: 'Lui faire la conversation', carac: 'CHA', ok: ['{n_le} se montre bavard{n_e} sur les intrigues de la cour.'], eff: ['rumeur', 'indice'], ko: ['{n_le} toise {h} avec mépris.'] },
        { nom: 'L’ignorer', auto: true, aide: 'rien ne se passe', ok: ['Les nobles ne sont pas l’affaire de {h}.'] }
      ] },
    { id: 'animal_blesse', env: N, poids: 2, titre: 'Un animal blessé', slots: { a: ['m:faucon à l’aile brisée', 'f:renarde prise au collet', 'm:jeune loup affamé', 'm:corbeau parlant', 'f:chèvre égarée'] },
      intro: ['{a_un} gémit au bord du sentier.'],
      choix: [
        { nom: 'Le soigner', carac: 'INT', ok: ['L’animal se laisse faire, puis suit {h} un moment, comme pour le remercier. Un bon présage.'], eff: ['tension-', 'indice'], ko: ['L’animal mord et s’enfuit.'], effKo: ['pv-'] },
        { nom: 'L’achever proprement', auto: true, aide: 'un bon repas', ok: ['Un geste dur, mais miséricordieux.'], eff: ['rations+'] },
        { nom: 'Passer son chemin', auto: true, aide: 'rien ne se passe', ok: ['La nature suit son cours.'] }
      ] },
    { id: 'statue_parlante', env: S.concat(['foret']), poids: 1, titre: 'Une statue qui parle',
      intro: ['Une statue couverte de mousse ouvre les yeux. « Réponds à ma question, voyageur, et je te dirai ce que tu cherches. »'],
      choix: [
        { nom: 'Répondre à l’énigme', carac: 'INT', ok: ['« Bien répondu. » La statue révèle un secret.'], eff: ['indiceSaga', 'prog'], ko: ['La statue se tait à jamais. Un frisson parcourt {h}.'], effKo: ['tension+'] },
        { nom: 'Lui demander son histoire', carac: 'CHA', ok: ['La statue raconte un lieu englouti par le temps.'], eff: ['lieu'], ko: ['Silence.'] },
        { nom: 'Fuir', auto: true, aide: 'rien ne se passe', ok: ['{h} ne tient pas à discuter avec des pierres.'] }
      ] },
    { id: 'pari_route', env: U.concat(['plaine']), poids: 2, titre: 'Un pari', slots: { p: PERSONNES, defi: ['atteindre le prochain arbre avant lui', 'deviner le poids d’un cochon', 'compter les moutons du troupeau', 'faire tomber une pomme d’un caillou'] },
      intro: ['{p_un} propose un pari idiot : {defi}. Enjeu : quelques pièces.'],
      choix: [
        { nom: 'Accepter', carac: 'PER', ok: ['{h} gagne le pari haut la main.'], eff: ['po+'], ko: ['Perdu !'], effKo: ['po-petit'] },
        { nom: 'Refuser poliment', auto: true, aide: 'rien ne se passe', ok: ['{p_le} hausse les épaules.'] }
      ] },
    { id: 'traces_sang', env: null, poids: 2, titre: 'Des traces de sang',
      intro: ['Une traînée de sang frais part du chemin et s’enfonce dans les fourrés.'],
      choix: [
        { nom: 'Suivre la piste', carac: 'PER', ok: ['Un blessé, caché, qui a beaucoup à raconter.'], eff: ['allie', 'rumeur'], ko: ['La piste mène droit à ce qui l’a blessé.'], effKo: ['combat'] },
        { nom: 'Rester sur ses gardes', auto: true, aide: 'dé bonus au prochain jet', ok: ['{h} avance, la main sur son arme.'], eff: ['indice'] },
        { nom: 'Faire demi-tour', auto: true, aide: 'une heure perdue', ok: ['Mieux vaut un détour.'], eff: ['temps'] }
      ] },
    { id: 'eboulement_mine', env: S.concat(['montagne']), poids: 2, titre: 'Des mineurs piégés',
      intro: ['Des cris étouffés sous un éboulis : des mineurs sont pris au piège !'],
      choix: [
        { nom: 'Dégager les pierres', carac: 'FOR', ok: ['Un à un, les mineurs sortent, couverts de poussière et de reconnaissance.'], eff: ['allie', 'rep+'], ko: ['Les pierres glissent et blessent {h}.'], effKo: ['pv-'] },
        { nom: 'Étayer la galerie', carac: 'INT', ok: ['Un étai bien placé, et le passage est sûr.'], eff: ['allie', 'po+'], ko: ['L’étai cède.'], effKo: ['pv-', 'temps'] },
        { nom: 'Aller chercher de l’aide', auto: true, aide: 'une heure perdue, réputation +1', ok: ['{h} revient avec des bras.'], eff: ['temps', 'rep+'] }
      ] },
    { id: 'jumeaux', env: U, poids: 1, titre: 'Un sosie',
      intro: ['Quelqu’un dans la foule ressemble trait pour trait à {h}… et on l’accuse déjà de méfaits commis la veille.'],
      choix: [
        { nom: 'Prouver son innocence', carac: 'CHA', ok: ['Les témoins se rétractent ; le sosie a filé.'], eff: ['rep+', 'rumeur'], ko: ['Le doute reste.'], effKo: ['rep-'] },
        { nom: 'Poursuivre le sosie', carac: 'AGI', ok: ['Rattrapé : c’est un doppelganger, ou un sacré comédien.'], eff: ['indice', 'combat'], ko: ['Il s’évanouit dans la foule.'], effKo: ['rep-'] }
      ] },
    /* ===== Rebondissements : retournements en pleine scène (tirés à part) ===== */
    { id: 'r_trahison', rebond: true, besoin: 'com', poids: 0, titre: 'Rebondissement : un mensonge', slots: { rev: ['la cible n’est pas du tout ce qu’on croyait', 'l’objet convoité appartient en réalité à quelqu’un d’autre', 'le commanditaire cherche une vengeance, pas la justice', 'toute l’affaire sert à couvrir un crime plus grave'] },
      intro: ['Un détail ne colle pas, puis tout s’éclaire : {com} a menti. En vérité, {rev}.', 'Une lettre oubliée révèle la vérité : {rev}. {com} s’est bien gardé de le dire.'],
      choix: [
        { nom: 'Confronter {com}', carac: 'CHA', ok: ['Pris en faute, {com} avoue tout et fournit enfin les vraies informations.'], eff: ['indice', 'prog'], ko: ['{com} nie en bloc et se méfie désormais de {h}.'], effKo: ['tension+'] },
        { nom: 'Enquêter discrètement', carac: 'INT', ok: ['{h} reconstitue la vérité sans éveiller les soupçons.'], eff: ['prog', 'indice'], ko: ['L’enquête piétine, et le temps file.'], effKo: ['temps', 'danger'] },
        { nom: 'Faire comme si de rien n’était', auto: true, aide: 'danger +1', ok: ['{h} garde le secret pour soi… pour l’instant.'], eff: ['danger'] }
      ] },
    { id: 'r_rival', rebond: true, poids: 0, titre: 'Rebondissement : un rival', slots: { p: ['m:chasseur de primes', 'f:aventurière ambitieuse', 'm:mercenaire sans scrupules', 'f:espionne d’une guilde', 'm:noble ruiné'] },
      intro: ['{p_un} surgit : {p_il} poursuit exactement le même but que {h}, et n’a pas l’intention de partager.', 'Quelqu’un est déjà passé par ici : {p_un}, qui a une longueur d’avance.'],
      choix: [
        { nom: 'Le prendre de vitesse', carac: 'AGI', ok: ['{h} coupe l’herbe sous le pied de son rival.'], eff: ['prog'], ko: ['Le rival prend de l’avance.'], effKo: ['prog-', 'danger'] },
        { nom: 'Proposer une alliance', carac: 'CHA', ok: ['Le rival accepte de faire équipe — pour cette fois.'], eff: ['allie', 'prog'], ko: ['Le rival éclate de rire et devient un ennemi.'], effKo: ['hostile'] },
        { nom: 'L’intimider', carac: 'FOR', ok: ['Le rival renonce et s’éclipse.'], eff: ['tension-'], ko: ['Les armes sortent.'], effKo: ['combat'] }
      ] },
    { id: 'r_piege', rebond: true, poids: 0, titre: 'Rebondissement : un piège', slots: { pg: ['la porte se referme derrière {h}', 'des archers prennent position sur les toits', 'le sol se dérobe sous les pieds de {h}', 'le guide disparaît, laissant {h} seul{he} face à l’ennemi'] },
      intro: ['C’était un piège ! {pg}.', 'Trop tard, {h} comprend qu’on l’attendait : {pg}.'],
      choix: [
        { nom: 'Se dégager à temps', carac: 'AGI', ok: ['D’un bond, {h} échappe au piège.'], eff: ['indice'], ko: ['{h} s’en sort, mais pas sans mal.'], effKo: ['pv-'] },
        { nom: 'Faire front', auto: true, aide: 'le combat commence', ok: ['{h} se retourne, arme au poing.'], eff: ['combat'] },
        { nom: 'Gagner du temps en parlant', carac: 'CHA', ok: ['Quelques mots habiles sèment le doute chez les assaillants.'], eff: ['prog'], ko: ['Personne n’écoute.'], effKo: ['combat'] }
      ] },
    { id: 'r_temoin', rebond: true, poids: 0, titre: 'Rebondissement : un témoin', slots: { p: ['m:palefrenier terrifié', 'f:servante qui en sait trop', 'm:gamin des rues', 'f:vieille lavandière'] },
      intro: ['{p_un} fait signe à {h} : {p_il} a tout vu. Mais deux hommes louches ne {p_lo} quittent pas des yeux.'],
      choix: [
        { nom: 'Protéger le témoin', carac: 'FOR', ok: ['{h} met le témoin à l’abri ; {p_il} raconte tout, soulagé{p_e}.'], eff: ['allie', 'prog'], ko: ['Les deux hommes s’interposent.'], effKo: ['combat'] },
        { nom: 'L’interroger en vitesse', carac: 'CHA', ok: ['En quelques mots, le témoin livre l’essentiel avant de filer.'], eff: ['indice', 'prog'], ko: ['Le témoin panique et s’enfuit.'], effKo: ['danger'] },
        { nom: 'Le laisser tranquille', auto: true, aide: 'tension +1', ok: ['{h} s’éloigne. Le lendemain, on retrouvera le témoin… muet pour toujours.'], eff: ['tension+'] }
      ] },
    { id: 'r_feu', rebond: true, poids: 0, titre: 'Rebondissement : le feu',
      intro: ['Une odeur de fumée, puis des cris : le feu prend tout près, et des gens sont pris au piège.'],
      choix: [
        { nom: 'Se jeter dans les flammes pour les sauver', carac: 'CON', ok: ['{h} ressort de la fumée avec un enfant dans les bras. On l’acclame.'], eff: ['rep+', 'allie'], ko: ['{h} sauve qui {hil} peut, mais les flammes laissent leur marque.'], effKo: ['pv-', 'rep+'] },
        { nom: 'Organiser une chaîne de seaux', carac: 'CHA', ok: ['Sous la direction de {h}, le feu est maîtrisé.'], eff: ['rep+', 'tension-'], ko: ['La panique l’emporte.'], effKo: ['temps'] },
        { nom: 'Profiter de la confusion', auto: true, aide: 'objectif +1, mais réputation −1', ok: ['Pendant que tout le monde court, {h} avance dans son affaire.'], eff: ['prog', 'rep-'] }
      ] },
    { id: 'r_agents', rebond: true, besoin: 'menace', poids: 0, titre: 'Rebondissement : la main de la menace',
      intro: ['Des silhouettes portant la marque de {menace} rôdent : elles cherchent la même chose que {h}. Ce n’est pas un hasard.'],
      choix: [
        { nom: 'Les suivre en secret', carac: 'AGI', ok: ['{h} file les agents jusqu’à un lieu de rendez-vous et surprend leurs plans.'], eff: ['indiceSaga'], ko: ['Repéré !'], effKo: ['combat'] },
        { nom: 'Les affronter', auto: true, aide: 'le combat commence', ok: ['{h} leur barre la route.'], eff: ['combat'] },
        { nom: 'Les laisser passer', auto: true, aide: 'la menace avance', ok: ['{h} se fait discret. Les agents repartent avec ce qu’ils cherchaient.'], eff: ['sagaAvance'] }
      ] },
    { id: 'r_deplace', rebond: true, poids: 0, titre: 'Rebondissement : tout est à refaire',
      intro: ['Mauvaise nouvelle : ce que {h} cherchait a été déplacé il y a peu. Il va falloir reprendre la piste.'],
      choix: [
        { nom: 'Retrouver la nouvelle piste', carac: 'PER', ok: ['Les traces sont fraîches : {h} sait où chercher.'], eff: ['indice'], ko: ['La piste s’est refroidie.'], effKo: ['prog-'] },
        { nom: 'Questionner les gens du coin', carac: 'CHA', ok: ['Un habitant a tout vu passer.'], eff: ['indice'], ko: ['Personne ne sait rien.'], effKo: ['prog-'] }
      ] },
    { id: 'r_complice', rebond: true, poids: 0, titre: 'Rebondissement : une aide inattendue', slots: { p: ['m:contrebandier', 'f:voleuse repentie', 'm:garde corrompu', 'f:informatrice de la pègre'] },
      intro: ['{p_un} aborde {h} : {p_il} connaît un raccourci… contre une part du butin.'],
      choix: [
        { nom: 'Accepter le marché', auto: true, aide: 'objectif +1, quelques pièces', ok: ['Le marché est conclu ; le raccourci existe bel et bien.'], eff: ['prog', 'po-petit'] },
        { nom: 'Marchander', carac: 'CHA', ok: ['Pour presque rien, {h} obtient l’information.'], eff: ['prog'], ko: ['Vexé, l’informateur va vendre l’information à d’autres.'], effKo: ['danger'] },
        { nom: 'Refuser', auto: true, aide: 'rien ne se passe', ok: ['{h} refuse. On ne fait pas confiance à n’importe qui.'] }
      ] },
    { id: 'r_foule', rebond: true, poids: 0, titre: 'Rebondissement : la foule',
      intro: ['Une rumeur court : {h} serait responsable des malheurs du coin. Une foule en colère se forme.'],
      choix: [
        { nom: 'Calmer les esprits', carac: 'CHA', ok: ['La foule se disperse, convaincue.'], eff: ['rep+'], ko: ['Les pierres volent.'], effKo: ['pv-', 'rep-'] },
        { nom: 'Tenir tête', carac: 'VOL', ok: ['Le regard de {h} suffit à faire reculer les plus hardis.'], eff: ['tension-'], ko: ['La foule s’enhardit.'], effKo: ['rep-', 'danger'] },
        { nom: 'S’éclipser', carac: 'AGI', ok: ['{h} disparaît dans une ruelle.'], eff: ['temps'], ko: ['Rattrapé, {h} est malmené.'], effKo: ['pv-'] }
      ] },
    { id: 'r_dilemme', rebond: true, poids: 0, titre: 'Rebondissement : un dilemme',
      intro: ['{h} comprend qu’en allant plus loin, un innocent paiera à sa place. Personne ne le saura jamais… sauf {h}.'],
      choix: [
        { nom: 'Épargner l’innocent', auto: true, aide: 'tension −1, mais l’objectif recule', ok: ['{h} choisit la voie juste, quoi qu’il en coûte.'], eff: ['tension-', 'prog-', 'rep+'] },
        { nom: 'Continuer coûte que coûte', auto: true, aide: 'objectif +1, mais tension +1', ok: ['{h} serre les dents et continue. Il faudra vivre avec.'], eff: ['prog', 'tension+'] },
        { nom: 'Chercher une autre voie', carac: 'INT', ok: ['{h} trouve un moyen d’épargner l’innocent sans renoncer.'], eff: ['prog'], ko: ['Pas d’autre issue…'], effKo: ['tension+'] }
      ] },
    { id: 'r_enleve', rebond: true, poids: 0, titre: 'Rebondissement : un enlèvement', slots: { p: ['m:jeune garçon d’écurie', 'f:fille de l’aubergiste', 'm:vieux guide', 'f:herboriste du coin'] },
      intro: ['Des cris : {p_un}, qui avait aidé {h}, vient d’être enlevé{p_e} sous ses yeux. Un message est resté sur place : « Laissez tomber. »'],
      choix: [
        { nom: 'Se lancer à sa poursuite', carac: 'AGI', ok: ['{h} rattrape les ravisseurs avant qu’ils ne disparaissent.'], eff: ['combat'], ko: ['Ils ont trop d’avance… pour l’instant.'], effKo: ['danger', 'tension+'] },
        { nom: 'Interroger les témoins', carac: 'CHA', ok: ['Un témoin a vu la direction prise.'], eff: ['indice', 'prog'], ko: ['La peur scelle les lèvres.'], effKo: ['danger'] },
        { nom: 'Obéir au message', auto: true, aide: 'tension +1', ok: ['{h} fait profil bas. Mais cette histoire ne s’arrêtera pas là.'], eff: ['tension+', 'rumeur'] }
      ] },
    { id: 'r_tempete', rebond: true, poids: 0, titre: 'Rebondissement : les éléments',
      intro: ['Le ciel se déchire : une tempête d’une violence inouïe s’abat d’un coup, au pire moment.'],
      choix: [
        { nom: 'Chercher un abri et attendre', auto: true, aide: 'une heure perdue', ok: ['Blotti sous un surplomb, {h} attend que ça passe.'], eff: ['temps'] },
        { nom: 'Profiter de la tempête pour avancer', carac: 'CON', ok: ['Personne ne surveille par un temps pareil : {h} en profite.'], eff: ['prog', 'prog'], ko: ['Les éléments sont plus forts.'], effKo: ['pv-'] }
      ] },
    { id: 'r_faux', rebond: true, poids: 0, titre: 'Rebondissement : un faux',
      intro: ['Ce que {h} croyait authentique est un faux grossier. Quelqu’un a voulu brouiller les pistes.'],
      choix: [
        { nom: 'Remonter au faussaire', carac: 'INT', ok: ['Le faussaire a laissé sa signature : une piste toute fraîche.'], eff: ['prog', 'indice'], ko: ['Impossible de savoir d’où vient la contrefaçon.'], effKo: ['prog-'] },
        { nom: 'Utiliser le faux comme appât', carac: 'CHA', ok: ['Le piège fonctionne : quelqu’un mord à l’hameçon.'], eff: ['prog', 'allie'], ko: ['Personne n’y croit.'] }
      ] },
    { id: 'r_jalousie', rebond: true, besoin: 'compagnon', poids: 0, titre: 'Rebondissement : une dispute',
      intro: ['Un compagnon de {h} conteste sa façon de mener l’affaire. Le ton monte.'],
      choix: [
        { nom: 'Écouter ses arguments', auto: true, aide: 'loyauté, mais l’objectif recule', ok: ['{h} reconnaît avoir eu tort. L’atmosphère s’apaise.'], eff: ['prog-', 'tension-'] },
        { nom: 'Imposer son point de vue', carac: 'VOL', ok: ['L’autorité de {h} ne se discute pas.'], eff: ['prog'], ko: ['Le compagnon s’éloigne, vexé.'], effKo: ['tension+'] }
      ] },
    { id: 'r_offre', rebond: true, besoin: 'menace', poids: 0, titre: 'Rebondissement : une offre',
      intro: ['Un émissaire de {menace} aborde {h} : « Mon maître admire votre talent. Rejoignez-nous, et vous serez riche. »'],
      choix: [
        { nom: 'Feindre d’accepter', carac: 'CHA', ok: ['L’émissaire repart confiant, et {h} en sait désormais beaucoup plus.'], eff: ['indiceSaga'], ko: ['L’émissaire n’est pas dupe.'], effKo: ['combat'] },
        { nom: 'Refuser net', auto: true, aide: 'la menace se méfie', ok: ['« Dites à votre maître que je viendrai le chercher moi-même. »'], eff: ['sagaAvance', 'tension-'] },
        { nom: 'Capturer l’émissaire', carac: 'FOR', ok: ['Ligoté, l’émissaire finit par parler.'], eff: ['indiceSaga', 'prog'], ko: ['Il appelle ses gardes.'], effKo: ['combat'] }
      ] },
    { id: 'r_vieille_dette', rebond: true, poids: 0, titre: 'Rebondissement : une vieille dette', slots: { p: ['m:usurier', 'f:ancienne compagne d’armes', 'm:frère d’armes trahi', 'f:marchande flouée'] },
      intro: ['{p_un} surgit du passé de {h} : « Tu me dois quelque chose. Et c’est maintenant que je viens le réclamer. »'],
      choix: [
        { nom: 'Payer sa dette', auto: true, aide: 'des pièces', ok: ['La dette est réglée. Une page se tourne.'], eff: ['po-', 'tension-'] },
        { nom: 'Négocier un service', carac: 'CHA', ok: ['{p_le} accepte une aide en échange, et devient un allié.'], eff: ['allie'], ko: ['{p_le} repart, rancunier.'], effKo: ['hostile'] }
      ] },
    { id: 'r_maladie', rebond: true, poids: 0, titre: 'Rebondissement : la fièvre',
      intro: ['{h} sent la fièvre monter : une mauvaise eau, une piqûre, un mauvais sort ? Les jambes deviennent lourdes.'],
      choix: [
        { nom: 'Serrer les dents', carac: 'CON', ok: ['La fièvre tombe aussi vite qu’elle était venue.'], eff: ['prog'], ko: ['Des heures de délire.'], effKo: ['pv-', 'temps'] },
        { nom: 'Se reposer un peu', auto: true, aide: 'une heure perdue', ok: ['Une courte sieste, et ça va mieux.'], eff: ['temps', 'pv+'] }
      ] },
    { id: 'r_carte', rebond: true, poids: 0, titre: 'Rebondissement : une carte',
      intro: ['Dans une poche, un tiroir, un coffre : une carte annotée de la main de quelqu’un qui cherchait la même chose que {h}.'],
      choix: [
        { nom: 'Suivre la carte', carac: 'PER', ok: ['La carte mène à un lieu qu’on croyait légendaire.'], eff: ['lieu', 'prog'], ko: ['La carte est fausse… ou incomplète.'], effKo: ['temps'] },
        { nom: 'L’étudier tranquillement', carac: 'INT', ok: ['Les annotations révèlent un secret.'], eff: ['indice', 'indiceSaga'], ko: ['Des gribouillis.'] }
      ] },
    { id: 'r_innocent', rebond: true, poids: 0, titre: 'Rebondissement : un faux coupable',
      intro: ['La garde vient d’arrêter quelqu’un pour l’affaire que suit {h}… mais {h} sait que ce n’est pas le bon.'],
      choix: [
        { nom: 'Prouver son innocence', carac: 'INT', ok: ['Les preuves sont accablantes : on libère l’innocent, qui jure fidélité à {h}.'], eff: ['allie', 'rep+'], ko: ['Personne ne veut entendre.'], effKo: ['tension+'] },
        { nom: 'Laisser faire', auto: true, aide: 'objectif +1, tension +1', ok: ['Le vrai coupable baisse sa garde : une chance à saisir.'], eff: ['prog', 'tension+'] }
      ] },
    { id: 'r_trahison_allie', rebond: true, besoin: 'allie', poids: 0, titre: 'Rebondissement : un allié douteux',
      intro: ['Un allié de {h} a été vu en compagnie des ennemis. Coïncidence, ou double jeu ?'],
      choix: [
        { nom: 'Le confronter', carac: 'CHA', ok: ['Malentendu : il espionnait pour {h}, et rapporte des informations.'], eff: ['indice', 'prog'], ko: ['Il nie, et la confiance est brisée.'], effKo: ['tension+'] },
        { nom: 'Le suivre en secret', carac: 'AGI', ok: ['La vérité éclate : il est fidèle.'], eff: ['tension-'], ko: ['Repéré : l’allié est vexé.'], effKo: ['tension+'] }
      ] },
    /* PNJ déjà rencontrés qui reviennent (tirés à part, voir declencher) */
    { id: 'retourAmi', env: null, poids: 0, titre: 'Un visage connu',
      intro: ['« {h} ! » Une voix familière : c’est {x}, croisé{xe} au jour {xj}.', '{x} ! {h} reconnaît aussitôt ce visage ami, et la rencontre fait chaud au cœur.'],
      choix: [
        { nom: 'Accepter son aide', auto: true, aide: 'dé bonus et objectif +1', ok: ['{x} connaît l’endroit et donne à {h} un coup de main bienvenu.'], eff: ['indice', 'prog'] },
        { nom: 'Échanger des nouvelles', auto: true, aide: 'un nouveau fil', ok: ['Autour d’un repas, {x} raconte ce qui se passe dans la région.'], eff: ['rumeur'] },
        { nom: 'Proposer à {x} de se joindre à {h}', carac: 'CHA', ok: ['{x} hésite, puis accepte : « Après tout, à deux on va plus loin. »'], eff: ['recruter'],
          ko: ['{x} décline à regret : ses propres affaires l’appellent.'] }
      ] },
    { id: 'retourEnnemi', env: null, poids: 0, titre: 'Une vieille rancune',
      intro: ['{x} ! {h} reconnaît ce visage haï, flanqué de quelques hommes de main.', '{x} barre le chemin, un sourire mauvais aux lèvres : « On se retrouve enfin. »', '{nemesis}'],
      choix: [
        { nom: 'Affronter {x}', auto: true, aide: 'le combat commence', ok: ['{h} fait face. Il est temps de régler cette affaire.'], eff: ['combat', 'nemesis'] },
        { nom: 'Négocier une trêve', carac: 'CHA', ok: ['Contre toute attente, {x} accepte d’enterrer la hache de guerre… pour cette fois.'], eff: ['apaiser'], ko: ['{x} éclate de rire. Les armes sortent.'], effKo: ['combat', 'nemesis'] },
        { nom: 'S’esquiver', carac: 'AGI', ok: ['{h} disparaît avant que {x} ne puisse réagir.'], eff: ['temps', 'nemesis'], ko: ['Trop tard : {x} a vu {h}.'], effKo: ['combat', 'nemesis'] }
      ] },
    { id: 'enfant', env: N.concat(U), poids: 1, titre: 'Un enfant perdu',
      intro: ['Un enfant en larmes est assis au bord du chemin. Il dit s’être perdu en cherchant sa mère.'],
      choix: [
        { nom: 'Le ramener chez lui', auto: true, aide: 'une heure, mais un allié', ok: ['{h} raccompagne l’enfant. Sa famille, émue, jure de lui rendre la pareille.'], eff: ['temps', 'allie', 'tension-'] },
        { nom: 'Le questionner', carac: 'CHA', ok: ['Entre deux sanglots, l’enfant parle de ce qu’il a vu dans les bois : de quoi inquiéter.'], eff: ['rumeur'], ko: ['L’enfant se mure dans le silence.'] }
      ] }
  ];

  /* ================= Tirage ================= */
  function compatibles(env) {
    return MODELES.filter(function (m) { return !m.env || m.env.indexOf(env) >= 0; });
  }
  function tirerModele(env) {
    var l = compatibles(env), tot = 0;
    l.forEach(function (m) { tot += m.poids; });
    var r = Math.random() * tot;
    for (var i = 0; i < l.length; i++) { r -= l[i].poids; if (r < 0) return l[i]; }
    return l[0];
  }
  function modele(id) { return MODELES.filter(function (m) { return m.id === id; })[0]; }
  /* Remplit les cases du modèle : valeurs figées dans l'événement. */
  function remplir(m) {
    var v = {};
    Object.keys(m.slots || {}).forEach(function (k) {
      var x = p(m.slots[k]);
      if (Array.isArray(x)) { v[k + '0'] = x[0]; v[k + '1'] = x[1]; v[k + '2'] = x[2]; }
      else if (/^[mf]:/.test(x)) { var g = np(x); v[k + '_un'] = g.un; v[k + '_le'] = g.le; v[k + '_de'] = g.de; v[k + '_a'] = g.a; v[k + '_e'] = g.e; v[k + '_il'] = g.e ? 'elle' : 'il'; v[k + '_lo'] = g.e ? 'la' : 'le'; }
      else v[k] = x;
    });
    if (v.g1 && v.g1 === v.g2) v.g2 = 'des gardes';
    return v;
  }
  function ctxEvt(c, s, evt) { return Object.assign(T().contexte(c, s), evt.v); }

  /* Fait surgir un imprévu dans la scène. Renvoie l'événement. */
  /* opts.rebond : un retournement de situation (modèles « rebond » adaptés à la scène) */
  function declencher(c, s, opts) {
    var j = s && s.jeu; if (!j || j.fini || j.evt || c.rencontre) return null;
    var ctx0 = T().contexte(c, s), m = tirerModele(ctx0.env), v = remplir(m);
    if (opts && opts.rebond) {
      var rb = MODELES.filter(function (x) { return x.rebond && (x.besoin !== 'com' || ctx0.com) && (x.besoin !== 'menace' || (c.saga && !c.saga.fini)) && (x.besoin !== 'compagnon' || (c.pnj || []).some(function (y) { return y.compagnon && y.compagnon.actif; })) && (x.besoin !== 'allie' || (c.pnj || []).some(function (y) { return y.attitude === 'allié'; })) && (j.rebondsVus || []).indexOf(x.id) < 0; });
      if (!rb.length) return null;
      m = rb[Math.floor(Math.random() * rb.length)]; v = remplir(m);
      j.rebondsVus = (j.rebondsVus || []).concat([m.id]);
    }
    /* un PNJ déjà rencontré peut revenir (allié, ou ennemi qui devient une némésis) */
    var connus = (c.pnj || []).filter(function (x) { return (x.attitude === 'allié' || x.attitude === 'hostile') && !(x.compagnon && x.compagnon.actif) && x.jour !== c.jour; });
    if (!(opts && opts.rebond) && connus.length && Math.random() < 0.3) {
      var x = p(connus), ami = x.attitude === 'allié';
      m = modele(ami ? 'retourAmi' : 'retourEnnemi');
      v = { x: x.nom, xid: x.id, xj: x.jour || '?', xe: x.genre === 'féminin' ? 'e' : '' };
      v.nemesis = x.nemesis ? 'Encore {x} ! Cette némésis ne lâchera donc jamais {h}.' : '{x} surgit au détour du chemin, l’air mauvais.';
      if (!ami) { var rr = AV().rencontre(c, { env: ctx0.env, difficulte: 'ordinaire', style: 'auto' }); if (!rr.erreur) { v.rencontre = rr; v.ennemis = rr.texte; } }
    }
    if (m.combat) {
      var r = AV().rencontre(c, { env: ctx0.env, difficulte: COF.Saga ? COF.Saga.diffMenace(c) : 'ordinaire', style: 'auto', theme: Math.random() < 0.5 });
      if (r.erreur) return null;
      v.ennemis = r.texte; v.rencontre = r;
    }
    var evt = { id: m.id, v: v, titre: m.titre };
    j.evt = evt; j.nbEvt = (j.nbEvt || 0) + 1;
    K().ajouterEntree(c, { t: 'recit', evt: true, titre: m.titre, txt: T().dire(m.intro, ctxEvt(c, s, evt)) });
    return evt;
  }
  function choix(c, s) {
    var evt = s.jeu.evt, m = modele(evt.id); if (!m) return [];
    var ctx = ctxEvt(c, s, evt), j = s.jeu;
    return m.choix.map(function (ch, i) {
      var carac = ch.caracSlot ? evt.v[ch.caracSlot + '1'] : ch.carac;
      var o = { i: i, nom: T().polir(T().ex(ch.nom, ctx)), auto: !!ch.auto, aide: ch.aide, evt: true };
      if (!ch.auto) { o.carac = carac; o.mod = T().caracHeros(c, carac); o.diff = T().difficulteBase(c); }
      return o;
    });
  }

  /* ================= Effets ================= */
  function appliquer(c, s, codes, ctx, evt) {
    var m = [], j = s.jeu, hP = T().heros(c), niv = T().niveau(c), out = {};
    (codes || []).forEach(function (code) {
      var x;
      switch (code) {
        case 'po+': x = T().payer(c, d(6) * niv + d(6)); break;
        case 'po-': case 'po-petit': case 'po-1': {
          var n = code === 'po-1' ? 1 : (code === 'po-petit' ? d(4) + niv : d(6) * niv);
          if (hP) { hP.bourse = hP.bourse || { po: 0, pa: 0, pc: 0 }; n = Math.min(n, hP.bourse.po || 0); hP.bourse.po -= n; COF.Store.sauver(hP); x = n ? '−' + n + ' po' : 'bourse vide'; }
          break;
        }
        case 'rations+': x = T().repas(c); break;   /* de quoi manger : un bon repas */
        case 'rations-': break;
        case 'torches': break;
        case 'pv-': x = T().blesser(c, d(4) + Math.floor(niv / 3)); break;
        case 'pv+': case 'soin': {
          if (!hP) break;
          if (hP.pv === null || hP.pv === undefined) COF.Store.reinitialiser(hP);
          var max = COF.Calc.pvMax(hP), av = hP.pv; hP.pv = Math.min(max, hP.pv + d(6) + niv); COF.Store.sauver(hP);
          x = '+' + (hP.pv - av) + ' PV (' + hP.pv + ')'; break;
        }
        case 'indice': j.bonus = true; x = 'dé bonus au prochain jet'; break;
        case 'prog': if (j.progMax > 0 && j.genre !== 'confrontation') { j.prog++; x = 'objectif +1'; } break;
        case 'danger': j.danger++; x = 'danger +1'; break;
        case 'temps': T().avancerTemps(c, 1); x = 'une heure passe'; break;
        case 'tension-': c.tension = Math.max(1, c.tension - 1); x = 'tension −1'; break;
        case 'tension+': c.tension = Math.min(9, c.tension + 1); x = 'tension +1'; break;
        case 'allie': case 'hostile': {
          var g = evt.v.p_e !== undefined ? (evt.v.p_e ? 'féminin' : 'masculin') : null;
          var pn = AV().pnj(g ? { genre: g } : {});
          var nx = K().ajouterListe(c, 'pnj', { nom: pn.nom, genre: g || undefined, lieuId: (M().ici(c) || {}).id || null, jour: c.jour, attitude: code === 'allie' ? 'allié' : 'hostile', note: 'Rencontré le jour ' + c.jour + (evt.v.p_un ? ' : ' + evt.v.p_un + (evt.v.etat ? ' ' + evt.v.etat : '') : '') + '.\n' + pn.texte });
          x = (code === 'allie' ? '🤝 ' : '⚔️ ') + pn.nom + ' ajouté aux PNJ';
          /* on s'en souviendra : un obligé, ou un ennemi qui reviendra */
          if (COF.Echos && Math.random() < 0.45) COF.Echos.noter(c, code === 'allie' ? 'sauve' : 'rancune', { pnjId: nx.id });
          break;
        }
        case 'rumeur': { var ru = AV().rumeur(); K().ajouterListe(c, 'fils', { nom: ru.nom, note: ru.texte }); x = '🧵 ' + ru.nom; break; }
        case 'quete': { var q = COF.Directeur.creerQuete(c); x = '📜 Nouvelle quête : ' + q.nom; out.quete = q; break; }
        case 'lieu': { var l = T().decouvrirLieu(c, null); x = l ? '🗺️ ' + l.nom + ' ajouté à la carte' : ''; break; }
        case 'ville': { var vl = COF.Villes.decouvrir(c); x = vl ? '🏘️ ' + vl.nom + ' ajouté à la carte' : ''; break; }
        case 'trouvaille': {
          if (evt.v.t1 && hP) { COF.Store.ajouterObjet(hP, { nom: evt.v.t1, qte: 1, prix: d(10) }); COF.Store.sauver(hP); x = '🎒 ' + evt.v.t1; }
          else x = T().payer(c, d(6) * niv + d(6));
          break;
        }
        case 'achat': {
          var e = evt.v.m1;
          if (e === 'soin') { var r3 = appliquer(c, s, ['pv+'], ctx, evt); x = r3.m; }
          else if (e === 'rations') { x = T().repas(c); }

          else if (e === 'lieu') { var l2 = T().decouvrirLieu(c, null); x = l2 ? '🗺️ ' + l2.nom + ' ajouté à la carte' : ''; }
          else if (hP && evt.v.m2) { COF.Store.ajouterObjet(hP, { nom: evt.v.m2, qte: 1, prix: d(10) }); COF.Store.sauver(hP); x = '🎒 ' + evt.v.m2; }
          break;
        }
        case 'combat': out.combat = true; break;
        case 'prog-': if (j.prog > 0) { j.prog--; x = 'objectif −1'; } break;
        case 'indiceSaga': if (COF.Saga && c.saga && !c.saga.fini) x = COF.Saga.indice(c); else { j.bonus = true; x = 'dé bonus au prochain jet'; } break;
        case 'sagaAvance': if (COF.Saga && c.saga && !c.saga.fini) x = COF.Saga.avancer(c, 1); break;
        case 'recruter': case 'apaiser': case 'nemesis': {
          var px = (c.pnj || []).filter(function (y) { return y.id === evt.v.xid; })[0]; if (!px) break;
          if (code === 'recruter') { px.compagnon = { actif: true, role: 'combattant', niveau: niv }; x = '🤝 ' + px.nom + ' rejoint le héros'; }
          else if (code === 'apaiser') { px.attitude = 'neutre'; px.nemesis = false; x = px.nom + ' n’est plus hostile'; }
          else { px.vus = (px.vus || 0) + 1; if (px.vus >= 2 && !px.nemesis) { px.nemesis = true; x = '☠️ ' + px.nom + ' devient la némésis du héros'; } }
          px.jour = c.jour; break;
        }
        default: { var fm = /^fac([+-])(\w+)$/.exec(code); if (fm && COF.Factions) x = COF.Factions.changer(c, fm[2], fm[1] === '+' ? 1 : -1); break; }
        case 'rep+': case 'rep-': if (COF.Saga) x = COF.Saga.changerRep(M().ici(c), code === 'rep+' ? 1 : -1); break;
      }
      if (x) m.push(x);
    });
    out.m = m.join(' · ');
    return out;
  }

  /* Le héros répond à l'imprévu. Renvoie { menace } si un combat éclate. */
  function resoudre(c, s, i) {
    var j = s.jeu, evt = j.evt, mo = modele(evt.id), ch = mo && mo.choix[i]; if (!ch) return {};
    var ctx = ctxEvt(c, s, evt), txt, codes, meca = [], reussi = true;
    if (ch.auto) { txt = T().dire(ch.ok, ctx); codes = ch.eff; meca.push('sans jet'); }
    else {
      var carac = ch.caracSlot ? evt.v[ch.caracSlot + '1'] : ch.carac;
      var jet = T().jet(c, s, carac, T().difficulteBase(c));
      reussi = jet.reussi; meca.push(jet.m);
      txt = T().dire(reussi ? ch.ok : (ch.ko || ['Ça ne marche pas.']), ctx);
      codes = reussi ? ch.eff : ch.effKo;
    }
    var res = appliquer(c, s, codes, ctx, evt);
    if (res.m) meca.push(res.m);
    j.evt = null;
    K().ajouterEntree(c, { t: 'recit', txt: txt, m: meca.join(' · '), ok: reussi });
    var out = {};
    if (res.combat) out.menace = T().engager(c, s, evt.v.rencontre || null);
    else T().reprendre(c, s);
    K().sauver(c);
    return out;
  }

  /* Nombre de situations différentes (pour information). */
  function combinaisons() {
    return MODELES.reduce(function (tot, m) {
      var n = m.intro.length;
      Object.keys(m.slots || {}).forEach(function (k) { n *= m.slots[k].length; });
      return tot + n;
    }, 0);
  }
  return { declencher: declencher, choix: choix, resoudre: resoudre, appliquer: appliquer, combinaisons: combinaisons, MODELES: MODELES, np: np };
})();
