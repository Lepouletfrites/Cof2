/* ============================================================
   COF2 Compagnon — Voies de prestige : MAGE
   Les sorts de ces voies sont indexés sur l'INT.
   Un ensorceleur (ou un barde) utilise son CHA à la place.
   ============================================================ */
window.COF = window.COF || {};
COF.PRESTIGE = COF.PRESTIGE || {};

COF.PRESTIGE.archimage = {
  id: 'archimage', nom: "Voie de l'archimage", fam: 'mage',
  desc: "La voie par défaut des plus grands magiciens, prolongement de la magie universelle.",
  caps: [
    { r: 4, n: 'Sceptre défensif', d: "Bâton en main : +1 en DEF et à tous les tests opposés de magie pour résister aux sorts (+2 au rang 6, +3 au rang 8)." },
    { r: 5, n: 'Bâton magique', choix: true, d: "Un sort de rang 1 de la famille des mages est lié à son bâton : utilisable en action de mouvement sans dépense de mana. À partir du rang 7, ajoute un sort de rang 2 également gratuit." },
    { r: 6, n: 'Paralysie', a: 'L', s: true, dmg: '1d4°+INT', d: "Paralyse dans un rayon de 10 m autant de créatures que la somme de leurs NC ne dépasse pas son niveau, pendant [1d4° + INT] rounds. Concentration par action de mouvement. Les créatures de NC 4+ se libèrent sur un test de CON difficulté 15 (1 essai par round)." },
    { r: 7, n: 'Barrière magique', a: 'L', s: true, f: 'jour', dmg: '5d4°+INT', d: "1×/jour : frontière invisible de 20 m de long pendant 24 h. Qui force le passage fait un test opposé d'attaque magique : échec = [5d4° + INT] DM et pas de nouvelle tentative avant une heure ; succès = passe en subissant la moitié des DM." },
    { r: 8, n: "Métamorphose d'autrui", a: 'A', s: true, f: 'combat', d: "Test opposé d'attaque magique (20 m) : transforme la cible en petit animal (1 PV grenouille, 2 PV mouton). Durée selon le NC : 0-1 permanent, 2 → 24 h, 3 → 1d6 h, 4 → 1d6 min, 5+ → 1d6 rounds, NC ≥ mage → 1 round. Une fois par combat et par cible." }
  ]
};

COF.PRESTIGE.chaos = {
  id: 'chaos', nom: 'Voie du chaos', fam: 'mage',
  desc: "Aussi appelée voie de l'arc-en-ciel : une énergie instable dont les couleurs ne sont que la manifestation.",
  caps: [
    { r: 4, n: 'Arc-en-ciel', a: 'A', s: true, d: "Test opposé d'attaque magique (10 m). NC ≤ 1 : inconscient 1d6 rounds. NC 2-3 : aveuglé 1d6 rounds. NC 4+ : affaibli 1d6 rounds. Sans effet sur une créature de niveau ≥ au magicien." },
    { r: 5, n: 'Mur arc-en-ciel', a: 'A', s: true, dmg: '2d4°', d: "Mur opaque (5 m de haut, 3 m de long par rang) ou cercle de diamètre égal au rang, pendant INT minutes. Une créature de NC inférieur qui le traverse est repoussée de 2d4° m et subit autant de DM (test d'INT difficulté [10 + INT] pour les autres). Stoppe les attaques magiques et les projectiles." },
    { r: 6, n: 'Pont arc-en-ciel', a: 'A', s: true, dmg: '3d4°', d: "Pont entre deux points en vue pendant INT heures, franchi instantanément par ses alliés. Les autres font un test d'INT difficulté [10 + INT] ; sur un échec, 1d6 : 1-2 chute 3d4° DM, 3-4 projetée 1d4° min dans le futur, 5-6 téléportée à 1d4° km." },
    { r: 7, n: 'Explosion multicolore', a: 'A', s: true, d: "Mêmes effets qu'Arc-en-ciel, dans une zone de 10 m de diamètre à 30 m de portée." },
    { r: 8, n: 'Sphère multicolore', a: 'A', s: true, dmg: '2d4°', d: "Sphère immobile de 5 m de diamètre autour de lui pendant INT heures. Aucun sort ne la traverse. NC < ½ niveau : téléportée à 2d4° × 100 km ; NC < niveau : à 2d4° km ; NC ≥ niveau : idem sauf test d'INT difficulté [10 + INT] réussi." }
  ]
};

