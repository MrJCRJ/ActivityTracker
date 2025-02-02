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

// Função para calcular as estatísticas gerais
function calculateGeneralStatistics(activities) {
  const totalActivities = activities.length;
  const totalHours = activities.reduce((sum, activity) => sum + calculateDuration(activity), 0);
  const averageDuration = totalActivities > 0 ? totalHours / totalActivities : 0;

  // Encontrar atividade com maior e menor duração
  let maxDurationActivity = activities[0];
  let minDurationActivity = activities[0];

  activities.forEach(activity => {
    const duration = calculateDuration(activity);
    const maxDuration = calculateDuration(maxDurationActivity);
    const minDuration = calculateDuration(minDurationActivity);

    if (duration > maxDuration) {
      maxDurationActivity = activity;
    }

    if (duration < minDuration) {
      minDurationActivity = activity;
    }
  });

  return {
    totalActivities,
    totalHours,
    averageDuration,
    maxDurationActivity,
    minDurationActivity,
  };
}

// Função para calcular as estatísticas de cada atividade
function calculateActivityStats(activities) {
  return activities.reduce((acc, activity) => {
    const duration = calculateDuration(activity);
    if (!acc[activity.name]) {
      acc[activity.name] = 0;
    }
    acc[activity.name] += duration;
    return acc;
  }, {});
}

// Função para renderizar as estatísticas na tela
function renderStatistics(activities) {
  // Calcular as estatísticas gerais
  const { totalActivities, totalHours, averageDuration, maxDurationActivity, minDurationActivity } = calculateGeneralStatistics(activities);

  // Calcular as estatísticas por atividade
  const activityStats = calculateActivityStats(activities);

  // Atualizar o conteúdo da página com as estatísticas
  const statsContainer = document.getElementById('statistics');
  statsContainer.innerHTML = `
    <h3>Estatísticas</h3>
    <p><strong>Total de Atividades:</strong> ${totalActivities}</p>
    <p><strong>Total de Horas Realizadas:</strong> ${formatDuration(totalHours)}</p>
    <p><strong>Média de Duração das Atividades:</strong> ${formatDuration(averageDuration)}</p>
    <p><strong>Atividade com Maior Duração:</strong> ${maxDurationActivity.name} - ${maxDurationActivity.date} | Início: ${maxDurationActivity.start} | Fim: ${maxDurationActivity.end} | Duração: ${formatDuration(calculateDuration(maxDurationActivity))}</p>
    <p><strong>Atividade com Menor Duração:</strong> ${minDurationActivity.name} - ${minDurationActivity.date} | Início: ${minDurationActivity.start} | Fim: ${minDurationActivity.end} | Duração: ${formatDuration(calculateDuration(minDurationActivity))}</p>
    <h4>Estatísticas por Atividade:</h4>
    <ul>
      ${Object.entries(activityStats).map(([activityName, totalTime]) => `
        <li><strong>${activityName}:</strong> ${formatDuration(totalTime)}</li>
      `).join('')}
    </ul>
  `;
}
