/* ============================================================
   COF2 Compagnon — Voies de domaine de prêtre
   (Compagnon du joueur, chapitre 6) : une voie par divinité.
   Elles s'utilisent comme la voie du mage : elles remplacent la
   voie de peuple (le rang 1 conserve la capacité de peuple de
   rang 1 et y ajoute un bonus de compétence). Le prêtre qui
   choisit sa voie de domaine renonce à sa capacité divine de
   prêtre spécialiste. Clé de voie : « domaine.<id> ».
   Les sorts (*) de ces voies sont indexés sur le CHA.
   ============================================================ */
window.COF = window.COF || {};

COF.DOMAINES_NOTE = "Option des prêtres : remplacer la voie de peuple par la voie de domaine de sa divinité (comme la voie du mage). Le rang 1 conserve la capacité de peuple de rang 1 ; les rangs suivants remplacent ceux de la voie de peuple. Le prêtre renonce alors à sa capacité divine de prêtre spécialiste (il récupère la capacité normale qu'elle remplaçait).";

function _rang1(id, nom, comp, extra) {
  return { r: 1, n: 'Capacité de peuple + ' + nom, comp: comp, bon: '2+rang',
    d: "Conserve la capacité de rang 1 de sa voie de peuple. Ajoute rang + 2 aux tests indiqués." + (extra ? ' ' + extra : '') };
}

