/* ============================================================
   COF2 Compagnon — Données : objets & trésors nommés
   Tables combinées par js/core/tresors-nommes.js pour composer
   un objet magique unique, avec un vrai nom, une légende et
   parfois une malédiction — au-delà du système +N générique
   déjà utilisé dans le générateur de Butin.
   ============================================================ */
window.COF = window.COF || {};

/* dmg : formule de dégâts (armes) · def : bonus de DEF (armures/boucliers) ·
   armeType : contact ou distance, pour savoir quelle attaque utiliser. */
COF.TRESOR_TYPES = [
  { id: 'epee', nom: 'Épée', arme: true, dmg: '1d8', armeType: 'contact' },
  { id: 'hache', nom: 'Hache', arme: true, dmg: '1d8', armeType: 'contact' },
  { id: 'arc', nom: 'Arc', arme: true, dmg: '1d8', armeType: 'distance' },
  { id: 'dague', nom: 'Dague', arme: true, dmg: '1d4', armeType: 'contact' },
  { id: 'masse', nom: 'Masse', arme: true, dmg: '1d6', armeType: 'contact' },
  { id: 'lance', nom: 'Lance', arme: true, dmg: '1d6', armeType: 'contact' },
  { id: 'marteau', nom: 'Marteau de guerre', arme: true, dmg: '1d6', armeType: 'contact' },
  { id: 'fleau', nom: 'Fléau', arme: true, dmg: '1d6', armeType: 'contact' },
  { id: 'arbalete', nom: 'Arbalète', arme: true, dmg: '1d6', armeType: 'distance' },
  { id: 'armure', nom: 'Armure', armure: true, def: 3 },
  { id: 'bouclier', nom: 'Bouclier', armure: true, def: 1 },
  { id: 'anneau', nom: 'Anneau' },
  { id: 'amulette', nom: 'Amulette' },
  { id: 'baton', nom: 'Bâton', arme: true, dmg: '1d4', armeType: 'contact' },
  { id: 'cape', nom: 'Cape' },
  { id: 'couronne', nom: 'Couronne' },
  { id: 'grimoire', nom: 'Grimoire' },
  { id: 'parchemin', nom: 'Parchemin' },
  { id: 'gants', nom: 'Gants', pluriel: true },
  { id: 'bottes', nom: 'Bottes', pluriel: true },
  { id: 'orbe', nom: 'Orbe' }
];

COF.TRESOR_TIERS = [
  { id: 'mineur', nom: 'Mineur', niveau: 'niveaux 1-5', poids: 5, nbPouvoirs: 1, prixMin: 50, prixMax: 200 },
  { id: 'majeur', nom: 'Majeur', niveau: 'niveaux 6-11', poids: 3, nbPouvoirs: 2, prixMin: 400, prixMax: 1200 },
  { id: 'legendaire', nom: 'Légendaire', niveau: 'niveau 12+', poids: 1, nbPouvoirs: 2, prixMin: 2000, prixMax: 6000 }
];

