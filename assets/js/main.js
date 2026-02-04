function loadPartial(selector, url) {
  const container = document.querySelector(selector);
  if (!container) return Promise.resolve();
  return fetch(url)
    .then((response) => (response.ok ? response.text() : ''))
    .then((html) => {
      container.innerHTML = html;
    })
    .catch(() => {});
}

function initMagneticButtons() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const buttons = document.querySelectorAll('.btn--magnetic');
  buttons.forEach((btn) => {
    const strength = 12;
    btn.addEventListener('mousemove', (event) => {
      const rect = btn.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      const moveX = (x / rect.width) * strength;
      const moveY = (y / rect.height) * strength;
      btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  Promise.all([
    loadPartial('#site-header', 'partials/header.html'),
    loadPartial('#site-footer', 'partials/footer.html'),
    loadPartial('#site-cta', 'partials/cta.html'),
  ]).then(() => {
    if (window.initMenu) window.initMenu();
    if (window.setActiveNav) window.setActiveNav();
    if (window.initHeaderSticky) window.initHeaderSticky();
    if (window.initTheme) window.initTheme();
    if (window.initScrollAnimations) window.initScrollAnimations();
    if (window.initFormValidation) window.initFormValidation();
    initMagneticButtons();
  });
});


