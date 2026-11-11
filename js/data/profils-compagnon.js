/* ============================================================
   COF2 Compagnon — Profils du Compagnon du joueur
   (Chroniques Oubliées Fantasy, 2e édition — chapitre 2,
   « Nouveaux profils ») : un profil par famille, plus le
   psionique, dont la famille est au choix du joueur.
   Même format que les autres fichiers profils-*.js.
   ============================================================ */
window.COF = window.COF || {};
COF.PROFILS = COF.PROFILS || {};

/* ---------------- Caravanier (aventurier) ---------------- */
COF.PROFILS.caravanier = {
  id: 'caravanier', nom: 'Caravanier', famille: 'aventurier', pv: 4,
  caracs: ['CHA', 'PER', 'INT'],
  resume: "Un baroudeur au long cours, à la fois marchand, explorateur, messager et diplomate, qui sait mener une expédition et en tirer profit.",
  armes: "Toutes les armes de contact à une main, toutes les armes à distance, le bâton et la lance à deux mains.",
  armureMax: 'chemise', bouclier: 'petit',
  armuresTexte: "Jusqu'à la chemise de mailles. Petit bouclier autorisé.",
  equipDepart: [
    { nom: 'Épée courte (ou marteau, masse)', type: 'contact', ref: 'epeecourte' },
    { nom: 'Arc court (ou arbalète légère)', type: 'distance', ref: 'arccourt' },
    { nom: 'Dague', type: 'contact', ref: 'dague' },
    { nom: 'Cuir renforcé', type: 'armure', ref: 'cuirren' },
    { nom: 'Petit bouclier', type: 'bouclier', ref: 'petit' }
  ],
  voies: [
    { id: 'baroudeur', nom: 'Voie du baroudeur', caps: [
      { r: 1, n: 'Infatigable', comp: 'survie et résistance aux conditions extrêmes en voyage (fatigue, chaleur, froid, soif…)', bon: '2+rang', d: "Ajoute rang + 2 à ces tests. +1 PV par rang atteint dans cette voie." },
      { r: 2, n: 'Réflexes du héros', comp: 'vigilance et détection des embuscades', bon: '2+rang', d: "Ajoute rang + 2 à ces tests. Ajoute son CHA à son Init. (en plus de sa PER)." },
      { r: 3, n: 'Techniques exotiques', d: "Capital de bonus égal au rang atteint dans la voie (+1 par rang 3 atteint dans une autre voie de caravanier), à répartir librement à chaque combat, avant de lancer les dés, en attaque, en DEF ou aux DM." },
      { r: 4, n: "L'art de la survie", f: 'combat', d: "+1 PC et +1 DR. 1×/combat, peut dépenser 1 PC pour obtenir +10 en DEF contre une attaque (même après avoir vu le résultat du test d'attaque)." },
      { r: 5, n: 'Talent personnel', choix: true, choixVoie: { rangMax: 4 }, d: "Choisir une capacité de rang 4 au plus d'un profil de combattant ou d'aventurier, ou de rang 3 au plus d'un profil de mage ou de mystique. Pour une capacité de rang 1 ou 2, ajoute aussi son CHA à ses PV max. Un sort reste soumis aux limitations d'armure et coûte des PM (il en rapporte un)." }
    ]},
    { id: 'diplomate', nom: 'Voie du diplomate', caps: [
      { r: 1, n: 'Us et coutumes', comp: "convaincre, étiquette, coutumes locales et bon comportement en société", bon: '2+rang', d: "Ajoute rang + 2 à ces tests. Dissimule une dague sur lui (1d4) : seule une créature de NC supérieur à son niveau peut la trouver par une fouille poussée." },
      { r: 2, n: 'Polyglotte', dmg: '1d4°+CHA', d: "Parle, lit et écrit une langue vivante supplémentaire, plus une par rang acquis ensuite dans la voie. Au 1er round d'un combat avec sa dague cachée : bénéficie de la surprise et inflige [1d4° + CHA] DM (au lieu de 1d4 + FOR)." },
      { r: 3, n: 'Fêlure', d: "Après 1 min de discussion, test opposé de PER contre la VOL de l'interlocuteur : devine son moteur secret (argent, pouvoir, amour sincère, peur de perdre un proche…)." },
      { r: 4, n: 'Charisme héroïque', d: "+1 en CHA et dé bonus aux tests de CHA." },
      { r: 5, n: "Rien d'impossible", d: "Dépense 1 PC pour qu'une rencontre se termine comme il le souhaite (éviter ou provoquer une bagarre, ramener tout le monde à la raison, obtenir aide ou droit de passage…). Contre un interlocuteur de NC ≥ à son niveau : test de CHA opposé à la VOL de la cible." }
    ]},
    { id: 'explorateur', nom: "Voie de l'explorateur", caps: [
      { r: 1, n: 'Sur terre', comp: "équitation (CHA au lieu de l'AGI possible) et dressage de toutes les montures", bon: '2+rang', d: "Ajoute rang + 2 à ces tests. Sous sa tutelle, une monture terrestre parcourt +1 km par rang atteint à chaque période de déplacement." },
      { r: 2, n: 'En mer', comp: 'natation, navigation et prévision météo', bon: '2+rang', d: "Ajoute rang + 2 à ces tests. +1 en attaque et en DEF quand il combat sur un navire." },
      { r: 3, n: 'Par monts et par vaux', d: "Réduit d'un cran la dangerosité de chaque région traversée pour lui et sa caravane (10 personnes ou montures par rang au maximum). En dépensant 1 PC, ne subit pas les DM de progression de la journée (lui seul)." },
      { r: 4, n: 'Maître de la survie', choixCarac: { liste: ['PER', 'CON'], val: 1 }, d: "+1 en PER ou en CON (au choix) et dé bonus aux tests de cette caractéristique." },
      { r: 5, n: 'Dans le ciel', d: "Acquiert un moyen de locomotion aérien (monture volante, navire volant, ballon…) portant 10 ballots de 100 kg ou 10 personnes par capacité de rang 5 de caravanier. +1 en attaque et en DEF à son bord. 50 km par période de déplacement sans pénalité de terrain. Remplacé au niveau suivant s'il est perdu." }
    ]},
    { id: 'garde', nom: 'Voie du garde personnel', caps: [
      { r: 1, n: 'Garde', dmg: '1d4°+3', d: "Engage un garde incorruptible et fidèle (coûte 10 % de toutes ses richesses gagnées). AGI +1, CON +3, FOR +2, PER +1, CHA -1, INT +0, VOL = CHA du caravanier ; DEF [12 + rangs dans la voie], PV [niveau × 4], Init. du caravanier ; attaque = attaque magique du caravanier, 1d4°+3 DM. Pas d'objets magiques. Récupère un quart de ses PV par récupération rapide, tout par récupération complète. Remplaçable au niveau suivant s'il meurt." },
      { r: 2, n: 'Garde rapprochée', d: "Tant que le garde est à moins de 3 m : +1 en DEF pour le caravanier (+2 au rang 5)." },
      { r: 3, n: 'Capacité de garde', d: "Une option pour le garde (+1 par rang 5 atteint dans une voie de caravanier) : Armure lourde (+3 DEF, -1 AGI ; 2× possible), Arme à distance (30 m, dé malus jusqu'à 60 m), Arme lourde (+1d4° DM au contact), Puissant (+2* FOR et DM), Rapide (+2* AGI, 15 m par mouvement), Résistant (+2* CON, + niveau PV), Vigilant (+2* PER, veille toute la nuit), Volonté d'acier (+2* VOL, immunisé aux influences et contrôles). * dé bonus aux tests de cette caractéristique." },
      { r: 4, n: 'Dernier recours', f: 'combat', t: 'soin', dmg: '3d4°+CHA', d: "Le garde récupère ses PV deux fois plus vite (50 % par récupération rapide). 1×/combat, si le caravanier tombe à 0 PV, le garde lui fait boire une potion : [3d4° + CHA du caravanier] PV (jamais pour un autre)." },
      { r: 5, n: 'Lien magique', d: "Rituel liant le caravanier et son garde : le garde se téléporte auprès de lui en action de mouvement jusqu'à [niveau + CHA] km ; télépathie à la même portée ; il sent quand son maître est en danger. Le garde devient immunisé à la paralysie et à l'immobilisation." }
    ]},
    { id: 'marchand', nom: 'Voie du marchand', caps: [
      { r: 1, n: "Deux pour le prix d'un", comp: 'négoce, marchandage et évaluation', bon: '2+rang', d: "Ajoute rang + 2 à ces tests. En dépensant 1 PC, divise par 2 le prix d'achat d'un bien." },
      { r: 2, n: 'En réserve', f: 'jour', dmg: '1d4°+CHA', d: "En ville, 1×/jour, prétend avoir un objet qui lui manque : lancer [1d4° + CHA]. Valeur (pa) inférieure au résultat : il l'a sur lui ou le trouve en 5 min ; jusqu'à 10 fois le résultat : en 1 h. Rien n'est décompté de sa bourse." },
      { r: 3, n: 'Outils de qualité', d: "Un objet de qualité (+1 par rang suivant). Arme : +1 à la plage de critique et +1d4° DM en cas de critique. Armure : +1 en DEF et pénalité d'armure réduite de 1. Vêtements : +3 en discrétion, en récupération ou en séduction/baratin selon la tenue. Cumulable avec la magie. Perdu ou vendu : attendre 2 niveaux pour en obtenir un autre." },
      { r: 4, n: 'Signe extérieur de richesse', d: "Acquiert un objet magique au choix, de niveau de magie maximal déterminé comme pour un PJ de [niveau - 2] (tableau du Livre des règles). Peut en changer à chaque passage de niveau." },
      { r: 5, n: 'Caravane sur pattes', d: "Monture géante de masse M (1, +1 par rang 5 dans une autre voie de caravanier) : porte [10 × M] ballots de 100 kg (ou humanoïdes), une maisonnette par point à partir de M = 3 ; 15 km par période. AGI -2, CON et FOR [10 + 2M], PER -1, CHA -1, INT -2, VOL +5 ; DEF [16 + M], PV [niveau × 10], Init. 9, attaque [10 + M], M d12+10 DM ; RD [2 × M]. Placide (n'attaque pas sur ordre), récupère 10 % de ses PV par jour." }
    ]}
  ]
};

