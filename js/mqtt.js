// ── Conexión y mensajería MQTT ──
// La librería mqtt se carga globalmente desde CDN en el HTML.
// Depende de config.js (T, prefix), state.js (state), logger.js (log)
// y sensors.js (handleSensorMessage), todos globales.
/* global mqtt */

// Publica en un topic si hay conexión. Devuelve true si se publicó.
function publish(topic, payload) {
  if (state.connected && state.client) {
    state.client.publish(topic, payload, { retain: true });
    return true;
  }
  return false;
}

// Refleja el estado de conexión en la UI.
function setStatus(conn) {
  state.connected = conn;
  document.getElementById('dot').className = 'dot' + (conn ? ' on' : '');
  document.getElementById('statusTxt').textContent = conn ? 'Conectado' : 'Desconectado';
  const btn = document.getElementById('btnConn');
  btn.textContent = conn ? 'Desconectar' : 'Conectar';
  btn.className = 'btn-connect' + (conn ? ' disc' : '');
}

// Conecta o desconecta del broker según el estado actual.
function toggleConnect() {
  if (state.connected) {
    if (state.client) state.client.end();
    setStatus(false);
    log('Desconectado del broker.', 'warn');
    return;
  }

  const broker = document.getElementById('iBroker').value.trim();
  const port = parseInt(document.getElementById('iPort').value.trim()) || 8884;
  const url = `wss://${broker}:${port}/mqtt`;

  log(`Conectando a ${url}...`);

  try {
    state.client = mqtt.connect(url, {
      clientId: 'dashboard_' + Math.random().toString(16).slice(2),
      clean: true,
      reconnectPeriod: 0,
    });

    state.client.on('connect', () => {
      setStatus(true);
      log('✅ Conectado al broker MQTT.', 'ok');

      const pf = prefix();
      const subs = [
        // sensores
        T.temp(pf), T.hum(pf), T.luz(pf), T.dist(pf), T.gas(pf), T.pir(pf),
        // estado real de los actuadores
        T.eLuz(pf), T.eVent(pf), T.ePuerta(pf), T.eSeg(pf), T.eBuzz(pf),
      ];
      state.client.subscribe(subs, err => {
        if (!err) log('Suscrito a sensores y estado de actuadores.', 'ok');
        else log('Error al suscribirse: ' + err.message, 'err');
      });
    });

    state.client.on('message', (topic, msg) => {
      const pf = prefix();
      const v = msg.toString();
      log(`← ${topic.replace(pf + '/', '')}: ${v}`);
      handleSensorMessage(topic, v);   // sensores/*
      handleStateMessage(topic, v);    // estado/*  (refleja actuadores)
    });

    state.client.on('error', e => {
      log('Error: ' + e.message, 'err');
      setStatus(false);
    });

    state.client.on('close', () => {
      if (state.connected) {
        log('Conexión cerrada.', 'warn');
        setStatus(false);
      }
    });
  } catch (e) {
    log('No se pudo conectar: ' + e.message, 'err');
  }
}
