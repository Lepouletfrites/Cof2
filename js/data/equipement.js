/* ============================================================
   COF2 Compagnon — Données : équipement
   ============================================================ */
window.COF = window.COF || {};

/* cat : 'legere' | '1m' | '2m' | '1ou2m'
   dm  : formule ; dm2 : version à deux mains
   type: 'C' contondant, 'P' perforant, 'T' tranchant           */

COF.ARMES_CONTACT = [
  { id: 'mainsnues', nom: 'Mains nues',      dm: '1d3',  prix: 0,   type: 'C', cat: '1m',    note: "DM temporaires." },
  { id: 'baton',     nom: 'Bâton',           dm: '1d4',  prix: 0,   type: 'C', cat: '2m',    note: "Deux mains. DM temporaires possibles." },
  { id: 'batonferre',nom: 'Bâton ferré',     dm: '1d6',  prix: 2,   type: 'C', cat: '2m',    note: "Deux mains." },
  { id: 'dague',     nom: 'Dague',           dm: '1d4',  prix: 3,   type: 'P', cat: 'legere',note: "Arme légère." },
  { id: 'epee2m',    nom: 'Épée à deux mains',dm: '2d6', prix: 10,  type: 'T', cat: '2m',    note: "Deux mains." },
  { id: 'epeebatarde',nom: 'Épée bâtarde',   dm: '1d8',  dm2: '1d12', prix: 9, type: 'T', cat: '1ou2m', note: "Une ou deux mains." },
  { id: 'epeecourte',nom: 'Épée courte',     dm: '1d6',  prix: 5,   type: 'P', cat: 'legere',note: "Arme légère." },
  { id: 'epeelongue',nom: 'Épée longue',     dm: '1d8',  prix: 6,   type: 'T', cat: '1m' },
  { id: 'epieu',     nom: 'Épieu',           dm: '1d6',  dm2: '1d10', prix: 4, type: 'P', cat: '1ou2m', note: "Une ou deux mains. Jet : 1d6 à 10 m." },
  { id: 'fleau',     nom: 'Fléau',           dm: '1d6',  prix: 5,   type: 'C', cat: '1m',    note: "Relance 1 attaque ratée/combat contre bouclier ou arme." },
  { id: 'fleau2m',   nom: 'Fléau à deux mains',dm: '1d10',prix: 8,  type: 'C', cat: '2m',    note: "Deux mains. Relance 1 attaque ratée/combat." },
  { id: 'gourdin',   nom: 'Gourdin',         dm: '1d4',  prix: 1,   type: 'C', cat: '1m',    note: "DM temporaires possibles." },
  { id: 'hache',     nom: 'Hache',           dm: '1d8',  prix: 6,   type: 'T', cat: '1m' },
  { id: 'hache2m',   nom: 'Hache à deux mains',dm: '2d6',prix: 10,  type: 'T', cat: '2m',    note: "Deux mains." },
  { id: 'lance',     nom: 'Lance',           dm: '1d6',  dm2: '1d10', prix: 4, type: 'P', cat: '1ou2m', note: "Une ou deux mains. Jet : 1d6 à 10 m." },
  { id: 'lancecav',  nom: 'Lance de cavalerie',dm: '2d6',prix: 8,   type: 'P', cat: '2m',    note: "À cheval après un déplacement, sinon dé malus." },
  { id: 'marteau',   nom: 'Marteau',         dm: '1d6',  prix: 4,   type: 'C', cat: '1m' },
  { id: 'masse',     nom: 'Masse',           dm: '1d6',  prix: 4,   type: 'C', cat: '1m' },
  { id: 'pique',     nom: 'Pique',           dm: '1d10', prix: 5,   type: 'P', cat: '2m',    note: "Deux mains. DM doublés contre une grande créature qui charge. Attaque depuis le 2e rang à -5." },
  { id: 'rapiere',   nom: 'Rapière',         dm: '1d6',  prix: 6,   type: 'P', cat: 'legere', crit: 19, note: "Arme légère. Critique sur 19-20." },
  { id: 'stylet',    nom: 'Stylet',          dm: '1d3',  prix: 1,   type: 'P', cat: 'legere', noFor: true, note: "Pas de FOR aux DM. 1d6+AGI contre une cible surprise." },
  { id: 'vivelame',  nom: 'Vivelame',        dm: '1d10', prix: 15,  type: 'T', cat: '2m',    crit: 19, note: "Deux mains. Critique sur 19-20." }
];

