/* ============================================================
   COF2 Compagnon — Voies de prestige : COMBATTANT
   ============================================================ */
window.COF = window.COF || {};
COF.PRESTIGE = COF.PRESTIGE || {};

COF.PRESTIGE.armesdeuxmains = {
  id: 'armesdeuxmains', nom: 'Voie des armes à deux mains', fam: 'combattant',
  desc: "Exploiter pleinement l'allonge supérieure et la force d'impact des armes à deux mains.",
  note: "Sans effet avec les armes infligeant des DM non létaux ou seulement 1d6 DM.",
  caps: [
    { r: 4, n: 'Frappe massive', a: 'L', d: "Attaque au contact infligeant les DM maximaux (les dés bonus ne sont pas maximisés). La cible doit réussir un test opposé de FOR ou être renversée (+5 cumulatif à son test à chaque nouvelle tentative dans le combat ; dé bonus si elle est énorme ou colossale)." },
    { r: 5, n: 'Gros monstre, grosse arme', d: "Contre les créatures de taille grande et supérieure, les DM des armes à deux mains montent d'une catégorie : d12 et 2d6 → 2d8, 1d8 et 1d10 → 1d12, 2d8 → 2d10." },
    { r: 6, n: 'Tenir à distance', d: "+1 en DEF avec une arme à deux mains en main (+2 au rang 8)." },
    { r: 7, n: 'Critique destructeur', t: 'bonus', dmg: '2d4°', d: "Seuil de critique abaissé de 1 point avec toutes les armes à deux mains. Sur un critique : +2d4° aux DM en plus des effets habituels." },
    { r: 8, n: 'Décapitation', d: "Résultat maximal sur un dé de DM au contact à deux mains : une cible de NC ≤ 5 est décapitée. Résultat maximal sur les deux dés : décapite une cible de NC inférieur à son niveau. Les DM maximaux automatiques (Frappe massive) ne déclenchent pas cet effet." }
  ]
};

COF.PRESTIGE.armeliee = {
  id: 'armeliee', nom: "Voie de l'arme liée", fam: 'combattant',
  desc: "Un lien magique unit le héros à son arme favorite.",
  prereq: "Rituel informel de 2d6 jours pour se lier à une arme. Une nouvelle arme par niveau (le lien précédent disparaît).",
  caps: [
    { r: 4, n: 'Fidèle', f: 'combat', d: "L'arme est magique et donne un dé bonus en attaque 1×/combat. En vue et à moins de 10 m, il la rappelle en action gratuite (test opposé de CHA contre la FOR de celui qui la tient). Hors de vue, il sait toujours dans quelle direction elle se trouve." },
    { r: 5, n: 'Alliée loyale', f: 'combat', d: "1×/combat, un résultat de 1 au test d'attaque avec l'arme liée peut être remplacé par 20." },
    { r: 6, n: 'Arme dansante', a: 'M', f: 'combat', d: "1×/combat : l'arme combat seule pendant [rang] rounds avec la valeur d'attaque magique du PJ et ses DM de base. S'il tombe inconscient, elle veille sur son corps jusqu'à la fin de la durée." },
    { r: 7, n: 'Aura élémentaire', a: 'A', f: 'combat', t: 'bonus', dmg: '1d4°', d: "1×/combat pendant CON minutes : +1d4° DM de feu, acide, froid ou électricité (élément choisi une fois pour toutes). Non cumulable avec un autre bonus élémentaire magique." },
    { r: 8, n: 'Mille lames', a: 'L', f: 'jour', dmg: '1d4°', d: "1×/jour, en sacrifiant 2d4° PV : pendant 5 rounds, tous les adversaires dans un rayon de 10 m sont frappés par des lames spectrales et subissent automatiquement 1d4° DM par round." }
  ]
};

COF.PRESTIGE.chevalierdragon = {
  id: 'chevalierdragon', nom: 'Voie du chevalier dragon', fam: 'combattant',
  desc: "L'ordre mythique réservé à l'élite de la chevalerie, monté sur un drake.",
  prereq: "Avoir la capacité Monture fantastique (rang 5, voie du cavalier) et avoir choisi un drake au niveau 9. Voie de très haut niveau.",
  caps: [
    { r: 4, n: 'Ordre du chevalier dragon', comp: 'persuasion et intimidation (avec les insignes ou en selle)', bon: 5, d: "Rejoint l'ordre comme apprenti. Son drake obtient une RD 10 contre le feu." },
    { r: 5, n: 'Résistance au feu', d: "RD 5 contre tous les DM de feu (RD 10 à partir du rang 7)." },
    { r: 6, n: 'Épée de feu', a: 'M', t: 'bonus', dmg: '1d4°', d: "Enflamme son épée pour [5 + CHA] rounds : +1d4° DM de feu." },
    { r: 7, n: 'Monture puissante', dmg: '2d4°+6', d: "Le drake atteint sa maturité : AGI +0, CON +6*, FOR +6, PER +1, INT -2, CHA +0, VOL +2. DEF 22, PV [10 + niveau × 6], attaque = attaque magique, DM 2d4°+6." },
    { r: 8, n: 'Souffle enflammé', a: 'A', f: 'combat', dmg: '8d4°', d: "1×/combat : le drake crache du feu dans un cône de 10 m × 10 m, 8d4° DM (moitié sur un test d'AGI difficulté 12 réussi)." }
  ]
};