COF.DOMAINES = {

  arcanna: { id: 'arcanna', nom: "Voie d'Arcanna", dieu: 'Arcanna, déesse de la magie blanche', arme: 'bâton', caps: [
    _rang1('arcanna', 'occultisme', 'connaissance et érudition liées à la magie'),
    { r: 2, n: 'Maîtrise de la magie', a: 'L', s: true, d: "Détecte la magie (objets compris) dans un rayon de 10 m ; test d'INT difficulté [10 + rang du sort] pour en connaître la fonction générale. Peut dissiper un sort non permanent d'un rang qu'il sait lancer (test opposé d'attaque magique contre son auteur)." },
    { r: 3, n: 'Tour de magie', a: 'G', s: true, d: "Un tour de magie par round (10 m) en action gratuite, sans PM ni DM direct, sans effort supérieur à une caractéristique de 0. +2 PM supplémentaires (3 PM en tout en apprenant ce sort)." },
    { r: 4, n: 'Maître de magie', choix: true, choixVoie: { familles: ['mage'], rangMax: 2, sorts: true }, d: "Acquiert deux sorts de rang 1 et deux sorts de rang 2 de la famille des mages (+4 PM), lancés comme des sorts de prêtre (armures de prêtre autorisées)." },
    { r: 5, n: 'Absorber la magie', f: 'round', d: "1×/round, quand un sort est lancé à 10 m (pas par lui) : récupère autant de PV que le rang du sort, ou ajoute ce rang à un test de son prochain tour. Capacité de créature sans rang : moitié de son NC." }
  ]},

  arshran: { id: 'arshran', nom: "Voie d'Arshran", dieu: 'Arshran, dieu du feu et des forgerons', arme: 'marteau', caps: [
    _rang1('arshran', 'forgeron', 'forge (règles d’artisanat)'),
    { r: 2, n: 'Métal brûlant', a: 'M', s: true, dmg: '1d4°', d: "Test opposé d'attaque magique (20 m) : un objet métallique de la cible chauffe pendant [1d4 + CHA] rounds. Arme : 1 DM par round et -2 en attaque. Armure : 1d4° DM par round ; l'enlever demande une action limitée (perte du bonus de DEF)." },
    { r: 3, n: 'Armure de feu', a: 'M', s: true, dmg: '1d4°', d: "Aura de flammes pendant [CHA] minutes : immunisé au feu ; tout attaquant qui le blesse avec une arme subit 1d4° DM de feu (2d4° avec une arme naturelle)." },
    { r: 4, n: 'Marteau des mondes', a: 'L', s: true, f: 'combat', dmg: '3d4°', d: "1×/combat, avec un marteau ou un marteau de guerre : +5 en attaque et +3d4° DM ; la cible fait un test de FOR difficulté [5 + niveau] sinon renversée ; une cible de taille moyenne ou inférieure est projetée à 1d4° m et subit autant de DM en plus." },
    { r: 5, n: 'Rune de feu', a: 'L', s: true, dmg: '1d4°', d: "Grave une rune de feu sur une arme par point de CHA positif : chacune inflige +1d4° DM de feu (dé selon le niveau du prêtre) pendant 6 h." }
  ]},

  arwendee: { id: 'arwendee', nom: "Voie d'Arwendée", dieu: 'Arwendée, déesse de la chasse et des archers', arme: 'arcs courts et longs', caps: [
    _rang1('arwendee', 'chasseur', 'chasse (pister les animaux inclus)'),
    { r: 2, n: 'Tir parabolique', d: "+20 m de portée avec les arcs." },
    { r: 3, n: 'Instinct du chasseur', d: "Désigne une proie (un type de créature, pas un individu) : dé bonus pour la pister ; en se concentrant 1 round, connaît la direction de la plus proche. Changement de proie après une récupération complète." },
    { r: 4, n: 'Protection contre les projectiles', a: 'A', s: true, d: "RD 10 contre tous les projectiles pendant [CHA] minutes ; ou RD 5 pour un allié au contact." },
    { r: 5, n: 'Carquois du chasseur', a: 'A', s: true, dmg: '1d4°', d: "Pendant [CHA] minutes, ses flèches sont magiques et infligent +1d4° DM aux animaux (même géants) et à sa proie d'Instinct du chasseur." }
  ]},

  aurilla: { id: 'aurilla', nom: "Voie d'Aurilla", dieu: 'Aurilla, déesse de la chance et des aventuriers', arme: 'épée courte', caps: [
    _rang1('aurilla', 'joueur', 'jeux de dés ou de cartes'),
    { r: 2, n: 'Boussole', d: "Connaît toujours intuitivement la direction du nord." },
    { r: 3, n: "Bénédiction d'Aurilla", f: 'jour', d: "Chaque jour, 1 PC supplémentaire non décompté de ses PC, renouvelé après une récupération complète ; peut le dépenser sur l'action d'un allié en vue." },
    { r: 4, n: 'Détection des pièges', a: 'A', s: true, d: "Pendant [CHA] minutes, détecte tous les pièges en vue à 10 m (mécaniques : aura bleue ; magiques : rouge). En permanence, face à un piège insoupçonné : 1d6, sur 1-2 il ne se déclenche pas." },
    { r: 5, n: 'Cheminement', a: 'A', s: true, d: "Pendant [CHA] minutes, trouve le chemin le plus court ou le moins dangereux vers la sortie (ou un lieu désigné) d'un labyrinthe, souterrain ou bâtiment." }
  ]},

  axender: { id: 'axender', nom: "Voie d'Axënder", dieu: "Axënder, dieu du devoir et de l'honneur", arme: 'épée longue', caps: [
    _rang1('axender', 'statut', 'rendre sa parole crédible'),
    { r: 2, n: "Protection d'Axënder", f: 'round', d: "1×/round, réduit de 1 par rang les DM de la première attaque d'arme à distance qui le touche." },
    { r: 3, n: 'Juste rétribution', a: 'A', s: true, dmg: '2d4°', d: "Pendant 12 h, qui l'attaque par surprise, dans le dos ou avec des DM d'attaque sournoise est frappé par la foudre : 2d4° DM (test d'AGI difficulté [12 + CHA] pour moitié)." },
    { r: 4, n: "Bénédiction d'Axënder", d: "La Protection d'Axënder s'applique aussi aux sorts lancés à distance (Explosion de feu, mais pas Arc de feu)." },
    { r: 5, n: "Rage d'Axënder", dmg: '1d4°', d: "Tant qu'il est attaqué par des adversaires en surnombre (déshonorant), +1d4° DM au contact (jusqu'à 3 créatures de taille petite n'est pas un surnombre ; plus petites : ignorées)." }
  ]},

  basile: { id: 'basile', nom: 'Voie de Basile le gourmand', dieu: 'Basile, dieu de la gourmandise et de la cuisine', arme: 'gourdin (rouleau à pâtisserie)', caps: [
    _rang1('basile', 'cuisinier', 'cuisine, trouver des herbes aromatiques, détecter un poison dans les aliments'),
    { r: 2, n: 'De bon goût', a: 'A', s: true, d: "Épices invoquées rendant délicieux un repas par personne et par niveau (pas plus nourrissants). Les créatures d'INT ≤ -1 se battent pour en avoir davantage." },
    { r: 3, n: 'Sieste sacrée', f: 'jour', d: "1×/jour, une sieste d'une demi-heure l'après-midi vaut une récupération complète (mana récupéré une seule fois par jour)." },
    { r: 4, n: 'Biscuits', a: 'A', s: true, t: 'soin', d: "Invoque 1d4° biscuits (12 h) rendant chacun [DR + ½ niveau] PV en 1 min. Plus d'un par jour : test de CON difficulté [5 + 5 par biscuit] sinon ralenti jusqu'à une récupération rapide (dé bonus pour le prêtre)." },
    { r: 5, n: 'Bonne santé de Basile', d: "Immunisé aux poisons et aux maladies ; peut manger n'importe quoi (pas trop dur). +1 en CON." }
  ]},

  ceres: { id: 'ceres', nom: 'Voie de Céres', dieu: "Céres, dieu de l'agriculture et du travail", arme: 'faux et fléau', caps: [
    _rang1('ceres', 'travailleur', 'résister à la fatigue lors de travaux difficiles'),
    { r: 2, n: 'Force de travail', a: 'A', s: true, f: 'jour', d: "1×/jour, pendant [CHA] heures, lui ou une cible au contact travaille comme quatre (dégager un éboulement…). Ensuite, manger comme quatre ou -2 à tous les tests pendant 24 h." },
    { r: 3, n: 'Croissance végétale', a: 'A', s: true, d: "En milieu naturel, zone de 20 m de côté par rang (20 m) pendant [CHA] heures : déplacements divisés par deux (sauf tailles énorme/colossale et Terrain difficile). Ou une créature végétale : +2 en attaque, DEF et DM pendant [CHA] minutes." },
    { r: 4, n: 'Constitution héroïque', d: "+1 en CON et dé bonus aux tests de CON." },
    { r: 5, n: 'Banquet', a: 'A', s: true, f: 'jour', d: "1×/jour, banquet pour autant de convives que son niveau : rassasiés 24 h ; les halfelins récupèrent 1d4° PV." }
  ]},

  denora: { id: 'denora', nom: 'Voie de Dénora', dieu: 'Dénora, déesse de la compassion et de la guérison', arme: 'bâton', caps: [
    _rang1('denora', 'empathie', "empathie et convaincre un auditoire de renoncer à la violence"),
    { r: 2, n: 'Soins efficaces', d: "Sur ses sorts de soins, chaque 1 obtenu sur un dé compte comme le résultat maximal." },
    { r: 3, n: 'Supporter la douleur', a: 'A', s: true, d: "Au toucher, suspend un état préjudiciable de la cible pendant [CHA] heures au plus (il reprend ensuite s'il dure encore)." },
    { r: 4, n: 'Perception héroïque', d: "+1 en PER et dé bonus aux tests de PER." },
    { r: 5, n: 'Partager la douleur', a: 'A', s: true, t: 'soin', dmg: '1d4°', d: "Cercle de [CHA] alliés se tenant la main : chacun récupère 1d4° PV ; au round suivant, ils redistribuent librement leurs PV entre eux (total inchangé)." }
  ]},

  ellona: { id: 'ellona', nom: "Voie d'Ellona", dieu: 'Ellona, déesse de la perception et de la vérité', arme: 'arc court', caps: [
    _rang1('ellona', 'perceptif', 'PER liés à la vue'),
    { r: 2, n: 'Vision X', a: 'L', s: true, d: "Voit à travers une porte ou un mur d'1 m d'épaisseur au plus." },
    { r: 3, n: 'Compréhension intuitive', a: 'A', s: true, d: "Pendant [CHA] minutes, comprend le sens général de n'importe quelle langue parlée (sans la parler ni traduire de données complexes)." },
    { r: 4, n: 'Perception héroïque', d: "+1 en PER et dé bonus aux tests de PER." },
    { r: 5, n: 'Véritable nom', a: 'L', s: true, d: "Test opposé d'attaque magique (20 m) : apprend le nom magique de la créature et gagne +5 en attaque contre elle, de façon permanente (intransmissible)." }
  ]},

  forthur: { id: 'forthur', nom: 'Voie de Forthur', dieu: 'Forthur, dieu du courage et des exploits', arme: 'épée à deux mains', caps: [
    _rang1('forthur', 'sans peur', 'résister à la peur'),
    { r: 2, n: 'Puissance divine', a: 'M', s: true, d: "Lui ou un allié touché : +5 aux tests de FOR, d'AGI ou de CON (une seule) pendant [CHA] minutes ; efficacité -1 à chaque nouvelle utilisation sur la même personne dans la journée." },
    { r: 3, n: 'Taper du pied', a: 'L', s: true, dmg: '1d4°', d: "Rayon de 10 m : test d'AGI difficulté [10 + FOR] sinon renversé. En intérieur, chute de débris : 1d4° DM à tous (lui compris) ; structure instable : 1-3 sur 1d6, effondrement (3d4° DM, ensevelissement)." },
    { r: 4, n: 'Force héroïque', d: "+1 en FOR et dé bonus aux tests de FOR." },
    { r: 5, n: 'Coup de poing de Forthur', a: 'A', s: true, f: 'combat', dmg: '3d4°+FOR', d: "1×/combat, +5 en attaque à mains nues : [3d4° + FOR] DM et test de FOR difficulté 25 sinon renversé et étourdi 1 round." }
  ]},

  gaelm: { id: 'gaelm', nom: 'Voie de Gaëlm', dieu: 'Gaëlm, dieu des arts et des artistes', arme: 'rapière', caps: [
    _rang1('gaelm', 'artiste', 'arts (créer, interpréter ou analyser une œuvre)'),
    { r: 2, n: 'Bouche magique', a: 'L', s: true, d: "Peint une bouche qui récite un message de [CHA] minutes quand une condition est remplie (passage à 3 m ou contact, individu ou type de créature) ; dure 24 h, une fois ou à répétition. Rang 5 : permanente (rituel de 24 h, 1 000 pa)." },
    { r: 3, n: 'Peinture vivante', a: 'L', s: true, d: "Peint une créature déjà rencontrée, de NC inférieur au rang (NC 2 au rang 3, 4 au rang 5) : elle s'anime au round suivant et le sert pendant [CHA] minutes, avec la moitié des PV de l'original." },
    { r: 4, n: 'Peinture fascinante', a: 'A', s: true, d: "Tableau hypnotique : les créatures à 20 m font un test de VOL difficulté [12 + CHA] sinon le contemplent pendant [CHA] minutes (se défendent si attaquées). Sans effet si NC ≥ niveau du prêtre." },
    { r: 5, n: 'Peinture véritable', a: 'A', s: true, d: "Peint un objet et s'en saisit : < 10 pa permanent ; < 100 pa [CHA] heures ; ≤ 1 000 pa [CHA] minutes ; ≤ 10 000 pa [CHA] rounds." }
  ]},

  gorom: { id: 'gorom', nom: 'Voie de Gorom', dieu: 'Gorom, dieu de la pierre et des architectes', arme: 'marteau', caps: [
    _rang1('gorom', 'architecte', 'architecture et taille de pierre'),
    { r: 2, n: 'Connaissance des lieux', a: 'L', s: true, d: "La main sur un mur, connaît intuitivement le plan du bâtiment (pas la fonction des pièces ni les passages secrets)." },
    { r: 3, n: 'Architecte', a: 'A', s: true, d: "Modifie un élément d'une bâtisse ordinaire au toucher (mur, porte, escalier…) pendant [CHA] minutes. Sans effet sur une structure magique." },
    { r: 4, n: 'Constitution héroïque', d: "+1 en CON et dé bonus aux tests de CON." },
    { r: 5, n: 'Tour de Gorom', a: 'A', s: true, d: "Fait surgir pour 12 h une tour de 6 m de côté sur 10 m de haut (2 étages, meurtrières, toit crénelé, porte en chêne barrée : solidité 25, RD 10). Les dégâts persistent d'une invocation à l'autre." }
  ]},

  guardal: { id: 'guardal', nom: 'Voie de Guardal', dieu: 'Guardal, dieu de la loyauté et des gardiens', arme: 'masse', caps: [
    _rang1('guardal', 'vigilant', 'monter la garde et repérer une embuscade'),
    { r: 2, n: 'Zone protégée', a: 'L', s: true, d: "Zone de 10 m de diamètre pendant 12 h : lui et les personnes désignées gagnent +2 en DEF, aux tests de résistance et de PER pour éviter la surprise, et sont immunisés aux attaques sournoises." },
    { r: 3, n: 'Lien du protecteur', a: 'A', s: true, d: "Se lie à une cible volontaire touchée : sait quand elle perd des PV et peut lui transférer ses propres PV en action gratuite." },
    { r: 4, n: 'Perception héroïque', d: "+1 en PER et dé bonus aux tests de PER." },
    { r: 5, n: 'Serment de protection', a: 'A', s: true, d: "Jure de protéger une créature touchée (un serment à la fois) : informé de ses blessures, télépathie, téléportation à ses côtés en action de mouvement. Rompre le serment : affaibli 24 h." }
  ]},

  hellion: { id: 'hellion', nom: 'Voie de Hellion', dieu: 'Hellion, dieu des voleurs et du pillage', arme: 'épée courte', caps: [
    _rang1('hellion', 'crapule', 'pickpocket'),
    { r: 2, n: 'Mains magiques', a: 'M', s: true, d: "Main invisible à 10 m pendant [CHA] minutes, utilisée comme sa propre main (arme de contact, vol à la tire, porte…) avec ses propres actions." },
    { r: 3, n: 'Détection de trésor', a: 'L', s: true, d: "Direction du trésor (> 100 pa) le plus proche, portée PER km ; 1 round de plus et test de PER difficulté 15 pour estimer la distance." },
    { r: 4, n: 'Agilité héroïque', d: "+1 en AGI et dé bonus aux tests d'AGI." },
    { r: 5, n: 'Passe-muraille', a: 'A', s: true, d: "Traverse un mur de [CHA] mètres d'épaisseur au plus en devenant brièvement intangible." }
  ]}
};