COF.PRESTIGE.cristaux = {
  id: 'cristaux', nom: 'Voie des cristaux', fam: 'mage',
  desc: "L'art de tailler et d'harmoniser les cristaux magiques, qui tournoient autour de la tête de leur porteur.",
  note: "Fabriquer un cristal demande 1d6 jours et 500 pa. Activer ou désactiver un cristal est une action limitée, à n'importe quelle distance. Effets disponibles : régénération 1 PV/h, +1 PER, +5 Init., +1 FOR, survivre sans respirer, résistance feu et froid 10, résistance acide et électricité 10, +1 CHA, +2 DEF, +1 CON, +1 INT, +1 AGI, subsister sans boire ni manger, +1 en attaque.",
  caps: [
    { r: 4, n: 'Premier cristal', choix: true, d: "Apprend à créer le cristal de son choix. Un seul cristal actif à la fois." },
    { r: 5, n: 'Second cristal', choix: true, d: "Un nouveau cristal au choix. Deux cristaux actifs simultanément (jamais deux fois le même sur une personne)." },
    { r: 6, n: 'Troisième cristal', choix: true, d: "Deux nouveaux cristaux au choix. Trois cristaux actifs simultanément." },
    { r: 7, n: 'Quatrième cristal', choix: true, d: "Deux nouveaux cristaux au choix. Quatre cristaux actifs simultanément." },
    { r: 8, n: 'Cinquième cristal', choix: true, d: "Trois nouveaux cristaux au choix. Cinq cristaux actifs simultanément." }
  ]
};

COF.PRESTIGE.elementaliste = {
  id: 'elementaliste', nom: "Voie de l'élémentaliste", fam: 'mage',
  desc: "Maîtriser les énergies élémentaires : feu, froid, électricité, acide.",
  caps: [
    { r: 4, n: 'Élément de prédilection', choix: true, d: "Choisir feu, froid, électricité ou acide : +2 en attaque magique avec les sorts de cet élément et +2 à la difficulté des tests pour y résister." },
    { r: 5, n: 'Résistance élémentaire', d: "Ne subit que la moitié des DM de son élément de prédilection. Peut convertir un sort élémentaire vers son élément en action gratuite." },
    { r: 6, n: "Invocation d'élémentaire", a: 'L', s: true, f: 'combat', dmg: '2d4°+6', d: "1×/combat : élémentaire de son choix pendant INT minutes. AGI +2, CON +6*, FOR +6*, VOL +4. DEF 19, PV [niveau × 5], Init. 10, DM 2d4°+6. Feu : +1d4° DM. Eau : dé bonus en attaque. Air : vol 30 m. Terre : +5 DEF." },
    { r: 7, n: 'Élément puissant', dmg: '1d4°', d: "+1d4° aux DM de tous ses sorts de son élément de prédilection (DM initiaux seulement pour les DM sur la durée)." },
    { r: 8, n: 'Métamorphose élémentaire', a: 'A', s: true, dmg: '2d4°', d: "Forme élémentaire au choix pendant [5 + INT] minutes : RD 5 et immunité à l'élément. Feu : +2d4° DM de feu au contact et 1d4° aux attaquants naturels. Eau : 1d4° PV par round et passe par tout interstice. Terre : +3 en FOR et en DEF. Air : vol 20 m, DM physiques subis divisés par deux, RD 10." }
  ]
};

COF.PRESTIGE.gel = {
  id: 'gel', nom: 'Voie du gel', fam: 'mage',
  desc: "Les sorciers des cimes et des étendues glacées du grand nord.",
  caps: [
    { r: 4, n: 'Verglas', a: 'A', s: true, d: "Verglas sur 10 m de diamètre pendant INT minutes. Rester debout : test d'AGI difficulté 10 ; s'y déplacer ou combattre : difficulté 15. Échec = renversé (relever : nouveau test difficulté 15, 1 round)." },
    { r: 5, n: 'Cœur de glace', d: "Divise par deux tous les DM de froid subis. Immunisé à la peur." },
    { r: 6, n: 'Souffle glacial', a: 'A', s: true, dmg: '4d4°+INT', d: "Blizzard dans un cône de 20 m × 20 m : [4d4° + INT] DM et ralenti 1 round. Test de CON difficulté [10 + INT] pour n'en subir que la moitié sans être ralenti." },
    { r: 7, n: 'Présence glaciale', a: 'A', s: true, dmg: '1d4°', d: "Corps de glace vivante pendant [1d6 + INT] minutes : +4 en DEF, immunisé au froid, DM de feu divisés par deux. Les attaquants naturels subissent 1d4° DM. Gèle le sol et marche sur l'eau." },
    { r: 8, n: 'Cryogénisation', a: 'A', s: true, d: "Test opposé d'attaque magique : la cible est congelée dans une gangue (50 DM pour la briser). Durée selon le NC : ≤1 INT siècles, 2 INT années, 3 INT jours, 4 INT heures, 5 INT minutes, 6+ INT rounds." }
  ]
};

