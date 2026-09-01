/* ============================================================
   COF2 Compagnon — Voies de prestige : AVENTURIER
   ============================================================ */
window.COF = window.COF || {};
COF.PRESTIGE = COF.PRESTIGE || {};

COF.PRESTIGE.archerarcanique = {
  id: 'archerarcanique', nom: "Voie de l'archer arcanique", fam: 'aventurier',
  desc: "Une magie mystérieuse rend les traits de l'archer mortels et impossibles à esquiver. Déclinable pour l'arbalète.",
  caps: [
    { r: 4, n: 'Flèche magique', d: "Un résultat de 1 au dé de DM devient le maximum du dé (pas les dés bonus). Les DM des flèches sont considérés comme magiques." },
    { r: 5, n: 'Flèche intangible', a: 'L', d: "La flèche traverse obstacles et protections : la difficulté devient [10 + AGI de la cible] et toutes les pénalités de couverture sont ignorées. Peut tirer à travers un mur si la position est connue." },
    { r: 6, n: 'Flèche chercheuse', a: 'L', f: 'jour', t: 'bonus', dmg: '2d4°', d: "1×/jour, contre une cible vue ou blessée depuis moins de 10 rounds : la flèche la trouve où qu'elle soit (même à travers les plans). Test d'attaque normal, +2d4° aux DM." },
    { r: 7, n: 'Flèche élémentaire', a: 'L', f: 'combat', t: 'bonus', dmg: '1d4°', d: "1×/combat : choisit poison, feu, froid, foudre ou acide. +1d4° aux DM de chaque flèche pour tout le combat. Non cumulable avec un autre bonus élémentaire." },
    { r: 8, n: 'Flèche tueuse', a: 'L', d: "Une journée de travail et une relique de l'ennemi désigné : une seule flèche à la fois. Elle touche automatiquement ; la cible de niveau inférieur tombe à 0 PV, sinon test de CON difficulté [10 + rang] — en cas de réussite, critique automatique." }
  ]
};

COF.PRESTIGE.espion = {
  id: 'espion', nom: "Voie de l'espion", fam: 'aventurier',
  desc: "Tout savoir, écouter aux portes, se faufiler dans une foule.",
  caps: [
    { r: 4, n: "Secrets d'alcôves", comp: 'informations secrètes, perception auditive', bon: 5, d: "+5 pour trouver des informations sensibles et +5 aux tests de perception auditive. Lecture sur les lèvres : test de PER difficulté = distance en mètres, avec un bonus égal au rang." },
    { r: 5, n: 'À la garde', d: "Le MJ doit prévenir le joueur 1d4 rounds avant l'arrivée de PNJ sur les lieux, et indiquer la direction de la menace. Sans effet contre une embuscade préparée." },
    { r: 6, n: 'Mémoire eidétique', comp: 'connaissance (INT) et recherche d\'indice (INT)', bon: 5, d: "Mémoire parfaite : le MJ doit rappeler tous les détails d'un lieu visité ou d'une conversation entendue. +5 à ces tests." },
    { r: 7, n: 'Caméléon', d: "Repère, suit et infiltre sans jet tant qu'il n'attire pas l'attention. Action de mouvement + test de CHA difficulté 10 : disparaît dans une foule. S'il attaque au round suivant : dé bonus et attaque sournoise possible." },
    { r: 8, n: 'Réseau', f: 'aventure', d: "Test de CHA difficulté 10 pour obtenir une entrevue avec n'importe quel puissant. 1×/aventure, obtient un service : lettre de recommandation, renseignement d'élite, invitation, escorte armée…" }
  ]
};

COF.PRESTIGE.cassecou = {
  id: 'cassecou', nom: 'Voie du casse-cou', fam: 'aventurier',
  desc: "Toujours partant pour tenter les actions les plus risquées.",
  caps: [
    { r: 4, n: 'Au pied du mur', d: "Quand ses PV sont inférieurs ou égaux à son niveau : dé bonus à tous ses tests (attaque comprise)." },
    { r: 5, n: 'Mouche du coche', d: "+1 en DEF (+1 de plus au rang 7). En sacrifiant une action de mouvement : +2 en DEF supplémentaires jusqu'à son prochain tour." },
    { r: 6, n: "L'amour du risque", d: "Dans un lieu dangereux (bord de précipice, lac de lave…) : dé bonus à tous ses tests. S'applique aussi en permanence aux tests contre la peur." },
    { r: 7, n: "Poussée d'adrénaline", f: 'round', dmg: '1d4', d: "1×/round, en dépensant 1d4 PV : une action de mouvement supplémentaire à son tour." },
    { r: 8, n: 'Attaque kamikaze', a: 'L', t: 'bonus', dmg: '1d4°', d: "Saute sur une créature plus grande : test opposé d'AGI (échec = renversé). Perché : grande +2 Att/DEF, énorme +3, colossale +4, et +1d4° DM. La créature s'en débarrasse par une action d'attaque et un test opposé d'AGI." }
  ]
};

