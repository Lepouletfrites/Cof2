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

/* Objets magiques : trois paliers de puissance, à débloquer selon
   le niveau du groupe. Table maison, sans prétention d'exhaustivité —
   pensée comme une source d'inspiration rapide pour le MJ. */
COF.OBJETS_MAGIQUES = [
  /* --- mineurs (niveaux 1-5) --- */
  { tier: 'mineur', nom: 'Potion de soins supérieure', desc: 'Rend 2d8+4 PV. Usage unique.' },
  { tier: 'mineur', nom: 'Arme +1', desc: '+1 aux jets d\'attaque et de dégâts.', arme: true },
  { tier: 'mineur', nom: 'Armure +1', desc: 'Un équipement discrètement renforcé. +1 à la DEF qu\'il confère.', armure: true },
  { tier: 'mineur', nom: 'Anneau de protection mineur', desc: '+1 à la DEF, cumulable avec l\'armure.' },
  { tier: 'mineur', nom: 'Amulette contre le poison', desc: 'Une fois par jour, relance un jet de sauvegarde raté contre le poison.' },
  { tier: 'mineur', nom: 'Cape d\'ombre', desc: 'Une fois par jour, +10 à un test de discrétion.' },
  { tier: 'mineur', nom: 'Bottes de silence', desc: 'Les pas du porteur ne font aucun bruit sur les surfaces naturelles.' },
  { tier: 'mineur', nom: 'Grimoire de poche', desc: 'Contient un sort mineur au choix, utilisable une fois par jour comme un parchemin.' },
  { tier: 'mineur', nom: 'Sifflet du fidèle compagnon', desc: 'Appelle un animal familier ou une monture à moins de 1 km, une fois par jour.' },
  { tier: 'mineur', nom: 'Pierre de lumière', desc: 'Émet une lumière vive dans un rayon de 10 m sur commande mentale, sans limite d\'usage.' },
  { tier: 'mineur', nom: 'Gants du grimpeur', desc: '+10 aux tests d\'escalade.' },
  { tier: 'mineur', nom: 'Parchemin de sort (niveau 1-2)', desc: 'Un sort au choix du MJ, utilisable une fois puis consumé.' },
  { tier: 'mineur', nom: 'Talisman de vigueur', desc: '+1d6 PV temporaires au lever du jour, non cumulable.' },
  { tier: 'mineur', nom: 'Corde animée', desc: 'Sur ordre, s\'enroule ou se déroule seule sur 15 m.' },

  /* --- majeurs (niveaux 6-11) --- */
  { tier: 'majeur', nom: 'Arme +2 flamboyante', desc: '+2 aux jets d\'attaque et de dégâts ; une fois par combat, inflige 2d6 DM de feu supplémentaires.', arme: true },
  { tier: 'majeur', nom: 'Armure +2 du bastion', desc: '+2 à la DEF qu\'elle confère ; une fois par jour, absorbe entièrement une attaque critique.', armure: true },
  { tier: 'majeur', nom: 'Anneau de résistance élémentaire', desc: 'Résistance à un type de dégâts élémentaire au choix (réduit de moitié).' },
  { tier: 'majeur', nom: 'Amulette de clairvoyance', desc: 'Le porteur ne peut être pris par surprise et ignore l\'invisibilité à 10 m.' },
  { tier: 'majeur', nom: 'Cape du déplacement', desc: 'Une fois par combat, téléportation instantanée à 20 m en ligne de vue.' },
  { tier: 'majeur', nom: 'Bâton d\'enchanteur', desc: 'Contient 5 charges ; chaque charge relance un jet de sort raté.' },
  { tier: 'majeur', nom: 'Heaume du commandement', desc: 'Une fois par jour, octroie +1d6 aux DM à tous les alliés à 10 m pendant un round.' },
  { tier: 'majeur', nom: 'Bottes ailées', desc: 'Vol à vitesse de marche pendant 10 minutes par jour, cumulables.' },
  { tier: 'majeur', nom: 'Miroir de renvoi', desc: 'Une fois par jour, renvoie un sort d\'attaque ciblé contre son lanceur.' },
  { tier: 'majeur', nom: 'Carquois sans fond', desc: 'Produit un trait ou une flèche ordinaire à chaque tirage, à volonté.' },
  { tier: 'majeur', nom: 'Pierre de rappel', desc: "Une fois activée, invoque une porte de retour vers un lieu lié, une fois par semaine." },
  { tier: 'majeur', nom: 'Collier des langues', desc: 'Comprend et parle toute langue parlée entendue depuis plus d\'un round.' },

  /* --- légendaires (niveaux 12+) --- */
  { tier: 'legendaire', nom: 'Arme +3 sensible', desc: '+3 aux jets d\'attaque et de dégâts ; possède une volonté propre et un pouvoir unique déterminé par le MJ.', arme: true },
  { tier: 'legendaire', nom: 'Armure +3 immaculée', desc: '+3 à la DEF ; immunité totale à un type de dégâts au choix du MJ.', armure: true },
  { tier: 'legendaire', nom: 'Couronne du monarque déchu', desc: 'Une fois par jour, charme toute créature intelligente qui échoue à un jet de sauvegarde de Volonté.' },
  { tier: 'legendaire', nom: 'Grimoire des arcanes perdues', desc: 'Contient trois sorts de rang 5+ utilisables une fois chacun par semaine.' },
  { tier: 'legendaire', nom: 'Anneau des trois souhaits', desc: 'Trois usages, à vie. Chaque souhait a un prix déterminé par le MJ.' },
  { tier: 'legendaire', nom: 'Faux de la moisson finale', desc: 'Sur un critique, la cible doit réussir un jet de sauvegarde de Constitution ou mourir sur-le-champ.' },
  { tier: 'legendaire', nom: "Cœur de dragon serti", desc: 'Une fois par jour, souffle élémentaire au choix (6d8 DM, zone de 15 m, sauvegarde pour moitié).' },
  { tier: 'legendaire', nom: 'Manteau des étoiles filantes', desc: 'Vol illimité et invisibilité une fois par jour pendant 1 minute.' }
];

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
