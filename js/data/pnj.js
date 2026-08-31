/* ============================================================
   COF2 Compagnon — Données : générateur de PNJ
   Noms procéduraux par peuple, apparence, personnalité (idéal /
   travers officiels du livre de base), métiers, motivations,
   secrets, accroches scénaristiques et panthéon d'Osgild.
   ============================================================ */
window.COF = window.COF || {};

/* ---------------------------------------------------------------
   Poids de tirage des peuples (un monde d'Osgild à dominante humaine)
   --------------------------------------------------------------- */
COF.PNJ_POIDS_PEUPLE = {
  humain: 40, nain: 12, halfelin: 10, gnome: 8,
  elfehaut: 6, elfesylvain: 8, demiorc: 8, demielfe: 8
};

/* ---------------------------------------------------------------
   Noms procéduraux — chaque peuple fournit des débuts et des fins
   de prénom par genre, combinés aléatoirement (avant + fin), plus
   une liste de noms de famille / surnoms / épithètes.
   Les tournures (apostrophes elfiques, consonnes dures orques...)
   sont intégrées directement dans les syllabes pour rester simple.
   --------------------------------------------------------------- */
COF.PNJ_NOMS = {

  humain: {
    m: {
      debut: ['Al', 'Bar', 'Cor', 'Dun', 'Ed', 'Fen', 'Gar', 'Hal', 'Ian', 'Jor', 'Kel', 'Lan', 'Mar', 'Ner', 'Os', 'Pier', 'Rob', 'Sim', 'Tho', 'Wil'],
      fin: ['bert', 'ric', 'win', 'dan', 'ford', 'mund', 'vald', 'ton', 'wyn', 'ard', 'fred', 'mond', 'ley', 'wick', 'as', 'ian']
    },
    f: {
      debut: ['Ali', 'Bea', 'Cla', 'Dor', 'Ele', 'Fio', 'Gwe', 'Hele', 'Isa', 'Jul', 'Kat', 'Lia', 'Mar', 'Nad', 'Ova', 'Ros', 'Sela', 'Tris', 'Ver', 'Wynn'],
      fin: ['ana', 'ette', 'ine', 'elle', 'ora', 'wen', 'ith', 'yne', 'issa', 'enne', 'ande', 'lise', 'a', 'ie']
    },
    famille: ['Chantelune', 'Forgefer', 'Boisclair', 'Grandchamp', 'Roquefort', 'du Val-Perdu', 'de Ferrance',
      'd\'Arly', 'de Clairval', 'de Wyks', 'Fortin', 'Lenoir', 'Vasseur', 'Sombreval', 'des Trois-Chênes',
      'Fleurdepierre', 'Aubépine', 'Corbin', 'de Périk', 'du Pont-aux-Ânes', 'Vieuxbois', 'Charteux']
  },

  nain: {
    m: {
      debut: ['Bor', 'Dur', 'Grim', 'Thor', 'Bal', 'Kaz', 'Norn', 'Ung', 'Drak', 'Hrol', 'Gim', 'Fal', 'Brun', 'Dvar'],
      fin: ['in', 'ok', 'ur', 'ad', 'grim', 'din', 'ferd', 'nir', 'gar', 'mund', 'orn', 'ax']
    },
    f: {
      debut: ['Bris', 'Dis', 'Grid', 'Hel', 'Kil', 'Nor', 'Ral', 'Thra', 'Ulf', 'Vali', 'Dagn', 'Fren'],
      fin: ['a', 'ina', 'gard', 'hild', 'run', 'dis', 'veig', 'na', 'ora', 'ild']
    },
    famille: ['Barbe-de-fer', 'Poing-de-pierre', 'Marteaunoir', 'Forgehache', 'Œil-d\'acier', 'de Kaer Glimmerstern',
      'Videcaverne', 'Brise-Roc', 'Barbegrise', 'Trancheveine', 'du Clan des Monts', 'Cassemine', 'Boucliersombre']
  },

  elfehaut: {
    m: {
      debut: ['Ael', 'Cael', 'Eryn', 'Fael', 'Ilyr', 'Laen', 'Myr', 'Syl', 'Thal', 'Ysar', 'Or', 'Quen', 'Vaen'],
      fin: ['iel', 'wen', 'dor', 'ith', 'ian', 'ael', 'yn', 'wyn', '\'thil', '\'ion', 'aris', 'endil']
    },
    f: {
      debut: ['Aer', 'Cael', 'Eryn', 'Fael', 'Ily', 'Lae', 'Myr', 'Syl', 'Thae', 'Ysa', 'Or', 'Quen'],
      fin: ['iel', 'wen', 'ith', 'ian', 'ael', 'ynne', '\'thiel', 'aris', 'enna', 'lira', 'ess']
    },
    famille: ['de Hautesylve', 'de Syndoril', 'du lac Thuléa', 'Lame-d\'argent', 'Étoile-du-soir',
      'de Bois dormant', 'l\'Aîné', 'du Sang-Ancien', 'Feuille-d\'or', 'Voix-du-vent']
  },

  elfesylvain: {
    m: {
      debut: ['Bri', 'Fen', 'Gwyn', 'Ith', 'Kael', 'Lir', 'Nael', 'Rian', 'Sael', 'Tir', 'Vael', 'Wren'],
      fin: ['on', 'as', 'wyn', 'dir', 'eth', 'ion', 'oth', 'an', 'yr', '\'ash', '\'or']
    },
    f: {
      debut: ['Bri', 'Fen', 'Gwyn', 'Ith', 'Kae', 'Lir', 'Nae', 'Ria', 'Sae', 'Tir', 'Vae', 'Wren'],
      fin: ['a', 'wen', 'eth', 'iss', 'ora', 'ynn', 'is', 'ael', '\'ith', 'enn']
    },
    famille: ['des Frondaisons', 'Pas-Léger', 'de la Grande Forêt', 'Œil-de-Lynx', 'Flèche-Vive',
      'du lac Thuléa', 'Ombre-des-Bois', 'Ronce-Vive', 'Chant-des-Feuilles']
  },

  halfelin: {
    m: {
      debut: ['Bil', 'Fin', 'Pip', 'Tob', 'Wil', 'Mer', 'Ban', 'Cott', 'Odo', 'Ted', 'Sam', 'Ru'],
      fin: ['bo', 'kins', 'ock', 'ot', 'on', 'ard', 'ble', 'in', 'y', 'us']
    },
    f: {
      debut: ['Ros', 'Dais', 'Mer', 'Pop', 'Bel', 'Lav', 'Prim', 'Vio', 'Pea', 'Cher'],
      fin: ['ie', 'anda', 'inda', 'ette', 'ola', 'y', 'osa', 'is']
    },
    famille: ['Piedléger', 'Bontemps', 'Rondchemin', 'Sacaubaudet', 'Terrier', 'Bellepioche', 'Boitendu',
      'Sourire-Facile', 'Plantetard', 'Deuxrepas', 'du Val de Clairval']
  },

  gnome: {
    m: {
      debut: ['Fizz', 'Glim', 'Nim', 'Pog', 'Quix', 'Snib', 'Tink', 'Whiz', 'Zeb', 'Cog', 'Brix'],
      fin: ['le', 'bit', 'nix', 'tle', 'wick', 'ble', 'ot', 'ix', 'us', 'in']
    },
    f: {
      debut: ['Fizzi', 'Glimma', 'Nima', 'Pixi', 'Quilla', 'Snibby', 'Tinka', 'Whizza', 'Zeba', 'Coga'],
      fin: ['belle', 'nette', 'ina', 'lys', 'wisp', 'ette', 'ie', 'a']
    },
    famille: ['Rouage', 'Étincelle', 'Fioleblanche', 'Cliquetis', 'Tourne-Vis', 'Poudre-d\'Or',
      'de Hurlevent', 'Trois-Ressorts', 'Mèche-Courte', 'Grand-Bidouille']
  },

  demiorc: {
    m: {
      debut: ['Grosh', 'Uzg', 'Mog', 'Thrak', 'Krug', 'Dosh', 'Vark', 'Gor', 'Nazg', 'Brok'],
      fin: ['ak', 'ub', 'og', 'ash', 'ûk', 'ka', 'ruk', 'gar', 'nok']
    },
    f: {
      debut: ['Grosha', 'Uzga', 'Mogra', 'Thraka', 'Kruga', 'Dosha', 'Varka', 'Gora', 'Nazga'],
      fin: ['ka', 'ash', 'ura', 'og', 'na', 'ruka', 'ga']
    },
    famille: ['des Monts Vierges', 'Poing-Brisé', 'de Luir-An-Doral', 'Dent-Cassée', 'du Piémont',
      'Sang-Mêlé', 'l\'Indompté', 'des Marches de Dorn', 'Cicatrice']
  },

  /* le demi-elfe pioche indifféremment dans les tables humaines ou elfiques (voir pnj.js) */
  demielfe: {
    famille: ['des Deux Sangs', 'l\'Entre-Deux', 'du Val-Perdu', 'de Hautesylve', 'Cœur-Partagé']
  }
};

