/* ============================================================
   COF2 Compagnon — Données : Oracle & Muse pour le jeu en solo
   Grandes tables de mots combinées par le moteur (js/core/oracle.js)
   pour produire un maximum de résultats différents à partir de peu
   de données : action × sujet, focus × action × sujet, mot × mot...
   ============================================================ */
window.COF = window.COF || {};

/* Niveaux de vraisemblance d'une question fermée, avec le seuil
   (sur 100) en dessous duquel la réponse est « oui ». */
COF.ORACLE_LIKELIHOOD = [
  { id: 'impossible',    nom: 'Quasi impossible', seuil: 5 },
  { id: 'tresimprobable',nom: 'Très improbable',  seuil: 15 },
  { id: 'improbable',    nom: 'Improbable',       seuil: 30 },
  { id: 'peuprobable',   nom: 'Peu probable',     seuil: 40 },
  { id: 'moitie',        nom: '50 / 50',          seuil: 50 },
  { id: 'probable',      nom: 'Probable',         seuil: 60 },
  { id: 'tresprobable',  nom: 'Très probable',    seuil: 70 },
  { id: 'quasicertain',  nom: 'Quasi certain',    seuil: 85 },
  { id: 'certain',       nom: 'Certain',          seuil: 95 }
];

/* Angle sous lequel un événement aléatoire touche la scène en cours. */
COF.ORACLE_FOCUS = [
  'Un PNJ agit', 'Une menace approche', 'Une opportunité apparaît',
  'Un rebondissement narratif survient', 'Le décor se transforme',
  'Une information capitale est révélée', 'Une ressource est affectée',
  'Une relation évolue', 'Un plan déjà en cours échoue', 'Le hasard s\'en mêle',
  'Un allié intervient', 'Un ennemi se manifeste', 'Une trace du passé refait surface',
  'Un choix moral se présente', 'Le temps presse soudain', 'Une créature surgit',
  'Un lieu se révèle différent qu\'attendu', 'Un objet change de mains',
  'Une rumeur se confirme ou se dément', 'Une porte s\'ouvre, une autre se ferme',
  'Un secret manque d\'être découvert', 'Une dette doit être payée'
];

/* Verbes d'action, volontairement nombreux et généraux pour se combiner
   avec n'importe quel sujet sans jamais sonner absurde. */
COF.ORACLE_ACTIONS = [
  'trahit', 'protège', 'vole', 'révèle', 'cache', 'poursuit', 'fuit', 'négocie avec',
  'menace', 'sauve', 'piège', 'corrompt', 'libère', 'détruit', 'répare', 'invoque',
  'bannit', 'séduit', 'espionne', 'sacrifie', 'échange', 'emprisonne', 'guérit',
  'maudit', 'bénit', 'provoque', 'trompe', 'avertit', 'ignore', 'obéit à', 'défie',
  'soudoie', 'recrute', 'abandonne', 'encercle', 'infiltre', 'sabote', 'réclame',
  'offre', 'refuse', 'accepte', 'dissimule', 'expose', 'renforce', 'affaiblit',
  'transforme', 'consume', 'préserve', 'affronte', 'épargne', 'convainc', 'ridiculise',
  'imite', 'remplace', 'suit', 'surveille', 'interroge', 'kidnappe', 'retrouve',
  'perd', 'célèbre', 'venge', 'pardonne à', 's\'allie avec', 'rompt avec'
];