COF.PRESTIGE.ombres = {
  id: 'ombres', nom: 'Voie des ombres', fam: 'aventurier',
  desc: "Le maître des ombres s'infiltre partout, surgit en un instant et disparaît aussi vite.",
  caps: [
    { r: 4, n: 'Vision des ombres', comp: 'discrétion et PER visuelle dans la pénombre', bon: 5, d: "Voit dans le noir total comme en pénombre. Dans la pénombre : +5 aux tests de discrétion et de PER basés sur la vue." },
    { r: 5, n: 'Caméléon', a: 'L', d: "Tant qu'il reste immobile, le personnage est totalement invisible." },
    { r: 6, n: 'Ombre mouvante', a: 'M', f: 'combat', d: "1×/combat : disparaît dans les ombres (inattaquable, sauf DM de zone) et réapparaît au début de son prochain tour à 20 m maximum. S'il attaque : dé bonus et attaque sournoise possible. Avec Disparition (voleur) : utilisable sans limite." },
    { r: 7, n: "Cape d'ombre", a: 'L', f: 'jour', dmg: '1d4°', d: "1×/jour pendant CHA minutes : dé bonus en discrétion, dé malus aux attaques à distance qui le visent. À 0 PV, peut disparaître et réapparaître à 1d6 km avec 1d4° PV, 1d6 min plus tard. Avec Manteau d'ombre (sorcier) : 1×/combat." },
    { r: 8, n: 'Passe-muraille', d: "Ombre mouvante permet désormais de traverser un mur ou un obstacle (d'une ombre à une autre)." }
  ]
};

COF.PRESTIGE.chasseurprime = {
  id: 'chasseurprime', nom: 'Voie du chasseur de prime', fam: 'aventurier',
  desc: "Un traqueur implacable que rien n'arrête une fois sa cible choisie.",
  caps: [
    { r: 4, n: 'Marque du chasseur', a: 'L', t: 'bonus', dmg: '1d4°', d: "Désigne une proie : +5 à tous les tests de compétence pour la retrouver et +1d4° aux DM contre elle. Une seule proie à la fois, changement après une récupération complète." },
    { r: 5, n: 'Assommer', a: 'L', f: 'combat', dmg: '1d4°', d: "Attaque au contact réussie à l'arme contondante (ou au pommeau) : une proie marquée de niveau inférieur est assommée 1d4° min, sinon étourdie 1 round. Une fois par combat et par cible." },
    { r: 6, n: 'Traqueur infatigable', d: "Tant qu'il traque une proie marquée : temps de récupération divisé par deux. Chaque jour de traque donne un bonus cumulatif de +1 en attaque et aux DM sur la première attaque, jusqu'à son rang." },
    { r: 7, n: 'Attaque invalidante', a: 'L', d: "Attaque réussie : en plus des DM, malus cumulatif de -1 à tous les tests et aux DM de la cible pour le reste du combat (jusqu'à -3)." },
    { r: 8, n: 'Instinct du traqueur', a: 'L', d: "1 min de concentration : détermine la direction approximative de sa proie marquée. Averti dès qu'elle s'approche à moins de 50 m." }
  ]
};

COF.PRESTIGE.duelliste = {
  id: 'duelliste', nom: 'Voie du duelliste', fam: 'aventurier',
  desc: "L'art du combat singulier : provoquer, se mesurer, l'emporter seul à seul.",
  caps: [
    { r: 4, n: 'Vive attaque', d: "Avec dague, épée courte, épée longue, rapière (main principale) ou vivelame à deux mains : ajoute son AGI en attaque OU aux DM (au choix, pas les deux) au lieu de sa FOR." },
    { r: 5, n: 'Défi', a: 'L', f: 'combat', t: 'bonus', dmg: '1d6', d: "1×/combat : défie une cible humanoïde (20 m). +1d6 aux DM de chaque attaque au contact contre elle pour le reste du combat. Attaquer une autre cible met fin au défi." },
    { r: 6, n: 'Juste toi et moi', d: "Chaque round où il attaque la cible défiée : +2 en DEF contre toutes les attaques des autres adversaires." },
    { r: 7, n: 'Duel mental', d: "Au début de son tour, test opposé d'INT contre l'adversaire défié. Victoire : dé bonus sur une attaque contre lui d'ici la fin du round. S'il perd de 10 points ou plus, c'est l'adversaire qui obtient le dé bonus." },
    { r: 8, n: 'Botte mortelle', a: 'L', f: 'combat', t: 'bonus', dmg: '1d4°', d: "Chaque attaque réussie contre la cible défiée donne 1 point de préparation. En action limitée, la botte mortelle inflige +1d4° DM par point accumulé. Une seule tentative par combat, les points sont dépensés même en cas d'échec." }
  ]
};

