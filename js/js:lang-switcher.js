// js/lang-switcher.js
// Initialise le sélecteur de langue sans casser l'init Rayo.
// S'exécute seulement si le composant est présent.

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const body = document.body;
  const sw   = document.querySelector('.mxd-lang-switch');
  if (!sw) return; // Pas de switch sur cette page -> on sort proprement

  const btn     = sw.querySelector('.mxd-lang__btn');
  const current = sw.querySelector('.mxd-lang__current');
  const menu    = sw.querySelector('.mxd-lang__menu');
  const options = sw.querySelectorAll('[data-lang]');

  // Récupère la langue mémorisée (fr par défaut)
  const saved = localStorage.getItem('site:lang') || 'fr';
  applyLang(saved, false);

  // Toggle du menu
  btn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = sw.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Ferme si clic à l’extérieur
  document.addEventListener('click', (e) => {
    if (!sw.contains(e.target)) {
      sw.classList.remove('is-open');
      btn?.setAttribute('aria-expanded', 'false');
    }
  });

  // Choix d’une langue
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      const lang = opt.getAttribute('data-lang');
      applyLang(lang, true);
      sw.classList.remove('is-open');
      btn?.setAttribute('aria-expanded', 'false');
    });
  });

  function applyLang(lang, persist) {
    if (current) current.textContent = lang.toUpperCase();

    options.forEach(li => {
      li.setAttribute('aria-selected', li.getAttribute('data-lang') === lang ? 'true' : 'false');
    });

    // Accessibilité + hooks CSS
    root.setAttribute('lang', lang);
    body.classList.remove('lang-fr', 'lang-en', 'lang-es');
    body.classList.add('lang-' + lang);

    // Mémorise
    if (persist) localStorage.setItem('site:lang', lang);

    // Événement custom si tu veux brancher une traduction de contenu
    document.dispatchEvent(new CustomEvent('languagechange:oriflamme', { detail: { lang } }));
  }
});
