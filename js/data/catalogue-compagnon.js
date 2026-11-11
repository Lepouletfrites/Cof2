/* ============================================================
   COF2 Compagnon — Catalogue des objets des voies de recettes
   (Compagnon du joueur, chapitre 5). Tous les objets magiques,
   de qualité ou exotiques du livre qui ne sont pas déjà couverts
   par l'atelier d'arme magique : munitions et accessoires d'armes,
   armures et boucliers, objets divers, potions.
   Champs : n nom · g groupe · v voie · r rang · t type
   (base | propriété | objet) · niv niveau requis (« +N » = s'ajoute
   à la base) · prix matières premières en pa (« +N » idem) · tests ·
   nm niveau de magie · d description · def/slot pour une armure ou
   un bouclier ajoutable à la fiche.
   ============================================================ */
window.COF = window.COF || {};

COF.CATALOGUE_GROUPES = [
  { id: 'armes', nom: 'Munitions et accessoires d’armes' },
  { id: 'armures', nom: 'Armures et boucliers' },
  { id: 'divers', nom: 'Objets divers' },
  { id: 'potions', nom: 'Potions et décoctions' }
];

COF.CATALOGUE_COMPAGNON = [

  /* ================= Accessoires d'armes ================= */
  { g: 'armes', v: 'Voie des dagues', r: 1, t: 'base', n: 'Miséricorde', niv: '1', prix: '30', tests: 'forge 15, façonnage 10', nm: 0,
    d: "Dague de qualité : contre une victime étourdie, paralysée, renversée, immobilisée ou surprise, 1d4° DM (dé explosif) au lieu de 1d4. Remplace le +1 de qualité ; peut ensuite être enchantée." },
  { g: 'armes', v: 'Voies des lames et des haches', r: 1, t: 'objet', n: 'Pierre à affûter magique', niv: '1', prix: '200', tests: 'lapidage 20, forge 10', nm: 0,
    d: "5 utilisations. 10 min pour affûter une arme : plage de critique +1 jusqu'au prochain critique. Sans effet sur une arme déjà affûtée." },
  { g: 'armes', v: 'Voie des arcs', r: 1, t: 'base', n: 'Flèches de qualité (×10)', niv: '1', prix: '10', tests: 'forge 17, façonnage 17', nm: 0,
    d: "+1 DM (non cumulable avec un arc magique)." },
  { g: 'armes', v: 'Voie des arcs', r: 2, t: 'base', n: 'Flèches magiques (×10)', niv: '3 / 6 / 9 / 12 / 15', prix: '100 / 400 / 900 / 1 600 / 2 500', tests: 'façonnage 17-22, forge 17-22, lapidage 13-18', nm: '1 à 5',
    d: "Flèches +1 à +5. Avec un arc magique, seul le plus haut bonus s'applique et la portée gagne +10 m par point du plus faible. Les elfes sylvains peuvent remplacer la forge par l'alchimie." },
  { g: 'armes', v: 'Voie des arcs', r: 2, t: 'objet', n: 'Carquois de flèches illimitées', niv: '7', prix: '300', tests: 'alchimie 20, façonnage 15', nm: 1,
    d: "Contient toujours 12 flèches ordinaires (se remplit seul). +2 en Init. pour tirer à l'arc." },
  { g: 'armes', v: 'Voie des arcs', r: 3, t: 'propriété', n: 'Flèches équilibrées (×10)', niv: '+2', prix: '+300', tests: 'façonnage et forge +3', nm: 0,
    d: "Plage de critique réduite de 1, portée +50 % (cumulable avec un arc puissant)." },
  { g: 'armes', v: 'Voie des arcs', r: 4, t: 'objet', n: 'Carquois de rapidité', niv: '12', prix: '9 000', tests: 'alchimie 20, façonnage 20', nm: 3,
    d: "Les flèches apparaissent sur l'arc bandé : une flèche supplémentaire par round en action gratuite." },
  { g: 'armes', v: 'Voie des arbalètes', r: 1, t: 'base', n: 'Carreaux de qualité (×10)', niv: '1', prix: '10', tests: 'forge 15, façonnage 15', nm: 0,
    d: "+1 DM (non cumulable avec une arbalète magique)." },
  { g: 'armes', v: 'Voie des arbalètes', r: 2, t: 'base', n: 'Carreaux magiques (×10)', niv: '3 / 6 / 9 / 12 / 15', prix: '100 / 400 / 900 / 1 600 / 2 500', tests: 'façonnage 17-22, forge 17-22, lapidage 10-15', nm: '1 à 5',
    d: "Carreaux +1 à +5 (même règle de non-cumul que les flèches)." },
  { g: 'armes', v: 'Voie des arbalètes', r: 3, t: 'propriété', n: 'Carreaux de précision (×10)', niv: '+2', prix: '+300', tests: 'façonnage et forge +3', nm: 0,
    d: "Au choix : critique +1 et portée +50 %, ou PER aux DM jusqu'à portée nominale (cumulable avec l'autre effet sur l'arbalète)." },
  { g: 'armes', v: 'Voie des arbalètes', r: 3, t: 'propriété', n: 'Carreaux perce-armure (×10)', niv: '+2', prix: '+400', tests: 'forge +5', nm: 0,
    d: "Dé bonus en attaque contre une armure métallique ou une créature cuirassée ; portée -10 m." },
  { g: 'armes', v: 'Voie des armes à poudre', r: 1, t: 'base', n: 'Cartouches de qualité (×10)', niv: '1', prix: '20', tests: 'forge 15, façonnage 15, alchimie 20', nm: 0,
    d: "+1 DM (non cumulable avec une arme à poudre magique)." },
  { g: 'armes', v: 'Voie des armes à poudre', r: 1, t: 'objet', n: 'Feux d’artifice', niv: '1', prix: '10 / 30 / 100 (magique : 200)', tests: 'alchimie 10 / 12 / 15 (magique : 20)', nm: 0,
    d: "Petits, moyens ou grands ; les feux magiques dessinent des motifs dans le ciel (épée, dragon…). Un arquebusier peut utiliser son bonus d'artificier." },
  { g: 'armes', v: 'Voie des armes à poudre', r: 2, t: 'base', n: 'Cartouches magiques (×10)', niv: '3 / 6 / 9 / 12 / 15', prix: '100 / 400 / 900 / 1 600 / 2 500', tests: 'alchimie 20-25, forge 15-20, lapidage 15-20', nm: '1 à 5',
    d: "Cartouches +1 à +5 (même règle de non-cumul que les flèches)." },
  { g: 'armes', v: 'Voie des armes à poudre', r: 3, t: 'propriété', n: 'Cartouches explosives (×10)', niv: '+2', prix: '+600', tests: 'alchimie +5, forge +3', nm: 0,
    d: "Portée divisée par deux ; moitié des DM à toutes les cibles dans un rayon de 3 m autour du point d'impact (sans test d'attaque)." },
  { g: 'armes', v: 'Voie des armes à poudre', r: 3, t: 'propriété', n: 'Cartouches tonnerre (×10)', niv: '+2', prix: '+400', tests: 'alchimie +5', nm: 0,
    d: "La cible touchée est sourde 1 round ; un animal doit réussir un test de CON difficulté 15 ou fuir le combat (immunisé après une réussite)." },

  /* ================= Armures et boucliers ================= */
  { g: 'armures', v: 'Voie des armures de cuir', r: 1, t: 'base', n: 'Armure de cuir de qualité', niv: '1', prix: '50', tests: 'façonnage 20', nm: 0, def: 2, slot: 'armure',
    d: "Cuir ou cuir renforcé : pénalité d'encombrement réduite de 1." },
  { g: 'armures', v: 'Voie des armures de cuir', r: 1, t: 'objet', n: 'Renfort d’armure de cuir', niv: '1', prix: '50', tests: 'alchimie 15, façonnage 15 (fixation : façonnage 15, 10 min)', nm: 0,
    d: "Retranche 5 DM d'un coup critique, puis est détruit. Non cumulable avec la propriété défense. Peut se prélever sur une créature vaincue (façonnage 20)." },
  { g: 'armures', v: 'Voie des armures de cuir', r: 2, t: 'base', n: 'Armure de cuir magique', niv: '3 / 6 / 9 / 12 / 15', prix: '1 000 / 4 000 / 9 000 / 16 000 / 25 000', tests: 'façonnage 20-24, forge 17-22 (cuir renforcé seulement), lapidage 10-15', nm: '1 à 5',
    d: "Armure +1 à +5 (bonus ajouté à la DEF de l'armure)." },
  { g: 'armures', v: 'Voie des armures de cuir', r: 3, t: 'propriété', n: 'Propriété spéciale (cuir)', niv: '+3', prix: '+5 000', tests: 'alchimie et façonnage +3', nm: 1,
    d: "Une propriété (+1 par point d'INT de l'artisan) parmi action libre, défense, natation, ombre, protection, résistance à la magie, acrobatie (+3 en acrobatie, escalade, équilibre ; DM de chute divisés par 2) et voyage (+3 contre chaleur et froid naturels et en survie pour progresser en milieu hostile)." },
  { g: 'armures', v: 'Voie des armures de cuir', r: 4, t: 'propriété', n: 'Résistance aux éléments (cuir)', niv: '+5', prix: '+8 000', tests: 'alchimie et façonnage +5', nm: 1,
    d: "Divise par 2 les DM d'un élément (feu, froid, acide, électricité ou poison)." },
  { g: 'armures', v: 'Voie des armures de cuir', r: 4, t: 'propriété', n: 'Armure de respiration aquatique', niv: '+6', prix: '+10 000', tests: 'alchimie et façonnage +5', nm: 2,
    d: "+5 aux tests de natation ; 1×/jour, respire sous l'eau 10 min par point de bonus magique." },
  { g: 'armures', v: 'Voie des armures de cuir', r: 5, t: 'propriété', n: 'Défense supérieure (cuir)', niv: '+6', prix: '+10 000', tests: 'alchimie et façonnage +5, forge 20', nm: 2,
    d: "RD 4." },
  { g: 'armures', v: 'Voie des armures de cuir', r: 5, t: 'propriété', n: 'Armure de changeforme', niv: '+NC', prix: '1 000 × NC', tests: 'alchimie et façonnage +NC', nm: 'NC',
    d: "Taillée dans le cuir d'une créature : 1×/jour, en action limitée, prend sa forme pendant [CON ou VOL] minutes (garde ses PV, INT et VOL). NC divisé par 2 pour une durée en rounds ; NC < 1 : durée en heures mais fabriquée comme NC 4." },

  { g: 'armures', v: 'Voie des armures de mailles', r: 1, t: 'base', n: 'Armure de mailles de qualité', niv: '1', prix: '50', tests: 'forge 20, façonnage 15 (chemise) ou 17 (cotte)', nm: 0, def: 5, slot: 'armure',
    d: "Chemise ou cotte de mailles : pénalité d'encombrement réduite de 1. (Ajoutée comme cotte de mailles ; ajustez la DEF à 4 pour une chemise.)" },
  { g: 'armures', v: 'Voie des armures de mailles', r: 1, t: 'objet', n: 'Renfort d’armure de mailles', niv: '1', prix: '70', tests: 'alchimie 15, forge 17 (fixation : façonnage 15)', nm: 0,
    d: "Retranche 7 DM d'un coup critique, puis est détruit. Non cumulable avec la propriété défense." },
  { g: 'armures', v: 'Voie des armures de mailles', r: 2, t: 'base', n: 'Armure de mailles magique', niv: '3 / 6 / 9 / 12 / 15', prix: '1 000 / 4 000 / 9 000 / 16 000 / 25 000', tests: 'façonnage 15-20 (+2 pour une cotte), forge 20-24, lapidage 17-22', nm: '1 à 5',
    d: "Chemise ou cotte de mailles +1 à +5." },
  { g: 'armures', v: 'Voie des armures de mailles', r: 3, t: 'propriété', n: 'Propriété spéciale (mailles)', niv: '+3', prix: '+5 000', tests: 'alchimie, façonnage et forge +2', nm: 1,
    d: "Une propriété (+1 par point d'INT) parmi action libre, défense, natation, ombre, protection, résistance à la magie, acrobatie et voyage (ombre, voyage et acrobatie : chemise de mailles uniquement)." },
  { g: 'armures', v: 'Voie des armures de mailles', r: 4, t: 'propriété', n: 'Résistance aux éléments (mailles)', niv: '+5', prix: '+8 000', tests: 'alchimie, façonnage et forge +3', nm: 1,
    d: "Divise par 2 les DM d'un élément." },
  { g: 'armures', v: 'Voie des armures de mailles', r: 4, t: 'objet', n: 'Camail magique', niv: '7', prix: '2 000', tests: 'alchimie 15, façonnage 18, forge 18', nm: 1,
    d: "Cagoule de mailles : annule les effets d'un critique d'arme tranchante 1×/combat (DM ordinaires)." },
  { g: 'armures', v: 'Voie des armures de mailles', r: 5, t: 'propriété', n: 'Défense supérieure (mailles)', niv: '+6', prix: '+10 000', tests: 'alchimie, façonnage et forge +5', nm: 2,
    d: "RD 4." },
  { g: 'armures', v: 'Voie des armures de mailles', r: 5, t: 'propriété', n: 'Armure des chaînes', niv: '+5', prix: '+10 000', tests: 'alchimie, façonnage et forge +3, lapidage 18', nm: 2,
    d: "+5 aux manœuvres bloquer, désarmer, gêner et renverser. 1×/combat en action limitée : +5 en DEF 1 round et 2d4° DM à tous les adversaires à 3 m." },

  { g: 'armures', v: 'Voie des armures de plaques', r: 1, t: 'base', n: 'Armure de plaques de qualité', niv: '1', prix: '100 (200 pour une complète)', tests: 'forge 20, façonnage 15 (18 pour une complète)', nm: 0, def: 6, slot: 'armure',
    d: "Pénalité d'encombrement réduite de 1. Peut être taillée dans une carapace ou de la chitine (+10 % de coût, difficultés de forge et de façonnage inversées)." },
  { g: 'armures', v: 'Voie des armures de plaques', r: 1, t: 'objet', n: 'Renfort d’armure de plaques', niv: '1', prix: '100', tests: 'alchimie 15, forge 18 (fixation : façonnage 15)', nm: 0,
    d: "Retranche 10 DM d'un coup critique, puis est détruit. Non cumulable avec la propriété défense." },
  { g: 'armures', v: 'Voie des armures de plaques', r: 2, t: 'base', n: 'Armure de plaques magique', niv: '3 / 6 / 9 / 12 / 15', prix: '1 000 / 4 000 / 9 000 / 16 000 / 25 000', tests: 'façonnage 15-20 (+3 pour une complète), forge 20-24, lapidage 18-23', nm: '1 à 5',
    d: "Armure de plaques (ou complète) +1 à +5." },
  { g: 'armures', v: 'Voie des armures de plaques', r: 3, t: 'propriété', n: 'Propriété spéciale (plaques)', niv: '+3', prix: '+5 000', tests: 'alchimie, façonnage et forge +2', nm: 1,
    d: "Une propriété (+1 par point d'INT) parmi action libre, défense, mobile, natation, protection, résistance à la magie, voyage (pas sur une complète) et solide (RD 4 contre les DM contondants, cumulable avec défense)." },
  { g: 'armures', v: 'Voie des armures de plaques', r: 4, t: 'propriété', n: 'Résistance aux éléments (plaques)', niv: '+5', prix: '+8 000', tests: 'alchimie, façonnage et forge +3', nm: 1,
    d: "Divise par 2 les DM d'un élément." },
  { g: 'armures', v: 'Voie des armures de plaques', r: 4, t: 'objet', n: 'Heaume magique', niv: '9', prix: '3 000', tests: 'alchimie 15, façonnage 18, forge 20', nm: 1,
    d: "Annule les effets d'un critique d'arme tranchante ou perforante 1×/combat (DM ordinaires)." },
  { g: 'armures', v: 'Voie des armures de plaques', r: 5, t: 'propriété', n: 'Défense supérieure (plaques)', niv: '+6', prix: '+10 000', tests: 'alchimie, façonnage et forge +5', nm: 2,
    d: "RD 4." },
  { g: 'armures', v: 'Voie des armures de plaques', r: 5, t: 'propriété', n: 'Armure cubique', niv: '+5', prix: '+8 000', tests: 'façonnage et forge +3, lapidage 20', nm: 1,
    d: "Se replie en un cube de 50 cm. Pénalité d'encombrement -2, AGI max +1. Liée après une récupération rapide au contact ; se déploie sur son porteur (20 m) sur un mot de commande (action de mouvement)." },

  { g: 'armures', v: 'Voie des boucliers', r: 1, t: 'base', n: 'Bouclier d’attaque', niv: '1', prix: '20', tests: 'forge 20, façonnage 15', nm: 0, def: 1, slot: 'bouclier',
    d: "Pointe ou bord tranchant (1d4 + FOR) : 1×/combat, attaque gratuite après une attaque ratée de la main principale." },
  { g: 'armures', v: 'Voie des boucliers', r: 1, t: 'base', n: 'Bouclier brise-lame', niv: '1', prix: '20', tests: 'forge 20, façonnage 20', nm: 0, def: 1, slot: 'bouclier',
    d: "1×/combat, après une attaque ratée contre lui : test opposé de FOR pour désarmer ; de 10 points ou plus, brise une lame non magique à une main." },
  { g: 'armures', v: 'Voie des boucliers', r: 2, t: 'base', n: 'Bouclier magique', niv: '3 / 6 / 9 / 12 / 15', prix: '1 000 / 4 000 / 9 000 / 16 000 / 25 000', tests: 'façonnage 15-20, forge 20-24, lapidage 18-23', nm: '1 à 5',
    d: "Bouclier +1 à +5." },
  { g: 'armures', v: 'Voie des boucliers', r: 3, t: 'propriété', n: 'Bouclier de lancer', niv: '+3', prix: '+2 000', tests: 'façonnage et forge +3, lapidage 20', nm: 1,
    d: "Lancé à 10 m (action d'attaque, attaque à distance) : 1d4° + FOR DM (+ bonus magique), puis revient sur le bras." },
  { g: 'armures', v: 'Voie des boucliers', r: 3, t: 'propriété', n: 'Bouclier de transport', niv: '+2', prix: '+1 000', tests: 'façonnage et forge +2, alchimie 18', nm: 0,
    d: "Lévite à 1 m et suit son porteur en portant 200 kg, 1×/jour par point de bonus, pendant 1d4° h." },
  { g: 'armures', v: 'Voie des boucliers', r: 4, t: 'propriété', n: 'Bouclier de protection', niv: '+4', prix: '+4 000', tests: 'façonnage et forge +3, lapidage 18', nm: 1,
    d: "Grand bouclier : +2 en DEF contre les projectiles et RD 5 contre les souffles et attaques de zone (sauf surpris)." },
  { g: 'armures', v: 'Voie des boucliers', r: 4, t: 'propriété', n: 'Bouclier de lévitation', niv: '+4', prix: '+3 000', tests: 'façonnage et forge +3, alchimie 18', nm: 2,
    d: "Permet de monter dessus et de léviter (vertical, 10 m par mouvement, 200 kg), 1×/jour par point de bonus, pendant 1d4° min." },
  { g: 'armures', v: 'Voie des boucliers', r: 5, t: 'propriété', n: 'Bouclier volant', niv: '+6', prix: '+10 000', tests: 'façonnage et forge +5, alchimie 20', nm: 3,
    d: "Vol dans toutes les directions (10 m par mouvement, 200 kg), 1×/jour par point de bonus, pendant 1d4° min." },
  { g: 'armures', v: 'Voie des boucliers', r: 5, t: 'propriété', n: 'Bouclier de champ de force', niv: '+6', prix: '+8 000', tests: 'façonnage et forge +3, lapidage 20', nm: 2,
    d: "1×/combat, en action gratuite : hémisphère de 5 m qui protège le porteur et ceux à son contact de tous les DM physiques d'une attaque (test opposé d'Init. si l'attaquant est plus rapide ; 1 PC possible)." }
];

