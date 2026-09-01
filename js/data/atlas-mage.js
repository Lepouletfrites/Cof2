/* ============================================================
   COF2 Compagnon — Atlas d'Osgild : voies supplémentaires
   de la famille des mages (magicien × 3, sorcier × 1).
   Ce sont des voies de base ordinaires : un magicien ou un
   sorcier peut les choisir dès le niveau 1 à la place d'une de
   ses cinq voies habituelles — il a simplement plus de choix.
   ============================================================ */
window.COF = window.COF || {};
COF.PROFILS = COF.PROFILS || {};

(function () {
  if (COF.PROFILS.magicien) {
    COF.PROFILS.magicien.voies.push(
      { id: 'arcanesexhumes', nom: 'Voie des arcanes exhumés', caps: [
        { r: 1, n: 'Message magique', a: 'L', s: true, d: "Enchante une surface inerte pendant 24 h : au passage d'une créature dans un rayon de 5 m, une bouche délivre un message d'au plus [niveau + 5] mots. Devient permanent si lancé comme un sort de rang 4 (4 PM) et accompagné d'une gemme de 200 pa." },
        { r: 2, n: 'Toiles', a: 'L', s: true, d: "Toile gluante (zone de 5 m, portée 10 m) immobilisant les ennemis pendant INT rounds ; une créature piégée peut se libérer par un test de FOR difficulté [10 + INT] (action d'attaque). Le feu détruit la toile mais inflige 1d6 DM aux prisonniers." },
        { r: 3, n: 'Sphère de ténèbres', a: 'M', s: true, dmg: '1d4°+INT', d: "Invoque une sphère noire pendant niveau rounds ; en action de mouvement (portée 10 m), elle attaque avec l'attaque magique du magicien et inflige [1d4° + INT] DM de désintégration." },
        { r: 4, n: 'Chien de garde', a: 'L', s: true, d: "Rituel de 5 min : invoque un gardien fantomatique (DEF 15, PV [niveau × 4], Init. 10, morsure magique 1d4°+3) qui surveille une zone de 20 m pendant 24 h et attaque en hurlant (test de CON difficulté 10 ou fuite 2d4 rounds) toute créature non désignée par le magicien qui y pénètre." },
        { r: 5, n: 'Nuage empoisonné', a: 'L', s: true, dmg: '3d4°+INT', d: "Nuage immobile de 10 m de côté infligeant [3d4° + INT] DM de poison par round pendant INT minutes (test de CON difficulté 15 pour diviser par deux). Dispersé par un vent puissant." }
      ]},
      { id: 'arcanesoublies', nom: 'Voie des arcanes oubliés', caps: [
        { r: 1, n: 'Ventriloquie', a: 'G/M', s: true, d: "Projette sa voix depuis un point à moins de 20 m pendant INT rounds. Coûte 1 PM en action gratuite, 0 PM en action de mouvement." },
        { r: 2, n: 'Bouclier de mana', a: 'G', s: true, d: "Une fois par round, en action gratuite contre une attaque annoncée (avant le résultat) : +6 en DEF et annule complètement les DM d'un Projectile de mana." },
        { r: 3, n: 'Corde magique', a: 'L', s: true, d: "Une corde de 20 m se dresse et se déplace seule (10 m par action de mouvement) pendant INT minutes ; peut tenter de renverser un adversaire à portée (test d'AGI difficulté 10). DEF 10, 15 PV ; perd 1 m de longueur par PV perdu." },
        { r: 4, n: 'Rétrécissement', a: 'A/L', s: true, d: "Le magicien (A) ou une cible humanoïde volontaire (L) est réduit à 10 cm pendant INT minutes : +10 en discrétion, mais subit +1d4° DM par catégorie de taille de son agresseur (minimum 1 DM par attaque)." },
        { r: 5, n: 'Zone de magie nulle', a: 'L', s: true, d: "Zone immobile de 10 m de diamètre centrée sur lui où toute magie cesse de fonctionner ; les effets surnaturels non magiques (souffles, attaques naturelles extraordinaires) voient leurs effets divisés par deux." }
      ]},
      { id: 'arcanesperdus', nom: 'Voie des arcanes perdus', caps: [
        { r: 1, n: 'Disque de transport', a: 'L', s: true, d: "Un disque lumineux d'1 m le suit (portée 0-10 m) pendant INT heures et transporte [niveau × 20] kg, dont une créature de taille M ; s'il porte le magicien, celui-ci peut s'y tenir et se déplacer de 5 m par action de mouvement." },
        { r: 2, n: 'Fuite rapide', a: 'M', s: true, d: "Se déplace de 20 m par action de mouvement pendant INT minutes." },
        { r: 3, n: 'Agrandissement', a: 'A/L', s: true, d: "Le magicien (A) ou une cible volontaire (L) touchée gagne une catégorie de taille pendant INT minutes : +3 en FOR, aux DM et en RD. Grandir dans un espace inadapté inflige 2d4° DM et fait échouer le sort." },
        { r: 4, n: 'Inversion de la gravité', a: 'A', s: true, d: "Dans une zone de 10 x 10 m (portée 10 m), la gravité s'inverse : les créatures au sol chutent vers le haut (DM de chute, 1d4° évolutif par 3 m, max 4d4°) puis retombent à la fin du sort et doivent réussir un test d'AGI difficulté 20 ou être renversées." },
        { r: 5, n: 'Métamorphose', a: 'L', s: true, d: "Prend la forme d'une créature non humanoïde déjà rencontrée (ou dont il possède un fragment) pendant INT minutes, en utilisant son profil sauf l'INT et les PV. Coût en PM et niveau requis selon le NC : de 2 PM/niveau 7 (NC 0-3) à 10 PM/niveau 19 (NC 7)." }
      ]}
    );
  }

  if (COF.PROFILS.sorcier) {
    COF.PROFILS.sorcier.voies.push(
      { id: 'arcanesobscurs', nom: 'Voie des arcanes obscurs', caps: [
        { r: 1, n: 'Contact vampirique', a: 'L', s: true, dmg: '1d4°+INT', d: "Attaque magique au contact contre une cible vivante : [1d4° + INT] DM, et le sorcier se soigne d'autant." },
        { r: 2, n: 'Tentation du démon', a: 'A', s: true, d: "Attaque magique contre une cible vivante (10 m) : elle seule voit apparaître son fantasme le plus profond (portée 20 m) et, pendant INT rounds, s'en approche avec -10 en PER, tant qu'elle n'est pas attaquée. Une seule fois par combat et par cible ; un round seulement si son NC dépasse le niveau du sorcier." },
        { r: 3, n: 'Épidémie', a: 'M', s: true, d: "Cible une créature humanoïde vivante (20 m) : test de CON difficulté [10 + INT] ou contracte une maladie (dé malus en CON/FOR/attaque au contact, ou PER/VOL/attaque magique, ou CHA/AGI/attaque à distance selon la souche) après 1d6 × 10 min, pour 24 h. Contagieuse (5 personnes/heure) ; sans effet sur un NC ≥ niveau du sorcier." },
        { r: 4, n: 'Aura maudite', a: 'L', s: true, dmg: '1d4°', d: "Aura d'énergie nécrotique pendant INT rounds (rayon 5 m) : les créatures vivantes subissent 1d4° DM par round, les morts-vivants récupèrent 1d4° PV par round." },
        { r: 5, n: 'Extinction de masse', a: 'A', s: true, d: "Toutes les créatures vivantes de NC 1 ou inférieur dans un rayon de 10 m doivent réussir un test de CON difficulté [10 + INT] ou périr (tue aussi les plantes). La somme des NC affectés ne peut dépasser le niveau du sorcier ; les plus proches sont touchées en premier." }
      ]}
    );
  }
})();
