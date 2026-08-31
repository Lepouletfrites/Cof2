/* ============================================================
   COF2 Compagnon — Profils : famille des AVENTURIERS
   4 PV/niveau · DR d8 · +1 point de chance
   ============================================================ */
window.COF = window.COF || {};
COF.PROFILS = COF.PROFILS || {};

/* Champs d'une capacité :
   r rang · n nom · a action (A/L/M/G) · s sort · f fréquence
   dmg formule de DM/soins · comp bonus de compétence · bon '2+rang' ou nombre
   choix true (ouvre une autre capacité) · d description                */

COF.PROFILS.arquebusier = {
  id: 'arquebusier', nom: 'Arquebusier', famille: 'aventurier', pv: 4,
  caracs: ['AGI', 'INT', 'CON'],
  resume: "Un spécialiste des armes à feu et des explosifs, souvent mercenaire.",
  armes: "Toutes les armes de contact à une main, toutes les armes à distance (armes à poudre incluses). Sait fabriquer sa poudre sans risque d'explosion.",
  armureMax: 'chemise', bouclier: false,
  armuresTexte: "Jusqu'à la chemise de mailles. Bouclier interdit.",
  equipDepart: [
    { nom: 'Pétoire', type: 'distance', ref: 'petoire' },
    { nom: 'Épée longue', type: 'contact', ref: 'epeelongue' },
    { nom: 'Dague', type: 'contact', ref: 'dague' },
    { nom: 'Cuir renforcé', type: 'armure', ref: 'cuirren' }
  ],
  voies: [
    { id: 'artilleur', nom: "Voie de l'artilleur", caps: [
      { r: 1, n: 'Mécanismes', comp: "réparer/comprendre des mécanismes, désamorcer des pièges, armes de siège", bon: '2+rang', d: "Ajoute rang + 2 à ces tests. Dé bonus aux attaques avec les armes de siège." },
      { r: 2, n: 'Arme à répétition', d: "Dote jusqu'à 2 armes de chargeurs de [2 + INT] projectiles (+1 par rang 3 atteint dans une voie d'arquebusier). Recharge : 1 action limitée par projectile." },
      { r: 3, n: 'Tir de barrage', a: 'L', d: "Surveille une zone de 20 m. Toute créature qui s'y déplace subit une attaque à distance : au choix double DM, ou elle stoppe son déplacement sans DM. Plusieurs cibles possibles tant qu'il n'a pas à recharger." },
      { r: 4, n: 'Canon double', d: "Double le dé de DM de ses armes à poudre (pas les bonus ni les dés bonus). Consomme 2 projectiles, recharge canon par canon. Critique : dé triplé." },
      { r: 5, n: 'Couleuvrine', a: 'L', dmg: '5d4°+INT', d: "Obtient une couleuvrine (portée 100 m). Attaque à distance avec dé bonus : [5d4° + INT] DM. Recharge : 2 rounds (L). Une seule transportable." }
    ]},
    { id: 'explosifs', nom: 'Voie des explosifs', caps: [
      { r: 1, n: 'Tir de grenaille', a: 'L', comp: "artificier (feux d'artifice…)", bon: '2+rang', d: "Charge un mélange de grenaille : un seul test d'attaque contre toutes les cibles d'un cône de 10 m × 5 m ; celles dont il atteint la DEF subissent la moitié des DM." },
      { r: 2, n: 'Démolition', dmg: '3d4°+INT', d: "3 rounds pour préparer un explosif : [3d4° + INT] DM à une structure (ignore la moitié de sa RD), 2d4° dans un rayon de 2 m. Charges par jour = rang dans la voie (partagées avec Piège explosif et Boulet explosif)." },
      { r: 3, n: 'Poudre puissante', d: "+10 m de portée et +1 aux DM des armes à poudre (+1 de plus par rang 5 atteint dans une voie d'arquebusier). Sa poudre est magique : affecte les créatures immunisées aux armes non magiques." },
      { r: 4, n: 'Piège explosif', a: 'L', dmg: '5d4°+INT', d: "1 min pour installer un piège : [5d4° + INT] DM de feu dans 5 m (test d'AGI difficulté 15 pour moitié DM). Détection : test d'INT difficulté [15 + INT]." },
      { r: 5, n: 'Boulet explosif', a: 'L', dmg: '4d4°+INT', d: "Lance un boulet (portée 20 m) : [4d4° + INT] DM perforants dans 5 m, divisés par 2 sur un test d'AGI difficulté 10 réussi ; les autres sont aveuglés 1 round." }
    ]},
    { id: 'mercenaire', nom: 'Voie du mercenaire', caps: [
      { r: 1, n: 'Pilier de bar', comp: "interaction sociale en taverne, résister à l'alcool", bon: '2+rang', dmg: '1d4°', d: "Ajoute rang + 2 à ces tests. Inflige 1d4° DM à mains nues (non létal) et divise par 2 les DM non létaux subis." },
      { r: 2, n: 'Mort ou vif', a: 'L', d: "Attaque au contact ou à distance. Si réussie : DM habituels (ou temporaires) et au choix désarmer, renverser ou affaiblir (1d4 rounds) un adversaire de NC < rang. Critique : deux effets cumulés." },
      { r: 3, n: 'Combattant aguerri', choix: true, d: "Choisir une capacité de rang 1 de guerrier, de voleur (armure de cuir) ou de rôdeur (cuir renforcé). +1 en DEF." },
      { r: 4, n: 'Constitution héroïque', d: "+1 en CON et dé bonus aux tests de CON." },
      { r: 5, n: 'Combat de masse', d: "Dans un combat impliquant au moins 10 créatures actives : 1 action d'attaque ou de mouvement supplémentaire par tour. +1 en DEF." }
    ]},
    { id: 'pistolero', nom: 'Voie du pistolero', caps: [
      { r: 1, n: 'Plus vite que son ombre', d: "Arme à poudre chargée en main : +5 en Initiative. Plus de dé malus pour tirer à l'arme à poudre ou à l'arbalète au contact (sauf couleuvrine)." },
      { r: 2, n: 'Ajuster le tir', d: "Après une attaque à distance ratée, déclare un tir de réglage : +5 au test de la prochaine attaque à distance sur la même cible (avant la fin du round suivant)." },
      { r: 3, n: 'Tir double', a: 'L', d: "Tire simultanément avec une pétoire (ou arbalète de poing) dans chaque main, -2 à chaque attaque. Aucun malus si les deux tirs visent la même cible." },
      { r: 4, n: 'Agilité héroïque', d: "+1 en AGI et dé bonus aux tests d'AGI." },
      { r: 5, n: 'As de la gâchette', t: 'bonus', dmg: '2d4°', d: "Attaque à distance à l'arme à poudre ou à l'arbalète : si le résultat dépasse la DEF de 10 points ou plus, +2d4° aux DM." }
    ]},
    { id: 'precision', nom: 'Voie de la précision', caps: [
      { r: 1, n: 'Joli coup', d: "Ignore la pénalité de couverture partielle (-2 → 0) et réduit celle de couverture importante à -2 (au lieu de -5)." },
      { r: 2, n: 'Défaut dans la cuirasse', a: 'A', d: "Vise une cible : au round suivant, ses attaques à distance sur elle se font contre une DEF de [10 + AGI de la cible] et ignorent sa RD/résistance aux DM (sauf immatériel)." },
      { r: 3, n: 'Tir précis', d: "Critique sur 19-20 avec les armes à distance ; 18-20 à partir du rang 5." },
      { r: 4, n: "Tireur d'élite", a: 'L', t: 'bonus', dmg: '2d4°', d: "Cible à 10 m minimum : double la portée de l'arme et +2d4° aux DM. Impossible au contact ou en position instable." },
      { r: 5, n: 'Tir fatal', a: 'L', d: "Contre une créature de NC < la moitié de son niveau (arrondi sup.) : test d'INT difficulté [10 + NC]. Réussite = mort. Sinon DM normaux." }
    ]}
  ]
};

