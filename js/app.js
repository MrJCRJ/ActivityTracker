document.addEventListener('DOMContentLoaded', () => {
  loadActivities();
  const activities = JSON.parse(localStorage.getItem('activities')) || [];
  renderStatistics(activities); // Atualiza as estatísticas ao carregar a página
});

document.getElementById('saveActivity').addEventListener('click', saveActivity);
document.getElementById('filterActivity').addEventListener('input', filterActivities);
