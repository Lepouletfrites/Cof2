/* ============================================================
   COF2 Compagnon — Voies de prestige : MYSTIQUE
   Les sorts de ces voies sont indexés sur le CHA.
   Un druide ou un moine utilise sa PER (sauf mention contraire).
   ============================================================ */
window.COF = window.COF || {};
COF.PRESTIGE = COF.PRESTIGE || {};

COF.PRESTIGE.armuresacree = {
  id: 'armuresacree', nom: "Voie de l'armure sacrée", fam: 'mystique',
  desc: "Revêtir une armure magique extraordinaire, unique et liée à un seul maître (bronze, argent, or).",
  note: "Ouverte à tous les mystiques. Pour le moine et le druide, elle n'empêche pas l'usage des capacités de profil.",
  caps: [
    { r: 4, n: 'Armure de bronze', a: 'M', d: "Un cube de métal de 50 cm se déploie sur un mot de commande (action de mouvement) : RD 3, sans aucune pénalité d'encombrement." },
    { r: 5, n: 'Pouvoir unique', a: 'L', choix: true, d: "Associe à l'armure un sort de rang 1 à 4 de n'importe quelle voie. Usages par combat : rang 1 → 4×, rang 2 → 3×, rang 3 → 2×, rang 4 → 1×." },
    { r: 6, n: "Armure d'argent", d: "L'armure prend la couleur de l'argent : RD 5." },
    { r: 7, n: 'Pouvoir puissant', a: 'L', choix: true, d: "Associe à l'armure un sort de rang 4 à 8 de n'importe quelle voie, jamais plus d'une fois par combat. Rang 5 → 3×/jour, rang 6 → 2×/jour, rang 7 → 1×/jour." },
    { r: 8, n: "Armure d'or", d: "L'armure prend la couleur de l'or : RD 7." }
  ]
};

COF.PRESTIGE.elemfeu = {
  id: 'elemfeu', nom: 'Voie élémentaire du feu', fam: 'mystique',
  desc: "Les cheveux deviennent roux, les ongles noircissent, le tempérament devient explosif.",
  note: "Ouverte aussi à un mage maîtrisant au moins deux sorts de feu (remplacer CHA par INT).",
  caps: [
    { r: 4, n: 'Mur de feu', a: 'A', s: true, dmg: '2d4°+CHA', d: "Mur rectiligne de 20 m de long sur 4 m de haut (portée 20 m) pendant CHA minutes. Le franchir inflige [2d4° + CHA] DM de feu." },
    { r: 5, n: 'Tornade de feu', a: 'A', s: true, dmg: '4d4°+CHA', d: "Colonne de feu à 20 m : attaque magique contre DEF pour [4d4° + CHA] DM. DM doublés contre les morts-vivants et les démons." },
    { r: 6, n: 'Insensible au feu', d: "Insensible aux DM de feu et divise par deux les DM de froid." },
    { r: 7, n: 'Immolation', a: 'A', s: true, dmg: '1d4°', d: "Aura de flammes pendant CHA minutes : immunisé au feu, inflige 1d4° DM de feu à tout attaquant qui le blesse à l'arme (2d4° avec une arme naturelle)." },
    { r: 8, n: 'Forme élémentaire de feu', a: 'A', s: true, f: 'jour', dmg: '2d4°+5', d: "1×/jour, jusqu'à CHA minutes : AGI +3*, CON +5, FOR +5. DEF 20, PV [niveau × 4], frappe de feu [attaque magique] 2d4°+5. Aucune autre capacité utilisable, ne peut pas parler. Profite en permanence d'Insensible au feu et d'Immolation." }
  ]
};

