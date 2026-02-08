// Cargar datos de sectores
let sectorsData = [];

fetch('data/sectorial-rotation.json')
  .then(response => response.json())
  .then(data => {
    sectorsData = data.sectors;
    
    // Actualizar fecha
    document.getElementById('last-update').textContent = 
      `Última actualización: ${new Date(data.lastUpdate).toLocaleDateString('es-AR')}`;

    // Renderizar heatmap
    renderHeatmap('3m');
    
    // Renderizar tabla
    renderTable();
    
    // Event listeners
    setupEventListeners();
  })
  .catch(error => console.error('Error:', error));

function renderHeatmap(period) {
  const heatmap = document.getElementById('heatmap');
  heatmap.innerHTML = '';
  
  sectorsData.forEach(sector => {
    const value = sector.performance[period];
    const color = getHeatmapColor(value);
    
    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    cell.style.background = color;
    cell.innerHTML = `
      <div class="cell-ticker">${sector.ticker}</div>
      <div class="cell-value">${value > 0 ? '+' : ''}${value}%</div>
    `;
    
    heatmap.appendChild(cell);
  });
}

function getHeatmapColor(value) {
  // Escala de colores: rojo (-20%) a verde (+20%)
  const normalized = (value + 20) / 40; // 0 a 1
  const clamped = Math.max(0, Math.min(1, normalized));
  
  if (clamped < 0.5) {
    // Rojo a amarillo
    const r = 239;
    const g = Math.round(68 + (180 * clamped * 2));
    const b = 68;
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Amarillo a verde
    const r = Math.round(239 - (223 * (clamped - 0.5) * 2));
    const g = Math.round(180 + (5 * (clamped - 0.5) * 2));
    const b = 68 + Math.round(81 * (clamped - 0.5) * 2);
    return `rgb(${r}, ${g}, ${b})`;
  }
}

function renderTable(sortBy = '3m') {
  const tbody = document.getElementById('sectors-tbody');
  tbody.innerHTML = '';
  
  // Ordenar
  const sorted = [...sectorsData].sort((a, b) => 
    b.performance[sortBy] - a.performance[sortBy]
  );
  
  sorted.forEach(sector => {
    const row = document.createElement('tr');
    
    const rec = sector.recommendation;
    const recClass = rec === 'Comprar' ? 'buy' : rec === 'Hold' ? 'hold' : 'sell';
    const recEmoji = rec === 'Comprar' ? '🟢' : rec === 'Hold' ? '🟡' : '🔴';
    
    row.innerHTML = `
      <td><strong>${sector.name}</strong></td>
      <td><code>${sector.ticker}</code></td>
      <td>$${sector.price}</td>
      <td class="${sector.performance['1m'] >= 0 ? 'positive' : 'negative'}">
        ${sector.performance['1m'] > 0 ? '+' : ''}${sector.performance['1m']}%
      </td>
      <td class="${sector.performance['3m'] >= 0 ? 'positive' : 'negative'}">
        ${sector.performance['3m'] > 0 ? '+' : ''}${sector.performance['3m']}%
      </td>
      <td class="${sector.performance['6m'] >= 0 ? 'positive' : 'negative'}">
        ${sector.performance['6m'] > 0 ? '+' : ''}${sector.performance['6m']}%
      </td>
      <td>${sector.rsi}</td>
      <td><span class="rec-badge ${recClass}">${recEmoji} ${rec}</span></td>
    `;
    
    tbody.appendChild(row);
  });
}

function setupEventListeners() {
  // Tabs de heatmap
  document.querySelectorAll('.timeframe-tabs .tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.timeframe-tabs .tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      renderHeatmap(e.target.dataset.period);
    });
  });
  
  // Buscador
  document.getElementById('sector-search').addEventListener('input', (e) => {
    const search = e.target.value.toLowerCase();
    document.querySelectorAll('#sectors-tbody tr').forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(search) ? '' : 'none';
    });
  });
  
  // Sort
  document.getElementById('sort-by').addEventListener('change', (e) => {
    renderTable(e.target.value);
  });
}
