// ── Estado compartido de la aplicación ──
// Objeto único mutado por referencia desde el resto de archivos.
const state = {
  client: null,          // instancia del cliente MQTT
  connected: false,      // ¿hay conexión activa?
  panicOn: false,        // ¿alarma de pánico activada?
  actuators: {           // estado de cada actuador
    luz: false,
    vent: false,
    puerta: false,
    seg: false,
  },
};
