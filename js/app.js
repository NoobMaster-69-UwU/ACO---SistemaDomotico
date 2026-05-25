//  Se unen todos los módulos y expone las funciones que necesita el HTML en los atributos onclick de los botones.


import { initChart }                    from './chart.js';
import { toggleConnect }                from './mqtt.js';
import { toggleActuador, triggerPanic } from './actuadores.js';

// Cuando la página termina de cargar, inicializar la gráfica
document.addEventListener('DOMContentLoaded', () => {
  initChart();
});

// Exponer funciones al scope global (window) para que los
// onclick del HTML puedan llamarlas directamente
// Esto es necesario porque los módulos ES tienen scope privado
window.toggleConnect = toggleConnect;   // botón Conectar/Desconectar
window.toggleAct     = toggleActuador;  // toggles de luces, ventilador, puerta, seguridad
window.triggerPanic  = triggerPanic;    // botón de pánico