COF.PRESTIGE.invocationmajeure = {
  id: 'invocationmajeure', nom: "Voie de l'invocation majeure", fam: 'mage',
  desc: "Pas une magie d'attaque, mais des miracles presque sans limites.",
  note: "Tous les sorts de cette voie sont des actions limitées demandant un rituel d'une minute, mais bénéficient automatiquement de la Concentration : leur coût est égal à [rang − 2] PM.",
  caps: [
    { r: 4, n: 'Monture fantôme', a: 'L', s: true, dmg: '1d4°+INT', d: "Cheval fantomatique pendant [1d4° + INT] heures, plus rapide qu'un cheval ordinaire et insensible aux terrains difficiles. Court sur l'eau au rang 6, vole au rang 8. Guidable seulement par son invocateur." },
    { r: 5, n: "Manoir d'outre-monde", a: 'L', s: true, d: "Une porte existante ouvre sur un manoir magique pendant 1 h par niveau : une pièce par niveau, 50 m² par niveau, meublé au goût de l'invocateur. Les objets disparaissent hors du manoir ; la nourriture rassasie sans nourrir." },
    { r: 6, n: 'Navire fantôme', a: 'L', s: true, d: "Un navire fantôme sans équipage, 20 km/h, jusqu'à cent passagers, jusqu'au prochain lever de soleil. Il ne s'éloigne pas à plus d'une journée de la côte. Au rang 8 : nef volante (coût d'un sort de rang 8)." },
    { r: 7, n: 'Chasseur ailé', a: 'L', s: true, dmg: '2d6+6', d: "Créature ailée invoquée 24 h pour trouver et rapporter une personne ou un objet (instinct infaillible, 25 km/h, ne combat que pour se défendre). NC 5 : DEF 18, PV 50, serres +10, DM 2d6+6. En cas d'échec de la mission, elle se retourne contre son invocateur." },
    { r: 8, n: 'Portail magique', a: 'L', s: true, f: 'jour', d: "1×/jour : portail vers un lieu en vue ou parfaitement connu, jusqu'à [niveau × 10] km, pendant [5 + INT] minutes. Franchissable dans les deux sens par toute créature de taille énorme ou inférieure." }
  ]
};

COF.PRESTIGE.magedeguerre = {
  id: 'magedeguerre', nom: 'Voie du mage de guerre', fam: 'mage',
  desc: "De véritables machines à tuer : la mort venue du ciel, l'enfer sur terre.",
  prereq: "Connaître au moins trois sorts infligeant des DM directs (Projectile de mana, Explosion de feu, Foudre…).",
  caps: [
    { r: 4, n: 'Coup au but', a: 'G', s: true, d: "Le personnage ou une cible à 10 m obtient +10 sur son prochain test d'attaque contre DEF (au contact, à distance ou magique), à exécuter avant la fin du round. Lancé en action de mouvement : coûte seulement 2 PM." },
    { r: 5, n: 'Explosion différée', a: 'A', s: true, dmg: '4d4°+INT', d: "Bille de feu envoyée jusqu'à 50 m (deux coudes possibles), même sans voir le lieu. Explose au contact, sur mot de commande, au délai fixé ou après INT minutes : [4d4° + INT] DM dans 5 m, moitié sur un test d'AGI difficulté [10 + INT]." },
    { r: 6, n: 'Aura du chef de guerre', a: 'A', s: true, d: "Tous ses alliés dans un rayon de 20 m gagnent +1 en DEF et aux DM pendant INT minutes (+2 à partir du niveau 16)." },
    { r: 7, n: 'Épargner les alliés', d: "En lançant un sort de zone, peut dépenser 1 PM par allié présent dans la zone pour l'épargner complètement." },
    { r: 8, n: 'Vague de feu', a: 'L', s: true, dmg: '5d4°+INT', d: "Mur de feu de 3 m de haut sur 20 m de large qui s'éloigne sur 50 m : [5d4° + INT] DM sur son passage, moitié sur un test d'AGI difficulté 15 réussi." }
  ]
};

