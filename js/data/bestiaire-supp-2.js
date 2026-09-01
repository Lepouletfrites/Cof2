/* ============================================================
   COF2 Compagnon — Bestiaire supplementaire (2/3)
   Créatures extraites du supplément « Bestiaire » (Black Book
   Éditions, 2025), en complément du bestiaire du livre de base.
   Catégorie et environnements déduits automatiquement du texte :
   à corriger au cas par cas si besoin.
   ============================================================ */
window.COF = window.COF || {};
COF.BESTIAIRE = COF.BESTIAIRE || [];

COF.BESTIAIRE.push(
{
  id: "molosse_des_enfers", nom: "Molosse Des Enfers", cat: "fantastique", nc: 3, ncLabel: "3",
  type: "Créature fantastique", taille: "Moyenne", env: ["souterrain"],
  car: { AGI: [0], CON: [4, 1], FOR: [4], PER: [2], CHA: [0], INT: [-2], VOL: [4] },
  def: 17, pv: 30, init: 10,
  att: [{ n: "Morsure", mod: 6, dmg: "1d6+4 + 1d6 de feu" }],
  caps: [{ n: "Souffle enflammé", a: "L", d: "Le souffle est une attaque de zone affectant toutes les créatures dans un cône de 10 m de long sur 10 m de large. L’attaque inflige auto- matiquement (pas de test d’attaque) 5d6 DM. Les DM sont divisés par deux si la victime réussit un test d’AGI diffi- culté 15. Après chaque utilisation, la créature doit attendre 1d4 rounds avant d’utiliser à nouveau son souffle." }, { n: "Dévorer", d: "Lorsque la créature réussit une attaque avec un résultat de 15-20 au d20, elle saisit sa proie entre ses crocs ou ses griffes et lui inflige immé- diatement une attaque gratuite supplémentaire. IMMUNISÉ AUX DM DE FEU" }]
},

{
  id: "chtonien", nom: "Chtonien", cat: "fantastique", nc: 2, ncLabel: "2",
  type: "Créature fantastique", taille: "Moyenne", env: ["montagne"],
  desc: "Le chtonien est un gros ver grisâtre à la peau épaisse qui creuse son chemin dans les sous-sols. Il est armé de quatre tentacules pour agripper sa proie et, comme une pieuvre, d’un bec redoutable pour la découper.",
  car: { AGI: [2], CON: [1], FOR: [2], PER: [1], CHA: [-3], INT: [-4], VOL: [0] },
  def: 16, pv: 26, init: 11,
  att: [{ n: "Tentacules et bec", mod: 6, dmg: "1d8+2 + saisie" }],
  caps: [{ n: "Camouflage", d: "La peau grise du chtonien lui permettant de se dissimuler contre une paroi rocheuse, la cible doit réussir un test de PER difficulté 15 ou être surprise. S’il attaque avec succès une cible surprise, le chtonien lui inflige +1d6 DM. Le chto- nien obtient +5 à tous ses tests de discrétion." }, { n: "Creuser", d: "Un chtonien peut percer une galerie au rythme de 2 m par round dans un sol meuble et de 30 cm par round dans le roc. En règle générale, lorsqu’il attaque une proie, il a creusé la galerie en avance." }, { n: "Saisie", d: "Si le chtonien réussit son attaque, il retient sa proie avec ses tentacules et la dévore de son bec. La victime peut utiliser une action de mouvement à son tour pour se libérer en réussissant un test de FOR difficulté 12, sinon elle est immobilisée et subit automatiquement les DM de l’attaque du chtonien à chaque round." }, { n: "Sens des vibrations", d: "Le chtonien ne possède pas d’yeux, il détecte ses proies aux vibrations qu’elles émettent dans le sol lorsqu’elles se déplacent." }]
},

{
  id: "cockatrice", nom: "Cockatrice", cat: "fantastique", nc: 2, ncLabel: "2",
  type: "Créature fantastique", taille: "Très petite", env: ["marais", "souterrain"],
  desc: "La cockatrice ressemble à s’y méprendre à un gros coq, mais une longue queue de serpent se love sous ses plumes. Elle reste cachée jusqu’à ce que l’animal d’apparence inoffensive se précipite sur sa victime.",
  car: { AGI: [3], CON: [-2], FOR: [-2], PER: [1], CHA: [-1], INT: [-4], VOL: [-2] },
  def: 17, pv: 22, init: 11,
  att: [{ n: "Bec", mod: 5, dmg: "1d4 + pétrification" }],
  caps: [{ n: "Vol", d: "La cockatrice peut voler de 10 m par action de mouvement. COCKATRICE La cockatrice ressemble à s’y méprendre à un gros coq, mais une longue queue de serpent se love sous ses plumes. Elle reste cachée jusqu’à ce que l’animal d’apparence inoffensive se précipite sur sa victime. Écologie Les cockatrices ont un régime alimentaire constitué de rongeurs ainsi que de petits carnivores. Elles utilisent parfois leur propre queue comme appât pour attirer certaines proies." }, { n: "Pétrification", d: "Toute créature victime d’une attaque de bec doit réussir un test de CON difficulté 10 ou être pétrifiée. Il est possible de mettre fin à la pétrification par le sort Délivrance (prêtre, voie de la spiritualité, rang 3) lancé moins de 24 heures après la pétrification. Si cette durée est dépassée, la victime doit réussir un test de CON difficulté (10 + nombre de jours écoulés) ou mourir. Le sort fonctionne, mais la personne est morte. La cockatrice n’utilise pas son terrible pouvoir pour chasser, mais pour attaquer et se défendre, la créature étant réputée pour son caractère agressif. En milieu naturel, la cockatrice fait son nid au sol, dans des broussailles. Malheur à celui qui s’approche par mégarde : un cercle d’animaux pétrifiés sert d’avertissement à d’éventuels prédateurs." }]
},

{
  id: "crustalide", nom: "Crustalide", cat: "fantastique", nc: 5, ncLabel: "5",
  type: "Créature fantastique", taille: "Grande", env: ["montagne", "marais"],
  desc: "Le marin était hagard. Ses yeux filaient de droite à gauche sans pouvoir se fixer. Sa voix tremblait alors qu’il se remémorait les faits. « On a remonté cette chose dans le filet. Je ne sais pas ce que c’était. Comme un cocon jaunâtre.",
  car: { AGI: [1], CON: [5], FOR: [6], PER: [2, 1], CHA: [-3], INT: [0], VOL: [4] },
  def: 22, pv: 60, init: 15,
  att: [],
  caps: [{ n: "Embuscade", d: "Au premier round de combat, dans un environ- 1 nement permettant au crustalide de se dis- simuler (en général caché sous l’eau), la cible doit réussir un test de PER difficulté 16 ou être surprise. S’il attaque avec succès une cible surprise, le crustalide lui inflige +1d4 DM. Si la FOR de la créature est inférieure à la sienne, elle est alors renversée. Le crustalide bénéficie de +5 à tous ses tests de discrétion." }, { n: "Monstre aquatique", d: "Le crustalide respire aussi bien sous l’eau que sur terre et ne subit aucun malus à ses actions en milieu aquatique." }, { n: "Tentacule", d: "Lorsque le crustalide réussit une attaque de pince avec un résultat de 17-20 au d20, il en profite pour saisir sa victime avec ses tenta- cules. La cible doit réussir un test de FOR ou d’AGI (au choix) difficulté 15 ou être immobilisée. Une fois par round, elle peut essayer de se libérer au prix d’une action de mouvement en réussissant un nouveau test, mais le crusta- lide commence à enduire sa proie d’une subs- tance collante qui durcit assez rapidement : la difficulté du test augmente de +2 à chaque round pour un maximum de 25 au 5 round. La cible est alors paralysée et protégée des DM dans la chrysalide cristalline. La chrysalide possède 20 PV et une RD 5. En général, à ce stade, le crustalide s’enfuit en emportant sa proie pour la dévorer plus tard. Il subit alors un dé malus aux tests de poursuite, sauf sous l’eau." }]
},

{
  id: "cyclope", nom: "Cyclope", cat: "fantastique", nc: 12, ncLabel: "12",
  type: "Créature fantastique", taille: "Colossale", env: ["arctique", "urbain"],
  desc: "Gunthar fut réveillé par une déflagration. Toute la maison venait de trembler sur ses fondations et la bâtisse s’écroulait sur lui. Il eut le souffle coupé. Il ne pouvait plus bou- ger, coincé sous une poutre. Il avait sans doute plusieurs côtes brisées.",
  car: { AGI: [-1], CON: [15], FOR: [15, 1], PER: [-2], CHA: [-1], INT: [-1], VOL: [0] },
  def: 28, pv: 200, init: 8,
  att: [{ n: "Masse à 2 mains", mod: 16, dmg: "2d10+10 Lancer de pierre +14 · DM 2d10+10", note: "2 attaques" }],
  caps: [{ n: "Balayage", d: "Le cyclope utilise sa grande taille pour viser deux créatures à son contact d’un seul coup. Il ne fait qu’un seul test d’attaque pour les deux cibles. Si les deux sont touchées, la cible secondaire (désignée par le MJ) ne subit que la moitié des DM." }, { n: "Colossal", d: "Le cyclope bénéficie d’une RD 6 du fait de sa taille." }, { n: "Faiblesse", d: "Les joueurs sont souvent fascinés par cet œil unique qui semble une cible facile. Si un joueur déclare viser l’œil du cyclope pour l’aveugler, il doit réussir un test d’attaque contre une DEF de 38. En cas de réussite, il aveugle le cyclope pour une durée en rounds égale aux DM divisés par dix (arrondis à l’infé- rieur, la RD ne s’applique pas)." }, { n: "Projection", d: "Lorsque le cyclope réussit une attaque avec un résultat de 17-20 au d20, la victime est projetée à 1d6+1 m de là et subit +2d10 DM. Elle est renversée, et si elle échoue à un test de CON difficulté 15, elle est étourdie pour 1 round." }, { n: "Teigneux", d: "Si le cyclope rate une attaque, il bénéficie d’un dé bonus et de +2d10 DM pour la prochaine. DÉMONS Le fouet ardent claqua et l’ombre à forme humaine se déchira brièvement avant de se reconstituer en hurlant. Elle essaya d’échap- per au coup suivant. Sans succès. Les ricane- ments de l’infâme créature à tête de porc qui la rouait de coups se mêlaient aux hurlements des autres suppliciés. Le porcin cessa soudain de rire lorsqu’une paire de dents acérées se planta dans son mollet. Il avait commis l’erreur de relâcher son attention, tout à sa tâche de bourreau. Il roua de coups de fouet la larve à tête de nou- veau-né qui s’accrochait à sa jambe, jusqu’à ce qu’elle s’enfuie dans l’air brûlant et saturé de soufre en émettant des pleurs d’enfant. Il reprit sa besogne méthodique sur la chose recroquevillée au sol, l’âme damnée d’un homme qui n’était plus que l’ombre d’elle-même. Généralités Les démons sont des créatures des enfers, ces mondes maléfiques d’une autre dimension où les âmes corrompues sont tourmentées pour l’éternité. L’existence d’un démon est une lutte constante pour le pouvoir et la domination par la force, la ruse et la cruauté. Ils progressent dans la hiérarchie infernale en éliminant leurs pairs et leurs supérieurs ou en remportant des victoires dans la guerre éternelle qui les oppose aux anges. Ce sont des êtres d’énergie dont la forme cor- respond à leur statut : lorsqu’ils progressent dans la hiérarchie, ils changent de forme. Si les démons étaient plus disciplinés, ils auraient sans doute réussi à conquérir le monde à de multi- ples occasions, mais ils sont trop occupés à se détester mutuellement, à se faire la guerre et à déjouer les plans de leurs rivaux pour réussir à 1 s’organiser de façon efficace. Bien qu’ils ne quittent généralement pas leur plan d’origine, les démons peuvent être appe- lés par un sorcier ou franchir un portail vers le monde des mortels. Ce qu’ils font avec joie, car les faibles mortels sont pour eux des proies faciles et leurs âmes une source importante de pouvoir. Les démons sont présentés ci-après par ordre croissant de NC plutôt que par ordre alphabé- tique. Ils portent des noms étranges que seuls les érudits connaissent, mais on les décrit plus souvent par leur apparence, grotesque parodie du règne animal. DIABLES Il ne faut pas confondre les démons et les diables. Les premiers œuvrent pour le chaos, la douleur et la destruction sauvage, là où les seconds prônent un ordre tyrannique, cruel et immuable. Les deux sont ennemis depuis la nuit des temps dans une guerre sans fin. Toutefois, la plupart des mortels ne font pas la différence entre les deux catégories de créatures infernales, et ils appellent sans discernement « démons » toutes les créatures maléfiques issues d’un autre monde. Pour Chroniques Oubliées Fantasy, nous avons fait le choix de ne décrire que les démons, laissant l’aspect des diables à votre imagination. Chaque type de démon possède son alter ego chez les diables avec quelques variations d’apparence et de pouvoir. En particulier, la résistance des diables porte sur le froid et l’électricité plutôt que le feu et l’acide. Les diables ont des formes plus proches d’humains corrompus : on pourra citer l’écorché, dont la peau semble avoir été retirée, le barbelé hérissé de pointes qui lui transpercent la peau, le diable osseux, squelettique et pourvu de deux paires de bras, ou encore le putride dont les chairs sont pourrissantes." }]
},

{
  id: "ame_damnee", nom: "Âme Damnée", cat: "fantastique", nc: 0, ncLabel: "0",
  type: "Créature fantastique", taille: "Moyenne", env: ["ruines"],
  desc: "Les âmes damnées sont les âmes des individus qui ont vendu la leur aux démons ou les âmes que les dieux ont bannies parce qu’elles leur avaient fait défaut.",
  car: { AGI: [1], CON: [0], FOR: [-4], PER: [0], CHA: [-2], INT: [0], VOL: [0] },
  def: 11, pv: 3, init: 10,
  att: [{ n: "Toucher nécrotique", mod: 5, dmg: "1d4" }],
  caps: [{ n: "Immatérielle", d: "Les âmes damnées sont immatérielles. Elles ne peuvent rien saisir et bénéficient d’une RD 5 contre les armes non magiques. Toutefois, elles sont incapables de traverser des obsta- cles matériels ou de voler. Les démons étant des créatures magiques, ils peuvent interagir physiquement avec les âmes damnées." }, { n: "Immortelle", d: "Chaque fois qu’une âme damnée est réduite à 0 PV, elle réapparaît dans les fosses des enfers. Toutefois, si le sort Délivrance est lancé dans le round qui suit, elle est dissipée à jamais dans le néant." }, { n: "Minable", d: "L’âme damnée ne profite d’aucun des pouvoirs des démons, à part la vision dans le noir et la résistance contre le feu et l’acide." }, { n: "Toucher nécrotique", d: "Lorsque l’âme damnée touche une créature vivante, elle lui inflige 1d4 DM et gagne autant de PV. Les PV ainsi obtenus disparaissent au bout de 10 min s’ils dépassent la valeur maxi- male de PV (3). Les démons sont immunisés au toucher nécrotique des âmes damnées." }]
},

{
  id: "vermisseau", nom: "Vermisseau", cat: "fantastique", nc: 0.5, ncLabel: "1/2",
  type: "Créature fantastique", taille: "Petite", env: ["ruines"],
  desc: "Le vermisseau est un petit être pathétique, infirme et haineux. Il ressemble à une grosse larve blanche d’environ 1 m de long, prolongée par une tête d’enfant aux traits déformés par la haine et aux canines acérées.",
  car: { AGI: [1], CON: [1], FOR: [-2], PER: [-1], CHA: [-3], INT: [-3], VOL: [-3] },
  def: 12, pv: 9, init: 9,
  att: [{ n: "Morsure", mod: 3, dmg: "1d6-2 + poison" }],
  caps: [{ n: "Minable", d: "Le vermisseau ne profite d’aucun des pouvoirs communs des démons, à part la vision dans le noir et la résistance au feu et à l’acide." }, { n: "Poison", d: "La cible doit réussir un test de VOL diffi- culté 10 ou se mettre à pleurer à chaudes larmes, comme un petit enfant, en étant secouée de spasmes pour le reste du combat. Elle doit réussir un test de VOL difficulté 10 chaque round ou être ralentie." }]
},

{
  id: "porcin", nom: "Porcin", cat: "humanoide", nc: 1, ncLabel: "1",
  type: "Humanoïde", taille: "Petite", env: ["ruines"],
  desc: "Un porcin est une petite créature obèse à la peau rosâtre, à la face porcine et à la silhouette humanoïde dotée de jambes et de bras trop courts. Il est généralement armé d’un fouet.",
  car: { AGI: [1], CON: [2], FOR: [0], PER: [-1], CHA: [-3], INT: [-3], VOL: [-2] },
  def: 14, pv: 13, init: 9,
  att: [{ n: "Morsure ou fouet", mod: 4, dmg: "1d6" }],
  caps: [{ n: "Minable", d: "Le démon porcin ne profite d’aucun des pou- voirs communs des démons, à part la vision dans le noir et la résistance au feu et à l’acide." }, { n: "Pets répugnants", d: "Le porcin libère un gaz nauséabond dans un rayon de 5 m autour de lui. Chaque round, toutes les créatures vivantes dans la zone doivent réussir un test de CON difficulté 10 ou être affaiblies. Le porcin peut péter autant qu’il veut." }]
},

{
  id: "demon_crocodile", nom: "Démon Crocodile", cat: "humanoide", nc: 4, ncLabel: "4",
  type: "Humanoïde", taille: "Moyenne", env: ["ruines"],
  desc: "Le démon crocodile possède une énorme tête de crocodile, mais son corps est celui d’un humain écorché vif. Il en suinte une lymphe san- guinolente. Il mesure environ 2,20 m, avec des membres anormalement longs et des mains rem- placées par d’immenses griffes.",
  car: { AGI: [3], CON: [3, 1], FOR: [3], PER: [1], CHA: [-2], INT: [0], VOL: [2] },
  def: 17, pv: 40, init: 11,
  att: [{ n: "Griffes et morsure", mod: 7, dmg: "2d6+4" }],
  caps: [{ n: "Recouvert de sang", d: "Un mucus rouge gélatineux semblable à du sang figé recouvre la peau du démon et gicle à chaque blessure. Chaque fois qu’un ennemi au contact le blesse, ce dernier subit 1d6 DM d’acide. Si une arme ordinaire entre en contact avec ce mucus, lancez 1d6 : sur 1 ou 2, elle est détruite. SAIGNEMENTS (A)* : La cible (portée 10 m) doit réussir un test de CON difficulté 13. En cas d’échec, du sang s’écoule de la bouche, du nez, des oreilles et même des yeux de la victime, et elle subit 1d6 DM par round pendant 5 rounds." }, { n: "Attaque mortelle", a: "A", d: "Cette attaque, proche de l’attaque sournoise du voleur, doit être exécutée dans le dos ou par surprise. La créature bénéficie d’un dé bonus en attaque et +2d6 DM. Le démon obtient +5 aux tests de discrétion." }]
},

{
  id: "demon_seducteur", nom: "Démon Séducteur", cat: "humanoide", nc: 6, ncLabel: "6",
  type: "Humanoïde", taille: "Moyenne", env: ["ruines"],
  desc: "Au moment du premier baiser, tous ses doutes furent dissipés. C’était trop beau pour être vrai. L’instant d’un clignement de paupières, un regard jaune se dévoila… Non, vert : ses yeux étaient verts, pailletés d’or, exactement comme dans ses rêves.",
  car: { AGI: [4, 1], CON: [2, 1], FOR: [2], PER: [2], CHA: [6, 1], INT: [2], VOL: [1] },
  def: 20, pv: 70, init: 12,
  att: [{ n: "Griffes", mod: 10, dmg: "1d6+2 + 1d6", note: "2 attaques" }],
  caps: [{ n: "Vol", d: "Le démon peut se déplacer en vol de 10 m par action de mouvement." }]
},

{
  id: "demon_vautour", nom: "Démon Vautour", cat: "humanoide", nc: 8, ncLabel: "8",
  type: "Humanoïde", taille: "Grande", env: ["ruines"],
  desc: "Ce démon ressemble à un immense vautour humanoïde au corps exsangue. Il est doté d’une tête hideuse, de grandes ailes pelées et d’un plumage putride qui dégage une affreuse odeur de charogne.",
  car: { AGI: [2, 1], CON: [5, 1], FOR: [5], PER: [2], CHA: [-2], INT: [2], VOL: [2] },
  def: 22, pv: 110, init: 12,
  att: [{ n: "Serres et bec", mod: 12, dmg: "1d10+7", note: "2 attaques" }],
  caps: [{ n: "Cri assourdissant", a: "M", d: "Une fois par combat, le démon peut émettre un cri suraigu par une action de mouvement. Toutes les créatures dans un rayon de 10 m autour de lui doivent réussir un test de CON difficulté 15 ou être étourdies pendant 1 round." }, { n: "Gangrène", a: "G", d: "La gangrène inflige +1d6 DM par round pendant 5 rounds ou jusqu’à ce que le sort Délivrance stoppe le processus. Les DM de plusieurs effets de gangrène ne sont pas cumulables (mais l’effet dure 5 rounds à partir du moment de la dernière attaque)." }, { n: "Projection de plumes", a: "L", d: "Le démon bat des ailes et projette des plumes acérées comme des rasoirs. Les créa- tures dans un rayon de 5 m autour de lui subissent 4d10 DM. Réussir un test d’AGI diffi- culté 15 permet de diviser les DM par deux." }, { n: "Vol rapide", d: "Le démon obtient une action de mouvement supplémentaire par round lorsqu’il est en vol. Au premier round de combat, il bénéficie d’un dé bonus en attaque et +1d6 DM s’il est en vol et attaque une créature au sol." }]
},

{
  id: "demon_crapaud", nom: "Démon Crapaud", cat: "humanoide", nc: 10, ncLabel: "10",
  type: "Humanoïde", taille: "Grande", env: ["plaine", "urbain"],
  desc: "Ce démon ressemble à un énorme crapaud humanoïde dont la peau est recouverte d’ignobles pustules d’où suinte un liquide acide.",
  car: { AGI: [1], CON: [8, 1], FOR: [8], PER: [2], CHA: [-2], INT: [2], VOL: [3] },
  def: 25, pv: 160, init: 12,
  att: [{ n: "Morsure", mod: 14, dmg: "2d8+8", note: "2 attaques" }],
  caps: [{ n: "Étreinte", d: "Lorsque le démon réussit une attaque avec un résultat de 17-20 au d20, si sa FOR est supé- rieure à celle de la cible, celle-ci est immobilisée entre les bras du démon, qui obtient un dé bonus en attaque aux rounds suivants. Pour se libérer, la victime doit réussir un test de FOR opposé lors de son tour (action de mouvement)." }, { n: "Pustules", d: "Une créature immobilisée dans les bras du démon subit 2d8 DM d’acide à chaque round." }, { n: "Vomissure", a: "L", d: "Le démon ouvre sa bouche énorme et déverse un jet de vomi qui affecte un cône de 10 m de long pour 5 m de large. Il inflige 4d8+20 DM, réduits de moitié si la cible réussit un test d’AGI difficulté 15. De plus, la victime est imprégnée d’une odeur infâme dont elle ne peut se débarrasser pen- dant 24 heures (+5 pour la pister). Le démon doit attendre 1d4 rounds avant de pouvoir à nouveau utiliser cette capacité." }, { n: "Bond formidable", a: "M", d: "Le démon peut parcourir 10 m en hauteur et 20 m en longueur à chaque bond." }]
},

{
  id: "demon_insecte", nom: "Démon Insecte", cat: "fantastique", nc: 12, ncLabel: "12",
  type: "Créature fantastique", taille: "Énorme", env: ["plaine", "souterrain", "urbain"],
  desc: "Le démon insecte ressemble à une monstrueuse araignée en armure de chitine dentelée. Il affiche tout ce que les insectes et les arthropodes peuvent cumuler de plus terrifiant.",
  car: { AGI: [2, 1], CON: [10, 1], FOR: [10], PER: [2], CHA: [-2], INT: [3], VOL: [4] },
  def: 28, pv: 200, init: 12,
  att: [{ n: "Dard", mod: 16, dmg: "1d6+5 + venin ou œuf de contrôle" }],
  caps: [{ n: "Venin", d: "La victime subit 2d10 DM de poison et doit réussir un test de CON difficulté 15 ou être paralysée pendant 1d4 rounds. Le démon profite généralement de cet état de faiblesse pour inoculer un œuf de contrôle à sa victime avec sa prochaine attaque de dard. ŒUF DE CONTRÔLE : Le dard du démon peut aussi servir à inoculer un œuf à sa victime, mais pour cela, la cible doit au préalable être paralysée. Lorsque l’œuf est introduit, la victime doit faire un test de VOL difficulté 15, sinon, à la fin de la para- lysie, elle passe sous le contrôle du démon et attaque ses anciens alliés. Elle reste sous le contrôle du démon jusqu’à ce que le sort Délivrance soit utilisé ou que le démon soit tué. Si le démon est tué, l’œuf explose dans le corps du personnage et lui inflige 5d6 DM. Le démon ne peut pas contrôler plus d’une créature à la fois de cette façon." }, { n: "Toile", a: "M", d: "Sur un test d’attaque réussi (portée 10 m), le démon crache une toile épaisse et gluante qui emprisonne sa cible. Se libérer nécessite l’usage d’une action limitée et il faut réussir un test de FOR difficulté 20. La victime est paralysée, mais elle bénéficie d’une RD 5 tant qu’elle est recouverte par la toile. Le démon ne peut utiliser cette capacité que 3 fois par combat, et tous les 1d4 rounds. SABRE DE DÉMON Que ce soit au sud ou au nord des Terres d’Osgild, les féroces tribus qui habitent les lieux ont appris à combattre les démons insectes. Les chasser est devenu un rite de passage pour les jeunes guerriers, qui se regroupent en bande pour venir à bout de la créature. Les plus cou- rageux s’arrogent le droit de prélever les pattes tranchantes du monstre pour en faire une arme terrible : le sabre démon, symbole de courage et de valeur pour tout guerrier du désert. Une fois préparé et affûté, le sabre démon devient une épée longue +2 affûtée (critique sur 19-20)." }]
},

{
  id: "demon_gorille", nom: "Démon Gorille", cat: "humanoide", nc: 14, ncLabel: "14",
  type: "Humanoïde", taille: "Énorme", env: ["ruines"],
  desc: "Le démon gorille est un énorme gorille à quatre bras dans un état de décomposition avancée, dont les chairs putréfiées laissent transparaître des parties du squelette. Il possède une queue de serpent dont l’extrémité se termine par la tête d’un crotale géant.",
  car: { AGI: [2], CON: [10, 1], FOR: [10], PER: [2], CHA: [-2], INT: [4], VOL: [5] },
  def: 29, pv: 240, init: 12,
  att: [{ n: "Poings", mod: 17, dmg: "2d10+13", note: "2 attaques" }, { n: "+ Beuarhhh Morsure de serpent", mod: 17, dmg: "1d6 + poison" }],
  caps: [{ n: "Beuarhhh", d: "Lorsque le démon réussit une attaque avec un résultat de 17 à 20, si sa FOR est supérieure à celle de la cible, il la saisit entre ses bras puissants. Dans un déferlement de rage et de puissance brute, il la soulève au-dessus de sa tête et la jette violemment au sol avant de sauter dessus à pieds joints. La victime subit le double des DM d’une attaque normale (triple en cas de critique) ; elle est renversée et doit faire un test de CON difficulté 20 ou être étourdie." }, { n: "Crachat de poison", d: "Au lieu d’une attaque de morsure, le serpent peut cracher son poison aux yeux d’un adversaire. La victime subit 1d10 DM et elle doit réussir un test d’AGI difficulté 15 ou être aveuglée jusqu’à la fin du combat. Elle peut se rincer les yeux à l’eau claire, mais il lui faut consacrer 3 rounds à cette action." }, { n: "Poison", d: "La cible subit 2d10 DM, réduits de moitié si elle réussit un test de CON difficulté 15." }, { n: "Regard hypnotique", d: "Au lieu d’une attaque de morsure, le démon peut tenter d’hypnotiser une cible qui doit réussir un test de VOL difficulté 15 ou être étourdie pour le round." }, { n: "Strangulation", d: "Lorsqu’il réussit une attaque aux poings, si le démon obtient un résultat de 1 sur l’un des d10 de DM, il étrangle sa cible au lieu de la frapper. La cible est immobilisée et, à son tour, elle doit réussir un test de FOR difficulté 20 (action de mouvement, une seule tentative par round) pour réussir à se dégager. Elle subit 1d10 DM cumulatif (1d10 au 1 round, 2d10 au 2, etc.). Pendant la strangulation, le démon continue à frapper sa victime de son autre paire de bras (une seule attaque par round). S’il obtient Beuarhhh, il ne peut pas s’en empêcher et met fin à la strangulation." }]
},

{
  id: "demon_sanglier", nom: "Démon Sanglier", cat: "humanoide", nc: 16, ncLabel: "16",
  type: "Humanoïde", taille: "Énorme", env: ["souterrain", "urbain"],
  desc: "Ce démon humanoïde poilu et colossal est affu- blé d’une énorme tête de sanglier aux défenses proéminentes. Les poils de son échine et de ses flancs sont pareils à des aiguilles acérées à la façon d’un porc-épic.",
  car: { AGI: [0], CON: [10, 1], FOR: [10, 1], PER: [2], CHA: [-2], INT: [4], VOL: [6] },
  def: 30, pv: 260, init: 12,
  att: [{ n: "Coups de poing", mod: 18, dmg: "2d12+14" }, { n: "Défenses", mod: 18, dmg: "2d12+14" }],
  caps: [{ n: "Boule de piques", a: "M", d: "Le démon se roule en boule et parcourt 10 m telle une boule hérissée de piques dans un jeu de quilles humaines. À moins que leur FOR soit supérieure à celle du démon, toutes les créatures sur son passage doivent réussir un test d’AGI difficulté 15 ou être renversées et subir 2d12 DM." }, { n: "Charge", a: "A", d: "Le démon parcourt une dis- tance maximale de 20 m et réalise une attaque avec ses défenses avec un dé bonus." }, { n: "Encorner", d: "Lorsque le démon obtient un résultat de 17-20 au d20 sur un test d’at- taque avec ses défenses, il encorne sa victime et la projette à 1d6 m. Celle-ci subit +2d12 DM d’éventration et de chute et est renversée." }, { n: "Projection de piquants", a: "M", d: "Le démon se met à quatre pattes et projette des piquants dans un rayon de 10 m autour de lui. Toutes les créatures dans la zone subissent 3d12 DM, réduits de moitié si elles réussissent un test d’AGI difficulté 15. Jusqu’à son prochain tour, le démon obtient +5 en DEF et une créature qui l’attaque avec des armes naturelles (à mains nues) subit 1d10 DM par attaque. Il doit attendre 1d4 rounds avant de pouvoir à nouveau utiliser cette capacité." }, { n: "Tape dur", d: "Lors d’un test d’attaque avec les poings, le démon réussit automatiquement s’il obtient 17-20 au d20. De plus, la victime doit réussir un test de CON difficulté 20 ou être étourdie pendant 1 round. DÉMON SCOLOPENDRE Les démons scolopendres sont des démons très puissants dotés du long abdomen d’une scolopendre géante surmonté du buste d’un homme ou d’une femme athlétique à six bras. Cet abdomen se termine par une pince redou- table capable de découper un homme en deux. Les démons scolopendres sont de véritables machines à tuer. Ils aiment montrer leur science du combat et écraser leurs adversaires de leur supériorité au corps à corps. Un démon scolopendre mesure près de 6 m de long et son buste culmine à plus de 2,5 m. Chacune de ses paires de bras manipule une arme à deux mains ou deux armes plus petites. W WDÉMON SCOLOPENDRE | NC 18 (19) CRÉATURE HUMANOÏDE NON VIVANTE TAILLE GRANDE | AGI +5* | CON +8* | FOR +8* | PER +3* | | CHA +2 | INT +5 | VOL +7 | (S)DEF 31 (V)PV 300 (RD 10) (I)Init. 16 Armes (3 attaques, critique 18-20) +19 · DM 1d12+8 Pince +19 · DM 1d12+8 (découpe sauvage)" }, { n: "Armes dansantes", d: "Un démon scolopendre peut guider ses armes à distance et attaquer ainsi jusqu’à 10 m sans pénalité. Il peut utiliser son arme même s’il a été désarmé. BRISE-GENOU : Si un adversaire au contact tente de s’éloigner du démon, celui-ci obtient une attaque de contact gratuite contre lui. Si cette attaque est réussie, en plus des DM habituels, la cible doit réussir un test de CON difficulté 15 ou diviser par deux tous ses déplacements pour le reste du combat." }, { n: "Découpe sauvage", d: "Lorsque le démon obtient 15-20 au d20 sur un test d’attaque de pince, il agrippe une proie de taille moyenne ou inférieure et ne la lâche plus. Il obtient un dé bonus en attaque contre la cible qu’il agrippe, qui est immobilisée. À chaque round suivant, la cible subit auto- matiquement les DM de pince et doit faire un test de CON difficulté 15 ou être coupée en deux, ce qui la tue (un PJ peut dépenser 1 PC pour survivre et être réduit à 0 PV). Une fois par round, la victime peut essayer de se libérer au prix d’une action de mouvement en réussissant un test de FOR difficulté 15." }, { n: "Résistance à la magie", d: "À chaque fois qu’un sort vise un démon scolopendre, lancez un d6 ; si le résultat est supérieur au rang du sort, il n’a aucun effet sur le démon." }]
},

{
  id: "seigneur_demon", nom: "Seigneur Démon", cat: "humanoide", nc: 20, ncLabel: "20",
  type: "Humanoïde", taille: "Énorme", env: ["souterrain", "arctique", "urbain"],
  desc: "Les seigneurs démons sont les plus célèbres et les plus puissants des démons. Ces seigneurs du feu mesurant près de 4 m possèdent d’immenses ailes de chauve-souris. Ils manient un fouet ardent d’une main et une immense épée enflammée de l’autre.",
  car: { AGI: [3, 1], CON: [10, 1], FOR: [10, 1], PER: [2, 1], CHA: [6, 1], INT: [6], VOL: [8] },
  def: 32, pv: 340, init: 15,
  att: [{ n: "Épée vorpale enflammée", mod: 20, dmg: "2d10+10 + 1d12 de feu Fouet (portée 10 m) +20 · DM 2d10+10 + 1d12", note: "2 attaques" }, { n: "Attaque magique", mod: 20 }],
  caps: [{ n: "Chair à canon", d: "Une fois par round, une attaque qui visait le démon touche en fait un de ses sous-fifres, situé à moins de 3 m, qui s’interpose (ou der- rière lequel il s’est mis à couvert). Le démon obtient +3 en DEF tant que des sous-fifres sont positionnés à moins de 3 m de lui." }, { n: "Corps enflammé", d: "Le seigneur démon est nimbé d’une aura de feu, qu’il peut éteindre à volonté. En réussis- sant une attaque au contact contre lui, une créature subit 1d12 DM de feu. Lorsqu’il est au contact d’une source de feu importante, il régénère 10 PV par round au début de son tour." }, { n: "Domination", a: "A", d: "S’il réussit un test opposé d’attaque magique, le démon domine sa cible (portée 20 m) pendant 2d6 rounds. Il peut contrôler ses faits et gestes et lui donner des ordres qu’elle est obligée d’exécuter. Les créatures dont le niveau est supérieur ou égal à 10 ne sont dominées que pendant 1d4 rounds. Le démon ne peut dominer qu’une créature à la fois, et jamais deux fois la même au cours d’un combat." }, { n: "Enchevêtrement", d: "Lorsqu’un seigneur démon réussit une attaque de fouet, la victime doit faire un test de FOR ou d’AGI (au choix) difficulté 15 ou être immobilisée pour 1 round et subir +2d12 DM de feu. Le seigneur démon peut attirer une victime immobilisée à son contact en réussis- sant un test opposé de FOR (action gratuite)." }, { n: "Épée de feu vorpale", d: "Lorsqu’il attaque avec son épée de feu, le seigneur démon obtient un critique sur 18-20 au d20. La victime doit alors réussir un test de CON difficulté 15 ou être décapitée (et morte). Un PJ peut dépenser un PC pour être réduit à 0 PV (il ne peut pas être soigné avant la fin du combat)." }, { n: "Magie des enfers", d: "Sur son propre plan, un seigneur démon peut lancer n’importe quel sort de sorcier en action de mouvement, une fois par round." }, { n: "Vol", d: "Un seigneur démon peut se déplacer en vol de 20 m par action de mouvement." }, { n: "Porteur de poisse", a: "G", d: "Une fois par round, le MJ peut demander à un PJ de relancer un d20 pour une action qui visait le démon ou un allié, et garder le moins bon résultat. PRINCE DÉMON Un prince démon est un démon unique dans sa forme et ses pouvoirs, il commande un plan entier des enfers. Son nom fait trembler même les sorciers les plus puissants. Il dispose d’un profil particulier laissé à la discrétion du MJ, mais son NC est au moins de 25." }]
},

{
  id: "destrier_des_tenebres", nom: "Destrier Des Ténèbres", cat: "fantastique", nc: 4, ncLabel: "4",
  type: "Créature fantastique", taille: "Grande", env: ["marais", "souterrain", "arctique"],
  desc: "Tous les destriers des ténèbres possèdent une robe de jais, mais leurs sabots et leur crinière se parent d’une aura élémentaire qui dépend de leur élément de prédilection (feu, acide, froid ou foudre).",
  car: { AGI: [2], CON: [4], FOR: [5], PER: [2], CHA: [0], INT: [-1], VOL: [2] },
  def: 17, pv: 40, init: 12,
  att: [{ n: "Sabots", mod: 7, dmg: "2d6+5 + 1d6 élémentaire" }],
  caps: [{ n: "Aura élémentaire", d: "Le destrier peut faire surgir une aura élé- mentaire à volonté. Elle inflige +1d6 DM élémentaires par attaque de contact réussie. En réussissant une attaque au contact contre lui, une créature subit 1d6 DM. Lorsqu’elle est au contact d’une source élémentaire impor- tante, la créature régénère 2 PV par round (terre pour le destrier du froid, eau pour le destrier d’acide)." }, { n: "Galop des cieux", d: "Le destrier peut se déplacer dans les airs comme sur terre. Il couvre une distance de 15 m par action de mouvement. Au pre- mier round, s’il est en vol et attaque une créature au sol, il bénéficie d’un dé bonus en attaque et de +1d4 DM." }, { n: "Immunité élémentaire", d: "Le destrier est immunisé aux DM de son élé- ment (feu, froid, acide ou foudre)." }, { n: "Souffle élémentaire", a: "L", d: "Le souffle est une attaque de zone affectant toutes les créatures dans un cône de 10 m de long sur 10 m de large. L’attaque inflige auto- matiquement 6d6 DM élémentaires. Les DM sont réduits de moitié si la victime réussit un test d’AGI difficulté 15. Après chaque utili- sation, la créature doit attendre 1d4 rounds avant d’utiliser à nouveau son souffle." }]
},

{
  id: "doppleganger", nom: "Doppleganger", cat: "humanoide", nc: 3, ncLabel: "3",
  type: "Humanoïde", taille: "Moyenne", env: ["foret", "plaine", "montagne", "marais", "souterrain", "arctique", "urbain", "ruines"],
  desc: "À la fin de l’incantation, le visage de Médrielle blêmit. Elle se tourna vers Usagi et chuchota « doppleganger » en lui désignant leur guide.",
  car: { AGI: [1, 1], CON: [1, 1], FOR: [1], PER: [3, 1], CHA: [2, 1], INT: [2], VOL: [4] },
  def: 16, pv: 30, init: 16,
  att: [{ n: "Coup ou par arme", mod: 6, dmg: "1d6+1", note: "2 attaques" }],
  caps: [{ n: "Attaque mortelle", a: "A", d: "Cette attaque, proche de l’attaque sournoise du voleur, doit être exécutée dans le dos ou par surprise. Le doppleganger obtient un dé bonus en attaque et +2d6 DM." }, { n: "Imitation", a: "L", d: "Le doppleganger peut prendre la forme de tout humanoïde de taille moyenne qu’il a observé pendant au moins 1 round. Si besoin, il peut aussi imiter les vêtements et l’équipement." }, { n: "Liquéfaction", d: "Après sa mort, un doppleganger commence à laisser échapper une humeur visqueuse qui se répand au sol pendant 10 rounds avant de s’évaporer complètement, ne laissant qu’une tâche humide au sol qui finit, elle aussi, par sécher." }, { n: "Polyvalent", d: "Un doppleganger sait utiliser toutes les armes et armures. Sa nature magique lui permet aussi d’utiliser parchemins et autres objets magiques comme s’il était capable de lancer des sorts jusqu’au rang 5." }, { n: "Saisie", d: "Le doppleganger est passé maître dans l’art de se jeter sur un adversaire ; il obtient un dé bonus en attaque lorsqu’il utilise la manœuvre bloquer. Lorsqu’il immobilise une créature, il peut continuer à l’attaquer 2 fois par round. Si un personnage veut attaquer le doppleganger alors qu’il immobilise un adversaire dont il a pris l’apparence, il doit réussir un test de PER ou INT (au choix) difficulté 20, sinon la cible est déterminée au hasard." }, { n: "Vol de passé", a: "M", d: "En touchant une créature vivante (la capacité ne fonctionne pas sur un cadavre) et en réussissant un test opposé d’attaque magique (+7), le doppleganger apprend tout de sa cible, ce qui lui permet de se faire passer pour elle de façon crédible. Toutefois, il ne peut pas apprendre de cette façon les secrets les mieux gardés ou les plus personnels de sa victime. Le doppleganger ne peut pas voler l’identité de plus d’une personne à la fois : chaque fois qu’il utilise ce pouvoir, il oublie l’identité précédente. DRAGONS Énormes créatures reptiliennes, les dra- gons possèdent quatre pattes et de grandes ailes membraneuses semblables à celles des chauves-souris. Le caractère de chacun varie selon son espèce, mais tous sont orgueilleux et attirés par les trésors. Ceux qui ont réuni un butin fabuleux le veillent jalousement. Les dragons peuvent être répartis en trois caté- gories en fonction de leurs valeurs morales ; nous vous présentons ici quatre espèces distinctes pour chaque catégorie, mais vous pouvez inven- ter bien d’autres variantes. Dragons malfaisants Ces dragons sont les plus cruels, ils n’hésitent pas à tuer pour s’emparer des trésors qu’ils convoitent, ou même par simple plaisir. Les dragons de lave vivent généralement dans des volcans ou des lacs de lave souterrains. Ils ont des écailles noires qui laissent filtrer entre elles une incandescence intérieure. Ils sont lit- téralement fascinés par l’or. Ils soufflent un feu magmatique épais et collant. Lorsqu’elle est ciblée par le souffle de ce dragon, en plus des DM de feu qu’elle subit, une victime qui a raté son test d’AGI est immobilisée pendant 1 round par la lave. Les dragons de lave sont immunisés aux DM de feu. Les dragons de glace vivent dans des grottes glaciales, au sommet d’une montagne ou au fond d’une crevasse dans d’immenses glaciers. Ils semblent taillés dans un bloc de glace opa- que à l’exception de leurs crocs et de leurs griffes transparentes. Ces dragons sont davan- tage amoureux des pierres précieuses que de l’or et ils vouent une haine envieuse à leurs cou- sins cristallins. Leur souffle est constitué d’air polaire et d’éclats de glace projetés à haute vitesse. Lorsqu’elle est ciblée par le souffle de ce dragon, en plus des DM de froid qu’elle subit, une victime qui a raté son test d’AGI est ralentie pendant 1d4 rounds. Les dragons de glace sont immunisés aux DM de froid. Les dragons de ténèbres vivent dans les pro- fondeurs du monde et remontent rarement à la 1 surface, bien qu’ils soient attirés par les champs de bataille et les lieux où des tueries de masse ont été perpétrées. Ils collectionnent les objets enchantés et ont une préférence pour ceux qui blessent ou tuent. En Osgild, ils sont connus pour fréquenter la Forêt sombre. Ils sont uniformément noirs et il est difficile de les distinguer, même en plein jour, car leur silhouette est toujours envi- ronnée d’un halo d’ombres. Leur souffle est un nuage de noirceur qui aspire la vie des victimes. Le souffle du dragon des ténèbres lui permet de se guérir en récupérant un dixième des DM infli- gés (arrondissez au supérieur : s’il inflige 25 DM à un PJ, il récupère 3 PV). Les dragons de ténèbres sont immunisés aux DM de poison. Les dragons de pestilence vivent généra- lement dans les marais, mais parfois aussi dans les jungles humides. Ce sont les moins enclins à amasser des trésors, auxquels ils préfèrent les crânes de leurs victimes blanchis par l’acide, qu’ils conservent comme trophées. Leurs écailles sont d’un vert sombre, parfois presque noir, et ils dégagent une terrible odeur de pourriture. Leur souffle est un nuage acide qui ronge les victimes jusqu’à l’os et laisse une odeur écœurante d’œuf pourri et de soufre. Si un PJ rate son test d’AGI contre le souffle du dragon putride, en plus de subir les DM, il est également nauséeux et affaibli pour 1d4 rounds. Les dragons de pestilence sont immunisés aux DM d’acide. Dragons neutres Ces dragons sont généralement solitaires et vivent loin des communautés humanoïdes avec lesquelles ils évitent d’interagir. Toutefois, mal- heur à ceux qui empiètent sur leur territoire. Les dragons des forêts sont reconnais- sables aux plumes qui poussent au creux de certaines de leurs articulations (cou notamment) et à leurs écailles ressemblant à de l’écorce lorsqu’ils vieillissent. Leur souffle est un nuage empoisonné qui agit par simple contact. Là où le souffle touche le sol, les plantes grandissent et s’agitent pendant 1d4 rounds, divisant par deux le mouvement de toutes les créatures dans la zone. Les dragons des forêts sont immunisés aux DM de poison. Les dragons du désert ont un corps long et sinueux les aidant à s’enterrer sous les dunes, et des écailles dorées leur permettant de se confondre avec le sable du désert. Leur souffle est constitué de multiples éclairs qui se dirigent vers les cibles situées à portée dans un claque- ment de tonnerre. En plus des DM qui leur sont infligés, celles qui ont raté leur test d’AGI sont sourdes pour 2d4 rounds et subissent un malus de -2 à leurs tests d’attaque magique pour lancer des sorts. Les dragons du désert sont immunisés aux DM d’électricité. Les dragons des montagnes ont des écailles grises de la couleur du roc et sont trapus et mas- sifs. Ils soufflent le feu, ce qui les rend assez faciles à confondre avec les dragons de lave pour les néophytes. Ils sont pourtant beaucoup moins agressifs, bien qu’une fois en colère, ils ne soient pas moins dangereux. Si une créature rate son test d’AGI contre le souffle de feu d’un dragon des montagnes, en plus des DM qu’elle subit, elle est aveuglée pendant 1 round par la lueur incandescente. Les dragons des montagnes sont immunisés aux DM de feu. Les dragons des mers arborent des écailles aux reflets irisés, à la façon des poissons. Sous l’eau, ils utilisent leurs ailes pour nager à grande vitesse et sont capables de respirer dans et hors de l’élément liquide. Leur souffle est une vague d’eau très puissante et acide. Sur la terre ferme, si une créature rate son test d’AGI contre le souffle d’un dragon des mers, en plus de subir les DM, elle est renversée (sous l’eau, elle est propulsée vers l’arrière jusqu’à se retrouver à la portée maximale du souffle). Les dragons des mers sont immunisés aux DM d’acide. Dragons bienfaisants Les dragons bienfaisants ont des écailles cris- tallines semi-transparentes du plus bel effet. Lorsqu’ils se tiennent immobiles, on dirait des statues de cristal. Ils se tiennent généralement à l’écart des peuples humanoïdes, dont ils res- 1 pectent la liberté tant que celle-ci n’empiète pas sur leur territoire de façon trop invasive ou tant que les forces du mal ne mettent pas en danger la cohésion du monde. Dans ce dernier cas, il leur arrive d’intervenir pour rétablir l’équilibre. Tous les dragons cristallins peuvent utiliser deux variantes de souffle : un souffle qui inflige des DM et un autre qui emprisonne leurs adversaires dans une gangue de cristal (voir plus loin). Les dragons de rubis vivent principalement dans les montagnes ou les plaines, dans des lieux moins reculés que leurs cousins. Ce sont les plus actifs et les plus enclins à se mêler des affaires du monde. Parmi les dragons du Bien, ce sont aussi ceux qui amassent le plus de richesses. Ils ont des écailles rouges, soufflent le feu et sont immuni- sés aux DM de feu. Le feu des dragons de rubis double ses DM contre les morts-vivants, et les démons ne bénéficient pas de leur immunité au feu contre ce souffle. Les dragons de diamant sont les plus sages et les plus savants des dragons, ils surveillent l’équilibre des forces cosmiques avec attention. Leurs vastes cavernes peuvent se trouver n’im- porte où, mais souvent sous d’antiques cités en ruine dont ils savourent avec nostalgie les allées désertes. Leur repaire est généralement rempli de souvenirs qui sont autant de reliques du passé. Ils soufflent une lumière de mana pur qui inflige des DM similaires à ceux d’un Projectile de mana. Aucun sort connu ne permet de s’en protéger. Les dragons d’émeraude vivent dans les forêts et tous les lieux où la nature est luxuriante, nature qu’ils chérissent et protègent. Comme ce sont les plus reclus des dragons cristallins, il y a peu de chances de les rencontrer. Mais détrui- sez la forêt et vous aurez de fortes chances de devoir leur rendre des comptes. Leur souffle est un nuage empoisonné : au lieu d’un test d’AGI, c’est un test de CON qui permet de réduire les DM de moitié. Les dragons de saphir vivent sur les plus hautes cimes et les plus hauts sommets, là où l’air est rare, mais aussi sur d’étranges nuages que leur magie permet d’agréger jusqu’à les rendre suffi- samment denses pour qu’ils s’y installent. Ce sont les dragons les plus détachés des affaires du monde et ils passent leurs journées entre médi- tation et longs vols planés dans la stratosphère. Ce sont de grands amateurs d’art, de musique et de poésie, et il est possible d’attirer leur atten- tion par ce moyen. Les dragons de saphir ont des écailles bleues, et leur souffle est une onde sonore qui brise la structure de la matière. Si une créature rate son test d’AGI contre le souffle du dragon de saphir, les objets de pierre ou de métal non magique qu’elle porte se fracturent et tombent en morceaux. Écologie Tous les dragons parlent le draconien et apprennent d’autres langues en vieillissant. Ils deviennent de plus en plus puissants avec l’âge et leur taille peut atteindre plus de 30 m. Les dragons sont des créatures très intelligentes, aux sens très affûtés, et certains utilisent la magie. Les dragons pondent des œufs sur lesquels les femelles veillent jalousement pendant une année entière. Après éclosion, elles nourrissent leurs dragonneaux pendant encore trois années durant lesquelles ils apprennent petit à petit à sortir de l’antre qu’elles ont choisi. Cette période écoulée, ils sont prêts à vivre leur propre vie qui, si elle n’est pas brusquement interrompue, sera particulièrement longue. Les dragons continuent à grandir tout au long de leur existence, mais plus ils vieillissent, moins ils sont actifs. Petit à petit, ils se retirent du monde et s’endorment pour des périodes de plus en plus longues. Les spécimens les plus anciens peuvent atteindre 1 500, voire 2 000 ans. À cet âge-là, leur taille est absolument monumentale et ils passent la majorité de leur temps à dormir, car la vie est devenue un puits de souffrance. Combat Les dragons sont de fantastiques machines à tuer. Généralement, ils commencent par utiliser leur capacité à inspirer la terreur pour disloquer les rangs de leurs adversaires, puis ils utilisent leur souffle dès que possible (et aussi souvent que possible). Enfin, ils attaquent au contact de toute leur puissance. Leur seul point faible est leur orgueil : ils ne supportent pas que de simples mortels les défient impunément. Toutefois, ils sont aussi très intelligents, et lorsqu’un dragon décide de s’attaquer à une agglomération ou à une forteresse, il profite aussi longtemps que possible de sa mobilité dans les cieux et de son souffle pour réduire les lieux en cendres, sans daigner se poser et combattre au sol des adversaires qu’il juge indignes de lui. Capacités communes aux dragons" }, { n: "Coup de queue", a: "G", d: "Chaque fois qu’un adversaire (que le dragon n’a pas lui-même attaqué au tour précédent) attaque le dragon dans le dos, il subit une attaque de queue gratuite équivalant à une attaque avec des DM divisés par deux." }, { n: "Immunités", d: "Un dragon est immunisé au sommeil et à la paralysie, et ne subit aucun DM du type correspondant à son souffle." }, { n: "Inspirer la terreur", d: "Lorsque le dragon attaque pour la première fois, toutes les créatures à moins de 30 m doivent réussir un test d’attaque magique contre [10 + attaque magique du dragon] ou être submergées par la peur et subir l’état affaibli pendant 1d4 rounds. Si le test est raté avec une marge de 10 ou plus, la victime doit fuir aussi loin que possible pendant la même durée." }, { n: "Souffle", a: "L", d: "Le souffle est une attaque de zone affectant toutes les créatures dans un cône (bébé 5 m de long x 5 m de large à son extrémité, juvénile 10 m × 10 m, jeune 15 m × 15 m et adulte ou ancien 20 m × 20 m). L’attaque inflige automatiquement [(NC + 2) × 1d6] DM (par exemple 6d6 pour NC 4). Afin de ne pas lancer des brouettes de dés, dès que les DM dépassent 6d6, convertissez les dés supplémentaires en autant de +3 DM. Par exemple, pour un NC 10, 6d6+18 au lieu de 12d6. Les DM sont divisés par deux si la victime réussit un test d’AGI difficulté 15. Après chaque utilisation, le dragon doit attendre 1d4 rounds avant d’utiliser à nou- veau son souffle." }, { n: "Souffle cristallin", d: "Lorsqu’il utilise cette variante, un dragon bienfaisant affecte une zone équivalente à son souffle habituel. Toutes les créatures dans cette zone doivent réussir un test de FOR diffi- culté [8 + FOR du dragon] ou être prises dans une gangue de cristal de la couleur corres- pondant au dragon. La victime est paralysée et en animation suspendue (comme si le temps s’était arrêté), et le cristal lui octroie une RD 10. La gangue de cristal explose si on lui inflige au moins 20 DM ou d’elle-même au bout de [NC du dragon] minutes." }, { n: "Vol rapide", d: "Le dragon obtient une action de mouvement supplémentaire par round lorsqu’il est en vol. Au premier round de combat, s’il est en vol et attaque une créature au sol, le dragon bénéfi- cie d’un dé bonus en attaque et de +1d4° DM (dragon juvénile d6, jeune d8, adulte d10, ancien d12). Un bébé dragon ne bénéficie pas de cette capacité." }]
},

{
  id: "bebe_dragon", nom: "Bébé Dragon", cat: "fantastique", nc: 2, ncLabel: "2",
  type: "Créature fantastique", taille: "Moyenne", env: ["urbain"],
  car: { AGI: [2, 1], CON: [2], FOR: [2], PER: [1, 1], CHA: [0], INT: [-1], VOL: [2] },
  def: 16, pv: 15, init: 14,
  att: [],
  caps: [{ n: "Souffle", a: "L", d: "Une seule fois par combat. Le bébé dragon n’inspire pas la terreur et ne possède pas la capacité de vol rapide." }]
},

{
  id: "dragon_juvenile", nom: "Dragon Juvénile", cat: "fantastique", nc: 6, ncLabel: "6",
  type: "Créature fantastique", taille: "Grande", env: ["ruines"],
  car: { AGI: [4, 1], CON: [5], FOR: [5], PER: [2, 1], CHA: [0], INT: [0], VOL: [4] },
  def: 20, pv: 70, init: 15,
  att: [{ n: "Morsure et griffes", mod: 10, dmg: "1d8+5 Attaque magique +10", note: "2 attaques" }],
  caps: []
},

{
  id: "dragon_jeune", nom: "Dragon Jeune", cat: "fantastique", nc: 10, ncLabel: "10",
  type: "Créature fantastique", taille: "Énorme", env: ["ruines"],
  car: { AGI: [3, 1], CON: [8], FOR: [8], PER: [3, 1], CHA: [2], INT: [2], VOL: [5] },
  def: 24, pv: 140, init: 16,
  att: [{ n: "Morsure et griffes", mod: 13, dmg: "1d12+8 Attaque magique +14", note: "2 attaques" }],
  caps: [{ n: "Emporter dans les airs", d: "Sur un résultat de 17-20 au test d’attaque, le dragon peut emporter dans les airs une victime de taille inférieure à la sienne au prix d’une action de mouvement. Au premier round, si la victime se libère (test de FOR difficulté 18), elle subit 4d4° DM de chute. Aux rounds suivants, si le dragon prend de l’altitude, les DM passent à 7d4°, puis 10d4°. Le dé évolutif des DM de chute est indexé sur le niveau de la victime." }]
},

{
  id: "dragon_adulte", nom: "Dragon Adulte", cat: "fantastique", nc: 14, ncLabel: "14",
  type: "Créature fantastique", taille: "Colossale", env: ["marais"],
  car: { AGI: [2, 1], CON: [12], FOR: [12], PER: [4, 1], CHA: [4, 1], INT: [4], VOL: [6] },
  def: 29, pv: 220, init: 17,
  att: [{ n: "Morsure et griffes", mod: 16, dmg: "2d10+12 Attaque magique +17", note: "2 attaques" }],
  caps: [{ n: "Emporter dans les airs", d: "Comme pour le dragon jeune, sauf le test de FOR difficulté 22." }, { n: "Fauchage", d: "Lorsque le dragon réussit une attaque avec 17-20 au d20, la victime doit réussir un test de FOR ou d’AGI (au choix) difficulté 22 ou être renversée." }, { n: "Colossal", d: "Le dragon bénéficie d’une RD 3 du fait sa taille." }, { n: "Changeforme", d: "À cet âge, un dragon peut se transformer en une autre créature (éventuellement en humain) pendant 24 heures, une fois par jour. Il conserve ses PV, mais utilise les attaques naturelles non magiques de la forme choisie." }]
},

{
  id: "dragon_ancien", nom: "Dragon Ancien", cat: "fantastique", nc: 18, ncLabel: "18",
  type: "Créature fantastique", taille: "Colossale", env: ["marais"],
  car: { AGI: [1, 1], CON: [14], FOR: [14], PER: [6, 1], CHA: [6, 1], INT: [6, 1], VOL: [6] },
  def: 30, pv: 280, init: 19,
  att: [{ n: "Morsure et griffes", mod: 18, dmg: "2d12+14 Attaque magique +20", note: "2 attaques" }],
  caps: [{ n: "Emporter dans les airs", d: "Comme pour le dragon jeune, sauf le test de FOR difficulté 24." }, { n: "Fauchage", d: "Lorsque le dragon réussit une attaque avec 17-20 au d20, la victime doit réussir un test de FOR ou d’AGI (au choix) difficulté 24 ou être renversée." }, { n: "Changeforme", d: "À cet âge, un dragon peut se transformer en une autre créature (éventuellement en humain) jusqu’à 3 fois par jour. Il conserve ses PV, mais utilise les attaques naturelles non magiques de la forme choisie." }, { n: "Balayage", d: "Le dragon peut viser deux créatures à son contact d’un seul coup de patte/arme. Il ne fait qu’un seul test d’attaque pour les deux cibles. Si les deux sont touchées, la cible secondaire (désignée par le MJ) ne subit que la moitié des DM." }, { n: "Colossal", d: "Le dragon bénéficie d’une RD 6 du fait de sa taille. INJONCTION (G)* : Si le dragon réussit un test opposé d’attaque magique contre une cible à une portée de 20 m (max. 3 fois par jour), la victime doit exécuter un ordre pendant son prochain tour. Il s’agit d’un ordre simple de deux ou trois mots, non suicidaire, que la cible doit pouvoir comprendre." }]
},

{
  id: "dragon_mort_vivant", nom: "Dragon Mort-vivant", cat: "fantastique", nc: 18, ncLabel: "18",
  type: "Créature fantastique", taille: "Colossale", env: ["marais", "arctique"],
  desc: "Il ne reste que les os de ce dragon, comme si quelque archéologue avait patiemment collecté chacun d’entre eux et les avait mis en place pour l’exposer dans un muséum d’histoire naturelle.",
  car: { AGI: [1], CON: [14], FOR: [14, 1], PER: [0], CHA: [-2], INT: [5], VOL: [6] },
  def: 30, pv: 300, init: 10,
  att: [{ n: "Morsure et griffes", mod: 18, dmg: "2d10+14 + 1d10 drain", note: "2 attaques" }, { n: "Attaque magique", mod: 20 }],
  caps: [{ n: "Coup de queue", a: "G", d: "Chaque fois qu’un adversaire attaque le dra- gon dans le dos, il subit une attaque de queue gratuite dont les DM sont divisés par deux. On considère qu’une attaque dans le dos a lieu lorsque le dragon est attaqué par un PJ que le dragon n’a pas lui-même attaqué à son tour précédent." }, { n: "Drain", d: "Chaque fois que le dragon inflige des DM, il draine la vitalité de sa victime : celle-ci subit +1d10 DM qui s’ajoutent aux PV du dragon mort-vivant (sans dépasser son maximum de PV)." }, { n: "Inspirer la terreur", d: "Lorsque le dragon attaque pour la première fois, toutes les créatures à moins de 30 m doivent réussir un test opposé d’attaque magique ou être submergées par la peur et subir l’état affaibli pendant 1d4 rounds." }, { n: "Résistance aux dm", d: "Le dragon squelettique divise par 2 les DM de type perforant ou tranchant ainsi que les DM de froid." }, { n: "Souffle de mort", d: "Le souffle du dragon mort-vivant est un nuage ténébreux dans une zone de 30 m de long sur 30 m de large. L’attaque inflige automati- quement 5d10+30 DM nécrotiques (énergie négative de la non-vie ; n’affecte pas les morts-vivants). Les DM sont divisés par deux si la victime réussit un test de CON difficulté 15. Après chaque utilisation, le dragon doit attendre 1d4 rounds avant d’utiliser à nouveau son souffle. Les humanoïdes tués par le souffle de mort se relèvent sous la forme de zombies à son service. Un PJ réduit à 0 PV de cette façon doit réussir un test de CON difficulté 15 au round suivant ou subir le même sort !" }, { n: "Magie", a: "M", d: "Le dragon peut lancer tous les sorts de la voie de l’outre-tombe (sorcier). Il peut utiliser Peur 3 fois par combat et tous les autres sorts une fois par combat. Lancer un sort est une action de mouvement." }]
},

{
  id: "drortue", nom: "Drortue", cat: "fantastique", nc: 15, ncLabel: "15",
  type: "Créature fantastique", taille: "Colossale", env: ["foret", "marais"],
  desc: "Parfois appelé dragon-tortue, le drortue res- semble davantage à une tortue géante qu’à un dragon, bien que sa tête et sa gueule soient très similaires à celles de son illustre cousin.",
  car: { AGI: [0], CON: [14], FOR: [14, 1], PER: [0], CHA: [-2], INT: [-2], VOL: [0] },
  def: 30, pv: 260, init: 10,
  att: [{ n: "Morsure", mod: 19, dmg: "2d10+14", note: "2 attaques" }],
  caps: [{ n: "Carapace", d: "Grâce à sa carapace, le dragon-tortue bénéfi- cie d’une RD 6 contre les DM physiques." }, { n: "Créature aquatique", a: "M", d: "Sous l’eau, le dragon-tortue peut se déplacer de 15 m par action de mouvement." }, { n: "Gober", d: "Lorsque le drortue obtient un résultat de 17-20 au d20, il avale tout entière une cible de taille énorme ou inférieure. Si la victime échoue à un test de FOR difficulté 24, elle passe direc- tement dans l’estomac du monstre. Un per- sonnage avalé subit 3d12 DM d’asphyxie et d’acide par round. Il peut attaquer avec une arme pas plus grande qu’une dague en réus- sissant un test de FOR difficulté 15 à chaque attaque. L’attaque se fait avec un dé malus et les DM sont divisés par deux." }, { n: "Souffle bouillant", a: "L", d: "Le drortue peut cracher de l’eau bouillante ou de la vapeur brûlante selon qu’il est sous l’eau ou à l’air libre. Le souffle est une attaque de zone affectant toutes les créatures dans un cône de 30 m de long sur 30 m de large. L’attaque inflige automatique- ment 6d10+20 DM de chaleur. Les DM sont divisés par deux si la victime réussit un test d’AGI difficulté 15. Après chaque utilisation, le drortue doit attendre 1d4 rounds avant d’utiliser à nouveau son souffle." }, { n: "Brise navire", d: "Un drortue en colère est capable de venir à bout d’un navire. Une barque est détruite en 1 round, un voilier avec un seul mât en 3 rounds, un deux-mâts ou une birème en 5 rounds, et un trois-mâts ou une trirème en 7 rounds. Un gros navire amiral pourrait espérer tenir 10 rounds. Au bout du temps imparti, le navire est détruit." }]
},

{
  id: "dryade", nom: "Dryade", cat: "humanoide", nc: 3, ncLabel: "3",
  type: "Humanoïde", taille: "Moyenne", env: ["foret", "marais", "arctique", "urbain"],
  desc: "Katioucha avait toujours aimé les arbres. Petite, déjà, elle s’enfuyait de la maison et s’endormait à leur pied. Son père savait qu’il la trouverait là et la portait assoupie jusqu’à son lit.",
  car: { AGI: [4, 1], CON: [0], FOR: [0], PER: [3, 1], CHA: [4, 1], INT: [2], VOL: [3] },
  def: 17, pv: 30, init: 16,
  att: [{ n: "Dague", mod: 6, dmg: "1d4+4 Arc court (2 attaques, 30 m) +6 · DM 1d6+3", note: "2 attaques" }, { n: "Attaque magique", mod: 6 }],
  caps: [{ n: "Résistance aux dm", d: "La dryade bénéficie d’une RD 5 contre toutes les armes qui ne sont pas en fer froid (un alliage spécial forgé à froid et particulièrement rare). En revanche, les DM qui lui sont infligés par des armes en fer froid sont doublés." }, { n: "Symbiose", d: "Chaque dryade vit en symbiose avec un bosquet. Elle peut se réfugier dans un arbre (M) et ne peut plus subir de DM tant qu’elle est à l’intérieur du tronc (l’arbre possède 100 PV et une RD 5). Elle est incapable de s’éloigner de plus de quelques kilomètres de son bosquet ; si elle le fait, elle est affaiblie et perd 1d6 PV par heure." }, { n: "Porte végétale", a: "M", d: "La dryade peut pénétrer dans le tronc d’un gros arbre et sortir de celui d’un autre appar- tenant à son bosquet. Elle peut utiliser cette capacité à volonté." }, { n: "Magie de la nature", d: "La dryade peut lancer les sorts suivants 3 fois par jour chacun. ANIMATION D’UN ARBRE (A)* : La dryade peut animer un arbre en le touchant. Il combat à son service pendant 10 rounds. Elle peut animer un seul arbre à la fois." }, { n: "Arbre animé", d: "AGI -2, CON +3, FOR +3, PER -2, CHA -2, INT -2, VOL +6, DEF 15, PV 30, Init. 8, Attaque de contact +6 DM 1d6+3, dépla- cement 5 m par action de mouvement. FLÈCHE VIVANTE (A)* : En une action d’attaque, la dryade enchante une flèche et la décoche contre une cible (elle doit tenir un arc en main). Si elle réussit le test d’attaque à distance, la flèche inflige les DM habituels. Au round suivant, la flèche prend racine dans la plaie et devient un arbuste, infligeant +3d10 DM. Si la victime est réduite à 0 PV par ce sort, un jeune arbuste pousse sur son cadavre. PRISON VÉGÉTALE (M)* : La dryade peut commander à la végétation de pousser et bloquer ses ennemis (mais pas ses alliés) dans une zone de 10 m de diamètre (portée 20 m) pendant 3 min. Les cibles sont immobilisées. À son tour, une créature peut tenter de se libérer (action d’attaque) par un test de FOR difficulté 13. En cas de réussite, elle n’est plus affectée par le sort pour le reste du combat. SOMMEIL (A)* : Une fois par combat, la dryade vise une zone de 10 m de diamètre à une portée maximale de 20 m. Le sort affecte jusqu’à 1d6+4 créatures vivantes de NC inférieur ou égal à 2. Les créatures perdent conscience pendant 4 min. Il est possible de les réveiller en les giflant violemment (action d’attaque, 1 DM)." }]
},

{
  id: "echosaurus", nom: "Échosaurus", cat: "fantastique", nc: 8, ncLabel: "8",
  type: "Créature fantastique", taille: "Grande", env: ["marais", "souterrain", "arctique", "urbain"],
  desc: "Un pas lourd se fit entendre. Dusk Martefeu s’accroupit derrière son large bouclier de métal et attendit dans la galerie obscure. Le nain n’en avait cure, il voyait bien assez dans le noir pour écraser son marteau sur le groin de la créature.",
  car: { AGI: [1], CON: [7], FOR: [7], PER: [3, 1], CHA: [-3], INT: [-2], VOL: [0] },
  def: 24, pv: 140, init: 16,
  att: [{ n: "Morsure", mod: 13, dmg: "1d10+7" }],
  caps: [{ n: "Cône sonore", a: "L", d: "L’échosaurus émet un son destructeur dans un cône de 20 m de long et 10 m de large. Les créatures dans la zone d’effet subissent 5d6+15 DM (la moitié si elles réussissent un test de CON difficulté 15). L’onde sonore de l’échosaurus affecte aussi la matière (murs, portes, etc.). L’échosaurus peut utiliser le cône sonore tous les 1d4 rounds." }, { n: "Écholocalisation", d: "L’échosaurus localise toutes les créatures à moins de 30 m autour de lui, même si elles sont invisibles. En revanche, si un sort l’empêche d’entendre (silence), il est aveuglé (et son cône sonore voit ses DM divisés par deux)." }, { n: "Renverser", d: "Lorsque l’échosaurus réussit une attaque de queue avec un résultat de 17-20 au d20, la victime doit réussir un test d’AGI ou de FOR (au choix) difficulté 17 ou être renversée. ÉLÉMENTAIRES « At u a k M a’Fra a k , At u a M a’A Fraak, Atuaka ! » Une explosion de lave ponctua la fin de la formule magique. Le shaman recula préci- pitamment pour éviter la roche en fusion et bouscula un des novices, qui tomba du pont en hurlant, immédiatement dévoré par le lac de feu. Mab’Aa songea que ce sacrifice ne pouvait que renforcer l’invocation. En réponse, une flamme jaillit là où le corps avait été englouti. Elle se mit à tourbillonner et à grandir pour bientôt devenir une tornade de feu. Son sommet atteignait désormais la hauteur du pont et elle épaississait en aspirant l’énergie du lac incandescent. La silhouette déplia deux appendices similaires à de puissants bras, et enfin un renflement qui aurait pu figurer une tête. Celle-ci arrivait à hauteur de Mab’Aa et deux puits étincelants fixaient le shaman. Le colosse de feu parla d’une voix puissante et crépitante : « Ordonne et j’obéirai ! » L’élémentaire parlait en abyssal, mais le sha- man avait appris cette langue. L’invocation avait dépassé ses espérances. Il répondit dans la même langue : « Tue et brûle mes enne- mis ! » Il désigna l’entrée du tunnel. Les élémentaires sont les incarnations des quatre éléments primordiaux : le feu, l’eau, la terre et l’air. Ils peuvent être invoqués par magie et se manifestent dans notre monde sous la forme d’une créature au buste vaguement humanoïde, mêlée à un tourbillon de matière élémentaire. POUDRE ÉLÉMENTAIRE Lorsqu’un élémentaire a été invoqué sur le plan matériel et vaincu, il laisse parfois der- rière lui un résidu appelé poudre élémentaire. Le résidu d’un élémentaire de terre est similaire à du sable, tandis que celui d’un élémentaire de feu ressemble à de la cendre. La poudre d’élé- mentaire d’air ressemble à de la magnésie et celle d’un élémentaire d’eau à un gel transparent. Lancez un d6 et si le résultat est inférieur ou égal à la probabilité indiquée dans le tableau ci-après, un résidu est présent. Prélever et conserver la poudre requiert de réussir un test d’INT (connaissance de la magie) difficulté 15. La quantité de poudre ne varie pas en fonc- tion de la taille de l’élémentaire, seule la qua- lité augmente. Un lanceur de sorts peut utiliser cette poudre pour augmenter l’effet d’un sort correspondant à l’élément. Il améliore le d4 du dé évolutif d’un cran par taille de l’élémentaire (par exemple, s’il est de niveau 6 (d6), la poudre d’un élémentaire moyen permet de passer au d8. Il n’y a pas de palier au-delà du d12, mais chaque cran supplé- mentaire permet alors de relancer un dé. Il est difficile de trouver de la poudre élémen- taire. La valeur indiquée dans le tableau corres- pond au prix à payer si vous trouvez un alchimiste de confiance. À la revente, le résidu vaut un tiers de sa valeur et il faut établir une relation de confiance avec le marchand, car il n’y a aucun moyen connu pour vérifier la qualité de la poudre tant qu’elle n’est pas utilisée. C’est pour- quoi les arnaques fleurissent. Écologie On connaît très peu de choses sur les élémentaires dans leur milieu d’origine tant les plans élémentaires sont inac- cessibles et dangereux pour le commun des mortels. Il semble simplement qu’ils soient très communs sur ces plans, en particulier les élémentaires les plus petits. Taille de l’élémentaire Probabilité d’un résidu Dé évolutif Valeur Petit Moyen Grand Énorme Colossal +1 20 pa +2 50 pa +3 150 pa +4 300 pa +5 500 pa Capacités communes Tous les élémentaires partagent les capaci- tés suivantes." }, { n: "Vision", d: "L’élémentaire voit dans le noir à 30 m et peut déterminer la localisation de toute créature en contact avec son élément à moins de 30 m, même si elle est invisible." }, { n: "Tourbillon", a: "L", d: "Une fois par combat, un élémentaire peut se transformer en tourbillon de matière élémentaire pendant 3 rounds. Sous cette forme, il peut se déplacer à travers les créatures et les objets à la vitesse de 10 m par action de mouvement (20 m pour les élémentaires d’air). Toute créature sur son passage doit réussir un test d’AGI ou de FOR (au choix) de difficulté (10 + FOR de l’élémentaire) ou subir les DM de base de l’élémentaire et être renversée (si sa taille est inférieure ou égale à celle de l’élémentaire). En cas de succès, elle ne subit que la moitié des DM et peut rester debout." }, { n: "Résistance", d: "Les élémentaires divisent par 2 tous les DM des armes non magiques, ce qui peut valoir +1 NC si les PJ n’ont pas l’équipement requis." }, { n: "Langage", d: "Les élémentaires comprennent la langue qui correspond à leur élément (feu : abyssal, terre : runique, eau : aquarien, air : célestien). Seuls les plus gros élémentaires (énorme et colossal) sont capables de le parler, bien que de façon très limitée. Particularités Élémentaires d’air : les élémentaires d’air sont immunisés aux DM d’électricité. L’élémentaire d’air projette des objets sur l’adversaire (cailloux, meubles, armes), les plus gros projettent l’adversaire lui-même. L’asphyxie est un autre mode d’attaque de ce type d’élémentaire. Avantages : l’élémentaire d’air obtient un bonus de +3 en Init. et à tous les tests d’AGI. 1 Il peut se déplacer en vol de 20 m par action de mouvement. Élémentaires d’eau : les élémentaires d’eau sont immunisés aux DM d’acide. L’élémentaire d’eau percute l’adversaire ou le noie. Avantages : l’élémentaire d’eau régénère NC PV par round (sauf DM de feu). Élémentaires de feu : les élémentaires de feu sont immunisés aux DM de feu. L’élémentaire de feu brûle ses adversaires. Avantages : l’élémentaire de feu inflige auto- matiquement 1d4° DM à toute créature qui l’at- taque au contact. Élémentaires de terre : les élémentaires de terre sont immunisés aux DM de froid. L’élémentaire de terre frappe l’adversaire. Avantages : l’élémentaire de terre obtient un bonus de +3 en DEF." }]
},

{
  id: "elementaire_petit", nom: "Élémentaire (Petit)", cat: "fantastique", nc: 1, ncLabel: "1",
  type: "Créature fantastique", taille: "Petite", env: ["ruines"],
  car: { AGI: [2], CON: [-1, 1], FOR: [-1], PER: [0], CHA: [-2], INT: [-4], VOL: [4] },
  def: 14, pv: 15, init: 10,
  att: [{ n: "Coups", mod: 4, dmg: "2d6-1" }],
  caps: []
},

{
  id: "elementaire_moyen", nom: "Élémentaire (Moyen)", cat: "fantastique", nc: 2, ncLabel: "2",
  type: "Créature fantastique", taille: "Moyenne", env: ["ruines"],
  car: { AGI: [2], CON: [3, 1], FOR: [3], PER: [0], CHA: [-2], INT: [-3], VOL: [4] },
  def: 17, pv: 30, init: 10,
  att: [{ n: "Coups", mod: 6, dmg: "2d6+4" }],
  caps: []
},

{
  id: "elementaire_grand", nom: "Élémentaire (Grand)", cat: "fantastique", nc: 5, ncLabel: "5",
  type: "Créature fantastique", taille: "Grande", env: ["ruines"],
  car: { AGI: [2], CON: [6, 1], FOR: [6], PER: [0], CHA: [-2], INT: [-2], VOL: [4] },
  def: 19, pv: 70, init: 10,
  att: [{ n: "Coups", mod: 10, dmg: "1d8+6", note: "2 attaques" }],
  caps: [{ n: "Fauchage", d: "Lorsque l’élémentaire réussit une attaque avec un résultat de 17-20 au d20, la victime doit réussir un test de FOR ou d’AGI (au choix) difficulté 16 ou être renversée." }, { n: "Grand", d: "L’élémentaire bénéficie d’une RD 3 du fait de sa taille." }]
},

{
  id: "elementaire_enorme", nom: "Élémentaire (Énorme)", cat: "fantastique", nc: 9, ncLabel: "9",
  type: "Créature fantastique", taille: "Énorme", env: ["ruines"],
  car: { AGI: [2], CON: [10, 1], FOR: [10], PER: [0], CHA: [-1], INT: [-1], VOL: [4] },
  def: 24, pv: 160, init: 10,
  att: [{ n: "Coups", mod: 13, dmg: "2d6+10", note: "2 attaques" }],
  caps: [{ n: "Balayage", d: "L’élémentaire peut viser deux créatures à son contact d’un seul coup. Il ne fait qu’un seul test d’attaque pour les deux cibles. Si les deux sont touchées, la cible secondaire (désignée par le MJ) ne subit que la moitié des DM." }, { n: "Énorme", d: "L’élémentaire bénéficie d’une RD 6 du fait de sa taille." }, { n: "Fauchage", d: "Comme l’élémentaire (grand)." }]
},

{
  id: "elementaire_colossal", nom: "Élémentaire Colossal", cat: "fantastique", nc: 14, ncLabel: "14",
  type: "Créature fantastique", taille: "Colossale", env: ["ruines"],
  car: { AGI: [2], CON: [14, 1], FOR: [14], PER: [0], CHA: [-1], INT: [-1], VOL: [4] },
  def: 29, pv: 240, init: 10,
  att: [{ n: "Coups", mod: 17, dmg: "2d10+14", note: "2 attaques" }],
  caps: [{ n: "Colossal", d: "L’élémentaire bénéficie d’une RD 6 du fait de sa taille." }, { n: "Projection", d: "Lorsque l’élémentaire réussit une attaque avec un résultat de 17-20 au d20, la victime est projetée à 1d6+1 m de là et subit +2d10 DM. Elle est renversée, et si elle échoue à un test de CON difficulté 15, elle est étourdie pour 1 round." }, { n: "Balayage", d: "Comme l’élémentaire (énorme). ELFE DES BOIS Les caractéristiques présentées ici corres- pondent à des elfes archers qui sillonnent et défendent leur territoire. Ils sont souvent très discrets et n’apprécient pas les étrangers, encore moins les nains ou les sang-mêlé. Ils sont souvent une demi-douzaine, guidés par un chef. En règle générale, ils n’attaquent pas à vue et avertissent d’abord les étrangers qui empiètent sur leur territoire. Cependant, en cas de conflit de frontière avéré, des groupes plus agressifs ne sont pas à exclure." }]
},

{
  id: "elfe_de_base", nom: "Elfe De Base", cat: "humanoide", nc: 2, ncLabel: "2",
  type: "Humanoïde", taille: "Moyenne", env: ["ruines"],
  car: { AGI: [4, 1], CON: [0], FOR: [0], PER: [3, 1], CHA: [1], INT: [1], VOL: [0] },
  def: 17, pv: 15, init: 16,
  att: [{ n: "Arc court", mod: 6, dmg: "1d6+3", portee: 30 }, { n: "Épée courte", mod: 6, dmg: "1d6", note: "2 attaques" }],
  caps: [{ n: "Embuscade", d: "Au premier round de combat, dans un environ- nement permettant à l’elfe de se dissimuler, la cible doit réussir un test de PER difficulté 19 ou être surprise. S’il attaque avec succès une cible surprise, l’elfe lui inflige +2d4 DM. L’elfe bénéficie de +5 à tous ses tests de discrétion." }, { n: "Tir tactique", d: "Lorsque l’elfe obtient 15-20 au d20 sur un test d’attaque, si l’attaque est réussie, la cible subit les DM habituels et doit réussir un test de CON difficulté 15 ou être désarmée, ralentie ou aveuglée (choix du MJ) pendant 1 round." }, { n: "Flèche sanglante", a: "L", d: "L’elfe fait une attaque à distance qui provoque une hémorragie (pas de tir tactique). En plus des DM normaux, la flèche produit un effet de saignement qui inflige à la victime 1d4 DM à chaque round suivant jusqu’à ce que la cible soit soignée (tout effet de soins ou une action limitée utilisée à cet effet). On ne peut pas cumuler plusieurs effets de saignement." }]
},

{
  id: "elfe_chef", nom: "Elfe (Chef)", cat: "humanoide", nc: 4, ncLabel: "4",
  type: "Humanoïde", taille: "Moyenne", env: ["ruines"],
  car: { AGI: [5, 1], CON: [0], FOR: [1], PER: [4, 1], CHA: [2], INT: [2], VOL: [2] },
  def: 18, pv: 50, init: 17,
  att: [{ n: "Arc long", mod: 8, dmg: "1d8+4 Épée courte (2 attaques) +8 · DM 1d8+3", portee: 50 }],
  caps: [{ n: "Embuscade", d: "Au premier round de combat, dans un environ- nement permettant à l’elfe de se dissimuler, la cible doit réussir un test de PER difficulté 19 ou être surprise. S’il attaque avec succès une cible surprise, l’elfe lui inflige +2d4 DM. L’elfe bénéficie de +5 à tous ses tests de discrétion." }, { n: "Imparable", d: "Si l’elfe obtient 17-20 au d20 d’un test d’at- taque, l’attaque est automatiquement réussie et inflige +2d4 DM. Les dés obtenus en bonus ne sont pas multipliés en cas de critique." }]
},

{
  id: "elfe_champion", nom: "Elfe (Champion)", cat: "humanoide", nc: 6, ncLabel: "6",
  type: "Humanoïde", taille: "Moyenne", env: ["ruines"],
  car: { AGI: [5, 1], CON: [1], FOR: [1], PER: [4, 1], CHA: [2], INT: [2], VOL: [3] },
  def: 18, pv: 50, init: 17,
  att: [{ n: "Arc long", mod: 8, dmg: "1d8+7 Épée courte (2 attaques) +8 · DM 1d8+7", portee: 50 }],
  caps: [{ n: "Embuscade et imparable", d: "Voir Elfe (chef)" }, { n: "Flèche chercheuse", a: "L", d: "Une fois par jour, l’elfe peut enchanter une flèche afin qu’elle trouve sa cible de façon infaillible. Il doit avoir blessé ou vu la créa- ture ciblée moins de 10 rounds (1 min) plus tôt. Il tire ensuite sa flèche en l’air et celle-ci voyage aussi loin que nécessaire (y compris à travers les plans) pour trouver sa cible. L’archer fait un test d’attaque normal et obtient +2d6 DM." }, { n: "Riposte", a: "G", d: "L’elfe peut effectuer une attaque en action gra- tuite contre chaque adversaire qui l’attaque, à l’exception de celui qu’il a lui-même choisi d’attaquer à son tour." }]
},

{
  id: "elfe_druide", nom: "Elfe (Druide)", cat: "humanoide", nc: 6, ncLabel: "6",
  type: "Humanoïde", taille: "Moyenne", env: ["foret", "souterrain"],
  car: { AGI: [3, 1], CON: [1], FOR: [0], PER: [4, 1], CHA: [1], INT: [1], VOL: [3] },
  def: 18, pv: 70, init: 17,
  att: [{ n: "Arc court", mod: 10, dmg: "1d6+4 Bâton (2 attaques) +10 · DM 1d10+3", portee: 30 }, { n: "Attaque magique", mod: 10 }],
  caps: [{ n: "Sorts de la nature", d: "Le druide peut utiliser chacun des sorts sui- vants 3 fois par jour. NUÉE D’INSECTES (A)* : En réussissant un test d’attaque magique contre la DEF de sa cible (portée 20 m), le druide libère sur celle-ci une nuée d’insectes volants qui piquent, aveuglent et la suivent pendant 7 rounds. La victime subit 1 DM par round et un malus de -2 à tous les tests. Les DM de zone détruisent la nuée. FORME ANIMALE (A)* : Oiseau, serpent, loup (voir le sort de druide). PRISON VÉGÉTALE (L)* : Le druide peut commander à la végétation de pousser et bloquer ses ennemis (mais pas ses alliés) dans une zone de 10 m de diamètre (por- tée 20 m) pendant 4 min. Les cibles sont immobilisées. À son tour, une créature peut tenter de se libérer (action d’attaque) avec un test de FOR difficulté 14. En cas de réussite, elle n’est plus affectée par le sort pour le reste du combat. FLÈCHE VIVANTE (A)* : En une action d’attaque, le druide enchante une flèche et la décoche contre une cible (il doit tenir un arc en main). S’il réussit le test d’attaque à distance, la flèche inflige les DM habituels. Au round suivant, la flèche prend racine dans la plaie et devient un arbuste, infligeant +3d10 DM. Si la victime est réduite à 0 PV par ce sort, un jeune arbuste pousse sur son cadavre. RÉGÉNÉRATION* : Le druide effectue un rituel (durée : 10 min) durant lequel la cible et lui doivent rester au calme. La cible récupère 3d10+4 PV. Ce sort permet aussi de faire repousser les membres ou les parties du corps amputées. Une cible peut bénéficier de ce sort seulement une fois par jour." }]
},

{
  id: "elfe_des_profondeurs", nom: "Elfe Des Profondeurs", cat: "humanoide", nc: 3, ncLabel: "3",
  type: "Humanoïde", taille: "Moyenne", env: ["ruines"],
  desc: "Sheem se tapit contre la paroi, derrière elle. Ses deux compagnons firent de même. Les nains faisaient tellement de raffut qu’il était impossible de les rater. Le pire, c’est que ces imbéciles croyaient se déplacer en silence.",
  car: { AGI: [4, 1], CON: [0], FOR: [0], PER: [2, 1], CHA: [0], INT: [0], VOL: [-2] },
  def: 17, pv: 20, init: 15,
  att: [{ n: "Arbalète légère", mod: 6, dmg: "2d4+2 + poison Épée courte (2 attaques) +6 · DM 1d6+2", portee: 30 }],
  caps: [{ n: "Embuscade", d: "Au premier round de combat, dans un environ- nement permettant à l’elfe de se dissimuler, la cible doit réussir un test de PER difficulté 19 ou être surprise. S’il attaque avec succès une cible surprise, l’elfe lui inflige +2d4 DM." }]
},

{
  id: "elfe_des_profondeurs_2", nom: "Elfe Des Profondeurs", cat: "humanoide", nc: 5, ncLabel: "5",
  type: "Humanoïde", taille: "Moyenne", env: ["ruines"],
  desc: "Sheem se tapit contre la paroi, derrière elle. Ses deux compagnons firent de même. Les nains faisaient tellement de raffut qu’il était impossible de les rater. Le pire, c’est que ces imbéciles croyaient se déplacer en silence.",
  car: { AGI: [4, 1], CON: [1], FOR: [2], PER: [2, 1], CHA: [2], INT: [2], VOL: [2] },
  def: 18, pv: 50, init: 15,
  att: [{ n: "Arbalète légère", mod: 8, dmg: "2d4+4 + poison Épée courte (2 attaques) +8 · DM 1d6+4", portee: 30 }],
  caps: [{ n: "Embuscade", d: "Au premier round de combat, dans un environ- nement permettant à l’elfe de se dissimuler, la cible doit réussir un test de PER difficulté 19 ou être surprise. S’il attaque avec succès une cible surprise, l’elfe lui inflige +2d6 DM." }, { n: "Sergent", d: "Une fois par round, le sergent peut donner une action supplémentaire (A ou M) à n’importe quel allié sous ses ordres à portée de vue. Une fois par combat, une attaque qui aurait dû amener le sergent à 0 PV est ignorée." }, { n: "Capitaine", d: "Le capitaine donne +2 en Init., en attaque et aux DM à toutes les créatures sous ses ordres à portée de vue." }]
},

{
  id: "elfe_des_profondeurs_3", nom: "Elfe Des Profondeurs", cat: "humanoide", nc: 7, ncLabel: "7",
  type: "Humanoïde", taille: "Moyenne", env: ["marais", "arctique", "urbain", "ruines"],
  desc: "Sheem se tapit contre la paroi, derrière elle. Ses deux compagnons firent de même. Les nains faisaient tellement de raffut qu’il était impossible de les rater. Le pire, c’est que ces imbéciles croyaient se déplacer en silence.",
  car: { AGI: [4, 1], CON: [2], FOR: [2], PER: [2, 1], CHA: [4, 1], INT: [3], VOL: [4] },
  def: 20, pv: 70, init: 15,
  att: [{ n: "Masse", mod: 10, dmg: "1d8+5 + poison Attaque magique +10", note: "2 attaques" }],
  caps: [{ n: "Chair à canon", d: "Une fois par round, le prêtre peut décider qu’une attaque qui le visait touche en réalité un de ses sous-fifres derrière lequel il s’est mis à couvert. Il bénéficie de +3 en DEF tant que des sous-fifres sont positionnés à moins de 3 m de lui." }, { n: "Injonction mortelle", a: "L", d: "Une cible située à une distance maximale de 30 m doit réussir un test de CON diffi- culté 15 ou tomber à 0 PV (et mourir immédia- tement s’il s’agit d’un PNJ). En cas de succès, la cible subit tout de même 2d6+7 DM. Ce pou- voir ne peut prendre une même créature pour cible qu’une seule fois par combat." }, { n: "Poison", d: "La masse du prêtre inocule du poison à sa victime à chaque attaque. Elle doit faire un test de CON difficulté 15 ou sombrer dans l’inconscience immédiatement pour une durée de 1d6 rounds. TOILES (L)* : Le prêtre peut projeter une toile gluante pour emprisonner ses ennemis (mais pas ses alliés) dans une zone de 10 m de diamètre (portée 20 m) pendant 4 min. Les cibles sont immobilisées. À son tour, une créature peut essayer de se libérer (action d’attaque) avec un test de FOR difficulté 15. En cas de réussite, la victime n’est plus affectée par le sort pour le reste du combat." }]
},

{
  id: "esprit_guerrier", nom: "Esprit Guerrier", cat: "fantastique", nc: 6, ncLabel: "6",
  type: "Créature fantastique", taille: "Moyenne", env: ["foret", "arctique", "urbain"],
  desc: "Un esprit guerrier est un adversaire redoutable capable de posséder le corps de la plupart des humanoïdes et de le transformer en véritable machine de guerre.",
  car: { AGI: [4, 1], CON: [7], FOR: [7], PER: [1], CHA: [-1], INT: [-1], VOL: [4] },
  def: 20, pv: 70, init: 11,
  att: [{ n: "Armes ou mains nues", mod: 10, dmg: "1d8+7", note: "2 attaques" }],
  caps: [{ n: "Armes improvisées", d: "Même si l’esprit prend possession d’un corps désarmé, ses capacités martiales exception- nelles lui permettent d’infliger des dégâts incroyables avec une pierre ou un morceau de bois ramassé au sol. Même dans ces condi- tions, la créature inflige ses DM habituels." }, { n: "Insensible", d: "L’esprit ignore les pénalités de douleur ou de peur, et peut encore agir un tour complet après avoir atteint 0 PV." }, { n: "Immortel", d: "Si le corps du possédé est détruit, l’esprit guerrier retourne se réfugier dans l’objet qui accueille son âme, souvent un joyau sur une arme ou une armure. Si le joyau est détruit, l’esprit se réfugie dans le joyau le plus proche. Pour mettre fin au processus, il faut lancer le sort Délivrance sur le joyau au moment où l’esprit y trouve refuge." }, { n: "Possession", d: "Une fois par jour, l’esprit peut posséder le corps d’une créature vivante humanoïde de NC ½ ou moins pendant un combat (por- tée 30 m). L’esprit peut faire une tentative par round sur une créature différente. L’esprit tente toujours de posséder la créature de plus bas niveau possible à sa portée. À la fin du combat, si l’esprit a été vaincu, le possédé est mort ; sinon, son corps est disloqué, il est réduit à 1 PV et affaibli pour un mois… Si l’es- prit tente de posséder une créature de niveau (ou NC) 1 ou plus, celle-ci a droit à un test de VOL difficulté 10 pour résister." }, { n: "Projection", d: "Lorsque l’esprit guerrier réussit une attaque avec un résultat de 17-20 au d20, la victime est projetée à 1d4+1 m de là et subit +2d6 DM. Elle est renversée, et si elle échoue à un test de CON difficulté 15, elle est étourdie pour 1 round." }]
},

{
  id: "fantome_mineur", nom: "Fantôme Mineur", cat: "fantastique", nc: 2, ncLabel: "2",
  type: "Créature fantastique", taille: "Moyenne", env: ["arctique"],
  car: { AGI: [1], CON: [1], FOR: [1], PER: [2], CHA: [-2], INT: [0], VOL: [4] },
  def: 14, pv: 15, init: 12,
  att: [{ n: "Contact corrupteur", mod: 4, dmg: "2d6" }],
  caps: [{ n: "Affaiblissement", d: "Chaque fois qu’une créature subit les DM du contact corrupteur du fantôme, elle doit réussir un test de CON difficulté 10 ou être affaiblie pendant 1d6 min." }, { n: "Aspect terrifiant", a: "G", d: "Le fantôme peut prendre instantanément un aspect terrifiant. Toutes les créatures témoins de cette transformation pour la première fois doivent réussir un test de VOL difficulté 10 ou être affaiblie pendant 1 round." }, { n: "Impuissance à la lumière du soleil", d: "Un fantôme perd tous ses pouvoirs à la lumière du soleil et est ralenti. Généralement, il dispa- raît et se réfugie dans le plan éthéré dès que les rayons du soleil le frappent." }, { n: "Intangible", d: "Un fantôme peut passer à travers les murs et les objets comme s’ils n’existaient pas. Il ne peut pas traverser les objets magiques ou orga- niques, ni les créatures. RÉDUCTION DES DM (+0 À +1 NC) : Le fantôme bénéficie d’une RD 5, sauf contre la magie." }, { n: "Résistant au froid", d: "Le fantôme bénéficie d’une RD 5 contre le froid, même magique." }, { n: "Vol", d: "Le fantôme peut se déplacer en vol de 10 m par action de mouvement." }]
},

{
  id: "fantome", nom: "Fantôme", cat: "fantastique", nc: 5, ncLabel: "5",
  type: "Créature fantastique", taille: "Moyenne", env: ["foret", "montagne", "urbain"],
  desc: "Un fantôme est la manifestation physique de l’âme d’une créature qui n’a pas trouvé le repos. Il s’agit généralement d’un humain ou d’une autre espèce pensante humanoïde.",
  car: { AGI: [1, 1], CON: [1], FOR: [1], PER: [2], CHA: [2], INT: [0], VOL: [4] },
  def: 18, pv: 50, init: 12,
  att: [{ n: "Contact corrupteur", mod: 8, dmg: "2d6 + affaiblissement Le fantôme majeur a les mêmes capacités que le fantôme (mais la difficulté du test de l’aspect terrifiant passe à 15 et la RD contre les armes ordinaires passe à 10). De plus il obtient les capacités suivantes", note: "2 attaques" }],
  caps: [{ n: "Hurlement", a: "L", d: "Le fantôme pousse un gémissement ou un hurlement terrifiant. Toutes les créatures vivantes dans un rayon de 10 m doivent réussir un test de VOL (peur) difficulté 10 pour ne pas céder à la panique pendant 2d4 rounds. Les créatures paniquées peuvent, au choix, fuir ou rester prostrées (état étourdi) pendant la durée de l’effet. Les créatures qui réussissent leur test ne sont plus affectées par cette capacité pendant 24 heures." }, { n: "Immortel", d: "La nuit, le fantôme récupère tous ses PV en prenant une récupération rapide (30 min). Lorsqu’il tombe à 0 PV, il n’est pas définitive- ment détruit, mais juste chassé, et il pourra se reconstituer en 24 heures. Il faut mettre un terme à la cause de la malédiction pour réussir à le détruire définitivement." }, { n: "Possession", a: "L", d: "Le fantôme tente de fusionner avec une créature au contact. Il doit pour cela remporter un test opposé d’attaque magique (+10). En cas de succès, le fantôme prend le contrôle du corps de son hôte pendant 1d6 min. Le fantôme n’a droit qu’à une seule tentative par cible et ne peut pas posséder plus d’une victime par combat." }, { n: "Télékinésie", a: "L", d: "Le fantôme peut déplacer les objets par sa force psychique. Il peut soulever une masse allant jusqu’à environ 200 kg ou plusieurs petits objets. S’il projette ces objets sur une cible en réussissant un test d’attaque (+10), il inflige jusqu’à 3d6 DM à une distance maximale de 20 m. FARFADETS ET FÉES entre deux mondes et incapable de communiquer. Sa silhouette trans- Farfadets et fées ne sont que les deux faces parente n’apparaît que lorsqu’elle d’une même pièce, dont l'une nait avec des est éclairée par les rayons de la ailes lui permettant de voler et l'autre pouvant lune. Pire, lorsqu’elle approche se déplacer via la téléportation. Ces créatures des vivants, parlent le sylvestre et plus rarement la langue elle draine des humains. leur énergie Un farfadet est un être féérique de petite vitale (1d4 DM par taille (environ 20 cm pour 1 kg), d’apparence round dans un rayon humaine, avec un grand nez et un grand chapeau. de 3 m, DM tempo - Les farfadets privilégient les costumes verts, les raires). Poc et Roc ne sont larges ceintures et les chaussures vernies à boucle pas affectés. d’argent. Ils vivent cachés dans les forêts, qu’ils protègent sans peur, même devant les créatures les plus malfaisantes, à coups d’humour et de blagues douteuses. Pour repartir d’où ils viennent, les farfadets tentent de réactiver la chronosphère à proximité de Dineth. Pour cela, La fée ne mesure que 10 cm de haut. Son corps il faut placer à l’intérieur de est doté de petites ailes translucides qui émettent l’objet quatre composants de la lumière et une traînée dorée lorsqu’elle symboliques : mort, vie, vole. Les fées utilisent le plus souvent leur ruse jour et nuit. Mais l’artefact est pour attaquer. Pour se défendre, elles attirent abîmé et chaque nouvel essai leurs adversaires dans des pièges, dans l’antre est un échec qui pousse nos far- d’animaux redoutables ou les font tomber du fadets à trouver des composants haut d’une falaise en faisant semblant de se lais- toujours plus fous. ser attraper. Ces deux plaies provoquent Graine d’aventure - Le retour de Poc et Roc donc moult incidents dans les envi- rons et profitent de chaque occa- Poc et Roc sont deux farfadets toujours en compétition pour s’attirer les faveurs de la fée sion pour faire Dineth. Dernièrement, ils ont trouvé un artefact qui sert à voyager dans le temps et la réalité, appelé la chronosphère. La façon dont ils l’ont obtenu n’est pas claire. Tout juste diront-ils « à la suite d’une explosion et de la disparition des guerriers du temps » (voir Invincible). Toujours prêts à tenter les exploits les plus fous pour impressionner leur muse, les deux lascars ont décidé d’emmener leur dulcinée « vers l’infini et au-delà » ! Bien entendu, l’expérience a mal tourné. Tous les trois ont été téléportés dans la région où résident vos PJ, loin de leur époque, et la fée Dineth a été victime d’un « incident ». Elle est désormais intangible, prisonnière une blague douteuse (enlèvement de nouveau-né pour prélever ses larmes, profanation de tombe, etc.). À chaque nouvel essai, la chronosphère crée une déchirure entre les plans et toutes sortes de créatures dangereuses en profitent pour entrer dans ce monde (élémentaire, démon mineur, chien des ténèbres, etc.). Pour faire cesser ce charivari, les PJ doivent comprendre en quoi tous ces événements sont liés. Ils doivent ensuite mettre la main sur les far- fadets qui ne manqueront pas de les convaincre de participer à leur quête d’ingrédients toujours plus dangereux et grandioses pour activer la chronosphère." }]
},

{
  id: "farfadet", nom: "Farfadet", cat: "humanoide", nc: 2, ncLabel: "2",
  type: "Humanoïde", taille: "Très petite", env: ["arctique"],
  car: { AGI: [3, 1], CON: [-3], FOR: [-3], PER: [3, 1], CHA: [2], INT: [2], VOL: [2] },
  def: 19, pv: 15, init: 16,
  att: [{ n: "Dague", mod: 7, dmg: "1 + poison" }],
  caps: [{ n: "Camouflage", d: "Le farfadet reçoit +5 à tous ses tests de discré- tion et en Init." }, { n: "Poison de sommeil", d: "La dague du farfadet ne provoque que 1 DM, mais plonge la cible dans un profond som- meil. Celle-ci doit réussir un test de CON difficulté 10 ou s’endormir immédiatement pour 1d6 min. Le sommeil est si profond qu’il faut infliger au moins 1 DM à la victime pour la réveiller." }, { n: "Téléportation", d: "La créature est capable de se téléporter de 40 m par action de mouvement." }, { n: "Résistance aux dm", d: "Le farfadet bénéficie d’une RD 5 contre toutes les armes qui ne sont pas en fer froid (un alliage spécial forgé à froid et particu- lièrement rare). En revanche, les DM qui lui sont infligés par des armes en fer froid sont doublés." }]
},

{
  id: "fee", nom: "Fée", cat: "humanoide", nc: 0, ncLabel: "0",
  type: "Humanoïde", taille: "Minuscule", env: ["arctique"],
  car: { AGI: [4, 1], CON: [-2], FOR: [-5], PER: [2, 1], CHA: [1, 1], INT: [0], VOL: [4] },
  def: 20, pv: 5, init: 15,
  att: [{ n: "Arc court", mod: 2, dmg: "1d4-1" }],
  caps: [{ n: "Charme personne", a: "L", d: "Une cible humanoïde à une portée de 5 m doit réussir un test de VOL difficulté 15 ou avoir l’envie irrépressible de protéger la fée contre ceux qui lui feraient du mal." }, { n: "Distraction", a: "G", d: "Lorsque la fée danse et fait sa coquette, la créature qui la poursuit ou l’observe subit un dé malus sur tous ses tests de PER." }, { n: "Éternuement", a: "M", d: "La fée volette autour de sa cible, qui doit faire un test de CON difficulté 15 ou être prise d’une crise d’éternuements qui lui inflige l’état préjudiciable étourdi (aucune action et -5 en DEF)." }, { n: "Vol", d: "La créature est capable de voler de 10 m par action de mouvement." }, { n: "Résistance aux dm", d: "La fée bénéficie d'une RD 5 contre toutes les armes qui ne sont pas en fer froid (un alliage spécial forgé à froid et particulièrement rare). En revanche, les DM qui lui sont infligés par des armes en fer froid sont doublés." }]
},

{
  id: "fourmi_de_fer", nom: "Fourmi De Fer", cat: "fantastique", nc: 2, ncLabel: "2",
  type: "Créature fantastique", taille: "Petite", env: ["ruines"],
  desc: "Ces fourmis rouges de la taille d’un mouton possèdent une carapace en métal de couleur rouille. Pour la renforcer, elles ont besoin de se nourrir de métal. Pour cela, elles produisent un acide corrosif qui fait rouiller le fer qu’elles peuvent ensuite dévorer.",
  car: { AGI: [1, 1], CON: [1], FOR: [0], PER: [2], CHA: [-2], INT: [-4], VOL: [0] },
  def: 17, pv: 20, init: 12,
  att: [{ n: "Morsure", mod: 4, dmg: "1d6 + 1d6 acide" }, { n: "Crachat acide", mod: 6, dmg: "corrosion" }],
  caps: [{ n: "Corrosion", d: "Lorsque la fourmi de fer réussit une attaque de crachat, un objet métallique porté par la cible rouille immédiatement et tombe en morceaux. La fourmi cesse alors le combat pour dévorer ce mets de choix en 1d4 rounds. L’objet affecté est généralement le plus volumineux à portée (arme, armure). Si un objet magique est ciblé, le joueur doit lancer un d6-1 : si le résultat est inférieur ou égal au niveau de magie de l’objet, il résiste à l’oxydation. TOUT-TERRAIN : La fourmi de fer est capable de se déplacer sur des surfaces verticales. Sur des surfaces horizontales, elle se déplace de 15 m par action de mouvement et de 10 m sur des surfaces verticales." }]
},

{
  id: "fourmi_de_cristal", nom: "Fourmi De Cristal", cat: "fantastique", nc: 3, ncLabel: "3",
  type: "Créature fantastique", taille: "Moyenne", env: ["foret", "plaine"],
  car: { AGI: [1, 1], CON: [1], FOR: [5], PER: [2], CHA: [-2], INT: [-3], VOL: [2] },
  def: 17, pv: 30, init: 12,
  att: [{ n: "Morsure", mod: 6, dmg: "1d10+5 + drain" }],
  caps: [{ n: "Drain de mana", d: "À chaque fois que la fourmi réussit une attaque de morsure, elle fait perdre 1d4 PM à la cible (si elle en possède). DRAIN D’OBJET MAGIQUE : Lorsque la fourmi de cristal réussit une attaque avec un résultat de 15-20 au d20, elle draine la magie d’un objet que le personnage porte. Vous pouvez déter- miner cet objet au hasard, mais il s’agit généralement du plus simple à atteindre (arme, armure, vêtement). L’objet perd immédiatement tous ses pouvoirs. 30 min plus tard, le joueur doit lancer un d6 : sur un résultat de 1, la perte est définitive ; sinon l’objet retrouve toutes ses fonctions." }]
},

{
  id: "freux_sanglant", nom: "Freux Sanglant", cat: "fantastique", nc: 0, ncLabel: "0",
  type: "Créature fantastique", taille: "Très petite", env: ["urbain", "ruines"],
  desc: "Les freux sanglants sont une des plaies les plus communes des terres sauvages. Ce sont de gros corbeaux très agressifs qui attaquent en groupe.",
  car: { AGI: [2, 1], CON: [-2], FOR: [-3], PER: [2, 1], CHA: [-3], INT: [-4], VOL: [-2] },
  def: 12, pv: 2, init: 15,
  att: [{ n: "Bec et serres", mod: 3, dmg: "1d3" }],
  caps: [{ n: "Aveugler", d: "Lorsque le freux réussit une attaque avec un résultat de 15-20 au d20, le volatile attaque aux yeux. La victime doit réussir un test d’AGI difficulté 10 ou être aveuglée pour le reste du combat. Si vous utilisez l’attaque groupée, n’oubliez pas de retrancher le nombre de créatures à cette valeur." }, { n: "Attaque groupée", d: "Jusqu’à 12 freux peuvent attaquer une même cible au sol." }]
},

{
  id: "gardien_des_galgals", nom: "Gardien Des Galgals", cat: "fantastique", nc: 4, ncLabel: "4",
  type: "Créature fantastique", taille: "Moyenne", env: ["marais", "urbain"],
  desc: "De loin, le gardien des galgals ressemble à un guerrier quelconque enveloppé dans un grand manteau déchiré.",
  car: { AGI: [2], CON: [2], FOR: [3], PER: [1], CHA: [-2], INT: [0], VOL: [4] },
  def: 17, pv: 35, init: 11,
  att: [{ n: "Épée longue", mod: 8, dmg: "1d8+4", note: "2 attaques" }],
  caps: [{ n: "Drain", d: "Chaque fois que le gardien inflige des DM avec son épée dont la lame est parcourue d’énergie de la non-vie, il draine la vitalité de sa victime : celle-ci subit +1d6 DM qui s’ajoutent aux PV du gardien (sans dépasser son maximum de PV). DÉVORER LE CŒUR (L) : L’avant-bras du gardien des galgals devient intangible ; il plonge sa main dans la poitrine d’une victime réduite à 0 PV pour en retirer le cœur encore battant. Il en aspire l’énergie vitale et récupère 1d6 PV par niveau (ou NC) de la victime tandis que le cœur se racornit et que la victime trépasse. Un PJ qui n’a pas encore agi peut s’inter- poser et l’en empêcher en réus- sissant un test de FOR difficulté 13 (action d’attaque). Une victime dont le cœur a été dévoré se relève 1d4 rounds plus tard sous la forme d’un zombie qui attaque toutes les créatures vivantes jusqu’à ce qu’il soit détruit." }, { n: "Déteste la lumière du jour", d: "Sous la lumière du soleil, le gardien subit un dé malus à toutes ses actions. PASSE-MURAILLE (M) : Le gardien des galgals peut se rendre intangible pour passer à travers les murs jusqu’à 2 m d’épaisseur ou sans limite d’épais- seur s’il s’agit du tertre dans lequel il a été inhumé." }]
},

{
  id: "gargouille", nom: "Gargouille", cat: "fantastique", nc: 4, ncLabel: "4",
  type: "Créature fantastique", taille: "Moyenne", env: ["ruines"],
  desc: "La gargouille est un monstre de pierre semblable à un démon ailé. Immobile, elle ressemble à s’y méprendre à une statue sur une façade.",
  car: { AGI: [0], CON: [3, 1], FOR: [3, 1], PER: [2], CHA: [-2], INT: [0], VOL: [0] },
  def: 18, pv: 35, init: 12,
  att: [{ n: "Morsure et griffes", mod: 7, dmg: "1d6+3", note: "2 attaques" }],
  caps: [{ n: "Embuscade", d: "Au premier round de combat, dans un envi- ronnement permettant à la gargouille de se dissimuler, la cible doit réussir un test de PER difficulté 15 ou être surprise. Si elle attaque avec succès une cible surprise, la gargouille lui inflige +2d4 DM. La gargouille bénéficie de +5 à tous ses tests de discrétion." }, { n: "Vol", d: "La gargouille peut se déplacer en vol de 10 m par action de mouvement." }, { n: "Immobilité", d: "Tant que la gargouille ne bouge pas, il faut réussir un test de PER difficulté 20 pour la différencier d’une statue." }, { n: "Peau de pierre", d: "La gargouille bénéficie d’une RD 5 sauf contre les armes contondantes. GÉANT Les géants sont des humanoïdes immenses dont les caractéristiques varient selon les espèces. Il en existe de nombreuses sous-espèces. Graine d’aventure - Le tambour de guerre Le tambour de guerre est un objet magique qui fut créé par un puissant sorcier pour attirer et soumettre les géants afin de constituer une armée maléfique. L’objet émet des vibrations à très longue portée (plus de 50 km). Elles traversent la roche et seuls les géants peuvent les percevoir. Cela les rend fous de rage et ils se précipitent dans la direction du tambour pour tout détruire. Graax Havrefer est un nain dont le clan fut trahi par les humains lors de la bataille de la passe des Géants, il y a plus d’un siècle. Les renforts pro- mis n’arrivèrent jamais et tous les siens furent massacrés. Orphelin sans clan, Graax est devenu forgeron itinérant et a appris à cacher sa rancœur. Un jour, en fouillant les décombres de la for- teresse où, chaque année, il cherchait encore et encore les corps des siens pour leur donner une sépulture digne, il a retrouvé le tambour. Depuis, dans chaque village où il passe, le forgeron se cache dans les anciennes carrières ou les mines et il joue un terrible requiem." }]
},

{
  id: "geant_des_collines", nom: "Géant Des Collines", cat: "humanoide", nc: 5, ncLabel: "5",
  type: "Humanoïde", taille: "Énorme", env: ["montagne"],
  car: { AGI: [0], CON: [7], FOR: [8, 1], PER: [0], CHA: [-2], INT: [-2], VOL: [-2] },
  def: 22, pv: 85, init: 10,
  att: [{ n: "Massue", mod: 10, dmg: "2d8+10 Lancer de rocher (20 m) +10 · DM 1d8+8" }],
  caps: [{ n: "Colosse", d: "La créature bénéficie d’une RD 3." }, { n: "Fauchage", d: "Lorsque le géant réussit une attaque avec un résultat de 15-20 au d20, la victime doit réussir un test de FOR ou d’AGI (au choix) difficulté 18 ou être renversée." }]
},

{
  id: "geant_des_montagnes", nom: "Géant Des Montagnes", cat: "humanoide", nc: 8, ncLabel: "8",
  type: "Humanoïde", taille: "Énorme", env: ["montagne"],
  car: { AGI: [-1], CON: [10], FOR: [10, 1], PER: [0], CHA: [0], INT: [0], VOL: [2] },
  def: 24, pv: 140, init: 10,
  att: [{ n: "Masse en pierre", mod: 13, dmg: "2d12+16 Lancer de rocher (20 m) +13 · DM 1d12+12" }],
  caps: [{ n: "Colosse", d: "La créature bénéficie d’une RD 6." }, { n: "Fauchage", d: "Voir géant des collines, la difficulté passe à 20." }, { n: "Balayage", d: "Le géant peut viser deux créatures à son contact d’un seul coup de masse. Il ne fait qu’un seul test d’attaque pour les deux cibles. Si les deux sont touchées, la cible secondaire (désignée par le MJ) ne subit que la moitié des DM." }, { n: "Tremblement de terre", a: "M", d: "Une fois par combat, le géant de pierre peut taper du pied et provoquer une onde de choc. Toutes les créatures dans un rayon de 10 m de taille grande ou inférieure doivent réussir un test d’AGI difficulté 15 ou être renversées." }]
},

{
  id: "geant_des_glaces", nom: "Géant Des Glaces", cat: "humanoide", nc: 9, ncLabel: "9",
  type: "Humanoïde", taille: "Énorme", env: ["montagne", "arctique"],
  car: { AGI: [-1], CON: [12], FOR: [12, 1], PER: [2], CHA: [0], INT: [0], VOL: [0] },
  def: 25, pv: 160, init: 12,
  att: [{ n: "Hache de guerre", mod: 14, dmg: "4d8+16 Lancer de rocher (20m) +14 · DM 2d8+12" }],
  caps: [{ n: "Colosse", d: "La créature bénéficie d’une RD 6." }, { n: "Fauchage", d: "Comme le géant des collines, la difficulté passe à 22." }, { n: "Balayage", d: "Comme le géant des montagnes." }, { n: "Immunisé au froid", d: "Le géant des glaces est immunisé aux DM de froid." }]
},

{
  id: "geant_des_nuees", nom: "Géant Des Nuées", cat: "humanoide", nc: 13, ncLabel: "13",
  type: "Humanoïde", taille: "Énorme", env: ["urbain"],
  car: { AGI: [0], CON: [14], FOR: [14, 1], PER: [2], CHA: [0], INT: [0], VOL: [4] },
  def: 29, pv: 220, init: 12,
  att: [{ n: "Épée", mod: 16, dmg: "4d10+22 Lancer de rocher (30 m) +16 · DM 2d10+16" }],
  caps: [{ n: "Colosse", d: "La créature bénéficie d’une RD 6." }, { n: "Foudre", a: "L", d: "Le géant peut invoquer la foudre, qui frappe automatiquement (pas de test d’attaque) une cible (6d6+27 DM, portée 50 m). Les DM sont divisés par deux si la victime réussit un test d’AGI difficulté 15. IMMUNISÉ À L’ÉLECTRICITÉ : Le géant des nuées est immunisé aux DM de foudre." }, { n: "Marche des airs", d: "Le géant des nuées peut se déplacer en l’air comme s’il marchait au sol. Il peut s’élever de cette façon de 5 m par action de mouvement." }, { n: "Projection", d: "Lorsque le géant réussit une attaque avec un résultat de 15-20 au d20, la victime est proje- tée à 1d6+1 m de là et subit +2d10 DM. Elle est renversée, et si elle échoue à un test de CON difficulté 15, elle est étourdie pour 1 round." }]
},

{
  id: "geant_bicephale", nom: "Géant Bicéphale", cat: "fantastique", nc: 6, ncLabel: "6",
  type: "Créature fantastique", taille: "Énorme", env: ["arctique"],
  desc: "« Passe-moi la cuisse, Hilda ! — Non, tu as déjà mangé l’autre, Gorad. C’est toujours toi qui manges les cuisses ! — Tu as eu la cervelle, et la cervelle, c’est le meilleur ! On avait dit : celui qui mange la cervelle, il a pas de cuisse !",
  car: { AGI: [0], CON: [8], FOR: [8, 1], PER: [-2], CHA: [-2], INT: [-2], VOL: [0] },
  def: 21, pv: 90, init: 8,
  att: [{ n: "Tronc", mod: 14, dmg: "1d10+8", note: "2 attaques" }],
  caps: [{ n: "Fauchage", d: "— J’ai jamais dit ça ! Rends-moi cette cuisse ! Aïe, tu m’as mordue ! » Dans son coin, Melienith tentait frénétique- ment de couper ses liens sur une pierre pas assez coupante. Dès que le géant à deux têtes aurait fini de dévorer son défunt compagnon d’armes, ce serait son tour… Le géant à deux têtes mesure presque 3 m de haut. Très primitif, il est généralement vêtu de peaux de bêtes puantes et armé de deux troncs, chaque tête commandant un bras. Les deux têtes sont aussi stupides l’une que l’autre, et il n’est pas rare de les voir se chamailler pour prendre une décision ou déterminer qui pourra gober la cervelle de cet aventurier croustillant… Le genre de chaque tête n’est pas toujours homogène, et lorsque les deux têtes ne sont pas du même genre, les disputes sont encore plus fréquentes. Écologie Lorsque le géant réussit une attaque avec un résultat de 17-20 au d20, la victime doit réussir un test de FOR ou d’AGI (au choix) difficulté 16 ou être renversée." }, { n: "Colosse", d: "Le géant bénéficie d’une RD 3." }, { n: "Dispute", d: "Si le géant obtient 1 ou 2 au d20 d’un test, les deux têtes viennent de trouver un prétexte de dispute et il perd sa prochaine attaque !" }, { n: "Doublement bête", d: "Le géant bicéphale a un dé bonus à tous ses tests pour résister aux charmes, illusions ou tentatives de persuasion. N’hésitez pas à improviser un dia- logue sans queue ni tête entre les deux têtes pour justifier la réussite d’un test ! Les géants bicéphales ne sont pas difficiles : ils mangent tout ce qu’ils trouvent, charognes, détritus ou l’éventuel humain de passage. Ces créatures sont hermaphrodites, ou plutôt, ce sont deux personnes en une. Une ou deux fois dans la vie d’un géant bicéphale, les deux têtes sont prises d’une brusque passion l’une pour l’autre. Personne n’a vraiment compris comment cela arrive, mais quelque temps plus tard, le géant peut alors donner naissance à un jeune qu’il élèvera pendant une dizaine d’années. GÉNIE Les génies ressemblent à des humains de très grande taille. Ils ont une musculature harmo- nieuse et une peau parfaite d’une couleur assor- tie à leur élément. Ils sont généralement habillés de tissus précieux à la mode orientale et portent des turbans extravagants. Les génies sont des créatures issues des contes des mille et une nuits. Ce sont de puissants esprits venus des plans élémentaires dont ils forment l’aristocratie. Il existe des génies pour chaque plan élémentaire : feu (peau rouge), air (peau bleue, aussi associé à la foudre), eau (peau verte, aussi associé à l’acide) et terre (peau violette, aussi associé au froid). Comme pour les élémentaires, nous ne vous présentons ici qu’un seul profil qui est valable pour les quatre types de génie. Lampe magique De puissants magiciens ont réussi à créer des objets qui emprisonnent un génie et l’obligent à rendre trois services à celui qui fait appel à lui. Le plus connu de ces objets est la lampe magique, mais l’objet est en rapport avec le génie qu’elle contient. Ainsi, un génie du feu sera enfermé dans une lampe, tandis qu’un génie de l’eau le sera dans une flasque, un génie de la terre dans une statuette et un génie de l’air probablement dans un instrument à vent. Dans tous les cas, il faut frotter l’objet pour faire apparaître le génie et, parfois, le nommer. S’il s’agit d’un génie mineur, il peut com- battre 3 fois pour le porteur de l’objet, s’il s’agit d’un génie majeur, il peut accorder jusqu’à 3 sou- haits, mais il ne combat pas. Toutes les lampes ont un niveau de magie égal à 4. Lorsque les trois services ont été remplis, lancez un d6. Sur un résultat de 2 à 6, l’objet disparaît pour réapparaître n’importe où dans le monde de façon totalement aléatoire. Il res- tera inerte jusqu’à ce que quelqu’un le trouve par hasard. Sur un résultat de 1, l’objet libère le génie. Furieux de ce long emprisonnement, le génie attaque le porteur de l’objet, car seule la mort de celui-ci lui permettra de regagner son propre plan d’existence." }]
},

{
  id: "genie_mineur", nom: "Génie Mineur", cat: "fantastique", nc: 7, ncLabel: "7",
  type: "Créature fantastique", taille: "Grande", env: ["urbain"],
  car: { AGI: [2, 1], CON: [6], FOR: [6], PER: [2], CHA: [2, 1], INT: [2, 1], VOL: [4] },
  def: 22, pv: 110, init: 12,
  att: [{ n: "Cimeterre", mod: 12, dmg: "1d10+7 + 1d6 élémentaire", note: "2 attaques" }],
  caps: [{ n: "Aura élémentaire", a: "G", d: "Le génie peut faire surgir une aura élémentaire autour de son corps à volonté. Une créature qui l’attaque au contact subit 1d6 DM pour chaque attaque réussie. Lorsqu’il est au contact d’une source élémentaire importante, le génie régénère 4 PV par round." }, { n: "Immunités", d: "Tous les génies sont immunisés à leur élé- ment et divisent par deux les DM des autres éléments." }, { n: "Capacités communes", d: "Tous les génies savent voler (vitesse de dépla- cement normale) et aucun d’eux n’a besoin de respirer. Ils savent parler la langue de leur élément et le commun." }]
},

{
  id: "genie_majeur", nom: "Génie Majeur", cat: "fantastique", nc: 14, ncLabel: "14",
  type: "Créature fantastique", taille: "Énorme", env: ["marais", "urbain"],
  car: { AGI: [2, 1], CON: [10], FOR: [10], PER: [2], CHA: [4, 1], INT: [4, 1], VOL: [6] },
  def: 29, pv: 240, init: 12,
  att: [{ n: "Cimeterre", mod: 17, dmg: "2d10+13", note: "2 attaques" }],
  caps: [{ n: "Aura élémentaire", a: "G", d: "Le génie peut faire surgir une aura élémentaire autour de son corps à volonté. Une créature qui l’attaque au contact subit 1d10 DM pour chaque attaque réussie. Lorsqu’il est au contact d’une source élémentaire importante, le génie régénère 7 PV par round." }, { n: "Immunités et capacités communes", d: "Voir ci-dessus. Les génies majeurs volent à la vitesse de 15 m par action de mouvement. SOUHAIT (L)* : Le génie modifie le monde par la force des mots et émet un vœu qui est exaucé. Une fois par jour, il peut dupliquer les effets de n’im- porte quelle capacité de n’importe quelle voie jusqu’au rang 5. Une fois par aventure, il peut émettre un souhait qui dépasse ce cadre et dont les limites sont fixées par le seul bon vouloir du MJ. Toutefois, le MJ inventera des effets collatéraux préjudiciables qui feront de l’utilisation du souhait un moment de tension et de danger… Par exemple, si un personnage souhaite devenir « extrêmement fort », le MJ peut lui octroyer +4 en FOR, mais lui infliger -4 en AGI. Les effets du sort sont générale- ment valables jusqu’à la fin de l’aventure en cours." }, { n: "Taille variable", a: "G", d: "Un génie majeur peut prendre la taille de son choix, de très petit à énorme (en passant par moyen ou grand). Chaque fois qu’il réduit sa taille d’une catégorie, il réduit sa valeur d’at- taque et ses DM de 5 (-10 en taille moyenne, -20 en taille très petite). GOLEM Les golems sont des créatures artificielles fabri- quées à partir d’ingrédients étranges ou précieux et animés par magie. Le golem attaché au service d’un forgesort est une version différente de ce type de créature, utilisée comme garde du corps. Les golems décrits ici correspondent à des gar- diens infatigables auxquels on confie la mission de garder un trésor ou un passage pour l’éternité. Un golem ne peut quitter le lieu dont on lui a assigné la garde. Généralement, un mot de passe prononcé à voix haute ou un symbole brandi devant soi permet aux personnes sélectionnées d’accéder au lieu protégé en toute sécurité. Les golems sont des créatures non vivantes dépourvues d’esprit, ce qui les immunise à toute magie qui affecte la volonté ou les émotions. Créer un golem Pour créer un golem, il faut le temps et l’argent indiqués dans la table ci-après et disposer d’un laboratoire bien équipé (d’une valeur d’en- viron 5 000 pa). L’argent correspond au coût des composants et du matériel nécessaire à la création du golem. Le MJ peut aussi fixer des composants extraordinaires qui peuvent être le sujet d’une quête s’il le souhaite. À la fin du temps requis, le personnage, obligatoirement un lanceur de sorts, doit dépenser les PM indiqués en une seule fois, ce qui signifie qu’un PJ ne peut créer un golem qui requiert plus de PM qu’il n’en a. Enfin, il doit réussir un test d’attaque magique d’une dif- ficulté égale à [15+NC du golem]. En cas d’échec, le golem se brise en morceaux en essayant de s’animer et tous les composants sont perdus. Le golem de chair est présenté dans le livre des règles de Chroniques Oubliées Fantasy (p. 284). Pour sa fabrication, il nécessite des morceaux de cadavre et doit être animé par une décharge électrique d’une immense intensité, générale- ment obtenue grâce à un dispositif destiné à capter la foudre." }]
},

{
  id: "golem_de_glace", nom: "Golem De Glace", cat: "fantastique", nc: 4, ncLabel: "4",
  type: "Créature fantastique", taille: "Moyenne", env: ["foret", "arctique"],
  car: { AGI: [-1], CON: [5, 1], FOR: [4], PER: [0], CHA: [-3], INT: [-4], VOL: [6] },
  def: 20, pv: 60, init: 10,
  att: [{ n: "Lames de glace", mod: 10, dmg: "1d8+4", note: "2 attaques" }],
  caps: [{ n: "Lent", d: "Le golem de glace se déplace de 5 m par action de mouvement." }, { n: "Immunités", d: "Le golem est immunisé à toutes les magies, à l’exception des sorts de feu qui lui occa- sionnent des dommages doublés. Les sorts de froid le guérissent d’un nombre équivalent aux DM infligés normalement. Golem PM Difficulté Argent Temps Glace ou bois 14 19 2 000 pa 3 semaines Chair 18 21 5 000 pa 6 semaines Argile 21 23 8 000 pa 10 semaines Pierre 24 25 12 000 pa 16 semaines Métal 27 27 16 000 pa 24 semaines" }, { n: "Explosion finale", d: "Lorsqu’il est détruit, le golem explose en une pluie d’éclats pointus, occasionnant 4d6 DM perforants (test d’AGI difficulté 10 pour diviser les DM par 2) à toutes les créatures présentes dans un rayon de 3 m." }]
},

{
  id: "golem_d_argile", nom: "Golem D’argile", cat: "fantastique", nc: 8, ncLabel: "8",
  type: "Créature fantastique", taille: "Grande", env: ["arctique", "urbain"],
  car: { AGI: [1], CON: [7, 1], FOR: [7], PER: [0], CHA: [-4], INT: [-4], VOL: [6] },
  def: 22, pv: 110, init: 10,
  att: [{ n: "Poings", mod: 12, dmg: "1d10+7", note: "2 attaques" }],
  caps: [{ n: "Blessures maudites", d: "Une terrible malédiction empêche les blessures infligées par le golem de guérir cor- rectement. Elles suppurent et se déforment comme de la glaise mouillée. Ses attaques infligent des · DM que vous devez compta- biliser à part, car les effets des sorts et des capacités de guérison sont divisés par deux. De plus, le golem triple les · DM en cas de coup critique au lieu de les doubler." }, { n: "Tape dur", d: "Si la créature obtient 17-20 au dé du test d’attaque, l’attaque est automatiquement réussie. De surcroît, la victime doit réussir un test de CON difficulté 17 ou être étourdie pendant 1 round." }, { n: "Frénésie", d: "Lorsqu’il reçoit un coup critique, le golem devient frénétique pour le reste du combat. Il obtient une attaque supplémentaire par round et peut encore agir un tour complet après avoir atteint 0VPV." }, { n: "Résistance", d: "Le golem divise par 2 tous les DM élémen- taires (feu, froid, électricité) ainsi que les DM contondants. Il est immunisé au poison. ABSORBER L’ACIDE : Non seulement le golem de glaise est immunisé à l’acide, mais en plus les DM de ce type lui permettent de guérir de ses blessures. Il régénère 1(V)PV pour 3 DM d’acide qui lui sont infligés." }]
},

{
  id: "golem_de_pierre", nom: "Golem De Pierre", cat: "fantastique", nc: 10, ncLabel: "10",
  type: "Créature fantastique", taille: "Grande", env: ["arctique", "urbain"],
  car: { AGI: [0], CON: [8, 1], FOR: [8], PER: [0], CHA: [-4], INT: [-4], VOL: [6] },
  def: 25, pv: 140, init: 10,
  att: [{ n: "Poings", mod: 14, dmg: "2d8+8", note: "2 attaques" }],
  caps: [{ n: "Fauchage", d: "Si le golem réussit une attaque avec un résultat de 17-20 au d20, la victime doit réussir un test de FOR ou d’AGI (au choix) difficulté 18 ou être renversée." }, { n: "Gravité", d: "La gravité augmente considérablement dans un rayon de 6 m autour du golem de pierre. Toutes les créatures dans cette zone doivent faire un test de CON difficulté 10 ou être ralenties. Les créatures en vol doivent atteindre une difficulté de 15 ou chuter et subir 2d4° DM par tranche de 3 m de chute. Il est presque impossible de sauter en l’air dans la zone d’influence d’un golem de pierre (tests de FOR difficulté +10 par rapport aux tests habituels d’AGI)." }, { n: "Résistance", d: "Le golem divise par 2 tous les DM élémentaires (feu, froid, électricité, acide) et bénéficie d’une RD 3 contre les armes." }]
},

{
  id: "golem_de_metal", nom: "Golem De Métal", cat: "fantastique", nc: 12, ncLabel: "12",
  type: "Créature fantastique", taille: "Énorme", env: ["arctique", "urbain"],
  car: { AGI: [0], CON: [10, 1], FOR: [10], PER: [0], CHA: [-4], INT: [-4], VOL: [6] },
  def: 26, pv: 180, init: 10,
  att: [{ n: "Arme", mod: 16, dmg: "2d8+10", note: "2 attaques" }],
  caps: [{ n: "Tape dur", d: "Si la créature obtient 17-20 au dé du test d’attaque, l’attaque est automatiquement réussie. De surcroît, la victime doit réussir un test de CON difficulté 20 ou être étourdie pendant 1 round." }, { n: "Résistance", d: "Le golem divise par 2 tous les DM élémentaires (feu, froid, électricité, acide) et bénéficie d’une RD 6 contre les armes." }, { n: "Magnétique", d: "À chaque fois qu’un adversaire lui porte une attaque réussie avec une arme en métal, il doit réussir un test de FOR difficulté 15 ou elle reste bloquée sur le golem. Chaque nouvelle tentative demande une action de mouvement (test de FOR difficulté 15 pour débloquer l’arme). Les tests d’attaque à distance des armes métalliques bénéficient en revanche de +5 en attaque." }]
},

{
  id: "gorille_sicarius", nom: "Gorille Sicarius", cat: "fantastique", nc: 7, ncLabel: "7",
  type: "Créature fantastique", taille: "Moyenne", env: ["foret", "marais", "souterrain"],
  desc: "Le gorille sicarius est un animal fantastique, cousin des gorilles dont il partage l’apparence à quelques exceptions importantes : il possède trois paires de bras, des défenses recourbées, une fourrure argentée et un tempérament plus colérique.",
  car: { AGI: [3, 1], CON: [7, 1], FOR: [7, 1], PER: [2], CHA: [-2], INT: [-2], VOL: [2] },
  def: 21, pv: 90, init: 12,
  att: [{ n: "Poings et morsure", mod: 12, dmg: "1d8+7", note: "3 attaques" }],
  caps: [{ n: "Charge", a: "L", d: "Le gorille sicarius parcourt une distance maximale de 20 m et réalise une attaque avec un dé bonus. Si l’attaque est réussie, en plus des DM normaux, une victime de taille grande ou inférieure doit faire un test de FOR difficulté 17 ou être renversée. Dans ce cas, le gorille roue de coups sa victime et les DM sont doublés." }, { n: "Morsure", d: "Lors d’un test d’attaque, le gorille réussit automatique- ment s’il obtient un résultat de 18-20 au d20. Il saisit alors sa cible entre ses bras puissants et lui inflige +1d8+7 DM en la mordant. Une seule fois par round." }, { n: "Enragé", d: "Lorsqu’il reçoit un coup critique, le gorille devient enragé. Il ignore les pénalités de douleur ou la peur, et bénéficie de +3 en attaque au contact et +1d8 DM. Il peut encore agir un tour complet après avoir atteint 0 PV." }, { n: "Passage par les arbres", d: "Le gorille sicarius se déplace aussi vite dans les arbres qu’au sol." }]
},

{
  id: "grenouillard", nom: "Grenouillard", cat: "humanoide", nc: 1, ncLabel: "1",
  type: "Humanoïde", taille: "Moyenne", env: ["marais"],
  desc: "Les grenouillards sont une espèce de batraciens humanoïdes primitifs. Ils vivent dans les marais au bord des lacs isolés ou sur les rivages de lacs souterrains. Ils voient parfaitement dans le noir et parlent l’aquarien.",
  car: { AGI: [2, 1], CON: [0], FOR: [0], PER: [1, 1], CHA: [-2], INT: [-2], VOL: [-2] },
  def: 15, pv: 9, init: 14,
  att: [{ n: "Trident", mod: 3, dmg: "1d8 Immunisé aux DM d’acide" }],
  caps: [{ n: "Adaptation aquatique", d: "Le grenouillard peut rester jusqu’à 10 min sous l’eau sans respirer et n’est pas pénalisé lorsqu’il combat dans l’eau." }, { n: "Attaque bondissante", a: "L", d: "Le grenouillard peut faire un bond formidable de 10 m de long (5 m de hauteur sous plafond requis), bénéficiant alors de +2 en attaque et +1d6 DM. Ce fai- sant, il peut passer par-des- sus un adversaire pour en prendre un autre pour cible." }]
},

{
  id: "guerrier_maudit", nom: "Guerrier Maudit", cat: "fantastique", nc: 2, ncLabel: "2",
  type: "Créature fantastique", taille: "Moyenne", env: ["montagne"],
  desc: "Ces guerriers à la silhouette svelte vêtus d’une armure de bronze ouvragée font penser à une patrouille d’elfes. Ils marchent au pas cadencé puis, dégainant des glaives dorés, chargent en adoptant une formation toute militaire.",
  car: { AGI: [2], CON: [1], FOR: [1], PER: [-1, 1], CHA: [-4], INT: [-4], VOL: [8] },
  def: 17, pv: 22, init: 12,
  att: [{ n: "Attaque", mod: 6, dmg: "1d6+1", note: "2 attaques" }],
  caps: [{ n: "Sans esprit", d: "Aucune âme n’habite la carcasse, le squelette est immunisé à tous les sorts qui affectent l’esprit." }, { n: "Réduction des dm", d: "Tous les DM infligés à un guerrier maudit par des armes sont divisés par deux, sauf ceux des armes contondantes. N’ABANDONNE JAMAIS : Lorsqu’il est réduit à 0 PV, un guerrier maudit continue à combattre tant qu’un adversaire n’utilise pas une action limitée pour le réduire en miettes. Lorsqu’il est à 0 PV, le guerrier maudit attaque avec un dé malus et est ralenti (une seule action par tour)." }]
},

{
  id: "harpie", nom: "Harpie", cat: "fantastique", nc: 3, ncLabel: "3",
  type: "Créature fantastique", taille: "Moyenne", env: ["ruines"],
  desc: "La harpie possède un buste de femme dont les bras auraient été remplacés par des ailes, et ses jambes se terminent par de terribles serres d’oiseau de proie.",
  car: { AGI: [3], CON: [1], FOR: [1], PER: [0, 1], CHA: [4], INT: [0], VOL: [0] },
  def: 16, pv: 29, init: 13,
  att: [{ n: "Serres", mod: 6, dmg: "1d6+2", note: "2 attaques" }],
  caps: [{ n: "Vol rapide", d: "La harpie obtient une action de mouvement supplémentaire par round lorsqu’elle est en vol. Au premier round de combat, si elle est en vol et attaque une créature au sol, la harpie bénéficie d’un dé bonus en attaque et de +1d4 DM." }, { n: "Chant captivant", a: "L", d: "En chantant, une harpie peut fasciner une créature. Toutes les créatures humanoïdes dans un rayon de 30 m (sauf les harpies) doivent réussir un test de VOL difficulté 10 ou succomber à la magie. Le chant affecte l’esprit, aussi se boucher les oreilles apporte un dé bonus au test de VOL, mais n’immunise pas au pouvoir (se boucher les oreilles avec les mains remplace une action d’attaque à chaque round). Une créature fascinée s’approche de la harpie et reste sans défense tant qu’elle chante, et pendant encore 1 round complet après la fin du chant. Une créature qui résiste au chant des harpies y est immunisée pour tout le combat." }, { n: "Chant choral", a: "L", d: "Lorsqu’elles sont en nombre, les harpies peuvent s’associer pour produire un chant plus puissant. Plutôt que de faire plusieurs tests de résistance, les cibles potentielles font un seul test de VOL dont la difficulté est égale à [10 + nombre de harpies] (maximum 15). Une créature fascinée s’approche de la harpie la plus proche d’elle. Les créatures restent fascinées tant qu’au moins une harpie chante, à l’exception de celle qui commence à se faire dévorer, qui bénéficie à chaque round d’un nouveau test de VOL difficulté 10 pour se libérer de l’emprise." }]
},

{
  id: "hippogriffe", nom: "Hippogriffe", cat: "fantastique", nc: 3, ncLabel: "3",
  type: "Créature fantastique", taille: "Grande", env: ["urbain"],
  desc: "L’hippogriffe est le croisement entre un cheval et un aigle, dont il conserve la tête, les serres et les ailes.",
  car: { AGI: [1], CON: [6], FOR: [6], PER: [2, 1], CHA: [-2], INT: [-4], VOL: [0] },
  def: 16, pv: 30, init: 15,
  att: [{ n: "Serres et bec", mod: 6, dmg: "2d6+6" }],
  caps: [{ n: "Vol rapide", d: "L’hippogriffe obtient une action de mouve- ment supplémentaire par round lorsqu’il est en vol. Au premier round de combat, s’il est en vol et attaque une créature au sol, il béné- ficie d’un dé bonus en attaque et de +1d4 DM." }, { n: "Agripper", d: "Lorsque l’hip- pogriffe réussit une attaque avec un résultat de 15-20 au d20, il agrippe sa proie et ne la lâche plus. Il obtient +5 en attaque et +1d4 DM contre elle. La cible est immobilisée si elle est de taille inférieure ; une fois par round, elle peut essayer de se libérer au prix d’une action de mouvement en réussissant un test de FOR difficulté 16. VOIE DE PRESTIGE DU MONTEUR D’HIPPOGRIFFES Cette voie est ouverte à toutes les familles de profils, et peut aussi être déclinée pour le griffon (voir Livre des règles, p. 287). 4. Jeune hippogriffe : le personnage obtient un jeune hippogriffe. Celui-ci possède seu- lement 20 PV, DEF [12 + rang dans la voie], et inflige 1d6+4 DM. Il ne peut pas encore servir de monture, mais suit fidèlement son maître. 5. Monture : l’hippogriffe atteint l’âge adulte et son maître peut le chevaucher (profil stan- dard). Lorsqu’il est monté, l’hippogriffe perd ses capacités de vol rapide et d’agripper, mais acquiert la même DEF que son maître si elle est supérieure. Faire attaquer la monture est une action gratuite. 6. Lien mental : le maître et sa monture développent un lien particulier qui leur per- met de communiquer par télépathie jusqu’à une distance de 5 km. Le maître peut soigner sa monture par simple contact en dépensant ses propres PV (L). Désormais, le griffon possède [10 + niveau du maître × 6] PV. 7. Vol rapide : l’hippogriffe bénéficie de sa capacité de vol rapide, même lorsqu’il est monté. Il a une valeur d’attaque égale à celle d’attaque magique du PJ et inflige 2d4°+6 DM. 8. Agripper : l’hippogriffe bénéficie de sa capacité agripper, même lorsqu’il est monté. Il est capable de porter un second cavalier ou d’emporter dans les airs une victime agrippée de FOR inférieure à la sienne (en cas de chute, DM selon hauteur atteinte). HOBGOBELIN 1 W WHOBGOBELIN (ESCLAVAGISTE) CRÉATURE HUMANOÏDE TAILLE MOYENNE | NC 3 Les hobgobelins se distinguent des orcs par des oreilles longues, leur peau qui tend vers le | AGI +1 | CON +1 | FOR +3 | PER +2* | rouge, l’absence de crainte du soleil et une moins | CHA -1 | INT +0 | VOL +0 | grande robustesse. Les hobgobelins (ou hauts gobelins) combattent généralement en nombre et sont parmi les mieux organisés des humanoïdes maléfiques. Il n’est pas rare de les trouver dans de véritables armées et leurs leaders bénéficient généralement de quelques rangs dans la voie du chef d’armée. Ils portent souvent des armures à bandes et sont équipés de boucliers. Dans les Terres d’Osgild, les hobgobelins (S)DEF 16 (V)PV 45 (I)Init. 15 Fouet à crochets (2 attaques, 5 m) +6 · DM 1d6+3" }, { n: "Fauchage", d: "Lorsque le hobgobelin réussit une attaque avec un résultat de 17-20 au d20, la victime doit réussir un test d’AGI difficulté 13 ou être renversée. forment les troupes de base des sorciers noirs du Kathang et sont aussi de féroces surveillants" }]
},

{
  id: "hobgobelin_capitaine", nom: "Hobgobelin (Capitaine)", cat: "humanoide", nc: 4, ncLabel: "4",
  type: "Humanoïde", taille: "Moyenne", env: ["ruines"],
  desc: "1 W WHOBGOBELIN (ESCLAVAGISTE) CRÉATURE HUMANOÏDE TAILLE MOYENNE",
  car: { AGI: [1], CON: [2], FOR: [3], PER: [0], CHA: [0, 1], INT: [1], VOL: [1] },
  def: 18, pv: 50, init: 10,
  att: [{ n: "Épée", mod: 5, dmg: "1d8+3", note: "2 attaques" }],
  caps: []
},

{
  id: "hobgobelin_de_base", nom: "Hobgobelin De Base", cat: "humanoide", nc: 0.5, ncLabel: "1/2",
  type: "Humanoïde", taille: "Moyenne", env: ["ruines"],
  car: { AGI: [1], CON: [1], FOR: [1], PER: [0], CHA: [-2], INT: [0], VOL: [-1] },
  def: 14, pv: 9, init: 10,
  att: [{ n: "Épée", mod: 3, dmg: "1d8+1 Javelot (20 m) +3 · DM 1d6" }],
  caps: []
},

{
  id: "hobgobelin_sergent", nom: "Hobgobelin (Sergent)", cat: "humanoide", nc: 2, ncLabel: "2",
  type: "Humanoïde", taille: "Moyenne", env: ["marais", "arctique", "urbain"],
  desc: "1 W WHOBGOBELIN (ESCLAVAGISTE) CRÉATURE HUMANOÏDE TAILLE MOYENNE",
  car: { AGI: [1], CON: [1], FOR: [2], PER: [0], CHA: [-1], INT: [0], VOL: [0] },
  def: 16, pv: 25, init: 10,
  att: [{ n: "Épée", mod: 5, dmg: "1d8+2" }],
  caps: [{ n: "Sergent", d: "Une fois par round, le sergent peut donner une action supplémentaire à n’importe quel allié sous ses ordres à portée de vue (attaque ou mouve- ment). Une fois par combat, une attaque qui aurait dû amener le sergent à 0 PV est ignorée. HOMME-LÉZARD Les hommes-lézard sont des créatures repti- liennes robustes mesurant environ 2 m. Ils parlent le draconien et vivent le plus souvent dans des marais, bien qu’ils soient capables de s’adapter à de nombreux milieux naturels, pourvu qu’il ne fasse pas moins de 5 oC. Les hommes-lézard forment des tribus d’une douzaine de membres, commandées par le plus fort d’entre eux. Ils ne constituent pas de groupes armés structurés. Les mâles et les femelles sont difficiles à discerner (entre eux, ils se distinguent à l’odeur). Tous les hommes-lézard bénéficient des capa- cités suivantes." }, { n: "Natation", d: "Les hommes-lézard sont parfaitement adaptés au milieu aquatique. En cas de combat dans l’eau, ils ne souffrent d’aucune pénalité." }, { n: "Odorat", d: "Les hommes-lézard ont +5 aux tests pour pister." }, { n: "Sensible au froid", d: "Un homme-lézard qui subit des DM de froid est ralenti à son pro- chain tour." }]
}
);
