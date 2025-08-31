// GlintWeb – scripts pour les effets de défilement
// Cette logique ajoute des animations d'apparition au scroll et un effet parallax simple.

document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer pour révéler les éléments lorsque l'utilisateur les fait défiler
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // Effet parallax basique : déplacement vertical des éléments selon leur data-speed
  const parallaxEls = document.querySelectorAll('[data-parallax-speed]');
  const onScroll = () => {
    const scrollY = window.pageYOffset;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallaxSpeed) || 0;
      // Applique un décalage vertical proportionnel au scroll
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  };
  if (parallaxEls.length) {
    window.addEventListener('scroll', onScroll);
    onScroll();
  }
});