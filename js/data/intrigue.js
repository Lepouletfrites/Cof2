/* ============================================================
   COF2 Compagnon — Données : intrigue (rebondissement & tour de
   faction). Deux outils pensés pour le JDR solo : relancer une
   scène qui stagne (rebondissement) et simuler ce que font les
   PNJ/factions hors champ pendant que le personnage agit ailleurs
   (tour de faction) — remplacer les décisions qu'un MJ prendrait
   normalement à la volée. Combinées par js/core/intrigue.js.
   ============================================================ */
window.COF = window.COF || {};

/* ---------- Rebondissement ---------- */
COF.INTRIGUE_REBOND_NATURE = [
  'Trahison', 'Fausse piste', 'Retournement de situation', 'Révélation inattendue',
  'Complication soudaine', 'Aide inattendue', 'Ressource perdue', 'Délai raccourci',
  'Vérité cachée dévoilée', 'Un allié devient un obstacle', 'Un ennemi devient un allié temporaire',
  'Un innocent se retrouve impliqué', 'Le prix à payer augmente', 'Une occasion unique se présente',
  'Une menace tierce s\'invite', 'Le passé refait surface', 'Un secret est menacé d\'être découvert',
  'Les rôles s\'inversent', 'Un choix qui semblait sans conséquence en a une', 'Le temps presse soudain'
];
COF.INTRIGUE_REBOND_CIBLE = [
  'le commanditaire de la quête en cours', 'un allié proche du personnage',
  'l\'objectif principal de la quête', 'un lieu que le personnage connaît bien',
  'un objet en sa possession', 'une information qu\'il croyait acquise',
  'sa réputation', 'ses ressources (argent, matériel)', 'le temps dont il dispose',
  'un rival ou ennemi connu', 'un inconnu croisé récemment', 'une créature ou faction locale'
];
COF.INTRIGUE_REBOND_ORIGINE = [
  'Un témoin surgit et raconte tout, sans qu\'on le lui demande.',
  'Un document ou un objet le révèle par hasard.',
  'Une confrontation directe le met au jour.',
  'Une rumeur qui circulait en ville s\'avère fondée.',
  'Le personnage le découvre lui-même en fouillant ou en observant.',
  'Un allié le confesse spontanément, par culpabilité ou calcul.',
  'Cela se révèle au pire moment possible, en pleine action.',
  'Les événements s\'enchaînent sans qu\'aucune explication ne soit donnée sur le coup.',
  'Un présage, un rêve ou une vision l\'annonce avant que ça n\'arrive.',
  'Le personnage ne l\'apprend que trop tard pour agir à temps.'
];

/* ---------- Tour de faction (ce qui se passe hors champ) ---------- */
COF.INTRIGUE_FACTION_TYPES = [
  'Une guilde marchande', 'Un culte secret', 'La garnison ou l\'autorité locale',
  'Un groupe de hors-la-loi', 'Une famille noble rivale', 'Un réseau d\'espions ou d\'informateurs',
  'Une confrérie religieuse', 'Un cartel de contrebandiers', 'Une communauté d\'exilés ou de réfugiés',
  'Un ordre de chevaliers ou de gardiens', 'Un clan de créatures organisées (gobelins, orcs...)',
  'Un mage, érudit ou artisan isolé mais influent'
];
COF.INTRIGUE_FACTION_OBJECTIFS = [
  'étendre son influence sur la région', 'éliminer un rival gênant',
  'récupérer un objet ou un secret perdu', 'asseoir son autorité par la force',
  'amasser des richesses', 'se venger d\'un affront ancien', 'protéger un secret à tout prix',
  'recruter de nouveaux membres ou alliés', 'provoquer le chaos pour en tirer profit',
  'sceller une alliance stratégique avec un tiers'
];
COF.INTRIGUE_FACTION_ACTIONS = [
  'progresse discrètement vers son but, sans incident visible',
  'élimine ou neutralise un obstacle sur son chemin',
  'recrute un nouvel allié, agent ou complice',
  'subit un revers qui la ralentit ou l\'affaiblit',
  'se heurte à une faction rivale, provoquant des tensions locales',
  'fait une avancée majeure qui change la donne',
  'est démasquée ou repérée par quelqu\'un d\'inattendu',
  'tend un piège ou prépare une embuscade',
  'cherche à recruter, manipuler ou surveiller le personnage',
  'profite d\'un événement récent pour agir plus librement'
];
COF.INTRIGUE_FACTION_IMPACT = [
  'apprend aussitôt la nouvelle, par une rumeur ou un témoin direct.',
  'ne découvre tout cela que bien plus tard, par recoupement.',
  'ne le saura peut-être jamais, sauf à enquêter activement dans cette direction.',
  'en subit déjà les conséquences concrètes, sans forcément en connaître la cause.'
];
