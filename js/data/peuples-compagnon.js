/* ============================================================
   COF2 Compagnon — Données : peuples du Compagnon du joueur
   (Chroniques Oubliées Fantasy, 2e édition — chapitre 1,
   « Peuples optionnels »). Même format que peuples.js.

   Les peuples déjà présents via un autre supplément (demi-ogre,
   gobelin, kobold, fée, lutin/farfadet) ne sont pas dupliqués.
   Le demi-elfe reçoit ici sa voie optionnelle.
   ============================================================ */
window.COF = window.COF || {};
COF.PEUPLES = COF.PEUPLES || {};

/* Rappel du Compagnon : quand une capacité de peuple octroie un sort, le
   joueur choisit la caractéristique de magie entre celle prévue par la
   capacité, la VOL ou la CON ; aucune valeur minimale n'est requise. */

Object.assign(COF.PEUPLES, {

  ameforgee: {
    id: 'ameforgee', nom: 'Âme forgée',
    desc: "Une créature mécanique née de la fusion du métal et d'une magie perdue, forgée pour la guerre et d'une insatiable curiosité.",
    mods: [{ plus: ['CON'], moins: ['CHA', 'INT'] }],
    traits: "Créature non vivante : n'a besoin ni de boire, ni de manger, ni de respirer, mais doit rêver 4 h par jour (sinon -1 cumulatif à ses tests). Immunisée aux poisons et aux maladies. Ne sait pas nager mais marche au fond de l'eau (terrain difficile). Divise par deux les PV rendus par les soins magiques ; un forgesort capable de réparer un golem peut la réparer (deux fois plus lentement).",
    voie: {
      id: 'ameforgee', nom: 'Voie de l’âme forgée', caps: [
        { r: 1, n: 'Métallique', d: "+1 en DEF et DM létaux à mains nues. RD 5 contre les DM de feu, de froid et les drains de vie ; immunisée au saignement. Vision dans le noir comme en pénombre jusqu'à 10 m." },
        { r: 2, n: 'Choc électrique', f: 'round', dmg: '1d4°', d: "1×/round, +1d4° DM d'électricité sur une attaque à mains nues réussie (en plus des [1d3 + FOR] DM à mains nues)." },
        { r: 3, n: 'Infiltration', a: 'M', f: 'jour', d: "1×/jour, pendant 1 h par rang, illusion visuelle la faisant passer pour un humain, un orc ou un elfe (pas une personne précise ; ne résiste pas à une palpation poussée). Activer/désactiver : action de mouvement." },
        { r: 4, n: 'Rayon ardent', a: 'L', f: 'combat', dmg: '4d4°+CON', d: "1×/combat, rayon projeté par les yeux (portée 30 m) : test d'attaque magique contre la DEF, [4d4° + CON] DM. Nature selon les cristaux oculaires : transparent = foudre, rouge = feu, bleu = froid." },
        { r: 5, n: 'Machine de guerre', d: "+1 en CON et +1 en FOR." }
      ]
    }
  },

  cambion: {
    id: 'cambion', nom: 'Cambion',
    desc: "Un humain au sang démoniaque, qui cache ses mutations (cornes, queue fourchue, odeur de soufre…) et lutte contre des pulsions obscures.",
    mods: [{ plus: ['VOL', 'CON'], moins: ['CHA'] }],
    traits: "Ascendance d'un autre peuple possible (accord du MJ) : cumul des malus autorisé, pas des bonus ; rang 1 de cambion, puis choix à chaque rang entre les deux voies.",
    voie: {
      id: 'cambion', nom: 'Voie du cambion', caps: [
        { r: 1, n: 'Ami des ombres', d: "+3 à tous les tests pour mentir et se déguiser. Vision dans le noir total comme en pénombre jusqu'à 30 m." },
        { r: 2, n: 'Enfant des ténèbres', s: true, d: "Obtient le sort Ténèbres (sorcier, voie de la sombre magie) et le PM correspondant ; lançable en armure sans pénalité, sans le bonus de compétence associé. S'il possède déjà ce sort, il le lance désormais en action gratuite." },
        { r: 3, n: 'Résistances', d: "RD 5 contre les DM de feu, de froid et d'électricité." },
        { r: 4, n: 'La belle et la bête', f: 'jour', d: "1×/jour, lance Beauté de la succube (voie du démon, rang 2) sans PM et sans limitation d'armure (n'en rapporte pas non plus). À partir du niveau 10, également Aspect du démon 1×/jour, dans les mêmes conditions." },
        { r: 5, n: 'Forgé par les ténèbres', d: "+1 en CON et +1 en VOL." }
      ]
    }
  },

  drakonide: {
    id: 'drakonide', nom: 'Drakonide',
    desc: "Un humanoïde mi-homme mi-dragon, fier et loyal, héritier d'un sang très ancien et d'un sens de l'honneur inflexible.",
    modsFixes: [{ c: 'FOR', v: 1 }, { c: 'VOL', v: 1 }, { c: 'AGI', v: -1 }, { c: 'PER', v: -1 }],
    voie: {
      id: 'drakonide', nom: 'Voie du drakonide', caps: [
        { r: 1, n: 'Sang dragon', d: "Vision dans le noir total comme en pénombre jusqu'à 30 m. +3 à tous les tests d'intimidation." },
        { r: 2, n: 'Souffle', a: 'L', f: 'combat', dmg: '5d4°', d: "Type choisi une fois pour toutes : feu, froid, électricité ou acide. 1×/combat, cône de 10 m × 5 m : 3d4° DM + 1d4° par rang (5d4° au rang 2, 6d4° au rang 3…). Test d'AGI difficulté 10 pour diviser les DM par 2." },
        { r: 3, n: 'Écailles robustes', d: "+1 en DEF et RD égale au rang atteint dans la voie contre l'élément de son souffle." },
        { r: 4, n: 'Fureur drakonide / Ailes puissantes', d: "Choisir une option. Fureur drakonide : quand un adversaire lui inflige un critique ou qu'il passe sous la moitié de ses PV max, +1 en attaque et aux DM jusqu'à la fin du combat. Ailes puissantes : vol à 10 m par action de mouvement, 30 m au maximum avant de devoir se poser (peut revoler au round suivant)." },
        { r: 5, n: 'Héritage draconique', d: "+1 en CON et +1 en CHA." }
      ]
    }
  },

  elfepale: {
    id: 'elfepale', nom: 'Elfe pâle',
    desc: "Les « Indécis » de la Forêt sombre : des elfes qui ont refusé le joug de Maëdra et vénèrent encore les anciennes Puissances.",
    mods: [{ plus: ['PER', 'VOL'], moins: ['FOR'] }],
    voie: {
      id: 'elfepale', nom: 'Voie de l’elfe pâle', caps: [
        { r: 1, n: 'Natif de la Forêt sombre', d: "Dans l'obscurité, voit comme dans la pénombre jusqu'à 20 m ; aucun malus en pénombre ou brouillard léger jusqu'à 20 m. +3 aux tests de vigilance pour échapper à une embuscade." },
        { r: 2, n: 'Résistance au poison', d: "Dé bonus pour résister aux poisons ; divise par deux tous leurs effets (DM ou durée)." },
        { r: 3, n: 'Fléau des morts', dmg: '1d4°', d: "+1d4° DM par attaque contre les morts-vivants (DM initiaux uniquement, pas les DM sur la durée)." },
        { r: 4, n: 'Provoquer la chance', d: "Ajoute sa PER ou sa VOL (au choix) à son nombre de PC." },
        { r: 5, n: 'Supériorité elfique', d: "+1 en PER et +1 en VOL." }
      ]
    }
  },

  elfeprofondeurs: {
    id: 'elfeprofondeurs', nom: 'Elfe des profondeurs',
    desc: "Un déserteur de la cruelle société elfique souterraine, qui affronte désormais la lumière du soleil et la méfiance de tous.",
    mods: [{ plus: ['AGI', 'VOL'], moins: ['FOR'] }],
    voie: {
      id: 'elfeprofondeurs', nom: 'Voie de l’elfe des profondeurs', caps: [
        { r: 1, n: 'Enfant des ténèbres', d: "Aucune pénalité dans le noir total ou la pénombre jusqu'à 30 m. +3 en Init. dans le noir complet ou la pénombre." },
        { r: 2, n: 'Lames et sorcellerie', choix: true, choixVoie: { profils: ['sorcier', 'guerrier'], rangMax: 1 }, d: "Choisir une capacité de rang 1 d'une voie de sorcier ou de guerrier (si c'est un sort : +1 PM et utilisable en armure). Au rang 4 de la voie, une capacité supplémentaire de rang 2 de l'un de ces profils. Inutilisables en plein soleil (il lui faut au moins un coin d'ombre)." },
        { r: 3, n: 'Combat à deux armes', choix: true, choixVoie: { profils: ['rodeur'], rangMin: 3, rangMax: 3 }, d: "Obtient la capacité de rôdeur Droite - gauche (voie du combat à deux armes, rang 3). S'il la possède déjà, ne subit plus de dé malus lorsqu'il attaque une cible différente de chaque main." },
        { r: 4, n: 'Maîtrise des arbalètes', d: "Critique sur 19-20 avec une arbalète de poing ou légère ; sait manier ces arbalètes quel que soit son profil. (Voir aussi la capacité de rang 2 supplémentaire de Lames et sorcellerie.)" },
        { r: 5, n: 'Supériorité elfique', d: "+1 en AGI et +1 en VOL." }
      ]
    }
  },

  felis: {
    id: 'felis', nom: 'Félis',
    desc: "Un humanoïde félin agile et rapide, souvent nomade ou saltimbanque, imprévisible mais fidèle à son clan.",
    mods: [{ plus: ['AGI', 'PER'], moins: ['FOR', 'INT'] }],
    voie: {
      id: 'felis', nom: 'Voie du félis', caps: [
        { r: 1, n: 'Âme féline', d: "La nuit étoilée compte comme de la pénombre. +3 aux tests d'AGI d'escalade, de saut et de course (sprint, pas l'endurance)." },
        { r: 2, n: 'Armes naturelles', dmg: '1d4+FOR', d: "Armes naturelles : [1d4 + FOR] DM létaux. En action limitée, peut remplacer la FOR par l'AGI en attaque et aux DM. Avec Attaque éclair (rôdeur) : +1d4° DM en l'utilisant. Avec la voie du poing (moine) : AGI au lieu de FOR aux DM de toutes ses attaques." },
        { r: 3, n: 'Vif et discret', d: "+3 en Init. et aux tests de discrétion. De plus, au choix : +3 en jonglerie et acrobaties (félis saltimbanque) ou en survie en forêt (félis des forêts)." },
        { r: 4, n: 'Métamorphose féline', a: 'L', f: 'jour', dmg: '2d4°+2', d: "Prend la forme d'une panthère 1 h par niveau au maximum (1re transformation du jour gratuite, puis 1 DR chacune jusqu'à la prochaine récupération complète). Reprend forme humaine à 0 PV ou en action de mouvement. 15 m par action de mouvement, +3 km par période de voyage. Panthère : AGI +4*, FOR +2, PER +2*, CON/CHA/INT/VOL du PJ ; DEF 17 (18 au niv. 9, 19 au niv. 12, 20 au niv. 15), PV du PJ, Init. 15 ; morsure et griffes [attaque au contact du PJ], 2d4°+2 DM." },
        { r: 5, n: 'Nature féline', d: "+1 en AGI et +1 en PER." }
      ]
    }
  },

  frouin: {
    id: 'frouin', nom: 'Frouïn',
    desc: "Un rat humanoïde d'un mètre de haut, charognard des égouts au grand cœur, couard mais d'une loyauté touchante.",
    modsFixes: [{ c: 'CON', v: 1 }, { c: 'FOR', v: -1 }, { c: 'CHA', v: -1 }],
    mods: [{ plus: ['AGI', 'PER'], moins: [] }],
    modsTexte: "+1 en AGI ou PER, +1 en CON, -1 en FOR et -1 en CHA.",
    traits: "Taille petite : à une main, arme de 1d6 DM maximum (pas la rapière) ; deux mains pour 1d8-1d10 ; interdit au-delà de 1d10, ainsi que l'arc long et l'arbalète lourde.",
    voie: {
      id: 'frouin', nom: 'Voie du frouïn', caps: [
        { r: 1, n: 'Avarié', d: "Trois fois moins de nourriture qu'un humain ; mange des aliments avariés sans tomber malade. +3 pour résister aux maladies et aux poisons. Son odeur impose -1 aux tests d'interaction sociale (CHA) de ses compagnons. Vision dans le noir total comme en pénombre jusqu'à 30 m." },
        { r: 2, n: 'Minus', d: "+3 aux tests de discrétion et +1 en DEF (+2 au rang 4)." },
        { r: 3, n: 'Parano', d: "+3 en Init. et aux tests pour éviter d'être surpris. Ne subit que la moitié des DM des attaques sournoises (et autres bonus de DM dus à la surprise)." },
        { r: 4, n: 'Attaque simultanée', dmg: '1d4°', d: "S'il décale son Init. pour attaquer en même temps qu'un allié (contact ou distance) : au choix, dé bonus en attaque ou +1d4° DM. Cumulable avec une Attaque sournoise." },
        { r: 5, n: 'Champion de la survie', choixCarac: { liste: ['AGI', 'PER'], val: 1 }, d: "+1 en AGI ou en PER (au choix) et +1 en CON." }
      ]
    }
  },

  minotaure: {
    id: 'minotaure', nom: 'Minotaure',
    desc: "Une créature mi-homme mi-taureau, irascible et taciturne, bâtisseuse de labyrinthes au sens de l'orientation infaillible.",
    modsFixes: [{ c: 'FOR', v: 2 }, { c: 'VOL', v: 1 }, { c: 'INT', v: -2 }, { c: 'CHA', v: -2 }],
    traits: "Taille presque grande : résiste aux saisies (et autres) comme une créature de taille grande. Dans la plupart des constructions à taille humaine, -1 à tous ses tests de FOR et d'AGI, et en attaque.",
    voie: {
      id: 'minotaure', nom: 'Voie du minotaure', caps: [
        { r: 1, n: 'Coup de corne', dmg: '1d4°+FOR', d: "Attaque de corne à la place d'une attaque normale : [1d4° + FOR] DM. En action limitée : une attaque avec une arme de contact plus une attaque de corne. +3 à tous les tests d'orientation." },
        { r: 2, n: 'Charge puissante', dmg: '2d4°+FOR', d: "Après au moins 10 m en ligne droite, l'attaque de corne inflige [2d4° + FOR] DM ; une cible de taille moyenne ou inférieure doit réussir un test de FOR difficulté [10 + rangs dans la voie] ou être renversée. Impossible contre une cible déjà au contact d'un autre adversaire." },
        { r: 3, n: 'Frénésie', a: 'G', d: "Après avoir été blessé, peut entrer en frénésie : +2 en attaque et RD 3 contre tous les DM, mais -3 en DEF." },
        { r: 4, n: 'Encorner', a: 'G', f: 'round', d: "Attaque de corne en action gratuite 1×/round (jamais plus d'une attaque de corne par round)." },
        { r: 5, n: 'Colosse', d: "+1 en CON et +1 en FOR." }
      ]
    }
  },

  nephilim: {
    id: 'nephilim', nom: 'Nephilim',
    desc: "Un humain à l'ascendance angélique, d'une beauté surnaturelle, souvent perdu dans la contemplation et étranger aux contingences.",
    mods: [{ plus: ['CHA', 'CON'], moins: ['PER'] }],
    traits: "Ascendance d'un autre peuple possible (accord du MJ) : cumul des malus autorisé, pas des bonus ; rang 1 de nephilim, puis choix à chaque rang entre les deux voies.",
    voie: {
      id: 'nephilim', nom: 'Voie du nephilim', caps: [
        { r: 1, n: 'Photosensible', d: "La nuit étoilée compte comme le plein jour et le rayon de toutes les sources de lumière est doublé. +3 aux tests de deux domaines liés à son origine géographique ou sociale (comme un humain)." },
        { r: 2, n: 'Enfant de la lumière', s: true, d: "Obtient le sort Lumière (magicien, voie de la magie universelle) et le PM correspondant ; lançable en armure sans pénalité. S'il possède déjà ce sort, il le lance désormais en action gratuite." },
        { r: 3, n: 'Résistances', d: "RD 5 contre les DM d'acide, de froid ou d'électricité." },
        { r: 4, n: 'La plume et l’acier', f: 'jour', d: "1×/jour (2×/jour à partir du niveau 10), lance Ailes célestes (prêtre, voie de la foi) sans PM et quelle que soit l'armure. +3 pour résister aux pouvoirs de corruption mentale (charme, suggestion…) et aux effets d'affaiblissement (drain, vampirisme, énergie négative…)." },
        { r: 5, n: 'Forgé par la lumière', d: "+1 en CON et +1 en CHA." }
      ]
    }
  },

  ophidien: {
    id: 'ophidien', nom: 'Ophidien',
    desc: "Un descendant au sang dilué des anciens hommes-serpents, maître du mensonge, hanté par une mémoire ancestrale et une soif de domination.",
    mods: [{ plus: ['INT', 'VOL'], moins: ['CON'] }],
    voie: {
      id: 'ophidien', nom: 'Voie de l’ophidien', caps: [
        { r: 1, n: 'Sang des anciens', d: "+3 aux tests d'histoire, et aux tests de CHA pour mentir, bluffer ou soutirer des informations. Vision dans le noir total comme en pénombre jusqu'à 30 m." },
        { r: 2, n: 'Regard hypnotique', f: 'combat', d: "Lance Injonction (ensorceleur, voie de l'envoûteur) 1×/combat ; à partir du rang 4, aussi Sommeil 1×/jour. Sans PM et quelle que soit l'armure. Gagne aussi 1 PE (point d'ego, voir le psionique) par rang atteint dans cette voie." },
        { r: 3, n: 'Crachat', a: 'A', f: 'combat', dmg: '1d4°+PER', d: "1×/combat, crache un poison acide (attaque à distance, 3 m) : [1d4° + PER] DM ; la victime doit réussir un test d'AGI difficulté 10 ou être aveuglée 1d4 rounds." },
        { r: 4, n: 'Mutation serpentine', a: 'L', dmg: '1d4°', d: "Révèle sa tête de serpent (cou d'1 m) aussi longtemps qu'il le souhaite (retour en action limitée). Morsure 1×/round en action gratuite (attaque au contact) : 1d4° DM, et test de CON difficulté 10 contre le poison sinon +1d4° DM." },
        { r: 5, n: 'Forme de serpent', a: 'L', dmg: '1d4°+4', d: "Prend à volonté la forme d'un serpent constricteur de 4 m. AGI +0, CON +4, FOR +4*, PER +0*, CHA -2, INT/VOL du PJ ; DEF 17 (18 au niv. 9, 19 au niv. 12, 20 au niv. 15), PV du PJ, Init. 13 ; morsure [attaque magique du PJ], 1d4°+4 DM + poison. Étreinte : après une attaque réussie, test opposé de FOR (la victime peut résister en AGI) : la victime est immobilisée et subit +1d4° DM par tour ; se libérer : action de mouvement et test de FOR difficulté 14." }
      ]
    }
  },

  satyre: {
    id: 'satyre', nom: 'Satyre',
    desc: "Une créature des bois aux jambes de bouc, hédoniste, musicienne et pacifiste, qui préfère le vin et la fête à l'or.",
    mods: [{ plus: ['PER', 'CHA'], moins: ['VOL', 'INT'] }],
    traits: "N'aime ni le métal ni les armures de peau morte : préfère la cotte d'écorce (DEF +2, aucun malus en natation, à réparer après chaque combat sinon -1 en DEF).",
    voie: {
      id: 'satyre', nom: 'Voie du satyre', caps: [
        { r: 1, n: 'Bonne nature', d: "+3 aux tests de survie et pour se cacher en forêt, où il trouve toujours à se nourrir. +3 en chant, en danse et pour jouer d'un instrument. La nuit étoilée compte comme de la pénombre." },
        { r: 2, n: 'Encorner et ruer', dmg: '1d4°+FOR', d: "Cornes ou sabots : [1d4° + FOR] DM létaux. En action limitée, deux attaques au contact (cornes et sabots). À partir du rang 4, quand il attaque au contact avec une arme, il ajoute un coup de corne en action gratuite (1×/round)." },
        { r: 3, n: 'Compagnon de voyage', d: "À la fin de chaque journée de voyage, chacun de ses compagnons fait un test de PER (difficulté = dangerosité de la zone) : en cas de succès, il gagne 1 DR à dépenser immédiatement ou pendant la nuit." },
        { r: 4, n: 'Magie sauvage', f: 'jour', choix: true, choixVoie: { profils: ['barde', 'druide', 'ensorceleur'], rangMax: 3, sorts: true }, d: "Choisir un sort de rang 3, ou deux sorts de rang 1 à 2, des profils de barde, de druide ou d'ensorceleur. Chacun est lançable 1×/jour, sans PM et quelle que soit l'armure." },
        { r: 5, n: 'Ascendance naturelle', d: "+1 en PER et +1 en CHA." }
      ]
    }
  },

  wolfer: {
    id: 'wolfer', nom: 'Wolfer',
    desc: "Un chasseur nomade velu au monosourcil, loyal jusqu'à la mort envers son clan, souvent confondu avec les loups-garous.",
    mods: [{ plus: ['PER', 'VOL'], moins: ['INT'] }],
    voie: {
      id: 'wolfer', nom: 'Voie du wolfer', caps: [
        { r: 1, n: 'Chasseur né', d: "+3 aux tests de PER pour pister, chasser, détecter une créature ou un piège en pleine nature, et +3 aux tests de marche ou de course d'endurance ; -3 aux tests d'équitation. Vision dans le noir total comme en pénombre jusqu'à 30 m." },
        { r: 2, n: 'Griffes et crocs', dmg: '1d4°+FOR', d: "Armes naturelles : [1d4° + FOR] DM ; deux attaques en une action limitée. À partir du rang 4, une attaque naturelle supplémentaire en action gratuite chaque round (jusqu'à 3 attaques naturelles en action limitée)." },
        { r: 3, n: 'Loi de la meute', d: "+1 en attaque et en DEF contre un ennemi que d'autres alliés combattent. Peut calculer ses PC avec la PER au lieu du CHA (2 + PER)." },
        { r: 4, n: 'Forme de loup', a: 'L', f: 'jour', dmg: '2d4°+3', d: "Prend la forme d'un loup puissant 1 h par niveau au maximum (1re transformation du jour gratuite, puis 1 DR chacune jusqu'à la prochaine récupération complète). +5 km par période de voyage. Loup : AGI +2, FOR +3, PER +2*, CON/CHA/INT/VOL du PJ ; DEF 17 (18 au niv. 9, 19 au niv. 12, 20 au niv. 15), PV du PJ, Init. 15 ; morsure [attaque au contact du PJ], 2d4°+3 DM." },
        { r: 5, n: 'Esprit du loup', d: "+1 en PER et +1 en VOL." }
      ]
    }
  }
});

