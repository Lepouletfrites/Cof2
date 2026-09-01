/* ============================================================
   COF2 Compagnon — Voies de prestige : GÉNÉRIQUES
   Accessibles à n'importe quel profil.
   Une seule voie de prestige par personnage, à partir du niveau 5.
   Rangs 4 à 8 (niveaux requis : 5, 7, 9, 11, 13).
   ============================================================ */
window.COF = window.COF || {};
COF.PRESTIGE = COF.PRESTIGE || {};

COF.PRESTIGE.expert = {
  id: 'expert', nom: "Voie de l'expert", fam: 'generique',
  desc: "Élargit les capacités du personnage à l'ensemble des profils de sa famille.",
  prereq: "Avoir le rang 2 dans au moins trois voies du même profil, et aucune voie hors de la famille du profil principal.",
  note: "Chaque capacité choisie doit provenir d'une voie différente de la même famille. Les restrictions d'armure des voies d'origine s'appliquent. Inaccessible aux profils hybrides sortis de leur famille.",
  caps: [
    { r: 4, n: 'Capacité de néophyte', choix: true, choixVoie: { memeFamille: true, rangMin: 1, rangMax: 1 }, d: "Choisir une capacité de rang 1 de n'importe quelle voie d'un profil de sa famille." },
    { r: 5, n: "Capacité d'initié", choix: true, choixVoie: { memeFamille: true, rangMin: 2, rangMax: 2 }, d: "Choisir une capacité de rang 2 de n'importe quelle voie d'un profil de sa famille." },
    { r: 6, n: 'Capacité de professionnel', choix: true, choixVoie: { memeFamille: true, rangMin: 3, rangMax: 3 }, d: "Choisir une capacité de rang 3 de n'importe quelle voie d'un profil de sa famille." },
    { r: 7, n: "Capacité d'expert", choix: true, choixVoie: { memeFamille: true, rangMin: 4, rangMax: 4 }, d: "Choisir une capacité de rang 4 de n'importe quelle voie d'un profil de sa famille." },
    { r: 8, n: 'Capacité de maître', choix: true, choixVoie: { memeFamille: true, rangMin: 5, rangMax: 5 }, d: "Choisir une capacité de rang 5 de n'importe quelle voie d'un profil de sa famille." }
  ]
};

COF.PRESTIGE.specialiste = {
  id: 'specialiste', nom: 'Voie du spécialiste', fam: 'generique',
  desc: "N'étend pas le domaine de compétence : améliore ce que le personnage sait déjà faire.",
  prereq: "Avoir le rang 4 dans la voie à laquelle s'appliquera la spécialisation (voie issue du profil principal).",
  caps: [
    { r: 4, n: 'Expertise', d: "Au choix : +1 en attaque avec une capacité désignée, ou +5 sur une compétence acquise par une capacité." },
    { r: 5, n: 'Capacité fabuleuse', d: "Une capacité limitée connue devient utilisable en action d'attaque. S'il s'agit d'un sort (A), il bénéficie de la concentration (−2 PM) sans passer en action limitée." },
    { r: 6, n: 'Caractéristique fabuleuse', d: "+1 à la plus haute caractéristique. Sur un résultat de 1 à un test de cette caractéristique, relance possible (le nouveau résultat compte)." },
    { r: 7, n: 'Capacité supérieure', t: 'bonus', dmg: '1d4°', d: "Une capacité connue au choix : +1d4° aux DM une fois par round (sur une seule attaque si elle en permet plusieurs)." },
    { r: 8, n: 'Capacité signature', f: 'combat', d: "Une capacité (A), (M) ou (L) connue : 1×/combat, utilisable en plus des actions normales du tour, sans dépasser ses limitations propres. Coût en PM normal s'il s'agit d'un sort." }
  ]
};

