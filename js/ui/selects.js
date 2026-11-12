/* ============================================================
   COF2 Compagnon — Menus déroulants aux couleurs de l'app
   La liste d'un <select> natif est dessinée par le téléphone (fond
   blanc, police système). Ce module remplace son ouverture par une
   feuille de choix au style de l'app, pour TOUS les menus, y compris
   ceux ajoutés plus tard (observateur du DOM) :
   - le <select> reste en place (valeur, événement « change », code
     existant inchangés) ; on l'enveloppe et on intercepte le toucher ;
   - groupes (optgroup), option courante, options désactivées ;
   - champ de recherche quand la liste est longue.
   ============================================================ */
window.COF = window.COF || {};
COF.UI = COF.UI || {};

COF.UI.Selects = (function () {
  var pop = null, courant = null;
  function esc(s) { return String(s === null || s === undefined ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function envelopper(sel) {
    if (sel.dataset.cs || sel.multiple || sel.size > 1) return;
    sel.dataset.cs = '1';
    var w = document.createElement('span');
    w.className = 'cs-wrap';
    if (sel.style.width) w.style.width = sel.style.width;
    /* dans une ligne (flex horizontal), le menu garde sa place au lieu de prendre toute la largeur */
    var par = sel.parentNode && getComputedStyle(sel.parentNode);
    if (par && /flex/.test(par.display) && !/column/.test(par.flexDirection)) w.classList.add('ligne');
    if (sel.style.marginTop) { w.style.marginTop = sel.style.marginTop; sel.style.marginTop = '0'; }
    if (sel.style.marginBottom) { w.style.marginBottom = sel.style.marginBottom; sel.style.marginBottom = '0'; }
    sel.parentNode.insertBefore(w, sel);
    w.appendChild(sel);
    w.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); if (!sel.disabled) ouvrir(sel); });
  }
  function scanner(racine) {
    (racine || document).querySelectorAll('select:not([data-cs])').forEach(envelopper);
  }
  function libelle(sel) {
    var l = sel.closest('.champ') && sel.closest('.champ').querySelector('label');
    return l ? l.textContent : 'Choisir';
  }
  function ouvrir(sel) {
    fermer();
    courant = sel;
    var items = [], n = 0;
    Array.prototype.forEach.call(sel.children, function (c) {
      if (c.tagName === 'OPTGROUP') {
        items.push('<div class="cs-groupe">' + esc(c.label) + '</div>');
        Array.prototype.forEach.call(c.children, function (o) { items.push(opt(o)); n++; });
      } else if (c.tagName === 'OPTION') { items.push(opt(c)); n++; }
    });
    function opt(o) {
      return '<button class="cs-opt' + (o.selected ? ' on' : '') + '" data-val="' + esc(o.value) + '"' + (o.disabled ? ' disabled' : '') + '>' +
        '<span>' + esc(o.textContent) + '</span>' + (o.selected ? '<b>✓</b>' : '') + '</button>';
    }
    pop = document.createElement('div');
    pop.className = 'cs-pop';
    pop.innerHTML = '<div class="cs-fond"></div><div class="cs-feuille" role="listbox"><div class="cs-tete"><span>' + esc(libelle(sel)) + '</span><button class="cs-x" aria-label="Fermer">✕</button></div>' +
      (n > 12 ? '<input class="cs-cherche" placeholder="Rechercher…" autocomplete="off">' : '') +
      '<div class="cs-liste">' + items.join('') + '</div></div>';
    document.body.appendChild(pop);
    requestAnimationFrame(function () { if (pop) pop.classList.add('ouvert'); });
    var on = pop.querySelector('.cs-opt.on'); if (on) on.scrollIntoView({ block: 'center' });
    pop.addEventListener('click', function (e) {
      if (e.target.classList.contains('cs-fond') || e.target.closest('.cs-x')) { fermer(); return; }
      var b = e.target.closest('.cs-opt'); if (!b || b.disabled) return;
      choisir(b.getAttribute('data-val'));
    });
    var ch = pop.querySelector('.cs-cherche');
    if (ch) ch.addEventListener('input', function () {
      var q = ch.value.trim().toLowerCase();
      pop.querySelectorAll('.cs-opt').forEach(function (b) { b.style.display = !q || b.textContent.toLowerCase().indexOf(q) >= 0 ? '' : 'none'; });
      pop.querySelectorAll('.cs-groupe').forEach(function (g) { g.style.display = q ? 'none' : ''; });
    });
  }
  function choisir(val) {
    var sel = courant; fermer();
    if (!sel || sel.value === val) return;
    sel.value = val;
    sel.dispatchEvent(new Event('input', { bubbles: true }));
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function fermer() { if (pop) { pop.remove(); pop = null; } courant = null; }

  function init() {
    scanner(document);
    var attente = false;
    new MutationObserver(function () {
      if (attente) return; attente = true;
      requestAnimationFrame(function () { attente = false; scanner(document); });
    }).observe(document.body, { childList: true, subtree: true });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && pop) fermer(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  return { scanner: scanner, fermer: fermer };
})();
