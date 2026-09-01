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

  /* Peuples ajoutés par le supplément Couronne, guide de la cité franche. */
  automaton: {
    id: 'automaton', nom: 'Automaton',
    desc: "Une conscience ancienne transférée dans un corps de fer rouge, presque immortelle.",
    typiques: 'guerrier, chevalier',
    mods: [{ plus: ['FOR', 'CON'], moins: ['CHA', 'AGI'] }],
    voie: {
      id: 'automaton', nom: 'Voie de l’automaton', caps: [
        { r: 1, n: 'Artificiel', d: "Créature non vivante : n'a besoin ni de boire, ni de manger, ni de respirer, mais doit consommer chaque jour une once de fer rouge (sinon -2 cumulatif par jour aux tests d'INT). Immunisé aux poisons, aux maladies, aux saignements et aux effets de contrôle mental ; ne peut être soigné que par magie ou réparation, jamais par les soins traditionnels. Incapable de nager, mais marche au fond de l'eau (terrain difficile). +1 en DEF, inflige des DM létaux à mains nues. Vision dans le noir total comme en pénombre jusqu'à 10 m." },
        { r: 2, n: 'Résistant', d: "Le bonus en DEF de l'automaton passe à +2." },
        { r: 3, n: 'Protégé de l’Érable', d: "Réduit de 3 (RD 3) tous les DM physiques et de feu subis." },
        { r: 4, n: 'Puissance mécanique', d: "+1d4° aux DM en attaque au contact. Peut porter jusqu'à 200 kg sans se fatiguer.", dmg: '1d4°' },
        { r: 5, n: 'Être de fer rouge', d: "+1 en FOR et +1 en CON." }
      ]
    }
  },

  demielfe: {
    id: 'demielfe', nom: 'Demi-elfe',
    desc: "Un être entre deux cultures, souvent d'une grande sensibilité.",
    typiques: 'barde, prêtre',
    mods: [{ plus: ['PER', 'CHA'], moins: ['FOR', 'CON'] }],
    voieSpeciale: "Le demi-elfe n'a pas de voie dédiée : il choisit la voie de l'humain, de l'elfe sylvain ou de l'elfe haut.",
    voieChoix: ['humain', 'elfesylvain', 'elfehaut'],
    voie: null
  },

  demiogre: {
    id: 'demiogre', nom: 'Demi-ogre',
    desc: "Une force herculéenne issue d'un lignage de géants, en lutte constante contre sa propre nature.",
    typiques: 'barbare, guerrier',
    modsFixes: [{ c: 'FOR', v: 2 }, { c: 'CON', v: 1 }, { c: 'AGI', v: -2 }, { c: 'INT', v: -1 }, { c: 'CHA', v: -1 }, { c: 'VOL', v: -1 }],
    voie: {
      id: 'demiogre', nom: 'Voie du demi-ogre', caps: [
        { r: 1, n: 'Réaction violente', d: "Taille grande : résiste aux effets de saisie comme une créature de grande taille. Peut utiliser une épée bâtarde ou une épée à deux mains à une seule main (1d12 DM), et une arme à deux mains à sa taille (2d8 DM) ; malus de -1 à tous les tests physiques (FOR/AGI) et en attaque dans un lieu à taille humaine, malus égal à sa FOR (et arme à deux mains interdite) dans un espace exigu. Vision dans le noir total comme en pénombre jusqu'à 30 m. Si une créature se moque de lui ou le provoque sur son origine ou son apparence, test de VOL difficulté [10 - rang atteint dans la voie] sinon crise de folie passagère : +2 en attaque et aux DM, attaque sa cible et quiconque s'interpose pendant 1d6 rounds. Peut stopper la crise à tout moment en subissant 1d4° DM par round restant.", dmg: '1d4°' },
        { r: 2, n: 'Violence ciblée', f: 'jour', d: "Chaque fois qu'il résiste à une crise de Réaction violente, gagne un point de violence, dépensable en action gratuite le même jour pour obtenir les effets d'une Réaction violente (1d4 rounds) contre une cible de son choix. Aucun point gagné si un allié le provoque délibérément." },
        { r: 3, n: 'Vorace', f: 'jour', d: "1×/jour, s'il avale à lui seul un sanglier ou l'équivalent (chevreuil, demi-bœuf...) lors d'un repas, récupère 3d4° PV.", dmg: '3d4°' },
        { r: 4, n: 'Toujours plus lourd', d: "Inflige 2d6 DM avec une arme à deux mains tenue à une main (1d10 à la vivelame) et 3d6 DM avec une arme à deux mains à sa taille ; ignore la RD imposée par les créatures de grande taille." },
        { r: 5, n: 'Monumental', d: "+1 en CON et +1 en FOR." }
      ]
    }
  },

  demiorc: {
    id: 'demiorc', nom: 'Demi-orc',
    desc: "Une force de la nature en butte aux préjugés.",
    typiques: 'barbare, guerrier',
    mods: [{ plus: ['FOR', 'CON'], moins: ['CHA', 'INT'] }],
    voie: {
      id: 'demiorc', nom: 'Voie du demi-orc', caps: [
        { r: 1, n: 'Impressionnant', d: "+3 aux tests d'intimidation. Vision dans le noir total comme en pénombre jusqu'à 30 m." },
        { r: 2, n: 'Talent pour la violence', choix: true, choixVoie: { profils: ['barbare', 'guerrier'], rangMax: 1 }, d: "Choisir une capacité de rang 1 de n'importe quelle voie de barbare ou de guerrier." },
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
        { r: 3, n: 'Talent pour la magie', choix: true, choixVoie: { profils: ['magicien', 'ensorceleur'], rangMax: 2 }, d: "Choisir une capacité de rang 1 de magicien ou d'ensorceleur, utilisable en armure (sauf bonus de DEF). Ou une capacité de rang 2 sans armure." },
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
        { r: 2, n: 'Enfant de la forêt', choix: true, choixVoie: { profils: ['druide', 'rodeur'], rangMax: 1 }, d: "Choisir une capacité de rang 1 de druide ou de rôdeur, utilisable jusqu'au cuir renforcé." },
        { r: 3, n: 'Archer émérite', d: "Critique sur 19-20 à l'arc, +1d4° aux DM en cas de critique. Maîtrise l'arc court quel que soit le profil.", dmg: '1d4°' },
        { r: 4, n: 'Flèche sanglante', a: 'L', d: "Attaque à distance provoquant un saignement : 1d4° DM par round jusqu'à soins. Non cumulable.", dmg: '1d4°' },
        { r: 5, n: 'Supériorité elfique', d: "+1 en AGI et +1 en PER." }
      ]
    }
  },

  fee: {
    id: 'fee', nom: 'Fée',
    desc: "Un minuscule être ailé et magique, gardien espiègle de la nature en pleine ville.",
    typiques: 'ensorceleur, voleur',
    modsFixes: [{ c: 'AGI', v: 1 }, { c: 'CHA', v: 1 }, { c: 'CON', v: -1 }, { c: 'FOR', v: -2 }],
    voie: {
      id: 'fee', nom: 'Voie de la fée', caps: [
        { r: 1, n: 'Fleur', d: "Créature très petite : force totale limitée à -2, n'inflige que 1d4 DM avec une arme à une main ou 1d6 DM avec une arme à deux mains (DM liés à la précision) ; quand un dé bonus (d4°) atteint son maximum sur une de ses attaques physiques, il est considéré comme un résultat de 1. +2 en DEF et +5 à tous les tests de discrétion. Vole à 10 m par action de mouvement, vision dans le noir total comme en pénombre jusqu'à 20 m, résistance de 1 point par rang atteint dans cette voie (RD) aux DM des armes qui ne sont pas en fer froid." },
        { r: 2, n: 'Pirouette', f: 'combat', d: "1×/combat, après avoir été touchée par une attaque, ignore entièrement les DM subis." },
        { r: 3, n: 'Poudre de fée', choix: true, choixVoie: { profils: ['magicien', 'ensorceleur'], rangMax: 2 }, d: "Choisir une capacité de rang 1 de magicien ou d'ensorceleur, utilisable 3×/jour en armure (sauf capacité offrant un bonus de DEF). Ou une capacité de rang 2, sans armure." },
        { r: 4, n: 'Fée révérée', f: 'jour', d: "3×/jour, prend taille humaine pendant [1d4°+CHA] minutes : +3 en FOR (attaque et DM) et inflige des DM normaux selon l'arme utilisée.", dmg: '1d4°' },
        { r: 5, n: 'Lady fée', d: "+1 en PER et +1 en CHA." }
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
        { r: 1, n: 'Don étrange', choix: true, choixVoie: { profils: ['ensorceleur'], rangMax: 1 }, d: "+3 aux tests scientifiques (INT). Choisir une capacité de rang 1 d'ensorceleur (1×/jour seulement si armure). Vision dans le noir jusqu'à 10 m." },
        { r: 2, n: 'Petit pote', d: "+3 à tous les tests d'interaction sociale (sauf intimidation). +1 point de chance." },
        { r: 3, n: 'Insignifiant', d: "+2 en DEF contre les créatures de taille grande ou supérieure (+3 au rang 5)." },
        { r: 4, n: 'Merveille technologique', d: "Maîtrise les arbalètes (et armes à poudre si autorisées) quel que soit le profil. Ajoute son AGI aux DM de ces armes." },
        { r: 5, n: 'Bonne nature', d: "+1 en CON et +1 en CHA." }
      ]
    }
  },

  gobelin: {
    id: 'gobelin', nom: 'Gobelin',
    desc: "Un petit peuple rusé et bruyant, aussi attachant que redouté.",
    typiques: 'voleur, rôdeur',
    modsFixes: [{ c: 'AGI', v: 1 }, { c: 'PER', v: 1 }, { c: 'FOR', v: -1 }, { c: 'VOL', v: -1 }],
    voie: {
      id: 'gobelin', nom: 'Voie du gobelin', caps: [
        { r: 1, n: 'Vivacité gobeline', d: "Taille petite : ne peut utiliser à une main qu'une arme infligeant au maximum 1d6 DM (épée courte, masse... mais pas la rapière), doit utiliser les deux mains pour 1d8-1d10 (épée longue) et ne peut pas utiliser d'arme infligeant plus de 1d10 DM, ni d'arc long ou d'arbalète lourde. +3 en initiative et à tous les tests de discrétion. Vision dans le noir total comme en pénombre jusqu'à 30 m." },
        { r: 2, n: 'Attaque groupée', d: "+2 en attaque au contact contre une cible déjà visée par un allié (ou par sa monture à partir du rang 4)." },
        { r: 3, n: 'Kafouiller', d: "Dé bonus et +1d4° aux DM en attaque, au contact ou à distance, contre une créature renversée.", dmg: '1d4°' },
        { r: 4, n: 'Worg', d: "Attire un worg à son service, qu'il peut chevaucher comme une monture ; il peut lui ordonner une attaque de morsure gratuite (G) une fois par round en plus de ses propres actions (le déplacer lui coûte en revanche ses propres actions). Worg : DEF 17, PV = niveau du gobelin × 5, Init. égale à celle du gobelin, morsure à [attaque magique du gobelin + 2] infligeant 1d4°+5 DM.", dmg: '1d4°' },
        { r: 5, n: 'Vif et alerte', d: "+1 en AGI et +1 en PER." }
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
        { r: 3, n: 'Touche-à-tout', choix: true, choixVoie: { rangMax: 2 }, d: "Obtenir une capacité de rang 1 ou 2 de n'importe quel profil (limitations d'armure applicables au rang 2 ou si bonus de DEF)." },
        { r: 4, n: 'Loup parmi les loups', f: 'round', d: "1×/round, +1d4° aux DM contre un adversaire humanoïde de taille moyenne (DM initiaux seulement).", dmg: '1d4°' },
        { r: 5, n: 'Polyvalence', d: "+1 à la caractéristique la plus faible et +1 en VOL." }
      ]
    }
  },

  kobold: {
    id: 'kobold', nom: 'Kobold',
    desc: "Un reptilien discret et ingénieux, lointain descendant des dragons.",
    typiques: 'voleur, forgesort',
    modsFixes: [{ c: 'AGI', v: 1 }, { c: 'PER', v: 1 }, { c: 'FOR', v: -1 }, { c: 'CON', v: -1 }],
    voie: {
      id: 'kobold', nom: 'Voie du kobold', caps: [
        { r: 1, n: 'Se planquer', d: "Taille petite : ne peut utiliser à une main qu'une arme infligeant au maximum 1d6 DM (épée courte, masse... mais pas la rapière), doit utiliser les deux mains pour 1d8-1d10 (épée longue) et ne peut pas utiliser d'arme infligeant plus de 1d10 DM, ni d'arc long ou d'arbalète lourde. +3 à tous les tests de discrétion et d'embuscade, ainsi qu'aux tests de conception (INT), de fabrication (AGI) et de perception (PER) de pièges ou de mécanismes. Vision dans le noir total comme en pénombre jusqu'à 30 m." },
        { r: 2, n: 'Écailles', d: "+1 en DEF, porté à +2 au rang 4." },
        { r: 3, n: 'Piège improvisé', a: 'L', d: "Installe un piège en une action limitée (test d'AGI difficulté 15, automatique en 10 minutes). Une créature qui pénètre dans la zone piégée (2 m de côté) doit réussir un test d'AGI ou de PER (au choix) difficulté [10 + INT du kobold] ou subit, au choix décidé lors de la pose, 2d4° DM, l'immobilisation 1 round, ou un ralentissement de 1d4 rounds. Une créature qui a vu le kobold poser le piège l'évite automatiquement.", dmg: '2d4°' },
        { r: 4, n: 'Attaque vicieuse', d: "+2 en attaque et +1d4° aux DM lorsqu'il attaque par surprise ou combat le même ennemi qu'un allié au contact ; cumulable avec Attaque sournoise.", dmg: '1d4°' },
        { r: 5, n: 'Ruse instinctive', d: "+1 en AGI et +1 en PER." }
      ]
    }
  },

  lutin: {
    id: 'lutin', nom: 'Lutin',
    desc: "Cousin farceur de la fée, profondément lié à la nature et à la magie sauvage.",
    typiques: 'druide, rôdeur',
    modsFixes: [{ c: 'AGI', v: 1 }, { c: 'PER', v: 1 }, { c: 'CON', v: -1 }, { c: 'FOR', v: -2 }],
    voie: {
      id: 'lutin', nom: 'Voie du lutin', caps: [
        { r: 1, n: 'Choux', d: "Créature très petite : force totale limitée à -1, n'inflige que 1d4 DM avec une arme à une main ou 1d6 DM avec une arme à deux mains (DM liés à la précision) ; quand un dé bonus (d4°) atteint son maximum sur une de ses attaques physiques, il est considéré comme un résultat de 1. +2 en DEF et +5 à tous les tests de discrétion. Se téléporte de 10 m par action de mouvement (doit voir son lieu d'arrivée), vision dans le noir total comme en pénombre jusqu'à 20 m, résistance de 1 point par rang atteint dans cette voie (RD) aux DM des armes qui ne sont pas en fer froid." },
        { r: 2, n: 'Langage des animaux', choix: true, choixVoie: { profils: ['rodeur', 'druide'], rangMax: 1 }, d: "Obtient la capacité de druide Langage des animaux (Voie des animaux) s'il ne la possède pas déjà ; sinon, choisir une capacité de rang 1 de rôdeur ou de druide, utilisable en armure si c'est un sort." },
        { r: 3, n: 'Invisibilité', a: 'L', f: 'jour', d: "3×/jour, se rend invisible comme la capacité de magicien du même nom (Voie de la magie universelle), sans coût ni gain de PM, quelle que soit l'armure portée. S'il possède déjà cette capacité, obtient à la place, au choix, Télékinésie (Voie de l'air) ou Confusion (Voie de l'envoûteur), deux capacités de rang 3 d'ensorceleur, utilisables dans les mêmes conditions." },
        { r: 4, n: 'Monture féérique', d: "Apprivoise un animal qui lui sert de monture, souvent volante (un aigle...). Communique avec elle par télépathie jusqu'à 50 m de portée." },
        { r: 5, n: 'Seigneur féérique', d: "+1 en CHA et +1 en VOL." }
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
