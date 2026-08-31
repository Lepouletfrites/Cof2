/* ============================================================
   COF2 Compagnon — Profils : famille des MAGES
   3 PV/niveau · DR d6 · +1 capacité de rang 2 à la création
   Accès à la voie du mage en remplacement de la voie de peuple.
   ============================================================ */
window.COF = window.COF || {};
COF.PROFILS = COF.PROFILS || {};

COF.PROFILS.ensorceleur = {
  id: 'ensorceleur', nom: 'Ensorceleur', famille: 'mage', pv: 3,
  caracs: ['CHA', 'VOL', 'AGI'], magie: 'CHA',
  resume: "Un magicien charismatique qui emploie une magie subtile et innée.",
  armes: "La dague et le bâton ferré, plus une arme supplémentaire au choix (max 1d6 DM ; l'arbalète légère est éligible).",
  armureMax: 'aucune', bouclier: false,
  armuresTexte: "Aucune armure, aucun bouclier.",
  equipDepart: [
    { nom: 'Bâton ferré', type: 'contact', ref: 'batonferre' },
    { nom: 'Dague', type: 'contact', ref: 'dague' }
  ],
  voies: [
    { id: 'air', nom: "Voie de l'air", caps: [
      { r: 1, n: 'Murmures dans le vent', a: 'G', s: true, d: "Message d'une dizaine de mots jusqu'à un destinataire connu ou vu (portée CHA × 100 m), avec réponse immédiate. En plus de ce sort : +1 permanent en Init. et en DEF." },
      { r: 2, n: 'Sous tension', a: 'M', s: true, dmg: '1d4°+CHA', d: "Pendant CHA minutes, toute créature qui le blesse au contact subit 1d4° DM. De plus, une action d'attaque par round pour une décharge (attaque magique contre DEF, 10 m) : [1d4° + CHA] DM." },
      { r: 3, n: 'Télékinésie', a: 'A', s: true, d: "Déplace un objet inerte ou une cible volontaire de 50 kg par rang, portée 20 m, pendant CHA minutes (5 m par action de mouvement). Faire tomber un objet sur une cible surprise : attaque magique, 1d6 DM par tranche de 50 kg." },
      { r: 4, n: 'Foudre', a: 'A', s: true, dmg: '4d4°+CHA', d: "Éclair sur une ligne de 10 m : [4d4° + CHA] DM, moitié sur un test d'AGI difficulté [10 + CHA] réussi." },
      { r: 5, n: 'Forme éthérée', a: 'L', s: true, d: "Pendant CHA minutes, devient intangible : traverse murs et obstacles, ne subit ni n'inflige de DM physiques et ne peut lancer de sorts. Insensible à la gravité, stoppé par les barrières magiques et les êtres vivants." }
    ]},
    { id: 'divination', nom: 'Voie de la divination', caps: [
      { r: 1, n: 'Divination', a: 'L', s: true, d: "Test opposé d'attaque magique contre une créature de NC inférieur (10 m) : devine son nom, son métier et des informations publiques. Sur une cible volontaire, aucun test. En plus de ce sort : +1 en Init. et en DEF (+1 au rang 3, +1 par rang 5 atteint dans une voie d'ensorceleur)." },
      { r: 2, n: "Détection de l'invisible", a: 'L', s: true, d: "Pendant CHA minutes, détecte les créatures invisibles ou cachées à moins de 20 m et repère une Clairvoyance. Aveuglé, permet de détecter les créatures (et d'attaquer sans malus)." },
      { r: 3, n: 'Clairvoyance', a: 'A', s: true, d: "Voit et entend à distance un lieu connu (sans limite de portée) ou derrière une porte touchée, pendant CHA rounds (action limitée chaque round). Test de PER difficulté [12 + CHA] pour se sentir observé." },
      { r: 4, n: 'Perception héroïque', d: "+1 en PER, dé bonus aux tests de PER, et ajoute sa PER à son total de PM." },
      { r: 5, n: 'Prescience', f: 'combat', d: "1×/combat, au début du round : +10 en attaque, en DEF et à tous les tests de PER pour le round, DM subis divisés par 2, et peut agir à n'importe quel moment du round." }
    ]},
    { id: 'envouteur', nom: "Voie de l'envoûteur", caps: [
      { r: 1, n: 'Injonction', a: 'A', s: true, comp: 'persuasion, séduction', bon: '2+rang', d: "Test opposé d'attaque magique (20 m) : la cible exécute un ordre simple, non suicidaire, de deux ou trois mots pendant son prochain tour." },
      { r: 2, n: 'Sommeil', a: 'L', s: true, f: 'combat', dmg: '1d4°+CHA', d: "1×/combat : zone de 10 m à 20 m de portée, affecte [1d4° + CHA] créatures vivantes de NC < 1 (< 2 au rang 4, < 3 au rang 5), endormies pendant CHA minutes. Réveil en cognant (action d'attaque, 1 DM)." },
      { r: 3, n: 'Confusion', a: 'A', s: true, d: "Test opposé d'attaque magique (20 m) : pendant CHA rounds, à son tour la victime lance 1d6 — 1-3 elle n'agit pas, 4-6 elle attaque la créature la plus proche. Test de VOL difficulté [12 + CHA] pour s'en libérer." },
      { r: 4, n: 'Amitié', a: 'L', s: true, d: "Test opposé d'attaque magique (10 m) contre un humanoïde de niveau inférieur : il se comporte en ami de longue date tant qu'il n'est pas attaqué (test de VOL difficulté [10 + CHA] une fois par jour). Cible de niveau égal ou supérieur : simplement un dé bonus aux tests de CHA contre elle pendant 10 min." },
      { r: 5, n: 'Domination', a: 'A', s: true, dmg: '1d4°', d: "Test opposé d'attaque magique (20 m) contre une cible de niveau inférieur : contrôle total pendant CHA minutes, son propre corps s'écroule. Si la créature meurt, il réintègre son corps et subit 1d4° DM. Cible trop puissante : une seule action forcée, puis éjection et 1d4° DM." }
    ]},
    { id: 'illusions', nom: 'Voie des illusions', caps: [
      { r: 1, n: 'Mirage', a: 'L', s: true, comp: 'supercherie, mentir', bon: '2+rang', d: "Illusion visuelle et sonore immobile pendant CHA minutes, volume de 2 m de côté par rang (portée 50 m). Animée à partir du rang 4, mais la durée passe en rounds." },
      { r: 2, n: 'Image décalée', a: 'M', s: true, d: "Pendant [1d4 + CHA] rounds, des images se superposent à sa silhouette : sur une attaque réussie, lancez 1d6 — sur 5-6 il ne subit aucun DM." },
      { r: 3, n: 'Sort illusoire', a: 'A', s: true, dmg: '3d4°+CHA', d: "Sort d'attaque illusoire : [3d4° + CHA] DM sur une cible, ou [2d4° + CHA] DM sur un nombre de cibles égal au rang. Test de PER difficulté [10 + CHA] pour n'en subir aucun. Sans effet sur les créatures sans esprit." },
      { r: 4, n: 'Imitation', a: 'A', s: true, d: "Pendant CHA minutes, prend l'apparence d'une créature de taille voisine vue au moment de l'incantation. Toucher l'ensorceleur donne droit à un test d'INT difficulté [10 + CHA] pour percer l'illusion." },
      { r: 5, n: 'Exécution mentale', a: 'A', s: true, f: 'jour', d: "Test opposé d'attaque magique (20 m) contre un humanoïde vivant : succès = la victime tombe à 0 PV (ou est étourdie 1 round si son niveau est supérieur ou égal). Une seule fois par jour et par créature. Sans effet sur les créatures sans esprit." }
    ]},
    { id: 'invocation', nom: "Voie de l'invocation", caps: [
      { r: 1, n: 'Choc', a: 'A', s: true, dmg: '1d4°+CHA', d: "Attaque magique contre la DEF (20 m) : [1d4° + CHA] DM. Une cible de NC < rang doit réussir un test de FOR difficulté 10 pour ne pas être renversée." },
      { r: 2, n: 'Serviteur invisible', a: 'L', s: true, d: "Force invisible pendant CHA minutes (portée 20 m) : tâches simples sans test, AGI et INT +0, FOR égale au CHA. N'attaque pas, ne peut pas être combattu ; dissipable par Maîtrise de la magie." },
      { r: 3, n: 'Arme de mana', a: 'A', s: true, dmg: '1d4°+CHA', d: "Lame d'énergie pendant [rang] rounds. Chaque round, en action gratuite, elle attaque une cible à 20 m (attaque magique contre DEF) : [1d4° + CHA] DM. Une seule arme de mana active à la fois." },
      { r: 4, n: 'Porte dimensionnelle', a: 'A', s: true, d: "Se téléporte, avec jusqu'à un allié par point de CHA, à 60 m maximum. Le lieu d'arrivée doit être en vue." },
      { r: 5, n: 'Mur de mana', a: 'A', s: true, d: "Mur de force invisible et indestructible (10 m de portée, 5 m de haut, 10 m de long) ou hémisphère de 3 m de rayon centré sur lui, pendant CHA minutes. Rien ne le traverse, sauf les attaques mentales et les téléportations." }
    ]}
  ]
};