COF.PRESTIGE.lycanthrope = {
  id: 'lycanthrope', nom: 'Voie du lycanthrope', fam: 'generique',
  desc: "Malédiction ou super pouvoir : le personnage mordu par un lycanthrope apprend à maîtriser la Bête.",
  prereq: "Avoir été mordu par un lycanthrope.",
  pv: 5,
  caps: [
    { r: 4, n: 'Forme hybride', a: 'L', f: 'combat', dmg: '1d4°+FOR', d: "Forme mi-homme mi-loup pendant 1 min (récupération rapide entre deux usages). Ni sort ni arme à distance, mais une morsure gratuite par round : [1d4° + FOR] DM. Retour à la normale à 0 PV." },
    { r: 5, n: 'Transformation en loup', a: 'L', dmg: '1d4+3', d: "Forme de loup 1 h par rang et par jour : FOR +3, AGI +1, DEF [12 + rang], Init. 15, DM 1d4+3, +5 aux tests de PER, de poursuite et de pistage. Réduit de 5 les DM des armes non argentées." },
    { r: 6, n: 'Éventration', t: 'bonus', dmg: '1d4°', d: "Sur un résultat de 15-20 à l'attaque de morsure : +1d4° aux DM (forme de loup ou hybride)." },
    { r: 7, n: 'Résistance surnaturelle', d: "Sous forme hybride, réduit de 5 les DM des armes non argentées. Non cumulable avec une autre RD." },
    { r: 8, n: 'Forme puissante', d: "+2 en FOR sous forme de loup ou d'hybride (donc +2 en attaque au contact et aux DM)." }
  ]
};

COF.PRESTIGE.sangdragon = {
  id: 'sangdragon', nom: 'Voie du sang-dragon', fam: 'generique',
  desc: "Un lointain héritage draconique se réveille dans les veines du personnage.",
  prereq: "Découverte d'un héritage caché dans la lignée du personnage (événement de jeu).",
  pv: 5,
  note: "Déclinable en ascendance démoniaque : RD contre l'acide ou le feu, souffle remplacé par une arme enflammée ou acide (+1d4° DM pendant [rang] rounds).",
  caps: [
    { r: 4, n: 'Ascendance draconique', d: "Choisir une couleur de dragon : RD 5 (10 au rang 8) contre l'énergie du souffle correspondant. Vision dans le noir total comme en pénombre jusqu'à 20 m." },
    { r: 5, n: 'Griffes du dragon', a: 'L', f: 'combat', dmg: '1d6°+FOR', d: "1×/combat pendant [rang] rounds : +2 en FOR (attaque et DM) et une attaque de griffes gratuite par round infligeant [1d6° + FOR] DM." },
    { r: 6, n: 'Souffle du dragon', a: 'L', f: 'combat', dmg: '5d4°', d: "1×/combat : souffle conique de 5 m × 5 m infligeant 5d4° DM. Test d'AGI difficulté [8 + rang] pour moitié DM." },
    { r: 7, n: 'Ailes de dragon', a: 'L', f: 'combat', d: "1×/combat : ailes déployées pendant CON minutes (min 1 min), vol de 15 m par action de mouvement." },
    { r: 8, n: 'Écailles de dragon', d: "Sous la moitié de ses PV, le personnage gagne une RD 5 contre tous les types de dommages." }
  ]
};

COF.PRESTIGE.familier = {
  id: 'familier', nom: 'Voie du familier fantastique', fam: 'generique',
  desc: "Un compagnon original qui confère des pouvoirs magiques à son maître.",
  prereq: "S'être attaché les services d'un familier.",
  pv: 4,
  exception: "Exception aux règles générales : les rangs vont de 3 à 7 (le rang 3 est donc accessible dès le niveau 3).",
  note: "Familiers disponibles : animal céleste, animal mort-vivant, araignée géante, diablotin, dragon féérique, fée ou lutin, grig, lézard voltaïque, minimoi, pantin ou poupée, pseudo-dragon, strige. Chacun apporte un pouvoir mineur (rang 4), un profil de magie associé (rang 5), un pouvoir supérieur et une caractéristique (rang 7).",
  caps: [
    { r: 3, n: 'Familier fantastique', a: 'A', d: "Obtient un familier fantastique : AGI +3*, CON +2, FOR -4, PER +2, CHA -2, INT +1, VOL +2. DEF [14 + rang], PV [niveau × 2], Init. du personnage. Partage ses sens et communique avec lui sans limite de distance. Récupère tous ses PV après une récupération rapide." },
    { r: 4, n: 'Pouvoir mineur', d: "Le familier confère un pouvoir magique propre à son espèce." },
    { r: 5, n: 'Résistance', d: "Le familier obtient une RD de 1 par rang contre tous les types de DM. Le personnage apprend un sort de rang 1 (2×/jour) ou de rang 2 (1×/jour) du profil associé au familier." },
    { r: 6, n: 'Inséparables', a: 'M', d: "Téléporte le familier à son contact au prix d'une action de mouvement. Le familier confère 1 PC supplémentaire." },
    { r: 7, n: 'Pouvoir supérieur', d: "Le familier confère un second pouvoir magique et +1 à la caractéristique indiquée dans sa description." }
  ]
};
