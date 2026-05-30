// ── Actuadores y alarma de pánico ──
// Depende de config.js (T, prefix, ACT_CFG), state.js (state),
// logger.js (log) y mqtt.js (publish), todos globales.
//
// Separamos "pintar la UI" (render*) de "enviar comando" (toggle*/trigger*):
// así el estado real que publica el ESP32 (estado/*) puede reflejarse en los
// toggles sin volver a publicar y sin crear bucles.

// Pinta en la UI el estado de un actuador (NO publica nada).
function renderActuator(key, on) {
  state.actuators[key] = on;
  const cfg = ACT_CFG[key];
  document.getElementById(cfg.tog).className = 'toggle' + (on ? ' on' : '');
  document.getElementById(cfg.led).className = 'act-led' + (on ? ' on' : '');
  document.getElementById(cfg.card).className = 'act-card' + (on ? ' active' : '');
  const stEl = document.getElementById(cfg.st);
  stEl.textContent = cfg.labels[on ? 1 : 0];
  stEl.className = 'act-status' + (on ? ' on' : '');
}

// Pinta en la UI el estado del botón de pánico (NO publica nada).
function renderPanic(on) {
  state.panicOn = on;
  const btn = document.getElementById('panicBtn');
  btn.className = 'panic-btn' + (on ? ' active' : '');
  btn.textContent = on ? '🔕 DESACTIVAR ALARMA' : '🚨 ACTIVAR ALARMA (PÁNICO)';
}

// Clic del usuario en un toggle: alterna y publica un override manual al ESP32.
function toggleAct(key) {
  const on = !state.actuators[key];
  renderActuator(key, on);

  const topic = T[ACT_CFG[key].topic](prefix());
  const payload = on ? '1' : '0';
  if (publish(topic, payload)) {
    log(`→ ${topic}: ${payload}`, 'ok');
  } else {
    log(`[sin conexión] ${topic}: ${payload}`, 'warn');
  }
}

// Clic en el botón de pánico: alterna y publica el comando del buzzer.
function triggerPanic() {
  const on = !state.panicOn;
  renderPanic(on);

  const topic = T.cBuzz(prefix());
  const payload = on ? '1' : '0';
  if (publish(topic, payload)) {
    log(`→ ${topic}: ${payload} [PÁNICO]`, on ? 'err' : 'ok');
  } else {
    log(`[sin conexión] Buzzer pánico: ${payload}`, 'warn');
  }
}

// Devuelve los actuadores al control automático del ESP32 (envía "auto").
// La seguridad es un modo del usuario, así que no se incluye.
function volverAutomatico() {
  const pf = prefix();
  const topics = [T.cLuz(pf), T.cVent(pf), T.cPuerta(pf), T.cBuzz(pf)];
  topics.forEach(topic => {
    if (publish(topic, 'auto')) log(`→ ${topic}: auto`, 'ok');
    else log(`[sin conexión] ${topic}: auto`, 'warn');
  });
}

// Refleja el estado REAL recibido del ESP32 (topics estado/*). No publica.
function handleStateMessage(topic, value) {
  const pf = prefix();
  const on = value === '1';

  for (const key of Object.keys(ACT_CFG)) {
    if (topic === T[ACT_CFG[key].stateTopic](pf)) {
      renderActuator(key, on);
      return;
    }
  }
  if (topic === T.eBuzz(pf)) renderPanic(on);
}