COF.PROFILS.forgesort = {
  id: 'forgesort', nom: 'Forgesort', famille: 'mage', pv: 3,
  caracs: ['INT', 'VOL', 'CON'], magie: 'INT',
  resume: "Un magicien et artisan qui crée des élixirs ou inscrit des runes.",
  armes: "La dague, le bâton, le marteau et l'arbalète légère.",
  armureMax: 'cuir', bouclier: false,
  armuresTexte: "Jusqu'au cuir simple. Bouclier interdit.",
  equipDepart: [
    { nom: 'Dague', type: 'contact', ref: 'dague' },
    { nom: 'Bâton ferré', type: 'contact', ref: 'batonferre' },
    { nom: 'Marteau', type: 'contact', ref: 'marteau' }
  ],
  voies: [
    { id: 'artefacts', nom: 'Voie des artefacts', caps: [
      { r: 1, n: 'Bâton de mage', dmg: '1d4°+INT', d: "Avec son bâton, inflige [1d4° + INT] DM magiques. À partir du rang 3, en action limitée, il peut utiliser sa valeur d'attaque magique pour attaquer au contact et infliger [2d4° + INT] DM." },
      { r: 2, n: 'Ouverture - fermeture', a: 'M', s: true, d: "Ouvre une porte fermée à clef (attaque magique contre la difficulté de crochetage) ou scelle une porte/un coffre pour INT minutes (+5 en solidité et RD). Permanent au rang 4 en sacrifiant une gemme de 100 pa et 10 min de rituel." },
      { r: 3, n: 'Sac sans fond', d: "Sac magique contenant 50 kg par rang tout en pesant 1 kg. 1×/heure, en tire des objets d'une valeur totale ≤ 25 pa qui disparaissent au bout d'une heure. Ne fonctionne pas sur le vivant." },
      { r: 4, n: 'Frappe des arcanes', a: 'A', s: true, dmg: '3d4°+INT', d: "Onde dévastatrice dans un rayon de 10 m : [3d4° + INT] DM automatiques et test de FOR difficulté [10 + INT] pour ne pas être renversé." },
      { r: 5, n: 'Artefact étrange', a: 'L', f: 'jour', d: "Crée un artefact personnel permettant d'utiliser 1×/jour chacune : Téléportation, Interruption du temps, Forme éthérée, Prescience. À chaque usage, lancez 1d6 : sur 1-2 l'artefact tombe en panne jusqu'à réparation (récupération rapide)." }
    ]},
    { id: 'elixirs', nom: 'Voie des élixirs', caps: [
      { r: 1, n: 'Fortifiant', a: 'L', t: 'soin', dmg: '1d4°', comp: "alchimie, chimie, identifier une potion", bon: '2+rang', d: "Breuvage qui rend 1d4° PV et donne un dé bonus aux 3 prochains tests dans les 30 min." },
      { r: 2, n: 'Feu grégeois', a: 'L', dmg: '2d4°', d: "Fiole lancée à 10 m (réussite automatique) : explose dans 3 m pour 2d4° DM (3d4° au rang 4, 4d4° au rang 5). Test d'AGI difficulté [10 + INT] pour moitié DM." },
      { r: 3, n: 'Élixir de guérison', a: 'L', t: 'soin', dmg: '2d4°+INT', d: "Élixir soignant [2d4° + INT] PV au bout d'une minute, ou guérissant instantanément un empoisonnement." },
      { r: 4, n: 'Élixirs mineurs', a: 'L', choix: true, d: "Prépare des élixirs parmi Forme gazeuse, Maîtrise des éléments, Chute ralentie (magicien) et Masque mortuaire (sorcier) : un nombre égal à son INT (max 4)." },
      { r: 5, n: 'Élixirs majeurs', a: 'L', choix: true, d: "Prépare des élixirs parmi Invisibilité, Vol, Accélération (magicien) et Masque du prédateur (druide) : un nombre égal à son INT (max 4). Ces préparations comptent double." }
    ]},
    { id: 'metal', nom: 'Voie du métal', caps: [
      { r: 1, n: 'Morsure de la forge', a: 'M', s: true, comp: 'orfèvrerie, forge', bon: '2+rang', d: "Enflamme son bâton ou son marteau pendant INT minutes : +2 DM de feu au contact (+1 par rang 4 atteint dans une voie de forgesort). S'éteint s'il lâche l'arme." },
      { r: 2, n: 'Métal brûlant', a: 'M', s: true, dmg: '1d4°', d: "Test opposé d'attaque magique (20 m) : chauffe un objet métallique porté pendant [1d4 + INT] rounds. Arme : 1 DM/round et -2 en attaque. Armure : 1d4° DM/round (action limitée pour s'en débarrasser)." },
      { r: 3, n: 'Magnétisme', a: 'A', s: true, d: "Pendant INT minutes : +2 en DEF contre les armes métalliques et DM des projectiles à pointe métallique divisés par deux." },
      { r: 4, n: 'Métal hurlant', a: 'A', s: true, dmg: '3d4°', d: "Test opposé d'attaque magique (10 m) : déforme un équipement métallique. Arme inutilisable, armure imposant un dé malus en attaque et en AGI. Objet magique : 1 round seulement. Sur une structure : 3d4° DM en divisant sa RD par deux." },
      { r: 5, n: 'Endurer', d: "Divise par deux les DM de feu subis, +1 en CON, dé bonus aux tests de CON, et ajoute sa CON à son total de PM." }
    ]},
    { id: 'golem', nom: 'Voie du golem', caps: [
      { r: 1, n: 'Grosse tête', comp: 'bricolage, science', bon: '2+rang', d: "Peut faire un test d'INT au lieu d'un test de FOR. Au niveau 1, peut ajouter son INT à ses PV plutôt que sa CON." },
      { r: 2, n: 'Golem', dmg: '1d4°+1', d: "Serviteur et garde du corps : DEF [10 + rang], PV [niveau × 5], Init. du forgesort, attaque = attaque magique, DM 1d4°+1. AGI -1, CON +10, FOR +1, PER -3, CHA -4, INT -3, VOL +4. Ordres simples uniquement. Réparation : [1d6 par rang + INT] PV par heure." },
      { r: 3, n: 'Protecteur', a: 'G', f: 'round', d: "1×/round, au contact d'un personnage, le golem s'interpose et subit les DM d'une attaque à sa place." },
      { r: 4, n: 'Statuette', a: 'A', s: true, d: "Transforme le golem en statuette (RD 10, inactive). Une action de mouvement pour le jeter au sol et lui rendre sa taille et ses fonctions." },
      { r: 5, n: 'Golem supérieur', choix: true, d: "Améliore le golem (une option de plus par rang 5 atteint dans une voie de forgesort) : Armure (+5 DEF), Félin (+3 AGI et DEF), Baliste (20 m, 1d4°+AGI), Grande taille (+2 PV/niveau, +1 FOR et DM), Vol (sauts de 40 m), Cerveau amélioré (+2 INT/PER/CHA, parole), Puissant (+2 FOR et DM), Arme à deux mains (+1d4° DM)." }
    ]},
    { id: 'runes', nom: 'Voie des runes', caps: [
      { r: 1, n: 'Runes de défense', d: "+2 en DEF (+1 au rang 3, +1 au rang 5). Peut inscrire les runes sur son golem avec le même effet. Nécessite au moins +1 en INT." },
      { r: 2, n: 'Rune de puissance', a: 'L', s: true, f: 'combat', d: "Enchante une arme pour 24 h. 1×/combat, elle inflige les DM maximaux sur une attaque (les dés bonus ne sont pas maximisés). À annoncer avant de lancer les dés." },
      { r: 3, n: 'Rune de protection', a: 'A', s: true, f: 'jour', d: "Enchante une armure pour 24 h. 1×/jour, ignore les DM d'une attaque (DM normaux s'il s'agit d'un critique). Activation en action gratuite, avant de connaître les DM." },
      { r: 4, n: "Rune d'énergie", a: 'A', s: true, f: 'combat', d: "Enchante un bijou pour 24 h. 1×/combat : un d20 bonus sur un test d'attaque ou de caractéristique au choix, au moment de l'utilisation." },
      { r: 5, n: 'Rune de garde', s: true, dmg: '3d4°+INT', d: "Rituel de 10 min : protège une zone de 10 m de diamètre (ou une porte/un coffre) pendant 12 h. Effet au choix quand une créature y pénètre — Alarme (étourdi 1 round, test de CON difficulté 15) ou Feu [3d4° + INT] DM (autre élément possible). Coût fixe : 3 PM." }
    ]}
  ]
};