/* ---------------- Chamane (mystique) ---------------- */
COF.PROFILS.chamane = {
  id: 'chamane', nom: 'Chamane', famille: 'mystique', pv: 4,
  caracs: ['PER', 'VOL', 'CON'], magie: 'PER',
  resume: "Un lanceur de sorts qui perçoit et manipule les esprits de toute chose, et refuse le métal fondu par l'homme.",
  armes: "Bâton, lance ou épieu, masse, marteau, dague, fronde et arc court — jamais en métal fondu (silex, os, bois durci ; fer froid accepté).",
  armureMax: 'cuir', bouclier: false,
  armuresTexte: "Jusqu'au cuir simple. Pas de bouclier.",
  equipDepart: [
    { nom: 'Masse en pierre (ou lance à pointe d\'os)', type: 'contact', ref: 'masse' },
    { nom: 'Dague en silex', type: 'contact', ref: 'dague' },
    { nom: 'Armure de cuir', type: 'armure', ref: 'cuir' }
  ],
  voies: [
    { id: 'espritanimal', nom: "Voie de l'esprit animal", caps: [
      { r: 1, n: 'Esprit du loup', d: "Communique avec les loups et les chiens. Dé bonus aux tests d'endurance et de course." },
      { r: 2, n: 'Esprit du serpent', d: "Communique avec les reptiles. Dé bonus pour résister à la faim et à la soif. +1 DR." },
      { r: 3, n: "Esprit de l'ours", d: "Communique avec les ours. Dé bonus aux tests de FOR. +1 DM au contact (+2 au rang 5)." },
      { r: 4, n: "Esprit de l'aigle", d: "Communique avec les oiseaux et peut voir par les yeux de n'importe lequel dans un rayon de [PER × 100] m. +1 DR et +1 DM à distance." },
      { r: 5, n: 'Esprit du poisson', d: "Communique avec les poissons. Retient sa respiration pendant PER heures (récupération rapide avant de recommencer). +1 DM sur ses attaques magiques." }
    ]},
    { id: 'choses', nom: 'Voie des esprits des choses', caps: [
      { r: 1, n: 'Dialogue avec les objets', a: 'L', s: true, d: "En 1 min d'écoute de l'esprit d'un objet : apprend son âge et à qui il a appartenu (sans noms). +1 aux tests faits avec cet objet ce jour-là." },
      { r: 2, n: 'Pierre vivante', a: 'A', s: true, dmg: '1d4°+PER', d: "Lance une pierre : attaque à distance avec dé bonus, [1d4° + PER] DM. À partir du rang 4, en action limitée (pour 1 PM) : [2d4° + PER] DM et peut exploser (moitié des DM dans un rayon de 3 m)." },
      { r: 3, n: 'Arme vivante', a: 'L', s: true, dmg: '2d4°', d: "Rituel : rend une arme de bois, de pierre ou d'os aussi dure que l'acier, de façon permanente. Entre ses mains : critique augmenté de 1 et, sur un critique contre un être vivant, l'arme lui rend 2d4° PV (au plus les DM infligés)." },
      { r: 4, n: 'Siphon de magie', a: 'L', s: true, d: "Rituel de 10 min : transfère la magie d'une arme de métal vers l'une de ses armes vivantes de même catégorie (niveau de magie ≤ rang atteint dans la voie ; pas de cumul, le plus élevé est conservé)." },
      { r: 5, n: 'Esprits du lieu', a: 'L', s: true, dmg: '1d4°', d: "Rituel d'1 min : apprend la nature des événements dont un lieu a été témoin (vision possible : test de PER difficulté 15 à 25). En sacrifiant 1d4° PV : tant qu'il reste dans la zone (bosquet, maison, temple, vallon…), ses sorts coûtent 1 PM de moins et il a un dé bonus en attaque." }
    ]},
    { id: 'malefiques', nom: 'Voie des esprits maléfiques', caps: [
      { r: 1, n: 'Esprits prédateurs', a: 'A', s: true, dmg: '1d4°+PER', d: "Test opposé d'attaque magique (20 m) : [1d4° + PER] DM ; si le NC de la cible est inférieur au niveau du chamane, test de VOL difficulté 10 ou affaiblie 1 round. Morts-vivants et créatures artificielles immunisés." },
      { r: 2, n: 'Esprits de cauchemars', a: 'L', s: true, d: "Rituel de 10 min pendant que la cible dort, avec une relique (ou un objet personnel : -5 à -10) : test opposé d'attaque magique. Succès : aucun effet positif de la récupération et -2 à tous ses tests jusqu'à sa prochaine récupération complète." },
      { r: 3, n: 'Métal corrompu', a: 'A', s: true, d: "Test opposé d'attaque magique (20 m) contre le porteur d'une arme de métal forgé : dé malus en attaque pendant [PER] rounds." },
      { r: 4, n: 'Esprits hurlants', a: 'A', s: true, dmg: '1d4°', d: "Zone de 6 m de diamètre (20 m) pendant [PER] rounds : 1d4° DM par round et dé malus à toutes les actions des créatures dotées d'esprit. Déplaçable de 10 m (mouvement) ou 20 m (limitée) par round." },
      { r: 5, n: 'Esprit insecte', a: 'A', s: true, d: "Test opposé d'attaque magique (20 m) contre un humanoïde vivant de NC ≤ moitié du niveau du chamane : transformé en 1 round, il se retourne contre ses alliés (+2 en attaque, aux DM et en DEF) et meurt à la fin du sort ([niveau] rounds, ou quand tous ses anciens alliés sont détruits)." }
    ]},
    { id: 'vital', nom: "Voie de l'esprit vital", caps: [
      { r: 1, n: 'Esprits des ancêtres', a: 'G', s: true, dmg: '1d4°', d: "Avant la résolution : +[2 + rang atteint] au test de son choix (non cumulable avec un bonus de compétence personnel). Sur un test d'attaque : +2 en attaque et +1d4° DM." },
      { r: 2, n: 'Esprits du foyer', a: 'L', s: true, d: "Après une trentaine de minutes de chant : bulle de sérénité (10 m de diamètre au plus) où chacun récupère 1 DR." },
      { r: 3, n: 'Esprit protecteur', a: 'A', s: true, d: "Jusqu'à sa prochaine récupération : dé bonus pour éviter d'être surpris et +1 en DEF (+1 par rang 5 atteint dans une voie de chamane)." },
      { r: 4, n: 'Perception héroïque', d: "+1 en PER et dé bonus aux tests de PER." },
      { r: 5, n: 'Esprit lié', a: 'A', s: true, d: "Au contact : la cible bénéficie d'une RD 5 jusqu'à ce que le cumul des DM absorbés atteigne [niveau × 5] ; l'esprit est alors détruit et le chamane affaibli jusqu'à sa prochaine récupération." }
    ]},
    { id: 'formeesprit', nom: "Voie de la forme d'esprit", caps: [
      { r: 1, n: 'Esprit de veille', a: 'A', s: true, comp: 'communiquer avec les esprits (fantômes et créatures désincarnées inclus)', bon: '2+rang', d: "Pendant une récupération complète, son esprit invisible veille au-dessus de son corps (immobile, dé bonus aux tests de PER) ; se réveiller met fin au sort. Ajoute rang + 2 aux tests indiqués." },
      { r: 2, n: 'Esprit de repos', a: 'A', s: true, d: "Utilisable pendant une récupération rapide, simplement assis : s'il n'est pas dérangé, le DR dépensé donne automatiquement le résultat maximal." },
      { r: 3, n: 'Arpenteur de rêves', a: 'L', s: true, d: "Dort [VOL] heures et visite les rêves d'une cible dont il possède une relique (objet personnel : -5 à -10) : test opposé d'attaque magique. Témoin invisible ; peut apparaître et transmettre un message d'une dizaine de mots." },
      { r: 4, n: 'Perception des esprits', d: "+1 en PER. Ajoute sa PER à son total de PM (en plus de sa VOL)." },
      { r: 5, n: 'Esprit vagabond', a: 'L', s: true, d: "Pendant que son corps dort, son esprit invisible et immatériel voyage [PER] minutes (10 m par mouvement, vol, traverse la matière mais pas les êtres vivants ni les barrières magiques ; voit l'invisible, n'entend pas). À la fin, peut transférer son corps à l'endroit atteint." }
    ]}
  ]
};

