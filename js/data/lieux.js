/* ============================================================
   COF2 Compagnon — Données : lieux & établissements
   Tables combinées par js/core/lieux.js pour générer tavernes,
   boutiques et villages/villes à la volée.
   ============================================================ */
window.COF = window.COF || {};

/* ---------- Noms de taverne (générés par combinaison, voir core) ---------- */
COF.LIEUX_TAVERNE_SUBST_M = [
  'Sanglier', 'Corbeau', 'Dragon', 'Griffon', 'Loup', 'Chaudron', 'Tonneau',
  'Marteau', 'Faucon', 'Ours', 'Cerf', 'Lion', 'Croissant', 'Gobelet', 'Bouclier',
  'Renard', 'Hibou', 'Blaireau', 'Étalon', 'Aigle', 'Bélier', 'Phénix', 'Sorcier',
  'Pèlerin', 'Marin', 'Nain', 'Troll', 'Épouvantail', 'Moulin', 'Puits'
];
COF.LIEUX_TAVERNE_ADJ_M = [
  'Doré', 'Ivre', 'Borgne', 'Fumant', 'Endormi', 'Rouge', 'Joyeux', 'Vaillant',
  'Rusé', 'Édenté', 'Boiteux', 'Silencieux', 'Fidèle', 'Grognon', 'Hurlant',
  'Voyageur', 'Perdu', 'Assoiffé', 'Malicieux', 'Chantant', 'Pansu', 'Bavard'
];
COF.LIEUX_TAVERNE_SUBST_F = [
  'Rose', 'Étoile', 'Lanterne', 'Auberge', 'Tour', 'Cloche', 'Cruche', 'Licorne',
  'Sirène', 'Chèvre', 'Truie', 'Fontaine', 'Ancre', 'Couronne', 'Épée',
  'Lune', 'Chandelle', 'Charrette', 'Oie', 'Vipère', 'Marmite', 'Belette'
];
COF.LIEUX_TAVERNE_ADJ_F = [
  'Dorée', 'Fanée', 'Rouge', 'Joyeuse', 'Rusée', 'Silencieuse', 'Édentée',
  'Boiteuse', 'Ivre', 'Endormie', 'Fidèle', 'Hurlante', 'Grinçante',
  'Voyageuse', 'Perdue', 'Assoiffée', 'Malicieuse', 'Chantante', 'Bavarde'
];
COF.LIEUX_TAVERNE_PLURIELS = [
  'Trois Tonneaux', 'Bons Amis', 'Chandelles Vertes', 'Deux Épées', 'Vents Contraires',
  'Voyageurs Perdus', 'Frères Ivres', 'Cloches Fêlées', 'Quatre Vents', 'Ombres Longues',
  'Bottes Usées', 'Dés Pipés', 'Amants Maudits', 'Corbeaux Gris', 'Routes Croisées', 'Sacs Percés'
];
COF.LIEUX_NOMS_PATRON = [
  'Grosbert', 'Odile', 'Fendard', 'Mère Ancelle', 'Barnabé', 'Tortue', 'Grand Ours',
  'Vieux Renard', 'Margaux', 'Père Ulric', 'Coudebois', 'Rondin', 'Ganelon',
  'Berthold', 'Mère Corbin', 'Gaufrette', 'Sac-à-vin', 'Petit Jehan', 'Dame Roussette', 'Trois-Doigts'
];