COF.PRESTIGE.elemterre = {
  id: 'elemterre', nom: 'Voie élémentaire de la terre', fam: 'mystique',
  desc: "Les cheveux deviennent gris, la peau terreuse, le tempérament introverti.",
  note: "Ouverte aussi à un mage maîtrisant au moins un sort de terre (remplacer CHA par INT).",
  caps: [
    { r: 4, n: 'Mur de pierre', a: 'A', s: true, d: "Mur de pierre rectiligne de 20 m de long sur 4 m de haut (portée 20 m), pendant INT heures. Solidité 30, RD 20, 30 cm d'épaisseur. Peut boucher complètement un passage." },
    { r: 5, n: 'Litomorphose', a: 'A', s: true, d: "Modèle la pierre par sa volonté (portée 10 m) : 1 m³ par niveau, pendant INT heures. Percer un tunnel, créer une arche, etc." },
    { r: 6, n: 'Pétrification', a: 'A', s: true, dmg: '4d4°', d: "Test opposé d'attaque magique (20 m) : la victime est changée en pierre (permanent), RD 30, mais une litomorphose lui inflige 4d4° DM sans réduction. Une cible de niveau ≥ peut faire un test de CON difficulté [10 + CHA] à la fin de chaque round." },
    { r: 7, n: 'Séisme', a: 'A', s: true, dmg: '4d6', d: "Tremblement de terre dans un rayon de 100 m : masures détruites automatiquement, villas 4/6, palais 2/6, forteresses 1/6. Les créatures dans un édifice qui s'effondre subissent 4d6 DM (le double si elles y restent, la moitié si le bâtiment résiste)." },
    { r: 8, n: 'Forme élémentaire de terre', a: 'A', s: true, f: 'jour', dmg: '2d4°+6', d: "1×/jour, jusqu'à CHA minutes : AGI +1, CON +6, FOR +6*. DEF 23, PV [niveau × 5], coup de poing [attaque magique] 2d4°+6. Aucune autre capacité utilisable, ne peut pas parler." }
  ]
};

COF.PRESTIGE.elemair = {
  id: 'elemair', nom: "Voie élémentaire de l'air", fam: 'mystique',
  desc: "Les cheveux deviennent blancs, la peau très pâle, le tempérament rêveur.",
  note: "Ouverte aussi à un mage maîtrisant au moins un sort d'air (remplacer CHA par INT).",
  caps: [
    { r: 4, n: 'Bourrasque', a: 'A', s: true, dmg: '3d4°', d: "Cône de 30 m : test de FOR difficulté [10 + rang] ou renversé et repoussé — très petite à moyenne 20 m et 3d4° DM, grande 10 m et 2d4°, énorme 5 m et 1d4°, colossale seulement renversée." },
    { r: 5, n: 'Chevaucher les nuées', a: 'A', s: true, d: "Le personnage et un compagnon par rang sont transportés par le vent sur 1 km maximum, à 100 m par round. Le point d'arrivée doit être visible et pouvoir accueillir tout le monde." },
    { r: 6, n: 'Mur de vent', a: 'A', s: true, d: "Mur circulaire de 5 à 10 m de diamètre autour de lui pendant CHA minutes : bloque les attaques à distance dans les deux sens (mais pas la magie) et repousse les créatures (test de FOR difficulté [10 + rang] pour passer)." },
    { r: 7, n: 'Cyclone', a: 'A', s: true, dmg: '2d4°', d: "Maelström de 20 m de diamètre à 500 m de portée pendant CHA minutes : 2d4° DM par round et test de FOR difficulté 15 pour ne pas être renversé. Déplaçable de 10 m par action de mouvement." },
    { r: 8, n: "Forme élémentaire d'air", a: 'A', s: true, f: 'jour', dmg: '2d4°+4', d: "1×/jour, jusqu'à CHA minutes : AGI +5*, CON +4, FOR +4. DEF 25, PV [niveau × 5], Init. +3, frappe [attaque magique] 2d4°+4 de foudre, immunité à la foudre. Aucune autre capacité utilisable, ne peut pas parler." }
  ]
};

COF.PRESTIGE.elemeau = {
  id: 'elemeau', nom: "Voie élémentaire de l'eau", fam: 'mystique',
  desc: "Les cheveux semblent toujours mouillés, les yeux délavés, le tempérament changeant.",
  note: "Ouverte aussi à un mage maîtrisant au moins un sort d'eau (remplacer CHA par INT).",
  caps: [
    { r: 4, n: 'Brouillard', a: 'A', s: true, d: "Brouillard dense (pénombre à 10 m, puis noir total) sur un rayon de 20 m, extensible de 20 m par action limitée et par round (max [niveau] rounds). Une fois la concentration cessée, il dure CHA minutes." },
    { r: 5, n: 'Mur acide', a: 'A', s: true, dmg: '3d4°+CHA', d: "Mur d'acide rectiligne de 20 m de long sur 4 m de haut (portée 20 m) pendant CHA minutes. Le franchir inflige [3d4° + CHA] DM d'acide." },
    { r: 6, n: "Armure d'eau", a: 'A', s: true, d: "Couche d'eau pendant CHA minutes : RD 3 contre tous les DM physiques, RD 10 contre le feu et l'acide. Glissant comme un poisson, il ne peut être saisi." },
    { r: 7, n: 'Écartement des eaux', a: 'A', s: true, d: "Stoppe le cours d'une rivière ou écarte les eaux d'un lac sur 1 km maximum : lui et ses compagnons traversent à pied sec pendant CHA heures." },
    { r: 8, n: "Forme élémentaire d'eau", a: 'A', s: true, f: 'jour', dmg: '2d4°+5', d: "1×/jour, jusqu'à CHA minutes : AGI +3*, CON +5, FOR +5. DEF 23, PV [niveau × 5], frappe [attaque magique] 2d4°+5 d'acide, immunité à l'acide. Aucune autre capacité utilisable, ne peut pas parler." }
  ]
};