/* ---------------------------------------------------------------
   Tranches d'âge par peuple — estimations de convenance pour
   colorer un PNJ, non une règle officielle de longévité.
   --------------------------------------------------------------- */
COF.PNJ_AGES = {
  humain:      [['jeune adulte (18-25 ans)', 1], ['adulte (26-40 ans)', 2], ['âge mûr (41-55 ans)', 1], ['âgé (56-70 ans)', 1], ['vénérable (plus de 70 ans)', 1]],
  nain:        [['jeune adulte (30-50 ans)', 1], ['adulte (50-120 ans)', 2], ['âge mûr (120-200 ans)', 1], ['âgé (200-300 ans)', 1], ['vénérable (plus de 300 ans)', 1]],
  elfehaut:    [['jeune adulte (60-100 ans)', 1], ['adulte (100-300 ans)', 2], ['âge mûr (300-500 ans)', 1], ['âgé (500-800 ans)', 1], ['vénérable (plus de 800 ans)', 1]],
  elfesylvain: [['jeune adulte (50-90 ans)', 1], ['adulte (90-250 ans)', 2], ['âge mûr (250-450 ans)', 1], ['âgé (450-700 ans)', 1], ['vénérable (plus de 700 ans)', 1]],
  halfelin:    [['jeune adulte (15-25 ans)', 1], ['adulte (25-50 ans)', 2], ['âge mûr (50-80 ans)', 1], ['âgé (80-120 ans)', 1], ['vénérable (plus de 120 ans)', 1]],
  gnome:       [['jeune adulte (20-40 ans)', 1], ['adulte (40-100 ans)', 2], ['âge mûr (100-200 ans)', 1], ['âgé (200-300 ans)', 1], ['vénérable (plus de 300 ans)', 1]],
  demiorc:     [['jeune adulte (14-20 ans)', 1], ['adulte (20-35 ans)', 2], ['âge mûr (35-50 ans)', 1], ['âgé (50-65 ans)', 1], ['vénérable (plus de 65 ans)', 1]],
  demielfe:    [['jeune adulte (20-30 ans)', 1], ['adulte (30-80 ans)', 2], ['âge mûr (80-150 ans)', 1], ['âgé (150-250 ans)', 1], ['vénérable (plus de 250 ans)', 1]]
};

