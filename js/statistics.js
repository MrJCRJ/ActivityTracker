function renderStatistics(activities) {
  const totalActivities = activities.length;
  const totalHours = activities.reduce((sum, activity) => {
    const start = new Date(`${activity.date}T${activity.start}`);
    const end = new Date(`${activity.date}T${activity.end}`);
    const duration = (end - start) / 1000 / 60 / 60; // em horas
    return sum + duration;
  }, 0);

  const averageDuration = totalActivities > 0 ? totalHours / totalActivities : 0;

  let maxDurationActivity = activities[0];
  let minDurationActivity = activities[0];

  activities.forEach(activity => {
    const start = new Date(`${activity.date}T${activity.start}`);
    const end = new Date(`${activity.date}T${activity.end}`);
    const duration = (end - start) / 1000 / 60 / 60; // em horas

    if (duration > (new Date(`${maxDurationActivity.date}T${maxDurationActivity.start}`) - new Date(`${maxDurationActivity.date}T${maxDurationActivity.end}`)) / 1000 / 60 / 60) {
      maxDurationActivity = activity;
    }

    if (duration < (new Date(`${minDurationActivity.date}T${minDurationActivity.start}`) - new Date(`${minDurationActivity.date}T${minDurationActivity.end}`)) / 1000 / 60 / 60) {
      minDurationActivity = activity;
    }
  });

  const activityStats = activities.reduce((acc, activity) => {
    const start = new Date(`${activity.date}T${activity.start}`);
    const end = new Date(`${activity.date}T${activity.end}`);
    const duration = (end - start) / 1000 / 60 / 60; // em horas

    if (!acc[activity.name]) {
      acc[activity.name] = 0;
    }
    acc[activity.name] += duration;

    return acc;
  }, {});

  const formatDuration = (durationInHours) => {
    const hours = Math.floor(durationInHours);
    const minutes = Math.round((durationInHours - hours) * 60);
    return `${hours}h ${minutes}m`;
  };

  const statsContainer = document.getElementById('statistics');
  statsContainer.innerHTML = `
    <h3>Estatísticas</h3>
    <p><strong>Total de Atividades:</strong> ${totalActivities}</p>
    <p><strong>Total de Horas Realizadas:</strong> ${formatDuration(totalHours)}</p>
    <p><strong>Média de Duração das Atividades:</strong> ${formatDuration(averageDuration)}</p>
    <p><strong>Atividade com Maior Duração:</strong> ${maxDurationActivity.name} - ${maxDurationActivity.date} | Início: ${maxDurationActivity.start} | Fim: ${maxDurationActivity.end} | Duração: ${formatDuration((new Date(`${maxDurationActivity.date}T${maxDurationActivity.end}`) - new Date(`${maxDurationActivity.date}T${maxDurationActivity.start}`)) / 1000 / 60 / 60)}</p>
    <p><strong>Atividade com Menor Duração:</strong> ${minDurationActivity.name} - ${minDurationActivity.date} | Início: ${minDurationActivity.start} | Fim: ${minDurationActivity.end} | Duração: ${formatDuration((new Date(`${minDurationActivity.date}T${minDurationActivity.end}`) - new Date(`${minDurationActivity.date}T${minDurationActivity.start}`)) / 1000 / 60 / 60)}</p>
    <h4>Estatísticas por Atividade:</h4>
    <ul>
      ${Object.entries(activityStats).map(([activityName, totalTime]) => `
        <li><strong>${activityName}:</strong> ${formatDuration(totalTime)}</li>
      `).join('')}
    </ul>
  `;
}
