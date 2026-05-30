// ── Punto de entrada ──
// Inicializa la gráfica y conecta los eventos de la interfaz.
// Debe cargarse el último (depende de todos los demás archivos).

function init() {
  initChart();

  // Conexión MQTT
  document.getElementById('btnConn').addEventListener('click', toggleConnect);

  // Botón de pánico
  document.getElementById('panicBtn').addEventListener('click', triggerPanic);

  // Volver al control automático del ESP32
  document.getElementById('btnAuto').addEventListener('click', volverAutomatico);

  // Un listener por cada toggle de actuador
  Object.keys(ACT_CFG).forEach(key => {
    document.getElementById(ACT_CFG[key].tog).addEventListener('click', () => toggleAct(key));
  });
}

// Los scripts usan "defer", así que el DOM ya está disponible al ejecutarse.
init();