/* ---------------------------------------------------------------
   Apparence
   --------------------------------------------------------------- */
COF.PNJ_APPARENCE = {
  taille: ['chétif', 'petit', 'de taille modeste', 'de taille moyenne', 'grand', 'très grand', 'imposant', 'massif'],
  corpulence: ['squelettique', 'maigre', 'mince', 'athlétique', 'trapu', 'enveloppé', 'corpulent', 'massif et musculeux'],
  cheveuxStyle: ['chauve', 'les cheveux ras', 'les cheveux courts', 'les cheveux mi-longs', 'de longs cheveux',
    'le crâne rasé et tatoué', 'des tresses complexes', 'les cheveux en bataille', 'une longue tresse unique',
    'des cheveux soigneusement coiffés', 'des dreadlocks', 'une calvitie naissante'],
  cheveuxCouleur: ['noirs', 'bruns', 'châtains', 'roux', 'blonds', 'gris', 'blancs', 'argentés', 'striés de blanc'],
  yeux: ['bleus', 'verts', 'bruns', 'noisette', 'gris', 'ambrés', 'noirs', 'vairons (couleurs différentes)'],
  teint: ['pâle', 'clair', 'hâlé', 'bronzé', 'mat', 'sombre', 'olivâtre', 'cendré', 'marqué par le grand air'],
  signe: ['une cicatrice au visage', 'un tatouage tribal', 'un œil manquant caché sous un bandeau', 'une dent en or',
    'des piercings discrets', 'une légère boiterie', 'une voix rauque et grave', 'un accent prononcé',
    'des mains calleuses de travailleur', 'une tache de naissance visible', 'des brûlures anciennes',
    'un doigt manquant', 'une prothèse de bois ou de métal', 'des bijoux clinquants', 'des vêtements rapiécés mais soignés',
    'une odeur particulière (herbes, alcool, forge...)', 'un rire nerveux et communicatif',
    'une manière de parler très posée', 'des vêtements élégants mais usés', 'un sourire inquiétant',
    'un nez cassé', 'des sourcils broussailleux', 'une posture toujours droite, presque militaire']
};