COF.PRESTIGE.changeforme = {
  id: 'changeforme', nom: 'Voie du changeforme', fam: 'mystique',
  desc: "Prendre la forme d'animaux toujours plus puissants à mesure que l'on progresse.",
  note: "La capacité de druide Forme animale n'est pas requise, mais elle permet d'en tirer plus d'avantages.",
  caps: [
    { r: 4, n: 'Forme de voyage', a: 'A', s: true, d: "Forme d'un chat, chien, chevreuil, saumon ou corbeau (choisi définitivement) pendant PER minutes — PER heures avec la capacité Forme animale. Une forme supplémentaire par rang atteint." },
    { r: 5, n: 'Transformation en animal', a: 'A', s: true, t: 'soin', dmg: '3d4°', d: "Acquiert Forme animale pour une seule catégorie d'animaux. S'il la possédait déjà : durée en heures au lieu de minutes et récupération de 3d4° PV à la fin de la transformation." },
    { r: 6, n: 'Transformation puissante', a: 'A', s: true, d: "Sous forme animale, il peut conserver sa propre DEF et utiliser sa valeur d'attaque magique si elles sont supérieures. Accède aux animaux géants ou préhistoriques (taille M maximum)." },
    { r: 7, n: 'Grande forme animale', a: 'A', s: true, d: "Forme d'un animal de taille grande (ours, tigre…), en conservant sa DEF et son attaque magique. Coût : [2 + NC] PM (ou NC PM avec la concentration)." },
    { r: 8, n: 'Forme animale énorme', a: 'A', s: true, d: "Forme d'un animal ou animal géant de taille énorme (éléphant…), mêmes règles que la capacité précédente." }
  ]
};

COF.PRESTIGE.combatmystique = {
  id: 'combatmystique', nom: 'Voie du combat mystique', fam: 'mystique',
  desc: "Parfaitement adaptée au moine, elle fait de tout mystique un adepte des manœuvres martiales spectaculaires.",
  caps: [
    { r: 4, n: 'Attaque étourdissante', a: 'L', d: "Attaque à mains nues ou à l'arme contondante : en plus des DM, une victime de NC inférieur au rang doit réussir un test de CON difficulté [10 + VOL] ou être étourdie 1 round." },
    { r: 5, n: 'Frappe concentrée', a: 'A', d: "Concentration de 1d4 rounds (durée secrète, RD 5 pendant ce temps, ni attaque ni déplacement). Ensuite : attaque touchant automatiquement et infligeant le triple des DM. Aucun bénéfice si la concentration est interrompue." },
    { r: 6, n: 'Pression nerveuse', a: 'L', f: 'combat', d: "1×/combat, sur une attaque au contact à mains nues réussie : une créature humanoïde de NC inférieur au rang est paralysée VOL minutes (1 round seulement si son NC est supérieur ou égal)." },
    { r: 7, n: 'Paume mortelle', a: 'L', f: 'jour', d: "1×/jour, au contact : test opposé d'attaque magique. Réussite = la victime meurt sur le coup (paralysée 1 round seulement si son niveau est supérieur ou égal)." },
    { r: 8, n: 'Main du tout puissant', a: 'L', f: 'jour', dmg: '4d4°+VOL', d: "1×/jour : onde de choc frappant toutes les créatures face à lui sur 20 m de large et 20 m de profondeur. Chacune est renversée et subit [4d4° + VOL] DM." }
  ]
};

