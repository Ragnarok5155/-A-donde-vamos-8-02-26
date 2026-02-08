// Cargar datos de riesgo
fetch('data/risk-dashboard.json')
  .then(response => response.json())
  .then(data => {
    // Actualizar fecha
    document.getElementById('last-update').textContent = 
      `Última actualización: ${new Date(data.lastUpdate).toLocaleDateString('es-AR')}`;

    // Actualizar gauges
    updateGauge('vix', data.volatility.vix);
    updateGauge('move', data.volatility.move);
    updateGauge('skew', data.volatility.skew);

    // Actualizar nivel de riesgo general
    const riskLevel = document.getElementById('risk-level');
    const riskEmojis = { low: '✅', moderate: '⚠️', high: '🔴' };
    riskLevel.querySelector('.risk-emoji').textContent = riskEmojis[data.overallRisk.level];
    riskLevel.querySelector('.risk-label').textContent = data.overallRisk.label;
    riskLevel.querySelector('.risk-desc').textContent = data.overallRisk.description;
  })
  .catch(error => console.error('Error cargando datos de riesgo:', error));

function updateGauge(id, data) {
  const gauge = document.getElementById(`gauge-${id}`);
  const fill = gauge.querySelector('.gauge-fill');
  const value = gauge.querySelector('.gauge-value');
  
  // Calcular porcentaje para la barra
  const percentage = (data.value / data.max) * 100;
  fill.style.width = percentage + '%';
  value.textContent = data.value;
  
  // Color según zona
  if (data.value < data.zones.safe) {
    fill.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
  } else if (data.value < data.zones.warning) {
    fill.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
  } else {
    fill.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
  }
}