/* ---------------------------------------------------------------
   Métiers — catégorisés, certains liés à une fiche du bestiaire
   humanoïde pour un profil de combat rapide.
   --------------------------------------------------------------- */
COF.PNJ_METIERS = [
  { nom: 'Forgeron', cat: 'Artisan' }, { nom: 'Tavernier', cat: 'Commerce' },
  { nom: 'Marchand itinérant', cat: 'Commerce' }, { nom: 'Aubergiste', cat: 'Commerce' },
  { nom: 'Garde de la ville', cat: 'Martial', bete: 'garde_ville' },
  { nom: 'Milicien', cat: 'Martial', bete: 'milicien' },
  { nom: 'Bandit des routes', cat: 'Hors-la-loi', bete: 'bandit' },
  { nom: 'Bandit vétéran', cat: 'Hors-la-loi', bete: 'bandit_veteran' },
  { nom: 'Chef de bande', cat: 'Hors-la-loi', bete: 'chef_bandit' },
  { nom: 'Voleur des bas quartiers', cat: 'Hors-la-loi' },
  { nom: 'Prêtre', cat: 'Religieux' }, { nom: 'Moine mendiant', cat: 'Religieux' },
  { nom: 'Sorcier de village', cat: 'Magie', bete: 'sorcier_pnj' },
  { nom: 'Scribe', cat: 'Érudit' }, { nom: 'Bibliothécaire', cat: 'Érudit' },
  { nom: 'Précepteur', cat: 'Érudit' }, { nom: 'Cartographe', cat: 'Érudit' }, { nom: 'Étudiant', cat: 'Érudit' },
  { nom: 'Chasseur', cat: 'Nature' }, { nom: 'Bûcheron', cat: 'Nature' }, { nom: 'Pêcheur', cat: 'Nature' },
  { nom: 'Fermier', cat: 'Nature' }, { nom: 'Berger', cat: 'Nature' }, { nom: 'Herboriste', cat: 'Nature' },
  { nom: 'Dresseur d\'animaux', cat: 'Nature' }, { nom: 'Éleveur', cat: 'Nature' },
  { nom: 'Marin', cat: 'Voyage' }, { nom: 'Capitaine de navire', cat: 'Voyage' }, { nom: 'Cocher', cat: 'Voyage' },
  { nom: 'Explorateur', cat: 'Voyage' }, { nom: 'Contrebandier des mers', cat: 'Voyage' },
  { nom: 'Mercenaire', cat: 'Martial' }, { nom: 'Chevalier errant', cat: 'Martial' }, { nom: 'Écuyer', cat: 'Martial' },
  { nom: 'Vétéran de guerre', cat: 'Martial', bete: 'veteran_garde' },
  { nom: 'Capitaine de la garde', cat: 'Martial', bete: 'capitaine' },
  { nom: 'Garde du corps', cat: 'Martial', bete: 'garde_corps' },
  { nom: 'Chasseur de primes', cat: 'Martial' }, { nom: 'Garde-frontière', cat: 'Martial' }, { nom: 'Geôlier', cat: 'Martial' },
  { nom: 'Espion', cat: 'Hors-la-loi' }, { nom: 'Contrebandier', cat: 'Hors-la-loi' },
  { nom: 'Assassin', cat: 'Hors-la-loi', bete: 'assassin' },
  { nom: 'Noble déchu', cat: 'Noblesse' }, { nom: 'Courtisan', cat: 'Noblesse' }, { nom: 'Diplomate', cat: 'Noblesse' },
  { nom: 'Collecteur d\'impôts', cat: 'Noblesse' }, { nom: 'Maire du village', cat: 'Noblesse' },
  { nom: 'Ancien du conseil', cat: 'Noblesse' },
  { nom: 'Barde itinérant', cat: 'Artiste' }, { nom: 'Musicien de rue', cat: 'Artiste' }, { nom: 'Comédien', cat: 'Artiste' },
  { nom: 'Alchimiste', cat: 'Magie' }, { nom: 'Forgesort', cat: 'Magie' }, { nom: 'Apprenti mage', cat: 'Magie' },
  { nom: 'Devin ou voyante', cat: 'Magie' },
  { nom: 'Guérisseur', cat: 'Religieux' }, { nom: 'Fossoyeur', cat: 'Divers' }, { nom: 'Bourreau', cat: 'Divers' },
  { nom: 'Charlatan', cat: 'Divers' }, { nom: 'Joueur professionnel', cat: 'Divers' },
  { nom: 'Boulanger', cat: 'Artisan' }, { nom: 'Boucher', cat: 'Artisan' }, { nom: 'Tailleur', cat: 'Artisan' },
  { nom: 'Cordonnier', cat: 'Artisan' }, { nom: 'Bijoutier', cat: 'Artisan' }, { nom: 'Armurier', cat: 'Artisan' },
  { nom: 'Menuisier', cat: 'Artisan' }, { nom: 'Mineur', cat: 'Artisan' }, { nom: 'Tanneur', cat: 'Artisan' },
  { nom: 'Sans-abri', cat: 'Divers' }, { nom: 'Mendiant', cat: 'Divers' }, { nom: 'Orphelin des rues', cat: 'Divers' }
];

