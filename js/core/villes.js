/* ============================================================
   COF2 Compagnon — Villes et villages procéduraux (aventure solo)
   Le récit fait apparaître des lieux habités : hameaux, villages,
   bourgs… chacun avec sa taille, son économie, son ambiance, son
   problème du moment, son notable et sa taverne (générateurs du
   module Lieux). Ils sont posés sur la carte, reliés par une route,
   et deviennent des scènes jouables (taverne, notable, marché,
   temple, flânerie). Le problème du village donne une quête dont
   le notable est le commanditaire.
   ============================================================ */
window.COF = window.COF || {};

COF.Villes = (function () {
  function M() { return COF.Monde; }
  function K() { return COF.Carnet; }
  function min1(s) { s = String(s || ''); return s.charAt(0).toLowerCase() + s.slice(1); }
  function sansPoint(s) { return String(s || '').replace(/[.\s]+$/, ''); }
  var GENRE_TAILLE = { hameau: 'm', village: 'm', bourg: 'm', ville: 'f', cite: 'f', capitale: 'f', metropole: 'f' };

  function generer() {
    var L = COF.LieuxCalc, v = L.etablissement.genererTout({}, {}), t = L.taverne.genererTout({}, {});
    return { nom: v.nom, taille: v.taille.id, tailleNom: v.taille.nom, pop: v.taille.pop, specialite: v.specialite, gouvernance: v.gouvernance,
      ambiance: v.ambiance, probleme: v.probleme,
      notable: { nom: v.notable.nom, genre: v.notable.genre, metier: v.notable.metier || 'Notable' },
      taverne: { nom: t.nom, spec: t.specialite, tenancier: t.tenancier.nom, tenGenre: t.tenancier.genre, rumeur: t.rumeur, ambiance: t.ambiance } };
  }
  function texte(v) {
    return v.tailleNom + ' (' + v.pop + '), vit de ' + min1(sansPoint(v.specialite)) + '. Dirigé par ' + min1(sansPoint(v.gouvernance)) + '.\n' +
      'Ambiance : ' + min1(sansPoint(v.ambiance)) + '. Problème du moment : ' + min1(sansPoint(v.probleme)) + '.\n' +
      'Notable : ' + v.notable.nom + ' (' + min1(v.notable.metier) + '). Taverne : « ' + v.taverne.nom + ' », tenue par ' + v.taverne.tenancier + '.';
  }
  /* Donne une identité de village à un lieu urbain qui n'en a pas. */
  function assurer(l) {
    if (l && !l.ville) {
      l.ville = generer();
      /* notable et taverne à l'image du peuple du lieu (le nom du lieu ne change pas) */
      var c0 = K().actif && K().actif();
      if (COF.Culture && c0) { var pe = COF.Culture.peupleLieu(c0, l); COF.Culture.adapterVille(c0, l.ville, pe); }
      l.ville.nom = l.nom; if (!l.note) l.note = texte(l.ville);
    }
    return l;
  }
  /* Un village apparaît près du héros (ou au centre de la carte). */
  function decouvrir(c) {
    var ici = M().ici(c), v = generer(), l = null, essai = 0;
    while (M().lieuParNom(c, v.nom) && essai++ < 8) v.nom = generer().nom;
    if (ici) {
      var ang = Math.random() * Math.PI * 2;
      l = M().decouvrir(c, ici, { x: ici.x + Math.cos(ang) * 32, y: ici.y + Math.sin(ang) * 24 }, 0.9, 'urbain');
      if (l) { l.nom = v.nom; l.env = 'urbain'; M().relier(c, ici.id, l.id, 1, ici.env || 'plaine'); }
    }
    if (!l) l = M().obtenirLieu(c, v.nom, null, '', 'urbain');
    if (!l) return null;
    /* le village prend la culture de sa région : nom, notable, taverne */
    if (COF.Culture) {
      var envR = M().envAuPoint(c, l.x, l.y) || (ici && ici.env !== 'urbain' ? ici.env : 'urbain');
      delete l.peuple;   /* ne pas hériter de soi-même */
      var pe = COF.Culture.peupleAu(c, l.x, l.y, envR);
      if (pe === 'demielfe') pe = 'humain';
      COF.Culture.adapterVille(c, v, pe); l.nom = v.nom; l.peuple = pe;
    }
    l.env = 'urbain'; l.ville = v; l.note = texte(v);
    K().sauver(c);
    return l;
  }
  function contexte(l) {
    var v = assurer(l).ville, g = COF.Imprevus ? COF.Imprevus.np((GENRE_TAILLE[v.taille] || 'm') + ':' + min1(v.tailleNom)) : { un: min1(v.tailleNom) };
    return { taille_un: g.un, pop: v.pop, specialite: min1(sansPoint(v.specialite)), ambiance: min1(sansPoint(v.ambiance)), probleme: min1(sansPoint(v.probleme)),
      notable_n: v.notable.nom, notableMetier: min1(v.notable.metier), taverne: v.taverne.nom, tenancier: v.taverne.tenancier,
      tenancierRole: v.taverne.tenGenre === 'féminin' ? 'la tenancière' : 'le tenancier', specTaverne: min1(sansPoint(v.taverne.spec)),
      rumeurTaverne: sansPoint(v.taverne.rumeur) + '.' };
  }
  /* Le notable confie au héros le problème du village (une seule fois). */
  function queteDuNotable(c) {
    var l = M().ici(c); if (!l || !l.ville) return '';
    var v = l.ville;
    if (v.queteId) {
      var ru = COF.Aventure.rumeur(); K().ajouterListe(c, 'fils', { nom: ru.nom, note: ru.texte });
      return '🧵 ' + v.notable.nom + ' confie une autre rumeur : ' + ru.nom;
    }
    var f = COF.Directeur.creerQuete(c), q = f.quete;
    var com = (c.pnj || []).filter(function (x) { return x.id === q.commanditaire; })[0];
    if (com) { com.nom = v.notable.nom; com.note = 'Commanditaire — ' + min1(v.notable.metier) + ' à ' + l.nom + '.\n' + (com.note || '').replace(/^Commanditaire — [^\n]*\n?/, ''); }
    q.comNom = v.notable.nom; q.fem = v.notable.genre === 'féminin';
    f.note = 'Le problème de ' + l.nom + ' : ' + min1(sansPoint(v.probleme)) + '.\n' + (f.note || '');
    v.queteId = f.id;
    K().sauver(c);
    return '📜 Nouvelle quête : « ' + f.nom + ' » (commanditaire ' + v.notable.nom + ')';
  }
  /* Scènes de ville proposées par le récit. */
  function propositions(c) {
    var ici = M().ici(c), out = [];
    if (ici && (ici.ville || ici.env === 'urbain')) {
      assurer(ici);
      var fo = COF.Conteur.formes(ici.nom);
      out.push({ type: 'ville', ic: '🏘️', titre: 'Arpenter ' + fo.n, lieu: ici.id,
        attendu: 'Taverne, marché, temple, ' + ici.ville.notable.nom + ' (' + min1(ici.ville.notable.metier) + ')… et tout ce que la foule réserve.' });
    } else {
      var proches = ici ? M().voisins(c, ici.id).filter(function (x) { return x.lieu.ville || x.lieu.env === 'urbain'; }) : [];
      if (!proches.length) out.push({ type: 'fumees', ic: '🏘️', titre: 'Des fumées à l’horizon', attendu: 'Un lieu habité doit se trouver tout près. Le héros va voir : bon lit, nouvelles fraîches, ennuis peut-être.' });
    }
    return out;
  }
  return { generer: generer, decouvrir: decouvrir, assurer: assurer, contexte: contexte, queteDuNotable: queteDuNotable, propositions: propositions };
})();