COF.PRESTIGE.tunnels = {
  id: 'tunnels', nom: 'Voie du combattant des tunnels', fam: 'combattant',
  desc: "Spécialiste de la survie souterraine et de l'élimination des hordes gobelinoïdes.",
  caps: [
    { r: 4, n: 'Infravision', comp: 'survie et orientation en milieu souterrain', bon: 5, d: "Voit dans le noir jusqu'à 10 m (ou +10 m de portée s'il le pouvait déjà)." },
    { r: 5, n: 'Combat confiné', d: "Plus de dé malus en espace réduit avec une arme plus longue qu'une dague ; arme à deux mains utilisable avec un dé malus. +1 en DEF tant qu'il tient une arme (+2 au rang 7), même hors espace confiné." },
    { r: 6, n: 'Briseur de hordes', a: 'G', f: 'round', dmg: '1d4°', d: "1×/round : inflige automatiquement 1d4° DM à chaque adversaire à son contact dont le NC est inférieur ou égal à la moitié de son niveau." },
    { r: 7, n: 'Tueur de nuées', t: 'bonus', dmg: '1d4°', d: "+1d4° DM contre les créatures de taille petite ou inférieure et contre les nuées." },
    { r: 8, n: 'Briseur de voûte', f: 'combat', dmg: '4d4°', d: "1×/combat dans une cavité de moins de 6 m : fait s'écrouler la voûte. Tous les adversaires dans une zone de 10 × 10 m subissent 4d4° DM. La zone devient un terrain difficile et les créatures à 0 PV sont ensevelies." }
  ]
};

COF.PRESTIGE.combatdumal = {
  id: 'combatdumal', nom: 'Voie du combat du mal', fam: 'combattant',
  desc: "Pourfendeur de créatures maléfiques, chasseur de sorcières, inquisiteur.",
  caps: [
    { r: 4, n: 'Juste courroux', a: 'G', d: "Chaque fois qu'il est victime d'une Attaque sournoise ou d'une Attaque mortelle, il riposte par une attaque au contact gratuite." },
    { r: 5, n: 'Épée de lumière', a: 'M', t: 'bonus', dmg: '1d4°', d: "Son arme brille comme une torche pour le reste du combat et inflige +1d4° DM aux morts-vivants, créatures démoniaques et animaux corrompus." },
    { r: 6, n: 'Sentir la corruption', a: 'L', d: "Détecte la présence d'une source maléfique dans un rayon de 20 m (démons, morts-vivants, animaux corrompus, artefacts maléfiques, lieux maudits), sans localisation ni nature." },
    { r: 7, n: 'Frappe suppressive', a: 'L', d: "En plus des DM normaux, la cible fait un test opposé d'attaque magique. En cas d'échec, elle ne peut utiliser aucun pouvoir magique à son prochain tour." },
    { r: 8, n: 'Résister à la corruption', f: 'combat', d: "1×/combat : résiste totalement à un sort ou effet magique de son choix. Immunisé aux effets de corruption (drain, affaiblissement, pourriture, poison ou maladie des morts-vivants, démons et créatures corrompues)." }
  ]
};

COF.PRESTIGE.colosse = {
  id: 'colosse', nom: 'Voie du colosse', fam: 'combattant',
  desc: "Une force prodigieuse et des muscles énormes : +10 kg par rang, tout en muscle.",
  prereq: "Avoir au moins +3 en Force.",
  caps: [
    { r: 4, n: 'Stature de géant', dmg: '1d6', d: "Compte comme une taille de plus pour déterminer s'il peut être affecté par les capacités spéciales des créatures (fauchage, agripper…). Inflige 1d6 DM à mains nues." },
    { r: 5, n: 'Résistance colossale', d: "+5 PV supplémentaires, auxquels s'ajoute sa CON." },
    { r: 6, n: 'Force du titan', d: "+1 en FOR." },
    { r: 7, n: 'Poigne de fer', d: "Peut utiliser une arme à deux mains d'une seule main. À deux mains, il peut manier une arme de créature de grande taille infligeant 2d8 DM au lieu de 2d6." },
    { r: 8, n: 'Attaque monumentale', a: 'L', f: 'combat', t: 'bonus', dmg: '1d4°', d: "1×/combat : +5 en attaque et +1d4° DM par round de combat écoulé contre cette créature (max 5). Une cible de NC inférieur est affaiblie 1 round par round comptabilisé." }
  ]
};

