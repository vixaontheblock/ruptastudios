/* ═══════════════════════════════════════
   router.js — Navegación, caché y transiciones
   Rupta Studios
═══════════════════════════════════════ */

const PAGES = ['inicio', 'servicios', 'portafolio', 'planes', 'nosotros', 'contacto'];
let currentPage = null;
let isTransitioning = false;

/* ── Carga e inyecta una página ── */
function go(id) {
  if (!PAGES.includes(id)) return;
  if (id === currentPage) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  if (isTransitioning) return;
  isTransitioning = true;

  const container = document.getElementById('page-container');

  /* Fase 1 — salida */
  container.classList.remove('visible');
  container.classList.add('leaving');

  /* Resolver HTML desde caché o fetch */
  const cached = window.pageCache && window.pageCache[id];
  const promise = cached
    ? Promise.resolve(cached)
    : fetch('pages/' + id + '.html').then(function (res) {
        if (!res.ok) throw new Error('Error cargando: ' + id);
        return res.text();
      }).then(function (html) {
        if (window.pageCache) window.pageCache[id] = html;
        return html;
      });

  promise
    .then(function (html) {
      /* Esperar que termine la transición de salida (~220ms) */
      return new Promise(function (resolve) {
        setTimeout(function () {
          container.innerHTML = html;
          resolve();
        }, 220);
      });
    })
    .then(function () {
      currentPage = id;

      /* Actualizar nav activo */
      document.querySelectorAll('.nl').forEach(function (btn) {
        btn.classList.toggle('on', btn.dataset.p === id);
      });

      /* URL e historial */
      history.pushState({ page: id }, '', '#' + id);

      /* SEO dinámico */
      if (typeof applySEO === 'function') applySEO(id);

      /* Fase 2 — entrada */
      container.classList.remove('leaving');
      container.classList.add('entering');

      window.scrollTo({ top: 0 });

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          container.classList.remove('entering');
          container.classList.add('visible');
          isTransitioning = false;

          /* ── FIX: esperar que el browser pinte antes de inicializar animaciones ── */
          requestAnimationFrame(function () {
            setTimeout(function () {
              if (typeof initReveal   === 'function') initReveal();
              if (typeof initCounters === 'function') initCounters();
              if (typeof initEffects  === 'function') initEffects();
              if (typeof i18n         !== 'undefined') i18n.reapply();
            }, 60);
          });
        });
      });
    })
    .catch(function (err) {
      console.error(err);
      container.innerHTML = '<div style="padding:120px 28px;text-align:center;color:#8e8ca4">No se pudo cargar la página. <button onclick="go(\'' + id + '\')" class="btn btn-o" style="margin-top:16px">Reintentar</button></div>';
      container.classList.remove('leaving', 'entering');
      container.classList.add('visible');
      isTransitioning = false;
    });
}

/* ── Back / Forward del navegador ── */
window.addEventListener('popstate', function (e) {
  const id = (e.state && e.state.page) ? e.state.page : 'inicio';
  go(id);
});

/* ── Idioma ── */
function setL(lang) {
  if (typeof i18n !== 'undefined') {
    i18n.setLang(lang);
  } else {
    document.querySelectorAll('.lb').forEach(function (b) {
      b.classList.toggle('on', b.textContent.trim() === lang.toUpperCase());
    });
    document.documentElement.lang = lang;
  }
}

/* ── Carga inicial ── */
document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('page-container');
  if (container) container.classList.add('visible');

  const hash      = window.location.hash.replace('#', '');
  const startPage = PAGES.includes(hash) ? hash : 'inicio';

  /* Registrar estado inicial para popstate */
  history.replaceState({ page: startPage }, '', '#' + startPage);

  go(startPage);
});
