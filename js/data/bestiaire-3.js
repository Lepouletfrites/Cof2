/* ============================================================
   COF2 Compagnon — Bestiaire (3/3) : créatures fantastiques H–Z
   ============================================================ */
window.COF = window.COF || {};
COF.BESTIAIRE = COF.BESTIAIRE || [];

COF.BESTIAIRE.push(

{
  id: 'hydre', nom: 'Hydre à cinq têtes', cat: 'fantastique', nc: 5, ncLabel: '5',
  groupe: 'Hydres', taille: 'Énorme', env: ['marais'],
  desc: "Reptile massif à cinq cous serpentins, qui régénère ses blessures presque aussi vite qu'on les inflige.",
  car: { AGI: [0], CON: [10], FOR: [10, 1], PER: [0], CHA: [-2], INT: [-4], VOL: [0] },
  def: 18, pv: 50, init: 10,
  att: [{ n: 'Morsure', mod: 8, dmg: '1d8+4', note: '5 attaques' }],
  caps: [
    { n: 'Attaques multiples', d: "5 attaques au total, jamais plus de 4 sur la même cible par round. Utilisez la règle des attaques groupées (+5 pour deux têtes à la fois)." },
    { n: 'Guérison accélérée', d: "Régénère 5 PV par round, sauf contre les DM de feu." }
  ]
},
{
  id: 'cryohydre', nom: 'Cryohydre à dix têtes', cat: 'fantastique', nc: 11, ncLabel: '11',
  groupe: 'Hydres', taille: 'Énorme', env: ['arctique', 'marais'],
  desc: "Hydre élémentaire de glace à dix têtes, dotée d'un souffle glacial. Il existe aussi des pyrohydres, immunisées au feu.",
  car: { AGI: [0], CON: [8], FOR: [8, 1], PER: [0], CHA: [-2], INT: [-4], VOL: [2] },
  def: 23, pv: 150, init: 10,
  att: [
    { n: 'Morsure', mod: 13, dmg: '1d8+4+1d6', note: '10 attaques, +1d6 froid' },
    { n: 'Souffle glacial', mod: 0, dmg: '6d6', note: 'cône 20 m, tous les 1d4 rounds' }
  ],
  caps: [
    { n: 'Attaques multiples', d: "10 attaques au total, jamais plus de 4 sur la même cible par round." },
    { n: 'Guérison accélérée', d: "Régénère 5 PV au début de son tour, sauf contre les DM de feu." },
    { n: 'Créature élémentaire', d: "Souffle glacial en cône de 20 m tous les 1d4 rounds. Immunisée au froid, +1d6 de froid à ses morsures. Ces éléments comptent pour +1 au NC." }
  ]
},
{
  id: 'kobold', nom: 'Kobold', cat: 'fantastique', nc: 0, ncLabel: '0',
  groupe: 'Kobolds', type: 'Humanoïde', taille: 'Petite', env: ['souterrain', 'ruines'],
  desc: "Petit humanoïde reptilien, lâche mais retors, expert en pièges et en galeries étroites.",
  car: { AGI: [2], CON: [-1], FOR: [-1], PER: [1], CHA: [-2], INT: [0], VOL: [-2] },
  def: 12, pv: 3, init: 11,
  att: [
    { n: 'Lance', mod: 2, dmg: '1d6-1' },
    { n: 'Fronde', mod: 2, dmg: '1d4', portee: 20 }
  ],
  caps: []
},
{
  id: 'chef_kobold', nom: 'Chef kobold', cat: 'fantastique', nc: 1, ncLabel: '1',
  groupe: 'Kobolds', type: 'Humanoïde', taille: 'Petite', env: ['souterrain', 'ruines'],
  desc: "Le plus hargneux de la portée, qui mène sa bande à coups de gueule.",
  car: { AGI: [2], CON: [0], FOR: [0], PER: [1], CHA: [1, 1], INT: [0], VOL: [0] },
  def: 13, pv: 15, init: 11,
  att: [{ n: 'Lance', mod: 3, dmg: '1d6' }],
  caps: [{ n: 'Imparable', d: "Sur 15-20 au d20 en attaque : +2d4 DM et l'attaque réussit automatiquement quelle que soit la DEF." }]
},
{
  id: 'pretre_kobold', nom: 'Prêtre kobold', cat: 'fantastique', nc: 2, ncLabel: '2',
  groupe: 'Kobolds', type: 'Humanoïde', taille: 'Petite', env: ['souterrain', 'ruines'],
  desc: "Chaman vouant un culte fanatique aux dragons.",
  car: { AGI: [2], CON: [-1], FOR: [-1], PER: [1], CHA: [1, 1], INT: [0], VOL: [1] },
  def: 15, pv: 30, init: 11,
  att: [
    { n: 'Dague', mod: 4, dmg: '1d4-1' },
    { n: 'Attaque magique', mod: 6, dmg: '3d6', portee: 20 }
  ],
  caps: []
},
{
  id: 'licorne', nom: 'Licorne', cat: 'fantastique', nc: 3, ncLabel: '3',
  taille: 'Grande', env: ['foret'],
  desc: "Créature féérique liée à une forêt natale, dont la corne guérit et purifie.",
  car: { AGI: [4, 1], CON: [5], FOR: [5], PER: [4, 1], CHA: [4], INT: [0], VOL: [4] },
  def: 18, pv: 35, init: 17,
  att: [{ n: 'Corne et sabots', mod: 8, dmg: '2d6+5' }],
  caps: [
    { n: 'Célérité', d: "Sans charge supérieure à 50 kg, parcourt jusqu'à 15 m par action de mouvement." },
    { n: 'Corne magique', a: 'L', d: "En touchant une créature à 0 PV, elle récupère 2d4° PV. Une créature empoisonnée a droit à un test de CON difficulté 10 pour neutraliser le poison." },
    { n: 'Déplacement magique', d: "3×/combat, se téléporte jusqu'à 60 m — uniquement dans les limites de sa forêt natale." },
    { n: 'Résistance aux DM', d: "Réduit de 5 les DM de toute arme qui n'est pas en fer froid ; les armes en fer froid lui infligent en revanche des DM doublés." }
  ]
},
{
  id: 'momie', nom: 'Momie', cat: 'fantastique', nc: 5, ncLabel: '5',
  groupe: 'Momies', type: 'Non vivante', taille: 'Moyenne', env: ['ruines', 'plaine'],
  desc: "Cadavre embaumé couvert de bandelettes, ranimé pour garder un tombeau.",
  car: { AGI: [1], CON: [3, 1], FOR: [5, 1], PER: [1], CHA: [-2], INT: [-2], VOL: [4] },
  def: 20, pv: 70, init: 11,
  att: [{ n: 'Coup', mod: 10, dmg: '1d8+5', note: '2 attaques, + putréfaction' }],
  caps: [
    { n: 'Résistance aux DM', d: "Réduit de 5 tous les DM subis, sauf ceux du feu." },
    { n: 'Putréfaction', d: "Toute créature blessée doit réussir un test de CON difficulté 15 ou contracter une lèpre fulgurante : 1d6 DM par round pendant 5 rounds." }
  ]
},
{
  id: 'momie_auguste', nom: 'Momie auguste', cat: 'fantastique', nc: 10, ncLabel: '10',
  groupe: 'Momies', type: 'Non vivante', taille: 'Moyenne', env: ['ruines', 'plaine'],
  desc: "Roi-prêtre embaumé, souverain d'une nécropole entière et redoutable lanceur de malédictions.",
  car: { AGI: [3], CON: [6, 1], FOR: [6, 1], PER: [2], CHA: [-2], INT: [3, 1], VOL: [6] },
  def: 24, pv: 160, init: 12,
  att: [{ n: 'Coup', mod: 16, dmg: '2d6+8', note: '2 attaques, + putréfaction' }],
  caps: [
    { n: 'Résistance aux DM', d: "Réduit de 5 tous les DM subis, sauf ceux du feu." },
    { n: 'Putréfaction', d: "Test de CON difficulté 15 ou lèpre fulgurante : 1d10 DM par round pendant 5 rounds." },
    { n: 'Injonction mortelle', a: 'L', d: "Cible à 30 m : test de CON difficulté 15 ou elle tombe à 0 PV (mort immédiate pour un PNJ). En cas de succès, elle subit tout de même 2d8+10 DM. Une seule fois par créature." }
  ]
},
{
  id: 'ogre', nom: 'Ogre', cat: 'fantastique', nc: 3, ncLabel: '3',
  groupe: 'Ogres', type: 'Humanoïde', taille: 'Grande', env: ['montagne', 'foret', 'souterrain'],
  desc: "Brute de trois mètres, stupide et affamée, armée d'un hachoir de boucher.",
  car: { AGI: [1], CON: [6], FOR: [6, 1], PER: [0], CHA: [-2], INT: [-2], VOL: [0] },
  def: 17, pv: 40, init: 10,
  att: [{ n: 'Hachoir', mod: 7, dmg: '2d6+6' }],
  caps: [
    { n: 'Une capacité au choix', d: "Tape dur ou Imparable." },
    { n: 'Tape dur', d: "Sur 15-20 au dé d'attaque, l'attaque réussit automatiquement et la victime doit réussir un test de CON difficulté 16 ou être étourdie 1 round." },
    { n: 'Imparable', a: 'L', d: "Attaque avec un dé bonus. Sur 15-20 au d20 (même sans utiliser Imparable) : +1d6 DM et réussite automatique quelle que soit la DEF." }
  ]
},
{
  id: 'chef_ogre', nom: 'Chef ogre', cat: 'fantastique', nc: 6, ncLabel: '6',
  groupe: 'Ogres', type: 'Humanoïde', taille: 'Grande', env: ['montagne', 'foret', 'souterrain'],
  desc: "Le plus gros et le plus teigneux de la bande, celui qui mange en premier.",
  car: { AGI: [1], CON: [6], FOR: [6, 1], PER: [0], CHA: [-2], INT: [-2], VOL: [1] },
  def: 20, pv: 70, init: 10,
  att: [{ n: 'Hachoir', mod: 12, dmg: '2d6+6', note: '2 attaques' }],
  caps: [
    { n: 'Tape dur', d: "Sur 15-20 au dé d'attaque : réussite automatique et test de CON difficulté 16 ou étourdi 1 round." },
    { n: 'Imparable', a: 'L', d: "Attaque avec un dé bonus. Sur 15-20 : +1d6 DM et réussite automatique." },
    { n: 'Teigneuse', d: "Après une attaque ratée, la suivante bénéficie d'un dé bonus et de +2d6 DM." },
    { n: 'Enragé', d: "Sur un coup critique subi : ignore douleur et peur, +3 en attaque, +1d6 DM, agit encore un tour après 0 PV." }
  ]
},
{
  id: 'orc', nom: 'Orc', cat: 'fantastique', nc: 0.5, ncLabel: '1/2',
  groupe: 'Orcs', type: 'Humanoïde', taille: 'Moyenne', env: ['souterrain', 'montagne', 'plaine'],
  desc: "Guerrier au groin porcin et à la peau grisâtre, organisé en hordes tribales.",
  car: { AGI: [0], CON: [2], FOR: [2, 1], PER: [0], CHA: [-2], INT: [-2], VOL: [-1] },
  def: 13, pv: 12, init: 10,
  att: [{ n: 'Hache ou masse', mod: 3, dmg: '1d8+2' }],
  caps: [{ n: 'Sensible à la lumière', d: "Créatures souterraines, les orcs subissent un dé malus en attaque en plein soleil." }]
},
{
  id: 'orc_noir', nom: 'Orc noir', cat: 'fantastique', nc: 1, ncLabel: '1',
  groupe: 'Orcs', type: 'Humanoïde', taille: 'Moyenne', env: ['souterrain', 'montagne', 'plaine'],
  desc: "Orc d'élite, plus grand et mieux armé, insensible à la lumière du jour.",
  car: { AGI: [0], CON: [3], FOR: [3, 1], PER: [0], CHA: [-2], INT: [-2], VOL: [1] },
  def: 15, pv: 15, init: 10,
  att: [{ n: 'Arme à deux mains', mod: 4, dmg: '2d6+3' }],
  caps: []
},
{
  id: 'berserker_orc', nom: 'Berserker orc', cat: 'fantastique', nc: 2, ncLabel: '2',
  groupe: 'Orcs', type: 'Humanoïde', taille: 'Moyenne', env: ['souterrain', 'montagne', 'plaine'],
  desc: "Guerrier fanatique qui charge sans armure et sans peur.",
  car: { AGI: [0], CON: [3], FOR: [3, 1], PER: [0], CHA: [-2], INT: [-2], VOL: [4] },
  def: 13, pv: 15, init: 10,
  att: [{ n: 'Arme à deux mains', mod: 6, dmg: '2d6+3' }],
  caps: [
    { n: 'Imparable', d: "Sur 15-20 au d20 : +2d4 DM et réussite automatique quelle que soit la DEF." },
    { n: 'Teigneuse', d: "Après une attaque ratée, la suivante bénéficie d'un dé bonus et de +2d4 DM." }
  ]
},
{
  id: 'sergent_orc', nom: 'Sergent orc', cat: 'fantastique', nc: 3, ncLabel: '3',
  groupe: 'Orcs', type: 'Humanoïde', taille: 'Moyenne', env: ['souterrain', 'montagne', 'plaine'],
  desc: "Vétéran chargé de maintenir la discipline dans la horde.",
  car: { AGI: [0], CON: [3], FOR: [4, 1], PER: [0], CHA: [-1], INT: [-1], VOL: [1] },
  def: 18, pv: 40, init: 10,
  att: [{ n: 'Épée à deux mains', mod: 7, dmg: '2d6+6' }],
  caps: [{ n: 'Imparable', d: "Sur 15-20 au d20 : +2d4 DM et réussite automatique quelle que soit la DEF." }]
},
{
  id: 'shaman_orc', nom: 'Shaman orc', cat: 'fantastique', nc: 3, ncLabel: '3',
  groupe: 'Orcs', type: 'Humanoïde', taille: 'Moyenne', env: ['souterrain', 'montagne', 'plaine'],
  desc: "Sorcier de la horde, qui commerce avec les esprits et les morts.",
  car: { AGI: [0], CON: [3], FOR: [1], PER: [3], CHA: [-1], INT: [0], VOL: [3] },
  def: 17, pv: 40, init: 13,
  att: [
    { n: 'Dague', mod: 6, dmg: '1d4+1', note: '2 attaques' },
    { n: 'Attaque magique', mod: 6, dmg: '' }
  ],
  caps: [
    { n: 'Vampirisation', a: 'L', d: "Test opposé d'attaque magique contre une cible vivante à 30 m : 2d8 DM et le shaman régénère autant de PV." },
    { n: 'Animer un cadavre', a: 'L', d: "Anime un cadavre (portée 10 m) pour le combat : mêmes caractéristiques, mais -2 en attaque, en DEF et en Init." }
  ]
},
{
  id: 'chef_orc', nom: 'Chef orc', cat: 'fantastique', nc: 6, ncLabel: '6',
  groupe: 'Orcs', type: 'Humanoïde', taille: 'Moyenne', env: ['souterrain', 'montagne', 'plaine'],
  desc: "Seigneur de guerre à la tête d'une horde entière.",
  car: { AGI: [0], CON: [5], FOR: [5, 1], PER: [0], CHA: [1, 1], INT: [0], VOL: [2] },
  def: 20, pv: 60, init: 10,
  att: [{ n: 'Épée à deux mains', mod: 10, dmg: '2d6+5', note: '2 attaques' }],
  caps: [
    { n: 'Imparable', d: "Sur 15-20 au d20 : +2d6 DM et réussite automatique quelle que soit la DEF." },
    { n: 'Brise-genou', d: "Attaque gratuite contre un adversaire au contact qui s'éloigne ; test de CON difficulté 15 ou déplacement divisé par deux." },
    { n: 'Capitaine', d: "+2 en Init., en attaque et aux DM à toutes les créatures sous ses ordres en vue." },
    { n: 'Commandant', d: "Tant qu'au moins 4 créatures sous ses ordres sont à moins de 20 m, il ne subit que la moitié des DM." }
  ]
},
{
  id: 'ourhible', nom: 'Ourhible', cat: 'fantastique', nc: 5, ncLabel: '5',
  taille: 'Grande', env: ['foret', 'souterrain'],
  desc: "Ours mutant dont la tête a été remplacée par celle d'un autre animal : crapaud, sanglier, rapace…",
  car: { AGI: [1], CON: [6, 1], FOR: [6], PER: [2], CHA: [-2], INT: [-4], VOL: [3] },
  def: 18, pv: 70, init: 12,
  att: [{ n: 'Morsure, bec et griffes', mod: 10, dmg: '1d8+6', note: '2 attaques' }],
  caps: [
    { n: 'Charge', a: 'L', d: "Parcourt jusqu'à 20 m et attaque avec un dé bonus ; test de FOR difficulté 16 pour ne pas être renversé." },
    { n: 'Enragé', d: "Sur un coup critique subi : ignore douleur et peur, +3 en attaque, +1d4 DM, agit encore un tour après 0 PV." }
  ]
},
{
  id: 'rat_geant', nom: 'Rat géant', cat: 'fantastique', nc: 0.5, ncLabel: '1/2',
  taille: 'Petite', env: ['souterrain', 'urbain', 'ruines'],
  desc: "Rongeur de la taille d'un chien, porteur de maladies, qui pullule dans les égouts.",
  car: { AGI: [1], CON: [1], FOR: [1], PER: [2, 1], CHA: [-4], INT: [-4], VOL: [-2] },
  def: 13, pv: 4, init: 15,
  att: [{ n: 'Morsure', mod: 3, dmg: '1d4+1' }],
  caps: [{ n: 'Maladie', d: "Toute créature mordue fait un test de CON difficulté 10 à la fin du combat. Échec : maladie déclarée après 2d6 h, victime affaiblie et perdant 1d4 PV toutes les 24 h, non soignables tant qu'elle n'est pas guérie." }]
},
{
  id: 'skrambler', nom: 'Skrambler', cat: 'fantastique', nc: 3, ncLabel: '3',
  taille: 'Grande', env: ['souterrain', 'montagne'],
  desc: "Fouisseur cuirassé capable de fracturer la roche par une onde de choc.",
  car: { AGI: [1, 1], CON: [6], FOR: [6], PER: [2, 1], CHA: [-4], INT: [-4], VOL: [2] },
  def: 17, pv: 30, init: 14,
  att: [{ n: 'Pattes', mod: 8, dmg: '2d6+6' }],
  caps: [
    { n: 'Creuser', a: 'L', d: "Creuse sur 10 m de profondeur par round ; le tunnel s'effondre derrière lui. Peut surgir du sol pour une Embuscade." },
    { n: 'Embuscade', d: "Test de PER difficulté 16 ou surprise ; +1d4 DM contre une cible surprise." },
    { n: 'Onde dévastatrice', a: 'A', d: "Fracture la roche dans un cône de 10 m × 3 m : 5d6 DM, divisés par deux sur un test de CON difficulté 15." }
  ]
},
{
  id: 'squelette', nom: 'Squelette', cat: 'fantastique', nc: 1, ncLabel: '1',
  groupe: 'Squelettes', type: 'Non vivante', taille: 'Moyenne', env: ['ruines', 'souterrain'],
  desc: "Ossements animés par magie, gardiens infatigables des tombeaux. Une rencontre de base pour un groupe de niveau 1.",
  car: { AGI: [1], CON: [1], FOR: [1], PER: [-1], CHA: [-4], INT: [-4], VOL: [6] },
  def: 13, pv: 9, init: 9,
  att: [{ n: 'Épée (ou autre)', mod: 4, dmg: '1d6+1' }],
  caps: [
    { n: 'Sans esprit', d: "Aucune âme n'habite la carcasse : immunisé à tous les sorts affectant l'esprit." },
    { n: 'Résistance aux DM', d: "Tous les DM d'armes sont divisés par deux, sauf ceux des armes contondantes." },
    { n: 'Réduction des DM de froid', d: "Réduit de 5 tous les DM de froid reçus." }
  ]
},
{
  id: 'squelette_geant', nom: 'Squelette géant', cat: 'fantastique', nc: 4, ncLabel: '4',
  groupe: 'Squelettes', type: 'Non vivante', taille: 'Grande', env: ['ruines', 'souterrain'],
  desc: "Ossature colossale ranimée, brandissant une massue à deux mains.",
  car: { AGI: [1], CON: [6], FOR: [6], PER: [-2], CHA: [-4], INT: [-4], VOL: [6] },
  def: 18, pv: 60, init: 9,
  att: [{ n: 'Massue à deux mains', mod: 9, dmg: '2d8+6' }],
  caps: [
    { n: 'Sans esprit', d: "Immunisé à tous les sorts affectant l'esprit." },
    { n: 'Résistance aux DM', d: "DM d'armes divisés par deux, sauf armes contondantes." },
    { n: 'Réduction des DM de froid', d: "Réduit de 5 tous les DM de froid reçus." }
  ]
},
{
  id: 'troll', nom: 'Troll', cat: 'fantastique', nc: 5, ncLabel: '5',
  type: 'Humanoïde', taille: 'Grande', env: ['foret', 'montagne', 'souterrain', 'marais'],
  desc: "Grand humanoïde de 2,70 m à la peau verdâtre couverte d'excroissances, dont les blessures se referment comme par magie. Sans peur, il combat férocement.",
  car: { AGI: [1], CON: [6], FOR: [6], PER: [0], CHA: [-2], INT: [-2], VOL: [2] },
  def: 19, pv: 70, init: 10, rd: 3,
  att: [
    { n: 'Griffes ou gourdin', mod: 10, dmg: '1d6+6', note: '2 attaques' },
    { n: 'Lancer de rocher', mod: 10, dmg: '2d6+6', portee: 10 }
  ],
  caps: [
    { n: 'Fauchage', d: "Sur 17-20 en attaque réussie : test de FOR ou d'AGI difficulté 16 ou renversé." },
    { n: 'Vitalité surnaturelle', d: "Récupère 5 PV par tour, sauf contre le feu et l'acide. Même à 0 PV il régénère, à moins de brûler son corps ou de l'achever (action limitée)." }
  ]
},
{
  id: 'vampirien', nom: 'Vampirien', cat: 'fantastique', nc: 4, ncLabel: '4',
  groupe: 'Vampires', type: 'Humanoïde non vivant', taille: 'Moyenne', env: ['ruines', 'urbain', 'souterrain'],
  desc: "Victime d'un vampire revenue d'entre les morts, esclave de son créateur.",
  car: { AGI: [2, 1], CON: [3, 1], FOR: [3], PER: [0], CHA: [1], INT: [0], VOL: [2] },
  def: 17, pv: 35, init: 10, rd: 5,
  att: [{ n: 'Morsure et griffes', mod: 6, dmg: '1d6+3', note: '2 attaques' }],
  caps: [
    { n: "Absorption d'énergie", d: "Récupère 5 PV chaque fois qu'il blesse une créature." },
    { n: 'Forme gazeuse', a: 'A', d: "1×/jour, devient gazeux pendant 1 min : se déplace de 5 m par action de mouvement, passe par les interstices, aucune capacité utilisable." },
    { n: "Pattes d'araignée", d: "Se déplace de 10 m par action de mouvement sur les murs et les plafonds." },
    { n: 'Regard envoûtant', a: 'A', d: "1×/combat : la cible doit réussir un test de VOL difficulté 10 ou être affaiblie tant qu'elle reste sous son regard." },
    { n: 'Résistances', d: "Retranche 5 à tous les DM, sauf ceux des armes en argent et du feu." },
    { n: 'Vulnérabilité au soleil', d: "Exposé au soleil : 2d6 DM par tour retranchés à son maximum de PV. Réduit à 0 de cette façon, il tombe en cendres définitivement." }
  ]
},
{
  id: 'vampire', nom: 'Vampire', cat: 'fantastique', nc: 8, ncLabel: '8 (7)',
  groupe: 'Vampires', type: 'Humanoïde non vivant', taille: 'Moyenne', env: ['ruines', 'urbain', 'souterrain'],
  desc: "Humanoïde mort-vivant d'une puissance et d'une ruse redoutables, presque impossible à détruire définitivement.",
  car: { AGI: [4, 1], CON: [5, 1], FOR: [5], PER: [4, 1], CHA: [4], INT: [4], VOL: [4] },
  def: 20, pv: 70, init: 17,
  att: [
    { n: 'Griffes et morsure', mod: 11, dmg: '1d8+5', note: "2 attaques, + absorption d'énergie" },
    { n: 'Épée longue', mod: 11, dmg: '1d8+7', note: '2 attaques' }
  ],
  caps: [
    { n: "Absorption d'énergie", d: "Récupère 5 PV chaque fois qu'il blesse avec ses armes naturelles. Une victime réduite à 0 PV ainsi devient un vampirien au prochain crépuscule." },
    { n: 'Immortel', d: "À 0 PV, il passe en forme gazeuse et rejoint son cercueil, où il se réveille au prochain crépuscule avec tous ses PV. Pour le tuer, il faut lui planter un pieu dans le cœur pendant son repos." },
    { n: 'Forme gazeuse', a: 'A', d: "Devient gazeux : 5 m par action de mouvement, passe par les interstices, aucune capacité utilisable." },
    { n: "Pattes d'araignée", d: "Se déplace de 10 m par action de mouvement sur les murs et les plafonds." },
    { n: 'Regard envoûtant', a: 'M', d: "3×/combat : la cible doit réussir un test de VOL difficulté 15 ou être affaiblie 1d6 rounds." },
    { n: 'Résistance impie', d: "Retranche 10 à tous les DM subis (magie incluse), sauf les armes en argent et le feu." },
    { n: 'Riposte éclair', d: "Attaque gratuite contre chaque adversaire qui l'attaque, sauf celui qu'il a lui-même choisi d'attaquer." },
    { n: 'Transformation en chauve-souris', a: 'L', d: "Sous cette forme il ne peut plus attaquer, mais se déplace de 20 m par action de mouvement." },
    { n: 'Vulnérabilité au soleil', d: "2d10 DM par tour retranchés à son maximum de PV. Réduit à 0 ainsi, il est détruit définitivement." }
  ]
},
{
  id: 'vampire_ancien', nom: 'Vampire ancien', cat: 'fantastique', nc: 13, ncLabel: '13 (12)',
  groupe: 'Vampires', type: 'Humanoïde non vivant', taille: 'Moyenne', env: ['ruines', 'urbain', 'souterrain'],
  desc: "Un vampire millénaire, généralement doublé d'un puissant magicien.",
  car: { AGI: [4, 1], CON: [5, 1], FOR: [5], PER: [4, 1], CHA: [4], INT: [4], VOL: [6] },
  def: 25, pv: 160, init: 17,
  att: [
    { n: 'Griffes et morsure', mod: 14, dmg: '1d8+8+1d8', note: '2 attaques, +1d8 froid' },
    { n: 'Épée longue', mod: 14, dmg: '1d8+8+1d8', note: '2 attaques' }
  ],
  caps: [
    { n: 'Estropier', d: "Ses blessures se nécrosent : comptabilisez ces DM à part, les soins et régénérations y sont divisés par deux. Il triple les DM sur un coup critique." },
    { n: 'Magicien', d: "La plupart des vampires anciens sont aussi magiciens : choisissez une voie de mage au rang 5 (souvent une voie de sorcier)." },
    { n: 'Regard envoûtant', a: 'M', d: "Test de VOL difficulté 20 ou affaibli 1d6 rounds." },
    { n: 'Immortel', d: "À 0 PV, il rejoint son cercueil sous forme gazeuse et se réveille au crépuscule avec tous ses PV." },
    { n: 'Résistance impie', d: "Retranche 10 à tous les DM subis, sauf les armes en argent et le feu." },
    { n: 'Vulnérabilité au soleil', d: "2d10 DM par tour retranchés à son maximum de PV ; réduit à 0 ainsi, il est détruit." }
  ]
},
{
  id: 'worg', nom: 'Worg', cat: 'fantastique', nc: 3, ncLabel: '3',
  groupe: 'Worgs', taille: 'Moyenne', env: ['foret', 'montagne', 'arctique'],
  desc: "Cousin maléfique et intelligent du loup, souvent monture des gobelinoïdes.",
  car: { AGI: [1, 1], CON: [5, 1], FOR: [5], PER: [2, 1], CHA: [-2], INT: [-4], VOL: [2] },
  def: 17, pv: 35, init: 15,
  att: [{ n: 'Morsure', mod: 7, dmg: '1d6+5' }],
  caps: [
    { n: 'Embuscade', d: "Test de PER difficulté 16 ou surprise ; +1d4 DM contre une cible surprise." },
    { n: 'Brise-genou', d: "Attaque gratuite contre un adversaire au contact qui s'éloigne ; test de CON difficulté 15 ou déplacement divisé par deux." }
  ]
},
{
  id: 'worg_meute', nom: 'Worgs en meute', cat: 'fantastique', nc: 8, ncLabel: '8+',
  groupe: 'Worgs', taille: 'Moyenne', env: ['foret', 'montagne', 'arctique'],
  desc: "En meute d'au moins 4 individus, les worgs s'acharnent sur une proie. Une meute de 6 worgs est une rencontre ordinaire de niveau 8.",
  car: { AGI: [1, 1], CON: [5, 1], FOR: [5], PER: [2, 1], CHA: [-2], INT: [-4], VOL: [2] },
  def: 17, pv: 35, init: 15,
  att: [{ n: 'Morsure', mod: 7, dmg: '1d6+5' }],
  caps: [
    { n: 'Attaque en traître', a: 'L', d: "En attaquant en même temps qu'un autre worg, de dos ou par surprise : attaque sournoise avec dé bonus et +2d4 DM." },
    { n: "L'hallali", d: "Chaque fois que la victime rate une attaque ou obtient 1 à 5 au d20, elle déclenche la curée : chaque worg à son contact porte une attaque gratuite." },
    { n: 'Embuscade', d: "Test de PER difficulté 16 ou surprise ; +1d4 DM contre une cible surprise." }
  ]
},
{
  id: 'zombie', nom: 'Zombie humain', cat: 'fantastique', nc: 1, ncLabel: '1',
  groupe: 'Zombies', type: 'Non vivante', taille: 'Moyenne', env: ['ruines', 'souterrain', 'urbain'],
  desc: "Cadavre réanimé, lent et sans volonté propre, mais très difficile à arrêter définitivement.",
  car: { AGI: [-1], CON: [1], FOR: [2], PER: [-2], CHA: [-4], INT: [-4], VOL: [6] },
  def: 10, pv: 18, init: 8,
  att: [{ n: 'Attaque', mod: 4, dmg: '1d6+3', note: 'ou selon arme +3' }],
  caps: [
    { n: 'Sans esprit', d: "Immunisé à tous les sorts affectant l'esprit. INT et CHA à -4, VOL à +6." },
    { n: 'Résistance aux DM', d: "Divise par deux tous les DM d'armes, sauf les armes tranchantes." },
    { n: 'Lenteur', d: "AGI réduite à -1, PER à -2 ; ne se déplace que de 5 m par action de mouvement." },
    { n: 'Insensible à la douleur', d: "Ajoutez 3 × NC aux PV et retranchez 5 à la DEF. Peut encore agir (attaque ou mouvement) après avoir été réduit à 0 PV." }
  ]
},
{
  id: 'zombie_choursette', nom: 'Zombie de choursette', cat: 'fantastique', nc: 4, ncLabel: '4',
  groupe: 'Zombies', type: 'Non vivante', taille: 'Grande', env: ['ruines', 'foret', 'souterrain'],
  desc: "Exemple de créature transformée en zombie : appliquez le gabarit zombie à n'importe quel profil.",
  car: { AGI: [1], CON: [6, 1], FOR: [6], PER: [-2], CHA: [-2], INT: [-4], VOL: [6] },
  def: 13, pv: 85, init: 8,
  att: [{ n: 'Bec et griffes', mod: 12, dmg: '2d8+10' }],
  caps: [
    { n: 'Sans esprit', d: "Immunisé à tous les sorts affectant l'esprit." },
    { n: 'Résistance aux DM', d: "DM d'armes divisés par deux, sauf armes tranchantes." },
    { n: 'Lenteur', d: "Déplacement de 5 m par action de mouvement." },
    { n: 'Insensible à la douleur', d: "+3 × NC aux PV, -5 à la DEF, peut encore agir une fois après 0 PV." }
  ]
}

);
