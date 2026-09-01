# COF2 Compagnon

Application web (HTML / CSS / JS, sans dépendance) pour **Chroniques Oubliées Fantasy 2e édition**.
Pensée mobile en mode portrait, **installable comme application (PWA)**, 100 % hors ligne après
le premier chargement, données stockées dans le navigateur.

## Lancer l'application

Ouvrez `index.html`. Pour que les scripts se chargent correctement, servez le dossier plutôt
que d'ouvrir le fichier directement :

```bash
python -m http.server 8777
```

Puis rendez-vous sur `http://localhost:8777`.

## Ce qui est en place

### Base de données (`js/data/`)

| Fichier | Contenu |
|---|---|
| `rules.js` | Caractéristiques, familles de profils, séries de création, difficultés, états préjudiciables, dés évolutifs, niveaux requis par rang, aide-mémoire |
| `peuples.js` | 8 peuples (modificateurs, profils typiques) + leurs 7 voies de peuple + la voie du mage |
| `equipement.js` | 22 armes de contact, 15 armes à distance, 8 armures, boucliers, matériel, montures |
| `profils-aventuriers.js` | Arquebusier, Barde, Rôdeur, Voleur |
| `profils-combattants.js` | Barbare, Chevalier, Guerrier |
| `profils-mages.js` | Ensorceleur, Forgesort, Magicien, Sorcier |
| `profils-mystiques.js` | Druide, Moine, Prêtre |
| `prestige-generiques.js` | Expert, spécialiste, lycanthrope, sang-dragon, familier fantastique |
| `prestige-aventurier.js` | 12 voies de prestige d'aventurier |
| `prestige-combattant.js` | 12 voies de prestige de combattant |
| `prestige-mage.js` | 12 voies de prestige de mage |
| `prestige-mystique.js` | 12 voies de prestige de mystique |
| `compagnons.js` | 14 gabarits de compagnons (loup, familiers, golem, zombie, montures, familier fantastique, vermine, être féérique...) |
| `bestiaire-1/2/3.js` | 84 créatures du livre de base : 10 humanoïdes, 24 animaux, 50 créatures fantastiques — avec 8 environnements et 3 catégories |
| `bestiaire-supp-1/2/3.js` | 202 créatures supplémentaires extraites du supplément *Bestiaire* (Black Book Éditions, 2025) — 286 créatures au total. Catégorie et environnements déduits automatiquement du texte source ; à corriger au cas par cas si besoin (voir note ci-dessous) |
| `pnj.js` | Générateur de PNJ : syllabaires procéduraux par peuple, âges, apparence, ~65 métiers, idéal/travers officiels, manies, motivations, secrets, accroches, panthéon d'Osgild (31 divinités) |
| `recompenses.js` | Générateur de butin : richesse par environnement et par palier (pauvre → somptueux), objets divers et trouvailles de fouille, trophées/composants de créature, objets de valeur de coffre, catalogue de 30 objets magiques sur trois paliers |
| `oracle.js` | Oracle & Muse pour le solo : 9 niveaux de vraisemblance, 22 focus × 65 actions × 62 sujets (≈ 89 000 combinaisons d'événement), 62 mots d'inspiration, détails sensoriels par sens |
| `atlas-mage.js` | *Atlas d'Osgild* : 3 voies supplémentaires de magicien (arcanes exhumés, oubliés, perdus) et 1 de sorcier (arcanes obscurs) |
| `atlas-mystique.js` | *Atlas d'Osgild* : voie de la corruption (prêtre maléfique, en alternative à la voie des soins) |
| `historique.js` | *Atlas d'Osgild* : 9 voies d'origine géographique (campagnes, cités, déserts, forêts, grottes, marais, montagnes, plaines, rivages) et 8 voies professionnelles (courtisan, érudit, expert, homme du peuple, homme d'armes, miséreux, nanti, nomade) |

**14 profils × 5 voies × 5 rangs = 350 capacités**, plus 40 capacités de peuple et
**53 voies de prestige × 5 rangs = 265 capacités** : **655 au total**.

Chaque capacité est structurée pour être exploitable par le moteur :

```js
{ r: 3, n: 'Attaque brutale', a: 'L', s: false, f: 'combat',
  dmg: '1d4°', comp: 'course, saut', bon: '2+rang', choix: false,
  d: "Description mécanique condensée." }
```

- `r` rang · `n` nom · `a` type d'action (A/L/M/G) · `s` sort · `f` fréquence
- `dmg` formule de dommages exploitée par le lanceur de dés
- `comp` / `bon` bonus de compétence (affiché et calculé automatiquement)
- `choix` la capacité ouvre le choix d'une autre capacité
- `t` nature de la formule : `bonus` (s'ajoute aux DM d'une arme ou d'un sort),
  `soin` (restaure des PV), absent (dommages directs)

### Moteur (`js/core/`)

- **`dice.js`** — d20 avec dé bonus / dé malus (ils s'annulent), détection des critiques et
  échecs critiques, plage de critique configurable (rapière 19-20…), doublement des DM sur
  critique, minimum 1 DM. Analyseur de formules reconnaissant `2d6`, `3d4°` (dé évolutif),
  `FOR`/`AGI`/`CON`/`PER`/`CHA`/`INT`/`VOL`, `rang`, `niveau`.
- **`calc.js`** — toutes les valeurs dérivées : PV, PM, PC, DR, DEF (avec plafond d'AGI dû à
  l'armure), Initiative, valeurs d'attaque (plafonnées au niveau 10), dé évolutif, points de
  capacité, bonus de compétence. Reconnaît aussi les clés `historique.<id>` (voies d'*Atlas
  d'Osgild*) : coût fixe d'1 point de capacité par rang et aucun niveau requis, quel que soit
  le rang.
- **`compagnons.js`** — calcule DEF/PV/Init./attaque d'un compagnon pour le personnage courant ;
  détecte l'éligibilité même via une voie de profil hybride ou une voie de prestige.
- **`rencontre.js`** — générateur de rencontres. Barème de points par NC calibré sur les
  exemples de rencontres du bestiaire, budget indexé sur la taille et le niveau du groupe,
  et quatre stratégies de composition (solitaire, bande hiérarchisée, meute, groupe hétéroclite).
- **`pnj.js`** (core) — moteur procédural : 19 champs générés dans l'ordre de leurs dépendances
  (peuple → genre → nom → âge, puis apparence, vie sociale, personnalité, accroches), chacun
  regénérable individuellement en conservant le reste.
- **`recompense.js`** — trois générateurs de butin partageant les mêmes tables :
  `generer(r)` construit le butin d'une rencontre déjà générée (pièces indexées sur les points
  consommés et la composition — un humanoïde porte une bourse, une bête sauvage n'en a pas —,
  objets mondains pillés sur les humanoïdes, trophées/composants sur la faune et les créatures
  fantastiques) ; `genererFouille(opts)` produit une petite trouvaille (niveau + richesse choisis
  directement, sans rencontre) ; `genererCoffre(opts)` un trésor accumulé, plus généreux en
  pièces et en objets de valeur, avec une meilleure chance d'objet magique (jusqu'à deux sur un
  coffre somptueux). Dans les trois cas, un objet magique de type « Arme +N » ou « Armure +N » se
  concrétise en une arme ou une armure réelle du jeu (ex. « Rapière +1 », « Cotte de mailles +2 »)
  plutôt que de rester une étiquette abstraite ; le palier accessible (mineur / majeur /
  légendaire) s'ouvre progressivement avec le niveau.
- **`arene.js`** — état d'un combat en cours (combattants PJ/créatures, initiative, états, round,
  tour), persisté dans le navigateur. Les créatures sont des instantanés propres à l'arène ; les
  PJ restent liés à leur personnage (PV, DEF, armes, sorts toujours relus depuis `COF.Store`), si
  bien que les dégâts encaissés en combat se reflètent directement sur la fiche.
- **`oracle.js`** — moteur de l'Oracle & Muse : `repondre(niveau)` tire un d100 contre le seuil du
  niveau de vraisemblance choisi et distingue six nuances de réponse (de « Oui, et plus encore »
  à « Non, et pire encore ») ; un double au dé (11, 22…) déclenche en plus un événement aléatoire.
  `evenement()` combine un focus narratif, une action et un sujet tirés indépendamment (22×65×62,
  soit environ 89 000 combinaisons) ; `inspiration()` tire deux mots évocateurs distincts parmi 62
  pour une étincelle libre ; `testScene()` détermine si une scène se déroule comme prévu, est
  modifiée ou interrompue ; `detailSensoriel(sens)` pioche un détail de description par sens. Tout
  est combinatoire plutôt que basé sur des phrases toutes faites, pour qu'une redondance perceptible
  n'apparaisse qu'après des centaines de tirages.
- **`store.js`** — sauvegarde locale, personnages multiples, équipement de départ, journal de
  jets, export / import JSON.

### Interface (`js/ui/`)

- **Fiche** — trois sous-onglets.
  - *Fiche* : caractéristiques cliquables (test d20), combat, jauges PV/PM/PC/DR avec
    récupération rapide et complète, états préjudiciables, armes (attaque + dommages en deux
    taps), sorts (dépense automatique des PM, brûlure de mana si besoin), capacités, bonus de
    compétence, équipement, ajustements permanents, notes. Monter d'un niveau augmente les PV
    actuels du même montant que les PV maximum, pas seulement le maximum. Avant tout jet de
    dommages, un champ libre permet d'ajouter un bonus circonstanciel (`+1`, `+1d4`...) sans
    toucher à la formule de base. Les sorts/capacités utilisables avec deux types d'action
    différents (ex. Rétrécissement, Agrandissement, Ventriloquie) affichent un bouton pour choisir
    laquelle est utilisée.
  - *Objets* : la liste complète des armes et objets du personnage, avec leur description
    entière (pas un résumé) et leur coût s'il est connu — pas seulement les armes équipées, aussi
    les armures, boucliers et objets divers ramassés en jeu. L'armure et le bouclier sont chacun
    un **emplacement unique** : équiper une armure trouvée (bouton **Équiper**) remplace
    l'armure du catalogue en cours (et inversement) au lieu de s'y additionner — plus de menu
    déroulant, un vrai changement d'emplacement, avec le detail affiché dans la carte Équipement
    de la Fiche (bouton **Changer** listant le catalogue et les objets trouvés). Chaque arme ou
    objet a un bouton **⇄** pour le transférer instantanément vers un autre personnage enregistré.
    Une arme trouvée (butin ou générateur de Trésors) rejoint directement cette liste avec sa
    vraie formule de dégâts (bonus de FOR inclus, comme n'importe quelle arme équipée
    manuellement) — et le bonus magique ou les dégâts élémentaires d'un pouvoir de Trésors s'y
    ajoutent aussi, au jet d'attaque comme aux dégâts. Les capacités
    dont l'effet grandit avec le nombre de voies d'un même profil poussées à un rang donné (ex.
    *Attaque sournoise* : +1d4° par rang 4 atteint dans une voie de voleur, jusqu'à 7d4°) recalculent
    désormais leur formule de dégâts en fonction des voies réellement acquises, au lieu de rester
    figées à leur valeur de base. Sont couvertes : Attaque sournoise, Blessure majeure, Transe de
    guérison, Récupération majeure (dés supplémentaires), Marteau de la foi et Projectile de mana
    (bonus fixe croissant, plafonné par l'INT pour ce dernier). Les capacités où le rang débloque
    autre chose qu'un dé de dégâts (charges d'un objet, nombre d'usages par jour, choix
    supplémentaires, bonus appliqué à une arme extérieure à la capacité...) restent décrites en
    texte libre : c'est un mécanisme différent, plus proche des bonus passifs déjà mis de côté.
    Les voies de prestige (rang 4-8) sont désormais incluses dans le vivier des capacités/sorts
    proposés par les pickers de choix de voie qui ne sont pas restreints à une liste de profils
    précise, ce qui permet par exemple à *Pouvoir puissant* de vraiment piocher jusqu'au rang 8
    comme l'indique son texte. Changer une option (niveau, armure, voie acquise/retirée...) ne
    referme plus les sections dépliées ni ne fait sauter la page en haut : la position de
    défilement et l'état replié/déplié de chaque section sont conservés d'un rafraîchissement à
    l'autre, aussi bien dans Fiche que dans Voies.
  - *Voies* : cinq sections. Les voies du profil et la voie de peuple (+ voie du mage) sont
    mises en avant — le magicien, le sorcier et le prêtre y trouvent aussi les voies
    supplémentaires de l'*Atlas d'Osgild* (arcanes exhumés/oubliés/perdus, arcanes obscurs,
    corruption), sélectionnables dès le niveau 1 comme n'importe quelle autre voie de profil ;
    les **voies de prestige** (rangs 4 à 8, une seule par carrière, verrouillage automatique des
    autres dès qu'une est choisie), les **voies de tous les autres profils** pour construire un
    profil hybride, et les **voies d'historique** (règle optionnelle de l'*Atlas* : 9 voies
    d'origine géographique et 8 voies professionnelles, 1 point de capacité par rang, sans
    niveau requis) sont accessibles dans des sections repliées. Acquisition rang par rang avec
    vérification du niveau requis et suivi des points de capacité. Les capacités qui laissent
    piocher une capacité (ou un sort) dans une autre voie — *Plus d'une corde à son arc*,
    *Touche-à-tout*, *Talent pour la violence/la magie*, *Enfant de la forêt*, *Don étrange*,
    *Combattant aguerri*, *Formation d'élite*, les *Domaines* du touche-à-tout, les capacités de
    néophyte/initié/professionnel/expert/maître de la voie de l'expert, *Bâton magique*, *Pouvoir
    unique/puissant*... — ouvrent une liste des capacités éligibles (filtrée par profil, famille ou
    rang selon la règle) à choisir directement dans l'appli ; celles qui accordent un bonus de
    caractéristique définitif au choix (ex. *Caractéristique d'expert*) l'appliquent aussitôt sur
    la fiche (et le retirent automatiquement si le rang qui l'octroie est retiré). Ce mécanisme
    n'est branché que sur les capacités explicitement repérées comme de simples piochages dans un
    vivier de capacités/sorts ; les capacités à choix plus spécifiques (cristaux, élixirs, élément
    de prédilection, bonus « au choix » non liés à une liste de capacités) restent décrites en
    texte libre.
- **Bestiaire** — 286 créatures (84 du livre de base + 202 du supplément *Bestiaire*), filtrables
  par **environnement** (les cinq milieux naturels du livre plus villes, ruines et terres
  glacées), par **catégorie** et par **plage de NC** (jusqu'à NC 21 pour les créatures épiques du
  supplément), avec recherche plein texte sur le nom et la description. Chaque fiche donne le
  profil complet (caractéristiques cliquables pour un test, DEF/PV/Init., RD, capacités) et un
  bouton Attaquer par mode d'attaque, qui enchaîne test d'attaque puis dégâts. Les **capacités**
  qui indiquent une action (souffle, attaque en traître...) ont elles aussi un bouton **Utiliser**,
  sur le modèle des compétences de voie d'un PJ : modificateur par défaut repris de l'attaque
  principale (ou de l'attaque magique NC + VOL, modifiable), et un champ de bonus circonstanciel
  pour chiffrer des dégâts variables quand la fiche n'en donne pas de formule toute faite (ex.
  « +1d4 DM » d'une attaque en traître). Le filtre est exposé via `COF.UI.Bestiaire.filtrer()`,
  utilisé par le générateur de rencontres.

  *Les 202 créatures du supplément ont été extraites automatiquement du PDF (script d'analyse de
  texte) : les statistiques de combat (caractéristiques, DEF/PV/Init/RD, attaques) sont fiables,
  mais la catégorie, les environnements de rencontre et, plus rarement, le texte de certaines
  capacités sont déduits par heuristique et peuvent nécessiter une retouche ponctuelle.*
- **Compagnons** — carte dédiée sur la fiche : les compagnons accessibles par les voies déjà
  acquises (rôdeur, druide, magicien, forgesort, sorcier, chevalier, ou certaines voies de
  prestige) apparaissent en un clic ; chaque compagnon actif a son nom éditable, sa propre jauge
  de PV, et un bouton Attaquer qui enchaîne test d'attaque puis dégâts comme pour une arme.
- **Arène** — onglet principal : suivi de combat complet. Importez une rencontre générée en un
  clic (tous ses lots deviennent des combattants individuels), ajoutez des créatures piochées
  dans le bestiaire ou des personnages enregistrés. Chaque combattant a sa propre jauge de PV
  (+/-) et, pour un personnage qui lance des sorts, sa jauge de PM ; ses états préjudiciables
  (les dix états officiels, avec leur effet rappelé) se togglent depuis la fiche du combattant.
  Le bouton **Attaquer** ouvre le bon menu selon le type de combattant — attaques et **capacités
  actives** du bestiaire pour une créature (mêmes conditions que dans l'onglet Bestiaire) ;
  attaques à mains nues, armes, **sorts et capacités de dégâts** (avec dépense de PM pour les
  sorts) pour un personnage. Choisir une attaque **demande ensuite de
  désigner sa cible** parmi les autres combattants (ou de rester en test manuel) : la difficulté
  se règle alors automatiquement sur la DEF de la cible choisie, et un succès **applique les
  dégâts immédiatement**, sans étape supplémentaire. **Trier par initiative** classe tous les
  combattants (PJ compris), et **Tour suivant** fait avancer le curseur de tour en incrémentant
  le round au complet du cycle. Les créatures sont des instantanés propres au combat, mais les
  PJ restent branchés sur leur fiche : les PV et PM utilisés en arène sont ceux du personnage.
  L'état du combat (composition, PV, PM, états, round, tour) est conservé dans le navigateur :
  fermer l'onglet ou recharger la page ne fait pas perdre le combat en cours.
- **Générateurs** — quatre outils sous quatre sous-onglets.
  - *Rencontre* : choisissez un environnement, la taille et le niveau du groupe, une difficulté
    (facile → mortelle) et éventuellement un style de composition. Il produit une rencontre
    cohérente — un chef entouré de sa piétaille du même peuple, une meute homogène, un adversaire
    unique ou un groupe hétéroclite — avec le détail des profils, le budget consommé et une
    feuille d'ordre d'initiative incluant le personnage actif. Un bouton **Générer le butin de
    cette rencontre** bascule vers le sous-onglet Butin, déjà rempli.
  - *Butin* : multi-usage, avec trois sources sélectionnables. **Rencontre** reprend le résultat
    du sous-onglet Rencontre (pièces, objets pillés sur les humanoïdes, trophées prélevés sur la
    faune ou les créatures fantastiques). **Fouille** génère une petite trouvaille en explorant un
    lieu — niveau et **richesse** (pauvre → somptueux) choisis directement, sans rencontre : peu
    de pièces, un ou deux objets, un objet magique très rare. **Coffre** génère un trésor
    accumulé — plus de pièces, des objets de valeur (bijoux, gemmes, œuvres d'art), et une vraie
    chance d'objet magique (jusqu'à deux sur un coffre somptueux). Dans les trois sources, un
    objet magique de type arme ou armure se concrétise en équipement réel du jeu (« Rapière +1 »,
    « Cotte de mailles +2 »...) plutôt que de rester une étiquette abstraite. Si un personnage est
    actif, chaque ligne de butin (pièces, objet, trophée, objet de valeur, objet magique) a son
    propre bouton **+ Ajouter** qui la transfère directement dans sa bourse ou son inventaire — ou
    **📥 Tout ajouter** pour tout récupérer d'un coup ; chaque élément déjà transféré se marque
    **✓ Ajouté** pour éviter les doublons.
  - *PNJ* : génère un personnage non joueur complet et cohérent — peuple, genre, nom procédural
    (syllabaire propre à chaque peuple, avec nom de famille ou épithète), tranche d'âge, apparence
    (taille, corpulence, cheveux, yeux, teint, signe distinctif), métier (~65 possibilités, dont
    plusieurs reliés à une fiche du bestiaire humanoïde), idéal héroïque et travers (tables
    officielles du livre), manie, divinité patronne (panthéon complet d'Osgild), motivation,
    secret et accroche scénaristique. Chaque champ se relance individuellement ou se **verrouille**
    (🔒) avant un tirage complet, pour composer le PNJ qu'on veut sans tout recommencer. Une fiche
    imprimable résume l'ensemble.
  - *Oracle* : boîte à outils complète pour le jeu en solo, entièrement procédurale.
    L'**oracle oui/non** répond à une question fermée selon 9 niveaux de vraisemblance
    (Quasi impossible → Certain) avec six nuances possibles (« Oui, et plus encore » à « Non, et
    pire encore »), et un double au d100 (11, 22…) déclenche en plus un événement aléatoire. La
    **muse** propose deux mots évocateurs à interpréter librement pour relancer une scène qui
    patine. Le **générateur d'événement** combine un focus narratif, une action et un sujet
    (environ 89 000 combinaisons possibles) pour faire rebondir l'histoire sans passer par une
    question. Le **test de scène** détermine si la scène imaginée se déroule comme prévu, est
    modifiée ou interrompue. Le **détail sensoriel** pioche une touche descriptive par sens (vue,
    son, odeur, toucher) pour ancrer une description. Chaque tirage reste visible pendant qu'on
    en lance un autre, et un court historique de session liste les derniers résultats.
  - *Lieux* : trois générateurs à champs verrouillables, sur le même principe que le PNJ.
    **Taverne** — nom procédural (patrons combinatoires « Le/La [nom] [adjectif] », « Chez
    [patron] », « Aux [pluriel] »), ambiance, spécialité, tenancier (peuple/nom/trait réutilisés du
    générateur de PNJ, correctement accordés), particularité et rumeur qu'on y entend. **Boutique**
    — type de commerce (armurerie, forge, alchimiste, bijoutier, sellier, libraire, antiquaire...),
    enseigne, marchand, réputation, 3 à 5 objets en vente avec leur prix (tirés des vraies tables
    d'équipement, prix légèrement variable) et une anecdote. **Village/ville** — nom procédural,
    taille (hameau → cité, avec fourchette de population), spécialité économique, gouvernance,
    ambiance, problème du moment et un personnage notable.
  - *Quêtes* : compose une accroche complète — commanditaire, motivation réelle (souvent différente
    de ce qu'il prétend), objectif, cible concrète, lieu (relié aux environnements du générateur de
    Rencontre), obstacle principal, complication et récompense — puis les assemble en un paragraphe
    de synthèse prêt à lire ou à adapter tel quel pour démarrer une session sans préparation.
  - *Trésors* : génère un objet magique unique et nommé (au-delà du système +N générique du
    Butin) — type, palier (mineur/majeur/légendaire, avec 1 ou 2 pouvoirs selon le palier), nom
    procédural (mot composé façon « Sombrelame », ou « [Type] de/du [Épithète] », ou « [Type]
    [Adjectif] » correctement accordé), une origine/légende, un coût estimé et, dans 20 % des cas,
    une malédiction. Les pouvoirs sont tirés d'une table propre à chaque palier (sur le modèle des
    objets +1/+2/+3 déjà utilisés dans le générateur de Butin) : un objet mineur reste modeste, un
    légendaire nettement plus fort — plus de pouvoir surpuissant sur un objet mineur ni l'inverse.
    Sur une arme, un pouvoir qui améliore l'attaque/les dégâts ou ajoute des dégâts élémentaires
    est mécanique : il s'applique vraiment au jet d'attaque et à la formule de dégâts une fois
    l'objet équipé (les autres pouvoirs — soins, immunités, utilitaires... — restent descriptifs).
    Une arme générée porte ses dégâts (formule adaptée au type : épée/hache/arc 1d8, masse/lance
    1d6, dague/bâton 1d4), une armure ou un bouclier son bonus de DEF. Un bouton
    **📥 Ajouter à [personnage]** transfère l'objet — une arme rejoint directement l'onglet Armes
    (dégâts corrects, bonus de FOR inclus) tandis que sa fiche complète (nom, description, coût)
    reste dans Objets ; une armure/un bouclier atterrit dans Objets, prêt à être équipé. Une
    dizaine de types possibles au total (armes courantes, bâton, gants, bottes, orbe...), avec
    accord grammatical correct même pour les noms au pluriel (« Gants Maudits », pas « Gants
    Maudit »).
  - *Voyage* : un événement de trajet non lié au combat — environnement, météo, puis un tirage
    catégorisé (rencontre de voyageurs, incident de parcours, point d'intérêt, découverte, présage,
    ou tout simplement un trajet sans histoire) avec son détail — pour ponctuer une route sans
    forcément déclencher une rencontre.
  - *Donjon* : décrit une salle ou un lieu d'exploration à la volée — architecture, état des
    lieux, occupant(s) (pas forcément hostiles), piège (le plus souvent absent), particularité
    notable et sortie(s) — à combiner avec Rencontre si l'occupant s'avère combatif et avec Butin
    pour le contenu d'un trésor repéré. Comble le manque entre Rencontre (le combat), Butin (le
    loot) et Voyage (le trajet) : ce que contient concrètement la pièce qu'on vient d'ouvrir.
  - *Objets magiques* : implémente les tables officielles du chapitre « Objets magiques » du
    livre de base, en huit catégories (chips) — **Potion**, **Parchemin**, **Baguette** (charges
    2d20, niveau de magie selon la règle), **Arme magique** (palier +1/+2/+3, type d'arme tiré des
    vraies tables d'équipement, propriétés — affûtée, élémentaire, fléau d'une créature — avec leur
    niveau de magie), **Armure/bouclier magique** (palier + catalogue réel + propriétés — RD,
    résistances, natation...), **Objet de pouvoir** (rang du pouvoir puis profil pondéré exactement
    comme la table du livre), **Objet de puissance** (bonus de caractéristique, formule de niveau
    de magie officielle selon qu'elle est majeure ou mineure) et **Objet de compétence** (+5 à un
    test). Partout où la règle demande un sort ou une capacité (potion, parchemin, baguette, objet
    de pouvoir), un vrai sort/capacité de la base de voies est pioché — pas une liste figée — pour
    un nombre de combinaisons bien plus grand que les tables du livre. Le coût est calculé avec les
    formules officielles de valeur. Un bouton **Utiliser** lance directement le sort/la capacité
    piochée (via le même moteur que les compétences de voie) ; **Ajouter au personnage** range
    l'objet dans Objets, avec les mêmes mécanismes que le générateur de Trésors pour les armes
    (dégâts et bonus magique inclus), les armures (emplacement équipable) et, en plus, les objets
    de puissance (bonus de caractéristique équipable/déséquipable, comme un anneau de force).
  - *Objet prestigieux* : génère un objet doté de sa propre voie à 5 rangs et lié à un profil
    réel, sur le modèle de l'exemple « La Lame des Échos » du livre de base — le rang 1 donne un
    bonus mineur (+1 attaque/dégâts ou +1 DEF), les rangs 2 à 5 lient chacun une vraie capacité de
    ce profil (piochée dans la base de voies) à l'objet, avec sa propre condition de déblocage
    procédurale. Le rang 1 s'applique automatiquement à l'ajout ; les rangs suivants restent
    consultatifs, à débloquer en jeu selon leur condition (au meneur de trancher, comme l'indique
    le livre).

  Les sept nouveaux générateurs partagent le même petit moteur réutilisable
  (`COF.creerGenerateurChamps` côté données, `COF.UI.creerVueChamps` côté interface) que le
  générateur de PNJ : verrou 🔒/🔓 par champ, relance individuelle ↻, tirage complet qui respecte
  les verrous. Toutes les tables des cinq premiers ont été étendues (+40 à +80 % d'entrées selon
  les catégories) pour réduire les répétitions sur une session longue.
- **Dés** — lanceur libre, formules personnalisées, journal des jets.
- **Plus** — aide-mémoire des règles, tables, export / import.

## Calculs vérifiés

Les exemples du livre de base sont reproduits à l'identique :

| | Lhagva (barbare humaine niv. 1) | Ionas (ensorceleur elfe haut niv. 1) |
|---|---|---|
| PV | 12 ✓ | 7 ✓ |
| Attaque contact / distance / magique | +4 / +2 / +2 ✓ | -1 / +2 / +3 ✓ |
| DR | 4 d10 ✓ | 3 d6 ✓ |
| PM | 0 ✓ | 5 ✓ |

Le barème du générateur de rencontres est calibré sur les rencontres « ordinaires » citées dans
le bestiaire : 6 worgs pour un groupe de niveau 8 tombent exactement sur le budget, le chef de
meute et ses 6 loups à -9 %, le chef ogre et ses 5 ogres à -18 %.

## Roadmap

1. **Générateur de donjon** — salles, couloirs, pièges et trésors.

## Installation en application (PWA)

Ouvrez l'application dans le navigateur puis utilisez « Ajouter à l'écran d'accueil »
(Android/Chrome) ou « Partager → Sur l'écran d'accueil » (iOS/Safari). Un service worker
(`sw.js`) met en cache tous les fichiers au premier chargement : l'application s'ouvre et
fonctionne ensuite sans connexion. Le service worker exige un contexte sécurisé (HTTPS, ou
`localhost` en développement) ; il échoue silencieusement sur un simple `file://` ou un
hébergement HTTP, mais l'application reste utilisable normalement, juste sans mode hors ligne.

Si vous modifiez un fichier listé dans `sw.js`, incrémentez `CACHE_VERSION` en tête de ce
fichier pour que les joueurs déjà installés reçoivent la mise à jour.

## Note

Outil personnel non officiel. *Chroniques Oubliées Fantasy* est une création de Black Book
Éditions. Les descriptions de capacités sont des résumés mécaniques rédigés pour l'outil, et
non le texte du livre : reportez-vous à l'ouvrage pour les règles complètes.