COF.PRESTIGE.danseurguerre = {
  id: 'danseurguerre', nom: 'Voie du danseur de guerre', fam: 'combattant',
  desc: "Un style de combat fait de pas de danse et d'acrobaties, populaire chez les elfes sauvages et les nomades.",
  prereq: "Ne pas porter d'armure plus encombrante qu'une chemise de mailles.",
  caps: [
    { r: 4, n: 'Vent des lames', d: "Avec dague, épée (courte, longue, sabre, vivelame) ou lance : utilise son AGI en attaque au contact OU aux DM au lieu de sa FOR (main principale seulement pour une arme à une main)." },
    { r: 5, n: 'Pirouettes', comp: 'danse et acrobaties', bon: 5, d: "+1 en DEF (+2 au rang 8)." },
    { r: 6, n: 'Attaque en mouvement', a: 'G', d: "Chaque fois qu'il utilise une action limitée pour attaquer au contact, il peut aussi se déplacer de 10 m avant ou après." },
    { r: 7, n: 'Danse des lames', a: 'L', f: 'combat', d: "Entre en transe pour le reste du combat : une attaque gratuite supplémentaire par round, avec un dé malus. Il peut y mettre fin quand il veut, mais pas recommencer avant le prochain combat. Un critique subi stoppe la transe." },
    { r: 8, n: 'Volte-face', t: 'bonus', dmg: '1d4°', d: "Chaque round où il attaque une cible différente du round précédent : dé bonus en attaque et +1d4° DM sur sa première attaque." }
  ]
};

COF.PRESTIGE.ecorcheur = {
  id: 'ecorcheur', nom: "Voie de l'écorcheur", fam: 'combattant',
  desc: "Chevalier noir, barbare sanguinaire ou guerrier sadique : ce qu'il aime, c'est le goût du sang.",
  caps: [
    { r: 4, n: 'Armes dentelées', comp: 'intimidation', bon: 5, d: "Toute attaque réussie provoque un saignement infligeant 1 DM par round pour le reste du combat (2 DM au rang 8, non cumulable). Arrêt par des soins ou une action limitée + test d'AGI difficulté 10." },
    { r: 5, n: 'Armure à pointes', dmg: '1d4', d: "Toute créature qui l'attaque au contact avec des armes naturelles et atteint au moins une DEF de 10 subit 1d4 DM (1d4° au rang 7)." },
    { r: 6, n: 'Blessures affreuses', d: "Les soins et régénérations sont divisés par 2 pour guérir les DM infligés par ses attaques au contact." },
    { r: 7, n: 'Hémorragie interne', dmg: '1d4°', d: "Sur un critique, la victime subit 1d4° DM supplémentaires à chaque round suivant pendant 3 rounds." },
    { r: 8, n: 'Impitoyable', dmg: '1d4°', d: "Même sur une attaque ratée, il inflige 1d4° DM à sa cible (du même type que ses DM habituels)." }
  ]
};

COF.PRESTIGE.guerriermage = {
  id: 'guerriermage', nom: 'Voie du guerrier-mage', fam: 'combattant',
  desc: "Lancer des sorts en armure : idéal pour un chevalier de la mort ou un chevalier-sorcier.",
  prereq: "Avoir acquis au moins une voie de combattant et une voie de mage.",
  pv: 4,
  caps: [
    { r: 4, n: 'Magie en armure', d: "Peut lancer des sorts de magie profane en armure tant que le bonus de DEF total des protections est ≤ rang − 2 (cuir au rang 4, plaque au rang 8). Dispense du surcoût de mana. Ne donne pas la maîtrise des armures." },
    { r: 5, n: 'Rituel de combat', d: "Un sort infligeant des DM parmi ceux qu'il connaît coûte désormais 1 PM de moins." },
    { r: 6, n: 'Déflexion arcanique', a: 'G', d: "Dépense 1 PM pour +2 en DEF contre une attaque, même après en avoir vu le résultat. Un seul PM par attaque, mais plusieurs fois par round. Au rang 9 : 3 PM pour +5 en DEF." },
    { r: 7, n: 'Magie de combat', d: "En utilisant la Concentration (L) pour lancer un sort de rang 1 à 3, il peut faire une attaque au contact gratuite au lieu de réduire le coût." },
    { r: 8, n: 'Frappe des arcanes', a: 'G', t: 'bonus', dmg: '1d4°', d: "Dépense 1 PM pour obtenir un dé bonus et +1d4° aux DM sur une attaque au contact." }
  ]
};

