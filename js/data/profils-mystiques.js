/* ============================================================
   COF2 Compagnon — Profils : famille des MYSTIQUES
   4 PV/niveau · DR d8 · +1 dé de récupération
   ============================================================ */
window.COF = window.COF || {};
COF.PROFILS = COF.PROFILS || {};

COF.PROFILS.druide = {
  id: 'druide', nom: 'Druide', famille: 'mystique', pv: 4,
  caracs: ['PER', 'VOL', 'CON'], magie: 'PER',
  resume: "Un protecteur de la nature et un magicien des forces naturelles.",
  armes: "La dague, le bâton noueux (équivalent au bâton ferré), l'épieu, le javelot et l'arc court.",
  armureMax: 'cuir', bouclier: 'petit',
  armuresTexte: "Jusqu'au cuir simple. Petit bouclier en bois uniquement (DEF +1).",
  equipDepart: [
    { nom: 'Bâton noueux', type: 'contact', ref: 'batonferre' },
    { nom: 'Dague', type: 'contact', ref: 'dague' },
    { nom: 'Arc court', type: 'distance', ref: 'arccourt' },
    { nom: 'Armure de cuir', type: 'armure', ref: 'cuir' }
  ],
  voies: [
    { id: 'animaux', nom: 'Voie des animaux', caps: [
      { r: 1, n: 'Langage des animaux', comp: 'influencer un animal avec lequel il communique', bon: '2+rang', d: "Communique avec les mammifères. Par rang 4 atteint dans une voie de druide, ajoute une catégorie : oiseaux, reptiles, poissons, arthropodes ou animaux fantastiques." },
      { r: 2, n: 'Petit compagnon', dmg: '1d4°', d: "Petit animal lié : partage ses sens, communication illimitée, +2 en DEF quand il est en vue. DEF [13 + rang], PV [niveau × 2]. À 0 PV il fuit et revient soigné 24 h plus tard ; s'il est tué, le druide perd 1d4° PV." },
      { r: 3, n: "Nuée d'insectes", a: 'A', s: true, d: "Attaque magique contre la DEF (20 m) : la cible subit 1 DM par round et -2 à tous ses tests pendant [3 + PER] rounds. Les DM de zone détruisent la nuée." },
      { r: 4, n: 'Masque du prédateur', a: 'A', s: true, d: "Pendant PER minutes, prend les traits d'un fauve ou d'un loup : +2 en Initiative, en DEF, en attaque et aux DM au contact. Vision nocturne." },
      { r: 5, n: 'Forme animale', a: 'A', s: true, d: "Pendant PER minutes, prend la forme d'un animal de taille moyenne ou inférieure d'une catégorie maîtrisée. Conserve ses PV, son INT et sa VOL ; acquiert les caractéristiques, attaques, DEF et capacités naturelles de l'animal. Ni équipement ni capacités propres. Retour en action de mouvement." }
    ]},
    { id: 'fauve', nom: 'Voie du fauve', caps: [
      { r: 1, n: 'Vitesse du félin', comp: 'course, escalade, saut', bon: '2+rang', d: "Ajoute rang + 2 à ces tests. +3 en Initiative et +1 en DEF (+2 au rang 3, +3 au rang 5)." },
      { r: 2, n: 'Panthère', dmg: '1d4+2', d: "Apprivoise une panthère : DEF [13 + rang], PV [niveau × 4], Init. du druide, attaque = attaque magique, DM 1d4+2. AGI +4*, CON +2, FOR +2, PER +2*, CHA -2, INT -3, VOL +2." },
      { r: 3, n: 'Attaque bondissante', a: 'L', t: 'bonus', dmg: '1d4°', d: "Le druide ou son félin parcourt 5 à 10 m puis attaque avec un dé bonus et +1d4° DM. Impossible s'il est déjà au contact." },
      { r: 4, n: 'Grand félin', dmg: '1d4°+5', d: "Animal fabuleux : DEF [15 + rang], PV [niveau × 5], DM 1d4°+5, déplacement 20 m, peut servir de monture. Communication télépathique et soins à distance (1 PV du druide = 1 PV rendu)." },
      { r: 5, n: 'Les sept vies du chat', f: 'niveau', d: "Six fois au maximum dans sa carrière, jamais plus d'une fois par niveau : quand il tombe à 0 PV ou meurt, il peut ignorer la cause (MJ et joueur trouvent une explication)." }
    ]},
    { id: 'nature', nom: 'Voie de la nature', caps: [
      { r: 1, n: 'Maître de la survie', comp: 'survie en milieu naturel (récupération incluse)', bon: '2+rang', t: 'soin', dmg: '1d4°', d: "Ajoute rang + 2 à ces tests. En dormant en pleine nature, dépenser 1 DR rend 1d4° PV de plus." },
      { r: 2, n: 'Terrains difficiles', d: "Aucune pénalité de déplacement en terrain difficile. Dans ces conditions : +3 en Initiative, +1 en attaque et en DEF." },
      { r: 3, n: 'Bâton de druide', a: 'L', dmg: '1d4°+FOR', d: "Deux attaques de contact avec son bâton (FOR ou AGI au choix en attaque), [1d4° + FOR ou AGI] DM chacune, et +2 en DEF pendant 1 round." },
      { r: 4, n: 'Constitution héroïque', d: "+1 en CON et dé bonus aux tests de CON." },
      { r: 5, n: 'Résistant', d: "Divise par deux tous les DM naturels non magiques (froid, feu, chutes, poisons) ainsi que ceux infligés par les animaux et insectes, même géants. S'étend à ses compagnons animaux." }
    ]},
    { id: 'protecteur', nom: 'Voie du protecteur', caps: [
      { r: 1, n: 'Baies magiques', a: 'L', s: true, comp: 'vigilance et discrétion en pleine nature', bon: '2+rang', dmg: '1d4°+rang', d: "Fait pousser PER fruits : chacun vaut un repas et rend [1d4° + rang] PV après 1 min. Une seule fois par jour et par personnage." },
      { r: 2, n: 'Forêt vivante', s: true, f: 'jour', d: "Rituel de 30 min : la forêt devient alliée dans un rayon de 1 km par rang, pendant 24 h. Les ennemis y divisent leur déplacement par deux et subissent un dé malus aux tests de survie, orientation, perception et discrétion." },
      { r: 3, n: 'Régénération', s: true, f: 'jour', t: 'soin', dmg: '3d4°+PER', d: "Rituel de 10 min au calme : la cible touchée récupère [3d4° + PER] PV. Au rang 5, fait aussi repousser les membres amputés. Une fois par jour et par cible." },
      { r: 4, n: 'Perception héroïque', d: "+1 en PER, dé bonus aux tests de PER, et ajoute sa PER à son total de PM (en plus de la VOL)." },
      { r: 5, n: "Forme d'arbre", a: 'A', s: true, d: "Se transforme en arbre de 5 m pendant PER minutes (caractéristiques et PV de l'arbre animé, sauf INT/PER/VOL). Ne peut pas parler, mais peut lancer les sorts des voies du protecteur et des végétaux." }
    ]},
    { id: 'vegetaux', nom: 'Voie des végétaux', caps: [
      { r: 1, n: "Peau d'écorce", a: 'M', s: true, comp: 'identifier les plantes et leurs propriétés', bon: '2+rang', d: "+2 en DEF pendant PER minutes (+1 aux rangs 3 et 5). Non cumulable avec une armure métallique ou un autre sort de protection (sauf Masque du prédateur)." },
      { r: 2, n: 'Prison végétale', a: 'L', s: true, d: "La végétation bloque ses ennemis (pas ses alliés) dans une zone de 10 m de diamètre à 20 m, pendant PER minutes : cibles immobilisées. Libération : action d'attaque et test de FOR difficulté [10 + PER]." },
      { r: 3, n: 'Flèche vivante', a: 'A', s: true, dmg: '3d4°', d: "Enchante et tire une flèche : DM habituels, puis 3d4° DM supplémentaires au round suivant lorsqu'elle prend racine dans la plaie." },
      { r: 4, n: "Animation d'un arbre", a: 'L', s: true, dmg: '1d4°+3', d: "Anime un arbre pour [niveau] rounds : DEF [10 + rang], PV [niveau × 5], Init. 8, attaque = attaque magique, DM 1d4°+3, déplacement 5 m. Un seul arbre à la fois." },
      { r: 5, n: 'Porte végétale', a: 'A', s: true, f: 'jour', d: "1×/jour : entre dans le tronc d'un gros arbre et ressort par un autre de la même forêt, à [PER × 10] km maximum. Emmène une personne à partir du niveau 10, puis tous les 4 niveaux." }
    ]}
  ]
};

