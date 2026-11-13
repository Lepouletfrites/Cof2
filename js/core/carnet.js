/* ============================================================
   COF2 Compagnon — Moteur du Carnet d'aventure (jeu en solo)
   Une campagne garde la mémoire de l'histoire :
     - scènes (ce qu'on attendait, le test de scène, le fil des
       entrées : récit, oracle, jets, événements, notes) ;
     - fils d'intrigue ouverts / résolus ;
     - PNJ et factions (attitude, note) ;
     - lieux visités ;
     - jauge de tension (1-9) qui pilote l'oracle et les scènes ;
     - jour en cours.
   Les événements aléatoires ciblent les fils et PNJ de la campagne.
   Stockage : localStorage, indépendant des personnages.
   ============================================================ */
window.COF = window.COF || {};

COF.Carnet = (function () {
  var KEY = 'cof2.carnets', KEY_ACTIF = 'cof2.carnetActif';
  var piocher = COF.piocher, piockerPoids = COF.piockerPoids;

  function uid(p) { return (p || 'c') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function tous() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function ecrire(l) { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch (e) {} }
  function get(id) { return tous().filter(function (c) { return c.id === id; })[0] || null; }
  function actifId() { try { return localStorage.getItem(KEY_ACTIF); } catch (e) { return null; } }
  function setActif(id) { try { id ? localStorage.setItem(KEY_ACTIF, id) : localStorage.removeItem(KEY_ACTIF); } catch (e) {} }
  function actif() {
    var c = get(actifId());
    if (!c) { var l = tous(); c = l[0] || null; if (c) setActif(c.id); }
    return c;
  }
  function sauver(c) {
    c.maj = Date.now();
    var l = tous(), i = l.map(function (x) { return x.id; }).indexOf(c.id);
    if (i >= 0) l[i] = c; else l.unshift(c);
    ecrire(l);
    return c;
  }
  function supprimer(id) {
    ecrire(tous().filter(function (c) { return c.id !== id; }));
    if (actifId() === id) setActif(null);
  }
  /* Recommence l'aventure à zéro : garde le titre et le héros lié,
     efface scènes, fils, PNJ, lieux, carte, expédition, tension, jour. */
  function reinitialiser(c) {
    ['scenes', 'fils', 'pnj', 'lieux', 'routes', 'regions'].forEach(function (k) { c[k] = []; });
    ['expedition', 'rencontre', 'combat', 'butinEnAttente', 'position', 'envDernier'].forEach(function (k) { c[k] = null; });
    c.marche = {}; c.ressources = { rations: 3, torches: 2 };
    c.tension = 5; c.jour = 1; c.cree = Date.now();
    return sauver(c);
  }
  function creer(titre, persoId) {
    var c = { id: uid('cmp'), titre: titre || 'Nouvelle aventure', persoId: persoId || null, cree: Date.now(), maj: Date.now(),
      tension: 5, jour: 1, scenes: [], fils: [], pnj: [], lieux: [] };
    sauver(c); setActif(c.id);
    return c;
  }

  /* ---------- Scènes ---------- */
  function sceneCourante(c) {
    var s = c.scenes[c.scenes.length - 1];
    return s && !s.close ? s : null;
  }
  /* opts : { filId, type, lieu } (scène proposée par le directeur) */
  function nouvelleScene(c, titre, attendu, opts) {
    opts = opts || {};
    var test = opts.sansTest ? null : COF.Oracle.testScene(c.tension);
    /* scène interrompue : un événement d'histoire prend le dessus (et agit) */
    if (test && test.resultat === 'interrompue') test.histoire = evenementHistoire(c);
    var s = { id: uid('sc'), n: c.scenes.length + 1, titre: titre || ('Scène ' + (c.scenes.length + 1)), attendu: attendu || '',
      test: test, tensionDebut: c.tension, jour: c.jour, entrees: [], close: false, debut: Date.now(),
      filId: opts.filId || null, type: opts.type || 'libre' };
    c.scenes.push(s);
    sauver(c);
    return s;
  }
  /* La tension n'est plus choisie par le joueur : le récit la décide
     (COF.Tension : issue, réussites et échecs, danger, combats, genre).
     controle ne sert plus que de repli si ce module manque. */
  function clore(c, controle, resume) {
    var s = sceneCourante(c);
    if (!s) return null;
    s.close = true; s.resume = resume || '';
    var av = c.tension, ev = COF.Tension ? COF.Tension.evaluer(c, s) : { delta: controle ? -1 : 1, raisons: [] };
    c.tension = Math.max(1, Math.min(9, c.tension + ev.delta));
    s.controle = ev.delta < 0 ? true : (ev.delta > 0 ? false : null);
    s.tension = { avant: av, apres: c.tension, raisons: ev.raisons };
    if (COF.Tension) s.tensionNote = COF.Tension.texte(av, c.tension, ev);
    sauver(c);
    return s;
  }
  /* Ajoute une entrée à la scène en cours (en crée une si besoin).
     e = { t: 'texte'|'oracle'|'evt'|'jet'|'muse'|'detail'|'note', txt, ... } */
  function ajouterEntree(c, e) {
    var s = sceneCourante(c);
    if (!s) {
      s = { id: uid('sc'), n: c.scenes.length + 1, titre: 'Scène ' + (c.scenes.length + 1), attendu: '', test: null,
        tensionDebut: c.tension, jour: c.jour, entrees: [], close: false, debut: Date.now() };
      c.scenes.push(s);
    }
    e.id = uid('e'); e.quand = Date.now();
    s.entrees.push(e);
    sauver(c);
    return e;
  }
  function supprimerEntree(c, entreeId) {
    c.scenes.forEach(function (s) { s.entrees = s.entrees.filter(function (e) { return e.id !== entreeId; }); });
    sauver(c);
  }

  /* ---------- Listes : fils, PNJ, lieux ---------- */
  function ajouterListe(c, liste, obj) {
    obj.id = uid(liste.slice(0, 2)); obj.cree = Date.now();
    if (liste === 'fils' && obj.ouvert === undefined) obj.ouvert = true;
    if (liste === 'pnj' && !obj.attitude) obj.attitude = 'neutre';
    if (liste === 'fils' && COF.Rumeurs) COF.Rumeurs.marquer(c, obj);   /* une rumeur peut mentir */
    c[liste].unshift(obj);
    sauver(c);
    return obj;
  }
  function majListe(c, liste, id, champs) {
    c[liste].forEach(function (x) { if (x.id === id) Object.assign(x, champs); });
    sauver(c);
  }
  function retirerListe(c, liste, id) {
    c[liste] = c[liste].filter(function (x) { return x.id !== id; });
    sauver(c);
  }
  function filsOuverts(c) { return c.fils.filter(function (f) { return f.ouvert; }); }

  /* ---------- Événement d'histoire ----------
     Le focus vise les éléments de la campagne ; s'ils manquent, on
     bascule sur un nouvel élément à créer. Action × sujet de l'oracle
     donnent la couleur. */
  var FOCUS = [
    ['lointain', 'Événement lointain', 7], ['ambiance', "Changement d'ambiance", 5],
    ['pnjNouveau', 'Un nouveau personnage entre en scène', 9], ['pnjAgit', 'Un PNJ agit', 20],
    ['pnjNeg', 'Un PNJ est en difficulté', 8], ['pnjPos', 'La chance sourit à un PNJ', 7],
    ['filAvance', 'Un fil progresse', 12], ['filRecule', 'Un fil se complique', 12],
    ['filFin', 'Un fil approche de son dénouement', 4], ['filNouveau', 'Un nouveau fil apparaît', 4],
    ['heroNeg', 'Coup dur pour le héros', 7], ['heroPos', 'Coup de chance pour le héros', 5]
  ];
  function evenementHistoire(c) {
    var f = piockerPoids(FOCUS.map(function (x) { return [x, x[2]]; }));
    var id = f[0], libelle = f[1], cibleNom = null, cibleId = null, x;
    var ouverts = filsOuverts(c);
    if (/^pnj(Agit|Neg|Pos)$/.test(id)) {
      if (c.pnj.length) { x = piocher(c.pnj); cibleNom = x.nom; cibleId = x.id; }
      else { id = 'pnjNouveau'; libelle = 'Un nouveau personnage entre en scène'; }
    }
    if (/^fil(Avance|Recule|Fin)$/.test(id)) {
      if (ouverts.length) { x = piocher(ouverts); cibleNom = x.nom; cibleId = x.id; }
      else { id = 'filNouveau'; libelle = 'Un nouveau fil apparaît'; }
    }
    var p = (c.persoId && COF.Store && COF.Store.get(c.persoId)) || (COF.Store && COF.Store.actif());
    if (/^hero/.test(id) && p) cibleNom = p.nom;
    var e = COF.Oracle.evenement();
    var ev = { focus: id, libelle: libelle, cible: cibleNom, cibleId: cibleId, action: e.action, sujet: e.sujet };
    /* Le directeur applique l'événement à la campagne (PNJ, quête, héros…). */
    ev.effet = COF.Directeur ? COF.Directeur.appliquer(c, ev) : null;
    ev.texte = ev.effet ? libelle + ' : ' + ev.effet : libelle + (cibleNom ? ' — ' + cibleNom : '') + ' : ' + e.action + ' ' + e.sujet + '.';
    return ev;
  }

  /* ---------- Oracle branché sur la tension ---------- */
  function oracle(c, likelihoodId, question) {
    var r = COF.Oracle.repondre(likelihoodId, { tension: c.tension });
    var e = { t: 'oracle', question: question || '', likelihood: r.likelihood.nom, roll: r.roll, seuil: r.seuil,
      nuance: r.nuance, txt: r.texte };
    if (r.evenement) e.evt = evenementHistoire(c);
    return ajouterEntree(c, e);
  }

  /* ---------- Export texte du journal ---------- */
  function texteEntree(e) {
    if (e.t === 'texte') return e.txt;
    if (e.t === 'oracle') return '🔮 ' + (e.question ? '« ' + e.question + ' » ' : '') + '(' + e.likelihood + ') → ' + e.txt +
      (e.evt ? '\n   🔀 ' + e.evt.texte : '');
    if (e.t === 'evt') return '🔀 ' + e.txt;
    if (e.t === 'jet') return '🎲 ' + e.txt + (e.effet ? '\n   ➜ ' + e.effet : '') + (e.csq ? '\n   ' + e.csq : '');
    if (e.t === 'muse') return '✨ ' + e.txt;
    if (e.t === 'detail') return '🖐️ ' + e.txt;
    return '📌 ' + (e.titre ? e.titre + ' — ' : '') + e.txt;
  }
  function exporter(c) {
    var L = ['# ' + c.titre, ''];
    var p = c.persoId && COF.Store ? COF.Store.get(c.persoId) : null;
    if (p) L.push('Héros : ' + p.nom + ' (niveau ' + p.niveau + ')', '');
    c.scenes.forEach(function (s) {
      L.push('## ' + s.n + '. ' + s.titre + ' (jour ' + (s.jour || 1) + ')');
      if (s.attendu) L.push('Attendu : ' + s.attendu);
      if (s.test) L.push('Scène ' + s.test.label.toLowerCase() + (s.test.modif ? ' — ' + s.test.modif : '') + (s.test.histoire ? ' — ' + s.test.histoire.texte : ''));
      L.push('');
      s.entrees.forEach(function (e) { L.push(texteEntree(e), ''); });
      if (s.close) L.push('— Fin de scène' + (s.resume ? ' : ' + s.resume : '') + (s.controle === true ? ' (le héros garde la main)' : (s.controle === false ? ' (ça tourne mal)' : '')), '');
    });
    var fo = filsOuverts(c);
    if (fo.length) { L.push('## Fils ouverts'); fo.forEach(function (f) { L.push('- ' + f.nom + (f.note ? ' : ' + f.note : '')); }); L.push(''); }
    if (c.pnj.length) { L.push('## PNJ'); c.pnj.forEach(function (x) { L.push('- ' + x.nom + ' (' + x.attitude + ')' + (x.note ? ' : ' + x.note : '')); }); L.push(''); }
    if (c.lieux.length) { L.push('## Lieux'); c.lieux.forEach(function (x) { L.push('- ' + x.nom + (x.note ? ' : ' + x.note : '')); }); }
    return L.join('\n');
  }

  return {
    tous: tous, get: get, actif: actif, setActif: setActif, sauver: sauver, supprimer: supprimer, creer: creer, reinitialiser: reinitialiser,
    sceneCourante: sceneCourante, nouvelleScene: nouvelleScene, clore: clore,
    ajouterEntree: ajouterEntree, supprimerEntree: supprimerEntree,
    ajouterListe: ajouterListe, majListe: majListe, retirerListe: retirerListe, filsOuverts: filsOuverts,
    evenementHistoire: evenementHistoire, oracle: oracle, texteEntree: texteEntree, exporter: exporter
  };
})();