/* ---- Demi-elfe : voie optionnelle du Compagnon ----
   Pour les demi-elfes qui n'ont assimilé aucune de leurs deux cultures.
   Elle s'ajoute aux voies déjà proposées (humain, elfe sylvain, elfe haut). */
if (COF.PEUPLES.demielfe) {
  COF.PEUPLES.demielfe.voie = {
    id: 'demielfe', nom: 'Voie du demi-elfe', caps: [
      { r: 1, n: 'Héritages', d: "La nuit étoilée compte comme de la pénombre jusqu'à 20 m. +3 aux tests de deux domaines liés à son origine (comme un humain)." },
      { r: 2, n: 'Nomade', choix: true, choixVoie: { profils: ['rodeur', 'barde'], rangMax: 2 }, d: "Obtient au choix la capacité Survie (rôdeur, voie de la survie) ou Éclectique (barde, voie du vagabond ; le bonus passe à +2 au rang 4 de cette voie)." },
      { r: 3, n: 'Capacité d’apprentissage', d: "Dé évolutif augmenté d'une catégorie : d6 jusqu'au niveau 5, d8 dès le niveau 6… et 2d6 au lieu du d12 au niveau 15." },
      { r: 4, n: 'Sang féerique', f: 'jour', choix: true, choixVoie: { profils: ['ensorceleur', 'druide'], rangMax: 3, sorts: true }, d: "Choisir un sort de rang 1 à 3 d'ensorceleur (ascendance elfe haut) ou de druide (ascendance elfe sylvain), lançable en armure sans pénalité, sans PM gagné : 3×/jour s'il est de rang 1, 2×/jour de rang 2, 1×/jour de rang 3. Un lanceur de sorts peut aussi le lancer en dépensant des PM (en plus des incantations gratuites) s'il respecte la limitation d'armure." },
      { r: 5, n: 'Empathie fantastique', d: "+1 en PER et +1 en CHA." }
    ]
  };
  COF.PEUPLES.demielfe.voieChoix = ['humain', 'elfesylvain', 'elfehaut', 'demielfe'];
  COF.PEUPLES.demielfe.voieSpeciale = "Le demi-elfe choisit la voie de l'humain, de l'elfe sylvain ou de l'elfe haut — ou, s'il n'a assimilé aucune de ses deux cultures, la voie optionnelle du demi-elfe (Compagnon du joueur).";
}

/* Le menu de création liste les peuples dans l'ordre des clés : on
   réordonne alphabétiquement après l'ajout des peuples du Compagnon. */
(function () {
  var tri = {};
  Object.keys(COF.PEUPLES)
    .sort(function (a, b) { return COF.PEUPLES[a].nom.localeCompare(COF.PEUPLES[b].nom, 'fr'); })
    .forEach(function (k) { tri[k] = COF.PEUPLES[k]; });
  COF.PEUPLES = tri;
})();