/* Suite : d'Irrion à Vorona */
Object.assign(COF.DOMAINES, {

  irrion: { id: 'irrion', nom: "Voie d'Irrion", dieu: "Irrion, dieu de l'ordre et de la noblesse", arme: 'épée longue', caps: [
    _rang1('irrion', 'séminaire', 'héraldique et tests sociaux auprès de la noblesse ou des forces de l’ordre'),
    { r: 2, n: 'Cérémonie', a: 'A', s: true, d: "Rituel matinal de 10 min : jusqu'à une personne par niveau peut relancer un dé de son choix dans les 24 h. Ou rituel d'1 h pour une occasion solennelle (mariage, serment, adoubement…) : la cible gagne 1 PC utilisable dans l'année." },
    { r: 3, n: "Sceau d'ordre", a: 'L', s: true, d: "Lui et ses alliés à 10 m, pendant [CHA] minutes : chacun peut sacrifier le sceau pour remplacer un d20 par 15 (même après avoir vu le résultat)." },
    { r: 4, n: "Marque d'Irrion", a: 'A', s: true, d: "Rituel de 10 min : nomme un meneur du groupe pour 24 h, qui gagne +1 à tous ses tests. Le prêtre doit suivre ses consignes, sinon le sort prend fin." },
    { r: 5, n: 'Impact de la foi', a: 'G', d: "Lors d'une attaque au contact, même après avoir vu le résultat : 1 PM pour un résultat de 10 au d20, ou 2 PM pour 15." }
  ]},

  jeweln: { id: 'jeweln', nom: 'Voie de Jeweln', dieu: 'Jeweln, dieu des souterrains et des mineurs', arme: 'pioche de guerre', caps: [
    _rang1('jeweln', 'mineur', 'orientation sous terre et géologie'),
    { r: 2, n: 'Vision de terre', a: 'L', s: true, d: "Pendant [CHA] minutes, pieds au sol : perçoit la géométrie des lieux à 10 m (même aveuglé) et la position et le poids approximatif de toute créature au contact du sol, même invisible." },
    { r: 3, n: 'Pioche de Jeweln', a: 'A', s: true, d: "Une arme touchée inflige double DM aux créatures et structures de pierre pendant [CHA] minutes." },
    { r: 4, n: 'Créature des souterrains', d: "Sous terre : +1 à tous ses tests et récupère naturellement ses PV (ou DR) deux fois plus vite." },
    { r: 5, n: 'Éboulement', a: 'A', s: true, dmg: '6d4°', d: "Dans un souterrain, éboulement de 5 m de diamètre (20 m) : 6d4° DM, test d'AGI difficulté 15 pour moitié. Un boyau de 3 m ou moins est obstrué (2 h de dégagement, divisées par le nombre de personnes)." }
  ]},

  linnarre: { id: 'linnarre', nom: 'Voie de Linnarré', dieu: 'Linnarré, déesse de la mer et des marins', arme: 'trident', caps: [
    _rang1('linnarre', 'marin', 'natation, pêche, navigation et manœuvres sur un bateau'),
    { r: 2, n: 'Sens de la mer', d: "À bord : connaît la direction de la terre la plus proche, jamais le mal de mer, et ajoute son CHA aux PV rendus par chaque DR." },
    { r: 3, n: 'Protection de Linnarré', a: 'L', s: true, d: "Incantation de 10 min, en mer, pendant [CHA] heures dans un rayon de [niveau] km : changer le sens du vent ou du courant, renforcer/affaiblir le vent ou la houle de 1 à 2 niveaux. Tempête magique : seul son navire est protégé." },
    { r: 4, n: 'Comme un poisson', a: 'A', s: true, d: "Pendant [CHA] heures, respire sous l'eau et combat dans l'eau sans pénalité." },
    { r: 5, n: 'Maître des ports', d: "Dans un port, réquisitionne un navire et son équipage pendant [niveau] jours. Un capitaine qui refuse : test opposé d'attaque magique, en cas de succès son prochain voyage finira mal." }
  ]},

  melenna: { id: 'melenna', nom: 'Voie de Mélenna', dieu: 'Mélenna, déesse de la forêt et des animaux', arme: 'arc court ou long', aussi: ['druide'], caps: [
    _rang1('melenna', 'survie', 'survie en forêt'),
    { r: 2, n: 'Ami de la nature', d: "Les animaux ne l'attaquent pas sauf s'il attaque le premier (animaux géants au rang 4, plantes animées au rang 5)." },
    { r: 3, n: "Mur d'épines", a: 'A', s: true, dmg: '1d4°', d: "Mur de ronces de 5 m de haut, 1 m d'épaisseur et 40 m de long (ou cercle de 10 m) pendant [CHA] minutes. Le franchir : 3 tests de FOR difficulté 15 (action de mouvement), chacun infligeant 1d4° DM." },
    { r: 4, n: 'Perception héroïque', d: "+1 en PER et dé bonus aux tests de PER." },
    { r: 5, n: 'Allié de la forêt', a: 'A', s: true, d: "En forêt, invoque pour [CHA] heures un animal, animal géant ou plante natif, de NC ≤ moitié de son niveau ; obéit aux ordres simples, fuit à mi-PV, ne quitte pas la forêt." }
  ]},

  mephistere: { id: 'mephistere', nom: 'Voie de Méphistère', dieu: "Méphistère, dieu de l'ombre et des secrets", arme: 'dague', caps: [
    _rang1('mephistere', 'discrétion', 'discrétion'),
    { r: 2, n: 'Lire sur les lèvres', d: "Test de PER difficulté 10 : saisit les secrets chuchotés jusqu'à 20 m." },
    { r: 3, n: "Dague d'ombre", a: 'A', s: true, dmg: '1d4°+AGI', d: "Dague d'ombre pendant [CHA] minutes : [1d4° + AGI] DM, dé bonus pour attaquer dans le dos, revient en main si lancée. La sacrifier sur un coup réussi double les DM (hors dés supplémentaires) ; cible vivante : test de VOL difficulté [10 + CHA] sinon ralentie 1d4 rounds." },
    { r: 4, n: 'Perception héroïque', d: "+1 en PER et dé bonus aux tests de PER." },
    { r: 5, n: 'Devenir une ombre', a: 'A', s: true, d: "Devient une ombre pendant [CHA] minutes (impossible en plein soleil ou ténèbres complètes) : 10 m par mouvement sur sols et murs, passe sous les portes, invulnérable mais sans capacité ni interaction, dé bonus en discrétion." }
  ]},

  mirandia: { id: 'mirandia', nom: 'Voie de Mirandia', dieu: 'Mirandia, déesse du sommeil et des rêves', arme: 'bâton', aussi: ['chamane'], caps: [
    { r: 1, n: 'Capacité de peuple + sieste', d: "Conserve la capacité de rang 1 de sa voie de peuple. Lors d'une récupération rapide, relance les 1 obtenus sur ses DR jusqu'à obtenir un autre résultat." },
    { r: 2, n: 'Sommeil réparateur', a: 'L', s: true, d: "Pour une nuit : lui et ses alliés dormant à 5 m gagnent 2 DR au lieu d'un ; un seul peut être dépensé, mais il rend sa valeur maximale." },
    { r: 3, n: 'Rêve prémonitoire', d: "Chaque nuit, sur un 6 au d6, le MJ donne un indice cryptique sur la journée à venir ; +1 en Init., en DEF et à tous ses tests pour la journée." },
    { r: 4, n: 'Sommeil supérieur', a: 'L', s: true, d: "Comme Sommeil réparateur, mais 3 DR au lieu d'un et +1 à tous les tests pendant 12 h après le réveil." },
    { r: 5, n: 'Grand rêve prémonitoire', d: "Sur un 6 au Rêve prémonitoire, relance : sur 4-6, indices décisifs pour l'aventure et +1 en Init., en DEF et à tous ses tests jusqu'à la fin de l'aventure (cumulable)." }
  ]},

  mondovael: { id: 'mondovael', nom: 'Voie de Möndovaël', dieu: 'Möndovaël, dieu des nomades et du voyage', arme: 'bâton', caps: [
    _rang1('mondovael', 'voyageur', 'orientation et progression'),
    { r: 2, n: 'Bottes de Möndovaël', a: 'L', s: true, d: "Une paire de chaussures double la vitesse de voyage de son porteur (pas en combat) pendant la prochaine période de marche." },
    { r: 3, n: "Marche sur l'eau", a: 'A', s: true, d: "Lui (action d'attaque) ou lui et [CHA] compagnons ou montures (action limitée) marchent sur l'eau pendant 1 h." },
    { r: 4, n: 'Constitution héroïque', d: "+1 en CON et dé bonus aux tests de CON." },
    { r: 5, n: 'Ami de la nature', t: 'soin', dmg: '2d4°', d: "Réduit de 5 les DM de sources naturelles (feu, froid, chutes, poisons naturels). Récupération complète à la belle étoile : +2d4° PV. Une action de mouvement supplémentaire par round en milieu naturel." }
  ]},

  morn: { id: 'morn', nom: 'Voie de Morn', dieu: "Morn, dieu de la mort et du passage dans l'au-delà", arme: 'faux', caps: [
    _rang1('morn', 'légiste', 'déterminer la cause ou l’ancienneté d’un décès'),
    { r: 2, n: 'Aux portes de la mort', a: 'L', s: true, t: 'soin', dmg: '1d4°', d: "Une créature vivante à 0 PV touchée est stabilisée et s'endort : elle récupère 1d4° PV par heure de sommeil (8 h au plus), et s'éveille une fois guérie." },
    { r: 3, n: 'Porte des enfers', a: 'A', s: true, d: "Sur le cadavre d'une créature tombée à 0 PV ce round ou le précédent (10 m) : ses alliés à 10 m de niveau ≤ à son NC font un test de VOL difficulté [10 + CHA] sinon ne peuvent agir à leur prochain tour (dé bonus aux expositions suivantes)." },
    { r: 4, n: 'Repose en paix', a: 'A', s: true, d: "Test opposé d'attaque magique contre un mort-vivant à 10 m : sans esprit, il s'effondre ; intelligent, il est affaibli pour le combat (1d4 rounds si NC ≥ niveau du prêtre)." },
    { r: 5, n: 'Réincarnation', a: 'L', s: true, d: "Rituel de 8 h (corps ou objet du défunt, mort depuis au plus 1 jour par niveau) : l'âme se réincarne dans un nouveau corps (peuple tiré sur 2d20 au choix du joueur), à 10 km au plus. Garde son profil, ajuste ses caractéristiques." }
  ]},

  orbis: { id: 'orbis', nom: "Voie d'Orbis", dieu: 'Orbis, dieu du commerce et des marchands', arme: 'arbalète légère', caps: [
    _rang1('orbis', 'commerce', 'commerce et évaluation'),
    { r: 2, n: 'Trésor des fous', a: 'A', s: true, d: "Fait apparaître jusqu'à [100 × niveau] pa en pièces ou joyaux, qui disparaissent après [CHA] minutes." },
    { r: 3, n: 'Le prix de la réussite', a: 'A', s: true, d: "Le matin, sacrifie 10 pa pour un dé bonus utilisable dans la journée (30 pa le 2e, 90 pa le 3e…). Payer avec un Trésor des fous : dé malus à tout pour la journée." },
    { r: 4, n: "Coffre-fort d'Orbis", a: 'A', s: true, d: "Coffre-fort permanent dans un mur ou au sol (jusqu'à 10 000 pa par niveau de petits objets), qu'il est seul à ouvrir ; +10 contre les dissipations." },
    { r: 5, n: "Touché d'or", a: 'A', s: true, f: 'jour', d: "1×/jour, transforme un objet ordinaire de moins de 10 kg en objet de qualité exceptionnelle (+10 à 1 000 pa selon le MJ), de façon permanente (dissipable)." }
  ]},

  oumaros: { id: 'oumaros', nom: "Voie d'Oumaros", dieu: "Oumaros, dieu de l'air et des cieux", arme: 'arc court ou long', aussi: ['druide'], caps: [
    _rang1('oumaros', 'météo', 'prédire la météo ou les vents'),
    { r: 2, n: 'Lévitation', a: 'M', s: true, d: "Pendant [CHA] minutes, monte de 5 m ou descend de 10 m par action de mouvement ; stationnaire : action de mouvement." },
    { r: 3, n: 'Foudre mineure', a: 'A', s: true, dmg: '2d4°+CHA', d: "Un éclair sur une cible à 20 m : [2d4° + CHA] DM d'électricité automatiques." },
    { r: 4, n: 'Monture volante', d: "Reçoit une monture volante à son service : aigle géant, pégase, griffon ou hippogriffe. Remplacée au niveau suivant si elle meurt." },
    { r: 5, n: 'Château dans le ciel', a: 'L', s: true, d: "Un château meublé apparaît sur un nuage en vue pendant [6 + CHA] heures, pour [niveau × 10] habitants (accès en vol). À la fin, ses occupants redescendent lentement au sol." }
  ]},

  perinde: { id: 'perinde', nom: 'Voie de Perindé', dieu: 'Perindé, déesse de la fertilité et des mères', arme: 'bâton', caps: [
    _rang1('perinde', 'pédagogie', 'interagir avec des enfants ou de jeunes animaux, enseigner'),
    { r: 2, n: 'Soutien', a: 'G', s: true, d: "Un allié en vue gagne +5 à un test de ce round et voit annulés les malus liés à la douleur." },
    { r: 3, n: 'Bénédiction de Perindé', a: 'A', s: true, d: "Quand il dépense un DR en récupération, tous ses alliés à 5 m profitent d'un DR gratuit (+ moitié de leur niveau)." },
    { r: 4, n: 'Prendre sur soi', a: 'G', f: 'round', d: "1×/round, subit à la place d'un allié à 30 m les DM qui le visent, divisés par 2." },
    { r: 5, n: 'Défendre les siens', d: "Quand un allié tombe à 0 PV : +2 en attaque, aux DM et en DEF pour le combat (cumulable jusqu'à +5) ; le bonus disparaît quand l'allié reprend connaissance." }
  ]},

  selenne: { id: 'selenne', nom: 'Voie de Sélenne', dieu: 'Sélenne, déesse de la paix et de la liberté', arme: 'mains nues', caps: [
    _rang1('selenne', 'pacifisme', 'convaincre de trouver une solution non violente ou de libérer un prisonnier'),
    { r: 2, n: 'Combat à mains nues', dmg: '1d4+FOR', d: "À mains nues : [1d4 + FOR ou AGI] DM (temporaires ou létaux). Ajoute rang + 1 aux tests de manœuvre à mains nues." },
    { r: 3, n: "Caresse d'acier", d: "Ses DM temporaires ne sont pas réduits par la FOR de la cible ; DM temporaires sans pénalité avec toute arme contondante ; à mains nues, ajoute son rang aux DM temporaires contre les humanoïdes." },
    { r: 4, n: 'Action libre', a: 'A', s: true, d: "Une cible touchée est immunisée aux entraves physiques et magiques (paralysie, ralentissement…) pendant [CHA] minutes, et libérée si elle l'était." },
    { r: 5, n: 'Apaisement', a: 'A', s: true, d: "Test opposé d'attaque magique (20 m) contre une créature vivante : elle cesse toute action offensive pendant [CHA] minutes (rounds si NC > niveau), sauf si on l'attaque ou attaque ses alliés." }
  ]},

  solar: { id: 'solar', nom: 'Voie de Solar', dieu: 'Solar, dieu de la lumière et du savoir', arme: 'masse', caps: [
    _rang1('solar', 'érudition', 'savoir académique (géographie, histoire, science)'),
    { r: 2, n: 'Un phare dans la nuit', a: 'M', s: true, d: "Son symbole éclaire 10 m pendant [CHA] rounds : dans le noir, ses alliés dans la lumière gagnent +2 en attaque et en DEF (occupe une main)." },
    { r: 3, n: 'Connaissance divine', choix: true, choixVoie: { rangMax: 2 }, d: "Reproduit une capacité de rang 1 ou 2 de n'importe quelle voie de profil ; peut en changer chaque matin après 1 h de prière." },
    { r: 4, n: 'Intelligence héroïque', d: "+1 en INT et dé bonus aux tests d'INT." },
    { r: 5, n: 'Rayon ardent', a: 'A', s: true, dmg: '4d4°+CHA', d: "Attaque magique contre la DEF (20 m) : [4d4° + CHA] DM de feu ([6d4° + CHA] contre les vampires)." }
  ]},

  suelle: { id: 'suelle', nom: 'Voie de Suëlle', dieu: "Suëlle, déesse de la beauté et de l'amour", arme: 'bâton', caps: [
    _rang1('suelle', 'séduction', 'séduction'),
    { r: 2, n: 'Charme de beauté', d: "D'un baiser, la cible devient d'une beauté exceptionnelle pendant [CHA] heures : +5 aux tests de séduction." },
    { r: 3, n: 'Lien sacré', a: 'A', s: true, d: "Unit deux humanoïdes volontaires pendant 24 h : télépathie sans limite de portée et transfert de PV au toucher (action limitée)." },
    { r: 4, n: 'Coup de foudre', a: 'L', s: true, dmg: '1d4°+CHA', d: "Test opposé d'attaque magique (20 m) contre un humanoïde vivant : [1d4° + CHA] DM et étourdi 1 round. Ensuite, pour attaquer le prêtre : test de VOL difficulté [10 + CHA] sinon 1d4° DM et attaque ratée. Dure [CHA] jours, sauf si le prêtre l'attaque." },
    { r: 5, n: "Philtre d'amour", d: "Prépare un philtre (1 000 pa, 10 jours, un par mois) : la victime tombe amoureuse du premier humanoïde rencontré ; après 24 h, test de VOL difficulté 15, sinon effet permanent (dissipable la première semaine)." }
  ]},

  trenner: { id: 'trenner', nom: 'Voie de Trenner', dieu: 'Trenner, dieu du temps et des ancêtres', arme: 'bâton', caps: [
    _rang1('trenner', 'mémoire', 'se souvenir et histoire'),
    { r: 2, n: 'Fouiller la mémoire', a: 'L', s: true, d: "La cible se remémore tous les détails d'un événement, même ancien." },
    { r: 3, n: 'Vision du passé', a: 'L', s: true, d: "Vision d'un événement marquant d'au moins un siècle survenu en ce lieu (choisi par le MJ)." },
    { r: 4, n: 'Bulle temporelle', a: 'L', s: true, d: "Bulle de 10 m de diamètre hors du temps : 36 min s'y écoulent (une récupération rapide) pour un instant au-dehors. Sortir met fin au sort ; personne ne peut y entrer." },
    { r: 5, n: 'Passager du temps', d: "Vieillit dix fois moins vite. Peut s'endormir un mois, un an ou cent ans sans vieillir (réveillé s'il est blessé)." }
  ]},

  tulsadum: { id: 'tulsadum', nom: 'Voie de Tulsadüm', dieu: 'Tulsadüm, dieu de la jungle et des reptiles', arme: 'arc court', aussi: ['druide', 'chamane'], caps: [
    _rang1('tulsadum', 'survie', 'survie dans la jungle et grimper aux arbres'),
    { r: 2, n: 'Enfant de la jungle', d: "Pas ralenti par les terrains difficiles de la jungle ; les reptiles animaux ne l'attaquent pas s'il ne le fait pas. Ajoute rang + 2 pour résister aux poisons et aux tests de CHA face à un reptile intelligent." },
    { r: 3, n: 'Flèche serpent', a: 'A', s: true, dmg: '1d4°+CHA', d: "Flèche-serpent : portée doublée, dé bonus en attaque, [1d4° + CHA] DM + 1d4° DM de poison. Flèche magique : +1d4° de poison par point de bonus (au lieu du bonus aux DM), puis perdue." },
    { r: 4, n: 'Constitution héroïque', d: "+1 en CON et dé bonus aux tests de CON." },
    { r: 5, n: 'Forme de serpent', a: 'A', s: true, d: "Devient un serpent constricteur pendant [1d4° + CHA] minutes (garde ses PV et son attaque) ; serpent géant à partir du niveau 12." }
  ]},

  tyriolith: { id: 'tyriolith', nom: 'Voie de Tyriolith', dieu: 'Tyriolith, dieu du combat contre le chaos et du feu purificateur', arme: 'masse', caps: [
    _rang1('tyriolith', 'courage', 'résister à la peur, à la corruption et à la domination'),
    { r: 2, n: 'Arme de feu', a: 'L', s: true, dmg: '1d4°', d: "Son arme s'enflamme pendant [CHA] minutes : +1d4° DM de feu (cumulable avec Arme de lumière)." },
    { r: 3, n: 'Purification des aliments', a: 'A', s: true, d: "Purifie un repas pour une personne par rang de tout poison ou toxine (léger goût de brûlé)." },
    { r: 4, n: 'Force héroïque', d: "+1 en FOR et dé bonus aux tests de FOR." },
    { r: 5, n: 'Bûcher de sorcier', a: 'A', s: true, dmg: '1d4°', d: "Test opposé d'attaque magique (20 m) : un lanceur de sorts prend feu, 1d4° DM et -1 PM par round pendant autant de rounds qu'il connaît de sorts (fin s'il n'a plus de PM). Test de VOL difficulté 20 (-1 par tentative) en fin de round pour l'éteindre." }
  ]},

  vorona: { id: 'vorona', nom: 'Voie de Vorona', dieu: 'Vorona, déesse de la justice et de la loi', arme: 'épée longue', caps: [
    _rang1('vorona', 'légaliste', 'connaître les règles et lois locales', "Un sixième sens l'avertit quand il s'apprête à enfreindre une loi locale."),
    { r: 2, n: 'Parangon de vertu', f: 'combat', d: "1×/combat, lance un sort avec le résultat maximal aux dés." },
    { r: 3, n: 'Au nom de la justice', dmg: '1d4°', d: "Contre un humanoïde qu'il sait recherché par la loi du pays : +2 en attaque et +1d4° DM." },
    { r: 4, n: 'Mur de lames', a: 'A', s: true, dmg: '2d4°+CHA', d: "Mur circulaire de lames (10 m de diamètre, 4 m de haut) pendant [CHA] minutes : le franchir inflige [2d4° + CHA] DM et un test de FOR difficulté [10 + VOL] sinon repoussé." },
    { r: 5, n: 'Sens de la justice', d: "Jamais aveuglé ni surpris ; aucun malus contre une cible invisible ou dans le noir ; moitié des DM des attaques sournoises." }
  ]}
});
