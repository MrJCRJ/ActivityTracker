// Função para obter atividades do localStorage
function getActivitiesFromStorage() {
  const storedActivities = localStorage.getItem('activities');
  return storedActivities ? JSON.parse(storedActivities) : [];
}

// Função para calcular a duração de uma atividade em horas
function calculateDuration(activity) {
  const start = new Date(`${activity.date}T${activity.start}`);
  const end = new Date(`${activity.date}T${activity.end}`);
  return (end - start) / 1000 / 60 / 60; // Retorna a duração em horas
}

// Função para formatar a duração em horas e minutos
function formatDuration(durationInHours) {
  const hours = Math.floor(durationInHours);
  const minutes = Math.round((durationInHours - hours) * 60);
  return `${hours}h ${minutes}m`;
}

// Função para calcular estatísticas por atividade
function calculateActivityStats(filteredActivities) {
  return filteredActivities.reduce((acc, activity) => {
    const duration = calculateDuration(activity);
    if (!acc[activity.name]) {
      acc[activity.name] = 0;
    }
    acc[activity.name] += duration;
    return acc;
  }, {});
}

// Função para filtrar atividades por data
function filterActivitiesByDate() {
  const startDateInput = document.getElementById('start-date').value;
  const endDateInput = document.getElementById('end-date').value;

  if (!startDateInput || !endDateInput) {
    renderStatistics(getActivitiesFromStorage());
    return;
  }

  // Converter as datas para objetos Date
  const startDate = new Date(startDateInput);
  const endDate = new Date(endDateInput);

  // Ajustar endDate para incluir todo o dia (23:59:59)
  endDate.setHours(23, 59, 59, 999);

  // Buscar atividades do localStorage
  const activities = getActivitiesFromStorage();

  // Filtrar as atividades dentro do intervalo
  const filteredActivities = activities.filter(activity => {
    const activityDate = new Date(activity.date);
    return activityDate >= startDate && activityDate <= endDate;
  });

  // Renderizar estatísticas das atividades filtradas
  renderStatistics(filteredActivities);
}

// Função para renderizar estatísticas por atividade
function renderStatistics(filteredActivities) {
  const activityStats = calculateActivityStats(filteredActivities);
  const statsContainer = document.getElementById('statistics');

  if (Object.keys(activityStats).length === 0) {
    statsContainer.innerHTML = "<p>Nenhuma atividade encontrada nesse período.</p>";
    return;
  }

  statsContainer.innerHTML = `
    <h4>Estatísticas por Atividade:</h4>
    <ul>
      ${Object.entries(activityStats).map(([activityName, totalTime]) => `
        <li><strong>${activityName}:</strong> ${formatDuration(totalTime)}</li>
      `).join('')}
    </ul>
  `;
}

// Carregar e renderizar atividades do localStorage ao iniciar
window.onload = () => {
  renderStatistics(getActivitiesFromStorage());
};
