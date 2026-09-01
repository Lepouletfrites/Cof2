/* ============================================================
   COF2 Compagnon — Données : salles de donjon & exploration
   Tables combinées par js/core/donjon.js pour décrire une salle
   ou un lieu souterrain à la volée, en complément des générateurs
   de Rencontre (le combat), Butin (le loot) et Voyage (le trajet).
   ============================================================ */
window.COF = window.COF || {};

COF.DONJON_FORMES = [
  "Salle carrée aux murs de pierre taillée", "Couloir étroit et sinueux",
  "Vaste hall soutenu par des colonnes sculptées", "Petite alcôve dissimulée dans un renfoncement",
  "Escalier en spirale qui descend dans le noir", "Pont de pierre étroit au-dessus d'un gouffre",
  "Chambre circulaire au plafond voûté", "Galerie naturelle aux parois irrégulières",
  "Ancienne salle du trône, dépouillée de son faste", "Bibliothèque ou archive à moitié effondrée",
  "Chapelle ou sanctuaire oublié", "Cellules ou geôles alignées le long d'un mur",
  "Réfectoire ou cuisine à l'abandon", "Atelier ou forge désaffecté",
  "Cave à vin ou entrepôt souterrain", "Passage taillé à même la roche, très bas de plafond",
  "Salle des machines ou mécanisme ancien, immobile", "Terrasse extérieure surplombant le vide"
];

COF.DONJON_ETATS = [
  "En ruine, à moitié effondrée", "Étonnamment bien conservée, presque intacte",
  "Envahie par la végétation, des racines ou des champignons", "Inondée sur plusieurs centimètres d'eau stagnante",
  "Couverte de toiles d'araignées épaisses", "Maculée de suie ancienne et d'odeurs de brûlé",
  "Poussiéreuse, personne n'y est passé depuis des années", "Fissurée, des blocs menacent de tomber du plafond",
  "Décorée de fresques ou de gravures encore lisibles", "Jonchée de débris et d'objets brisés",
  "Étrangement propre, comme entretenue récemment", "Glaciale, un froid qui ne semble pas naturel",
  "Chaude et humide, une vapeur légère flotte dans l'air", "Silencieuse au point d'en être oppressante"
];

COF.DONJON_OCCUPANTS = [
  "Vide, silence total — rien ni personne", "Une créature dort, inconsciente du danger",
  "Des occupants vaquent à leurs occupations, une alerte reste possible",
  "Traces d'une occupation récente mais désertée pour l'instant",
  "Une créature immobile et camouflée guette sa proie",
  "Des occupants montent une garde visible et attentive",
  "Une créature blessée ou affaiblie, potentiellement négociable",
  "Des restes d'un combat antérieur, vainqueur inconnu",
  "Un occupant solitaire, absorbé par une tâche précise",
  "Plusieurs créatures se disputent, distraites l'une par l'autre",
  "Un occupant prisonnier, enchaîné ou enfermé",
  "Une présence invisible ou incorporelle, décelable seulement par des indices"
];

COF.DONJON_PIEGES = [
  "Aucun piège détectable, la voie semble sûre", "Aucun piège détectable, la voie semble sûre",
  "Une dalle descellée déclenche une volée de fléchettes",
  "Un fil tendu au ras du sol actionne un mécanisme de blocs",
  "Le sol s'effondre sous un poids trop important",
  "Un gaz toxique ou soporifique se libère à l'ouverture d'un passage",
  "Une porte piégée referme brutalement le passage derrière les intrus",
  "Un mécanisme à contrepoids fait chuter des pierres du plafond",
  "Une zone du sol est électrifiée ou magiquement instable",
  "Un symbole runique s'active au contact, avec un effet magique mineur",
  "Un piège à glu ou à filet immobilise temporairement",
  "Une fausse trésor déclenche une alarme sonore ou magique",
  "Un puits caché sous un tapis ou des débris"
];

COF.DONJON_PARTICULARITES = [
  "Un coffre visible mais manifestement piégé ou surveillé",
  "Une petite cache dissimulée, facile à manquer sans chercher",
  "Un objet de valeur oublié, sans lien apparent avec le lieu",
  "Une inscription ou une carte gravée dans la pierre, utile plus tard",
  "Un mécanisme énigmatique dont la fonction n'est pas évidente",
  "Une statue ou un artefact qui semble observer les intrus",
  "Un autel ou un point d'intérêt rituel, actif ou non",
  "Une source d'eau ou de lumière magique, inattendue à cet endroit",
  "Des ossements ou des restes qui racontent une histoire tragique",
  "Un miroir, un vitrail ou une surface réfléchissante insolite",
  "Rien de particulier ici, la salle est fonctionnelle et sans mystère",
  "Un écho ou une acoustique étrange qui trahit un espace caché à proximité"
];

COF.DONJON_SORTIES = [
  "Une porte verrouillée à l'opposé de l'entrée", "Un passage secret dissimulé dans un mur",
  "Un puits ou une trappe qui s'enfonce plus profond", "Une bifurcation à trois embranchements distincts",
  "Un couloir unique qui continue tout droit", "Un escalier qui monte vers la surface",
  "Une ouverture trop étroite pour un adversaire de grande taille", "Un pont ou une passerelle fragile",
  "Une impasse : il faut rebrousser chemin", "Une grille ou une herse qu'il faudra forcer ou déverrouiller",
  "Un passage inondé qu'il faudra traverser à la nage", "Une cheminée ou un conduit vertical, étroit"
];