COF.PRESTIGE.guerisseur = {
  id: 'guerisseur', nom: 'Voie du guérisseur', fam: 'mystique',
  desc: "Pour ceux qui souhaitent prendre soin de la santé de leur prochain : prêtres, druides et même moines.",
  caps: [
    { r: 4, n: 'Premiers soins', a: 'A', s: true, f: 'combat', t: 'soin', dmg: '3d4°+CHA', d: "Utilisable seulement sur une créature vivante à 0 PV : elle récupère [3d4° + CHA] PV. Une fois par combat et par patient." },
    { r: 5, n: 'Soins rapides', a: 'G', s: true, t: 'soin', dmg: '2d4°+CHA', d: "D'un simple regard, soigne une cible (ou lui-même) à 20 m : [2d4° + CHA] PV immédiatement." },
    { r: 6, n: 'Rappel à la vie', a: 'L', s: true, f: 'jour', dmg: '1d4°', d: "1×/jour, rituel de 30 min sur un mort décédé depuis moins de [6 + CON] heures : il revient avec 1d4° PV et reste affaibli 24 h. Ne régénère pas les membres perdus." },
    { r: 7, n: 'Zone de vie', a: 'A', s: true, t: 'soin', dmg: '2d4°', d: "Zone immobile de 10 m de rayon pendant CHA rounds : toutes les créatures vivantes y récupèrent 2d4° PV par round ; les morts-vivants et démons subissent autant de DM." },
    { r: 8, n: 'Résurrection', a: 'L', s: true, f: 'aventure', d: "1×/aventure, rituel de 7 h sur une relique d'un mort décédé depuis moins de [CHA] jours : il revient avec 1 PV, affaibli pendant 7 jours. Chaque résurrection au-delà de la première coûte 1 point de CON." }
  ]
};

COF.PRESTIGE.maitrenature = {
  id: 'maitrenature', nom: 'Voie du maître de la nature', fam: 'mystique',
  desc: "En communion avec la nature : les animaux se mettent à son service.",
  caps: [
    { r: 4, n: 'Amitié animale', a: 'A', s: true, d: "Test opposé d'attaque magique (10 m) : l'animal se met à son service pendant PER heures. La somme des NC contrôlés ne peut dépasser le rang. Animaux géants au rang 6, fantastiques au rang 8. Le sort prend fin en milieu urbain." },
    { r: 5, n: 'Seigneur de la nature', t: 'soin', dmg: '1d4°', d: "Choisir un milieu de prédilection (un second au rang 7) parmi forêt et jungle, déserts et plaines, montagnes et collines, marais et milieu aquatique, grottes et profondeurs. Dans ce milieu : dé bonus à tous ses tests et 1d4° PV à chaque récupération rapide." },
    { r: 6, n: 'Invisibilité aux animaux', d: "Dans un milieu de prédilection, totalement indétectable par les animaux et insectes, même géants (vue, odorat, ouïe). Une action offensive contre un animal met fin à l'effet jusqu'à la prochaine récupération rapide." },
    { r: 7, n: 'Monture géante', d: "Obtient une monture géante adaptée à un de ses milieux de prédilection (mammouth, dinosaure, aigle géant…), de NC ≤ [rang + PER]. En selle, elle attaque une fois par round sur son ordre (action gratuite pour le cavalier)." },
    { r: 8, n: 'Magie druidique innée', a: 'G', f: 'jour', d: "3×/jour dans un milieu de prédilection : lance n'importe quel sort de druide en action gratuite, sans dépense de mana. Une seule fois par round." }
  ]
};

COF.PRESTIGE.saisons = {
  id: 'saisons', nom: 'Voie des saisons', fam: 'mystique',
  desc: "Les cycles naturels s'emparent du corps du personnage et modifient son apparence.",
  caps: [
    { r: 4, n: 'Vigueur du printemps', d: "+2 dés de récupération. De plus, il relance tous les 1 obtenus lorsqu'il utilise ses DR." },
    { r: 5, n: "Flamme de l'été", a: 'A', dmg: '2d4°+PER', d: "Avec accès à une flamme : projectile de feu à 30 m, attaque magique réussie pour [2d4° + PER] DM de feu. Divise par deux tous les DM de feu subis." },
    { r: 6, n: "Tourbillon d'automne", a: 'A', s: true, dmg: '3d4°+PER', d: "Tourbillon de feuilles tranchantes de 5 m de diamètre à 10 m, pendant PER rounds : [3d4° + PER] DM par round, moitié sur un test de CON difficulté 10. Déplaçable de 10 m par action de mouvement." },
    { r: 7, n: "Frimas de l'hiver", a: 'A', dmg: '4d4°+PER', d: "Avec accès à de l'eau : projectile de glace à 30 m, [4d4° + PER] DM de froid. Test de CON difficulté [10 + PER] ou ralenti au prochain tour. Divise par deux tous les DM de froid subis." },
    { r: 8, n: 'Contrôle climatique', a: 'A', s: true, dmg: '4d4°', d: "1 min de concentration pour faire varier la météo de [PER] paliers (ciel bleu → nuageux → pluie fine → pluie dense → pluie intense → tempête), pendant [1d6 + INT] heures sur un rayon de [niveau] km. Au dernier palier : appel de la foudre 1×/round en action gratuite, 4d4° DM." }
  ]
};

