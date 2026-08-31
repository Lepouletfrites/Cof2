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
| `pnj.js` | Générateur de PNJ : syllabaires procéduraux par peuple, âges, apparence, ~65 métiers, idéal/travers officiels, manies, motivations, secrets, accroches, panthéon d'Osgild (31 divinités) |

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
  capacité, bonus de compétence.
- **`compagnons.js`** — calcule DEF/PV/Init./attaque d'un compagnon pour le personnage courant ;
  détecte l'éligibilité même via une voie de profil hybride ou une voie de prestige.
- **`rencontre.js`** — générateur de rencontres. Barème de points par NC calibré sur les
  exemples de rencontres du bestiaire, budget indexé sur la taille et le niveau du groupe,
  et quatre stratégies de composition (solitaire, bande hiérarchisée, meute, groupe hétéroclite).
- **`pnj.js`** (core) — moteur procédural : 19 champs générés dans l'ordre de leurs dépendances
  (peuple → genre → nom → âge, puis apparence, vie sociale, personnalité, accroches), chacun
  regénérable individuellement en conservant le reste.
- **`store.js`** — sauvegarde locale, personnages multiples, équipement de départ, journal de
  jets, export / import JSON.

### Interface (`js/ui/`)

- **Fiche** — caractéristiques cliquables (test d20), combat, jauges PV/PM/PC/DR avec
  récupération rapide et complète, états préjudiciables, armes (attaque + dommages en deux
  taps), sorts (dépense automatique des PM, brûlure de mana si besoin), capacités, bonus de
  compétence, équipement, ajustements permanents, notes.
- **Voies** — quatre sections. Les 5 voies du profil et la voie de peuple (+ voie du mage) sont
  mises en avant ; les **voies de prestige** (rangs 4 à 8, une seule par carrière, verrouillage
  automatique des autres dès qu'une est choisie) et les **voies de tous les autres profils**
  pour construire un profil hybride sont accessibles dans des sections repliées. Acquisition
  rang par rang avec vérification du niveau requis et suivi des points de capacité.
- **Bestiaire** — les 84 créatures du livre, filtrables par **environnement** (les cinq milieux
  naturels du livre plus villes, ruines et terres glacées), par **catégorie** et par **plage de
  NC**, avec recherche plein texte sur le nom et la description. Chaque fiche donne le profil
  complet (caractéristiques cliquables pour un test, DEF/PV/Init., RD, capacités) et un bouton
  Attaquer par mode d'attaque, qui enchaîne test d'attaque puis dégâts. Le filtre est exposé via
  `COF.UI.Bestiaire.filtrer()` pour le futur générateur de rencontres.
- **Compagnons** — carte dédiée sur la fiche : les compagnons accessibles par les voies déjà
  acquises (rôdeur, druide, magicien, forgesort, sorcier, chevalier, ou certaines voies de
  prestige) apparaissent en un clic ; chaque compagnon actif a son nom éditable, sa propre jauge
  de PV, et un bouton Attaquer qui enchaîne test d'attaque puis dégâts comme pour une arme.
- **Générateurs** — deux outils sous deux sous-onglets.
  - *Rencontre* : choisissez un environnement, la taille et le niveau du groupe, une difficulté
    (facile → mortelle) et éventuellement un style de composition. Il produit une rencontre
    cohérente — un chef entouré de sa piétaille du même peuple, une meute homogène, un adversaire
    unique ou un groupe hétéroclite — avec le détail des profils, le budget consommé et une
    feuille d'ordre d'initiative incluant le personnage actif.
  - *PNJ* : génère un personnage non joueur complet et cohérent — peuple, genre, nom procédural
    (syllabaire propre à chaque peuple, avec nom de famille ou épithète), tranche d'âge, apparence
    (taille, corpulence, cheveux, yeux, teint, signe distinctif), métier (~65 possibilités, dont
    plusieurs reliés à une fiche du bestiaire humanoïde), idéal héroïque et travers (tables
    officielles du livre), manie, divinité patronne (panthéon complet d'Osgild), motivation,
    secret et accroche scénaristique. Chaque champ se relance individuellement ou se **verrouille**
    (🔒) avant un tirage complet, pour composer le PNJ qu'on veut sans tout recommencer. Une fiche
    imprimable résume l'ensemble.
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

1. **Oracle solo** — questions oui/non avec nuances, tables d'événements aléatoires.
2. **Générateur de donjon** — salles, couloirs, pièges et trésors.
3. **Objets magiques & trésors** — catalogue et tables aléatoires adaptées au NC.
4. **Mode MJ** — suivi de combat multi-créatures avec PV individuels.

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
