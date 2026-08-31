/* ============================================================
   COF2 Compagnon — Profils : famille des COMBATTANTS
   5 PV/niveau · DR d10
   ============================================================ */
window.COF = window.COF || {};
COF.PROFILS = COF.PROFILS || {};

COF.PROFILS.barbare = {
  id: 'barbare', nom: 'Barbare', famille: 'combattant', pv: 5,
  caracs: ['FOR', 'CON', 'AGI'],
  resume: "Un guerrier sauvage issu d'une culture primitive, capable d'entrer en rage.",
  armes: "Toutes les armes au contact, toutes les armes à distance (sauf arbalètes et technologies complexes).",
  armureMax: 'cuirren', bouclier: true,
  armuresTexte: "Jusqu'au cuir renforcé (chemise de mailles avec Tour de force, cotte avec Briseur d'os). Tous les boucliers.",
  equipDepart: [
    { nom: 'Hache à deux mains', type: 'contact', ref: 'hache2m' },
    { nom: '2 javelots', type: 'distance', ref: 'javelot' },
    { nom: 'Dague', type: 'contact', ref: 'dague' },
    { nom: 'Armure de cuir', type: 'armure', ref: 'cuir' }
  ],
  voies: [
    { id: 'brute', nom: 'Voie de la brute', caps: [
      { r: 1, n: 'Argument de taille', d: "Ajoute sa FOR à son maximum de PV, ainsi qu'à ses tests de CHA et à ceux de ses alliés au contact pour négocier, persuader ou intimider." },
      { r: 2, n: 'Tour de force', a: 'G', dmg: '1d4°', d: "+10 sur un test de FOR (pas un jet de DM ni une attaque) au prix de 1d4° PV, à décider avant de lancer. Peut désormais porter la chemise de mailles avec toutes les capacités de barbare autorisées jusqu'au cuir renforcé." },
      { r: 3, n: 'Attaque brutale', a: 'L', t: 'bonus', dmg: '1d4°', d: "Attaque au contact : +1d4° DM ; ou -3 au test d'attaque pour +2d4° DM. Peut sacrifier 1d4° DM pour repousser de 3 m un adversaire de NC < rang, ou 2d4° pour le renverser." },
      { r: 4, n: 'Force héroïque', d: "+1 en FOR et dé bonus aux tests de FOR." },
      { r: 5, n: "Briseur d'os", d: "+1 à la zone de critique au contact (19-20). Sur un critique, la cible est étourdie 1 round en plus des DM doublés. Peut désormais porter la cotte de mailles avec toutes les capacités de barbare autorisées jusqu'à la chemise de mailles." }
    ]},
    { id: 'pagne', nom: 'Voie du pagne', caps: [
      { r: 1, n: 'Vigueur', comp: 'course, saut, escalade', bon: '2+rang', d: "Ajoute rang + 2 à ces tests. +1 PV par rang atteint dans la voie." },
      { r: 2, n: 'Peau de pierre', d: "Peut remplacer son AGI par sa CON pour calculer sa DEF (limitation d'armure applicable). Sinon +1 en DEF (+2 au rang 4)." },
      { r: 3, n: 'Tatouages', d: "Un tatouage magique au choix : +3 aux tests de FOR (taureau), CON (ours), AGI (panthère), PER (chouette), CHA (loup), INT (renard) ou VOL (serpent). Bonus de magie, non cumulable avec un objet magique. L'état étourdi devient ralenti." },
      { r: 4, n: 'Constitution héroïque', d: "+1 en CON et dé bonus aux tests de CON." },
      { r: 5, n: "Peau d'acier", d: "Réduit tous les DM subis de 3 (RD 3). Minimum 1 DM par attaque." }
    ]},
    { id: 'pourfendeur', nom: 'Voie du pourfendeur', caps: [
      { r: 1, n: 'Réflexes éclair', comp: "tests d'AGI pour esquiver (souffles, pièges, explosions)", bon: '2+rang', d: "Ajoute rang + 2 à ces tests. +3 en Initiative et +1 en DEF (+2 au rang 5)." },
      { r: 2, n: 'Charge', a: 'L', t: 'bonus', dmg: '1d4°', d: "Déplacement de 5 à 10 m en ligne droite puis attaque au contact avec dé bonus et +1d4° DM. Impossible s'il est déjà au contact." },
      { r: 3, n: 'Enchaînement', d: "Chaque fois qu'il réduit un adversaire à 0 PV au contact : action d'attaque gratuite contre un autre adversaire au contact. Non cumulable avec Déchaînement d'acier ou Attaque tourbillon." },
      { r: 4, n: "Déchaînement d'acier", a: 'L', d: "Parcourt 10 m en ligne droite en traversant autant d'ennemis qu'il le souhaite, avec une attaque à -2 contre chacun. Ne peut pas finir son déplacement sur un ennemi." },
      { r: 5, n: 'Attaque tourbillon', a: 'L', f: 'combat', d: "1×/combat : inflige automatiquement les DM de son arme (bonus inclus) à toutes les cibles dans un rayon de 5 m." }
    ]},
    { id: 'primitif', nom: 'Voie du primitif', caps: [
      { r: 1, n: 'Proche de la nature', comp: 'survie (récupération incluse) et discrétion en milieu naturel', bon: '2+rang', d: "Ajoute rang + 2 à ces tests. +1 PV." },
      { r: 2, n: 'Armure de vent', d: "Sans armure : +2 en DEF (+3 au rang 5) et peut se relever par une action de mouvement. Avec armure : +1 en DEF seulement." },
      { r: 3, n: 'Vigilance', comp: 'détecter pièges mécaniques ou magiques et embuscades', bon: '2+rang', d: "Ajoute rang + 2 à ces tests. Immunisé aux attaques sournoises des créatures de niveau inférieur." },
      { r: 4, n: 'Résistance à la magie', a: 'G', f: 'round', d: "1×/round, quand il est ciblé par un sort : test opposé d'attaque magique. Réussite = aucun effet. (Dé malus s'il est lui-même lanceur de sorts.)" },
      { r: 5, n: 'Vitalité débordante', t: 'soin', dmg: '1d4°', d: "Tant que ses PV sont entre 1 et le tiers de son maximum, il récupère 1d4° PV par heure, jour et nuit." }
    ]},
    { id: 'rage', nom: 'Voie de la rage', caps: [
      { r: 1, n: 'Cri de guerre', a: 'G', f: 'combat', comp: 'tests de VOL contre la peur', bon: '2+rang', d: "1×/combat : les adversaires dans 10 m dont la FOR est inférieure subissent un dé malus en attaque au contact à leur prochain tour. Le barbare est sans peur." },
      { r: 2, n: 'Défier la mort', f: 'combat', d: "1×/combat, quand une attaque devrait le mettre à 0 PV : test de CON difficulté 10 pour conserver 1 PV (réussite automatique s'il est enragé)." },
      { r: 3, n: 'Rage du berserk', a: 'L', f: 'jour', t: 'bonus', dmg: '1d4°', d: "1×/jour (+1 par rang 4 atteint dans une voie de barbare) : +1d4° DM au contact, -2 en DEF, pas de fuite ni d'attaque à distance, dé bonus aux tests de VOL. Fin anticipée : test de VOL difficulté 15. Aucun sort ni capacité de concentration pendant la rage." },
      { r: 4, n: 'Même pas mal', f: 'combat', d: "1×/combat : ignore complètement les DM d'un coup critique et peut entrer en Rage immédiatement (action gratuite)." },
      { r: 5, n: 'Furie du berserk', a: 'L', t: 'bonus', dmg: '2d4°', d: "Consomme 2 utilisations de rage : +2d4° DM au lieu de 1d4°, -4 en DEF. Difficulté 20 pour y mettre fin prématurément." }
    ]}
  ]
};

