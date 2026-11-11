/* ============================================================
   COF2 Compagnon — Données : armes magiques par voies de recettes
   (Compagnon du joueur, chapitre 5 « Voies de recettes d'armes »).
   Chaque famille d'armes correspond à une voie de recettes : une
   base de qualité (rang 1), une base magique +1 à +5 (rang 2) et des
   propriétés (rangs 2 à 5) qui modifient le niveau requis, le coût
   des matières premières et les tests d'artisanat. Combinées par
   js/core/arme-magique.js.
   ============================================================ */
window.COF = window.COF || {};

/* Base magique commune à toutes les voies : index 0 = +1 … 4 = +5. */
COF.AR_BASE = {
  niveau: [3, 6, 9, 12, 15],
  prix: [1000, 4000, 9000, 16000, 25000]      // matières premières, en pa
};

COF.AR_ELEMENTS = [
  { id: 'feu', nom: 'feu', label: 'de feu', gemme: 'rubis' },
  { id: 'froid', nom: 'froid', label: 'de froid', gemme: 'saphir' },
  { id: 'foudre', nom: 'électricité', label: "d'électricité", gemme: 'diamant' },
  { id: 'acide', nom: 'acide', label: "d'acide", gemme: 'émeraude' },
  { id: 'poison', nom: 'poison', label: 'de poison', gemme: 'diamant noir' }
];

COF.AR_FLEAUX = [
  'animaux', 'démons', 'gobelinoïdes', 'lanceurs de sorts', 'morts-vivants', 'lycanthropes',
  'élémentaires', 'dragons', 'géants', 'créatures artificielles', 'plantes', 'insectes géants'
];

/* ---------- Familles d'armes = voies de recettes ----------
   armes  : identifiants de COF.ARMES_CONTACT / COF.ARMES_DISTANCE
   tests  : difficultés de la base magique, de +1 à +5
   props  : propriétés proposées par la voie (voir COF.AR_PROPS)        */