COF.PRESTIGE.flibustier = {
  id: 'flibustier', nom: 'Voie du flibustier', fam: 'aventurier',
  desc: "Pirate, corsaire ou bandit des mers : la poudre autant que le sabre.",
  caps: [
    { r: 4, n: 'Pied marin', comp: 'natation et navigation', bon: '2+rang', d: "+5 à tous les tests d'AGI sur un bateau ou tout support mobile (chariots, cordages, ponts de corde). Ajoute son rang aux tests de natation et de navigation." },
    { r: 5, n: 'Coup de crosse', a: 'G', f: 'round', dmg: '1d4°+FOR', d: "1×/round : attaque au contact gratuite avec la crosse de sa pétoire, dé malus, [1d4° + FOR] DM. Acquiert la maîtrise des armes à poudre." },
    { r: 6, n: "À l'abordage", t: 'bonus', dmg: '1d4°', d: "Première attaque au contact du combat : dé bonus et +1d4° DM. Même effet en se précipitant sur un adversaire depuis un contre-haut (balcon, lustre, table)." },
    { r: 7, n: 'Sabre au poing', a: 'A', d: "En une action d'attaque : tire d'une main avec une arme à poudre (même à bout portant, sans malus) et porte une attaque de contact de l'autre, sans pénalité." },
    { r: 8, n: 'Pas de quartier', a: 'G', t: 'bonus', dmg: '1d4°', d: "Attaque gratuite contre toute créature au contact qui tente de s'éloigner, avec dé bonus et +1d4° DM. Mêmes bonus à toutes ses attaques quand il lui reste moins de [niveau] PV." }
  ]
};

COF.PRESTIGE.heros = {
  id: 'heros', nom: 'Voie du héros', fam: 'aventurier',
  desc: "Pour ceux qui ne reculent jamais et défient la mort avec un sourire provocateur.",
  caps: [
    { r: 4, n: 'Destin héroïque', f: 'combat', dmg: '1d4°', d: "+1 PC (puis +1 aux rangs 6 et 8). 1×/combat : donne +1d4° à un compagnon en vue sur un test de son choix." },
    { r: 5, n: 'Homme / femme de la situation', f: 'aventure', d: "1×/aventure : demander au MJ une idée lumineuse ou la moins mauvaise solution pour rattraper une situation." },
    { r: 6, n: 'Héros célèbre', d: "Dé bonus à tous les tests d'interaction sociale ; accueilli partout à bras ouverts. Choisir « héros du peuple » ou « héros du royaume » — les deux à partir du rang 8." },
    { r: 7, n: 'Ténacité', d: "Après un test d'attaque raté contre une créature : dé bonus au prochain essai avec la même action. Le bonus persiste tant qu'il échoue et disparaît dès la réussite." },
    { r: 8, n: "Meneur d'hommes", a: 'L', f: 'jour', d: "1×/jour : harangue ses compagnons. Tous ses alliés bénéficient d'un dé bonus une fois par round pour toute la scène à venir." }
  ]
};

COF.PRESTIGE.maitrepoisons = {
  id: 'maitrepoisons', nom: 'Voie du maître des poisons', fam: 'aventurier',
  desc: "Le poison, arme efficace réservée à une élite d'individus intelligents et sans scrupules.",
  caps: [
    { r: 4, n: 'Connaissance du poison', d: "Test d'INT difficulté 10 pour reconnaître, identifier ou détecter un poison. Plus aucun test pour appliquer un poison sur une arme." },
    { r: 5, n: 'Poison rapide', t: 'bonus', dmg: '3d4°', d: "Avant chaque combat, jusqu'à trois armes enduites. La première attaque réussie inflige +3d4° DM (moitié sur un test de CON difficulté [10 + INT] réussi)." },
    { r: 6, n: 'Poison affaiblissant', d: "Remplace le poison rapide : à la première attaque réussie, la victime est affaiblie pour le reste du combat si elle rate un test de CON difficulté 12." },
    { r: 7, n: 'Résistance au poison', d: "Empoisonné, il fait un test de CON difficulté 10 : réussite = aucun effet, échec = moitié des DM." },
    { r: 8, n: 'Poisons virulents', f: 'jour', d: "Fabrique des poisons « lent » et « mortel » : [1 + INT] doses par jour au total. Difficulté de résistance [12 + INT]." }
  ]
};

