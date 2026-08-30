/* ============================================================
   COF2 Compagnon — Données : compagnons (loups, familiers, golems,
   montures...) liés à une capacité de voie.
   ============================================================ */
window.COF = window.COF || {};

/* Champs :
   lien   { profil, voieId, rangMin, rangMax? }  voie de profil qui donne accès
          (reconnue même via un profil hybride)
       ou { prestige, rangMin, rangMax? }        voie de prestige
   carac  affichage texte des caractéristiques du compagnon (informatif)
   def    (rang) => valeur de Défense
   pv     (niveau) => points de vigueur maximum
   init   { mode:'perso' } ou { mode:'fixe', valeur }
   attaque{ mode:'magique' } ou { mode:'fixe', valeur } ou null (n'attaque pas)
   dmg    formule de dégâts (null si le compagnon n'attaque pas)
   deplacement / notes : texte informatif                                   */

COF.COMPAGNONS = {

  loup: {
    id: 'loup', nom: 'Loup', origine: 'Rôdeur — voie du compagnon animal',
    lien: { profil: 'rodeur', voieId: 'compagnon', rangMin: 1, rangMax: 3 },
    desc: "Le rôdeur obtient un loup pour compagnon. En combat, il attaque en même temps que le rôdeur. Comprend des ordres simples (garde, reste, apporte, attaque).",
    carac: 'AGI +1 · CON +1* · FOR +2 · PER +2* · CHA -2 · INT -3 · VOL +2 (*dé bonus)',
    def: function (rang) { return 12 + rang; },
    pv: function (niveau) { return niveau * 4; },
    init: { mode: 'perso' },
    attaque: { mode: 'magique' },
    dmg: '1d4+2'
  },

  loup_alpha: {
    id: 'loup_alpha', nom: 'Loup alpha', origine: 'Rôdeur — voie du compagnon animal (rang 4)',
    lien: { profil: 'rodeur', voieId: 'compagnon', rangMin: 4 },
    desc: "Le loup du rôdeur devient un spécimen particulièrement puissant.",
    carac: 'AGI +1 · CON +3* · FOR +5 · PER +2* · CHA -2 · INT -3 · VOL +2 (*dé bonus)',
    def: function () { return 18; },
    pv: function (niveau) { return niveau * 5; },
    init: { mode: 'perso' },
    attaque: { mode: 'magique' },
    dmg: '1d4°+5'
  },

  petit_compagnon: {
    id: 'petit_compagnon', nom: 'Petit compagnon', origine: 'Druide — voie des animaux',
    lien: { profil: 'druide', voieId: 'animaux', rangMin: 2 },
    desc: "Petit animal (écureuil, corbeau, chat...). Le druide voit par ses yeux et communique avec lui à distance illimitée. Trop petit pour attaquer ou infliger des dégâts.",
    carac: 'AGI +3* · CON 0 · FOR -4 · PER +2* · INT -2 · CHA -2 · VOL +2 (*dé bonus)',
    def: function (rang) { return 13 + rang; },
    pv: function (niveau) { return niveau * 2; },
    init: { mode: 'perso' },
    attaque: null, dmg: null
  },

  panthere: {
    id: 'panthere', nom: 'Panthère', origine: 'Druide — voie du fauve',
    lien: { profil: 'druide', voieId: 'fauve', rangMin: 2, rangMax: 3 },
    desc: "Le druide apprivoise une panthère (ou un puma) qui lui obéit au doigt et à l'œil.",
    carac: 'AGI +4* · CON +2 · FOR +2 · PER +2* · CHA -2 · INT -3 · VOL +2 (*dé bonus)',
    def: function (rang) { return 13 + rang; },
    pv: function (niveau) { return niveau * 4; },
    init: { mode: 'perso' },
    attaque: { mode: 'magique' },
    dmg: '1d4+2'
  },

  grand_felin: {
    id: 'grand_felin', nom: 'Grand félin', origine: 'Druide — voie du fauve (rang 4)',
    lien: { profil: 'druide', voieId: 'fauve', rangMin: 4 },
    desc: "La panthère devient un animal fabuleux (tigre, lion...). Peut servir de monture, déplacement 20 m par action de mouvement. Le druide peut la guérir à distance en sacrifiant ses propres PV.",
    carac: 'AGI +4* · CON +5 · FOR +5 · PER +2* · CHA -2 · INT -2 · VOL +4 (*dé bonus)',
    def: function (rang) { return 15 + rang; },
    pv: function (niveau) { return niveau * 5; },
    init: { mode: 'perso' },
    attaque: { mode: 'magique' },
    dmg: '1d4°+5',
    deplacement: '20 m par action de mouvement'
  },

  familier_magicien: {
    id: 'familier_magicien', nom: 'Familier', origine: 'Magicien — voie de la magie universelle',
    lien: { profil: 'magicien', voieId: 'universelle', rangMin: 2 },
    desc: "Petit animal (écureuil, corbeau, chat, dragonnet). Le magicien voit par ses yeux et gagne +2 en Initiative et en DEF lorsqu'il est en vue. Trop petit pour attaquer.",
    carac: 'AGI +3* · CON 0 · FOR -4 · PER +2 · CHA -2 · INT -2 · VOL +2 (*dé bonus)',
    def: function (rang) { return 13 + rang; },
    pv: function (niveau) { return niveau; },
    init: { mode: 'perso' },
    attaque: null, dmg: null
  },

  golem: {
    id: 'golem', nom: 'Golem', origine: 'Forgesort — voie du golem',
    lien: { profil: 'forgesort', voieId: 'golem', rangMin: 2 },
    desc: "Créature non vivante fabriquée pour servir de serviteur et de garde du corps. Comprend des ordres simples (suivre, attaquer, monter la garde), incapable d'actions complexes.",
    carac: 'AGI -1 · CON +10 · FOR +1 · PER -3 · CHA -4 · INT -3 · VOL +4',
    def: function (rang) { return 10 + rang; },
    pv: function (niveau) { return niveau * 5; },
    init: { mode: 'perso' },
    attaque: { mode: 'magique' },
    dmg: '1d4°+1'
  },

  zombie: {
    id: 'zombie', nom: 'Zombie', origine: "Sorcier — voie de l'outre-tombe",
    lien: { profil: 'sorcier', voieId: 'outretombe', rangMin: 3 },
    desc: "Cadavre animé d'un humanoïde de taille moyenne. Comprend « Attaquer », « Suivre », « Garder » et « Pas bouger ». Réduit à 0 PV, il tombe en poussière.",
    carac: 'AGI -1 · CON +1 · FOR +2 · PER -2 · CHA -4 · INT -4 · VOL +6',
    def: function () { return 10; },
    pv: function (niveau) { return 10 + niveau; },
    init: { mode: 'fixe', valeur: 8 },
    attaque: { mode: 'magique' },
    dmg: '1d4°+2',
    deplacement: '5 m par action de mouvement'
  },

  fidele_monture: {
    id: 'fidele_monture', nom: 'Fidèle monture', origine: 'Chevalier — voie du cavalier',
    lien: { profil: 'chevalier', voieId: 'cavalier', rangMin: 1, rangMax: 4 },
    desc: "Cheval de guerre bien dressé qui comprend les ordres simples. N'attaque que si elle est elle-même attaquée au contact. Récupère 1d8+4 PV par nuit.",
    carac: 'AGI +0 · CON +4* · FOR +5 · PER +0 · CHA +0 · INT -2 · VOL +2 (*dé bonus)',
    def: function (rang) { return 12 + rang; },
    pv: function (niveau) { return 10 + niveau * 4; },
    init: { mode: 'perso' },
    attaque: { mode: 'fixe', valeur: 5 },
    dmg: '1d4°+5',
    notes: 'Ruade.'
  },

  monture_fantastique: {
    id: 'monture_fantastique', nom: 'Monture fantastique', origine: 'Chevalier — voie du cavalier (rang 5)',
    lien: { profil: 'chevalier', voieId: 'cavalier', rangMin: 5 },
    desc: "Monture puissante (cheval de guerre lourd, ours, félin géant...). En selle, le chevalier peut la faire attaquer une fois par round en action gratuite. Monture volante possible à partir du niveau 9.",
    carac: 'Caractéristiques variables selon la créature choisie',
    def: function () { return 20; },
    pv: function (niveau) { return 10 + niveau * 6; },
    init: { mode: 'perso' },
    attaque: { mode: 'magique' },
    dmg: '2d4°+5',
    notes: 'Ruade ou morsure.'
  },

  ecuyer: {
    id: 'ecuyer', nom: 'Écuyer', origine: 'Chevalier — voie de la noblesse',
    lien: { profil: 'chevalier', voieId: 'noblesse', rangMin: 2 },
    desc: "Écuyer absolument loyal : s'occupe de la monture et de l'équipement, prépare le campement, panse les blessures. Affûte les armes du chevalier (+1 à la zone de critique au contact).",
    carac: '—',
    def: function (rang) { return 10 + rang; },
    pv: function (niveau) { return niveau * 4; },
    init: { mode: 'perso' },
    attaque: { mode: 'magique' },
    dmg: '1d4°+1'
  },

  familier_fantastique: {
    id: 'familier_fantastique', nom: 'Familier fantastique', origine: 'Prestige — voie du familier fantastique',
    lien: { prestige: 'familier', rangMin: 3 },
    desc: "Compagnon original (pseudo-dragon, fée, diablotin, lézard voltaïque...) qui apporte des pouvoirs magiques à son maître. Récupère tous ses PV après une récupération rapide.",
    carac: 'AGI +3* · CON +2 · FOR -4 · PER +2 · CHA -2 · INT +1 · VOL +2 (*dé bonus) — taille minuscule',
    def: function (rang) { return 14 + rang; },
    pv: function (niveau) { return niveau * 2; },
    init: { mode: 'perso' },
    attaque: null, dmg: null,
    notes: "Selon l'espèce choisie, gagne un pouvoir mineur au rang 4 et un pouvoir supérieur au rang 7 (voir la voie de prestige)."
  },

  compagnon_vermine: {
    id: 'compagnon_vermine', nom: 'Compagnon vermine', origine: 'Prestige — voie des vermines',
    lien: { prestige: 'vermines', rangMin: 6 },
    desc: "Scorpion ou araignée géante (taille moyenne) adopté par le personnage. Attaque en action limitée avec pinces (sans poison) et dard (avec poison) ; l'araignée grimpe aux surfaces verticales.",
    carac: 'AGI +3* · CON +5 · FOR +5 · PER +2 · CHA -4 · INT -3 · VOL +2 (*dé bonus)',
    def: function (rang) { return 15 + rang; },
    pv: function (niveau) { return niveau * 5; },
    init: { mode: 'perso' },
    attaque: { mode: 'magique' },
    dmg: '1d4°+5',
    notes: "Dard : +1d4° DM de poison supplémentaire. Déplacement rapide : 20 m par action de mouvement."
  },

  compagnon_feerique: {
    id: 'compagnon_feerique', nom: 'Compagnon féérique', origine: 'Prestige — voie du pacte féérique',
    lien: { prestige: 'pactefeerique', rangMin: 6 },
    desc: "Une fée, un farfadet ou un grig adopté par le personnage. N'obéit pas aux ordres mais agit dans l'intérêt du PJ ; peut se rendre invisible en action limitée. Revient guéri 24 h après avoir été réduit à 0 PV.",
    carac: 'AGI +4* · CON +1* · FOR -4 · PER +2 · CHA +2 · INT +0 · VOL +2 (*dé bonus)',
    def: function (rang) { return 12 + rang; },
    pv: function (niveau) { return niveau * 2; },
    init: { mode: 'fixe', valeur: 14 },
    attaque: { mode: 'magique' },
    dmg: '1d4°',
    notes: "Ce sont des DM de poison. Fée : vole 15 m/action de mouvement. Farfadet : téléportation 15 m. Grig : bonds de 15 m."
  }
};
