/* ============================================================
   COF2 Compagnon — Échoppes, artisans et économie (mode aventure)
   Chaque village a ses bâtiments, selon sa taille, sa spécialité et
   son peuple : forge, herboristerie, bazar, tannerie, atelier de
   menuisier, écurie, temple, joaillier, alchimiste, librairie, guilde.
   Chacun a un nom, un artisan (nom selon sa culture, caractère, renom),
   un stock limité qui se renouvelle, une caisse pour racheter.
   Les prix dépendent de la taille du lieu, du renom et du caractère de
   l'artisan, de la saison, des pénuries (le problème du village), de
   la réputation du héros, de sa fidélité et du marchandage.
   On peut : acheter, vendre, marchander, passer commande (acompte,
   délai, retrait plus tard), louer l'atelier pour fabriquer soi-même
   (moteur d'artisanat : compétences et recettes du héros), payer des
   services (soins, bénédiction, carte de la région…).
   Tout se raconte dans le carnet.
   ============================================================ */
window.COF = window.COF || {};

COF.Echoppes = (function () {
  function p(l) { return l[Math.floor(Math.random() * l.length)]; }
  function d(n) { return 1 + Math.floor(Math.random() * n); }
  function T() { return COF.Conteur; }
  function K() { return COF.Carnet; }
  function M() { return COF.Monde; }
  function maj(t) { t = String(t || ''); return t.charAt(0).toUpperCase() + t.slice(1); }
  function uid() { return 'b' + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36); }

  /* ================= Tailles : prix, plafond de l'offre, caisse des marchands ================= */
  var TAILLES = {
    hameau: { rang: 0, mult: 1.2, plafond: 5, caisse: 40 }, village: { rang: 1, mult: 1.1, plafond: 12, caisse: 120 },
    bourg: { rang: 2, mult: 1, plafond: 40, caisse: 400 }, ville: { rang: 3, mult: 1, plafond: 999, caisse: 1500 }, cite: { rang: 4, mult: 0.95, plafond: 9999, caisse: 5000 }
  };
  function tailleDe(v) { var t = (v && v.taille) || 'village'; if (/cite|capitale|metropole/.test(t)) t = 'cite'; return TAILLES[t] ? t : 'village'; }
  var QUALITES = [null, { lib: 'modeste', etoiles: '★', mult: 0.88 }, { lib: 'solide', etoiles: '★★', mult: 1 }, { lib: 'renommée', etoiles: '★★★', mult: 1.25 }];
  var TRAITS = [
    { id: 'honnete', lib: 'honnête', mult: 1, dit: ['« Bienvenue. Prenez votre temps, tout est au juste prix. »', '« Si quelque chose vous plaît, demandez. »'] },
    { id: 'apre', lib: 'âpre au gain', mult: 1.12, dit: ['« Tout se paie, l’ami. Surtout la qualité. »', 'Le regard de {o} s’arrête d’abord sur la bourse de {h}.'] },
    { id: 'genereux', lib: 'généreux', mult: 0.93, dit: ['« Entrez, entrez ! On trouvera bien un arrangement. »', '{o} accueille {h} avec un grand sourire.'] },
    { id: 'bavard', lib: 'bavard', mult: 1, dit: ['{o} n’arrête pas de parler : du temps, des voisins, des prix qui montent…', '« Vous venez de loin ? Racontez-moi tout ! »'] },
    { id: 'bourru', lib: 'bourru', mult: 1, dit: ['{o} lève à peine les yeux : « Hmm. Qu’est-ce que vous voulez ? »', 'Un grognement en guise de bonjour.'] },
    { id: 'mefiant', lib: 'méfiant', mult: 1.05, dit: ['{o} détaille {h} de la tête aux pieds avant de dire un mot.', '« Je ne vous ai jamais vu{he} par ici. »'] },
    { id: 'passionne', lib: 'passionné', mult: 1.02, dit: ['{o} montre fièrement son dernier ouvrage : « Regardez-moi ce travail ! »', '« Ah, quelqu’un qui sait apprécier le bel ouvrage ! »'] }
  ];
  function trait(b) { return TRAITS.filter(function (t) { return t.id === b.trait; })[0] || TRAITS[0]; }

  /* ================= Les métiers ================= */
  function article(nom, pa, cat, item, plus) { return Object.assign({ nom: nom, pa: pa, cat: cat, item: item || { nom: nom } }, plus || {}); }
  function arme(a, dist) { return article(a.nom, a.prix, 'armes', dist ? { nom: a.nom, dm: a.dm, armeType: 'distance', portee: a.portee || null, crit: a.crit || 20, noFor: !!a.noFor, noteArme: a.note || null }
    : { nom: a.nom, dm: a.dm, dm2: a.dm2 || null, armeType: 'contact', crit: a.crit || 20, noFor: !!a.noFor, noteArme: a.note || null }, { note: a.note || '' }); }
  function armure(a, slot) { return article(a.nom, a.prix, 'armures', { nom: a.nom, def: a.def, slot: slot, note: a.note || null }); }
  var BOIS = ['baton', 'batonferre', 'gourdin', 'lance', 'epieu', 'javelot', 'pique'];
  function contact(f) { return (COF.ARMES_CONTACT || []).filter(function (a) { return a.prix > 0 && f(a); }).map(function (a) { return arme(a, false); }); }
  function distance(f) { return (COF.ARMES_DISTANCE || []).filter(function (a) { return a.prix > 0 && f(a); }).map(function (a) { return arme(a, true); }); }
  function materiel(re) { return (COF.MATERIEL || []).filter(function (a) { return re.test(a.nom); }).map(function (a) { return article(a.nom, a.prix, /Ration/.test(a.nom) ? 'vivres' : (/Potion/.test(a.nom) ? 'remedes' : 'materiel'), { nom: a.nom, note: a.note || null }, { note: a.note || '' }); }); }
  var HERBES = { nom: 'Herbes médicinales', desc: 'Rend 1d4° PV (préparées en cataplasme).' };
  var SIMPLES = 'Simples cueillis';

  var TYPES = {
    bazar: { ic: '🧺', lib: 'Bazar', metier: ['marchand', 'marchande'], min: 0, chance: 1, comp: null, rachete: { materiel: 0.45, vivres: 0.4, '*': 0.3 },
      noms: ['Le Bazar de {P}', 'Au Comptoir {A}', 'Chez {P}', 'L’Échoppe du Carrefour', 'Au Bon Débarras', 'Le Comptoir {de_F}'], adj: ['du Voyageur', 'des Quatre Chemins', 'd’Abondance', 'du Pont'],
      decor: ['Des sacs, des cordes, des lanternes pendent du plafond ; ça sent la cire et le cuir.', 'Un fouillis organisé : tonneaux, caisses, outils, et un chat endormi sur le comptoir.'],
      vend: function () { return materiel(/./).filter(function (a) { return !/Potion/.test(a.nom); }).concat([article('Rations (×3 jours)', 2, 'vivres', null, { effet: 'rations', n: 3, note: 'Pain, lard, fromage sec.' })]); } },
    forge: { ic: '⚒️', lib: 'Forge', metier: ['forgeron', 'forgeronne'], min: 0, chance: 0.55, comp: 'forge', rachete: { armes: 0.5, armures: 0.5 }, loyer: 6,
      noms: ['La Forge de {P}', 'L’Enclume {Af}', 'Au Marteau {A}', 'La Forge {de_F}', 'Le Soufflet de {P}', 'Au Fer {A}'], adj: ['d’Or', 'Rouge', ['Ardent', 'Ardente'], ['Chantant', 'Chantante'], 'de Fer', ['Noir', 'Noire']],
      parPeuple: { nain: ['La Forge-Profonde de {P}', 'L’Enclume des Ancêtres', 'Le Marteau de {P}, {fils} de la Montagne'], gnome: ['L’Atelier à Engrenages de {P}'] },
      decor: ['La chaleur de la forge saute au visage ; le marteau sonne sur l’enclume en cadence.', 'Des lames attendent sur un râtelier, encore bleuies par la trempe. Ça sent le charbon et le métal chaud.'],
      vend: function () { return contact(function (a) { return BOIS.indexOf(a.id) < 0; }).concat(COF.ARMURES.filter(function (a) { return /chemise|cotte|plaque|mailles/i.test(a.id + a.nom) && a.prix; }).map(function (a) { return armure(a, 'armure'); }),
        COF.BOUCLIERS.filter(function (a) { return a.id !== 'aucun' && a.prix; }).map(function (a) { return armure(a, 'bouclier'); })); },
      familles: ['lames', 'haches', 'masses', 'lances'], armures: ['mailles', 'plaques', 'boucliers'] },
    herboriste: { ic: '🌿', lib: 'Herboristerie', metier: ['herboriste', 'herboriste'], min: 0, chance: 0.55, comp: 'alchimie', rachete: { remedes: 0.55, simples: 0.6 }, loyer: 3, soins: true,
      noms: ['Aux Herbes de {P}', 'La Mandragore {Af}', 'L’Herboristerie {de_F}', 'Le Jardin de {P}', 'Au Simple Remède', 'La Fiole {Af}'], adj: [['Vert', 'Verte'], 'Sage', ['Bleu', 'Bleue'], ['Chantant', 'Chantante']],
      parPeuple: { elfesylvain: ['Le Bosquet de {P}', 'Les Racines de Lune'], elfehaut: ['Le Jardin des Étoiles'], halfelin: ['Les Tisanes de {P}', 'Au Pot de Miel'] },
      decor: ['Des bouquets sèchent la tête en bas ; l’air embaume la menthe, la sauge et quelque chose de plus âcre.', 'Des bocaux étiquetés à la main couvrent les murs, du sol au plafond.'],
      vend: function () { return materiel(/Potion/).concat([article(HERBES.nom, 2, 'remedes', { nom: HERBES.nom, desc: HERBES.desc }), article('Antidote', 15, 'remedes', { nom: 'Antidote', desc: 'Annule un poison ordinaire.' }),
        article('Tisane revigorante', 3, 'remedes', { nom: 'Tisane revigorante', desc: 'Chasse la fatigue : +1d4 PV au réveil.' })]); },
      magie: ['potion', 1] },
    tanneur: { ic: '🧵', lib: 'Tannerie', metier: ['tanneur', 'tanneuse'], min: 1, chance: 0.5, comp: 'façonnage', rachete: { armures: 0.45, materiel: 0.35 }, loyer: 3,
      noms: ['La Tannerie de {P}', 'Au Cuir {A}', 'Chez {P}, cuirs et peaux', 'L’Atelier {de_F}'], adj: ['Souple', 'Fauve', 'Noir', 'd’Or'],
      decor: ['L’odeur des cuves de tannage prend à la gorge ; des peaux sèchent sur des cadres.', 'Des selles, des ceinturons et des pourpoints pendent aux murs.'],
      vend: function () { return COF.ARMURES.filter(function (a) { return /matelasse|cuir/.test(a.id); }).map(function (a) { return armure(a, 'armure'); }).concat(materiel(/Sac|Couverture/)); },
      armures: ['cuir'] },
    menuisier: { ic: '🪚', lib: 'Atelier de menuisier', metier: ['menuisier', 'menuisière'], min: 1, chance: 0.45, comp: 'façonnage', rachete: { armes: 0.4, materiel: 0.35 }, loyer: 3,
      noms: ['L’Atelier de {P}', 'Au Copeau {A}', 'La Flèche {Af}', 'Arcs et Bois de {P}'], adj: ['d’Or', ['Droit', 'Droite'], ['Vif', 'Vive'], 'du Chêne'],
      parPeuple: { elfesylvain: ['L’Arc de {P}', 'Le Saule Courbé'] },
      decor: ['Des copeaux couvrent le sol ; des arcs non cordés attendent contre le mur.', 'L’atelier sent la résine et la colle chaude.'],
      vend: function () { return distance(function () { return true; }).concat(contact(function (a) { return BOIS.indexOf(a.id) >= 0; }), materiel(/Carquois/), COF.BOUCLIERS.filter(function (a) { return a.id === 'petit'; }).map(function (a) { return armure(a, 'bouclier'); })); },
      familles: ['arcs', 'arbaletes', 'batons'] },
    ecurie: { ic: '🐴', lib: 'Écurie', metier: ['palefrenier', 'palefrenière'], min: 1, chance: 0.5, comp: null, rachete: { montures: 0.6 },
      noms: ['Les Écuries de {P}', 'Au Fer {A}', 'Le Relais {de_F}', 'Le Haras {A}'], adj: ['à Cheval', 'du Galop', 'des Plaines', ['Fringant', 'Fringante']],
      decor: ['Les chevaux s’ébrouent dans leurs stalles ; ça sent la paille et le crottin.', 'Un poulain curieux passe la tête par-dessus la barrière.'],
      vend: function () { return (COF.MONTURES || []).map(function (a) { return article(a.nom, a.prix, 'montures', { nom: a.nom, note: a.note || null }, { note: a.note || '' }); }); } },
    temple: { ic: '⛪', lib: 'Temple', metier: ['prêtre', 'prêtresse'], min: 0, chance: 0.4, comp: null, rachete: {}, services: ['soinsTemple', 'benediction', 'offrande'],
      noms: ['Le Temple {A}', 'La Chapelle {de_F}', 'Le Sanctuaire {A}'], adj: ['de l’Aube', 'du Soleil', 'des Moissons', 'de la Lune', 'du Gardien'],
      parPeuple: { nain: ['Le Sanctuaire des Ancêtres'], elfesylvain: ['Le Cercle des Arbres Anciens'] },
      decor: ['Une lumière douce tombe des vitraux ; l’encens flotte en volutes paresseuses.', 'Quelques fidèles prient à voix basse devant l’autel.'],
      vend: function () { return []; } },
    joaillier: { ic: '💎', lib: 'Joaillerie', metier: ['joaillier', 'joaillière'], min: 2, chance: 0.5, comp: 'lapidage', rachete: { bijoux: 0.6, magie: 0.5 }, loyer: 10,
      noms: ['La Joaillerie {de_F}', 'Au Saphir {A}', 'L’Écrin de {P}', 'La Gemme {Af}'], adj: [['Bleu', 'Bleue'], ['Étincelant', 'Étincelante'], 'd’Argent', ['Royal', 'Royale']],
      decor: ['Derrière une vitre épaisse, des bagues et des pendentifs scintillent ; un garde somnole près de la porte.', 'Une loupe vissée à l’œil, {o} ne relève la tête qu’au tintement de la clochette.'],
      vend: function () { return []; }, magie: ['objet', 2] },
    alchimiste: { ic: '⚗️', lib: 'Officine d’alchimie', metier: ['alchimiste', 'alchimiste'], min: 2, chance: 0.55, comp: 'alchimie', rachete: { remedes: 0.5, magie: 0.5, simples: 0.5 }, loyer: 10,
      noms: ['L’Officine de {P}', 'Le Creuset {A}', 'L’Alambic {A}', 'Aux Mille Fioles'], adj: ['d’Or', 'Fumant', 'Pourpre', 'Philosophal'],
      decor: ['Des alambics glougloutent ; une fumée violette s’échappe d’un creuset.', 'Une odeur de soufre et de fleurs fanées flotte entre les étagères.'],
      vend: function () { return materiel(/Potion/).concat([article('Antidote', 15, 'remedes', { nom: 'Antidote', desc: 'Annule un poison ordinaire.' })]); }, magie: ['potion', 3] },
    libraire: { ic: '📜', lib: 'Librairie', metier: ['libraire', 'libraire'], min: 3, chance: 0.6, comp: null, rachete: { ecrits: 0.5 }, services: ['carte'],
      noms: ['La Plume {Af}', 'Aux Vieux Grimoires', 'La Librairie {de_F}', 'Le Scriptorium de {P}'], adj: ['d’Oie', ['Savant', 'Savante'], 'Sage', 'd’Argent'],
      decor: ['Des piles de livres menacent de s’écrouler ; la poussière danse dans la lumière.', 'Un silence de cloître ; seul crisse la plume d’un copiste.'],
      vend: function () { return materiel(/écriture/).concat([article('Parchemin vierge (×5)', 2, 'ecrits'), article('Traité de botanique', 30, 'ecrits', { nom: 'Traité de botanique', desc: 'Un livre savant sur les plantes de la région.' })]); } },
    guilde: { ic: '🏛️', lib: 'Maison des artisans', metier: ['maître de guilde', 'maîtresse de guilde'], min: 3, chance: 0.7, comp: '*', rachete: { armes: 0.45, armures: 0.45, remedes: 0.45, bijoux: 0.5 }, loyer: 8,
      noms: ['La Maison des Artisans', 'La Guilde {Af}', 'Le Hall des Métiers'], adj: ['des Mains d’Or', 'du Marteau et de la Plume', 'des Bâtisseurs'],
      decor: ['Dans la grande salle, des apprentis vont et viennent ; on loue ici des ateliers pour tous les métiers.', 'Des bannières de corporations pendent aux poutres.'],
      vend: function () { return []; }, familles: ['lames', 'haches', 'masses', 'lances', 'arcs', 'arbaletes'], armures: ['cuir', 'mailles', 'plaques', 'boucliers'] }
  };
  /* le marchand ambulant : de passage seulement (événement de village) */
  TYPES.colporteur = { ic: '🛒', lib: 'Roulotte de colporteur', metier: ['colporteur', 'colporteuse'], min: 99, chance: 0, comp: null, rachete: { '*': 0.35, bijoux: 0.5, magie: 0.45 },
    noms: ['La Roulotte de {P}', 'Les Merveilles de {P}', 'Les Curiosités {A}'], adj: ['d’Orient', 'du Bout du Monde', 'des Sept Routes'],
    decor: ['La roulotte déborde de bric-à-brac : épices, tapis, fioles, cartes jaunies, et un perroquet qui jure.', 'Sous une bâche bariolée s’entassent des objets venus de royaumes dont {h} n’a jamais entendu parler.'],
    vend: function () { return [article('Épices rares', 8, 'vivres', { nom: 'Épices rares', desc: 'Safran, poivre noir : un luxe qui se revend bien en ville.' }), article('Longue-vue', 60, 'materiel', { nom: 'Longue-vue', desc: 'Voir loin : +2 aux tests de PER à distance.' }),
      article('Boussole naine', 40, 'materiel', { nom: 'Boussole naine', desc: 'Ne perd jamais le nord : avantage pour s’orienter.' }), article('Carte au trésor (douteuse)', 15, 'ecrits', { nom: 'Carte au trésor (douteuse)', desc: 'Vraie ? Fausse ? À voir.' })].concat(materiel(/Outils|Grappin|Lanterne/)); },
    magie: ['objet', 2] };
  var ORDRE = ['bazar', 'forge', 'herboriste', 'temple', 'tanneur', 'menuisier', 'ecurie', 'alchimiste', 'joaillier', 'libraire', 'guilde'];
  /* la spécialité du village garantit (et améliore) le métier correspondant */
  var SPEC = [[/forge|métal|fer\b|acier|armur|arme|mine/i, 'forge'], [/cuir|tann|peau|fourrure/i, 'tanneur'], [/herb|plante|alchim|potion|remède|guériss/i, 'herboriste'],
    [/cheva|élevage|haras|monture/i, 'ecurie'], [/bois|bûcher|charpent|menuis/i, 'menuisier'], [/joaill|gemme|orfèvr|pierre/i, 'joaillier'], [/temple|pèlerin|sanctuaire|religi/i, 'temple']];

  /* ================= Génération des bâtiments ================= */
  function nomDe(c, b, pe) {
    var t = TYPES[b.type], l = (t.parPeuple && t.parPeuple[pe] && Math.random() < 0.5 ? t.parPeuple[pe] : t.noms);
    var fam = b.owner.famille || b.owner.prenom;
    var deF = /^(de|du|des)\s|^d[’']/i.test(fam) ? fam : (/^[aeiouyàâéèêîôûhœ]/i.test(fam) ? 'd’' + fam : 'de ' + fam);
    var adj = p(t.adj || ['']), am = Array.isArray(adj) ? adj[0] : adj, af = Array.isArray(adj) ? adj[1] : adj;
    return T().polir(p(l).replace(/\{P\}/g, b.owner.prenom).replace(/\{de_F\}/g, deF).replace(/\{Af\}/g, af).replace(/\{A\}/g, am)
      .replace(/\{fils\}/g, b.owner.genre === 'féminin' ? 'fille' : 'fils')).replace(/\s+/g, ' ').trim();
  }
  /* Articles d'un nom d'échoppe : « le Comptoir de Brisna » → « au Comptoir… », « du Comptoir… » ;
     une enseigne (« Au Bon Débarras », « Chez Balur ») reste entre guillemets. */
  function formes(nom) {
    var m = /^(Le|La|Les|L’|L')\s?(.*)$/.exec(nom);
    if (m) {
      var r = m[2], art = m[1];
      if (art === 'Le') return { n: 'le ' + r, a: 'au ' + r, de: 'du ' + r };
      if (art === 'Les') return { n: 'les ' + r, a: 'aux ' + r, de: 'des ' + r };
      if (art === 'La') return { n: 'la ' + r, a: 'à la ' + r, de: 'de la ' + r };
      return { n: 'l’' + r, a: 'à l’' + r, de: 'de l’' + r };
    }
    return { n: '« ' + nom + ' »', a: 'chez « ' + nom + ' »', de: 'de « ' + nom + ' »' };
  }
  function creer(c, l, type, pe, qual) {
    var genre = Math.random() < 0.5 ? 'féminin' : 'masculin', peO = Math.random() < 0.85 ? pe : 'humain';
    var nom = COF.Culture ? COF.Culture.nomPersonne(peO, genre) : (COF.Aventure.pnj({ genre: genre }).nom);
    var parts = String(nom).split(' ');
    var b = { id: uid(), type: type, owner: { nom: nom, prenom: parts[0], famille: parts.slice(1).join(' '), genre: genre, peuple: peO },
      trait: p(TRAITS).id, qualite: qual || (Math.random() < 0.2 ? 1 : Math.random() < 0.75 ? 2 : 3), achats: 0, stock: null, stockJour: -99, caisse: 0 };
    b.nom = nomDe(c, b, pe);
    return b;
  }
  /* Les bâtiments du village (générés une fois, puis gardés). */
  function batiments(c, l) {
    if (!l || !(l.ville || l.env === 'urbain')) return [];
    if (COF.Villes) COF.Villes.assurer(l);
    var v = l.ville; if (v.batiments) return v.batiments;
    var tl = TAILLES[tailleDe(v)], pe = l.peuple || v.peuple || 'humain', spec = null;
    SPEC.forEach(function (x) { if (!spec && x[0].test(v.specialite || '')) spec = x[1]; });
    var out = [];
    ORDRE.forEach(function (type) {
      var t = TYPES[type], garanti = type === spec || type === 'bazar';
      if (!garanti && (tl.rang < t.min || Math.random() > t.chance + (tl.rang - t.min) * 0.15)) return;
      out.push(creer(c, l, type, pe, type === spec ? 3 : null));
      /* deux forges ou deux herboristes dans une cité : la concurrence fait baisser les prix */
      if (tl.rang >= 4 && (type === 'forge' || type === 'herboriste' || type === 'bazar') && Math.random() < 0.6) out.push(creer(c, l, type, pe));
    });
    v.batiments = out;
    v.eco = economie(v);
    K().sauver(c);
    return out;
  }
  function batiment(c, l, id) {
    if (id === 'maison' && COF.Village) return COF.Village.atelierMaison(c, l);
    return batiments(c, l).filter(function (b) { return b.id === id; })[0] || null;
  }
  /* Un bâtiment de passage (roulotte de colporteur) jusqu'au jour fin. */
  function creerTemp(c, l, type, fin) {
    var bs = batiments(c, l), b = creer(c, l, type, l.peuple || 'humain', 2);
    b.temp = fin; bs.push(b);
    return b;
  }

  /* ================= Économie ================= */
  function economie(v) {
    var pb = (v.probleme || '') + ' ' + (v.ambiance || ''), sp = v.specialite || '', e = { prosperite: 0, penurie: null, lib: '' };
    if (/pauvr|misère|disette|famine|sécheresse|récolte|ruin|dette|impôt|taxe/i.test(pb)) e.prosperite = -1;
    if (/commerce|foire|marchand|riche|prosp|négoce|port|caravane/i.test(sp + ' ' + pb)) e.prosperite = Math.min(1, e.prosperite + 1);
    if (/disette|famine|récolte|sécheresse|grain|faim/i.test(pb)) e.penurie = 'vivres';
    else if (/malad|épidém|peste|fièvre|poison/i.test(pb)) e.penurie = 'remedes';
    else if (/bandit|brigand|guerre|attaque|raid|orc|gobelin|loup|monstre/i.test(pb)) e.penurie = 'armes';
    e.lib = (e.prosperite > 0 ? 'Village prospère : les marchands ont de quoi racheter.' : e.prosperite < 0 ? 'Temps difficiles : l’argent manque, et tout se négocie.' : 'Une économie modeste, sans éclat.') +
      (e.penurie ? ' Pénurie de ' + { vivres: 'vivres', remedes: 'remèdes', armes: 'armes' }[e.penurie] + ' : les prix flambent.' : '');
    return e;
  }
  function saisonMult(c, cat) {
    var i = COF.Saisons ? COF.Saisons.info(c).i : 0;
    if (cat === 'vivres') return [1, 0.9, 0.95, 1.3][i];
    if (cat === 'remedes') return [1, 1, 1.05, 1.15][i];
    return 1;
  }
  function heros(c) { return T().heros(c); }
  function rep(l) { return COF.Saga ? COF.Saga.reputation(l) : 0; }
  function marchande(c, b) { return b.marchande && b.marchande.jour === c.jour ? b.marchande : null; }
  /* Prix d'achat d'un article (en pa), et le détail de ce qui le fait varier. */
  function prix(c, l, b, a) {
    var v = l.ville, e = v.eco || (v.eco = economie(v)), tl = TAILLES[tailleDe(v)], m = tl.mult * QUALITES[b.qualite].mult * trait(b).mult;
    m *= saisonMult(c, a.cat);
    if (COF.Village) m *= COF.Village.multPrix(c, l, a.cat);   /* foire, taxes, disette… */
    if (COF.Bandes) m *= COF.Bandes.multPrix(c, l);            /* routes peu sûres : tout coûte plus cher */
    if (e.penurie && e.penurie === a.cat) m *= 1.5;
    if (e.prosperite < 0 && a.cat !== 'vivres') m *= 0.95;
    m *= 1 - 0.05 * rep(l) * (b.trait === 'mefiant' ? 1.5 : 1);
    m *= 1 - Math.min(0.1, 0.02 * (b.achats || 0));                       /* client fidèle */
    var mc = marchande(c, b); if (mc) m *= mc.mult;
    if (concurrence(c, l, b)) m *= 0.94;
    return Math.max(1, Math.round(a.pa * m));
  }
  function concurrence(c, l, b) { return (l.ville.batiments || []).filter(function (x) { return x.type === b.type; }).length > 1; }

  /* ---------- Stock : limité, renouvelé tous les 5 jours ---------- */
  function stock(c, l, b) {
    var v = l.ville, tl = TAILLES[tailleDe(v)], t = TYPES[b.type];
    if (!b.stock || c.jour - b.stockJour >= 5) {
      var plafond = tl.plafond * (b.qualite === 3 ? 3 : 1), N = Math.max(1, (heros(c) || {}).niveau || 1);
      var l0 = t.vend().filter(function (a) { return a.pa > 0 && (a.cat === 'montures' ? tl.rang >= 1 : a.pa <= plafond); });
      /* pénurie : moins de marchandise de ce type */
      var pen = (v.eco || {}).penurie;
      b.stock = l0.map(function (a) { var q = Math.max(0, d(2 + tl.rang) - (pen === a.cat ? 2 : 0)); return Object.assign({}, a, { qte: a.cat === 'montures' ? Math.min(q, 2) : q }); }).filter(function (a) { return a.qte > 0; });
      /* objets magiques selon le métier et la taille du lieu */
      if (t.magie && COF.Recompense && tl.rang >= 1) {
        var nb = Math.max(0, t.magie[1] + tl.rang - 2 + (b.qualite === 3 ? 1 : 0)), vus = {};
        for (var i = 0; i < nb * 3 && Object.keys(vus).length < nb; i++) {
          var mo = COF.Recompense.tirerObjetLivre(N + (b.qualite === 3 ? 1 : 0), t.magie[0]); if (!mo || vus[mo.nom]) continue;
          vus[mo.nom] = 1;
          b.stock.push({ nom: mo.nom, pa: Math.max(10, (mo.item.prix || 1) * 10), cat: 'magie', item: mo.item, qte: 1, magique: true, note: (mo.source || '') + (mo.niveau ? ' · niveau ' + mo.niveau : '') });
        }
      }
      b.stockJour = c.jour;
      b.caisse = Math.round(tl.caisse * (0.6 + 0.2 * b.qualite) * (1 + 0.25 * ((v.eco || {}).prosperite || 0)));
      K().sauver(c);
    }
    return b.stock;
  }

  /* ================= Récit : contexte et phrases ================= */
  function ctx(c, l, b) {
    var cx = T().contexte(c, K().sceneCourante(c)), fo = formes(b.nom), t = TYPES[b.type], f = b.owner.genre === 'féminin';
    return Object.assign(cx, { o: b.owner.prenom, onom: b.owner.nom, n: fo.n, a_n: fo.a, de_n: fo.de, metier: t.metier[f ? 1 : 0], oil: f ? 'elle' : 'il', oe: f ? 'e' : '', village: l.nom });
  }
  function dire(t, cx) { return T().dire(t, cx); }
  /* La scène où se racontent les affaires : la scène en cours, ou une visite ouverte pour l'occasion. */
  function scene(c, l, b) {
    var s = K().sceneCourante(c);
    if (s && s.echoppe && s.echoppe.batId === b.id) return s;
    return entrer(c, l, b);
  }
  /* Entrer dans une échoppe : une scène de visite s'ouvre (ou la scène en cours s'y transporte). */
  function entrer(c, l, b) {
    var s = K().sceneCourante(c);
    if (s && s.echoppe && s.echoppe.batId === b.id) return s;
    if (s && s.type === 'echoppe') sortir(c, true);
    s = K().sceneCourante(c);
    if (!s) {
      /* même objet aventure tout du long : rien ne se perd à l'enregistrement */
      K().nouvelleScene(c, b.nom, '', { type: 'echoppe', sansTest: true });
      s = K().sceneCourante(c);
    }
    s.echoppe = { lieuId: l.id, batId: b.id };
    var cx = ctx(c, l, b);
    if (b.maison) {
      cx.chezsoi = cx.hil === 'elle' ? 'chez elle' : 'chez lui';
      K().ajouterEntree(c, { t: 'recit', txt: dire(['{h} rentre {chezsoi} et gagne l’atelier, au fond de la maison. Les outils attendent, bien rangés.', 'L’atelier de la maison sent le bois et l’huile. Tout est à portée de main.'], cx), a: 'Rentrer à l’atelier' });
      K().sauver(c); return K().sceneCourante(c);
    }
    var txt = dire(['La clochette tinte quand {h} pousse la porte {de_n}.', '{h} entre {a_n}.', 'Sur l’enseigne, on lit : « ' + b.nom + ' ». {h} pousse la porte.'], cx) + ' ' + dire(TYPES[b.type].decor, cx) + ' ' +
      dire(['{o} est là, {metier} {qlib}.', 'Voici {o}, {metier}{qrenom}.'], Object.assign({ qlib: b.qualite === 3 ? 'réputé{oe} dans toute la région' : b.qualite === 1 ? 'aux moyens modestes' : 'au travail solide', qrenom: b.qualite === 3 ? ', dont on vante le savoir-faire jusqu’à la ville' : '' }, cx));
    /* « Katelle est là… Katelle lève à peine les yeux » → « Elle lève à peine les yeux » */
    var dit = dire(trait(b).dit, cx);
    if (dit.indexOf(b.owner.prenom + ' ') === 0) dit = (b.owner.genre === 'féminin' ? 'Elle' : 'Il') + dit.slice(b.owner.prenom.length);
    txt += ' ' + dit;
    K().ajouterEntree(c, { t: 'recit', txt: txt, a: 'Entrer ' + cx.a_n });
    K().sauver(c);
    return K().sceneCourante(c);
  }
  function sortir(c, silencieux) {
    var s = K().sceneCourante(c); if (!s) return;
    if (s.type === 'echoppe') {
      var ten = c.tension;
      if (!silencieux) K().ajouterEntree(c, { t: 'recit', txt: dire(['{h} salue et ressort dans la rue.', 'La porte se referme derrière {h}.', '{h} reprend sa route, la bourse un peu plus légère… ou plus lourde.'], T().contexte(c, s)) });
      K().clore(c, true, resumeVisite(s));
      c.tension = ten; K().sauver(c);
    } else if (s.echoppe) { delete s.echoppe; K().sauver(c); }
  }
  function resumeVisite(s) {
    var faits = s.entrees.filter(function (e) { return e.a && !/^Entrer/.test(e.a); }).map(function (e) { return e.a.toLowerCase(); });
    return faits.length ? 'Une visite : ' + faits.slice(0, 4).join(', ') + '.' : 'Une simple visite.';
  }
  function noter(c, txt, m, a, ok) { K().ajouterEntree(c, { t: 'recit', txt: txt, m: m || '', a: a, ok: ok !== false }); }

  /* ================= Bourse ================= */
  function bourse(h) { var b = h.bourse || {}; return (b.po || 0) * 10 + (b.pa || 0); }
  function payer(h, pa) { return COF.Artisanat.payer(h, pa); }
  function crediter(h, pa) { var b = h.bourse = h.bourse || { po: 0, pa: 0, pc: 0 }, t = (b.po || 0) * 10 + (b.pa || 0) + pa; b.po = Math.floor(t / 10); b.pa = t % 10; }
  function fmt(pa) { return pa >= 10 ? Math.floor(pa / 10) + ' po' + (pa % 10 ? ' ' + (pa % 10) + ' pa' : '') : pa + ' pa'; }

  /* ================= Acheter ================= */
  var ACHAT = ['{o} emballe l’achat dans un vieux linge : « Bon choix. »', '{h} paie ; {o} glisse les pièces dans sa bourse sans les compter.', '{o} pose {obj} sur le comptoir : « Vous ne serez pas déçu{he}. »',
    '{o} souffle sur {obj} pour en chasser la poussière, puis le tend à {h}.', 'Marché conclu. {o} hoche la tête, satisfait{oe}.'];
  function acheter(c, l, b, i) {
    var h = heros(c), st = stock(c, l, b), a = st[i]; if (!h || !a || a.qte < 1) return { err: 'Plus en stock.' };
    var pr = prix(c, l, b, a);
    if (!payer(h, pr)) return { err: 'Pas assez d’argent (' + fmt(pr) + ').' };
    a.qte--; b.achats = (b.achats || 0) + 1; b.caisse += Math.round(pr * 0.5);
    var m = ['−' + fmt(pr)];
    if (a.effet === 'rations') { c.ressources = c.ressources || {}; c.ressources.rations = (c.ressources.rations || 0) + a.n; m.push('🍞 rations ' + c.ressources.rations); }
    else if (/^Torches/.test(a.nom)) { c.ressources = c.ressources || {}; c.ressources.torches = (c.ressources.torches || 0) + 3; m.push('🔥 torches ' + c.ressources.torches); }
    else if (/^Ration \(1 semaine\)/.test(a.nom)) { c.ressources = c.ressources || {}; c.ressources.rations = (c.ressources.rations || 0) + 7; m.push('🍞 rations ' + c.ressources.rations); }
    else {
      var it = COF.Store.ajouterObjet(h, Object.assign({}, a.item, { nom: (a.magique ? '✨ ' : '') + a.item.nom, qte: 1, prix: Math.round(pr / 10) }));
      if (it) it.prixPa = a.pa;
      m.push('🎒 ' + a.nom);
    }
    COF.Store.sauver(h);
    if (b.achats === 5) m.push('⭐ client fidèle : ' + b.owner.prenom + ' fait désormais des prix');
    var cx = Object.assign(ctx(c, l, b), { obj: '« ' + a.nom + ' »' });
    scene(c, l, b);
    noter(c, dire(ACHAT, cx), m.join(' · '), 'Acheter : ' + a.nom);
    K().sauver(c);
    return { ok: true, pr: pr };
  }

  /* ================= Vendre ================= */
  function categorie(o) {
    var n = String(o.nom || '');
    if (/^✨/.test(n) || /Niveau de magie/.test(o.desc || '')) return /anneau|bague|collier|amulette|broche|diadème/i.test(n) ? 'bijoux' : 'magie';
    if (o.slot || o.def) return 'armures';
    if (/potion|élixir|herbe|baume|antidote|tisane|onguent/i.test(n)) return 'remedes';
    if (n === SIMPLES) return 'simples';
    if (/bague|anneau|collier|amulette|gemme|pierre|bijou|broche|perle/i.test(n)) return 'bijoux';
    if (/livre|traité|parchemin|grimoire|carte/i.test(n)) return 'ecrits';
    if (/cheval|poney|mule|âne|carriole|chariot/i.test(n)) return 'montures';
    var h = COF.Store.actif && COF.Store.actif(); if (h && (h.armes || []).some(function (w) { return w.nom === n || '✨ ' + w.nom === n; })) return 'armes';
    if (/épée|hache|dague|masse|marteau|arc|arbalète|lance|bâton|fléau|rapière|sabre|javelot|gourdin/i.test(n)) return 'armes';
    return 'materiel';
  }
  var TABLES = null;
  function valeur(o) {
    if (typeof o.prixPa === 'number') return o.prixPa;
    if (/^✨/.test(o.nom) || /Niveau de magie/.test(o.desc || '')) return (o.prix || 0) * 10;
    if (!TABLES) {
      TABLES = {}; [].concat(COF.ARMES_CONTACT || [], COF.ARMES_DISTANCE || [], COF.ARMURES || [], COF.BOUCLIERS || [], COF.MATERIEL || [], COF.MONTURES || []).forEach(function (x) { if (x.prix) TABLES[x.nom.toLowerCase()] = x.prix; });
      TABLES[HERBES.nom.toLowerCase()] = 2; TABLES[SIMPLES.toLowerCase()] = 1; TABLES.antidote = 15;
    }
    return TABLES[String(o.nom).toLowerCase()] || o.prix || 0;
  }
  function tauxRachat(b, cat) { var r = TYPES[b.type].rachete || {}; return r[cat] !== undefined ? r[cat] : (r['*'] || 0); }
  /* Ce que le marchand propose pour chaque objet de l'inventaire (0 : ça ne l'intéresse pas). */
  function offresVente(c, l, b) {
    var h = heros(c); if (!h) return [];
    stock(c, l, b);
    return (h.inventaire || []).map(function (o, i) {
      var cat = categorie(o), taux = tauxRachat(b, cat), v = valeur(o);
      var pr = taux && v ? Math.max(1, Math.floor(v * taux * (b.trait === 'apre' ? 0.9 : b.trait === 'genereux' ? 1.08 : 1) * (1 + 0.03 * rep(l)))) : 0;
      return { i: i, o: o, cat: cat, pr: pr, refus: !pr ? 'ça n’intéresse pas ' + b.owner.prenom : (pr > b.caisse ? 'la caisse est trop maigre (' + fmt(b.caisse) + ')' : '') };
    });
  }
  var VENTE = ['{o} examine {obj} sous toutes les coutures, puis compte les pièces.', '« Hmm… je peux en tirer quelque chose. » {o} pose l’argent sur le comptoir.', '{o} fait la moue, mais paie.'];
  function vendre(c, l, b, i) {
    var h = heros(c), of = offresVente(c, l, b).filter(function (x) { return x.i === i; })[0];
    if (!h || !of) return { err: 'Objet introuvable.' };
    if (!of.pr || of.refus) return { err: maj(of.refus || 'refusé') + '.' };
    var o = of.o;
    if (o.caracBonus && o.equipe && h.carac) h.carac[o.caracBonus.id] = (h.carac[o.caracBonus.id] || 0) - o.caracBonus.val;
    if (o.qte > 1) o.qte--; else h.inventaire.splice(i, 1);
    var nomA = String(o.nom).replace(/^✨ /, ''), ia = (h.armes || []).map(function (w) { return w.nom; }).indexOf(o.nom); if (ia < 0) ia = (h.armes || []).map(function (w) { return w.nom; }).indexOf(nomA);
    if (ia >= 0 && !(h.inventaire || []).some(function (x) { return x.nom === o.nom; })) h.armes.splice(ia, 1);
    crediter(h, of.pr); b.caisse -= of.pr; COF.Store.sauver(h);
    var cx = Object.assign(ctx(c, l, b), { obj: '« ' + nomA + ' »' });
    scene(c, l, b);
    noter(c, dire(VENTE, cx), '+' + fmt(of.pr), 'Vendre : ' + nomA);
    K().sauver(c);
    return { ok: true, pr: of.pr };
  }

  /* ================= Marchander (une fois par jour et par échoppe) ================= */
  function marchander(c, l, b) {
    if (marchande(c, b)) return { err: 'Déjà marchandé aujourd’hui.' };
    var h = heros(c); if (!h) return {};
    var diff = 12 + (b.trait === 'apre' ? 3 : 0) + (b.trait === 'genereux' ? -2 : 0) + (b.qualite === 3 ? 2 : 0) - rep(l);
    var mod = COF.Calc.carac(h, 'CHA'), bt = COF.Effets ? COF.Effets.bonusTest(h, 'CHA', ['négoc', 'marchand', 'persua', 'baratin']) : null;
    if (bt) mod += bt.bonus;
    var r = COF.Dice.test({ mod: mod, difficulte: diff, bonus: bt && bt.deBonus }), ok = !!r.reussite, cx = ctx(c, l, b);
    b.marchande = { jour: c.jour, mult: ok ? (r.crit ? 0.85 : 0.9) : 1.08 };
    scene(c, l, b);
    noter(c, dire(ok ? ['{h} fait mine de partir ; {o} le rattrape : « Bon, bon… je vous fais un prix. »', 'Après un long marchandage, {o} lève les mains : « Vous me ruinez ! » Mais {oil} accepte.', 'Un compliment sur la qualité du travail, une remarque sur la concurrence… et les prix baissent.']
      : ['{o} croise les bras : « Mes prix sont mes prix. » Et ils viennent même d’augmenter.', '« Vous me prenez pour un{oe} débutant{oe} ? » {o} est vexé{oe}.', 'Le marchandage tourne court ; {o} n’apprécie pas.'], cx),
      'CHA ' + (mod >= 0 ? '+' : '') + mod + ' : ' + r.total + ' contre ' + diff + ' · ' + (ok ? 'réussite' : 'échec') + ' · ' + (ok ? 'prix −' + Math.round((1 - b.marchande.mult) * 100) + ' % aujourd’hui' : 'prix +8 % aujourd’hui'), 'Marchander', ok);
    var e = K().sceneCourante(c); if (e) { var der = e.entrees[e.entrees.length - 1]; if (der) der.v = ok ? (r.crit ? 'crit' : 'ok') : (r.fumble ? 'fumble' : 'ko'); K().sauver(c); }
    return { ok: ok };
  }

  /* ================= Commandes : l'artisan fabrique pour le héros ================= */
  function nomArme(id) { var a = (COF.ARMES_CONTACT || []).concat(COF.ARMES_DISTANCE || []).filter(function (x) { return x.id === id; })[0]; return a || null; }
  function commandesPossibles(c, l, b) {
    var t = TYPES[b.type], h = heros(c), N = Math.max(1, (h && h.niveau) || 1), tl = TAILLES[tailleDe(l.ville)], out = [];
    if (!h || !COF.Artisanat) return out;
    var magieOK = b.qualite === 3 || b.type === 'guilde' || tl.rang >= 3;
    (t.familles || []).forEach(function (fid) {
      var f = COF.AR_FAMILLES.filter(function (x) { return x.id === fid; })[0]; if (!f) return;
      f.armes.forEach(function (aid) {
        var a = nomArme(aid); if (!a) return;
        [0, 1].forEach(function (bonus) {
          if (bonus && (!magieOK || N < 2)) return;
          var an = COF.Artisanat.analyser(h, { type: 'arme', arme: { famille: fid, arme: aid, bonus: bonus, props: [], qualite: 'standard' } });
          if (!an || !an.item) return;
          var nmA = a.nom + (bonus ? ' +1' : ' de qualité');
          if (an.item) an.item.nom = nmA;
          out.push({ k: 'a|' + fid + '|' + aid + '|' + bonus, nom: nmA, base: (a.prix || 0) + an.prix, niveau: an.niveau, item: an.item, effet: an.effets[0] || '' });
        });
      });
    });
    (t.armures || []).forEach(function (fid) {
      var fa = COF.Artisanat.armureFam(fid); if (!fa) return;
      fa.types.forEach(function (pid) {
        var pi = COF.Artisanat.piece(pid); if (!pi || !pi.prix) return;
        [0, 1].forEach(function (bonus) {
          if (bonus && (!magieOK || N < 2)) return;
          var an = COF.Artisanat.analyser(h, { type: 'armure', famille: fid, piece: pid, bonus: bonus, props: [] });
          if (!an || !an.item) return;
          out.push({ k: 'r|' + fid + '|' + pid + '|' + bonus, nom: an.nom, base: (pi.prix || 0) + an.prix, niveau: an.niveau, item: an.item, effet: an.effets[0] || '' });
        });
      });
    });
    /* potions et objets du Compagnon, selon la compétence du métier */
    var comp = t.comp;
    if (comp && comp !== 'forge') {
      (COF.CATALOGUE_COMPAGNON || []).forEach(function (o) {
        if (comp === 'alchimie' && !o.potion) return;
        if (comp === 'lapidage' && (o.potion || !/lapidage/.test(o.tests || ''))) return;
        if (comp === 'façonnage' || comp === '*') return;
        var an = COF.Artisanat.analyser(h, { type: 'objet', cle: o.v + '|' + o.n, variante: 0, doses: 1 });
        if (!an || !an.item || an.niveau > N + (b.type === 'alchimiste' || b.qualite === 3 ? 2 : 0)) return;
        out.push({ k: 'o|' + o.v + '|' + o.n, nom: an.nom, base: an.prix, niveau: an.niveau, item: an.item, effet: o.d || '' });
      });
    }
    /* chaque échoppe a son savoir-faire : une sélection, gardée d'une visite à l'autre */
    if (!b.carnetCommandes) {
      b.carnetCommandes = out.map(function (x) { return x.k; }).sort(function () { return Math.random() - 0.5; }).slice(0, b.qualite === 3 ? 14 : 9);
      K().sauver(c);
    }
    return out.filter(function (x) { return b.carnetCommandes.indexOf(x.k) >= 0; }).map(function (x) {
      var total = Math.max(5, Math.round(x.base * 1.3 * QUALITES[b.qualite].mult * trait(b).mult * (1 - 0.05 * rep(l))));
      var jours = Math.max(1, Math.min(30, Math.round(total / 120) + (b.qualite === 1 ? 1 : 0)));
      return Object.assign(x, { total: total, acompte: Math.ceil(total / 2), jours: jours });
    }).sort(function (a, b2) { return a.total - b2.total; });
  }
  function liste(c) { return c.commandes = c.commandes || []; }
  function commander(c, l, b, k) {
    var h = heros(c), x = commandesPossibles(c, l, b).filter(function (y) { return y.k === k; })[0];
    if (!h || !x) return { err: 'Commande impossible.' };
    if (liste(c).some(function (y) { return y.batId === b.id && !y.retire; })) return { err: b.owner.prenom + ' a déjà une commande en cours pour vous.' };
    if (!payer(h, x.acompte)) return { err: 'Il faut verser un acompte de ' + fmt(x.acompte) + '.' };
    COF.Store.sauver(h);
    var cmd = { id: uid(), lieuId: l.id, lieuNom: l.nom, batId: b.id, batNom: b.nom, artisan: b.owner.prenom, nom: x.nom, item: x.item, total: x.total, solde: x.total - x.acompte, jour: c.jour, pret: c.jour + x.jours, retire: false };
    liste(c).push(cmd);
    var cx = Object.assign(ctx(c, l, b), { obj: '« ' + x.nom + ' »', j: x.jours, js: x.jours > 1 ? 's' : '' });
    scene(c, l, b);
    noter(c, dire(['{o} note la commande sur une ardoise : « {obj}. Revenez dans {j} jour{js}. Et pas un de moins. »', '« Je m’y mets dès demain. Comptez {j} jour{js}. » {o} empoche l’acompte.',
      '{o} prend les mesures de {h}, griffonne un croquis, et fixe le délai : {j} jour{js}.'], cx), '📜 commande : ' + x.nom + ' · acompte −' + fmt(x.acompte) + ' · solde ' + fmt(cmd.solde) + ' · prête au jour ' + cmd.pret, 'Passer commande : ' + x.nom);
    K().sauver(c);
    return { ok: true, cmd: cmd };
  }
  function enCours(c, lieuId) { return liste(c).filter(function (y) { return !y.retire && (!lieuId || y.lieuId === lieuId); }); }
  function pretes(c, lieuId) { return enCours(c, lieuId).filter(function (y) { return y.pret <= c.jour; }); }
  function retirer(c, l, b, id) {
    var h = heros(c), cmd = liste(c).filter(function (y) { return y.id === id; })[0];
    if (!h || !cmd || cmd.retire) return { err: 'Aucune commande.' };
    if (cmd.pret > c.jour) return { err: 'Pas encore prête (jour ' + cmd.pret + ').' };
    if (!payer(h, cmd.solde)) return { err: 'Il faut régler le solde : ' + fmt(cmd.solde) + '.' };
    var it = COF.Store.ajouterObjet(h, Object.assign({}, cmd.item, { nom: (cmd.item.nom || cmd.nom), qte: cmd.item.qte || 1 }));
    if (it) it.prixPa = cmd.total;
    COF.Store.sauver(h); cmd.retire = c.jour; b.achats = (b.achats || 0) + 2;
    var cx = Object.assign(ctx(c, l, b), { obj: '« ' + cmd.nom + ' »' });
    scene(c, l, b);
    noter(c, dire(['{o} sort {obj} d’un linge huilé, avec une fierté non dissimulée. « Alors ? »', '« Voilà votre commande. Du beau travail, si je puis me permettre. » {o} tend {obj} à {h}.', '{h} examine {obj} : finition parfaite. {o} sourit.'], cx),
      '📦 ' + cmd.nom + (cmd.solde ? ' · solde −' + fmt(cmd.solde) : ''), 'Retirer la commande : ' + cmd.nom);
    K().sauver(c);
    return { ok: true };
  }
  /* À l'arrivée dans un lieu : les commandes prêtes. */
  function arrivee(c, lieuId) {
    return pretes(c, lieuId).map(function (y) { return '📦 ' + y.artisan + ' (« ' + y.batNom + ' ») a terminé votre commande : ' + y.nom + '. Solde à régler : ' + fmt(y.solde) + '.'; });
  }

  /* ================= L'atelier : fabriquer soi-même ================= */
  var SIMPLE = {
    forge: [{ k: 'dague', nom: 'Forger une dague', comp: 'forge', diff: 12, matiere: 1, temps: 2, produit: function () { var a = nomArme('dague'); return a ? arme(a, false) : null; } },
      { k: 'fers', nom: 'Forger des fers à cheval (×4)', comp: 'forge', diff: 10, matiere: 1, temps: 1, produit: function () { return article('Fers à cheval (×4)', 3, 'materiel'); } },
      { k: 'hachette', nom: 'Forger une hachette', comp: 'forge', diff: 13, matiere: 1, temps: 2, produit: function () { var a = nomArme('hachette'); return a ? arme(a, false) : null; } }],
    herboriste: [{ k: 'herbes', nom: 'Préparer des herbes médicinales (×2)', comp: 'alchimie', diff: 10, matiere: 1, temps: 1, simples: 1, produit: function () { return article(HERBES.nom, 2, 'remedes', { nom: HERBES.nom, desc: HERBES.desc }, { qte: 2 }); } },
      { k: 'potion', nom: 'Distiller une potion de soins', comp: 'alchimie', diff: 15, matiere: 4, temps: 2, simples: 2, produit: function () { var m = (COF.MATERIEL || []).filter(function (x) { return /Potion de soins/.test(x.nom); })[0]; return article('Potion de soins', 10, 'remedes', { nom: 'Potion de soins', note: m ? m.note : '' }); } },
      { k: 'antidote', nom: 'Préparer un antidote', comp: 'alchimie', diff: 16, matiere: 5, temps: 2, simples: 2, produit: function () { return article('Antidote', 15, 'remedes', { nom: 'Antidote', desc: 'Annule un poison ordinaire.' }); } }],
    tanneur: [{ k: 'matelasse', nom: 'Coudre une armure matelassée', comp: 'façonnage', diff: 10, matiere: 1, temps: 2, produit: function () { var a = COF.ARMURES.filter(function (x) { return x.id === 'matelasse'; })[0]; return a ? armure(a, 'armure') : null; } },
      { k: 'cuir', nom: 'Tailler une armure de cuir', comp: 'façonnage', diff: 13, matiere: 2, temps: 3, produit: function () { var a = COF.ARMURES.filter(function (x) { return x.id === 'cuir'; })[0]; return a ? armure(a, 'armure') : null; } },
      { k: 'sac', nom: 'Coudre un sac à dos', comp: 'façonnage', diff: 8, matiere: 0.5, temps: 1, produit: function () { return article('Sac à dos', 1, 'materiel'); } }],
    menuisier: [{ k: 'fleches', nom: 'Tailler vingt flèches', comp: 'façonnage', diff: 10, matiere: 1, temps: 1, produit: function () { return article('Carquois de 20 flèches', 3, 'materiel'); } },
      { k: 'baton', nom: 'Façonner un bâton ferré', comp: 'façonnage', diff: 9, matiere: 1, temps: 1, produit: function () { var a = nomArme('batonferre'); return a ? arme(a, false) : null; } },
      { k: 'arc', nom: 'Fabriquer un arc court', comp: 'façonnage', diff: 15, matiere: 3, temps: 3, produit: function () { var a = nomArme('arccourt'); return a ? arme(a, true) : null; } }],
    joaillier: [{ k: 'bague', nom: 'Sertir une bague d’argent', comp: 'lapidage', diff: 14, matiere: 6, temps: 2, produit: function () { return article('Bague d’argent sertie', 15, 'bijoux', { nom: 'Bague d’argent sertie', desc: 'Un joli travail, qui se revend bien.' }); } }],
    alchimiste: []
  };
  SIMPLE.alchimiste = SIMPLE.herboriste;
  SIMPLE.guilde = [].concat(SIMPLE.forge, SIMPLE.herboriste, SIMPLE.tanneur, SIMPLE.menuisier, SIMPLE.joaillier);
  /* À la maison, pas d'artisan pour commenter : on garde les phrases sans {o}. */
  function sansO(b, l) { if (!b.maison) return l; var f = l.filter(function (t) { return t.indexOf('{o}') < 0; }); return f.length ? f : ['{h} travaille en silence.']; }
  function compsDe(b) { var t = TYPES[b.type]; return t.comp === '*' ? COF.Artisanat.COMPS : (t.comp ? [t.comp] : []); }
  function aSimples(h) { return (h.inventaire || []).filter(function (o) { return o.nom === SIMPLES; }).reduce(function (n, o) { return n + (o.qte || 1); }, 0); }
  function oterSimples(h, n) { (h.inventaire || []).forEach(function (o) { if (o.nom === SIMPLES && n > 0) { var k = Math.min(n, o.qte || 1); o.qte = (o.qte || 1) - k; n -= k; } }); h.inventaire = (h.inventaire || []).filter(function (o) { return o.nom !== SIMPLES || o.qte > 0; }); }
  /* Recettes faisables ici : les travaux simples du métier, et les recettes que le héros connaît (voies d'artisan). */
  function recettes(c, l, b) {
    var h = heros(c), t = TYPES[b.type]; if (!h || !t.loyer || !COF.Artisanat) return [];
    var loyer = b.sansLoyer ? 0 : t.loyer;
    var out = (SIMPLE[b.type] || []).map(function (r) {
      var cp = COF.Artisanat.competence(h, r.comp), pd = r.produit(); if (!pd) return null;
      var simp = r.simples ? Math.min(aSimples(h), r.simples) : 0, mat = Math.max(0, Math.round(r.matiere * 10) / 10);
      var cout = Math.max(b.sansLoyer ? 0 : 1, Math.ceil(mat * (1 - (r.simples ? simp / r.simples * 0.8 : 0))) + Math.ceil(loyer * r.temps / 4));
      return { k: 's|' + r.k, nom: r.nom, comp: r.comp, compNom: cp.nom, bonus: cp.bonus, deBonus: cp.deBonus, diff: r.diff, cout: cout, temps: r.temps, simples: simp, produit: pd,
        chance: Math.max(5, Math.min(95, (21 - (r.diff - cp.bonus)) * 5)), valeur: pd.pa * (pd.qte || 1) };
    }).filter(Boolean);
    /* recettes apprises : objets du Compagnon dont le héros a les rangs et le niveau */
    var comps = compsDe(b);
    (COF.CATALOGUE_COMPAGNON || []).forEach(function (o) {
      if (!COF.Artisanat.rangRecette(h, o.v) || COF.Artisanat.rangRecette(h, o.v) < o.r) return;
      var an = COF.Artisanat.analyser(h, { type: 'objet', cle: o.v + '|' + o.n, variante: 0, doses: 1 });
      if (!an || !an.niveauOK || !an.recettesOK || !an.tests.length || !an.tests.every(function (x) { return comps.indexOf(x.comp) >= 0; })) return;
      out.push({ k: 'c|' + o.v + '|' + o.n, nom: 'Fabriquer : ' + an.nom, connue: true, analyse: an, cout: an.prixReduit + Math.ceil(loyer * an.joursAtelier), jours: an.joursAtelier, produit: { nom: an.nom, pa: an.prix, item: an.item },
        chance: Math.round(an.tests.reduce(function (pr, x) { return pr * x.chance / 100; }, 1) * 100), compNom: an.tests.map(function (x) { return x.nom; }).join(', ') });
    });
    return out;
  }
  function fabriquer(c, l, b, k) {
    var h = heros(c), r = recettes(c, l, b).filter(function (x) { return x.k === k; })[0];
    if (!h || !r) return { err: 'Recette inconnue.' };
    if (!payer(h, r.cout)) return { err: 'Il faut ' + fmt(r.cout) + ' (matières et location de l’atelier).' };
    var cx = Object.assign(ctx(c, l, b), { obj: '« ' + r.produit.nom + ' »' }), m = ['−' + fmt(r.cout) + ' (matières, atelier)'], ok, txt, v;
    scene(c, l, b);
    if (r.connue) {
      /* une vraie recette : les tests du livre, des jours d'atelier */
      var res = COF.Artisanat.lancer(r.analyse), jr = res.issue.cle === 'rapide' ? Math.ceil(r.jours / 2) : r.jours;
      c.jour += jr; m.push(jr + ' jour' + (jr > 1 ? 's' : '') + ' d’atelier');
      res.tests.forEach(function (x) { m.push(x.nom + ' ' + x.total + ' contre ' + x.diff + (x.ok ? ' ✓' : ' ✗')); });
      ok = res.issue.cle === 'ok' || res.issue.cle === 'rapide'; v = res.issue.cle === 'rapide' ? 'crit' : ok ? 'ok' : (res.issue.cle === 'desastre' ? 'fumble' : 'ko');
      if (ok) { var it = COF.Store.ajouterObjet(h, Object.assign({}, r.produit.item, { qte: r.produit.item.qte || 1 })); if (it) it.prixPa = r.produit.pa; m.push('🎒 ' + r.produit.nom); }
      else { var perte = Math.round(r.analyse.prixReduit * (res.issue.cle === 'desastre' ? 0.5 : 0.2)); m.push('matières perdues (' + fmt(perte) + ')'); }
      txt = dire(sansO(b, ok ? ['Des jours durant, {h} travaille sans relâche dans l’atelier {de_n}. Au bout du compte : {obj}, digne d’un maître.', '{o} passe de temps en temps jeter un œil par-dessus l’épaule de {h}. Le dernier jour, {oil} siffle d’admiration devant {obj}.']
        : ['Malgré des jours d’efforts, {obj} refuse de prendre forme. Il faudra recommencer.', 'Une erreur au pire moment : tout est à refaire. {o} hausse les épaules : « Ça arrive aux meilleurs. »']), cx);
    } else {
      if (r.simples) { oterSimples(h, r.simples); m.push('🌿 ' + r.simples + ' simple' + (r.simples > 1 ? 's' : '') + ' utilisé' + (r.simples > 1 ? 's' : '')); }
      var tr = COF.Dice.test({ mod: r.bonus, difficulte: r.diff, bonus: r.deBonus });
      ok = !!tr.reussite; v = tr.crit ? 'crit' : tr.fumble ? 'fumble' : ok ? (tr.total - r.diff <= 1 ? 'juste' : 'ok') : 'ko';
      m.unshift(r.compNom + ' ' + (r.bonus >= 0 ? '+' : '') + r.bonus + ' : ' + tr.total + ' contre ' + r.diff + ' · ' + (ok ? 'réussite' : 'échec'));
      T().avancerTemps(c, r.temps);
      if (ok) {
        var q = (r.produit.qte || 1) + (tr.crit ? 1 : 0);
        { var it2 = COF.Store.ajouterObjet(h, Object.assign({}, r.produit.item, { qte: q })); if (it2) it2.prixPa = r.produit.pa; }
        m.push('🎒 ' + r.produit.nom + (q > 1 && !/×/.test(r.produit.nom) ? ' ×' + q : ''));
      } else if (tr.fumble && r.comp === 'forge') m.push(T().blesser(c, d(4)));
      txt = dire(sansO(b, ok ? (tr.crit ? ['Les gestes viennent tout seuls : {obj} est une petite merveille. Il reste même assez de matière pour un second exemplaire.', '{o} n’en revient pas : « Vous avez déjà fait ça, non ? » Le résultat est impeccable.']
        : ['Penché{he} sur l’établi, {h} s’applique. Quelques heures plus tard : {obj}, solide et honnête.', '{h} travaille en silence ; {o} hoche la tête en passant. {maj_obj} est prêt.', 'Un peu de sueur, un peu de patience, et {obj} prend forme entre les mains de {h}.'])
        : (tr.fumble ? ['Une erreur de débutant : la pièce se brise, et {h} s’entaille la main au passage.', 'Tout part de travers. {o} retient un rire ; {h} retient un juron.'] : ['Le résultat est bancal, inutilisable. Les matières sont perdues.', '{h} s’acharne, mais rien n’y fait : ce n’est pas encore ça.'])),
        Object.assign(cx, { maj_obj: maj(cx.obj) }));
    }
    COF.Store.sauver(h);
    noter(c, txt, m.join(' · '), r.nom.replace(/^Fabriquer : /, 'Fabriquer : '), ok);
    var s = K().sceneCourante(c); if (s && s.entrees.length) { s.entrees[s.entrees.length - 1].v = v; }
    if (COF.Legende && ok) { var lg = COF.Legende.etat(c); lg.n['artisan-' + (r.comp || 'recette')] = (lg.n['artisan-' + (r.comp || 'recette')] || 0) + 1; }
    K().sauver(c);
    return { ok: ok };
  }

  /* ================= Services ================= */
  function services(c, l, b) {
    var t = TYPES[b.type], h = heros(c), out = [];
    if (!h) return out;
    var pvMax = COF.Calc.pvMax(h), manque = Math.max(0, pvMax - (h.pv === null || h.pv === undefined ? pvMax : h.pv)), tl = TAILLES[tailleDe(l.ville)];
    (t.services || []).concat(t.soins ? ['soinsHerbes'] : []).forEach(function (sid) {
      if (sid === 'soinsTemple' && manque) out.push({ k: sid, nom: 'Recevoir des soins', aide: 'tous les PV · offrande ' + fmt(Math.max(5, manque)), cout: Math.max(5, manque) });
      if (sid === 'soinsHerbes' && manque) out.push({ k: sid, nom: 'Se faire soigner (cataplasmes)', aide: '+1d6 PV · ' + fmt(4), cout: 4 });
      if (sid === 'benediction') out.push({ k: sid, nom: 'Demander une bénédiction', aide: 'tension −1 · ' + fmt(5), cout: 5 });
      if (sid === 'offrande') out.push({ k: sid, nom: 'Faire une offrande au temple', aide: 'réputation auprès du clergé · ' + fmt(20), cout: 20 });
      if (sid === 'carte') out.push({ k: sid, nom: 'Acheter une carte de la région', aide: 'deux lieux ajoutés à la carte · ' + fmt(25 + 5 * tl.rang), cout: 25 + 5 * tl.rang });
    });
    return out;
  }
  function service(c, l, b, k) {
    var h = heros(c), sv = services(c, l, b).filter(function (x) { return x.k === k; })[0];
    if (!h || !sv) return { err: 'Indisponible.' };
    if (!payer(h, sv.cout)) return { err: 'Il faut ' + fmt(sv.cout) + '.' };
    var cx = ctx(c, l, b), m = ['−' + fmt(sv.cout)], txt;
    scene(c, l, b);
    if (k === 'soinsTemple') { var av = h.pv; h.pv = COF.Calc.pvMax(h); h.etats = []; m.push('+' + (h.pv - av) + ' PV'); txt = dire(['{o} pose les mains sur les plaies de {h} et murmure une prière. Une chaleur douce chasse la douleur.', 'Dans le silence du temple, les blessures de {h} se referment une à une.'], cx); }
    else if (k === 'soinsHerbes') { var g = d(6), av2 = h.pv; h.pv = Math.min(COF.Calc.pvMax(h), (h.pv || 0) + g); m.push('+' + (h.pv - av2) + ' PV'); txt = dire(['{o} applique un cataplasme qui pique horriblement… puis soulage.', '« Buvez ça. Non, ne sentez pas. Buvez. » Le remède de {o} fait son effet.'], cx); }
    else if (k === 'benediction') { c.tension = Math.max(1, c.tension - 1); m.push('tension −1'); txt = dire(['{o} trace un signe sur le front de {h}. Un calme profond l’envahit.', 'Une prière, un peu d’encens : {h} ressort l’esprit apaisé.'], cx); }
    else if (k === 'offrande') { var f = COF.Factions ? COF.Factions.changer(c, 'temple', 1) : ''; if (f) m.push(f); txt = dire(['{h} dépose une bourse sur l’autel. {o} s’incline : « Les dieux s’en souviendront. »'], cx); }
    else if (k === 'carte') {
      var n = []; for (var i = 0; i < 2; i++) { var dl = T().decouvrirLieu(c); if (dl) n.push(dl.nom); }
      m.push('🗺️ ' + (n.join(', ') || 'rien de nouveau')); txt = dire(['{o} déroule une carte jaunie, couverte d’annotations. Deux noms attirent l’œil de {h}.', 'Une carte soigneusement recopiée : chemins, gués, ruines oubliées.'], cx);
    }
    COF.Store.sauver(h);
    noter(c, txt, m.join(' · '), sv.nom);
    K().sauver(c);
    return { ok: true };
  }

  /* ================= L'artisan comme PNJ (pour bavarder) ================= */
  function pnj(c, l, b) {
    var x = b.pnjId ? (c.pnj || []).filter(function (y) { return y.id === b.pnjId; })[0] : null;
    if (x) return x;
    var t = TYPES[b.type], f = b.owner.genre === 'féminin';
    x = K().ajouterListe(c, 'pnj', { nom: b.owner.nom, attitude: 'neutre', genre: b.owner.genre, peuple: b.owner.peuple, note: maj(t.metier[f ? 1 : 0]) + ' — « ' + b.nom + ' », ' + l.nom + '. De caractère ' + trait(b).lib + '.' });
    x.lieuId = l.id; x.jour = c.jour; x.vuJour = c.jour; b.pnjId = x.id;
    K().sauver(c);
    return x;
  }

  /* Résumé d'un bâtiment pour l'affichage. */
  function infos(c, l, b) {
    var t = TYPES[b.type], f = b.owner.genre === 'féminin';
    return { ic: t.ic, lib: t.lib, metier: t.metier[f ? 1 : 0], qualite: QUALITES[b.qualite], trait: trait(b).lib, pretes: pretes(c, l.id).filter(function (y) { return y.batId === b.id; }),
      enCours: enCours(c, l.id).filter(function (y) { return y.batId === b.id && y.pret > c.jour; }),
      ferme: COF.Village ? COF.Village.ferme(c, l, b) : null, travail: COF.Village ? COF.Village.travail(c, l, b) : null, apprendre: COF.Village ? COF.Village.peutApprendre(c, l, b) : false,
      peutAcheter: !!t.vend().length || !!t.magie, peutVendre: Object.keys(t.rachete || {}).length > 0, peutCommander: !!(t.familles || t.armures || (t.comp && t.comp !== 'forge')), atelier: !!t.loyer, services: services(c, l, b).length > 0 };
  }

  /* Cueillette : des simples qui allègent les préparations de l'herboriste (action du récit). */
  function cueillir(c, n) {
    var h = heros(c); if (!h) return '';
    var it = (h.inventaire || []).filter(function (o) { return o.nom === SIMPLES; })[0];
    if (it) it.qte = (it.qte || 1) + n; else { it = COF.Store.ajouterObjet(h, { nom: SIMPLES, qte: n, desc: 'Plantes fraîches : un herboriste les rachète, ou elles allègent le coût d’une préparation.' }); if (it) it.prixPa = 1; }
    COF.Store.sauver(h);
    return '🌿 ' + n + ' simple' + (n > 1 ? 's' : '') + ' cueilli' + (n > 1 ? 's' : '');
  }

  return { creerTemp: creerTemp, crediter: crediter, payer: payer, formes: formes, TYPES: TYPES, TRAITS: TRAITS, QUALITES: QUALITES, batiments: batiments, batiment: batiment, stock: stock, prix: prix, fmt: fmt, bourse: bourse,
    acheter: acheter, offresVente: offresVente, vendre: vendre, marchander: marchander, marchande: marchande, commandesPossibles: commandesPossibles, commander: commander,
    enCours: enCours, pretes: pretes, retirer: retirer, arrivee: arrivee, recettes: recettes, fabriquer: fabriquer, services: services, service: service,
    pnj: pnj, infos: infos, entrer: entrer, sortir: sortir, economie: economie, categorie: categorie, valeur: valeur, cueillir: cueillir, SIMPLES: SIMPLES };
})();