/* ---------------------------------------------------------------
   Idéal héroïque et travers — tables officielles du livre de base
   (Création du personnage, point 15 « Touche finale »).
   --------------------------------------------------------------- */
COF.PNJ_IDEAUX = ['Abnégation', 'Clémence', 'Compassion', 'Courage', 'Égalité', 'Éducation', 'Fraternité',
  'Frugalité', 'Générosité', 'Honnêteté', 'Honneur', 'Humilité', 'Justice', 'Liberté', 'Loyauté',
  'Pacifisme', 'Protection', 'Sens du sacrifice', 'Solidarité', 'Vérité'];

COF.PNJ_TRAVERS = ['Alcoolique', 'Couard', 'Crédule', 'Cupide', 'Colérique', 'Distrait', 'Dragueur', 'Fanfaron',
  'Gourmand', 'Grossier', 'Impatient', 'Indécis', 'Menteur', 'Orgueilleux', 'Paranoïaque', 'Paresseux',
  'Phobique (au choix)', 'Timide', 'Violent', 'Voleur'];

/* ---------------------------------------------------------------
   Manies / tics de comportement
   --------------------------------------------------------------- */
COF.PNJ_MANIES = [
  'Se gratte le menton en réfléchissant', 'Parle parfois en rimes improvisées',
  'Évite systématiquement le regard des autres', 'Collectionne des objets insolites',
  'A une peur irrationnelle d\'un animal précis', 'Répète la dernière phrase de son interlocuteur',
  'Mâchouille en permanence une brindille ou une pipe', 'Compte des pièces quand il est nerveux',
  'A un juron fétiche qu\'il répète sans cesse', 'Parle de lui à la troisième personne',
  'Ne peut s\'empêcher de marchander pour tout', 'Siffle un air entêtant en travaillant',
  'Fixe intensément l\'équipement des autres', 'A un petit rire nerveux avant de mentir',
  'Touche du bois dès qu\'on évoque la malchance', 'Porte un objet fétiche qu\'il caresse sans arrêt',
  'Fait craquer ses articulations', 'A une passion dévorante pour un sujet dont il parle sans fin',
  'Vérifie sans cesse les issues d\'une pièce', 'Offre systématiquement à boire à ses interlocuteurs',
  'Termine chaque phrase par une expression locale', 'Griffonne sans cesse sur tout ce qui lui tombe sous la main'
];