COF.PRESTIGE.templier = {
  id: 'templier', nom: 'Voie du templier', fam: 'mystique',
  desc: "Un soldat de la foi qui concentre ses forces contre les démons et les morts-vivants.",
  note: "Cette voie utilise obligatoirement le CHA, même pour un druide ou un moine.",
  caps: [
    { r: 4, n: 'Résistance au mal', a: 'M', s: true, d: "Une cible volontaire (ou lui-même) devient immunisée aux capacités de drain, charme, domination, paralysie ou affaiblissement des morts-vivants pendant CHA minutes. En plus de ce sort : +1 en DEF permanent." },
    { r: 5, n: 'Quête', a: 'L', s: true, d: "Rituel de 10 min : la cible récupère 1 PC par jour tant qu'elle travaille à la quête assignée, mais devient affaiblie 24 h après l'avoir abandonnée. Variante : un interdit (ne pas tuer, ne pas parler…) durant un mois par point de CHA, chaque incartade valant un dé malus pendant 24 h. Une seule quête à la fois." },
    { r: 6, n: 'Résistance au mal supérieure', a: 'A', s: true, d: "La résistance couvre à la fois les pouvoirs des morts-vivants et ceux des démons. Le bonus de DEF permanent passe à +2." },
    { r: 7, n: 'Châtiment du mal', a: 'L', d: "Attaque contre un mort-vivant ou un démon : DM doublés en cas de réussite (triplés sur un critique), DM normaux même en cas d'échec. Cumulable avec Châtiment divin (le bonus de CHA est alors doublé)." },
    { r: 8, n: "Forme d'ange", a: 'A', s: true, f: 'jour', d: "1×/jour pendant CHA minutes : conserve son profil et ses caractéristiques, vole à 30 m par action de mouvement et obtient une RD 10 contre les attaques des morts-vivants et des démons." }
  ]
};

COF.PRESTIGE.vermines = {
  id: 'vermines', nom: 'Voie des vermines', fam: 'mystique',
  desc: "Araignées, scorpions et insectes géants deviennent des alliés plutôt que des cauchemars.",
  caps: [
    { r: 4, n: 'Maître vermine', d: "Communique avec les vermines géantes (insectes, araignées, scorpions, mille-pattes) qui le considèrent comme un ami, sauf si elles sont sous contrôle magique ou druidique." },
    { r: 5, n: 'Nuées de criquets', a: 'A', s: true, d: "Test opposé d'attaque magique (20 m) : une nuée dévore la cible pendant [5 + CHA] rounds — 2 DM par tour et -3 à toutes ses actions. Les DM de zone détruisent la nuée." },
    { r: 6, n: 'Compagnon vermine', dmg: '1d4°+5', d: "Un scorpion ou une araignée géante : AGI +3*, CON +5, FOR +5, PER +2, CHA -4, INT -3, VOL +2. DEF [15 + rang], PV [niveau × 5], attaque = attaque magique, DM 1d4°+5 et poison +1d4°. Déplacement 20 m. Le scorpion attaque pinces + dard en action limitée ; l'araignée grimpe aux murs." },
    { r: 7, n: 'Affinité au poison', a: 'L', f: 'combat', t: 'bonus', dmg: '1d4°', d: "1×/combat : enduit une arme tranchante ou perforante de poison, +1d4° DM de poison. Divise par deux les DM et la durée des poisons qu'il subit." },
    { r: 8, n: 'Vermine supérieure', d: "La vermine peut servir de monture et gagne une capacité : Étreinte du scorpion (sur un 15-20 au dé d'attaque, la cible de taille grande ou inférieure est immobilisée) ou Toile d'araignée (L) (portée 10 m, cible immobilisée 1d6 rounds ; test de FOR difficulté 15 pour se libérer)." }
  ]
};
