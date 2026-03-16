/* ═══════════════════════════════════════
   animations.js — Reveal on scroll y contadores
   Rupta Studios
═══════════════════════════════════════ */

/* ── Reveal on scroll ── */
function initReveal() {
  const io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -28px 0px' });

  document.querySelectorAll('#page-container .rv:not(.in)').forEach(function(el) {
    io.observe(el);
  });
}

/* ── Contador animado individual ── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target);
  const duration = 1800;
  const start    = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3); /* ease-out cúbico */
    el.textContent = Math.floor(ease * target);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target;
    }
  }
  requestAnimationFrame(step);
}

/* ── Inicializar contadores — arrancan cuando son visibles ── */
function initCounters() {
  const counters = document.querySelectorAll('#page-container .counter:not([data-done])');
  if (!counters.length) return;

  const io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.dataset.done = '1';
        animateCounter(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function(c) { io.observe(c); });
}
