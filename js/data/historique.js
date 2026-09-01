/* ============================================================
   COF2 Compagnon — Atlas d'Osgild : voies d'historique
   Règle optionnelle : en plus de ses voies de profil, un
   personnage peut investir des points de capacité dans une voie
   d'origine géographique et/ou une voie professionnelle. Ces
   voies coûtent toujours 1 point de capacité par rang (quel que
   soit le rang) et n'ont aucun niveau requis pour être acquises
   — simplification assumée : le bonus de PV « voie d'historique »
   et la construction alternative du personnage (un rang 1 gratuit
   par catégorie) ne sont pas automatisés, seul l'accès aux
   capacités et leur coût réduit le sont.
   ============================================================ */
window.COF = window.COF || {};

COF.HISTORIQUE_GEO = [
  { id: 'campagnes', nom: "Voie des campagnes", caps: [
    { r: 1, n: 'Habitant des campagnes', d: "+3 aux tests de prévision météorologique et pour dresser ou calmer des animaux domestiques." },
    { r: 2, n: "C'est pas tout prêt", d: "+5 à tous les tests pour réparer quelque chose et pour travailler dur." },
    { r: 3, n: 'Les outils sont des armes', d: "+1 en attaque avec les armes qui sont aussi des outils (haches, marteau, fléau, bâton, faux, faucille...)." },
    { r: 4, n: "C'est pas tout près", d: "Augmente la distance parcourue lors d'une période de marche de plus de 2 km et divise par deux (arrondi à l'inférieur) la pénalité d'armure." },
    { r: 5, n: 'Adversaire des campagnes', dmg: '1d4°', t: 'bonus', d: "+1d4° DM contre les humanoïdes en armure métallique." }
  ]},
  { id: 'cites', nom: 'Voie des cités', caps: [
    { r: 1, n: 'Habitant des villes', d: "+3 en discrétion en ville et aux tests de commerce." },
    { r: 2, n: 'Survie en coupe-gorge', d: "+3 en PER pour s'orienter et éviter les embuscades en ville, +3 en CHA pour parlementer avec des gangs ou des gardes." },
    { r: 3, n: 'Fendre la foule', d: "N'est pas ralenti dans un lieu bondé et gagne +2 en DEF et en attaque s'il combat au milieu d'une foule." },
    { r: 4, n: 'Pistage urbain', d: "+5 aux tests de filature (interroger des témoins, CHA difficulté 15 à 30) et de poursuite en milieu urbain." },
    { r: 5, n: 'Expert en rixes', dmg: '1d4°', t: 'bonus', d: "+1d4° DM temporaires contre une créature humanoïde." }
  ]},
  { id: 'deserts', nom: 'Voie des déserts', caps: [
    { r: 1, n: 'Habitant des étendues désertiques', d: "+3 en discrétion et aux tests de survie en désert." },
    { r: 2, n: 'À boire', d: "Test de PER (difficulté 10 à moins d'1 h de marche, 15 à moins d'un jour, 20 au-delà) pour connaître la direction du point d'eau le plus proche." },
    { r: 3, n: 'Soleil de plomb', d: "RD 3 contre tous les DM de feu et de chaleur." },
    { r: 4, n: "Se mettre à l'abri", d: "Trouve toujours un abri contre la chaleur, le froid ou un événement climatique ; n'est jamais pris au dépourvu." },
    { r: 5, n: 'Adversaire des déserts', dmg: '1d4°', t: 'bonus', d: "+1d4° DM contre les arthropodes géants (scorpions, scolopendres, fourmilions...)." }
  ]},
  { id: 'forets', nom: 'Voie des forêts', caps: [
    { r: 1, n: 'Habitant des forêts', d: "+3 en discrétion et aux tests de survie en forêt." },
    { r: 2, n: 'Nature généreuse', d: "Se nourrit tout en se déplaçant normalement en forêt ; un test de PER (Survie) réussi permet de nourrir une personne de plus par tranche de 5 points au-dessus de 10." },
    { r: 3, n: 'Chasseur', dmg: '1d4°', t: 'bonus', d: "+1d4° DM contre les animaux et animaux géants." },
    { r: 4, n: 'Terrain de prédilection', d: "Se déplace sans entrave même dans les zones denses de la forêt et gagne +2 en DEF lorsqu'il y combat." },
    { r: 5, n: 'Passage par les arbres', d: "Se déplace d'arbre en arbre à la moitié de sa vitesse normale, sans test d'AGI pour grimper." }
  ]},
  { id: 'grottes', nom: 'Voie des grottes', caps: [
    { r: 1, n: 'Habitant des souterrains', d: "+3 en discrétion et aux tests de survie sous terre." },
    { r: 2, n: "Sens de l'orientation", d: "Ne se perd jamais sous terre, voit dans la pénombre comme en plein jour et double la portée de sa vision dans le noir si elle en possède une." },
    { r: 3, n: 'Combat confiné', d: "+2 en attaque lorsqu'il combat sous terre ou dans un endroit étroit ou exigu." },
    { r: 4, n: 'Combat en aveugle', dmg: '1d6+AGI', d: "Pas de malus au contact contre un ennemi qu'il ne voit pas. Expert de la torche enflammée : inflige [1d6 + AGI] DM avec elle et aveugle ses ennemis dans le noir (-1 en attaque au contact, doublé pour les animaux)." },
    { r: 5, n: 'Adversaire des souterrains', dmg: '1d4°', t: 'bonus', d: "+1d4° DM contre les elfes des profondeurs, les orcs ou les gobelinoïdes." }
  ]},
  { id: 'marais', nom: 'Voie des marais', caps: [
    { r: 1, n: 'Habitant des marais', d: "+3 en discrétion et aux tests de survie en marécages." },
    { r: 2, n: 'Résistance aux miasmes', d: "+3 pour résister aux maladies et aux poisons." },
    { r: 3, n: 'Vision améliorée', d: "Réduit les pénalités de vision dans le brouillard (léger : aucune ; dense : traité comme léger) et échappe automatiquement aux sables mouvants." },
    { r: 4, n: 'Résistance aux toxines', d: "RD 3 contre les DM de poison et d'acide." },
    { r: 5, n: 'Adversaire des marécages', dmg: '1d4°', t: 'bonus', d: "+1d4° DM contre les reptiles et les amphibiens." }
  ]},
  { id: 'montagnes', nom: 'Voie des montagnes', caps: [
    { r: 1, n: 'Habitant des montagnes', d: "+3 en discrétion et aux tests de survie en montagne." },
    { r: 2, n: 'Grimpeur', d: "+3 à tous les tests d'escalade et divise par deux tous les DM de chute." },
    { r: 3, n: 'Résistance au froid', d: "RD 3 contre les DM de froid." },
    { r: 4, n: 'Terrain de prédilection', d: "+2 en attaque et en DEF lorsqu'il combat sur une forte déclivité (fonctionne aussi dans un escalier)." },
    { r: 5, n: 'Danger des montagnes', dmg: '1d4°', t: 'bonus', d: "+2 en DEF contre les attaques des géants et +1d4° DM à ses attaques contre eux." }
  ]},
  { id: 'plaines', nom: 'Voie des plaines', caps: [
    { r: 1, n: 'Habitant des plaines', d: "+3 aux tests d'équitation et de survie en plaines." },
    { r: 2, n: 'Cavalier', d: "+1 en attaque lorsqu'il est monté ; monter et descendre de selle devient une action gratuite." },
    { r: 3, n: 'Œil de faucon', d: "+5 aux tests d'observation et de détection de détails lointains (100 m et plus), +10 m à la portée de ses attaques à distance." },
    { r: 4, n: 'Engagement', d: "Au premier round de combat, peut réaliser une attaque à distance gratuite s'il utilise son tour pour se rapprocher et/ou porter une attaque au contact." },
    { r: 5, n: 'Adversaire des plaines', dmg: '1d4°', t: 'bonus', d: "+1d4° DM contre les créatures volantes." }
  ]},
  { id: 'rivages', nom: 'Voie des rivages', caps: [
    { r: 1, n: 'Habitant des rivages', d: "+3 aux tests de natation et de navigation." },
    { r: 2, n: 'Nature généreuse', d: "Se nourrit tout en se déplaçant normalement en bordure de rivière ou en mer ; un test de PER (Survie) réussi nourrit une personne de plus par tranche de 5 points au-dessus de 10." },
    { r: 3, n: 'Comme un poisson dans l’eau', d: "Ne subit plus de pénalité pour combattre dans l'eau (reste pénalisé par le type d'arme utilisée)." },
    { r: 4, n: "Sens de l'eau", d: "En mer, connaît toujours la direction de la terre la plus proche ; sur terre, celle de l'étendue d'eau la plus proche." },
    { r: 5, n: "Adversaire des étendues d'eau", dmg: '1d4°', t: 'bonus', d: "+1d4° DM contre les créatures aquatiques." }
  ]}
];