COF.PROFILS.moine = {
  id: 'moine', nom: 'Moine', famille: 'mystique', pv: 4,
  caracs: ['VOL', 'PER', 'AGI'], magie: 'VOL',
  resume: "Un ascète qui endurcit son corps, son esprit et maîtrise le combat à mains nues.",
  armes: "Toutes les armes sauf les armes à poudre, mais le moine est plus efficace à mains nues (DM létaux au choix).",
  armureMax: 'aucune', bouclier: false,
  armuresTexte: "Aucune armure, aucun bouclier.",
  equipDepart: [
    { nom: 'Bâton', type: 'contact', ref: 'baton' }
  ],
  voies: [
    { id: 'energie', nom: "Voie de l'énergie vitale", caps: [
      { r: 1, n: "Mains d'énergie", a: 'L', d: "Attaque à mains nues avec un bonus en attaque égal à rang + 2. De plus, toutes ses attaques à mains nues sont considérées comme magiques et il peut remplacer sa FOR par sa VOL aux DM." },
      { r: 2, n: 'Projection du ki', a: 'L', dmg: '1d4°+VOL', d: "Vague de force à 20 m : attaque magique réussie pour [1d4° + VOL] DM. Passe à [2d4° + VOL] au rang 4." },
      { r: 3, n: 'Invulnérable', d: "Ne subit que la moitié des DM de sources élémentaires (feu, froid, foudre, acide), des poisons et des maladies. Au rang 5, immunisé aux poisons et aux maladies." },
      { r: 4, n: 'Pression mortelle', a: 'M', dmg: '1d4°', d: "À mains nues, peut différer les DM de ses attaques en les comptabilisant à part avec +1d4° chacun. Dans l'heure, une attaque au contact réussie (action limitée) libère la totalité des DM. Au niveau 10, un test opposé d'attaque magique suffit (un seul essai)." },
      { r: 5, n: 'Ascétisme', d: "Peut subsister sans eau ni sommeil pendant [5 + VOL] jours sans pénalité. +1 en CON et dé bonus aux tests de CON." }
    ]},
    { id: 'maitrise', nom: 'Voie de la maîtrise', caps: [
      { r: 1, n: 'Agilité du singe', comp: 'acrobaties, esquive', bon: '2+rang', d: "Ajoute rang + 2 à ces tests et +2 en DEF (+3 au rang 4). Se relever devient une action gratuite." },
      { r: 2, n: 'Griffes du tigre', d: "Un résultat de 1 au dé de DM à mains nues est remplacé par le résultat maximal. Peut infliger des DM tranchants ou perforants au lieu de contondants." },
      { r: 3, n: 'Morsure du serpent', d: "+1 à la zone de critique au contact à mains nues (19-20). Sur un critique, la cible est affaiblie pendant 1 round." },
      { r: 4, n: 'Fureur du dragon', a: 'L', f: 'combat', dmg: '3d4°+FOR', d: "1×/combat : attaque tournoyante infligeant automatiquement [3d4° + FOR] DM à tous les adversaires au contact, qui doivent réussir un test de FOR difficulté 10 pour ne pas être renversés." },
      { r: 5, n: 'Moment de perfection', f: 'jour', d: "1×/jour (une fois de plus par rang 5 atteint dans une autre voie de moine, jamais plus d'une fois par combat) : toutes ses attaques réussissent automatiquement et il esquive toutes celles qui le visent pendant un round. +1 définitif à sa plus faible caractéristique." }
    ]},
    { id: 'meditation', nom: 'Voie de la méditation', caps: [
      { r: 1, n: 'Pacifisme', comp: "empathie, apaiser un auditoire", bon: '2+rang', d: "Tant qu'il n'a réalisé aucune action offensive dans le combat : +5 en DEF et DM subis divisés par deux." },
      { r: 2, n: 'Transe de guérison', f: 'jour', t: 'soin', dmg: '1d4°+VOL', d: "10 min de méditation : récupère [1d4° + VOL] PV (+1d4° par rang 4 atteint dans une voie de moine). Nécessite une récupération rapide entre deux usages, 3 fois par jour maximum." },
      { r: 3, n: 'Maîtrise du ki', d: "Ajoute sa VOL à son Initiative et à ses PV. +2 en DEF (+3 au rang 5)." },
      { r: 4, n: 'Volonté héroïque', d: "+1 en VOL et dé bonus aux tests de VOL." },
      { r: 5, n: 'Projection mentale', a: 'L', f: 'jour', dmg: '1d4°+VOL', d: "1×/jour : projette son esprit hors de son corps pendant [1d4° + VOL] minutes (vol à 10 m par round, traverse les murs mais pas les êtres vivants ni les barrières magiques). Il ressent les DM infligés à son corps. +1 définitif à sa plus faible caractéristique." }
    ]},
    { id: 'poing', nom: 'Voie du poing', caps: [
      { r: 1, n: 'Poings de fer', dmg: '1d6+FOR', d: "À mains nues : peut remplacer sa FOR par son AGI en attaque et inflige [1d6 + FOR] DM létaux. Le dé passe à 1d8 au rang 2, 1d10 au rang 3, 1d12 au rang 4 et 2d6 au rang 5." },
      { r: 2, n: 'Peau de fer', d: "+2 en DEF (+3 au rang 5) et divise par deux tous les DM temporaires subis." },
      { r: 3, n: 'Parade de projectiles', a: 'G', f: 'round', d: "1×/round : dévie un projectile (flèche, javelot…). Impossible contre un critique ou une arme à poudre." },
      { r: 4, n: 'Déluge de coups', a: 'L', d: "Deux attaques au contact sur des cibles au choix pendant son tour." },
      { r: 5, n: 'Puissance du ki', t: 'bonus', dmg: '2d4°', d: "Dé malus volontaire sur une attaque au contact : +2d4° DM. Utilisable aussi avec Projection du ki." }
    ]},
    { id: 'vent', nom: 'Voie du vent', caps: [
      { r: 1, n: 'Pas du vent', comp: 'saut, course, escalade', bon: '2+rang', d: "Peut se déplacer avant et après avoir attaqué (distance totale inchangée). +3 en Initiative." },
      { r: 2, n: 'Course du vent', d: "+1 en DEF et une action de mouvement couvre 15 m. Au rang 5 : +2 en DEF et 20 m." },
      { r: 3, n: 'Course des airs', d: "Se déplace sur l'eau, la neige, le feuillage ou un mur vertical (début et fin sur une surface normale). Ignore les terrains difficiles et est immunisé à l'état immobilisé." },
      { r: 4, n: 'Agilité héroïque', d: "+1 en AGI et dé bonus aux tests d'AGI." },
      { r: 5, n: 'Passe-muraille', a: 'L', f: 'combat', d: "1×/combat : traverse un mur d'une épaisseur maximale de VOL mètres. +1 définitif à sa plus faible caractéristique." }
    ]}
  ]
};

