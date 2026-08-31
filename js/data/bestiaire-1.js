/* ============================================================
   COF2 Compagnon — Bestiaire (1/3) : humanoïdes & animaux
   Profils de créatures du livre de base, chapitre « Opposition ».
   ============================================================ */
window.COF = window.COF || {};
COF.BESTIAIRE = COF.BESTIAIRE || [];

/* Environnements — les cinq milieux naturels du livre (voie du maître de
   la nature) plus trois milieux construits, pour le générateur de rencontres. */
COF.ENVIRONNEMENTS = [
  { id: 'foret',      nom: 'Forêt & jungle',        ic: '🌲' },
  { id: 'plaine',     nom: 'Plaines & déserts',     ic: '🌾' },
  { id: 'montagne',   nom: 'Montagnes & collines',  ic: '⛰️' },
  { id: 'marais',     nom: 'Marais & eaux',         ic: '🌊' },
  { id: 'souterrain', nom: 'Grottes & profondeurs', ic: '🕳️' },
  { id: 'arctique',   nom: 'Terres glacées',        ic: '❄️' },
  { id: 'urbain',     nom: 'Villes & villages',     ic: '🏘️' },
  { id: 'ruines',     nom: 'Ruines & donjons',      ic: '🏚️' }
];

COF.CAT_CREATURES = [
  { id: 'humanoide',   nom: 'Humanoïdes' },
  { id: 'animal',      nom: 'Animaux' },
  { id: 'fantastique', nom: 'Créatures fantastiques' }
];

/* Champs d'une créature :
   id, nom, cat, nc (nombre : 0,5 = « 1/2 »), ncLabel, taille, type
   env  : liste d'environnements où la rencontrer
   car  : { AGI:[valeur, supérieure?], ... }
   def, pv, init, rd
   att  : [{ n, mod, dmg, portee?, note? }]
   caps : [{ n, a?, d }]
   desc : présentation courte
   groupe : nom du groupe pour les variantes (bandits, gardes...)        */

