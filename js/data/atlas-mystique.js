/* ============================================================
   COF2 Compagnon — Atlas d'Osgild : voie supplémentaire de la
   famille des mystiques. Pensée pour un prêtre maléfique, en
   remplacement de la voie des soins.
   ============================================================ */
window.COF = window.COF || {};
COF.PROFILS = COF.PROFILS || {};

(function () {
  if (!COF.PROFILS.pretre) return;
  COF.PROFILS.pretre.voies.push(
    { id: 'corruption', nom: 'Voie de la corruption', caps: [
      { r: 1, n: 'Blessure mineure', a: 'A', s: true, dmg: '2d4°+CHA', d: "Attaque au contact avec un dé bonus : la victime subit [2d4° + CHA] DM." },
      { r: 2, n: 'Poison', a: 'A', dmg: '1d4°', d: "Attaque au contact : la victime subit immédiatement 1d4° DM de poison, puis un test de CON difficulté [10 + CHA] ou est affaiblie 1 round (jusqu'à récupération rapide si son NC est inférieur au rang atteint). Sans effet sur les créatures non-vivantes." },
      { r: 3, n: 'Blessure majeure', a: 'L', s: true, f: 'combat', dmg: '2d4°+niveau',
        scaleDmg: { profil: 'pretre', seuilRang: 5, dePlus: 1 },
        d: "Une fois par combat, blesse automatiquement une cible à 20 m : [2d4° + niveau] DM (+1d4° par rang 5 atteint dans une voie de prêtre)." },
      { r: 4, n: 'Vengeance', f: 'jour', dmg: '2d4°+CHA', d: "Une fois par jour, lorsqu'il tombe à 0 PV : onde d'énergie négative infligeant [2d4° + CHA] DM à tous ses adversaires dans un rayon de 20 m (le double à celui qui l'a mis à 0 PV)." },
      { r: 5, n: 'Épidémie', a: 'L', s: true, f: 'jour', d: "Une fois par jour, rend malade une créature humanoïde par point de CHA dans un rayon de 5 m : test de CON difficulté [10 + CHA] ou affaiblie jusqu'à une récupération rapide (ou un sort de Délivrance)." }
    ]}
  );
})();