COF.PROFILS.barde = {
  id: 'barde', nom: 'Barde', famille: 'aventurier', pv: 4,
  caracs: ['CHA', 'AGI', 'VOL'],
  resume: "Un artiste polyvalent capable d'utiliser la rapière autant que la magie.",
  magie: 'CHA',
  armes: "Les armes à une main.",
  armureMax: 'cuirren', bouclier: false,
  armuresTexte: "Jusqu'au cuir renforcé. Bouclier interdit. Une main doit rester libre pour les capacités de barde.",
  equipDepart: [
    { nom: 'Rapière', type: 'contact', ref: 'rapiere' },
    { nom: 'Dague', type: 'contact', ref: 'dague' },
    { nom: 'Instrument de musique', type: 'objet' },
    { nom: 'Armure de cuir', type: 'armure', ref: 'cuir' }
  ],
  voies: [
    { id: 'escrime', nom: "Voie de l'escrime", caps: [
      { r: 1, n: 'Précision', d: "Peut remplacer la FOR par l'AGI pour ses tests d'attaque au contact (pas aux DM) avec une arme légère à une main (dague, épée courte, rapière)." },
      { r: 2, n: 'Feinte', a: 'L', t: 'bonus', dmg: '2d4°', d: "Test opposé de CHA contre PER. Au round suivant : bonus d'attaque égal au double du rang sur la première attaque au contact contre cette cible et, si la feinte a réussi, +2d4° aux DM." },
      { r: 3, n: 'Intelligence du combat', a: 'M', f: 'combat', d: "1×/combat : désarmer, renverser ou aveugler 1 round un adversaire de NC inférieur (test opposé d'INT, +5 après une feinte réussie)." },
      { r: 4, n: 'Attaque flamboyante', a: 'L', d: "Attaque de contact à l'arme légère : ajoute son CHA en attaque et aux DM (en plus de FOR ou AGI)." },
      { r: 5, n: 'Botte mortelle', t: 'bonus', dmg: '2d4°', d: "Attaque au contact à l'arme légère : si le résultat dépasse la DEF de 10 points ou plus, +2d4° aux DM." }
    ]},
    { id: 'musicien', nom: 'Voie du musicien', caps: [
      { r: 1, n: 'Chant des héros', a: 'L', s: true, comp: "jouer d'un instrument, chanter", bon: '2+rang', d: "Tous ses alliés à portée de voix et lui gagnent +1 à tous leurs tests pendant [CHA] minutes (+2 au rang 5). Fredonner est une action gratuite." },
      { r: 2, n: 'Chant de réconfort', a: 'L', s: true, t: 'soin', dmg: '1d4°', d: "Joue pendant une récupération rapide (30 min) : lui et ses alliés dans 10 m récupèrent 1d4° PV (2d4° au rang 4)." },
      { r: 3, n: 'Attaque sonore', a: 'A', s: true, dmg: '2d4°+CHA', d: "[2d4° + CHA] DM à toutes les cibles d'un cône de 10 m. Test de CON difficulté [10 + CHA] pour moitié DM." },
      { r: 4, n: 'Zone de silence', a: 'A', s: true, d: "Zone de silence fixe de 5 m de diamètre à 30 m, pendant [CHA] minutes. Lancer un sort à l'intérieur demande un test d'INT difficulté 10." },
      { r: 5, n: 'Danse irrésistible', a: 'A', s: true, dmg: '1d4°+CHA', d: "Test opposé d'attaque magique (portée 10 m) : la cible danse [1d4° + CHA] rounds, dé malus en attaque et -5 en DEF. 1 round seulement si son NC ≥ niveau du barde." }
    ]},
    { id: 'saltimbanque', nom: 'Voie du saltimbanque', caps: [
      { r: 1, n: 'Acrobate', comp: "acrobaties, équilibre, saut, escalade", bon: '2+rang', d: "Ajoute rang + 2 à ces tests." },
      { r: 2, n: 'Grâce féline', comp: "danse, mime, jonglerie", bon: '2+rang', d: "Ajoute son CHA en Initiative et +1 en DEF (+2 au rang 4)." },
      { r: 3, n: 'Lanceur de couteau', a: 'G', f: 'round', dmg: '1d4+AGI', d: "1×/round en plus de ses actions : lance un couteau (portée 10 m), attaque à distance, [1d4 + AGI] DM, sans pénalité même engagé au contact. DM 1d4° au rang 5." },
      { r: 4, n: "Liberté d'action", d: "Immunisé à la peur et aux sorts asservissant l'esprit (possession, charme), ainsi qu'aux états ralenti et immobilisé." },
      { r: 5, n: 'Esquive acrobatique', a: 'G', f: 'round', d: "1×/round : test d'attaque à distance contre le résultat de l'attaque adverse. Réussite = aucun DM (un critique inflige tout de même des DM normaux)." }
    ]},
    { id: 'seduction', nom: 'Voie de la séduction', caps: [
      { r: 1, n: 'Charmant', comp: "séduire, convaincre, mentir, baratiner", bon: '2+rang', dmg: '1d4°+CHA', d: "Ajoute rang + 2 à ces tests. Peut dépenser 1 PC pour aider un compagnon en vue : +[1d4° + CHA] à son test (au lieu de +10)." },
      { r: 2, n: 'Dentelles et rapière', d: "Sans aucune armure, ajoute son CHA en DEF (en plus de l'AGI), sans dépasser le rang atteint dans la voie." },
      { r: 3, n: 'Baratineur de génie', d: "Après 10 min avec un humanoïde de NC ≤ 1, dépenser 1 PC pour le charmer (2 PC sans langue commune). Il agit comme un ami." },
      { r: 4, n: 'Charisme héroïque', d: "+1 en CHA et dé bonus aux tests de CHA. Peut utiliser son CHA au lieu de sa VOL pour calculer ses PM." },
      { r: 5, n: 'Suggestion', a: 'A', s: true, d: "Test opposé d'attaque magique : la créature fait son possible pour satisfaire une demande pendant 1 h ou jusqu'à réussite. Sans effet sur une créature de niveau ≥ au lanceur." }
    ]},
    { id: 'vagabond', nom: 'Voie du vagabond', caps: [
      { r: 1, n: 'Rumeurs et légendes', comp: "se souvenir d'une information (histoire, politique, géographie, occulte), identifier un objet magique", bon: '2+rang', d: "Ajoute rang + 2 à ces tests d'INT. Identification : difficulté [25 − (2 × niveau de magie)]." },
      { r: 2, n: 'Éclectique', d: "+1 à absolument tous les tests de compétence (+1 de plus par rang 4 atteint dans une voie de barde). Non cumulable avec un autre bonus de compétence, sauf celui de rang 1 d'une voie de peuple." },
      { r: 3, n: 'Attirail', d: "En dépensant 1 PC, sort de son sac un objet improbable non noté sur sa fiche (valeur ≤ 10 pa) ou bricole un objet de fortune." },
      { r: 4, n: 'Compréhension des langues', a: 'A', s: true, d: "Lire, écrire et parler une langue vivante étrangère pendant [CHA] heures (ou [CHA] minutes sur un allié au contact). Langues mortes au rang 5." },
      { r: 5, n: 'Déguisement', a: 'A', s: true, d: "Prend l'apparence de n'importe quel humanoïde de taille voisine. Imiter une personne précise : test de CHA difficulté 15 (10 s'il la connaît bien, 20 s'il l'a seulement vue). Durée [CHA] heures." }
    ]}
  ]
};