COF.PROFILS.chevalier = {
  id: 'chevalier', nom: 'Chevalier', famille: 'combattant', pv: 5,
  caracs: ['FOR', 'CHA', 'CON'],
  resume: "Un héros en armure rutilante qui chevauche une monture magique.",
  armes: "Toutes les armes de contact ; dédaigne les armes à distance.",
  armureMax: 'plaques', bouclier: true,
  armuresTexte: "Jusqu'à l'armure de plaques (plaque complète avec Autorité naturelle). Tous les boucliers.",
  equipDepart: [
    { nom: 'Épée longue', type: 'contact', ref: 'epeelongue' },
    { nom: 'Grand bouclier', type: 'bouclier', ref: 'grand' },
    { nom: 'Lance de cavalerie', type: 'contact', ref: 'lancecav' },
    { nom: 'Dague', type: 'contact', ref: 'dague' },
    { nom: 'Cotte de mailles', type: 'armure', ref: 'cotte' }
  ],
  voies: [
    { id: 'cavalier', nom: 'Voie du cavalier', caps: [
      { r: 1, n: 'Fidèle monture', comp: 'équitation et dressage', bon: '2+rang', dmg: '1d4°+5', d: "Cheval de guerre dressé : DEF [12 + rang], PV [10 + niveau × 4], Init. du chevalier, Ruade +5 (1d4°+5). À cheval : +10 m de déplacement avant ou après une action. Récupère 1d8+4 PV par nuit." },
      { r: 2, n: 'Cavalier émérite', d: "En selle : +1 aux DM au contact (+2 au rang 5) et la monture prend la DEF du chevalier. Monter/descendre devient une action gratuite." },
      { r: 3, n: 'Charge', a: 'L', t: 'bonus', dmg: '1d4°', d: "À cheval : 10 à 20 m en ligne droite puis attaque au contact avec dé bonus et +1d4° DM. Une créature qui s'interpose doit réussir un test de FOR difficulté 20 ou céder le passage en subissant 1d4° DM." },
      { r: 4, n: 'Monture magique', a: 'L', d: "La monture peut apparaître et disparaître depuis un autre plan à volonté (invocation en action limitée). Une heure dans son plan d'origine la soigne entièrement." },
      { r: 5, n: 'Monture fantastique', dmg: '2d4°+5', d: "Monture puissante : DEF 20, PV [10 + niveau × 6], attaque = attaque magique, DM 2d4°+5. En selle, la monture attaque 1×/round en action gratuite. Monture volante possible au niveau 9 (20 m/mouvement, PV [10 + niveau × 5])." }
    ]},
    { id: 'guerre', nom: 'Voie de la guerre', caps: [
      { r: 1, n: 'Armure sur mesure', d: "N'ajoute que la moitié de la DEF de son armure à la difficulté des tests pénalisés par celle-ci. En armure lourde : +1 en DEF par rang 5 atteint dans une voie de chevalier." },
      { r: 2, n: 'Encaisser un coup', a: 'M', d: "Jusqu'à son prochain tour, retranche la DEF de son armure (bonus magique inclus) aux DM d'une attaque au contact (min 1 DM). Bouclier inclus au rang 5. Ne peut être ni étourdi ni renversé par cette attaque." },
      { r: 3, n: 'Frappe du justicier', a: 'L', d: "Attaque au contact : même en cas d'échec, inflige la moitié des DM (aucun DM sur un 1 naturel)." },
      { r: 4, n: 'Force héroïque', d: "+1 en FOR et dé bonus aux tests de FOR." },
      { r: 5, n: 'Mon armure est une arme', a: 'G', f: 'combat', dmg: '1d4°+FOR', d: "1×/combat : coup d'armure automatique infligeant [1d4° + FOR] DM. Si la FOR de la cible est inférieure : renversée, étourdie 1 round ou repoussée de 3 m." }
    ]},
    { id: 'preux', nom: 'Voie du preux', caps: [
      { r: 1, n: 'Ignorer la douleur', a: 'G', f: 'combat', comp: 'haranguer et convaincre les foules', bon: '2+rang', d: "1×/combat : note à part les DM d'une attaque (pas un critique) et ne les subit qu'à la fin du combat." },
      { r: 2, n: "Piqûres d'insectes", d: "Réduction des DM des attaques à distance selon l'armure : plaques RD 3, mailles RD 2, cuir RD 1. Minimum 1 DM." },
      { r: 3, n: 'Laissez-le-moi', t: 'bonus', dmg: '1d4°', d: "Contre un leader ennemi identifiable dans un groupe de 4 créatures ou plus : +1d4° DM au contact. La cible doit réussir un test d'INT difficulté 15 ou ne pourra attaquer que lui au prochain tour." },
      { r: 4, n: 'Charisme héroïque', d: "+1 en CHA et dé bonus aux tests de CHA." },
      { r: 5, n: 'Seul contre tous', d: "Quand au moins 3 adversaires l'attaquent au contact dans le round : une action d'attaque supplémentaire ce round." }
    ]},
    { id: 'meneur', nom: "Voie du meneur d'hommes", caps: [
      { r: 1, n: 'Sans peur', comp: 'stratégie, tactique militaire, commander une troupe', bon: '2+rang', d: "Immunisé à la peur ; ses alliés ajoutent son CHA à leurs tests contre la peur." },
      { r: 2, n: 'Intercepter', a: 'G', f: 'round', d: "1×/round : encaisse à la place d'un allié au contact une attaque au contact ou à distance. Utilise sa propre DEF et retranche son rang aux DM. À annoncer avant le résultat." },
      { r: 3, n: 'Exemplaire', a: 'G', f: 'round', d: "1×/round : donne un dé bonus à un allié qui attaque un adversaire à son contact (avant le jet)." },
      { r: 4, n: 'Charge fantastique', a: 'G', f: 'combat', t: 'bonus', dmg: '1d4°', d: "1×/combat : tous ses alliés en vue et lui gagnent 10 m de déplacement supplémentaire, un dé bonus et +1d4° DM à toutes leurs attaques. Non cumulable avec Exemplaire ou Ordre de bataille." },
      { r: 5, n: 'Ordre de bataille', a: 'G', f: 'round', d: "1×/round : offre une action gratuite supplémentaire (mouvement ou attaque, pas limitée) à un allié en vue. Chaque allié n'en profite qu'une fois par combat." }
    ]},
    { id: 'noblesse', nom: 'Voie de la noblesse', caps: [
      { r: 1, n: 'Éduqué', comp: 'histoire, héraldique, géographie, savoir-vivre en haute société', bon: '2+rang', d: "Sait lire et écrire, apprend une langue supplémentaire." },
      { r: 2, n: 'Écuyer', dmg: '1d4°+1', d: "Un écuyer loyal : DEF [10 + rang], PV [niveau × 4], attaque = attaque magique, DM 1d4°+1. Grâce à lui : +1 à la zone de critique au contact et le chevalier, sa monture et jusqu'à CHA alliés récupèrent 1d4° PV de plus après chaque récupération complète." },
      { r: 3, n: 'Autorité naturelle', comp: 'donner des ordres, intimider', bon: '2+rang', d: "Ajoute rang + 2 à ces tests. Formation au port de l'armure de plaque complète (DEF +7) sans perdre les capacités de chevalier." },
      { r: 4, n: 'Massacrer la piétaille', t: 'bonus', dmg: '1d4°', d: "+1d4° DM contre la piétaille (au moins 4 créatures semblables impliquées dans le combat). Les cavaliers ne sont jamais de la piétaille." },
      { r: 5, n: "Formation d'élite", choix: true, d: "Choisir une capacité de rang 1 à 3 de n'importe quel profil de combattant ou d'aventurier. De plus, choisir une caractéristique : dé bonus à ses tests." }
    ]}
  ]
};

