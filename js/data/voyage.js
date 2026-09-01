/* ============================================================
   COF2 Compagnon — Données : événements de voyage & exploration
   Tables combinées par js/core/voyage.js pour ponctuer un trajet
   sans forcément déclencher un combat.
   ============================================================ */
window.COF = window.COF || {};

COF.VOYAGE_METEO = [
  "Ciel dégagé et chaud, sans un nuage", "Pluie fine et persistante toute la journée",
  "Brouillard épais qui limite fortement la visibilité", "Vent violent qui rend la marche pénible",
  "Chaleur écrasante, l'eau se fait rare", "Froid mordant qui engourdit les mains",
  "Un orage menace à l'horizon depuis des heures", "Une légère chute de neige recouvre le paysage",
  "Ciel couvert mais sec, lumière grise et plate", "Brume matinale qui se dissipe lentement",
  "Averses intermittentes, jamais assez longues pour vraiment s'abriter",
  "Calme plat et étouffant, pas un souffle d'air", "Bourrasques chargées de poussière ou de sable",
  "Une grêle brève mais violente s'abat sans prévenir",
  "Une chaleur lourde et humide, annonciatrice d'orage",
  "Un vent glacial qui semble venir de nulle part",
  "Une pluie chaude, presque agréable, qui ne dure jamais longtemps",
  "Un ciel d'un rouge inhabituel au coucher du soleil",
  "Une accalmie parfaite après plusieurs jours de mauvais temps"
];

COF.VOYAGE_CATEGORIES = ['pnj', 'incident', 'interet', 'decouverte', 'presage', 'calme'];
COF.VOYAGE_CATEGORIES_LABELS = {
  pnj: 'Rencontre de voyageurs', incident: 'Incident de parcours',
  interet: "Point d'intérêt", decouverte: 'Découverte', presage: 'Présage', calme: 'Trajet sans histoire'
};

COF.VOYAGE_PNJ = [
  "Un marchand ambulant, désireux de faire affaire avant la nuit",
  "Une famille de réfugiés, épuisée et méfiante envers les inconnus",
  "Un pèlerin solitaire en route vers un lieu saint lointain",
  "Un petit groupe de bûcherons ou de mineurs, taciturnes",
  "Un messager pressé, refusant de s'arrêter plus que nécessaire",
  "Un chasseur solitaire, bon connaisseur des environs",
  "Une patrouille de gardes, exigeant de voir les papiers du groupe",
  "Un barde itinérant en quête d'histoires à raconter",
  "Un vieil ermite, méfiant mais pas hostile",
  "Une caravane marchande, ouverte au troc et aux nouvelles",
  "Un groupe de pèlerins chantant en chœur pour tromper la fatigue",
  "Un enfant visiblement perdu, cherchant son chemin",
  "Un noble voyageant incognito, mal à l'aise sur la route",
  "Un collecteur d'impôts, imbu de son autorité",
  "Un colporteur vendant des babioles et des remèdes de sa fabrication",
  "Une troupe de comédiens ambulants, bruyante et haute en couleur",
  "Un vieux couple de paysans en route vers le marché le plus proche",
  "Un éclaireur ou un guide local, proposant ses services contre rémunération",
  "Un groupe de chasseurs de primes, curieux mais pas hostiles",
  "Un mendiant ou un vagabond, porteur de nouvelles fraîches en échange d'un repas"
];

COF.VOYAGE_INCIDENTS = [
  "Une monture perd un fer, obligeant à ralentir sérieusement",
  "Le chemin est coupé par un pont ou un ouvrage effondré",
  "Une roue de chariot se brise en pleine montée",
  "Une provision essentielle a été oubliée ou égarée",
  "Un membre du groupe se sent brusquement mal, sans gravité",
  "Un orage soudain force à chercher un abri de fortune",
  "Le sentier bifurque sans aucune indication claire",
  "Une crue rend un gué habituel totalement infranchissable",
  "Un objet de valeur glisse et manque de se perdre en chemin",
  "Un animal sauvage effraie les montures sans réelle agressivité",
  "La nuit tombe bien plus vite que prévu, loin de tout abri",
  "Un membre du groupe se blesse légèrement en trébuchant",
  "Une carte s'avère erronée ou périmée, forçant à rebrousser chemin",
  "Un sac ou un bagage s'ouvre en chemin, éparpillant son contenu",
  "Une dispute interne au groupe fait perdre un temps précieux",
  "Le terrain se révèle plus difficile que prévu, ralentissant la progression",
  "Une des montures refuse d'avancer, effrayée par quelque chose d'invisible"
];