COF.LIEUX_TAVERNE_AMBIANCE = [
  "Chaleureuse et bruyante, pleine à craquer dès le crépuscule",
  "Calme et feutrée, réservée à une clientèle discrète",
  "Enfumée et bon marché, refuge des dockers et des routiers",
  "Élégante mais guindée, mal à l'aise avec les étrangers crasseux",
  "Délabrée mais accueillante, tenue à bout de bras par son patron",
  "Animée par un musicien du coin presque tous les soirs",
  "Étrangement silencieuse, comme si tout le monde écoutait tout le monde",
  "Bondée d'habitués qui connaissent le nom de chaque client",
  "Sombre et un peu louche, on y parle affaires à voix basse",
  "Familiale et rassurante, les enfants y courent entre les tables",
  "Prisée des érudits et voyageurs, cartes et livres traînent partout",
  "Rudimentaire, quatre murs et des tonneaux en guise de sièges",
  "Fréquentée par une faune bigarrée de toutes les races du coin",
  "Sur ses gardes : une rixe récente a laissé des traces",
  "Décorée avec un goût douteux, trophées de chasse improbables aux murs",
  "Prise d'assaut par une noce ou une fête locale ce soir-là",
  "Quasi déserte, l'endroit semble vivre ses derniers jours",
  "Chic et hors de prix, on y croise plus de bijoux que de bière",
  "Envahie par une odeur tenace de ragoût qui mijote depuis le matin",
  "Tenue par une famille sur trois générations, chacune avec son mot à dire",
  "Fréquentée par une guilde ou une corporation qui s'y réunit en privé",
  "Éclairée a minima, on distingue à peine le visage de son voisin"
];
COF.LIEUX_TAVERNE_SPECIALITE = [
  "un ragoût de gibier réputé dans toute la région",
  "une bière brune brassée sur place, forte en goût",
  "un pain d'épices que les enfants réclament",
  "un vin résiné qu'on ne trouve nulle part ailleurs",
  "une soupe de poisson servie dans des miches creusées",
  "un alcool de fruits distillé en cachette",
  "un fromage fumé à la cheminée de l'établissement",
  "des brochettes grillées à la broche, jour et nuit",
  "une tourte à la viande, secret de famille depuis trois générations",
  "un cidre âpre qui ne pardonne pas aux imprudents",
  "un hydromel épicé réservé aux grandes occasions",
  "rien de spécial, mais la portion est toujours généreuse",
  "une bière noire tellement épaisse qu'on la mange presque à la cuillère",
  "un ragoût dont personne n'ose vraiment demander la composition",
  "des tourtes miniatures vendues à la douzaine pour la route",
  "un vin chaud aux épices, servi été comme hiver",
  "une tarte aux fruits de saison, chaque jour différente",
  "un alcool clandestin qu'on ne sert qu'aux habitués de confiance"
];
COF.LIEUX_TAVERNE_PARTICULARITE = [
  "Une partie de dés acharnée occupe une table depuis des heures",
  "Un vieux chien édenté dort en travers de l'entrée",
  "Un troubadour raconte une histoire qui grandit à chaque verre",
  "Une chambre à l'étage est louée à un client mystérieux depuis des semaines",
  "Le tavernier garde une arbalète chargée sous le comptoir",
  "Un tableau d'annonces couvre un pan de mur : primes, avis de recherche, offres d'emploi",
  "Une cave voûtée sert d'entrepôt discret à qui sait demander",
  "Les murs sont couverts de trophées de chasse plus ou moins crédibles",
  "Un des habitués raconte inlassablement le même exploit passé",
  "Une odeur d'encens masque mal quelque chose de plus âcre",
  "Un jeu de fléchettes improvisé anime le fond de la salle",
  "La bâtisse penche visiblement d'un côté, sans que personne ne s'en inquiète",
  "Un perroquet ou un corbeau apprivoisé répète des bribes de conversations volées",
  "Une fresque murale, à moitié effacée, représente un événement local oublié",
  "Un tonneau vide sert de tribune à quiconque veut annoncer quelque chose",
  "Le sol grince à un endroit précis, révélant peut-être une cache dessous",
  "Deux clients se defient du regard depuis le début de la soirée sans qu'on sache pourquoi",
  "Une collection improbable d'objets « portés chance » orne le comptoir"
];
COF.LIEUX_RUMEURS = [
  "On raconte qu'une caravane a disparu sur la route du nord, corps et biens.",
  "Un noble local recruterait discrètement des gens de main pour un travail délicat.",
  "Des lumières étranges ont été vues du côté des ruines, la nuit dernière.",
  "Le puits du quartier bas donnerait une eau au goût métallique depuis peu.",
  "Une récompense est promise pour la capture d'un voleur qui frappe la nuit.",
  "Un marchand itinérant vendrait des objets « trouvés » à prix cassé.",
  "Les gardes patrouillent deux fois plus depuis la semaine dernière, sans explication officielle.",
  "Une créature aurait été aperçue rôder aux abords des cultures.",
  "Un culte discret tiendrait ses réunions dans une cave du quartier pauvre.",
  "Le seigneur local ferait main basse sur des terres sans en payer le juste prix.",
  "Une épidémie de bétail malade inquiète les éleveurs de la région.",
  "Un ancien aventurier, revenu riche et taciturne, ne sort presque plus de chez lui.",
  "Des pièces d'un métal inconnu circuleraient discrètement au marché noir.",
  "Une famille entière aurait quitté sa maison en pleine nuit, sans un mot à personne.",
  "Un puits asséché depuis des années se serait remis à couler tout seul.",
  "Des empreintes bien trop grandes pour être humaines ont été relevées près du moulin.",
  "Un prêteur sur gages refuserait catégoriquement d'acheter certains objets, sans dire pourquoi.",
  "Deux guildes marchandes seraient sur le point d'en venir aux mains pour un contrat.",
  "Un enfant du village prétend avoir parlé à un esprit dans la forêt voisine.",
  "Une lettre scellée, adressée à quelqu'un de mort depuis des années, serait arrivée hier.",
  "Le nouveau prêtre du temple poserait beaucoup trop de questions sur les registres anciens.",
  "On murmure qu'un trésor serait caché sous les fondations d'un bâtiment du village."
];
COF.LIEUX_PRIX = [
  'Bon marché', 'Abordable', 'Correct pour la qualité', 'Un peu cher',
  'Hors de prix, mais on y vient quand même', 'Gratuit pour qui rend service au patron'
];

