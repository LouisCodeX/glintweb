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
});// ===== Scroll reveals (if not already present) =====
(() => {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => e.target.classList.toggle('in-view', e.isIntersecting));
  }, { rootMargin: '0px 0px -5% 0px', threshold: 0.05 });
  items.forEach(el => io.observe(el));
})();

// ===== GPU parallax engine with easing + visibility guard =====
(() => {
  const sections = [...document.querySelectorAll('[data-section-parallax]')];
  if (!sections.length) return;

  // Only animate visible sections
  const visible = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => e.isIntersecting ? visible.add(e.target) : visible.delete(e.target));
  }, { rootMargin: '10% 0% 10% 0%' });
  sections.forEach(sec => io.observe(sec));

  let lastY = window.scrollY, currentY = lastY;
  const lerp = (a,b,t) => a + (b - a) * t; // easing/inertia

  function update(){
    lastY = window.scrollY;
    currentY = lerp(currentY, lastY, 0.12); // 0.10–0.18 = more inertia

    visible.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      const center = rect.top + rect.height/2 + currentY;
      const relY = (currentY - center) * 0.0012; // normalize

      sec.querySelectorAll('.layer').forEach(layer => {
        const depth = parseFloat(layer.dataset.depth || 0.1);
        const y = relY * depth * 1000;          // px movement
        layer.style.transform = `translate3d(0, ${y}px, 0)`;
      });
    });

    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
})();