/* ---------------- Parangon (combattant) ---------------- */
COF.PROFILS.parangon = {
  id: 'parangon', nom: 'Parangon', famille: 'combattant', pv: 5,
  caracs: ['AGI', 'VOL', 'PER'],
  resume: "Un champion vif et rapide voué au sabre et à l'arc, entraîné comme un athlète (le « samouraï » du Protectorat de fer).",
  armes: "Toutes les armes de contact et à distance ; préfère vivelame et sabres. Dédaigne les armes-outils (haches, bâtons, marteaux, fléaux…), incompatibles avec ses capacités.",
  armureMax: 'chemise', bouclier: false,
  armuresTexte: "Jusqu'à la chemise de mailles. Pas de bouclier.",
  equipDepart: [
    { nom: 'Sabre droit', type: 'contact', ref: 'sabredroit' },
    { nom: "Sabre d'entraînement en bois", type: 'objet' },
    { nom: 'Dague', type: 'contact', ref: 'dague' },
    { nom: 'Arc court', type: 'distance', ref: 'arccourt' },
    { nom: 'Chemise de mailles', type: 'armure', ref: 'chemise' }
  ],
  voies: [
    { id: 'arccheval', nom: "Voie de l'arc et du cheval", caps: [
      { r: 1, n: 'Équitation martiale', comp: 'équitation', bon: '2+rang', d: "À cheval : +1 en attaque (contact et distance), +1 en DEF à partir du rang 3. Guide sa monture des genoux pour utiliser toute arme à deux mains. Ajoute rang + 2 aux tests d'équitation." },
      { r: 2, n: 'Tir en mouvement', a: 'A', d: "À cheval, attaque à distance en se déplaçant de 10 m au maximum." },
      { r: 3, n: 'Tir expert', d: "Peut utiliser sa PER au lieu de l'AGI en attaque à distance avec une arme à projectiles. Plage de critique augmentée de 1 à l'arc." },
      { r: 4, n: 'Perception héroïque', d: "+1 en PER et dé bonus aux tests de PER." },
      { r: 5, n: 'Tirs successifs', a: 'L', d: "À cheval, 20 m en ligne droite : jusqu'à 2 attaques à l'arc sur des cibles différentes à moins de 20 m de sa trajectoire, toutes du même côté (+1 attaque par rang 5 atteint dans une autre voie de parangon)." }
    ]},
    { id: 'honneur', nom: "Voie de l'honneur", caps: [
      { r: 1, n: 'Chef né', comp: 'donner des ordres, intimider, rendre la justice', bon: '2+rang', d: "Immunisé à la peur. Ajoute rang + 2 à ces tests." },
      { r: 2, n: 'Duel', a: 'A', d: "Défie un ennemi (1 par combat) : bonus aux DM au contact égal à sa VOL contre lui jusqu'à la fin du combat." },
      { r: 3, n: 'Honorable', d: "Peut calculer ses PC avec la VOL au lieu du CHA (sinon +1 PC). Le MJ peut lui rendre un PC quand il agit honorablement à ses dépens, ou lui en retirer s'il se déshonore." },
      { r: 4, n: 'Volonté héroïque', d: "+1 en VOL et dé bonus aux tests de VOL." },
      { r: 5, n: 'Surmonter la douleur', d: "Immunisé aux états affaibli et étourdi." }
    ]},
    { id: 'maitrise', nom: 'Voie de la maîtrise intérieure', caps: [
      { r: 1, n: 'Esprit vide', d: "+2 en Init. (+1 par rang 3 atteint dans une voie de parangon)." },
      { r: 2, n: 'Main vide', dmg: '1d4+FOR', d: "À mains nues, peut utiliser l'AGI en attaque au contact (pas aux DM) ; inflige [1d4 + FOR] DM létaux (1d6 au rang 4)." },
      { r: 3, n: 'Cri', a: 'G', f: 'combat', d: "1×/combat, après une attaque réussie : obtient les DM maximaux de l'attaque. Au rang 5, une seconde fois au moins 1d6 rounds plus tard." },
      { r: 4, n: 'Technique mortelle', dmg: '1d4°', d: "Plage de critique augmentée de 1 avec les sabres et +1d4° DM sur un critique ; +1 à la plage par rang 4 atteint dans une autre voie de parangon. Au-delà de la limite de 16-20, chaque point devient +1d4° DM sur les critiques." },
      { r: 5, n: 'Puissance du cri', d: "Un critique obtenu en utilisant son Cri étourdit la cible 1 round (créatures non vivantes immunisées)." }
    ]},
    { id: 'sabre', nom: 'Voie du sabre', caps: [
      { r: 1, n: 'Technique du sabre', d: "Avec un sabre (court, droit ou vivelame) : AGI au lieu de la FOR en attaque au contact, et rang atteint dans la voie au lieu de la FOR aux DM (non multiplié sur un critique). À déclarer par défaut ou au début du combat." },
      { r: 2, n: 'Frappe du vide', a: 'A', dmg: '1d4°', d: "Première attaque au contact du combat, sabre au fourreau : dégaine en action gratuite, +2 en attaque et +1d4° DM." },
      { r: 3, n: 'Lames jumelles', a: 'L', d: "Un sabre droit dans chaque main (1d6, crit. 19-20) si FOR ≥ +2, sinon deux sabres courts (1d4, crit. 19-20). Un test d'attaque par arme ; pas de bonus de Technique du sabre sur la main secondaire." },
      { r: 4, n: 'Agilité héroïque', d: "+1 en AGI et dé bonus aux tests d'AGI." },
      { r: 5, n: 'Déluge de lames', a: 'L', f: 'jour', d: "1×/jour, autant d'attaques au contact que de rounds écoulés au contact d'un ennemi actif depuis le début du combat, réparties à sa guise (3 au plus par adversaire)." }
    ]},
    { id: 'traditions', nom: 'Voie des traditions', caps: [
      { r: 1, n: 'Esprit éclairé', d: "Sait lire et écrire. +1 par rang dans la voie aux tests de CHA et d'INT liés aux arts et aux lettres (poésie, calligraphie, art floral…) et aux tests de séduction." },
      { r: 2, n: 'Force de la répétition', d: "Après 1 h d'entraînement le matin : 1 point de combat par rang dans la voie (+1 par rang 4 atteint dans une autre voie de parangon), 1 au plus par attaque, jusqu'à la récupération complète suivante. 1 point = dé bonus à un test d'attaque, ou +1d4° en DEF contre une attaque (avant le résultat)." },
      { r: 3, n: 'Lame de lignée', d: "Vivelame, sabre droit ou paire de sabres courts de famille : +1 en attaque au contact tous les 3 niveaux (+1 au niv. 3, +2 au niv. 6…). Au rang 5 de la voie, +1 niveau de magie (affûtée, fléau ou DM élémentaires). Perdue : -1 à tous ses tests tant qu'il ne la retrouve pas." },
      { r: 4, n: 'Instant présent', d: "Prendre son temps ne demande que 2 fois plus de temps (au lieu de 5) et il ajoute sa VOL au résultat. En dépensant 1 point de combat, résultat automatique de 10 au d20 sur une action d'attaque." },
      { r: 5, n: 'Tradition familiale', choix: true, choixVoie: { familles: ['aventurier', 'mage', 'mystique'], rangMax: 3 }, d: "Choisir une capacité de rang 1 à 3 de n'importe quelle voie hors famille des combattants (limitations d'armure en combat). +3 PV pour une capacité de rang 1, +2 PV pour une de rang 2. Un sort coûte des PM (et en rapporte un)." }
    ]}
  ]
};

