/* ============================================================
   COF2 Compagnon — Bestiaire (2/3) : créatures fantastiques A–G
   ============================================================ */
window.COF = window.COF || {};
COF.BESTIAIRE = COF.BESTIAIRE || [];

COF.BESTIAIRE.push(

{
  id: 'araignee_geante', nom: 'Araignée géante', cat: 'fantastique', nc: 3, ncLabel: '3',
  taille: 'Moyenne', env: ['foret', 'souterrain', 'ruines'],
  desc: "Arthropode rapide et résistant d'environ 2 m de diamètre, pattes comprises. On la trouve dans les forêts reculées et les souterrains.",
  car: { AGI: [4, 1], CON: [3, 1], FOR: [3, 1], PER: [2], CHA: [-4], INT: [-4], VOL: [0] },
  def: 17, pv: 30, init: 12,
  att: [{ n: 'Morsure', mod: 6, dmg: '2d6+4', note: '+ poison 2d6, difficulté 12' }],
  caps: [
    { n: 'Poison mortel', d: "Le poison inflige 2d6 DM supplémentaires à chaque attaque ; moitié si la victime réussit un test de CON difficulté 12." },
    { n: 'Vermine', d: "Peut encore agir un round complet à 0 PV. Se déplace de 15 m par action de mouvement." },
    { n: 'Variantes', d: "Choisissez un type de poison, puis soit Toile (L), soit Araignée chasseuse." },
    { n: 'Araignée chasseuse', d: "Embuscade : test de PER difficulté 19 ou surprise ; +1d4 DM contre une cible surprise." },
    { n: 'Toile', a: 'L', d: "Attaque réussie (portée 3 m) : la cible est immobilisée dans une toile gluante. Se libérer demande une action limitée et un test de FOR difficulté 12." }
  ]
},
{
  id: 'basilic', nom: 'Basilic', cat: 'fantastique', nc: 3, ncLabel: '3',
  taille: 'Grande', env: ['souterrain', 'ruines', 'plaine'],
  desc: "Reptile à huit pattes dont le regard change la chair en pierre.",
  car: { AGI: [0], CON: [3], FOR: [3, 1], PER: [2], CHA: [-1], INT: [-4], VOL: [0] },
  def: 17, pv: 30, init: 12,
  att: [{ n: 'Morsure', mod: 6, dmg: '2d6+4' }],
  caps: [
    { n: 'Regard pétrifiant', d: "Qui croise son regard est pétrifié. Sans conscience du danger : test de CON difficulté 15 à chaque round ou transformation en pierre, permanente." },
    { n: 'Détourner le regard', d: "En évitant simplement son regard : test de CON difficulté 10 au début de chaque tour ou pétrification, et dé malus en attaque." },
    { n: 'Fermer les yeux', d: "Le personnage est aveuglé (-5 en DEF et en attaque, ni tir ni sort ciblé) mais ne risque plus la pétrification, sauf sur un échec critique en attaque (test de CON difficulté 10)." }
  ]
},
{
  id: 'chimere', nom: 'Chimère', cat: 'fantastique', nc: 7, ncLabel: '7',
  groupe: 'Chimère', taille: 'Grande', env: ['montagne', 'ruines'],
  desc: "Monstre improbable mêlant trois animaux : corps de lion, tête de chèvre, queue de serpent et ailes.",
  car: { AGI: [1, 1], CON: [6], FOR: [6], PER: [2, 1], CHA: [-4], INT: [-2], VOL: [2] },
  def: 21, pv: 100, init: 15,
  att: [
    { n: 'Morsure, bec ou cornes', mod: 14, dmg: '1d6+6', note: '3 attaques' },
    { n: 'Morsure de serpent', mod: 14, dmg: '1d4+3', note: '+ poison' }
  ],
  caps: [
    { n: 'Poison', d: "1d6 DM de poison, puis test de CON difficulté 16 : échec = 1d6 DM supplémentaires par round pendant 5 rounds." },
    { n: 'Riposte sournoise', d: "Une créature qui attaque la chimère de dos subit une attaque de serpent supplémentaire." },
    { n: 'Vol rapide', d: "Action de mouvement supplémentaire par round en vol. Au premier round : dé bonus et +1d6 DM contre une cible au sol." }
  ]
},
{
  id: 'chimere_draconique', nom: 'Chimère draconique', cat: 'fantastique', nc: 7, ncLabel: '7',
  groupe: 'Chimère', taille: 'Grande', env: ['montagne', 'ruines'],
  desc: "Variante de la chimère dont la tête d'aigle est remplacée par une tête de dragon. Elle parle le draconique et reprend le profil de la chimère.",
  car: { AGI: [1, 1], CON: [6], FOR: [6], PER: [2, 1], CHA: [-4], INT: [-2], VOL: [2] },
  def: 21, pv: 100, init: 15,
  att: [
    { n: 'Morsure, bec ou cornes', mod: 14, dmg: '1d6+6', note: '3 attaques' },
    { n: 'Morsure de serpent', mod: 14, dmg: '1d4+3', note: '+ poison' },
    { n: 'Souffle', mod: 0, dmg: '6d6+9', note: 'automatique, cône 10 m' }
  ],
  caps: [
    { n: 'Souffle', a: 'L', d: "Zone conique de 10 m × 10 m, sans test d'attaque : 6d6+9 DM de l'élément de sa tête de dragon. DM divisés par deux sur un test d'AGI difficulté 15. Attendre 2d4 rounds entre deux usages." },
    { n: 'Poison', d: "1d6 DM de poison puis test de CON difficulté 16 : échec = 1d6 DM par round pendant 5 rounds." },
    { n: 'Riposte sournoise', d: "Attaque de serpent supplémentaire contre qui l'attaque de dos." },
    { n: 'Vol rapide', d: "Mouvement supplémentaire en vol ; dé bonus et +1d6 DM au premier round contre une cible au sol." }
  ]
},
{
  id: 'demonet', nom: 'Démonet', cat: 'fantastique', nc: 2, ncLabel: '2 (3)',
  type: 'Humanoïde', taille: 'Très petite', env: ['ruines', 'urbain', 'souterrain'],
  desc: "Démon miniature à tête humaine et ailes de chauve-souris, celui qui se perche sur votre épaule pour vous souffler des idées funestes.",
  car: { AGI: [3, 1], CON: [-2, 1], FOR: [-2], PER: [2, 1], CHA: [0], INT: [1], VOL: [-1] },
  def: 15, pv: 15, init: 15, rd: 5,
  att: [
    { n: 'Griffes et morsure', mod: 4, dmg: '1d4' },
    { n: 'Queue fourchue', mod: 4, dmg: '1', note: '+ venin' }
  ],
  caps: [
    { n: 'Venin', d: "Test de CON difficulté 10 ou affaibli pendant 1d6 min." },
    { n: 'Transformation', a: 'L', d: "Se transforme en n'importe quel animal de taille très petite, aussi longtemps qu'il le souhaite." },
    { n: 'Invisibilité', a: 'A', d: "Invisible pendant 1d4 min : indétectable et inattaquable directement. Attaquer met fin à l'effet." },
    { n: 'Vol', d: "Se déplace en vol de 10 m par action de mouvement." },
    { n: 'Démon', d: "Ne respire pas, ne dort pas, ne connaît pas la fatigue ; immunisé au poison et aux maladies non magiques." },
    { n: 'Résistance', d: "Tous les démons réduisent de 10 les DM de feu et d'acide. RD 5 contre les armes non magiques (+1 au NC si le groupe n'est pas équipé en conséquence)." },
    { n: 'Télépathie', d: "Communique avec toute créature par télépathie jusqu'à 50 m, sans langue commune. Parle l'abyssal." },
    { n: 'Téléportation', a: 'L', d: "Jusqu'à 3×/combat, se téléporte à un endroit vu ou connu à 200 m maximum." },
    { n: 'Tentation du mal', d: "Offre à un mortel de niveau inférieur à son NC un dé bonus à toutes ses actions pendant 24 h ; ensuite, le mortel est affaibli une semaine." },
    { n: 'Vision dans le noir', d: "Voit dans le noir comme en plein jour jusqu'à 30 m. Peut aussi invoquer à volonté une zone de ténèbres de 10 m de diamètre." }
  ]
},
{
  id: 'dragon_forets', nom: 'Dragon des forêts', cat: 'fantastique', nc: 10, ncLabel: '10',
  taille: 'Énorme', env: ['foret', 'montagne'],
  desc: "Un dragon adulte au souffle empoisonné, maître incontesté de son territoire forestier.",
  car: { AGI: [3, 1], CON: [8], FOR: [8], PER: [3, 1], CHA: [2], INT: [2], VOL: [5] },
  def: 24, pv: 140, init: 16,
  att: [
    { n: 'Morsure et griffes', mod: 14, dmg: '1d12+8', note: '2 attaques' },
    { n: 'Attaque magique', mod: 15, dmg: '' },
    { n: 'Souffle', mod: 0, dmg: '6d6+18', note: 'automatique, cône 15 m, poison' }
  ],
  caps: [
    { n: 'Souffle', a: 'L', d: "Nuage de gaz empoisonné dans un cône de 15 m × 15 m, sans test d'attaque : 6d6+18 DM de poison (retenir sa respiration est inutile). DM divisés par deux sur un test d'AGI réussi." },
    { n: 'Coup de queue', a: 'G', d: "Chaque adversaire qui attaque le dragon dans le dos subit une attaque de queue gratuite infligeant la moitié des DM." },
    { n: 'Emporter dans les airs', d: "Sur 17-20 en attaque, emporte une victime plus petite au prix d'une action de mouvement. Se libérer : test de FOR difficulté 18, puis 4d4° DM de chute." },
    { n: 'Immunités', d: "Immunisé au sommeil et à la paralysie, ne subit aucun DM de poison." },
    { n: 'Inspirer la terreur', d: "À sa première attaque, toutes les créatures à 30 m doivent réussir un test d'attaque magique contre 25 ou être affaiblies 1d4 rounds." },
    { n: 'Vol rapide', d: "Mouvement supplémentaire en vol ; dé bonus et +1d8 DM au premier round contre une cible au sol." }
  ]
},
{
  id: 'elementaire_eau', nom: "Élémentaire d'eau (grand)", cat: 'fantastique', nc: 5, ncLabel: '5',
  type: 'Non vivante', taille: 'Grande', env: ['marais'],
  desc: "Masse d'eau animée invoquée depuis le plan élémentaire, insaisissable et régénérante.",
  car: { AGI: [2], CON: [6, 1], FOR: [6], PER: [0], CHA: [-2], INT: [-2], VOL: [4] },
  def: 19, pv: 70, init: 10, rd: 3,
  att: [{ n: 'Coups', mod: 10, dmg: '1d8+6', note: '2 attaques' }],
  caps: [
    { n: 'Eau de vie', d: "Régénère 5 PV par round, sauf contre les DM de feu." },
    { n: 'Fauchage', d: "Sur 17-20 en attaque réussie : test de FOR ou d'AGI difficulté 16 ou renversé." },
    { n: 'Grand', d: "Retranche 3 à tous les DM subis (RD 3)." },
    { n: 'Résistance', d: "Divise par deux les DM des armes non magiques. Immunisé aux DM d'acide." },
    { n: 'Tourbillon', a: 'L', d: "1×/combat, se change en tourbillon liquide pendant 3 rounds : traverse créatures et objets à 10 m par action de mouvement." },
    { n: 'Vision', d: "Voit dans le noir à 30 m et localise toute créature en contact avec son élément à 30 m, même invisible." }
  ]
},
{
  id: 'geant_feu', nom: 'Géant du feu', cat: 'fantastique', nc: 9, ncLabel: '9',
  type: 'Humanoïde', taille: 'Énorme', env: ['montagne', 'souterrain'],
  desc: "Grande créature à la peau charbonneuse, aux cheveux et à la barbe de flammes, forgeron des terres volcaniques.",
  car: { AGI: [-1], CON: [12], FOR: [12, 1], PER: [2], CHA: [0], INT: [0], VOL: [0] },
  def: 25, pv: 160, init: 12, rd: 6,
  att: [
    { n: 'Marteau de guerre', mod: 14, dmg: '4d8+16' },
    { n: 'Lancer de rocher', mod: 14, dmg: '2d8+12', portee: 20 }
  ],
  caps: [
    { n: 'Fauchage', d: "Sur 15-20 en attaque réussie : test de FOR ou d'AGI difficulté 20 ou renversé." },
    { n: 'Balayage', d: "Un seul test d'attaque comparé à la DEF de deux créatures à son contact ; la cible secondaire subit la moitié des DM." },
    { n: 'Immunisé au feu', d: "Ne subit aucun DM de feu." }
  ]
},
{
  id: 'geoselachis', nom: 'Geoselachis', cat: 'fantastique', nc: 7, ncLabel: '7',
  taille: 'Grande', env: ['souterrain', 'plaine'],
  desc: "Le « requin terrestre » : une taupe géante à l'exosquelette impénétrable, capable de s'enterrer pour surprendre ses proies.",
  car: { AGI: [0, 1], CON: [8], FOR: [8], PER: [2, 1], CHA: [-2], INT: [-4], VOL: [2] },
  def: 22, pv: 110, init: 15,
  att: [{ n: 'Morsure et griffes', mod: 13, dmg: '1d12+8', note: '2 attaques' }],
  caps: [
    { n: 'Embuscade', d: "S'il peut se dissimuler sous terre : test de PER difficulté 15 ou surprise ; +1d6 DM contre une cible surprise." },
    { n: 'Encorner', d: "Sur 17-20 en attaque, encorne sa proie et lui inflige une attaque gratuite supplémentaire." },
    { n: 'Déplacement sous terre', d: "Creuse 5 m par action de mouvement dans un sol meuble ; le tunnel s'effondre derrière lui." }
  ]
},
{
  id: 'gnoll', nom: 'Gnoll', cat: 'fantastique', nc: 1, ncLabel: '1',
  groupe: 'Gnolls', type: 'Humanoïde', taille: 'Moyenne', env: ['plaine', 'foret', 'ruines'],
  desc: "Humanoïde de plus de 2 m à tête d'hyène et fourrure jaune sale, qui chasse en meute hilare.",
  car: { AGI: [0], CON: [3], FOR: [3], PER: [0], CHA: [-2], INT: [-2], VOL: [-2] },
  def: 14, pv: 15, init: 10,
  att: [{ n: 'Hache', mod: 4, dmg: '1d8+3' }],
  caps: [{ n: 'Rires insupportables', d: "Chaque round, un PJ au contact de gnolls doit réussir un test de VOL difficulté [5 + nombre de gnolls à son contact] ou subir un dé malus en attaque." }]
},
{
  id: 'meute_gnolls', nom: 'Meute de gnolls', cat: 'fantastique', nc: 2, ncLabel: '+1 par meute',
  groupe: 'Gnolls', type: 'Humanoïde', taille: 'Moyenne', env: ['plaine', 'foret', 'ruines'],
  desc: "Au moins trois gnolls chassant ensemble. Leur NC augmente de +1 quand ils forment une meute.",
  car: { AGI: [0], CON: [3], FOR: [3], PER: [0], CHA: [-2], INT: [-2], VOL: [-2] },
  def: 14, pv: 15, init: 10,
  att: [{ n: 'Hache', mod: 4, dmg: '1d8+3' }],
  caps: [
    { n: 'Interchangeables', d: "Tant que les gnolls sont plus nombreux que la cible, ils se relaient pour esquiver : +3 en DEF." },
    { n: "L'hallali", d: "Chaque fois que la victime rate une attaque ou obtient 1 à 5 au d20, elle déclenche la curée : chaque gnoll à son contact porte une attaque gratuite." },
    { n: 'Rires insupportables', d: "Test de VOL difficulté [5 + nombre de gnolls au contact] ou dé malus en attaque." }
  ]
},
{
  id: 'sergent_gnoll', nom: 'Sergent gnoll', cat: 'fantastique', nc: 2, ncLabel: '2',
  groupe: 'Gnolls', type: 'Humanoïde', taille: 'Moyenne', env: ['plaine', 'foret', 'ruines'],
  desc: "Un gnoll plus grand et plus brutal, qui tient la meute par la peur.",
  car: { AGI: [0], CON: [4], FOR: [4], PER: [0], CHA: [-1], INT: [-1], VOL: [-1] },
  def: 16, pv: 25, init: 10,
  att: [{ n: 'Hache', mod: 6, dmg: '1d8+4' }],
  caps: [{ n: 'Sergent', d: "1×/round : donne une action supplémentaire à un allié sous ses ordres en vue. 1×/combat, ignore une attaque qui l'aurait amené à 0 PV." }]
},
{
  id: 'chef_gnoll', nom: 'Chef gnoll', cat: 'fantastique', nc: 4, ncLabel: '4',
  groupe: 'Gnolls', type: 'Humanoïde', taille: 'Moyenne', env: ['plaine', 'foret', 'ruines'],
  desc: "Le chef de clan, entouré de sa garde rapprochée.",
  car: { AGI: [0], CON: [4], FOR: [4], PER: [0], CHA: [-1], INT: [-1], VOL: [0] },
  def: 17, pv: 50, init: 10,
  att: [{ n: 'Hache', mod: 8, dmg: '1d8+4', note: '2 attaques' }],
  caps: [
    { n: 'Capitaine', d: "+2 en Initiative, en attaque et aux DM à toutes les créatures sous ses ordres en vue." },
    { n: 'Commandant', d: "Tant qu'au moins 4 créatures sous ses ordres sont à moins de 20 m, il ne subit que la moitié des DM." }
  ]
},
{
  id: 'gobelin', nom: 'Gobelin', cat: 'fantastique', nc: 0, ncLabel: '0',
  groupe: 'Gobelins', type: 'Humanoïde', taille: 'Petite', env: ['souterrain', 'foret', 'ruines'],
  desc: "Petite créature grisâtre d'un mètre de haut, cruelle et vicieuse, qui ne vaut que par le nombre.",
  car: { AGI: [2, 1], CON: [-1], FOR: [-1], PER: [0, 1], CHA: [-2], INT: [-2], VOL: [-2] },
  def: 12, pv: 3, init: 13,
  att: [{ n: 'Arme', mod: 2, dmg: '1d4-1' }],
  caps: [{ n: 'Attaque en meute', d: "Quand au moins 2 gobelins attaquent la même cible, ils bénéficient de +2 en attaque." }]
},
{
  id: 'gobelin_elite', nom: 'Gobelin élite', cat: 'fantastique', nc: 0.5, ncLabel: '1/2',
  groupe: 'Gobelins', type: 'Humanoïde', taille: 'Petite', env: ['souterrain', 'foret', 'ruines'],
  desc: "Un gobelin aguerri, mieux armé et un peu moins couard.",
  car: { AGI: [2, 1], CON: [0], FOR: [0], PER: [0, 1], CHA: [-1], INT: [-1], VOL: [-1] },
  def: 13, pv: 9, init: 13,
  att: [{ n: 'Arme', mod: 4, dmg: '1d6' }],
  caps: [{ n: 'Attaque en meute', d: "Quand au moins 2 gobelins attaquent la même cible : +2 en attaque." }]
},
{
  id: 'shaman_gobelin', nom: 'Shaman gobelin', cat: 'fantastique', nc: 1, ncLabel: '1',
  groupe: 'Gobelins', type: 'Humanoïde', taille: 'Petite', env: ['souterrain', 'foret', 'ruines'],
  desc: "Le sorcier de la tribu, couvert de fétiches et d'os peints.",
  car: { AGI: [2, 1], CON: [1], FOR: [0], PER: [0, 1], CHA: [1], INT: [1], VOL: [1] },
  def: 13, pv: 9, init: 13,
  att: [
    { n: 'Arme', mod: 4, dmg: '1d6' },
    { n: 'Attaque magique', mod: 4, dmg: '2d6', portee: 30 }
  ],
  caps: [
    { n: 'Attaque en meute', d: "Quand au moins 2 gobelins attaquent la même cible : +2 en attaque." },
    { n: 'Attaque magique', a: 'A', d: "Pouvoir magique infligeant 2d6 DM sur un test d'attaque magique réussi (portée 30 m, cible unique)." }
  ]
},
{
  id: 'chef_gobelin', nom: 'Chef gobelin', cat: 'fantastique', nc: 2, ncLabel: '2',
  groupe: 'Gobelins', type: 'Humanoïde', taille: 'Petite', env: ['souterrain', 'foret', 'ruines'],
  desc: "Le plus fourbe et le plus brutal de la tribu — c'est ainsi qu'on devient chef.",
  car: { AGI: [2, 1], CON: [1], FOR: [1], PER: [0, 1], CHA: [1], INT: [0], VOL: [0] },
  def: 16, pv: 22, init: 13,
  att: [{ n: 'Arme', mod: 5, dmg: '1d6+1', note: '2 attaques' }],
  caps: [
    { n: 'Attaque en meute', d: "Quand au moins 2 gobelins attaquent la même cible : +2 en attaque." },
    { n: 'Sergent', d: "1×/round : donne une action supplémentaire à un allié en vue. 1×/combat, ignore une attaque qui l'aurait amené à 0 PV." }
  ]
},
{
  id: 'golem_chair', nom: 'Golem de chair', cat: 'fantastique', nc: 7, ncLabel: '7',
  type: 'Non vivante', taille: 'Grande', env: ['ruines', 'urbain', 'souterrain'],
  desc: "Assemblage de cadavres cousus et ranimés, doté d'une force inhumaine.",
  car: { AGI: [1], CON: [6, 1], FOR: [6], PER: [0], CHA: [-4], INT: [-4], VOL: [6] },
  def: 20, pv: 90, init: 10,
  att: [{ n: 'Poings', mod: 11, dmg: '1d10+6', note: '2 attaques' }],
  caps: [
    { n: 'Une petite dernière', d: "Attaque de contact gratuite contre un adversaire au contact qui tente de s'éloigner." },
    { n: 'Tape dur', d: "Sur 17-20 au dé d'attaque, l'attaque réussit automatiquement et la victime doit réussir un test de CON difficulté 16 ou être étourdie 1 round." },
    { n: 'Enragé', d: "Sur un coup critique subi : +3 en attaque au contact, +1d6 DM, et peut agir un tour complet après 0 PV." },
    { n: 'Résistance', d: "Divise par 2 les DM élémentaires (feu, froid, acide) et contondants. Immunisé au poison." },
    { n: "Absorber l'électricité", d: "Immunisé à l'électricité : il régénère 1 PV pour 3 DM d'électricité subis." }
  ]
},
{
  id: 'goule', nom: 'Goule', cat: 'fantastique', nc: 2, ncLabel: '2',
  groupe: 'Goules', type: 'Non vivante', taille: 'Moyenne', env: ['ruines', 'souterrain', 'urbain'],
  desc: "Humanoïde mort d'une maladie atroce, revenu dévorer les cadavres — et les vivants.",
  car: { AGI: [1], CON: [1], FOR: [1], PER: [2], CHA: [-4], INT: [0], VOL: [2] },
  def: 15, pv: 19, init: 12,
  att: [{ n: 'Morsure et griffes', mod: 5, dmg: '1d6+2', note: '+ paralysie' }],
  caps: [
    { n: 'Paralysie', d: "Une créature blessée par la morsure doit réussir un test de CON difficulté 10 ou être paralysée 1d6 rounds." },
    { n: 'Devenir une goule', d: "Une créature tuée par une goule en devient une au prochain crépuscule." },
    { n: 'Fièvre des goules', d: "À la fin du combat, une victime mordue doit réussir un test de CON difficulté 15 ou contracter la maladie : 1d4° DM par jour retranchés au maximum de PV." }
  ]
},
{
  id: 'abomination', nom: 'Abomination (goule puissante)', cat: 'fantastique', nc: 4, ncLabel: '4',
  groupe: 'Goules', type: 'Non vivante', taille: 'Moyenne', env: ['ruines', 'souterrain'],
  desc: "Une goule ancienne et gorgée de chair, entourée de miasmes putrides.",
  car: { AGI: [1], CON: [4], FOR: [4], PER: [2], CHA: [-4], INT: [1], VOL: [4] },
  def: 17, pv: 35, init: 12,
  att: [{ n: 'Morsure et griffes', mod: 9, dmg: '1d6+4', note: '2 attaques' }],
  caps: [
    { n: 'Paralysie', d: "Test de CON difficulté 15 ou paralysé 1d6 rounds." },
    { n: 'Miasmes', d: "Odeur pestilentielle dans un rayon de 2 m : à la fin de son tour, les adversaires au contact doivent réussir un test de CON difficulté 10 ou être affaiblis." },
    { n: 'Fièvre des goules', d: "Comme la goule, mais avec un test de CON difficulté 18." }
  ]
},
{
  id: 'griffon', nom: 'Griffon', cat: 'fantastique', nc: 4, ncLabel: '4',
  taille: 'Grande', env: ['montagne', 'plaine'],
  desc: "Corps de lion, tête et ailes d'aigle. Parfois dressé comme monture par les chevaliers.",
  car: { AGI: [3], CON: [6], FOR: [6], PER: [2, 1], CHA: [0], INT: [-3], VOL: [1] },
  def: 18, pv: 50, init: 15,
  att: [{ n: 'Morsures et griffes', mod: 8, dmg: '2d6+8' }],
  caps: [
    { n: 'Vol rapide', d: "Mouvement supplémentaire en vol ; dé bonus et +1d4 aux DM au premier round contre une cible au sol." },
    { n: 'Agripper', d: "Sur 15-20 en attaque, agrippe sa proie : +5 en attaque et +1d4 DM contre elle, qui est immobilisée si elle est plus petite." }
  ]
}

);