COF.PROFILS.rodeur = {
  id: 'rodeur', nom: 'Rôdeur', famille: 'aventurier', pv: 4,
  caracs: ['AGI', 'PER', 'CON'],
  resume: "Un spécialiste de la survie en milieu naturel, ami des animaux et archer hors pair.",
  armes: "Les armes de contact à une main et toutes les armes à distance.",
  armureMax: 'cuirren', bouclier: false,
  armuresTexte: "Jusqu'au cuir renforcé. Bouclier interdit.",
  equipDepart: [
    { nom: 'Épée longue', type: 'contact', ref: 'epeelongue' },
    { nom: 'Arc court et carquois', type: 'distance', ref: 'arccourt' },
    { nom: 'Dague', type: 'contact', ref: 'dague' },
    { nom: 'Cuir renforcé', type: 'armure', ref: 'cuirren' }
  ],
  voies: [
    { id: 'archer', nom: "Voie de l'archer", caps: [
      { r: 1, n: 'Archer émérite', d: "Ajoute sa PER aux DM à l'arc et +1 par rang dans la voie en Initiative. Variante « lancer » : ajoute la FOR aux DM des armes de jet et double leur portée (sans bonus d'Init.)." },
      { r: 2, n: 'Tir chirurgical', d: "Peut tirer sur une cible engagée en mêlée sans pénalité (mais pas à couvert). Ne touche jamais un allié, même sur un échec critique." },
      { r: 3, n: 'Dans le mille', t: 'bonus', dmg: '2d4°', d: "Attaque à distance avec dé malus volontaire : +2d4° aux DM si réussie. En action limitée (L) : +3d4° au lieu de +2d4°." },
      { r: 4, n: 'Tir rapide', a: 'L', d: "Deux attaques à distance pendant son tour avec -2 à chacune." },
      { r: 5, n: 'Flèche de mort', a: 'L', t: 'bonus', dmg: '1d4°', d: "Dé bonus en attaque à distance et +1d4° aux DM. À la place : inflige un état (aveuglé, affaibli, ralenti ou immobilisé) 1 round à une cible de NC inférieur — chaque état une seule fois par combat." }
    ]},
    { id: 'compagnon', nom: 'Voie du compagnon animal', caps: [
      { r: 1, n: 'Le loup', d: "Obtient un loup : DEF [12 + rang], PV [niveau × 4], Init. du rôdeur, attaque = attaque magique du rôdeur, DM 1d4+2. AGI +1, CON +1*, FOR +2, PER +2*, CHA -2, INT -3, VOL +2 (* dé bonus). Il attaque en même temps que le rôdeur.", dmg: '1d4+2' },
      { r: 2, n: "Travail d'équipe", d: "Au contact l'un de l'autre : le loup obtient un dé bonus en attaque, le rôdeur un dé bonus pour pister et éviter la surprise." },
      { r: 3, n: 'Lien empathique', a: 'L', d: "Communication télépathique avec le loup. Peut le soigner à distance en sacrifiant ses propres PV (1 pour 1) en action limitée." },
      { r: 4, n: 'Loup alpha', dmg: '1d4°+5', d: "Le loup devient un mâle alpha : CON +3*, FOR +5, DEF 18, PV [niveau × 5], DM 1d4°+5." },
      { r: 5, n: 'Tactiques de meute', t: 'bonus', dmg: '1d4°', d: "Si le loup attaque la même cible que le rôdeur : +1d4° aux DM. Chaque PV sacrifié rend 2 PV au loup. +1 en DEF pour les deux par rang 5 atteint dans une voie de rôdeur." }
    ]},
    { id: 'survie', nom: 'Voie de la survie', caps: [
      { r: 1, n: 'Survie', comp: "escalade et survie en milieu naturel (tests de récupération inclus)", bon: '2+rang', t: 'soin', dmg: '1d4°', d: "Ajoute rang + 2 à ces tests. En dormant en pleine nature, dépenser 1 DR rend 1d4° PV de plus." },
      { r: 2, n: 'Nature nourricière', f: 'jour', dmg: '1d4°', d: "1×/jour, après 1d6 h en nature sauvage : nourrit 1 personne par rang pour la journée. Test de PER (Survie) difficulté 10 : trouve des plantes soignant 1d4° PV par rang (à répartir, usage immédiat)." },
      { r: 3, n: 'Grand pas', a: 'G', d: "En milieu naturel : +1 en DEF (+2 au rang 5) et 10 m de déplacement en action gratuite. Ignore les terrains difficiles naturels (sans le déplacement bonus)." },
      { r: 4, n: 'Constitution héroïque', d: "+1 en CON et dé bonus aux tests de CON." },
      { r: 5, n: 'Increvable', a: 'L', f: 'combat', t: 'soin', dmg: '4d4°+CON', d: "1×/combat, en tombant à 0 PV : récupère [4d4° + CON] PV au début de son prochain tour, +5 en DEF pendant 1 round et se débarrasse de tous ses états préjudiciables non permanents." }
    ]},
    { id: 'traqueur', nom: 'Voie du traqueur', caps: [
      { r: 1, n: 'Éclaireur', comp: "discrétion, vigilance et pister en milieu naturel", bon: '2+rang', d: "Ajoute rang + 2 à ces tests. Peut échanger le +1 PC des aventuriers contre +1 DR." },
      { r: 2, n: 'Attaque éclair', a: 'L', d: "Attaque au contact ajoutant l'AGI en attaque et aux DM. Au rang 5, peut être associée à 10 m de déplacement." },
      { r: 3, n: 'Chasseur émérite', t: 'bonus', dmg: '1d4°', d: "+1d4° aux DM contre les animaux (même géants). Par rang 5 atteint dans une voie de rôdeur, choisir un ennemi juré supplémentaire : gobelinoïdes, géants, dragons, morts-vivants, insectes, démons." },
      { r: 4, n: 'Perception héroïque', d: "+1 en PER et dé bonus aux tests de PER." },
      { r: 5, n: 'Repli', a: 'L', d: "En milieu naturel : se déplace de 30 m en s'éloignant. Test d'AGI difficulté 10 (15 en terrain découvert) : disparaît de la vue de ses poursuivants." }
    ]},
    { id: 'deuxarmes', nom: 'Voie du combat à deux armes', caps: [
      { r: 1, n: 'Attaque à suivre', a: 'G', f: 'round', d: "1×/round, après une attaque ratée de la main principale : attaque gratuite de l'autre main avec dague, hachette ou épée courte (dé malus avec une autre arme à une main)." },
      { r: 2, n: 'Parade croisée', d: "+1 en DEF avec une arme dans chaque main (+2 au rang 5). En renonçant à toute attaque de la main secondaire, ce bonus est doublé jusqu'à son prochain tour." },
      { r: 3, n: 'Droite - gauche', a: 'G', f: 'round', d: "1×/round, en attaquant de la main principale : attaque gratuite de la main secondaire (dé malus si cible différente). Remplace Attaque à suivre." },
      { r: 4, n: 'Combattant héroïque', d: "+1 en AGI et dé bonus aux tests d'AGI. Alternative : +1 en FOR (sans dé bonus) et plus de dé malus avec la même arme dans la main secondaire." },
      { r: 5, n: 'Double peine', t: 'bonus', dmg: '1d4°', d: "Si les deux armes touchent la même cible dans le même tour : +1d4° DM sur l'une des deux attaques." }
    ]}
  ]
};

