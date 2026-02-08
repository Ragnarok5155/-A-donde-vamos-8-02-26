let portfolioData = {};

fetch('data/portfolio-stocks.json')
  .then(response => response.json())
  .then(data => {
    portfolioData = data;
    
    document.getElementById('last-update').textContent = 
      `Última actualización: ${new Date(data.lastUpdate).toLocaleDateString('es-AR')}`;

    // Renderizar todo
    renderSummary();
    renderSectorAllocation();
    renderHoldings();
    renderContributors();
    renderTransactions();
    setupFilters();
  })
  .catch(error => console.error('Error:', error));

function renderSummary() {
  const summary = portfolioData.summary;
  document.getElementById('perf-ytd').textContent = 
    (summary.perfYTD > 0 ? '+' : '') + summary.perfYTD.toFixed(1) + '%';
  document.getElementById('perf-12m').textContent = 
    (summary.perf12M > 0 ? '+' : '') + summary.perf12M.toFixed(1) + '%';
}

function renderSectorAllocation() {
  const sectors = portfolioData.sectorAllocation;
  const container = document.getElementById('sector-allocation');
  const legend = document.getElementById('sector-legend');
  
  const colors = {
    'Materials': '#f59e0b',
    'Defense': '#10b981',
    'Energy': '#ef4444',
    'Industrials': '#6366f1',
    'Healthcare': '#ec4899',
    'Tech': '#3b82f6',
    'Staples': '#14b8a6',
    'Other': '#9ca3af'
  };
  
  // Crear barra
  let html = '<div class="alloc-bar">';
  sectors.forEach(sector => {
    html += `<div class="alloc-segment" style="width: ${sector.percent}%; background: ${colors[sector.name]}" 
             title="${sector.name}: ${sector.percent}%"></div>`;
  });
  html += '</div>';
  container.innerHTML = html;
  
  // Crear leyenda
  let legendHtml = '';
  sectors.forEach(sector => {
    legendHtml += `
      <div class="legend-item">
        <div class="legend-color" style="background: ${colors[sector.name]}"></div>
        <span class="legend-label">${sector.name}</span>
        <span class="legend-value">${sector.percent}%</span>
      </div>
    `;
  });
  legend.innerHTML = legendHtml;
}

function renderHoldings() {
  const tbody = document.getElementById('holdings-tbody');
  const holdings = portfolioData.holdings;
  
  holdings.forEach(holding => {
    const row = document.createElement('tr');
    row.className = holding.plPercent >= 0 ? 'winner' : 'loser';
    row.dataset.ticker = holding.ticker;
    
    const plClass = holding.pl >= 0 ? 'positive' : 'negative';
    
    row.innerHTML = `
      <td><strong>${holding.ticker}</strong></td>
      <td>${holding.name}</td>
      <td><span class="sector-tag">${holding.sector}</span></td>
      <td class="right">${holding.shares.toLocaleString()}</td>
      <td class="right">$${holding.avgCost.toFixed(2)}</td>
      <td class="right">$${holding.currentPrice.toFixed(2)}</td>
      <td class="right">$${holding.value.toLocaleString()}</td>
      <td class="right">${holding.weight.toFixed(1)}%</td>
      <td class="right ${plClass}">$${holding.pl.toLocaleString()}</td>
      <td class="right ${plClass}">${holding.plPercent > 0 ? '+' : ''}${holding.plPercent.toFixed(1)}%</td>
    `;
    
    tbody.appendChild(row);
  });
}

function renderContributors() {
  const winners = portfolioData.topContributors.winners;
  const losers = portfolioData.topContributors.losers;
  
  const winnersContainer = document.getElementById('top-winners');
  winners.forEach((w, i) => {
    const card = document.createElement('div');
    card.className = 'contrib-card winner';
    card.innerHTML = `
      <div class="contrib-rank">#${i+1}</div>
      <div class="contrib-info">
        <div class="contrib-ticker">${w.ticker}</div>
        <div class="contrib-pl positive">+$${w.pl.toLocaleString()} (+${w.plPercent}%)</div>
      </div>
    `;
    winnersContainer.appendChild(card);
  });
  
  const losersContainer = document.getElementById('top-losers');
  losers.forEach((l, i) => {
    const card = document.createElement('div');
    card.className = 'contrib-card loser';
    card.innerHTML = `
      <div class="contrib-rank">#${i+1}</div>
      <div class="contrib-info">
        <div class="contrib-ticker">${l.ticker}</div>
        <div class="contrib-pl negative">$${l.pl.toLocaleString()} (${l.plPercent}%)</div>
      </div>
    `;
    losersContainer.appendChild(card);
  });
}

function renderTransactions() {
  const tbody = document.getElementById('transactions-tbody');
  const transactions = portfolioData.recentTransactions;
  
  transactions.forEach(tx => {
    const row = document.createElement('tr');
    const actionClass = tx.action === 'BUY' ? 'buy' : 'sell';
    
    row.innerHTML = `
      <td>${tx.date}</td>
      <td><span class="action-badge ${actionClass}">${tx.action}</span></td>
      <td><strong>${tx.ticker}</strong></td>
      <td class="right">${tx.shares.toLocaleString()}</td>
      <td class="right">$${tx.price.toFixed(2)}</td>
      <td class="right">$${tx.value.toLocaleString()}</td>
      <td>${tx.rationale}</td>
    `;
    
    tbody.appendChild(row);
  });
}

function setupFilters() {
  // Filtros de botones
  document.querySelectorAll('.btn-filter').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      const filter = e.target.dataset.filter;
      document.querySelectorAll('#holdings-tbody tr').forEach(row => {
        if (filter === 'all') {
          row.style.display = '';
        } else if (filter === 'winners') {
          row.style.display = row.classList.contains('winner') ? '' : 'none';
        } else if (filter === 'losers') {
          row.style.display = row.classList.contains('loser') ? '' : 'none';
        }
      });
    });
  });
  
  // Búsqueda
  document.getElementById('holdings-search').addEventListener('input', (e) => {
    const search = e.target.value.toLowerCase();
    document.querySelectorAll('#holdings-tbody tr').forEach(row => {
      const ticker = row.dataset.ticker.toLowerCase();
      row.style.display = ticker.includes(search) ? '' : 'none';
    });
  });

  // Cargar gráfico de performance
fetch('data/portfolio-performance.json')
  .then(response => response.json())
  .then(data => {
    ChartBuilder.createLineChart('portfolio-performance-chart', {
      labels: data.dates,
      datasets: [
        {
          label: 'Mi Portfolio',
          data: data.portfolio,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 3
        },
        {
          label: 'S&P 500',
          data: data.spy,
          borderColor: '#9ca3af',
          backgroundColor: 'transparent',
          tension: 0.4,
          borderWidth: 2,
          borderDash: [5, 5]
        }
      ]
    }, {
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': +' + context.parsed.y.toFixed(1) + '%';
            }
          }
        }
      },
      scales: {
        y: {
          grid: { color: '#374151' },
          ticks: { 
            color: '#9ca3af',
            callback: function(value) {
              return '+' + value + '%';
            }
          }
        },
        x: {
          grid: { display: false },
          ticks: { 
            color: '#9ca3af',
            maxTicksLimit: 10
          }
        }
      }
    });
  });
}
