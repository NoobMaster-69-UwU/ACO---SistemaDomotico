// ═══════════════════════════════════════════
//  log.js — Muestra mensajes en la pantalla
// ═══════════════════════════════════════════

// Esta función agrega una línea al cuadro de log en la interfaz
// msg  = el texto a mostrar
// type = color del mensaje: 'ok' (verde), 'warn' (amarillo), 'err' (rojo), 'info' (gris)
export function log(msg, type = 'info') {
  const box = document.getElementById('logBox'); // cuadro de log en el HTML

  // Crear una nueva línea de texto
  const linea = document.createElement('div');
  linea.className = 'log-entry ' + type;

  // Agregar la hora actual al inicio del mensaje
  const hora = new Date().toLocaleTimeString('es-SV');
  linea.textContent = `[${hora}] ${msg}`;

  // Insertar la línea al final del cuadro
  box.appendChild(linea);

  // Hacer scroll automático hacia abajo para ver el último mensaje
  box.scrollTop = box.scrollHeight;

  // Si hay más de 80 líneas, borrar la más antigua para no llenar la pantalla
  if (box.children.length > 80) box.removeChild(box.children[0]);
}