/* ---------- Boutiques ---------- */
COF.LIEUX_BOUTIQUE_TYPES = [
  { id: 'armurerie', nom: 'Armurerie', stocks: ['ARMES_CONTACT', 'ARMES_DISTANCE', 'ARMURES', 'BOUCLIERS'] },
  { id: 'forge', nom: 'Forge', stocks: ['ARMES_CONTACT', 'MATERIEL'] },
  { id: 'general', nom: 'Marchand général', stocks: ['MATERIEL'] },
  { id: 'alchimiste', nom: 'Alchimiste', stocks: ['MATERIEL', 'BUTIN_COMPOSANTS'] },
  { id: 'bijoutier', nom: 'Bijoutier', stocks: ['BUTIN_TRESORS'] },
  { id: 'sellier', nom: 'Sellier & harnacheur', stocks: ['MONTURES', 'MATERIEL'] },
  { id: 'libraire', nom: 'Libraire & scribe', stocks: ['MATERIEL'] },
  { id: 'antiquaire', nom: 'Antiquaire', stocks: ['BUTIN_TRESORS'] },
  { id: 'apothicaire', nom: 'Apothicaire', stocks: ['MATERIEL', 'BUTIN_COMPOSANTS'] },
  { id: 'brocanteur', nom: 'Brocanteur', stocks: ['MATERIEL', 'BUTIN_TRESORS'] },
  { id: 'tanneur', nom: 'Tanneur & maroquinier', stocks: ['ARMURES', 'MATERIEL'] }
];
COF.LIEUX_BOUTIQUE_TRAITS = [
  "honnête jusqu'à l'excès, incapable de mentir sur un prix",
  "retors, prêt à arrondir les prix si le client semble pressé",
  "bavard, connaît tous les ragots de la ville",
  "méfiant envers les étrangers, mais loyal envers ses habitués",
  "distrait, oublie régulièrement de rendre la monnaie",
  "fier de son métier, aime expliquer chaque objet en détail",
  "impatient, préfère qu'on sache déjà ce qu'on veut",
  "endetté, cherche discrètement à vendre plus cher que d'habitude",
  "ancien aventurier reconverti, reconnaît le matériel de qualité au premier coup d'œil",
  "superstitieux, refuse de vendre certains objets un jour précis",
  "généreux avec les enfants et les nécessiteux",
  "en affaires avec des gens peu recommandables, si on sait creuser",
  "obsédé par la propreté de sa boutique, au point d'en être agaçant",
  "collectionneur dans l'âme, garde toujours les plus belles pièces pour lui",
  "récemment installé, encore méconnu mais plein d'ambition",
  "sur le point de prendre sa retraite, cherche discrètement un successeur",
  "un brin escroc, quitte à se faire prendre de temps en temps",
  "d'une gentillesse déconcertante, presque suspecte"
];
COF.LIEUX_BOUTIQUE_ANECDOTES = [
  "Un objet en vitrine n'est pas à vendre, quel que soit le prix proposé.",
  "Le commerçant cherche quelqu'un pour récupérer une commande en retard, quelque part de dangereux.",
  "Une rumeur locale prétend que la boutique aurait un arrière-fond secret.",
  "Le stock a été renouvelé récemment grâce à un fournisseur inhabituel.",
  "Un client mécontent a laissé une menace à peine voilée avant de partir.",
  "Le commerçant propose volontiers du troc contre des objets de valeur ou des services.",
  "Une dette envers un autre marchand pèse sur les affaires en ce moment.",
  "Le commerçant garde toujours un œil sur la porte, comme s'il attendait quelqu'un.",
  "Rien de particulier : les affaires tournent normalement, ce qui est presque suspect.",
  "Une pièce de la boutique est fermée à clé en permanence, sans explication.",
  "Le commerçant offre une remise notable aux aventuriers, par superstition ou calcul.",
  "Un concurrent installé récemment lui fait perdre des clients, et ça l'agace visiblement.",
  "Le commerçant recherche un ingrédient ou une pièce précise, contre bonne récompense."
];

