// ═══════════════════════════════════════════
//  actuadores.js — Control de actuadores
// ═══════════════════════════════════════════

import { log }      from './log.js';
import { publicar } from './mqtt.js';

// Estado actual de cada actuador (true = encendido, false = apagado)
const estado = {
  luz:    false,
  vent:   false,
  puerta: false,
  seg:    false,
};

// Configuración de cada actuador:
// tog    = id del toggle (interruptor visual)
// led    = id del LED indicador
// card   = id de la tarjeta del actuador
// st     = id del texto de estado (ej: "Encendido" / "Apagado")
// topic  = sufijo del topic MQTT donde se publica el comando
// labels = textos para estado apagado y encendido
const CONFIG = {
  luz: {
    tog: 'togLuz', led: 'ledLuz', card: 'cardALuz', st: 'stLuz',
    topic: 'control/luces',
    labels: ['Apagado', 'Encendido'],
  },
  vent: {
    tog: 'togVent', led: 'ledVent', card: 'cardAVent', st: 'stVent',
    topic: 'control/ventilador',
    labels: ['Apagado', 'Encendido'],
  },
  puerta: {
    tog: 'togPuerta', led: 'ledPuerta', card: 'cardAPuerta', st: 'stPuerta',
    topic: 'control/puerta',
    labels: ['Cerrada', 'Abierta'],
  },
  seg: {
    tog: 'togSeg', led: 'ledSeg', card: 'cardASeg', st: 'stSeg',
    topic: 'control/seguridad',
    labels: ['Desactivado', 'Activado'],
  },
};

// Actualiza visualmente la tarjeta de un actuador según su estado actual
function refrescarUI(key) {
  const cfg = CONFIG[key];
  const on  = estado[key]; // true o false

  // Cambiar clases CSS del toggle, LED y tarjeta para reflejar el estado
  document.getElementById(cfg.tog).className  = 'toggle'   + (on ? ' on' : '');
  document.getElementById(cfg.led).className  = 'act-led'  + (on ? ' on' : '');
  document.getElementById(cfg.card).className = 'act-card' + (on ? ' active' : '');

  // Cambiar el texto de estado
  const textoEstado = document.getElementById(cfg.st);
  textoEstado.textContent = cfg.labels[on ? 1 : 0]; // ej: "Encendido" o "Apagado"
  textoEstado.className   = 'act-status' + (on ? ' on' : '');
}

// Se llama cuando el usuario presiona un toggle en la dashboard
// key = 'luz', 'vent', 'puerta' o 'seg'
export function toggleActuador(key) {
  // Invertir el estado actual del actuador
  estado[key] = !estado[key];

  // Actualizar la interfaz visual
  refrescarUI(key);

  // Publicar el comando al ESP32 vía MQTT
  // '1' = encender, '0' = apagar
  const payload = estado[key] ? '1' : '0';
  publicar(CONFIG[key].topic, payload);
  log(`→ ${CONFIG[key].topic}: ${payload}`, 'ok');
}

// ── Botón de pánico ──────────────────────────────────────────
// Estado del pánico (false = desactivado)
let panicEncendido = false;

// Se llama cuando el usuario presiona el botón de pánico
// Activa o desactiva el buzzer manualmente sin depender de sensores
export function triggerPanic() {
  panicEncendido = !panicEncendido; // alternar estado

  // Cambiar apariencia del botón
  const btn = document.getElementById('panicBtn');
  btn.className   = 'panic-btn' + (panicEncendido ? ' active' : '');
  btn.textContent = panicEncendido
    ? '🔕 DESACTIVAR ALARMA'
    : '🚨 ACTIVAR ALARMA (PÁNICO)';

  // Publicar al topic del buzzer: '1' para activar, '0' para apagar
  const payload = panicEncendido ? '1' : '0';
  publicar('control/buzzer', payload);
  log(`→ control/buzzer: ${payload} [PÁNICO]`, panicEncendido ? 'err' : 'ok');
}
