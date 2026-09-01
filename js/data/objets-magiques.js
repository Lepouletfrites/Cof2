/* ============================================================
   COF2 Compagnon — Données : objets magiques (règles officielles)
   Tables du chapitre « Objets magiques » du livre de base :
   potions, parchemins, baguettes, armes/armures magiques, objets
   de pouvoir/puissance/compétence. Combinées par
   js/core/objets-magiques.js. Quand la règle demande un sort ou
   une capacité (parchemin, baguette, objet de pouvoir), on pioche
   une vraie entrée dans la base de voies/sorts déjà présente dans
   l'appli plutôt que dans une liste figée, pour maximiser les
   combinaisons possibles.
   ============================================================ */
window.COF = window.COF || {};

/* Familles de lanceurs de sorts utilisées par les tables Parchemin/
   Baguette du livre de base (d20 « voie du sort inscrit »). */
COF.OM_PROFILS_SORTS = ['ensorceleur', 'magicien', 'sorcier', 'pretre', 'druide'];

/* Parchemin/Baguette — Rang de la voie (d6), selon le palier choisi. */
COF.OM_RANG_PAR_PALIER = {
  mineur: [1, 1, 1, 2, 2, 3],
  moyen: [3, 3, 4, 4, 5, 5]
};

/* Objets de pouvoir — table des profils (d20), pondérée exactement
   comme la table du livre (Druide/Ensorceleur/Forgesort/Magicien/
   Sorcier/Prêtre comptent double). */
COF.OM_POUVOIR_PROFILS = [
  ['arquebusier', 1], ['barde', 1], ['barbare', 1], ['chevalier', 1],
  ['druide', 2], ['ensorceleur', 2], ['forgesort', 2], ['guerrier', 1],
  ['magicien', 2], ['moine', 1], ['sorcier', 2], ['pretre', 2],
  ['rodeur', 1], ['voleur', 1]
];

/* Armes magiques — type d'arme (d6) puis propriété (d12, simplifié en
   table pondérée). Les armes précises sont piochées dans les vraies
   tables d'équipement (COF.ARMES_CONTACT / COF.ARMES_DISTANCE). */
COF.OM_TYPE_ARME = [['contact', 3], ['distance', 2], ['sceptre', 1]];

COF.OM_PROP_ARME = [
  { id: 'affutee', poids: 2, nom: 'affûtée', niveau: 1,
    texte: "Zone de critique augmentée de 1 point ; +1d4° DM supplémentaires sur un critique." },
  { id: 'fleau', poids: 5, niveau: 1, fleau: true },
  { id: 'feu', poids: 1, nom: 'de feu', niveau: 2, elem: { formule: '1d4°', label: 'de feu' } },
  { id: 'froid', poids: 1, nom: 'de froid', niveau: 2, elem: { formule: '1d4°', label: 'de froid' } },
  { id: 'foudre', poids: 1, nom: 'de foudre', niveau: 2, elem: { formule: '1d4°', label: 'de foudre' } }
];
COF.OM_FLEAU_CREATURES = [
  'morts-vivants', 'dragons', 'géants', 'gobelinoïdes', 'démons',
  'animaux', 'lycanthropes', 'élémentaires', 'lanceurs de sorts'
];

/* Armures magiques — propriétés (d12). */
COF.OM_PROP_ARMURE = [
  { id: 'action_libre', nom: "Action libre", niveau: 1,
    texte: "Ne peut être ralenti, immobilisé ou paralysé par magie ; +5 aux tests pour résister à une contrainte physique de ce type." },
  { id: 'defense', nom: "Défense", niveau: 1, texte: "Réduit de 2 tous les DM subis (RD 2)." },
  { id: 'defense_sup', nom: "Défense supérieure", niveau: 2, texte: "Réduit de 4 tous les DM subis (RD 4)." },
  { id: 'natation', nom: "Natation", niveau: 1, texte: "+5 aux tests de natation ; une armure permet de flotter et de rester à la surface." },
  { id: 'ombre', nom: "Ombre", niveau: 1, texte: "+5 aux tests de discrétion (AGI)." },
  { id: 'protection', nom: "Protection", niveau: 1, texte: "Divise par deux les DM des coups critiques et des attaques sournoises." },
  { id: 'resist_magie', nom: "Résistance à la magie", niveau: 1, texte: "+5 en DEF ou aux tests pour résister à la magie (au choix au moment de l'attaque)." },
  { id: 'resist_feu', nom: "Résistance au feu", niveau: 1, texte: "Réduit de 10 les DM de feu subis." },
  { id: 'resist_froid', nom: "Résistance au froid", niveau: 1, texte: "Réduit de 10 les DM de froid subis." },
  { id: 'resist_electricite', nom: "Résistance à l'électricité", niveau: 1, texte: "Réduit de 10 les DM électriques subis." },
  { id: 'resist_acide', nom: "Résistance à l'acide", niveau: 1, texte: "Réduit de 10 les DM d'acide subis." },
  { id: 'mobile', nom: "Mobile", niveau: 1, texte: "Le malus d'armure est réduit de 4." }
];

