/* ============================================================
   COF2 Compagnon — Bestiaire supplementaire (1/3)
   Créatures extraites du supplément « Bestiaire » (Black Book
   Éditions, 2025), en complément du bestiaire du livre de base.
   Catégorie et environnements déduits automatiquement du texte :
   à corriger au cas par cas si besoin.
   ============================================================ */
window.COF = window.COF || {};
COF.BESTIAIRE = COF.BESTIAIRE || [];

COF.BESTIAIRE.push(
{
  id: "aberratus", nom: "Aberratus", cat: "fantastique", nc: 7, ncLabel: "7",
  type: "Créature fantastique", taille: "Énorme", env: ["montagne", "marais", "souterrain", "urbain"],
  desc: "L’aberratus (ou aberration des abysses aquatiques) est une énorme créature amphibie capable de respirer aussi bien sous l’eau que sur terre. Il ressemble à un énorme poisson des abysses, aux écailles translucides et gluantes.",
  car: { AGI: [3, 1], CON: [8], FOR: [8], PER: [4], CHA: [3], INT: [4], VOL: [6] },
  def: 20, pv: 70, init: 16,
  att: [{ n: "Morsure", mod: 11, dmg: "2d8+8 Attaque magique +13", note: "2 attaques" }],
  caps: [{ n: "Asservissement", a: "A", d: "3 fois par jour, l’aberratus peut tenter d’asser- vir un être vivant distant de 10 m ou moins. La cible doit réussir un test de VOL diffi- culté 15 ou être asservie. La durée de l’effet dépend du NC de la créature ciblée. • NC 1 et inférieur : permanent • NC 2 : 24 heures • NC 3 : 2d4 heures • NC 4 : 2d4 minutes • NC 5-6 : 2d4 rounds • NC 7+ : 1d4 rounds La créature peut être délivrée par un sort de Délivrance (prêtre). Tant qu’elle est asservie, elle obéit aux ordres de l’aberratus. Celui-ci ne peut pas asservir plus de 3 créatures simultanément." }, { n: "Chair à canon", d: "Une fois par round, le MJ peut décider qu’une attaque qui visait l’aberratus touche à la place un amphibe situé à moins de 3 m, venu s’interposer (ou derrière lequel il s’est mis à couvert). L’aberratus gagne un bonus de +3 en DEF tant que des sous-fifres sont positionnés à moins de 3 m de lui." }, { n: "Gluant", d: "Les armes contondantes glissent sur la peau gluante de l’aberratus. Les DM de ce type sont divisés par deux." }, { n: "Lumière malsaine", d: "La sphère qui prolonge le pédoncule de l’aber- ratus émet une lumière violacée nauséeuse. Toutes les créatures vivantes dans un rayon de 20 m autour de lui doivent réussir un test de VOL difficulté 15 chaque round ou être affai- blies. La difficulté passe à 10 si la victime ferme les yeux, mais dans ce cas, elle est aveuglée." }, { n: "Monstre aquatique", d: "L’AGI élevée de l’aberratus n’est valable que sous l’eau. Sur terre, elle est réduite à -2. L’aberratus perd alors 5 en DEF et autant en Init." }, { n: "Télépathie", d: "L’aberratus peut communiquer par télépathie avec toute créature à portée de vue." }]
},

{
  id: "abnormis", nom: "Abnormis", cat: "fantastique", nc: 9, ncLabel: "9",
  type: "Créature fantastique", taille: "Énorme", env: ["montagne", "souterrain", "urbain"],
  desc: "L’abnormis (ou vouivre fouisseuse) est une sco- lopendre géante gris-bleu, pourvue de pas moins de quinze paires de pattes à l’âge adulte (une par segment de son corps articulé).",
  car: { AGI: [0, 1], CON: [11], FOR: [11], PER: [2, 1], CHA: [-4], INT: [-2], VOL: [0] },
  def: 25, pv: 150, init: 13,
  att: [{ n: "Morsure et pattes", mod: 13, dmg: "2d12+16" }],
  caps: [{ n: "Embuscade", d: "Au premier round de combat, dans un environnement composé de rochers et de falaises avec lesquels l’abnormis se confond parfaitement, la cible doit réussir un test de PER difficulté 15 ou être surprise. S’il attaque avec succès une cible surprise, l’abnormis lui inflige +1d8 DM. Si la cible a une FOR inférieure à la sienne, elle est alors renversée. L’abnormis bénéficie de +5 à tous ses tests de discrétion." }, { n: "Dévorer", d: "Lorsque l’abnormis réussit une attaque avec un résultat de 15-20 au d20, il saisit sa proie entre ses pattes et lui inflige immédiatement une attaque gratuite supplémentaire." }, { n: "Éclair", d: "Une fois tous les 1d4+1 rounds, l’abnormis peut produire un éclair de 10 m de long grâce au cristal enchâssé dans son front. Toutes les créatures sur la trajectoire subissent 6d6+15 DM d’électricité, ou la moitié en cas de réussite à un test d’AGI diffi- culté 15. De plus, celles qui ratent le test sont étourdies pendant 1 round. Immunité à l’électricité" }, { n: "Déplacement rapide", d: "L’abnormis parcourt une distance de 15 m par action de mouvement. Sur une paroi verticale naturelle, il peut se déplacer de 10 m par action de mouvement, sans risque de chute. JEUNE ABNORMIS 1 Si vous souhaitez des rencontres avec un abnormis pour un niveau de dangerosité moindre, utilisez des vouivres fouisseuses plus jeunes. Adaptez le profil de la façon suivante : -1 en FOR, en attaque, aux DM et en DEF et -10 PV par segment de moins ; -1 NC pour 2 seg- ments de moins." }]
},

{
  id: "amphibe", nom: "Amphibe", cat: "humanoide", nc: 2, ncLabel: "2",
  type: "Humanoïde", taille: "Moyenne", env: ["marais"],
  desc: "Les amphibes sont des humanoïdes dont les membres aux muscles surdéveloppés sont souvent devenus difformes et griffus. Leur dos voûté s’orne parfois d’une longue nageoire épineuse et se termine par une queue semblable à celle d’un poisson.",
  car: { AGI: [1], CON: [1], FOR: [3, 1], PER: [0], CHA: [-3], INT: [0], VOL: [-4] },
  def: 15, pv: 30, init: 12,
  att: [{ n: "Griffes et morsure", mod: 8, dmg: "2d6+4" }],
  caps: [{ n: "La lumière de son maître", d: "Un amphibe obtient un dé bonus tant qu’il est dans le périmètre de la lumière malsaine d’un aberratus." }, { n: "Avantage aquatique", d: "Sous l’eau, l’amphibe se déplace de 10 m par action de mouvement et ne subit aucune pénalité. Les amphibes peuvent respirer sous l’eau et à la surface." }]
},

{
  id: "ange", nom: "Ange", cat: "humanoide", nc: 11, ncLabel: "11",
  type: "Humanoïde", taille: "Grande", env: ["urbain"],
  car: { AGI: [6, 1], CON: [8, 1], FOR: [8, 1], PER: [6, 1], CHA: [6, 1], INT: [6], VOL: [6, 1] },
  def: 25, pv: 160, init: 19,
  att: [{ n: "Épée à deux mains", mod: 15, dmg: "2d8+8 Arc de précision (2 attaques) +15 · DM 2d6+6", note: "2 attaques" }],
  caps: [{ n: "Imparable", d: "Lors d’un test d’attaque, l’ange réussit automati- quement s’il obtient 17-20 au d20 et bénéficie alors de +2d10 DM. Ces dés supplémentaires ne sont pas multipliés en cas de critique." }, { n: "Riposte", d: "La créature peut effectuer une attaque en action gratuite contre chaque adversaire qui l’attaque, à l’exception de celui qu’elle a elle-même choisi d’attaquer à son tour." }, { n: "Hausser le ton", d: "Lorsque ses PV deviennent inférieurs à la moitié de leur valeur maximale, le cham- pion bénéficie de +5 à ses tests d’at- taque, +1d10 DM et RD 3." }, { n: "Vol rapide", d: "La créature obtient une action de mouvement supplémentaire par round lorsqu’elle est en vol. Au premier round de combat, la créature obtient un dé bonus en attaque et +1d10 DM si elle est en vol et attaque une créature au sol." }, { n: "Soigner", a: "A", d: "Jusqu’à 5 fois par jour, la créature est capable de soigner 2d6+12 PV d’une créature qu’elle touche." }, { n: "Guérir", a: "A", d: "Ce pouvoir annule tous les effets préjudiciables, pénalités, poisons et maladies subies par la cible. De plus, elle obtient un dé bonus sur sa prochaine action. Portée : toucher la cible. RÉDUCTION DES DM (+0 À +1 AU NC) : L’ange bénéficie d’une RD 10 (même contre les DM magiques), sauf contre les armes malé- fiques et la magie des sorciers." }, { n: "Don des langues", d: "Les anges peuvent converser avec toutes les créatures par télépathie à une distance de 50 m ou à l’oral dans leur propre langue." }, { n: "Autres options", d: "L’ange se prête bien à des déclinaisons diffé- rentes. On peut ainsi remplacer les trois capa- cités de la voie du champion (ange soldat) par celles des voies du gardien (ange gardien), des créatures teigneuses (ange vengeur) ou du chef d’armée (capitaine des troupes célestes)." }]
},

{
  id: "archange", nom: "Archange", cat: "humanoide", nc: 19, ncLabel: "19",
  type: "Humanoïde", taille: "Grande", env: ["urbain"],
  car: { AGI: [6, 1], CON: [10, 1], FOR: [10, 1], PER: [6, 1], CHA: [8, 1], INT: [6], VOL: [8, 1] },
  def: 31, pv: 300, init: 19,
  att: [{ n: "Épée à deux mains", mod: 20, dmg: "2d12+15 Arc de précision (2 attaques) +20 · DM 2d10+12 Attaque magique +22 L’archange possède toutes les capacités de l’ange plus les suivantes :", note: "2 attaques" }],
  caps: [{ n: "Soutenir", a: "L", d: "Une fois par combat, tous les alliés de la créature dans un rayon de 20 m récupèrent (3d6+20) PV." }, { n: "Vitalité surnaturelle", d: "La créature guérit à un rythme fantastique ; elle récupère 40 PV à la fin de chaque round. Si elle est réduite à 0 PV, elle continue à se régénérer, sauf si son adversaire utilise une action limitée pour l’achever (par exemple, en séparant la tête de son corps). RÉDUCTION DES DM (+0 À +1 NC) : L’ange bénéficie d’une RD 15, sauf contre les armes maléfiques et la magie des sorciers. ANIMAL ÉLECTRIQUE" }]
},

{
  id: "limace_electrique", nom: "Limace Électrique", cat: "fantastique", nc: 1, ncLabel: "1",
  type: "Créature fantastique", taille: "Petite", env: ["urbain"],
  car: { AGI: [0], CON: [5], FOR: [0], PER: [3], CHA: [-2], INT: [-4], VOL: [-2] },
  def: 13, pv: 10, init: 13,
  att: [{ n: "Décharge électrique", mod: 4, dmg: "2d8", portee: 10 }],
  caps: [{ n: "Caméléon", d: "La limace électrique peut se confondre facile- ment avec son environnement en changeant CRISTAL de couleur. Elle obtient un bonus de +5 à tous ses tests de discrétion. Le cristal peut être utilisé comme composant de sort pour rendre les sorts de foudre/électri- cité plus faciles à lancer. En termes de règles, lancer le sort coûte 1 PM de moins. Le cristal d’un animal électrique contient seulement 1 PM s’il" }, { n: "Contact électrique", d: "Lorsqu’une créature blesse une limace élec- trique par une attaque de contact, elle subit une décharge qui lui inflige 1d4 DM. est de taille très petite, 3 PM s’il est de taille petite et 6 PM pour une taille moyenne." }, { n: "Lenteur", d: "La limace ne se déplace que de 5 m par action de mouvement." }]
},

{
  id: "lezard_cornu", nom: "Lézard Cornu", cat: "fantastique", nc: 0.5, ncLabel: "1/2",
  type: "Créature fantastique", taille: "Très petite", env: ["foret", "urbain"],
  car: { AGI: [2], CON: [0], FOR: [-3], PER: [2, 1], CHA: [-1], INT: [-4], VOL: [-1] },
  def: 12, pv: 5, init: 15,
  att: [{ n: "Décharge électrique", mod: 3, dmg: "1d8 Morsure +3 · DM 1 + 1d8 d’électricité", portee: 5 }],
  caps: []
},

{
  id: "aigle_geant", nom: "Aigle Géant", cat: "fantastique", nc: 4, ncLabel: "4",
  type: "Créature fantastique", taille: "Grande", env: ["foret", "plaine", "montagne"],
  desc: "L’aigle géant ressemble à son cousin ordinaire, mais son envergure dépasse parfois 6 m. Contrairement à l’aigle royal, qui est de couleur foncée, l’aigle géant est généralement blanc. Il est aussi plus massif et dégage une impression encore plus altière.",
  car: { AGI: [1], CON: [4], FOR: [6], PER: [4, 1], CHA: [0], INT: [-2], VOL: [2] },
  def: 17, pv: 40, init: 17,
  att: [{ n: "Serres et bec", mod: 7, dmg: "2d6+6" }],
  caps: [{ n: "Vol rapide", d: "L’aigle géant obtient une action de mouvement supplémentaire par round lorsqu’il est en vol. Au premier round de combat, s’il est en vol et attaque une créature au sol, il bénéficie d’un dé bonus en attaque et de +1d4 DM." }, { n: "Agripper", d: "Sur un résultat de 15-20 au d20 en attaque, l’aigle géant agrippe sa proie et ne la lâche plus. Il obtient un bonus de +5 en attaque et +1d4 DM contre la cible qu’il agrippe, et celle-ci est immobilisée si elle est de taille inférieure. La victime peut essayer de se libérer au prix d’une action de mouvement en réussissant un test de FOR difficulté 16." }, { n: "Emporter dans les airs", d: "L’aigle géant peut emporter dans les airs une victime agrippée de taille moyenne au prix d’une action de mouvement. Au premier round, si la victime se libère (test de FOR, voire Agripper), elle subit 4d4° DM de chute. Aux rounds sui- vants, si l’aigle géant prend de l’altitude, les DM passent à 7d4°, puis 10d4°. Le dé évolutif des DM de chute est indexé sur le niveau de la victime." }]
},

{
  id: "aigle_colossal_rokh", nom: "Aigle Colossal (Rokh)", cat: "animal", nc: 10, ncLabel: "10",
  type: "Animal", taille: "Colossale", env: ["marais", "urbain"],
  car: { AGI: [2], CON: [10], FOR: [12], PER: [4, 1], CHA: [-2], INT: [-2], VOL: [2] },
  def: 25, pv: 160, init: 17,
  att: [{ n: "Serres et bec", mod: 16, dmg: "2d8+12", note: "2 attaques" }],
  caps: [{ n: "Vol rapide", d: "L’aigle colossal obtient une action de mouve- ment supplémentaire par round lorsqu’il est en vol. Au premier round de combat, s’il est en vol et attaque une créature au sol, il bénéfi- cie d’un dé bonus en attaque et de +1d8 DM." }, { n: "Agripper", d: "Sur un résultat de 17-20 au d20 en attaque, l’aigle colossal agrippe sa proie et ne la lâche plus. Il obtient un bonus de +5 en attaque et +1d8 DM contre la cible qu’il agrippe, et celle-ci est immobilisée si elle est de taille inférieure. La victime peut essayer de se libérer au prix d’une action de mouvement en réussissant un test de FOR difficulté 22." }, { n: "Emporter dans les airs", d: "L’aigle colossal peut emporter dans les airs une victime agrippée de taille moyenne au prix d’une action de mouvement. Au pre- mier round, si la victime se libère (test de FOR, voire Agripper), elle subit 4d4° DM de chute. Aux rounds suivants, si l’aigle colossal prend de l’altitude, les DM passent à 7d4°, puis 10d4°. Le dé évolutif des DM de chute est indexé sur le niveau de la victime. ANGUILLE ÉLECTRIQUE GÉANTE L’anguille électrique géante est un prédateur aquatique capable de délivrer des décharges électriques létales ; pour autant, il ne faut pas sous-estimer sa morsure. Il en existe de taille plus ou moins importante (entre 3 et 8 m). Bien qu’elle possède des branchies, l’anguille doit remonter régulièrement à la surface pour aspirer de l’air par la bouche, où se font les échanges gazeux. Elle peut se déplacer sur la terre ferme (bien que son mouvement soit alors divisé par deux). À moindre intensité, le champ électrique qu’elle produit lui permet aussi de se repérer et d’avoir une forme de vision dans les ténèbres, même magiques, ainsi que la percep- tion de l’invisible dans un rayon de 10 m. IMMUNITÉ À L’ÉLECTRICITÉ : Toutes les anguilles sont immunisées aux DM d’électricité." }]
},

{
  id: "anguille_electrique", nom: "Anguille Électrique", cat: "fantastique", nc: 0.5, ncLabel: "1/2",
  type: "Créature fantastique", taille: "Petite", env: ["ruines"],
  car: { AGI: [2, 1], CON: [2], FOR: [1], PER: [1], CHA: [-2], INT: [-4], VOL: [0] },
  def: 12, pv: 5, init: 11,
  att: [{ n: "Morsure", mod: 4, dmg: "1d4+1" }],
  caps: [{ n: "Choc électrique", a: "M", d: "Une fois par combat, l’anguille émet une violente décharge électrique qui inflige 2d4 DM à toutes les créatures à son contact. Les victimes doivent réussir un test de CON difficulté 10 ou être étourdies pendant 1d4 rounds (nouveau test de CON à chaque fin de round). De plus, si elles ne sont pas capables de respirer sous l’eau, les victimes subissent 1d4° DM de suffocation par round tant qu’elles sont étourdies (dé évolutif basé sur le niveau des victimes)." }]
},

{
  id: "anguille_electrique_2", nom: "Anguille Électrique", cat: "fantastique", nc: 2, ncLabel: "2",
  type: "Créature fantastique", taille: "Moyenne", env: ["ruines"],
  car: { AGI: [2, 1], CON: [2], FOR: [3], PER: [1], CHA: [-2], INT: [-4], VOL: [0] },
  def: 14, pv: 25, init: 11,
  att: [{ n: "Morsure", mod: 7, dmg: "2d4+3" }],
  caps: [{ n: "Choc électrique", a: "M", d: "Une fois par combat, l’anguille émet une vio- lente décharge électrique qui inflige 3d6 DM dans un rayon de 3 m autour d’elle. Les vic- times doivent réussir un test de CON diffi- culté 15 ou être étourdies pour 1d4 rounds (nouveau test de CON à chaque fin de round). De plus, si elles sont incapables de respirer sous l’eau, les victimes subissent 1d4° DM de suffocation par round tant qu’elles sont étourdies (dé évolutif basé sur le niveau de la victime)." }]
},

{
  id: "anguille_electrique_3", nom: "Anguille Électrique", cat: "fantastique", nc: 4, ncLabel: "4",
  type: "Créature fantastique", taille: "Grande", env: ["foret", "souterrain", "urbain"],
  car: { AGI: [2, 1], CON: [2], FOR: [5], PER: [1], CHA: [-2], INT: [-4], VOL: [0] },
  def: 18, pv: 50, init: 11,
  att: [{ n: "Morsure", mod: 9, dmg: "2d6+5", note: "2 attaques" }],
  caps: [{ n: "Choc électrique", d: "Une fois par combat, l’anguille émet une vio- lente décharge électrique qui inflige 5d6 DM dans un rayon de 6 m autour d’elle. Les vic- times doivent réussir un test de CON diffi- culté 20 ou être étourdies pour 1d4 rounds (nouveau test de CON à chaque fin de round). De plus, si elles sont incapables de respirer sous l’eau, les victimes subissent 1d4° DM de suffocation par round tant qu’elles sont étourdies (dé évolutif basé sur le niveau de la victime)." }]
},

{
  id: "araignee_geante_2", nom: "Araignée Géante", cat: "fantastique", nc: 0.5, ncLabel: "1/2",
  type: "Créature fantastique", taille: "Très petite", env: ["ruines"],
  desc: "Les araignées géantes (arthropodes) sont des monstres terrifiants : rapides, puissants et capables de survivre aux pires blessures.",
  car: { AGI: [3, 1], CON: [0, 1], FOR: [-2, 1], PER: [2], CHA: [-4], INT: [-4], VOL: [-2] },
  def: 13, pv: 2, init: 12,
  att: [],
  caps: [{ n: "Poison", d: "Faire un test de CON difficulté 10 ou être affaiblie jusqu’à ce qu’une récupération rapide soit terminée. 2d8 DM, test de CON difficulté 15 W WARAIGNÉE GÉANTE (ÉNORME) | NC 8 CRÉATURE VIVANTE TAILLE ÉNORME | AGI +2* | CON +10* | FOR +10* | PER +2 | | CHA -4 | INT -4 | VOL +0 | (S)DEF 24 (V)PV 140 (I)Init. 12 Attaque +13 · DM 2d12+16 + poison" }]
},

{
  id: "araignee_geante_3", nom: "Araignée Géante", cat: "fantastique", nc: 12, ncLabel: "12",
  type: "Créature fantastique", taille: "Petite", env: ["plaine", "montagne", "urbain"],
  desc: "Les araignées géantes (arthropodes) sont des monstres terrifiants : rapides, puissants et capables de survivre aux pires blessures.",
  car: { AGI: [4, 1], CON: [1, 1], FOR: [1, 1], PER: [2], CHA: [-4], INT: [-4], VOL: [-2] },
  def: 14, pv: 10, init: 12,
  att: [{ n: "Attaque", mod: 3, dmg: "1d6+1 + poison" }, { n: "Attaque", mod: 16, dmg: "4d10+22 + poison" }],
  caps: [{ n: "Poison", d: "2d12 DM, test de CON difficulté 20 ARAIGNÉES MAGIQUES Dans les Terres d’Osgild, Maëdra, la déesse des Insectes, considère les araignées comme ses petites protégées et a donné naissance à de nombreuses variantes magiques de ces créa- tures. Elles peuvent donc profiter d’un grand nombre de capacités spéciales issues des voies de créatures, des capacités auxquelles on ne s’at- tendrait pas forcément chez des araignées (voir les exemples ci-dessous). Toutes ces araignées portent la marque de Maëdra qui leur confère un bonus de +2 en INT et en VOL. Chaque capacité apporte +1 NC. Invisibilité : l’araignée peut devenir invisible grâce à une action gratuite, une fois par round. Elle redevient visible dès qu’elle passe à l’at- taque. Si elle attaque une créature par surprise ou dans le dos, elle inflige +2d4° DM. Forme éthérée : l’araignée devient translu- cide et intangible pendant 1 à 5 rounds. Sous cette forme, elle peut passer à travers murs et obstacles et ne peut subir aucun DM physique. L’araignée n’a besoin que d’une action libre pour passer en forme éthérée et une action de mouvement (qui peut être associée à un dépla- cement de 15 m) lui suffit pour effectuer le tra- jet inverse. Pattes tranchantes (L) : cette araignée peut faire un bond de 10 m de long et retomber sur sa proie en utilisant ses pattes terminées par des lames. Elle fait un test d’attaque au contact nor- mal et inflige +2d4° DM en cas de réussite. De plus, la victime doit faire un test de FOR dif- ficulté [10 + FOR de l’araignée] ou être renversée. Elle gagne aussi +5 en Init., +2 en AGI et +2 en DEF. AUTRUCHE GÉANTE Parmi les différentes espèces d’autruches géantes, deux en particulier sont connues sur les Terres d’Osgild : l’aepyornis et l’ostor." }]
},

{
  id: "aepyornis", nom: "Aepyornis", cat: "fantastique", nc: 4, ncLabel: "4",
  type: "Créature fantastique", taille: "Énorme", env: ["plaine", "urbain"],
  car: { AGI: [2], CON: [3], FOR: [5], PER: [1], CHA: [-2], INT: [-4], VOL: [-2] },
  def: 18, pv: 70, init: 12,
  att: [{ n: "Bec et ergots", mod: 9, dmg: "1d10+5", note: "2 attaques" }],
  caps: [{ n: "Course rapide", d: "L’aepyornis couvre 15 m par action de déplacement." }, { n: "Terrible coup de patte", d: "Lorsque l’aepyornis réussit une attaque avec un résultat de 17-20 au d20, elle est automa- tiquement réussie et la victime doit réussir un test de CON difficulté 15 ou être étourdie pendant 1 round." }]
},

{
  id: "ostor", nom: "Ostor", cat: "fantastique", nc: 1, ncLabel: "1",
  type: "Créature fantastique", taille: "Grande", env: ["urbain"],
  car: { AGI: [2], CON: [1], FOR: [2], PER: [1], CHA: [-2], INT: [-4], VOL: [-2] },
  def: 13, pv: 20, init: 12,
  att: [{ n: "Bec et ergots", mod: 4, dmg: "1d6+2" }],
  caps: [{ n: "Course rapide", d: "Une ostor couvre 15 m par action de déplacement." }]
},

{
  id: "calmar_geant", nom: "Calmar Géant", cat: "fantastique", nc: 4, ncLabel: "4",
  type: "Créature fantastique", taille: "Grande", env: ["ruines"],
  desc: "Le calmar est composé d’un long corps cylindrique fuselé et pourvu de deux nageoires.",
  car: { AGI: [3, 1], CON: [6], FOR: [6], PER: [1], CHA: [-4], INT: [-3], VOL: [0] },
  def: 18, pv: 50, init: 11,
  att: [{ n: "Tentacules", mod: 9, dmg: "1d6+6", note: "2 attaques" }],
  caps: [{ n: "Embuscade", d: "Au premier round de combat, dans un envi- ronnement avec lequel le calmar se confond, la cible doit réussir un test de PER difficulté 20 ou être surprise. Dans ce cas, il obtient un dé bonus en attaque. Le calmar bénéficie de +10 à tous ses tests de discrétion." }, { n: "Saisie", d: "Lorsque le calmar réussit une attaque avec un résultat de 17-20 au d20, il saisit sa proie entre ses tentacules. Si la FOR de la cible est infé- rieure ou égale à celle du calmar, elle est alors immobilisée. Pour se libérer, la victime doit réussir un test de FOR difficulté 16 lors de son tour, ce qui nécessite une action d’attaque. NUAGE D’ENCRE (M) : Le calmar peut émettre un nuage d’encre noire qui aveugle ses poursuivants. Le nuage occupe un volume de 20 m de côté et est considéré comme une zone de noir total pendant 1d4 rounds. Ensuite, la zone s’étend sur 40 m et est alors considérée comme de la pénombre pendant 1d4 rounds supplémentaires." }, { n: "Propulsion", a: "M", d: "Sous l’eau, le calmar peut se déplacer de 20 m par action de mouvement en ligne droite." }]
},

{
  id: "calmar_enorme", nom: "Calmar (Énorme)", cat: "fantastique", nc: 7, ncLabel: "7",
  type: "Créature fantastique", taille: "Énorme", env: ["urbain"],
  car: { AGI: [2, 1], CON: [6], FOR: [9], PER: [1], CHA: [-4], INT: [-3], VOL: [0] },
  def: 22, pv: 110, init: 11,
  att: [{ n: "Tentacules", mod: 12, dmg: "1d8+9", note: "2 attaques" }],
  caps: [{ n: "Capacités", d: "Mêmes capacités que le calmar. De plus, la difficulté pour échapper à la saisie passe à 19. Le calmar de taille énorme peut faire chavirer une barque de taille moyenne (jusqu’à 10 occupants) en réussissant un test de FOR contre un test de PER du pilote. Le MJ pourra assigner un bonus ou un malus en fonction de la taille de l’embarcation." }]
},

{
  id: "kraken", nom: "Kraken", cat: "fantastique", nc: 11, ncLabel: "11",
  type: "Créature fantastique", taille: "Colossale", env: ["foret", "montagne", "souterrain", "urbain"],
  car: { AGI: [1, 1], CON: [6], FOR: [12], PER: [1], CHA: [-4], INT: [-3], VOL: [0] },
  def: 27, pv: 200, init: 11,
  att: [],
  caps: [{ n: "Capacités", d: "Mêmes capacités que le calmar. De plus, la difficulté pour échapper à la saisie passe à 22. Un kraken en colère est capable de venir à bout d’une barque en 1 round, un voilier avec un seul mât en 3 rounds, un deux-mâts ou une birème en 6 rounds et un trois-mâts ou une trirème en 9 rounds. Un gros navire amiral pourrait espérer tenir 12 rounds." }]
},

{
  id: "cameleon_geant", nom: "Caméléon Géant", cat: "fantastique", nc: 5, ncLabel: "5",
  type: "Créature fantastique", taille: "Énorme", env: ["ruines"],
  desc: "Les caméléons géants font la taille d’un hip- popotame et vivent dans une grande variété de milieux naturels : montagnes, forêts, souterrains et partout où leur capacité de camouflage fait merveille. Pour un caméléon géant, un humain",
  car: { AGI: [1, 1], CON: [8], FOR: [8], PER: [4, 1], CHA: [-4], INT: [-3], VOL: [0] },
  def: 19, pv: 60, init: 17,
  att: [{ n: "Morsure", mod: 10, dmg: "2d6+8" }],
  caps: [{ n: "Embuscade", d: "Au premier round de combat, la cible doit réussir un test de PER difficulté 20 ou être surprise. Dans ce cas, le caméléon débute généralement par une attaque de langue gluante avec un dé bonus. Le caméléon béné- ficie de +10 à tous ses tests de discrétion." }, { n: "Langue gluante", a: "A", d: "Le caméléon peut projeter sa langue col- lante à 10 m en un instant. S’il réussit un test d’attaque (+10), il englue une victime de taille moyenne ou inférieure. Elle doit réussir un test de FOR difficulté 18 (dé malus si elle est surprise) ou être arrachée de sa position et ramenée dans la gueule du monstre où elle subit immédiatement des DM de morsure." }, { n: "Gober", d: "Si le caméléon réussit une attaque avec un résultat de 15-20 sur le d20, sa victime est gobée. Un PJ gobé subit 3d6 DM d’asphyxie et d’acide à chaque tour du caméléon. Il peut alors attaquer avec une arme pas plus grande qu’une dague, au prix d’une action limitée, en réussissant un test de FOR difficulté 15 à chaque tour. L’attaque se fait avec une péna- lité de -5 et les DM sont divisés par deux. VISION À 360° : Les yeux globuleux et indépendants du camé- léon lui permettant de voir tout autour de lui, il est immunisé à l’attaque sournoise du voleur." }]
},

{
  id: "chauve_souris_geante", nom: "Chauve-souris Géante", cat: "fantastique", nc: 2, ncLabel: "2",
  type: "Créature fantastique", taille: "Grande", env: ["foret"],
  car: { AGI: [4], CON: [-1], FOR: [3], PER: [4, 1], CHA: [-4], INT: [-4], VOL: [-2] },
  def: 16, pv: 20, init: 17,
  att: [{ n: "Morsure", mod: 7, dmg: "1d6+3" }],
  caps: [{ n: "Poison anesthésiant", d: "La morsure de la chauve-souris géante inocule un poison. La victime doit réussir un test de CON difficulté 10 ou être affaiblie pen- dant 1d6 rounds. Si elle est affectée une seconde fois par le poison alors qu’elle est déjà sous son effet, elle sombre alors dans l’inconscience pour 1d6 rounds. Certains spécimens puissants peuvent trans- porter des passagers de taille humaine, mais la FOR du passager ne doit pas dépasser celle de la chauve-souris." }]
},

{
  id: "crabe_geant", nom: "Crabe Géant", cat: "fantastique", nc: 5, ncLabel: "5",
  type: "Créature fantastique", taille: "Grande", env: ["marais"],
  desc: "Ce crabe géant dispose de longues pattes et d’une impressionnante cuirasse osseuse. Il mesure presque 5 m de diamètre pour 2 m de haut. Ses pinces sont terrifiantes.",
  car: { AGI: [2], CON: [5], FOR: [5], PER: [0], CHA: [-4], INT: [-4], VOL: [-1] },
  def: 23, pv: 50, init: 10,
  att: [{ n: "Pinces", mod: 8, dmg: "1d10+5", note: "2 attaques" }],
  caps: [{ n: "Sécateur", d: "Lorsque le crabe réussit une attaque avec un résultat de 17-20 au d20, la victime doit faire un test de CON difficulté 15. En cas d’échec, lancez 1d4 pour déterminer le membre affecté : 1 bras droit, 2 bras gauche, 3 jambe droite, 4 jambe gauche. Si la cible est un PNJ, le membre est amputé ; si c’est un PJ, le membre est inutilisable jusqu’à ce que le per- sonnage prenne une récupération complète. Si une jambe est affectée, le personnage est considéré immobilisé." }]
},

{
  id: "crocodile_geant", nom: "Crocodile Géant", cat: "fantastique", nc: 8, ncLabel: "8",
  type: "Créature fantastique", taille: "Énorme", env: ["ruines"],
  desc: "Le crocodile géant est un monstre aquatique reptilien au physique caractéristique. Doté de courtes pattes et d’une tête anguleuse allon- gée garnie de dizaines de dents redoutables, il mesure environ 12 m de long (dont la moitié de queue).",
  car: { AGI: [0, 1], CON: [10], FOR: [10], PER: [0, 1], CHA: [-2], INT: [-4], VOL: [4] },
  def: 23, pv: 110, init: 13,
  att: [{ n: "Morsure", mod: 15, dmg: "2d10+15" }],
  caps: [{ n: "Embuscade", d: "Au premier round de combat, si l’environne- ment permet au crocodile de se dissimuler (généralement sous l’eau), la cible doit réussir un test de PER difficulté 15 ou être surprise. Dans ce cas, le crocodile obtient un dé bonus en attaque. S’il attaque avec succès une cible dont la FOR est inférieure à la sienne, elle est alors renversée. Le crocodile bénéficie de +5 à tous les tests de discrétion." }, { n: "Saisir", d: "Lorsque le crocodile réussit une attaque avec un résultat de 15-20 au d20, il saisit sa proie dans sa gueule et elle est immobilisée. Pour mettre fin à cet état, il faut réussir un test de FOR difficulté 20 (action d’attaque)." }, { n: "Gober", d: "À son tour, au lieu d’attaquer, le crocodile peut tenter d’avaler entièrement une cible qu’il a saisie faisant au moins 1 taille en dessous de la sienne. Si la victime échoue à un test de FOR difficulté 20, elle passe directement dans l’estomac du monstre. Un personnage avalé subit 3d6 DM d’asphyxie et d’acide à chaque round. Il peut attaquer avec une arme pas plus grande qu’une dague en réussissant un test de FOR difficulté 15 à chaque attaque. L’attaque se fait avec un dé malus et les DM sont divisés par deux. Une fois le crocodile mort, il faut encore 1 round et une arme tran- chante pour lui ouvrir le ventre et sortir." }]
},

{
  id: "fourmilion_geant", nom: "Fourmilion Géant", cat: "fantastique", nc: 5, ncLabel: "5",
  type: "Créature fantastique", taille: "Grande", env: ["foret"],
  desc: "Le fourmilion est une sorte de gros scarabée de 3 m de long dote d’une impressionnante paire de mandibules. Il creuse dans le sol un trou aux bords instables et attend que des créatures chutent et dégringolent vers lui.",
  car: { AGI: [0, 1], CON: [8], FOR: [8], PER: [0], CHA: [-3], INT: [-4], VOL: [0] },
  def: 20, pv: 70, init: 13,
  att: [{ n: "Mandibules", mod: 10, dmg: "2d8+8" }],
  caps: [{ n: "Boule de glaise", a: "M", d: "Le fourmilion projette une boule de glaise à une portée de 20 m. Sur un test d’attaque réussi, une cible de taille moyenne ou infé- rieure subit 1 DM et doit faire un test d’AGI difficulté 10 ou être renversée. Si elle était au bord du cône instable, elle chute dans le trou." }, { n: "Cône instable", d: "Une créature qui s’approche suffisamment du bord pour avoir en ligne de vue le fourmilion au fond du trou (10 m de diamètre) est dans une zone instable. Elle doit réussir un test d’AGI difficulté 15 ou dégringoler dans le trou jusqu’au contact du fourmilion. Elle est renversée." }, { n: "Sol instable", d: "Le sol dans un rayon de 10 m autour du four- milion est semblable à des sables mouvants. Chaque round, un PJ doit faire un test d’AGI difficulté 10 ou être ralenti." }]
},

{
  id: "gorille_geant", nom: "Gorille Géant", cat: "fantastique", nc: 10, ncLabel: "10",
  type: "Créature fantastique", taille: "Énorme", env: ["foret", "montagne"],
  desc: "Le gorille géant est un animal mythique qui vit au plus profond de jungles inexplorées ou au cœur d’îles vierges et isolées. Il mesure environ 5 m de haut et possède une force démesurée.",
  car: { AGI: [3, 1], CON: [10, 1], FOR: [10, 1], PER: [2], CHA: [-2], INT: [-2], VOL: [3] },
  def: 25, pv: 150, init: 16,
  att: [{ n: "Poings et morsure", mod: 14, dmg: "2d6+10", note: "2 attaques" }],
  caps: [{ n: "Balayage", d: "Le gorille peut viser deux créatures à son contact d’un seul coup de patte. Il ne fait qu’un seul test d’attaque pour les deux cibles. Si les deux sont touchées, la cible secondaire (désignée par le MJ) ne subit que la moitié des DM." }, { n: "Énorme", d: "Le gorille a une RD 3 grâce à sa grande taille." }, { n: "Charge", a: "L", d: "Le gorille parcourt une distance maximale de 20 m et réalise une attaque avec un dé bonus. Si l’attaque est réussie, en plus des DM normaux, une victime de taille énorme ou infé- rieure doit faire un test de FOR difficulté 20 ou être renversée. Dans ce cas, le gorille roue de coups sa victime et les DM sont doublés." }, { n: "Enragé", d: "Lorsqu’il reçoit un coup critique, le gorille devient enragé. Il ignore les pénalités de dou- leur ou la peur, et bénéficie de +3 en attaque au contact et +1d8 DM. Il peut encore agir un tour complet après avoir atteint 0 PV." }, { n: "Projeter", d: "Lorsque le gorille réussit une attaque avec un résultat de 17-20 au d20, la victime est proje- tée à 2d6 m et subit +2d8 DM. Elle est renversée et doit réussir un test de CON difficulté 15 ou être étourdie pour 1 round." }, { n: "Passage par les arbres", d: "Le gorille géant se déplace aussi vite dans les arbres qu’au sol s’il est dans une forêt où poussent des arbres dignes de lui. Il bénéfi- cie de +5 pour les tests d’escalade (falaises, bâtiments)." }]
},

{
  id: "guepe_geante", nom: "Guêpe Géante", cat: "fantastique", nc: 1, ncLabel: "1",
  type: "Créature fantastique", taille: "Petite", env: ["ruines"],
  desc: "Une guêpe de la taille d’un chien.",
  car: { AGI: [4, 1], CON: [1, 1], FOR: [1], PER: [2], CHA: [-4], INT: [-2], VOL: [2] },
  def: 15, pv: 15, init: 12,
  att: [{ n: "Attaque", mod: 4, dmg: "1d4 + poison" }],
  caps: [{ n: "Vol rapide", d: "La guêpe obtient une action de mouvement supplémentaire par round lorsqu’elle est en vol. Si elle est en vol et attaque une créature au sol, au premier round, elle obtient un dé bonus en attaque et +1d4 DM." }, { n: "Poison", d: "Le poison inflige immédiatement 2d6 DM à la victime, réduit de moitié si celle-ci réussit un test de CON difficulté 10." }]
},

{
  id: "libellule_geante", nom: "Libellule Géante", cat: "fantastique", nc: 4, ncLabel: "4",
  type: "Créature fantastique", taille: "Énorme", env: ["foret", "marais"],
  desc: "Cette monstrueuse libellule de presque 5 m de long est repérable au formidable vrombissement de ses magnifiques ailes aux reflets irisés, qui atteignent une envergure de 12 m. C’est un prédateur aussi beau que dangereux.",
  car: { AGI: [4, 1], CON: [4], FOR: [6], PER: [4, 1], CHA: [-2], INT: [-4], VOL: [2] },
  def: 18, pv: 50, init: 17,
  att: [{ n: "Morsure", mod: 8, dmg: "2d6+6" }],
  caps: [{ n: "Agripper", d: "Lorsque la libellule réussit une attaque avec un résultat de 15-20 au d20, elle agrippe sa proie et ne la lâche plus. Elle bénéficie de +5 en attaque et +1d6 DM contre la cible qu’elle agrippe. Celle-ci est immobilisée si elle est de taille inférieure ; elle peut essayer de se libérer au prix d’une action de mouvement en réussissant un test de FOR difficulté 16." }, { n: "Emporter dans les airs", d: "La libellule peut emporter dans les airs une victime agrippée de taille moyenne au prix d’une action de mouvement. Si la victime se libère (test de FOR, voir Agripper), elle subit 4d4° DM de chute. Le dé évolutif des DM de chute est indexé sur le niveau de la victime. Heureusement, les libellules ne volent jamais très haut et généralement au-dessus de marais." }, { n: "Vol rapide", d: "La libellule obtient une action de mouvement supplémentaire par round lorsqu’elle est en vol. Si elle est en vol et attaque une créature au sol, au premier round de combat, elle obtient un dé bonus en attaque." }, { n: "Vrombissement", d: "En raison de son vrombissement puissant, la libel- lule peut être repérée à une distance de 40 m en réussissant un test de PER (ouïe) difficulté 10." }]
},

{
  id: "limace_geante", nom: "Limace Géante", cat: "fantastique", nc: 3, ncLabel: "3",
  type: "Créature fantastique", taille: "Grande", env: ["ruines"],
  desc: "Cette limace de presque 3 m de long pour 500 kg vit aussi bien en forêt que dans les profondeurs de la terre. Elle laisse derrière elle une traînée de bave très facile à suivre pendant presque une heure.",
  car: { AGI: [-1], CON: [6], FOR: [5], PER: [0], CHA: [-4], INT: [-4], VOL: [-2] },
  def: 15, pv: 40, init: 10,
  att: [{ n: "Morsure", mod: 6, dmg: "1d6+5 + 1d6 acide" }],
  caps: [{ n: "Résistances", d: "La limace divise par deux les DM de type tranchant ou de feu." }, { n: "Crachat", d: "La limace peut cracher une substance collante et acide à une portée de 10 m. Si elle réussit un test d’attaque à distance (+6), elle inflige 2d6 DM, puis 1d6 DM par round pendant 3 rounds sup- plémentaires. Il est possible de stopper les DM des rounds suivants en utilisant une action limitée pour s’en débarrasser. Si le d6 de DM supplémentaires indique un résultat de 1, consi- dérez qu’une pièce d’équipement protège le PJ (0 DM) et qu’elle est détruite si elle n’est pas magique (vêtement ou armure)." }, { n: "Sol glissant", d: "Lorsqu’elle se déplace, la limace laisse au sol une bave glissante. Lorsqu’une créature l’attaque au contact, si elle obtient un résultat au d20 infé- rieur ou égal à 5, en plus de rater automatique- ment son attaque, elle doit faire un test d’AGI difficulté 15 ou chuter (renversé). Lorsqu’elle sèche, la bave de limace devient une sorte de voile cristallin aux reflets arc-en-ciel qui craque sous les pas (dé malus aux tests de discrétion)." }]
},

{
  id: "loup_geant", nom: "Loup Géant", cat: "fantastique", nc: 4, ncLabel: "4",
  type: "Créature fantastique", taille: "Grande", env: ["foret", "urbain"],
  desc: "Telle la bête du Gévaudan, le loup géant est une énorme bête solitaire qui n’hésite pas à s’attaquer à des villageois.",
  car: { AGI: [1, 1], CON: [6], FOR: [6], PER: [2, 1], CHA: [-4], INT: [-3], VOL: [1] },
  def: 18, pv: 50, init: 14,
  att: [{ n: "Morsure", mod: 10, dmg: "2d6+6" }],
  caps: [{ n: "Embuscade", d: "Au premier round de combat, dans un environne- ment permettant au loup de se dissimuler, la cible doit réussir un test de PER difficulté 16 ou être surprise. S’il attaque avec succès une cible surprise, le loup lui inflige +1d4 DM. Si la cible a une FOR est inférieure à la sienne, elle est alors renversée. Le loup bénéficie de +5 à tous ses tests de discrétion." }, { n: "Dévorer", d: "Lorsque le loup réussit une attaque avec un résultat de 15-20 au d20, il saisit sa proie entre ses crocs ou ses griffes et lui inflige immédiatement une attaque gratuite supplémentaire." }]
},

{
  id: "phasme_geant", nom: "Phasme Géant", cat: "fantastique", nc: 4, ncLabel: "4",
  type: "Créature fantastique", taille: "Énorme", env: ["ruines"],
  desc: "Le phasme géant ressemble aux branches d’un arbre mort tant qu’il ne se déplace pas. Contrairement au phasme ordinaire, il est omnivore et utilise sa capacité de mimétisme pour surprendre ses proies.",
  car: { AGI: [0, 1], CON: [7], FOR: [7], PER: [2], CHA: [-4], INT: [-4], VOL: [0] },
  def: 18, pv: 40, init: 12,
  att: [{ n: "Morsure", mod: 8, dmg: "2d6+7" }],
  caps: [{ n: "Camouflage", d: "Au premier round de combat, la cible doit faire un test de PER difficulté 20 ou être surprise. S’il attaque avec succès une cible surprise, le phasme obtient un dé bonus en attaque et inflige +2d4 DM. Le phasme bénéficie de +10 à tous ses tests de discrétion." }, { n: "Consistance du bois", d: "La carapace du phasme est très solide et lui confère une RD 3." }, { n: "Agripper", d: "Lorsque le phasme réussit une attaque avec un résultat de 15-20 au d20, il agrippe sa proie et ne la lâche plus. Il obtient +5 en attaque et +1d4 DM contre elle. La cible est immobilisée si elle est de taille inférieure ; une fois par round, elle peut essayer de se libérer au prix d’une action de mouvement en réussissant un test de FOR difficulté 17." }]
},

{
  id: "pieuvre_geante", nom: "Pieuvre Géante", cat: "fantastique", nc: 7, ncLabel: "7",
  type: "Créature fantastique", taille: "Énorme", env: ["marais", "urbain"],
  desc: "Dotée de 8 tentacules de près de 5 m de long, cette pieuvre est capable de s’attaquer à un bateau de petite taille. Elle est bien plus intelligente que la plupart des autres animaux.",
  car: { AGI: [3, 1], CON: [9], FOR: [9], PER: [2], CHA: [-4], INT: [-2], VOL: [2] },
  def: 20, pv: 100, init: 12,
  att: [{ n: "Tentacules", mod: 12, dmg: "1d6+6", note: "4 attaques" }],
  caps: [{ n: "Agripper", d: "Lorsque la pieuvre réussit une attaque avec un résultat de 18-20 au d20, elle agrippe sa proie et ne la lâche plus. Elle obtient +5 en attaque et +1d6 DM contre elle. La cible est immobilisée si elle est de taille inférieure ; une fois par round, elle peut essayer de se libérer au prix d’une action de mouvement en réussissant un test de FOR difficulté 19. Si la cible ne respire pas sous l’eau, elle se noie deux fois plus vite que la normale tant qu’elle est agrippée." }, { n: "Créature aquatique", d: "La pieuvre ne souffre d’aucune pénalité lors- qu’elle combat sous l’eau." }]
},

{
  id: "sanglier_geant", nom: "Sanglier Géant", cat: "fantastique", nc: 6, ncLabel: "6",
  type: "Créature fantastique", taille: "Grande", env: ["ruines"],
  desc: "Pourvu d’une crête osseuse et de défenses énormes, le sanglier géant est une créature véri- tablement impressionnante.",
  car: { AGI: [0], CON: [6, 1], FOR: [6], PER: [1], CHA: [-2], INT: [-4], VOL: [4] },
  def: 20, pv: 70, init: 11,
  att: [{ n: "Défenses", mod: 10, dmg: "3d6+6" }],
  caps: [{ n: "Charge", a: "L", d: "Le sanglier parcourt une distance maximale de 20 m et réalise une attaque avec un dé bonus. Si l’attaque est réussie, en plus des DM normaux, une victime de taille grande ou infé- rieure doit faire un test de FOR difficulté 16 ou être renversée. Dans ce cas, le sanglier éventre sa victime et les DM sont doublés." }, { n: "Tape dur", d: "S’il obtient un résultat de 15-20 au d20, le sanglier réussit automatiquement son attaque. La victime doit alors réussir un test de CON difficulté 16 ou être étourdie pendant 1 round." }, { n: "Enragé", d: "Lorsqu’il reçoit un coup critique, le sanglier devient enragé. Il ignore les pénalités de dou- leur ou la peur, et bénéficie de +3 en attaque au contact et +1d6 DM. Il peut encore agir un tour complet après avoir atteint 0 PV." }, { n: "Teigneux", d: "Si le sanglier rate une attaque, il bénéficie d’un dé bonus et de +2d6 DM pour la prochaine." }]
},

{
  id: "sangsue_geante", nom: "Sangsue Géante", cat: "fantastique", nc: 0.5, ncLabel: "1/2",
  type: "Créature fantastique", taille: "Très petite", env: ["marais", "urbain"],
  desc: "La sangsue géante mesure à peu près la taille d’un bras humain. Lorsqu’elle est accrochée, il est très délicat de la retirer sans provoquer une hémorragie, et elle laisse de terribles cicatrices.",
  car: { AGI: [0], CON: [2], FOR: [-1], PER: [0], CHA: [-2], INT: [-4], VOL: [0] },
  def: 11, pv: 5, init: 10,
  att: [{ n: "Morsure", mod: 4, dmg: "1d4 + accrochée" }],
  caps: [{ n: "Attaque surprise", d: "La sangsue se camoufle parfaitement dans les eaux troubles des marais. La victime doit réussir un test de PER difficulté 15 au premier round de combat ou être surprise." }, { n: "Accrochée", d: "Dès qu’elle a réussi une attaque, la sangsue est accrochée à sa victime par un effet de succion combiné à de fins crochets qui pénètrent sous la peau de la cible. Elle inflige automatique- ment 1d4 DM par round. Tant que la sangsue est accrochée, elle obtient un bonus de +3 en DEF pour simuler la difficulté à l’éliminer sans risquer de blesser sa victime. Il est possible d’arracher la sangsue avec précaution en utilisant une action limitée et en réussissant un test d’AGI (Médecine) difficulté 15. En cas d’échec, la victime subit une hémorragie qui inflige +1 DM par round jusqu’à ce que des premiers soins soient appliqués au calme ou que la victime reçoive des soins magiques (au moins 1 PV). SCORPION GÉANT Les scorpions sont des arthropodes et béné- ficient à ce titre des mêmes avantages que les araignées : ils sont rapides, puissants et capables de survivre aux pires blessures. Capacités communes" }, { n: "Vermine", d: "Tous les arthropodes géants obtiennent un dé bonus en FOR, en AGI en CON, et lorsque la créature atteint 0 PV, elle peut encore agir 1 round complet. Ils sont rapides et se déplacent de 15 m par action de mouvement." }, { n: "Cuirassé", d: "La créature bénéficie d’une RD 5 contre les armes." }, { n: "Poison", d: "Le poison inflige des DM supplémentaires à la victime à chaque attaque (voir les profils). Si le PJ réussit un test de CON de la difficulté indiquée, il ne subit que ½ DM. Variantes Fourmis : bien que les fourmis soient des insectes et non des arthropodes, vous pouvez utiliser ce profil pour les fourmis géantes de taille petite (ouvrière), moyenne (guerrière) ou énorme (reine). L’attaque de pinces est remplacée par une morsure et le poison est remplacé par des DM d’acide sur la morsure (pas d’attaque de dard). Mille-pattes : le mille-pattes ou une scolopendre inflige des DM de poison avec sa morsure, mais ne dispose pas d’attaque de dard." }]
},

{
  id: "arthropode_petite", nom: "Arthropode (Petite)", cat: "fantastique", nc: 1, ncLabel: "1",
  type: "Créature fantastique", taille: "Petite", env: ["ruines"],
  car: { AGI: [4, 1], CON: [1, 1], FOR: [1, 1], PER: [2], CHA: [-4], INT: [-4], VOL: [-2] },
  def: 14, pv: 10, init: 12,
  att: [{ n: "Pinces", mod: 3, dmg: "1d6+1" }, { n: "Dard", mod: 3, dmg: "1 + poison (2d4, difficulté 10" }],
  caps: []
},

{
  id: "arthropode_moyen", nom: "Arthropode (Moyen)", cat: "fantastique", nc: 3, ncLabel: "3",
  type: "Créature fantastique", taille: "Moyenne", env: ["ruines"],
  car: { AGI: [4, 1], CON: [3, 1], FOR: [3, 1], PER: [2], CHA: [-4], INT: [-4], VOL: [0] },
  def: 17, pv: 30, init: 12,
  att: [{ n: "Pinces", mod: 6, dmg: "2d6+3" }, { n: "Dard", mod: 6, dmg: "1d4 + poison (2d6, difficulté 12" }],
  caps: []
},

{
  id: "arthropode_grand", nom: "Arthropode (Grand)", cat: "fantastique", nc: 5, ncLabel: "5",
  type: "Créature fantastique", taille: "Grande", env: ["ruines"],
  car: { AGI: [3, 1], CON: [6, 1], FOR: [6, 1], PER: [2], CHA: [-4], INT: [-4], VOL: [0] },
  def: 20, pv: 60, init: 12,
  att: [{ n: "Pinces", mod: 10, dmg: "2d8+6" }, { n: "Dard", mod: 10, dmg: "1d6 + poison (2d8, difficulté 15" }],
  caps: []
},

{
  id: "arthropode_enorme", nom: "Arthropode (Énorme)", cat: "fantastique", nc: 8, ncLabel: "8",
  type: "Créature fantastique", taille: "Énorme", env: ["ruines"],
  car: { AGI: [2, 1], CON: [10, 1], FOR: [10, 1], PER: [2], CHA: [-4], INT: [-4], VOL: [0] },
  def: 24, pv: 130, init: 12,
  att: [{ n: "Pinces", mod: 13, dmg: "2d12+10" }, { n: "Dard", mod: 13, dmg: "1d8 + poison (2d10," }, { n: "Pinces", mod: 16, dmg: "2d6+12 Dard +16 · DM 1d10 + poison (2d12, diffi- culté 20 pour ½ · DM)", note: "2 attaques" }],
  caps: []
},

{
  id: "serpent_geant", nom: "Serpent Géant", cat: "fantastique", nc: 5, ncLabel: "5",
  type: "Créature fantastique", taille: "Énorme", env: ["foret", "plaine", "montagne", "arctique"],
  desc: "Le serpent géant classique est un serpent constricteur de plus de 15 m de long pourvu d’un corps plus épais que celui d’un homme, tel celui rencontré par Conan dans la tour de l’Éléphant.",
  car: { AGI: [0], CON: [8], FOR: [8, 1], PER: [0], CHA: [-2], INT: [-4], VOL: [0] },
  def: 20, pv: 70, init: 10,
  att: [],
  caps: [{ n: "Étreinte", d: "Chaque fois que le serpent réussit une attaque, la cible doit réussir un test de FOR ou d’AGI (au choix) difficulté 15. En cas d’échec, le serpent s’enroule autour d’elle et com- mence à l’étouffer, infligeant automatique- ment +1d8 DM par tour. La victime est immobilisée ; elle peut tenter de se libérer au prix d’une action de mouvement à chaque tour, en réussissant un test de FOR difficulté 20. W WSERPENT GÉANT MYTHIQUE | NC 12 CRÉATURE VIVANTE TAILLE COLOSSALE | AGI +0 | CON +10 | FOR +12* | PER +2 | | CHA -2 | INT -3 | VOL +2 | (S)DEF 28 (V)PV 200 (RD 6) (I)Init. 12 Morsure +16 · DM 2d10+12 Coup de queue +10 DM 2d6+12" }, { n: "Colossal", d: "La créature bénéficie d’une RD 6 du fait de sa taille." }, { n: "Gober", d: "Lorsque le serpent réussit une attaque avec un résultat de 15-20 au d20, il peut avaler entièrement une cible de taille grande ou inférieure. Si la victime échoue à un test de FOR difficulté 22, elle passe directement dans l’estomac du monstre. Un PJ avalé subit 3d10 DM d’asphyxie et d’acide par round. Il peut attaquer avec une arme pas plus grande qu’une dague en réussissant un test de FOR difficulté 15 à chaque attaque. L’attaque se fait avec un dé malus et les DM sont divisés par deux." }, { n: "Fauchage", d: "Lorsque le serpent réussit une attaque de queue avec un résultat de 15-20 au d20, si la victime est de taille moyenne ou inférieure, elle est projetée à 1d6+1 m de là et subit +2d10 DM. Elle est renversée et doit réussir un test de CON difficulté 15 ou être étourdie pour 1 round. Si la victime est de taille grande ou supérieure, elle doit réussir un test de FOR ou d’AGI (au choix) difficulté 22 ou être renversée." }, { n: "Balayage", d: "Lorsqu’il attaque avec sa queue, le serpent peut viser deux créatures à son contact d’un seul coup. Il ne fait qu’un seul test d’attaque pour les deux cibles. S'il réussit, la cible secondaire (désignée par le MJ) ne subit que la moitié des DM (et elle ne subit pas d’effet supplémentaire comme Fauchage ou Projection). ANIMAUX PRÉHISTORIQUES" }]
},

{
  id: "deinonychus", nom: "Deinonychus", cat: "animal", nc: 2, ncLabel: "2",
  type: "Animal", taille: "Moyenne", env: ["foret", "plaine", "marais"],
  desc: "Ce reptile préhistorique, cousin de poche du fameux tyrannosaure, pèse environ 75 kg pour 3 m de long, queue comprise. Carnivore, il attaque généralement en meute.",
  car: { AGI: [2, 1], CON: [3], FOR: [3, 1], PER: [2, 1], CHA: [-2], INT: [-3], VOL: [0] },
  def: 15, pv: 15, init: 15,
  att: [{ n: "Morsure", mod: 4, dmg: "1d6+3" }],
  caps: [{ n: "Ergots", d: "Lorsque le deinonychus réussit une attaque de morsure avec un résultat de 15-20 au d20, il saute sur sa victime et inflige aussi une attaque d’ergots (attaque gratuite supplémentaire, mêmes dommages). En cas de réussite, la cible doit faire un test de FOR difficulté 13 ou être renversée." }, { n: "Interchangeable", d: "Tant que le deinonychus et ses alliés sont plus nombreux que la cible, ils se relaient pour esquiver ses attaques. Ils bénéficient d’un bonus de +3 en DEF. Si plusieurs deinonychus sont au contact d’un PJ et que celui-ci réussit une attaque, le MJ désigne celui qui est touché (le PJ ne sait jamais lequel il blesse)." }, { n: "Rapide", d: "Le deinonychus se déplace de 15 m par action de mouvement." }]
},

{
  id: "diplodocus", nom: "Diplodocus", cat: "animal", nc: 12, ncLabel: "12",
  type: "Animal", taille: "Colossale", env: ["ruines"],
  desc: "Avec 25 m pour environ 25 t, le diplodocus est un géant parmi les géants. Heureusement, il s’agit d’un herbivore plutôt placide. Mais comme toute créature, il peut devenir agressif s’il se sent menacé ou si ses petits sont en danger.",
  car: { AGI: [0], CON: [15], FOR: [15, 1], PER: [0], CHA: [-2], INT: [-4], VOL: [-2] },
  def: 28, pv: 220, init: 10,
  att: [{ n: "Piétinement", mod: 15, dmg: "2d10+15" }, { n: "Coup de queue", mod: 15, dmg: "1d10+15" }],
  caps: [{ n: "Balayage", d: "Lorsqu’il réalise une attaque de queue, le diplodocus peut viser deux créatures à son contact d’un seul coup. Il ne fait qu’un seul test d’attaque pour les deux cibles. Si les deux sont touchées, la cible secondaire (désignée par le MJ) ne subit que la moitié des DM." }, { n: "Colossal", d: "Le diplodocus bénéficie d’une RD 6 du fait de sa taille." }, { n: "Projection", d: "Lorsque le diplodocus réussit une attaque de queue avec un résultat de 17-20 au d20, la victime est projetée à 1d6+1 m de là et subit +2d10 DM. Elle est renversée, et si elle échoue à un test de CON difficulté 15, elle est étourdie pour 1 round." }, { n: "Piétinement", d: "Lorsque le diplodocus réussit une attaque de piétinement avec un résultat de 17-20 au d20, la victime est renversée et subit +2d10 DM." }]
},

{
  id: "mammouth", nom: "Mammouth", cat: "animal", nc: 8, ncLabel: "8",
  type: "Animal", taille: "Énorme", env: ["foret", "montagne"],
  desc: "De la même famille que les éléphants, le mammouth est un pachyderme plus grand et plus puissant, doté d’une épaisse fourrure.",
  car: { AGI: [0], CON: [12, 1], FOR: [12, 1], PER: [1], CHA: [-2], INT: [-4], VOL: [0] },
  def: 22, pv: 110, init: 11,
  att: [{ n: "Trompe et défenses", mod: 14, dmg: "2d10+14" }],
  caps: [{ n: "Charge", a: "L", d: "Le mammouth parcourt une distance maximale de 20 m et réalise une attaque avec un dé bonus. Si l’attaque est réussie, en plus des DM normaux, une victime de taille énorme ou inférieure doit faire un test de FOR diffi- culté 22 ou être renversée. Dans ce cas, le mammouth piétine sa victime et les DM sont doublés." }, { n: "Colossal", d: "Le mammouth bénéficie d’une RD 3 du fait de sa taille." }, { n: "Projection", d: "Lorsque le mammouth réussit une attaque avec un résultat de 15-20 au d20, la victime est projetée à 1d6+1 m de là et subit +2d8 DM. Elle est renversée, et si elle échoue à un test de CON difficulté 15, elle est étourdie pour 1 round." }, { n: "Teigneux", d: "Si le mammouth rate une attaque, il bénéficie d’un dé bonus et de +2d8 DM pour la prochaine." }]
},

{
  id: "ours_prehistorique", nom: "Ours Préhistorique", cat: "fantastique", nc: 8, ncLabel: "8",
  type: "Créature fantastique", taille: "Énorme", env: ["foret", "montagne"],
  desc: "Dans les régions les plus reculées et les plus sauvages des Terres d’Osgild, dans des forêts profondes ou des vallées montagneuses isolées de tout, on peut encore rencontrer de rares spécimens d’ours préhistorique.",
  car: { AGI: [0], CON: [11, 1], FOR: [11], PER: [2], CHA: [-2], INT: [-4], VOL: [2] },
  def: 22, pv: 110, init: 10,
  att: [{ n: "Morsure et griffes", mod: 12, dmg: "2d12+11" }],
  caps: [{ n: "Charge", a: "L", d: "L’ours parcourt une distance maximale de 20 m et réalise une attaque avec un dé bonus. Si l’at- taque est réussie, en plus des DM normaux, une victime de taille énorme ou inférieure doit faire un test de FOR difficulté 21 ou être renversée. Dans ce cas, l’ours saisit sa victime entre ses puissantes pattes et referme sa mâchoire sur son crâne : les DM sont doublés." }, { n: "Colossal", d: "L’ours bénéficie d’une RD 3 du fait de sa taille." }, { n: "Dévorer", d: "Lorsque la créature réussit une attaque avec un résultat de 15-20 au d20, elle saisit sa proie entre ses crocs ou ses griffes et lui inflige immédiatement une attaque gratuite supplémentaire." }, { n: "Enragé", d: "Lorsqu’il reçoit un coup critique, l’ours devient enragé. Il ignore les pénalités de douleur ou la peur, et bénéficie de +3 en attaque au contact et +1d6 DM. Il peut encore agir un tour com- plet après avoir atteint 0 PV." }]
},

{
  id: "pteranodon", nom: "Ptéranodon", cat: "fantastique", nc: 7, ncLabel: "7",
  type: "Créature fantastique", taille: "Énorme", env: ["arctique"],
  desc: "Doté d’une envergure de 10 m, le ptéranodon des Terres d’Osgild est capable d’emporter une créature de taille humaine dans les airs ou de la décapiter d’un seul claquement de son bec pourvu de dents aiguisées.",
  car: { AGI: [3, 1], CON: [8], FOR: [7], PER: [2, 1], CHA: [-2], INT: [-4], VOL: [1] },
  def: 21, pv: 90, init: 15,
  att: [{ n: "Serres et bec", mod: 11, dmg: "1d10+7", note: "2 attaques" }],
  caps: [{ n: "Vol rapide", d: "Le ptéranodon obtient une action de mouve- ment supplémentaire par round lorsqu’il est en vol. Au premier round de combat, s’il est en vol et attaque une créature au sol, il bénéfi- cie d’un dé bonus en attaque et +1d6 DM." }, { n: "Agripper", d: "Lorsque le ptéranodon réussit une attaque avec un résultat de 17-20 au d20, il agrippe sa proie et ne la lâche plus. Il obtient +5 en attaque et +1d6 DM contre elle. La cible est immobilisée si elle est de taille inférieure ; une fois par round, elle peut essayer de se libérer au prix d’une action de mou- 1 vement en réussissant un test de FOR difficulté 17." }, { n: "Emporter dans les airs", d: "Le ptéranodon peut emporter dans les airs une victime agrippée de taille moyenne ou infé- rieure au prix d’une action de mouvement. Au premier round, si la victime se libère (test de FOR, voir Agripper), elle subit, 4d4° DM de chute. Aux rounds suivants, si le ptéranodon prend de l’altitude, les DM passent à 7d4°, puis 10d4°. Le dé évolutif des DM de chute est indexé sur le niveau de la victime." }]
},

{
  id: "rhinoceros_laineux", nom: "Rhinocéros Laineux", cat: "fantastique", nc: 7, ncLabel: "7",
  type: "Créature fantastique", taille: "Énorme", env: ["plaine", "souterrain"],
  desc: "Le rhinocéros laineux est l’énorme ancêtre préhistorique du rhinocéros moderne, adapté à la survie dans le grand froid. Sa corne lui sert à creuser la neige et la glace pour trouver de la nourriture. La bête est hargneuse et charge sans provocation !",
  car: { AGI: [0], CON: [10, 1], FOR: [10, 1], PER: [0], CHA: [-2], INT: [-4], VOL: [2] },
  def: 21, pv: 90, init: 10,
  att: [{ n: "Corne", mod: 12, dmg: "2d10+12" }],
  caps: [{ n: "Charge", a: "L", d: "Le rhinocéros parcourt une distance maximale de 20 m et réalise une attaque avec un dé bonus. Si l’attaque est réussie, en plus des DM normaux, une victime de taille énorme ou inférieure doit faire un test de FOR diffi- culté 18 ou être renversée. Dans ce cas, le rhinocéros piétine sa victime et les DM sont doublés." }, { n: "Enragé", d: "Lorsqu’il reçoit un coup critique, le rhinocéros devient enragé. Il ignore les pénalités de dou- leur ou la peur, et bénéficie de +3 en attaque au contact et +1d6 DM. Il peut encore agir un tour complet après avoir atteint 0 PV." }, { n: "Projection", d: "Lorsque le rhinocéros réussit une attaque avec un résultat de 15-20 au d20, la victime est pro- jetée à 1d6+1 m de là et subit +2d6 DM. Elle est renversée, et si elle échoue à un test de CON difficulté 15, elle est étourdie pour 1 round." }]
},

{
  id: "stegosaure", nom: "Stégosaure", cat: "fantastique", nc: 6, ncLabel: "6",
  type: "Créature fantastique", taille: "Énorme", env: ["foret"],
  desc: "Le stégosaure est un herbivore massif et court sur pattes. Il possède une double rangée de grandes écailles osseuses qui forment une crête sur son échine. Sa queue puissante est armée soit de longues pointes, soit d’une masse compacte d’os, selon les espèces.",
  car: { AGI: [0], CON: [8, 1], FOR: [8, 1], PER: [1], CHA: [-2], INT: [-4], VOL: [0] },
  def: 21, pv: 90, init: 11,
  att: [{ n: "Coup de queue", mod: 11, dmg: "2d12+8" }],
  caps: [{ n: "Balayage", d: "Le stégosaure utilise sa queue pour viser deux créatures à son contact d’un seul coup. Il ne fait qu’un seul test d’attaque pour les deux cibles. Si les deux sont touchées, la cible secondaire (désignée par le MJ) ne subit que la moitié des DM (et elle ne subit pas d’effet de projection)." }, { n: "Colossal", d: "Le stégosaure bénéficie d’une RD 3 du fait de sa taille." }, { n: "Projection", d: "Lorsque le stégosaure réussit une attaque avec un résultat de 15-20 au d20, la victime doit réussir au choix un test de FOR ou d’AGI difficulté 18, sinon elle est projetée à 1d6+1 m de là et subit +2d6 DM. Elle est renversée, et si elle échoue à un test de CON difficulté 15, elle est étourdie pour 1 round." }]
},

{
  id: "tigre_a_dents_de_sabre", nom: "Tigre À Dents De Sabre", cat: "fantastique", nc: 6, ncLabel: "6",
  type: "Créature fantastique", taille: "Grande", env: ["ruines"],
  desc: "Ce profil correspond à une vision fantastique du tigre préhistorique, aussi appelé tigre à dents de sabre ou encore smilodon. Il mesure environ 2 m au garrot pour 4 m de long (sans la queue) et son poids avoisine la tonne.",
  car: { AGI: [4, 1], CON: [8], FOR: [8, 1], PER: [1, 1], CHA: [-3], INT: [-4], VOL: [2] },
  def: 21, pv: 90, init: 17,
  att: [{ n: "Morsure et griffes", mod: 12, dmg: "2d10+12" }],
  caps: [{ n: "Embuscade", d: "Au premier round de combat, si l’environne- ment permet au tigre de se dissimuler, la cible doit réussir un test de PER difficulté 19 ou être surprise. S’il attaque avec succès une cible surprise, le tigre lui inflige +1d6 DM. Si la FOR de la cible est inférieure à la sienne, elle est alors renversée. Le tigre bénéficie de +5 à tous ses tests de discrétion." }, { n: "Dévorer", d: "Lorsque le tigre réussit une attaque avec un résultat de 15-20 au d20, il saisit sa proie entre ses crocs ou ses griffes et lui inflige immédiate- ment une attaque gratuite supplémentaire." }]
},

{
  id: "triceratops", nom: "Tricératops", cat: "fantastique", nc: 10, ncLabel: "10",
  type: "Créature fantastique", taille: "Énorme", env: ["ruines"],
  desc: "Puissant dinosaure herbivore pourvu de trois cornes et d’une tête protégée par une impressionnante collerette osseuse, le tricératops pèse jusqu’à 12 t pour 9 m de long. Il est territorial est agressif, tout à fait capable de charger un tyrannosaure.",
  car: { AGI: [-1], CON: [12, 1], FOR: [12, 1], PER: [-1], CHA: [-2], INT: [-4], VOL: [2] },
  def: 25, pv: 160, init: 9,
  att: [{ n: "Cornes", mod: 14, dmg: "4d8+16" }],
  caps: [{ n: "Charge", a: "L", d: "Le tricératops parcourt une distance maximale de 20 m et réalise une attaque avec un dé bonus. Si l’attaque est réussie, en plus des DM normaux, une victime de taille énorme ou inférieure doit réussir un test de FOR difficulté 22 ou être renversée. Dans ce cas, il piétine sa victime et les DM sont doublés." }, { n: "Tape dur", d: "Lors d’un test d’attaque, le tricératops réussit automatiquement s’il obtient 15-20 au d20. De plus, la cible doit réussir un test de CON difficulté 22 ou être étourdie pendant 1 round." }, { n: "Enragé", d: "Lorsqu’il reçoit un coup critique, le tricératops devient enragé. Il ignore les pénalités de dou- leur ou la peur, et bénéficie de +3 en attaque au contact et +1d10 DM. Il peut encore agir un tour complet après avoir atteint 0 PV." }, { n: "Peau épaisse", d: "Le tricératops obtient une RD 3 contre tous les DM physiques." }]
},

{
  id: "tyrannosaure", nom: "Tyrannosaure", cat: "animal", nc: 10, ncLabel: "10",
  type: "Animal", taille: "Énorme", env: ["ruines"],
  desc: "Même s’il fait seulement le poids d’un gros éléphant, voire un peu plus (7 à 10 t), le tyrannosaure est un prédateur bien plus dangereux. Il est à la fois rapide et agile pour son poids, et il est pourvu d’une mâchoire absolument terrifiante.",
  car: { AGI: [2, 1], CON: [11], FOR: [11, 1], PER: [2, 1], CHA: [-2], INT: [-4], VOL: [3] },
  def: 25, pv: 170, init: 15,
  att: [{ n: "Morsure", mod: 15, dmg: "4d8+18" }],
  caps: [{ n: "Dévorer", d: "Lorsque le tyrannosaure réussit une attaque avec un résultat de 15-20 au d20, il saisit sa proie dans sa gueule et lui inflige immédiate- ment une attaque gratuite supplémentaire." }, { n: "Teigneux", d: "Si le tyrannosaure rate une attaque, il béné- ficie d’un dé bonus et de +2d10 DM pour la prochaine." }, { n: "Rapide", d: "Le tyrannosaure se déplace de 15 m par action de mouvement." }]
},

{
  id: "arachneen", nom: "Arachnéen", cat: "fantastique", nc: 7, ncLabel: "7",
  type: "Créature fantastique", taille: "Grande", env: ["souterrain"],
  desc: "Un arachnéen possède le buste d’un huma- noïde, généralement celui d’un elfe des pro- fondeurs, et le corps d’une araignée géante.",
  car: { AGI: [4, 1], CON: [5], FOR: [5], PER: [2], CHA: [-2], INT: [2], VOL: [4] },
  def: 20, pv: 80, init: 17,
  att: [{ n: "Arme", mod: 11, dmg: "1d8+5 + 1d6", note: "2 attaques" }, { n: "Attaque magique", mod: 11 }],
  caps: [{ n: "Embuscade", d: "Au premier round de combat, dans un environnement permettant à l’arachnéen de se dissimuler, la cible doit réussir un test de PER difficulté 19 ou être surprise. S’il attaque avec succès une cible surprise, l’arachnéen lui inflige +1d6 DM. Si la FOR de la cible est inférieure à la sienne, elle est alors renversée. L’arachnéen bénéficie de +5 à tous ses tests de discrétion." }, { n: "Mage de combat", d: "L’arachnéen peut lancer chaque sort de la voie de la destruction (magicien) et de la voie de la sombre magie (sorcier) jusqu’au rang 3, 3 fois par combat. Il peut lancer un sort par round en remplacement de l’une de ses attaques d’arme (il peut effectuer la 2)." }, { n: "Poison", d: "Si elle rate un test de CON difficulté 15, la victime est affaiblie jusqu’à ce qu’elle termine une récupération rapide." }, { n: "Résistance à la magie", d: "L’arachnéen obtient +5 en DEF et à tous les tests pour résister à la magie. TOILE D’ARAIGNÉE : L’arachnéen est capable de filer une toile gluante et de se déplacer dessus. Un person- nage qui se retrouve en contact avec cette toile doit faire un test de FOR difficulté 15 ou être pour le round. L’arachnéen est aussi capable de se déplacer sur les surfaces verti- cales comme au sol." }]
},

{
  id: "scorpionide", nom: "Scorpionide", cat: "fantastique", nc: 5, ncLabel: "5",
  type: "Créature fantastique", taille: "Grande", env: ["souterrain"],
  car: { AGI: [3, 1], CON: [5], FOR: [5], PER: [1], CHA: [-2], INT: [-1], VOL: [4] },
  def: 20, pv: 70, init: 11,
  att: [{ n: "Arme à 2 mains", mod: 10, dmg: "2d6+5 Pinces +10 · DM 1d8+5 Queue +10 · DM 1d4 + venin" }],
  caps: [{ n: "Venin", d: "La victime subit 2d6 DM de poison et doit faire un test de CON difficulté 15. En cas d’échec, elle est affaiblie jusqu’à ce qu’elle termine une récupération rapide." }, { n: "Déplacement vertical", d: "Le scorpionide est capable de se déplacer sur les surfaces verticales comme au sol." }]
},

{
  id: "arachnoide", nom: "Arachnoïde", cat: "humanoide", nc: 3, ncLabel: "3",
  type: "Humanoïde", taille: "Moyenne", env: ["ruines"],
  desc: "Un arachnoïde est une abomination de forme vaguement humanoïde, mais apparentée aux arai- gnées.",
  car: { AGI: [2, 1], CON: [1], FOR: [2], PER: [4, 1], CHA: [-1], INT: [-2], VOL: [0] },
  def: 16, pv: 30, init: 17,
  att: [{ n: "Morsure", mod: 7, dmg: "1d4+2" }, { n: "+ poison Griffes", mod: 7, dmg: "1d6+2" }],
  caps: [{ n: "Toiles", a: "M", d: "Sur un test d’attaque réussi (por- tée 5 m), l’arachnoïde crache une nuée de filaments collants. La cible doit réussir un test d’AGI diffi- culté 15 ou subir un malus de -2 à tous ses tests (cumulable si l’effet est subi plusieurs fois). Il faut 5 min pour se débarrasser de chaque couche de filaments collants. Si on met le feu aux filaments, la cible subit 1d6 DM par couche, mais elle est libérée immédiate- ment. Si l’arachnoïde crache des filaments, il ne peut pas utiliser son attaque de morsure au même round." }, { n: "Maître des toiles", d: "L’arachnoïde peut se déplacer à sa guise sur les toiles d’araignée, et il détecte toutes les créatures en contact avec la même toile que lui. PATTES D’ARAIGNÉE : L’arachnoïde peut escalader les surfaces verti- cales et les plafonds la tête en bas." }, { n: "Poison", d: "En cas d’échec à un test de CON difficulté 10, la victime est affaiblie pendant 1d6 min. Si elle subit un nouvel empoisonnement du même type durant cette période, elle sombre dans l’inconscience pour 1d6 min." }, { n: "Camouflage", d: "L’arachnoïde obtient +10 aux tests de camou- flage. Au premier round de combat, s’il est immobile, sa cible doit réussir un test de PER (vigilance) difficulté 20 ou être surprise. ARME ET ARMURE ANIMÉES Grâce à la magie, certains objets peuvent être animés pour servir leur maître, et en particulier le défendre. Ainsi, une simple épée posée sur une table attaquera soudain tout être entrant dans une pièce. De même, une armure peut être animée par magie, généralement dans le but de garder un lieu. Un peu plus puissant, le garde animé est une armure animée par un mage pour le protéger, ou protéger une autre personne. Son avantage : il est infatigable et veille à toute heure du jour et de la nuit." }]
},

{
  id: "arme_animee", nom: "Arme Animée", cat: "fantastique", nc: 2, ncLabel: "2",
  type: "Créature fantastique", taille: "Moyenne", env: ["ruines"],
  car: { AGI: [4, 1], CON: [0], FOR: [0], PER: [0, 1], CHA: [-4], INT: [-4], VOL: [6] },
  def: 16, pv: 10, init: 13,
  att: [{ n: "Hallebarde", mod: 6, dmg: "1d12" }],
  caps: [{ n: "Vol rapide", d: "Une arme animée bénéficie d’une action de mouvement supplémentaire par tour." }, { n: "Imparable", d: "Lors d’un test d’attaque, l’arme réussit automa- tiquement si elle obtient 15-20 au d20. Elle inflige alors +2d4 DM." }, { n: "Solide", d: "L’arme animée bénéficie d’une RD 6 contre les armes." }]
},

{
  id: "armure_animee", nom: "Armure Animée", cat: "fantastique", nc: 3, ncLabel: "3",
  type: "Créature fantastique", taille: "Moyenne", env: ["ruines"],
  car: { AGI: [0], CON: [3], FOR: [3, 1], PER: [2, 1], CHA: [-4], INT: [-4], VOL: [6] },
  def: 18, pv: 30, init: 15,
  att: [{ n: "Coups", mod: 6, dmg: "1d6+3" }],
  caps: [{ n: "Résistance", d: "L’armure animée divise par 2 tous les DM des sorts. Lorsqu’elle est réduite à 0 PV, elle peut encore agir un tour complet." }, { n: "Solide", d: "L’arme animée bénéficie d’une RD 6 contre les armes." }]
},

{
  id: "garde_anime", nom: "Garde Animé", cat: "fantastique", nc: 6, ncLabel: "6",
  type: "Créature fantastique", taille: "Grande", env: ["foret", "marais", "urbain", "ruines"],
  car: { AGI: [0], CON: [5], FOR: [5], PER: [0], CHA: [-3], INT: [-3], VOL: [6] },
  def: 20, pv: 100, init: 10,
  att: [{ n: "Coups de poing", mod: 11, dmg: "1d6+5", note: "2 attaques" }],
  caps: [{ n: "Inamovible", d: "Le garde animé est immunisé aux états préjudi- ciables surpris, immobilisé et renversé, et il ne peut être désarmé. De plus, il ne subit aucun DM de la capacité Attaque sournoise (voleur) ou d’autres capacités similaires." }, { n: "Garde du corps", d: "Chaque round, le garde animé peut désigner gratuitement une cible à son contact (ce peut être une créature ou un objet), qui bénéficie alors d’une RD 6." }, { n: "Rétribution", d: "Si la cible désignée par la capacité Garde du corps est attaquée à ce round, le garde animé obtient un dé bonus et +1d6 DM pour ses attaques contre l’auteur de l’attaque au cours du même round." }]
},

{
  id: "banshee", nom: "Banshee", cat: "fantastique", nc: 10, ncLabel: "10",
  type: "Créature fantastique", taille: "Moyenne", env: ["urbain"],
  desc: "La banshee ressemble à la femme qu’elle était de son vivant, mais son apparence est cadavé- rique, translucide et dépourvue de couleur. Son regard est un puits sans fond de haine et de terreur, qui met à rude épreuve celui qui le croise.",
  car: { AGI: [5], CON: [10, 1], FOR: [0], PER: [2, 1], CHA: [2], INT: [2], VOL: [6] },
  def: 24, pv: 100, init: 15,
  att: [{ n: "Toucher", mod: 13, dmg: "3d8 + contact", note: "2 attaques" }, { n: "mortel Projection d’objets", mod: 13, dmg: "2d4 à 2d8" }],
  caps: [{ n: "Attaques multiples", d: "À son tour, la banshee peut faire 2 attaques en action d’attaque et une projection d’objet en action de mouvement." }, { n: "Contact mortel", d: "Une créature touchée par la banshee doit réussir un test de CON difficulté 15 ou être affaiblie pour 1d6 min." }, { n: "Cri terrifiant", d: "Une fois par combat, la banshee émet un hurlement de haine insupportable. Toutes les créatures vivantes dans un rayon de 20 m autour d’elle doivent réussir un test de VOL difficulté 15 ou fuir pendant 1d6 rounds. Si la victime obtient un résultat inférieur ou égal à 5 au d20, ses cheveux blanchissent d’un coup sous l’effet de la terreur (permanent ; cela arrive même à un adversaire vivant immunisé à la peur)." }, { n: "Immortelle", d: "La nuit, la banshee récupère tous ses PV en prenant une récupération rapide (30 min). Lorsqu’elle tombe à 0 PV, la banshee n’est pas définitivement détruite ; elle est juste chassée et pourra se reconstituer en 24 h. Il faut mettre un terme à la cause de la malédiction pour mettre fin à cette capacité." }, { n: "Intangible", d: "Un fantôme peut passer à travers les murs et les objets comme s’ils n’existaient pas. Il ne peut pas traverser les objets magiques ou organiques, ni les créatures. RÉDUCTION DES DM (+0 À +1 NC) : La banshee bénéficie d’une RD 10 (sauf magie)." }, { n: "Sentir la vie", d: "La banshee peut détecter le battement d’un cœur à une distance de 30 m, et ainsi combattre à l’aveuglette sans pénalité, même dans une zone de ténèbres magiques." }, { n: "Télékinésie", a: "M", d: "La banshee peut déplacer les objets par sa force psychique à une portée de 20 m. Elle peut soulever une masse allant jusqu’à environ 200 kg ou plusieurs petits objets. Selon la nature des objets, cette attaque peut infliger 2d4 à 2d8 DM. Elle peut projeter un adversaire à une distance de 10 m en emportant un test opposé d’attaque magique. Elle inflige 3d10 DM et la cible est renversée." }, { n: "Ténèbres", a: "M", d: "Une fois par combat, la banshee peut créer une zone de ténèbres magiques de 10 m de rayon autour d’elle. La vision nocturne n’est d’aucune utilité dans les ténèbres magiques et les PJ sont aveuglés. BARGHEST Un barghest ressemble à un loup (ou un chien) massif et puissant. Ses yeux sont rougeoyants, ses muscles et sa mâchoire sont hypertrophiés, et de grosses veines noires roulent sous son pelage. Un druide ou un rôdeur identifie immédiate- ment que la créature est corrompue par le mal, même si elle est plus difficile à identifier lors- qu’elle possède le corps d’un worg. Écologie Pour la plupart des gens, le barghest est sim- plement une sorte de loup maléfique capable de s’introduire jusque dans les villages isolés pour dévorer ses habitants. Mais en réalité, il s’agit d’un esprit maléfique désincarné qui parasite les meutes de canidés (loups et chiens) afin d’en faire de simples outils pour son objectif final : se repaître de l’âme de victimes humanoïdes. Les barghests possèdent parfois aussi des worgs afin de se mêler aux tribus de gobelins, dont ils prennent alors le contrôle, ce qui rend ces tribus soudainement beaucoup plus agressives et plus dangereuses qu’à l’accoutumée. En cas de disette, ils se nourrissent sur la tribu sur laquelle ils ont pris l’ascendant, mais leur mets préféré reste les humains ou les elfes. Bien que puissants, les barghests préfèrent envoyer leur meute subir le premier choc du combat avant d’intervenir personnellement. Si un barghest est forcé à fuir ou à changer d’hôte, il se montre rancunier, et assez maléfique pour attendre le moment propice à la vengeance en s’attaquant à des innocents. Le barghest voit parfaitement dans le noir, même total (mais pas dans les ténèbres magiques). Il comprend et parle toutes les langues des créa- tures dont il a dévoré l’âme (souvent le noir-par- ler, le commun et l’elfe)." }]
},

{
  id: "chien_barghest", nom: "Chien Barghest", cat: "fantastique", nc: 3, ncLabel: "3",
  type: "Créature fantastique", taille: "Grande", env: ["marais"],
  car: { AGI: [1, 1], CON: [3], FOR: [2, 1], PER: [2], CHA: [2], INT: [2], VOL: [2] },
  def: 14, pv: 30, init: 12,
  att: [{ n: "Morsure", mod: 6, dmg: "1d6+2", note: "2 attaques" }, { n: "Attaque magique", mod: 6 }],
  caps: [{ n: "Aura maléfique", a: "L", d: "Le barghest peut charmer les créatures maléfiques par son aura ténébreuse jusqu’à un NC inférieur au sien et une INT de +1. Il doit pour cela réussir un test opposé d’attaque magique contre sa cible. En cas de réussite, elle se met à son service aussi longtemps que le barghest maintient son emprise. BRISE-GENOU : Si un adversaire au contact tente de s’éloigner du barghest, celui-ci obtient une attaque de contact gratuite contre lui. Si cette attaque est réussie, en plus des DM habituels, la cible doit réussir un test de CON difficulté 15 ou diviser par deux tous ses déplacements pour le reste du combat. CHANGEMENT D’HÔTE : Lorsque le loup (ou le chien) qui accueille le barghest est tué, son esprit peut changer d’hôte. Au moment de sa mort, la créature exhale une haleine noire et émet une infâme puanteur. La seule façon de tuer définiti- vement le barghest consiste à lancer le sort Délivrance (prêtre, rang 3) durant le round où le barghest est réduit à 0 PV. Sinon, la créature prend possession du loup ou du chien le plus proche. Toutefois, lorsque cela arrive, la créature est affaiblie jusqu’à la prochaine pleine lune et elle prend généralement la fuite pour reconstituer ses forces. Elle a perdu tous les avantages que lui procurait l’ingestion des âmes de ses victimes." }, { n: "Chef de meute", d: "Le barghest donne +2 en Init., en attaque et aux DM à tous les loups de sa meute à portée de vue. De plus, s’il attaque en même temps qu’un autre loup, il réalise une attaque avec un dé bonus et +2d4° DM. DÉVORER L’ÂME (L) : Lorsqu’il a réduit une proie humanoïde intelli- gente à 0 PV, le barghest peut tenter de dévo- rer son âme. Pour cela, il ouvre une gueule démesurée et place ses mâchoires autour du crâne de sa victime. La cible doit réussir un test de VOL difficulté 10 chaque round tant que le barghest poursuit la manœuvre. En cas d’échec, son âme est ingérée et elle ne peut plus être ramenée à la vie, même par magie. Le barghest récupère immédiatement tous ses PV (toutes les blessures infligées se referment). Lorsque le barghest a ingéré 10 créatures de cette façon, son NC augmente de 1 et il gagne +2 en attaque, +1d6 DM, +20 PV et +1 en VOL. Il grossit d’une trentaine de kilo- grammes. Il peut bénéficier de cette augmen- tation jusqu’à 3 fois." }, { n: "Passage sans traces", d: "Le barghest ne laisse aucune piste et gagne +5 à tous les tests de discrétion." }, { n: "Résistance aux armes", d: "Le barghest bénéficie d’une RD 5 sauf contre le feu et les armes bénies/sacrées." }, { n: "Téléportation", a: "L", d: "Le barghest disparaît puis réapparaît à un autre endroit situé à moins de 80 m, jusqu’à 3 fois par combat. Le lieu d’arrivée doit être soit en ligne de vue, soit parfaitement connu par le barghest." }]
},

{
  id: "loup_barghest", nom: "Loup Barghest", cat: "fantastique", nc: 4, ncLabel: "4",
  type: "Créature fantastique", taille: "Grande", env: ["urbain"],
  car: { AGI: [1, 1], CON: [5], FOR: [4, 1], PER: [2], CHA: [2], INT: [2], VOL: [2] },
  def: 17, pv: 50, init: 12,
  att: [{ n: "Morsure", mod: 8, dmg: "1d6+4", note: "2 attaques" }, { n: "Attaque magique", mod: 8 }],
  caps: []
},

{
  id: "worg_barghest", nom: "Worg Barghest", cat: "fantastique", nc: 5, ncLabel: "5",
  type: "Créature fantastique", taille: "Grande", env: ["marais", "souterrain", "urbain"],
  car: { AGI: [1], CON: [7], FOR: [6, 1], PER: [2, 1], CHA: [2], INT: [2], VOL: [2] },
  def: 19, pv: 70, init: 12,
  att: [{ n: "Morsure", mod: 10, dmg: "1d6+6", note: "2 attaques" }, { n: "Attaque magique", mod: 10 }],
  caps: []
},

{
  id: "bete_du_chaos", nom: "Bête Du Chaos", cat: "fantastique", nc: 4, ncLabel: "4",
  type: "Créature fantastique", taille: "Grande", env: ["plaine", "marais", "souterrain", "arctique", "urbain"],
  desc: "La silhouette de la bête du chaos ressemble à un humanoïde auquel il manquerait toute la partie inférieure.",
  car: { AGI: [2], CON: [2], FOR: [3], PER: [2, 1], CHA: [-4], INT: [-1], VOL: [2] },
  def: 18, pv: 55, init: 15,
  att: [{ n: "Morsure", mod: 8, dmg: "2d6+3" }, { n: "Dard", mod: 8, dmg: "1d6+3 + harpon" }],
  caps: [{ n: "Camouflage", d: "Si la créature peut se cacher dans une étendue d’eau sale, la victime doit faire un test de PER (vigilance) difficulté 17 ou être surprise. Dans ce cas, la bête du chaos peut l’attaquer (dard) avec un dé bonus." }, { n: "Harpon", d: "Lorsque la bête du chaos réussit une attaque avec un résultat de 15-20 au d20, le dard embroche sa victime et s’ouvre dans la plaie. Dans ce cas, la victime est immobilisée et subit +1d6 DM par round (la bête ne fait plus d’attaque de dard). Pour se débarrasser du dard, il faut tuer la bête ou infliger 20 DM à la queue (la créature ne perd alors que 5 PV, mais son attaque de dard disparaît)." }, { n: "Yeux toxiques", d: "Chaque fois que la bête du chaos est blessée par une attaque de contact, l’attaquant doit réaliser un test d’AGI difficulté 10. En cas d’échec, il lui crève un œil et reçoit une pro- jection d’acide qui lui inflige 1d6 DM. Il est possible d’éviter de frapper les yeux en s’im- posant un malus de -5 en attaque (DEF 23)." }]
},

{
  id: "carnifurax", nom: "Carnifurax", cat: "fantastique", nc: 0, ncLabel: "0",
  type: "Créature fantastique", taille: "Très petite", env: ["urbain"],
  desc: "« Un lapin ? Vous êtes sérieuse- ment en train de me dire qu’un lapin vous a mis en fuite ? — Mais madame, c’était un carni- furax et… euh… ils étaient plusieurs.",
  car: { AGI: [2, 1], CON: [-2], FOR: [-3], PER: [1], CHA: [-2], INT: [-4], VOL: [2] },
  def: 11, pv: 2, init: 11,
  att: [{ n: "Morsure", mod: 3, dmg: "1 (1d4)" }],
  caps: [{ n: "Interchangeables", d: "Tant que les carnifurax sont plus nombreux que la cible, ils se relaient pour esquiver ses attaques : ils bénéficient de +3 en DEF. Ils infligent alors 1d4 DM. OUVRE-BOÎTE : Le carnifurax semble avoir une capacité presque surnaturelle pour trouver le point faible d’une armure de plaques (ou de plates complète) et introduire ses longues incisives sous un gorgerin pour atteindre la carotide. Contre une armure de mailles ou de plaques, il obtient un dé bonus en attaque." }]
},

{
  id: "caerbandog", nom: "Caerbandog", cat: "fantastique", nc: 4, ncLabel: "4",
  type: "Créature fantastique", taille: "Très petite", env: ["foret", "plaine"],
  car: { AGI: [4, 1], CON: [2], FOR: [-2], PER: [2, 1], CHA: [-2], INT: [-2], VOL: [4] },
  def: 20, pv: 30, init: 12,
  att: [{ n: "Morsure", mod: 10, dmg: "1d4+4", note: "3 attaques, Crit. 16-20" }],
  caps: [{ n: "Attaque bondissante", d: "La bête saute à la gorge de sa proie ; elle obtient un critique sur 16-20 en attaque. En plus de doubler les DM, l’attaque provoque alors une hémorragie qui inflige 1d4 DM par round (dé évolutif basé sur le niveau du PJ) jusqu’à la fin du combat." }, { n: "Bonds rapides", d: "La bête obtient une action de mouvement supplémentaire par round." }, { n: "Esquive fatale", d: "Une fois par combat, une attaque qui devrait toucher Caerbandog vise à la place un autre de ses adversaires à son contact. Menez l’attaque normalement contre la nouvelle cible (résultat de l’attaque contre DEF du PJ, DM normaux)." }, { n: "Pour les mj", d: "Peut-être s’attachera-t-il un jour à nouveau au service d’un mage de haut niveau qui lui rappellera son ancien maître (PJ de niveau 12 requis). Ce serait un cadeau empoisonné, car la créature est aussi imprévisible que son créateur était fou, et elle a une aversion pour les armures de plaques, qu’elle attaque à vue." }]
},

{
  id: "centaure", nom: "Centaure", cat: "fantastique", nc: 3, ncLabel: "3",
  type: "Créature fantastique", taille: "Grande", env: ["foret", "souterrain", "urbain"],
  desc: "Le centaure est une créature pourvue d’un corps de cheval et d’un buste humanoïde.",
  car: { AGI: [3], CON: [6, 1], FOR: [6], PER: [1, 1], CHA: [0], INT: [-1], VOL: [0] },
  def: 15, pv: 30, init: 14,
  att: [{ n: "Sabots", mod: 7, dmg: "1d8+6" }, { n: "Épée longue", mod: 7, dmg: "1d8+3" }, { n: "Arc long", mod: 4, dmg: "1d8" }],
  caps: [{ n: "Attaque double", a: "A", d: "Au contact, le centaure peut mener à la fois une attaque de sabots et une attaque avec son épée." }, { n: "Charge", a: "L", d: "Le centaure parcourt une distance maximale de 20 m et réalise une attaque de sabots avec un dé bonus. Si l’attaque est réussie, en plus des DM normaux, une victime de taille grande ou inférieure doit faire un test de FOR difficulté 16 ou être renversée. Dans ce cas, la créature pié- tine sa victime et les DM sont doublés." }, { n: "Hybride", d: "Étant un mélange de deux créa- tures, le centaure possède des caractéristiques particulières. Sa FOR de +6 correspond à sa puissance globale, mais son buste humain ne lui octroie que +3 en combat. Il est considéré comme une créature humanoïde pour tout ce qui concerne les attaques mentales." }, { n: "Discret", d: "Le centaure obtient +5 en discrétion en forêt." }]
},

{
  id: "cerbere", nom: "Cerbère", cat: "fantastique", nc: 5, ncLabel: "5",
  type: "Créature fantastique", taille: "Moyenne", env: ["foret", "marais", "urbain"],
  desc: "Vingt heures, taverne du Chat qui pue. Jasmine et Kasper, deux malfrats notoires, boivent un verre. « Bon, on tente le coup ? — C’est un peu précipité non ? — Écoute, j’ai besoin du fric, le mec s’est absenté, l’occasion fait le larron. — Mouais.",
  car: { AGI: [2], CON: [4], FOR: [4], PER: [2, 1], CHA: [-2], INT: [-3], VOL: [2] },
  def: 18, pv: 50, init: 15,
  att: [{ n: "Morsure", mod: 10, dmg: "1d6+4", note: "3 attaques" }],
  caps: [{ n: "Inamovible", d: "à nouveau son souffle. La créature est immunisée aux états préjudi- ciables suivants : surpris, immobilisé et renversé, et elle ne peut pas être désarmée. De plus, elle ne subit aucun DM de la capacité Attaque sournoise (voleur) ou d’autres capacités similaires. Elle obtient +5 à tous ses tests de détection et de vigilance." }, { n: "Corps enflammé", d: "Le cerbère des enfers est nimbé d’une aura de feu. Une créature qui l’attaque au contact subit 1d8 DM pour chaque attaque réussie. Lorsqu’il est au contact d’une source de feu importante, le cerbère des enfers régé- nère 5 PV par tour." }, { n: "Déchirer", d: "Si le cerbère réussit plusieurs attaques de morsure sur la même cible, chaque tête tire violemment dans une direction opposée en tentant de déchirer le corps de sa victime. La cible subit +1d6 DM par attaque réussie après la première dans le même round." }]
},

{
  id: "champignon_hurleur", nom: "Champignon Hurleur", cat: "fantastique", nc: 0, ncLabel: "0",
  type: "Créature fantastique", taille: "Moyenne", env: ["urbain"],
  car: { AGI: [-4], CON: [0], FOR: [-4], PER: [1, 1], CHA: [-4], INT: [-5], VOL: [4] },
  def: 6, pv: 1, init: 14,
  att: [],
  caps: [{ n: "Champignon", d: "Tant que le champignon reste immobile, il est impossible de le différencier d’un cham- pignon ordinaire. S’il attaque, la cible doit réussir un test de PER difficulté 15 ou être surprise. Cette capacité n’est valable que si le champignon animé est dissimulé au sein de nombreux champignons géants ordinaires." }, { n: "Hurlement", d: "Si une lumière ou une créature de taille petite ou supérieure s’approche à moins de 10 m du champignon, il émet un hurlement audible jusqu’à 100 m. Il continue de hurler tant que la source de gêne est à portée puis durant 1d4 rounds." }]
},

{
  id: "champignon_a_lames", nom: "Champignon À Lames", cat: "fantastique", nc: 1, ncLabel: "1",
  type: "Créature fantastique", taille: "Moyenne", env: ["ruines"],
  car: { AGI: [-4], CON: [5], FOR: [-4], PER: [1], CHA: [-4], INT: [-5], VOL: [4] },
  def: 10, pv: 15, init: 11,
  att: [{ n: "Projection de lames", mod: 4, dmg: "1d6 + poison" }],
  caps: [{ n: "Champignon", d: "Voir Champignon hurleur." }, { n: "Toupie", d: "Une fois par combat, le champignon peut tour- ner sur lui-même en projetant les lamelles de son chapeau autour de lui sur 10 m de rayon. Toutes les créatures dans la zone doivent réussir un test d’AGI difficulté 15 ou subir des DM de lame (1d6 + poison)." }, { n: "Poison", d: "La victime subit +2d6 DM (la moitié si elle réussit un test de CON difficulté 15)." }, { n: "Texture du bois", d: "Le champignon à lames bénéficie d’une RD 5 sauf contre les armes tranchantes. W WCHAMPIGNON À FILAMENTS | NC 1 Ce champignon camoufle sous son cha- peau de longs pseudopodes semblables à des filaments. Ils infligent de terribles brûlures qui provoquent la putréfaction de la chair. CRÉATURE VÉGÉTATIVE TAILLE MOYENNE | AGI -4 | CON +0 | FOR -4 | PER +1 | | CHA -4 | INT -5 | VOL +4 | (S)DEF 8 (V)PV 10 (RD 3) (I)Init. 11 Filaments (5 m) +4 · DM 1d6 + putréfaction" }, { n: "Putréfaction", d: "La victime doit faire un test de CON diffi- culté 15 ou subir +1d4° DM chaque round tant qu’elle ne réussit pas son test de CON (difficulté 15, un test par round). Les DM évo- lutifs sont basés sur le niveau de la cible." }]
},

{
  id: "champignons", nom: "Champignons", cat: "fantastique", nc: 0, ncLabel: "0",
  type: "Créature fantastique", taille: "Moyenne", env: ["foret", "urbain", "ruines"],
  car: { AGI: [-4], CON: [0], FOR: [-4], PER: [0], CHA: [-4], INT: [-5], VOL: [4] },
  def: 6, pv: 3, init: 10,
  att: [],
  caps: [{ n: "Champignon", d: "Voir Champignon hurleur." }, { n: "Hallucinant", d: "Lorsqu’un humanoïde regarde ce groupe de champignons, il doit faire un test de VOL difficulté 15 ou être hypnotisé et cesser toute activité. La victime se perd dans un monde onirique merveilleux et si elle n’est pas réveillée par plusieurs gifles, elle s’endort pour 1d6 heures. Toute créature qui a raté son test de VOL se sent affaiblie pour une durée équivalente à la durée d’endormissement, et durant cette période, elle n’a qu’une envie : se réfugier à nouveau dans le monde des rêves. W WCHAMPIGNON À SPORES | NC 1 Ce champignon géant des profondeurs émet des spores mortelles lorsqu’une créature approche. Cela lui permet de fertiliser les sols sur lesquels il se développe. Il explose s’il est détruit. CRÉATURE VÉGÉTATIVE TAILLE MOYENNE | AGI -4 | CON +0 | FOR -4 | PER +1 | | CHA -4 | INT -5 | VOL +4 | (S)DEF 6 (V)PV 2 (I)Init. 11" }, { n: "Nuage de spores", d: "Si une créature s’approche à moins de 5 m du champignon, il émet dans la même zone un nuage de spores invisibles (test de PER difficulté 20 pour les repérer), mais mortelles. Une créature vivante qui respire les spores doit faire un test de CON difficulté 15 ou sombrer dans le sommeil. Elle subit ensuite 1d6 DM par minute tant qu’elle reste dans la zone, jusqu’à ce que mort s’ensuive." }, { n: "Champignon atomique", d: "Si le champignon est réduit à 0 PV, il explose et ses spores s’enflamment en infligeant 4d6 DM de feu dans une zone de 10 m de rayon. Un test d’AGI difficulté 10 permet de diviser les DM par deux. Si plusieurs champignons explosent en même temps, les DM dans la zone de recouvrement augmen- tent de +1d6 par champignon supplémentaire. Variante zombie spore Il existe une variante du champignon à spores bien plus dangereuse, qui répand une terrible infection. Les créatures tuées par les spores se relèvent sous forme de zombie spore. Le zombie spore possède un abdomen gonflé et des chairs verdâtres dont certaines parties sont colonisées par de petits champignons de la même couleur. Il attaque les créatures vivantes qu’il rencontre et son corps boursouflé explose à sa mort en répandant encore davantage l’infection. En termes de règles, le zombie spore possède les mêmes caractéristiques qu’un zombie normal, mais à sa destruction, il explose en répandant des spores dans un rayon qui dépend de la taille de la créature (très petite 1 m, petite 2 m, moyenne 3 m, grande 4 m, énorme 5 m, colossale 6 m). Toutes les créatures dans la zone doivent réussir un test de CON difficulté 15 ou contracter la maladie. Le malade ne peut plus récupérer de PV naturellement (par exemple, en dépensant des DR) et il perd 1d4°PV (basé sur son niveau) chaque jour, jusqu’à ce que mort s’ensuive. Il se transforme alors en zombie spore. L’infection peut seulement être soignée par le sort Délivrance (prêtre). CHASSEUR INVISIBLE 1 W WCHASSEUR INVISIBLE CRÉATURE NON VIVANTE TAILLE GRANDE | NC 5 Comme le chasseur invisible reste toujours invisible, peu de gens connaissent sa véritable | AGI +2* | CON +6 | FOR +6 | PER +0* | apparence. Un sort de détection de l’invisible | CHA +0 | INT +2 | VOL +4 | ne révèle qu’une vague silhouette humanoïde dotée d’ailes. (S)DEF 18 (V)PV 50 (I)Init. 13 Serres +10 · DM 2d6+6 Écologie Le chasseur invisible est une créature native du plan de l’air, parfois invoquée par un puissant magicien pour capturer une proie. Il peut aussi être assigné à la garde d’un objet, bien que cela le plonge dans une terrible colère si la surveillance se prolonge. Après sa mort, le serviteur invisible devient visible et révèle alors la vérité : le cadavre est semblable à la version asexuée d’une harpie aux ailes de chauve-souris dont le visage serait lisse et dépourvu de traits. Le cadavre se trans- forme en courant d’air à la fragrance de lilas après 1d6 rounds." }, { n: "Vol rapide", d: "Le chasseur obtient une action de mou- vement supplémentaire par round lorsqu’il est en vol. Au premier round de combat, il obtient un dé bonus en attaque et +1d6 DM s’il est en vol et attaque une créature au sol." }, { n: "Invisibilité majeure", d: "Le chasseur reste invisible même lorsqu’il attaque. Les créatures qui ne voient pas l’invisible souffrent d’un malus équivalent à aveuglé lorsqu’elles le combattent (-5 en attaque et en DEF)." }, { n: "Enlèvement", d: "Graine d’aventure - Erreur sur la personne Un magicien a invoqué un chasseur invisible pour kidnapper le fils d’un marchand dans le cadre d’un complot politique. Mais le marchand est sous la protection de la guilde des voleurs, qui a appris ce qui se tramait. Les activités des PJ contrariant la guilde (trouvez une raison, sinon c’est juste une erreur…), elle décide d’en profiter pour leur jouer un tour. Un intermédiaire de la guilde fournit la mèche de cheveux d’un des PJ, qui se fait enlever. Il est livré chez le magicien, surpris par la nature du paquet. Le lendemain, le PJ se réveille dans une ruelle sombre, dévalisé et amnésique (potion mange-mémoire). C’est un mendiant de passage qui l’a délesté de ses richesses, pas le magicien à l’origine de l’affaire. Ce dernier ne souhaite sur- tout pas d’ennuis avec les PJ, mais il est prêt à se défendre si on remonte la piste jusqu’à lui. Le chasseur peut tenter d’agripper une cible de taille moyenne ou inférieure en action d’attaque. Il bénéficie générale- ment de +10 sur sa première attaque (+5 pour vol rapide et +5 pour l’invisibilité). La cible peut faire un test de FOR difficulté 16 pour échapper à son étreinte lors de la première attaque (G). En cas d’échec, elle est immobilisée et ne peut pas se libérer avant que le chasseur soit vaincu." }]
},

{
  id: "chevalier_des_tenebres", nom: "Chevalier Des Ténèbres", cat: "humanoide", nc: 9, ncLabel: "9",
  type: "Humanoïde", taille: "Moyenne", env: ["souterrain", "arctique", "urbain"],
  desc: "« Guerre, Famine, Maladie et Esclavage, tels sont les noms des chevaliers de l’apoca- lypse.",
  car: { AGI: [1], CON: [6], FOR: [6, 1], PER: [0, 1], CHA: [1], INT: [2], VOL: [5] },
  def: 24, pv: 120, init: 13,
  att: [{ n: "Épée à deux mains", mod: 13, dmg: "2d6+6 + 1d8 de" }, { n: "froid Toucher glacial", mod: 13, dmg: "2d8 de froid" }],
  caps: [{ n: "Aura glaciale", d: "Toutes les créatures vivantes au contact du che- valier subissent 1d4 DM de froid par round." }, { n: "Déplacement magique", a: "M", d: "Le chevalier se transforme en courant d’air glacial en un clin d’œil et réapparaît jusqu’à une distance de 30 m. Le lieu d’arrivée doit être en ligne de vue." }, { n: "Imparable", d: "Lors d’un test d’attaque, le chevalier réussit automatiquement s’il obtient 17-20 au d20. Il bénéficie alors de +2d8 DM." }, { n: "Résistances", d: "Le chevalier de la mort est immunisé aux DM de froid. De plus, il bénéficie d’une RD 5, sauf contre les armes bénies ou sacrées (sorts de prêtre tels que Arme de lumière, Arme bénie, Marteau de la foi, Destruction du mal)." }, { n: "Toucher glacial", d: "Une fois par round, le chevalier peut faire une attaque de Toucher glacial en plus de l’attaque à l’épée. S’il touche, la victime subit 2d8 DM de froid et doit faire un test de CON difficulté 15 ou être ralentie par le froid pendant 1d4 rounds. ARMURE DES TÉNÈBRES L’armure du chevalier des ténèbres est une armure magique de plaques complète, noire et décorée de têtes de démons hurlants. Elle octroie à son porteur une RD 5, sauf si l’arme est bénie ou sacrée (sorts de prêtre). Son apparence épouvantable accorde un dé bonus au chevalier pour intimider un interlocuteur ou pour négocier avec des êtres maléfiques. Dans tous les autres cas, elle inflige un dé malus aux tests de CHA de son porteur et à ses alliés situés à proximité ! En cas d’analyse des propriétés de l’objet (sort Maîtrise de la magie), le magicien doit réussir un test d’attaque magique difficulté 30 pour découvrir que l’objet est maudit. En atteignant une difficulté 40, il découvre de quelle façon. Une fois enfilée, l’armure ne peut plus être enlevée sans tuer son porteur. Le porteur peut vivre presque normalement dans son armure (boire et manger en levant la visière du heaume, accéder à ses organes génitaux via une plaque articulée). Le porteur prend un teint de plus en plus cadavérique, mais survit. C’est lorsqu’il meurt que la malédiction culmine et le transforme en chevalier de la mort. Toutefois, si son âme n’a pas été corrompue, il peut tenter un test de VOL difficulté 20 pour reposer en paix (ce qui libère son corps de sa prison de fer). Un prêtre de niveau 20 peut lancer le sort Délivrance sur le porteur de l’armure pour l’en libérer. CHIENS INFERNAUX Il existe deux espèces connues de chiens infer- naux : la première vient du plan des ténèbres et la seconde des enfers. Contrairement aux démons, les chiens infernaux profitent d’une capacité naturelle à s’introduire sur le plan matériel par l’intermédiaire d’interstices entre les plans, à certains moments ou dans certains endroits bien spécifiques. Cela les rend plus communs et plus dangereux pour les gens ordinaires, et les sorciers peuvent les invoquer plus facilement. Écologie Les chiens infernaux sont des émanations du mal. Ils ne sont pas capables de se reproduire, vous ne trouverez donc jamais de chiots infer- naux. Certains sages ont émis l’hypothèse que ces créatures sont la concrétisation matérielle des souffrances et des cauchemars des chiens ordi- naires battus ou maltraités par leurs maîtres. Mais rien ne permet de vérifier cette théorie. Le débat sur l’existence de l’âme des animaux continue à diviser et distraire les érudits. Les chiens infernaux sont tous considérés comme des démons pour les sorts de prêtre et les armes qui affectent ceux-ci (par exemple, Arme de lumière ou Destruction du mal)." }]
},

{
  id: "chien_des_tenebres", nom: "Chien Des Ténèbres", cat: "fantastique", nc: 2, ncLabel: "2",
  type: "Créature fantastique", taille: "Moyenne", env: ["urbain"],
  car: { AGI: [0], CON: [3, 1], FOR: [3], PER: [2], CHA: [0], INT: [-2], VOL: [2] },
  def: 15, pv: 15, init: 10,
  att: [{ n: "Morsure", mod: 4, dmg: "1d6+3" }],
  caps: [{ n: "Interchangeable", d: "Tant que les chiens des ténèbres sont plus nombreux que la cible, ils se relaient pour esquiver ses attaques : ils bénéficient de +3 en DEF. Si plusieurs chiens sont au contact d’un PJ et que celui-ci réussit une attaque, le MJ désigne celui qui est touché (le PJ ne choisit jamais lequel il blesse)." }, { n: "Hurlements", a: "L", d: "Lorsque le chien des ténèbres pousse son hurlement, toutes les créatures à moins de 50 m de lui doivent réussir un test de VOL difficulté 10 ou fuir pendant 2d4 rounds. Si plusieurs chiens hurlent en même temps, la difficulté du test passe à (10 + nombre de chiens) avec un maximum de 20. Une créa- ture qui a résisté à cet effet y est immunisée pendant 24 heures." }, { n: "Vol", d: "Le chien infernal est capable de courir dans les airs comme sur terre." }]
}
);