COF.PROFILS.pretre = {
  id: 'pretre', nom: 'Prêtre', famille: 'mystique', pv: 4,
  caracs: ['CHA', 'VOL', 'FOR'], magie: 'CHA',
  resume: "Le bras armé d'une religion, capable de soigner comme d'occire les infidèles.",
  armes: "Les armes contondantes à une main et le bâton ferré. Interdiction morale de faire couler le sang (sauf arme sacrée).",
  armureMax: 'chemise', bouclier: 'petit',
  armuresTexte: "Jusqu'à la chemise de mailles. Petit bouclier (DEF +1).",
  equipDepart: [
    { nom: 'Masse ou marteau de guerre', type: 'contact', ref: 'masse' },
    { nom: 'Petit bouclier', type: 'bouclier', ref: 'petit' },
    { nom: 'Chemise de mailles', type: 'armure', ref: 'chemise' }
  ],
  voies: [
    { id: 'foi', nom: 'Voie de la foi', caps: [
      { r: 1, n: 'Prédicateur', comp: 'convaincre ou convertir un auditoire', bon: '2+rang', f: 'jour', d: "Ajoute rang + 2 à ces tests. 1×/jour, récupère 1 PC en convertissant une créature ou en la convainquant de suivre ses préceptes." },
      { r: 2, n: 'Miracle mineur', a: 'A', s: true, t: 'soin', dmg: '1d4°', d: "Petit miracle : purifier eau ou aliments, apaiser une douleur, soigner une maladie bénigne. Permet aussi de rendre 1d4° PV à une créature à 0 PV." },
      { r: 3, n: 'Arme de lumière', a: 'M', s: true, t: 'bonus', dmg: '1d4°', d: "Enchante son arme pendant CHA minutes : lumière dans 5 m, et contre les démons et morts-vivants un dé bonus en attaque et +1d4° DM (+2d4° au rang 5, ou lançable sur l'arme d'un allié en action limitée)." },
      { r: 4, n: 'Ailes célestes', a: 'A', s: true, d: "Des ailes divines lui permettent de voler à sa vitesse normale pendant CHA minutes. Le vol stationnaire est une action de mouvement." },
      { r: 5, n: 'Foudres divines', a: 'A', s: true, dmg: '2d4°+CHA', d: "La foudre frappe toutes les créatures désignées dans un rayon de 10 m : [2d4° + CHA] DM, sans test d'attaque. Le coût augmente de +1 PM à chaque utilisation jusqu'à une récupération rapide." }
    ]},
    { id: 'guerresainte', nom: 'Voie de la guerre sainte', caps: [
      { r: 1, n: 'Arme bénie', a: 'A', s: true, d: "Rituel bénissant son arme pour 24 h : un résultat de 1 au dé de DM est relancé (le second résultat compte) et les DM sont considérés comme magiques. Sans effet si une autre créature l'utilise." },
      { r: 2, n: 'Bouclier de la foi', d: "+1 en DEF supplémentaire avec son bouclier orné du symbole de sa foi (+2 au rang 5). Sans effet pour quelqu'un d'autre." },
      { r: 3, n: 'Châtiment divin', a: 'L', t: 'bonus', dmg: '1d4°', d: "Attaque de contact avec un dé bonus, ajoutant son CHA aux DM. Peut dépenser 1 PM pour +1d4° DM (2 PM pour +2d4° au rang 5)." },
      { r: 4, n: 'Marteau de la foi', a: 'A', s: true, dmg: '2d4°+CHA', d: "Attaque magique contre la DEF (30 m) : projectile d'énergie infligeant [2d4° + CHA] DM. Bonus d'arme magique applicable. +1 aux DM par rang 4 atteint dans une autre voie de prêtre." },
      { r: 5, n: 'Mot de pouvoir', a: 'A', s: true, f: 'jour', d: "1×/jour : tous ses ennemis dans un rayon de 10 m sont étourdis pendant 1 round (aucune action et -5 en DEF)." }
    ]},
    { id: 'priere', nom: 'Voie de la prière', caps: [
      { r: 1, n: 'Bénédiction', a: 'L', s: true, comp: 'théologie, cosmologie', bon: '2+rang', d: "Ses alliés en vue et lui gagnent +1 à tous leurs tests de caractéristique et d'attaque pendant CHA minutes (+2 au rang 5)." },
      { r: 2, n: 'Sanctuaire', a: 'L', s: true, d: "Pendant 1 min, tout adversaire voulant l'attaquer doit réussir un test d'INT difficulté [10 + CHA] (automatiquement affecté si son niveau est inférieur à la moitié du sien). Toute action offensive met fin au sort." },
      { r: 3, n: 'Destruction du mal', a: 'A', s: true, dmg: '2d4°+CHA', d: "Tous les morts-vivants et démons dans un rayon de 10 m subissent automatiquement [2d4° + CHA] DM (3d4° au rang 5)." },
      { r: 4, n: 'Volonté héroïque', d: "+1 en VOL et dé bonus aux tests de VOL." },
      { r: 5, n: 'Intervention divine', a: 'G', f: 'combat', d: "1×/combat : décide qu'un test (du MJ ou des joueurs) est une réussite ou un échec, même après le jet. Sans effet sur une créature de NC supérieur à son niveau." }
    ]},
    { id: 'soins', nom: 'Voie des soins', caps: [
      { r: 1, n: 'Récupération mineure', a: 'A', s: true, comp: 'médecine, premiers soins', bon: '2+rang', dmg: '1d4°+CHA', d: "Impose les mains sur un allié au contact (ou lui-même) : [1d4° + CHA] PV. Utilisable une fois par jour par rang atteint dans la voie, plus une par rang 3 atteint dans une autre voie de prêtre." },
      { r: 2, n: 'Vigueur divine', a: 'L', s: true, comp: 'résister aux maladies et poisons', bon: '2+rang', d: "Guérit un poison ou une maladie sur une cible au contact (test d'attaque magique possible si l'infection est surnaturelle)." },
      { r: 3, n: 'Récupération majeure', a: 'L', s: true, t: 'soin', dmg: '3d4°+CHA', d: "Soigne une cible à 20 m : [3d4° + CHA] PV immédiatement. +1d4° par rang 5 atteint dans une voie de prêtre." },
      { r: 4, n: 'Phénix', f: 'jour', t: 'soin', dmg: '2d4°+CHA', d: "1×/jour, en tombant à 0 PV : il se relève et rend [2d4° + CHA] PV à tous ses alliés dans un rayon de 20 m, et le double à lui-même." },
      { r: 5, n: 'Rétablissement', s: true, f: 'jour', t: 'soin', dmg: '3d4°+CHA', d: "1×/jour : soigne une créature par point de CHA, chacune bénéficiant des effets d'une Récupération majeure. Rituel de 10 min au repos dans un rayon de 5 m. Pas de concentration possible." }
    ]},
    { id: 'spiritualite', nom: 'Voie de la spiritualité', caps: [
      { r: 1, n: 'Vêtements sacrés', d: "Sans armure (bouclier autorisé) : dé bonus pour résister au contrôle mental et +2 en DEF (+3 au rang 3, +4 au rang 5). Variante guerrière : maîtrise de la cotte de mailles avec toutes les capacités de prêtre." },
      { r: 2, n: 'Augure', a: 'L', s: true, d: "Test de CHA difficulté 10 : le MJ répond sur les conséquences d'une action envisagée — bénéfique, incertain, risqué ou préjudiciable." },
      { r: 3, n: 'Délivrance', a: 'L', s: true, d: "En touchant sa cible, annule les pénalités des sorts, malédictions et capacités spéciales (peur, douleur, affaiblissement, poisons, pétrification, états étourdi, paralysé, ralenti, immobilisé). Ni mutilations ni amputations." },
      { r: 4, n: 'Charisme héroïque', d: "+1 en CHA et dé bonus aux tests de CHA." },
      { r: 5, n: 'Marche des plans', a: 'L', s: true, f: 'jour', d: "1×/jour : voyage entre les plans pendant CHA rounds, parcourant 10 km par round. Le point de sortie est approximatif (1d6 km près)." }
    ]}
  ]
};