/* Sujets et thèmes narratifs, assez larges pour couvrir toute situation. */
COF.ORACLE_SUJETS = [
  'un allié proche', 'un rival de longue date', 'un secret de famille', 'une dette ancienne',
  'un artefact oublié', 'une prophétie', 'un serment brisé', 'une créature endormie',
  'un territoire contesté', 'une caravane marchande', 'un culte clandestin',
  'une garnison isolée', 'un marché noir', 'une épidémie', 'une malédiction',
  'un héritage contesté', 'une carte au trésor', 'un pont effondré', 'une tempête approchante',
  'un vieux grimoire', 'une lignée royale', 'un temple abandonné', 'une milice locale',
  'un contrat magique', 'une île flottante', 'une caverne scellée', 'une bibliothèque interdite',
  'un pacte douteux', 'une relique sacrée', 'un miroir enchanté', 'une armée en marche',
  'un espion infiltré', 'une trahison passée', 'un allié inattendu', 'une rumeur persistante',
  'une frontière disputée', 'un marché conclu à la hâte', 'une dette de sang', 'une fête populaire',
  'un tribunal corrompu', 'une guilde influente', 'un refuge secret', 'une caravane de réfugiés',
  'un monstre légendaire', 'une ruine engloutie', 'un phénomène magique inexpliqué',
  'une lettre interceptée', 'un otage de valeur', 'une expédition disparue', 'un pèlerinage sacré',
  'une arme ancienne', 'un poison rare', 'une prophétie oubliée', 'un esprit vengeur',
  'une forêt maudite', 'un port stratégique', 'une mine abandonnée', 'un noble déchu',
  'une secte religieuse', 'un marchand ambulant', 'une caravane de nomades', 'un dragon endormi'
];

/* Mots plus abstraits et évocateurs, pour l'étincelle d'inspiration
   libre (deux mots juxtaposés, à interpréter librement). */
COF.MUSE_MOTS = [
  'l\'oubli', 'la trahison', 'l\'espoir', 'la ruine', 'le sacrifice', 'la renaissance',
  'l\'ombre', 'la lumière', 'le silence', 'la tempête', 'la loyauté', 'la vengeance',
  'la solitude', 'l\'abondance', 'la famine', 'la peur', 'le courage', 'la corruption',
  'la pureté', 'le mensonge', 'la vérité', 'la captivité', 'la liberté', 'le froid',
  'le feu', 'la nuit', 'l\'aube', 'la poussière', 'le sang', 'l\'or', 'la glace',
  'la cendre', 'le venin', 'la prière', 'la malédiction', 'le rêve', 'le cauchemar',
  'l\'écho', 'le reflet', 'la frontière', 'le seuil', 'la chute', 'l\'ascension',
  'la métamorphose', 'la ruse', 'la force brute', 'une ruine ancienne', 'le chaos',
  'l\'ordre', 'la fracture', 'l\'union', 'la dérive', 'l\'errance', 'le refuge',
  'l\'exil', 'la mémoire', 'l\'ignorance', 'la révélation', 'le doute', 'l\'orgueil',
  'l\'humilité', 'la patience'
];

/* Détails sensoriels pour enrichir la description d'une scène. */
COF.ORACLE_SENS = {
  vue: [
    'une lumière vacillante', 'des ombres mouvantes', 'une couleur inhabituelle',
    'un mouvement furtif au loin', 'une architecture étrange', 'des traces au sol',
    'un reflet anormal', 'une brume légère', 'un détail hors de place',
    'une silhouette qui disparaît dès qu\'on la regarde'
  ],
  son: [
    'un grincement métallique', 'un murmure indistinct', 'un silence pesant',
    'un cri lointain', 'un bruit de pas irrégulier', 'une mélodie à peine audible',
    'le bruissement du vent', 'un écho qui ne devrait pas exister', 'un grondement sourd',
    'des voix étouffées derrière une paroi'
  ],
  odeur: [
    'une odeur de fumée', 'un parfum floral déplacé', 'une puanteur de pourriture',
    'une odeur métallique de sang', 'un relent de moisissure', 'une odeur d\'ozone',
    'un parfum d\'encens', 'une odeur animale forte', 'une senteur inconnue et âcre',
    'une odeur de brûlé'
  ],
  toucher: [
    'une chaleur inattendue', 'un froid glacial soudain', 'une surface étrangement lisse',
    'une vibration sous les pieds', 'un courant d\'air froid', 'une humidité persistante',
    'une texture visqueuse', 'une aspérité coupante', 'une chaleur moite',
    'un vent chargé de particules'
  ]
};
