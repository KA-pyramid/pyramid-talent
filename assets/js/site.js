/* ============================================================
   PYRAMID TALENT — SHARED SITE BEHAVIOR
   Header scroll state + mobile nav toggle. Runs on every page.
   Page-specific scripts (e.g. hero carousels) stay inline per-page.
   ============================================================ */

(function () {
  const hdr = document.getElementById('hdr');
  if (hdr) {
    const onScroll = () => hdr.classList.toggle('scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();

/* navigation: mobile toggle + tap-to-expand submenus */
(function () {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;
  const mq = window.matchMedia('(max-width:960px)');

  function closeNav() {
    links.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  links.querySelectorAll('.nav-item.has-menu > .nav-top').forEach((a) => {
    a.addEventListener('click', (e) => {
      if (mq.matches) {
        e.preventDefault();
        a.parentElement.classList.toggle('open');
      }
    });
  });

  links.querySelectorAll('.menu a, .nav-item:not(.has-menu) > .nav-top').forEach((el) => {
    el.addEventListener('click', () => {
      if (mq.matches) closeNav();
    });
  });
})();