COF.PRESTIGE.magieesprit = {
  id: 'magieesprit', nom: "Voie de la magie de l'esprit", fam: 'mage',
  desc: "Nul ne peut protéger l'intimité de ses pensées ni le contrôle de son propre corps.",
  caps: [
    { r: 4, n: 'Esprit impénétrable', a: 'A', s: true, comp: 'cacher ses émotions, résister aux sorts affectant l\'esprit', bon: 5, d: "Lui ou un allié au contact devient immunisé à toute détection des mensonges, sentiments et émotions, et à la localisation magique, pendant INT heures." },
    { r: 5, n: 'Lire les pensées', a: 'A', s: true, d: "Test opposé d'attaque magique contre une créature de NC inférieur (20 m) : entend ses pensées pendant [1d6 + INT] rounds (pas sa mémoire). En combat : +3 en DEF contre les attaques de cette cible." },
    { r: 6, n: 'Prison mentale', a: 'A', s: true, f: 'combat', d: "1×/combat, test opposé d'attaque magique (20 m) : labyrinthe extradimensionnel. NC ≤ 1 : INT jours ; NC 2 : INT heures ; NC 3 : INT minutes ; NC 4+ : 1d6 rounds. Test d'INT difficulté [10 + INT] pour diviser la durée par deux. Sans effet si l'INT de la cible est ≥ à la sienne." },
    { r: 7, n: 'Attaque mentale', a: 'A', s: true, dmg: '5d4°+INT', d: "Test opposé d'attaque magique (20 m) : [5d4° + INT] DM et test d'INT difficulté [10 + INT]. Échec : inconscience 1d6 rounds si la cible est de niveau inférieur, sinon immobilisée 1 round." },
    { r: 8, n: 'Contrôle mental', a: 'A', s: true, d: "Test opposé d'attaque magique (20 m) : prend le contrôle des actions de la cible pendant INT heures (NC ≤ 1), INT minutes (NC 2), INT rounds (NC 3) ou 1d6 rounds (NC 4+). Son propre corps reste inactif. Une seule créature à la fois." }
  ]
};

COF.PRESTIGE.magiemots = {
  id: 'magiemots', nom: 'Voie de la magie des mots', fam: 'mage',
  desc: "Le verbe précéda la matière : sculpter le monde par la force des mots.",
  note: "Accessible aux bardes comme s'il s'agissait d'une voie de leur propre famille.",
  caps: [
    { r: 4, n: 'Chant fascinant', a: 'A', s: true, dmg: '1d6+INT', d: "Fascine les humanoïdes et animaux de NC ≤ 1 dans un rayon de 20 m (+1 NC par rang au-delà). Elles cessent toute activité tant qu'il chante (action de mouvement par round), jusqu'à [1d6 + INT] minutes. Une créature blessée reprend ses esprits et devient immunisée 24 h." },
    { r: 5, n: 'Poids des mots', a: 'L', s: true, d: "Altère la réalité tant qu'elle n'a pas été révélée, en la racontant. Le MJ peut refuser, mais les PM ne sont alors pas dépensés." },
    { r: 6, n: 'Cri de la banshee', a: 'A', s: true, f: 'jour', dmg: '6d4°', d: "1×/jour : toutes les créatures vivantes dans un rayon de 10 m subissent 6d4° DM, ou rien si elles réussissent un test de CON difficulté [10 + INT] (+5 pour ses alliés, prévenus)." },
    { r: 7, n: 'Mot de mana', a: 'L', s: true, f: 'combat', d: "Cible à 20 m : moins de 120 PV maximum → aveuglée 1d4 rounds. Niveau 15 : mot d'étourdissement (moins de 100 PV). Niveau 18 : mot de mort (moins de 80 PV). Récupération rapide nécessaire entre deux usages." },
    { r: 8, n: 'Souhait', a: 'L', s: true, f: 'jour', d: "1×/jour : duplique n'importe quelle capacité de n'importe quelle voie jusqu'au rang 5. 1×/aventure : un souhait au-delà de ce cadre, avec des effets collatéraux inventés par le MJ." }
  ]
};

