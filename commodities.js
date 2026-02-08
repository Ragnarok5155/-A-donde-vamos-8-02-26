let commoditiesData = [];

fetch('data/commodities.json')
  .then(response => response.json())
  .then(data => {
    commoditiesData = data.commodities;
    
    document.getElementById('last-update').textContent = 
      `Última actualización: ${new Date(data.lastUpdate).toLocaleDateString('es-AR')}`;

    renderCommoditiesTable();
    renderCategoryGrids();
  })
  .catch(error => console.error('Error:', error));

function renderCommoditiesTable() {
  const tbody = document.getElementById('commodities-tbody');
  tbody.innerHTML = '';
  
  // Ordenar por 12M performance
  const sorted = [...commoditiesData].sort((a, b) => b.perf12M - a.perf12M);
  
  sorted.forEach(comm => {
    const row = document.createElement('tr');
    
    const scoreClass = comm.score >= 8 ? 'high' : comm.score >= 6 ? 'mid' : 'low';
    
    row.innerHTML = `
      <td><strong>${comm.name}</strong></td>
      <td>${comm.price}${comm.unit}</td>
      <td class="${comm.perfYTD >= 0 ? 'positive' : 'negative'}">
        ${comm.perfYTD > 0 ? '+' : ''}${comm.perfYTD}%
      </td>
      <td class="${comm.perf12M >= 0 ? 'positive' : 'negative'}">
        ${comm.perf12M > 0 ? '+' : ''}${comm.perf12M}%
      </td>
      <td><span class="category-badge ${comm.category}">${comm.category}</span></td>
      <td><span class="score-badge ${scoreClass}">${comm.score}/10</span></td>
    `;
    
    tbody.appendChild(row);
  });
}

function renderCategoryGrids() {
  const categories = {
    'metals': document.getElementById('metals-grid'),
    'energy': document.getElementById('energy-grid'),
    'agriculture': document.getElementById('agriculture-grid')
  };
  
  Object.keys(categories).forEach(cat => {
    const container = categories[cat];
    const items = commoditiesData.filter(c => c.category === cat);
    
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'commodity-card';
      
      card.innerHTML = `
        <div class="comm-header">
          <h3>${item.name}</h3>
          <div class="comm-perf ${item.perf12M >= 0 ? 'positive' : 'negative'}">
            ${item.perf12M > 0 ? '+' : ''}${item.perf12M}%
          </div>
        </div>
        <div class="comm-price">${item.price}${item.unit}</div>
        <div class="comm-note">${item.note}</div>
      `;
      
      container.appendChild(card);
    });
  });
}