COF.HISTORIQUE_PRO = [
  { id: 'courtisan', nom: 'Voie du courtisan', caps: [
    { r: 1, n: 'Charmant', comp: 'CHA — séduire, baratiner, mentir', bon: '2+rang', d: "Bonus égal à rang + 2 pour tous ces tests." },
    { r: 2, n: 'Secrets et commérages', comp: 'trouver des informations secrètes ou sensibles, perception auditive', bon: '2+rang', d: "Bonus égal à rang + 2. Une fois par aventure, s'invite à une réunion, une fête ou une cérémonie non conviée." },
    { r: 3, n: 'Le diable est dans les détails', comp: 'perception visuelle, percer un mensonge ou le langage corporel', bon: '2+rang', d: "Bonus égal à rang + 2. Se rappelle toujours précisément ce qu'on lui a dit." },
    { r: 4, n: 'J’ai un ami…', d: "Une fois par jour (test de CHA difficulté 10), obtient une entrevue avec une personne d'importance moyenne ; difficulté 15 pour les plus grands représentants de ses milieux." },
    { r: 5, n: 'Plus d’une corde à son arc', choixVoie: { rangMax: 3, familles: ['aventurier'] }, d: "Choisit une capacité de rang 1 à 3 de son choix dans n'importe quel profil de la famille des aventuriers." }
  ]},
  { id: 'erudit', nom: "Voie de l'érudit", caps: [
    { r: 1, n: 'Érudition', comp: 'un domaine choisi (histoire/géographie, occultisme/magie, sciences/techniques, plantes/créatures)', bon: '2+rang', d: "Une langue supplémentaire par rang atteint dans la voie ; bonus égal à rang + 2 dans le domaine choisi." },
    { r: 2, n: 'Argumenter', comp: 'CHA — convaincre', bon: '2+rang', d: "Bonus égal à rang + 2 aux tests de CHA visant à convaincre." },
    { r: 3, n: 'Domaine secondaire', d: "Choisit un nouveau domaine d'érudition : bonus de +3 (équivalent d'un bonus de voie de peuple)." },
    { r: 4, n: 'Novice', dmg: '1d4°', d: "Un novice à son service (Init. 10, DEF 11, PV [10 + niveau], attaque +1, DM 1d4°) divise par deux les durées de recherche documentaire et prodigue les premiers soins jusqu'à 3×/jour (1d4° PV ou 1 PM au choix de l'érudit)." },
    { r: 5, n: 'Sommité', d: "+1 en INT." }
  ]},
  { id: 'expert', nom: "Voie de l'expert", caps: [
    { r: 1, n: 'Professionnel', comp: 'son métier (artisan, marchand, artiste...)', bon: '2+rang', d: "Bonus égal à rang + 2. En travaillant une journée, gagne un salaire égal au rang atteint multiplié par son niveau, en pa." },
    { r: 2, n: 'Expertise', d: "Dé bonus pour tous les tests en rapport avec son métier ; deux fois moins de temps qu'un professionnel ordinaire pour un même résultat." },
    { r: 3, n: 'Talent spécial', d: "Le joueur et le MJ conviennent d'une capacité spéciale liée à la profession de l'expert (ex. le boulanger fabrique un pain de voyage par rang et par aventure qui rend 1 DR ; le forgeron affûte une arme par récupération rapide, +1 en plage de critique jusqu'à la fin du prochain combat)." },
    { r: 4, n: 'Maître en son domaine', d: "Test de CHA difficulté 10 pour obtenir une entrevue avec n'importe quel personnage puissant ; difficulté 15 pour un service notable (recommandation, renseignement, escorte...)." },
    { r: 5, n: "Caractéristique d'expert", choixCarac: { liste: ['FOR', 'AGI', 'INT', 'CHA'], val: 1 }, d: "En accord avec le MJ, choisit une caractéristique de métier (FOR, AGI, INT ou CHA) et l'augmente de +1." }
  ]},
  { id: 'hommedupeuple', nom: 'Voie de l’homme du peuple', caps: [
    { r: 1, n: 'La vie est dure', d: "+3 pour tous les tests de résistance physique et d'endurance. Au rang 4, +1 DR supplémentaire." },
    { r: 2, n: "J’ai un ami qui m’a dit…", comp: "INT — se souvenir d'une rumeur ou de détails sur une personnalité", bon: '2+rang', d: "Bonus égal à rang + 2." },
    { r: 3, n: "On m’la fait pas à moi !", d: "+5 à tous les tests pour résister à une illusion, au baratin, à une négociation ou à toute tentative d'influencer son esprit, magique ou non." },
    { r: 4, n: 'Ni vu ni connu', d: "Test de CHA difficulté 10 pour disparaître dans la foule et devenir introuvable, sauf capacité particulière." },
    { r: 5, n: 'Résistance naturelle', d: "+1 en CON." }
  ]},
  { id: 'hommedarmes', nom: "Voie de l'homme d'armes", caps: [
    { r: 1, n: 'Formation martiale', choix: true, d: "Au choix : maîtrise de toutes les armes quel que soit le profil, ou +3 aux tests pour ne pas être désarmé." },
    { r: 2, n: 'Seconde peau', d: "Réduit de 1 point la pénalité d'une armure de son choix (qui devient son armure de prédilection, avec sa maîtrise)." },
    { r: 3, n: 'Sentinelle infatigable', d: "N'est jamais pénalisé pour un tour de garde nocturne (récupère quand même 1 DR). +3 aux tests de vigilance ou pour résister à la fatigue en étant de garde." },
    { r: 4, n: 'Du rab à la cantoche', d: "S'il mange une double ration avant une récupération rapide, obtient le résultat maximal au dé de récupération dépensé." },
    { r: 5, n: "Évaluer l'adversité", a: 'A', d: "Test opposé d'attaque au contact contre une créature en vue : en cas de réussite, le MJ révèle sa DEF et son attaque, et il obtient un dé bonus au prochain test d'attaque contre elle." }
  ]},
  { id: 'misereux', nom: 'Voie du miséreux', caps: [
    { r: 1, n: 'Moins que rien', d: "Dé malus aux interactions sociales avec la bonne société, mais +3 pour résister aux privations et pour passer inaperçu. En ville, récupère automatiquement 1 DR par nuit même sans confort." },
    { r: 2, n: 'Roi de la débrouille', d: "+3 en Initiative et à tous les tests de métiers physiques." },
    { r: 3, n: 'Solidarité des démunis', d: "Un autre miséreux en difficulté aide toujours (1d6 : 1-3 aide totale et inconditionnelle) — le MJ lance un second d6 en secret, sur un 6 le PNJ tente en réalité un mauvais coup." },
    { r: 4, n: 'Corvéable à merci', d: "+3 PV et +3 à tous les tests de CON et de FOR." },
    { r: 5, n: "L'énergie du désespoir", d: "Sous la moitié de ses PV max, dé bonus à ses tests de FOR, AGI ou CON. À 0 PV, reste conscient et garde une action de mouvement par tour tant qu'il ne subit pas de nouveaux DM." }
  ]},
  { id: 'nanti', nom: 'Voie du nanti', caps: [
    { r: 1, n: 'Plein aux as', d: "Dispose chaque jour de [10 pa × rang atteint] pour ses dépenses courantes, non comptabilisés dans ses économies s'ils ne sont pas dépensés." },
    { r: 2, n: 'On ne prête qu’aux riches', d: "Obtient un crédit automatique d'un mois pour un achat de valeur ; prolongeable par un test de CHA difficulté 15 par mois supplémentaire." },
    { r: 3, n: 'Pot-de-vin', d: "Transforme un échec à un test de CHA en réussite en payant 10 pa par point manquant (maximum 100 pa)." },
    { r: 4, n: 'Garde du corps', dmg: '1d4°+2', d: "Un garde du corps loyal (DEF 16, PV [niveau × 4], Init. du personnage, attaque [niveau], DM 1d4°+2) offre +2 en DEF à son employeur au contact ; remplaçable pour 500 pa au niveau suivant s'il meurt." },
    { r: 5, n: 'Au-dessus des lois', d: "Test de CHA pour échapper à la justice après un acte illégal (difficulté 10 délit, 15 crime, 20 acte odieux, +5 si la victime est puissante, +10 par récidive dans la semaine)." }
  ]},
  { id: 'nomade', nom: 'Voie du nomade', caps: [
    { r: 1, n: "Sens de l'orientation", d: "+3 pour s'orienter et pour prédire la météo des prochaines 24 h." },
    { r: 2, n: 'Voyageur', d: "+3 aux tests de récupération en dormant à la belle étoile et aux tests de PER (Survie) liés au voyage." },
    { r: 3, n: 'Chasseur-cueilleur', d: "Se nourrit en progressant à un rythme normal ; un test de PER (Survie) réussi permet de nourrir une personne de plus." },
    { r: 4, n: 'Je suis déjà venu', d: "En dépensant 1 DR ou 1 PC en arrivant dans une localité, obtient un contact de confiance et réduit d'un niveau la rareté des objets recherchés, pour l'aventure en cours." },
    { r: 5, n: 'Attentif', d: "+1 en PER." }
  ]}
];
