fetch('data/crypto.json')
  .then(response => response.json())
  .then(data => {
    document.getElementById('last-update').textContent = 
      `Última actualización: ${new Date(data.lastUpdate).toLocaleDateString('es-AR')}`;
  })
  .catch(error => console.error('Error:', error));
