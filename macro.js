// Cargar datos macro
fetch('data/macro-outlook.json')
  .then(response => response.json())
  .then(data => {
    // Actualizar fecha
    document.getElementById('last-update').textContent = 
      `Última actualización: ${new Date(data.lastUpdate).toLocaleDateString('es-AR')}`;

    // Cargar escenarios USA
    const scenariosContainer = document.getElementById('scenarios-us');
    data.scenariosUS.forEach(scenario => {
      const card = document.createElement('div');
      card.className = `scenario-card ${scenario.type}`;
      
      const bullets = scenario.points.map(p => `<li>${p}</li>`).join('');
      
      card.innerHTML = `
        <h3>${scenario.name} (${scenario.probability})</h3>
        <ul>${bullets}</ul>
      `;
      
      scenariosContainer.appendChild(card);
    });
  })
  .catch(error => console.error('Error:', error));