COF.BESTIAIRE.push(

/* ---------------------------------------------------------- HUMANOÏDES */
{
  id: 'assassin', nom: 'Assassin', cat: 'humanoide', nc: 4, ncLabel: '4',
  type: 'Humanoïde', taille: 'Moyenne', env: ['urbain', 'ruines'],
  desc: "Professionnel du meurtre. Il n'attaque jamais un groupe de front : il frappe par surprise un PJ isolé puis disparaît dans les ombres.",
  car: { AGI: [3, 1], CON: [3], FOR: [2], PER: [2, 1], CHA: [1], INT: [1], VOL: [2] },
  def: 17, pv: 40, init: 15,
  att: [{ n: 'Épée courte', mod: 7, dmg: '1d6+3', note: '2 attaques' }],
  caps: [
    { n: 'Attaque mortelle', a: 'A', d: "De dos ou par surprise : dé bonus en attaque et +4d6 aux DM sur la première attaque (la seconde reste normale)." },
    { n: 'Assassinat', a: 'L', d: "Au premier round contre une cible surprise, une Attaque mortelle réussie l'oblige à réussir un test de CON difficulté 13 ou tomber à 0 PV." },
    { n: 'Disparition', a: 'L', d: "Devient invisible et se déplace de 20 m. Il réapparaît à son tour et, s'il l'emporte sur un test opposé d'AGI (+5) contre la PER de sa cible, peut porter une Attaque mortelle." }
  ]
},
{
  id: 'bandit', nom: 'Bandit', cat: 'humanoide', nc: 0.5, ncLabel: '1/2',
  groupe: 'Bandits', type: 'Humanoïde', taille: 'Moyenne', env: ['foret', 'plaine', 'montagne', 'urbain'],
  desc: "Brigand des routes, pillard ou soldat démobilisé. Quatre bandits menés par un vétéran forment une rencontre soutenue pour un groupe de niveau 2.",
  car: { AGI: [1, 1], CON: [1], FOR: [1], PER: [0], CHA: [0], INT: [0], VOL: [-1] },
  def: 12, pv: 9, init: 10,
  att: [
    { n: 'Épée longue', mod: 2, dmg: '1d8+1' },
    { n: 'Arc', mod: 2, dmg: '1d6', portee: 30 }
  ],
  caps: [{ n: 'Embuscade', d: "Au premier round, si le terrain permet de se dissimuler, la cible doit réussir un test de PER difficulté 16 ou être surprise." }]
},
{
  id: 'bandit_veteran', nom: 'Bandit vétéran', cat: 'humanoide', nc: 1, ncLabel: '1',
  groupe: 'Bandits', type: 'Humanoïde', taille: 'Moyenne', env: ['foret', 'plaine', 'montagne', 'urbain'],
  desc: "Un brigand aguerri, souvent chef d'une bande de petites frappes.",
  car: { AGI: [1, 1], CON: [3], FOR: [2], PER: [0, 1], CHA: [0], INT: [0], VOL: [0] },
  def: 14, pv: 15, init: 13,
  att: [
    { n: 'Épée longue', mod: 4, dmg: '1d8+2' },
    { n: 'Arc', mod: 3, dmg: '1d6', portee: 30 }
  ],
  caps: [{ n: 'Embuscade', d: "Au premier round, si le terrain permet de se dissimuler, la cible doit réussir un test de PER difficulté 16 ou être surprise." }]
},
{
  id: 'chef_bandit', nom: 'Chef bandit', cat: 'humanoide', nc: 2, ncLabel: '2',
  groupe: 'Bandits', type: 'Humanoïde', taille: 'Moyenne', env: ['foret', 'plaine', 'montagne', 'urbain'],
  desc: "Un chef avec deux lieutenants vétérans et huit bandits forme une rencontre difficile de niveau 3.",
  car: { AGI: [2, 1], CON: [3], FOR: [3], PER: [0, 1], CHA: [2], INT: [0], VOL: [2] },
  def: 16, pv: 25, init: 13,
  att: [
    { n: 'Épée longue', mod: 6, dmg: '1d8+3' },
    { n: 'Arc', mod: 5, dmg: '1d6+2', portee: 30 }
  ],
  caps: [
    { n: 'Embuscade', d: "Au premier round, si le terrain permet de se dissimuler, la cible doit réussir un test de PER difficulté 16 ou être surprise." },
    { n: 'Attaque en traître', a: 'L', d: "En attaquant en même temps qu'un allié ou par surprise : +1d4 DM." },
    { n: 'Chef', d: "+1 en Init., en attaque et aux DM à tous les bandits à portée de vue." }
  ]
},
{
  id: 'milicien', nom: 'Milicien', cat: 'humanoide', nc: 0.5, ncLabel: '1/2',
  groupe: 'Gardes', type: 'Humanoïde', taille: 'Moyenne', env: ['urbain'],
  desc: "Simple citoyen sommairement entraîné et armé pour défendre son village ou patrouiller.",
  car: { AGI: [0], CON: [1], FOR: [1], PER: [0], CHA: [0], INT: [-1], VOL: [-1] },
  def: 14, pv: 9, init: 10,
  att: [{ n: 'Pique', mod: 2, dmg: '1d10+1' }],
  caps: []
},
{
  id: 'garde_ville', nom: 'Garde de la ville', cat: 'humanoide', nc: 1, ncLabel: '1',
  groupe: 'Gardes', type: 'Humanoïde', taille: 'Moyenne', env: ['urbain'],
  desc: "Garde professionnel, mieux équipé et entraîné qu'un simple milicien.",
  car: { AGI: [0], CON: [1], FOR: [2], PER: [0], CHA: [0], INT: [-1], VOL: [0] },
  def: 16, pv: 15, init: 10,
  att: [
    { n: 'Épée longue', mod: 4, dmg: '1d8+2' },
    { n: 'Arbalète', mod: 4, dmg: '2d4', portee: 30 }
  ],
  caps: []
},
{
  id: 'veteran_garde', nom: 'Vétéran / garde ducal', cat: 'humanoide', nc: 2, ncLabel: '2',
  groupe: 'Gardes', type: 'Humanoïde', taille: 'Moyenne', env: ['urbain'],
  desc: "Un vétéran ou un garde de palais ducal, qui a connu la guerre ou fait partie d'une force d'élite.",
  car: { AGI: [0], CON: [2, 1], FOR: [2], PER: [0, 1], CHA: [0], INT: [0], VOL: [1] },
  def: 17, pv: 25, init: 13,
  att: [
    { n: 'Épée longue', mod: 6, dmg: '1d8+4' },
    { n: 'Arbalète lourde', mod: 6, dmg: '3d4', portee: 50 }
  ],
  caps: [
    { n: 'Choisir une capacité parmi les trois suivantes', d: "Brise-genou, Imparable ou Sergent." },
    { n: 'Brise-genou', d: "Attaque de contact gratuite contre un adversaire au contact qui tente de s'éloigner. Si elle réussit, la cible doit réussir un test de CON difficulté 15 ou voir son déplacement divisé par deux." },
    { n: 'Imparable', d: "Sur 15-20 au d20 (17-20 avec 2 attaques) : +2d4 DM et l'attaque réussit automatiquement quelle que soit la DEF." },
    { n: 'Sergent', a: 'G', d: "1×/round : donne une action supplémentaire (attaque ou mouvement) à un allié sous ses ordres en vue. 1×/combat, ignore une attaque qui l'aurait amené à 0 PV." }
  ]
},
{
  id: 'capitaine', nom: 'Capitaine', cat: 'humanoide', nc: 4, ncLabel: '4',
  groupe: 'Gardes', type: 'Humanoïde', taille: 'Moyenne', env: ['urbain'],
  desc: "Officier ayant gravi les échelons par ses compétences, ou bien né et doté du meilleur équipement.",
  car: { AGI: [1], CON: [2, 1], FOR: [3], PER: [0], CHA: [2], INT: [1], VOL: [2] },
  def: 18, pv: 50, init: 10,
  att: [{ n: 'Épée longue', mod: 8, dmg: '1d8+3', note: '2 attaques' }],
  caps: [
    { n: 'Capitaine', d: "+2 en Initiative, en attaque et aux DM à toutes les créatures sous ses ordres à portée de vue." },
    { n: 'Riposte', d: "Attaque gratuite contre chaque adversaire qui l'attaque, sauf celui qu'il a lui-même choisi d'attaquer à son tour." }
  ]
},
{
  id: 'garde_corps', nom: 'Garde du corps', cat: 'humanoide', nc: 3, ncLabel: '3',
  type: 'Humanoïde', taille: 'Moyenne', env: ['urbain'],
  desc: "Guerrier en armure chargé de protéger un marchand, un politicien ou un magicien.",
  car: { AGI: [1], CON: [3], FOR: [3], PER: [0, 1], CHA: [0], INT: [0], VOL: [2] },
  def: 20, pv: 45, init: 13,
  att: [{ n: 'Épée longue', mod: 6, dmg: '1d8+3' }],
  caps: [
    { n: 'Garde du corps', d: "Désigne gratuitement une cible à son contact chaque round (créature ou objet) : elle réduit de 5 tous les DM subis. Il ne peut pas se désigner lui-même." },
    { n: 'Inamovible', d: "Immunisé aux états surpris, immobilisé et renversé ; ne peut être désarmé. Ne subit aucun DM d'Attaque sournoise ou capacité similaire." }
  ]
},
{
  id: 'sorcier_pnj', nom: 'Sorcier', cat: 'humanoide', nc: 5, ncLabel: '5',
  type: 'Humanoïde', taille: 'Moyenne', env: ['urbain', 'ruines', 'souterrain'],
  desc: "L'archétype du vil sorcier qui trafique avec la mort et les démons.",
  car: { AGI: [1], CON: [1], FOR: [-1], PER: [0], CHA: [1], INT: [3], VOL: [3] },
  def: 18, pv: 45, init: 10,
  att: [
    { n: 'Dague', mod: 6, dmg: '1d4+2+2d6', note: 'poison' },
    { n: 'Attaque magique', mod: 10, dmg: '' }
  ],
  caps: [
    { n: 'Animer un cadavre', a: 'L', d: "Anime le cadavre d'une créature (portée 10 m) pour le combat : mêmes caractéristiques mais -2 en attaque, en DEF et en Init." },
    { n: 'Injonction mortelle', a: 'L', d: "Cible à 30 m : test de CON difficulté 15 ou elle tombe à 0 PV. En cas de succès, elle subit tout de même des DM." },
    { n: "Pas de l'ombre", a: 'L', d: "Le sorcier se déplace instantanément d'ombre en ombre." },
    { n: 'Vampirisation', a: 'L', d: "Test opposé d'attaque magique contre une cible vivante à 30 m : 2d8 DM et le sorcier récupère autant de PV." }
  ]
},

/* ------------------------------------------------------------- ANIMAUX */
{
  id: 'aigle', nom: 'Aigle commun', cat: 'animal', nc: 0.5, ncLabel: '1/2',
  taille: 'Très petite', env: ['montagne', 'plaine', 'foret'],
  desc: "Correspond à tous les oiseaux de proie de grande taille (environ 2 m d'envergure).",
  car: { AGI: [4, 1], CON: [-2], FOR: [-2], PER: [4, 1], CHA: [-2], INT: [-4], VOL: [0] },
  def: 13, pv: 3, init: 16,
  att: [{ n: 'Serres', mod: 3, dmg: '1d4' }],
  caps: [
    { n: 'Vol rapide', d: "Action de mouvement supplémentaire par round en vol. Au premier round : dé bonus en attaque et +1d4 aux DM contre une cible au sol." },
    { n: 'Emporter dans les airs', d: "Peut emporter une créature de taille minuscule ou moins." }
  ]
},
{
  id: 'animal_minuscule', nom: 'Animal minuscule', cat: 'animal', nc: 0, ncLabel: '0',
  taille: 'Minuscule', env: ['foret', 'plaine', 'urbain', 'souterrain'],
  desc: "Souris, moineau, grenouille…",
  car: { AGI: [3, 1], CON: [-4], FOR: [-4], PER: [2, 1], CHA: [-2], INT: [-4], VOL: [-2] },
  def: 13, pv: 1, init: 16,
  att: [{ n: 'Morsure', mod: 1, dmg: '0' }],
  caps: [
    { n: 'Minuscule', d: "+10 aux tests d'escalade et de discrétion." },
    { n: 'Attaques ridicules', d: "N'inflige aucun DM, sauf sur une réussite critique (1 DM)." }
  ]
},
{
  id: 'animal_tres_petit', nom: 'Animal très petit', cat: 'animal', nc: 0, ncLabel: '0',
  taille: 'Très petite', env: ['foret', 'plaine', 'urbain', 'souterrain'],
  desc: "Chat, corbeau, serpent inoffensif…",
  car: { AGI: [3, 1], CON: [-3], FOR: [-3], PER: [2, 1], CHA: [-2], INT: [-4], VOL: [0] },
  def: 13, pv: 2, init: 16,
  att: [{ n: 'Morsure', mod: 2, dmg: '1' }],
  caps: [{ n: 'Très petit', d: "+5 aux tests d'escalade et de discrétion." }]
},
{
  id: 'animal_petit', nom: 'Animal petit', cat: 'animal', nc: 0, ncLabel: '0',
  taille: 'Petite', env: ['foret', 'plaine', 'urbain'],
  desc: "Gros chien, renard, blaireau… (l'aigle possède son propre profil).",
  car: { AGI: [2, 1], CON: [-2], FOR: [-2], PER: [2, 1], CHA: [-2], INT: [-4], VOL: [0] },
  def: 13, pv: 3, init: 15,
  att: [{ n: 'Morsure', mod: 3, dmg: '1d6-2' }],
  caps: []
},
{
  id: 'cheval_selle', nom: 'Cheval de selle', cat: 'animal', nc: 1, ncLabel: '1',
  taille: 'Grande', env: ['plaine', 'urbain'],
  desc: "Un cheval de selle n'est pas apte au stress du combat : son cavalier subit un dé malus à toutes ses actions en selle en situation de combat.",
  car: { AGI: [0], CON: [4, 1], FOR: [4], PER: [0], CHA: [-1], INT: [-4], VOL: [-2] },
  def: 11, pv: 14, init: 10,
  att: [{ n: 'Ruade', mod: 2, dmg: '1d4+4' }],
  caps: [{ n: 'Monture', d: "La créature double sa FOR pour porter une charge." }]
},
{
  id: 'cheval_guerre', nom: 'Cheval de guerre', cat: 'animal', nc: 1, ncLabel: '1',
  taille: 'Grande', env: ['plaine', 'urbain'],
  desc: "Dressé pour la bataille, il ne souffre d'aucune pénalité en combat.",
  car: { AGI: [0], CON: [4, 1], FOR: [5], PER: [0], CHA: [-1], INT: [-4], VOL: [0] },
  def: 11, pv: 14, init: 10,
  att: [{ n: 'Ruade', mod: 4, dmg: '1d4+5' }],
  caps: [{ n: 'Monture', d: "Double sa FOR pour porter une charge. Peut porter une barde : caparaçon de mailles +2 DEF (100 pa), barde de plaques +4 DEF (300 pa), avec un malus d'Init. égal au bonus." }]
},
{
  id: 'crocodile', nom: 'Crocodile', cat: 'animal', nc: 2, ncLabel: '2',
  taille: 'Moyenne', env: ['marais'],
  desc: "Correspond à tous les grands lézards à forte dentition (alligator, varan) d'environ 3 m.",
  car: { AGI: [0, 1], CON: [3], FOR: [4, 1], PER: [2, 1], CHA: [-2], INT: [-4], VOL: [2] },
  def: 15, pv: 15, init: 15,
  att: [{ n: 'Morsure', mod: 4, dmg: '1d6+3' }],
  caps: [
    { n: 'Embuscade', d: "Au premier round, si le terrain permet de se dissimuler : test de PER difficulté 15 ou surprise. Dé bonus en attaque contre une cible surprise." },
    { n: 'Dévorer', d: "Sur 15-20 au d20 en attaque, saisit sa proie et lui inflige immédiatement une attaque gratuite supplémentaire." }
  ]
},
{
  id: 'bison', nom: 'Bison', cat: 'animal', nc: 2, ncLabel: '2',
  groupe: 'Bison', taille: 'Grande', env: ['plaine'],
  desc: "Correspond à tous les grands herbivores à cornes (taureau, etc.). Les femelles fuient, sauf pour défendre un petit.",
  car: { AGI: [0], CON: [4, 1], FOR: [4], PER: [2], CHA: [-2], INT: [-4], VOL: [-2] },
  def: 14, pv: 30, init: 12,
  att: [{ n: 'Cornes', mod: 5, dmg: '1d6+4' }],
  caps: [{ n: 'Charge', a: 'L', d: "Parcourt jusqu'à 20 m et attaque avec un dé bonus. Si l'attaque réussit, une victime de taille inférieure ou égale doit réussir un test de FOR difficulté 14 ou être renversée." }]
},
{
  id: 'bison_grand_male', nom: 'Bison — grand mâle', cat: 'animal', nc: 3, ncLabel: '3',
  groupe: 'Bison', taille: 'Grande', env: ['plaine'],
  desc: "Un vieux mâle dominant, bien plus dangereux que le reste du troupeau.",
  car: { AGI: [0], CON: [6, 1], FOR: [6], PER: [2], CHA: [-2], INT: [-4], VOL: [0] },
  def: 15, pv: 40, init: 12,
  att: [{ n: 'Cornes', mod: 8, dmg: '2d6+6' }],
  caps: [{ n: 'Charge', a: 'L', d: "Parcourt jusqu'à 20 m et attaque avec un dé bonus ; test de FOR difficulté 14 pour ne pas être renversé." }]
},
{
  id: 'elephant', nom: 'Éléphant', cat: 'animal', nc: 6, ncLabel: '6',
  taille: 'Énorme', env: ['plaine', 'foret'],
  desc: "Correspond à un éléphant d'Afrique moyen.",
  car: { AGI: [0], CON: [10, 1], FOR: [10, 1], PER: [1], CHA: [-2], INT: [-4], VOL: [0] },
  def: 21, pv: 90, init: 11, rd: 3,
  att: [{ n: 'Trompe et défenses', mod: 12, dmg: '2d10+12' }],
  caps: [
    { n: 'Charge', a: 'L', d: "Parcourt jusqu'à 20 m et attaque avec un dé bonus ; test de FOR difficulté 20 pour ne pas être renversé." },
    { n: 'Fauchage', d: "Sur 15-20 en attaque réussie, la victime doit réussir un test de FOR ou d'AGI difficulté 20 ou être renversée." },
    { n: 'Grand mâle', d: "Un grand mâle a un NC augmenté de 1, +2 en attaque, en DEF et aux DM, et +20 PV." }
  ]
},
{
  id: 'gorille', nom: 'Gorille', cat: 'animal', nc: 3, ncLabel: '3',
  taille: 'Grande', env: ['foret'],
  desc: "Placide si on ne le dérange pas — mais rien n'empêche d'en faire une version fantastique bien plus agressive.",
  car: { AGI: [4, 1], CON: [5, 1], FOR: [5, 1], PER: [2], CHA: [-2], INT: [-3], VOL: [0] },
  def: 18, pv: 30, init: 12,
  att: [{ n: 'Poings et morsure', mod: 7, dmg: '2d6+5' }],
  caps: [
    { n: 'Charge', a: 'L', d: "Parcourt jusqu'à 20 m et attaque avec un dé bonus ; test de FOR difficulté 15 pour ne pas être renversé." },
    { n: 'Passage par les arbres', d: "Se déplace aussi vite dans les arbres qu'au sol et obtient +5 en discrétion en forêt." }
  ]
},
{
  id: 'lion', nom: 'Lion', cat: 'animal', nc: 3, ncLabel: '3',
  groupe: 'Lion', taille: 'Grande', env: ['plaine'],
  desc: "Correspond à un jeune lion ou à une lionne d'environ 150 kg.",
  car: { AGI: [4, 1], CON: [5], FOR: [5], PER: [2, 1], CHA: [-2], INT: [-3], VOL: [0] },
  def: 17, pv: 30, init: 15,
  att: [{ n: 'Morsure et griffes', mod: 6, dmg: '2d6+5' }],
  caps: [
    { n: 'Embuscade', d: "Au premier round, si le terrain permet de se dissimuler : test de PER difficulté 19 ou surprise. Contre une cible surprise : +1d4 aux DM." },
    { n: 'Dévorer', d: "Sur 15-20 au d20 en attaque, saisit sa proie et lui inflige immédiatement une attaque gratuite supplémentaire." }
  ]
},
{
  id: 'lion_grand_male', nom: 'Lion — grand mâle', cat: 'animal', nc: 4, ncLabel: '4',
  groupe: 'Lion', taille: 'Grande', env: ['plaine'],
  desc: "Le mâle dominant d'une troupe, à la crinière imposante.",
  car: { AGI: [4, 1], CON: [6], FOR: [6], PER: [2, 1], CHA: [-2], INT: [-3], VOL: [2] },
  def: 18, pv: 50, init: 15,
  att: [{ n: 'Morsure et griffes', mod: 8, dmg: '2d6+8' }],
  caps: [
    { n: 'Embuscade', d: "Comme le lion : test de PER difficulté 19 ou surprise ; +1d4 aux DM contre une cible surprise." },
    { n: 'Dévorer', d: "Sur 15-20 au d20 en attaque : attaque gratuite supplémentaire immédiate." }
  ]
},
{
  id: 'loup', nom: 'Loup', cat: 'animal', nc: 1, ncLabel: '1',
  groupe: 'Loup', taille: 'Moyenne', env: ['foret', 'montagne', 'arctique'],
  desc: "Correspond à un loup d'une cinquantaine de kilogrammes. Sert aussi de profil pour les gros chiens (retirez 2 à 4 PV).",
  car: { AGI: [1], CON: [1, 1], FOR: [1], PER: [2, 1], CHA: [-2], INT: [-4], VOL: [0] },
  def: 13, pv: 9, init: 15,
  att: [{ n: 'Morsure', mod: 3, dmg: '1d6+1' }],
  caps: [{ n: 'Interchangeables', d: "Tant que la meute est plus nombreuse que la cible, les loups se relaient pour esquiver : +3 en DEF." }]
},
{
  id: 'loup_alpha', nom: 'Loup — mâle alpha', cat: 'animal', nc: 2, ncLabel: '2',
  groupe: 'Loup', taille: 'Moyenne', env: ['foret', 'montagne', 'arctique'],
  desc: "Le chef de la meute, plus gros et plus rusé que les autres.",
  car: { AGI: [1, 1], CON: [3, 1], FOR: [3], PER: [2, 1], CHA: [-2], INT: [-4], VOL: [2] },
  def: 15, pv: 15, init: 15,
  att: [{ n: 'Morsure', mod: 4, dmg: '1d6+3' }],
  caps: [{ n: 'Chef de meute', d: "+2 en Initiative, en attaque et aux DM à tous les loups de sa meute à portée de vue. S'il attaque en même temps qu'un autre loup : dé bonus et +2d4 DM." }]
},
{
  id: 'ours_noir', nom: 'Ours noir', cat: 'animal', nc: 2, ncLabel: '2',
  groupe: 'Ours', taille: 'Moyenne', env: ['foret', 'montagne'],
  desc: "Correspond aux espèces d'ours de taille modeste.",
  car: { AGI: [2, 1], CON: [3], FOR: [3, 1], PER: [2], CHA: [-2], INT: [-4], VOL: [0] },
  def: 17, pv: 35, init: 12,
  att: [{ n: 'Morsure et griffes', mod: 6, dmg: '2d6+3' }],
  caps: []
},
{
  id: 'ours_brun', nom: 'Ours brun', cat: 'animal', nc: 4, ncLabel: '4',
  groupe: 'Ours', taille: 'Grande', env: ['foret', 'montagne'],
  desc: "Un grizzly ou un ours des cavernes, redoutable même pour un groupe aguerri.",
  car: { AGI: [1], CON: [6, 1], FOR: [6], PER: [2], CHA: [-2], INT: [-4], VOL: [1] },
  def: 18, pv: 50, init: 12,
  att: [{ n: 'Morsure et griffes', mod: 10, dmg: '2d6+6' }],
  caps: [
    { n: 'Charge', a: 'L', d: "Parcourt jusqu'à 20 m et attaque avec un dé bonus ; test de FOR difficulté 16 pour ne pas être renversé." },
    { n: 'Enragé', d: "Sur un coup critique subi, la créature s'enrage : ignore douleur et peur, +3 en attaque au contact, +1d4 DM, et peut agir un tour complet après être tombée à 0 PV." }
  ]
},
{
  id: 'ours_polaire', nom: 'Ours polaire', cat: 'animal', nc: 6, ncLabel: '6',
  groupe: 'Ours', taille: 'Grande', env: ['arctique'],
  desc: "Le plus grand des ours, prédateur exclusif des banquises.",
  car: { AGI: [0], CON: [8, 1], FOR: [8, 1], PER: [2], CHA: [-2], INT: [-4], VOL: [1] },
  def: 20, pv: 80, init: 12,
  att: [{ n: 'Morsure et griffes', mod: 12, dmg: '2d8+10' }],
  caps: [
    { n: 'Charge', a: 'L', d: "Parcourt jusqu'à 20 m et attaque avec un dé bonus ; test de FOR difficulté 16 pour ne pas être renversé." },
    { n: 'Dévorer', d: "Sur 15-20 au d20 en attaque : attaque gratuite supplémentaire immédiate." },
    { n: 'Enragé', d: "Sur un coup critique subi : ignore douleur et peur, +3 en attaque, +1d4 DM, agit encore un tour après 0 PV." }
  ]
},
{
  id: 'panthere', nom: 'Panthère', cat: 'animal', nc: 2, ncLabel: '2',
  taille: 'Moyenne', env: ['foret'],
  desc: "Convient à tous les grands félins solitaires et arboricoles (léopard, puma, jaguar).",
  car: { AGI: [4, 1], CON: [2], FOR: [2], PER: [2, 1], CHA: [-2], INT: [-4], VOL: [1] },
  def: 16, pv: 15, init: 15,
  att: [{ n: 'Morsure et griffes', mod: 5, dmg: '1d6+2' }],
  caps: [
    { n: 'Embuscade', d: "Au premier round, si le terrain permet de se dissimuler : test de PER difficulté 19 ou surprise ; +1d4 DM contre une cible surprise." },
    { n: 'Dévorer', d: "Sur 15-20 au d20 en attaque : attaque gratuite supplémentaire immédiate." }
  ]
},
{
  id: 'requin', nom: 'Requin', cat: 'animal', nc: 4, ncLabel: '4',
  taille: 'Grande', env: ['marais'],
  desc: "Un grand requin des mers profondes, attiré par le sang.",
  car: { AGI: [3], CON: [5], FOR: [5], PER: [0], CHA: [-3], INT: [-4], VOL: [2] },
  def: 18, pv: 50, init: 13,
  att: [{ n: 'Morsure', mod: 10, dmg: '2d8+5' }],
  caps: [
    { n: 'Dévorer', d: "Sur 15-20 au d20, saisit sa proie entre ses crocs et lui inflige une attaque gratuite supplémentaire. Si la FOR de la cible est inférieure, elle est de plus immobilisée." },
    { n: 'Créature aquatique', d: "Aucune pénalité pour attaquer et se déplacer sous l'eau, et +3 en Initiative." }
  ]
},
{
  id: 'rhinoceros', nom: 'Rhinocéros', cat: 'animal', nc: 4, ncLabel: '4',
  taille: 'Grande', env: ['plaine'],
  desc: "De 3 à 4 m de long pour 800 kg à 2 t selon les espèces.",
  car: { AGI: [0], CON: [8, 1], FOR: [8, 1], PER: [0], CHA: [-2], INT: [-4], VOL: [0] },
  def: 18, pv: 50, init: 10,
  att: [{ n: 'Corne', mod: 8, dmg: '2d6+8' }],
  caps: [
    { n: 'Charge', a: 'L', d: "Parcourt jusqu'à 20 m et attaque avec un dé bonus ; test de FOR difficulté 18 pour ne pas être renversé." },
    { n: 'Enragé', d: "Sur un coup critique subi : ignore douleur et peur, +3 en attaque, +1d4 DM, agit encore un tour après 0 PV." }
  ]
},
{
  id: 'sanglier', nom: 'Sanglier', cat: 'animal', nc: 3, ncLabel: '3',
  taille: 'Moyenne', env: ['foret'],
  desc: "Les mâles solitaires sont particulièrement agressifs et imprévisibles.",
  car: { AGI: [0], CON: [3, 1], FOR: [3, 1], PER: [1], CHA: [-2], INT: [-4], VOL: [2] },
  def: 16, pv: 20, init: 11,
  att: [{ n: 'Défenses', mod: 6, dmg: '2d4+3' }],
  caps: [
    { n: 'Charge', a: 'L', d: "Parcourt jusqu'à 20 m et attaque avec un dé bonus ; test de FOR difficulté 13 pour ne pas être renversé." },
    { n: 'Tape dur', d: "Sur 15-20 au dé d'attaque, l'attaque réussit automatiquement et la victime doit réussir un test de CON difficulté 13 ou être étourdie 1 round." },
    { n: 'Enragé', d: "Sur un coup critique subi : ignore douleur et peur, +3 en attaque, +1d4 DM, agit encore un tour après 0 PV." }
  ]
},
{
  id: 'serpent_constricteur', nom: 'Serpent constricteur', cat: 'animal', nc: 3, ncLabel: '3',
  taille: 'Moyenne', env: ['marais', 'foret'],
  desc: "Un python ou un anaconda, qui étouffe ses proies dans ses anneaux.",
  car: { AGI: [0], CON: [4], FOR: [4, 1], PER: [0, 1], CHA: [-2], INT: [-4], VOL: [0] },
  def: 15, pv: 30, init: 13,
  att: [{ n: 'Morsure', mod: 4, dmg: '1d6+4', note: '+ étreinte' }],
  caps: [
    { n: 'Embuscade', d: "Au premier round, si le terrain permet de se dissimuler : test de PER difficulté 15 ou surprise ; +1d4 DM contre une cible surprise." },
    { n: 'Étreinte', d: "Sur chaque attaque réussie, la cible doit réussir un test de FOR ou d'AGI difficulté 10 ou être enserrée : 1d4 DM automatiques par round." }
  ]
},
{
  id: 'serpent_venimeux', nom: 'Serpent venimeux', cat: 'animal', nc: 1, ncLabel: '1',
  taille: 'Très petite', env: ['marais', 'foret', 'plaine', 'souterrain'],
  desc: "Vipère, cobra ou serpent corail — petit, discret et potentiellement mortel.",
  car: { AGI: [3, 1], CON: [0, 1], FOR: [-3], PER: [2], CHA: [-2], INT: [-4], VOL: [-2] },
  def: 15, pv: 2, init: 12,
  att: [{ n: 'Morsure', mod: 3, dmg: '1', note: '+ venin' }],
  caps: [
    { n: 'Embuscade', d: "Au premier round, si le terrain permet de se dissimuler : test de PER difficulté 15 ou surprise. +5 à tous les tests de discrétion." },
    { n: 'Venin', d: "Test de CON difficulté 15 à chaque morsure. Échec : 1 DM par round pendant 1d6 rounds, et affaibli pour autant d'heures. Chaque nouvelle morsure allonge la durée." },
    { n: 'Crachat', a: 'A', d: "Certains serpents crachent leur venin dans les yeux : test d'AGI difficulté 12 ou aveuglé pendant 1d6 rounds." }
  ]
}

);
