fetch('data/forex.json')
  .then(response => response.json())
  .then(data => {
    document.getElementById('last-update').textContent = 
      `Última actualización: ${new Date(data.lastUpdate).toLocaleDateString('es-AR')}`;

    renderForexTrades(data.trades);
  })
  .catch(error => console.error('Error:', error));

function renderForexTrades(trades) {
  const container = document.getElementById('forex-trades');
  
  trades.forEach(trade => {
    const card = document.createElement('div');
    card.className = `forex-card ${trade.direction}`;
    
    const statusEmoji = trade.status === 'active' ? '🟢' : '🟡';
    
    card.innerHTML = `
      <div class="forex-header">
        <div class="forex-pair">${trade.pair}</div>
        <div class="forex-status">${statusEmoji} ${trade.status}</div>
      </div>
      
      <div class="forex-direction ${trade.direction}">
        ${trade.direction === 'long' ? '📈 LONG' : '📉 SHORT'}
      </div>
      
      <div class="forex-levels">
        <div class="level-group">
          <span class="level-label">Entry:</span>
          <span class="level-value">${trade.entry}</span>
        </div>
        <div class="level-group">
          <span class="level-label">Target:</span>
          <span class="level-value positive">${trade.target}</span>
        </div>
        <div class="level-group">
          <span class="level-label">Stop:</span>
          <span class="level-value negative">${trade.stop}</span>
        </div>
      </div>
      
      <div class="forex-meta">
        <span class="meta-item">R:R ${trade.rr}</span>
        <span class="meta-item">Risk: ${trade.risk}% equity</span>
        <span class="meta-item">TF: ${trade.timeframe}</span>
      </div>
      
      <div class="forex-rationale">
        <strong>Rationale:</strong> ${trade.rationale}
      </div>
    `;
    
    container.appendChild(card);
  });
}