COF.PRESTIGE.ours = {
  id: 'ours', nom: "Voie de l'ours", fam: 'combattant',
  desc: "Les guerriers-ours adoptent la philosophie, les techniques et parfois la forme de leur animal totémique.",
  caps: [
    { r: 4, n: "Caractère d'ours", comp: 'intimidation', bon: 5, f: 'combat', d: "1×/combat, en action gratuite : un grondement terrible. Les adversaires au contact de NC inférieur à son niveau doivent réussir un test de VOL difficulté [6 + rang] ou fuir 1d4 rounds." },
    { r: 5, n: 'Hibernation', d: "Peut dormir sans interruption jusqu'à 2 jours par rang, sans eau ni nourriture, insensible au froid et au chaud, en récupérant normalement. Il peut ensuite rester autant de jours sans dormir." },
    { r: 6, n: 'Métamorphose', a: 'L', f: 'jour', dmg: '2d4+6', d: "1×/jour : forme d'ours brun pendant [1d6 + CON] minutes (cuir renforcé maximum). AGI +1, CON +6*, FOR +6, PER +2, CHA -2. DEF [12 + rang], PV [rang × 5], Init. 11, attaque = attaque magique, DM 2d4+6. Aucune capacité de profil utilisable." },
    { r: 7, n: "Étreinte de l'ours", a: 'L', f: 'combat', dmg: '2d4°+FOR', d: "1×/combat, sur une attaque au contact réussie contre une cible de FOR inférieure : [2d4° + FOR] DM et cible immobilisée. Elle se libère par un test de FOR opposé ; sinon les DM sont infligés à nouveau chaque tour sans nouveau test d'attaque." },
    { r: 8, n: 'Métamorphose supérieure', a: 'L', f: 'combat', d: "Métamorphose 1×/combat (récupération rapide entre deux usages), pour une durée de [1d6 + CON] heures." }
  ]
};

COF.PRESTIGE.porteurbouclier = {
  id: 'porteurbouclier', nom: 'Voie du porteur de bouclier', fam: 'combattant',
  desc: "Devenir un expert absolu du bouclier et de la défense.",
  caps: [
    { r: 4, n: 'Parade au bouclier', a: 'G', f: 'combat', d: "1×/combat : pare une attaque au contact ou à distance qui le touche, sans subir aucun DM. Impossible contre un critique." },
    { r: 5, n: 'Attaque au bouclier', a: 'G', f: 'round', dmg: '1d4°+FOR', d: "1×/round : attaque gratuite au bouclier avec un dé malus, infligeant [1d4° + FOR] DM." },
    { r: 6, n: 'Bousculade', d: "Sur une attaque au bouclier réussie, peut repousser sa cible de 2 m (test opposé de FOR si elle est plus grande). +1 à la DEF apportée par le bouclier (+2 au rang 8)." },
    { r: 7, n: 'Dévier les coups', a: 'G', f: 'round', d: "1×/round : retranche la valeur de DEF de son bouclier (bonus magique inclus) aux DM d'une attaque au contact ou à distance, sauf s'il est surpris." },
    { r: 8, n: 'Lancer de bouclier', a: 'A', d: "Lance son bouclier à 20 m (test d'attaque à distance) : DM d'une attaque au bouclier et test de FOR difficulté [10 + FOR] pour ne pas être renversé. Retour au bras par une action de mouvement tant qu'il est à moins de 20 m." }
  ]
};

COF.PRESTIGE.tueurgeants = {
  id: 'tueurgeants', nom: 'Voie du tueur de géants', fam: 'combattant',
  desc: "Une caste de têtes brûlées, célèbre chez les nains, spécialisée contre l'ennemi ancestral des montagnes.",
  caps: [
    { r: 4, n: 'Profil bas', comp: 'discrétion face aux créatures de taille grande et supérieure', bon: 5, d: "+5 aux tests de discrétion pour échapper à la perception des grandes créatures." },
    { r: 5, n: 'Ventre mou', d: "Ignore la RD des créatures lorsqu'elle est basée sur leur taille." },
    { r: 6, n: 'Réduire la distance', d: "+1 en DEF contre les créatures de taille grande, +2 contre les énormes, +3 contre les colossales." },
    { r: 7, n: "Pieds d'argile", a: 'L', f: 'combat', d: "Attaque aux jambes d'une créature de taille grande ou supérieure : ½ DM, mais la cible est ralentie au prochain round et invalide pour le reste du combat. Avec une marge de 10 points ou plus, elle est aussi renversée. Une fois par combat et par cible." },
    { r: 8, n: 'Tueur de géants', t: 'bonus', dmg: '1d4°', d: "+1d6 DM contre les créatures de taille grande, +1d4° contre les énormes, +2d4° contre les colossales." }
  ]
};