COF.PROFILS.voleur = {
  id: 'voleur', nom: 'Voleur', famille: 'aventurier', pv: 4,
  caracs: ['AGI', 'INT', 'CHA'],
  resume: "Un filou agile et sournois taillé pour l'infiltration ou la criminalité.",
  armes: "Les armes de contact à une main et toutes les armes à distance.",
  armureMax: 'cuir', bouclier: false,
  armuresTexte: "Jusqu'au cuir simple. Bouclier interdit.",
  equipDepart: [
    { nom: 'Rapière', type: 'contact', ref: 'rapiere' },
    { nom: '5 dagues', type: 'contact', ref: 'dague' },
    { nom: 'Outils de crochetage', type: 'objet' },
    { nom: 'Armure de cuir', type: 'armure', ref: 'cuir' },
    { nom: 'Corde de 10 m', type: 'objet' }
  ],
  voies: [
    { id: 'assassin', nom: "Voie de l'assassin", caps: [
      { r: 1, n: 'Discrétion', comp: "discrétion, déguisement, cacher une arme", bon: '2+rang', d: "Ajoute rang + 2 à ces tests. Connaît l'argotien (langage des signes des voleurs). Dé bonus en attaque contre un adversaire surpris." },
      { r: 2, n: 'Attaque sournoise', a: 'L', f: 'round', t: 'bonus', dmg: '2d4°', d: "1×/round contre un adversaire surpris ou attaqué de dos, avec une arme légère : +2d4° DM (+1d4° par rang 4 atteint dans une voie de voleur, max 7d4°). Bonus divisé par 2 avec une autre arme." },
      { r: 3, n: 'Attaque par surprise', a: 'A', t: 'bonus', dmg: '2d4°', d: "Contre un adversaire surpris : attaque sournoise en action d'attaque au lieu d'une action limitée, et +2d4° DM supplémentaires." },
      { r: 4, n: 'Disparition', a: 'M', f: 'combat', d: "1×/combat : disparaît (inattaquable, sauf DM de zone) et réapparaît au début de son prochain tour à 20 m maximum. S'il a l'initiative, il peut faire une attaque sournoise." },
      { r: 5, n: 'Ouverture mortelle', a: 'L', f: 'combat', d: "1×/combat : réussite critique automatique (DM ×2) plus une attaque sournoise (dont les DM ne sont pas doublés)." }
    ]},
    { id: 'aventurier', nom: "Voie de l'aventurier", caps: [
      { r: 1, n: 'Baratin', comp: "baratiner, séduire, négocier, mentir, marché noir", bon: '2+rang', d: "Ajoute rang + 2 à ces tests. Peut utiliser parchemins et baguettes magiques : test d'attaque magique (L) difficulté [10 + 2 × rang du sort], nouvelle tentative possible en cas d'échec." },
      { r: 2, n: 'Provocation', a: 'L', t: 'bonus', dmg: '1d4°', d: "Test opposé de CHA contre INT (10 m) : la cible humanoïde doit l'attaquer à son prochain tour. S'il est au contact, riposte gratuite avec au choix attaque sournoise ou +1d4° DM." },
      { r: 3, n: 'Souplesse du félin', d: "+2 en DEF et en Initiative (+3 au rang 5). Se relever ne coûte qu'une action de mouvement." },
      { r: 4, n: 'Charisme héroïque', d: "+1 en CHA et dé bonus aux tests de CHA." },
      { r: 5, n: 'Attaque paralysante', a: 'L', f: 'combat', t: 'bonus', dmg: '1d4°', d: "1×/combat, sur une attaque de contact réussie : aucun DM, mais la cible humanoïde est immobilisée 1d4 rounds (paralysée si NC < ½ niveau). De plus +1d4° DM (ou attaque sournoise) contre toute cible immobilisée ou paralysée." }
    ]},
    { id: 'deplacement', nom: 'Voie du déplacement', caps: [
      { r: 1, n: 'Agile', comp: "esquive, saut, course, équilibre, escalade, se dégager", bon: '2+rang', d: "Ajoute rang + 2 à ces tests. +1 en DEF et en Initiative (+2 au rang 3, +3 au rang 5)." },
      { r: 2, n: 'Réflexes félins', f: 'combat', d: "Divise par 2 les DM de chute. 1×/combat : action de mouvement supplémentaire (2×/combat au rang 5, jamais plus d'une par round)." },
      { r: 3, n: 'Acrobaties', a: 'G', f: 'round', t: 'bonus', dmg: '1d4°', d: "1×/round, test d'AGI difficulté 15 : franchit un obstacle (ou un adversaire) ou attaque de dos un adversaire au contact — au choix attaque sournoise ou +1d4° DM." },
      { r: 4, n: 'Agilité héroïque', d: "+1 en AGI et dé bonus aux tests d'AGI." },
      { r: 5, n: 'Esquive de la magie', a: 'G', f: 'round', d: "1×/round, contre un sort infligeant des DM physiques : test d'attaque à distance opposé à l'attaque magique du lanceur. Réussite = aucun effet." }
    ]},
    { id: 'roublard', nom: 'Voie du roublard', caps: [
      { r: 1, n: 'Doigts agiles', comp: "crocheter, désamorcer, pickpocket, évaluer un objet précieux", bon: '2+rang', d: "Ajoute rang + 2 à ces tests. +1 aux DM des dagues et couteaux lancés (+2 au rang 3, +3 au rang 5)." },
      { r: 2, n: 'Aux aguets', comp: "fouiller, détecter pièges, passages secrets et embuscades", bon: '2+rang', d: "Ajoute rang + 2 à ces tests. Divise par 2 les DM infligés par les pièges." },
      { r: 3, n: 'Feindre la mort', a: 'G', f: 'combat', t: 'soin', dmg: '1d4°', d: "1×/combat : passe pour mort (test d'INT difficulté 20 pour le démasquer). En se relevant (action gratuite) : récupère 1d4° PV et surprend l'adversaire au contact." },
      { r: 4, n: 'Expert en criminalité', d: "Dé bonus aux tests de recherche d'indice (PER, INT, CHA) et pour brouiller les pistes ou fabriquer de faux documents. En dépensant 1 PC, le MJ doit lui livrer un indice qui lui avait échappé." },
      { r: 5, n: 'Maître du poison', f: 'jour', t: 'bonus', dmg: '2d4°', d: "3 doses de poison par jour sans risque. Une dose enduite sur une arme : +2d4° DM et test de CON difficulté [10 + INT] ou cible affaiblie pour le combat. Ou versée dans un repas : inconscience 2d6 min en cas d'échec." }
    ]},
    { id: 'spadassin', nom: 'Voie du spadassin', caps: [
      { r: 1, n: 'Attaque en finesse', comp: 'intimidation', bon: '2+rang', d: "Ajoute son AGI à l'Initiative et peut remplacer la FOR par l'AGI pour ses tests d'attaque au contact (pas aux DM) avec une arme légère à une main." },
      { r: 2, n: 'Esquive fatale', a: 'G', f: 'combat', d: "1×/combat : esquive une attaque et la redirige vers un autre adversaire à son contact (comparez le test d'attaque à sa DEF). Impossible contre un critique ou avec un seul adversaire au contact." },
      { r: 3, n: 'Frappe chirurgicale', d: "+2 à la zone de critique avec une arme légère (18-20 au lieu de 20). La valeur minimale d'un critique reste 16." },
      { r: 4, n: 'Ambidextrie', a: 'G', f: 'round', d: "Chaque round : attaque de contact gratuite de la main gauche avec une dague ou une épée courte. Ne peut pas être une attaque sournoise." },
      { r: 5, n: 'Botte secrète', d: "Sur un critique au contact à l'arme légère (main principale) : inflige un état au choix (affaibli, aveuglé, étourdi, immobilisé, ralenti) 1 round — chacun une fois par combat. Ou : transforme l'attaque en attaque sournoise dont les DM s'ajoutent au critique." }
    ]}
  ]
};
