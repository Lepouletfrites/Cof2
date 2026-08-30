/* ============================================================
   COF2 Compagnon — Données : règles de base
   Chroniques Oubliées Fantasy 2e édition (Black Book Éditions)
   Données mécaniques résumées pour usage personnel.
   ============================================================ */
window.COF = window.COF || {};

COF.RULES = {

  /* --- Les 7 caractéristiques --- */
  caracs: [
    { id: 'FOR', nom: 'Force',        type: 'phys', desc: "Puissance physique. Attaque au contact et DM au contact." },
    { id: 'AGI', nom: 'Agilité',      type: 'phys', desc: "Coordination, réflexes, dextérité. Attaque à distance et DEF." },
    { id: 'CON', nom: 'Constitution', type: 'phys', desc: "Santé, endurance. Détermine PV et dés de récupération." },
    { id: 'PER', nom: 'Perception',   type: 'phys', desc: "Sens et intuition. Détermine l'Initiative. Magie druidique." },
    { id: 'CHA', nom: 'Charisme',     type: 'ment', desc: "Persuasion, destinée. Détermine les points de chance. Magie innée/divine." },
    { id: 'INT', nom: 'Intelligence', type: 'ment', desc: "Érudition, mémoire, raisonnement. Magie profane." },
    { id: 'VOL', nom: 'Volonté',      type: 'ment', desc: "Force de caractère. Attaque magique et points de mana." }
  ],

  /* --- Familles de profils --- */
  familles: {
    aventurier: {
      id: 'aventurier', nom: 'Aventuriers', pv: 4, dr: 8,
      bonus: '+1 point de chance',
      desc: "Polyvalents et débrouillards : voyage, exploration, combat rusé. Caractéristique commune : Agilité.",
      armes: "Liste intermédiaire d'armes", armures: "Armures légères (cuir, cuir renforcé)"
    },
    combattant: {
      id: 'combattant', nom: 'Combattants', pv: 5, dr: 10,
      bonus: 'Vigueur élevée',
      desc: "Taillés pour le combat et l'art de la guerre. Caractéristique commune : Force.",
      armes: "Très nombreuses armes", armures: "Armures lourdes"
    },
    mage: {
      id: 'mage', nom: 'Mages', pv: 3, dr: 6,
      bonus: '+1 capacité de rang 2 au niveau 1',
      desc: "Magie profane. Peu d'armes, pas d'armure (sauf forgesort). Caractéristique commune : Intelligence (Charisme pour l'ensorceleur).",
      armes: "Très peu d'armes", armures: "Aucune (sauf forgesort)"
    },
    mystique: {
      id: 'mystique', nom: 'Mystiques', pv: 4, dr: 8,
      bonus: '+1 dé de récupération',
      desc: "Vie spirituelle intense, magie divine ou naturelle. Caractéristique commune : Volonté.",
      armes: "Armes liées au culte", armures: "Armures légères à intermédiaires"
    }
  },

  /* --- Séries de valeurs de caractéristiques à la création --- */
  series: [
    { id: 'polyvalent',  nom: 'Polyvalent',  vals: [2, 2, 2, 1, 1, 0, -1], total: 7 },
    { id: 'expert',      nom: 'Expert',      vals: [3, 2, 1, 1, 0, 0, -1], total: 6 },
    { id: 'specialiste', nom: 'Spécialiste', vals: [4, 2, 1, 0, 0, -1, -1], total: 5 }
  ],

  /* --- Échelle des valeurs --- */
  echelle: {
    '-3': 'Catastrophique', '-2': 'Très faible', '-1': 'Faible',
    '0': 'Moyen', '1': 'Au-dessus de la moyenne', '2': 'Bon',
    '3': 'Très bon', '4': 'Excellent (max humain)', '5': 'Extraordinaire (max non-humain)'
  },

  /* --- Table des difficultés --- */
  difficultes: [
    { v: 5,  nom: 'Facile' },
    { v: 10, nom: 'Moyenne' },
    { v: 15, nom: 'Difficile' },
    { v: 20, nom: 'Très difficile' },
    { v: 25, nom: 'Extrême' },
    { v: 30, nom: 'Abominable' }
  ],

  /* --- Niveau requis par rang de capacité --- */
  rangNiveau: { 1: 1, 2: 2, 3: 3, 4: 5, 5: 7, 6: 9, 7: 11, 8: 13 },
  /* Coût en points de capacité */
  rangCout: { 1: 1, 2: 1, 3: 2, 4: 2, 5: 2, 6: 2, 7: 2, 8: 2 },
  /* Voies de prestige : niveau requis */
  prestigeNiveau: { 4: 5, 5: 7, 6: 9, 7: 11, 8: 13 },

  /* --- Dé évolutif d4° --- */
  deEvolutif: [
    { min: 1,  max: 5,   de: 4 },
    { min: 6,  max: 8,   de: 6 },
    { min: 9,  max: 11,  de: 8 },
    { min: 12, max: 14,  de: 10 },
    { min: 15, max: 99,  de: 12 }
  ],

  /* --- Types d'action --- */
  actions: {
    'A': { nom: "Action d'attaque",   court: 'A', desc: "Attaquer ou action peu rapide (se relever, ramasser une arme)." },
    'L': { nom: 'Action limitée',     court: 'L', desc: "Action complexe : occupe tout le tour (sauf actions gratuites)." },
    'M': { nom: 'Action de mouvement', court: 'M', desc: "Se déplacer de 10 m ou action rapide (dégainer, ouvrir une porte)." },
    'G': { nom: 'Action gratuite',    court: 'G', desc: "Très rapide, en plus des actions normales." },
    'P': { nom: 'Passif',             court: '—', desc: "Effet permanent, aucune action nécessaire." }
  },

  /* --- États préjudiciables --- */
  etats: [
    { id: 'aveugle',    nom: 'Aveuglé',    effet: "-5 Init., attaque et DEF ; -10 en attaque à distance. Attaques magiques nécessitant de voir : impossibles." },
    { id: 'affaibli',   nom: 'Affaibli',   effet: "Dé malus à tous les tests." },
    { id: 'essouffle',  nom: 'Essoufflé',  effet: "Déplacement limité à 5 m par action de mouvement." },
    { id: 'etourdi',    nom: 'Étourdi',    effet: "Aucune action possible et -5 en DEF." },
    { id: 'immobilise', nom: 'Immobilisé', effet: "Pas de déplacement, dé malus aux tests d'attaque." },
    { id: 'invalide',   nom: 'Invalide',   effet: "Déplacement limité à 5 m par action de mouvement." },
    { id: 'paralyse',   nom: 'Paralysé',   effet: "Aucune action ; toute attaque le touche automatiquement et inflige un critique." },
    { id: 'ralenti',    nom: 'Ralenti',    effet: "Une seule action par round." },
    { id: 'renverse',   nom: 'Renversé',   effet: "-5 en attaque et DEF ; action d'attaque pour se relever." },
    { id: 'surpris',    nom: 'Surpris',    effet: "Pas d'action et -5 en DEF au premier round." }
  ],

  /* --- Modificateurs d'attaque à distance --- */
  modsDistance: [
    { nom: 'Longue portée (jusqu\'au double)', mod: 0, deMalus: true },
    { nom: 'Cible à couvert (faible)',        mod: -2 },
    { nom: 'Cible à couvert (forte)',         mod: -5 },
    { nom: 'Cible en pleine mêlée',           mod: -2 },
    { nom: 'Cible masquée par un allié',      mod: -5 },
    { nom: 'Tireur au contact',               mod: 0, deMalus: true },
    { nom: 'Brouillard léger / pénombre',     mod: -5 }
  ],

  /* --- Bonus de compétence cumulables (une source de chaque) --- */
  bonusCompetence: [
    { source: 'Voie de profil',  valeur: '2 + rang (max +7)' },
    { source: 'Voie de peuple',  valeur: '+3' },
    { source: 'Voie de prestige', valeur: '+5' },
    { source: 'Objet magique',   valeur: '+5 (cumulable, total max +15)' }
  ],

  /* --- Aide-mémoire --- */
  memo: {
    test: "d20 + Carac. + modificateurs ≥ Difficulté",
    critique: "20 naturel = réussite critique. En combat : DM doublés (bonus inclus, mais pas les dés bonus).",
    echec: "1 naturel = échec critique (hors combat). En combat, complication à la discrétion du MJ.",
    deBonus: "Dé bonus : lancez 2d20, gardez le plus haut. Dé malus : gardez le plus bas. Non cumulables, ils s'annulent.",
    attaques: "Contact = niveau + FOR · Distance = niveau + AGI · Magique = niveau + VOL (le niveau plafonne à 10).",
    dmContact: "DM arme + FOR. À distance : pas de bonus de carac. par défaut.",
    pv: "PV = (2 × PV de famille) + CON au niveau 1, puis +(PV de famille + CON) par niveau.",
    dr: "DR = 2 + CON (mystiques : 3 + CON). Récup. rapide (30 min) : 1 DR → [dé + ½ niveau] PV.",
    pc: "PC = 2 + CHA (aventuriers : +1). Dépenser 1 PC = +10 au résultat d'un test.",
    pm: "PM = VOL + nombre de sorts connus. Lancer un sort coûte son rang en PM.",
    concentration: "Concentration : un sort (A) devient (L) et coûte 2 PM de moins.",
    brulure: "Brûlure de mana : 1 DR de PV sacrifiés par PM manquant (interdit pour les sorts de soins)."
  }
};

/* Valeur du dé évolutif pour un niveau donné */
COF.deEvolutif = function (niveau) {
  var t = COF.RULES.deEvolutif;
  for (var i = 0; i < t.length; i++) {
    if (niveau >= t[i].min && niveau <= t[i].max) return t[i].de;
  }
  return 4;
};