/* Objets de puissance — caractéristique affectée (d12, « Relancer » exclu :
   on relance automatiquement). */
COF.OM_CARACS_PUISSANCE = [
  { id: 'AGI', nom: 'AGI', mineure: false }, { id: 'CON', nom: 'CON', mineure: false },
  { id: 'FOR', nom: 'FOR', mineure: false }, { id: 'PER', nom: 'PER', mineure: false },
  { id: 'CHA', nom: 'CHA', mineure: false }, { id: 'INT', nom: 'INT', mineure: false },
  { id: 'VOL', nom: 'VOL', mineure: false },
  { id: 'DR', nom: 'DR', mineure: true }, { id: 'PC', nom: 'PC', mineure: true },
  { id: 'PM', nom: 'PM', mineure: true }, { id: 'PV', nom: 'PV', mineure: true }
];
/* Formes d'objets par caractéristique, pour un nom cohérent. */
COF.OM_FORME_PUISSANCE = {
  AGI: 'Gantelets', CON: 'Amulette', FOR: 'Ceinture', PER: 'Masque',
  CHA: 'Robe', INT: 'Bandeau', VOL: 'Bandeau', DR: 'Talisman', PC: 'Médaillon', PM: 'Focus', PV: 'Talisman'
};

/* Objets de compétence — +5 à un type de test unique (pas de table
   officielle exhaustive dans le livre : liste étendue d'exemples). */
COF.OM_COMPETENCES = [
  'la discrétion', "l'escalade", 'la natation', "l'équitation", 'la navigation',
  'la survie en milieu sauvage', 'la perception auditive', 'la perception visuelle',
  'le désamorçage de pièges', 'le dressage', 'les jeux d\'argent', 'le marchandage',
  'la séduction', "l'intimidation", "l'escamotage (vol à la tire)", "l'orientation",
  'la résistance au froid', 'la résistance à la chaleur', "l'alchimie", "l'art oratoire",
  'la détection des embuscades', "l'érudition (histoire et légendes)", 'le déguisement',
  'la médecine et les premiers soins'
];
COF.OM_FORME_COMPETENCE = ['Cape', 'Bottes', 'Gants', 'Amulette', 'Anneau', 'Ceinture', 'Chapeau', 'Bandeau', 'Broche'];

/* Table « Origine d'un objet magique » (d10 × 3), pour construire une
   légende rapide dans les Terres d'Osgild. */
COF.OM_ORIGINE_PROVENANCE = [
  'Locale', "La nation où l'objet est découvert", 'Une nation voisine',
  'Le Grand Nord', 'Le Sud profond', "L'Ouest lointain", "L'Est lointain",
  'Les profondeurs', 'Un autre continent', 'Un autre plan'
];
COF.OM_ORIGINE_EPOQUE = [
  'Post Monastir', 'Âges sombres (-700 à -1)', "Empire d'Osgild",
  "Chute d'Anathazerïn", "Apogée d'Anathazerïn", 'Apogée des Premiers-nés',
  'Corruption post Roi-Sorcier', 'Époque du Roi-Sorcier', 'Chute des pierres du ciel', 'Premier âge'
];
COF.OM_ORIGINE_PEUPLE = [
  'Humains', 'Nains', 'Elfes', 'Gnomes', 'Elfes des ténèbres',
  'Orcs ou gobelins', 'Ange, démon ou divinité', 'Dragons', 'Seigneur élémentaire', 'Autre créature ancienne'
];

