/* ============================================================
   COF2 Compagnon — Données : objet prestigieux (équipement lié
   à une voie propre, chapitre « Objets magiques » du livre de
   base — voir l'exemple « La Lame des Échos »).
   ============================================================ */
window.COF = window.COF || {};

/* Forme de l'objet selon la famille du profil auquel il est lié. */
COF.OP_FORMES_FAMILLE = {
  combattant: ['ARME'], aventurier: ['ARME'],
  mage: ['Bâton', 'Grimoire', 'Anneau', 'Orbe', 'Amulette'],
  mystique: ['Symbole sacré', 'Amulette', 'Bâton', 'Anneau', 'Talisman']
};

/* Conditions à remplir pour débloquer un rang (sur le modèle de la Lame
   des Échos : découvrir, prouver, accomplir). */
COF.OP_PREREQUIS = [
  "Le personnage doit découvrir le nom de l'artisan ou du forgeron à l'origine de l'objet.",
  "Le personnage doit apprendre comment son précédent propriétaire est mort et pourquoi.",
  "Le personnage doit réussir un exploit notable en présence de témoins dignes de foi.",
  "Le personnage doit ramener l'objet sur le lieu de sa création, ne serait-ce que brièvement.",
  "Le personnage doit vaincre ou convaincre un descendant de l'ancien propriétaire de l'objet.",
  "Le personnage doit réussir un test difficile lié à la nature de l'objet (à fixer par le MJ).",
  "Le personnage doit offrir quelque chose de personnel en offrande symbolique à l'objet.",
  "Le personnage doit réhabiliter ou venger la mémoire de l'ancien propriétaire de l'objet.",
  "Le personnage doit survivre à une épreuve que l'objet lui impose lui-même, à sa façon.",
  "Le personnage doit atteindre un niveau de maîtrise reconnu dans son propre domaine d'expertise.",
  "Le personnage doit percer un secret que l'objet dissimule depuis son origine.",
  "Le personnage doit renoncer publiquement à quelque chose qui lui tient à cœur.",
  "Le personnage doit affronter une créature ou une menace en lien direct avec l'histoire de l'objet.",
  "Le personnage doit obtenir la bénédiction ou l'accord d'une figure d'autorité liée à l'objet.",
  "Le personnage doit passer une nuit entière seul avec l'objet dans un lieu chargé de sens."
];