COF.AR_FAMILLES = [
  { id: 'lames', voie: 'Voie des lames', nom: 'Lames (épées, sabres, rapières, dagues)', poids: 6, tranchant: true,
    armes: ['dague', 'epeecourte', 'epeelongue', 'epeebatarde', 'epee2m', 'rapiere', 'vivelame', 'sabrecourt', 'sabredroit'],
    tests: { 'façonnage': [10, 11, 12, 13, 15], forge: [20, 21, 22, 23, 25], lapidage: [15, 16, 17, 18, 20] },
    qualite: { prix: 50, tests: 'forge 20, façonnage 10', texte: '+1 en attaque au contact' },
    props: ['parade', 'poison', 'affutee', 'invisible', 'fleau', 'plaie', 'assassin', 'elementaire', 'vorpale', 'maudite'] },
  { id: 'haches', voie: 'Voie des haches', nom: 'Haches', poids: 3, tranchant: true,
    armes: ['hache', 'hache2m', 'hachette'],
    tests: { 'façonnage': [12, 13, 14, 15, 17], forge: [18, 19, 20, 21, 23], lapidage: [15, 16, 17, 18, 20] },
    qualite: { prix: 50, tests: 'forge 18, façonnage 10', texte: '+1 en attaque au contact' },
    props: ['retour', 'affutee', 'fleau', 'hacheorcs', 'elementaire', 'vorpale'] },
  { id: 'masses', voie: 'Voie des masses et marteaux', nom: 'Masses, marteaux et fléaux', poids: 3,
    armes: ['masse', 'marteau', 'gourdin', 'fleau', 'fleau2m'],
    tests: { 'façonnage': [12, 13, 14, 15, 17], forge: [18, 19, 20, 21, 23], lapidage: [15, 16, 17, 18, 20] },
    qualite: { prix: 50, tests: 'forge 16, façonnage 10', texte: '+1 en attaque au contact' },
    props: ['fracassant', 'retour', 'fleau', 'brisepierre', 'elementaire', 'dislocation'] },
  { id: 'batons', voie: 'Voie des bâtons de combat', nom: 'Bâtons de combat', poids: 2,
    armes: ['baton', 'batonferre'],
    tests: { alchimie: [12, 13, 14, 15, 17], 'façonnage': [18, 19, 20, 21, 23], lapidage: [15, 16, 17, 18, 20] },
    qualite: { prix: 20, tests: 'façonnage 18', texte: '+1 en attaque au contact' },
    props: ['fracassant', 'fleau', 'tourbillon', 'elementaire', 'infini'] },
  { id: 'lances', voie: 'Voie des lances', nom: 'Lances et armes d’hast', poids: 2,
    armes: ['lance', 'epieu', 'pique', 'lancecav', 'javelot'],
    tests: { 'façonnage': [12, 13, 14, 15, 17], forge: [18, 19, 20, 21, 23], lapidage: [15, 16, 17, 18, 20] },
    qualite: { prix: 50, tests: 'forge 18, façonnage 12', texte: '+1 en attaque au contact et à distance' },
    props: ['equilibree', 'fleau', 'plaie', 'elementaire', 'empalement'] },
  { id: 'arcs', voie: 'Voie des arcs', nom: 'Arcs', poids: 3, distance: true,
    armes: ['arccourt', 'arclong'],
    tests: { alchimie: [15, 16, 17, 18, 20], 'façonnage': [20, 21, 22, 23, 25], lapidage: [10, 11, 12, 13, 15] },
    qualite: { prix: 50, tests: 'façonnage 20', texte: '+1 en attaque (non cumulable avec une flèche magique)' },
    props: ['puissant', 'fleau', 'elementaire'] },
  { id: 'arbaletes', voie: 'Voie des arbalètes', nom: 'Arbalètes', poids: 2, distance: true,
    armes: ['arbpoing', 'arblegere', 'arblourde'],
    tests: { 'façonnage': [17, 18, 19, 20, 22], forge: [17, 18, 19, 20, 22], lapidage: [10, 11, 12, 13, 15] },
    qualite: { prix: 80, tests: 'façonnage 15, forge 15', texte: '+1 en attaque' },
    props: ['mecanisme', 'precision', 'fleau', 'rapide', 'elementaire'] },
  { id: 'poudre', voie: 'Voie des armes à poudre', nom: 'Armes à poudre', poids: 1, distance: true,
    armes: ['petoire', 'mousquet'],
    tests: { 'façonnage': [18, 19, 20, 21, 23], forge: [18, 19, 20, 21, 23], lapidage: [12, 13, 14, 15, 17] },
    qualite: { prix: 100, tests: 'façonnage 18, forge 18', texte: '+1 en attaque (non cumulable avec une cartouche magique)' },
    props: ['precision', 'fleau', 'repetition', 'elementaire'] }
];

/* ---------- Propriétés (capacités « propriété » des voies) ----------
   rang   : rang de la voie de recettes qui l'enseigne
   nm     : niveau de magie ajouté
   niv    : niveau requis ajouté (nivMin : niveau requis absolu)
   prix   : matières premières ajoutées (pa)
   tests  : tests d'artisanat ajoutés/modifiés
   crit   : plage de critique augmentée de N
   choix  : 'element' | 'fleau' | 'variante' (voir variantes)
   armes  : restreint à ces armes ; incompat : propriétés exclusives    */
