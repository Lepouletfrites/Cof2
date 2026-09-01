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
  { id: 'armure', nom: 'Armure', armure: true, def: 3 },
  { id: 'bouclier', nom: 'Bouclier', armure: true, def: 1 },
  { id: 'anneau', nom: 'Anneau' },
  { id: 'amulette', nom: 'Amulette' },
  { id: 'baton', nom: 'Bâton' },
  { id: 'cape', nom: 'Cape' },
  { id: 'couronne', nom: 'Couronne' },
  { id: 'grimoire', nom: 'Grimoire' },
  { id: 'parchemin', nom: 'Parchemin' }
];

COF.TRESOR_TIERS = [
  { id: 'mineur', nom: 'Mineur', niveau: 'niveaux 1-5', poids: 5, nbPouvoirs: 1, prixMin: 50, prixMax: 200 },
  { id: 'majeur', nom: 'Majeur', niveau: 'niveaux 6-11', poids: 3, nbPouvoirs: 2, prixMin: 400, prixMax: 1200 },
  { id: 'legendaire', nom: 'Légendaire', niveau: 'niveau 12+', poids: 1, nbPouvoirs: 2, prixMin: 2000, prixMax: 6000 }
];

/* Noms composés à la manière d'un objet unique (« Sombrelame », « Aubécœur »). */
COF.TRESOR_NOM_PREFIXES = [
  'Fang', 'Sombre', 'Aube', 'Glace', 'Brume', 'Flamme', 'Nuit', 'Sang', 'Lune',
  'Fer', 'Cendre', 'Astre', 'Ombre', 'Givre', 'Orage', 'Ronce', 'Ciel', 'Vent'
];
COF.TRESOR_NOM_SUFFIXES = [
  'dent', 'lame', 'cœur', 'griffe', 'ombre', 'étoile', 'ronce', 'ciel', 'brise',
  'flamme', 'écaille', 'épine', 'garde', 'chant', 'souffle'
];
/* Épithètes pour le patron « [Type] de/du/des X ». */
COF.TRESOR_EPITHETES = [
  "l'Aube", 'la Nuit Éternelle', "l'Orage", 'la Vengeance', "l'Oubli",
  'la Dernière Larme', "l'Étoile Filante", 'la Morsure du Serpent', 'le Sang-Froid',
  'la Colère des Anciens', "l'Écho du Passé", 'la Flamme Éternelle', 'le Silence',
  'les Âmes Perdues', 'le Crépuscule', 'la Promesse Brisée', 'le Dernier Soupir',
  'la Foi Trahie', "l'Aurore Noire", 'le Roi Oublié'
];
/* Adjectifs pour le patron « [Type] [Adjectif] », accordés m/f. */
COF.TRESOR_ADJ_M = ['Maudit', 'Sacré', 'Ancien', 'Oublié', 'Brisé', 'Éternel', 'Silencieux', 'Vengeur', 'Immaculé', 'Déchu'];
COF.TRESOR_ADJ_F = ['Maudite', 'Sacrée', 'Ancienne', 'Oubliée', 'Brisée', 'Éternelle', 'Silencieuse', 'Vengeresse', 'Immaculée', 'Déchue'];

COF.TRESOR_POUVOIRS = [
  "+1 aux jets d'attaque et de dégâts avec cet objet (+2 en majeur, +3 en légendaire)",
  "Une fois par jour, inflige un dégât élémentaire supplémentaire (feu, froid ou foudre au choix)",
  "Le porteur regagne 1d6 PV au lever du jour",
  "Confère une résistance à un type de dégâts au choix (dégâts réduits de moitié)",
  "Une fois par jour, permet de relancer un jet d'attaque ou de sauvegarde raté",
  "Émet sur commande une lumière vive dans un rayon de 10 m",
  "Le porteur comprend toute langue parlée à moins de 5 m",
  "Une fois par combat, +5 à un jet d'attaque ou de dégâts",
  "Confère un avantage constant sur un domaine de test au choix (discrétion, persuasion, escalade...)",
  "Permet de communiquer par télépathie avec un être désigné à la création de l'objet",
  "Une fois par jour, absorbe entièrement les dégâts d'une seule attaque",
  "Le porteur ne ressent plus la peur face à un type de créature désigné",
  "+1 à la DEF du porteur (+2 en majeur, +3 en légendaire), cumulable avec l'armure",
  "Une fois par jour, soigne 2d8+4 PV à son porteur ou à une cible touchée",
  "Le porteur ne peut être pris par surprise",
  "Une fois par semaine, ouvre un passage instantané vers un lieu lié à l'objet",
  "Rend son porteur immunisé au poison",
  "Une fois par jour, charme brièvement une créature qui échoue à un test de Volonté"
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
  "Offert par une créature surnaturelle en échange d'un service jamais rendu."
];

COF.TRESOR_MALEDICTIONS = [
  "Chuchote la nuit, empêchant tout repos réparateur à son porteur.",
  "Refuse d'être lâché une fois empoigné, sauf rituel de dissolution.",
  "Attire immanquablement l'attention des créatures maléfiques proches.",
  "Rend son porteur incapable de mentir tant qu'il le porte.",
  "Draine 1 PV chaque jour tant que son porteur le garde sur lui.",
  "Provoque des cauchemars récurrents liés à son ancien propriétaire.",
  "Rend son porteur irritable et prompt à la colère.",
  "Impossible de s'en séparer volontairement sans une cérémonie spécifique."
];
