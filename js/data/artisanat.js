/* ============================================================
   COF2 Compagnon — Données : règles d'artisanat
   (Compagnon du joueur, chapitre 4) : les quatre voies d'artisan,
   les compétences d'artisanat et les tables des armures/boucliers
   (voies de recettes d'armures). Les voies d'artisan suivent les
   règles des voies d'historique : 1 point de capacité par rang,
   sans niveau requis, hors limite des six voies. Chaque rang
   octroie 3 rangs de voies de recettes.
   ============================================================ */
window.COF = window.COF || {};

/* Compétences d'artisanat et caractéristique associée. */
COF.ARTISAN_COMPETENCES = [
  { id: 'alchimie', nom: 'Alchimie', carac: 'INT', lieu: 'un laboratoire' },
  { id: 'façonnage', nom: 'Façonnage', carac: 'AGI', lieu: 'un atelier' },
  { id: 'forge', nom: 'Forge', carac: 'CON', lieu: 'une forge' },
  { id: 'lapidage', nom: 'Lapidage', carac: 'PER', lieu: 'une trousse de lapidaire (200 pa, 3 kg)' }
];

function _voieArtisan(id, nom, comp, carac, bonusR1) {
  var titres = ['Apprenti', 'Compagnon', 'Patron', 'Maître', 'Grand maître'];
  var sfx = nom.toLowerCase();
  return {
    id: id, nom: (/^[aeiouéè]/i.test(sfx) ? "Voie de l'" : 'Voie du ') + sfx, competence: comp,
    desc: "Voie d'artisan (règles d'historique : 1 point par rang, sans niveau requis, hors limite des six voies). Chaque rang donne 3 rangs de voies de recettes dont les objets demandent un test de " + comp + ".",
    caps: [
      { r: 1, n: titres[0] + ' ' + sfx, comp: comp, bon: '2+rang', d: "Ajoute rang + 2 aux tests de " + comp + " (" + carac + "). 3 rangs de voies de recettes. " + bonusR1 },
      { r: 2, n: titres[1] + ' ' + sfx, d: "3 rangs de voies de recettes. Matières premières et durée des recettes de " + comp + " réduites de 10 %." },
      { r: 3, n: titres[2] + ' ' + sfx, d: "Bonus de synergie de +3 dans une autre compétence d'artisan (à choisir dans l'onglet Artisanat). 3 rangs de voies de recettes." },
      { r: 4, n: titres[3] + ' ' + sfx, d: "Réduction portée à 25 % (matières premières et durée). 3 rangs de voies de recettes." },
      { r: 5, n: titres[4] + ' ' + sfx, choixCarac: { liste: [carac], val: 1 }, d: "+1 en " + carac + " et dé bonus aux tests de " + comp + ". À chaque niveau, chaque point de capacité supplémentaire dépensé donne 4 rangs de voies de recettes." }
    ]
  };
}

COF.ARTISAN_VOIES = [
  _voieArtisan('alchimiste', "Alchimiste", 'alchimie', 'INT', "+3 pour résister aux poisons."),
  _voieArtisan('faconneur', "Façonneur", 'façonnage', 'AGI', "+3 pour comprendre des mécanismes, crocheter des serrures ou désamorcer des pièges."),
  _voieArtisan('forgeron', "Forgeron", 'forge', 'CON', "+3 pour résister à la chaleur et aux DM de feu (même magiques)."),
  _voieArtisan('lapidaire', "Lapidaire", 'lapidage', 'PER', "+3 pour estimer la valeur d'un objet ou faire du commerce.")
];

/* ---------- Armures et boucliers (voies de recettes d'armures) ----------
   tests : difficultés de la base magique +1 à +5.
   types : armures du catalogue d'équipement fabricables par la voie.     */