COF.PROFILS.magicien = {
  id: 'magicien', nom: 'Magicien', famille: 'mage', pv: 3,
  caracs: ['INT', 'VOL', 'AGI'], magie: 'INT',
  resume: "Un intellectuel qui pratique une magie académique efficace et directe.",
  armes: "La dague et le bâton.",
  armureMax: 'aucune', bouclier: false,
  armuresTexte: "Aucune armure, aucun bouclier.",
  equipDepart: [
    { nom: 'Bâton ferré', type: 'contact', ref: 'batonferre' },
    { nom: 'Dague', type: 'contact', ref: 'dague' },
    { nom: 'Grimoire de sorts', type: 'objet' }
  ],
  voies: [
    { id: 'arcanes', nom: 'Voie de la magie des arcanes', caps: [
      { r: 1, n: 'Projectile de mana', a: 'A', s: true, dmg: '1d4°', d: "Cible visible à moins de 30 m : 1d4° DM automatiques. Sur un résultat maximal, relancez le dé et ajoutez (une seule fois). +1 aux DM par rang 4 atteint dans une voie de magicien, jusqu'à un maximum égal à l'INT." },
      { r: 2, n: 'Lévitation', a: 'M', s: true, d: "Se déplace verticalement de 5 m vers le haut ou 10 m vers le bas par action de mouvement pendant INT minutes. Le vol stationnaire demande une action de mouvement." },
      { r: 3, n: 'Forme gazeuse', a: 'A', s: true, d: "Devient gazeux pendant 1 min : 5 m par action de mouvement au ras du sol, passe par les plus petits interstices, aucune capacité utilisable. Insensible aux armes ordinaires, mais pas à la magie ni aux armes magiques." },
      { r: 4, n: 'Accélération', a: 'A', s: true, dmg: '1d4°+INT', d: "Pendant [1d4° + INT] rounds : une action de mouvement supplémentaire immédiate puis à chaque round. Peut la sacrifier pour +3 en DEF pendant 1 round ou -1 PM sur un sort du round (cumulable avec la concentration)." },
      { r: 5, n: 'Désintégration', a: 'A', s: true, dmg: '5d4°+INT', d: "Rayon de 20 m : attaque magique contre la DEF pour [5d4° + INT] DM. Réduit les objets normaux (≤ 100 kg) en poussière (dé malus s'il vise un objet porté). Une créature réduite à 0 PV est désintégrée." }
    ]},
    { id: 'destructrice', nom: 'Voie de la magie destructrice', caps: [
      { r: 1, n: 'Arc de feu', a: 'A', s: true, dmg: '1d4°+INT', d: "Jusqu'à 3 cibles au contact : [1d4° + INT] DM, moitié sur un test d'AGI difficulté [10 + INT] réussi. Les DM passent à 2d4° au rang 4." },
      { r: 2, n: 'Saper les forces', a: 'A', s: true, d: "Test opposé d'attaque magique contre une cible vivante à 10 m : -2 à ses tests de FOR, d'attaque au contact et aux DM jusqu'à la fin du combat. Non cumulable." },
      { r: 3, n: 'Flèche de feu', a: 'A', s: true, dmg: '3d4°+INT', d: "Cible à moins de 30 m, attaque magique contre la DEF : [3d4° + INT] DM, puis 1d6 DM de feu chaque round suivant (le sort prend fin sur un résultat de 1 ou 2). Non cumulable." },
      { r: 4, n: 'Explosion de feu', a: 'A', s: true, dmg: '4d4°+INT', d: "Point à moins de 30 m : toutes les créatures dans 5 m (alliés compris) subissent [4d4° + INT] DM, moitié sur un test d'AGI difficulté [10 + INT] réussi." },
      { r: 5, n: 'Appel de la foudre', a: 'A', s: true, dmg: '2d4°+INT', d: "Traits de foudre sur toutes les cibles choisies dans un rayon de 10 m : un seul test d'attaque magique, [2d4° + INT] DM d'électricité à celles dont il atteint la DEF." }
    ]},
    { id: 'elementaire', nom: 'Voie de la magie élémentaire', caps: [
      { r: 1, n: 'Asphyxie', a: 'A', s: true, dmg: '1d4°', d: "Test opposé d'attaque magique (20 m) : la cible étouffe et subit 1d4° DM par round pendant INT rounds. Les créatures qui ne respirent pas sont immunisées ; les RD ne s'appliquent pas." },
      { r: 2, n: 'Maîtrise des éléments', a: 'M', s: true, d: "Retranche rang + 2 à tous les DM de feu, froid, électricité ou acide subis pendant INT minutes. Peut échanger un élément contre un autre dans ses sorts." },
      { r: 3, n: 'Arme élémentaire', a: 'A', s: true, t: 'bonus', dmg: '1d4°', d: "Enchante une arme pour INT minutes : +1d4° DM de feu, froid, électricité ou acide. (A) pour sa propre arme, (L) pour celle d'autrui. Tant qu'il la tient, les sorts de cet élément coûtent 1 PM de moins." },
      { r: 4, n: 'Respiration aquatique', a: 'A', s: true, d: "Respire sous l'eau pendant 10 minutes. Extensible à un compagnon par point d'INT." },
      { r: 5, n: 'Armure de pierre', a: 'A', s: true, d: "Pendant INT minutes, retranche 5 points à tous les DM subis. Le sort s'achève après avoir absorbé [niveau × 3] DM. Cumulable avec Maîtrise des éléments, incompatible avec Déphasage." }
    ]},
    { id: 'protectrice', nom: 'Voie de la magie protectrice', caps: [
      { r: 1, n: 'Armure de mana', a: 'M', s: true, d: "Pendant INT minutes : +3 en DEF (+4 au rang 3, +1 de plus par rang 5 atteint dans une voie de magicien ou dans la voie du mage). Ne se cumule jamais avec une armure." },
      { r: 2, n: 'Chute ralentie', a: 'G', s: true, d: "Désigne jusqu'à INT cibles (dont lui) à 10 m, même hors de son tour : elles chutent de n'importe quelle hauteur sans DM. Chute inattendue : test d'INT difficulté 15 par compagnon." },
      { r: 3, n: 'Déphasage', a: 'A', s: true, dmg: '1d4°+INT', d: "Pendant [1d4° + INT] rounds, tous les DM des attaques au contact et à distance qu'il subit et inflige sont divisés par 2 (pas les DM de sorts). Incompatible avec Armure de pierre." },
      { r: 4, n: 'Cercle de protection', a: 'A', s: true, f: 'round', d: "Cercle de 2 m protégeant INT personnes. 1×/round, quand un sort vise un protégé : test opposé d'attaque magique pour l'annuler. Les créatures invoquées et les morts-vivants subissent un dé malus pour attaquer dans le cercle. Dissipé s'il en sort." },
      { r: 5, n: 'Interruption du temps', a: 'A', s: true, d: "INT rounds complets hors du temps, durant lesquels il ne peut utiliser que ses propres sorts, objets et capacités sur lui-même, sans se déplacer ni interagir avec l'environnement." }
    ]},
    { id: 'universelle', nom: 'Voie de la magie universelle', caps: [
      { r: 1, n: 'Lumière', a: 'L', s: true, f: 'combat', d: "Un objet à 10 m éclaire dans un rayon de 10 m pendant INT heures (sans chaleur). 1×/combat, lancé sur les yeux d'une créature de NC ≤ rang : test opposé d'attaque magique pour l'aveugler 1 round." },
      { r: 2, n: 'Familier', a: 'A', s: true, dmg: '1d4°', d: "Petit animal lié : partage ses sens, communication illimitée, +2 en Initiative et en DEF quand il est en vue. DEF [13 + rang], PV [niveau du magicien]. À 0 PV il disparaît et le magicien perd 1d4° PV ; réinvocable après une récupération complète." },
      { r: 3, n: 'Invisibilité', a: 'A', s: true, dmg: '1d4°+INT', d: "Invisible pendant [1d4° + INT] minutes : indétectable et inattaquable directement. Attaquer met fin au sort. Au rang 5, peut le lancer sur un allié (action limitée)." },
      { r: 4, n: 'Vol', a: 'A', s: true, dmg: '2d4°+INT', d: "Vole pendant [2d4° + INT] minutes à sa vitesse au sol. Le vol stationnaire est une action gratuite." },
      { r: 5, n: 'Téléportation', a: 'L', s: true, f: 'jour', d: "1×/jour : réapparaît à moins de [niveau × INT] km, dans un lieu en vue ou parfaitement connu. Emmène un allié à partir du niveau 10, un de plus aux niveaux 13, 16 et 19." }
    ]}
  ]
};

