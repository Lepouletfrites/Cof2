/* ============================================================
   COF2 Compagnon — Données : peuples & voies de peuple
   ============================================================ */
window.COF = window.COF || {};

/* Format d'une capacité :
   r    rang (1-5)
   n    nom
   a    type d'action : 'A' | 'L' | 'M' | 'G' | null (passif)
   s    true si c'est un sort (coûte [rang] PM)
   f    fréquence : 'combat' | 'jour' | 'round' | null
   dmg  formule de dommages/soins pour le lanceur de dés
   d    description (résumé mécanique)
   choix true si la capacité demande de choisir une autre capacité
*/

COF.PEUPLES = {

  demielfe: {
    id: 'demielfe', nom: 'Demi-elfe',
    desc: "Un être entre deux cultures, souvent d'une grande sensibilité.",
    typiques: 'barde, prêtre',
    mods: [{ plus: ['PER', 'CHA'], moins: ['FOR', 'CON'] }],
    voieSpeciale: "Le demi-elfe n'a pas de voie dédiée : il choisit la voie de l'humain, de l'elfe sylvain ou de l'elfe haut.",
    voieChoix: ['humain', 'elfesylvain', 'elfehaut'],
    voie: null
  },

  demiorc: {
    id: 'demiorc', nom: 'Demi-orc',
    desc: "Une force de la nature en butte aux préjugés.",
    typiques: 'barbare, guerrier',
    mods: [{ plus: ['FOR', 'CON'], moins: ['CHA', 'INT'] }],
    voie: {
      id: 'demiorc', nom: 'Voie du demi-orc', caps: [
        { r: 1, n: 'Impressionnant', d: "+3 aux tests d'intimidation. Vision dans le noir total comme en pénombre jusqu'à 30 m." },
        { r: 2, n: 'Talent pour la violence', choix: true, d: "Choisir une capacité de rang 1 de n'importe quelle voie de barbare ou de guerrier." },
        { r: 3, n: 'Critique brutal', d: "Zone de critique au contact augmentée de 1 (19-20) et +1d4° aux DM en cas de critique.", dmg: '1d4°' },
        { r: 4, n: 'Attaque sanglante', a: 'L', d: "Attaque de contact provoquant un saignement : 1d4° DM par round suivant jusqu'à soins. Non cumulable.", dmg: '1d4°' },
        { r: 5, n: 'Colosse', d: "+1 en FOR et +1 en CON." }
      ]
    }
  },

  elfehaut: {
    id: 'elfehaut', nom: 'Elfe haut',
    desc: "Un peuple d'intellectuels et d'artistes, très longue vie.",
    typiques: 'barde, magicien, ensorceleur',
    mods: [{ plus: ['INT', 'CHA'], moins: ['FOR'] }],
    voie: {
      id: 'elfehaut', nom: 'Voie de l’elfe haut', caps: [
        { r: 1, n: 'Lumière intérieure', d: "La nuit étoilée compte comme de la pénombre. +3 aux tests d'érudition (INT) et artistiques (CHA)." },
        { r: 2, n: 'Force d’âme', d: "Immunisé à la peur et au sommeil magique. Bonus égal au rang aux tests opposés d'attaque magique pour résister à un sort." },
        { r: 3, n: 'Talent pour la magie', choix: true, d: "Choisir une capacité de rang 1 de magicien ou d'ensorceleur, utilisable en armure (sauf bonus de DEF). Ou une capacité de rang 2 sans armure." },
        { r: 4, n: 'Immortel', d: "Moitié moins de repos, nourriture et boisson. Immunisé aux poisons et maladies." },
        { r: 5, n: 'Supériorité elfique', d: "+1 en VOL et +1 en INT ou CHA." }
      ]
    }
  },

  elfesylvain: {
    id: 'elfesylvain', nom: 'Elfe sylvain',
    desc: "Le peuple de la forêt, vif et en alerte, maître du camouflage et de l'arc.",
    typiques: 'druide, rôdeur',
    mods: [{ plus: ['AGI', 'PER'], moins: ['FOR'] }],
    voie: {
      id: 'elfesylvain', nom: 'Voie de l’elfe sylvain', caps: [
        { r: 1, n: 'Lumière des étoiles', d: "La nuit étoilée compte comme de la pénombre. +3 aux tests de survie en forêt (escalade, discrétion, chasse…)." },
        { r: 2, n: 'Enfant de la forêt', choix: true, d: "Choisir une capacité de rang 1 de druide ou de rôdeur, utilisable jusqu'au cuir renforcé." },
        { r: 3, n: 'Archer émérite', d: "Critique sur 19-20 à l'arc, +1d4° aux DM en cas de critique. Maîtrise l'arc court quel que soit le profil.", dmg: '1d4°' },
        { r: 4, n: 'Flèche sanglante', a: 'L', d: "Attaque à distance provoquant un saignement : 1d4° DM par round jusqu'à soins. Non cumulable.", dmg: '1d4°' },
        { r: 5, n: 'Supériorité elfique', d: "+1 en AGI et +1 en PER." }
      ]
    }
  },

  gnome: {
    id: 'gnome', nom: 'Gnome',
    desc: "Un petit peuple passé maître dans les sciences et curieux de magie.",
    typiques: 'forgesort, arquebusier',
    mods: [{ plus: ['INT', 'PER'], moins: ['FOR'] }],
    voie: {
      id: 'gnome', nom: 'Voie du gnome', caps: [
        { r: 1, n: 'Don étrange', choix: true, d: "+3 aux tests scientifiques (INT). Choisir une capacité de rang 1 d'ensorceleur (1×/jour seulement si armure). Vision dans le noir jusqu'à 10 m." },
        { r: 2, n: 'Petit pote', d: "+3 à tous les tests d'interaction sociale (sauf intimidation). +1 point de chance." },
        { r: 3, n: 'Insignifiant', d: "+2 en DEF contre les créatures de taille grande ou supérieure (+3 au rang 5)." },
        { r: 4, n: 'Merveille technologique', d: "Maîtrise les arbalètes (et armes à poudre si autorisées) quel que soit le profil. Ajoute son AGI aux DM de ces armes." },
        { r: 5, n: 'Bonne nature', d: "+1 en CON et +1 en CHA." }
      ]
    }
  },

  halfelin: {
    id: 'halfelin', nom: 'Halfelin',
    desc: "Un petit peuple discret, plein d'astuce et de courage.",
    typiques: 'voleur, rôdeur',
    mods: [{ plus: ['AGI', 'VOL'], moins: ['FOR'] }],
    voie: {
      id: 'halfelin', nom: 'Voie du halfelin', caps: [
        { r: 1, n: 'Petite taille', d: "+1 en DEF, +3 en discrétion et pour subtiliser. Limité : armes à une main ≤ 1d6, deux mains pour 1d8-1d10, interdit au-delà de 1d10 (ni arc long ni arbalète lourde)." },
        { r: 2, n: 'Résistance légendaire', d: "Bonus égal au rang à tous les tests opposés d'attaque magique pour résister à un sort." },
        { r: 3, n: 'Bon pour le moral', d: "À chaque bon repas (4×/jour max, espacés de 3 h), récupère 1d4° PV.", dmg: '1d4°' },
        { r: 4, n: 'Petit veinard', d: "+1 PC. Peut esquiver une attaque par combat (avant de connaître les DM, mais pas un critique)." },
        { r: 5, n: 'Vif et bien nourri', d: "+1 en AGI et +1 en CON." }
      ]
    }
  },

  humain: {
    id: 'humain', nom: 'Humain',
    desc: "Le peuple le plus polyvalent et le plus répandu.",
    typiques: 'tous',
    mods: [{ plus: ['*faibles'], moins: [] }],
    modsTexte: "+1 à l'une des deux caractéristiques les plus faibles.",
    voie: {
      id: 'humain', nom: 'Voie de l’humain', caps: [
        { r: 1, n: 'Diversité', d: "+3 aux tests de deux domaines liés à l'origine (montagnard, citadin, campagnard, riverain, sauvage, nomade…). +1 point de chance." },
        { r: 2, n: 'Instinct de survie', f: 'combat', d: "1×/combat, une attaque qui devrait le mettre à 0 PV inflige des DM divisés par 2 (min 1). Puis +2 en DEF pour le reste du combat." },
        { r: 3, n: 'Touche-à-tout', choix: true, d: "Obtenir une capacité de rang 1 ou 2 de n'importe quel profil (limitations d'armure applicables au rang 2 ou si bonus de DEF)." },
        { r: 4, n: 'Loup parmi les loups', f: 'round', d: "1×/round, +1d4° aux DM contre un adversaire humanoïde de taille moyenne (DM initiaux seulement).", dmg: '1d4°' },
        { r: 5, n: 'Polyvalence', d: "+1 à la caractéristique la plus faible et +1 en VOL." }
      ]
    }
  },

  nain: {
    id: 'nain', nom: 'Nain',
    desc: "Un peuple bourru, idéaliste et résistant.",
    typiques: 'guerrier, prêtre',
    mods: [{ plus: ['CON', 'VOL'], moins: ['AGI'] }],
    voie: {
      id: 'nain', nom: 'Voie du nain', caps: [
        { r: 1, n: 'Habitant des tunnels', d: "Vision dans le noir jusqu'à 30 m. +3 aux tests liés à la pierre, l'architecture, les mines, les passages secrets et pièges dans les parois." },
        { r: 2, n: 'Haches et marteaux', d: "+1 en attaque et aux DM avec une hache ou un marteau de guerre. Sait les utiliser quel que soit son profil." },
        { r: 3, n: 'Résistance à la magie', f: 'jour', d: "1×/jour, ignore les effets d'un sort qui le cible (pas un sort de zone). Sans effet contre les créatures de NC ≥ 2× son niveau." },
        { r: 4, n: 'Fils du roc', d: "Réduit tous les DM subis de 2 (3 au niveau 10), minimum 1 DM. Cumulable avec d'autres RD." },
        { r: 5, n: 'Ténacité', d: "+1 en CON et +1 en VOL." }
      ]
    }
  }
};