COF.VOYAGE_INTERETS = [
  "Les ruines d'une ancienne tour de guet", "Un cimetière oublié, envahi par la végétation",
  "Une source d'eau claire et potable, rare dans la région", "Un arbre remarquable, immense et manifestement ancien",
  "Un menhir ou une pierre gravée de symboles inconnus", "Un pont de pierre d'une facture ancienne et soignée",
  "Un campement abandonné très récemment, le feu encore tiède",
  "Une grotte dont l'entrée semble avoir été dérangée récemment",
  "Un petit sanctuaire naturel, visiblement entretenu par des mains inconnues",
  "Une carcasse d'animal, tuée par quelque chose d'inhabituel",
  "Un vieux moulin à l'abandon", "Une croisée de chemins marquée par un totem ou une potence",
  "Un belvédère naturel offrant une vue dégagée sur toute la région",
  "Une stèle commémorative érigée pour une bataille oubliée",
  "Un verger sauvage, retourné à l'état naturel depuis des lustres",
  "Un pont suspendu de corde, visiblement rafistolé plus d'une fois",
  "Une formation rocheuse étrange, presque artificielle dans sa régularité"
];

COF.VOYAGE_DECOUVERTES = [
  "Des traces de pas récentes, nombreuses et pressées",
  "Un feu de camp encore fumant, abandonné à la hâte",
  "Un objet personnel, perdu par un précédent voyageur",
  "Des marques de griffes profondes sur un tronc d'arbre",
  "Une carte partiellement effacée, coincée entre des rochers",
  "Un nid ou un terrier manifestement récent et de grande taille",
  "Une odeur inhabituelle, portée par le vent",
  "Les restes d'un campement visiblement pillé",
  "Un message gravé ou écrit à l'attention d'un voyageur inconnu",
  "Une plante ou un champignon d'apparence franchement inhabituelle",
  "Un bijou ou une pièce de monnaie ancienne, à moitié enfouie",
  "Un piège de chasse abandonné, encore fonctionnel",
  "Une inscription récente gravée dans l'écorce d'un arbre",
  "Des ossements d'animal disposés d'une manière qui semble volontaire",
  "Un vêtement ou un équipement de voyage, abandonné sans explication"
];

COF.VOYAGE_PRESAGES = [
  "Un vol de corbeaux tourne au-dessus du groupe un long moment",
  "Le silence de la nature devient soudain total, sans oiseau ni insecte",
  "Une étoile filante traverse le ciel au crépuscule",
  "Un animal familier du groupe se comporte étrangement",
  "Une odeur de fumée sans source visible flotte dans l'air",
  "Un rêve étrangement vivace marque l'un des voyageurs pendant la nuit",
  "Les nuages prennent une forme ou une teinte inhabituelle",
  "Un frisson collectif et inexpliqué saisit le groupe",
  "Une brume localisée persiste sans raison apparente",
  "Un écho répond avec un léger décalage suspect",
  "Une pièce de monnaie tombe systématiquement sur la même face, encore et encore",
  "Le feu de camp change brièvement de couleur sans raison apparente",
  "Un voyageur croisé plus tôt semble être repassé au même endroit, à l'identique",
  "Les ombres portées paraissent légèrement décalées par rapport à la lumière",
  "Un calme surnaturel s'installe juste avant un tournant du chemin"
];

COF.VOYAGE_CALME = [
  "Le trajet se déroule sans le moindre incident, presque monotone.",
  "Une belle journée de marche, sans rien à signaler.",
  "Le groupe avance à bonne allure, l'ambiance est détendue.",
  "Rien à l'horizon, juste la route et le paysage qui défile.",
  "Une étape tranquille, l'occasion de se reposer un peu.",
  "Le silence de la nature est agréable, pas inquiétant pour une fois."
];
