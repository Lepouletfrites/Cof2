/* ============================================================
   COF2 Compagnon — Persistance locale (localStorage)
   ============================================================ */
window.COF = window.COF || {};

/* ---------- Deux applications séparées : mode normal / mode aventure ----------
   Les héros, le héros actif, le combat de l'Arène et le journal de dés
   ont chacun leur stockage propre selon le mode (suffixe « .av » en
   aventure). Au premier passage en aventure, les héros liés aux
   aventures du Carnet (et le combat d'une aventure en cours) y sont
   recopiés une fois. */
COF.modeDonnees = function () { try { return localStorage.getItem('cof2.mode') === 'aventure' ? 'aventure' : 'normal'; } catch (e) { return 'normal'; } };
COF.cle = function (base) {
  if (COF.modeDonnees() !== 'aventure') return base;
  COF.migrerAventure();
  return base + '.av';
};
COF.migrerAventure = function () {
  try {
    if (localStorage.getItem('cof2.personnages.av') !== null) return;
    var carnets = JSON.parse(localStorage.getItem('cof2.carnets') || '[]') || [];
    var ids = carnets.map(function (c) { return c.persoId; }).filter(Boolean);
    /* une aventure sans héros lié jouait avec le héros actif : on le reprend */
    if (carnets.some(function (c) { return !c.persoId; }) && localStorage.getItem('cof2.actif')) ids.push(localStorage.getItem('cof2.actif'));
    var persos = (JSON.parse(localStorage.getItem('cof2.personnages') || '[]') || []).filter(function (p) { return ids.indexOf(p.id) >= 0; });
    localStorage.setItem('cof2.personnages.av', JSON.stringify(persos));
    var actifC = localStorage.getItem('cof2.carnetActif'), ca = carnets.filter(function (c) { return c.id === actifC; })[0] || carnets[0];
    var act = (ca && ca.persoId) || (persos[0] && persos[0].id);
    if (act) localStorage.setItem('cof2.actif.av', act);
    if (carnets.some(function (c) { return c.combat; }) && localStorage.getItem('cof2.arene') !== null) localStorage.setItem('cof2.arene.av', localStorage.getItem('cof2.arene'));
  } catch (e) {}
};

