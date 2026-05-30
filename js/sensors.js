// ── Sensores: actualización de la UI ──
// Depende de config.js (T, prefix) y chart.js (addChartPoint), globales.

// Actualiza el valor mostrado y la barra de progreso de un sensor.
function setSensor(id, val, unit, barId, max) {
  document.getElementById(id).innerHTML = val + `<span class="s-unit"> ${unit}</span>`;
  if (barId) {
    const pct = Math.min(100, (parseFloat(val) / max) * 100).toFixed(1);
    document.getElementById(barId).style.width = pct + '%';
  }
}

// Procesa un mensaje entrante de sensores y refleja el valor en la UI.
function handleSensorMessage(topic, value) {
  const pf = prefix();

  if (topic === T.temp(pf)) {
    setSensor('vTemp', parseFloat(value).toFixed(1), '°C', 'bTemp', 50);
    // Alerta por temperatura alta
    document.getElementById('cardTemp').className = 'sensor-card' + (parseFloat(value) > 28 ? ' alert' : '');
  }
  if (topic === T.hum(pf))  setSensor('vHum',  parseFloat(value).toFixed(1), '%',  'bHum',  100);
  if (topic === T.luz(pf))  setSensor('vLuz',  parseFloat(value).toFixed(0), '%',  'bLuz',  100);
  if (topic === T.dist(pf)) setSensor('vDist', parseFloat(value).toFixed(0), 'cm', 'bDist', 200);
  if (topic === T.gas(pf)) {
    setSensor('vGas', parseFloat(value).toFixed(0), 'ppm', 'bGas', 1000);
    // Alerta por nivel de gas alto
    document.getElementById('cardGas').className = 'sensor-card' + (parseFloat(value) > 300 ? ' alert' : '');
  }
  if (topic === T.pir(pf)) {
    const det = value === '1';
    const badge = document.getElementById('pirBadge');
    badge.textContent = det ? '⬤ ¡Movimiento detectado!' : '⬤ Sin movimiento';
    badge.className = 'pir-badge' + (det ? ' active' : '');
  }

  // Actualizar la gráfica cuando llega temperatura o humedad
  if (topic === T.temp(pf) || topic === T.hum(pf)) {
    const tVal = parseFloat(document.getElementById('vTemp').textContent);
    const hVal = parseFloat(document.getElementById('vHum').textContent);
    if (!isNaN(tVal) && !isNaN(hVal)) addChartPoint(tVal, hVal);
  }
}