COF.ARMES_DISTANCE = [
  { id: 'arbpoing',  nom: 'Arbalète de poing', portee: 10, dm: '1d6',  prix: 8,   type: 'P', note: "Rechargement : action de mouvement." },
  { id: 'arblegere', nom: 'Arbalète légère',   portee: 30, dm: '2d4',  prix: 10,  type: 'P', note: "Deux mains. Rechargement : action de mouvement." },
  { id: 'arblourde', nom: 'Arbalète lourde',   portee: 60, dm: '2d6',  prix: 15,  type: 'P', note: "Deux mains. Rechargement : action limitée." },
  { id: 'arccourt',  nom: 'Arc court',         portee: 30, dm: '1d6',  prix: 4,   type: 'P', note: "Deux mains." },
  { id: 'arclong',   nom: 'Arc long',          portee: 50, dm: '1d8',  prix: 8,   type: 'P', note: "Deux mains. Nécessite FOR +1 minimum." },
  { id: 'couteaux',  nom: 'Couteaux de lancer',portee: 10, dm: '1d4',  prix: 3,   type: 'P', note: "1d3 au contact. 3 couteaux en une action limitée (+AGI aux DM)." },
  { id: 'daguejet',  nom: 'Dague (lancer)',    portee: 5,  dm: '1d4',  prix: 3,   type: 'P' },
  { id: 'fronde',    nom: 'Fronde',            portee: 20, dm: '1d4',  prix: 0,   type: 'C' },
  { id: 'hachette',  nom: 'Hachette',          portee: 5,  dm: '1d6',  prix: 2,   type: 'T' },
  { id: 'javelot',   nom: 'Javelot',           portee: 20, dm: '1d6',  prix: 1,   type: 'P', note: "Propulseur : portée doublée, action limitée." },
  { id: 'lancejet',  nom: 'Lance (lancer)',    portee: 10, dm: '1d6',  prix: 3,   type: 'P' },
  { id: 'lancepierre',nom: 'Lance-pierre',     portee: 10, dm: '1d3',  prix: 0.1, type: 'C' },
  { id: 'petoire',   nom: 'Pétoire',           portee: 20, dm: '1d10', prix: 50,  type: 'P', poudre: true, note: "Arme à poudre. Rechargement : action limitée." },
  { id: 'mousquet',  nom: 'Mousquet',          portee: 50, dm: '2d6',  prix: 100, type: 'P', poudre: true, note: "Deux mains. Arme à poudre. Rechargement : action limitée." },
  { id: 'couleuvrine',nom: 'Couleuvrine',      portee: 100,dm: '5d4°+INT', prix: 0, type: 'P', poudre: true, note: "Capacité d'arquebusier. 2 rounds (L) pour recharger." }
];

/* rang = ordre croissant de protection (pour les limites d'armure des profils) */
COF.ARMURES = [
  { id: 'aucune',    nom: 'Aucune',                       def: 0, agiMax: 99, prix: 0,   rang: 0 },
  { id: 'matelasse', nom: 'Tissus matelassés, fourrures', def: 1, agiMax: 7,  prix: 2,   rang: 1 },
  { id: 'cuir',      nom: 'Cuir simple',                  def: 2, agiMax: 6,  prix: 4,   rang: 2 },
  { id: 'cuirren',   nom: 'Cuir renforcé, broigne',       def: 3, agiMax: 5,  prix: 8,   rang: 3 },
  { id: 'chemise',   nom: 'Chemise de mailles',           def: 4, agiMax: 4,  prix: 15,  rang: 4 },
  { id: 'cotte',     nom: 'Cotte de mailles',             def: 5, agiMax: 3,  prix: 25,  rang: 5 },
  { id: 'plaques',   nom: 'Armure de plaques',            def: 6, agiMax: 2,  prix: 60,  rang: 6 },
  { id: 'plaquecomp',nom: 'Plaque complète',              def: 7, agiMax: 1,  prix: 200, rang: 7, note: "Sur mesure : chevalier uniquement (voie de la noblesse, rang 2)." }
];

COF.BOUCLIERS = [
  { id: 'aucun',   nom: 'Aucun',          def: 0, prix: 0 },
  { id: 'petit',   nom: 'Petit bouclier', def: 1, prix: 2 },
  { id: 'grand',   nom: 'Grand bouclier', def: 2, prix: 4 }
];

COF.MATERIEL = [
  { nom: 'Briquet à silex', prix: 1 },
  { nom: 'Carquois de 20 flèches', prix: 3 },
  { nom: 'Corde 15 m', prix: 2 },
  { nom: 'Couverture', prix: 1 },
  { nom: 'Grappin', prix: 2 },
  { nom: 'Lanterne à huile', prix: 3, note: "Éclaire à 10 m pendant 6 h (1 dose)." },
  { nom: "Matériel d'écriture", prix: 5 },
  { nom: 'Huile pour lanterne', prix: 1 },
  { nom: 'Torches (×3)', prix: 1, note: "Éclaire à 10 m pendant 1 h." },
  { nom: 'Outils de crochetage', prix: 5, note: "Sans eux : -10 aux tests d'AGI (crocheter)." },
  { nom: 'Potion de soins', prix: 10, dmg: '1d4°', note: "Rend 1d4° PV. Une seule par récupération rapide." },
  { nom: 'Ration (1 semaine)', prix: 4 },
  { nom: 'Sac à dos', prix: 1 }
];

COF.MONTURES = [
  { nom: 'Mule ou âne', prix: 25 },
  { nom: 'Poney', prix: 50 },
  { nom: 'Cheval de selle', prix: 100, note: "Dé malus en combat monté." },
  { nom: 'Cheval de guerre', prix: 300, note: "Pas de pénalité en combat. Attaque +4, ruade 1d4+4." },
  { nom: 'Carriole', prix: 50 },
  { nom: 'Chariot', prix: 90 }
];

COF.SAC_DEPART = "Une couverture, une torche, un briquet à silex, une outre, une gamelle, une bourse de 2d6 pa.";