/* ---------------- Primaliste (mage) ---------------- */
COF.PROFILS.primaliste = {
  id: 'primaliste', nom: 'Primaliste', famille: 'mage', pv: 4,
  caracs: ['VOL', 'CON', 'PER'], magie: 'VOL',
  pasVoieMage: true,
  resume: "Le « mage du peuple », autodidacte et va-nu-pieds, dont la magie élémentaire naît du bois, des brumes, des rivières, du sol et du feu.",
  note: "Sorts lancés pieds nus : chaussé, il subit au choix un dé malus au test d'attaque ou +1 PM (toujours +1 PM si le sort n'a pas de test). N'a pas accès à la voie du mage, ni aux parchemins et grimoires (sauf via une voie de magicien, jusqu'au rang atteint dans celle-ci).",
  armes: "Bâton, gourdin, hachette (contact et lancer), marteau, dague et fronde.",
  armureMax: 'cuir', bouclier: false,
  armuresTexte: "Jusqu'au cuir simple. Pas de bouclier.",
  equipDepart: [
    { nom: 'Marteau (ou hachette)', type: 'contact', ref: 'marteau' },
    { nom: 'Fronde', type: 'distance', ref: 'fronde' },
    { nom: 'Armure de cuir', type: 'armure', ref: 'cuir' }
  ],
  voies: [
    { id: 'bois', nom: 'Voie du bois', caps: [
      { r: 1, n: "Pluie d'échardes", a: 'A', s: true, comp: 'sculpture sur bois', bon: '2+rang', dmg: '1d4°+VOL', d: "Bâton ou morceau de bois en main : attaque magique contre la DEF (10 m), [1d4° + VOL] DM perforants." },
      { r: 2, n: 'Bois durci', a: 'M', s: true, d: "Son arme de bois (bâton ou gourdin) inflige +1 DM pendant [VOL] heures (+1 par rang 4 atteint dans une voie de primaliste) ; le bonus s'applique aussi à Pluie d'échardes lancée avec son bâton." },
      { r: 3, n: 'Cheval de bois', a: 'A', s: true, d: "Une statuette de cheval sculptée (10 min, jusqu'à 24 h avant) devient un cheval de guerre infatigable pendant [niveau] heures. Au rang 5 et au niveau 9, cheval d'ébène volant." },
      { r: 4, n: 'Explosion du bois', a: 'A', s: true, dmg: '3d4°+VOL', d: "Un objet en bois ou un arbre explose dans un rayon de 2 à 6 m : [3d4° + VOL] DM, test d'AGI difficulté [10 + VOL] pour moitié. Contre un bouclier en bois [2d4° + VOL] ou un manche d'arme [1d4° + VOL] : test opposé d'attaque magique ; objet non magique détruit." },
      { r: 5, n: 'Figurine en bois', a: 'A', s: true, d: "Une statuette d'animal sculptée (10 min, jusqu'à 24 h avant) devient un animal réel de NC ≤ 3 (+1 par rang 5 dans une autre voie de primaliste) qui obéit à des ordres simples pendant [niveau] rounds." }
    ]},
    { id: 'brumes', nom: 'Voie des brumes', caps: [
      { r: 1, n: 'Températion', a: 'L', s: true, comp: 'prédiction météorologique', bon: '2+rang', d: "Bulle de température clémente : protégé des DM naturels de froid ou de chaleur pendant 12 h ; réduit les DM de feu ou de froid magiques de 1 par rang atteint dans la voie." },
      { r: 2, n: 'Manteau de brume', a: 'M', s: true, d: "Brume de 3 m de rayon pendant [VOL] minutes : les attaques à distance ou magiques contre lui subissent un dé malus. Dans le noir ou la pénombre : dé bonus en discrétion." },
      { r: 3, n: 'Armure de brume', a: 'A', s: true, d: "Pendant [VOL] minutes : RD 1 contre les attaques perforantes, 2 contre les tranchantes, 3 contre les contondantes." },
      { r: 4, n: 'Volonté héroïque', d: "+1 en VOL et dé bonus aux tests de VOL." },
      { r: 5, n: 'Nuage personnel', a: 'A', s: true, d: "Un nuage du ciel le rejoint : lui et 5 créatures de taille moyenne volent dessus pendant [VOL] heures à [niveau] km/h (10 m par mouvement en combat)." }
    ]},
    { id: 'rivieres', nom: 'Voie des rivières', caps: [
      { r: 1, n: 'Traversée', a: 'L', s: true, comp: 'natation', bon: '2+rang', d: "Entre dans une rivière et réapparaît sur la rive opposée (50 m par rang au plus ; un petit lac à partir du rang 3). Une créature de plus par rang, pour +1 PM chacune." },
      { r: 2, n: 'Source claire', a: 'L', s: true, d: "Une source jaillit pendant [VOL] minutes : chaque minute, deux personnes s'y hydratent et récupèrent 1 DR." },
      { r: 3, n: 'Lance liquide', a: 'A', s: true, dmg: '1d4°+VOL', d: "Avec un peu d'eau : lance solide pendant [VOL] minutes, attaque au contact avec l'attaque magique, [1d4° + VOL] DM. Lancée (30 m, 60 m avec dé malus) : attaque magique contre la DEF, [3d4° + VOL] DM, puis le sort prend fin." },
      { r: 4, n: 'Fluide', d: "+2 en DEF et en Init. Aucune pénalité pour combattre dans l'eau ; retient sa respiration [VOL] minutes ; parle et lance des sorts normalement sous l'eau." },
      { r: 5, n: 'Crue dévastatrice', a: 'A', s: true, dmg: '3d4°', d: "Au round suivant, une petite rivière décuple sa largeur : 3d4° DM et test de FOR difficulté [15 + VOL] sinon emporté (+3d4° DM, rejeté à 1d4° × 100 m en aval). DM doublés si la rivière ne peut s'élargir (gorge étroite)." }
    ]},
    { id: 'sol', nom: 'Voie du sol', caps: [
      { r: 1, n: 'Sens de la terre', a: 'L', s: true, comp: "s'orienter sous terre", bon: '2+rang', d: "Pendant [1d4° + PER] minutes : 20 m par mouvement au sol et localise toutes les créatures au contact du sol dans un rayon de 20 m, même cachées ou invisibles." },
      { r: 2, n: 'Pilier magique', a: 'M', s: true, d: "Un pilier de 6 m le soulève pendant [VOL] minutes : hors de portée au contact des créatures jusqu'à la taille grande ; dé malus pour les énormes. Nécessite 6 m sous plafond." },
      { r: 3, n: 'Sables mouvants', a: 'A', s: true, d: "Zone de 10 m de diamètre (30 m) pendant [1d4° + VOL] rounds : test d'AGI difficulté [10 + VOL] sinon immobilisé ; se libérer : action de mouvement et nouveau test avec dé malus." },
      { r: 4, n: 'Passage par le sol', a: 'G', s: true, d: "S'enfonce dans le sol et réapparaît jusqu'à 5 m par niveau, en un lieu en vue (à partir du rang 4 de la voie, un lieu parfaitement connu suffit)." },
      { r: 5, n: 'Champ mortel', a: 'A', s: true, dmg: '3d4°+VOL', d: "Zone de 50 × 50 m en extérieur (10 × 10 m en intérieur) pendant [VOL] heures : à chaque mouvement au sol, test de PER difficulté [15 + VOL] (-5 en avançant prudemment) sinon explosion de [3d4° + VOL] DM (moitié dans un rayon de 5 m)." }
    ]},
    { id: 'torche', nom: 'Voie de la torche', caps: [
      { r: 1, n: 'La torche', a: 'M', s: true, dmg: '1d4°+FOR', d: "Une torche ou un gourdin s'enflamme pendant [VOL] minutes : [1d4° + FOR ou AGI] DM ; les animaux qui attaquent son porteur subissent un dé malus (animaux géants au rang 3, fantastiques au rang 5)." },
      { r: 2, n: 'Feu de camp', a: 'L', s: true, t: 'soin', dmg: '2d4°', d: "Rituel de 10 min : le feu de camp brûle 8 h ; chaque PJ qui fait une récupération complète à 5 m récupère 2d4° PV de plus (+1d4° par rang 4 atteint dans une voie de primaliste)." },
      { r: 3, n: 'Torche puissante', a: 'A', s: true, d: "La torche inflige +1d4° DM et son effet défensif s'étend aux morts-vivants. Torche en main : immunisé au feu naturel, DM des feux ou froids magiques divisés par 2 (après la réduction de Températion)." },
      { r: 4, n: 'Boutefeu', dmg: '1d4°', d: "Une créature blessée par la torche doit réussir un test d'AGI difficulté 10 ou prendre feu : 1d4° DM de feu par round jusqu'à ce qu'elle passe un round à éteindre les flammes." },
      { r: 5, n: 'Passage par le feu', a: 'L', s: true, t: 'soin', dmg: '3d4°+VOL', d: "Entre dans un feu de camp ou de cheminée et ressort par n'importe quel autre dans un rayon de 5 km par niveau, en récupérant [3d4° + VOL] PV." }
    ]}
  ]
};

