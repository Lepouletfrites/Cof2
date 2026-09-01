/* ============================================================
   COF2 Compagnon — Données : vie & temps (rumeur, passage du
   temps, marchand). Trois petits outils pour meubler le quotidien
   d'une partie solo entre deux scènes importantes, combinés par
   js/core/solo.js.
   ============================================================ */
window.COF = window.COF || {};

/* ---------- Rumeur (sujet × détail × fiabilité) ---------- */
COF.SOLO_RUMEUR_SUJET = [
  'Un marchand récemment arrivé en ville', 'Une ruine ou un lieu abandonné des environs',
  'Un notable ou une figure d\'autorité locale', 'Une disparition récente',
  'Un trésor caché quelque part dans la région', 'Une créature qui rôderait dans les environs',
  'Un ancien crime jamais résolu', 'Une secte ou un culte discret',
  'Un événement surnaturel récent', 'Un personnage que le héros connaît déjà'
];
COF.SOLO_RUMEUR_DETAIL = [
  'serait lié(e) à un objet de grande valeur, trouvé, volé ou caché récemment.',
  'ne serait pas ce qu\'il ou elle prétend être.',
  'aurait un lien avec un événement tragique passé.',
  'cacherait quelque chose — ou quelqu\'un — en secret.',
  'serait surveillé(e) par quelqu\'un d\'influent.',
  'aurait disparu ou réapparu dans des circonstances étranges.',
  'dissimulerait un dangereux secret.',
  'serait maudit(e), ou porterait malchance à son entourage.',
  'attirerait l\'attention d\'individus peu recommandables.',
  'serait sur le point de changer, pour le meilleur ou pour le pire.'
];
COF.SOLO_RUMEUR_FIABILITE = [
  'Fondée : les faits rapportés sont exacts.',
  'Exagérée : le fond est vrai, mais largement amplifié.',
  'Déformée : des détails importants sont faux ou inversés.',
  'Fausse : pure invention, malveillante ou non.',
  'Périmée : c\'était vrai, mais ça ne l\'est plus.'
];

/* ---------- Passage du temps (durée × météo × événement) ---------- */
COF.SOLO_TEMPS_DUREE = [
  'Quelques heures', 'Une demi-journée', 'Une journée complète',
  'Plusieurs jours de suite', 'Une semaine entière'
];
COF.SOLO_TEMPS_METEO = [
  'Beau temps, ciel dégagé', 'Pluie fine et persistante', 'Brouillard épais, visibilité réduite',
  'Orage violent', 'Chaleur étouffante', 'Froid mordant', 'Chute de neige',
  'Vent violent et froid', 'Temps changeant, impossible à prévoir'
];
COF.SOLO_TEMPS_EVENEMENT = [
  'Rien de notable ne se produit durant ce laps de temps.',
  'Une rencontre fortuite survient (voir le générateur de Rencontre ou de Voyage).',
  'Un besoin matériel se fait sentir : nourriture, monture, équipement à renouveler.',
  'Une nouvelle circule et parvient aux oreilles du personnage (voir Rumeur).',
  'La situation évolue ailleurs, hors champ (voir Tour de faction).',
  'Un moment de répit bienvenu, sans complication.',
  'Une complication mineure retarde ou contrarie le personnage.',
  'Un rêve ou un pressentiment marquant laisse une impression durable.'
];

/* ---------- Marchand & négociation ---------- */
COF.SOLO_MARCHAND_ATTITUDES = [
  { id: 'hostile', nom: 'Hostile', poids: 1, achat: 0.5, vente: 1.6,
    note: "Refuse presque de traiter ; il faut le convaincre ou payer le prix fort." },
  { id: 'mefiant', nom: 'Méfiant', poids: 3, achat: 0.65, vente: 1.35,
    note: "Pose des questions sur la provenance des objets avant de discuter prix." },
  { id: 'neutre', nom: 'Neutre', poids: 5, achat: 0.8, vente: 1.1,
    note: "Traite normalement, sans état d'âme particulier." },
  { id: 'amical', nom: 'Amical', poids: 3, achat: 0.9, vente: 1.0,
    note: "Fait un effort sincère sur les prix, sans qu'on ait à insister." },
  { id: 'complice', nom: 'Complice', poids: 1, achat: 1.0, vente: 0.85,
    note: "Prêt à un vrai geste commercial, peut-être en échange d'un service rendu." }
];
COF.SOLO_MARCHAND_ARGUMENTS = [
  "Le marchand exige un petit service en plus de l'argent.",
  "Il propose un troc plutôt qu'une vente ou un achat en pièces sonnantes.",
  "Il ment légèrement sur la qualité ou l'origine de l'objet.",
  "Il cède si on le complimente ou flatte discrètement son ego.",
  "Il refuse de descendre son prix, mais offre un petit extra en compensation.",
  "Une seule tentative de négociation est tolérée, pas plus.",
  "Il se méfie et demande une preuve de bonne foi avant de conclure.",
  "Il est pressé et bâcle la transaction sans vraiment négocier.",
  "Un tiers intervient dans la discussion et complique la donne.",
  "Il se souvient d'une précédente transaction avec le personnage, bonne ou mauvaise."
];
