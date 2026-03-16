/* ═══════════════════════════════════════
   form.js — FAQ toggle y formulario de contacto
   Rupta Studios
═══════════════════════════════════════ */

/* ── FAQ: abrir / cerrar items ── */
function toggleFaq(btn) {
  const item   = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');

  /* Cerrar todos primero */
  document.querySelectorAll('.faq-item.open').forEach(function(i) {
    i.classList.remove('open');
  });

  /* Abrir el clickeado si estaba cerrado */
  if (!isOpen) item.classList.add('open');
}

/* ── Formulario: construir mensaje y abrir WhatsApp ── */
function sendForm() {
  const name    = document.getElementById('fn').value.trim();
  const email   = document.getElementById('fe').value.trim();
  const service = document.getElementById('fs').value;
  const message = document.getElementById('fm').value.trim();

  if (!name || !email) {
    alert('Por favor completa tu nombre y email.');
    return;
  }

  const parts = ['Hola, soy ' + name + ' (' + email + ').'];
  if (service) parts.push('Servicio: ' + service + '.');
  parts.push(message || 'Quisiera más información.');

  const text = encodeURIComponent(parts.join(' '));
  window.open('https://wa.me/50767997259?text=' + text, '_blank');

  /* Mostrar confirmación */
  const box = document.getElementById('fbox');
  if (box) {
    box.innerHTML = [
      '<div class="form-ok">',
      '  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
      '  <h3>¡Listo!</h3>',
      '  <p>Te redirigimos a WhatsApp para continuar.</p>',
      '</div>'
    ].join('');
  }
}
