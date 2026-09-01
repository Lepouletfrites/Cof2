/* ============================================================
   COF2 Compagnon — Moteur des générateurs de lieux
   Taverne, boutique et village/ville, chacun à champs
   verrouillables (voir js/core/procedural.js).
   ============================================================ */
window.COF = window.COF || {};

COF.LieuxCalc = (function () {
  var alea = COF.alea, piocher = COF.piocher;

  function voyelle(mot) { return /^[aeiouyàâéèêëîïôûAEIOUY]/.test(mot); }

  /* ---------- Petite personne récurrente (tenancier, marchand, notable) ---------- */
  /* Un « travers » (PNJ_TRAVERS) est un adjectif ; une « manie » (PNJ_MANIES) est une
     tournure comportementale complète — les deux ne s'accordent pas de la même façon
     dans la phrase, d'où le tag `type` qui permet de choisir la bonne construction. */
  function genererTrait() {
    if (Math.random() < 0.5) return { texte: piocher(COF.PNJ_TRAVERS), type: 'travers' };
    return { texte: piocher(COF.PNJ_MANIES), type: 'manie' };
  }
  function genererPersonne(avecMetier) {
    var peuple = COF.PnjCalc.genererChamp('peuple', {});
    var genre = COF.PnjCalc.genererChamp('genre', {});
    var nom = COF.PnjCalc.genererChamp('nom', { peuple: peuple, genre: genre });
    var out = { peuple: peuple, genre: genre, nom: nom };
    if (avecMetier) out.metier = piocher(COF.PNJ_METIERS).nom;
    else out.trait = genererTrait();
    return out;
  }
  var NOMS_PEUPLE_M = {
    humain: 'humain', nain: 'nain', halfelin: 'halfelin', gnome: 'gnome',
    elfehaut: 'elfe haut', elfesylvain: 'elfe sylvain', demiorc: 'demi-orc', demielfe: 'demi-elfe'
  };
  var NOMS_PEUPLE_F = {
    humain: 'humaine', nain: 'naine', halfelin: 'halfeline', gnome: 'gnome',
    elfehaut: 'elfe haute', elfesylvain: 'elfe sylvaine', demiorc: 'demi-orque', demielfe: 'demi-elfe'
  };
  function texteTenancier(p, avecMetier) {
    var fem = p.genre === 'féminin';
    var genreTxt = fem ? 'une' : 'un';
    var peupleTxt = (fem ? NOMS_PEUPLE_F[p.peuple] : NOMS_PEUPLE_M[p.peuple]) || p.peuple;
    var fin = avecMetier ? ' (' + p.metier + ')' :
      (p.trait.type === 'manie' ? ', qui ' + p.trait.texte.charAt(0).toLowerCase() + p.trait.texte.slice(1) : ', ' + p.trait.texte.toLowerCase());
    return p.nom + ', ' + genreTxt + ' ' + peupleTxt + fin;
  }

  /* ---------- Nom de taverne ---------- */
  function genererNomTaverne() {
    var style = piocher(['simple', 'simple', 'simple', 'chez', 'aux']);
    if (style === 'chez') return 'Chez ' + piocher(COF.LIEUX_NOMS_PATRON);
    if (style === 'aux') return 'Aux ' + piocher(COF.LIEUX_TAVERNE_PLURIELS);
    var masc = Math.random() < 0.5;
    var sub = piocher(masc ? COF.LIEUX_TAVERNE_SUBST_M : COF.LIEUX_TAVERNE_SUBST_F);
    var adj = piocher(masc ? COF.LIEUX_TAVERNE_ADJ_M : COF.LIEUX_TAVERNE_ADJ_F);
    var article = voyelle(sub) ? "L'" : (masc ? 'Le ' : 'La ');
    return article + sub + ' ' + adj;
  }

  var CHAMPS_TAVERNE = [
    { id: 'nom', label: 'Nom', gen: function () { return genererNomTaverne(); } },
    { id: 'ambiance', label: 'Ambiance', gen: function () { return piocher(COF.LIEUX_TAVERNE_AMBIANCE); } },
    { id: 'specialite', label: 'Spécialité', gen: function () { return piocher(COF.LIEUX_TAVERNE_SPECIALITE); } },
    { id: 'prix', label: 'Prix', gen: function () { return piocher(COF.LIEUX_PRIX); } },
    { id: 'tenancier', label: 'Tenancier', gen: function () { return genererPersonne(false); } },
    { id: 'particularite', label: 'Particularité', gen: function () { return piocher(COF.LIEUX_TAVERNE_PARTICULARITE); } },
    { id: 'rumeur', label: "Ce qu'on y entend", gen: function () { return piocher(COF.LIEUX_RUMEURS); } }
  ];
  var GEN_TAVERNE = COF.creerGenerateurChamps(CHAMPS_TAVERNE);

  /* ---------- Boutique ---------- */
  function genererNomBoutique() {
    if (Math.random() < 0.55) return 'Chez ' + piocher(COF.LIEUX_NOMS_PATRON);
    var sub = piocher(COF.LIEUX_TAVERNE_SUBST_F);
    var adj = piocher(COF.LIEUX_TAVERNE_ADJ_F);
    return (voyelle(sub) ? "À l'" : 'À la ') + sub + ' ' + adj;
  }
  var COMPOSANT_SOURCES = ['une créature sauvage', 'un monstre des environs', 'une bête abattue en chassant', 'un gibier peu commun'];
  function genererStock(type) {
    var tables = { ARMES_CONTACT: COF.ARMES_CONTACT, ARMES_DISTANCE: COF.ARMES_DISTANCE, ARMURES: COF.ARMURES,
      BOUCLIERS: COF.BOUCLIERS, MATERIEL: COF.MATERIEL, MONTURES: COF.MONTURES,
      BUTIN_COMPOSANTS: COF.BUTIN_COMPOSANTS, BUTIN_TRESORS: COF.BUTIN_TRESORS };
    var pool = [];
    (type.stocks || []).forEach(function (t) { pool = pool.concat(tables[t] || []); });
    pool = pool.filter(function (x) { return (x.prix || 0) > 0; });
    var n = 3 + alea(3);
    var out = [];
    for (var i = 0; i < n && pool.length; i++) {
      var it = piocher(pool);
      var nom = it.gabarit ? it.gabarit.replace('{nom}', piocher(COMPOSANT_SOURCES)) : it.nom;
      var prix = Math.max(1, Math.round(it.prix * (0.8 + Math.random() * 0.6) * 10) / 10);
      out.push({ nom: nom, prix: prix });
    }
    return out;
  }
  var CHAMPS_BOUTIQUE = [
    { id: 'type', label: 'Type de commerce', gen: function () { return piocher(COF.LIEUX_BOUTIQUE_TYPES); } },
    { id: 'nom', label: 'Enseigne', gen: function () { return genererNomBoutique(); } },
    { id: 'marchand', label: 'Marchand', gen: function () { return genererPersonne(false); } },
    { id: 'trait', label: 'Réputation', gen: function () { return piocher(COF.LIEUX_BOUTIQUE_TRAITS); } },
    { id: 'stock', label: 'Marchandise', gen: function (ctx) { return genererStock(ctx.type || COF.LIEUX_BOUTIQUE_TYPES[0]); } },
    { id: 'anecdote', label: 'Anecdote', gen: function () { return piocher(COF.LIEUX_BOUTIQUE_ANECDOTES); } }
  ];
  var GEN_BOUTIQUE = COF.creerGenerateurChamps(CHAMPS_BOUTIQUE);

  /* ---------- Village / ville ---------- */
  function genererNomVille() {
    return piocher(COF.LIEUX_VILLE_DEBUT) + (Math.random() < 0.5 ? '-' : '') + piocher(COF.LIEUX_VILLE_FIN);
  }
  var CHAMPS_ETABLISSEMENT = [
    { id: 'nom', label: 'Nom', gen: function () { return genererNomVille(); } },
    { id: 'taille', label: 'Taille', gen: function () { return piocher(COF.LIEUX_TAILLES); } },
    { id: 'specialite', label: 'Économie', gen: function () { return piocher(COF.LIEUX_SPECIALITES_ECO); } },
    { id: 'gouvernance', label: 'Gouvernance', gen: function () { return piocher(COF.LIEUX_GOUVERNANCE); } },
    { id: 'ambiance', label: 'Ambiance', gen: function () { return piocher(COF.LIEUX_AMBIANCES); } },
    { id: 'probleme', label: 'Problème du moment', gen: function () { return piocher(COF.LIEUX_PROBLEMES); } },
    { id: 'notable', label: 'Personnage notable', gen: function () { return genererPersonne(true); } }
  ];
  var GEN_ETABLISSEMENT = COF.creerGenerateurChamps(CHAMPS_ETABLISSEMENT);

  return {
    taverne: GEN_TAVERNE, boutique: GEN_BOUTIQUE, etablissement: GEN_ETABLISSEMENT,
    texteTenancier: texteTenancier
  };
})();
