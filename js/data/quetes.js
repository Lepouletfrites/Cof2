/* ============================================================
   COF2 Compagnon — Données : accroches & quêtes
   Tables combinées par js/core/quetes.js pour composer une
   quête complète prête à démarrer une session.
   ============================================================ */
window.COF = window.COF || {};

COF.QUETES_COMMANDITAIRES = [
  "Un noble local, aux manières impeccables mais au regard calculateur",
  "Un marchand inquiet pour sa caravane ou ses affaires",
  "Un enfant du village, terrifié mais déterminé",
  "Un prêtre ou une prêtresse du temple local",
  "Un garde ou un officier de la ville, débordé par les événements",
  "Un vieil ermite reclus, peu habitué à demander de l'aide",
  "Une guilde marchande influente, agissant par intermédiaire",
  "Un aubergiste dépassé par une situation qui le dépasse",
  "Un noble déchu cherchant à se refaire une réputation",
  "Un inconnu encapuchonné qui refuse de donner son nom",
  "Un artisan respecté, embarrassé de devoir demander de l'aide",
  "Une vieille connaissance des PJ, réapparue après une longue absence",
  "Un fonctionnaire municipal, strictement légaliste",
  "Un chef de guilde criminelle, offrant un marché inhabituel",
  "Un érudit ou un mage, plus intéressé par le savoir que par la morale",
  "Une communauté entière, représentée par un porte-parole désigné",
  "Un enfant de noble, agissant dans le dos de sa famille",
  "Un vétéran d'un ancien conflit, hanté par son passé",
  "Un étranger de passage, dont l'accent trahit une origine lointaine",
  "Une autorité religieuse en délicatesse avec sa propre hiérarchie"
];

COF.QUETES_MOTIVATIONS = [
  "par désespoir, n'ayant plus personne vers qui se tourner",
  "par appât du gain, espérant en tirer un profit personnel",
  "par vengeance, soigneusement dissimulée sous de bonnes manières",
  "par devoir, en accord avec son rang ou sa charge",
  "par peur d'un scandale si la vérité venait à éclater",
  "par amour, pour protéger quelqu'un qui lui est cher",
  "par culpabilité, cherchant à réparer une erreur passée",
  "par pure curiosité, plus que par réelle nécessité",
  "sous la contrainte de quelqu'un d'autre, resté dans l'ombre",
  "par ambition, y voyant un tremplin vers autre chose",
  "par loyauté envers une cause ou une personne",
  "par obligation religieuse ou un vœu personnel"
];

COF.QUETES_OBJECTIFS = [
  "Récupérer un objet volé, perdu ou caché",
  "Escorter quelqu'un ou quelque chose jusqu'en lieu sûr",
  "Éliminer ou neutraliser une menace bien précise",
  "Enquêter sur une série d'événements étranges",
  "Livrer un message ou un colis en toute discrétion",
  "Retrouver une personne disparue depuis peu",
  "Négocier ou infiltrer un accord délicat",
  "Protéger un lieu ou un événement d'une menace annoncée",
  "Explorer un site inconnu ou réputé dangereux",
  "Réunir des preuves contre quelqu'un d'influent",
  "Briser une malédiction ou annuler un sortilège",
  "Saboter discrètement les plans d'un rival",
  "Servir de médiateur dans un conflit qui s'envenime",
  "Récupérer une dette ou faire respecter un contrat"
];

COF.QUETES_CIBLES = [
  "un artefact ancien aux pouvoirs incertains", "une caravane marchande en difficulté",
  "un enfant ou un proche enlevé", "un document compromettant",
  "une créature dangereuse rôdant dans la région", "un noble ou fonctionnaire corrompu",
  "un temple ou sanctuaire abandonné", "une mine ou galerie hantée",
  "un culte clandestin aux intentions troubles", "un rival politique ou commercial",
  "une relique sacrée disparue", "un trésor englouti ou enfoui",
  "une preuve d'un complot en cours", "un remède ou ingrédient rare",
  "une lignée ou un héritage oublié", "un espion infiltré parmi les proches du commanditaire",
  "une bande de brigands qui écume la région", "un ancien allié devenu menace"
];

COF.QUETES_OBSTACLES = [
  "Le lieu est protégé par des gardes vigilants ou une milice organisée",
  "Un rival poursuit exactement le même objectif",
  "Le temps presse : une échéance précise approche",
  "L'endroit est piégé, instable ou difficile d'accès",
  "La cible se déplace sans cesse, toujours un pas d'avance",
  "Un dilemme moral complique sérieusement la tâche",
  "Les informations disponibles sont contradictoires ou incomplètes",
  "Une créature protège farouchement les lieux ou la cible",
  "Le commanditaire dissimule une partie essentielle de la vérité",
  "Les autorités locales s'opposent à toute intervention extérieure",
  "Il faut agir sans éveiller les soupçons de quiconque",
  "Les conditions naturelles (météo, terrain) rendent la tâche périlleuse"
];

COF.QUETES_COMPLICATIONS = [
  "Le commanditaire a menti sur une partie essentielle de l'histoire",
  "Un allié inattendu propose son aide, mais à un prix",
  "La cible n'est finalement pas ce qu'elle semblait être",
  "Un adversaire commun apparaît, plus dangereux que prévu",
  "Les PJ découvrent que leur mission profite en réalité à quelqu'un d'autre",
  "Un événement extérieur bouleverse totalement la situation en cours",
  "Il faut choisir entre deux issues, toutes deux imparfaites",
  "Une personne innocente se retrouve prise entre deux feux",
  "Un détail change radicalement la nature morale de la mission",
  "Le temps imparti se réduit brutalement suite à un imprévu"
];

COF.QUETES_RECOMPENSES = [
  "Une somme d'or convenable, versée en deux fois",
  "Un objet de valeur ou légèrement magique",
  "Une faveur politique ou sociale précieuse à l'avenir",
  "Un accès à des informations ou un lieu autrement inaccessible",
  "Une reconnaissance publique, avec ses avantages et ses inconvénients",
  "Un service futur, promis sur l'honneur du commanditaire",
  "Un titre ou une position, temporaire ou durable",
  "Rien d'officiel : seulement la satisfaction du devoir accompli",
  "Une réduction de dette ou un avantage commercial durable",
  "La protection ou l'appui d'une faction influente"
];