/* ---------------------------------------------------------------
   Motivations, secrets, accroches scénaristiques
   --------------------------------------------------------------- */
COF.PNJ_MOTIVATIONS = [
  'Devenir riche à tout prix', 'Venger un proche assassiné', 'Retrouver un objet familial perdu',
  'Percer un mystère qui le hante', 'Gravir les échelons de la société', 'Racheter une lourde faute passée',
  'Protéger un secret de famille', 'Servir fidèlement son seigneur ou sa guilde',
  'Fuir un passé qu\'il refuse d\'affronter', 'Répandre les enseignements de sa foi',
  'Reconquérir un amour perdu', 'Prouver sa valeur aux yeux des siens',
  'Amasser du savoir et des secrets occultes', 'Survivre, simplement, un jour à la fois',
  'Obtenir la reconnaissance qu\'il mérite', 'Échapper à une dette ou un chasseur de primes',
  'Explorer le monde et voir ce qu\'il n\'a jamais vu', 'Reconstruire ce qu\'une guerre a détruit',
  'Devenir une légende dont on chantera les exploits', 'Protéger sa communauté d\'une menace grandissante'
];

COF.PNJ_SECRETS = [
  'Travaille en réalité pour une guilde criminelle', 'Est recherché(e) sous un autre nom ailleurs',
  'Pratique une magie interdite en secret', 'A autrefois trahi un compagnon pour sauver sa peau',
  'Cache une malédiction dont il/elle tait l\'origine', 'Est l\'héritier(ère) déchu(e) d\'une famille noble',
  'Vend des informations au plus offrant', 'Est en réalité un espion d\'une puissance étrangère',
  'Porte un objet magique dont il/elle ignore la vraie nature', 'Est marié(e) en secret contre l\'avis des siens',
  'A tué quelqu\'un et personne ne l\'a jamais découvert', 'Est occasionnellement possédé(e) par un esprit ancien',
  'Complote pour renverser une figure d\'autorité locale', 'Collectionne des reliques volées dans des tombeaux',
  'N\'est pas ce qu\'il/elle prétend être : un imposteur complet', 'Protège un enfant qui n\'est pas le sien',
  'Doit une dette de sang à une créature surnaturelle', 'Sait où se trouve un trésor oublié depuis des générations'
];

