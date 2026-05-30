// ── Configuración de topics MQTT y actuadores ──
// Scripts clásicos: todo queda en el ámbito global compartido entre archivos.

const DEFAULT_PREFIX = 'casa/domotica';

// Constructores de topics a partir del prefijo
const T = {
  // Sensores (ESP32 → dashboard)
  temp:    p => `${p}/sensores/temperatura`,
  hum:     p => `${p}/sensores/humedad`,
  luz:     p => `${p}/sensores/luz`,
  dist:    p => `${p}/sensores/distancia`,
  gas:     p => `${p}/sensores/gas`,
  pir:     p => `${p}/sensores/pir`,
  // Control / comandos (dashboard → ESP32)
  cLuz:    p => `${p}/control/luces`,
  cVent:   p => `${p}/control/ventilador`,
  cPuerta: p => `${p}/control/puerta`,
  cSeg:    p => `${p}/control/seguridad`,
  cBuzz:   p => `${p}/control/buzzer`,
  // Estado real de los actuadores (ESP32 → dashboard)
  eLuz:    p => `${p}/estado/luces`,
  eVent:   p => `${p}/estado/ventilador`,
  ePuerta: p => `${p}/estado/puerta`,
  eSeg:    p => `${p}/estado/seguridad`,
  eBuzz:   p => `${p}/estado/buzzer`,
};

// Prefijo actual tomado del input (con valor por defecto)
const prefix = () =>
  document.getElementById('iPrefix').value.trim() || DEFAULT_PREFIX;

// Configuración de cada actuador: ids de UI, topic de control, topic de estado y etiquetas
const ACT_CFG = {
  luz:    { tog: 'togLuz',    led: 'ledLuz',    card: 'cardALuz',    st: 'stLuz',    topic: 'cLuz',    stateTopic: 'eLuz',    labels: ['Apagado', 'Encendido'] },
  vent:   { tog: 'togVent',   led: 'ledVent',   card: 'cardAVent',   st: 'stVent',   topic: 'cVent',   stateTopic: 'eVent',   labels: ['Apagado', 'Encendido'] },
  puerta: { tog: 'togPuerta', led: 'ledPuerta', card: 'cardAPuerta', st: 'stPuerta', topic: 'cPuerta', stateTopic: 'ePuerta', labels: ['Cerrada', 'Abierta']   },
  seg:    { tog: 'togSeg',    led: 'ledSeg',    card: 'cardASeg',    st: 'stSeg',    topic: 'cSeg',    stateTopic: 'eSeg',    labels: ['Desactivado', 'Activado'] },
};