/* Noms composés à la manière d'un objet unique (« Sombrelame », « Aubécœur »). */
COF.TRESOR_NOM_PREFIXES = [
  'Fang', 'Sombre', 'Aube', 'Glace', 'Brume', 'Flamme', 'Nuit', 'Sang', 'Lune',
  'Fer', 'Cendre', 'Astre', 'Ombre', 'Givre', 'Orage', 'Ronce', 'Ciel', 'Vent',
  'Aigle', 'Loup', 'Dragon', 'Étoile', 'Poussière', 'Larme', 'Onde', 'Braise'
];
COF.TRESOR_NOM_SUFFIXES = [
  'dent', 'lame', 'cœur', 'griffe', 'ombre', 'étoile', 'ronce', 'ciel', 'brise',
  'flamme', 'écaille', 'épine', 'garde', 'chant', 'souffle', 'aile', 'larme', 'crin'
];
/* Épithètes pour le patron « [Type] de/du/des X ». */
COF.TRESOR_EPITHETES = [
  "l'Aube", 'la Nuit Éternelle', "l'Orage", 'la Vengeance', "l'Oubli",
  'la Dernière Larme', "l'Étoile Filante", 'la Morsure du Serpent', 'le Sang-Froid',
  'la Colère des Anciens', "l'Écho du Passé", 'la Flamme Éternelle', 'le Silence',
  'les Âmes Perdues', 'le Crépuscule', 'la Promesse Brisée', 'le Dernier Soupir',
  'la Foi Trahie', "l'Aurore Noire", 'le Roi Oublié',
  "l'Hiver Sans Fin", 'la Meute', 'les Sept Sceaux', "l'Ultime Recours",
  'la Veuve', 'le Pacte Rompu', "l'Œil Vigilant", 'la Chute'
];
/* Adjectifs pour le patron « [Type] [Adjectif] », accordés m/f. */
COF.TRESOR_ADJ_M = [
  'Maudit', 'Sacré', 'Ancien', 'Oublié', 'Brisé', 'Éternel', 'Silencieux', 'Vengeur',
  'Immaculé', 'Déchu', 'Errant', 'Insatiable', 'Impie', 'Radieux', 'Funeste'
];
COF.TRESOR_ADJ_F = [
  'Maudite', 'Sacrée', 'Ancienne', 'Oubliée', 'Brisée', 'Éternelle', 'Silencieuse',
  'Vengeresse', 'Immaculée', 'Déchue', 'Errante', 'Insatiable', 'Impie', 'Radieuse', 'Funeste'
];

/* Pouvoirs classés par palier, sur le modèle des objets +1/+2/+3 et des
   effets mineurs/majeurs/légendaires déjà utilisés dans COF.OBJETS_MAGIQUES
   (voir js/data/recompenses.js) : un objet mineur reste modeste, un
   légendaire nettement plus fort — au lieu de piocher une seule table à
   plat où un objet mineur pouvait obtenir un pouvoir digne d'un légendaire.
   `effet` (facultatif) rend le pouvoir mécanique : appliqué lors de
   l'attaque si l'objet est une arme (voir js/core/tresors-nommes.js et
   COF.UI.dmgArme/modArme) ; sans `effet`, le pouvoir reste descriptif. */
COF.TRESOR_POUVOIRS_MINEUR = [
  { texte: "+1 aux jets d'attaque et de dégâts avec cet objet", effet: { type: 'armeplus', val: 1 } },
  { texte: "Le porteur regagne 1d6 PV au lever du jour" },
  { texte: "Confère une résistance à un type de dégâts au choix (dégâts réduits de moitié)" },
  { texte: "Une fois par jour, permet de relancer un jet d'attaque ou de sauvegarde raté" },
  { texte: "Émet sur commande une lumière vive dans un rayon de 10 m" },
  { texte: "Le porteur comprend toute langue parlée à moins de 5 m" },
  { texte: "Permet de communiquer par télépathie avec un être désigné à la création de l'objet" },
  { texte: "Le porteur ne peut être pris par surprise" },
  { texte: "Rend son porteur immunisé au poison" },
  { texte: "Le porteur voit dans le noir total jusqu'à 20 m" },
  { texte: "Confère un point de chance supplémentaire, rechargé chaque jour" },
  { texte: "Permet de respirer sous l'eau tant que l'objet est porté" },
  { texte: "Le porteur est plus difficile à pister (traces effacées, odeur neutralisée)" },
  { texte: "Confère un avantage constant sur un domaine de test au choix (discrétion, persuasion, escalade...)" }
];

COF.TRESOR_POUVOIRS_MAJEUR = [
  { texte: "+2 aux jets d'attaque et de dégâts avec cet objet", effet: { type: 'armeplus', val: 2 } },
  { texte: "+1d6 dégâts élémentaires supplémentaires (feu, froid ou foudre au choix à la création)", effet: { type: 'elementaire', formule: '1d6', label: 'élémentaires' } },
  { texte: "Une fois par combat, absorbe entièrement les dégâts d'une seule attaque" },
  { texte: "Une fois par combat, +5 à un jet d'attaque ou de dégâts" },
  { texte: "+2 à la DEF du porteur, cumulable avec l'armure" },
  { texte: "Une fois par jour, soigne 2d8+4 PV à son porteur ou à une cible touchée" },
  { texte: "Une fois par semaine, ouvre un passage instantané vers un lieu lié à l'objet" },
  { texte: "Une fois par jour, charme brièvement une créature qui échoue à un test de Volonté" },
  { texte: "Le porteur ne ressent plus la peur face à un type de créature désigné" },
  { texte: "Une fois par jour, +1d4 aux dégâts d'un sort lancé dans la minute qui suit" },
  { texte: "Une fois par jour, +1d6 aux dégâts contre un type de créature désigné" },
  { texte: "Confère l'immunité à un effet de terrain au choix (chute, noyade)" }
];