COF.PROFILS.guerrier = {
  id: 'guerrier', nom: 'Guerrier', famille: 'combattant', pv: 5,
  caracs: ['FOR', 'CON', 'AGI'],
  resume: "Un spécialiste du combat au corps à corps, un soldat d'élite.",
  armes: "Toutes les armes de contact et toutes les armes à distance.",
  armureMax: 'cotte', bouclier: true,
  armuresTexte: "Jusqu'à la cotte de mailles (plaques avec Armure lourde). Tous les boucliers.",
  equipDepart: [
    { nom: 'Épée longue', type: 'contact', ref: 'epeelongue' },
    { nom: 'Épée à deux mains', type: 'contact', ref: 'epee2m' },
    { nom: 'Dague', type: 'contact', ref: 'dague' },
    { nom: 'Grand bouclier', type: 'bouclier', ref: 'grand' },
    { nom: 'Chemise de mailles', type: 'armure', ref: 'chemise' }
  ],
  voies: [
    { id: 'bouclier', nom: 'Voie du bouclier', caps: [
      { r: 1, n: 'Protéger un allié', a: 'G', f: 'round', comp: 'éviter la surprise', bon: '2+rang', d: "S'il n'est pas surpris : +2 en DEF à un allié au contact contre une attaque par round (à annoncer avant le résultat)." },
      { r: 2, n: 'Parer un coup', a: 'M', f: 'round', d: "Posture défensive : test d'attaque au contact (FOR ou AGI) opposé à l'attaque adverse réussie. Victoire = aucun DM (moitié contre une créature énorme ou colossale). Action gratuite au rang 5, mais avec dé malus." },
      { r: 3, n: 'Défense au bouclier', d: "+1 en DEF avec un bouclier (+2 au rang 5). Retranche son rang à tous les DM des attaques de zone et des souffles (sauf s'il est surpris)." },
      { r: 4, n: 'Absorber un sort', d: "Après s'être préparé à parer : test d'attaque au contact opposé à l'attaque magique du lanceur. Réussite = le sort est absorbé par le bouclier (les autres cibles d'un sort de zone sont affectées normalement)." },
      { r: 5, n: 'Renvoi de sort', a: 'G', d: "Un sort absorbé peut être immédiatement retourné contre son lanceur, qui en subit les effets. Sans effet sur les sorts de zone." }
    ]},
    { id: 'combat', nom: 'Voie du combat', caps: [
      { r: 1, n: 'Vivacité', f: 'combat', d: "+3 en Initiative et aux tests d'AGI ou de FOR pour éviter d'être immobilisé ou renversé. 1×/combat : action de mouvement supplémentaire." },
      { r: 2, n: 'Manœuvre', d: "Dé bonus lorsqu'il exécute une manœuvre en combat (désarmer, renverser, agripper…)." },
      { r: 3, n: 'Attaque puissante', t: 'bonus', dmg: '2d4°', d: "Dé malus volontaire sur une attaque au contact : +2d4° DM. En action limitée (L) : +3d4° DM. Cumulable avec Double attaque, Attaque circulaire ou Attaque parfaite." },
      { r: 4, n: 'Double attaque', a: 'L', d: "Deux attaques au contact durant son tour avec -2 à chacune." },
      { r: 5, n: 'Attaque circulaire', a: 'L', d: "Une attaque au contact à -2 contre chaque adversaire engagé à son contact (un test par adversaire)." }
    ]},
    { id: 'maitrearmes', nom: "Voie du maître d'armes", caps: [
      { r: 1, n: 'Armes de prédilection', comp: "estimer la valeur d'une arme ou la réputation martiale d'un adversaire", bon: '2+rang', d: "Choisit une catégorie d'armes (épées, haches, masses, lances, armes de jet) : +1 en attaque avec celles-ci." },
      { r: 2, n: 'Science du critique', d: "+1 à la zone de critique avec une arme de prédilection (19-20 au lieu de 20)." },
      { r: 3, n: 'Spécialisation', d: "+1 aux DM avec une arme de prédilection. Par rang 5 atteint dans une voie de guerrier : nouvelle catégorie de prédilection (rangs 1 à 3 acquis) ou +1 aux DM d'une catégorie connue (max +6)." },
      { r: 4, n: 'Attaque parfaite', a: 'L', t: 'bonus', dmg: '1d4°', d: "Dé bonus en attaque (contact ou arme de jet) et +1d4° DM avec une arme de prédilection. Peut renoncer aux DM pour désarmer une cible de NC < son bonus de DM de spécialisation." },
      { r: 5, n: 'Riposte', a: 'G', f: 'round', d: "Quand un adversaire rate une attaque de contact contre lui : attaque au contact immédiate. Une seule riposte par round." }
    ]},
    { id: 'resistance', nom: 'Voie de la résistance', caps: [
      { r: 1, n: 'Robustesse', comp: 'résister aux efforts physiques, à la chaleur ou au froid', bon: '2+rang', d: "Augmente son maximum de PV de rang + 2." },
      { r: 2, n: 'Résilient', d: "Une récupération rapide ne demande plus que 10 min (5 min au rang 4). Bonus égal au rang pour résister aux états étourdi et affaibli." },
      { r: 3, n: 'Armure lourde', d: "Au choix : +1 en DEF, ou apprend à porter l'armure de plaques (DEF +6) sans perdre ses capacités de guerrier." },
      { r: 4, n: 'Constitution héroïque', d: "+1 en CON et dé bonus aux tests de CON." },
      { r: 5, n: 'Dur à cuire', f: 'combat', d: "+1 en DEF. 1×/combat, en tombant à 0 PV, il peut encore agir un round. Plus de dé malus quand il est immobilisé ; étourdi, il peut encore attaquer avec un dé malus." }
    ]},
    { id: 'soldat', nom: 'Voie du soldat', caps: [
      { r: 1, n: 'Teigneux', a: 'G', f: 'round', comp: "résister à l'alcool, à la faim et au manque de sommeil", bon: '2+rang', d: "1×/round : attaque au contact gratuite contre une créature au contact qui tente de s'éloigner." },
      { r: 2, n: 'Prouesse', a: 'G', f: 'round', dmg: '1d4°', d: "1×/round : sacrifie 1d4° PV pour +5 sur un test de FOR ou de CON, même après avoir vu le résultat." },
      { r: 3, n: 'Piqûre de rappel', a: 'G', f: 'round', d: "1×/round : si un adversaire au contact attaque quelqu'un d'autre, attaque gratuite contre lui. Si son INT est négative et qu'il subit des DM, il le prend pour cible ensuite." },
      { r: 4, n: 'Force héroïque', d: "+1 en FOR et dé bonus aux tests de FOR." },
      { r: 5, n: 'Rempart', d: "Teigneux utilisable contre [AGI + 2] adversaires par round. Une attaque réussie stoppe le déplacement de l'adversaire. +1 en DEF." }
    ]}
  ]
};