/* ================= Objets divers ================= */
COF.CATALOGUE_COMPAGNON.push(
  /* --- Anneaux (un seul par main) --- */
  { g: 'divers', v: 'Voie des anneaux', r: 1, t: 'objet', n: 'Anneau de chute ralentie', niv: '3', prix: '1 500', tests: 'forge 18, lapidage 18', nm: 1,
    d: "En chute, descend de 10 m par action de mouvement et atterrit sans DM." },
  { g: 'divers', v: 'Voie des anneaux', r: 1, t: 'objet', n: 'Anneau de poigne électrique', niv: '5', prix: '4 000', tests: 'forge 18, lapidage 20', nm: 2,
    d: "1×/combat, en action gratuite : +2d4° DM d'électricité sur une attaque au contact réussie (mains nues ou arme métallique)." },
  { g: 'divers', v: 'Voie des anneaux', r: 2, t: 'objet', n: 'Anneau de protection', niv: '3 / 6 / 9 / 12 / 15', prix: '1 000 / 4 000 / 9 000 / 16 000 / 25 000', tests: 'forge 20-25, lapidage 18-22', nm: '1 à 5',
    d: "Ajoute son bonus (+1 à +5) en DEF." },
  { g: 'divers', v: 'Voie des anneaux', r: 3, t: 'objet', n: 'Anneau de mana', niv: '3 / 6 / 9 / 12 / 15', prix: '1 000 / 4 000 / 9 000 / 16 000 / 25 000', tests: 'alchimie 20-25, forge 20-25', nm: '1 par 3 PM',
    d: "Contient autant de PM que son bonus (+1 à +5), récupérés après une récupération complète. Prérequis : connaître la recette de la potion de mana." },
  { g: 'divers', v: 'Voie des anneaux', r: 4, t: 'objet', n: 'Anneau de télékinésie', niv: '9', prix: '9 000', tests: 'forge 21, lapidage 21', nm: 3,
    d: "Sort Télékinésie (ensorceleur, voie de l'air, rang 3) à volonté." },
  { g: 'divers', v: 'Voie des anneaux', r: 4, t: 'objet', n: 'Anneau de régénération', niv: '12', prix: '18 000', tests: 'alchimie 20, forge 21, lapidage 21', nm: 4,
    d: "+1d6 PV par récupération rapide ou complète ; fait repousser un membre en une récupération complète (blessures subies en le portant uniquement)." },
  { g: 'divers', v: 'Voie des anneaux', r: 5, t: 'objet', n: 'Anneau d’invisibilité', niv: '7 (majeur : 12)', prix: '5 000 (majeur : 20 000)', tests: 'alchimie 15/18, forge 20/22, lapidage 22/24', nm: '2 (majeur : 4)',
    d: "Invisibilité (magicien, rang 3) 1×/jour, ou 1×/combat pour la version majeure. Requiert le sang d'une créature capable de se rendre invisible." },
  { g: 'divers', v: 'Voie des anneaux', r: 5, t: 'objet', n: 'Anneau de souhaits', niv: '15', prix: '25 000', tests: 'forge 20, lapidage 25', nm: 5,
    d: "Trois souhaits (capacité Souhait, voie de la magie des mots), puis perd sa magie." },

  /* --- Bâtons de mage --- */
  { g: 'divers', v: 'Voie des bâtons de mage', r: 1, t: 'objet', n: 'Bâton de marche', niv: '3', prix: '1 500', tests: 'alchimie 15, façonnage 18', nm: 1,
    d: "+2 km par période de marche ; ignore la pénalité de terrain difficile 10 min par jour." },
  { g: 'divers', v: 'Voie des bâtons de mage', r: 2, t: 'objet', n: 'Bâton serpent', niv: '6', prix: '5 000', tests: 'alchimie 15, façonnage 15, forge 16, lapidage 18', nm: 2,
    d: "Bâton +1 : devient un serpent venimeux 1×/combat ou un constricteur 1×/jour (action de mouvement, 10 min, ordres simples). À 0 PV, revient vers son maître puis redevient bâton." },
  { g: 'divers', v: 'Voie des bâtons de mage', r: 2, t: 'objet', n: 'Bâton serpent majeur', niv: '10', prix: '15 000', tests: 'alchimie 18, façonnage 16, forge 17, lapidage 20', nm: 3,
    d: "Bâton +2 : constricteur 1×/combat, serpent géant 1×/jour. Artisan avec INT ou PER +2." },
  { g: 'divers', v: 'Voie des bâtons de mage', r: 3, t: 'objet', n: 'Bâton élémentaire', niv: '8', prix: '9 000', tests: 'alchimie 18, façonnage 18, lapidage 20', nm: 3,
    d: "Feu, froid, foudre ou acide : +2 en attaque magique et +1d4° DM aux sorts de cet élément ; DM de l'élément subis divisés par 2 ; 1 PM pour convertir l'élément d'un autre sort." },
  { g: 'divers', v: 'Voie des bâtons de mage', r: 4, t: 'objet', n: 'Bâton de mana', niv: '10', prix: '20 000', tests: 'alchimie 23, lapidage 25', nm: 4,
    d: "Bâton de cristal +2 (attaque magique, contact et DM) : Projectile de mana gratuit 3×/combat (+1d4° si déjà connu), Mur de mana 1×/jour planté au sol ([VOL] min), Armure de mana +1 en DEF." },
  { g: 'divers', v: 'Voie des bâtons de mage', r: 5, t: 'objet', n: 'Bâton d’archimage', niv: '17', prix: '50 000', tests: 'alchimie 25, façonnage 20, lapidage 25', nm: 8,
    d: "Bâton +4 (attaque magique, contact et DM) et +4 en DEF. Un mage peut lancer tout sort d'ensorceleur ou de magicien de rang ≤ 4 pour +2 PM (rangs 1-2 : 1×/combat ; 3-4 : 1×/jour). Brisé : 6d4° DM de feu + 6d4° contondants à 10 m, FOR 15 ou renversé." },

  /* --- Baguettes magiques --- */
  { g: 'divers', v: 'Voie des baguettes magiques', r: 1, t: 'objet', n: 'Baguette de sourcier', niv: '5', prix: '1 500', tests: 'alchimie 18, façonnage 18', nm: 1,
    d: "Indique la source d'eau la plus proche (5 km). Variante naine en métal (forge) : filons d'or ou trésor ≥ 20 po à 500 m." },
  { g: 'divers', v: 'Voie des baguettes magiques', r: 2, t: 'objet', n: 'Baguette de sort', niv: '3 / 6 / 9', prix: '1 000 / 4 000 / 9 000', tests: 'alchimie 17-20, façonnage 15-19 (forge si en métal), lapidage 18-20', nm: 'rang du sort',
    d: "Baguette vierge pour un sort de rang 1, 2 ou 3, à imprimer par un lanceur dans les 24 h : 20 + 1d20 charges, une charge par combat ; se brise à 0 charge." },
  { g: 'divers', v: 'Voie des baguettes magiques', r: 3, t: 'objet', n: 'Baguette de rouille', niv: '7', prix: '3 000', tests: 'alchimie 18, forge 18, lapidage 20', nm: 2,
    d: "1×/combat (action d'attaque) : rayon à 20 m ou contact, attaque magique contre la DEF : un objet de métal non magique rouille et se brise au moindre choc." },
  { g: 'divers', v: 'Voie des baguettes magiques', r: 4, t: 'objet', n: 'Baguettes de tambour', niv: '9', prix: '6 000', tests: 'alchimie 20, façonnage 20, lapidage 18', nm: 3,
    d: "Paire en os : 1×/jour (action limitée), un rythme fantomatique fait surgir des squelettes au round suivant, comme Armée des morts." },
  { g: 'divers', v: 'Voie des baguettes magiques', r: 5, t: 'objet', n: 'Baguette de métamorphose', niv: '15', prix: '15 000', tests: 'alchimie 24, façonnage 20, lapidage 22', nm: 4,
    d: "1×/combat : Métamorphose d'autrui limitée à l'animal choisi à la fabrication (grenouille ou mouton)." },

  /* --- Bottes --- */
  { g: 'divers', v: 'Voie des bottes', r: 1, t: 'objet', n: 'Bottes de silence', niv: '3', prix: '1 000', tests: 'alchimie 17, façonnage 18', nm: 1, d: "+5 aux tests pour se déplacer en silence." },
  { g: 'divers', v: 'Voie des bottes', r: 1, t: 'objet', n: 'Bottes de saut', niv: '3', prix: '1 000', tests: 'alchimie 17, façonnage 18', nm: 1, d: "+5 aux tests de saut." },
  { g: 'divers', v: 'Voie des bottes', r: 2, t: 'objet', n: 'Bottes de rapidité mineures', niv: '6', prix: '5 000', tests: 'alchimie 20, façonnage 20', nm: 2, d: "+5 m à chaque action de mouvement." },
  { g: 'divers', v: 'Voie des bottes', r: 2, t: 'objet', n: 'Bottes de rapidité majeures', niv: '12', prix: '15 000', tests: 'alchimie 23, façonnage 23', nm: 4, d: "Une action de mouvement supplémentaire par round, uniquement pour se déplacer." },
  { g: 'divers', v: 'Voie des bottes', r: 3, t: 'objet', n: 'Bottes de lévitation', niv: '6', prix: '4 000', tests: 'alchimie 22, façonnage 19', nm: 2, d: "Lévitation 3×/jour (action de mouvement ; durée sur la CON ou la VOL)." },
  { g: 'divers', v: 'Voie des bottes', r: 3, t: 'objet', n: 'Bottes de marche sur l’eau', niv: '9', prix: '10 000', tests: 'alchimie 22, façonnage 22', nm: 3, d: "1×/jour, marche sur l'eau 10 min par point de VOL ou de CON." },
  { g: 'divers', v: 'Voie des bottes', r: 4, t: 'objet', n: 'Bottes de sept lieues', niv: '10', prix: '15 000', tests: 'alchimie 23, façonnage 24', nm: 4, d: "Triple la distance de chaque période de marche ; sauts de 5 m en hauteur, 10 m (20 m avec élan) en longueur." },
  { g: 'divers', v: 'Voie des bottes', r: 4, t: 'objet', n: 'Bottes de scolopendre', niv: '12', prix: '18 000', tests: 'alchimie 24, façonnage 24', nm: 4, d: "Marche et court sur les murs et les plafonds en permanence (renversé : chute)." },
  { g: 'divers', v: 'Voie des bottes', r: 5, t: 'objet', n: 'Bottes ailées', niv: '8 / 12 / 16', prix: '8 000 / 15 000 / 25 000', tests: 'alchimie 23-25, façonnage 23-25', nm: '3 / 4 / 5', d: "Vol (magicien, rang 4) 1×/jour, 3×/jour ou à volonté selon le modèle ; durée sur la CON ou la VOL." },

  /* --- Bracelets --- */
  { g: 'divers', v: 'Voie des bracelets', r: 1, t: 'objet', n: 'Bracelets de détonation', niv: '5', prix: '3 000', tests: 'alchimie 18, forge 18', nm: 2, d: "1×/combat : Attaque sonore (barde, rang 3), DM sur la VOL ou la CON." },
  { g: 'divers', v: 'Voie des bracelets', r: 2, t: 'objet', n: 'Bracelets de défense', niv: '3 / 6 / 9 / 12', prix: '2 000 / 5 000 / 9 000 / 15 000', tests: 'forge 21-25, lapidage 19-22', nm: 'DEF - 1', def: 2, slot: 'armure',
    d: "Comptent comme une armure de DEF +2 à +5 (non cumulables avec une armure ou un autre objet de DEF). Ajoutés à la fiche en DEF +2 : ajustez selon le modèle." },
  { g: 'divers', v: 'Voie des bracelets', r: 3, t: 'objet', n: 'Bracelets d’archer', niv: '6', prix: '5 000', tests: 'alchimie 20, façonnage 20', nm: 2, d: "Si l'arc est maîtrisé : portée +10 m, plage de critique +1, dé de DM explosif." },
  { g: 'divers', v: 'Voie des bracelets', r: 4, t: 'objet', n: 'Brassards de constitution', niv: '9 (+2 : 15)', prix: '9 000 (+2 : 36 000)', tests: 'forge 20/22, lapidage 23/25', nm: '3 / 6', d: "+1 en CON (version majeure : +2)." },
  { g: 'divers', v: 'Voie des bracelets', r: 5, t: 'objet', n: 'Brassards de passe-muraille', niv: '15 (à billes : 9)', prix: '15 000 (à billes : 9 000)', tests: 'alchimie 20-23, façonnage 20, lapidage 22-25', nm: 5, d: "3×/jour (L) : Passe-muraille (moine, rang 5), distance sur la VOL ou la CON. Version à 9 billes : chaque usage noircit une bille, jusqu'à épuisement." },

  /* --- Capes --- */
  { g: 'divers', v: 'Voie des capes', r: 1, t: 'objet', n: 'Cape de discrétion', niv: '3', prix: '1 000', tests: 'alchimie 18, façonnage 17', nm: 1, d: "+5 à tous les tests de discrétion." },
  { g: 'divers', v: 'Voie des capes', r: 2, t: 'objet', n: 'Cape de défense', niv: '3 / 6 / 9 / 12 / 15', prix: '1 000 / 4 000 / 9 000 / 16 000 / 25 000', tests: 'alchimie 18-22, façonnage 20-25', nm: '1 à 5', def: 1, slot: 'bouclier',
    d: "Portée : annule les DM supplémentaires des attaques sournoises. Enroulée sur l'avant-bras (action de mouvement) : bouclier de DEF +1 à +5, compatible avec une arme légère ou une rapière. Ajoutée en DEF +1 : ajustez selon le modèle." },
  { g: 'divers', v: 'Voie des capes', r: 3, t: 'objet', n: 'Cape de plumes', niv: '9', prix: '8 000', tests: 'alchimie 20, façonnage 22', nm: 3, d: "1×/jour, se transforme en aigle pendant [VOL ou CON] heures (garde ses PV, INT et VOL)." },
  { g: 'divers', v: 'Voie des capes', r: 4, t: 'objet', n: 'Cape d’ombre', niv: '12', prix: '15 000', tests: 'alchimie 20, façonnage 18, forge 18, lapidage 20', nm: 4, d: "Manteau d'ombre (sorcier, rang 4) 3×/jour." },
  { g: 'divers', v: 'Voie des capes', r: 5, t: 'objet', n: 'Cape élémentaire', niv: '15', prix: '25 000', tests: 'alchimie 23, façonnage 22, forge 18, lapidage 23', nm: 5, d: "DM d'un élément divisés par 2 (feu, froid/terre, électricité/air, acide/eau) ; 1×/jour, Forme élémentaire correspondante." },

  /* --- Ceintures --- */
  { g: 'divers', v: 'Voie des ceintures', r: 1, t: 'objet', n: 'Ceinture de stabilité', niv: '3', prix: '2 000', tests: 'alchimie 17, façonnage 18, lapidage 17', nm: 1, d: "Son porteur ne peut plus être renversé." },
  { g: 'divers', v: 'Voie des ceintures', r: 2, t: 'objet', n: 'Ceinture à poches', niv: '6', prix: '4 000', tests: 'alchimie 18, façonnage 20, lapidage 18', nm: 2, d: "4 gourdes ou potions et 3 armes ou objets sans encombrement ; les en sortir est une action gratuite (boire une potion en action de mouvement)." },
  { g: 'divers', v: 'Voie des ceintures', r: 2, t: 'objet', n: 'Ceinture de résistance au poison', niv: '6', prix: '4 000', tests: 'alchimie 16, façonnage 20, lapidage 20', nm: 2, d: "+3 pour résister aux poisons ; effets de l'empoisonnement divisés par deux (DM ou durée)." },
  { g: 'divers', v: 'Voie des ceintures', r: 3, t: 'objet', n: 'Ceinture bouclier', niv: '9', prix: '9 000', tests: 'alchimie 18, façonnage 20, lapidage 22', nm: 3, d: "3×/jour (action de mouvement, un joyau par usage) : +3 en DEF et RD 10 contre l'électricité pendant [niveau] minutes. -5 en discrétion la nuit." },
  { g: 'divers', v: 'Voie des ceintures', r: 3, t: 'objet', n: 'Ceinture des gémeaux', niv: '9', prix: '9 000', tests: 'alchimie 20, façonnage 20, lapidage 20', nm: 3, d: "Sur un mot de commande, change le sexe de son porteur pendant 1d4° h (récupération rapide avant de recommencer)." },
  { g: 'divers', v: 'Voie des ceintures', r: 4, t: 'objet', n: 'Ceinture de force de géant', niv: '9 (+2 : 15)', prix: '9 000 (+2 : 36 000)', tests: 'façonnage 18/20, forge 20/22, lapidage 20/22', nm: '3 / 6', d: "+1 en FOR (majeure : +2) ; compte aussi comme un objet de DEF +1 (non cumulable avec une armure ou un autre objet de protection)." },
  { g: 'divers', v: 'Voie des ceintures', r: 5, t: 'objet', n: 'Ceinture de téléportation', niv: '9 / 12 / 15', prix: '9 000 / 16 000 / 25 000', tests: 'façonnage, forge et lapidage 20 / 22 / 24', nm: '3 / 4 / 5', d: "Mémorise 1, 3 ou une infinité d'emplacements (action limitée) et y téléporte son porteur (action limitée)." },

  /* --- Colliers et amulettes --- */
  { g: 'divers', v: 'Voie des colliers', r: 1, t: 'objet', n: 'Collier de marchand', niv: '3', prix: '1 500', tests: 'alchimie 15, forge 15, lapidage 15', nm: 1, d: "+5 aux tests de CHA pour marchander ou commercer." },
  { g: 'divers', v: 'Voie des colliers', r: 2, t: 'objet', n: 'Collier d’antidote', niv: '3', prix: '2 000', tests: 'alchimie 15, forge 15, lapidage 18', nm: 2, d: "Sept perles : chacune annule un empoisonnement (action gratuite) puis noircit." },
  { g: 'divers', v: 'Voie des colliers', r: 3, t: 'objet', n: 'Amulette de vitalité', niv: '5', prix: '3 000', tests: 'alchimie 15, forge 17, lapidage 20', nm: 2, d: "+6 PV max (après une récupération complète en la portant)." },
  { g: 'divers', v: 'Voie des colliers', r: 4, t: 'objet', n: 'Amulette de soins', niv: '9', prix: '10 000', tests: 'alchimie 18, forge 17, lapidage 20', nm: 3, d: "3×/jour, en action limitée : récupère [2d4° + CON] PV." },
  { g: 'divers', v: 'Voie des colliers', r: 5, t: 'objet', n: 'Collier constricteur', niv: '12', prix: '15 000', tests: 'alchimie 18, forge 23, lapidage 20', nm: 4, d: "1×/combat, lancé (attaque à distance, L, 10 m) sur un humanoïde vivant de taille grande au plus : 2d4° DM par round et -1 cumulatif à tous ses tests ; au 3e round, une cible de NC inférieur au niveau du lanceur fait un test de CON difficulté 15 ou est décapitée." },

  /* --- Couronnes --- */
  { g: 'divers', v: 'Voie des couronnes', r: 1, t: 'objet', n: 'Couronne de télépathie', niv: '5', prix: '4 000', tests: 'alchimie 15, forge 20, lapidage 20', nm: 2, d: "Télépathie à 20 m avec toute créature dotée d'un langage, même inconnu." },
  { g: 'divers', v: 'Voie des couronnes', r: 2, t: 'objet', n: 'Couronne de vérité', niv: '7', prix: '9 000', tests: 'alchimie 17, forge 20, lapidage 22', nm: 3, d: "Test opposé d'attaque magique (L, 5 m) : sait si la cible ment (réussite automatique ensuite sur le même sujet si elle a résisté) ; PER difficulté [10 + INT] pour s'en apercevoir." },
  { g: 'divers', v: 'Voie des couronnes', r: 3, t: 'objet', n: 'Couronne de supériorité mentale', niv: '9 (+2 : 15)', prix: '9 000 (+2 : 36 000)', tests: 'forge 20/22, lapidage 23/25', nm: '3 / 6', d: "+1 en INT, PER ou VOL (+2 en version majeure, ou +1 dans deux caractéristiques)." },
  { g: 'divers', v: 'Voie des couronnes', r: 4, t: 'objet', n: 'Couronne de domination', niv: '12', prix: '25 000', tests: 'forge 22, lapidage 25', nm: 5, d: "+5 pour intimider et commander. 1×/combat : Injonction sur toutes les créatures de NC inférieur à son niveau à 10 m. 1×/jour : Mot de pouvoir." },
  { g: 'divers', v: 'Voie des couronnes', r: 5, t: 'objet', n: 'Couronne de Roi-Sorcier', niv: '18', prix: '50 000', tests: 'alchimie 20, forge 25, lapidage 25', nm: 7, d: "+5 en attaque magique, sorts à -1 PM ; accès à une voie de psionique tirée au d6 (attaque mentale, télékinésie ou télépathie), payée en PM. Souvent maléfique et corruptrice." },

  /* --- Cristaux --- */
  { g: 'divers', v: 'Voie des cristaux', r: 1, t: 'objet', n: 'Cristal de lumière', niv: '2', prix: '1 000', tests: 'alchimie 18, lapidage 21', nm: 0, d: "Éclaire à 10 m sur un mot de commande, aussi longtemps que voulu (monture sur bandeau : façonnage 15)." },
  { g: 'divers', v: 'Voie des cristaux', r: 1, t: 'objet', n: 'Cristal mineur', niv: '3', prix: '1 000', tests: 'alchimie 18, lapidage 21', nm: 0, d: "Contient 1d6 PM ou PE utilisables en action gratuite, puis devient « cramé »." },
  { g: 'divers', v: 'Voie des cristaux', r: 2, t: 'objet', n: 'Cristal de foudre', niv: '6', prix: '4 000', tests: 'alchimie 19, lapidage 22', nm: 2, d: "3×/jour : Sous tension (ensorceleur, rang 2) en action de mouvement, cristal tenu en main." },
  { g: 'divers', v: 'Voie des cristaux', r: 3, t: 'objet', n: 'Cristal de mémoire', niv: '6', prix: '5 000', tests: 'alchimie 20, lapidage 22', nm: 2, d: "+5 en INT pour se souvenir ; enregistre [VOL ou CON] minutes de perceptions (7 scènes) que l'on peut revivre." },
  { g: 'divers', v: 'Voie des cristaux', r: 4, t: 'objet', n: 'Cristal psi / cristal de mana', niv: '6 (6 PE/PM : 9)', prix: '4 000 (6 PE/PM : 10 000)', tests: 'alchimie 20/21, lapidage 23/24', nm: '2 / 3', d: "Stocke jusqu'à 3 (ou 6) de ses propres PE/PM (1 DR par point en récupération rapide), rechargeable. Un psionique (contrôle corporel rang 3) peut se le greffer au front (-1 PV max par PE)." },
  { g: 'divers', v: 'Voie des cristaux', r: 5, t: 'objet', n: 'Cristal d’infinité', niv: '15', prix: '30 000', tests: 'alchimie 25, lapidage 25', nm: 5, d: "Réserve infinie de PM ou de PE : à chaque usage, test d'attaque magique difficulté [5 + 5 × points puisés], sinon 1d4° PV par point ; échec critique : DM doublés, inconscient 1d6 h et maximum réduit de 1." },

  /* --- Figurines magiques --- */
  { g: 'divers', v: 'Voie des figurines magiques', r: 1, t: 'objet', n: 'Figurine de cheval', niv: '3 (guerre : 5)', prix: '1 000 (guerre : 2 000)', tests: 'alchimie 18/19, façonnage 18/19', nm: 1, d: "1×/jour, jetée au sol (mot de commande) : cheval de selle ou de guerre pendant 12 h, infatigable. Deux figurines de même type s'affrontent." },
  { g: 'divers', v: 'Voie des figurines magiques', r: 2, t: 'objet', n: 'Figurine de monstre mineur', niv: '5', prix: '3 000', tests: 'alchimie 20, façonnage 20', nm: 2, d: "1×/jour : créature de taille moyenne (DEF 16, PV 20, Init. 10, attaque = attaque magique du possesseur, 1d4°+3 DM) jusqu'à 0 PV." },
  { g: 'divers', v: 'Voie des figurines magiques', r: 3, t: 'objet', n: 'Figurine de compagnon (ou tarot)', niv: '9', prix: '10 000', tests: 'alchimie 22, façonnage 22 (tarot : CHA 25)', nm: 3, d: "Représente un allié (son sang requis) : télépathie sans limite de distance (action limitée) ; 1×/jour, l'appelle à ses côtés par téléportation s'il accepte." },
  { g: 'divers', v: 'Voie des figurines magiques', r: 4, t: 'objet', n: 'Figurine de monstre majeur', niv: '9', prix: '9 000', tests: 'alchimie 22, façonnage 22', nm: 3, d: "1×/jour : créature de taille grande (DEF 20, PV 40, attaque magique du possesseur, 2d4°+6 DM). Ou figurine mineure utilisable 1×/combat." },
  { g: 'divers', v: 'Voie des figurines magiques', r: 5, t: 'objet', n: 'Château miniature', niv: '12', prix: '20 000', tests: 'alchimie 24, façonnage 24, lapidage 18', nm: 4, d: "1×/jour, devient un château de 30 à 60 m de côté pendant 12 h ; les dégâts persistent. À la fin, ceux des étages chutent (2d4° DM)." },

  /* --- Gants --- */
  { g: 'divers', v: 'Voie des gants', r: 1, t: 'objet', n: 'Gants araignée', niv: '4', prix: '2 000', tests: 'alchimie 18, façonnage 20', nm: 1, d: "Se déplace sur les murs et les plafonds (mains libres) ; immobile, peut libérer une main." },
  { g: 'divers', v: 'Voie des gants', r: 1, t: 'objet', n: 'Gants de voleur', niv: '5', prix: '3 000', tests: 'alchimie 18, façonnage 18, lapidage 15', nm: 1, d: "+3 pour crocheter une serrure ou faire les poches." },
  { g: 'divers', v: 'Voie des gants', r: 2, t: 'objet', n: 'Maniques magiques', niv: '3 / 6 / 9 / 12 / 15', prix: '1 000 / 4 000 / 9 000 / 16 000 / 25 000', tests: 'alchimie 15-20, façonnage 20-25, lapidage 10-15', nm: '1 à 5', arme: { dm: '1d3', bonusAuto: true },
    d: "Gants renforcés : leur bonus (+1 à +5) s'ajoute en attaque et aux DM à mains nues. Peuvent recevoir la propriété élémentaire. Ajoutées à la fiche comme arme à mains nues +1 : ajustez le bonus." },
  { g: 'divers', v: 'Voie des gants', r: 3, t: 'objet', n: 'Gant de main magique', niv: '6', prix: '4 000', tests: 'alchimie 18, façonnage 20, lapidage 16', nm: 2, d: "Projette une main spectrale à 20 m qui agit comme la sienne (arme, porte, serrure, sort de toucher)." },
  { g: 'divers', v: 'Voie des gants', r: 3, t: 'objet', n: 'Gantelet du coup de poing', niv: '9', prix: '9 000', tests: 'alchimie 20, façonnage 18, forge 18, lapidage 15', nm: 3, d: "1×/combat : onde de choc de 3 m de large sur 20 m, attaque magique contre la DEF : [3d4° + VOL] DM et test de FOR difficulté 15 sinon renversé." },
  { g: 'divers', v: 'Voie des gants', r: 4, t: 'objet', n: 'Gantelets d’agilité', niv: '9 (+2 : 15)', prix: '9 000 (+2 : 36 000)', tests: 'alchimie 18/20, façonnage 21/23, lapidage 18/19', nm: '3 / 6', d: "+1 en AGI (majeurs : +2)." },
  { g: 'divers', v: 'Voie des gants', r: 5, t: 'objet', n: 'Gantelet du destin', niv: '15 (cristal : 10)', prix: '15 000 (cristal : 5 000)', tests: 'gant : alchimie 20, forge 22 · cristal : alchimie 20, lapidage 25', nm: '4 (+2 par cristal)', d: "Cinq emplacements pour des cristaux magiques (voie des cristaux) ; changer un cristal est une action limitée (sur 1 au d6, le cristal retiré se fend)." },

  /* --- Instruments de musique --- */
  { g: 'divers', v: 'Voie des instruments de musique', r: 1, t: 'objet', n: 'Flûte de charme des vermines', niv: '4', prix: '2 000', tests: 'alchimie 18, façonnage 20', nm: 1, d: "En jouant (action de mouvement) : insectes, rats et petits serpents à 20 m se regroupent et le suivent, puis restent immobiles 3 rounds. Un barde affecte jusqu'à la taille grande (NC ≤ moitié de son rang dans la voie du musicien)." },
  { g: 'divers', v: 'Voie des instruments de musique', r: 2, t: 'objet', n: 'Clochette de silence', niv: '6', prix: '4 000', tests: 'alchimie 18, forge 22', nm: 2, d: "1×/jour : Zone de silence (barde, rang 4). Un barde paie ce sort 1 PM de moins." },
  { g: 'divers', v: 'Voie des instruments de musique', r: 3, t: 'objet', n: 'Trompette des morts', niv: '9', prix: '9 000', tests: 'alchimie 18, façonnage 20, forge 20', nm: 3, d: "1×/jour (L) : Animation des morts, 1d4° zombies pendant 12 h. Un sorcier paie ce sort 1 PM de moins." },
  { g: 'divers', v: 'Voie des instruments de musique', r: 4, t: 'objet', n: 'Violon de gigue', niv: '12', prix: '15 000', tests: 'alchimie 18, façonnage 25', nm: 4, d: "1×/jour, joue seul : Danse irrésistible sur tous à 10 m sauf son propriétaire (un seul test ; alliés prévenus : dé bonus). Un barde paie ce sort 1 PM de moins." },
  { g: 'divers', v: 'Voie des instruments de musique', r: 5, t: 'objet', n: 'Tambour de séisme', niv: '15', prix: '20 000', tests: 'alchimie 18, façonnage 20, lapidage 20', nm: 5, d: "1×/jour : Séisme (voie de prestige de mystique, rang 7)." },

  /* --- Artefacts indispensables --- */
  { g: 'divers', v: 'Voie des artefacts indispensables', r: 1, t: 'objet', n: 'Chope de glace', niv: '2', prix: '500', tests: 'alchimie 18, façonnage 16, lapidage 16', nm: 0, d: "Garde son contenu au frais (réglable) ; conserve une potion ouverte 12 h." },
  { g: 'divers', v: 'Voie des artefacts indispensables', r: 1, t: 'objet', n: 'Tasse de feu', niv: '2', prix: '500', tests: 'alchimie 18, façonnage 16, lapidage 16', nm: 0, d: "Chauffe son contenu (réglable) ; dé bonus au test de CON contre un liquide toxique qu'elle contient." },
  { g: 'divers', v: 'Voie des artefacts indispensables', r: 2, t: 'objet', n: 'Torche magique', niv: '3', prix: '1 000', tests: 'alchimie 20, façonnage 16, forge 16', nm: 1, arme: { dm: '1d4°', bonusAtt: 2, noFor: true },
    d: "Feu éternel (capuchon pour l'éteindre), éclaire deux fois plus loin. Arme +2 en attaque, 1d4° DM de feu magiques sans bonus de caractéristique." },
  { g: 'divers', v: 'Voie des artefacts indispensables', r: 2, t: 'objet', n: 'Lunettes des ombres', niv: '6', prix: '4 000', tests: 'alchimie 20, façonnage 16, lapidage 18', nm: 2, d: "Vision dans le noir total à 20 m ; ignore le brouillard léger (dense = léger) ; une lumière vive éblouit." },
  { g: 'divers', v: 'Voie des artefacts indispensables', r: 3, t: 'objet', n: 'Corde magique', niv: '5', prix: '3 000', tests: 'alchimie 18, façonnage 18, lapidage 16', nm: 1, d: "20 m, 1 kg, indéchirable (RD 20 contre tranchant et acide). Sur ordre : se dresse à 10 m, rampe jusqu'à 20 m, se noue et se dénoue seule." },
  { g: 'divers', v: 'Voie des artefacts indispensables', r: 3, t: 'objet', n: 'Clé magique', niv: '7', prix: '5 000', tests: 'forge 20, lapidage 18', nm: 2, d: "Ouvre toute serrure simple (10-15) ; au-delà, test d'attaque magique contre la difficulté (se brise sur un échec contre une serrure de 30 ou magique)." },
  { g: 'divers', v: 'Voie des artefacts indispensables', r: 4, t: 'objet', n: 'Corne d’abondance', niv: '12', prix: '18 000', tests: 'alchimie 20, façonnage 20, lapidage 18', nm: 4, d: "Jusqu'à 12 fois par jour, nourriture pour une personne pour la journée (pas de boisson)." },
  { g: 'divers', v: 'Voie des artefacts indispensables', r: 4, t: 'objet', n: 'Gourde magique', niv: '12', prix: '15 000', tests: 'alchimie 20, façonnage 18, lapidage 20', nm: 4, d: "3 litres d'eau, remplie à chaque récupération rapide." },
  { g: 'divers', v: 'Voie des artefacts indispensables', r: 5, t: 'objet', n: 'Sac sans fond', niv: '12', prix: '15 000', tests: 'alchimie 20, façonnage 22', nm: 4, d: "Comme celui du forgesort (voie des artefacts, rang 3) : jusqu'à 250 kg." },
  { g: 'divers', v: 'Voie des artefacts indispensables', r: 5, t: 'objet', n: 'Bouclier trou portable', niv: '15', prix: '25 000', tests: 'alchimie 25, façonnage 20, forge 15, lapidage 18', nm: 5, d: "Posé au sol, s'ouvre sur un abri extradimensionnel pour 3 personnes par point de bonus, 10 h par jour (éjection : 2d6 DM)." },

  /* --- Robes --- */
  { g: 'divers', v: 'Voie des robes', r: 1, t: 'objet', n: 'Robe de discours', niv: '3', prix: '1 000', tests: 'alchimie 18, façonnage 18', nm: 1, d: "+5 aux tests pour convaincre." },
  { g: 'divers', v: 'Voie des robes', r: 1, t: 'objet', n: 'Robe de séduction', niv: '3', prix: '1 000', tests: 'façonnage 18, lapidage 18', nm: 1, d: "+5 aux tests pour séduire." },
  { g: 'divers', v: 'Voie des robes', r: 2, t: 'objet', n: 'Robe de protection', niv: '3 / 6 / 9 / 12 / 15', prix: '1 000 / 4 000 / 9 000 / 16 000 / 25 000', tests: 'alchimie 18-22, façonnage 20-25', nm: '1 à 5', def: 1, slot: 'armure',
    d: "Son bonus (+1 à +5) s'ajoute en DEF. Ajoutée comme armure DEF +1 : ajustez selon le modèle." },
  { g: 'divers', v: 'Voie des robes', r: 3, t: 'objet', n: 'Robe de résistance élémentaire', niv: '6 (majeure : 12)', prix: '5 000 (majeure : 20 000)', tests: 'alchimie, façonnage et lapidage 20 (22)', nm: '2 / 4', d: "RD 5 (majeure : 10) contre le feu, le froid, l'électricité et l'acide ; non cumulable avec une autre RD ou résistance." },
  { g: 'divers', v: 'Voie des robes', r: 4, t: 'objet', n: 'Robe de charisme', niv: '9 (majeure : 15)', prix: '9 000 (majeure : 36 000)', tests: 'façonnage 23/25, lapidage 20/22', nm: '3 / 6', d: "+1 en CHA (majeure : +2)." },
  { g: 'divers', v: 'Voie des robes', r: 5, t: 'objet', n: 'Robe d’archimage', niv: '15', prix: '25 000', tests: 'alchimie 23, façonnage 23, lapidage 20', nm: 5, d: "Mage uniquement : DEF et PM supplémentaires égaux à son rang dans la voie du mage ; 2 PM en action gratuite pour un dé bonus en attaque magique ; immunisé à immobilisé et étourdi." },

  /* --- Sceptres --- */
  { g: 'divers', v: 'Voie des sceptres', r: 1, t: 'base', n: 'Sceptre de magie', niv: '3 / 6 / 9 / 12 / 15', prix: '1 000 / 4 000 / 9 000 / 16 000 / 25 000', tests: 'façonnage 15-20, forge 18-23, lapidage 15-20', nm: '1 à 5', d: "Bonus (+1 à +5) à tous les tests d'attaque magique et aux DM des sorts. Version limitée à un élément : coût divisé par 2, tests -2." },
  { g: 'divers', v: 'Voie des sceptres', r: 2, t: 'propriété', n: 'Sceptre d’optimisation', niv: '+2', prix: '+50 %', tests: 'lapidage +3', nm: 1, d: "Un sort raté coûte 1 PM de moins." },
  { g: 'divers', v: 'Voie des sceptres', r: 3, t: 'propriété', n: 'Sceptre de défense', niv: '+3', prix: '+8 000', tests: 'forge +2, lapidage +5', nm: 2, d: "1×/round, pour 1 PM : +2 en DEF après avoir vu l'attaque, ou +5 avant." },
  { g: 'divers', v: 'Voie des sceptres', r: 4, t: 'propriété', n: 'Sceptre de rapidité des sorts', niv: '+5', prix: '+12 000', tests: 'forge +2, lapidage +5, alchimie 20', nm: 2, d: "Accélère l'incantation d'un cran (L → A → M → G), 1×/combat gratuitement, puis 1 PM par rang du sort." },
  { g: 'divers', v: 'Voie des sceptres', r: 5, t: 'propriété', n: 'Sceptre d’archimage', niv: '+5', prix: '+100 %', tests: 'façonnage, forge et lapidage +3, alchimie [15 + bonus]', nm: 'bonus + 2', d: "Bonus minimum +3 : +[bonus] PM max et autant de rangs de sorts supplémentaires utilisables comme les siens (lanceur connaissant ces sorts requis à la fabrication)." },

  /* --- Artefacts de voyage --- */
  { g: 'divers', v: 'Voie des artefacts de voyage', r: 1, t: 'objet', n: 'Selle magique', niv: '3', prix: '1 000', tests: 'alchimie 15, façonnage 18, lapidage 16', nm: 1, d: "+5 en équitation." },
  { g: 'divers', v: 'Voie des artefacts de voyage', r: 1, t: 'objet', n: 'Tente pliante', niv: '3', prix: '1 500 (4 places : 3 000)', tests: 'alchimie 16, façonnage 22', nm: 1, d: "Tente de 2 personnes qui se déplie en 3 secondes (replier : 10 min et INT 10, sinon 20 min) ; +5 au test de CON pour récupérer d'une nuit non optimale." },
  { g: 'divers', v: 'Voie des artefacts de voyage', r: 2, t: 'objet', n: 'Bateau pliant', niv: '6', prix: '4 000 (4 places : 8 000)', tests: 'alchimie 20, façonnage 20', nm: 2, d: "Canoë de 2 personnes qui se plie comme la tente pliante." },
  { g: 'divers', v: 'Voie des artefacts de voyage', r: 2, t: 'objet', n: 'Fers de rapidité', niv: '6', prix: '5 000', tests: 'forge 20, lapidage 20', nm: 2, d: "Cheval : 15 m par mouvement et +5 km par période ; étincelles et bruit (-5 en discrétion)." },
  { g: 'divers', v: 'Voie des artefacts de voyage', r: 3, t: 'objet', n: 'Bateau en bouteille', niv: '9', prix: '12 000', tests: 'alchimie 20, façonnage 20, lapidage 18', nm: 3, d: "1×/jour, libère un trois-mâts (200 personnes ou tonneaux ; équipage de 10 marins nécessaire)." },
  { g: 'divers', v: 'Voie des artefacts de voyage', r: 3, t: 'objet', n: 'Sous-marin de poche', niv: '9', prix: '9 000', tests: 'alchimie 22, façonnage 18, lapidage 18', nm: 3, d: "Jeté à l'eau : sous-marin de 5 places, 10 m par mouvement, autonomie 1d4° h par jour (sortie de l'eau : FOR 20)." },
  { g: 'divers', v: 'Voie des artefacts de voyage', r: 4, t: 'objet', n: 'Balai volant', niv: '12', prix: '12 000', tests: 'alchimie 20, façonnage 20, lapidage 18', nm: 4, d: "3×/jour, vol à 15 m par mouvement pendant 1d4° h ; une main toujours sur le balai (ni arme à deux mains ni bouclier)." },
  { g: 'divers', v: 'Voie des artefacts de voyage', r: 4, t: 'objet', n: 'Fers du vent', niv: '12', prix: '15 000', tests: 'alchimie 20, forge 22, lapidage 20', nm: 4, d: "Le cheval galope dans les cieux comme sur terre." },
  { g: 'divers', v: 'Voie des artefacts de voyage', r: 5, t: 'objet', n: 'Tapis volant', niv: '15', prix: '55 000', tests: 'alchimie 22, façonnage 25, lapidage 20', nm: 5, d: "6 personnes, 10 m par mouvement, sans limite de durée ; en combat, un échec critique peut provoquer une chute (INT 15 du pilote pour rattraper)." },
  { g: 'divers', v: 'Voie des artefacts de voyage', r: 5, t: 'objet', n: 'Foreuse de poche', niv: '15', prix: '55 000', tests: 'alchimie 22, forge 25, lapidage 22', nm: 5, d: "Sous-marin souterrain : 5 m par round dans la terre, 1 m dans la roche, autonomie 1d4° h (terre pour l'agrandir, eau pour le réduire)." }
);

