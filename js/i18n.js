/* ═══════════════════════════════════════
   i18n.js — Motor de traducciones
   Rupta Studios
═══════════════════════════════════════ */

const i18n = (function () {

  let currentLang = 'es';
  const cache = {};

  /* ── Carga el JSON del idioma (con caché) ── */
  function loadLocale(lang) {
    if (cache[lang]) return Promise.resolve(cache[lang]);
    return fetch('locales/' + lang + '.json')
      .then(function (res) {
        if (!res.ok) throw new Error('Locale no encontrado: ' + lang);
        return res.json();
      })
      .then(function (data) {
        cache[lang] = data;
        return data;
      });
  }

  /* ── Obtiene un valor anidado por clave "seccion.clave" ── */
  function get(data, key) {
    return key.split('.').reduce(function (obj, k) {
      return obj && obj[k] !== undefined ? obj[k] : null;
    }, data);
  }

  /* ── Aplica las traducciones al DOM cargado ── */
  function applyTranslations(data) {
    /* Texto normal */
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const val = get(data, el.dataset.i18n);
      if (val !== null) el.textContent = val;
    });

    /* HTML (para texto con etiquetas como <span> o <em>) */
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      const val = get(data, el.dataset.i18nHtml);
      if (val !== null) el.innerHTML = val;
    });

    /* Placeholders de inputs */
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      const val = get(data, el.dataset.i18nPlaceholder);
      if (val !== null) el.placeholder = val;
    });

    /* Atributo aria-label */
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      const val = get(data, el.dataset.i18nAria);
      if (val !== null) el.setAttribute('aria-label', val);
    });
  }

  /* ── Cambia el idioma activo ── */
  function setLang(lang) {
    if (!['es', 'en', 'pt'].includes(lang)) return;
    currentLang = lang;

    /* Actualizar botones de idioma */
    document.querySelectorAll('.lb').forEach(function (b) {
      b.classList.toggle('on', b.textContent.trim() === lang.toUpperCase());
    });

    /* Actualizar atributo lang del HTML */
    document.documentElement.lang = lang;

    /* Guardar preferencia */
    try { localStorage.setItem('rupta-lang', lang); } catch (e) {}

    /* Cargar y aplicar */
    loadLocale(lang).then(function (data) {
      applyTranslations(data);
    });
  }

  /* ── Inicialización: detecta idioma guardado o del navegador ── */
  function init() {
    let saved = null;
    try { saved = localStorage.getItem('rupta-lang'); } catch (e) {}

    const browserLang = (navigator.language || 'es').slice(0, 2);
    const detected = saved || (['es', 'en', 'pt'].includes(browserLang) ? browserLang : 'es');

    setLang(detected);
  }

  /* ── API pública ── */
  return {
    init: init,
    setLang: setLang,
    getCurrentLang: function () { return currentLang; },
    /* Permite re-aplicar traducciones tras cargar una nueva página */
    reapply: function () {
      if (cache[currentLang]) applyTranslations(cache[currentLang]);
    }
  };

})();

/* ── Exponer setL() para compatibilidad con los onclick del HTML ── */
function setL(lang) {
  i18n.setLang(lang);
}
