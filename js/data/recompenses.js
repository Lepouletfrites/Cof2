/* ============================================================
   COF2 Compagnon — Données : butin & récompenses
   Tables utilisées par le générateur de récompenses pour habiller
   le pactole d'une rencontre (pièces, composants, objets, magie).
   ============================================================ */
window.COF = window.COF || {};

/* Richesse relative d'un environnement : un repaire en ruines ou
   une cave sous une ville regorge plus de butin qu'une clairière. */
COF.ENV_RICHESSE = {
  foret: 0.8, plaine: 0.85, montagne: 1, marais: 0.75,
  souterrain: 1.3, arctique: 0.75, urbain: 1.4, ruines: 1.55
};

/* Petits riens qu'on trouve sur presque n'importe quel humanoïde
   ou dans presque n'importe quel repaire. */
COF.BUTIN_DIVERS = [
  'Une bourse de cuir élimée', 'Un dé à jouer en os', 'Un jeu de cartes usé',
  'Une pipe et sa blague à tabac', 'Un peigne en corne', 'Une gourde cabossée',
  'Un carnet de comptes illisible', 'Une amulette sans valeur particulière',
  "Un bout de carte griffonné, incomplet", 'Un sifflet en bois',
  'Une fiole vide', "Un morceau de pain rassis et un quignon de fromage",
  'Un couteau ébréché', 'Des dés pipés', 'Une lettre jamais envoyée',
  'Un médaillon représentant une divinité inconnue', 'Un petit miroir fêlé',
  'Une paire de gants raccommodés', "Un carquois vide", 'Une pierre à aiguiser'
];

/* Trophées prélevables sur une créature non-humanoïde : gabarit
   générique, à adapter par le MJ selon la bestiole abattue. */
COF.BUTIN_TROPHEES = [
  { gabarit: 'Peau de {nom}', prix: 1 },
  { gabarit: 'Griffes de {nom}', prix: 1 },
  { gabarit: 'Crocs de {nom}', prix: 1 },
  { gabarit: 'Fourrure de {nom}, encore chaude', prix: 2 },
  { gabarit: 'Corne de {nom}', prix: 2 },
  { gabarit: "Une dent de {nom}, montée en pendentif par un précédent chasseur", prix: 3 },
  { gabarit: 'Plumes de {nom}', prix: 1 },
  { gabarit: 'Écailles de {nom}', prix: 2 },
  { gabarit: 'Venin de {nom}, encore actif (1 dose)', prix: 5 },
  { gabarit: 'Glande à musc de {nom}', prix: 3 },
  { gabarit: 'Un os long de {nom}, taillé en outil', prix: 1 },
  { gabarit: 'Un œil de {nom}, conservé dans un bocal', prix: 4 }
];

/* Composants prélevables sur une créature fantastique — matière
   première recherchée par alchimistes, enchanteurs et érudits. */
COF.BUTIN_COMPOSANTS = [
  { gabarit: 'Une écaille luminescente de {nom}', prix: 8 },
  { gabarit: 'Du sang de {nom}, encore tiède, dans une fiole scellée', prix: 6 },
  { gabarit: 'Un fragment de noyau arcanique tiré de {nom}', prix: 12 },
  { gabarit: 'Une plume irisée de {nom}', prix: 9 },
  { gabarit: 'Une griffe cristallisée de {nom}', prix: 10 },
  { gabarit: 'Un organe encore chaud de {nom}, empli de mana résiduel', prix: 15 },
  { gabarit: 'De la poussière de {nom}, scintillante', prix: 7 },
  { gabarit: 'Un fragment de carapace de {nom}, dur comme le fer', prix: 8 },
  { gabarit: 'Une larme cristallisée de {nom}', prix: 11 },
  { gabarit: 'Une mèche de {nom}, chargée de puissance résiduelle', prix: 9 }
];

/* Les objets magiques du butin viennent des règles du Compagnon : armes
   des voies de recettes (COF.ArmeMagiqueCalc) et objets du catalogue
   (COF.CATALOGUE_COMPAGNON). Voir js/core/recompense.js. */

/* Paliers de richesse génériques, utilisés par la fouille et le coffre
   (indépendamment de toute rencontre) pour moduler la quantité de butin. */
COF.RICHESSE_TIERS = {
  pauvre:    { nom: 'Pauvre',    mult: 0.4 },
  modeste:   { nom: 'Modeste',   mult: 0.7 },
  standard:  { nom: 'Standard',  mult: 1 },
  riche:     { nom: 'Riche',     mult: 1.8 },
  somptueux: { nom: 'Somptueux', mult: 3 }
};

/* Petites trouvailles en fouillant un lieu (pas de créature à piller :
   une pièce, un campement abandonné, une cache...). */
COF.BUTIN_TROUVAILLES = [
  'Une bourse oubliée sous des gravats', 'Un coffret à bijoux vide, à demi enfoui',
  'Des provisions encore consommables', 'Une carte partiellement effacée par l\'humidité',
  'Un outil de qualité, abandonné là', 'Une amulette religieuse sans valeur marchande',
  'Un livre de comptes appartenant visiblement à quelqu\'un d\'autre',
  'Une flasque d\'alcool à moitié pleine', 'Un nécessaire de couture complet',
  'Une clé dont on ignore la serrure', 'Un vieux plan de la région, annoté à la main',
  'Des vêtements de rechange, corrects mais poussiéreux', 'Une babiole sans valeur mais joliment sculptée',
  'Un sachet d\'herbes séchées, probablement médicinales', 'Une lanterne éteinte, encore utilisable',
  'Un carnet de notes dans une langue inconnue'
];

/* Objets de valeur trouvés dans un coffre ou un trésor accumulé —
   bijoux, gemmes et œuvres d'art plutôt que du matériel d'aventurier. */
COF.BUTIN_TRESORS = [
  { nom: 'Gemme brute', prix: 15 },
  { nom: 'Pierre semi-précieuse taillée', prix: 30 },
  { nom: 'Bague sertie d\'une pierre bleue', prix: 45 },
  { nom: 'Collier d\'argent finement ouvragé', prix: 60 },
  { nom: 'Broche émaillée aux armes d\'une famille inconnue', prix: 50 },
  { nom: 'Petite statuette en ivoire', prix: 70 },
  { nom: 'Pièce de monnaie ancienne, hors circulation', prix: 20 },
  { nom: 'Coupe en argent ciselé', prix: 90 },
  { nom: 'Tapisserie miniature brodée de fil d\'or', prix: 110 },
  { nom: 'Diadème orné de pierres colorées', prix: 150 },
  { nom: 'Icône religieuse incrustée de nacre', prix: 80 },
  { nom: 'Perle noire parfaitement sphérique', prix: 120 }
];
