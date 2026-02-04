(function () {
  function initHeaderSticky() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const spacer = header.nextElementSibling?.classList.contains('header-spacer')
      ? header.nextElementSibling
      : null;

    let ticking = false;

    const updateSticky = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const shouldStick = scrollY > 10;
      const shouldUnstick = scrollY < 2;

      if (shouldStick && !header.classList.contains('is-sticky')) {
        header.classList.add('is-sticky');
        if (spacer) spacer.style.height = `${header.offsetHeight}px`;
      } else if (shouldUnstick && header.classList.contains('is-sticky')) {
        header.classList.remove('is-sticky');
        if (spacer) spacer.style.height = '0px';
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateSticky);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      if (spacer && header.classList.contains('is-sticky')) {
        spacer.style.height = `${header.offsetHeight}px`;
      }
    });

    const navLinks = Array.from(document.querySelectorAll('.site-header__link'))
      .filter((link) => link.getAttribute('href')?.startsWith('#'));

    if (navLinks.length) {
      const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

      const setActive = (targetId) => {
        navLinks.forEach((link) => {
          const isActive = link.getAttribute('href') === `#${targetId}`;
          link.classList.toggle('active', isActive);
          link.classList.toggle('is-active', isActive);
        });
      };

      const spyObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActive(entry.target.id);
            }
          });
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      );

      sections.forEach((section) => spyObserver.observe(section));

      window.addEventListener('scroll', () => {
        const nearBottom =
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
        if (nearBottom) {
          const lastLink = navLinks[navLinks.length - 1];
          navLinks.forEach((link) => {
            const isActive = link === lastLink;
            link.classList.toggle('active', isActive);
            link.classList.toggle('is-active', isActive);
          });
        }
      }, { passive: true });
    }
  }

  window.initHeaderSticky = initHeaderSticky;
})();
