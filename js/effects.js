/* ═══════════════════════════════════════
   effects.js — Efectos interactivos premium
   Rupta Studios
═══════════════════════════════════════ */

(function () {

  /* ── Cursor glow (solo escritorio) ── */
  function initCursorGlow() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let mx = 0, my = 0, cx = 0, cy = 0;
    let raf;

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
    });

    function animate() {
      cx += (mx - cx) * 0.09;
      cy += (my - cy) * 0.09;
      glow.style.left = cx + 'px';
      glow.style.top  = cy + 'px';
      raf = requestAnimationFrame(animate);
    }
    animate();

    /* Ocultar cuando el cursor sale de la ventana */
    document.addEventListener('mouseleave', function () { glow.style.opacity = '0'; });
    document.addEventListener('mouseenter', function () { glow.style.opacity = '1'; });
  }

  /* ── Hover 3D en cards ── */
  function initCards3D() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('.rcard,.sol-card,.plan,.rev,.pc').forEach(function (card) {
      card.classList.add('card-3d');

      card.addEventListener('mousemove', function (e) {
        const rect  = card.getBoundingClientRect();
        const x     = (e.clientX - rect.left) / rect.width  - 0.5;
        const y     = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = 'perspective(700px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateZ(4px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) translateZ(0)';
      });
    });
  }

  /* ── Magnetic buttons ── */
  function initMagnetic() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('.btn-p, .btn-wa').forEach(function (btn) {
      btn.classList.add('btn-magnetic');

      btn.addEventListener('mousemove', function (e) {
        const rect = btn.getBoundingClientRect();
        const x    = (e.clientX - rect.left - rect.width  / 2) * 0.25;
        const y    = (e.clientY - rect.top  - rect.height / 2) * 0.25;
        btn.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ── Ripple en todos los botones ── */
  function initRipple() {
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn');
      if (!btn) return;

      const rect   = btn.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = [
        'width:'  + size + 'px',
        'height:' + size + 'px',
        'left:'   + (e.clientX - rect.left - size / 2) + 'px',
        'top:'    + (e.clientY - rect.top  - size / 2) + 'px'
      ].join(';');
      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 500);
    });
  }

  /* ── Parallax sutil en el hero glow ── */
  function initParallax() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    window.addEventListener('mousemove', function (e) {
      const glow = document.querySelector('.hero-glow');
      if (!glow) return;
      const x = (e.clientX / window.innerWidth  - 0.5) * 18;
      const y = (e.clientY / window.innerHeight - 0.5) * 18;
      glow.style.transform = 'translateX(calc(-50% + ' + x + 'px)) translateY(' + y + 'px)';
    });
  }

  /* ── Scroll parallax en hero grid ── */
  function initScrollParallax() {
    window.addEventListener('scroll', function () {
      const grid = document.querySelector('.hero-grid');
      if (!grid) return;
      grid.style.transform = 'translateY(' + (window.scrollY * 0.15) + 'px)';
    }, { passive: true });
  }

  /* ── Contador: pulso al terminar ── */
  function patchCounters() {
    const original = window.animateCounter;
    if (typeof original !== 'function') return;

    window.animateCounter = function (el) {
      original(el);
      /* Añadir clase de pop cuando termina (aprox duración 1800ms) */
      setTimeout(function () {
        el.classList.add('counter-done');
        setTimeout(function () { el.classList.remove('counter-done'); }, 400);
      }, 1820);
    };
  }

  /* ── Transición entre páginas (actualiza router.js behavior) ── */
  function initPageTransitions() {
    const container = document.getElementById('page-container');
    if (!container) return;
    container.classList.add('visible');
  }

  /* ── Activar hero badge shimmer solo si hay badge en el DOM ── */
  function initBadgeShimmer() {
    /* El CSS lo maneja solo con .hero-badge::after — no se necesita JS */
  }

  /* ── Init todo ── */
  function init() {
    initCursorGlow();
    initRipple();
    initParallax();
    initScrollParallax();
    initPageTransitions();
    patchCounters();
    /* Cards 3D y magnetic se reinician con cada carga de página */
  }

  /* ── Re-init tras cargar una nueva página ── */
  window.initEffects = function () {
    initCards3D();
    initMagnetic();
  };

  /* Arrancar cuando el DOM esté listo */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