COF.AR_ARMURES = [
  { id: 'cuir', voie: 'Voie des armures de cuir', nom: 'Armures de cuir', slot: 'armure', types: ['cuir', 'cuirren'],
    tests: { 'façonnage': [20, 21, 22, 23, 24], forge: [17, 18, 19, 20, 22], lapidage: [10, 11, 12, 13, 15] },
    noteTests: "Le test de forge ne concerne que le cuir renforcé.",
    qualite: { prix: 50, tests: 'façonnage 20', texte: "Pénalité d'encombrement réduite de 1." },
    props: [
      { id: 'speciale', nom: 'Propriété spéciale', rang: 3, nm: 1, niv: 3, prix: 5000, tests: 'alchimie et façonnage +3', choix: ['action libre', 'défense (RD 2)', 'natation', 'ombre', 'protection', 'résistance à la magie', 'acrobatie', 'voyage'] },
      { id: 'resist', nom: 'Résistance aux éléments', rang: 4, nm: 1, niv: 5, prix: 8000, tests: 'alchimie et façonnage +5', choix: ['feu', 'froid', 'acide', 'électricité', 'poison'], texte: "DM de l'élément divisés par 2." },
      { id: 'aquatique', nom: 'Respiration aquatique', rang: 4, nm: 2, niv: 6, prix: 10000, tests: 'alchimie et façonnage +5', texte: "+5 en natation ; 1×/jour, respire sous l'eau 10 min par point de bonus." },
      { id: 'defsup', nom: 'Défense supérieure', rang: 5, nm: 2, niv: 6, prix: 10000, tests: 'alchimie et façonnage +5, forge 20', texte: "RD 4." }
    ] },
  { id: 'mailles', voie: 'Voie des armures de mailles', nom: 'Armures de mailles', slot: 'armure', types: ['chemise', 'cotte'],
    tests: { 'façonnage': [15, 16, 17, 18, 20], forge: [20, 21, 22, 23, 24], lapidage: [17, 18, 19, 20, 22] },
    noteTests: "Façonnage +2 pour une cotte de mailles.",
    qualite: { prix: 50, tests: 'forge 20, façonnage 15', texte: "Pénalité d'encombrement réduite de 1." },
    props: [
      { id: 'speciale', nom: 'Propriété spéciale', rang: 3, nm: 1, niv: 3, prix: 5000, tests: 'alchimie, façonnage et forge +2', choix: ['action libre', 'défense (RD 2)', 'natation', 'ombre (chemise)', 'protection', 'résistance à la magie', 'acrobatie (chemise)', 'voyage (chemise)'] },
      { id: 'resist', nom: 'Résistance aux éléments', rang: 4, nm: 1, niv: 5, prix: 8000, tests: 'alchimie, façonnage et forge +3', choix: ['feu', 'froid', 'acide', 'électricité', 'poison'], texte: "DM de l'élément divisés par 2." },
      { id: 'defsup', nom: 'Défense supérieure', rang: 5, nm: 2, niv: 6, prix: 10000, tests: 'alchimie, façonnage et forge +5', texte: "RD 4." },
      { id: 'chaines', nom: 'Armure des chaînes', rang: 5, nm: 2, niv: 5, prix: 10000, tests: 'alchimie, façonnage et forge +3, lapidage 18', texte: "+5 aux manœuvres bloquer, désarmer, gêner, renverser ; 1×/combat (L) : +5 DEF 1 round et 2d4° DM à 3 m." }
    ] },
  { id: 'plaques', voie: 'Voie des armures de plaques', nom: 'Armures de plaques', slot: 'armure', types: ['plaques', 'plaquecomp'],
    tests: { 'façonnage': [15, 16, 17, 18, 20], forge: [20, 21, 22, 23, 24], lapidage: [18, 19, 20, 21, 23] },
    noteTests: "Façonnage +3 pour une plaque complète.",
    qualite: { prix: 100, tests: 'forge 20, façonnage 15', texte: "Pénalité d'encombrement réduite de 1 (complète : 200 pa, façonnage 18)." },
    props: [
      { id: 'speciale', nom: 'Propriété spéciale', rang: 3, nm: 1, niv: 3, prix: 5000, tests: 'alchimie, façonnage et forge +2', choix: ['action libre', 'défense (RD 2)', 'mobile', 'natation', 'protection', 'résistance à la magie', 'solide (RD 4 contondant)', 'voyage'] },
      { id: 'resist', nom: 'Résistance aux éléments', rang: 4, nm: 1, niv: 5, prix: 8000, tests: 'alchimie, façonnage et forge +3', choix: ['feu', 'froid', 'acide', 'électricité', 'poison'], texte: "DM de l'élément divisés par 2." },
      { id: 'defsup', nom: 'Défense supérieure', rang: 5, nm: 2, niv: 6, prix: 10000, tests: 'alchimie, façonnage et forge +5', texte: "RD 4." },
      { id: 'cubique', nom: 'Armure cubique', rang: 5, nm: 1, niv: 5, prix: 8000, tests: 'façonnage et forge +3, lapidage 20', texte: "Se replie en cube ; encombrement -2, AGI max +1 ; se déploie sur un mot (20 m)." }
    ] },
  { id: 'boucliers', voie: 'Voie des boucliers', nom: 'Boucliers', slot: 'bouclier', types: ['petit', 'grand'],
    tests: { 'façonnage': [15, 16, 17, 18, 20], forge: [20, 21, 22, 23, 24], lapidage: [18, 19, 20, 21, 23] },
    qualite: { prix: 20, tests: 'forge 20, façonnage 15', texte: "Bouclier d'attaque (1d4 + FOR, attaque gratuite 1×/combat après un raté) ou brise-lame (désarme 1×/combat ; façonnage 20)." },
    props: [
      { id: 'lancer', nom: 'Bouclier de lancer', rang: 3, nm: 1, niv: 3, prix: 2000, tests: 'façonnage et forge +3, lapidage 20', texte: "Lancé à 10 m : 1d4° + FOR DM (+ bonus), revient seul." },
      { id: 'transport', nom: 'Bouclier de transport', rang: 3, nm: 0, niv: 2, prix: 1000, tests: 'façonnage et forge +2, alchimie 18', texte: "Lévite et porte 200 kg, 1×/jour par point de bonus, 1d4° h." },
      { id: 'protection', nom: 'Bouclier de protection', rang: 4, nm: 1, niv: 4, prix: 4000, tests: 'façonnage et forge +3, lapidage 18', texte: "+2 DEF contre les projectiles, RD 5 contre souffles et zones." },
      { id: 'levitation', nom: 'Bouclier de lévitation', rang: 4, nm: 2, niv: 4, prix: 3000, tests: 'façonnage et forge +3, alchimie 18', texte: "Monter dessus et léviter (10 m/mouvement), 1×/jour par point de bonus, 1d4° min." },
      { id: 'volant', nom: 'Bouclier volant', rang: 5, nm: 3, niv: 6, prix: 10000, tests: 'façonnage et forge +5, alchimie 20', texte: "Vol dans toutes les directions, 1×/jour par point de bonus, 1d4° min." },
      { id: 'champ', nom: 'Bouclier de champ de force', rang: 5, nm: 2, niv: 6, prix: 8000, tests: 'façonnage et forge +3, lapidage 20', texte: "1×/combat : hémisphère qui annule les DM physiques d'une attaque." }
    ] }
];