COF.PRESTIGE.pactefeerique = {
  id: 'pactefeerique', nom: 'Voie du pacte féérique', fam: 'aventurier',
  desc: "Un pacte avec les êtres de la forêt, jurant de les protéger.",
  caps: [
    { r: 4, n: 'Amitié avec les animaux', a: 'L', d: "Test opposé d'attaque magique contre un animal ordinaire : apaisé, il peut lui ordonner de partir. Si l'animal a un maître, le test se fait contre les deux. Sans effet sur les animaux magiques ou corrompus, mais affecte les animaux géants." },
    { r: 5, n: 'Invisibilité', a: 'L', f: 'combat', dmg: '1d6+CHA', d: "Invisible pendant [1d6 + CHA] minutes : indétectable et inattaquable. Attaquer ou utiliser une action limitée met fin à l'effet. Récupération rapide nécessaire entre deux usages." },
    { r: 6, n: 'Compagnon féérique', dmg: '1d4°', d: "Une fée, un farfadet ou un grig : AGI +4*, CON +1, FOR -4, PER +2, CHA +2, VOL +2. DEF [12 + rang], PV [niveau × 2], Init. 14, attaque = attaque magique, DM 1d4° (poison). Invisible en action limitée. Il n'obéit pas mais agit dans l'intérêt du PJ." },
    { r: 7, n: 'Pas brumeux', a: 'M', f: 'round', d: "1×/round, en sacrifiant 1 PV : un pas dans le monde féérique pour ressortir à 20 m maximum, en franchissant n'importe quel obstacle (même un mur de force). Le point d'arrivée doit être visible." },
    { r: 8, n: 'Pays des songes', a: 'L', f: 'jour', d: "1×/jour en milieu naturel : franchit un portail féérique et disparaît. Il en ressort 3d6 h plus tard au même endroit ou dans un rayon de 20 km, avec tous ses PV." }
  ]
};

COF.PRESTIGE.toucheatout = {
  id: 'toucheatout', nom: 'Voie du touche à tout', fam: 'aventurier',
  desc: "La polyvalence ultime : une liberté totale dans le choix des capacités.",
  caps: [
    { r: 4, n: "Domaine de l'aventure", choix: true, choixVoie: { familles: ['aventurier'], rangMax: 2 }, d: "Choisir une capacité de rang 1 ou 2 issue d'une voie d'aventurier." },
    { r: 5, n: 'Domaine de la guerre', choix: true, choixVoie: { familles: ['combattant'], rangMax: 2 }, d: "Choisir une capacité de rang 1 ou 2 issue d'une voie de combattant." },
    { r: 6, n: 'Domaine du mystique', choix: true, choixVoie: { familles: ['mystique'], rangMax: 2 }, d: "Choisir une capacité de rang 1 ou 2 issue d'une voie de mystique. Un sort reste lançable même avec une caractéristique de magie à +0." },
    { r: 7, n: 'Domaine de la magie', choix: true, choixVoie: { familles: ['mage'], rangMax: 2 }, d: "Choisir une capacité de rang 1 ou 2 issue d'une voie de mage. Un sort reste lançable même avec une caractéristique de magie à +0." },
    { r: 8, n: 'Ultra polyvalent', d: "+1 aux deux caractéristiques les plus faibles (au choix en cas d'égalité)." }
  ]
};

COF.PRESTIGE.tueurgages = {
  id: 'tueurgages', nom: 'Voie du tueur à gages', fam: 'aventurier',
  desc: "Une voie pour faire le sale boulot, tout simplement.",
  caps: [
    { r: 4, n: 'Faire taire', a: 'M', dmg: '1d4°', d: "Attaque au contact réussie au larynx : 1d4° DM et la cible est muette. Test de CON difficulté [10 + rang] à la fin de chacun de ses tours pour retrouver la parole. Un lanceur de sorts muet subit un dé malus en attaque magique." },
    { r: 5, n: 'Brise genou', a: 'M', dmg: '1d4°', d: "Attaque au contact réussie au genou : 1d4° DM et la cible humanoïde est invalide pour le reste du combat. Une cible de NC ≥ rang peut s'en libérer par un test de CON difficulté [10 + rang] à la fin de son tour." },
    { r: 6, n: 'Ne me tourne pas le dos', a: 'G', f: 'round', t: 'bonus', dmg: '1d4°', d: "1×/round : attaque sournoise contre une créature qui quitte son contact. Sans cette capacité, +1d4° DM tout de même." },
    { r: 7, n: 'Égorger', a: 'A', d: "Attaque réussie contre un humanoïde surpris de NC inférieur à 4 : mort immédiate. Avec l'Attaque sournoise, le NC limite augmente de +1 par dé d'attaque sournoise. Sinon, DM normaux." },
    { r: 8, n: 'Un simple regard', a: 'G', d: "Test opposé d'attaque magique contre une ou plusieurs cibles humanoïdes (10 m) : elles renoncent à l'attaquer (1 round seulement si leur NC dépasse son niveau). Puis dé bonus à ses tentatives d'intimidation ou de persuasion. Attaquer met fin à l'effet." }
  ]
};
