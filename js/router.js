/* ═══════════════════════════════════════
   router.js — Navegación y carga de páginas
   Rupta Studios
═══════════════════════════════════════ */

const PAGES = ['inicio', 'servicios', 'portafolio', 'planes', 'nosotros', 'contacto'];
let currentPage = null;

/* ── Carga una página desde pages/{id}.html ── */
function go(id) {
  if (!PAGES.includes(id)) return;
  if (id === currentPage) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const container = document.getElementById('page-container');

  /* Estado de carga visual */
  container.style.opacity = '0';
  container.style.transition = 'opacity 0.18s ease';

  fetch(`pages/${id}.html`)
    .then(function(res) {
      if (!res.ok) throw new Error('No se pudo cargar la página: ' + id);
      return res.text();
    })
    .then(function(html) {
      container.innerHTML = html;
      currentPage = id;

      /* Actualizar nav activo */
      document.querySelectorAll('.nl').forEach(function(btn) {
        btn.classList.toggle('on', btn.dataset.p === id);
      });

      /* Scroll al top y fade in */
      window.scrollTo({ top: 0, behavior: 'smooth' });
      requestAnimationFrame(function() {
        container.style.opacity = '1';
      });

      /* Reinicializar animaciones y contadores */
      if (typeof initReveal   === 'function') initReveal();
      if (typeof initCounters === 'function') initCounters();

      /* Actualizar URL sin recargar (opcional, mejora SEO y back/forward) */
      history.pushState({ page: id }, '', '#' + id);
      document.title = pageTitles[id] || 'Rupta Studios';
    })
    .catch(function(err) {
      console.error(err);
      container.innerHTML = '<div style="padding:120px 28px;text-align:center;color:#8e8ca4">No se pudo cargar la página.</div>';
      container.style.opacity = '1';
    });
}

/* ── Títulos por página (SEO) ── */
const pageTitles = {
  inicio:     'Rupta Studios — Agencia de Diseño Web y Shopify en Panamá',
  servicios:  'Servicios — Rupta Studios',
  portafolio: 'Portafolio — Rupta Studios',
  planes:     'Planes y Precios — Rupta Studios',
  nosotros:   'Nosotros — Rupta Studios',
  contacto:   'Contacto — Rupta Studios',
};

/* ── Back / Forward del navegador ── */
window.addEventListener('popstate', function(e) {
  const id = (e.state && e.state.page) ? e.state.page : 'inicio';
  go(id);
});

/* ── Idioma (stub — listo para i18n) ── */
function setL(lang) {
  document.querySelectorAll('.lb').forEach(function(b) {
    b.classList.toggle('on', b.textContent === lang.toUpperCase());
  });
  document.documentElement.lang = lang;
}

/* ── Carga inicial al abrir la web ── */
document.addEventListener('DOMContentLoaded', function() {
  /* Si la URL tiene un hash (#servicios), carga esa página */
  const hash = window.location.hash.replace('#', '');
  const startPage = PAGES.includes(hash) ? hash : 'inicio';
  go(startPage);
});
