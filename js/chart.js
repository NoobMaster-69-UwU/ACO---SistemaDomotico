// ── Gráfica de temperatura y humedad ──
// Usa Chart.js, cargado globalmente desde CDN en el HTML.
/* global Chart */

const chartLabels = [];
const chartTemp = [];
const chartHum = [];

let chart = null;

// Crea la gráfica sobre el canvas #chartTH. Llamar una vez al iniciar.
function initChart() {
  const ctx = document.getElementById('chartTH').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: 'Temperatura (°C)',
          data: chartTemp,
          borderColor: '#f97316',
          backgroundColor: '#f9731620',
          tension: 0.4,
          pointRadius: 3,
          fill: true,
        },
        {
          label: 'Humedad (%)',
          data: chartHum,
          borderColor: '#38bdf8',
          backgroundColor: '#38bdf820',
          tension: 0.4,
          pointRadius: 3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#94a3b8', font: { size: 12 } } },
      },
      scales: {
        x: { ticks: { color: '#475569' }, grid: { color: '#1e293b' } },
        y: { ticks: { color: '#475569' }, grid: { color: '#1e293b' } },
      },
    },
  });
}

// Agrega un punto (temperatura, humedad) y mantiene solo los últimos 20.
function addChartPoint(t, h) {
  const ts = new Date().toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  chartLabels.push(ts);
  chartTemp.push(parseFloat(t));
  chartHum.push(parseFloat(h));
  if (chartLabels.length > 20) {
    chartLabels.shift();
    chartTemp.shift();
    chartHum.shift();
  }
  chart.update();
}