COF.Store = (function () {
  function KEY() { return COF.cle('cof2.personnages'); }
  function KEY_ACTIF() { return COF.cle('cof2.actif'); }
  function KEY_LOG() { return COF.cle('cof2.journal'); }

  function uid() {
    return 'pj_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function lire() {
    try { return JSON.parse(localStorage.getItem(KEY())) || []; }
    catch (e) { return []; }
  }
  function ecrire(list) {
    try { localStorage.setItem(KEY(), JSON.stringify(list)); } catch (e) {}
  }

  function tous() { return lire(); }

  function get(id) {
    return lire().filter(function (p) { return p.id === id; })[0] || null;
  }

  function sauver(p) {
    var l = lire();
    var i = l.findIndex(function (x) { return x.id === p.id; });
    p.maj = Date.now();
    if (i >= 0) l[i] = p; else l.push(p);
    ecrire(l);
    return p;
  }

  function supprimer(id) {
    ecrire(lire().filter(function (p) { return p.id !== id; }));
    if (actifId() === id) setActif(null);
  }

  function actifId() { try { return localStorage.getItem(KEY_ACTIF()); } catch (e) { return null; } }
  function setActif(id) {
    try { id ? localStorage.setItem(KEY_ACTIF(), id) : localStorage.removeItem(KEY_ACTIF()); } catch (e) {}
  }
  function actif() { return get(actifId()); }

  /* ---------- Personnage vierge ---------- */
  function nouveau(opts) {
    opts = opts || {};
    var p = {
      id: uid(),
      nom: opts.nom || 'Nouveau héros',
      joueur: '',
      peuple: opts.peuple || 'humain',
      peupleVoie: opts.peupleVoie || null,   // pour le demi-elfe
      profil: opts.profil || 'guerrier',
      niveau: 1,
      carac: { FOR: 0, AGI: 0, CON: 0, PER: 0, CHA: 0, INT: 0, VOL: 0 },
      voies: [],
      armure: 'aucune',
      bouclier: 'aucun',
      armes: [],
      bonus: { pv: 0, pm: 0, pc: 0, dr: 0, def: 0, init: 0, attC: 0, attD: 0, attM: 0, dmC: 0, dmD: 0 },
      pv: null, pm: null, pc: null, dr: null, dmTemp: 0,
      etats: [],
      bourse: { po: 0, pa: 0, pc: 0 },
      inventaire: [],
      compagnons: [],
      notes: '',
      description: { ideal: '', travers: '', histoire: '' },
      cree: Date.now()
    };
    return p;
  }

  /* Applique l'équipement de départ d'un profil */
  function equiperDepart(p) {
    var pr = COF.PROFILS[p.profil];
    if (!pr) return p;
    p.armes = [];
    (pr.equipDepart || []).forEach(function (e) {
      if (e.type === 'contact' || e.type === 'distance') {
        var src = (e.type === 'contact' ? COF.ARMES_CONTACT : COF.ARMES_DISTANCE)
          .filter(function (a) { return a.id === e.ref; })[0];
        if (src) {
          p.armes.push({
            nom: e.nom, type: e.type, dm: src.dm, dm2: src.dm2 || null,
            portee: src.portee || null, crit: src.crit || 20, note: src.note || '',
            noFor: !!src.noFor
          });
        }
      } else if (e.type === 'armure') {
        p.armure = e.ref;
      } else if (e.type === 'bouclier') {
        p.bouclier = e.ref;
      } else if (e.type === 'objet') {
        p.inventaire.push({ nom: e.nom, qte: 1 });
      }
    });
    return p;
  }

  /* Transfère un objet trouvé (butin, trésor nommé, objet magique...) vers
     un personnage.
     o : { nom, qte, prix, note ou desc, dm, armeType, noFor, crit, def, slot,
           bonus, elementaires, caracBonus: {id, val} }
     Une arme (dm présent) devient une vraie entrée dans C.armes — utilisable
     aussitôt avec le bon bonus de FOR (et le bonus magique/élémentaire d'un
     pouvoir, le cas échéant), comme n'importe quelle arme équipée — tandis
     qu'une trace complète (prix, description) reste dans l'inventaire.
     Une armure/un bouclier (def + slot présents) reste dans l'inventaire,
     à équiper depuis la fiche : l'équiper remplace l'armure/le bouclier du
     catalogue en cours plutôt que de s'y additionner. Un bonus de
     caractéristique définitif (caracBonus) s'équipe/se déséquipe depuis
     Objets, en ajustant directement C.carac. */
  function ajouterObjet(p, o) {
    if (o.dm) {
      p.armes.push({
        nom: o.nom, type: o.armeType || 'contact', dm: o.dm, dm2: o.dm2 || null, portee: o.portee || null,
        crit: o.crit || 20, noFor: !!o.noFor, note: o.noteArme || null, bonus: o.bonus || 0,
        bonusAtt: o.bonusAtt || 0, elementaires: o.elementaires || []
      });
    }
    var item = { nom: o.nom, qte: o.qte || 1 };
    if (o.prix) item.prix = o.prix;
    var desc = o.desc || o.note || null;
    if (o.dm) desc = (desc ? desc + ' ' : '') + "Équipée automatiquement dans l'onglet Armes.";
    if (desc) item.desc = desc;
    if (o.def) { item.def = o.def; item.slot = o.slot; }
    if (o.caracBonus) item.caracBonus = o.caracBonus;
    p.inventaire.push(item);
    return item;
  }

  /* Remet PV/PM/PC/DR au maximum */
  function reinitialiser(p) {
    p.pv = COF.Calc.pvMax(p);
    p.pm = COF.Calc.pmMax(p);
    p.pc = COF.Calc.pcMax(p);
    p.dr = COF.Calc.drMax(p);
    p.dmTemp = 0;
    return p;
  }

  /* ---------- Journal de dés ---------- */
  function journal() {
    try { return JSON.parse(sessionStorage.getItem(KEY_LOG())) || []; }
    catch (e) { return []; }
  }
  function logJet(entry) {
    var j = journal();
    j.unshift(entry);
    if (j.length > 60) j = j.slice(0, 60);
    try { sessionStorage.setItem(KEY_LOG(), JSON.stringify(j)); } catch (e) {}
    return j;
  }
  function viderJournal() {
    try { sessionStorage.removeItem(KEY_LOG()); } catch (e) {}
  }

  /* ---------- Export / import ---------- */
  function exporter(p) { return JSON.stringify(p, null, 2); }
  /* Fusionne sur un personnage vierge : un export plus ancien que le
     schéma actuel (champ manquant — bourse, inventaire, compagnons...)
     ne doit jamais faire planter la fiche à l'affichage. */
  function importer(json) {
    var brut = JSON.parse(json);
    var p = nouveau();
    for (var k in brut) if (brut.hasOwnProperty(k)) p[k] = brut[k];
    p.id = uid();
    return sauver(p);
  }

  return {
    uid: uid, tous: tous, get: get, sauver: sauver, supprimer: supprimer,
    actif: actif, actifId: actifId, setActif: setActif,
    nouveau: nouveau, equiperDepart: equiperDepart, reinitialiser: reinitialiser, ajouterObjet: ajouterObjet,
    journal: journal, logJet: logJet, viderJournal: viderJournal,
    exporter: exporter, importer: importer
  };
})();
