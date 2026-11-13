/* ============================================================
   COF2 Compagnon — Temps libre (scènes de genre)
   Tout ce qu'on peut faire en dehors de la grande histoire pour
   passer le temps : jouer aux dés dans un tripot, un bras de fer,
   un concours de boisson, parier sur un combat de coqs, flâner au
   marché, danser au bal, se baigner aux bains publics, pêcher,
   veiller autour du feu… 24 activités selon le lieu (ville ou
   nature), chacune avec ses adversaires, ses lieux, ses jeux et ses
   enjeux tirés au hasard.
   Une activité se joue en 3 manches. Les mises se gagnent ou se
   perdent pour de vrai ; on peut y gagner des pièces, des rations,
   des PV, un allié, une rumeur, un objet… ou une bagarre.
   ============================================================ */
window.COF = window.COF || {};

COF.Loisirs = (function () {
  function p(l) { return l[Math.floor(Math.random() * l.length)]; }
  function d(n) { return 1 + Math.floor(Math.random() * n); }
  function T() { return COF.Conteur; }
  function K() { return COF.Carnet; }
  function M() { return COF.Monde; }
  function np(s) { return COF.Imprevus.np(s); }

  var TRIPOTS = ['Le Dé Pipé', 'La Bourse Percée', 'Chez Borgne-Gaspard', 'Le Trèfle Noir', 'La Dernière Chance', 'Le Rat qui Rit', 'L’Écu Fendu'];
  var JEUX_DES = ['la Rafle', 'le Passe-Dix', 'les Trois Corbeaux', 'la Chance du Pendu', 'le Huit-Mort'];
  var JEUX_CARTES = ['le Corbeau', 'la Dame de Fer', 'le Brelan des Rois', 'la Main du Diable', 'le Tarot des Ombres'];
  var ADVERSAIRES = ['m:forgeron aux bras énormes', 'f:mercenaire balafrée', 'm:marchand ventripotent', 'f:joueuse professionnelle aux gants de soie', 'm:noble désœuvré',
    'm:demi-orc hilare', 'f:naine taciturne', 'm:vieux soldat aux mains tremblantes', 'f:capitaine de navire', 'm:jeune fanfaron', 'm:prêtre défroqué', 'f:voleuse aux doigts fins'];
  var TRAITS = ['qui ne perd jamais, dit-on', 'qui triche sans doute', 'qui a déjà trop bu', 'qui parie gros', 'qui rit fort et frappe la table', 'au regard froid comme l’acier'];
  var MUSIQUES = ['une gigue endiablée', 'une ballade triste', 'une chanson paillarde', 'une vieille complainte de marins', 'un air de cornemuse'];
  var MARCHANDISES = ['des épices rares', 'des étoffes chatoyantes', 'des bibelots elfiques', 'des armes rouillées', 'des remèdes miracles', 'des cages d’oiseaux chanteurs'];
  var POISSONS = ['une truite argentée', 'un brochet énorme', 'quelques perches', 'une anguille récalcitrante'];

  /* lieu : 'ville' (village, ville), 'nature', 'tous'. eff : codes d'effets.
     Codes propres : gagne / gagne2 (mise ×1 / ×2), perd (la mise), hasard
     (pile ou face sur la mise), loyaute, souvenir, herbes, marche. */
  var ACTIVITES = [
    { id: 'des', lieu: 'ville', ic: '🎲', titre: 'Jouer aux dés à « {tripot} »', mise: true, slots: { tripot: TRIPOTS, jeu: JEUX_DES, a: ADVERSAIRES, trait: TRAITS },
      intro: ['La fumée pique les yeux à « {tripot} ». Autour d’une table poisseuse, on joue à {jeu}. {a_un}, {trait}, fait signe à {h} de s’asseoir. Mise : {mise} po.'],
      choix: [
        { nom: 'Lancer les dés', auto: true, aide: 'pur hasard : on gagne ou on perd la mise', ok: ['Les dés roulent sur la table…'], eff: ['hasard'] },
        { nom: 'Bluffer pour faire monter les enjeux', carac: 'CHA', ok: ['{h} affiche un sourire si sûr que {a_le} se couche.'], eff: ['gagne2'], ko: ['{a_le} n’est pas dupe et rafle tout.'], effKo: ['perd'] },
        { nom: 'Repérer les dés pipés', carac: 'PER', ok: ['{h} remarque le manège et retourne la triche contre son auteur.'], eff: ['gagne', 'rumeur'], ko: ['Rien d’anormal… et la mise s’envole.'], effKo: ['perd'] }
      ] },
    { id: 'cartes', lieu: 'ville', ic: '🃏', titre: 'Une partie de cartes', mise: true, slots: { jeu: JEUX_CARTES, a: ADVERSAIRES, trait: TRAITS },
      intro: ['Dans l’arrière-salle, une partie de {jeu} est en cours. {a_un}, {trait}, mène le jeu. Mise : {mise} po.'],
      choix: [
        { nom: 'Lire le jeu de l’adversaire', carac: 'PER', ok: ['Un tic, un regard : {h} sait exactement quoi jouer.'], eff: ['gagne'], ko: ['{a_le} reste indéchiffrable.'], effKo: ['perd'] },
        { nom: 'Calculer les probabilités', carac: 'INT', ok: ['Les cartes n’ont plus de secret pour {h}.'], eff: ['gagne'], ko: ['Un mauvais calcul, et la main est perdue.'], effKo: ['perd'] },
        { nom: 'Tricher discrètement', carac: 'AGI', ok: ['Un as glisse de la manche au bon moment.'], eff: ['gagne2', 'fac+pegre'], ko: ['« Tricheur ! » La table se renverse.'], effKo: ['perd', 'rep-', 'combat'] }
      ] },
    { id: 'brasdefer', lieu: 'ville', ic: '💪', titre: 'Un défi au bras de fer', mise: true, slots: { a: ADVERSAIRES },
      intro: ['{a_un}, une montagne de muscles, défie toute la salle au bras de fer. La foule parie déjà. Mise : {mise} po.'],
      choix: [
        { nom: 'Forcer d’un coup sec', carac: 'FOR', ok: ['Le bras adverse claque sur la table. La salle explose de joie.'], eff: ['gagne', 'rep+'], ko: ['Le poignet de {h} plie, puis cède.'], effKo: ['perd'] },
        { nom: 'Tenir sur la durée', carac: 'CON', ok: ['{a_le} finit par craquer, à bout de souffle.'], eff: ['gagne'], ko: ['La fatigue l’emporte.'], effKo: ['perd'] },
        { nom: 'Déconcentrer l’adversaire', carac: 'CHA', ok: ['Une plaisanterie bien placée, un instant d’inattention… gagné !'], eff: ['gagne'], ko: ['{a_le} ne se laisse pas distraire.'], effKo: ['perd'] }
      ] },
    { id: 'boisson', lieu: 'ville', ic: '🍺', titre: 'Un concours de boisson', mise: true, slots: { a: ADVERSAIRES },
      intro: ['« Le dernier debout gagne la cagnotte ! » {a_un} aligne déjà les chopes. Mise : {mise} po.'],
      choix: [
        { nom: 'Boire chope sur chope', carac: 'CON', ok: ['{a_le} s’écroule sous la table. {h} vacille, mais tient debout.'], eff: ['gagne'], ko: ['Le monde tourne… {h} se réveille sous un banc.'], effKo: ['perd', 'temps'] },
        { nom: 'Garder la tête froide', carac: 'VOL', ok: ['À force de volonté, {h} reste lucide jusqu’au bout.'], eff: ['gagne'], ko: ['Trop, c’est trop.'], effKo: ['perd'] },
        { nom: 'Vider ses chopes en douce', carac: 'AGI', ok: ['La moitié des chopes finit dans un pot de fleurs. Victoire !'], eff: ['gagne'], ko: ['Pris sur le fait : la salle hurle à la triche.'], effKo: ['perd', 'rep-'] }
      ] },
    { id: 'flechettes', lieu: 'ville', ic: '🎯', titre: 'Un concours de lancer de couteaux', mise: true, slots: { a: ADVERSAIRES },
      intro: ['Une planche criblée d’entailles, une ligne tracée à la craie : {a_un} lance le défi. Mise : {mise} po.'],
      choix: [
        { nom: 'Viser le centre', carac: 'AGI', ok: ['En plein dans le mille !'], eff: ['gagne'], ko: ['Le couteau rebondit et tombe.'], effKo: ['perd'] },
        { nom: 'Étudier le style de l’adversaire', carac: 'PER', ok: ['{h} repère un défaut et en profite.'], eff: ['gagne'], ko: ['Rien à tirer de cette observation.'], effKo: ['perd'] },
        { nom: 'Proposer de doubler la mise', carac: 'CHA', ok: ['{a_le} accepte… et perd gros.'], eff: ['gagne2'], ko: ['Le pari se retourne contre {h}.'], effKo: ['perd', 'perd'] }
      ] },
    { id: 'coqs', lieu: 'ville', ic: '🐓', titre: 'Les paris de la fosse aux coqs', mise: true, slots: { a: ADVERSAIRES },
      intro: ['Derrière l’écurie, une foule hurle autour d’une fosse. {a_un} prend les paris. Mise : {mise} po.'],
      choix: [
        { nom: 'Choisir le bon combattant', carac: 'PER', ok: ['Le petit coq roux l’emporte : {h} l’avait bien vu.'], eff: ['gagne'], ko: ['Le favori s’effondre au premier assaut.'], effKo: ['perd'] },
        { nom: 'Parier au hasard', auto: true, aide: 'pur hasard', ok: ['Les plumes volent…'], eff: ['hasard'] },
        { nom: 'Écouter les parieurs', carac: 'CHA', ok: ['Entre deux paris, on parle d’autre chose…'], eff: ['rumeur'], ko: ['Personne ne fait attention à {h}.'] }
      ] },
    { id: 'barde', lieu: 'ville', ic: '🎻', titre: 'Écouter un barde à la taverne', slots: { mus: MUSIQUES },
      intro: ['Un barde joue {mus} près de la cheminée. La salle chante en chœur.'],
      choix: [
        { nom: 'Chanter avec lui', carac: 'CHA', ok: ['La voix de {h} fait vibrer la salle. Le barde l’invite à sa table.'], eff: ['allie', 'tension-'], ko: ['Une fausse note, et les rires fusent.'] },
        { nom: 'Lui demander une vieille légende', carac: 'INT', ok: ['Le barde raconte une histoire qui ressemble étrangement à ce que vit {h}.'], eff: ['indice', 'rumeur'], ko: ['La légende est belle, mais sans rapport.'] },
        { nom: 'Profiter de la soirée', auto: true, aide: 'tension −1', ok: ['{h} se laisse porter par la musique. Pour une fois, tout va bien.'], eff: ['tension-'] }
      ] },
    { id: 'marche', lieu: 'ville', ic: '🧺', titre: 'Flâner au marché', slots: { mar: MARCHANDISES, a: ADVERSAIRES },
      intro: ['Le marché bat son plein : on y vend {mar}, on y crie, on y marchande. {a_un} vante sa marchandise à pleins poumons.'],
      choix: [
        { nom: 'Dénicher une bonne affaire', carac: 'PER', ok: ['Sous un tas de babioles, {h} repère un objet de valeur, vendu pour rien.'], eff: ['souvenir'], ko: ['Rien d’intéressant aujourd’hui.'] },
        { nom: 'Surveiller sa bourse', carac: 'AGI', ok: ['{h} attrape la main d’un tire-laine. La foule applaudit.'], eff: ['rep+'], ko: ['La bourse s’est allégée…'], effKo: ['po-petit'] },
        { nom: 'Faire le tour des étals', auto: true, aide: 'ouvre le marché du lieu', ok: ['{h} s’arrête à chaque étal.'], eff: ['marche'] }
      ] },
    { id: 'bains', lieu: 'ville', ic: '♨️', titre: 'Les bains publics',
      intro: ['La vapeur monte des bassins. Les bains publics sont le meilleur endroit pour se détendre… et pour entendre les ragots.'],
      choix: [
        { nom: 'Se détendre longuement', auto: true, aide: '−1 po, PV rendus', ok: ['L’eau chaude dénoue chaque muscle.'], eff: ['po-1', 'pv+'] },
        { nom: 'Écouter les ragots', carac: 'CHA', ok: ['Entre deux bassins, les langues se délient.'], eff: ['rumeur'], ko: ['On se tait quand {h} approche.'] },
        { nom: 'Se faire masser', auto: true, aide: '−2 po, tension −1', ok: ['Des mains expertes chassent la fatigue et les soucis.'], eff: ['po-1', 'po-1', 'tension-', 'pv+'] }
      ] },
    { id: 'temple', lieu: 'ville', ic: '🕯️', titre: 'Une halte au temple',
      intro: ['Le temple est calme. Des cierges brûlent devant l’autel, et un vieux prêtre balaie les dalles.'],
      choix: [
        { nom: 'Méditer en silence', carac: 'VOL', ok: ['Une paix profonde envahit {h}. L’esprit s’éclaircit.'], eff: ['indice', 'tension-'], ko: ['Les pensées tourbillonnent, impossible de trouver le calme.'] },
        { nom: 'Faire une offrande', auto: true, aide: '−1 po, tension −1', ok: ['La pièce tinte dans le tronc. Le prêtre bénit {h}.'], eff: ['po-1', 'tension-', 'fac+temple'] },
        { nom: 'Parler au vieux prêtre', carac: 'CHA', ok: ['Le prêtre en sait plus qu’il n’y paraît.'], eff: ['rumeur', 'allie'], ko: ['Le prêtre radote.'] }
      ] },
    { id: 'archives', lieu: 'ville', ic: '📚', titre: 'Fouiller les archives',
      intro: ['Dans une salle poussiéreuse, des registres, des cartes et des chroniques s’entassent jusqu’au plafond.'],
      choix: [
        { nom: 'Chercher dans les chroniques', carac: 'INT', ok: ['Une vieille chronique éclaire d’un jour nouveau la menace actuelle.'], eff: ['indiceSaga'], ko: ['Des heures de lecture… pour rien.'], effKo: ['temps'] },
        { nom: 'Convaincre l’archiviste', carac: 'CHA', ok: ['L’archiviste ouvre une armoire « interdite ».'], eff: ['indice', 'rumeur'], ko: ['« Il faut une autorisation. »'] },
        { nom: 'Étudier les cartes', carac: 'PER', ok: ['Une vieille carte mentionne un lieu oublié.'], eff: ['lieu'], ko: ['Les cartes sont trop abîmées.'] }
      ] },
    { id: 'bal', lieu: 'ville', ic: '💃', titre: 'Le bal du village', slots: { mus: MUSIQUES, a: ADVERSAIRES },
      intro: ['Lampions, guirlandes, {mus} : tout le village danse sur la place. {a_un} tend la main à {h}.'],
      choix: [
        { nom: 'Danser toute la nuit', carac: 'AGI', ok: ['{h} enchaîne les danses avec grâce. On ne parle plus que de ça.'], eff: ['rep+', 'tension-'], ko: ['{h} écrase quelques pieds…'] },
        { nom: 'Charmer son cavalier ou sa cavalière', carac: 'CHA', ok: ['Une belle complicité naît au fil de la soirée.'], eff: ['allie'], ko: ['Le charme n’opère pas.'] },
        { nom: 'Observer les invités', carac: 'PER', ok: ['Dans un coin, deux notables complotent à voix basse.'], eff: ['rumeur', 'indice'], ko: ['Rien que des gens qui s’amusent.'] }
      ] },
    { id: 'travail', lieu: 'ville', ic: '🔨', titre: 'Un petit travail pour la journée', slots: { a: ADVERSAIRES },
      intro: ['{a_un} cherche de l’aide pour la journée, contre quelques pièces : décharger des charrettes, tenir des comptes, vendre à la criée…'],
      choix: [
        { nom: 'Décharger des charrettes', carac: 'FOR', ok: ['Un travail de forçat, bien payé.'], eff: ['po+'], ko: ['{h} se froisse le dos.'], effKo: ['pv-'] },
        { nom: 'Tenir les comptes', carac: 'INT', ok: ['Les comptes sont justes : {a_le} paie double.'], eff: ['po+', 'po+'], ko: ['Une erreur coûteuse…'] },
        { nom: 'Vendre à la criée', carac: 'CHA', ok: ['Tout est vendu avant midi.'], eff: ['po+', 'rep+'], ko: ['Les passants font la sourde oreille.'] }
      ] },
    { id: 'escrime', lieu: 'ville', ic: '🤺', titre: 'Un duel amical', mise: true, slots: { a: ADVERSAIRES },
      intro: ['{a_un} propose un duel au premier sang… avec des fleurets mouchetés. Mise : {mise} po.'],
      choix: [
        { nom: 'Parer et contre-attaquer', carac: 'AGI', ok: ['Une parade, une riposte : touché !'], eff: ['gagne', 'rep+'], ko: ['{h} est touché{he} à l’épaule.'], effKo: ['perd'] },
        { nom: 'Attaquer en force', carac: 'FOR', ok: ['L’assaut balaie la garde adverse.'], eff: ['gagne'], ko: ['{a_le} esquive et touche.'], effKo: ['perd'] },
        { nom: 'Feinter', carac: 'PER', ok: ['La feinte fonctionne à merveille.'], eff: ['gagne'], ko: ['{a_le} ne mord pas à l’hameçon.'], effKo: ['perd'] }
      ] },
    { id: 'voyante', lieu: 'ville', ic: '🔮', titre: 'La roulotte de la voyante',
      intro: ['Une roulotte peinte de lunes et d’étoiles. « Entrez, voyageur… les cartes vous attendent. »'],
      choix: [
        { nom: 'Se faire tirer les cartes', auto: true, aide: '−1 po, un présage', ok: ['Les cartes se retournent : la Tour, la Lune, le Pendu… Un avertissement.'], eff: ['po-1', 'indice', 'fac+mages'] },
        { nom: 'Démasquer la charlatane', carac: 'PER', ok: ['Trucages et miroirs ! Elle supplie {h} de garder le secret, et paie son silence.'], eff: ['po+'], ko: ['Tout semble… authentique.'] },
        { nom: 'Résister à son emprise', carac: 'VOL', ok: ['Son regard hypnotique glisse sur {h}.'], eff: ['tension-'], ko: ['{h} ressort étrangement délesté{he}.'], effKo: ['po-petit'] }
      ] },
    { id: 'course', lieu: 'ville', ic: '🐎', titre: 'Les courses de chevaux', mise: true,
      intro: ['Sur le pré communal, les chevaux piaffent. Les bookmakers crient les cotes. Mise : {mise} po.'],
      choix: [
        { nom: 'Jauger les chevaux', carac: 'PER', ok: ['Le petit alezan au regard vif l’emporte d’une encolure !'], eff: ['gagne2'], ko: ['Le favori boite dès le départ.'], effKo: ['perd'] },
        { nom: 'Parier sur le favori', auto: true, aide: 'pur hasard', ok: ['Les sabots martèlent le sol…'], eff: ['hasard'] },
        { nom: 'Soudoyer un jockey', carac: 'CHA', ok: ['Le jockey retient son cheval… et {h} rafle la mise.'], eff: ['gagne2'], ko: ['Le jockey dénonce la tentative.'], effKo: ['perd', 'rep-'] }
      ] },
    { id: 'echecs', lieu: 'ville', ic: '♟️', titre: 'Une partie de « roi et tours »', mise: true, slots: { a: ADVERSAIRES, trait: TRAITS },
      intro: ['Sur un échiquier usé, {a_un}, {trait}, attend un adversaire à sa mesure. Mise : {mise} po.'],
      choix: [
        { nom: 'Jouer la défense', carac: 'INT', ok: ['Patiemment, {h} étouffe l’attaque adverse et l’emporte.'], eff: ['gagne'], ko: ['Échec et mat en douze coups.'], effKo: ['perd'] },
        { nom: 'Sacrifier une pièce pour attaquer', carac: 'VOL', ok: ['Un sacrifice audacieux, une victoire éclatante !'], eff: ['gagne2'], ko: ['Le sacrifice ne paie pas.'], effKo: ['perd'] },
        { nom: 'Bavarder pendant la partie', carac: 'CHA', ok: ['Entre deux coups, {a_le} se laisse aller aux confidences.'], eff: ['rumeur'], ko: ['« Silence, je réfléchis. »'] }
      ] },
    { id: 'theatre', lieu: 'ville', ic: '🎭', titre: 'Une troupe de comédiens', slots: { piece: ['une farce paysanne', 'une tragédie antique', 'la geste d’un héros légendaire', 'une pièce qui se moque des puissants'] },
      intro: ['Une troupe a dressé ses tréteaux sur la place et joue {piece}. Un acteur manque à l’appel…'],
      choix: [
        { nom: 'Monter sur scène pour le remplacer', carac: 'CHA', ok: ['Un triomphe ! La foule réclame {h} en rappel.'], eff: ['rep+', 'po+'], ko: ['{h} oublie son texte. Les tomates volent.'], effKo: ['rep-'] },
        { nom: 'Regarder le spectacle', auto: true, aide: 'tension −1', ok: ['On rit, on pleure, on oublie ses soucis.'], eff: ['tension-'] },
        { nom: 'Observer le public', carac: 'PER', ok: ['Dans la foule, un visage que {h} n’attendait pas…'], eff: ['rumeur', 'indice'], ko: ['Rien que des badauds.'] }
      ] },
    { id: 'forge', lieu: 'ville', ic: '⚒️', titre: 'Aider à la forge', slots: { a: ['m:forgeron bourru', 'f:forgeronne aux bras couverts de brûlures', 'm:vieux maître armurier'] },
      intro: ['{a_un} cherche quelqu’un pour tenir le marteau. « Je paie en nature : un travail sur ton équipement. »'],
      choix: [
        { nom: 'Frapper le métal', carac: 'FOR', ok: ['L’acier chante sous le marteau. {a_le} affûte les armes de {h} en remerciement.'], eff: ['indice', 'po+'], ko: ['Une brûlure douloureuse.'], effKo: ['pv-'] },
        { nom: 'Apprendre les secrets du métier', carac: 'INT', ok: ['{a_le} partage un savoir précieux, et une vieille amitié naît.'], eff: ['allie'], ko: ['« Tu n’as pas la fibre. »'] }
      ] },
    { id: 'osselets', lieu: 'ville', ic: '🦴', titre: 'Les osselets des gamins',
      intro: ['Une bande d’enfants joue aux osselets dans la poussière et met {h} au défi.'],
      choix: [
        { nom: 'Jouer avec eux', carac: 'AGI', ok: ['{h} gagne, puis rend les billes : les enfants l’adorent. Ils savent tout ce qui se passe ici.'], eff: ['rumeur', 'rep+'], ko: ['Les gamins plument {h} sans pitié.'], effKo: ['po-1'] },
        { nom: 'Les questionner sur le quartier', carac: 'CHA', ok: ['Rien n’échappe aux enfants des rues.'], eff: ['indice', 'rumeur'], ko: ['Ils s’enfuient en riant.'] }
      ] },
    { id: 'poesie', lieu: 'ville', ic: '📜', titre: 'Une joute de poésie', mise: true, slots: { a: ADVERSAIRES },
      intro: ['À l’auberge, on organise une joute de vers improvisés. {a_un} est le champion du soir. Mise : {mise} po.'],
      choix: [
        { nom: 'Improviser une rime brillante', carac: 'INT', ok: ['La salle éclate de rire et d’applaudissements.'], eff: ['gagne', 'rep+'], ko: ['La rime tombe à plat.'], effKo: ['perd'] },
        { nom: 'Déclamer avec panache', carac: 'CHA', ok: ['Le ton fait tout : {h} l’emporte.'], eff: ['gagne'], ko: ['Trop de panache, pas assez de sens.'], effKo: ['perd'] }
      ] },
    { id: 'rats', lieu: 'ville', ic: '🐀', titre: 'La course de rats', mise: true,
      intro: ['Dans une cave, on fait courir des rats dans un labyrinthe de planches. Les paris vont bon train. Mise : {mise} po.'],
      choix: [
        { nom: 'Choisir le plus vif', carac: 'PER', ok: ['Le petit gris file comme une flèche. Gagné !'], eff: ['gagne2'], ko: ['Votre rat s’endort au milieu du parcours.'], effKo: ['perd'] },
        { nom: 'Miser au hasard', auto: true, aide: 'pur hasard', ok: ['Les rats détalent…'], eff: ['hasard'] },
        { nom: 'Graisser la patte de l’organisateur', carac: 'CHA', ok: ['Un rat « dopé » au fromage fort gagne pour {h}.'], eff: ['gagne2'], ko: ['« Tricheur ! »'], effKo: ['perd', 'rep-'] }
      ] },
    { id: 'cuisine', lieu: 'ville', ic: '🍲', titre: 'Le concours du meilleur ragoût', slots: { a: ['f:aubergiste rivale', 'm:cuisinier du seigneur', 'f:grand-mère du village'] },
      intro: ['Concours de cuisine sur la place ! {a_un} remporte le titre depuis trois ans. Le prix : un tonnelet de vin et la gloire.'],
      choix: [
        { nom: 'Mitonner une recette de voyage', carac: 'INT', ok: ['Le jury reprend trois fois de ce ragoût exotique. Victoire !'], eff: ['po+', 'rep+', 'rations+'], ko: ['Trop salé. Bien trop salé.'] },
        { nom: 'Goûter tous les plats', auto: true, aide: 'un bon repas', ok: ['Ce n’est pas toujours bon, mais c’est toujours copieux.'], eff: ['rations+', 'tension-'] }
      ] },
    { id: 'funambule', lieu: 'ville', ic: '🎪', titre: 'Le défi du funambule', mise: true,
      intro: ['Un saltimbanque tend une corde entre deux maisons : « Qui traverse gagne le double de sa mise ! » Mise : {mise} po.'],
      choix: [
        { nom: 'Traverser', carac: 'AGI', ok: ['Un pas, puis un autre… {h} arrive de l’autre côté sous les vivats !'], eff: ['gagne2', 'rep+'], ko: ['La chute est rude.'], effKo: ['perd', 'pv-'] },
        { nom: 'Parier contre un autre candidat', auto: true, aide: 'pur hasard', ok: ['Le candidat s’élance…'], eff: ['hasard'] }
      ] },
    { id: 'lac', lieu: 'nature', ic: '🏊', titre: 'Un lac tranquille',
      intro: ['Un lac aux eaux sombres et calmes. L’autre rive semble cacher quelque chose.'],
      choix: [
        { nom: 'Nager jusqu’à l’autre rive', carac: 'CON', ok: ['Sur l’autre rive, un ancien ponton… et un coffret oublié.'], eff: ['souvenir', 'pv+'], ko: ['Une crampe ! {h} regagne la rive, épuisé{he}.'], effKo: ['pv-'] },
        { nom: 'Se reposer sur la berge', auto: true, aide: 'PV rendus', ok: ['Le clapotis de l’eau berce {h}.'], eff: ['pv+', 'tension-'] }
      ] },
    { id: 'falaise', lieu: 'nature', ic: '🧗', titre: 'Escalader une falaise',
      intro: ['Une falaise abrupte. Du sommet, on doit voir toute la région.'],
      choix: [
        { nom: 'Grimper', carac: 'AGI', ok: ['Au sommet, la vue est saisissante : un lieu inconnu se dessine au loin.'], eff: ['lieu', 'tension-'], ko: ['Une prise cède.'], effKo: ['pv-'] },
        { nom: 'Chercher un passage sûr', carac: 'PER', ok: ['Un sentier de chèvres mène au sommet.'], eff: ['lieu'], ko: ['Pas de passage visible.'] }
      ] },
    { id: 'oiseaux', lieu: 'nature', ic: '🦅', titre: 'Observer les oiseaux',
      intro: ['Des oiseaux tournoient au-dessus des arbres. Les anciens disaient qu’ils voient ce que les hommes ignorent.'],
      choix: [
        { nom: 'Lire leurs présages', carac: 'PER', ok: ['Leur vol trace une direction… un signe à ne pas négliger.'], eff: ['indice', 'indiceSaga'], ko: ['Des oiseaux, rien de plus.'] },
        { nom: 'Simplement les regarder', auto: true, aide: 'tension −1', ok: ['Un moment de paix rare.'], eff: ['tension-'] }
      ] },
    { id: 'champignons', lieu: 'nature', ic: '🍄', titre: 'Une cueillette de champignons',
      intro: ['Le sous-bois est couvert de champignons après la pluie. Certains sont délicieux. D’autres, mortels.'],
      choix: [
        { nom: 'Trier avec soin', carac: 'INT', ok: ['Un panier de cèpes : un festin.'], eff: ['rations+', 'rations+'], ko: ['Un doute… mieux vaut tout jeter.'] },
        { nom: 'Cueillir au hasard', auto: true, aide: 'à vos risques…', ok: ['Hmm…'], eff: ['hasardPv'] }
      ] },
    { id: 'cartes_compagnons', lieu: 'tous', ic: '🂡', titre: 'Une partie entre compagnons',
      intro: ['Un paquet de cartes cornées, quelques cailloux en guise de jetons : de quoi passer la soirée avec ceux qui partagent la route.'],
      choix: [
        { nom: 'Jouer pour le plaisir', auto: true, aide: 'loyauté des compagnons', ok: ['On triche un peu, on rit beaucoup.'], eff: ['loyaute', 'tension-'] },
        { nom: 'Raconter des histoires entre les manches', carac: 'CHA', ok: ['Les anecdotes de {h} font rire tout le monde.'], eff: ['loyaute'], ko: ['L’histoire tombe à plat.'] }
      ] },
    { id: 'lettre', lieu: 'tous', ic: '✉️', titre: 'Écrire une lettre',
      intro: ['Un moment de calme : {h} sort une plume et pense à ceux qui l’attendent quelque part.'],
      choix: [
        { nom: 'Écrire aux siens', auto: true, aide: 'tension −1', ok: ['Les mots viennent tout seuls. {h} a le cœur plus léger.'], eff: ['tension-'] },
        { nom: 'Écrire à un allié pour demander des nouvelles', carac: 'CHA', ok: ['La réponse arrivera bientôt, pleine d’informations.'], eff: ['rumeur'], ko: ['La lettre ne trouvera sans doute jamais son destinataire.'] }
      ] },
    /* ===== la nuit (proposée quand la nuit tombe, jamais en temps libre) ===== */
    { id: 'auberge', lieu: 'nuit', ic: '🛏️', titre: 'Une nuit à l’auberge « {aub} »', slots: { aub: ['Le Sanglier Joyeux', 'La Chope Fêlée', 'L’Étoile du Berger', 'Le Repos du Voyageur', 'La Vieille Lanterne', 'Au Bon Accueil'] },
      intro: ['La nuit tombe sur la ville. À l’auberge « {aub} », le feu ronfle dans la cheminée et l’aubergiste propose une chambre.'],
      choix: [
        { nom: 'Prendre une bonne chambre', auto: true, aide: '−2 po, repos complet', ok: ['Des draps propres, un vrai lit : {h} dort comme une pierre.'], eff: ['po-1', 'po-1', 'reposComplet', 'tension-'] },
        { nom: 'Dormir dans le dortoir commun', auto: true, aide: '−1 po, ronflements…', ok: ['Entre les ronflements et les puces, {h} dort quand même un peu.'], eff: ['po-1', 'pv+'] },
        { nom: 'Écouter la salle avant de monter', carac: 'PER', ok: ['Au comptoir, on parle à voix basse d’une affaire intéressante.'], eff: ['rumeur'], ko: ['Rien que des histoires de beuverie.'] },
        { nom: 'Fermer sa porte à double tour', carac: 'PER', ok: ['Bien vu : quelqu’un tente d’ouvrir la porte en pleine nuit, puis renonce.'], eff: ['indice'], ko: ['Au matin, la bourse de {h} s’est allégée…'], effKo: ['po-petit'] }
      ] },
    { id: 'bivouac', lieu: 'nuit', ic: '⛺', titre: 'Une nuit à la belle étoile', slots: { abri: ['au pied d’un grand chêne', 'dans le creux d’un rocher', 'près d’un ruisseau', 'dans les ruines d’une bergerie', 'sous un surplomb de pierre'] },
      intro: ['La nuit tombe. {h} établit son campement {abri} et allume un petit feu.'],
      choix: [
        { nom: 'Monter la garde', carac: 'PER', ok: ['Rien ne bouge, sauf une ombre que {h} repère à temps et qui s’éloigne.'], eff: ['indice'], ko: ['Un craquement, trop tard : quelque chose est là !'], effKo: ['combat'] },
        { nom: 'Dormir profondément', auto: true, aide: 'repos complet… si rien ne vient', ok: ['{h} sombre dans un sommeil sans rêves.'], eff: ['nuitRisquee'] },
        { nom: 'Veiller avec les compagnons', auto: true, aide: 'loyauté des compagnons', ok: ['Autour du feu, on partage des histoires et des silences.'], eff: ['loyaute', 'pv+'] },
        { nom: 'Rêver', auto: true, aide: 'un rêve étrange…', ok: ['Un rêve étrange visite {h}.'], eff: ['reve'] }
      ] },
    /* ===== fêtes de saison (villages, une fois par saison) ===== */
    { id: 'fete0', lieu: 'fete', saison: 0, ic: '🌸', titre: 'La fête du Renouveau à {l}', slots: { reine: ['une jeune bergère rougissante', 'la fille du meunier', 'une vieille veuve hilare', 'un garçon d’écurie déguisé'] },
      intro: ['Le village est couvert de fleurs. On danse autour d’un grand mât enrubanné, et on vient de couronner la reine du printemps : {reine}.'],
      choix: [
        { nom: 'Danser autour du mât', carac: 'AGI', ok: ['{h} tourne, saute et rit avec les villageois. On applaudit.'], eff: ['rep+', 'tension-'], ko: ['{h} s’emmêle dans les rubans et s’étale. Fou rire général.'], effKo: ['tension-'] },
        { nom: 'Planter un arbre porte-bonheur', auto: true, aide: 'la chance pour la saison', ok: ['On dit que l’arbre planté au Renouveau protège celui qui l’a mis en terre.'], eff: ['indice', 'rep+'] },
        { nom: 'Courir la course aux œufs', carac: 'CON', ok: ['{h} gagne la course, un panier d’œufs intact à bout de bras !'], eff: ['po+', 'rations+'], ko: ['Plus un seul œuf intact à l’arrivée…'] }
      ] },
    { id: 'fete1', lieu: 'fete', saison: 1, ic: '☀️', titre: 'Les feux de la Saint-Solstice à {l}', slots: { feu: ['un bûcher haut comme une maison', 'trois grands feux alignés', 'un feu de joie sur la colline'] },
      intro: ['La nuit la plus courte de l’année. {feu} illumine le village, et les jeunes gens sautent par-dessus les flammes pour conjurer le mauvais sort.'],
      choix: [
        { nom: 'Sauter par-dessus le feu', carac: 'AGI', ok: ['Un bond superbe ! On dit que cela porte chance pour l’année.'], eff: ['indice', 'rep+'], ko: ['Les bottes de {h} en gardent un souvenir roussi.'], effKo: ['pv-'] },
        { nom: 'Écouter les anciens raconter les légendes', carac: 'INT', ok: ['Au milieu des contes, un détail fait tilt : une vraie piste.'], eff: ['rumeur'], ko: ['Les légendes se mélangent dans la tête de {h}.'] },
        { nom: 'Faire un vœu dans le feu', auto: true, aide: 'tension −1', ok: ['{h} jette une brindille dans les flammes et fait un vœu en silence.'], eff: ['tension-', 'pv+'] }
      ] },
    { id: 'fete2', lieu: 'fete', saison: 2, ic: '🍂', titre: 'La fête des Moissons à {l}', slots: { plat: ['un bœuf entier à la broche', 'des tartes aux pommes à n’en plus finir', 'du cidre nouveau'] },
      intro: ['Les greniers sont pleins. Tout le village est attablé dehors : {plat}, de la musique et des concours en tout genre.'],
      choix: [
        { nom: 'Concours du plus gros mangeur', carac: 'CON', ok: ['{h} engloutit tout et réclame encore ! La foule acclame le champion.'], eff: ['rations+', 'rep+'], ko: ['{h} doit déclarer forfait, le ventre au bord de l’explosion.'] },
        { nom: 'Lancer de bottes de foin', carac: 'FOR', ok: ['La botte vole par-dessus la grange !'], eff: ['po+', 'rep+'], ko: ['La botte retombe sur le pied de {h}.'] },
        { nom: 'Aider aux dernières récoltes', auto: true, aide: 'réputation', ok: ['Un coup de main aux champs : on ne l’oubliera pas.'], eff: ['rep+', 'tension-'] }
      ] },
    { id: 'fete3', lieu: 'fete', saison: 3, ic: '❄️', titre: 'La Longue Veillée d’hiver à {l}', slots: { conteur: ['un vieux berger aveugle', 'la doyenne du village', 'un ménestrel de passage'] },
      intro: ['Dehors, le vent hurle et la neige tombe. Dedans, tout le village s’est réuni autour de la grande cheminée pour la Longue Veillée. {conteur} commence une histoire.'],
      choix: [
        { nom: 'Raconter une de ses aventures', carac: 'CHA', ok: ['Le récit de {h} tient tout le monde en haleine jusqu’au bout de la nuit.'], eff: ['rep+', 'loyaute'], ko: ['Le public s’endort avant la fin.'] },
        { nom: 'Partager le vin chaud', auto: true, aide: 'PV et tension', ok: ['Le vin épicé réchauffe le corps et le cœur.'], eff: ['pv+', 'tension-'] },
        { nom: 'Écouter les histoires d’autrefois', carac: 'PER', ok: ['Dans une vieille histoire, {h} reconnaît un lieu bien réel…'], eff: ['lieu'], ko: ['De belles histoires, rien de plus.'] }
      ] },
    /* ===== nature ===== */
    { id: 'peche', lieu: 'nature', ic: '🎣', titre: 'Une partie de pêche', slots: { poi: POISSONS },
      intro: ['Une rivière paresseuse, un saule, une ligne improvisée : de quoi passer quelques heures tranquilles.'],
      choix: [
        { nom: 'Pêcher avec patience', carac: 'PER', ok: ['Au bout de la ligne : {poi} !'], eff: ['rations+'], ko: ['Rien ne mord.'] },
        { nom: 'Pêcher à la main', carac: 'AGI', ok: ['D’un geste vif, {h} attrape {poi}.'], eff: ['rations+'], ko: ['{h} finit trempé{he}, les mains vides.'] },
        { nom: 'Rêvasser au bord de l’eau', auto: true, aide: 'tension −1', ok: ['{h} regarde l’eau couler. Les soucis s’en vont avec elle.'], eff: ['tension-'] }
      ] },
    { id: 'veillee', lieu: 'tous', ic: '🔥', titre: 'Une veillée au coin du feu',
      intro: ['Le feu crépite. Les étoiles s’allument une à une. Un moment pour souffler, et pour parler.'],
      choix: [
        { nom: 'Chanter de vieilles chansons', carac: 'CHA', ok: ['Les voix montent dans la nuit. Les compagnons se sentent plus proches.'], eff: ['loyaute', 'tension-'], ko: ['La chanson s’éteint d’elle-même.'] },
        { nom: 'Raconter ses aventures', auto: true, aide: 'tension −1', ok: ['{h} raconte, et les flammes dansent au rythme du récit.'], eff: ['tension-', 'loyaute'] },
        { nom: 'Observer les étoiles', carac: 'INT', ok: ['Les constellations annoncent quelque chose…'], eff: ['indice'], ko: ['Les nuages cachent le ciel.'] }
      ] },
    { id: 'entrainement', lieu: 'tous', ic: '⚔️', titre: 'S’entraîner aux armes',
      intro: ['Un espace dégagé, un mannequin de paille ou un tronc d’arbre : de quoi garder la main.'],
      choix: [
        { nom: 'Frapper encore et encore', carac: 'FOR', ok: ['Les gestes deviennent plus sûrs.'], eff: ['indice'], ko: ['{h} se froisse un muscle.'], effKo: ['pv-'] },
        { nom: 'Travailler l’esquive', carac: 'AGI', ok: ['{h} se sent plus vif que jamais.'], eff: ['indice', 'tension-'], ko: ['Une chute malencontreuse.'], effKo: ['pv-'] },
        { nom: 'S’entraîner avec les compagnons', auto: true, aide: 'loyauté des compagnons', ok: ['Des passes d’armes amicales, des rires, des bleus.'], eff: ['loyaute'] }
      ] },
    { id: 'source', lieu: 'nature', ic: '💧', titre: 'Une source claire',
      intro: ['Une source jaillit entre des rochers moussus. L’eau est fraîche et limpide.'],
      choix: [
        { nom: 'Se baigner', carac: 'CON', ok: ['L’eau glacée fouette le sang et soulage les blessures.'], eff: ['pv+'], ko: ['Trop froide ! {h} grelotte longtemps.'] },
        { nom: 'Se reposer à l’ombre', auto: true, aide: 'PV rendus', ok: ['Une sieste réparatrice au bruit de l’eau.'], eff: ['pv+', 'temps'] },
        { nom: 'Chercher des traces autour', carac: 'PER', ok: ['Des empreintes récentes près de la source…'], eff: ['indice'], ko: ['Rien de particulier.'] }
      ] },
    { id: 'sculpter', lieu: 'tous', ic: '🪵', titre: 'Sculpter, écrire, réparer',
      intro: ['Une halte, un peu de temps devant soi : {h} sort son couteau, son carnet, ou ses outils.'],
      choix: [
        { nom: 'Sculpter une figurine', carac: 'AGI', ok: ['Une jolie figurine prend forme : elle se vendra bien.'], eff: ['souvenir'], ko: ['Le bois éclate.'] },
        { nom: 'Écrire dans son journal', auto: true, aide: 'tension −1', ok: ['Mettre ses pensées par écrit fait du bien.'], eff: ['tension-'] },
        { nom: 'Entretenir son équipement', carac: 'INT', ok: ['Tout est affûté, huilé, recousu.'], eff: ['indice'], ko: ['Une boucle casse.'] }
      ] },
    { id: 'herbes', lieu: 'nature', ic: '🌿', titre: 'Cueillir des herbes',
      intro: ['La prairie est pleine de plantes : certaines soignent, d’autres tuent. Encore faut-il les reconnaître.'],
      choix: [
        { nom: 'Reconnaître les plantes utiles', carac: 'INT', ok: ['{h} rapporte de quoi préparer un remède.'], eff: ['herbes'], ko: ['Des mauvaises herbes, rien de plus.'] },
        { nom: 'Fouiller les sous-bois', carac: 'PER', ok: ['Un coin de champignons et de baies.'], eff: ['rations+'], ko: ['Un buisson d’orties…'] },
        { nom: 'Goûter une baie inconnue', auto: true, aide: 'à vos risques…', ok: ['Hmm…'], eff: ['hasardPv'] }
      ] },
    { id: 'chasse', lieu: 'nature', ic: '🏹', titre: 'Chasser le petit gibier',
      intro: ['Des traces de lapins, des perdrix dans les fourrés : une bonne occasion de remplir le garde-manger.'],
      choix: [
        { nom: 'Poser des collets', carac: 'INT', ok: ['Les collets ont fait leur office.'], eff: ['rations+'], ko: ['Les collets sont vides.'] },
        { nom: 'Tirer à vue', carac: 'AGI', ok: ['Un tir net, un repas assuré.'], eff: ['rations+'], ko: ['Le gibier détale.'] },
        { nom: 'Pister une proie plus grosse', carac: 'PER', ok: ['Un chevreuil ! De quoi manger plusieurs jours.'], eff: ['rations+', 'rations+'], ko: ['La piste mène à une tanière… occupée.'], effKo: ['combat'] }
      ] },
    { id: 'contemplation', lieu: 'nature', ic: '🌄', titre: 'Contempler le paysage',
      intro: ['Du haut d’une butte, la région s’étend à perte de vue. Un instant suspendu.'],
      choix: [
        { nom: 'Méditer', carac: 'VOL', ok: ['Un calme profond s’installe. Les blessures semblent moins lourdes.'], eff: ['pv+', 'tension-'], ko: ['Les pensées s’agitent.'] },
        { nom: 'Repérer les environs', carac: 'PER', ok: ['Au loin, un lieu que {h} ne connaissait pas.'], eff: ['lieu'], ko: ['La brume cache tout.'] },
        { nom: 'Simplement profiter', auto: true, aide: 'tension −1', ok: ['Il fait beau. C’est déjà beaucoup.'], eff: ['tension-'] }
      ] }
  ];

  function modele(id) { return ACTIVITES.filter(function (a) { return a.id === id; })[0]; }
  function remplir(a, c) {
    var v = {};
    Object.keys(a.slots || {}).forEach(function (k) {
      var x = p(a.slots[k]);
      if (/^[mf]:/.test(x)) { var g = np(x); v[k + '_un'] = g.un; v[k + '_le'] = g.le; v[k + '_e'] = g.e; } else v[k] = x;
    });
    if (a.mise) v.mise = Math.max(1, (d(4) + 1) * Math.max(1, Math.ceil(T().niveau(c) / 2)));
    return v;
  }
  /* 3 activités possibles ici (stables jusqu'à la scène suivante). */
  function offres(c) {
    var o = c.offresLoisirs;
    if (o && o.n === c.scenes.length && o.pos === c.position) return o.liste;
    var ici = M().ici(c), ville = !!(ici && (ici.ville || ici.env === 'urbain'));
    var l = ACTIVITES.filter(function (a) { return a.lieu !== 'nuit' && a.lieu === 'tous' || (ville ? a.lieu === 'ville' : a.lieu === 'nature'); })
      .sort(function () { return Math.random() - 0.5; }).slice(0, 3);
    var liste = l.map(function (a) {
      var v = remplir(a, c);
      return { id: a.id, ic: a.ic, v: v, titre: T().dire(a.titre, Object.assign({ _vus: null, h: 'le héros' }, v)) };
    });
    c.offresLoisirs = { n: c.scenes.length, pos: c.position, liste: liste };
    return liste;
  }
  function intro(c, s, ctx) {
    var a = modele(s.loisir.id); if (!a) return '';
    return T().dire(a.intro, Object.assign({}, ctx, s.loisir.v));
  }
  function choix(c, s) {
    var a = modele(s.loisir.id); if (!a) return [];
    var ctx = Object.assign(T().contexte(c, s), s.loisir.v), base = T().difficulteBase(c);
    return a.choix.map(function (ch, i) {
      var o = { i: i, nom: T().polir(T().ex(ch.nom, ctx)), auto: !!ch.auto, aide: ch.aide };
      if (!ch.auto) { o.carac = ch.carac; o.mod = T().caracHeros(c, ch.carac); o.diff = base; }
      return o;
    });
  }
  /* Une manche : jet (ou hasard), récit, gains et pertes. */
  function agir(c, s, i) {
    var a = modele(s.loisir.id), ch = a && a.choix[i]; if (!ch) return {};
    var j = s.jeu, v = s.loisir.v, ctx = Object.assign(T().contexte(c, s), v), m = [], reussi = true, txt;
    if (ch.auto) { txt = T().dire(ch.ok, ctx); }
    else {
      var jt = T().jet(c, s, ch.carac, T().difficulteBase(c), T().motsPour(null, ch.carac, ch.nom));
      reussi = jt.reussi; m.push(jt.m);
      txt = T().dire(reussi ? ch.ok : (ch.ko || ['Raté.']), ctx);
      if (COF.Plume) { var io = COF.Plume.issue(jt.r, reussi, T().difficulteBase(c), ctx); if (io) txt += ' ' + io; }
    }
    var acte = T().dire(ch.nom, ctx), verd = ch.auto ? null : T().verdict(Object.assign({ diff: T().difficulteBase(c) }, jt));
    var codes = (reussi ? ch.eff : ch.effKo) || [], autres = [], out = {}, mise = v.mise || 0;
    codes.forEach(function (code) {
      switch (code) {
        case 'gagne': m.push(T().payer(c, mise)); break;
        case 'gagne2': m.push(T().payer(c, mise * 2)); break;
        case 'perd': m.push(perdre(c, mise)); break;
        case 'hasard':
          if (Math.random() < 0.45) { m.push(T().payer(c, mise));   /* la maison gagne un peu plus souvent */ txt += ' ' + T().dire(['La chance sourit à {h} !', 'Gagné !'], ctx); }
          else { m.push(perdre(c, mise)); txt += ' ' + T().dire(['Perdu…', 'La chance tourne le dos à {h}.'], ctx); reussi = false; }
          break;
        case 'hasardPv':
          if (Math.random() < 0.5) { autres.push('pv+'); txt += ' Délicieuse, et revigorante !'; }
          else { autres.push('pv-'); txt += ' Amère… et indigeste.'; reussi = false; }
          break;
        case 'loyaute': {
          var cps = (c.pnj || []).filter(function (x) { return x.compagnon && x.compagnon.actif; });
          cps.forEach(function (x) { x.compagnon.loyaute = Math.min(10, (typeof x.compagnon.loyaute === 'number' ? x.compagnon.loyaute : 5) + 1); });
          if (cps.length) m.push('loyauté +1 (' + cps.map(function (x) { return x.nom; }).join(', ') + ')');
          break;
        }
        case 'souvenir': {
          var hP = T().heros(c), nomO = p(['Figurine sculptée', 'Bibelot ancien', 'Petit miroir d’argent', 'Tabatière ouvragée', 'Broche de cuivre']);
          if (hP) { COF.Store.ajouterObjet(hP, { nom: nomO, qte: 1, prix: 2 + d(6), prixPa: (2 + d(6)) * 10 }); COF.Store.sauver(hP); m.push('🎒 ' + nomO); }
          break;
        }
        case 'herbes': {
          var hH = T().heros(c);
          if (hH) { COF.Store.ajouterObjet(hH, { nom: 'Herbes médicinales', qte: 1, prix: 1, desc: 'Rend 1d4° PV (préparées en cataplasme).' }); COF.Store.sauver(hH); m.push('🎒 Herbes médicinales'); }
          break;
        }
        case 'marche': out.marche = true; break;
        case 'reposComplet': {
          var hR = T().heros(c); if (hR) { if (hR.pv === null || hR.pv === undefined) COF.Store.reinitialiser(hR); var avR = hR.pv; hR.pv = COF.Calc.pvMax(hR); COF.Store.sauver(hR); m.push('+' + (hR.pv - avR) + ' PV (repos complet)'); }
          break;
        }
        case 'nuitRisquee':
          /* à la belle étoile, une nuit sur quatre est interrompue */
          if (Math.random() < 0.25) { txt += ' ' + T().dire('Au cœur de la nuit, des bruits tout proches réveillent {h} en sursaut !', ctx); out.combat = true; reussi = false; }
          else { autres.push('pv+', 'pv+'); }
          break;
        case 'reve':
          if (COF.Saga && c.saga && !c.saga.fini && Math.random() < 0.6) { txt += ' ' + T().dire(['Dans le rêve, {menace} parle d’une voix d’outre-tombe, et laisse échapper un indice.', 'Un rêve prémonitoire : {h} voit le repaire de {menace}, l’espace d’un instant.'], Object.assign({ menace: c.saga.nom }, ctx)); autres.push('indiceSaga'); }
          else { txt += ' ' + p(['Un rêve d’enfance, doux et apaisant.', 'Un cauchemar laisse {h} en sueur au réveil.']).replace('{h}', ctx.h); autres.push(Math.random() < 0.5 ? 'tension-' : 'tension+'); }
          break;
        default: autres.push(code);
      }
    });
    if (autres.length) { var r = COF.Imprevus.appliquer(c, s, autres, ctx, { v: v }); if (r.m) m.push(r.m); if (r.combat) out.combat = true; }
    var triche = (ch.eff || []).indexOf('fac+pegre') >= 0;
    if (triche && !reussi && COF.Echos) COF.Echos.noter(c, 'tricheur', {});   /* démasqué : on s'en souviendra ici */
    if (COF.Troupe) COF.Troupe.reagir(c, triche ? 'tricher' : (ch.eff || []).indexOf('fac+temple') >= 0 ? 'offrande' : 'loisir', ctx).forEach(function (n) { txt += ' ' + n.txt; m.push(n.m); });
    j.prog++;
    if (!reussi) j.danger++;
    K().ajouterEntree(c, { t: 'recit', txt: txt, m: m.filter(Boolean).join(' · ') || 'sans jet', ok: reussi, a: acte, v: verd });
    s = K().sceneCourante(c);
    if (out.combat) { out.menace = T().engager(c, s, null); K().sauver(c); return out; }
    if (s.jeu.prog >= s.jeu.progMax || s.jeu.danger >= s.jeu.dangerMax) T().finir(c, s, s.jeu.danger >= s.jeu.dangerMax ? 'echec' : 'reussite');
    K().sauver(c);
    return out;
  }
  function perdre(c, n) {
    var hP = T().heros(c); if (!hP) return '';
    hP.bourse = hP.bourse || { po: 0, pa: 0, pc: 0 };
    var x = Math.min(n, hP.bourse.po || 0); hP.bourse.po -= x; COF.Store.sauver(hP);
    return x ? '−' + x + ' po' : 'bourse vide';
  }
  /* La nuit : auberge en ville, bivouac ailleurs. */
  function nuit(c) {
    var ici = M().ici(c), a = modele(ici && (ici.ville || ici.env === 'urbain') ? 'auberge' : 'bivouac'), v = remplir(a, c);
    return { id: a.id, ic: a.ic, v: v, nuit: true, titre: T().dire(a.titre, Object.assign({ _vus: null, h: 'le héros' }, v)) };
  }
  /* La fête de la saison dans ce village. */
  function fete(c, saison) {
    var ici = M().ici(c), a = ACTIVITES.filter(function (x) { return x.lieu === 'fete' && x.saison === saison; })[0]; if (!a) return null;
    var v = remplir(a, c); v.l = ici ? ici.nom : 'ce village';
    return { id: a.id, ic: a.ic, v: v, fete: true, titre: T().dire(a.titre, Object.assign({ _vus: null, h: 'le héros' }, v)) };
  }
  return { nuit: nuit, fete: fete, ACTIVITES: ACTIVITES, offres: offres, intro: intro, choix: choix, agir: agir };
})();