/* Voie du mage — remplace la voie de peuple pour la famille des mages */
COF.VOIE_MAGE = {
  id: 'mage', nom: 'Voie du mage',
  note: "Un personnage de la famille des mages peut remplacer sa voie de peuple par la voie du mage. Il conserve gratuitement la capacité de rang 1 de sa voie de peuple, mais ne pourra pas en acquérir les rangs suivants.",
  caps: [
    { r: 1, n: 'Capacité de peuple + occultisme', d: "Conserve la capacité de peuple de rang 1. De plus, ajoute son rang + 2 aux tests de connaissance et d'érudition liés à la magie." },
    { r: 2, n: 'Maîtrise de la magie', a: 'L', s: true, d: "Détecte la magie dans un rayon de 10 m ; test d'INT difficulté [10 + rang du sort] pour en déterminer la fonction. Peut dissiper un sort non permanent (test opposé d'attaque magique)." },
    { r: 3, n: 'Tour de magie', a: 'G', s: true, d: "1 tour de magie par round (portée 10 m) sans coût en PM, sans DM direct et sans effort (carac. 0 max). De plus +1 en DEF et +2 PM supplémentaires." },
    { r: 4, n: 'Esprit supérieur', d: "+1 en INT et +1 en VOL. Dé bonus aux tests d'INT." },
    { r: 5, n: 'Tempête de mana', d: "En lançant un sort, +1d4° aux DM en payant +1 PM (cible unique) ou +3 PM (sort de zone).", dmg: '1d4°' }
  ]
};
