let stocksData = [];

fetch('data/stock-picks.json')
  .then(response => response.json())
  .then(data => {
    stocksData = data.stocks;
    
    document.getElementById('last-update').textContent = 
      `Última actualización: ${new Date(data.lastUpdate).toLocaleDateString('es-AR')}`;

    renderStocksTable();
    renderTopPicks();
    setupFilters();
  })
  .catch(error => console.error('Error:', error));

function renderStocksTable(filtered = null) {
  const tbody = document.getElementById('stocks-tbody');
  tbody.innerHTML = '';
  
  const stocks = filtered || stocksData;
  
  stocks.forEach(stock => {
    const row = document.createElement('tr');
    const upsideClass = stock.upside > 20 ? 'high-upside' : stock.upside > 10 ? 'mid-upside' : 'low-upside';
    
    row.innerHTML = `
      <td><strong>${stock.ticker}</strong></td>
      <td>${stock.name}</td>
      <td><span class="sector-badge">${stock.sector}</span></td>
      <td>$${stock.price}</td>
      <td>$${stock.target}</td>
      <td class="${upsideClass}">
        ${stock.upside > 0 ? '+' : ''}${stock.upside}%
      </td>
      <td>${stock.pe}</td>
      <td>${stock.roe}%</td>
      <td>
        <button class="btn-detail" onclick="showDetail('${stock.ticker}')">
          Ver detalle
        </button>
      </td>
    `;
    
    tbody.appendChild(row);
  });
}

function renderTopPicks() {
  const container = document.getElementById('top-picks');
  const topStocks = stocksData.filter(s => s.topPick).slice(0, 10);
  
  topStocks.forEach(stock => {
    const card = document.createElement('div');
    card.className = 'top-pick-card';
    
    card.innerHTML = `
      <div class="pick-header">
        <div class="pick-ticker">${stock.ticker}</div>
        <div class="pick-weight">${stock.weight}%</div>
      </div>
      <div class="pick-name">${stock.name}</div>
      <div class="pick-thesis">${stock.thesis}</div>
      <div class="pick-metrics">
        <span>P: $${stock.price}</span>
        <span>T: $${stock.target}</span>
        <span class="positive">+${stock.upside}%</span>
      </div>
    `;
    
    container.appendChild(card);
  });
}

function setupFilters() {
  const filters = {
    sector: document.getElementById('filter-sector'),
    upside: document.getElementById('filter-upside'),
    mcap: document.getElementById('filter-mcap'),
    search: document.getElementById('filter-search')
  };

  Object.values(filters).forEach(filter => {
    filter.addEventListener('change', applyFilters);
    filter.addEventListener('input', applyFilters);
  });

  function applyFilters() {
    let filtered = [...stocksData];

    // Filtro por sector
    if (filters.sector.value) {
      filtered = filtered.filter(s => s.sector === filters.sector.value);
    }

    // Filtro por upside
    const minUpside = parseFloat(filters.upside.value) || 0;
    filtered = filtered.filter(s => s.upside >= minUpside);

    // Filtro por market cap
    if (filters.mcap.value) {
      filtered = filtered.filter(s => s.mcapCategory === filters.mcap.value);
    }

    // Filtro por búsqueda
    const search = filters.search.value.toLowerCase();
    if (search) {
      filtered = filtered.filter(s => 
        s.ticker.toLowerCase().includes(search) ||
        s.name.toLowerCase().includes(search)
      );
    }

    renderStocksTable(filtered);
  }
}

function showDetail(ticker) {
  const stock = stocksData.find(s => s.ticker === ticker);
  if (stock) {
    alert(`
${stock.ticker} - ${stock.name}

TESIS:
${stock.thesis}

FUNDAMENTALS:
• Precio: $${stock.price}
• Target: $${stock.target} (+${stock.upside}%)
• P/E: ${stock.pe}
• ROE: ${stock.roe}%
• EV/EBITDA: ${stock.evEbitda}

RIESGOS:
${stock.risks}
    `);
  }
}