/* ================= Potions (flasques) =================
   Prix d'une dose ; 2 doses : 180 %, 3 doses : 250 %, +50 % par dose
   suivante. Un lanceur qui connaît le sort divise le coût par 2 et réduit
   le test d'alchimie de 5. Dé évolutif et caractéristique : ceux du buveur
   (CON possible ; au moins +1). Au-delà d'une potion par jour : test de
   CON difficulté 10 (+5 par potion) sinon affaibli. */
(function () {
  var paliers = [
    { r: 1, niv: '3', prix: '100', alch: 18, aut: 15, nom: 'mineures' },
    { r: 2, niv: '5', prix: '200', alch: 19, aut: 15 },
    { r: 3, niv: '6', prix: '400', alch: 20, aut: 16, nom: 'majeures' },
    { r: 4, niv: '7', prix: '600', alch: 21, aut: 16 },
    { r: 5, niv: '9', prix: '800', alch: 22, aut: 17, nom: 'supérieures' }
  ];
  var flasques = [
    { v: 'Voie des flasques en métal', mat: 'forge', profil: 'magicien', listes: {
        1: ['Lévitation', 'Armure de mana', 'Chute ralentie'],
        2: [['Potion de mana de magicien', "Un magicien récupère 1d8 PM (1 par minute, sans dépasser son maximum) ; un autre lanceur, la moitié."]],
        3: ['Forme gazeuse', 'Déphasage', 'Invisibilité'],
        4: [['Potion d’intelligence', "+3 en INT et aux effets des sorts de magicien pendant 1 h."]],
        5: ['Accélération', 'Respiration aquatique', 'Vol'] } },
    { v: 'Voie des flasques en verre', mat: 'forge', profil: 'ensorceleur', listes: {
        1: ['Murmures dans le vent', 'Détection de l’invisible', 'Image décalée'],
        2: [['Potion de mana d’ensorceleur', "Un ensorceleur récupère 1d8 PM (1 par minute) ; un autre lanceur, la moitié."]],
        3: ['Sous tension', 'Télékinésie', 'Clairvoyance'],
        4: [['Potion de charisme', "+3 en CHA et aux effets des sorts d'ensorceleur pendant 1 h."]],
        5: ['Forme éthérée', 'Imitation', 'Porte dimensionnelle'] } },
    { v: 'Voie des flasques en cuir', mat: 'façonnage', profil: 'prêtre', listes: {
        1: ['Augure', 'Récupération mineure', 'Sanctuaire'],
        2: [['Eau bénite', "Lancée à 10 m (réussite automatique) : [2d4° + CHA] DM aux morts-vivants et démons dans un rayon de 3 m (AGI [10 + CHA] pour moitié)."]],
        3: ['Vigueur divine', 'Délivrance', ['Invulnérabilité', "Pendant 1 h, moitié des DM élémentaires, de poison et des maladies (comme Invulnérable, moine)."]],
        4: [['Potion de récupération', "Rend tous les DR manquants (à utiliser ensuite au repos)."]],
        5: ['Ailes célestes', 'Récupération majeure', 'Marche des plans'] } },
    { v: 'Voie des flasques en bois', mat: 'façonnage', profil: 'druide', listes: {
        1: ['Langage des animaux', 'Peau d’écorce', ['Vitesse du félin', "Pendant 12 h : +3 en course, escalade, saut et Init., +1 en DEF."]],
        2: [['Potion de fertilité', "Versée au sol : Baies magiques ; lancée sur un adversaire à 10 m : Prison végétale sur lui seul (sans test)."]],
        3: ['Masque du prédateur', 'Régénération', ['Résistance', "Effets de la capacité Résistant (druide, voie de la nature, rang 5) pendant 10 min."]],
        4: [['Potion de perception', "+3 en PER et aux effets des sorts de druide pendant 1 h."]],
        5: ['Forme animale', 'Forme d’arbre', 'Porte végétale'] } },
    { v: 'Voie des flasques en os', mat: 'façonnage', profil: 'sorcier', listes: {
        1: ['Masque mortuaire', ['Saignement', "Bue : effets du sort pendant 7 rounds ; versée sur une arme : affecte la première victime blessée."], ['Énergie impie', "Confère Syphon des âmes (sorcier, voie de la mort, rang 1) pendant 12 h."]],
        2: [['Potion d’animation des morts', "Versée sur un cadavre : un zombie au service de l'utilisateur (Animation des morts)."]],
        3: ['Beauté de la succube', 'Sang mordant', 'Reptation'],
        4: [['Potion de force impie', "+3 en FOR pendant 1 h."]],
        5: ['Aspect du démon', 'Manteau d’ombre', ['Ossification', "Pendant 12 h (1d4° DM en la buvant) : RD 3 contre le tranchant et le contondant, dé bonus en intimidation, dé malus pour séduire."]] } }
  ];
  /* Retrouve le sort dans les voies du profil (ou de tous les profils) pour
     reprendre sa description complète au lieu d'un simple renvoi. */
  function norm(s) { return String(s).toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ').trim(); }
  var ID_PROFIL = { 'magicien': 'magicien', 'ensorceleur': 'ensorceleur', 'prêtre': 'pretre', 'druide': 'druide', 'sorcier': 'sorcier' };
  function sortDe(profil, nom) {
    var P = COF.PROFILS || {}, cible = norm(nom), ids = [ID_PROFIL[profil]].concat(Object.keys(P));
    for (var i = 0; i < ids.length; i++) {
      var pr = P[ids[i]]; if (!pr || !pr.voies) continue;
      for (var j = 0; j < pr.voies.length; j++) {
        var caps = pr.voies[j].caps || [];
        for (var k = 0; k < caps.length; k++) {
          if (norm(caps[k].n) === cible) return { cap: caps[k], voie: pr.voies[j].nom, profil: pr.nom };
        }
      }
    }
    return null;
  }
  flasques.forEach(function (f) {
    paliers.forEach(function (p) {
      (f.listes[p.r] || []).forEach(function (x) {
        var nom = Array.isArray(x) ? x[0] : x, desc;
        if (Array.isArray(x)) desc = x[1];
        else {
          var s = sortDe(f.profil, nom);
          desc = s ? s.cap.d + " (Sort « " + nom + " », " + s.voie + " du " + s.profil.toLowerCase() + ", rang " + s.cap.r + " ; affecte le seul buveur.)"
                   : "Mêmes effets que le sort de " + f.profil + " « " + nom + " », pour le seul buveur.";
        }
        COF.CATALOGUE_COMPAGNON.push({
          g: 'potions', v: f.v, r: p.r, t: 'objet',
          n: (/^(Potion|Eau)/.test(nom) ? nom : 'Potion : ' + nom),
          niv: p.niv, prix: p.prix, tests: 'alchimie ' + p.alch + ', ' + f.mat + ' ' + p.aut + ', lapidage ' + p.aut, nm: 0,
          potion: true, d: desc, sort: /^(Potion|Eau)/.test(nom) ? null : nom
        });
      });
    });
  });
})();
