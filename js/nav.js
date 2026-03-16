/* ═══════════════════════════════════════
   nav.js — Navegación, scroll y menú mobile
   Rupta Studios
═══════════════════════════════════════ */

/* ── Scroll: clase .s agrega fondo al nav ── */
window.addEventListener('scroll', function() {
  document.getElementById('nav').classList.toggle('s', window.scrollY > 30);
});

/* ── Menú mobile: abrir / cerrar ── */
function mobMenu() {
  document.getElementById('mobEl').classList.toggle('open');
}

/* ── Cerrar menú mobile al hacer click fuera ── */
document.addEventListener('click', function(e) {
  const mob  = document.getElementById('mobEl');
  const burg = document.getElementById('burg');
  if (
    mob.classList.contains('open') &&
    !mob.contains(e.target) &&
    !burg.contains(e.target)
  ) {
    mob.classList.remove('open');
  }
});

/* ── Cerrar menú mobile con tecla Escape ── */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.getElementById('mobEl').classList.remove('open');
  }
});