COF.PNJ_ACCROCHES = [
  'A besoin d\'une escorte pour un voyage dangereux', 'Cherche à engager des aventuriers pour une mission discrète',
  'Détient une information cruciale mais la monnaye cher', 'A été témoin d\'un crime qu\'il a peur de révéler',
  'Propose un marché qui semble trop beau pour être honnête', 'Demande de l\'aide pour retrouver un proche disparu',
  'Pourrait devenir un allié précieux... ou un dangereux ennemi', 'Veut se venger et cherche des bras armés',
  'Garde jalousement l\'accès à un lieu que les PJ doivent atteindre', 'Offre un objet magique contre un service risqué',
  'Est accusé à tort et cherche à prouver son innocence', 'Sait où se cache le véritable coupable d\'une affaire locale',
  'Propose de racheter à prix d\'or quelque chose que possèdent les PJ', 'Pourrait trahir les PJ si l\'occasion s\'avérait lucrative'
];

COF.PNJ_ATTITUDES = ['Hostile et méfiant', 'Froid et distant', 'Neutre, indifférent', 'Curieux mais prudent',
  'Amical et bavard', 'Chaleureux et généreux', 'Obséquieux, presque servile', 'Nerveux, semble cacher quelque chose',
  'Arrogant et condescendant', 'Effrayé, cherche à écourter tout contact'];

/* ---------------------------------------------------------------
   Panthéon d'Osgild — Chapitre « Peuples », encadré des religions.
   --------------------------------------------------------------- */
COF.PNJ_DIVINITES = [
  { nom: 'Arcanna', domaine: 'déesse de la magie blanche' },
  { nom: 'Arshran', domaine: 'dieu du feu et des forgerons' },
  { nom: 'Arwendée', domaine: 'déesse de la chasse et des archers' },
  { nom: 'Aurilla', domaine: 'déesse de la chance et des aventuriers' },
  { nom: 'Axënder', domaine: 'dieu du devoir et de l\'honneur' },
  { nom: 'Basile', domaine: 'dieu de la gourmandise et de la nourriture' },
  { nom: 'Céres', domaine: 'dieu de l\'agriculture et du travail' },
  { nom: 'Dénora', domaine: 'déesse de la compassion et de la guérison' },
  { nom: 'Ellona', domaine: 'déesse de la perception et de la vérité' },
  { nom: 'Forthur', domaine: 'dieu du courage et des exploits' },
  { nom: 'Gaëlm', domaine: 'dieu des arts et des artistes' },
  { nom: 'Gorom', domaine: 'dieu de la pierre et des architectes' },
  { nom: 'Guardal', domaine: 'dieu de la loyauté et des gardiens' },
  { nom: 'Hellion', domaine: 'dieu des voleurs et du pillage' },
  { nom: 'Irrion', domaine: 'dieu de l\'ordre et de la noblesse' },
  { nom: 'Jeweln', domaine: 'dieu des souterrains et des mineurs' },
  { nom: 'Linnarré', domaine: 'déesse de la mer et des marins' },
  { nom: 'Mélenna', domaine: 'déesse des forêts et des animaux' },
  { nom: 'Méphistère', domaine: 'dieu de l\'ombre et des secrets' },
  { nom: 'Mirandia', domaine: 'déesse du sommeil et des rêves' },
  { nom: 'Möndovaël', domaine: 'dieu des nomades et du voyage' },
  { nom: 'Morn', domaine: 'dieu de la mort et du passage dans l\'au-delà' },
  { nom: 'Orbis', domaine: 'dieu du commerce et des marchands' },
  { nom: 'Oumaros', domaine: 'dieu de l\'air et des cieux' },
  { nom: 'Perinde', domaine: 'déesse de la fertilité et des mères' },
  { nom: 'Sélenne', domaine: 'déesse de la paix et de la liberté' },
  { nom: 'Solar', domaine: 'dieu de la lumière et du savoir' },
  { nom: 'Suëlle', domaine: 'déesse de la beauté et de l\'amour' },
  { nom: 'Trenner', domaine: 'dieu du temps et des ancêtres' },
  { nom: 'Tulsadüm', domaine: 'dieu de la jungle et des reptiles' },
  { nom: 'Tyriolith', domaine: 'dieu du combat contre le chaos et du feu purificateur' },
  { nom: 'Vorona', domaine: 'déesse de la justice et de la loi' }
];