COF.PRESTIGE.magietemps = {
  id: 'magietemps', nom: 'Voie de la magie du temps', fam: 'mage',
  desc: "Le plus subtil et le plus puissant des arts occultes — et le plus facile où se perdre.",
  note: "Règle optionnelle du contretemps : sur un échec critique (1 au d20) avec un sort de cette voie, le lanceur subit un contrecoup déterminé par un d6.",
  caps: [
    { r: 4, n: 'Fuite en avant', a: 'A', s: true, dmg: '1d4°', d: "Test d'attaque magique difficulté [10 + durée choisie en minutes] : disparaît et réapparaît à la fin de la durée. Si un obstacle occupe sa position, il réapparaît au plus près et subit 1d4° DM." },
    { r: 5, n: 'Lenteur', a: 'A', s: true, d: "Test opposé d'attaque magique (30 m) : cible ralentie 1d4 rounds (durée doublée si son niveau est inférieur). Une résistance réussie l'immunise pour le reste du combat." },
    { r: 6, n: 'Décalage', a: 'A', s: true, dmg: '1d4°', d: "Touche sa cible, test opposé d'attaque magique : elle est envoyée jusqu'à 1d4° min dans le futur, immatérielle et immobile. Si un obstacle occupe sa position au retour, elle réapparaît au plus près et subit 1d4° DM." },
    { r: 7, n: 'Enkystement lointain', a: 'A', s: true, f: 'combat', dmg: '2d4°', d: "1×/combat, test opposé d'attaque magique (20 m) : téléportation aléatoire. NC < ½ niveau : 2d4° × 100 km ; niveau inférieur : 2d4° km ; niveau ≥ : 2d4° × 10 m. Une fois par jour et par créature." },
    { r: 8, n: 'Arrêt du temps', a: 'L', s: true, dmg: '1d4°+INT', d: "Arrête le temps pendant [1d4° + INT] rounds. Seul le magicien agit : sorts sur lui-même, déplacements, objets. Tout contact avec un être vivant rétablit instantanément le cours du temps." }
  ]
};

COF.PRESTIGE.maitresorts = {
  id: 'maitresorts', nom: 'Voie du maître des sorts', fam: 'mage',
  desc: "Une liste encyclopédique de sorts : toujours le bon sort au bon moment, au détriment des plus puissants.",
  note: "La magie profane comprend tous les sorts des profils de mage, plus les sorts de barde.",
  caps: [
    { r: 4, n: 'Connaissance des arcanes inférieures', choix: true, d: "Apprend deux sorts de rang 1 de magie profane au choix." },
    { r: 5, n: 'Connaissance des arcanes mineures', choix: true, d: "Apprend deux sorts de rang 2 de magie profane au choix." },
    { r: 6, n: 'Connaissance des arcanes supérieures', choix: true, d: "Apprend deux sorts de rang 3 de magie profane au choix." },
    { r: 7, n: 'Connaissance des arcanes majeures', choix: true, d: "Apprend deux sorts de rang 4 de magie profane au choix." },
    { r: 8, n: 'Connaissance des arcanes suprêmes', choix: true, d: "Apprend deux sorts de rang 5 de magie profane au choix." }
  ]
};

COF.PRESTIGE.vision = {
  id: 'vision', nom: 'Voie de la vision', fam: 'mage',
  desc: "Voir et ne pas être vu : maîtriser et tromper le sens le plus utilisé.",
  prereq: "Avoir accès à la voie de la magie universelle, de la divination, des illusions ou de la sombre magie.",
  caps: [
    { r: 4, n: 'Cécité', a: 'A', s: true, d: "Test opposé d'attaque magique (20 m) : la cible est aveuglée 1d6 rounds si son NC est inférieur au niveau du personnage, sinon 1 round seulement." },
    { r: 5, n: 'Œil magique', a: 'A', s: true, dmg: '1d6', d: "Détache son œil et le fait voler à 10 m par action de mouvement pendant INT minutes. L'œil a DEF 20 et 1 PV ; détruit, le mage perd 1d6 PV et l'œil repousse aussitôt." },
    { r: 6, n: 'Motif hypnotique', a: 'A', s: true, d: "Un tableau hypnotique dans le ciel : chaque créature à 20 m doit réussir un test d'INT difficulté [12 + INT] ou le contempler sans prêter attention à son environnement (elle riposte si on l'attaque). Durée INT min, uniquement les créatures de NC inférieur au rang." },
    { r: 7, n: 'Vision de la vérité', a: 'A', s: true, d: "Pendant INT minutes : voit à travers illusions et déguisements, même magiques, et voit les créatures invisibles. Action de mouvement + test opposé d'attaque magique pour connaître le niveau approximatif, les PV et les pouvoirs d'une créature à 20 m." },
    { r: 8, n: 'Invisibilité supérieure', a: 'A', s: true, dmg: '1d4°+INT', d: "Au choix : Invisibilité sur lui-même plus INT alliés pendant [1d4° + INT] minutes ; ou invisibilité supérieure sur lui seul, qui persiste même s'il attaque (durée en rounds) — ses adversaires l'attaquent comme s'ils étaient aveuglés et ne peuvent le cibler par des sorts." }
  ]
};