/* ---------- Nom procédural (partagé avec l'objet prestigieux) ----------
   Trois patrons : nom composé (préfixe+suffixe, à la « Sombrelame »),
   « [Type] de/du/des [Épithète] », ou « [Type] [Adjectif] ». */
COF.OM_NOM_PREFIXES = [
  'Fang', 'Sombre', 'Aube', 'Glace', 'Brume', 'Flamme', 'Nuit', 'Sang', 'Lune',
  'Fer', 'Cendre', 'Astre', 'Ombre', 'Givre', 'Orage', 'Ronce', 'Ciel', 'Vent',
  'Aigle', 'Loup', 'Dragon', 'Étoile', 'Poussière', 'Larme', 'Onde', 'Braise'
];
COF.OM_NOM_SUFFIXES = [
  'dent', 'lame', 'cœur', 'griffe', 'ombre', 'étoile', 'ronce', 'ciel', 'brise',
  'flamme', 'écaille', 'épine', 'garde', 'chant', 'souffle', 'aile', 'larme', 'crin'
];
COF.OM_EPITHETES = [
  "l'Aube", 'la Nuit Éternelle', "l'Orage", 'la Vengeance', "l'Oubli",
  'la Dernière Larme', "l'Étoile Filante", 'la Morsure du Serpent', 'le Sang-Froid',
  'la Colère des Anciens', "l'Écho du Passé", 'la Flamme Éternelle', 'le Silence',
  'les Âmes Perdues', 'le Crépuscule', 'la Promesse Brisée', 'le Dernier Soupir',
  'la Foi Trahie', "l'Aurore Noire", 'le Roi Oublié',
  "l'Hiver Sans Fin", 'la Meute', 'les Sept Sceaux', "l'Ultime Recours",
  'la Veuve', 'le Pacte Rompu', "l'Œil Vigilant", 'la Chute'
];
COF.OM_ADJ_M = [
  'Maudit', 'Sacré', 'Ancien', 'Oublié', 'Brisé', 'Éternel', 'Silencieux', 'Vengeur',
  'Immaculé', 'Déchu', 'Errant', 'Insatiable', 'Impie', 'Radieux', 'Funeste'
];
COF.OM_ADJ_F = [
  'Maudite', 'Sacrée', 'Ancienne', 'Oubliée', 'Brisée', 'Éternelle', 'Silencieuse',
  'Vengeresse', 'Immaculée', 'Déchue', 'Errante', 'Insatiable', 'Impie', 'Radieuse', 'Funeste'
];

/* Formes possibles d'un objet de pouvoir, pour varier son nom plutôt que
   de toujours l'appeler « Objet ». */
COF.OM_FORME_POUVOIR = ['Anneau', 'Amulette', 'Cape', 'Couronne', 'Grimoire', 'Orbe', 'Talisman', 'Diadème', 'Broche', 'Médaillon'];

/* Malédictions (chance faible sur une arme/armure magique) : l'objet a
   aussi un revers, sur le modèle des objets maudits du livre de base. */
COF.OM_MALEDICTIONS = [
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

/* Effet secondaire d'une potion bue en excès (2d6, table officielle). */
COF.OM_EFFET_SECONDAIRE_POTION = [
  { min: 2, max: 2, texte: "La potion ne fait pas effet et le personnage perd 1 PV sur son maximum (permanent)." },
  { min: 3, max: 3, texte: "La potion ne fait pas effet et le buveur est affaibli jusqu'à une récupération complète." },
  { min: 4, max: 4, texte: "La potion ne fait pas effet et le buveur est affaibli jusqu'à une récupération rapide." },
  { min: 5, max: 5, texte: "La potion ne fait aucun effet." },
  { min: 6, max: 8, texte: "La potion fait effet normalement (et la précédente reste active)." },
  { min: 9, max: 9, texte: "La potion fait effet, mais la précédente cesse immédiatement." },
  { min: 10, max: 10, texte: "La potion fait effet, mais le buveur est affaibli jusqu'à une récupération rapide." },
  { min: 11, max: 11, texte: "La potion fait effet, mais le buveur est affaibli jusqu'à une récupération complète." },
  { min: 12, max: 12, texte: "La potion fait effet, mais empoisonne le buveur : 1d4° DM par rang de la potion." }
];
