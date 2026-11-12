/* ============================================================
   COF2 Compagnon — Sauvegarde complète
   Toutes les données de l'app vivent dans le stockage du navigateur
   de l'appareil (qui peut être vidé). Ce module les rassemble dans un
   seul fichier JSON et sait les restaurer : personnages, aventures du
   Carnet, combat de l'Arène, préférences.
   ============================================================ */
window.COF = window.COF || {};

COF.Sauvegarde = (function () {
  var CLES = ['cof2.personnages', 'cof2.actif', 'cof2.carnets', 'cof2.carnetActif', 'cof2.arene', 'cof2.mode', 'cof2.prefs',
    'cof2.personnages.av', 'cof2.actif.av', 'cof2.arene.av'];
  var KEY_DATE = 'cof2.derniereSauvegarde';

  function lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function ecrire(k, v) { try { if (v === null || v === undefined) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }

  function contenu() {
    var data = {};
    CLES.forEach(function (k) { var v = lire(k); if (v !== null) data[k] = v; });
    return data;
  }
  /* Y a-t-il quelque chose à perdre ? */
  function aDesDonnees() {
    var n = 0;
    try { n += (JSON.parse(lire('cof2.personnages')) || []).length; } catch (e) {}
    try { n += (JSON.parse(lire('cof2.carnets')) || []).length; } catch (e) {}
    return n > 0;
  }
  function resume() {
    var p = [], c = [];
    try { p = JSON.parse(lire('cof2.personnages')) || []; } catch (e) {}
    try { c = JSON.parse(lire('cof2.carnets')) || []; } catch (e) {}
    return { persos: p.length, aventures: c.length };
  }
  function exporter() {
    var r = resume();
    return JSON.stringify({ app: 'cof2-compagnon', format: 1, date: new Date().toISOString(),
      resume: r, data: contenu() }, null, 1);
  }
  function nomFichier() {
    var d = new Date(), z = function (n) { return ('0' + n).slice(-2); };
    return 'cof2-sauvegarde-' + d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()) + '.json';
  }
  function marquer() { ecrire(KEY_DATE, String(Date.now())); }
  function derniere() { var v = parseInt(lire(KEY_DATE), 10); return isNaN(v) ? null : v; }
  /* Nombre de jours depuis la dernière sauvegarde (null = jamais). */
  function age() { var d = derniere(); return d === null ? null : Math.floor((Date.now() - d) / 86400000); }
  /* Faut-il le rappeler ? (données présentes et sauvegarde absente ou de plus de 7 jours) */
  function aRappeler() { var a = age(); return aDesDonnees() && (a === null || a >= 7); }

  /* Vérifie un fichier de sauvegarde ; renvoie { ok, erreur, resume, date, data }. */
  function analyser(texte) {
    var o;
    try { o = JSON.parse(texte); } catch (e) { return { ok: false, erreur: 'Ce fichier n’est pas un JSON valide.' }; }
    if (!o || o.app !== 'cof2-compagnon' || !o.data || typeof o.data !== 'object') {
      return { ok: false, erreur: 'Ce fichier n’est pas une sauvegarde de COF2 Compagnon.' };
    }
    var data = {};
    Object.keys(o.data).forEach(function (k) { if (CLES.indexOf(k) >= 0 && typeof o.data[k] === 'string') data[k] = o.data[k]; });
    try { if (data['cof2.personnages']) JSON.parse(data['cof2.personnages']); if (data['cof2.carnets']) JSON.parse(data['cof2.carnets']); }
    catch (e) { return { ok: false, erreur: 'La sauvegarde est endommagée.' }; }
    return { ok: true, resume: o.resume || {}, date: o.date, data: data };
  }
  /* Remplace toutes les données par celles de la sauvegarde. */
  function restaurer(analyse) {
    CLES.forEach(function (k) { ecrire(k, analyse.data.hasOwnProperty(k) ? analyse.data[k] : null); });
    marquer();
  }

  return { exporter: exporter, nomFichier: nomFichier, marquer: marquer, derniere: derniere, age: age,
    aRappeler: aRappeler, aDesDonnees: aDesDonnees, resume: resume, analyser: analyser, restaurer: restaurer };
})();
