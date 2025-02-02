document.addEventListener('DOMContentLoaded', () => {
  loadActivities();
  renderStatistics(); // Carrega as estatísticas ao carregar a página
});
document.getElementById('saveActivity').addEventListener('click', saveActivity);
document.getElementById('filterActivity').addEventListener('input', filterActivities);

function saveActivity() {
  const activityName = document.getElementById('activitySelect').value;
  const activityDate = document.getElementById('activityDate').value;
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;

  if (!activityName || !activityDate || !startTime || !endTime) {
    alert('Preencha todos os campos!');
    return;
  }

  const newActivity = {
    id: Date.now(),
    name: activityName,
    date: activityDate,
    start: startTime,
    end: endTime
  };

  const activities = JSON.parse(localStorage.getItem('activities')) || [];
  activities.push(newActivity);
  localStorage.setItem('activities', JSON.stringify(activities));

  addActivityToDOM(newActivity);
  renderStatistics(); // Atualizar as estatísticas após adicionar atividade
}

function loadActivities() {
  const activities = JSON.parse(localStorage.getItem('activities')) || [];
  activities.sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordena por data (do mais recente)
  activities.forEach(addActivityToDOM);
}

function addActivityToDOM(activity) {
  const activityLog = document.getElementById('activityLog');

  const listItem = document.createElement('li');
  listItem.classList.add('activity-item');
  listItem.innerHTML = `
    <strong>${activity.name}</strong> - ${activity.date} | Início: ${activity.start} | Fim: ${activity.end}
    <button class="delete-button">Excluir</button>
  `;

  const deleteButton = listItem.querySelector('.delete-button');
  deleteButton.addEventListener('click', () => deleteActivity(activity.id, listItem));

  activityLog.appendChild(listItem);
}

function deleteActivity(id, listItem) {
  let activities = JSON.parse(localStorage.getItem('activities')) || [];
  activities = activities.filter(activity => activity.id !== id);
  localStorage.setItem('activities', JSON.stringify(activities));

  listItem.remove();
  renderStatistics(); // Atualizar as estatísticas após excluir atividade
}

function filterActivities() {
  const filterText = document.getElementById('filterActivity').value.toLowerCase();
  const activities = JSON.parse(localStorage.getItem('activities')) || [];

  // Filtra as atividades com base no texto do filtro
  const filteredActivities = activities.filter(activity => {
    return activity.name.toLowerCase().includes(filterText) ||
      activity.date.includes(filterText);
  });

  // Atualiza o DOM com as atividades filtradas
  const activityItems = document.querySelectorAll('.activity-item');
  activityItems.forEach(item => {
    const text = item.textContent.toLowerCase();
    if (text.includes(filterText)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });

  // Atualiza as estatísticas para as atividades filtradas
  renderStatistics(filteredActivities);
}

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

  const statsContainer = document.getElementById('statistics');
  statsContainer.innerHTML = `
    <h3>Estatísticas</h3>
    <p><strong>Total de Atividades:</strong> ${totalActivities}</p>
    <p><strong>Total de Horas Realizadas:</strong> ${totalHours.toFixed(2)} horas</p>
    <p><strong>Média de Duração das Atividades:</strong> ${averageDuration.toFixed(2)} horas</p>
    <p><strong>Atividade com Maior Duração:</strong> ${maxDurationActivity.name} - ${maxDurationActivity.date} | Início: ${maxDurationActivity.start} | Fim: ${maxDurationActivity.end}</p>
    <p><strong>Atividade com Menor Duração:</strong> ${minDurationActivity.name} - ${minDurationActivity.date} | Início: ${minDurationActivity.start} | Fim: ${minDurationActivity.end}</p>
    <h4>Estatísticas por Atividade:</h4>
    <ul>
      ${Object.entries(activityStats).map(([activityName, totalTime]) => `
        <li><strong>${activityName}:</strong> ${totalTime.toFixed(2)} horas</li>
      `).join('')}
    </ul>
  `;
}