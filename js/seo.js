/* ═══════════════════════════════════════
   seo.js — Meta tags dinámicos + performance
   Rupta Studios
═══════════════════════════════════════ */

/* ══════════════════════════════
   META TAGS POR PÁGINA
══════════════════════════════ */
const SEO = {
  inicio: {
    title:       'Rupta Studios — Agencia de Diseño Web y Shopify en Panamá',
    description: 'Agencia de diseño web y Shopify en Panamá. Creamos ecommerce, brand websites y landings para marcas que quieren vender más. +20 proyectos entregados.',
    og_title:    'Rupta Studios — Diseño Web y Shopify en Panamá',
    og_desc:     'Diseñamos marcas que venden. Shopify, webs y landings para marcas premium en Panamá y Latinoamérica.',
    canonical:   'https://ruptastudios.com'
  },
  servicios: {
    title:       'Servicios — Diseño Web, Shopify y SEO | Rupta Studios',
    description: 'Diseño web, e-commerce Shopify, branding, SEO y marketing digital en Panamá. Soluciones digitales para marcas que quieren crecer.',
    og_title:    'Servicios — Rupta Studios',
    og_desc:     'Diseño web, Shopify, branding y SEO para marcas en Panamá y LATAM.',
    canonical:   'https://ruptastudios.com#servicios'
  },
  portafolio: {
    title:       'Portafolio — Proyectos en Producción | Rupta Studios',
    description: 'Santo Patrón, Eleva Corp, Rystar Studios, Caos World. Proyectos reales con resultados medibles en Panamá y Latinoamérica.',
    og_title:    'Portafolio — Rupta Studios',
    og_desc:     'Proyectos reales. +180% ventas, sold out en 18 min, 1,200 registros pre-lanzamiento.',
    canonical:   'https://ruptastudios.com#portafolio'
  },
  planes: {
    title:       'Planes y Precios — Diseño Web desde $600 USD | Rupta Studios',
    description: 'Planes Starter $600, Business $900 y Pro $1,200 USD. Diseño web y Shopify en Panamá con precios claros y sin cobros sorpresa.',
    og_title:    'Planes y Precios — Rupta Studios',
    og_desc:     'Diseño web en Panamá desde $600 USD. Planes claros, sin letra pequeña.',
    canonical:   'https://ruptastudios.com#planes'
  },
  nosotros: {
    title:       'Nosotros — Rodolfo Martinez | Rupta Studios',
    description: 'Conoce al equipo detrás de Rupta Studios. Más de 5 años diseñando marcas digitales en Panamá y Latinoamérica.',
    og_title:    'Nosotros — Rupta Studios',
    og_desc:     'Más de 5 años, +20 proyectos, 4 países. Diseño web y Shopify en Panamá.',
    canonical:   'https://ruptastudios.com#nosotros'
  },
  contacto: {
    title:       'Contacto — Inicia tu Proyecto | Rupta Studios',
    description: 'Escríbenos por WhatsApp o email. Respondemos en menos de 24 horas. Proyectos de diseño web y Shopify desde $600 USD en Panamá.',
    og_title:    'Contacto — Rupta Studios',
    og_desc:     'Inicia tu proyecto web hoy. Respondemos en menos de 24 horas.',
    canonical:   'https://ruptastudios.com#contacto'
  }
};

/* ── Actualiza un <meta> existente o lo crea ── */
function setMeta(selector, attr, value) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    const parts = selector.match(/\[([^\]]+)="([^\]]+)"\]/);
    if (parts) el.setAttribute(parts[1], parts[2]);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

/* ── Actualiza el canonical ── */
function setCanonical(url) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', url);
}

/* ── Aplica SEO de una página ── */
function applySEO(pageId) {
  const data = SEO[pageId];
  if (!data) return;

  document.title = data.title;
  setMeta('meta[name="description"]',         'content', data.description);
  setMeta('meta[property="og:title"]',        'content', data.og_title);
  setMeta('meta[property="og:description"]',  'content', data.og_desc);
  setMeta('meta[property="og:url"]',          'content', data.canonical);
  setMeta('meta[name="twitter:title"]',       'content', data.og_title);
  setMeta('meta[name="twitter:description"]', 'content', data.og_desc);
  setCanonical(data.canonical);
}

/* ══════════════════════════════
   PERFORMANCE — caché + prefetch
══════════════════════════════ */
const pageCache = {};

/* ── Precarga una página en background ── */
function prefetchPage(id) {
  if (pageCache[id]) return;
  fetch('pages/' + id + '.html')
    .then(function (res) { return res.text(); })
    .then(function (html) { pageCache[id] = html; })
    .catch(function () {});
}

/* ── Prefetch de todas las páginas tras el primer load ── */
function prefetchAll() {
  const pages = ['servicios', 'portafolio', 'planes', 'nosotros', 'contacto'];
  /* Diferimos para no competir con recursos críticos */
  if ('requestIdleCallback' in window) {
    requestIdleCallback(function () {
      pages.forEach(prefetchPage);
    });
  } else {
    setTimeout(function () {
      pages.forEach(prefetchPage);
    }, 2000);
  }
}

/* ── Prefetch al hover sobre los links del nav ── */
function initHoverPrefetch() {
  document.querySelectorAll('.nl[data-p], .mob-nl[data-p]').forEach(function (btn) {
    btn.addEventListener('mouseenter', function () {
      prefetchPage(btn.dataset.p);
    }, { once: true });
  });
}

/* ── Exponer caché para que router.js lo use ── */
window.pageCache   = pageCache;
window.applySEO    = applySEO;
window.prefetchAll = prefetchAll;
window.initHoverPrefetch = initHoverPrefetch;

/* ── Init ── */
document.addEventListener('DOMContentLoaded', function () {
  initHoverPrefetch();
  /* Prefetch en idle tras cargar inicio */
  prefetchAll();
});