/* ---------------- Psionique (famille au choix) ----------------
   Les pouvoirs marqués d'un * dans le livre sont notés comme des sorts
   (s: true) : ils ne coûtent pas des PM mais des points d'ego (PE), qui
   suivent exactement les mêmes règles de calcul ; pour un psionique pur,
   la jauge de mana de la fiche sert donc de jauge de PE. */
COF.PROFILS.psionique = {
  id: 'psionique', nom: 'Psionique', famille: 'aventurier', familleChoix: true, pv: 4,
  caracs: ['VOL', 'PER', 'CON'], magie: 'VOL', pasVoieMage: true,
  resume: "Un être d'exception doté de pouvoirs psychiques innés, maître de l'esprit ou guerrier porté par sa volonté.",
  note: "Famille au choix (aventurier, combattant, mage ou mystique) : elle fixe le dé de récupération et les voies de prestige ; toujours 4 PV par niveau ; pas de voie du mage. Les pouvoirs (*) coûtent des points d'ego (PE) au lieu de PM, selon les mêmes règles ; les PE ne reviennent pas seuls : chaque DR dépensé en récupération rend 1d4° PE (maximum en récupération complète) au lieu de PV. VOL +1 minimum. Aucune limitation d'armure pour les capacités de psionique ; un casque gêne (+1 PE, +2 avec un heaume).",
  armes: "Toutes les armes de contact et à distance infligeant au plus 1d6 DM et sans plage de critique améliorée.",
  armureMax: 'chemise', bouclier: false,
  armuresTexte: "Jusqu'à la chemise de mailles. Pas de bouclier. Ses pouvoirs ne sont limités par aucune armure.",
  equipDepart: [
    { nom: 'Épée courte', type: 'contact', ref: 'epeecourte' },
    { nom: 'Dague', type: 'contact', ref: 'dague' },
    { nom: 'Cuir renforcé', type: 'armure', ref: 'cuirren' }
  ],
  voies: [
    { id: 'attaquementale', nom: "Voie de l'attaque mentale", caps: [
      { r: 1, n: 'Attaque mentale', a: 'L', s: true, dmg: '2d4°+VOL', d: "Test opposé d'attaque magique (50 m) : [2d4° + VOL] DM mentaux (ignorent les RD physiques ; créatures sans esprit immunisées). DM temporaires possibles, réduits alors de la VOL de la cible." },
      { r: 2, n: 'Bouclier psi', a: 'A', s: true, d: "Pendant [VOL] heures : +5 en DEF (ou à la difficulté) contre toutes les attaques mentales, psi ou magiques, et DM d'Attaque mentale divisés par 2." },
      { r: 3, n: 'Attaque étourdissante', a: 'A', s: true, dmg: '2d4°+VOL', d: "Comme Attaque mentale ; avec un dé malus volontaire, en cas de succès : +2d4° DM ou cible étourdie 1 round (pas contre un NC supérieur à son niveau ni un Bouclier psi)." },
      { r: 4, n: 'Volonté héroïque', d: "+1 en VOL et dé bonus aux tests de VOL." },
      { r: 5, n: 'Vague psionique', a: 'A', s: true, dmg: '2d4°+VOL', d: "Une Attaque mentale contre [3 + PER] cibles au plus, à portée d'attaque mentale." }
    ]},
    { id: 'controlecorporel', nom: 'Voie du contrôle corporel', caps: [
      { r: 1, n: 'Proprioception', comp: "endurance (courir ou marcher longtemps)", bon: '2+rang', d: "Ajoute rang + 2 à ces tests. Ajoute sa VOL à ses PV max." },
      { r: 2, n: 'Transe de régénération', a: 'L', s: true, t: 'soin', dmg: '1d4°+PER', d: "Transe immobile de 1d4° min : récupère [1d4° + PER] PV (même d4° pour la durée et les PV). Rang 3 : met fin à un empoisonnement et immunise aux poisons et saignements pendant 1d4° min. Rang 5 : [2d4° + PER] PV." },
      { r: 3, n: 'Contrôle du métabolisme', d: "Ajoute sa VOL à son Init. et à ses tests de CON. Moitié moins de nourriture, d'eau, d'air et de sommeil. Un DR dépensé pour récupérer des PE rend aussi les PV habituels." },
      { r: 4, n: 'Constitution héroïque', d: "+1 en CON et dé bonus aux tests de CON." },
      { r: 5, n: 'Accélération', a: 'G', s: true, d: "Pendant [VOL + PER] rounds : une action supplémentaire par round (mouvement ou attaque), +5 en Init. et +3 en DEF ; ensuite affaibli jusqu'à la fin d'une récupération rapide." }
    ]},
    { id: 'empathie', nom: "Voie de l'empathie", caps: [
      { r: 1, n: 'Perception extra-sensorielle', comp: 'PER pour deviner les émotions', bon: '2+rang', d: "Ajoute rang + 2 à ces tests. Aucune pénalité pour combattre dans le noir une cible à moins de [PER × 10] m (les ténèbres magiques l'aveuglent toujours)." },
      { r: 2, n: 'Défense intuitive', d: "+1 en DEF, ou remplace l'AGI par la PER dans sa DEF (dans la limite d'AGI de l'armure)." },
      { r: 3, n: 'Perception du passé', a: 'L', s: true, d: "Perçoit les émotions dominantes liées aux événements d'un lieu ; test de PER difficulté 15 pour dater l'événement (+5 s'il date de moins de 24 h ou si l'émotion est intense : meurtre, torture…)." },
      { r: 4, n: 'Perception héroïque', d: "+1 en PER et dé bonus aux tests de PER. +1 PE (+1 par rang 4 atteint dans une autre voie de psionique)." },
      { r: 5, n: 'Vision lointaine', a: 'A', s: true, d: "Pendant [PER] minutes, perçoit avec l'un de ses sens un lieu déjà visité : test de PER difficulté [10 + 1 par jour depuis sa dernière visite]. Échec critique : aveuglé 1d6 min." }
    ]},
    { id: 'telekinesie', nom: 'Voie de la télékinésie', caps: [
      { r: 1, n: 'Manipulation à distance', a: 'M', s: true, d: "Déplace un objet de moins de 10 kg à 20 m (10 m par round) pendant [rang] rounds. Chaque round, attaque avec une arme maîtrisée manipulée à distance (attaque magique, +VOL aux DM) en action d'attaque — action de mouvement au rang 3, gratuite au rang 5 (1×/round). Cette attaque ne bénéficie d'aucune capacité (la magie de l'arme s'applique)." },
      { r: 2, n: 'Champ de protection', a: 'M', s: true, d: "+5 en DEF pendant 1 round complet. À partir du rang 4, peut le déployer autour d'un allié à moins de 10 m." },
      { r: 3, n: 'Onde de choc', a: 'L', s: true, dmg: '2d4°+VOL', d: "Vague de force à 360° (10 m au plus) : [2d4° + VOL] DM ([3d4° + VOL] au rang 5) et test de FOR difficulté [10 + VOL] sinon renversé." },
      { r: 4, n: 'Psychoportation', a: 'A', s: true, d: "Vole pendant [1d4° + VOL] minutes à sa vitesse au sol (stationnaire en action gratuite). En permanence : VOL au lieu de FOR pour les tests de puissance physique (pas aux DM au contact)." },
      { r: 5, n: "Puissance de l'esprit", a: 'A', s: true, d: "Soulève [attaque magique × 1 000] kg ou une créature de taille énorme au plus (test opposé d'attaque magique : immobilisée) pendant [VOL] rounds, 3 m par mouvement. Lâchée en hauteur : 1d4° par tranche de 3 m (10d4° max). Un objet lourd précipité inflige autant (test d'AGI difficulté 10 pour l'éviter)." }
    ]},
    { id: 'telepathie', nom: 'Voie de la télépathie', caps: [
      { r: 1, n: 'Télépathie', a: 'L', s: true, d: "Communique par la pensée avec une créature en vue, dans une langue commune, pendant [5 + PER] rounds. Rang 3 : une créature connue, hors de vue, à [100 × PER] m. Rang 5 : sans langue commune, même avec un animal." },
      { r: 2, n: 'Caméléon mental', a: 'M', s: true, d: "+10 aux tests de discrétion pendant [VOL] minutes (pas contre les créatures sans esprit) ; cesse s'il commet des actes trop voyants." },
      { r: 3, n: 'Suggestion', a: 'L', s: true, d: "Test opposé d'attaque magique contre une créature pensante de NC inférieur à son niveau : elle exécute l'action suggérée pendant 24 h au plus (test de VOL difficulté 10 pour éviter une action suicidaire)." },
      { r: 4, n: 'Imposture mentale', a: 'L', s: true, d: "Test opposé d'attaque magique (20 m) : la créature le prend pour un proche de longue date pendant [VOL] minutes. De graves impairs ou des témoins incrédules peuvent imposer de nouveaux tests." },
      { r: 5, n: 'Domination psy', a: 'L', s: true, dmg: '1d4°', d: "Test opposé d'attaque magique (20 m) contre une créature de NC inférieur à son niveau : contrôle son esprit [VOL] minutes, son propre corps inerte. La victime retente un test de VOL difficulté [10 + VOL] à chaque DM subi ; si elle meurt, le psionique réintègre son corps et subit 1d4° DM." }
    ]}
  ]
};
