/* ============================================================
   COF2 Compagnon — Voies de prestige du Compagnon du joueur
   (chapitre 2) : voie de l'entité et voie des mutations,
   réservées par défaut à la famille des mages.
   ============================================================ */
window.COF = window.COF || {};
COF.PRESTIGE = COF.PRESTIGE || {};

COF.PRESTIGE.entite = {
  id: 'entite', nom: "Voie de l'entité", fam: 'mage',
  desc: "L'invocation d'une créature d'un autre plan, totalement dévouée à son invocateur.",
  caps: [
    { r: 4, n: "Invocation d'une entité", a: 'A', s: true, dmg: '2d4°+FOR', d: "Appelle une créature d'un autre plan à son service (seul l'invocateur peut la renvoyer, en action de mouvement). À 0 PV ou renvoyée, elle ne peut être rappelée qu'après une récupération complète, avec tous ses PV et sans état préjudiciable ; hors de son plan elle ne guérit que par magie. Parle la langue de l'invocateur, agit selon son INT. Création : répartir 5 points entre FOR et AGI, puis 3 entre PER, CHA, INT et VOL (0 par défaut, jamais négatif) ; CON +4, DEF [15 + AGI], attaque = attaque magique de l'invocateur, DM [2d4° + FOR], PV [4 × niveau], taille moyenne. Apparence libre, fixée à la 1re invocation." },
    { r: 5, n: 'Lien magique', d: "Télépathie avec l'entité quelle que soit la distance. Peut sacrifier ses PV pour protéger son entité, ou lui transférer ses propres DM (doublés pour elle). L'entité peut toucher les cibles protégées contre les créatures invoquées." },
    { r: 6, n: 'Amélioration', dmg: '1d4°', d: "Une option (+1 au rang 7, +1 au rang 8 ; cumulables) : Armes puissantes (+1d4° DM au contact), Armure (+4 DEF), Grande taille (+10 PV, +2 FOR), Attaque à distance (20 m, [2d4° + PER] DM), Résistant (+2 CON, +10 PV, DM d'un élément divisés par 2), Supériorité (+2 INT, VOL et CHA ; 2 PM et sorts connus du maître, sans brûlure de mana), Vif (+2 AGI et PER, +2 DEF et Init.), Vol (+10 m de vol par mouvement à chaque prise)." },
    { r: 7, n: 'Protecteur', f: 'round', d: "Un allié au contact de l'entité gagne +2 en DEF (+4 pour l'invocateur). 1×/tour, l'entité peut subir une attaque à la place d'un allié à son contact." },
    { r: 8, n: 'Lien magique amélioré', a: 'M', d: "En action de mouvement : téléporte l'entité à son contact, se téléporte au contact de l'entité, ou échange sa place avec elle." }
  ]
};

COF.PRESTIGE.mutations = {
  id: 'mutations', nom: 'Voie des mutations', fam: 'mage',
  desc: "Des mutations monstrueuses et temporaires. En lançant un sort de mutation, le mage profite gratuitement de toutes les mutations de rang inférieur (une seule option par capacité à la fois). Variante générique (tout profil) : capacités non magiques, une option fixée par rang à l'acquisition, une mutation (A) ou toutes (L), chacune 1×/combat.",
  caps: [
    { r: 4, n: 'Mutation offensive', a: 'A', s: true, dmg: '1d4°+FOR', d: "Pendant [VOL] minutes, appendice monstrueux (gueule, bras griffu, queue à dard…) : une attaque par round en action gratuite, [1d4° + FOR] DM avec +2 en FOR (attaque et DM). [2d4° + FOR] DM à partir du rang 7." },
    { r: 5, n: 'Mutation protectrice', a: 'A', s: true, d: "Pendant [VOL] minutes, une mutation au choix : Cuirasse (+3 DEF) ; Écailles rouges (DM de feu et d'acide divisés par 2, immunité au poison) ; Fourrure violette (DM de froid et d'électricité divisés par 2, immunité aux maladies) ; Organes supplémentaires (vision dans le noir à 20 m, dé bonus en PER et en discrétion)." },
    { r: 6, n: 'Mutation motrice', a: 'A', s: true, d: "Pendant [VOL] minutes, une mutation au choix : Ailes (vol à sa vitesse normale) ; Pattes démesurées (20 m par mouvement) ; Queue de poisson (nage 20 m par mouvement, respiration aquatique)." },
    { r: 7, n: 'Mutation structurelle', a: 'A', s: true, d: "Pendant [VOL] minutes, une mutation au choix : Muscles hypertrophiés (+2 FOR en attaque et aux DM au contact) ; Silhouette filiforme (+3 AGI et DEF) ; Silhouette massive (+5 aux tests de CON et RD 3)." },
    { r: 8, n: 'Mutation régénératrice', a: 'A', s: true, f: 'jour', t: 'soin', dmg: '5d4°+VOL', d: "1×/jour : bénéficie de toutes ses mutations pendant [1d4° + VOL] minutes et récupère immédiatement [5d4° + VOL] PV." }
  ]
};
