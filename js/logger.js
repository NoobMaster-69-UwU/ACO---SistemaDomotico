// ── Sistema de log en pantalla ──
// Escribe una línea con marca de tiempo en el contenedor #logBox.
// type: 'info' | 'ok' | 'warn' | 'err' (controla el color vía CSS)
function log(msg, type = 'info') {
  const box = document.getElementById('logBox');
  const d = document.createElement('div');
  d.className = 'log-entry ' + type;
  const ts = new Date().toLocaleTimeString('es-SV');
  d.textContent = `[${ts}] ${msg}`;
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
  // Limita el historial a 80 líneas
  if (box.children.length > 80) box.removeChild(box.children[0]);
}
