# COF2 Compagnon

Application web (HTML / CSS / JS, sans dépendance) pour **Chroniques Oubliées Fantasy 2e édition**.
Pensée mobile en mode portrait, 100 % hors ligne, données stockées dans le navigateur.

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
- **Compagnons** — carte dédiée sur la fiche : les compagnons accessibles par les voies déjà
  acquises (rôdeur, druide, magicien, forgesort, sorcier, chevalier, ou certaines voies de
  prestige) apparaissent en un clic ; chaque compagnon actif a son nom éditable, sa propre jauge
  de PV, et un bouton Attaquer qui enchaîne test d'attaque puis dégâts comme pour une arme.
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

## Roadmap

1. **Bestiaire** — profils de créatures (humanoïdes, animaux), filtres par NC, jets intégrés.
2. **Générateur JDR solo** — oracle oui/non, tables d'événements, PNJ, donjons, rencontres.
3. **Objets magiques & trésors** — catalogue et tables aléatoires.
4. **Mode MJ** — suivi d'initiative et de combat multi-créatures.

## Note

Outil personnel non officiel. *Chroniques Oubliées Fantasy* est une création de Black Book
Éditions. Les descriptions de capacités sont des résumés mécaniques rédigés pour l'outil, et
non le texte du livre : reportez-vous à l'ouvrage pour les règles complètes.
