// Cargar datos del JSON
fetch('data/market-pulse.json')
  .then(response => response.json())
  .then(data => {
    // Actualizar fecha
    document.getElementById('last-update').textContent = 
      `Última actualización: ${new Date(data.lastUpdate).toLocaleDateString('es-AR')}`;

    // Actualizar régimen
    const regimeEmojis = { green: '🟢', yellow: '🟡', red: '🔴' };
    document.querySelector('.regime .emoji').textContent = regimeEmojis[data.regime.color];
    document.querySelector('.regime .label').textContent = data.regime.label;
    document.getElementById('regime-desc').textContent = data.regime.description;
    document.getElementById('regime-action').textContent = data.regime.action;

    // Actualizar indicadores
    const indicators = {
      'vix': data.indicators.find(i => i.name === 'VIX'),
      'hy': data.indicators.find(i => i.name === 'HY OAS'),
      'dxy': data.indicators.find(i => i.name === 'DXY')
    };

    Object.keys(indicators).forEach(key => {
      const ind = indicators[key];
      if (ind) {
        document.getElementById(`${key}-value`).textContent = 
          ind.value + (ind.unit || '');
        const changeEl = document.getElementById(`${key}-change`);
        changeEl.textContent = ind.change;
        changeEl.className = 'change ' + (ind.trend === 'down' ? 'negative' : '');
      }
    });

    // Cargar recomendaciones
    const recList = document.getElementById('recommendations-list');
    data.topRecommendations.forEach(rec => {
      const statusEmojis = { buy: '🟢', hold: '🟡', sell: '🔴' };
      
      const card = document.createElement('div');
      card.className = 'recommendation-card';
      card.innerHTML = `
        <div class="rec-header">
          <div class="rec-left">
            <div class="rec-emoji">${statusEmojis[rec.status]}</div>
            <div>
              <div class="rec-title">${rec.ticker} - ${rec.name}</div>
              <div class="rec-meta">
                Entry: ${rec.entry} | Stop: ${rec.stop} | Size: ${rec.size}
              </div>
            </div>
          </div>
          <div class="rec-right">
            <div class="rec-price">$${rec.price}</div>
            <div class="rec-target">
              Target: $${rec.target}
              ${rec.upside ? `<span>(${rec.upside})</span>` : ''}
            </div>
          </div>
        </div>
        <div class="rec-thesis">└─ ${rec.thesis}</div>
      `;
      
      recList.appendChild(card);
    });
  })
  .catch(error => console.error('Error cargando datos:', error));