COF.PROFILS.sorcier = {
  id: 'sorcier', nom: 'Sorcier', famille: 'mage', pv: 3,
  caracs: ['INT', 'VOL', 'CON'], magie: 'INT',
  resume: "Un adepte de la magie noire qui contrôle les morts et les démons.",
  armes: "La dague et le bâton.",
  armureMax: 'aucune', bouclier: false,
  armuresTexte: "Aucune armure, aucun bouclier (sauf l'armure d'os de la voie de l'outre-tombe).",
  equipDepart: [
    { nom: 'Bâton ferré', type: 'contact', ref: 'batonferre' },
    { nom: 'Dague', type: 'contact', ref: 'dague' },
    { nom: 'Grimoire ou parchemins anciens', type: 'objet' }
  ],
  voies: [
    { id: 'demon', nom: 'Voie du démon', caps: [
      { r: 1, n: 'Malédiction', a: 'M', s: true, f: 'combat', d: "Test opposé d'attaque magique (20 m) : dé malus au prochain test de la victime — ou à ses 3 prochains tests si l'incantation était une action limitée (L). Une fois par combat et par cible." },
      { r: 2, n: 'Beauté de la succube', a: 'L', s: true, dmg: '1d4°+INT', d: "Pendant INT minutes : dé bonus aux tests de CHA et attaque de contact par attaque magique (contre DEF) infligeant [1d4° + INT] DM. Le sorcier récupère autant de PV que la cible en perd." },
      { r: 3, n: 'Pacte démoniaque', a: 'G', dmg: '1d4°', d: "Sacrifie 1d4° PV pour +INT sur un d20 déjà lancé ou en DEF contre une attaque. De plus, ajoute sa VOL à son nombre de dés de récupération." },
      { r: 4, n: 'Aspect du démon', a: 'A', s: true, dmg: '1d4°+INT', d: "Pendant INT minutes : dé bonus en attaque au contact, +5 en DEF et à tous les tests physiques, vol de 10 m par action de mouvement. Deux attaques de griffes [1d4° + INT] DM en action limitée (une seule en action d'attaque). Aucune arme utilisable." },
      { r: 5, n: "Invocation d'un démon", a: 'L', s: true, dmg: '2d4°+5', d: "Sacrifie 1d4° PV pour invoquer un démon pendant INT minutes : DEF 18, PV [niveau × 5], Init. du sorcier, attaque = attaque magique, DM 2d4°+5. Vole, divise par deux les DM non magiques. Deux attaques par tour (L) au niveau 15." }
    ]},
    { id: 'mort', nom: 'Voie de la mort', caps: [
      { r: 1, n: 'Siphon des âmes', f: 'round', d: "1×/round, quand un humanoïde vivant meurt à moins de 20 m : récupère NC PV (minimum 1). À partir du rang 3, si le NC est supérieur à 4, il peut récupérer 1 PM à la place." },
      { r: 2, n: 'Masque mortuaire', a: 'M', s: true, d: "Pendant INT minutes, passe pour non-vivant : immunisé à la plupart des pouvoirs des morts-vivants qui le prennent pour l'un des leurs, DM de froid divisés par deux. Aucun soin possible pendant la durée." },
      { r: 3, n: 'Baiser du vampire', a: 'A', s: true, dmg: '2d4°+INT', d: "Test opposé d'attaque magique (30 m) : [2d4° + INT] DM et le sorcier récupère autant de PV (sans dépasser son maximum)." },
      { r: 4, n: 'Peur', a: 'A', s: true, d: "Test opposé d'attaque magique (20 m) : la victime fuit pendant INT rounds (1 round seulement si son NC ≥ niveau du sorcier). En action limitée (L), affecte toutes les créatures à son contact (un test chacune)." },
      { r: 5, n: 'Briser les cœurs', a: 'A', s: true, f: 'combat', dmg: '5d4°+INT', d: "Test opposé d'attaque magique contre une cible vivante (20 m) : [5d4° + INT] DM, moitié en cas d'échec. Une seule fois par combat et par cible." }
    ]},
    { id: 'outretombe', nom: "Voie de l'outre-tombe", caps: [
      { r: 1, n: 'Un pied dans la tombe', a: 'A', s: true, dmg: '1d4°+INT', d: "Test opposé d'attaque magique (10 m) contre une cible vivante : [1d4° + INT] DM et état ralenti 1 round si elle rate un test de CON difficulté 10." },
      { r: 2, n: "Armure d'os", d: "Porte une armure d'os : +3 en DEF sans empêcher les capacités de sorcier (+1 par rang 4 atteint dans une voie de sorcier). À confectionner soi-même et entretenir 10 min par jour." },
      { r: 3, n: 'Animation des morts', a: 'L', s: true, dmg: '1d4°+2', d: "Anime le cadavre d'un humanoïde mort depuis moins d'INT jours : DEF 10, PV [10 + niveau], Init. 8, attaque = attaque magique, DM 1d4°+2, déplacement 5 m. Un zombie, plus un par rang 5 atteint dans une voie de sorcier." },
      { r: 4, n: 'Ensevelissement', a: 'L', s: true, f: 'combat', dmg: '2d4°', d: "1×/combat, test opposé d'attaque magique (20 m) : la cible est enterrée vivante, subit 2d4° DM par round, ne peut ni agir ni être ciblée. Sortie : test de FOR ou d'AGI difficulté 15 (action limitée ; +2 par aide, max +10)." },
      { r: 5, n: 'Armée des morts', a: 'L', s: true, f: 'jour', dmg: '2d4°', d: "1×/jour : des squelettes émergent pendant [niveau] rounds. Tous les adversaires dans un rayon de 10 m subissent automatiquement 2d4° DM par round et tous les déplacements dans la zone sont divisés par deux." }
    ]},
    { id: 'sang', nom: 'Voie du sang', caps: [
      { r: 1, n: 'Saignements', a: 'A', s: true, dmg: '1d4°', d: "Attaque magique (10 m) contre une difficulté de [10 + CON de la cible] : la victime saigne et subit 1d4° DM par round pendant INT rounds." },
      { r: 2, n: 'Sang mordant', a: 'M', s: true, dmg: '1d4°', d: "Pendant INT minutes, son sang devient acide : tout ennemi au contact qui le blesse subit 1d4° DM d'acide." },
      { r: 3, n: 'Exsangue', d: "+2 en DEF (+3 au rang 5 ; -1 s'il porte une armure autre que l'armure d'os). À 0 PV, il peut continuer d'agir avec un dé malus à tous ses tests, jusqu'à subir au moins 1 DM de plus." },
      { r: 4, n: 'Rituel de sang', a: 'A', s: true, dmg: '1d4°', d: "Sacrifie 1d4° PV pour cibler une créature vivante (20 m) : pendant INT rounds, tous les DM tranchants ou perforants qu'elle subit augmentent de +1d4°." },
      { r: 5, n: 'Lien de sang', a: 'A', s: true, d: "Test opposé d'attaque magique (20 m) : pendant INT minutes, la moitié des DM reçus par le sorcier sont aussi subis par la cible (sans réduire les siens) et il peut lui lancer un sort sans la voir." }
    ]},
    { id: 'sombremagie', nom: 'Voie de la sombre magie', caps: [
      { r: 1, n: 'Ténèbres', a: 'L', s: true, comp: 'savoirs sombres (démons, morts-vivants, rituels impies)', bon: '2+rang', d: "Zone fixe de ténèbres magiques de 10 m de diamètre à 20 m, pendant INT minutes : toutes les créatures y sont aveuglées, même celles qui voient dans le noir." },
      { r: 2, n: 'Reptation', a: 'M', s: true, d: "Pendant INT minutes, rampe de 5 m par action de mouvement sur les murs et les plafonds. Peut lancer ses sorts dans cette posture." },
      { r: 3, n: 'Strangulation', a: 'A', s: true, dmg: '1d4°+INT', d: "Test opposé d'attaque magique (20 m) : la victime subit un dé malus à tous ses tests et [1d4° + INT] DM par round tant qu'il maintient sa concentration (action de mouvement + 1 PM par round)." },
      { r: 4, n: "Manteau d'ombre", a: 'L', s: true, dmg: '1d4°', d: "Pendant INT minutes : dé bonus en discrétion, dé malus aux attaques à distance qui le visent. À 0 PV, il peut disparaître dans son ombre et réapparaître à 1d6 km avec 1d4° PV, 1d6 min plus tard (une fois par jour)." },
      { r: 5, n: 'Pacte ténébreux', t: 'bonus', dmg: '2d4°', d: "+1 en CON, dé bonus aux tests de CON, vision dans le noir comme en pénombre. En lançant un sort, peut sacrifier 1d4° PV pour +2d4° aux DM (chaque round pour les DM sur la durée)." }
    ]}
  ]
};
