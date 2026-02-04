(function () {
  function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const applyVariant = (el) => {
      const variant = (el.getAttribute('data-reveal') || 'up').toLowerCase();
      el.classList.add('reveal');
      if (variant.includes('blur')) el.classList.add('reveal--blur');
      if (variant.includes('scale')) el.classList.add('reveal--scale');
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const groupDelay = new Map();

    elements.forEach((el) => {
      applyVariant(el);
      const parent = el.closest('.grid, [data-stagger]');
      if (parent) {
        const key = parent.dataset.stagger || parent;
        const count = groupDelay.get(key) || 0;
        el.style.transitionDelay = `${count * 80}ms`;
        groupDelay.set(key, count + 1);
      }
      observer.observe(el);
    });
  }

  window.initScrollAnimations = initScrollAnimations;
})();


