//  sensores.js — Actualiza la UI de sensores

import { addChartPoint } from './chart.js';

// Umbrales para mostrar alerta visual en la tarjeta
const UMBRAL_TEMP = 28;   // °C — si supera esto, la tarjeta se pone roja
const UMBRAL_GAS  = 300;  // ppm — si supera esto, la tarjeta se pone roja

// Guardamos los últimos valores de temp y hum para enviarlos  a la gráfica
const actual = { temp: null, hum: null };

// Función interna: actualiza el número y la barra de progreso de un sensor

// Variables Requeridas
// valorId = id del elemento HTML donde se muestra el número
// valor   = dato recibido del ESP32
// unidad  = texto de la unidad (°C, %, cm, ppm)
// barraId = id de la barra de progreso (null si no tiene)
// maximo  = valor máximo para calcular el % de la barra

function actualizarTarjeta(valorId, valor, unidad, barraId, maximo) {
  // Mostrar el número en pantalla
  document.getElementById(valorId).innerHTML =
    valor + `<span class="s-unit"> ${unidad}</span>`;

  // Calcular y actualizar el ancho de la barra de progreso
  if (barraId) {
    const porcentaje = Math.min(100, (parseFloat(valor) / maximo) * 100).toFixed(1);
    document.getElementById(barraId).style.width = porcentaje + '%';
  }
}

// Actualiza la tarjeta de temperatura

export function actualizarTemperatura(valor) {
  actualizarTarjeta('vTemp', parseFloat(valor).toFixed(1), '°C', 'bTemp', 50);

  // Alerta si la temperatura es muy alta
  document.getElementById('cardTemp').className =
    'sensor-card' + (parseFloat(valor) > UMBRAL_TEMP ? ' alert' : '');

  // Guardar valor actual y actualizar gráfica según temp y hum
  actual.temp = parseFloat(valor);
  if (actual.temp !== null && actual.hum !== null) {
    addChartPoint(actual.temp, actual.hum);
  }
}

// Actualiza la tarjeta de humedad
export function actualizarHumedad(valor) {
  actualizarTarjeta('vHum', parseFloat(valor).toFixed(1), '%', 'bHum', 100);

  // Guardar valor actual y actualizar gráfica según temp y hum
  actual.hum = parseFloat(valor);
  if (actual.temp !== null && actual.hum !== null) {
    addChartPoint(actual.temp, actual.hum);
  }
}

// Actualiza la tarjeta de luz - LDR
export function actualizarLuz(valor) {
  actualizarTarjeta('vLuz', parseFloat(valor).toFixed(0), '%', 'bLuz', 100);
}

// Actualiza la tarjeta de distancia - HC-SR04
export function actualizarDistancia(valor) {
  actualizarTarjeta('vDist', parseFloat(valor).toFixed(0), 'cm', 'bDist', 200);
}

// Actualiza la tarjeta de gas MQ-2

export function actualizarGas(valor) {
  actualizarTarjeta('vGas', parseFloat(valor).toFixed(0), 'ppm', 'bGas', 1000);

  // Alerta  si hay demasiado gas
  document.getElementById('cardGas').className =
    'sensor-card' + (parseFloat(valor) > UMBRAL_GAS ? ' alert' : '');
}

// Actualiza el sensor movimiento - PIR

// '1' si hay movimiento ó '0' si no

export function actualizarPir(valor) {
  const hayMovimiento = valor === '1';
  const badge = document.getElementById('pirBadge');

  badge.textContent = hayMovimiento ? '⬤ ¡Movimiento detectado!' : '⬤ Sin movimiento';
  badge.className   = 'pir-badge' + (hayMovimiento ? ' active' : ''); // rojo si hay movimiento
}
