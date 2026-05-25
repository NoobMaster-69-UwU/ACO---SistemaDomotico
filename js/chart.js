// ═══════════════════════════════════════════
//  chart.js — Gráfica de temperatura y humedad
// ═══════════════════════════════════════════

// Arreglos que guardan los datos históricos de la gráfica
const etiquetas = [];   // horas (eje X)
const datosTemp = [];   // valores de temperatura
const datosHum  = [];   // valores de humedad

// Variable que guarda la instancia de la gráfica
let graficaInstancia = null;

// Crea e inicializa la gráfica en el canvas del HTML
// Se llama una sola vez al cargar la página
export function initChart() {
  const ctx = document.getElementById('chartTH').getContext('2d');

  graficaInstancia = new Chart(ctx, {
    type: 'line', // gráfica de líneas
    data: {
      labels: etiquetas,
      datasets: [
        {
          label: 'Temperatura (°C)',
          data: datosTemp,
          borderColor: '#f97316',        // línea naranja
          backgroundColor: '#f9731620', // relleno semitransparente
          tension: 0.4,                 // curva suave
          pointRadius: 3,
          fill: true,
        },
        {
          label: 'Humedad (%)',
          data: datosHum,
          borderColor: '#38bdf8',        // línea azul
          backgroundColor: '#38bdf820',
          tension: 0.4,
          pointRadius: 3,
          fill: true,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#94a3b8', font: { size: 12 } } }
      },
      scales: {
        x: { ticks: { color: '#475569' }, grid: { color: '#1e293b' } },
        y: { ticks: { color: '#475569' }, grid: { color: '#1e293b' } }
      }
    }
  });
}

// Agrega un nuevo punto a la gráfica cada vez que llega un dato de temp o humedad
export function addChartPoint(temp, hum) {
  // Guardar la hora actual como etiqueta del eje X
  const hora = new Date().toLocaleTimeString('es-SV', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  etiquetas.push(hora);
  datosTemp.push(parseFloat(temp));
  datosHum.push(parseFloat(hum));

  // Mantener solo los últimos 20 puntos para que la gráfica no se llene
  if (etiquetas.length > 20) {
    etiquetas.shift();
    datosTemp.shift();
    datosHum.shift();
  }

  // Redibujar la gráfica con los nuevos datos
  graficaInstancia.update();
}