COF.AR_PROPS = {
  parade: { nom: 'Arme de parade', rang: 2, nm: 0, niv: 0, prix: 0, tests: '—',
    texte: "Le bonus de l'arme s'applique en DEF au lieu de l'attaque et des DM (seul bonus de DEF magique cumulable avec armure, bouclier, anneau…).", parade: true },
  poison: { nom: 'Dague de poison', rang: 2, nm: 1, niv: 1, prix: 2000, tests: 'alchimie 20', armes: ['dague'], dmg: '4d4°',
    texte: "1×/combat, sur une attaque réussie : +4d4° DM de poison (test de CON difficulté [10 + bonus de l'arme] pour moitié)." },
  affutee: { nom: 'Affûtée', rang: 3, nm: 1, niv: 2, prix: 3000, tests: 'lapidage et forge +3', crit: 1, dmg: '1d4°',
    texte: "Plage de critique augmentée de 1 ; +1d4° DM en cas de critique." },
  invisible: { nom: 'Dague invisible', rang: 3, nm: 2, niv: 3, prix: 3000, tests: 'lapidage +5, alchimie 20', armes: ['dague'], incompat: ['assassin'],
    texte: "Invisible pour tous sauf son porteur : dé bonus à la première attaque contre chaque adversaire ; avec l'Attaque sournoise, ajoute la moitié de ses dés à chaque attaque." },
  fleau: { nom: 'Fléau', rang: 4, nm: 1, niv: 3, prix: 5000, tests: 'lapidage +5, alchimie 20', choix: 'fleau', dmg: '1d4°',
    texte: "+1d4° DM contre la catégorie de créatures choisie." },
  plaie: { nom: 'Plaie', rang: 4, nm: 1, niv: 3, prix: 5000, tests: 'lapidage +5, forge +5',
    texte: "Les blessures saignent : 1 DM par round aux créatures vivantes, cumulable jusqu'à 3 par round ; une action limitée stoppe l'hémorragie." },
  assassin: { nom: "Dague d'assassin", rang: 4, nm: 2, niv: 3, prix: 5000, tests: 'lapidage +8, alchimie 25', armes: ['dague'], incompat: ['invisible'],
    texte: "Une victime réduite à 0 PV ne peut être ni interrogée par divination ni rappelée à la vie ; un PJ doit réussir un test de CON difficulté 10 ou mourir (un PNJ meurt aussitôt)." },
  elementaire: { nom: 'Élémentaire', rang: 5, nm: 2, niv: 5, prix: 10000, tests: 'lapidage +8, alchimie 25', choix: 'element', dmg: '1d4°',
    texte: "+1d4° DM de l'élément choisi." },
  vorpale: { nom: 'Vorpale', rang: 5, nm: 2, niv: 5, prix: 20000, tests: 'lapidage +10, forge +5', dmg: '3d4°',
    texte: "Sur un critique, tranche la tête d'une cible de NC inférieur au niveau du porteur (mort instantanée) ; sinon +3d4° DM. Sans tête ou à plusieurs têtes : effets normaux du critique et une tête de moins." },
  maudite: { nom: 'Dague maudite (base unique)', rang: 5, nm: 0, niv: 0, prix: 0, tests: 'forge 25, lapidage 25, alchimie 20, façonnage 15', armes: ['dague'], exclusif: true,
    base: { bonus: 3, niveau: 13, prix: 25000, nm: 5, crit: 17 },
    texte: "Dague +3 de lumière noire, critique sur 17-20. Sur un critique, la lame se brise dans le cœur de la victime (inutile contre les morts-vivants) et repousse au coucher du soleil : +1d4 DM par round pendant 3 rounds, puis +1 DM par jour, soins divisés par 2, jusqu'à un Rappel à la vie. Une victime qui meurt ainsi devient un spectre au service du porteur (7 au plus). Aucune autre propriété possible." },
  retour: { nom: 'Retour', rang: 3, nm: 1, niv: 2, prix: 2000, tests: 'alchimie 20', armes: ['hache', 'hachette', 'masse', 'marteau'],
    texte: "Se lance à 10 m (20 m avec dé malus ; hachette : 20/40 m) et revient dans la main durant la même action (1×/round)." },
  hacheorcs: { nom: 'Hache des orcs', rang: 4, nm: 1, niv: 2, prix: 2000, tests: 'alchimie 20, lapidage +3',
    texte: "Ignore la RD et la résistance aux DM des plantes, des créatures et des structures en bois." },
  fracassant: { nom: 'Fracassant', rang: 3, nm: 1, niv: 2, prix: 5000, tests: 'lapidage +3', crit: 1,
    texte: "Plage de critique augmentée de 1 ; sur un critique, une cible de taille grande ou moins est renversée (sacrifier son bouclier l'évite), une plus grande est étourdie 1 round." },
  brisepierre: { nom: 'Brise-pierre', rang: 4, nm: 1, niv: 2, prix: 2000, tests: 'alchimie 20, lapidage +3',
    texte: "Ignore la RD et la résistance aux DM des créatures et des structures en pierre." },
  dislocation: { nom: 'Dislocation', rang: 5, nm: 2, niv: 5, prix: 10000, tests: 'lapidage +10, façonnage +5',
    texte: "Sur un critique, une cible de NC inférieur au niveau du porteur est assommée 1d6 min, sinon étourdie 1 round. Détruit les squelettes de NC ≤ 3 au premier coup (DM doublés au-delà)." },
  tourbillon: { nom: 'Tourbillon défensif', rang: 4, nm: 2, niv: 5, prix: 3000, tests: 'alchimie et lapidage +3',
    texte: "En action de mouvement : +2 en DEF pour le round (+4 contre les petits projectiles) ; s'ajoute aussi à Défense partielle et Défense totale." },
  infini: { nom: 'Bâton infini', rang: 5, nm: 3, niv: 7, prix: 8000, tests: 'alchimie, façonnage et lapidage +3', dmg: '2d4°',
    texte: "S'étire jusqu'à 30 m sur un mot : attaque à 30 m (test à distance) avec ses DM de contact ; permet des sauts de 30 m. Sur un critique, test de FOR difficulté 15 ou la cible est projetée à 2d4° m et subit autant de DM." },
  equilibree: { nom: 'Équilibrée', rang: 3, nm: 1, niv: 2, prix: 2000, tests: 'façonnage et lapidage +3', crit: 1,
    texte: "Plage de critique augmentée de 1 ; portée doublée lorsqu'elle est lancée." },
  empalement: { nom: 'Empalement', rang: 5, nm: 2, niv: 5, prix: 6000, tests: 'lapidage +5, forge +5', dmg: '2d4°',
    texte: "Sur un critique, la cible est empalée : +2d4° DM et immobilisée, +1d4° par round ; s'en libérer : test de VOL difficulté 15 (action d'attaque, +1d4° DM par tentative)." },
  puissant: { nom: 'Arc puissant', rang: 3, nm: 1, niv: 2, prix: 3000, tests: 'alchimie et façonnage +3', choix: 'variante',
    variantes: [
      { id: 'portee', nom: 'critique +1 et portée +50 %', crit: 1, portee: 1.5 },
      { id: 'force', nom: 'FOR ajoutée aux DM (jusqu’à portée nominale)', ajoutDm: 'FOR' }
    ], texte: "Au choix : plage de critique +1 et portée +50 %, ou ajoute la FOR aux DM jusqu'à la portée nominale." },
  precision: { nom: 'Précision', rang: 3, nm: 1, niv: 2, prix: 3000, tests: 'façonnage et forge +3', choix: 'variante',
    variantes: [
      { id: 'portee', nom: 'critique +1 et portée +50 %', crit: 1, portee: 1.5 },
      { id: 'per', nom: 'PER ajoutée aux DM (jusqu’à portée nominale)', ajoutDm: 'PER' }
    ], texte: "Au choix : plage de critique +1 et portée +50 %, ou ajoute la PER aux DM jusqu'à la portée nominale." },
  mecanisme: { nom: 'Mécanisme magique', rang: 2, nm: 0, niv: 0, nivMin: 5, prix: 400, tests: 'façonnage +5',
    texte: "Peut être rechargée avec un adversaire actif au contact." },
  rapide: { nom: 'Arbalète rapide', rang: 4, nm: 3, niv: 0, nivMin: 12, prix: 9000, tests: 'alchimie 20, façonnage +5, forge +5',
    texte: "Se réarme seule : cadence de tir d'un arc, aucune action de rechargement." },
  repetition: { nom: 'Arme à répétition', rang: 4, nm: 2, niv: 0, nivMin: 9, prix: 4000, tests: 'façonnage +5, forge +5',
    texte: "Chargeur de 6 cartouches : même avantage que la capacité de rang 2 de la voie de l'artilleur (forgesort)." }
};

/* Qualité spéciale propre aux dagues (voie des dagues, rang 1). */
COF.AR_MISERICORDE = {
  nom: 'Miséricorde', prix: 30, tests: 'forge 15, façonnage 10',
  texte: "Contre une victime étourdie, paralysée, renversée, immobilisée ou surprise : 1d4° DM (dé explosif) au lieu de 1d4. Remplace le +1 de qualité."
};