/* ---------- Villages & villes ---------- */
COF.LIEUX_VILLE_DEBUT = [
  'Val', 'Mont', 'Fontaine', 'Bois', 'Pierre', 'Roche', 'Champ', 'Grand', 'Vieux',
  'Belle', 'Haute', 'Basse', 'Sainte', 'Nord', 'Sud', 'Étang', 'Rivage', 'Combe',
  'Longue', 'Noire', 'Blanche', 'Verte', 'Trois', 'Beau', 'Clair', 'Grise'
];
COF.LIEUX_VILLE_FIN = [
  'brune', 'fort', 'val', 'court', 'mont', 'rive', 'bois', 'champs', 'source',
  'roche', 'gué', 'pont', 'fief', 'lande', 'combe', 'ferrière', 'moulin', 'garde',
  'val-sur-eau', 'écluse', 'chapelle', 'castel', 'baie', 'clairière', 'ronce', 'gravière'
];
COF.LIEUX_TAILLES = [
  { id: 'hameau', nom: 'Hameau', pop: "quelques dizaines d'habitants", note: "Pas de garnison, pas de marché régulier." },
  { id: 'village', nom: 'Village', pop: "200 à 500 habitants", note: "Une auberge, un marché hebdomadaire, une milice improvisée." },
  { id: 'bourg', nom: 'Bourg fortifié', pop: "500 à 2000 habitants", note: "Remparts de bois ou de pierre, petite garnison, marché permanent." },
  { id: 'ville', nom: 'Ville', pop: "2000 à 10000 habitants", note: "Guildes, temple, garnison organisée, quartiers distincts." },
  { id: 'cite', nom: 'Cité', pop: "plus de 10000 habitants", note: "Plusieurs quartiers fortifiés, noblesse locale, vie politique active." }
];
COF.LIEUX_SPECIALITES_ECO = [
  "l'agriculture et l'élevage des environs", "la pêche et le commerce du poisson séché",
  "l'exploitation d'une mine voisine", "le tissage et le commerce du drap",
  "un port marchand actif", "le passage d'une route commerciale majeure",
  "la production de vin ou de cidre réputé", "l'artisanat du bois et de la charpente",
  "la forge et le travail des métaux", "un pèlerinage religieux qui attire les voyageurs",
  "l'élevage de chevaux", "la contrebande, à peine dissimulée", "la production de laine",
  "une carrière de pierre exploitée depuis des générations", "la chasse et le commerce de fourrures",
  "un pont à péage sur une rivière stratégique", "un marché aux esclaves toléré dans l'ombre",
  "la culture d'une plante rare recherchée par les alchimistes", "l'apiculture et le commerce du miel",
  "une foire annuelle qui fait vivre la ville le reste de l'année"
];
COF.LIEUX_GOUVERNANCE = [
  "un maire élu par les notables locaux", "un conseil de marchands influents",
  "un seigneur local qui rend justice lui-même", "un ancien du village respecté de tous",
  "une garnison militaire qui fait office d'autorité", "un temple qui administre la vie civile",
  "une guilde marchande qui contrôle les affaires locales", "un vieux conseil d'anciennes familles rivales",
  "une dame ou un seigneur absent, représenté par un intendant zélé",
  "un tribunal populaire qui se réunit une fois par saison",
  "une confrérie d'artisans qui tranche les différends entre habitants",
  "personne vraiment : chacun se débrouille et les conflits se règlent au cas par cas"
];
COF.LIEUX_PROBLEMES = [
  "Des impôts en forte hausse mécontentent la population.",
  "Une série de vols inexpliqués inquiète les habitants.",
  "Une maladie touche le bétail, menaçant les récoltes d'hiver.",
  "Deux familles influentes se disputent l'héritage d'un domaine.",
  "Des créatures rôdent près des routes, freinant le commerce.",
  "Un puits ou une source s'est tari sans raison apparente.",
  "Une secte religieuse gagne en influence, à l'inquiétude du clergé officiel.",
  "Des réfugiés d'une région voisine affluent, sans que la ville puisse tous les accueillir.",
  "Un différend commercial menace de couper une route d'approvisionnement vitale.",
  "Une rumeur de malédiction pèse sur un bâtiment ou une famille en particulier.",
  "La garnison locale est à court d'effectifs depuis un récent conflit.",
  "Un notable a disparu sans laisser de trace, il y a quelques jours.",
  "Une guerre des prix ruine les petits commerçants au profit d'un seul acteur.",
  "Un tribut réclamé par une puissance voisine met les finances locales à genoux.",
  "Des enfants racontent tous le même rêve étrange depuis une semaine.",
  "Une vieille rivalité entre deux quartiers dégénère en échauffourées régulières.",
  "Le gibier a déserté les environs, inquiétant chasseurs et éleveurs.",
  "Un scandale récent implique un membre en vue de la communauté."
];
COF.LIEUX_AMBIANCES = [
  "Prospère et animée, les affaires vont bon train",
  "Méfiante envers les étrangers depuis un incident récent",
  "Accueillante et curieuse des nouvelles du monde extérieur",
  "Tendue, une querelle locale envenime les relations entre habitants",
  "Paisible en apparence, mais tout le monde semble cacher quelque chose",
  "Modeste mais fière de son autonomie",
  "En plein essor grâce à un commerce récent",
  "En déclin lent, de plus en plus de maisons abandonnées",
  "Festive : une fête ou un marché se prépare",
  "Sur ses gardes, une menace plane sans que personne ne la nomme clairement",
  "Superstitieuse, chaque événement inhabituel y trouve une explication surnaturelle",
  "Studieuse et austère, dominée par une institution religieuse ou savante",
  "Divisée entre deux factions locales qui s'observent en chiens de faïence",
  "Chaleureuse envers les voyageurs, dont la venue est toujours un petit événement"
];