COF.TRESOR_POUVOIRS_LEGENDAIRE = [
  { texte: "+3 aux jets d'attaque et de dégâts avec cet objet", effet: { type: 'armeplus', val: 3 } },
  { texte: "+2d6 dégâts élémentaires supplémentaires (feu, froid ou foudre au choix à la création)", effet: { type: 'elementaire', formule: '2d6', label: 'élémentaires' } },
  { texte: "Une fois par jour, absorbe entièrement les dégâts d'une attaque, même critique" },
  { texte: "+3 à la DEF du porteur, cumulable avec l'armure" },
  { texte: "Une fois par jour, soigne intégralement son porteur (PV au maximum)" },
  { texte: "Une fois par semaine, ramène son porteur à 1 PV s'il tombe à 0 dans la minute qui suit" },
  { texte: "Confère l'immunité totale à un type de dégâts au choix" },
  { texte: "Une fois par jour, relance tous les jets ratés d'un round complet" },
  { texte: "Le porteur régénère 1d6 PV au début de chaque round de combat" },
  { texte: "Possède une volonté propre : un pouvoir unique supplémentaire, à déterminer avec le MJ" }
];

COF.TRESOR_ORIGINES = [
  "Forgé pour un roi qui n'a jamais régné.",
  "Retrouvé sur le corps d'un dragon vaincu par un héros aujourd'hui oublié.",
  "Offert en gage d'un pacte scellé entre deux royaumes ennemis.",
  "Volé dans la tombe d'un sorcier qui jura de le récupérer, vivant ou mort.",
  "Fabriqué par un artisan qui n'a jamais révélé son secret.",
  "Passé de main en main pendant des siècles, changeant de nom à chaque fois.",
  "Créé pour sceller un pouvoir bien plus terrible que lui-même.",
  "Retrouvé intact dans les ruines d'une civilisation aujourd'hui disparue.",
  "Béni par un temple depuis longtemps tombé en ruine.",
  "Arraché des mains d'un usurpateur lors d'une bataille décisive.",
  "Fruit d'un rituel interdit, dont le prix reste à découvrir.",
  "Offert par une créature surnaturelle en échange d'un service jamais rendu.",
  "Gagné lors d'un pari qui a mal fini pour son ancien propriétaire.",
  "Confectionné pour un enfant de haute naissance, jamais réclamé.",
  "Récupéré dans les décombres d'une tour de mage effondrée.",
  "Enterré volontairement par son créateur, qui craignait son propre pouvoir.",
  "Remis en gage lors d'une négociation qui a mal tourné.",
  "Trouvé cousu dans la doublure d'un manteau de voyageur anonyme.",
  "Façonné à partir des restes d'une arme plus ancienne encore."
];

COF.TRESOR_MALEDICTIONS = [
  "Chuchote la nuit, empêchant tout repos réparateur à son porteur.",
  "Refuse d'être lâché une fois empoigné, sauf rituel de dissolution.",
  "Attire immanquablement l'attention des créatures maléfiques proches.",
  "Rend son porteur incapable de mentir tant qu'il le porte.",
  "Draine 1 PV chaque jour tant que son porteur le garde sur lui.",
  "Provoque des cauchemars récurrents liés à son ancien propriétaire.",
  "Rend son porteur irritable et prompt à la colère.",
  "Impossible de s'en séparer volontairement sans une cérémonie spécifique.",
  "Chuchote le nom de son ancien propriétaire dans les moments de silence.",
  "Rend son porteur méfiant envers ses propres alliés, sans raison apparente.",
  "S'assombrit visiblement en présence d'une trahison imminente, glaçant son porteur.",
  "Exige d'être utilisé au combat au moins une fois par jour, sous peine de malaise croissant."
];
