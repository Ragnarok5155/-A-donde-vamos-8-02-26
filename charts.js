// charts.js - Librería centralizada para crear gráficos

const ChartBuilder = {
  // Tema oscuro por defecto
  defaultOptions: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#9ca3af',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#e5e7eb',
        bodyColor: '#9ca3af',
        borderColor: '#374151',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: '#374151',
          drawBorder: false
        },
        ticks: {
          color: '#9ca3af'
        }
      },
      y: {
        grid: {
          color: '#374151',
          drawBorder: false
        },
        ticks: {
          color: '#9ca3af'
        }
      }
    }
  },

  // Crear gráfico de línea
  createLineChart(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const mergedOptions = this.mergeOptions(options);

    return new Chart(ctx, {
      type: 'line',
      data: data,
      options: mergedOptions
    });
  },

  // Crear gráfico de barras
  createBarChart(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const mergedOptions = this.mergeOptions(options);

    return new Chart(ctx, {
      type: 'bar',
      data: data,
      options: mergedOptions
    });
  },

  // Crear gráfico de área
  createAreaChart(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    // Configurar fill para área
    data.datasets.forEach(dataset => {
      dataset.fill = true;
      dataset.backgroundColor = dataset.backgroundColor || 'rgba(59, 130, 246, 0.1)';
    });

    const mergedOptions = this.mergeOptions(options);

    return new Chart(ctx, {
      type: 'line',
      data: data,
      options: mergedOptions
    });
  },

  // Merge de opciones
  mergeOptions(customOptions) {
    return {
      ...this.defaultOptions,
      ...customOptions,
      plugins: {
        ...this.defaultOptions.plugins,
        ...customOptions.plugins
      },
      scales: customOptions.scales || this.defaultOptions.scales
    };
  }
};
