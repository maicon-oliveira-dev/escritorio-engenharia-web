(function () {
  function setActiveNav() {
    const page = document.body.dataset.page;
    if (!page) return;
    const links = document.querySelectorAll('.site-header__link');
    links.forEach((link) => {
      if (link.dataset.page === page) {
        link.classList.add('is-active');
      }
    });
  }

  function initMenu() {
    const toggle = document.querySelector('.site-header__toggle');
    const nav = document.querySelector('.site-header__nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.addEventListener('click', (event) => {
      const target = event.target;
      if (target && target.matches('a')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function initHeaderShrink() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle('site-header--shrink', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initTheme() {
    const toggle = document.querySelector('[data-theme-toggle]');
    const stored = localStorage.getItem('theme');
    const initial = stored || 'light';

    const applyTheme = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      if (toggle) {
        toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
        toggle.querySelector('span').textContent = theme === 'dark' ? 'Modo claro' : 'Modo escuro';
      }
    };

    applyTheme(initial);

    if (toggle) {
      toggle.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        applyTheme(next);
      });
    }
  }

  window.initMenu = initMenu;
  window.setActiveNav = setActiveNav;
  window.initHeaderShrink = initHeaderShrink;
  window.initTheme = initTheme;
})();


