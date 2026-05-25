//  mqtt.js — Conexión y mensajes MQTT


import { log } from './log.js';
import {
  actualizarTemperatura,
  actualizarHumedad,
  actualizarLuz,
  actualizarDistancia,
  actualizarGas,
  actualizarPir,
} from './sensores.js';

// Cliente MQTT y estado de conexión
let cliente   = null;
let conectado = false;

// Lee el prefix actual del input en la UI (ej: "casa/domotica")
function getPrefix() {
  return document.getElementById('iPrefix').value.trim() || 'casa/domotica';
}

// Actualiza los elementos visuales de conexión en el header
function actualizarEstadoUI(conn) {
  conectado = conn;

  // Punto verde/rojo en el header
  document.getElementById('dot').className = 'dot' + (conn ? ' on' : '');

  // Texto "Conectado" / "Desconectado"
  document.getElementById('statusTxt').textContent = conn ? 'Conectado' : 'Desconectado';

  // Cambiar texto y color del botón
  const btn = document.getElementById('btnConn');
  btn.textContent = conn ? 'Desconectar' : 'Conectar';
  btn.className   = 'btn-connect' + (conn ? ' disc' : '');
}

// Publica un mensaje al broker MQTT

export function publicar(topicSufijo, payload) {
  const topic = `${getPrefix()}/${topicSufijo}`; // topic completo

  if (conectado && cliente) {
    // retain:true hace que el broker recuerde el último valor
    cliente.publish(topic, payload, { retain: true });
  } else {
    log(`[sin conexión] ${topic}: ${payload}`, 'warn');
  }
}

// Conecta o desconecta del broker según el estado actual

export function toggleConnect() {
  // Si ya está conectado, desconectar
  if (conectado) {
    if (cliente) cliente.end();
    actualizarEstadoUI(false);
    log('Desconectado del broker.', 'warn');
    return;
  }

  // Leer configuración del broker desde los inputs del HTML
  const broker = document.getElementById('iBroker').value.trim();
  const puerto = parseInt(document.getElementById('iPort').value.trim()) || 8884;

  // Construir URL de conexión WebSocket seguro (wss://)

  const url = `wss://${broker}:${puerto}/mqtt`;
  log(`Conectando a ${url}...`);

  try {
    // Crear cliente MQTT con ID único para evitar conflictos en el broker
    cliente = mqtt.connect(url, {
      clientId: 'dashboard_' + Math.random().toString(16).slice(2),
      clean: true,        // sesión limpia sin mensajes pendientes
      reconnectPeriod: 0, 
    });

    // Evento: conexión exitosa al broker
    cliente.on('connect', () => {
      actualizarEstadoUI(true);
      log('✅ Conectado al broker MQTT.', 'ok');

      // Suscribirse a todos los topics de sensores del ESP32
      const pf   = getPrefix();
      const subs = [
        `${pf}/sensores/temperatura`,
        `${pf}/sensores/humedad`,
        `${pf}/sensores/luz`,
        `${pf}/sensores/distancia`,
        `${pf}/sensores/gas`,
        `${pf}/sensores/pir`,
      ];

      cliente.subscribe(subs, err => {
        if (!err) log('Suscrito a todos los topics de sensores.', 'ok');
        else      log('Error al suscribirse: ' + err.message, 'err');
      });
    });

    // Evento: llega un mensaje de algún topic suscrito
    cliente.on('message', (topic, mensaje) => {
      const pf  = getPrefix();
      const val = mensaje.toString(); // convertir bytes a texto

      // Mostrar en el log (sin el prefix para que sea más corto)
      log(`← ${topic.replace(pf + '/', '')}: ${val}`);

      // Llamar a la función correcta según el topic recibido
      if (topic === `${pf}/sensores/temperatura`) actualizarTemperatura(val);
      if (topic === `${pf}/sensores/humedad`)     actualizarHumedad(val);
      if (topic === `${pf}/sensores/luz`)         actualizarLuz(val);
      if (topic === `${pf}/sensores/distancia`)   actualizarDistancia(val);
      if (topic === `${pf}/sensores/gas`)         actualizarGas(val);
      if (topic === `${pf}/sensores/pir`)         actualizarPir(val);
    });

    // Evento: error de conexión (ej: broker no disponible)
    cliente.on('error', e => {
      log('Error de conexión: ' + e.message, 'err');
      actualizarEstadoUI(false);
    });

    // Evento: conexión cerrada inesperadamente
    cliente.on('close', () => {
      if (conectado) {
        log('Conexión cerrada inesperadamente.', 'warn');
        actualizarEstadoUI(false);
      }
    });

  } catch (e) {
    log('No se pudo conectar: ' + e.message, 'err');
  }
}
